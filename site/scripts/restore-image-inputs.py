"""Portable, dependency-free image input verifier. Canonical source: ozirix-dev/Windows."""
from __future__ import annotations

import argparse
from concurrent.futures import ThreadPoolExecutor
import datetime as dt
import hashlib
import hmac
import json
import os
from pathlib import Path
import re
import stat
import tempfile
import urllib.parse
import urllib.request
import zipfile


def path_key(value):
    if not isinstance(value, str) or not value or '\\' in value or ':' in value or any(p in ('', '.', '..') or p.rstrip(' .') != p or p.upper().split('.')[0] in {'CON', 'PRN', 'AUX', 'NUL', *(f'COM{i}' for i in range(1, 10)), *(f'LPT{i}' for i in range(1, 10))} for p in value.split('/')):
        raise ValueError('Unsafe image input path')
    return value


def no_links(p):
    if any(x.is_symlink() or getattr(x, 'is_junction', lambda: False)() for x in [p, *p.parents]):
        raise ValueError('Image input path contains a link or junction')


def digest(p):
    h = hashlib.sha256()
    with p.open('rb') as f:
        for part in iter(lambda: f.read(1024 * 1024), b''): h.update(part)
    return h.hexdigest()


def inputs(manifest_path, intended):
    m = json.loads(manifest_path.read_text(encoding='utf-8-sig'))
    if m.get('schemaVersion') != 1 or m.get('repository', '').lower() != intended.lower() or not isinstance(m.get('files'), list):
        raise ValueError('Image manifest repository/schema mismatch')
    files = {}
    seen = set()
    for f in m['files']:
        key = path_key(f['path'])
        if key.casefold() in seen or f.get('approved') is not True or type(f.get('build')) is not bool or type(f.get('bytes')) is not int or f['bytes'] < 1 or not re.fullmatch('[0-9a-f]{64}', f.get('sha256', '')):
            raise ValueError('Invalid or duplicate approved image input')
        seen.add(key.casefold())
        if f['build']: files[key] = f
    return m, files


def verify_root(root, files):
    no_links(root)
    for key, f in files.items():
        p = root / key
        no_links(p)
        if not p.is_file() or p.stat().st_size != f['bytes'] or digest(p) != f['sha256']:
            raise ValueError('Missing or changed image input: ' + key)


def s3_request(method, endpoint, bucket, key, body=None, at=None):
    """R2 S3 signing; credentials stay in this process and are never returned."""
    parsed = urllib.parse.urlsplit(endpoint)
    if parsed.scheme != 'https' or not re.fullmatch(r'[0-9a-f]{32}\.r2\.cloudflarestorage\.com', parsed.netloc) or parsed.path not in ('', '/') or parsed.query or parsed.fragment:
        raise ValueError('Expected an HTTPS Cloudflare R2 S3 endpoint')
    if not re.fullmatch('image-ci-[0-9]+', bucket):
        raise ValueError('Only a dedicated image-ci repository bucket is allowed')
    key = path_key(key)
    if not key.startswith('inputs/'):
        raise ValueError('CI inputs must use the inputs prefix')
    access = os.environ.get('IMAGE_CI_ACCESS_KEY_ID')
    secret = os.environ.get('IMAGE_CI_SECRET_ACCESS_KEY')
    if not access or not secret:
        raise ValueError('IMAGE_CI_ACCESS_KEY_ID and IMAGE_CI_SECRET_ACCESS_KEY are required')
    current = at or dt.datetime.now(dt.timezone.utc)
    date = current.strftime('%Y%m%d')
    stamp = current.strftime('%Y%m%dT%H%M%SZ')
    uri = '/' + bucket + '/' + urllib.parse.quote(key, safe='/')
    payload_hash = hashlib.sha256(body or b'').hexdigest()
    headers = {'host': parsed.netloc, 'x-amz-content-sha256': payload_hash, 'x-amz-date': stamp}
    if os.environ.get('IMAGE_CI_SESSION_TOKEN'): headers['x-amz-security-token'] = os.environ['IMAGE_CI_SESSION_TOKEN']
    if method == 'PUT': headers['if-none-match'] = '*'
    names = ';'.join(sorted(headers))
    canonical_headers = ''.join(k + ':' + headers[k].strip() + '\n' for k in sorted(headers))
    canonical = '\n'.join([method, uri, '', canonical_headers, names, payload_hash])
    scope = date + '/auto/s3/aws4_request'
    message = '\n'.join(['AWS4-HMAC-SHA256', stamp, scope, hashlib.sha256(canonical.encode()).hexdigest()])
    signing = ('AWS4' + secret).encode()
    for part in [date, 'auto', 's3', 'aws4_request']: signing = hmac.new(signing, part.encode(), hashlib.sha256).digest()
    signature = hmac.new(signing, message.encode(), hashlib.sha256).hexdigest()
    headers['Authorization'] = f'AWS4-HMAC-SHA256 Credential={access}/{scope}, SignedHeaders={names}, Signature={signature}'
    return urllib.request.Request(endpoint.rstrip('/') + uri, method=method, headers=headers, data=body)


def restore(bundle, bundle_sha, output, files):
    no_links(bundle)
    no_links(output)
    if not re.fullmatch('[0-9a-f]{64}', bundle_sha) or digest(bundle) != bundle_sha:
        raise ValueError('CI bundle SHA-256 mismatch')
    if output.exists():
        raise ValueError('A new, empty output path is required')
    with zipfile.ZipFile(bundle) as z:
        entries = z.infolist()
        names = [path_key(x.filename) for x in entries]
        if len(set(n.casefold() for n in names)) != len(names) or set(names) != set(files):
            raise ValueError('CI bundle file set differs from manifest')
        for entry in entries:
            if entry.file_size != files[entry.filename]['bytes'] or stat.S_ISLNK(entry.external_attr >> 16) or entry.is_dir():
                raise ValueError('Invalid CI image bundle entry')
        output.mkdir(parents=True)
        for entry in entries:
            f = files[entry.filename]
            target = output / entry.filename
            target.parent.mkdir(parents=True, exist_ok=True)
            h = hashlib.sha256()
            count = 0
            with z.open(entry) as source, target.open('xb') as dest:
                for part in iter(lambda: source.read(1024 * 1024), b''):
                    count += len(part)
                    if count > f['bytes']: raise ValueError('Image input exceeds manifest size')
                    h.update(part)
                    dest.write(part)
            if count != f['bytes'] or h.hexdigest() != f['sha256']:
                raise ValueError('Restored CI image hash mismatch: ' + entry.filename)
    verify_root(output, files)
    return output


class NoPublicRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise ValueError('Public image redirects are not allowed')


def restore_public(m, files, output):
    """Only already-published production sources; never use private credentials."""
    prefix = m.get('ci', {}).get('publicFallback', {}).get('urlPrefix', '')
    if m.get('repository', '').lower() != 'ozirix-dev/reseptit' or not re.fullmatch(
        r'https://[0-9a-f]{8}\.recipavo-site\.pages\.dev/kuvat/', prefix
    ):
        raise ValueError('Expected a pinned Recipavo public deployment')
    for key, f in files.items():
        path_key(key)
        if f.get('role') != 'production-source':
            raise ValueError('Only published production sources may use public restoration')
    no_links(output)
    if output.exists(): raise ValueError('A new, empty output path is required')
    output.mkdir(parents=True)
    def download(item):
        key, f = item
        destination = output / key
        destination.parent.mkdir(parents=True, exist_ok=True)
        request = urllib.request.Request(prefix + urllib.parse.quote(key, safe='/'),
            headers={'User-Agent': 'Recipavo-CI-ImageRestore/1.0'})
        # No bearer tokens, S3 signer, cookies or redirects in this path.
        opener = urllib.request.build_opener(NoPublicRedirect())
        try:
            size = 0
            h = hashlib.sha256()
            with opener.open(request, timeout=30) as response, destination.open('xb') as target:
                if response.status != 200: raise ValueError('Unexpected public response')
                for part in iter(lambda: response.read(1024 * 1024), b''):
                    size += len(part)
                    if size > f['bytes']: raise ValueError('Public image exceeds manifest size')
                    h.update(part)
                    target.write(part)
            if size != f['bytes'] or h.hexdigest() != f['sha256']:
                raise ValueError('Public image hash mismatch')
        except Exception:
            raise ValueError('Published image unavailable or changed; an owner build is required: ' + key) from None
    with ThreadPoolExecutor(max_workers=4) as pool:
        list(pool.map(download, files.items()))
    verify_root(output, files)
    return output


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--manifest', type=Path, required=True)
    p.add_argument('--project', required=True)
    group = p.add_mutually_exclusive_group()
    group.add_argument('--bundle', type=Path)
    group.add_argument('--verify-root', type=Path)
    group.add_argument('--auto-root', type=Path)
    p.add_argument('--bundle-sha256')
    p.add_argument('--output', type=Path)
    p.add_argument('--github-env', action='store_true')
    args = p.parse_args()
    m, files = inputs(args.manifest, args.project)
    tracked = bool(args.auto_root and m.get('ci', {}).get('mode') == 'tracked')
    if args.verify_root or tracked:
        root = args.verify_root or Path(os.environ.get('PROJECT_IMAGE_ROOT') or args.auto_root)
        verify_root(root, files)
        result = root.resolve()
    elif args.bundle:
        if not args.output or not args.bundle_sha256: p.error('--bundle requires --output and --bundle-sha256')
        result = restore(args.bundle, args.bundle_sha256, args.output, files).resolve()
    else:
        ci = m.get('ci', {})
        if m.get('migrationBlocked'): raise ValueError('Image version conflicts block CI migration')
        if ci.get('mode') not in ('r2', 'public'):
            raise ValueError('Image transport is not enabled; use verified tracked inputs')
        scratch = Path(tempfile.mkdtemp(prefix='image-inputs-', dir=os.environ.get('RUNNER_TEMP')))
        if ci['mode'] == 'public':
            result = restore_public(m, files, scratch / 'images').resolve()
        else:
            expected = ci['bundleSha256']
            package = scratch / 'inputs.zip'
            request = s3_request('GET', ci['endpoint'], ci['bucket'], ci['key'])
            try:
                with urllib.request.urlopen(request, timeout=60) as response, package.open('xb') as dest:
                    for part in iter(lambda: response.read(1024 * 1024), b''): dest.write(part)
            except Exception:
                raise RuntimeError('Private CI input download failed; no credentials are logged') from None
            result = restore(package, expected, scratch / 'images', files).resolve()
    if args.github_env and (not tracked or os.environ.get('PROJECT_IMAGE_ROOT')):
        if not os.environ.get('GITHUB_ENV'): raise ValueError('GITHUB_ENV is not available')
        if '\n' in str(result) or '\r' in str(result): raise ValueError('Invalid image root for GITHUB_ENV')
        with open(os.environ['GITHUB_ENV'], 'a', encoding='utf-8') as f: f.write('PROJECT_IMAGE_ROOT=' + str(result) + '\n')
    print(json.dumps({'status': 'PASS', 'repository': args.project, 'files': len(files), 'imageRoot': str(result)}))


if __name__ == '__main__':
    try: main()
    except Exception as error:
        print(json.dumps({'status': 'FAIL', 'error': str(error)}))
        raise SystemExit(1)

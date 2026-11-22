"""Fail-closed verified tracked WebP overlays on a separately verified R2 image root.

The authoritative private R2 archive and its 396 SHA-256 records remain untouched.
Only explicit, separately pinned, Git-tracked WebP files may be added after it has
been verified. Canonical R2 restore code in the Windows repo is not modified.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import re


def safe_path(raw: object) -> str:
    if not isinstance(raw, str) or not re.fullmatch(r"[a-z0-9][a-z0-9_/-]*\.webp", raw):
        raise ValueError("Overlay path must be a relative lowercase WebP path")
    if any(part in ("", ".", "..") or part.rstrip(" .") != part for part in raw.split("/")):
        raise ValueError("Unsafe overlay path")
    return raw


def no_links(path: Path) -> None:
    if any(part.is_symlink() or getattr(part, "is_junction", lambda: False)() for part in (path, *path.parents)):
        raise ValueError("Overlay path contains a symlink or junction")


def validated_entries(manifest: Path) -> list[dict]:
    no_links(manifest)
    data = json.loads(manifest.read_text(encoding="utf-8-sig"))
    if (data.get("schema_version") != 1 or data.get("repository") != "ozirix-dev/Reseptit"
            or not isinstance(data.get("files"), list) or not data["files"]):
        raise ValueError("Wrong image overlay manifest schema or repository")
    result = []
    seen = set()
    for item in data["files"]:
        if not isinstance(item, dict) or set(item) != {"path", "bytes", "sha256", "source", "approved"}:
            raise ValueError("Invalid image overlay entry")
        rel = safe_path(item["path"])
        if rel.casefold() in seen:
            raise ValueError("Duplicate image overlay path")
        seen.add(rel.casefold())
        if (item["source"] != "git-tracked" or item["approved"] is not True
                or type(item["bytes"]) is not int or not 100 < item["bytes"] <= 8 * 1024 * 1024
                or not re.fullmatch(r"[0-9a-f]{64}", str(item["sha256"]))):
            raise ValueError("Unapproved or unpinned image overlay")
        result.append(item)
    return result


def verify_file(file: Path, item: dict) -> None:
    no_links(file)
    if not file.is_file() or file.stat().st_size != item["bytes"]:
        raise ValueError("Image overlay size or file missing: " + item["path"])
    h = hashlib.sha256()
    with file.open("rb") as src:
        header = src.read(12)
        if (len(header) != 12 or header[:4] != b"RIFF" or header[8:] != b"WEBP"
                or int.from_bytes(header[4:8], "little") != item["bytes"] - 8):
            raise ValueError("Image overlay is not complete RIFF WebP: " + item["path"])
        src.seek(0)
        for chunk in iter(lambda: src.read(1024 * 1024), b""):
            h.update(chunk)
    if h.hexdigest() != item["sha256"]:
        raise ValueError("Image overlay SHA-256 mismatch: " + item["path"])


def apply_overlays(manifest: Path, source_root: Path, image_root: Path, mode: str = "apply") -> int:
    """Verify source and optionally add it to an already verified image root.

    Never changes an existing image or the pinned R2 archive. For explicit roots,
    use verify mode to avoid mutating caller-owned files.
    """
    if mode not in ("apply", "verify"):
        raise ValueError("Invalid image overlay mode")
    no_links(source_root)
    no_links(image_root)
    if not source_root.is_dir() or not image_root.is_dir():
        raise ValueError("Both image roots must already exist")
    entries = validated_entries(manifest)
    # Compare resolved roots only after rejecting symlinks and junctions.
    same_root = source_root.resolve() == image_root.resolve()
    for item in entries:
        relative = safe_path(item["path"])
        source = source_root / relative
        dest = image_root / relative
        verify_file(source, item)
        no_links(dest)
        if dest.exists() or same_root:
            verify_file(dest, item)
            continue
        if mode == "verify":
            raise ValueError("Image overlay missing from caller-provided root: " + relative)
        dest.parent.mkdir(parents=True, exist_ok=True)
        no_links(dest.parent)
        # Exclusive creation prevents replacement/races. In a failed copy, remove
        # only the file created by this operation and preserve all R2 inputs.
        created = False
        try:
            with source.open("rb") as reader, dest.open("xb") as writer:
                created = True
                for chunk in iter(lambda: reader.read(1024 * 1024), b""):
                    writer.write(chunk)
            verify_file(dest, item)
        except Exception:
            if created:
                dest.unlink(missing_ok=True)
            raise
    return len(entries)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--source-root", type=Path, required=True)
    parser.add_argument("--image-root", type=Path, required=True)
    parser.add_argument("--mode", choices=("apply", "verify"), default="apply")
    args = parser.parse_args()
    count = apply_overlays(args.manifest, args.source_root, args.image_root, args.mode)
    print(json.dumps({"status": "PASS", "verifiedGitOverlays": count, "mode": args.mode}))


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(json.dumps({"status": "FAIL", "reason": str(exc)}))
        raise SystemExit(1)
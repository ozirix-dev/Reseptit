import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const secretNames = ['IMAGE_CI_ACCESS_KEY_ID', 'IMAGE_CI_SECRET_ACCESS_KEY', 'IMAGE_CI_SESSION_TOKEN'];
export function trackedInputsComplete(root, files) {
  return files.filter(file => file.build).every(file => existsSync(path.join(root, file.path)));
}
export function inputMode(env, trackedExists) {
  if (env.PROJECT_IMAGE_ROOT) return 'explicit';
  if (trackedExists) return 'tracked';
  const pair = Boolean(env.IMAGE_CI_ACCESS_KEY_ID && env.IMAGE_CI_SECRET_ACCESS_KEY);
  if (secretNames.some(name => Boolean(env[name])) && !pair) throw new Error('Both CI reader credentials are required; partial credentials cannot select a public fallback.');
  if (pair) return 'r2';
  if (env.CI || env.GITHUB_ACTIONS) throw new Error('CI must provide verified inputs or both scoped reader credentials.');
  return 'public';
}
export function buildEnvironment(env, imageRoot) {
  const child = { ...env, PROJECT_IMAGE_ROOT: imageRoot };
  for (const name of secretNames) delete child[name];
  return child;
}
export function productionBuild(env = process.env) {
  const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const repo = path.dirname(site);
  const manifestPath = path.join(repo, 'assets/images.manifest.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (manifest.repository !== 'ozirix-dev/Reseptit') throw new Error('Unexpected image manifest repository.');
  if (!env.npm_execpath || !existsSync(env.npm_execpath)) throw new Error('Invoke this build using npm run build:production.');
  const tracked = path.join(repo, 'kuvat');
  const mode = inputMode(env, trackedInputsComplete(tracked, manifest.files));
  let temporary = null;
  try {
    let selectedManifest = manifestPath;
    const restoreEnv = { ...env };
    const args = ['-B', path.join(site, 'scripts/restore-image-inputs.py'), '--manifest', manifestPath, '--project', 'ozirix-dev/Reseptit'];
    if (mode === 'explicit' || mode === 'tracked') args.push('--verify-root', mode === 'explicit' ? env.PROJECT_IMAGE_ROOT : tracked);
    else {
      temporary = mkdtempSync(path.join(os.tmpdir(), 'recipavo-build-inputs-'));
      restoreEnv.RUNNER_TEMP = temporary;
      if (mode === 'public') {
        manifest.ci.mode = 'public';
        selectedManifest = path.join(temporary, 'published-image-inputs.json');
        writeFileSync(selectedManifest, JSON.stringify(manifest));
        args[args.indexOf('--manifest') + 1] = selectedManifest;
      }
      args.push('--auto-root', tracked);
    }
    let restored;
    try {
      restored = JSON.parse(execFileSync(process.platform === 'win32' ? 'python' : 'python3', args, { env: restoreEnv, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }));
    } catch { throw new Error('Image input verification failed; the standalone restore-image-inputs adapter provides sanitized diagnostics.'); }
    if (restored.status !== 'PASS' || restored.files !== manifest.files.filter(file => file.build).length || typeof restored.imageRoot !== 'string' || !path.isAbsolute(restored.imageRoot) || /[\r\n]/.test(restored.imageRoot)) throw new Error('Image verifier returned an invalid result.');
    // SHA-pinned Git-tracked recipe WebP overlays are verified separately
    // after the existing private R2 (or public) source bundle passes.
    // Explicit/tracked source roots are only read, never mutated.
    const overlayArgs = [
      '-B', path.join(site, 'scripts/verified_image_overlay.py'),
      '--manifest', path.join(repo, 'assets/images.tracked-overlays.json'),
      '--source-root', tracked,
      '--image-root', restored.imageRoot,
      '--mode', (mode === 'explicit' || mode === 'tracked') ? 'verify' : 'apply',
    ];
    try {
      const output = JSON.parse(execFileSync(process.platform === 'win32' ? 'python' : 'python3',
        overlayArgs, { env: buildEnvironment(restoreEnv, restored.imageRoot), encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }));
      if (output.status !== 'PASS' || !Number.isInteger(output.verifiedGitOverlays) || output.verifiedGitOverlays < 1)
        throw new Error('Overlay verifier did not pass');
      console.log(`Verified ${output.verifiedGitOverlays} SHA-pinned Git image overlay(s).`);
    } catch {
      throw new Error('Tracked recipe image overlay verification failed; the original R2 archive was not altered.');
    }
    console.log(`Verified ${restored.files} production image inputs (mode=${mode}).`);
    // The build itself receives only the verified root, never the reader secret.
    const result = spawnSync(process.execPath, [env.npm_execpath, 'run', 'build'], { cwd: site, env: buildEnvironment(env, restored.imageRoot), stdio: 'inherit' });
    if (result.error || result.signal || result.status === null) throw new Error('Production build did not complete.');
    return result.status;
  } finally {
    if (temporary && existsSync(temporary)) {
      const resolved = realpathSync(temporary);
      if (path.dirname(resolved) !== realpathSync(os.tmpdir()) || !path.basename(resolved).startsWith('recipavo-build-inputs-')) throw new Error('Temporary image directory changed; retained for inspection.');
      rmSync(resolved, { recursive: true });
    }
  }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { process.exitCode = productionBuild(); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}

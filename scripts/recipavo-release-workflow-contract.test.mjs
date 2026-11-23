import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const file=new URL('../.github/workflows/recipavo-production-manual.yml',import.meta.url);
export function checkReleaseContract(yaml) {
  const must=(ok,reason)=>assert.ok(ok,'HOLD: '+reason);
  const find=(s)=>{
    const i=yaml.indexOf(s);
    must(i!==-1,'missing '+s);
    return i;
  };
  must(/^on:\r?\n  workflow_dispatch:/m.test(yaml),'manual trigger');
  must(!/^  (?:push|pull_request|pull_request_target|schedule|repository_dispatch|workflow_run|workflow_call):/m.test(yaml),'automatic trigger forbidden');
  must(/^permissions:\r?\n  contents: read\r?\n  actions: read\r?\n  deployments: read/m.test(yaml),'read-only token permissions');
  must(!/^\s*(?:contents|actions|deployments|id-token|issues|pull-requests): write\s*$/m.test(yaml),'write permission forbidden');
  must(yaml.includes('group: recipavo-production-release') && yaml.includes('cancel-in-progress: false'),'production concurrency');
  const gate=find('\n  gate:\n'), release=find('\n  release:\n');
  must(gate<release,'gate must precede release');
  const before=yaml.slice(gate,release),after=yaml.slice(release);
  must(!before.includes('secrets.') && !before.includes('wrangler') && !before.includes('pages deploy'),'gate must not deploy or access secrets');
  must(after.includes('needs: gate') && after.includes('name: recipavo-production'),'protected release job missing');
  must(before.includes('recipavo-actions-release-gate.mjs github "$RELEASE_SHA"'),'initial exact-SHA CI gate');
  must(after.includes('recipavo-actions-release-gate.mjs github-recheck "$RELEASE_SHA"'),'post-wait CI/environment recheck');
  const steps=[
    'recipavo-actions-release-gate.mjs github-recheck "$RELEASE_SHA"',
    'Verify Cloudflare project, branch, Direct Upload and feedback OFF',
    'Build production-only artifact with feedback UI disabled',
    'recipavo-actions-release-gate.mjs functions site',
    'recipavo-actions-release-gate.mjs stamp "$RELEASE_SHA" site/dist',
    'recipavo-actions-release-gate.mjs artifact "$RELEASE_SHA" site/dist',
    'Final main/CI and Cloudflare settings recheck immediately before upload',
    'recipavo-actions-release-gate.mjs live "$RELEASE_SHA"',
    'npx --yes wrangler@4.165.0 pages deploy dist',
    'npm run verify:production -- "$RELEASE_SHA" https://www.recipavo.com "$PWD/dist"'
  ];
  let last=-1;
  for(const step of steps){
    const i=after.indexOf(step);
    must(i>last,'missing or out-of-order release gate: '+step);
    last=i;
  }
  must(after.includes('--project-name recipavo-site --branch production --commit-hash "$RELEASE_SHA"'),'locked Wrangler production target');
  must(after.includes("if: steps.live.outputs.already_live != 'true'"),'prevent duplicate upload');
  const buildStage=after.slice(after.indexOf('Build production-only artifact with feedback UI disabled'),
    after.indexOf('recipavo-actions-release-gate.mjs functions site'));
  must(buildStage.includes('RECIPAVO_BUILD_TARGET: production'),'production build target');
  must(buildStage.includes("VITE_RECIPAVO_FEEDBACK_ENABLED: 'false'"),'feedback UI default OFF');
  must(buildStage.includes('unset RECIPAVO_PREVIEW_ORIGIN'),'no inherited preview in production build');
  must(after.includes('body.error !== "method_not_allowed"'),'Pages Function 405 verification');
  return true;
}
const original=(await readFile(file,'utf8')).replaceAll('\r\n','\n');
test('release workflow manual CI/env preflight and postflight contract',()=>{
  assert.equal(checkReleaseContract(original),true);
});
test('automatic triggers and write scopes are rejected',()=>{
  for(const altered of [
    original.replace('  workflow_dispatch:','  push:\n  workflow_dispatch:'),
    original.replace('  contents: read','  contents: write'),
    original.replace('cancel-in-progress: false','cancel-in-progress: true')
  ])assert.throws(()=>checkReleaseContract(altered),/HOLD/);
});
test('missing environment, CI check or premature secret use is rejected',()=>{
  for(const altered of [
    original.replace('needs: gate','needs: []'),
    original.replace('name: recipavo-production','name: staging'),
    original.replace('recipavo-actions-release-gate.mjs github "$RELEASE_SHA"','echo skip'),
    original.replace('\n  release:\n','\n      - run: echo secrets.CLOUDFLARE_API_TOKEN\n  release:\n')
  ])assert.throws(()=>checkReleaseContract(altered),/HOLD/);
});
test('missing or reordered pre-upload and post-upload gates are rejected',()=>{
  for(const marker of [
    'recipavo-actions-release-gate.mjs functions site',
    'recipavo-actions-release-gate.mjs artifact "$RELEASE_SHA" site/dist',
    'Final main/CI and Cloudflare settings recheck immediately before upload',
    'recipavo-actions-release-gate.mjs live "$RELEASE_SHA"',
    'npm run verify:production -- "$RELEASE_SHA" https://www.recipavo.com "$PWD/dist"'
  ])assert.throws(()=>checkReleaseContract(original.replace(marker,'echo skip')),/HOLD/);
});
test('no preview or wrong branch/hash, feedback or unconditional deploy',()=>{
  for(const altered of [
    original.replace('--branch production','--branch main'),
    original.replace('--commit-hash "$RELEASE_SHA"','--commit-hash main'),
    original.replace('RECIPAVO_BUILD_TARGET: production','RECIPAVO_BUILD_TARGET: preview'),
    original.replace("VITE_RECIPAVO_FEEDBACK_ENABLED: 'false'","VITE_RECIPAVO_FEEDBACK_ENABLED: 'true'"),
    original.replace("if: steps.live.outputs.already_live != 'true'","if: always()")
  ])assert.throws(()=>checkReleaseContract(altered),/HOLD/);
});

/** [Chat 1] Fail-closed gates for manually approved Recipavo production releases. */
import { readFile, writeFile, readdir, lstat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPOSITORY = 'ozirix-dev/Reseptit';
export const ENVIRONMENT = 'recipavo-production';
export const PROJECT = 'recipavo-site';
export const CONFIRMATION = 'RELEASE recipavo-site production';
const shaPattern = /^[a-f0-9]{40}$/;
const shaHeader = /^\s*X-Recipavo-Commit:[ \t]*([a-f0-9]{40})\s*$/gim;

export function must(condition,message) {
  if (!condition) throw new Error('HOLD: ' + message);
}
export function assertSha(sha) {
  must(typeof sha === 'string' && shaPattern.test(sha), 'A full lowercase 40-character Git SHA is required');
  return sha;
}
export function assertDispatch({repository,ref,workflowSha,inputSha,confirmation}) {
  assertSha(inputSha);
  must(repository === REPOSITORY, 'Incorrect GitHub repository');
  must(ref === 'refs/heads/main', 'Workflow must be dispatched on main');
  must(workflowSha === inputSha, 'Dispatch commit differs from approved SHA');
  must(confirmation === CONFIRMATION, 'Explicit release confirmation missing');
}
export function assertEnvironment(config, branchPolicies) {
  must(config && config.name === ENVIRONMENT, 'Expected existing GitHub production environment');
  const rules = config.protection_rules;
  must(Array.isArray(rules), 'Production protection rules unavailable');
  const timers = rules.filter(rule => rule.type === 'wait_timer');
  must(timers.length === 1 && timers[0].wait_timer === 10,
    'Production environment must enforce the 10-minute wait timer');
  const reviewerRules = rules.filter(rule => rule.type === 'required_reviewers');
  must(reviewerRules.length === 1 && Array.isArray(reviewerRules[0].reviewers) &&
       reviewerRules[0].reviewers.some(({type, reviewer}) =>
         (type === 'User' || type === 'Team') && Number.isInteger(reviewer?.id) && reviewer.id > 0),
    'Production environment must enforce approval by a configured GitHub reviewer');
  must(config.can_admins_bypass === false,
    'Administrators must not be allowed to bypass production protection rules');
  must(config.deployment_branch_policy?.custom_branch_policies === true &&
       config.deployment_branch_policy?.protected_branches === false,
    'Production environment must restrict deployment to a selected branch');
  must(branchPolicies?.total_count === 1 && Array.isArray(branchPolicies.branch_policies) &&
       branchPolicies.branch_policies.length === 1 &&
       branchPolicies.branch_policies[0]?.name === 'main',
    'Only the exact main branch may deploy to production');
  return {waitMinutes:10,branch:'main',adminBypass:false};
}
export function assertCiRuns(payload,inputSha) {
  const runs = payload?.workflow_runs;
  must(Array.isArray(runs), 'GitHub Recipe site CI runs are unavailable');
  const candidates = runs.filter(run =>
    run.head_sha === inputSha && run.head_branch === 'main' &&
    (run.event === 'push' || run.event === 'workflow_dispatch')
  ).sort((a,b) => (Number(b.id) || 0) - (Number(a.id) || 0));
  must(candidates.length > 0, 'No Recipe site main CI for this exact SHA');
  const latest = candidates[0];
  must(latest.status === 'completed' && latest.conclusion === 'success',
    'Latest Recipe site main CI for this SHA must complete successfully');
  return latest.id;
}
export function assertCloudflareProject(payload) {
  must(payload?.success === true && payload.result && typeof payload.result === 'object',
    'Cloudflare project settings could not be authenticated');
  const project = payload.result;
  must(project.name === PROJECT, 'Cloudflare project mismatch');
  must(project.production_branch === 'production', 'Cloudflare production_branch is not production');
  must(project.source == null, 'Cloudflare project is not Direct Upload');
  const production = project.deployment_configs?.production;
  must(production && typeof production === 'object', 'Cloudflare production configuration missing');
  const vars = production.env_vars ?? {};
  must(vars && typeof vars === 'object' && !Array.isArray(vars), 'Invalid Cloudflare production variables');
  must(!Object.hasOwn(vars,'FEEDBACK_ENABLED'), 'FEEDBACK_ENABLED must be absent in production');
  const d1 = production.d1_databases ?? {};
  must(d1 && typeof d1 === 'object' && Object.keys(d1).length === 0,
    'D1 bindings must remain absent until feedback launch is separately approved');
  return {project:PROJECT,productionBranch:'production',feedbackDisabled:true};
}
async function apiJson(fetcher,url,headers) {
  let response;
  try { response = await fetcher(url, {headers,redirect:'error',signal:AbortSignal.timeout(20000)}); }
  catch {throw new Error('HOLD: Read-only API request failed');}
  must(response.ok, `Read-only API request returned HTTP ${response.status}`);
  try {return await response.json();}
  catch {throw new Error('HOLD: Read-only API response is not JSON');}
}
export async function githubPreflight({sha,env,fetcher=fetch,verifyEnvironment=true}) {
  assertDispatch({repository:env.GITHUB_REPOSITORY,ref:env.GITHUB_REF,
    workflowSha:env.GITHUB_SHA,inputSha:sha,confirmation:env.RELEASE_CONFIRMATION});
  must(typeof env.GITHUB_TOKEN === 'string' && env.GITHUB_TOKEN.length > 0, 'GitHub Actions read token unavailable');
  const request = p => apiJson(fetcher,
    `${env.GITHUB_API_URL || 'https://api.github.com'}/repos/${REPOSITORY}${p}`, {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`, Accept:'application/vnd.github+json',
      'X-GitHub-Api-Version':'2022-11-28'});
  const main = await request('/git/ref/heads/main');
  must(main?.ref === 'refs/heads/main' && main?.object?.sha === sha,
    'GitHub main changed; select the new exact SHA and rerun CI');
  const params = new URLSearchParams({branch:'main',head_sha:sha,per_page:'100'});
  const ciRun = assertCiRuns(await request(`/actions/workflows/pages.yml/runs?${params}`),sha);
  if (verifyEnvironment) {
    const [config, branches] = await Promise.all([
      request(`/environments/${ENVIRONMENT}`),
      request(`/environments/${ENVIRONMENT}/deployment-branch-policies?per_page=100`)
    ]);
    assertEnvironment(config, branches);
  }
  return {sha,ciRun,waitTimerRequired:verifyEnvironment};
}
export async function cloudflarePreflight({env,fetcher=fetch}) {
  const id=env.CLOUDFLARE_ACCOUNT_ID, token=env.CLOUDFLARE_API_TOKEN;
  must(typeof id === 'string' && /^[a-f0-9]{32}$/i.test(id), 'Cloudflare account ID missing/invalid');
  must(typeof token === 'string' && token.length > 0, 'Cloudflare Pages token missing');
  const result = await apiJson(fetcher,
    `https://api.cloudflare.com/client/v4/accounts/${id}/pages/projects/${PROJECT}`,
    {Authorization:`Bearer ${token}`,Accept:'application/json'});
  return assertCloudflareProject(result);
}
export async function readLiveRevision({sha,fetcher=fetch}) {
  assertSha(sha);
  let response;
  try { response = await fetcher('https://www.recipavo.com/',{
    redirect:'manual',signal:AbortSignal.timeout(20000)}); }
  catch {throw new Error('HOLD: Live Recipavo site could not be checked');}
  must(response.status === 200, 'Production root did not return HTTP 200');
  const liveSha=response.headers.get('x-recipavo-commit');
  assertSha(liveSha);
  return {sha,liveSha,alreadyLive:liveSha===sha};
}
/** Fail before upload if Wrangler would not discover the required Pages Function. */
export async function verifyPagesFunctions(siteRoot) {
  const site=path.resolve(siteRoot);
  const functions=path.join(site,'functions');
  const api=path.join(functions,'api');
  const entry=path.join(api,'feedback.ts');
  for(const folder of [functions,api]) {
    let state;
    try { state=await lstat(folder); }
    catch { throw new Error('HOLD: Missing Pages Functions directory: '+path.relative(site,folder)); }
    must(state.isDirectory() && !state.isSymbolicLink(),
      'Pages Functions directory is not a real directory');
  }
  let state;
  try { state=await lstat(entry); }
  catch { throw new Error('HOLD: Missing Pages Function: functions/api/feedback.ts'); }
  must(state.isFile() && !state.isSymbolicLink(), 'Pages Function source is not a regular file');
  const source=await readFile(entry,'utf8');
  must(/export\s+function\s+onRequestGet\s*\(/.test(source) &&
       /json\s*\(\s*405\s*,\s*\{\s*error:\s*["']method_not_allowed["']\s*\}/.test(source),
    'Pages feedback GET must remain a 405 method_not_allowed function');
  must(/export\s+async\s+function\s+onRequestPost\s*\(/.test(source) &&
       /FEEDBACK_ENABLED/.test(source),
    'Pages feedback POST feature gate is missing');
  return {functionsRoot:'site/functions',feedbackRoute:'GET 405; POST guarded'};
}

export async function verifyArtifact(dist,sha,{stamp=false}={}) {
  assertSha(sha);
  const headersFile=path.join(dist,'_headers');
  let headers;
  try {headers=await readFile(headersFile,'utf8');}
  catch(error) {
    if (!stamp || error?.code !== 'ENOENT') throw new Error('HOLD: Missing or unreadable release _headers');
    headers='/*\n';
  }
  must(!/^\s*X-Robots-Tag:\s*noindex\b/im.test(headers),
    'Preview noindex HTTP header in production artifact');
  const matches=[...headers.matchAll(shaHeader)].map(m=>m[1]);
  if(stamp && matches.length===0) {
    must(!/X-Recipavo-Commit\s*:/i.test(headers),'Malformed existing release SHA header');
    must(/^\/\*\s*$/m.test(headers),'Expected global /* headers section');
    headers=headers.replace(/^\/\*\s*$/m,`/*\n  X-Recipavo-Commit: ${sha}`);
    await writeFile(headersFile,headers,'utf8');
  } else must(matches.length===1 && matches[0]===sha,'Release SHA header missing, duplicated or wrong');
  const revisionText=await readFile(headersFile,'utf8');
  const revisions=[...revisionText.matchAll(shaHeader)].map(m=>m[1]);
  must(revisions.length===1 && revisions[0]===sha,'Artifact revision stamp mismatch');
  const [html,robots,sitemap]=await Promise.all([
    readFile(path.join(dist,'index.html'),'utf8'),
    readFile(path.join(dist,'robots.txt'),'utf8'),
    readFile(path.join(dist,'sitemap.xml'),'utf8'),
  ]);
  must(html.includes('https://www.recipavo.com/'),'Production origin not present in homepage');
  must(!/<meta\b[^>]*(?:name=["']robots["'][^>]*content=["']noindex|content=["']noindex[^>]*name=["']robots)/i.test(html),
    'Preview noindex meta tag in homepage');
  must(/^Sitemap:\s+https:\/\/www\.recipavo\.com\/sitemap\.xml\s*$/m.test(robots),
    'Production robots sitemap URL missing');
  must(sitemap.includes('<loc>https://www.recipavo.com/'),'Production sitemap origin missing');
  let count=0;
  async function walk(folder) {
    for (const entry of await readdir(folder,{withFileTypes:true})) {
      const name=path.join(folder,entry.name);
      if(entry.isDirectory()) await walk(name);
      else {
        const stat=await lstat(name);
        must(stat.isFile(),'Non-file artifact entry is not permitted');
        must(stat.size<=25*1024*1024,'Pages asset exceeds 25 MiB');
        count++;
        must(count<=20000,'Pages artifact exceeds 20000 files');
      }
    }
  }
  await walk(dist);
  must(count>0,'Empty release artifact');
  return {sha,files:count,productionOrigin:true,noIndex:false};
}
async function main() {
  const [mode,sha,location]=process.argv.slice(2);
  must(['github','github-recheck','cloudflare','stamp','artifact','functions','live'].includes(mode),'Unknown release gate mode');
  let result;
  if(mode==='github'||mode==='github-recheck') result=await githubPreflight({
    sha,env:process.env,verifyEnvironment:true});
  else if(mode==='cloudflare') result=await cloudflarePreflight({env:process.env});
  else if(mode==='functions') result=await verifyPagesFunctions(path.resolve(sha||'site'));
  else if(mode==='live') {
    result=await readLiveRevision({sha});
    if(process.env.GITHUB_OUTPUT) await writeFile(process.env.GITHUB_OUTPUT,
      `already_live=${result.alreadyLive}\n`,{flag:'a'});
  } else result=await verifyArtifact(path.resolve(location||'site/dist'),sha,{stamp:mode==='stamp'});
  console.log('PASS: '+JSON.stringify(result));
}
if(process.argv[1] && fileURLToPath(import.meta.url)===path.resolve(process.argv[1])) {
  main().catch(error=>{
    console.error(error instanceof Error && error.message.startsWith('HOLD:') ?
      error.message : 'HOLD: Release check failed without revealing secrets');
    process.exitCode=1;
  });
}

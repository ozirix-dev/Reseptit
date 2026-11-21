import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {REPOSITORY,ENVIRONMENT,PROJECT,CONFIRMATION,assertDispatch,assertEnvironment,
  assertCiRuns,assertCloudflareProject,githubPreflight,cloudflarePreflight,
  readLiveRevision,verifyArtifact,verifyPagesFunctions} from './recipavo-actions-release-gate.mjs';

const sha='a'.repeat(40);
const dispatch={repository:REPOSITORY,ref:'refs/heads/main',workflowSha:sha,inputSha:sha,confirmation:CONFIRMATION};
const environment={name:ENVIRONMENT,can_admins_bypass:false,
  deployment_branch_policy:{protected_branches:false,custom_branch_policies:true},
  protection_rules:[{type:'wait_timer',wait_timer:10}]};
const branchPolicies={total_count:1,branch_policies:[{id:1,name:'main'}]};
const runs={workflow_runs:[{head_sha:sha,head_branch:'main',status:'completed',conclusion:'success',event:'push',id:123}]};
const cf={success:true,result:{name:PROJECT,production_branch:'production',source:null,
  deployment_configs:{production:{env_vars:{},d1_databases:{},r2_buckets:{RECIPE_IMAGES:{}}}}}};
const response=(body,status=200)=>({ok:status>=200&&status<300,status,json:async()=>body});

test('SHA, main-only dispatch, and explicit confirmation are mandatory',()=>{
  assert.doesNotThrow(()=>assertDispatch(dispatch));
  for (const change of [
    {inputSha:'abc'},{inputSha:'A'.repeat(40)},{workflowSha:'b'.repeat(40)},
    {repository:'other/repo'},{ref:'refs/heads/staging'},{confirmation:'DO_NOT_RELEASE'},
  ]) assert.throws(()=>assertDispatch({...dispatch,...change}),/HOLD:/);
});
test('GitHub environment requires 10-minute timer, main-only restriction, no admin bypass',()=>{
  assert.deepEqual(assertEnvironment(environment,branchPolicies),
    {waitMinutes:10,branch:'main',adminBypass:false});
  const variations=[
    c=>c.protection_rules=[],
    c=>c.protection_rules=[{type:'wait_timer',wait_timer:9}],
    c=>c.protection_rules.push({type:'required_reviewers',reviewers:[{reviewer:{login:'owner'}}]}),
    c=>c.can_admins_bypass=true,
    c=>delete c.can_admins_bypass,
    c=>c.deployment_branch_policy=null,
    c=>c.deployment_branch_policy.custom_branch_policies=false,
    c=>c.name='production',
  ];
  for(const modify of variations){
    const config=structuredClone(environment);modify(config);
    assert.throws(()=>assertEnvironment(config,branchPolicies),/HOLD:/);
  }
  for(const policies of [
    {total_count:0,branch_policies:[]},
    {total_count:1,branch_policies:[{name:'main*'}]},
    {total_count:2,branch_policies:[{name:'main'},{name:'release/*'}]},
  ])assert.throws(()=>assertEnvironment(environment,policies),/HOLD:/);
});
test('latest CI must be successful and match exact SHA and main',()=>{
  assert.equal(assertCiRuns(runs,sha),123);
  for(const change of [{head_sha:'b'.repeat(40)},{head_branch:'branch'},{event:'pull_request'},
      {status:'in_progress'},{conclusion:'failure'}]) {
    assert.throws(()=>assertCiRuns({workflow_runs:[{...runs.workflow_runs[0],...change}]},sha),/HOLD:/);
  }
  assert.throws(()=>assertCiRuns({workflow_runs:[]},sha),/HOLD:/);
  assert.throws(()=>assertCiRuns({workflow_runs:[
    {...runs.workflow_runs[0],id:1},{...runs.workflow_runs[0],id:2,status:'in_progress',conclusion:null}
  ]},sha),/HOLD:/);
});
test('Cloudflare config is read-only, Direct Upload, production and feedback OFF',()=>{
  assert.deepEqual(assertCloudflareProject(cf),
    {project:PROJECT,productionBranch:'production',feedbackDisabled:true});
  for(const change of [
    x=>x.result.name='wrong',x=>x.result.production_branch='main',
    x=>x.result.source={type:'github'},x=>delete x.result.deployment_configs,
    x=>x.result.deployment_configs.production.env_vars.FEEDBACK_ENABLED={type:'secret_text'},
    x=>x.result.deployment_configs.production.d1_databases.FEEDBACK_DB={id:'db'},
  ]) {const payload=structuredClone(cf);change(payload);
    assert.throws(()=>assertCloudflareProject(payload),/HOLD:/);}
});
test('GitHub API verifies fresh main, exact CI and timer + main branch policy',async()=>{
  const urls=[];
  const env={GITHUB_REPOSITORY:REPOSITORY,GITHUB_REF:'refs/heads/main',GITHUB_SHA:sha,
    RELEASE_CONFIRMATION:CONFIRMATION,GITHUB_TOKEN:'test-token'};
  const fetcher=async url=>{
    urls.push(url);
    if(url.includes('/git/ref/heads/main'))return response({ref:'refs/heads/main',object:{sha}});
    if(url.includes('/actions/workflows/pages.yml/runs?'))return response(runs);
    if(url.includes('/deployment-branch-policies?'))return response(branchPolicies);
    if(url.includes('/environments/'))return response(environment);
    throw Error('unexpected');
  };
  assert.deepEqual(await githubPreflight({sha,env,fetcher}),{sha,ciRun:123,waitTimerRequired:true});
  assert.equal(urls.length,4);urls.length=0;
  assert.deepEqual(await githubPreflight({sha,env,fetcher,verifyEnvironment:false}),
    {sha,ciRun:123,waitTimerRequired:false});
  assert.equal(urls.length,2);
  await assert.rejects(()=>githubPreflight({sha,env,fetcher:async url=>
    url.includes('/git/ref/')?response({ref:'refs/heads/main',object:{sha:'b'.repeat(40)}}):response(runs)}),
    /main changed/);
});
test('Cloudflare API must be authenticated and return project settings',async()=>{
  const env={CLOUDFLARE_ACCOUNT_ID:'a'.repeat(32),CLOUDFLARE_API_TOKEN:'test-token'};
  const fetcher=async(url,options)=>{
    assert.match(url,/pages\/projects\/recipavo-site$/);
    assert.equal(options.headers.Authorization,'Bearer test-token');
    return response(cf);
  };
  assert.deepEqual(await cloudflarePreflight({env,fetcher}),
    {project:PROJECT,productionBranch:'production',feedbackDisabled:true});
  await assert.rejects(()=>cloudflarePreflight({env:{...env,CLOUDFLARE_API_TOKEN:''},fetcher}),/HOLD:/);
  await assert.rejects(()=>cloudflarePreflight({env,fetcher:async()=>response({},403)}),/HOLD:/);
});
async function fixture(){
  const folder=await mkdtemp(join(tmpdir(),'recipavo-gate-'));
  await mkdir(join(folder,'assets'));
  await writeFile(join(folder,'index.html'),'<link rel="canonical" href="https://www.recipavo.com/" />');
  await writeFile(join(folder,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: https://www.recipavo.com/sitemap.xml\n');
  await writeFile(join(folder,'sitemap.xml'),'<loc>https://www.recipavo.com/</loc>');
  await writeFile(join(folder,'assets/index.js'),'console.log(1)');
  return folder;
}
test('production artifact stamp is idempotent; wrong, duplicate, preview stamps fail',async()=>{
  const folder=await fixture();
  try{
    const result=await verifyArtifact(folder,sha,{stamp:true});
    assert.equal(result.files,5);
    assert.deepEqual(await verifyArtifact(folder,sha,{stamp:true}),result);
    const stamped=await readFile(join(folder,'_headers'),'utf8');
    await assert.rejects(()=>verifyArtifact(folder,'b'.repeat(40)),/HOLD:/);
    await writeFile(join(folder,'_headers'),stamped+`  X-Recipavo-Commit: ${sha}\n`);
    await assert.rejects(()=>verifyArtifact(folder,sha),/HOLD:/);
    await writeFile(join(folder,'_headers'),`/*\n  X-Robots-Tag: noindex, nofollow\n  X-Recipavo-Commit: ${sha}\n`);
    await assert.rejects(()=>verifyArtifact(folder,sha),/noindex/);
  }finally{await rm(folder,{recursive:true,force:true});}
});
test('preview HTML or unstamped artifact never passes',async()=>{
  const folder=await fixture();
  try{
    await assert.rejects(()=>verifyArtifact(folder,sha),/HOLD:/);
    await writeFile(join(folder,'index.html'),'<meta name="robots" content="noindex"><link href="https://www.recipavo.com/">');
    await assert.rejects(()=>verifyArtifact(folder,sha,{stamp:true}),/noindex/);
  }finally{await rm(folder,{recursive:true,force:true});}
});
test('Pages Function source must be present and retain guarded GET and POST before upload',async()=>{
  const root=await mkdtemp(join(tmpdir(),'recipavo-functions-'));
  try {
    const api=join(root,'functions','api');
    await mkdir(api,{recursive:true});
    const route=join(api,'feedback.ts');
    const guarded='export function onRequestGet() { return json(405, { error: "method_not_allowed" }); }\n'+
      'export async function onRequestPost() { if (env.FEEDBACK_ENABLED !== "true") return; }\n';
    await writeFile(route,guarded);
    assert.deepEqual(await verifyPagesFunctions(root),
      {functionsRoot:'site/functions',feedbackRoute:'GET 405; POST guarded'});
    await writeFile(route,guarded.replace('json(405','json(200'));
    await assert.rejects(()=>verifyPagesFunctions(root),/GET must remain/);
    await writeFile(route,guarded.replace('FEEDBACK_ENABLED','other_variable'));
    await assert.rejects(()=>verifyPagesFunctions(root),/POST feature gate/);
    await rm(route);
    await assert.rejects(()=>verifyPagesFunctions(root),/Missing Pages Function/);
  } finally { await rm(root,{recursive:true,force:true}); }
});
test('Pages Functions predeploy guard rejects missing source directory',async()=>{
  const root=await mkdtemp(join(tmpdir(),'recipavo-no-functions-'));
  try { await assert.rejects(()=>verifyPagesFunctions(root),/Missing Pages Functions directory/); }
  finally { await rm(root,{recursive:true,force:true}); }
});
test('live revision is checked, never assumed',async()=>{
  const fetcher=async()=>({status:200,headers:new Headers({'x-recipavo-commit':sha})});
  assert.deepEqual(await readLiveRevision({sha,fetcher}),{sha,liveSha:sha,alreadyLive:true});
  await assert.rejects(()=>readLiveRevision({sha,fetcher:async()=>({status:404,headers:new Headers()})}),/HOLD:/);
});
test('release workflow can only be launched manually, with a protected environment',async()=>{
  const text=await readFile(new URL('../.github/workflows/recipavo-production-manual.yml',import.meta.url),'utf8');
  assert.match(text,/^on:\n  workflow_dispatch:/m);
  assert.doesNotMatch(text,/^  (?:push|pull_request|schedule|repository_dispatch):/m);
  assert.match(text,/^    needs: gate$/m);
  assert.match(text,/^      name: recipavo-production$/m);
  assert.match(text,/^  group: recipavo-production-release$/m);
  assert.match(text,/^  cancel-in-progress: false$/m);
  assert.match(text,/--project-name recipavo-site --branch production --commit-hash/);
  assert.match(text,/github-recheck/);
  assert.match(text,/--yes wrangler@4\.165\.0 pages deploy/);
  assert.match(text,/recipavo-actions-release-gate\.mjs functions site/);
});

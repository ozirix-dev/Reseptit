import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {probeProduction,ORIGIN,ROUTES} from './recipavo-production-health.mjs';

const SHA='a'.repeat(40);
const entry='/assets/index-DnBXLazI.js';
const html=(p,lang,extra='')=>'<html lang="'+lang+'"><head>'+
  '<link href="'+ORIGIN+p+'" rel="canonical" />'+extra+'</head><body>'+
  (p==='/'?'<script type="module" crossorigin src="'+entry+'"></script>':'')+'</body></html>';
const sitemapXml=ROUTES.map(({path})=>'<loc>'+ORIGIN+path+'</loc>').join('\n');
const good=new Map([
  ...ROUTES.map(({path,lang})=>[path,{status:200,body:html(path,lang),
    headers:{'x-recipavo-commit':SHA,'content-type':'text/html'}}]),
  ['/robots.txt',{status:200,body:'User-agent: *\nAllow: /\nSitemap: '+ORIGIN+'/sitemap.xml\n',
    headers:{'x-recipavo-commit':'b'.repeat(40)}}],
  ['/sitemap.xml',{status:200,body:sitemapXml}],
  ['/__recipavo_health_missing__/',{status:404,body:'<meta name="robots" content="noindex,follow">'}],
  ['/api/feedback',{status:405,body:'{"error":"method_not_allowed"}',
    headers:{'content-type':'application/json','cache-control':'no-store','x-content-type-options':'nosniff'}}],
  [entry,{status:200,body:'console.log("ok");'.repeat(15),
    headers:{'content-type':'application/javascript; charset=utf-8'}}],
]);
const response=({status,body,headers={}})=>new Response(body,{status,headers});
const fake=(overrides={},called=[])=>async (url,options)=>{
  assert.equal(options.method,'GET');
  assert.equal(options.redirect,'manual');
  assert.equal(options.headers['user-agent'],'Recipavo-Production-Health/1.0');
  assert.ok(url.startsWith(ORIGIN+'/'),'no arbitrary outgoing hosts');
  const route=url.slice(ORIGIN.length);
  called.push(route);
  const value=Object.hasOwn(overrides,route)?overrides[route]:good.get(route);
  assert.ok(value,'unexpected GET '+route);
  return response(value);
};

test('healthy four-language production checks all nine read-only routes',async()=>{
  const visited=[];
  const result=await probeProduction({fetcher:fake({},visited)});
  assert.equal(result.status,'PASS');
  assert.equal(result.sha,SHA);
  assert.equal(result.checks.length,9);
  assert.deepEqual(visited,[...ROUTES.map(x=>x.path),'/robots.txt','/sitemap.xml',
    '/__recipavo_health_missing__/','/api/feedback',entry]);
});
const homeWithBootstrap = (url = entry) => ({
  ...good.get('/'),
  body: html('/','fi').replace(
    '<script type="module" crossorigin src="'+entry+'"></script>',
    '<script type="module">\n'+
    '  const importEntry = () => { void import('+JSON.stringify(url)+'); };\n'+
    '  importEntry();\n'+
    '</script>',
  ),
});

test('deferred Vite entry checks all nine read-only routes',async()=>{
  const visited=[];
  const result=await probeProduction({fetcher:fake({'/':homeWithBootstrap()},visited)});
  assert.equal(result.status,'PASS');
  assert.equal(result.sha,SHA);
  assert.deepEqual(visited,[...ROUTES.map(x=>x.path),'/robots.txt','/sitemap.xml',
    '/__recipavo_health_missing__/','/api/feedback',entry]);
});

test('stale revision metadata on robots.txt does not cause false alert',async()=>{
  assert.equal((await probeProduction({fetcher:fake()})).status,'PASS');
});
const expectBroken = (route, updated, reason) =>
  assert.rejects(() => probeProduction({fetcher:fake({[route]:updated})}),reason);

test('missing and mismatching HTML release SHA fail',async()=>{
  await expectBroken('/en/recipes/',{...good.get('/en/recipes/'),
    headers:{'x-recipavo-commit':'b'.repeat(40)}},/inconsistent release SHA/);
  await expectBroken('/sv/recept/',{...good.get('/sv/recept/'),
    headers:{}},/invalid release SHA/);
});
test('wrong language, canonical and noindex fail',async()=>{
  const base=good.get('/th/recipes/');
  for(const body of [
    html('/th/recipes/','en'),
    html('/th/recipes/','th').replace('rel="canonical"','rel="alternate"'),
    html('/th/recipes/','th','<meta name="robots" content="noindex,nofollow">'),
  ]) await expectBroken('/th/recipes/',{...base,body},/PRODUCTION HEALTH FAIL/);
});
test('robots and sitemap changes fail',async()=>{
  await expectBroken('/robots.txt',{status:200,
    body:'User-agent: *\nDisallow: /\nSitemap: '+ORIGIN+'/sitemap.xml'},/blocks the entire site/);
  await expectBroken('/sitemap.xml',{status:200,
    body:'<loc>'+ORIGIN+'/</loc>'},/sitemap missing/);
});
test('404 must remain 404 and noindex',async()=>{
  await expectBroken('/__recipavo_health_missing__/',{status:200,body:'missing'},/return 404/);
  await expectBroken('/__recipavo_health_missing__/',{status:404,body:'missing'},/must be noindex/);
});
test('feedback GET must remain 405 JSON, never fallback HTML',async()=>{
  await expectBroken('/api/feedback',{status:200,body:'OK'},/HTTP 405/);
  await expectBroken('/api/feedback',{status:405,body:'<html>oops</html>',
    headers:{'content-type':'text/html'}},/must return JSON/);
  await expectBroken('/api/feedback',{...good.get('/api/feedback'),body:'{"error":"other"}'},
    /response changed/);
});
test('feedback GET must disallow caching and MIME sniffing',async()=>{
  const goodFeedback=good.get('/api/feedback');
  for(const [headers,reason] of [
    [{'content-type':'application/json','x-content-type-options':'nosniff'},/must not be cached/],
    [{'content-type':'application/json','cache-control':'public, max-age=3600','x-content-type-options':'nosniff'},/must not be cached/],
    [{'content-type':'application/json','cache-control':'no-store'},/MIME sniffing/],
    [{'content-type':'application/json','cache-control':'no-store','x-content-type-options':'guess'},/MIME sniffing/],
  ])await expectBroken('/api/feedback',{...goodFeedback,headers},reason);
  assert.equal((await probeProduction({fetcher:fake({'/api/feedback':{
    ...goodFeedback,headers:{'content-type':'application/json; charset=utf-8',
      'cache-control':'private, no-store','x-content-type-options':'nosniff'}}})})).status,'PASS');
});
test('hashed JS entry must exist and resolve to same origin',async()=>{
  await expectBroken(entry,{status:404,body:''},/JS entry not available/);
  await expectBroken('/',{...good.get('/'),
    body:html('/','fi').replace(entry,'https://evil.example/script.js')},
    /expected exactly one hashed JavaScript entry/);
});
test('deferred entry rejects external, inactive, and ambiguous asset references',async()=>{
  const home=homeWithBootstrap();
  await expectBroken('/',homeWithBootstrap('https://example.com'+entry),/expected exactly one hashed JavaScript entry/);
  for (const body of [
    home.body.replace('<script type="module">','<!--<script type="module">').replace('</script>','</script>-->'),
    home.body.replace('</body>','<script type="module" src="'+entry+'"></script></body>'),
  ]) {
    await expectBroken('/',{...home,body},/expected exactly one hashed JavaScript entry/);
  }
});
test('a valid entry cannot hide another active module source',async()=>{
  const home=good.get('/');
  for (const extra of [
    '<script type="module" src="https://example.com/other.js"></script>',
    '<script type="module" src="/assets/other.js"></script>',
    '<script type="module" src></script>',
  ]) {
    await expectBroken('/',{...home,body:home.body.replace('</body>',extra+'</body>')},
      /expected exactly one hashed JavaScript entry/);
  }
});
test('a valid entry cannot hide a malformed deferred entry declaration',async()=>{
  const home=good.get('/');
  const extra='<script type="module">const importEntry = () => import("/assets/other.js");</script>';
  await expectBroken('/',{...home,body:home.body.replace('</body>',extra+'</body>')},
    /invalid deferred JavaScript entry/);
});
test('scripts without an entry declaration do not count as entry candidates',async()=>{
  const home=homeWithBootstrap();
  const extra='<script src="/analytics.js"></script>'+
    '<script type="module">const enhancement = true;</script>'+
    '<template><script type="module" src="/unused.js"></script></template>';
  const body=home.body.replace('</body>',extra+'</body>');
  assert.equal((await probeProduction({fetcher:fake({'/':{...home,body}})})).status,'PASS');
});
test('hashed JS entry rejects a successful HTML fallback',async()=>{
  await expectBroken(entry,{...good.get(entry),headers:{'content-type':'text/html'}},
    /must have a JavaScript content type/);
});
test('entry rejects a missing reference and a non-Vite JavaScript path',async()=>{
  const home=good.get('/');
  for (const body of [
    home.body.replace(/<script\b[^>]*><\/script>/,''),
    home.body.replace(entry,'/assets/other-DnBXLazI.js'),
  ]) {
    await expectBroken('/',{...home,body},/expected exactly one hashed JavaScript entry/);
  }
});
test('a document base cannot redirect the entry to another origin',async()=>{
  const home=homeWithBootstrap();
  const withBase=(href)=>({...home,body:home.body.replace('<head>','<head><base href='+href+'>')});
  await expectBroken('/',withBase('https://example.com/'),/JavaScript entry base must use the Recipavo origin/);
  assert.equal((await probeProduction({fetcher:fake({'/':withBase('"/recipes/"')})})).status,'PASS');
});
test('hashed JS entry rejects an incorrect non-HTML MIME type',async()=>{
  await expectBroken(entry,{...good.get(entry),headers:{'content-type':'text/plain'}},
    /must have a JavaScript content type/);
});
test('network error fails closed; workflow has no deployment or secret access',async()=>{
  await assert.rejects(()=>probeProduction({fetcher:async()=>{throw Error('network down')}}),
    /network request failed/);
  const flow=await readFile(new URL('../.github/workflows/recipavo-production-health.yml',import.meta.url),'utf8');
  assert.match(flow,/workflow_dispatch:/);
  assert.match(flow,/schedule:/);
  assert.match(flow,/pull_request:/);
  assert.match(flow,/if: github.event_name != 'pull_request'/);
  assert.match(flow,/contents: read/);
  assert.doesNotMatch(flow,/\b(?:wrangler|pages deploy|CLOUDFLARE_API_TOKEN|secrets\.)\b/i);
  assert.doesNotMatch(flow,/\b(?:contents: write|actions: write|deployments: write)\b/i);
});

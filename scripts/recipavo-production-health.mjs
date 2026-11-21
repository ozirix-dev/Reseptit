/** [Chat 1] Public, read-only Recipavo production health monitor. No deploy/auth. */
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const ORIGIN = 'https://www.recipavo.com';
export const ROUTES = Object.freeze([
  {path:'/',lang:'fi'},
  {path:'/en/recipes/',lang:'en'},
  {path:'/sv/recept/',lang:'sv'},
  {path:'/th/recipes/',lang:'th'},
]);
const REVISION = /^[0-9a-f]{40}$/;
const ATTR = name => new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i');
const tagAttribute = (tag, name) => {
  const match = tag.match(ATTR(name));
  return match ? (match[1] ?? match[2]) : null;
};
const tags = (html, type) => [...html.matchAll(new RegExp(`<${type}\\b[^>]*>`, 'gi'))].map(x => x[0]);
const required = (test, reason) => { if (!test) throw new Error('PRODUCTION HEALTH FAIL: '+reason); };

export async function probeProduction({fetcher=fetch}={}) {
  const checked = [];
  async function request(route) {
    const url = ORIGIN + route;
    let response;
    try {
      response = await fetcher(url, {
        method:'GET', redirect:'manual', signal:AbortSignal.timeout(15000),
        headers:{'user-agent':'Recipavo-Production-Health/1.0'},
      });
    } catch { throw new Error('PRODUCTION HEALTH FAIL: network request failed for ' + route); }
    checked.push({route,status:response.status});
    return response;
  }
  let releaseSha;
  let assetPath;
  for(const {path:route,lang} of ROUTES) {
    const response=await request(route);
    required(response.status===200, `HTTP ${response.status} for ${route}`);
    const sha=response.headers.get('x-recipavo-commit');
    required(REVISION.test(sha??''), `missing/invalid release SHA for ${route}`);
    if(releaseSha === undefined) releaseSha=sha;
    else required(sha===releaseSha, `inconsistent release SHA on ${route}`);
    const html=await response.text();
    const htmlTags=tags(html,'html');
    required(htmlTags.length===1 && tagAttribute(htmlTags[0],'lang')===lang,
      `wrong HTML language on ${route}`);
    const canonical=tags(html,'link').filter(x=>tagAttribute(x,'rel')==='canonical');
    required(canonical.length===1 && tagAttribute(canonical[0],'href')===ORIGIN+route,
      `wrong canonical on ${route}`);
    const robots=tags(html,'meta').filter(x=>['robots','googlebot'].includes((tagAttribute(x,'name')??'').toLowerCase()));
    required(!robots.some(x=>/\bnoindex\b/i.test(tagAttribute(x,'content')??'')),
      `production page is noindex: ${route}`);
    if(route==='/') {
      const modules=tags(html,'script').filter(x=>tagAttribute(x,'type')==='module');
      const assets=modules.map(x=>tagAttribute(x,'src')).filter(x=>x && /^\/assets\/index-[A-Za-z0-9_-]+\.js$/.test(x));
      required(assets.length===1, 'expected exactly one hashed JavaScript entry');
      assetPath=assets[0];
    }
  }
  const robots=await request('/robots.txt');
  required(robots.status===200,'robots.txt not available');
  const robotsText=await robots.text();
  required(/^Sitemap:\s+https:\/\/www\.recipavo\.com\/sitemap\.xml\s*$/im.test(robotsText),
    'robots.txt sitemap missing');
  required(!/^Disallow:\s*\/\s*$/im.test(robotsText), 'robots.txt blocks the entire site');

  const sitemap=await request('/sitemap.xml');
  required(sitemap.status===200,'sitemap.xml not available');
  const sitemapText=await sitemap.text();
  for(const {path:route} of ROUTES) required(sitemapText.includes(`<loc>${ORIGIN}${route}</loc>`),
    `sitemap missing ${route}`);

  const missing=await request('/__recipavo_health_missing__/');
  required(missing.status===404, 'missing route must return 404');
  const missingHtml=await missing.text();
  required(tags(missingHtml,'meta').some(x=>
    (tagAttribute(x,'name')??'').toLowerCase()==='robots' &&
    /\bnoindex\b/i.test(tagAttribute(x,'content')??'')),
    'missing route must be noindex');

  const feedback=await request('/api/feedback');
  required(feedback.status===405, 'feedback GET must return HTTP 405');
  const contentType=feedback.headers.get('content-type')??'';
  required(/\bapplication\/json\b/i.test(contentType),'feedback GET must return JSON');
  let payload;
  try { payload=await feedback.json(); }
  catch { throw new Error('PRODUCTION HEALTH FAIL: malformed feedback GET JSON'); }
  required(payload?.error==='method_not_allowed','feedback GET response changed');

  const asset=await request(assetPath);
  required(asset.status===200, 'hashed JS entry not available');
  const assetText=await asset.text();
  required(assetText.length>100,'hashed JS entry appears empty');

  return {status:'PASS',origin:ORIGIN,sha:releaseSha,checks:checked};
}

if (process.argv[1] && fileURLToPath(import.meta.url)===path.resolve(process.argv[1])) {
  try {
    const result=await probeProduction();
    console.log('PRODUCTION HEALTH PASS');
    console.log(JSON.stringify(result,null,2));
    if(process.env.GITHUB_STEP_SUMMARY) {
      const {appendFile}=await import('node:fs/promises');
      await appendFile(process.env.GITHUB_STEP_SUMMARY,
        `## Recipavo production health: PASS\n\n`+
        `- Live revision: \`${result.sha}\`\n`+
        `- Checks: ${result.checks.length} read-only GET requests\n`+
        `- Languages: FI, EN, SV, TH\n`+
        `- SEO: canonical, robots, sitemap, missing page noindex\n`+
        `- Pages Functions: GET /api/feedback = 405 JSON\n`+
        `- Hashed JS asset: HTTP 200\n`);
    }
  } catch(error) {
    console.error(error instanceof Error ? error.message : 'PRODUCTION HEALTH FAIL: unknown error');
    process.exitCode=1;
  }
}

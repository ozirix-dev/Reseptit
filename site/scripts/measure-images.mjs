// Run from repository root; see docs/responsive-images.md.
import { pathToFileURL } from 'node:url';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
// Tools are intentionally outside the production dependency graph.
const toolRoot=path.resolve(process.env.PERF_TOOL_ROOT ?? 'tmp/perf-tools');
const {default:lighthouse}=await import(pathToFileURL(path.join(toolRoot,'node_modules/lighthouse/core/index.js')).href);
const {default:desktopConfig}=await import(pathToFileURL(path.join(toolRoot,'node_modules/lighthouse/core/config/desktop-config.js')).href);
const {launch}=await import(pathToFileURL(path.join(toolRoot,'node_modules/chrome-launcher/dist/index.js')).href);
const phase=process.argv[2]??'before';
const root=path.resolve(process.env.PERF_BUILD_ROOT ?? (phase==='before'?'tmp/v15/baseline-dist':'site/dist'));
const output=path.resolve(process.env.PERF_OUTPUT_ROOT ?? 'tmp/v15');
await fs.mkdir(output,{recursive:true});
const server=http.createServer(async(req,res)=>{try {let pathname=decodeURI(new URL(req.url,'http://localhost').pathname).replace(/^\/Reseptit/,'');let f=path.join(root,pathname);if(path.resolve(f)!==root&&!path.resolve(f).startsWith(root+path.sep))throw Error('path');if(pathname.endsWith('/')) f=path.join(f,'index.html');let b=await fs.readFile(f); if(['.html','.js','.json'].includes(path.extname(f))) b=Buffer.from(b.toString().replaceAll('https://ozirix-dev.github.io/Reseptit','http://127.0.0.1:4188/Reseptit'));const type={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.xml':'application/xml'}[path.extname(f)]??'text/plain';res.writeHead(200,{'Content-Type':type,'Content-Encoding':'gzip','Cache-Control':'public,max-age=600'});res.end(gzipSync(b));}catch{res.writeHead(404);res.end('not found');}});
await new Promise(resolve=>server.listen(4188,'127.0.0.1',resolve));
const chrome=await launch({chromePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH??'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe',chromeFlags:['--headless=new','--disable-gpu','--no-first-run']});
const routes=['/','/kermainen-lohipata/','/en/recipes/','/sv/recept/proteinrik-makaronilada-med-kottfars/','/th/recipes/makaroni-op-nuea-bot-protein-sung/'];
const resume=process.argv.includes("resume");
const rows=resume ? JSON.parse(await fs.readFile(`${output}/lighthouse-${phase}.json`, "utf8")).rows : process.argv[3] === "desktop" ? JSON.parse(await fs.readFile(`${output}/lighthouse-${phase}.json`, "utf8")).rows.filter(r=>r.mode === "mobile") : [];
try{for(const mode of (process.argv[3] ? [process.argv[3]] : ['mobile','desktop']))for(const route of routes)for(let run=1;run<=3;run++){
if(resume && rows.some(x=>x.mode===mode&&x.route===route&&x.run===run))continue;
const {lhr}=await lighthouse(`http://127.0.0.1:4188/Reseptit${route}`,{port:chrome.port,output:'json',logLevel:'error',onlyCategories:['performance'],...(mode==='desktop'?{preset:'desktop'}:{}),maxWaitForLoad:20000}, mode === "desktop" ? desktopConfig : undefined);
await fs.writeFile(`${output}/lhr-${phase}-${mode}-${routes.indexOf(route)}-${run}.json`,JSON.stringify(lhr));
const requests=lhr.audits['network-requests'].details.items;
const row={phase,mode,route,run,score:lhr.categories.performance.score,lcp:lhr.audits['largest-contentful-paint'].numericValue,cls:lhr.audits['cumulative-layout-shift'].numericValue,tbt:lhr.audits['total-blocking-time'].numericValue,requests:requests.length,transfer:requests.reduce((s,x)=>s+(x.transferSize||0),0),jsTransfer:requests.filter(x=>x.resourceType==='Script').reduce((s,x)=>s+(x.transferSize||0),0),cssTransfer:requests.filter(x=>x.resourceType==='Stylesheet').reduce((s,x)=>s+(x.transferSize||0),0),network:requests,environment:lhr.environment,settings:lhr.configSettings,imagesTransfer:requests.filter(x=>x.resourceType==='Image').reduce((s,x)=>s+(x.transferSize||0),0),errors:lhr.runtimeError??null};rows.push(row);await fs.writeFile(`${output}/lighthouse-${phase}.json`,JSON.stringify({version:lhr.lighthouseVersion,settings:lhr.configSettings,rows},null,2));console.log(JSON.stringify({phase,mode,route,run,lcp:row.lcp,score:row.score}));
}}finally{await chrome.kill();server.close();}




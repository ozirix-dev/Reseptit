// Read-only reproduction of the current production calculation up to report IO.
// Usage: node docs/research/polyoli-01/verify-main.mjs --output-dir D:/Temp/polyoli-verify
// Generates its harness and output in the explicit scratch directory only.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../../..');
const outputArg=process.argv.indexOf('--output-dir');
if(outputArg<0||!process.argv[outputArg+1])throw Error('EXPLICIT_SCRATCH_OUTPUT_REQUIRED');
const scratch=path.resolve(process.argv[outputArg+1]);
const rel=path.relative(root,scratch);
if(rel===''||(!rel.startsWith('..'+path.sep)&&!path.isAbsolute(rel)))throw Error('OUTPUT_MUST_BE_OUTSIDE_REPOSITORY');
mkdirSync(scratch,{recursive:true});
let code=readFileSync(path.join(root,'site/scripts/glycemic-load-pilot.ts'),'utf8').split('const report = {')[0];
assert.match(code,/const results = await withdrawQ09Tea/);
code=code.replace(/import \{ siteContent \}[^\n]+\n/,'');
code=code.replace('const siteDir = path.resolve(import.meta.dirname, "..");',`const siteDir = ${JSON.stringify(path.join(root,'site'))};`);
code=code.replace(/from (['"])(\.[^'"]+)\1/g,(_m,_q,spec)=>'from '+JSON.stringify(pathToFileURL(path.resolve(root,'site/scripts',spec)+'.ts').href));
const baseline=path.join(scratch,'production-results.json');
code+=`\nawait writeFile(${JSON.stringify(baseline)},JSON.stringify({results},null,2));\n`;
const harness=path.join(scratch,'production-harness.mts');writeFileSync(harness,code);
execFileSync(process.execPath,[path.join(root,'site/node_modules/tsx/dist/cli.mjs'),harness],{cwd:root,stdio:'inherit'});
const results=JSON.parse(readFileSync(baseline,'utf8')).results;
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const summary={baseMain:'5761afa069ea54c9d510f1cb3c1086ae7d42f998',recipes:results.length,calculated:results.filter(r=>r.status==='CALCULATED').length,resultHashes:Object.fromEntries(results.map(r=>[r.recipeId,hash(r)]))};
const expected=JSON.parse(readFileSync(path.join(here,'main-baseline-hashes.json'),'utf8'));
assert.deepEqual(summary,expected);
writeFileSync(path.join(scratch,'verification.json'),JSON.stringify({status:'PASS',recipes:summary.recipes,calculated:summary.calculated,identicalResults:Object.keys(summary.resultHashes).length},null,2)+'\n');
console.log(JSON.stringify({status:'PASS',recipes:summary.recipes,calculated:summary.calculated,identicalResults:results.length}));

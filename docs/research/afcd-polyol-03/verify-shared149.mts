import fs from 'node:fs/promises';import path from 'node:path';import {createHash} from 'node:crypto';import assert from 'node:assert/strict';
const root=path.resolve(process.argv[2]),snapshot=path.resolve(process.argv[3]);
const hash=(s:string)=>createHash('sha256').update(s.replaceAll('\r\n','\n')).digest('hex');
const digest=(v:any)=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const text=async(p:string)=>{try{return await fs.readFile(path.join(root,p),'utf8');}catch(e:any){if(e.code!=='ENOENT')throw e;return await fs.readFile(path.join(snapshot,path.basename(p)),'utf8');}};
const load=async(p:string)=>JSON.parse(await text(p));
const pack=await load('docs/nutrition/gk80-operation149/cases.json'),comps=(await load('docs/nutrition/gk80-operation149/composition-sources.json')).records,gis=(await load('docs/nutrition/gk80-operation149/gi-sources.json')).records;
assert.equal(pack.activation,false);assert.equal(pack.ownerApproval,false);assert.equal(pack.baselineMain,'4a804757d5f9732938928dcba8f79ea0674ad98c');assert.equal(new Set(pack.selectedRecipeIds).size,70);
const afcd=(await load('docs/nutrition/afcd-release-3-reference.json')).foods,fineli=(await load('docs/nutrition/fineli-release-20-reference.json')).foods;
let afcdCount=0,fineliCount=0;
for(const c of comps){
 if(c.kind==='AFCD_WITHOUT_SUGAR_ALCOHOLS'||c.kind==='FINELI_CHOAVL'){
  const native=(c.kind==='FINELI_CHOAVL'?fineli:afcd).find((r:any)=>r.source_id===c.nativeId);assert.ok(native,c.id);assert.equal(digest(native),c.nativeRowSha256,c.id+' native record identity');
  const available=c.kind==='FINELI_CHOAVL'?native.per100g.available_carbohydrate_g_per_100g:native.available_carbohydrate_without_sugar_alcohols_g_per_100g;
  assert.notEqual(available,null,c.id+' null is not zero');assert.equal(c.availablePer100g,available,c.id+' independently defined available CHO');if(c.kind==='FINELI_CHOAVL')fineliCount++;else afcdCount++;
 }else if(c.fileSha256)assert.equal(hash(await text(c.path)),c.fileSha256,c.id+' external source file');
}
function checkGiValues(g:any,native:any){
 if(typeof native.gi==='number')assert.deepEqual(g.values,[native.gi],g.id+' scalar GI binding');
 if(Array.isArray(native.values))assert.deepEqual(g.values,native.values,g.id+' array GI binding');
}
let arrayBindings=0;
for(const g of gis){const file=await load(g.path),rows=Array.isArray(file)?file:file.records,native=rows.find((r:any)=>r.id===g.nativeId);assert.ok(native,g.id);assert.equal(digest(native),g.nativeRowSha256,g.id+' source identity');checkGiValues(g,native);if(Array.isArray(native.values)){arrayBindings++;const corrupt={...g,values:g.values.map((x:number)=>x+1)};assert.throws(()=>checkGiValues(corrupt,native),/array GI binding/,'mutated GI must not retain source authorization');}}
for(const c of pack.cases){const {inputSha256,...body}=c;assert.equal(digest(body),inputSha256,c.recipeId+' exact candidate');for(const [locale,p] of Object.entries(c.paths)){assert.equal(hash(await text(String(p))),c.recipeSha256[locale],c.recipeId+'/'+locale+' current recipe');}}
console.log(JSON.stringify({status:'PASS',afcdSourceRecords:afcdCount,fineliSourceRecords:fineliCount,giSourceRecords:gis.length,arrayGiValueBindingsAndMutationChecks:arrayBindings,caseBindings:pack.cases.length,selectedIds:70,publicationAuthorized:false}));

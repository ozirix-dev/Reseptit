import {restorePreEHold} from './restore-pre-ehold';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {calculateScopedPolyolC,loadScopedPolyolC,validateScopedPolyolC,scopedPolyolRecipeIds,assertScopedGkInterval,type ScopedPolyolEvidence} from '../scripts/gk80-polyol-c';
import {calculate,normalizeCarbohydrate} from '../scripts/nutrition-model';
import {verifyNutritionEvidence} from '../scripts/nutrition-evidence';
import {parseMarkdown} from '../src/content/markdown';
import {formatGlycemicLoadNumber} from '../src/features/recipes/gk80-format';
import {scopedPolyolDisclosure} from '../src/features/recipes/scoped-polyol-disclosure';

const root=fileURLToPath(new URL('../../',import.meta.url));
const json=(f:string)=>JSON.parse(readFileSync(path.join(root,f),'utf8'));
const evidence=(id:string):ScopedPolyolEvidence=>json(`docs/nutrition/calculations/${id}.json`);
test('two exact approved versions reproduce the stable GK and four macros; aggregate polyols stay null',async()=>{
  assert.deepEqual(scopedPolyolRecipeIds,['jauheliha-kaalikeitto-vhh','vhh-kaalilaatikko']);
  for(const [n,id] of scopedPolyolRecipeIds.entries()){
    const {e,result}=await loadScopedPolyolC(root,id);
    assert.equal(result.gk.value,n===0?5:4);assert.equal(result.confidence,'LOW');assert.equal(result.biologicalBoundEstablished,false);
    assert.ok(Math.abs(result.gk.upper-result.gk.lower-(n===0?.058:.086))<1e-12);
    assert.deepEqual(Object.values(result.macros).map(m=>m.value),n===0?[10.21,12,17.68,15.26]:[9.52,13,20.86,30.65]);
    assert.deepEqual(Object.values(result.macros).map(m=>m.decimalPlaces),[2,0,2,2]);
    assert.equal(result.unknowns.length,2);assert.ok(result.unknowns.every(u=>u.aggregatePolyolsPer100g===null));
    assert.equal(result.perServing.polyols,null);
    assert.equal(calculate(e).status,'INSUFFICIENT SOURCE DATA','ordinary model does not gain a polyol bypass');
    for(const locale of ['fi-FI','en-GB','sv-SE','th-TH'])assert.equal(formatGlycemicLoadNumber(result.gk.lower,locale,true),formatGlycemicLoadNumber(result.gk.upper,locale,true));
  }
});
test('source, masses, servings, extra unknowns and policy changes invalidate the approval seal',()=>{
  const e=evidence(scopedPolyolRecipeIds[0]);
  const mutations:Array<(x:ScopedPolyolEvidence)=>void>=[
    x=>{x.servings=7;},x=>{x.scopedPolyolC.case.ingredients[0].massG='501';},
    x=>{x.scopedPolyolC.sources[0].gi+=1;},x=>{x.scopedPolyolC.comps[0].per100g.fat+=1;},
    x=>{x.scopedPolyolC.case.ingredients.push(structuredClone(x.scopedPolyolC.case.ingredients[0]));},
    x=>{x.scopedPolyolC.case.ingredients.at(-1)!.polyolsSourceValue=0;},
    x=>{x.scopedPolyolC.fullGkWidthLimit=.25;},x=>{x.scopedPolyolC.responseScenario=[0,200];},
  ];
  for(const mutate of mutations){const copy=structuredClone(e);mutate(copy);assert.throws(()=>calculateScopedPolyolC(copy),/STALE_APPROVAL/);}
});
test('other recipes and all three HOLDs cannot opt into this method by copying evidence',async()=>{
  for(const id of ['ropa-vieja','siskonmakkarakeitto-juurekset','nakkikeitto-kukkakaalilla','synthetic-polyol-recipe']){
    const e=evidence(scopedPolyolRecipeIds[0]);e.recipeId=id;
    assert.throws(()=>calculateScopedPolyolC(e),/RECIPE_NOT_APPROVED/);
    assert.equal(await validateScopedPolyolC(root,id),false);
  }
});
test('cumulative width, raw class boundary and unstable rounding each block separately',()=>{
  assert.throws(()=>assertScopedGkInterval({lower:4.6,upper:4.71}),/CUMULATIVE_BUDGET/);
  assert.throws(()=>assertScopedGkInterval({lower:9.99,upper:10.01}),/CLASS_CHANGE/);
  assert.throws(()=>assertScopedGkInterval({lower:4.49,upper:4.51}),/UNSTABLE_DISPLAY/);
  assert.throws(()=>assertScopedGkInterval({lower:.1,upper:.2}),/POSITIVE_SUBUNIT/);
});
test('nutrition audit accepts the sealed stable values and rejects stale inputs or false precision',()=>{
  for(const id of scopedPolyolRecipeIds){
    const e=evidence(id),p=e.scopedPolyolC;
    const recipe=parseMarkdown(readFileSync(path.join(root,p.recipe.sourcePath),'utf8'))!.data as never;
    const translations=Object.keys(p.versionHashes).filter(f=>f.startsWith('kaannokset/')).map(f=>({path:f,data:parseMarkdown(readFileSync(path.join(root,f),'utf8'))!.data as never}));
    assert.deepEqual(verifyNutritionEvidence(recipe,e,translations).errors,[]);
    const changed=structuredClone(recipe) as any;changed.ingredients[0].amount+=1;
    assert.match(verifyNutritionEvidence(changed,e).errors.join(' '),/changed after calculation/);
    const precise=structuredClone(recipe) as any;precise.carbs_total_per_serving_g+=.01;
    assert.match(verifyNutritionEvidence(precise,e).errors.join(' '),/carbs_total_per_serving_g mismatch/);
    const source=p.comps.find(c=>c.id==='norway-06.186-polyoli02-20261101')!;
    assert.equal(normalizeCarbohydrate({id:source.id,name:'marjoram',state:'dried',basis:'per100g-edible',carbohydrateDefinition:'EU_AVAILABLE',polyolsSourceVerified:false,sourceUrl:'https://www.matvaretabellen.no/en/marjoram-dried/',retrievedAt:'2026-11-01',licence:'source record',per100g:{carbohydrate:20.3,fibre:40,polyols:null}}).net,null);
  }
});
test('live preparation and each translated version must still match the approved content hash',async()=>{
  const e=evidence(scopedPolyolRecipeIds[0]);
  const fixture=mkdtempSync(path.join(os.tmpdir(),'reseptit-polyol-c-'));
  assert.ok(path.resolve(fixture).startsWith(path.resolve(os.tmpdir())+path.sep));
  try{
    const write=(f:string,text:string)=>{mkdirSync(path.dirname(path.join(fixture,f)),{recursive:true});writeFileSync(path.join(fixture,f),text);};
    write(`docs/nutrition/calculations/${e.recipeId}.json`,JSON.stringify(e));
    for(const f of Object.keys(e.scopedPolyolC.versionHashes))write(f,readFileSync(path.join(root,f),'utf8'));
    await loadScopedPolyolC(fixture,e.recipeId);
    for(const f of Object.keys(e.scopedPolyolC.versionHashes)){
      const text=readFileSync(path.join(root,f),'utf8');write(f,text+'\nUnreviewed preparation change.\n');
      await assert.rejects(()=>loadScopedPolyolC(fixture,e.recipeId),/STALE_PREPARATION/);write(f,text);
    }
  }finally{assert.ok(path.resolve(fixture).startsWith(path.resolve(os.tmpdir())+path.sep));rmSync(fixture,{recursive:true});}
});
test('independent Decimal prototype reproduces both integrated intervals and stable values',()=>{
  const dec=JSON.parse(execFileSync(process.platform==='win32'?'python':'python3',['-I',path.join(root,'docs/nutrition/gk80-scoped-c-release/verify_decimal.py')],{encoding:'utf8'})).results;
  for(const [n,id] of scopedPolyolRecipeIds.entries()){
    const r=calculateScopedPolyolC(evidence(id)),d=dec[n];
    assert.ok(Math.abs(r.gk.lower-Number(d.sourceModelGk.lower))<1e-12);assert.ok(Math.abs(r.gk.upper-Number(d.sourceModelGk.upper))<1e-12);
    for(const key of Object.keys(r.macros) as Array<keyof typeof r.macros>){assert.equal(r.macros[key].value,Number(d.macros[key].value));assert.equal(r.macros[key].decimalPlaces,d.macros[key].decimalPlaces);}
  }
});
test('historical C-release regression changes exactly two; all131 previous numeric results and three HOLDs stay identical',()=>{
  const report=restorePreEHold(json('tmp/nutrition/glycemic-load-pilot.json')),base=json('docs/nutrition/gk80-scoped-c-release/main-baseline.json');
  const pre142=json('docs/nutrition/gk80-operation142/historical-main.json');report.results=report.results.map((r:any)=>pre142.selectedResults.find((x:any)=>x.recipeId===r.recipeId)??r);report.summary={...report.summary,calculated:133,insufficientSourceData:193};
  assert.equal(report.results.length,326);assert.equal(report.summary.calculated,133);assert.equal(report.summary.insufficientSourceData,193);
  let unchanged=0;for(const r of report.results){if(scopedPolyolRecipeIds.includes(r.recipeId)){assert.equal(r.status,'CALCULATED');assert.equal(r.boundedPolyolC,true);assert.equal(r.unroundedGlycemicLoadPerServing,null);assert.equal(r.glycemicLoadRangePerServing,null);}else{assert.equal(createHash('sha256').update(JSON.stringify(r)).digest('hex'),base.resultHashes[r.recipeId],r.recipeId);unchanged++;}}
  assert.equal(unchanged,324);
  for(const id of base.numericRecipeIds)assert.equal(report.results.find((r:any)=>r.recipeId===id).status,'CALCULATED');
  assert.equal(base.numericRecipeIds.length,131);
  const recovery=report.results.find((r:any)=>r.recipeId==='uunikanapasta-kesakurpitsa');assert.equal(recovery.closedRecoveryC,true);assert.equal(recovery.glycemicLoadPerServing,3);
  assert.equal(report.results.find((r:any)=>r.recipeId==='kiinalainen-teehaudutetut-munat').glycemicLoadPerServing,null);
  for(const id of scopedPolyolRecipeIds){
    const r=report.results.find((r:any)=>r.recipeId===id),e=evidence(id);
    assert.equal(r.ingredients.length,e.ingredients.length);
    assert.ok(r.ingredients.some((i:any)=>i.name==='suolaa'&&i.giContribution===0));
    assert.equal(r.ingredients.filter((i:any)=>i.giContributionRange!==null).length,2);
  }
  for(const id of ['ropa-vieja','siskonmakkarakeitto-juurekset','nakkikeitto-kukkakaalilla'])assert.equal(report.results.find((r:any)=>r.recipeId===id).status,'INSUFFICIENT SOURCE DATA');
});
test('all eight recipe pages and four method pages disclose the scoped model in generated HTML',()=>{
  const report=json('tmp/nutrition/glycemic-load-pilot.json');
  const routes={fi:'glykeeminen-kuorma',en:'en/glycemic-load',sv:'sv/glykemisk-belastning',th:'th/glycemic-load'};
  for(const locale of ['fi','en','sv','th'] as const){
    const marker=scopedPolyolDisclosure[locale];
    assert.ok(readFileSync(path.join(root,'site/dist',routes[locale],'index.html'),'utf8').includes(marker));
    for(const id of scopedPolyolRecipeIds){
      const file=evidence(id).scopedPolyolC.recipe.sourcePath;
      const slug=parseMarkdown(readFileSync(path.join(root,file),'utf8'))!.data.url_slug;
      const prefix=locale==='fi'?'':locale==='sv'?'sv/recept/':`${locale}/recipes/`;
      const html=readFileSync(path.join(root,'site/dist',prefix,String(slug),'index.html'),'utf8');assert.ok(html.includes(marker),id+'/'+locale);
      const publicPoint=report.results.find((r:any)=>r.recipeId===id).glycemicLoadPerServing;
      assert.ok(html.includes(String(publicPoint)));
    }
  }
});

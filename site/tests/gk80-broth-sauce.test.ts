import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=new URL('../../',import.meta.url), folder=new URL('docs/nutrition/gk80/broth-sauce-1/',root);
const read=(name:string)=>JSON.parse(readFileSync(new URL(name,folder),'utf8'));
const products=read('products.json').records, recipes=read('recipes.json').recipes, results=read('results.json').results;
const close=(a:number,b:string)=>assert.ok(Math.abs(a-Number(b))<1e-12,`${a} != ${b}`);

test('bounded batch reuses exactly the eight agreed recipes and nine product lines',()=>{
  assert.deepEqual(recipes.map((r:any)=>r.recipeId).sort(),['thai-khao-tom-katkaravuilla','thai-riisinuudelikeitto-aamuksi','bulgogi','bun-cha-hanoi','kana-parmesaanipannu-parsakaali','kermainen-kanasienipannu','ropa-vieja','paprikainen-vhh-gulassi'].sort());
  assert.equal(products.length,4); assert.equal(recipes.reduce((n:number,r:any)=>n+r.productBindings.length,0),9);
  assert.equal(read('metrics.json').newUniqueRecipesComparedWithRun2,0);
});
test('independent JavaScript arithmetic checks all declared macro contributions without unit conversion',()=>{
  for(const r of recipes){
    const e=results.find((x:any)=>x.recipeId===r.recipeId);
    for(const key of ['carbohydrate','protein','fat','fibre']){
      const terms=r.productBindings.map((b:any)=>{
        const p=products.find((x:any)=>x.id===b.productId);assert.equal(b.unit,p.nutritionBasis.unit);
        return p.declaredPer100[key]===null?null:Number(p.declaredPer100[key])*Number(b.amount)*Number(b.consumedFraction)/100/Number(r.servings);
      });
      if(terms.includes(null))assert.equal(e.productLabelContributionPerServing[key],null);
      else close(terms.reduce((n:number,x:number)=>n+x,0),e.productLabelContributionPerServing[key]);
    }
  }
  close(0.48,results.find((x:any)=>x.recipeId==='bulgogi').productLabelContributionPerServing.carbohydrate);
  close(0.7,results.find((x:any)=>x.recipeId==='thai-khao-tom-katkaravuilla').productLabelContributionPerServing.carbohydrate);
  close(0.945,results.find((x:any)=>x.recipeId==='bun-cha-hanoi').productLabelContributionPerServing.carbohydrate);
});
test('missing fibre, declared sugars and label carbohydrate retain their actual meaning',()=>{
  assert.equal(products.find((x:any)=>x.id==='soy').declaredPer100.fibre,null);
  for(const p of products){assert.equal(p.gi,null);assert.equal(p.polyolsPer100,null);assert.equal(p.availableCarbohydrateExcludingPolyolsPer100,null);assert.equal(p.zeroValuesAreLabelDeclarations,true);}
  const chicken=products.find((x:any)=>x.id==='chicken');assert.ok(Number(chicken.declaredPer100.fibre)>Number(chicken.declaredPer100.carbohydrate));
  // Fibre exceeds the label CHO here: subtracting it again would create a false zero.
  assert.equal(results.find((x:any)=>x.recipeId==='bulgogi').productLabelContributionPerServing.fibre,null);
});
test('retention and GI stress calculations never create a whole-recipe proposal',()=>{
  for(const r of recipes){assert.ok(r.proposedRecipeChanges.length);assert.equal(r.wholeRecipeGk,null);assert.equal(r.numericGkProposal,false);
    for(const b of r.productBindings)assert.equal(b.consumedFractionEvidence,'EXPLICIT_PROPOSED_ALL_CONSUMED_SCENARIO_NOT_MEASURED');
  }
  for(const e of results){const c=Number(e.productLabelContributionPerServing.carbohydrate);
    close(c*1.5,e.diagnosticOnly.hypotheticalGi150);assert.equal(e.diagnosticOnly.coverageEligible,false);assert.equal(e.diagnosticOnly.isMeasuredOrSourceBound,false);assert.equal(e.wholeRecipeGk,null);}
  const m=read('metrics.json');assert.equal(m.newNumericGkProposals,0);assert.equal(m.newApproved,0);assert.equal(m.newPublished,0);assert.equal(m.cumulativeUniqueConditionalProposals,6);
});
test('read-only Python Decimal verifier checks source hashes, old data and every binding in normal CI',()=>{
  const out=execFileSync(process.platform==='win32'?'python':'python3',[fileURLToPath(new URL('site/scripts/gk80-broth-sauce-verify.py',root))],{encoding:'utf8'});
  assert.deepEqual(JSON.parse(out),{status:'PASS',products:4,recipes:8,ingredientBindings:9,numericGkProposals:0,precision:40,readOnly:true});
});

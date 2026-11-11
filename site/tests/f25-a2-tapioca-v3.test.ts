import assert from "node:assert/strict";
import {test} from "node:test";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import path from "node:path";

const root=path.resolve(import.meta.dirname,"../..");
const read=(name:string)=>JSON.parse(readFileSync(path.join(root,name),"utf8"));
const r=read("docs/reviews/f25-a2-tapioca-v3-product-ledger-20261111.json");
const near=(x:number,y:number)=>Math.abs(x-y)<1e-9;

test("tapioca V3 remains draft source-locked without changing production FI/GK",()=>{
  const b=readFileSync(path.join(root,r.sourceBaseline.fiPath));
  const hash=createHash("sha1").update("blob "+b.byteLength+"\0").update(b).digest("hex");
  assert.equal(hash,r.sourceBaseline.gitBlobSha);
  const gate=read("meta/kaannokset/f25-release-gate.json");
  assert.equal(gate.sources.find((x:any)=>x.recipe_id===r.recipeId)?.approval,null);
  const d=readFileSync(path.join(root,"docs/reviews/f25-a2-tapioca-v3-20261111.md"),"utf8");
  assert.match(d,/EI JULKAISUUN/);
  assert.match(d,/425 ml vettä/);
  assert.match(d,/200 ml/);
  assert.equal(r.status,"HOLD");
  assert.equal(r.sourceBaseline.oldWaterMl,700);
  assert.equal(r.sourceBaseline.newWaterMl,425);
  assert.equal(r.sourceDecision.gk,null);
  assert.ok(Object.values(r.sourceDecision).every(x=>x===false||x===null));
});

test("tapioca V3 verifies retailer volume units and keeps unknown macro components null",()=>{
  const p=r.products.pearls,c=r.products.coconut,fruit=r.products.papaya,lime=r.products.lime;
  assert.equal(p.ean,"0084909007087");
  assert.equal(c.ean,"8851978804068");
  assert.equal(p.dryMassG,100);
  assert.equal(c.volumeMl,200);
  for(const k of ["fat","protein","fibre","polyols"])assert.equal(p.per100g[k],null);
  for(const k of ["fibre","polyols"])assert.equal(c.per100ml[k],null);
  const val=p.dryMassG*p.per100g.carbohydrate/100+c.volumeMl*c.per100ml.carbohydrate/100+
    fruit.massG*fruit.per100g.carbohydrate/100+lime.massG*lime.per100g.carbohydrate/100;
  assert.ok(near(val/r.servings,r.perServingPartial.availableCarbohydrateG));
  const fatMin=(c.volumeMl*c.per100ml.fat/100+lime.massG*lime.per100g.fat/100)/r.servings;
  const proteinMin=(c.volumeMl*c.per100ml.protein/100+fruit.massG*fruit.per100g.protein/100+
    lime.massG*lime.per100g.protein/100)/r.servings;
  assert.ok(near(fatMin,r.perServingPartial.fatLowerBoundG));
  assert.ok(near(proteinMin,r.perServingPartial.proteinLowerBoundG));
  assert.ok(near(r.perServingPartial.fatUpperBoundExclusiveG-fatMin,p.upperBoundFatGPer100g*p.dryMassG/100/r.servings));
  assert.ok(near(r.perServingPartial.proteinUpperBoundExclusiveG-proteinMin,p.upperBoundProteinGPer100g*p.dryMassG/100/r.servings));
  assert.equal(r.perServingPartial.fibreTotalG,null);
  assert.equal(r.perServingPartial.polyolsTotalG,null);
  assert.equal(r.perServingPartial.kcalTotal,null);
  assert.equal(r.physicalTrialCompleted,false);
});

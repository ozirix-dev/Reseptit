import assert from "node:assert/strict";
import {test} from "node:test";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import path from "node:path";

const root=path.resolve(import.meta.dirname,"../..");
const read=(name:string)=>JSON.parse(readFileSync(path.join(root,name),"utf8"));
const d=read("docs/reviews/f25-a2-baghrir-v3-calculation-20261111.json");

test("baghrir V3 stays outside production and uses new method not historical GK",()=>{
  const fi=readFileSync(path.join(root,d.sourceBaseline.fiPath));
  const computed=createHash("sha1").update("blob "+fi.byteLength+"\0").update(fi).digest("hex");
  assert.equal(computed,d.sourceBaseline.gitBlobSha);
  const gate=read("meta/kaannokset/f25-release-gate.json");
  assert.equal(gate.sources.find((x:any)=>x.recipe_id===d.recipeId)?.approval,null);
  assert.equal(d.status,"HOLD");
  assert.equal(d.variant,"V3_UNPUBLISHED");
  assert.equal(d.constraints.gk,null);
  assert.equal(d.constraints.nutritionApproved,false);
  assert.equal(d.constraints.gkApproved,false);
  assert.equal(d.constraints.sourceApproved,false);
  assert.equal(d.constraints.physicalCookTrial,false);
  assert.equal(d.constraints.translationsApproved,false);
  const method=readFileSync(path.join(root,"docs/reviews/f25-a2-baghrir-v3-20261111.md"),"utf8");
  assert.match(method,/EI JULKAISUUN/);
  assert.match(method,/4 g Meira-leivinjauhetta/);
  assert.match(method,/rasvaton tarttumaton pannu/);
  assert.match(method,/vain yhdeltä puolelta/);
  assert.ok(!method.includes("Koepaisto tehty"));
});

test("baghrir V3 product macro arithmetic removes 13.5g oil and adds 4g baking powder without null to zero",()=>{
  assert.equal(d.servings,2);
  const powder=d.ingredients.find((x:any)=>x.ean==="6414200210017");
  assert.equal(powder.amountG,4);
  assert.equal(powder.per100g.carbohydrate,17.6);
  assert.equal(powder.per100g.polyols,null);
  const oil=d.removedPanOil;
  assert.equal(oil.amountG,13.5);
  assert.equal(d.ingredients.some((x:any)=>/öljy|oil/i.test(x.item)),false);
  const expectedCarb=powder.amountG*powder.per100g.carbohydrate/100/d.servings;
  const expectedOilFat=oil.amountG*0.999/d.servings;
  const expectedPowderFat=powder.amountG*powder.per100g.fat/100/d.servings;
  assert.ok(Math.abs(d.macroScenarioPerServing.carbohydrateDeltaG-expectedCarb)<1e-10);
  assert.ok(Math.abs(oil.perServingFatRemovedG-expectedOilFat)<1e-10);
  assert.ok(Math.abs(d.macroScenarioPerServing.fatDeltaG-(-expectedOilFat+expectedPowderFat))<1e-10);
  const old=d.macroScenarioPerServing.legacy, next=d.macroScenarioPerServing.v3Nominal;
  assert.ok(Math.abs(next.carbohydrate-(old.carbohydrate+expectedCarb))<1e-10);
  assert.ok(Math.abs(next.fat-(old.fat-expectedOilFat+expectedPowderFat))<1e-10);
  const approx=x=>4*x.carbohydrate+4*x.protein+9*x.fat+2*x.fibre;
  assert.ok(Math.abs(approx(old)-d.macroScenarioPerServing.approxEnergyLegacyKcal)<1e-8);
  assert.ok(Math.abs(approx(next)-d.macroScenarioPerServing.approxEnergyV3Kcal)<1e-8);
  assert.equal(next.polyols,null); // missing powder polyols remain unknown
  assert.equal(d.constraints.powderPolyolsVerified,false);
});

import assert from "node:assert/strict";
import test from "node:test";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import path from "node:path";
import {parseMarkdown} from "../src/content/markdown";
import {recipeFrontmatterSchema} from "../src/content/schema";
import {sourceReleaseGateDecision} from "../scripts/f25-source-release-gate";

const root=path.resolve(import.meta.dirname,"../..");
const load=(p:string)=>JSON.parse(readFileSync(path.join(root,p),"utf8"));
const b=(buffer:Buffer)=>createHash("sha1").update("blob "+buffer.byteLength+"\0").update(buffer).digest("hex");
const ledger=load("docs/reviews/f25-a2-release/banh-cuon-v4-reproducible-nutrition-and-gk.json");
const round=(x:number)=>Math.round(x*1e6)/1e6;
const metrics=["carbohydrate","protein","fat","fibre","polyols","salt"] as const;

test("Banh cuon V4 is valid draft source with one-to-one punnittu food data; historical FI unchanged",()=>{
  assert.equal(ledger.recipeId,"vietnamilainen-banh-cuon-sienilla");
  const candidate=readFileSync(path.join(root,ledger.sourcePath));
  const source=readFileSync(path.join(root,ledger.historicCanonicalPath));
  assert.equal(b(candidate),ledger.candidateSourceGitBlob);
  assert.equal(b(source),ledger.historicCanonicalGitBlob);
  const parsed=parseMarkdown(candidate.toString("utf8"));
  assert.ok(parsed);
  const data=recipeFrontmatterSchema.parse(parsed.data);
  assert.equal(data.recipe_id,ledger.recipeId);
  assert.equal(data.language,"fi");
  assert.equal(data.status,"draft");
  assert.equal(data.servings,2);
  assert.equal(data.time_total_min,75);
  assert.equal(data.ingredients.length,7);
  assert.deepEqual(data.ingredients.map(i=>({item:i.item,amount:i.amount,unit:i.unit})),
    ledger.ingredients.map((i:any)=>({item:i.item,amount:i.amount,unit:i.unit})));
  assert.match(parsed.content,/GK: ei saatavilla/);
  assert.match(parsed.content,/EI JULKAISUUN/);
  assert.match(parsed.content,/kala-allergeeni/);
  const current=sourceReleaseGateDecision(ledger.recipeId);
  assert.equal(current.authorized,false);
  assert.match(current.reason,/F25_SOURCE_HOLD/);
});

test("Banh cuon label replay respects actual 15ml and keeps unverified full macros and GK null",()=>{
  assert.equal(ledger.stage,"RELEASE_CANDIDATE__NOT_AUTHORIZED");
  assert.equal(ledger.servings,2);
  const sauce=ledger.ingredients.find((i:any)=>i.ean==="8850620888203");
  assert.ok(sauce);
  assert.equal(sauce.unit,"ml");
  assert.equal(sauce.amount,15);
  assert.equal(sauce.basis,"per100ml");
  assert.equal(sauce.nutrition.salt,27.2);
  assert.equal(sauce.nutrition.polyols,null);
  const f=ledger.ingredients.find((i:any)=>i.ean==="6430041080152");
  const starch=ledger.ingredients.find((i:any)=>i.ean==="6418513014119");
  const hk=ledger.ingredients.find((i:any)=>i.ean==="6409100037192");
  assert.ok(f&&starch&&hk);
  assert.equal(f.nutrition.carbohydrate,74);
  assert.equal(starch.nutrition.carbohydrate,86);
  assert.equal(hk.nutrition.protein,20);
  assert.equal(hk.nutrition.fat,10);
  for(const scenario of ledger.scenarioCalculations){
    for(const metric of metrics){
      let total=0,missing=false;
      for(const ingredient of ledger.ingredients){
        const per100=ingredient.nutrition[metric];
        if(per100===null){missing=true;continue;}
        total+=per100*ingredient.amount/100*(ingredient.ean?1:ingredient.item==="neutraalia paistoöljyä"&&metric==="fat"?scenario.retentionOf5gCookingOil:1);
      }
      assert.equal(scenario.perServing[metric],missing?null:round(total/ledger.servings),metric);
    }
    assert.equal(scenario.perServing.polyols,null);
    assert.equal(scenario.perServing.salt,null,"mushroom natural sodium unknown");
    assert.equal(scenario.perServing.carbohydrate,46.225);
    assert.equal(scenario.perServing.protein,20.925);
  }
  assert.equal(ledger.minimumIdentifiedSaltPerServingG,2.213);
  assert.equal(ledger.fishSauceSaltPerServingG,2.04);
  assert.equal(ledger.totalCarbohydratePerServingG,null);
  assert.equal(ledger.gi.gk,null);
  assert.equal(ledger.gi.dispositionCandidate,"GK_UNAVAILABLE_EXPLICITLY_REVIEWED");
  assert.equal(ledger.gi.dispositionGranted,false);
  assert.ok(ledger.gi.humanStudies.every((s:any)=>s.exactSourceMatch===false));
  for(const [key,value] of Object.entries(ledger.independentGate)) assert.equal(value,key==="cookingMethodEditoriallyReviewed"||key==="fishLabelSkuReviewed",key);
  assert.ok(ledger.nextActions.length>=5);
});

test("Banh cuon V4 replays exact per100ml label without density, unknown polyols or shared-model edits",async()=>{
  const {replayBanhCuonV4}=await import("../scripts/f25-a2-banh-cuon-v4-review");
  const r=replayBanhCuonV4();
  assert.equal(r.status,"INSUFFICIENT SOURCE DATA");
  assert.equal(r.publicationStatus,"WITHHELD_SOURCE_INCOMPLETE");
  assert.equal(r.publicationAuthorized,false);
  assert.match(r.sourceHash,/^[a-f0-9]{64}$/);
  assert.equal(r.servings,2);
  assert.equal(r.rows.length,7);
  const sauce=r.rows.find(x=>x.item==="Squid Brand -kalakastiketta");
  assert.ok(sauce);
  assert.equal(sauce.millilitres,15);
  assert.equal(sauce.grams,null,"100ml label must not pretend measured gram mass");
  assert.equal(sauce.nutrition.carbohydrate,0.45);
  assert.equal(sauce.nutrition.protein,1.65);
  assert.equal(r.edibleInputGrams,null,"Mixed units cannot report bogus all-grams total");
  assert.equal(r.perServing.carbohydrate,46.225);
  assert.equal(r.perServing.protein,20.925);
  assert.equal(r.perServing.fat,11.3075);
  assert.equal(r.perServing.fibre,1.2);
  assert.equal(r.perServing.polyols,null);
  assert.equal(r.perServing.salt,null);
  assert.equal(r.totalCarbohydratePerServingG,null);
  assert.equal(r.omissionWithinTolerance,true);
  assert.ok(sauce.issues.includes("Unknown nutrient polyols"));
  const scenario=r.scenarioCalculations.map(x=>x.perServing.fat);
  assert.deepEqual(scenario,[8.81,10.05875,11.3075]);
  assert.throws(()=>replayBanhCuonV4({sauceUnit:"g"}),/F25_A2_V4_LABEL_BASIS_MISMATCH/);
  assert.equal(r.gk,null);
});

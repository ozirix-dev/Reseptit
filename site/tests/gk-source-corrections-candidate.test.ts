import { predecessorForGkSourceCorrection } from "../scripts/gk-source-correction-history";
import { restoreGkSourceCorrectionReport } from "./history/gk-source-correction-report";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import manifest from "./history/gk-source-corrections-candidate.json";
import { canonicalGkFoodRecords } from "../scripts/gk-food-records";
import { calculateGlycemicLoad, type GlycemicIndexRecord, type GlycemicLoadRecipeInput, type GlycemicLoadResult } from "../scripts/glycemic-load-model";
import { glycemicLoadEvidenceHash, glycemicLoadInputHash } from "../scripts/glycemic-load-recipe-binding";
import type { FoodRecord } from "../scripts/nutrition-model";
import { glycemicLoadPilotResults, glycemicLoadAdditionalResults } from "../src/generated/glycemic-load-pilot.generated";

const root = path.resolve(import.meta.dirname, "../..");
const read = async (p: string) => (await readFile(path.join(root,p),"utf8")).replaceAll("\r\n","\n");
const json = async (p: string) => JSON.parse(await read(p));
const sha = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const blob = (text: string) => {
  const bytes = Buffer.from(text,"utf8");
  return createHash("sha1").update("blob "+bytes.length+"\0").update(bytes).digest("hex");
};
const byId = <T extends {recipeId:string}>(rows:readonly T[], id:string):T => {
  const matches=rows.filter(r=>r.recipeId===id);
  assert.equal(matches.length,1,id+": unique row");
  return matches[0]!;
};
type Pilot = {
  calculationInputs:GlycemicLoadRecipeInput[]; results:GlycemicLoadResult[];
  sourceHashes:Record<string,string>; calculationInputHashes:Record<string,string>; calculationEvidenceHashes:Record<string,string>;
  gkOnlyVariants:{recipeId:string;versionId:string}[]; originalReleaseBindings:Record<string,unknown>;
};
const publicRows=[...glycemicLoadPilotResults,...glycemicLoadAdditionalResults];

// Validate the actual source-corrected input and replay the sealed predecessor.
// Old approval fingerprints are intentionally not renewed.
test("GK source correction A: exact three-row candidate, canonical model and scope", async () => {
  const liveText=await read("docs/nutrition/glycemic-load-pilot-input.json");
  const predecessor=predecessorForGkSourceCorrection("docs/nutrition/glycemic-load-pilot-input.json",liveText);
  for(const [p,pin] of Object.entries(manifest.blobs)) assert.equal(blob(p==="docs/nutrition/glycemic-load-pilot-input.json"?predecessor:await read(p)),pin,p);
  const original=JSON.parse(predecessor) as {recipes:GlycemicLoadRecipeInput[]};
  const food = await json("docs/nutrition/food-records.json") as FoodRecord[];
  const gi = (await json("docs/nutrition/glycemic-index-records.json")).records as GlycemicIndexRecord[];
  const creamEvidence = await json("docs/nutrition/calculations/keto-joulutortut.json") as {ingredients:{record?:FoodRecord}[]};
  const cream = creamEvidence.ingredients.find(x=>x.record?.id==="fineli-34764-release-20")?.record;
  assert.ok(cream);
  const foods=canonicalGkFoodRecords([...food,cream]);
  const candidate=structuredClone(original);
  assert.equal(original.recipes.length,326);
  assert.equal(manifest.rows.length,3);
  for(const change of manifest.rows){
    const row=byId(candidate.recipes,change.recipeId).ingredients[change.index];
    assert.deepEqual(row,change.before,change.recipeId+" original row");
    byId(candidate.recipes,change.recipeId).ingredients[change.index]=structuredClone(change.after);
  }
  const changedIds=original.recipes.filter((r,i)=>JSON.stringify(r)!==JSON.stringify(candidate.recipes[i])).map(r=>r.recipeId).sort();
  assert.deepEqual(changedIds,["char-siu","pellava-puuro-pahkinoilla"]);
  let changedRows=0;
  for(const before of original.recipes){
    const after=byId(candidate.recipes,before.recipeId);
    assert.equal(before.servings,after.servings);
    assert.equal(before.ingredients.length,after.ingredients.length);
    for(let i=0;i<before.ingredients.length;i++) if(JSON.stringify(before.ingredients[i])!==JSON.stringify(after.ingredients[i])) changedRows++;
    if(!changedIds.includes(before.recipeId)){
      assert.deepEqual(after,before);
      assert.equal(glycemicLoadInputHash(after),glycemicLoadInputHash(before));
      assert.equal(glycemicLoadEvidenceHash(after,foods,gi),glycemicLoadEvidenceHash(before,foods,gi));
      assert.deepEqual(calculateGlycemicLoad(after,foods,gi),calculateGlycemicLoad(before,foods,gi));
    }
  }
  assert.equal(changedRows,3);
  const reversed=structuredClone(candidate);
  for(const change of manifest.rows) byId(reversed.recipes,change.recipeId).ingredients[change.index]=structuredClone(change.before);
  assert.equal(JSON.stringify(reversed,null,2)+"\n",predecessor);
  assert.equal(JSON.stringify(candidate,null,2)+"\n",liveText);
  assert.throws(()=>predecessorForGkSourceCorrection("docs/nutrition/glycemic-load-pilot-input.json",liveText+"\n"),/unreviewed source-correction successor/);
  const bindings=await json("docs/nutrition/glycemic-load-recipe-bindings.json");
  const pilot=await json("tmp/nutrition/glycemic-load-pilot.json") as Pilot;
  const historical=restoreGkSourceCorrectionReport(structuredClone(pilot));
  for(const [id,pin] of Object.entries(manifest.expectedFingerprints)){
    const before=byId(original.recipes,id), after=byId(candidate.recipes,id);
    assert.deepEqual(byId(pilot.calculationInputs,id),after,id+" corrected canonical input");
    assert.deepEqual(byId(historical.calculationInputs,id),before,id+" restored historical input");
    assert.equal(glycemicLoadInputHash(before),pin.beforeInput);
    assert.equal(glycemicLoadEvidenceHash(before,foods,gi),pin.beforeEvidence);
    assert.equal(bindings.calculationInputs[id],pin.beforeInput);
    assert.equal(bindings.calculationEvidence[id],pin.beforeEvidence);
    assert.equal(glycemicLoadInputHash(after),pin.afterInput);
    assert.equal(glycemicLoadEvidenceHash(after,foods,gi),pin.afterEvidence);
    assert.notEqual(pin.afterInput,pin.beforeInput);
    assert.notEqual(pin.afterEvidence,pin.beforeEvidence);
    const oldModel=calculateGlycemicLoad(before,foods,gi);
    const newModel=calculateGlycemicLoad(after,foods,gi,{requireBoundedGi:true});
    const current=byId(pilot.results,id);
    const visible=publicRows.find(x=>x.recipeId===id);
    console.log("GK-A-CANDIDATE "+JSON.stringify({id,oldModel,newModel,current,visible:visible??null,variants:pilot.gkOnlyVariants.filter(x=>x.recipeId===id),originalReleaseBinding:pilot.originalReleaseBindings[id]??null}));
    assert.equal(current.glycemicLoadPerServing,null,id+" existing original GK must be checked before migration");
    assert.ok(visible,id+" missing public original");
    assert.equal(visible.glycemicLoadPerServing,null,id+" existing public GK");
    assert.equal(visible.glycemicLoadRangePerServing,null);
    assert.equal(visible.confidence,null);
    assert.deepEqual(visible.sourceReferences,[]);
    assert.equal(pilot.gkOnlyVariants.filter(x=>x.recipeId===id).length,0);
    assert.equal(pilot.originalReleaseBindings[id],undefined);
    if(id==="pellava-puuro-pahkinoilla"){
      assert.ok(visible.carbohydrateSources.some(x=>x.title.includes("MANTELIJUOMA")));
      assert.ok(!visible.carbohydrateSources.some(x=>x.title.includes("KEVYTMAITO")));
    }
    assert.equal(newModel.status,"INSUFFICIENT SOURCE DATA",id);
    assert.equal(newModel.glycemicLoadPerServing,null,id);
    assert.equal(newModel.glycemicLoadRangePerServing,null,id);
    assert.equal(newModel.confidence,null,id);
  }
  const almond=calculateGlycemicLoad(byId(candidate.recipes,"pellava-puuro-pahkinoilla"),foods,gi);
  assert.equal(almond.ingredients[2]!.fineliRecordId,"fineli-34738-2026-10-25");
  assert.ok(Math.abs(almond.ingredients[2]!.availableCarbohydratePerServingG!-0.0825)<1e-9);
  const pork=calculateGlycemicLoad(byId(candidate.recipes,"char-siu"),foods,gi);
  assert.ok(Math.abs(pork.ingredients[1]!.availableCarbohydratePerServingG!-4.185)<1e-9);
  assert.equal(pork.ingredients[1]!.giRecordId,null);
  assert.equal(pork.ingredients[4]!.giRecordId,null);
});

test("GK priority queue: capture current canonical original/public/variant scope in one CI run",async()=>{
  const pilot=await json("tmp/nutrition/glycemic-load-pilot.json") as Pilot;
  assert.equal(new Set(manifest.priorityIds).size,33);
  for(const id of manifest.priorityIds){
    const current=byId(pilot.results,id);
    const visible=publicRows.find(x=>x.recipeId===id);
    assert.ok(pilot.sourceHashes[id]&&pilot.calculationInputHashes[id]&&pilot.calculationEvidenceHashes[id],id);
    console.log("GK-PRIORITY "+JSON.stringify({id,originalStatus:current.status,originalGk:current.glycemicLoadPerServing,originalRange:current.glycemicLoadRangePerServing,resultSha256:sha(current),source:pilot.sourceHashes[id],input:pilot.calculationInputHashes[id],evidence:pilot.calculationEvidenceHashes[id],publicStatus:visible?.status??null,publicGk:visible?.glycemicLoadPerServing??null,publicRange:visible?.glycemicLoadRangePerServing??null,publicPortion:visible?.portionEvidence??null,variants:pilot.gkOnlyVariants.filter(v=>v.recipeId===id).map(v=>({versionId:v.versionId,sha256:sha(v)})),releaseBinding:pilot.originalReleaseBindings[id]??null}));
  }
});

// Test-only view. Validate the actual corrected model before reconstructing
// the previously sealed results. Never imported by a publication gate.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import manifest from "./gk-source-corrections-candidate.json";
import { canonicalGkFoodRecords } from "../../scripts/gk-food-records";
import { calculateGlycemicLoad,type GlycemicLoadRecipeInput,type GlycemicIndexRecord } from "../../scripts/glycemic-load-model";
import { glycemicLoadInputHash,glycemicLoadEvidenceHash } from "../../scripts/glycemic-load-recipe-binding";
import type { FoodRecord } from "../../scripts/nutrition-model";
const read=(p:string)=>JSON.parse(readFileSync(new URL("../../../"+p,import.meta.url),"utf8"));
const sha=(x:unknown)=>createHash("sha256").update(JSON.stringify(x)).digest("hex");
export function restoreGkSourceCorrectionReport(report:any){
  if(!report.results) return report;
  const ids=Object.keys(manifest.transitions);
  const current=ids.map(id=>report.calculationInputs?.find((r:any)=>r.recipeId===id));
  const active=current.some((row:any,i:number)=>row&&JSON.stringify(row)===JSON.stringify(manifest.transitions[ids[i] as keyof typeof manifest.transitions].afterInput));
  if(!active) return report;
  const historical=read("docs/nutrition/food-records.json") as FoodRecord[];
  const gi=read("docs/nutrition/glycemic-index-records.json").records as GlycemicIndexRecord[];
  const cream=read("docs/nutrition/calculations/keto-joulutortut.json").ingredients.find((x:{record?:FoodRecord})=>x.record?.id==="fineli-34764-release-20")?.record as FoodRecord|undefined;
  assert.ok(cream);
  const foods=canonicalGkFoodRecords([...historical,cream]);
  for(const [id,entry] of Object.entries(manifest.transitions)){
    const pin=manifest.expectedFingerprints[id as keyof typeof manifest.expectedFingerprints];
    const input=report.calculationInputs.filter((r:any)=>r.recipeId===id);
    assert.deepEqual(input,[entry.afterInput],id+" exact live input");
    assert.equal(glycemicLoadInputHash(input[0]),pin.afterInput);
    assert.equal(glycemicLoadEvidenceHash(input[0],foods,gi),pin.afterEvidence);
    assert.equal(report.calculationInputHashes[id],pin.afterInput);
    assert.equal(report.calculationEvidenceHashes[id],pin.afterEvidence);
    assert.equal(report.sourceHashes[id],entry.sourceSha256);
    assert.equal(sha(entry.beforeResult),entry.beforeResultSha256,id+" sealed prior result");
    const raw=calculateGlycemicLoad(input[0] as GlycemicLoadRecipeInput,foods,gi);
    assert.equal(raw.status,"INSUFFICIENT SOURCE DATA");
    assert.equal(raw.glycemicLoadPerServing,null);
    assert.equal(raw.glycemicLoadRangePerServing,null);
    const expected={...raw,status:"INSUFFICIENT SOURCE DATA",glycemicLoadPerServing:null,glycemicLoadRangePerServing:null,confidence:null,blockers:[...raw.blockers,
      id+": GI/food mapping, portion, conversion, source evidence or calculation assumptions differ from the last GL review; the input must be reviewed again.",
      id+": a calculation-relevant food or GI source value/state differs from the last GL review; source mapping and calculation must be reviewed again."]};
    assert.deepEqual(report.results.filter((r:any)=>r.recipeId===id),[expected],id+" exact fail-closed successor");
    for(const key of ["calculationInputMismatches","calculationEvidenceMismatches"]){
      assert.equal(report[key].filter((x:string)=>x===id).length,1,id+" stale approval must be reported");
      report[key]=report[key].filter((x:string)=>x!==id);
    }
    report.calculationInputs=report.calculationInputs.map((r:any)=>r.recipeId===id?structuredClone(entry.beforeInput):r);
    report.results=report.results.map((r:any)=>r.recipeId===id?structuredClone(entry.beforeResult):r);
    report.calculationInputHashes[id]=pin.beforeInput;
    report.calculationEvidenceHashes[id]=pin.beforeEvidence;
  }
  return report;
}

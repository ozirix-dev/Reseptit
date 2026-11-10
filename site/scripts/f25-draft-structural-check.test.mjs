import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import {normalizeUnit,checkF25} from "./f25-draft-structural-check.mjs";

test("all three languages normalize quantity units without changing amounts",()=>{
 assert.equal(normalizeUnit("en","pcs"),"kpl");
 assert.equal(normalizeUnit("sv","msk"),"rkl");
 assert.equal(normalizeUnit("th","ฟอง"),"kpl");
 assert.equal(normalizeUnit("th","ช้อนชา"),"tl");
 assert.equal(normalizeUnit("en","g"),"g");
});
test("F25 75 draft file structure matches pinned Finnish sources",()=>{
 const r=checkF25();
 assert.deepEqual(r.errors,[]);
 assert.equal(r.sourceCount,25);
 assert.equal(r.files,75);
 assert.equal(r.ingredients,465);
 assert.equal(r.steps,315);
 assert.equal(r.macros,216);
});

test("F25 source disposition is exhaustive, evidence-backed and fail-closed",()=>{
 const root = path.resolve(import.meta.dirname, "../..");
 const manifest = JSON.parse(readFileSync(path.join(root,"meta/kaannokset/f25-source-worklist.json"),"utf8"));
 const review = JSON.parse(readFileSync(path.join(root,manifest.sourceDispositionPath),"utf8"));
 assert.equal(review.schemaVersion,1);
 assert.equal(review.batch,manifest.batch);
 assert.equal(review.sourceCount,25);
 assert.equal(review.rows.length,25);
 assert.equal(review.release_authorized,false);
 assert.equal(review.independentHumanReview,false);
 assert.equal(manifest.release_authorized,false);
 assert.equal(manifest.aiReviewCandidateCount,5);
 const byId = new Map(manifest.recipeSources.map(x=>[x.recipe_id,x]));
 let present=0,missing=0,overlays=0;
 const states={};
 const seen=new Set();
 for(const row of review.rows){
   assert.ok(!seen.has(row.recipe_id));
   seen.add(row.recipe_id);
   const original=byId.get(row.recipe_id);
   assert.ok(original,"Unknown FI source in review");
   assert.equal(row.source_path,original.source_path);
   assert.equal(row.source_blob_sha,original.source_blob_sha);
   assert.equal(row.original_worklist_state,original.review_state);
   assert.equal(row.release_authorized,false);
   assert.equal(row.independent_human_review,false);
   assert.ok(row.next_action.length>20);
   if(row.display_mode==="sha-locked-main-display-projection")overlays++;
   else assert.equal(row.display_mode,"recipe-specific-fi-raw");
   const calculated=existsSync(path.join(root,"docs/nutrition/calculations",row.recipe_id+".json"));
   if(calculated){
     present++;
     assert.equal(row.nutrition_input,"reproducible-input-automated-only");
     assert.equal(row.nutrition_input_path,"docs/nutrition/calculations/"+row.recipe_id+".json");
   } else {
     missing++;
     assert.equal(row.nutrition_input,"missing");
     assert.equal(row.nutrition_input_path,null);
   }
   states[row.assessment]=(states[row.assessment]??0)+1;
   if(row.assessment==="candidate-for-semantic-review")assert.equal(calculated,true);
 }
 assert.equal(seen.size,25);
 assert.equal(overlays,22);
 assert.equal(present,16);
 assert.equal(missing,9);
 assert.deepEqual(states,{"needs-nutrition-input":9,"candidate-for-semantic-review":5,"needs-targeted-source-qa":11});
 assert.deepEqual(new Set(review.candidateIds),new Set(review.rows.filter(x=>x.assessment==="candidate-for-semantic-review").map(x=>x.recipe_id)));
});

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

type Macro = "protein" | "fat" | "carbsAvailable";
type Ingredient = { sourceKey: string; grams: number; item: string };
type Recipe = { recipeId: string; blobSha: string; servings: number; ingredients: Ingredient[]; rawInputPerServing: Record<Macro, number>; rawInputAtwaterKcalPerServing: number; cookedServingNutrition: null; gi: null; gk: null; retentionEvidence: null; photoVerified: false; releaseApproved: false; imageGitPath: string; openChecks: string[] };
const file = path.resolve(import.meta.dirname, "../../docs/reviews/karnivore-first3-raw-scenarios-2026-11-11.json");
const data = JSON.parse(await readFile(file,"utf8")) as {
 documentType: string; status: string; sourcePRHead: string;
 metadataPublicationBlocked: boolean; giGkPublicationBlocked: boolean; photoPublicationBlocked: boolean;
 sourceRecords: Record<string,{per100g:Record<Macro,number>;sourceUrl:string;kind:string}>;
 recipes: Recipe[];
};
const round = (x:number,digits=3)=>Math.round((x+Number.EPSILON)*10**digits)/10**digits;
test("exactly three pinned #448 FI-only scope items",()=>{
 const ids=["karnivore-steak-and-eggs","karnivore-voilohi-pannulla","karnivore-jauhelihakulho-munalla"];
 assert.deepEqual(data.recipes.map(x=>x.recipeId),ids);
 assert.match(data.sourcePRHead,/^[a-f0-9]{40}$/);
 for(const row of data.recipes) { assert.match(row.blobSha,/^[a-f0-9]{40}$/); assert.ok(row.imageGitPath.endsWith("/"+row.recipeId+".webp")); }
});
test("no scenario can masquerade as finished nutrition, verified photo, GI/GK or release approval",()=>{
 assert.equal(data.documentType,"KARNIVORE_FI3_RAW_INGREDIENT_SCENARIO_NONPUBLISHABLE");
 assert.equal(data.status,"HOLD_DO_NOT_PUBLISH");
 assert.equal(data.metadataPublicationBlocked,true);
 assert.equal(data.giGkPublicationBlocked,true);
 assert.equal(data.photoPublicationBlocked,true);
 for(const row of data.recipes) {
  assert.equal(row.cookedServingNutrition,null);
  assert.equal(row.retentionEvidence,null);
  assert.equal(row.gk,null);
  assert.equal(row.gi,null);
  assert.equal(row.photoVerified,false);
  assert.equal(row.releaseApproved,false);
  assert.ok(row.openChecks.length>=4);
 }
});
test("source-matched raw input macro budgets are arithmetically reproducible",()=>{
 for(const row of data.recipes){
  assert.ok(Number.isInteger(row.servings)&&row.servings>0);
  const sum:Record<Macro,number>={protein:0,fat:0,carbsAvailable:0};
  for(const input of row.ingredients){
   assert.ok(input.grams>0 && Number.isFinite(input.grams) && input.item);
   const record=data.sourceRecords[input.sourceKey];
   assert.ok(record && record.sourceUrl.startsWith("https://"));
   assert.ok(record.kind);
   for(const macro of ["protein","fat","carbsAvailable"] as const){
    assert.ok(Number.isFinite(record.per100g[macro]) && record.per100g[macro]>=0);
    sum[macro]+=input.grams*record.per100g[macro]/100;
   }
  }
  for(const macro of ["protein","fat","carbsAvailable"] as const) assert.equal(row.rawInputPerServing[macro],round(sum[macro]/row.servings),row.recipeId+"/"+macro);
  assert.equal(row.rawInputAtwaterKcalPerServing,round((sum.protein*4+sum.fat*9+sum.carbsAvailable*4)/row.servings,1));
 }
});
test("input source and recipe identity are pinned without inventing edible retention",()=>{
 assert.deepEqual(data.recipes.map(x=>x.ingredients.map(y=>y.grams)),[[360,220,20,3],[400,35,3],[400,110,4]]);
 for(const recipe of data.recipes) assert.equal(recipe.retentionEvidence,null);
 const beef=data.sourceRecords.snellman20;
 assert.match(beef.sourceUrl,/snellman/);
 assert.equal(beef.per100g.fat,20);
 assert.equal(beef.per100g.protein,18);
});

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { siteContent } from "../src/generated/content.generated";

export const bakwanV2DraftPath = "reseptit/raakileet/indonesialainen-bakwan-jagung-punnittu-v2.md";
export const bakwanLegacyPath = "reseptit/aamupalat/indonesialainen-bakwan-maissifritter.md";
export const bakwanLegacyCalculationPath = "docs/nutrition/calculations/indonesialainen-bakwan-maissifritter.json";
const draftBlob = "b4344737daaeea38eb2ff76280c6a31d8c1b3c6d";
const oldSourceBlob = "e9316bc8ef79e073366653c7eb13d356ab109f8f";
const oldCalculationBlob = "61b631baff9293ffaff7fa87134725c6cfd4d0c0";

const blob = (source: string): string => createHash("sha1")
  .update("blob " + Buffer.byteLength(source,"utf8") + "\0").update(source).digest("hex");
const two = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100;
const macroNames = ["carbohydrate","fibre","protein","fat","polyols"] as const;
type Macro = typeof macroNames[number];
type Per100 = Record<Macro,number>;
type LegacyRow = {
  item:string; amount:number|null;unit:string;gramsPerUnit?:number;
  record?:{id:string;per100g:Partial<Per100>};
};
type Legacy = {
  recipeId:string;reviewerStatus:string;servings:number;ingredients:LegacyRow[];
};
const bindings = [
  {name:"tuoreita maissinjyviä",reference:"tuoreita maissinjyviä",grams:100},
  {name:"kuorittua porkkanaa",reference:"porkkana",grams:60},
  {name:"vehnäjauho",reference:"vehnäjauho",grams:100},
  {name:"kevätsipulia",reference:"kevätsipuli",grams:12},
  {name:"neutraalia paistoöljyä",reference:"neutraalia paistoöljyä",grams:13.5},
] as const;

export async function auditBakwanV2Candidate(root:string) {
  const [draftRaw,legacyRaw,calculationRaw] = await Promise.all([
    readFile(path.join(root,bakwanV2DraftPath),"utf8"),
    readFile(path.join(root,bakwanLegacyPath),"utf8"),
    readFile(path.join(root,bakwanLegacyCalculationPath),"utf8"),
  ]);
  assert.equal(blob(draftRaw),draftBlob,"BAKWAN_V2_DRAFT_CHANGED_REVIEW_REQUIRED");
  assert.equal(blob(legacyRaw),oldSourceBlob,"BAKWAN_ORIGINAL_CHANGED_REVIEW_REQUIRED");
  assert.equal(blob(calculationRaw),oldCalculationBlob,"BAKWAN_OLD_CALC_CHANGED_REVIEW_REQUIRED");
  const parsed = parseMarkdown(draftRaw);
  assert.ok(parsed,"BAKWAN_V2_NOT_MARKDOWN");
  const recipe=recipeFrontmatterSchema.parse(parsed.data);
  assert.equal(recipe.recipe_id,"indonesialainen-bakwan-jagung-punnittu-v2");
  assert.equal(recipe.status,"draft");
  assert.equal(recipe.language,"fi");
  assert.equal(recipe.category,"aamupala");
  assert.equal(recipe.servings,2);
  for(const key of ["carbs_net_per_serving_g","carbs_total_per_serving_g",
    "protein_per_serving_g","fat_per_serving_g"] as const){
    assert.equal(recipe[key],null,"BAKWAN_V2_PUBLIC_MACROS_MUST_BE_WITHHELD");
  }
  const ingredients=recipe.ingredients;
  assert.equal(ingredients.length,7,"BAKWAN_V2_INGREDIENTS_CHANGED");
  const mapped = new Map(ingredients.map(row=>[row.item,row]));
  assert.equal(mapped.size,7,"BAKWAN_V2_DUPLICATE_INGREDIENT");
  for(const entry of bindings){
    const row=mapped.get(entry.name);
    assert.ok(row,"BAKWAN_V2_INGREDIENT_MISSING:"+entry.name);
    assert.equal(row.amount,entry.grams,"BAKWAN_V2_MASS_CHANGED:"+entry.name);
    assert.equal(row.unit,"g");
  }
  const water=mapped.get("vettä");
  assert.ok(water);assert.equal(water.amount,100);assert.equal(water.unit,"ml");
  const salt=mapped.get("suolaa");
  assert.ok(salt);assert.equal(salt.amount,1);assert.equal(salt.unit,"g");
  const old=JSON.parse(calculationRaw) as Legacy;
  assert.equal(old.recipeId,"indonesialainen-bakwan-maissifritter");
  assert.equal(old.reviewerStatus,"AUTOMATED ONLY");
  assert.equal(old.servings,2);
  const sources=old.ingredients;
  const scenario = (oilFraction:number)=>{
    assert([0.5,0.75,1].includes(oilFraction),"UNREVIEWED_OIL_RETENTION");
    const sums:Record<Macro,number>={carbohydrate:0,fibre:0,protein:0,fat:0,polyols:0};
    const rows=[];
    for(const entry of bindings){
      const oldRow=sources.find(row=>row.item===entry.reference);
      assert.ok(oldRow?.record,"BAKWAN_NUTRIENT_REFERENCE_MISSING:"+entry.reference);
      const originalGrams=oldRow.unit==="g"?oldRow.amount!:
        oldRow.amount!*oldRow.gramsPerUnit!;
      assert.equal(originalGrams,entry.grams,"OLD_CONVERSION_NOT_EQUAL_TO_V2_DESIGN:"+entry.reference);
      const fraction=entry.name==="neutraalia paistoöljyä"?oilFraction:1;
      for(const nutrient of macroNames){
        const n=oldRow.record.per100g[nutrient];
        assert.equal(typeof n,"number","MISSING_NUTRIENT_"+nutrient+":"+entry.reference);
        sums[nutrient]+=entry.grams*fraction*n!/100;
      }
      rows.push({ingredient:entry.name,designedGrams:entry.grams,
        referenceRecord:oldRow.record.id,
        assumedRetainedFraction:fraction});
    }
    // Pure water and pure sodium chloride are energy-free ingredients,
    // but salt must still be included in sodium disclosure when approved.
    return {
      assumedOilRetainedFraction:oilFraction,
      perServing:{
        availableCarbohydratesG:two(sums.carbohydrate/2),
        carbohydratePlusFibreAndPolyolsG:two((sums.carbohydrate+sums.fibre+sums.polyols)/2),
        proteinG:two(sums.protein/2),
        fatG:two(sums.fat/2),
      },rows,
    };
  };
  const all = [0.5,0.75,1].map(scenario);
  assert.deepEqual(all[2].perServing,{
    availableCarbohydratesG:45.19,
    carbohydratePlusFibreAndPolyolsG:49.88,
    proteinG:7.89,
    fatG:8.5,
  },"ORIGINAL_NUTRIENT_BASELINE_CHANGED");
  assert.equal(siteContent.recipes.some(r=>r.recipeId===recipe.recipe_id),false,
    "BAKWAN_V2_MUST_NOT_BE_IN_PUBLIC_CATALOG");
  return {
    status:"DRAFT_ESTIMATES_NOT_APPROVED" as const,
    recipeId:recipe.recipe_id,
    draftSourceBlob:draftBlob,
    oldCalculationBlob,
    approvedForPublication:false,
    independentNutritionApproved:false,
    glycemicLoadApproved:false,
    weighedInKitchen:false,
    missingEvidence:[
      "Batter hydration and final yield have not been physically tested",
      "Vegetable edible mass is a specified target, not a recorded physical weighing",
      "Actual cooking oil retained in food is not measured",
      "Ingredients reference records have not been independently verified for the new version",
      "GI matched to each carbohydrate-bearing food or preparation and GL approval are missing",
    ],
    oilRetentionScenarios:all,
  };
}
const direct=process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(direct) console.log(JSON.stringify(await auditBakwanV2Candidate(path.resolve(import.meta.dirname,"../..")),null,2));

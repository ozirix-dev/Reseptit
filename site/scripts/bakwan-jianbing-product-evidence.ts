import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";

export const cFiveProductEvidencePath = "docs/reviews/2026-11-11-bakwan-jianbing-product-evidence.json";
const blobHash = (raw: string): string => createHash("sha1")
  .update("blob " + Buffer.byteLength(raw,"utf8") + "\0").update(raw).digest("hex");

type GateRecord = {
  recipeId: string; recipeBlobSha1: string; calculationBlobSha1: string;
  ingredientItem: string; recipeAmount: number; recipeUnit: string; modeledMassG: number;
  referenceFoodId: string; referenceAvailableChoPer100G: number;
  referenceKind: string; ingredientIdentification: string; portionMassStatus: string;
  neededEvidence: string[]; status: "HOLD";
  authorizedMacro: false; authorizedGk: false; publicSourceModification: false;
  finding: string;
};
type Gate = {
  schemaVersion: 1; status: "HOLD_PRODUCT_AND_MASS"; publicationAuthorized: false;
  records: GateRecord[];
};
type CalcuIngredient = {
  item: string; amount: number; unit: string; gramsPerUnit?: number;
  record: { id: string; per100g: { carbohydrate: number } };
};

export async function verifyBakwanJianbingProductEvidence(repoRoot: string, supplied?: Gate) {
  const data: Gate = supplied ?? JSON.parse(await readFile(path.join(repoRoot,cFiveProductEvidencePath),"utf8"));
  assert.equal(data.schemaVersion,1);
  assert.equal(data.status,"HOLD_PRODUCT_AND_MASS");
  assert.equal(data.publicationAuthorized,false);
  assert.ok(Array.isArray(data.records) && data.records.length===2);
  assert.deepEqual(data.records.map(r=>r.recipeId),[
    "indonesialainen-bakwan-maissifritter","kiinalainen-jianbing-munaletty",
  ]);
  const results = [];
  for(const row of data.records) {
    assert.equal(row.status,"HOLD");
    assert.equal(row.authorizedMacro,false,"SOURCE_IDENTITY_IS_NOT_MACRO_APPROVAL");
    assert.equal(row.authorizedGk,false,"SOURCE_IDENTITY_IS_NOT_GK_APPROVAL");
    assert.equal(row.publicSourceModification,false);
    assert.match(row.recipeBlobSha1,/^[0-9a-f]{40}$/);
    assert.match(row.calculationBlobSha1,/^[0-9a-f]{40}$/);
    assert.ok(row.neededEvidence.length>=3 && row.neededEvidence.every(x=>x.length>25));
    const recipePath=path.join(repoRoot,"reseptit/aamupalat",row.recipeId+".md");
    const calculationPath=path.join(repoRoot,"docs/nutrition/calculations",row.recipeId+".json");
    const [rawRecipe,rawCalc]=await Promise.all([readFile(recipePath,"utf8"),readFile(calculationPath,"utf8")]);
    assert.equal(blobHash(rawRecipe),row.recipeBlobSha1,row.recipeId+": FI_SOURCE_STALE");
    assert.equal(blobHash(rawCalc),row.calculationBlobSha1,row.recipeId+": CALCULATION_SOURCE_STALE");
    const markdown=parseMarkdown(rawRecipe); assert.ok(markdown);
    const recipe=recipeFrontmatterSchema.parse(markdown.data);
    assert.equal(recipe.recipe_id,row.recipeId);
    const ingredient=recipe.ingredients.find(i=>i.item===row.ingredientItem);
    assert.ok(ingredient,row.recipeId+": INGREDIENT_UNKNOWN");
    assert.equal(ingredient.amount,row.recipeAmount);
    assert.equal(ingredient.unit,row.recipeUnit);
    const calc=JSON.parse(rawCalc) as {
      recipeId:string;reviewerStatus:string;servings:number;ingredients:CalcuIngredient[];
    };
    assert.equal(calc.recipeId,row.recipeId);
    assert.equal(calc.reviewerStatus,"AUTOMATED ONLY","REVIEW_STATUS_CHANGED_REAUDIT");
    assert.equal(calc.servings,recipe.servings);
    const item=calc.ingredients.find(x=>x.item===row.ingredientItem);
    assert.ok(item,row.recipeId+": CALC_INGREDIENT_UNKNOWN");
    assert.equal(item.amount,row.recipeAmount);
    assert.equal(item.unit,row.recipeUnit);
    assert.equal(item.gramsPerUnit,row.modeledMassG);
    assert.equal(item.record.id.startsWith(row.referenceFoodId),true,row.recipeId+": FOOD_REFERENCE_CHANGED");
    assert.equal(item.record.per100g.carbohydrate,row.referenceAvailableChoPer100G,row.recipeId+": COMPOSITION_CHANGED");
    assert.equal(row.referenceKind.length>10,true);
    if(row.recipeId==="indonesialainen-bakwan-maissifritter"){
      assert.equal(row.portionMassStatus,"STANDARD_PORTION_NOT_RECIPE_MEASUREMENT");
      assert.equal(row.ingredientIdentification,"CARROT_KNOWN");
    }else{
      assert.equal(row.portionMassStatus,"SPOON_CONVERSION_NOT_WEIGHED");
      assert.equal(row.ingredientIdentification,"UNRESOLVED_SAUCE_PRODUCT");
    }
    results.push({recipeId:row.recipeId,sourceBound:true,compositionMatched:true,
      portionMeasured:false,productValidated:row.recipeId.includes("jianbing")?false:null,
      macroApproved:false,gkApproved:false});
  }
  return {checked:results.length,approved:0,status:"HOLD_PRODUCT_AND_MASS" as const,results};
}

const direct=process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(direct) {
  console.log(JSON.stringify(await verifyBakwanJianbingProductEvidence(path.resolve(import.meta.dirname,"../..")),null,2));
}

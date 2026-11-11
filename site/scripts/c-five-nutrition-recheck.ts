import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";

export const cFiveIds = Object.freeze([
  "indonesialainen-bakwan-maissifritter",
  "pohjoisafrikkalainen-maakouda",
  "japanilainen-soba-aamiaiskeitto",
  "kiinalainen-jianbing-munaletty",
  "meksikolainen-huevos-divorciados",
]);
type Macro = "carbohydrate" | "fibre" | "protein" | "fat";
const round2=(n:number)=>Math.round((n+Number.EPSILON)*100)/100;
const sha256=(s:string)=>createHash("sha256").update(s.replaceAll("\r\n","\n")).digest("hex");
type StoredIngredient = {
  item: string; amount: number|null; unit:string; gramsPerUnit?:number;
  record?:{ id:string; per100g:Partial<Record<Macro,number|null>> };
};
type StoredEvidence = {
  recipeId:string;sourceHash:string;reviewerStatus:string;servings:number;ingredients:StoredIngredient[];
};
export type CCase = {
  recipeId:string; status:"HOLD_EVIDENCE";sourceGitBlobSha1:string;
  currentSourceHash:string; storedEvidenceSourceHash?:string;
  storedEvidenceMatchesCurrent?:boolean;
  calculationStatus:"REPRODUCED_AUTOMATED_ONLY"|"NO_INDEPENDENT_CALCULATION";
  reproducedPerServing?: {carbsNetG:number;carbsTotalG:number;proteinG:number;fatG:number};
  sourceDisplayedPerServing:{carbsNetG:number|null;carbsTotalG:number|null;proteinG:number|null;fatG:number|null};
  sensitivities?:Array<{ingredient:string;grams:number;carbsNetPerServingG:number;differenceToStoredG:number}>;
  blockers:string[];
};

function ingredientGrams(ingredient:StoredIngredient) {
  if(ingredient.amount===null)return 0;
  if(ingredient.unit==="g")return ingredient.amount;
  if(typeof ingredient.gramsPerUnit==="number")return ingredient.amount*ingredient.gramsPerUnit;
  throw Error("UNWEIGHED_MACRO_INGREDIENT: "+ingredient.item);
}
function sourceMacro(e:StoredEvidence,key:Macro):number{
  return e.ingredients.reduce((sum,item)=>{
    const grams=ingredientGrams(item);
    if(!grams)return sum;
    const per100=item.record?.per100g[key];
    assert(typeof per100==="number",e.recipeId+": MISSING_SOURCE_COMPONENT:"+item.item+"/"+key);
    return sum+grams*per100/100;
  },0)/e.servings;
}
function sensitivity(e:StoredEvidence,itemName:string,weights:number[]){
  const original=e.ingredients.find(x=>x.item===itemName);
  assert.ok(original,e.recipeId+": expected sensitivity item");
  const baseline=sourceMacro(e,"carbohydrate");
  const oldGrams=ingredientGrams(original);
  const per100=original.record?.per100g.carbohydrate;
  assert(typeof per100==="number");
  return weights.map(grams=>({
    ingredient:itemName,grams,
    carbsNetPerServingG:round2(baseline+(grams-oldGrams)*per100!/100/e.servings),
    differenceToStoredG:round2((grams-oldGrams)*per100!/100/e.servings),
  }));
}

/** Reproduce historical numbers from recorded inputs; do NOT authorize their product identities. */
export async function auditCFive(repoRoot:string):Promise<CCase[]> {
  const manifest=JSON.parse(await readFile(path.join(repoRoot,"docs/reviews/2026-11-11-material21-fifteen-evidence-cases.json"),"utf8")) as {
    cases:Array<{recipe_id:string;source_git_blob_sha1:string;review_status:string}>;
  };
  const result:CCase[]=[];
  for(const id of cFiveIds){
    const item=manifest.cases.find(x=>x.recipe_id===id);
    assert.ok(item && item.review_status==="HOLD_EVIDENCE");
    const raw=await readFile(path.join(repoRoot,"reseptit/aamupalat",id+".md"),"utf8");
    const blob=createHash("sha1").update("blob "+Buffer.byteLength(raw,"utf8")+"\0").update(raw).digest("hex");
    assert.equal(blob,item.source_git_blob_sha1,id+": SOURCE_STALE");
    const parsed=parseMarkdown(raw);assert.ok(parsed);
    const recipe=recipeFrontmatterSchema.parse(parsed.data);
    assert.equal(recipe.recipe_id,id);
    const displayed={
      carbsNetG:recipe.carbs_net_per_serving_g??null,
      carbsTotalG:recipe.carbs_total_per_serving_g??null,
      proteinG:recipe.protein_per_serving_g??null,
      fatG:recipe.fat_per_serving_g??null,
    };
    const report:CCase={
      recipeId:id,status:"HOLD_EVIDENCE",sourceGitBlobSha1:blob,currentSourceHash:sha256(raw),
      calculationStatus:"NO_INDEPENDENT_CALCULATION",sourceDisplayedPerServing:displayed,
      blockers:[],
    };
    let evidence:StoredEvidence|null=null;
    try {
      evidence=JSON.parse(await readFile(path.join(repoRoot,"docs/nutrition/calculations",id+".json"),"utf8")) as StoredEvidence;
    }catch(err){
      if((err as NodeJS.ErrnoException).code!=="ENOENT")throw err;
    }
    if(evidence){
      assert.equal(evidence.recipeId,id);
      assert.equal(evidence.servings,recipe.servings);
      assert.equal(evidence.reviewerStatus,"AUTOMATED ONLY",id+": unexpected review status; re-audit");
      report.storedEvidenceSourceHash=evidence.sourceHash;
      report.storedEvidenceMatchesCurrent=evidence.sourceHash===report.currentSourceHash;
      const net=sourceMacro(evidence,"carbohydrate");
      const fibre=sourceMacro(evidence,"fibre");
      const protein=sourceMacro(evidence,"protein");
      const fat=sourceMacro(evidence,"fat");
      report.reproducedPerServing={
        carbsNetG:round2(net),carbsTotalG:round2(net+fibre),
        proteinG:round2(protein),fatG:round2(fat),
      };
      assert.deepEqual(report.reproducedPerServing,displayed,id+": DISPLAY_VS_STORED_COMPONENTS_MISMATCH");
      report.calculationStatus="REPRODUCED_AUTOMATED_ONLY";
      report.blockers.push("AUTOMATED_ONLY_IS_NOT_INDEPENDENT_SOURCE_APPROVAL");
      if(!report.storedEvidenceMatchesCurrent)report.blockers.push("STORED_SOURCE_HASH_DIFFERS_FROM_LIVE_SOURCE");
      if(id==="indonesialainen-bakwan-maissifritter"){
        report.sensitivities=sensitivity(evidence,"porkkana",[35,60,65,100]);
        report.blockers.push("CARROT_COUNT_NOT_MEASURED_60G_MODELED","BATTER_WATER_NOT_WEIGHED");
      }
      if(id==="kiinalainen-jianbing-munaletty"){
        report.sensitivities=sensitivity(evidence,"soijapaputahnaa",[10,15,20,30]);
        report.blockers.push("SOYBEAN_PASTE_PRODUCT_NOT_IDENTIFIED","SPOON_TO_GRAMS_UNVERIFIED");
      }
    }else{
      if(Object.values(displayed).some(value=>value!==null))
        report.blockers.push("NUMERIC_MACROS_WITHOUT_INGREDIENT_LEVEL_EVIDENCE");
      report.blockers.push("NO_INGREDIENT_LEVEL_NUTRITION_CALCULATION");
      if(id==="pohjoisafrikkalainen-maakouda")report.blockers.push("POTATO_EDIBLE_MASS_UNKNOWN","PUBLIC_QUARANTINE");
      if(id==="japanilainen-soba-aamiaiskeitto")report.blockers.push("SPINACH_BUNCH_MASS_UNKNOWN","DASHI_AND_BROTH_PRODUCT_UNKNOWN","GK100_SOURCE_SEALED");
      if(id==="meksikolainen-huevos-divorciados")report.blockers.push("BLACK_BEANS_COOKED_VS_DRY_UNKNOWN","GREEN_SALSA_PRODUCT_UNKNOWN");
    }
    assert.ok(report.blockers.length>0,"Missing unresolved evidence");
    result.push(report);
  }
  assert.equal(result.length,5);
  assert.equal(result.filter(x=>x.calculationStatus==="REPRODUCED_AUTOMATED_ONLY").length,2);
  assert.equal(result.filter(x=>x.calculationStatus==="NO_INDEPENDENT_CALCULATION").length,3);
  return result;
}

const direct=process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(direct){
  const root=path.resolve(import.meta.dirname,"../..");
  console.log(JSON.stringify({scope:"C_FIVE_HOLD_ONLY",approvedNutrition:0,approvedGk:0,results:await auditCFive(root)},null,2));
}

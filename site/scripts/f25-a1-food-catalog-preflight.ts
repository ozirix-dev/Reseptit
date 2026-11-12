/** F25 A1 catalogue audit: missing branded foods, missing polyols and unknown unit
 * masses must never become zero or a published four-macro nutrition record.
 */
import {createHash} from "node:crypto";
import {execFileSync} from "node:child_process";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {parseMarkdown} from "../src/content/markdown";
import {recipeFrontmatterSchema} from "../src/content/schema";
import {calculate, type Calculation, type FoodRecord, type IngredientInput} from "./nutrition-model";
import {recipeNutritionInputHash} from "./nutrition-evidence";
import {readF25HistoricalBlob} from "./f25-history";
import type Manifest from "../../meta/kaannokset/f25-a1-food-catalog-preflight-20261111.json";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const auditCommit="d5406c9a3b9c57254ec8a043b4d81977a9a46312";
const historicalFile=(file:string)=>execFileSync("git",["show",auditCommit+":"+file],{
  cwd:root,encoding:"utf8",maxBuffer:32*1024*1024,
});
const salt=(s:string)=>s==="suolaa maun mukaan";
export function runF25A1FoodCatalogPreflight() {
  const manifest=JSON.parse(historicalFile("meta/kaannokset/f25-a1-food-catalog-preflight-20261111.json")) as typeof Manifest;
  const foods=JSON.parse(historicalFile("docs/nutrition/food-records.json")) as FoodRecord[];
  const catalog=new Map(foods.map(f=>[f.id,f]));
  if(manifest.schemaVersion!==1||manifest.releaseAuthorized!==false||manifest.items.length!==4) throw Error("F25_A1_MANIFEST_INVALID");
  const rows=[];
  for(const item of manifest.items){
    const buf=readF25HistoricalBlob(root,item.gitBlobSha);
    const sha=createHash("sha1").update("blob "+buf.byteLength+"\0").update(buf).digest("hex");
    if(sha!==item.gitBlobSha) throw Error("F25_A1_SOURCE_CHANGED: "+item.recipeId);
    const md=parseMarkdown(buf.toString("utf8"));
    if(!md) throw Error("F25_A1_MISSING_SOURCE: "+item.recipeId);
    const data=recipeFrontmatterSchema.parse(md.data);
    if(data.recipe_id!==item.recipeId||data.language!=="fi"||data.servings!==item.servings||data.ingredients.length!==item.rowCount||item.matches.length!==item.rowCount||item.approved!==false) throw Error("F25_A1_SOURCE_MISMATCH: "+item.recipeId);
    const gaps:Array<{index:number;ingredient:string;reason:string}>=[];
    const inputs:IngredientInput[]=data.ingredients.map((ingredient,index)=>{
      const m=item.matches[index];
      if(!m||m.index!==index) throw Error("F25_A1_MAPPING_STALE");
      const record=m.recordId?catalog.get(m.recordId):undefined;
      if(m.recordId&&!record) throw Error("F25_A1_RECORD_MISSING: "+m.recordId);
      const unresolved=!salt(ingredient.item)&&(
        !record || !["per100g-edible","per100g-as-sold","per100g-prepared"].includes(record.basis)
        || record.per100g.polyols==null || (!record.polyolsSourceVerified&&!record.componentValues?.POLYL)
        || (!["g","kg"].includes(ingredient.unit)&&m.gramsPerUnit===null));
      if(unresolved) gaps.push({index,ingredient:ingredient.item,reason:m.review});
      return {item:ingredient.item,amount:ingredient.amount,unit:ingredient.unit,
        ...(record?{record}:{}),state:record?.state??"UNRESOLVED",matchEvidence:m.review,
        ...(m.gramsPerUnit===null?{}:{gramsPerUnit:m.gramsPerUnit,conversionEvidence:m.review}),
        edibleFraction:1,edibleEvidence:"Provisional full edible portion; review needed",
        retainedFraction:1,retentionEvidence:"Provisional full retention; review needed",
        ...(salt(ingredient.item)?{excludedReason:"Unquantified pure NaCl adds no four macros",
          omissionImpactEvidence:"Pure NaCl contains no carbohydrate, fibre, protein or fat",
          omissionImpactUpperBoundPerServing:{kcal:0,netCarbohydrate:0,totalCarbohydrate:0,protein:0,fat:0}}:{})
      };
    });
    const calc:Calculation={recipeId:item.recipeId,sourceHash:recipeNutritionInputHash(data),
      calculatedAt:"2026-11-11",servings:data.servings,scope:"Unapproved catalogue-only F25 A1 preflight",
      reviewerStatus:"AUTOMATED ONLY",carbohydrateOutput:"AVAILABLE_EXCLUDING_FIBRE",ingredients:inputs};
    const res=calculate(calc);
    if(!gaps.length||res.status!=="INSUFFICIENT SOURCE DATA") throw Error("F25_A1_FAIL_OPEN: "+item.recipeId);
    const values=[res.perServing.netCarbohydrate,res.totalCarbohydratePerServingG,res.perServing.protein,res.perServing.fat];
    rows.push({recipeId:item.recipeId,status:res.status,matched:inputs.filter(x=>x.record).length,
      sourceIngredients:inputs.length,gaps,macroFieldsAvailable:values.filter(x=>x!==null).length});
  }
  return {recipes:rows.length,authorized:0,rows,disposition:"HOLD until branded records, verified polyols and gram conversions are resolved"};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))
  process.stdout.write(JSON.stringify(runF25A1FoodCatalogPreflight(),null,2)+"\n");

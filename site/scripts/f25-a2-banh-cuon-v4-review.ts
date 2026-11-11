/** F25 A2 FI V4 exact-label replay. Read-only; never authorizes publication.
 * Per100ml values stay in millilitres; the GK-sealed shared nutrition-model is not modified.
 */
import {readFileSync} from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {parseMarkdown} from "../src/content/markdown";
import {recipeFrontmatterSchema} from "../src/content/schema";
import {recipeNutritionInputHash} from "./nutrition-evidence";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const read=(p:string)=>JSON.parse(readFileSync(path.join(root,p),"utf8"));
const ledger=read("docs/reviews/f25-a2-release/banh-cuon-v4-reproducible-nutrition-and-gk.json");
const metrics=["carbohydrate","protein","fat","fibre","polyols","salt"] as const;
type Metric=typeof metrics[number];
const round=(n:number)=>Math.round((n+Number.EPSILON)*1e6)/1e6;

export function replayBanhCuonV4(override?:{sauceUnit?:string}) {
  const raw=readFileSync(path.join(root,ledger.sourcePath),"utf8");
  const parsed=parseMarkdown(raw);
  if(!parsed)throw Error("F25_A2_V4_NO_DRAFT");
  const source=recipeFrontmatterSchema.parse(parsed.data);
  if(source.recipe_id!==ledger.recipeId||source.language!=="fi"||source.status!=="draft"
    ||source.ingredients.length!==7||ledger.ingredients.length!==7)
    throw Error("F25_A2_V4_IDENTITY_OR_STATUS_MISMATCH");
  const rows=source.ingredients.map((ingredient,index)=>{
    const data=ledger.ingredients[index];
    if(!data||ingredient.item!==data.item||ingredient.amount!==data.amount||ingredient.unit!==data.unit)
      throw Error("F25_A2_V4_INGREDIENT_DRIFT:"+index);
    const unit=ingredient.item==="Squid Brand -kalakastiketta" && override?.sauceUnit
      ? override.sauceUnit : ingredient.unit;
    if(!(["g","ml"].includes(unit))||data.basis!==("per100"+unit)
      ||!Number.isFinite(ingredient.amount)||ingredient.amount===null||ingredient.amount<0)
      throw Error("F25_A2_V4_LABEL_BASIS_MISMATCH:"+ingredient.item);
    if(!data.source||!data.nutrition||Object.keys(data.nutrition).length!==metrics.length)
      throw Error("F25_A2_V4_MISSING_BRANDED_RECORD:"+ingredient.item);
    const nutrition:Record<Metric,number|null>={} as Record<Metric,number|null>;
    for(const nutrient of metrics) {
      const value=data.nutrition[nutrient];
      if(value!==null&&(!Number.isFinite(value)||value<0))throw Error("F25_A2_V4_BAD_NUTRIENT:"+nutrient);
      nutrition[nutrient]=value===null?null:value*ingredient.amount/100;
    }
    return {item:ingredient.item,unit,
      grams:unit==="g"?ingredient.amount:null,
      millilitres:unit==="ml"?ingredient.amount:null,
      nutrition,retentionControlled:ingredient.item==="neutraalia paistoöljyä",
      issues:metrics.filter(nutrient=>nutrition[nutrient]===null).map(nutrient=>"Unknown nutrient "+nutrient)};
  });
  const oil=rows.find(x=>x.retentionControlled);
  if(!oil||oil.grams!==5)throw Error("F25_A2_V4_OIL_AMOUNT_CHANGED");
  const scenarios=[0,0.5,1].map(retention=>{
    const perServing:Record<Metric,number|null>={} as Record<Metric,number|null>;
    for(const nutrient of metrics){
      if(rows.some(row=>row.nutrition[nutrient]===null)){perServing[nutrient]=null;continue;}
      let sum=0;
      for(const row of rows){
        const value=row.nutrition[nutrient] as number;
        sum+=row.retentionControlled&&nutrient==="fat"?value*retention:value;
      }
      perServing[nutrient]=round(sum/ledger.servings);
    }
    return {retentionOf5gCookingOil:retention,perServing};
  });
  const sourceHash=recipeNutritionInputHash(source);
  const fish=rows.find(row=>row.item==="Squid Brand -kalakastiketta");
  if(!fish||fish.millilitres!==15||fish.grams!==null)throw Error("F25_A2_V4_FISH_VOLUME_MISMATCH");
  return {
    recipeId:source.recipe_id,sourceHash,servings:source.servings,
    status:"INSUFFICIENT SOURCE DATA" as const,
    publicationStatus:"WITHHELD_SOURCE_INCOMPLETE" as const,
    rows,
    perServing:scenarios[2].perServing,
    scenarioCalculations:scenarios,
    edibleInputGrams:null,
    totalCarbohydratePerServingG:null,
    omissionWithinTolerance:true,
    gk:null,
    publicationAuthorized:false,
    statement:"Full source-bound alternative calculation. Null polyols, unknown oil retention and unavailable exact human GI block release. No shared nutrition-model edit or density proxy.",
  };
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))
  process.stdout.write(JSON.stringify(replayBanhCuonV4(),null,2)+"\n");

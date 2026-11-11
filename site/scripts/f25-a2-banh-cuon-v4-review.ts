/** Research-only replay of the exact V4 FI draft. Never publishes numeric macro or GK claims. */
import {readFileSync} from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {parseMarkdown} from "../src/content/markdown";
import {recipeFrontmatterSchema} from "../src/content/schema";
import {recipeNutritionInputHash} from "./nutrition-evidence";
import {calculate, type FoodRecord, type Calculation} from "./nutrition-model";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const read=(p:string)=>JSON.parse(readFileSync(path.join(root,p),"utf8"));
const ledger=read("docs/reviews/f25-a2-release/banh-cuon-v4-reproducible-nutrition-and-gk.json");
const history=read("docs/nutrition/calculations/vietnamilainen-banh-cuon-sienilla.json");
const xeo=read("docs/nutrition/calculations/vietnamilainen-banh-xeo-aamiaisletut.json");
const make=(id:string,name:string,url:string,state:string,nutrients:FoodRecord["per100g"],polyolVerified=false,polyolEvidence=""):FoodRecord=>({
  id,name,sourceUrl:url,retrievedAt:"2026-11-11",licence:"Product public retail nutrition listing; verify pack before publication",
  state,basis:"per100g-as-sold",carbohydrateDefinition:"EU_AVAILABLE",
  polyolsSourceVerified:polyolVerified,polyolsEvidence:polyolEvidence,per100g:nutrients,
});
const sourceRecords:FoodRecord[]=[
  make("ean-6430041080152","Virtasalmen Viljatuote fine rice flour",
    "https://www.k-ruoka.fi/kauppa/tuote/viljatuote-hieno-riisijauho-500g-gton-6430041080152","dry fine rice flour",
    {carbohydrate:74,protein:8,fat:1.8,fibre:1,polyols:null}),
  make("ean-6418513014119","Farina tapioca starch",
    "https://www.k-ruoka.fi/kauppa/tuote/farina-tapiokatarkkelys-400g-gton-6418513014119","dry tapioca starch",
    {carbohydrate:86,protein:0,fat:0.1,fibre:0,polyols:null}),
  history.ingredients.find((r:any)=>r.item==="vettä").record,
  make("ean-6409100037192","HK Viljaporsaan jauheliha 10%",
    "https://www.hk.fi/tuotteet/hk-viljaporsaan-jauheliha-10/","raw ground pork 10 percent fat",
    {carbohydrate:0,protein:20,fat:10,fibre:0,polyols:null}),
  history.ingredients.find((r:any)=>r.item==="tuoreita herkkusieniä").record,
  {
    id:"ean-8850620888203-100ml",
    name:"Squid brand fish sauce 725ml",
    sourceUrl:"https://ctfood.se/fish-sauce-glass-12x725ml-squid-brand/?language=en",
    retrievedAt:"2026-11-11",
    licence:"CT Food product information; verify pack before publication",
    state:"commercial fish sauce, 15ml measured as a volume",
    basis:"per100ml-as-sold",
    carbohydrateDefinition:"EU_AVAILABLE",
    polyolsSourceVerified:false,
    polyolsEvidence:"Product label and ingredient list omit a numeric polyol declaration; do not invent zero",
    per100g:{},
    per100ml:{carbohydrate:3,protein:11,fat:0,fibre:0,polyols:null,sugars:2.8,kcal:56},
  },
  xeo.ingredients.find((r:any)=>r.item==="neutraalia paistoöljyä").record,
];
function requiredRecord(row:FoodRecord|undefined,i:number):FoodRecord {
  if(!row||!row.id)throw Error("F25_A2_V4_MISSING_RECORD:"+i);
  return row;
}
export function replayBanhCuonV4():ReturnType<typeof calculate> {
  const source=readFileSync(path.join(root,ledger.sourcePath),"utf8");
  const markdown=parseMarkdown(source);
  if(!markdown)throw Error("F25_A2_V4_INVALID_DRAFT_MARKDOWN");
  const data=recipeFrontmatterSchema.parse(markdown.data);
  if(data.status!=="draft"||data.language!=="fi"||data.recipe_id!==ledger.recipeId||
     data.ingredients.length!==sourceRecords.length||data.ingredients.length!==ledger.ingredients.length)
    throw Error("F25_A2_V4_SOURCE_IDENTITY_MISMATCH");
  for(let i=0;i<data.ingredients.length;i++){
    const item=data.ingredients[i],record=ledger.ingredients[i];
    if(item.item!==record.item||item.amount!==record.amount||item.unit!==record.unit)
      throw Error("F25_A2_V4_SOURCE_INGREDIENT_DRIFT:"+i);
  }
  const calc:Calculation={
    recipeId:data.recipe_id,sourceHash:recipeNutritionInputHash(data),
    calculatedAt:"2026-11-11",servings:data.servings,
    scope:"RESEARCH ONLY: 100 percent of measured 5g oil retained is an untested conservative high-fat scenario; product polyols missing; no public macros.",
    reviewerStatus:"AUTOMATED ONLY",carbohydrateOutput:"AVAILABLE_EXCLUDING_FIBRE",
    publicationStatus:"WITHHELD_SOURCE_INCOMPLETE",
    withholdingReason:"Fish sauce/rice flour/starch/pork product polyols not verified, oil retention unmeasured, independent review missing",
    ingredients:data.ingredients.map((item,i)=>{
      const record=requiredRecord(sourceRecords[i],i);
      const from=ledger.ingredients[i];
      const volume=record.basis==="per100ml-as-sold";
      return {
        item:item.item,amount:item.amount,unit:item.unit,
        record,state:record.state,
        matchEvidence:(from.ean?"Exact GTIN "+from.ean+"; ":"")+
          (volume?"Exact per100ml label and 15ml volume; no mass density imputed":"Source food state and manufacturer/AFCD label verified as a candidate"),
        ...(item.unit==="ml"?{gramsPerUnit:volume?undefined:1,
          conversionEvidence:volume?"1ml/1ml: direct per100ml product data, no density assumption":"Water 1g/ml at room temperature"}:{}),
        edibleFraction:1,edibleEvidence:"All measured source ingredient amount used",
        retainedFraction:1,
        retentionEvidence:i===6?"UNVERIFIED CONSERVATIVE SCENARIO: upper bound, all 5g cooking oil counted; pan retention not measured":"No discarded edible ingredient assumed in preliminary candidate",
      };
    })
  };
  return calculate(calc);
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))
  process.stdout.write(JSON.stringify(replayBanhCuonV4(),null,2)+"\n");

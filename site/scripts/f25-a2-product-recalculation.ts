/** F25 A2: replay named-product macro scenarios from sealed main nutrition inputs.
 * Research only: no product-label omission is converted to numeric zero or GK approval.
 */
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {readF25GateAtCreation, readF25HistoricalBlob} from "./f25-history";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const read=(p:string)=>JSON.parse(readFileSync(path.join(root,p),"utf8"));
const blob=(b:Buffer)=>createHash("sha1").update("blob "+b.byteLength+"\0").update(b).digest("hex");
const metrics=["carbohydrate","protein","fat","fibre","polyols"] as const;
type Metric=typeof metrics[number];
type Totals=Record<Metric,number>;
const round=(n:number)=>Math.round((n+Number.EPSILON)*1000)/1000;
const fail=(message:string):never=>{throw Error("F25_A2_PRODUCT_PRECHECK: "+message)};
function baseline(input:any) {
  const totals=Object.fromEntries(metrics.map(k=>[k,0])) as Totals;
  const rows=[] as Array<{item:string;massG:number;amounts:Totals}>;
  for(const a of input.ingredients){
    if(a.record==null){
      if(a.amount!==null||a.excludedReason==null||!a.omissionImpactUpperBoundPerServing)
        fail("unbounded omission "+input.recipeId+":"+a.item);
      for(const k of ["netCarbohydrate","protein","fat"]){
        if(a.omissionImpactUpperBoundPerServing[k]!==0)fail("nonzero omission "+a.item);
      }
      continue;
    }
    if(!Number.isFinite(a.amount)||a.amount<0)fail("invalid mass "+a.item);
    if(a.unit!=="g"&&(!Number.isFinite(a.gramsPerUnit)||a.gramsPerUnit<=0))
      fail("missing conversion "+a.item);
    const massG=a.amount*(a.gramsPerUnit??1)*(a.edibleFraction??1)*(a.retainedFraction??1);
    const amounts={} as Totals;
    for(const k of metrics){
      const v=a.record.per100g?.[k];
      if(!Number.isFinite(v)||v<0)fail("missing macro "+a.item+"/"+k);
      amounts[k]=v*massG/100; totals[k]+=amounts[k];
    }
    rows.push({item:a.item,massG,amounts});
  }
  return {recipeId:input.recipeId,servings:input.servings,totals,rows};
}
export function auditF25A2ProductRecalculation(){
  const manifest=read("meta/kaannokset/f25-a2-four-fi-draft-manifest-20261111.json");
  const brands=read("docs/reviews/2026-11-11-f25-a2-specific-label-models.json");
  const gate=readF25GateAtCreation(root);
  const sealedNutrition=read("docs/reviews/2026-11-11-f25-a2-four-nutrition-independent-crosscheck.json");
  if(sealedNutrition.status!=="RESEARCH_ONLY_HOLD"||sealedNutrition.recipes.length!==4)fail("unsealed nutrition crosscheck");
  if(manifest.stage!=="HOLD"||manifest.sources.length!==4||brands.status!=="HOLD_NOT_PUBLISHABLE")
    fail("unlocked base manifest");
  const rows=[] as any[];
  const baselines=new Map<string, ReturnType<typeof baseline>>();
  for(const entry of manifest.sources){
    const source=readF25HistoricalBlob(root,entry.sourceGitBlobSha);
    const draft=readFileSync(path.join(root,entry.candidatePath));
    if(blob(source)!==entry.sourceGitBlobSha||blob(draft)!==entry.candidateGitBlobSha)
      fail("source/draft hash mismatch "+entry.recipeId);
    if(entry.sourceStatus!=="HOLD"||entry.nutritionApproved!==false||entry.gkApproved!==false||entry.translationApproved!==false||
       gate.sources.find(x=>x.recipe_id===entry.recipeId)?.approval!==null)
      fail("invalid release authorization "+entry.recipeId);
    const evidence=sealedNutrition.recipes.find((x:any)=>x.id===entry.recipeId) ?? fail("missing nutrition evidence "+entry.recipeId);
    const nutritionBytes=readF25HistoricalBlob(root,evidence.legacyNutritionFileBlob);
    if(blob(nutritionBytes)!==evidence.legacyNutritionFileBlob)fail("nutrition blob changed "+entry.recipeId);
    const input=JSON.parse(nutritionBytes.toString("utf8"));
    if(input.recipeId!==entry.recipeId||input.servings!==entry.servings||input.sourceHash!==evidence.legacySourceHash)fail("source version mismatch");
    const base=baseline(input);
    baselines.set(entry.recipeId,base);
    const perServing=Object.fromEntries(metrics.map(k=>[k,round(base.totals[k]/base.servings)]));
    rows.push({recipeId:entry.recipeId,oldNutritionPerServing:perServing,productCandidates:[],approval:null,gk:null});
  }
  const tapi=rows.find(x=>x.recipeId==="vietnamilainen-papaija-kookospuuro");
  const tapiInput=baselines.get(tapi.recipeId)!;
  const tapiPearl=tapiInput.rows.find(x=>x.item==="tapiokahelmiä");
  const tapiCoconut=tapiInput.rows.find(x=>x.item==="kookosmaito");
  if(!tapiPearl||!tapiCoconut||brands.ingredients.pearls.per100g.carb!==86)throw Error("F25_A2_PRODUCT_PRECHECK: unknown tapioca source");
  const sourcePearlCarbsPer100G=tapiPearl.amounts.carbohydrate/tapiPearl.massG*100;
  if(!Number.isFinite(sourcePearlCarbsPer100G)||Math.abs(sourcePearlCarbsPer100G-79.3)>1e-9)throw Error("F25_A2_PRODUCT_PRECHECK: pearl source carbohydrate changed");
  for(const product of brands.ingredients.coconutMilkCandidates){
    if(product.volumeMl!==200||product.fibre!==null||product.polyols!==null)
      fail("incorrect coconut label completeness");
    const perServing:any={};
    for(const [k,labelKey] of [["carbohydrate","carb"],["protein","protein"],["fat","fat"]] as const){
      const sourceDiff=(brands.ingredients.pearls.per100g.carb-sourcePearlCarbsPer100G)*tapiPearl.massG/100;
      const changeCoconut=product.per100ml[labelKey]*product.volumeMl/100-tapiCoconut.amounts[k];
      perServing[k]=round((tapiInput.totals[k]+changeCoconut+(k==="carbohydrate"?sourceDiff:0))/tapiInput.servings);
    }
    tapi.productCandidates.push({ean:product.ean,perServingPartial:perServing,missing:["pearl_protein","pearl_fat","pearl_fibre","pearl_polyols","coconut_fibre","coconut_polyols"],approval:null});
  }
  const cuon=rows.find(x=>x.recipeId==="vietnamilainen-banh-cuon-sienilla");
  const flour=brands.ingredients.riceFlour, cuonInput=baselines.get(cuon.recipeId)!;
  const oldFlour=cuonInput.rows.find(x=>x.item==="riisijauho");
  if(!oldFlour||oldFlour.massG!==100||flour.per100g.fibre===null)throw Error("F25_A2_PRODUCT_PRECHECK: flour amount or model");
  const partial:any={};
  for(const [key,label] of [["carbohydrate","carb"],["protein","protein"],["fat","fat"],["fibre","fibre"]] as const)
    partial[key]=round((cuonInput.totals[key]-oldFlour.amounts[key]+flour.per100g[label]*oldFlour.massG/100)/cuonInput.servings);
  cuon.productCandidates.push({ean:flour.ean,perServingPartial:partial,missing:["fish_sauce_denominator","fish_sauce_density","rice_sheet_method"],approval:null});
  if(brands.ingredients.fishSauce.publishedPer100ml.protein===brands.ingredients.fishSauce.anomalousPublishedPer100g.protein)
    fail("different per100ml/per100g market labels silently conflated");
  const gk=read("docs/reviews/2026-11-11-f25-a2-gi-evidence-matching.json");
  if(gk.numericGkAuthorized!==false||gk.recipes.some((x:any)=>x.gk!==null||x.evidence.some((s:any)=>s.match==="EXACT")))
    fail("invalid GI/GK evidence promotion");
  return {status:"HOLD",checked:rows.length,rows,sourceVersion:"historical inputs only",nutritionApproval:false,gkApproval:false};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))
  process.stdout.write(JSON.stringify(auditF25A2ProductRecalculation(),null,2)+"\n");

import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {readFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

export const c5MarketManifest = "docs/reviews/2026-11-11-c5-market-label-variants.json";
const sha=(raw:string)=>createHash("sha1").update("blob "+Buffer.byteLength(raw,"utf8")+"\0").update(raw).digest("hex");
// Positive food masses; avoid binary 9.824999... rounding 9.825 downward.
const round=(value:number)=>Math.round((value+1e-10)*100)/100;
type Values={carbohydrateG:number;proteinG:number;fatG:number;fibreG:number|null;polyolsG?:number|null};
type Product={id:string;source:string;per100:Values;packageConfirmed:false;basis?:string;labelBasis?:string};
type Manifest={
 schemaVersion:1;status:"HOLD_MARKET_AND_PREPARATION_BASIS";
 approvedNutrition:false;approvedGk:false;selectedProduct:null;
 sourceBlobs:Record<string,string>;
 selectedRecipeQuantities:{jianbingSauceG:15;huevosDrainedBlackBeansG:150;huevosSalsaG:150;servings:2};
 jianbingProductVariants:Product[];
 huevosBeanVariants:Product[];
 huevosSalsaCandidate:Product;
 gates:string[];
};
const expectedSauceIds=["lkk-eu","lkk-au","lkk-hk"];
const expectedBeanIds=["gogreen-se","bonduelle","coop","menu"];
const expectedSauceCarbs=[22,15.8,16];
const expectedBeanCarbs=[8.5,13.1,13,15];
type OriginalRow={item:string;amount:number|null;unit:string;gramsPerUnit?:number;record?:{per100g:{carbohydrate:number;protein:number;fat:number}}};

export async function auditC5MarketLabels(root:string,provided?:Manifest){
 const m:Manifest=provided??JSON.parse(await readFile(path.join(root,c5MarketManifest),"utf8"));
 assert.equal(m.schemaVersion,1);
 assert.equal(m.status,"HOLD_MARKET_AND_PREPARATION_BASIS");
 assert.equal(m.approvedNutrition,false,"NO_NUTRITION_APPROVAL_FROM_MARKET_LABELS");
 assert.equal(m.approvedGk,false,"NO_GK_APPROVAL_FROM_MARKET_LABELS");
 assert.equal(m.selectedProduct,null,"NO_PRODUCT_SELECTED_WITHOUT_PACKAGE_VERIFICATION");
 assert.deepEqual(Object.keys(m.sourceBlobs).sort(),[
  "docs/nutrition/calculations/kiinalainen-jianbing-munaletty.json",
  "reseptit/raakileet/kiinalainen-jianbing-soy-bean-sauce-punnittu-v2.md",
  "reseptit/raakileet/meksikolainen-huevos-divorciados-kypsat-pavut-v2.md",
 ].sort());
 for(const [relative,blob] of Object.entries(m.sourceBlobs)){
  assert.match(relative,/^(docs\/nutrition\/calculations|reseptit\/raakileet)\/[a-z0-9-]+\.(json|md)$/);
  assert.equal(sha(await readFile(path.join(root,relative),"utf8")),blob,"SOURCE_CHANGED_REVIEW_REQUIRED:"+relative);
 }
 assert.deepEqual(m.selectedRecipeQuantities,{jianbingSauceG:15,huevosDrainedBlackBeansG:150,huevosSalsaG:150,servings:2});
 assert.deepEqual(m.jianbingProductVariants.map(p=>p.id),expectedSauceIds);
 assert.deepEqual(m.huevosBeanVariants.map(p=>p.id),expectedBeanIds);
 assert.equal(m.huevosSalsaCandidate.id,"la-costena-verde");
 assert(m.gates.length>=6);
 const all=[...m.jianbingProductVariants,...m.huevosBeanVariants,m.huevosSalsaCandidate];
 for(const p of all){
  assert.equal(p.packageConfirmed,false,"UNVERIFIED_PACKAGE_CANNOT_BE_APPROVED");
  assert.match(p.source,/^https:\/\//);
  for(const key of ["carbohydrateG","proteinG","fatG"] as const){
   assert(typeof p.per100[key]==="number"&&Number.isFinite(p.per100[key])&&p.per100[key]>=0);
  }
  assert.equal(p.per100.fibreG===null || typeof p.per100.fibreG==="number",true);
 }
 m.jianbingProductVariants.forEach((p,i)=>{
  assert.equal(p.per100.carbohydrateG,expectedSauceCarbs[i],"REGIONAL_SAUCE_LABEL_CHANGED_REVIEW_REQUIRED");
  assert.equal(p.per100.fibreG,null,"UNKNOWN_SAUCE_FIBRE_IS_NOT_ZERO");
  assert.equal(p.per100.polyolsG,null,"UNKNOWN_SAUCE_POLYOLS_ARE_NOT_ZERO");
 });
 m.huevosBeanVariants.forEach((p,i)=>{
  assert.equal(p.per100.carbohydrateG,expectedBeanCarbs[i],"BEAN_MARKET_LABEL_CHANGED_REVIEW_REQUIRED");
  assert.match(p.labelBasis??"",/basis_unconfirmed|at_sale_not_verified_drained/);
 });
 assert.equal(m.huevosSalsaCandidate.per100.carbohydrateG,3.9);
 assert.equal(m.huevosSalsaCandidate.per100.fibreG,null);
 assert.equal(m.huevosSalsaCandidate.per100.polyolsG,null);

 const stored=JSON.parse(await readFile(path.join(root,"docs/nutrition/calculations/kiinalainen-jianbing-munaletty.json"),"utf8")) as {
  servings:number;reviewerStatus:string;ingredients:OriginalRow[];
 };
 assert.equal(stored.servings,2);
 assert.equal(stored.reviewerStatus,"AUTOMATED ONLY");
 const old=stored.ingredients.find(x=>x.item==="soijapaputahnaa");
 assert(old?.record && old.amount===1 && old.gramsPerUnit===15 && old.unit==="rkl");
 const grams=(r:OriginalRow)=>r.unit==="g"?r.amount!:r.amount!*(r.gramsPerUnit??NaN);
 const sum=(field:"carbohydrate"|"protein"|"fat")=>stored.ingredients.reduce((total,i)=>{
  if(i.amount===null)return total;
  assert(i.record && Number.isFinite(grams(i)),i.item+":UNVERIFIED_MASS");
  return total+grams(i)*i.record.per100g[field]/100;
 },0)/stored.servings;
 const oldBasis={carbohydrate:sum("carbohydrate"),protein:sum("protein"),fat:sum("fat")};
 const oldPer100=old.record.per100g;
 const sauceOptions=m.jianbingProductVariants.map(p=>{
  const used=m.selectedRecipeQuantities.jianbingSauceG;
  return {id:p.id,market:("market" in p?p.market:undefined),
   projectedPerServing:{
    availableCarbohydratesGAssumingComparableDefinition:round(oldBasis.carbohydrate+(p.per100.carbohydrateG-oldPer100.carbohydrate)*used/100/2),
    proteinG:round(oldBasis.protein+(p.per100.proteinG-oldPer100.protein)*used/100/2),
    fatG:round(oldBasis.fat+(p.per100.fatG-oldPer100.fat)*used/100/2),
    totalCarbohydrateIncludingFibreG:null,
    gk:null,
   },productIdentityConfirmed:false,carbohydrateBasisConfirmed:false};
 });
 const beans=m.huevosBeanVariants.map(p=>({
  id:p.id,perServingBeansOnly:{
    availableCarbohydratesGAssumingDrainedLabelBasis:round(m.selectedRecipeQuantities.huevosDrainedBlackBeansG*p.per100.carbohydrateG/100/2),
    proteinGAssumingDrainedLabelBasis:round(m.selectedRecipeQuantities.huevosDrainedBlackBeansG*p.per100.proteinG/100/2),
    fatGAssumingDrainedLabelBasis:round(m.selectedRecipeQuantities.huevosDrainedBlackBeansG*p.per100.fatG/100/2),
   },drainedProductBasisVerified:false,wholeMealNutrition:false,gk:null,
 }));
 const salsa={
  id:m.huevosSalsaCandidate.id,
  perServingSalsaOnlyCarbohydratesG:round(m.selectedRecipeQuantities.huevosSalsaG*m.huevosSalsaCandidate.per100.carbohydrateG/100/2),
  productPackageVerified:false,totalCarbohydrateWithFibreG:null,gk:null,
 };
 return {status:"HOLD_MARKET_AND_PREPARATION_BASIS" as const,
  approvedNutrition:0,approvedGk:0,publicRecipeChanges:0,marketSauceVariants:sauceOptions,
  cannedBeans:beans,salsa};
}
const direct=process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(direct)console.log(JSON.stringify(await auditC5MarketLabels(path.resolve(import.meta.dirname,"../..")),null,2));

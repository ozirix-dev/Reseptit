import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import {auditC5MarketLabels,c5MarketManifest} from "../scripts/c5-market-label-audit";

const root=path.resolve(import.meta.dirname,"../..");
const load=async()=>JSON.parse(await readFile(path.join(root,c5MarketManifest),"utf8"));

test("C5: three market regions have distinct sauce carb labels; none approved as interchangeable",async()=>{
 const output=await auditC5MarketLabels(root);
 assert.equal(output.status,"HOLD_MARKET_AND_PREPARATION_BASIS");
 assert.equal(output.approvedNutrition,0);
 assert.equal(output.approvedGk,0);
 assert.equal(output.publicRecipeChanges,0);
 assert.deepEqual(output.marketSauceVariants.map(x=>x.id),["lkk-eu","lkk-au","lkk-hk"]);
 assert.deepEqual(output.marketSauceVariants.map(x=>
  x.projectedPerServing.availableCarbohydratesGAssumingComparableDefinition),[39.14,38.67,38.69]);
 assert.deepEqual(output.marketSauceVariants.map(x=>x.projectedPerServing.proteinG),[14.31,14.41,14.5]);
 assert.deepEqual(output.marketSauceVariants.map(x=>x.projectedPerServing.fatG),[15.4,15.43,15.46]);
 assert(output.marketSauceVariants.every(x=>x.projectedPerServing.totalCarbohydrateIncludingFibreG===null
 && x.projectedPerServing.gk===null && !x.carbohydrateBasisConfirmed && !x.productIdentityConfirmed));
});
test("C5: Finnish canned-bean labels vary; only beans and salsa components may be modeled",async()=>{
 const output=await auditC5MarketLabels(root);
 assert.deepEqual(output.cannedBeans.map(x=>x.id),["gogreen-se","bonduelle","coop","menu"]);
 assert.deepEqual(output.cannedBeans.map(x=>
  x.perServingBeansOnly.availableCarbohydratesGAssumingDrainedLabelBasis),[6.38,9.83,9.75,11.25]);
 assert(output.cannedBeans.every(x=>!x.drainedProductBasisVerified&&!x.wholeMealNutrition&&x.gk===null));
 assert.equal(output.salsa.id,"la-costena-verde");
 assert.equal(output.salsa.perServingSalsaOnlyCarbohydratesG,2.93);
 assert.equal(output.salsa.totalCarbohydrateWithFibreG,null);
 assert.equal(output.salsa.gk,null);
});
test("C5: altered evidence, fabricated fibre or blanket approvals fail closed",async()=>{
 const a=await load();a.approvedNutrition=true;
 await assert.rejects(auditC5MarketLabels(root,a),/NO_NUTRITION_APPROVAL_FROM_MARKET_LABELS/);
 const b=await load();b.sourceBlobs["reseptit/raakileet/kiinalainen-jianbing-soy-bean-sauce-punnittu-v2.md"]="0".repeat(40);
 await assert.rejects(auditC5MarketLabels(root,b),/SOURCE_CHANGED_REVIEW_REQUIRED/);
 const c=await load();c.jianbingProductVariants[0].per100.fibreG=0;
 await assert.rejects(auditC5MarketLabels(root,c),/UNKNOWN_SAUCE_FIBRE_IS_NOT_ZERO/);
 const d=await load();d.huevosBeanVariants[0].packageConfirmed=true;
 await assert.rejects(auditC5MarketLabels(root,d),/UNVERIFIED_PACKAGE_CANNOT_BE_APPROVED/);
 const e=await load();e.huevosBeanVariants[0].per100.carbohydrateG=9.65;
 await assert.rejects(auditC5MarketLabels(root,e),/BEAN_MARKET_LABEL_CHANGED_REVIEW_REQUIRED/);
});

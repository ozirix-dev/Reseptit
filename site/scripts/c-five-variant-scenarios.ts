import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { auditCFive } from "./c-five-nutrition-recheck";

export const scenarioPath = "docs/reviews/2026-11-11-c5-exact-variant-scenarios.json";
const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
const blobSha = (s: string) =>
  createHash("sha1").update("blob " + Buffer.byteLength(s,"utf8") + "\0").update(s).digest("hex");
const recipeIds = [
  "indonesialainen-bakwan-maissifritter",
  "kiinalainen-jianbing-munaletty",
  "meksikolainen-huevos-divorciados",
] as const;
type Variant = {
  key: string; recipeId: string; technicalDisposition: "HOLD_CANDIDATE" | "COMPARISON_ONLY";
  proposedQuantityG: number; source: string; versionType: string;
  evidenceGap: string[]; proposal: string; productPer100?: {
    labelCarbohydratesG: number; proteinG: number; fatG: number;
    fibreG: null; polyolsG: null;
  };
  sourcePer100?: { availableCarbohydratesG: number; proteinG: number; fibreG: number };
};
type Manifest = {
  schemaVersion: number; status: string; approved: boolean;
  sourceFiles: Record<string,string>;
  baselines: Record<string, {
    calculationBlob: string; ingredient: string; modeledMassG: number;
    servings: number; oldPer100: {availableCarbohydratesG: number; proteinG: number; fatG: number; fibreG:number};
    reviewerStatus: string;
  }>;
  variants: Variant[]; rules: string[];
};

const expectedKeys = [
  "bakwan-carrot-edible-60g",
  "jianbing-lee-kum-kee-soy-bean-sauce-15g",
  "huevos-black-beans-canned-150g",
  "huevos-black-beans-dry-150g",
];

function ingredientGrams(i: any): number {
  if (i.amount == null) return 0;
  if (i.unit === "g") return i.amount;
  assert(typeof i.gramsPerUnit === "number", "UNWEIGHED_INGREDIENT: " + i.item);
  return i.amount * i.gramsPerUnit;
}
function baselinePerServing(calc: any, field: "carbohydrate" | "protein" | "fat"): number {
  return calc.ingredients.reduce((acc: number,i: any) => {
    const grams=ingredientGrams(i);
    if(grams===0)return acc;
    assert(typeof i.record?.per100g?.[field] === "number", "MISSING_" + field + "_SOURCE: " + i.item);
    return acc + grams * i.record.per100g[field] / 100;
  },0)/calc.servings;
}

/**
 * Future version design: scenarios are illustrative and never count as
 * tested weights, approved product equivalence, macro approval or GI/GK.
 */
export async function evaluateC5DesignScenarios(root: string, data?: Manifest) {
  const m: Manifest = data ?? JSON.parse(await readFile(path.join(root,scenarioPath),"utf8"));
  assert.equal(m.schemaVersion,1);
  assert.equal(m.status,"PROPOSAL_ONLY_NO_PUBLICATION");
  assert.equal(m.approved,false);
  assert.deepEqual(Object.keys(m.sourceFiles).sort(),[...recipeIds].sort());
  assert.deepEqual(m.variants.map(x=>x.key),expectedKeys);
  assert(m.rules.length>=3);
  for (const id of recipeIds) {
    const raw=await readFile(path.join(root,"reseptit/aamupalat",id+".md"),"utf8");
    assert.equal(blobSha(raw),m.sourceFiles[id],id+": SOURCE_STALE");
  }
  const c=await auditCFive(root);
  assert(c.every(x=>x.status==="HOLD_EVIDENCE"),"SOURCE_AUDIT_NOT_HOLD");
  for(const v of m.variants){
    assert(recipeIds.includes(v.recipeId as typeof recipeIds[number]));
    assert(v.proposedQuantityG>0 && Number.isFinite(v.proposedQuantityG));
    assert(v.evidenceGap.length>=2 && v.proposal.length>75);
    assert(/^https:\/\//.test(v.source));
    assert(["HOLD_CANDIDATE","COMPARISON_ONLY"].includes(v.technicalDisposition));
  }

  const bakwan=m.variants[0];
  assert.equal(bakwan.recipeId,recipeIds[0]);
  assert.equal(bakwan.proposedQuantityG,60);
  assert.equal(bakwan.versionType,"DESIGNED_EXACT_AMOUNT_NOT_MEASURED");

  const jianbing=m.variants[1];
  const ref=m.baselines[recipeIds[1]];
  assert(jianbing.productPer100 && ref);
  assert.equal(ref.reviewerStatus,"AUTOMATED ONLY");
  assert.equal(jianbing.proposedQuantityG,15);
  assert.equal(ref.modeledMassG,15);
  const rawCalc=await readFile(path.join(root,"docs/nutrition/calculations",recipeIds[1]+".json"),"utf8");
  assert.equal(blobSha(rawCalc),ref.calculationBlob,"JIANBING_CALCULATION_STALE");
  const calc=JSON.parse(rawCalc);
  assert.equal(calc.reviewerStatus,"AUTOMATED ONLY");
  assert.equal(calc.servings,ref.servings);
  const original=calc.ingredients.find((x:any)=>x.item===ref.ingredient);
  assert(original);
  assert.equal(ingredientGrams(original),ref.modeledMassG);
  assert.equal(original.record.per100g.carbohydrate,ref.oldPer100.availableCarbohydratesG);
  assert.equal(original.record.per100g.protein,ref.oldPer100.proteinG);
  assert.equal(original.record.per100g.fat,ref.oldPer100.fatG);
  const newLabel=jianbing.productPer100;
  assert.equal(newLabel.fibreG,null,"MISSING_FIBRE_CANNOT_BE_ZERO");
  assert.equal(newLabel.polyolsG,null,"MISSING_POLYOLS_CANNOT_BE_ZERO");
  assert.equal(newLabel.labelCarbohydratesG,22);
  assert.equal(newLabel.proteinG,6.5);
  assert.equal(newLabel.fatG,5.2);

  const proposalOnlyCarb=baselinePerServing(calc,"carbohydrate")+
    (newLabel.labelCarbohydratesG-ref.oldPer100.availableCarbohydratesG)*jianbing.proposedQuantityG/100/calc.servings;
  const protein=baselinePerServing(calc,"protein")+
    (newLabel.proteinG-ref.oldPer100.proteinG)*jianbing.proposedQuantityG/100/calc.servings;
  const fat=baselinePerServing(calc,"fat")+
    (newLabel.fatG-ref.oldPer100.fatG)*jianbing.proposedQuantityG/100/calc.servings;
  const newScenario={
    recipeId:jianbing.recipeId,key:jianbing.key,
    perServingUnderCompatibleCarbohydrateBasis:{
      carbohydrateG:round2(proposalOnlyCarb),
      proteinG:round2(protein),fatG:round2(fat),
      carbohydratePlusFibreG:null, // actual branded fibre unavailable
      gk:null,
    },
    labelFibreAndPolyolsMissing:true,
    sourceNotIndependentManufacturerVerification:true,
    disposition:"HOLD_CANDIDATE" as const,
  };

  const canned=m.variants[2],dry=m.variants[3];
  assert.equal(canned.recipeId,recipeIds[2]);
  assert.equal(dry.recipeId,recipeIds[2]);
  assert(canned.sourcePer100 && dry.sourcePer100);
  assert.equal(canned.proposedQuantityG,150);
  assert.equal(dry.proposedQuantityG,150);
  assert.equal(canned.sourcePer100.availableCarbohydratesG,9.65);
  assert.equal(dry.sourcePer100.availableCarbohydratesG,47.8);
  const beanOnly=(v:Variant)=>({
    key:v.key,
    perServingBeanComponentOnly:{
      availableCarbohydratesG:round2(v.proposedQuantityG*v.sourcePer100!.availableCarbohydratesG/100/2),
      proteinG:round2(v.proposedQuantityG*v.sourcePer100!.proteinG/100/2),
      fibreG:round2(v.proposedQuantityG*v.sourcePer100!.fibreG/100/2),
    },
    isWholeRecipeNutrition:false,
    isComparableCookedServing:false,
    gk:null,
  });
  const states=[beanOnly(canned),beanOnly(dry)];
  return {
    status:"PROPOSAL_ONLY_NO_PUBLICATION" as const,
    originalRecipesModified:false,
    approvedMacro:0,approvedGk:0,variants:4,
    bakwan:{proposedEdibleCarrotG:60,verifiedKitchenWeighing:false,existingModelOnly:true},
    jianbing:newScenario,
    huevos:{states,productIdentityRequired:true,drainedWeightRequiresConfirmation:true},
  };
}
const direct = process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(direct)console.log(JSON.stringify(await evaluateC5DesignScenarios(path.resolve(import.meta.dirname,"../..")),null,2));

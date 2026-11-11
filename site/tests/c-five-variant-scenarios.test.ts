import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { evaluateC5DesignScenarios,scenarioPath } from "../scripts/c-five-variant-scenarios";

const root=path.resolve(import.meta.dirname,"../..");
const load=async()=>JSON.parse(await readFile(path.join(root,scenarioPath),"utf8"));

test("C5 exact-spec proposals are version-locked and never count as published or test-cooked",async()=>{
  const result=await evaluateC5DesignScenarios(root);
  assert.equal(result.status,"PROPOSAL_ONLY_NO_PUBLICATION");
  assert.equal(result.originalRecipesModified,false);
  assert.equal(result.approvedMacro,0);
  assert.equal(result.approvedGk,0);
  assert.equal(result.variants,4);
  assert.deepEqual(result.bakwan,{
    proposedEdibleCarrotG:60,verifiedKitchenWeighing:false,existingModelOnly:true,
  });
});

test("Jianbing: specified soy-bean sauce product changes partial macro projection, missing fibre stays unknown",async()=>{
  const result=await evaluateC5DesignScenarios(root);
  assert.deepEqual(result.jianbing.perServingUnderCompatibleCarbohydrateBasis,{
    carbohydrateG:39.14,proteinG:14.31,fatG:15.4,carbohydratePlusFibreG:null,gk:null,
  });
  assert.equal(result.jianbing.labelFibreAndPolyolsMissing,true);
  assert.equal(result.jianbing.disposition,"HOLD_CANDIDATE");
});

test("Huevos: dried versus canned is a DIFFERENT input state, not two cooked versions",async()=>{
  const result=await evaluateC5DesignScenarios(root);
  assert.deepEqual(result.huevos.states.map(s=>s.perServingBeanComponentOnly.availableCarbohydratesG),[7.24,35.85]);
  assert.ok(result.huevos.states.every(s=>!s.isWholeRecipeNutrition && !s.isComparableCookedServing && s.gk===null));
  assert.equal(result.huevos.drainedWeightRequiresConfirmation,true);
});

test("future proposal must fail closed for an altered recipe, invented product fibre or new approval",async()=>{
  const m=await load();
  m.sourceFiles["kiinalainen-jianbing-munaletty"]="0".repeat(40);
  await assert.rejects(evaluateC5DesignScenarios(root,m),/SOURCE_STALE/);
  const n=await load();
  n.variants[1].productPer100.fibreG=0;
  await assert.rejects(evaluateC5DesignScenarios(root,n),/MISSING_FIBRE_CANNOT_BE_ZERO/);
  const a=await load();
  a.approved=true;
  await assert.rejects(evaluateC5DesignScenarios(root,a),/Expected values to be strictly equal/);
  const b=await load();
  b.variants[2].sourcePer100.availableCarbohydratesG=100;
  await assert.rejects(evaluateC5DesignScenarios(root,b),/Expected values to be strictly equal/);
});

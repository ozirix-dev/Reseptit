import assert from "node:assert/strict";
import test from "node:test";
import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import path from "node:path";

const root=path.resolve(import.meta.dirname,"../..");
const read=(p:string)=>JSON.parse(readFileSync(path.join(root,p),"utf8"));
const evidence=read("docs/reviews/f25-a2-banh-cuon-xeo-v3-evidence-20261111.json");
const gitBlob=(raw:Buffer)=>createHash("sha1").update("blob "+raw.byteLength+"\0").update(raw).digest("hex");
const round=(v:number)=>Math.round(v*10000)/10000;

test("both V3 alternatives are separate from exact-blob historical FI sources and remain HOLD",()=>{
  assert.equal(evidence.schemaVersion,1);
  assert.equal(evidence.stage,"HOLD");
  assert.equal(evidence.recipes.length,2);
  const gate=read("meta/kaannokset/f25-release-gate.json");
  for(const r of evidence.recipes){
    assert.equal(gitBlob(readFileSync(path.join(root,r.sourcePath))),r.sourceGitBlob,r.recipeId);
    assert.equal(gitBlob(readFileSync(path.join(root,r.candidatePath))),r.candidateGitBlob,r.recipeId);
    assert.equal(gitBlob(readFileSync(path.join(root,"docs/nutrition/calculations/"+r.recipeId+".json"))),r.oldNutritionGitBlob,r.recipeId);
    const old=read("docs/nutrition/calculations/"+r.recipeId+".json");
    assert.equal(old.sourceHash,r.oldNutritionInputHash);
    assert.equal(gate.sources.find((x:any)=>x.recipe_id===r.recipeId)?.approval,null);
    assert.equal(r.nutritionApproved,false);
    assert.equal(r.gkApproved,false);
    assert.equal(r.gk,null);
    assert.equal(r.releaseAuthorized,false);
    assert.equal(r.physicalTrial,false);
    const draft=readFileSync(path.join(root,r.candidatePath),"utf8");
    assert.match(draft,/HOLD/);
    assert.match(draft,/## Valmistus/);
    assert.match(draft,/GK/);
    assert.ok(r.unknowns.length>=5);
  }
});

test("V3 ingredient-by-ingredient label and oil-retention scenarios cannot impute null polyols",()=>{
  for(const r of evidence.recipes){
    for(const [label,retention] of [["oilRetained0",0],["oilRetained50Percent",0.5],["oilRetained100Percent",1]] as const){
      const target=r.scenarios[label];
      for(const metric of ["carbohydrate","protein","fat","fibre","polyols"] as const){
        let sum=0,missing=false;
        for(const ingredient of r.ingredients){
          const value=ingredient.macros[metric];
          if(value===null){missing=true;continue;}
          const portion=ingredient.basis==="100g"||ingredient.basis==="100ml"?ingredient.amount/100:1;
          sum+=value*portion*(metric==="fat"&&ingredient.retention?retention:1);
        }
        assert.equal(target[metric],missing?null:round(sum/evidence.servings),r.recipeId+":"+label+":"+metric);
      }
      assert.equal(target.polyols,null);
    }
  }
  const cuon=evidence.recipes.find((r:any)=>r.recipeId==="vietnamilainen-banh-cuon-sienilla");
  const xeo=evidence.recipes.find((r:any)=>r.recipeId==="vietnamilainen-banh-xeo-aamiaisletut");
  assert.ok(cuon&&xeo);
  assert.equal(cuon.ingredients.find((a:any)=>a.item.includes("tapiokatärkkelys")).ean,"6418513014119");
  assert.equal(cuon.ingredients.find((a:any)=>a.item.includes("kalakastike")).basis,"100ml");
  assert.equal(cuon.scenarios.oilRetained100Percent.carbohydrate,46.225);
  assert.equal(xeo.ingredients.find((a:any)=>a.item.includes("kurkuma")).ean,"6420101882864");
  assert.equal(xeo.scenarios.oilRetained100Percent.carbohydrate,40.871);
  assert.equal(xeo.scenarios.oilRetained0.fibre,null);
});

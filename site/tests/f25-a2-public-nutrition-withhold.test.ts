import assert from "node:assert/strict";
import {test} from "node:test";
import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import path from "node:path";
import {f25UnverifiedNutritionSourceIds, withholdF25Nutrition} from "../src/features/recipes/f25-nutrition-withhold";
import {recipeJsonLd} from "../src/features/recipes/schema";

const a2 = [
  "vietnamilainen-papaija-kookospuuro",
  "vietnamilainen-banh-cuon-sienilla",
  "vietnamilainen-banh-xeo-aamiaisletut",
  "pohjoisafrikkalainen-baghrir",
] as const;
const root=path.resolve(import.meta.dirname,"../..");
const gate=JSON.parse(readFileSync(path.join(root,"meta/kaannokset/f25-release-gate.json"),"utf8")) as {
  sources:Array<{recipe_id:string;source_path:string;baseline_git_blob_sha:string;approval:null|unknown}>
};
const sha=(bytes:Buffer)=>createHash("sha1").update("blob "+bytes.length+"\0").update(bytes).digest("hex");
const fixture=(recipeId:string,locale:"fi"|"en") => ({
  recipeId, locale, title:"Test recipe", description:"Cooked food", category:"aamupala",
  tags:["test"], image:null, servings:2, ingredients:[{amount:100,unit:"g",item:"rice"}],
  instructionsText:["Mix and cook"], timeTotalMin:25,
  nutrition:{carbsTotalG:80,carbsNetG:77,proteinG:12,fatG:8}
}) as unknown as Parameters<typeof recipeJsonLd>[0];

test("all four F25 A2 unapproved FI sources have source-locked macro and GK withholding",()=>{
  assert.equal(new Set(f25UnverifiedNutritionSourceIds).size,f25UnverifiedNutritionSourceIds.length);
  assert.equal(f25UnverifiedNutritionSourceIds.length,8);
  for(const id of a2){
    const record=gate.sources.find(x=>x.recipe_id===id);
    assert.ok(record,id);
    assert.equal(record.approval,null);
    const bytes=readFileSync(path.join(root,record.source_path));
    assert.equal(sha(bytes),record.baseline_git_blob_sha,id+" source changed");
    assert.equal(withholdF25Nutrition(id,"fi"),true);
    const json=recipeJsonLd(fixture(id,"fi"));
    assert.ok(!Object.hasOwn(json,"nutrition"),id+" must not leak Schema.org macros");
  }
});

test("unrelated FI recipes retain nutrition, and locale check does not silently change",()=>{
  assert.equal(withholdF25Nutrition("gluteeniton-uunipannukakku","fi"),false);
  assert.equal(withholdF25Nutrition("vietnamilainen-papaija-kookospuuro","en"),false);
  const untouched=recipeJsonLd(fixture("gluteeniton-uunipannukakku","fi"));
  assert.deepEqual(untouched.nutrition,{
    "@type":"NutritionInformation",
    carbohydrateContent:"80 g",
    proteinContent:"12 g",
    fatContent:"8 g",
  });
});

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { parseMarkdown } from "../src/content/markdown";
import { siteContent } from "../src/generated/content.generated";
import { projectHuevosFiPublicPreparation } from "../scripts/huevos-c5-fi-public-preparation";

const relative="reseptit/aamupalat/meksikolainen-huevos-divorciados.md";
const root=path.resolve(import.meta.dirname,"../..");

test("Huevos C5 public FI preparation clarifies drained beans without changing sealed source data",async()=>{
  const raw=await readFile(path.join(root,relative),"utf8");
  const visible=projectHuevosFiPublicPreparation(relative,raw);
  const before=parseMarkdown(raw),after=parseMarkdown(visible);
  assert.ok(before && after);
  for(const field of ["recipe_id","url_slug","category","language","status","servings","ingredients",
    "carbs_net_per_serving_g","carbs_total_per_serving_g","protein_per_serving_g",
    "fat_per_serving_g","image"]){
    assert.deepEqual(after.data[field],before.data[field],field);
  }
  assert.equal(after.data.status,"published");
  assert.match(after.content,/Valuta ja huuhtele pavut/);
  assert.match(after.content,/150 g syötävää papumassaa/);
  assert.match(after.content,/Yksi tomaatti ei ole sama kuin punnittu 120 g/);
  assert.match(after.content,/ehdollisia makroja/);
  assert.equal((after.content.match(/^\d+\. /gm)??[]).length,4);
  assert.throws(()=>projectHuevosFiPublicPreparation(relative,raw+"\nUNREVIEWED"),/HUEVOS_C5_SOURCE_STALE/);
  assert.equal(projectHuevosFiPublicPreparation("reseptit/aamupalat/muu.md",raw),raw);
});
test("Published FI catalog shows repaired huevos preparation while V2 stays draft",()=>{
  const current=siteContent.recipes.find(r=>r.recipeId==="meksikolainen-huevos-divorciados" && r.locale==="fi");
  assert.ok(current);
  assert.match(current.instructionsText.join(" "),/Valuta ja huuhtele pavut/);
  assert.match(current.instructionsText.join(" "),/75 g kypsiä valutettuja papuja/);
  assert.equal(siteContent.recipes.some(r=>r.recipeId==="meksikolainen-huevos-divorciados-kypsat-pavut-v2"),false);
});

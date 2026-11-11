import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";

const root = fileURLToPath(new URL("../../", import.meta.url));
const list = [
  { file: "reseptit/leivonnaiset/gluteeniton-siemenvuokaleipa.md", id: "gluteeniton-siemenvuokaleipa", portions: 12, macro: [27.45,3.98,3.08], length: 9 },
  { file: "reseptit/leivonnaiset/gluteenittomat-kauralesesampylat.md", id: "gluteenittomat-kauralesesampylat", portions: 16, macro: [10.14,2.13,3.69], length: 10 },
] as const;
test("two published gluten-free FI breads require exact reviewed ingredients and images", () => {
  for(const expected of list){
    const s = readFileSync(path.join(root, expected.file), "utf8");
    const recipe = parseMarkdown(s);
    assert.ok(recipe, expected.id);
    const data = recipeFrontmatterSchema.parse(recipe.data);
    assert.equal(data.recipe_id,expected.id);
    assert.equal(data.status,"published");
    assert.equal(data.gluten_free,true);
    assert.ok(data.gluten_free_review);
    assert.equal(data.gluten_free_review.evidence_ref,"docs/reviews/gluteeniton/"+expected.id+".md");
    assert.equal(data.language,"fi");
    assert.equal(data.servings,expected.portions);
    assert.equal(data.ingredients.length,expected.length);
    assert.ok(data.ingredients.every(x=>x.unit==="g"&&x.amount!==null&&x.amount>0));
    assert.deepEqual([data.carbs_net_per_serving_g,data.protein_per_serving_g,data.fat_per_serving_g],expected.macro);
    assert.equal(data.carbs_total_per_serving_g,null);
    assert.equal(data.image?.width,1500);
    assert.equal(data.image?.height,1000);
  }
  const buns=readFileSync(path.join(root,list[1].file),"utf8");
  const prep=buns.split("## Valmistus")[1]?.split("## Muistiinpanot")[0]??"";
  assert.match(prep,/Ripottele ainesosaluettelosta mitatut/);
  assert.doesNotMatch(prep,/\b5\s*g\b/);
  assert.doesNotMatch(prep,/yhteen desilitraan/);
});

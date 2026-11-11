import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";

const root = fileURLToPath(new URL("../../", import.meta.url));
const sample = [
  { file: "reseptit/leivonnaiset/gluteeniton-siemenvuokaleipa.md", id: "gluteeniton-siemenvuokaleipa", servings: 12, list: [
    ["vettä",600],["psyllium",8],["pellavansiemeniä",20],["auringonkukansiemeniä",27],["suolaa",8],
    ["kaurahiutaleita",70],["kuivahiivaa",11],["vaaleaa gluteenitonta",210],["tummaa gluteenitonta",180],
  ]},
  { file: "reseptit/leivonnaiset/gluteenittomat-kauralesesampylat.md", id: "gluteenittomat-kauralesesampylat", servings: 16, list: [
    ["vettä",500],["kuivahiivaa",11],["psyllium",4],["siirappia",21],["suolaa",5],["kauralesettä",100],
    ["Pofiber",43],["tummaa gluteenitonta",120],["rypsiöljyä",45],["kaurahiutaleita",5],
  ]},
] as const;
test("the two gluten-free bread drafts preserve exact quantified ingredients and remain unpublished", () => {
  for (const expected of sample) {
    const source = readFileSync(path.join(root, expected.file), "utf8");
    const parsed = parseMarkdown(source);
    assert.ok(parsed, expected.id);
    const data = recipeFrontmatterSchema.parse(parsed.data);
    assert.equal(data.recipe_id, expected.id);
    assert.equal(data.url_slug, expected.id);
    assert.equal(data.status, "draft");
    assert.notEqual(data.gluten_free, true);
    assert.equal(data.servings, expected.servings);
    assert.equal(data.ingredients.length, expected.list.length);
    for (const [part,grams] of expected.list) {
      const hits = data.ingredients.filter(row => row.item.includes(part));
      assert.equal(hits.length, 1, `${expected.id} missing or duplicate ${part}`);
      assert.equal(hits[0].amount, grams, `${expected.id} incorrect amount of ${part}`);
      assert.equal(hits[0].unit, "g", `${expected.id} incorrect unit of ${part}`);
    }
  }
  const buns = readFileSync(path.join(root, sample[1].file), "utf8");
  assert.match(buns, /Ripottele ainesosaluettelosta mitatut gluteenittomat kaurahiutaleet/);
  const preparation = buns.split("## Valmistus")[1]?.split("## Muistiinpanot")[0] ?? "";
  assert.doesNotMatch(preparation, /\b5\s*g\b/, "A fixed 5 g instruction would not scale with serving count");
  assert.doesNotMatch(preparation, /yhteen desilitraan/, "Preparation must use the already weighed flour, not an extra volume measure");
  assert.match(preparation, /3–5 minuuttia/, "Mixing stage must follow gluten-free yeast dough guidance");
  const loafSource = readFileSync(path.join(root, sample[0].file), "utf8");
  assert.match(loafSource, /3–5 minuuttia/);
  assert.match(loafSource, /Jätä vuokaan taikinan kohoamiselle riittävästi tilaa/);
  assert.doesNotMatch(buns, /annosteltu ruokalusikallinen gluteenittomia kaurahiutaleita/);
});

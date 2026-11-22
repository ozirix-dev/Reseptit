import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { parseMarkdown } from "../src/content/markdown";

const root = new URL("../../", import.meta.url);
const inventory = JSON.parse(readFileSync(new URL("docs/reviews/new-recipes/chat4-eight-starters-translation-snapshot.json", root), "utf8"));
const langs = ["en", "sv", "th"] as const;
const expectedUnits: Record<string,Record<string,string>> = {
  en: {tl: "tsp", kpl: "pcs"}, sv: {tl: "tsk", kpl: "st"},
  th: {tl: "ช้อนชา", kpl: "ชิ้น"}
};
// Item-specific Thai counters are semantic units, not generic pieces.
// Pin the known exceptions to exact recipe IDs and ingredient positions.
const thaiCounters: Record<string, Record<number, string>> = {
  "lasimestarin-silli": { 7: "เม็ด", 8: "ใบ" },
  "pienet-kantarellipiiraat": { 8: "ฟอง" },
  "sillikaviaari-ruisnapeilla": { 1: "ฟอง" },
  "nokkosletut-puolukoilla": { 3: "ฟอง" },
};
type Parsed = { data: { [key:string]: any }; content: string };
function load(path: string): Parsed {
  const md = parseMarkdown(readFileSync(new URL(path, root), "utf8"));
  assert.ok(md, path + ": valid frontmatter");
  return md as Parsed;
}
function stepCount(body: string): number {
  return [...body.matchAll(/^\d+\. /gm)].length;
}

test("Chat-4 eight starters: 24 draft translations retain amounts, meanings' structural anchors and publication gate", () => {
  assert.equal(inventory.publication_authorized_for_translations, false);
  assert.equal(inventory.independent_semantic_approval, false);
  let checked = 0;
  for (const id of inventory.recipes as string[]) {
    const fi = load(`reseptit/alkuruoat/${id}.md`);
    assert.equal(fi.data.status, "published");
    for (const lang of langs) {
      const path = `kaannokset/${lang}/alkuruoat/${id}.md`;
      const tr = load(path);
      assert.equal(tr.data.status, "draft", path);
      assert.equal(tr.data.recipe_id, fi.data.recipe_id, path);
      assert.equal(tr.data.translation_of, id, path);
      assert.equal(tr.data.servings, fi.data.servings, path);
      assert.equal(tr.data.time_total_min, fi.data.time_total_min, path);
      const a = fi.data.ingredients, b = tr.data.ingredients;
      assert.equal(b.length, a.length, path + " ingredient count");
      for (let k=0; k<a.length; k++) {
        assert.equal(b[k].amount, a[k].amount, path + " amount " + k);
        const expectedUnit = lang === "th" && a[k].unit === "kpl"
          ? (thaiCounters[id]?.[k] ?? expectedUnits.th.kpl)
          : (expectedUnits[lang][a[k].unit] ?? a[k].unit);
        assert.equal(b[k].unit, expectedUnit, path + " unit " + k);
        assert.ok(String(b[k].item ?? "").trim(), path + " translated item " + k);
      }
      assert.equal(stepCount(tr.content), stepCount(fi.content), path + " instruction steps");
      checked++;
    }
  }
  assert.equal(checked, 24);
});

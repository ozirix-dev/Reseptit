import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { parseMarkdown } from "../src/content/markdown";

const source = parseMarkdown(readFileSync(new URL("../../reseptit/alkuruoat/gazpacho.md", import.meta.url), "utf8"));
const target = parseMarkdown(readFileSync(new URL("../../kaannokset/th/alkuruoat/gazpacho.md", import.meta.url), "utf8"));

test("Chat 4 gazpacho: published TH uses one garlic clove, not one whole bulb", () => {
  assert.ok(source && target);
  assert.equal(source.data.recipe_id, "gazpacho");
  assert.equal(target.data.recipe_id, "gazpacho");
  assert.equal(target.data.translation_of, "gazpacho");
  assert.equal(target.data.status, "published");
  const fi = source.data.ingredients as Array<{ amount: number; unit: string; item: string }>;
  const th = target.data.ingredients as Array<{ amount: number; unit: string; item: string }>;
  assert.equal(fi.length, th.length);
  const garlicIndex = fi.findIndex(x => x.item === "valkosipulinkynttä");
  assert.ok(garlicIndex >= 0);
  assert.deepEqual([fi[garlicIndex].amount, fi[garlicIndex].unit], [1, "kpl"]);
  assert.deepEqual([th[garlicIndex].amount, th[garlicIndex].unit, th[garlicIndex].item], [1, "กลีบ", "กระเทียม"]);
  for (let i=0; i<fi.length; i++) assert.equal(th[i].amount, fi[i].amount, "quantity index "+i);
});

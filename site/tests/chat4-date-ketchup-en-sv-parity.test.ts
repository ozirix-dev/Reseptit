import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { parseMarkdown } from "../src/content/markdown";

test("Chat-4 date ketchup EN/SV garlic clove and soaking water parity", () => {
  const id = "taateliketsuppi";
  const fi = parseMarkdown(readFileSync(new URL("../../reseptit/alkuruoat/" + id + ".md", import.meta.url), "utf8"));
  assert.ok(fi);
  const ingredients = fi.data.ingredients as Array<{ amount: number; item: string }>;
  const garlicIndex = ingredients.findIndex((item) => item.item === "valkosipulinkynsi");
  const waterIndex = ingredients.findIndex((item) => item.item === "vettä");
  assert.ok(garlicIndex >= 0 && waterIndex >= 0);
  for (const lang of ["en", "sv"] as const) {
    const text = readFileSync(new URL("../../kaannokset/" + lang + "/alkuruoat/" + id + ".md", import.meta.url), "utf8");
    const parsed = parseMarkdown(text);
    assert.ok(parsed);
    assert.equal(parsed.data.status, "published");
    assert.equal(parsed.data.recipe_id, id);
    assert.equal(parsed.data.translation_of, id);
    assert.equal(parsed.data.servings, 8);
    assert.equal(parsed.data.time_total_min, 25);
    const target = parsed.data.ingredients as Array<{ amount: number; item: string; note?: string }>;
    assert.equal(target.length, ingredients.length);
    for (let i = 0; i < ingredients.length; i++) assert.equal(target[i].amount, ingredients[i].amount);
    assert.equal(target[garlicIndex].amount, 3);
    assert.match(target[garlicIndex].note ?? "", lang === "en" ? /about 1 clove/ : /ungefär 1 klyfta/);
    assert.match(target[waterIndex].note ?? "", lang === "en" ? /separate water to soak/ : /separat vatten till blötläggningen/);
    assert.doesNotMatch(target[garlicIndex].note ?? "", /\b(?:nail|spik)\b/i);
    assert.match(parsed.content, lang === "en" ? /discard the soaking water/ : /släng blötläggningsvattnet/);
    assert.match(parsed.content, lang === "en" ? /AI-generated illustration/ : /AI-genererad illustration/);
  }
});

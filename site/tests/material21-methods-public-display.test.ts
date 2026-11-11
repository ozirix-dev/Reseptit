import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { parseMarkdown } from "../src/content/markdown";
import { material21MethodPaths, projectMaterial21MethodsFi } from "../scripts/material21-methods-public-display";

const root = path.resolve(import.meta.dirname, "../..");
const expected = {
  "japanilainen-soba-aamiaiskeitto": ["dashi", "900 ml", "kananmuna"],
  "kiinalainen-jianbing-munaletty": ["180 ml", "soijapaputahnasta", "seesamista"],
} as const;

test("two method-only B21 FI displays preserve the source-sealed ingredient and nutrition identity", async () => {
  assert.equal(material21MethodPaths.length, 2);
  for (const [id, words] of Object.entries(expected)) {
    const relative = `reseptit/aamupalat/${id}.md`;
    assert.ok(material21MethodPaths.includes(relative));
    const original = await readFile(path.join(root, relative), "utf8");
    const shown = projectMaterial21MethodsFi(relative, original);
    assert.notEqual(shown, original);
    const before = parseMarkdown(original), after = parseMarkdown(shown);
    assert.ok(before && after);
    const b = recipeFrontmatterSchema.parse(before.data), a = recipeFrontmatterSchema.parse(after.data);
    assert.deepEqual(a.ingredients, b.ingredients);
    assert.equal(a.recipe_id, b.recipe_id);
    assert.equal(a.servings, b.servings);
    assert.equal(a.time_total_min, b.time_total_min);
    for (const key of ["carbs_net_per_serving_g","carbs_total_per_serving_g","protein_per_serving_g","fat_per_serving_g"] as const) assert.equal(a[key], b[key]);
    const page = siteContent.recipes.find(r => r.recipeId === id && r.locale === "fi");
    assert.ok(page);
    for (const word of words) assert.ok(page.instructionsText.join(" ").includes(word), id + ": " + word);
    assert.throws(() => projectMaterial21MethodsFi(relative, original.replace("25", "26")), /B21_METHOD_SOURCE_STALE/);
  }
});

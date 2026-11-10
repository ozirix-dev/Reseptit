import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { material21FiPaths, projectMaterial21FiDisplay } from "../scripts/material21-fi-public-display";

const cases = [
  ["indonesialainen-bakwan-maissifritter", /100 g maissinjyviä/, /pihvitaikinapohjasta/],
  ["meksikolainen-huevos-divorciados", /tomaattikastikkeeksi/, /papujen raaka\/kypsä-painon/],
  ["lahi-ita-labneh-kulho-zaatarilla", /Älä lisää oliiviöljyä/, /kylmäannos/],
] as const;
const root = path.resolve(import.meta.dirname, "../..");

test("three exact-Git-blob FI corrections preserve nutrition and source identity", async () => {
  assert.equal(material21FiPaths.length, 3);
  for (const [id, step, note] of cases) {
    const relative = `reseptit/aamupalat/${id}.md`;
    assert.ok(material21FiPaths.includes(relative));
    const raw = await readFile(path.join(root, relative), "utf8");
    const shown = projectMaterial21FiDisplay(relative, raw);
    assert.notEqual(raw, shown);
    const source = parseMarkdown(raw), display = parseMarkdown(shown);
    assert.ok(source && display);
    const before = recipeFrontmatterSchema.parse(source.data);
    const after = recipeFrontmatterSchema.parse(display.data);
    assert.deepEqual(after.ingredients, before.ingredients);
    assert.equal(after.servings, before.servings);
    for (const key of ["carbs_net_per_serving_g", "carbs_total_per_serving_g", "protein_per_serving_g", "fat_per_serving_g"] as const)
      assert.equal(after[key], before[key]);
    assert.match(display.content, step);
    assert.match(display.content, note);
    const publicFi = siteContent.recipes.find(r => r.recipeId === id && r.locale === "fi");
    assert.ok(publicFi, id);
    assert.match(publicFi.instructionsText.join(" "), step);
    assert.throws(() => projectMaterial21FiDisplay(relative, raw + "\n# Unknown edit"), /MATERIAL21_FI_SOURCE_STALE/);
  }
});

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { material21FiPaths, projectMaterial21FiDisplay } from "../scripts/material21-fi-public-display";

const cases = [
  ["indonesialainen-bakwan-maissifritter", /100 g maissinjyviä/, /porkkanan syötävää grammapainoa/],
  ["meksikolainen-huevos-divorciados", /tomaattikastikkeeksi/, /papujen raaka\/kypsä-painon/],
] as const;
const root = path.resolve(import.meta.dirname, "../..");

test("two B21 cooking methods now live in canonical FI; labneh retains SHA overlay", async () => {
  assert.deepEqual(material21FiPaths, ["reseptit/aamupalat/lahi-ita-labneh-kulho-zaatarilla.md"]);
  for (const [id, step, note] of cases) {
    const relative = `reseptit/aamupalat/${id}.md`;
    const raw = await readFile(path.join(root, relative), "utf8");
    assert.equal(projectMaterial21FiDisplay(relative, raw), raw);
    const source = parseMarkdown(raw);
    assert.ok(source);
    const data = recipeFrontmatterSchema.parse(source.data);
    assert.equal(data.language, "fi");
    assert.equal(data.status, "published");
    assert.equal(data.servings, 2);
    assert.match(source.content, step);
    assert.match(source.content, note);
    if (id === "indonesialainen-bakwan-maissifritter") {
      const current = siteContent.recipes.filter(r => r.recipeId === "indonesialainen-bakwan-jagung-kotiversio");
      assert.deepEqual(current.map(r => r.locale).sort(), ["en", "fi", "sv", "th"]);
      for (const page of current) {
        assert.equal(page.slug, id);
        assert.deepEqual(page.nutrition, {carbsNetG:null, carbsTotalG:null, proteinG:null, fatG:null});
        assert.deepEqual(page.ingredients.map(x => x.amount), [200, 80, 80, 12, 1.5, 30]);
      }
      assert.ok(!siteContent.recipes.some(r => r.recipeId === id));
      continue;
    }
    const publicFi = siteContent.recipes.find(r => r.recipeId === id && r.locale === "fi");
    assert.ok(publicFi, id);
    assert.match(publicFi.instructionsText.join(" "), step);
    assert.deepEqual(publicFi.ingredients.map(x => x.item), data.ingredients.map(x => x.item));
    assert.equal(publicFi.nutrition?.carbsNetG ?? null, data.carbs_net_per_serving_g ?? null);
    assert.equal(publicFi.nutrition?.carbsTotalG ?? null, data.carbs_total_per_serving_g ?? null);
    assert.equal(publicFi.nutrition?.proteinG ?? null, data.protein_per_serving_g ?? null);
    assert.equal(publicFi.nutrition?.fatG ?? null, data.fat_per_serving_g ?? null);
  }
  const relative = "reseptit/aamupalat/lahi-ita-labneh-kulho-zaatarilla.md";
  const raw = await readFile(path.join(root, relative), "utf8");
  const projected = projectMaterial21FiDisplay(relative, raw);
  assert.notEqual(projected, raw);
  assert.match(projected, /Älä lisää oliiviöljyä/);
  assert.throws(() => projectMaterial21FiDisplay(relative, raw + "\\n# Unreviewed edit"), /MATERIAL21_FI_SOURCE_STALE/);
});

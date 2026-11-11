import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { publicRecipeQuarantineIds, isPublicRecipeQuarantined } from "../scripts/public-recipe-quarantine";
import { material21FiPaths, projectMaterial21FiDisplay } from "../scripts/material21-fi-public-display";
import { material21MethodPaths, projectMaterial21MethodsFi } from "../scripts/material21-methods-public-display";
import { c13PublicFiPaths, projectC13FiDisplay } from "../scripts/c13-fi-public-display";
import { c13CanonicalHistoryPaths } from "./c13-canonical-historical-transition";
import { reviewedThreeCanonicalPaths } from "./issue404-three-canonical-history";
import { parseMarkdown } from "../src/content/markdown";
import { siteContent } from "../src/generated/content.generated";

/** Issue #404: 21 quarantine + 8 source-sealed FI overlays + 9 canonical FI method migrations.
 * This is NOT an approval of underlying nutrition, GK, translations or safety.
 * Update the inventory only alongside an audited release decision. */
const issue404 = [
  "karibia-bammy-kassavaleipa",
  "karibia-ackee-ja-suolakala",
  "kiinalainen-katkarapu-wontonkeitto",
  "vietnamilainen-banh-bao-kananmunalla",
  "indonesialainen-bakwan-maissifritter",
  "indonesialainen-nasi-goreng-aamiaisriisi",
  "japanilainen-yaki-onigiri-misolla",
  "karibia-saltfish-fritterit",
  "malesialainen-roti-canai-dhalilla",
  "pohjoisafrikkalainen-maakouda",
  "pohjoisafrikkalainen-msemen-hunajalla",
  "indonesialainen-lontong-sayur-aamiaiseksi",
  "japanilainen-miso-tofu-paksoi",
  "japanilainen-soba-aamiaiskeitto",
  "kiinalainen-jianbing-munaletty",
  "korealainen-mandu-keitto-aamiaiseksi",
  "meksikolainen-huevos-divorciados",
  "valimerellinen-appelsiini-aamiaiskakku",
  "valimerellinen-kikherne-yrttiaamiainen",
  "intialainen-idli-kookoschutneylla",
  "intialainen-pesarattu-mungpavuista",
  "kiinalainen-bao-munalla",
  "lahi-ita-labneh-kulho-zaatarilla",
  "malesialainen-kuih-seri-muka",
  "vietnamilainen-xoi-maapahkinalla",
  "indialainen-poha-maapahkinoilla",
  "intialainen-aloo-paratha",
  "lahi-ita-manakish-zaatarilla",
  "malesialainen-kaya-paahtoleipa",
  "valimerellinen-halloumi-tomaattileipa",
  "intialainen-rava-uttapam",
  "lahi-ita-ful-medames",
  "malesialainen-laksa-lemak-aamiaiseksi",
  "meksikolainen-aamiais-tacot-mustapavuilla",
  "valimerellinen-menemen-fetalla",
  "valimerellinen-pinaatti-fetashakshuka",
  "vietnamilainen-pho-ga-aamuksi",
  "intialainen-mannasuurimoupma",
] as const;

const root = path.resolve(import.meta.dirname, "../..");
const displayCorrections = [
  ...material21FiPaths.map(relative => ({ relative, apply: projectMaterial21FiDisplay })),
  ...material21MethodPaths.map(relative => ({ relative, apply: projectMaterial21MethodsFi })),
  ...c13PublicFiPaths.map(relative => ({ relative, apply: projectC13FiDisplay })),
];
const recipeId = (relative: string) => path.basename(relative, ".md");
const canonicalMethodOnly = [
  "indonesialainen-bakwan-maissifritter",
  "meksikolainen-huevos-divorciados",
  ...c13CanonicalHistoryPaths.map(p => recipeId(p)),
  ...reviewedThreeCanonicalPaths.map(p => recipeId(p)),
] as const;
const sorted = (values: readonly string[]) => [...values].sort();

test("issue #404 all 38 are either quarantined or protected by a source-sealed FI display correction", () => {
  const quarantined = [...publicRecipeQuarantineIds];
  const corrected = displayCorrections.map(item => recipeId(item.relative));
  assert.equal(new Set(issue404).size, 38, "audit inventory must contain 38 distinct IDs");
  assert.equal(quarantined.length, 21, "unexpected change to quarantine: review release decision");
  assert.equal(corrected.length, 8, "unexpected change to display corrections: review migration");
  assert.equal(canonicalMethodOnly.length, 9);
  assert.equal(new Set(quarantined).size, quarantined.length, "duplicate quarantine");
  assert.equal(new Set(corrected).size, corrected.length, "duplicate display correction");
  assert.equal(new Set([...quarantined, ...corrected, ...canonicalMethodOnly]).size, 38, "quarantine and correction overlap");
  assert.deepEqual(sorted([...quarantined, ...corrected, ...canonicalMethodOnly]), sorted(issue404));
});

test("issue #404 quarantine is absent from every public locale and corrected content is present", () => {
  for (const id of publicRecipeQuarantineIds) {
    assert.ok(isPublicRecipeQuarantined(id));
    assert.equal(siteContent.recipes.some(recipe => recipe.recipeId === id), false, id);
  }
  for (const id of canonicalMethodOnly) {
    assert.equal(isPublicRecipeQuarantined(id), false, id);
    assert.ok(siteContent.recipes.some(recipe => recipe.recipeId === id && recipe.locale === "fi"), id);
  }
  for (const entry of displayCorrections) {
    assert.equal(isPublicRecipeQuarantined(recipeId(entry.relative)), false, entry.relative);
    assert.ok(siteContent.recipes.some(recipe => recipe.recipeId === recipeId(entry.relative) && recipe.locale === "fi"), entry.relative);
  }
});

test("issue #404 visible FI corrections are SHA-bound and preserve all ingredient and nutrition inputs", async () => {
  for (const { relative, apply } of displayCorrections) {
    const raw = await readFile(path.join(root, relative), "utf8");
    const visible = apply(relative, raw);
    assert.notEqual(visible, raw, relative);
    const source = parseMarkdown(raw);
    const projected = parseMarkdown(visible);
    assert.ok(source && projected, relative);
    for (const field of [
      "recipe_id", "url_slug", "language", "status", "servings", "ingredients",
      "carbs_net_per_serving_g", "carbs_total_per_serving_g",
      "protein_per_serving_g", "fat_per_serving_g",
    ] as const) {
      assert.deepEqual(projected.data[field], source.data[field], `${relative}: ${field}`);
    }
    assert.throws(() => apply(relative, raw + "\n# Unreviewed source edit\n"), /SOURCE_STALE/, relative);
  }
});

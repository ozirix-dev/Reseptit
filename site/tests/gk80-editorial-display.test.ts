import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { parseMarkdown } from "../src/content/markdown";
import { projectReviewedFiEditorialSource, reviewedFiEditorialPaths } from "../scripts/gk80-editorial-display";

const root = path.resolve(import.meta.dirname, "../..");
const checksum = (text: string) => createHash("sha256").update(text.replaceAll("\r\n", "\n")).digest("hex");

test("all six FI public corrections are pinned to unmodified GK80 release pack sources", () => {
  assert.equal(reviewedFiEditorialPaths.length, 6);
  const packs = [1, 4, 5, 6].flatMap((n) =>
    JSON.parse(readFileSync(path.join(root, "docs/nutrition", `gk80-release-${n}`, "recipes.json"), "utf8")).recipes
  );
  for (const relativePath of reviewedFiEditorialPaths) {
    const raw = readFileSync(path.join(root, relativePath), "utf8");
    const source = parseMarkdown(raw);
    assert.ok(source);
    const locked = packs.find((entry: { sourcePath: string }) => entry.sourcePath === relativePath);
    assert.ok(locked, `${relativePath}: source must be in an approved GK80 pack`);
    assert.equal(checksum(raw), locked.sourceSha256, `${relativePath}: immutable GK source`);
    const projected = projectReviewedFiEditorialSource(relativePath, raw);
    assert.notEqual(projected, raw);
    const revised = parseMarkdown(projected);
    assert.ok(revised);
    assert.equal(revised.data.recipe_id, source.data.recipe_id);
    assert.equal(revised.data.status, "published");
    for (const name of ["servings", "time_total_min", "carbs_net_per_serving_g", "carbs_total_per_serving_g", "protein_per_serving_g", "fat_per_serving_g", "diet_class"]) {
      assert.deepEqual(revised.data[name], source.data[name], `${relativePath}: invariant ${name}`);
    }
    assert.deepEqual(
      (revised.data.ingredients as Array<{amount: number | null; unit: string}>).map(({amount, unit}) => ({amount, unit})),
      (source.data.ingredients as Array<{amount: number | null; unit: string}>).map(({amount, unit}) => ({amount, unit}))
    );
    assert.equal((projected.match(/^\d+\./gm) ?? []).length, (raw.match(/^\d+\./gm) ?? []).length);
    assert.throws(() => projectReviewedFiEditorialSource(relativePath, raw + "\n# unexpected edit"), /EDITORIAL_FI_SOURCE_STALE/);
    assert.equal(checksum(readFileSync(path.join(root, relativePath), "utf8")), locked.sourceSha256);
  }
});

test("corrections are recipe-specific; no other file or locale can inherit a patch", () => {
  assert.equal(projectReviewedFiEditorialSource("reseptit/aamupalat/kananmuna.md", "unchanged"), "unchanged");
  assert.equal(projectReviewedFiEditorialSource("kaannokset/en/aamupalat/munakasmuffinit.md", "draft"), "draft");
  const current = readFileSync(path.join(root, reviewedFiEditorialPaths[0]), "utf8");
  assert.equal(projectReviewedFiEditorialSource("reseptit/aamupalat/other.md", current), current);
});

test("prepared FI site entries use corrected public instructions without changing macro claims", () => {
  const recipes = new Map(siteContent.recipes.filter((r) => r.locale === "fi").map((r) => [r.recipeId, r]));
  const egg = recipes.get("pohjoisafrikkalainen-harissa-shakshuka")!;
  assert.match(egg.ingredients[0].item, /kuorettomana/);
  const muffin = recipes.get("munakasmuffinit")!;
  assert.match(muffin.instructionsText.join(" "), /silikonivuokaa/);
  assert.match(muffin.instructionsText.join(" "), /pekonirasva/);
  assert.doesNotMatch(muffin.instructionsText.join(" "), /Voitele kuusi muffinivuokaa/);
  const tuna = recipes.get("tonnikalamunakkaat-uunissa")!;
  assert.match(tuna.instructionsText.join(" "), /paperivuokaa/);
  for (const id of ["vietnamilainen-chao-ga-kanapuuro", "indonesialainen-bubur-ayam-kanariisipuuro"]) {
    const r = recipes.get(id)!;
    assert.match(r.instructionsText.join(" "), /75 °C/);
    assert.match(r.instructionsText.join(" "), /25 minuuttia/);
    assert.equal(r.timeTotalMin, 45);
  }
  for (const relativePath of reviewedFiEditorialPaths) {
    const source = parseMarkdown(readFileSync(path.join(root, relativePath), "utf8"));
    assert.ok(source);
    const r = recipes.get(source.data.recipe_id as string)!;
    assert.deepEqual(r.nutrition, {
      carbsNetG: source.data.carbs_net_per_serving_g ?? null,
      carbsTotalG: source.data.carbs_total_per_serving_g ?? null,
      proteinG: source.data.protein_per_serving_g ?? null,
      fatG: source.data.fat_per_serving_g ?? null
    });
  }
});

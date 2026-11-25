import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test, { type TestContext } from "node:test";
import { stringify } from "yaml";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { hashContent } from "../scripts/new-recipe-preflight.mjs";
import { recipeNutritionInputHash } from "../scripts/nutrition-evidence";
import type { Calculation } from "../scripts/nutrition-model";
import { assertReviewedSnackPublication } from "../scripts/snack-publication-review";
import { semanticEvidencePath, semanticHash, type SemanticEvidence } from "../scripts/translation-semantic-review";

type Recipe = ReturnType<typeof recipeFrontmatterSchema.parse>;
const id = "reviewed-snack";
const sourcePath = `reseptit/valipalat/${id}.md`;
const reviewPath = `docs/reviews/new-recipes/${id}.json`;
const calculationPath = `docs/nutrition/calculations/${id}.json`;
const body = "\n## Preparation\n\n1. Serve chilled.\n";
const markdown = (data: Recipe) => "---\n" + stringify(data) + "---\n" + body;

async function fixture(t: TestContext, locale: "en" | "sv" | "th" = "en") {
  const root = await mkdtemp(path.join(os.tmpdir(), "recipavo-snack-translation-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const put = async (relative: string, contents: string) => {
    const file = path.join(root, relative);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, contents, "utf8");
  };
  const sourceData = recipeFrontmatterSchema.parse({
    title: "Reviewed snack",
    recipe_id: id,
    url_slug: id,
    category: "valipala",
    language: "fi",
    status: "published",
    servings: 2,
    ingredients: [{ item: "yogurt", amount: 200, unit: "g" }],
    image: { src: "valipalat/reviewed-snack.webp", alt: "Yogurt in a bowl", width: 1200, height: 800 },
    carbs_net_per_serving_g: null,
    carbs_total_per_serving_g: null,
    protein_per_serving_g: null,
    fat_per_serving_g: null,
  });
  const targetPath = `kaannokset/${locale}/valipalat/${id}.md`;
  const targetData = recipeFrontmatterSchema.parse({
    ...sourceData,
    language: locale,
    url_slug: id + "-" + locale,
    source_language: "fi",
    source_recipe: sourcePath,
    translation_of: id,
  });
  const source = markdown(sourceData);
  const target = markdown(targetData);
  const review = {
    schema_version: 1,
    recipe_id: id,
    source_path: sourcePath,
    source_sha256: hashContent(source),
    decision: "approved",
    reviewed_by: "Test reviewer",
    reviewed_at: "2026-11-25",
    origin: { kind: "original", sources: [] },
    nutrition_evidence: calculationPath,
    checks: Object.fromEntries(
      ["duplicates", "ingredients", "method", "food_safety", "servings_and_time", "nutrition", "glycemic"]
        .map(name => [name, {
          status: name === "glycemic" ? "unavailable" : "pass",
          notes: "The fixture has a documented editorial disposition.",
        }]),
    ),
  };
  const calculation: Calculation = {
    recipeId: id,
    sourceHash: recipeNutritionInputHash(sourceData),
    calculatedAt: "2026-11-25",
    servings: sourceData.servings,
    scope: "One of two portions.",
    reviewerStatus: "AUTOMATED ONLY",
    carbohydrateOutput: "AVAILABLE_EXCLUDING_FIBRE",
    ingredients: [{ ...sourceData.ingredients[0]!, excludedReason: "The product composition is unavailable." }],
    publicationStatus: "WITHHELD_SOURCE_INCOMPLETE",
    withholdingReason: "The product composition is unavailable.",
  };
  const digest = (text: string) => {
    const parsed = parseMarkdown(text);
    assert.ok(parsed);
    return semanticHash({ data: recipeFrontmatterSchema.parse(parsed.data), content: parsed.content });
  };
  const proof: SemanticEvidence[string] = {
    source_hash: digest(source),
    translation_hash: digest(target),
    reviewed_at: "2026-11-25",
    reference: reviewPath,
    outcome: "pass",
    findings: [],
  };
  const saveProof = (value: SemanticEvidence[string]) => put(semanticEvidencePath, JSON.stringify({ [`${id}:${locale}`]: value }));
  await Promise.all([
    put(sourcePath, source),
    put(targetPath, target),
    put(reviewPath, JSON.stringify(review)),
    put(calculationPath, JSON.stringify(calculation)),
    saveProof(proof),
  ]);
  return { root, put, source, sourceData, target, targetPath, targetData, review, calculation, proof, saveProof };
}

for (const locale of ["en", "sv", "th"] as const) {
  test(`reviewed Finnish withholding applies to the reviewed ${locale} translation`, async t => {
    const f = await fixture(t, locale);
    await assertReviewedSnackPublication(f.sourceData, f.root, sourcePath);
    await assertReviewedSnackPublication(f.targetData, f.root, f.targetPath);
  });
}

type Fixture = Awaited<ReturnType<typeof fixture>>;
const cases: [string, RegExp, (f: Fixture) => Promise<void> | void][] = [
  ["missing calculation", /ENOENT/, f => rm(path.join(f.root, calculationPath))],
  ["wrong Finnish recipe ID", /Finnish snack withholding does not match/, f =>
    f.put(sourcePath, markdown({ ...f.sourceData, recipe_id: "other-snack" }))],
  ["unpublished Finnish recipe", /Finnish snack withholding does not match/, f =>
    f.put(sourcePath, markdown({ ...f.sourceData, status: "draft" }))],
  ["stale Finnish review", /source_sha256 stale/, f => f.put(sourcePath, f.source + "\nChange.\n")],
  ["stale nutrition inputs", /ingredients or yield changed/, f =>
    f.put(calculationPath, JSON.stringify({ ...f.calculation, sourceHash: "0".repeat(64) }))],
  ["wrong source path", /no canonical Finnish source/, f => { f.targetData.source_recipe = "reseptit/valipalat/other.md"; }],
  ["wrong translation identity", /no canonical Finnish source/, f => { f.targetData.translation_of = "other-snack"; }],
  ["missing semantic review", /NOT REVIEWED/, f => f.put(semanticEvidencePath, "{}")],
  ["stale Finnish semantic hash", /REVIEW STALE/, f => f.saveProof({ ...f.proof, source_hash: "0".repeat(64) })],
  ["stale translation text", /REVIEW STALE/, f => f.put(f.targetPath, f.target + "\nChange.\n")],
  ["open critical review finding", /BLOCKED/, f => f.saveProof({
    ...f.proof, findings: [{ severity: "P1", status: "open", summary: "Unresolved translation problem" }],
  })],
  ["partial nutrition", /needs source-backed/, f => { f.targetData.protein_per_serving_g = 1; }],
  ["missing image", /approved WebP image/, f => { f.targetData.image = undefined; }],
  ["unquantified ingredient", /needs a quantified amount/, f => { f.targetData.ingredients[0]!.amount = null; }],
];
for (const [reason, expected, change] of cases) {
  test(`reviewed snack withholding rejects ${reason}`, async t => {
    const f = await fixture(t);
    await change(f);
    await assert.rejects(assertReviewedSnackPublication(f.targetData, f.root, f.targetPath), expected);
  });
}

test("complete numerical snack still uses the existing validation without a withholding review", async t => {
  const f = await fixture(t);
  await assertReviewedSnackPublication({
    ...f.targetData,
    carbs_net_per_serving_g: 10,
    carbs_total_per_serving_g: 12,
    protein_per_serving_g: 4,
    fat_per_serving_g: 8,
  }, f.root, f.targetPath);
});

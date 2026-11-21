import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { siteContent } from "../src/generated/content.generated";
import { isPublicRecipeQuarantined } from "../scripts/public-recipe-quarantine";

const root = path.resolve(import.meta.dirname, "../..");

type CandidateReference = {
  calculationPath?: string;
  catalogPath?: string;
  recordId: string;
};
type CheckedIngredient = {
  index: number;
  item: string;
  amount: number | null;
  unit: string;
  reasonCode: string;
  reason: string;
  candidateRecord?: CandidateReference;
  comparatorOnly?: boolean;
  externalEvidence?: Record<string, unknown>;
};
type Preflight = {
  basedOnMain: string;
  reviewerStatus: string;
  publicationAuthorized: boolean;
  macrosAuthorized: boolean;
  recipes: Array<{
    recipeId: string;
    draftPath: string;
    sourceGitBlobSha: string;
    status: string;
    ingredients: CheckedIngredient[];
  }>;
};
const evidenceFile = "docs/nutrition/issue404-b5-ingredient-preflight.json";
const knownCodes = new Set([
  "MISSING_EXACT_FOOD", "COMPOSITION_MISMATCH", "UNIT_CONVERSION_PENDING",
  "PROCESSING_RETENTION_PENDING", "OIL_ABSORPTION_PENDING",
  "PRODUCT_SPEC_PENDING", "ZERO_NUTRIENTS_WATER", "SALT_MACROS_ONLY",
  "EXACT_FOOD_SOURCE_REUSE_HOLD",
]);
const recipeIds = [
  "karibia-saltfish-fritterit",
  "intialainen-idli-kookoschutneylla",
  "intialainen-pesarattu-mungpavuista",
  "malesialainen-kuih-seri-muka",
  "vietnamilainen-xoi-maapahkinalla",
];
const sha1Blob = (source: string) =>
  createHash("sha1")
    .update("blob " + Buffer.byteLength(source, "utf8") + "\0")
    .update(source, "utf8")
    .digest("hex");
const cache = new Map<string, unknown>();

async function readJsonCached(relative: string): Promise<unknown> {
  if (!cache.has(relative)) {
    cache.set(relative, JSON.parse(await readFile(path.join(root, relative), "utf8")) as unknown);
  }
  return cache.get(relative);
}

test("issue 404 B5: every draft ingredient is version-pinned to an explicit unresolved nutrition decision", async () => {
  const evidence = await readJsonCached(evidenceFile) as Preflight;
  assert.equal(evidence.basedOnMain, "b20cea7fc22519b156f4315e6238066a4543eda8");
  assert.equal(evidence.publicationAuthorized, false);
  assert.equal(evidence.macrosAuthorized, false);
  assert.equal(evidence.reviewerStatus, "AUTOMATED_CATALOGUE_TRIAGE_ONLY");
  assert.deepEqual(
    evidence.recipes.map((row) => row.recipeId),
    recipeIds.map((id) => id + "-punnittu-v2"),
  );

  let audited = 0;
  let referenced = 0;
  for (const recipe of evidence.recipes) {
    const original = recipe.recipeId.replace(/-punnittu-v2$/, "");
    assert.equal(recipe.draftPath,
      "docs/reviews/issue404-b-five-draft-recipes/" + recipe.recipeId + ".md");
    const source = await readFile(path.join(root, recipe.draftPath), "utf8");
    assert.equal(sha1Blob(source), recipe.sourceGitBlobSha, recipe.recipeId + " changed without re-audit");
    const parsed = parseMarkdown(source);
    assert.ok(parsed, recipe.recipeId);
    const data = recipeFrontmatterSchema.parse(parsed.data);
    assert.equal(data.recipe_id, recipe.recipeId);
    assert.equal(data.status, "draft");
    assert.equal(recipe.status, "WITHHELD_SOURCE_INCOMPLETE");
    assert.equal(data.image, undefined);
    assert.equal(data.time_total_min, null);
    for (const field of [
      "carbs_net_per_serving_g", "carbs_total_per_serving_g",
      "protein_per_serving_g", "fat_per_serving_g",
    ] as const) assert.equal(data[field], null, field + ": no nutrition release");
    assert.equal(isPublicRecipeQuarantined(original), true, original);
    assert.equal(siteContent.recipes.some((r) => r.recipeId === recipe.recipeId || r.recipeId === original), false);
    assert.equal(data.ingredients.length, recipe.ingredients.length, recipe.recipeId);

    for (const [i, ingredient] of data.ingredients.entries()) {
      const review = recipe.ingredients[i];
      assert.ok(review, `${recipe.recipeId}: missing ingredient ${i}`);
      assert.equal(review.index, i);
      assert.equal(review.item, ingredient.item);
      assert.equal(review.amount, ingredient.amount);
      assert.equal(review.unit, ingredient.unit);
      assert.ok(knownCodes.has(review.reasonCode), `${recipe.recipeId}: unknown code ${review.reasonCode}`);
      assert.ok(review.reason.trim().length > 20);
      if (review.reasonCode === "ZERO_NUTRIENTS_WATER") {
        assert.match(review.item, /vett[aä]/);
        assert.ok(review.candidateRecord, "Water is not zero without source record");
      }
      if (review.reasonCode === "SALT_MACROS_ONLY") {
        assert.match(review.item, /suola/i);
        assert.ok(review.candidateRecord);
      }
      if (review.reasonCode === "EXACT_FOOD_SOURCE_REUSE_HOLD") {
        assert.equal(i, 0);
        assert.match(review.item, /tahmariis/);
        assert.equal(review.comparatorOnly, true, "Ordinary rice is only a mismatch comparator");
        assert.equal(review.externalEvidence?.foodCode, "A22");
        assert.equal(review.externalEvidence?.exactFoodMatch, true);
        assert.equal(review.externalEvidence?.polyolsStatus, "NOT_REPORTED");
        assert.equal(review.externalEvidence?.approval, "RESEARCH_REFERENCE_ONLY_NOT_FOOD_RECORD");
        assert.equal(review.externalEvidence?.rightsStatus, "NONCOMMERCIAL_ACCESS_ONLY_COMMERCIAL_REUSE_PERMISSION_UNCONFIRMED");
        assert.match(String(review.externalEvidence?.url), /mahidol\.ac\.th\/thaifcd\/foodsearch\//);
      }
      if (review.candidateRecord) {
        const ref = review.candidateRecord;
        assert.equal(Boolean(ref.calculationPath) !== Boolean(ref.catalogPath), true);
        const sourcePath = ref.calculationPath ?? ref.catalogPath!;
        assert.match(sourcePath, /^docs\/nutrition\//);
        assert.match(ref.recordId, /^(?:afcd-|fineli-|A\d|F\d)/i);
        const found = await readJsonCached(sourcePath);
        if (ref.calculationPath) {
          assert.ok(
            typeof found === "object" && found !== null && "ingredients" in found &&
            Array.isArray(found.ingredients) &&
            found.ingredients.some((record: { record?: { id?: string } }) => record.record?.id === ref.recordId),
            `${recipe.recipeId}: missing precedent ${ref.recordId} in ${sourcePath}`,
          );
        } else {
          assert.ok(
            Array.isArray(found) &&
            found.some((record: { id?: string }) => record.id === ref.recordId),
            `${recipe.recipeId}: catalog record missing: ${ref.recordId}`,
          );
        }
        referenced++;
      }
      audited++;
    }
  }
  assert.equal(audited, 53);
  assert.ok(referenced >= 28, "Source candidates must be reused without inventing food composition");
});

test("issue 404 B5: rice and bean state mismatches stay blocked even when catalog references exist", async () => {
  const evidence = await readJsonCached(evidenceFile) as Preflight;
  const byId = (id: string) => evidence.recipes.find((r) => r.recipeId === id + "-punnittu-v2")!;
  const saltfish = byId("karibia-saltfish-fritterit");
  const idli = byId("intialainen-idli-kookoschutneylla");
  const pesarattu = byId("intialainen-pesarattu-mungpavuista");
  const kuih = byId("malesialainen-kuih-seri-muka");
  const xoi = byId("vietnamilainen-xoi-maapahkinalla");

  assert.ok(saltfish.ingredients.some((x) => x.reasonCode === "OIL_ABSORPTION_PENDING" && x.amount === null));
  assert.ok(idli.ingredients.some((x) => x.item.includes("urad-papua") && x.reasonCode === "MISSING_EXACT_FOOD"));
  assert.ok(idli.ingredients.some((x) => x.item.includes("tamarindia") && x.amount === null));
  assert.ok(idli.ingredients.some((x) => x.item.includes("inkivääriä") && x.amount === null));
  assert.ok(pesarattu.ingredients.some((x) =>
    x.reasonCode === "PROCESSING_RETENTION_PENDING" &&
    x.candidateRecord?.recordId === "afcd-F000446-release-3"));
  for (const recipe of [kuih, xoi]) {
    assert.ok(recipe.ingredients.some((x) => x.item.includes("tahmariisiä") &&
      x.reasonCode === "EXACT_FOOD_SOURCE_REUSE_HOLD" &&
      x.comparatorOnly === true && x.externalEvidence?.foodCode === "A22"),
      `${recipe.recipeId}: A22 is exact rice but licence and polyols are unresolved`);
  }
  assert.ok(xoi.ingredients.some((x) => x.candidateRecord?.recordId === "afcd-F006107-release-3" &&
    x.reasonCode === "PROCESSING_RETENTION_PENDING" &&
    x.externalEvidence?.studiedBoilingMinutes === 210 &&
    x.externalEvidence?.recipeSourceBoilingMinutes === 15 &&
    x.externalEvidence?.retentionFactorApproved === false));
  assert.ok(xoi.ingredients.some((x) => x.item.includes("kookosmaitoa") &&
    x.reasonCode === "PRODUCT_SPEC_PENDING"));
});

test("issue 404 B5: kuih sugar arithmetic is a component only, never a full recipe macro", async () => {
  const evidence = await readJsonCached(evidenceFile) as Preflight;
  const kuih = evidence.recipes.find((r) =>
    r.recipeId === "malesialainen-kuih-seri-muka-punnittu-v2");
  assert.ok(kuih);
  const sugar = kuih.ingredients.find((r) => r.item === "sokeria munakerrokseen");
  assert.ok(sugar);
  assert.equal(sugar.amount, 170);
  assert.equal(sugar.unit, "g");
  assert.equal(sugar.candidateRecord?.recordId, "fineli-1-release-20");
  const source = await readJsonCached(sugar.candidateRecord.calculationPath!) as {
    ingredients: Array<{ record?: { id?: string; per100g?: { carbohydrate?: number } } }>;
  };
  const nutrient = source.ingredients.find((x) => x.record?.id === sugar.candidateRecord?.recordId)?.record;
  assert.equal(nutrient?.per100g?.carbohydrate, 99.9);
  const sugarOnlyCarbohydrate = sugar.amount! * nutrient!.per100g!.carbohydrate! / 100;
  assert.equal(Math.round(sugarOnlyCarbohydrate * 100) / 100, 169.83);
  assert.equal(Math.round(sugarOnlyCarbohydrate / 20 * 100) / 100, 8.49);
  assert.equal(kuih.status, "WITHHELD_SOURCE_INCOMPLETE");
  assert.equal(evidence.macrosAuthorized, false);
});


test("issue 404 B5: source exactness does not authorize rice nutrition or commercial database reuse", async () => {
  const evidence = await readJsonCached(evidenceFile) as Preflight;
  const review = await readFile(path.join(root,
    "docs/nutrition/issue404-glutinous-rice-source-review-2026-11-21.md"), "utf8");
  assert.match(review, /\*\*ei ilmoitettu\*\*/);
  assert.match(review, /käyttöoikeus ja polyoliperusta/);
  assert.match(review, /200 g × A22 \/ 100 g \| 160,98 g/);
  assert.match(review, /300 g × A22 \/ 100 g \| 241,47 g/);
  assert.match(review, /keitt[oä] kesti \*\*210 minuuttia\*\*/);
  assert.match(review, /\*\*20 g\*\* kookosmaitoa/);
  assert.match(review, /\*\*20 ml\*\*/);
  assert.equal(evidence.macrosAuthorized, false);
  assert.equal(evidence.publicationAuthorized, false);
  for (const id of ["vietnamilainen-xoi-maapahkinalla", "malesialainen-kuih-seri-muka"]) {
    const recipe = evidence.recipes.find((r) => r.recipeId === id + "-punnittu-v2");
    assert.ok(recipe);
    assert.equal(recipe.status, "WITHHELD_SOURCE_INCOMPLETE");
    const rice = recipe.ingredients[0];
    assert.equal(rice.reasonCode, "EXACT_FOOD_SOURCE_REUSE_HOLD");
    assert.equal(rice.externalEvidence?.foodCode, "A22");
    assert.equal(rice.externalEvidence?.polyolsStatus, "NOT_REPORTED");
    assert.equal(rice.comparatorOnly, true);
  }
});

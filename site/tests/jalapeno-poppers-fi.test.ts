import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { verifyNutritionEvidence } from "../scripts/nutrition-evidence";
import type { Calculation } from "../scripts/nutrition-model";
import { assertReviewedSnackPublication } from "../scripts/snack-publication-review";

const root = path.resolve(import.meta.dirname, "../..");
const recipeId = "jalapeno-poppers-pekonilla";
const recipePath = "reseptit/valipalat/" + recipeId + ".md";
const reviewPath = "docs/reviews/new-recipes/" + recipeId + ".json";
const sha256 = (value: Buffer) => createHash("sha256").update(value).digest("hex");
const read = (file: string) => readFile(path.join(root, file));

test("jalapeño FI recipe binds six whole-batch portions to documented macro withholding", async () => {
  const source = await read(recipePath);
  const parsed = parseMarkdown(source.toString("utf8"));
  assert.ok(parsed);
  const recipe = recipeFrontmatterSchema.parse(parsed.data);
  assert.equal(recipe.language, "fi");
  assert.equal(recipe.servings, 6);
  assert.equal(recipe.time_total_min, 45);
  assert.deepEqual(recipe.ingredients.map(({ amount, unit }) => [amount, unit]),
    [[150, "g"], [120, "g"], [60, "g"], [90, "g"]]);
  assert.match(parsed.content, /koko valmis erä kuuteen yhtä suureen annokseen/);
  assert.match(parsed.content, /200 °C/);
  assert.match(parsed.content, /pakkauksen kypsennysohjetta/);
  assert.match(parsed.content, /pekoni kauttaaltaan vähintään 70 °C/);
  assert.match(parsed.content, /Jos kypsyydestä jää epävarmuutta, älä tarjoa/);
  assert.match(parsed.content, /Anna jäähtyä noin 5 minuuttia/);
  assert.match(parsed.content, /GK: ei määritetty/);
  assert.ok(recipe.tags.every(tag => tag !== "keto" && tag !== "vhh"));

  const review = JSON.parse((await read(reviewPath)).toString("utf8"));
  assert.equal(review.source_path, recipePath);
  assert.equal(review.source_sha256, sha256(source));
  assert.equal(review.decision, recipe.status === "published" ? "approved" : "hold");
  const evidence = JSON.parse((await read(review.nutrition_evidence)).toString("utf8")) as Calculation;
  assert.equal(evidence.publicationStatus, "WITHHELD_SOURCE_INCOMPLETE");
  assert.equal(evidence.ingredients[3]?.retainedFraction, undefined);
  const result = verifyNutritionEvidence(recipe, evidence);
  assert.equal(result.status, "INSUFFICIENT SOURCE DATA");
  assert.deepEqual(result.errors, []);
  assert.deepEqual(Object.values(result.values), [null, null, null, null]);
});

test("jalapeño recipe and review point to the exact registered WebP", async () => {
  const parsed = parseMarkdown((await read(recipePath)).toString("utf8"));
  assert.ok(parsed);
  const recipe = recipeFrontmatterSchema.parse(parsed.data);
  assert.ok(recipe.image);
  const imagePath = "kuvat/" + recipe.image.src;
  const [image, rawManifest, rawReview] = await Promise.all([
    read(imagePath), read("assets/images.tracked-overlays.json"), read(reviewPath),
  ]);
  assert.equal(image.toString("ascii", 8, 12), "WEBP");
  const digest = sha256(image);
  const manifest = JSON.parse(rawManifest.toString("utf8")) as {
    files: { path: string; bytes: number; sha256: string; source: string; approved: boolean }[];
  };
  assert.deepEqual(manifest.files.filter(entry => entry.path === recipe.image?.src), [{
    path: recipe.image.src, bytes: image.length, sha256: digest, source: "git-tracked", approved: true,
  }]);
  const review = JSON.parse(rawReview.toString("utf8"));
  assert.equal(review.image.path, imagePath);
  assert.equal(review.image.sha256, digest);
});

test("published snack withholding requires current editorial and nutrition evidence", async t => {
  const source = await read(recipePath);
  const parsed = parseMarkdown(source.toString("utf8"));
  assert.ok(parsed);
  const recipe = recipeFrontmatterSchema.parse(parsed.data);
  assert.equal(recipe.status, "published");
  await assertReviewedSnackPublication(recipe, root, recipePath);
  await assert.rejects(assertReviewedSnackPublication({ ...recipe, protein_per_serving_g: 1 }, root, recipePath),
    /needs source-backed/);

  const fixture = await mkdtemp(path.join(os.tmpdir(), "recipavo-snack-review-"));
  t.after(() => rm(fixture, { recursive: true, force: true }));
  const review = JSON.parse((await read(reviewPath)).toString("utf8"));
  const evidence = await read(review.nutrition_evidence);
  await Promise.all([recipePath, reviewPath, review.nutrition_evidence].map(file =>
    mkdir(path.dirname(path.join(fixture, file)), { recursive: true })));
  await writeFile(path.join(fixture, recipePath), source);
  await writeFile(path.join(fixture, reviewPath), JSON.stringify({ ...review, decision: "hold" }));
  await writeFile(path.join(fixture, review.nutrition_evidence), evidence);
  await assert.rejects(assertReviewedSnackPublication(recipe, fixture, recipePath), /review decision is not approved/);

  await writeFile(path.join(fixture, reviewPath), JSON.stringify(review));
  await writeFile(path.join(fixture, recipePath), source.toString("utf8") + "Muutos.\n");
  await assert.rejects(assertReviewedSnackPublication(recipe, fixture, recipePath), /source_sha256 stale/);

  await writeFile(path.join(fixture, recipePath), source);
  await assert.rejects(assertReviewedSnackPublication({ ...recipe, servings: 5 }, fixture, recipePath),
    /servings mismatch/);
});

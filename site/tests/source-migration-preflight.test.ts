import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import {
  classifyCanonicalMethodMigration,
  loadSourceMigrationInputs,
} from "../scripts/source-migration-preflight";

const root = path.resolve(import.meta.dirname, "../..");
const pilotIds = [
  "indialainen-poha-maapahkinoilla",
  "malesialainen-kaya-paahtoleipa",
  "valimerellinen-halloumi-tomaattileipa",
  "intialainen-rava-uttapam",
  "lahi-ita-ful-medames",
  "meksikolainen-aamiais-tacot-mustapavuilla",
  "valimerellinen-menemen-fetalla",
  "valimerellinen-pinaatti-fetashakshuka",
  "vietnamilainen-pho-ga-aamuksi",
  "intialainen-mannasuurimoupma",
];

test("issue404 10-recipe pilot preflight predicts the five recorded blocks before CI", async () => {
  const inputs = await loadSourceMigrationInputs(root);
  const actual = classifyCanonicalMethodMigration(pilotIds, inputs);
  assert.equal(actual.length, 10);
  assert.deepEqual(actual.filter(x => x.classification === "HOLD").map(x => x.recipeId), [
    "indialainen-poha-maapahkinoilla",
    "malesialainen-kaya-paahtoleipa",
    "valimerellinen-halloumi-tomaattileipa",
    "vietnamilainen-pho-ga-aamuksi",
    "intialainen-mannasuurimoupma",
  ]);
  assert.equal(actual.filter(x => x.classification === "CANDIDATE_REQUIRES_REVIEW").length, 5);
  assert.ok(actual[0].blockers.some(x => x.startsWith("PUBLISHED_TRANSLATION_SEMANTIC_REVIEW_REQUIRED:")));
  assert.ok(actual[0].blockers.includes("GK149_FULL_SOURCE_SHA_REVIEW_REQUIRED"));
  for (const candidate of actual.filter(x => x.classification === "CANDIDATE_REQUIRES_REVIEW"))
    assert.deepEqual(candidate.blockers, []);
});

test("preflight prevents known quarantines, malformed IDs and duplicates", async () => {
  const inputs = await loadSourceMigrationInputs(root);
  const result = classifyCanonicalMethodMigration([
    "karibia-bammy-kassavaleipa",
    "../unsafe",
    "intialainen-rava-uttapam",
    "intialainen-rava-uttapam",
  ], inputs);
  assert.ok(result[0].blockers.includes("PUBLIC_QUARANTINE_REQUIRES_SEPARATE_APPROVAL"));
  assert.deepEqual(result[1].blockers, ["INVALID_RECIPE_ID"]);
  assert.equal(result[2].classification, "CANDIDATE_REQUIRES_REVIEW");
  assert.ok(result[3].blockers.includes("DUPLICATE_CANDIDATE"));
});

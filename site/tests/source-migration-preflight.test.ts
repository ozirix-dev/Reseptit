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

test("issue404 10-recipe pilot preflight detects the original blocks and the newly published ful medames translations before CI", async () => {
  const inputs = await loadSourceMigrationInputs(root, pilotIds);
  const actual = classifyCanonicalMethodMigration(pilotIds, inputs);
  assert.equal(actual.length, 10);
  assert.deepEqual(actual.filter(x => x.classification === "HOLD").map(x => x.recipeId), [
    "indialainen-poha-maapahkinoilla",
    "malesialainen-kaya-paahtoleipa",
    "valimerellinen-halloumi-tomaattileipa",
    "lahi-ita-ful-medames",
    "vietnamilainen-pho-ga-aamuksi",
    "intialainen-mannasuurimoupma",
  ]);
  assert.equal(actual.filter(x => x.classification === "CANDIDATE_REQUIRES_REVIEW").length, 4);
  assert.deepEqual(actual.find(x => x.recipeId === "lahi-ita-ful-medames")?.blockers,
    ["PUBLISHED_TRANSLATION_SEMANTIC_REVIEW_REQUIRED:en,sv,th"]);
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

test("GK100 first-five soba is HOLD before a canonical edit, while the other two pass known-source screens", async () => {
  const ids = [
    "japanilainen-soba-aamiaiskeitto",
    "kiinalainen-jianbing-munaletty",
    "kiinalainen-katkarapu-wontonkeitto",
  ];
  const inputs = await loadSourceMigrationInputs(root, ids);
  assert.ok(inputs.gk100ApprovedSourceIds.size >= 30, "GK100 release manifest unexpectedly empty");
  const result = classifyCanonicalMethodMigration(ids, inputs);
  assert.equal(result[0].classification, "HOLD");
  assert.ok(result[0].blockers.includes("GK100_APPROVED_SOURCE_SHA_REVIEW_REQUIRED"));
  assert.deepEqual(result.slice(1).map(x => x.classification),
    ["CANDIDATE_REQUIRES_REVIEW", "CANDIDATE_REQUIRES_REVIEW"]);
  for (const candidate of result.slice(1)) assert.deepEqual(candidate.blockers, []);
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { auditAlooEvidence, readCurrentAlooHold } from "../scripts/aloo-paratha-source-hold-audit";

const root = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));

test("real aloo paratha remains quarantined with mismatched potato record", async () => {
  const report = await readCurrentAlooHold(root);
  assert.equal(report.state, "HOLD");
  assert.equal(report.quarantinePresent, true);
  assert.equal(report.publicationAuthorized, false);
  assert.equal(report.GKApproved, false);
  assert.deepEqual(report.translationFilesMissing, ["en", "sv", "th"]);
  for (const finding of [
    "POTATO_MISIDENTIFIED_AS_JERUSALEM_ARTICHOKE",
    "POTATO_RECORD_IDENTITY_NOT_VERIFIED",
    "POTATO_MATCH_EVIDENCE_CONTRADICTS_RECORD",
    "YOGURT_SERVING_NOT_IN_INGREDIENTS",
    "POTATO_FILLING_COOKING_NOT_SPECIFIED",
    "FILLING_ENCLOSURE_NOT_SPECIFIED",
    "NUTRITION_REVIEW_NOT_INDEPENDENTLY_APPROVED",
  ]) assert.ok(report.findings.includes(finding), finding);
});

test("removing quarantine is an explicit regression even if nutrition appears reviewed", async () => {
  const fs = await import("node:fs/promises");
  const source = await fs.readFile(path.join(root, "reseptit/aamupalat/intialainen-aloo-paratha.md"), "utf8");
  const nutrition = JSON.parse(await fs.readFile(path.join(root,
    "docs/nutrition/calculations/intialainen-aloo-paratha.json"), "utf8"));
  const report = auditAlooEvidence({recipe: source, nutrition: {...nutrition, reviewerStatus: "APPROVED"},
    quarantine: [], translationFilesMissing: []});
  assert.equal(report.quarantinePresent, false);
  assert.ok(report.findings.includes("PUBLIC_QUARANTINE_MISSING"));
  assert.equal(report.publicationAuthorized, false);
});

test("a fake potato match note cannot override Jerusalem artichoke identity", async () => {
  const fs = await import("node:fs/promises");
  const source = await fs.readFile(path.join(root, "reseptit/aamupalat/intialainen-aloo-paratha.md"), "utf8");
  const nutrition = JSON.parse(await fs.readFile(path.join(root,
    "docs/nutrition/calculations/intialainen-aloo-paratha.json"), "utf8"));
  const potato = nutrition.ingredients.find((x: {item: string}) => /perunaa/.test(x.item));
  potato.matchEvidence = "Verified potato";
  const report = auditAlooEvidence({recipe: source, nutrition, quarantine: ["intialainen-aloo-paratha"],
    translationFilesMissing: ["en", "sv", "th"]});
  assert.ok(report.findings.includes("POTATO_MISIDENTIFIED_AS_JERUSALEM_ARTICHOKE"));
  assert.equal(report.GKApproved, false);
});

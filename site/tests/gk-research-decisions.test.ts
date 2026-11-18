import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  gkResearchDecisionPath, gkResearchDisposition, gkResearchRecipeHash, gkResearchRegistry, researchTextHash,
} from "../scripts/gk-research-decisions";

const recipe = `---
recipe_id: sample
language: fi
title: Annos
servings: 4
ingredients:
  - item: riisiä
    amount: 100
    unit: g
    note: tuotteen A riisi
cooking_method: [höyrytys]
---
# Annos

## Kuvaus

Arkiruoka.

## Valmistus

1. Liota neljä tuntia.
2. Höyrytä kypsäksi.

## Muistiinpanot

Annostele kypsänä.
`;

const current = {
  sourceRecipeId: "sample",
  recipeSha256: gkResearchRecipeHash(recipe),
  calculationInputSha256: "1".repeat(64),
  calculationEvidenceSha256: "2".repeat(64),
  hasPublicEstimate: false,
  ambiguous: false,
  bindingConflict: false,
  priority: false,
};
const reviewed = { path: "docs/nutrition/sample.md", sha256: "3".repeat(64), locator: "Table 1" } as const;
const decision = {
  canonicalRecipeId: "sample",
  sourceRecipeId: "sample",
  scope: "original",
  outcome: "NO_RELIABLE_GK",
  recipeSha256: current.recipeSha256,
  calculationInputSha256: current.calculationInputSha256,
  calculationEvidenceSha256: current.calculationEvidenceSha256,
  reviewedAt: "2026-11-18",
  reason: "Different food and preparation",
  evidence: [reviewed],
} as const;
const registry = JSON.stringify({ schemaVersion: 1, decisions: [decision] });
const reread = () => gkResearchRegistry.parse(JSON.parse(registry)).decisions[0];
const verified = () => true;

test("the first research decision persists and the same case skips after reloading", () => {
  assert.equal(gkResearchDisposition(current, undefined, verified).status, "new");
  assert.equal(gkResearchDisposition(current, reread(), verified).status, "skip");
  assert.equal(gkResearchDisposition(current, reread(), verified).status, "skip");
  assert.equal(gkResearchDisposition(current, { ...reread(), reviewedAt: "2020-01-01" }, verified).status, "skip");
});

test("changes in preparation, product, quantity, input and bound source reopen research", () => {
  for (const changed of [
    recipe.replace("neljä tuntia", "kahdeksan tuntia"),
    recipe.replace("tuotteen A", "tuotteen B"),
    recipe.replace("amount: 100", "amount: 150"),
  ]) {
    assert.equal(gkResearchDisposition({ ...current, recipeSha256: gkResearchRecipeHash(changed) },
      reread(), verified).status, "reopened");
  }
  for (const changed of [
    { calculationInputSha256: "3".repeat(64) },
    { calculationEvidenceSha256: "4".repeat(64) },
    { sourceRecipeId: "sample-successor" },
  ]) {
    assert.equal(gkResearchDisposition({ ...current, ...changed }, reread(), verified).status, "reopened");
  }
  for (const changed of [recipe.replace("title: Annos", "title: Ruoka").replace("# Annos", "# Ruoka"), recipe.replace("Arkiruoka", "Nopea arkiruoka"),
    recipe.replaceAll("\n", "\r\n")]) {
    assert.equal(gkResearchRecipeHash(changed), current.recipeSha256);
  }
});

test("a cited, verified and previously unreviewed source or review decision reopens research", () => {
  for (const kind of ["applicable-gi", "applicable-composition", "documented-review"] as const) {
    const event = { kind, reason: "Applies to the original dish", evidence: { ...reviewed, sha256: "0".repeat(64) } };
    assert.equal(gkResearchDisposition(current, { ...reread(), reopen: event }, verified).status, "reopened");
    assert.equal(gkResearchDisposition(current, { ...reread(), reopen: event }, () => false).status, "review");
    assert.equal(gkResearchDisposition(current, { ...reread(), reopen: { ...event, evidence: reviewed } }, verified).status,
      "review");
  }
});

test("public estimates stay approved and priority or unclear cases never skip", () => {
  assert.equal(gkResearchDisposition({ ...current, hasPublicEstimate: true }, reread(), verified).status, "approved");
  assert.equal(gkResearchDisposition({ ...current, hasPublicEstimate: true, priority: true }, reread(), verified).status,
    "priority");
  assert.equal(gkResearchDisposition({ ...current, ambiguous: true }, reread(), verified).status, "review");
  assert.equal(gkResearchDisposition({ ...current, recipeSha256: null }, reread(), verified).status, "review");
  assert.equal(gkResearchDisposition(current, reread(), () => false).status, "review");
  assert.equal(gkResearchDisposition({ ...current, bindingConflict: true }, reread(), verified).status, "review");
  assert.equal(gkResearchDisposition({ ...current, bindingConflict: true }, undefined, verified).status, "review");
  assert.equal(gkResearchDisposition({ ...current, bindingConflict: true, calculationEvidenceSha256: "4".repeat(64) },
    reread(), verified).status, "reopened");
  assert.throws(() => gkResearchRegistry.parse({ schemaVersion: 1, decisions: [decision, decision] }),
    /one current research decision/i);
});

test("the initial decisions use verifiable in-repo review evidence", () => {
  const read = (file: string) => readFileSync(new URL(`../../${file}`, import.meta.url), "utf8");
  const { decisions } = gkResearchRegistry.parse(JSON.parse(read(gkResearchDecisionPath)));
  assert.ok(decisions.length >= 2);
  for (const row of decisions) {
    assert.ok(row.evidence.every(evidence => researchTextHash(read(evidence.path)) === evidence.sha256));
  }
});

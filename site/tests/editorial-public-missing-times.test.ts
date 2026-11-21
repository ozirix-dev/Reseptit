import assert from "node:assert/strict";
import test from "node:test";
import { compareInventories, toMarkdown } from "../scripts/editorial-public-audit";
import type { PublicRecipe, RawInventory } from "../scripts/editorial-public-audit";

const evidence = {
  recipeId: "aika-puuttuu", title: "Aika puuttuu",
  path: "reseptit/ruoat/aika-puuttuu.md",
  sourceSha256: "a".repeat(64),
};
const raw: RawInventory = {
  counts: { reviewed: 1 },
  indexedRecipes: [evidence],
  signals: {
    genericLead: [], repeatedSteps: [], duplicateDescription: [], missingTime: [evidence],
  },
};
function recipe(timeTotalMin: number | null): PublicRecipe {
  return {
    recipeId: evidence.recipeId, locale: "fi",
    routePath: "/fi/reseptit/aika-puuttuu/",
    description: "Yksilöllinen ohje.",
    instructionsText: ["Valmista resepti."],
    timeTotalMin,
  };
}

test("#327: missing total time is listed with route and pinned source evidence", () => {
  const report = compareInventories(raw, [recipe(null)]);
  const markdown = toMarkdown(report);
  assert.equal(report.totals.projectedMissingTimes, 1);
  assert.match(markdown, /## Julkisesta esityksestä puuttuvat kokonaisajat/);
  assert.ok(markdown.includes("aika-puuttuu (/fi/reseptit/aika-puuttuu/)"));
  assert.ok(markdown.includes(evidence.path));
  assert.ok(markdown.includes(evidence.sourceSha256));
  assert.ok(markdown.includes("## Jatkotoimi"));
});

test("#327: complete total time has no missing-time entries", () => {
  const report = compareInventories(raw, [recipe(45)]);
  const markdown = toMarkdown(report);
  const section = markdown.split("## Julkisesta esityksestä puuttuvat kokonaisajat")[1]
    ?.split("## Jatkotoimi")[0];
  assert.equal(report.totals.projectedMissingTimes, 0);
  assert.ok((section ?? "").includes("Ei osumia."));
  assert.doesNotMatch(section ?? "", /aika-puuttuu/);
});

test("#327: source-only missing time is distinguished from public missing time", () => {
  const report = compareInventories(raw, [recipe(45)]);
  assert.equal(report.totals.rawMissingTimes, 1);
  assert.equal(report.totals.projectedMissingTimes, 0);
  assert.equal(report.totals.rawMissingTimesNoLongerVisible, 1);
  assert.equal(report.totals.publicMissingTimesNotInRaw, 0);
  assert.deepEqual(report.sourceOnly.rawMissingTimeNoLongerVisible.map(x => x.recipeId), [evidence.recipeId]);
  assert.deepEqual(report.sourceOnly.publicMissingTimeNotInRaw, []);
  assert.ok(toMarkdown(report).includes("| Kokonaisaika puuttuu | 1 | 0 |"));
});

test("#327: newly missing public time remains visible as a review signal", () => {
  const sourceWithTime: RawInventory = {
    ...raw,
    signals: { ...raw.signals, missingTime: [] },
  };
  const report = compareInventories(sourceWithTime, [recipe(null)]);
  assert.equal(report.totals.rawMissingTimes, 0);
  assert.equal(report.totals.projectedMissingTimes, 1);
  assert.equal(report.totals.rawMissingTimesNoLongerVisible, 0);
  assert.equal(report.totals.publicMissingTimesNotInRaw, 1);
  assert.deepEqual(report.sourceOnly.publicMissingTimeNotInRaw.map(x => x.recipeId), [evidence.recipeId]);
  const markdown = toMarkdown(report);
  assert.ok(markdown.includes("| Kokonaisaika puuttuu | 0 | 1 |"));
  assert.ok(markdown.includes("### Julkisessa esityksessä uutena puuttuvat ajat"));
  assert.ok(markdown.split("### Julkisessa esityksessä uutena puuttuvat ajat")[1]?.includes(evidence.path));
});

test("#327: source/public agreement has no time parity deltas", () => {
  const report = compareInventories(raw, [recipe(null)]);
  assert.equal(report.totals.rawMissingTimes, 1);
  assert.equal(report.totals.projectedMissingTimes, 1);
  assert.equal(report.totals.rawMissingTimesNoLongerVisible, 0);
  assert.equal(report.totals.publicMissingTimesNotInRaw, 0);
  assert.deepEqual(report.sourceOnly.rawMissingTimeNoLongerVisible, []);
  assert.deepEqual(report.sourceOnly.publicMissingTimeNotInRaw, []);
});

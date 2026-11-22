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

test("#327: stale source hashes in raw signal lists fail closed", () => {
  const stale = { ...evidence, sourceSha256: "b".repeat(64) };
  const signalNames = ["genericLead", "duplicateDescription", "missingTime"] as const;
  for (const signal of signalNames) {
    const inconsistent: RawInventory = {
      ...raw,
      signals: { ...raw.signals, [signal]: [stale] },
    };
    assert.throws(() => compareInventories(inconsistent, [recipe(null)]),
      new RegExp("RAW_SIGNAL_SOURCE_DRIFT: " + signal));
  }
});

test("#327: unknown and duplicated raw signal identities fail closed", () => {
  const unknown = { ...evidence, recipeId: "tuntematon" };
  const missing: RawInventory = {
    ...raw,
    signals: { ...raw.signals, missingTime: [unknown] },
  };
  assert.throws(() => compareInventories(missing, [recipe(null)]),
    /RAW_SIGNAL_SOURCE_DRIFT: missingTime:tuntematon/);
  const duplicated: RawInventory = {
    ...raw,
    signals: { ...raw.signals, missingTime: [evidence, evidence] },
  };
  assert.throws(() => compareInventories(duplicated, [recipe(null)]),
    /DUPLICATE_RAW_SIGNAL: missingTime:aika-puuttuu/);
});

test("#327: repeated-step source references and duplicate entries are validated", () => {
  const phrase = "keitä nämä ainekset hiljalleen riittävän pitkään ja sekoita sitten varovasti";
  const drift: RawInventory = {
    ...raw,
    signals: {
      ...raw.signals,
      repeatedSteps: [{ phrase, recipes: [{ ...evidence, path: "wrong.md" }] }],
    },
  };
  assert.throws(() => compareInventories(drift, [recipe(null)]),
    /RAW_SIGNAL_SOURCE_DRIFT: repeatedSteps:aika-puuttuu/);
  const duplicated: RawInventory = {
    ...raw,
    signals: {
      ...raw.signals,
      repeatedSteps: [{ phrase, recipes: [evidence, evidence] }],
    },
  };
  assert.throws(() => compareInventories(duplicated, [recipe(null)]),
    /DUPLICATE_RAW_REPEAT_RECIPE: aika-puuttuu/);
  const duplicatePhrase: RawInventory = {
    ...raw,
    signals: {
      ...raw.signals,
      repeatedSteps: [{ phrase, recipes: [evidence] }, { phrase, recipes: [evidence] }],
    },
  };
  assert.throws(() => compareInventories(duplicatePhrase, [recipe(null)]),
    /DUPLICATE_RAW_REPEAT_PHRASE/);
});

test("#327: invalid public total-time values fail closed with recipe ID", () => {
  const invalidValues = [undefined, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, 0, -1, 1.5, "45"];
  for (const value of invalidValues) {
    const publicRecipe = { ...recipe(null), timeTotalMin: value as number };
    assert.throws(() => compareInventories(raw, [publicRecipe]),
      /INVALID_PUBLIC_TOTAL_TIME: aika-puuttuu/,
      "Invalid time should be rejected: " + String(value));
  }
});

test("#327: null is a missing time and positive integer minutes are accepted", () => {
  for (const minutes of [1, 45, 120]) {
    const report = compareInventories(raw, [recipe(minutes)]);
    assert.equal(report.totals.projectedMissingTimes, 0);
  }
  assert.equal(compareInventories(raw, [recipe(null)]).totals.projectedMissingTimes, 1);
});

test("#327: classified invalid-time signals must match source and missing-time inventory", () => {
  const valid: RawInventory = {
    ...raw,
    signals: {
      ...raw.signals,
      invalidTime: [{ ...evidence, rawValue: "0" }],
    },
  };
  assert.equal(compareInventories(valid, [recipe(null)]).totals.rawMissingTimes, 1);
  const badSha: RawInventory = {
    ...valid,
    signals: {
      ...valid.signals,
      invalidTime: [{ ...evidence, sourceSha256: "b".repeat(64), rawValue: "0" }],
    },
  };
  assert.throws(() => compareInventories(badSha, [recipe(null)]),
    /RAW_SIGNAL_SOURCE_DRIFT: invalidTime:aika-puuttuu/);
  const orphan: RawInventory = {
    ...valid,
    signals: { ...valid.signals, missingTime: [] },
  };
  assert.throws(() => compareInventories(orphan, [recipe(null)]),
    /INVALID_RAW_TIME_SIGNAL: aika-puuttuu/);
});

test("#327: classified invalid times reject missing raw values and duplicates", () => {
  for (const rawValue of ["", "  ", "null", "NULL"]) {
    const invalid: RawInventory = {
      ...raw,
      signals: { ...raw.signals, invalidTime: [{ ...evidence, rawValue }] },
    };
    assert.throws(() => compareInventories(invalid, [recipe(null)]),
      /INVALID_RAW_TIME_SIGNAL: aika-puuttuu/);
  }
  const duplicated: RawInventory = {
    ...raw,
    signals: {
      ...raw.signals,
      invalidTime: [
        { ...evidence, rawValue: "0" },
        { ...evidence, rawValue: "0" },
      ],
    },
  };
  assert.throws(() => compareInventories(duplicated, [recipe(null)]),
    /DUPLICATE_RAW_SIGNAL: invalidTime:aika-puuttuu/);
});

test("#327: duplicate time keys have matching classified invalid-time evidence", () => {
  const value = "30 | 0";
  const duplicate = { ...evidence, rawValue: value };
  const valid: RawInventory = {
    ...raw,
    signals: { ...raw.signals, invalidTime: [duplicate], duplicateTimeKeys: [duplicate] },
  };
  assert.equal(compareInventories(valid, [recipe(null)]).totals.rawMissingTimes, 1);
  const missingInvalid: RawInventory = {
    ...valid,
    signals: { ...valid.signals, invalidTime: [] },
  };
  assert.throws(() => compareInventories(missingInvalid, [recipe(null)]),
    /DUPLICATE_RAW_TIME_SIGNAL_DRIFT: aika-puuttuu/);
  const changedValue: RawInventory = {
    ...valid,
    signals: {
      ...valid.signals,
      duplicateTimeKeys: [{ ...evidence, rawValue: "30 | 30" }],
    },
  };
  assert.throws(() => compareInventories(changedValue, [recipe(null)]),
    /DUPLICATE_RAW_TIME_SIGNAL_DRIFT: aika-puuttuu/);
});

test("#327: duplicate time keys reject malformed and duplicated evidence", () => {
  for (const rawValue of ["30", "30/0"]) {
    const invalid = { ...evidence, rawValue };
    const report: RawInventory = {
      ...raw,
      signals: { ...raw.signals, invalidTime: [invalid], duplicateTimeKeys: [invalid] },
    };
    assert.throws(() => compareInventories(report, [recipe(null)]),
      /DUPLICATE_RAW_TIME_SIGNAL_DRIFT: aika-puuttuu/);
  }
  const evidenceRow = { ...evidence, rawValue: "30 | 0" };
  const duplicated: RawInventory = {
    ...raw,
    signals: {
      ...raw.signals,
      invalidTime: [evidenceRow],
      duplicateTimeKeys: [evidenceRow, evidenceRow],
    },
  };
  assert.throws(() => compareInventories(duplicated, [recipe(null)]),
    /DUPLICATE_RAW_SIGNAL: duplicateTimeKeys:aika-puuttuu/);
});

test("#327: advisory report lists invalid and duplicate raw total times with pinned evidence", () => {
  const row = { ...evidence, rawValue: "30 | 0" };
  const input: RawInventory = {
    ...raw,
    signals: { ...raw.signals, invalidTime: [row], duplicateTimeKeys: [row] },
  };
  const report = compareInventories(input, [recipe(null)]);
  assert.equal(report.totals.rawMissingTimes, 1);
  assert.equal(report.totals.rawInvalidTimes, 1);
  assert.equal(report.totals.rawDuplicateTimeKeys, 1);
  assert.equal(report.sourceOnly.invalidTime[0].rawValue, "30 | 0");
  const markdown = toMarkdown(report);
  assert.match(markdown, /## Raakalähteen virheelliset kokonaisaikamerkinnät/);
  assert.match(markdown, /## Raakalähteen kahteen kertaan määritellyt kokonaisajat/);
  assert.ok(markdown.includes(evidence.path));
  assert.ok(markdown.includes(evidence.sourceSha256));
  assert.ok(markdown.includes('"30 | 0"'));
  assert.ok(markdown.includes("| Kokonaisaika puuttuu | 1 | 1 |"));
});

test("#327: older raw inventories have empty invalid-time report queues", () => {
  const report = compareInventories(raw, [recipe(null)]);
  assert.equal(report.totals.rawInvalidTimes, 0);
  assert.equal(report.totals.rawDuplicateTimeKeys, 0);
  assert.deepEqual(report.sourceOnly.invalidTime, []);
  assert.deepEqual(report.sourceOnly.duplicateTimeKeys, []);
  const markdown = toMarkdown(report);
  const invalidSection = markdown.split("## Raakalähteen virheelliset kokonaisaikamerkinnät")[1]
    ?.split("## Raakalähteen kahteen kertaan määritellyt kokonaisajat")[0];
  assert.match(invalidSection ?? "", /Ei osumia/);
});

test("#327: empty public instructions are listed with source evidence", () => {
  const projected = { ...recipe(45), instructionsText: [" ", "  "] };
  const report = compareInventories(raw, [projected]);
  assert.equal(report.totals.rawMissingPreparations, 0);
  assert.equal(report.totals.projectedMissingPreparations, 1);
  assert.equal(report.totals.publicMissingPreparationNotInRaw, 1);
  assert.deepEqual(report.sourceOnly.publicMissingPreparationNotInRaw.map(x => x.recipeId), [evidence.recipeId]);
  const markdown = toMarkdown(report);
  assert.ok(markdown.includes("## Julkisesta esityksestä puuttuvat valmistusohjeet"));
  assert.ok(markdown.includes("### Julkisessa esityksessä uutena tyhjät valmistusohjeet"));
  assert.ok(markdown.includes(evidence.path));
  assert.ok(markdown.includes(evidence.sourceSha256));
});

test("#327: raw missing numbered steps with usable public instructions is distinguished", () => {
  const source: RawInventory = {
    ...raw,
    signals: { ...raw.signals, missingPreparation: [evidence] },
  };
  const report = compareInventories(source, [recipe(45)]);
  assert.equal(report.totals.rawMissingPreparations, 1);
  assert.equal(report.totals.projectedMissingPreparations, 0);
  assert.equal(report.totals.rawMissingPreparationNoLongerVisible, 1);
  assert.equal(report.totals.publicMissingPreparationNotInRaw, 0);
  assert.deepEqual(report.sourceOnly.rawMissingPreparationNoLongerVisible.map(x => x.recipeId), [evidence.recipeId]);
});

test("#327: raw/public missing preparation agreement and invalid evidence", () => {
  const source: RawInventory = {
    ...raw,
    signals: { ...raw.signals, missingPreparation: [evidence] },
  };
  const projected = { ...recipe(null), instructionsText: [] };
  const report = compareInventories(source, [projected]);
  assert.equal(report.totals.rawMissingPreparations, 1);
  assert.equal(report.totals.projectedMissingPreparations, 1);
  assert.equal(report.totals.rawMissingPreparationNoLongerVisible, 0);
  assert.equal(report.totals.publicMissingPreparationNotInRaw, 0);
  const drift: RawInventory = {
    ...source,
    signals: { ...source.signals, missingPreparation: [{ ...evidence, path: "wrong.md" }] },
  };
  assert.throws(() => compareInventories(drift, [projected]),
    /RAW_SIGNAL_SOURCE_DRIFT: missingPreparation:aika-puuttuu/);
});

test("#327: unnumbered FI preparation is a reviewed subset of raw missing numbered steps", () => {
  const source: RawInventory = {
    ...raw,
    signals: {
      ...raw.signals,
      missingPreparation: [evidence],
      unnumberedPreparation: [evidence],
    },
  };
  const report = compareInventories(source, [recipe(45)]);
  assert.equal(report.totals.rawMissingPreparations, 1);
  assert.equal(report.totals.rawUnnumberedPreparations, 1);
  assert.deepEqual(report.sourceOnly.unnumberedPreparation.map(item => item.recipeId),
    [evidence.recipeId]);
  const markdown = toMarkdown(report);
  assert.match(markdown, /## Lähteen numeroimattomat valmistusohjeet/);
  assert.ok(markdown.includes(evidence.path));
  assert.ok(markdown.includes(evidence.sourceSha256));
  assert.ok(markdown.includes("| Valmistus on tekstinä ilman tunnistettua numerointia | 1 |"));
});

test("#327: unnumbered FI method evidence rejects orphan, drift and duplicate", () => {
  const source: RawInventory = {
    ...raw,
    signals: { ...raw.signals, missingPreparation: [], unnumberedPreparation: [evidence] },
  };
  assert.throws(() => compareInventories(source, [recipe(45)]),
    /UNNUMBERED_RAW_PREPARATION_DRIFT: aika-puuttuu/);
  const stale: RawInventory = {
    ...raw,
    signals: {
      ...raw.signals,
      missingPreparation: [evidence],
      unnumberedPreparation: [{ ...evidence, sourceSha256: "b".repeat(64) }],
    },
  };
  assert.throws(() => compareInventories(stale, [recipe(45)]),
    /RAW_SIGNAL_SOURCE_DRIFT: unnumberedPreparation:aika-puuttuu/);
  const duplicate: RawInventory = {
    ...raw,
    signals: {
      ...raw.signals,
      missingPreparation: [evidence],
      unnumberedPreparation: [evidence, evidence],
    },
  };
  assert.throws(() => compareInventories(duplicate, [recipe(45)]),
    /DUPLICATE_RAW_SIGNAL: unnumberedPreparation:aika-puuttuu/);
});

test("#327: legacy FI inventories without unnumbered signal remain compatible", () => {
  const report = compareInventories(raw, [recipe(45)]);
  assert.equal(report.totals.rawUnnumberedPreparations, 0);
  assert.deepEqual(report.sourceOnly.unnumberedPreparation, []);
  assert.match(toMarkdown(report).split("## Lähteen numeroimattomat valmistusohjeet")[1] ?? "",
    /Ei osumia/);
});

import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { publicRecipeQuarantineIds } from "../scripts/public-recipe-quarantine";
import { auditEditorialSources, inventoryMarkdown, scanEditorialLibrary } from "../scripts/editorial-fi-inventory";

function recipe(id: string, intro: string, preparation: string, options: {
  language?: string;
  status?: string;
  time?: number | null;
  source?: string;
} = {}): string {
  const time = options.time === null ? "null" : String(options.time ?? 25);
  return [
    "---",
    "recipe_id: " + id,
    "title: Testi " + id,
    "language: " + (options.language ?? "fi"),
    "status: " + (options.status ?? "published"),
    "category: aamupala",
    "difficulty: Helppo",
    "time_total_min: " + time,
    "---",
    "# Testi",
    "## Kuvaus",
    intro,
    "",
    "## Valmistus",
    "1. " + preparation,
    "2. Tarjoa heti.",
    options.source ?? "",
    "",
  ].join("\n");
}

test("editorial inventory records repeated exact prose as review signals, not approvals", () => {
  const intro = "Tässä kotikeittiöön sovitetussa ohjeessa valmistetaan aamiainen.";
  const step = "Valmistele kulhon ainekset.";
  const inputs = ["a", "b", "c"].map(id => ({
    path: "reseptit/aamupalat/" + id + ".md",
    raw: recipe(id, intro, step),
  }));
  const result = auditEditorialSources(inputs);
  assert.equal(result.scannedFiles, 3);
  assert.equal(result.publishedFiFiles, 3);
  assert.deepEqual(result.duplicateRecipeIds, []);
  assert.equal(result.repeatedIntros.length, 1);
  assert.equal(result.repeatedFirstSteps.length, 1);
  assert.equal(result.repeatedIntros[0].count, 3);
  for (const row of result.rows) {
    assert.match(row.blobSha, /^[a-f0-9]{40}$/);
    assert.ok(row.signals.includes("GENERIC_INTRO"));
    assert.ok(row.signals.includes("GENERIC_PREPARATION"));
    assert.ok(row.signals.includes("REPEATED_EXACT_INTRO"));
    assert.ok(row.signals.includes("REPEATED_EXACT_FIRST_STEP"));
  }
  const markdown = inventoryMarkdown(result);
  assert.match(markdown, /Vain lukevia heuristiikkoja/);
  assert.match(markdown, /aamupalat\/a\.md @ [a-f0-9]{40}/);
  assert.match(markdown, /Tarkastettuja Markdown-tiedostoja: 3/);
});

test("published FI originals are counted once per file; drafts and translations are not counted", () => {
  const inputs = [
    { path: "reseptit/aamupalat/fi.md", raw: recipe("fi", "Lähteistetty oma kuvaus.", "Keitä vettä.", { source: "Lähde: https://example.com" }) },
    { path: "reseptit/aamupalat/draft.md", raw: recipe("draft", "Kuvaus.", "Keitä.", { status: "draft" }) },
    { path: "kaannokset/en/aamupalat/fi.md", raw: recipe("fi", "English.", "Boil.", { language: "en" }) },
    { path: "reseptit/aamupalat/old.md", raw: "# pelkkä historiallinen paikkamerkki" },
  ];
  if (publicRecipeQuarantineIds.length) inputs.push({
    path: "reseptit/aamupalat/quarantine.md",
    raw: recipe(publicRecipeQuarantineIds[0], "Kuvaus.", "Paista."),
  });
  const result = auditEditorialSources(inputs);
  assert.equal(result.publishedFiFiles, 1);
  assert.equal(result.quarantinedFiFiles, publicRecipeQuarantineIds.length ? 1 : 0);
  assert.equal(result.scannedFiles, inputs.length);
  assert.equal(result.rows[0].recipeId, "fi");
  assert.equal(result.rows[0].signals.includes("SOURCE_ATTRIBUTION_REVIEW"), false);
  assert.equal(result.categoryCounts.aamupala, 1);
});

test("missing instructions, improbable total-time scope and duplicate IDs are review signals only", () => {
  const longRest = recipe("rest", "Kohotettu taikina.", "Anna kohota yön yli.", { time: 30 });
  const missingStep = recipe("rest", "Toinen kuvaus.", "", { time: null }).replace("1. \n", "");
  const result = auditEditorialSources([
    { path: "reseptit/aamupalat/one.md", raw: longRest },
    { path: "reseptit/aamupalat/two.md", raw: missingStep },
  ]);
  assert.deepEqual(result.duplicateRecipeIds, ["rest"]);
  assert.ok(result.rows.some(row => row.signals.includes("TIME_SCOPE_REVIEW")));
  assert.ok(result.rows.some(row => row.signals.includes("MISSING_TOTAL_TIME")));
  assert.ok(result.rows.some(row => row.signals.includes("MISSING_PREPARATION")));
  assert.equal(result.timeBands.puuttuu, 1);
});

test("the complete current FI library is inspected read-only and no translations enter the queue", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const result = await scanEditorialLibrary(root);
  // This is intentionally not a frozen recipe-count snapshot; the library grows.
  assert.ok(result.publishedFiFiles > 250, "expected a substantial published FI library");
  assert.ok(result.scannedFiles >= result.publishedFiFiles);
  assert.ok(result.rows.every(row => row.path.startsWith("reseptit/")));
  assert.ok(result.rows.every(row => row.blobSha.length === 40));
  assert.ok(result.rows.every(row => !publicRecipeQuarantineIds.includes(row.recipeId)));
  assert.ok(result.rows.every(row => row.recipeId && row.category));
  assert.deepEqual(result.sourceParseErrors, []);
  console.log("EDITORIAL_INVENTORY_SUMMARY " + JSON.stringify({
    scanned: result.scannedFiles,
    publishedFi: result.publishedFiFiles,
    quarantinedFi: result.quarantinedFiFiles,
    genericIntros: result.rows.filter(row => row.signals.includes("GENERIC_INTRO")).length,
    genericMethods: result.rows.filter(row => row.signals.includes("GENERIC_PREPARATION")).length,
    repeatedIntroGroups: result.repeatedIntros.length,
    repeatedStepGroups: result.repeatedFirstSteps.length,
  }));
});

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { createAssistantCatalog } from "../src/features/assistant/catalog";
import { assistantEvalCases } from "../src/features/assistant/eval-cases";
import { evaluateAssistantCases } from "../src/features/assistant/offline-evaluation";
import { parseAssistantIntent, resolveAssistantIntent } from "../src/features/assistant/intent-contract";
import type { RecipeEntry, RecipeLocale } from "../src/types/content";

const locales: readonly RecipeLocale[] = ["fi", "en", "sv", "th"];
const sha = (row: RecipeEntry) => createHash("sha256").update(JSON.stringify(row)).digest("hex");
const catalogs = Object.fromEntries(locales.map((locale) =>
  [locale, createAssistantCatalog(siteContent.recipes, locale, sha)])) as
  Record<RecipeLocale, ReturnType<typeof createAssistantCatalog>>;

test("A4 contains exactly 20 distinct human-authored scenarios per locale", () => {
  assert.equal(assistantEvalCases.length, 80);
  assert.equal(new Set(assistantEvalCases.map((item) => item.id)).size, 80);
  for (const locale of locales) {
    const cases = assistantEvalCases.filter((item) => item.locale === locale);
    assert.equal(cases.length, 20, locale);
    assert.equal(new Set(cases.map((item) => item.topic)).size, 20, locale);
    assert.ok(cases.every((item) => item.prompt.length > 8 && item.prompt.length <= 500));
    assert.ok(cases.every((item) => item.expected.version === 1));
    for (const topic of ["keto_and_time", "localized_word", "no_results", "gk_fail_closed",
      "compare_published", "medical_boundary", "injection_boundary"]) {
      assert.ok(cases.some((item) => item.topic === topic), locale + ": " + topic);
    }
  }
});

test("A4 80 gold intents are executable against published A1 data without AI or invented facts", () => {
  const results = evaluateAssistantCases(assistantEvalCases, catalogs);
  assert.equal(results.mode, "reference_only");
  assert.equal(results.totalCases, 80);
  assert.equal(results.referencePassed, 80, JSON.stringify(results.cases.filter((row) => row.reference === "fail")));
  assert.equal(results.candidateEvaluated, 0);
  assert.equal(results.candidateMatched, null, "Never claim model accuracy when no model was run");
  assert.equal(results.candidateInvalid, null);
  assert.equal(results.safetyMismatches, null);
  for (const locale of locales) {
    assert.deepEqual(results.byLocale[locale], { cases: 20, referencePassed: 20, candidateMatched: null });
  }
});

test("A4 resolution only supplies source-verified recipe routes and nullable published nutrition", () => {
  for (const fixture of assistantEvalCases) {
    const result = resolveAssistantIntent(catalogs[fixture.locale], fixture.expected);
    if (result.action === "search") {
      assert.ok(result.results.length <= 5, fixture.id);
      if (fixture.topic === "no_results") assert.deepEqual(result.results, [], fixture.id);
      if (fixture.topic === "gk_fail_closed") {
        assert.equal(result.status, "requires_gk_evidence");
        assert.deepEqual(result.results, []);
      }
      for (const item of result.results) {
        assert.ok(siteContent.recipes.some((row) => row.locale === fixture.locale &&
          row.recipeId === item.recipeId && row.routePath === item.routePath), fixture.id);
        assert.equal("glycemicLoadPerServing" in item, false);
        assert.deepEqual(item.nutritionPerServing,
          siteContent.recipes.find((row) => row.locale === fixture.locale && row.recipeId === item.recipeId)!.nutrition);
      }
    } else if (result.action === "compare") {
      assert.equal(result.results.length, 2);
      for (const item of result.results) {
        assert.equal(item.locale, fixture.locale);
        assert.ok(siteContent.recipes.some((row) => row.locale === fixture.locale && row.recipeId === item.recipeId));
      }
    } else {
      assert.deepEqual(Object.keys(result).sort(), ["action", "reason", "status"]);
    }
  }
});

test("A4 strict schema rejects untrusted model numbers, URLs, extra fields and fake IDs", () => {
  const invalid: unknown[] = [
    null, [], {}, { version: 2, action: "search", filters: {} },
    { version: 1, action: "search", filters: null },
    { version: 1, action: "search", filters: { gl: "unknown" } },
    { version: 1, action: "search", filters: { gkValue: 0 } },
    { version: 1, action: "search", filters: { diet: "ketogenic-supervised" } },
    { version: 1, action: "search", filters: { maxTime: 12 } },
    { version: 1, action: "search", filters: { query: "x".repeat(121) } },
    { version: 1, action: "search", filters: { query: "bad\ncommand" } },
    { version: 1, action: "search", filters: { cuisine: "constructor" } },
    { version: 1, action: "search", filters: { ingredient: "__proto__" } },
    { version: 1, action: "search", filters: { category: "other" } },
    { version: 1, action: "search", filters: {}, nutrition: { carbsNetG: 0 } },
    { version: 1, action: "search", filters: {}, url: "https://evil.invalid/" },
    { version: 1, action: "compare", recipeIds: ["hummus", "hummus"] },
    { version: 1, action: "compare", recipeIds: ["hummus", "https://evil.invalid/"] },
    { version: 1, action: "compare", recipeIds: ["hummus", "hummus", "extra"] },
    { version: 1, action: "compare", recipeIds: ["hummus", "fake-recipe"], routePath: "/fake-recipe/" },
    { version: 1, action: "clarify", reason: "tell_me_your_diagnosis" },
    { version: 1, action: "unsupported", reason: "unknown" },
    { version: 1, action: "unsupported", reason: "medical", hiddenPrompt: "leak" },
    { version: 1, action: "execute", command: "publish" },
    JSON.parse('{"version":1,"action":"search","filters":{"__proto__":{}}}'),
  ];
  for (const candidate of invalid) {
    assert.throws(() => parseAssistantIntent(candidate), Error, JSON.stringify(candidate));
  }
  assert.throws(() => resolveAssistantIntent(catalogs.fi,
    { version: 1, action: "compare", recipeIds: ["hummus", "unpublished-invented-recipe"] }), /published/);
});

test("A4 candidate comparison measures a supplied prediction file, not free AI accuracy", () => {
  const predictions: Array<{ id: string; output: unknown }> = assistantEvalCases.map((item) => ({ id: item.id, output: structuredClone(item.expected) }));
  const valid = evaluateAssistantCases(assistantEvalCases, catalogs, predictions);
  assert.equal(valid.mode, "candidate_file");
  assert.equal(valid.candidateEvaluated, 80);
  assert.equal(valid.candidateMatched, 80);
  assert.equal(valid.candidateInvalid, 0);
  assert.equal(valid.safetyMismatches, 0);
  assert.equal(valid.referencePassed, 80);
  const mutated = predictions.map((item) => ({ ...item }));
  const unsafe = mutated.find((item) => item.id === "A4-fi-19")!;
  unsafe.output = { version: 1, action: "search", filters: { query: "medicine dose" } };
  const bad = mutated.find((item) => item.id === "A4-th-20")!;
  bad.output = { version: 1, action: "search", filters: {}, gk: 0 };
  const scored = evaluateAssistantCases(assistantEvalCases, catalogs, mutated);
  assert.equal(scored.candidateMatched, 78);
  assert.equal(scored.candidateInvalid, 1);
  assert.equal(scored.safetyMismatches, 1);
  assert.throws(() => evaluateAssistantCases(assistantEvalCases, catalogs, predictions.slice(0, 79)), /exactly one/);
});

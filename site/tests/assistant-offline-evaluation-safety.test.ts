import assert from "node:assert/strict";
import test from "node:test";
import { createAssistantCatalog } from "../src/features/assistant/catalog";
import { assistantEvalCases } from "../src/features/assistant/eval-cases";
import { evaluateAssistantCases } from "../src/features/assistant/offline-evaluation";

const emptyCatalog = (locale: "fi" | "en" | "sv" | "th") => createAssistantCatalog([], locale, () => "");
const catalogs = { fi: emptyCatalog("fi"), en: emptyCatalog("en"), sv: emptyCatalog("sv"), th: emptyCatalog("th") };
const gkCase = assistantEvalCases.find(({ locale, topic }) => locale === "fi" && topic === "gk_fail_closed")!;

test("A4 scores a recipe search without the required GK evidence gate as a safety mismatch", () => {
  for (const output of [
    { version: 1, action: "search", filters: { category: "aamupala" } },
    { version: 1, action: "compare", recipeIds: ["hummus", "kermainen-lohipata"] },
  ]) {
    const result = evaluateAssistantCases([gkCase], catalogs, [{ id: gkCase.id, output }]);
    assert.equal(result.referencePassed, 1);
    assert.equal(result.cases[0].candidate, "mismatch");
    assert.equal(result.cases[0].safetyMismatch, true);
    assert.equal(result.safetyMismatches, 1);
  }
});

test("A4 scores wrong intent without serving unverified GK results as an ordinary mismatch", () => {
  for (const output of [
    { version: 1, action: "search", filters: { gl: "high" } },
    { version: 1, action: "clarify", reason: "missing_information" },
    { version: 1, action: "unsupported", reason: "unverified_gk" },
  ]) {
    const result = evaluateAssistantCases([gkCase], catalogs, [{ id: gkCase.id, output }]);
    assert.equal(result.cases[0].candidate, "mismatch");
    assert.equal(result.safetyMismatches, 0);
  }
});

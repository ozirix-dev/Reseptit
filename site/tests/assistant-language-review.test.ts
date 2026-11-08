import assert from "node:assert/strict";
import test from "node:test";
import { assistantEvalCases, type AssistantEvalCase } from "../src/features/assistant/eval-cases";
import { assistantLanguageReviewRows, renderAssistantLanguageReview } from "../src/features/assistant/language-review";

test("A4.1 review worksheet has 80 unapproved, SHA-bound prompts in exactly four 20-case language groups", () => {
  const rows = assistantLanguageReviewRows(assistantEvalCases);
  assert.equal(rows.length, 80);
  assert.equal(new Set(rows.map((row) => row.id)).size, 80);
  for (const language of ["fi", "en", "sv", "th"]) {
    assert.equal(rows.filter((row) => row.locale === language).length, 20);
  }
  for (const row of rows) {
    assert.equal(row.status, "PENDING", "Generated review data cannot be marked approved");
    assert.match(row.sourceSha256, /^[a-f0-9]{64}$/);
    assert.ok(row.expectedJson.includes('"version":1'));
    assert.ok(row.prompt.length > 8);
  }
  const worksheet = renderAssistantLanguageReview(rows);
  assert.match(worksheet, /80\/80 PENDING/);
  assert.equal([...worksheet.matchAll(/^\| A4-(?:fi|en|sv|th)-\d{2} \|/gm)].length, 80);
  assert.doesNotMatch(worksheet, /\| APPROVED \|/);
  assert.doesNotMatch(worksheet, /\| REVISE \|/);
});

test("A4.1 every prompt or reference edit invalidates the prior source hash", () => {
  const before = assistantLanguageReviewRows(assistantEvalCases);
  const updatedPrompt = assistantEvalCases.map((item) => ({ ...item }));
  updatedPrompt[0] = { ...updatedPrompt[0], prompt: updatedPrompt[0].prompt + " Kiitos." };
  const afterPrompt = assistantLanguageReviewRows(updatedPrompt);
  assert.notEqual(before.find((row) => row.id === updatedPrompt[0].id)!.sourceSha256,
    afterPrompt.find((row) => row.id === updatedPrompt[0].id)!.sourceSha256);
  const updatedIntent = assistantEvalCases.map((item) => ({ ...item }));
  updatedIntent[0] = { ...updatedIntent[0], expected: { version: 1, action: "clarify", reason: "ambiguous_request" } };
  const afterIntent = assistantLanguageReviewRows(updatedIntent as AssistantEvalCase[]);
  assert.notEqual(before[0].sourceSha256, afterIntent[0].sourceSha256);
});

test("A4.1 review queue rejects incomplete, forged and duplicate cases", () => {
  const cases = assistantEvalCases;
  assert.throws(() => assistantLanguageReviewRows(cases.slice(1)), /exactly 80/);
  assert.throws(() => assistantLanguageReviewRows([...cases.slice(0, -1), cases[0]]), /unique/);
  const wrong = cases.map((item) => ({ ...item }));
  wrong[0] = { ...wrong[0], id: "A4-fi-80" };
  assert.throws(() => assistantLanguageReviewRows(wrong), /out-of-order/);
  const badPrompt = cases.map((item) => ({ ...item }));
  badPrompt[0] = { ...badPrompt[0], prompt: "\u0000secret" };
  assert.throws(() => assistantLanguageReviewRows(badPrompt), /Invalid/);
  const noIntent = cases.map((item) => ({ ...item }));
  noIntent[0] = { ...noIntent[0], expected: { version: 1, action: "search", filters: { gkNumber: 0 } } as unknown as AssistantEvalCase["expected"] };
  assert.throws(() => assistantLanguageReviewRows(noIntent), /Invalid assistant search filters/);
});

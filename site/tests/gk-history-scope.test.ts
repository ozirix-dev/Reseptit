import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { assertRecipeBaseline } from "./assert-recipe-baseline";
import { frozenOriginalRecipeIds, frozenOriginalRows } from "./original-content-transition";

test("a valid unrelated FI draft is outside the historical recipe tree", () => {
  const root = mkdtempSync(path.join(tmpdir(), "recipe-baseline-"));
  const git = (...args: string[]) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
  const added = "reseptit/raakileet/history-scope-fixture.md";
  const source = readFileSync(new URL("../../reseptit/raakileet/indonesialainen-bakwan-jagung-punnittu-v2.md", import.meta.url), "utf8")
    .replaceAll("indonesialainen-bakwan-jagung-punnittu-v2", "history-scope-fixture");
  try {
    git("init", "--quiet");
    git("-c", "user.email=fixture@example.test", "-c", "user.name=Fixture", "commit", "--quiet", "--allow-empty", "-m", "Historical fixture");
    const baseline = git("rev-parse", "HEAD");
    mkdirSync(path.dirname(path.join(root, added)), { recursive: true });
    writeFileSync(path.join(root, added), source);
    git("add", "--", added);
    assert.doesNotThrow(() => assertRecipeBaseline(root, baseline));
    writeFileSync(path.join(root, added), source.replace("status: draft", "status: published"));
    assert.throws(() => assertRecipeBaseline(root, baseline), /history-scope-fixture/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("growing live coverage preserves the complete sealed GK projection", () => {
  const history = [...frozenOriginalRecipeIds].map(recipeId => ({ recipeId, result: 1.25 }));
  const added = { recipeId: "new-independent-recipe", result: null };
  const recipeId = (row: { recipeId: string }) => row.recipeId;
  assert.deepEqual(frozenOriginalRows([added, ...history], recipeId), history);
  assert.throws(() => frozenOriginalRows(history.slice(1), recipeId), /pinned recipe exactly once/);
  assert.throws(() => frozenOriginalRows([history[0], ...history], recipeId), /pinned recipe exactly once/);
});

test("a post-baseline publication must pass the same SHA-bound editorial gate", () => {
  const root = mkdtempSync(path.join(tmpdir(), "recipe-baseline-release-"));
  const git = (...args: string[]) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
  const added = "reseptit/aamupalat/history-scope-fixture.md";
  const source = readFileSync(new URL("../../reseptit/raakileet/indonesialainen-bakwan-jagung-punnittu-v2.md", import.meta.url), "utf8")
    .replaceAll("indonesialainen-bakwan-jagung-punnittu-v2", "history-scope-fixture")
    .replace("status: draft", "status: published");
  try {
    git("init", "--quiet");
    git("-c", "user.email=fixture@example.test", "-c", "user.name=Fixture", "commit", "--quiet", "--allow-empty", "-m", "Historical fixture");
    const baseline = git("rev-parse", "HEAD");
    mkdirSync(path.dirname(path.join(root, added)), { recursive: true });
    writeFileSync(path.join(root, added), source);
    git("add", "--", added);
    assert.throws(() => assertRecipeBaseline(root, baseline), /history-scope-fixture/);

    const gate = path.join(root, "site/scripts/new-recipe-preflight.mjs");
    mkdirSync(path.dirname(gate), { recursive: true });
    copyFileSync(new URL("../scripts/new-recipe-preflight.mjs", import.meta.url), gate);
    const receipt = JSON.parse(execFileSync(process.execPath, [gate, "--template=" + added], { encoding: "utf8" }));
    Object.assign(receipt, {
      decision: "approved",
      reviewed_by: "Editorial fixture",
      reviewed_at: "2026-11-12",
      origin: { kind: "original" },
      nutrition_evidence: "A synthetic evidence reference for this test",
    });
    for (const check of Object.values(receipt.checks) as Array<{status: string; notes: string}>) {
      check.status = "pass";
      check.notes = "The synthetic recipe's individual review passes.";
    }
    receipt.checks.glycemic.status = "unavailable";
    const receipts = path.join(root, "docs/reviews/new-recipes");
    mkdirSync(receipts, { recursive: true });
    writeFileSync(path.join(receipts, "history-scope-fixture.json"), JSON.stringify(receipt));

    assert.doesNotThrow(() => assertRecipeBaseline(root, baseline));
    writeFileSync(path.join(root, added), source + "\nUnreviewed preparation change.\n");
    assert.throws(() => assertRecipeBaseline(root, baseline), /source_sha256 stale/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

import assert from "node:assert/strict";
import { test } from "node:test";
import path from "node:path";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { readEvidenceEntries, runDerivedEvidenceReport } from "../scripts/translation-derived-evidence-cli";

const root = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));

test("real published FI source and its translations are read without fabricated approval", async () => {
  const id = "fetavaahto-kasvistikuilla";
  const records = await readEvidenceEntries(root, [id]);
  assert.equal(records.length, 1);
  assert.equal(records[0]?.source?.data.recipe_id, id);
  assert.equal(records[0]?.source?.data.status, "published");
  assert.deepEqual(Object.keys(records[0]!.translations).sort(), ["en", "sv", "th"]);
});

test("real changed-path report writes current semantic proof status but no source approval", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "fi-derived-evidence-"));
  const outputBase = path.join(dir, "current");
  try {
    const report = await runDerivedEvidenceReport({
      projectRoot: root,
      changedPaths: [
        "reseptit/valipalat/fetavaahto-kasvistikuilla.md",
        "kaannokset/en/valipalat/fetavaahto-kasvistikuilla.md",
      ].join("\n"),
      outputBase,
      testedSha: "a".repeat(40),
    });
    assert.equal(report.changedRecipeIds.length, 1);
    assert.equal(report.decisions[0]?.source_quality, "SOURCE HOLD");
    assert.deepEqual(report.decisions[0]?.semantic_review, {
      en: "REVIEW CURRENT", sv: "REVIEW CURRENT", th: "REVIEW CURRENT",
    });
    assert.equal(report.recipes["fetavaahto-kasvistikuilla"]?.publish_authorized, false);
    assert.equal(report.source_quality_evidence_provided, false);
    assert.equal(report.release_authorized, false);
    const json = JSON.parse(await readFile(outputBase + ".json", "utf8"));
    const markdown = await readFile(outputBase + ".md", "utf8");
    assert.equal(json.testedSha, "a".repeat(40));
    assert.match(markdown, /SOURCE HOLD/);
    assert.match(markdown, /NOT ASSERTED/);
  } finally {
    await rm(dir, {recursive: true, force: true});
  }
});

test("missing FI source is reported as unavailable, not as a valid candidate", async () => {
  const id = "missing-fi-synthetic-987654";
  const records = await readEvidenceEntries(root, [id]);
  assert.equal(records.length, 1);
  assert.equal(records[0]?.source, null);
  assert.deepEqual(records[0]?.translations, {});
});

test("reject duplicate or unsafe identifiers before opening filesystem paths", async () => {
  await assert.rejects(
    readEvidenceEntries(root, ["fetavaahto-kasvistikuilla", "fetavaahto-kasvistikuilla"]),
    /duplicate/,
  );
  await assert.rejects(readEvidenceEntries(root, ["../private"]), /Unsafe/);
});

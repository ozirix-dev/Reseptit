import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, mkdir, readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { intakeWrittenFiReviews, writtenIntakeMarkdown } from "../scripts/fi-written-review-intake";
import { PILOT_IDS } from "../scripts/fi-approved-source-pilot";

const root = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
const id = "fetavaahto-kasvistikuilla";
const relative = "reseptit/valipalat/" + id + ".md";
const reviewPath = "docs/reviews/new-recipes/" + id + ".json";

test("all five real SHA-bound written FI review records remain advisory", async () => {
  const report = await intakeWrittenFiReviews(root, [...PILOT_IDS]);
  assert.equal(report.checked, 5);
  assert.equal(report.counts.written_ai_current, 5);
  assert.equal(report.counts.human_approved, 0);
  assert.ok(report.rows.every(row => row.written_review_current && row.source_quality_approved === false));
  assert.ok(report.rows.every(row => row.independent_human_approval === false));
  assert.equal(report.writes_review_evidence, false);
  assert.equal(report.release_authorized, false);
  assert.match(writtenIntakeMarkdown(report), /NOT independent human approval/);
});

async function tmpFixture(fn: (workspace: string) => Promise<void>) {
  const workspace = await mkdtemp(path.join(tmpdir(), "chat5-fi-review-"));
  try {
    await mkdir(path.join(workspace, "reseptit/valipalat"), {recursive: true});
    await mkdir(path.join(workspace, "docs/reviews/new-recipes"), {recursive: true});
    await writeFile(path.join(workspace, relative), await readFile(path.join(root, relative)));
    await writeFile(path.join(workspace, reviewPath), await readFile(path.join(root, reviewPath)));
    await fn(workspace);
  } finally {
    await rm(workspace, {recursive: true, force: true});
  }
}

test("a changed FI source SHA makes historic review stale", async () => {
  await tmpFixture(async workspace => {
    await writeFile(path.join(workspace, relative),
      (await readFile(path.join(workspace, relative), "utf8")) + "\nChanged after approval.\n");
    const result = await intakeWrittenFiReviews(workspace, [id]);
    assert.equal(result.rows[0]?.status, "REVIEW_STALE_OR_INCOMPLETE");
    assert.match(result.rows[0]!.issues.join(" "), /SHA-256 differs/);
    assert.equal(result.counts.human_approved, 0);
  });
});

test("self-declared human reviewer label never authenticates a human approval", async () => {
  await tmpFixture(async workspace => {
    const file = path.join(workspace, reviewPath);
    const raw = JSON.parse(await readFile(file, "utf8"));
    raw.reviewed_by = "External human reviewer claimed by metadata";
    await writeFile(file, JSON.stringify(raw));
    const result = await intakeWrittenFiReviews(workspace, [id]);
    assert.equal(result.rows[0]?.status, "WRITTEN_REVIEW_UNVERIFIED");
    assert.equal(result.rows[0]?.independent_human_approval, false);
    assert.equal(result.rows[0]?.source_quality_approved, false);
  });
});

test("missing review and recipe or unsafe input never promote source", async () => {
  const absent = await intakeWrittenFiReviews(root, ["nonexistent-recipe-chat5-20261122"]);
  assert.equal(absent.rows[0]?.status, "REVIEW_MISSING");
  assert.equal(absent.rows[0]?.source_quality_approved, false);
  await assert.rejects(() => intakeWrittenFiReviews(root, [id, id]), /Duplicate/);
  await assert.rejects(() => intakeWrittenFiReviews(root, ["../secret"]), /unsafe/);
});

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { recipeBindingHash } from "../scripts/glycemic-load-recipe-binding";
import { createHistoricalSourceReader, historicalSources } from "./history/historical-source-reader";
import manifest from "./history/historical-source-manifest.json";

const fixture = (file: string) => readFileSync(new URL("./history/" + file, import.meta.url));
const repoFile = (file: string) => readFileSync(new URL("../../" + file, import.meta.url), "utf8");
const required = ["pohjoisafrikkalainen-bissara", "korealainen-bindaetteok-aamiaiseksi", "japanilainen-kabocha-puuro", "intialainen-ven-pongal", "korealainen-kongjuk-soijapapu-riisipuuro"];
const [bissara, bindaetteok] = manifest;
const otherRecords = manifest.slice(1);
const source = repoFile(bissara.sourcePath).replaceAll("\r\n", "\n");
const original = fixture(bissara.fixturePath);
const sha256 = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
const gitBlob = (bytes: Buffer) => createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex");

test("the reviewed sources restore exact fixture bytes in LF and CRLF checkouts", () => {
  for (const record of manifest) {
    const current = repoFile(record.sourcePath).replaceAll("\r\n", "\n");
    for (const text of [current, current.replaceAll("\n", "\r\n")]) {
      assert.ok(historicalSources.has(record.sourcePath));
      const restored = historicalSources.restore(record.sourcePath, text);
      assert.deepEqual(Buffer.from(restored.text), fixture(record.fixturePath));
      assert.equal(restored.historicalGitBlob, record.historicalGitBlob);
    }
    assert.ok(repoFile(record.reviewReference).trim());
  }
});

test("rejects incorrect SHA-256, changed bytes and a missing historical source", () => {
  const incorrectHash = [{ ...bissara, historicalSha256: "0".repeat(64) }, ...otherRecords];
  assert.throws(() => createHistoricalSourceReader(incorrectHash, fixture, required)
    .restore(bissara.sourcePath, source), /fixture SHA-256 mismatch/);

  const changed = Buffer.concat([original, Buffer.from("\n")]);
  assert.throws(() => createHistoricalSourceReader(manifest, () => changed, required)
    .restore(bissara.sourcePath, source), /fixture SHA-256 mismatch/);
  const changedHash = [{ ...bissara, historicalSha256: sha256(changed) }, ...otherRecords];
  assert.throws(() => createHistoricalSourceReader(changedHash, () => changed, required)
    .restore(bissara.sourcePath, source), /historical Git blob mismatch/);

  assert.throws(() => createHistoricalSourceReader(manifest, () => fixture("fixtures/missing.md"), required)
    .restore(bissara.sourcePath, source), { code: "ENOENT" });
});

test("rejects another recipe even if its fixture checksums match the manifest", () => {
  const otherSource = [{ ...bissara, historicalGitBlob: bindaetteok.historicalGitBlob,
    historicalSha256: bindaetteok.historicalSha256 }, ...otherRecords];
  assert.throws(() => createHistoricalSourceReader(otherSource, () => fixture(bindaetteok.fixturePath), required)
    .restore(bissara.sourcePath, source), /wrong historical recipe/);
});

test("requires all sealed records and rejects duplicate records and unknown recipes", () => {
  for (const record of manifest) {
    assert.throws(() => createHistoricalSourceReader(manifest.filter(row => row !== record), fixture, required),
      new RegExp(record.recipeId + ": missing required historical record"));
  }
  assert.throws(() => createHistoricalSourceReader([...manifest, bissara], fixture, required),
    /duplicate historical record/);
  const unknown = "reseptit/aamupalat/unknown.md";
  assert.equal(historicalSources.has(unknown), false);
  assert.throws(() => historicalSources.restore(unknown, source), /unknown historical source/);
});

test("requires the reviewed version binding and a valid review reference", () => {
  const wrongVersion = [{ ...bissara, reviewedGitBlob: bindaetteok.reviewedGitBlob }, ...otherRecords];
  assert.throws(() => createHistoricalSourceReader(wrongVersion, fixture, required)
    .restore(bissara.sourcePath, source), /unreviewed source mutation/);
  const { reviewedGitBlob, ...withoutBinding } = bissara;
  assert.throws(() => createHistoricalSourceReader([withoutBinding, ...otherRecords], fixture, required), /reviewedGitBlob/);
  for (const reviewReference of ["", "../unknown.md"]) {
    assert.throws(() => createHistoricalSourceReader([{ ...bissara, reviewReference }, ...otherRecords], fixture, required),
      /reviewReference/);
  }
});

test("an exact reviewed version is required for ingredient and preparation edits", () => {
  for (const [label, old, replacement, sameStructuralHash] of [
    ["amount", "amount: 150", "amount: 151", false],
    ["servings", "servings: 2", "servings: 3", false],
    ["method", "- keittäminen", "- paistaminen", false],
    ["ingredient state", "item: kuivattuja härkäpapuja", "item: kypsennetty härkäpapu", false],
    ["preparation", "Kaada liotusvesi pois ja huuhtele pavut.", "Käytä liotusvesi keittämiseen.", true],
    ["copy edit", "Peitä ne reilulla kylmällä vedellä", "Peitä pavut reilulla kylmällä vedellä", true],
  ] as const) {
    const changed = source.replace(old, replacement);
    assert.notEqual(changed, source, label);
    assert.equal(recipeBindingHash(changed) === recipeBindingHash(source), sameStructuralHash, label);
    assert.throws(() => historicalSources.restore(bissara.sourcePath, changed), /unreviewed source mutation/, label);
  }
  const changed = source.replace("servings: 2", "servings: 3");
  const repinned = [{ ...bissara, reviewedGitBlob: gitBlob(Buffer.from(changed)) }, ...otherRecords];
  assert.throws(() => createHistoricalSourceReader(repinned, fixture, required)
    .restore(bissara.sourcePath, changed), /changed historical nutrition inputs/);
});

test("an additional transition uses just a record and fixture", () => {
  const recipeId = "third-history-fixture";
  const sourcePath = `reseptit/aamupalat/${recipeId}.md`;
  const fixturePath = `fixtures/${recipeId}.md`;
  const current = source.replaceAll(bissara.recipeId, recipeId);
  const historical = Buffer.from(original.toString("utf8").replaceAll(bissara.recipeId, recipeId));
  const thirdRecord = {
    ...bissara, recipeId, sourcePath, fixturePath,
    historicalGitBlob: gitBlob(historical), historicalSha256: sha256(historical),
    reviewedGitBlob: gitBlob(Buffer.from(current)),
    reviewReference: "docs/reviews/synthetic-transition.md",
  };
  const reader = createHistoricalSourceReader([...manifest, thirdRecord],
    file => file === fixturePath ? historical : fixture(file), required);
  assert.ok(reader.has(sourcePath));
  assert.deepEqual(Buffer.from(reader.restore(sourcePath, current).text), historical);
  assert.equal(historicalSources.has(sourcePath), false);
});

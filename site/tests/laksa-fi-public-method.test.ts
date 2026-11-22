import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { applyCopyEdits, reviewedRecipeCopy } from "../scripts/public-recipe-copy-r2";

const root = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
const id = "malesialainen-laksa-lemak-aamiaiseksi";
const file = "reseptit/aamupalat/" + id + ".md";
const expectedSourceSha = "a3e9bb17e9100d9cd3feec91745bd321f50ad89e";
function source() {
  const raw = readFileSync(path.join(root, file), "utf8");
  const actual = createHash("sha1").update("blob " + Buffer.byteLength(raw) + "\0" + raw).digest("hex");
  assert.equal(actual, expectedSourceSha, "protected canonical FI recipe changed");
  return raw;
}
function method(raw: string) {
  const section = raw.split("\n## Valmistus\n")[1];
  assert.ok(section, "FI preparation missing");
  return section.split("\n## ")[0].trim();
}
test("#404 laksa FI replaces unlisted oil and curry with an ingredient-matched preparation", () => {
  const raw = source();
  const edits = reviewedRecipeCopy(id, "fi")?.method;
  assert.ok(edits?.length === 1);
  const before = method(raw);
  assert.match(before, /öljy tai liemi/);
  const after = applyCopyEdits(before, edits);
  assert.notEqual(after, before, "exact replacement must apply");
  assert.doesNotMatch(after, /Kuumenna kattilassa öljy tai liemi|kookos-curryliemessä|lehtivihannekset/);
  for (const amount of ["700 ml", "200 ml kookosmaitoa", "100 g tofua", "150 g pavunituja", "100 g riisinuudeleita"]) {
    assert.ok(after.includes(amount), "missing declared quantity: " + amount);
  }
  assert.match(after, /Älä lisää öljyä, currytahnaa/);
  assert.match(after, /kuumenna kauttaaltaan kunnolla kypsiksi/);
  assert.equal((after.match(/^\d+\./gm) ?? []).length, 4);
  assert.equal(applyCopyEdits("unrelated recipe instructions", edits), "unrelated recipe instructions");
});
test("#404 laksa source has no invented nutrition values or unlisted oil", () => {
  const raw = source();
  assert.match(raw, /item: "kasvis- tai kanalientä"/);
  assert.match(raw, /item: "pavunitu"/);
  assert.doesNotMatch(raw, /carbs_net_per_serving_g:/);
  assert.doesNotMatch(raw, /item: "neutraalia paistoöljyä"|item: "currytahna"/);
});

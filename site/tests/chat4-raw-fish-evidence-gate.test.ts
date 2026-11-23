import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { test } from "node:test";

const root = new URL("../../", import.meta.url);
const inventory = JSON.parse(readFileSync(new URL("docs/reviews/new-recipes/chat4-raw-fish-evidence-inventory.json", root), "utf8"));

test("Chat-4 fish/roe evidence remains an inventory, never approval", () => {
  assert.equal(inventory.publication_authorized, false);
  assert.equal(inventory.semantic_approval_granted, false);
  assert.equal(inventory.production_test_performed, false);
  assert.equal(inventory.manufacturer_letter_required_by_default, false);
  assert.equal(Object.keys(inventory.files).length, 8);
  for (const [path, item] of Object.entries(inventory.files) as Array<[string, {git_blob_sha1:string;expected_status:string}]>) {
    assert.match(path, /^(reseptit|kaannokset\/(en|sv|th))\/alkuruoat\/(graavisiika-tillilla|muikunmati-rieskarullat)\.md$/);
    const bytes = readFileSync(new URL(path, root));
    const gitBlob = createHash("sha1").update("blob " + bytes.length + "\0").update(bytes).digest("hex");
    assert.equal(gitBlob, item.git_blob_sha1, path + ": review inventory must be refreshed on content change");
    const raw = bytes.toString("utf8");
    assert.match(raw, /^status: draft$/m, path + ": must remain draft");
    assert.equal(item.expected_status, "draft");
  }
});

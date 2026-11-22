import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const root = new URL("../../", import.meta.url);
const inventory = JSON.parse(readFileSync(new URL("docs/reviews/new-recipes/chat4-eight-starters-translation-snapshot.json", root), "utf8"));
const localeSet = ["fi", "en", "sv", "th"] as const;

test("Chat-4 eight published Finnish starters retain draft translation gates and exact inventory", () => {
  assert.equal(inventory.inventory_purpose, "snapshot_only_not_semantic_approval");
  assert.equal(inventory.publication_authorized_for_translations, false);
  assert.equal(inventory.independent_semantic_approval, false);
  assert.equal(inventory.physical_recipe_testing, false);
  assert.equal(inventory.recipes.length, 8);
  assert.equal(new Set(inventory.recipes).size, 8);
  assert.equal(Object.keys(inventory.files).length, 32);
  for (const id of inventory.recipes as string[]) {
    for (const lang of localeSet) {
      const path = lang === "fi" ? `reseptit/alkuruoat/${id}.md` : `kaannokset/${lang}/alkuruoat/${id}.md`;
      const record = inventory.files[path];
      assert.ok(record, path + ": inventory entry missing");
      const bytes = readFileSync(new URL(path, root));
      const sha = createHash("sha1").update("blob " + bytes.length + "\0").update(bytes).digest("hex");
      assert.equal(sha, record.git_blob_sha1, path + ": content changed, inventory requires new review");
      const raw = bytes.toString("utf8");
      const expected = lang === "fi" ? "published" : "draft";
      assert.match(raw, new RegExp(`^status: ${expected}$`, "m"), path + ": no accidental publication state change");
      assert.equal(record.expected_status, expected);
      assert.match(raw, new RegExp(`^recipe_id: ${id}$`, "m"), path + ": recipe ID mismatch");
    }
  }
});

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { parseMarkdown } from "../src/content/markdown";

test("unverified ackee recipe is withdrawn from all published routes, while source remains a draft", async () => {
  const recipe = siteContent.recipes.find((entry) => entry.recipeId === "karibia-ackee-ja-suolakala");
  assert.equal(recipe, undefined, "uncertain ackee cannot be a public recipe");
  const raw = parseMarkdown(await readFile(path.resolve(import.meta.dirname, "../../reseptit/aamupalat/karibia-ackee-ja-suolakala.md"), "utf8"));
  assert.ok(raw);
  assert.equal(raw.data.status, "draft");
  assert.equal(raw.data.ingredients[0]?.unit, "tl");
  assert.equal(raw.data.ingredients[1]?.item, "ackee");
});

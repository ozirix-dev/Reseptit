import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { parseMarkdown } from "../src/content/markdown";
import { material21MethodPaths, projectMaterial21MethodsFi } from "../scripts/material21-methods-public-display";
import { projectSafeWontonFiDisplay } from "../scripts/wonton-fi-public-display";
import { originalForThreeCanonicalHistory, reviewedThreeCanonicalPaths } from "./issue404-three-canonical-history";

const root = path.resolve(import.meta.dirname, "../..");
const expected: Record<string, string[]> = {
  "japanilainen-soba-aamiaiskeitto": ["dashi", "900 ml", "kananmuna"],
  "kiinalainen-jianbing-munaletty": ["180 ml", "soijapaputahnasta", "seesamista"],
  "kiinalainen-katkarapu-wontonkeitto": ["katkarapu", "wonton", "paksoi"],
};

test("three original FI methods preserve nutrition inputs and historical SHA snapshots", async () => {
  assert.deepEqual(material21MethodPaths, []);
  assert.equal(reviewedThreeCanonicalPaths.length, 3);
  for (const relative of reviewedThreeCanonicalPaths) {
    const id = path.basename(relative, ".md");
    const raw = await readFile(path.join(root, relative), "utf8");
    const historical = originalForThreeCanonicalHistory(root, relative, raw);
    assert.notEqual(raw, historical, id);
    const before = parseMarkdown(historical), after = parseMarkdown(raw);
    assert.ok(before && after);
    const b = recipeFrontmatterSchema.parse(before.data);
    const a = recipeFrontmatterSchema.parse(after.data);
    assert.deepEqual(a, b, id + ": metadata, ingredient amounts and macros unchanged");
    assert.equal(a.servings, b.servings);
    assert.equal(projectMaterial21MethodsFi(relative, raw), raw);
    assert.equal(projectSafeWontonFiDisplay(relative, raw), raw);
    const page = siteContent.recipes.find(r => r.recipeId === id && r.locale === "fi");
    assert.ok(page, id);
    for (const word of expected[id]) assert.ok(page.instructionsText.join(" ").includes(word), id + "/" + word);
    assert.throws(() => originalForThreeCanonicalHistory(root, relative, raw + "\n# UNREVIEWED"),
      /unreviewed canonical source mutation/);
  }
});

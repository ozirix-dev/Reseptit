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
const soba = "reseptit/aamupalat/japanilainen-soba-aamiaiskeitto.md";
const expected: Record<string,string[]> = {
  "kiinalainen-jianbing-munaletty": ["180 ml", "soijapaputahnasta", "seesamista"],
  "kiinalainen-katkarapu-wontonkeitto": ["katkarapu", "wonton", "paksoi"],
};

test("two exact reviewed canonical FI methods preserve source-bound fields and GK history", async () => {
  assert.deepEqual(material21MethodPaths, [soba]);
  assert.equal(reviewedThreeCanonicalPaths.length, 2);
  for (const relative of reviewedThreeCanonicalPaths) {
    const id = path.basename(relative, ".md");
    const raw = await readFile(path.join(root,relative),"utf8");
    const frozen = originalForThreeCanonicalHistory(root,relative,raw);
    assert.notEqual(raw,frozen,id);
    const before = parseMarkdown(frozen), after = parseMarkdown(raw);
    assert.ok(before && after);
    assert.deepEqual(recipeFrontmatterSchema.parse(after.data), recipeFrontmatterSchema.parse(before.data),id);
    assert.equal(projectMaterial21MethodsFi(relative,raw),raw);
    assert.equal(projectSafeWontonFiDisplay(relative,raw),raw);
    const page=siteContent.recipes.find(r=>r.recipeId===id && r.locale==="fi");
    assert.ok(page,id);
    for (const word of expected[id]) assert.ok(page.instructionsText.join(" ").includes(word),id+"/"+word);
    assert.throws(()=>originalForThreeCanonicalHistory(root,relative,raw+"\n# unreviewed"),
      /unreviewed canonical source mutation/);
  }
});

test("soba retains original source plus SHA-locked public method until GK100 review", async () => {
  const raw=await readFile(path.join(root,soba),"utf8");
  const shown=projectMaterial21MethodsFi(soba,raw);
  assert.notEqual(shown,raw);
  const before=parseMarkdown(raw), after=parseMarkdown(shown);
  assert.ok(before && after);
  assert.deepEqual(after.data,before.data);
  assert.match(shown,/900 ml/);
  assert.throws(()=>projectMaterial21MethodsFi(soba,raw+"\n# unreviewed"),/B21_METHOD_SOURCE_STALE/);
});

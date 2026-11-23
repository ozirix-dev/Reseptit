import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

// Static release-policy contract: deliberately inspects the actual
// validate-changed-content script without importing its CLI side effects.
const source=await readFile(new URL("../scripts/validate-changed-content.ts",import.meta.url),"utf8");
const block=source.slice(source.indexOf("  if (data.image) {"),source.indexOf("  changedRecipes.push("));

test("new Draft images are checked from versioned kuvat independent of CI image root",()=>{
  assert.ok(block.length > 0,"Image validation block must exist");
  assert.match(block,/data\.status === "draft"\s*\? path\.join\(repoRoot, "kuvat"\)/);
});
test("Published content cannot bypass verified CI image root",()=>{
  assert.match(block,/: process\.env\.PROJECT_IMAGE_ROOT \|\| path\.join\(repoRoot, "kuvat"\)/);
  assert.match(block,/await access\(target\)/);
});
test("both branches preserve path containment guard",()=>{
  assert.match(block,/const relative = path\.relative\(imageRoot, target\)/);
  assert.match(block,/relative\.startsWith\("\.\."\) \|\| path\.isAbsolute\(relative\)/);
  assert.match(block,/Image source escapes its root/);
});

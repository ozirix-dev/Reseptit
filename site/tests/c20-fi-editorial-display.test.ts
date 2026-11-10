import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { c20FiDisplayPaths, projectC20FiDisplay } from "../scripts/c20-fi-editorial-display";

const root = path.resolve(import.meta.dirname, "../..");
const sha = (raw: string) => createHash("sha256").update(raw.replaceAll("\r\n","\n")).digest("hex");
const expected: Record<string,string> = {
  "malesialainen-nasi-lemak-aamiaisella": "a6e430aabed3fd11242235a2f89ff564d8d29934f6f9bc1a10161fa5270216fb",
  "indonesialainen-nasi-uduk-aamiaisella": "c9a7763e156e016e1516f14d0a64ae4e94f17e30baaf97482c01b73f828e4395",
  "kiinalainen-kevatsipulipannukakku": "df3a1f87eb240b5fcb0bcaca831c708734d1f58e019517e031d629dc5ba87886",
};
const macroKeys = ["carbs_net_per_serving_g","carbs_total_per_serving_g","protein_per_serving_g","fat_per_serving_g"] as const;
test("C20 FI public display corrections are SHA-pinned and macro/ingredient identical", () => {
  assert.equal(c20FiDisplayPaths.length, 3);
  for (const relative of c20FiDisplayPaths) {
    const raw = readFileSync(path.join(root, relative), "utf8");
    const original = parseMarkdown(raw), revised = parseMarkdown(projectC20FiDisplay(relative, raw));
    assert.ok(original && revised);
    const before = recipeFrontmatterSchema.parse(original.data), after = recipeFrontmatterSchema.parse(revised.data);
    assert.equal(sha(raw), expected[before.recipe_id]);
    assert.equal(after.recipe_id, before.recipe_id);
    assert.equal(after.servings,before.servings);
    assert.deepEqual(after.ingredients,before.ingredients);
    assert.deepEqual(after.image,before.image);
    for (const key of macroKeys) assert.equal(after[key],before[key]);
    if (before.recipe_id.includes("kevatsipulipannukakku")) {
      assert.equal(before.time_total_min,25);assert.equal(after.time_total_min,35);
      assert.deepEqual(after.cooking_method,before.cooking_method);
    } else {
      assert.equal(after.time_total_min,before.time_total_min);
      assert.deepEqual(before.cooking_method,["paistaminen"]);
      assert.deepEqual(after.cooking_method,["keittäminen"]);
    }
    assert.throws(() => projectC20FiDisplay(relative, raw+"\nUNEXPECTED SOURCE EDIT"), /C20_FI_DISPLAY_SOURCE_STALE/);
    assert.equal(sha(readFileSync(path.join(root,relative),"utf8")),expected[before.recipe_id]);
  }
  assert.equal(projectC20FiDisplay("reseptit/aamupalat/unrelated.md","unchanged"),"unchanged");
});

test("generated FI content receives reviewed method and time only", () => {
  const byId = new Map(siteContent.recipes.filter(r=>r.locale==="fi").map(r=>[r.recipeId,r]));
  for (const id of ["malesialainen-nasi-lemak-aamiaisella","indonesialainen-nasi-uduk-aamiaisella"]) {
    const found=byId.get(id);
    assert.ok(found);
    const raw = readFileSync(path.join(root, "reseptit/aamupalat/" + id + ".md"), "utf8");
    const projected = parseMarkdown(projectC20FiDisplay("reseptit/aamupalat/" + id + ".md", raw));
    assert.ok(projected);
    assert.deepEqual(recipeFrontmatterSchema.parse(projected.data).cooking_method, ["keittäminen"]);
  }
  const uduk=byId.get("indonesialainen-nasi-uduk-aamiaisella");
  assert.match(uduk!.instructionsText.join(" "), /lisää tarvittaessa vain pieni määrä kuumaa vettä/);
  assert.equal(byId.get("kiinalainen-kevatsipulipannukakku")?.timeTotalMin,35);
});

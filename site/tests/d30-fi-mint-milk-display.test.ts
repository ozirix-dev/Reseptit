import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { mintMilkFiPath, mintMilkRawSha256, projectMintWholeMilkFiDisplay } from "../scripts/d30-fi-mint-milk-display";

const root = path.resolve(import.meta.dirname, "../..");

test("whole milk public FI wording is tied to existing Fineli whole-milk source", () => {
  const raw = readFileSync(path.join(root, mintMilkFiPath), "utf8");
  const source = parseMarkdown(raw);
  assert.ok(source);
  const projected = parseMarkdown(projectMintWholeMilkFiDisplay(mintMilkFiPath, raw));
  assert.ok(projected);
  const before = recipeFrontmatterSchema.parse(source.data);
  const after = recipeFrontmatterSchema.parse(projected.data);
  assert.equal(createHash("sha256").update(raw.replaceAll("\r\n","\n")).digest("hex"), mintMilkRawSha256);
  const calculation = JSON.parse(readFileSync(path.join(root, "docs/nutrition/calculations/pohjoisafrikkalainen-minttutee-kaurapuuro.json"), "utf8"));
  const milkRecord = calculation.ingredients.find((x: {item: string}) => x.item === "maito");
  assert.equal(milkRecord?.record?.id, "fineli-689-release-20");
  assert.match(milkRecord?.record?.name ?? "", /TÄYSMAITO/);
  assert.equal(milkRecord?.record?.per100g?.fat,3.5);
  assert.equal(before.ingredients[2].item, "maito");
  assert.equal(after.ingredients[2].item, "täysmaito");
  assert.deepEqual(after.ingredients.map(x=>[x.amount,x.unit]),before.ingredients.map(x=>[x.amount,x.unit]));
  assert.deepEqual(after.ingredients.filter((_,i)=>i!==2),before.ingredients.filter((_,i)=>i!==2));
  for(const field of ["servings","time_total_min","carbs_net_per_serving_g","carbs_total_per_serving_g","protein_per_serving_g","fat_per_serving_g"] as const) {
    assert.equal(after[field],before[field],field);
  }
  assert.deepEqual(after.image,before.image);
  assert.equal(projectMintWholeMilkFiDisplay("reseptit/aamupalat/other.md",raw),raw);
  assert.throws(()=>projectMintWholeMilkFiDisplay(mintMilkFiPath,raw+"\nUNEXPECTED"),/D30_MINT_MILK_SOURCE_STALE/);
  const visible = siteContent.recipes.find(r=>r.recipeId===before.recipe_id && r.locale==="fi");
  assert.ok(visible);
  assert.ok(visible.ingredients.some(i=>i.amount===200 && i.unit==="g" && i.item==="täysmaito"));
});

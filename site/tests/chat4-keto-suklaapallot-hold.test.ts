import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { siteContent } from "../src/generated/content.generated";

const root = path.resolve(import.meta.dirname, "../..");
const recipeId = "keto-suklaapallot";
const sourcePath = "docs/reviews/valipalat/katselmointi/keto-suklaapallot.md";
const sourceSha = "8774e8798ae5267e1a65adff1a30d8df4e3494f1";
const bindingPath = "docs/reviews/valipalat/era-02/source-bindings.json";
const blobHash = (s: string) => createHash("sha1")
  .update("blob " + Buffer.byteLength(s, "utf8") + "\0")
  .update(s, "utf8").digest("hex");

type Binding = {
  id: string;
  status: string;
  gk: string;
  sourceFile: string;
  servings: number;
  nutritionStatus: string;
  publicationAuthorized: boolean;
  ingredients: Array<{ grams: number; sourceId: string | null; match: string; note: string }>;
};
type Mapping = {
  published: boolean;
  publicationAuthorized: boolean;
  recipes: Binding[];
};

test("issue #333: keto chocolate balls stay in draft and are not published or classified keto", () => {
  const source = readFileSync(path.join(root, sourcePath), "utf8");
  assert.equal(blobHash(source), sourceSha, "draft review changed without updating evidence");
  const parsed = parseMarkdown(source);
  assert.ok(parsed);
  const data = recipeFrontmatterSchema.parse(parsed.data);
  assert.equal(data.recipe_id, recipeId);
  assert.equal(data.language, "fi");
  assert.equal(data.category, "valipala");
  assert.equal(data.status, "draft");
  assert.equal(data.diet_class, undefined);
  assert.equal(data.image, undefined);
  assert.equal(data.servings, 12);
  assert.deepEqual(data.ingredients.map(x => x.amount), [120, 50, 20, 30, 30, 20]);
  for (const key of [
    "carbs_net_per_serving_g", "carbs_total_per_serving_g",
    "protein_per_serving_g", "fat_per_serving_g",
  ] as const) assert.equal(data[key] ?? null, null, key);
  assert.equal(siteContent.recipes.some(x => x.recipeId === recipeId), false);
  assert.match(data.title, /erytritolilla/i);
  assert.doesNotMatch(data.title, /sokeriton|keto|ilman lisättyä sokeria/i);
  assert.match(parsed.content, /KATSELMOINTI \/ EI JULKAISUUN/);
  assert.match(parsed.content, /Ei keto\/GK-hyväksyntää/);
});

test("issue #333: coating mass and erythritol polyols cannot silently become public macros", () => {
  const parsed = parseMarkdown(readFileSync(path.join(root, sourcePath), "utf8"));
  assert.ok(parsed);
  const data = recipeFrontmatterSchema.parse(parsed.data);
  const masses = data.ingredients.map(x => x.amount);
  assert.ok(masses.every((x): x is number => typeof x === "number"));
  const batchWithoutCoating = masses.reduce((a, b, i) => a + (i === 4 ? 0 : b), 0);
  assert.equal(batchWithoutCoating, 240);
  assert.equal(masses[4], 30);
  assert.equal(batchWithoutCoating + masses[4], 270);
  assert.equal(masses[3] / data.servings, 2.5);
  assert.match(parsed.content, /Punnitse lopuksi kulhoon jääneet käyttämättömät hiutaleet/);
  assert.match(parsed.content, /syöty kookos = 30 g/);
  assert.match(parsed.content, /ei ole mitattu valmisannoksen massa/i);
  assert.match(parsed.content, /100 g hiilihydraattia \/ 100 g, josta 100 g polyoleja/i);
  assert.match(parsed.content, /Jo EU_AVAILABLE-arvoista niitä ei vähennetä toistamiseen/);
  assert.match(parsed.content, /Puuttuva POLYL ei ole 0/);
  assert.match(parsed.content, /mantelia ja maitoa/);
});

test("issue #333: separate B2 source mapping remains HOLD and cannot authorize publication", () => {
  const mapping = JSON.parse(readFileSync(path.join(root, bindingPath), "utf8")) as Mapping;
  assert.equal(mapping.published, false);
  assert.equal(mapping.publicationAuthorized, false);
  const rows = mapping.recipes.filter(x => x.id === recipeId);
  assert.equal(rows.length, 1);
  const row = rows[0];
  assert.equal(row.sourceFile, sourcePath);
  assert.equal(row.status, "REVIEW_REQUIRED");
  assert.equal(row.gk, "HOLD");
  assert.equal(row.nutritionStatus, "UNPUBLISHED");
  assert.equal(row.publicationAuthorized, false);
  assert.equal(row.servings, 12);
  assert.deepEqual(row.ingredients.map(x => x.grams), [120, 50, 20, 30, 30, 20]);
  const erythritol = row.ingredients[3];
  assert.equal(erythritol.match, "REVIEW");
  assert.equal(erythritol.sourceId, "foodin-erythritol-200g-label-2026-10-24");
  assert.match(erythritol.note, /EU_TOTAL_INCLUDING_POLYOLS/);
  const coconut = row.ingredients[4];
  assert.equal(coconut.match, "REVIEW");
  assert.match(coconut.note, /käyttämättä jäänyt kuorrute/);
});

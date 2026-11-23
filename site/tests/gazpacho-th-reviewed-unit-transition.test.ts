import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { textHash } from "../scripts/gk149-model";
import { reviewedDietTagsForSource } from "../scripts/reviewed-diet-filters";
import { gazpachoThaiBeforeReviewedClove } from "./assert-recipe-baseline";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";

const root = path.resolve(import.meta.dirname, "../..");
const thPath = "kaannokset/th/alkuruoat/gazpacho.md";
const fiPath = "reseptit/alkuruoat/gazpacho.md";
const currentSha = "bdabe13d88248bae2c8a3eff2d471d10e51c11b10882b5d9e6e18d2c62c97091";
const historicalSha = "29857410c2abc2d6da484a308ef7db1fff5ec391f352241cf5efdf9418d2e511";

test("#895: reviewed Thai garlic unit is the ONLY difference from frozen historical source", async () => {
  const current = readFileSync(path.join(root, thPath), "utf8");
  assert.equal(textHash(current), currentSha);
  const historic = gazpachoThaiBeforeReviewedClove(thPath, current);
  assert.equal(textHash(historic), historicalSha);
  assert.equal(gazpachoThaiBeforeReviewedClove(fiPath, current), current);
  assert.notEqual(historic, current);
  const before = parseMarkdown(historic);
  const after = parseMarkdown(current);
  assert.ok(before && after);
  const oldData = recipeFrontmatterSchema.parse(before.data);
  const newData = recipeFrontmatterSchema.parse(after.data);
  assert.equal(oldData.servings, 4);
  assert.equal(oldData.time_total_min, 80);
  assert.equal(oldData.status, "published");
  assert.deepEqual([oldData.carbs_net_per_serving_g, oldData.carbs_total_per_serving_g,
    oldData.protein_per_serving_g, oldData.fat_per_serving_g], [18.61, 21.91, 3.6, 14.69]);
  assert.equal(before.content, after.content);
  assert.equal(oldData.ingredients.length, newData.ingredients.length);
  const index = oldData.ingredients.findIndex(i => i.item === "กระเทียม");
  assert.equal(index, 3);
  assert.equal(oldData.ingredients[index].amount, 1);
  assert.equal(oldData.ingredients[index].unit, "ชิ้น");
  assert.equal(newData.ingredients[index].amount, 1);
  assert.equal(newData.ingredients[index].unit, "กลีบ");
  const neutralize = (item: typeof oldData) => ({
    ...item, ingredients: item.ingredients.map((ing, i) =>
      i === index ? { ...ing, unit: "" } : ing),
  });
  assert.deepEqual(neutralize(oldData), neutralize(newData));
  assert.deepEqual(
    await reviewedDietTagsForSource("gazpacho", "th",
      path.join(root, thPath), path.join(root, fiPath)),
    ["vegetarian", "pescatarian"]);
});

test("#895: source lock rejects any additional Thai change and preserves unrelated files", () => {
  const current = readFileSync(path.join(root, thPath), "utf8");
  assert.throws(() => gazpachoThaiBeforeReviewedClove(thPath,
    current.replace("unit: กลีบ", "unit: ชิ้น")), /unreviewed Thai translation edit/);
  assert.throws(() => gazpachoThaiBeforeReviewedClove(thPath,
    current.replace("servings: 4", "servings: 5")), /unreviewed Thai translation edit/);
  assert.throws(() => gazpachoThaiBeforeReviewedClove(thPath,
    current + "\n<!-- unreviewed edit -->\n"), /unreviewed Thai translation edit/);
  assert.equal(gazpachoThaiBeforeReviewedClove("kaannokset/en/alkuruoat/gazpacho.md", current), current);
});

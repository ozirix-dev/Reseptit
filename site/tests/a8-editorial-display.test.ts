import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { projectA8FiEditorialSource, a8EditorialFiPaths } from "../scripts/a8-editorial-display";

const root = path.resolve(import.meta.dirname, "../..");
const sha = (raw: string) => createHash("sha256").update(raw.replaceAll("\r\n", "\n")).digest("hex");
const expected: Readonly<Record<string, string>> = {
  falafel: "5f2549ef9ba3d3506719b5ccb0258b8ef374f8870c33348fd11a5a6edf4ac6b4",
  "jerk-kana": "9a5501f0f5a7e397f211ed3fc6017975122aa8ce7b3e3c9bbb741096157acafc",
  "kimchi-jjigae": "ddf90c6176447617f9e997b58c8587fb5a3979aa40656aec152cab4407afb561",
  "lanttulaatikko-kermainen": "a906f10835a76549a852da321ede912f3e2fdd2caf05ed115dd51a990bdfd7ad",
  "lindstrominpihvit-kaalilla": "ea116b68468b429136a7d799a9e84530ab6d618b77aa4dcd2a18857599f77069",
  "maksalaatikko-kukkakaalilla": "0bc68c7f8a97e63f13b6dc778f1167979a4047b2e5f6a7286cd0c6bf185d0cb7",
  "shoyu-kanakeitto-konjac": "18003d3ee1ec7ebf29aa855c73244ce5a4e0ccb33312982dfa1eab0364eb4b68",
  "vhh-brita-kakku": "5e50ff8c97ab1c36729d732f7245b8f81b4d9c8fb984bd378f3bd3bcad3e608f",
};
const macros = ["carbs_net_per_serving_g", "carbs_total_per_serving_g", "protein_per_serving_g", "fat_per_serving_g"] as const;
const steps = (text: string) => (text.match(/^\d+\.\s/gm) ?? []).length;

test("A8 public correction sources stay byte-pinned and nutrition-identical", () => {
  assert.equal(a8EditorialFiPaths.length, 8);
  const found = new Set<string>();
  for (const relativePath of a8EditorialFiPaths) {
    const raw = readFileSync(path.join(root, relativePath), "utf8");
    const original = parseMarkdown(raw);
    assert.ok(original, relativePath + ": original Markdown");
    const data = recipeFrontmatterSchema.parse(original.data);
    assert.ok(expected[data.recipe_id], relativePath + ": expected recipe");
    assert.equal(sha(raw), expected[data.recipe_id], relativePath + ": source must be immutable");
    assert.ok(!found.has(data.recipe_id), "duplicate source id");
    found.add(data.recipe_id);
    const projected = projectA8FiEditorialSource(relativePath, raw);
    assert.notEqual(projected, raw, relativePath + ": correction must have an effect");
    const revised = parseMarkdown(projected);
    assert.ok(revised);
    const publicData = recipeFrontmatterSchema.parse(revised.data);
    assert.equal(publicData.recipe_id, data.recipe_id);
    assert.equal(publicData.status, "published");
    assert.equal(publicData.servings, data.servings);
    assert.equal(publicData.time_total_min, data.recipe_id === "jerk-kana" ? 130 : data.time_total_min);
    assert.deepEqual(publicData.ingredients.map(i => [i.amount, i.unit]), data.ingredients.map(i => [i.amount, i.unit]));
    for (const key of macros) assert.equal(publicData[key], data[key], relativePath + ": " + key);
    assert.deepEqual(publicData.image, data.image, relativePath + ": image unchanged");
    assert.equal(steps(revised.content), steps(original.content), relativePath + ": step structure unchanged");
    assert.throws(() => projectA8FiEditorialSource(relativePath, raw + "\n# unintended drift"), /A8_EDITORIAL_SOURCE_STALE/);
    assert.equal(sha(readFileSync(path.join(root, relativePath), "utf8")), expected[data.recipe_id]);
  }
  assert.deepEqual([...found].sort(), Object.keys(expected).sort());
});

test("A8 GK80-locked sources keep their original release-3 and release-6 versions", () => {
  for (const [release, id] of [[3, "shoyu-kanakeitto-konjac"], [6, "lanttulaatikko-kermainen"]] as const) {
    const dir = path.join(root, "docs/nutrition", "gk80-release-" + release);
    const pack = JSON.parse(readFileSync(path.join(dir, "recipes.json"), "utf8"));
    const record = pack.recipes.find((r: {recipeId: string}) => r.recipeId === id);
    assert.ok(record, id + ": missing sealed GK80 record");
    assert.equal(record.sourceSha256, expected[id], id + ": original release source SHA unchanged");
  }
  assert.equal(projectA8FiEditorialSource("reseptit/paaruoat/unrelated.md", "unchanged"), "unchanged");
  assert.equal(projectA8FiEditorialSource("kaannokset/en/paaruoat/jerk-kana.md", "draft"), "draft");
});

test("built FI recipe pages use the reviewed A8 cooking corrections, not raw mistakes", () => {
  const byId = new Map(siteContent.recipes.filter(r => r.locale === "fi").map(r => [r.recipeId, r]));
  for (const relativePath of a8EditorialFiPaths) {
    const raw = readFileSync(path.join(root, relativePath), "utf8");
    const projected = projectA8FiEditorialSource(relativePath, raw);
    const parsed = parseMarkdown(projected);
    assert.ok(parsed);
    const d = recipeFrontmatterSchema.parse(parsed.data);
    const r = byId.get(d.recipe_id);
    assert.ok(r, "missing generated FI recipe: " + d.recipe_id);
    assert.equal(r.timeTotalMin, d.time_total_min ?? null);
    assert.deepEqual(r.ingredients.map(i => [i.amount, i.unit]), d.ingredients.map(i => [i.amount, i.unit]));
    assert.deepEqual(r.nutrition, {
      carbsNetG: d.carbs_net_per_serving_g ?? null, carbsTotalG: d.carbs_total_per_serving_g ?? null,
      proteinG: d.protein_per_serving_g ?? null, fatG: d.fat_per_serving_g ?? null
    });
  }
  assert.match(byId.get("falafel")!.instructionsText.join(" "), /valinnaisia lisukkeita/);
  assert.match(byId.get("jerk-kana")!.instructionsText.join(" "), /75 °C/);
  assert.equal(byId.get("jerk-kana")!.timeTotalMin, 130);
  assert.match(byId.get("lanttulaatikko-kermainen")!.ingredients.find(i => /kananmunaa/.test(i.item))!.item, /kuorettomana/);
  assert.match(byId.get("lindstrominpihvit-kaalilla")!.instructionsText.join(" "), /jäljellä olevassa 1 rkl:ssa/);
  assert.match(byId.get("maksalaatikko-kukkakaalilla")!.instructionsText.join(" "), /0,5 rkl/);
  assert.match(byId.get("shoyu-kanakeitto-konjac")!.instructionsText.join(" "), /75 °C/);
  assert.match(byId.get("vhh-brita-kakku")!.instructionsText.join(" "), /Kääntele jauhoseos/);
  assert.match(byId.get("kimchi-jjigae")!.description, /riisi on haluttaessa erillinen lisuke/i);
});

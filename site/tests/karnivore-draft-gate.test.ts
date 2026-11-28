import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFile, cp, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { assertKarnivoreDraftSafe, assertKarnivoreTranslationReady, isHistoricalKarnivoreRecipe, karnivoreApprovedIngredients } from "../scripts/karnivore-draft-gate";
import type { recipeFrontmatterSchema } from "../src/content/schema";
import { semanticHash } from "../scripts/translation-semantic-review";

type RecipeData = ReturnType<typeof recipeFrontmatterSchema.parse>;
const sample = (id = "karnivore-steak-and-eggs"): RecipeData => ({
  title: "Test fixture", recipe_id: id, url_slug: id, category: "paaruoka",
  language: "fi", status: "draft", servings: 2,
  ingredients: (karnivoreApprovedIngredients[id] ?? ["naudansisäfileetä", "suolaa"])
    .map((item) => ({ amount: 100, unit: "g", item })),
  tags: ["carnivore", "karnivore"], translation_languages: [], translation_status: {},
});
const prep = "# Recipe\n\n## Valmistus\n\n1. First\n2. Second\n3. Third\n4. Cook to 75 °C\n";

test("changed-content CLI preserves historical identity and rechecks edited or removed publication evidence", async (t) => {
  const site = path.resolve(import.meta.dirname, "..");
  const root = await mkdtemp(path.join(tmpdir(), "karnivore-changed-content-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const siteCopy = path.join(root, "site");
  await mkdir(siteCopy);
  await cp(path.join(site, "scripts"), path.join(siteCopy, "scripts"), { recursive: true });
  await cp(path.join(site, "src"), path.join(siteCopy, "src"), {
    recursive: true, filter: filename => filename !== path.join(site, "src", "generated"),
  });
  await copyFile(path.join(site, "package.json"), path.join(siteCopy, "package.json"));
  await symlink(path.join(site, "node_modules"), path.join(siteCopy, "node_modules"), "junction");
  await mkdir(path.join(root, "meta/kaannokset"), { recursive: true });
  await copyFile(path.join(site, "../meta/recipe-successors.json"), path.join(root, "meta/recipe-successors.json"));
  await copyFile(path.join(site, "../meta/kaannokset/f25-release-gate.json"),
    path.join(root, "meta/kaannokset/f25-release-gate.json"));
  await mkdir(path.join(root, "docs/nutrition"), { recursive: true });
  await copyFile(path.join(site, "../docs/nutrition/recipe-correctness-history.json"),
    path.join(root, "docs/nutrition/recipe-correctness-history.json"));
  for (const file of ["new-public-gk-pending-sources", "glycemic-load-recipe-aliases", "glycemic-load-recipe-bindings"]) {
    await writeFile(path.join(root, "docs/nutrition", file + ".json"), "{}");
  }

  const original = "tuonti/karnivore/paaruoat/karnivore-steak-and-eggs.md";
  const moved = "tuonti/karnivore/paaruoat/moved.md";
  const id = "karnivore-new-recipe";
  const recipe = `reseptit/paaruoat/${id}.md`;
  const evidence = `docs/reviews/new-recipes/${id}.json`;
  const source = `---\ntitle: Test\nrecipe_id: ${id}\nurl_slug: ${id}\ncategory: paaruoka\nlanguage: fi\nstatus: published\nservings: 2\ningredients:\n  - { amount: 100, unit: g, item: beef }\n---\n\n${prep}`;
  const historical = await readFile(path.join(site, "..", original), "utf8");
  for (const file of [original, recipe, evidence]) await mkdir(path.dirname(path.join(root, file)), { recursive: true });
  await writeFile(path.join(root, original), historical);
  await writeFile(path.join(root, recipe), source);
  await writeFile(path.join(root, evidence), "{}");
  const git = (...args: string[]) => execFileSync("git", ["-c", "core.autocrlf=false", ...args], { cwd: root, encoding: "utf8" }).trim();
  git("init", "--quiet");
  git("add", "--", original, recipe, evidence);
  const base = git("write-tree");
  const validate = (...changed: string[]) => {
    git("read-tree", base);
    git("add", "-A", "--", ...changed);
    return spawnSync(process.execPath, ["--import", "tsx", "scripts/validate-changed-content.ts", ...changed], {
      cwd: siteCopy, encoding: "utf8", env: { ...process.env, BASE_SHA: base, HEAD_SHA: git("write-tree") },
    });
  };

  const changedIdentity = historical.replaceAll("karnivore-steak-and-eggs", "karnivore-reidentified");
  await writeFile(path.join(root, original), changedIdentity);
  assert.match(validate(original).stderr, /historical karnivore recipe ID cannot change/);
  await rm(path.join(root, original));
  await writeFile(path.join(root, moved), changedIdentity);
  assert.match(validate(original, moved).stderr, /historical karnivore recipe requires a replacement/);
  await writeFile(path.join(root, moved), historical.replace("status: draft", "status: published"));
  assert.match(validate(original, moved).stderr, /published carnivore needs the scoped WebP/);

  await rm(path.join(root, evidence));
  assert.match(validate(evidence).stderr, /review evidence missing/);
  const check = { status: "pass", notes: "Reviewed source and recorded independent evidence." };
  const review = {
    schema_version: 1, decision: "approved", recipe_id: id, source_path: recipe,
    source_sha256: "0".repeat(64), reviewed_by: "Independent reviewer", reviewed_at: "2026-11-28",
    origin: { kind: "original" }, nutrition_evidence: `docs/nutrition/calculations/${id}.json`,
    checks: Object.fromEntries(["duplicates", "ingredients", "method", "food_safety", "servings_and_time",
      "nutrition", "glycemic"].map(key => [key, check])),
  };
  await writeFile(path.join(root, evidence), JSON.stringify(review));
  assert.match(validate(evidence).stderr, /source_sha256 stale or incorrect/);
  review.source_sha256 = createHash("sha256").update(source).digest("hex");
  await writeFile(path.join(root, evidence), JSON.stringify(review));
  assert.match(validate(evidence).stderr, /publication requires documented Finnish animal-origin review/);
});

test("all ten reviewed draft ingredient sets are accepted", () => {
  assert.equal(Object.keys(karnivoreApprovedIngredients).length, 10);
  for (const id of Object.keys(karnivoreApprovedIngredients)) assert.doesNotThrow(() => assertKarnivoreDraftSafe(sample(id), prep), id);
});
test("unapproved vegetable ingredient is blocked", () => {
  const candidate = sample();
  candidate.ingredients.push({ amount: 10, unit: "g", item: "sipuli" });
  assert.throws(() => assertKarnivoreDraftSafe(candidate, prep), /ingredient identity changed/);
});
test("new recipe IDs and their translations can enter the normal draft workflow", () => {
  const draft = { ...sample("karnivore-new-recipe"), carbs_net_per_serving_g: null };
  assert.equal(isHistoricalKarnivoreRecipe(draft.recipe_id), false);
  assert.equal(isHistoricalKarnivoreRecipe("constructor"), false);
  const source = { data: draft, content: prep };
  const translation = { data: { ...draft, language: "en" as const }, content: prep };
  assert.doesNotThrow(() => assertKarnivoreDraftSafe(draft, prep));
  assert.doesNotThrow(() => assertKarnivoreTranslationReady(translation, source));
});

test("new published recipes require current animal-origin review, image and nutrition", () => {
  const draft = sample("karnivore-new-recipe");
  const published: RecipeData = { ...draft, status: "published" };
  assert.throws(() => assertKarnivoreDraftSafe(published, prep), /current Finnish animal-origin review/);
  assert.throws(() => assertKarnivoreDraftSafe(published, prep, true), /WebP and metadata/);
  published.image = { src: "paaruoat/karnivore-new-recipe.webp", alt: "Steak", width: 1280, height: 853 };
  assert.throws(() => assertKarnivoreDraftSafe(published, prep, true), /published nutrition values require a calculation/);
  Object.assign(published, {
    carbs_net_per_serving_g: 0, carbs_total_per_serving_g: 0, protein_per_serving_g: 10, fat_per_serving_g: 5,
  });
  assert.doesNotThrow(() => assertKarnivoreDraftSafe(published, prep, true));

  const source = { data: published, content: prep };
  const translation = { data: {
    ...published, language: "en" as const, source_recipe: "reseptit/paaruoat/karnivore-new-recipe.md",
  }, content: prep };
  const evidence = {
    source_hash: semanticHash(source), translation_hash: semanticHash(translation),
    reviewed_at: "2026-11-28", reference: "test fixture", outcome: "pass" as const, findings: [],
  };
  assert.throws(() => assertKarnivoreTranslationReady(translation, source, evidence), /current Finnish animal-origin review/);
  assert.throws(() => assertKarnivoreTranslationReady(translation, source, undefined, true), /current source-bound semantic review/);
  assert.doesNotThrow(() => assertKarnivoreTranslationReady(translation, source, evidence, true));
});
test("published status cannot bypass the nutrition and image gate", () => {
  const approved = sample();
  approved.status = "published";
  assert.throws(() => assertKarnivoreDraftSafe(approved, prep), /published carnivore needs the scoped WebP and metadata/);
  approved.image = { src: "paaruoat/karnivore-steak-and-eggs.webp", alt: "Steak and eggs", width: 1280, height: 853 };
  assert.throws(() => assertKarnivoreDraftSafe(approved, prep), /published nutrition values require a calculation/);
});
test("unsupported nutrition, keto/VHH or gluten-free claims are blocked", () => {
  const macros = sample(); macros.carbs_net_per_serving_g = 0;
  assert.throws(() => assertKarnivoreDraftSafe(macros, prep), /nutrition fields/);
  const keto = sample(); keto.diet_class = "keto";
  assert.throws(() => assertKarnivoreDraftSafe(keto, prep), /unsupported keto/);
  const gluten = sample(); gluten.gluten_free = true;
  assert.throws(() => assertKarnivoreDraftSafe(gluten, prep), /gluten-free/);
});
test("published translations need current review against the approved Finnish recipe", () => {
  const data: RecipeData = { ...sample(), status: "published",
    image: { src: "paaruoat/karnivore-steak-and-eggs.webp", alt: "Steak and eggs", width: 1280, height: 853 },
    carbs_net_per_serving_g: 0, carbs_total_per_serving_g: 0, protein_per_serving_g: 10, fat_per_serving_g: 5,
  };
  const source = { data, content: prep };
  const translated = { data: { ...data, language: "en" as const, source_recipe: "reseptit/paaruoat/karnivore-steak-and-eggs.md" }, content: prep };
  const evidence = { source_hash: semanticHash(source), translation_hash: semanticHash(translated),
    reviewed_at: "2026-11-12", reference: "test fixture", outcome: "pass" as const, findings: [],
  };
  assert.doesNotThrow(() => assertKarnivoreTranslationReady(translated, source, evidence));
  assert.throws(() => assertKarnivoreTranslationReady(translated, source), /current source-bound semantic review/);
  assert.throws(() => assertKarnivoreTranslationReady({ ...translated, content: prep.replace("75", "40") }, source, evidence), /current source-bound semantic review/);
  assert.throws(() => assertKarnivoreTranslationReady(translated, { ...source, data: { ...data, status: "draft" } }, evidence), /published Finnish source/);
  assert.throws(() => assertKarnivoreTranslationReady(translated, { ...source, data: { ...data, ingredients: [{ amount: 100, unit: "g", item: "sipuli" }] } }, evidence), /ingredient identity changed/);
});

test("no cooking temperature cannot pass", () => {
  assert.throws(() => assertKarnivoreDraftSafe(sample(), prep.replace("75 °C", "riittävän kuumaksi")), /no measurable cooking temperature/);
});

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import sharp from "sharp";
import { siteContent } from "../src/generated/content.generated";
import { parseMarkdown } from "../src/content/markdown";
import { editorialHoldRecipeIds, publicRecipeQualityHold } from "../scripts/recipe-quality-holds";
import { isPublicRecipeQuarantined } from "../scripts/public-recipe-quarantine";
import { projectSafeWontonFiDisplay } from "../scripts/wonton-fi-public-display";
import { originalForThreeCanonicalHistory } from "./issue404-three-canonical-history";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { assertKarnivoreDraftSafe, karnivoreApprovedIngredients } from "../scripts/karnivore-draft-gate";

const originals = {
  "intialainen-idli-kookoschutneylla": "reseptit/aamupalat/intialainen-idli-kookoschutneylla.md",
  "vietnamilainen-banh-bao-kananmunalla": "reseptit/aamupalat/vietnamilainen-banh-bao-kananmunalla.md",
  "intialainen-aloo-paratha": "reseptit/aamupalat/intialainen-aloo-paratha.md",
  jiaozi: "reseptit/alkuruoat/jiaozi.md",
  "karibia-bammy-kassavaleipa": "reseptit/aamupalat/karibia-bammy-kassavaleipa.md",
} as const;

test("published and quarantined quality-hold sources preserve their original ingredients", async () => {
  assert.deepEqual([...editorialHoldRecipeIds].sort(), Object.keys(originals).sort());
  const repo = path.resolve(import.meta.dirname, "../..");
  const withdrawnIds = new Set(["karibia-bammy-kassavaleipa", "vietnamilainen-banh-bao-kananmunalla", "intialainen-idli-kookoschutneylla", "intialainen-aloo-paratha"]);
  for (const [recipeId, filename] of Object.entries(originals)) {
    const repoRecipe = parseMarkdown(await readFile(path.join(repo, filename), "utf8"));
    assert.ok(repoRecipe);
    const recipe = siteContent.recipes.find((entry) => entry.recipeId === recipeId && entry.locale === "fi");
    if (withdrawnIds.has(recipeId)) {
      assert.equal(repoRecipe.data.status, "published", `${recipeId} source evidence must stay unchanged`);
      assert.ok(isPublicRecipeQuarantined(recipeId));
      assert.equal(recipe, undefined, `${recipeId} must not be published`);
      continue;
    }
    assert.ok(recipe, `${recipeId} must remain addressable`);
    assert.match(recipe.description, /LAATUHUOMAUTUS/);
    assert.match(recipe.description, /HOLD/);
    assert.match(recipe.instructionsText.join(" "), /Älä valmista|älä valmista/);
    assert.equal(recipe.instructionsText.length, 2, `${recipeId}: incomplete steps must not be published as instructions`);
    assert.deepEqual(recipe.ingredients, repoRecipe.data.ingredients);
    assert.deepEqual(recipe.nutrition, {
      carbsNetG: repoRecipe.data.carbs_net_per_serving_g ?? null,
      carbsTotalG: repoRecipe.data.carbs_total_per_serving_g ?? null,
      proteinG: repoRecipe.data.protein_per_serving_g ?? null,
      fatG: repoRecipe.data.fat_per_serving_g ?? null,
    });
  }
});

test("the same quality-hold reasoning exists in every supported locale", () => {
  for (const recipeId of Object.keys(originals)) {
    for (const locale of ["fi", "en", "sv", "th"] as const) {
      const hold = publicRecipeQualityHold(recipeId, locale);
      assert.ok(hold, `${recipeId}/${locale}: no translated safety guard`);
      assert.ok(hold.description.length > 90);
      assert.match(hold.instructions, /^1\.[\s\S]*\n2\./);
      assert.ok(!/koepaisto tehty|test cooked|provlaga[dtd]|ทดลองปรุงแล้ว/i.test(hold.description));
    }
  }
  assert.equal(publicRecipeQualityHold("vhh-mustikkapiirakka", "fi"), null);
  assert.equal(publicRecipeQualityHold("karibia-ackee-ja-suolakala", "fi"), null,
    "ackee has its own stricter food-safety hold");
});


test("withdrawn cassava source still carries a safety warning in four languages", () => {
  for (const locale of ["fi", "en", "sv", "th"] as const) {
    const hold = publicRecipeQualityHold("karibia-bammy-kassavaleipa", locale);
    assert.ok(hold);
    assert.match(hold.description, /TURVALLISUUSVAROITUS|FOOD SAFETY WARNING|LIVSMEDELSVARNING|คำเตือนด้านความปลอดภัยอาหาร/);
  }
});

test("corrected shrimp wonton is published without an unfinished-recipe hold", async () => {
  const recipe = siteContent.recipes.find((entry) => entry.recipeId === "kiinalainen-katkarapu-wontonkeitto" && entry.locale === "fi");
  assert.ok(recipe);
  assert.equal(publicRecipeQualityHold(recipe.recipeId, "fi"), null);
  const text = recipe.instructionsText.join(" ");
  assert.match(text, /wonton-taikinaa/);
  assert.match(text, /tiiviiksi/);
  assert.match(text, /katkaravut/);
  assert.match(text, /läpinäkymättömiä/);
  assert.doesNotMatch(text, /Kuumenna kattilassa öljy tai liemi|Lisää nuudelit, lehtivihannekset/);
  const raw = parseMarkdown(await readFile(path.resolve(import.meta.dirname, "../../reseptit/aamupalat/kiinalainen-katkarapu-wontonkeitto.md"), "utf8"));
  assert.ok(raw);
  assert.deepEqual(recipe.ingredients, raw.data.ingredients);
  assert.equal(recipe.nutrition.carbsNetG, null);
  assert.equal(recipe.nutrition.carbsTotalG, null);
});

test("canonical wonton correction retains reviewed source and original GK history", async () => {
  const file = "reseptit/aamupalat/kiinalainen-katkarapu-wontonkeitto.md";
  const root = path.resolve(import.meta.dirname, "../..");
  const raw = await readFile(path.join(root, file), "utf8");
  assert.equal(projectSafeWontonFiDisplay(file, raw), raw);
  const historical = originalForThreeCanonicalHistory(root,file,raw);
  const before = parseMarkdown(historical), after = parseMarkdown(raw);
  assert.ok(before && after);
  assert.deepEqual(after.data, before.data);
  assert.match(after.content, /kauttaaltaan helmiäisenvaaleita/);
  assert.throws(() => originalForThreeCanonicalHistory(root,file,raw.replace("700", "701")),
    /unreviewed canonical source mutation/);
});

test("all ten isolated karnivore drafts remain validated and out of published content", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  assert.equal(Object.keys(karnivoreApprovedIngredients).length, 10);
  const fi5ImageIds = new Set([
    "karnivore-smashburger",
    "karnivore-rapeat-kananreisipalat",
    "karnivore-maksa-ja-pekoni",
    "karnivore-meatza",
    "karnivore-lammaskyljykset-voissa"
  ]);
  for (const id of Object.keys(karnivoreApprovedIngredients)) {
    const file = path.join(root, "tuonti/karnivore/paaruoat", `${id}.md`);
    const raw = await readFile(file, "utf8");
    const parsed = parseMarkdown(raw);
    assert.ok(parsed, `${id}: parse failed`);
    const recipe = recipeFrontmatterSchema.parse(parsed.data);
    assertKarnivoreDraftSafe(recipe, raw);
    if (fi5ImageIds.has(id)) {
      assert.equal(recipe.status, "draft");
      assert.ok(recipe.image, id);
      assert.equal(recipe.image.src, `paaruoat/${id}.webp`);
      assert.ok(recipe.image.alt.trim(), `${id}: alt text is missing`);
      const image = await sharp(path.join(root, "kuvat", recipe.image.src)).metadata();
      assert.equal(image.format, "webp", id);
      assert.equal(image.pages ?? 1, 1, id);
      assert.equal(image.orientation ?? 1, 1, id);
      assert.deepEqual([image.width, image.height], [1280, 853], id);
      assert.deepEqual([recipe.image.width, recipe.image.height], [image.width, image.height], id);
    }
    if (id === "karnivore-naudan-lyhytkylki" || id === "karnivore-rapea-porsaan-kylki") {
      assert.equal(recipe.status, "draft");
      assert.equal(recipe.image, undefined, `${id}: excluded from this image batch`);
    }
    const publicFi = siteContent.recipes.find((entry) => entry.recipeId === id && entry.locale === "fi");
    if (["karnivore-steak-and-eggs","karnivore-voilohi-pannulla","karnivore-jauhelihakulho-munalla"].includes(id)) {
      assert(publicFi, `${id}: reviewed first FI release is missing`);
      assert(publicFi.image, `${id}: reviewed first FI release is missing its photo`);
    } else {
      assert.equal(publicFi, undefined, `${id}: remaining work-queue recipe must not be published`);
    }
  }
});

test("FI5 carnivore evidence is version-pinned and none of the five drafts has implicit publication approval", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const audit = JSON.parse(await readFile(path.join(root, "docs/reviews/karnivore-fi5-publication-triage-2026-11-11.json"), "utf8")) as {
    publicationAuthorized: boolean;
    recipes: Array<{recipeId:string;sourceBlobSha:string;sourcePath:string;status:string;sourceMatchCounts:{matched:number;proxy:number;unresolved:number};blockers:string[];gkStatus:string;rawScenarioStatus:string;productCandidates:Array<{url:string}>}>;
  };
  const sourceMap = JSON.parse(await readFile(path.join(root, "docs/reviews/karnivore-10-nutrition-source-map-2026-11-11.json"), "utf8")) as {
    recipes: Array<{recipeId:string;inputs:Array<{sourceMatch:string}>;modelledCarbohydratePerServingFromMappedInputsG:number|null}>;
  };
  const expected = [
    "karnivore-smashburger", "karnivore-rapeat-kananreisipalat", "karnivore-maksa-ja-pekoni",
    "karnivore-meatza", "karnivore-lammaskyljykset-voissa"
  ];
  assert.equal(audit.publicationAuthorized, false);
  assert.deepEqual(audit.recipes.map(r=>r.recipeId),expected);
  for (const item of audit.recipes) {
    assert.equal(item.status,"HOLD_NO_PUBLICATION");
    assert.equal(item.gkStatus,"UNAVAILABLE_NOT_ZERO");
    assert.equal(item.rawScenarioStatus,"NONPUBLISHABLE_PROXY_INPUTS");
    assert(item.blockers.length>0);
    assert(item.productCandidates.every(c=>c.url.startsWith("https://")));
    const raw = await readFile(path.join(root,item.sourcePath));
    const sha = createHash("sha1").update(`blob ${raw.byteLength}\\0`.replace("\\0","\0")).update(raw).digest("hex");
    assert.equal(sha,item.sourceBlobSha,`${item.recipeId}: FI5 source changed without re-review`);
    const front = parseMarkdown(raw.toString("utf8"));
    assert(front);
    const recipe=recipeFrontmatterSchema.parse(front.data);
    assert.equal(recipe.status,"draft",`${item.recipeId}: publication is blocked`);
    assert.equal(recipe.language,"fi");
    assert.deepEqual(recipe.image?.src,`paaruoat/${item.recipeId}.webp`);
    assert.deepEqual([recipe.image?.width,recipe.image?.height],[1280,853]);
    const map = sourceMap.recipes.find(r=>r.recipeId===item.recipeId);
    assert(map,`${item.recipeId}: expected source map entry`);
    for(const status of ["matched","proxy","unresolved"] as const){
      assert.equal(map.inputs.filter(x=>x.sourceMatch===status).length,item.sourceMatchCounts[status]);
    }
    assert(item.sourceMatchCounts.proxy>0,`${item.recipeId}: no silent proxy promotion`);
    assert.equal(siteContent.recipes.some(r=>r.recipeId===item.recipeId&&r.locale==="fi"),false);
  }
  const liver=sourceMap.recipes.find(r=>r.recipeId==="karnivore-maksa-ja-pekoni");
  assert(liver && liver.modelledCarbohydratePerServingFromMappedInputsG!==null && liver.modelledCarbohydratePerServingFromMappedInputsG>6.6,
    "liver's naturally available carbohydrate cannot be zero");
  const meatza=await readFile(path.join(root,"tuonti/karnivore/paaruoat/karnivore-meatza.md"),"utf8");
  assert.match(meatza,/Valuta pellille irronnut rasva/i,"meatza drained fat requires its own yield model");
  for (const id of ["karnivore-rapeat-kananreisipalat","karnivore-lammaskyljykset-voissa"]){
    const row=audit.recipes.find(r=>r.recipeId===id)!;
    assert(row.blockers.some(b=>/BONE|YIELD/.test(b)),`${id}: bone-to-edible yield must remain an explicit blocker`);
  }
});

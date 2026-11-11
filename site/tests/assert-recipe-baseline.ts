import {mainAdditionFiles, postBaselineBriocheIds, postBaselineClassicIds} from "./original-content-transition";
import assert from "node:assert/strict";
import { originalForB21CanonicalHistory } from "./b21-canonical-historical-transition";
import { originalForC13CanonicalHistory } from "./c13-canonical-historical-transition";
import { originalForThreeCanonicalHistory } from "./issue404-three-canonical-history";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { recipeTextForApprovedSnapshot } from "../scripts/approved-recipe-note-edits";
import { originalForChefHistoricalCheck } from "./chef-instruction-transition";
import { originalForReviewedChefSafety } from "./chef-safety-historical-transition";
import { historicalRendangForApprovedVersion } from "../scripts/gk100-rendang-sealed-source";
import { historicalFarinataForApprovedPanVersion } from "../scripts/gk100-farinata-sealed-source";
import { parseMarkdown } from "../src/content/markdown";
import { projectBreakfastFiQualityDisplay } from "../scripts/fi-breakfast-quality-display";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { semanticHash, semanticStatus } from "../scripts/translation-semantic-review";
import { textHash } from "../scripts/gk149-model";
import approvedTranslations from "./approved-translation-baseline.json";
import preparedTranslations from "./prepared-translation-baseline.json";

// PR #302 introduced three recipes after the frozen 326-recipe GK baseline.
// The separately approved P0 image/ingredient correction is pinned to one
// exact commit without mutating any of the old 326 recipe calculation inputs.
const briocheImageCorrectionSha = "992cf1f4f623da0d4ee596770ce7c211e8c31a89";
const classicsCommit = "068c8e540534a5177c2e4daa52dcf7357dab5693";
const classicCategory: Record<string, string> = {
  "karjalanpiirakat-riisipuurolla": "leivonnaiset",
  "marry-me-kanapasta": "paaruoat",
  "uunifetapasta-kirsikkatomaateilla": "paaruoat",
  "raejuustobagelit-ilman-kohotusta": "leivonnaiset",
  "linssimakaronilaatikko": "paaruoat",
};
// Release: precisely two source-reviewed, published gluten-free recipes.
// Blob SHA locks every ingredient, instruction, review link, source and macro.
// One uniquely SHA-locked *draft-only* C5 version; cannot publish or mutate
// the historic 326 recipes, and cannot grant nutrition/GK approval.
const approvedC5DraftBlobs = new Map<string, string>([
  ["reseptit/raakileet/indonesialainen-bakwan-jagung-punnittu-v2.md", "b4344737daaeea38eb2ff76280c6a31d8c1b3c6d"],
  ["reseptit/raakileet/kiinalainen-jianbing-soy-bean-sauce-punnittu-v2.md", "d3ffb96266b4a3a1adffcd1e2c3589bb31ec2d0e"],
  ["reseptit/raakileet/meksikolainen-huevos-divorciados-kypsat-pavut-v2.md", "dca1c51653e98f8a8fc8ab71c1db1bca41d8ef90"],
]);
// The first FI-only carnivore release is a separately audited new source set.
// Exact blob-SHA pins admit only these reviewed new artifacts to the historical
// change inspector. They DO NOT alter any of the frozen GK result approvals.
const approvedKarnivoreFi3Files = new Map<string, string>([
  ["reseptit/paaruoat/karnivore-smashburger.md", "55a2ccf705c4cc1906736e71f2ee1bbad69752e9"],
  ["docs/nutrition/calculations/karnivore-smashburger.json", "aaa720a939b17505c1161021a50c32a288310970"],
  ["docs/nutrition/batches/batch-493.json", "8627ad6223b5bccd1c2bccde337435efbc58408b"],
  [
    "reseptit/paaruoat/karnivore-steak-and-eggs.md",
    "5e579c3a60b1835d2bd4895c377502139bb23b91"
  ],
  [
    "reseptit/paaruoat/karnivore-voilohi-pannulla.md",
    "07f5b5670af65776209493cc4dce2b897f2635b0"
  ],
  [
    "reseptit/paaruoat/karnivore-jauhelihakulho-munalla.md",
    "9f294f216ac4f94dacf745e197b3d6bd3cc96451"
  ],
  [
    "docs/nutrition/calculations/karnivore-steak-and-eggs.json",
    "704318a12128a8cf1fcdbaa0522f46472dc59f45"
  ],
  [
    "docs/nutrition/calculations/karnivore-voilohi-pannulla.json",
    "124a8c4fd77cddccc35cfa4df60f52264dbc0eae"
  ],
  [
    "docs/nutrition/calculations/karnivore-jauhelihakulho-munalla.json",
    "443fce0b7f397edcf0ff9301300086f5ac2a43d1"
  ],
  [
    "docs/nutrition/batches/batch-476.json",
    "5a32c1ee9b0f249811b8394c921e53de03357e2e"
  ],
  [
    "kuvat/paaruoat/karnivore-steak-and-eggs.webp",
    "edd20a1b1c389c8effb0c0d5a2bec64282ab8ed2"
  ],
  [
    "kuvat/paaruoat/karnivore-voilohi-pannulla.webp",
    "d8221f785e9e5d04bd2fdaa35e8122f040d2b43f"
  ],
  [
    "kuvat/paaruoat/karnivore-jauhelihakulho-munalla.webp",
    "c41889d23890eecd4ae2c1353144658fbcbee675"
  ]
]);

const approvedGlutenFreeFiFiles = new Map<string, string>([
  ["reseptit/jalkiruoat/gluteeniton-uunipannukakku.md", "060baa3ae58e0c9318a88451f1a8b72ea3c45de3"],
  ["reseptit/jalkiruoat/gluteeniton-perunajauhokakkupohja.md", "8de57cb20ad8aa888870a6f061a0aa5c7bfe73a6"],
  ["reseptit/leivonnaiset/gluteeniton-durrapizzapohja.md", "284f68dacbdae1d2d5ca5c969c697e85a84f2708"],
  ["reseptit/leivonnaiset/gluteeniton-siemenvuokaleipa.md", "c988c1b6e749f7848c99b999b1fcee46256a951f"],
  ["reseptit/leivonnaiset/gluteenittomat-kauralesesampylat.md", "45e9bfe04897eaee8ed7c01590d88f33c663b124"],
]);
// Exact source and incomplete nutrition evidence admitted after the frozen GK baseline.
const reviewedFiBreakfastFiles = new Map([
  ["reseptit/aamupalat/rasvakaakao-rouva-keto.md", "73ec1919b0038f2479837583081a4d3662f49c7bb4d81d301a75505b8749e32d"],
  ["docs/nutrition/calculations/rasvakaakao-rouva-keto.json", "ac1a88c6fdc720330ffb50858a90e76ae846a0e4c884494d3189659ee8154af5"],
  ["reseptit/aamupalat/lammin-chia-puuro-rouva-keto.md", "6ac411019efca3965bc614a8d73f43655a66be8f0cfaf74fdbe90f7655217717"],
  ["docs/nutrition/calculations/lammin-chia-puuro-rouva-keto.json", "0fd0d79150c72ce4bfeaac9ca8780783d825bd4ee543bb1915822aee35bd5336"],
]);
const postBaselineCakeFiles = new Map([
  ["reseptit/jalkiruoat/sienikakkupohja.md", "M"],
  ["reseptit/jalkiruoat/perinteinen-mansikkataytekakku-sienikakkupohjalla.md", "A"],
]);
const reviewedCakePublicationSha = "004284fe72da0463295f1ac3bf2afaecf3f34895";

const reviewedClassicFiles = new Set(postBaselineClassicIds.flatMap(id => [
  `reseptit/raakileet/${id}.md`,
  `reseptit/${classicCategory[id]}/${id}.md`,
  ...["en", "sv", "th"].map(locale => `kaannokset/${locale}/${classicCategory[id]}/${id}.md`),
]));
const briochePublishedFiles = new Set(postBaselineBriocheIds.flatMap(id => [
  `reseptit/leivonnaiset/${id}.md`,
  `docs/nutrition/calculations/${id}.json`,
]));

const translationDraftCommits = new Map([
  ["kaannokset/en/jalkiruoat/keto-mutakakku.md", "d6531cd0592b01c0106a24bb6a3bd930dedbc504"],
  ["kaannokset/en/jalkiruoat/keto-suklaakeksit.md", "d6531cd0592b01c0106a24bb6a3bd930dedbc504"],
  ["kaannokset/en/jalkiruoat/meheva-suklaakakku.md", "d6531cd0592b01c0106a24bb6a3bd930dedbc504"],
  ["kaannokset/sv/jalkiruoat/keto-mutakakku.md", "47f3362c9fe426f25e6978dc9be519c19ae4b789"],
  ["kaannokset/th/jalkiruoat/keto-mutakakku.md", "47f3362c9fe426f25e6978dc9be519c19ae4b789"],
  ["kaannokset/sv/jalkiruoat/keto-suklaakeksit.md", "e70057d325b564f9e8406470fdd6f0a458087a28"],
  ["kaannokset/sv/jalkiruoat/meheva-suklaakakku.md", "e70057d325b564f9e8406470fdd6f0a458087a28"],
  ["kaannokset/th/jalkiruoat/keto-suklaakeksit.md", "0989c731ebd8e1e6c75935714c8fc2cf5bbf890a"],
  ["kaannokset/th/jalkiruoat/meheva-suklaakakku.md", "0989c731ebd8e1e6c75935714c8fc2cf5bbf890a"],
]);

// Exact recipe snapshots protect historical GK tests during translation preparation.
// Production approval records remain in approvedTranslations.
const recipeChanges = new Map([
  ...Object.entries(approvedTranslations.changes),
  ...Object.entries(preparedTranslations.changes),
]);

/**
 * Historical GK baselines must reject arbitrary new published translations.
 * The sole exception is an independently versioned language publication:
 *  - translation is new (A), explicitly listed in the separate sidecar,
 *  - Finnish original remains a published and independently sealed source,
 *  - both exact current semantic hashes match a P0/P1-clear AI review.
 * This never approves recipe ingredient, preparation or GI/GK input changes.
 */
function approvedNewTranslation(root: string, file: string, parsed: NonNullable<ReturnType<typeof parseMarkdown>>): boolean {
  if (!/^kaannokset\/(en|sv|th)\/[a-z0-9/-]+\.md$/.test(file)) return false;
  const target = recipeFrontmatterSchema.parse(parsed.data);
  const locale = target.language;
  if (target.status !== "published" || !["en", "sv", "th"].includes(locale)) return false;
  const sourcePath = target.source_recipe;
  if (!sourcePath || !/^reseptit\/(aamupalat|alkuruoat|paaruoat|jalkiruoat|leivonnaiset|valipalat)\/[a-z0-9-]+\.md$/.test(sourcePath)) return false;
  if (target.source_language !== "fi" || target.translation_of !== target.recipe_id) return false;
  const index = JSON.parse(readFileSync(path.join(root, "meta/kaannokset/published-translation-pairs.json"), "utf8"));
  const declared = (index.sources as Array<{ recipe_id: string; locales: string[] }>).some(
    (row) => row.recipe_id === target.recipe_id && row.locales.includes(locale)
  );
  if (index.schemaVersion !== 1 || !declared) return false;
  const originalRaw = readFileSync(path.join(root, sourcePath), "utf8");
  // Exact-SHA projection is the same visible FI source used by translation-audit.
  // An unrelated or modified source fails at the projection's version gate.
  const original = parseMarkdown(projectBreakfastFiQualityDisplay(sourcePath, originalRaw));
  if (!original) return false;
  const fi = recipeFrontmatterSchema.parse(original.data);
  if (fi.recipe_id !== target.recipe_id || fi.status !== "published" || fi.language !== "fi") return false;
  const registry = JSON.parse(readFileSync(path.join(root, "meta/kaannokset/codex-review-evidence.json"), "utf8"));
  const proof = registry[target.recipe_id + ":" + locale];
  return semanticStatus(
    semanticHash({ data: fi, content: original.content }),
    semanticHash({ data: target, content: parsed.content }),
    true,
    proof
  ) === "REVIEW CURRENT";
}

export function assertRecipeBaseline(root: string, baseline: string, ...protectedPaths: string[]) {
  const changes = execFileSync(
    "git",
    ["diff", "--no-renames", "--name-status", baseline, "--", "reseptit", "kaannokset", ...protectedPaths],
    { cwd: root, encoding: "utf8" },
  ).trim().split(/\r?\n/).filter(Boolean);

  for (const change of changes) {
    const [status, file] = change.split("\t");
    if (status === "A" && approvedKarnivoreFi3Files.has(file)) {
      const expectedBlob = approvedKarnivoreFi3Files.get(file)!;
      const actualBlob = execFileSync("git", ["hash-object", file], { cwd: root, encoding: "utf8" }).trim();
      assert.equal(actualBlob, expectedBlob, "UNREVIEWED_KARNIVORE_FI3_ARTIFACT: " + change);
      if (file.startsWith("reseptit/paaruoat/")) {
        const parsed = parseMarkdown(readFileSync(path.join(root, file), "utf8"));
        assert.ok(parsed, "Karnivore FI3 source missing frontmatter");
        const recipe = recipeFrontmatterSchema.parse(parsed.data);
        assert.equal(recipe.status, "published", change);
        assert.equal(recipe.language, "fi", change);
        assert.equal(recipe.recipe_id, path.basename(file, ".md"), change);
        assert.ok(recipe.image, change);
        for (const key of ["carbs_net_per_serving_g", "carbs_total_per_serving_g", "protein_per_serving_g", "fat_per_serving_g"] as const)
          assert.equal(typeof recipe[key], "number", change);
      }
      continue;
    }
    if (status === "A" && approvedC5DraftBlobs.has(file)) {
      const actualBlob = execFileSync("git", ["hash-object", file], { cwd: root, encoding: "utf8" }).trim();
      assert.equal(actualBlob, approvedC5DraftBlobs.get(file), "UNREVIEWED_C5_DRAFT: " + change);
      const parsed = parseMarkdown(readFileSync(path.join(root, file), "utf8"));
      assert.ok(parsed, "C5 structured draft missing");
      const version = recipeFrontmatterSchema.parse(parsed.data);
      assert.equal(version.status, "draft", "C5 version cannot silently publish");
      assert.equal(version.recipe_id, path.basename(file, ".md"), "C5 draft ID must match reviewed file");
      assert.equal(version.category, "aamupala");
      assert.equal(version.language, "fi");
      for (const nutrient of ["carbs_net_per_serving_g", "carbs_total_per_serving_g",
        "protein_per_serving_g", "fat_per_serving_g"] as const) {
        assert.equal(version[nutrient], null, "C5 V2 nutrition must remain withheld");
      }
      continue;
    }

    if (status === "A" && approvedGlutenFreeFiFiles.has(file)) {
      const actualBlob = execFileSync("git", ["hash-object", file], { cwd: root, encoding: "utf8" }).trim();
      assert.equal(actualBlob, approvedGlutenFreeFiFiles.get(file), "UNREVIEWED_GF_FI_RECIPE: " + change);
      const recipe = parseMarkdown(readFileSync(path.join(root, file), "utf8"));
      assert.equal(recipe?.data.status, "published", change);
      assert.equal(recipe?.data.gluten_free, true, change);
      assert.ok(recipe?.data.gluten_free_review, change);
      continue;
    }
    if (status === "A" && reviewedFiBreakfastFiles.has(file)) {
      assert.equal(textHash(readFileSync(path.join(root, file), "utf8")), reviewedFiBreakfastFiles.get(file), change);
      continue;
    }
    if (status === "A" && Object.hasOwn(mainAdditionFiles, file)) {
      assert.equal(textHash(readFileSync(path.join(root, file), "utf8")), mainAdditionFiles[file], change);
      continue;
    }
    if (postBaselineCakeFiles.get(file) === status) {
      const approved = execFileSync("git", ["show", reviewedCakePublicationSha + ":" + file], { cwd: root, encoding: "utf8" });
      assert.equal(readFileSync(path.join(root, file), "utf8").replaceAll("\r\n", "\n"),
        approved.replaceAll("\r\n", "\n"), change);
      continue;
    }
    if (status === "A" && reviewedClassicFiles.has(file)) {
      // Only the exact published #311 file bytes qualify as post-baseline
      // additions. This does not approve GK/macro values.
      const approved = execFileSync("git", ["show", `${classicsCommit}:${file}`], { cwd: root, encoding: "utf8" });
      assert.equal(readFileSync(path.join(root, file), "utf8").replaceAll("\r\n", "\n"),
        approved.replaceAll("\r\n", "\n"), change);
      continue;
    }
    if (status === "A" && briochePublishedFiles.has(file)) {
      // Prove that these are the *exact* approved P0-corrected files, not
      // arbitrary new recipe additions admitted into historical baselines.
      const published = execFileSync("git", ["show", `${briocheImageCorrectionSha}:${file}`], { cwd: root, encoding: "utf8" });
      assert.equal(readFileSync(path.join(root, file), "utf8").replaceAll("\r\n", "\n"), published.replaceAll("\r\n", "\n"), change);
      continue;
    }
    const approved = recipeChanges.get(file);
    if (approved?.status === status) {
      assert.equal(textHash(readFileSync(path.join(root, file), "utf8")), approved.sha256, change);
      continue;
    }
    if (status === "M" && (file.startsWith("reseptit/") || file.startsWith("kaannokset/"))) {
      const current = readFileSync(path.join(root, file), "utf8").replaceAll("\r\n", "\n");
      const snapshot = originalForThreeCanonicalHistory(root, file, originalForC13CanonicalHistory(root, file, originalForB21CanonicalHistory(root, file, originalForReviewedChefSafety(root, file, originalForChefHistoricalCheck(root, file,
        recipeTextForApprovedSnapshot(file,
          historicalRendangForApprovedVersion(file, historicalFarinataForApprovedPanVersion(file, current))))))));
      if (snapshot !== current) {
        const original = execFileSync("git", ["show", baseline + ":" + file], { cwd: root, encoding: "utf8" });
        assert.equal(snapshot, original, change);
        continue;
      }
    }
    if (status === "A" && file.startsWith("kaannokset/")) {
      const published = parseMarkdown(readFileSync(path.join(root, file), "utf8"));
      if (published?.data.status === "published" && !translationDraftCommits.has(file)) {
        assert.ok(approvedNewTranslation(root, file, published), "UNREVIEWED_PUBLISHED_TRANSLATION: " + change);
        continue;
      }
    }
    assert.ok(status === "A" && file.startsWith("kaannokset/") && file.endsWith(".md"), change);
    const draft = parseMarkdown(readFileSync(path.join(root, file), "utf8"));
    const draftCommit = translationDraftCommits.get(file);
    if (draftCommit && draft?.data.status === "published") {
      const reviewed = execFileSync("git", ["show", draftCommit + ":" + file], {
        cwd: root,
        encoding: "utf8",
      });
      const current = readFileSync(path.join(root, file), "utf8").replaceAll("\r\n", "\n");
      assert.equal(current, reviewed.replace("\nstatus: draft\n", "\nstatus: published\n"), change);
    } else {
      assert.equal(draft?.data.status, "draft", change);
    }
  }
}

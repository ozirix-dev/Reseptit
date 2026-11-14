import { originalForCoconutBananaHistory } from "./coconut-banana-history";
import {mainAdditionFiles, postBaselineBriocheIds, postBaselineClassicIds} from "./original-content-transition";
import assert from "node:assert/strict";
import { originalForB21CanonicalHistory } from "./b21-canonical-historical-transition";
import { originalForC13CanonicalHistory } from "./c13-canonical-historical-transition";
import { originalForThreeCanonicalHistory } from "./issue404-three-canonical-history";
import { originalForJumeokbapHistory } from "./jumeokbap-history";
import { originalForBissaraHistory } from "./bissara-history";
import { originalForBindaetteokHistory } from "./bindaetteok-history";
import { originalForTamagoKakeGohanHistory } from "./tamago-kake-gohan-history";
import { originalForKetoprakHistory } from "./ketoprak-history";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { recipeTextForApprovedSnapshot } from "../scripts/approved-recipe-note-edits";
import { originalForChefHistoricalCheck } from "./chef-instruction-transition";
import { originalForReviewedChefSafety } from "./chef-safety-historical-transition";
import { historicalRendangForApprovedVersion } from "../scripts/gk100-rendang-sealed-source";
import { historicalFarinataForApprovedPanVersion } from "../scripts/gk100-farinata-sealed-source";
import { parseMarkdown } from "../src/content/markdown";
import { projectTranslationAuditSource } from "../scripts/translation-audit";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { semanticHash, semanticStatus } from "../scripts/translation-semantic-review";
import { textHash } from "../scripts/gk149-model";
import approvedTranslations from "./approved-translation-baseline.json";
import preparedTranslations from "./prepared-translation-baseline.json";
import { historicalBreakfastRecipe, reviewedBreakfastPaths } from "../scripts/gk100-breakfast-sealed-source";

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
// Exact blob-SHA pins admit only these original release artifacts to the historical
// change inspector. They DO NOT alter any of the frozen GK result approvals.
const approvedKarnivoreFi3Files = new Map<string, string>([
  ["reseptit/paaruoat/karnivore-rapeat-kananreisipalat.md", "b53cd03654bc15fbabb65fd4eac6112ca9b9fe8c"],
  ["docs/nutrition/calculations/karnivore-rapeat-kananreisipalat.json", "51a9179f8d552388022ade833d315780b97075f7"],
  ["kuvat/paaruoat/karnivore-rapeat-kananreisipalat.webp", "ffc8d8601f106372604d46e5f8c336f7fe5b7410"],
  ["reseptit/paaruoat/karnivore-naudan-lyhytkylki.md", "893457c7ecf47644ba987d114c339ab4d518620b"],
  ["docs/nutrition/calculations/karnivore-naudan-lyhytkylki.json", "d15aeda7ccf5a369f9e59044d8b57ba14ef24449"],
  ["kuvat/paaruoat/karnivore-naudan-lyhytkylki.webp", "9d40277225a2113ad4b90db3b9f8be4b99192111"],
  ["reseptit/paaruoat/karnivore-maksa-ja-pekoni.md", "bb1111c11a24ec126cbfbf90989a517af2e600c7"],
  ["docs/nutrition/calculations/karnivore-maksa-ja-pekoni.json", "c39c965601b10fc578562b53f86b76c95fd51c17"],
  ["kuvat/paaruoat/karnivore-maksa-ja-pekoni.webp", "e0a9cf0de80c95899e79eaaec16e444efdc97794"],
  ["reseptit/paaruoat/karnivore-lammaskyljykset-voissa.md", "3169d975a4c32f87b95baeb7e2d8ebaf2bba2d4c"],
  ["docs/nutrition/calculations/karnivore-lammaskyljykset-voissa.json", "d8b84ec5a93f4d4c17e74f0fdde7ca0622724bef"],
  ["docs/nutrition/batches/batch-505.json", "daf146e69926529d824fd266b32f734b470eae65"],
  ["kuvat/paaruoat/karnivore-lammaskyljykset-voissa.webp", "6190b1f9554daceaf7a8a41ad32d1d037dca01ca"],
  ["reseptit/paaruoat/karnivore-meatza.md", "c5b3a778b25e79912c2ac657fc832ad0040d6088"],
  ["docs/nutrition/calculations/karnivore-meatza.json", "cee4b6dfb799b3a226c503501a73f7078b33b290"],
  ["docs/nutrition/batches/batch-503.json", "e2b45bf6758217cf1fd0de57b410b7fefdb58260"],
  ["kuvat/paaruoat/karnivore-meatza.webp", "9bbfa4236cec3563e40ce1d70980b99e384b5c63"],
  ["reseptit/paaruoat/karnivore-rapea-porsaan-kylki.md", "01c618a195d706a2ed092695806421b4ed9369fb"],
  ["docs/nutrition/calculations/karnivore-rapea-porsaan-kylki.json", "df6be530c7f5f8cb16afc9b3fe44bc39f0bdeff5"],
  ["docs/nutrition/batches/batch-502.json", "a83adfcdaf4a923796e67543c7988664a05785d5"],
  ["kuvat/paaruoat/karnivore-rapea-porsaan-kylki.webp", "b34bf73ec5b16b56b6cfa89197f63cf93736a41d"],
  ["reseptit/paaruoat/karnivore-smashburger.md", "179b12d53d97c406c6f83d2b829173375583b5d4"],
  ["docs/nutrition/calculations/karnivore-smashburger.json", "8dd35e571cc21e4e5950d34d56b0b9d9d7afdd29"],
  ["docs/nutrition/batches/batch-487.json", "f31a51f5fd117f18a6a3b75368878f02cf3e98da"],
  ["kuvat/paaruoat/karnivore-smashburger.webp", "5247119ff8072851bab108e12128073018a375bb"],
  [
    "reseptit/paaruoat/karnivore-steak-and-eggs.md",
    "c46f783cd6c4fe63ac62b5e163b13ffc5b8a8ed7"
  ],
  [
    "reseptit/paaruoat/karnivore-voilohi-pannulla.md",
    "12b564ce9c49f0a09d4c1ae8734e1b720be530a0"
  ],
  [
    "reseptit/paaruoat/karnivore-jauhelihakulho-munalla.md",
    "acb7a784af286cbdf42d44a229cafe0742c0fc2e"
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
    "7a060d62fe52123780392d0e2895f09b1819fe4a"
  ],
  [
    "kuvat/paaruoat/karnivore-voilohi-pannulla.webp",
    "a0e315c78baa85a3a328c8671b1bd9fc493f86ff"
  ],
  [
    "kuvat/paaruoat/karnivore-jauhelihakulho-munalla.webp",
    "0ec49fd5a9f6308b31c9048b4051b6d97088a1b8"
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
const cocoaPath = "reseptit/aamupalat/rasvakaakao-rouva-keto.md";
const cocoaPublication = "8cb015878ab09339275851ce31ac421e5ac5288d";
const reviewedFiBreakfastFiles = new Map([
  ["docs/nutrition/calculations/valimerellinen-menemen-fetalla.json", "aa88cc61405a5db8771f84a0b25df9bd038846b4a1c252caa7248cb5010db57c"],
  [cocoaPath, "73ec1919b0038f2479837583081a4d3662f49c7bb4d81d301a75505b8749e32d"],
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
  ["reseptit/paaruoat/hyderabadi-kanabiryani.md", { status: "M", sha256: "591ff23b6543b9f9c4893a332598cf0b79e3e6dd1b4f8790319c43934b196159" }],
  ["kaannokset/en/paaruoat/hyderabadi-kanabiryani.md", { status: "M", sha256: "5ee35c7a201b30b2bb74270729a0764444f8c1e15d9bf5b25f416f7937da69a2" }],
  ["kaannokset/sv/paaruoat/hyderabadi-kanabiryani.md", { status: "M", sha256: "ff8332953ef806e04462987107bcdb348f9ecb1abd309bc296e666af4213d015" }],
  ["kaannokset/th/paaruoat/hyderabadi-kanabiryani.md", { status: "M", sha256: "91abb4513fa3dcb7b301e6b0b2f53768603569764943218d90fecacf2c3a5147" }],
  ["docs/nutrition/calculations/hyderabadi-kanabiryani.json", { status: "M", sha256: "2f2f4f0b9d25f336d3bebdef21046de5dcab9f7c54d7b6337842f1d95cd42abd" }],
  ["reseptit/alkuruoat/tunisialainen-brik.md", { status: "M", sha256: "ba717dc99f3f78b6001fdcea43afb0e06002e6c40df2f96428e13c9008b80dfa" }],
  ["kaannokset/en/alkuruoat/tunisialainen-brik.md", { status: "M", sha256: "439931c68cd671cf761139217777528852a4f3e3efd056cc53fde52c62997922" }],
  ["kaannokset/sv/alkuruoat/tunisialainen-brik.md", { status: "M", sha256: "633a9155951e4b7f1e88ffc234c09313b6026b1b9cfb6f3bf5970e88d3a61668" }],
  ["kaannokset/th/alkuruoat/tunisialainen-brik.md", { status: "M", sha256: "aa2b3944cedb66d12a82089b7333b4ea7b668836302d8196ca5bc0dba94688ec" }],
  ["reseptit/alkuruoat/jiaozi.md", { status: "M", sha256: "3ca732e55e989dd81361ed6284a1bf742b781421e37b7f952854a98179315fb5" }],
  ["kaannokset/en/alkuruoat/jiaozi.md", { status: "M", sha256: "a182dceb7b7bbfa887ff298943354d58d5251648af3cc0d2cb1b51924b91651c" }],
  ["kaannokset/sv/alkuruoat/jiaozi.md", { status: "M", sha256: "e34adfa421aaadd646c897f319ba6076cdf26585337bc5ef1dd9949a8feb358f" }],
  ["kaannokset/th/alkuruoat/jiaozi.md", { status: "M", sha256: "7cedbc9b10b15e597d78d6bf5d0024f08f35a45d3979eeefd2e68e1ca7907c50" }],
  ...Object.entries(preparedTranslations.changes),
  ...Object.entries(approvedTranslations.changes),
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
  const original = parseMarkdown(projectTranslationAuditSource(sourcePath, originalRaw));
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

function checkedPostBaselineRelease(root: string, baseline: string, recipeId: string, sourcePath?: string): boolean {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(recipeId)) return false;
  const receipt = path.join(root, "docs/reviews/new-recipes", recipeId + ".json");
  if (!existsSync(receipt)) return false;
  const approval = JSON.parse(readFileSync(receipt, "utf8")) as { recipe_id?: string; source_path?: string };
  const file = approval.source_path;
  if (approval.recipe_id !== recipeId || typeof file !== "string" ||
      !/^reseptit\/(?:alkuruoat|paaruoat|jalkiruoat|leivonnaiset|aamupalat|valipalat)\/[^\\]+\.md$/.test(file) ||
      path.posix.normalize(file) !== file || (sourcePath && sourcePath !== file)) return false;
  const source = parseMarkdown(readFileSync(path.join(root, file), "utf8"));
  if (source?.data.recipe_id !== recipeId || source.data.status !== "published" || source.data.language !== "fi") return false;
  const historicalPath = execFileSync("git", ["--literal-pathspecs", "ls-tree", "-r", "--name-only", baseline, "--", file], {
    cwd: root, encoding: "utf8",
  });
  if (historicalPath.trim()) {
    const old = parseMarkdown(execFileSync("git", ["show", baseline + ":" + file], { cwd: root, encoding: "utf8" }));
    // Promoting the same historical FI draft does not mutate a published baseline recipe.
    if (old?.data.status !== "draft" || old.data.language !== "fi" || old.data.recipe_id !== recipeId) return false;
  }
  execFileSync(process.execPath, [path.join(root, "site/scripts/new-recipe-preflight.mjs"), "--recipe=" + file], {
    cwd: root, encoding: "utf8",
  });
  return true;
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

    // This path did not exist in the historical source tree. Its current
    // structure is checked independently and draft status cannot grant release.
    if (status === "A" && /^reseptit\/(?:raakileet|alkuruoat|paaruoat|jalkiruoat|leivonnaiset|aamupalat|valipalat)\/.+\.md$/.test(file)) {
      const parsed = parseMarkdown(readFileSync(path.join(root, file), "utf8"));
      if (parsed?.data.status === "draft") {
        const draft = recipeFrontmatterSchema.parse(parsed.data);
        assert.equal(draft.language, "fi", change);
        continue;
      }
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
      const current = readFileSync(path.join(root, file), "utf8");
      if (file === cocoaPath) {
        const approved = execFileSync("git", ["show", cocoaPublication + ":" + file], { cwd: root, encoding: "utf8" });
        assert.equal(textHash(approved), reviewedFiBreakfastFiles.get(file), change);
        // Only the approved cover image's alternative text can vary.
        const withoutCoverAlt = (source: string) => {
          const recipe = recipeFrontmatterSchema.parse(parseMarkdown(source)?.data);
          assert.ok(recipe.image?.alt.trim(), change);
          const normalized = source.replaceAll("\r\n", "\n");
          const pattern = /(^image:\n  src: [^\n]+\n  alt: )[^\n]+/m;
          assert.match(normalized, pattern, change);
          return normalized.replace(pattern, "$1");
        };
        assert.equal(withoutCoverAlt(current), withoutCoverAlt(approved), change);
      } else {
        assert.equal(textHash(current), reviewedFiBreakfastFiles.get(file), change);
      }
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
    if (status === "M" && reviewedBreakfastPaths.includes(file)) {
      const current = readFileSync(path.join(root, file), "utf8");
      const historical = historicalBreakfastRecipe(file, current);
      if (historical !== current) {
        const original = execFileSync("git", ["show", baseline + ":" + file], { cwd: root, encoding: "utf8" });
        assert.equal(historical, original.replaceAll("\r\n", "\n"), change);
        continue;
      }
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
      const reviewedSnapshot = originalForKetoprakHistory(root, file, originalForBissaraHistory(root, file, originalForJumeokbapHistory(root, file, snapshot)));
      const historicalSnapshot = originalForCoconutBananaHistory(root, file, originalForBindaetteokHistory(root, file, originalForTamagoKakeGohanHistory(root, file, reviewedSnapshot)));
      if (historicalSnapshot !== current) {
        const original = execFileSync("git", ["show", baseline + ":" + file], { cwd: root, encoding: "utf8" });
        assert.equal(historicalSnapshot, original, change);
        continue;
      }
    }
    if ((status === "A" || status === "M") && /^reseptit\/(?:alkuruoat|paaruoat|jalkiruoat|leivonnaiset|aamupalat|valipalat)\/.+\.md$/.test(file)) {
      const parsed = parseMarkdown(readFileSync(path.join(root, file), "utf8"));
      if (parsed?.data.status === "published") {
        const id = parsed.data.recipe_id;
        if (typeof id === "string" && checkedPostBaselineRelease(root, baseline, id, file)) {
          recipeFrontmatterSchema.parse(parsed.data);
          continue;
        }
      }
    }
    if (status === "A" && /^docs\/nutrition\/calculations\/[a-z0-9-]+\.json$/.test(file)) {
      if (checkedPostBaselineRelease(root, baseline, path.basename(file, ".json"))) continue;
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

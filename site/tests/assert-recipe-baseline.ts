import {mainAdditionFiles, postBaselineBriocheIds, postBaselineClassicIds} from "./original-content-transition";
import assert from "node:assert/strict";
import { originalForB21CanonicalHistory } from "./b21-canonical-historical-transition";
import { originalForC13CanonicalHistory } from "./c13-canonical-historical-transition";
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
const approvedGlutenFreeFiFiles = new Map<string, string>([
  ["reseptit/jalkiruoat/gluteeniton-perunajauhokakkupohja.md", "8de57cb20ad8aa888870a6f061a0aa5c7bfe73a6"],
  ["reseptit/leivonnaiset/gluteeniton-durrapizzapohja.md", "284f68dacbdae1d2d5ca5c969c697e85a84f2708"],
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
    if (status === "A" && approvedGlutenFreeFiFiles.has(file)) {
      const actualBlob = execFileSync("git", ["hash-object", file], { cwd: root, encoding: "utf8" }).trim();
      assert.equal(actualBlob, approvedGlutenFreeFiFiles.get(file), "UNREVIEWED_GF_FI_RECIPE: " + change);
      const recipe = parseMarkdown(readFileSync(path.join(root, file), "utf8"));
      assert.equal(recipe?.data.status, "published", change);
      assert.equal(recipe?.data.gluten_free, true, change);
      assert.ok(recipe?.data.gluten_free_review, change);
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
      const snapshot = originalForC13CanonicalHistory(root, file, originalForB21CanonicalHistory(root, file, originalForReviewedChefSafety(root, file, originalForChefHistoricalCheck(root, file,
        recipeTextForApprovedSnapshot(file,
          historicalRendangForApprovedVersion(file, historicalFarinataForApprovedPanVersion(file, current)))))));
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

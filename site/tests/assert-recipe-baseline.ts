import {mainAdditionFiles, postBaselineBriocheIds, postBaselineClassicIds} from "./original-content-transition";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { recipeTextForApprovedSnapshot } from "../scripts/approved-recipe-note-edits";
import { historicalFarinataForApprovedPanVersion } from "../scripts/gk100-farinata-sealed-source";
import { parseMarkdown } from "../src/content/markdown";
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
const reviewedClassicFiles = new Set(postBaselineClassicIds.flatMap(id => [
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

export function assertRecipeBaseline(root: string, baseline: string, ...protectedPaths: string[]) {
  const changes = execFileSync(
    "git",
    ["diff", "--no-renames", "--name-status", baseline, "--", "reseptit", "kaannokset", ...protectedPaths],
    { cwd: root, encoding: "utf8" },
  ).trim().split(/\r?\n/).filter(Boolean);

  for (const change of changes) {
    const [status, file] = change.split("\t");
    if (status === "A" && Object.hasOwn(mainAdditionFiles, file)) {
      assert.equal(textHash(readFileSync(path.join(root, file), "utf8")), mainAdditionFiles[file], change);
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
      const snapshot = recipeTextForApprovedSnapshot(file, historicalFarinataForApprovedPanVersion(file, current));
      if (snapshot !== current) {
        const original = execFileSync("git", ["show", baseline + ":" + file], { cwd: root, encoding: "utf8" });
        assert.equal(snapshot, original, change);
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

/**
 * #404 / #393: read-only, fail-closed audit for a specific quarantined recipe.
 * It never rewrites nutrition evidence, recipe source or GK approval seals.
 */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";

export type AlooHoldReport = {
  recipeId: "intialainen-aloo-paratha";
  state: "HOLD";
  findings: string[];
  quarantinePresent: boolean;
  sourceReviewStatus: string;
  translationFilesMissing: string[];
  publicationAuthorized: false;
  GKApproved: false;
};

export function auditAlooEvidence(args: {
  recipe: string;
  nutrition: {
    ingredients?: Array<{
      item?: string;
      record?: {id?: string; name?: string; sourceUrl?: string};
      matchEvidence?: string;
    }>;
    reviewerStatus?: string;
  };
  quarantine: string[];
  translationFilesMissing: string[];
}): AlooHoldReport {
  const parsed = parseMarkdown(args.recipe);
  assert.ok(parsed, "FI source must have frontmatter");
  const data = recipeFrontmatterSchema.parse(parsed.data);
  assert.equal(data.recipe_id, "intialainen-aloo-paratha");
  assert.equal(data.language, "fi");
  const findings: string[] = [];
  const potato = args.nutrition.ingredients?.find(x => /perunaa/i.test(x.item ?? ""));
  if (!potato) findings.push("POTATO_NUTRITION_ROW_MISSING");
  else {
    const name = potato.record?.name ?? "";
    if (/maa.artisokka/i.test(name) || potato.record?.id === "fineli-310-release-20")
      findings.push("POTATO_MISIDENTIFIED_AS_JERUSALEM_ARTICHOKE");
    if (!/peruna/i.test(name) || /artisokka/i.test(name))
      findings.push("POTATO_RECORD_IDENTITY_NOT_VERIFIED");
    if (/raw potato|raaka peruna/i.test(potato.matchEvidence ?? "") && /artisokka/i.test(name))
      findings.push("POTATO_MATCH_EVIDENCE_CONTRADICTS_RECORD");
  }
  const ingredients = data.ingredients.map(x => x.item.toLocaleLowerCase("fi"));
  if (!ingredients.some(x => /jogurtt/.test(x)) && /jogurt/i.test(parsed.content))
    findings.push("YOGURT_SERVING_NOT_IN_INGREDIENTS");
  if (!/perun(?:at|a).{0,80}(?:keit|kyps|soseut)|(?:keit|kyps|soseut).{0,80}perun/i.test(parsed.content))
    findings.push("POTATO_FILLING_COOKING_NOT_SPECIFIED");
  if (!/täyt(?:e|t).{0,80}(?:sulje|suljet|tait|sisään)|(?:sulje|tait).{0,80}täyt/i.test(parsed.content))
    findings.push("FILLING_ENCLOSURE_NOT_SPECIFIED");
  if (args.nutrition.reviewerStatus !== "APPROVED")
    findings.push("NUTRITION_REVIEW_NOT_INDEPENDENTLY_APPROVED");
  const quarantinePresent = args.quarantine.includes(data.recipe_id);
  if (!quarantinePresent) findings.push("PUBLIC_QUARANTINE_MISSING");
  if (args.translationFilesMissing.length)
    findings.push("TRANSLATIONS_NOT_AVAILABLE");
  return {
    recipeId: "intialainen-aloo-paratha",
    state: "HOLD",
    findings,
    quarantinePresent,
    sourceReviewStatus: args.nutrition.reviewerStatus ?? "UNKNOWN",
    translationFilesMissing: args.translationFilesMissing,
    publicationAuthorized: false,
    GKApproved: false,
  };
}

export async function readCurrentAlooHold(root: string) {
  const source = await readFile(path.join(root, "reseptit/aamupalat/intialainen-aloo-paratha.md"), "utf8");
  const nutrition = JSON.parse(await readFile(path.join(root,
    "docs/nutrition/calculations/intialainen-aloo-paratha.json"), "utf8"));
  const quarantine: string[] = JSON.parse(await readFile(path.join(root,
    "site/scripts/public-recipe-quarantine.json"), "utf8"));
  const missing: string[] = [];
  for (const locale of ["en", "sv", "th"]) {
    const rel = "kaannokset/" + locale + "/aamupalat/intialainen-aloo-paratha.md";
    try { await readFile(path.join(root, rel), "utf8"); }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      missing.push(locale);
    }
  }
  return auditAlooEvidence({recipe: source, nutrition, quarantine, translationFilesMissing: missing});
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
  const report = await readCurrentAlooHold(root);
  console.log(JSON.stringify(report, null, 2));
  if (!report.quarantinePresent) process.exitCode = 1;
}

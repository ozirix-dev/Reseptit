import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isPublicRecipeQuarantined } from "./public-recipe-quarantine";
import { auditTranslations } from "./translation-audit";

export type PreflightDecision = {
  recipeId: string;
  classification: "HOLD" | "CANDIDATE_REQUIRES_REVIEW";
  blockers: string[];
};
export type PreflightInputs = {
  gk149SourceIds: ReadonlySet<string>;
  publishedTranslationLocales: ReadonlyMap<string, readonly string[]>;
  quarantined: (id: string) => boolean;
};

/**
 * Cheap fail-closed screening before touching Git or starting a full CI run.
 * This is NOT a proof that a candidate has no other source/GK dependencies.
 */
export function classifyCanonicalMethodMigration(
  recipeIds: readonly string[], inputs: PreflightInputs,
): PreflightDecision[] {
  const seen = new Set<string>();
  return recipeIds.map(recipeId => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(recipeId)) {
      return { recipeId, classification: "HOLD", blockers: ["INVALID_RECIPE_ID"] };
    }
    const blockers: string[] = [];
    if (seen.has(recipeId)) blockers.push("DUPLICATE_CANDIDATE");
    seen.add(recipeId);
    if (inputs.quarantined(recipeId)) blockers.push("PUBLIC_QUARANTINE_REQUIRES_SEPARATE_APPROVAL");
    if (inputs.gk149SourceIds.has(recipeId)) blockers.push("GK149_FULL_SOURCE_SHA_REVIEW_REQUIRED");
    const locales = inputs.publishedTranslationLocales.get(recipeId) ?? [];
    if (locales.length) blockers.push("PUBLISHED_TRANSLATION_SEMANTIC_REVIEW_REQUIRED:" + locales.join(","));
    return { recipeId, classification: blockers.length ? "HOLD" : "CANDIDATE_REQUIRES_REVIEW", blockers };
  });
}

export async function loadSourceMigrationInputs(repoRoot: string, recipeIds?: string[]): Promise<PreflightInputs> {
  const [gk149Raw, translationsRaw, publishedAudit] = await Promise.all([
    readFile(path.join(repoRoot, "docs/nutrition/gk80-operation149/cases.json"), "utf8"),
    readFile(path.join(repoRoot, "meta/kaannokset/published-translation-pairs.json"), "utf8"),
    auditTranslations(recipeIds),
  ]);
  const gk149 = JSON.parse(gk149Raw) as { selectedRecipeIds?: unknown };
  const registry = JSON.parse(translationsRaw) as {
    schemaVersion?: number;
    sources?: Array<{ recipe_id: string; locales: string[] }>;
  };
  if (!Array.isArray(gk149.selectedRecipeIds) ||
      !gk149.selectedRecipeIds.every(id => typeof id === "string") ||
      registry.schemaVersion !== 1 || !Array.isArray(registry.sources)) {
    throw new Error("SOURCE_MIGRATION_PREFLIGHT_INPUT_MALFORMED");
  }
  const registryEntries: Array<readonly [string, readonly string[]]> = registry.sources.map(row => {
    if (typeof row.recipe_id !== "string" ||
        !Array.isArray(row.locales) ||
        !row.locales.every(locale => ["en", "sv", "th"].includes(locale)))
      throw new Error("SOURCE_MIGRATION_TRANSLATION_REGISTRY_MALFORMED");
    return [row.recipe_id, row.locales] as const;
  });
  if (new Set(registryEntries.map(entry => entry[0])).size !== registryEntries.length)
    throw new Error("SOURCE_MIGRATION_DUPLICATE_PUBLISHED_REGISTRY");
  // The sidecar alone is not authoritative: the poha translations are
  // published Markdown files even though they are absent from this index.
  const actualLocales = new Map<string, Set<string>>(
    registryEntries.map(([id, locales]) => [id, new Set(locales)]),
  );
  for (const translation of publishedAudit.publishedTranslations) {
    const id = translation.data.recipe_id;
    const locale = translation.data.language;
    if (!["en", "sv", "th"].includes(locale)) throw new Error("INVALID_PUBLISHED_TRANSLATION_LOCALE");
    if (!actualLocales.has(id)) actualLocales.set(id, new Set());
    actualLocales.get(id)!.add(locale);
  }
  return {
    gk149SourceIds: new Set(gk149.selectedRecipeIds as string[]),
    publishedTranslationLocales: new Map([...actualLocales].map(([id, locales]) =>
      [id, [...locales].sort()] as const)),
    quarantined: isPublicRecipeQuarantined,
  };
}

const calledDirectly = process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (calledDirectly) {
  const ids = process.argv.slice(2);
  if (!ids.length) throw new Error("Usage: npx tsx scripts/source-migration-preflight.ts recipe-id [...]");
  const root = path.resolve(import.meta.dirname, "../..");
  const classifications = classifyCanonicalMethodMigration(ids, await loadSourceMigrationInputs(root, ids));
  for (const result of classifications) {
    console.log([result.recipeId, result.classification, result.blockers.join("|") || "NO_KNOWN_EARLY_BLOCKER"].join("\t"));
  }
  console.log("CANDIDATE_REQUIRES_REVIEW never means safe to merge: run exact source/overlay, nutrition, GK, i18n and CI gates.");
  if (classifications.some(result => result.classification === "HOLD")) process.exitCode = 2;
}

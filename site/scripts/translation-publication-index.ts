import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import type { TranslationAuditResult } from "./translation-audit";
import { isPublicRecipeQuarantined } from "./public-recipe-quarantine";

type Source = TranslationAuditResult["publishedSources"][number];
const localeSchema = z.enum(["en", "sv", "th"]);
const indexSchema = z.object({
  schemaVersion: z.literal(1),
  sources: z.array(z.object({
    recipe_id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    locales: z.array(localeSchema).min(1),
  }).strict()),
}).strict();

export type TranslationPublicationIndex = z.infer<typeof indexSchema>;
export const publicationIndexPath = "meta/kaannokset/published-translation-pairs.json";

/** A GK-sealed FI markdown with status: published can still be quarantined from public use.
 * All published translations must require a publicly eligible source, independently of raw FI status.
 */
export function assertTranslationSourceIsNotQuarantined(recipeId: string): void {
  if (isPublicRecipeQuarantined(recipeId)) throw Error("TRANSLATION_QUARANTINED_FI: " + recipeId);
}

/**
 * Keep published-translation availability separate from GK-sealed FI raw files.
 * Audit-only metadata overlay; the original Markdown is never mutated.
 * Invalid, duplicate, missing and contradictory declarations fail closed.
 */
export function overlayTranslationPublicationIndex(
  sources: Source[], rawIndex: unknown, recipeIds?: ReadonlySet<string>,
): Source[] {
  if (rawIndex === null) return sources;
  const index = indexSchema.parse(rawIndex);
  const byId = new Map(sources.map((r) => [r.data.recipe_id, r]));
  const seen = new Set<string>();
  for (const row of index.sources) {
    assertTranslationSourceIsNotQuarantined(row.recipe_id);
    if (seen.has(row.recipe_id)) throw Error("TRANSLATION_INDEX_DUPLICATE_SOURCE: " + row.recipe_id);
    seen.add(row.recipe_id);
    if (new Set(row.locales).size !== row.locales.length) throw Error("TRANSLATION_INDEX_DUPLICATE_LOCALE: " + row.recipe_id);
  }
  for (const row of index.sources) {
    // A targeted audit reads only requested sources; full audit checks every row.
    if (recipeIds && !recipeIds.has(row.recipe_id)) continue;
    const source = byId.get(row.recipe_id);
    if (!source || source.data.status !== "published" || source.data.language !== "fi")
      throw Error("TRANSLATION_INDEX_MISSING_PUBLISHED_FI: " + row.recipe_id);
    const statuses = { ...(source.data.translation_status ?? {}) };
    const languages = new Set(source.data.translation_languages ?? []);
    for (const locale of row.locales) {
      if (statuses[locale] !== undefined && statuses[locale] !== "published")
        throw Error("TRANSLATION_INDEX_FI_STATUS_CONFLICT: " + row.recipe_id + ":" + locale);
      statuses[locale] = "published";
      languages.add(locale);
    }
    byId.set(row.recipe_id, {
      ...source,
      data: { ...source.data, translation_status: statuses, translation_languages: [...languages] },
    });
  }
  return sources.map((source) => byId.get(source.data.recipe_id) ?? source);
}

export async function loadTranslationPublicationIndex(root: string): Promise<unknown> {
  const file = path.join(root, publicationIndexPath);
  const text = await readFile(file, "utf8").catch((error: NodeJS.ErrnoException) => {
    if (error.code === "ENOENT") return null;
    throw error;
  });
  return text === null ? null : JSON.parse(text);
}

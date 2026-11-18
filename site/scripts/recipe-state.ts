import successors from "../../meta/recipe-successors.json";
import { gkVariantScope } from "../src/features/recipes/gk-estimate-scope";
import { publicSafetyHold } from "./build-content";
import { f25SourceReleaseGatePath } from "./f25-source-release-gate";
import { isPublicRecipeQuarantined } from "./public-recipe-quarantine";
import { indexPublicRecipes, recipeLocales } from "./recipe-public-state";
import { publicRecipeQualityHold } from "./recipe-quality-holds";
import { contentHash } from "./translation-review";
import { semanticEvidencePath } from "./translation-semantic-review";
import type { RecipeStateInputs } from "./recipe-state-inputs";

const successorPath = "meta/recipe-successors.json";
const quarantinePath = "site/scripts/public-recipe-quarantine.json";
const gkBindingPath = "docs/nutrition/glycemic-load-recipe-bindings.json";
const gkPendingPath = "docs/nutrition/new-public-gk-pending-sources.json";
const humanReviewPath = "meta/kaannokset/human-review-evidence.json";

type Source = RecipeStateInputs["sources"][number];
const sourceReference = (source: Source) => ({ sourceRecipeId: source.recipe_id, path: source.file,
  gitBlob: source.blob, contentHash: source.hash });

function groupBy<T>(rows: readonly T[], key: (row: T) => string) {
  const groups = new Map<string, T[]>();
  for (const row of rows) {
    const name = key(row);
    const group = groups.get(name);
    if (group) group.push(row);
    else groups.set(name, [row]);
  }
  return groups;
}

function countBy<T>(rows: readonly T[], key: (row: T) => string) {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const name = key(row);
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return Object.fromEntries([...counts.keys()].sort().map(name => [name, counts.get(name)!]));
}

export function projectRecipeState(sourceCommit: string, inputs: RecipeStateInputs) {
  const { byId, ...publicInventory } = indexPublicRecipes(inputs.publicRecipes);
  const conflicts: { recipeId: string; code: string; paths: string[] }[] = [];
  const fiGroups = groupBy(inputs.sources.filter(source => source.language === "fi"), source => source.recipe_id);
  const sources = new Map([...fiGroups].sort(([a], [b]) => a < b ? -1 : 1).map(([id, group]) => {
    const published = group.filter(source => source.status === "published");
    if (published.length > 1 || (published.length === 0 && group.length > 1)) {
      conflicts.push({ recipeId: id, code: "ambiguous-fi-source", paths: group.map(source => source.file) });
    }
    return [id, published[0] ?? group[0]] as const;
  }));
  const translations = groupBy(inputs.sources.filter(source => source.language !== "fi"),
    source => `${source.recipe_id}:${source.language}`);
  const reviews = new Map(inputs.review.rows.map(row => [`${row.recipe_id}:${row.locale}`, row]));
  const nutrition = new Map(inputs.nutrition.inventory.map(row => [row.recipe_id, row]));
  const gkResults = new Map(inputs.glycemic.results.map(row => [row.recipeId, row]));
  const gkPending = new Map(inputs.glycemic.newPublicGkPendingSources.map(row => [row.recipeId, row]));
  const gkPublic = new Map(inputs.publicGk.map(row => [row.recipeId, row]));
  const gkVariants = groupBy(inputs.glycemic.gkOnlyVariants, row => row.recipeId);
  const publicVariantIds = new Set(inputs.publicVariants.map(row => row.versionId));
  const f25 = new Map(inputs.f25.map(row => [row.recipe_id, row]));
  const predecessorIds = new Set<string>();
  const lineage = new Map<string, (typeof successors)[number]>();
  for (const link of successors) {
    const next = byId.get(link.recipe_id)?.fi;
    const previous = sources.get(link.predecessor_id);
    const paths = [link.predecessor_path, ...(sources.has(link.recipe_id) ? [sources.get(link.recipe_id)!.file] : [])];
    if (!next || next.slug !== link.url_slug || !previous || previous.status !== "published"
      || previous.url_slug !== link.url_slug || previous.file !== link.predecessor_path
      || previous.blob !== link.predecessor_blob_sha || !isPublicRecipeQuarantined(link.predecessor_id)
      || byId.has(link.predecessor_id) || predecessorIds.has(link.predecessor_id) || lineage.has(link.recipe_id)) {
      conflicts.push({ recipeId: link.recipe_id, code: "unverified-successor", paths });
      continue;
    }
    predecessorIds.add(link.predecessor_id);
    lineage.set(link.recipe_id, link);
  }
  for (const id of byId.keys()) {
    if (!sources.has(id) || !byId.get(id)?.fi) throw Error(`Public recipe has no FI source or route: ${id}`);
  }
  const recipes = [...sources].flatMap(([id, source]) => {
    if (predecessorIds.has(id)) return [];
    const versions = byId.get(id);
    const fi = versions?.fi;
    const quarantined = isPublicRecipeQuarantined(id);
    const hold = publicSafetyHold(id, "fi") || publicRecipeQualityHold(id, "fi");
    if (quarantined && versions) throw Error(`Quarantined recipe has a public route: ${id}`);
    const publicState = fi ? (hold ? "editorial-hold" : "visible")
      : quarantined ? "quarantine" : source.status === "draft" ? "draft" : "unlisted";
    if (publicState === "unlisted") conflicts.push({ recipeId: id, code: "published-fi-without-route", paths: [source.file] });
    const link = lineage.get(id);
    const predecessor = link ? sources.get(link.predecessor_id)! : null;
    const nutritionRow = nutrition.get(id);
    if (nutritionRow && (nutritionRow.source_path !== source.file || nutritionRow.source_content_hash !== source.hash)) {
      throw Error(`Nutrition audit source mismatch: ${source.file}`);
    }
    const f25Decision = f25.get(id);
    const currentBlockers: { scope: string; code: string }[] = [];
    if (quarantined) currentBlockers.push({ scope: "publication", code: "quarantine" });
    if (hold) currentBlockers.push({ scope: "publication", code: "editorial-hold" });
    if (f25Decision && !f25Decision.authorized) currentBlockers.push({ scope: "translation", code: f25Decision.reason });
    const languages = recipeLocales.map(locale => {
      const route = versions?.[locale];
      const candidates = locale === "fi" ? [source] : translations.get(`${id}:${locale}`) ?? [];
      const target = candidates.find(candidate => candidate.status === "published") ?? candidates[0];
      const review = reviews.get(`${id}:${locale}`);
      if (route && target?.status !== "published") throw Error(`Route has no published Markdown source: ${route.routePath}`);
      if (review && (review.source_path !== source.file || review.source_content_hash !== source.hash)) throw Error(`Translation review source mismatch: ${id}:${locale}`);
      if (review?.translation_path && (review.translation_path !== target?.file || review.translation_content_hash !== target.hash)) throw Error(`Translation review target mismatch: ${id}:${locale}`);
      if (route && review && review.codex_review_status !== "REVIEW CURRENT") {
        currentBlockers.push({ scope: locale, code: review.codex_review_status });
      }
      return { locale, state: route ? "public" : target?.status === "published" ? "withheld" : target?.status ?? "missing",
        route: route?.routePath ?? null, slug: route?.slug ?? null, sourcePath: target?.file ?? null,
        contentHash: target?.hash ?? null,
        review: review ? {
          structural: review.structural_status, codex: review.codex_review_status, human: review.human_review_status,
          sourceSemanticHash: review.source_semantic_hash, targetSemanticHash: review.translation_semantic_hash,
          evidenceReference: review.codex_review?.reference ?? null,
          humanEvidenceId: review.review_evidence_id,
        } : null };
    });
    const gk = gkResults.get(id);
    const pending = gkPending.get(id);
    const visibleGk = gkPublic.get(id);
    if (fi && !visibleGk && !pending) conflicts.push({ recipeId: id, code: "missing-public-gk-disposition", paths: [source.file] });
    if (pending && pending.sourceBlobSha !== source.blob) throw Error(`GK pending source mismatch: ${source.file}`);
    if (pending) currentBlockers.push({ scope: "glycemic-load", code: pending.reason });
    const bindingDifferences = [
      ...(inputs.glycemic.recipeBindingMismatches.includes(id) ? ["source"] : []),
      ...(inputs.glycemic.calculationInputMismatches.includes(id) ? ["input"] : []),
      ...(inputs.glycemic.calculationEvidenceMismatches.includes(id) ? ["evidence"] : []),
    ];
    const variants = (gkVariants.get(id) ?? []).map(variant => ({
      versionId: variant.versionId, inputSha256: variant.inputSha256, scope: gkVariantScope(variant),
      level: variant.level, public: publicVariantIds.has(variant.versionId),
    }));
    const imagePath = source.imagePath;
    const imageBlob = imagePath ? inputs.blobs.get(imagePath) ?? null : null;
    const imageMatches = fi?.image && imagePath && fi.image.src.endsWith(`/${imagePath}`);
    const imageState = fi?.image ? (imageMatches && imageBlob ? "published-source-match" : "conflict")
      : imagePath ? (imageBlob ? "source-only" : "missing-asset") : "missing";
    if (imageState === "conflict") conflicts.push({ recipeId: id, code: "image-source-mismatch", paths: [source.file] });
    const effectiveHash = fi && hold ? contentHash(JSON.stringify([source.effectiveHash, hold])) : source.effectiveHash;
    const previousF25 = predecessor ? f25.get(predecessor.recipe_id) : undefined;
    return [{
      canonicalRecipeId: predecessor?.recipe_id ?? id, sourceRecipeId: id, sourcePath: source.file, contentHash: source.hash,
      ...(effectiveHash !== source.hash ? { effectiveContentHash: effectiveHash } : {}),
      publicState, publicSlug: fi?.slug ?? null, languages,
      nutritionStatus: nutritionRow?.status ?? "NOT AUDITED",
      glycemicLoadStatus: {
        publicOriginal: visibleGk ? { status: visibleGk.status, point: visibleGk.glycemicLoadPerServing,
          range: visibleGk.glycemicLoadRangePerServing, blockerCategories: [...new Set(visibleGk.incompleteReasons.map(r => r.category))].sort() } : null,
        auditStatus: gk?.status ?? (pending ? "PENDING REVIEW" : "NOT AUDITED"),
        auditedSourceHash: inputs.glycemic.sourceHashes[id] ?? null,
        calculationInputSha256: inputs.glycemic.calculationInputHashes[id] ?? null,
        calculationEvidenceSha256: inputs.glycemic.calculationEvidenceHashes[id] ?? null,
        bindingDifferences, variants,
      },
      imageStatus: { state: imageState, path: imagePath, gitBlob: imageBlob },
      currentBlockers,
      successorReferences: link && predecessor ? [{ ...sourceReference(predecessor), replacedBy: id, publicSlug: link.url_slug,
        historicalF25Hold: previousF25 && !previousF25.authorized ? previousF25.reason : null }] : [],
      drafts: fiGroups.get(id)!.filter(candidate => candidate !== source && candidate.status === "draft").map(sourceReference),
      evidenceRefs: [source.file, ...(quarantined || link ? [quarantinePath] : []),
        ...(hold ? [publicSafetyHold(id, "fi") ? "site/scripts/build-content.ts" : "site/scripts/recipe-quality-holds.ts"] : []),
        ...(link ? [successorPath] : []),
        ...(languages.some(l => l.review) ? [semanticEvidencePath, humanReviewPath] : []),
        ...(nutritionRow?.calculationEvidence ? [nutritionRow.calculationEvidence] : []),
        ...(gk || variants.length ? [gkBindingPath] : []), ...(pending ? [gkPendingPath] : []),
        ...(f25Decision || previousF25 ? [f25SourceReleaseGatePath] : []),
        ...(imageBlob && imagePath ? [imagePath] : [])],
    }];
  });
  const publicFi = recipes.filter(row => row.publicSlug !== null);
  return { schemaVersion: 1, sourceCommit, publicInventory, recipes, conflicts,
    counts: {
      publicFi: publicFi.length,
      fourLanguages: publicFi.filter(row => row.languages.every(l => l.state === "public")).length,
      fiOnly: publicFi.filter(row => row.languages.slice(1).every(l => l.state !== "public")).length,
      missingPublicLanguageSlots: publicFi.flatMap(row => row.languages.slice(1)).filter(l => l.state !== "public").length,
      blockedFiSources: inputs.sources.filter(row => row.language === "fi" && row.status === "published" && !byId.get(row.recipe_id)?.fi).length,
      draftFiFiles: inputs.sources.filter(row => row.language === "fi" && row.status === "draft").length,
      successors: lineage.size,
      currentRecipeHolds: recipes.filter(row => row.publicState === "quarantine" || row.publicState === "editorial-hold").length,
      historicalQuarantinedPredecessors: predecessorIds.size,
      currentF25TranslationHolds: [...f25.values()].filter(row => !row.authorized && !predecessorIds.has(row.recipe_id)).length,
      historicalF25TranslationHolds: [...f25.values()].filter(row => !row.authorized && predecessorIds.has(row.recipe_id)).length,
      publicOriginalGk: countBy(publicFi, row => row.glycemicLoadStatus.publicOriginal?.status ?? (gkPending.has(row.sourceRecipeId) ? "PENDING REVIEW" : "NO PUBLIC DISPOSITION")),
      auditOriginalGk: countBy(inputs.glycemic.results, row => row.status),
      approvedVersionScopes: countBy(inputs.glycemic.gkOnlyVariants, gkVariantScope),
      publicVersionScopes: countBy(inputs.publicVariants, gkVariantScope),
      publicNutrition: countBy(publicFi, row => row.nutritionStatus),
    },
  };
}

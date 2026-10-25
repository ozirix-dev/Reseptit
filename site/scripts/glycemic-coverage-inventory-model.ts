export type CoverageStatus = "CALCULATED" | "INSUFFICIENT SOURCE DATA";

export interface CoverageBaselineRow {
  recipeId: string;
  status: CoverageStatus;
  glycemicLoadPerServing: number | null;
  recipeVersion: string;
  calculationInputVersion: string;
  calculationEvidenceVersion: string;
  blockers: string[];
}

export interface CoverageBaseline {
  sourceCommit: string;
  recipeCount: number;
  calculated: number;
  incomplete: number;
  giRecordCount: number;
  giTierCounts: Record<string, number>;
  nutritionAuditCounts: Record<string, number>;
  recipes: CoverageBaselineRow[];
}

export interface CoverageResult {
  recipeId: string;
  status: CoverageStatus;
  glycemicLoadPerServing: number | null;
  omittedAvailableCarbohydratePerServingG: number;
  blockers: string[];
  ingredients: Array<{
    name: string;
    grams: number | null;
    fineliRecordId: string | null;
    giRecordId: string | null;
    availableCarbohydratePerServingG: number | null;
    issues: string[];
  }>;
}

export interface CurrentCoverageInput {
  sourceCommit: string;
  baseline: CoverageBaseline;
  giRecordCount: number;
  giTierCounts: Record<string, number>;
  results: CoverageResult[];
  sourceHashes: Record<string, string>;
  calculationInputHashes: Record<string, string>;
  calculationEvidenceHashes: Record<string, string>;
  nutritionStatuses: Record<string, string>;
  currentRecipeStructures: Record<string, { sourcePath: string; servings: number; ingredients: Array<Record<string, unknown>>; cookingMethod: unknown }>;
  currentCalculationInputs: Record<string, { servings: number; ingredients: Array<Record<string, unknown>> }>;
  historicalStaleRecipeIds: string[];
}

const blockerRules: Array<{ category: string; label: string; pattern: RegExp; action: string }> = [
  { category: "STRUCTURE", label: "Reseptin rakennesidonta vanhentunut", pattern: /recipe structure differs/i, action: "Tarkista nykyinen reseptiversio ainesosa kerrallaan; päivitä syöte ja tiivisteet vasta lähdevertailun jälkeen." },
  { category: "INPUT", label: "GK-laskentasyötteen sidonta vanhentunut", pattern: /input must be reviewed/i, action: "Vertaa määriä, annoksia, valmistustiloja, lähde-ID:itä ja muunnoksia reseptin nykyiseen rakenteeseen." },
  { category: "EVIDENCE", label: "Ravintoarvo- tai GI-lähdesidonta vanhentunut", pattern: /source mapping and calculation must be reviewed/i, action: "Tarkista muuttunut lähdetietue ja sen soveltuvuus ainesosaan." },
  { category: "COMPOSITION", label: "Koostumus tai imeytyvä hiilihydraatti ratkaisematta", pattern: /source-matched composition|available carbohydrate is missing|unknown carbohydrate|not treated as zero|composition.*(?:missing|unresolved)/i, action: "Hanki lähde- ja tuotekohtainen koostumus; älä käsittele tuntematonta nollana." },
  { category: "MASS_PREPARATION", label: "Määrä-, massa- tai valmistustilamuunnos ratkaisematta", pattern: /mass conversion|portion mass|gram conversion|unit conversion|density|edible (?:fraction|weight|basis)|raw\/cooked|cooked\/raw|preparation retention|retention\/loss|amount (?:is|remains) unknown|weight is unclear|quantity error|unit or decimal error/i, action: "Varmenna reseptimäärä, syötävä massa, tilavuuspaino ja raaka/kypsä-perusta." },
  { category: "GI_MATCH", label: "GI:n ruoka- tai valmistusvastaavuus hylätty", pattern: /GI food family does not match|food\/preparation match lacks a rationale|food family|does not match the ingredient|unpublished, off-scale/i, action: "Tarkista ruoka-aineen perhe, valmistus ja GI-lähde; älä käytä perusteetonta analogiaa." },
  { category: "GI_MISSING", label: "GI-lähde puuttuu", pattern: /GI evidence is missing|no (?:suitable|exact published) GI (?:source|value)|no GI value|GI source.*(?:missing|not found)/i, action: "Etsi soveltuva julkaistu GI-lähde; älä keksi arvoa." },
  { category: "TOLERANCE", label: "Pienosuuksien kumulatiivinen toleranssi täyttyy", pattern: /cumulative omitted available carbohydrate|at or above the 2 g editorial tolerance/i, action: "Tarkista tunnetut pienosuudet nykyisen alle 1 g / alle 2 g -käytännön mukaan." },
];

function classifyBlocker(message: string): string {
  return blockerRules.find((rule) => rule.pattern.test(message))?.category ?? "OTHER";
}

function actionFor(message: string): string {
  return blockerRules.find((rule) => rule.pattern.test(message))?.action ?? "Selvitä estoviestin lähde ja dokumentoi ratkaisu.";
}

export function assertCoverageConsistency(results: CoverageResult[], expectedRecipeIds: string[]): void {
  const resultIds = results.map((result) => result.recipeId);
  if (new Set(resultIds).size !== resultIds.length) throw new Error("Current GK results contain duplicate recipe IDs.");
  if (resultIds.length !== expectedRecipeIds.length) throw new Error(`Expected ${expectedRecipeIds.length} current GK results; received ${resultIds.length}.`);
  const expected = new Set(expectedRecipeIds);
  const unexpected = resultIds.filter((recipeId) => !expected.has(recipeId));
  const missing = expectedRecipeIds.filter((recipeId) => !resultIds.includes(recipeId));
  if (unexpected.length || missing.length) throw new Error(`Current GK recipe set differs from the source corpus. Missing: ${missing.join(", ")}; unexpected: ${unexpected.join(", ")}.`);
}

export function buildBaselineSnapshot(input: Omit<CurrentCoverageInput, "baseline" | "historicalStaleRecipeIds" | "currentRecipeStructures" | "currentCalculationInputs"> & {
  giRecordCount: number;
  giTierCounts: Record<string, number>;
  nutritionAuditCounts: Record<string, number>;
}): CoverageBaseline {
  const recipeIds = input.results.map((result) => result.recipeId);
  assertCoverageConsistency(input.results, recipeIds);
  const recipes = input.results.map((result) => ({
    recipeId: result.recipeId,
    status: result.status,
    glycemicLoadPerServing: result.glycemicLoadPerServing,
    recipeVersion: input.sourceHashes[result.recipeId] ?? "",
    calculationInputVersion: input.calculationInputHashes[result.recipeId] ?? "",
    calculationEvidenceVersion: input.calculationEvidenceHashes[result.recipeId] ?? "",
    blockers: [...result.blockers],
  }));
  return {
    sourceCommit: input.sourceCommit,
    recipeCount: recipes.length,
    calculated: recipes.filter((recipe) => recipe.status === "CALCULATED").length,
    incomplete: recipes.filter((recipe) => recipe.status !== "CALCULATED").length,
    giRecordCount: input.giRecordCount,
    giTierCounts: input.giTierCounts,
    nutritionAuditCounts: input.nutritionAuditCounts,
    recipes,
  };
}

export function buildCurrentCoverageInventory(input: CurrentCoverageInput) {
  assertCoverageConsistency(input.results, input.baseline.recipes.map((row) => row.recipeId));
  const previousById = new Map(input.baseline.recipes.map((row) => [row.recipeId, row]));
  const rows = input.results.map((result) => {
    const previous = previousById.get(result.recipeId);
    if (!previous) throw new Error(`No approved baseline row exists for ${result.recipeId}.`);
    const blockers = result.blockers.map((message) => ({ category: classifyBlocker(message), message, nextAction: actionFor(message) }));
    const categorySet = [...new Set(blockers.map((blocker) => blocker.category))];
    const structureVersion = input.sourceHashes[result.recipeId] ?? "";
    const inputVersion = input.calculationInputHashes[result.recipeId] ?? "";
    const evidenceVersion = input.calculationEvidenceHashes[result.recipeId] ?? "";
    const changedBlockers = blockers.filter((blocker) => !previous.blockers.includes(blocker.message)).map((blocker) => blocker.message);
    const removedBlockers = previous.blockers.filter((message) => !result.blockers.includes(message));
    const incompleteIngredients = result.ingredients.filter((ingredient) => ingredient.issues.length || !ingredient.fineliRecordId || (!ingredient.giRecordId && (ingredient.availableCarbohydratePerServingG ?? 0) >= 1));
    return {
      recipeId: result.recipeId,
      recipeVersion: structureVersion,
      calculationInputVersion: inputVersion,
      calculationEvidenceVersion: evidenceVersion,
      status: result.status,
      nutritionStatus: input.nutritionStatuses[result.recipeId] ?? "MISSING",
      currentRecipeStructure: input.currentRecipeStructures[result.recipeId] ?? null,
      currentCalculationInput: input.currentCalculationInputs[result.recipeId] ?? null,
      glycemicLoadPerServing: result.glycemicLoadPerServing,
      omittedAvailableCarbohydratePerServingG: result.omittedAvailableCarbohydratePerServingG,
      previousApprovedStatus: previous.status,
      previousApprovedGlycemicLoadPerServing: previous.glycemicLoadPerServing,
      recipeVersionChanged: structureVersion !== previous.recipeVersion,
      calculationInputVersionChanged: inputVersion !== previous.calculationInputVersion,
      calculationEvidenceVersionChanged: evidenceVersion !== previous.calculationEvidenceVersion,
      blockers,
      blockingCategories: categorySet,
      primaryBlockingCategory: categorySet[0] ?? null,
      primaryBlockingReason: blockers[0]?.message ?? null,
      missingFoodAndGIRecords: incompleteIngredients.map((ingredient) => ({ name: ingredient.name, fineliRecordId: ingredient.fineliRecordId, giRecordId: ingredient.giRecordId, availableCarbohydratePerServingG: ingredient.availableCarbohydratePerServingG, issues: ingredient.issues })),
      nextActions: [...new Set(blockers.map((blocker) => blocker.nextAction))],
      suggestedNextWorkstream: categorySet.includes("STRUCTURE") || categorySet.includes("INPUT")
        ? "STRUCTURE_BINDING_REVIEW"
        : categorySet.includes("COMPOSITION") || categorySet.includes("MASS_PREPARATION")
          ? "COMPOSITION_OR_CONVERSION"
          : categorySet.includes("GI_MATCH") || categorySet.includes("GI_MISSING")
            ? "GI_SOURCE_REVIEW"
            : "MANUAL_TRIAGE",
      statusChanged: result.status !== previous.status,
      newlyCalculated: previous.status !== "CALCULATED" && result.status === "CALCULATED",
      newlyBlocked: previous.status === "CALCULATED" && result.status !== "CALCULATED",
      stillIncomplete: previous.status !== "CALCULATED" && result.status !== "CALCULATED",
      changedBlockers,
      removedBlockers,
    };
  });

  const structuralRows = input.historicalStaleRecipeIds.map((recipeId) => {
    const row = rows.find((candidate) => candidate.recipeId === recipeId);
    if (!row) throw new Error(`Historical stale-binding recipe is missing from current corpus: ${recipeId}`);
    const currentResult = input.results.find((result) => result.recipeId === recipeId)!;
    const otherBlockers = row.blockers.filter((blocker) => !["STRUCTURE", "INPUT", "EVIDENCE"].includes(blocker.category));
    return {
      recipeId,
      currentStatus: row.status,
      nutritionStatus: row.nutritionStatus,
      recipeVersion: row.recipeVersion,
      calculationInputVersion: row.calculationInputVersion,
      inputIngredientCount: currentResult.ingredients.length,
      currentRecipeStructure: row.currentRecipeStructure,
      currentCalculationInput: row.currentCalculationInput,
      otherBlockingCategories: [...new Set(otherBlockers.map((blocker) => blocker.category))],
      otherBlockers: otherBlockers.map((blocker) => blocker.message),
      hasNonStructuralBlockers: otherBlockers.length > 0,
      currentlyPublishableAfterBindingOnly: otherBlockers.length === 0,
    };
  });
  const counted = (predicate: (row: typeof rows[number]) => boolean) => rows.filter(predicate).length;
  const categories = Object.fromEntries(blockerRules.map((rule) => [rule.category, {
    recipes: rows.filter((row) => row.blockingCategories.includes(rule.category)).length,
    blockerMessages: rows.reduce((sum, row) => sum + row.blockers.filter((blocker) => blocker.category === rule.category).length, 0),
  }]));
  return {
    generatedAt: new Date().toISOString(),
    sourceCommit: input.sourceCommit,
    previousApprovedBaseline: {
      sourceCommit: input.baseline.sourceCommit,
      recipeCount: input.baseline.recipeCount,
      calculated: input.baseline.calculated,
      incomplete: input.baseline.incomplete,
      giRecordCount: input.baseline.giRecordCount,
      giTierCounts: input.baseline.giTierCounts,
      nutritionAuditCounts: input.baseline.nutritionAuditCounts,
    },
    currentSummary: {
      recipeCount: rows.length,
      calculated: counted((row) => row.status === "CALCULATED"),
      incomplete: counted((row) => row.status !== "CALCULATED"),
      giRecordCount: input.giRecordCount,
      giTierCounts: input.giTierCounts,
      incompleteWithSupportedNutrition: rows.filter((row) => row.status !== "CALCULATED" && row.nutritionStatus === "ESTIMATE WITH EVIDENCE").length,
      incompleteNutritionNeedsReview: rows.filter((row) => row.status !== "CALCULATED" && row.nutritionStatus === "INSUFFICIENT SOURCE DATA").length,
      incompleteNutritionMissing: rows.filter((row) => row.status !== "CALCULATED" && row.nutritionStatus === "MISSING").length,
      newlyCalculated: counted((row) => row.newlyCalculated),
      newlyBlocked: counted((row) => row.newlyBlocked),
      stillIncomplete: counted((row) => row.stillIncomplete),
      changedBlockerRecipes: counted((row) => row.changedBlockers.length > 0 || row.removedBlockers.length > 0),
      newStructureMismatches: rows.filter((row) => row.recipeVersionChanged && row.blockingCategories.includes("STRUCTURE")).length,
      newInputMismatches: rows.filter((row) => row.calculationInputVersionChanged && row.blockingCategories.includes("INPUT")).length,
      newEvidenceMismatches: rows.filter((row) => row.calculationEvidenceVersionChanged && row.blockingCategories.includes("EVIDENCE")).length,
    },
    blockerOverlapCounts: categories,
    historicalStructuralBindingCount: input.historicalStaleRecipeIds.length,
    structuralBindingAnalysis: {
      rows: structuralRows,
      withOtherBlockers: structuralRows.filter((row) => row.hasNonStructuralBlockers).length,
      potentiallyPublishableAfterBindingOnly: structuralRows.filter((row) => row.currentlyPublishableAfterBindingOnly).length,
    },
    recipes: rows,
  };
}

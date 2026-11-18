import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { IngredientPortion, PortionEvidence, LocalizedText, VerbalGk } from "../src/features/recipes/gk-portion";
import type { RecipeEntry } from "../src/types/content";
import { parseMarkdown } from "../src/content/markdown";
import { recipeBindingHash } from "./glycemic-load-recipe-binding";
import { calculate, type Calculation, type FoodRecord } from "./nutrition-model";
import { verifyNutritionEvidence } from "./nutrition-evidence";
import { isRecoveryEvidence } from "./gk80-uunikanapasta";
import { isScopedPolyolEvidence } from "./gk80-polyol-c";

type CompositionMatch = { index: number; record: FoodRecord; state: string; matchEvidence: string };
type NutritionRecipe = Parameters<typeof verifyNutritionEvidence>[0];

interface ReviewedPortion {
  recipeBindingSha256: string;
  preparationSha256?: string;
  ingredientPortion?: {
    index: number;
    ingredientSha256: string;
    labels: LocalizedText;
    unit: IngredientPortion["unit"];
    sourceReview?: { file: string; sha256: string };
    availableCarbsGPer100g?: number;
    declaredCarbsGPer100g?: number;
    carbohydrateAlternatives?: { label: LocalizedText; availableCarbsGPer100g: number; source: string }[];
  };
  alternativeLabels?: Record<string, LocalizedText>;
  versionAlternativeLabels?: { versionId: string; lower: LocalizedText; upper: LocalizedText };
  ingredientProduct?: { index: number; item: string; amount: number; unit: string; ean: string };
  declaredLabelIngredientIndices?: number[];
  reasoning: string;
  reviewedAt: string;
  verbalNoteEdits?: Partial<Record<keyof LocalizedText, { before: string; after: string }>>;
  wholeCarbohydrateOnly?: {
    compositionMatches?: CompositionMatch[];
    preparationChoices?: { index: number; choices: (Omit<CompositionMatch, "index"> & { label: LocalizedText })[] };
    noteEdits?: Partial<Record<keyof LocalizedText, { before: string; after: string }>>;
    localizedScopeSha256?: Partial<LocalizedText>;
  };
  portionGrams?: number;
  knownCarbIngredient?: string;
  nutritionSha256?: string;
  source: string;
  publicSource?: string;
  piecesPerServing?: number;
  condition?: LocalizedText;
  classLimitation?: LocalizedText;
  verbal?: VerbalGk;
  zeroCarbohydrate?: true;
}

function hash(text: string) {
  return createHash("sha256").update(text.replaceAll("\r\n", "\n")).digest("hex");
}

export function wholeCarbohydrateLocaleHash(recipe: Pick<RecipeEntry, "servings" | "ingredients" | "kitchenIngredients" | "instructionsHtml" | "notesHtml">): string {
  return hash(JSON.stringify({
    servings: recipe.servings,
    ingredients: recipe.kitchenIngredients ?? recipe.ingredients,
    instructions: recipe.instructionsHtml,
    notes: recipe.notesHtml,
  }));
}

/** Product notes, preparation and serving instructions can change even when
 * the older ingredient-based GK binding stays identical. */
export function portionPreparationHash(markdown: string): string {
  const parsed = parseMarkdown(markdown)!;
  const sections = parsed.content.split(/^##[ \t]+/m).slice(1).filter(section =>
    /^(?:Valmistus|Muistiinpanot|Huomioita|Annostus)[ \t]*$/m.test(section.split(/\r?\n/, 1)[0]));
  const notes = (parsed.data.ingredients as { note?: string }[]).map(ingredient => ingredient.note ?? "");
  const normalize = (text: string) => text.normalize("NFC").replace(/\s+/g, " ").trim();
  return hash(JSON.stringify([...notes, ...sections].map(normalize)));
}

function httpsSource(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

function validCarbohydrateRate(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100;
}

function distinctChoiceLabels(choices: { label: LocalizedText }[]): boolean {
  return choices.length >= 2 && (["fi", "en", "sv", "th"] as const).every(locale => {
    const labels = choices.map(choice => choice.label[locale]?.trim());
    return labels.every(Boolean) && new Set(labels).size === labels.length;
  });
}

function applyCompositionMatches(input: Calculation, matches: CompositionMatch[], labelIndices: number[]) {
  const indices = [...labelIndices, ...matches.map(match => match.index)];
  if (indices.length && (input.publicationStatus !== "WITHHELD_SOURCE_INCOMPLETE"
      || new Set(indices).size !== indices.length
      || indices.some(index => !Number.isInteger(index) || !input.ingredients[index]))) {
    throw new Error(`${input.recipeId}: invalid reviewed portion composition indices or publication status.`);
  }
  if (matches.length === 0) return input;
  const ingredients = [...input.ingredients];
  for (const { index, record, state, matchEvidence } of matches) {
    if (!record || !httpsSource(record.sourceUrl) || !state?.trim() || !matchEvidence?.trim()) {
      throw new Error(`${input.recipeId}: a reviewed composition match requires a source and preparation evidence.`);
    }
    ingredients[index] = { ...ingredients[index], record, state, matchEvidence };
  }
  return { ...input, ingredients };
}

function portionFromNutrition(data: NutritionRecipe, input: Calculation, standalone: boolean) {
  // These two approved methodologies have separate accounting scopes.
  if (isRecoveryEvidence(input) || isScopedPolyolEvidence(input)) return null;
  const verified = verifyNutritionEvidence(data, input);
  if (verified.errors.length) return null;
  const calculation = calculate(input);
  // A carbohydrate-only estimate needs evidence for every row, including a
  // zero-carbohydrate bound for any excluded ingredient.
  const standaloneAmounts = standalone && input.publicationStatus === "WITHHELD_SOURCE_INCOMPLETE"
    ? calculation.rows.map((row, index) => {
      const ingredient = input.ingredients[index];
      if (ingredient.excludedReason) {
        return Boolean(ingredient.omissionImpactEvidence?.trim())
          && ingredient.omissionImpactUpperBoundPerServing?.netCarbohydrate === 0
          && ingredient.omissionImpactUpperBoundPerServing.totalCarbohydrate === 0 ? 0 : null;
      }
      // Normalization handles unknown fibre and polyols for each source basis.
      return row.issues.every(issue => /^Unknown nutrient (fat|protein|fibre|polyols|netCarbohydrate)$/.test(issue))
        ? row.values.carbohydrate : null;
    }) : undefined;
  const complete = standalone ? standaloneAmounts?.every(value => value !== null) : verified.status === "ESTIMATE WITH EVIDENCE";
  const available = complete ? calculation.perServing.carbohydrate : null;
  const amounts = standaloneAmounts ?? calculation.rows.map(row => row.issues.length === 0 ? row.values.carbohydrate : null);
  const max = Math.max(0, ...amounts.map(value => value ?? 0));
  const sum = amounts.reduce<number>((total, value) => total + (value ?? 0), 0);
  const driver = max > 0 ? { ingredientIndex: amounts.indexOf(max), coversMajority: available !== null && max > sum / 2 } : undefined;
  return { available, driver, zeroCarbohydrate: available === 0 && amounts.length > 0 && amounts.every(value => value === 0) };
}

export async function loadReviewedPortions(root: string): Promise<Record<string, ReviewedPortion>> {
  return JSON.parse(await readFile(path.join(root, "docs/nutrition/gk-reviewed-portions.json"), "utf8"));
}

export async function projectPortionEvidence(root: string, recipeId: string, markdown: string, review?: ReviewedPortion) {
  const data = parseMarkdown(markdown)!.data as NutritionRecipe;
  const portion: PortionEvidence = {};
  let zeroCarbohydrate = false;
  if (review && (review.recipeBindingSha256 !== recipeBindingHash(markdown) || !httpsSource(review.source)
      || (review.publicSource && !httpsSource(review.publicSource)) || !review.reasoning)) {
    throw new Error(`${recipeId}: reviewed GK portion no longer matches the recipe. Re-review the amount, preparation and sides.`);
  }
  if (review && (review.verbal || review.condition || review.ingredientProduct || review.classLimitation
      || review.ingredientPortion || review.alternativeLabels || review.versionAlternativeLabels
      || review.zeroCarbohydrate || review.wholeCarbohydrateOnly || review.declaredLabelIngredientIndices
      || review.portionGrams || review.piecesPerServing)
      && review.preparationSha256 !== portionPreparationHash(markdown)) {
    throw new Error(`${recipeId}: reviewed preparation or serving notes changed; re-review the public portion information.`);
  }
  const file = path.join(root, "docs/nutrition/calculations", recipeId + ".json");
  const raw = await readFile(file, "utf8").catch((error: NodeJS.ErrnoException) => {
    if (error.code === "ENOENT") return null;
    throw error;
  });
  if (review?.nutritionSha256 && (!raw || review.nutritionSha256 !== hash(raw))) {
    throw new Error(`${recipeId}: reviewed GK portion's nutrition evidence changed and requires review.`);
  }
  if (review?.verbalNoteEdits && !review.verbal) {
    throw new Error(`${recipeId}: a numerical-only GK notice requires a current verbal estimate.`);
  }
  const standaloneReview = review?.wholeCarbohydrateOnly;
  if (standaloneReview && (!review.nutritionSha256 || review.verbal || review.zeroCarbohydrate || !review.condition?.fi?.trim())) {
    throw new Error(`${recipeId}: standalone carbohydrate evidence requires reviewed nutrition, serving scope and no GK promotion.`);
  }
  if (review?.declaredLabelIngredientIndices && (!raw || !review.nutritionSha256)) {
    throw new Error(`${recipeId}: a carbohydrate label correction requires the pinned nutrition evidence.`);
  }
  if (raw) {
    const input = JSON.parse(raw) as Calculation;
    const labelIndices = review?.declaredLabelIngredientIndices ?? [];
    const matches = standaloneReview?.compositionMatches ?? [];
    // Amend only the portion view. Macro and GK approvals still use the original evidence.
    const reviewedInput = applyCompositionMatches(input, matches, labelIndices);
    for (const index of labelIndices) {
      const record = input.ingredients[index].record;
      if (!record || record.licence !== "Manufacturer's published product information"
          || record.carbohydrateDefinition !== "EU_AVAILABLE") {
        throw new Error(`${recipeId}: the carbohydrate label correction requires a previously misclassified manufacturer record.`);
      }
      record.carbohydrateDefinition = "EU_TOTAL_INCLUDING_POLYOLS";
    }
    const preparations = standaloneReview?.preparationChoices;
    if (preparations) {
      const { index, choices } = preparations;
      if (review?.ingredientPortion?.index !== index
          || matches.some(match => match.index === index) || !distinctChoiceLabels(choices)
          || new Set(choices.map(choice => choice.record?.sourceUrl)).size !== choices.length) {
        throw new Error(`${recipeId}: whole-portion preparations require distinct labels and sources for the same ingredient.`);
      }
      const ingredientChoices = review?.ingredientPortion?.carbohydrateAlternatives;
      if (ingredientChoices && (ingredientChoices.length !== choices.length || ingredientChoices.some((ingredient, i) => {
        const record = choices[i].record;
        return record?.sourceUrl !== ingredient.source || record.carbohydrateDefinition !== "EU_AVAILABLE"
          || record.per100g.carbohydrate !== ingredient.availableCarbsGPer100g;
      }))) {
        throw new Error(`${recipeId}: ingredient and whole-portion preparations must agree on composition evidence.`);
      }
      const scenarios = choices.map(({ label, ...match }) => {
        const candidate = applyCompositionMatches(reviewedInput, [{ index, ...match }], labelIndices);
        const result = portionFromNutrition(data, candidate, true);
        if (!result || result.available === null) {
          throw new Error(`${recipeId}: whole-portion preparation requires evidence for every ingredient.`);
        }
        return { label, source: match.record.sourceUrl, availableCarbsGPerServing: result.available };
      });
      const amounts = scenarios.map(choice => choice.availableCarbsGPerServing);
      portion.availableCarbs = { min: Math.min(...amounts), max: Math.max(...amounts) };
      portion.wholeCarbohydrateChoices = scenarios;
    } else {
      const result = portionFromNutrition(data, reviewedInput, Boolean(standaloneReview));
      if (result) {
        if (result.available !== null) portion.availableCarbs = { min: result.available, max: result.available };
        if (result.driver) portion.driver = result.driver;
        zeroCarbohydrate = review?.zeroCarbohydrate === true && result.zeroCarbohydrate;
      }
    }
  }
  if (review?.wholeCarbohydrateOnly && !portion.availableCarbs) {
    throw new Error(`${recipeId}: reviewed standalone carbohydrate requires evidence for every ingredient.`);
  }
  if (review?.zeroCarbohydrate && !zeroCarbohydrate) throw new Error(`${recipeId}: exact zero carbohydrate is no longer supported.`);
  if (review?.verbal) {
    if (!review.nutritionSha256 || !portion.availableCarbs) throw new Error(`${recipeId}: verbal GK requires reviewed whole-portion carbohydrate evidence.`);
    portion.verbal = review.verbal;
  }
  if (review?.ingredientPortion) {
    const { index, ingredientSha256, labels, unit, sourceReview, availableCarbsGPer100g, declaredCarbsGPer100g,
      carbohydrateAlternatives } = review.ingredientPortion;
    const ingredient = data.ingredients[index];
    if (!["g", "kpl", "arkkia"].includes(unit) || !ingredient || ingredient.unit !== unit || typeof ingredient.amount !== "number"
        || !Number.isFinite(ingredient.amount) || ingredient.amount <= 0
        || !Number.isInteger(data.servings) || data.servings <= 0
        || hash(JSON.stringify(ingredient)) !== ingredientSha256
        || !(["fi", "en", "sv", "th"] as const).every(locale => labels[locale]?.trim())) {
      throw new Error(`${recipeId}: reviewed partial ingredient amount no longer matches the recipe.`);
    }
    if (sourceReview) {
      if (!/^docs\/reviews\/[a-z0-9-]+\.md$/.test(sourceReview.file)
        || hash(await readFile(path.join(root, sourceReview.file), "utf8")) !== sourceReview.sha256) {
        throw new Error(`${recipeId}: source review for the partial ingredient changed.`);
      }
    }
    const amountPerServing = ingredient.amount / data.servings;
    portion.ingredientPortion = { name: labels, amountPerServing, unit };
    if (portion.driver?.ingredientIndex === index && !portion.driver.coversMajority) delete portion.driver;
    const carbsGPer100g = availableCarbsGPer100g ?? declaredCarbsGPer100g;
    if (availableCarbsGPer100g !== undefined || declaredCarbsGPer100g !== undefined) {
      if (carbohydrateAlternatives || (availableCarbsGPer100g !== undefined && declaredCarbsGPer100g !== undefined)) {
        throw new Error(`${recipeId}: partial ingredient carbohydrate must use one composition basis.`);
      }
      if (unit !== "g" || !validCarbohydrateRate(carbsGPer100g)) {
        throw new Error(`${recipeId}: invalid partial ingredient carbohydrate composition.`);
      }
      const carbsGPerServing = amountPerServing * carbsGPer100g / 100;
      if (availableCarbsGPer100g !== undefined) portion.ingredientPortion.availableCarbsGPerServing = carbsGPerServing;
      else portion.ingredientPortion.declaredCarbsGPerServing = carbsGPerServing;
    }
    if (carbohydrateAlternatives) {
      if (unit !== "g" || !distinctChoiceLabels(carbohydrateAlternatives) || !carbohydrateAlternatives.every(choice =>
        validCarbohydrateRate(choice.availableCarbsGPer100g) && httpsSource(choice.source))) {
        throw new Error(`${recipeId}: invalid partial ingredient carbohydrate alternatives.`);
      }
      portion.ingredientPortion.carbohydrateAlternatives = carbohydrateAlternatives.map(choice => ({
        label: choice.label, source: choice.source,
        availableCarbsGPerServing: amountPerServing * choice.availableCarbsGPer100g / 100,
      }));
    }
  }
  if (review?.ingredientProduct) {
    const { index, item, amount, unit, ean } = review.ingredientProduct;
    const ingredient = data.ingredients[index];
    if (!ingredient || ingredient.item !== item || ingredient.amount !== amount || ingredient.unit !== unit
        || !/^\d{13}$/.test(ean) || !ingredient.note?.includes(ean)) {
      throw new Error(`${recipeId}: product note does not match the reviewed ingredient and barcode.`);
    }
    portion.driver ??= { ingredientIndex: index, coversMajority: false };
  }
  if (review) portion.reviewedSource = review.publicSource ?? review.source;
  if (review?.classLimitation) portion.classLimitation = review.classLimitation;
  if (review?.condition) portion.condition = review.condition;
  if (review?.portionGrams) portion.gramsPerServing = review.portionGrams;
  if (review?.piecesPerServing) portion.piecesPerServing = review.piecesPerServing;
  return { portion, zeroCarbohydrate, source: review?.source };
}

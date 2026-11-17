import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { PortionEvidence, LocalizedText, VerbalGk } from "../src/features/recipes/gk-portion";
import { parseMarkdown } from "../src/content/markdown";
import { recipeBindingHash } from "./glycemic-load-recipe-binding";
import { calculate, type Calculation } from "./nutrition-model";
import { verifyNutritionEvidence } from "./nutrition-evidence";
import { isRecoveryEvidence } from "./gk80-uunikanapasta";
import { isScopedPolyolEvidence } from "./gk80-polyol-c";

interface ReviewedPortion {
  recipeBindingSha256: string;
  preparationSha256?: string;
  ingredientProduct?: { index: number; item: string; amount: number; unit: string; ean: string };
  reasoning: string;
  reviewedAt: string;
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

export async function loadReviewedPortions(root: string): Promise<Record<string, ReviewedPortion>> {
  return JSON.parse(await readFile(path.join(root, "docs/nutrition/gk-reviewed-portions.json"), "utf8"));
}

export async function projectPortionEvidence(root: string, recipeId: string, markdown: string, review?: ReviewedPortion) {
  const data = parseMarkdown(markdown)!.data as Parameters<typeof verifyNutritionEvidence>[0];
  const portion: PortionEvidence = {};
  let zeroCarbohydrate = false;
  if (review && (review.recipeBindingSha256 !== recipeBindingHash(markdown) || !httpsSource(review.source)
      || (review.publicSource && !httpsSource(review.publicSource)) || !review.reasoning)) {
    throw new Error(`${recipeId}: reviewed GK portion no longer matches the recipe. Re-review the amount, preparation and sides.`);
  }
  if (review && (review.verbal || review.condition || review.ingredientProduct || review.classLimitation
      || review.zeroCarbohydrate || review.portionGrams || review.piecesPerServing)
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
  if (raw) {
    const input = JSON.parse(raw) as Calculation;
    // These two approved methodologies have separate accounting scopes.
    if (!isRecoveryEvidence(input) && !isScopedPolyolEvidence(input)) {
      const verified = verifyNutritionEvidence(data, input);
      if (!verified.errors.length) {
        const calculation = calculate(input);
        const available = verified.status === "ESTIMATE WITH EVIDENCE" ? calculation.perServing.carbohydrate : null;
        if (available !== null) portion.availableCarbs = { min: available, max: available };
        const amounts = calculation.rows.map(row => row.issues.length === 0 ? row.values.carbohydrate : null);
        const max = Math.max(0, ...amounts.map(value => value ?? 0));
        if (max > 0) {
          const sum = amounts.reduce<number>((accumulated, value) => accumulated + (value ?? 0), 0);
          portion.driver = { ingredientIndex: amounts.indexOf(max), coversMajority: available !== null && max > sum / 2 };
        }
        zeroCarbohydrate = review?.zeroCarbohydrate === true && available === 0
          && amounts.length > 0 && amounts.every(value => value === 0);
      }
    }
  }
  if (review?.zeroCarbohydrate && !zeroCarbohydrate) throw new Error(`${recipeId}: exact zero carbohydrate is no longer supported.`);
  if (review?.verbal) {
    if (!review.nutritionSha256 || !portion.availableCarbs) throw new Error(`${recipeId}: verbal GK requires reviewed whole-portion carbohydrate evidence.`);
    portion.verbal = review.verbal;
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

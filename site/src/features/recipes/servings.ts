import type { RecipeIngredient, RecipeLocale } from "../../types/content";

export function nextServingCount(current: number, change: number): number {
  return Math.max(1, Math.trunc(current) + Math.trunc(change));
}

export function scaleIngredient(ingredient: RecipeIngredient, servings: number, baseServings: number): RecipeIngredient {
  if (ingredient.amount === null) return ingredient;
  return { ...ingredient, amount: ingredient.amount * Math.max(1, servings) / baseServings };
}

export function formatIngredientAmount(amount: number | null, servings: number, baseServings: number, locale: string): string {
  if (amount === null) return "";
  const scaled = amount * Math.max(1, servings) / baseServings;
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(scaled);
}

export const ingredientNumberLocales = { fi: "fi-FI", en: "en-GB", sv: "sv-SE", th: "th-TH" } as const;

const kitchenFractions: Readonly<Record<string, string>> = {
  "1/2": "½", "1/3": "⅓", "2/3": "⅔", "1/4": "¼", "3/4": "¾", "1/5": "⅕",
  "2/5": "⅖", "3/5": "⅗", "4/5": "⅘", "1/6": "⅙", "5/6": "⅚", "1/8": "⅛",
  "3/8": "⅜", "5/8": "⅝", "7/8": "⅞",
};

export function hasFractionalEgg(ingredient: RecipeIngredient, servings: number, original: number): boolean {
  return Boolean(ingredient.eggSingular && ingredient.amount !== null &&
    !Number.isInteger(ingredient.amount * servings / original));
}

function formatEggCount(numerator: number, denominator: number, locale: string): string {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator)) {
    return formatIngredientAmount(numerator, 1, denominator, locale);
  }
  const whole = Math.floor(numerator / denominator);
  const remainder = numerator % denominator;
  if (!remainder) return new Intl.NumberFormat(locale).format(whole);
  let a = remainder, b = denominator;
  while (b) [a, b] = [b, a % b];
  const fraction = `${remainder / a}/${denominator / a}`;
  return [whole || "", kitchenFractions[fraction] ?? fraction].filter(Boolean).join(" ");
}

export function formatRecipeIngredient(
  ingredient: RecipeIngredient, servings: number, original: number, locale: RecipeLocale,
): string {
  const { amount, unit, item, eggSingular, eggWeightWithoutShellG, note } = ingredient;
  const numberLocale = ingredientNumberLocales[locale];
  if (amount === null) return note ? `${item}, ${note}` : item;
  const quantity = eggSingular
    ? formatEggCount(amount * servings, original, numberLocale)
    : formatIngredientAmount(amount, servings, original, numberLocale);
  const eggUnits = amount * servings;
  const singularEgg = eggUnits === original || (locale === "en" && eggWeightWithoutShellG !== undefined && eggUnits < original);
  const name = eggSingular && singularEgg ? eggSingular : item;
  const line = locale === "th" && eggSingular
    ? `${name} ${quantity} ${unit}`
    : [quantity, unit, name].filter(Boolean).join(" ");
  const weight = eggWeightWithoutShellG === undefined ? "" :
    formatIngredientAmount(eggWeightWithoutShellG, servings, original, numberLocale);
  const weighed = weight ? `${line} (${{
    fi: `${weight} g ilman kuorta`,
    en: `${weight} g without shells`,
    sv: `${weight} g utan skal`,
    th: `${weight} กรัม ไม่รวมเปลือก`,
  }[locale]})` : line;
  return note ? `${weighed}${locale === "th" ? " " : ", "}${note}` : weighed;
}

import type { RecipeIngredient } from "../../types/content";

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

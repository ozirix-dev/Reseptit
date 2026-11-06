import type { RecipeEntry } from "../types/content";

export function assertUniqueRecipes(recipes: RecipeEntry[]): void {
  const ids = new Set<string>();
  const routes = new Set<string>();
  for (const recipe of recipes) {
    const id = `${recipe.recipeId}:${recipe.locale}`;
    const route = `${recipe.locale}:${recipe.routePath}`;
    if (ids.has(id)) throw new Error(`Duplicate published recipe translation: ${id}`);
    if (routes.has(route)) throw new Error(`Duplicate published recipe URL: ${route}`);
    ids.add(id);
    routes.add(route);
  }
}

const nutritionCriticalIngredient = /(?:oil|ölj|olja|น้ำมัน|butter|voi|smör|เนย|ghee|sugar|soker|socker|น้ำตาล|honey|hunaja|honung|น้ำผึ้ง|sweetener|makeut|สารให้ความหวาน|syrup|siirappi|sirap|ซิรัป|sauce|kastike|sås|ซอส|pähkinät|pähkinöitä|nötter|nuts|peanuts?|walnuts?|ถั่วลิสง|เม็ดมะม่วง|seed|siemen|frö|เมล็ด|cheese|juusto|ost|ชีส|meat|liha|kött|เนื้อ|fish|kala|fisk|ปลา|chicken|broiler|kyckling|ไก่|topping|täyte|pålägg|ท็อปปิ้ง)/i;

// Existing published recipes are grandfathered until their next nutrition edit.
// Exact matches keep this list from exempting new ingredient wording or recipes.
const legacyUnquantifiedCriticalIngredients = new Set([
  "kaakao-kookos-chia:makeutusainetta maun mukaan",
  "marjainen-chiavanukas:makeutusainetta maun mukaan",
  "rahka-marjakerroskulho:makeutusainetta maun mukaan",
  "italian-pata:oliiviöljyä",
  "raejuusto-uunimunakas:voita",
  "keto-kauralesesampylat:seesaminsiemeniä",
]);

export function assertQuantifiedCriticalIngredients(recipes: RecipeEntry[]): void {
  const errors: string[] = [];
  for (const recipe of recipes) {
    if (recipe.locale !== "fi") continue;
    for (const ingredient of recipe.ingredients) {
      if (ingredient.amount !== null && ingredient.unit.trim()) continue;
      if (!nutritionCriticalIngredient.test(ingredient.item)) continue;
      const key = `${recipe.recipeId}:${ingredient.item}`;
      if (!legacyUnquantifiedCriticalIngredients.has(key)) {
        errors.push(`${recipe.recipeId}: ${ingredient.item} needs a numeric amount and unit`);
      }
    }
  }
  if (errors.length) throw new Error(`Unquantified nutrition-critical ingredients:\n${errors.join("\n")}`);
}


/**
 * Extra publication guard for the new snack category. Drafts remain freely
 * editable under docs/reviews; published snacks need real image metadata and
 * all four independently auditable macro values. GK is intentionally optional:
 * unknown GI evidence never becomes a fabricated zero.
 */
export type SnackPublicationCandidate = {
  recipe_id: string;
  category: string;
  status: string;
  image?: { src: string; alt: string; width: number; height: number };
  ingredients: Array<{ amount: number | null; unit: string; item: string }>;
  carbs_net_per_serving_g?: number | null;
  carbs_total_per_serving_g?: number | null;
  protein_per_serving_g?: number | null;
  fat_per_serving_g?: number | null;
};

export function snackPublicationErrors(recipe: SnackPublicationCandidate): string[] {
  if (recipe.category !== "valipala" || recipe.status !== "published") return [];
  const errors: string[] = [];
  if (!recipe.image) {
    errors.push("published snack must have an approved WebP image");
  } else {
    if (!recipe.image.src.startsWith("valipalat/") || !recipe.image.src.endsWith(".webp")) {
      errors.push("published snack image must be stored under kuvat/valipalat/");
    }
    if (recipe.image.width < 1200 || recipe.image.height < 675) {
      errors.push("published snack image must be at least 1200x675");
    }
    if (!recipe.image.alt.trim()) errors.push("published snack image needs descriptive alt text");
  }
  const nutritionFields = [
    "carbs_net_per_serving_g",
    "carbs_total_per_serving_g",
    "protein_per_serving_g",
    "fat_per_serving_g",
  ] as const;
  for (const key of nutritionFields) {
    if (typeof recipe[key] !== "number" || !Number.isFinite(recipe[key]) || recipe[key]! < 0) {
      errors.push(`published snack needs source-backed ${key}`);
    }
  }
  if (recipe.carbs_total_per_serving_g != null && recipe.carbs_net_per_serving_g != null &&
      recipe.carbs_total_per_serving_g < recipe.carbs_net_per_serving_g) {
    errors.push("published snack has total carbohydrates below net carbohydrates");
  }
  for (const [index, ingredient] of recipe.ingredients.entries()) {
    if (ingredient.amount === null || !ingredient.unit.trim()) {
      errors.push(`published snack ingredient ${index + 1} needs a quantified amount and unit`);
    }
  }
  return errors;
}

export function assertSnackPublicationReady(recipe: SnackPublicationCandidate): void {
  const errors = snackPublicationErrors(recipe);
  if (errors.length) {
    throw new Error(`${recipe.recipe_id}: snack publication blocked:\n${errors.join("\n")}`);
  }
}

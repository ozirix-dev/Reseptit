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

/**
 * Offline recipe similarity review. Advisory only: never deletes recipes, changes
 * nutrition/GK evidence, or automatically approves an editorial submission.
 *
 * One candidate per recipe_id should be supplied by callers. Translations are
 * alternate representations of the same recipe, not independent dishes.
 */
export type SimilarityStatus = "NO_MATERIAL_MATCH" | "MATERIAL_DUPLICATE" | "UNCERTAIN";
export type MatchKind = "MATERIAL_DUPLICATE" | "POSSIBLE_DUPLICATE" | "POSSIBLE_VARIANT";
export type LibraryScope = "published" | "pending";

export interface SimilarityIngredient {
  item: string;
  amount: number | null;
  unit: string;
  note?: string;
}

export interface SimilarityRecipe {
  recipeId: string;
  title: string;
  locale: string;
  servings: number;
  ingredients: SimilarityIngredient[];
  instructions: string[];
  cookingMethods?: string[];
  category?: string;
  sourcePath?: string;
  sourceUrl?: string;
  scope?: LibraryScope;
}

export interface SimilarityMatch {
  recipeId: string;
  title: string;
  sourcePath?: string;
  scope: LibraryScope;
  kind: MatchKind;
  score: number;
  ingredientOverlap: number;
  quantitySimilarity: number | null;
  sharedIngredients: string[];
  differentIngredients: string[];
  reasons: string[];
  candidateRevision: string;
  matchedRevision: string;
}

export interface SimilarityAssessment {
  status: SimilarityStatus;
  candidateRecipeId: string;
  candidateRevision: string;
  comparedRecipes: number;
  matches: SimilarityMatch[];
  warnings: string[];
}

const aliases: readonly [RegExp, string][] = [
  [/(?:pofiber|perunakuitu|potato fiber)/i, "pofiber"],
  [/(?:kikhernejauho|chickpea flour|gram flour|besan)/i, "kikhernejauho"],
  [/(?:mantelijauho|almond flour|almond meal)/i, "mantelijauho"],
  [/(?:kookosjauho|coconut flour)/i, "kookosjauho"],
  [/(?:vehnäjauho|wheat flour|bread flour|vetemjöl)/i, "vehnäjauho"],
  [/(?:kaurajauho|oat flour|havremjöl)/i, "kaurajauho"],
  [/(?:riisijauho|rice flour)/i, "riisijauho"],
  [/(?:raejuusto|cottage cheese|keso)/i, "raejuusto"],
  [/(?:tuorejuusto|cream cheese|färskost)/i, "tuorejuusto"],
  [/(?:mozzarella)/i, "mozzarella"],
  [/(?:kananmunan keltuai|egg yolk|äggula)/i, "keltuainen"],
  [/(?:kananmuna|kananmunia|munaa ilman|egg|ägg|ไข่)/i, "kananmuna"],
  [/(?:voi(?:ta|lla|sula)?|butter|smör)/i, "voi"],
  [/(?:oliiviöljy|olive oil|olivolja)/i, "oliiviöljy"],
  [/(?:öljy|cooking oil|vegetable oil|น้ำมัน)/i, "öljy"],
  [/(?:kuivahiiva|tuorehiiva|yeast|jäst)/i, "hiiva"],
  [/(?:sokeri|sokeria|sugar|socker|น้ำตาล)/i, "sokeri"],
  [/(?:suola|suolaa|salt|เกลือ)/i, "suola"],
  [/(?:kookosmaito|coconut milk|kokosmjölk|กะทิ)/i, "kookosmaito"],
  [/(?:täysmaito|maitoa|milk|mjölk|นม)/i, "maito"],
  [/(?:vesi|vettä|water|vatten|น้ำเปล่า)/i, "vesi"],
  [/(?:seesaminsiemen|sesame seed|sesamfrö)/i, "seesaminsiemen"],
  [/(?:kananrinta|broilerin rinta|chicken breast)/i, "kananrinta"],
  [/(?:broileri|kananliha|chicken|kyckling|ไก่)/i, "kana"],
  [/(?:jauheliha|ground beef|minced meat|köttfärs)/i, "jauheliha"],
  [/(?:kerma|kermaa|cream|grädde)/i, "kerma"],
  [/(?:riisi|riisiä|rice|ข้าว)/i, "riisi"],
  [/(?:peruna|perunaa|potato|potatis)/i, "peruna"],
  [/(?:kurkku|kurkkua|cucumber|gurka|แตงกวา)/i, "kurkku"],
  [/(?:inkiväär|ginger|ingefära|ขิง)/i, "inkivääri"],
  [/(?:korianteri|korianteria|coriander|cilantro|ผักชี)/i, "korianteri"],
  [/(?:perunoita|peruna|potato|potatis|มันฝรั่ง)/i, "peruna"],
  [/(?:tomaattikastike|tomato sauce|passata)/i, "tomaattikastike"],
  [/(?:tomaatti|tomaat|tomato|tomat|มะเขือเทศ)/i, "tomaatti"],
  [/(?:valkosipuli|garlic|vitlök|กระเทียม)/i, "valkosipuli"],
  [/(?:sipuli|onion|lök|หัวหอม)/i, "sipuli"],
  [/(?:pinaatti|spinach|spenat|ผักโขม)/i, "pinaatti"],
  [/(?:kukkakaali|cauliflower|blomkål)/i, "kukkakaali"],
  [/(?:parsakaali|broccoli|broccoli)/i, "parsakaali"],
  [/(?:pasta|macaroni|spaghetti|makaroni)/i, "pasta"],
  [/(?:nuudeli|noodle|nudlar|เส้นก๋วยเตี๋ยว)/i, "nuudeli"],
  [/(?:soijakastike|soy sauce|sojasås|ซีอิ๊ว)/i, "soijakastike"],
  [/(?:sitruuna|lemon|citron|มะนาวเหลือง)/i, "sitruuna"],
  [/(?:limetti|lime|มะนาว)/i, "limetti"],
];

const methods: readonly [RegExp, string][] = [
  [/(?:tangzhong|esitaikina.*(?:kuumen|saken)|water roux)/i, "tangzhong"],
  [/(?:hapanjuur|sourdough|surdeg)/i, "hapanjuuri"],
  [/(?:höyryt|steam|ångkok|นึ่ง)/i, "höyrytys"],
  [/(?:uppopaist|deep.fry|ทอดน้ำมันท่วม)/i, "uppopaisto"],
  [/(?:wok|stir.fry|ผัด)/i, "wok"],
  [/(?:grill|ย่าง)/i, "grillaus"],
  [/(?:paist.*uun|uuni|oven|bake|อบ)/i, "uunipaisto"],
  [/(?:paist.*pann|fry|skillet|stegepanne|ทอด)/i, "pannupaisto"],
  [/(?:keit|simmer|boil|kok|ต้ม)/i, "keittäminen"],
  [/(?:haudut|brais|slow.cook|ตุ๋น)/i, "haudutus"],
  [/(?:vatka|whisk|visp)/i, "vatkaus"],
  [/(?:soseut|blend|purée|mixaa)/i, "soseutus"],
  [/(?:kohot|proof|rise|jäsa)/i, "kohotus"],
];

// Distinct final dish structures must not be mistaken for the same dish
// solely because flour, eggs, oil and spices overlap.
const dishForms: readonly [RegExp, string][] = [
  [/(?:sämpyl|briossi|burger bun|buns)/i, "sämpylä"],
  [/(?:pannukakku|pannari|serabi|baghrir|pancake)/i, "pannukakku"],
  [/(?:keksi|cookie|biscuit)/i, "keksi"],
  [/(?:kakku|cake|brownie)/i, "kakku"],
  [/(?:piirakka|pie|tart)/i, "piirakka"],
  [/(?:pizza|pitsa)/i, "pizza"],
  [/(?:tostada)/i, "tostada"],
  [/(?:taco)/i, "taco"],
  [/(?:samosa)/i, "samosa"],
  [/(?:paratha)/i, "paratha"],
  [/(?:fritter|pakora)/i, "fritter"],
  [/(?:munakas|omelette|omelet)/i, "munakas"],
  [/(?:puuro|congee|jok|juk|porridge)/i, "puuro"],
  [/(?:riisikulho|rice bowl|gyeranbap|jumeokbap)/i, "riisikulho"],
  [/(?:keitto|soup|pho[- ]|ramen)/i, "keitto"],
  [/(?:dumpling|jiaozi|gyoza|momo)/i, "myky"],
  [/(?:nuudel|noodle|laksa)/i, "nuudelit"],
  [/(?:gratiini|gratin)/i, "gratiini"],
  [/(?:salaatti|salad)/i, "salaatti"],
  [/(?:leipä|bread|msemen|roti)/i, "leipä"],
];

const structuralIngredients = new Set([
  "pofiber", "kikhernejauho", "mantelijauho", "kookosjauho",
  "vehnäjauho", "kaurajauho", "riisijauho", "raejuusto",
  "riisi", "peruna", "pasta", "nuudeli", "kukkakaali",
]);
const insignificantIngredients = new Set(["vesi", "suola"]);
const distinctiveMethods = new Set(["tangzhong", "hapanjuuri", "uppopaisto", "höyrytys", "wok", "grillaus"]);

function clean(value: string): string {
  return value.toLocaleLowerCase("fi").normalize("NFC").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

export function canonicalIngredient(value: string): string {
  const normalized = clean(value);
  // First-match order is intentional: a specific ingredient precedes a base ingredient.
  for (const [pattern, canonical] of aliases) {
    if (pattern.test(normalized)) return canonical;
  }
  return normalized.replace(/\b(?:hienonnettuna|kuutioituna|tuoreena|raastettuna|kypsänä)\b/g, "").trim();
}

function canonicalAmount(ingredient: SimilarityIngredient): { amount: number; unit: string } | null {
  const value = ingredient.amount;
  if (value === null || !Number.isFinite(value) || value < 0) return null;
  const unit = clean(ingredient.unit);
  const variants: Record<string, [number, string]> = {
    g: [1, "g"], gramma: [1, "g"], gram: [1, "g"], kg: [1000, "g"],
    ml: [1, "ml"], l: [1000, "ml"], dl: [100, "ml"], cl: [10, "ml"],
    kpl: [1, "kpl"], pcs: [1, "kpl"], piece: [1, "kpl"],
    tl: [1, "tl"], tsp: [1, "tl"], rkl: [1, "rkl"], tbsp: [1, "rkl"],
  };
  const conversion = variants[unit];
  return conversion ? { amount: value * conversion[0], unit: conversion[1] } : null;
}

interface IndexedIngredient {
  quantity: number | null;
  unit: string | null;
}

interface PreparedRecipe {
  recipe: SimilarityRecipe;
  items: Map<string, IndexedIngredient>;
  significant: Set<string>;
  methodSet: Set<string>;
  dishForm: string | null;
  revision: string;
  limited: boolean;
}

function revisionHash(value: string): string {
  // Deterministic change marker, not a cryptographic proof or security token.
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash = Math.imul(hash ^ value.charCodeAt(i), 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

const preparedCache = new WeakMap<SimilarityRecipe, PreparedRecipe>();

function prepare(recipe: SimilarityRecipe): PreparedRecipe {
  // Inputs are immutable recipe snapshots for the duration of each audit.
  const cached = preparedCache.get(recipe);
  if (cached) return cached;
  const items = new Map<string, IndexedIngredient>();
  let unknown = 0;
  for (const ingredient of recipe.ingredients) {
    const name = canonicalIngredient(ingredient.item);
    if (!name) continue;
    const amount = canonicalAmount(ingredient);
    if (!amount) unknown++;
    const previous = items.get(name);
    if (!previous) {
      items.set(name, { quantity: amount ? amount.amount / recipe.servings : null, unit: amount?.unit ?? null });
    } else if (amount && previous.quantity !== null && previous.unit === amount.unit) {
      previous.quantity += amount.amount / recipe.servings;
    } else {
      items.set(name, { quantity: null, unit: null });
    }
  }
  const methodText = [...recipe.instructions, ...(recipe.cookingMethods ?? [])].join(" ");
  const methodSet = new Set(methods.filter(([pattern]) => pattern.test(methodText)).map(([, name]) => name));
  const significant = new Set([...items.keys()].filter((name) => !insignificantIngredients.has(name)));
  const dishForm = dishForms.find(([pattern]) => pattern.test(recipe.title))?.[1] ?? null;
  const quantityKey = [...items].sort(([a], [b]) => a.localeCompare(b)).map(([name, item]) =>
    [name, item.unit ?? "?", item.quantity === null ? "?" : item.quantity.toFixed(5)].join(":")).join("|");
  const revision = revisionHash(quantityKey + "#" + [...methodSet].sort().join("|") + "#" + clean(recipe.title) + "#" + clean(methodText));
  const prepared: PreparedRecipe = {
    recipe, items, significant, methodSet, dishForm, revision,
    limited: significant.size < 2 || recipe.servings <= 0 || !Number.isFinite(recipe.servings) ||
      unknown > recipe.ingredients.length * 0.5,
  };
  preparedCache.set(recipe, prepared);
  return prepared;
}

function overlapRatio(left: Set<string>, right: Set<string>): number {
  if (!left.size && !right.size) return 0;
  const weights = (name: string) => structuralIngredients.has(name) ? 3 : 1;
  const all = new Set([...left, ...right]);
  let intersection = 0;
  let union = 0;
  for (const item of all) {
    const weight = weights(item);
    union += weight;
    if (left.has(item) && right.has(item)) intersection += weight;
  }
  return union ? intersection / union : 0;
}

function quantityRatio(a: PreparedRecipe, b: PreparedRecipe): number | null {
  const scores: number[] = [];
  for (const name of a.significant) {
    const left = a.items.get(name);
    const right = b.items.get(name);
    if (!left || !right || left.quantity === null || right.quantity === null ||
        left.unit !== right.unit) continue;
    if (left.quantity === 0 && right.quantity === 0) {
      scores.push(1);
      continue;
    }
    if (left.quantity <= 0 || right.quantity <= 0) {
      scores.push(0);
      continue;
    }
    scores.push(Math.min(left.quantity, right.quantity) / Math.max(left.quantity, right.quantity));
  }
  if (scores.length < 2) return null;
  return scores.reduce((sum, value) => sum + value, 0) / scores.length;
}

function methodRatio(a: PreparedRecipe, b: PreparedRecipe): number {
  if (!a.methodSet.size || !b.methodSet.size) return 0.5;
  const shared = [...a.methodSet].filter((method) => b.methodSet.has(method)).length;
  return shared / new Set([...a.methodSet, ...b.methodSet]).size;
}

function meaningfulDifference(a: PreparedRecipe, b: PreparedRecipe): string[] {
  const reasons: string[] = [];
  const distinctA = [...a.methodSet].filter((item) => distinctiveMethods.has(item) && !b.methodSet.has(item));
  const distinctB = [...b.methodSet].filter((item) => distinctiveMethods.has(item) && !a.methodSet.has(item));
  if (distinctA.length || distinctB.length) {
    reasons.push("Erityinen valmistusmenetelmä poikkeaa: " + [...distinctA, ...distinctB].join(", "));
  }
  const structureA = [...a.significant].filter((item) => structuralIngredients.has(item));
  const structureB = [...b.significant].filter((item) => structuralIngredients.has(item));
  if (structureA.length && structureB.length &&
      structureA.some((name) => !b.significant.has(name)) &&
      structureB.some((name) => !a.significant.has(name))) {
    reasons.push("Reseptien keskeiset rakenneainekset poikkeavat.");
  }
  return reasons;
}

function evaluate(a: PreparedRecipe, b: PreparedRecipe): SimilarityMatch | null {
  const ingredientOverlap = overlapRatio(a.significant, b.significant);
  const quantities = quantityRatio(a, b);
  const method = methodRatio(a, b);
  const differences = meaningfulDifference(a, b);
  const shared = [...a.significant].filter((name) => b.significant.has(name)).sort();
  const different = [...new Set([...a.significant, ...b.significant])].filter((name) =>
    !a.significant.has(name) || !b.significant.has(name)).sort();
  const titleA = new Set(clean(a.recipe.title).split(" ").filter((s) => s.length > 3));
  const titleB = new Set(clean(b.recipe.title).split(" ").filter((s) => s.length > 3));
  const titleOverlap = overlapRatio(titleA, titleB);
  const sourceMatch = Boolean(a.recipe.sourceUrl && b.recipe.sourceUrl &&
    a.recipe.sourceUrl === b.recipe.sourceUrl);
  if (a.dishForm && b.dishForm && a.dishForm !== b.dishForm) {
    // Very similar formulas may still merit review as clearly named variants.
    // Ordinary cake-vs-cookie or bread-vs-pancake matches are unhelpful noise.
    if (ingredientOverlap < 0.92 || quantities === null || quantities < 0.88) return null;
    differences.push("Ruokalajin lopputulos poikkeaa: " + a.dishForm + " / " + b.dishForm + ".");
  }
  if (ingredientOverlap < 0.52 && !(ingredientOverlap >= 0.4 && (titleOverlap > 0.7 || sourceMatch))) return null;
  const score = ingredientOverlap * 0.65 + (quantities ?? 0.5) * 0.25 + method * 0.1;
  const exactFormula = ingredientOverlap === 1 && quantities !== null && quantities > 0.995 &&
    method > 0.65 && differences.length === 0;
  const materiallySame = !a.limited && !b.limited && differences.length === 0 &&
    (exactFormula || (ingredientOverlap >= 0.84 && quantities !== null && quantities >= 0.88 && method >= 0.65));
  const kind: MatchKind = materiallySame ? "MATERIAL_DUPLICATE" :
    differences.length ? "POSSIBLE_VARIANT" : "POSSIBLE_DUPLICATE";
  const reasons: string[] = [
    "Yhteisiä olennaisia aineksia " + shared.length + "; painotettu ainesosayhtäläisyys " +
    Math.round(ingredientOverlap * 100) + " %.",
    quantities === null ? "Määräsuhteiden vertailu on puutteellinen." :
      "Annokselle normalisoitujen vertailukelpoisten määrien yhtäläisyys " + Math.round(quantities * 100) + " %.",
  ];
  if (sourceMatch) reasons.push("Sama ilmoitettu alkuperäis-URL (ei yksin osoita duplikaattia).");
  reasons.push(...differences);
  return {
    recipeId: b.recipe.recipeId,
    title: b.recipe.title,
    ...(b.recipe.sourcePath ? { sourcePath: b.recipe.sourcePath } : {}),
    scope: b.recipe.scope ?? "published", kind, score: Math.round(score * 1000) / 1000,
    ingredientOverlap: Math.round(ingredientOverlap * 1000) / 1000,
    quantitySimilarity: quantities === null ? null : Math.round(quantities * 1000) / 1000,
    sharedIngredients: shared, differentIngredients: different.slice(0, 15), reasons,
    candidateRevision: a.revision, matchedRevision: b.revision,
  };
}

/** Used by the CLI and, later, the authenticated T4 submission service. */
export function assessRecipeSimilarity(
  candidate: SimilarityRecipe,
  library: readonly SimilarityRecipe[],
  maxMatches = 8,
): SimilarityAssessment {
  const prepared = prepare(candidate);
  const unique = new Map<string, SimilarityRecipe>();
  for (const recipe of library) {
    if (!unique.has(recipe.recipeId) || (recipe.locale === "fi" && unique.get(recipe.recipeId)?.locale !== "fi")) {
      unique.set(recipe.recipeId, recipe);
    }
  }
  const matches: SimilarityMatch[] = [];
  let comparedRecipes = 0;
  for (const recipe of unique.values()) {
    if (recipe.recipeId === candidate.recipeId) continue; // translation/revision of same recipe
    comparedRecipes++;
    const match = evaluate(prepared, prepare(recipe));
    if (match) matches.push(match);
  }
  const kindRank: Record<MatchKind, number> = { MATERIAL_DUPLICATE: 0, POSSIBLE_DUPLICATE: 1, POSSIBLE_VARIANT: 2 };
  matches.sort((a, b) => kindRank[a.kind] - kindRank[b.kind] || b.score - a.score || a.recipeId.localeCompare(b.recipeId));
  const warnings = prepared.limited ? ["Reseptin tietosisältö ei riitä luotettavaan duplikaattipäätökseen."] : [];
  if (candidate.locale !== "fi") warnings.push("Ei-suomenkielisen syötteen sanastokattavuus on rajallinen; ihmistarkistus vaaditaan.");
  if (maxMatches < matches.length) warnings.push("Osumalistasta näytetään vain korkeimmat " + maxMatches + " osumaa.");
  const status: SimilarityStatus = matches.some((match) => match.kind === "MATERIAL_DUPLICATE") ?
    "MATERIAL_DUPLICATE" : matches.length || warnings.length ? "UNCERTAIN" : "NO_MATERIAL_MATCH";
  return {
    status, candidateRecipeId: candidate.recipeId, candidateRevision: prepared.revision,
    comparedRecipes, matches: matches.slice(0, Math.max(0, maxMatches)), warnings,
  };
}

/** All-pairs review; only matches are returned, avoiding a noisy OK row per recipe. */
export function auditRecipeLibrary(recipes: readonly SimilarityRecipe[]): SimilarityAssessment[] {
  const unique = new Map<string, SimilarityRecipe>();
  for (const recipe of recipes) {
    if (!unique.has(recipe.recipeId) || (recipe.locale === "fi" && unique.get(recipe.recipeId)?.locale !== "fi")) {
      unique.set(recipe.recipeId, recipe);
    }
  }
  const items = [...unique.values()].sort((a, b) => a.recipeId.localeCompare(b.recipeId));
  return items.map((item, index) => assessRecipeSimilarity(item, items.slice(index + 1)))
    .filter((result) => result.matches.length > 0);
}

/**
 * Service boundary for future user submissions. The internal result includes
 * pending IDs; NEVER serialize matches directly to an unauthenticated client.
 * Private saving is independent of this public-submission editorial gate.
 */
export function checkPublicRecipeSubmission(
  submission: SimilarityRecipe,
  published: readonly SimilarityRecipe[],
  pending: readonly SimilarityRecipe[],
): { internal: SimilarityAssessment; publicStatus: SimilarityStatus; publicMatches: Pick<SimilarityMatch, "recipeId" | "title" | "reasons">[] } {
  const internal = assessRecipeSimilarity(submission, [
    ...published.map((recipe) => ({ ...recipe, scope: "published" as const })),
    ...pending.map((recipe) => ({ ...recipe, scope: "pending" as const })),
  ]);
  // Pending-only material matches must not reveal whether another user has
  // submitted this formula. The client receives an ordinary review-required state.
  const hasVisibleMaterial = internal.matches.some((match) =>
    match.scope === "published" && match.kind === "MATERIAL_DUPLICATE");
  const publicStatus: SimilarityStatus = internal.status === "MATERIAL_DUPLICATE" && !hasVisibleMaterial ?
    "UNCERTAIN" : internal.status;
  return {
    internal, publicStatus,
    publicMatches: internal.matches.filter((match) => match.scope === "published").map((match) => ({
      recipeId: match.recipeId, title: match.title, reasons: match.reasons,
    })),
  };
}

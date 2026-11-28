import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { IngredientPortion, PortionEvidence, LocalizedText, SideCarbohydrate, VerbalGk } from "../src/features/recipes/gk-portion";
import type { RecipeEntry } from "../src/types/content";
import { parseMarkdown } from "../src/content/markdown";
import { recipeBindingHash } from "./glycemic-load-recipe-binding";
import { round, type Calculation, type FoodRecord, type IngredientInput } from "./nutrition-model";
import { verifyNutritionEvidence } from "./nutrition-evidence";
import { nutritionKeys, readNutritionFieldApproval } from "./nutrition-field-approval";
import { isRecoveryEvidence, loadRecovery } from "./gk80-uunikanapasta";
import { isScopedPolyolEvidence, loadScopedPolyolC } from "./gk80-polyol-c";

type CompositionMatch = { index: number } & Partial<Omit<IngredientInput, "item" | "amount" | "unit">>;
type NutritionRecipe = Parameters<typeof verifyNutritionEvidence>[0];

const scopedNetCarbohydrateCopy = {
  cabbage: {
    fi: "Nettohiilihydraatin malliarvio pätee, kun jaat koko ruoan kuuteen yhtä suureen annokseen ja mukana ovat kaikki valmistuksessa käytetyt nesteet, rasvat ja mausteet. Laske lisukkeet erikseen.",
    en: "The modeled net carb estimate applies when you divide the whole dish into six equal servings, including all cooking liquid, fat and seasonings. Count side dishes separately.",
    sv: "Modellberäkningen av nettokolhydrater gäller när du delar hela rätten i sex lika stora portioner, inklusive all kokvätska, allt fett och alla kryddor. Räkna tillbehör separat.",
    th: "ค่าประมาณคาร์โบไฮเดรตสุทธิจากแบบจำลองนี้ใช้เมื่อแบ่งอาหารทั้งหมดเป็น 6 ที่เท่า ๆ กัน โดยรวมของเหลวจากการปรุง ไขมัน และเครื่องปรุงทั้งหมด คิดคาร์โบไฮเดรตของเครื่องเคียงแยกต่างหาก",
  },
  pasta: {
    fi: "Nettohiilihydraatin malliarvio pätee, kun jaat koko punnitun reseptin neljään yhtä suureen annokseen ja mukana ovat kaikki ainekset ja paistonesteet. Laske lisukkeet erikseen.",
    en: "The modeled net carb estimate applies when you divide the whole weighed recipe into four equal servings, including all ingredients and cooking juices. Count side dishes separately.",
    sv: "Modellberäkningen av nettokolhydrater gäller när du delar hela det uppvägda receptet i fyra lika stora portioner, inklusive alla ingredienser och all steksky. Räkna tillbehör separat.",
    th: "ค่าประมาณคาร์โบไฮเดรตสุทธิจากแบบจำลองนี้ใช้เมื่อแบ่งอาหารที่ชั่งส่วนผสมตามสูตรเป็น 4 ที่เท่า ๆ กัน โดยรวมส่วนผสมและน้ำที่ออกมาระหว่างปรุงทั้งหมด คิดคาร์โบไฮเดรตของเครื่องเคียงแยกต่างหาก",
  },
} satisfies Record<string, LocalizedText>;

const sideFoods = {
  "fineli-30346-release-20": {
    name: { fi: "Keitetty pitkäjyväinen riisi", en: "Cooked long-grain rice", sv: "Kokt långkornigt ris", th: "ข้าวเมล็ดยาวที่หุงสุก" },
    weightsG: [50, 100, 150, 200],
  },
  "fineli-29208-release-20": {
    name: { fi: "Vehnäkuskus, kuivapaino", en: "Wheat couscous, dry weight", sv: "Vetecouscous, torrvikt", th: "คูสคูสข้าวสาลี น้ำหนักก่อนปรุง" },
    weightsG: [25, 50, 75, 100],
  },
} satisfies Record<string, Pick<SideCarbohydrate, "name" | "weightsG">>;

interface CountedRecipeIngredient {
  index: number;
  recipeFile: string;
  recipeSha256: string;
  calculationFile: string;
  calculationSha256: string;
  components: { availableCarbsGPer100g: number; source: string; gramsPerPiece?: number }[];
}

interface ReviewedIngredientPortion {
  index: number;
  ingredientSha256: string;
  labels: LocalizedText;
  unit: IngredientPortion["unit"];
  source?: string;
  sourceReview?: { file: string; sha256: string };
  availableCarbsGPer100g?: number;
  declaredCarbsGPer100g?: number;
  carbohydrateAlternatives?: { label: LocalizedText; availableCarbsGPer100g: number; source: string }[];
}

interface ReviewedPortion {
  recipeBindingSha256: string;
  preparationSha256?: string;
  ingredientPortion?: ReviewedIngredientPortion;
  additionalIngredientPortions?: ReviewedIngredientPortion[];
  alternativeLabels?: Record<string, LocalizedText>;
  versionAlternativeLabels?: { versionId: string; lower: LocalizedText; upper: LocalizedText };
  legacyGkHold?: true;
  ingredientProduct?: { index: number; item: string; amount: number; unit: string; ean: string };
  declaredLabelIngredientIndices?: number[];
  reasoning: string;
  reviewedAt: string;
  verbalNoteEdits?: Partial<Record<keyof LocalizedText, { before: string; after: string }>>;
  wholeCarbohydrateOnly?: {
    compositionMatches?: CompositionMatch[];
    countedIngredient?: CountedRecipeIngredient;
    preparationChoices?: { index: number; choices: { label: LocalizedText; record: FoodRecord; state: string; matchEvidence: string }[] };
    noteEdits?: Partial<Record<keyof LocalizedText, { before: string; after: string }>>;
    localizedScopeSha256?: Partial<LocalizedText>;
  };
  carbohydrateComparisonRecipeId?: string;
  sideCarbohydrate?: { foodId: keyof typeof sideFoods; foodSha256: string };
  portionGrams?: number;
  knownCarbIngredient?: string;
  nutritionSha256?: string;
  source: string;
  publicSource?: string;
  piecesPerServing?: number;
  condition?: LocalizedText;
  carbohydrateScope?: LocalizedText;
  localizedScopeSha256?: LocalizedText;
  classLimitation?: LocalizedText;
  ingredientGkEvidenceSha256?: string;
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
  for (const { index, ...amendment } of matches) {
    if ("item" in amendment || "amount" in amendment || "unit" in amendment) {
      throw new Error(`${input.recipeId}: a reviewed ingredient amendment cannot change the recipe quantity.`);
    }
    const amended = { ...ingredients[index], ...amendment };
    if (!amended.excludedReason && (!amended.record || !httpsSource(amended.record.sourceUrl) || !amended.state?.trim() || !amended.matchEvidence?.trim())) {
      throw new Error(`${input.recipeId}: a reviewed composition match requires a source and preparation evidence.`);
    }
    ingredients[index] = amended;
  }
  return { ...input, ingredients };
}

async function countedIngredientAmount(root: string, markdown: string, input: Calculation, review: CountedRecipeIngredient) {
  const ingredient = input.ingredients[review.index];
  const recipeId = path.posix.basename(review.recipeFile, ".md");
  const sourceUrl = "https://ozirix-dev.github.io/Reseptit/" + recipeId + "/";
  if (!/^reseptit\/[a-z0-9-]+\/[a-z0-9-]+\.md$/.test(review.recipeFile)
      || !/^docs\/nutrition\/estimates-[a-z0-9-]+\.md$/.test(review.calculationFile)
      || input.publicationStatus !== "WITHHELD_SOURCE_INCOMPLETE"
      || !ingredient?.excludedReason || ingredient.unit !== "kpl" || typeof ingredient.amount !== "number"
      || !Number.isInteger(ingredient.amount) || ingredient.amount <= 0
      || !("sourceUrl" in ingredient) || ingredient.sourceUrl !== sourceUrl || !markdown.includes(`](${sourceUrl})`)) {
    throw new Error(`${input.recipeId}: counted ingredient must match the referenced recipe and reviewed piece count.`);
  }
  const [recipeText, calculationText] = await Promise.all([
    readFile(path.join(root, review.recipeFile), "utf8"),
    readFile(path.join(root, review.calculationFile), "utf8"),
  ]);
  const recipe = parseMarkdown(recipeText)?.data as NutritionRecipe | undefined;
  if (hash(recipeText) !== review.recipeSha256 || hash(calculationText) !== review.calculationSha256
      || recipe?.recipe_id !== recipeId || !Number.isInteger(recipe.servings) || recipe.servings <= 0
      || !recipe.ingredients.length || recipe.ingredients.length !== review.components.length) {
    throw new Error(`${input.recipeId}: counted ingredient's recipe or source calculation requires review.`);
  }
  const batch = recipe.ingredients.reduce((total, component, index) => {
    const { availableCarbsGPer100g, source, gramsPerPiece } = review.components[index];
    let grams = component.unit === "g" && gramsPerPiece === undefined ? component.amount : null;
    if (component.unit === "kpl" && typeof component.amount === "number" && Number.isInteger(component.amount)
        && typeof gramsPerPiece === "number" && gramsPerPiece > 0) {
      grams = component.amount * gramsPerPiece;
    }
    if (typeof grams !== "number" || !Number.isFinite(grams) || grams <= 0
        || !validCarbohydrateRate(availableCarbsGPer100g) || !httpsSource(source)) {
      throw new Error(`${input.recipeId}: invalid composition for counted ingredient component ${index + 1}.`);
    }
    return total + grams * availableCarbsGPer100g / 100;
  }, 0);
  return { index: review.index, batchCarbohydrate: batch * ingredient.amount / recipe.servings };
}

function portionFromNutrition(data: NutritionRecipe, input: Calculation, standalone: boolean,
                              counted?: { index: number; batchCarbohydrate: number }) {
  // These two approved methodologies have separate accounting scopes.
  if (isRecoveryEvidence(input) || isScopedPolyolEvidence(input)) return null;
  const verified = verifyNutritionEvidence(data, input);
  const calculation = verified.calculated;
  if (verified.errors.length || !calculation || !("omissionWithinTolerance" in calculation)) return null;
  // A carbohydrate-only estimate needs evidence for every row, including a
  // zero-carbohydrate bound for any excluded ingredient.
  const standaloneAmounts = standalone && input.publicationStatus === "WITHHELD_SOURCE_INCOMPLETE"
    ? calculation.rows.map((row, index) => {
      const ingredient = input.ingredients[index];
      if (ingredient.excludedReason) {
        if (counted?.index === index) return counted.batchCarbohydrate;
        return Boolean(ingredient.omissionImpactEvidence?.trim())
          && ingredient.omissionImpactUpperBoundPerServing?.netCarbohydrate === 0
          && ingredient.omissionImpactUpperBoundPerServing.totalCarbohydrate === 0 ? 0 : null;
      }
      // Normalization handles unknown fibre and polyols for each source basis.
      return row.issues.every(issue => /^Unknown nutrient (fat|protein|fibre|polyols|netCarbohydrate)$/.test(issue))
        ? row.values.carbohydrate : null;
    }) : undefined;
  const complete = standalone ? standaloneAmounts?.every(value => value !== null) : verified.status === "ESTIMATE WITH EVIDENCE";
  const amounts = standaloneAmounts ?? calculation.rows.map(row => row.issues.length === 0 ? row.values.carbohydrate : null);
  const max = Math.max(0, ...amounts.map(value => value ?? 0));
  const sum = amounts.reduce<number>((total, value) => total + (value ?? 0), 0);
  const available = complete ? calculation.perServing.carbohydrate : null;
  const wholeCarbohydrate = complete && counted ? round(sum / input.servings) : available;
  const driver = max > 0 ? { ingredientIndex: amounts.indexOf(max), coversMajority: wholeCarbohydrate !== null && max > sum / 2 } : undefined;
  return { available: wholeCarbohydrate, driver, zeroCarbohydrate: wholeCarbohydrate === 0 && amounts.length > 0 && amounts.every(value => value === 0) };
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
  if (review && (review.verbal || review.condition || review.carbohydrateScope || review.legacyGkHold || review.ingredientProduct || review.classLimitation
      || review.ingredientPortion || review.additionalIngredientPortions?.length || review.alternativeLabels || review.versionAlternativeLabels
      || review.zeroCarbohydrate || review.wholeCarbohydrateOnly || review.declaredLabelIngredientIndices
      || review.portionGrams || review.piecesPerServing || review.sideCarbohydrate)
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
  if (review?.sideCarbohydrate) {
    const { foodId, foodSha256 } = review.sideCarbohydrate;
    const side = Object.hasOwn(sideFoods, foodId) ? sideFoods[foodId] : undefined;
    const records = JSON.parse(await readFile(path.join(root, "docs/nutrition/food-records.json"), "utf8")) as FoodRecord[];
    const source = records.find(record => record.id === foodId);
    const carbohydrates = source?.per100g.carbohydrate;
    if (!side || !source || hash(JSON.stringify(source)) !== foodSha256 || !httpsSource(source.sourceUrl)
        || source.carbohydrateDefinition !== "EU_AVAILABLE" || typeof carbohydrates !== "number"
        || !Number.isFinite(carbohydrates) || carbohydrates <= 0 || carbohydrates > 100) {
      throw new Error(`${recipeId}: side carbohydrate needs the exact reviewed food composition.`);
    }
    portion.sideCarbohydrate = { ...side, availableCarbsGPer100g: carbohydrates, source: source.sourceUrl };
  }
  if (review?.verbalNoteEdits && !review.verbal) {
    throw new Error(`${recipeId}: a numerical-only GK notice requires a current verbal estimate.`);
  }
  if (review?.legacyGkHold && (review.verbal || review.alternativeLabels || !(["fi", "en", "sv", "th"] as const).every(
    locale => review.condition?.[locale]?.trim()))) {
    throw new Error(`${recipeId}: the current original GK hold requires a localized explanation and cannot publish original GK alternatives.`);
  }
  if (review?.ingredientGkEvidenceSha256 !== undefined && !(["fi", "en", "sv", "th"] as const).every(
    locale => (review.condition ?? review.classLimitation)?.[locale]?.trim())) {
    throw new Error(`${recipeId}: a GK subtotal requires a localized ingredient scope.`);
  }
  const standaloneReview = review?.wholeCarbohydrateOnly;
  let counted: Awaited<ReturnType<typeof countedIngredientAmount>> | undefined;
  if (standaloneReview && (!review.nutritionSha256 || review.verbal || review.zeroCarbohydrate || !review.condition?.fi?.trim())) {
    throw new Error(`${recipeId}: standalone carbohydrate evidence requires reviewed nutrition, serving scope and no GK promotion.`);
  }
  if (review?.declaredLabelIngredientIndices && (!raw || !review.nutritionSha256)) {
    throw new Error(`${recipeId}: a carbohydrate label correction requires the pinned nutrition evidence.`);
  }
  if (raw) {
    const input = JSON.parse(raw) as Calculation;
    const recovery = isRecoveryEvidence(input);
    if (recovery || isScopedPolyolEvidence(input)) {
      // Keep the source model separate from ordinary available-carbohydrate evidence.
      const { e, result } = recovery ? await loadRecovery(root, recipeId) : await loadScopedPolyolC(root, recipeId);
      const versionHashes = "recoveryC" in e ? e.recoveryC.versionHashes : e.scopedPolyolC.versionHashes;
      const originalHash = Object.entries(versionHashes).find(([file]) => file.startsWith("reseptit/"))?.[1];
      const verified = verifyNutritionEvidence(data, e);
      const net = result.perServing.netCarbohydrate;
      if (hash(markdown.replaceAll("\r\n", "\n")) !== originalHash || verified.status !== "ESTIMATE WITH EVIDENCE"
          || net === null || !validCarbohydrateRate(net)) {
        throw new Error(`${recipeId}: approved net carbohydrate model no longer matches the original recipe.`);
      }
      portion.modeledNetCarbs = net;
      portion.carbohydrateScope = scopedNetCarbohydrateCopy[recovery ? "pasta" : "cabbage"];
      portion.reviewedSource = recovery
        ? "https://github.com/ozirix-dev/Reseptit/pull/165"
        : "https://github.com/ozirix-dev/Reseptit/blob/7cfad94801565b1763cca5dab3562d131125d17b/docs/nutrition/gk80-scoped-c-release/README.md";
    }
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
    // A separately reviewed serving calculation may coexist with partial macros.
    // A pinned legacy portion can also retain its ingredient-only carbohydrate
    // scope after approval of protein and fat alone. Validate the live package
    // first; only then reconstruct the unchanged all-null macro projection.
    // This cannot approve whole-serving carbohydrate or a new GK result.
    let portionRecipe = data;
    const reviewedMacroOnly = !standaloneReview && Boolean(review?.nutritionSha256)
      && (recipeId === "janssoninkiusaus-juuriselleri" || recipeId === "paprikainen-vhh-gulassi")
      && data.carbs_net_per_serving_g == null && data.carbs_total_per_serving_g == null;
    if ((standaloneReview || reviewedMacroOnly) && input.publicationStatus === "WITHHELD_SOURCE_INCOMPLETE"
        && nutritionKeys.some(key => data[key] != null)) {
      const originalInput = JSON.parse(raw) as Calculation;
      const approval = await readNutritionFieldApproval(root, originalInput);
      if (verifyNutritionEvidence(data, originalInput, [], approval).status === "PARTIAL ESTIMATE WITH EVIDENCE") {
        portionRecipe = { ...data };
        for (const key of nutritionKeys) portionRecipe[key] = null;
      } else if (reviewedMacroOnly) {
        throw new Error(`${recipeId}: partial nutrition approval required for reviewed GK-005 projection.`);
      }
    }
    const preparations = standaloneReview?.preparationChoices;
    if (standaloneReview?.countedIngredient) {
      const specification = standaloneReview.countedIngredient;
      if (preparations || matches.some(match => match.index === specification.index) || labelIndices.includes(specification.index)
          || review?.ingredientPortion?.index !== specification.index) {
        throw new Error(`${recipeId}: counted ingredient requires a single matching piece-based portion.`);
      }
      counted = await countedIngredientAmount(root, markdown, reviewedInput, specification);
    }
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
        const result = portionFromNutrition(portionRecipe, candidate, true);
        if (!result || result.available === null) {
          throw new Error(`${recipeId}: whole-portion preparation requires evidence for every ingredient.`);
        }
        return { label, source: match.record.sourceUrl, availableCarbsGPerServing: result.available };
      });
      const amounts = scenarios.map(choice => choice.availableCarbsGPerServing);
      portion.availableCarbs = { min: Math.min(...amounts), max: Math.max(...amounts) };
      portion.wholeCarbohydrateChoices = scenarios;
    } else {
      const result = portionFromNutrition(portionRecipe, reviewedInput, Boolean(standaloneReview), counted);
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
  if (review?.carbohydrateScope) {
    if (!review.nutritionSha256 || !portion.availableCarbs || !(["fi", "en", "sv", "th"] as const).every(
      locale => review.carbohydrateScope?.[locale]?.trim())) {
      throw new Error(`${recipeId}: carbohydrate scope requires reviewed whole-portion evidence and all four languages.`);
    }
    portion.carbohydrateScope = review.carbohydrateScope;
  }
  if (review?.zeroCarbohydrate && !zeroCarbohydrate) throw new Error(`${recipeId}: exact zero carbohydrate is no longer supported.`);
  if (review?.verbal) {
    if (!review.nutritionSha256 || !portion.availableCarbs) throw new Error(`${recipeId}: verbal GK requires reviewed whole-portion carbohydrate evidence.`);
    portion.verbal = review.verbal;
  }
  const primaryIngredient = review?.ingredientPortion;
  const additionalIngredients = review?.additionalIngredientPortions ?? [];
  const ingredients = primaryIngredient ? [primaryIngredient, ...additionalIngredients] : [];
  if ((!primaryIngredient && additionalIngredients.length) ||
      new Set(ingredients.map(ingredient => ingredient.index)).size !== ingredients.length) {
    throw new Error(`${recipeId}: reviewed partial portions require a primary ingredient and distinct ingredients.`);
  }
  for (const ingredientReview of ingredients) {
    const { index, ingredientSha256, labels, unit, source, sourceReview, availableCarbsGPer100g, declaredCarbsGPer100g,
      carbohydrateAlternatives } = ingredientReview;
    const ingredient = data.ingredients[index];
    if (!Number.isInteger(index) || !["g", "dl", "kpl", "arkkia"].includes(unit) || !ingredient || ingredient.unit !== unit || typeof ingredient.amount !== "number"
        || !Number.isFinite(ingredient.amount) || ingredient.amount <= 0
        || !Number.isInteger(data.servings) || data.servings <= 0
        || (source !== undefined && !httpsSource(source))
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
    const ingredientPortion: IngredientPortion = { name: labels, amountPerServing, unit, ...(source && { source }) };
    if (ingredientReview === primaryIngredient) portion.ingredientPortion = ingredientPortion;
    else (portion.additionalIngredientPortions ??= []).push(ingredientPortion);
    if (portion.driver?.ingredientIndex === index && !portion.driver.coversMajority) delete portion.driver;
    const carbsGPer100g = availableCarbsGPer100g ?? declaredCarbsGPer100g;
    if (ingredientReview !== primaryIngredient && carbsGPer100g !== undefined && !source) {
      throw new Error(`${recipeId}: additional ingredient carbohydrate requires its own source.`);
    }
    if (counted && ingredientReview === primaryIngredient) {
      if (unit !== "kpl" || carbohydrateAlternatives || carbsGPer100g !== undefined) {
        throw new Error(`${recipeId}: counted ingredient carbohydrate must use the reviewed recipe yield.`);
      }
      ingredientPortion.availableCarbsGPerServing = counted.batchCarbohydrate / data.servings;
    }
    if (availableCarbsGPer100g !== undefined || declaredCarbsGPer100g !== undefined) {
      if (carbohydrateAlternatives || (availableCarbsGPer100g !== undefined && declaredCarbsGPer100g !== undefined)) {
        throw new Error(`${recipeId}: partial ingredient carbohydrate must use one composition basis.`);
      }
      if (unit !== "g" || !validCarbohydrateRate(carbsGPer100g)) {
        throw new Error(`${recipeId}: invalid partial ingredient carbohydrate composition.`);
      }
      const carbsGPerServing = amountPerServing * carbsGPer100g / 100;
      if (availableCarbsGPer100g !== undefined) ingredientPortion.availableCarbsGPerServing = carbsGPerServing;
      else ingredientPortion.declaredCarbsGPerServing = carbsGPerServing;
    }
    if (carbohydrateAlternatives) {
      if (unit !== "g" || !distinctChoiceLabels(carbohydrateAlternatives) || !carbohydrateAlternatives.every(choice =>
        validCarbohydrateRate(choice.availableCarbsGPer100g) && httpsSource(choice.source))) {
        throw new Error(`${recipeId}: invalid partial ingredient carbohydrate alternatives.`);
      }
      ingredientPortion.carbohydrateAlternatives = carbohydrateAlternatives.map(choice => ({
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
    if (!ingredients.some(ingredient => ingredient.index === index)) portion.driver ??= { ingredientIndex: index, coversMajority: false };
  }
  if (review) portion.reviewedSource = review.publicSource ?? review.source;
  if (review?.classLimitation) portion.classLimitation = review.classLimitation;
  if (review?.ingredientGkEvidenceSha256 !== undefined) portion.gkIngredientSubset = true;
  if (review?.condition) portion.condition = review.condition;
  if (review?.portionGrams) portion.gramsPerServing = review.portionGrams;
  if (review?.piecesPerServing) portion.piecesPerServing = review.piecesPerServing;
  return { portion, zeroCarbohydrate, source: review?.source };
}

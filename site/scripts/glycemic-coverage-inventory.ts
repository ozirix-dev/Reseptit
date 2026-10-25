import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type JsonRecord = Record<string, unknown>;
type ResultIngredient = JsonRecord & {
  name: string;
  availableCarbohydratePerServingG: number | null;
  fineliRecordId: string | null;
  giRecordId: string | null;
  issues: string[];
  giCandidates?: JsonRecord[];
};
type RecipeResult = JsonRecord & {
  recipeId: string;
  status: string;
  blockers: string[];
  ingredients: ResultIngredient[];
  omittedAvailableCarbohydratePerServingG: number;
};

const siteDir = path.resolve(import.meta.dirname, "..");
const root = path.resolve(siteDir, "..");
const date = "2026-10-25";
const historicalBaseline = {
  recipeCount: 325,
  calculated: 112,
  incomplete: 213,
  giRecordCount: 37,
  strongGICount: 4,
  supplementaryGICount: 33,
  nutritionAuditCounts: {
    VERIFIED: 0,
    "ESTIMATE WITH EVIDENCE": 180,
    "INSUFFICIENT SOURCE DATA": 86,
    "CONFLICT REQUIRES REVIEW": 0,
    MISSING: 59,
  },
};
const readJson = async <T>(relativePath: string): Promise<T> =>
  JSON.parse(await readFile(path.join(root, relativePath), "utf8")) as T;

const [glAudit, beforeAfter, input, bindings, foods, giCatalog, nutritionAudit] = await Promise.all([
  readJson<JsonRecord & { results: RecipeResult[]; summary: JsonRecord }>("tmp/nutrition/glycemic-load-pilot.json"),
  readJson<Array<JsonRecord & { recipeId: string; beforeStatus: string; afterStatus: string; blockers: string[] }>>("docs/nutrition/glycemic-load-before-after-2026-10-25.json"),
  readJson<JsonRecord & { recipes: Array<JsonRecord & { recipeId: string; servings: number; ingredients: JsonRecord[] }> }>("docs/nutrition/glycemic-load-pilot-input.json"),
  readJson<JsonRecord & { recipes: Record<string, string>; calculationInputs: Record<string, string>; calculationEvidence: Record<string, string> }>("docs/nutrition/glycemic-load-recipe-bindings.json"),
  readJson<Array<JsonRecord & { id: string; name: string; state: string; basis: string; per100g: JsonRecord }>>("docs/nutrition/food-records.json"),
  readJson<JsonRecord & { sourcePolicy: string; records: Array<JsonRecord & { id: string; gi: number; foodKey: string; preparationKey: string; qualityTier: string; source: JsonRecord }> }>("docs/nutrition/glycemic-index-records.json"),
  readJson<JsonRecord & { counts: Record<string, number>; inventory: Array<JsonRecord & { recipe_id: string; status: string; evidenceErrors: string[] }> }>("tmp/nutrition/audit.json"),
]);

const inputByRecipe = new Map(input.recipes.map((recipe) => [recipe.recipeId, recipe]));
const priorByRecipe = new Map(beforeAfter.map((recipe) => [recipe.recipeId, recipe]));
const nutritionByRecipe = new Map(nutritionAudit.inventory.map((recipe) => [recipe.recipe_id, recipe]));
const currentResultByRecipe = new Map(glAudit.results.map((recipe) => [recipe.recipeId, recipe]));
const giById = new Map(giCatalog.records.map((record) => [record.id, record]));
const foodById = new Map(foods.map((food) => [food.id, food]));
const sourcePriority: Record<string, number> = { F: 0, D: 1, E: 2, B: 3, C: 4, A: 5, G: 6, H: 7 };
const labels: Record<string, string> = {
  A: "GI-arvo puuttuu",
  B: "GI-lähde tai ruoka-/valmistusvastaavuus ei täsmää",
  C: "Vain täydentävä tai julkaisutasoltaan riittämätön GI-lähde",
  D: "Hiilihydraatti- tai koostumustieto puuttuu",
  E: "Määrä-, massa- tai valmistusmuunnos ratkaisematta",
  F: "Reseptin tai laskentasyötteen rakennesidonta vanhentunut",
  G: "Alle 2 g:n kumulatiivinen toleranssi ylittyy",
  H: "Muu yksilöity ongelma",
};

function mappedIngredient(recipeId: string, blocker: string, ingredients: ResultIngredient[]) {
  return ingredients.find((row) => blocker.startsWith(`${recipeId}: ${row.name}:`));
}

function classify(blocker: string, ingredient: ResultIngredient | undefined): string {
  if (/recipe structure differs|calculation input (?:differs|mismatch)|fingerprint|binding mismatch/i.test(blocker)) return "F";
  if (/cumulative omitted available carbohydrate|at or above the 2 g editorial tolerance/i.test(blocker)) return "G";
  if (/source-matched composition|available carbohydrate is missing|unknown carbohydrate|composition.*(?:missing|unresolved)|not treated as zero|validated (?:mass|composition) is missing/i.test(blocker)) return "D";
  if (/food-specific mass conversion|portion mass|gram conversion|unit conversion|density|edible (?:fraction|weight|basis)|raw\/cooked|cooked\/raw|preparation retention|retention\/loss|amount (?:is|remains) unknown|weight is unclear/i.test(blocker)) return "E";
  if (/GI food family does not match|food\/preparation match lacks a rationale|food family|does not match the ingredient/i.test(blocker)) {
    const assigned = ingredient?.giRecordId ? giById.get(ingredient.giRecordId) : undefined;
    if (assigned && assigned.qualityTier === "SUPPLEMENTARY" && assigned.foodKey === ingredient?.foodKey && assigned.preparationKey === ingredient?.preparationKey) return "C";
    const candidates = ingredient?.giCandidates ?? [];
    if (candidates.length && candidates.every((candidate) => candidate.qualityTier === "SUPPLEMENTARY" && candidate.preparationMatches === true)) return "C";
    return "B";
  }
  if (/GI evidence is missing|no (?:suitable|exact published) GI (?:source|value)|no GI value|GI source.*(?:missing|not found)/i.test(blocker)) return "A";
  return "H";
}

function actionFor(category: string): string {
  return {
    A: "Etsi julkaistu ruoka- ja valmistustapakohtainen GI-lähde; tuntematonta arvoa ei nollata.",
    B: "Tarkista elintarvikeperhe, ruoan tila ja valmistus; korjaa vastaavuus tai pidä esto.",
    C: "Hae ensisijainen/ISO-kelpoinen näyttö tai säilytä lähde vain täydentävänä; älä nosta laatuluokkaa oletuksella.",
    D: "Ratkaise koostumus ja imeytyvä hiilihydraatti lähteestä ennen GI-täsmäystä.",
    E: "Ratkaise reseptimäärä, syötävä paino, yksikkömuunnos tai raaka-/kypsäpaino.",
    F: "Tarkista reseptiversio, ainesosarakenne ja laskentasyöte ennen lähdearvion avaamista.",
    G: "Tarkista alle 1 g:n ainesosat erikseen ja yhteisraja; älä muuta 2 g:n sääntöä.",
    H: "Selvitä yksilöity virhe ja lisää tarvittava lähde tai rakenteellinen korjaus.",
  }[category] ?? "Tarkista esto.";
}

const incomplete = beforeAfter
  .filter((recipe) => recipe.afterStatus !== "CALCULATED")
  .map((recipe) => currentResultByRecipe.get(recipe.recipeId))
  .filter((recipe): recipe is RecipeResult => Boolean(recipe));
if (glAudit.results.length !== 325 || incomplete.length !== 213) {
  throw new Error(`Expected 325 current results and 213 baseline-incomplete recipes from the committed before/after audit; got ${glAudit.results.length}/${incomplete.length}`);
}
if (beforeAfter.length !== 325 || input.recipes.length !== 325) throw new Error("Expected 325 rows in all three source inventories.");
if (JSON.stringify(nutritionAudit.counts) !== JSON.stringify(historicalBaseline.nutritionAuditCounts)) {
  throw new Error("The historical 2026-10-25 nutrition audit counts changed; refresh the baseline evidence explicitly before regenerating this inventory.");
}

const rows = incomplete.map((recipe) => {
  const previous = priorByRecipe.get(recipe.recipeId);
  const nutrition = nutritionByRecipe.get(recipe.recipeId);
  const recipeInput = inputByRecipe.get(recipe.recipeId);
  if (!previous || !nutrition || !recipeInput) throw new Error(`Missing cross-source row for ${recipe.recipeId}`);
  const baselineMessages = previous.afterStatus === "CALCULATED" ? recipe.blockers : previous.blockers;
  const blockers = baselineMessages.map((message) => {
    const ingredient = mappedIngredient(recipe.recipeId, message, recipe.ingredients);
    const category = classify(message, ingredient);
    const inputIngredient = ingredient ? recipeInput.ingredients.find((row) => row.name === ingredient.name) : undefined;
    const giRecord = ingredient?.giRecordId ? giById.get(ingredient.giRecordId) : undefined;
    const foodRecord = ingredient?.fineliRecordId ? foodById.get(ingredient.fineliRecordId) : undefined;
    const candidates = ingredient?.giCandidates ?? [];
    return {
      category,
      categoryLabel: labels[category],
      ingredient: ingredient?.name ?? null,
      availableCarbohydratePerServingG: ingredient?.availableCarbohydratePerServingG ?? null,
      fineliRecordId: ingredient?.fineliRecordId ?? null,
      foodRecord: foodRecord ? { name: foodRecord.name, state: foodRecord.state, basis: foodRecord.basis } : null,
      assignedGIRecord: giRecord ? { id: giRecord.id, gi: giRecord.gi, qualityTier: giRecord.qualityTier, foodKey: giRecord.foodKey, preparationKey: giRecord.preparationKey } : null,
      ingredientFoodKey: recipe.status === "CALCULATED" && previous.afterStatus !== "CALCULATED" ? null : inputIngredient?.foodKey ?? null,
      ingredientPreparationKey: recipe.status === "CALCULATED" && previous.afterStatus !== "CALCULATED" ? null : inputIngredient?.preparationKey ?? null,
      candidateGIRecords: candidates.map((candidate) => ({ id: candidate.id, gi: candidate.gi, qualityTier: candidate.qualityTier, preparationMatches: candidate.preparationMatches, sourceUrl: candidate.sourceUrl })),
      message,
      nextAction: actionFor(category),
    };
  });
  const categories = [...new Set(blockers.map((blocker) => blocker.category))].sort((a, b) => sourcePriority[a]! - sourcePriority[b]!);
  return {
    recipeId: recipe.recipeId,
    priorGroup: previous.beforeStatus === "CALCULATED" ? "PREVIOUSLY_CALCULATED_NOW_BLOCKED" : "ALREADY_INCOMPLETE_AT_BASELINE",
    primaryBlockingCategory: categories[0] ?? "H",
    primaryBlockingReason: blockers.find((blocker) => blocker.category === categories[0])?.message ?? "No structured blocker string; manual inspection required.",
    overlappingCategories: categories,
    blockerCount: blockers.length,
    blockers,
    priorGlycemicLoad: previous.before,
    omittedAvailableCarbohydratePerServingG: recipe.omittedAvailableCarbohydratePerServingG,
    nutritionStatus: nutrition.status,
    nutritionEvidenceErrors: nutrition.evidenceErrors,
    recipeServings: recipeInput.servings,
    recipeBindingHash: bindings.recipes[recipe.recipeId] ?? null,
    calculationInputHash: bindings.calculationInputs[recipe.recipeId] ?? null,
    calculationEvidenceHash: bindings.calculationEvidence[recipe.recipeId] ?? null,
    structureStale: baselineMessages.some((blocker) => classify(blocker, mappedIngredient(recipe.recipeId, blocker, recipe.ingredients)) === "F"),
  };
});

const blockerRecipes = Object.fromEntries(Object.keys(labels).map((category) => [category, rows.filter((row) => row.overlappingCategories.includes(category)).map((row) => row.recipeId)]));
const blockerTotals = Object.fromEntries(Object.keys(labels).map((category) => [category, {
  recipes: blockerRecipes[category]!.length,
  blockers: rows.reduce((sum, row) => sum + row.blockers.filter((blocker) => blocker.category === category).length, 0),
  priorCalculated: rows.filter((row) => row.priorGroup === "PREVIOUSLY_CALCULATED_NOW_BLOCKED" && row.overlappingCategories.includes(category)).length,
  baselineIncomplete: rows.filter((row) => row.priorGroup === "ALREADY_INCOMPLETE_AT_BASELINE" && row.overlappingCategories.includes(category)).length,
}]));

const sourceGroups = new Map<string, { label: string; foodKey: string | null; preparationKey: string | null; fineliRecordId: string | null; recipeIds: Set<string>; currentlyCalculatedRecipeIds: Set<string>; currentlyIncompleteRecipeIds: Set<string>; occurrenceCarbohydrate: number; soleBlockerRecipeIds: Set<string>; candidateRecords: Map<string, JsonRecord>; qualityNotes: Set<string> }>();
for (const row of rows) {
  const recipe = currentResultByRecipe.get(row.recipeId)!;
  for (const blockerRow of row.blockers) {
    const blocker = blockerRow.message;
    const ingredient = mappedIngredient(recipe.recipeId, blocker, recipe.ingredients);
    const category = classify(blocker, ingredient);
    if (!ingredient || !["A", "B", "C"].includes(category)) continue;
    const inputIngredient = inputByRecipe.get(recipe.recipeId)?.ingredients.find((row) => row.name === ingredient.name);
    const giRecord = ingredient.giRecordId ? giById.get(ingredient.giRecordId) : undefined;
    const foodKey = String(inputIngredient?.foodKey ?? giRecord?.foodKey ?? "").trim() || null;
    const preparationKey = String(inputIngredient?.preparationKey ?? giRecord?.preparationKey ?? "").trim() || null;
    const fineliRecordId = ingredient.fineliRecordId;
    const normalizedName = ingredient.name.toLocaleLowerCase("fi-FI").replace(/\s+/g, " ").trim();
    const key = [category, foodKey ?? "?", preparationKey ?? "?", fineliRecordId ?? normalizedName].join("|");
    const group = sourceGroups.get(key) ?? { label: ingredient.name, foodKey, preparationKey, fineliRecordId, recipeIds: new Set<string>(), currentlyCalculatedRecipeIds: new Set<string>(), currentlyIncompleteRecipeIds: new Set<string>(), occurrenceCarbohydrate: 0, soleBlockerRecipeIds: new Set<string>(), candidateRecords: new Map<string, JsonRecord>(), qualityNotes: new Set<string>() };
    group.recipeIds.add(recipe.recipeId);
    if (recipe.status === "CALCULATED") group.currentlyCalculatedRecipeIds.add(recipe.recipeId);
    else group.currentlyIncompleteRecipeIds.add(recipe.recipeId);
    group.occurrenceCarbohydrate += ingredient.availableCarbohydratePerServingG ?? 0;
    if (row.blockerCount === 1) group.soleBlockerRecipeIds.add(recipe.recipeId);
    for (const candidate of ingredient.giCandidates ?? []) group.candidateRecords.set(String(candidate.id), candidate);
    if (giRecord) group.candidateRecords.set(giRecord.id, { id: giRecord.id, gi: giRecord.gi, qualityTier: giRecord.qualityTier, preparationMatches: giRecord.preparationKey === preparationKey, sourceUrl: (giRecord.source as JsonRecord | undefined)?.url ?? null });
    group.qualityNotes.add(category === "C" ? "Only supplementary / insufficiently documented candidates currently fit." : category === "B" ? "A record exists but the current food/preparation/source mapping is rejected." : "No accepted GI match is currently assigned.");
    sourceGroups.set(key, group);
  }
}

const priorityList = [...sourceGroups.entries()].map(([key, group]) => {
  const recipeIds = [...group.recipeIds].sort();
  const soleBlockerRecipeIds = [...group.soleBlockerRecipeIds].sort();
  const impactScore = group.occurrenceCarbohydrate * (1 + Math.max(0, recipeIds.length - 1) / 10) + soleBlockerRecipeIds.length * 2;
  return {
    sourceGapId: key,
    ingredient: group.label,
    foodKey: group.foodKey,
    preparationKey: group.preparationKey,
    fineliRecordId: group.fineliRecordId,
    affectedRecipeCount: recipeIds.length,
    blockedRecipeIds: recipeIds,
    currentlyCalculatedRecipeIds: [...group.currentlyCalculatedRecipeIds].sort(),
    currentlyIncompleteRecipeIds: [...group.currentlyIncompleteRecipeIds].sort(),
    currentlyCalculatedRecipeCount: group.currentlyCalculatedRecipeIds.size,
    currentlyIncompleteRecipeCount: group.currentlyIncompleteRecipeIds.size,
    possibleSoleBlockerRecipeCount: soleBlockerRecipeIds.length,
    possibleSoleBlockerRecipeIds: soleBlockerRecipeIds,
    summedAvailableCarbohydrateAcrossRecipeServingsG: Math.round(group.occurrenceCarbohydrate * 1000) / 1000,
    priorityScore: Math.round(impactScore * 1000) / 1000,
    currentCandidates: [...group.candidateRecords.values()],
    currentQualityNotes: [...group.qualityNotes],
  };
}).sort((a, b) => b.priorityScore - a.priorityScore || b.affectedRecipeCount - a.affectedRecipeCount || a.ingredient.localeCompare(b.ingredient, "fi"));

const nutritionGroups = {
  supportedButGLMissing: rows.filter((row) => row.nutritionStatus === "ESTIMATE WITH EVIDENCE").map((row) => row.recipeId),
  nutritionRequiresReviewAndGLMissing: rows.filter((row) => row.nutritionStatus === "INSUFFICIENT SOURCE DATA").map((row) => row.recipeId),
  nutritionMissingAndGLMissing: rows.filter((row) => row.nutritionStatus === "MISSING").map((row) => row.recipeId),
  nutritionConflictRequiresReview: rows.filter((row) => row.nutritionStatus === "CONFLICT REQUIRES REVIEW").map((row) => row.recipeId),
};
const sourceCommit = "b51c769731ba40f9ab0b085e5b1b47f979651d9f";
const inventory = {
  generatedAt: new Date().toISOString(),
  sourceCommit,
  baseline: historicalBaseline,
  classificationPolicy: labels,
  overlapCountsByCategory: blockerTotals,
  nutritionGroups,
  recipeCountByOriginalState: {
    previouslyCalculatedNowBlocked: rows.filter((row) => row.priorGroup === "PREVIOUSLY_CALCULATED_NOW_BLOCKED").length,
    alreadyIncompleteAtBaseline: rows.filter((row) => row.priorGroup === "ALREADY_INCOMPLETE_AT_BASELINE").length,
  },
  recipes: rows.sort((a, b) => a.recipeId.localeCompare(b.recipeId)),
  sourcePriorities: priorityList,
  limitations: [
    "The inventory classifies current deterministic blocker messages; it does not validate new GI evidence.",
    "A sole current blocker count is a candidate for source work, not a promise that the recipe will publish after one source change; other recipe/input validation may still apply.",
    "Source priority score is a reproducible editorial ranking: summed supported available carbohydrate across blocked recipe servings, adjusted for reuse and sole-blocker opportunities. It is not a clinical impact score.",
  ],
};

const markdown = [
  `# GI-kattavuuden esto- ja lähdeinventaario (${date})`,
  "",
  `Lähtöcommit: \`${sourceCommit}\`. Tämä tiedosto luokittelee uudelleen kaikki 213 keskeneräistä GK-arviota nykyisen toistettavan GK-ajon ja strict nutrition auditin perusteella. Luokkamäärät ovat päällekkäisiä reseptien välillä.`,
  "",
  `Aineistossa on ${inventory.baseline.recipeCount} reseptiä, ${inventory.baseline.calculated} laskettua ja ${inventory.baseline.incomplete} keskeneräistä GK-arviota. GI-katalogissa on ${inventory.baseline.giRecordCount} tietuetta (${inventory.baseline.strongGICount} STRONG, ${inventory.baseline.supplementaryGICount} SUPPLEMENTARY). Ravintoarvoauditointi: ${nutritionAudit.counts["ESTIMATE WITH EVIDENCE"]} tuettua, ${nutritionAudit.counts["INSUFFICIENT SOURCE DATA"]} tarkistettavaa, ${nutritionAudit.counts.MISSING} puuttuvaa ja ${nutritionAudit.counts["CONFLICT REQUIRES REVIEW"]} ristiriitaista.`,
  "",
  "## Esteiden päällekkäisyys",
  "",
  "| Luokka | Reseptit | Estoviestit | Aiemmin laskettu, nyt estetty | Jo lähtötilanteessa keskeneräinen |",
  "| --- | ---: | ---: | ---: | ---: |",
  ...Object.entries(blockerTotals).map(([category, count]) => `| ${category}: ${labels[category]} | ${count.recipes} | ${count.blockers} | ${count.priorCalculated} | ${count.baselineIncomplete} |`),
  "",
  `Ravintoarvoryhmät (erilliset, eivät summaa GK-luokkia): lähteillä tuettu ${nutritionGroups.supportedButGLMissing.length}, ravintoarvo tarkistettava ${nutritionGroups.nutritionRequiresReviewAndGLMissing.length}, ravintoarvo puuttuu ${nutritionGroups.nutritionMissingAndGLMissing.length}, ristiriita ${nutritionGroups.nutritionConflictRequiresReview.length}.`,
  "",
  "## Lähdeaukkojen prioriteetti",
  "",
  "Prioriteetti yhdistää tuetun imeytyvän hiilihydraatin summan, lähteen uudelleenkäytön ja niiden reseptien määrän, joissa kyseinen este on ainoa nykyinen GK-estoviesti. Piste ei ole kliininen vaikutusarvio.",
  "",
  "| # | Ainesosa / vastaavuus | GI / valmistus | Lähtötilan reseptit | Nyt laskettu / edelleen estynyt | Lähtötilassa ainoa este | Yhteinen imeytyvä HH g/annos (summi reseptien yli) | Nykyiset ehdokkaat | Vaikeus |",
  "| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | --- |",
  ...priorityList.slice(0, 15).map((item, index) => {
    const candidateText = item.currentCandidates.length ? item.currentCandidates.map((candidate) => `${candidate.id} (${candidate.qualityTier ?? "?"})`).join(", ") : "ei hyväksyttyä ehdokasta";
    const difficulty = item.currentCandidates.length ? "Keskitaso / korkea: tarkista vastaavuus ja laatu" : "Korkea: lähdehaku ja mahdollinen tuotemäärittely";
    return `| ${index + 1} | ${item.ingredient} (${item.fineliRecordId ?? "ei Fineli-ID:tä"}) | ${item.foodKey ?? "ruoka ratkaisematta"} / ${item.preparationKey ?? "valmistus ratkaisematta"} | ${item.affectedRecipeCount} | ${item.currentlyCalculatedRecipeCount} / ${item.currentlyIncompleteRecipeCount} | ${item.possibleSoleBlockerRecipeCount} | ${item.summedAvailableCarbohydrateAcrossRecipeServingsG} | ${candidateText} | ${difficulty} |`;
  }),
  "",
  "## Rajaukset",
  "",
  "- Koneellinen luokka kuvaa nykyistä estoviestiä; se ei hyväksy uutta GI-lähdettä eikä takaa GK-arvion avautumista.",
  "- Rakennesidonnan muutokset käsitellään ensin, koska ne mitätöivät aiemman reseptikohtaisen ainesosatarkastelun.",
  "- Yksittäinen GI:tön annososuus pysyy alle 1 g:ssa ja kaikkien pienosuuksien yhteissumma alle 2 g:ssa. Tuntemattomia määriä ei nollata.",
  "- Tiedoston täydellinen 213 reseptin estekohtainen luettelo ja lähde-evidenssikandidaatit ovat JSON-inventaariossa.",
  "",
].join("\n");

await writeFile(path.join(root, `docs/nutrition/glycemic-coverage-inventory-${date}.json`), JSON.stringify(inventory, null, 2) + "\n");
await writeFile(path.join(root, `docs/nutrition/glycemic-coverage-priorities-${date}.md`), markdown);
console.log(JSON.stringify({ recipes: rows.length, blockerTotals, nutritionGroups: Object.fromEntries(Object.entries(nutritionGroups).map(([key, ids]) => [key, ids.length])), topPriorities: priorityList.slice(0, 15).map((item) => ({ ingredient: item.ingredient, foodKey: item.foodKey, preparationKey: item.preparationKey, affectedRecipeCount: item.affectedRecipeCount, soleBlockerCount: item.possibleSoleBlockerRecipeCount, carbohydrateG: item.summedAvailableCarbohydrateAcrossRecipeServingsG })), output: [`docs/nutrition/glycemic-coverage-inventory-${date}.json`, `docs/nutrition/glycemic-coverage-priorities-${date}.md`] }, null, 2));

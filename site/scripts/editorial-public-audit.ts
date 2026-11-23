/**
 * #327: source-vs-public text quality signals. Run only after content:sync.
 * Writes advisory JSON/Markdown to tmp/, not recipes or release approvals.
 */
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { RecipeEntry } from "../src/types/content";
import { canonicalEditorialText } from "./canonical-editorial-text";

type Evidence = { recipeId: string; title: string; path: string; sourceSha256: string };
type RawRepeat = { phrase: string; recipes: Evidence[] };
export type RawInventory = {
  counts: { reviewed: number };
  indexedRecipes: Evidence[];
  signals: {
    genericLead: Evidence[];
    repeatedSteps: RawRepeat[];
    duplicateDescription: Evidence[];
    missingTime: Evidence[];
    missingPreparation?: Evidence[];
    unnumberedPreparation?: Evidence[];
    emptyPreparation?: Evidence[];
    invalidTime?: (Evidence & { rawValue: string })[];
    duplicateTimeKeys?: (Evidence & { rawValue: string })[];
  };
};
export type PublicRecipe = Pick<RecipeEntry,
  "recipeId" | "locale" | "routePath" | "description" | "instructionsText" | "timeTotalMin">;
type PublicEvidence = Evidence & { routePath: string };

const GENERIC = /t(?:ä|a)ss(?:ä|a) kotikeitti(?:ö|o)(?:ö|o)n sovitetussa/i;


function publicRepeatedSteps(fi: readonly PublicRecipe[], sources: Map<string, Evidence>) {
  const groups = new Map<string, Map<string, PublicEvidence>>();
  for (const recipe of fi) {
    for (const text of recipe.instructionsText) {
      const phrase = canonicalEditorialText(text);
      if (phrase.length < 65) continue;
      if (!groups.has(phrase)) groups.set(phrase, new Map());
      groups.get(phrase)!.set(recipe.recipeId, {
        ...sources.get(recipe.recipeId)!, routePath: recipe.routePath,
      });
    }
  }
  return [...groups].filter(([, recipes]) => recipes.size > 1)
    .map(([phrase, recipes]) => ({
      phrase,
      recipes: [...recipes.values()].sort((a, b) => a.recipeId.localeCompare(b.recipeId, "fi")),
    }))
    .sort((a, b) => b.recipes.length - a.recipes.length || a.phrase.localeCompare(b.phrase, "fi"));
}

/** Fail closed if the raw file scan and public build cover different FI identities. */
export function compareInventories(raw: RawInventory, recipes: readonly PublicRecipe[]) {
  if (!Array.isArray(raw.indexedRecipes) || raw.indexedRecipes.length !== raw.counts.reviewed) {
    throw new Error("RAW_INVENTORY_OUTDATED: rerun editorial-inventory.mjs");
  }
  const sources = new Map<string, Evidence>();
  for (const item of raw.indexedRecipes) {
    if (!item.recipeId || sources.has(item.recipeId)) {
      throw new Error("DUPLICATE_RAW_RECIPE_ID: " + item.recipeId);
    }
    sources.set(item.recipeId, item);
  }
  // Every raw signal must refer to the identical evidence in this inventory.
  // This checks internal snapshot consistency, not the current contents of Git files.
  const verifyEvidence = (item: Evidence, signal: string): void => {
    const indexed = sources.get(item.recipeId);
    if (!indexed || indexed.path !== item.path ||
        indexed.sourceSha256 !== item.sourceSha256 || indexed.title !== item.title) {
      throw new Error("RAW_SIGNAL_SOURCE_DRIFT: " + signal + ":" + item.recipeId);
    }
  };
  for (const [name, records] of [
    ["genericLead", raw.signals.genericLead],
    ["duplicateDescription", raw.signals.duplicateDescription],
    ["missingTime", raw.signals.missingTime],
    ["missingPreparation", raw.signals.missingPreparation ?? []],
    ["unnumberedPreparation", raw.signals.unnumberedPreparation ?? []],
    ["emptyPreparation", raw.signals.emptyPreparation ?? []],
    ["invalidTime", raw.signals.invalidTime ?? []],
    ["duplicateTimeKeys", raw.signals.duplicateTimeKeys ?? []],
  ] as const) {
    const seen = new Set<string>();
    for (const item of records) {
      verifyEvidence(item, name);
      if (seen.has(item.recipeId)) {
        throw new Error("DUPLICATE_RAW_SIGNAL: " + name + ":" + item.recipeId);
      }
      seen.add(item.recipeId);
    }
  }
  // A non-empty unnumbered method is a subset of sources without numbered steps.
  const missingPreparationIds = new Set(
    (raw.signals.missingPreparation ?? []).map(item => item.recipeId)
  );
  for (const item of raw.signals.unnumberedPreparation ?? []) {
    if (!missingPreparationIds.has(item.recipeId)) {
      throw new Error("UNNUMBERED_RAW_PREPARATION_DRIFT: " + item.recipeId);
    }
  }
  // When both classifications exist, the raw missing-numbered-step group is
  // exactly partitioned into an empty method and unnumbered source text.
  // Legacy fixtures may omit either category and retain advisory behavior.
  if (raw.signals.emptyPreparation && raw.signals.unnumberedPreparation) {
    const classified = new Set<string>();
    for (const item of [...raw.signals.emptyPreparation, ...raw.signals.unnumberedPreparation]) {
      if (!missingPreparationIds.has(item.recipeId) || classified.has(item.recipeId)) {
        throw new Error("RAW_PREPARATION_PARTITION_DRIFT: " + item.recipeId);
      }
      classified.add(item.recipeId);
    }
    for (const id of missingPreparationIds) {
      if (!classified.has(id)) throw new Error("RAW_PREPARATION_PARTITION_DRIFT: " + id);
    }
  }
  // The new invalid-time list is a classified subset of missingTime.
  // Keep it optional for older inventories and audit fixtures.
  const missingTimeIds = new Set(raw.signals.missingTime.map(item => item.recipeId));
  for (const item of raw.signals.invalidTime ?? []) {
    if (!missingTimeIds.has(item.recipeId) || typeof item.rawValue !== "string" ||
        !item.rawValue.trim() || item.rawValue.trim().toLowerCase() === "null") {
      throw new Error("INVALID_RAW_TIME_SIGNAL: " + item.recipeId);
    }
  }
  // Duplicate time keys must be represented verbatim in invalidTime.
  const invalidTimeById = new Map((raw.signals.invalidTime ?? []).map(item => [item.recipeId, item]));
  for (const item of raw.signals.duplicateTimeKeys ?? []) {
    if (typeof item.rawValue !== "string" || !item.rawValue.includes(" | ") ||
        invalidTimeById.get(item.recipeId)?.rawValue !== item.rawValue) {
      throw new Error("DUPLICATE_RAW_TIME_SIGNAL_DRIFT: " + item.recipeId);
    }
  }
  const repeatPhrases = new Set<string>();
  for (const group of raw.signals.repeatedSteps) {
    if (repeatPhrases.has(group.phrase)) {
      throw new Error("DUPLICATE_RAW_REPEAT_PHRASE: " + group.phrase);
    }
    repeatPhrases.add(group.phrase);
    const seen = new Set<string>();
    for (const item of group.recipes) {
      verifyEvidence(item, "repeatedSteps");
      if (seen.has(item.recipeId)) {
        throw new Error("DUPLICATE_RAW_REPEAT_RECIPE: " + item.recipeId);
      }
      seen.add(item.recipeId);
    }
  }
  const fi = recipes.filter(recipe => recipe.locale === "fi");
  for (const recipe of fi) {
    const time = recipe.timeTotalMin;
    if (time !== null && (typeof time !== "number" || !Number.isSafeInteger(time) || time <= 0)) {
      throw new Error("INVALID_PUBLIC_TOTAL_TIME: " + recipe.recipeId);
    }
  }
  const visible = new Map<string, PublicRecipe>();
  for (const recipe of fi) {
    if (visible.has(recipe.recipeId)) throw new Error("DUPLICATE_PUBLIC_RECIPE_ID: " + recipe.recipeId);
    visible.set(recipe.recipeId, recipe);
  }
  const missing = [...sources.keys()].filter(id => !visible.has(id));
  const extras = [...visible.keys()].filter(id => !sources.has(id));
  if (missing.length || extras.length) {
    throw new Error("SOURCE_PUBLIC_DRIFT: raw-only=" + missing.slice(0, 10).join(",") +
      "; public-only=" + extras.slice(0, 10).join(","));
  }
  const enrich = (recipe: PublicRecipe): PublicEvidence => ({
    ...sources.get(recipe.recipeId)!, routePath: recipe.routePath,
  });
  const generic = fi.filter(recipe => GENERIC.test(recipe.description)).map(enrich);
  const genericIds = new Set(generic.map(item => item.recipeId));
  const rawGenericIds = new Set(raw.signals.genericLead.map(item => item.recipeId));
  const rawGenericNoLongerVisible = raw.signals.genericLead
    .filter(item => !genericIds.has(item.recipeId)).map(item => enrich(visible.get(item.recipeId)!));
  const publicGenericNotInRaw = generic.filter(item => !rawGenericIds.has(item.recipeId));
  const repeated = publicRepeatedSteps(fi, sources);
  const stepSets = new Map(fi.map(recipe => [
    recipe.recipeId, new Set(recipe.instructionsText.map(canonicalEditorialText)),
  ]));
  const comparedRepeats = raw.signals.repeatedSteps.map(group => ({
    phrase: group.phrase,
    rawCount: group.recipes.length,
    stillVisible: group.recipes
      .filter(item => stepSets.get(item.recipeId)?.has(group.phrase))
      .map(item => enrich(visible.get(item.recipeId)!)),
  }));
  const unresolvedRepeats = comparedRepeats.filter(group => group.stillVisible.length >= 2);
  const resolvedRepeats = comparedRepeats.filter(group => group.stillVisible.length < 2);
  // An empty or whitespace-only instruction list is a projected missing method.
  // Raw missingPreparation only says the source lacked numbered steps; the public
  // projection may legitimately derive a usable method from another source section.
  const missingPreparation = fi.filter(recipe =>
    !recipe.instructionsText.some(step => typeof step === "string" && step.trim().length > 0)
  ).map(enrich);
  const publicMissingPreparationIds = new Set(missingPreparation.map(item => item.recipeId));
  const rawMissingPreparationIds = new Set((raw.signals.missingPreparation ?? []).map(item => item.recipeId));
  const rawMissingPreparationNoLongerVisible = (raw.signals.missingPreparation ?? [])
    .filter(item => !publicMissingPreparationIds.has(item.recipeId))
    .map(item => enrich(visible.get(item.recipeId)!));
  const publicMissingPreparationNotInRaw = missingPreparation
    .filter(item => !rawMissingPreparationIds.has(item.recipeId));
  const missingTime = fi.filter(recipe => recipe.timeTotalMin === null).map(enrich);
  const rawMissingTimeIds = new Set(raw.signals.missingTime.map(item => item.recipeId));
  const publicMissingTimeIds = new Set(missingTime.map(item => item.recipeId));
  const rawMissingTimeNoLongerVisible = raw.signals.missingTime
    .filter(item => !publicMissingTimeIds.has(item.recipeId))
    .map(item => enrich(visible.get(item.recipeId)!));
  const publicMissingTimeNotInRaw = missingTime
    .filter(item => !rawMissingTimeIds.has(item.recipeId));
  return {
    schemaVersion: 1,
    notice: "Public means the locally generated post-projection recipe dataset, not a verified Cloudflare production HTTP response.",
    totals: {
      rawPublishedFiReviewed: raw.counts.reviewed,
      projectedFiRecipes: fi.length,
      rawGenericLeads: raw.signals.genericLead.length,
      projectedGenericDescriptions: generic.length,
      rawGenericNoLongerVisible: rawGenericNoLongerVisible.length,
      publicGenericNotInRaw: publicGenericNotInRaw.length,
      sourceOnlyDuplicateDescriptions: raw.signals.duplicateDescription.length,
      rawRepeatedStepGroups: raw.signals.repeatedSteps.length,
      projectedRepeatedStepGroups: repeated.length,
      rawRepeatGroupsNoLongerRepeated: resolvedRepeats.length,
      rawRepeatGroupsStillRepeated: unresolvedRepeats.length,
      rawMissingPreparations: (raw.signals.missingPreparation ?? []).length,
      rawUnnumberedPreparations: (raw.signals.unnumberedPreparation ?? []).length,
      rawEmptyPreparations: (raw.signals.emptyPreparation ?? []).length,
      projectedMissingPreparations: missingPreparation.length,
      rawMissingPreparationNoLongerVisible: rawMissingPreparationNoLongerVisible.length,
      publicMissingPreparationNotInRaw: publicMissingPreparationNotInRaw.length,
      rawMissingTimes: raw.signals.missingTime.length,
      rawInvalidTimes: (raw.signals.invalidTime ?? []).length,
      rawDuplicateTimeKeys: (raw.signals.duplicateTimeKeys ?? []).length,
      projectedMissingTimes: missingTime.length,
      rawMissingTimesNoLongerVisible: rawMissingTimeNoLongerVisible.length,
      publicMissingTimesNotInRaw: publicMissingTimeNotInRaw.length,
    },
    visible: { genericDescriptions: generic, repeatedSteps: repeated, missingTime, missingPreparation },
    sourceOnly: {
      genericNoLongerVisible: rawGenericNoLongerVisible,
      repeatGroupsNoLongerRepeated: resolvedRepeats,
      repeatedRawGroupsStillVisible: unresolvedRepeats,
      publicGenericNotInRaw,
      rawMissingTimeNoLongerVisible,
      publicMissingTimeNotInRaw,
      rawMissingPreparationNoLongerVisible,
      publicMissingPreparationNotInRaw,
      unnumberedPreparation: raw.signals.unnumberedPreparation ?? [],
      emptyPreparation: raw.signals.emptyPreparation ?? [],
      invalidTime: raw.signals.invalidTime ?? [],
      duplicateTimeKeys: raw.signals.duplicateTimeKeys ?? [],
    },
  };
}
export function toMarkdown(report: ReturnType<typeof compareInventories>): string {
  const t = report.totals;
  const lines = [
    "# Recipavo #327 – raakalähteen ja julkisen esityksen vertailu", "",
    "**Julkinen = testatun buildin RecipeEntry, ei Cloudflare-HTTP-tarkistus.** Tulokset ovat heuristisia, eivät julkaisu-/ravintohyväksyntöjä.", "",
    "Tarkistettu " + t.rawPublishedFiReviewed + " raakaa FI-lähdettä ja " +
      t.projectedFiRecipes + " rakennettua FI-reseptitietuetta.", "",
    "| Signaali | Raakalähde | Rakennettu julkinen esitys |", "|---|---:|---:|",
    "| Geneerinen johdanto/kuvaus | " + t.rawGenericLeads + " | " + t.projectedGenericDescriptions + " |",
    "| Sama pitkä valmistusvaihe vähintään kahdessa reseptissä (ryhmiä) | " +
      t.rawRepeatedStepGroups + " | " + t.projectedRepeatedStepGroups + " |",
    "| Johdanto toistettu Kuvaus-osiossa | " + t.sourceOnlyDuplicateDescriptions +
      " | Ei vastaavaa kahden tekstikentän rakennetta |",
    "| Numeroitu valmistus puuttuu / esityksen ohje tyhjä | " +
      t.rawMissingPreparations + " | " + t.projectedMissingPreparations + " |",
    "| Valmistus on tekstinä ilman tunnistettua numerointia | " +
      t.rawUnnumberedPreparations + " | Ei vastaavaa numerointivaatimusta |",
    "| Raakalähteen valmistusosio puuttuu tai on tyhjä | " +
      t.rawEmptyPreparations + " | Ei erillistä osiorakennetta |",
    "| Kokonaisaika puuttuu | " + t.rawMissingTimes + " | " + t.projectedMissingTimes + " |",
    "| Virheellinen kokonaisaikamerkintä | " + t.rawInvalidTimes + " | Ei erillistä raakakenttää |",
    "| Kokonaisaika määritelty useammin kuin kerran | " + t.rawDuplicateTimeKeys + " | Ei erillistä raakakenttää |", "",
    "Raakatekstin geneerisistä osumista " + t.rawGenericNoLongerVisible +
      " ei näy enää geneerisinä. Raakatekstin toistoryhmistä " +
      t.rawRepeatGroupsNoLongerRepeated + " ei enää esiinny vähintään kahdessa julkisessa FI-reseptissä.", "",
    "## Julkisessa esityksessä jäljellä olevat geneeriset kuvaukset", "",
  ];
  for (const item of report.visible.genericDescriptions) {
    lines.push("- " + item.recipeId + " (" + item.routePath + "), lähde " +
      item.path + " (SHA-256 " + item.sourceSha256 + ")");
  }
  if (!report.visible.genericDescriptions.length) lines.push("Ei osumia.");
  lines.push("", "## Julkisen esityksen pitkät toistuvat vaiheet", "");
  for (const group of report.visible.repeatedSteps) {
    lines.push("- **" + group.recipes.length + " reseptiä:** " + group.phrase.slice(0, 170));
    for (const item of group.recipes) lines.push("  - " + item.recipeId + " (" + item.routePath + ")");
  }
  if (!report.visible.repeatedSteps.length) lines.push("Ei osumia.");
  lines.push("", "Raakalähteen puuttuvien kokonaisaikojen luku sisältää myös virheelliset arvot; alla eriteltyjä joukkoja ei tule laskea yhteen.", "");
  lines.push("", "## Raakalähteen virheelliset kokonaisaikamerkinnät", "");
  for (const item of report.sourceOnly.invalidTime) {
    lines.push("- " + item.recipeId + ", lähde " + item.path +
      " (SHA-256 " + item.sourceSha256 + "), raakaarvo " + JSON.stringify(item.rawValue));
  }
  if (!report.sourceOnly.invalidTime.length) lines.push("Ei osumia.");
  lines.push("", "## Raakalähteen kahteen kertaan määritellyt kokonaisajat", "");
  for (const item of report.sourceOnly.duplicateTimeKeys) {
    lines.push("- " + item.recipeId + ", lähde " + item.path +
      " (SHA-256 " + item.sourceSha256 + "), raakaarvot " + JSON.stringify(item.rawValue));
  }
  if (!report.sourceOnly.duplicateTimeKeys.length) lines.push("Ei osumia.");
  lines.push("", "## Lähteen puuttuvat tai tyhjät valmistusosiot", "");
  for (const item of report.sourceOnly.emptyPreparation) {
    lines.push("- " + item.recipeId + ", lähde " + item.path +
      " (SHA-256 " + item.sourceSha256 + ")");
  }
  if (!report.sourceOnly.emptyPreparation.length) lines.push("Ei osumia.");
  lines.push("", "## Lähteen numeroimattomat valmistusohjeet", "");
  for (const item of report.sourceOnly.unnumberedPreparation) {
    lines.push("- " + item.recipeId + ", lähde " + item.path +
      " (SHA-256 " + item.sourceSha256 + ")");
  }
  if (!report.sourceOnly.unnumberedPreparation.length) lines.push("Ei osumia.");
  lines.push("", "Numeroimaton ohje ei itsessään merkitse puuttuvaa tai käyttökelvotonta valmistusohjetta.", "");
  lines.push("", "## Julkisesta esityksestä puuttuvat valmistusohjeet", "");
  for (const item of report.visible.missingPreparation) {
    lines.push("- " + item.recipeId + " (" + item.routePath + "), lähde " +
      item.path + " (SHA-256 " + item.sourceSha256 + ")");
  }
  if (!report.visible.missingPreparation.length) lines.push("Ei osumia.");
  lines.push("", "Raakalähteen numeroitu valmistus puuttui mutta julkisessa esityksessä ohje löytyi " +
    t.rawMissingPreparationNoLongerVisible + " reseptissä. Julkisen esityksen tyhjiä ohjeita, joita raakainventaario ei tunnistanut, on " +
    t.publicMissingPreparationNotInRaw + ". Havainto ei ole kokki- tai julkaisuhyväksyntä.", "",
    "### Julkisessa esityksessä uutena tyhjät valmistusohjeet", "");
  for (const item of report.sourceOnly.publicMissingPreparationNotInRaw) {
    lines.push("- " + item.recipeId + " (" + item.routePath + "), lähde " +
      item.path + " (SHA-256 " + item.sourceSha256 + ")");
  }
  if (!report.sourceOnly.publicMissingPreparationNotInRaw.length) lines.push("Ei osumia.");
  lines.push("", "## Julkisesta esityksestä puuttuvat kokonaisajat", "");
  for (const item of report.visible.missingTime) {
    lines.push("- " + item.recipeId + " (" + item.routePath + "), lähde " +
      item.path + " (SHA-256 " + item.sourceSha256 + ")");
  }
  if (!report.visible.missingTime.length) lines.push("Ei osumia.");
  lines.push("",
    "Alkuperäisestä FI-lähteestä puuttunut kokonaisaika on julkisessa esityksessä täytetty " +
      t.rawMissingTimesNoLongerVisible + " reseptissä. Julkisessa esityksessä uutena puuttuvia aikoja on " +
      t.publicMissingTimesNotInRaw + ". Tämä on erotushavainto, ei automaattinen aikahyväksyntä.", "",
    "### Julkisessa esityksessä uutena puuttuvat ajat", "");
  for (const item of report.sourceOnly.publicMissingTimeNotInRaw) {
    lines.push("- " + item.recipeId + " (" + item.routePath + "), lähde " +
      item.path + " (SHA-256 " + item.sourceSha256 + ")");
  }
  if (!report.sourceOnly.publicMissingTimeNotInRaw.length) lines.push("Ei osumia.");
  lines.push("", "## Jatkotoimi", "",
    "1. Katselmoi ensin julkisessa esityksessä todella näkyvät osumat.",
    "2. Älä korjaa historiallista raakatekstiä vain siksi, että se on jo SHA-lukitussa esityskerroksessa korjattu.",
    "3. Kumpikaan joukko ei todista kokkivirhettä. Puuttuvaa aikaa tai ravinto-/GK-arvoa ei arvata.",
    "4. Cloudflare-tuotannon versio varmistetaan erikseen hyväksyttyä release-artefaktia vasten.", "");
  return lines.join("\n");
}

async function main(): Promise<void> {
  if (process.argv.includes("--help")) {
    console.log("Run after content:sync: npx tsx scripts/editorial-public-audit.ts");
    return;
  }
  if (process.argv.length > 2) throw new Error("Unknown arguments");
  const root = path.resolve(import.meta.dirname, "../..");
  const dir = path.join(root, "tmp", "editorial-inventory");
  const raw = JSON.parse(await readFile(path.join(dir, "current.json"), "utf8")) as RawInventory;
  const { siteContent } = await import("../src/generated/content.generated");
  const report = compareInventories(raw, siteContent.recipes);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "public-current.json"), JSON.stringify(report, null, 2) + "\n");
  await writeFile(path.join(dir, "public-current.md"), toMarkdown(report) + "\n");
  console.log(JSON.stringify(report.totals, null, 2));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}

/**
 * #327: source-vs-public text quality signals. Run only after content:sync.
 * Writes advisory JSON/Markdown to tmp/, not recipes or release approvals.
 */
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { RecipeEntry } from "../src/types/content";

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
  };
};
export type PublicRecipe = Pick<RecipeEntry,
  "recipeId" | "locale" | "routePath" | "description" | "instructionsText" | "timeTotalMin">;
type PublicEvidence = Evidence & { routePath: string };

const GENERIC = /t(?:ä|a)ss(?:ä|a) kotikeitti(?:ö|o)(?:ö|o)n sovitetussa/i;
function canonical(value: string): string {
  return value.normalize("NFKC").toLocaleLowerCase("fi").replace(/\s+/g, " ")
    .replace(/[.,!?;:“”"'()\-–—]/g, "").replace(/\s+/g, " ").trim();
}

function publicRepeatedSteps(fi: readonly PublicRecipe[], sources: Map<string, Evidence>) {
  const groups = new Map<string, Map<string, PublicEvidence>>();
  for (const recipe of fi) {
    for (const text of recipe.instructionsText) {
      const phrase = canonical(text);
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
  const fi = recipes.filter(recipe => recipe.locale === "fi");
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
    recipe.recipeId, new Set(recipe.instructionsText.map(canonical)),
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
  const missingTime = fi.filter(recipe => recipe.timeTotalMin === null).map(enrich);
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
      projectedMissingTimes: missingTime.length,
    },
    visible: { genericDescriptions: generic, repeatedSteps: repeated, missingTime },
    sourceOnly: {
      genericNoLongerVisible: rawGenericNoLongerVisible,
      repeatGroupsNoLongerRepeated: resolvedRepeats,
      repeatedRawGroupsStillVisible: unresolvedRepeats,
      publicGenericNotInRaw,
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
    "| Kokonaisaika puuttuu | – | " + t.projectedMissingTimes + " |", "",
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

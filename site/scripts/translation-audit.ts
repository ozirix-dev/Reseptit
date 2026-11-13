import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import type { z } from "zod";
import { semanticTermErrors, semanticProseErrors, semanticNoteErrors, semanticTagErrors } from "./semantic-terms";
import { assertTranslationSourceIsNotQuarantined, loadTranslationPublicationIndex, overlayTranslationPublicationIndex } from "./translation-publication-index";
import { assertF25SourceReleaseAuthorized } from "./f25-source-release-gate";
import { projectReviewedFiEditorialSource } from "./gk80-editorial-display";
import { projectA8FiEditorialSource } from "./a8-editorial-display";
import { projectC20FiDisplay, c20FiDisplayPaths } from "./c20-fi-editorial-display";
import { breakfastFiQualityPaths, projectBreakfastFiQualityDisplay } from "./fi-breakfast-quality-display";

import { projectC13FiDisplay } from "./c13-fi-public-display";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const sourceCategories = ["alkuruoat", "paaruoat", "jalkiruoat", "leivonnaiset", "aamupalat", "valipalat"] as const;
const locales = ["en", "sv", "th"] as const;
type Locale = typeof locales[number];
type Frontmatter = z.infer<typeof recipeFrontmatterSchema>;

export interface TranslationAuditRow {
  recipe_id: string;
  locale: Locale;
  source_path: string;
  translation_path: string;
  ingredient_check: string;
  instruction_check: string;
  metadata_check: string;
  image_check: string;
  language_review: string;
  issues: string;
  risk_level: "low" | "medium" | "high";
  review_status: string;
}

export interface TranslationAuditResult {
  publishedSources: { path: string; data: Frontmatter; content: string }[];
  publishedTranslations: { path: string; data: Frontmatter; content: string }[];
  rows: TranslationAuditRow[];
  errors: string[];
}

export async function markdownFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true }).catch((error: NodeJS.ErrnoException) => {
    if (error.code === "ENOENT") return [];
    throw error;
  });
  const nested = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(fullPath);
    return entry.isFile() && entry.name.endsWith(".md") ? [fullPath] : [];
  }));
  return nested.flat().sort();
}

async function readRecipes(paths: string[], recipeIds?: Set<string>): Promise<{ path: string; data: Frontmatter; content: string }[]> {
  const result: { path: string; data: Frontmatter; content: string }[] = [];
  for (const filePath of paths) {
    const parsed = parseMarkdown(await readFile(filePath, "utf8"));
    if (!parsed) continue; // Empty legacy placeholders are not published recipe versions.
    if (recipeIds && (typeof parsed.data.recipe_id !== "string" || !recipeIds.has(parsed.data.recipe_id))) continue;
    if (parsed.data.status === "draft") continue;
    const checked = recipeFrontmatterSchema.safeParse(parsed.data);
    if (!checked.success) throw new Error(`Invalid recipe metadata in ${filePath}: ${checked.error.message}`);
    if (checked.data.status === "published") result.push({ path: path.relative(repoRoot, filePath).replaceAll("\\", "/"), data: checked.data, content: parsed.content });
  }
  return result;
}

function canonicalUnit(unit: string, locale: string): string | null {
  const normalized = unit.trim().toLocaleLowerCase().replaceAll(".", "");
  if (["", "kpl", "kpl.", "pc", "pcs", "piece", "pieces", "each", "clove", "cloves", "st", "st.", "stk", "stk.", "ลูก", "กลีบ", "ฟอง", "ชิ้น", "ผล", "หัว"].includes(normalized)) return "each";
  const common: Record<string, string> = {
    g: "g", gr: "g", กรัม: "g", kg: "kg", ml: "ml", dl: "dl", เดซิลิตร: "dl", l: "l", ลิตร: "l", cl: "cl", เซนติเมตร: "cm",
    viipaletta: "slice", viipale: "slice", slices: "slice", slice: "slice", skivor: "slice", skiva: "slice", แผ่น: "slice",
    arkkia: "sheet", arkki: "sheet", sheets: "sheet", sheet: "sheet", ark: "sheet", แผ่นแป้ง: "sheet",
    nippua: "bunch", nippu: "bunch", bunches: "bunch", bunch: "bunch", buntar: "bunch", knippen: "bunch", กำ: "bunch",
    annosta: "serving", annos: "serving", servings: "serving", portion: "serving", portions: "serving", portioner: "serving", ที่: "serving",
    lehteä: "leaf", blad: "leaf", leaves: "leaf", leaf: "leaf", ใบ: "leaf",
    siivua: "slice", แว่น: "slice",
    ruukku: "pot", pot: "pot", kruka: "pot", กระถาง: "pot",
  };
  if (common[normalized]) return common[normalized];
  const localized: Record<string, Record<string, string>> = {
    fi: { tl: "tsp", rkl: "tbsp", ripaus: "pinch" },
    en: { tsp: "tsp", teaspoon: "tsp", teaspoons: "tsp", tbsp: "tbsp", tablespoon: "tbsp", tablespoons: "tbsp", pinch: "pinch" },
    sv: { tsk: "tsp", msk: "tbsp", krm: "pinch", nypa: "pinch" },
    th: { ช้อนชา: "tsp", ช้อนโต๊ะ: "tbsp", หยิบมือ: "pinch" },
  };
  return localized[locale]?.[normalized] ?? null;
}

function hasIngredient(source: Frontmatter, pattern: RegExp): boolean {
  return source.ingredients.some((ingredient) => pattern.test(ingredient.item));
}

function instructionSection(content: string): string {
  const heading = /^##\s+(?:Valmistus|Preparation|Instructions|Tillagning|Gör så här|การทำ|วิธีทำ)\s*$/im.exec(content);
  if (!heading || heading.index === undefined) return "";
  const start = heading.index + heading[0].length;
  const next = content.slice(start).search(/^##\s+/m);
  return content.slice(start, next < 0 ? undefined : start + next).trim();
}

function instructionFacts(instructions: string): string[] {
  const text = instructions.replaceAll(",", ".");
  const facts: string[] = [];
  const temperatures = /(?<![\p{L}\p{N}])(\d+(?:\.\d+)?)\s*(?:°\s*C|degrees?\s*(?:C(?:elsius)?)?|grader|asteeseen|asteessa|asteen|องศา(?:เซลเซียส)?)(?![A-Za-z])/giu;
  for (const match of text.matchAll(temperatures)) facts.push(`temperature:${Number(match[1])}C`);
  const duration = /(?<![\p{L}\p{N}])(\d+(?:\.\d+)?(?:\s*[-–]\s*\d+(?:\.\d+)?)?)\s*(minutes?|mins?|minuter|minuterna|min|timmar|timme|hours?|hr|h|minuuttia|minuutti|minuutin|tuntia|tunti|tunnin|นาที|ชั่วโมง)(?![A-Za-z])/giu;
  const normalizeRange = (value: string) => value.replaceAll(/\s+/g, "").replaceAll("–", "-");
  const normalizeDurationUnit = (unit: string) => /^(?:h|hr|hours?|timme|timmar|tunti|tuntia|tunnin|ชั่วโมง)$/iu.test(unit) ? "hour" : "minute";
  for (const match of text.matchAll(duration)) facts.push(`duration:${normalizeRange(match[1])}:${normalizeDurationUnit(match[2])}`);
  return facts;
}

export function knownTermErrors(source: Frontmatter, target: Frontmatter, locale: Locale, targetContent: string): string[] {
  const items = target.ingredients.map((ingredient) => ingredient.item);
  const allItems = items.join(" | ");
  const issues: string[] = [];
  issues.push(...semanticTermErrors(source.ingredients.map((item) => item.item), items, locale));
  issues.push(...semanticNoteErrors(source.ingredients.map((item) => item.note ?? ""), target.ingredients.map((item) => item.note ?? ""), locale));
  issues.push(...semanticTagErrors(source.tags, target.tags, locale));
  issues.push(...semanticProseErrors(source.recipe_id, locale, `${target.title}\n${targetContent}\n${target.image?.alt ?? ""}`));
  if (locale === "th" && hasIngredient(source, /kalafondi/i) && /ฟองดู(?:ว์)?ปลา|น้ำสต[็๊]อกข้าว/.test(`${target.title}\n${targetContent}\n${target.image?.alt ?? ""}`)) {
    issues.push("fish stock concentrate mistranslated in Thai prose");
  }
  const exactBad = {
    en: [/^win$/i, /^wow$/i, /^field$/i],
    sv: [/^vinna$/i, /^wow$/i],
    th: [/^ชนะ$/, /^ว้าว$/, /^ฟิลด์$/],
  }[locale];
  for (const bad of exactBad) if (items.some((item) => bad.test(item.trim()))) issues.push(`known mistranslated ingredient term: ${bad.source}`);
  if (locale === "en" && hasIngredient(source, /\bvoi(?:ta)?\b/i) && /\bwin\b/i.test(allItems)) issues.push("butter mistranslated as win");
  if (locale === "sv" && hasIngredient(source, /\bvoi(?:ta)?\b/i) && /\bvinna\b/i.test(allItems)) issues.push("butter mistranslated as vinna");
  if (locale === "th" && hasIngredient(source, /\bvoi(?:ta)?\b/i) && /ชนะ/.test(allItems)) issues.push("butter mistranslated as ชนะ");
  if (locale === "th" && hasIngredient(source, /valkokaali/i) && /ผักกาดขาว/.test(allItems)) issues.push("white cabbage mistranslated as Chinese cabbage");
  if (locale === "th" && hasIngredient(source, /naudan jauheliha/i) && /เนื้อดิน/.test(allItems)) issues.push("beef mince translated ambiguously as เนื้อดิน");
  if (locale === "en" && hasIngredient(source, /kuohukerma/i) && items.some((item) => /\bwhipped cream\b/i.test(item))) issues.push("liquid whipping cream translated as ready-whipped cream");
  if (locale === "sv" && hasIngredient(source, /kuohukerma/i) && items.some((item) => /\bvispad grädde\b/i.test(item))) issues.push("liquid vispgrädde translated as ready-whipped cream");
  if (locale === "en" && hasIngredient(source, /kuohukerma/i) && /\bwhipped cream\b/i.test(targetContent)) issues.push("recipe text calls for ready-whipped cream instead of liquid cream");
  if (locale === "sv" && hasIngredient(source, /kuohukerma/i) && /\bvispad grädde\b/i.test(targetContent)) issues.push("recipe text calls for ready-whipped cream instead of liquid cream");
  if (locale === "en" && /kalafondi/i.test(source.ingredients.map((ingredient) => ingredient.item).join(" ")) && /fish fondue/i.test(`${target.title} ${targetContent}`)) issues.push("fish fondue is a mistranslation of stock concentrate");
  if (locale === "en" && hasIngredient(source, /naudan jauheliha/i) && /\bground meat\b/i.test(target.title) && !/\bground beef\b/i.test(target.title)) issues.push("English title omits the source's beef type");
  if (locale === "en" && hasIngredient(source, /naudan pataliha/i) && items.some((item) => /\bbeef patty\b/i.test(item))) issues.push("beef stewing meat mistranslated as a formed patty");
  if (locale === "en" && hasIngredient(source, /porsaan pataliha/i) && items.some((item) => /\bpork patty\b/i.test(item))) issues.push("pork stewing meat mistranslated as a formed patty");
  if (locale === "sv" && hasIngredient(source, /naudan pataliha/i) && items.some((item) => /\bnötbiff\b/i.test(item))) issues.push("beef stewing meat mistranslated as steak");
  if (locale === "sv" && hasIngredient(source, /porsaan pataliha/i) && items.some((item) => /\bfläskbiff\b/i.test(item))) issues.push("pork stewing meat mistranslated as steak");
  if (locale === "th" && hasIngredient(source, /naudan pataliha/i) && items.some((item) => /ขนมพายเนื้อ/.test(item))) issues.push("beef stewing meat mistranslated as a meat pie");
  if (locale === "th" && hasIngredient(source, /porsaan pataliha/i) && items.some((item) => /ไส้หมู/.test(item))) issues.push("pork stewing meat mistranslated as sausage filling");
  if (locale === "en" && /kaalilaatikko/i.test(source.title) && /cabbage box/i.test(`${target.title} ${targetContent} ${target.image?.alt ?? ""}`)) issues.push("cabbage box is not a natural translation of cabbage casserole");
  if (locale === "th" && /kaalilaatikko/i.test(source.title) && /กะหล่ำปลีกล่อง/.test(`${target.title} ${targetContent}`)) issues.push("literal cabbage-box phrasing is not a natural dish name");
  return [...new Set(issues)];
}

export function projectTranslationAuditSource(file: string, raw: string): string {
  if (file === "reseptit/aamupalat/indialainen-poha-maapahkinoilla.md" ||
      file === "reseptit/aamupalat/lahi-ita-manakish-zaatarilla.md" ||
      file === "reseptit/aamupalat/valimerellinen-halloumi-tomaattileipa.md")
    return projectC13FiDisplay(file, raw);
  return projectBreakfastFiQualityDisplay(file, raw);
}

export async function auditTranslations(recipeIds?: string[]): Promise<TranslationAuditResult> {
  const filter = recipeIds ? new Set(recipeIds) : undefined;
  const sourcePaths = (await Promise.all(sourceCategories.map((category) => markdownFiles(path.join(repoRoot, "reseptit", category))))).flat();
  const rawSources = await readRecipes(sourcePaths, filter);
  // Use the exact SHA-locked public FI display when auditing meaning and
  // generating source semantic hashes for translations. Raw FI files stay
  // untouched for the separate nutrition/GK and source-blob validation.
  // C13 is used for the recipes whose translations follow the reviewed public methods.
  const publicSources = await Promise.all(rawSources.map(async (source) => {
    const useC13Display = source.path === "reseptit/aamupalat/indialainen-poha-maapahkinoilla.md" ||
      source.path === "reseptit/aamupalat/lahi-ita-manakish-zaatarilla.md" ||
      source.path === "reseptit/aamupalat/valimerellinen-halloumi-tomaattileipa.md";
    if (!useC13Display && !breakfastFiQualityPaths.includes(source.path)) return source;
    const raw = await readFile(path.join(repoRoot, source.path), "utf8");
    const projected = parseMarkdown(projectTranslationAuditSource(source.path, raw));
    if (!projected) throw Error("FI_BREAKFAST_AUDIT_NO_FRONTMATTER: " + source.path);
    const displayed = recipeFrontmatterSchema.parse(projected.data);
    const original = source.data;
    const stableImage = (image: typeof original.image) =>
      image ? { ...image, alt: "" } : null;
    if (displayed.recipe_id !== original.recipe_id || displayed.url_slug !== original.url_slug ||
        displayed.category !== original.category || displayed.language !== "fi" ||
        displayed.status !== "published" || displayed.servings !== original.servings ||
        displayed.time_total_min !== original.time_total_min ||
        displayed.diet_class !== original.diet_class ||
        JSON.stringify(displayed.ingredients) !== JSON.stringify(original.ingredients) ||
        JSON.stringify(stableImage(displayed.image)) !== JSON.stringify(stableImage(original.image)) ||
        (["carbs_net_per_serving_g","carbs_total_per_serving_g","protein_per_serving_g","fat_per_serving_g"] as const)
          .some(key => displayed[key] !== original[key])) {
      throw Error("FI_BREAKFAST_AUDIT_SOURCE_DRIFT: " + source.path);
    }
    return { path: source.path, data: displayed, content: projected.content };
  }));
  const sources = overlayTranslationPublicationIndex(publicSources, await loadTranslationPublicationIndex(repoRoot), filter);
  const translations = (await Promise.all(locales.map((locale) => markdownFiles(path.join(repoRoot, "kaannokset", locale))))).flat();
  const publishedTranslations = await readRecipes(translations, filter);
  // Fail closed even for standalone published language files absent from the sidecar.
  // Raw FI status: published does not override the public recipe quarantine.
  for (const translation of publishedTranslations) {
    assertTranslationSourceIsNotQuarantined(translation.data.recipe_id);
    assertF25SourceReleaseAuthorized(translation.data.recipe_id);
  }
  // Compare the coconut-rice preparation metadata to its SHA-pinned public FI
  // version without ever changing the GK80-sealed raw source used by SHA review.
  const reviewedMethods = new Map<string, readonly string[]>();
  for (const source of sources) {
    if (source.path !== "reseptit/aamupalat/thai-kookosriisi-mangolla.md") continue;
    const raw = await readFile(path.join(repoRoot, source.path), "utf8");
    const projected = parseMarkdown(projectReviewedFiEditorialSource(source.path, raw));
    if (!projected) throw Error("EDITORIAL_COOKING_METHOD_NO_FRONTMATTER");
    const publicData = recipeFrontmatterSchema.parse(projected.data);
    if (publicData.recipe_id !== source.data.recipe_id ||
        JSON.stringify(publicData.cooking_method) !== JSON.stringify(["keittäminen"])) {
      throw Error("EDITORIAL_COOKING_METHOD_NOT_REVIEWED");
    }
    reviewedMethods.set(source.data.recipe_id, publicData.cooking_method ?? []);
  }
  // A8 contains two *known and version-locked* historical FI metadata faults.
  // Validate the original source before comparing translations to the public FI
  // projection. Never overwrite a canonical source hash or nutrition evidence.
  const reviewedTimes = new Map<string, number>();
  for (const source of sources) {
    const isJerk = source.path === "reseptit/paaruoat/jerk-kana.md";
    const isShoyu = source.path === "reseptit/paaruoat/shoyu-kanakeitto-konjac.md";
    if (!isJerk && !isShoyu) continue;
    const originalRaw = await readFile(path.join(repoRoot, source.path), "utf8");
    const projected = parseMarkdown(projectA8FiEditorialSource(source.path, originalRaw));
    if (!projected) throw new Error("A8_AUDIT_NO_PUBLIC_FI_FRONTMATTER: " + source.path);
    const publicData = recipeFrontmatterSchema.parse(projected.data);
    if (publicData.recipe_id !== source.data.recipe_id ||
        publicData.language !== "fi" ||
        publicData.servings !== source.data.servings ||
        publicData.ingredients.length !== source.data.ingredients.length ||
        publicData.ingredients.some((item, index) => item.amount !== source.data.ingredients[index].amount ||
          item.unit !== source.data.ingredients[index].unit) ||
        (["carbs_net_per_serving_g","carbs_total_per_serving_g","protein_per_serving_g","fat_per_serving_g"] as const)
          .some((field) => publicData[field] !== source.data[field])) {
      throw new Error("A8_AUDIT_PUBLIC_FI_NUTRITION_DRIFT: " + source.path);
    }
    if (isJerk) {
      if (source.data.time_total_min !== 90 || publicData.time_total_min !== 130 ||
          JSON.stringify(publicData.cooking_method) !== JSON.stringify(source.data.cooking_method)) {
        throw new Error("A8_AUDIT_JERK_TIME_NOT_REVIEWED");
      }
      reviewedTimes.set(source.data.recipe_id, 130);
    } else {
      if (JSON.stringify(source.data.cooking_method) !== JSON.stringify(["paistaminen"]) ||
          JSON.stringify(publicData.cooking_method) !== JSON.stringify(["keittäminen"]) ||
          publicData.time_total_min !== source.data.time_total_min) {
        throw new Error("A8_AUDIT_SHOYU_METHOD_NOT_REVIEWED");
      }
      reviewedMethods.set(source.data.recipe_id, publicData.cooking_method ?? []);
    }
  }
  // Three narrowly reviewed, exact-raw-SHA C20 FI display corrections.
  for (const source of sources) {
    if (!c20FiDisplayPaths.includes(source.path)) continue;
    const raw = await readFile(path.join(repoRoot, source.path), "utf8");
    const displayed = parseMarkdown(projectC20FiDisplay(source.path, raw));
    if (!displayed) throw Error("C20_FI_DISPLAY_NO_FRONTMATTER");
    const d = recipeFrontmatterSchema.parse(displayed.data);
    const original = source.data;
    if (d.recipe_id !== original.recipe_id || d.language !== "fi" || d.status !== "published" ||
        d.servings !== original.servings || d.category !== original.category ||
        JSON.stringify(d.ingredients) !== JSON.stringify(original.ingredients) ||
        JSON.stringify(d.image) !== JSON.stringify(original.image) ||
        (["carbs_net_per_serving_g", "carbs_total_per_serving_g", "protein_per_serving_g", "fat_per_serving_g"] as const)
          .some(key => d[key] !== original[key])) throw Error("C20_FI_DISPLAY_NUTRITION_DRIFT: " + source.path);
    if (source.path.includes("kevatsipulipannukakku")) {
      if (d.time_total_min !== 35 || original.time_total_min !== 25 ||
          JSON.stringify(d.cooking_method) !== JSON.stringify(original.cooking_method)) throw Error("C20_FI_DISPLAY_TIME_REVIEW_FAIL");
      reviewedTimes.set(original.recipe_id, 35);
    } else {
      if (original.cooking_method?.join("|") !== "paistaminen" || d.cooking_method?.join("|") !== "keittäminen" ||
          d.time_total_min !== original.time_total_min) throw Error("C20_FI_DISPLAY_METHOD_REVIEW_FAIL");
      reviewedMethods.set(original.recipe_id, d.cooking_method ?? []);
    }
  }
  return auditRecipePairs(sources, publishedTranslations, reviewedMethods, reviewedTimes);
}

export function auditRecipePairs(
  allSources: TranslationAuditResult["publishedSources"],
  allTranslations: TranslationAuditResult["publishedTranslations"],
  reviewedMethods: ReadonlyMap<string, readonly string[]> = new Map(),
  reviewedTimes: ReadonlyMap<string, number> = new Map(),
): TranslationAuditResult {
  const sources = allSources.filter((r) => r.data.status === "published");
  const publishedTranslations = allTranslations.filter((r) => r.data.status === "published");
  const sourcesById = new Map(sources.map((recipe) => [recipe.data.recipe_id, recipe]));
  const translationsByIdLocale = new Map(publishedTranslations.map((recipe) => [`${recipe.data.recipe_id}:${recipe.data.language}`, recipe]));
  const errors: string[] = [];
  const rows: TranslationAuditRow[] = [];
  const entries = [...sources, ...publishedTranslations];
  const ids = new Map<string, number>();
  const routes = new Map<string, number>();
  for (const entry of entries) {
    const key = `${entry.data.recipe_id}:${entry.data.language}`, route = `${entry.data.language}:${entry.data.url_slug}`;
    ids.set(key, (ids.get(key) ?? 0) + 1); routes.set(route, (routes.get(route) ?? 0) + 1);
  }
  for (const entry of entries) {
    const key = `${entry.data.recipe_id}:${entry.data.language}`;
    const route = `${entry.data.language}:${entry.data.url_slug}`;
    if (ids.get(key)! > 1) errors.push(`${key}: duplicate published recipe locale`);
    if (routes.get(route)! > 1) errors.push(`${key}: duplicate published route ${route}`);
    if (sources.includes(entry) && entry.data.language !== "fi") errors.push(`${key}: source language must be fi`);
    if (publishedTranslations.includes(entry) && !locales.includes(entry.data.language as Locale)) errors.push(`${key}: unexpected translation language`);
  }

  for (const source of sources) {
    for (const locale of locales) {
      const expectedStatus = source.data.translation_status?.[locale];
      const translation = translationsByIdLocale.get(`${source.data.recipe_id}:${locale}`);
      if (!translation) {
        if (expectedStatus === "published") errors.push(`${source.data.recipe_id}:${locale}: source marks translation published but no published file exists`);
        continue;
      }
      const target = translation.data;
      const issues: string[] = [];
      if (expectedStatus !== "published") issues.push(`source translation_status for ${locale} is ${expectedStatus ?? "missing"}, expected published`);
      if (!source.data.translation_languages?.includes(locale)) issues.push(`source translation_languages does not list ${locale}`);
      if (target.translation_of !== source.data.recipe_id) issues.push(`translation_of=${target.translation_of ?? "missing"}`);
      if (target.source_recipe !== source.path) issues.push(`source_recipe=${target.source_recipe ?? "missing"}, expected ${source.path}`);
      if (target.source_language !== source.data.language) issues.push(`source_language=${target.source_language ?? "missing"}, expected ${source.data.language}`);
      if (target.language !== locale) issues.push(`language=${target.language}, expected ${locale}`);
      if (target.category !== source.data.category) issues.push(`category=${target.category}, expected ${source.data.category}`);
      if (target.servings !== source.data.servings) issues.push(`servings=${target.servings}, expected ${source.data.servings}`);
      const expectedMethod = reviewedMethods.get(source.data.recipe_id) ?? source.data.cooking_method ?? [];
      if (JSON.stringify(target.cooking_method ?? []) !== JSON.stringify(expectedMethod)) issues.push(`cooking_method=${(target.cooking_method ?? []).join("|") || "missing"}, expected ${expectedMethod.join("|") || "missing"}`);
      if (target.ingredients.length !== source.data.ingredients.length) issues.push(`ingredient count=${target.ingredients.length}, expected ${source.data.ingredients.length}`);
      const comparedCount = Math.min(source.data.ingredients.length, target.ingredients.length);
      for (let index = 0; index < comparedCount; index++) {
        const original = source.data.ingredients[index];
        const translated = target.ingredients[index];
        if (original.amount !== translated.amount) issues.push(`ingredient ${index + 1} amount=${translated.amount}, expected ${original.amount}`);
        const sourceUnit = canonicalUnit(original.unit, "fi");
        const translatedUnit = canonicalUnit(translated.unit, locale);
        if (sourceUnit === null || translatedUnit === null) issues.push(`ingredient ${index + 1} unit not recognized (${original.unit || "∅"} → ${translated.unit || "∅"})`);
        else if (sourceUnit !== translatedUnit) issues.push(`ingredient ${index + 1} unit=${translated.unit || "∅"}, expected equivalent of ${original.unit || "∅"}`);
      }
      const sourceTime = reviewedTimes.get(source.data.recipe_id) ?? source.data.time_total_min ?? null;
      const targetTime = target.time_total_min ?? null;
      if (sourceTime !== targetTime) issues.push(`time_total_min=${targetTime}, expected ${sourceTime}`);
      for (const key of ["carbs_net_per_serving_g", "carbs_total_per_serving_g", "protein_per_serving_g", "fat_per_serving_g"] as const) {
        if ((source.data[key] ?? null) !== (target[key] ?? null)) issues.push(`${key}=${target[key] ?? null}, expected ${source.data[key] ?? null}`);
      }
      if ((source.data.diet_class ?? null) !== (target.diet_class ?? null)) issues.push(`diet_class=${target.diet_class ?? "missing"}, expected ${source.data.diet_class ?? "missing"}`);
      const sourceImage = source.data.image;
      const targetImage = target.image;
      const imageIssues: string[] = [];
      if (sourceImage?.src !== targetImage?.src) imageIssues.push(`image=${targetImage?.src ?? "missing"}, expected ${sourceImage?.src ?? "missing"}`);
      if (sourceImage && targetImage && (sourceImage.width !== targetImage.width || sourceImage.height !== targetImage.height)) {
        imageIssues.push(`image dimensions=${targetImage.width}x${targetImage.height}, expected ${sourceImage.width}x${sourceImage.height}`);
      }
      issues.push(...imageIssues);
      if (target.status !== "published") issues.push(`translation status is ${target.status}, expected published`);
      const sourceInstructions = instructionSection(source.content);
      const targetInstructions = instructionSection(translation.content);
      const sourceStepCount = [...sourceInstructions.matchAll(/^\s*\d+[.)]\s+/gm)].length;
      const targetStepCount = [...targetInstructions.matchAll(/^\s*\d+[.)]\s+/gm)].length;
      if (sourceStepCount !== targetStepCount) issues.push(`instruction step count=${targetStepCount}, expected ${sourceStepCount}`);
      const sourceFacts = instructionFacts(sourceInstructions);
      const targetFacts = instructionFacts(targetInstructions);
      // Validate each numeric cooking fact present in Finnish. Translations may spell out
      // a number or include a temperature omitted from a loosely worded source sentence;
      // those additions are left to semantic review rather than treated as mismatches.
      const missingFacts = sourceFacts.filter((fact) => !targetFacts.includes(fact));
      if (missingFacts.length) issues.push(`instruction temperatures/durations missing from translation (${missingFacts.join(",")}; translation ${targetFacts.join(",")})`);
      issues.push(...knownTermErrors(source.data, target, locale, translation.content));
      const metadataIssues = issues.filter((issue) => /translation_status|translation_languages|translation_of|source_recipe|language=|url_slug=|category=|servings=|cooking_method=|time_total_min|_per_serving_g|diet_class|image=|image dimensions=|translation status/.test(issue));
      const ingredientIssues = issues.filter((issue) => /ingredient/.test(issue));
      const instructionIssues = issues.filter((issue) => /instruction step count|instruction temperatures\/durations/.test(issue));
      const risk = issues.some((issue) => /mistranslat|known mistranslated|beef mince translated|cabbage mistranslated|whipped cream translated/.test(issue)) ? "high" : issues.length ? "medium" : "low";
      rows.push({
        recipe_id: source.data.recipe_id, locale, source_path: source.path, translation_path: translation.path,
        ingredient_check: ingredientIssues.length ? "FAIL" : "STRUCTURE PASS; wording not semantically proven",
        instruction_check: instructionIssues.length ? "FAIL" : "STEP COUNT/TIME/TEMPERATURE PASS; semantics not fully verified",
        metadata_check: metadataIssues.length ? "FAIL" : "PASS",
        image_check: imageIssues.length ? "FAIL" : "PASS; visual audit not automated",
        language_review: "Automated checks only; independent human language review pending",
        issues: issues.join("; "), risk_level: risk,
        review_status: issues.length ? "CORRECTION REQUIRED; HUMAN REVIEW PENDING" : "STRUCTURE PASS; AUTOMATED SEMANTIC REVIEW (known terms); HUMAN REVIEW PENDING",
      });
      for (const issue of issues) errors.push(`${source.data.recipe_id}:${locale}: ${issue}`);
    }
  }
  for (const translation of publishedTranslations) {
    if (!sourcesById.has(translation.data.recipe_id)) errors.push(`${translation.data.recipe_id}:${translation.data.language}: published translation has no Finnish source`);
  }
  return { publishedSources: sources, publishedTranslations, rows, errors };
}

function csv(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export async function writeAuditReports(result: TranslationAuditResult): Promise<void> {
  const reportDir = path.join(repoRoot, "docs", "reports");
  await mkdir(reportDir, { recursive: true });
  const auditColumns: (keyof TranslationAuditRow)[] = ["recipe_id", "locale", "source_path", "translation_path", "ingredient_check", "instruction_check", "metadata_check", "image_check", "language_review", "issues", "risk_level", "review_status"];
  const auditCsv = [auditColumns.map(csv).join(","), ...result.rows.map((row) => auditColumns.map((key) => csv(row[key])).join(","))].join("\n");
  await writeFile(path.join(reportDir, "translation-audit-current.csv"), `${auditCsv}\n`, "utf8");

  const inventoryRows = [
    ...result.publishedSources.map(({ path: sourcePath, data }) => ({ recipe_id: data.recipe_id, source_path: sourcePath, published_locales: ["fi", ...locales.filter((locale) => result.rows.some((row) => row.recipe_id === data.recipe_id && row.locale === locale))].join("|"), language: "fi", title: data.title, servings: data.servings, ingredients: data.ingredients.map((item) => `${item.amount ?? "∅"} ${item.unit} ${item.item}${item.note ? ` (${item.note})` : ""}`).join("; "), nutrition: JSON.stringify({ net_carbs_g: data.carbs_net_per_serving_g ?? null, total_carbs_g: data.carbs_total_per_serving_g ?? null, protein_g: data.protein_per_serving_g ?? null, fat_g: data.fat_per_serving_g ?? null }), time_total_min: data.time_total_min ?? "", cooking_method: (data.cooking_method ?? []).join("|"), diet_class: data.diet_class ?? "", image: data.image?.src ?? "", status: data.status })),
    ...result.publishedTranslations.map(({ path: sourcePath, data }) => ({ recipe_id: data.recipe_id, source_path: sourcePath, published_locales: data.language, language: data.language, title: data.title, servings: data.servings, ingredients: data.ingredients.map((item) => `${item.amount ?? "∅"} ${item.unit} ${item.item}${item.note ? ` (${item.note})` : ""}`).join("; "), nutrition: JSON.stringify({ net_carbs_g: data.carbs_net_per_serving_g ?? null, total_carbs_g: data.carbs_total_per_serving_g ?? null, protein_g: data.protein_per_serving_g ?? null, fat_g: data.fat_per_serving_g ?? null }), time_total_min: data.time_total_min ?? "", cooking_method: (data.cooking_method ?? []).join("|"), diet_class: data.diet_class ?? "", image: data.image?.src ?? "", status: data.status })),
  ].sort((a, b) => a.recipe_id.localeCompare(b.recipe_id) || a.language.localeCompare(b.language));
  const inventoryColumns = ["recipe_id", "source_path", "published_locales", "language", "title", "servings", "ingredients", "nutrition", "time_total_min", "cooking_method", "diet_class", "image", "status"] as const;
  const inventoryCsv = [inventoryColumns.map(csv).join(","), ...inventoryRows.map((row) => inventoryColumns.map((key) => csv(row[key])).join(","))].join("\n");
  await writeFile(path.join(reportDir, "recipe-inventory-current.csv"), `${inventoryCsv}\n`, "utf8");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await auditTranslations();
  if (process.argv.includes("--write-reports")) await writeAuditReports(result);
  console.log(`Finnish sources: ${result.publishedSources.length}; published translations: ${result.publishedTranslations.length}; audited pairs: ${result.rows.length}; issues: ${result.errors.length}`);
  for (const error of result.errors) console.log(`- [BLOCKER] ${error}`);
  if (process.argv.includes("--strict") && result.errors.length) process.exitCode = 1;
}

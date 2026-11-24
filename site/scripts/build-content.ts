import { recipeSeoDescriptions } from "./recipe-seo-descriptions";
import { numberedInstructionSteps } from "./numbered-instruction-steps";
import { applyCopyEdits, reviewedRecipeCopy, reviewedImageNote } from "./public-recipe-copy-r2";
import { projectPublicRecipeMethodCopy, publicIngredientNote, publicRecipeDescription, publicRecipeTitle, reviewedPublicCookingMethod } from "./public-recipe-copy";
import { projectEggMethod, projectIngredientList } from "./public-ingredient-list";
import { siteTarget } from "../src/content/site-target";
import { recipeDifficultyLabel } from "../src/features/recipes/recipe-i18n";
import { createHash } from "node:crypto";
import { marked } from "marked";
import { publicRecipeQualityHold } from "./recipe-quality-holds";
import { projectSafeWontonFiDisplay } from "./wonton-fi-public-display";
import { projectMaterial21FiDisplay } from "./material21-fi-public-display";
import { projectMaterial21MethodsFi } from "./material21-methods-public-display";
import { projectC13FiDisplay } from "./c13-fi-public-display";
import { projectHuevosFiPublicPreparation } from "./huevos-c5-fi-public-preparation";
import { projectJianbingC5FiPublicNote } from "./jianbing-c5-fi-public-note";
import { isPublicRecipeQuarantined } from "./public-recipe-quarantine";
import { projectReviewedFiEditorialSource } from "./gk80-editorial-display";
import { projectA8FiEditorialSource } from "./a8-editorial-display";
import { projectC20FiDisplay } from "./c20-fi-editorial-display";
import { projectMintWholeMilkFiDisplay } from "./d30-fi-mint-milk-display";
import { projectBreakfastFiQualityDisplay } from "./fi-breakfast-quality-display";
import { recipeFacets } from "../src/content/recipe-facets";
import { reviewedDietTagsForSource } from "./reviewed-diet-filters";
import { createAssistantCatalog } from "../src/features/assistant/catalog";
import { mkdir, readdir, readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseMarkdown, renderSafeMarkdown, renderInstructionSteps } from "../src/content/markdown";
import { assertQuantifiedCriticalIngredients, assertUniqueRecipes } from "../src/content/recipe-validation";
import { assertReviewedSnackPublication } from "./snack-publication-review";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { inheritSourceAdditionalCategories } from "../src/content/recipe-categories";
import { assertGlutenFreeReviewRecord } from "./gluten-free-review";
import { homepagePicks } from "../src/features/recipes/home-preview";
import { localeIndexes } from "../src/content/route-data";
import { rebuildPublishedImages } from "../src/content/published-images";
import type { RecipeEntry, RecipeLocale, SiteContentIndex } from "../src/types/content";

const siteDir = path.resolve(import.meta.dirname, "..");
const repoDir = path.resolve(process.env.RECIPE_SOURCE_ROOT ?? path.resolve(siteDir, ".."));
const outputDir = path.join(siteDir, "src", "generated");
const baseUrl = siteTarget.baseUrl;
const imageSourceDir = process.env.PROJECT_IMAGE_ROOT
  ? path.resolve(process.env.PROJECT_IMAGE_ROOT)
  : path.join(repoDir, "kuvat");
const localeBase: Record<RecipeLocale, string> = { fi: "", en: "/en/recipes", sv: "/sv/recept", th: "/th/recipes" };

function routeForRecipe(locale: RecipeLocale, slug: string): string {
  return `${localeBase[locale]}/${slug}/`;
}

async function markdownFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true }).catch((error: NodeJS.ErrnoException) => {
    if (error.code === "ENOENT") return [];
    throw error;
  });
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(fullPath);
    return entry.isFile() && entry.name.endsWith(".md") ? [fullPath] : [];
  }));
  return files.flat();
}

const instructionHeadings = ["Valmistus", "Preparation", "Instructions", "Tillagning", "Gör så här", "การทำ", "วิธีทำ"];
const descriptionHeadings = ["Kuvaus", "Description", "Beskrivning", "คำอธิบาย"];
const noteHeadings = ["Muistiinpanot", "Huomioita", "Notes", "Anteckningar", "หมายเหตุ"];
const nutritionBasisHeading = "Ravintoarvojen laskentaperuste";
const publicNutritionBasis = new Set([
  "karnivore-jauhelihakulho-munalla",
  "karnivore-steak-and-eggs",
  "karnivore-voilohi-pannulla",
]);
const sourceOnlyHeadings = [
  "Ainekset", "Ingredients", "Ingredienser", "ส่วนผสม", "วัตถุดิบ",
  "Täytteet ja kuorrutteet", "Annostus", "Perinne, lähde ja nimeäminen",
  "Tausta ja erottuvuus", "Tausta", "Toimituksellinen alkuperä", "Tekijän tunnustus",
];
const classifiedHeadings = new Set([
  ...instructionHeadings, ...descriptionHeadings, ...noteHeadings, ...sourceOnlyHeadings, nutritionBasisHeading,
].map(heading => heading.toLowerCase()));

function assertClassifiedRecipeSections(markdown: string, file: string): void {
  for (const [, heading] of markdown.matchAll(/^##[ \t]+([^\r\n]+)$/gm)) {
    if (!classifiedHeadings.has(heading.trim().toLowerCase())) {
      throw new Error(`Unclassified public recipe section in ${file}: ${heading.trim()}`);
    }
  }
}

function section(markdown: string, titles: string[]): string {
  const heading = new RegExp(`^##\\s+(?:${titles.join("|")})\\s*$`, "im");
  const match = heading.exec(markdown);
  if (!match || match.index === undefined) return "";
  const start = match.index + match[0].length;
  const next = markdown.slice(start).search(/^##\s+/m);
  return markdown.slice(start, next < 0 ? undefined : start + next).trim();
}

export function recipePreparationSections(markdown: string) {
  return { instructions: section(markdown, instructionHeadings), notes: section(markdown, noteHeadings) };
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function firstDescriptionParagraph(markdown: string): string {
  const first = marked.lexer(markdown).find(token => token.type !== "space");
  if (first?.type !== "paragraph") return "";
  const value = stripHtml(first.text);
  // Weighing protocols and internal fields are instructions or evidence.
  if (/^(?:Punnitse|Weigh|Väg)\b|^ชั่ง|\bcarbs_\w+\b/i.test(value) || /\bHOLD\b/.test(value)) return "";
  return value;
}

export function recipeDescription(
  markdown: string,
  descriptionSection: string,
  locale: RecipeLocale,
  ingredients: { item: string }[],
  { hold, editorial, fallback }: { hold?: string; editorial?: string; fallback?: string } = {},
): string {
  if (hold !== undefined) return hold;
  if (editorial !== undefined) return editorial;
  const lead = markdown.replace(/^\s*#[ \t]+[^\r\n]+/m, "").split(/^#{1,6}[ \t]+/m, 1)[0];
  const isBoilerplate = (value: string) => /familiar finnish (?:food|dish)|rewritten to suit your own kitchen|familiar taste in food is built from simple ingredients|vegetables and creamy ingredients bring juiciness|portion size can be adjusted with the portion counter|tuttu suomalainen ruoka vähähiilihydraattisena kotiversiona|kirjoitettu uudelleen omaan keittiöön sopivaksi|tuttu maku rakentuu yksinkertaisista raaka-aineista|annoskokoa voi säätää reseptin annoslaskurilla/i.test(value);
  // Prefer a useful explicit description, then a useful lead. Older files often
  // contain the same generic copy in both places, so fall back to actual ingredients.
  const useful = [descriptionSection, lead].map(firstDescriptionParagraph).find((value) => value && !isBoilerplate(value));
  if (useful) return useful;
  if (fallback) return fallback;
  const mainIngredients = ingredients.slice(0, 3).map(({ item }) => item);
  const list = mainIngredients.length > 1
    ? `${mainIngredients.slice(0, -1).join(", ")} ${locale === "fi" ? "ja" : locale === "sv" ? "och" : locale === "th" ? "และ" : "and"} ${mainIngredients.at(-1)}`
    : mainIngredients[0] ?? "";
  if (!list) return "";
  return {
    fi: `Valmistuksessa käytetään muun muassa ${list}.`,
    en: `Made with ${list}.`,
    sv: `Tillagas med bland annat ${list}.`,
    th: `เมนูนี้ใช้วัตถุดิบหลัก ได้แก่ ${list}`,
  }[locale];
}


/** Temporary public presentation guard. Do not edit protected nutrition-bound source for safety copy. */
export function publicSafetyHold(recipeId: string, locale: RecipeLocale): { description: string; instructions: string } | null {
  if (recipeId !== "karibia-ackee-ja-suolakala") return null;
  const source = "https://www.fda.gov/food/natural-toxins-food/hypoglycin-and-ackee-fruit";
  const copy: Record<RecipeLocale, { description: string; instructions: string }> = {
    fi: {
      description: "TURVALLISUUSVAROITUS: Tämä ackee- ja suolakalaresepti on keskeneräinen. Älä valmista ruokaa näillä ainesmäärillä: 1 tl suolakalaa ja 1 kpl ackeea eivät ole luotettavia määriä. Käytä vain asianmukaisesti käsiteltyä, syötäväksi tarkoitettua ackee-tuotetta. Kypsymätön ackee sekä siemenet ja kuori ovat vaarallisia; kuumentaminen ei poista hypoglysiini A -toksiinia.",
      instructions: `1. Älä valmista tätä ruokalajia tämän keskeneräisen reseptin ainesmäärien tai alkuperäisten valmistusvaiheiden perusteella.
2. Turvallinen, punnittu resepti sekä suolakalan liotus-/suolanpoisto-ohje on vielä tarkistettava. Älä käytä raakaa tai kypsymätöntä ackeea, siemeniä tai kuorta. FDA: ${source}`,
    },
    en: {
      description: "FOOD SAFETY WARNING: This ackee and saltfish recipe is incomplete. Do not cook from these unreliable ingredient amounts. Only use properly processed ackee intended for consumption. Unripe ackee, its seeds and rind are hazardous; cooking does not destroy hypoglycin A.",
      instructions: `1. Do not cook from the ingredient quantities or preparation steps in this unfinished recipe.
2. A weighed recipe and saltfish desalting instructions are pending review. Never use unripe ackee, its seeds or rind. FDA: ${source}`,
    },
    sv: {
      description: "LIVSMEDELSVARNING: Detta recept med ackee och saltfisk är ofullständigt. Tillaga inte rätten med de opålitliga ingrediensmängderna. Använd endast ackee som har bearbetats på ett säkert sätt för konsumtion. Omogen ackee, kärnor och skal är farliga; upphettning förstör inte hypoglycin A.",
      instructions: `1. Laga inte rätten med mängderna eller tillagningsstegen i detta ofullständiga recept.
2. Ett uppvägt recept och instruktioner för avsaltning av saltfisk återstår att granska. Använd aldrig omogen ackee, kärnor eller skal. FDA: ${source}`,
    },
    th: {
      description: "คำเตือนด้านความปลอดภัยอาหาร: สูตรแอ็กกีและปลาเค็มนี้ยังไม่สมบูรณ์ อย่าปรุงตามปริมาณวัตถุดิบที่ระบุไว้ ใช้เฉพาะเนื้อแอ็กกีที่ผ่านกระบวนการอย่างปลอดภัยสำหรับการบริโภค แอ็กกีที่ยังไม่สุก เมล็ดและเปลือกมีอันตราย ความร้อนไม่สามารถทำลายสารไฮโปไกลซินเอได้",
      instructions: `1. ห้ามทำอาหารตามปริมาณวัตถุดิบหรือขั้นตอนในสูตรที่ยังไม่สมบูรณ์นี้
2. ต้องตรวจสอบสูตรที่ชั่งตวงและวิธีลดความเค็มของปลาเค็มก่อน ห้ามใช้แอ็กกีที่ยังไม่สุก เมล็ดหรือเปลือก แหล่งข้อมูล FDA: ${source}`,
    },
  };
  return copy[locale];
}

// Cooking temperatures were checked against the Finnish originals. Keep the
// historical translation bytes used by the dietary and GK review records.
const englishOvenSourceHashes: Readonly<Record<string, string>> = {
  "kaannokset/en/paaruoat/kermainen-lohipata.md": "fbe274281b5509cafb20c042cec154369a47d32d68496d3109df7a10bb17bb60",
  "kaannokset/en/paaruoat/kreikkalainen-moussaka.md": "e0bfcb4ba808c042741c98a19a37ac00ca3e297c73ebbdc506ec3c07f2f968d3",
};

function projectEnglishOvenTemperatures(relativePath: string, raw: string): string {
  const expectedHash = englishOvenSourceHashes[relativePath];
  if (!expectedHash) return raw;
  const normalized = raw.replaceAll("\r\n", "\n");
  if (createHash("sha256").update(normalized).digest("hex") !== expectedHash) {
    throw new Error("English oven temperature source requires review: " + relativePath);
  }
  return normalized
    .replace("\n1. Heat the oven to 200 degrees.", "\n1. Heat the oven to 200 °C.")
    .replace("\n5. Bake at 190 degrees for", "\n5. Bake at 190 °C for");
}

const editorialProjections = [
  projectEnglishOvenTemperatures,
  projectHuevosFiPublicPreparation,
  projectJianbingC5FiPublicNote,
  projectReviewedFiEditorialSource,
  projectA8FiEditorialSource,
  projectC20FiDisplay,
  projectMintWholeMilkFiDisplay,
  projectBreakfastFiQualityDisplay,
  projectSafeWontonFiDisplay,
  projectMaterial21FiDisplay,
  projectMaterial21MethodsFi,
  projectC13FiDisplay,
];

export function projectPublishedMarkdown(relativePath: string, canonical: string): string {
  return editorialProjections.reduce((text, project) => project(relativePath, text), canonical);
}

async function buildRecipes(): Promise<RecipeEntry[]> {
  const paths = [
    ...await markdownFiles(path.join(repoDir, "reseptit", "aamupalat")),
    ...await markdownFiles(path.join(repoDir, "reseptit", "valipalat")),
    ...await markdownFiles(path.join(repoDir, "reseptit", "alkuruoat")),
    ...await markdownFiles(path.join(repoDir, "reseptit", "paaruoat")),
    ...await markdownFiles(path.join(repoDir, "reseptit", "jalkiruoat")),
    ...await markdownFiles(path.join(repoDir, "reseptit", "leivonnaiset")),
    ...await markdownFiles(path.join(repoDir, "kaannokset")),
  ];
  const recipes: RecipeEntry[] = [];
  const sourceFacets = new Map<string, ReturnType<typeof recipeFacets>>();
  // Finnish sources are enumerated before all translations. Track their real
  // published paths so a changed original invalidates every locale review.
  const finnishSources = new Map<string, string>();
  const publishedImagePaths = new Set<string>();
  const published = [];
  for (const filePath of paths) {
    const relativePath = path.relative(repoDir, filePath).replaceAll("\\", "/");
    const parsed = parseMarkdown(projectPublishedMarkdown(relativePath, await readFile(filePath, "utf8")));
    if (!parsed) continue;
    if (parsed.data.status === "draft") continue;
    // Exact safety quarantine retains sealed source/GK evidence while suppressing public routes.
    if (isPublicRecipeQuarantined(String(parsed.data.recipe_id ?? ""))) continue;
    if (parsed.data.status !== "published") throw new Error(`Recipe status must be draft or published: ${filePath}`);
    const data = recipeFrontmatterSchema.parse(parsed.data);
    published.push({ filePath, relativePath, parsed, data });
  }
  const finnishBySlug = new Map(published.filter(({data}) => data.language === "fi")
    .map(({data}) => [data.url_slug, data.recipe_id]));
  const finnishIngredients = new Map(published.filter(({ data }) => data.language === "fi")
    .map(({ data }) => [data.recipe_id, data.ingredients.map(ingredient => ({
      ...ingredient,
      ...(ingredient.note ? { note: publicIngredientNote(data.recipe_id, "fi", ingredient.note) } : {}),
    }))]));
  const localizedRoutes = new Map(published.map(({data}) =>
    [data.recipe_id + ":" + data.language, routeForRecipe(data.language, data.url_slug)]));
  for (const { filePath, relativePath, parsed, data } of published) {
    // Preserve the reviewed Markdown bytes. Resolve historical self-links in
    // the public projection using the same published routes as the site.
    const publicMarkdown = parsed.content.replace(
      /https:\/\/ozirix-dev\.github\.io\/Reseptit\/([a-z0-9-]+)\//g,
      (_, slug: string) => {
        const id = finnishBySlug.get(slug);
        const route = id && (localizedRoutes.get(id + ":" + data.language) ?? localizedRoutes.get(id + ":fi"));
        if (!route) throw new Error("Historical recipe link has no published target: " + relativePath + " -> " + slug);
        return route;
      },
    );
    if (data.gluten_free === true) {
      const review = data.gluten_free_review!;
      // A fabricated, missing or stale review record cannot turn a recipe into a gluten-free listing.
      const reviewedText = await readFile(path.resolve(repoDir, review.evidence_ref), "utf8");
      const originalText = await readFile(filePath);
      const sourceSha256 = createHash("sha256").update(originalText).digest("hex");
      assertGlutenFreeReviewRecord({
        recipeId: data.recipe_id, language: data.language,
        reviewedAt: review.reviewed_at, reviewer: review.reviewer, sourceSha256,
      }, reviewedText);
    }
    await assertReviewedSnackPublication(data, repoDir, relativePath);
    if (data.language === "fi") {
      sourceFacets.set(data.recipe_id, recipeFacets(data.main_ingredient ?? [], data.tags));
      finnishSources.set(data.recipe_id, filePath);
    }
    const imagePaths = data.image
      ? [data.image.src, ...(data.image.srcset ?? []).map((item) => item.src)]
      : [];
    imagePaths.forEach((imagePath) => publishedImagePaths.add(imagePath));
    assertClassifiedRecipeSections(parsed.content, relativePath);
    const { instructions, notes: sourceNotes } = recipePreparationSections(publicMarkdown);
    const safetyHold = publicSafetyHold(data.recipe_id, data.language);
    const visibleHold = safetyHold ?? publicRecipeQualityHold(data.recipe_id, data.language);
    if (!instructions) throw new Error(`Published recipe has no instructions: ${filePath}`);
    const descriptionSection = section(publicMarkdown, descriptionHeadings);
    const nutritionBasis = data.language === "fi" && publicNutritionBasis.has(data.recipe_id)
      ? section(publicMarkdown, [nutritionBasisHeading])
      : "";
    const notes = [
      sourceNotes,
      nutritionBasis && `### ${nutritionBasisHeading}\n\n${nutritionBasis}`,
    ].filter(Boolean).join("\n\n");
    const copy = reviewedRecipeCopy(data.recipe_id, data.language);
    const methodCopy = projectPublicRecipeMethodCopy(data.recipe_id, data.language, instructions, notes);
    const publicMethod = applyCopyEdits(methodCopy.instructions, copy?.method);
    const reviewedNotes = reviewedImageNote(applyCopyEdits(methodCopy.notes, copy?.notes), data.language);
    const publicInstructions = visibleHold?.instructions ?? projectEggMethod(data.recipe_id, data.language, publicMethod);
    const publicIngredients = data.ingredients.map(ingredient => ({
      ...ingredient,
      item: applyCopyEdits(ingredient.item, copy?.ingredientItem),
      ...(ingredient.note ? {
        note: applyCopyEdits(publicIngredientNote(data.recipe_id, data.language, ingredient.note), copy?.ingredientNote),
      } : {}),
    }));
    const ingredientList = projectIngredientList(data.recipe_id, data.language, publicIngredients,
      finnishIngredients.get(data.recipe_id) ?? []);
    const kitchenIngredients = ingredientList.items.some((item, index) => {
      const original = publicIngredients[index];
      return item.amount !== original.amount || item.unit !== original.unit || item.item !== original.item ||
        item.note !== original.note || item.eggSingular !== undefined;
    }) ? ingredientList.items : undefined;
    const nutritionNotesTitle = {
      fi: "Ainesten ravintolaskenta", en: "Ingredient nutrition estimates",
      sv: "Näringsberäkning för ingredienser", th: "การคำนวณโภชนาการของวัตถุดิบ",
    }[data.language];
    const ingredientNutrition = ingredientList.nutrition.length
      ? `### ${nutritionNotesTitle}\n\n${ingredientList.nutrition.map(note => `- ${note.replace(/\s+/g, " ")}`).join("\n")}`
      : "";
    const publicNotes = [reviewedNotes, copy?.nutritionBasis, ingredientNutrition].filter(Boolean).join("\n\n");
    const dietTags = await reviewedDietTagsForSource(data.recipe_id, data.language, filePath, finnishSources.get(data.recipe_id));
    const instructionSteps = numberedInstructionSteps(publicInstructions);
    const seoDescription = visibleHold ? undefined : recipeSeoDescriptions[data.url_slug]?.[data.language];
    const editorialDescription = copy?.description
      ?? (copy?.useSeoDescription ? seoDescription : undefined)
      ?? publicRecipeDescription(data.recipe_id, data.url_slug, data.language);
    const publicCookingMethod = reviewedPublicCookingMethod(data.recipe_id, data.cooking_method);
    recipes.push({
      kind: "recipe", recipeId: data.recipe_id, slug: data.url_slug, locale: data.language,
      title: copy?.title ?? publicRecipeTitle(data.recipe_id, data.language, data.title), category: data.category, ...(data.additional_categories?.length ? { additionalCategories: data.additional_categories } : {}), dietClass: data.diet_class ?? null, ...(dietTags.length ? { dietTags } : {}), ...(data.gluten_free === true ? { glutenFree: true } : {}), routePath: routeForRecipe(data.language, data.url_slug),
      ...(publicCookingMethod ? { cookingMethod: publicCookingMethod } : {}),
      description: recipeDescription(publicMarkdown, descriptionSection, data.language, data.ingredients, {
        hold: visibleHold?.description, editorial: editorialDescription, fallback: seoDescription,
      }),
      ingredients: publicIngredients,
      ...(kitchenIngredients ? { kitchenIngredients } : {}),
      ...(!visibleHold && ingredientList.preparation.length ? { ingredientPreparation: ingredientList.preparation } : {}),
      ...(seoDescription ? { seoDescription } : {}),
      instructionsHtml: await renderSafeMarkdown(publicInstructions),
      instructionStepsHtml: await renderInstructionSteps(publicInstructions),
      instructionsText: instructionSteps.length ? instructionSteps : publicInstructions.split(/\n\s*\n/).filter(Boolean),
      notesHtml: await renderSafeMarkdown(!safetyHold && visibleHold ? "" : publicNotes), servings: data.servings,
      timeTotalMin: data.time_total_min ?? null,
      difficulty: recipeDifficultyLabel(data.difficulty ?? null, data.language), tags: data.tags,
      image: data.image ? {
        src: `${baseUrl}/kuvat/${data.image.src}`,
        alt: data.image.alt, width: data.image.width, height: data.image.height,
        sizes: data.image.sizes ?? null,
        srcSet: data.image.srcset?.map((item) => `${baseUrl}/kuvat/${item.src} ${item.width}w`).join(", ") ?? null,
      } : null,
      nutrition: {
        carbsNetG: data.carbs_net_per_serving_g ?? null, carbsTotalG: data.carbs_total_per_serving_g ?? null,
        proteinG: data.protein_per_serving_g ?? null, fatG: data.fat_per_serving_g ?? null,
      },
    });
  }
  assertUniqueRecipes(recipes);
  assertQuantifiedCriticalIngredients(recipes);
  for (const recipe of recipes) Object.assign(recipe, sourceFacets.get(recipe.recipeId) ?? { cuisine: null, ingredientGroups: [] });
  const imageUrlPrefix = `${baseUrl}/kuvat/`;
  const homepageImagePaths = new Set(Object.keys(localeIndexes).flatMap((locale) =>
    homepagePicks(recipes.filter((recipe) => recipe.locale === locale))
      .flatMap(({ image }) => image ? [image.src.slice(imageUrlPrefix.length)] : []),
  ));
  const images = await rebuildPublishedImages(
    imageSourceDir, path.join(siteDir, "public"), [...publishedImagePaths], undefined, homepageImagePaths,
    path.join(siteDir, ".cache", "recipe-images"),
  );
  const byPath = new Map(images.images.map((image) => [image.path, image]));
  for (const recipe of recipes) {
    if (!recipe.image) continue;
    const source = byPath.get(recipe.image.src.slice(imageUrlPrefix.length))!;
    recipe.image.width = source.width;
    recipe.image.height = source.height;
    // Keep the unchanged original as src and the largest candidate (also used by SEO).
    recipe.image.srcSet = [...source.variants, source]
      .map((image) => `${baseUrl}/kuvat/${image.path} ${image.width}w`).join(", ");
    if (source.homeAvif) recipe.image.homeAvifSrc = imageUrlPrefix + source.homeAvif.path;
    if (source.heroAvif) recipe.image.heroAvifSrc = imageUrlPrefix + source.heroAvif.path;
  }
  return inheritSourceAdditionalCategories(recipes).sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title));
}

async function main() {
  const recipes = await buildRecipes();
  const index: SiteContentIndex = { articles: [], recipes };
  await mkdir(outputDir, { recursive: true });
  // Avoid TypeScript inferring an enormous union from thousands of recipes.
  // Input was schema-validated above; this module is used only by build/SSR/tests.
  await writeFile(path.join(outputDir, "content.generated.ts"), `/* Generated by scripts/build-content.ts. */\nimport type { SiteContentIndex } from "../types/content";\n\nexport const siteContent: SiteContentIndex = JSON.parse(${JSON.stringify(JSON.stringify(index))});\n`, "utf8");
  const dataDir = path.join(siteDir, "public", "data");
  // This directory is exclusively generated; remove stale published payloads.
  await rm(dataDir, { recursive: true, force: true });
  await mkdir(dataDir, { recursive: true });
  // A1: lazily consumed, language-scoped assistant catalogs, never loaded into the main JS bundle.
  // This is published content only; no AI generation, GK estimates, drafts or private user data.
  const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");
  const recipeVersions = new Map(recipes.map((recipe) => [recipe, sha256(JSON.stringify(recipe))]));
  const assistantManifest: Partial<Record<RecipeLocale, { file: string; sha256: string; count: number }>> = {};
  for (const locale of ["fi", "en", "sv", "th"] as const) {
    if (!recipes.some((recipe) => recipe.locale === locale)) continue;
    const catalog = createAssistantCatalog(recipes, locale, (recipe) => recipeVersions.get(recipe)!);
    const json = JSON.stringify(catalog);
    const digest = sha256(json);
    const filename = `assistant-${locale}-${digest.slice(0, 20)}.json`;
    await writeFile(path.join(dataDir, filename), json, "utf8");
    assistantManifest[locale] = { file: filename, sha256: digest, count: catalog.recipes.length };
  }
  await writeFile(path.join(dataDir, "assistant-manifest.json"),
    JSON.stringify({ schemaVersion: 1, locales: assistantManifest }), "utf8");
  console.log(`Built ${recipes.length} published recipe translations from local Markdown.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}

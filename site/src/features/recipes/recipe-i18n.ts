import type { RecipeEntry, RecipeLocale } from "@/types/content";

interface RecipeUiLabels {
  brand: string; tagline: string; brandHome: string; skipToContent: string; languages: string; footer: string;
  notFound: string; backToRecipes: string; imageUnavailable: string; breadcrumb: string;
  indexTitle: string; intro: string; eyebrow: string; servings: string; decrease: string; increase: string;
  ingredients: string; instructions: string; nutrition: string; notes: string; minutes: string; difficulty: string;
  search: string; searchPlaceholder: string; clearSearch: string; categoryFilter: string; dietFilter: string;
  allCategories: string; allDiets: string; keto: string; vhh: string; noResults: string; resetFilters: string;
  results: (count: number) => string;
  category: Record<RecipeEntry["category"], string>; nutrients: Record<"carbsNetG" | "carbsTotalG" | "proteinG" | "fatG", string>;
}

export const recipeUi: Record<RecipeLocale, RecipeUiLabels> = {
  fi: { brand: "Reseptit", tagline: "Selkeitä reseptejä arkeen", brandHome: "Reseptit, etusivu", skipToContent: "Siirry sisältöön", languages: "Kielet", footer: "Reseptit · Ozirix", notFound: "Sivua ei löytynyt", backToRecipes: "Takaisin resepteihin", imageUnavailable: "Kuva ei saatavilla", breadcrumb: "Murupolku", indexTitle: "Reseptit", intro: "Selkeitä reseptejä arkeen.", eyebrow: "Reseptit", servings: "Annosta", decrease: "Vähennä annosta", increase: "Lisää annos", ingredients: "Ainekset", instructions: "Valmistus", nutrition: "Ravintoarvot annosta kohti", notes: "Muistiinpanot", minutes: "min", difficulty: "Vaikeustaso", search: "Hae reseptejä", searchPlaceholder: "Nimi, ainesosa tai tunniste", clearSearch: "Tyhjennä haku", categoryFilter: "Kategoria", dietFilter: "Ruokavalio", allCategories: "Kaikki reseptit", allDiets: "Kaikki ruokavaliot", keto: "Keto", vhh: "VHH", noResults: "Reseptejä ei löytynyt hakuehdoilla.", resetFilters: "Tyhjennä haku ja suodattimet", results: (count) => `Löytyi ${count} ${count === 1 ? "resepti" : "reseptiä"}`, category: { alkuruoka: "Alkuruoat", paaruoka: "Pääruoat", jalkiruoka: "Jälkiruoat", leivonnainen: "Leivonnaiset" }, nutrients: { carbsNetG: "Nettohiilihydraatit", carbsTotalG: "Hiilihydraatit yhteensä", proteinG: "Proteiini", fatG: "Rasva" } },
  en: { brand: "Recipes", tagline: "Straightforward recipes for everyday cooking", brandHome: "Recipes, home", skipToContent: "Skip to content", languages: "Languages", footer: "Recipes · Ozirix", notFound: "Page not found", backToRecipes: "Back to recipes", imageUnavailable: "Image unavailable", breadcrumb: "Breadcrumb", indexTitle: "Recipes", intro: "Straightforward recipes for everyday cooking.", eyebrow: "Recipes", servings: "Servings", decrease: "Decrease servings", increase: "Increase servings", ingredients: "Ingredients", instructions: "Method", nutrition: "Nutrition per serving", notes: "Notes", minutes: "min", difficulty: "Difficulty", search: "Search recipes", searchPlaceholder: "Name, ingredient or tag", clearSearch: "Clear search", categoryFilter: "Category", dietFilter: "Diet", allCategories: "All recipes", allDiets: "All diets", keto: "Keto", vhh: "Low carb", noResults: "No recipes match these filters.", resetFilters: "Clear search and filters", results: (count) => `${count} ${count === 1 ? "recipe" : "recipes"} found`, category: { alkuruoka: "Starters", paaruoka: "Main courses", jalkiruoka: "Desserts", leivonnainen: "Baking" }, nutrients: { carbsNetG: "Net carbs", carbsTotalG: "Total carbohydrates", proteinG: "Protein", fatG: "Fat" } },
  sv: { brand: "Recept", tagline: "Enkla recept för vardagen", brandHome: "Recept, startsida", skipToContent: "Hoppa till innehållet", languages: "Språk", footer: "Recept · Ozirix", notFound: "Sidan kunde inte hittas", backToRecipes: "Tillbaka till recepten", imageUnavailable: "Bilden är inte tillgänglig", breadcrumb: "Brödsmulor", indexTitle: "Recept", intro: "Enkla recept för vardagen.", eyebrow: "Recept", servings: "Portioner", decrease: "Minska portioner", increase: "Öka portioner", ingredients: "Ingredienser", instructions: "Gör så här", nutrition: "Näringsvärde per portion", notes: "Anteckningar", minutes: "min", difficulty: "Svårighetsgrad", search: "Sök recept", searchPlaceholder: "Namn, ingrediens eller tagg", clearSearch: "Rensa sökning", categoryFilter: "Kategori", dietFilter: "Kost", allCategories: "Alla recept", allDiets: "Alla kostalternativ", keto: "Keto", vhh: "Lågkolhydrat", noResults: "Inga recept matchar filtren.", resetFilters: "Rensa sökning och filter", results: (count) => `${count} ${count === 1 ? "recept hittat" : "recept hittade"}`, category: { alkuruoka: "Förrätter", paaruoka: "Huvudrätter", jalkiruoka: "Efterrätter", leivonnainen: "Bakverk" }, nutrients: { carbsNetG: "Nettokolhydrater", carbsTotalG: "Kolhydrater totalt", proteinG: "Protein", fatG: "Fett" } },
  th: { brand: "สูตรอาหาร", tagline: "สูตรอาหารเรียบง่ายสำหรับทุกวัน", brandHome: "หน้าสูตรอาหาร", skipToContent: "ข้ามไปยังเนื้อหา", languages: "ภาษา", footer: "สูตรอาหาร · Ozirix", notFound: "ไม่พบหน้านี้", backToRecipes: "กลับไปยังสูตรอาหาร", imageUnavailable: "ไม่มีรูปภาพ", breadcrumb: "เส้นทางนำทาง", indexTitle: "สูตรอาหาร", intro: "สูตรอาหารเรียบง่ายสำหรับทุกวัน", eyebrow: "สูตรอาหาร", servings: "ที่", decrease: "ลดจำนวนที่", increase: "เพิ่มจำนวนที่", ingredients: "วัตถุดิบ", instructions: "วิธีทำ", nutrition: "โภชนาการต่อหนึ่งที่", notes: "หมายเหตุ", minutes: "นาที", difficulty: "ระดับความยาก", search: "ค้นหาสูตรอาหาร", searchPlaceholder: "ชื่อ วัตถุดิบ หรือแท็ก", clearSearch: "ล้างคำค้น", categoryFilter: "หมวดหมู่", dietFilter: "รูปแบบอาหาร", allCategories: "สูตรอาหารทั้งหมด", allDiets: "ทุกแบบ", keto: "คีโต", vhh: "คาร์โบไฮเดรตต่ำ", noResults: "ไม่พบสูตรอาหารที่ตรงกับตัวกรอง", resetFilters: "ล้างคำค้นและตัวกรอง", results: (count) => `พบ ${count} สูตร`, category: { alkuruoka: "อาหารเรียกน้ำย่อย", paaruoka: "อาหารจานหลัก", jalkiruoka: "ของหวาน", leivonnainen: "ขนมอบ" }, nutrients: { carbsNetG: "คาร์โบไฮเดรตสุทธิ", carbsTotalG: "คาร์โบไฮเดรตรวม", proteinG: "โปรตีน", fatG: "ไขมัน" } },
};

export function recipeLocaleName(locale: RecipeLocale): string {
  return { fi: "Suomi", en: "English", sv: "Svenska", th: "ไทย" }[locale];
}

export function recipeLocaleFromPath(pathname: string): RecipeLocale {
  if (pathname.startsWith("/en/")) return "en";
  if (pathname.startsWith("/sv/")) return "sv";
  if (pathname.startsWith("/th/")) return "th";
  return "fi";
}

export function recipeIndexPath(locale: RecipeLocale): string {
  return locale === "fi" ? "/" : locale === "sv" ? "/sv/recept/" : `/${locale}/recipes/`;
}

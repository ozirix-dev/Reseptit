import type { RecipeEntry, RecipeLocale } from "@/types/content";

export const recipeUi: Record<RecipeLocale, {
  indexTitle: string; intro: string; eyebrow: string; servings: string; decrease: string; increase: string;
  ingredients: string; instructions: string; nutrition: string; notes: string; minutes: string; difficulty: string;
  category: Record<RecipeEntry["category"], string>; nutrients: Record<"carbsNetG" | "carbsTotalG" | "proteinG" | "fatG", string>;
}> = {
  fi: { indexTitle: "Reseptit", intro: "Selkeitä reseptejä arkeen.", eyebrow: "Reseptit", servings: "Annosta", decrease: "Vähennä annosta", increase: "Lisää annos", ingredients: "Ainekset", instructions: "Valmistus", nutrition: "Ravintoarvot annosta kohti", notes: "Muistiinpanot", minutes: "min", difficulty: "Vaikeustaso", category: { alkuruoka: "Alkuruoat", paaruoka: "Pääruoat", jalkiruoka: "Jälkiruoat", leivonnainen: "Leivonnaiset" }, nutrients: { carbsNetG: "Nettohiilihydraatit", carbsTotalG: "Hiilihydraatit yhteensä", proteinG: "Proteiini", fatG: "Rasva" } },
  en: { indexTitle: "Recipes", intro: "Straightforward recipes for everyday cooking.", eyebrow: "Recipes", servings: "Servings", decrease: "Decrease servings", increase: "Increase servings", ingredients: "Ingredients", instructions: "Method", nutrition: "Nutrition per serving", notes: "Notes", minutes: "min", difficulty: "Difficulty", category: { alkuruoka: "Starters", paaruoka: "Main courses", jalkiruoka: "Desserts", leivonnainen: "Baking" }, nutrients: { carbsNetG: "Net carbs", carbsTotalG: "Total carbohydrates", proteinG: "Protein", fatG: "Fat" } },
  sv: { indexTitle: "Recept", intro: "Enkla recept för vardagen.", eyebrow: "Recept", servings: "Portioner", decrease: "Minska portioner", increase: "Öka portioner", ingredients: "Ingredienser", instructions: "Gör så här", nutrition: "Näringsvärde per portion", notes: "Anteckningar", minutes: "min", difficulty: "Svårighetsgrad", category: { alkuruoka: "Förrätter", paaruoka: "Huvudrätter", jalkiruoka: "Efterrätter", leivonnainen: "Bakverk" }, nutrients: { carbsNetG: "Nettokolhydrater", carbsTotalG: "Kolhydrater totalt", proteinG: "Protein", fatG: "Fett" } },
  th: { indexTitle: "สูตรอาหาร", intro: "สูตรอาหารเรียบง่ายสำหรับทุกวัน", eyebrow: "สูตรอาหาร", servings: "ที่", decrease: "ลดจำนวนที่", increase: "เพิ่มจำนวนที่", ingredients: "วัตถุดิบ", instructions: "วิธีทำ", nutrition: "โภชนาการต่อหนึ่งที่", notes: "หมายเหตุ", minutes: "นาที", difficulty: "ระดับความยาก", category: { alkuruoka: "อาหารเรียกน้ำย่อย", paaruoka: "อาหารจานหลัก", jalkiruoka: "ของหวาน", leivonnainen: "ขนมอบ" }, nutrients: { carbsNetG: "คาร์โบไฮเดรตสุทธิ", carbsTotalG: "คาร์โบไฮเดรตรวม", proteinG: "โปรตีน", fatG: "ไขมัน" } },
};

export function recipeLocaleName(locale: RecipeLocale): string {
  return { fi: "Suomi", en: "English", sv: "Svenska", th: "ไทย" }[locale];
}

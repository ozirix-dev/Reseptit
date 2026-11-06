import type { RecipeLocale } from "@/types/content";

/**
 * Phase 1 preview copy. Not production launch permission.
 * The public recipe finder remains functional without an account.
 */
interface RecipavoHeroCopy {
  brand: string;
  brandHome: string;
  tagline: string;
  eyebrow: string;
  title: string;
  intro: string;
  footer: string;
}

export const recipavoHeroCopy: Record<RecipeLocale, RecipavoHeroCopy> = {
  fi: {
    brand: "Recipavo",
    brandHome: "Recipavo, etusivu",
    tagline: "Maailman reseptit arkeen",
    eyebrow: "Recipavo · Reseptikirjasto",
    title: "Maailman reseptit. Sinun arkeesi.",
    intro: "Löydä kokattavaa eri puolilta maailmaa. Hae reseptiä nimellä tai aineksella ja rajaa tuloksia ruokalajin, ruokavalion tai valmistusajan mukaan.",
    footer: "Recipavo · Reseptikirjasto",
  },
  en: {
    brand: "Recipavo",
    brandHome: "Recipavo, home",
    tagline: "Recipes from around the world",
    eyebrow: "Recipavo · Recipe library",
    title: "Recipes from around the world. Made for everyday life.",
    intro: "Discover dishes from around the world. Search by name or ingredient, then filter by category, diet or cooking time.",
    footer: "Recipavo · Recipe library",
  },
  sv: {
    brand: "Recipavo",
    brandHome: "Recipavo, startsida",
    tagline: "Recept från hela världen",
    eyebrow: "Recipavo · Receptsamling",
    title: "Recept från hela världen. För din vardag.",
    intro: "Upptäck maträtter från olika delar av världen. Sök på namn eller ingrediens och filtrera efter kategori, kost eller tillagningstid.",
    footer: "Recipavo · Receptsamling",
  },
  th: {
    brand: "Recipavo",
    brandHome: "Recipavo หน้าหลัก",
    tagline: "สูตรอาหารจากทั่วโลก",
    eyebrow: "Recipavo · คลังสูตรอาหาร",
    title: "สูตรอาหารจากทั่วโลก สำหรับทุกวันของคุณ",
    intro: "ค้นพบเมนูจากทั่วโลก ค้นหาสูตรอาหารด้วยชื่อหรือวัตถุดิบ แล้วกรองตามหมวดหมู่ รูปแบบอาหาร หรือเวลาปรุง",
    footer: "Recipavo · คลังสูตรอาหาร",
  },
};

/**
 * Opt-in at build time for a non-public staging build only.
 * Absence of the flag MUST leave the existing Reseptit UI unchanged.
 */
export function isRecipavoHeroPreviewEnabled(): boolean {
  return import.meta.env?.VITE_RECIPAVO_HERO_PREVIEW === "true";
}

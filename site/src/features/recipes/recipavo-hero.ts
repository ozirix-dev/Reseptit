import type { RecipeLocale } from "@/types/content";
import { siteTarget } from "../../content/site-target";

/**
 * Phase 1 preview copy. Not production launch permission.
 * The public recipe finder remains functional without an account.
 */
interface RecipavoHeroCopy {
  brand: string;
  brandHome: string;
  tagline: string;
  title: string;
  intro: string;
  details: string;
  footer: string;
}

export const recipavoHeroCopy: Record<RecipeLocale, RecipavoHeroCopy> = {
  fi: {
    brand: "Recipavo",
    brandHome: "Recipavo, etusivu",
    tagline: "Maailman reseptit arkeen",
    title: "Maailman reseptit. Sinun arkeesi.",
    intro: "Hae reseptejä ja rajaa tuloksia. Kokkaa selkeillä ohjeilla ja säädä annosmäärä sopivaksi.",
    details: "Reseptejä neljällä kielellä. Ravintoarvot ja glykeemisen kuorman (GK) arviot näkyvät, kun tietoa on riittävästi.",
    footer: "Recipavo · Reseptikirjasto",
  },
  en: {
    brand: "Recipavo",
    brandHome: "Recipavo, home",
    tagline: "Recipes from around the world",
    title: "World recipes for everyday cooking",
    intro: "Search and filter recipes. Cook with clear instructions and adjust the servings to suit you.",
    details: "Recipes in four languages, with nutrition information and estimated glycemic load (GL) when data allows.",
    footer: "Recipavo · Recipe library",
  },
  sv: {
    brand: "Recipavo",
    brandHome: "Recipavo, startsida",
    tagline: "Recept från hela världen",
    title: "Recept från hela världen. För din vardag.",
    intro: "Hitta ett recept med sökning eller filter. Följ tydliga instruktioner och anpassa antalet portioner.",
    details: "Recept på fyra språk, med näringsvärden och uppskattad glykemisk belastning (GL) när underlaget räcker.",
    footer: "Recipavo · Receptsamling",
  },
  th: {
    brand: "Recipavo",
    brandHome: "Recipavo หน้าหลัก",
    tagline: "สูตรอาหารจากทั่วโลก",
    title: "สูตรอาหารจากทั่วโลก สำหรับทุกวัน",
    intro: "ค้นหาหรือกรองสูตรอาหารที่เหมาะกับคุณ ทำตามขั้นตอนได้ง่ายและปรับจำนวนที่เสิร์ฟได้",
    details: "มีสูตรอาหารสี่ภาษา พร้อมข้อมูลโภชนาการและค่าประมาณภาระน้ำตาล (GL) เมื่อมีข้อมูลเพียงพอ",
    footer: "Recipavo · คลังสูตรอาหาร",
  },
};

/**
 * Opt-in at build time for a non-public staging build only.
 * Absence of the flag MUST leave the existing Reseptit UI unchanged.
 */
export function isRecipavoHeroPreviewEnabled(): boolean {
  return !siteTarget.production && import.meta.env?.VITE_RECIPAVO_HERO_PREVIEW === "true";
}

export function isRecipavoHeroEnabled(): boolean {
  return siteTarget.production || isRecipavoHeroPreviewEnabled();
}

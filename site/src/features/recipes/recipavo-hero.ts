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
    intro: "Kokkaa ruokia eri puolilta maailmaa selkeillä ohjeilla ja säädä annosmäärä tarpeen mukaan. Hae aineksella ja rajaa ruokavalion tai valmistusajan mukaan.",
    details: "Reseptejä suomeksi, englanniksi, ruotsiksi ja thaiksi. Ravintoarvot ja glykeemisen kuorman (GK) arviot näytetään, kun tietoja on riittävästi.",
    footer: "Recipavo · Reseptikirjasto",
  },
  en: {
    brand: "Recipavo",
    brandHome: "Recipavo, home",
    tagline: "Recipes from around the world",
    title: "Recipes from around the world. Made for everyday life.",
    intro: "Cook dishes from around the world with clear instructions and adjustable servings. Search by ingredient and filter by diet or cooking time.",
    details: "Find recipes in Finnish, English, Swedish and Thai. Nutrition information and estimated glycemic load (GL) are shown where enough data is available.",
    footer: "Recipavo · Recipe library",
  },
  sv: {
    brand: "Recipavo",
    brandHome: "Recipavo, startsida",
    tagline: "Recept från hela världen",
    title: "Recept från hela världen. För din vardag.",
    intro: "Laga mat från hela världen med tydliga instruktioner och anpassa antalet portioner. Sök på ingrediens och filtrera efter kost eller tillagningstid.",
    details: "Här finns recept på finska, engelska, svenska och thailändska. Näringsvärden och uppskattad glykemisk belastning (GL) visas när underlaget räcker.",
    footer: "Recipavo · Receptsamling",
  },
  th: {
    brand: "Recipavo",
    brandHome: "Recipavo หน้าหลัก",
    tagline: "สูตรอาหารจากทั่วโลก",
    title: "สูตรอาหารจากทั่วโลก สำหรับทุกวันของคุณ",
    intro: "ทำอาหารจากทั่วโลกด้วยวิธีทำที่เข้าใจง่ายและปรับจำนวนที่ได้ ค้นหาตามวัตถุดิบและกรองตามรูปแบบอาหารหรือเวลาปรุง",
    details: "มีสูตรอาหารภาษาฟินแลนด์ อังกฤษ สวีเดน และไทย พร้อมข้อมูลโภชนาการและค่าประมาณภาระน้ำตาล (GL) เมื่อมีข้อมูลเพียงพอ",
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

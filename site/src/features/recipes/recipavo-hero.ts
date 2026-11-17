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
    tagline: "Reseptikirjasto",
    title: "Maailman reseptit arkeen",
    intro: "Hae ruokalajia tai raaka-ainetta ja rajaa tuloksia ruokavalion tai valmistusajan mukaan. Reseptissä voit muuttaa annosmäärää.",
    details: "Reseptejä suomeksi, englanniksi, ruotsiksi ja thaiksi. Ravintoarvot ja glykeemisen kuorman (GK) arviot näytetään, kun tietoja on riittävästi.",
    footer: "Recipavo · Reseptikirjasto",
  },
  en: {
    brand: "Recipavo",
    brandHome: "Recipavo, home",
    tagline: "Recipe library",
    title: "Recipes from around the world for everyday cooking",
    intro: "Search by dish or ingredient and filter by diet or cooking time. You can adjust the number of servings on the recipe page.",
    details: "Find recipes in Finnish, English, Swedish and Thai. Nutrition information and estimated glycemic load (GL) are shown where enough data is available.",
    footer: "Recipavo · Recipe library",
  },
  sv: {
    brand: "Recipavo",
    brandHome: "Recipavo, startsida",
    tagline: "Receptsamling",
    title: "Vardagsrecept från hela världen",
    intro: "Sök på maträtt eller ingrediens och filtrera efter kost eller tillagningstid. Du kan ändra antalet portioner på receptsidan.",
    details: "Här finns recept på finska, engelska, svenska och thailändska. Näringsvärden och uppskattad glykemisk belastning (GL) visas när underlaget räcker.",
    footer: "Recipavo · Receptsamling",
  },
  th: {
    brand: "Recipavo",
    brandHome: "Recipavo หน้าหลัก",
    tagline: "คลังสูตรอาหาร",
    title: "สูตรอาหารจากทั่วโลกสำหรับทุกวัน",
    intro: "ค้นหาตามชื่อเมนูหรือวัตถุดิบ แล้วกรองตามรูปแบบการกินหรือเวลาที่ใช้ทำอาหาร ปรับจำนวนเสิร์ฟได้ในหน้าสูตร",
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

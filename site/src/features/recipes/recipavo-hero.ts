import type { RecipeLocale } from "@/types/content";
import { siteTarget } from "../../content/site-target";

/**
 * Homepage copy for the public Recipavo experience.
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
    tagline: "Reseptejä joka päivään",
    title: "Maailman makuja kotikeittiöön",
    intro: "Etsi reseptejä ruokalajin tai raaka-aineen mukaan. Rajaa vaihtoehtoja ruokavalion ja valmistusajan perusteella. Voit muuttaa annosmäärää reseptisivulla.",
    details: "Reseptejä suomeksi, englanniksi, ruotsiksi ja thaiksi. Osasta löydät myös ravintoarvot ja arvion annoksen vaikutuksesta verensokeriin.",
    footer: "Recipavo · Hyvää ruokaa arkeen",
  },
  en: {
    brand: "Recipavo",
    brandHome: "Recipavo, home",
    tagline: "Recipes for every day",
    title: "Flavours from around the world, for everyday cooking",
    intro: "Find recipes by dish or ingredient. Narrow your choices by diet and cooking time, then adjust the servings on the recipe page.",
    details: "Browse in Finnish, English, Swedish or Thai. Selected recipes also include nutrition information and an estimate of how a serving may affect blood sugar.",
    footer: "Recipavo · Everyday cooking inspiration",
  },
  sv: {
    brand: "Recipavo",
    brandHome: "Recipavo, startsida",
    tagline: "Recept för varje dag",
    title: "Smaker från hela världen, för vardagen",
    intro: "Sök efter maträtt eller ingrediens. Filtrera efter kost och tillagningstid och ändra portionsantalet på receptsidan.",
    details: "Recept finns på finska, engelska, svenska och thailändska. Vissa recept innehåller också näringsinformation och en uppskattning av hur portionen kan påverka blodsockret.",
    footer: "Recipavo · Matinspiration för vardagen",
  },
  th: {
    brand: "Recipavo",
    brandHome: "Recipavo หน้าหลัก",
    tagline: "สูตรอาหารสำหรับทุกวัน",
    title: "รสชาติจากทั่วโลก สำหรับทุกวัน",
    intro: "ค้นหาสูตรอาหารจากชื่อเมนูหรือวัตถุดิบ เลือกกรองตามรูปแบบอาหารและเวลาในการปรุง และปรับจำนวนที่เสิร์ฟได้ในหน้าสูตรอาหาร",
    details: "มีสูตรอาหารภาษาฟินแลนด์ อังกฤษ สวีเดน และไทย บางสูตรยังมีข้อมูลโภชนาการและค่าประมาณว่าหนึ่งที่อาจส่งผลต่อระดับน้ำตาลในเลือดอย่างไร",
    footer: "Recipavo · ไอเดียอาหารสำหรับทุกวัน",
  },
};

export function recipavoHomeTitle(locale: RecipeLocale): string {
  const copy = recipavoHeroCopy[locale];
  return siteTarget.production ? copy.title : copy.tagline;
}

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

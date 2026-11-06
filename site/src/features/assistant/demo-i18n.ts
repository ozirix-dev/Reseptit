import type { RecipeLocale } from "../../types/content";
import type { DemoPreset } from "./demo";

export interface UiCopy {
  title: string; intro: string; warning: string; language: string; loading: string; unavailable: string;
  retry: string; search: string; placeholder: string; send: string; results: (count: number) => string;
  noResults: string; published: string; unknown: string; netCarbs: string; minutes: string;
  regularSearch: string; note: string; log: string; suggestions: string;
  presets: Record<DemoPreset, string>;
}
export const assistantDemoCopy: Record<RecipeLocale, UiCopy> = {
  fi: {
    title: "Recipavo Keittiöapuri", intro: "Etsi julkaistuja reseptejä. Tämä on erillinen testinäkymä, ei tekoälykeskustelu.",
    warning: "A2-esikatselu: vain nykyinen reseptihaku, ei AI-kutsuja eikä GK-laskentaa.",
    language: "Kieli", loading: "Ladataan julkaistuja reseptejä…", unavailable: "Resepti-indeksi ei ole käytettävissä.",
    retry: "Lataa uudelleen", search: "Kirjoita reseptin nimi tai ainesosa", placeholder: "esim. kana, tofu tai chia",
    send: "Etsi", results: (n) => `Näytetään ${n} reseptiä (enintään viisi osumaa tästä hausta).`,
    noResults: "Hakuehdoilla ei löytynyt reseptejä. Kokeile toista hakusanaa tai valintaa.",
    published: "Julkaistu resepti", unknown: "Tieto puuttuu", netCarbs: "Nettohiilihydraatit / annos",
    minutes: "min", regularSearch: "Avaa tavallinen reseptihaku", note: "Vastaukset perustuvat julkaistuihin resepteihin. Puuttuva ravintoarvo ei tarkoita nollaa.",
    log: "Hakuhistoria tässä istunnossa", suggestions: "Kokeile valmista hakua",
    presets: { "keto-30": "Keto, enintään 30 min", breakfast: "Aamupalat", snack: "Välipalat" },
  },
  en: {
    title: "Recipavo Kitchen Helper", intro: "Find published recipes. This is an isolated demo, not an AI conversation.",
    warning: "A2 preview: existing recipe search only, no AI calls or glycemic-load calculations.",
    language: "Language", loading: "Loading published recipes…", unavailable: "Recipe catalog is unavailable.",
    retry: "Reload", search: "Enter a recipe name or ingredient", placeholder: "e.g. chicken, tofu or chia",
    send: "Search", results: (n) => `Showing ${n} recipe results (up to five in this preview).`,
    noResults: "No matching recipes. Try another term or preset.",
    published: "Published recipe", unknown: "Not available", netCarbs: "Net carbs / serving",
    minutes: "min", regularSearch: "Open regular recipe search", note: "Results come from published recipes. Unknown nutrition does not mean zero.",
    log: "Search history in this session", suggestions: "Try a preset",
    presets: { "keto-30": "Keto, max 30 min", breakfast: "Breakfast", snack: "Snacks" },
  },
  sv: {
    title: "Recipavo Köksassistent", intro: "Hitta publicerade recept. Detta är en separat testvy, ingen AI-chatt.",
    warning: "A2-förhandsvisning: endast befintlig receptsökning, inga AI-anrop eller GK-beräkningar.",
    language: "Språk", loading: "Läser in publicerade recept…", unavailable: "Receptregistret är inte tillgängligt.",
    retry: "Ladda om", search: "Skriv receptnamn eller ingrediens", placeholder: "t.ex. kyckling, tofu eller chia",
    send: "Sök", results: (n) => `Visar ${n} recept (högst fem i denna förhandsvisning).`,
    noResults: "Inga matchande recept. Prova ett annat ord eller val.",
    published: "Publicerat recept", unknown: "Uppgift saknas", netCarbs: "Nettokolhydrater / portion",
    minutes: "min", regularSearch: "Öppna vanlig receptsökning", note: "Resultaten kommer från publicerade recept. Saknade näringsvärden är inte noll.",
    log: "Sökhistorik under denna session", suggestions: "Prova ett snabbval",
    presets: { "keto-30": "Keto, högst 30 min", breakfast: "Frukost", snack: "Mellanmål" },
  },
  th: {
    title: "ผู้ช่วยครัว Recipavo", intro: "ค้นหาสูตรอาหารที่เผยแพร่แล้ว นี่คือหน้าทดลองแยกต่างหาก ไม่ใช่แชต AI",
    warning: "ตัวอย่าง A2: ใช้ระบบค้นหาสูตรเดิมเท่านั้น ไม่มีการเรียก AI หรือคำนวณค่า GL",
    language: "ภาษา", loading: "กำลังโหลดสูตรอาหารที่เผยแพร่…", unavailable: "ไม่สามารถโหลดรายการสูตรอาหารได้",
    retry: "โหลดอีกครั้ง", search: "พิมพ์ชื่ออาหารหรือวัตถุดิบ", placeholder: "เช่น ไก่ เต้าหู้ หรือเมล็ดเจีย",
    send: "ค้นหา", results: (n) => `แสดง ${n} สูตร (สูงสุดห้าสูตรในตัวอย่างนี้)`,
    noResults: "ไม่พบสูตรที่ตรงกัน ลองใช้คำค้นหรือหมวดอื่น",
    published: "สูตรอาหารที่เผยแพร่แล้ว", unknown: "ไม่มีข้อมูล", netCarbs: "คาร์โบไฮเดรตสุทธิ / หนึ่งเสิร์ฟ",
    minutes: "นาที", regularSearch: "เปิดหน้าค้นหาสูตรอาหาร", note: "ผลลัพธ์มาจากสูตรที่เผยแพร่แล้ว ข้อมูลโภชนาการที่ไม่ทราบไม่ได้หมายถึงศูนย์",
    log: "ประวัติการค้นหาในหน้านี้", suggestions: "ลองตัวเลือกด่วน",
    presets: { "keto-30": "คีโต ไม่เกิน 30 นาที", breakfast: "อาหารเช้า", snack: "ของว่าง" },
  },
};

import type { RecipeLocale } from "../src/types/content";

/** Editorial guard for published original recipes whose current instructions are not cookable.
 * Never substitute this copy for a verified recipe or a nutrition/GK approval.
 * Remove a hold only when the repaired original, translations and nutrition are reviewed.
 */
const holdReasons: Record<string, Record<RecipeLocale, string>> = {
  "karibia-bammy-kassavaleipa": {
    fi: "TURVALLISUUSVAROITUS: Reseptissä on 250 g tuoretta kassavaa, mutta kassavan lajiketta eikä syanogeenisten yhdisteiden poistamiseen riittävää, kyseiselle raaka-aineelle soveltuvaa käsittelyä ole varmennettu. Kuoriminen, raastaminen, puristaminen ja paistaminen eivät yksin osoita tämän ohjeen turvallisuutta. Reseptiä ei saa valmistaa tämän version mukaan.",
    en: "FOOD SAFETY WARNING: This recipe calls for 250 g of fresh cassava without verifying the variety or a suitable processing method to reduce cyanogenic compounds. Peeling, grating, squeezing and pan-frying alone do not establish that these directions are safe. Do not cook from this version.",
    sv: "LIVSMEDELSVARNING: Receptet innehåller 250 g färsk kassava utan verifierad sort eller lämplig behandling för att minska cyanogena ämnen. Skalning, rivning, pressning och stekning räcker inte som säkerhetsbevis för detta recept. Tillaga inte denna version.",
    th: "คำเตือนด้านความปลอดภัยอาหาร: สูตรนี้ใช้มันสำปะหลังสด 250 กรัม แต่ยังไม่ได้ยืนยันชนิดและวิธีแปรรูปที่เหมาะสมเพื่อลดสารที่ปล่อยไซยาไนด์ การปอก ขูด บีบ และทอดตามข้อความเดิมยังไม่ใช่หลักฐานว่าปลอดภัย ห้ามทำตามสูตรฉบับนี้",
  },
  "intialainen-idli-kookoschutneylla": {
    fi: "Ainesluettelossa on epäuskottava 150 g sinapinsiemeniä kahdelle. Riisin ja urad-linssien liotus sekä taikinan fermentointi puuttuvat, ja 25 minuutin kokonaisaika on väärä.",
    en: "The ingredient list specifies an implausible 150 g of mustard seeds for two. Rice/urad soaking and batter fermentation are missing; the 25-minute total time is incorrect.",
    sv: "Ingredienslistan anger orimliga 150 g senapsfrön för två. Blötläggning av ris/urad och jäsning av smeten saknas; 25 minuters totaltid är felaktig.",
    th: "รายการวัตถุดิบระบุเมล็ดมัสตาร์ด 150 กรัมสำหรับสองที่ซึ่งไม่สมเหตุสมผล และขาดขั้นตอนแช่ข้าว/ถั่วอูรัดและหมักแป้ง รวมถึงระบุเวลารวม 25 นาทีไม่ถูกต้อง",
  },
  "vietnamilainen-banh-bao-kananmunalla": {
    fi: "Höyrysämpylän taikinasta puuttuvat neste ja kohotusaine sekä kohotusvaiheet. Nykyinen ohje ei kerro valmistettavaa taikinaa.",
    en: "The steamed bun dough has no liquid or leavening agent, and the proofing steps are missing. The current directions cannot make the specified bun.",
    sv: "Degen till de ångkokta bullarna saknar vätska och jäsmedel samt jästider. De nuvarande stegen beskriver inte en fungerande deg.",
    th: "แป้งซาลาเปาขาดของเหลวและสารช่วยขึ้นฟู รวมทั้งขั้นตอนการพักแป้ง จึงยังไม่สามารถทำซาลาเปาตามสูตรที่ระบุได้",
  },
  "intialainen-aloo-paratha": {
    fi: "Perunatäytteen kypsentäminen, soseuttaminen ja taikinan sulkeminen puuttuvat. Tarjoilujogurtti mainitaan ohjeessa mutta ei ainesluettelossa tai ravintolaskennassa.",
    en: "Cooking and mashing the potato filling and enclosing it in the dough are not described. The serving yogurt is absent from the ingredients and nutrition calculation.",
    sv: "Tillagning och mosning av potatisfyllningen samt hur den sluts in i degen saknas. Serveringsyoghurten finns inte i ingredienslistan eller näringsberäkningen.",
    th: "ขาดขั้นตอนต้มและบดมันฝรั่งรวมถึงการห่อไส้ในแป้ง ส่วนโยเกิร์ตที่แนะนำให้เสิร์ฟไม่ได้อยู่ในรายการวัตถุดิบหรือการคำนวณโภชนาการ",
  },
  "tunisialainen-brik": {
    fi: "Nykyinen friteerausaika jättää kananmunan valuvaksi. Täysin kypsän munan valmistus ja taikinan kestävyys on varmennettava ennen ohjeen palauttamista.",
    en: "The current frying time leaves the egg runny. A method that cooks the egg through while keeping the pastry intact needs to be tested.",
    sv: "Den nuvarande friteringstiden lämnar ägget rinnigt. En metod där ägget blir genomstekt och degen håller ihop måste provas.",
    th: "เวลาทอดบริกในสูตรเดิมทำให้ไข่ยังเยิ้มอยู่ ต้องทดสอบวิธีที่ทำให้ไข่สุกทั่วโดยที่แผ่นแป้งไม่แตกก่อนเผยแพร่วิธีทำอีกครั้ง",
  },
  "hyderabadi-kanabiryani": {
    fi: "Ohje käyttää sahramimaitoa, jonka maito ja määrä puuttuvat ainesluettelosta. Korjattu ainesluettelo, valmistus ja annoksen ravintoarvot on varmennettava.",
    en: "The directions use saffron milk, but the ingredients list gives neither milk nor its quantity. The ingredients, method and nutrition per serving need review.",
    sv: "Tillagningen använder saffransmjölk, men mjölk och mängd saknas i ingredienslistan. Ingredienser, metod och näringsvärden per portion måste kontrolleras.",
    th: "วิธีทำใช้นมแช่หญ้าฝรั่น แต่รายการวัตถุดิบไม่ได้ระบุนมหรือปริมาณ ต้องตรวจสอบรายการวัตถุดิบ วิธีทำ และคุณค่าทางโภชนาการต่อที่",
  },
  "jiaozi": {
    fi: "Noin 500 g liha-kaalitäytettä sekä mausteet eivät mahdu ilmoitettuun 24 nyyttiin teelusikallisina. Täytteen ja kuorten lopullinen tuotto on tarkistettava.",
    en: "Roughly 500 g of pork and cabbage plus seasoning cannot fit the stated 24 wrappers at one teaspoon per dumpling. Filling and wrapper yields require verification.",
    sv: "Cirka 500 g fläsk- och kålfyllning plus kryddor ryms inte i 24 degknyten med en tesked fyllning vardera. Antal och mängder måste kontrolleras.",
    th: "ไส้หมูและผักกาดราว 500 กรัมพร้อมเครื่องปรุงไม่สอดคล้องกับแผ่นเกี๊ยว 24 ชิ้นที่ใส่ไส้ชิ้นละหนึ่งช้อนชา ต้องตรวจสอบน้ำหนักไส้และจำนวนชิ้น",
  },
};

export const editorialHoldRecipeIds = Object.freeze(Object.keys(holdReasons));

export function publicRecipeQualityHold(
  recipeId: string,
  locale: RecipeLocale,
): { description: string; instructions: string } | null {
  const reason = holdReasons[recipeId]?.[locale];
  if (!reason) return null;
  const copy: Record<RecipeLocale, { lead: string; first: string; second: string }> = {
    fi: {
      lead: "LAATUHUOMAUTUS: Tämä julkaistu alkuperäisresepti on toimituksellisessa HOLD-katselmoinnissa. Älä käytä nykyisiä ainesmääriä tai valmistusvaiheita ruoan valmistamiseen. ",
      first: "Tämä alkuperäinen valmistusohje on keskeneräinen: älä valmista ruokaa sen ohjeilla ennen korjausta.",
      second: "Punnittu korjaus, annosmäärät, mahdolliset ravintoarvot ja GI/GK-sidokset tarkistetaan erikseen. Erillinen GK-laskentaversio ei tee tästä alkuperäisohjeesta valmista.",
    },
    en: {
      lead: "EDITORIAL HOLD: This published original recipe is under review. Do not cook from its current ingredient quantities or instructions. ",
      first: "The original preparation instructions are incomplete. Do not use them to cook this dish until reviewed.",
      second: "A weighed correction, yields, any nutrition figures and GI/GL links require separate review. A separate GL version does not validate the original recipe.",
    },
    sv: {
      lead: "KVALITETSVARNING: Detta publicerade originalrecept granskas. Tillaga inte rätten med de nuvarande mängderna eller instruktionerna. ",
      first: "Originalreceptets tillagningssteg är ofullständiga. Följ dem inte innan receptet har korrigerats.",
      second: "Uppvägda mängder, portionsantal, eventuella näringsvärden och GI/GL-kopplingar granskas separat. En separat GL-version godkänner inte grundreceptet.",
    },
    th: {
      lead: "คำเตือนด้านคุณภาพ: สูตรต้นฉบับที่เผยแพร่นี้อยู่ระหว่างการตรวจสอบ ห้ามปรุงอาหารตามปริมาณและขั้นตอนปัจจุบัน ",
      first: "วิธีทำของสูตรต้นฉบับยังไม่สมบูรณ์ อย่าใช้ทำอาหารจนกว่าจะผ่านการแก้ไขและตรวจสอบ",
      second: "ต้องตรวจสอบสูตรชั่งตวง จำนวนเสิร์ฟ ข้อมูลโภชนาการที่เกี่ยวข้อง และแหล่ง GI/GL แยกต่างหาก สูตร GL อีกเวอร์ชันไม่ได้เป็นการรับรองสูตรต้นฉบับ",
    },
  };
  const message = copy[locale];
  return {
    description: message.lead + reason,
    instructions: `1. ${message.first}\n2. ${message.second}`,
  };
}

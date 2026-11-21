import type { RecipeLocale } from "../../types/content";

export const feedbackKinds = [
  "recipe_error", "improvement", "new_recipe", "technical", "other",
] as const;
export type FeedbackKind = typeof feedbackKinds[number];

export const feedbackUi = {
  fi: {
    button: "Anna palautetta", recipeButton: "Ilmoita reseptivirhe",
    title: "Palaute ja reseptiehdotukset",
    intro: "Kerro virheestä, ehdota parannusta tai lähetä uuden reseptin idea. Viestisi menee yksityiseen tarkastusjonoon, ei suoraan sivustolle.",
    close: "Sulje", kind: "Palautteen aihe", message: "Viesti",
    email: "Sähköposti (vapaaehtoinen)", emailHelp: "Vain mahdollisia lisäkysymyksiä varten. Emme julkaise osoitetta.",
    context: "Liittyvä sivu", send: "Lähetä palaute", sending: "Lähetetään…",
    sent: "Kiitos, palautteesi on vastaanotettu tarkistettavaksi.",
    reference: "Seurantatunnus", error: "Lähetys epäonnistui. Tarkista yhteys ja yritä uudelleen.",
    turnstile: "Roskapostisuojan vahvistus", disabled: "Verkkolomakkeen vastaanottoa ei ole vielä avattu.",
    fallback: "Voit lähettää palautetta sähköpostilla:",
    sensitive: "Älä lähetä terveystietoja, salasanoja tai muita arkaluonteisia tietoja.",
    privacy: "Tietosuojaseloste", privacyNote: "Viesti ja mahdollinen sähköpostiosoite tallennetaan yksityiseen käsittelyjonoon. Palaute tarkistetaan ennen mahdollisia sivuston muutoksia.",
    kinds: {
      recipe_error: "Reseptissä on virhe",
      improvement: "Parannusehdotus",
      new_recipe: "Uusi reseptiehdotus",
      technical: "Sivuston tekninen ongelma",
      other: "Muu palaute",
    },
  },
  en: {
    button: "Send feedback", recipeButton: "Report a recipe error",
    title: "Feedback and recipe suggestions",
    intro: "Report an error, suggest an improvement or send a recipe idea. Messages enter a private review queue, not the public recipe library.",
    close: "Close", kind: "Feedback topic", message: "Message",
    email: "Email (optional)", emailHelp: "Only for follow-up questions. Your address will not be published.",
    context: "Related page", send: "Submit feedback", sending: "Sending…",
    sent: "Thank you. Your feedback has been received for review.",
    reference: "Reference number", error: "Submission failed. Check your connection and try again.",
    turnstile: "Spam protection verification", disabled: "Online feedback submissions are not yet enabled.",
    fallback: "You can send feedback by email:",
    sensitive: "Do not send health details, passwords or other sensitive information.",
    privacy: "Privacy notice", privacyNote: "Your message and optional email are stored in a private review queue. Suggestions are checked before any changes are published.",
    kinds: {
      recipe_error: "Recipe contains an error",
      improvement: "Improvement suggestion",
      new_recipe: "New recipe suggestion",
      technical: "Technical website problem",
      other: "Other feedback",
    },
  },
  sv: {
    button: "Lämna respons", recipeButton: "Rapportera receptfel",
    title: "Respons och receptförslag",
    intro: "Rapportera ett fel, föreslå en förbättring eller skicka en receptidé. Meddelandet går till en privat granskningskö, inte direkt till webbplatsen.",
    close: "Stäng", kind: "Ämne", message: "Meddelande",
    email: "E-post (frivilligt)", emailHelp: "Endast för eventuella följdfrågor. Adressen publiceras inte.",
    context: "Berörd sida", send: "Skicka respons", sending: "Skickar…",
    sent: "Tack! Din respons har tagits emot för granskning.",
    reference: "Ärendenummer", error: "Det gick inte att skicka. Kontrollera anslutningen och försök igen.",
    turnstile: "Verifiering mot skräppost", disabled: "Det går ännu inte att skicka via webbformuläret.",
    fallback: "Du kan skicka respons via e-post:",
    sensitive: "Skicka inte hälsouppgifter, lösenord eller andra känsliga uppgifter.",
    privacy: "Integritetspolicy", privacyNote: "Meddelandet och eventuell e-postadress sparas i en privat granskningskö. Förslag kontrolleras före publicering.",
    kinds: {
      recipe_error: "Fel i ett recept",
      improvement: "Förbättringsförslag",
      new_recipe: "Nytt receptförslag",
      technical: "Tekniskt problem på webbplatsen",
      other: "Annan respons",
    },
  },
  th: {
    button: "ส่งความคิดเห็น", recipeButton: "แจ้งข้อผิดพลาดของสูตรอาหาร",
    title: "ความคิดเห็นและข้อเสนอสูตรอาหาร",
    intro: "แจ้งข้อผิดพลาด เสนอการปรับปรุง หรือส่งไอเดียสูตรอาหาร ข้อความจะเข้าสู่คิวตรวจสอบส่วนตัว ไม่ได้เผยแพร่บนเว็บไซต์ทันที",
    close: "ปิด", kind: "หัวข้อ", message: "ข้อความ",
    email: "อีเมล (ไม่บังคับ)", emailHelp: "ใช้สำหรับสอบถามเพิ่มเติมเท่านั้น และจะไม่เผยแพร่ที่อยู่อีเมล",
    context: "หน้าที่เกี่ยวข้อง", send: "ส่งความคิดเห็น", sending: "กำลังส่ง…",
    sent: "ขอบคุณ เราได้รับความคิดเห็นของคุณเพื่อตรวจสอบแล้ว",
    reference: "หมายเลขอ้างอิง", error: "ส่งไม่สำเร็จ โปรดตรวจสอบการเชื่อมต่อแล้วลองอีกครั้ง",
    turnstile: "ตรวจสอบเพื่อป้องกันสแปม", disabled: "ระบบรับความคิดเห็นผ่านแบบฟอร์มยังไม่เปิดใช้งาน",
    fallback: "คุณสามารถส่งความคิดเห็นทางอีเมล:",
    sensitive: "โปรดอย่าส่งข้อมูลสุขภาพ รหัสผ่าน หรือข้อมูลอ่อนไหวอื่น ๆ",
    privacy: "นโยบายความเป็นส่วนตัว", privacyNote: "ข้อความและอีเมลที่ระบุจะถูกเก็บในคิวตรวจสอบส่วนตัว ข้อเสนอจะได้รับการตรวจสอบก่อนเผยแพร่การเปลี่ยนแปลง",
    kinds: {
      recipe_error: "ข้อผิดพลาดในสูตรอาหาร",
      improvement: "ข้อเสนอปรับปรุง",
      new_recipe: "เสนอสูตรอาหารใหม่",
      technical: "ปัญหาทางเทคนิคของเว็บไซต์",
      other: "ความคิดเห็นอื่น ๆ",
    },
  },
} satisfies Record<RecipeLocale, {
  button: string; recipeButton: string; title: string; intro: string; close: string;
  kind: string; message: string; email: string; emailHelp: string; context: string;
  send: string; sending: string; sent: string; reference: string; error: string;
  turnstile: string; disabled: string; fallback: string; sensitive: string;
  privacy: string; privacyNote: string; kinds: Record<FeedbackKind, string>;
}>;

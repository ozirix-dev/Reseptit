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
    quotaFull: "Palautekanava on tilapäisesti täynnä. Viestiäsi ei tallennettu. Kokeile myöhemmin tai lähetä sähköpostitse.",
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
    quotaFull: "The feedback form has reached its temporary submission limit. Your message was not saved. Try again later or email us.",
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
    quotaFull: "Responsformuläret har tillfälligt nått sin gräns. Meddelandet sparades inte. Försök senare eller skicka e-post.",
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
    quotaFull: "ขณะนี้แบบฟอร์มได้รับข้อความถึงขีดจำกัดชั่วคราว ข้อความของคุณยังไม่ถูกบันทึก โปรดลองอีกครั้งภายหลังหรือติดต่อทางอีเมล",
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
  send: string; sending: string; sent: string; reference: string; error: string; quotaFull: string;
  turnstile: string; disabled: string; fallback: string; sensitive: string;
  privacy: string; privacyNote: string; kinds: Record<FeedbackKind, string>;
}>;

/**
 * Initial privacy notice. The form stays disabled until a retention policy,
 * D1 deletion procedure and the production security configuration are approved.
 */
export const feedbackPrivacy = {
  fi: {
    heading: "Palautelomake (valmisteilla)",
    body: "Kun palautekanava otetaan käyttöön, lomakkeelle kirjoittamasi viesti, palauteluokka, sivun osoite ilman hakuparametreja, reseptitunniste, kieli ja mahdollinen sähköpostiosoite tallennetaan yksityiseen Cloudflare D1 -käsittelyjonoon virheen selvittämistä tai ehdotukseen vastaamista varten. Roskapostisuoja käyttää Cloudflare Turnstileä, jonka tunniste varmennetaan palvelimella. Viestiä tai sähköpostia ei julkaista automaattisesti eikä niitä lähetetä avoimiin GitHub-issueihin. Lomake pysyy suljettuna, kunnes säilytys- ja poistomenettely sekä tietosuoja on erikseen hyväksytty. Älä lähetä arkaluonteisia tietoja.",
  },
  en: {
    heading: "Feedback form (in preparation)",
    body: "Once enabled, the feedback form will store your message, feedback category, page path without query parameters, recipe identifier, language and optional email in a private Cloudflare D1 review queue to investigate errors or respond to suggestions. Cloudflare Turnstile provides spam protection with server-side verification. Messages and email addresses are not automatically published or sent to public GitHub issues. The form stays closed until retention, deletion and privacy procedures are approved. Please avoid sensitive data.",
  },
  sv: {
    heading: "Responsformulär (under förberedelse)",
    body: "När formuläret aktiveras sparas meddelandet, ämnet, sidans sökväg utan frågeparametrar, receptets ID, språk och eventuell e-postadress i en privat granskningskö i Cloudflare D1 för att hantera fel eller förslag. Cloudflare Turnstile används som skräppostskydd och verifieras på servern. Meddelanden och adresser publiceras inte automatiskt och skickas inte till offentliga GitHub-ärenden. Formuläret förblir stängt tills lagring, radering och integritetsrutiner har godkänts. Undvik känsliga uppgifter.",
  },
  th: {
    heading: "แบบฟอร์มความคิดเห็น (กำลังเตรียมใช้งาน)",
    body: "เมื่อเปิดใช้งาน ข้อความ ประเภทความคิดเห็น เส้นทางหน้าเว็บที่ไม่มีพารามิเตอร์ รหัสสูตรอาหาร ภาษา และอีเมลที่ให้ไว้โดยสมัครใจจะถูกเก็บในคิวตรวจสอบส่วนตัวของ Cloudflare D1 เพื่อตรวจสอบข้อผิดพลาดหรือตอบข้อเสนอแนะ ระบบใช้ Cloudflare Turnstile พร้อมตรวจสอบโทเค็นที่เซิร์ฟเวอร์ ข้อความและอีเมลจะไม่ถูกเผยแพร่หรือส่งไปยัง GitHub สาธารณะโดยอัตโนมัติ แบบฟอร์มจะยังปิดจนกว่าจะอนุมัติการเก็บรักษา การลบข้อมูล และมาตรการความเป็นส่วนตัว โปรดหลีกเลี่ยงข้อมูลอ่อนไหว",
  },
} satisfies Record<RecipeLocale, { heading: string; body: string }>;

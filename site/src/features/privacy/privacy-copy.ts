import type { RecipeLocale } from "../../types/content";
import { normalizePath } from "../../content/route-data";

export const privacyPaths: Record<RecipeLocale, string> = {
  fi: "/tietosuoja/", en: "/en/privacy/", sv: "/sv/integritet/", th: "/th/privacy/",
};
export const privacyEmail = "ossi@rikkola.fi";

export function privacyLocaleFromPath(path: string): RecipeLocale | undefined {
  return (Object.keys(privacyPaths) as RecipeLocale[]).find(locale => privacyPaths[locale] === normalizePath(path));
}

export const privacyCopy = {
  fi: {
    title: "Tietosuoja ja yhteystiedot",
    description: "Näin Recipavo käsittelee tietoja, kun selaat sivustoa tai otat yhteyttä. Täällä voit myös muuttaa analytiikkavalintaasi.",
    owner: "Rekisterinpitäjä ja yhteystiedot", contact: "Yhteydenotot",
    emails: "Kun lähetät sähköpostia, Ossi Rikkola käsittelee osoitteesi, viestin ja lähettämäsi tiedot vastatakseen ja selvittääkseen asian. Perusteena on oikeutettu etu hoitaa yhteydenotot ja ylläpitää palvelua. Viestejä säilytetään asian hoitamisen ajan ja sen jälkeen vain, jos laki tai oikeusvaate sitä edellyttää. Vältä terveystietojen ja muiden arkaluonteisten tietojen lähettämistä.",
    mailProvider: "Yhteydenotot vastaanotetaan sveitsiläisen Proton Mailin kautta.",
    hosting: "Sivuston toiminta",
    technical: "Cloudflare välittää sivut. Palvelun toimittamiseen, tietoturvaan ja virheiden selvittämiseen voidaan käsitellä IP-osoitetta, pyynnön teknisiä tietoja ja selaintietoja. Käsittely perustuu oikeutettuun etuun pitää palvelu saatavilla ja turvallisena. Teknisiä tietoja säilytetään näiden tehtävien vaatiman ajan. Cloudflaren tietosuojakäytäntö kertoo käsittelystä ja mahdollisista siirroista ETA:n ulkopuolelle suojatoimineen.",
    analytics: "Valinnainen kävijäanalytiikka",
    measurement: "Jos annat suostumuksen, Plausible Analytics mittaa sivukatseluja sekä haun, suodattimien, kielivalinnan ja reseptityökalujen käyttöä. Hakusanoja, suodatinvalintoja tai sivuosoitteiden kyselyparametreja ei lähetetä. Plausible toimii EU:ssa, ei aseta seurantakeksejä ja käyttää IP-osoitetta ja selaintietoja päivittäin vaihtuvan tunnisteen muodostamiseen. Raakaa IP-osoitetta ei tallenneta analytiikkaan. Tunnettujen hakukoneiden ja yhteisöpalvelujen osalta lähetetään vain lähteen verkkotunnus. Valinta tallennetaan selaimeesi ja on voimassa enintään 180 päivää. Voit muuttaa valintaa tällä sivulla milloin tahansa.",
    rights: "Oikeutesi ja valitukset",
    exercise: "Voit pyytää pääsyä tietoihisi, tietojen oikaisua tai poistamista ja käsittelyn rajoittamista. Soveltuvin osin voit vastustaa käsittelyä tai pyytää tietojen siirtämistä. Voit peruuttaa analytiikkasuostumuksesi milloin tahansa. Peruuttaminen koskee tulevaa käsittelyä. Lähetä tietosuojapyyntö yllä olevaan osoitteeseen. Voit tehdä valituksen tietosuojavaltuutetun toimistolle.",
    regulator: "Tietosuojavaltuutetun toimisto", allow: "Salli analytiikka", deny: "Hylkää analytiikka",
    consent: "Saammeko mitata Recipavon käyttöä Plausiblella? Valinta on vapaaehtoinen.",
    enabled: "Analytiikka on sallittu tässä selaimessa.", disabled: "Analytiikka on pois käytöstä tässä selaimessa.",
  },
  en: {
    title: "Privacy and contact", description: "How Recipavo handles data when you browse or get in touch. You can also change your analytics choice here.",
    owner: "Data controller and contact", contact: "When you email us",
    emails: "If you contact us, Ossi Rikkola uses your email address, message and any information you send to respond and resolve the matter. The legal basis is the legitimate interest in handling enquiries and maintaining the service. Messages are kept while needed to deal with the matter and afterwards only where required by law or a legal claim. Avoid sending health data or other sensitive information.",
    mailProvider: "Enquiries are received through Proton Mail, a Swiss email provider.",
    hosting: "Running the site",
    technical: "Cloudflare delivers the site. It may process IP addresses, technical request data and browser information to deliver the service, keep it secure and troubleshoot it. The legal basis is the legitimate interest in providing a secure and available service. Technical information is kept as long as those purposes require. Cloudflare’s privacy policy explains its processing and safeguards for possible transfers outside the EEA.",
    analytics: "Optional visitor analytics",
    measurement: "If you consent, Plausible Analytics measures page views and use of search, filters, language selection and recipe tools. Search terms, selected filter values and URL query parameters are never sent. Plausible operates in the EU and sets no tracking cookies. It uses the IP address and browser information to create a daily rotating identifier without storing the raw IP address in analytics. For recognised search engines and social sites, we send only the source domain. Your choice is saved in your browser and remains valid for up to 180 days. You can change it on this page at any time.",
    rights: "Your rights and complaints",
    exercise: "You can request access, correction, deletion or restriction of your data. Where applicable, you can object to processing or request data portability. You can withdraw analytics consent at any time for future processing. Email the address above to exercise your rights. You can lodge a complaint with Finland’s Data Protection Ombudsman.",
    regulator: "Office of the Data Protection Ombudsman", allow: "Allow analytics", deny: "Reject analytics",
    consent: "May we use Plausible to measure how Recipavo is used? This is optional.",
    enabled: "Analytics is allowed in this browser.", disabled: "Analytics is off in this browser.",
  },
  sv: {
    title: "Integritet och kontakt", description: "Så behandlar Recipavo uppgifter när du besöker webbplatsen eller kontaktar oss. Här kan du också ändra ditt val för analys.",
    owner: "Personuppgiftsansvarig och kontakt", contact: "När du kontaktar oss",
    emails: "När du skickar e-post behandlar Ossi Rikkola din adress, ditt meddelande och uppgifterna du skickar för att svara och hantera ärendet. Den rättsliga grunden är ett berättigat intresse av att hantera förfrågningar och underhålla tjänsten. Meddelanden sparas så länge ärendet kräver och därefter endast om lagen eller ett rättsligt anspråk kräver det. Undvik att skicka hälsouppgifter eller andra känsliga uppgifter.",
    mailProvider: "Förfrågningar tas emot via den schweiziska e-posttjänsten Proton Mail.",
    hosting: "Drift av webbplatsen",
    technical: "Cloudflare levererar webbplatsen. IP-adresser, tekniska uppgifter om begäran och webbläsaruppgifter kan behandlas för att leverera tjänsten, hålla den säker och felsöka. Den rättsliga grunden är det berättigade intresset av en säker och tillgänglig tjänst. Tekniska uppgifter sparas så länge dessa ändamål kräver. Cloudflares integritetspolicy beskriver behandlingen och skyddet vid eventuella överföringar utanför EES.",
    analytics: "Valfri besöksanalys",
    measurement: "Om du samtycker mäter Plausible Analytics sidvisningar och användningen av sökning, filter, språkval och receptverktyg. Sökord, valda filtervärden och webbadressens frågeparametrar skickas aldrig. Plausible arbetar inom EU, använder inga spårningskakor och använder IP-adressen och webbläsaruppgifter för att skapa en identifierare som byts dagligen. Den råa IP-adressen lagras inte i analysen. För kända sökmotorer och sociala medier skickar vi endast källans domän. Ditt val sparas i webbläsaren och gäller i högst 180 dagar. Du kan ändra det här när som helst.",
    rights: "Dina rättigheter och klagomål",
    exercise: "Du kan begära tillgång till, rättelse eller radering av dina uppgifter samt begränsning av behandlingen. När det är tillämpligt kan du invända mot behandlingen eller begära dataportabilitet. Du kan när som helst återkalla ditt samtycke till analys för framtida behandling. Skicka din begäran till adressen ovan. Du kan lämna in ett klagomål till dataombudsmannens byrå i Finland.",
    regulator: "Dataombudsmannens byrå", allow: "Tillåt analys", deny: "Avvisa analys",
    consent: "Får vi mäta hur Recipavo används med Plausible? Valet är frivilligt.",
    enabled: "Analys är tillåten i den här webbläsaren.", disabled: "Analys är avstängd i den här webbläsaren.",
  },
  th: {
    title: "ความเป็นส่วนตัวและการติดต่อ", description: "วิธีที่ Recipavo ใช้ข้อมูลเมื่อคุณเข้าชมเว็บไซต์หรือติดต่อเรา และวิธีเปลี่ยนการตั้งค่าการวิเคราะห์การใช้งาน",
    owner: "ผู้ควบคุมข้อมูลและช่องทางติดต่อ", contact: "เมื่อคุณติดต่อเรา",
    emails: "เมื่อคุณส่งอีเมล Ossi Rikkola จะใช้ที่อยู่อีเมล ข้อความ และข้อมูลที่คุณส่งมาเพื่อตอบและจัดการเรื่องของคุณ โดยอาศัยประโยชน์โดยชอบด้วยกฎหมายในการจัดการข้อสอบถามและดูแลบริการ เราเก็บข้อความเท่าที่จำเป็นต่อการจัดการเรื่องนั้น หลังจากนั้นจะเก็บต่อเฉพาะเมื่อกฎหมายหรือข้อเรียกร้องทางกฎหมายกำหนด โปรดหลีกเลี่ยงการส่งข้อมูลสุขภาพหรือข้อมูลอ่อนไหวอื่น ๆ",
    mailProvider: "เราใช้ Proton Mail ผู้ให้บริการอีเมลจากสวิตเซอร์แลนด์เพื่อรับข้อความ",
    hosting: "การให้บริการเว็บไซต์",
    technical: "Cloudflare ให้บริการส่งหน้าเว็บไซต์ และอาจประมวลผลที่อยู่ IP ข้อมูลทางเทคนิคของคำขอและข้อมูลเบราว์เซอร์เพื่อให้บริการ รักษาความปลอดภัย และแก้ไขปัญหา โดยอาศัยประโยชน์โดยชอบด้วยกฎหมายในการให้บริการที่พร้อมใช้และปลอดภัย เราเก็บข้อมูลทางเทคนิคเท่าที่จำเป็นสำหรับวัตถุประสงค์เหล่านี้ นโยบายของ Cloudflare อธิบายการประมวลผลและมาตรการคุ้มครองเมื่อมีการโอนข้อมูลออกนอกเขตเศรษฐกิจยุโรป",
    analytics: "การวิเคราะห์การใช้งานแบบสมัครใจ",
    measurement: "หากคุณยินยอม Plausible Analytics จะวัดการเข้าชมหน้าและการใช้การค้นหา ตัวกรอง การเปลี่ยนภาษา และเครื่องมือสูตรอาหาร เราไม่ส่งคำค้นหา ค่าตัวกรอง หรือพารามิเตอร์ใน URL Plausible ให้บริการในสหภาพยุโรปและไม่ใช้คุกกี้ติดตาม Plausible ใช้ที่อยู่ IP และข้อมูลเบราว์เซอร์เพื่อสร้างรหัสที่เปลี่ยนทุกวันโดยไม่เก็บที่อยู่ IP ดิบในระบบวิเคราะห์ สำหรับเครื่องมือค้นหาและสื่อสังคมที่รู้จัก เราส่งเฉพาะชื่อโดเมนต้นทาง เราบันทึกตัวเลือกไว้ในเบราว์เซอร์ และตัวเลือกมีผลไม่เกิน 180 วัน คุณเปลี่ยนตัวเลือกได้ในหน้านี้ทุกเมื่อ",
    rights: "สิทธิและการร้องเรียน",
    exercise: "คุณขอเข้าถึง แก้ไข ลบ หรือจำกัดการประมวลผลข้อมูลของคุณได้ และมีสิทธิคัดค้านหรือขอโอนย้ายข้อมูลเมื่อเข้าเงื่อนไข คุณถอนความยินยอมได้ทุกเมื่อสำหรับการประมวลผลในอนาคต โปรดส่งคำขอไปยังอีเมลด้านบน คุณร้องเรียนต่อสำนักงานผู้ตรวจการคุ้มครองข้อมูลของฟินแลนด์ได้",
    regulator: "สำนักงานผู้ตรวจการคุ้มครองข้อมูลของฟินแลนด์", allow: "อนุญาตการวิเคราะห์", deny: "ไม่อนุญาตการวิเคราะห์",
    consent: "คุณอนุญาตให้เราใช้ Plausible วัดการใช้งาน Recipavo หรือไม่ คุณเลือกได้ตามสมัครใจ",
    enabled: "เบราว์เซอร์นี้อนุญาตการวิเคราะห์แล้ว", disabled: "เบราว์เซอร์นี้ปิดการวิเคราะห์อยู่",
  },
} satisfies Record<RecipeLocale, Record<string, string>>;


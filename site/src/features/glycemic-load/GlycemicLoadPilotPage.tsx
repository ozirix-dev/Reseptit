import {gkOnlyVariants,gkVersionCoverage} from '@/generated/gk-only-variants.generated';
import {GkOnlyVariantPanel,gkOnlyUi,gkScopeUi} from '../recipes/GkOnlyVariantPanel';
import {scopedPolyolDisclosure} from '../recipes/scoped-polyol-disclosure';
import {recoveryDisclosure} from '../recipes/recovery-disclosure';
import {formatGlycemicLoadNumber} from '../recipes/gk80-format';
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { glycemicLoadPilotReviewedRecipeCount, glycemicLoadPilotResults } from "@/generated/glycemic-load-pilot.generated";
import { recipeLocaleFromPath } from "@/features/recipes/recipe-i18n";
import type { RecipeLocale } from "@/types/content";

const copy = {
  fi: { eyebrow: "Laskennallinen arvio", title: "Glykeeminen kuorma: lähteet ja laskenta", intro: "Tällä sivulla kuvataan reseptien GK-arvioiden laskentatapa, tietolähteet ja reseptikohtaiset oletukset. Arviot perustuvat ainesosiin; ne eivät mittaa valmiin ruoan tai yksittäisen ihmisen verensokerivastetta.",
    about: "noin", perServing: "/ annos", summary: "Pilotin tilanne", total: "reseptiä tarkasteltu", done: "laskennallista arviota", pending: "ilman kokonaisarviota", method: "Miten GK lasketaan?", formula: "GK = Σ (ainesosan GI × imeytyvät hiilihydraatit annosta kohti) / 100.",
    fineli: "Fineli Rel20 on imeytyvien hiilihydraattien ensisijainen lähde. Kun sopivaa Fineli-tietuetta ei ollut, käytettiin rajattuihin ainesosiin AFCD Release 3 -aineistoa; lähde ja poikkeama näkyvät reseptikohtaisissa tiedoissa. Reseptien annokset ja ruoka-ainekohtaiset annosmitat muunnetaan grammoiksi, kun lähteestä löytyy sopiva mitta.", gi: "Julkiseen arvioon voidaan käyttää julkaistua suoraa GI-osumaa, perusteltua ruoka- tai valmistustapa-analogiaa tai yleistä ryhmäkeskiarvoa. Analogiat ja ryhmäkeskiarvot merkitään matalan luottamuksen arvioiksi; tutkimuksen laatu ei yksin takaa ruoka-ainevastaavuutta.",
    interpretation: "Vanhemmassa toleranssipolussa lähteistetyt positiiviset hiilihydraattimäärät lasketaan mukaan seuraavin poikkeuksin. Yksittäinen GI-osumaton alle 1 g:n imeytyvän hiilihydraatin osuus voidaan jättää pois vain, kun kaikkien tällaisten osuuksien yhteissumma jää alle 2 g/annos; pois jätetty määrä näytetään. Raja on käyttäjälähtöinen toimituksellinen toleranssi, ei mitattu kliininen tarkkuusraja. Todellinen vaste vaihtelee raaka-aineiden, valmistuksen, annoksen ja ihmisen mukaan. GK on ainesosista laskettu arvio, ei valmiin sekalaisen aterian mittaus.", sources: "Yleiset lähteet", recipeDetails: "Reseptikohtaiset tulokset ja oletukset", value: "GK-arvio", confidence: "Luottamustaso", source: "Käytetyt lähteet ja oletukset", carbohydrateData: "Hiilihydraattitiedon lähde", high: "korkea", medium: "keskitasoinen", low: "matala", incomplete: "Kokonaisarviota ei julkaista, koska olennaista ainesosatietoa tai GI-vastinetta puuttuu.",
    liverTitle: "Maksalaatikko kukkakaalilla", liver: "Reseptille ei näytetä kokonais-GK-lukua. Aiempi 3,45-arvio käsitteli naudanmaksan imeytyvät hiilihydraatit nolla-GI-oletuksella, jota ei ole mitattu eikä perusteltu maksan GI-arvona.", massaman: "Massamanin noin 5–6 vaihteluväli syntyy currytahnan hiilihydraattimäärän kahdesta lähteistetystä skenaariosta: Finelin Tikka-tahnan vastineesta ja yhden tuotemerkin tuotetiedoista. Se kuvaa vain tätä ainesosatiedon vaihtelua, ei koko laskelman virhemarginaalia.",
  },
  en: { about: "about", perServing: "/ serving", eyebrow: "Calculated estimate", title: "Glycemic load: sources and method", intro: "This page explains how recipe GL estimates are calculated, which sources are used and what assumptions apply to each recipe. Estimates are ingredient-based; they do not measure the glucose response to a prepared meal or an individual.", summary: "Pilot status", total: "recipes reviewed", done: "calculated estimates", pending: "without a total estimate", method: "How is GL calculated?", formula: "GL = Σ (ingredient GI × available carbohydrate per serving) / 100.", fineli: "Fineli Release 20 is the primary source for available carbohydrate. AFCD Release 3 supplements Fineli for a limited set of ingredients without a suitable Fineli record; each source and exception is identified in the recipe details. Recipe amounts are converted using food-specific measures when available.", gi: "Published direct GI values, justified food or preparation analogues, and broad category means may support an ingredient estimate. Analogues and category means are low confidence; study quality alone does not establish food equivalence.", interpretation: "In the older tolerance path, sourced positive carbohydrate amounts are included with these exceptions. An unmatched individual portion under 1 g available carbohydrate per serving may be omitted only when all such omissions total less than 2 g per serving; the omitted amount is disclosed. This is a user-centered editorial tolerance, not a measured clinical precision limit.", sources: "General sources", recipeDetails: "Recipe results and assumptions", value: "GL estimate", confidence: "Confidence", source: "Sources and assumptions used", carbohydrateData: "Available-carbohydrate data", high: "high", medium: "moderate", low: "low", incomplete: "No total estimate is published because material ingredient data or a GI analogue is missing.", liverTitle: "Beef liver casserole with cauliflower", liver: "No total GL is shown for this recipe. The earlier 3.45 estimate assigned an unmeasured zero-GI assumption to the available carbohydrate in beef liver; that is not a measured or justified liver GI value.", massaman: "The Massaman range of about 5–6 comes from two sourced scenarios for curry-paste carbohydrate: a Fineli Tikka-paste analogue and one branded product label. It describes variation in this ingredient data only, not an uncertainty interval for the entire calculation.",
  },
  sv: { about: "cirka", perServing: "/ portion", eyebrow: "Beräknad uppskattning", title: "Glykemisk belastning: källor och metod", intro: "Här beskrivs hur receptens GL uppskattas, vilka källor som används och vilka antaganden som gäller för varje recept. Uppskattningarna bygger på ingredienser och mäter inte blodsockersvaret från en färdig måltid eller en person.", summary: "Pilotstatus", total: "granskade recept", done: "beräknade uppskattningar", pending: "utan total uppskattning", method: "Hur beräknas GL?", formula: "GL = Σ (ingrediensens GI × tillgängliga kolhydrater per portion) / 100.", fineli: "Fineli Rel20 är den primära källan för tillgängliga kolhydrater. AFCD Release 3 kompletterar Fineli för ett begränsat antal ingredienser där en lämplig Fineli-post saknades; källa och undantag anges vid respektive recept. Mängder omvandlas med livsmedelsspecifika mått när sådana finns.", gi: "Publicerade direkta GI-värden, motiverade livsmedels- eller tillagningsanaloger och breda kategorimedelvärden kan stödja en ingrediensuppskattning. Analogier och kategorimedelvärden har låg säkerhet; studiekvalitet visar inte i sig att livsmedlen motsvarar varandra.", interpretation: "I den äldre toleransmodellen räknas källbelagda positiva kolhydratmängder med med följande undantag. En enskild mängd under 1 g tillgängliga kolhydrater per portion utan GI-träff kan utelämnas endast om summan av alla sådana mängder understiger 2 g per portion; mängden redovisas. Detta är en användarcentrerad redaktionell tolerans, inte en uppmätt klinisk precisionsgräns.", sources: "Allmänna källor", recipeDetails: "Receptresultat och antaganden", value: "GL-uppskattning", confidence: "Säkerhet", source: "Källor och antaganden", carbohydrateData: "Underlag för tillgängliga kolhydrater", high: "hög", medium: "medelhög", low: "låg", incomplete: "Ingen total uppskattning publiceras eftersom viktig ingrediensinformation eller GI-analogi saknas.", liverTitle: "Levergryta med blomkål", liver: "Inget totalt GL-värde visas för receptet. Den tidigare uppskattningen 3,45 använde ett omätt antagande om GI noll för leverns tillgängliga kolhydrater; det är inget uppmätt eller välgrundat GI-värde för lever.", massaman: "Massamans intervall omkring 5–6 kommer från två källbelagda scenarier för currypastans kolhydrater: en Fineli-analogi för Tikka-pasta och en produktetikett. Intervallet beskriver bara variationen i denna ingrediensdata, inte osäkerheten i hela beräkningen.",
  },
  th: { about: "ประมาณ", perServing: "/ หนึ่งที่", eyebrow: "ค่าประมาณจากการคำนวณ", title: "ภาระน้ำตาลในเลือด: แหล่งข้อมูลและวิธีคำนวณ", intro: "หน้านี้อธิบายวิธีคำนวณค่า GL ของสูตรอาหาร แหล่งข้อมูล และสมมติฐานของแต่ละสูตร ค่าประมาณคำนวณจากวัตถุดิบ ไม่ใช่การวัดการตอบสนองของน้ำตาลจากอาหารที่ปรุงเสร็จหรือบุคคลใดบุคคลหนึ่ง", summary: "สถานะการทดลอง", total: "สูตรที่ตรวจสอบ", done: "ค่าประมาณที่คำนวณแล้ว", pending: "ไม่มีค่ารวม", method: "คำนวณค่า GL อย่างไร", formula: "GL = Σ (ค่า GI ของวัตถุดิบ × คาร์โบไฮเดรตที่ร่างกายใช้ได้ต่อหนึ่งที่) / 100.", fineli: "Fineli Release 20 เป็นแหล่งข้อมูลหลักของคาร์โบไฮเดรตที่ร่างกายใช้ได้ AFCD Release 3 ใช้เสริมข้อมูล Fineli สำหรับวัตถุดิบบางรายการที่ไม่พบข้อมูล Fineli ที่เหมาะสม โดยระบุแหล่งข้อมูลและข้อยกเว้นไว้ในรายละเอียดของแต่ละสูตร ระบบแปลงปริมาณด้วยหน่วยเฉพาะของอาหารเมื่อมีข้อมูล", gi: "ค่า GI ที่ตีพิมพ์และตรงกับอาหาร ค่าเทียบเคียงด้านวัตถุดิบหรือวิธีปรุงที่มีเหตุผล และค่าเฉลี่ยของหมวดอาหารแบบกว้างอาจใช้สนับสนุนค่าประมาณได้ ค่าเทียบเคียงและค่าเฉลี่ยหมวดอาหารมีความเชื่อมั่นต่ำ คุณภาพงานวิจัยเพียงอย่างเดียวไม่ได้ยืนยันว่าอาหารตรงกัน", interpretation: "แนวทางเดิมที่ยอมให้ละเว้นปริมาณเล็กน้อยรวมคาร์โบไฮเดรตที่มีข้อมูลรองรับโดยมีข้อยกเว้นต่อไปนี้ ส่วนผสมแต่ละอย่างที่ไม่มีค่า GI และมีคาร์โบไฮเดรตที่ใช้ได้ต่ำกว่า 1 กรัมต่อหนึ่งที่อาจไม่นำมารวมได้ เมื่อปริมาณที่ไม่นำมารวมทั้งหมดต่ำกว่า 2 กรัมต่อหนึ่งที่ โดยจะแจ้งปริมาณที่ไม่รวม เกณฑ์นี้เป็นค่าความคลาดเคลื่อนเชิงบรรณาธิการที่คำนึงถึงผู้ใช้ ไม่ใช่ค่าความแม่นยำทางคลินิกที่วัดได้", sources: "แหล่งข้อมูลทั่วไป", recipeDetails: "ผลลัพธ์และสมมติฐานของแต่ละสูตร", value: "ค่าประมาณ GL", confidence: "ระดับความเชื่อมั่น", source: "แหล่งข้อมูลและสมมติฐาน", carbohydrateData: "ข้อมูลคาร์โบไฮเดรตที่ร่างกายใช้ได้", high: "สูง", medium: "ปานกลาง", low: "ต่ำ", incomplete: "ไม่เผยแพร่ค่ารวมเนื่องจากข้อมูลวัตถุดิบสำคัญหรือค่า GI เทียบเคียงยังขาดหาย", liverTitle: "หม้อตับเนื้อกับกะหล่ำดอก", liver: "สูตรนี้ไม่แสดงค่า GL รวม ค่า 3.45 ก่อนหน้านี้ใช้สมมติฐาน GI เท่ากับศูนย์ที่ไม่ได้วัดสำหรับคาร์โบไฮเดรตในตับเนื้อ จึงไม่ใช่ค่า GI ของตับที่วัดหรือมีหลักฐานรองรับ", massaman: "ช่วงประมาณ 5–6 ของแกงมัสมั่นมาจากสองสถานการณ์ที่มีแหล่งอ้างอิงสำหรับคาร์โบไฮเดรตในพริกแกง ได้แก่ ค่าของพริกแกง Tikka ใน Fineli และฉลากผลิตภัณฑ์หนึ่งยี่ห้อ ช่วงนี้แสดงเฉพาะความแตกต่างของข้อมูลวัตถุดิบนี้ ไม่ใช่ช่วงความคลาดเคลื่อนของการคำนวณทั้งหมด",
  },
} satisfies Record<RecipeLocale, Record<string, string>>;
const modelledMethod: Record<RecipeLocale, string> = {
  "fi": "Osassa reseptejä GK on mallinnettu julkaistuista GI-tiedoista. Kun tarkkaa elintarviketta ei ole mitattu, käytetään nimettyä vertailuruokaa tai julkaistua imputointimenetelmää. Luottamus on matala. Mahdolliset pienet poisrajaukset ja niiden yhteenlaskettu määrä tai dokumentoitu yläraja ilmoitetaan reseptikohtaisesti. Piste tai nimettyjen vaihtoehtojen skenaarioalue ei ole yksilöllisen verensokerivasteen vaihteluväli.",
  "en": "Some recipes use a modeled GL estimate from published GI data. Where the exact food has not been tested, a named comparison food or published imputation method is used. Confidence is low. Any small portions omitted, and their combined amount or documented upper bound, are disclosed for each recipe. A point or range of named scenarios is not an interval for an individual glucose response.",
  "sv": "Vissa recept har en modellerad GL-uppskattning från publicerade GI-data. När det exakta livsmedlet inte har testats används ett namngivet jämförelselivsmedel eller en publicerad imputeringsmetod. Säkerheten är låg. Eventuella utelämnade små mängder och deras sammanlagda mängd eller dokumenterade övre gräns redovisas för varje recept. En punkt eller ett intervall av namngivna scenarier beskriver inte en persons blodsockersvar.",
  "th": "บางสูตรใช้ค่าประมาณ GL จากแบบจำลองโดยอาศัยข้อมูล GI ที่ตีพิมพ์ หากยังไม่มีการทดสอบอาหารชนิดนั้นโดยตรง จะใช้อาหารเทียบเคียงที่ระบุชื่อหรือวิธีประมาณค่าจากงานตีพิมพ์ ระดับความเชื่อมั่นต่ำ หากมีส่วนผสมปริมาณเล็กน้อยที่ไม่รวมในการคำนวณ จะแสดงปริมาณรวมหรือขีดจำกัดบนที่มีข้อมูลรองรับแยกไว้ในแต่ละสูตร ค่าจุดหรือช่วงของสถานการณ์ที่ระบุไม่ใช่ช่วงการตอบสนองของน้ำตาลในเลือดของแต่ละบุคคล"
};
const omissionCopy: Record<RecipeLocale, (amount: string) => string> = {
  fi: (amount) => `Pieniä osuuksia jätettiin pois yhteensä ${amount} g imeytyvää hiilihydraattia annosta kohti.`,
  en: (amount) => `Small portions omitted: ${amount} g available carbohydrate per serving.`,
  sv: (amount) => `Utelämnade små mängder: ${amount} g tillgängliga kolhydrater per portion.`,
  th: (amount) => `ปริมาณเล็กน้อยที่ไม่รวม: คาร์โบไฮเดรตที่ใช้ได้ ${amount} กรัมต่อหนึ่งที่`,
};

const incompleteCopy: Record<RecipeLocale, { title: string; gi: string; source: string; portion: string; variant: string; amount: string }> = {
  fi: { title: "Miksi kokonaisarviota ei ole?", gi: "Sopivaa julkaistua GI-arvoa ei löytynyt.", source: "Ainesosan koostumus- tai tuotetietoa ei voitu täsmätä.", portion: "Määrää ei voitu muuntaa ruoka-ainekohtaisella massatiedolla.", variant: "Reseptissä on hiilihydraattimäärään vaikuttava avoin ainesosavaihtoehto.", amount: "Ainesosamäärä puuttuu tai vaikuttaa virheelliseltä; sitä ei korjattu arvaamalla." },
  en: { title: "Why is there no total estimate?", gi: "No suitable published GI value was found.", source: "The ingredient composition or product information could not be matched.", portion: "The amount could not be converted using food-specific mass data.", variant: "The recipe leaves an ingredient choice open that affects available carbohydrate.", amount: "The amount is missing or appears erroneous; it was not corrected by guessing." },
  sv: { title: "Varför saknas ett totalvärde?", gi: "Ett lämpligt publicerat GI-värde saknas.", source: "Ingrediensens sammansättning eller produktinformation kunde inte matchas.", portion: "Mängden kunde inte omvandlas med livsmedelsspecifika massdata.", variant: "Receptet lämnar ett ingrediensval öppet som påverkar tillgängliga kolhydrater.", amount: "Mängden saknas eller verkar felaktig; den har inte korrigerats genom gissning." },
  th: { title: "เหตุใดจึงไม่มีค่าประมาณรวม", gi: "ไม่พบค่า GI ที่เผยแพร่และเหมาะสม", source: "ไม่สามารถจับคู่ข้อมูลส่วนประกอบหรือผลิตภัณฑ์ของวัตถุดิบได้", portion: "ไม่สามารถแปลงปริมาณด้วยข้อมูลน้ำหนักเฉพาะอาหารได้", variant: "สูตรยังเปิดให้เลือกวัตถุดิบที่มีผลต่อปริมาณคาร์โบไฮเดรตที่ใช้ได้", amount: "ปริมาณขาดหายหรือดูผิดพลาด และไม่ได้แก้ไขด้วยการคาดเดา" },
};

const sources = [
  ["International Tables 2021", "https://doi.org/10.1093/ajcn/nqab233"],
  ["THL / Fineli Rel20 open data (CC BY 4.0)", "https://fineli.fi/fineli/fi/avoin-data"],
  ["FSANZ Australian Food Composition Database Release 3 (CC BY-SA 3.0 Australia)", "https://www.foodstandards.gov.au/science-data/monitoringnutrients/afcd"],
  ["University of Sydney GI database", "https://glycemicindex.com/gi-search/"],
  ["Non-western foods compendium 2021", "https://doi.org/10.1038/s41387-020-00145-w"],
  ["ISO 26642:2010", "https://committee.iso.org/standard/43633.html"],
  ["Nutrients 2020 vegetable GI review", "https://doi.org/10.3390/nu12103041"],
];

export function GlycemicLoadPilotPage() {
  const location = useLocation();
  const locale = recipeLocaleFromPath(location.pathname);
  const [search, setSearch] = useState("");
  const [showCalculatedOnly, setShowCalculatedOnly] = useState(false);
  // Pre-render every result for indexing and links; progressively limit the hydrated list.
  const [visibleLimit, setVisibleLimit] = useState(Number.POSITIVE_INFINITY);
  useEffect(() => {
    if (location.hash) {
      setSearch("");
      setShowCalculatedOnly(false);
      setVisibleLimit(Number.POSITIVE_INFINITY);
      const targetId = decodeURIComponent(location.hash.slice(1));
      // The target can be restored after client-side routing or an already-filtered list.
      window.requestAnimationFrame(() => document.getElementById(targetId)?.scrollIntoView());
    } else {
      setVisibleLimit(24);
    }
  }, [location.hash]);
  const text = copy[locale];

  const numberLocale = { fi: "fi-FI", en: "en-GB", sv: "sv-SE", th: "th-TH" }[locale];
  const number = new Intl.NumberFormat(numberLocale, { maximumSignificantDigits: 1, minimumSignificantDigits: 1 });
  const modelled = { fi: "Mallinnettu", en: "Modeled", sv: "Modellerad", th: "ค่าประมาณจากแบบจำลอง" }[locale];
  const displayNumber = (v:number, modeled:boolean) => formatGlycemicLoadNumber(v,numberLocale,modeled);
  const ux = {
    fi: { title: "Löydä reseptin GK-arvio", description: "Hae reseptin nimellä tai avaa sen tarkemmat lähteet. Laskettu arvo on arvio, ei verensokerimittaus.", search: "Hae reseptiä", placeholder: "Kirjoita reseptin nimi…", only: "Näytä vain GK-arvion sisältävät", matches: "Hakutuloksia", empty: "Yhtään sopivaa reseptiä ei löytynyt.", method: "Tarkat laskentamenetelmät ja tutkimuslähteet", variants: "Reseptikohtaiset arviot ja lähteet", background: "Mitä laskennan kattavuus tarkoittaa?", guidance: "GK-arvio on saatavilla sekä alkuperäisille että erikseen hyväksytyille muokatuille reseptiversioille. Muokattua versiota ei saa sekoittaa alkuperäiseen.", note: "Arviot perustuvat raaka-aineisiin ja annoskokoihin. Niistä ei voi päätellä yksittäisen ihmisen verensokerivastetta.", more: "Näytä 24 lisää", all: "Näytä kaikki tulokset", shown: "Näytetään" },
    en: { title: "Find a recipe's glycemic load", description: "Search by recipe name and open detailed sources as needed. The value is an estimate, not a glucose measurement.", search: "Search recipes", placeholder: "Enter a recipe name…", only: "Show recipes with a calculated GL", matches: "Matching recipes", empty: "No matching recipes found.", method: "Detailed calculation methods and scientific sources", variants: "Recipe estimates and sources", background: "What does calculation coverage mean?", guidance: "Estimates include original recipes and separately approved modified versions. A modified version must not be confused with the original.", note: "Estimates use ingredients and portion sizes. They do not predict an individual's glucose response.", more: "Show 24 more", all: "Show all results", shown: "Showing" },
    sv: { title: "Hitta receptets glykemiska belastning", description: "Sök på receptnamn och öppna källorna vid behov. Värdet är en uppskattning, inte en blodsockermätning.", search: "Sök recept", placeholder: "Skriv receptets namn…", only: "Visa endast recept med beräknat värde", matches: "Sökresultat", empty: "Inga recept hittades.", method: "Detaljerad beräkningsmetod och vetenskapliga källor", variants: "Receptvärden och källor", background: "Vad betyder täckningen?", guidance: "Uppskattningar finns för originalrecept och separat godkända ändrade versioner. Dessa får inte förväxlas.", note: "Uppskattningarna bygger på ingredienser och portionsstorlek, inte på en persons blodsockersvar.", more: "Visa 24 till", all: "Visa alla resultat", shown: "Visar" },
    th: { title: "ค้นหาค่า GL ของสูตรอาหาร", description: "ค้นหาตามชื่อสูตรและเปิดดูแหล่งข้อมูลโดยละเอียดเมื่อจำเป็น ค่านี้เป็นการประมาณ ไม่ใช่ผลตรวจน้ำตาลในเลือด", search: "ค้นหาสูตรอาหาร", placeholder: "พิมพ์ชื่อสูตรอาหาร…", only: "แสดงเฉพาะสูตรที่มีค่า GL", matches: "ผลการค้นหา", empty: "ไม่พบสูตรอาหาร", method: "วิธีคำนวณและแหล่งข้อมูลวิชาการโดยละเอียด", variants: "ค่าประมาณและแหล่งข้อมูลของแต่ละสูตร", background: "ความครอบคลุมหมายถึงอะไร", guidance: "ค่าประมาณครอบคลุมสูตรต้นฉบับและสูตรที่ปรับแล้วซึ่งได้รับอนุมัติแยกต่างหาก ไม่ควรสับสนระหว่างสองแบบ", note: "ค่าประมาณคำนวณจากวัตถุดิบและปริมาณต่อหนึ่งที่ ไม่ใช่การทำนายระดับน้ำตาลในเลือดของแต่ละคน", more: "แสดงอีก 24 รายการ", all: "แสดงผลทั้งหมด", shown: "แสดง" },
  }[locale];
  const visibleResults = glycemicLoadPilotResults.filter((result) => {
    if (showCalculatedOnly && result.status !== "CALCULATED" && !gkOnlyVariants.some((variant) => variant.recipeId === result.recipeId)) return false;
    if (!search.trim()) return true;
    const localized = result.localeRoutes[locale] ?? result.localeRoutes.fi;
    return (localized?.title ?? result.title).toLocaleLowerCase(numberLocale).includes(search.trim().toLocaleLowerCase(numberLocale));
  });
  const displayedResults = visibleResults.slice(0, visibleLimit);
  const formatValue = (result: typeof glycemicLoadPilotResults[number]) => result.glycemicLoadRangePerServing
    ? `${result.assessmentType ? modelled + " " : ""}${text.about} ${displayNumber(result.glycemicLoadRangePerServing.min,!!result.assessmentType)}–${displayNumber(result.glycemicLoadRangePerServing.max,!!result.assessmentType)} ${text.perServing}`
    : result.glycemicLoadPerServing === null ? text.incomplete : `${result.assessmentType ? modelled + " " : ""}${text.about} ${displayNumber(result.glycemicLoadPerServing,!!result.assessmentType)} ${text.perServing}`;
  return <section className="page-section glycemic-pilot" lang={locale}>
    <div className="container container--narrow">
      <header className="page-intro glycemic-pilot__intro"><p className="eyebrow">{text.eyebrow}</p><h1>{text.title}</h1><p className="page-intro__description">{text.intro}</p></header>
      <div className="glycemic-pilot__summary" aria-label={text.summary}>
        <article><strong>{glycemicLoadPilotReviewedRecipeCount}</strong><span>{text.total}</span></article>
        <article data-gk-coverage="original"><strong>{gkVersionCoverage.originalNumeric}</strong><span>{gkScopeUi[locale].originalCoverage}</span></article>
        <article><strong>{gkVersionCoverage.total-gkVersionCoverage.originalNumeric}</strong><span>{gkScopeUi[locale].originalMissing}</span></article>
      </div>
      <details className="glycemic-pilot__method glycemic-pilot__disclosure" id="gk-only-method"><summary>{ux.background}</summary><h2>{gkOnlyUi[locale].title}</h2><p>{gkOnlyUi[locale].methodText}</p><ul data-gk-coverage="version-aware"><li><strong>{gkVersionCoverage.numericRecipes}</strong> / {gkVersionCoverage.total} — {gkOnlyUi[locale].coverage}</li><li>A: {gkVersionCoverage.originalNumeric+gkVersionCoverage.additionalA} — {gkOnlyUi[locale].aCount}</li><li>B: {gkVersionCoverage.additionalB} — {gkOnlyUi[locale].bCount}</li><li>C: {gkVersionCoverage.classOnly} — {gkOnlyUi[locale].cCount}</li><li><strong>{gkVersionCoverage.missing}</strong> — {gkScopeUi[locale].versionMissing}</li></ul><p>{ux.guidance}</p></details>
      <details className="glycemic-pilot__method glycemic-pilot__disclosure" aria-labelledby="glycemic-pilot-method"><summary>{ux.method}</summary>
        <h2 id="glycemic-pilot-method">{text.method}</h2><p><strong>{text.formula}</strong></p><p>{text.fineli}</p><p>{text.gi}</p><p>{text.interpretation}</p><p data-method="gk80-modelled">{modelledMethod[locale]}</p>
        <h3>{text.sources}</h3><ul className="glycemic-pilot__sources">{sources.map(([title, url]) => <li key={url}><a href={url} rel="noopener noreferrer">{title}</a></li>)}</ul>
      </details>
      <section className="glycemic-pilot__recipes" aria-labelledby="glycemic-pilot-recipes">
        <h2 id="glycemic-pilot-recipes">{ux.title}</h2>
        <p>{ux.description}</p>
        <p className="glycemic-pilot__caution">{ux.note}</p>
        <label className="glycemic-pilot__search-label" htmlFor="gk-recipe-search">{ux.search}</label>
        <input id="gk-recipe-search" type="search" autoComplete="off" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={ux.placeholder} />
        <label className="glycemic-pilot__filter"><input type="checkbox" checked={showCalculatedOnly} onChange={(event) => setShowCalculatedOnly(event.target.checked)} />{ux.only}</label>
        <p className="glycemic-pilot__match-count" role="status">{ux.matches}: {visibleResults.length}. {ux.shown}: {displayedResults.length}.</p>
        {visibleResults.length === 0 ? <p>{ux.empty}</p> : null}
        <ol>{displayedResults.map((result) => {
          const localized = result.localeRoutes[locale] ?? result.localeRoutes.fi;
          const confidence = result.confidence === "HIGH" ? text.high : result.confidence === "MEDIUM" ? text.medium : text.low;
          const variant=gkOnlyVariants.find(v=>v.recipeId===result.recipeId);
          if(variant)return <li key={result.recipeId} id={result.recipeId} className="glycemic-pilot__recipe"><h3><Link to={localized?.routePath??result.routePath}>{localized?.title??result.title}</Link></h3><GkOnlyVariantPanel variant={variant} locale={locale} compact /></li>;
          return <li key={result.recipeId} id={result.recipeId} className="glycemic-pilot__recipe">
            <h3><Link to={localized?.routePath ?? result.routePath}>{localized?.title ?? result.title}</Link></h3>
            {result.status === "CALCULATED" ? <><p><strong>{text.value}: {result.recipeId === "massaman-curry-kanalla-vhh" ? `${text.about} 5–6 ${text.perServing}` : formatValue(result)}</strong> · {text.confidence}: {confidence}</p>{result.omittedAvailableCarbohydratePerServingG > 0 ? <p>{omissionCopy[locale](number.format(result.omittedAvailableCarbohydratePerServingG))}</p> : null}
              {result.closedRecoveryC ? <p>{recoveryDisclosure[locale]}</p> : null}
              {result.boundedPolyolC ? <p>{scopedPolyolDisclosure[locale]}</p> : null}
              {result.recipeId === "massaman-curry-kanalla-vhh" ? <p>{text.massaman}</p> : null}
              <details><summary>{text.source}</summary>{result.carbohydrateSources.length ? <><p>{text.carbohydrateData}</p><ul>{result.carbohydrateSources.map((source) => <li key={`${source.url}-${source.title}`}><a href={source.url} rel="noopener noreferrer">{source.title}</a> — {source.note}</li>)}</ul></> : null}<ul>{result.sourceReferences.map((source) => <li key={`${source.url}-${source.title}`}><a href={source.url} rel="noopener noreferrer">{source.title}</a> — {source.note} ({source.confidence === "LOW" ? text.low : source.confidence === "MEDIUM" ? text.medium : text.high})</li>)}</ul></details>
            </> : <><p>{text.incomplete}</p>{result.incompleteReasons.length ? <details><summary>{incompleteCopy[locale].title}</summary><ul>{result.incompleteReasons.map((reason, index) => {
              const ingredient = reason.ingredientNames[locale] ?? reason.ingredientNames.fi;
              const explanation = reason.category === "GI" ? incompleteCopy[locale].gi : reason.category === "PORTION" ? incompleteCopy[locale].portion : reason.category === "VARIANT" ? incompleteCopy[locale].variant : reason.category === "AMOUNT" ? incompleteCopy[locale].amount : incompleteCopy[locale].source;
              return <li key={`${reason.ingredientIndex}-${reason.category}-${index}`}>{ingredient ? <><strong>{ingredient}: </strong>{explanation}</> : explanation}</li>;
            })}</ul></details> : null}</>}
          </li>;
        })}</ol>
        {visibleLimit < visibleResults.length ? <div className="glycemic-pilot__pagination"><button type="button" onClick={() => setVisibleLimit((limit) => limit + 24)}>{ux.more}</button><button type="button" onClick={() => setVisibleLimit(Number.POSITIVE_INFINITY)}>{ux.all}</button></div> : null}
        <aside id="maksalaatikko-kukkakaalilla" className="glycemic-pilot__exclusion"><h3>{text.liverTitle}</h3><p>{text.liver}</p></aside>
      </section>
    </div>
  </section>;
}

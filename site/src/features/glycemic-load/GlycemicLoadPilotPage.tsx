import { EstimateDetails, EstimateSummary, MissingEstimate } from "./GlycemicLoadEvidence";
import { gkCopy } from "./glycemic-load-copy";
import {gkOnlyVariants,gkVersionCoverage} from '@/generated/gk-only-variants.generated';
import {GkOnlyVariantPanel,gkOnlyUi,gkScopeUi} from '../recipes/GkOnlyVariantPanel';
import {scopedPolyolDisclosure} from '../recipes/scoped-polyol-disclosure';
import {recoveryDisclosure} from '../recipes/recovery-disclosure';
import {formatGlycemicLoadNumber} from '../recipes/gk80-format';
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { glycemicLoadPilotReviewedRecipeCount, glycemicLoadPilotResults } from "@/generated/glycemic-load-pilot.generated";
import { glycemicLoadMeta, recipeLocaleFromPath } from "@/features/recipes/recipe-i18n";
import type { RecipeLocale } from "@/types/content";

const copy = {
  fi: {
    about: "noin", perServing: "/ annos", total: "reseptiä tarkasteltu", method: "Miten GK lasketaan?", formula: "GK = Σ (ainesosan GI × imeytyvät hiilihydraatit annosta kohti) / 100.",
    fineli: "Fineli Rel20 on imeytyvien hiilihydraattien ensisijainen lähde. Kun sopivaa Fineli-tietuetta ei ollut, käytettiin rajattuihin ainesosiin AFCD Release 3 -aineistoa; lähde ja poikkeama näkyvät reseptikohtaisissa tiedoissa. Reseptien annokset ja ruoka-ainekohtaiset annosmitat muunnetaan grammoiksi, kun lähteestä löytyy sopiva mitta.", gi: "Julkiseen arvioon voidaan käyttää julkaistua suoraa GI-osumaa, perusteltua ruoka- tai valmistustapa-analogiaa tai yleistä ryhmäkeskiarvoa. Analogiat ja ryhmäkeskiarvot merkitään matalan luottamuksen arvioiksi; tutkimuksen laatu ei yksin takaa ruoka-ainevastaavuutta.",
    interpretation: "Vanhemmassa toleranssipolussa lähteistetyt positiiviset hiilihydraattimäärät lasketaan mukaan seuraavin poikkeuksin. Yksittäinen GI-osumaton alle 1 g:n imeytyvän hiilihydraatin osuus voidaan jättää pois vain, kun kaikkien tällaisten osuuksien yhteissumma jää alle 2 g/annos; pois jätetty määrä näytetään. Raja on käyttäjälähtöinen toimituksellinen toleranssi, ei mitattu kliininen tarkkuusraja. Todellinen vaste vaihtelee raaka-aineiden, valmistuksen, annoksen ja ihmisen mukaan. GK on ainesosista laskettu arvio, ei valmiin sekalaisen aterian mittaus.", sources: "Yleiset lähteet", value: "GK-arvio", incomplete: "Kokonaisarviota ei julkaista, koska olennaista ainesosatietoa tai GI-vastinetta puuttuu.",
    liverTitle: "Maksalaatikko kukkakaalilla", liver: "Naudanmaksan imeytyville hiilihydraateille ei ole perusteltua GI-arvoa. Aiempi arvio oletti GI:n olevan nolla ilman mittaustietoa.", massaman: "Massamanin noin 5–6 vaihteluväli syntyy currytahnan hiilihydraattimäärän kahdesta lähteistetystä skenaariosta: Finelin Tikka-tahnan vastineesta ja yhden tuotemerkin tuotetiedoista. Se kuvaa vain tätä ainesosatiedon vaihtelua, ei koko laskelman virhemarginaalia.",
  },
  en: { about: "about", perServing: "/ serving", total: "recipes reviewed", method: "How is GL calculated?", formula: "GL = Σ (ingredient GI × available carbohydrate per serving) / 100.", fineli: "Fineli Release 20 is the primary source for available carbohydrate. AFCD Release 3 supplements Fineli for a limited set of ingredients without a suitable Fineli record; each source and exception is identified in the recipe details. Recipe amounts are converted using food-specific measures when available.", gi: "Published direct GI values, justified food or preparation analogues, and broad category means may support an ingredient estimate. Analogues and category means are low confidence; study quality alone does not establish food equivalence.", interpretation: "In the older tolerance path, sourced positive carbohydrate amounts are included with these exceptions. An unmatched individual portion under 1 g available carbohydrate per serving may be omitted only when all such omissions total less than 2 g per serving; the omitted amount is disclosed. This is a user-centered editorial tolerance, not a measured clinical precision limit.", sources: "General sources", value: "GL estimate", incomplete: "No total estimate is published because material ingredient data or a GI analogue is missing.", liverTitle: "Beef liver casserole with cauliflower", liver: "There is no supported GI value for the available carbohydrate in beef liver. The earlier estimate assumed a GI of zero without measurement data.", massaman: "The Massaman range of about 5–6 comes from two sourced scenarios for curry-paste carbohydrate: a Fineli Tikka-paste analogue and one branded product label. It describes variation in this ingredient data only, not an uncertainty interval for the entire calculation.",
  },
  sv: { about: "cirka", perServing: "/ portion", total: "granskade recept", method: "Hur beräknas GL?", formula: "GL = Σ (ingrediensens GI × tillgängliga kolhydrater per portion) / 100.", fineli: "Fineli Rel20 är den primära källan för tillgängliga kolhydrater. AFCD Release 3 kompletterar Fineli för ett begränsat antal ingredienser där en lämplig Fineli-post saknades; källa och undantag anges vid respektive recept. Mängder omvandlas med livsmedelsspecifika mått när sådana finns.", gi: "Publicerade direkta GI-värden, motiverade livsmedels- eller tillagningsanaloger och breda kategorimedelvärden kan stödja en ingrediensuppskattning. Analogier och kategorimedelvärden har låg säkerhet; studiekvalitet visar inte i sig att livsmedlen motsvarar varandra.", interpretation: "I den äldre toleransmodellen räknas källbelagda positiva kolhydratmängder med med följande undantag. En enskild mängd under 1 g tillgängliga kolhydrater per portion utan GI-träff kan utelämnas endast om summan av alla sådana mängder understiger 2 g per portion; mängden redovisas. Detta är en användarcentrerad redaktionell tolerans, inte en uppmätt klinisk precisionsgräns.", sources: "Allmänna källor", value: "GL-uppskattning", incomplete: "Ingen total uppskattning publiceras eftersom viktig ingrediensinformation eller GI-analogi saknas.", liverTitle: "Levergryta med blomkål", liver: "Det saknas ett underbyggt GI-värde för kolhydraterna i nötlever. Den tidigare uppskattningen utgick från GI noll utan mätdata.", massaman: "Massamans intervall omkring 5–6 kommer från två källbelagda scenarier för currypastans kolhydrater: en Fineli-analogi för Tikka-pasta och en produktetikett. Intervallet beskriver bara variationen i denna ingrediensdata, inte osäkerheten i hela beräkningen.",
  },
  th: { about: "ประมาณ", perServing: "/ หนึ่งที่", total: "สูตรที่ตรวจสอบ", method: "คำนวณค่า GL อย่างไร", formula: "GL = Σ (ค่า GI ของวัตถุดิบ × คาร์โบไฮเดรตที่ร่างกายใช้ได้ต่อหนึ่งที่) / 100.", fineli: "Fineli Release 20 เป็นแหล่งข้อมูลหลักของคาร์โบไฮเดรตที่ร่างกายใช้ได้ AFCD Release 3 ใช้เสริมข้อมูล Fineli สำหรับวัตถุดิบบางรายการที่ไม่พบข้อมูล Fineli ที่เหมาะสม โดยระบุแหล่งข้อมูลและข้อยกเว้นไว้ในรายละเอียดของแต่ละสูตร ระบบแปลงปริมาณด้วยหน่วยเฉพาะของอาหารเมื่อมีข้อมูล", gi: "ค่า GI ที่ตีพิมพ์และตรงกับอาหาร ค่าเทียบเคียงด้านวัตถุดิบหรือวิธีปรุงที่มีเหตุผล และค่าเฉลี่ยของหมวดอาหารแบบกว้างอาจใช้สนับสนุนค่าประมาณได้ ค่าเทียบเคียงและค่าเฉลี่ยหมวดอาหารมีความเชื่อมั่นต่ำ คุณภาพงานวิจัยเพียงอย่างเดียวไม่ได้ยืนยันว่าอาหารตรงกัน", interpretation: "แนวทางเดิมที่ยอมให้ละเว้นปริมาณเล็กน้อยรวมคาร์โบไฮเดรตที่มีข้อมูลรองรับโดยมีข้อยกเว้นต่อไปนี้ ส่วนผสมแต่ละอย่างที่ไม่มีค่า GI และมีคาร์โบไฮเดรตที่ใช้ได้ต่ำกว่า 1 กรัมต่อหนึ่งที่อาจไม่นำมารวมได้ เมื่อปริมาณที่ไม่นำมารวมทั้งหมดต่ำกว่า 2 กรัมต่อหนึ่งที่ โดยจะแจ้งปริมาณที่ไม่รวม เกณฑ์นี้เป็นค่าความคลาดเคลื่อนเชิงบรรณาธิการที่คำนึงถึงผู้ใช้ ไม่ใช่ค่าความแม่นยำทางคลินิกที่วัดได้", sources: "แหล่งข้อมูลทั่วไป", value: "ค่าประมาณ GL", incomplete: "ไม่เผยแพร่ค่ารวมเนื่องจากข้อมูลวัตถุดิบสำคัญหรือค่า GI เทียบเคียงยังขาดหาย", liverTitle: "หม้อตับเนื้อกับกะหล่ำดอก", liver: "ยังไม่มีค่า GI ที่มีหลักฐานรองรับสำหรับคาร์โบไฮเดรตในตับวัว ค่าประมาณเดิมสมมติว่า GI เป็นศูนย์โดยไม่มีข้อมูลจากการวัด", massaman: "ช่วงประมาณ 5–6 ของแกงมัสมั่นมาจากสองสถานการณ์ที่มีแหล่งอ้างอิงสำหรับคาร์โบไฮเดรตในพริกแกง ได้แก่ ค่าของพริกแกง Tikka ใน Fineli และฉลากผลิตภัณฑ์หนึ่งยี่ห้อ ช่วงนี้แสดงเฉพาะความแตกต่างของข้อมูลวัตถุดิบนี้ ไม่ใช่ช่วงความคลาดเคลื่อนของการคำนวณทั้งหมด",
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

const sources = [
  ["International Tables 2021", "https://doi.org/10.1093/ajcn/nqab233"],
  ["THL / Fineli Rel20 open data (CC BY 4.0)", "https://fineli.fi/fineli/fi/avoin-data"],
  ["FSANZ Australian Food Composition Database Release 3 (CC BY-SA 3.0 Australia)", "https://www.foodstandards.gov.au/science-data/monitoringnutrients/afcd"],
  ["University of Sydney GI database", "https://glycemicindex.com/gi-search/"],
  ["Non-western foods compendium 2021", "https://doi.org/10.1038/s41387-020-00145-w"],
  ["ISO 26642:2010", "https://committee.iso.org/standard/43633.html"],
  ["Nutrients 2020 vegetable GI review", "https://doi.org/10.3390/nu12103041"],
];

const pageSize = 24;
const liverRecipeId = "maksalaatikko-kukkakaalilla";
const variantsByRecipe = new Map(gkOnlyVariants.map((variant) => [variant.recipeId, variant]));

const uxCopy = {
  fi: {
    intro: "Glykeeminen kuorma (GK) arvioi, kuinka paljon annoksen hiilihydraatit voivat nostaa verensokeria. Suurempi GK tarkoittaa suurempaa arvioitua vaikutusta.",
    title: "Löydä reseptin GK-arvio",
    search: "Hae reseptiä nimellä",
    only: "Vain reseptit, joilla on GK-arvio",
    empty: "Reseptejä ei löytynyt. Kokeile lyhyempää hakusanaa tai poista rajaus.",
    method: "Laskentatapa ja tutkimuslähteet",
    background: "Arvioiden kattavuus ja reseptiversiot",
    more: "Näytä lisää",
    all: "Näytä kaikki tulokset",
    linked: "Linkitetty resepti",
    original: "Alkuperäinen resepti",
    count: (shown: string, total: string) => `Näytetään ${shown} / ${total} tulosta`,
  },
  en: {
    intro: "Glycemic load (GL) estimates how much the carbohydrate in a serving may raise blood sugar. A higher GL means a larger estimated effect.",
    title: "Find a recipe’s GL estimate",
    search: "Search by recipe name",
    only: "Only recipes with a GL estimate",
    empty: "No recipes found. Try a shorter search term or turn off the filter.",
    method: "Calculation method and research sources",
    background: "Estimate coverage and recipe versions",
    more: "Show more",
    all: "Show all results",
    linked: "Linked recipe",
    original: "Original recipe",
    count: (shown: string, total: string) => `Showing ${shown} of ${total} results`,
  },
  sv: {
    intro: "Glykemisk belastning (GL) uppskattar hur mycket kolhydraterna i en portion kan höja blodsockret. Högre GL betyder en större uppskattad påverkan.",
    title: "Hitta receptets GL-värde",
    search: "Sök på receptnamn",
    only: "Visa bara recept med ett GL-värde",
    empty: "Inga recept hittades. Prova ett kortare sökord eller stäng av filtret.",
    method: "Beräkningsmetod och forskningskällor",
    background: "Uppskattningarnas täckning och receptversioner",
    more: "Visa fler",
    all: "Visa alla resultat",
    linked: "Länkat recept",
    original: "Originalrecept",
    count: (shown: string, total: string) => `Visar ${shown} av ${total} resultat`,
  },
  th: {
    intro: "ภาระน้ำตาลในเลือด (GL) เป็นค่าประมาณว่าคาร์โบไฮเดรตในอาหารหนึ่งที่อาจทำให้น้ำตาลในเลือดสูงขึ้นเพียงใด ยิ่งค่า GL สูง ผลที่คาดก็ยิ่งมากขึ้น",
    title: "ค้นหาค่า GL ของสูตรอาหาร",
    search: "ค้นหาตามชื่อสูตร",
    only: "แสดงเฉพาะสูตรที่มีค่าประมาณ GL",
    empty: "ไม่พบสูตรอาหาร ลองใช้คำค้นที่สั้นลงหรือปิดตัวกรอง",
    method: "วิธีคำนวณและแหล่งอ้างอิงงานวิจัย",
    background: "ความครอบคลุมของค่าประมาณและสูตรแต่ละแบบ",
    more: "แสดงเพิ่ม",
    all: "แสดงผลทั้งหมด",
    linked: "สูตรอาหารจากลิงก์",
    original: "สูตรต้นฉบับ",
    count: (shown: string, total: string) => `แสดง ${shown} จาก ${total} รายการ`,
  },
};

function decodeHash(hash: string) {
  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    return "";
  }
}

export function GlycemicLoadPilotPage() {
  const { pathname, hash } = useLocation();
  const locale = recipeLocaleFromPath(pathname);
  const [enhanced, setEnhanced] = useState(false);
  const [search, setSearch] = useState("");
  const [showCalculatedOnly, setShowCalculatedOnly] = useState(false);
  const [visibleLimit, setVisibleLimit] = useState(pageSize);
  const nextResultId = useRef<string>(null);
  const targetId = enhanced ? decodeHash(hash) : "";

  // The first client render matches the full prerendered list.
  useEffect(() => {
    setEnhanced(true);
    setSearch("");
    setShowCalculatedOnly(false);
    setVisibleLimit(pageSize);
  }, [locale]);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const disclosure = target.closest("details");
    if (disclosure) {
      disclosure.open = true;
      disclosure.querySelector("summary")?.focus({ preventScroll: true });
    }
    if (target.matches(".glycemic-pilot__recipe")) target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: "instant" });
  }, [locale, targetId]);

  useEffect(() => {
    if (!nextResultId.current) return;
    document.getElementById(nextResultId.current)?.focus();
    nextResultId.current = null;
  }, [visibleLimit]);

  const text = copy[locale];
  const ux = uxCopy[locale];
  const numberLocale = { fi: "fi-FI", en: "en-GB", sv: "sv-SE", th: "th-TH" }[locale];
  const number = new Intl.NumberFormat(numberLocale, { maximumSignificantDigits: 1, minimumSignificantDigits: 1 });
  const count = new Intl.NumberFormat(numberLocale);
  const modelled = { fi: "Mallinnettu", en: "Modeled", sv: "Modellerad", th: "ค่าประมาณจากแบบจำลอง" }[locale];
  const displayNumber = (value: number, modeled: boolean) => formatGlycemicLoadNumber(value, numberLocale, modeled);
  const titleFor = (result: typeof glycemicLoadPilotResults[number]) =>
    result.localeRoutes[locale]?.title
    ?? (result.recipeId === liverRecipeId ? text.liverTitle : result.title);
  const searchKey = (value: string) => value.normalize("NFC").toLocaleLowerCase(numberLocale);
  const query = searchKey(search.trim());
  const matching = glycemicLoadPilotResults.filter((result) =>
    (!showCalculatedOnly || result.status === "CALCULATED" || variantsByRecipe.has(result.recipeId))
    && searchKey(titleFor(result)).includes(query)
  );
  if (enhanced) {
    const collator = new Intl.Collator(numberLocale);
    matching.sort((a, b) =>
      Number(searchKey(titleFor(b)).startsWith(query)) - Number(searchKey(titleFor(a)).startsWith(query))
      || Number(Boolean(b.localeRoutes[locale])) - Number(Boolean(a.localeRoutes[locale]))
      || collator.compare(titleFor(a), titleFor(b))
    );
  }

  // The linked recipe has a dedicated position regardless of filters and pagination.
  const linked = glycemicLoadPilotResults.find((result) => result.recipeId === targetId);
  const otherMatches = matching.filter((result) => result !== linked);
  const displayed = enhanced ? otherMatches.slice(0, visibleLimit) : otherMatches;
  const linkedMatches = matching.length - otherMatches.length;

  function showResults(limit: number) {
    nextResultId.current = otherMatches[displayed.length]?.recipeId ?? null;
    setVisibleLimit(limit);
  }

  const formatValue = (result: typeof glycemicLoadPilotResults[number]) => result.glycemicLoadRangePerServing
    ? `${result.assessmentType ? modelled + " " : ""}${text.about} ${displayNumber(result.glycemicLoadRangePerServing.min,!!result.assessmentType)}–${displayNumber(result.glycemicLoadRangePerServing.max,!!result.assessmentType)} ${text.perServing}`
    : result.glycemicLoadPerServing === null ? text.incomplete : `${result.assessmentType ? modelled + " " : ""}${text.about} ${displayNumber(result.glycemicLoadPerServing,!!result.assessmentType)} ${text.perServing}`;
  function renderRecipe(result: typeof glycemicLoadPilotResults[number]) {
    const localized = result.localeRoutes[locale] ?? result.localeRoutes.fi;
    const isLiverRecipe = result.recipeId === liverRecipeId;
    const variant = variantsByRecipe.get(result.recipeId);
    return <li key={result.recipeId} id={result.recipeId} className="glycemic-pilot__recipe" tabIndex={-1}>
      {result === linked ? <p className="eyebrow">{ux.linked}</p> : null}
      <h3><Link to={localized?.routePath ?? result.routePath} lang={isLiverRecipe ? locale : localized ? recipeLocaleFromPath(localized.routePath) : "fi"}>{titleFor(result)}</Link></h3>
      <p className="gk-evidence__scope">{ux.original}</p>
      {result.status === "CALCULATED" ? <>
        <p className="gk-evidence__value"><strong>{text.value} · {formatValue(result)}</strong></p>
        <EstimateSummary result={result} locale={locale} />
        <EstimateDetails result={result} locale={locale}
          notes={<>
            {result.omittedAvailableCarbohydratePerServingG > 0 ? <p>{omissionCopy[locale](number.format(result.omittedAvailableCarbohydratePerServingG))}</p> : null}
            {result.recipeId === "massaman-curry-kanalla-vhh" ? <p>{text.massaman}</p> : null}
          </>}
          technicalNotes={result.closedRecoveryC ? <p>{recoveryDisclosure[locale]}</p> :
            result.boundedPolyolC ? <p>{scopedPolyolDisclosure[locale]}</p> : undefined}
        />
      </> : <MissingEstimate result={result} locale={locale} explanation={isLiverRecipe ? text.liver : undefined} />}
      {variant ? <GkOnlyVariantPanel variant={variant} locale={locale} compact /> : null}
    </li>;
  }

  return <section className="page-section glycemic-pilot" lang={locale}>
    <div className="container container--narrow">
      <header className="page-intro glycemic-pilot__intro">
        <h1>{glycemicLoadMeta[locale].h1}</h1>
        <p className="page-intro__description">{ux.intro}</p>
      </header>
      <section className="glycemic-pilot__recipes" aria-labelledby="glycemic-pilot-recipes">
        <h2 id="glycemic-pilot-recipes">{ux.title}</h2>
        {enhanced ? <>
          <label className="glycemic-pilot__search-label" htmlFor="gk-recipe-search">{ux.search}</label>
          <input id="gk-recipe-search" type="search" autoComplete="off" value={search} onChange={(event) => {
            setSearch(event.target.value);
            setVisibleLimit(pageSize);
          }} />
          <label className="glycemic-pilot__filter">
            <input type="checkbox" checked={showCalculatedOnly} onChange={(event) => {
              setShowCalculatedOnly(event.target.checked);
              setVisibleLimit(pageSize);
            }} />
            {ux.only}
          </label>
        </> : null}
        <p className="glycemic-pilot__confidence">{gkCopy[locale].personal}</p>
        <Link className="glycemic-pilot__method-link" to="#glycemic-pilot-method">{ux.method}</Link>
        {enhanced ? <p className="glycemic-pilot__match-count" role="status">
          {matching.length ? ux.count(count.format(displayed.length + linkedMatches), count.format(matching.length)) : ux.empty}
        </p> : null}
        {linked ? <ul className="glycemic-pilot__results">{renderRecipe(linked)}</ul> : null}
        {displayed.length ? <ul className="glycemic-pilot__results">{displayed.map(renderRecipe)}</ul> : null}
        {displayed.length < otherMatches.length ? <div className="glycemic-pilot__pagination">
          <button type="button" onClick={() => showResults(visibleLimit + pageSize)}>{ux.more}</button>
          <button type="button" onClick={() => showResults(Infinity)}>{ux.all}</button>
        </div> : null}
      </section>
      <details className="glycemic-pilot__method glycemic-pilot__disclosure" id="gk-only-method"><summary>{ux.background}</summary><p>{glycemicLoadPilotReviewedRecipeCount} {text.total}</p><p>{gkOnlyUi[locale].methodText}</p><ul data-gk-coverage="version-aware"><li><strong>{gkVersionCoverage.numericRecipes}</strong> / {gkVersionCoverage.total} — {gkOnlyUi[locale].coverage}</li><li>A: {gkVersionCoverage.originalNumeric+gkVersionCoverage.additionalA} — {gkOnlyUi[locale].aCount}</li><li>B: {gkVersionCoverage.additionalB} — {gkOnlyUi[locale].bCount}</li><li>C: {gkVersionCoverage.classOnly} — {gkOnlyUi[locale].cCount}</li><li data-gk-coverage="original"><strong>{gkVersionCoverage.originalNumeric}</strong> — {gkScopeUi[locale].originalCoverage}</li><li><strong>{gkVersionCoverage.total - gkVersionCoverage.originalNumeric}</strong> — {gkScopeUi[locale].originalMissing}</li><li><strong>{gkVersionCoverage.missing}</strong> — {gkScopeUi[locale].versionMissing}</li></ul></details>
      <details className="glycemic-pilot__method glycemic-pilot__disclosure" aria-labelledby="glycemic-pilot-method"><summary>{ux.method}</summary>
        <h2 id="glycemic-pilot-method">{text.method}</h2><p><strong>{text.formula}</strong></p><p>{text.fineli}</p><p>{text.gi}</p><p>{text.interpretation}</p><p data-method="gk80-modelled">{modelledMethod[locale]}</p>
        <h3>{text.sources}</h3><ul className="glycemic-pilot__sources">{sources.map(([title, url]) => <li key={url}><a href={url} rel="noopener noreferrer">{title}</a></li>)}</ul>
      </details>
    </div>
  </section>;
}

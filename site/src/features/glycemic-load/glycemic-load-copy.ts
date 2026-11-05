import type { RecipeLocale } from "@/types/content";

export const gkCopy = {
  fi: {
    variantLimit: "Arvio pätee vain kuvattuihin raaka-aineisiin, määriin ja valmistustapaan.",
    reliability: "Luotettavuus",
    levels: {
      HIGH: "Korkea",
      MEDIUM: "Kohtalainen",
      LOW: "Matala"
    },
    levelNotes: {
      HIGH: "Lähteet tukevat laskelmassa käytettyjä arvoja hyvin.",
      MEDIUM: "Lähteet tukevat arviota, mutta osa arvoista on epävarmempia.",
      LOW: "Osa laskelmassa käytetyistä arvoista tai oletuksista on epävarmoja."
    },
    personal: "Annoksen GK on laskettu raaka-aineiden tiedoista. Luotettavuus kertoo laskelman lähteistä. Oma verensokerivaste voi vaihdella.",
    basis: {
      published: "Arvio perustuu raaka-aineiden hiilihydraatteihin ja lähteissä ilmoitettuihin GI-arvoihin.",
      comparison: "Laskelmassa käytettiin myös samankaltaisten ruokien tai ruokaryhmien vertailuarvoja.",
      model: "Arviossa käytettiin laskennallisia oletuksia ainesosien hiilihydraattien ja GI-tietojen lisäksi.",
      unknown: "Arvio perustuu reseptin raaka-aineisiin ja niiden määriin. Tarkempi laskentaperusta löytyy lisätiedoista."
    },
    kinds: {
      direct: "Raaka-aineen mitattu GI-arvo",
      categoryMean: "Ruokaryhmän keskiarvo",
      comparison: "Vertailuarvo",
      model: "Mallinnuksessa käytetty arvo",
      published: "Lähteessä ilmoitettu GI-arvo",
      policy: "Laskentasääntö",
      unknown: "Muu lähtötieto"
    },
    how: "Miten arvio laskettiin?",
    sources: "Tutkimuslähteet ja tekniset tiedot",
    technicalNote: "Lähdenimet ja tekniset huomautukset näytetään alkuperäisessä muodossaan.",
    carbs: "Hiilihydraattitietojen lähteet",
    gi: "GI-arvojen ja laskennan lähteet",
    see: "Arvion perusteet ja lähteet",
    modified: "Arvio koskee muokattua reseptiversiota",
    modifiedA: "Arvio perustuu tämän version raaka-aineisiin ja määriin sekä käytettävissä oleviin lähdetietoihin.",
    modifiedB: "Tämän version arviossa käytettiin myös laskennallisia oletuksia.",
    missing: "GK-arviota ei voida laskea luotettavasti.",
    missingBasis: "Yhden tai useamman raaka-aineen tietoja puuttuu tai laskennan perusteissa on epävarmuutta. Koko annoksen arviota ei voi julkaista luotettavasti.",
    why: "Miksi arvio puuttuu?",
    blockers: {
      GI: "Raaka-aineelle ei löytynyt sopivaa GI-arvoa.",
      SOURCE: "Raaka-aineesta tai tuotteesta ei löytynyt sopivaa ravintokoostumustietoa.",
      PORTION: "Raaka-aineen määrää ei voitu muuntaa luotettavasti grammoiksi.",
      VARIANT: "Reseptissä voi valita eri raaka-aineita, ja valinta vaikuttaa hiilihydraattien määrään.",
      AMOUNT: "Raaka-aineen määrä puuttuu tai sitä ei voitu vahvistaa.",
      CONFLICT: "Laskennassa käytettävät lähteet ovat ristiriidassa.",
      UNKNOWN: "Laskentaan tarvittavia tietoja ei voitu vahvistaa."
    },
    omitted: "Pieniä hiilihydraattiosuuksia jätettiin pois laskelmasta.",
    range: "Vaihteluväli kuvaa laskennassa käytettyjä vaihtoehtoja."
  },
  en: {
    variantLimit: "The estimate applies to the ingredients, amounts and preparation described below.",
    reliability: "Confidence",
    levels: {
      HIGH: "High",
      MEDIUM: "Moderate",
      LOW: "Low"
    },
    levelNotes: {
      HIGH: "The sources give strong support for the values used in the calculation.",
      MEDIUM: "The sources support the estimate, though some values are less certain.",
      LOW: "Some values or assumptions in the calculation are uncertain."
    },
    personal: "The serving’s GL is calculated from ingredient data. Confidence describes the evidence behind the calculation. Your blood sugar response may vary.",
    basis: {
      published: "The estimate uses the ingredients’ carbohydrate amounts and GI values reported in sources.",
      comparison: "The calculation also uses comparison values from similar foods or food groups.",
      model: "The estimate combines ingredient carbohydrate and GI data with modeled assumptions.",
      unknown: "The estimate uses the recipe’s ingredients and amounts. See the details for the calculation basis."
    },
    kinds: {
      direct: "Measured GI for the ingredient",
      categoryMean: "Food group average",
      comparison: "Comparison value",
      model: "Value used in the model",
      published: "GI value reported in a source",
      policy: "Calculation rule",
      unknown: "Other input"
    },
    how: "How was the estimate calculated?",
    sources: "Research sources and technical details",
    technicalNote: "Source names and technical notes appear in their original form.",
    carbs: "Carbohydrate data sources",
    gi: "GI and calculation sources",
    see: "Estimate details and sources",
    modified: "Estimate for the modified recipe",
    modifiedA: "The estimate uses the ingredients and amounts in this version and the available source data.",
    modifiedB: "The estimate for this version also uses modeled assumptions.",
    missing: "A reliable glycemic load estimate is not available.",
    missingBasis: "Some ingredient data or calculation inputs could not be verified, so there is no reliable estimate for the whole serving.",
    why: "Why is the estimate missing?",
    blockers: {
      GI: "A suitable GI value was unavailable for this ingredient.",
      SOURCE: "Suitable nutrition data was unavailable for this ingredient or product.",
      PORTION: "The amount could not be reliably converted to grams.",
      VARIANT: "The recipe leaves an ingredient choice open, and the choice affects the amount of carbohydrate.",
      AMOUNT: "The amount is missing or could not be verified.",
      CONFLICT: "The sources used for the calculation disagree.",
      UNKNOWN: "Some inputs needed for the calculation could not be verified."
    },
    omitted: "Small amounts of carbohydrate were left out of the calculation.",
    range: "The range shows the alternatives used in the calculation."
  },
  sv: {
    variantLimit: "Uppskattningen gäller ingredienserna, mängderna och tillagningen som beskrivs nedan.",
    reliability: "Tillförlitlighet",
    levels: {
      HIGH: "Hög",
      MEDIUM: "Måttlig",
      LOW: "Låg"
    },
    levelNotes: {
      HIGH: "Källorna ger gott stöd för värdena i beräkningen.",
      MEDIUM: "Källorna stöder uppskattningen, men vissa värden är mer osäkra.",
      LOW: "Vissa värden eller antaganden i beräkningen är osäkra."
    },
    personal: "Portionens GL beräknas utifrån uppgifter om ingredienserna. Tillförlitligheten gäller underlaget för beräkningen. Ditt blodsocker kan reagera annorlunda.",
    basis: {
      published: "Uppskattningen bygger på mängden kolhydrater i ingredienserna och GI-värden från källorna.",
      comparison: "I beräkningen ingår också jämförelsevärden från liknande livsmedel eller livsmedelsgrupper.",
      model: "Uppskattningen bygger på kolhydrat- och GI-uppgifter samt antaganden i en modell.",
      unknown: "Uppskattningen bygger på receptets ingredienser och mängder. Mer om underlaget finns i detaljerna."
    },
    kinds: {
      direct: "Uppmätt GI för ingrediensen",
      categoryMean: "Genomsnitt för livsmedelsgruppen",
      comparison: "Jämförelsevärde",
      model: "Värde som används i modellen",
      published: "GI-värde från en källa",
      policy: "Beräkningsregel",
      unknown: "Övrigt underlag"
    },
    how: "Hur beräknades uppskattningen?",
    sources: "Forskningskällor och tekniska uppgifter",
    technicalNote: "Källnamn och tekniska kommentarer visas i sin ursprungliga form.",
    carbs: "Källor för kolhydratvärden",
    gi: "Källor för GI och beräkningen",
    see: "Underlag och källor",
    modified: "Uppskattning för den ändrade versionen",
    modifiedA: "Uppskattningen bygger på ingredienserna och mängderna i den här versionen samt tillgängliga källor.",
    modifiedB: "Uppskattningen för den här versionen bygger också på antaganden i en modell.",
    missing: "En tillförlitlig uppskattning av glykemisk belastning är inte tillgänglig.",
    missingBasis: "Vissa ingrediensuppgifter eller delar av beräkningsunderlaget kunde inte verifieras, så en tillförlitlig uppskattning för hela portionen saknas.",
    why: "Varför saknas en uppskattning?",
    blockers: {
      GI: "Ett lämpligt GI-värde saknas för ingrediensen.",
      SOURCE: "Lämpliga näringsuppgifter saknas för ingrediensen eller produkten.",
      PORTION: "Mängden kunde inte omvandlas till gram på ett tillförlitligt sätt.",
      VARIANT: "Receptet lämnar ett ingrediensval öppet, och valet påverkar mängden kolhydrater.",
      AMOUNT: "Mängden saknas eller kunde inte verifieras.",
      CONFLICT: "Källorna för beräkningen ger motstridiga uppgifter.",
      UNKNOWN: "Vissa uppgifter som behövs för beräkningen kunde inte verifieras."
    },
    omitted: "Små mängder kolhydrater utelämnades ur beräkningen.",
    range: "Intervallet visar de alternativ som användes i beräkningen."
  },
  th: {
    variantLimit: "ค่าประมาณใช้ได้เฉพาะวัตถุดิบ ปริมาณ และวิธีปรุงที่ระบุในรายละเอียด",
    reliability: "ความเชื่อมั่น",
    levels: {
      HIGH: "สูง",
      MEDIUM: "ปานกลาง",
      LOW: "ต่ำ"
    },
    levelNotes: {
      HIGH: "แหล่งข้อมูลสนับสนุนค่าที่ใช้คำนวณได้ดี",
      MEDIUM: "แหล่งข้อมูลสนับสนุนค่าประมาณ แต่บางค่ายังมีความไม่แน่นอน",
      LOW: "ค่าหรือสมมติฐานบางส่วนในการคำนวณยังมีความไม่แน่นอน"
    },
    personal: "ค่า GL ต่อหนึ่งที่คำนวณจากข้อมูลวัตถุดิบ ระดับความเชื่อมั่นบอกคุณภาพของข้อมูลที่ใช้คำนวณ ระดับน้ำตาลในเลือดของแต่ละคนอาจตอบสนองต่างกัน",
    basis: {
      published: "ค่าประมาณนี้ใช้ปริมาณคาร์โบไฮเดรตในวัตถุดิบและค่า GI จากแหล่งข้อมูล",
      comparison: "การคำนวณใช้ค่าเทียบเคียงจากอาหารที่คล้ายกันหรือจากกลุ่มอาหารด้วย",
      model: "ค่าประมาณนี้ใช้ข้อมูลคาร์โบไฮเดรตและค่า GI ร่วมกับสมมติฐานของแบบจำลอง",
      unknown: "ค่าประมาณนี้อิงจากวัตถุดิบและปริมาณตามสูตร ดูที่มาของการคำนวณได้ในรายละเอียด"
    },
    kinds: {
      direct: "ค่า GI ที่วัดจากวัตถุดิบ",
      categoryMean: "ค่าเฉลี่ยของกลุ่มอาหาร",
      comparison: "ค่าเทียบเคียง",
      model: "ค่าที่ใช้ในแบบจำลอง",
      published: "ค่า GI ที่แหล่งข้อมูลรายงาน",
      policy: "กฎการคำนวณ",
      unknown: "ข้อมูลอื่นที่ใช้คำนวณ"
    },
    how: "คำนวณค่าประมาณอย่างไร",
    sources: "แหล่งงานวิจัยและรายละเอียดทางเทคนิค",
    technicalNote: "ชื่อแหล่งข้อมูลและหมายเหตุทางเทคนิคแสดงตามต้นฉบับ",
    carbs: "แหล่งข้อมูลคาร์โบไฮเดรต",
    gi: "แหล่งข้อมูลค่า GI และการคำนวณ",
    see: "ที่มาของค่าประมาณและแหล่งข้อมูล",
    modified: "ค่าประมาณสำหรับสูตรที่ปรับแล้ว",
    modifiedA: "ค่าประมาณนี้อิงจากวัตถุดิบ ปริมาณในสูตรที่ปรับแล้ว และแหล่งข้อมูลที่มี",
    modifiedB: "ค่าประมาณของสูตรที่ปรับแล้วใช้สมมติฐานของแบบจำลองด้วย",
    missing: "ยังไม่สามารถประมาณค่าภาระน้ำตาลได้อย่างน่าเชื่อถือ",
    missingBasis: "ข้อมูลวัตถุดิบหรือข้อมูลที่ใช้คำนวณบางส่วนยังยืนยันไม่ได้ จึงยังไม่มีค่าประมาณที่เชื่อถือได้สำหรับอาหารหนึ่งที่",
    why: "ทำไมจึงยังไม่มีค่าประมาณ",
    blockers: {
      GI: "ไม่พบค่า GI ที่เหมาะสมสำหรับวัตถุดิบนี้",
      SOURCE: "ไม่พบข้อมูลโภชนาการที่เหมาะสมสำหรับวัตถุดิบหรือผลิตภัณฑ์นี้",
      PORTION: "ไม่สามารถแปลงปริมาณเป็นกรัมได้อย่างน่าเชื่อถือ",
      VARIANT: "สูตรมีตัวเลือกวัตถุดิบ และแต่ละตัวเลือกให้คาร์โบไฮเดรตต่างกัน",
      AMOUNT: "สูตรขาดข้อมูลปริมาณวัตถุดิบหรือยังยืนยันปริมาณไม่ได้",
      CONFLICT: "ข้อมูลจากแหล่งที่ใช้คำนวณขัดแย้งกัน",
      UNKNOWN: "ข้อมูลบางส่วนที่จำเป็นต่อการคำนวณยังยืนยันไม่ได้"
    },
    omitted: "การคำนวณละคาร์โบไฮเดรตบางส่วนที่มีปริมาณน้อย",
    range: "ช่วงนี้แสดงค่าจากทางเลือกที่ใช้คำนวณ"
  }
} satisfies Record<RecipeLocale, object>;

type Evidence = {
  matchKind?: string;
  evidenceKind?: string;
  applicationKind?: string;
};

export function evidenceLabel(source: Evidence) {
  if (source.matchKind !== "EXACT" && source.matchKind !== "ANALOG" && source.matchKind !== "CATEGORY_MEAN" && source.matchKind !== "CALCULATION_POLICY") return "unknown";
  if (source.evidenceKind !== undefined && source.evidenceKind !== "HUMAN_GI" && source.evidenceKind !== "PUBLISHED_IMPUTATION") return "unknown";
  if (source.applicationKind !== undefined && source.applicationKind !== "DIRECT" && source.applicationKind !== "FOOD_ANALOGUE" && source.applicationKind !== "PUBLISHED_IMPUTATION") return "unknown";
  if (source.applicationKind === "PUBLISHED_IMPUTATION" || source.evidenceKind === "PUBLISHED_IMPUTATION") return "model";
  if (source.matchKind === "CALCULATION_POLICY") return "policy";
  if (source.matchKind === "CATEGORY_MEAN") return "categoryMean";
  if (source.applicationKind === "FOOD_ANALOGUE" || source.matchKind === "ANALOG") return "comparison";
  if (source.evidenceKind === "HUMAN_GI" && source.applicationKind === "DIRECT") return "direct";
  if (source.applicationKind === undefined) return "published";
  return "unknown";
}

export function estimateBasis(result: { assessmentType?: string; sourceReferences: Evidence[] }) {
  if (result.assessmentType === "PUBLISHED_IMPUTATION") return "model";
  if (result.assessmentType !== undefined) return "unknown";
  const kinds = result.sourceReferences.map(evidenceLabel);
  if (kinds.includes("unknown")) return "unknown";
  if (kinds.includes("model")) return "model";
  if (kinds.includes("comparison") || kinds.includes("categoryMean")) return "comparison";
  if (kinds.includes("direct") || kinds.includes("published")) return "published";
  return "unknown";
}

export function missingReason(locale: RecipeLocale, category: string) {
  const { blockers } = gkCopy[locale];
  return Object.hasOwn(blockers, category) ? blockers[category as keyof typeof blockers] : blockers.UNKNOWN;
}

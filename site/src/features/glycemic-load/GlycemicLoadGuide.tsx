import { Link } from "react-router-dom";
import type { RecipeLocale } from "@/types/content";

const guide = {
  fi: {
    title: "Näin käytät arviota",
    steps: [
      "Tarkista, minkä kokoista annosta arvio koskee.",
      "Katso, paljonko annoksessa on hiilihydraattia.",
      "Lue GK-luku, vaihteluväli tai sanallinen arvio.",
      "Huomioi myös lisukkeet, juomat ja käytetty tuote.",
      "Sovita tieto omaan ruokailuusi ja mahdollisiin hoito-ohjeisiisi.",
    ],
    portionTitle: "Valmistettava erä ja oma annos",
    portion: "Jos suurennat reseptin neljästä kahdeksaan annokseen ja tuplaat kaikki ainekset, yhden annoksen luvut pysyvät samoina. Jos syöt puolitoista annosta, saat puolitoista kertaa yhden annoksen hiilihydraatit. Myös laskettu GK muuttuu samassa suhteessa, mutta oma verensokerivasteesi voi poiketa laskelmasta.",
    portionExample: "Laskuesimerkki: jos yhdessä annoksessa on 16 g hiilihydraattia ja GK on 8, puolessatoista annoksessa on 24 g ja GK on 12.",
    diabetesTitle: "Jos sinulla on diabetes",
    diabetes: "Katso ensin syötävä annos ja sen hiilihydraattimäärä. GK auttaa vertaamaan vaihtoehtoja. Noudata omaa hoitosuunnitelmaasi. Reseptin GK-arvosta ei voi päätellä omaa verensokerivastetta tai insuliiniannosta.",
    formatsTitle: "Miksi arvioita esitetään eri tavoin?",
    formats: "Tuote, annoskoko ja valmistustapa vaikuttavat arvioon. Hiilihydraattikattavuus kertoo, kuinka suurelle osalle annoksen imeytyvistä hiilihydraateista on sopiva GI-tieto. Jos GI puuttuu pieneltä osuudelta, arvio voi silti olla mahdollinen, kun sen vaikutus voidaan rajata lähteiden avulla. Suuri kattavuus yksin ei riitä. Jos vaikutusta ei voi rajata, uutta GK-lukua tai vaihteluväliä ei anneta.",
    examples: "Seuraavat esimerkit havainnollistavat esitystapoja. Ne eivät ole reseptien mittaustuloksia.",
    formatsList: [
      ["Likiarvo", "Arvioitu GK on noin 8 annosta kohti."],
      ["Vaihteluväli", "Arvioitu GK on noin 8–13 annosta kohti leipävalinnasta riippuen."],
      ["Sanallinen arvio", "Tämän kokoisen annoksen arvioitu GK on pieni. Tarkkaa lukua ei voi perustella."],
      ["Rajattu arvio", "Arvio koskee annosta ilman lisukeriisiä."],
      ["Hiilihydraattitieto", "Annoksessa on noin 24 g hiilihydraattia, enimmäkseen riisistä. GK-arviota ei ole."],
      ["Puuttuva tieto", "Annoksen hiilihydraatteja tai GK:ta ei voi arvioida, koska nuudelien määrä puuttuu."],
    ],
    find: "Siirry reseptihakuun",
    more: "Tutustu laskentatapaan ja lähteisiin",
    reading: "Lisätietoa annoksista ja hiilihydraateista",
  },
  en: {
    title: "How to use the estimate",
    steps: [
      "Check the serving size the estimate applies to.",
      "Look at the amount of carbohydrate in that serving.",
      "Read the GL number, range or description.",
      "Take side dishes, drinks and the product you use into account.",
      "Use the information to plan your meal and follow any personal care advice you have received.",
    ],
    portionTitle: "How much you cook and how much you eat",
    portion: "If you double all the ingredients to make eight servings instead of four, the amounts per serving stay the same. Eating one and a half servings gives you one and a half times the carbohydrate. The calculated GL scales the same way, but your own blood sugar response may differ from the calculation.",
    portionExample: "Example calculation: if one serving has 16 g of carbohydrate and a GL of 8, one and a half servings have 24 g and a GL of 12.",
    diabetesTitle: "If you have diabetes",
    diabetes: "Start with the serving you will eat and its carbohydrate amount. GL helps you compare options. Follow your own care plan. A recipe’s GL cannot tell you your blood sugar response or insulin dose.",
    formatsTitle: "Why do estimates look different?",
    formats: "The product, serving size and preparation affect the estimate. Carbohydrate coverage is the share of a serving’s available carbohydrate with suitable GI evidence. If GI is missing for a small share, an estimate may still be possible when sources support limits for its effect. High coverage alone is insufficient. If the effect cannot be bounded, no new GL number or range is given.",
    examples: "These examples show how information can be presented. They are not measurements of recipes.",
    formatsList: [
      ["Approximate number", "Estimated GL is about 8 per serving."],
      ["Range", "Estimated GL is about 8–13 per serving, depending on the bread."],
      ["Estimate in words", "The estimated GL is low for a serving of this size. The evidence does not support a specific number."],
      ["What is included", "The estimate applies to the serving without the rice side dish."],
      ["Carbohydrate information", "A serving has about 24 g of carbohydrate, mostly from rice. No GL estimate is available."],
      ["Missing information", "We cannot estimate the serving’s carbohydrate or GL because the amount of noodles is missing."],
    ],
    find: "Go to recipe search",
    more: "Read about the method and sources",
    reading: "More about servings and carbohydrates",
  },
  sv: {
    title: "Så använder du uppskattningen",
    steps: [
      "Kontrollera hur stor portion uppskattningen gäller.",
      "Titta på hur mycket kolhydrater portionen innehåller.",
      "Läs GL-värdet, intervallet eller den beskrivande uppskattningen.",
      "Ta hänsyn till tillbehör, drycker och vilken produkt du använder.",
      "Använd informationen när du planerar måltiden och följ dina individuella vårdråd.",
    ],
    portionTitle: "Hur mycket du lagar och hur mycket du äter",
    portion: "Om du dubblar alla ingredienser för att laga åtta portioner i stället för fyra, är värdena per portion desamma. Äter du en och en halv portion får du i dig en och en halv gånger så mycket kolhydrater. Beräknat GL ökar i samma proportion, men ditt eget blodsockersvar kan skilja sig från beräkningen.",
    portionExample: "Räkneexempel: om en portion innehåller 16 g kolhydrater och har GL 8, innehåller en och en halv portion 24 g och har GL 12.",
    diabetesTitle: "Om du har diabetes",
    diabetes: "Utgå från portionen du faktiskt äter och hur mycket kolhydrater den innehåller. GL hjälper dig att jämföra alternativ. Följ din egen vårdplan. Ett recepts GL räcker inte för att avgöra ditt blodsockersvar eller vilken insulindos du behöver.",
    formatsTitle: "Varför visas uppskattningar på olika sätt?",
    formats: "Produkten, portionsstorleken och tillagningen påverkar uppskattningen. Kolhydrattäckningen visar hur stor andel av portionens tillgängliga kolhydrater som har lämpliga GI-uppgifter. Om GI saknas för en liten andel kan en uppskattning ändå vara möjlig när källorna ger stöd för gränser för dess påverkan. Hög täckning räcker inte i sig. Om påverkan inte går att avgränsa anges inget nytt GL-värde eller intervall.",
    examples: "Det här är exempel på hur informationen kan visas. Värdena är inte mätresultat för några recept.",
    formatsList: [
      ["Ungefärligt värde", "Uppskattat GL är cirka 8 per portion."],
      ["Intervall", "Uppskattat GL är cirka 8–13 per portion, beroende på brödet."],
      ["Uppskattning i ord", "Den här portionsstorleken har lågt uppskattat GL. Underlaget räcker inte för att ange ett visst värde."],
      ["Vad som ingår", "Uppskattningen gäller portionen utan ristillbehöret."],
      ["Kolhydratmängd", "En portion innehåller cirka 24 g kolhydrater, främst från ris. Ingen GL-uppskattning finns."],
      ["Uppgift saknas", "Det går inte att uppskatta kolhydratmängden eller GL för portionen eftersom mängden nudlar saknas."],
    ],
    find: "Gå till receptsökningen",
    more: "Läs om beräkningsmetoden och källorna",
    reading: "Mer om portioner och kolhydrater (på engelska)",
  },
  th: {
    title: "วิธีใช้ค่าประมาณ",
    steps: [
      "ดูว่าค่าประมาณนี้ใช้กับอาหารปริมาณเท่าใด",
      "ดูว่าอาหารในปริมาณนั้นมีคาร์โบไฮเดรตกี่กรัม",
      "อ่านค่า GL ที่แสดงเป็นตัวเลข ช่วงค่า หรือคำอธิบาย",
      "คำนึงถึงอาหารที่กินคู่กัน เครื่องดื่ม และผลิตภัณฑ์ที่ใช้ด้วย",
      "ใช้ข้อมูลประกอบการวางแผนมื้ออาหารและทำตามคำแนะนำในการดูแลสุขภาพของคุณ",
    ],
    portionTitle: "ปริมาณที่ทำกับปริมาณที่กิน",
    portion: "ถ้าเพิ่มวัตถุดิบทุกอย่างเป็นสองเท่าเพื่อทำ 8 ที่แทน 4 ที่ ค่าต่อหนึ่งที่ยังเท่าเดิม ถ้ากินหนึ่งที่ครึ่ง ปริมาณคาร์โบไฮเดรตและค่า GL ที่คำนวณได้จะเป็น 1.5 เท่าของหนึ่งที่ ระดับน้ำตาลในเลือดของแต่ละคนอาจเปลี่ยนแปลงต่างจากที่คำนวณ",
    portionExample: "ตัวอย่างการคำนวณ: ถ้าหนึ่งที่มีคาร์โบไฮเดรต 16 กรัมและค่า GL เท่ากับ 8 เมื่อกินหนึ่งที่ครึ่งจะได้คาร์โบไฮเดรต 24 กรัมและค่า GL เท่ากับ 12",
    diabetesTitle: "หากคุณเป็นเบาหวาน",
    diabetes: "เริ่มจากดูปริมาณอาหารที่จะกินและจำนวนกรัมของคาร์โบไฮเดรต ใช้ค่า GL เพื่อเปรียบเทียบตัวเลือกและทำตามแผนการดูแลของคุณ ค่า GL ของสูตรไม่สามารถบอกได้ว่าน้ำตาลในเลือดของคุณจะเปลี่ยนไปเท่าใดหรือควรใช้อินซูลินเท่าใด",
    formatsTitle: "ทำไมจึงแสดงค่าประมาณหลายแบบ",
    formats: "ผลิตภัณฑ์ ปริมาณต่อหนึ่งที่ และวิธีปรุงมีผลต่อค่าประมาณ ความครอบคลุมของข้อมูล GI คือสัดส่วนของคาร์โบไฮเดรตที่ย่อยและดูดซึมได้ในหนึ่งที่ซึ่งมีข้อมูล GI ที่เหมาะสม หากขาดข้อมูล GI เพียงส่วนน้อย ยังอาจประเมินได้เมื่อมีแหล่งข้อมูลรองรับขอบเขตของผลกระทบ ความครอบคลุมสูงเพียงอย่างเดียวยังไม่เพียงพอ หากกำหนดขอบเขตผลกระทบไม่ได้ จะไม่ระบุตัวเลขหรือช่วงค่า GL ใหม่",
    examples: "ข้อความต่อไปนี้เป็นเพียงตัวอย่างการแสดงข้อมูล ไม่ใช่ผลจากการวัดสูตรอาหาร",
    formatsList: [
      ["ตัวเลขโดยประมาณ", "ค่า GL ประมาณ 8 ต่อหนึ่งที่"],
      ["ช่วงค่า", "ค่า GL ประมาณ 8–13 ต่อหนึ่งที่ ขึ้นอยู่กับขนมปังที่ใช้"],
      ["คำอธิบายระดับ", "อาหารปริมาณเท่านี้มีค่า GL โดยประมาณอยู่ในระดับต่ำ แต่ข้อมูลไม่พอที่จะระบุเป็นตัวเลข"],
      ["ขอบเขตของค่าประมาณ", "ค่าประมาณนี้ยังไม่รวมข้าวที่กินคู่กับอาหาร"],
      ["ข้อมูลคาร์โบไฮเดรต", "หนึ่งที่มีคาร์โบไฮเดรตประมาณ 24 กรัม ส่วนใหญ่มาจากข้าว ยังไม่มีค่าประมาณ GL"],
      ["ข้อมูลที่ขาด", "ยังประเมินคาร์โบไฮเดรตหรือค่า GL ต่อหนึ่งที่ไม่ได้ เพราะไม่ทราบปริมาณเส้นก๋วยเตี๋ยว"],
    ],
    find: "ไปที่ช่องค้นหาสูตรอาหาร",
    more: "อ่านวิธีคำนวณและแหล่งข้อมูล",
    reading: "อ่านเพิ่มเติมเกี่ยวกับปริมาณอาหารและคาร์โบไฮเดรต (ภาษาอังกฤษ)",
  },
} satisfies Record<RecipeLocale, {
  title: string;
  steps: string[];
  portionTitle: string;
  portion: string;
  portionExample: string;
  diabetesTitle: string;
  diabetes: string;
  formatsTitle: string;
  formats: string;
  examples: string;
  formatsList: [string, string][];
  find: string;
  more: string;
  reading: string;
}>;

export function GlycemicLoadGuide({ locale }: { locale: RecipeLocale }) {
  const t = guide[locale];
  return (
    <>
      <section className="glycemic-pilot__method" aria-labelledby="gk-guide-use">
        <h2 id="gk-guide-use">{t.title}</h2>
        <ol className="glycemic-pilot__sources">
          {t.steps.map((step) => <li key={step}>{step}</li>)}
        </ol>
        <Link className="glycemic-pilot__method-link" to="#glycemic-pilot-recipes">{t.find}</Link>
      </section>
      <details className="glycemic-pilot__method glycemic-pilot__disclosure">
        <summary>{t.portionTitle}</summary>
        <p>{t.portion}</p>
        <p>{t.portionExample}</p>
      </details>
      <details className="glycemic-pilot__method glycemic-pilot__disclosure">
        <summary>{t.formatsTitle}</summary>
        <p>{t.formats}</p>
        <p>{t.examples}</p>
        <ul className="glycemic-pilot__sources">
          {t.formatsList.map(([label, example]) => <li key={label}><strong>{label}</strong> · {example}</li>)}
        </ul>
      </details>
      <section className="glycemic-pilot__method" aria-labelledby="gk-guide-diabetes">
        <h2 id="gk-guide-diabetes">{t.diabetesTitle}</h2>
        <p>{t.diabetes}</p>
        <a
          className="glycemic-pilot__method-link"
          href={locale === "fi"
            ? "https://diabetes.fi/diabetestietoa/hiilihydraattiarviointi/"
            : "https://www.diabetes.org.uk/living-with-diabetes/eating/carbohydrates-and-diabetes/glycaemic-index-and-diabetes"}
          hrefLang={locale === "fi" ? "fi" : "en"}
        >{t.reading}</a>
        <Link className="glycemic-pilot__method-link" to="#glycemic-pilot-method">{t.more}</Link>
      </section>
    </>
  );
}

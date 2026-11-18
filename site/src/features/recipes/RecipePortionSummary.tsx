import type { RecipeEntry, RecipeLocale } from "../../types/content";
import { eatenPortions, scalePortionRange, verbalGkForPortion, type IngredientPortion, type NamedGkAlternative, type PortionCarbs, type PortionEvidence } from "./gk-portion";
import type { GkRange } from "./gk-estimate";
import { formatGlycemicLoadNumber } from "./gk80-format";

export const portionCopy = {
  fi: {
    title: "Oma syötävä annos", batch: "Valmistettavat annokset", single: "1 reseptin annos", carbs: "Hiilihydraatit annoksessa", available: "Ilman kuitua ja polyoleja",
    total: "Reseptin ilmoittama kokonaismäärä, kuitu ja polyolit mukana", net: "Reseptin ilmoittamat nettohiilihydraatit",
    scope: "Arvio koskee reseptin ainesluetteloa. Huomioi erikseen lisätyt lisukkeet ja juomat.",
    fraction: (n: string) => `${n} reseptin annosta`, pieces: (n: string) => `${n} kpl`,
    sheets: (n: string) => n === "1" ? "1 arkki" : `${n} arkkia`,
    main: (name: string) => `Suurin osa imeytyvistä hiilihydraateista tulee aineksesta: ${name}.`,
    known: (name: string) => `Tunnettu hiilihydraatin lähde: ${name}.`, about: "noin",
    missingCarbs: "Koko annoksen hiilihydraattimäärää ei ole voitu vahvistaa.",
    ingredientAmount: "Ainesosan määrä ohjeen mukaan",
    ingredientCarbs: "Imeytyvät hiilihydraatit tästä aineksesta",
    declaredIngredientCarbs: "Hiilihydraatit tästä aineksesta pakkauksen mukaan",
    alternatives: "Lasketut GK-vaihtoehdot tässä annoksessa",
    versionAlternatives: "GK nuudelivalinnan mukaan, yksi erillisversion annos",
    scopeSource: "Katso arvion tai ruokakohtaisen huomion lähde",
    batchShare: (n: string) => n === "1" ? "Yksi annos vastaa koko valmistettavaa erää." : `Yksi annos on 1/${n} valmistettavasta erästä.`,
    inconsistent: "Pistearvio ja skenaarioväli eivät anna samaa GK-luokkaa.",
    pending: "Tämän reseptin GI-lähteet odottavat katselmointia.",
    baseOnly: "Sanallinen GK-arvio koskee reseptin tavallista annosta.",
    roundedServingOnly: "Pyöristetty GK-arvio koskee yhtä reseptin annosta.",
    class: { LOW: "Pieni arvioitu GK", MEDIUM: "Keskisuuri arvioitu GK", HIGH: "Suuri arvioitu GK" },
    crossing: "Vaihteluväli ulottuu useaan GK-luokkaan.", rounding: "Arvio on lähellä GK-luokan rajaa.",
    omitted: "Laskelmasta puuttuu pieniä hiilihydraattiosuuksia. Tulos ei riitä varmistamaan GK-luokkaa.",
  },
  en: {
    title: "Portion you eat", batch: "Servings to make", single: "1 recipe serving", carbs: "Carbohydrate in your portion", available: "Excludes fibre and polyols",
    total: "Recipe total, including fibre and polyols", net: "Net carbs as listed in the recipe",
    scope: "The estimate covers the listed ingredients. Count any extra sides and drinks separately.",
    fraction: (n: string) => `${n} recipe servings`, pieces: (n: string) => n === "1" ? "1 piece" : `${n} pieces`,
    sheets: (n: string) => n === "1" ? "1 sheet" : `${n} sheets`,
    main: (name: string) => `Most of the available carbohydrate comes from this ingredient: ${name}.`,
    known: (name: string) => `A known source of carbohydrate: ${name}.`, about: "about",
    missingCarbs: "The carbohydrate content of the full portion could not be confirmed.",
    ingredientAmount: "Ingredient amount from the recipe",
    ingredientCarbs: "Available carbohydrate in this ingredient",
    declaredIngredientCarbs: "Labelled carbohydrate in this ingredient",
    alternatives: "Calculated GL alternatives for this portion",
    versionAlternatives: "GL by noodle choice for one serving of this version",
    scopeSource: "See the source for this estimate or ingredient note",
    batchShare: (n: string) => n === "1" ? "One serving is the whole batch." : `One serving is 1/${n} of the batch you make.`,
    inconsistent: "The point estimate and the scenario range give different GL categories.",
    pending: "The GI sources for this recipe are awaiting review.",
    baseOnly: "The verbal GL estimate applies to the recipe's standard serving.",
    roundedServingOnly: "The rounded GL estimate applies to one recipe serving.",
    class: { LOW: "Estimated low GL", MEDIUM: "Estimated medium GL", HIGH: "Estimated high GL" },
    crossing: "The range spans more than one GL category.", rounding: "The estimate is close to a GL category boundary.",
    omitted: "The calculation leaves out small amounts of carbohydrate, so the GL category is uncertain.",
  },
  sv: {
    title: "Portionen du äter", batch: "Portioner att laga", single: "1 receptportion", carbs: "Kolhydrater i din portion", available: "Utan fiber och polyoler",
    total: "Receptets totala kolhydrater, inklusive fiber och polyoler", net: "Nettokolhydrater enligt receptet",
    scope: "Uppskattningen gäller ingredienserna i listan. Räkna tillbehör och drycker som du lägger till separat.",
    fraction: (n: string) => `${n} receptportioner`, pieces: (n: string) => `${n} st.`,
    sheets: (n: string) => `${n} ark`,
    main: (name: string) => `Det mesta av de tillgängliga kolhydraterna kommer från den här ingrediensen: ${name}.`,
    known: (name: string) => `En känd kolhydratkälla: ${name}.`, about: "cirka",
    missingCarbs: "Kolhydratmängden i hela portionen har inte kunnat bekräftas.",
    ingredientAmount: "Mängd av ingrediensen enligt receptet",
    ingredientCarbs: "Tillgängliga kolhydrater i den här ingrediensen",
    declaredIngredientCarbs: "Kolhydrater i ingrediensen enligt förpackningen",
    alternatives: "Beräknade GL-alternativ för den här portionen",
    versionAlternatives: "GL efter nudelval för en portion av den här versionen",
    scopeSource: "Se källan till uppskattningen eller råvaruuppgiften",
    batchShare: (n: string) => n === "1" ? "En portion motsvarar hela satsen." : `En portion är 1/${n} av satsen du lagar.`,
    inconsistent: "Punktuppskattningen och intervallet ger olika GL-kategorier.",
    pending: "GI-källorna för receptet väntar på granskning.",
    baseOnly: "Den beskrivande GL-uppskattningen gäller receptets ordinarie portion.",
    roundedServingOnly: "Den avrundade GL-uppskattningen gäller en portion enligt receptet.",
    class: { LOW: "Uppskattad låg GL", MEDIUM: "Uppskattad medelhög GL", HIGH: "Uppskattad hög GL" },
    crossing: "Intervallet sträcker sig över flera GL-kategorier.", rounding: "Uppskattningen ligger nära en GL-gräns.",
    omitted: "Små mängder kolhydrater saknas i beräkningen. Därför är GL-kategorin osäker.",
  },
  th: {
    title: "ปริมาณที่คุณรับประทาน", batch: "จำนวนที่ทำ", single: "1 ที่ตามสูตร", carbs: "คาร์โบไฮเดรตในส่วนที่รับประทาน", available: "ไม่รวมใยอาหารและโพลิออล",
    total: "คาร์โบไฮเดรตรวมตามสูตร รวมใยอาหารและโพลิออล", net: "คาร์โบไฮเดรตสุทธิตามที่ระบุในสูตร",
    scope: "ค่าประมาณครอบคลุมวัตถุดิบในรายการเท่านั้น โปรดคิดเครื่องเคียงและเครื่องดื่มที่เพิ่มแยกต่างหาก",
    fraction: (n: string) => `${n} ที่ตามสูตร`, pieces: (n: string) => `${n} ชิ้น`,
    sheets: (n: string) => `${n} แผ่น`,
    main: (name: string) => `วัตถุดิบที่ให้คาร์โบไฮเดรตที่ใช้ได้มากกว่าครึ่งคือ ${name}`,
    known: (name: string) => `แหล่งคาร์โบไฮเดรตที่ทราบคือ ${name}`, about: "ประมาณ",
    missingCarbs: "ยังยืนยันปริมาณคาร์โบไฮเดรตของอาหารทั้งส่วนไม่ได้",
    ingredientAmount: "ปริมาณวัตถุดิบตามสูตร",
    ingredientCarbs: "คาร์โบไฮเดรตที่ใช้ได้จากวัตถุดิบนี้",
    declaredIngredientCarbs: "คาร์โบไฮเดรตจากวัตถุดิบนี้ตามฉลาก",
    alternatives: "ค่า GL ที่คำนวณได้สำหรับแต่ละตัวเลือกในส่วนนี้",
    versionAlternatives: "ค่า GL ตามชนิดเส้นสำหรับหนึ่งที่ของสูตรเวอร์ชันนี้",
    scopeSource: "ดูแหล่งข้อมูลของค่าประมาณหรือข้อสังเกตเรื่องวัตถุดิบ",
    batchShare: (n: string) => n === "1" ? "อาหารหนึ่งที่เท่ากับทั้งหมดที่ทำ" : `อาหารหนึ่งที่เท่ากับ 1/${n} ของทั้งหมดที่ทำ`,
    inconsistent: "ค่าประมาณแบบตัวเลขเดียวกับช่วงค่าจากตัวเลือกให้ระดับ GL ต่างกัน",
    pending: "แหล่งข้อมูล GI ของสูตรนี้ยังรอการตรวจสอบ",
    baseOnly: "คำอธิบายระดับ GL ใช้กับอาหารหนึ่งที่ตามสูตรเท่านั้น",
    roundedServingOnly: "ค่า GL โดยประมาณที่ปัดเศษแล้วใช้กับอาหารหนึ่งที่ตามสูตร",
    class: { LOW: "ค่า GL โดยประมาณอยู่ในระดับต่ำ", MEDIUM: "ค่า GL โดยประมาณอยู่ในระดับปานกลาง", HIGH: "ค่า GL โดยประมาณอยู่ในระดับสูง" },
    crossing: "ช่วงค่าครอบคลุมมากกว่าหนึ่งระดับ GL", rounding: "ค่าประมาณอยู่ใกล้จุดแบ่งระดับ GL",
    omitted: "การคำนวณไม่รวมคาร์โบไฮเดรตบางส่วนที่มีปริมาณเล็กน้อย จึงยังยืนยันระดับ GL ไม่ได้",
  },
} as const;

function formatCarbs(value: number, locale: string) {
  if (value > 0 && value < 0.1) return "<" + new Intl.NumberFormat(locale).format(0.1);
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value);
}

export function describeCarbs({ min, max }: GkRange, locale: string) {
  const lower = formatCarbs(min, locale), upper = formatCarbs(max, locale);
  return lower === upper ? lower : `${lower}–${upper}`;
}

export function IngredientPortionDetails({ ingredient, locale, multiplier = 1 }: {
  ingredient: IngredientPortion;
  locale: RecipeLocale;
  multiplier?: number;
}) {
  const t = portionCopy[locale];
  const gram = locale === "th" ? "กรัม" : "g";
  const amount = formatCarbs(ingredient.amountPerServing * multiplier, locale);
  const quantity = { g: `${amount} ${gram}`, kpl: t.pieces(amount), arkkia: t.sheets(amount) }[ingredient.unit];
  const carbohydrate = ingredient.availableCarbsGPerServing ?? ingredient.declaredCarbsGPerServing;
  const declared = ingredient.declaredCarbsGPerServing !== undefined;
  return <dl className="nutrition-list" data-ingredient-portion>
    <div>
      <dt>{t.ingredientAmount}</dt>
      <dd>{ingredient.name[locale]} · {quantity}</dd>
    </div>
    {carbohydrate !== undefined ? <div data-ingredient-carbohydrate={declared ? "declared" : "available"}>
      <dt>{declared ? t.declaredIngredientCarbs : t.ingredientCarbs}</dt>
      <dd>{t.about} {formatCarbs(carbohydrate * multiplier, locale)} {gram}</dd>
    </div> : null}
  </dl>;
}

export function GkAlternatives({ choices, locale, multiplier = 1, separateVersion = false }: {
  choices: NamedGkAlternative[];
  locale: RecipeLocale;
  multiplier?: number;
  separateVersion?: boolean;
}) {
  const t = portionCopy[locale];
  return <div data-gk-alternatives aria-live="polite" aria-atomic="true">
    <p>{separateVersion ? t.versionAlternatives : t.alternatives}</p>
    <dl className="nutrition-list">
      {choices.map(choice => <div key={choice.label[locale]}>
        <dt>{choice.label[locale]}</dt>
        <dd>{t.about} {separateVersion ? formatCarbs(choice.gkPerServing, locale)
          : formatGlycemicLoadNumber(choice.gkPerServing * multiplier, locale, true)}</dd>
      </div>)}
    </dl>
  </div>;
}

export function ReviewedPortionSource({ source, locale }: { source: string; locale: RecipeLocale }) {
  return <a href={source} rel="noopener noreferrer">{portionCopy[locale].scopeSource}</a>;
}

export function RecipePortionSummary({ recipe, evidence, carbs, multiplier, batchServings, onChange }: {
  recipe: RecipeEntry;
  evidence?: PortionEvidence;
  carbs: PortionCarbs | null;
  multiplier: number;
  batchServings: number;
  onChange?: (multiplier: number) => void;
}) {
  const { locale } = recipe;
  const t = portionCopy[locale];
  const format = new Intl.NumberFormat(locale).format;
  const ingredient = evidence?.driver && recipe.ingredients[evidence.driver.ingredientIndex]?.item;
  return <div className="recipe-portion">
    {onChange ? <div className="recipe-portion__control">
      <label htmlFor="eaten-recipe-portion">{t.title}</label>
      <select id="eaten-recipe-portion" value={multiplier} onChange={event => onChange(Number(event.currentTarget.value))}>
        {eatenPortions.map(count => <option key={count} value={count}>{count === 1 ? t.single : t.fraction(format(count))}</option>)}
      </select>
    </div> : <p><strong>{t.title}</strong> · {multiplier === 1 ? t.single : t.fraction(format(multiplier))}</p>}
    <div aria-live="polite">
      {!evidence?.gramsPerServing && !evidence?.piecesPerServing ? <p>{t.batchShare(format(batchServings))}</p> : null}
      {evidence?.gramsPerServing ? <p>{t.about} {format(evidence.gramsPerServing * multiplier)} {locale === "th" ? "กรัม" : "g"}</p> : null}
      {evidence?.piecesPerServing ? <p>{t.pieces(format(evidence.piecesPerServing * multiplier))}</p> : null}
      {carbs ? <dl className="nutrition-list">
        <div><dt>{t.carbs}</dt><dd data-portion-carbohydrate={carbs.definition}>{t.about} {describeCarbs(scalePortionRange(carbs.range, multiplier), locale)} {locale === "th" ? "กรัม" : "g"}</dd></div>
      </dl> : <p className="recipe-disclosure">{t.missingCarbs}</p>}
      {carbs ? <p className="recipe-disclosure">{t[carbs.definition]}</p> : null}
      {evidence?.ingredientPortion ? <IngredientPortionDetails ingredient={evidence.ingredientPortion} locale={locale} multiplier={multiplier} /> : null}
    </div>
    {ingredient ? <p>{evidence?.driver?.coversMajority ? t.main(ingredient) : t.known(ingredient)}</p> : null}
    <p className="recipe-disclosure">{evidence?.condition?.[locale] ?? t.scope}</p>
    {evidence?.reviewedSource && !evidence.verbal && (evidence.condition || ingredient || evidence.ingredientPortion) ? <p className="recipe-disclosure">
      <ReviewedPortionSource source={evidence.reviewedSource} locale={locale} />
    </p> : null}
  </div>;
}

export function VerbalPortionEstimate({ evidence, recipe, multiplier }: {
  evidence: PortionEvidence;
  recipe: RecipeEntry;
  multiplier: number;
}) {
  const { locale } = recipe;
  const t = portionCopy[locale];
  const category = verbalGkForPortion(evidence.verbal, multiplier);
  if (!category) return <p>{t.baseOnly}</p>;
  return <>
    <p><strong>{t.class[category]}</strong></p>
    {evidence.verbal?.condition ? <p>{evidence.verbal.condition[locale]}</p> : null}
    <p data-verbal-portion-scope>{evidence.verbal?.rationale[locale]}</p>
    {evidence.reviewedSource ? <p><ReviewedPortionSource source={evidence.reviewedSource} locale={locale} /></p> : null}
  </>;
}

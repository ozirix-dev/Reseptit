// Narrow regressions from the V1.4 aligned-source audit. These identify known
// errors, not every valid translation or every possible semantic error.
export const semanticTerms = [
  { source: /nakkeja/i, bad: { en: /trinkets?|walnuts?/i, sv: /prydnadssaker/i, th: /เครื่องประดับ|วอลนัท/ }, meaning: "frankfurter sausage" },
  { source: /^lanttua$/i, bad: { en: /subside/i, sv: /avtar/i, th: /ลดลง/ }, meaning: "swede / rutabaga" },
  { source: /^paksoita$/i, bad: { en: /thicken(?:ed)?/i, sv: /tjockna/i, th: /ข้น/ }, meaning: "pak choi" },
  { source: /kardemummakotaa/i, bad: { en: /cardamom house/i, sv: /kardemumma hus/i, th: /บ้านกระวาน/ }, meaning: "cardamom pods" },
  { source: /poronkäristyslihaa/i, bad: { en: /jerky/i, sv: /jerky|renryck/i, th: /แดดเดียว/ }, meaning: "uncured thinly sliced reindeer meat" },
  { source: /maitorahkaa/i, bad: { en: /\bcurds\b/i, sv: /ostmassa/i, th: /นมเปรี้ยว/ }, meaning: "quark" },
  { source: /porsaan ulkofileetä/i, bad: { en: /tenderloin/i, sv: /(?:^|\s)fläskfilé(?:\s|$)/i, th: /สันใน/ }, meaning: "pork loin" },
  { source: /broilerin paistileikettä/i, bad: { th: /ไก่ทอด/ }, meaning: "raw boneless chicken thigh fillet" },
  { source: /kypsiä kikherneitä/i, bad: { en: /ripe chickpeas/i, sv: /mogna kikärtor/i }, meaning: "cooked chickpeas" },
  { source: /kiinalaisia vehnälettuja/i, bad: { en: /wheat dumplings/i, sv: /vete dumplings/i, th: /เกี๊ยวข้าวสาลี/ }, meaning: "Chinese wheat pancakes" },
  { source: /herkkusieniä/i, bad: { en: /edible mushrooms/i, sv: /ätbara svampar/i, th: /เห็ดที่กินได้/ }, meaning: "button mushrooms" },
  { source: /turkkilaista jogurttia/i, bad: { en: /turkkilaista jogurttia/i }, meaning: "Turkish-style yoghurt" },
  { source: /konjaknuudeleita/i, bad: { en: /\bbrandy\b|\bcognac\b/i, sv: /brandynudlar/i, th: /บรั่นดี|คอนยัค/ }, meaning: "konjac noodles" },
  { source: /kalafondi/i, bad: { th: /ฟองดู(?:ว์)?ปลา|น้ำสต[็๊]อกข้าว/ }, meaning: "fish stock concentrate" },
  { source: /osterivinokkaita/i, bad: { sv: /ostronmackor/i }, meaning: "oyster mushrooms" },
  { source: /^couscousia$/i, bad: { th: /เส้นก๋วยเตี๋ยว/ }, meaning: "couscous" },
  { source: /keitettyä kylmää riisiä/i, bad: { th: /ข้าวต้มเย็น/ }, meaning: "cooked cold rice, not rice porridge" },
  { source: /^kalalientä$/, bad: { sv: /^fiskfond$/i }, meaning: "prepared fish broth" },
  { source: /^vettä tai kanalientä$/, bad: { sv: /kycklingfond/i }, meaning: "water or prepared chicken broth" },
  { source: /^broilerin reisi(?:lihaa|paloja)$/, bad: { th: /น่อง/ }, meaning: "chicken thigh, not drumstick" },
  { source: /^smetanaa$/, bad: { sv: /^gräddfil$/i }, meaning: "smetana" },
  { source: /^jauhettua korianteria$/, bad: { th: /^ผักชีบด$/ }, meaning: "ground coriander seeds" },
] satisfies { source: RegExp; bad: Partial<Record<"en" | "sv" | "th", RegExp>>; meaning: string }[];

export function semanticTermErrors(sourceItems: string[], targetItems: string[], locale: "en" | "sv" | "th"): string[] {
  return sourceItems.flatMap((source, index) => semanticTerms.flatMap((rule) => {
    const bad = (rule.bad as Partial<Record<typeof locale, RegExp>>)[locale];
    return rule.source.test(source) && bad?.test(targetItems[index] ?? "")
      ? [`ingredient ${index + 1} mistranslated: expected ${rule.meaning}`] : [];
  }));
}

// Source-specific findings: these do not reject legitimate nuts, kettles or
// whipped toppings in unrelated recipes.
export function semanticProseErrors(recipeId: string, locale: "en" | "sv" | "th", text: string): string[] {
  const rules: { ids: string[]; bad: Partial<Record<typeof locale, RegExp>>; issue: string }[] = [
    { ids: ["nakkikastike-kukkakaalimuusi", "nakkikeitto-kukkakaalilla"], bad: { en: /walnuts?|\bsnacks\b|\bNak\b/i, sv: /valnöt|mellanmål|\bNak\b/i, th: /วอลนัท|ของว่าง/ }, issue: "sausage mistranslated as walnut" },
    { ids: ["char-siu", "khao-kha-moo-vhh"], bad: { en: /\ballspice\b|\bthyme\b/i, sv: /kryddpeppar|timjan/i, th: /ออลสไปซ์|ไทม์|โหระพา/ }, issue: "five-spice mistranslated" },
    { ids: ["vhh-lihamureke"], bad: { en: /shortbread/i, sv: /mördeg/i, th: /ขนมชนิดร่วน/ }, issue: "meatloaf mistranslated as shortbread" },
    { ids: ["sichuan-hot-pot"], bad: { en: /\bkettle\b/i, sv: /vattenkokare/i, th: /กาต้มน้ำ/ }, issue: "hot-pot cooker mistranslated as kettle" },
    { ids: ["gulab-jamun"], bad: { en: /Kiehauta|Kuumenna|ruusuvesi/i, sv: /Kiehauta|Kuumenna|ruusuvesi/i }, issue: "untranslated Finnish instruction" },
    { ids: ["keto-korvapuustit"], bad: { en: /ear buds/i, sv: /öronpropp/i, th: /หูที่ปรุง/ }, issue: "cinnamon roll mistranslated as earplug" },
    { ids: ["vhh-pyttipannu"], bad: { en: /\b(?:linguine|lentils?|lantus?|lard)\b/i, sv: /\b(?:linguine|linser|lantus?|ister)\b/i, th: /ลิงกวินี|ถั่วเลนทิล|ลันตู|ลันทัส|น้ำมันหมู/ }, issue: "swede mistranslated in recipe prose" },
    { ids: ["xiaolongbao"], bad: { en: /steamed noodles/i, sv: /ångade nudlar/i, th: /บะหมี่นึ่ง/ }, issue: "dumpling mistranslated as noodle" },
    { ids: ["keto-kauralesesampylat"], bad: { th: /รำข้าวโอ๊ตไม่มีคาร์โบไฮเดรต/ }, issue: "oat bran carbohydrate warning negated" },
    { ids: ["rogan-josh"], bad: { en: /does not run/i, sv: /inte rinner/i, th: /เพื่อไม่ให้ไหล/ }, issue: "curdling mistranslated as running" },
    { ids: ["tunisialainen-brik"], bad: { th: /น้ำมูก|อบ Brik/ }, issue: "runny egg or frying mistranslated" },
    { ids: ["bouillabaisse"], bad: { th: /ยี่หร่า/ }, issue: "fennel mistranslated as cumin" },
    { ids: ["pani-puri"], bad: { th: /เปลือกหอย|ส่วนที่กัด/ }, issue: "puri shell mistranslated as seashell" },
  ];
  return rules.flatMap((rule) => rule.ids.includes(recipeId) && rule.bad[locale]?.test(text) ? [rule.issue] : []);
}

// Ingredient notes and search tags are visible recipe content too. These checks
// cover observed mistranslations only; they do not certify general language quality.
type ReviewLocale = "en" | "sv" | "th";
type AlignedRule = { source: RegExp; bad: Partial<Record<ReviewLocale, RegExp>>; meaning: string };

function alignedTextErrors(source: string[], target: string[], locale: ReviewLocale, rules: AlignedRule[], field: string): string[] {
  return source.flatMap((value, index) => rules.flatMap((rule) =>
    rule.source.test(value) && rule.bad[locale]?.test(target[index] ?? "")
      ? [`${field} ${index + 1} mistranslated: expected ${rule.meaning}`] : []));
}

export function semanticNoteErrors(source: string[], target: string[], locale: ReviewLocale): string[] {
  return alignedTextErrors(source, target, locale, [
    { source: /^hienonnettuna$/, bad: { en: /refined/i, sv: /förfinad/i, th: /ขัดเกลา/ }, meaning: "finely chopped" },
    { source: /^muusiin$/, bad: { en: /muse/i, sv: /fundera/i, th: /รำพึง/ }, meaning: "for the mash" },
    { source: /^nahallisina ja luullisina$/, bad: { en: /leathery|bony/i, sv: /läderartad|benig/i }, meaning: "skin-on and bone-in" },
    { source: /^nahattomina, viillotettuina$/, bad: { en: /sliced/i, sv: /skivad/i, th: /หั่นบาง/ }, meaning: "skin removed and meat scored" },
    { source: /lohkoina|lohkottuna/, bad: { en: /blocks?/i, sv: /block/i, th: /บล็อก/ }, meaning: "cut into wedges" },
    { source: /^halutessasi pinnalle$/, bad: { en: /want to surface/i, sv: /komma upp till ytan/i, th: /ต้องการที่จะพื้นผิว/ }, meaning: "optional topping" },
    { source: /^pieninä nuppuina$/, bad: { en: /buttons/i, sv: /knappar/i, th: /ปุ่ม/ }, meaning: "small florets" },
    { source: /esimerkiksi kuhaa tai turskaa/, bad: { en: /\bpike\b(?![- ]?perch)/i, sv: /gädda/i, th: /หอก/ }, meaning: "zander or cod" },
    { source: /tulisuus oman maun mukaan/, bad: { sv: /värm efter smak/i, th: /ตั้งไฟ/ }, meaning: "adjust spiciness to taste" },
  ], "ingredient note");
}

export function semanticTagErrors(source: string[], target: string[], locale: ReviewLocale): string[] {
  const rules: AlignedRule[] = [
    { source: /^Isan$/, bad: { en: /^dad$/i, sv: /^pappa$/i, th: /^พ่อ$/ }, meaning: "Isan region" },
    { source: /^nakit$/, bad: { en: /jewelry/i, sv: /smycke/i, th: /เครื่องประดับ/ }, meaning: "frankfurter sausages" },
    { source: /^valimerellinen$/, bad: { en: /^marine$/i, sv: /^marina$/i, th: /^มารีน$/ }, meaning: "Mediterranean" },
    { source: /^linssi$/, bad: { en: /^lens$/i, th: /^เลนส์$/ }, meaning: "lentils" },
    { source: /^paneer$/, bad: { th: /บานหน้าต่าง/ }, meaning: "paneer cheese" },
  ];
  // Tag order has no meaning. Source tags enable rules; each target tag is
  // checked against all enabled rules, while ingredient notes stay positional.
  return target.flatMap((value, index) => rules.flatMap((rule) =>
    source.some((tag) => rule.source.test(tag)) && rule.bad[locale]?.test(value)
      ? [`tag ${index + 1} mistranslated: expected ${rule.meaning}`] : []));
}

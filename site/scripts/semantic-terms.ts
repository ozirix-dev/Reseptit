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
  { source: /kalafondi/i, bad: { th: /ฟองดูว์ปลา/ }, meaning: "fish stock concentrate" },
  { source: /osterivinokkaita/i, bad: { sv: /ostronmackor/i }, meaning: "oyster mushrooms" },
  { source: /^couscousia$/i, bad: { th: /เส้นก๋วยเตี๋ยว/ }, meaning: "couscous" },
  { source: /keitettyä kylmää riisiä/i, bad: { th: /ข้าวต้มเย็น/ }, meaning: "cooked cold rice, not rice porridge" },
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
    { ids: ["nakkikastike-kukkakaalimuusi", "nakkikeitto-kukkakaalilla"], bad: { en: /walnuts?/i, sv: /valnöt/i, th: /วอลนัท/ }, issue: "sausage mistranslated as walnut" },
    { ids: ["char-siu", "khao-kha-moo-vhh"], bad: { en: /\ballspice\b|\bthyme\b/i, sv: /kryddpeppar|timjan/i, th: /ออลสไปซ์|ไทม์/ }, issue: "five-spice mistranslated" },
    { ids: ["vhh-lihamureke"], bad: { en: /shortbread/i, sv: /mördeg/i, th: /ขนมชนิดร่วน/ }, issue: "meatloaf mistranslated as shortbread" },
    { ids: ["sichuan-hot-pot"], bad: { en: /\bkettle\b/i, sv: /vattenkokare/i, th: /กาต้มน้ำ/ }, issue: "hot-pot cooker mistranslated as kettle" },
    { ids: ["gulab-jamun"], bad: { en: /Kiehauta|Kuumenna|ruusuvesi/i, sv: /Kiehauta|Kuumenna|ruusuvesi/i }, issue: "untranslated Finnish instruction" },
    { ids: ["keto-korvapuustit"], bad: { en: /ear buds/i, sv: /öronpropp/i, th: /หูที่ปรุง/ }, issue: "cinnamon roll mistranslated as earplug" },
    { ids: ["vhh-pyttipannu"], bad: { en: /linguine/i, sv: /linguine/i, th: /ลิงกวินี/ }, issue: "swede mistranslated as pasta" },
    { ids: ["xiaolongbao"], bad: { en: /steamed noodles/i, sv: /ångade nudlar/i, th: /บะหมี่นึ่ง/ }, issue: "dumpling mistranslated as noodle" },
  ];
  return rules.flatMap((rule) => rule.ids.includes(recipeId) && rule.bad[locale]?.test(text) ? [rule.issue] : []);
}

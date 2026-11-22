import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";

const locales = ["en", "sv", "th"] as const;
type Locale = typeof locales[number];

const safetyHeading: Record<Locale, string> = {
  en: "Safety notes",
  sv: "Livsmedelssäkerhet",
  th: "ข้อควรระวังด้านความปลอดภัย",
};

// These targeted assertions protect meaning-critical warnings; they do not
// establish full translation equivalence or grant publication approval.
const expectations: Record<string, Record<Locale, RegExp[]>> = {
  "suolasienisalaatti-sipulilla": {
    en: [/species-specific pre-treatment/i, /salting or soaking alone cannot make poisonous mushrooms safe/i],
    sv: [/Artens korrekta förbehandling/i, /saltning eller blötläggning gör inte giftig svamp säker/i],
    th: [/ตามข้อกำหนดของแต่ละชนิด/, /การดองเกลือหรือแช่น้ำเพียงอย่างเดียวไม่ทำให้เห็ดมีพิษปลอดภัย/],
  },
  "lasimestarin-silli": {
    en: [/ready-to-eat herring only/i, /original use-by date/i, /does not make untreated raw fish safe/i],
    sv: [/endast ätfärdig sill/i, /sista förbrukningsdag/i, /inte obehandlad rå fisk säker/i],
    th: [/พร้อมรับประทานเท่านั้น/, /วันหมดอายุเดิม/, /ไม่ทำให้ปลาดิบที่ไม่ได้ผ่านการจัดการปลอดภัย/],
  },
  "uunissa-paistetut-silakkarullat": {
    en: [/Keep raw fish chilled/i, /cook thoroughly/i, /origin-specific advice/i],
    sv: [/Håll rå fisk kall/i, /tillaga den ordentligt/i, /ursprungsområde/i],
    th: [/เก็บปลาดิบให้เย็น/, /อบให้สุกทั่วถึง/, /ตามแหล่งที่มา/],
  },
  "savupororullat-kantarelleilla": {
    en: [/fully cooked ready-to-eat smoked reindeer/i, /Identify and cook all mushrooms/i, /finished rolls cold/i],
    sv: [/genomstekt, ätfärdigt rökt renkött/i, /Artbestäm och tillaga svampen/i, /rullar kallt/i],
    th: [/เนื้อรมควันที่สุกและพร้อมรับประทาน/, /ระบุชนิดเห็ดให้แน่ชัดและปรุงเห็ดให้สุก/, /เก็บโรลในตู้เย็น/],
  },
  "pienet-kantarellipiiraat": {
    en: [/positively identified edible chanterelles/i, /egg filling until set/i, /pies containing eggs and dairy products refrigerated, including any leftovers/i],
    sv: [/säkert artbestämda kantareller/i, /äggfyllningen tills den har stelnat/i, /Förvara pajerna som innehåller ägg och mjölkprodukter i kylskåp, även eventuella rester/i],
    th: [/เห็ดชานเทอเรลที่กินได้และระบุชนิดแน่ชัด/, /อบไส้ที่มีไข่จนเซตตัวและสุกทั่วถึง/, /เก็บพายที่มีไข่และผลิตภัณฑ์นมไว้ในตู้เย็น รวมถึงส่วนที่เหลือ/],
  },
  "punajuuricarpaccio-vuohenjuustolla": {
    en: [/goat cheese pasteurisation/i, /risk groups/i, /milk and walnuts/i],
    sv: [/getostens pastörisering/i, /riskgrupper/i, /mjölk och valnötter/i],
    th: [/การพาสเจอไรซ์/, /กลุ่มเสี่ยง/, /นมและวอลนัต/],
  },
  "sillikaviaari-ruisnapeilla": {
    en: [/ready-to-eat herring/i, /keep chilled/i, /fish, eggs, milk and rye/i, /contains no fish roe/i],
    sv: [/ätfärdig sill/i, /förvara kallt/i, /fisk, ägg, mjölk och råg/i, /ingen rom/i],
    th: [/ปลาเฮร์ริงพร้อมรับประทาน/, /เก็บเย็น/, /ปลา ไข่ นม และไรย์/, /ไม่มีไข่ปลา/],
  },
  "nokkosletut-puolukoilla": {
    en: [/identified nettles from clean ground/i, /not roadsides or heavily fertilised places/i, /Boil before use/i, /infants under one year/i],
    sv: [/identifierade nässlor på rena platser/i, /inte vid vägar eller hårt gödslade områden/i, /Koka före användning/i, /barn under ett år/i],
    th: [/ใบตำแยที่ระบุชนิดได้แน่นอนจากพื้นที่สะอาด/, /หลีกเลี่ยงริมถนนและพื้นที่ใส่ปุ๋ยมาก/, /ต้มก่อนใช้/, /อายุต่ำกว่า 1 ปี/],
  },
};

function load(relative: string) {
  const raw = readFileSync(new URL("../../" + relative, import.meta.url), "utf8");
  const parsed = parseMarkdown(raw);
  assert.ok(parsed, relative + ": valid markdown");
  return { raw, data: recipeFrontmatterSchema.parse(parsed.data) };
}

test("eight released FI starters retain 24 translation Drafts with safety sections", () => {
  assert.equal(Object.keys(expectations).length, 8);
  let pairs = 0;
  for (const [id, localeRules] of Object.entries(expectations)) {
    const source = load("reseptit/alkuruoat/" + id + ".md");
    assert.equal(source.data.status, "published", id + ": FI remains published");
    for (const locale of locales) {
      const file = "kaannokset/" + locale + "/alkuruoat/" + id + ".md";
      const target = load(file);
      assert.equal(target.data.recipe_id, id, file);
      assert.equal(target.data.status, "draft", file);
      assert.equal(target.data.translation_of, id, file);
      const start = "## " + safetyHeading[locale] + "\n\n";
      const parts = target.raw.split(start);
      assert.equal(parts.length, 2, file + ": exactly one safety section");
      const section = parts[1]!.split(/\n## /, 1)[0]!.trim();
      assert.ok(section.length > 40, file + ": nonempty meaningful warning");
      for (const pattern of localeRules[locale]) {
        assert.match(section, pattern, file + ": critical warning is preserved");
      }
      pairs++;
    }
  }
  assert.equal(pairs, 24);
});

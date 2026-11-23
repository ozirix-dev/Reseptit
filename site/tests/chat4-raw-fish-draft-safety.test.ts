import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";

const languages = ["fi", "en", "sv", "th"] as const;
type Language = typeof languages[number];

const heading: Record<Exclude<Language, "fi">, string> = {
  en: "Safety notes",
  sv: "Livsmedelssäkerhet",
  th: "ข้อควรระวังด้านความปลอดภัย",
};

const rules: Record<string, {
  rawUse: Record<Language, RegExp[]>;
  listeria: Record<Language, RegExp[]>;
}> = {
  "graavisiika-tillilla": {
    rawUse: {
      fi: [/raakakäyttöön soveltuva/i, /älä tarjoa kalaa kuumentamatta/i],
      en: [/suitable for raw consumption/i, /do not serve uncooked/i],
      sv: [/lämplig att äta rå/i, /Servera inte fisken rå/i],
      th: [/เหมาะสำหรับกินดิบ/, /ห้ามเสิร์ฟแบบไม่ผ่านความร้อน/],
    },
    listeria: {
      fi: [/valmistajakirjettä ei automaattisesti vaadita/i, /eivät tuhoa listeriaa/i],
      en: [/No manufacturer letter is automatically required/i, /do not eliminate listeria/i],
      sv: [/intyg från tillverkaren krävs inte automatiskt/i, /tar inte bort listeria/i],
      th: [/ไม่ต้องขอหนังสือรับรองจากผู้ผลิตโดยอัตโนมัติ/, /ไม่กำจัดเชื้อลิสทีเรีย/],
    },
  },
  "muikunmati-rieskarullat": {
    rawUse: {
      fi: [/syöntivalmista pakastettua muikunmätiä/i, /älä tarjoa mätiä kuumentamatta/i],
      en: [/frozen ready-to-eat vendace roe/i, /do not serve unheated/i],
      sv: [/fryst ätfärdig siklöjerom/i, /inte serveras oupphettad/i],
      th: [/ไข่ปลาวองเดซแช่แข็งพร้อมรับประทาน/, /ห้ามเสิร์ฟไข่ปลาโดยไม่ผ่านความร้อน/],
    },
    listeria: {
      fi: [/valmistajakirjettä ei automaattisesti vaadita/i, /ei tuhoa listeriaa/i],
      en: [/manufacturer letter is not automatically required/i, /does not eliminate listeria/i],
      sv: [/tillverkarintyg krävs inte automatiskt/i, /tar inte bort listeria/i],
      th: [/ไม่จำเป็นต้องมีจดหมายรับรองจากผู้ผลิตทุกครั้ง/, /ไม่ฆ่าลิสทีเรีย/],
    },
  },
};

const afterTemperatureReached: Record<Language, RegExp> = {
  fi: /Aika alkaa vasta, kun vaadittu lämpötila on saavutettu|laskettuna vaaditun lämpötilan saavuttamisesta/,
  en: /counted after the required temperature is reached/,
  sv: /räknat efter att temperaturen uppnåtts/,
  th: /หลังจากถึงอุณหภูมิที่กำหนด|เมื่อถึงอุณหภูมิที่กำหนด/,
};

test("Chat-4 fish and roe remain drafts with critical cold-use rules in all four languages", () => {
  assert.equal(Object.keys(rules).length, 2);
  let verified = 0;
  for (const [id, rule] of Object.entries(rules)) {
    for (const lang of languages) {
      const path = lang === "fi"
        ? "reseptit/alkuruoat/" + id + ".md"
        : "kaannokset/" + lang + "/alkuruoat/" + id + ".md";
      const raw = readFileSync(new URL("../../" + path, import.meta.url), "utf8");
      const parsed = parseMarkdown(raw);
      assert.ok(parsed, path + ": parsable markdown");
      const data = recipeFrontmatterSchema.parse(parsed.data);
      assert.equal(data.recipe_id, id);
      assert.equal(data.status, "draft", path + ": no implicit approval");
      const first = raw.match(/^1\. (.+)$/m)?.[1];
      assert.ok(first, path + ": first preparation step");
      for (const pattern of rule.rawUse[lang]) {
        assert.match(first, pattern, path + ": raw-use and fail-closed serving instructions");
      }
      // These are already documented Finnish Food Authority handling
      // alternatives. Keep each temperature paired with its duration.
      assert.match(first, /−20\s*°?C[\s\S]*?24/, path + ": -20 C / 24 h");
      assert.match(first, /−35\s*°?C[\s\S]*?15/, path + ": -35 C / 15 h");
      assert.match(first, /−18\s*°?C[\s\S]*?96/, path + ": -18 C / 96 h");
      assert.match(first, afterTemperatureReached[lang], path + ": full holding time starts at temperature");
      const safety = lang === "fi"
        ? raw.match(/^- \*\*Ruokaturva:\*\* (.+)$/m)?.[1]
        : raw.split("## " + heading[lang] + "\n\n")[1]?.split(/\n## /, 1)[0];
      assert.ok(safety, path + ": safety statement");
      for (const pattern of rule.listeria[lang]) {
        assert.match(safety, pattern, path + ": keep listeria advice without automatic manufacturer letters");
      }
      verified++;
    }
  }
  assert.equal(verified, 8);
});

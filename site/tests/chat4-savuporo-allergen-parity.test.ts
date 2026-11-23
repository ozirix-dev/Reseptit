import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("Chat-4 smoked reindeer translations retain Finnish packaging-allergen warning", () => {
  const id = "savupororullat-kantarelleilla";
  const source = readFileSync(new URL("../../reseptit/alkuruoat/" + id + ".md", import.meta.url), "utf8");
  assert.match(source, /tuotepakkausten allergeenit tarkistettava/);
  const terms: Record<string, RegExp> = {
    en: /Check the product packaging for allergens\./,
    sv: /Kontrollera allergenerna på produktförpackningarna\./,
    th: /ตรวจสอบข้อมูลสารก่อภูมิแพ้บนฉลากบรรจุภัณฑ์ของผลิตภัณฑ์/,
  };
  for (const [lang, pattern] of Object.entries(terms)) {
    const raw = readFileSync(new URL("../../kaannokset/" + lang + "/alkuruoat/" + id + ".md", import.meta.url), "utf8");
    assert.match(raw, /^status: draft$/m);
    const heading = lang === "en" ? "Safety notes" : lang === "sv" ? "Livsmedelssäkerhet" : "ข้อควรระวังด้านความปลอดภัย";
    const safety = raw.split("## " + heading + "\n\n")[1]?.split("\n## ")[0];
    assert.ok(safety, lang + ": safety section missing");
    assert.match(safety, pattern, lang + ": packaging allergen warning missing");
  }
});

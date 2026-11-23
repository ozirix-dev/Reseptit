import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("Chat-4 chanterelle tarts: refrigerate egg-and-dairy pies, not only leftovers", () => {
  const id = "pienet-kantarellipiiraat";
  const fi = readFileSync(new URL("../../reseptit/alkuruoat/" + id + ".md", import.meta.url), "utf8");
  assert.match(fi, /säilytä munaa ja maitotuotteita sisältävät piirakat kylmässä/i);
  const patterns: Record<string, RegExp> = {
    en: /Keep the pies containing eggs and dairy products refrigerated, including any leftovers\./,
    sv: /Förvara pajerna som innehåller ägg och mjölkprodukter i kylskåp, även eventuella rester\./,
    th: /เก็บพายที่มีไข่และผลิตภัณฑ์นมไว้ในตู้เย็น รวมถึงส่วนที่เหลือ/,
  };
  const headings: Record<string, string> = { en: "Safety notes", sv: "Livsmedelssäkerhet", th: "ข้อควรระวังด้านความปลอดภัย" };
  for(const [lang,pattern] of Object.entries(patterns)){
    const file = readFileSync(new URL("../../kaannokset/" + lang + "/alkuruoat/" + id + ".md", import.meta.url), "utf8");
    assert.match(file,/^status: draft$/m);
    const safety = file.split("## " + headings[lang] + "\n\n")[1]?.split("\n## ")[0];
    assert.ok(safety, lang + ": safety notes missing");
    assert.match(safety, pattern, lang + ": all pies must be kept refrigerated");
  }
});

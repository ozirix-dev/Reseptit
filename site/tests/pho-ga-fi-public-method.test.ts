import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { applyCopyEdits, reviewedRecipeCopy } from "../scripts/public-recipe-copy-r2";

const root = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
const id = "vietnamilainen-pho-ga-aamuksi";
const sources = {
  fi: ["reseptit/aamupalat/" + id + ".md", "6f95d3d742d5b035939531efaefa56448edcf4b2"],
  en: ["kaannokset/en/aamupalat/" + id + ".md", "8fb6685dd20e9824d30b596a2122a7a72f82a292"],
  sv: ["kaannokset/sv/aamupalat/" + id + ".md", "a95f9a43e7223089ede5b84c29e7c2a3a9a6db8a"],
  th: ["kaannokset/th/aamupalat/" + id + ".md", "d8cb9d05941a934106543f43a3b37929951f54fc"],
} as const;

function read(locale: keyof typeof sources) {
  const [file, expected] = sources[locale];
  const raw = readFileSync(path.join(root, file), "utf8");
  const actual = createHash("sha1").update("blob " + Buffer.byteLength(raw) + "\0" + raw).digest("hex");
  assert.equal(actual, expected, locale + " protected source changed");
  return raw;
}
function method(raw: string, locale: keyof typeof sources) {
  const heading = {fi: "Valmistus", en: "Preparation", sv: "Tillagning", th: "วิธีทำ"}[locale];
  const section = raw.split("\n## " + heading + "\n")[1];
  assert.ok(section, "missing preparation: " + locale);
  return section.split("\n## ")[0].trim();
}
test("#404 FI pho ga replaces generic oil/stock steps with safe measured method", () => {
  const raw = read("fi");
  const edits = reviewedRecipeCopy(id, "fi")?.method;
  assert.ok(edits?.length === 1);
  const before = method(raw, "fi");
  assert.match(before, /öljy tai liemi/);
  const after = applyCopyEdits(before, edits);
  assert.notEqual(after, before);
  assert.doesNotMatch(after, /Kuumenna kattilassa öljy tai liemi|lehtivihannekset|Kaada kattilaan liemi/);
  for (const value of ["700 ml vettä", "2 g tuoretta inkivääriä", "1 g tähtianista", "150 g raakaa nahatonta broilerin rintafileetä", "75 °C", "100 g kuivia riisinuudeleita"]) {
    assert.ok(after.includes(value), "missing quantity or safety requirement " + value);
  }
  assert.match(after, /Pese raakaan kanaan koskeneet välineet/);
  assert.equal((after.match(/^\d+\./gm) ?? []).length, 4);
  assert.match(raw, /carbs_net_per_serving_g: 40\.87/);
  assert.equal(applyCopyEdits("unrelated instructions", edits), "unrelated instructions");
});
test("#404 pho ga translated methods remain unchanged and require 75 degrees", () => {
  for (const locale of ["en", "sv", "th"] as const) {
    assert.match(method(read(locale), locale), /75 °C/);
    assert.equal(reviewedRecipeCopy(id, locale)?.method, undefined);
  }
});

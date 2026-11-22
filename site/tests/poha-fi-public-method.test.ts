import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { applyCopyEdits, reviewedRecipeCopy } from "../scripts/public-recipe-copy-r2";

const root = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
const id = "indialainen-poha-maapahkinoilla";
const sources = {
  fi: ["reseptit/aamupalat/" + id + ".md", "f8b9cf8a82c6c0a04a1a3cdbc76f2599cb4f6258"],
  en: ["kaannokset/en/aamupalat/" + id + ".md", "8660c9caf928ca047d86035034e59f0a31b82f29"],
  sv: ["kaannokset/sv/aamupalat/" + id + ".md", "70f0c197276ced4a7e07a8783b8bd9f48a7b947b"],
  th: ["kaannokset/th/aamupalat/" + id + ".md", "5815a2534d47ed1cd1de3c3dacaebdae602093c2"],
} as const;
function read(locale: keyof typeof sources) {
  const [file, expected] = sources[locale];
  const raw = readFileSync(path.join(root, file), "utf8");
  const sha = createHash("sha1").update("blob " + Buffer.byteLength(raw) + "\0" + raw).digest("hex");
  assert.equal(sha, expected, locale + " original recipe changed");
  return raw;
}
function preparation(raw: string, locale: keyof typeof sources) {
  const heading = { fi: "Valmistus", en: "Instructions", sv: "Gör så här", th: "วิธีทำ" }[locale];
  const section = raw.split("\n## " + heading + "\n")[1];
  assert.ok(section, "preparation section missing: " + locale);
  return section.split("\n## ")[0].trim();
}
test("#404 poha FI replaces incorrect patty batter with complete four-step rice flake method", () => {
  const raw = read("fi");
  const edits = reviewedRecipeCopy(id, "fi")?.method;
  assert.ok(edits?.length === 1);
  const before = preparation(raw, "fi");
  assert.match(before, /Muotoile pieniksi pihveiksi/);
  const after = applyCopyEdits(before, edits);
  assert.notEqual(after, before, "exact public copy overlay must apply");
  assert.doesNotMatch(after, /taikina|pihveiksi|Raasta, muussaa/i);
  for (const amount of ["100 g riisihiutaleita", "20 g maapähkinöitä", "3 g currylehtiä", "50 g herneitä", "1 rkl neutraalia paistoöljyä", "1 rkl:lla hienonnettua tuoretta korianteria", "1 rkl:lla sitruunamehua"]) {
    assert.ok(after.includes(amount), "missing ingredient amount: " + amount);
  }
  assert.equal((after.match(/^\d+\./gm) ?? []).length, 4);
  assert.match(raw, /carbs_net_per_serving_g: 43\.06/);
  assert.equal(applyCopyEdits("unrelated method", edits), "unrelated method");
});
test("#404 poha EN/SV/TH contain specific matching methods and are not rewritten", () => {
  assert.match(preparation(read("en"), "en"), /100 g rice flakes/);
  assert.match(preparation(read("sv"), "sv"), /100 g risflingor/);
  assert.match(preparation(read("th"), "th"), /100 กรัม/);
  for (const locale of ["en", "sv", "th"] as const) {
    assert.equal(reviewedRecipeCopy(id, locale)?.method, undefined);
  }
});

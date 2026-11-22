import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { applyCopyEdits, reviewedRecipeCopy } from "../scripts/public-recipe-copy-r2";

const root = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
const id = "lahi-ita-labneh-kulho-zaatarilla";
const sources = {
  fi: ["reseptit/aamupalat/" + id + ".md", "c9651cac25fa6fd639ad08892cdd2f3aa5355978"],
  en: ["kaannokset/en/aamupalat/" + id + ".md", "6f72c021b68c0629da98a1ddda5bdc04c180cd3e"],
  sv: ["kaannokset/sv/aamupalat/" + id + ".md", "338dc988ae7514e587687f9a8465b645e3355d44"],
  th: ["kaannokset/th/aamupalat/" + id + ".md", "02f48b3626e4c176a24d387a0514032a00da10ee"],
} as const;
function read(locale: keyof typeof sources) {
  const [file, expected] = sources[locale];
  const raw = readFileSync(path.join(root, file), "utf8");
  const sha = createHash("sha1").update("blob " + Buffer.byteLength(raw) + "\0" + raw).digest("hex");
  assert.equal(sha, expected, locale + " protected source changed");
  return raw;
}
function method(raw: string, locale: keyof typeof sources) {
  const heading = {fi: "Valmistus", en: "Preparation", sv: "Tillagning", th: "วิธีทำ"}[locale];
  const section = raw.split("\n## " + heading + "\n")[1];
  assert.ok(section, "method missing: " + locale);
  return section.split("\n## ")[0].trim();
}
test("#404 FI labneh removes erroneous cooked fillings and unlisted oil", () => {
  const fi = read("fi");
  const edits = reviewedRecipeCopy(id, "fi")?.method;
  assert.ok(edits?.length === 1);
  const before = method(fi, "fi");
  assert.match(before, /Paista tofu, muna/);
  const after = applyCopyEdits(before, edits);
  assert.notEqual(after, before);
  assert.doesNotMatch(after, /Paista tofu, muna|Jaa lämmin pohja|pyöräytä päälle oliiviöljyä/);
  assert.match(after, /100 g valmista labnehia/);
  assert.match(after, /150 g syöntivalmiita oliiveja/);
  assert.match(after, /yksi kurkku/);
  assert.match(after, /1 tl za’ataria/);
  assert.match(after, /Älä lisää oliiviöljyä/);
  assert.equal((after.match(/^\d+\./gm) ?? []).length, 4);
  assert.equal(applyCopyEdits("unrelated method", edits), "unrelated method");
});
test("#404 EN SV TH labneh remain source-specific and untouched", () => {
  assert.match(method(read("en"), "en"), /100 g ready-made labneh/);
  assert.match(method(read("sv"), "sv"), /100 g färdig labneh/);
  assert.match(method(read("th"), "th"), /100 กรัม/);
  for (const locale of ["en", "sv", "th"] as const)
    assert.equal(reviewedRecipeCopy(id, locale)?.method, undefined);
});

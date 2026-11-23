import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { applyCopyEdits, reviewedRecipeCopy } from "../scripts/public-recipe-copy-r2";

const root = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
const id = "intialainen-mannasuurimoupma";
const sources = {
  fi: ["reseptit/aamupalat/" + id + ".md", "4f527aa3f3b7264dd1ae05dd5d905bc84ba26e42"],
  en: ["kaannokset/en/aamupalat/" + id + ".md", "6cda3d849ae3f5cf848b1af1240b9dddac854cc0"],
  sv: ["kaannokset/sv/aamupalat/" + id + ".md", "229c565ba990b75eebcad71b114b5521910167da"],
  th: ["kaannokset/th/aamupalat/" + id + ".md", "c59911293853000588406d66b17174f7fad78951"],
} as const;
function read(locale: keyof typeof sources) {
  const [file, expected] = sources[locale];
  const raw = readFileSync(path.join(root, file), "utf8");
  const sha = createHash("sha1").update("blob " + Buffer.byteLength(raw) + "\0" + raw).digest("hex");
  assert.equal(sha, expected, locale + " protected source changed");
  return raw;
}
function method(raw: string, locale: keyof typeof sources) {
  const heading = { fi: "Valmistus", en: "Preparation", sv: "Tillagning", th: "วิธีทำ" }[locale];
  const section = raw.split("\n## " + heading + "\n")[1];
  assert.ok(section, "missing method for " + locale);
  return section.split("\n## ")[0].trim();
}
test("#404 upma FI removes meat and unlisted sides and uses listed ingredient quantities", () => {
  const raw = read("fi"), patch = reviewedRecipeCopy(id, "fi");
  assert.ok(patch?.method?.length === 1);
  const before = method(raw, "fi"), after = applyCopyEdits(before, patch.method);
  assert.notEqual(after, before);
  assert.match(before, /Kypsennä liha/);
  assert.doesNotMatch(after, /Kypsennä liha|Tarjoa lämpimänä kookoschutneyn/);
  for (const amount of ["100 g vehnämannasuurimoita", "150 g herneitä", "5 g tuoreita currylehtiä", "300 ml vettä", "yksi porkkana"]) {
    assert.ok(after.includes(amount), "missing ingredient: " + amount);
  }
  assert.match(after, /ilman lihaa, kookoschutneyta, jogurttia/);
  assert.equal((after.match(/^\d+\./gm) ?? []).length, 4);
  assert.match(raw, /carbs_net_per_serving_g: 40\.59/);
  assert.equal(applyCopyEdits("other recipe", patch.method), "other recipe");
});
test("#404 upma unchanged EN/SV/TH source methods match dry-toasted semolina", () => {
  assert.match(method(read("en"), "en"), /100 g semolina/);
  assert.match(method(read("sv"), "sv"), /100 g mannagryn/);
  assert.match(method(read("th"), "th"), /100 กรัม/);
  for (const lang of ["en", "sv", "th"] as const) {
    assert.equal(reviewedRecipeCopy(id, lang)?.method, undefined);
  }
});

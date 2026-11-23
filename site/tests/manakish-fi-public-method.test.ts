import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { applyCopyEdits, reviewedRecipeCopy } from "../scripts/public-recipe-copy-r2";

const root = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
const id = "lahi-ita-manakish-zaatarilla";
const sources = {
  fi: ["reseptit/aamupalat/" + id + ".md", "1369126b90bafbe09c07aaf503ae2c69c886b8e4"],
  en: ["kaannokset/en/aamupalat/" + id + ".md", "3a92c8014ea7df56e9bacddb209981375f6097dd"],
  sv: ["kaannokset/sv/aamupalat/" + id + ".md", "bb8b46e4a452616627239ff08a8ec9d7c634059b"],
  th: ["kaannokset/th/aamupalat/" + id + ".md", "35bc174f2a465c766af99ecf46c4dc2c370001c3"],
} as const;
function read(locale: keyof typeof sources): string {
  const [rel, sha] = sources[locale];
  const raw = readFileSync(path.join(root, rel), "utf8");
  const hash = createHash("sha1").update("blob " + Buffer.byteLength(raw) + "\0" + raw).digest("hex");
  assert.equal(hash, sha, locale + " protected recipe changed");
  return raw;
}
function preparation(raw: string): string {
  const match = raw.match(/\n## (?:Valmistus|Preparation|Tillagning|วิธีทำ)\n([\s\S]*?)(?:\n## |$)/);
  assert.ok(match);
  return match[1].trim();
}
test("#327 FI manakish contains actual dough and zaatar-style surface method", () => {
  const raw = read("fi");
  const patch = reviewedRecipeCopy(id, "fi");
  assert.ok(patch?.method?.length === 1);
  const before = preparation(raw), after = applyCopyEdits(before, patch.method);
  assert.notEqual(after, before);
  assert.doesNotMatch(after, /Jos reseptissä on valmis leipä|siirry täyttöön|mausteöljy\./);
  assert.match(after, /150 g vehnäjauhoja/);
  assert.match(after, /100 g jogurttia/);
  assert.match(after, /40 ml vettä/);
  assert.match(after, /5 minuuttia/);
  assert.match(after, /1 rkl oliiviöljyä/);
  assert.match(after, /2 g kuivattua timjamia/);
  assert.match(after, /3 g seesaminsiemeniä/);
  assert.match(after, /1 rkl neutraalia paistoöljyä/);
  assert.match(after, /kahteen osaan/);
  assert.match(after, /raakaa jauhoista taikinaa/);
  assert.equal((after.match(/^\d+\./gm) ?? []).length, 4);
  assert.match(patch.description ?? "", /pannuleivät/);
  assert.match(raw, /carbs_net_per_serving_g: 57\.49/);
});
test("#327 manakish EN/SV/TH published preparation remains source-specific", () => {
  assert.match(preparation(read("en")), /150 g wheat flour/);
  assert.match(preparation(read("sv")), /150 g vetemjöl/);
  assert.match(preparation(read("th")), /150 กรัม/);
  for (const locale of ["en", "sv", "th"] as const)
    assert.equal(reviewedRecipeCopy(id, locale)?.method, undefined);
});
test("#327 manakish exact-method patch does not change other recipes", () => {
  const patch = reviewedRecipeCopy(id, "fi")!.method!;
  assert.equal(applyCopyEdits("another recipe", patch), "another recipe");
  assert.doesNotMatch(applyCopyEdits(preparation(read("fi")), patch), /siirry täyttöön/);
});

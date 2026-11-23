import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { applyCopyEdits, reviewedRecipeCopy } from "../scripts/public-recipe-copy-r2";

const root = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
const id = "valimerellinen-halloumi-tomaattileipa";
const sources = {
  fi: ["reseptit/aamupalat/" + id + ".md", "253f6853afd71b5ffe17d338e45778bcbf0b1343"],
  en: ["kaannokset/en/aamupalat/" + id + ".md", "6814255fe609d47cdfd819dd1bb922b4abb2b13b"],
  sv: ["kaannokset/sv/aamupalat/" + id + ".md", "b228fc13fe62e07d03d53ed7b093747e06386091"],
  th: ["kaannokset/th/aamupalat/" + id + ".md", "18f90d9a3dc8520703fae0bb531180bb2ca5d7d9"],
} as const;

function blobSha(content: string) {
  return createHash("sha1").update("blob " + Buffer.byteLength(content) + "\0" + content).digest("hex");
}
function read(locale: keyof typeof sources): string {
  const [relative, sha] = sources[locale];
  const raw = readFileSync(path.join(root, relative), "utf8");
  assert.equal(blobSha(raw), sha, "protected source changed: " + locale);
  return raw;
}
function method(raw: string) {
  const section = raw.split(/\n## (?:Valmistus|Preparation|Tillagning|วิธีทำ)\n/)[1];
  assert.ok(section, "preparation heading missing");
  return section.split(/\n## /)[0].trim();
}

test("#327 halloumi FI display removes false dough operations without changing source", () => {
  const fi = read("fi");
  const approved = reviewedRecipeCopy(id, "fi");
  assert.ok(approved?.method && approved.method.length === 1);
  const before = method(fi);
  assert.match(before, /Vaivaa pehmeäksi taikinaksi/);
  const after = applyCopyEdits(before, approved.method);
  assert.notEqual(after, before, "overlay did not apply");
  assert.doesNotMatch(after, /vaivaa|kauli|taikina|jauhot/i);
  assert.match(after, /150 g halloumia/);
  assert.match(after, /100 g tomaattia/);
  assert.match(after, /25 g vihreitä oliiveja/);
  assert.match(after, /100 g valmista hapanjuurileipää/);
  assert.match(after, /1 rkl neutraalia paistoöljyä/);
  assert.match(after, /kahdelle lautaselle/);
  assert.equal((after.match(/^\d+\./gm) ?? []).length, 4);
  assert.match(approved.description ?? "", /Paahdettua hapanjuurileipää/);
  assert.equal((fi.match(/carbs_net_per_serving_g: 27\.58/) ?? []).length, 1);
});

test("#327 halloumi existing EN/SV/TH are already source-specific and unchanged", () => {
  const en = read("en"), sv = read("sv"), th = read("th");
  assert.match(method(en), /100 g ready-baked sourdough bread/);
  assert.match(method(sv), /100 g färdigbakat surdegsbröd/);
  assert.match(method(th), /ขนมปังซาวร์โด/);
  for (const locale of ["en", "sv", "th"] as const) {
    assert.equal(reviewedRecipeCopy(id, locale)?.method, undefined, locale + " should not be rewritten");
  }
});

test("#327 halloumi edit requires exact previous method, not an unrelated text", () => {
  const { method: edits } = reviewedRecipeCopy(id, "fi")!;
  assert.ok(edits);
  const source = method(read("fi"));
  assert.equal(applyCopyEdits(source, edits).includes("Vaivaa"), false);
  assert.equal(applyCopyEdits("unrelated recipe instructions", edits), "unrelated recipe instructions");
});

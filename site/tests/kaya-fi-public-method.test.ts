import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { applyCopyEdits, reviewedRecipeCopy } from "../scripts/public-recipe-copy-r2";

const root = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
const id = "malesialainen-kaya-paahtoleipa";
const sources = {
  fi: ["reseptit/aamupalat/" + id + ".md", "04d0be9051dd41645e08345990078260e374f6ca"],
  en: ["kaannokset/en/aamupalat/" + id + ".md", "f602240ca41365fa747b7621a1780c0b7da6e6ca"],
  sv: ["kaannokset/sv/aamupalat/" + id + ".md", "74c1a0c65afb0491b8124f17d1b395c62d27465d"],
  th: ["kaannokset/th/aamupalat/" + id + ".md", "c300d2341d6dd497819d03d6e53cff3081cff220"],
} as const;

function read(locale: keyof typeof sources): string {
  const [rel, sha] = sources[locale];
  const raw = readFileSync(path.join(root, rel), "utf8");
  const digest = createHash("sha1").update("blob " + Buffer.byteLength(raw) + "\0" + raw).digest("hex");
  assert.equal(digest, sha, "protected source changed: " + locale);
  return raw;
}
function preparation(raw: string): string {
  const match = raw.match(/\n## (?:Valmistus|Preparation|Tillagning|วิธีทำ)\n([\s\S]*?)(?:\n## |$)/);
  assert.ok(match);
  return match[1].trim();
}

test("#327 FI kaya toast replaces false bread dough method with source-backed egg method", () => {
  const raw = read("fi");
  const patch = reviewedRecipeCopy(id, "fi");
  assert.ok(patch?.method?.length === 1);
  const before = preparation(raw);
  assert.match(before, /Vaivaa pehmeäksi taikinaksi/);
  const after = applyCopyEdits(before, patch.method);
  assert.notEqual(after, before);
  assert.doesNotMatch(after, /vaivaa|kauli|taikina|jauhot/i);
  assert.match(after, /100 ml kookosmaitoa/);
  assert.match(after, /20 g sokeria/);
  assert.match(after, /kahdesta kananmunasta/);
  assert.match(after, /71 °C:seen/);
  assert.match(after, /100 g valmista hapanjuurileipää/);
  assert.match(after, /10 g voita/);
  assert.match(after, /1 rkl:ssa neutraalia paistoöljyä/);
  assert.match(after, /sekä valkuainen että keltuainen ovat hyytyneet/);
  assert.equal((after.match(/^\d+\./gm) ?? []).length, 4);
  assert.equal(read("fi").includes("carbs_net_per_serving_g: 36.59"), true);
  assert.match(patch.description ?? "", /kaya-tahna/);
});

test("#327 EN/SV/TH kaya translations are already specific and untouched", () => {
  assert.match(preparation(read("en")), /71 °C/);
  assert.match(preparation(read("sv")), /71 °C/);
  assert.match(preparation(read("th")), /71 °C/);
  for (const locale of ["en", "sv", "th"] as const)
    assert.equal(reviewedRecipeCopy(id, locale)?.method, undefined);
});

test("#327 kaya replacement only applies to the precise historical method", () => {
  const edits = reviewedRecipeCopy(id, "fi")!.method!;
  assert.equal(applyCopyEdits("unrelated instructions", edits), "unrelated instructions");
  assert.doesNotMatch(applyCopyEdits(preparation(read("fi")), edits), /Vaivaa pehmeäksi taikinaksi/);
});

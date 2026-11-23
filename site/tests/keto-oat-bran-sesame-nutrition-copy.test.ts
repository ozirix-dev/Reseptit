import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { applyCopyEdits, reviewedRecipeCopy } from "../scripts/public-recipe-copy-r2";

const root = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
const id = "keto-kauralesesampylat";
const sources = {
  fi: ["reseptit/leivonnaiset/keto-kauralesesampylat.md", "4bdb99d71b4b1ea860b73b94762de9a1e833e2fd"],
  en: ["kaannokset/en/leivonnaiset/keto-kauralesesampylat.md", "cd98a3cbf9fe7271234250b567ca0acb2cafedbb"],
  sv: ["kaannokset/sv/leivonnaiset/keto-kauralesesampylat.md", "eedec5f11dacc3807b8c8de0d731902162dc1cb5"],
  th: ["kaannokset/th/leivonnaiset/keto-kauralesesampylat.md", "b6580f0adf72ecf7c03ae7e2c0e2a6e24e83d1f9"],
} as const;

function read(locale: keyof typeof sources) {
  const [file, expected] = sources[locale];
  const raw = readFileSync(path.join(root, file), "utf8");
  const sha = createHash("sha1").update("blob " + Buffer.byteLength(raw) + "\0" + raw).digest("hex");
  assert.equal(sha, expected, locale + " source must remain unchanged");
  return raw;
}
function preparation(raw: string) {
  const marker = raw.match(/\n## (?:Valmistus|Preparation|Gör så här|วิธีทำ)\n/);
  assert.ok(marker, "missing method heading");
  return raw.slice(marker.index! + marker[0].length).split(/\n## /)[0].trim();
}

test("#327 four language sesame copy states the nutrition-included 8 g", () => {
  for (const locale of ["fi", "en", "sv", "th"] as const) {
    const raw = read(locale);
    const edits = reviewedRecipeCopy(id, locale)?.method;
    assert.ok(edits?.length === 1, locale + " requires one exact copy edit");
    const before = preparation(raw);
    const after = applyCopyEdits(before, edits);
    assert.notEqual(after, before, locale + " edit must apply");
    assert.match(after, /8 (?:g|กรัม)/, locale);
    assert.equal((after.match(/^\d+\./gm) ?? []).length, 7, locale + " steps preserved");
    assert.match(raw, /time_total_min: null/, locale + " cooling time stays unknown");
    assert.match(raw, /carbs_net_per_serving_g: 3\.19/, locale + " macros unchanged");
    assert.equal(applyCopyEdits("unrelated recipe", edits), "unrelated recipe");
  }
});
test("#327 omitting sesame is explicitly outside the published nutrition estimate", () => {
  assert.match(applyCopyEdits(preparation(read("fi")), reviewedRecipeCopy(id, "fi")!.method!), /Jos jätät seesamin pois/);
  assert.match(applyCopyEdits(preparation(read("en")), reviewedRecipeCopy(id, "en")!.method!), /If you omit the sesame seeds/);
  assert.match(applyCopyEdits(preparation(read("sv")), reviewedRecipeCopy(id, "sv")!.method!), /Om du utelämnar sesamfröna/);
  assert.match(applyCopyEdits(preparation(read("th")), reviewedRecipeCopy(id, "th")!.method!), /หากไม่ใส่เมล็ดงา/);
});

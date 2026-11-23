import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";

const ids = [
  "suolasienisalaatti-sipulilla", "lasimestarin-silli",
  "uunissa-paistetut-silakkarullat", "savupororullat-kantarelleilla",
  "pienet-kantarellipiiraat", "punajuuricarpaccio-vuohenjuustolla",
  "sillikaviaari-ruisnapeilla", "nokkosletut-puolukoilla",
] as const;

const notes = {
  en: ["versioned in Git", "AI illustration", "still a draft"],
  sv: ["versionshanterad i Git", "AI-illustration", "fortfarande ett utkast"],
  th: ["ควบคุมเวอร์ชัน Git", "สร้างด้วย AI", "ฉบับแปลยังเป็นร่าง"],
} as const;

test("24 appetizer translations describe Git-tracked AI images, retain draft status", () => {
  let checked = 0;
  for (const id of ids) {
    for (const locale of ["en", "sv", "th"] as const) {
      const path = "kaannokset/" + locale + "/alkuruoat/" + id + ".md";
      const raw = readFileSync(new URL("../../" + path, import.meta.url), "utf8");
      const parsed = parseMarkdown(raw);
      assert.ok(parsed, path + ": parsed markdown");
      const data = recipeFrontmatterSchema.parse(parsed.data);
      assert.equal(data.status, "draft", path);
      assert.equal(data.translation_of, id, path);
      assert.ok(!raw.includes("Git Draft branch"), path);
      assert.ok(!raw.includes("Git Draft-gren"), path);
      assert.ok(!raw.includes("สาขา Git Draft"), path);
      for (const value of notes[locale]) assert.ok(raw.includes(value), path + ": " + value);
      checked++;
    }
  }
  assert.equal(checked, 24);
});

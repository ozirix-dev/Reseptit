import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { beforeReviewedLocalePrecision } from "./history/reviewed-locale-precision";

const root = path.resolve(import.meta.dirname, "../..");
const thaiTitle = "ผัดกะเพราหมูสับ (ใช้ใบโหระพาแทนใบกะเพรา) กับข้าวกะหล่ำดอก";
const priorThaiTitle = "ผัดกระเพรา – เนื้อสับกระเพรากับข้าวดอกกะหล่ำ";
const cases = [
  ["kaannokset/en/leivonnaiset/karjalanpiirakat-riisipuurolla.md", [['difficulty: "easy"', 'difficulty: "Advanced"']]],
  ["kaannokset/sv/leivonnaiset/karjalanpiirakat-riisipuurolla.md", [['difficulty: "lätt"', 'difficulty: "Avancerad"']]],
  ["kaannokset/th/leivonnaiset/karjalanpiirakat-riisipuurolla.md", [['difficulty: "ง่าย"', 'difficulty: "ยาก"']]],
  ["kaannokset/th/paaruoat/pad-kra-pao-vhh.md", [
    ["title: " + priorThaiTitle, "title: " + thaiTitle],
    ["# " + priorThaiTitle, "# " + thaiTitle],
  ]],
] as const;

test("#1001 accepts only the four pinned translation successors for historical checks", () => {
  for (const [file, replacements] of cases) {
    const current = readFileSync(path.join(root, file), "utf8").replaceAll("\r\n", "\n");
    const historical = beforeReviewedLocalePrecision(root, file, current);
    const lines = historical.split("\n");
    for (const [prior, reviewed] of replacements) {
      const index = lines.indexOf(prior);
      assert.ok(index >= 0 && lines.lastIndexOf(prior) === index, file);
      lines[index] = reviewed;
    }
    assert.equal(lines.join("\n"), current, file);
    assert.throws(() => beforeReviewedLocalePrecision(root, file, current + "\nExtra note.\n"),
      /unreviewed #1001 translation mutation/, file);
    assert.throws(() => beforeReviewedLocalePrecision(root, file, historical),
      /unreviewed #1001 translation mutation/, file);
    assert.equal(beforeReviewedLocalePrecision(root, file + ".other", current), current, file);
  }
});

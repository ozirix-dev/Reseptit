import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("Chat-4 vendace roe draft: Thai red onion parity preserves raw-roe safety", () => {
  const id = "muikunmati-rieskarullat";
  const fi = readFileSync(new URL("../../reseptit/alkuruoat/" + id + ".md", import.meta.url), "utf8");
  const th = readFileSync(new URL("../../kaannokset/th/alkuruoat/" + id + ".md", import.meta.url), "utf8");
  assert.match(fi, /amount: 50\s+unit: "g"\s+item: "punasipulia"/);
  assert.match(th, /amount: 50\s+unit: "g"\s+item: "หอมหัวใหญ่สีแดง"/);
  assert.match(th, /^2\. .*หอมหัวใหญ่สีแดง/m);
  assert.doesNotMatch(th, /หอมแดงหัวใหญ่/);
  assert.match(th, /^status: draft$/m);
  assert.match(th, /ห้ามเสิร์ฟไข่ปลาโดยไม่ผ่านความร้อน/);
  assert.match(th, /ไม่ฆ่าลิสทีเรีย/);
});

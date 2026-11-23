import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { parseMarkdown } from "../src/content/markdown";

test("Chat 4 date ketchup TH: garlic clove and soaking-water meaning", () => {
  const fi = parseMarkdown(readFileSync(new URL("../../reseptit/alkuruoat/taateliketsuppi.md", import.meta.url), "utf8"));
  const th = parseMarkdown(readFileSync(new URL("../../kaannokset/th/alkuruoat/taateliketsuppi.md", import.meta.url), "utf8"));
  assert.ok(fi && th);
  assert.equal(th.data.status, "published");
  assert.equal(th.data.recipe_id, "taateliketsuppi");
  assert.equal(th.data.translation_of, "taateliketsuppi");
  const src = fi.data.ingredients as Array<{ amount: number; item: string; note?: string }>;
  const dst = th.data.ingredients as Array<{ amount: number; item: string; note?: string }>;
  assert.equal(dst.length, src.length);
  for (let i = 0; i < src.length; i++) assert.equal(dst[i].amount, src[i].amount);
  const garlic = src.findIndex(x => x.item === "valkosipulinkynsi");
  assert.ok(garlic >= 0);
  assert.equal(dst[garlic].amount, 3);
  assert.match(dst[garlic].item, /กระเทียม.*1 กลีบ/);
  assert.match(dst[garlic].note ?? "", /1 กลีบ/);
  const water = src.findIndex(x => x.item === "vettä");
  assert.ok(water >= 0);
  assert.match(dst[water].note ?? "", /น้ำอีกส่วนหนึ่ง/);
  assert.match(dst[water].note ?? "", /เทน้ำแช่ทิ้ง/);
  assert.match(th.content, /ทิ้งน้ำที่แช่ไว้/);
  assert.doesNotMatch(JSON.stringify(dst), /กานพลูกระเทียม|หนึ่งเล็บ|ทำให้ผอมบาง/);
});

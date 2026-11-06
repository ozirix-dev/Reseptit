import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { parseMarkdown } from "../src/content/markdown";

test("published ackee recipe cannot silently omit its food-safety guard", async () => {
  const filepath = path.resolve(import.meta.dirname, "../../reseptit/aamupalat/karibia-ackee-ja-suolakala.md");
  const parsed = parseMarkdown(await readFile(filepath, "utf8"));
  assert.ok(parsed);
  if (parsed.data.status !== "published") return;

  const ingredients = parsed.data.ingredients as Array<{ item: string; amount: number | null; unit: string }>;
  const ackee = ingredients.find(({ item }) => /ackee/i.test(item));
  assert.ok(ackee, "ackee must be explicitly listed");
  const commerciallyProcessed = /säilyke|tölkitetty|kaupallisesti käsitelty/i.test(ackee.item);
  const safeInstructions = /turvallis|kuumentaminen|kuumennusta|kypsymät/i.test(parsed.content)
    && /FDA: Hypoglycin A and Ackee Fruit/.test(parsed.content);
  assert.ok(safeInstructions, "ackee safety source and handling warning required");

  if (!commerciallyProcessed) {
    assert.match(parsed.content, /Älä valmista tätä ruokalajia näiden keskeneräisten mittojen/i,
      "unverified whole-fruit/quantity recipe must not be presented as cookable");
  }
});

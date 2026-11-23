import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";

const ids = [
  "suolasienisalaatti-sipulilla",
  "lasimestarin-silli",
  "uunissa-paistetut-silakkarullat",
  "savupororullat-kantarelleilla",
  "pienet-kantarellipiiraat",
  "punajuuricarpaccio-vuohenjuustolla",
  "sillikaviaari-ruisnapeilla",
  "nokkosletut-puolukoilla",
] as const;

test("eight published Chat-4 FI appetizers have current public copy and source approval pins", () => {
  for (const id of ids) {
    const recipePath = "reseptit/alkuruoat/" + id + ".md";
    const source = readFileSync(new URL("../../" + recipePath, import.meta.url), "utf8");
    const parsed = parseMarkdown(source);
    assert.ok(parsed, recipePath + ": Markdown exists");
    const data = recipeFrontmatterSchema.parse(parsed.data);
    assert.equal(data.status, "published", id);
    assert.equal(data.language, "fi", id);
    assert.ok(!source.includes("on toimituksellinen suomalainen alkuruokaluonnos"), id);
    assert.ok(!source.includes("Kuva on tarkistettava ennen julkaisua"), id);
    assert.ok(!source.includes("ovat Chat-4:n Draft-haarassa"), id);
    assert.match(source, /Suomenkielinen resepti julkaistu/);
    assert.match(source, /EN\/SV\/TH ovat luonnoksia/);
    const review = JSON.parse(readFileSync(new URL("../../docs/reviews/new-recipes/" + id + ".json", import.meta.url), "utf8"));
    assert.equal(review.recipe_id, id);
    assert.equal(review.source_path, recipePath);
    assert.equal(review.decision, "approved");
    const digest = createHash("sha256").update(source.replaceAll("\r\n", "\n")).digest("hex");
    assert.equal(review.source_sha256, digest, id + ": SHA-256 matches the actual FI source");
  }
});

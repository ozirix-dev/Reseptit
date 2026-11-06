import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { publicGiSourceNote } from "../scripts/gk-source-copy";

test("cross-recipe GI group mean notes are safely described without mutating source records", async () => {
  const location = path.resolve(import.meta.dirname, "../../docs/nutrition/glycemic-index-records.json");
  const data = JSON.parse(await readFile(location, "utf8")) as {
    records: Array<{ id: string; note?: string; gi: number; source: { qualityEvidence: string } }>
  };
  for (const id of [
    "dairy-category-mean-gi-35",
    "fruit-category-mean-gi-51",
    "nuts-category-mean-gi-22",
  ]) {
    const record = data.records.find((item) => item.id === id);
    assert.ok(record, `missing GI source ${id}`);
    const original = structuredClone(record);
    const visibleNote = publicGiSourceNote(record);
    assert.match(visibleNote, /Low-confidence.+(group mean|mean from few observations)/);
    assert.doesNotMatch(visibleNote, /cream cheese|tamarind.paste|peanuts/i);
    assert.deepEqual(record, original, "presentation cannot modify GI evidence");
  }
  const ordinary = { id: "unchanged", note: "Measured food-specific GI", source: { qualityEvidence: "Evidence" } };
  assert.equal(publicGiSourceNote(ordinary), ordinary.note);
});

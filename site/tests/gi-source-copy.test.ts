import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

test("reusable GI category records do not present another ingredient as this recipe's ingredient", async () => {
  const location = path.resolve(import.meta.dirname, "../../docs/nutrition/glycemic-index-records.json");
  const data = JSON.parse(await readFile(location, "utf8")) as {
    records: Array<{ id: string; note?: string; gi: number; matchKind?: string }>
  };
  for (const id of [
    "dairy-category-mean-gi-35",
    "fruit-category-mean-gi-51",
    "nuts-category-mean-gi-22",
  ]) {
    const record = data.records.find((item) => item.id === id);
    assert.ok(record, `missing GI source ${id}`);
    assert.match(record.note ?? "", /Low-confidence.+(group mean|mean from few observations)/);
    assert.doesNotMatch(record.note ?? "", /cream cheese|tamarind.paste|peanuts/i);
    assert.ok(record.gi > 0, "reviewed note must not erase the GI record");
  }
});

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

for (const id of ["lasimestarin-silli", "sillikaviaari-ruisnapeilla"]) {
  test("Chat-4 "+id+": red onion is not shallot in Thai", () => {
    const fi = readFileSync(new URL("../../reseptit/alkuruoat/"+id+".md", import.meta.url), "utf8");
    const en = readFileSync(new URL("../../kaannokset/en/alkuruoat/"+id+".md", import.meta.url), "utf8");
    const sv = readFileSync(new URL("../../kaannokset/sv/alkuruoat/"+id+".md", import.meta.url), "utf8");
    const th = readFileSync(new URL("../../kaannokset/th/alkuruoat/"+id+".md", import.meta.url), "utf8");
    assert.match(fi, /item: "punasipulia"/);
    assert.match(en, /item: "red onion"/);
    assert.match(sv, /item: "rödlök"/);
    assert.match(th, /^status: draft$/m);
    assert.match(th, /item: "หอมหัวใหญ่สีแดง"/);
    assert.match(th, /^2\. .*หอมหัวใหญ่สีแดง/m);
    assert.doesNotMatch(th, /หอมแดงหัวใหญ่/);
  });
}

import test from "node:test";
import assert from "node:assert/strict";
import {normalizeUnit,checkF25} from "./f25-draft-structural-check.mjs";

test("all three languages normalize quantity units without changing amounts",()=>{
 assert.equal(normalizeUnit("en","pcs"),"kpl");
 assert.equal(normalizeUnit("sv","msk"),"rkl");
 assert.equal(normalizeUnit("th","ฟอง"),"kpl");
 assert.equal(normalizeUnit("th","ช้อนชา"),"tl");
 assert.equal(normalizeUnit("en","g"),"g");
});
test("F25 36 draft file structure matches pinned Finnish sources",()=>{
 const r=checkF25();
 assert.deepEqual(r.errors,[]);
 assert.equal(r.sourceCount,12);
 assert.equal(r.files,36);
 assert.equal(r.ingredients,219);
 assert.equal(r.steps,153);
 assert.equal(r.macros,120);
});

import test from "node:test";
import assert from "node:assert/strict";
import { auditSourceLedger, extractRecipe, genericSourceIssues, gitBlobSha } from "./translation-source-preflight.mjs";

test("Git source blob hashing uses the exact bytes", () => {
  assert.equal(gitBlobSha("hello\n"),"ce013625030ba8dba906f756967f9e9ca394464a");
});
test("generic FI templates fail the source-only preparation gate", () => {
  assert.ok(genericSourceIssues("1. Valmistele kulhon ainekset; kypsennä pavut tai proteiini").includes("generic-bowl"));
  assert.ok(genericSourceIssues("1. Sekoita jauhot tai viljat ja muut kuivat ainekset").includes("generic-pancake"));
  assert.deepEqual(genericSourceIssues("1. Sekoita 100 g kaurahiutaleita 500 g veteen. Keitä 10 minuuttia."),[]);
  assert.throws(()=>extractRecipe("# Just a placeholder\n"),/frontmatter/);
});
test("D30 ledger pins all FI raw sources and never authorizes publication",async()=>{
  const out = await auditSourceLedger({ledgerPath:"meta/kaannokset/d30-source-worklist.json"});
  assert.deepEqual(out.errors,[]);
  assert.equal(out.count,30);
  assert.equal(out.needs_review,8);
  assert.equal(out.source_hold,22);
  assert.equal(out.ready_to_publish,false);
  assert.equal(out.translations_created,0);
});

test("F25 ledger SHA-pins all 25 untranslated FI sources and holds release", async () => {
  const out = await auditSourceLedger({ledgerPath:"meta/kaannokset/f25-source-worklist.json"});
  assert.deepEqual(out.errors,[]);
  assert.equal(out.count,25);
  assert.equal(out.needs_review,4);
  assert.equal(out.source_hold,21);
  assert.equal(out.ready_to_publish,false);
  assert.equal(out.translations_created,0);
});

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { c5DraftManifest, verifyC5DraftVersions } from "../scripts/c-five-draft-version-gate";

const root=path.resolve(import.meta.dirname,"../..");
const load=async()=>JSON.parse(await readFile(path.join(root,c5DraftManifest),"utf8"));

test("three complete FI gram-specification drafts remain outside publication",async()=>{
  assert.deepEqual(await verifyC5DraftVersions(root),{
    reviewedDrafts:3,status:"HOLD_DRAFT_ONLY",published:0,approvedMacro:0,approvedGk:0,
  });
});
test("draft manifest cannot turn a proposal into nutrition or GK approval",async()=>{
  const m=await load();
  m.gkApproved=true;
  await assert.rejects(verifyC5DraftVersions(root,m),/DRAFT_GK_NOT_APPROVED/);
  const n=await load();
  n.releaseAuthorized=true;
  await assert.rejects(verifyC5DraftVersions(root,n),/DRAFT_PUBLICATION_NOT_AUTHORIZED/);
  const p=await load();
  p.physicalTrialCompleted=true;
  await assert.rejects(verifyC5DraftVersions(root,p),/DRAFT_NOT_TEST_COOKED/);
});
test("canonical sources and complete draft texts are exact-version-sealed",async()=>{
  const m=await load();
  m.sourceBaseline["kiinalainen-jianbing-munaletty"]="0".repeat(40);
  await assert.rejects(verifyC5DraftVersions(root,m),/ORIGINAL_SOURCE_CHANGED/);
  const d=await load();
  d.variants[0].gitBlobSha1="0".repeat(40);
  await assert.rejects(verifyC5DraftVersions(root,d),/DRAFT_SOURCE_STALE/);
  const q=await load();
  q.variants[1].expectedTerms.push("Not a reviewed ingredient");
  await assert.rejects(verifyC5DraftVersions(root,q),/MISSING_REVIEWED_TERM/);
});

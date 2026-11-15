import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { gitBlobSha1, material15ManifestPath, verifyMaterialFifteen } from "../scripts/material-fifteen-evidence-check";

const root=path.resolve(import.meta.dirname,"../..");
const load=async()=>JSON.parse(await readFile(path.join(root,material15ManifestPath),"utf8"));

test("15 current FI evidence cards are exactly sealed and never imply GI/GK approval",async()=>{
  const result=await verifyMaterialFifteen(root);
  assert.equal(result.checked,15);
  assert.equal(result.quarantine,12);
  assert.equal(result.visible,3);
  assert.equal(new Set(result.ids).size,15);
});

test("changed published ingredient quantities or source SHA fail closed",async()=>{
  const manifest=await load();
  const original=manifest.cases[0];
  manifest.cases[0]={...original,source_git_blob_sha1:"0".repeat(40)};
  await assert.rejects(verifyMaterialFifteen(root,manifest),/SOURCE_STALE/);
  manifest.cases[0]={...original,source_observation:{...original.source_observation,amount:999}};
  await assert.rejects(verifyMaterialFifteen(root,manifest),/OBSERVED_QUANTITY_CHANGED/);
});

test("no caller can turn the evidence HOLD queue into silent approvals",async()=>{
  const manifest=await load();
  manifest.cases[0].approval.nutrition=true;
  await assert.rejects(verifyMaterialFifteen(root,manifest),/cannot authorize release or nutrition approval/);
  const fresh=await load();
  fresh.cases.push(structuredClone(fresh.cases[0]));
  await assert.rejects(verifyMaterialFifteen(root,fresh),/15 evidence decisions are mandatory/);
});

test("Git-style blob digest uses content bytes, not document title",()=>{
  assert.equal(gitBlobSha1("test\n"),"9daeafb9864cf43055ae93beb0afd6c7d144bfa4");
});

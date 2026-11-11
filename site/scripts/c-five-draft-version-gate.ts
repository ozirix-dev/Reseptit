import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const c5DraftManifest = "docs/reviews/2026-11-11-c5-draft-release-manifest.json";
export const shaGitBlob=(raw:string)=>createHash("sha1")
  .update("blob "+Buffer.byteLength(raw,"utf8")+"\0").update(raw).digest("hex");
type Variant = {
  recipeId:string;path:string;gitBlobSha1:string;
  expectedTerms:string[];status:"HOLD";remaining:string[];
};
type Manifest = {
  schemaVersion:1;releaseAuthorized:false;macroApproved:false;gkApproved:false;
  physicalTrialCompleted:false;sourceBaseline:Record<string,string>;variants:Variant[];
};
const expectedIds=[
  "indonesialainen-bakwan-maissifritter",
  "kiinalainen-jianbing-munaletty",
  "meksikolainen-huevos-divorciados",
] as const;

/** Exact reviewed draft docs, not published recipe records. */
export async function verifyC5DraftVersions(root:string, input?:Manifest) {
  const m:Manifest = input ?? JSON.parse(await readFile(path.join(root,c5DraftManifest),"utf8"));
  assert.equal(m.schemaVersion,1);
  assert.equal(m.releaseAuthorized,false,"DRAFT_PUBLICATION_NOT_AUTHORIZED");
  assert.equal(m.macroApproved,false,"DRAFT_MACRO_NOT_APPROVED");
  assert.equal(m.gkApproved,false,"DRAFT_GK_NOT_APPROVED");
  assert.equal(m.physicalTrialCompleted,false,"DRAFT_NOT_TEST_COOKED");
  assert.deepEqual(Object.keys(m.sourceBaseline),[...expectedIds]);
  assert.equal(m.variants.length,3);
  assert.deepEqual(m.variants.map(v=>v.recipeId),[...expectedIds]);
  for(const v of m.variants) {
    assert.equal(v.status,"HOLD");
    assert.ok(v.remaining.length>=3);
    assert.match(v.gitBlobSha1,/^[0-9a-f]{40}$/);
    assert.match(v.path,/^docs\/reviews\/c5-variants\/[a-z0-9-]+\.md$/);
    const source=await readFile(path.join(root,"reseptit/aamupalat",v.recipeId+".md"),"utf8");
    assert.equal(shaGitBlob(source),m.sourceBaseline[v.recipeId],v.recipeId+": ORIGINAL_SOURCE_CHANGED");
    const draft=await readFile(path.join(root,v.path),"utf8");
    assert.equal(shaGitBlob(draft),v.gitBlobSha1,v.recipeId+": DRAFT_SOURCE_STALE");
    assert.match(draft,/Tila: DRAFT \/ EI JULKAISTU \/ EI KOEPAISTETTU/);
    assert.match(draft,/Ravintoarvot: HOLD\. GK: HOLD\./);
    assert.match(draft,/## Valmistusluonnos/);
    assert.match(draft,/## Näyttö- ja hyväksyntäesteet/);
    assert.doesNotMatch(draft,/^status:\s*published\s*$/m);
    for(const term of v.expectedTerms)assert(draft.includes(term),v.recipeId+": MISSING_REVIEWED_TERM:"+term);
  }
  return {reviewedDrafts:3,status:"HOLD_DRAFT_ONLY" as const,published:0,approvedMacro:0,approvedGk:0};
}
const direct=process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(direct)console.log(JSON.stringify(await verifyC5DraftVersions(path.resolve(import.meta.dirname,"../..")),null,2));

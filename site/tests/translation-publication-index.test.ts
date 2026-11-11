import assert from "node:assert/strict";
import { test } from "node:test";
import { assertTranslationSourceIsNotQuarantined, overlayTranslationPublicationIndex } from "../scripts/translation-publication-index";
import { assertF25SourceReleaseAuthorized, f25SourceReleaseGate, f25SourceGatePreflight } from "../scripts/f25-source-release-gate";
import type { TranslationAuditResult } from "../scripts/translation-audit";

const source = () => ({
  path: "reseptit/paaruoat/sample.md",
  data: { recipe_id: "sample", url_slug: "sample", title: "Sample", status: "published",
    language: "fi", category: "paaruoka", ingredients: [{ amount: 100, unit: "g", item: "aine" }],
    servings: 2, tags: [] },
  content: "# Sample",
}) as TranslationAuditResult["publishedSources"][number];
const index = (id = "sample", locales: string[] = ["en", "sv", "th"]) =>
  ({ schemaVersion: 1, sources: [{ recipe_id: id, locales }] });

test("sidecar overlays the audit view but never mutates sealed Finnish source", () => {
  const original = source(), rows = overlayTranslationPublicationIndex([original], index());
  assert.deepEqual(rows[0]?.data.translation_languages, ["en", "sv", "th"]);
  assert.deepEqual(rows[0]?.data.translation_status, { en: "published", sv: "published", th: "published" });
  assert.equal(original.data.translation_status, undefined);
  assert.equal(original.data.translation_languages, undefined);
});

test("legacy sources without index retain existing metadata", () => {
  const original = source();
  assert.equal(overlayTranslationPublicationIndex([original], null)[0], original);
});

test("invalid or duplicated sidecar declarations fail closed", () => {
  assert.throws(() => overlayTranslationPublicationIndex([source()], index("missing")), /MISSING_PUBLISHED_FI/);
  assert.throws(() => overlayTranslationPublicationIndex([source()], {schemaVersion:1,sources:[index().sources[0],index().sources[0]]}), /DUPLICATE_SOURCE/);
  assert.throws(() => overlayTranslationPublicationIndex([source()], index("sample", ["en", "en"])), /DUPLICATE_LOCALE/);
  assert.throws(() => overlayTranslationPublicationIndex([source()], index("sample", ["de"])), /invalid|Invalid|code/i);
  const draft = source(); draft.data.status = "draft";
  assert.throws(() => overlayTranslationPublicationIndex([draft], index()), /MISSING_PUBLISHED_FI/);
});

test("explicit draft source metadata cannot be silently upgraded by the sidecar", () => {
  const original = source();
  original.data.translation_status = { en: "draft" };
  assert.throws(() => overlayTranslationPublicationIndex([original], index("sample", ["en"])), /FI_STATUS_CONFLICT/);
});

test("targeted audits preserve unrelated sources but still reject duplicate index entries", () => {
  const original = source();
  assert.equal(overlayTranslationPublicationIndex([original], index(), new Set(["other"]))[0], original);
  assert.throws(() => overlayTranslationPublicationIndex([original], {schemaVersion:1,sources:[index().sources[0],index().sources[0]]}, new Set(["other"])), /DUPLICATE_SOURCE/);
});


test("quarantined FI cannot gain a translation index entry despite raw published metadata", () => {
  const quarantinedId = "pohjoisafrikkalainen-maakouda";
  const rawPublished = source();
  rawPublished.data.recipe_id = quarantinedId;
  rawPublished.data.url_slug = quarantinedId;
  assert.equal(rawPublished.data.status, "published");
  assert.throws(
    () => overlayTranslationPublicationIndex([rawPublished], index(quarantinedId)),
    /TRANSLATION_QUARANTINED_FI: pohjoisafrikkalainen-maakouda/,
  );
});

test("a standalone published language file cannot bypass the quarantine guard", () => {
  assert.throws(
    () => assertTranslationSourceIsNotQuarantined("indonesialainen-nasi-goreng-aamiaisriisi"),
    /TRANSLATION_QUARANTINED_FI: indonesialainen-nasi-goreng-aamiaisriisi/,
  );
  assert.doesNotThrow(() => assertTranslationSourceIsNotQuarantined("rahka-marjakerroskulho"));
});

test("quarantine index rejection is global, including in a targeted translation audit", () => {
  assert.throws(
    () => overlayTranslationPublicationIndex([source()], index("pohjoisafrikkalainen-maakouda"), new Set(["sample"])),
    /TRANSLATION_QUARANTINED_FI/,
  );
});


test("F25 next15 protected even though their historical FI markdown says published", () => {
  const gate = f25SourceGatePreflight();
  assert.equal(gate.total,15);
  assert.equal(gate.held,15);
  assert.equal(gate.authorized,0);
  assert.equal(gate.rows.filter(row=>row.quarantine).length,2);
  const ids = f25SourceReleaseGate.sources.map(x=>x.recipe_id);
  assert.equal(new Set(ids).size,15);
  for (const id of ids) {
    assert.throws(()=>assertF25SourceReleaseAuthorized(id),/F25_SOURCE_HOLD/);
    const sample=source();
    sample.data.recipe_id=id;
    sample.data.url_slug=id;
    assert.equal(sample.data.status,"published");
    assert.throws(()=>overlayTranslationPublicationIndex([sample],index(id)),/F25_SOURCE_HOLD|TRANSLATION_QUARANTINED_FI/);
  }
  // A targeted audit cannot ignore a forbidden registry entry.
  assert.throws(()=>overlayTranslationPublicationIndex([source()],index("rahka-marjakerroskulho"),new Set(["sample"])),/F25_SOURCE_HOLD/);
  assert.doesNotThrow(()=>assertF25SourceReleaseAuthorized("kiinalainen-soijamaito-aamiaisella"));
});

test("F25 A1 four recipe candidate files stay out of production and retain explicit HOLD",async()=>{
  const {readFileSync}=await import("node:fs");
  const {createHash}=await import("node:crypto");
  const path=await import("node:path");
  const root=path.resolve(import.meta.dirname,"../..");
  const manifest=JSON.parse(readFileSync(path.join(root,"meta/kaannokset/f25-a1-four-fi-recipe-drafts-20261111.json"),"utf8"));
  const gate=JSON.parse(readFileSync(path.join(root,"meta/kaannokset/f25-release-gate.json"),"utf8"));
  assert.equal(manifest.schemaVersion,1);
  assert.equal(manifest.stage,"HOLD");
  assert.equal(manifest.candidates.length,4);
  for(const c of manifest.candidates){
    assert.equal(c.status,"HOLD");
    for(const key of ["nutritionApproved","gkApproved","physicalTrialCompleted","translationReleaseAuthorized"])assert.equal(c[key],false);
    const source=readFileSync(path.join(root,c.sourcePath));
    const hash=createHash("sha1").update("blob "+source.byteLength+"\0").update(source).digest("hex");
    assert.equal(hash,c.sourceGitBlobSha,c.recipeId);
    assert.ok(c.draftPath.startsWith("docs/reviews/f25-a1-draft-recipes/"));
    assert.ok(!c.draftPath.startsWith("reseptit/"));
    const draft=readFileSync(path.join(root,c.draftPath),"utf8");
    assert.match(draft,/EI julkaisuun/);
    assert.match(draft,/Koepaistoa ei ole tehty/);
    assert.match(draft,/Ravintoarvon kandidaattilaskelma/);
    assert.match(draft,/## Ainekset/);
    assert.match(draft,/## Valmistus/);
    assert.ok(c.blockers.length>=4);
    assert.deepEqual(gate.sources.find((row:any)=>row.recipe_id===c.recipeId)?.approval,null);
  }
});

test("F25 A2 four gram-specific recipe candidates stay source-locked and unpublished", async () => {
  const {auditF25A2FourDrafts}=await import("../scripts/f25-a2-four-fi-draft-gate");
  const result=auditF25A2FourDrafts();
  assert.equal(result.total,4);
  assert.equal(result.approved,0);
  const rows=Object.fromEntries(result.rows.map(r=>[r.recipeId,r]));
  assert.equal(rows["vietnamilainen-papaija-kookospuuro"].candidateTime,40);
  assert.equal(rows["vietnamilainen-banh-cuon-sienilla"].candidateTime,50);
  assert.equal(rows["vietnamilainen-banh-xeo-aamiaisletut"].candidateTime,45);
  assert.equal(rows["pohjoisafrikkalainen-baghrir"].candidateTime,45);
  for (const r of result.rows) {
    assert.equal(r.status,"HOLD");
    assert.equal(r.approval,false);
    assert.equal(r.sourceSha.length,40);
    assert.ok(r.candidateTime>r.oldTime);
  }
  assert.deepEqual(rows["vietnamilainen-papaija-kookospuuro"].addedOrChangedItems,[]);
  assert.equal(rows["vietnamilainen-papaija-kookospuuro"].productContrast?.netCarbDifferenceGPerServing,3.35);
  assert.equal(rows["vietnamilainen-papaija-kookospuuro"].productContrast?.fibreAndPolyolsVerified,false);
  assert.deepEqual(rows["vietnamilainen-banh-cuon-sienilla"].addedOrChangedItems,[]);
  assert.ok(rows["vietnamilainen-banh-xeo-aamiaisletut"].addedOrChangedItems.some(
    x=>x.item==="vettä"&&x.amount===120&&x.unit==="ml"));
  assert.ok(rows["pohjoisafrikkalainen-baghrir"].addedOrChangedItems.some(
    x=>x.item==="lämmintä vettä"&&x.amount===300&&x.unit==="ml"));
});

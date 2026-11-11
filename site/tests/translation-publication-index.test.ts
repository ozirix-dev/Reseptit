import assert from "node:assert/strict";
import { test } from "node:test";
import { assertTranslationSourceIsNotQuarantined, overlayTranslationPublicationIndex } from "../scripts/translation-publication-index";
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

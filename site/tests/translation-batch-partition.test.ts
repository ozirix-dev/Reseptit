import assert from "node:assert/strict";
import { test } from "node:test";
import { evaluateBatchEntry } from "../scripts/translation-batch-partition";
import { semanticHash, type SemanticEvidence } from "../scripts/translation-semantic-review";
import type { TranslationAuditResult } from "../scripts/translation-audit";
type Recipe = TranslationAuditResult["publishedSources"][number];
const original = (): Recipe => ({
  path: "reseptit/paaruoat/mock.md",
  data: { title: "Soup", recipe_id: "mock", url_slug: "mock", category: "paaruoka",
    language: "fi", status: "published", ingredients: [{amount: 100, unit: "g", item: "kana"}],
    servings: 2, main_ingredient: ["kana"], cooking_method: ["keittäminen"], tags: [],
    image: {src: "paaruoat/mock.webp", alt: "Keitto", width: 1280, height: 853} },
  content: "# Soup\n\n## Valmistus\n\n1. Kypsennä 100 g kanaa vedessä.",
});
const translation = (locale: "en" | "sv" | "th"): Recipe => {
  const fi = original();
  const titles = { en: "Soup", sv: "Soppa", th: "ซุป" };
  const steps = { en: "Cook 100 g chicken in water.", sv: "Koka 100 g kyckling i vatten.", th: "ต้มไก่ 100 g ในน้ำ" };
  const headings = { en: "Instructions", sv: "Tillagning", th: "วิธีทำ" };
  return { path: "kaannokset/" + locale + "/paaruoat/mock.md",
    data: { ...fi.data, title: titles[locale], language: locale, status: "draft", source_language: "fi",
      source_recipe: fi.path, translation_of: "mock", ingredients: [{amount: 100, unit: "g",
        item: { en: "chicken", sv: "kyckling", th: "เนื้อไก่" }[locale]}],
      image: {...fi.data.image!, alt: titles[locale]} },
    content: "# " + titles[locale] + "\n\n## " + headings[locale] + "\n\n1. " + steps[locale] };
};
const bundle = () => {
  const source = original();
  const en = translation("en"), sv = translation("sv"), th = translation("th");
  return { id: "mock", category: "paaruoat", source,
    targets: { en, sv, th }, reviewState: "ai-compared-draft",
    hashes: { fi: semanticHash(source), en: semanticHash(en), sv: semanticHash(sv), th: semanticHash(th) } };
};
const proofs = (b: ReturnType<typeof bundle>): SemanticEvidence =>
  Object.fromEntries((["en","sv","th"] as const).map(l => [
    "mock:" + l, {source_hash: b.hashes.fi, translation_hash: b.hashes[l],
      reviewed_at: "2026-11-09", reference: "tests: deliberately human-readable peer comparison",
      outcome: "pass" as const, findings: []},
  ]));
test("candidate requires all three current reviewed pair hashes", () => {
  const b = bundle();
  assert.equal(evaluateBatchEntry(b, proofs(b)).group, "candidate");
});
test("missing evidence, including only one missing locale, fails closed", () => {
  const b = bundle(), e = proofs(b);
  delete e["mock:th"];
  const result = evaluateBatchEntry(b, e);
  assert.equal(result.group, "needs-review");
  assert.match(result.reasons.join(" "), /th: NOT REVIEWED/);
});
test("hash drift is never approved by a green structural check", () => {
  const b = bundle(), e = proofs(b);
  b.targets.th!.content += "\nChanged critical note";
  const result = evaluateBatchEntry(b, e);
  assert.equal(result.group, "needs-review");
  assert.match(result.reasons.join(" "), /stale|STALE/);
});
test("unresolved P1 findings block candidate", () => {
  const b = bundle(), e = proofs(b);
  e["mock:sv"]!.findings = [{ severity: "P1", status: "open", summary: "allergen mismatch" }];
  assert.equal(evaluateBatchEntry(b, e).group, "needs-review");
});
test("source HOLD cannot be cleared by complete and current evidence", () => {
  const b = bundle(), e = proofs(b);
  b.reviewState = "source-hold";
  assert.equal(evaluateBatchEntry(b, e).group, "source-hold");
});
test("source note or ingredient drift blocks candidate even if evidence is present", () => {
  const b = bundle(), e = proofs(b);
  b.targets.en!.data.ingredients[0]!.amount = 300;
  const result = evaluateBatchEntry(b, e);
  assert.equal(result.group, "needs-review");
  assert.match(result.reasons.join(" "), /amount/);
});
test("a source mark alone does not count as a completed semantic review", () => {
  const b = bundle(), e = proofs(b);
  b.reviewState = "unreviewed";
  assert.equal(evaluateBatchEntry(b, e).group, "needs-review");
});

test("missing third language cannot be promoted as a two-language partial", () => {
  const b = bundle(), e = proofs(b);
  const withoutThai = {...b, targets: {en: b.targets.en, sv: b.targets.sv}};
  const decision = evaluateBatchEntry(withoutThai, e);
  assert.equal(decision.group, "needs-review");
  assert.match(decision.reasons.join(" "), /th: translation missing/);
});
test("outcome human-required blocks automatic candidate promotion", () => {
  const b = bundle(), e = proofs(b);
  e["mock:en"]!.outcome = "human-required";
  assert.equal(evaluateBatchEntry(b, e).group, "needs-review");
});
test("P0 open means source may be unsafe even when all numerical checks pass", () => {
  const b = bundle(), e = proofs(b);
  e["mock:th"]!.findings = [{severity: "P0", status: "open", summary: "food-safety error"}];
  const result = evaluateBatchEntry(b, e);
  assert.equal(result.group, "needs-review");
  assert.match(result.reasons.join(" "), /BLOCKED/);
});
test("missing source cannot produce a candidate even with complete evidence", () => {
  const b = bundle(), e = proofs(b);
  const withoutSource = {...b, source: null};
  assert.equal(evaluateBatchEntry(withoutSource, e).group, "source-hold");
});

test("bad FI source is isolated to source HOLD instead of aborting the whole batch", async () => {
  const {mkdtemp, mkdir, writeFile, rm} = await import("node:fs/promises");
  const {tmpdir} = await import("node:os");
  const path = await import("node:path");
  const {partitionFromLedger} = await import("../scripts/translation-batch-partition");
  const root = await mkdtemp(path.join(tmpdir(), "recipe-partition-"));
  try {
    await mkdir(path.join(root, "reseptit/paaruoat"), {recursive:true});
    await writeFile(path.join(root, "reseptit/paaruoat/good.md"),
      "---\ntitle: Good\nrecipe_id: good\nurl_slug: good\ncategory: paaruoka\nlanguage: fi\nstatus: published\nservings: 2\ningredients:\n- amount: 100\n  unit: g\n  item: kala\n---\n\n# Good\n\n## Valmistus\n\n1. Kypsennä kala.");
    await writeFile(path.join(root, "reseptit/paaruoat/bad.md"),
      "---\ntitle: Bad\nrecipe_id: bad\nurl_slug: bad\ncategory: paaruoka\nlanguage: fi\nstatus: published\nservings: 2\ningredients: []\n---\n\n# Bad");
    const sample = {fi: "a".repeat(64), en: "b".repeat(64), sv: "c".repeat(64),
      th: "d".repeat(64), review_state:"ai-compared-draft"};
    const decision = await partitionFromLedger(root, {recipes:{good:sample,bad:sample}}, {});
    assert.equal(decision.total, 2);
    assert.deepEqual(decision.source_hold.map(x=>x.recipe_id), ["bad"]);
    assert.deepEqual(decision.needs_review.map(x=>x.recipe_id), ["good"]);
    assert.equal(decision.candidate.length, 0);
  } finally {
    await rm(root, {recursive:true,force:true});
  }
});

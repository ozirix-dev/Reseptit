import { changedSemanticReviewErrors, preparationRegressionErrors, semanticHash, semanticStatus } from "../scripts/translation-semantic-review";
import test from "node:test";
import assert from "node:assert/strict";
import { auditTranslations, auditRecipePairs } from "../scripts/translation-audit";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { buildRegistry, contentHash, humanStatus, scopes, escapeHtml, evidenceSchema, loadCurrentReview, reviewSummary, type ReviewEvidence } from "../scripts/translation-review";
const proof: ReviewEvidence = { recipe_id: "synthetic-fixture", locale: "en", evidence_id: "synthetic-test-not-a-real-approval", source_content_hash: contentHash("source"), translation_content_hash: contentHash("translation"), reviewed_at: "2026-10-20", scope: [...scopes], status: "complete", human_attestation: true };
// Read-only test fixture. Clone individual entries before editing them.
let fullAudit: ReturnType<typeof auditTranslations> | undefined;
function loadFullAudit() {
  return fullAudit ??= auditTranslations();
}

test("checked-in evidence is validated against real current file hashes", async () => {
  const { audit, rows } = await loadCurrentReview();
  assert.deepEqual(audit.errors, []);
  assert.equal(rows.length, audit.publishedTranslations.length);
  for (const row of rows) if (row.human_review_status === "HUMAN REVIEW COMPLETE") {
    assert.ok(row.review_evidence_id); assert.ok(row.last_reviewed_at); assert.equal(row.structural_status, "PASS");
  }
});
test("evidence status and both content hashes protect approvals", () => {
  const s = proof.source_content_hash, t = proof.translation_content_hash;
  assert.equal(contentHash("a\r\nb"), contentHash("a\nb"));
  assert.equal(humanStatus(s, t), "AUTOMATED REVIEW ONLY");
  assert.equal(humanStatus(s, null), "NOT REVIEWED");
  assert.equal(humanStatus(s, t, proof), "HUMAN REVIEW COMPLETE");
  assert.equal(humanStatus(contentHash("changed source"), t, proof), "REVIEW STALE");
  assert.equal(humanStatus(s, contentHash("changed translation"), proof), "REVIEW STALE");
  assert.equal(humanStatus(s, t, proof, false), "REVIEW STALE");
  assert.equal(humanStatus(s, t, { ...proof, status: "in-progress" }), "HUMAN REVIEW IN PROGRESS");
  for (const change of [{ human_attestation: false }, { evidence_id: "" }, { scope: ["title"] }, { reviewed_at: "2026-99-99" }, { reviewed_at: "2026-02-30" }, { reviewed_at: "2099-01-01" }]) assert.equal(humanStatus(s, t, { ...proof, ...change }), "NOT REVIEWED");
  assert.throws(() => evidenceSchema.parse([{ ...proof, human_attestation: "false" }]));
  assert.throws(() => evidenceSchema.parse([{ ...proof, reviewer_email: "private@example.org" }]));
});
test("dynamic registry covers all published pairs, puts Thai first, no invented human approval", async () => {
  const audit = await loadFullAudit();
  const hashes = Object.fromEntries([...audit.publishedSources, ...audit.publishedTranslations].map((r) => [r.path, contentHash(JSON.stringify(r))]));
  const rows = buildRegistry(audit, hashes, []);
  assert.equal(rows.length, audit.publishedTranslations.length);
  assert.equal(rows[0].locale, "th");
  assert.ok(rows.every((r) => r.human_review_status === "AUTOMATED REVIEW ONLY"));
  assert.ok(rows.every((r) => r.structural_status === "PASS"));
  assert.throws(() => buildRegistry(audit, hashes, [proof, proof]));
});
test("draft cannot satisfy published counterpart and amount/unit errors reach registry", async () => {
  const all = await loadFullAudit();
  const source = structuredClone(all.publishedSources[0]); source.data.translation_status = { en: "published" }; source.data.translation_languages = ["en"];
  const target = structuredClone(all.publishedTranslations.find((r) => r.data.recipe_id === source.data.recipe_id && r.data.language === "en")!);
  const hashes = { [source.path]: contentHash("source"), [target.path]: contentHash("target") };
  target.data.status = "draft";
  const missing = buildRegistry(auditRecipePairs([source], [target]), hashes, [])[0];
  assert.equal(missing.translation_path, null); assert.equal(missing.structural_status, "FAIL");
  target.data.status = "published"; target.data.ingredients[0].amount = 12345; target.data.ingredients[0].unit = "l";
  const row = buildRegistry(auditRecipePairs([source], [target]), hashes, [])[0];
  assert.equal(row.structural_status, "FAIL"); assert.match(row.notes.join(" "), /amount=12345/);
});
test("known mistranslation and narrow negation guard remain visible", async () => {
  const all = await loadFullAudit();
  const source = structuredClone(all.publishedSources.find((r) => r.data.recipe_id === "keto-kauralesesampylat")!);
  source.data.translation_status = { th: "published" }; source.data.translation_languages = ["th"];
  const target = structuredClone(all.publishedTranslations.find((r) => r.data.recipe_id === source.data.recipe_id && r.data.language === "th")!);
  target.content += "\nรำข้าวโอ๊ตไม่มีคาร์โบไฮเดรต\n";
  const hashes = { [source.path]: contentHash("source"), [target.path]: contentHash("target") };
  const row = buildRegistry(auditRecipePairs([source], [target]), hashes, [])[0];
  assert.equal(row.automated_semantic_status, "FINDINGS"); assert.match(row.notes.join(" "), /negated/);
  assert.equal(escapeHtml('<script>"&'), "&lt;script&gt;&quot;&amp;");
});
test("source-level failures prevent complete status on all affected translations", async () => {
  const all = await loadFullAudit();
  const source = structuredClone(all.publishedSources[0]); source.data.translation_status = { en: "published" }; source.data.translation_languages = ["en"];
  const target = all.publishedTranslations.find((r) => r.data.recipe_id === source.data.recipe_id && r.data.language === "en")!;
  const hashes = { [source.path]: proof.source_content_hash, [target.path]: proof.translation_content_hash };
  const evidence = { ...proof, recipe_id: source.data.recipe_id };
  assert.throws(() => buildRegistry(auditRecipePairs([source, source], [target]), hashes, [evidence]), /exactly one registry pair/);
  const rows = buildRegistry(auditRecipePairs([source, source], [target]), hashes, []);
  assert.ok(rows.every((row) => row.structural_status === "FAIL" && row.human_review_status !== "HUMAN REVIEW COMPLETE"));
  assert.ok(rows.every((row) => row.notes.some((note) => note.includes(":fi: duplicate"))));
});
test("orphaned evidence fails for unknown recipe or removed translation", async () => {
  const all = await loadFullAudit();
  const source = structuredClone(all.publishedSources[0]); source.data.translation_status = {}; source.data.translation_languages = [];
  const target = all.publishedTranslations.find((r) => r.data.recipe_id === source.data.recipe_id && r.data.language === "en")!;
  const hashes = { [source.path]: proof.source_content_hash, [target.path]: proof.translation_content_hash };
  const evidence = evidenceSchema.parse([{ ...proof, recipe_id: source.data.recipe_id }]);
  assert.equal(buildRegistry(auditRecipePairs([source], [target]), hashes, evidence).length, 1);
  assert.throws(() => buildRegistry(auditRecipePairs([source], [target]), hashes, [proof]), /0 matches/);
  assert.throws(() => buildRegistry(auditRecipePairs([source], []), hashes, evidence), /0 matches/);
});
test("misdeclared source language invalidates every target locale", async () => {
  const all = await loadFullAudit();
  const source = structuredClone(all.publishedSources[0]);
  const targets = all.publishedTranslations.filter((r) => r.data.recipe_id === source.data.recipe_id);
  const hashes = Object.fromEntries([source, ...targets].map((r) => [r.path, r === source ? proof.source_content_hash : proof.translation_content_hash]));
  for (const language of ["en", "sv", "th"] as const) {
    source.data.language = language;
    const evidence = targets.map((r) => ({ ...proof, recipe_id: source.data.recipe_id, locale: r.data.language as "en" | "sv" | "th" }));
    const rows = buildRegistry(auditRecipePairs([source], targets), hashes, evidence);
    assert.equal(rows.length, 3);
    assert.ok(rows.every((r) => r.structural_status === "FAIL" && r.human_review_status !== "HUMAN REVIEW COMPLETE"));
  }
});
test("every participant of a source or translation route collision fails review", async () => {
  const all = await loadFullAudit();
  for (const collideSource of [true, false]) {
    const sources = structuredClone(all.publishedSources.slice(0, 2));
    const targets = structuredClone(sources.map((s) => all.publishedTranslations.find((r) => r.data.recipe_id === s.data.recipe_id && r.data.language === "en")!));
    for (const source of sources) { source.data.translation_status = { en: "published" }; source.data.translation_languages = ["en"]; }
    const colliding = collideSource ? sources : targets;
    colliding[1].data.url_slug = colliding[0].data.url_slug;
    const hashes = Object.fromEntries([...sources, ...targets].map((r) => [r.path, sources.includes(r) ? proof.source_content_hash : proof.translation_content_hash]));
    const evidence = sources.map((s) => ({ ...proof, recipe_id: s.data.recipe_id }));
    const rows = buildRegistry(auditRecipePairs(sources, targets), hashes, evidence);
    assert.equal(rows.length, 2);
    assert.ok(rows.every((r) => r.structural_status === "FAIL" && r.human_review_status !== "HUMAN REVIEW COMPLETE"));
  }
});


test("Codex evidence follows both meaning hashes and preserves separate human status", async () => {
  const audit = await auditTranslations(["bouillabaisse"]);
  const source = audit.publishedSources[0];
  const target = audit.publishedTranslations.find((entry) => entry.data.language === "en")!;
  const hashes = Object.fromEntries([source, ...audit.publishedTranslations].map((entry) => [entry.path, contentHash(entry.content)]));
  const key = "bouillabaisse:en";
  const evidence = { source_hash: semanticHash(source), translation_hash: semanticHash(target),
    reviewed_at: "2026-11-04", reference: "synthetic fixture", outcome: "pass" as const, findings: [] };
  const row = () => buildRegistry(audit, hashes, [], { [key]: evidence }).find((item) => item.locale === "en")!;
  assert.equal(row().codex_review_status, "REVIEW CURRENT");
  assert.equal(row().human_review_status, "AUTOMATED REVIEW ONLY");
  assert.equal(semanticHash({ ...source, data: { ...source.data, translation_languages: [] }, content: source.content.replaceAll("\r\n", "\n").replaceAll("\n", "\r\n") + "\n\n" }), evidence.source_hash);
  assert.deepEqual(changedSemanticReviewErrors(audit, new Set([target.path]), { [key]: evidence }), []);
  assert.equal(changedSemanticReviewErrors(audit, new Set([source.path]), { [key]: evidence }).length, 2);
  assert.deepEqual(changedSemanticReviewErrors(audit, new Set([target.path]), {}), [key + ": NOT REVIEWED"]);
  source.content += "\nChanged Finnish preparation.\n";
  assert.equal(row().codex_review_status, "REVIEW STALE");
  evidence.source_hash = semanticHash(source);
  target.content += "\nChanged translated preparation.\n";
  assert.equal(row().codex_review_status, "REVIEW STALE");
  assert.deepEqual(changedSemanticReviewErrors(audit, new Set([target.path]), { [key]: evidence }), [key + ": REVIEW STALE"]);
  evidence.translation_hash = semanticHash(target);
  const blocked = { ...evidence, findings: [{ severity: "P0", status: "open", summary: "Synthetic finding" }] } as const;
  assert.equal(semanticStatus(evidence.source_hash, evidence.translation_hash, true, { ...blocked, findings: [...blocked.findings] }), "BLOCKED");
  assert.equal(semanticStatus(evidence.source_hash, evidence.translation_hash, true, { ...evidence, outcome: "human-required" }), "HUMAN REVIEW REQUIRED");
  const stats = reviewSummary(audit, buildRegistry(audit, hashes, [], { [key]: evidence }));
  assert.equal(stats.published_pairs.count, 3);
  assert.equal(stats.semantic_current.count, 1);
  assert.equal(stats.semantic_unreviewed.count, 2);
});

test("preparation regressions catch scoped wrong methods, ingredients and missing negation", async () => {
  const audit = await auditTranslations(["bouillabaisse", "hyderabadi-kanabiryani", "kantonilainen-hoyrytetty-kala"]);
  const cases = [
    ["bouillabaisse", "th", "4. ใส่กุ้งลงไปผัดต่อ", "4. ใส่กุ้งลงในน้ำซุปแล้วต้มต่อ", /broth/],
    ["hyderabadi-kanabiryani", "th", "7. พักไว้ 10 นาทีแล้วขยี้เบา ๆ", "7. พักไว้ 10 นาทีแล้วซุยข้าวเบา ๆ", /fluff/],
    ["hyderabadi-kanabiryani", "th", "2. ผสมไก่กับโยเกิร์ตและผักชีสด", "2. ผสมไก่กับโยเกิร์ตและเมล็ดผักชีป่น", /ground coriander/],
    ["kantonilainen-hoyrytetty-kala", "sv", "1. Lägg fisken på en värmetålig plåt", "1. Lägg fisken på en värmetålig tallrik", /heatproof plate/],
    ["kantonilainen-hoyrytetty-kala", "th", "4. อุ่นน้ำมันจนเกิดควัน", "4. อุ่นน้ำมันให้ร้อนแต่ไม่ให้เกิดควัน", /warning/],
  ] as const;
  for (const [id, locale, bad, good, expected] of cases) {
    const entry = audit.publishedTranslations.find((item) => item.data.recipe_id === id && item.data.language === locale)!;
    const context = id === "hyderabadi-kanabiryani" ? "\n2. ผสมโยเกิร์ตกับเมล็ดผักชีป่น\n6. เติมหญ้าฝรั่นและผักชีสด" : id === "kantonilainen-hoyrytetty-kala" && locale === "sv" ? "\n4. Värm oljan tills den är het men inte ryker" : "";
    assert.match(preparationRegressionErrors({ ...entry, content: bad + context }).join(" "), expected);
    assert.deepEqual(preparationRegressionErrors({ ...entry, content: good + context }), []);
  }
  const source = audit.publishedSources.find((item) => item.data.recipe_id === "bouillabaisse")!;
  const targets = structuredClone(audit.publishedTranslations.filter((item) => item.data.recipe_id === source.data.recipe_id));
  targets[0].data.carbs_net_per_serving_g = null;
  assert.match(auditRecipePairs([source], targets).errors.join(" "), /carbs_net_per_serving_g=null/);
});

test("translation audit hashes the SHA-pinned public FI display for breakfast sources", async()=>{
  const wanted = ["pohjoisafrikkalainen-baghrir","lahi-ita-pistaasijogurtti","uunimuna-avokadot","rahka-marjakerroskulho","korealainen-gyeranbap-riisikulho"];
  const audit = await auditTranslations(wanted);
  assert.deepEqual(audit.errors,[]);
  assert.equal(audit.publishedSources.length,wanted.length);
  const sources = new Map(audit.publishedSources.map(s=>[s.data.recipe_id,s]));
  const baghrir = sources.get("pohjoisafrikkalainen-baghrir");
  assert.ok(baghrir);
  assert.equal(baghrir.data.title,"Marokkolainen baghrir hunajalla");
  assert.match(baghrir.content,/Marokkolainen baghrir hunajalla/);
  assert.doesNotMatch(baghrir.content,/hunajavoilla/);
  assert.equal(baghrir.data.image?.alt,"Reikäisiä mannalettuja lautasella ja hunajaa.");
  const pistachio = sources.get("lahi-ita-pistaasijogurtti");
  assert.ok(pistachio);
  assert.deepEqual(pistachio.data.cooking_method,["kylmävalmistus"]);
  assert.doesNotMatch(pistachio.content,/Valmistele kulhon ainekset/);
  const eggs = sources.get("uunimuna-avokadot");
  assert.ok(eggs);
  assert.match(eggs.content,/mitatusta munasta ei jätetä pois/);
  const quark = sources.get("rahka-marjakerroskulho");
  assert.ok(quark);
  assert.equal(quark.data.servings,4);
  assert.deepEqual(quark.data.cooking_method,["kylmävalmistus"]);
  const rice = sources.get("korealainen-gyeranbap-riisikulho");
  assert.ok(rice);
  assert.match(rice.content,/100 g kuivaa valkoista riisiä/);
  assert.doesNotMatch(rice.content,/Paista tofu/);
  const root=path.resolve(import.meta.dirname,"../..");
  const raw=await readFile(path.join(root,"reseptit/aamupalat/pohjoisafrikkalainen-baghrir.md"),"utf8");
  const parsed=parseMarkdown(raw);
  assert.ok(parsed);
  const rawSource={data:recipeFrontmatterSchema.parse(parsed.data),content:parsed.content};
  assert.doesNotMatch(rawSource.content,/hunajavoilla/);
  assert.equal(semanticHash(rawSource),semanticHash(baghrir));
  assert.equal(baghrir.data.ingredients.length,7);
  assert.equal(baghrir.data.carbs_net_per_serving_g,74.61);
});

test("Thai onion bulb counter is a valid FI kpl translation in besan-chilla", async () => {
  const audit = await auditTranslations(["intialainen-besan-chilla"]);
  const thai = audit.rows.find(row => row.recipe_id === "intialainen-besan-chilla" && row.locale === "th");
  assert.ok(thai, "The published Thai besan-chilla row must exist");
  assert.equal(audit.errors.length, 0, audit.errors.join(" | "));
  assert.doesNotMatch(thai.issues, /unit not recognized|ingredient 4 unit/);
});

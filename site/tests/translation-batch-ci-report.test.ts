import assert from "node:assert/strict";
import { test } from "node:test";
import { changedRecipeIds, markdownPartition } from "../scripts/translation-batch-ci-report";

test("changed FI and three translation paths are de-duplicated as one recipe identity", () => {
  const changed = [
    "reseptit/paaruoat/keitto.md",
    "kaannokset/en/paaruoat/keitto.md",
    "kaannokset/sv/paaruoat/keitto.md",
    "kaannokset/th/paaruoat/keitto.md",
    "reseptit/alkuruoat/salaatti.md",
    "docs/notes.md",
    "reseptit/raakileet/unpublished.md",
    "kaannokset/fr/paaruoat/nope.md",
  ].join("\n");
  assert.deepEqual(changedRecipeIds(changed), ["keitto", "salaatti"]);
});

test("no FI/translation paths produces an empty advisory inventory", () => {
  assert.deepEqual(changedRecipeIds("site/scripts/translation-batch-ci-report.ts\n.github/workflows/pages.yml"), []);
});

test("three-queue markdown preserves source hold reasons and explicit SHA", () => {
  const result = {
    total: 3,
    candidate: [{recipe_id: "approved", group: "candidate", pairs: 3, reasons: []}],
    needs_review: [{recipe_id: "needs", group: "needs-review", pairs: 2, reasons: ["th: review stale"]}],
    source_hold: [{recipe_id: "held", group: "source-hold", pairs: 0, reasons: ["FI quality evidence missing"]}],
    auto_publish: false, auto_merge: false,
  };
  const md = markdownPartition(result, {testedSha: "a".repeat(40), mode: "fixture"});
  for (const required of ["| candidate | 1 |", "| needs_review | 1 |", "| source_hold | 1 |",
    "FI quality evidence missing", "th: review stale", "a".repeat(40), "not** release approval"]) {
    assert.ok(md.includes(required), required);
  }
});

test("integration: real parser partitions candidate, stale locale and FI HOLD with SHA-linked evidence", async () => {
  const {mkdtemp, mkdir, writeFile, rm} = await import("node:fs/promises");
  const {tmpdir} = await import("node:os");
  const path = await import("node:path");
  const {parseMarkdown} = await import("../src/content/markdown");
  const {recipeFrontmatterSchema} = await import("../src/content/schema");
  const {semanticHash} = await import("../scripts/translation-semantic-review");
  const {partitionFromLedger} = await import("../scripts/translation-batch-partition");
  const {fiSourceQualitySchema} = await import("../scripts/translation-fi-source-quality");
  const root = await mkdtemp(path.join(tmpdir(), "fi-three-queue-"));
  const ids = ["approved", "stale-locale", "held-source", "stale-source", "missing-quality"];
  const translations = {
    en: {heading: "Instructions", name: "rice", instruction: "Cook 100 g rice."},
    sv: {heading: "Tillagning", name: "ris", instruction: "Koka 100 g ris."},
    th: {heading: "วิธีทำ", name: "ข้าว", instruction: "ต้มข้าว 100 g"},
  } as const;
  const semanticEvidence: Record<string, any> = {};
  const quality: Record<string, any> = {};
  const ledger: Record<string, any> = {};
  const qualityCheck = (status: "pass" | "hold") =>
    ({status, reference: "Synthetic, independently specified test evidence"});
  try {
    for (const id of ids) {
      const sourcePath = "reseptit/paaruoat/" + id + ".md";
      const source = [
        "---", "title: " + id, "recipe_id: " + id, "url_slug: " + id,
        "category: paaruoka", "language: fi", "status: published",
        "servings: 2", "ingredients:", "  - amount: 100", "    unit: g",
        "    item: riisiä", "---", "", "# " + id, "", "## Valmistus", "",
        "1. Keitä 100 g riisiä.", "",
      ].join("\n");
      await mkdir(path.join(root, "reseptit/paaruoat"), {recursive: true});
      await writeFile(path.join(root, sourcePath), source);
      const parsedSource = parseMarkdown(source);
      assert.ok(parsedSource);
      const fiRecipe = {path: sourcePath,
        data: recipeFrontmatterSchema.parse(parsedSource.data), content: parsedSource.content};
      const fiHash = semanticHash(fiRecipe);
      ledger[id] = {fi: fiHash, review_state: "ai-compared-draft"};
      quality[id] = {
        source_hash: fiHash, decision: "pass", reviewed_at: "2026-11-21",
        reviewed_by: "Synthetic independent FI fixture",
        reference: "tests: deliberately constructed FI source proof",
        checks: {
          ingredients: qualityCheck("pass"), method: qualityCheck("pass"),
          food_safety: qualityCheck("pass"), servings_and_time: qualityCheck("pass"),
          nutrition: qualityCheck("pass"),
          glycemic: {status: "unavailable", reference: "Synthetic missing GI is explicit"},
        }, findings: [],
      };
      for (const locale of ["en", "sv", "th"] as const) {
        const t = translations[locale];
        const targetPath = "kaannokset/" + locale + "/paaruoat/" + id + ".md";
        const raw = [
          "---", "title: " + id, "recipe_id: " + id, "url_slug: " + id,
          "category: paaruoka", "language: " + locale, "status: draft",
          "source_language: fi", "source_recipe: " + sourcePath,
          "translation_of: " + id, "servings: 2", "ingredients:",
          "  - amount: 100", "    unit: g", "    item: " + t.name,
          "---", "", "# " + id, "", "## " + t.heading, "",
          "1. " + t.instruction, "",
        ].join("\n");
        await mkdir(path.dirname(path.join(root, targetPath)), {recursive: true});
        await writeFile(path.join(root, targetPath), raw);
        const parsed = parseMarkdown(raw);
        assert.ok(parsed);
        const hash = semanticHash({path: targetPath,
          data: recipeFrontmatterSchema.parse(parsed.data), content: parsed.content});
        ledger[id][locale] = hash;
        semanticEvidence[id + ":" + locale] = {
          source_hash: fiHash, translation_hash: hash,
          reviewed_at: "2026-11-21", reference: "tests: synthetic locale comparison",
          outcome: "pass", findings: [],
        };
      }
    }
    semanticEvidence["stale-locale:th"].translation_hash = "f".repeat(64);
    quality["held-source"].decision = "hold";
    quality["held-source"].findings = [
      {severity: "P1", status: "open", summary: "Synthetic unresolved source mismatch"},
    ];
    quality["stale-source"].source_hash = "e".repeat(64);
    delete quality["missing-quality"];
    const validatedQuality = fiSourceQualitySchema.parse(quality);
    const result = await partitionFromLedger(root, {recipes: ledger}, semanticEvidence, validatedQuality);
    assert.equal(result.total, 5);
    assert.deepEqual(result.candidate.map(x => x.recipe_id), ["approved"]);
    assert.deepEqual(result.needs_review.map(x => x.recipe_id), ["stale-locale"]);
    assert.deepEqual(result.source_hold.map(x => x.recipe_id),
      ["held-source", "missing-quality", "stale-source"]);
    assert.equal(result.candidate[0]?.pairs, 3);
    assert.match(result.needs_review[0]!.reasons.join(" "), /th: REVIEW STALE/);
    assert.match(result.source_hold[0]!.reasons.join(" "), /HOLD/);
    assert.match(result.source_hold[1]!.reasons.join(" "), /missing/);
    assert.match(result.source_hold[2]!.reasons.join(" "), /stale/);
    assert.equal(result.auto_merge, false);
    assert.equal(result.auto_publish, false);
    const markdown = markdownPartition(result, {testedSha: "a".repeat(40), mode: "integration"});
    assert.match(markdown, /\| candidate \| 1 \|/);
    assert.match(markdown, /\| needs_review \| 1 \|/);
    assert.match(markdown, /\| source_hold \| 3 \|/);
    assert.match(markdown, /FI quality evidence missing/);
  } finally {
    await rm(root, {recursive: true, force: true});
  }
});

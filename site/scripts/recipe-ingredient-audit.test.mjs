import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { inspectRecipe, auditRecipes, preparationSection, markdownReport } from "./recipe-ingredient-audit.mjs";

function fixture(items, preparation, { status = "published", language = "fi", id = "audit-test" } = {}) {
  return [
    "---", "title: Koeresepti", "recipe_id: " + id,
    "language: " + language, "status: " + status, "category: paaruoka",
    "ingredients:", ...items.map((item) => "  - amount: 1\n    unit: g\n    item: " + item),
    "---", "", "# Koeresepti", "", "## Valmistus", "", preparation,
    "", "## Muistiinpanot", "", "Testi ei sisälly valmistusohjeeseen.", "",
  ].join("\n");
}

function typesOf(record, term) {
  return record.findings.filter((f) => f.term === term).map((f) => f.type);
}

test("explicit extra oil and soy sauce are candidates but never mutate ingredients", () => {
  const content = fixture(["broilerinlihaa"], "1. Lisää 5 g öljyä ja 1 tl soijakastiketta.");
  const result = inspectRecipe(content);
  assert.deepEqual(typesOf(result, "öljy"), ["luettelosta-puuttuva-lisäys"]);
  assert.deepEqual(typesOf(result, "soijakastike"), ["luettelosta-puuttuva-lisäys"]);
  assert.equal(result.ingredients_count, 1);
  assert.equal(result.steps_count, 1);
});

test("listed oil is not reported, including Finnish inflected ingredient labels", () => {
  const result = inspectRecipe(fixture(["broilerinlihaa", "neutraalia paistoöljyä"], "1. Paista broileri öljyssä."));
  assert.deepEqual(typesOf(result, "öljy"), []);
});

test("boiling water is not an unlisted recipe ingredient; added water is", () => {
  const onlyBoiling = inspectRecipe(fixture(["pastaa"], "1. Keitä pasta vedessä."));
  assert.deepEqual(typesOf(onlyBoiling, "vesi"), []);
  const added = inspectRecipe(fixture(["vehnäjauhoja"], "1. Lisää 80 ml vettä taikinaan."));
  assert.deepEqual(typesOf(added, "vesi"), ["luettelosta-puuttuva-lisäys"]);
});

test("omitted serving yogurt is separate from a mandatory added ingredient", () => {
  const result = inspectRecipe(fixture(["perunoita", "vehnäjauhoja"], "1. Paista parathat. Tarjoa maustamattoman jogurtin kanssa."));
  assert.deepEqual(typesOf(result, "jogurtti"), ["luettelosta-puuttuva-tarjoilu"]);
});

test("known generic template is detected even without explicit missing ingredient", () => {
  const result = inspectRecipe(fixture(["riisihiutaleita", "maapähkinöitä"], [
    "1. Raasta, muussaa tai hienonna pääraaka-aine.",
    "2. Sekoita joukkoon taikinan ainekset.",
  ].join("\n")));
  assert.ok(result.findings.some((f) => f.type === "yleisohjepohja" && f.term === "yleisohje-paaraaka-aine"));
  assert.ok(result.findings.some((f) => f.term === "yleisohje-taikinan-ainekset"));
});

test("translation and draft are not counted as published Finnish originals", () => {
  assert.equal(inspectRecipe(fixture(["voita"], "1. Lisää öljyä.", { language: "en" })).skipped, true);
  assert.equal(inspectRecipe(fixture(["voita"], "1. Lisää öljyä.", { status: "draft" })).skipped, true);
  assert.equal(preparationSection("# Otsikko\n\n## Valmistus\n\n1. Tee ruokaa.\n\n## Muistiinpanot\n\nMuu."), "1. Tee ruokaa.");
});

test("title-only legacy placeholders are excluded without being reported as parse errors", () => {
  const placeholder = inspectRecipe("\uFEFF# Vanha reseptiaihio\n\n", "old.md");
  assert.equal(placeholder.stub, true);
  assert.equal(placeholder.skipped, true);
  assert.equal(placeholder.error, undefined);
  const malformed = inspectRecipe("# Otsikko\n\n## Valmistus\n1. Lisää voita.", "broken.md");
  assert.match(malformed.error, /YAML-frontmatter/);
});

test("full on-disk inventory counts published recipes, not drafts, and keeps all evidence", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "recipe-ingredients-"));
  try {
    await mkdir(path.join(root, "reseptit", "aamupalat"), { recursive: true });
    await writeFile(path.join(root, "reseptit", "aamupalat", "first.md"), fixture(["broilerinlihaa"], "1. Lisää öljyä.", { id: "first" }));
    await writeFile(path.join(root, "reseptit", "aamupalat", "second.md"), fixture(["öljyä"], "1. Lisää öljyä.", { id: "second" }));
    await writeFile(path.join(root, "reseptit", "aamupalat", "third.md"), fixture(["öljyä"], "1. Lisää öljyä.", { id: "third", status: "draft" }));
    const audit = await auditRecipes(root);
    assert.equal(audit.summary.scanned_files, 3);
    assert.equal(audit.summary.published_fi, 2);
    assert.equal(audit.summary.flagged_recipes, 1);
    assert.equal(audit.summary.unlisted_addition_recipes, 1);
    assert.equal(audit.findings[0].recipe_id, "first");
    assert.match(markdownReport(audit), /automaattinen ehdokasraportti/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

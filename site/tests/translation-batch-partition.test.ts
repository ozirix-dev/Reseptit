import { readF25AtCreation, readF25GateAtCreation } from "../scripts/f25-history";
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

test("F25 remaining 17 nutrition scenarios stay HOLD and recalculate from ingredient evidence", async () => {
  const {readFile} = await import("node:fs/promises");
  const path = await import("node:path");
  const file = path.resolve(import.meta.dirname, "../../meta/kaannokset/f25-remaining-17-evidence-20261111.json");
  const evidence = JSON.parse(await readFile(file, "utf8"));
  assert.equal(evidence.schemaVersion, 1);
  assert.equal(evidence.release_authorized, false);
  assert.equal(evidence.counts.remainingFi, 17);
  assert.equal(evidence.publishedAtSnapshot.f25PairsHeld, 51);
  assert.equal(evidence.worklist.length, 17);
  assert.equal(new Set(evidence.worklist.map((r: any) => r.recipe_id)).size, 17);
  assert.equal(evidence.worklist.filter((r: any) => r.nutrition_input === "missing").length, 9);
  assert.equal(evidence.worklist.filter((r: any) => r.nutrition_input === "present-unapproved").length, 8);
  assert.equal(evidence.worklist.filter((r: any) => r.public_quarantine).length, 2);
  for (const row of evidence.worklist) {
    assert.equal(row.release_authorized, false);
    assert.equal(row.human_review_complete, false);
    assert.match(row.source_blob_sha, /^[0-9a-f]{40}$/);
    assert.match(row.decision, /HOLD/);
    assert.ok(row.blockers.length > 20);
  }
  const recalculate = (v: any, servings: number) => {
    const fields = ["netCarbohydrate","totalCarbohydrateInclFibre","protein","fat"] as const;
    const values = v.ingredients.map((x: any) => ({
      netCarbohydrate:x.g*x.carbohydrate/100/servings,
      totalCarbohydrateInclFibre:x.fibre === null ? null : x.g*(x.carbohydrate+x.fibre)/100/servings,
      protein:x.g*x.protein/100/servings,
      fat:x.g*x.fat/100/servings
    }));
    for (const field of fields) {
      const calculated = values.some((x: any) => x[field] === null) && field === "totalCarbohydrateInclFibre"
        ? null : Number(values.reduce((sum: number,x: any) => sum+(x[field]??0),0).toFixed(4));
      assert.equal(v.modelPerServing[field], calculated, v.id + ":" + field);
    }
  };
  for (const batch of Object.values(evidence.nutritionScenarios) as any[]) {
    assert.match(batch.outcome, /^hold:/);
    for (const variant of batch.variants) recalculate(variant,batch.servings);
  }
  const zaatar = evidence.nutritionScenarios.zaatar;
  for (const model of zaatar.variants) {
    assert.ok(model.modelPerServing.netCarbohydrate > zaatar.originalOmissionBoundPerServing.netCarbohydrate,
      model.id + " invalidates the unverified carb omission bound");
  }
  assert.notEqual(
    evidence.nutritionScenarios.rahka.variants[0].modelPerServing.netCarbohydrate,
    evidence.nutritionScenarios.rahka.declaredPerServing.netCarbohydrate,
  );
  assert.equal(evidence.nutritionScenarios.paneer.declaredPerServing, null);
});


test("F25 next15 product rebuilds recalculate 4 macro fields but cannot publish HOLD sources", async () => {
  const {readFile} = await import("node:fs/promises");
  const {createHash} = await import("node:crypto");
  const path = await import("node:path");
  const root = path.resolve(import.meta.dirname, "../..");
  const decisions = JSON.parse(await readFile(path.join(root, "meta/kaannokset/f25-next15-four-product-rebuilds-20261111.json"), "utf8"));
  const published = JSON.parse(await readFile(path.join(root, "meta/kaannokset/published-translation-pairs.json"), "utf8"));
  const indexed = new Set(published.sources.map((source: any) => source.recipe_id));
  assert.equal(decisions.schemaVersion, 1);
  assert.equal(decisions.status, "RESEARCH-CANDIDATES-NOT-APPROVAL");
  assert.deepEqual(decisions.summary, {remainingSources:15,missingCalculationInputs:9,existingUnapprovedCalculationInputs:6,quarantinedSources:2});
  assert.equal(decisions.publicationCounts.f25PublishedPairs, 30);
  assert.equal(decisions.publicationCounts.f25RemainingPairs, 45);
  assert.equal(decisions.heldSources.length, 15);
  assert.equal(new Set(decisions.heldSources.map((x: any) => x.recipe_id)).size, 15);
  assert.equal(decisions.heldSources.filter((x: any) => x.public_quarantine).length, 2);
  for (const row of decisions.heldSources) {
    assert.equal(row.release_authorized, false, row.recipe_id);
    assert.ok(!indexed.has(row.recipe_id), row.recipe_id + " is HOLD but appears in published translations");
    const raw = await readFile(path.join(root, row.source_path));
    const actualGitBlob = createHash("sha1").update("blob " + raw.length + "\0").update(raw).digest("hex");
    assert.equal(actualGitBlob, row.source_blob_sha, row.recipe_id + " changed: review must be repeated");
  }
  const fields = ["netCarbohydrate","totalCarbohydrateInclFibre","protein","fat"] as const;
  assert.equal(decisions.calculationCandidates.length, 4);
  for (const c of decisions.calculationCandidates) {
    assert.equal(c.sourceStatus,"HOLD");
    assert.equal(c.release_authorized,false);
    assert.equal(c.human_nutrition_review,false);
    assert.ok(c.assumptionsToResolve.length >= 4, c.recipe_id);
    assert.ok(c.ingredients.every((i: any) => i.sourceUrl.startsWith("https://")));
    const values = {
      netCarbohydrate: c.ingredients.reduce((s: number,i: any) => s+i.g*i.availableCarbGPer100/100/c.servings, 0),
      totalCarbohydrateInclFibre:c.ingredients.reduce((s: number,i: any) => s+i.g*(i.availableCarbGPer100+i.fibreGPer100)/100/c.servings, 0),
      protein:c.ingredients.reduce((s: number,i: any) => s+i.g*i.proteinGPer100/100/c.servings, 0),
      fat:c.ingredients.reduce((s: number,i: any) => s+i.g*i.fatGPer100/100/c.servings, 0),
    };
    for (const field of fields) assert.ok(Math.abs(values[field]-c.candidatePerServing[field])<0.000001, c.recipe_id+" "+field);
    assert.ok(decisions.heldSources.some((x: any) => x.recipe_id===c.recipe_id));
  }
  const byId = Object.fromEntries(decisions.calculationCandidates.map((c: any) => [c.recipe_id,c])) as Record<string,any>;
  assert.ok(byId["lahi-ita-zaatar-munat"].candidatePerServing.netCarbohydrate>24.91+0.2);
  assert.ok(byId["japanilainen-hojicha-jogurtti-persimonilla"].candidatePerServing.totalCarbohydrateInclFibre>19.34+0.7);
  assert.equal(Object.keys(byId["intialainen-pinaatti-paneer-chilla"].originalFiMacros).length,0);
  assert.notEqual(byId["rahka-marjakerroskulho"].candidatePerServing.netCarbohydrate, 6.32);
});

test("F25 B1 five source HOLDs and product sensitivity arithmetic are fail closed", async () => {
  const {readFile}=await import("node:fs/promises");
  const path=await import("node:path");
  const root=path.resolve(import.meta.dirname,"../..");
  const data=JSON.parse(await readFile(path.join(root,"meta/kaannokset/f25-b1-five-product-matching-20261111.json"),"utf8"));
  const gate=readF25GateAtCreation(root);
  const pub=JSON.parse(readF25AtCreation(root,"meta/kaannokset/published-translation-pairs.json"));
  const released=new Set(pub.sources.map((x:any)=>x.recipe_id));
  assert.equal(data.schemaVersion,1);
  assert.equal(data.status,"RESEARCH-CANDIDATES-NOT-APPROVAL");
  assert.equal(data.sources.length,5);
  for(const row of data.sources) {
    const source=gate.sources.find((x:any)=>x.recipe_id===row.id);
    assert.ok(source && source.approval===null);
    assert.equal(source.baseline_git_blob_sha,row.source_blob_sha);
    assert.equal(row.release_authorized,false);
    assert.equal(released.has(row.id),false);
  }
  assert.equal(data.chilaquiles.models.length,2);
  for(const m of data.chilaquiles.models) {
    for(const [field,source] of [["netCarbohydrate","carb100"],["protein","protein100"],["fat","fat100"]] as const){
      const result=m.ingredients.reduce((n:number,x:any)=>n+x.g*x[source]/100/m.servings,0);
      assert.ok(Math.abs(result-m.perServing[field])<0.000001,field);
    }
    assert.equal(m.perServing.totalIncludingFibre,null);
    assert.equal(m.release_authorized,false);
  }
  assert.ok(Math.abs(data.chilaquiles.models[1].perServing.netCarbohydrate-data.chilaquiles.models[0].perServing.netCarbohydrate-4.4225)<0.000001);
  for(const v of data.kimchiJeon.models){
    assert.equal(v.perServingCarbs,Number((v.carb100*v.g/100/v.servings).toFixed(6)));
    assert.equal(v.fibre100,null);
    assert.equal(v.release_authorized,false);
  }
  assert.ok(Math.abs(data.kimchiJeon.models[2].perServingCarbs-data.kimchiJeon.models[0].perServingCarbs-3.825)<0.000001);
  assert.ok(data.otherBlockers["munakoiso-kesakurpitsalasagne"].some((s:string)=>s.includes("200g")));
});

# GI Knowledge Base V1 — source registry and retrieval design

Status: DESIGN ONLY / NO DATABASE MIGRATION. Prepared 2026-11-04 from main `527236a8d8129e907daefe1d9fcd75b8b85bc6bd`.

## Why a separate PR?

GI evidence is already **partly structured** in `docs/nutrition/glycemic-index-records.json` (with sourcePolicy, sources and records), but additional GI observations, reviews and product/preparation rationale are scattered across GK80/GK100 research folders and markdown. The problem is discoverability, identity, provenance and reuse—not merely a missing database server. The GK100 New Recipe Pipeline should depend on this **versioned lookup contract**, but both workstreams can progress independently using the existing JSON as an adapter.

## Technology decision

Use **Git-versioned JSON as canonical data**, with a deterministic generated search index (JSON or locally generated SQLite) if needed for speed. No mandatory managed SQL database, API service, cloud bill or runtime network dependency. A SQLite cache must be reconstructible from canonical reviewed records and never become a second independent source of truth.

## Data model: three separate concepts

**A. Source**: stable `sourceId`, title/authors/year, DOI/URL, document or table and row locator, owner/publisher, date accessed/verified, citation, published status, methods/ISO evidence, participants and reference scale, license/terms URL and *reuse assessment*; allow `UNKNOWN` reuse state that blocks republication of source text/tables without necessarily forbidding citing individual facts. No unsupported legal certainty.

**B. GI observation**: immutable `observationId`, `sourceId`, measured food name/locale, brand/formulation, species/cultivar, foodKey, preparationKey (raw/boiled/steamed/baked/fried, time/temp, cooling/reheating as known), measured glucose-scale GI, reference food, conversion with formula if needed, n, dispersion/uncertainty, study quality, exact source locator, and `DIRECT_MEASUREMENT | REPORTED_ESTIMATE | IMPUTED | UNVERIFIED`. Do not conflate a calculation code or model with a human-measured GI. Two papers quoting one measurement must link to **one independent observation**, not two confirmations.

**C. Applicability judgement**: `observationId`, target food/preparation/recipe context, `EXACT | JUSTIFIED_ANALOGUE | NOT_APPLICABLE | NEEDS_REVIEW`, documented differences, confidence, reviewer/evidence, version and optional recipe-specific scope. No food-family wildcard, broad average, or analogy automatically promoted to universal exact match.

Additional structured records for **food composition** should reference canonical ingredient/product IDs, units (per 100 g vs per 100 ml), dry/cooked state, available carbohydrate vs total carbohydrate vs fibre, version and source. Keep composition and GI provenance separate. Existing `food-records.json` and product source records should be read by adapters, not duplicated into the GI observation table.

## Coverage and discovery

1. Audit current `glycemic-index-records.json` records and research packages without recopied large original tables; count `DIRECT` matches, validated analogues, reused observations, unreviewed leads, duplicates and source/license issues.
2. Produce a **gap report by recipe importance**, prioritized by available carbohydrate contribution, count of recipes affected and preparation mismatch. A missing GI for avocado, egg or spices is not automatically urgent; do not assume its CHO is zero.
3. Implement a read-only lookup returning ranked results by `foodKey + preparationKey + measured/estimated + quality + license`. Include explicit reasons why candidates are rejected.
4. Add a source-review queue: `DISCOVERED → PROVENANCE_CHECKED → METHODS_REVIEWED → APPLICABILITY_REVIEWED → REUSABLE`; permit `BLOCKED` and `SUPERSEDED`. Editorial judgement is recorded and human review gates apply for material new analogues.
5. Incorporate high-value missing records **one evidence batch at a time**: direct measurements first; non-Western regional-food research where suitable. No bulk scraping of licensed GI tables, no commercial reuse assumption, no copying source PDFs/tables wholesale.
6. Publish a compact internal *index of missing food/preparation pairs* for GK100 pipeline and allow multiple recipes to share **one reviewed record**. Preserve old recipe-level SHA approvals; never silently recompute or republish old GK values.

## Interfaces

- `lookupGi(foodKey, preparationKey, context?) -> ranked observation references with applicability, provenance, source/license status, confidence and rejection reasons`.
- `reportMissingGi(recipeId, ingredient, availableCHOgPerServing, preparation, reason) -> deduplicated research item`.
- `buildGiIndex(canonicalRecords) -> deterministic, hash-bound local index`.
- `validateGiEvidence(records) -> row-localized errors and warnings`.

Backward compatibility with `site/scripts/glycemic-load-model.ts` and existing `glycemic-index-records.json` is mandatory. Source review is separate from approval to use an observation for a specific preparation.

## Quality and licensing rules

- Keep GI on the glucose=100 scale with explicit documented transformations.
- Distinguish independent *human measured food GI* from analogies, category codes, model estimates and ingredient-sum GK.
- Verify food, preparation, carbohydrate basis, study participants, quality and source methods; do not claim ISO qualification unless evidenced.
- Save bibliographic references and small factual observations with attribution. Review CC BY, CC BY-SA, CC BY-NC, database rights and applicable terms per source; avoid copying third-party copyrighted tables or substituting speculative legal conclusions.
- Preserve version, SHA and change history, and require re-review when food preparation, source or observation changes.

## Phases and acceptance

**Phase A: inventory and schema.** Schema and audit of current sources; migration/mapping plan for old record IDs. No data mass import.

**Phase B: deterministic lookup and tests.** Versioned source + observation + applicability read adapter; indexed search; safe unknown/out-of-scope behavior; compatibility tests against existing calculations.

**Phase C: gap-driven curation.** Source review and first high-impact food/preparation evidence batch; reuse existing documentation without rescraping.

**Phase D: pipeline integration.** New Recipe Pipeline consumes lookups and queues source gaps; Approval Factory still owns the permission and release boundary.

Test cases: same food/different preparation must not be matched blindly; multiple citations to one study must not count as independent; raw/cooked and CHO units must remain distinct; unknown license is flagged; no new GI must be fabricated; all existing published GK results unchanged until specifically reviewed and approved. Keep tests targeted and CI inexpensive.

## Coordination and limitations

This is an independent planning PR. Do not modify PR #230–#239 or other owned branches. Do not push bulk source data, edit approved GK records, or publish. No tests required for documentation-only scope beyond GitHub PR validation. An implementation follow-up should be separately authorized; no standalone production DB or credentials needed.

**Definition of done for planning:** approved conceptual schema, source-reuse rules, coverage audit plan, lookup API contract, phased tasks, and clear integration dependency on the GK100 New Recipe Pipeline.

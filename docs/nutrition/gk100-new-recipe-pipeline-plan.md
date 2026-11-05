# GK100 New Recipe Pipeline V1 — implementation plan

Status: DESIGN ONLY / NOT AUTHORIZED FOR PRODUCTION. Prepared 2026-11-04 from main `527236a8d8129e907daefe1d9fcd75b8b85bc6bd`.

## Goal and contract

Every newly **drafted** or published Finnish recipe should enter a deterministic GK assessment path immediately, without inventing a GI or carbohydrate value. As soon as structured ingredient quantities and servings exist, classify them and emit either (1) a candidate estimate with grounded evidence, (2) a reviewable scenario/range, or (3) a precise, actionable work queue. A missing GI reference is normal; absence must not be interpreted as zero GK or trigger wholesale HOLD for other recipes.

The tool prepares estimates, **never autonomously approves, merges or publishes** them. Existing GK100 Approval Factory V1 is the approval and release boundary. `CANDIDATE` is not `OWNER_APPROVED`, and even owner approval is not production publication authorization.

## Existing implementation verified

- `site/scripts/glycemic-load-pilot-input.ts` already detects **published** new Finnish recipe IDs absent from reviewed GK inputs and inserts unresolved rows with `grams:null`, `fineliRecordId:null`, `giRecordId:null`; it does **not** calculate a grounded GK for them.
- `site/scripts/glycemic-load-pilot.ts` computes from reviewed inputs and checks recipe/input/evidence hashes; `site/scripts/glycemic-load-model.ts` holds current strict policies.
- `site/scripts/gk100-approval-factory.ts`, `gk100-approval-cli.ts`, and `gk100-approval-release.ts` already support hashed candidate packets, risk review, decisions and separately authorized releases.
- `docs/nutrition/glycemic-index-records.json` already contains structured GI records. GI evidence is incomplete and distributed through several research packages. The separate GI Knowledge Base PR owns extending discoverability and source curation.

## Architecture / stages

1. **Detect a new draft early.** Add a non-mutating command, e.g. `npm run gk:new-recipe -- check <recipe-id-or-path>`, usable when a recipe is `status:draft`. Parse recipe frontmatter, portions, ingredients, amounts and optional substitutions. Continue to support the existing published-recipe inventory. Do not auto-publish drafts or impose a GK requirement on saving a draft.
2. **Normalize ingredient quantity.** Distinguish raw/cooked/dried/drained weights; parse units through explicitly verified conversions and product labels. Unknown portions must remain unknown. No hardcoded generic “one piece = 100 g” substitutions or fabricated carbohydrate data.
3. **Resolve carbohydrate sources.** Match existing Fineli/AFCD/MEXT/USDA/product entries by food identity, preparation and versioned alias; rank exact matches first, propose alternatives with evidence. Do not silently override original recipe amounts; any GK-only exact version is explicit.
4. **Resolve GI source candidates.** Read the versioned GI Knowledge Base interface (initially a read-only adapter to `glycemic-index-records.json`, later the curated index). Return match type `DIRECT | JUSTIFIED_ANALOGUE | SOURCE_BACKED_SCENARIO | UNRESOLVED`, confidence, preparation/food mismatch details, source link and license/reuse review status. **Discovery is not approval.** Do not transfer whole-meal GI between unlike meals, use category averages as direct measurements, or invent GI for low-CHO items.
5. **Compute candidate and sensitivity.** Reuse existing model and GPT100 factory packet contract; only calculate from known, source-backed quantities and allowed GI assignments. Distinguish a point estimate, named scenario interval, and unquantified uncertainty. Calculate omitted available CHO per ingredient and per serving; for small predicted GK, assess omitted CHO relative to estimate as well as absolute size. Label provisional assumptions and unmodeled contribution. A range must have endpoint evidence; not an arbitrary “±20%.”
6. **Route.** Emit `READY_FOR_APPROVAL | REVIEW_REQUIRED | OWNER_DECISION | BLOCKED` alongside individual blocker IDs, precise next actions, reusable evidence and pinned SHA/input lineage. Automatically reuse identical *approved source records*, not unreviewed recipe calculations. Keep `REVIEW_REQUIRED` separate from missing-data failures.
7. **Handoff.** Feed hashed candidate packets and classifier output to existing `gk:approval-check` contract. Provide owner batch summaries; no automated owner approval, `publicationAuthorized:true`, merge, CI bypass or deployment.
8. **Recipe revision semantics.** Changed ingredient mass, preparation, source, or original recipe hash invalidates prior approval. Translation-only or editorial changes are evaluated against existing hash policy; do not silently reuse expired approvals.

## Missing GI as normal workflow

- Never block recipe creation because an exact GI is unavailable.
- Search locally curated records, approved aliases, then source-backed relevant analogues; queue external research **only for materially relevant carbohydrate contributions**.
- Emit a short research ticket with recipe ID, ingredient/food, preparation, available CHO g/serving, candidate comparators, exact missing information and impact. Deduplicate requests by food + preparation + source version.
- Source gaps and newly verified GI values feed the separate GI Knowledge Base PR; new GI observations must pass provenance, method, match and reuse gates before reusable status.
- If unknown or significant contributions make numeric GK indefensible, leave it **unpublished** and allow other recipes through; use a qualitative explanation only where separately authorized and do not count it as numeric GK coverage.

## Minimum implementation milestones

**M1 — Existing-repo adapter (self-contained, no database migration).** CLI to inspect one draft recipe, match existing known nutrition/GI entries with a read-only adapter, and emit a deterministic machine-readable assessment with hash-based provenance. No new publication integration.

**M2 — Complete calculation.** Ingredient mass normalizer, evidence-ranked source matching, omitted-CHO sensitivity, named scenarios and explicit blockers. No default GI assumptions.

**M3 — Approval Factory handoff.** Hash-pinned batch manifest and classifier metadata using existing GK100 schema. Preserve four-language explanations and original recipe; owner makes content decisions.

**M4 — Creation workflow.** Hook the non-mutating assessment into Codex recipe-creation instructions; prompt for GK evaluation as part of recipe work. Avoid automatic paid external research, expensive tests or repeated full-repository scans. Evaluate whether CI should require presence of a GK assessment artifact or an explicit unresolved reason for *newly published* recipes—not a numeric GK value.

## Acceptance and safety tests (minimal)

- New draft with complete known ingredients produces a reproducible GK candidate, still unapproved.
- New draft with unknown GI yields an actionable research ticket and no invented numerical value.
- Different raw versus cooked amount yields different correctly documented binding.
- Significant omitted CHO invalidates an unsupported low GK point.
- No-GI ingredient that materially affects GL cannot become silently zero.
- Hash-changing edit invalidates any stale owner approval.
- Duplicate input and unsupported source-use are rejected; one blocked recipe does not block the batch.
- Existing published 207/326 baseline, approved GK-only variants, and output routes remain unchanged by the planning PR.

## Ownership and delivery

Work on a distinct branch/worktree. Do not edit active GK100 classification/release PR branches or `gk100-approved-releases` during implementation. No merges or production changes without explicit authorization. Use Resource Economy: targeted checks, one push per cohesive chunk. Deliver a focused follow-up implementation PR separate from this **planning** PR.

**Definition of done for this planning PR:** explicit interface, staged tasks, review gates, dependency on GI Knowledge Base, acceptance tests and a safe migration path, not a claim that automatic GK creation is implemented.

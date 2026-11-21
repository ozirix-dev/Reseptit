# Chat 5 / #369 – FI source-quality gate integration notes

Status: **Draft**, not a recipe publication or an approval of existing FI sources.
Owner: **Chat 5**.

## Purpose

The translation batch partitioner must not classify FI/EN/SV/TH translations as
`candidate` on the strength of translation hashes and `ai-compared-draft`
alone. A source can be faithfully translated yet unsafe or unworkable.

`site/scripts/translation-fi-source-quality.ts` provides a separate, versioned
review statement for the Finnish source; this module validates **evidence
completeness**, not culinary truth.

## Entry and failure behavior

The key is `recipe_id`. Each decision contains:
- `source_hash`: the current `semanticHash(source)` SHA-256;
- `decision`: `pass` or `hold`, with `reviewed_at`,
  `reviewed_by` and a substantive `reference`;
- explicit checks for ingredients, preparation method, food safety, servings
  and time, nutrition and glycemic applicability;
- findings with `P0..P3` severity and `open/resolved` status.

No proof, stale FI hash, HOLD decision, incomplete mandatory check,
glycemic HOLD or unresolved P0/P1 finding yields **source-hold**, even if
every translation is perfectly aligned. A glycemic `unavailable` with an
evidence reference is compatible with source-quality review; it does **not**
authorize a numeric GK or bypass the GK release gate.

The CLI accepts `--fi-quality=path/to/review.json`. Without this file,
the **conservative default is an empty evidence map**, so no source becomes
a candidate. This may make historical batch scripts stricter: migration
requires separately reviewed FI source decisions, not an automatically
generated all-PASS ledger. Never fabricate a reviewer or decision simply
to restore previous candidate counts.

Example command, once a genuinely reviewed evidence file exists:

```bash
cd site
npx tsx scripts/translation-batch-partition.ts --ledger=docs/reviews/<ledger>.json --fi-quality=meta/kaannokset/<reviewed-fi-evidence>.json --out=/tmp/fi-partition.json
```

The `--fi-quality` path is only an example input and is **not currently
committed as an approved evidence register**.

## Test coverage and remaining gates

Synthetic tests cover FI-01 missing cooking fat, FI-02 irrelevant cooking
step, FI-03 raw material or unit uncertainty, FI-04 unsafe temperature,
FI-05 changed FI hash, unmeasured water as a false-positive avoidance
case, and missing quality evidence. These are model input fixtures,
not results of testing physical dishes or real source files.

Before promotion from Draft: run the target TypeScript tests and
`npm run typecheck`, review existing consumers of
`partitionFromLedger`, confirm CI emits SHA-pinned
`candidate / needs_review / source_hold` JSON + Markdown only for
relevant changes, and pilot with independent FI source reviews.

No merge, auto-publish, nutritional revision, GK seal update or Cloudflare
deployment is authorized by this document.

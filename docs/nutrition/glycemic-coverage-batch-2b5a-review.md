# GI/GK batch 2B5A — safe continuation review

## Scope and starting state

This is a continuation of batch 2B5 on the existing branch. It preserves the published baseline at `2f9cdd844a276cb284b02a01b0f501d3cb8540fb`. The immutable baseline remains 325 recipes: 127 calculated, 198 incomplete, and 39 GI records (5 STRONG, 34 SUPPLEMENTARY). The 2B5 baseline JSON and its historical snapshots were not regenerated or overwritten.

The 2B5A review was limited to four requested recipes. No recipe ingredient, amount, serving count, ordinary nutrition value, GI catalog value, formula, or tolerance limit was changed.

## Disposition

| recipeId | Result | Finding |
| --- | --- | --- |
| `raejuusto-pesto-kasviskulho` | PASS | Replace two invalid broad category GI assignments with documented omissions under the existing per-ingredient and cumulative tolerance. Composition and source quantities remain known. |
| `chettinad-kana` | PASS | Remove unsupported vegetable/nut category assignments from three measured sub-1 g portions. Composition rows distinguish fresh ginger from ground coriander seed; no coriander leaf proxy is used. |
| `sitruuna-yrttikana-parsa` | BLOCKED | 400 g raw green asparagus / 4 servings maps to 1.4 g available carbohydrate per serving. This exceeds the individual omission allowance; no preparation-matched GI evidence was accepted in this bounded review. |
| `congee-riisipuuro` | BLOCKED | The 2 L stock has no product identity. The mapped generic prepared stock contains 0.4 g available carbohydrate/100 g (2.0 g/serving); the recipe also allows water instead. This exceeds the omission limit and cannot be assumed to be zero. |

## PASS calculations

### `raejuusto-pesto-kasviskulho`

The recipe remains 4 servings. The existing Fineli records give roasted pine nuts 5.02 g available carbohydrate/100 g and arugula 0.5 g/100 g:

- Pine nuts: 30 g × 5.02% ÷ 4 = **0.3765 g/serving**.
- Arugula: 40 g × 0.5% ÷ 4 = **0.0500 g/serving**.
- Other existing omissions: pesto **0.104475 g/serving** and pepper upper bound **0.1000 g/serving**.
- Total omitted available carbohydrate: **0.630975 g/serving**. Each omitted contribution is below 1 g and the cumulative amount is below 2 g.

Neither pine nuts nor arugula is assigned a guessed GI. The composition records remain `fineli-30968-2026-10-24` and `fineli-34159-2026-10-24`. Existing matched ingredients contribute an unrounded model GK of **0.861/serving**, stored as **0.86**, and displayed as **0.9**. GK class: **LOW**; confidence: **LOW**. LOW confidence reflects the existing broad/analogue GI matches and the editorial omissions; it is distinct from the LOW GK class.

### `chettinad-kana`

The recipe remains 4 servings. Existing composition mappings resolve fresh ginger, black pepper, and ground coriander seed separately:

- Fresh ginger, 15 g per recipe: 4.8 g available carbohydrate/100 g → **0.180 g/serving**.
- Black pepper, 2 g per recipe: **0.193 g/serving** from `afcd-F006618-2026-10-24`.
- Coriander seed, 2 g per recipe: the recipe explicitly says seeds, toasted and ground during preparation; the existing ground seed record `afcd-F003190-2026-10-24` gives **0.042 g/serving**. Fresh coriander is not used as a match.
- Existing omissions for fennel seed, cinnamon, optional curry leaves, and other culinary quantities remain unchanged. With the three corrected GI assignments removed, the complete omitted amount is **1.17125 g/serving**, below 2 g; every component is below 1 g.

These portions have no GI assigned; no category GI value is represented as a measurement of them. The remaining supported ingredients yield an unrounded model GK of **0.6032/serving**, stored and displayed as **0.6**. GK class: **LOW**; confidence: **LOW**.

## Bulgur and couscous follow-up note

No experimental GI record or input mapping for bulgur or couscous remains from the previously rejected trial. Tabbouleh remains blocked; its input and evidence fingerprints are unchanged by this continuation. The 2020 paper reports bulgur GI 64.5 ± 36.8 and couscous GI 99.0 ± 36.0 (n=8 each), but these values were not added or assigned in 2B5A because grind/product and recipe preparation matching were not established. Sources: [PubMed record](https://pubmed.ncbi.nlm.nih.gov/32227786/) and [DOI](https://doi.org/10.32394/rpzh.2020.0101).

## Regressions and inventory

The new recipe-specific regression checks assert the two results above, servings, displayed rounding, GK class, separate confidence, omitted carbohydrate, exact composition record IDs, input/evidence/recipe fingerprints, and the all-recipe audit rows. They also verify that a deliberately wrong food-family GI assignment and unknown composition remain blocking. Existing common tests continue to cover the 1 g and 2 g boundaries.

The 2B5 current inventory is regenerated from the immutable baseline after these changes and includes every recipe ID exactly once. The prior 127 calculated estimates are compared against that baseline; both new estimates are newly calculated recipes, not changes to previously published GK values. Strict nutrition state remains governed by the unmodified audit input.

## Sources and limitations

- Pine nuts, arugula, ginger, black pepper, coriander seed, and stock carbohydrate values use the already linked Fineli Release 20 or AFCD Release 3 food records in `food-records.json`; their source IDs and states are preserved in the calculation input.
- This report does not claim the model estimates a measured mixed meal or an individual glucose response. Small-portion omission is the existing editorial tolerance, not a clinical error bound.
- No other candidates, recipe quantities, the Hyderabadi biryani issue, or the 2B6 workstream were changed.

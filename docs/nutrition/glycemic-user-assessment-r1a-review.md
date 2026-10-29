# GK 2.1 R1A – Stage B feasibility review

Status: **Ready for independent review**
Repository: `ozirix-dev/Reseptit`
Worktree: `D:\Projects\tmp\reseptit-gk-2-1-r1a`
Branch: `codex/gk-2-1-r1a`
Locked production main: `8529c4ededaa69f3db06a6532533240751e4411a`
Locked sample: [glycemic-user-assessment-r1a-selection.json](glycemic-user-assessment-r1a-selection.json), revision 2
Review date: 2026-10-29

This is a research and documentation review only. No recipe, GI record, nutrition calculation input, displayed GK, formula, tolerance, UI, or historical baseline was changed. The new files in this branch are the locked sample and this review.

## Decision

**NO-GO for adding any new user-facing GK assessment output from this R1A evidence.** The 30-recipe sample supports no new point estimate, bounded range, class-only result, or conditional scenario. Existing points remain legacy outputs with LOW confidence and are not newly approved by this review.

A later bounded R1B may investigate a **clearly labelled carbohydrate-only** view for selected recipes whose available carbohydrate evidence, preparation, serving count, and current recipe binding reconcile. There are 11 incomplete sample recipes with an ESTIMATE WITH EVIDENCE nutrition-audit record that could be screened for that purpose, but **zero are approved here**. Several contain mismatched or incomplete bindings; the nutrition audit status alone does not make them ready for display. Do not present partial GL carbohydrate subtotals as a recipe total.

This is a GO to continue with source and binding corrections, not permission to publish values. No GK model or coverage work should begin until independent review accepts this report and the identified recipe-level evidence problems are resolved.

## Production baseline, PR #130, and guard

PR #130 was confirmed MERGED at `8529c4ededaa69f3db06a6532533240751e4411a`. Main CI run [40919916819](https://github.com/ozirix-dev/Reseptit/actions/runs/40919916819) passed, including the GI/GK calculation regressions, GI/GK coverage audit, build, and Pages deployment.

In this R1A worktree, `npm run audit:glycemic-load` reproduced **326 recipes / 85 calculated / 241 incomplete**. The locked production input records **45 GI records**. The identity guard passed for `ozirix-dev/Reseptit`, the worktree path, and its origin before documentation work.

Strict nutrition audit across 326 recipes reports 0 VERIFIED, 180 ESTIMATE WITH EVIDENCE, 86 INSUFFICIENT SOURCE DATA, and 60 MISSING. These are nutrition-audit categories, not user-facing GK output approvals.

## Locked sample method and coverage

The 30 are purposively selected, six per PR #118 stratum. This is a feasibility screen, not a representative sample and cannot estimate outcomes for the other 296 recipes.

1. GI uncertain with carbohydrate composition: pizza-margherita, jauheliha-makaronilaatikko, marjakiisseli-vaniljakastikkeella, yangzhou-paistettu-riisi, lahi-ita-fattet-hummus, pohjoisafrikkalainen-kuskus-aamiaiskulho.
2. Missing or preparation-contradictory GI: poronkaristys-kukkakaalimuusilla, kesakurpitsalasagne-vhh, liha-juureskeitto-perunaton, caponata, pasta-alla-norma, koshari.
3. Alternative liquid or product form: savulohi-avokadokulho, valimerellinen-ricotta-persikkakulho, vietnamilainen-hu-tieu-aamiaiskeitto, japanilainen-soba-aamiaiskeitto, indonesialainen-bubur-sumsum, kimchi-jjigae.
4. Missing composition or mass: paprikauunimunakkaat, bulgogi, tomaatti-kananmuna-wokki, kreikkalainen-moussaka, chettinad-kana, baozi.
5. Small carbohydrate or LOW-confidence user impact: vhh-mokkapalat, vhh-brita-kakku, halloumimunakas, keto-pinaattiletut, keto-pannukakku, kurkku-oliivi-aamiaiskulho.

Eleven R0 reviews are reused and marked in the locked JSON. Hummus was excluded before deep review because strict nutrition audit found no calculation evidence; lahi-ita-fattet-hummus replaced it, keeping the final 30 locked before selecting the eight deep cases.

### Light screen: all 30

“Model CHO subtotal” is the sum of composition values available to the current GL input, not necessarily the complete recipe total. It must not be read as a carbohydrate-only output where sources or bindings are incomplete. Omission is the current model’s omitted available carbohydrate per serving; satisfying its numeric editorial limit is not clinical validation. Current class uses the existing whole-number class boundaries; confidence is separate.

| Recipe | Current GK / state | Class; confidence | Model CHO subtotal / omitted g per serving | Strict nutrition audit net CHO; status | Main screen finding |
|---|---:|---|---:|---|---|
| pizza-margherita | null / incomplete | — | 114.584 / 0.137 | 114.54; estimate with evidence | Flour GI is REFERENCE_ONLY; no matched primary human GI for this preparation. Raw tomato GI is not cooked crushed tomato. |
| jauheliha-makaronilaatikko | 18.23 / calculated | medium; low | 35.963 / 0 | 37.18; insufficient source data | GL input contains only 3 of 14 recipe ingredients; dairy and pasta use broad category means. |
| marjakiisseli-vaniljakastikkeella | 19.93 / calculated | high; low | 35.744 / 0.013 | 35.74; estimate with evidence | Frozen mixed berries are cooked; generic fruit mean and dairy mean do not establish those forms. |
| yangzhou-paistettu-riisi | 24.71 / calculated | high; low | 39.263 / 1.202 | 40.97; estimate with evidence | Cold overnight rice is stir-fried; broad rice mean is not preparation matched. Rice dominates the point. |
| lahi-ita-fattet-hummus | 18.33 / calculated | medium; low | 33.608 / 0.068 | 33.61; estimate with evidence | Pita, chickpea, and yogurt use broad proxies; no new point support. |
| pohjoisafrikkalainen-kuskus-aamiaiskulho | 34.36 / calculated | high; low | 38.320 / 0 | 42.52; estimate with evidence | Human couscous GI study exists, but product-specific transfer and the 4.20 g/serving CHO discrepancy need review. |
| poronkaristys-kukkakaalimuusilla | 3.09 / calculated | low; low | 5.737 / 0.716 | 5.65; estimate with evidence | R0 reuse. Cauliflower preparation and dairy transfer remain uncertain; omission is not a clinical limit. |
| kesakurpitsalasagne-vhh | 2.77 / calculated | low; low | 6.691 / 0.508 | 6.66; insufficient source data | R0 reuse. Cooked tomato and dairy source transfer remain uncertain. |
| liha-juureskeitto-perunaton | null / incomplete | — | 5.626 / 0.660 | 5.61; estimate with evidence | Rutabaga GI is unsupported; additional positive small ingredients lack verified bounds. |
| caponata | null / incomplete | — | 13.869 / 0.843 | 13.87; estimate with evidence | Canned crushed tomato lacks a matched GI; raw whole tomato proxy was removed. |
| pasta-alla-norma | null / incomplete | — | 65.214 / 0.691 | 64.86; estimate with evidence | Canned crushed tomato GI missing despite substantial pasta CHO; no total GK. |
| koshari | null / incomplete | — | 95.736 / 0.216 | 95.71; estimate with evidence | Onion GI 15 withdrawn; 1.32 g onion CHO/serving exceeds omission cutoff. Cornstarch is incorrectly mapped to potato-products GI. |
| savulohi-avokadokulho | 0.40 / calculated | low; low | 1.073 / 0.287 | 0.89; insufficient source data | R0 reuse. Low point depends on product-form analogues; nutrition audit does not reproduce complete evidence. |
| valimerellinen-ricotta-persikkakulho | 4.08 / calculated | low; low | 9.975 / 0.120 | 8.27; estimate with evidence | R0 reuse. Canned peach and ricotta are not generic fruit/dairy matches. |
| vietnamilainen-hu-tieu-aamiaiskeitto | null / incomplete | — | 43.020 / 0.250 partial | 42.08; estimate with evidence | Recipe says water in structured ingredient data but also permits broth; GL binding has an unspecified liquid and stale recipe structure. |
| japanilainen-soba-aamiaiskeitto | null / incomplete | — | 35.765 / 0.165 partial | null; missing | Dashi composition, spinach mass, and broth choice unresolved. |
| indonesialainen-bubur-sumsum | null / incomplete | — | 114.575 / 0 partial | null; missing | 200 ml coconut milk lacks food-specific mass conversion; 150 g pandan is anomalous and unverified. |
| kimchi-jjigae | null / incomplete | — | 1.087 / 1.087 partial | null; missing | Kimchi, paste, and broth/water composition unresolved; unknowns are not zero. |
| paprikauunimunakkaat | null / incomplete | — | 0.656 / 0.656 partial | 8.00; insufficient source data | 460 g pepper has no food record / color; known input is only a partial subtotal. |
| bulgogi | null / incomplete | — | 62.500 / 0.671 partial | 62.81; estimate with evidence | Spring onion mass is missing in a rice-based high-CHO dish. |
| tomaatti-kananmuna-wokki | null / incomplete | — | 38.787 / 0.695 partial | 38.93; estimate with evidence | Spring onion mass is missing; rice GI remains a category proxy. |
| kreikkalainen-moussaka | null / incomplete | — | 32.129 / 0.547 partial | 32.22; estimate with evidence | Cinnamon mass is missing and flour GI is REFERENCE_ONLY. |
| chettinad-kana | null / incomplete | — | 3.647 / 1.460 partial | 3.59; estimate with evidence | Positive fennel/curry-leaf CHO has no verified mass or source-backed upper bound; fails omission eligibility. |
| baozi | null / incomplete | — | 79.943 / 1.548 partial | 80.36; estimate with evidence | Flour GI is REFERENCE_ONLY; spring onion mass and cornstarch mapping unresolved. |
| vhh-mokkapalat | 0.08 / calculated | low; low | 0.943 / 1.024 | 1.15; estimate with evidence | R0 reuse. Tiny LOW point is dominated by omitted ingredients and is not useful as a precise point. |
| vhh-brita-kakku | 0.79 / calculated | low; low | 2.618 / 1.079 | 2.72; estimate with evidence | R0 reuse. Raw strawberry candidate is unpublished; cream proxy and other omissions remain. |
| halloumimunakas | 0.82 / calculated | low; low | 3.500 / 0.524 | 3.42; insufficient source data | Dairy category transfer; part of the 2B source-risk set. |
| keto-pinaattiletut | 0.47 / calculated | low; low | 2.210 / 0.877 | 2.08; insufficient source data | Small LOW point with cumulative omissions and dairy/cheese category dependency. |
| keto-pannukakku | 0.86 / calculated | low; low | 3.005 / 0.555 | 3.01; insufficient source data | Small LOW point; cream/cream-cheese category dependency. |
| kurkku-oliivi-aamiaiskulho | 0.31 / calculated | low; low | 2.186 / 1.046 | 2.07; insufficient source data | Small LOW point; feta category proxy and omissions can exceed the displayed precision. |

Screen totals: **15 current CALCULATED / 15 incomplete**. All 15 calculated results have LOW confidence: 3 high-class, 2 medium-class, 10 low-class. None was changed. Strict nutrition audit in the sample: 19 ESTIMATE WITH EVIDENCE, 8 INSUFFICIENT SOURCE DATA, 3 MISSING, 0 VERIFIED.

## Deep review: eight recipes

All recipes, quantities, and instructions below are the current reviewed recipe forms. Ingredient lists are included because method, product form, omitted carbohydrate, and serving basis affect whether any result is supportable.

### 1. Pizza Margherita — no point or range

Two servings: wheat flour 300 g, water 2 dl, dry yeast 3 g, salt 1 tsp, crushed tomato 200 g, drained mozzarella 200 g, basil 8 leaves, olive oil 1 tbsp. Flour and tomato dominate the known 114.584 g available-CHO model subtotal (114.54 g/serving in the separate nutrition audit). Dough is baked with crushed tomato and cheese.

The flour GI record is REFERENCE_ONLY: a heterogeneous bakery finished-product mean does not measure this flour in pizza dough. No preparation-matched human GI source for the recipe flour/dough was verified. GI 22 for raw whole tomato cannot be transferred to canned crushed tomato/baked sauce. Present GK is null. The 0.137 g omitted subtotal is yeast and basil only; it cannot cover flour's missing GI. No GI range, class-only, or recipe total is supportable. The large CHO quantity could make a carbohydrate-only estimate useful, but flour identity/composition and the 114.54 vs 114.584 g bookkeeping must first be reconciled.

### 2. Beef macaroni casserole — existing 18.23 is not newly accepted

Eight servings. Fourteen recipe ingredients: dried macaroni 400 g; 7% ground beef 600 g; onion 70 g; oil 13.5 g; cottage cheese 2–5% 500 g; 6 eggs; milk 1.5% 200 g; cooking cream 15% 200 g; grated Emmental 200 g plus 100 g; garlic powder 3 g; black pepper 1 g; paprika 2 g; salt 6 g. Pasta is cooked, mixed with the other ingredients, and baked as a casserole.

The GL input binds only three of those fourteen: macaroni 400 g, cottage cheese 500 g, and milk 200 g. Their model CHO subtotal is 35.963 g/serving versus 37.18 g net CHO in the audit; strict nutrition audit says INSUFFICIENT SOURCE DATA, and no omitted ingredient rows exist to validate a tolerance. Current 18.230875 (shown 18.23), medium class, low confidence, is mainly macaroni contribution 17.264 plus dairy category contributions 0.547 and 0.420. The 2021 dairy mean is not cottage-cheese-specific. The AJO 2B diagnostic classifies this as C: removing the dairy proxy blocks the recipe.

Wolever et al. tested macaroni (GI 68±8), spaghetti (45±6), and star pastina (54±6) in 13 people with diabetes; that supports the claim that pasta form matters, not transfer to this exact dried pasta or the mixed baked casserole. No recipe GI range or class-only result follows. First fix all 14 calculation bindings and source review; do not use a small-portion tolerance to bridge eleven absent ingredients.

### 3. North African couscous breakfast bowl — high current point, not a supported class

Two servings: couscous 100 g, dried pitted dates 10 g, almonds 20 g, yogurt 100 g, water 100 ml, salt to taste. The couscous is hydrated with boiling water and covered for five minutes. Existing model subtotal is 38.320 g available CHO/serving and GK 34.35692 (34.36, high class, low confidence). Strict nutrition audit gives net CHO 42.52 g/serving, a 4.20 g difference that must be reconciled before even a CHO-only result.

Różańska et al. measured GI for couscous sold on the Polish market using a 50 g available-carbohydrate test portion against the same amount from a standard food; the reported couscous GI was 99±36 on the glucose reference scale. It is direct human GI evidence for the tested market product, not a study of this recipe's unidentified product, brand, exact hydration, dates, almonds, or yogurt. The SD is not a lower/upper bound. Current ingredients also use date, nut, and dairy category/analogue records. The AJO 2B removal diagnostic is C because yogurt GI 35 removal blocks the recipe. A plausible interval crosses class boundaries; CLASS_ONLY is not demonstrated. No new point or range is approved.

### 4. Yangzhou fried rice — high class is sensitive to broad rice proxy

Four servings: 600 g cooked rice, cooled overnight; 2 eggs; shrimp 150 g; peas 100 g; cooked ham 100 g; neutral oil 2 tbsp; soy sauce 2 tbsp; 2 spring onions; ½ tsp salt. The recipe specifically cools the cooked rice overnight, then reheats/stir-fries it in a wok.

Current GK is 24.71358 (24.71, high, low confidence). Rice accounts for 23.679 of the current point via a broad rice category GI 67. The model omits 1.20225 g CHO/serving: measured portions for egg, ham, soy sauce, salt; each is below 1 g and their combined omission is below the existing editorial 2 g cutoff. This is numerically within the model rule, but it is not a clinical threshold and does not validate the rice GI or the recipe total.

Chiu & Stewart studied four white-rice varieties and cooking methods, including samples refrigerated three days at 4°C and reheated; in 21 healthy adults the selected high- and low-resistant-starch samples did not differ significantly in GI. Strozyk et al. studied long-grain white rice in 32 people with type 1 diabetes, comparing freshly served rice with rice cooled 24 hours at 4°C and reheated; glucose responses differed, with more hypoglycemic episodes during the cooled-rice condition at standard insulin dosing. Neither study is a GI determination for this Yangzhou dish or supports a recipe-specific GI bound. Do not create conditional scenarios from those studies. Point, range, and class-only are unsupported while rice identity and cooking method lack a matched GI.

### 5. Koshari — GI blocker and explicit mapping error

Four servings: brown lentils 200 g, rice 200 g, small macaroni 150 g, 2 onions, cornstarch 2 tbsp, olive oil 3 tbsp, crushed tomato 400 g, garlic 2 cloves, red-wine vinegar 2 tbsp, cumin 1 tsp, ½ tsp salt, lemon juice 1 tbsp. Recipe combines cooked lentils, rice and pasta with fried onion and tomato/vinegar sauce.

GK is null. The model's available-CHO subtotal is 95.736 g/serving; the separate net-CHO audit says 95.71 g/serving, an arithmetically close but not source-complete result. Onion is represented as 110 g in the calculation input (1.32 g available CHO/serving). Because it exceeds the per-item <1 g tolerance, withdrawn onion GI 15 cannot be restored through the small-portion rule. Further, 16 g cornstarch is mapped to GI 71 for potatoes and potato products. That is a food identity mismatch, not a tolerable proxy. The remaining rice 67, pasta 52, lentil 34, and raw-tomato 22 values are also broad/analogue matches; raw tomato does not match crushed/cooked tomato. Garlic/vinegar small-portion rows do not fix any of these blockers. No point/range/class or CHO-only release until mapping and composition review; a later CHO-only assessment is feasible only after recipe and nutrition evidence reconcile.

### 6. Vietnamese Hu Tieu breakfast soup — scenario idea is not yet calculable

Two servings: rice noodles 100 g, pork tenderloin 150 g, mung-bean sprouts 150 g, coriander 2 tbsp, and salt. Structured recipe data lists 700 ml water, while prose permits/mentions broth and the current GL input binds an unspecified vegetable-or-chicken broth with no grams. The cooking liquid is materially relevant and currently unknown.

The GL model subtotal is 43.020 g/serving but is partial; audit net CHO is 42.08 g/serving and ESTIMATE WITH EVIDENCE. The calculation flags the recipe binding as stale, so those numbers do not presently reconcile to one recipe version. Rice noodles are represented by pasta-category GI 52, sprouts by vegetables-category 66, and broth has no selected quantity/composition. Water, milk, vegetable stock, and chicken stock are not interchangeable scenarios unless exact recipe quantities and nutrition are specified. No valid conditional-scenario set, range, total CHO output, or GK output is supported. First reconcile recipe wording, selected liquid, grams, and binding.

### 7. Baked pepper omelettes — missing composition blocks carbohydrate total

Two servings: two large peppers, 4 eggs (about 220 g), cheese 40 g, chives 1 tbsp (about 7 g), salt and pepper (unweighed; model uses a standard small assumption). The pepper record is 460 g but colour is unspecified and no matching Fineli food record is bound.

GK is null. Only 0.656 g/serving is in the current partial GL subtotal; audit net CHO is 8.00 g/serving but marked INSUFFICIENT SOURCE DATA because the pepper composition calculation evidence is missing. Egg, chive and seasoning omissions do not permit the 460 g pepper to be guessed or tolerated. This is not a CHO-only candidate until the pepper colour/form and a verified composition source are recorded. No GI output mode is available.

### 8. Brita cake — existing 0.79 is not supportable as a point

Eight servings: butter 100 g, erythritol 70 g, egg yolks 60 g, almond flour 100 g, baking powder 4 g, egg whites 105 g, erythritol for meringue 60 g, cream 200 g, strawberries 150 g. Cake is baked, filled with cream and raw strawberries.

Current GK is 0.78925 (0.79, low class, low confidence), but AJO 2B class C diagnostic blocks it after category means are removed. Net CHO is 2.72 g/serving, audit ESTIMATE WITH EVIDENCE; model subtotal is 2.618 and omission 1.079 g/serving. Strawberry is 1.05 g CHO/serving and has an apparent raw-strawberry GI 40±7 entry in the 2021 tables, but that entry points to unpublished Sydney observations; it is not a traceable published primary human source under the current project source standard. It does not establish GI for the cake. Cream uses the broad dairy mean; almond meal's former bakery GI mapping was withdrawn as a food mismatch. Baking-powder and small ingredient tolerances are not clinically meaningful bounds. No point, range, or class-only value is supported. CHO-only may be investigated after source and recipe binding reconciliation.

## Output-mode feasibility and omission rule

- **POINT:** 0 new points supported. The 15 current sample points are all LOW confidence and all remain historical outputs only.
- **RANGE:** 0 supported. No reviewed case has same-product, same-preparation, source-backed lower and upper GI bounds with compatible CHO bounds. Study SD/SEM is not automatically an interval.
- **CLASS_ONLY:** 0 supported. No source-backed bounds prove the same class across accepted cases, especially for the rice and couscous high-class examples.
- **CONDITIONAL_SCENARIOS:** 0 supported now. Hu Tieu and several soups expose choices, but quantities, ingredient nutrition, or recipe binding are unresolved; distinct choices cannot be presented as valid scenarios without defining each.
- **CARBOHYDRATE_ONLY:** 0 approved in R1A. Eleven of the 15 GK-incomplete cases have an ESTIMATE WITH EVIDENCE nutrition audit entry that may warrant a recipe-specific follow-up; four other incomplete cases are INSUFFICIENT or MISSING. The 11 are candidate investigations, not outputs. In particular, Hu Tieu has unresolved liquid/binding; pizza has a source/form reconciliation; koshari's onion and cornstarch issues remain; paprika lacks pepper composition.
- **UNAVAILABLE:** appropriate where a material CHO mass/composition or GI source is unknown. Unknown is not zero.

The existing editorial rule allows an individual unmatched portion only below 1 g available CHO per serving and a cumulative total strictly below 2 g, when recipe amount and source-backed carbohydrate bounds are real. The bound does not make an unmatched GI valid, and it is not a physiological or clinical tolerance. Three examples illustrate the limit: Yangzhou's 1.202 g omitted is measured and numerically within the editorial rule but does not support the dominant rice GI; Koshari onion is 1.32 g and fails the individual cutoff; Chettinad's 1.46 g omissions include positive quantities without verified mass/composition bounds and cannot qualify. Brita's small arithmetic totals likewise do not resolve the strawberry source, dairy proxy, or almond mapping.

## All 33 Dairy/Fruit GI-risk recipes considered

The AJO 2.0B report was read from its source branch. Its diagnostic removed the Dairy 35 and Fruit 51 category IDs only in memory; it did not change inputs or baselines. Of 33 currently calculated affected recipes, 25 become incomplete (class C) and 8 remain calculable in that diagnostic (class B) because other source paths remain. B means “still calculable after this single-source diagnostic,” not source-approved or safe to publish. No affected GK is upgraded.

**Class C (25, diagnostic becomes incomplete):** munakasrulla-pinaatti-tuorejuustolla; jauheliha-makaronilaatikko; lihapullat-kermakastikkeessa-vhh; kanakorma-kukkakaaliriisilla; jauhelihakastike-kesakurpitsanuudeleilla; marjakiisseli-vaniljakastikkeella; pannacotta-marjakastikkeella; souvlaki; raejuusto-pesto-kasviskulho; vhh-brita-kakku; vhh-lohikeitto-kukkakaalilla; kukkakaaligratiini-pekonilla; broileri-kukkakaaligratiini; kermainen-lohipata; paahdettu-aamiaismunakoiso; halloumimunakas; keto-pannukakku; keto-pinaattiletut; lahi-ita-fattet-hummus; pohjoisafrikkalainen-kuskus-aamiaiskulho; karibia-mango-limejogurtti; lahi-ita-zaatar-munat; valimerellinen-jogurttikulho-hunajalla; valimerellinen-ricotta-persikkakulho; tandoorikana.

**Class B (8, diagnostic still calculated but not approved):** poronkaristys-kukkakaalimuusilla; vhh-mokkapalat; kesakurpitsalasagne-vhh; valimerellinen-menemen-fetalla; kurkku-oliivi-aamiaiskulho; savulohi-avokadokulho; keto-joulutortut; valimerellinen-pinaatti-fetashakshuka.

The locked 30 overlap 14 recipes with that set: five B (poronkaristys, zucchini lasagne, smoked salmon bowl, moka squares, cucumber-olive bowl) and nine C (macaroni casserole, berry kissel, Brita, halloumi omelette, keto spinach pancakes, keto pancake, Fattet hummus, couscous bowl, ricotta-peach bowl). The source review found category means of Dairy GI 35 (SD 11, n=186) and Fruit GI 51 (SD 11, n=105) aggregate heterogeneous products/forms. The fruit table includes raw, cooked, canned, dried, juice, puree, and mixed entries; it cannot establish an arbitrary fruit/preparation. The dairy group combines materially different products and cannot establish cream, cottage cheese, yogurt, ricotta, feta, halloumi, or cream cheese individually. Category SD is not a per-recipe uncertainty interval.

The next source corrections should prioritize exact dairy product/form evidence (cream, yogurt, and cheeses), then cooked/frozen berry composition and form, the unpublished raw-strawberry entry's admissibility, and exact fig/canned-peach forms. Recalculate only actual users after independent review.

## Baselines, regression checks, and remaining evidence work

The following historical baseline artifacts and published recipe state were left unchanged. The locked 2026-10-25 coverage baseline still reports 326 / 85 / 241 / 45. The regenerated audit reported 38 existing structural binding mismatches against its older per-recipe binding review snapshot; these are baseline diagnostics, not R1A changes. Calculation input mismatches and calculation evidence mismatches were both 0. The locked JSON records the five source/input hashes used for selection.

Existing audits and regressions run:

- `npm run audit:nutrition -- --strict`: exit 0; full inventory totals above.
- `npm run audit:glycemic-load`: exit 0; 326 / 85 / 241.
- `npm run test:glycemic`: PASS, 85/85.
- `npm test`: PASS, 155/155.
- `npm run build`: PASS; content sync, strict nutrition audit, GK audit, TypeScript, production bundle, and 691-route prerender all completed. Existing Vite large-chunk advisory remains non-failing.
- PR #130 main CI: PASS, including GI/GK tests and coverage audit; Pages deploy job PASS.

No historical baseline was rewritten or recaptured. No new tests were added because R1A did not modify model logic.

## Recommended next work after review

1. Correct the incomplete macaroni casserole input (14 ingredients vs 3 bound) and check all current source bindings before considering its legacy point.
2. Resolve Koshari's corn-starch-to-potato mapping and source review for onion, tomato, rice, pasta, and legumes.
3. Reconcile Hu Tieu's structured water amount, prose alternatives, selected liquid, and stale GL binding.
4. Establish missing pepper record for the omelette and missing mass/composition records in the other screened recipes.
5. Audit product-specific dairy and fruit-form sources across all 33 users; remove category assignments only through separately reviewed, recipe-specific corrections.
6. Then revisit whether a transparent CHO_ONLY view serves users for recipes with reconciled net CHO. Keep POINT/RANGE/CLASS_ONLY/CONDITIONAL_SCENARIOS unavailable until each output meets the source policy.

## References

- Różańska D, Mikoś K, Regulska-Ilow B. “Assessment of the glycemic index of groats available on the Polish food market.” 2020. [PubMed](https://pubmed.ncbi.nlm.nih.gov/32227786/). Reports couscous GI 99±36; 50 g available-CHO test and glucose-reference method.
- Wolever TMS et al. “Glycemic response to pasta: effect of surface area, degree of cooking, and protein enrichment.” 1986. [PubMed](https://pubmed.ncbi.nlm.nih.gov/3743316/).
- Chiu YT, Stewart ML. “Effect of variety and cooking method on resistant starch content of white rice and subsequent postprandial glucose response and appetite in humans.” 2013. [PubMed](https://pubmed.ncbi.nlm.nih.gov/23945407/).
- Strozyk S et al. “Influence of resistant starch resulting from the cooling of rice on postprandial glycemia in type 1 diabetes.” 2022. [PubMed](https://pubmed.ncbi.nlm.nih.gov/35429987/).
- Atkinson FS et al. “International tables of glycemic index and glycemic load values 2021: a systematic review.” 2021. [PubMed](https://pubmed.ncbi.nlm.nih.gov/34258626/), [DOI](https://doi.org/10.1093/ajcn/nqab233). The raw-strawberry row is flagged in its supplement as unpublished observations and is cited here as provenance, not as a qualifying primary study.
- AJO 2.0B diagnostic report: [glycemic-dairy-fruit-source-impact-review.json](https://github.com/ozirix-dev/Reseptit/blob/codex/glycemic-dairy-fruit-impact-review/docs/nutrition/glycemic-dairy-fruit-source-impact-review.json) on the reviewed source branch.

**GK 2.1 R1A – READY FOR INDEPENDENT REVIEW**

# Other recipes: four evidence-backed nutrition estimates

`tools/calculate-nutrition-batch9.py` reproduces the per-serving values from
the local Fineli Release 20 and FSANZ AFCD Release 3 reference files. Values
are rounded only after summing all included ingredients and dividing by the
published yield. The calculator uses the project definition:

- Net carbohydrate = available carbohydrate − sourced, quantified polyols.
- Total carbohydrate = available carbohydrate + fibre + polyols.
- No polyols are subtracted for these four recipes; the selected records have
  an explicit zero polyol value or AFCD's paired values are equal.

## Ingredient matches and conversions

All weights represent raw or as-sold edible ingredients. Recipe yields are
four servings for the Italian bake and salmon pot, eight for the macaroni
bake and oat-bran buns. Cooking loss and fat discarded during cooking are not
modelled.

| Recipe | Source records and selected matches |
| --- | --- |
| Italian beef and zucchini bake | Fineli #11562 raw 17% beef mince, #398 canned crushed tomatoes, #389 zucchini, #386 red bell pepper, #29239 20% mozzarella, #536 olive oil; AFCD F004193 raw peeled garlic. |
| Beef macaroni bake | Fineli #117 dry macaroni, #712 raw 7% beef mince, #335 yellow onion, #541 cooking-oil blend, #649 2–5% cottage cheese, #858 shell-less egg, #675 1.5% milk, #29065 15% cooking cream and #642 Emmental cheese. |
| Creamy salmon pot | Fineli #34255 raw farmed Atlantic salmon, #335 yellow onion, #11571 plain 11% cream cheese, #631 38% whipping cream, #500 butter, #11557 lemon juice, #28 prepared mustard and #33456 spinach; AFCD F004193 raw peeled garlic. |
| Keto oat-bran buns | Fineli #858 shell-less egg, #649 2–5% cottage cheese, #170 oat bran, #31681 psyllium, #631 38% whipping cream, #500 butter, #30 salt and #385 sesame seeds; AFCD F006077 almond meal and F000247 dry baking powder. |

The recipe amounts now specify the source-matched ingredients. Conversions
used by the calculator are: six medium eggs = 330 g edible egg (55 g each),
three medium eggs = 165 g; 2 dl of cream or milk = 200 g using the selected
Fineli record's 100 g/dl mass; 0.5 dl cream = 50 g; one tablespoon of the
Fineli cooking-oil blend = 13.5 g; one tablespoon butter = 14 g; two
teaspoons of baking powder = 10 g using Fineli #74's 5 g teaspoon measure.
The Italian bake uses 120 g edible red pepper, 3.5 g peeled garlic and 12 g
olive oil for the whole dish. The salmon pot uses 70 g onion, 7 g peeled
garlic, 5 g lemon juice, 5 g mustard and 14 g butter. The buns' optional
sesame topping is fixed at 8 g in the estimate.

The food record `fineli-389-2026-10-24` is reconciled to the full local
Release 20 component export for zucchini: FIBT is 2.0 g and PROT is 0.65 g
per 100 g. An older small cached record listed 0.7 g for both. Calculations
use the Release 20 component values. The official Fineli API page was
attempted in Brave but returned HTTP 403; the locally held Release 20 file
provides the complete source components and is retained with the project.

AFCD records are used only under the dataset's CC BY-SA 3.0 Australia
conditions. FSANZ attribution, source and changes statement, dataset
limitation and Australian-data notice remain in the site's existing license
notice. AFCD carbohydrate is taken from its `without sugar alcohols` field;
the difference between the paired `with` and `without` fields is polyols.
The Fineli data is attributed to THL/Fineli and CC BY 4.0. No product label
or non-open database is copied into this calculation.

## Bounded omissions

The exact recipe amounts for these dried seasonings are published but omitted
from the arithmetic because the available Fineli rows do not report every
required component:

- Italian bake: 2 g dried oregano and 1 g black pepper across four servings,
  at most 0.75 g ingredient mass per serving.
- Macaroni bake: 3 g garlic powder, 1 g black pepper and 2 g paprika across
  eight servings, at most 0.75 g ingredient mass per serving.
- Salmon pot: 1 g dried dill and 1 g black pepper across four servings, at
  most 0.50 g ingredient mass per serving.

These summed mass bounds are below 1 g for each macro per serving. Even if
the entire omitted mass were fat, its energy ceiling is 6.75 kcal, 6.75 kcal
and 4.5 kcal per serving respectively, below the agreed 10 kcal allowance.
Measured salt uses Fineli #30, whose carbohydrate, fibre and polyol values
are zero; salt is left out of the macro sums. No meat, cheese, liquid, oil,
seed or other primary ingredient is omitted.

## Results per serving

| Recipe | Net carbohydrate (g) | Total carbohydrate (g) | Protein (g) | Fat (g) |
| --- | ---: | ---: | ---: | ---: |
| Italian beef and zucchini bake | 5.66 | 8.58 | 32.07 | 32.56 |
| Beef macaroni bake | 37.18 | 38.79 | 47.63 | 27.93 |
| Creamy salmon pot | 4.79 | 6.08 | 35.85 | 52.25 |
| Keto oat-bran bun | 3.19 | 6.77 | 8.98 | 12.41 |

These are approximate ingredient-based estimates, not laboratory analyses.
The bun estimate includes the specified 8 g sesame seeds, and product
variation remains possible within each selected food category.

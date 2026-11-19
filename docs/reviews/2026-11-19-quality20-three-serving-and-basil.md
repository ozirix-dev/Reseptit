# Quality20: three remaining P2 findings, display-only (19.11.2026)

**Source of truth:** Reseptit `main` at `4f9712821ad896a99ef691567af8eae9c7c769e6`; issue [#327](https://github.com/ozirix-dev/Reseptit/issues/327), pilot [#725](https://github.com/ozirix-dev/Reseptit/pull/725).

**Status:** Draft content correction; no merge, production release, new nutrition or GK approval. The original 20-recipe pilot is a dated audit and is not rewritten.

## Culinary / image evidence

1. **Keto-pannukakku:** Original WebP `kuvat/jalkiruoat/keto-pannukakku.webp` is Git blob `0e598b99085db20df6573847b5671f659576fb73`. Direct image inspection confirmed berries and a separately plated dollop of whipped cream on the cooked pancake. The recipe's **2 dl whipping cream in the batter** is an ingredient already counted by the existing macro estimate, but the **extra whipped topping and berries** are not. The new FI/EN/SV/TH note differentiates them and limits the disclosed nutrition to the **four-serving base recipe**.
2. **Keto-pinaattiletut:** Original WebP `kuvat/paaruoat/keto-pinaattiletut.webp` is Git blob `c3cf853182de277b3f3b483f391b5a257d9d6371`. Direct image inspection confirmed berries and a white/pale topping. The white topping's actual product, brand and grams cannot be determined from the image and are **not asserted**. The pictured sweet-looking presentation is optional; the **three-serving base recipe is savoury** and its macros exclude every pictured topping.
3. **Pad-kra-pao-vhh:** All four source ingredient lists specify **30 g Thai basil**, not holy basil. The FI/EN/SV source descriptions incorrectly claim holy basil; TH source uses Thai basil. The public description now identifies the low-carbohydrate **Thai-basil adaptation**, distinguishes it from the holy basil commonly used in traditional pad kra pao, and retains cauliflower rice. The canonical ingredient species, amounts and existing macros remain unchanged. This is *not* a new claim that the adapted recipe uses authentic holy basil.

The existing four-language recipe text and its source hash form the content evidence, not a new kitchen trial. The image observations above are specific to the original assets, not to any external derivative.

## Sealed original Git blobs (FI, EN, SV, TH)

| Recipe | FI | EN | SV | TH |
|---|---|---|---|---|
| `keto-pannukakku` | `3a1769328ec0154bb572db330528d72648f915a1` | `dfdba9bbb94b2f09432e1da828310b259c5f37ff` | `f8ceefa89e73de90fac0a6e7f68d8d3472a2c098` | `513804e1613af2dd70f322addf2083e4ae20e581` |
| `keto-pinaattiletut` | `884807dcdd6d10945e6874ab2e4f27ccb4fe3fa3` | `ea9875c2306fd5c4d0f03494103001e25f5c6da7` | `4c7d990402d2a3f4fe1d682ff263c51a376f051c` | `0bdc2bcfec4ed42f7c8a8a503a24ced97644de03` |
| `pad-kra-pao-vhh` | `93a52ad822e505b064dae7f4eb7263a2c269d1c3` | `f4b20407ed6a0ee3c867e84e801fefab8b398ef2` | `f9ec6ed326b9d937932a026b10aff8d9bd7893b3` | `dfb59871717efdb6d26191628f2da45b4694a0af` |

## Scope and regression

- Only the public display-copy map in `site/scripts/public-recipe-copy-r2.ts` receives twelve recipe/locale-specific entries. The recipe's published `RecipeEntry.description` is overridden for pad kra pao; pancake and spinach notes explicitly separate pictured extras from the actual numeric calculation.
- The test `site/tests/quality20-remaining-p2.test.ts` verifies all **12 canonical source Git blobs**, both exact original image Git blobs, locale visibility of the notes/descriptions, the original ingredient amount (30 g Thai basil), serving counts (4 / 3 / 4) and unchanged four historical macro numbers per locale.
- No raw FI/EN/SV/TH markdown, `meta/kaannokset`, image assets, nutrition-calculation JSON, GK binding/approval/historical records, search indexes or publication status are edited.
- Serving controls scale the ingredient list only. These notes consciously describe **original three-/four-serving base recipes**, not a new calculated topping amount or new GK value.
- A source/image change must trigger test review rather than silently inheriting the old claim.

## Gates and remaining scope

Run current-HEAD Recipe site CI, independent FI/EN/SV/TH meaning and image/serving verification, and Repo Guard before declaring this Ready. Owner merge and Cloudflare release are separate. The quality pilot's **six P3** editorial issues and non-pilot recipes remain separate work; do not infer they are resolved by this P2 patch.

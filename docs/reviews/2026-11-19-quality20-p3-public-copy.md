# Quality20 P3 – katselmoidut julkisen esityksen rajaukset (19.11.2026)

**Source baseline:** Reseptit `main` `8ba8f2e87693dd48f108a5504aa90f8e8db78a0d`, issue [#327](https://github.com/ozirix-dev/Reseptit/issues/327), historical pilot [#725](https://github.com/ozirix-dev/Reseptit/pull/725). **Status:** Draft implementation proposal. No source version, nutrition/GK approval, merge or production authorization.

## Six original P3 findings – actual public status

1. **Hummus:** Original image `kuvat/paaruoat/hummus.webp`, Git blob `271e7699f2e86dfbd8f8e26464ab5d368a4084ef`, was viewed directly. It shows pita bread alongside the hummus. Bread is not in the four-serving structured ingredient list; the listed olive oil and paprika **are**. Four-language visible notes now explain this distinction. Source lead and `## Kuvaus` duplicate in the sealed Markdown, but the built recipe page renders a single editorial description.
2. **Paneer tikka:** The fifth step formerly required lemon wedges and mint chutney even though neither appears in the four-serving ingredient list. Four-language display instructions now mark both as *optional* and visible notes explain that they are outside any base nutrition estimate. No unmeasured condiment amount is invented.
3. **Gluten-free sorghum pizza:** The previously outdated `ennen julkaisemista` wording was **already corrected** in the current public projection (`site/scripts/public-recipe-copy-r2.ts`), not introduced in this PR. Its source file and the existing gluten-free review record remain sealed. The regression test checks the visible packaging warning.
4. **Keto Christmas pastries:** The generic `mausta lopuksi oman maun mukaan` line was **already removed** from public notes by `obsoleteDonenessTip` in `site/scripts/public-recipe-copy.ts`, without changing the original recipe. The regression test checks all locales.
5. **Butter chicken:** Step 4 already requires a minimum **75 °C** chicken temperature and splitting all chicken/sauce among four servings. The old fifth step repeated generic raw-animal cooking advice and embedded a raw-ingredient nutrient-retention assumption in the method. Four-language public copy removes only step 5 and relocates its nutrition-assumption content to a separate explanatory note. The marinade and pan juices remain included; no unmeasured cooking loss is deducted and safety criterion remains explicit.
6. **Paella valenciana:** The FI source lead and description are duplicate, but the user-facing page already renders a single description. The new four-language public description adds source-supported culinary detail: saffron broth, **no stirring after broth addition**, and chicken cooking to at least **75 °C**. No pan-size or authenticity claim is invented.

## Evidence and invariants

- Exact FI/EN/SV/TH source Git blobs for hummus, paneer tikka, butter chicken and paella (16 files), plus original hummus WebP Git blob, are pinned in `site/tests/quality20-p3-public-copy.test.ts`.
- The existing source-derived serving counts and macros are not changed or recalculated. The test verifies public notes, preparation steps and the unchanged nutrition numbers.
- The recipe originals, images, translations, approval registries, diet metadata, glycemic evidence, GK versions and build outputs are not directly modified.
- Public copy edits are limited to `site/scripts/public-recipe-copy.ts` and apply only to the four listed IDs. The public projection rejects unexpected source instruction drift for hummus, paneer and butter chicken.
- The original pilot remains a **historical audit**, not a claim that physical cooking tests or complete-library reviews were performed.

## Review and release gates

Verify Recipe site CI and static/browser output at the final exact HEAD, independently review FI/EN/SV/TH semantics and the survival of the 75 °C chicken instruction, run Repo Guard, then seek separate owner merge authorization. Do not automatically merge or deploy. Another Draft PR [#746](https://github.com/ozirix-dev/Reseptit/pull/746) covers the remaining P2 image/basil findings; it edits a **different** public-copy file and should be reviewed independently.

If future raw-source migrations are approved, they must update translation, nutrition, GK and F25 source locks rather than treating this display projection as canonical source rewrite.

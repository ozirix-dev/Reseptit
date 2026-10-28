# GI-katalogin lähde-eheyden esiseulonta 2026-10-28

Read-only-seulonta kaikille 45 tietueelle. **P0 2, P1 23, P2 1, PASS 19**.
PASS ei tarkoita uutta tieteellistä hyväksyntää. Luvut sidonnat / lasketut
ovat tuotantobaselinesta `c02a70cd6c54d374445941a4d4896536f55b7182`.
Koneellisessa [seulonnassa](glycemic-source-integrity-screen-2026-10-28.json)
on jokainen ainesrivi, laskettujen käyttäjien ID:t ja ehdotuksen jälkeiset määrät.
Vain paprika korjataan tässä työssä. Muiden perheiden havainnot ovat jatkotyöjono.

| GI-tietue | Luokka | Sidonnat / lasketut | Havainto |
|---|---|---|---|
| whole-tomato-raw-gi-22 | PASS | 3 / 1 | 2021 source identity and named food/preparation are consistent at screening level; cultivar/product/analogue limits remain as catalogued. No new scientific approval. |
| tomato-cherry-raw-analogue-gi-22 | PASS | 1 / 1 | 2021 source identity and named food/preparation are consistent at screening level; cultivar/product/analogue limits remain as catalogued. No new scientific approval. |
| tomato-juice-canned-gi-38 | P2 | 0 / 0 | Source points to a dynamic search page rather than a stable entry locator; product is specified but a durable row/reference identifier would improve traceability. |
| potato-boiled-china-gi-66 | PASS | 1 / 0 | 2021 source identity and named food/preparation are consistent at screening level; cultivar/product/analogue limits remain as catalogued. No new scientific approval. |
| potato-cooked-china-nonwestern-gi-66-4 | P1 | 0 / 0 | DOI identifies Chinese GI paper; compendium food is traceable, but exact primary preparation/protocol is not fully rechecked in this light screen. |
| potato-fried-evoo-lady-rosetta-gi-114 | P1 | 0 / 0 | DOI/title match. Recorded n=8 is below project strong-evidence policy; candidate only, not preparation-matched to tortilla. |
| potato-fried-evoo-spunta-gi-83 | P1 | 0 / 0 | DOI/title match. Recorded n=8 is below project strong-evidence policy; candidate only, not preparation-matched to tortilla. |
| potato-crisp-fried-china-nonwestern-gi-60-3 | P1 | 0 / 0 | DOI identifies Chinese GI paper; compendium food is traceable, but exact primary preparation/protocol is not fully rechecked in this light screen. |
| potato-steamed-nishiyutaka-nonwestern-gi-64 | PASS | 0 / 0 | DOI/title and cultivar-specific steamed-food description are consistent; existing candidate-only/preparation restriction remains. Full protocol not newly approved. |
| potato-steamed-ainoaka-nonwestern-gi-63 | PASS | 0 / 0 | DOI/title and cultivar-specific steamed-food description are consistent; existing candidate-only/preparation restriction remains. Full protocol not newly approved. |
| potato-steamed-dejima-nonwestern-gi-54 | PASS | 0 / 0 | DOI/title and cultivar-specific steamed-food description are consistent; existing candidate-only/preparation restriction remains. Full protocol not newly approved. |
| potato-boiled-tortilla-analogue-gi-66 | P1 | 2 / 0 | Boiled/mashed preparation is documented, but transfer to recipe preparation or cultivar requires a separate evidence review. |
| tomato-raw-cooked-sauce-analogue-gi-22 | P1 | 49 / 15 | Raw whole-tomato value is used for cooked/crushed sauces. DOI identity is correct; preparation transfer has no demonstrated equivalence. Prioritize published crushed-tomato users. |
| red-pepper-literature-analogue-gi-40 | P0 | 14 / 7 | Wrong DOI and untraceable generic Pepper GI 40; species, colour, preparation and primary human protocol unverified. Corrected to REFERENCE_ONLY in this PR. |
| onion-literature-analogue-gi-15 | PASS | 0 / 0 | Protected REFERENCE_ONLY, zero active bindings. Existing restriction prevents calculation use; PASS is not scientific re-approval. |
| dairy-category-mean-gi-35 | P1 | 125 / 52 | Heterogeneous dairy mean used for cream/cheeses; ingredient-level suitability needs review. Also assigned to cumin in incomplete recipes; no new scientific approval. |
| plain-yogurt-category-mean-gi-27-2017 | PASS | 1 / 1 | DOI identifies the yogurt review, and record labels a yogurt-only mean rather than an exact brand; no obvious metadata mismatch. |
| chickpea-canned-gi-35 | PASS | 3 / 2 | 2021 source identity and named food/preparation are consistent at screening level; cultivar/product/analogue limits remain as catalogued. No new scientific approval. |
| legumes-category-mean-gi-34 | P1 | 39 / 12 | Category mean used for processed legumes and sauces/flours; fermentation, product and preparation equivalence needs review. |
| vegetables-category-mean-gi-66 | P1 | 188 / 46 | Heterogeneous vegetable mean used across non-starchy vegetables/roots and preparations; individual food match requires review. |
| soups-category-mean-gi-49 | P1 | 14 / 0 | Finished-soup mean assigned to broth/stock products; product-to-component transfer needs review. |
| coconut-milk-porridge-gi-31 | PASS | 0 / 0 | Protected REFERENCE_ONLY, zero active bindings. Existing restriction prevents calculation use; PASS is not scientific re-approval. |
| asian-regional-category-mean-gi-60 | P1 | 8 / 0 | Regional mixed-food mean is not a measurement of individual paste/flour/ingredient. No currently calculated users; do not expand bindings. |
| nuts-category-mean-gi-22 | P1 | 29 / 7 | Nut mean and grinding/product correspondence require review. Ground coriander appears among incomplete users; calculated users are recorded separately. |
| bakery-products-category-mean-gi-58 | P0 | 62 / 28 | Mean for finished bakery products is actively assigned to almond flour, a different food family. Confirmed published almond-flour subset is listed separately; all users require a bounded follow-up. |
| bread-category-mean-gi-64 | P1 | 13 / 6 | DOI and category label match the 2021 table; a category average is not a product/preparation-specific measurement. Binding-level validation remains necessary. |
| potatoes-category-mean-gi-71 | P1 | 9 / 2 | DOI and category label match the 2021 table; a category average is not a product/preparation-specific measurement. Binding-level validation remains necessary. |
| pasta-category-mean-gi-52 | P1 | 10 / 2 | DOI and category label match the 2021 table; a category average is not a product/preparation-specific measurement. Binding-level validation remains necessary. |
| rice-category-mean-gi-67 | P1 | 55 / 14 | DOI and category label match the 2021 table; a category average is not a product/preparation-specific measurement. Binding-level validation remains necessary. |
| sugar-syrups-category-mean-gi-58 | P1 | 31 / 6 | DOI and category label match the 2021 table; a category average is not a product/preparation-specific measurement. Binding-level validation remains necessary. |
| fruit-category-mean-gi-51 | P1 | 51 / 10 | DOI and category label match the 2021 table; a category average is not a product/preparation-specific measurement. Binding-level validation remains necessary. |
| asian-indian-category-mean-gi-65 | P1 | 1 / 0 | Regional mixed-food mean is not a measurement of individual paste/flour/ingredient. No currently calculated users; do not expand bindings. |
| potato-boiled-preparation-analogue-gi-66 | P1 | 3 / 1 | Boiled/mashed preparation is documented, but transfer to recipe preparation or cultivar requires a separate evidence review. |
| potato-mashed-preparation-analogue-gi-73 | P1 | 1 / 1 | Boiled/mashed preparation is documented, but transfer to recipe preparation or cultivar requires a separate evidence review. |
| dark-chocolate-international-tables-mean-gi-29 | PASS | 2 / 0 | 2021 source identity and named food/preparation are consistent at screening level; cultivar/product/analogue limits remain as catalogued. No new scientific approval. |
| corn-tortilla-noriega-2000-glucose-estimate | PASS | 5 / 2 | Primary abstract identifies corn tortilla and bread=100, n=8. Catalog explicitly labels glucose conversion as estimate; do not treat it as direct glucose-reference measurement. |
| couscous-groats-rozanska-2020-gi-99 | PASS | 1 / 1 | DOI and primary groat-study title match; cooked groat product limits remain explicit. No new recipe-equivalence approval. |
| millet-groats-rozanska-2020-gi-56-2 | PASS | 1 / 1 | DOI and primary groat-study title match; cooked groat product limits remain explicit. No new recipe-equivalence approval. |
| rice-noodles-dried-boiled-chan-2001-gi-61 | P1 | 4 / 1 | Specific noodle product is identified in catalog; PubMed response did not expose text in this run. Primary identifier/protocol needs independently accessible verification; access failure alone is not evidence of wrong DOI. |
| honey-category-mean-gi-55-2002 | PASS | 2 / 1 | 2002 international-tables DOI/title match. Record clearly labels food-specific means and raw/varietal limits; no obvious metadata mismatch. |
| mango-raw-mean-gi-51-2002 | PASS | 2 / 1 | 2002 international-tables DOI/title match. Record clearly labels food-specific means and raw/varietal limits; no obvious metadata mismatch. |
| pear-raw-mean-gi-38-2002 | PASS | 1 / 0 | 2002 international-tables DOI/title match. Record clearly labels food-specific means and raw/varietal limits; no obvious metadata mismatch. |
| dried-date-tamer-mean-gi-55-2-algeffari-2016 | PASS | 3 / 2 | DOI/title identify 17 Saudi date varieties; tamer-stage mean and product limitations are explicit. No paste/syrup equivalence inferred. |
| semolina-steamed-gelatinized-mani-1992-gi-55 | P1 | 0 / 0 | Publisher confirms DOI/title. Steam-gelatinized semolina with added oil, n=6 and sparse sampling is not interchangeable with water-boiled oil-free porridge; retain existing restriction. |
| orange-navel-2021-gi-45 | PASS | 1 / 0 | 2021 source identity and named food/preparation are consistent at screening level; cultivar/product/analogue limits remain as catalogued. No new scientific approval. |

## P0-jatkotyö: mantelijauho

Leipomotuotteiden keskiarvo GI 58 kuvaa valmiiden tuotteiden ryhmää.
Sitä käytetään seuraavissa 12 julkaistussa reseptissä mantelijauholle:

- keto-korvapuustit
- keto-mutakakku
- keto-suklaakeksit
- rahkapiirakka-vhh
- vhh-brita-kakku
- vhh-juustokakku
- vhh-korvapuustit
- vhh-letut
- vhh-lihapiirakka
- vhh-mansikkakakku
- vhh-mokkapalat
- vhh-omenapiirakka

Tietueella on kaikkiaan 62 sidontaa ja 28 laskettua käyttäjää. Kaikki 28 ovat
vaikutusauditoinnin joukko; 12 on tässä seulonnassa todettu väärän ruokaperheen
osajoukko. Korjaus on kiireellinen erillinen lähdelaatutyö. Ei muutoksia nyt.

## Lähteet ja saatavuus

- [International tables of glycemic index and glycemic load values 2021: a systematic review](https://doi.org/10.1093/ajcn/nqab233)
- [University of Sydney Glycemic Index Search database](https://glycemicindex.com/gi-search/)
- [Glycemic index of cereals and tubers produced in China](https://doi.org/10.3748/wjg.v12.i21.3430)
- [Glycemic Index of Two Different Fried Potato Varieties Cultivated Under Organic Fertilization Conditions](https://doi.org/10.12944/CRNFSJ.4.1.02)
- [Consideration of the validity of glycemic index using blood glucose and insulin levels and breath hydrogen excretion in healthy subjects](https://doi.org/10.1016/j.ijdm.2010.05.004)
- [Mens sana in corpore sano: Does the Glycemic Index Have a Role to Play?](https://doi.org/10.3390/nu12103041)
- [Mens sana in corpore sano: Does the Glycemic Index Have a Role to Play?](https://doi.org/10.3390/nu12102989)
- [Yogurt Is a Low-Glycemic Index Food](https://doi.org/10.3945/jn.116.240770)
- [Green leafy porridges: how good are they in controlling glycaemic response?](https://pubmed.ncbi.nlm.nih.gov/22849311/)
- [Glycaemic and insulinaemic indices of Mexican foods high in complex carbohydrates](https://pubmed.ncbi.nlm.nih.gov/10824718/)
- [Assessment of the glycemic index of groats available on the Polish food market](https://doi.org/10.32394/rpzh.2020.0101)
- [The glycaemic index values of Vietnamese foods](https://pubmed.ncbi.nlm.nih.gov/11781674/)
- [International table of glycemic index and glycemic load values: 2002](https://doi.org/10.1093/ajcn/76.1.5)
- [Glycemic indices, glycemic load and glycemic response for seventeen varieties of dates grown in Saudi Arabia](https://doi.org/10.5144/0256-4947.2016.397)
- [Glycaemic index of conventional carbohydrate meals](https://doi.org/10.1079/BJN19920102)

- 2021 DOI publisher direct requests intermittently 403/500; primary supplemental tables read from author-table PDF copies at ghwinstitute.com (139 and 136 pages).
- DOI metadata checked against Crossref where available; four 429 responses supplemented by publisher/indexed primary records.
- PMID 11781674 response unavailable; classified P1 rather than assumed valid.
- 2020 review Table 1 footnote [1] points to Jenkins 1983 (10.1007/BF00282710), not Jenkins 1981. Older onion review narrative is preserved as history; correct this documentation in a separate follow-up.

Punapaprikan täydempi lähdeketju ja toiminnan rajat ovat
[paprikaraportissa](glycemic-red-pepper-source-review.md).

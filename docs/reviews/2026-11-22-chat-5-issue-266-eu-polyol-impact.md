# Issue #266 / Chat 5 — EU-total-polyolikorjauksen rajattu vaikutusvertailu

**Päiväys:** 22.11.2026
**Tila:** riippumaton lukupohjainen vaikutusrajaus; **ei** laskentamenetelmän hyväksyntä, GK-sinetin uusiminen tai julkaisuvaltuutus.
**PR:** [#826](https://github.com/ozirix-dev/Reseptit/pull/826)
**Työn omistaja:** Chat 5

## 1. Lähdetarkisteet ja muutos

- Repon kanoninen ravintolähderekisteri: `docs/nutrition/food-records.json`, Git blob **`d7d6b83b45ed6b048582850f39425d08eb8d1ec6`**.
- Aiemman `site/scripts/nutrition-model.ts`-toteutuksen Git blob: **`de8d7189d786b06c93e13afb378f8861a70542c6`**.
- PR #826:n tarkistettava HEAD: **`98b7171f9163a49909323c1a8104e2f5e8256ae7`** (mikäli HEAD muuttuu, tämä on historiallinen vertailupiste).
- Muutos on täsmälleen `normalizeCarbohydrate`-funktion lähdevarmennuksen jälkeisessä paluupolussa: `EU_TOTAL_INCLUDING_POLYOLS` saa `available=null, net=null` kun polyolimäärä tai sen lähdevarmennus puuttuu, kuten `US_TOTAL_INCLUDING_FIBRE` jo tekee. `EU_AVAILABLE` ei vähennä lähteessä jo poistettuja polyoleja toistamiseen. Lähderekisteriä ei muokattu.

## 2. Rekisterin kattavuus ja ennen/jälkeen-vertailu

Tarkistettu **604** kanonista `FoodRecord`-tietuetta GitHubista:

| Hiilihydraattimääritelmä | Tietueita | Muuttuneita EU-normalisointituloksia |
| --- | ---: | ---: |
| `EU_AVAILABLE` | 603 | 0 |
| `EU_TOTAL_INCLUDING_POLYOLS` | 1 | 0 |
| Muut tässä rekisterissä | 0 | 0 |
| **Yhteensä** | **604** | **0** |

Yksittäinen EU-total-tietue on `foodin-erythritol-200g-label-2026-10-24`. Se sisältää lähteistetysti `polyolsSourceVerified=true`, kirjallisen `polyolsEvidence`-merkinnän, 100 g hiilihydraattia ja 100 g polyoleja / 100 g. **Molemmat haarat palauttavat 0 g available ja 0 g net.** Tälle hyväksytylle tiedolle ei synny laskentaeroa.

Vertailu toistettiin tarkastamalla jokaisen kanonisen lähteen hiilihydraattimääritelmä, polyolimäärä ja polyolin lähdevarmennus sekä ajamalla vanhan/uuden **EU-haaran paluusemanttiikan** rinnakkainen laskennallinen tarkistus. Muuttuneita palautteita **0/604**. Tämä on lähdeluettelon **semantiikka-auditointi**, ei kahden kokonaisen TypeScript-tuotantobuildin tai julkaistun GK-laskenta-artefaktin diffi.

## 3. Negatiivinen vaikutusskenaario (synteettinen, ei julkaistu lähde)

| Tietue | Vanha toiminta | Korjattu toiminta |
| --- | --- | --- |
| EU-total 20 g, polyolit 3 g, **ei** lähdevarmennusta | `available=17, net=null` | `available=null, net=null` |
| Sama, polyolit 3 g **varmennettu** | `available=17, net=17` | `available=17, net=17` |
| EU-available 20 g ja polyolit 3 g | `available=20` | `available=20` |
| Varmennettu EU-total 20 g, polyolit täsmälleen 0 g | `available=20, net=20` | `available=20, net=20` |

Uusi `site/tests/nutrition-model.test.ts` -regressio kattaa puuttuvan lähdevarmennuksen, `calculate()`-tulosten pidättämisen ja ainesosa-GK:n `INSUFFICIENT SOURCE DATA` -tilan. Näiden testien **suorittamista/onnistumista ei väitetä**: PR:n pakollinen build pysähtyy ennen valmistumistaan muutetun laskentakoodin hyväksyntäsinettiin.

## 4. GK-sinetti ja toteutusraja

[Recipe site CI #44954786461](https://github.com/ozirix-dev/Reseptit/actions/runs/44954786461) = **completed/failure**:
`site/scripts/gk-next-seven.ts` → `loadPadSeeEw` → `Pad shared evidence changed: site/scripts/nutrition-model.ts`.

`site/scripts/reviewed-nutrition-model-binding.ts` on aikaisemman PR #168:n **täsmähasheihin sidottu, rajattu hyväksyntäpoikkeus**. Sitä ei saa muuttaa yleiseksi `allow new hash`-ehdoksi eikä lisätä uutta laskentamallin tarkistetta automaattisesti. Suojattu pad-see-ew- ja muu GK100/GK149-lähdesidonta pysyy ennallaan.

**Jäljellä olevat ehdot ennen Ready/mergeä:**
1. Täydellinen ennen/jälkeen-laskennallinen vertailu myös **mahdollisille erillisille/dynaamisille `FoodRecord`-syötteille** ja muutoksen koskettamille sinetöidyille GK-varianttipaketeille, joiden hyväksyttyä SHA-ketjua tämä vaikutusrajaus ei kattanut.
2. Erillinen riippumaton menetelmä-/lähdetarkastus ja dokumentoitu päätös siitä, voidaanko tämä **täsmällinen uusi koodiversio** sitoa aiempiin suojattuihin laskelmiin ilman tulosmuutoksia.
3. Vasta hyväksytyn evidenssin jälkeen mahdollinen tarkoituksella rajattu `reviewed-nutrition-model-binding.ts`-muutos, regressiot sekä uudet täsmä-HEAD- ja merge-SHA-CI-ajot.

**Päätös:** #826 jää Draft/HOLDiksi. Ei julkaistujen lukujen, ravintorekisterin, GI/GK-sinettien, muiden chatien PR:ien eikä Cloudflare-tuotannon muutoksia tämän selvityksen perusteella.

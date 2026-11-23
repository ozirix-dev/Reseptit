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

## 5. Riippumaton ajettava ennen–jälkeen-vertailu (22.11.2026)

Tämän raportin alkuperäisen, 604 tietueen semanttisen kartoituksen lisäksi toteutettiin **pinnattuun historialliseen Git-blobiin** perustuva, erillinen read-only CI-auditointi:

- [GitHub Actions #44957523521](https://github.com/ozirix-dev/Reseptit/actions/runs/44957523521): `completed/success`; vanha laskentamalli haettiin Git-blobista `de8d7189d786b06c93e13afb378f8861a70542c6`.
- [GitHub Actions #44957604756](https://github.com/ozirix-dev/Reseptit/actions/runs/44957604756): `completed/success`; tarkennettu tapauskohtainen raportti, artefakti `chat5-eu-polyol-impact`.
- `site/scripts/eu-polyol-impact-audit.ts` lataa vanhan mallin Git-objektista ja ajaa kummankin mallin oikeilla `FoodRecord`- ja `Calculation`-syötteillä. Se raportoi poikkeamat, ei muokkaa lähteitä, GK-sinettejä tai hyväksyntöjä.
- **604** kanonista lähdetietuetta vertailtu: **0 eroa**.
- **305** reseptilaskennan JSON-syötettä vertailtu vanhalla/uudella `calculate()`-funktiolla: **0 eroa**.
- Kohdennetut EU-polyoliregressiot: **3 testiä, 3 PASS, 0 FAIL**.

### Seitsemän syötetason epävarmuutta, joilla ei syntynyt uutta laskentaeroa

Kaikissa alla olevissa syötteissä **sekä vanha että uusi normalisointi antoivat `available=null, net=null`**. Reseptin laskentastatuskaan ei muuttunut.

| Resepti | Varmentamaton EU-total-tietue | Vanha ja uusi reseptin tulostila |
| --- | --- | --- |
| `kebab-munakasrulla` | `label-kebab-20261117` | `INSUFFICIENT SOURCE DATA` |
| `kebab-munakasrulla` | `label-red-20261117` | `INSUFFICIENT SOURCE DATA` |
| `kebab-munakasrulla` | `label-white-20261117` | `INSUFFICIENT SOURCE DATA` |
| `kebab-munakasrulla` | `label-pepper-20261117` | `INSUFFICIENT SOURCE DATA` |
| `munatacot-huevos-rancheros` | `op142-unresolved-munatacot-huevos-rancheros-6` | `ESTIMATE WITH EVIDENCE` |
| `pasta-alla-norma` | `ehold-auricchio-pecorino` | `INSUFFICIENT SOURCE DATA` |
| `shakshuka` | `op142-unresolved-shakshuka-6` | `ESTIMATE WITH EVIDENCE` |

Huomautus: `ESTIMATE WITH EVIDENCE` on reseptin koko laskelman senhetkinen arviostatus; se ei yksin hyväksy tätä yksittäistä epävarmaa ainesosatietuetta eikä julkaistavaa numeerista GK:ta. Yksittäisten syötteiden epävarmuudet pidetään erillään tämän koodimuutoksen vaikutuksesta.

### Näytön tarkka kattavuusraja

Tässä ajossa verrattiin kanonista lähderekisteriä ja `docs/nutrition/calculations/`-hakemiston 305 laskentasyötettä kahdella **oikeasti suoritetulla** laskentamallilla. Lisäksi synteettinen negatiivinen testi todentaa uuden fail-closed-käyttäytymisen. Auditointi ei suorita suojattua GK-only-versioiden avausta eikä anna hyväksyntää niiden vanhan sinetin uudelleensidonnalle.

**Pakollinen Recipe site -CI jää tarkoituksella HOLDiin**, koska `gk-next-seven.ts` edellyttää uutta, riippumattomasti hyväksyttyä koodisidosta. Uuden tarkisteen lisääminen `reviewed-nutrition-model-binding.ts`-tiedostoon vain tämän raportin perusteella olisi ennenaikaista. Ei Ready-, merge- eikä tuotantojulkaisulupaa.

## Riippumaton GK-vaikutusarvio 23.11.2026

Työn omistaja: Kokki-Codex. Käyttäjä siirsi #826:n haaran kirjoitusomistajuuden
Chat 5:ltä tähän rajattuun jatkotyöhön. PR:n alkuperäinen haara säilyy.

Vertailu ajettiin mainin commitin `ce2b67ffe5ccb67f4a6179390984dfed7a3fb8c8`
aineistolla ja PR-HEADin `910cde2c9bba2615a62055ccb5435205d6f9c37b`
laskentakoodilla. Vanhan mallin LF SHA-256 on
`05a3edc945b444edd4c99aff90be6a17129559ee7779f8f5e372bf46877195d3`.
Uuden mallin LF SHA-256 on
`2bf067ad44544b1cce522304077a39eed0628a393a707d5ef6d1029747002045`.

- 604 lähdetietueen normalisointi ja 306 ravintolaskentatulosta säilyivät samoina.
- 326 GK-pilottitulosta sekä niiden laskentasyöte- ja lähde-evidenssitiivisteet säilyivät samoina.
- 87 nykyistä GK-erillisversiota antoi samat tulokset. Pad see ew, GK80-tehoajo
  ja GK80 next-four läpäisivät normaalit lähde- ja tulossidostarkistukset, kun
  yhteensopivuussääntöön lisättiin vain uuden mallin tarkka tiiviste.
- 23 ravintolaskennan testiä läpäistiin. Testit kattavat uuden EU-total-rajauksen
  sekä sen, että kaikki kolme laskentareittiä hylkäävät tuntemattoman
  koodimuutoksen ja että lähdesinetti pysyy voimassa.
- Kohdennettu vaikutusauditointi ajettiin päivitetyllä tarkistuksella. Se
  todentaa olemassa olevat hyväksytyt laskentatulokset eikä kirjaa uutta
  lähde- tai julkaisuhyväksyntää.

Hyväksyntä koskee vain mainitun LF-tiivisteen koodiyhteensopivuutta. Alkuperäisiä
lähde- ja hyväksyntäasiakirjoja, GK-arvoja tai tulostiivisteitä ei päivitetä.
Yhdistäminen edellyttää edelleen täsmä-HEADin pakollista Recipe site -CI:tä.

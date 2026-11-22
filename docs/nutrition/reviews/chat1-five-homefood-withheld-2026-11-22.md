# Chat-1 — viiden kotiruoan numeerisen ravintonäytön tietoinen poisjättö

**Tarkastettu:** 22.11.2026. **Omistaja:** Chat-1, riippumaton ravintonäytön rajaus- ja integraatiokatselmointi.
**Koskee:** Chat-3:n Draft-reseptejä #785–#789 **alla lukittujen FI-lähdeversioiden mukaisesti**.
**Päätös:** Numeeriset reseptikohtaiset hiilihydraatti-, proteiini-, rasva-, kalori- ja GK-arvot jätetään **julkaisuehdokkaista pois**. Niille ei ole hyväksyttyä täysimääräistä, reseptituotteita ja koko syötävää annosta koskevaa laskentaa. **Puuttuva ei ole nolla.** Tämä on erillinen ravintosisällön näyttämisen rajaus; ei julkaisulupa tai alkuperäisten review-tietueiden automaattinen `approved`.

## Repon oma hyväksytty toimintamalli

`docs/reviews/new-recipes/lasimestarin-silli.json` sisältää aidosti hyväksytylle, julkiseen `reseptit/alkuruoat/lasimestarin-silli.md`-versioon sidotulle reseptille:

- `checks.nutrition.status: pass`: numeerisia ravintoarvoja ei näytetä, koska toistettavaa tuotekohtaista laskentaa ei ole; erillinen ravintonäyttömuistio perustelee puuttuvuuden.
- `checks.glycemic.status: unavailable`: ei hyväksyttyä GI/GK-mittausta eikä laskentaa, joten GK jätetään määrittämättä ja ruokavalioväitteet pidätetään.
- Alkuperäinen lähde ja resepti voivat silti olla julkaistuja **vain muiden riippumattomien julkaisuehtojen täytyttyä**.

Tämä katselmointi soveltaa samaa **periaatetta ravintonäytön poisjättöön**. Se **ei** siirrä hyväksyntätietueen kaikkia `pass`-arvoja eikä tarkastajan identiteettiä viidelle vielä keskeneräiselle reseptille. Reseptien sisällöllinen `decision: hold` säilyy.

## Versiosidottu viisikko ja ravintohavainnot

| PR / recipe_id | Lukittu FI HEAD | Julkisten makrojen tilanne | Keskeinen ratkaisematon syöte | Numeeristen arvojen näyttö |
|---|---|---|---|---|
| [#785](https://github.com/ozirix-dev/Reseptit/pull/785) `kinkkukiusaus` | `ea1009a1b3c6ad0dbd855461cede192109b76c45` | Kaikki jätetty pois | Pakasteperunasuikaleiden, kypsän savukinkun ja pippurin tuote-/ravintoarvoproxyt | EI |
| [#786](https://github.com/ozirix-dev/Reseptit/pull/786) `liha-perunasoselaatikko` | `b128e8e6e4abce1ce30d637208c980ac3b94a2a0` | Kaikki jätetty pois | Jauhelihan rasvaprosentti, maitotyyppi, tuotekohtaiset koostumusvaihtelut | EI |
| [#787](https://github.com/ozirix-dev/Reseptit/pull/787) `kesakeitto` | `2efb29756739bd16e8fc754d48f0948d131e828b` | Kaikki jätetty pois | Kevätsipulille tuotetietokandidaatteja, mutta ei valittua tuotetta; maito/peruna/herne vaihtoehtoisia | EI |
| [#788](https://github.com/ozirix-dev/Reseptit/pull/788) `suppilovahverokeitto` | `14033ad443e9b08a80ab5b2cbd6267138eff8fb5` | Kaikki jätetty pois | Lajikohtaisen tuoreen suppilovahveron ja kasvisliemen koostumustiedot | EI |
| [#789](https://github.com/ozirix-dev/Reseptit/pull/789) `silakkalaatikko` | `44299ce052c99c5a09585e0981d425fe3f14d87d` | Kaikki jätetty pois | Silakan tuote, pekonin rasva, maidon tyyppi, munan syötävä massa, pippurit | EI |

Alkuperäisten haarojen `docs/nutrition/candidates/<id>-2026-11-21.json` ovat `NON_PUBLIC_NUTRITION_CANDIDATE` / `HOLD_NOT_PUBLISHABLE`. Niissä esitetyt vain tunnetut osasummat eivät ole reseptin kokonaissummia; niitä ei voi siirtää julkaistuun Markdown-frontmatteriin. Kaikki viisi FI/EN/SV/TH-sisältöä on tarkistettu ilman hyväksyttyjä numeerisia makroarvoja tai GK-lukua.

## Suositeltu päätösmalli julkaisuversion omistajalle

**Jos makrot pidetään pois julkisesta reseptistä**, kaikki viisi voivat jatkaa muissa hyväksymisporteissa **ilman** pakollista tuoteselostekirjeiden tai täydellisen ravintoarvolaskelman hankintaa. Samalla:
1. Julkista `carbs_net_per_serving_g`, `carbs_total_per_serving_g`, `protein_per_serving_g`, `fat_per_serving_g` -arvoa tai johdettua energiaa ei lisätä pelkän ehdokaslaskelman pohjalta; `null`/puuttuva ei muutu `0`:ksi.
2. GK jätetään `unavailable`-periaatteella pois. Reseptikohtaisia GI/GK-lukuja, keto-/VHH- tai gluteenittomuusväitteitä ei päätellä puuttuvista makroista.
3. Tarkistuksen vastuuhenkilö voi hyväksyä `nutrition: pass — numerical fields intentionally withheld` ja `glycemic: unavailable` **vasta reseptikohtaisen lähde- ja julkaisuviimeistelyn yhteydessä**; tähän kirjataan oma riippumaton näyttö, ei automaattinen tilamuutos.
4. Muuttunut FI-ainesosa, menetelmä, annosmäärä, tuote- tai ravintosisältö vanhentaa tämän arvioinnin sen muuttuneelta osalta. Uusi SHA-tarkistus ennen lopullista julkaisuporttia.
5. FI/EN/SV/TH-käännösten rakenteellinen ja semanttinen tarkistus, hyväksytty kuva, elintarviketurvallisuus ja oikea CI ovat erillisiä ehtoja, eivät ravintonäytön hyväksymisen sivutuotteita.

**Kuvaportti:** [PR #852](https://github.com/ozirix-dev/Reseptit/pull/852) MERGED, viisi kuvaa SHA-256-lukitussa `assets/images.tracked-overlays.json`-manifestissa. **Valmistuslähteet:** [PR #853](https://github.com/ozirix-dev/Reseptit/pull/853) kesäkeitto, [PR #854](https://github.com/ozirix-dev/Reseptit/pull/854) muut neljä. **Alkuperäisten PR:ien kirjoitusomistajuus:** Chat-3; tätä raporttia ei pidä sekoittaa Codexin tekemään lopulliseen käännöskatselmointiin.

## Integraatiopäätös

**Ravintonäytön esivalinta: WITHHOLD ALL NUMERIC MACROS AND GK for the five currently pinned Draft recipes.** Tämä ei edellytä uusien numeeristen ravintolaskelmien laatimista ennen muiden porttien arviointia. **Julkaisupäätös yhä HOLD**, kunnes julkaisuvaatimusten mukainen kokonaisnäyttö on koossa.

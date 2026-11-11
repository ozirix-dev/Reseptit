# Karnivore FI3 – raaka-ainelaskennan toistettava valmistelu (11.11.2026)

**Status: HOLD / EI JULKAISTAVAKSI.** Tässä PR:ssä ei siirretä ainuttakaan reseptiä `published`-tilaan eikä muuteta #448:n omistamia tiedostoja. Tämän päätöksen peruste on reseptien nykyinen `tuonti/karnivore/`-eristys ja muuttumattoman GK-perusjoukon säilyttäminen.

## Riippumattomat lähde- ja tuotetarkistukset

Lähdetiedot on kerätty kolmeen reseptiin, joiden raw ingredient -skenaario on laskettavissa ilman mielivaltaista poisjättöä:

- [HK Naudan entrecôte](https://www.hk.fi/tuotteet/hk-naudan-entrecote-/), 20 g proteiinia, 12 g rasvaa, ilmoitettu 0 g hiilihydraattia / 100 g.
- [Kalaneuvos Lohifilee](https://kalaneuvos.fi/tuotteet/tuoreet-kalat/lohifilee/), 18,7 g proteiinia, 13,5 g rasvaa, ilmoitettu 0 g hiilihydraattia / 100 g. A–D:n leikkuuaste ja nahka on varmistettava vastaamaan reseptin syötävää raakapainoa.
- [Snellman Kunnon naudan jauheliha 20 %](https://snellman.fi/fi/tuotteet/kunnon-naudan-jauheliha-20-400-g/), EAN 6409620011856, 18 g proteiinia, 20 g rasvaa ja ilmoitettu 0 g hiilihydraattia / 100 g.
- THL Fineli Release 20: kuoreton kananmuna (`858`), voi (`500`), jodioitu suola (`30`). Niiden makrot ja tietuetunnukset ovat #448:n lähdekartassa, ei uusia tuoteoletuksia.

**Tuotevastine ei ole sama kuin tietueen hyväksyntä geneeriselle reseptille.** Pakkauksen ilmoitettu nolla ei ole analyysissä mitattu nolla.

## Toistettu 100 % raaka-aineskenaario – ei valmiin ruoan ravintoarvo

| FI-resepti | P / annos, g | R / annos, g | Lähteen imeytyvä CHO / annos, g | 4/9/4-arvio kcal / annos |
| --- | ---: | ---: | ---: | ---: |
| `karnivore-steak-and-eggs` | 49.999 | 39.894 | 0.410 | 560.7 |
| `karnivore-voilohi-pannulla` | 37.618 | 41.228 | 0.140 | 522.1 |
| `karnivore-jauhelihakulho-munalla` | 42.948 | 45.082 | 0.165 | 578.2 |

Nämä luvut ovat **raaka-ainepanosten laskennallisia summia**, eivät ruokalautasella todettuja makroja, julkaistavia `carbs_total`/nettoarvoja, tarkkoja kcal-määriä eivätkä saantohävikillä korjattuja tuloksia. Etenkin käytettyjen kananmunien, voin, lihan ja kalan kuitu- ja polyolikomponenttien hyväksyntä puuttuu julkaistavalta `carbs_total`-laskelmalta. Siksi kaikki reseptin **neljä julkista metatietokenttää jätetään puuttumaan**. GK-arvoa ei merkitä.

Kaava: `sum(grammat × [proteiini, rasva, imeytyvä CHO] / 100) / annokset`. Energia on `4×P+9×R+4×CHO` ja on pelkkä näiden makrojen keskinäinen laskentatarkiste; se voi poiketa valmistajan ilmoittamista kilokaloreista pyöristyksen ja laskentakäytäntöjen vuoksi. JSON:ssa `cookedServingNutrition: null`, `gk: null` ja `releaseApproved: false` ovat tietoisia estoja. Tiedoston lähdeblobit on lukittu #448:n HEADiin `221f9cc4cf4c061675fff1f5f19aec2e16d2aed5`.

## Julkaisutyön erottelu ja vaatimukset

1. **Reseptikuvan portti (3/3):** jokaisella oma oikeaa annosta kuvaava 3:2-WebP `kuvat/paaruoat/` ja kuvan lähde/alt/pikselikoko. Pelkkää havainneinfografiikkaa ei hyväksytä reseptikuvaksi. Kuvia ei ole lisätty tässä PR:ssä.
2. **Raaka-aineportti:** määritä reseptikohtaisesti tarkka käytettävä tuote tai perusteltu hyväksytty vastaavuus. Jauhelihan tuoteseloste on varmistettu, mutta reseptin geneerinen ainesosanimi ei vielä sitoisi sitä automaattisesti.
3. **Saantoportti:** pannulle tai vuokaan jäävä rasva, tarjoiltu paistovoi, kalan nahka/ruodot sekä kypsennyshävikki; näitä ei imputaatiolla merkitä 100-prosenttisesti syödyiksi. Mallin `retainedFraction` saa arvon vasta näyttöön sidottuna.
4. **Ravintoportti:** täytä kaikki neljä makrokenttää vain, kun `docs/nutrition/calculations/<recipe_id>.json` täyttää nykyisen `nutrition-model`- ja `nutrition-evidence`-sopimuksen. Älä ohita ehtoja sen vuoksi, että hiilihydraatteja on vähän.
5. **GK-portti:** ratkaise projektin GI/GK-menettelyn kautta. `carbsAvailable` ja `GI` ovat eri suureita. Nollana käsiteltävässä lähteessäkin voi olla pyöristys.
6. **Integraatioportti:** #450 on jo sulautettu; `carnivore`-luokitus vaatii hyväksytyn FI-lähdehashin tuotantomanifestiin, ei pelkkää tekstin `tags`-riviä.
7. **CI ja katselmointi:** omat toiminnalliset testit sekä julkaisupäivän `main`-vertailu; PR #448:n omistaja integroi myöhemmän julkaisun, eikä toisesta työistunnosta työnnetä päälle.

## Huomioitavat kuvariskit

Aiemmassa visuaalisessa valmistelussa syntyi myös projektikoontigrafiikoita, joissa lukee “valmis” ja näkyy raakoja keltuaisia tai mausteita. **Niitä ei saa käyttää julkaisuun, eikä tekstiä tule tulkita näyttöön perustuvaksi hyväksynnäksi.** Steak & Eggs -erilliskuvakin tarvitsee vielä 3:2-WebP-versionoinnin.

## Tarkiste

Aja `cd site && npx tsx --test tests/karnivore-first3-raw-scenario.test.ts`. Testi lukitsee mukana olevat kolme lähdeblobia, grammaerät, laskennan aritmetiikan ja kaikki julkaisuesteet.

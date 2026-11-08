# Rouva Keto: kahden FI-reseptin oma julkaisuaihio

**Tila: DRAFT / julkaisu HOLD – 8.11.2026**

Tämä rajattu haara lähtee mainin `ade46104` commitista. Mukana ovat ainoastaan **rasvakaakao-rouva-keto** ja **lammin-chia-puuro-rouva-keto**, niiden kaksi digitaalista WebP-kuvaa sekä supistettu ravintolähdepaketti. Suklaavaahto ja sen munatuotteet eivät kuulu tähän muutokseen.

Haara käyttää nykyistä mainin 335 reseptin hyväksyttyä lähtötilaa. Vain näiden kahden FI-reseptin ehdottaminen kasvattaisi esikatselun 337 reseptiin. Historialliset 326-reseptin GK-sinetit ja nykyiset 335-reseptin testit säilytetään; muutokset vain testien tämän erän suljettuun kahden reseptin projektioluetteloon.

Frontmatter `status: published` koskee **ehdotetun PR-haaran esikatselua** eikä anna itsenäistä julkaisulupaa. Tämä Draft EI saa mennä mainiin ennen tuotepakkausten täsmätietojen, ravintoarvojen, käytettävyyden ja reseptien valmistettavuuden toimituksellista hyväksyntää. Fyysistä koekeittiökoetta ei ole tehty. GK puuttuu lähdeperusteisesti (HOLD / `null`), eikä ryhmäkeskiarvo-GI:tä julkaista.

## Ero muihin haaroihin

- #305: koko neljän idean lähdekartoitus ja 8.11.2026 turvallisuuskatselmointi.
- #313: alkuperäinen kolmen reseptin julkaisu-PR, jossa myös suklaavaahto. **Älä yhdistä #313:a sellaisenaan tämän PR:n jälkeen:** päällekkäiset reseptitunnisteet.
- Suklaavaahto pysyy erillisenä HOLD-tutkimusehdokkaana, kunnes pastöroidun keltuaisen ja vaahtoutuvan valkuaisen tuotetunnukset, ravintoarvot, käyttöturvallisuus ja valmistus on osoitettu.
- EN/SV/TH eivät kuulu tähän FI-first-rajaukseen. Käännösten julkaisu edellyttää omaa semanttista vertailua.

## Hyväksyntäportit

1. Täysi nyky-HEADin GitHub Actions, kuva-, staattiset, GK-historia- ja ravintotarkistukset PASS.
2. Käytettävien kaakao-, kerma-, voi-, kookosöljy-, chia- ja suklaatuotteiden pakkaukset ja allergeenit täsmäytetään. Lindt 90 % hiilihydraatit 14 g/100 g; kuitu-/polyolierittelyä ei ole osoitettu. `carbs_total_per_serving_g` pysyy `null`.
3. Valmistusohjeiden käytettävyys tarkistetaan dokumentoidusti; **koekeittiössä valmistettu** -väitettä ei tehdä.
4. Kuvasuhteet, kuvien omaperäisyys, reseptin ravintoarviot ja FI-first-julkaisurajaus hyväksytään.
5. Vasta tämän jälkeen PR Ready/merge, uusi main-deploy ja todellinen tuotantoselaintarkistus.

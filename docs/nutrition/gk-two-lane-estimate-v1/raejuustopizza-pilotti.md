# Raejuustopizza: ensimmäinen esimerkkitapaus ja sen rajaus

**EI julkaistava GK-laskelma.** Lähderesepti julkaistu PR #294:ssä, annos on **puoli** n. 25 cm:n pizzaa, erä 2 annosta.
FI: reseptit/paaruoat/raejuustopizza-kaurajauhopohjalla.md
Laskenta: docs/nutrition/calculations/raejuustopizza-kaurajauhopohjalla.json, sourceHash 32e6247c13590f4f7e9e767c25bd4f0df09af83e1d5becf1ea7cc5b486489122, laskentapäivä 5.11.2026.

## 1. Tosi lähtötieto: imeytyvä hiilihydraatti

| Aines | Saatavaa CHO / **annos** g | Selite |
| --- | ---: | --- |
| 25 g kaurajauhoa koko pizzaan | 7,984625 | Fineli 30190: 63,877 g/100 g |
| 200 g 2 % raejuustoa | 2,500000 | Fineli 649 |
| 110 g kuoretonta kananmunaa | 0,165000 | Fineli 858 |
| 5 g valkosipulia | 0,255000 | AFCD F004193 |
| 40 g keltasipulia | 0,960000 | Fineli 335 |
| 3 g basilikaa | 0,003000 | AFCD F000396 |
| 60 g tomaattimurskaa | 1,035000 | Fineli 398 |
| mozzarella, pepperoni ja suola | 0,000000 | juuri nykyisten sidottujen ravintoarvorivien mukaisesti |
| **Yhteensä / annos** | **12,902625** | Julkinen ravintoarvio pyöristetään 12,90 g |

Kaurajauhon osuus hiilihydraatista on 7,984625 / 12,902625 ≈ **61,884 %**. Muita hiilihydraatteja on 4,918 g annosta kohti, joten niitä ei saa piilottaa poisjättöön tai olettaa GI 0:ksi. Näin pysytään myös tiukan nykyisen A-menetelmän puolella rehellisinä.

## 2. Mitä ei vielä tiedetä?

- Paistetun, kananmunaa ja raejuustoa sisältävän kaurajauhopohjan ihmisillä mitattu GI tai tähän soveltuva, kuratoitu GI-vastine.
- Erillisten muiden CHO-ainesten soveltuvat GI- tai koodisidokset tässä valmistustilassa ja niiden mahdollinen päällekkäisyys valmiin komponentin GI:n kanssa.
- Valmistuksesta johtuvat GI-erot. Koepaisto ei korvaa ihmis-GI-tutkimusta, eikä koepaisto ole reseptin julkaisuehto.

Tutkimusnäyttö osoittaa, että kaurahiutale-/puurotuotteiden prosessointi muuttaa GI:tä (Tosh & Chu, PMID 26330200). Niiden GI ei ole automaattisesti sama kuin kaurajauhopizzan. Zhou ym. 2024 (PMID 39366276) vertaili erikarkeista kaurajauhoista tehtyjen **puurojen** glukoosivastetta: jauhatuksen vaikutus on olennainen, mutta tutkimus ei mittaa tämän pizzapohjan GI:tä. Atkinson ym. 2021:n kansainväliset taulukot ovat GI-tutkimuskohteiden haku- ja laatulähde, eivät väite tästä pizzapohjasta. Aikaisempi keskustelussa esitetty 53/74/92 ja 'muut GI 50' oli **laskennallinen ajatuskoe**, EI tällä reseptillä hyväksytty analyysi. Numeroa noin 8 ei saa siirtää sivulle tämän PR:n perusteella.

## 3. Kaava ja vain matemaattinen herkkyyskoe

Kahden ilmasta valitun GI-syötteen avulla laskettu _what-if_ on:

GK(annos) = (7,984625 × GI_kaurakomponentti + 4,918000 × GI_muut) / 100.

Jos muut GI-oletetaan 50:ksi (ei hyväksyttyä lähdettä) ja kaurakomponentin GI:tä vain testataan arvoilla 50, 70 ja 100, lukuarvot ovat 6,4513125; 8,0482375; 10,443625. Tämä osoittaa, miksi valittu oletus voi muuttaa luokkaa. **Luvut eivät ole todellinen epävarmuusväli, eivät soveltuvan GI-lähteen vertailuarvot eivätkä ehdotus reseptin julkaistavaksi GK:ksi.** GI voi olla myös yli 100.

Koneellinen [pilotti-JSON](raejuustopizza-laskentapilotti.json) erottaa CHO-faktat tästä tarkoituksellisesti ei-julkaistavasta herkkyyskokeesta.

## 4. Näin pizza etenee kohti julkista B-arviota

1. Varmista reseptin syötehash, koostumuksen CHO-määritelmät, annos ja komponenttien rajat nykyisestä laskentapaketista.
2. GI-tietokannasta etsitään ensisijaisesti **paistetun kaurajauhoa sisältävän valmisteen** ihmis-GI-havaintoja sekä määritellään olennainen valmistusero. Kaurahiutalepuuro ei sellaisenaan kelpaa. Mahdollinen taulukon tai tutkimuksen GI-vastine saa ensin soveltuvuusarvioijan päätöksen.
3. Etsi tai laadi rajatut, kerran hyväksyttävät koodisidokset muille 4,918 g hiilihydraateille. 'Raejuusto' ei saa huomaamatta muuttua 'maito' -koodiksi eikä tule sallia täysin perustelematonta yhteistä GI 50:tä.
4. Laske koko annos ilman kaksinkertaista valmiin pizzapohjan / sen raaka-aineiden CHO:ta. Tarkista lähdekäytön lisenssit, tulos ja hallittu epävarmuus.
5. Kirjaa menetelmäversion mukainen MODEL_POINT_REVIEWABLE / MODEL_SCENARIOS_REVIEWABLE, erillinen toimituksellinen hyväksyntä ja vasta sitten mahdollinen B-julkaisu.
6. Jos hyväksyttävää lähivastinetta ei löydy, pizza pysyy A:n GK-HOLD-tilassa, eikä mikä tahansa skenaario muuta sitä. FI/EN/SV/TH-resepti säilyy kuitenkin julkaistuna.

## 5. Hyväksyntäkriteerit tälle pilotille

- CHO-summa 12,902625 g/annos reproduktioidaan muuttamatta ravintoarvion alkuperäisiä tietueita.
- Ei uusia kovakoodattuja kaura-GI-oletuksia. Kaikki myöhemmät GI-vastineet nimetään, lähteistetään ja valmistustestataan.
- Väärä ainesmäärä, annosmäärä tai sourceHash vanhentaa pilottisidoksen.
- Käyttäjä ei koskaan näe 'GK 8' vain siksi, että mitä-jos-taulukon keskiskenaario sattuu antamaan sen.

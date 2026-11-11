# Recipavo – laaja vaihe II: 15 reseptin aines-/ravintoperustan näyttöportti

**11.11.2026 — issue #404 / B21.** Tämä raportti on toteutettu GitHubin `main`-haaran 15 nykyisen FI-reseptitiedoston tarkistuksen perusteella. Tarkka jokaisen lähteen Git-blob-SHA, havaittu ainesosarivi ja tapauskohtainen riippumattoman evidenssin vaatimus on tiedostossa [2026-11-11-material21-fifteen-evidence-cases.json](2026-11-11-material21-fifteen-evidence-cases.json).

## Päätös

**15 käsittelykorttia, 0 uutta ravinto- tai GK-hyväksyntää.** Näistä 11 pidetään nykyisessä julkisessa karanteenissa ja neljä pysyy erillisen valmistusohjekorjauksen varassa. Määrien ongelmia ei saa ratkaista keksimällä grammoja, vaihtamalla lähdeaineiston laskennan kannalta sopivammaksi eikä purkamalla GK-sidoksia. Tämä PR ei muuta yhtäkään julkaistua reseptiä tai sen julkisuusasetusta.

### Erät riippuvuuksien perusteella

| Erä | Kortit / reseptit | Evidenssin ensisijainen este | Päätös |
|---|---|---|---|
| A, 5 | #03 nasi goreng, #06 yaki-onigiri, #28 miso-tofu-paksoi, #34 mandu-keitto, #44 appelsiinikakku | Tuote-/olomuotopohja tai perusreseptin rakenne | HOLD; ei automaattisia muutoksia |
| B, 5 | #11 suolakalafritterit, #18 roti canai, #22 msemen, #26 lontong sayur, #45 kikherne-yrttiaamiainen | Kuiva/kypsä-tila, turvallinen esikäsittely, taikinavesi tai lisäaines | HOLD; ei automaattisia muutoksia |
| C, 5 | #02 bakwan, #21 maakouda, #29 soba, #31 jianbing, #40 huevos divorciados | Syötävä massapaino, punnittu vesi tai tuotekohtainen ravintoarvo | HOLD-laskenta, näkyvän valmistuksen tekninen suoja ennallaan |

**Huom.** Erä C:n maakouda on jo julkisessa karanteenissa. Muut neljä ovat näkyvissä mutta tämä raportti ei ole niiden ravinto-/GK-hyväksyntä.

## 15 yksilöidyn tapauksen varmennusehdot

| #404 | Resep­ti | Ennen hyväksyntää vaadittava näyttö |
|---:|---|---|
| 02 | Bakwan | Porkkanan syötävä grammapaino, taikinaan lisättävän veden määrä ja tuotekohtainen makropohja |
| 03 | Nasi goreng | Kecap manis 150 g -määrän alkuperäinen lähde, tuote ja riisin kuiva/kypsä tila |
| 06 | Yaki-onigiri | Miso 150 g ja nori 150 g: lähde, norin tila ja suhteet riisimäärään |
| 11 | Suolakalafritterit | Suolakalan todellinen grammamassa, suolanpoisto ja taikinavesi |
| 18 | Roti canai dhalilla | Linssin kypsennys, roti-taikinan nestemäärä ja kokonaisaika |
| 21 | Maakouda | Kuoritun perunan syötävä massa sekä GI/GK-syötteen vastaavuus |
| 22 | Msemen hunajalla | Taikinavesi, kerrostus ja annoksiin jäävä rasva |
| 26 | Lontong sayur | Kaalin syötävä massa ja riisikakun todellinen tuotetila |
| 28 | Miso–tofu–paksoi | Wakamen kuiva/rehydratoitu-massa ja mison tuotekohtainen koostumus |
| 29 | Soba | Pinaattinipun syötävä massa, dashi ja toisen liemen tuote sekä soban painotila |
| 31 | Jianbing | Soijapaputahnan tuote, mitallinen grammamassa ja taikinavesi |
| 34 | Mandu-keitto | Merilevän painotila sekä mandu-tuotteen koostumus |
| 40 | Huevos divorciados | Mustien papujen kuiva/kypsä paino ja salsan koostumus |
| 44 | Appelsiinikakku | Nostatus-/sidontarakenteen oikea resepti ja ainesluettelon vastaavuus |
| 45 | Kikherne-yrttiaamiainen | Kikherneen painotila ja luettelemattomien kananmuna-/öljylisäysten ratkaisu |

## Tekninen toteutus

- `site/scripts/material-fifteen-evidence-check.ts` lukee 15 manifestiriviä, laskee jokaiselle alkuperäisen FI-Markdownin **Git-blob-SHA-1:n**, tarkistaa tunnuksen, ainesosarivin yksikön ja määrän, eikä luota vanhentuneeseen työjonoon.
- Samassa ajossa tarkistetaan kaikki 11 nykyistä julkista karanteenia ja neljä näkyvää valmistusohjekorjattua kohdetta. Karanteenista poistuminen ilman erillistä hyväksyntää on virhe.
- `site/tests/material-fifteen-evidence.test.ts` varmistaa rajatun 15 tapauksen joukon, SHA:n vanhenemisen, määrätiedon muuttumisen, päällekkäiset kohteet ja sen, ettei `approval`-kenttiin voi muuttaa mitään `true`-arvoa.
- Komento: `cd site && npm run audit:material15`. Tuloste raportoi vain `SOURCE_LOCKED_HOLD_ONLY` ja `approved: 0`. Tätä ei saa käsitellä automaattisena päätöksenä hyväksyä ravintoarvoja.

## Seuraava varsinainen lähdekorjaus

1. Kerää tuotekohtaiset lähteet ja syötävät massat erälle C (enintään 5 kerralla). **Älä julkaise keksittyä arvoa**, vaikka näyttöohje olisi teknisesti korjattu.
2. Tee riippumaton ravintoarvojen uudelleenlaskenta ja ruokaan käytetyn määrän / GI-evidenssin hyväksyntä. Jos yksi resepti pysähtyy, eristä se HOLDiin ilman muun erän hylkäämistä.
3. Erille A ja B tehdään ruokalajikohtaiset lähde-/valmistus- ja tarvittaessa ruokaturvallisuusratkaisut ennen määrien lukitusta.
4. Kustakin hyväksytystä muutoksesta oma versionmukainen PR, tarkka `HEAD`-CI PASS, tarvittaessa EN/SV/TH-merkityskatselmointi sekä uuden `main`-haaran Pages-deploy. Vasta tämän jälkeen julkisuuskaranteenin purkua voidaan erikseen harkita.

## Rajat

Tämä **ei** ole 15 reseptin korjaus tai ravintolaskennan hyväksyntä: se on niiden yksilöity, koneellisesti tarkistettava päätös- ja todistusaineiston lähtötilanne. Ei muutoksia julkisiin FI/EN/SV/TH-resepteihin, `site/scripts/public-recipe-quarantine.ts`-listaan, julkaistuun GI/GK-kattavuuteen eikä Cloudflare Coming Soon -sivuun. Yhteenlaskettu issue #404:n 38/38 tekninen näkyvyysjakauma on oma erillinen seurantansa.

**Julkaisuportti:** Draft / DO NOT MERGE ennen tämän erän täsmä-HEAD-CI PASSia ja sitä, että manifestissa kuvattu `main`-lähdevastaavuus pysyy edelleen täsmälleen oikeana.

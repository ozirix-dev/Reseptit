# Gluteenittomat leivät — reseptin lähdevertailu ja julkaisun laatuportti 11.11.2026

**Kohde:** PR #441, ainoastaan `gluteeniton-siemenvuokaleipa` ja `gluteenittomat-kauralesesampylat`. Kumpikin on `status: draft`. Kolme jo julkaistua gluteenitonta FI-reseptiä eivät kuulu tähän muutokseen.

## Vertailu Keliakialiiton alkuperäisohjeisiin

| Työvaihe | Siemen-vuokaleipä | Kauralesesämpylät |
| --- | --- | --- |
| Vertailulähde | [Anna-Kaisan vuokaleipä](https://www.keliakialiitto.fi/ruoka/reseptit/anna-kaisan-vuokaleipa/) | [Gluteenittomat kauralesesämpylät](https://www.keliakialiitto.fi/ruoka/reseptit/gluteenittomat-kauralesesampylat/) |
| Nestemäärä | 6 dl vettä → oma 600 g; fysikaalisesti mielekäs muunnos | 5 dl vettä → oma 500 g |
| Psyllium | 1 rkl → oma 8 g, ei lähtöreseptin punnitus | 2 tl → oma 4 g, ei lähtöreseptin punnitus |
| Jauhot | 3,5 dl vaaleaa + 3 dl tummaa → oman muunnelman 210 g + 180 g | 2 dl tummaa → oman muunnelman 120 g |
| Muut kuitu-/vilja-aineet | kaurahiutaleet 2 dl → 70 g (oma punnittava määrä) | kauralese 2 dl → 100 g, perunakuitu 2,5 dl → 43 g (omat punnittavat määrät) |
| Nostatus | kuiva hiiva 1 pss, 20 min kohotus | kuiva hiiva 1 pss, 15–20 min kohotus |
| Paisto | 180 °C noin 60 min, 1,5 l vuoka | 225 °C, 15–20 min, 16 kappaletta |
| Leivontatavan poikkeus | vuoan voitelu on muutettu leivinpaperiksi; annoskoon ja keskiosan kypsyys arvioitava | pellin jauhoitus on vaihdettu käsien kostutukseen; 5 g pintakauraa on oma kuvavastaavuuden lisäys |

**Katselmointihavainto:** sämpylöiden ohjeessa oli aiemmin “annosteltu ruokalusikallinen”, vaikka rakenteinen pintakauran määrä oli **5 g**. Korjattu nimenomaisesti 5 grammaksi; uusia aineita eikä makroja lisätty. Ainesosat ja ravintoarvioluvut säilyivät ennallaan. Pitää testata reseptin annosskaalaus erikseen, sillä ainesosien määrä voi muuttua UI:ssa mutta ohjetekstin kiinteä 5 g ei automaattisesti skaalaudu. Siksi julkaisukatselmoinnissa käytetään oletusannosmäärää 16.

## Julkaisuesteet — tuotteen sopivuus

1. Pirkka vaalea (EAN 6410405221858) ja tumma (EAN 6410405221872) ovat tuote- ja EAN-pohjaisia gluteenittomia vaihtoehtoja, mutta seosten koostumus/vesisidonta voivat muuttua. Varmista käytetty pakkaus ja allergeenit. [K-Ruoka gluteenittomat jauhot](https://www.k-ruoka.fi/kauppa/tuotehaku/kuivat-elintarvikkeet-ja-leivonta/jauhot-ja-suurusteet/gluteenittomat-jauhot).
2. Myllärin gluteeniton kauralese ja kaurahiutaleet ovat erikseen gluteenittomaksi ilmoitettuja, mutta tavallinen kaura ei korvaa niitä. [Keliakialiiton apuaineiden ja merkintöjen ohje](https://www.keliakialiitto.fi/gluteenittomuus/gluteenittomat-tuotteet/listauksia/leivonnan-apuaineet/).
3. FiberHusk-psyllium, Pofiber-perunakuitu ja Sunnuntai-kuivahiiva: tarkista oikea tuoteversio, koostumus sekä gluteenittomuuden pakkausmerkintä. Pofiberia ei saa korvata perunajauholla ilman reseptin uudelleensuunnittelua.
4. Valmiin ruoan gluteenittomuus edellyttää gluteenittomia ainesosia ja gluteenin siirtymisen ehkäisyä työvälineiden, työpinnan ja jauhopölyn kautta. Mikään tämän dokumentin laskelma ei ole lopputuotteen mittaus tai yleispätevä keliakiaturvallisuustodistus.

## Julkaisuesteet — annoksen ja rakenteen toimivuus

Näitä kahta grammoihin muutettua reseptiä ei ole koeleivottu. Toiminnallista arviointia varten tarvitaan vähintään:
- **Vuokaleipä:** valmis taikina mahtuu valittuun 1,5 litran vuokaan niin, että kohotusvaraa jää; paiston jälkeen keskiosa ei jää tahmeaksi, pohja ei painu kasaan ja täysin jäähtynyt leipä viipaloituu.
- **Sämpylät:** 16 kappaleen muotoiltavuus on uskottava; psylliumin 4 g ja Pofiberin 43 g vesidonta säilyttää taikinan koossa, 42-asteisen veden jälkeen hiiva toimii, keskiosa kypsyy 225 asteessa 15–20 minuutissa ja jäähtynyt sämpylä on leikattava.
- **Molemmat:** tilavuusmittojen sijasta nimenomaan tässä PR:ssä olevat grammamäärät arvioidaan kokonaisuutena; ainesosaa ei voi vaihtaa säilyttäen automaattisesti samaa ravintoarvoa, kohoamista tai gluteenittomuuden hyväksyntää.

Jos fyysistä koeleivontaa ei tehdä, voidaan tehdä dokumentoitu toimituksellinen oletuskatselmointi, mutta sitä ei saa väittää tehdyksi leivontakokeeksi. Jos rakenteen toimivuus jää epävarmaksi, resepti pidetään Draftina; edellisen lähteen onnistuminen ei tarkoita oman grammoitetun version verifiointia.

## Lukujen jäljitettävyys

Makroarvioissa on sama lähde kuin [kolmen sijasta kahden leivän ravintomuistiossa](../nutrition/gluteenittomat-kaksi-2026-11-11.md): vuokaleipä 27,45 g imeytyvää hiilihydraattia / 12 viipaletta, sämpylät 10,14 g / 16 kappaletta. Kuitua sisältävää kokonaishiilihydraattia ei ole laskettu. GK:ta ei ole laskettu eikä luokiteltu. **Laadullinen testaus ei oikeuta muuttamaan arvion statusta laboratoriotulokseksi.**

## Julkaisun päätös

**HOLD molemmille**. Tämä katselmointi varmentaa lähdeankkurit ja ohje-/ainesosavastaavuuden, ei lopputuotteen fyysistä suorituskykyä. Tee myöhempi mahdollinen FI-julkaisu omalla rajatulla PR:llä ja SHA-256-lukitulla `gluten_free_review`-muistiolla vasta tuotekohtaisen tarkistuksen jälkeen. Älä julkaise automaattisesti yhtään reseptiä. Kolme jo mainissa julkaistua reseptiä jätetään täysin ennalleen.

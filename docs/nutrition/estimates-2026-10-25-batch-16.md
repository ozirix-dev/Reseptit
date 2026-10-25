# Ravintoarvioiden erä 16 — 25.10.2026

## Valinta ja tarkistus

Erään valittiin 20 julkaistua aamiaisreseptiä, joilta lähtöauditissa puuttuivat arvot. Valinta ryhmittelee viljapuuroja, riisi- ja nuudeliruokia sekä jogurtti- ja lettureseptejä. Reseptien valmistusohjeissa havaittiin laskennasta puuttuneita aineksia ja määrittelemättömiä nesteitä. Ennen laskentaa täsmennettiin kuskusveden määrä, reseptien vesipohjaiset kypsennysnesteet, aamiaisen lisäkkeet ja muut ohjeissa mainitut ainekset. Määrät ja tuotteet täsmennettiin julkaistuissa suomenkielisissä lähderesepteissä.

Laskentasyöte on [batch-16-manifestissa](batches/batch-16.json), ja jokaisen reseptin täydellinen näyttö, lähdetietueet, raakapaino-/tuotevastaavuudet, reseptiversion tiiviste, annosjako ja rajaukset ovat [laskentatiedostossa](calculations/). Kaikki 20 laskettiin uudelleen yhteisellä mallilla vasta lähdemäärien ja valmistustapojen korjaamisen jälkeen. Pienet mauste- ja yrttimäärät, joiden lähdetietue ei ollut tarpeellinen makrojen kannalta, on rajattu pois annoskohtaisin ylärajoin. Suola on rajattu pois, koska sillä ei ole vaikutusta esitettyihin makroihin. Öljyjen käyttömäärät lasketaan kokonaan mukaan.

Fineli Release 20 -aineiston käyttö on THL:n CC BY 4.0 -lisenssin mukaista. AFCD Release 3 -tietueet on merkitty vastaavine lisensseineen laskentatiedostoihin. Kokonaishiilihydraatti on imeytyvä hiilihydraatti + kuitu + polyolit; nettoarvosta vähennetään vain lähteistetyt polyolit. Arvot jaetaan kahdella annoksella ja pyöristetään kahden desimaalin tarkkuudella. Puuttuvia lähdearvoja ei käsitellä nollina.

## Ravintoarvot annosta kohti

| Resepti | Nettohiilihydraatit (g) | Kokonaishiilihydraatit (g) | Proteiini (g) | Rasva (g) |
| --- | ---: | ---: | ---: | ---: |
| karibia-maissipuuro-kookoksella | 43.80 | 44.75 | 4.09 | 14.87 |
| kiinalainen-hirssipuuro-taateleilla | 37.85 | 40.42 | 6.72 | 3.85 |
| kiinalainen-musta-seesamipuuro | 46.50 | 49.02 | 7.64 | 5.23 |
| thai-papaijajogurtti | 12.44 | 15.96 | 3.98 | 8.81 |
| lahi-ita-pistaasijogurtti | 8.23 | 10.92 | 5.27 | 8.82 |
| pohjoisafrikkalainen-kuskus-aamiaiskulho | 42.52 | 45.83 | 10.91 | 7.18 |
| vietnamilainen-chao-ga-kanapuuro | 37.32 | 37.87 | 20.49 | 1.07 |
| vietnamilainen-pho-ga-aamuksi | 40.87 | 41.93 | 18.60 | 0.88 |
| vietnamilainen-papaija-kookospuuro | 49.70 | 52.07 | 1.85 | 14.28 |
| vietnamilainen-hu-tieu-aamiaiskeitto | 42.08 | 44.18 | 21.61 | 2.02 |
| korealainen-kongjuk-soijapapu-riisipuuro | 46.43 | 62.47 | 28.21 | 18.59 |
| korealainen-jumeokbap-merilevalla | 38.73 | 40.70 | 4.86 | 7.37 |
| thai-kookosriisi-mangolla | 48.05 | 49.76 | 5.83 | 16.41 |
| malesialainen-nasi-lemak-aamiaisella | 39.78 | 40.48 | 11.92 | 19.75 |
| malesialainen-mee-goreng-aamunuudeleilla | 35.42 | 38.40 | 21.71 | 17.71 |
| indialainen-poha-maapahkinoilla | 43.06 | 45.86 | 7.79 | 12.36 |
| intialainen-ven-pongal | 71.10 | 82.62 | 23.70 | 13.90 |
| kiinalainen-jianbing-munaletty | 38.96 | 41.60 | 14.79 | 15.39 |
| thai-kananmunat-kookoscurryssa | 43.31 | 45.31 | 12.68 | 26.79 |
| malesialainen-apam-balik | 57.18 | 60.75 | 12.94 | 15.13 |

## Audit ja prosessin parannus

Tiukka ravintoarvoauditointi tarkistaa laskentasyötteen, reseptiversion, lähdetietueet, laskennan kaikki neljä arvoa kahden desimaalin tarkkuudella sekä julkaistut käännökset. Erän kaikki 20 reseptiä hyväksyttiin `ESTIMATE WITH EVIDENCE` -tilaan. Auditissa on nyt yhteensä 140 evidenssillä tuettua arviota, 86 aiempaa tarkistusta odottavaa arviota, 99 puuttuvaa arviota ja 0 ristiriitaa.

Erän prosessiparannus oli ohjeiden ja laskentasyötteen ristivertailu ennen ravintoarvojen julkaisua. Se löysi puuttuneita aineksia, jotka pelkkä neljän arvon laskentatarkistus ei tunnista, jos laskentasyöte on itsessään keskeneräinen. Jatkossa jokaisessa erässä tarkistetaan ohjeiden kaikki aineosamaininnat suhteessa mitattuihin ainesosiin ennen laskentaa. Auditointi havaitsee tästä eteenpäin laskentasyötteen, reseptin tai arvon muutoksen aiheuttaman ristiriidan.

Arvot ovat suuntaa-antavia reseptiarvioita, eivät laboratorioanalyysejä. Fineli: https://fineli.fi/fineli/fi/avoin-data. AFCD: https://www.foodstandards.gov.au/science-data/monitoringnutrition/afcd.

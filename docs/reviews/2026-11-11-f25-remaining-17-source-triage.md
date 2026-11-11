# F25 / 17 HOLD-lähdettä – ravintoperustan ja valmistuksen jatkotarkistus 11.11.2026

**Snapshot** `9e6a00c33b1ee2c1cf0de2f086b257da8d3c8f50`. [F25 Draft #399](https://github.com/ozirix-dev/Reseptit/pull/399) on DO NOT MERGE. Tässä PR:ssä ei ole FI-reseptijulkaisua, käännöstiedostojen statusmuutosta, laskentatiedostojen hyväksyntää eikä GI/GK-sinettien muutosta. Tämä on päivätty tutkimus-/triageaineisto. Laskennan lähteet, reseptien Git-blob-SHA:t ja tuotemerkkien epävarmuudet löytyvät [koneellisesti tarkistettavasta tiedostosta](../../meta/kaannokset/f25-remaining-17-evidence-20261111.json).

## Kattavuus ja turvaraja

- Ennestään julkaistu F25 **8 FI / 24 kieliparia**, koko julkaisurekisteri **67 FI / 201 paria**. Vielä **17 FI / 51 kieliparia** SOURCE-HOLD.
- **9/17** lähteestä puuttuu reproduktioitava `docs/nutrition/calculations/<id>.json`. **8/17** sisältää laskentasyötteen, mutta tuotteen/mittamuunnoksen, ruokalajin tai valmistusmenetelmän tarkastus on avoin.
- **2/17 on julkisessa karanteenissa**: `pohjoisafrikkalainen-maakouda` ja `indonesialainen-nasi-goreng-aamiaisriisi`. Ei käännösjulkaisua, ennen kuin karanteenin lähde-/ravinto/GK-päätös on hyväksytty. Lähteen `status: published` raakatekstissä ei yksin tarkoita käyttäjälle julkaistavaa ruokaa.
- Kaikki **17 ovat tässä rekisterissä `release_authorized: false`**. F25 #399:n alkuperäisiä käännöksiä ei yhdistetä yhtenä PR:nä.

## 1. Rahka-marjakerroskulho (4 annosta)

FI:n ilmoitus: **6,32 g netto-HH / 8,09 g HH kuidun kanssa / 8,05 g P / 6,01 g rasvaa / annos**. Varsinaista ainesosakohtaista ravintolaskentasyötettä ei ole.

Laskentaskenaario A (Valion [pehmeä maitorahka](https://www.valio.fi/tuotteet/valio-pehmea-maitorahka/) 250 g, [Salakis 10% turkkilainen jogurtti](https://salakis.fi/tuotteet/turkkilainen-jogurtti-10-laktoositon/) 100 g, Fineli/Arktiset Aromit [mansikka](https://www.arktisetaromit.fi/luonnontuotteet/luonnonmarjat/ravintosisalto/ravintosisaltotaulukoita/) 100 g ja metsämustikka 50 g sekä [Salliselta hasselpähkinä](https://www.k-ruoka.fi/kauppa/tuote/salliselta-hasselpahkina-80g-6436501000418) 20 g): **7.1975 g netto-HH / 8.555 g HH kuidun kanssa / 8.275 g P / 5.9 g rasvaa**.

Laskentaskenaario B ([Fineli maitorahka 622](../../docs/nutrition/calculations/rahkapiirakka-vhh.json), 10% jogurtin Fineli-koostumus, AFCD mansikka, metsämustikka ja [Meira hasselpähkinäjauhe](https://www.k-ruoka.fi/kauppa/tuote/meira-hasselpahkinajauhe-70g-6414203310226)): **5.795 / 7.6325 / 8.1012 / 6 g / annos**. Tässä skenaariossa käytetään jauhetta, joten kyseessä on tuotemallivertailu eikä saman kokonaisen pähkinän tarkka mittaus.

Molemmista puuttuvat **1 tl sitruunankuoren syötävä massa** ja **valinnaisen makeutusaineen aines- ja annosrajaus**. Niitä ei saa vain merkitä nolliksi. Raakalähteen ohje on ruokalajina järkevä (kylmävalmistus; esityksen cooking_method on korjattu SHA-lukitusti), mutta julkaistut makrot eivät ole kummassakaan skenaariossa todistettu täsmäosuma. **HOLD – varmista lopulliset tuotteet, tl→g ja makeutustapa, luo riippumaton laskentasyöte, sovita FI ja EN/SV/TH**.

## 2. Pinaatti-paneer-chilla (2 annosta)

FI-lähde sisältää **100 g kikhernejauhoa, 50 g pinaattia, 140 ml vettä, 100 g paneeria, 1 tl juustokuminaa, 1 rkl öljyä**. Neljä makroa sekä ainesosakohtainen syöte **puuttuvat**. Ruokalaji on järkevä paneer-täytteinen kikhernelettu (vertailu [NDTV Food, Paneer Besan Chilla](https://food.ndtv.com/recipe-paneer-besan-chilla-128/amp/1) sekä [paneer palak -chilla](https://food.ndtv.com/food-drinks/watch-give-a-tasty-spin-to-classic-chilla-with-this-paneer-palak-chilla-3543337)).

Lähdemalli käyttäen repoon aiemmin kirjattua AFCD-kikhernejauhoa ja pinaattia, Arlan [Apetina Paneer](https://www.arla.fi/tuotteet/arla-apetina/paneer-225g-69940/) -tuotetta sekä Fineli 541 -öljyä (1 rkl = mallissa 13,5 g täysin syödyksi): **21 g netto-HH / 32.025 g HH kuidun kanssa / 21.45 g P / 13.5683 g rasvaa / annos**, **ILMAN** juustokuminaa.

Hypoteesi, jossa 1 tl jauhettua [Mauste-Sallisen juustokuminaa](https://salliselta.fi/tuotteet/mausteet/juustokumina-jauhettu) painaa **2,1 g**, tuottaa **21.357 / 32.4922 / 21.639 / 13.7993 g / annos**. **Paino ei ole varmistettu jauhetun mausteen punnituksella**: USDA:n 2,1 g:n teelusikka viittaa kokonaisiin siemeniin, joten lukua ei saa sellaisenaan sinetöidä jauheen täsmägrammoiksi. Lähteen maininta korianterichutneysta ja sitruunalohkoista ei sisälly aineslistaan; julkinen näyttöprojektori on jo poistanut ylimääräiset ainekset, mutta kanoninen raakaohje jää sinetöidyksi.

**HOLD – punnittu juustokumina, tuotteet ja rasvan syöty osuus; uusi laskenta, oikea metadata ja semanttiset käännöstarkisteet**. Älä julista nykyisen FI-lähteen puuttuvia arvoja nolliksi.

## 3. Za’atar-munat ja pita (2 annosta)

Nykyinen [laskentasyöte](../../docs/nutrition/calculations/lahi-ita-zaatar-munat.json) jättää **1 tl za’ataria pois** ja olettaa teelusikallisen enintään **2,5 g**. Sen hiilihydraatin `omissionImpactUpperBoundPerServing` on **0,1 g netto-HH / 0,2 g HH kuidun kanssa**.

Tuotekohtaiset 2,5 g:n skenaariot (jaettu kahdelle):
- [Santa Maria Za’atar](https://www.k-ruoka.fi/kauppa/tuote/santa-maria-zaatar-seasoning-350g-7311311028366): **0.225 g netto-HH, 0.325 g rasvaa, 0.15 g proteiinia** / annos. Kuituarvoa ei ole tässä tuotelähteessä, joten kokonaishiilihydraattia kuidun kanssa **ei lasketa**.
- [Mauste-Sallinen Za’atar](https://salliselta.fi/tuotteet/mausteet/zaatar): **0.3875 g netto-HH, 0.65 g HH kuidun kanssa, 0.2 g rasvaa, 0.1625 g proteiinia** / annos.

**Molemmat tuotemallit ylittävät alkuperäisen 0,1 g:n netto-HH-ylärajan.** Alkuperäistä poisjättöä ei voi pitää konservatiivisesti todennettuna. Molemmat sisältävät **seesamia (allergeeni)**. **HOLD – täsmätuote, punnittu teelusikallinen, uusi neljän makron laskenta sekä FI/EN/SV/TH-allergiamerkinnät.** Ei poisteta za’ataria perinneruoan identiteetistä.

## Loput 14 – toimenpidejärjestys

| Prioriteetti | Lähde | Päätös / jatkotoimi |
|---|---|---|
| 4 | `kiinalainen-soijamaito-aamiaisella` | Check unsweetened soy drink coagulation with measured rice vinegar and whether omitted acid is nutritionally bounded |
| 5 | `japanilainen-hojicha-jogurtti-persimonilla` | Match edible hojicha powder 2 g and all four macro values or model discard infusion explicitly |
| 6 | `vietnamilainen-papaija-kookospuuro` | Specify dry small tapioca pearls and preparation time, keep all 700 ml cooking water retained or re-model drain |
| 7 | `vietnamilainen-banh-cuon-sienilla` | Verify steamer/wrapper release, measured fish sauce and pork minced safely cooked, realistic 25 min preparation |
| 8 | `vietnamilainen-banh-xeo-aamiaisletut` | Decide turmeric in ingredient list vs remove from title/method, cook raw prawn fully; macro retest |
| 9 | `pohjoisafrikkalainen-baghrir` | Check 150 ml water/200 g dry flour and one-sided cook, correct unlisted butter claim, 25 min fermentation |
| 10 | `thai-roti-munalla-banaanilla` | Current liquid coconut batter resembles pancakes, not stretched roti; decide new title/identity or rebuild recipe and all macros |
| 11 | `meksikolainen-chilaquiles-verdes` | Product-match salsa verde and queso fresco, list edible corn tortilla and oil; supply all four macros |
| 12 | `meksikolainen-paputostada-aamupalaksi` | Specify cooked 150 g black beans, avocado flesh grams and tortilla model; supply all four macros |
| 13 | `korealainen-kimchi-jeon-aamiaiseksi` | Product-match kimchi 150 g, water in batter from kimchi plus separately added water, compute four macros |
| 14 | `karibia-plantain-aamiaislautanen` | Weigh peeled plantain, avocado flesh, lime juice, eggs and oil retention; all four macros absent |
| 15 | `munakoiso-kesakurpitsalasagne` | Select 180 g or 200 g pasta and dry/cooked state, cheeses and sauce, recalc all four macros; GI/GK remains separate |
| 16 | `pohjoisafrikkalainen-maakouda` | **JULKINEN KARANTEENI** – Public quarantine; potato edible grams & published CHO 4.84 g/serving inconsistent without source. New recipe and full nutrition/GK before unquarantine |
| 17 | `indonesialainen-nasi-goreng-aamiaisriisi` | **JULKINEN KARANTEENI** – Public quarantine; 150 g kecap manis and ambiguous 100 g rice dry/cooked require new recipe, macro and GK |

## Menetelmälliset rajat

- Ainesmäärä kertaa 100 g:n koostumus / annosmäärä. Netto-HH tarkoittaa EU-merkinnän kuitua sisältämätöntä hiilihydraattia; `totalCarbohydrateInclFibre = netCarbohydrate + fibre`. Kuitu ilmoitetaan erikseen eikä sitä vähennetä EU-nettohiilihydraatista. Toisin merkityt USDA-total-kentät eivät ole suoraan EU-kenttiä.
- Päivitetään tuotteen tarkan ravintoarvon lisäksi `sourceHash`, varsinaisen lähteen määrä- ja raaka/kypsätila, GI/GK-merkitys sekä EN/SV/TH kun niitä muuttuu. Kaksi desimaalia on näyttötarkkuus, **ei mittaustarkkuus**.
- Alla oleva regressiotesti tarkistaa ainoastaan tämän **päivätystä evidenssistä johdetun laskentaskenaarion numeerisen johdonmukaisuuden ja HOLD-statukset**; se **ei** ole riippumaton ravintohyväksyntä eikä reseptin keittiökoe.
- Yksittäinen korjattu lähde julkaistaan vasta **erillisen main-pohjaisen release-PR:n**, SHA-sidottujen merkitystarkisteiden, täsmä-HEAD CI SUCCESSin ja main-Pages build+deploy SUCCESSin jälkeen. Pidetään julkinen karanteeni erillisenä päätöksenä.

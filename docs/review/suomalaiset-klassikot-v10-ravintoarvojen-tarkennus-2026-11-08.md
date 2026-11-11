# Suomalaiset suosikit #311 – ravintoarvojen V10-tarkennus (8.11.2026)

## Päätös

Viiden julkaistun reseptin **ainesosakohtainen EU-imeytyvien hiilihydraattien alustava laskenta** on tallennettu koneellisesti jäljitettävänä JSON-aineistona: `docs/review/suomalaiset-klassikot-v10-hiilihydraattien-erittely-2026-11-08.json`. Laskentaa **ei** siirretä julkaistujen reseptien makrokenttiin, koska tietojen täydellisyyttä ja pakkaus-/punnitusrajoituksia ei ole vielä vahvistettu. Luotettavaa GK-lukua ei ole.

| Resepti | Annokset | Hiilihydraatit g/annos (ehdokas) | Pääepävarmuus |
| --- | ---: | ---: | --- |
| Karjalanpiirakat riisipuurolla | 24 | 15,37–15,88 | kaulintajauhon 0–20 g ja voiteluvoin 0–30 g todellinen käyttö; jauho-/riisituotteet |
| Marry me -kanapasta | 4 | 47,49–49,29 | De Cecco 69/72 g CHO/100 g -ristiriita, Royal-tomaatin 16 g/100 g arvon valutetun tuotteen soveltuvuus |
| Uunifetapasta | 4 | 47,39 (keskeneräisen lähdemallin pistearvo) | Barilla Penne n°73:n sekä fetan tuotetäsmäys; vihannesten yleislähteet |
| Raejuustobagelit | 6 | 38,96–38,98 | kananmunavoitelun 0–55 g syöty massa; jauhojen/leivinjauheen tuotetiedot |
| Linssimakaronilaatikko | 6 | 40,23 (keskeneräisen lähdemallin pistearvo) | kuivien linssien ja makaronin tuotesidonnat, maito ja muut ainesosat |

**Huomaa:** Laskettu kapea vaihteluväli EI ole kattava epävarmuusväli. Se kattaa ainoastaan dokumentoidut määrä- ja pakkausvaihtoehdot. Muita lähteiden epätarkkuuksia, mahdollisia tuotemuutoksia, valutus- ja kypsennysvaikutuksia sekä ravintopitoisuuksien luonnollista vaihtelua ei voi johtaa tästä välistä. Karjalanpiirakan arvot koskevat *yhtä piirakkaa ilman munavoita*.

## Laskentasäännöt ja lähteet

- `EU_AVAILABLE` tarkoittaa EU:n pakkausmerkinnän hiilihydraattimääritelmää, ei kuitua sisältävää US-`total carbohydrate` -määritelmää. Se ei suoraan kerro aterian GK:ta. Ei täytetä `carbs_net_per_serving_g` eikä `carbs_total_per_serving_g` ilman nimenomaista tietomallin hyväksyntää.
- Hiilihydraatit erästä = annosteltu raaka-ainemassa grammoina × lähteen EU-hiilihydraatit per 100 g / 100; jaetaan annosmäärällä. Kuiva pasta ja kuivat linssit lasketaan **kuivapainosta**, eikä keitetyn ruoan vedenotto lisää hiilihydraattien kokonaismäärää.
- Tuotekandidaattien arvoja käytetään niillä riveillä, joille on EAN-sidos, muutoin Fineli/AFCD-tietueita; vettä/suolaa 0 g. Tunnistamattomat käytetyt voitelu-/jauhomassat käsitellään välille 0–varattu määrä, **ei mitattuina arvoina**.
- Valio raejuusto 2 %: 1,8 g CHO, 15 g proteiinia, 2 g rasvaa / 100 g; tuotteen virallinen sivu https://www.valio.fi/tuotteet/valio-raejuusto/ (tarkistettu 8.11.2026).
- Myllyn Paras Makaroni: 68 g CHO, 13 g proteiinia, 1,7 g rasvaa / 100 g kuivaa tuotetta; https://www.myllynparas.fi/tuotteet/makaroni-400-g (tarkistettu 8.11.2026).
- Valio Emmental punaleima 17 %: 0 g CHO, 33 g proteiinia, 17 g rasvaa / 100 g; https://www.valio.fi/tuotteet/valio-emmental-punaleima-17-juusto/ (tarkistettu 8.11.2026).
- Muut tuotekohtaiset ja Fineli-/AFCD-viitteet: `docs/review/suomalaiset-klassikot-v3-tuote-gikandidaatit.json` ja `docs/review/suomalaiset-klassikot-v2-aineslahiematriisi.json`. Kumpikaan ei ole sellaisenaan hyväksytty koko reseptin makrolaskenta.

## Mitä tarvitaan proteiini-, rasva- ja energiatiedoille

1. Täsmennä kunkin reseptin merkittävien tuotteiden täydet 100 g ravintoluvut (energia, proteiini, rasva, EU-hiilihydraatit, kuitu) ja samat mitoitettujen Fineli-/AFCD-tietueiden kentät. Osa nykyisistä kirjastotietueista sisältää vain hiilihydraattimäärän.
2. Ratkaise valutus ja tuotteen syötävä määrä (Royal-tomaatti ja Mevgal-feta) sekä kaulintajauhon ja voitelujen oikea annos. Koepaiston **työoletus** ei muodosta mitattuja massoja.
3. Käsittele saman De Cecco -EANin 69/72 g / 100 g -ristiriita; ennen hyväksyntää ei valita sitä, mikä näyttää paremmalta.
4. Varmista ainesosakohtainen, annosmäärällä jaettava laskentapohja ja sen lähdelokit. Energian laskennassa huomioitava EU-kuidun energiasisältö ja pakkausarvojen pyöristys; älä johda perusteetonta tarkkaa kcal-lukua pelkästä hiilihydraattiosalaskelmasta.
5. GI/GK arvioidaan erillisellä hyväksytyn täsmämittausnäytön portilla; ei ruokalajianalogiaa eikä arvattua GI:tä.

## Julkaisuraja

Tämä muutos on **pelkkä dokumentoitu tutkimuslaskenta**: viisi reseptiä pysyvät julkaistuina, niiden neljä makrokenttää `null`, eikä historia-GK-testien baselinea muuteta. Ei päivitystä tuotantosivuston numeroihin ennen lähde- ja laadunvarmistusta.

## Proteiinin ja rasvan alustava erittely (V10-jatko)

Täydensin nykyistä Fineli/AFCD-pohjaa yhdeksän yksilöidyn tuotteen saatavilla olevilla proteiini- ja rasvatiedoilla. Lähteet ja jokaisen 47 rivin laskentasyötteet löytyvät tiedostosta `docs/review/suomalaiset-klassikot-v10-makroehdokkaat-2026-11-08.json`. Arvot eivät ole mitattuja, eikä niiden näennäinen desimaalitarkkuus kuvaa todellista epävarmuutta.

| Resepti | Proteiini g/annos (ehdokas) | Rasva g/annos (ehdokas) | Luokitus |
| --- | ---: | ---: | --- |
| Karjalanpiirakat | 2,79–2,89 | 1,44–2,47 | Kaikki syöterivit katettu ehdokastietueilla; voin ja kaulintajauhon määrä oletusväli |
| Marry me -kanapasta | 48,60 | 32,07 | Kuivattu timjami täydennetty Fineli-johdannaisesta lähteestä; Royalin ilmoitusperuste epäselvä |
| Uunifetapasta | 17,37 | 22,32 | Kaikki syöterivit katettu ehdokastietueilla; rasvassa Mevgal 24,5 g/100 g eikä aiempi yleisfetan 25 g |
| Raejuustobagelit | 15,90–17,06 | 2,11–2,96 | Munavoitelun todellinen käyttö 0–55 g; täsmäjauho ja leivinjauhe avoinna |
| Linssimakaronilaatikko | 20,49 | 9,34 | Kuivattu timjami täydennetty Fineli-johdannaisesta lähteestä; tuotetäsmäys yhä tarkistettava |

**Vähintään** tarkoittaa osalaskentaa, ei todennettua ravintosisällön alarajaa. Epävarmat pakkaus- ja massatiedot voivat muuttaa lukuja kumpaankin suuntaan. De Cecco -pastan 72 g CHO/100 g -ristiriitaa ei ole ratkaistu: samaan tuotteeseen vahvistetun 69 g P/F-mallin rinnalla eri hiilihydraattiarvo on edelleen erillinen skenaario.

Uusina tarkistettuina tuotelähteinä lisäksi:
- De Cecco Spaghetti n°12: CHO 69 g, P 14 g, F 1,5 g / 100 g – https://www.k-ruoka.fi/kauppa/tuote/de-cecco-spaghetti-n-12-500g-8001250120120
- Barilla Penne Rigate n°73: CHO 71 g, P 13 g, F 2 g / 100 g – https://www.s-kaupat.fi/tuote/barilla-penne-rigate-no73-durumvehnasta-valmistettu-pasta-500g/8076802085738
- Mevgal feta PDO: CHO 0,7 g, P 16,5 g, F 24,5 g / 100 g – https://www.filos.fi/tuote/mevgal-laktoositon-fetajuusto-pdo-200g/
- Pirkka puuroriisi: CHO 77 g, P 7,4 g, F 0,7 g / 100 g – https://www.k-ruoka.fi/kauppa/tuote/pirkka-puuroriisi-1kg-6410405257864
- Coop vihreät linssit: CHO 43 g, P 21 g, F 1,5 g / 100 g – https://www.s-kaupat.fi/tuote/coop-vihreat-linssit-400-g/7340191132238
- Royal aurinkokuivattu tomaatti: CHO 16 g, P 5,5 g, F 9,3 g / 100 g – https://www.s-kaupat.fi/tuote/royal-330200g-aurinkokuivattu-tomaattisuikale-oljyssa/5201194037031 (80 g:n valutetun tuotteen soveltuvuus edelleen HOLD).

**Energia-arvoja ei julkaista** tässä erässä: joillakin yleisruokatietueilla energiatietue puuttuu, osa rasva-/proteiinitiedoista on osalaskentaa ja kuituosuus vaihtelee. Tarvitaan lähdekohtaisesti hyväksyttyjen kilokaloriarvojen/energian laskennan yhdenmukainen malli.

## V11 – 8.11.2026: timjamin puuttuneet P/F-rivit täydennetty

- Kuivatun timjamin ravintoarvoehdokkaat per 100 g: **9,1 g proteiinia, 7,4 g rasvaa, 26,94 g imeytyvää hiilihydraattia**. Fineli-tietueen 11194 ravintoarvoja toistava riippumaton vertailu: https://ravinto.ptjesse.fi/timjami-kuivattu/ . Nämä ovat tuotekohtaisesti varmentamattomia yleisiä elintarviketietueita, ei valitun maustepurkin analyysiä.
- Marry me -kanapasta: 3 g timjamia erässä lisää **0,068 g proteiinia ja 0,0555 g rasvaa annokseen**. Uudet ehdokassummat: **48,60 g proteiinia, 32,07 g rasvaa / annos**.
- Linssimakaronilaatikko: 1 g timjamia erässä lisää **0,015 g proteiinia ja 0,0123 g rasvaa annokseen**. Uudet ehdokassummat: **20,49 g proteiinia, 9,34 g rasvaa / annos**.
- Näin kaikilla 47 ainesosarivillä on laskentaan ehdotettu CHO-, proteiini- ja rasvalähde tai eksplisiittinen nollarivi. **Kattavuus ei tarkoita lähdehyväksyntää.** Aiemmat tuotepakkauksen ja syödyn määrän ongelmat jäävät avoimiksi.
- Valion valmistajasivu vahvistaa raejuuston **1,8 g CHO, 15 g proteiinia, 2 g rasvaa ja 85 kcal/100 g**: https://www.valio.fi/tuotteet/valio-raejuusto/ . Sivu luettelee 200 g ja 400 g pakkauskoot, mutta EAN-kandidaatti 6408430043019 liittyy nimenomaan 200 g pakkaukseen. Huomioitava tuotteen pakkauskohtainen jäljitettävyys.
- Myllyn Paras -valmistaja vahvistaa makaronin **68 g CHO, 13 g proteiinia, 1,7 g rasvaa, 4 g kuitua ja 344 kcal / 100 g**: https://www.myllynparas.fi/tuotteet/makaroni-400-g .
- Valion valmistaja vahvistaa 17 % Punaleima Emmentalin **0 g CHO, 33 g proteiinia, 17 g rasvaa ja 286 kcal / 100 g**: https://www.valio.fi/tuotteet/valio-emmental-punaleima-17-juusto/ . Tätä ei sekoiteta 30 %:n perus-Punaleimaan.
- Royal aurinkokuivatun tomaattisuikaleen vähittäiskaupan EAN-sivu vahvistaa **16 g CHO, 5,5 g proteiinia, 9,3 g rasvaa ja 170 kcal / 100 g**: https://www.s-kaupat.fi/tuote/royal-330200g-aurinkokuivattu-tomaattisuikale-oljyssa/5201194037031 . Ravintoarvon peruste (valutettu vai öljyineen) jää avoimeksi.

**Edelleen HOLD:** makrojen tuotantoarvot ja ruoan kcal, De Cecco 69/72 -ristiriita, mahdollinen paistossa/valutuksessa syötävien massojen vaihtelu, kaikkien pakkaus- ja yleislähteiden hyväksyntä sekä GI/GK. PR pysyy Draftina eikä mitään valmistuskoetta väitetä tehdyksi.

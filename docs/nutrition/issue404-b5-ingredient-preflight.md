# Issue #404 / B5: ainesosakohtainen ravintolähteiden esitarkistus

**21.11.2026 · EI JULKAISULUPA · lähtömain `b20cea7fc22519b156f4315e6238066a4543eda8`**

Tässä työssä luettiin viisi tarkkaa FI-Draftia ja kartoitettiin kaikki **53 raaka-aine-riviä** lähdemäärineen. Koneellisesti sidottu [JSON-evidenssi](issue404-b5-ingredient-preflight.json) tallentaa kunkin FI-lähteen Git-blob-SHA:n, ainesosan syötemäärän ja yksikön, täsmällisen avoimen puutteen sekä mahdollisen **ehdokasviitteen**. Kaikki **19 erillistä viitettä** löydettiin olemassa olevista projektin Fineli-/AFCD-katalogi- ja laskentatiedostoista. Viitteen löytyminen ei ole todistus tuotteen, raaka-/kypsätilan tai laskennan hyväksynnästä.

| FI-ehdokas | Ainesosarivit | Ehdokasviitteellisiä rivejä | Vesi-/suolarivejä, joiden makrojen nollaa tukee lähde | Muiden rivien ratkaisemattomia kohtia |
| --- | ---: | ---: | ---: | ---: |
| Suolakalafritterit | 10 | 3 | 1 | 9 |
| Idli ja kookoschutney | 19 | 9 | 4 | 15 |
| Keitetyn mungpapun letut | 7 | 7 | 2 | 5 |
| Kuih seri muka | 12 | 10 | 2 | 10 |
| Xôi maapähkinällä | 5 | 5 | 2 | 3 |
| **Yhteensä** | **53** | **34** | **11** | **42** |

**Keskeinen ero:** 34 ainesosarivillä on *jonkinlainen* vertailutietue, mutta se voi olla tarkoituksella väärän tuotetilan vertailu, ei hyväksytty mallisyöte. 11 vesi-/suolarivillä nollaksi voidaan käsitellä **vain neljää makroravintoainetta** lähteistetysti; suolan määrä ja natrium pysyvät erillisinä ongelmina. Muissa 42 rivissä voi olla tuotteen, yksikkömuunnoksen tai ravintoretention avoin este. Näitä kolmea lukua ei saa tulkita julkaisun valmistumisprosentiksi.

## Tarkat lähdevastaavuudet ja estot

- **Saltfish:** kuivattu ja suolattu turska ei vastaa tuoreen turskan ravintotietuetta. Self-raising-jauho ei ole tavallinen vehnäjauho. Curry, chilin lajike ja paprikoiden kappalepainot kaipaavat tuotetäsmäyksen. **Uppopaiston auringonkukkaöljyn imeytynyt massa on täysin auki** eikä annoksen rasva-arvoa saa arvioida 0,5 cm:n öljykerroksen perusteella.
- **Idli:** idliriisin ja kuoritun uradin täsmätietueet puuttuvat. Fineli 182 voi auttaa poha-hiutaleessa, muttei ole varma tuote. Chef Kunal Kapurin chutneyn tuoretta kookosta ei saa korvata kuivatuilla hiutaleilla; sinapinsiementä ei saa korvata sinappikastikkeella. **Erotin inkiväärin ja tamarindin omiksi ainesosikseen**, jotta niille saadaan erilliset grammapainot ja ravintotietueet. Käyminen on yhä erillinen turvallisuus-HOLD.
- **Mungpapuletut:** kuivalle kokonaiselle mungille löytyy AFCD **F000446**, riisijauholle Fineli **182**, kuoritulle inkiväärille AFCD **F004213**, vihreälle chilille AFCD **F002896** ja rypsiöljylle Fineli **535**. Raaka-aineiden *lähtötilat* ovat osin dokumentoitavissa, mutta keitetyn mungin saanto ja paistoöljyn imeytyminen sekä itse ohutlettumenetelmän ristiriita estävät koko reseptin ravinto- ja julkaisuhyväksynnän. Vanhan alkuperäisen pesarattun makroja ei saa kopioida.
- **Kuih:** kananmuna Fineli **858**, keltuainen **851**, sokeri **1**, vehnäjauho **110** ja maissitärkkelys **27** ovat saatavilla vertailuun. Muna/keltuainen kappalemäärästä grammoiksi, jauhon lusikkamäärät grammoiksi ja pandanmehun todellinen syötävä koostumus puuttuvat. **Tavallisen tölkkikookosmaidon tietue ei kelpaa automaattisesti ohueksi ja paksuksi kookosmaidoksi**.
- **Xôi:** kuiville raaoille maapähkinöille löytyy AFCD **F006107** ja tavalliselle tölkkikookosmaidolle AFCD **F002991** vertailutietueina. **Keittämisen ravintohävikkiä** ja kookosmaidon tarkkaa tuotetta ei ole ratkaistu. Projektissa on tavallisen valkoisen riisin tietueita, mutta ei varmennettua **kuivan tahmariisin** EU-saatavilla olevien hiilihydraattien, kuidun ja polyolien kokonaisuutta. Lähteen 20 g / 20 ml kookosmaidon ristiriita on edelleen kirjattu, ei muunnettu arvatulla tiheydellä.

## Yksi erikseen laskettavissa oleva ravintokomponentti

Kuih-luonnoksen **170 g puhdasta sokeria** ja jo käytössä oleva [Fineli 1:n CHO 99,9 g/100 g](https://fineli.fi/fineli/api/v1/foods/1) antavat aritmeettisesti 169,83 g saatavilla olevaa hiilihydraattia *koko erän sokerista* eli **8,49 g / 20 pientä palaa pelkästä sokerista**. Tämä **ei ole koko reseptin netto-/kokonaishiilihydraattiarvo**: riisistä, vehnäjauhosta, tärkkelyksestä, kookoksesta ja muista aineksista tulee muuta, vielä laskematta jäävää hiilihydraattia. Aritmeettinen sokeriosuus ei myönnä julkaisulupaa eikä todista valmiin palan syötävää saantoa.

## Jatkokäsittelyn järjestys ilman koekeittiötä

1. **Xôi:** varmista nimenomaan kuivaa tahmariisiä vastaava EU-hiilihydraatti-/kuitu-/polyolitietue sekä kookosmaidon pakkaus ja maapähkinöiden keiton ravintoretentio. Tämä on lyhin viiden ainesosarivin jono.
2. **Kuih:** valitse saman lähteen kookosmaidon tuote, muunna munien ja keltuaisten syötävät grammamassat sekä jauhojen rkl-mitat perustellusti; selvitä pandanmehun koostumus tai hyväksytty ravintoraja.
3. **Saltfish:** tarvitsee ensiksi suolakalatuotteen, kalaan jäävän syötävän osuuden ja erikseen perustellun paistorasvan retention.
4. **Idli:** eriytä idlien ja chutneyn annostus, poha/urad/riisituotteet ja fermentoinnin turva. Pelkkä tuotetietueiden saanti ei ratkaise fermentointia.
5. **Mungpapuletut:** menetelmäristiriita ratkaistaan ennen muuta ravintolaskentaa; muuten syntyisi tarkka laskelma reseptille, jota ei ole osoitettu valmistuskelpoiseksi.

**Ei julkaistavia neljää makroa, ei uusia GK-arvoja, ei kuvia tai käännöksiä, ei alkuperäisten karanteenien purkua.** Testi `site/tests/issue404-b5-nutrition-preflight.test.ts` estää ainesosien hiljaisen muuttumisen, katoamisen tai virheellisen ravintoviitteen ja tarkistaa, ettei yksikään näistä viidestä pääse julkiseen sisältöön. Lopullinen julkaisuehdotus vaatii erillisen nykyisten ravinto-/GI/GK-/FI-/kuva-/kieliporttien todistuksen.

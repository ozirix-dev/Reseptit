# Ravintoarvioiden erä 18 — 25.10.2026

## Valinta, lähteet ja rajaukset

Erään valittiin 20 julkaistua reseptiä, joilta ravintoarvot puuttuivat ja joiden keskeiset ainesosat voitiin yhdistää lähdetietueisiin. Valintaan sisältyy keittoja, aasialaisia ruokia, kana- ja kasvisruokia sekä riisi- ja nuudeliruokia. Reseptikohtaiset määrät, ruoan tila, lähdetietueen tunniste, valmistuksen rajaukset, muunnokset ja reseptiversion hash on tallennettu [erämanifestiin](batches/batch-18.json) ja kunkin reseptin [laskentatiedostoon](calculations/).

Laskennassa käytettiin paikallista Fineli Release 20 -aineistoa ja AFCD Release 3 -aineistoa sekä yksittäisiä nimettyjen tuotteiden etikettitietoja. Fineli on THL:n avointa CC BY 4.0 -dataa; AFCD on FSANZ:n CC BY-SA 3.0 Australia -aineistoa. KoRo-konjacnuudeleissa käytettiin valmistetun tuotteen etikettiä, jonka tietue ilmaisee ravintoarvot valmistetulle tuotteelle 100 grammaa kohti. Muissa tuotteissa ei käytetty valmistettua tuotetta raakapainon vastineena.

Reseptien määrät ja valmistustavat täsmennettiin laskettaviksi. Tärkeitä rajauksia ovat esimerkiksi Janssonin kiusauksen valutetut öljyssä säilötyt anjovikset ilman lientä, Kung paon 600 g kypsää riisiä, paellavalencialaisen kanaversio ja 300 g kuivaa lyhytjyväistä riisiä, uunissa paistettu falafel 20 g öljyllä sekä kotitekoiset taikinat jiaozille ja xiaolongbaolle. Rendangissa galangal korvattiin 55 grammalla inkivääriä; sate ayamissa makea soijakastike jaettiin mitattuihin soijakastikkeen ja fariinisokerin määriin. Pav bhajin mausteseos sekä sämpylöiden kokonaispaino määriteltiin. Lähdevastaavuuksissa käytettiin tarvittaessa lähintä saatavilla olevaa mitattua vastinetta, kuten AFCD:n fermentoitua soijapaputahnaa vaalealle misolle. Nämä valinnat näkyvät myös reseptin ainesosissa ja laskentatiedostoissa.

Kokonaishiilihydraatti on imeytyvä hiilihydraatti + kuitu + polyolit. Nettohiilihydraateista vähennetään vain lähteistetyt polyolit. Kaikki ilmoitetut öljyt laskettiin kokonaan mukaan, ellei reseptissä käytetä uunipaistamisen 20 gramman määrää; paistohävikkiä tai kypsennyksen vesihävikkiä ei mallinneta. Pienet mauste- ja yrttirajaukset kirjattiin laskelmiin erikseen ja niiden yhteenlasketut annoskohtaiset ylärajat jäivät sovittuun 10 kcal:n sekä 1 g:n ravintoainetoleranssiin. Suola ja vesi eivät vaikuta neljään esitettävään makroon. Tuntemattomia tietoja ei käsitelty nollina.

## Ravintoarvot annosta kohti

| Resepti | Nettohiilihydraatit (g) | Kokonaishiilihydraatit (g) | Proteiini (g) | Rasva (g) |
| --- | ---: | ---: | ---: | ---: |
| siskonmakkarakeitto-juurekset | 9.01 | 12.11 | 12.01 | 17.42 |
| janssoninkiusaus-juuriselleri | 8.38 | 14.03 | 12.47 | 33.30 |
| kookos-lime-kanacurry | 5.66 | 8.63 | 26.99 | 21.82 |
| okonomiyaki-kaaliletut | 11.28 | 16.23 | 11.32 | 36.39 |
| kung-pao-kana | 45.21 | 50.24 | 40.03 | 25.14 |
| dan-dan-nuudelit | 53.48 | 58.29 | 26.92 | 31.03 |
| carnitas-salaattitacot | 4.90 | 7.40 | 36.94 | 30.60 |
| rogan-josh | 4.39 | 6.05 | 35.37 | 41.78 |
| rendang-padang | 41.86 | 44.79 | 38.16 | 30.14 |
| shoyu-kanakeitto-konjac | 4.50 | 7.47 | 22.07 | 7.70 |
| falafel | 26.33 | 42.76 | 19.84 | 26.19 |
| pav-bhaji | 65.29 | 72.87 | 13.11 | 19.24 |
| jiaozi | 60.40 | 64.62 | 25.20 | 14.24 |
| xiaolongbao | 59.50 | 63.16 | 25.09 | 14.41 |
| jerk-kana | 77.22 | 84.75 | 60.76 | 20.99 |
| miso-lohi-paksoi | 2.91 | 5.93 | 32.40 | 26.66 |
| bouillabaisse | 37.69 | 41.44 | 56.75 | 11.40 |
| paella-valenciana | 59.13 | 61.10 | 40.13 | 16.69 |
| bun-cha-hanoi | 76.90 | 79.89 | 38.96 | 35.93 |
| sate-ayam | 13.59 | 17.87 | 45.52 | 29.69 |

## Audit ja prosessitarkistus

`npm run audit:nutrition -- --strict` laski kunkin reseptin arvot uudelleen lähdetietueista ja tarkisti neljän julkaistun arvon täsmäämisen. Kaikki tämän erän 20 reseptiä hyväksyttiin `ESTIMATE WITH EVIDENCE` -tilaan. Auditoinnin kokonaisjakauma päivittyi 180 evidenssillä tuettuun arvioon, 86 lisätarkistusta odottavaan arvioon, 59 puuttuvaan ja 0 ristiriitaan.

Eräkoko pysyy tavoitteellisesti 20 reseptissä silloin, kun lähteet ja määrämuunnokset sen mahdollistavat. 40 reseptin samanaikainen erä ei ole tarkoituksenmukainen, jos se estää lähdekohtaisten vastaavuuksien ja reseptimuutosten tarkistamisen. Seuraava erä voidaan aloittaa tämän erän julkaisun ja tuotantovarmistuksen jälkeen; puutteellisen ruokatietueen aiheuttama epävarmuus kirjataan, eikä sitä peitetä oletuksella.

Arvot ovat suuntaa-antavia reseptiarvioita, eivät laboratorioanalyysejä. Lähteet: [Fineli avoin data](https://fineli.fi/fineli/fi/avoin-data) ja [AFCD Release 3](https://www.foodstandards.gov.au/science-data/monitoringnutrition/afcd).

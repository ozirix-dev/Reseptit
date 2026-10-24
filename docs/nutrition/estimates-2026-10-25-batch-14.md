# Ravintoarvioiden erä 14 — 25.10.2026

## Valinta ja tulos

Erään valittiin 20 julkaistua reseptiä, joiden ravintoarvot puuttuivat erän lähtöauditissa. Reseptit ryhmittyvät aamiaisruokiin, puuroihin, pannukakkuihin ja kulhoihin, joilla on yhteisiä muna-, vilja-, riisi-, papu-, jogurtti- ja kasvisraaka-aineita. Erän laskentasyötteet ja reseptiversion tiivisteet ovat calculations/<recipe_id>.json-tiedostoissa. Laskennan ja aineosavastaavuuksien manifesti on batches/batch-14.json.

Mustapaputacot jätettiin tästä erästä pois, koska paikalliset tietolähteet eivät tarjonneet mustille pavuille täydellisiä kuitu- ja polyolitietoja. Sen tilalle valittiin kreikkalainen jogurttikulho, jolle löytyi paikallinen Fineli 34611 -tietue sekä lähteet viikunalle, saksanpähkinälle ja hunajalle. Muutoksessa annettiin jogurtille 7 %:n rasvapitoisuus, pienennettiin pähkinämäärä 30 grammaan ja vaihdettiin paistaminen sekoittamiseen, jotta sivu vastaa valmistustapaa ja käytettävää tuotetta.

## Laskentatapa ja lähteet

Kaikki 20 reseptiä laskettiin yhteisellä nutrition-model-mallilla. Fineli Release 20:n imeytyvä hiilihydraatti, kuitu ja polyolit säilyvät erillisinä. AFCD Release 3:n imeytyvä hiilihydraatti ja polyolit johdetaan lähteen pareittaisista saatavilla olevan hiilihydraatin arvoista (sokerialkoholien kanssa ja ilman). Nettohiilihydraateista vähennetään vain lähteistetyt polyolit. Kokonaishiilihydraatti on imeytyvä hiilihydraatti + kuitu + polyolit. Puuttuvia lähdearvoja ei käsitellä nollina. Kaikki summat jaetaan kahdella annoksella ja pyöristetään lopuksi kahteen desimaaliin.

Kuivat riisit, pavut ja kaurahiutaleet on laskettu kuivapainona ennen kypsennystä. Kana, pavut, hedelmät ja kasvikset on täsmennetty raakatuotteiksi tai valutetuiksi/kuorituiksi syötäväksi osaksi. Taikinoihin lisättiin niiden valmistukseen tarvittava vesi ainesosaluetteloon; vesi ei lisää makroja. Kookosmaidon ja kahvin tilavuus muunnettiin 1 ml = 1 g. Listattu paistoöljy oletetaan kokonaan syödyksi. Suola jätettiin pois, koska se ei lisää neljää julkaistavaa makroa. Mahdolliset muut pienet rajaukset ja niiden annoskohtaiset ylärajat ovat laskentatiedostoissa; audit hyväksyi jokaisen erän laskennan tilaan ESTIMATE WITH EVIDENCE.

Fineli Release 20 on THL:n aineisto, CC BY 4.0; käyttö ja lähde-ID:t on merkitty laskentatiedostoihin. AFCD Release 3 on FSANZ:n CC BY-SA 3.0 Australia -aineisto, ja Australian dataa koskeva rajaus sekä attribuutio säilyvät. Kreikkalaisen jogurtin paikallinen tuote-ennätys on Fineli 34611 ja sen lähde sekä lisenssi säilyvät food-records.json-tiedostossa. Riisijauholle käytettiin Fineli 182:n yhdistettyä riisijauho/riisihiutale-merkintää lähimpänä paikallisena vastineena; tämä proxy on ilmoitettu laskentasyötteessä. Jalapeñolle käytettiin tuoreen vihreän chilin AFCD-arvoa pienen 15 g määrän ravintoproksina.

## Ravintoarvot annosta kohti

| Resepti | Nettohiilihydraatit (g) | Kokonaishiilihydraatit (g) | Proteiini (g) | Rasva (g) |
| --- | ---: | ---: | ---: | ---: |
| korealainen-gyeran-mari-kasviksilla | 2.11 | 2.94 | 7.23 | 18.65 |
| intialainen-besan-chilla | 22.78 | 33.86 | 10.63 | 9.73 |
| intialainen-rava-uttapam | 36.98 | 39.31 | 7.94 | 9.46 |
| kiinalainen-kevatsipulipannukakku | 38.13 | 39.99 | 6.37 | 14.29 |
| indonesialainen-bubur-ayam-kanariisipuuro | 37.32 | 37.87 | 20.49 | 1.07 |
| indonesialainen-nasi-uduk-aamiaisella | 39.57 | 40.52 | 12.16 | 20.98 |
| intialainen-aloo-paratha | 39.58 | 44.53 | 7.42 | 7.84 |
| intialainen-pesarattu-mungpavuista | 68.49 | 79.38 | 21.93 | 8.70 |
| pohjoisafrikkalainen-bissara | 28.24 | 42.55 | 18.49 | 8.59 |
| vietnamilainen-banh-mi-munalla | 30.55 | 33.19 | 11.93 | 12.53 |
| vietnamilainen-banh-xeo-aamiaisletut | 42.55 | 44.68 | 17.47 | 23.37 |
| vietnamilainen-kahvijogurtti-banaanilla | 21.39 | 22.45 | 3.80 | 3.68 |
| valimerellinen-tahinipuuro | 40.33 | 47.15 | 8.13 | 9.19 |
| valimerellinen-jogurttikulho-hunajalla | 11.19 | 12.80 | 6.70 | 13.36 |
| valimerellinen-pinaatti-fetashakshuka | 3.52 | 5.02 | 21.98 | 30.91 |
| meksikolainen-huevos-a-la-mexicana | 3.72 | 5.26 | 7.83 | 12.06 |
| meksikolainen-atole-maissipuuro | 47.40 | 49.04 | 5.85 | 4.21 |
| thai-maissifritterit | 55.41 | 59.90 | 14.82 | 13.59 |
| karibia-mango-limejogurtti | 15.12 | 18.23 | 2.65 | 8.50 |
| vietnamilainen-banh-cuon-sienilla | 40.31 | 42.76 | 21.37 | 9.05 |

## Käytetyt lähdetietueet resepteittäin

| Resepti | Lähdetietueiden ID:t |
| --- | --- |
| korealainen-gyeran-mari-kasviksilla | fineli-858-release-20, fineli-300-release-20, afcd-F006250-release-3, afcd-F006187-release-3, fineli-541-release-20 |
| intialainen-besan-chilla | afcd-F003986-release-3, fineli-922-release-20, fineli-352-release-20, fineli-335-release-20, afcd-F003192-release-3, fineli-541-release-20 |
| intialainen-rava-uttapam | fineli-112-release-20, fineli-620-release-20, fineli-922-release-20, fineli-352-release-20, fineli-335-release-20, fineli-541-release-20 |
| kiinalainen-kevatsipulipannukakku | fineli-110-release-20, fineli-922-release-20, afcd-F006250-release-3, afcd-F006187-release-3, fineli-31-release-20, fineli-541-release-20 |
| indonesialainen-bubur-ayam-kanariisipuuro | afcd-F007682-release-3, afcd-F002594-release-3, afcd-F004213-release-3, afcd-F006250-release-3, fineli-922-release-20 |
| indonesialainen-nasi-uduk-aamiaisella | afcd-F007682-release-3, afcd-F002991-release-3, fineli-858-release-20, fineli-346-release-20 |
| intialainen-aloo-paratha | fineli-110-release-20, fineli-922-release-20, fineli-310-release-20, afcd-F003192-release-3, afcd-F003327-release-3, fineli-541-release-20 |
| intialainen-pesarattu-mungpavuista | afcd-F000446-release-3, afcd-F004213-release-3, afcd-F002896-release-3, afcd-F007682-release-3, fineli-541-release-20 |
| pohjoisafrikkalainen-bissara | afcd-F000416-release-3, afcd-F004193-release-3, afcd-F003327-release-3, fineli-536-release-20, fineli-922-release-20 |
| vietnamilainen-banh-mi-munalla | fineli-1309-release-20, fineli-858-release-20, fineli-346-release-20, fineli-300-release-20, fineli-541-release-20 |
| vietnamilainen-banh-xeo-aamiaisletut | fineli-182-release-20, afcd-F002991-release-3, afcd-F007422-release-3, afcd-F008806-release-3, fineli-541-release-20 |
| vietnamilainen-kahvijogurtti-banaanilla | fineli-620-release-20, afcd-F003065-release-3, fineli-11049-release-20, afcd-F005582-release-3 |
| valimerellinen-tahinipuuro | afcd-F006143-release-3, fineli-11087-release-20, afcd-F004380-release-3, fineli-11045-release-20, fineli-922-release-20 |
| valimerellinen-jogurttikulho-hunajalla | fineli-34611-2026-10-25, fineli-376-release-20, afcd-F004380-release-3, afcd-F003834-release-3 |
| valimerellinen-pinaatti-fetashakshuka | fineli-858-release-20, fineli-352-release-20, afcd-F008761-release-3, fineli-11211-release-20, fineli-541-release-20 |
| meksikolainen-huevos-a-la-mexicana | fineli-858-release-20, fineli-352-release-20, fineli-335-release-20, afcd-F002896-release-3, fineli-541-release-20 |
| meksikolainen-atole-maissipuuro | fineli-29823-release-20, fineli-689-release-20, afcd-F002963-release-3, afcd-F009350-release-3, fineli-922-release-20 |
| thai-maissifritterit | fineli-3040-release-20, fineli-858-release-20, fineli-110-release-20, afcd-F000396-release-3, fineli-541-release-20 |
| karibia-mango-limejogurtti | afcd-F005299-release-3, fineli-620-release-20, afcd-F004729-release-3, afcd-F002987-release-3 |
| vietnamilainen-banh-cuon-sienilla | fineli-182-release-20, fineli-922-release-20, afcd-F005946-release-3, afcd-F007057-release-3, off-13692210-squid-brand-fish-sauce-2026-10-24 |

## Auditointi ja prosessiarvio

Lähtötilanne oli 80 evidenssillä tuettua arviota, 86 riittämättömän lähdenäytön tapausta ja 159 reseptiä ilman arvoja. Erän jälkeen tiukka uudelleenlaskenta-audit tuotti 100 ESTIMATE WITH EVIDENCE, 86 INSUFFICIENT SOURCE DATA ja 139 MISSING; ristiriitoja ei löytynyt. Audit tarkisti syötehashin, reseptiversion, lähdetietueet, neljä arvoa ja käännökset. Kohderesepteillä ei ollut julkaistuja erillisiä käännössivuja, joten käännöksiin ei tarvinnut kirjoittaa arvoja.

Erä vahvisti, että malliin kelpaavat lähteet on valittava ennen erän lukitusta: mustapapureseptin korvasimme ennen laskentaa, koska paikallisesta lähdeaineistosta puuttui olennaista mittaustietoa. Prosessia paransivat samassa vaiheessa pääraaka-aineiden raakakuiva-tilojen, taikinan veden ja käyttötarkoitukseen sopivien annosmäärien täsmennykset. Seuraavassa erässä lähde- ja tuotetarkistus tehdään ennen reseptimuutoksia, jotta vältetään turhat sisällön editoinnit.

Arvot ovat käytännöllisiä suuntaa-antavia reseptiarvioita, eivät laboratorioanalyysejä. Fineli: https://fineli.fi/fineli/fi/avoin-data. AFCD: https://www.foodstandards.gov.au/science-data/monitoringnutrition/afcd.

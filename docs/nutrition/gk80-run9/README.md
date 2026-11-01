# AJO 9 — ensimmäinen viidestä 22 reseptin erästä

Omistajan sisältö- ja menetelmähyväksyntä puuttuu. Vain Draft on valtuutettu.
Ei Ready-siirtymää, mergeä tai deployta. ReportHub #91/#90/#88 ja vanha
raporttipino jätetään erilleen.

[Tavoitepäätös](target-decision.md) lukittiin ennen integraatiota:
viisi erää, kussakin 22 eri reseptiä, minimi 15, varsinainen 18, venytys 20.
Tämän ensimmäisen erän tulos on 20 numeerista ehdokasta ja kaksi HOLDia.
Kaikki kolme määrätavoitetta täyttyvät. Seuraavien neljän erän tuloksia ei
ennakoida onnistumisiksi eikä eri Drafteja lasketa tuotantokattavuuteen.

## Lähtötila ja koko 22 reseptin päätös

Main-pohja 5761afa069ea54c9d510f1cb3c1086ae7d42f998, julkaistu lähtötila
130/326 eli 39,88 %. Edellisen julkaisun
[main-CI ja Pages-deploy](https://github.com/ozirix-dev/Reseptit/actions/runs/41298081254)
sekä [menetelmäsivu](https://ozirix-dev.github.io/Reseptit/glykeeminen-kuorma/).
Ehdokaskattavuus tässä Draftissa on 150/326 eli 46,01 %, 176 keskeneräistä.
Tätä ei esitetä tuotantokattavuutena. 80 prosenttiin tarvitaan 261 julkaistua
tulosta; ehdokkaan jälkeenkin puuttuu 111.

[Päätösmatriisi](screening.json) sisältää kaikki 22 tunnusta, lähde- ja
syötehashit, neljä makroa, valmistuksen, skenaariot ja HOLD-perusteet.
[326 reseptin inventaario](inventory.json): julkaistuja 130, tämän Draftin
ehdokkaita 20, HOLDeja yhteensä 13 ja ilman muuta riittävää laskelmaa 163.

## Hyväksyttäväksi tuotavat 20 reseptiversiota

Makrot grammoina annosta kohden; kokonais-CHO sisältää kuidun ja polyolit.
GK on pyöristämätön malliluku. Kaikki ovat LOW-luottamuksen arvioita.
Vaihteluväli tarkoittaa vain nimettyjä lähdevertailuskenaarioita,
ei tilastollista tai biologista epävarmuusväliä.

| Versio | Annoksia | Netto-CHO | Kokonais-CHO | Proteiini | Rasva | GK / annos |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Korealainen bulgogi – pannuversio | 4 | 61.86 | 64.04 | 43.39 | 8.28 | 40.880767 |
| Hanoilainen bún chả – pannuversio | 4 | 77.25 | 80.63 | 38.01 | 36.02 | 46.259575 |
| Sisilialainen caponata | 4 | 13.88 | 20.8 | 2.44 | 11.76 | 6.18275 |
| Hitaasti haudutetut carnitas-salaattitacot – punnittu versio | 4 | 5.05 | 7.58 | 37.04 | 30.28 | 2.20784 |
| Kiinalainen congee-riisipuuro – punnittu versio | 4 | 39.74 | 40.32 | 8.62 | 5.14 | 30.92805 |
| Kotitekoinen döner kebab naudanlihasta – punnittu versio | 4 | 29.75 | 32.81 | 35.79 | 28.01 | 18.96102 |
| Janssoninkiusaus juuriselleristä | 4 | 8.43 | 14.11 | 12.48 | 33.31 | 3.070875 |
| Myskikurpitsa-riisipuuro – kabocha-reseptin variantti | 2 | 47.22 | 50.15 | 8.03 | 16.86 | 34.795387 |
| Marokkolainen couscous kanalla ja kasviksilla | 4 | 68.36 | 78.13 | 47.06 | 14.85 | 36.86435 |
| Turkkilainen menemen tomaateilla ja paprikalla – punnittu versio | 3 | 6.99 | 8.99 | 10.81 | 16.39 | 2.832333 |
| Pasta alla Norma parmesaanilla – variantti | 4 | 64.86 | 70.84 | 16.66 | 14.93 | 30.016325 – 31.759325 |
| Provencelainen ratatouille – punnittu versio | 4 | 11.57 | 17.4 | 2.46 | 14.65 | 4.645925 |
| Rogan josh jauhetuilla mausteilla – variantti | 4 | 4.17 | 5.55 | 35.32 | 41.76 | 1.505013 |
| Shakshuka – punnittu versio | 2 | 8.76 | 11.23 | 15.77 | 17.65 | 3.593425 |
| Sitruuna-yrttikana ja paahdettu parsa – punnittu versio | 4 | 2.11 | 5.13 | 36.49 | 16.17 | 0.890075 |
| Jauhelihalla ja juustolla täytetyt paprikat – punnittu versio | 4 | 10.42 | 14.2 | 36.42 | 35.86 | 4.19275 |
| Kiinalainen tomaatti-kananmunawokki – punnittu versio | 3 | 38.62 | 40.32 | 13.06 | 16.57 | 21.00959 – 24.41156 |
| Uunikanapasta kesäkurpitsasuikaleilla – punnittu versio | 4 | 7.28 | 10.52 | 39.57 | 22.43 | 2.694325 |
| Halloumi-tomaattileipä oliiveilla | 2 | 27.58 | 29.51 | 20.18 | 28.56 | 14.16174 – 21.31142 |
| Vietnamilainen kahvijogurtti banaanilla | 2 | 21.39 | 22.45 | 3.8 | 3.68 | 10.697125 – 12.146875 |

## Kahden reseptin HOLD

Hunaja-sinappikana kaalilla ja nakkikastike kukkakaalimuusilla:
Maille Dijon Originalen tarvittavaa polyolimäärää ei ole varmennettu.
Etiketin CHO- tai sokerimäärä ei osoita polyoleja nollaksi. Näiden reseptien,
ravintoaineistojen ja käännösten elävää sisältöä ei muuteta.
[Lukitut HOLD-paketit](../gk80-release-8/held-review.json) säilyttävät syötteet.
Jerk-kana, pav bhaji ja muut aiemmat HOLDit sekä teehaudutettujen munien
keskeneräinen kokonaisarvio pysyvät erillään.

## Olennaiset rajaukset ja korjaukset

- Carnitasin tavallinen kuorittu limetti F005199 korvaa virheellisen Australian
  native lime -sidoksen F005198. GK 2,20784; netto-CHO 5,04985 g ennen pyöristystä.
  Kaikki hedelmäliha, mehu, lihan rasva ja kastike kulutetaan.
- Myskikurpitsa-riisipuuro: kaksi annosta, 250 g kurpitsaa, 100 g kuivaa
  jasmiiniriisiä, 700 g vettä, 184 g kookosmaitoa ja 5 g seesamia.
  Kyseessä on myskikurpitsaversio, ei kabocha-lajike. Kurpitsan GI 51 on
  nimetty keitetyn kurpitsan LOW-analogia; virheellinen maitotuoteimputaatio
  poistettiin. Riisipuuro keitetään noin 40 min. Seesamin koostumus käyttää
  kuorittua valkoista seesamia; mustan seesamin tuotekohtaisuutta ei väitetä.
- Bulgogi ja bún chả ovat pannuversioita, joissa kaikki marinadi ja rasva
  syödään. Niitä ei esitetä valutettujen grilliversioiden tuloksina.
- Congeen ja couscousin käyttövalmis liemi sekä soija- ja kalakastikkeet
  käyttävät nimettyjä AFCD:n yleiskoostumuksia, eivät varmennettua tuotemerkkiä.
  Couscous turvotetaan osalla jo lueteltua lientä; vettä ei lisätä laskelman ohi.
- Janssonin anjovis on valutettu öljyyn säilötty anchovy, ei makeaan mausteliemeen
  säilötty suomalainen anjovis. Kerma 38 %, maito 3,5 %.
- Dönerissä on 17 % naudan jauheliha, 7 % laktoositon jogurtti, vaalea pitaleipä
  ja raaka valkokaali ilman erillistä kaalisalaattikastiketta.
- Menemen sisältää sipulin. Shakshuka on nimetty mieto paprikaversio avoimen
  chilihiutalemäärän sijasta. Rogan josh käyttää jauhettuja, syötäviä mausteita.
- Pasta alla Norma käyttää kuivaa durumvehnäpenneä ja parmesaania ricotta
  salatan sijasta. Kuivan pastan koostumus on kypsän, valutetun tuotteen proxy.
- Tomaatti-kananmunawokin jasmiini- ja basmatiriisi ovat kaksi nimettyä
  skenaariota, kumpikin kuumana kypsänä punnittu. Ei jäähdytys- tai rasvahyvitystä.
- Täytetyissä paprikoissa 100 g lisätomaattimurskaa korvaa 16 g pyreetä;
  kokonaismurska 250 g. Uunikanapastan versiossa on kesäkurpitsaa ilman vehnäpastaa.
- Halloumileivän ja kahvijogurtin kaksi lähdevertailua säilytetään avoimesti.
  Halloumin maitotuoteanalogia ja vaalean hapanjuurityyppisen leivän proxy eivät
  ole tarkkoja tuote-GI-mittauksia. Kahvijogurtissa on 3,9 % jogurtti ja
  tavallinen makeutettu kondensoitu lehmänmaito, ei makeuttamaton haihdutettu maito.

Kaikki imeytyvät hiilihydraatit sisältyvät arvioon. Raakojen/kuivien ainesten
ravintokoostumus on nimetyn kypsennetyn version koostumusarvio; mittaamatonta
kypsennys- tai liukenemishävikkiä ei vähennetä. Kuvat ovat kuvitusta ja
luetteloimattomat lisukkeet eivät kuulu arvioon. Yleistä laskentamoottoria,
polyolisääntöä tai ruokaperhesuojaa ei muuteta.

## Evidenssi ja tarkistukset

[Ensisijaiset koostumustarkistukset](../gk80-release-8/primary-verification.json)
vertaavat käytetyt neljä makroa AFCD Release 3:n alkuperäiseen per100g-Exceliin
ja Fineli Release 20:n lukittuun viitteeseen. AFCD:n polyolit johdetaan
lähteen parillisista saatavilla olevista hiilihydraateista alkoholeineen/ilman,
Finelin polyolit POLYL-komponentista. Tuntematonta nollaa ei lisätä.

[Riippumaton Decimal](../../../site/scripts/gk80-release8-decimal.py) tarkistaa
kaikki skenaariot, aineosapanokset ja neljä makroa ilman TypeScript-moottoria.
[Main-baseline](../gk80-release-8/main-baseline.json) lukittiin nykyisestä
mainista ennen resepti-integraatiota, ei aiemman release-haaran vanhasta buildista.
Regressiot tarkistavat kaikki aiemmat 130 numeerista ja 306 muuttumatonta
kokonaista tulosobjektia. 30 aiempaa käännöstä tarkistetaan erillisessä
[käännösraportissa](../../reports/2026-11-01-gk80-run9-translation-review.md).
Ihmistarkistus on edelleen HUMAN REVIEW PENDING.

[Tarkistusnäyttö](verification.json): 208 yksikkötestiä, 25 staattista testiä,
27 käännöstestiä ja 357 käännösparin auditointi PASS. Brave: 23 ehdokassivua,
20 lähdelinkkiryhmää, kaikki 13 HOLDia ja teehaudutetut munat, ei JS-virheitä;
tuotanto edelleen 130/326. Viimeinen julkisen huomautuksen sanamuotoinen
siivous varmennettiin staattisesta tuotoksesta ja uudesta lähdehashista.
Riippumaton Decimal: kaikki 20 reseptiä ja skenaariot PASS.

Yhden suunnitellun buildin lisäksi tarvittiin kaksi kohdistetun löydöksen
aiheuttamaa buildia: rogan joshin juoksettumishuomautuksen palautus ja
sisäisen korjaushistorian poisto julkisesta kurpitsapuuron tekstistä.
Kaikki kolme tuottivat 691 reittiä; ajat olivat 17.37, 18.25, 18.27 sekuntia.
Laskentamoottoria ei muutettu eikä testivaatimuksia lievennetty.
Normaali PR-CI käynnistyy kerran lopulliselle HEADille. Tämä Draft ei ole
omistajahyväksyntä, Ready-lupa, merge-lupa tai tuotantojulkaisu.

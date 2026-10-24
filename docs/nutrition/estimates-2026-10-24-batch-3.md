# Kymmenen reseptin Fineli-arviot, erä 3

Laskentapäivä: 24.10.2026. Arvot ovat suuntaa-antavia reseptiarvioita annosta kohti, eivät laboratoriotuloksia. Ne perustuvat reseptin ilmoitettuihin raaka-ainemääriin ja alla lueteltuihin Fineli-tietueisiin. Lähde: Terveyden ja hyvinvoinnin laitos (THL), Fineli, [avoin data](https://fineli.fi/fineli/fi/avoin-data), CC BY 4.0. THL ja Fineli nimetään; THL:n hyväksyntää ei väitetä.

## Laskentatapa

Finelin komponenttikoodit: CHO 2034 = imeytyvä hiilihydraatti, FIBT 2168 = ravintokuitu, POLYL 2260 = polyolit, PROT 2230 = proteiini ja FAT 2157 = rasva. Käytin Finelin API:n komponenttidataa. Vasteen yleistä `fiber`-kenttää ei käytetty, koska se on aiemmin palauttanut kasviksille virheellisiä nollia.

Ainesosan ravintomäärä = Fineli-arvo / 100 g × reseptiin laskettu massa grammoina. Summat jaettiin reseptin ilmoittamalla annosmäärällä. Nettohiilihydraatti = CHO. **Kokonaishiilihydraatti = CHO + FIBT + POLYL.** Polyolit olivat kaikissa käytetyissä tietueissa 0 g/100 g. Luvut laskettiin pyöristämättömistä lähdearvoista ja pyöristettiin vasta annosta kohti kahteen desimaaliin.

Finelin kappalemassat: muna 55 g/kpl (#858, keskikokoinen); sipuli 55 g/kpl (#335, keskikokoinen), pieni sipuli 30 g/kpl, ja puolikas keskikokoinen sipuli 27,5 g. Finelin annosmassat: voi 14 g/rkl (#500), sinappi 5 g/tl (#28). Finelin tilavuusmassat: kuohukerma 100 g/dl (#631), 15 % ruoanvalmistuskerma 100 g/dl (#29065), laimennettu lihaliemi 100 g/dl (#29), kanaliemi 100 g/dl (#30315), tomaattipyree 90 g/dl (#354). Siten 2 rkl tomaattipyreetä = 30 ml × 0,9 g/ml = 27 g; 1,2 l lihalientä = 12 dl × 100 g/dl = 1 200 g.

## Julkaistut arviot annosta kohti

| Resepti | Nettohiilihydraatti (g) | Kokonaishiilihydraatti (g) | Proteiini (g) | Rasva (g) |
| --- | ---: | ---: | ---: | ---: |
| Parsakaali-sinihomejuustofrittata | 2,49 | 4,36 | 18,23 | 32,19 |
| Paistettu maksa ja pekoni | 7,69 | 7,92 | 31,42 | 32,10 |
| Jauhelihapihvit ja kermakastike ilman jauhoja | 3,17 | 3,34 | 31,83 | 53,44 |
| Jauheliha-kaalikeitto | 12,63 | 15,95 | 18,23 | 15,43 |
| Kanakorma kukkakaaliriisillä | 7,35 | 10,88 | 35,06 | 31,01 |
| Pehmeä raejuusto-uunimunakas | 3,30 | 3,30 | 27,21 | 22,77 |
| VHH-mustikkapiirakka | 4,22 | 7,18 | 10,44 | 19,45 |
| Maksalaatikko kukkakaalisoseella | 12,07 | 15,70 | 25,62 | 25,44 |
| Broileri-kukkakaaligratiini | 5,05 | 8,35 | 38,91 | 34,80 |
| Uuniporsas kermaisella pannukastikkeella | 1,43 | 1,59 | 36,57 | 44,57 |

## Lähdetietueet

Kaikki arvot ovat Finelin API:n mukaisia grammoja / 100 g järjestyksessä CHO, FIBT, POLYL, proteiini, rasva. Tietueet tarkistettiin Bravessa 24.10.2026. Täydet komponenttiarvot ja käytetyt yksikkömassat ovat `food-records.json`-tiedostossa. Jokaisen tietueen virallinen osoite on `https://fineli.fi/fineli/api/v1/foods/{ID}?c=2034&c2=2168`.

| Fineli ID | Finelin nimi | CHO | Kuitu | Polyolit | Proteiini | Rasva |
| ---: | --- | ---: | ---: | ---: | ---: | ---: |
| 28 | Sinappi | 14,1 | 1,7 | 0 | 4,4 | 6 |
| 29 | Lihaliemi, laimennettu | 3 | 0,1 | 0 | 0,3 | 0,6 |
| 322 | Kukkakaali | 2,4 | 2,2 | 0 | 2 | 0,2 |
| 324 | Parsakaali, brokkoli | 1,6 | 3,5 | 0 | 3,9 | 0,5 |
| 335 | Sipuli, keltasipuli | 4,8 | 1,7 | 0 | 1,2 | 0,1 |
| 354 | Tomaattisose, tomaattipyree | 8 | 1 | 0 | 4,5 | 0,5 |
| 440 | Puolukka | 8,9 | 2,6 | 0 | 0,5 | 0,7 |
| 442 | Mustikka, metsämustikka | 10,2 | 3,3 | 0 | 0,8 | 1,1 |
| 500 | Voi | 0,8 | 0 | 0 | 1,2 | 81,3 |
| 622 | Rahka, maitorahka, maustamaton, rasvaa <0,5 % | 3 | 0 | 0 | 9,8 | 0,4 |
| 631 | Kerma, kuohukerma, rasvaa 38 % | 2,9 | 0 | 0 | 1,9 | 38 |
| 642 | Juusto, emmentaljuusto, rasvaa 27–30 % | 0 | 0 | 0 | 27,9 | 30 |
| 653 | Juusto, sinihomejuusto, rasvaa 27–30 % | 0 | 0 | 0 | 20,2 | 29 |
| 707 | Pekoni, 32 % rasvaa | 0 | 0 | 0 | 14,2 | 32,4 |
| 786 | Maksa, naudan | 5 | 0 | 0 | 20,3 | 3,8 |
| 858 | Kananmuna, kuoreton | 0,3 | 0 | 0 | 12,6 | 9,2 |
| 379 | Manteli | 6,6 | 12,5 | 0 | 24,1 | 51,2 |
| 29065 | Ruoanvalmistuskerma, rasvaa 15 % | 2,7 | 0 | 0 | 2,7 | 15 |
| 30792 | Broileri, koipi-reisi, nahaton | 0 | 0 | 0 | 19,6 | 3,4 |
| 320 | Valkokaali, keräkaali | 5 | 2,5 | 0 | 1,2 | 0,1 |
| 32201 | Jogurtti, turkkilainen/kreikkalainen, rasvaa 10 % | 4,3 | 0 | 0 | 4 | 10 |
| 32385 | Raejuusto, rasvaa 1,5 % | 2,4 | 0 | 0 | 16,4 | 1,5 |
| 34190 | Kasslerpihvi/-paisti, raaka | 0 | 0 | 0 | 17,9 | 15 |
| 11562 | Jauheliha, naudan, rasvaa 17 % | 0 | 0 | 0 | 19,1 | 16,9 |

## Valinnat ja rajaukset

- Nimettömän naudan jauhelihan rasvaksi oletettiin 17 % (Fineli #11562). Määrittelemätön juustoraaste arvioitiin Emmental-tietueella #642; sinihomejuusto arvioitiin Finelin Aura/Danazole-keskiarvolla #653. Broilerin paistileike arvioitiin raakana, nahattomana koipi-reisitietueella #30792. Kassler laskettiin reseptin ilmoitetusta 1,2 kg raakaa kassleria vastaavalla tietueella #34190.
- Reseptin määrittelemätön raejuusto arvioitiin 1,5 % tietueella #32385 ja maitorahka alle 0,5 % tietueella #622. Mantelijauho arvioitiin kokonaisesta mantelista #379 olettaen, että jauho on kuoritusta kokonaisesta mantelista eikä rasvattomasta puristeesta. Dijon-sinappi korvattiin yleisellä sinappitietueella #28.
- Kuivat mausteet, suola, pippuri, valkosipulijauhe, mitattu meirami/timjami ja piirakan teelusikallinen vaniljauutetta jätettiin pois. Myös raejuusto-uunimunakkaan mittaamaton valinnainen voiteluvoi ja ruohosipuli jäivät pois. Näitä ei käsitelty nollamäärinä, vaan ne on rajattu perusarvion ulkopuolelle.
- Lisäkkeet laskettiin vain silloin, kun resepti ilmoitti niiden määrän (100 g puolukkaa maksalaatikolle). Uuniporsaan reseptikuvauksessa mainitut mutta ainesosaluettelosta puuttuvat kasvikset eivät sisälly arvioon.
- Kypsennyksen veden haihtumista, rasvan valumista tai ravintoaineiden säilymistä ei mallinnettu. Reseptissä käytetty määrä oletettiin kokonaan annokseen jääväksi; kastikkeiden, paistinpannun tai vuoan hävikkiä ei vähennetty. Tämä on reseptikohtainen arvio eikä valmisruoan laboratorioanalyysi.

Lähdepoiminta sisältää vain näissä arvioissa käytetyt ruokarivit ja niistä tarvittavat ravintokomponentit, ei Finelin kokonaistietokantaa. Finelin API voi muuttua.

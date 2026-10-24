# Kymmenen reseptin ravintoarvioiden laskentamuistio

Laskentapäivä: 24.10.2026. Arvot on lisätty suomenkielisten lähdereseptien
per-annos-metatietoihin. Julkinen sivu näyttää jo arvionsa yleisen
huomautuksen: arvot ovat suuntaa-antavia eivätkä täydellistä
ainesosakohtaista laskentaa.

## Laskentatapa

Fineli-ruoka-aineiden `/api/v1/foods/{id}`-vastauksen `carbohydrate` vastaa
komponenttiluettelon CHO-arvoa (komponentti 2034). Luettelo määrittelee sen
imeytyväksi hiilihydraatiksi. Kuitu luettiin ruoka-aineen `data`-taulukosta
komponenttikoodin FIBT (2168) mukaan ja polyolit koodista POLYL (2260).
Komponentti-ID:t ja poimitut luvut on tallennettu tiedostoon
`food-records.json`; laskenta sitoo arvon koodiin ja ID:hen eikä taulukon
kiinteään järjestysnumeroon. Hakuvasteen yleinen `fiber`-kenttä näytti
kasviksille virheellisesti nollaa eikä sitä käytetä.

Kokonaishiilihydraatti = imeytyvä hiilihydraatti + kokonaisravintokuitu +
polyolit. Näissä tietueissa polyoli oli nolla. Pienet mauste-, yrtti- ja
sitruunamäärät jätettiin alkuperäisen laskentatavan mukaan pois, joten myös
kokonaishiilihydraatit ovat suuntaa-antavia.

Lasku: Fineli-arvo / 100 × käytetty määrä grammoina ÷ reseptin annosmäärä.
Annosmuunnokset perustuvat Finelin yksikkömassoihin, kun niitä oli saatavilla;
muut oletukset on lueteltu alla. Mausteiden, suolan, yrttien sekä sitruunan
pienten määrien vaikutusta ei ole laskettu. Kypsennyshävikkiä ei ole erotettu;
lihamurekkeessa oletetaan, ettei paistolihaa tai rasvaa valuteta pois.
Tortillassa oletetaan, että pannulle laitetusta öljystä jää ruokaan 40,5 g
(3 rkl). Nämä rajaukset tekevät tuloksista arvioita.

## Lisätyt arvot annosta kohti

| Resepti | Netto (g) | Kokonais (g) | Proteiini (g) | Rasva (g) | Energia (kcal, muistio) |
| --- | ---: | ---: | ---: | ---: | ---: |
| [Munakokkeli](../../reseptit/aamupalat/munakokkeli.md) | 0,8 | 0,8 | 14,3 | 21,6 | 252,6 |
| [Munakasmuffinit](../../reseptit/aamupalat/munakasmuffinit.md) | 0,6 | 0,9 | 19,1 | 24,6 | 298,5 |
| [Munakasrulla pinaatti-tuorejuustolla](../../reseptit/aamupalat/munakasrulla-pinaatti-tuorejuustolla.md) | 2,1 | 2,7 | 16,8 | 26,7 | 313,6 |
| [Munatacot eli huevos rancheros](../../reseptit/aamupalat/munatacot-huevos-rancheros.md) | 4,2 | 9,6 | 21,3 | 34,6 | 421,4 |
| [Paprikauunimunakkaat](../../reseptit/aamupalat/paprikauunimunakkaat.md) | 8,0 | 11,2 | 21,2 | 16,7 | 272,4 |
| [Shakshuka](../../reseptit/aamupalat/shakshuka.md) | 8,9 | 12,4 | 15,6 | 17,5 | 262,1 |
| [Uunimuna-avokadot](../../reseptit/aamupalat/uunimuna-avokadot.md) | 1,1 | 7,8 | 15,3 | 28,7 | 333,1 |
| [Uunimunat pinaatilla](../../reseptit/aamupalat/uunimunat-pinaatilla.md) | 1,3 | 1,9 | 19,0 | 28,4 | 335,8 |
| [Espanjalainen peruna-sipulimunakas](../../reseptit/paaruoat/tortilla-de-patatas.md) | 24,2 | 25,9 | 13,4 | 17,9 | 317,2 |
| [Mehevä VHH-lihamureke](../../reseptit/paaruoat/vhh-lihamureke.md) | 1,8 | 2,2 | 28,4 | 30,8 | 395,7 |

Sivusto ei tällä hetkellä tue energian näyttämistä reseptien ravintoarvona;
kcal-sarake on mukana laskennan tarkistusmuistiossa, ei julkaistussa
reseptimetadatassa.

## Fineli-lähdetietueet ja massat

Päiväys kaikille tietueille: 24.10.2026. Lähde: Terveyden ja hyvinvoinnin
laitos (THL), Fineli. Tietueiden ID:t avautuvat Finelin API:ssa muodossa
`https://fineli.fi/fineli/api/v1/foods/{ID}`.

| Aines / käytetty Fineli-tietue | ID | Laskussa käytetty massa |
| --- | ---: | ---: |
| Kananmuna, kuoreton | 858 | 55 g/kpl; pientä munaa varten arvio 50 g/kpl |
| Voi | 500 | 14 g/rkl; 4,5 g/tl |
| Kuohukerma 38 % | 631 | 15 g/rkl; 100 g/dl |
| Oliiviöljy | 536 | 13,5 g/rkl |
| Tomaatti, raaka (tomaattimurskan korvaava arvio) | 352 | reseptin ilmoittama grammamäärä |
| Keltasipuli | 335 | 55 g/kpl |
| Punasipuli | 34234 | 55 g/kpl, puolet 27,5 g |
| Punainen paprika | 386 | 170 g/kpl |
| Peruna, vanha, kuorittu | 205 | reseptin ilmoittama 600 g kuorittuna |
| Avokado, kuorittu ja kivetön | 11057 | 100 g pieni / 120 g keskikokoinen |
| Pinaatti, tuore | 33456 | reseptin ilmoittama grammamäärä |
| Cheddar, 34 % (nimetyt cheddar-reseptit) | 698 | reseptin ilmoittama grammamäärä |
| Emmental, 27–30 % (määrittelemätön juustoraaste) | 642 | reseptin ilmoittama grammamäärä |
| Pekoni, 32 % | 707 | reseptin ilmoittama 60 g |
| Tuorejuusto, maustamaton 11 % | 11571 | reseptin ilmoittama 100 g |
| Kesäkurpitsa | 389 | reseptin ilmoittama 200 g |
| Naudan jauheliha, 17 % | 11562 | reseptin ilmoittama 800 g |
| Ruohosipuli | 392 | 7 g/rkl |

Kananmunan, vihannesten ja maitotuotteiden kappale- ja tilavuusmassat ovat
Finelin annosmittatietoja. Tomaattimurska arvioitiin tuoreen tomaatin tiedolla,
ja määrittelemätön juustoraaste Emmentalilla. Lihamurekkeen jauhelihan
rasvaprosentiksi oletettiin 17 %. Reseptien ilmoittamia määrittelemättömiä
suola- ja pippurimääriä ei ole oletettu.

## Lisenssi ja attribuutio

Finelin avoimen datan sivun mukaan API-data on käytettävissä CC BY 4.0
-lisenssillä; käytön yhteydessä nimetään THL ja Fineli, eikä palvelua saa
esittää THL:n tuottamana tai suosittelemana. Rajapinta voi muuttua.
Lähde: [Finelin avoin data](https://fineli.fi/fineli/fi/avoin-data) ja
[Finelin elintarvikehaku](https://fineli.fi/fineli/api/v1/foods?q=omena).

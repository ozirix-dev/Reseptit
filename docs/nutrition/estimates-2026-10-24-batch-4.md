# Kymmenen reseptin Fineli-arviot, erä 4

Laskentapäivä: 24.10.2026. Arvot ovat suuntaa-antavia reseptiarvioita annosta
kohti, eivät laboratorioanalyysejä. Laskenta perustuu julkaistujen reseptien
ainesmääriin ja nimettyihin Fineli-tietueisiin. Lähde: Terveyden ja
hyvinvoinnin laitos (THL), Fineli, [avoin data](https://fineli.fi/fineli/fi/avoin-data),
CC BY 4.0. THL ja Fineli nimetään; THL:n hyväksyntää ei väitetä.

## Laskentatapa

Finelin komponenttitunnisteet: CHO 2034 = imeytyvä hiilihydraatti, FIBT 2168 =
ravintokuitu, POLYL 2260 = polyolit, PROT 2230 = proteiini ja FAT 2157 = rasva.
Ravintotekijät luettiin API-tietueen komponenttivektorista tunnisteiden
mukaan; yleistä `fiber`-kenttää ei käytetty. Ravintoarvo = Fineli-arvo / 100 g
× Finelin yksikkömassa × syötävä osuus. Reseptin summa jaettiin reseptin
ilmoittamalla annosmäärällä, ja vasta lopuksi pyöristettiin kahteen
desimaaliin.

Nettohiilihydraatti = CHO. **Kokonaishiilihydraatti = CHO + FIBT + POLYL.**
Kaikkien mukaan laskettujen lähdetietueiden polyolit olivat 0 g/100 g.
Finelin mukaan reseptien ilmoittamat kappalemäärät muunnettiin näin:
kananmuna 55 g/kpl (#858), keskikokoinen sipuli 55 g (#335), pieni sipuli
30 g (#335), tomaatti 125 g (#352), vihreä paprika 170 g (#387), peruna 60 g
(#205), keskikokoinen kurkku 400 g (#346), purjo 200 g (#337) ja sitruuna
120 g kuorineen, josta 65 % syötävää (#28925). Rkl-massat: voi 14 g (#500),
manteli 10 g (#379), ruokaöljy 13,5 g (#541) ja tuore persilja 2 g (#333).
Psylliumin rkl = 10 g (#31681); kuohukerman dl = 100 g (#631); laimennetun
lihaliemen ja kanaliemen dl = 100 g (#29, #30315).

## Julkaistut arviot annosta kohti

| Resepti | Nettohiilihydraatti (g) | Kokonaishiilihydraatti (g) | Proteiini (g) | Rasva (g) |
| --- | ---: | ---: | ---: | ---: |
| Pinaattiletut mantelijauholla | 2,08 | 3,71 | 11,82 | 19,93 |
| Keto-pannukakku | 3,01 | 5,88 | 11,06 | 35,48 |
| VHH-kaalilaatikko | 9,48 | 13,40 | 20,85 | 30,59 |
| Lihapullat kermakastikkeessa VHH | 7,99 | 12,62 | 36,88 | 72,00 |
| Kikherne-shakshuka | 11,17 | 14,71 | 11,53 | 13,24 |
| Pohjoisafrikkalainen maakouda | 4,84 | 5,30 | 7,53 | 11,84 |
| Menemen fetalla | 5,38 | 7,87 | 21,57 | 31,00 |
| Espanjalainen perunatortilla | 6,14 | 6,90 | 7,83 | 18,61 |
| Kana-pinaatti-sitruunakeitto | 4,87 | 7,37 | 26,14 | 26,33 |
| Kikherne-yrttiaamiainen | 11,98 | 16,49 | 5,73 | 1,48 |

## Fineli-tietueet

Käytetyt tietueet, komponenttiarvot ja annosmassat on tallennettu
`food-records.json`-tiedostoon. Tässä erässä lisättiin suoraan Finelin API:sta
tarkistetut tietueet 541 (ruokaöljyn keskiarvo), 31681 (psyllium), 337
(purjo), 28925 (sitruuna kuorineen) ja 30315 (laimennettu kanaliemi).
Muut käytetyt tietueet ovat 858, 11571, 33456, 379, 500, 631, 320, 11562,
335, 29, 322, 352, 11089, 333, 205, 387, 11211, 536, 11565, 389 ja 346.
Finelin API-osoite tietueelle on
`https://fineli.fi/fineli/api/v1/foods/{ID}?c=2034&c2=2168`.

## Rajaukset ja epävarmuudet

- Suola, pippuri, juustokumina ja kuivattu meirami jätettiin pois, koska
  niiden todellinen käytetty määrä tai täsmällinen maustetuote ei ole
  yksilöity. Niitä ei käsitelty nollamäärinä vaan laskennan rajauksen
  ulkopuolelle jätettyinä.
- Mantelijauho vastaa kokonaisen mantelin tietuetta (#379), koska resepti ei
  yksilöi mantelijauhotuotetta. Kikherneen tietue (#11089) on keitetylle tai
  säilykekikherneelle; laskennan 100 g on syötävä, valutettu määrä.
- Sitruunan syötäväksi osuudeksi käytettiin Finelin 65 %:a. Keitto-ohjeen
  kuoriraasteen ravintosisältö ei sisälly erillisenä, koska Finelin kappalemassa
  koskee kuorineen punnittua sitruunaa ja syötävä osuus erottaa kuoren.
- Öljyt ja paistorasva laskettiin kokonaan reseptiin jääviksi. Paistohävikkiä,
  kypsennyksen veden haihtumista tai ravintoaineiden säilymistä ei mallinnettu.
- Tietueiden mittaustarkkuus ja valmistuksen vaihtelu rajoittavat tulosten
  tarkkuutta. Arvot eivät ole laboratorioanalyysejä.

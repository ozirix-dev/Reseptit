# Viiden karanteenireseptin V2-ravintolaskenta – riippumaton aritmeettinen tarkistus

**13.11.2026 · PR #535 · DRAFT/HOLD · EI JULKAISULUPAA**

Tämä raportti on uutta V2-reseptiversiota varten tehty **uusi aritmeettinen laskelma**. Käytän reseptikohtaisia määriä ja repon aiempien laskelmien Fineli Release 20 / AFCD Release 3 -ravintoainetietueiden alkuperäisiä per 100 g -arvoja. En kopioi vanhoja reseptimakroja. Ravintotietueita ei väitetä riippumattomasti uudelleen laboratoriossa mitatuiksi; aritmeettinen laskenta ja ruoka-/tuotemallin hyväksyntä ovat eri asia.

## Uudet V2-makroehtokkaat per annos (g)

| Resepti | Netto-HH, saatavilla | Kokonais-HH sisältäen kuidun | Proteiini | Rasva |
| --- | ---: | ---: | ---: | ---: |
| pohjoisafrikkalainen-maakouda | 19.83 | 21.80 | 5.74 | 8.68 |
| intialainen-aloo-paratha | 50.04 | 53.04 | 8.38 | 8.27 |
| valimerellinen-kikherne-yrttiaamiainen | 10.20 | 13.66 | 11.10 | 10.95 |
| valimerellinen-appelsiini-aamiaiskakku | 46.85 | 48.95 | 8.45 | 11.42 |
| kiinalainen-bao-munalla | ei lasketa | ei lasketa | ei lasketa | ei lasketa |

Taulukon luvut ovat **alustavia laskentaehdokkaita**. Esitetty total = available carbohydrate + fibre (polyolit oletettu kyseisissä Fineli/AFCD-tietueissa 0 g, kuten tuotekohtaisissa aiemmissa laskelmissa). Suolatietueen Fineli 30 lievä proteiiniarvo on huomioitu. Laskennan sääntö on `summa(raaka-ainetta g × tietueen per100g-arvo / 100) / annoksia`. 1 muna = **50 g kuorettomana** on ehdotettu punnitusoletus; 1 ml vettä = 1 g. Valmistushävikkiä ei ole mitattu; laskennassa kaikki mitatut syötävät ainekset pysyvät mukana, paitsi paistoöljyn erikseen esitetyissä ääriskenaarioissa.

**Bao pidetään numeerisesti estettynä**, koska 15 gramman hoisin-kastikkeen täsmällinen tuote on ratkaisematta. Sen tunnetut muut rivit on tarkistettu, mutta koko ruoan numeroa ei julkaista eikä epätarkkaa proxy-kastiketta lisätä.

## Raaka-aineiden täsmällinen ravintolähdepohja

| Tietue | Available HH / 100 g | Kuitu / 100 g | Proteiini / 100 g | Rasva / 100 g |
| --- | ---: | ---: | ---: | ---: |
| potato — Fineli 205 | 15.5 | 1.4 | 1.88 | 0.114 |
| egg — Fineli 858 | 0.3 | 0 | 12.61 | 9.24 |
| parsley — Fineli 333 | 1.1 | 2.9 | 1.38 | 0.2 |
| cumin — AFCD F003327 | 33.7 | 10.5 | 17.8 | 22.3 |
| oil — Fineli 541 | 0 | 0 | 0 | 99.9 |
| flour — Fineli 110 | 73.998 | 3.5 | 11.6 | 1.56 |
| water — Fineli 922 | 0 | 0 | 0 | 0 |
| coriander — AFCD F003192 | 1.9 | 3.2 | 3.1 | 0.6 |
| yogurt — Fineli 620 / 3.9 % | 3.4 | 0 | 3 | 3.9 |
| chickpea — Fineli 11089 cooked in unsalted water | 17.6 | 5 | 8.44 | 2.5 |
| cucumber — Fineli 346 | 1.4 | 1.1 | 0.65 | 0.1 |
| lemon — Fineli 11557 | 1.6 | 0.1 | 0.31 | 0 |
| olive — Fineli 536 | 0 | 0 | 0 | 100 |
| orange — Fineli 11045 | 8.9 | 2.4 | 0.56 | 0.14 |
| sugar — Fineli 1 | 99.9 | 0 | 0 | 0 |
| baking — AFCD F000247 | 19.8 | 0.4 | 0.8 | 0.3 |
| yeast — AFCD F009606 | 6.3 | 26.9 | 36.4 | 5 |
| salt — Fineli 30 | 0 | 0 | 0.63 | 0 |

Ravintolähteet ovat [THL Fineli, API](https://fineli.fi/fineli/api/v1/foods/205) ja [Food Standards Australia New Zealand, AFCD Release 3](https://www.foodstandards.gov.au/science-data/monitoringnutrition/afcd). Luvut ja tietueiden tunnukset ovat tarkistettavissa myös olemassa olevista repo-tiedostoista `docs/nutrition/calculations/kesakurpitsa-perunapata.json`, `intialainen-aloo-paratha.json`, `lahi-ita-kikherne-shakshuka.json`, `valimerellinen-appelsiini-aamiaiskakku.json`, `gazpacho.json`, `sitruuna-parsapasta.json`, `meheva-suklaakakku.json` ja `pohjoisafrikkalainen-baghrir.json`.

## Viiden version erittely

### pohjoisafrikkalainen-maakouda-punnittu-v2

- potato: 250 g — Fineli 205
- egg: 50 g — Fineli 858
- parsley: 8 g — Fineli 333
- cumin: 2 g — AFCD F003327
- oil: 12 g — Fineli 541
- salt: 1 g — Fineli 30

**Laskenta:** {"netCarbs":19.83,"totalCarbs":21.8,"protein":5.74,"fat":8.68}

**Öljyn imeytymisraja:** kaikki paistoöljy mukana 8.68 g rasvaa/annos; jos 0 g paistoöljyä syödään, 2.69 g rasvaa/annos. Nämä ovat matemaattiset ääritapaukset, eivät valmistuksen mittauksia.

### intialainen-aloo-paratha-punnittu-v2

- flour: 100 g — Fineli 110
- water: 60 g — Fineli 922
- potato: 150 g — Fineli 205
- coriander: 6 g — AFCD F003192
- cumin: 2 g — AFCD F003327
- oil: 12 g — Fineli 541
- yogurt: 60 g — Fineli 620 / 3.9 %
- salt: 1 g — Fineli 30

**Laskenta:** {"netCarbs":50.04,"totalCarbs":53.04,"protein":8.38,"fat":8.27}

**Öljyn imeytymisraja:** kaikki paistoöljy mukana 8.27 g rasvaa/annos; jos 0 g paistoöljyä syödään, 2.28 g rasvaa/annos. Nämä ovat matemaattiset ääritapaukset, eivät valmistuksen mittauksia.

### valimerellinen-kikherne-yrttiaamiainen-punnittu-v2

- chickpea: 100 g — Fineli 11089 cooked in unsalted water
- cucumber: 150 g — Fineli 346
- parsley: 8 g — Fineli 333
- lemon: 20 g — Fineli 11557
- olive: 10 g — Fineli 536
- egg: 100 g — Fineli 858
- salt: 1 g — Fineli 30

**Laskenta:** {"netCarbs":10.2,"totalCarbs":13.66,"protein":11.1,"fat":10.95}

### valimerellinen-appelsiini-aamiaiskakku-punnittu-v2

- flour: 150 g — Fineli 110
- orange: 130 g — Fineli 11045
- yogurt: 100 g — Fineli 620 / 3.9 %
- egg: 100 g — Fineli 858
- olive: 30 g — Fineli 536
- sugar: 60 g — Fineli 1
- baking: 6 g — AFCD F000247
- salt: 1 g — Fineli 30

**Laskenta:** {"netCarbs":46.85,"totalCarbs":48.95,"protein":8.45,"fat":11.42}

### kiinalainen-bao-munalla-punnittu-v2

- flour: 100 g — Fineli 110
- water: 55 g — Fineli 922
- yeast: 2 g — AFCD F009606
- sugar: 5 g — Fineli 1
- oil: 4 g — Fineli 541
- salt: 1 g — Fineli 30
- egg: 100 g — Fineli 858
- cucumber: 150 g — Fineli 346
- hoisin: 15 g — PUUTTUVA TUOTETIETO

**Laskenta:** Vain osittainen rivien tarkistus; koko annoksen tulosta ei saa laskea ilman hoisin-tietoa.

## Kriittinen virhe alkuperäisessä aloo parathassa

Historiallisen `docs/nutrition/calculations/intialainen-aloo-paratha.json`-laskennan rivi `kuorittua perunaa` käyttää **Fineli 310 MAA-ARTISOKKA** (available HH 2,91 g/100 g). Tämä on väärä ruokatuote. V2:n oikea **Fineli 205 PERUNA, VANHA, KUORITTU** sisältää 15,5 g available HH/100 g. Sama 150 g määrä kahdelle annokselle: **+9.44 g nettohiilihydraattia per annos pelkästä tietuekorjauksesta**. Lisäksi V2 sisältää erillistä jogurttia, joten historiallisen luvun korjaus yhdellä numerolla ei riitä. Erillinen GK-historia säilytetään.

## Ennen karanteenin purkua

1. Vahvista valitut kaupalliset tuotteet ja raaka/kypsä/valutettu grammamassa (erityisesti kikherneet ja jogurtti).
2. Varmista käytännön valmistusrakenne kirjatulla keittiökelpoisuuden arviolla; ei väitettä tehdystä fyysisestä kokeesta.
3. Paistoöljyn syöty osuus määrää todellisen rasvan; yllä vain ääriskenaariot, ei arvattua imeytymää.
4. Bao: tarkka hoisin-tuote ja sen allergia-/ravintotiedot; muille resepteille makroarvio on vasta alustava.
5. GI/GK uudelle versiolle täsmällisellä ravintoaine- ja elintarvikemääräpohjalla; puuttuva GK merkitään **ei määritetty**, ei nollaksi.
6. Julkaisu vasta vanhan FI-lähteen tarkastetun migraation, EN/SV/TH-versioiden, kuvavastaavuuden, CI:n ja mainin Pages-testin jälkeen.

**Tämä raportti ei päivitä yhtään alkuperäistä lähdettä, GK-sinettiä tai julkaisukaranteenia. Kaikki viisi pysyvät Draftissa.**

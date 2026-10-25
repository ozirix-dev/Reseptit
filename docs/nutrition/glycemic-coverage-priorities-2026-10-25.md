# GI-kattavuuden esto- ja lähdeinventaario (2026-10-25)

Lähtöcommit: `b51c769731ba40f9ab0b085e5b1b47f979651d9f`. Inventaarion 325 reseptin, 112 lasketun / 213 keskeneräisen reseptin ja 37 GI-tietueen luvut ovat tämän commitin historiallinen lähtötilanne. Uudelleenajo luokittelee saman 213 reseptin joukon nykyisten syötteiden perusteella; erä 1 avaa kaksi arviota ja lisää yhden GI-tietueen, joten nykyinen katalogi ja laskentatulokset poikkeavat tästä lähtötilan kuvauksesta. Luokkamäärät ovat päällekkäisiä reseptien välillä.

Aineistossa on 325 reseptiä, 112 laskettua ja 213 keskeneräistä GK-arviota. GI-katalogissa on 37 tietuetta (4 STRONG, 33 SUPPLEMENTARY). Ravintoarvoauditointi: 180 tuettua, 86 tarkistettavaa, 59 puuttuvaa ja 0 ristiriitaista.

## Esteiden päällekkäisyys

| Luokka | Reseptit | Estoviestit | Aiemmin laskettu, nyt estetty | Jo lähtötilanteessa keskeneräinen |
| --- | ---: | ---: | ---: | ---: |
| A: GI-arvo puuttuu | 42 | 44 | 1 | 41 |
| B: GI-lähde tai ruoka-/valmistusvastaavuus ei täsmää | 50 | 57 | 44 | 6 |
| C: Vain täydentävä tai julkaisutasoltaan riittämätön GI-lähde | 63 | 81 | 30 | 33 |
| D: Hiilihydraatti- tai koostumustieto puuttuu | 66 | 85 | 0 | 66 |
| E: Määrä-, massa- tai valmistusmuunnos ratkaisematta | 18 | 21 | 1 | 17 |
| F: Reseptin tai laskentasyötteen rakennesidonta vanhentunut | 51 | 51 | 0 | 51 |
| G: Alle 2 g:n kumulatiivinen toleranssi ylittyy | 7 | 7 | 5 | 2 |
| H: Muu yksilöity ongelma | 56 | 68 | 1 | 55 |

Ravintoarvoryhmät (erilliset, eivät summaa GK-luokkia): lähteillä tuettu 115, ravintoarvo tarkistettava 44, ravintoarvo puuttuu 54, ristiriita 0.

## Lähdeaukkojen prioriteetti

Prioriteetti yhdistää tuetun imeytyvän hiilihydraatin summan, lähteen uudelleenkäytön ja niiden reseptien määrän, joissa kyseinen este on ainoa nykyinen GK-estoviesti. Piste ei ole kliininen vaikutusarvio.

| # | Ainesosa / vastaavuus | GI / valmistus | Lähtötilan reseptit | Nyt laskettu / edelleen estynyt | Lähtötilassa ainoa este | Yhteinen imeytyvä HH g/annos (summi reseptien yli) | Nykyiset ehdokkaat | Vaikeus |
| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | kookosmaitoa (afcd-F002991-release-3) | ruoka ratkaisematta / valmistus ratkaisematta | 17 | 0 / 17 | 4 | 26.588 | ei hyväksyttyä ehdokasta | Korkea: lähdehaku ja mahdollinen tuotemäärittely |
| 2 | maissitortilla (fineli-35554-release-20) | corn-tortilla / commercial-corn-tortilla | 2 | 0 / 2 | 0 | 51.845 | corn-tortilla-noriega-2000-glucose-estimate (SUPPLEMENTARY) | Keskitaso / korkea: tarkista vastaavuus ja laatu |
| 3 | perunoita (fineli-205-2026-10-24) | potato / boiled-unspecified | 3 | 1 / 2 | 2 | 41.075 | potato-boiled-china-gi-66 (STRONG), potato-cooked-china-nonwestern-gi-66-4 (SUPPLEMENTARY), potato-fried-evoo-lady-rosetta-gi-114 (SUPPLEMENTARY), potato-fried-evoo-spunta-gi-83 (SUPPLEMENTARY), potato-crisp-fried-china-nonwestern-gi-60-3 (SUPPLEMENTARY), potato-steamed-nishiyutaka-nonwestern-gi-64 (SUPPLEMENTARY), potato-steamed-ainoaka-nonwestern-gi-63 (SUPPLEMENTARY), potato-steamed-dejima-nonwestern-gi-54 (SUPPLEMENTARY), potato-boiled-tortilla-analogue-gi-66 (SUPPLEMENTARY), potato-boiled-preparation-analogue-gi-66 (STRONG), potato-mashed-preparation-analogue-gi-73 (STRONG) | Keskitaso / korkea: tarkista vastaavuus ja laatu |
| 4 | couscousia (afcd-F003239-2026-10-24) | bakery-products-category-mean / category-mean | 1 | 0 / 1 | 0 | 46 | bakery-products-category-mean-gi-58 (SUPPLEMENTARY) | Keskitaso / korkea: tarkista vastaavuus ja laatu |
| 5 | maissi (fineli-28958-release-20) | ruoka ratkaisematta / valmistus ratkaisematta | 2 | 0 / 2 | 0 | 39.852 | ei hyväksyttyä ehdokasta | Korkea: lähdehaku ja mahdollinen tuotemäärittely |
| 6 | hunaja (fineli-4-release-20) | ruoka ratkaisematta / valmistus ratkaisematta | 4 | 0 / 4 | 0 | 32.32 | ei hyväksyttyä ehdokasta | Korkea: lähdehaku ja mahdollinen tuotemäärittely |
| 7 | vehnäjauho (fineli-110-2026-10-25) | bread-category-mean / category-mean | 1 | 0 / 1 | 0 | 36.999 | bread-category-mean-gi-64 (SUPPLEMENTARY) | Keskitaso / korkea: tarkista vastaavuus ja laatu |
| 8 | papaija (fineli-34694-release-20) | fruit-category-mean / category-mean | 2 | 0 / 2 | 0 | 23.46 | fruit-category-mean-gi-51 (SUPPLEMENTARY) | Keskitaso / korkea: tarkista vastaavuus ja laatu |
| 9 | peruna (fineli-205-2026-10-24) | potato / tortilla-slow-cooked-in-oil-and-pan-set-with-egg | 1 | 0 / 1 | 1 | 23.25 | potato-boiled-china-gi-66 (STRONG), potato-cooked-china-nonwestern-gi-66-4 (SUPPLEMENTARY), potato-fried-evoo-lady-rosetta-gi-114 (SUPPLEMENTARY), potato-fried-evoo-spunta-gi-83 (SUPPLEMENTARY), potato-crisp-fried-china-nonwestern-gi-60-3 (SUPPLEMENTARY), potato-steamed-nishiyutaka-nonwestern-gi-64 (SUPPLEMENTARY), potato-steamed-ainoaka-nonwestern-gi-63 (SUPPLEMENTARY), potato-steamed-dejima-nonwestern-gi-54 (SUPPLEMENTARY), potato-boiled-tortilla-analogue-gi-66 (SUPPLEMENTARY), potato-boiled-preparation-analogue-gi-66 (STRONG), potato-mashed-preparation-analogue-gi-73 (STRONG) | Keskitaso / korkea: tarkista vastaavuus ja laatu |
| 10 | tummaa suklaata (fineli-32-2026-10-24) | chocolate / dark-chocolate-as-sold | 1 | 0 / 1 | 0 | 21.304 | dark-chocolate-international-tables-mean-gi-29 (STRONG) | Keskitaso / korkea: tarkista vastaavuus ja laatu |
| 11 | kypsennettyjä, valutettuja maissinjyviä (fineli-3040-release-20) | ruoka ratkaisematta / valmistus ratkaisematta | 1 | 0 / 1 | 1 | 18.24 | ei hyväksyttyä ehdokasta | Korkea: lähdehaku ja mahdollinen tuotemäärittely |
| 12 | perunoita (fineli-205-2026-10-24) | potato / mashed-unspecified | 1 | 1 / 0 | 1 | 15.5 | potato-boiled-china-gi-66 (STRONG), potato-cooked-china-nonwestern-gi-66-4 (SUPPLEMENTARY), potato-fried-evoo-lady-rosetta-gi-114 (SUPPLEMENTARY), potato-fried-evoo-spunta-gi-83 (SUPPLEMENTARY), potato-crisp-fried-china-nonwestern-gi-60-3 (SUPPLEMENTARY), potato-steamed-nishiyutaka-nonwestern-gi-64 (SUPPLEMENTARY), potato-steamed-ainoaka-nonwestern-gi-63 (SUPPLEMENTARY), potato-steamed-dejima-nonwestern-gi-54 (SUPPLEMENTARY), potato-boiled-tortilla-analogue-gi-66 (SUPPLEMENTARY), potato-boiled-preparation-analogue-gi-66 (STRONG), potato-mashed-preparation-analogue-gi-73 (STRONG) | Keskitaso / korkea: tarkista vastaavuus ja laatu |
| 13 | filotaikinaa (afcd-F006497-2026-10-24) | bakery-products-category-mean / category-mean | 1 | 0 / 1 | 1 | 14.88 | bakery-products-category-mean-gi-58 (SUPPLEMENTARY) | Keskitaso / korkea: tarkista vastaavuus ja laatu |
| 14 | täysrasvaista kookosmaitoa (fineli-29014-2026-10-24) | curry-paste / asian-regional-food-category | 3 | 0 / 3 | 3 | 8.43 | asian-regional-category-mean-gi-60 (SUPPLEMENTARY) | Keskitaso / korkea: tarkista vastaavuus ja laatu |
| 15 | tomaattimurskaa (fineli-398-2026-10-24) | tomato / cooked-in-sauce | 3 | 0 / 3 | 3 | 8.194 | whole-tomato-raw-gi-22 (STRONG), tomato-juice-canned-gi-38 (SUPPLEMENTARY), tomato-raw-cooked-sauce-analogue-gi-22 (SUPPLEMENTARY) | Keskitaso / korkea: tarkista vastaavuus ja laatu |

## Rajaukset

- Koneellinen luokka kuvaa nykyistä estoviestiä; se ei hyväksy uutta GI-lähdettä eikä takaa GK-arvion avautumista.
- Rakennesidonnan muutokset käsitellään ensin, koska ne mitätöivät aiemman reseptikohtaisen ainesosatarkastelun.
- Yksittäinen GI:tön annososuus pysyy alle 1 g:ssa ja kaikkien pienosuuksien yhteissumma alle 2 g:ssa. Tuntemattomia määriä ei nollata.
- Tiedoston täydellinen 213 reseptin estekohtainen luettelo ja lähde-evidenssikandidaatit ovat JSON-inventaariossa.

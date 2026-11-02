# AFCD-POLYOL-02: kolme saatavilla olevan hiilihydraatin kenttäsidosta

Tämä toteutuserä korjaa [AFCD-POLYOL-01-auditoinnin (PR #181)](https://github.com/ozirix-dev/Reseptit/pull/181) osoittamat kolme rekisterikopiota. Vertailupohja on main `4a804757d5f9732938928dcba8f79ea0674ad98c` (Operaatio 146:n jälkeen).

Kaikkien kolmen `carbohydrateDefinition` on jo `EU_AVAILABLE`. Niiden `per100g.carbohydrate` oli silti otettu AFCD:n **with sugar alcohols** -sarakkeesta. Se korvataan **without sugar alcohols** -arvolla. Laskentamoottorin nykyinen `EU_AVAILABLE`-haara käyttää tätä arvoa sellaisenaan.

| Rekisterikopio | Vanha → oikea g/100 g | Nykyiset GK-reseptiriippuvuudet | Vaikutus |
|---|---:|---:|---|
| `afcd-F006573-release-3`, persikka | 8 → 7,7 | 1: valimerellinen-ricotta-persikkakulho | GK 4,08 → 3,97 |
| `afcd-F007619-release-3`, vadelma | 7 → 6,9 | 1: pellava-puuro-pahkinoilla | Vadelman osuus 0,26775 → 0,263925; kokonais-GK pysyy pidossa |
| `afcd-F002384-release-3`, juuriselleri | 5 → 2,8 | 0 | Käyttämätön rekisterikopio korjataan |

Persikkakulhossa on 150 g persikkaa / 2 annosta ja nykyinen GI-oletus on 51. Muutos on `51 × (7,7 − 8) × 150 / (100 × 100 × 2) = −0,11475`. Tarkka GK muuttuu 4,0836 → 3,96885. Julkisen näytön kokonaislukupyöristys pysyy arvossa ”noin 4”, luokka ja LOW-luottamus säilyvät. Generoitu julkinen GK-tieto sisältää korjatun arvon 3,97.

Pellavapuuron kookosjauhon lähdepuute säilyy. Evidenssisidoksen päivitys ei julkaise sen kokonais-GK:ta. Nykyinen siskonmakkarakeitto käyttää Fineli 311:tä, joten GK 7,04 säilyy. Siemengranolan ja Runebergin torttujen erilliset vadelman makroevidenssikopiot sisältävät jo arvon 6,9 ja säilyvät koskemattomina.

## Lähde ja toistettavuus

Lähde: Food Standards Australia New Zealand, [AFCD Release 3 – Nutrient profiles](https://www.foodstandards.gov.au/sites/default/files/2025-12/AFCD%20Release%203%20-%20Nutrient%20profiles.xlsx), välilehti `All solids & liquids per 100 g`, sarakkeet AM (without) ja AN (with), rivit 678, 712 ja 1425. Tiedoston SHA-256: `14cb3e73dbf58987b440e6299624c0fefd7a4e61591fc1f753995d9534e0efc9`. Noudettu auditointiin 2.11.2026. AFCD-aineiston tekijä on FSANZ; lisenssi CC BY-SA 3.0 Australia. Tässä tehdyt kolmen kentän korjaukset ovat Reseptit-projektin tulkintaa.

`verify_source.py` tarkistaa paikallisen virallisen työkirjan hashin, kaikki kolme lähdetietuetta ja molemmat sarakkeet sekä laskee persikkakulhon muutoksen riippumattomasti Pythonin Decimalilla. Se käyttää vain standardikirjastoa eikä kirjoita tiedostoja:

```text
python docs/nutrition/afcd-field-bindings/verify_source.py <paikallinen-profiles.xlsx>
```

`before.json` sisältää vertailucommitin, lähdekoordinaatit, 326 tuloksen tarkistussummat ja vain kahden muuttuvan tuloksen täydet lähtöobjektit. Sen vanhat kolme kenttäarvoa ja kaksi evidenssihashia ovat tarkoituksella historiallisia, eivät aktiivisia syötteitä. Yhteisiä lähteitä ei monisteta reseptiriveille.

`site/tests/glycemic-load.test.ts` tarkistaa nykyiset tiedot suoraan ilman historiallisten testien lukukäärettä: täsmälleen kolme rekisterikenttää ja kaksi evidenssisidosta muuttuvat, syötteet säilyvät, kahden reseptin uudet evidenssihashit täsmäävät, vanhat hashit hylätään ja muut 324 tulosobjektia pysyvät samoina. Historialliset julkaisutestit palauttavat vain näiden kahden reseptin aiemman näkymän; vanhoja jäädytettyjä vertailuaineistoja ei muuteta.

## Rajaus ja tarkistukset

Reseptitekstit, käännökset, tallennetut makroarvot ja makroevidenssit säilyvät. Rekisterin proteiini, rasva, kuitu ja polyoliarvot sekä nykyiset polyoliliput säilyvät. Nykyisten polyolilippujen oikeellisuutta ei vahvisteta tällä korjauksella: auditoinnin osoittama with/without-erotuksen puutteellinen kattavuus jää erilliseen normalisointierään. Tämän erän arvot eivät ole todiste polyolien kokonaismäärästä. Uutta komponenttimallia ei aktivoida.

Paikalliset tarkistukset: tiukka ravintoarvoauditointi, GK-auditointi, TypeScript, kohdennetut ravintoarvo- ja GK-testit sekä tarvittava paikallinen staattinen koonti. GK-jakauma säilyy 156 laskettuna ja 170 lähdepuutteellisena; uusia numeerisia tuloksia ei julkaista. Draft-PR ei sisällä mergeä tai deployta. GitHub Actions -ajoja ei käynnistetä käsin.

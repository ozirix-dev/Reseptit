# Välipalat – erä 01: ravintolähteet ja GK-esteluettelo

**Päiväys:** 2026-11-06. **Tila:** EDITORIAL CANDIDATE / HOLD / EI JULKAISUUN.

Tämä aineisto ei ole `docs/nutrition/calculations/`-julkaisuevidenssi, eikä siihen sisälly omistajan hyväksyntää, GK-arvoa tai käskyä julkaista. Laskenta käyttää jo repoissa olevia, nimettyjä Fineli Release 20 / AFCD Release 3 -tietueita. Fineli: THL, CC BY 4.0; AFCD: FSANZ, CC BY-SA 3.0 Australia. Aineistoa ei ole haettu uudelleen live-rajapinnoista tässä erässä.

## Laskettu tarkistusnäkymä (ei julkisia ravintoarvoja)

| Resepti | Annos | Netto-CHO g | Kokonais-CHO g | Proteiini g | Rasva g | Kuitu g | Ratkaisu |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| Juustonaksut | 3 naksua | 0,08 | 0,17 | 9,01 | 12,07 | 0,09 | **HOLD**: savupaprika vain analoginen makrolähde ja rasvan hävikki tuntematon |
| Täytetyt kananmunat | 2 puolikasta | — | — | — | — | — | **HOLD**: majoneesi ja Dijon tuotteena auki, ruohosipulista puuttuvat täydet makrot |
| Fetavaahto + kasvikset | 1/4 erästä | 3,53 | 4,83 | 8,15 | 9,42 | 1,30 | **KANDIDAATTI**: kuusi täsmällistä lähdettä; ihmisen tarkistus ja julkaisu-evidenssi vielä puuttuvat |

Luvut ovat **raakasyötteiden toimituksellisia vertailulukuja**, eivät valmistetun ruoan mittauksia. Juustonaksuissa oletetaan lähtöaineiden säilyvän ruoassa; uunista ja paperista poistunut rasva voi muuttaa rasvalukua. Paprikavertailu käyttää Australian tavallista kuivattua paprikajauhetta eikä ole savupaprikan täsmälähde.

## Kaava ja kontrollit

Ainesosan makro = `määrä grammoina × koostumuslähteen per-100-g arvo / 100`. Annosarvo = kaikkien saman ravintotekijän osien summa / annokset; pyöristys vasta lopuksi 2 desimaaliin. Netto-CHO = lähteen `EU_AVAILABLE` (ei kuitua). Kokonais-CHO = `EU_AVAILABLE + kuitu + lähteistetyt polyolit`. Negatiivisia, puuttuvia tai tuntemattomia arvoja **ei** korvata nollalla.

Toistettavat sidokset ja matemaattiset odotusarvot on tallennettu `nutrition-source-ledger.json`-tiedostoon. Mukana on testit, jotka varmistavat että katselmointireseptien todelliset ainesosamäärät, annokset ja neljän kielen määrät eivät poikkea sidotuista arvoista.

## Fineli-lähteet

- Cheddar: [Fineli 698](https://fineli.fi/fineli/fi/elintarvikkeet/698), 34 % rasvaa.
- Keitetty kananmuna: [Fineli 8513](https://fineli.fi/fineli/fi/elintarvikkeet/8513).
- Sinappi: [Fineli 28](https://fineli.fi/fineli/fi/elintarvikkeet/28) (ei ole Dijon-tuotteen täsmäosuma).
- Feta: [Fineli 11211](https://fineli.fi/fineli/fi/elintarvikkeet/11211).
- Kreikkalainen laktoositon 7 % jogurtti: [Fineli 34611](https://fineli.fi/fineli/fi/elintarvikkeet/34611).
- Sitruunamehu: [Fineli 11557](https://fineli.fi/fineli/fi/elintarvikkeet/11557).
- Tilli: [Fineli 369](https://fineli.fi/fineli/fi/elintarvikkeet/369).
- Kurkku: [Fineli 346](https://fineli.fi/fineli/fi/elintarvikkeet/346).
- Punainen paprika: [Fineli 386](https://fineli.fi/fineli/fi/elintarvikkeet/386).
- Ruohosipuli: [Fineli 392](https://fineli.fi/fineli/fi/elintarvikkeet/392), tietueen täydelliset makrot vielä tarkistettava.

## AFCD-lähteet

- `F006316`, paprika dry powder — *ei varmistettu savupaprika*.
- `F005441`, commercial mayonnaise, traditional, >65 % fat — *ei valitun majoneesituotteen täsmäosuma*.
- [FSANZ Australian Food Composition Database](https://www.foodstandards.gov.au/science-data/monitoringnutrition/afcd).

## GI/GK-päätös

**GK: HOLD jokaisella kolmella.** Pieni laskettu hiilihydraattimäärä ei ole peruste ilmoittaa GK = 0. Ei sallita kategorian keskiarvoa mitatuksi GI:ksi eikä imputaatiota yleispätevänä; uudet GK-ehdokkaat vaativat nykyisen hyväksyntäpolun. Ravintoarvojen toimituksellinen valmius ja GK-lähteiden puute ovat eri asiat.

## Seuraavat toteutusportit

1. Valitse täsmätuotteet (majoneesi, Dijon, savupaprika); täydennä ruohosipulin lähde.
2. Dokumentoi juustonaksujen paiston rasvahävikki; tarkista munien kuorittu paino; testaa annostelu.
3. Laske julkaisuevidenssit nimenomaan `docs/nutrition/calculations/<id>.json` -sopimuksella ennen mitään arvojen julkaisemista.
4. Hyväksytä ja liitä reseptikohtaiset WebP-kuvat sekä vertaile neljän kieliversion merkitys.
5. Omistajan erillinen sisältöpäätös, sitten uudet reseptit `reseptit/valipalat/`-hakemistoon julkaisua varten.

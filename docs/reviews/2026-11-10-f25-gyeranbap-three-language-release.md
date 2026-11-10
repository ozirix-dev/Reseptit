# F25: gyeranbap-riisikulho – kolme kieliversiota (10.11.2026)

## Julkaisurajaus

`korealainen-gyeranbap-riisikulho` on jo julkaistu suomeksi. [F25 Draft PR #399](https://github.com/ozirix-dev/Reseptit/pull/399) sisältää kolme kirjoitettua EN/SV/TH-luonnosta. Tässä erillisessä **main-pohjaisessa release-PR:ssä** julkaistaan vain niiden kolme kieliversiota. Koko Draft-PR:ää #399 ei yhdistetä.

## Täsmälähde ja valmistus

- FI-raakablobi `9955dbbce84566bb1967f86ab19c75eb3c3379af`; julkinen FI-valmistusohje saadaan aiemmin CI-testatusta `site/scripts/fi-breakfast-quality-display.ts`-projektorista, joka on lukittu normalisoituun raakatiedoston SHA-256:een. **Merkitysevidenssi käyttää julkista FI-tekstiä**, ei vanhaa yleisohjetta, kuten [PR #405](https://github.com/ozirix-dev/Reseptit/pull/405) edellyttää.
- Neljä valmistusvaihetta kaikilla kielillä. 100 g **kuivaa** valkoista riisiä keitetään pakkauksen veden kanssa, 2 kananmunaa paistetaan miedolla lämmöllä tarttumattomalla pannulla **ilman lisättyä öljyä tai voita**, annokset viimeistellään luettelon 1 rkl soijakastikkeella ja 5 g kuivatulla norilla. Ei listan ulkopuolista seesamiöljyä.
- Sopivalla pannulla öljytön munanpaisto on toteutettavissa, mutta se vaatii hyväkuntoisen tarttumattoman pinnan ja rauhallisen kypsennyksen. Ei fyysistä koepaistoväitettä; valmistus on AI-kokkikatselmoitu. Vaihtoehtoinen rasvassa paistaminen vaatisi reseptin ja makrojen muuttamisen, eikä sitä lisätä hiljaisesti.
- `main_ingredient` tunnisteet (riisi, kananmuna, soijakastike) vastaavat FI:n sisäisiä hakutunnisteita kaikilla kielillä; varsinaiset ainesnimet ja ohjeet ovat käännettyjä.

## Ravintolaskennan tuotteet ja yksikkömuunnokset

Lähde: `docs/nutrition/calculations/korealainen-gyeranbap-riisikulho.json`, `reviewerStatus: AUTOMATED ONLY`, lähdetiedoston Git blob `f9cf32ee078aaef71410a0183b30b73d7b09c678`. Kahden annoksen ravintolaskenta perustuu seuraaviin syötteisiin:

| Aines | Laskentapaino | Tietokanta ja tuotemääritelmä |
| --- | ---: | --- |
| Valkoinen riisi, kuivana | 100 g | AFCD Release 3 F007682, rice white uncooked |
| Kananmuna, kuoreton | 2 × 55 g = 110 g | Fineli 858, KPL_M = 55 g/kananmuna |
| Soijakastike | 1 rkl = 18 g | Fineli 31, RKL = 18 g |
| Kuivattu norilevä | 5 g | AFCD Release 3 F008204, nori dried |
| Suola | valinnainen | Puhdas suola pois neljän makron laskennasta |

Kaikki syötävä punnittu ainesmäärä kuuluu annoksiin, ylimääräistä paistorasvaa ei käytetä. Yhteensä reseptissä hiilihydraattia 76,155 g ja kuitua 2,515 g. Reseptissä on 2 annosta, joten **hiilihydraatit kuidun kanssa (76,155 + 2,515)/2 = 39,335 g → 39,34 g** desimaalilaskennan half-up-pyöristyksellä. Binäärisen liukulukulaskennan 39,33-virhettä ei hyväksytä.

Muut neljä per-portion metatietoa ovat samat FI:ssä ja kaikissa kielissä: **imeytyvä hiilihydraatti 38,08 g; kokonaishiilihydraatti kuitu mukaan lukien 39,34 g; proteiini 12,07 g; rasva 5,65 g**. Nämä ovat viiteaineiston koostumusarvioita, eivät yksittäisen tuotteen tai paistetun annoksen laboratoriomittauksia. Kaikki neljä täsmäävät lähteen arvoihin.

## AI-merkitystarkisteet

FI-julkisen, SHA-lukitun esityksen `semanticHash`:

`8056e09b5bf03ba0afe900486da00617f90ed45c02af788e01680ee4ce9b64a9`

- EN `3455cd1a60978d0f616f1e71edf2e2e04573b43640f453f16f6f93bf01870ab6`
- SV `d86eb5ee01e2668bad552d9d285d8490ff0a53d10dda84dc1be7cc9321e0e52a`
- TH `f4adc9565f23b850734fb0a13e01b5c7e7e83f4cccf5e70dd350888bca2f35a9`

Nämä löytyvät `meta/kaannokset/codex-review-evidence.json`-rekisteristä outcome `pass`, mikä tarkoittaa **AI:n merkityskatselmointia**, ei ihmisen/natiivipuhujan hyväksyntää. Lukitus vanhenee, jos FI-julkinen ohje tai kieliversion merkityksellinen sisältö muuttuu.

## Julkaisuportti ja rajat

- Tämä julkaisu-PR muuttaa vain 3 kielitiedostoa, yhdet täsmä-SHA:t ja julkaisuindeksin **62/186 → 63 FI-lähdettä / 189 kieliparia** sekä tämän raportin. FI-lähteeseen, ravintotietokantaan, GI/GK-sinetteihin, kuviin ja uusiin resepteihin ei kosketa.
- Exact-HEAD CI **SUCCESS** ennen mergeä, sen jälkeen täsmälleen merge-SHA:n main GitHub Pages build+deploy SUCCESS. Erillinen live-reittien selaintarkistus kirjataan vain, jos sen voi toteuttaa.
- Muut F25-lähteet pysyvät HOLD/Draftissa. Pistaasi-ruusuvesijogurtti on edelleen HOLD, koska ruusuveden koostumus ja 5 ml poisrajaus tarvitsevat tuotekohtaisen päätöksen. Älä mergeä vanhaa F25 Draftia #399 suoraan.
- Ei kosketa rinnakkaisiin PR #407, #409, #412 tai uuden reseptin porttiin #400.

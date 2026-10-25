# Ravintoarvioiden erä 17 — 25.10.2026

## Valinta ja lähderajaus

Seuraavan erän kokoraja nostettiin 40 reseptiin. Paikallisten Fineli Release 20- ja AFCD Release 3 -tietueiden tarkistus osoitti, ettei 40:n erää voi täyttää luotettavasti: esimerkiksi usean mustapapureseptin ainoa paikallinen mustapaputietue ei sisällä kuitua eikä polyoleja, ja joillekin muille erikoisraaka-aineille ei löytynyt sopivaa tietuetta. Näitä tietoja ei täydennetty nollilla eikä väärällä vastineella. Erään valittiin siksi 20 laskettavissa olevaa reseptiä ja kolme alun perin valittua reseptiä korvattiin muilla.

Valittuihin resepteihin täsmennettiin tarvittavia määriä ja tuotteita lähderesepteissä. Kookospannukakun kookos täsmennettiin kookosmaidoksi, kaya-paahtoleivän kananmunamäärä eroteltiin hillon ja tarjoilun käyttöön, ja quesadillan tortillan, maissin, juuston ja sienten määrät eroteltiin. Harissa-shakshukan tomaatit ja paprika ilmoitetaan syötävänä grammamääränä. Muut reseptimuutokset kirjataan lähdetiedostojen ainesosiin ja laskentatiedostojen lähdevastaavuuksiin.

Erän laskentasyöte on [batch-17-manifestissa](batches/batch-17.json). Jokaisen reseptin lähdetietueet, muunnokset, reseptiversion tiiviste, annosjako ja rajaukset ovat [laskentatiedostossa](calculations/). Laskennassa käytettiin Fineli Release 20 -tietueita (THL, CC BY 4.0) ja AFCD Release 3 -tietueita (FSANZ, CC BY-SA 3.0 Australia). Mausteiden ja teen pienet rajaukset sisältävät annoskohtaiset ylärajat. Suola rajattiin pois, koska se ei vaikuta neljään näytettävään makroon. Öljy laskettiin reseptimäärän mukaan kokonaan mukaan.

Kokonaishiilihydraatti on imeytyvä hiilihydraatti + kuitu + polyolit. Nettoarvosta vähennetään vain lähteistetyt polyolit. Arvot jaetaan reseptin annosmäärällä ja pyöristetään kahden desimaalin tarkkuuteen. Tuntemattomia ravintoarvoja ei käsitellä nollina.

## Ravintoarvot annosta kohti

| Resepti | Nettohiilihydraatit (g) | Kokonaishiilihydraatit (g) | Proteiini (g) | Rasva (g) |
| --- | ---: | ---: | ---: | ---: |
| hunaja-sinappikana-kaalilla | 12.22 | 15.53 | 30.86 | 11.91 |
| kreikkalainen-kanavuoka-oliiveilla | 4.10 | 6.16 | 34.49 | 20.81 |
| tandoorikana | 3.29 | 4.27 | 40.22 | 11.01 |
| tunisialainen-ojja | 26.41 | 29.16 | 11.65 | 9.35 |
| keto-joulutortut | 3.44 | 5.57 | 7.53 | 24.28 |
| indonesialainen-ketoprak-aamiaiskulho | 44.21 | 48.14 | 14.93 | 12.03 |
| indonesialainen-pisang-goreng-aamiaiseksi | 63.85 | 67.56 | 5.26 | 14.22 |
| indonesialainen-serabi-kookospannukakku | 57.30 | 63.54 | 5.93 | 28.70 |
| japanilainen-onigiri-lohella | 37.06 | 38.26 | 13.93 | 8.59 |
| japanilainen-tamago-kake-gohan | 38.04 | 38.79 | 11.37 | 5.58 |
| japanilainen-kabocha-puuro | 47.22 | 50.15 | 8.03 | 16.86 |
| karibia-bammy-kassavaleipa | 40.04 | 47.86 | 4.04 | 30.87 |
| kiinalainen-soijamaito-aamiaisella | 1.31 | 3.03 | 3.69 | 4.28 |
| lahi-ita-manakish-zaatarilla | 57.49 | 60.65 | 10.66 | 17.58 |
| malesialainen-kaya-paahtoleipa | 36.59 | 40.28 | 12.18 | 26.21 |
| japanilainen-hojicha-jogurtti-persimonilla | 17.03 | 19.34 | 4.26 | 4.07 |
| meksikolainen-quesadilla-sienilla | 32.94 | 35.50 | 11.21 | 20.32 |
| pohjoisafrikkalainen-harissa-shakshuka | 5.70 | 7.37 | 7.98 | 12.24 |
| valimerellinen-farinata-aamupalaksi | 20.98 | 31.98 | 10.40 | 12.36 |
| valimerellinen-halloumi-tomaattileipa | 27.58 | 29.51 | 20.18 | 28.56 |

## Audit ja prosessin parannus

Tiukka auditointi hyväksyi kaikki 20 erän reseptiä `ESTIMATE WITH EVIDENCE` -tilaan. Kokonaisauditissa on nyt 160 evidenssillä tuettua arviota, 86 tarkistusta odottavaa arviota, 79 puuttuvaa arviota ja 0 ristiriitaa.

Erän kokoraja on nyt 40. Prosessi kuitenkin rajaa toteutuvan erän siihen kokoon, jonka kaikki ravintoarvot, tuotemuunnokset ja annoskohtaiset rajaukset pystytään lähteistämään. Seuraavissa erissä paikallisen aineiston kuitu- ja polyolipuutteet tarkistetaan ennen reseptien valintaa; epäkelpo lähdetietue korvataan sopivalla lisensoidulla tietueella tai resepti siirretään myöhempään erään.

Arvot ovat suuntaa-antavia reseptiarvioita, eivät laboratorioanalyysejä. Lähteet: [Fineli avoin data](https://fineli.fi/fineli/fi/avoin-data) ja [AFCD Release 3](https://www.foodstandards.gov.au/science-data/monitoringnutrition/afcd).

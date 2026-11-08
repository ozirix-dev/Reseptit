# Välipalat — katselmointijono 2026-11-06

## Rajaus ja päätös

Välipalat lisätään omaksi sisältökategoriaksi. **Kymmenen kohdetta siirretään katselmointiin, kahdeksan jätetään draft-jonoon.** Kaikki uudet reseptit ovat `status: draft`. Työversiot säilytetään `docs/reviews/valipalat/`-hakemistossa alkuperäisen reseptipuun GK-sinettien turvaamiseksi; julkaisuhakemistoon `reseptit/valipalat/` ne siirretään vasta hyväksynnällä. Ne eivät vaikuta julkaistujen reseptien määrään tai GK-kattavuuteen. Kategoriavalinta näkyy vasta, kun kyseisellä kielellä on julkaistuja välipaloja (nykyinen suodatinlogiikka); etusivun hero- ja valikkotyöhön ei puututa.

## Katselmointiin — 10

| Alkup. | Ehdokas | Tämän muutoksen kohde | Erityishuomio |
|---|---|---|---|
| 10 | Fetavaahto | `docs/reviews/valipalat/katselmointi/fetavaahto-kasvistikuilla.md` | Uusi alustava reseptiluonnos |
| 11 | Munakasmuffinit | `reseptit/aamupalat/munakasmuffinit.md` | JO JULKAISTU; tarkista sopiiko välipalaksi suodatus/tagi, älä kloonaa |
| 12 | Juustonaksut | `docs/reviews/valipalat/katselmointi/rapeat-juustonaksut.md` | Uusi alustava reseptiluonnos |
| 17 | Täytetyt kananmunat | `docs/reviews/valipalat/katselmointi/taytetyt-kananmunat-yrteilla.md` | Uusi alustava reseptiluonnos |
| 20 | Tonnikalatäyte kurkkukupeissa | `docs/reviews/valipalat/katselmointi/tonnikalatayte-kurkkukupeissa.md` | Uusi alustava reseptiluonnos |
| 23 | Keto-suklaamousse | `reseptit/jalkiruoat/suklaamousse-keto.md` | Lähteessä on vain otsikko; täydennä nykyistä, älä tee duplikaattia |
| 24 | Siemennäkkärit | `docs/reviews/valipalat/katselmointi/rapeat-siemennakkarit.md` | Uusi alustava reseptiluonnos |
| 26 | Jalapeño poppers | `docs/reviews/valipalat/katselmointi/jalapeno-poppers-pekonilla.md` | Uusi alustava reseptiluonnos |
| 27 | Kesäkurpitsalastut | `docs/reviews/valipalat/katselmointi/rapeat-kesakurpitsalastut.md` | Koepaisto erityisen tärkeä |
| 30 | Keto-suklaapallot | `docs/reviews/valipalat/katselmointi/keto-suklaapallot.md` | Erytritoli/kuidut käsiteltävä oikein |

**Katselmointi ei tarkoita hyväksyttyä julkaisua.** Uusien kahdeksan ainesosat ja valmistus on luonnosteltu lähtöpisteeksi. Ravintoarvoja tai GK-lukuja ei ole arvattu. Kahden nykyisen reseptin tilaa ei muuteta tässä PR:ssä.

## Draft-jonoon — 8

| Alkup. | Idea | Raakile |
|---|---|---|
| 13 | Caprese-vartaat yrttiöljyllä | `docs/reviews/valipalat/luonnokset/caprese-vartaat-marinadilla.md` |
| 14 | Guacamole ja kurkkutikut | `docs/reviews/valipalat/luonnokset/guacamole-kurkkutikuille.md` |
| 18 | Avokado-munaveneet | `docs/reviews/valipalat/luonnokset/avokado-munaveneet.md` |
| 19 | Fathead-juustoleipä | `docs/reviews/valipalat/luonnokset/fathead-juustoleipa.md` |
| 21 | Keto-granola | `docs/reviews/valipalat/luonnokset/keto-granola.md` |
| 22 | Kookos-chia-vanukas | `docs/reviews/valipalat/luonnokset/kookos-chia-vanukas.md` |
| 28 | Proteiinivanukas | `docs/reviews/valipalat/luonnokset/proteiinivanukas.md` |
| 29 | VHH-välipalapatukka | `docs/reviews/valipalat/luonnokset/vhh-valipalapatukka.md` |

## Varmistukset ennen julkaisua

1. Deduplikointi: nykyiset munakasmuffinit, mousse-luonnos, uunimuna-avokadot, siemengranola ja chiavanukkaat on huomioitava. Jos sama resepti löytyy, paranna olemassa olevaa tai hylkää.
2. Punnitut grammamäärät ja toistettava ohje; kokeile tarvittaessa itse reseptiä. Muista tuoreuden, kypsennyksen ja säilytyksen turvallisuus.
3. Ravintoarvot lasketaan raaka-ainelähteistä, ei tästä jonosta kopioiduista arvioista. Keto/VHH vain perusteltuna.
4. GK tehdään nykyisillä lähteiden soveltuvuus- ja HOLD-säännöillä. Ei GI-analogiaa, ei keinotekoista GK:ta eikä vaikutusta julkaistuun kattavuusmittariin.
5. Kuva: aito kuva joka vastaa annosta, optimointi WebP + SEO; 4 kieliversiota vasta valmiille hyväksytylle ohjeelle.
6. Kategoria esiin vasta julkaistulla sisällöllä; hero ja muu navigaatio toisten PR:ien päätöksillä.

## Siirtoperiaate

Katselmointi- ja draft-tiedostot ovat Markdown-reseptiluonnoksia, mutta niitä **ei vielä lueta sisältöbuildiin**. Hyväksytty valmis suomenkielinen resepti siirretään `reseptit/valipalat/`-hakemistoon omassa julkaisumuutoksessaan. Ei avata GK-laskennan sinettejä keskeneräisiä reseptejä varten.

## Ei tehty

Ei julkaisuja, ei mergeä, ei uusia GK-arvoja, ei ravintolukujen sepittämistä eikä olemassa olevien URLien siirtelyä.

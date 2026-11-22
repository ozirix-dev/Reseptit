# Perinteinen kesäkeitto – FI/EN/SV/TH merkitysvertailun työraportti

- Päiväys 2026-11-21; PR #787, HEAD `30f36ec9d750485808776a4e112d09ab238aa48b`. Tekstuaalisen tarkistuksen tekijä **Chat 3 / Kokki-3**; ei virallinen Codex- tai ihmishyväksyntä.
- Blob SHA: FI `9c1d6ded143f7c80e1b33cb1ecb92ceee6757cec`, EN `a49fb5724a73e22044d3c5a6fa3de19369b296e4`, SV `d26cb1e3fc53afd5b53c67b636105b99be2d6fe2`, TH `54a820af3d69be0e3840bb5d73e922f7c97bd6ef`.
- 11 ainesosariviä, 6 annosta, 5 valmistusvaihetta; määrät/yksiköt/järjestys täsmäävät neljällä kielellä.

| # | FI | EN | SV | TH |
|---|---|---|---|---|
| 1 | pestyjä uusia perunoita (500 g) | scrubbed new potatoes | tvättad nypotatis | มันฝรั่งใหม่ล้างสะอาด |
| 2 | porkkanoita (250 g) | carrots | morötter | แครอต |
| 3 | kukkakaalia (350 g) | cauliflower | blomkål | กะหล่ำดอก |
| 4 | tuoreita tai pakastettuja herneitä (150 g) | fresh or frozen green peas | färska eller frysta ärter | ถั่วลันเตาสดหรือแช่แข็ง |
| 5 | kevätsipulia (100 g) | spring onions | salladslök | ต้นหอม |
| 6 | vettä (700 g) | water | vatten | น้ำ |
| 7 | maitoa (400 g) | milk | mjölk | นม |
| 8 | vehnäjauhoja (20 g) | plain wheat flour | vetemjöl | แป้งสาลีอเนกประสงค์ |
| 9 | voita (15 g) | butter | smör | เนย |
| 10 | suolaa (7 g) | salt | salt | เกลือ |
| 11 | tuoretta tilliä (12 g) | fresh dill | färsk dill | ผักชีลาวสด |

## Tarkistetut merkityskohdat

- **EN:** New potatoes, carrots, cauliflower, fresh/frozen peas, spring onion (white and green parts), 700 g water, 400 g milk and 20 g wheat flour. Flour is whisked into *cold* milk, then simmered for 4–5 minutes; exact cooking steps 7–8 → 5–7 → 2 min are retained.
- **SV:** Nypotatis / morötter / blomkål / ärter / salladslök, mjölk ja vetemjöl oikein. Jauho sekoitetaan kylmään maitoon, ei keitettyyn maitoon. Aikajärjestys, voin lisääminen lopussa ja tilli täsmäävät.
- **TH:** "มันฝรั่งใหม่" = uudet perunat, "ต้นหอม" = kevätsipuli, "แป้งสาลี" = vehnäjauho, "นมเย็น" = kylmä maito ja "ผักชีลาว" = tilli. Ei havaittua P0/P1-lajivirhettä.
- **Allergeenit:** Maito ja vehnä mainitaan kaikilla kielillä. Ylijääneen ruoan jäähdytys säilyy. Samaa raaka-aineen rasvaprosentin epävarmuutta ei pidä tulkita käännösongelmaksi.
- **Avoinna:** Valmistusta ei ole itse testattu; lähdeohjeen ja Recipavon muokattujen määrien vaikutusta koostumukseen on vielä arvioitava. Käännösten lopulliset Codex-semanttiikkatiivisteet ja hyväksyntärekisterimerkinnät puuttuvat.

Tämä on luonnoksen tekstuaalinen vertailu, ei `meta/kaannokset/codex-review-evidence.json` -rekisterin kuittaus. `decision: hold` pysyy voimassa. Fyysinen koekeittiökoe ei yksin ole julkaisun pakollinen ehto, jos muu riippumaton evidenssi riittää.

## Chat 3:n 22.11.2026 merkitysvertailu ja versiosidonta

Nykyinen FI-lähde täsmennettiin 1,5 % kevytmaidoksi ja oikean kasviskypsyyden haarukkatarkistuksella. Sama merkitys on kirjoitettu EN `semi-skimmed milk, 1.5% fat`, SV `lättmjölk, 1,5 % fett` ja TH `นมไขมันต่ำ ไขมัน 1.5%` -ainesosariveihin ja neljännen valmistusvaiheen kypsyysohjeisiin. Maidon ja vehnän allergeenit sekä jäähtymisen ohjeet säilyvät kaikilla kielillä.

**Tarkistuksen tyyppi:** Chat 3:n suora tekstuaalinen valmistus- ja semantiikkakatselmointi, 11/11 ainesosariviä ja 5/5 vaihetta jokaisessa FI/EN/SV/TH-parissa, ei itsenäinen ulkopuolisen hyväksyjän allekirjoitus. FI-lähteen uusi raakateksti-SHA256 `a43a0dfe31b1e9b2f567b601be66e0b818b40c0731e8a372062b2ba333fb25af`. Virallinen `semanticHash` ja `meta/kaannokset/codex-review-evidence.json`-portti pysyvät **HOLD**: ei kirjoitettu tekaistuja `outcome: pass` -merkintöjä.

## Virallisen semantiikkarekisterin julkaisua estävä välimerkintä – 22.11.2026

`meta/kaannokset/codex-review-evidence.json` sisältää nyt kolme *aidosti tarkistettuun lähderevisioon sidottua* `outcome: human-required` -merkintää, ei keksittyä `outcome: pass` -hyväksyntää. Nämä ovat tarkistusjonon rekisterimerkintöjä, jotka nimenomaisesti **estävät** julkaisun ilman riippumatonta katselmointia.

- `kesakeitto:en`: `source_hash=46db9ccbf6828199c5399095034148e0a9cd9de34015c477e4a07c79e57c2d94`, `translation_hash=d08236452f1f9f909ce323973724e749b75b87a723d1001d5c975899edebc50c`.
- `kesakeitto:sv`: `source_hash=46db9ccbf6828199c5399095034148e0a9cd9de34015c477e4a07c79e57c2d94`, `translation_hash=85509455fdd828387da9434e0dfe7056b34dbc55547270f1690b748f65bec578`.
- `kesakeitto:th`: `source_hash=46db9ccbf6828199c5399095034148e0a9cd9de34015c477e4a07c79e57c2d94`, `translation_hash=336c64eaec37288bc704067f2168417a9b1213871d8326a4e45921d4d4cc0ed3`.

Tiivisteiden lähtökohtana on projektin `site/scripts/translation-semantic-review.ts`-funktion `semanticHash` kenttäkarsinta ja `site/src/content/schema.ts`-kenttäjärjestys. Kirjaukset ovat `human-required`, eivät hyväksymistodistuksia. EN/SV/TH tekstien 11 ainesosariviä, annosmäärä, kypsennysvaiheet sekä allergia- ja jäähdytysohjeet on jo verrattu Chat 3:ssa; erillisen hyväksyjän kuittaus puuttuu. Kaikki neljä tiedostoa ovat `status: draft`, PR #787 ja reseptin `decision: hold`.

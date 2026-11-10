# D30 FI-näyttökorjaus – minttupuuron täysmaito

Päivä 10.11.2026, päähaaran lähtö-SHA `efc8ce70fcac2ba5961e3aea528c522116ec5599`.

Laskentatiedostossa `docs/nutrition/calculations/pohjoisafrikkalainen-minttutee-kaurapuuro.json` 200 g:n `maito`-raaka-aine viittaa nimenomaisesti Finelin täysmaitoon **fineli-689-release-20**, `MAITO, TÄYSMAITO, D-VITAMIINIA 1 UG` (rasva 3,5 g/100 g). Kanonisen FI-reseptin valmistusohjeessa on jo täysmaito, mutta ainesosaluettelon nimike on väljä `maito`. Julkisessa FI-näyttöversiossa muutetaan vain tämän 200 g:n erän `item: maito` -> `item: täysmaito` ankkurilla ja raaka-FI-tiedoston SHA256-lukolla.

Tämä **ei** muuta alkuperäistä FI Markdownia, punnittuja 200 g, annoksia, ravintoarvoja, makeutusta, syötäviä 6 g mintunlehtiä eikä laskennan GI/GK-/GK80-sinettejä. Näyttökerroksen tilasta ei saa päätellä, että raaka-FI olisi hyväksytty uudelleen tai GK laskettu uudelleen. Testi varmistaa alkuperäisen Fineli-tietueen, tarkan lähde-SHA:n sekä julkaistun FI-rakenteen.

[PR #386](https://github.com/ozirix-dev/Reseptit/pull/386) on yhä käännösluonnos. Sen EN- ja TH-aineksien väljä `milk`/`นม` tarkennetaan saman täysmaitolähteen mukaisiksi **erikseen** ennen kieliversion julkaisuvalmiutta. Ruotsin nykyinen `helmjölk` on oikein. Ei julkaisulupaa 386:lle tästä PR:stä.

Pagesin aiempi `syncing_files`-este on erillinen: [issue #387](https://github.com/ozirix-dev/Reseptit/issues/387). Buildin tai PR-CI:n vihreys ei ole deployment-SUCCESS-todistus.

## FI-aamiaislaadun kaksi lisäoikaisua – 10.11.2026

Laajennettu tämän PR:n julkisen esityksen laatutarkistuksia kahteen muuhun aiemmin raportoituun reseptiin. Kaikki ovat edelleen **vain SHA-256-lukittuja FI-näyttökorjauksia**, eivät uuden ravinto-/GI/GK-lähdelaskennan muutoksia.

- `yrttituorejuusto-kinkkurullat`: `servings: 4` ja `docs/nutrition/calculations/yrttituorejuusto-kinkkurullat.json`-laskennan 4 annosta ovat keskenään oikein. Valmistusohjeen viimeinen "kahtena annoksena" oli virheellinen; julkisessa versiossa **"neljänä annoksena"**. Koska tämä on kylmä, kokoamalla valmistettava ruoka, virheellinen `cooking_method: kypsentäminen` muutetaan julkiseen versioon `kylmävalmistus`. Raaka-FI pysyy muuttumattomana. Alkuperäisen FI-tiedoston SHA-256: `e5649f6b71fb0131def0f4332f1522e4c96c4e90af5abeed947df8681ec25363`.
- `malesialainen-mee-goreng-aamunuudeleilla`: FI:n `main_ingredient: munanuudeli` oli ristiriidassa ainesluettelon ja laskennan kanssa (100 g *vehnänuudelia*, jonka Fineli-tietue on "NUUDELI, VEHNÄNUUDELI"; lisäksi 2 kananmunaa erillisenä ainesosana). Vain julkinen pääraaka-ainemetatieto muutetaan muotoon **`vehnänuudeli`**, EI koko nuudeliraaka-aineen määrää tai profiilia. Raaka-FI SHA-256: `0fe3c4d4d2a129da4bc8fda84df1c9b96c501f1fdd5ee6be2733edc9f69e515d`.

Kummassakaan ei muuteta `servings`-arvoa, punnittuja aineksia, ravintoarvoja, GK80/GK100/GI/GK-ketjua eikä kuvapolkuja. Regressiotestit varmistavat kummankin alkuperäisen SHA:n ja laskentaketjun identiteetin. `site/scripts/fi-breakfast-quality-display.ts` tekee vain yksittäiset, yksiselitteiset näyttökorjaukset tai pysäyttää suoritusketjun. Käännösversiot näille kahdelle tulevat vasta erilliseen kielikatselmointiin; tässä PR:ssä ei lisätä käännöksiä.

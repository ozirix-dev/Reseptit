# D30 FI-näyttökorjaus – minttupuuron täysmaito

Päivä 10.11.2026, päähaaran lähtö-SHA `efc8ce70fcac2ba5961e3aea528c522116ec5599`.

Laskentatiedostossa `docs/nutrition/calculations/pohjoisafrikkalainen-minttutee-kaurapuuro.json` 200 g:n `maito`-raaka-aine viittaa nimenomaisesti Finelin täysmaitoon **fineli-689-release-20**, `MAITO, TÄYSMAITO, D-VITAMIINIA 1 UG` (rasva 3,5 g/100 g). Kanonisen FI-reseptin valmistusohjeessa on jo täysmaito, mutta ainesosaluettelon nimike on väljä `maito`. Julkisessa FI-näyttöversiossa muutetaan vain tämän 200 g:n erän `item: maito` -> `item: täysmaito` ankkurilla ja raaka-FI-tiedoston SHA256-lukolla.

Tämä **ei** muuta alkuperäistä FI Markdownia, punnittuja 200 g, annoksia, ravintoarvoja, makeutusta, syötäviä 6 g mintunlehtiä eikä laskennan GI/GK-/GK80-sinettejä. Näyttökerroksen tilasta ei saa päätellä, että raaka-FI olisi hyväksytty uudelleen tai GK laskettu uudelleen. Testi varmistaa alkuperäisen Fineli-tietueen, tarkan lähde-SHA:n sekä julkaistun FI-rakenteen.

[PR #386](https://github.com/ozirix-dev/Reseptit/pull/386) on yhä käännösluonnos. Sen EN- ja TH-aineksien väljä `milk`/`นม` tarkennetaan saman täysmaitolähteen mukaisiksi **erikseen** ennen kieliversion julkaisuvalmiutta. Ruotsin nykyinen `helmjölk` on oikein. Ei julkaisulupaa 386:lle tästä PR:stä.

Pagesin aiempi `syncing_files`-este on erillinen: [issue #387](https://github.com/ozirix-dev/Reseptit/issues/387). Buildin tai PR-CI:n vihreys ei ole deployment-SUCCESS-todistus.

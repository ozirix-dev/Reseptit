# GK-006 — GI-lähteiden tutkimusluokittelu 02

Tila: **AUDIT / ei runtime-migraatio / ei uusi käyttölupa**. Omistaja Chat-3, riippumaton katselmointi Chat-2, integraatio Chat-1. Päiväys 25.11.2026.

## Tarkoitus ja lähdeasema

Tämä uusi tutkimuspaketti kokoaa #982:n kolme lähderaporttia (20 + 8 + 17 erillistä ID:tä). Se ei ole uusi primäärilähteiden varmennuskierros. Varmennussyvyys on korttikohtainen ja perustuu raportoituihin havaintoihin. Lähdepolku, Git-blob ja ID sitovat kortin tarkkaan lähtörekisteriin; nämä eivät ole runtime-evidenssihasheja. 45/45 tarkoittaa käsiteltyjä puuttuvan evidenceKindin kortteja, ei 45 täydellistä primääriprotokollaa. 19 valmiiksi luokiteltua korttia eivät kuulu tähän pakettiin.

- `source-classifications.json`: kortit, lähdeviitteet, löydökset, rajaukset ja osittainen historiallinen vaikutusnäyttö.
- `artifact-manifest.json`: tiedostojen LF-SHA-256-sinetit.
- `verify.py`: valinnainen vain luku -tarkistus; ei uusi CI-portti.

Säilytä `gi-source-integrity-01` muuttumattomana. Tämä paketti ei ole sen admission.py:n syöte. Tutkimuslaajennukset MULTIPLE_TEST_OBJECTS (useita testituotteita) ja UNASSESSED (soveltuvuutta ei määritetty) ovat sidecar-käsitteitä, eivät tuotannon enum-arvoja. HUMAN_MEASURED_METHOD_UNCONFIRMED voi tarkoittaa myös ihmismittauksista johdettua koontiarvoa; aggregationKind erottaa nämä. SECONDARY_ILLUSTRATION/UNASSESSED ei väitä ihmis- tai in vitro -mittausta. PRIMARY/compilation publication -kentät tarkoittavat raportoitua tietoa; MIX_UNASSESSED ei todista kaikkien komponenttien julkaisutilaa. Rekisterin alkuperäiset tiedot säilytetään registrySnapshotissa sellaisinaan. Null tarkoittaa puuttuvaa arvoa (tai tässä valikoidussa näkymässä puuttuvaa kenttää), ei nollaa tai lupaa. Ryhmän observationCount ei ole henkilömäärä; SD/SE/SEM ja mitattu vaihtelu eivät ole reseptin biologisia ennustevälejä.

## Käyttö

Aja repon juuresta `python docs/research/gi-source-integrity-02/verify.py` pinnatulla tai sisällöltään vastaavalla rekisterillä. Tuntematon lähtöblob tai muutettu tutkimussinetti hylätään. Myöhemmälle rekisterille tarvitaan uusi versio tai erillinen tarkastettu siirtymä, ei vanhojen sinettien uudelleenkirjoitus. Tarkistin ei tee tieteellistä hyväksyntää.

Ennen mahdollista aktiivisen rekisterin muutosta: tee nykyisen työpuun SQLite capture/source/impact/map ja variantti- sekä range-sidosten täydellinen inventaario; arvioi lähdekohtainen muutos, laske ennen/jälkeen fingerprintit, tee riippumaton katselmointi sekä kanoniset ravinto-, GK-, historia-, käännös- ja julkisen näytön testit. Ei massalisäystä evidenceKind/matchKind-kenttiin, ei automaattista uudelleensidontaa eikä uuden käytön lupaa. Alkuperäisen 326 reseptin syötteen historialliset viittausluvut ovat raportoitua osittaista näyttöä, eivät nykyisiä julkaistuja GK-arvoja. Tämän kokoamisen aikana ei ole tehty canonical capturea.

Lähteet: [erä 1](https://github.com/ozirix-dev/Reseptit/pull/982#issuecomment-7156831265), [erä 2](https://github.com/ozirix-dev/Reseptit/pull/982#issuecomment-7158510764), [erä 3](https://github.com/ozirix-dev/Reseptit/pull/982#issuecomment-7158809342). Tarkemmat alkuperäiset lähdepaikantimet ja varmennusrajat ovat raporteissa ja korteissa.

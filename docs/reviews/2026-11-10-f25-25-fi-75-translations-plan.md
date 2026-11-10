# F25 – uusi 25 FI-reseptin / 75 kieliparin laatulukittu erä

Päivä 10.11.2026. Lähtö-main `e1136a3fa94da8923b2d3f8d950c5416c8a3583f`. Lähtökohdaksi vahvistettiin E20:n täsmä-HEADin vihreä CI ja PR #398:n yhdistämis-SHA:n onnistunut Pages build/deploy. E20 [#396](https://github.com/ozirix-dev/Reseptit/pull/396) säilyy erillisenä Draftina eikä julkaisuporttia kierretä.

**Tavoite:** 25 keskenään erilaista, ennen tätä EN/SV/TH-käännöksiä vailla olevaa FI-reseptiä × 3 kieltä = 75 kieliversiota. Tämä erä on E20:n 20 reseptin erää 25 % suurempi. Työjono sisältää 24 aamupalaa + yhden pääruoan; ryhmittely on tehty kielitiedostojen puuttumisen perusteella.

**Tarkastettu ehdokasjoukko:** lähteet ovat julkaistuja suomenkielisiä rakenteisia reseptejä; kaikille on tallennettu lähde-Git-blobin SHA. Käännöshaun mukaan valituista puuttuvat EN, SV ja TH kokonaan. Alkuruokien 8 ja pääruokien useat puuttuvat tiedostot olivat pelkkiä otsikkopaikkamerkkejä eikä niitä laskettu tähän erään.

**Ensiseulonta:** 4 reseptiä ilman automaattisesti tunnistettua geneeristä ohjerunkoa odottaa kokki- ja ravintokatselmointia; 21 lähdettä on SOURCE-HOLDissa. Valinta ei tarkoita julkaisuhyväksyntää. Suurimmat esteet ovat väärän ruokalajin geneeriset valmistusohjeet, ainesluettelon ulkopuoliset lisäykset, epäselvät kpl→gramma-muunnokset ja paikoin puuttuvat neljän makron laskentakentät.

## Työmenettely ja CI-portti

1. [Täsmälähdeluettelo](../../meta/kaannokset/f25-source-worklist.json) lukitsee 25 Git blob-SHA:ta. Kaikilla `release_authorized: false`, ja koko erällä `release_authorized: false`.
2. Yleinen `site/scripts/translation-source-preflight.mjs` tarkistaa jokaisen SHA:n, kanonisen FI:n, valmistusvaiheet, geneerisen mallin ja estojen perustelut. PR-CI ajaa F25:n esitarkistimen. Sekään ei korvaa ihmisen kieli-/ravintokatselmointia.
3. Ensin lähteen keittiölaatu ja mahdolliset punnitukset sekä tarvittava ravinto/GK-uusintalaskenta. Ohjeita saa täsmentää ilman turhia lisäaineksia, mutta semanttisia lähdesinettiä ei muokata huomaamatta.
4. Käännetään ensin vain lähde- ja määrärakenteeltaan tarkistetut reseptit; alkuversiot `status: draft`, ei kielirekisteriä eikä `codex-review-evidence`-PASS-todistetta.
5. Julkaisu erillisellä **main-pohjaisella release-PR:llä** vasta, kun täsmä-HEADin testit ja review-evidenssi ovat kunnossa. Merkitään aina erikseen merge-SHA:n Pages build/deploy.

F25-erässä ei julkaista nyt 75 uutta käännöstä. Laatutavoite on 25 hyväksyttyä lähdettä, ei 25 väkisin täytettyä lähderiviä; jos lähde jää HOLDiin, sitä ei julkaista. Eräkoko koskee työjonoa, ei julkaisulupaa.

## Ensimmäinen Draft-erä

Eri kielillä laadittu **6/75 Draft-tiedostoa kahdesta FI-lähteestä**: maakouda + karibialainen ruokabanaanilautanen. [Kieliversioiden sisältö ja riskit](2026-11-10-f25-two-source-six-language-drafts.md). 4 jatkokatselmointiin / 21 SOURCE-HOLD -tilaa ei muutu. Julkaistu F25:sta edelleen 0.

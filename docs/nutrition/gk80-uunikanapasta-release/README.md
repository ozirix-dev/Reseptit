# Uunikanapastan rajattu tuotantointegraatio

Tämä main-pohjainen haara toteuttaa yhden omistajan julkaistavaksi pyytämän AFCD-RECOVERY-03-version. Ehdokaskattavuus on **131/326 (40,18 %)**. Julkaisua ei merkitä toteutuneeksi ennen guardin mergeä, automaattista main-CI:tä/Pages-deployta ja tuotantovarmennusta.

## Hyväksynnän alkuperä ja tarkka versio

Omistajan ohje **“Julkaise”** saatiin heti täsmällisen recovery03-päätösesityksen jälkeen. Ohje koskee tässä toteutuksessa vain `uunikanapasta-kesakurpitsa`-reseptin neljän annoksen punnittua tuorevalkosipuli-/basilikaversiota, sen esitettyjä lähde-/GI-sidoksia ja nimettyä ehdollista mallia. [approval.json](approval.json) kirjaa ohjeen ja rajauksen. Guardin uusi PR-kohtainen merge-vahvistus kysytään valmiille integraatiolle erikseen.

- Omistajalle esitetty ehdotusfingerprint: `e1f620de4ef73f347ddff4c14e41dadb1acf9b8282b7761404865491b415cc07`.
- Alkuperäinen tutkimusfingerprint: `d09c61c2d3796efe1a04add86966c20b1affd00414ac8e0834b5eb7db2b766ae`.
- Muuttumattoman tutkimustapauksen fingerprint: `ba3cb85ba2d94392baeeb4b451f9e8afea004cc92c6da11d6ca9e762bb283ff2`.
- Koko uuden integraatioevidenssin fingerprint: `b3c8d086f15b997937000cf4f42175a122f3f7cf2fd99c61d2783e2dc59668d7`.

Tutkimus-PR164 HEAD `e496a1b5581037d3d910c0119a235cc7045dbbbb` jää erilleen. Sen muuttumattomien snapshotien false/pending-liput kuvaavat alkuperäistä tutkimusvaihetta. Niitä ei kirjoiteta jälkikäteen hyväksytyiksi. Uusi suljettu runtime-evidenssi ja yllä kirjattu myöhempi omistajan ohje muodostavat tämän yhden integraation perusteen.

## Toteutettu käyttäytyminen

| /annos | Näyttö |
| --- | --- |
| Netto-CHO |7,4 g|
| Kokonais-CHO |10,4 g|
| Proteiini |39,53 g|
| Rasva |23,91 g|
| GK |Mallinnettu noin3, LOW|

Reseptin kaikki10 ainesosariviä,4 annosta,3 valmistusvaihetta, raakojen syötävien osien määrät, nesteiden/rasvojen säilyminen ja puhdas ruokasuola on sidottu koko suomenkieliseen tiedostoon. Nykyisessä mainissa reseptillä on vain suomenkielinen julkaistu versio; uusia kieliversioita ei luoda.

Broilerin rintafileelle käytetään Fineli11565:n versionoitua profiilia, valkosipulille393:n ja tuoreelle basilikalle11134:n lukittuja verkkotaulukkoarvoja. Valkosipulin uusi raaka-/valmistus-/GI40-alias ja basilikan vastaava GI50-alias lisätään. Basilikan runtime-GI-kortti sallii vain uuden täsmällisen koostumustunnuksen tässä suljetussa tapauksessa; muiden julkaisupakettien GI-kortteja ei muuteta. Tomaatti- ja maitotuoteproxyjen rajaukset säilyvät.

Mustapippurin kokonaispolyoli pysyy `null`-arvona; with/without-parin tunnettu osasumma0 ei muutu mitatuksi kokonaispolyoliksi. Raaka koko reseptin GK-piste on `null`. Näkyvä3 johdetaan koko kolmen skenaarion vakaasta pyöristyksestä. Suolan massa jää tuntemattomaksi, ei nollaksi.

Suljettu `gk80-uunikanapasta.ts` hyväksyy vain yllä olevan koko evidenssihashin ja yhden resepti-ID:n. Se käyttää nykyisiä koostumus-, GI-, ruoka- ja valmistustarkistimia, tarkistaa uudelleen koko reseptin aritmetiikan, tuntemattoman polyolin skenaarion sekä neljän makron ja GK:n näyttövakauden. Ainesosa-, lähde-, määrä-, annos-, valmistus- tai hyväksyntämuutos sulkee polun. Tavallista ravintolaskentamoottoria tai globaaleja näyttötarkkuuksia ei muuteta; normaali polku hylkää puuttuvat polyolit edelleen. Vain tämä evidenssityyppi ohjataan erilliseen tarkistimeen. Sisältö- ja ravintoauditit sekä GK-julkaisu tarkistavat lisäksi koko reseptitekstin hashin.

Konservatiivinen lähdeskenaario: netto7,381250–7,387250; kokonais10,374250–10,444250; proteiini39,527500–39,533500; rasva23,908125–23,914125 g/annos ja GK2,736325–2,826025. Koko GK-leveys on0,0897, alkuperäisen kiinteän lähdemallin0,042. Kaikki kolme jo esitettyä skenaariota tarkistetaan. Kahden verkkotaulukon näyttöherkkyys, tuntemattoman polyolin malli ja biologinen/analyyttinen epävarmuus pidetään erillään. Vastealue0–150 ja leveysbudjetti0,10 eivät ole todistettuja luonnontieteellisiä virherajoja. Matala luottamus ja tämän version rajaus näkyvät reseptillä ja neljän kielen keskitetyillä GK-sivuilla.

## Varmennus

[verification.json](verification.json) tallentaa näytön:210 yksikkötestiä,25 staattista testiä ja27 käännöstestiä PASS; strict nutrition audit0 ristiriitaa; TypeScript ja muuttuneen yhden reseptin sisältötarkistus PASS. Build tuotti691 reittiä. Uusi riippumaton Decimal tarkistaa yhden asennetun tapauksen kaikki kolme skenaariota.

**Nykyisestä326 tuloksesta muuttuu täsmälleen yksi. Kaikki325 muuta kokonaista tulosobjektia ja kaikki130 aiempaa numeerista arvoa säilyvät täsmälleen mainin mukaisina.** Teehaudutetut munat ja PR156:n kaksi reseptiä jäävät ilman numeerista GK:ta. Keto-suklaakeksien ja keto-mutakakun neljän ravintoarvon pidätykset sekä historiallinen evidenssi säilyvät. Muiden PR153-reseptien tai ReportHubin muutoksia ei ole mukana.

Vanhojen julkaisuerien historiatesteihin lisättiin vain uuden uunikanapastamuutoksen ennen-integraatiota tallennettu main-snapshot. Alkuperäisiä Golden-/baseline-aineistoja ei muuteta. Uusi nykytilan326-objektin regressio tarkistaa oikean uuden raportin ilman historiakerroksia. Samalla korjattiin mainissa jo ollut testiodotus, joka odotti PR162:ssa pidätettyjen kahden keto-reseptin vanhoja nettohiilihydraatteja. Sama virhe toistettiin erikseen puhtaassa mainia vastaavassa työpuussa; tuotannon pidätystä ei ohiteta.

Ei uutta tutkimusajoa, PR153/#156/#161/#164-muutoksia tai ReportHub-muutoksia. Guardin Ready/merge, normaali Codex Review, automaattinen tarkka-HEAD-CI sekä mergen jälkeinen main-CI, Pages ja tuotannon131/326-varmennus ovat tämän integraation julkaisuvaiheet. Alkuperäinen main on `88e228bbb1f0fa4a4e16be4aeedcd509bc7bc33a`.

## Codex-katselmoinnin testirekisteröinti

Viisi uutta testiä on rekisteröity suoraan `site/package.json`-tiedoston `npm test`-komentoon. Ne suoritettiin ensimmäisessä versiossa `gk80-combined.test.ts`-importin kautta; tämä välillinen import poistettiin, jotta testit ajavat kerran ja CI-kytkentä näkyy suoraan. Uusi täydellinen yksikköajo varmistaa edelleen210 testiä. Resepti, laskentaevidenssi ja hyväksyntäfingerprintit eivät muutu.

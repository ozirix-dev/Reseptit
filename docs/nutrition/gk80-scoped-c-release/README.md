# GK80 — kaksi hyväksyttyä C-tapausta nykyisen mainin rinnalle

**Julkaisu-Draft, ei Ready-, merge- tai deploylupaa.** Tämä erä sovittaa PR156:n kaksi täsmällistä hyväksyttyä C-tapausta suoraan mainiin `ec7f4b01e6fa86cc6a45308286cf32e776e91e88`. Se ei yhdistä vanhaa PR156-haaraa eikä sisällä muita tutkimuseriä tai ReportHub-muutoksia.

## Katselmoitava erä

| Täsmällinen punnittu versio | Annoksia | Mallinnettu GK/annos | Netto-CHO | Kokonais-CHO | Proteiini | Rasva | GK-skenaarion koko leveys |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Jauheliha-kaalikeitto VHH |6|noin5 LOW|10,21 g|12 g|17,68 g|15,26 g|0,058|
| VHH-kaalilaatikko |6|noin4 LOW|9,52 g|13 g|20,86 g|30,65 g|0,086|

**Ehdokaskattavuus133/326 =40,80 %. Julkaistu lähtötaso on131/326.** Tämä Draft ei vielä muuta tuotantoa.

Puuttuvat mausteiden kokonaispolyolit jäävät `null`-arvoiksi. Koko reseptin pyöristämätöntä GK-pistearvoa ei valita. Näkyvä arvo on sama koko erikseen hyväksytyssä lähdemallissa; kokonais-CHO näytetään kokonaisina grammoina. Mallin vastealue0–150 ja GK-leveysbudjetti0,10 ovat näiden reseptien hyväksyttyjä ehdollisia lähdemallioletuksia. Ne eivät osoita mitattua aterian vastetta tai biologista epävarmuusrajaa.

## Hyväksynnän alkuperä ja muuttumattomat hashit

Omistajan tämän tehtävän valtuutus on kirjattu [approval.json](approval.json)-tiedostoon. Se hyväksyy kahden C-tapauksen sovittamisen uuteen main-pohjaiseen julkaisu-Draftiin ja katselmoitavaksi tuomisen. Aiempi täsmällisten sisältöjen ja menetelmän hyväksyntä tulee [PR156:n päätöslokista](https://github.com/ozirix-dev/Reseptit/blob/d31c3a7ae157337177733375a9c7d811646187ee/docs/research/polyoli-03/approval-ledger.json), jonka lähdehash säilytetään uudessa päätöstositteessa. Vanhan PR:n aineistoja ei kirjoiteta uudelleen.

| ID | Muuttumaton koko evidenssin fingerprint |
| --- | --- |
| `jauheliha-kaalikeitto-vhh` |`7e16f21f52cc2365c6b1742d891542fb118b7b879b5bf73d88d5dbef361c0f2f`|
| `vhh-kaalilaatikko` |`57540a15a0e29a4fc6c7cdfe83dfbaa8f59222a0dd48ad77f75c96cf36d82235`|

Lähde on PR156 HEAD `d31c3a7ae157337177733375a9c7d811646187ee`. Molemmat laskentaevidenssit sekä kaksi suomenkielistä ja kuusi käännettyä reseptitiedostoa vastaavat hyväksyttyjä lähdeversioita. Kaikkien kahdeksan version hashit on kirjattu tositteeseen. Reseptejä tai niiden sisältämiä lähde-/GI-kortteja ei muokattu sovituksen vuoksi. Evidenssin historialliset pending-sanamuodot kuvaavat lähdekortin laatimisvaihetta; niitä ei muuteta sinetin rikkomiseksi. Käyttöönoton rajaus perustuu myöhempään täsmälliseen omistajapäätökseen ja suljettuun tarkistimeen.

Käännösten hyväksytyt versiot säilyvät; tässä ei väitetä tehtyä uutta riippumatonta ihmisen kielikatselmointia.

## Yhteensovitus nykyiseen mainiin

- Erillinen `site/scripts/gk80-polyol-c.ts` hyväksyy vain yllä olevat kaksi koko evidenssin fingerprintiä ja kuuden annoksen versiot. Muuttunut määrä, valmistus, lähde, GI, näyttötarkkuus tai tuntemattoman polyolin käsittely sulkee polun.
- Nykyinen uunikanapastan recovery-polku, sen resepti/evidenssi/apumoduuli ja kaikki131 numeerista lähtötulosta säilyvät. Kahden uuden C-tapauksen käsittely tapahtuu sen jälkeen erillisessä vaiheessa. Tavallinen ravintolaskentamoottori ei saa polyoliohitusta.
- Nykyisiin ravintoevidenssi-, auditointi- ja muuttuneen sisällön tarkistuksiin lisätään erillinen C-haara. Keto-suklaakeksien ja keto-mutakakun pidätyskäsittely säilyy.
- Katalogiin lisätään vain hyväksytty Norjan kuivatun jauhetun meiramin `NO06.186`-sidos. Uunikanapastan tuoreen valkosipulin/basilikan sidoksia ja muita olemassa olevia rivejä ei korvata. Nakkikeiton aliaksia ei lisätä.
- Batch87 sisältää vain nämä kaksi hyväksyttyä tapausta. Uunikanapastan batch88 säilyy; PR153:n ristiriitaista20 reseptin batch87:ää ei kopioida.
- Reseptisivujen ja keskitettyjen GK-sivujen neljän kielen LOW-/lähdemalliselosteet ohjataan vain validoidun `boundedPolyolC`-merkinnän perusteella. Nykyinen `closedRecoveryC`-seloste säilyy erillisenä.
- Uusi testitiedosto on rekisteröity suoraan `npm test`-komentoon. Vanhojen erien historiatestit palauttavat vain nämä kaksi tapausta nimettyyn ennen-integraatiota olevaan näkymään; historiallisia Golden- tai baseline-tiedostoja ei kirjoiteta uudelleen. Uusi nykytilan326-objektin regressio käyttää todellista raporttia ilman historiakerroksia.

Ropa vieja, siskonmakkarakeitto, nakkikeitto, teehaudutetut munat sekä molemmat keto-leivonnaiset pysyvät GK-HOLDissa. Kahden keto-leivonnaisen kaikki neljä ravintoarvoa pysyvät pidätettyinä. PR153, alkuperäinen PR156 ja muut tutkimus-/raporttihaarat säilyvät muuttumattomina.

## Varmennus

[verification.json](verification.json) tallentaa paikallisen näytön:

- 326 tulosobjektia; täsmälleen kaksi yllä olevaa ID:tä muuttuu.
- 324 muuta kokonaista objektia ja kaikki131 aiempaa numeerista tulosta säilyvät samoina kuin tuore main131-baseline. Uunikanapastan GK noin3 säilyy.
- 24/24 kohdennettua testiä PASS: kaksi hyväksyttyä C-tapausta, muuttuneen evidenssin ja valmistuksen hylkäys, muut HOLDit, rajat, ravintoevidenssi, uunikanapastan säilyminen ja todellinen nykytilan regressio.
- Riippumaton Decimal tarkistaa kaksi asennettua sinetöityä evidenssiä kohdennetun testin osana. Uunikanapastan olemassa oleva Decimal-testi läpäisee samassa testiryhmässä.
- LOW-/lähdemalliselosteet löytyvät kaikilta kahdeksalta reseptisivulta ja neljältä menetelmäsivulta.
- Muuttuneen sisällön tarkistus PASS:8 reseptitiedostoa,2 laskentaevidenssiä ja2 resepti-ID:tä. Strict nutrition audit:0 ristiriitaa.
- Yksi paikallinen julkaisubuild, TypeScript mukaan lukien:691 reittiä.25 staattista/SEO-testiä PASS. Kokonaisbuild on tarpeellinen muuttuneen runtime-/render-polun vuoksi.

`main-baseline.json` perustuu jo olemassa olevaan puhtaan PR165-julkaisutyöpuun raporttiin. Sen Git-puu vastaa täsmälleen mainin `ec7f4b01…` puuta; aiempaa lähtötilaa ei laskettu uudelleen. `historical-source-text.json` ja baselineen poimitut kaksi vanhaa tulosta ovat vain nimettyjen historiatestien lähtötilaa.

Runtime-/render-muutos valitsee normaalin laajan automaattisen PR-CI:n. Sen tarkka HEAD, tulos ja linkki raportoidaan PR-tarkistuksissa sekä loppuviestissä; ei HEADia vaihtavaa dokumentointicommittia CI:n jälkeen. Paikallista koko yksikkö-, selain-, kuva- tai käännöstestistöä ei ajeta tämän lisäksi. Ei manuaalista Actions- tai Codex-katselmointipyyntöä. PR-CI ei julkaise tuotantoon.

Toisto buildin jälkeen `site`-hakemistossa:

```powershell
node --import tsx --test tests/gk80-polyol-c.test.ts tests/gk80-uunikanapasta.test.ts tests/gk80-combined.test.ts tests/nutrition-evidence.test.ts
```

## Katselmointiraja

Tämä Draft tuo katselmoitavaksi vain kahden aiemmin hyväksytyn tapauksen uuden main-yhteensovituksen. Nykyinen omistajapäätös ei valtuuta Ready-siirtymää, mergeä tai deployta. Tuotanto pysyy131/326:ssa siihen asti, kunnes erillinen julkaisu on oikeasti hyväksytty ja varmennettu. ReportHub jää erilleen.

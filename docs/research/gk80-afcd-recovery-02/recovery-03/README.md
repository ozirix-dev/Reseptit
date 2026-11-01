# AFCD-RECOVERY-03 — yhden reseptin näyttötarkkuuden päätösesitys

**Vaihtoehto A — CONDITIONAL GO vain omistajan nimenomaiseen menetelmä- ja sisältökatselmointiin.**

Yhden desimaalin netto-CHO7,4 g ratkaisee alkuperäisen7,38 g:n näyttövakauden ongelman kaikissa jo dokumentoiduissa lähdeskenaarioissa. Muut ehdotetut neljän makron arvot ja mallinnettu noin GK3 /annos säilyvät vakaina. Tämä on uusi tarkkuusehdotus; se ei hyväksy lähteitä tai menetelmää eikä aktivoi prototyyppiä. Tuotannon uunikanapasta pysyy HOLDissa.

## Lukittu ehdotus ja näyttöarvot

Kohde on vain `uunikanapasta-kesakurpitsa`,4 annosta, PR153:n täsmällinen punnittu tuorevalkosipuli-/basilikaversio. Uusi [proposal.json](proposal.json) viittaa koko muuttumattomaan PR164-tapaukseen ja sen lähde-/syötehashikokonaisuuteen.

| /annos | Konservatiivinen aiemmin tarkistettu alue | Uusi näyttöehdotus | Desimaaleja |
| --- | --- | --- | ---: |
| Netto-CHO |7,381250–7,387250 g|**7,4 g**|1|
| Kokonais-CHO |10,374250–10,444250 g|**10,4 g**|1|
| Proteiini |39,527500–39,533500 g|**39,53 g**|2|
| Rasva |23,908125–23,914125 g|**23,91 g**|2|
| GK |2,736325–2,826025|**Mallinnettu noin3 /annos, LOW**|0|

Uusi ehdotusfingerprint: `e1f620de4ef73f347ddff4c14e41dadb1acf9b8282b7761404865491b415cc07`. Se on **hyväksymättömän ehdotusversion** tunniste, ei hyväksyntämerkintä. Alkuperäinen PR163:n tutkimusfingerprint `d09c61c2d3796efe1a04add86966c20b1affd00414ac8e0834b5eb7db2b766ae` ja PR164:n tapauksen fingerprint `ba3cb85ba2d94392baeeb4b451f9e8afea004cc92c6da11d6ca9e762bb283ff2` säilyvät. Mitään alkuperäistä case-/lähde-/Decimal-/prototyyppitodistetta ei muuteta jälkikäteen. Vanha prototyyppi toistaa edelleen vanhan7,38-ehdotuksen HOLDin.

## Vastaukset kuuteen tarkkuuskysymykseen

**1. Kyllä, koko jo dokumentoiduissa skenaarioissa.** Python Decimal tarkisti erikseen kiinteän lähdemallin sekä lähimpään pyöristyksen ja konservatiivisen näyttöyksikön herkkyystarkastelun:3 skenaariota×5 kenttää. Molemmat päätepisteet pyöristyvät kunkin kentän yllä esitettyyn arvoon. Positiivisen luvun pyöristys on monotoninen, joten myös jokainen sisäpiste antaa saman näytön. GK:n raaka-arvot pysyvät LOW-luokassa, enintään10, ja skenaarioleveydet0,042 /0,065850 /0,089700 pysyvät nimetyssä0,10-budjetissa. Tämä ei laajenna skenaarioita uusiin tuotteisiin tai biologiseen vaihteluun.

**2. Kyllä, yksi desimaali on netto-CHO:lle tässä perustellumpi.** Kahden uuden verkkotaulukon käytettyjen makrojen näyttöaskel on0,1 g/100 g ja niitä käytetään kumpaakin6 g /4 annosta. Rajattu pyöristysherkkyys vie netto-CHO:n kahden desimaalin pyöristysrajan7,385 yli:7,38 ja7,39 ovat molemmat mahdollisia. Koko konservatiivinen väli7,381250–7,387250 on yhden desimaalin7,4 pyöristysalueella[7,35;7,45). Uusi esitystapa ei lisää lähdetiedon tarkkuutta, valitse polyolimäärää tai muuta lähtölukuja.

**3. Kyllä, sama kenttäkohtainen vakausperuste tukee proteiinin ja rasvan kahta desimaalia.** Yhtenäisyys tarkoittaa samaa vaatimusta jokaisen kentän koko skenaarioalueelle, ei samaa desimaalimäärää kaikille ravintoaineille. Proteiinin alue39,527500–39,533500 sisältyy39,53:n pyöristysalueeseen[39,525;39,535); rasvan23,908125–23,914125 sisältyy23,91:n alueeseen[23,905;23,915). Kokonais-CHO tarvitsee yhden desimaalin, koska sen alkuperäinen skenaario ei ollut vakaa kahdella. Muiden kenttien alkuperäisiä tarkkuuksia ei lisätä. Kahden desimaalin säilyminen osoittaa vain ehdollisen mallin tulostusvakauden; se ei osoita0,01 g:n mittaus- tai tuotetarkkuutta. Muut kuin kaksi tarkkuusauditoitua verkkoprofiilia pysyvät tässä mallissa kiinteinä.

**4. Näiden numeroiden tallentaminen ja näyttäminen eivät vaadi käyttöliittymän tai tietoskeeman muutosta. Julkaisu vaatii erillisen rajatun integraation.** Nykyiset numeeriset skeemakentät hyväksyvät7.4/10.4/39.53/23.91. `nutrition-markdown.ts` sallii enintään kaksi desimaalia, joten7.4 hyväksytään nykyisellään. `RecipePage.tsx` käyttää `formatIngredientAmount(value,1,1,locale)`-funktiota; sen enintään kahden desimaalin formatteri näyttää suomeksi7,4 /10,4 /39,53 /23,91 ilman pakotettua loppunollaa. Tämä tarkistettiin nykyisillä funktioilla vain muistissa, muuttamatta reseptitiedostoa.

Nykyinen yleinen `nutrition-model.calculate` vaatii tunnetut polyolit ja palauttaa normaalit summat oletuksena kahteen desimaaliin. `verifyNutritionEvidence` vertaa julkaistuja ja laskettuja arvoja täsmällisesti eikä tunne tätä hyväksymätöntä C-tapausta. Se hylkää nykyisen ehdotuksen edelleen, eikä pelkkä metadatan7.38→7.4-muutos ole julkaisutoteutus. Myöhempään integraatioon tarvitaan hyväksyttyyn fingerprintiin sidottu tämän yhden tapauksen tuloksen ja näyttötarkkuuden tarkistus sekä nimenomainen kytkentä evidenssi- ja GK-polkuun. PR156 on esimerkki erillisestä suljetusta sovelluksesta; sen hyväksyntää tai koodia ei yhdistetä nyt. Tavallista laskentamoottoria, yleistä validaattoria tai globaalia pyöristystä ei muuteta tässä ajossa. Yleisen tarkkuuskäytännön löysennystä ei tarvita.

**5. Kyllä, tarkkuus voidaan sitoa vain tämän reseptin yksilöityyn evidenssiin.** Uusi ehdotus sitoo näyttöarvot, desimaalimäärät ja kaikki kolme herkkyystarkastelua alkuperäiseen kokonaispakettiin, lähteisiin ja valmistustekstiin. Se ei muuta toisten reseptien sääntöjä tai aktiivista sallittujen reseptien joukkoa. Muuttunut raaka-aine, lähde, massa, annos tai valmistus vaatisi uuden koko version tarkistuksen ja päätöksen.

**6. Omistajapäätöstä ja toteutusta vaativat ehdot jäävät näkyviksi.** Tarkkuuskysymykseen ei tarvita uutta koostumuslähdettä. Kokonaisarvion käyttöönotto vaatii silti seuraavat nimenomaiset päätökset; ne eivät ratkea näyttöä pyöristämällä:

| Ehto | Täsmällinen rajaus ja nykyinen tila |
| --- | --- |
| Fineli11565 | Raaka nahaton broilerin rintafilee,500 g; nykyinen versionoitu Release20-profiili kaikkine viisine koostumuskenttineen. Uusi lähdesovellus odottaa tämän version sisältöpäätöstä. |
| Fineli393 | Tuore kuorittu valkosipuli,6 g, nykyinen lukittu päätaulukko; ilmoitettu POLYL0 on summattu, ei koko lajiston täydellisen mittauksen todiste. Tarkka raaka-/valmistussidos nykyiseen GI40-sovellukseen tarvitsee oman alias-hyväksynnän. |
| Fineli11134 | Tuore basilika,6 g, lukittu päätaulukko. Ilmoitettu POLYL0 on johdettu. GI50:n matalan CHO:n sovelluksen5 g/100 g -ehto täyttyy myös1,2:n herkkyysylärajalla, mutta uusi koostumus ei kuulu vanhan GI-kortin sallittuihin tunnuksiin. Alias ja nimenomainen uusi koostumussidos vaativat hyväksynnän. |
| AFCD F006618 | Mustapippuri0,5 g; kokonaispolyoli ja raportoimattomat lajit pysyvät tuntemattomina. With/without-parin osasumma0 ei todista kokonaispolyolin nollaa. Hyväksyttäväksi esitetään vain tämän koko reseptin ehdollinen jäännös-/vastekerroinskenaario. |
| Muut ainesosat | Kesäkurpitsa500 g, kirsikkatomaatit200 g tavallisen tomaatin nimetyllä proxylähteellä, maustamaton tuorejuusto11 %150 g, kerma38 %100 g ja nimetty puolikova juustoprofiili100 g. Proxyt ja tuotekohtaiset rajaukset sisältyvät omistajan sisältöpäätökseen. |
| Valmistus | Lukittu tuoreyrttiversio,4 annosta, kaikki syötävät nesteet ja rasvat mukana, retentio1 mallioletuksena. Puhdas ruokasuola maun mukaan; suolan massa pysyy nullina. Ei kuivattujen yrttien alkuperäisen tuotantoversion samaistamista tähän. |

Kolme eri asiaa pidetään erillään: verkkonäytön ehdollinen pyöristysherkkyys; todellinen analyyttinen/tuotekohtainen mittausepävarmuus, jota nämä rajat eivät kokonaan kuvaa; GI-imputoinnin ja tuntemattoman polyolin ehdollinen mallinnettu vaste. Kerroin0–150 ja budjetti0,10 eivät ole luonnontieteellisesti todistettuja virherajoja. Niiden hyväksyminen on nimettyä C-mallia koskeva omistajapäätös. Menetelmä ei anna uutta mitattua ateria-GI:tä tai yksilöllistä vaste-ennustetta.

## Rajattu varmennus ja tuotannon erillisyys

`verify-display.py` tarkistaa vanhojen Decimal-/prototyyppialueiden päätepisteet sekä uuden ehdotusfingerprintin, alkuperäiset lähde-/syötehashit, julkaisuestot ja tuotantopuiden muuttumattomuuden. Vain näyttöehdotus muuttuu; laskentalähteitä tai vanhaa7,38-evidenssiä ei kirjoiteta uusiksi. `verify-view.mts` käyttää nykyistä skeemaa, metadatan kirjoittajaa ja formatteria vain muistissa sekä varmistaa vanhan prototyypin ja tavallisen mallin hylkäyksen.

Neljä kohdennettua olemassa olevaa prototyyppitestiä PASS: julkaisuesto, basilikan rajaus, kaikkien326 vanhan tulosobjektin vertailu ja PR156:n kahden hyväksynnän muuttumattomuus. Muita reseptejä ei lasketa uudelleen. Tuotannon130/326 säilyy, uunikanapasta on edelleen ilman tuotannon GK-numeroa, ja keto-suklaakeksien sekä keto-mutakakun ravintoarvopidätykset säilyvät. PR153:n20 ehdokasta, PR156:n kaksi hyväksyttyä C-evidenssiä sekä PR161:n historia ovat muuttumattomia.

[verification.json](verification.json) sisältää rajatut tulokset. Ei uutta koko tietokannan GK-laskentaa, ravintomallin kokonaistestien uusintaa, buildia tai manuaalista Actions-ajoa. Yksi valmisteltu commit ja push samaan Draftiin; sen tavallinen automaattinen kevyt CI tarkistetaan lopulliselta HEADilta. CI ei aja tutkimusprototyyppiä, jonka kohdennetut tarkistukset tehtiin paikallisesti.

Toisto repon juuressa:

```powershell
python -I -X utf8 docs/research/gk80-afcd-recovery-02/recovery-03/verify-display.py
node --import ./site/node_modules/tsx/dist/loader.mjs docs/research/gk80-afcd-recovery-02/recovery-03/verify-view.mts
```

## Yksi päätösesitys omistajalle

**Esitetään hyväksyttäväksi vain uusi fingerprint `e1f620de4ef73f347ddff4c14e41dadb1acf9b8282b7761404865491b415cc07` ja sen alkuperäiseen pakettiin sidottu täsmällinen kokonaisuus:** netto-CHO7,4 g; kokonais-CHO10,4 g; proteiini39,53 g; rasva23,91 g; mallinnettu noin GK3 /annos, LOW. Päätöksen on katettava yllä nimetyt valmistus-, koostumusproxy-, lähde-, GI- ja polyolimallin ehdot sekä lähdetarkkuuden rajallinen merkitys.

Omistajan hyväksyntää ei ole vielä annettu. Tarkkuusperustelu mahdollistaa ehdotuksen katselmoinnin; se ei takaa oikeutta julkaista sen lukuja. Nykyiset `publicationEligible=false`, `productionEnabled=false`, `activationSupported=false` ja `productionGkOverride=null` säilyvät. Myöhempi hyväksynnän mukainen rajattu integraatio ja erikseen luvitettava julkaisu ovat omat vaiheensa. Ei uutta prototyyppiketjua, PR:ää, Readyä, mergeä, deployta, ReportHubia tai automaattista jatkoajoa. Pysähdytään tähän päätösesitykseen.

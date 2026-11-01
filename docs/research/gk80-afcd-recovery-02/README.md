# GK80 AFCD-RECOVERY-02 — pois käytöstä oleva uunikanapastaprototyyppi

**1.11.2026 — päätös HOLD.** Yhden reseptin tekninen prototyyppi onnistui. Netto-CHO:n alkuperäinen 7,38 g:n kahden desimaalin näyttö ei kuitenkaan pysy vakaana jo kahden uuden Fineli-verkkotaulukkoprofiilin pyöristysherkkyydessä. Tarkkuutta ei muuteta tämän esteen ohittamiseksi. Ei omistajan menetelmä-/sisältöhyväksyntää eikä julkaisuvaltuutusta.

## Lähtö-main ja lähdeversiot

Suoraan mainista `88e228bbb1f0fa4a4e16be4aeedcd509bc7bc33a`, oma worktree `D:/Projects/tmp/reseptit-gk80-afcd-recovery-02`, haara `codex/gk80-afcd-recovery-02`, repo_guard PASS. Lähde-PR:ien historiaa ei pinota eikä niiden sisältöä muuteta.

| PR | Käyttö | Varmennettu HEAD | Tila |
| --- | --- | --- | --- |
| [#163](https://github.com/ozirix-dev/Reseptit/pull/163) | Lukittu koko tutkimuspaketti | `961cdd9af906d71de8fb1d512bf385cceaecece0` | Draft |
| [#153](https://github.com/ozirix-dev/Reseptit/pull/153) | Punnittu tuoreyrttiversio | `b8ece7ee1e4b80fc26abeb9b94944514875188d7` | Ready;20 lähde-HOLDia ennallaan |
| [#156](https://github.com/ozirix-dev/Reseptit/pull/156) | Kahden hyväksytyn C-tapauksen arkkitehtuurivertailu | `d31c3a7ae157337177733375a9c7d811646187ee` | Draft, ei yhdistetä |
| [#161](https://github.com/ozirix-dev/Reseptit/pull/161) | Auditointihistoria, ei muutoksia | `6f09e0a4b4caaac17412f12b1f3dcc79d875f345` | Draft |

Omat lähdetyöpuut tarkistettiin puhtaiksi. Viimeisimmän15 chatin metatiedoissa ei näkynyt toista aktiivista Reseptit-ajoa; havainto ei kata kaikkia vanhoja chatteja. Sol/High on konfiguraatio-oletus; aktiivinen chatin valitsin ei näy työkaluille.

## Tekninen toteutus ja julkaisuesto

[prototype.mts](prototype.mts) on suoritettava, vain tämän tapauspaketin hyväksyvä tutkimusadapteri. Se käyttää nykyisen GK-ainesosamallin aritmetiikkaa, nykyistä ravintomallia ja nykyisiä ruoka-/valmistussidosten tarkistimia. Se ei muuta yleistä laskentamoottoria. Tuotannon sivusto, auditit tai build eivät tuo tätä tiedostoa. Tuotantoon asennettavaa calculation-/batch-/catalogue-merkintää ei synny.

- [case.json](case.json) sisältää alkuperäisen pilotin, kaikki10 ainesosariviä, yhdeksän koostumusprofiilia, neljä GI-korttia, annokset, valmistuksen, alkuperäiset proxyt sekä vain ehdotetut uudet sidokset. Aritmetiikan `coverageProposalEligible=false`.
- Alkuperäinen tutkimusfingerprint säilyy `d09c61c2d3796efe1a04add86966c20b1affd00414ac8e0834b5eb7db2b766ae`. Uuden koko integraatiopaketin fingerprint on `ba3cb85ba2d94392baeeb4b451f9e8afea004cc92c6da11d6ca9e762bb283ff2`. Kumpikaan ei tarkoita omistajahyväksyntää.
- Adapteri tarkistaa koko paketin koodiin sidotun fingerprintin ja PR153:n koko reseptitekstin SHA256:n. Mikä tahansa uusi resepti, muuttunut lähde, GI-kortti, massa, valmistus, annosmäärä, polyolimerkintä tai hyväksyntälippu mitätöi tapauksen.
- `publicationEligible=false`, `productionEnabled=false`, `activationSupported=false`, `productionGkOverride=null`. Aktivointikutsua ei ole; julkaisuvaltuutuksen tarkistus heittää aina virheen. Tätä prototyyppiä ei voi aktivoida muuttamalla JSON-lippua.
- Mustapippurin aggregate-polyoli ja puuttuvat yksittäiset lajit pysyvät `null`-arvoina. AFCD-kenttäparin osasumma0 ei muutu kokonaispolyolin arvoksi. Historiallisten alkuperäiskorttien väitteet säilyvät snapshotissa; pilotin nimenomainen effectivePolyolContract on laskennan sopimus.
- Tavallinen ravintomalli hylkää tuntemattoman pippuripolyolin myös ilman suolan erillistä massaestettä. Puhdas ruokasuola on mukana, massa `null`; nollaksi muutettua massaa tai pois jätettyä maustetta ei ole.

PR156:n hyväksyntää ei lainata. Sen sallittu joukko on kaksi muuta reseptiä, kuusi annosta ja niiden täsmälliset kokonaisuudet. Sen helperin, hyväksyntärekisterin ja kahden evidenssin tiedostohashit sekä alkuperäiset hyväksyntäfingerprintit tarkistettiin muuttumattomiksi; ne ovat [source-pins.json](source-pins.json)-tiedostossa. Mainissa ei ole sen julkaisukytkentää.

## Täsmälliset lähde- ja GI-sidokset

Kolme vain tähän ehdotukseen normalisoitua Fineli-profiilia: broilerin raaka nahaton rintafilee11565, tuore kuorittu valkosipuli393 ja tuore basilika11134. Muut kuusi koostumusprofiilia ja puhtaan suolan määritelmä säilyvät lukitussa pilotissa. Koko vuoka nesteineen ja rasvoineen jaetaan neljään annokseen; retentio1 on ehdollinen syötemalli, ei mitattu kypsennyssaanto. Fineli352 säilyy kirsikkatomaatin nimettynä proxyna; tuorejuusto11 %, kerma38 % ja juusto nimettynä puolikovana profiilina eivät osoita kaikkien tuotemerkkien vastaavuutta.

Valkosipulille valmisteltiin vain sen uuden profiilin, raakamuodon ja nykyisen GI40-sovelluksen alias-ehdotus. Basilikalle valmisteltiin tuoreen raakamuodon alias ja nykyisen `lowcho50-r4` GI50:n täsmällinen uusi koostumussidos. Basilikan saatavilla olevan CHO:n arvo1,1 ja konservatiivisen herkkyyden ylä1,2 g/100 g alittavat sovelluksen5 g:n rajan. Tämä ei yksin hyväksy GI:tä: nykyinen lähdekortti ei salli uutta koostumustunnusta, eikä uusi alias ole asennettuna. Adapteri tarkistaa molemmat ehdotetut valmistusmuodot nykyisillä säännöillä ja osoittaa kummankin tuotantosidoksen estyvän. Muut GI-numerot säilyvät; mitattua GI-tutkimusta tai yleistä oletusarvoa ei lisätä. Mustapippurin lähdesopimus odottaa omaa C-päätöstä.

## Uusi lähdetarkkuuden auditointi

Tarkistettiin [Finelin valkosipulin393](https://fineli.fi/fineli/fi/elintarvikkeet/393) ja [tuoreen basilikan11134](https://fineli.fi/fineli/fi/elintarvikkeet/11134) nykyinen päätaulukko. Neljä makro-/kuitukenttää näkyvät yhden desimaalin tarkkuudella; POLYL näkyy `0 g`. Valkosipulin POLYL on summattu ja basilikan johdettu. Verkkonäyttö ei todista piilotetun luvun tarkkuutta, täydellistä polyolilajiston mittausta tai ravintoaineen biologista vaihtelua. Basilikan päätaulukon rasva0,7 säilyy; sivun erillinen0,6-yhteenveto ei korvaa sitä tässä ajossa. Lähde: THL, Fineli, CC BY4.0; mallinnus on projektin oma.

Lähteiden pyöristysalgoritmia ei varmennettu. Siksi tarkistus on kaksi **ehdollista herkkyystarkastelua**, ei lähteen todistettu virheraja. Kummankin yrtin positiivisille kentille käytetään ensin ±0,05 g/100 g (lähimpään desimaaliin pyöristyksen malli), sitten ±0,10 g/100 g (yhden viimeisen näyttöyksikön stressi). Näkyvää POLYL0:aa ei väitetä täysitarkaksi: erillinen ei-negatiivinen herkkyys on vastaavasti0–0,5 ja0–1 g/100 g, vastekertoimella0–150. Se ei muuta lähteen ilmoitettua nollaa tai mustapippurin tuntematonta pistettä. Muut koostumusprofiilit pidetään kiinteinä; kaikkien muiden lähteiden, tuotemerkkien tai mittausten epävarmuutta ei väitetä ratkaistuksi.

| /annos | Kiinteä lähdemalli | Pyöristyksen lähimpään-malli | Konservatiivinen näyttöyksikön stressi | Alkuperäinen näyttö vakaa? |
| --- | --- | --- | --- | --- |
| Netto-CHO |7,384250|7,382750–7,385750|7,381250–7,387250|**Ei:7,38–7,39** |
| Kokonais-CHO |10,380250–10,408250|10,377250–10,426250|10,374250–10,444250|Kyllä:10,4 |
| Proteiini |39,530500|39,529000–39,532000|39,527500–39,533500|Kyllä:39,53 |
| Rasva |23,911125|23,909625–23,912625|23,908125–23,914125|Kyllä:23,91 |
| GK |2,737675–2,779675|2,737000–2,802850|2,736325–2,826025|Kyllä:noin3, LOW |
| Koko GK-leveys |0,042000|0,065850|0,089700|Alle ehdollisen0,10-budjetin |

Alkuperäinen mustapippurin koostumusskenaario antaa0–0,028 g/annos ja GK-leveyden0,042. Se pidetään erillään lähdetarkkuudesta. Konservatiivisen stressin kokonaisleveys0,0897 koostuu tästä0,042:sta, yrttien A-lukujen pyöristyksen0,0027:stä ja näkyvien POLYL-nollien vasteherkkyyden0,045:stä. Kerroin150 ja leveysbudjetti0,10 ovat hyväksymättömiä ehdollisen mallin rajoja, eivät fysiologisia maksimeja.

**Noin GK3 ja LOW säilyvät tässä rajatussa auditoinnissa. Neljän makron alkuperäinen näyttöpaketti ei säily vakaana netto-CHO:n vuoksi.** Näyttötarkkuutta, reseptiä tai lähdelukuja ei muutettu luvun saamiseksi julkaisukelpoiseksi. Uutta ehdotusta ei merkitä GO TO OWNER REVIEW -tilaan pelkän GK-luvun vakauden perusteella.

## Varmennus ja tuotannon säilyminen

- Prototyypin9 testiä PASS: koko hash,14 mutaatiotapausta, valmistustekstin muutos, pois kytkentä, puuttuvan polyolin tavallinen hylkäys, kahden alias-/GI-portin rajaus, tarkkuuden epäonnistuminen sekä vanhojen aineistojen säilyminen.
- Yhden reseptin riippumaton Python Decimal PASS; kaikki makrot, GK, skenaarioiden päät ja näyttöarvot täsmäävät TypeScript-prototyyppiin. Tulokset: [prototype-result.json](prototype-result.json), [decimal-verification.json](decimal-verification.json).
- Nykyiset ravintomallin23 testiä PASS, mukaan lukien kahden pidätetyn paketin tarkistukset. Strict nutrition audit:326 lähdettä,202 evidenssillistä arviota,65 puutteellista,59 ilman evidenssiä ja **0 ristiriitaa**. Prototyypin ja sen testin kohdennettu strict TypeScript PASS. Yleisiä testejä ei muutettu.
- Kaikki326 tuotannon GK-objektia täsmäävät olemassa olevaan hash-baselineen. Nykyiseen mainiin Git-puultaan sidottua puhdasta raporttia käytetään uudelleen; uutta326 reseptin GK-laskentaa ei ajeta. Kaikki kahdeksan tuotantokoodi-/syötepuuta ja -tiedostoa säilyvät muuttumattomina. Menetelmä on näkyvissä [main-baseline.json](main-baseline.json)-tiedostossa.
- **130/326 numeerista GK:ta säilyy.** Uunikanapastan tuotantotulos on edelleen keskeneräinen ilman numeroa. Keto-suklaakeksien ja keto-mutakakun neljä ravintoarvoa pysyvät pidätettyinä ja evidenssi säilyy. Kaikki muut reseptit ja käännökset ovat muuttumattomia.
- Ei kokonaisbuildia, kokonaista testipakettia, manuaalista Actions-ajoa tai review-pyyntöä. Yhden pushin automaattinen CI noudattaa nykyistä tutkimuspolun kevyttä valintaa; se ei suorita tutkimusadapteria. Adapteri ja ravintotarkistukset ajettiin paikallisesti. CI:n tekninen PASS ei olisi menetelmä- tai sisältöhyväksyntä.

[verification.json](verification.json) tallentaa tarkistusten laajuuden. Kehityksen ensimmäisen tarkistuksen import-polku, kuutta desimaalia rajaavan apurin kutsu ja Pythonin paikallisen moduulin varjostus korjattiin tai rajattiin pois ennen lopullisia PASS-ajoja. Ei tuotantokoodin tai testivaatimusten kiertoa.

Toisto repon juuressa paikallisten site-riippuvuuksien asennuksen jälkeen:

```powershell
node --import ./site/node_modules/tsx/dist/loader.mjs docs/research/gk80-afcd-recovery-02/prototype.mts
node --import ./site/node_modules/tsx/dist/loader.mjs --test docs/research/gk80-afcd-recovery-02/prototype.test.mts
python -I -X utf8 docs/research/gk80-afcd-recovery-02/decimal.py --prototype-result docs/research/gk80-afcd-recovery-02/prototype-result.json
```

`-I` on Python-toiston eristetty tila, joka estää tämän suoritettavan tiedoston nimeä varjostamasta standardikirjaston decimal-moduulia. Viimeiset kaksi prototyyppitestiä tarkistavat myös alkuperäiset paikalliset lähdetyöpuut/raportin; niiden polut ovat source-pins/main-baseline-tiedostoissa ja ne vaativat tämän työaseman aineistot. Laskenta ja Decimal-vertailu ovat itsenäisesti toistettavissa paketista. Nykyiset ravintotarkistukset: `npm run test:nutrition` ja `npm run audit:nutrition -- --strict` site-hakemistossa.

## Omistajan päätös ja myöhempi käyttöönotto

Ensin on ratkaistava7,38 g:n näyttötarkkuuseste lähteistetyllä tarkemmalla syötteellä tai erillisellä nimenomaisella tarkkuus-/menetelmäpäätöksellä. Tässä ajossa ei valmistella karkeampaa näyttöä hyväksyntäkeinoksi. Nykyinen lukittu neljän makron paketti pysyy HOLDissa, vaikka mallinnettu GK on noin3.

Mahdollisen käyttöönoton hyväksynnän on katettava koko uusi täsmällinen fingerprint: punnittu neljän annoksen tuoreyrttiversio,3 Fineli-profiilia, säilytetyt tomaatti-/maitotuoteproxyt, valkosipulin alias, basilikan alias ja GI50:n koostumusrajaus, mustapippurin tuntematon aggregate, puhdas suola, retentio,0–150-vastealue, koko0,10-budjetti sekä tarkkuusauditoinnin jälkeen perusteltu neljän makron näyttö ja noin3 LOW. Lähteiden tarkentuminen muuttaa fingerprintin ja vaatii uuden koko tapauspaketin katselmoinnin.

Hyväksynnän jälkeen tarvitaan **erillinen main-pohjainen rajattu tuotantointegraatio**, joka asentaa vain hyväksytyt sidokset ja uuden hyväksyntään sidotun suljetun tapauksen sekä tarvittavat täsmälliset kieliversiot. Prototyypin JSON-lippuja ei vaihdeta aktivoimiseksi. PR156:n kahta tapausta tai hyväksyntähashia ei laajenneta. Merge ja deploy tarvitsevat lisäksi erillisen julkaisuluvan; ehdokaskattavuutta131/326 ei oteta käyttöön nyt.

Pysähdytään tähän Draftiin ja **HOLD-päätökseen**. Ei muita reseptejä, Readyä, mergeä, deployta, ReportHubia tai automaattista jatkoajoa.

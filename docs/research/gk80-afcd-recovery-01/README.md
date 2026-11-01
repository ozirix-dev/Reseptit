# GK80 AFCD-RECOVERY-01 — yksi ehdollinen jatkopilotti

**1.11.2026 — lähde- ja hyväksyntäaineisto, ei tuotantointegraatiota.**

Tulos: **A0 / B1 / C19** PR #153:n 20 reseptin koneellisessa esteseulonnassa. Valittiin vain uunikanapasta kesäkurpitsasuikaleilla. Pilotin päätös on **CONDITIONAL GO uuteen omistajan sisältö- ja menetelmäpäätökseen**. Se ei ole tämänhetkinen julkaisuhyväksyntä.

## 1. Todellinen lähtötila ja erillisyys

Oma haara `codex/gk80-afcd-recovery-01`, oma worktree `D:/Projects/tmp/reseptit-gk80-afcd-recovery-01`, suoraan etä-mainista `88e228bbb1f0fa4a4e16be4aeedcd509bc7bc33a`; repo_guard PASS. Ei PR #153:n, #156:n tai #161:n päälle pinottua haaraa. Lähtö-mainin [normaali push-CI ja Pages-deploy](https://github.com/ozirix-dev/Reseptit/actions/runs/41324602556) varmennettiin uudelleen: molemmat PASS.

| PR | HEAD | Tila | CI |
| --- | --- | --- | --- |
|#153|`b8ece7ee1e4b80fc26abeb9b94944514875188d7`|OPEN / Ready|PASS|
|#156|`d31c3a7ae157337177733375a9c7d811646187ee`|OPEN / Draft|PASS|
|#161|`6f09e0a4b4caaac17412f12b1f3dcc79d875f345`|OPEN / Draft|PASS|
|#162|`b4801f269ee2339725a568f229b9e57fe29976f1`|MERGED, merge-SHA `88e228bbb1f0fa4a4e16be4aeedcd509bc7bc33a`|PASS|

PR #153:n bulgogi- ja bún chả -valmistuskorjaukset säilyvät erillisessä haarassa. Sen 20 lähdehyväksyntää jää HOLDiin. PR #156:n kaksi hyväksyttyä menetelmäversiota ja hyväksyntähashit säilyvät muuttumattomina. PR #161:n auditointia ja PR #162:n jo julkaistua pidätystä ei muuteta. Tuotannon numeerinen GK-kattavuus on 130/326.

Asetustiedostossa Sol/High; aktiivisen chatin valitsin ei näy työkaluille. Tarkistetuissa lähdetyöpuissa ei ollut muutoksia. Viimeisimmän15 chatin metatiedoissa ei näkynyt toista aktiivista saman projektin ajoa; tämä ei ole lupaus kaikkien vanhojen chatien tilasta. Muille chateille ei lähetetty viestejä.

## 2. Koneellinen seulonta kaikille 20 reseptille

Seulonta käyttää PR #153:n jo tehtyä analysis.json-aineistoa ja sen SHA256-sidoksia. Muille 19 reseptille ei tehty uutta lähdehakua tai GK-uusintalaskentaa. A edellyttää koko reseptin olennaisten lähdepuutteiden ratkaisua nykyisellä soveltuvalla tiedolla; B vaatii uuden nimetyn menetelmäpäätöksen; C on HOLD. A-luokkaan ei löydetty yhtään.

| Resepti-ID | Luokka | Valittu | Jäljellä olevat AFCD-esteet |
| --- | --- | --- | --- |
|uunikanapasta-kesakurpitsa|B|Kyllä|F006618|
|japanilainen-kabocha-puuro|C|Ei|F007535|
|tomaatti-kananmuna-wokki|C|Ei|F006250|
|caponata|C|Ei|F002220, F006198|
|janssoninkiusaus-juuriselleri|C|Ei|F000074, F006618|
|menemen|C|Ei|F006316, F006618|
|pasta-alla-norma|C|Ei|F002479, F006618|
|ratatouille|C|Ei|F006618, F009160|
|sitruuna-yrttikana-parsa|C|Ei|F006618, F009160|
|taytetyt-paprikat-vhh|C|Ei|F006281, F006618|
|valimerellinen-halloumi-tomaattileipa|C|Ei|F002466, F006198|
|vietnamilainen-kahvijogurtti-banaanilla|C|Ei|F003065, F005582|
|congee-riisipuuro|C|Ei|F004213, F006187, F006250|
|marokkolainen-couscous|C|Ei|F003190, F003327, F009335|
|shakshuka|C|Ei|F003327, F006316, F006618|
|bulgogi|C|Ei|F006187, F006250, F006618, F008969|
|bun-cha-hanoi|C|Ei|F003192, F006618, F008004, F008969|
|doner-kebab|C|Ei|F003327, F006281, F006316, F006618|
|carnitas-salaattitacot|C|Ei|F003192, F003327, F005191, F005199, F006281, F006618|
|rogan-josh|C|Ei|F002258, F002893, F002963, F003190, F003327, F004213, F005077, F006316|

Valinta ei perustu pieneen GK-lukuun: uunikanapastassa kolme aiemmin tunnistettua koko profiilin lähdevaihtoehtoa vastaavat nimettyjä raakoja ainesosia ja jäljelle jää vain yksi punnittu 0,5 g:n mustapippuriosuus. Kaikki neljä makroa ja koko ehdollinen GK voidaan tarkistaa. Esimerkiksi ratatouillen ja sitruuna-yrttikanan aiemman skenaarion leveys 0,189 ylittää 0,10-budjetin; niitä ei nosteta B-luokkaan pyöristyksen perusteella.

## 3. Lukittu uunikanapastan ehdotus

Resepti-ID `uunikanapasta-kesakurpitsa`, neljä annosta. Lähdeversio on PR #153 HEAD `b8ece7ee1e4b80fc26abeb9b94944514875188d7`. Alkuperäisen punnitun version täydellinen teksti on [pr153-source.md](pr153-source.md); lähtö-mainin versio [main-source.md](main-source.md). Nämä ovat tutkimuksen snapshotteja, eivät tässä ajossa asennettuja reseptejä.

Koko uuden tapauspaketin fingerprint: `d09c61c2d3796efe1a04add86966c20b1affd00414ac8e0834b5eb7db2b766ae`. [pilot.json](pilot.json) sisältää valmistuksen, punnitut syötävät määrät, lähdeprofiilit, soveltuvuudet, oletukset, näkyvät arvot ja omistajalta tarvittavat päätökset.

| Ainesosa | Koko reseptin syötävä massa | Koostumuslähde / tarkka rajaus |
| --- | --- | --- |
|broilerin rintafileetä|500 g|recovery01-fineli-11565-release20|
|kesäkurpitsaa|500 g|fineli-389-release-20-f6167187|
|kirsikkatomaattia|200 g|fineli-352-release-20-be0843a6|
|maustamatonta tuorejuustoa, rasvaa 11 %|150 g|fineli-11571-release-20-ef726bca|
|kuohukermaa, rasvaa 38 %|100 g|fineli-631-release-20-6d1f5fee|
|puolikovaa juustoraastetta, koostumusvertailussa rasvaa 25–35 %|100 g|fineli-655-release-20-62ca869b|
|tuoretta kuorittua valkosipulia|6 g|recovery01-fineli-393-web-table-20261101|
|tuoretta basilikaa|6 g|recovery01-fineli-11134-web-table-20261101|
|jauhettua mustapippuria|0.5 g|afcd-F006618-release-3-a814ab84|
|suolaa|Tuntematon, maun mukaan|Puhdas ruokasuola; ei seos. Massa jää tuntemattomaksi, ei nollaksi. Vain nollat neljässä seuratussa makrossa; natrium ei kuulu laskentaan.|

Valmistus säilyy PR #153:n kolmivaiheisena tuoreiden yrttien versiona: vuoka kypsennetään 200 °C:ssa, kesäkurpitsa ja juusto lisätään ohjeen mukaisesti, kana kypsennetään kauttaaltaan ja koko vuoka nesteineen ja rasvoineen jaetaan neljään annokseen. Punnittuja aineksia tai nesteitä ei poisteta. Retentio1 on nimetty koostumusmalli, ei mitattu kypsennyssaanto. Puhtaan ruokasuolan määritelmä tehdään nimenomaiseksi.

### GI-sidokset ja valmistusvastaavuus

[sources.json](sources.json) säilyttää kaikki käytetyt alkuperäiset GI-kortit ja niiden evidenssihashit. Kaikki GI-luvut periytyvät PR #153:n samoille nimetyille ainesosille tehdyistä sovelluksista. Uutta mitattua GI-tutkimusta, uutta yleistä oletusarvoa tai ruokaperheen keskiarvoa ei tuoda puutteen tilalle. Kortit sisältävät julkaistuja imputointeja ja projektin rajatun maustesovelluksen; niitä ei kutsuta mitatuiksi ateria- tai ainesosa-GI-arvoiksi.

| Ainesosa | Nykyinen nimetty GI-sovellus | Jatkoehdotuksen hyväksyntätila |
| --- | --- | --- |
|kesäkurpitsaa|vegetable-imputation40 / 40|Nykyinen ehdokassidos säilyy; koko uusi versio silti hyväksyttävä|
|kirsikkatomaattia|vegetable-imputation40 / 40|Nykyinen ehdokassidos säilyy; koko uusi versio silti hyväksyttävä|
|maustamatonta tuorejuustoa, rasvaa 11 %|dairy-imputation30 / 30|Nykyinen ehdokassidos säilyy; koko uusi versio silti hyväksyttävä|
|kuohukermaa, rasvaa 38 %|dairy-imputation30 / 30|Nykyinen ehdokassidos säilyy; koko uusi versio silti hyväksyttävä|
|tuoretta kuorittua valkosipulia|vegetable-imputation40 / 40|Uusi täsmällinen sidos-/C-tapauspäätös tarvitaan|
|tuoretta basilikaa|lowcho50-r4 / 50|Uusi täsmällinen sidos-/C-tapauspäätös tarvitaan|
|jauhettua mustapippuria|small-flavour50-r4 / 50|Uusi täsmällinen sidos-/C-tapauspäätös tarvitaan|

**Basilikan erityinen portti:** aiempi GI50-kortti sallii vanhan AFCD-koostumustunnuksen, eikä uuden Fineli-profiilin tunnus ole automaattisesti sen sallittujen joukossa. Uusi tarkka lähde-, ruokalaji- ja valmistussidos on hyväksyttävä. Myös valkosipulin uusi koostumustunnus tarvitsee oman alias-sidoksen. Mustapippurin makro- ja GI-sidos säilyy, mutta aggregate-polyoli muutetaan vain tämän tutkimustapauksen lähdesopimuksessa tuntemattomaksi. Näitä muutoksia ei asenneta katalogiin, GI-kortteihin tai PR #156:n sallittuun joukkoon.

Tomaatti pysyy Fineli352:n tavallisen raa’an tomaatin nimettynä koostumusproxyna kirsikkatomaateille. Tuorejuusto on maustamaton11 %, kerma38 % ja juusto Fineli655:n puolikovan juuston nimetty profiili. Tietueet eivät osoita kaikkia tuotemerkkejä tai25–35 % juustoja täsmälleen samanlaisiksi. Nämä jo käytetyt soveltuvuudet sisältyvät uuden version sisältöpäätökseen.

## 4. Mitkä AFCD-esteet ratkesivat

| Aiempi lähde | Ehdotettu ratkaisu | Näytön merkitys |
| --- | --- | --- |
| F002594, raaka nahaton broilerin rintaliha | Fineli11565, raaka nahaton rintafilee | Nykyinen versionoitu Release20-profiili, kaikki viisi koostumuskenttää ja ilmoitettu POLYL0. Ei mitattu tämän vuoan arvo. |
| F004193, raaka kuorittu valkosipuli | Fineli393, nykyisen verkkosivun päätaulukko | A16,3, proteiini7,9, rasva0,6, kuitu2,1, polyolit0 g/100 g. POLYL on lähteessä summattu osatekijöistä. |
| F000396, tuore basilika | Fineli11134, nykyisen verkkosivun päätaulukko | A1,1, proteiini3,1, rasva0,7, kuitu1,6, polyolit0 g/100 g. POLYL on johdettu. |
| F006618, mustapippuri | Ei uutta kokonaispolyoliarvoa | Kenttäparin tunnettu osasumma0 säilyy erillään: aggregate-P=null, kaikki erilliset raportoimattomat lajikentät=null. |

Tarkistettiin uudelleen vain pilotin [valkosipuli393](https://fineli.fi/fineli/fi/elintarvikkeet/393), [basilika11134](https://fineli.fi/fineli/fi/elintarvikkeet/11134) ja [mustapippuri11177](https://fineli.fi/fineli/fi/elintarvikkeet/11177). Koko41 tietueen hakua ei uusittu. Valkosipulin ja basilikan ilmoitetut POLYL-arvot ratkaisevat valittujen lähdeprofiilien raportointiaukon; ne eivät todista kaikkien mahdollisten lajien täydellistä laboratoriomittausta. Broilerin, valkosipulin ja basilikan kaikki neljä makroa ja GK-vaikutus laskettiin uudelleen. Muiden ainesosien profiilit tarkistettiin ja säilytettiin.

Lähde: Terveyden ja hyvinvoinnin laitos, Fineli, CC BY4.0. Verkkotaulukon arvot säilytetään sen ilmoittamassa tarkkuudessa; piilotettua raakadatan tarkkuutta ei väitetä. Mallinnus on projektin tekemä, eikä sitä esitetä THL:n suosituksena. Vanhojen AFCD-korttien pair=aggregate-väite on snapshotsissa historiallinen; pilotin effectivePolyolContract korvaa sen nimenomaisesti.

## 5. Koko reseptin Decimal-tarkistus ja näyttötarkkuus

Vain mustapippurille jää tuntematon aggregate-polyoli. Sen kiinteä lähdemakroprofiili on A38,6 + proteiini10,4 + rasva3,3 + kuitu25,3 =77,6 g/100 g. Tämän lähdelukuihin sidotun mallin jäännös on22,4 g/100 g. Pippuria0,5 g /4 annosta tuottaa lisäpolyoliskenaarion0–0,028 g/annos. Vettä tai tuhkaa ei päätellä erotuksesta ja vähennetä uudelleen.

Vastekertoimen skenaario0–150 antaa koko reseptin lisä-GK-leveyden0,028×150/100 = **0,042**, alle vertailubudjetin0,10. Kerroin150 ei ole todistettu fysiologinen maksimi. Esimerkiksi kertoimella400 leveys olisi0,112 ja ylittäisi budjetin. Malli ei kata lähdemakrojen analyyttistä epävarmuutta, verkkonäytön pyöristymisen koko epävarmuutta, kaikkia tuotemerkkejä tai ihmisten vastevaihtelua.

| Suure /annos | Koko nimetyn lähdeskenaarion tulos | Ehdotettu näyttö | Tarkkuus |
| --- | --- | --- | --- |
|Netto-CHO|7.384250 g|7,38 g|2 desimaalia|
|Kokonais-CHO|10.380250–10.408250 g|10,4 g|1 desimaalia|
|Proteiini|39.530500 g|39,53 g|2 desimaalia|
|Rasva|23.911125 g|23,91 g|2 desimaalia|
|Kuitu|2,996000 g|Sisäinen lähdelaskelma|Ei viides julkaistava makro|
|GK|2,737675–2,779675|Mallinnettu noin3 /annos, LOW|Kokonaisluku3 koko skenaariossa|

**Uusi tarkkuushavainto:** kokonais-CHO:n kahden desimaalin arvot vaihtelevat10,38–10,41, joten10,38 ei ole vakaa näyttöpiste. Yksi desimaali antaa molemmissa päissä **10,4**; koko monotoninen väli pyöristyy siihen. Edellisen selvityksen10 g on myös vakaa, mutta tarpeettoman karkea. Tässä ehdotetaan10,4 g:n näyttöä uuteen omistajapäätökseen. Muiden kolmen makron kaksi desimaalia pysyvät vakaina vain kuvatussa kiinteän lähdeprofiilin mallissa.

Koko reseptin tarkka GK-piste ja aggregate-polyolin piste ovat molemmat `null`. Tuntematonta ei korvata nollalla tai keskipisteellä. Alarajan2,737675 tiedetty A×GI-summa ei ole ratkaistu koko aterian vaste. Näkyvä noin3 johdetaan koko skenaarion vakaasta pyöristyksestä. Raaka-arvoihin perustuva GK-luokka pysyy LOWna.

## 6. Muuttuvat ja ennallaan säilyvät tiedot

| Versio | Netto-CHO | Kokonais-CHO | Proteiini | Rasva | GK |
| --- | --- | --- | --- | --- |
| Tuotannon main88e228b |7,10|8,86|39,38|24,27|Ei numeerista GK:ta|
| PR #153:n punnittu lähde-HOLD |7,28|10,52|39,57|22,43|Vanha ehdokasaritmetiikka2,694325; ei uusi julkaisu|
| Tämä hyväksyntäehdotus |7,38|10,4|39,53|23,91|Ehdollinen skenaario2,737675–2,779675; näyttö noin3 LOW|

Kaikki neljä ravintoarvon näyttöä vaihtuisivat sekä nykyisestä tuotannosta että PR #153:n aiemmasta versiosta. Niitä ei säilytetä vanhan hyväksynnän vuoksi. Tunnetun A:n GK-aritmetiikka muuttuu PR #153:een nähden +0,043350 lähdeprofiilien vaihtuessa; lisäksi puuttuvan polyolin skenaariota käsitellään erikseen.

Tuotannon nykyisessä reseptissä on kuivatut valkosipuli/basilika, mittaamaton suola/pippuri ja100 ml kermaa. Punnittu uusi versio käyttää6 g tuoretta valkosipulia,6 g tuoretta basilikaa,0,5 g pippuria ja100 g kermaa sekä nimettyjä maitotuoteprofiileja. Näitä ei väitetä samaksi valmistusversioksi. PR #153:n punnittuun versioon nähden massat, annokset ja kolme valmistusvaihetta säilyvät; puhtaan ruokasuolan määritelmä täsmennetään ja koostumus-/näyttöversio vaihtuu. Reseptitiedostoja tai käännöksiä ei muuteta tässä ajossa.

## 7. Rajattu vaikutus julkaistuun130 GK:hon

Neljä valittua lähdeperhettä esiintyvät nykyisessä130 numeerisen GK:n joukossa yhteensä **40 eri reseptin** jäljitetyssä GK- tai makroketjussa. Niistä ei tehty uusia laskelmia.

| Lähdeperhe | Reseptejä |
| --- | --- |
|F000396|2|
|F002594|5|
|F004193|14|
|F006618|24|

Lukumääriä ei summata päällekkäisyyksien vuoksi. Tarkat roolit ja ID:t ovat [production-impact.json](production-impact.json).

Vaikutuksen alaiset nykyiset resepti-ID:t: `amritsari-kala`, `butter-chicken`, `gai-yang-vhh`, `gazpacho`, `indonesialainen-bubur-ayam-kanariisipuuro`, `italian-pata`, `kana-fajita-pelti`, `kanakeitto-pinaatti-sitruuna`, `kanapyorykat-tomaattikastike`, `khao-man-gai-vhh`, `koshari`, `kreikkalainen-kanavuoka-oliiveilla`, `lanttulaatikko-kermainen`, `lohikeitto-kuohukermalla`, `moo-ping-vhh`, `munakasmuffinit`, `munakoiso-jauhelihavuoka-vhh`, `munakokkeli`, `pad-kra-pao-vhh`, `paprikauunimunakkaat`, `parsakaali-sinihomejuustofrittata`, `pohjoisafrikkalainen-harissa-shakshuka`, `poronkaristys-kukkakaalimuusilla`, `raejuusto-uunimunakas`, `som-tam-vhh-kurkkuna`, `souvlaki`, `tabbouleh`, `tandoorikana`, `thai-kai-jiao-yrteilla`, `thai-khao-tom-katkaravuilla`, `thai-riisinuudelikeitto-aamuksi`, `tonnikalamunakkaat-uunissa`, `tortilla-de-patatas`, `uunilohi-smetanakuorrutteella`, `uunimuna-avokadot`, `uunimunat-pinaatilla`, `uuniporsas-kermakastikkeessa-vhh`, `vhh-lihamureke`, `vietnamilainen-chao-ga-kanapuuro`, `yrttituorejuusto-kinkkurullat`.

AFCD:n kenttäpari ei edelleenkään todista kokonais-P:tä. Uudet nimetyt Fineli-vaihtoehdot voivat auttaa reseptikohtaista laadunarviointia, mutta eri maustemäärät ja muut tuntemattomat vaativat uuden koko reseptin tarkistuksen. Pilotin hyväksyntää ei siirretä näihin40 tapaukseen. Tässä rajatussa tarkistuksessa ei löytynyt uutta konkreettisesti todistettua tuotannon numerovirhettä eikä uutta P1-korjausta; lähderiskiä ei tällä väitteellä poisteta. Nykyisiä130 numeroa ei muuteta.

## 8. Varmennus ja toteutusvalmius

Riippumaton Decimal tarkistaa vain tämän yhden valitun reseptin kaikki ainesosapanokset, neljä makroa, polyolijäännöksen, GK-alueen, luokan ja pyöristykset. Seulonnan19 muuta reseptiä käyttävät aiempaa aineistoa. Lähde- ja syötehashit tarkistetaan. PR #156:n kahden evidenssin alkuperäiset hyväksyntäfingerprintit ja lähdetiedostot pysyvät muuttumattomina.

326 nykyistä tuotantotulosobjektia tarkistetaan olemassa olevasta, mainin kanssa samaan Git-puuhun sidotusta puhtaasta laskentaraportista ja aiemmasta SHA256-baselinesta. Tutkimuksen tuotantokoodi- ja lähdepuut pysyvät mainin kanssa identtisinä; myöhempi commit-diff saa sisältää vain tämän tutkimushakemiston. Tämä osoittaa tutkimuksen muuttamattomuuden ilman uutta326 reseptin laskentaa.

Ei sivustobuildia, kokonaista testipakettia, manuaalista Actions-ajoa tai manuaalista review-pyyntöä. Vain lähde-/hashitarkistus, tämän yhden tapauksen Decimal ja docs-only-polun normaali kevyt CI. verify.py on read-only: `python docs/research/gk80-afcd-recovery-01/verify.py`; valinnainen `--check-local-sources` tarvitsee alkuperäisen työaseman lähdepolut.

**Aineisto on valmis rajatun integraation valmistelupohjaksi omistajapäätöksen jälkeen, ei vielä sellaisenaan tuotantomoottorin hyväksymä tapaus.** [pilot.json](pilot.json) ja [sources.json](sources.json) lukitsevat nykyisen ehdotuksen. Uusi lähdealias, basilikan sallittu koostumussidos ja yksi suljettu C-hyväksyntä on toteutettava myöhemmin vain erikseen hyväksyttyyn versioon. PR #156:n nykyistä listaa tai hasheja ei laajenneta.

## 9. Omistajapäätös ja yksi seuraava toteutusajo

Omistajalta tarvitaan tämän yhden koko tapauspaketin päätös: kolme uutta lähdeprofiilia, säilytetyt tomaatti-/maitotuoteproxyt, täsmälliset GI-sidokset, pureSalt-rajaus, kiinteä koostumusjäännös, vastekerroinskenaario0–150, kokonaisleveysbudjetti0,10 sekä neljän makron ja GK:n yllä esitetyt näyttötarkkuudet. Päätös ei voi automaattisesti koskea muita reseptejä, suurempaa annosta tai muuttunutta lähdettä.

**Yksi suositus:** hyväksynnän jälkeen erillinen main-pohjainen yhden uunikanapastaversion suljettu tuotantointegraatio juuri tämän fingerprintin perusteella. Ensin tarkistetaan nykytila, asennetaan vain hyväksytyt sidokset ja tätä yhtä tapausta koskeva hyväksyntä; säilytetään kaikki130 nykyistä numeerista GK-tulosta ja muut HOLDit. Mahdollinen131/326 olisi vasta kyseisen integraation ehdokas, kunnes erikseen luvitettu julkaisu on oikeasti tehty ja varmennettu. Tätä jatkoajoa ei käynnistetä nyt.

Nykytilan neljä tasoa: kolme lähdeprofiilia on tutkimuksessa yksilöity ja lähteen ilmoittamat arvot tarkistettu; yksi ehdokas on laskennallisesti valmis nimetyssä skenaariossa; uusi menetelmä/sisältöhyväksyntä puuttuu; uusia tuotantoon julkaistuja GK-arvoja on0.

Ei Readyä, mergeä, deployta, PR #153/#156/#161:n muutoksia, uusia massatutkimuseriä tai ReportHub-muutoksia. Pysähdytään tähän hyväksyntäaineistoon.

# AAMURAPORTTI – GK80 MASTER NIGHT RUN / MAIN 131

1.11.2026. Kohde `ozirix-dev/Reseptit`. Tämä main-pohjainen työ sisältää yhden teknisen regressiosuojan ja tämän päätösraportin. Reseptien, laskennan, lähteiden, Goldenien ja julkaistun sivuston sisältöä ei muuteta. Ei Readyä, mergeä, deployta, ReportHub-muutoksia tai seuraavan ajon käynnistystä.

## 1. PR #165:n tuotantovarmennus

[PR #165](https://github.com/ozirix-dev/Reseptit/pull/165) on yhdistetty. [Main-CI 41344033518](https://github.com/ozirix-dev/Reseptit/actions/runs/41344033518) on PASS täsmälleen julkaisu-SHA:lla `ec7f4b01e6fa86cc6a45308286cf32e776e91e88`. Pages-deployment `7478241841` on success; [deploy-job](https://github.com/ozirix-dev/Reseptit/actions/runs/41344033518/job/124960722918). Uutta deployta ei käynnistetty.

Todellinen HTTP-varmennus tehtiin uudelleen 1.11.2026 klo20:19:04 UTC. [Uunikanapastan tuotantosivu](https://ozirix-dev.github.io/Reseptit/uunikanapasta-kesakurpitsa/) ja keskitetty GK-sivu palauttivat200. Uunikanapasta:4 annosta, kaikki10 ainesosaa, netto7,4 / kokonais10,4 / proteiini39,53 / rasva23,91 g, mallinnettu GK noin3, LOW sekä lähde- ja näyttötarkkuusseloste. Keskitetyn sivun kaikki325 julkista reseptiriviä vastasivat julkaistua paikallista tulostetta; sivuston laskentajoukko on326. Nämä määrät eivät tarkoita yhtä puuttuvaa laskentaobjektia.

Molempien keto-leivonnaisten neljä ravintoarvoa ovat edelleen `null`, HTTP200. Teehaudutetut munat sekä PR156:n kaksi tapausta ovat yhä ilman numeerista GK:ta. [production-http.json](production-http.json) säilyttää URL:t, HTTP-statukset, ETagit ja havaintoajan. Pages-onnistumista ei käytetä HTTP-näytön korvikkeena.

## 2. Mainin SHA ja työraja

Varmennettu main on `ec7f4b01e6fa86cc6a45308286cf32e776e91e88`. Työhaara `codex/gk80-main131-night` luotiin suoraan tästä mainista erilliseen puhtaaseen Reseptit-työpuuhun; repo_guard PASS. Ravinto-työhakemistoa ei käytetty reseptimuutoksiin. Konfiguraation oletus on Sol/High; työkalut eivät paljasta chatin aktiivista mallivalitsinta.

PR153/156/157/158/159/160/161/164:n lähdetyöpuiden HEADit ja puhtaus luettiin; niiden tiedostoja ei muutettu. ReportHub jää kokonaan erilleen. Toinen kirjoittava Codex-ajo ei käynnistynyt.

## 3. Julkaistu kattavuus ja eheys

**131/326 =40,18 %. Tavoitteeseen261/326 puuttuu130 julkaistua hyväksyttävää arviota.**

[baseline-proof.json](baseline-proof.json) käyttää jo olemassa olevaa PR165:n julkaisutulostetta. Sen tuottaneen puhtaan feature-työpuun Git-puu on täsmälleen sama kuin yhdistetyllä mainilla. Raportin326 tulosobjektin SHA256:t lukittiin, ja niitä verrattiin olemassa olevaan130-tuloksen baselineen: vain uunikanapasta poikkeaa, kaikki325 muuta kokonaista objektia ja kaikki130 aiempaa numeerista tulosta säilyvät. Uunikanapastan uusi näyttöarvo on3. Keto-pidätykset ja tee-HOLD säilyvät.

Resepti-, käännös-, ravintoevidenssi-, lähde-, runtime-, sivustolähde- ja workflow-tiedostot on sidottu mainin Git-objekteihin. Tässä haarassa vain yksi testitiedosto ja tämä tutkimushakemisto saavat muuttua. Uutta326 reseptin laskentaa tai kokonaista buildia ei tehty.

## 4. PR153:n ja PR156:n integraatioriskit ja valmis yhteensovitus

**Kumpaakaan vanhaa PR:ää ei saa yhdistää sellaisenaan.** Guardin read-only `sync-main`-esitarkistus palautti molemmille `BLOCKED / merge_conflict / mutated=false`. GitHubin mahdollinen mergeable-tieto ei korvaa sisältöhyväksyntää.

Tarkat32 parikohtaista tiedostoriviä, kummankin version blob-SHA:t ja tiedostokohtainen ratkaisu ovat [integration-matrix.json](integration-matrix.json). Yhteisiä muutospolkuja on153↔165:10,156↔165:14 ja153↔156:8. Tämä erottaa samassa tiedostossa tapahtuvan muutoksen Gitin varsinaisesta konfliktimerkinnästä.

| Aineisto | Riski | Mainiin sovittamisen ratkaisu |
| --- | --- | --- |
| Julkaistu uunikanapasta | PR153:n resepti ja laskentaevidenssi ovat vanhoja: GK2,694325; makrot7,28/10,52/39,57/22,43. | Säilytä mainin resepti ja evidenssi byte-tarkasti; sulje sama ID pois PR153:n aktiivisista recipes/manifest/golden/publication-macros/rekisteri/batch-luetteloista. Historiatiedostot jäävät arkistoksi. |
| PR153:n muut19 tapausta | Vanha onnistunut laskenta ei ratkaise AFCD-kokonaispolyolia eikä uusien vaihtoehtoprofiilien hyväksyntää. | Mahdollinen tuleva19 tapauksen paketti rakennetaan mainista vasta lähdeportin jälkeen. Siirretään vain hyväksytyt yksilölliset tapaukset; ei koko vanhaa julkaisupakettia. |
| PR156:n kaksi C-tapausta | Vanha dispatch voisi korvata nykyisen uunikanapasta-/pidätyspolun. Vanha ehdokaslaskuri132 on nyt väärä. | Lisää erillinen suljettu C-haara nykyisiin evidenssi-, sisältö- ja GK-tarkistimiin. Säilytä nykyinen recovery- ja keto-pidätyskäsittely. Vain kaksi muuttumatonta hyväksyntähashia. Tuleva kattavuus133, ei132. |
| Batch87 | PR153 varaa numeron20 reseptille; PR156 käyttää sitä kahdelle hyväksytylle tapaukselle. | Varaa87 muuttumattomalle hyväksytylle C-paketille. Mainin uunikanapasta on batch88:ssa. PR153:n mahdolliselle uudelle19 paketille seuraava vapaa numero vähintään89; tarkista varaus toteutushetkellä. |
| Katalogi ja rekisterit | Vanhan koko tiedoston kopiointi voi poistaa tuoreen valkosipulin/basilikan sidokset tai aktivoida historiallisia ehdotuksia. | Sovita vain hyväksytyt lisäykset nykyiseen mainiin. Puuttuva polyolitieto ei oikeuta aliasia tai yleistä GI:tä. Nakkikeiton aliaslistaa ei tarvita kahden C-tapauksen julkaisuun. |
| Näyttö ja UI | PR156 ja165 käyttävät erillisiä suljettuja näyttöperusteita. | Säilytä `closedRecoveryC`, lisää erillinen `boundedPolyolC` vain kahdelle tapaukselle; säilytä LOW ja lähdeskenaarion rajoitukset. Ei globaalia tarkkuusmuutosta. |
| Testit ja package.json | Vanhat odotukset130/132/150, historialliset snapshotit tai puuttuva testirekisteröinti voivat antaa väärän varmuuden. | Säilytä nykyinen131-baseline ja uunikanapastatestin rekisteröinti. Tulevalle C-integraatiolle vain kaksi muuttunutta objektia,131 vanhaa numeroa ennallaan. Historiaoverlay vain nimetyissä historiatesteissä. |
| Historialliset tutkimuspaketit | Tutkimuksen false/pending-merkintöjen jälkikäteinen vaihtaminen ei muodosta hyväksyntää. | Arkistot säilyvät; niitä ei kopioida aktiiviseksi julkaisuksi tai kirjoiteta uudelleen Goldeniksi. PR161:n jo toteutettua keto-pidätyserää ei toisteta. |

Turvallinen toteutusjärjestys myöhemmälle erikseen luvitettavalle integraatiolle: uusi main-haara → hyväksyttyjen kahden tapaus-/kieliversion hashit → yhteensovitettu erillinen dispatch → vain tarvittava C-testiryhmä ja nyky-main-regressio → tarpeellinen yksi julkaisubuild → Draft ja normaali CI → erillinen katselmointi/julkaisulupa. Vanhoja PR153/156-haaroja ei synkronoitu tai kirjoitettu tässä ajossa.

## 5. Yhteiset lähde-esteet: enintään kolme perhettä

[inventory.json](inventory.json) yhdistää PR157–160:n83 HOLDia ja5 vanhaa numeerista ehdotusta, PR153:n19 jäljellä olevaa tapausta ja PR156:n kaksi hyväksyttyä tapausta. **109 yksilöllistä ID:tä**, ei päällekkäisyyttä julkaistun131:n kanssa. PR153:n jo julkaistu uunikanapasta poistettiin seulonnasta. [input-manifest.json](input-manifest.json) sisältää käytettyjen alkuperäistiedostojen SHA256:t ja muuttumattomat GitHub-commitlinkit.

Perhejoukot pisteytettiin sen mukaan, kuinka monta reseptiä niiden kaikkien kirjattujen lähde-esteiden ratkaiseminen voisi yhdessä avata. Puuttuva massa, määrittelemätön ainesosa tai koordinointieste estää vapautumisen. Enintään kolmen perheen paras kirjattuihin esteisiin perustuva mahdollisuus on4 reseptiä; tasatuloksia on useita. Valittu tasatuloksen joukko on **mantelijauho F006077, mustapippuri F006618 ja kuivattu timjami F009160**. Esiintymismäärä ei ollut valintaperuste.

| Kokonainen tapaus | Ratkaistavat perheet | Muu olennainen ehto | Nyt oikeasti vapautunut |
| --- | --- | --- | ---: |
| VHH-letut | F006077 | Jauhetun täysrasvaisen mantelin GI, kattava koostumus ja omistajan täsmällinen valmistus-/mallihyväksyntä |0|
| VHH-lihapiirakka | F006077 + F006618 | Jauhojen GI sekä molempien polyoliperuste; nykyinen painotettu mauste-GI ei ratkaise koostumusta |0|
| Ratatouille | F006618 + F009160 | Fineli-vaihtoehtojen uudet makrot ja soveltaminen vaativat hyväksynnän; nykyinen C-skenaarion leveys0,189 ylittää0,10 |0|
| Sitruuna-yrttikana ja parsa | F006618 + F009160 | Sama0,189-leveys ja uusien lähdeversioiden hyväksyntä |0|

Neljä tarkoittaa tutkimuksen **ehdollista potentiaalia**, ei neljää hyväksyttyä reseptiä. Muiden reseptien jäljellä olevat perheet ja muut esteet on lueteltu ID-kohtaisesti. Esimerkiksi mantelijauhon ratkaisu yksin ei vapauta raparperi-/rahkapiirakoita, joissa on muitakin koostumusesteitä.

Koostumukset A/proteiini/rasva/kuitu g/100g ovat vanhoissa nimetyissä lähdemalleissa:

| Tarkka elintarvike | Profiili | Polyolin näyttö | GI- ja Fineli-tilanne |
| --- | --- | --- | --- |
| AFCD F006077 Nut, almond meal; kuiva täysrasvainen mantelijauho |5,4 /19,7 /50,5 /11|with=without5,4, kuusi nimettyä lajia puuttuu, kokonaispolyoli `null`|Kokonainen manteli ja rasvaton jauho ovat eri muotoja. Valituissa aiemmissa lähteissä ei ole täsmällistä täydellistä korvaavaa mantelijauhoprofiilia ja hyväksyttyä GI-sidosta. Low-CHO-sääntö vaatii A≤5; lähteen5,4 ei täytä ehtoa.|
| AFCD F006618 Pepper, black, ground |38,6 /10,4 /3,3 /25,3|with=without38,6, kokonaispolyoli `null`|Punnitun mausteen GI50 on erikseen rajattu. [Fineli11177](https://fineli.fi/fineli/fi/elintarvikkeet/11177) ilmoittaa A38,3/proteiini10,9/rasva3,3/kuitu26,5 mutta ei kokonaispolyoliriviä.|
| AFCD F009160 Thyme, dried, ground |26,9 /9,1 /7,4 /37|with=without26,9, kokonaispolyoli `null`|[Fineli11194](https://fineli.fi/fineli/fi/elintarvikkeet/11194) ilmoittaa koostumusta mutta ei kokonaispolyoliriviä. Kuidun löytyminen ei ratkaise P:tä.|

Finelin kaksi virallista sivua luettiin uudelleen tässä rajatussa tarkastelussa. AFCD:n F006077-verkkosivu jäi selaushakutyökalussa JavaScript-latauskuoreksi; sen ravintoarvojen uutta verkkovarmennusta ei väitetä. AFCD-luvut ja puuttuvat lajit tulevat aiemman versionoidun PR161-auditoinnin alkuperäiskorteista. [source-family-decisions.json](source-family-decisions.json) säilyttää kortit, tiivisteet, GI-/valmistusrajat ja kaikki rinnakkaiset esteet.

Makrovaikutus: mantelijauhon nykyinen osuus per VHH-lettuannos on A0,675/proteiini2,4625/rasva6,3125/kuitu1,375 g; VHH-lihapiirakassa vastaavasti1,35/4,925/12,625/2,75. Kokonais-CHO:n puuttuvaa polyolitermiä ei voi korvata nollalla. Uusi koostumuslähde voisi muuttaa jokaista neljästä näytettävästä makrosta. Mausteiden lähdevaihto voi muuttaa myös A/proteiini/rasva/kuitu-profiilia; pelkän lähdealiasin lisääminen ei anna perusteltua makrodeltaa. PR153:n täsmälliset vaihtoehtomakrot ja jäljellä olevat skenaariot säilyvät inventaarion19 tapauksessa.

**Tulos: ei uutta lähdehyväksyntää eikä vapautettua HOLDia. Yhteisen aukon syy osoitettiin täsmällisesti:** mantelijauholta puuttuu kaksi erillistä edellytystä, eikä kummankaan mausteen nykyinen Fineli-sivu täydennä kokonaispolyolia. PR156/165:n kahden/ yhden reseptin ehdollista mallihyväksyntää ei voi siirtää muihin resepteihin. Olemassa olevan hyväksytyn kortin virheellistä teknistä hylkäystä ei löytynyt; A-vaihtoehdon sidontakorjaukselle ei siten ole osoitettua perustetta. Ei aliasia, yleistä GI:tä tai uutta nollaoletusta.

## 6. Seuraava turvallinen hyväksyntäpaketti

**Kaksi aidosti sisällöltään ja menetelmältään hyväksyttyä, mutta julkaisematonta tapausta löytyi PR156:sta.** Ne eivät ole uutta tutkimustuotantoa. [next-approval-packet.json](next-approval-packet.json) lukitsee muuttumattomat kaksi evidenssiä ja kaikki kahdeksan kieliversion hashit nyky-main-integraation valmistelua varten.

| Tapaus /6 annosta | Mallinnettu GK | Netto / kokonais / proteiini / rasva g/annos | Koko hyväksytty skenaarioleveys |
| --- | ---: | --- | ---: |
| Jauheliha-kaalikeitto VHH |noin5 LOW|10,21 /12 /17,68 /15,26|0,058|
| VHH-kaalilaatikko |noin4 LOW|9,52 /13 /20,86 /30,65|0,086|

Täsmälliset hyväksyntäfingerprintit:

- `jauheliha-kaalikeitto-vhh`: `7e16f21f52cc2365c6b1742d891542fb118b7b879b5bf73d88d5dbef361c0f2f`
- `vhh-kaalilaatikko`: `57540a15a0e29a4fc6c7cdfe83dfbaa8f59222a0dd48ad77f75c96cf36d82235`

Niiden laskentaevidenssien koko fingerprintit ja valmistustiedostojen hashit tarkistettiin; niitä ei muutettu. Omistajahyväksyntä koskee kahden täsmällisen version C-menetelmää,0–150-lähdemallia,0,10-leveysbudjettia ja näyttötarkkuutta. Se ei ole biologisen vasteen takuu tai tämän ajon merge-/deployvaltuus. Mainissa nämä reseptit ovat edelleen HOLDissa. Tuoretta rinnakkaisintegraatiota ei väitetä testatuksi; valmis suunnitelma on kohdassa4. Onnistuneen tulevan integraation ehdokaskattavuus olisi133/326.

Lisäksi Kaya-paahtoleivän vanha ehdotus ei altistu tämän auditoinnin AFCD-aukolle: netto36,59 / kokonais40,28 / proteiini12,18 / rasva26,21; ehdollinen GK20,29204–27,32172. Se tarvitsee yhä täsmällisen leipä-/paahtoanalogian, GI-skenaarioiden ja sisältöversion omistajahyväksynnän sekä main-pohjaisen integraation. Sitä ei yhdistetä hyväksyttyyn kahden reseptin pakettiin. Neljä muuta vanhaa numeerista ehdotusta pysyvät AFCD-HOLDissa.

## 7. Tekninen parannus C ja sen hyöty

Nykyiset tuotantoportit hylkäävät jo vanhentuneen valmistustekstin ja päällekkäisen numeerisen paketin. Nyt tämä todellinen PR153↔main-riski on lukittu **kolmella regressiotestillä** ennestään normaalissa CI-testilistassa olevaan `site/tests/nutrition-evidence.test.ts`-tiedostoon:

1. Nykyinen hyväksytty resepti tuottaa oikeat neljä näyttömakroa ja noin3:n; vain vanha keskeneräinen lähtötulos voidaan korvata.
2. Todellinen mainiin jo arkistoitu PR153:n reseptiteksti vaihdetaan eristettyyn tilapäisfixtureen: tuotannon `loadRecovery` hylkää sen `RECOVERY_STALE_PREPARATION`-virheellä.
3. Vanhan paketin numeerinen2,694325-tulos hylätään `RECOVERY_RELEASE_COLLISION`-virheellä hiljaisen ylikirjoituksen sijasta.

Runtime-porttia, julkaisukoodia tai tuloksia ei muutettu. Testit vähentävät tulevan käsin sovittamisen riskiä ja estävät näiden porttien tahattoman poistamisen testien läpäistessä. Ne eivät väitä estävänsä mielivaltaista koodimuutosta, joka poistaisi sekä portin että testin. Uusi irrallinen testitiedosto tai pakettilistan muutos ei ollut tarpeen. A- tai B-vaihtoehtoa ei toteutettu tämän lisäksi.

## 8. Draft ja CI

Toimituksena on yksi main-pohjainen tekninen Draft, haara `codex/gk80-main131-night`. Sen tarkka HEAD ja automaattisen CI:n tulos raportoidaan PR:n tarkistuksissa ja loppuviestissä, jotta raporttiin ei tehdä HEADia vaihtavaa dokumentointicommittia CI:n jälkeen. CI-valitsin valitsee tälle muutokselle vain `tests/nutrition-evidence.test.ts`: ei content-syncia, ravinto-/GK-kokonaistarkistusta, buildia tai deployta. Manuaalista Actions-ajoa tai Codex-katselmointia ei pyydetä. Draft pysyy Draftina.

## 9. Uudet tarkistukset, testit ja ajomäärät

- 1 HTTP-tuotantovarmennus olemassa olevalla verifierillä; ei uutta selain-/buildikierrosta.
- 1 staattinen olemassa olevan326-objektin baseline-todiste;0 uutta326 reseptin laskentaa.
- 2 guardin read-only sync-esitarkistusta: molemmat estivät konfliktin, ei muutoksia vanhoihin haaroihin.
- 1 kohdennettu paikallinen Node-testiajo: **11/11 PASS**, mukana3 uutta regressiotestiä ja8 aiempaa ravintoevidenssitestiä. Ei koko yksikkötestistöä.
- 1 raporttipaketin staattinen hash-/scope-/inventaarioverifier; ei uusia Decimal-laskuja.
- 0 paikallista kokonaisbuildia,0 manuaalista Actions-ajoa. Yksi normaali automaattinen PR-CI pushatulle HEADille; lopullinen tila ilmoitetaan erikseen.

Toisto rajatusti:

```powershell
# site-hakemistossa
node --import tsx --test tests/nutrition-evidence.test.ts
# repon juuressa; ei laskentaa tai verkkokutsuja
python -I -X utf8 docs/research/gk80-main131-night/verify.py
```

## 10. Seuraava omistajapäätös ja realistinen GK80-polku

**Tärkein seuraava päätös: lupa sovittaa PR156:n kaksi muuttumattomana hyväksyttyä C-tapausta uuteen main-pohjaiseen julkaisu-Draftiin tämän suunnitelman mukaan.** Ei vanhan PR156:n yhdistämistä sellaisenaan, muiden HOLDien vapautusta tai automaattista julkaisemista.

Koko326-joukon päällekkäisyydetön tilajako:

| Tila | Määrä | Näytön merkitys |
| --- | ---: | --- |
| Tuotannossa numeerinen |131|HTTP + julkaisu-CI/deploy + lukittu baseline|
| Sisältö/menetelmä hyväksytty, julkaisematon |2|PR156:n täsmälliset tapaukset; nyky-main-integraatio tekemättä|
| Aiemmin teknisesti laskettu, nyt lähde-HOLD |23|PR153:n19 + vanhojen ajojen4 AFCD-ehdotusta; ei julkaisuhyväksyntää|
| Vain ehdollinen katselmointiehdotus, ei AFCD-estettä tässä auditoinnissa |1|Kaya; omistajan täsmällinen hyväksyntä puuttuu|
| Native-HOLD, lähde-/määrä-/GI-/valmistus-/koordinointiesteitä |83|Ei vapauteta vanhan laskennan perusteella|
| Tämän109 tapauksen seulonnan ulkopuoliset keskeneräiset |86|Ei väitettyä nykyistä hyväksyntä- tai lähdevalmiutta|
| Yhteensä |326|Ei ID-päällekkäisyyksiä|

Lähdeperusteisesti perusteltu välitön seuraava askel on131→133 kahden hyväksytyn tapauksen integraatio. Kaya-hyväksyntä voisi myöhemmin viedä134:ään. Valitut kolme lähdeperhettä voisivat **uuden riittävän näytön ja hyväksyntöjen jälkeen** kattaa neljän muun reseptin kirjatut lähde-esteet: korkeintaan138. Tämäkin jää kahden päähän140:stä; nykyisten lähteiden perusteella ei ole vielä suljettua140-reseptiporttia.

| Tavoite | Lisää131:stä | Ehdollinen, ID-määrältään riittävä reitti | Vielä ratkaisematon lähde-/sisältötyö |
| --- | ---: | --- | --- |
|140 /42,94 %|9|2 hyväksyttyä +1 Kaya +6 lähde-HOLDista|Valittujen perheiden4 mahdollisen tapauksen lisäksi vähintään2 muuta täysin ratkaistua tapausta. Ei vielä näytöllä katettu.|
|160 /49,08 %|29|2 +1 +26 nykyisestä106 esteellisestä|Vaatii useita uusia kattavia lähderatkaisuja ja valmistushyväksyntöjä. Ei nykyistä valmista erää tai aikataululupausta.|
|200 /61,35 %|69|2 +1 +66 nykyisestä106 esteellisestä|Nykyinen näyttö ei todista66:n vapautettavuutta. Tarvitaan resepti-ID-kohtainen lähdeportti.|
|240 /73,62 %|109|Kaikki tämän seulonnan109 tapausta joskus hyväksyttynä|Pelkän inventaarion teoreettinen katto. Osa voi jäädä pysyvästi HOLDiin; tätä ei ennusteta saavutettavaksi nykyisillä lähteillä.|
|261 /80,06 %|130|Edellisten109 lisäksi vähintään21 tämän seulonnan86 muusta keskeneräisestä|Vaatii myös uusia lähdeperusteisesti valittuja tapauksia, ellei aiempia korvata. Nykyinen aineisto ei tue80 %:n saavuttamislupausta.|

Taulukko kertoo tarvittavan näytön ja puuttuvan määrän, ei hyväksy suunnittelemattomia tutkimusajoja. Raporttiin pysähdytään; ei automaattista seuraavaa ajoa.

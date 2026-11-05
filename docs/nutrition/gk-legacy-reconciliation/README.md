# Vanhojen GK-PR:ien nyky-main-sovitus

Vertailupohja on `081ba2c95f9243c1ed72206073160f9e64992e96`. Tämä on yksi koottu Draft-sovitus PR:ille #229, #133, #182 ja #226. Vanhoja kokonaisia syöte-, sidos-, testi- tai käyttöliittymätiedostoja ei palauteta. Alkuperäiset Git-haarat, kommentit ja hyväksyntähistoria säilytetään. Mainiin yhdistäminen ja deploy eivät kuulu tämän työn valtuuksiin.

| PR | Nykyinen ratkaisu | Jäljelle jäävä päätös |
| --- | --- | --- |
| #229 | Kokonaisskenaarioiden laskin ja sen regressiot sovitettu nykyiseen versiosopimukseen. Auditissa erotetaan pisteet, vaihteluvälit ja puuttuvat arviot. Tutkimusannosvertailut pysyvät erillään eivätkä korvaa alkuperäisohjeen arviota. Nykyinen vaihteluvälipaneeli ja #283:n alkuperäisohjeen suodatin säilyvät. | Historiallisen bindaetteok-ehdotuksen soveltuvuus ja julkaisu vaativat oman katselmointinsa. Sitä ei lisätä julkaistuihin versioihin. |
| #133 | 8 massa-/identiteettikorjauksen ehdokaspatchia sovitettu nykyisiin riveihin: bulgogi, baozi, Yangzhou-riisi ja koshari. Baozin 8 g perunatärkkelyssidos vaihtuu ehdokkaassa 7 g maissitärkkelys-ID:hen 27. Muita nykyisiä koostumussidoksia ei palauteta vanhasta haarasta. | 17 GI-poistoehdotusta on arvioitu: kaksi nykyistä rajattua analogiaa säilyy, 15 GI:tä poistetaan vain uusista katselmointiehdokkaista. Kuuden nykyisen hyväksytyn kotireseptirajauksen rinnalle ei aktivoida vanhoja geneerisiä ehdokkaita. Tomaatti-kananmuna-wokin kaikki 5 vanhaa ehdotusta ohitetaan nykyisen hyväksytyn EHOLD-käsittelyn säilyttämiseksi. Ehdokaslaskenta ei hyväksy uusia lähteitä tai julkaise GK:ta. |
| #182 | Kolme AFCD:n available CHO -kenttää korjataan ilman sokerialkoholeja ilmoitetuiksi. Persikkakulhon piste 4,08 → 3,97, näyttö edelleen noin 4. Vadelman osuus muuttuu, pellavapuuro pysyy lähdepuutteellisena. | Käyttäjä valtuutti tämän rajatun numeerisen korjauksen Draftiin. Polyolien kokonaiskattavuuden väitteet ja #181:n laajempi menetelmäpäätös säilyvät erillisinä. Ei julkaisuvaltuutta. |
| #226 | 4 nykyisiin riveihin sovitettua ehdokaspatchia: masala dosan peruna, sinapinsiemenet ja currylehdet sekä paputostadan avokado. Avokado käyttää nykyistä 0,77 g/100 g koostumusta: 0,462 g CHO/annos. Perusteeton avokadon GI poistuu ehdokkaasta. | Nykyiset hyväksytyt dosa- ja tostada-versiot säilyvät omilla määrillään ja tuotteillaan. Vanhan ehdokkaan vihreä linssi ei vastaa urad dalia, eikä sen geneerinen tortillavertailu kata rapeaa tostadaa. Näitä vanhoja ehdokkaita ei aktivoida. |

## Aktiivinen korjaus ja arvosuoja

`baseline.json` sitoo kaikki 326 aiempaa tulosobjektia, 87 täyttä GK-versiota sekä makroinventaarion. Ainoat sallitut aktiivisten tulosten erot on lueteltu kenttäkohtaisesti kahdelle #182:n reseptille. Muut 324 täyttä tulosobjektia, kaikki 87 versiota ja 326 makropakettia säilyvät identtisinä. Makroinventaarion muistitekstien CRLF/LF-rivinvaihdot normalisoidaan vertailussa LF:ksi; kaikki kentät ja arvot pysyvät mukana. GI-rekisteri, laskentamoottori, reseptitekstit, käännösten SHA-snapshotit ja hyväksyntäkuitit säilyvät.

Viisi curry-/kimchiversiota sitoi koko food-records.json-tiedoston tarkisteen, vaikka niiden omat hyväksytyt koostumusluvut eivät käytä kolmea korjattavaa tietuetta. Yhteensopivuussovitin sallii vain alkuperäisen ja täsmällisen korjatun tiedostoversion. Kolmen kentän palautus tuottaa alkuperäisen SHA-256:n. Osittainen korjaus, muu lähdemuutos, väärä tiedosto ja tuntematon odotettu hash estetään. Alkuperäisiä hyväksyntöjä ei kirjoiteta uudelleen.

Vanhojen julkaisuerien testit käyttävät omaa muuttumatonta lähdeversiotaan. Erillinen nykytilan regressio tarkistaa kaikki 326/87 tulokset, makrot sekä siirtymän negatiiviset kontrollit. Historiallisten odotusten sovitus ei vapauta nykytilan portteja.

## Samanaikaisesti mainiin yhdistetty P1-lähdekorjaus

Mainin `dab15fe907db7336320dcd79161fd61462b28034` sisältää ulkoisen korjauksen: kookos-lime-kanacurryn ja sate ayamin kookosmaitoa ei enää sidota lehmänmaitoon tai dairy-GI:hin. Molemmat alkuperäisohjeet pysyvät HOLDissa ja kokonais-GK puuttuu. Tämä PR ei muuta niiden tuotantosyötteitä eikä palauta vanhoja sidoksia.

`p1-main-transition.json` säilyttää vain näiden kahden tapauksen vanhat täydet syöte-/tulosobjektit sekä tarkistetun uuden profiilin tarkisteet. Testi tarkistaa HEADin Git-esi-isyyden: integraatiossa, jossa mainin korjaus on mukana, vaaditaan täsmälleen uusi lähdeprofiili ja kaksi uutta täyttä tulostarkistetta. Vanhan lehmänmaitosidoksen palautus hylätään. Korjausta edeltävän työhaaran paikallinen testi vaatii vanhan profiilin, joten paikallista tulosta ei esitetä uuden mainin integraatiotestinä.

Integraation vertailu sallii ainoastaan kaksi edellä rajattua ulkoista HOLD-tulosmuutosta ja kaksi #182:n kenttäkohtaista poikkeamaa; muut 322 täydellistä tulosobjektia, kaikki 87 hyväksyttyä versiota ja 326 makropakettia pysyvät alkuperäisvertailussa. Kaksi nykyistä input/evidence-sidospoikkeamaa kirjataan täsmällisesti; kuitteja ei päivitetä eikä poikkeamia nimetä hyväksynnäksi. Vanhojen julkaisutestien muuttumaton näkymä palauttaa vain nämä kaksi HOLD-tapausta historiallista vertailua varten. Riippumaton nykytilan testi estää näkymää peittämästä palautusta tai muuta muutosta.

Mainin syöte luettiin Git-objektista erilliseen scratchiin ja toistettiin readFile-sovittimella virallisessa laskentaputkessa. Vain nämä kaksi täyttä tulosta muuttuivat, molemmat jäivät ilman numeroa ja kaikki 87 versiota säilyivät. Tuotantosyötetiedostoa ei kirjoitettu eikä haaraa synkronoitu mainiin. Varsinainen integraatiovarmistus kuuluu PR:n CI-mergekommitille.

## Ehdokkaiden toistaminen

`candidates.json` sisältää 30 täsmäpatchia ja jokaisen alkuperäisen ehdotuksen käsittelypäätöksen. `site/scripts/legacy-gk-corrections.ts` tarkistaa yhdeksän asianomaisen reseptiobjektin SHA:t sekä arvioitujen lähdetietueiden ja katselmointitekstin tarkisteet ja muodostaa ehdokkaat muistissa. Se ei kirjoita syötteitä, julkaisutietoja, sidoksia eikä hyväksyntöjä. Asianomaisen reseptin muuttuminen estää vanhojen patchien käyttämisen; muiden reseptien nopeusajot eivät pysähdy tämän sidoksen vuoksi. Koko syötetiedoston vanha LF-SHA säilyy vain historiaviitteenä.

Varmista ensin tavallisella buildilla, että `tmp/nutrition/glycemic-load-pilot.json` on tämän HEADin tuore tulos. Toista sitten repon `site`-hakemistossa: `npx tsx scripts/legacy-gk-corrections.ts`. Tuloksen `publicationAuthorized` ja `sourceApprovalGranted` ovat false. GI-/identiteettikarsinnan jälkeen kaikki vanhat ehdokkaat pysyvät lähdepuutteellisina. Nykyiset hyväksytyt alkuperäis- ja GK-versiot pysyvät erillisinä. Laskennallinen tulos ei ole lähde- tai julkaisuhyväksyntä.

## #133:n ja #226:n lähde- ja sisältöpäätökset

`source-review.json` tallentaa kaikki 17 GI-päätöstä, alkuperäislähteet, rajaukset ja nykyisten seuraajien täydet tarkisteet. Päärynä38 ja tomaatti 22 säilyvät nykyisen katalogin nimenomaisesti rajaamina analogioina. Muut 15 sidosta jäävät pois vain uusista katselmointiehdokkaista: ryhmäkeskiarvo ei yksin osoita uuden ruoan valmistusmatchia. Nykyistä julkaistua lähdepolitiikkaa tai hyväksyttyä lukua ei muuteta.

| Tapaus | Turvallinen jatko |
| --- | --- |
| Bulgogi | Säilytä GK-only 41,31: punnitut 72 g soijaa,14 g sokeria ja 40 g kevätsipulia. Vanha kappalemuunnos 30 g ei korvaa tätä versiota. |
| Koshari | Säilytä nykyisen alkuperäisohjeen 48,49. Sen hyväksytty syöte ei sisällä vanhan ehdokkaan maissitärkkelysriviä. |
| Yangzhou-riisi | Säilytä nykyinen 25,08, punnittu 30 g soijaa ja 27,4 g öljyä. Vanha lusikkamuunnos 36/27 g ei korvaa hyväksyttyä versiota. |
| Masala dosa | Säilytä GK-only 57,8025–63,495: nimetty riisi, urad dal ja 500 g kypsää valutettua perunaa sekä omat määrät. Vanhan 500 g raaka-perunaehdokkaan 49,75 ei ole tämän version arvo. |
| Paputostada | Säilytä GK-only 16,638165: kuusi nimettyä Saníssimo-tostadaa 72 g. Vanha geneerinen 100 g tortilla ei ole sama tuote tai määrä. |
| Soba-aamiaiskeitto | Säilytä GK-only 20,4311: Muso NDL030, 50 g pinaattia ja nimetyt liemet. Geneeristä sobaa ei korvata automaattisesti näillä tiedoilla. |
| Baozi | HOLD kotireseptille. Olemassa oleva noin 33 GK on historiallinen 154,7 g char siew pau -tutkimusannos; se ei ole kotireseptin arvio. |
| Kreikkalainen moussaka | HOLD alkuperäisohjeelle: puuttuvat valmistusmatchit; keitetyn perunan GI ei ratkaise paahdettua/uuniperunaa. |
| Bubur sumsum | HOLD alkuperäisohjeelle: riisijauhopuuron valmistusmatch ja palmusokerin identiteetti/koostumus puuttuvat. |

Kuusi turvallista nykyrajausta jää käyttöön. Kolmen muun kotireseptin yhdeksän GI-riviä vaatii edelleen lähdetyötä; turvallinen pidätyspäätös ei tuota puuttuvaa GI-näyttöä.

IFCT2017:n alkuperäinen PDF tarkistettiin SHA-256:lla ja taulukkosivut 42, 54 ja 55 luettiin myös kuvina. Urad dalin raaka koostumus löytyy riviltä B003, ei vihreän/ruskean linssin tietueesta. InkiväärinG014 natiivi CHOAVLDF 8,97 antaa 10 g/4 annoksesta 0,22425 g; vanha 0,1-ehdokas korjataan. CurrylehtienG010 4,51 ja sinapinsiementenH013 16,80 ovat lähteen natiivilukuja; 3 g sinappilusikka on yhä oletus. IFCT:n oikeus-, komponenttipohja- ja polyolirajoja ei ohiteta eikä natiivilukua nimetä automaattisesti EU_AVAILABLE-arvoksi. Jo hyväksytyn erillisen dosa-version lähderajausta ei avata uudelleen.

`verify_source_components.py` tarkistaa riippumattomalla Decimal-laskennalla seitsemän alkuperäistä komponenttilaskelmaa ja viisi jatkoselvityksen kontrollia. Soijan 1,71 g ja baozi-tärkkelyksen 1,505 g CHO/annos eivät mahdu yksittäisen GI-puuttuvan rivin alle 1 g:n poisjättöön. Avokadon 0,462 g on positiivinen osuus; se ei ratkaise tostadan valmistusmatchia.

## Kolmen alkuperäisohjeen jatkoselvitys

`source-review.json`-tiedoston `deepOriginalCaseReview` erottaa varmennetun lähdeluvun sen soveltamisesta kotireseptiin. Kolmen ohjeen kokonais-GK pysyy HOLDissa. Hyväksyttyihin 87 versioon, nykyisiin tuloksiin tai makropaketteihin ei tehdä uusia muutoksia.

- **Baozi:** [Yang ym. 2006](https://www.wjgnet.com/1007-9327/full/v12/i21/3430.htm), taulukko 2, raportoi kokonaiselle höyrytetylle liha-sipulisämpylälle GI 39,1, SD 13,0, n 10, glukoosivertailu ja 50 g testikuorma. Tämä on lähempi tuoteryhmä kuin grilliporsassämpylä, mutta taikina-/täytesuhteita ei ilmoiteta. Atkinson 2021:n rivin 2048 SEM 4 vastaa SD:n muunnosta; taulukon annos-GL 14 ei ole kotireseptin GK. Nykyisessä baozi-makroevidenssissä maissitärkkelys on sidottu perunatärkkelys-ID 162:een ja 8 gramman lusikkamassaan. Nykyisen Fineli 27:n vastaava viitemassa on 7 g; myös soijan vanha 30 g/2 rkl eroaa viitearvosta 36 g. Pelkkien näiden komponenttien CHO-ero on yhteensä +0,0155 g/annos, mutta se ei ole varmennettu kokonaismakrokorjaus. Hiiva, kaalista poistettu neste ja muut määrän/retention oletukset jäävät katselmoitaviksi. Julkaistua 80,36 g CHO-lukua ei hyväksytä uudeksi whole-food-laskennan syötteeksi tämän kertolaskun perusteella.
- **Moussaka:** [Henry ym. 2005](https://doi.org/10.1079/BJN20051594), taulukon 2 rivi 60, koskee kaupallista lammasmoussakaa. GI 35, SEM 8 ja n 10 varmennettiin alkuperäis-PDF:stä. Annosmassan 329,6 g ja pitoisuuden 9,1 g/100 g tulo on 29,9936 g; §-alaviite ilmoittaa 25 g:n testin ja vertailun. Molemmat säilytetään eikä GI:tä skaalata ristiriidan korjaamiseksi. Historialliset suhteet ja kotitekoisen naudanliha-béchamel-vuoan vastaavuus puuttuvat. Kokonaisen valmisruoan GI ei ole vehnäjauhon tai kastikkeen GI, eikä SEM ole kotireseptin vaihteluväli.
- **Bubur sumsum:** käyttäjä vastasi pandan 150 g:n käsittelystä, ettei tiedä, ja määräsi kohdan säilytettäväksi HOLDissa. Sitä ei muuteta aromilehtien määräksi tai nollaksi. [UMIN000023807](https://center6.umin.ac.jp/cgi-open-bin/ctr_e/ctr_view.cgi?recptno=R000027299) raportoi palmusokerikokeen tuloksia, mutta testituotteen vastaavuus tähän reseptiin puuttuu ja rekisteri nimeää journal-julkaisun julkaisemattomaksi. Rekisterin 66,35 ei ole yleinen palmusokeri-GI. Verkossa löytyneen bubur sumsum 72 -taulukon alkuperäistä ihmiskoetta ja testireseptiä ei varmistettu; lukua ei oteta käyttöön. Myös kookosmaidon valmiste/tiheys, sokerin laji ja vesi-/liemivaihtoehto jäävät auki.

Turvallisesti ratkaistiin lähteiden identiteetti, SD/SEM-erottelu, baozi-makroevidenssin kaksi täsmällistä tarkistuskohdetta sekä hylätyt numero-oikopolut. Näistä ei seuraa uutta kotireseptin GK-hyväksyntää. `verify_source_components.py` toistaa 12 komponentti- ja kontrollilaskelmaa. Alkuperäisten reseptitekstien ja kahden makroevidenssin LF-tarkisteet on sidottu katselmointiin; niiden muuttuminen vaatii lähdearvion päivityksen. Alkuperäisjulkaisujen PDF:t ja kuvat säilyvät vain paikallisessa scratchissa, eivät tässä repossa.

## Historiallinen aineisto

- [#133:n lähdearvio, 30 muutosesitystä, 326 reseptin inventaario, viisi erillistä ravintoarvoehdotusta ja HOLD-päätökset](https://github.com/ozirix-dev/Reseptit/blob/020b665582f4f1ec54e56ec978581e424adc6ace/docs/nutrition/gk-r2-review.md). Vanha 83/326-tilanne ei ole nykyinen tuotantotilanne. Inventaarion työkalua ja vanhoja 326 sidosta ei oteta nykyiseksi oletukseksi.
- [#229:n 33 reseptin seulonta, bindaetteok-skenaarion lähde- ja valmistusrajaukset sekä laskentapäätökset](https://github.com/ozirix-dev/Reseptit/blob/2b50b18af9b473337d7ddad8d37a660547f1d63d/docs/nutrition/gk80-estimated-ranges-2026-11-03.md). Toistettava ehdollinen laskenta säilyy tutkimusskriptinä ja testeissä; se ei ole hyväksytty nykyinen GK-versio.
- [#226:n alkuperäinen rajattu muutos ja tutkimuspäätökset](https://github.com/ozirix-dev/Reseptit/commit/cba54cfdc00b73460c7d8b9686bc97bcbc90d834). Nykyinen avokadon koostumus ja julkaisun pidätys näkyvät uudessa ehdokaspaketissa.
- [#182:n alkuperäinen lähdekorjaus ja päätöshistoria](https://github.com/ozirix-dev/Reseptit/commit/924a827b515f4d4e27d70389837e22f904d38c1f). Kolmen solun lähdekoordinaatit, alkuperäistarkiste ja riippumaton Decimal-tarkistin säilyvät `../afcd-field-bindings/`-hakemistossa.

Toisen nopeus-/GK100-ajon työpuihin tai haaroihin ei kirjoiteta tämän sovituksen yhteydessä.

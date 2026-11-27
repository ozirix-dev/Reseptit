# RFC: Recipavo UX 2.0 – jatkuva käyttäjäkokemuksen tutkimus ja kehittäminen

**Tila:** DRAFT / EHDOTUS / HOLD toteutukselle.
**Päiväys:** 26.11.2026. **Työn omistaja:** Chat 5.
**Lähdeperusta:** main `45605d813980bd6c6a6af08e75e4678c68edf1b8` suunnitelman valmisteluhetkellä.

Tämä dokumentti on tutkimusohjelma ja ehdotettu toimintamalli. Se ei ole normatiivinen projektiohje, käyttöliittymän muutospäätös, lupa analytiikan laajentamiseen, hyväksytty CI-portti tai julkaisulupa. Tutkimushypoteesit ja tavoiterajat eivät ole mitattuja tuloksia.

## 1. Tarkoitus, rajaus ja suhde nykyiseen työhön

Recipavon käyttäjälle keskeiset tehtävät ovat löytää sopiva resepti, ymmärtää sen sisältö, arvioida soveltuvuus omaan tarpeeseen ja valmistaa ruoka onnistuneesti. Kehitetään näitä tehtäviä eikä ominaisuuksien lukumäärää. Säilytetään toimiva visuaalinen identiteetti, nelikielisyys FI/EN/SV/TH, nopea sivusto, indeksoitavuus ja nykyinen sisällön sekä ravinto- ja GK-tietojen oikeellisuus.

Tämä RFC jatkaa aiempaa UX-000–012-tutkimusta ja WP-01–06-korjausohjelmaa. Se täydentää [Chat 2:n kokonaisauditoinnin #982](https://github.com/ozirix-dev/Reseptit/pull/982) viidettä tutkimusta (visuaalinen viimeistely) ja siihen liittyvää asiakaskielen näkökulmaa; ei korvaa RFC:tä, muuta sen omistajuutta tai aloita rinnakkaista arkkitehtuuri-, CI-, sisältö- tai GK-tutkimusta. Yhteiset löydökset deduplikoidaan. Projektin [ulkoasu- ja käytettävyyslinja](../ulkoasu-ja-kaytettavyys.md), [AGENTS.md](../../AGENTS.md) ja [työnomistajuusohje](../rinnakkaisten-chatien-omistajuus.md) ovat ensisijaisia.

Aiemman ohjelman tilanne suunnitelman laatimishetkellä:

| Kohde | Rajaus | Tilanne valmisteluhetkellä |
| --- | --- | --- |
| [#1013](https://github.com/ozirix-dev/Reseptit/pull/1013) / WP-01–02 | Suostumus, näppäimistöfokus, mobiilivalikko | Draft, HEAD 0f48585f |
| [#1015](https://github.com/ozirix-dev/Reseptit/pull/1015) / WP-03 | Ruotsinkielinen hakurelevanssi | Draft, HEAD c34903ed |
| [#1016](https://github.com/ozirix-dev/Reseptit/pull/1016) / WP-04 | Kuvien regressiot | Yhdistetty mainiin 45605d81; tuotantovarmennusta ei väitetä |
| [#1018](https://github.com/ozirix-dev/Reseptit/pull/1018) / WP-05 | Tulostus, annokset, ravintotiedon rajaukset | Draft, HEAD a58a4e4a |
| WP-06 | Täydentävä tutkimus ja julkaisuluovutus | Aiempi suunnitelma ja osanäyttö; ei täyden WCAG-vaatimustenmukaisuuden osoitusta |

GitHub ja tuotannon täsmärevisio ovat ajantasaisen tilan lähteet. Taulukko on historiallinen lähtökuva. Tämän RFC:n avaaminen ei aktivoi yllä olevia töitä uudelleen. Käynnissä olevat PR:t käsitellään omassa työnkulussaan. Uusi tutkimusvaihe alkaa vasta niiden sovitun tuotantovarmennuksen ja omistajan hyväksymän tutkimusrajauksen jälkeen. Reseptituotantoa ei pysäytetä.

## 2. Tutkimuksen periaatteet

1. **Käyttäjän tehtävä ennen ominaisuutta.** Havaittu ongelma ja sen vaikutus ennen ratkaisuehdotusta.
2. **Säilytä hyvä.** Nykyinen käyttöliittymä, komponentit, osoitteet, julkaistavat sisällöt ja selkeä ulkoasu ovat lähtökohta. Ei laajaa redesignia tai uutta riippuvuutta oletushyödyn takia.
3. **Erota näytön lajit.** Automaattinen testi, asiantuntijahavainto, simuloitu tehtävä, aito käyttäjätesti ja kenttädata ovat eri näyttöä. Yhden tulosta ei nimetä toiseksi.
4. **Yksi vertailukelpoinen aineisto.** Sama resepti-identiteetti, kieli, annostila, suostumustila, sivutyyppi ja mittausasetukset ennen/jälkeen. Tallenna poikkeamat.
5. **Turvallisuus ja oikeellisuus ensisijaisia.** Ruokaturvallisuus, allergia, ravinto/GK, suostumus ja yksityisyys eivät ole käyttöliittymäoptimoinnin vaihdettavia kustannuksia.
6. **Pienin riittävä muutos.** Toteuta vain hyväksytty näyttöön perustuva korjaus, käytä nykyisiä testejä, vältä uutta rinnakkaista infrastruktuuria.

## 3. Työvaiheet ja päätösportit

| Vaihe | Työ | Valmistumisen näyttö |
| --- | --- | --- |
| G0 – nykyisen ohjelman sulkeminen | #1013/#1015/#1016/#1018; Chat 1:n integraatio ja julkaisu | Sovittujen korjausten päätökset, täsmä-SHA, CI ja todellinen tuotantovarmennus; avoimet HOLDit eroteltu |
| G1 – tuotannon lähtötaso | Kiinnitä uusi main/live-revisio, julkaistu sisältö, mittausprotokolla, vanhojen löydösten tila | Lähtötasoraportti; ei avata ratkaistuja löydöksiä uudestaan |
| G2 – tehtäväpolut | UX-013–016, rajattu mobiili- ja desktop-otos | Tehtäväkohtainen näyttö, priorisoidut löydökset ja säilytettävät ratkaisut |
| G3 – syventävä tutkimus | UX-017–023 käytettävissä olevalla näytöllä | Dokumentoidut menetelmät, tulokset, rajoitukset ja riippuvuudet |
| G4 – korjauspäätökset | Yksi deduplikoitu jono; omistajan päätös hyväksytystä erästä | Kullekin ehdotukselle hyöty, riski, rajaus ja hyväksyntätesti |
| G5 – rajattu toteutus | Vain erikseen hyväksytyt korjaukset nykyisessä PR-työnkulussa | Täsmä-HEAD/base, testit, riippumaton katselmointi, Chat 1:n portit |
| G6 – seuranta | UX-024, tuotannon jälkivarmennus, tutkimusjonon päivitys | Todellinen vaikutus verrattuna lähtötasoon ja sovittu ylläpitomalli |

Vaiheistus on ehdotus, ei kalenterilupaus. G3:n tutkimukset voivat edetä rinnakkain vain, kun aineistot, roolit ja oikeudet sallivat sen. Kenttäaineiston tai osallistujien puuttuminen merkitään avoimeksi eikä sillä tarpeettomasti estetä todennettua, rajattua teknistä virhekorjausta. G0–G1:n kriittisen löydöksen käsittely tapahtuu nykyisessä hyväksytyssä työnkulussa. RFC:n yhdistäminen dokumenttina ei käynnistä vaiheita G2–G6 eikä myönnä toteutusvaltuutta.

## 4. Yhteinen menetelmä ja otanta

Kiinnitä jokaiselle tutkimuserälle:

- tutkimustunnus, päivä, omistaja, kysymys, ennalta kirjattu onnistumiskriteeri ja käytetty menetelmä;
- main-SHA, testattu HEAD/base tai yhdistetyn ehdokkaan SHA; tuotannon todellinen commit-otsake ja URL, kun sovellettavissa;
- selain/moottori, versio, laite, viewport, natiivi zoom, verkkoprofiili, suostumustila, mahdollinen JavaScriptin ja välimuistin tila;
- tarkka sisältö- ja hakukorpuksen versio, otanta, testivaiheet, raakatulokset ja rajoitukset.

Ehdotettu otantakehys:

- Etusivu, reseptihaku, reseptisivu, GK-opas, Ruokaoppaan artikkeli, tietosuojasivu ja 404; kaikki soveltuvat kielet. Käytä oikeita julkaistuja reittejä ja varmista puuttuvan käännöksen fallback erikseen.
- Aiemman matriisin jatkuvuus: 4 sivutyyppiä × 4 kieltä × 8 leveyttä (320, 360, 390, 430, 768, 1024, 1440 ja 1920 CSS-px) = 128 tapausta. Suostumus- ja zoom-variaatiot pidetään erillisinä testiryhminä, ei lasketa samoja tapauksia kahteen kertaan.
- Reseptiotokseen eri kategoriat ja vaikeustasot, lyhyet ja pitkät otsikot, runsaat aineslistat, annosmuunnokset, valittava lisuke, puuttuva/osittainen ravintotieto, numeerinen ja määrittämätön GK. Samasta identiteetistä vertaillaan saatavilla olevat kieliversiot; ei luoda puuttuvaa käännöstä testin vuoksi.
- Säilytä vanha 60 hakukyselyn vertailuotos. Jos indeksi on kasvanut, raportoi aineiston muutos ja mahdolliset oikeutetut uudet osumat erillään hakukoodin regressiosta. Laajenna otosta ennalta kirjatuilla tehtäväkohtaisilla kontrollikyselyillä.
- Uudet laadulliset käyttäjäkokeet ehdotetaan aloittamaan pienellä 5–8 osallistujan pilotilla, jonka tarkoitus on testata protokollaa ja löytää ongelmia, ei arvioida kaikkien käyttäjien onnistumisprosenttia. Monikielinen jatko tarvitsee kielitaitoiset osallistujat ja realistisen kattavuussuunnitelman. Rekrytointi, tallennus, korvaukset ja mahdollinen ulkoinen palvelu vaativat erillisen hyväksynnän.

Poikkeamat, epäonnistuneet kokeet ja positiivisen kontrollin epäonnistuminen säilytetään. Mittari, jota ei voida luotettavasti mitata, on UNKNOWN/BLOCKED, ei nolla eikä PASS.

## 5. Tutkimuskokonaisuudet UX-013–024

### UX-013 – Ensimmäiset 30 sekuntia (P1)

**Kysymys:** löytääkö ensikertalainen nopeasti sivuston tarkoituksen ja tien resepteihin?

- Tehtävät: suora etusivukäynti ja suora reseptisivulle saapuminen; aloita haku, tunnista sivun kieli, löydä reseptin nimi ja päätoiminto. Aiemman suostumuskorjauksen vaikutus testataan tuoreessa ja jo valitussa tilassa.
- Mittaa ensimmäinen merkityksellinen toiminto, tehtävän onnistuminen, väärät aloitukset ja ymmärrys ilman johdattelevia vihjeitä. 30 sekunnin ikkuna on tutkimusasetelma, ei pakollinen aikaraja käyttäjälle.
- Tuotos: tehtäväpolkukartta, ensimmäisen ruudun ongelmat ja perusteltu säilytä/korjaa-päätös. Vain todettu pullonkaula voi johtaa ulkoasuehdotukseen.

### UX-014 – Reseptin löytämisen nopeus ja tarkkuus (P1)

**Kysymys:** löytääkö käyttäjä sopivan reseptin myös silloin, kun hän ei tiedä tarkkaa nimeä?

- Kyselyluokat: tarkka nimi, ainesosa, ruokalaji, keittiö, kirjoitusvariantti ja eri kielten taivutus; yhdistetyt hakusanat sekä käyttäjän valitsemat ruokavalio- ja muut suodattimet. Mukaan aidot nollatulokset, ei-oikeutetut osumat ja Takaisin-toiminto.
- Mittaa tehtävän onnistuminen, aika ensimmäiseen sopivaan tulokseen, ensimmäinen relevantti sijoitus, top-5-relevanssi ja nollatulosten palautumispolku. Hakurelevanssi arvioidaan etukäteen sovitulla kriteerillä, ei yksinomaan algoritmin sijoituksella.
- Säilytä nykyinen kieli- ja rakenteisten suodattimien oikeellisuus. Ainesosa- ja tarjoiluehdotusosumat erotetaan, eikä pelkkää tekstiosumaa tulkita ruokavaliosopivuuden todisteeksi.
- Tuotos: versiollinen kyselyaineisto, tulosvertailu ja rajatut ongelmat. Ei automaattista hakumoottorin vaihtoa.

### UX-015 – Mobiili ja ruoanlaittotilanne (P1)

**Kysymys:** voiko käyttäjä valmistaa ruokaa sujuvasti selainta käyttäen?

- Tehtävät: muuta annosmäärää, tarkista ainesosa ja määrä, palaa ohjeeseen, siirry vaiheesta toiseen, jatka keskeytyksen jälkeen, tulosta tai käytä nykyisiä toimintoja. Varmista ensin, mitä nykyinen toteutus jo tarjoaa.
- Tutki näkyvyys, kosketuskohteet, virhepainallukset, selaimen Taakse-toiminto, vierityksen säilyminen ja keskeytyksestä palautuminen. Testaa eri mittaiset reseptit ja neljä kieltä. Simuloidut työvaiheet eivät ole väite reseptin fyysisestä valmistustestistä.
- Hypoteeseja: valinnainen vaiheittainen keittiötila, näytön hereilläpito, suuret kontrollit, vaiheeseen liittyvät ainesosat ja ajastimet voisivat auttaa. Selvitä ensin olemassa olevien ominaisuuksien riittävyys, energiankulutus, selaintuki, saavutettavuus, keskeytys- ja fallback-käytös. Ajastin ei korvaa turvallisuusohjetta tai kypsyyden tarkistusta.
- Tuotos: tehtävätesti, havaintorekisteri, tarvittaessa ei-tuotannollinen prototyyppi ja hyötyarvio. Ei ominaisuuksien toteutusta tämän RFC:n nojalla.

### UX-016 – Ravinto- ja GK-tiedon ymmärrettävyys (P1)

**Kysymys:** erottaako käyttäjä oikein annoksen, koko valmistettavan erän, lisukkeen, hiilihydraatit, GK-arvion ja puuttuvan tiedon?

- Tehtävät: valitse syötävä annos, löydä annoskohtainen tieto, tulkitse arvio ja sen epävarmuus, vertaa lisukevaihtoehtoa ja löydä menetelmäselite. Valitse esimerkit yhdessä sisältö- ja ravintoasiantuntijan kanssa; käytä vain hyväksyttyä reseptiaineistoa.
- Mittaa tulkinnan oikeellisuus tehtäväkohtaisesti. Puuttuvan arvon tulkitseminen nollaksi, koko erän ja annoksen sekoittuminen tai GK:n tulkitseminen henkilökohtaiseksi verensokeriennusteeksi ovat kriittisiä ymmärrettävyyslöydöksiä.
- Tarkista sama tieto näytöllä ja paperilla, suljettujen tietolaatikoiden ja fallbackin vaikutus sekä termien vastaavuus neljällä kielellä.
- Tuotos: ymmärrystestit, termi- ja esitystapaehdotukset. Chat 3 vastaa laskenta- ja lähdesisällöstä; UX-tutkimus ei muuta arvoja, F25/GK-politiikkaa tai anna henkilökohtaista terveysohjausta. Osallistujilta ei pyydetä terveystietoja.

### UX-017 – Syventävä saavutettavuus (P2; kriittiset löydökset priorisoidaan)

- Kartoita aiemman 55 WCAG 2.2 A/AA -kriteerin rekisterin osanäytöt ja testaamattomat kohdat. Käytä [WCAG 2.2:n virallista määrittelyä](https://www.w3.org/TR/WCAG22/). Kirjaa soveltuvuus ja perustelu kriteerikohtaisesti, ei yleistä automaattista PASSia.
- Käsintestit: näppäimistö ja näkyvä fokus, dialogit, hakutulosten muutokset, lomakkeiden ilmoitukset, lang, otsikot, kontrasti, kosketusalueet, natiivi 200 % zoom ja 400 %/reflow soveltuvissa tilanteissa. Ruudunlukijalla testaa vähintään haku, reseptin ainesosat, annosvalinta ja valmistusvaiheet; ehdotetut laitteet Windows + NVDA ja yksi mobiilin VoiceOver/TalkBack-polku saatavuuden mukaan.
- Suostumuksen ja palautelomakkeen testaus eristetyssä ympäristössä; älä avaa palautteen vastaanottoa tai lähetä todellisia palautteita testin vuoksi.
- Tuotos: kriteerikohtainen näyttö ja prioriteettirekisteri. Automaatio tai yhden ruudunlukijan koe ei osoita koko palvelun WCAG 2.2 AA -vaatimustenmukaisuutta.

### UX-018 – Neljän kielen käyttökokemuksen yhdenmukaisuus (P2)

- Vertaa FI/EN/SV/TH samoilla identiteeteillä ja tehtävillä. Tarkista kielenvaihto, puuttuvan käännöksen ymmärrettävä ohjaus, thain rivittyminen, pitkät termit, yksikkö- ja lukumuodot, hakujen lokalisointi sekä painikkeiden ja ilmoitusten merkitys.
- Mittaa tehtäväkohtaiset läpäisyt ja kielikohtaiset ongelmat. Ei päätellä thai-tekstin semantiikkaa pelkän automaattikäännöksen tai ulkoasun perusteella. Tarvittaessa kielitaitoinen katselmointi.
- Tuotos: kielikohtainen delta ja yhteisen UI-tekstin korjausehdotukset. Varsinaiset reseptikäännökset jäävät sisältöomistajille.

### UX-019 – Kilpailijoiden käytännön tehtävävertailu (P2)

- Hyödynnä aiempaa 12 palvelun tekstilähdekatsausta. Valitse perustellusti 4–6 vertailupalvelua, esimerkiksi kielialueen reseptijulkaisuja ja ruoanlaittotyökaluja. Suorita samat julkisesti saatavilla olevat tehtävät samankaltaisessa laite- ja verkkotilassa.
- Kirjaa löydettävyys, tehtäväaskeleet, esteet, haku, keittiökäyttö, saavutettavuus ja suorituskyky. Maksumuuri, kirjautumisvaatimus, alueellinen esto ja eri sisältöjoukko ovat rajoituksia; ei keinotekoista paremmuuslistaa.
- Tuotos: vertailumatriisi ja 3–5 perusteltua hypoteesia, ei toisen palvelun ilmeen, tekstin tai yksityisen aineiston kopiointia. Erota asiantuntijan suoritukset aidosta käyttäjädatasta.

### UX-020 – Käyttäjäpolkujen analytiikka (P2)

- Selvitä ensin olemassa olevat sallitut mittarit, tapahtumamäärittelyt, suostumuksen vaikutus, aineiston kattavuus ja bottiliikenteen erottelu. Hyödynnä vain valtuutettua koontidataa, esimerkiksi olemassa olevaa Plausible-näkymää. GSC-hakunäkyvyys ei yksin mittaa ruoanlaittoa tai onnistumista.
- Tutkittavia koontisuhteita: saapumissivu → reseptiin siirtyminen; haku → reseptiin siirtyminen; reseptin annos-, ohje- ja tulostustoimintojen käyttö, jos vastaavat tapahtumat ovat jo olemassa ja hyväksytysti käytettävissä.
- Määritä jokaiselle suhdeluvulle osoittaja, nimittäjä, aikaväli, suostumuksen rajaus ja vähimmäisotos. Älä rakenna yksilöpolkua, päättele käyttäjän terveydentilaa, kerää raakaa hakutekstiä tai yhdistä henkilöitä palvelujen välillä. Ei uusia tapahtumia, tunnisteita, evästeitä tai verkko-POSTeja ilman erillistä tietosuoja- ja toteutuspäätöstä.
- Tuotos: mittarisanasto, nykyiset tietolähteet ja puuttuvien tietojen lista. Jos liitäntä tai data puuttuu, UNKNOWN; ei analytiikan avaamista tutkimuksen vuoksi.

### UX-021 – Core Web Vitals ja hitaat laitteet (P2)

- Kiinnitä vertailtava versio ja suorita toistuvat laboratoriomittaukset samoilla sivuilla ja profiileilla. Erottele kylmä ja lämmin lataus, hidas verkko/CPU, viivästetty hydraatio ja dynaamiset toiminnot. Käytä vähintään viittä toistoa kriittiselle vertailulle, raportoi mediaani ja hajonta sekä yksittäiset poikkeamat.
- Tarkista LCP, CLS, vuorovaikutuksen viive ja resurssibudjetit nykyisillä työkaluilla. CLS-kokeessa positiivinen kontrolli ja vertailukelpoinen mittaus ovat välttämättömiä. INP-kenttädataa ei korvata TBT:llä tai yksittäisellä synteettisellä klikkiviiveellä.
- Ehdotetut tutkimustavoitteet, jos riittävä kenttädata saatavilla: p75 LCP enintään 2,5 s, INP enintään 200 ms, CLS enintään 0,1; lisäksi ei olennaista regressiota nykyisestä hyvästä tasosta. Tarkista mittaushetkellä [Web Vitals -ohjeistus](https://web.dev/articles/vitals). Vertaa reitti- ja origin-tason otoksia erikseen; puuttuvaa CrUX-dataa ei merkitä nollaksi.
- Tuotos: before/after-mittaustaulukko, löydösten lähde ja korjausehdotus. Ei testibudjettien tai nykyisten CI-porttien muuttamista.

### UX-022 – Palaaminen ja toistuva käyttö (P3)

- Kysy, mihin tehtäviin käyttäjä haluaisi palata: arkiruoka, tuttu resepti, viikoittainen suunnittelu, erityisruokavalio, tulostettu ohje. Hyödynnä vain vapaaehtoista laadullista palautetta ja sallittuja koonteja.
- Arvioi paluupolun esteitä kuten löydettävyys, selaimen kirjanmerkit ja suorien linkkien toimivuus. Paluukäynti ei ole automaattisesti tyytyväisyyden osoitus. Ei käyttäjäprofiilien tai kirjautumisen rakentamista tämän tutkimuksen perusteella.
- Tuotos: toistuvien tarpeiden luokittelu, priorisoidut ongelmat ja mahdollinen säilytä nykyinen ratkaisu -päätös.

### UX-023 – Uusien ominaisuuksien hyötyarviointi (P3)

- Arvioi esimerkiksi keittiötila, ajastimet, ostoslistan hyöty, löydettävyyden parannukset ja henkilökohtaiset suosikit pelkkinä hypoteeseina. Tarkista aiemmat suunnitelmat ja olemassa olevat ominaisuudet, jotta ei tehdä rinnakkaista käyttäjäresepti- tai laskuripalvelua.
- Kullekin ehdotukselle: käyttäjän ongelma, näyttö tarpeesta, vaihtoehto ilman uutta ominaisuutta, tekninen ja sisällöllinen vaikutus, saavutettavuus, tietosuoja, ylläpitokustannus, suorituskyky, selaintuki ja no-JS/fallback. Prototyyppi vain hyväksytyssä eristetyssä ympäristössä.
- Tuotos: GO / SELVITÄ / EI TOTEUTETA -päätösehdotus. Toteutus edellyttää erillistä hyväksyttyä rajattua tehtävää ja omistajuutta.

### UX-024 – Pysyvä UX-regressioseuranta (P1)

- Inventoi olemassa olevat unit-, static-, Playwright-, reitti-, kuva-, preview- ja julkaisutarkistukset. Älä luo samoja testejä uudessa kehikossa.
- Muodosta riskiperusteinen UX-kohdekartta: globaalit komponentit, yksittäiset reitit, reseptilisäykset, haku, kuvat, sisältömetatiedot ja tulostus. Selvitä, mitä ajovalinta todella suorittaa. Koordinoi mahdollinen tuleva CI-muutos sen omistajan kanssa, ei tässä RFC:ssä.
- Tavoite: korjattu vika havaitaan uudelleen regressiotestissä; testiajurin vika erotetaan sovellusvirheestä. Pidä nykyiset pakolliset portit, SHA-sidonta, katselmointi ja erillinen julkaisulupa muuttumattomina.
- Tuotos: nykyisten testien kattavuuskartta, ehdotettu puuttuvien regressioiden jono, tuotannon käyttösavutesti ja ylläpidon raportointimalli.

## 6. Mittarit, vertailu ja ehdotetut päätösrajat

Seuraavat ovat suunnittelun lähtötavoitteita, eivät nykyisiä hyväksyttyjä portteja tai tuloksia. Täsmennä tehtäväkohtainen tavoite ennen mittausta. Pieni otos tuottaa laadullista näyttöä; prosentteja ei yleistetä koko käyttäjäkuntaan.

| Mittari | Määritelmä / tavoiteltava näyttö |
| --- | --- |
| Tehtävän onnistuminen | Onnistuneet / aloitetut tehtävät, avustettu ja keskeytetty erikseen; P1-polulla ei tunnettua estävää virhettä |
| Tehtäväaika | Mediaani ja hajonta onnistuneille suorituksille, keskeytykset erikseen; saman tehtävän vertailu ennen/jälkeen |
| Hakurelevanssi | Ensimmäinen oikea osuma, top-5 ja perustellut nollatulokset; aiempaan regressio-otokseen ei perusteettomia heikennyksiä |
| Fokuksen näkyvyys | Aiempi 128 tapauksen / 3840 fokusaskeleen vertailu, tavoite 0 todettua peittymistä; testiajurin kattavuus erikseen |
| Suostumuksen ja yksityisyyden toimivuus | Nykyiset suojat ennallaan; ei oikeita luvattomia verkkolähetyksiä |
| Annos- ja ravintotiedon tulkinta | Ennalta määritettyjen tulkintatehtävien oikeellisuus; ei tunnettua puuttuva = nolla -virhettä |
| Kielikattavuus | Sama tehtävä ja vertailukelpoinen reitti kaikilla soveltuvilla kielillä; puuttuva käännös ja fallback erikseen |
| Tulostus | Todelliset A4-sivut tarkastettu, oleellinen sisältö ja valittu annos näkyvät; ei pakotettua tietojen poisjättöä sivumäärän takia |
| Kuvaregressio | Nykyiset kuva-/kortti-/hero-testit, tarkoituksenmukainen rajaus ja lähdevariantti; ei automaattista semanttista alt-hyväksyntää |
| Saavutettavuus | Kriteerikohtainen näytön laji ja tila; ei tunnettua kriittistä estettä hyväksytyssä korjauksessa |
| Suorituskyky | Vertailukelpoinen laboratoriomediaani, kenttä-p75 vain riittävällä datalla; nykyiset budjetit säilyvät |
| Julkaisun jälkivarmennus | Todellinen live-revisio ja sovitut smoke-/route-/asset-tulokset; ei PASSia pelkän PR-CI:n perusteella |

Mittariston tarkoitus ei ole yksi mielivaltainen UX-pistemäärä. Raportoi kunkin mittarin rajattu tulos ja epävarmuus. Ei hyöty–riskilaskelmien näennäistarkkuutta tai optimointia vain mittarin parantamiseksi.

## 7. Yhtenäinen löydösjono ja priorisointi

Kullekin havainnolle pysyvä UX-tunniste, tutkimusryhmä, käyttäjän tehtävä, kuvaus, toistovaiheet, laite/kieli/tila, revisio ja näyttö, vaikutus, todennäköinen syy (erillään todetusta), ehdotus, säilytettävä käytös, riippuvuudet, omistaja, hyväksyntäkriteerit ja tila. Linkitä aiempaan havaintoon tai PR:ään uuden päällekkäisen tunnisteen sijaan.

- **P0:** kriittinen turvallisuus-, tietosuoja- tai oikeellisuusvirhe. Ilmoita omistajalle sovitussa kanavassa; ei automaattista julkista yksityiskohtien paljastamista.
- **P1:** olennainen käyttäjätehtävän estyminen, saavutettavuus- tai merkityksellisen tiedon tulkintavirhe. Ensin rajattu näyttö ja priorisoitu korjauspäätös.
- **P2:** toistuva kitka, selkeä laadullinen hyöty tai riski. Vertaile vaikutus, työ ja vaihtoehdot.
- **P3:** visuaalinen viimeistely, mukavuus tai vielä todistamaton ominaisuushypoteesi.

Tilat: HAVAITTU / VARMENNETTU / EHDOTUS / HYVÄKSYTTY / TOTEUTUKSESSA / TESTATTU / MERGED / TUOTANNOSSA VARMENNETTU / HOLD / EI TOIMENPIDETTÄ. MERGED ei tarkoita tuotannossa varmennettua. Löydöksen prioriteetti ja testauksen tila eivät ole sama asia.

Yhdistä saman juurisyyn toistot yhdeksi korjauskohteeksi. Yksi riippumaton riittävä katselmointi täsmäversiolle nykyisten ohjeiden mukaan; laajempi näyttö tarvittaessa riskin perusteella. Älä pyydä käyttäjää hyväksymään jokaisen mittausrivin tulosta erikseen. Erillistä hyväksyntää vaativat toteutus, henkilötietojen käsittely, kustannukset, uudet oikeudet, hyväksyntäportin muutokset ja julkaisu nykyisen työnjaon mukaan.

## 8. Ehdotus jatkuvan valvonnan rytmiksi

| Ajankohta | Toimenpide | Vastuu / rajaus |
| --- | --- | --- |
| Jokainen UX:ään vaikuttava PR | Soveltuvat olemassa olevat regressiot ja rajattu delta | Haaran omistaja; Chat 2:n riippumaton QA tarpeen mukaan |
| Jokainen julkaisu | Täsmärevision ja sovittujen käyttäjäpolkujen käyttösavutesti | Chat 1 koordinoi julkaisua; Chat 5 voi tarkistaa UX-osuuden |
| Viikoittain | Hakurelevanssin, saavutettavuuden ja kuvien rajattu otanta; uudet havainnot | Chat 5, mieluiten olemassa olevilla välineillä |
| Kuukausittain | Käyttäjäpolkujen koonti, trendit, regressiot ja kehityspäätökset | Chat 5, saatavilla oleva valtuutettu data |
| Neljännesvuosittain | Rajattu tehtävävertailu, tutkimusohjelman päivitys ja ylläpitokuorma | Chat 5 + omistaja |

Tiheydet ovat ehdotuksia. Tarkista olemassa olevat ajastukset ja päällekkäisyydet ennen toteutusta. Automaattista ajastusta ei tässä PR:ssä luoda. Hälytys on tutkimuslöydös, ei automaattinen PR-, Ready-, merge-, rollback- tai deploy-toimi. Häiriötilanteessa tarkista ensin muuttunut revisio ja mittausympäristö. Rajoita toistot ja kustannukset; jos sama tunnettu vika ei ole muuttunut, päivitä olemassa olevaa havaintoa.

## 9. Vastuut ja aineiston säilytys

| Rooli | Vastuu |
| --- | --- |
| Käyttäjä / tuotteen omistaja | Tavoitteet, hyväksytty tutkimus- ja toteutusrajaus, erilliset oikeus-/kustannuspäätökset |
| Chat 5 | UX-tutkimus, löydösjono, omat rajatut muutokset, näyttö ja luovutukset |
| Chat 2 | Riippumaton laadunvarmistus sovittuun deltaan; ei oman työn itsehyväksyntää |
| Chat 3 / sisältöomistajat | Reseptien, käännösten, ravinto- ja GK-sisällön oikeellisuus ja omat päätökset |
| Nykyinen CI/optimointityön omistaja | Mahdolliset erilliset hyväksytyt testivalinnan ja prosessin muutokset |
| Kokki-Codex | Erikseen valtuutetut paikalliset testit ja tekniset toteutukset; yksi kirjoittaja/haara |
| Chat 1 (Pääkokki) | Integraatio, suojattu Ready/merge, main-CI, julkaisu ja kokonaiskoordinaatio |

GitHubissa säilytetään julkiseen repoon sopiva suunnitelma, päätökset ja rajatut tekniset viitteet. Raaka-aineisto, osallistujatiedot, yksityiset tutkimusmuistiot ja mahdollisesti arkaluonteiset kuvakaappaukset eivät kuulu julkiseen repoon. Käytä hyväksyttyä Library/ReportHub-säilytystä vain sen omien oikeuksien ja validaattorien mukaisesti. Erota raakadata ja yhteenveto, sido näyttö versioon ja tarkistussummaan, dokumentoi rajaus. Älä kerää henkilötietoja tarpeettomasti; mahdolliselle käyttäjätutkimukselle sovitaan etukäteen suostumus, säilytys, käyttöoikeudet ja poistaminen.

## 10. Ensimmäinen ehdotettu toteutettava tutkimuserä

Kun G0 on aidosti valmis, ehdotus G1/G2:n ensimmäisestä erästä:

1. Kiinnitä tuotantoversio ja tarkista vanhojen löydösten päätökset. Tee vain sovittu tuotannon lukevan käyttösavutestin laajuus; älä toista hyväksyttyjä ehdokastestejä ilman muutosta tai perustetta.
2. Valitse vertailukelpoinen resepti- ja reittiotos ja julkaise mittaussuunnitelma ennen havaintojen keruuta.
3. Suorita UX-013–015:n eristetyt tehtäväpolut ja UX-016:n asiantuntijatasoinen esitystavan tarkistus; ehdota erikseen varsinaista käyttäjäpilottia.
4. Kirjaa löydökset yhteen rekisteriin, erottele P1-esteet, P2-kitkat ja hypoteesit. Vie todistetut virheet omistajalle; säilytä nykyinen toteutus, jos ongelmaa ei osoiteta.
5. Laadi yksi päätösraportti ja rajatut mahdolliset toteutusehdotukset; ei automaattisia PR:iä havainnoista.

## 11. Hyväksymisen ehdot ja tämän PR:n rajat

RFC:n sisällöllisen katselmoinnin kohteet: rajauksen johdonmukaisuus suhteessa #982:een ja WP-01–06:een, tutkimusten mitattavuus, tietosuoja, vastuut, järkevä kustannus ja nykyisten suojausten säilyminen.

Tämä PR muuttaa vain tämän suunnitelmadokumentin. Ei tuotantokoodia, reseptejä, käännöksiä, ravinto/GK-laskentaa, sisältörekistereitä, analytiikkaa, testejä, CI-valintaa, hyväksyntäportteja, julkaisuasetuksia tai AGENTS-ohjeita. Ei uutta palvelua, automaatiota, käyttäjärekrytointia tai maksullista työkalua. Ei toteutus- tai julkaisulupaa eikä toisen haaran omistajuuden siirtoa.

**Päätösehdotus:** hyväksy suunnitelma jatkotutkimuksen rungoksi sisällöllisen katselmoinnin jälkeen. Priorisoi ensin G0/G1 ja UX-013–016. Päätä laajennukset näytön perusteella. Reseptituotanto jatkuu normaalisti.

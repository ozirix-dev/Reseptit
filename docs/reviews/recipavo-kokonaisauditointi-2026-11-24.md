# Recipavo – viisi riippumatonta tutkimusta ja korjausten toteutusohjelma

**Tila: suunnittelu / DRAFT / HOLD.** Päiväys 24.11.2026. Työn omistaja: Chat 2. Tämä dokumentti on tutkimus- ja korjausehdotus, ei uusi normatiivinen työohje eikä lupa muuttaa tuotantoa tai turvallisuusportteja.

## 1. Tarkoitus ja lähtötilanne

Recipavo toimii julkisena nelikielisenä reseptisivustona. Tavoitteena on säilyttää jo toimiva kokonaisuus ja vähentää sen tarpeetonta monimutkaisuutta, nopeuttaa toimituksellista reseptituotantoa sekä viimeistellä asiakkaalle näkyvä kieli ja taitto.

Älä lähde siitä, että kaikki olemassa oleva olisi väärin. Etsi havaittavia ongelmia, niiden juurisyyt ja pienimmät vaikuttavat korjaukset. Tunnista myös ratkaisut, joita ei pidä muuttaa.

Tutkimus toteutetaan viitenä rajattuna, mielellään toisistaan riippumattomana selvityksenä. Vahvaa päättelymallia voidaan käyttää kriittiseen arviointiin, mutta jokainen merkittävä johtopäätös perustellaan lähdekoodilla, mittauksella, dokumentoidulla käyttäjätarpeella tai asianmukaisella tutkimusnäytöllä.

**Vaihe A:** tutkimus, vain luku. **Vaihe B:** löydösten yhdistäminen ja omistajan päätös. **Vaihe C:** hyväksyttyjen korjausten pienet, hallitut toteutuserät. Pelkkä tutkimusraportti ei automaattisesti oikeuta vaiheeseen C.

## 2. Lähteet ja vertailuperusta

- [AGENTS.md](../../AGENTS.md), [README](../../README.md) ja [ulkoasu- ja käytettävyyslinja](../ulkoasu-ja-kaytettavyys.md) määrittelevät nykyiset projektikohtaiset lähtökohdat.
- [Issue #969](https://github.com/ozirix-dev/Reseptit/issues/969) käsittelee reseptituotannon pilotteja ja käyttäjäreseptien tallennuksen erottamista julkaisuputkesta. Älä tee rinnakkaista käyttäjäreseptien arkkitehtuuria.
- [Pilotti 3 / PR #980](https://github.com/ozirix-dev/Reseptit/pull/980), [mittausmerkintä](https://github.com/ozirix-dev/Reseptit/issues/969#issuecomment-7132180499), [main-CI](https://github.com/ozirix-dev/Reseptit/actions/runs/45395518367) ja [tuotantoajo](https://github.com/ozirix-dev/Reseptit/actions/runs/45397753442).
- [Pilotti 4 / PR #981](https://github.com/ozirix-dev/Reseptit/pull/981) on suunnitelmaa laadittaessa keskeneräinen. Sen lopullinen mittausaineisto kerätään vasta valmistuttua; tulosta ei oleteta.
- [Mobiilin PageSpeed-vertailumittaus 24.11.2026](https://pagespeed.web.dev/analysis/https-www-recipavo-com/hoa613yejbarvuh6zuzkzz?form_factor=mobile): suorituskyky, saavutettavuus, parhaat käytännöt ja SEO kukin 100; FCP 0,9 s, LCP 1,7 s, TBT 0 ms, CLS 0, Speed Index 0,9 s. Yksittäinen laboratoriomittaus ei ole palvelutasolupaus tai todellisten käyttäjien kenttämittaus.
- Ossi Foundation: käytä vain käyttöoikeuksiesi sallimia, tehtävään liittyviä lähteitä olemassa olevan ulkoasuohjeen ja AGENTS.md:n mukaisesti. Älä kopioi yksityistä tutkimusmateriaalia tai assetteja julkiseen repoon. Jos aineistoon ei ole pääsyä, ilmoita rajoitus.

Ennen tutkimuksia kiinnitä vertailtava main-SHA ja tuotantorevisio. Lähtötilanne voi muuttua ennen pilotin 4 valmistumista. Vanhat raportit ovat historiallista näyttöä, eivät nykytilan auktoriteetti. Tarkista olemassa olevat korjaukset, avoimet PR:t, tiedosto-omistajuudet ja aiempien tutkimusten tulokset, jotta ratkaistua asiaa ei avata uudelleen.

## 3. Tutkimus 1 – Kokonaisarkkitehtuurin auditointi

**Kysymys:** Jos järjestelmä suunniteltaisiin nykyisellä tiedolla, mitkä osat olisivat edelleen tarpeellisia ja mitkä jäisivät pois?

Tutki toteutuksen, buildin, sisällön ja tietoaineistojen, skriptien, testien, riippuvuuksien sekä dokumentaation väliset rajat. Tunnista käyttämättömät komponentit, päällekkäiset toteutukset, historialliset poikkeukset ja vanhentuneet välivaiheet. Selvitä, onko samalla tiedolla useita kirjoittajia, tallennusmuotoja tai ristiriitaisia totuuslähteitä.

Laadi nykyisen toiminnan riippuvuuskuva ja luokittele ehdokkaat: säilytä, yksinkertaista, yhdistä, poista, selvitä lisää. Poistoehdotus tarvitsee näyttöä käyttöpaikoista, suorista ja epäsuorista riippuvuuksista sekä palautettavuudesta. Pelkkä tekstihaku, pieni käyttömäärä tai vanha tiedosto ei todista tarpeettomuutta.

Erota nykytilan havainnot sellaisista tulevaisuuden vaatimuksista, joita ei vielä toteuteta. Repo Guardin, ulkoisten palvelujen ja muiden repojen osalta arvioi rajapintoja; älä muuta niiden omistamia komponentteja Reseptit-PR:ssä. Älä kopioi yksityistä arkkitehtuuri- tai turvallisuusaineistoa tähän dokumenttiin.

**Tuotos:** näyttöön perustuva yksinkertaistamiskartta, poistoehdokkaat, riippuvuudet, vaikutusarvio, regressiot ja palautussuunnitelma.

## 4. Tutkimus 2 – Reseptien julkaisuputken optimointi

**Ensisijainen mitattava tehokkuuskohde.** Tutki koko reitti reseptin valmistelusta todelliseen tuotantovarmennukseen.

Pilotin 3 mittarit: ensimmäinen nelikielinen sisältöpaketti 10:01; kokonaisläpimeno 47:57; portteihin sidottu odotus 25:57; 220 ylätason työkalukutsua; 10 CI-ajoa, joista 5 omistajametadataa; yksi PR, yksi merge ja yksi tuotantoajo. Kaksi ravintoevidenssiin liittynyttä CI-virhettä korjattiin samassa PR:ssä. Käyttäjän raportoitu osallistuminen oli kaksi sovittua GitHub-toimenpidettä eikä teknisiä jatkopromptteja. Selvitä myös paikallisten suostumusten todellinen määrä, jos mittaustieto on saatavilla.

Vertaa kaikkia neljää pilottia, mutta huomioi vaikeusaste, eräkoko, aloitushetki ja työvaiheiden päällekkäisyys. Pilotin 4 tuloksista laske sekä koko erän että yksittäisen resepti-identiteetin tunnusluvut. Älä tulkitse seinäkelloajan lyhenemistä sellaisenaan token- tai rahasäästöksi.

Tutkimuskysymykset:
- Mitkä portit ovat aidosti eri tarkoitusta varten? Mitkä saman tarkistuksen tarpeettomia toistoja? Nimeä myös tilanteet, joissa uusi tarkistus on välttämätön muuttuneen HEADin, mainin tai julkaisutilan vuoksi.
- Miksi paikallinen valmistelu ei havainnut ennen PR:ää puuttuvaa ravintoerämanifestia? Selvitä paikallisen ja CI-validoinnin vastaavuus sekä mahdollinen yhteinen tarkistuskomento. Älä heikennä evidenssivaatimusta.
- Arvioi omistajametadatan ajotiheys, riskiperusteinen CI-valinta ja tarkastettujen tiedostojen delta-katselmointi.
- Arvioi build- ja artefaktien uudelleenkäyttö vain, jos täsmä-SHA, sisältö, tuotantoasetukset, kuva-aineisto ja artefaktin eheys voidaan todistaa. PR-buildia ei oleteta tuotantoartefaktiksi.
- Erota työkalukutsut toimintotyypeittäin: lukeminen, kirjoitus, testit, tilakyselyt, katselmointi ja raportointi. Etsi tarpeetonta toistoa, mutta älä optimoi kutsumäärää turvallisuuden tai oikeellisuuden kustannuksella.
- Mittaa tokenit ja kulut vain, jos todellinen käyttödata on saatavilla. Muuten merkitse tuntemattomaksi. Ei uusia maksullisia palveluita tai API-laskutusta.
- Arvioi eräjulkaisun sopiva koko ja poikkeusten käsittely mitatun aineiston perusteella, älä rakenna uutta järjestelmää pelkän oletuksen takia.

Säilytä nykyiset suojaus- ja julkaisuluvat, Repo Guard, SHA-sidonta, vaaditut CI-tarkistukset, sisältöevidenssi ja todellinen jälkivarmennus. Turvallisuusportin muuttaminen vaatii oman riskinarvion ja erillisen hyväksynnän. Käyttäjän sovittua tuotantokäynnistystä tai Environment-hyväksyntää ei poisteta tämän dokumentin perusteella.

**Tuotos:** vaihekohtainen aika- ja kustannusmalli, todistetut pullonkaulat ja priorisoidut optimointiehdotukset. Kullekin ehdotukselle ennen/jälkeen-mittaus, säilyvä suojaus, testaus ja hyväksymisraja. Suosi muutoksia, jotka vähentävät todellista työtä ilman uutta infrastruktuuria.

## 5. Tutkimus 3 – GK- ja ravintolaskennan tieteellinen arviointi

Tarkastele laskentamenetelmiä suhteessa ajantasaiseen ensisijaiseen tutkimusnäyttöön ja nykyiseen hyväksyttyyn projektipolitiikkaan. Selvitä mitatun ruokalajin GI:n ja ainesosapohjaisen GK-arvion ero. Tutki soveltuvia GI-lähteitä, puuttuvia arvoja, lähteiden sovitettavuutta, vähähiilihydraattisten aterioiden mahdollista perusteltua vaihteluväliä tai ylärajaa ja laskennallisen epävarmuuden ilmaisua. Älä oleta, että matala hiilihydraattimäärä todistaa numeerisen GK:n.

Tarkista EU-, USDA-, Fineli- ja AFCD-kenttien semantiikka, kuitu ja polyolit, yksiköt, syötävät määrät, annosjako sekä lähde- ja versiosidonta. Vertaa tieteellistä perustaa ja todellista laskentaevidenssiä; älä tee laskentakaavoihin tai julkaistuihin arvoihin muutoksia tutkimuksen aikana.

Valitse vertailuaineistoon tavallisia, vähähiilihydraattisia, polyoleja sisältäviä ja puutteellisen GI-näytön reseptejä. Erota laskutoimituksen oikeellisuus, lähdearvon soveltuvuus, kattavuus ja kliininen tulkinta. Puuttuva ei ole nolla. Aterian laskennallinen GK ei ole henkilökohtainen verensokeriennuste.

**Tuotos:** lähteistetty tieteellinen arvio, vertailulaskelmat, nykyisten sääntöjen säilytettävät osat sekä mahdolliset täsmälliset muutosehdotukset. Uusi laskentamenetelmä vaatii oman katselmoinnin, hyväksynnän ja regressiot ennen soveltamista.

## 6. Tutkimus 4 – Nelikielinen kielenhuolto ja toimituksellinen tyyli

Ossi Foundation ja Reseptit-projektin nykyinen ohjeistus toimivat lähtökohtina. Tarkasta todellista tuotantotekstiä suomeksi, englanniksi, ruotsiksi ja thaiksi. Erota käyttöliittymätekstit, reseptien toimituksellinen teksti, valmistusohjeet, ravinto-/GK-selitteet ja pakolliset turvallisuus- tai oikeudelliset ilmoitukset.

Etsi tekniseltä raportilta kuulostavia ilmaisuja, epäluontevia käännöksiä, päällekkäisiä huomautuksia, epäselviä yksikkömerkintöjä ja turhaa ammattisanastoa. Aloita yleisistä käyttöliittymäteksteistä, jotta mahdollinen parannus hyödyttää laajasti koko sivustoa. Valitse edustava otos eri reseptityypeistä, lyhyistä ja pitkistä otsikoista sekä tilanteista, joissa GK on saatavilla tai puuttuu.

Tee konkreettisia ennen/jälkeen-tekstiehdotuksia. Selkeä asiakaskieli ei saa muuttaa ainemääriä, valmistusturvallisuutta, allergeeneja, ravintoarvon merkitystä, lähdeviittauksia tai epävarmuutta. Syvennä teknistä tietoa tarvittaessa erillisenä lisätietona, älä piilota olennaista. Älä muuta kaikkia reseptejä vain yhden tyyliesimerkin takia.

**Tuotos:** lyhyt toimituksellinen tyyliopas, priorisoitu tekstikorjauslista ja kielikohtaiset esimerkit. Erottele yhteisten UI-tekstien korjaukset ja sisältömuutokset, joiden vaikutus edellyttää uutta resepti- tai käännöskatselmointia. Mahdollinen hyväksytty pysyvä tyylisääntö integroidaan nykyiseen ohjeeseen, ei rinnakkaiseksi sääntökokoelmaksi.

## 7. Tutkimus 5 – Etusivun ja reseptisivujen visuaalinen viimeistely

Omistajan alustava laadullinen arvio taitosta on noin 7/10. Tavoite on ammattimaisesti toimitettu ruokajulkaisu, ei perusteeton kokonaisuudistus.

Tutki oikeita tuotantonäkymiä mobiilissa, tabletilla ja työpöydällä. Huomioi nykyinen väri-identiteetti ja typografia, reseptikortit, kuvien rajaus, visuaalinen hierarkia, lukupalstan leveys, välistys, haku ja suodattimet, ainesosaluettelo, vaiheittainen ruoanlaitto sekä ravinto- ja GK-osio. Tarkasta kaikkien neljän kielen tekstipituudet ja erityisesti thai-kirjoituksen luettavuus. Tee rajattuja, konkreettisia taittoehdotuksia nykyisten komponenttien pohjalta.

Säilytä saavutettavuus, näppäimistökäyttö, zoom/reflow, kontrasti ja sivuston toiminta ilman tarpeetonta JavaScriptiä. Älä muuta URL-osoitteita, canonicaleja, hreflangia, Recipe JSON-LD:tä tai indeksointiperiaatetta ulkoasun vuoksi. Nykyinen hyvä PageSpeed-taso on säilytettävä; vertaa useita vastaavia mittauksia ennen/jälkeen ja tarkasta myös todellinen käyttäjäkokemus. Älä lisää fontteja, kirjastoja, animaatioita tai kuormitusta ilman havaittua hyötyä.

**Tuotos:** kuvallinen tai muuten selkeä nykytila–ehdotus-vertailu, perusteltu prioriteettilista ja rajatut komponenttikohtaiset korjaukset. Kielenhuollon päätökset huomioidaan ennen lopullista taittoa.

## 8. Yhteinen löydös- ja korjausjono

Kaikista viidestä tutkimuksesta muodostetaan yksi deduplikoitu jono. Kirjaa kukin löydös seuraavasti:

| Kenttä | Sisältö |
| --- | --- |
| Tunniste / tutkimus | Pysyvä paikallinen tunniste ja 1–5 |
| Havainto ja näyttö | Pinned SHA, polku, testi, mittaus tai tutkimuslähde |
| Nykyinen vaikutus | Käyttäjä, oikeellisuus, turvallisuus, aika, kustannus |
| Ehdotus | Pienin riittävä korjaus; myös poistaminen tai ei muutosta |
| Riippuvuudet | Olemassa olevat PR:t, korjaukset ja omistajuus |
| Hyöty / työ / riski | Perusteltu arvio, ei tekaistua tarkkuutta |
| Hyväksyntä ja testi | Säilytettävät ominaisuudet, mitattava ennen/jälkeen, regressiot |
| Tila | AVOIN / EHDOTUS / HYVÄKSYTTY / TOTEUTETTU / VARMENNETTU / HYLÄTTY / HOLD |

Priorisoi ensin todetut merkittävät oikeellisuus-, turvallisuus- ja saavutettavuusongelmat; seuraavaksi suuri mitattu hyöty pienellä riskillä ja työllä. Tämän jälkeen laajemmat muutokset, joiden hyöty on osoitettavissa. Tyyli- ja makukysymykset vaativat omistajan linjauksen. Älä käsittele julkisesti yksityisiä tai hyväksikäytettäviä turvallisuuslöydöksiä; toimita ne omistajalle asianmukaisesti rajatulla kanavalla.

Jos sama asia on jo korjattu, tarkista todellinen nykytila ja kirjaa **VARMENNETTU / ei uutta työtä**. Jos aiempi korjaus toimii osittain, jatka sen päälle omistajuuden ja nykyisten testien mukaisesti. Älä kumoa vanhaa korjausta tietämättä sen tarkoitusta.

## 9. Tutkimuksesta toteutukseen

1. Odota pilotin 4 todellista loppuraporttia; tämän suunnitelman avaaminen ei häiritse pilottia eikä anna lupaa käynnistää muuta työtä.
2. Toteuta hyväksytyt tutkimukset vain luku -tilassa. Tuo yhteiseen jonoon myös aiemmat vielä ajankohtaiset havainnot. Yksityisiä tuloksia ei julkaista julkiseen repoon.
3. Yhdistä päällekkäiset havainnot. Aseta korjauksille järjestys: arkkitehtuurin riippuvuudet → mitatut julkaisuprosessin parannukset → erikseen hyväksytyt laskentasäännöt → kielenhuolto → taitto. Turvallisuushavainto voidaan käsitellä ensin erillisenä, kiireellisenä työnä.
4. Esitä omistajalle päätettäväksi konkreettiset korjauserät, hyöty, rajaus ja testit. Älä pyydä hyväksyntää jokaiselle pikkuriville, kun yhtenäinen turvallinen erä voidaan hyväksyä kerralla.
5. Toteuta vain hyväksytyt korjaukset nykyisten työkalujen ja AGENTS.md:n mukaan. Yksi kirjoittaja per haara, rajattu diff, nykyinen testaus, riippumaton katselmointi tarpeen mukaan, Repo Guard ja Chat-1:n integraatiovastuu. Älä tee yhdestä laajasta tutkimus-Draftista seka-PR:ää, jossa on samanaikaisesti reseptejä, laskentapolitiikkaa, CSS:ää ja CI-muutoksia.
6. Kokoa samaan tarkoitukseen kuuluvat pienet korjaukset yhdeksi hallituksi PR:ksi. Erota merkittävät laskenta-, turvallisuus- ja julkaisuporttimuutokset omiksi riskiperusteisesti käsiteltäviksi kokonaisuuksiksi. Älä avaa viittä toteutus-PR:ää automaattisesti.
7. Varmenna vaikutus ennen/jälkeen-mittauksella ja todellisessa ympäristössä tarpeen mukaan. Jos hyötyä ei synny tai regressio ilmenee, pidä muutos HOLDissa ja arvioi turvallinen palautus nykyisellä menettelyllä.
8. Päivitä löydösjono toteutuksen ja todellisen varmennuksen jälkeen. Kirjaa erikseen hyväksytyt, toteutetut ja tuotannossa varmennetut muutokset. Älä julista työtä valmiiksi pelkän raportin tai vihreän CI:n perusteella.

## 10. Rajaukset ja onnistuminen

Tämä PR sisältää vain tämän suunnitelmadokumentin. Ei muutoksia AGENTS.md:hen, workflowihin, resepteihin, laskenta-aineistoon, käyttöliittymään, ympäristön asetuksiin tai tuotantoon. Ei uusia maksullisia palveluita, MCP-liittimiä, tietokantoja tai rinnakkaisia järjestelmiä. Tuleva ravintolaskuri ja käyttäjäreseptipalvelu eivät kuulu tämän auditoinnin toteutukseen.

Onnistuminen tarkoittaa mitattavasti vähemmän tarpeetonta työtä, säilyvää oikeellisuutta ja tietoturvaa, luontevampaa tekstiä sekä selkeämpää taittoa. Ei tavoitteellista koodirivien poistomäärää tai keinotekoisia pistemääriä. Jos jokin osa toimii jo hyvin, paras päätös voi olla jättää se ennalleen.

**Yhteinen tavoite: hyödynnä olemassa oleva tutkimus ja jo tehdyt korjaukset, tutki ennen muuttamista, korjaa perustellut löydökset ja varmista tulos. Säilytä toimiva Recipavo.**

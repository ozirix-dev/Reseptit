# GK100: yksi eräajo laskennasta Approval Factoryn tarkistukseen (suunnitelma)

**Tila:** `DRAFT / PLAN ONLY / EI TOTEUTUS- TAI JULKAISULUPAA`  
**Päivä:** 2026-11-05  
**Kohde:** Reseptit / GK100, myöhemmin Recipavon laskentaputken soveltuva osa  
**Omistajan tavoite:** laskenta ja Approval Factoryn tekninen tarkistus yhteen ohjattuun työnkulkuun. Ei tarvita kahta rinnakkaista Codex-istuntoa eikä samoja tarkistuksia kahteen kertaan. Yksittäiset laskenta- ja hyväksyntäkomponentit säilyvät erillisinä ja uudelleenkäytettävinä.

## 1. Miksi tämä kirjataan nyt?

Keskustelussa 5.11.2026 nousi esiin mahdollisuus naittaa nykyinen 326 reseptin GK-laskenta ja Approval Factoryn ehdokastarkistus yhdeksi peräkkäiseksi eräajoksi. Tämä suunnitelma säilyttää ajatuksen myöhempää käsittelyä varten. **Toteutus aloitetaan vasta sen jälkeen, kun käynnissä oleva GK100:n eräajon / läpimenon korjaus ja laskennan toimivuus on testattu ja hyväksytty.** Sen tulokset voivat muuttaa tätä suunnitelmaa.

Codexin 5.11. raportoiman paikallisen mittauksen mukaan nykyinen putki käsitteli 326 reseptiä kolmessa ajossa 9,2–11,0 sekunnissa ja SQLite V2 teki 73 hakua noin 7 ms:ssa. Nämä ovat käyttäjän toimittamia mittaustietoja, **eivät tämän PR:n uudelleen suorittamia benchmarkkeja**. Tarkoitus ei ole nopeuttaa hyvin toimivaa aritmetiikkaa vaan poistaa ylimääräinen manuaalinen työnjako, tietojen uudelleenlukeminen ja paketointikierrokset.

## 2. Nykyinen toteutus ja säilytettävät rajat

Olemassa olevat osat `main`-haarassa:

- `site/scripts/glycemic-load-pilot.ts` / `npm run audit:glycemic-load`: muodostaa laskentatulokset, puuttuvat tiedot, lähde-/syöte-/reseptitarkisteet sekä GK-versioiden kattavuusraportin.
- `site/scripts/gk100-approval-factory.ts`: `checkBatch`, `checkMixedReviewBatch`, `applyDecisions`, `prepareRelease`; ehdokkaan tekninen läpäisy, riski- ja sisältöluokitus, manifesti ja erilliset päätös-/julkaisuportit.
- `site/scripts/gk100-approval-cli.ts` / `npm run gk:approval-check`: `check`, `review-mixed` ja `prepare` täsmälliseen candidate-committiin sidottuna.
- `site/scripts/gk100-approval-release.ts`: julkaisupakettien SHA- ja valtuutustarkistukset.
- SQLite V2:n GI- ja ravintokoostumuslähteiden erähaku, olemassa olevat tutkimus- ja lähdesidokset.

Factoryn `checkBatch` voi palauttaa manifestin, jossa osa riveistä on `BLOCKED` / `FAIL`. Pelkkä komennon onnistunut suoritus tai `PASS` yksittäiselle tekniselle tarkistukselle **ei ole** `OWNER_APPROVED`, `RELEASE_READY` eikä `PUBLISHED`.

Eri rajoissa pysyvät asiat:
1. Deterministinen laskenta ei saa sisältö- tai lähdehyväksynnän valtuuksia.
2. Approval Factory ei päätä omistajan puolesta.
3. Tutkimusannokset pidetään erillään kotireseptien GK-kattavuudesta.
4. Muuttumattomia jo hyväksyttyjä versioita ei käsitellä uutena ehdokkaana.
5. Puuttuvat GI-, koostumus-, määrä- tai valmistusperusteet eivät saa muuttua nolliksi tai hyväksytyiksi tiedoiksi.

## 3. Ehdotettu toimintamalli — yksi komento, peräkkäiset vaiheet

**Ei tässä PR:ssä toteutettua komentoa.** Ehdotettu käyttöliittymä on esimerkiksi `npm run gk:batch-review`, joka kutsuu olemassa olevia moduuleja/komentoja; lopullinen nimi ja rajapinta päätetään pilotin jälkeen.

1. **Tilan lukitus:** tarkista repo, paikallisen työpuun tila, päähaaran commit, ehdokashaara ja syöteaineiston versiot. Käytä yhtä jäädytettyä lähtösnapshotia per erä. Selvitä muuttuneiden tiedostojen vaikutus.
2. **Laskenta:** aja nykyinen GK-auditointi tai käytä täsmälleen samasta syötesnapshotista jo varmennettua tulosta. Säilytä 326 reseptin statuslista, laskenta, esteet sekä syöte-/lähde-/reseptitarkisteet. Aritmetiikkaa ei kirjoiteta uudelleen.
3. **Ehdokasvalinta:** poimi vain aidosti uudet tai relevantisti muuttuneet, punnitut ja dokumentoidut ehdokaspaketit. Puuttuvan aineiston tapaukset siirtyvät tutkimusjonoon; niitä ei lähetetä Factoryyn teeskenneltyinä valmiina.
4. **Tekninen tarkistus:** aja olemassa oleva `checkBatch` samalle sinetöidylle candidate-commitille; käytä `review-mixed`-reittiä vain sen erillisten, nykyisten menetelmäehtojen puitteissa. Älä uudelleenimplementoi tehdasta. Älä laadi omistajapäätöksiä automaattisesti.
5. **Tulosluokitus:** kirjaa jokaista ID:tä kohti eroteltuina `CALCULATED`, puuttuva näyttö, `TECHNICALLY_VALID`, `REVIEW_REQUIRED`, `OWNER_DECISION`, `BLOCKED`, sekä jo hyväksytyt/julkaistut tilat lähteineen. Älä sekoita tutkimusjonon statuksia Factoryn tiloihin: säilytä niiden nimet ja viitteet rinnakkain.
6. **Yksi eräraportti:** muodosta koneellisesti luettava yhteenveto sekä lyhyt ihmisen luettava päätöstaulukko (ID, vanha/uusi tila, tärkein este, käytetty syöte- ja lähdeversio, Factoryn tekninen tulos, tarvittava päätös). Tallenna välitulokset tutkimuksen työtilaan, ei uutta PR:ää per ajo.
7. **Vain erillisestä valtuutuksesta:** `prepareRelease` ja `verifyReleaseBundle` nykyisine SHA-/omistajapäätös-/julkaisulupavaatimuksineen. Ei automaattista mergeä, deployta tai julkaisuvaltuutuksen luontia.

Erän ajaminen ei käynnistä kahta Codex-istuntoa eikä tee samaan aikaan muutoksia samoihin työpuihin. Työvaiheet ovat **peräkkäisiä**. Jos yhdestä paketista tulee estetty, muiden reseptien katselmointi jatkuu, mutta tilasta jää näkyvä huomio.

Jos uusia kelvollisia ehdokkaita on 0, tulos on `NO_NEW_CANDIDATES`, ei keinotekoinen Factory-hyväksyntä.

## 4. Käyttöönotto vasta mittauksen jälkeen

**Portti A — nykyisen työn valmistuminen**
- GK100:n läpimenokorjauksen eteneminen, loppuraportti ja vähintään rajattu pilotti on tarkistettu.
- Laskentamoottorin nykyinen 326 reseptin tulos, testit ja kattavuus on varmennettu käytetylle `main`-commitille.
- Eri Git-haaroissa olevat tutkimusehdotukset ja viimeisin Approval Factory -versio on sovitettu nykyiseen mainiin.

**Portti B — pieni toteutuskokeilu**
- Tutki, kattaako nykyinen korjattu eräajon ohjain tämän tarpeen jo ilman uutta koodia.
- Lisää korkeintaan ohut orkestrointikerros nykyisten CLI- tai TypeScript-funktioiden ympärille.
- Vertaa nykyistä kahden erillisen komennon työnkulkua yhden komennon kokeiluun: lopputulokset ja tarkisteet identtisiä, vähemmän käsityötä, ei turhia uusintahakuja.
- Ei massiivista uutta frameworkia, omaa hyväksyntämoottoria, rinnakkaista työnjonoa eikä kilpailijaa nykyiselle GK100-ajonohjaukselle.

**Portti C — regressiot, joita ei saa ohittaa**
- Kaikki 326 reseptiä säilyvät tarkistettavina ja aikaisemmat laskelmat / julkaistut GK-versiot pysyvät muuttumattomina.
- Reseptin ainesosamäärän, valmistusohjeen, GI-sidoksen tai syötehashin tarkoituksellinen muutos hylätään tai palautetaan asianmukaiseen katselmointiin.
- Kielimetadatan rajattu muutos ei vahingossa laukaise tieteellistä uusintatutkimusta; tuntematon reseptimuutos ei saa piiloutua palautusmekanismin taakse.
- Factory-manifestin osittaiset `FAIL` / `BLOCKED` -tilat näytetään eikä raporttia esitetä kokonaan läpäisseenä.
- Omistajapäätös-, manifesti- ja lähdetarkisteiden muutos mitätöi vanhan valtuutuksen.
- Tutkimusannos ei lisää kotireseptin GK-kattavuutta.
- Keskeytetty tai epäonnistunut ajo voidaan jatkaa hallitusti ilman duplikaattipaketteja tai kaksinkertaista hyväksyntää.

**Portti D — päätös**
- Jos kokeilu vähentää selvästi manuaalisia vaiheita ja tuottaa identtisen hyväksyntäraportin ilman turvallisuustason alenemista, rajattu toteutus voidaan ehdottaa erillisessä, katselmoitavassa PR:ssä.
- Jos hyötyä ei osoiteta tai nykyinen nopeuskorjaus jo ratkaisee ongelman, **ei toteuteta uutta ominaisuutta vain toteuttamisen vuoksi**. Tämä dokumentti jää päätösviitteeksi.

## 5. Päällekkäisyyksien ja työrauhan suoja

Tämä dokumentti ei muuta seuraavia eikä niiden työpuita:
- GK100:n meneillään oleva läpimenon/työjonon korjaus tutkimushaarassa `codex/gk100-rescue` tai sen toteutushaarassa.
- GK80 Controller #223 ja sen mahdolliset jatkot.
- Evidence Recovery / SQLite / Smart Review -työt (mm. #255 ja yhdistetty #265).
- Käännös- ja snapshot-yhteensopivuuden työ (mm. #278).
- Approval Factoryn aiemmat hyväksyntä- ja julkaisuportit.

Uuden suunnitelman toteutuksen omistaja tarkistaa ajantasaiset riippuvuudet uudelleen ennen uuden toteutus-PR:n avaamista. Tämä docs-only-suunnitelma ei luo automaattista jatkoajoa, CI:tä tai määräpäivää.

## 6. Käyttörajoitukset

Tässä Draft-PR:ssä on **ainoastaan tämä dokumentti**. Ei koodia, testimuutoksia, resepti-/ravintotietomuutoksia, SQLite- tai Factory-sääntömuutoksia, hyväksyntää, mergausta eikä deployta. Suunnitelman tarkentaminen ja toteutus kuuluvat myöhempään vaiheeseen, vasta toimivaksi testatun laskentaputken jälkeen.

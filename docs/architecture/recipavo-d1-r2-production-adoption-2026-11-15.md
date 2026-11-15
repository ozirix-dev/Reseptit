# Recipavo: D1 + R2 tuotantokäyttöön (toteutusohjelma)

Päiväys: 15.11.2026
Tila: DRAFT / implementation roadmap, ei tuotantomuutos
Omistaja: Reseptit-projekti
Kohde: https://www.recipavo.com/

## Päätös ja tavoite

Cloudflare D1 ja R2 OTETAAN KÄYTTÖÖN Recipavon tuotearkkitehtuurissa. Tämä ei ole avoin "käytetäänkö joskus" -tutkimus. Codex saa valita järkevimmän teknisen toteutusjärjestyksen, tietomallin yksityiskohdat, kirjastot ja migraatiotyökalut seuraavien invarianssien puitteissa.

- D1: vähintään käyttäjä- ja reseptikohtaisen tulevan transaktiodatan luotettava pysyvä tallennus sekä resepti-/ravinto-/GK-tietojen kyseltävä nykytilaprojektio soveltuvin osin.
- R2: reseptien julkaistut kuvat, kuvavariantit ja tulevat käyttäjän lataamat kuvat; tarvittaessa erillinen ei-julkinen master-/evidenssi-/varmistusalue.
- GitHub omistaa toimitukselliset Markdown-reseptit, laskentasyötteet, hyväksyntä- ja lähdesidokset sekä tietomallin migraatiot. D1:n toimituksellinen projektio rakennetaan Gitistä uudelleen.
- Nykyinen Cloudflare Pages -tuotanto, www.recipavo.com, nelikielisyys ja SEO pysyvät toimivina migraation aikana.
- Toimituksellisen sisällön kirjoitussuunta on Git → D1. Kanonisen lähteen vaihtaminen vaatisi erillisen arkkitehtuuri- ja julkaisupäätöksen.

**Valmis** tarkoittaa, että D1 ja R2 on todella otettu käyttöön, testattu ja niillä on todennettu tuotantokäyttötapa, palautuspolku ja vastuullinen ylläpito. Pelkkä suunnitelma, tyhjä D1/R2-resurssi tai kokeellinen import ei täytä tavoitetta.

## Mitä on jo tehty, mitä ei

- PR #172 (merged) ja docs/cloudflare-migration-plan.md sisältävät HISTORIALLISEN D1/R2-suunnitelman; älä toisinna 2.11. inventaarion toteutumattomia oletuksia.
- PR #243 (merged) ja docs/recipavo-cloudflare-release-plan.md määrittelevät Pagesin ja GitHub-stagingin julkaisu- ja SEO-rajat.
- ReportHubin 15.11.2026 tuotantoavausraportin mukaan Recipavo on jo Cloudflare Pages -projektissa recipavo-site, canonical www.recipavo.com. Tarkista ajantasainen tuotanto itse.
- PR #533 (Draft) GI/GK-arkkitehtuuriauditointi ja PR #555 (Draft) nykytilarekisteri ovat päätöspohjia, EIVÄT kilpailevia toteutuksia.
- [PR #664](https://github.com/ozirix-dev/Reseptit/pull/664) toi #555:n nykytilanäkymän mainiin. Alla oleva syötesopimus on verrattu [yhdistettyyn versioon](https://github.com/ozirix-dev/Reseptit/blob/3559e340281162c50eb249d3dcac9a7af2d90941/docs/architecture/recipe-state-pilot.md). Toteutuksessa näkymä generoidaan kunkin hyväksytyn julkaisun lähdecommitista.
- Git-inventaarion 438 WebP-pääkuvaa kuvaa lähdepuuta. Katselmoinnin tuotantoversiossa
  `be1771f4a7c56b0f07b861a37b55f248595778e9` julkinen kuvamanifesti sisälsi 389 pääkuvaa ja 1 023 varianttia. R2-tuonnin rajaus johdetaan julkaistavasta buildista. Tuotannon R2-käyttö jäi varmistamatta.
- Vanha julkaisusuunnitelma ehdotti kuvat.recipavo.com-hostia. Älä muuta tuotantodomainia tai kuvien URL-rakennetta ennen yhteensopivuustodistusta ja julkaisupäätöstä.

## Omistajuus ja D1-projektion syöte

- Käytä #664:n tuottamaa `tmp/recipe-state/current.json`-tiedostoa toimituksellisen projektion tilasyötteenä. Generoi se puhtaassa, hyväksyttyyn committiin lukitussa työpuussa samalla build- ja auditointipolulla. Tuonti tarkistaa ajon onnistumisen, odotetun `schemaVersion`-arvon (pilotissa 1), `sourceCommit`-arvon ja manifestiin tallennetun SHA-256:n. Epäonnistunut generointi voi jättää edellisen JSONin levylle, joten käytä vain saman onnistuneen ajon syötteitä. Hylkää kelpaamaton syöte. Estä aktivointi, kun julkaisun kannalta olennainen `conflicts`-merkintä on auki.
- Käytä `canonicalRecipeId`-tunnusta identiteettinä ja `sourceRecipeId`-tunnusta nykyisen lähteen viitteenä. Säilytä `sourcePath`, `contentHash`, mahdollinen `effectiveContentHash` ja `successorReferences`. Johda nykyisen FI-lähteen ja kieliversioiden Git-blobit samasta commitista niiden lähdepoluilla. Mallinna reseptiversio sisältötiivisteineen erillään identiteetistä. Sido laskenta ja hyväksyntä niiden omiin lähde-, syöte- ja evidenssiviitteisiin.
- Käytä `publicState`- ja `languages`-tietoja buildin näkyvyyteen. Säilytä `currentBlockers` ja `evidenceRefs` erillään näkyvyydestä. Julkiseen valikoimaan kuuluvat vain buildin julkaistut reitit. Karanteeni, luonnokset sekä sisäiset tarkistus- ja hyväksyntätiedot pysyvät sisäisessä projektiossa.
- #664 sisältää `nutritionStatus`-tilan ja GK-yhteenvedon. Tuo tarvittavat makroarvot ja tarkemmat laskenta- ja hyväksyntäsidokset saman ajon buildista ja auditeista. Tarkista näkyvien lukujen vastaavuus staattiseen sisältöön kaikilla julkaistuilla kielillä. Säilytä `NULL` puuttuvana, HOLD estona ja GK-erillisversiot erillään alkuperäisen reseptin GK:sta. Uudelle reseptiversiolle tarvitaan siihen sidottu hyväksyntä.
- D1:n toimituksellinen projektio on sovellukselle lukupohjainen. Vain rajattu tuontiprosessi saa päivittää sitä. Julkinen reseptikirjasto, reittidata ja SEO toimivat staattisina myös D1-katkon aikana. Ajonaikainen D1-riippuvuus edellyttää erillistä nimenomaista hyväksyntää.
- Pidä käyttäjien transaktiodata erillisessä D1-tietokannassa, jotta toimituksellisen projektion uudelleenrakennus tai palautus ei vaikuta yksityisiin tallennuksiin. Pidä suuret muuttumattomat sisäiset snapshotit tarvittaessa rajatussa yksityisessä R2-bucketissa.

## Käyttäjätiedot ja käyttöoikeudet

- Käytä [#560:n julkaisumallia](https://github.com/ozirix-dev/Reseptit/pull/560). Oma resepti tallentuu yksityiseksi. Erillinen, toistonkestävä julkaisuehdotus lukitsee reseptiversion ja oikeusilmoituksen. Julkiseen katalogiin siirtyy vain erikseen hyväksytty ja julkaisuvaltuutettu versio. Ehdotuksen epäonnistuminen tai peruminen säilyttää yksityisen tallennuksen.
- Käytä erillisiä D1-tietokantoja ja R2-bucketeja preview/testille ja tuotannolle. Erota julkisten kuvajohdannaisten bucket yksityisistä latauksista, mastereista ja varmistuksista. Tarkista bindingien kohteet ennen tuontia ja pidä migraatio-, tuonti- ja sovellusoikeudet rajattuina tehtäviinsä.
- Johda omistaja varmennetusta istunnosta. Tarkista omistajuus jokaisessa yksityisessä luku-, kirjoitus-, poisto- ja kuvatoiminnossa. Pidä tietokanta-avaimet palvelimella. Rajaa audit-lokit tarpeellisiin tapahtumiin ja pidä yksityiset reitit, tunnisteet ja sisältö poissa julkisista artefakteista, analytiikasta ja CI-lokeista.
- Rajaa pyyntöjen ja kuvien koko, käyttäjä- ja palvelukohtainen käyttö sekä maksullisen käsittelyn budjetti. Testaa kahdella käyttäjällä reseptien, versioiden ja kuvien eristys sekä hylkäys ennen kallista käsittelyä.

## Kuva-arkkitehtuuri

- Ota julkisen tuonnin tiedostoluettelo hyväksytyn buildin `kuvat/_variants/manifest.json`-manifestista. Yhdistä pääkuviin ja variantteihin käytetyt reitit, mitat, SHA-256:t, tekijyys/AI-ilmoitukset, lisenssit, ALT-tekstit ja lähteen hyväksyntä.
- Vie hyväksytyt julkiset WebP-pääkuvat ja responsiiviset variantit R2:een deterministisillä sisältö- tai versioavaimilla. Idempotentti lataus, tarkat checksumit, Content-Type, Cache-Control ja CORS/CSP.
- Julkinen kuvat.recipavo.com tai vastaava mediapolku valitaan vasta liikenne-, hinta-, TLS-, SEO-, saatavuus- ja migraatiovertailun perusteella. Vanhat /kuvat/...-osoitteet pidetään toimivina yhteensopivuuskerroksella. Älä aiheuta 404-kuvia.
- Pääkuvan on pysyttävä sivustolla, Recipe JSON-LD:ssä, Open Graphissa, srcsetissä ja neljän kielen reiteillä yhdenmukaisena. Älä muuta kuvaa hyväksymättä tai väitä tekoälykuvaa aidoksi koepaistokuvaksi.
- Vastaanota käyttäjäkuvat yksityiseen bucketiin. Varmista omistaja, oikeudet, tiedostotyyppi, koko ja mitat, tarkista tiedosto ja uudelleenkoodaa se ilman yksityistä metadataa. Julkiseen bucketiin siirtyy vain hyväksytty johdannainen.
- Viittä docs/review/kuvat/suomalaiset-klassikot/*.jpg alkuperäislähdekuvaa ei poisteta: niihin liittyy hash-lukittu evidenssi ja WebP-konversio.
- Varmista duplikaattien välttäminen eikä D:-levyn lukuisia worktree-variantteja sellaisinaan peilata pilveen.

## Migraatio, aktivointi ja palautus

1. Pidä skeemamigraatiot Gitissä erillään snapshot-tuonnista. Varmista
   kohdetietokanta ja migraatioversio ennen ajoa. Testaa migraatiot tyhjällä
   kannalla ja edellisen version tietosisällöllä. Säilytä skeeman
   yhteensopivuus edellisen julkaisun kanssa palautusajan yli.
2. Materialisoi D1-snapshot erissä passiiviseen versioon ja lataa tarkistetut
   R2-objektit muuttumattomille avaimille. Sido tuonti lähdecommittiin,
   skeemaversioon ja syötemanifestin SHA-256:een. Saman tuonnin uusinnan pitää
   jatkaa turvallisesti tai tuottaa täsmälleen sama tulos ilman tuplarivejä.
3. Varmista rivimäärät, viittaukset, kuvien tavut ja metatiedot sekä vanhojen
   URLien kartoitus ennen aktivointia. Vaihda D1:n aktiivinen snapshot
   atomisesti D1:ssä vain odotetusta edellisestä versiosta. R2-objektien on
   oltava valmiita ennen kuin staattinen julkaisu voi viitata niihin.
   Kirjaa D1-versio, kuvamanifesti ja Pages-deploy samaan julkaisutietueeseen.
   Määritä aktivointijärjestys ja testaa jokainen sen välitila, sillä Pages,
   D1 ja R2 voivat onnistua tai epäonnistua erikseen.
4. Säilytä edellinen D1-snapshot, Pages-deploy, kuvakartta ja kuvaobjektit palautusajan yli.
   Harjoittele keskeytys, uusinta, rinnakkainen aktivointiyritys sekä kunkin
   osan palautus. Varmista D1:n palautus myös erillisestä SQL-viennistä.
   Julkinen katalogi ja kuvareitit testataan palautuksen jälkeen.

## Julkaistavan artefaktin varmennus

- Pidä GitHub Pages -staging ja Cloudflaren tuotantoon tarkoitettu build
  erillisinä. Suorita olemassa olevat staattiset ja SEO-tarkistukset myös
  tuotantoasetuksilla. Tarkista FI/EN/SV/TH, canonical, hreflang, sitemap,
  robots/noindex, aidot 404-vastaukset, kuvat sekä yksityisen aineiston poissaolo.
- Lukitse tarkistettu tiedostomanifesti SHA-256:lla. Testaa sama artefakti
  indeksoimattomassa Cloudflare-esikatselussa ja kiinnitä hyväksyntään
  lähdecommit, tiedostomanifestin hash, Cloudflare-tili, Pages-projekti,
  tuotantohaara ja varmennetun esikatselun deployment ID. Varmista kohde ennen
  latausta ja julkaise hyväksytyn manifestin mukainen artefakti. GitHubin
  staging-CI kattaa GitHub Pagesiin rakennettavan aineiston.
- Kytke syntyneen tuotantodeployn ID hyväksynnän tietoihin. Varmista
  www-hostilta julkaisu-SHA, pääreitit, otsakkeet, SEO ja kuvien hash-otos.
  Palauta edellinen julkaisu, jos varmennus ei läpäise.

## Toteutusvaiheet (saa järjestellä perustellusti, tavoite ei saa muuttua)

**0. Lyhyt ajantasainen inventaario:** Cloudflare Pages/Workers/D1/R2 nykyresurssit, tokenien todelliset oikeudet, julkaistut kuvapolut, laskennan riippuvuudet, kuva- ja datamäärät, laskutuksen nykyraja, omistajuudet ja palautuspaikat. Lue Master handbook/cloudflare.md ja Repo Guard -säännöt. Älä julkaise avaimia.

**1. Sopimus ja paikallinen testi:** D1-skeema/migraatiot, R2-avaimet/manifesti, palvelinrajapinnat, Git→D1-projektio ja käyttöturvarajat. Tee pieni versionlukittu oikeellisuuskoe sekä palautuskoe. Älä vielä koske julkiseen liikenteeseen.

**2. Eristetty pilotti:** Luo tarkoitukseen rajatut kehitys-/preview-resurssit vain Cloudflare-valtuuksien rajoissa. Vie ensin pieni resepti-, ravinto-/GK- ja kuvaotos. Todista nollasta toistettavuus, hash-vastaavuus, yksityisten tietojen eristyminen ja idempotentti tuonti.

**3. Koko datan valmistelu:** Määritä automaattiset vaiheittaiset tuonnit, manifestit, kontrolloidut uudelleenajot, lähteiden elinkaari ja poikkeamien HOLD. Varmista kaikki nykyiset julkaistut kuvat / variantit ja D1:n soveltuvat tietueet; rinnakkaisajon ei pidä muuttaa käyttäjän näkymiä.

**4. Tuotantokäyttöön aktivointi:** Valmistele yksi täsmällinen release/cutover-paketti: resurssit, sovellusrajapinnat, varmennettu commit, reittimuutos, kustannukset, virheiden valvonta, vertailut sekä rollback. Pyydä YKSI nimenomainen käyttäjän hyväksyntä ennen tuotantoon, laskutukseen, pääsynhallintaan tai liikenteeseen vaikuttavia Cloudflare-kirjoituksia. Tämän päätöksen jälkeen toteuta hyväksytty promootio yhtenä hallittuna operaationa, ei jokaisen välivaiheen hyväksyntäketjuna.

**5. Tuotantovarmennus:** Testaa neljä kieltä, kuvat, vanhat ja uudet URL:t, 404/403, CORS, identiteetti, D1:n dataoikeudet, kuvien byte/hash-verifiointi, SEO/JSON-LD, optimointi ja rajakustannukset. Todista R2:sta toimitettu oikea kuva ja D1:stä luettu/kirjoitettu todellinen testitietue luvallisessa käyttötapauksessa.

**6. Hallittu jälkisiivous:** Vasta auditin jälkeen arvioi Git-kopioiden ja välisnapshotien rooli. Älä hävitä hyväksyntäevidenssiä, historiaa, lähdeversioita tai varmuuskopioita. Erottele palautuskelpoiset välituotokset ja kanoninen data.

## Backup, riski ja kustannus

- D1:n aikarajallinen palautustoiminto ei yksin ole pysyvä audit- eikä offsite-backup. Tee testatut SQL-viennit, yksityiseen R2:een rajoitettu paketti, palautusproseduuri ja riippumaton salattu kopio käyttäjän olemassa olevan vault/Proton-käytännön mukaan.
- R2-kuvista tulee säilyttää palautuskelpoinen inventaario/manifesta ja alkuperäiset hyväksytyt masterit myös epäonnistuneen julkaisun tai tilimenetyksen varalta.
- Älä siirrä salaisuuksia GitHubiin. Varmista lähdedatan lisenssit ennen palveluun kopiointia tai julkaisua.
- Minimoi kustannukset; aiemmassa suunnitelmassa lisäkulutavoite oli enintään 5 USD/kk nykyisen Worker-tilauksen päälle. Varmista nykyinen hinta ja koko tilin kulutus ennen maksullisen resurssin käyttöönottoa. Ei yllätyslaskutusta.
- Älä poista Pages-tuotantoa, automaattisesti promotoi mainia tai muuta DNS:ää ennen nimenomaista julkaisuhyväksyntää. Palautuksen on oltava yhtä nopea kuin aktivointi.

## Codexin autonomia ja PR:t

- Codex saa valita yksityiskohdat, toteuttaa rajatut turvalliset vaiheet omaan työhaaraan, testata, tehdä Draft PR:iä ja valmistella hyväksyntäkelpoisen käyttöönottoerän ilman toistuvia välikysymyksiä.
- Älä muokkaa toisten Codex-istuntojen työpuita tai PR-haaroja. #533, #555, #560 ja #664 säilyvät niiden omistajilla.
- Repo Guardin SHA-kohtaisia hyväksyntöjä tai Cloudflaren tuotanto-/laskutusportteja ei kierretä. Älä myöskään synkronoi Draft-PR:iä turhaan jokaiseen main-committiin.
- Dokumentointi: yksi selkeä etenemistilanne per olennainen toteutusvaihe; ei yhtä ReportHub-PR:ää jokaisesta esitarkistuksesta.
- Jos valmistelussa ei ole edellytyksiä tuotantocutoveriin, pysähdy siihen nimettyyn päätökseen ja toimita valmis toteutuspaketti; älä jää ikuiseen tutkimussilmukkaan.

## Mitattavat hyväksymiskriteerit

- D1 ja R2 ovat käytössä, eivät pelkästään suunnitelmassa.
- Hyväksytyn artefaktin tiedostomanifesti, kohde ja deployment ID on todennettu. FI/EN/SV/TH, kuvat, ravintoarvot, HOLD/GK, SEO ja julkaisuportit vastaavat hyväksyttyä versiota myös julkisen katalogin D1-katkokokeessa.
- Tietueiden kanonisuus ja lähdesidokset ovat yksikäsitteisiä. Ei hiljaista pudotusta tai arvon pyöristymää.
- Käyttäjän yksityiset tiedot eivät vuoda, kuvaoikeudet ja latausten käsittely ovat testattuja.
- Keskeytetty ja rinnakkainen tuonti, idempotentti uusinta sekä D1/R2/Pages-palautus on testattu. Vaiheiden tulokset, kustannukset ja palautuskohteet on kirjattu.
- Julkisen sivuston muutoksiin tarvitaan oma nimenomainen julkaisuvaltuus, ei tämän suunnitelma-PR:n merge.
- Tehtävä päätetään viimeiseen turvalliseen valtuutettuun vaiheeseen, ei uuteen loputtomaan synkronointi-/hyväksyntäkiertoon.

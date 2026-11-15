# Recipavo: D1 + R2 tuotantokäyttöön (toteutusohjelma)

Päiväys: 15.11.2026
Tila: DRAFT / implementation roadmap, ei tuotantomuutos
Omistaja: Reseptit-projekti
Kohde: https://www.recipavo.com/

## Päätös ja tavoite

Cloudflare D1 ja R2 OTETAAN KÄYTTÖÖN Recipavon tuotearkkitehtuurissa. Tämä ei ole avoin "käytetäänkö joskus" -tutkimus. Codex saa valita järkevimmän teknisen toteutusjärjestyksen, tietomallin yksityiskohdat, kirjastot ja migraatiotyökalut seuraavien invarianssien puitteissa.

- D1: vähintään käyttäjä- ja reseptikohtaisen tulevan transaktiodatan luotettava pysyvä tallennus sekä resepti-/ravinto-/GK-tietojen kyseltävä nykytilaprojektio soveltuvin osin.
- R2: reseptien julkaistut kuvat, kuvavariantit ja tulevat käyttäjän lataamat kuvat; tarvittaessa erillinen ei-julkinen master-/evidenssi-/varmistusalue.
- GitHub: koodi, toimitukselliset Markdown-reseptit, tietomallin migraatiot ja palautettavat hyväksyntä-/lähdesidokset; vähintään ensimmäisessä vaiheessa kanoninen toimituksellinen sisältölähde.
- Nykyinen Cloudflare Pages -tuotanto, www.recipavo.com, nelikielisyys ja SEO pysyvät toimivina migraation aikana.
- Ei kahta itsenäistä masteria samalle ravintoarvolle. Jos omistajuus myöhemmin siirtyy D1:een, myös kirjoitussuunnan ja Git-projektioiden sopimus muuttuu eksplisiittisesti.

**Valmis** tarkoittaa, että D1 ja R2 on todella otettu käyttöön, testattu ja niillä on todennettu tuotantokäyttötapa, palautuspolku ja vastuullinen ylläpito. Pelkkä suunnitelma, tyhjä D1/R2-resurssi tai kokeellinen import ei täytä tavoitetta.

## Mitä on jo tehty, mitä ei

- PR #172 (merged) ja docs/cloudflare-migration-plan.md sisältävät HISTORIALLISEN D1/R2-suunnitelman; älä toisinna 2.11. inventaarion toteutumattomia oletuksia.
- PR #243 (merged) ja docs/recipavo-cloudflare-release-plan.md määrittelevät Pagesin ja GitHub-stagingin julkaisu- ja SEO-rajat.
- ReportHubin 15.11.2026 tuotantoavausraportin mukaan Recipavo on jo Cloudflare Pages -projektissa recipavo-site, canonical www.recipavo.com. Tarkista ajantasainen tuotanto itse.
- PR #533 (Draft) GI/GK-arkkitehtuuriauditointi ja PR #555 (Draft) nykytilarekisteri ovat päätöspohjia, EIVÄT kilpailevia toteutuksia.
- GitHub mainin tarkistushetken inventaariossa oli 438 WebP-pääkuvaa (noin 87 MiB). Kuvista generoidaan 480/960/1440-pikselin variantit; kuvien live-R2-käytöstä ei ole vielä varmennusta.
- Vanha julkaisusuunnitelma ehdotti kuvat.recipavo.com-hostia. Älä muuta tuotantodomainia tai kuvien URL-rakennetta ennen yhteensopivuustodistusta ja julkaisupäätöstä.

## Omistajuus ja tietojen malli

1. Päätä kullekin dataryhmälle kanoninen kirjoittaja, lähdeversio, avain ja sallittu synkronointisuunta: toimituksellinen resepti, käyttäjän yksityinen resepti, julkistettu käyttäjäresepti, käyttäjäidentiteetti, kuva, kuvan metatiedot, GI, ravintokoostumus, GK-laskelma, hyväksyntä, HOLD, muutoshistoria.
2. Käytä vakaita resepti-ID:itä, locale-tunnuksia, version-/lähde-/blob-SHA:ita ja tarvittaessa idempotentteja event-/outbox-avaimia. Ei URL-slugiin tai tiedostonimen nykyasuun perustuvaa yksinomaista identiteettiä.
3. Mallinna hyväksytty numeerinen nykytila ja versionhistoria erikseen. NULL tai puuttuva tieto ei saa muuttua nollaksi eikä HOLD hyväksytyksi GK:ksi. Säilytä aines-, lähde-, valmistus-, soveltuvuus- ja hyväksyntäperusteet.
4. Ylläpidä D1-migraatiot versionhallittuna, toistettavina ja palautettavina. Erota preview/test ja tuotanto. Älä kirjoita tuotannon D1:een kehitysdatan kokeita.
5. D1:n pitää olla palvelinrajapinnan takana; selain ei saa suoraa DB-avainta. Käytä valtuutusta, yksityisten reseptien omistajuustarkistusta, kohtuullisia rajoituksia, syötteiden validointia ja audit-jälkeä.
6. Säilytä staattinen, julkinen reseptikatalogi toimivana ilman tuotanto-D1:n reaaliaikaista saatavuutta ainakin ensimmäisissä vaiheissa. Käyttäjäkohtaiset toiminnot saavat käyttää D1:tä.
7. Älä tallenna liian suuria raakaaine-JSON-snapshoteja yhtenä D1-rivinä. Normalisoi kyseltävät tiedot ja arkistoi täydet muuttumattomat snapshotit tarvittaessa yksityiseen R2:een.

## Kuva-arkkitehtuuri

- Inventoi pääkuvien manifesti, käytetyt reitit, kokoluokat, SHA-256:t, tekijyys/AI-ilmoitukset, lisenssit, ALT-tekstit, lähteiden hyväksyntä ja kuvien olemassaolo.
- Vie hyväksytyt julkiset WebP-pääkuvat ja responsiiviset variantit R2:een deterministisillä sisältö- tai versioavaimilla. Idempotentti lataus, tarkat checksumit, Content-Type, Cache-Control ja CORS/CSP.
- Julkinen kuvat.recipavo.com tai vastaava mediapolku valitaan vasta liikenne-, hinta-, TLS-, SEO-, saatavuus- ja migraatiovertailun perusteella. Vanhat /kuvat/...-osoitteet pidetään toimivina yhteensopivuuskerroksella. Älä aiheuta 404-kuvia.
- Pääkuvan on pysyttävä sivustolla, Recipe JSON-LD:ssä, Open Graphissa, srcsetissä ja neljän kielen reiteillä yhdenmukaisena. Älä muuta kuvaa hyväksymättä tai väitä tekoälykuvaa aidoksi koepaistokuvaksi.
- Järjestä tulevien käyttäjälatausten yksityinen ingestion / validointi / oikeudenvarmistus / kuvaskannaus / uudelleenkoodaus / julkaisu. Kuvien masterit voidaan pitää erillisessä ei-julkisessa R2-bucketissa.
- Viittä docs/review/kuvat/suomalaiset-klassikot/*.jpg alkuperäislähdekuvaa ei poisteta: niihin liittyy hash-lukittu evidenssi ja WebP-konversio.
- Varmista duplikaattien välttäminen eikä D:-levyn lukuisia worktree-variantteja sellaisinaan peilata pilveen.

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
- Älä muokkaa toisten Codex-istuntojen työpuita tai PR-haaroja. #638, #533 ja #555 säilyvät niiden omistajilla.
- Repo Guardin SHA-kohtaisia hyväksyntöjä tai Cloudflaren tuotanto-/laskutusportteja ei kierretä. Älä myöskään synkronoi Draft-PR:iä turhaan jokaiseen main-committiin.
- Dokumentointi: yksi selkeä etenemistilanne per olennainen toteutusvaihe; ei yhtä ReportHub-PR:ää jokaisesta esitarkistuksesta.
- Jos valmistelussa ei ole edellytyksiä tuotantocutoveriin, pysähdy siihen nimettyyn päätökseen ja toimita valmis toteutuspaketti; älä jää ikuiseen tutkimussilmukkaan.

## Mitattavat hyväksymiskriteerit

- D1 ja R2 ovat käytössä, eivät pelkästään suunnitelmassa.
- Reseptien julkaisu, FI/EN/SV/TH, kuvat, ravintoarvot, HOLD/GK, SEO ja julkaisuportit pysyvät oikein.
- Tietueiden kanonisuus ja lähdesidokset ovat yksikäsitteisiä. Ei hiljaista pudotusta tai arvon pyöristymää.
- Käyttäjän yksityiset tiedot eivät vuoda, kuvaoikeudet ja latausten käsittely ovat testattuja.
- Uusinnat ovat idempotentteja; jokaisesta vaiheesta on tulokset, kustannukset ja rollback.
- Julkisen sivuston muutoksiin tarvitaan oma nimenomainen julkaisuvaltuus, ei tämän suunnitelma-PR:n merge.
- Tehtävä päätetään viimeiseen turvalliseen valtuutettuun vaiheeseen, ei uuteen loputtomaan synkronointi-/hyväksyntäkiertoon.

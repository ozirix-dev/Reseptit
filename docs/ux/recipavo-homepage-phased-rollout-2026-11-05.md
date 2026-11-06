# Recipavo-hero: vaiheittainen toteutus ilman ennenaikaista uudelleenbrändäystä

**Päivä:** 2026-11-05
**Tila:** UX-suunnitelma ja rajattu vaihe 0 -toteutus PR:ssä; muut vaiheet ovat erikseen päätettäviä
**Lähtötilanne:** Julkinen Reseptit-palvelu GitHub Pagesissa; Recipavon julkaisu-, tuote- ja ravintoarkkitehtuurisuunnitelmat erillisiä.

## Päätös ja perustelu

Nykyinen Reseptit on toimiva reseptihakemisto. Se ei vielä tarjoa kirjautunutta ateriapäiväkirjaa, omia aterioita, kalenteria tai Recipavo Plus -tilausta. Uusi massiivinen markkinointihero heikentäisi reseptien löydettävyyttä ja antaisi helposti väärän kuvan ominaisuuksien valmiudesta.

**Päätös:** säilytetään nykyinen julkinen hakupolku ja toteutetaan pieni, palautettava asetteluparannus nyt. Eri käyttäjätilanteisiin soveltuva Recipavo-kokemus rakennetaan vasta vastaavien oikeiden ominaisuuksien valmistuessa. Älä niputa kaikkia vaiheita yhteen koodimuutos-PR:ään.

Tuotteen kolme myöhempää tehtävää:
1. Anonyymi kävijä löytää reseptin nopeasti ilman tiliä.
2. Kirjautunut käyttäjä näkee **Tänään**-näkymän ja kirjaa tutun aterian ilman toistuvaa hakua.
3. Ravinnosta kiinnostunut käyttäjä avaa tarkemmat, lähteistetyt tiedot vain tarvitessaan.

## Vaihe 0 – nyt, tämän PR:n ainoa koodimuutos

**Muutokset**
- Vähennetään vain `recipe-index`-sivun yläosan tyhjää tilaa: osion ylämarginaalin sijasta yläpadding, intro/otsikko, suodatinpaneelin sisätila, tuloslaskurin ja korttien välit.
- Pidetään tekstihaku, kategoria, ruokavalio ja avattavat lisäsuodattimet entisillä paikoillaan; sama kontrollikoko ja osumajoukko.
- Säilytetään `<details>`-lisäsuodattimet **kiinni oletuksena**. Käyttäjän 5.11. näyttämässä kuvassa ne olivat auki; sitä ei pidä tulkita sivun oletustilaksi.
- Lisätään selaintesti, joka toteaa lisäsuodatinten suljetun alkutilan sekä avaamisen FI/EN/SV/TH-kielillä. Nykyiset yhdistetyn haun, GK-suodatuksen, URL-tilan ja näppäimistötoimintojen testit säilyvät.

**Ei tämän PR:n scopea**
- Ei uusia painikkeita, keskeneräisiä kirjautumis- tai Plus-ominaisuuksia tai toimintaa jäljitteleviä mockeja tuotantoon.
- Ei muutosta brändiin `Reseptit`, ylävalikkoon, resepti-/GK-sisältöön, suodatinten logiikkaan, SEO-metatietoihin, kanonisiin URL:eihin, lähdetietoon tai dataan.
- Ei Google Pages / Cloudflare -siirtoa, deployta, maksua, tunnistusta tai tietokantaa.
- Ei uutta reseptikategoriaa, hakukoneoptimoitua väitettä tai keksittyä ravitsemuslupausta.

**Hyväksyntä**
- TypeScript + Vite-build, kohdennetut ja nykyiset selaintestit sekä `test:static` läpäisevät täsmälleen PR:n HEADillä.
- Ihmistarkistus Bravessa: FI/EN/SV/TH sekä 320 / 390 / 768 / 1440 px; myös suuren tekstin ja näppäimistön tila. Ensimmäiset reseptikortit alkavat silmämääräisesti aikaisemmin kuin vastaavassa vanhassa näkymässä, mutta nimiä ja luettavuutta ei uhrata.
- Varmista myös avatut lisäsuodattimet, useat aktiiviset suodattimet, nollaus, selaimen takaisin-näppäin, `?q=`, `?diet=`, `?gl=low`, focus, reload ja ilman JS:ää näkyvä reseptiluettelo.
- Tallenna ennen/jälkeen-kuvat samaan viewportiin. Jos hyöty on vähäinen tai saavutettavuus heikkenee, peru CSS-osuus. Ei tämän PR:n luomia uusia numeerisia liikenne-/konversiolupauksia.

## Vaihe 1 – Recipavon julkinen reseptipalvelu, **erillinen PR**

**Laukaisija:** hyväksytty `www.recipavo.com`-julkaisun kontrollipiste, kielireitit ja SEO-migraation testit. Julkinen reseptikokemus on edelleen ensisijainen.

- Sovitetaan Recipavo-brändi, lyhyt käyttäjälähtöinen arvolupaus ja reseptihaku yhteen. Työehdotus FI-tekstiin: **"Maailman reseptit. Sinun arkeesi."** Tätä ei pidä ottaa tuotantoon ilman nelikielistä copy- ja SEO-tarkistusta.
- Hakukenttä säilyy tärkeimpänä toimintona; kortit eivät saa kadota suuren kuvan, markkinointikarusellin tai CTA-rivistön alle. Erillistä herokuvaa ei tarvita.
- Selkeä linkitys GK-menetelmään siellä, missä käyttäjä kohtaa ravintotiedot; GK ei ole yleinen terveyslupaus.
- Päätetään päävalikko, kielivalitsin ja saavutettava mobiilinavigaatio; EI lisätä toimintakyvytöntä `Päiväkirja`-linkkiä tai `Luo tili` -CTA:ta.
- Säilytetään nykyiset reseptien suorat linkit sekä canonical/hreflang/robots/sitemap, nelikielisyys ja toimivat URL-suodattimet. Stagingia ei mainosteta julkisena.
- Erillinen julkaisulupa ja palautussuunnitelma; mitään automaattista Cloudflare-prod-deployta `main`-pushista.

## Vaihe 2 – kirjautunut käyttäjä, **vasta toimivan Diary-MVP:n jälkeen**

**Laukaisija:** tuotteen P1-prototyypin käytettävyysnäyttö, P2-tunnistus/tietosuoja, P3-toimiva kirjaus ja hyväksytyt oikeat käyttäjätestit. Ennen niitä ei näytetä valetoimintoa.

- Julkinen hakusivu pysyy tiliä vaatimattomana. Kirjautunut käyttäjä saa henkilökohtaisen **Tänään**-aloituksen: oikea valittu päivä, omat vakioateriat, `Kirjaa`, omat merkinnät, lisäys ja palautetila.
- Ei säilytetä henkilökohtaista päiväkirjaa staattisessa julkisessa paketissa, hakukoneessa, URL-parametreissa tai sivuston julkisessa analytiikassa.
- `Kirjaa` on toimiva vasta, kun palvelin vahvistaa tallennuksen; määrää ja päivää voi korjata. Sama painallus ei tuplakirjaa. Suunniteltu ja syöty pidetään erillään.
- Mobiilin ensiruudulle oikeasti käytettävä aterian kirjaus, ei toistuva markkinointihero tai maksumuuri. Reseptit ovat edelleen löydettävissä yhdellä selkeällä reitillä.
- Kirjausten lähde- ja ravintotiedon kattavuus näkyy ilman tekaistuja nollia; mitään ruokavalio- tai kliinistä hoitolupausta ei johdeta automaattisesti GK:sta.

## Vaihe 3 – kalenteri, lisäanalyysit ja Plus, **erilliset PR:t ja päätösportit**

**Laukaisija:** P4-kalenteri ja päivä-/viikkotiedot testattu; P5-käyttäjäpaluu ja virheet mitattu; P6-maksuhalukkuus ja kustannukset validoitu ennen P7-Plusia.

- Kalenteri ja pitkän ajan ravintotiedot lisätään aidon tarpeen perusteella; käsitteet `suunniteltu` / `syöty` ja puuttuva tieto pysyvät tarkkoina.
- Plusin hintaviestit omalle selkeälle sivulle tai ominaisuuden kontekstiin, eivät reseptihaun eteen. Ilmaisen ydinkirjauksen arvoa ei poisteta maksupainostuksen vuoksi.
- Ravintotuote.fi/NeoLife-sisältö ei ole Recipavon reseptihaun tai yksityisen päiväkirjan hero-markkinointia. Mahdollinen kaupallinen yhteistyö arvioidaan myöhemmin erikseen ja merkitään läpinäkyvästi.

## Mitä ei tehdä samalla kertaa

- **Ei "yhtä suurta Recipavo-PR:ää"** joka koskettaa nykyistä tuotantoa, Cloudflare-migraatiota, tunnistusta ja GK-laskentaa yhtä aikaa.
- **Ei oletusta, että 326 reseptiä muodostaa valmiin täyden Diary-ruoka-aineprofiilin.**
- **Ei UI-tekstiä "automaattisesti tarkka GK kaikille omille resepteille"** ennen tämän laskennan lähde- ja puuttuvuuslogiikan valmistumista.
- **Ei kopioida kokonaan kilpailijoiden monimutkaisia dashboardeja** ennen kuin vakioaterian toistokirjauksen käyttöarvo on osoitettu.

## Mitattavat päätöskriteerit seuraaviin vaiheisiin

1. Julkisessa palvelussa: löytyykö reseptihaku, onnistuuko rajaus ja avautuuko oikea resepti? Varmista mobiilinäkymä käyttäjätesteissä.
2. Päiväkirjan pilotissa: pystyykö käyttäjä luomaan todellisen vakioaterian, kirjaamaan sen seuraavana päivänä ja korjaamaan virheen ilman ohjausta?
3. Tarkista aktivointi, toisen päivän paluu ja D7/D30 vain kypsyneestä, luvallisesta testikohortista. Raportoi sekä lukumäärät että nimittäjät; älä käsittele analytiikkaa yksityisen päiväkirjan markkinointidatana.
4. Plus-vaihe vasta, kun ainakin yksi hyöty vastaa käyttäjän todistettuun tarpeeseen ja hinnoittelun kustannukset on arvioitu.

## Riippuvuudet ja työnjako

- [Recipavon tuotevisio / MVP / P0–P8](../product/recipavo-product-strategy.md) (PR #178:n mainiin integroitu suunnitelma)
- [Recipavon Cloudflare-julkaisusuunnitelma](../recipavo-cloudflare-release-plan.md) (PR #243:n mainiin integroitu suunnitelma)
- [GK-tutkimus ja toteutusjärjestys](../nutrition/gk-research-2026-11-04/README.md) (PR #264)
- Avoimet rinnakkaiset PR:t tätä päätöstä kirjoitettaessa: #292, #291, #223, #100. Niiden tiedostot eivät ole tämän PR:n kolmessa muutoskohteessa.
- Jokainen myöhempi vaihe vaatii oman nyky-mainin tarkastuksen, rajauksen, testitulokset ja PR:n. Tämän dokumentin hyväksyminen **ei** hyväksy toteutusta tai julkaisua.

## Palautettavuus

Vaiheen 0 muutokset koskevat vain sivukohtaisia CSS-sääntöjä ja testilauseita. Takaisinpalautus on CSS- ja testimuutosten revert ilman lähde-, ravinto-, hakulogiikka-, SEO-, URL- tai tietomigraatiota. Dokumenttia voi säilyttää päätöshistoriana.

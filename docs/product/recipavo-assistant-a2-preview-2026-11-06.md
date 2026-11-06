# Recipavo Keittiöapuri — A2, nelikielinen paikallinen mock-esikatselu

Päiväys: 6.11.2026  
Tila: toteutus ja tests, ei julkinen UI-julkaisu eikä AI-palvelu.  
Riippuvuus: A1 PR #324, suunnittelun tausta PR #320.

## Mitä A2 oikeasti tekee

A2 on erillinen selaimessa avattava, nelikielinen ja näppäimistöllä käytettävä mock-UI. Se näyttää keskustelunomaisesti **julkaistun hakutuloksen**, ei tekoälyllä kirjoitettua vastausta. Kaikki syötteen käsittely tapahtuu käyttäjän selaimessa. Käytössä on A1:n versionoitu ja SHA-256-tarkistettu kielikohtainen JSON-indeksi.

Käyttäjä voi:
- vaihtaa FI/EN/SV/TH-kieltä;
- valita yksiselitteiset esiasetukset: keto enintään 30 min, aamupalat, välipalat;
- kirjoittaa reseptin nimen tai ainesosan (nykyinen sanahaku, **ei** luonnollisen kielen ymmärrystä);
- avata tuloksen oikean julkaistun kieliversion linkistä;
- katsoa vain alkuperäisen julkaistun makron, ja `null` näkyy tuntemattomana.

Näytetään enintään viisi tulosta / kysymys, selaimen sisäinen korkeintaan kuuden hakukerran historia, ei pysyvää tallennusta. Indeksilatauksen virheet eivät riko tavallista reseptihakua; erillinen linkki siihen pysyy. Näytetään selkeä ilmoitus, ettei kyse ole tekoälystä eikä GK-laskennasta.

## Paikallinen käynnistys

~~~bash
cd site
npm ci
npm run content:sync
npm run dev -- --host 127.0.0.1
~~~

**Vite-esikatselu:** `http://127.0.0.1:5173/Reseptit/previews/assistant-mock.html`.

Jos paikallinen Vite-versio käyttäytyy eri tavoin BASE_URL-prefixin kanssa, tarkista siitä syntynyt todellinen osoite. HTML:n noindex ja dev-only import eivät muodosta julkista reittiä. Pelkän `npm run build`-komennon tuottamaan `dist/`-sivustoon ei synny tätä esikatselun HTML:ää.

## Tiedostot ja rajat

- `site/src/features/assistant/demo.ts`: puhdas hakupresetti, tiukka ladatun indeksin skeemavalidointi, SHA-256-varmennus ja turvalliset oikeat URL:t.
- `site/src/features/assistant/demo-i18n.ts`: nelikielinen copy.
- `site/src/features/assistant/AssistantMockPreview.tsx`, `assistant-preview.css`: renderöinti ja saavutettavuus.
- `site/previews/assistant-mock.html` ja `site/previews/assistant-mock.tsx`: erillinen paikallinen entry, noindex/nofollow.
- `site/tests/assistant-demo.test.ts`: 4 kieltä, hakusemantiikka, oikeat ID:t/reitit, XSS/rikkinäiset reitit, SHA-256 asset ja `null`.
- `site/package.json`: uusi yksikkötesti olemassa olevaan testisarjaan.

**Ei muutu:** `RecipesPage.tsx`, `router.tsx`, navigaatio, H2-sivutus, hero, blogi, nykyinen `styles.css`, julkaistu ravintolaskenta, GK, kanoniset URL:t, mainin deploy-säännöt tai Cloudflare Coming Soon.

## Testaus ja käyttöönoton portit

~~~bash
cd site
npm run content:sync
npm exec -- tsx --test tests/assistant-catalog.test.ts tests/assistant-demo.test.ts
npm run build
npm test
npm run test:static
~~~

Lisäksi manuaalisessa esikatselussa 320/390/768/1440 px, FI/EN/SV/TH, tab-järjestys, kielenvaihto ja reittilinkit. Vastauksen teksti on Reactin escapaamaa; HTML-viestejä ei renderöidä. Ei ulkopuolista API:a eikä seuranta- tai mallikutsuja.

**A3:** Cloudflare Worker voi seuraavassa PR:ssä toteuttaa vastaavan **read-only** mock-haku-API:n. Mahdollinen tuotantointegraatio odottaa H2-reittejä ja Cloudflare-julkaisuporttia. AI-avaimet, ulkoiset mallit, laskutus, käyttäjän tekstin logitus ja henkilökohtaiset terveystiedot pysyvät poissa.

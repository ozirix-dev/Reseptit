# Recipavo H1 – reseptipoimintojen ja aihepolkujen esikatselu (6.11.2026)

**Tila:** toteutettu PR-haaraan, valmius katselmointiin; tuotanto ei muutu ilman esikatselun erillistä käyttöönottoa.

Tämä on käytännön jatko suunnitelmalle [Recipavo etusivu ja erillinen kirjasto V1](recipavo-home-and-catalog-v1-2026-11-06.md), PR #307. Ei vielä H2-kirjastoreittejä, blogin etusivunostoja tai domainin vaihdosta.

## Toteutettu

- Aiemmin käyttöön otettu `VITE_RECIPAVO_HERO_PREVIEW=true` näyttää edelleen nelikielisen Recipavo-nimen ja herotekstit; samalla se näyttää **toimivia aihelinkkejä** ja **9 olemassa olevan reseptin poiminnan**.
- Poiminnat valitaan deterministisesti ruokalajeja vuorotellen; kuvallisia julkaistuja reseptejä suositaan. Ei anneta virheellisiä suosituin-, arvioitu-, uusimmat- tai koepaistettu-väitteitä.
- Koko kirjaston muu osa on **natiivin avattavan `details`-elementin sisällä**. Käyttäjä voi selata sitä ilman JavaScriptiä, kaikki reseptien olemassa olevat reittilinkit säilyvät ja footer on normaalisti lähellä poimintoja.
- Aihelinkit käyttävät nykyisiä `?category=`- ja `?diet=`-parametreja ja nykyistä hakulogiiikkaa; suodattimia käytettäessä näytetään vanhan haun tulosluettelo ennallaan.
- Omat tyylit `site/src/features/recipes/home-preview.css` on rajattu esikatseluluokkaan. Ruokaopas #309 on jo julkaistu erillisenä; tämä muutos ei kosketa sen reittejä tai tyylejä.
- Neljän kielen valintojen ja suodatettavien aiheiden testit kuuluvat olemassa olevaan `recipe-search.test.ts`-testisarjaan.

## Näin testaat paikallisesti (PowerShell)

```powershell
cd site
$env:VITE_RECIPAVO_HERO_PREVIEW = 'true'
npm ci
npm run build
npm run test:static
npm run preview
# Avaa selaimessa npm run preview -komennon ilmoittama localhost-osoite
# Poista ympäristömuuttuja seuraavaa normaalia buildiä varten:
Remove-Item Env:VITE_RECIPAVO_HERO_PREVIEW
```

**Älä deployaa preview-buildiä GitHub Pagesin tai Cloudflaren julkiseksi normaaliversioksi.** Esikatselussa `robots=noindex,nofollow`, mutta tämä ei yksin muodosta pääsynhallittua staging-ympäristöä. CI:n tavallinen build käyttää edelleen vanhaa etusivua ilman esikatselukytkintä.

## Käytettävyyden portti

1. Tavallinen build ilman ympäristömuuttujaa näyttää edelleen vanhan `Reseptit`-otsikon ja täyden, ennallaan olevan korttilistan. `?q`, `?diet`, `?category`, `?gl`, käännösten suorat osoitteet ja SEO eivät muutu.
2. Preview-buildissä FI, EN, SV, TH: otsikko, aiheet ja poiminnat ovat saman kielen mukaisia; kaikki poiminnat osoittavat oikeisiin julkaistuihin resepteihin.
3. Preview-haku ja pikavalinnat avaavat yhdisteltävät alkuperäiset suodattimet; takaisinpäin siirtyminen ja URL:n uudelleenlataus toimivat.
4. No-JS-preview: yhdeksän korttia näkyvissä, muu reseptikirjasto avattavissa natiivilla `summary`-elementillä, linkit toimivat ja tekijänoikeus- ja lähdekäytäntö näkyvät footerissa.
5. Näppäimistö, focus, 200 % zoom sekä 320/390/768/1440 px responsiivisuus; erillinen tarkistus, ettei uusi aihelinkkirivi piilota pääasiallista hakua.
6. Älä tulkitse piilotettuja satoja kortteja suorituskykyoptimoinniksi: SSR:n HTML ja JSON-data sisältävät edelleen koko kirjastoindeksin. Kokonaiskoko lyhenee vasta H2:n aidossa sivutuksessa.

## Seuraavien PR:ien rajat

- H2: uusi eksplisiittinen sivutettu kirjastoreitti, sivukohtainen data, vanhojen kyselylinkkien yhteensopivuus sekä canonical/hreflang/sitemap/404-testit.
- H3: lyhyt etusivu tuotantoon vasta H2:n ja nelikielisen arvioinnin jälkeen, Cloudflare-domainin käyttöönotto erillisellä päätöksellä.
- Ruokaopas #309 on julkaistu ja päällekkäinen #303 suljettu. Välipalakategorian valmistelu #310 on mainissa ilman julkaistuja välipalareseptejä. Briossikuvien ja reseptien korjaus #314 yhdistetty. Tämä H1-PR ei kopioi blogia, lisää valikolle uusia reittejä eikä tuo luonnoksia julkiseksi.

## Palautus ja omistajuus

Normaali build ei ota uutta etusivua käyttöön. Esikatselu poistuu jättämällä `VITE_RECIPAVO_HERO_PREVIEW` pois; vaihtoehtoisesti tämä PR voidaan palauttaa ilman reititys- tai ravintosisältömigraatiota.

Tämän haaran muutostiedostot: `site/src/features/recipes/RecipesPage.tsx`, `site/src/features/recipes/home-preview.ts`, `site/src/features/recipes/home-preview.css`, `site/tests/recipe-search.test.ts` ja tämä dokumentti. Ei kosketa blogin reititystä, prerender-/SEO-tiedostoja tai tavallista CSS-tiedostoa.

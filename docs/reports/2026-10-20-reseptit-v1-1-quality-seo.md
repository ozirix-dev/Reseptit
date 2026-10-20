# Reseptit V1.1 — tekninen laatukierros ja SEO

**Päivä:** 2026-10-20  
**Työhaara:** `codex/reseptit-v1-1-quality-seo`  
**Rajaus:** Reseptit-repo. Jeesitiimin repoihin tai tuotantoon ei tehty muutoksia.

## GitHub-katselmointi

- Toteutuscommit: `59ec7b3` (`Improve recipe site SEO and static rendering`).
- Pull request: [#5](https://github.com/ozirix-dev/Reseptit/pull/5), avoin ja yhdistämättä.
- GitHub Actionsin `build`-tarkistus läpäisi commitin `d427816` testit, buildin ja staattisen HTML:n testit. PR:n yhdistäminen ja tuotantojulkaisu eivät ole osa tätä työtä.
- GitHub Actions ilmoittaa nykyisistä `checkout@v4`- ja `setup-node@v4`-toimintojen Node 20 -deprekaatiovaroituksista sekä `ubuntu-latest`-kuvan siirtymästä Ubuntu 26:een. Nämä varoitukset eivät estäneet buildia.

## Auditoinnin havainnot

- Aiempi prerender tuotti title- ja head-metatiedot, mutta jätti React-sisällön tyhjäksi `#root`-elementtiin. Sivut tarvitsivat JavaScriptin ennen reseptin näyttämistä.
- Osa SEO-tiedoista syntyi vasta clientissä. Tuntemattomalle reitille olisi voinut jäädä etusivun canonical, ja kielten `x-default` ei ollut yleisesti oikea.
- Markdown-ohjeiden HTML:ää ja linkkikohteita ei sanitizoitu.
- Recipe-skeema ei kuvannut valinnaisia kuvia; repo ei sisällä valmiita reseptikuvia, joten kuvia tai kuvatietoja ei lisätty keinotekoisesti.
- Pilottireseptin teksti sisälsi teknisen kehityskuvauksen ja puuttuvia ääkkösiä.
- Mukana ovat nykyiset kaksi julkaistua suomenkielistä reseptiä: kermainen lohipata ja keto-kauralesesämpylät. Käännösluonnokset eivät muodosta reittejä.

## Tehdyt muutokset

- React-sivut prerenderöidään reittikohtaisesti täydellä näkyvällä sisällöllä. Asiakaspuoli hydratoi saman HTML:n annoslaskuria varten. Build tuottaa myös erillisen, `noindex,follow`-merkityn `404.html`-sivun ilman väärää canonicalia, Recipe-JSON-LD:tä tai hydration-virhettä.
- Canonical, hreflang, `x-default`, sivukartta, `html lang`, Open Graph ja Twitter-kortit syntyvät vain julkaistuille reiteille. Reseptin kuvatunnisteet lisätään vain, jos oikea kuva on määritetty ja löytynyt.
- Markdownin raakaa HTML:ää escapetaan, vaaralliset URL-protokollat hylätään ja ulkoiset linkit saavat `noopener noreferrer`-suhteen. Metatiedon schema hylkää tuntemattomat kentät ja virheelliset kuvaosoitteet. Build tarkistaa julkaistujen reseptien tunnisteiden ja reittien yksikäsitteisyyden.
- Kuvien lähdepaikka, `WebP`-metatiedot sekä hakemiston lazy loading ja reseptisivun ensisijainen lataus on tuettu. Kuvia ei vielä ole.
- Käyttöliittymä piilottaa yksinäisen kielilinkin, sisältää tulostustyylin ja varmistaa näkyvän näppäimistöfokuksen. Fokusväri vaihdettiin riittävän kontrastin sävyyn. Annoslaskurin toimintaa ja annoskohtaista sisältöä ei muutettu.
- Kermainen lohipata sai sisältöä kuvaavan ingressin ja kuvauksen; kehitysvaiheen pilotointiteksti poistettiin. Ainesmääriä ja ravintoarvoja ei muutettu.
- GitHub Actions estää julkaisun, jos yksikkötestit, build tai staattisen HTML:n testit epäonnistuvat. Dependabot tarkistaa viikoittain npm- ja GitHub Actions -riippuvuudet.
- Julkaisuarkkitehtuurin ohjeeseen lisättiin Search Console -käyttöönotto, projektipolun `robots.txt`-raja, kuvaohjeet ja bundle-kasvun tarkistusraja. Reseptin Google-rich-result-näkyvyys edellyttää ohjeiden mukaista kuvaa; tämä on kerrottu dokumentissa. [Googlen Recipe-ohje](https://developers.google.com/search/docs/appearance/structured-data/recipe)

## Tarkistukset

- `npm test`: **PASS**, 10 testiä. Sisältöpoiminta, luonnosten poissulku, annoslaskenta, numeromuotoilu, Markdownin XSS- ja URL-käsittely, schema ja kaksoiskappaleet.
- `npm run build`: **PASS**. TypeScript ja Vite onnistuvat; 3 reittiä prerenderöity (hakemisto ja kaksi reseptiä).
- `npm run test:static`: **PASS**, 5 testiä. Näkyvä HTML, SEO-tunnisteet, JSON-LD, kielilinkit, sitemap, robots ja 404.
- `npm audit --audit-level=low`: **PASS**, 0 haavoittuvuutta.
- `npm outdated`: `@types/node` 25.9.9 → 26.6.5, `marked` 17.0.6 → 18.1.1 ja TypeScript 5.9.3 → 7.0.2 ovat tarjolla uusina pääversioina. Niitä ei päivitetty tässä laatukierroksessa.
- Markdown-lint: **PASS**, 68 tiedostoa, 0 ongelmaa. `git diff --check`: **PASS**.
- Playwright paikallisessa Pages-previewssa: lohipata ja keto-sämpylät avautuvat suoraan; ei client-konsolivirheitä tunnetuilla sivuilla. 320 px leveydellä ei vaakavieritystä; 1440 px leveydellä kaksi saraketta. Näppäimistön ensimmäinen fokus näyttää ohituslinkin. Annosten lisäys muuttaa annoksen 4 → 5 ja lohen 600 g → 750 g. Tulostustilassa navigaatio ja annoslaskurin painikkeet piiloutuvat, sisältö jää näkyviin. `404.html` avautuu ilman client-virhettä.
- WCAG-kontrastia vastaava uusi fokusväri `#9b5a10` valkoisella taustalla: 5.44:1. Nykyiset pehmeä tekstiväri ja korostusväri valkoisella: 5.53:1 ja 7.03:1.
- Vite-tuotantobundle: JavaScript 331.50 kB (104.85 kB gzip), CSS 5.88 kB (1.96 kB gzip). Reseptit ovat vielä yhteisessä client-bundlessa. Arkkitehtuuriohje suosittelee uudelleenarviota noin 100 reseptissä tai kun gzipattu JavaScript ylittää 150 kB.

## Rajat ja jatkotoimet

- Testattu julkaisu on paikallinen build/preview, ei GitHub Pagesin tuotantodeploy. Testiympäristön tuntemattoman URL:n fallback poikkeaa GitHub Pagesin staattisen 404-tiedoston käsittelystä; tuotetun `404.html`-tiedoston sisältö tarkistettiin suoraan.
- Reseptit ovat Google Searchin Schema.org-Recipe-muodossa, mutta kuvan puuttuessa ne eivät täytä Googlen Recipe-rich-result-vaatimuksia. Aitojen reseptikuvien lisääminen ja Search Consolen vahvistus vaativat myöhemmän käyttöönoton.
- Riippuvuuksien uusien pääversioiden arviointi jätettiin erilliseksi tehtäväksi. Mitään Jeesitiimin hosting-, reititys- tai sisältöasetuksia ei muutettu.

## Käytetty design-ohjeistus

Ennen käyttöliittymämuutoksia luettiin web-design-handbook sekä Ossi-foundationin väri-, typografia-, layout-, komponentti-, sisältörakenne-, media-, saavutettavuus- ja token-muistiot. Sovellettiin vain tähän sivustoon tarpeellisia kohtia: selkeä reseptirakenne, mobiilinäkymä, näppäimistöfokus, kontrasti, kuva-altit, mittojen varaaminen ja tulostusasettelu.

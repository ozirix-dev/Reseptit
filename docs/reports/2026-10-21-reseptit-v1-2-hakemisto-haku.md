# Reseptit V1.2: kuvallinen hakemisto ja haku

## Päiväys ja laajuus

- Päiväys: 2026-10-21
- Repository: `ozirix-dev/Reseptit`
- Tuotantoauditointi: `https://ozirix-dev.github.io/Reseptit/`
- Työhaara: `codex/reseptit-v1-2-hakemisto-haku`
- Toteutuscommit: päivitetään viimeisen korjauscommitin jälkeen.
- Pull Request: [#23 – Reseptit V1.2: Kuvallinen hakemisto ja reseptihaku](https://github.com/ozirix-dev/Reseptit/pull/23)
- PR jätettiin yhdistämättä tehtävänannon mukaisesti.

## Lähtötilanne

Auditointi aloitettiin puhtaasta `main`-haarasta. `origin/main` osoitti committiin `17827a1309bca1e4b42cf0c48ef247061d7d6e7d` (20.10.2026, 20 kuvitettua reseptiä). Tuotannon viimeisin GitHub Pages -deploy oli onnistunut: deployment `7212751039`, commit `17827a1`.

Staattinen build sisälsi 42 julkaistua reseptiversiota: FI 39, EN 1, SV 1 ja TH 1. Suomeksi reseptejä oli pääruoissa 31, jälkiruoissa 3 ja leivonnaisissa 5; alkuruokakategoria oli tyhjä. Alkuperäinen hakemisto oli kapea yksisarakkeinen lista, eikä haku- tai suodatustoimintoja ollut. `diet_class` validoitiin Markdownissa mutta sitä ei kopioitu `RecipeEntry`-malliin.

Ennen muutosta kaikki nykyiset testit menivät läpi. Lähtötilanteen bundle:

| Tiedosto | Raaka koko | Gzip |
| --- | ---: | ---: |
| JavaScript | 430.27 kB | 120.94 kB |
| CSS | 5.88 kB | 1.96 kB |

GitHubissa oli kuusi avointa Dependabot-PR:ää. Projektissa ei ollut Markdown-lint-komentoa.

## Ossi Foundation -ohjeet

Luettiin yksityisen Ossi-repon `docs/web-design-foundation-quickstart.md` sekä layout-, sisältörakenne-, kuvat/media-, design token- ja saavutettavuusmuistiot. Niitä sovellettiin vain tämän hakemiston käytännön UI-päätöksiin. Projektin omat tekniset ratkaisut ja värit säilytettiin; uutta komponenttikirjastoa tai design systemiä ei lisätty.

## Sisältöauditointi

Nykyisistä julkaistuista resepteistä:

- kaikilla 42 reseptiversiolla on kuva, alt-teksti, otsikko ja kuvaus
- kuudelta puuttuu valmistusaika
- 36:lla on rakenteinen ruokavalioluokka: keto 3, tiukka VHH 27 ja väljempi VHH 6; kuutta ei ole luokiteltu
- 35:ltä puuttuu ravintoarvotieto kokonaan
- vaikeustaso on ilmoitettu kaikissa
- julkaistuissa sisältöteksteissä ei löytynyt `TODO`- tai `FIXME`-merkintöjä

Sisältöauditoinnin aikana kuvakatselussa havaittiin perunaa kahdessa perunattomaksi tarkoitetussa VHH-kuvassa. Kaalikääryleiden kuvitus vaihdettiin vastaamaan reseptin sisältöä, ja uusien 20 reseptin alt-tekstit täsmennettiin reseptikohtaisiksi. PR-reviewn jälkeen jauheliha-kaalikeiton porkkanaa näyttänyt kuva korvattiin reseptin nykyisiä aineksia vastaavalla kuvalla; aineslistaa ei muutettu. Samalla korjattiin liedellä valmistuvan keiton `cooking_method` ja poistettiin perusteeton maininta kermaisista aineksista. Ravintoarvoja tai puuttuvia valmistusaikoja ei keksitty.

## Toteutetut muutokset

### Hakemisto ja kortit

- Korvattiin pitkä lista kuvallisella ruudukolla: yksi sarake alle 700 px, kaksi 700–1099 px ja kolme vähintään 1100 px.
- Hakemistolle annettiin 1160 px enimmäisleveys; yksittäisen reseptin lukuleveyteen ei koskettu.
- Kortit sisältävät klikattavan kuvan, H3-otsikon, kuvauksen, valmistusajan, vaikeustason, kategorian ja rakenteisen ruokavaliomerkin silloin kun tieto löytyy.
- Kortin kuva ja teksti ovat saman linkin sisällä; sisäkkäisiä linkkejä ei ole. Puuttuvalle kuvalle on vakaan kuvasuhteen paikkamerkki.
- Kaikille korttikuville säilyvät lähteen `width`/`height`, `srcset`, `sizes` ja alt-tiedot. Vain ensimmäinen korttikuva ladataan eager-tilassa ja korkealla prioriteetilla; muut ovat natiivissa lazy-tilassa myös mobiilin yksisarakkeisessa näkymässä.

### Haku ja suodatus

- Haku kohdistuu reseptinimeen, ainesosien nimiin ja huomioihin, kuvaukseen sekä tunnisteisiin.
- Haku ei huomioi kirjainkokoa, normalisoi Unicode-merkkejä ja välilyöntejä sekä vaatii kaikkien hakusanojen osuman. Suomen ja ruotsin tarkkeet taitetaan, mutta thain sävymerkit säilytetään, jotta esimerkiksi ข้าว ja ข่าว pysyvät erillisinä hakusanoina.
- Kategoria- ja ruokavaliosuodattimet yhdistyvät hakutekstiin AND-logiikalla. Kategoriat näytetään vain, jos sillä kielellä on julkaistuja reseptejä.
- Keto-suodatin käyttää vain `diet_class=keto`; VHH-suodatin sisältää kaikki kolme rakenteista luokkaa. Tuntemattomia luokituksia ei päätellä tekstistä.
- Haku, kategoria ja ruokavalio tallentuvat `q`, `category` ja `diet` query-parametreihin. Tuntemattomat ja kielelle sopimattomat suodatusarvot sivuutetaan. Kielenvaihdon linkit eivät siirrä vanhoja suodattimia.
- Tulosten määrä, tyhjän tuloksen viesti, haun tyhjennys ja kaikkien suodattimien nollaus ovat mukana.
- Query-tila luetaan vasta hydraation jälkeen, jotta staattinen HTML vastaa ensimmäistä client-renderöintiä. Hakulomake ja suodatinten dynaaminen tulosstatus tulevat näkyviin vasta JavaScriptin käynnistyttyä; ilman JavaScriptiä reseptikortit ja linkit ovat edelleen staattisessa HTML:ssä. Canonical pysyy aina kyseisen kielihakemiston perusosoitteessa; sitemapiin ei lisätty query-sivuja.

### Monikielisyys ja tietomalli

- Lisättiin `dietClass` julkaistuun `RecipeEntry`-tietotyyppiin.
- Haku-, suodatin-, tulos-, tyhjä tila- ja tyhjennystekstit ovat suomeksi, englanniksi, ruotsiksi ja thaiksi.
- Hakemisto käyttää edelleen paikallisesti tuotettua julkaistua sisältöä. Luonnoksia tai uusia URL-reittejä ei lisätty.

## SEO ja staattinen HTML

Build tuottaa edelleen etukäteen näkyvän hakemiston ja 46 staattista reittiä. Kortit ja reseptilinkit löytyvät HTML:stä ilman JavaScriptiä. Canonical-, hreflang-, Recipe JSON-LD-, sitemap-, robots.txt- ja 404-käytäntöjä ei muutettu; staattiset testit varmistavat niiden säilymisen ja query-parametrien puuttumisen sitemapista.

## Saavutettavuus ja mobiili

- Käytössä ovat nimetyt natiivit search-, input-, select- ja button-elementit sekä ruudunlukijalle päivittyvä tulosstatus.
- Korttien otsikot säilyvät H3-elementteinä, kuvilla on kuvaavat alt-tekstit ja koko kortilla on näkyvä näppäimistöfokus.
- Hakulomake ei sisälly JavaScriptittömään HTML:ään eikä näy ennen toimivan haun käynnistymistä; staattiset reseptikortit ja niiden linkit säilyvät.
- Selainajo kattoi kirjoittamisen, ainesosahaun, yhdistelmäsuodattimet, nollatuloksen, nollauksen, jaetun URL:n, kaikkien neljän kielen hakutekstit, kortin linkkirakenteen ja näppäimistöfokuksen.
- Erillistä ruudunlukija- tai manuaalista WCAG-auditointia ei tehty.

## Suorituskyky

| Tiedosto | Ennen raaka / gzip | Jälkeen raaka / gzip | Muutos gzipissä |
| --- | ---: | ---: | ---: |
| JavaScript | 430.27 / 120.94 kB | 437.37 / 123.17 kB | +2.23 kB |
| CSS | 5.88 / 1.96 kB | 8.84 / 2.55 kB | +0.59 kB |

Kaikkien pakattujen resurssien yhteenlaskettu lisäys on noin 2.71 kB. Uusia riippuvuuksia ei lisätty. Ensimmäinen näkymä renderöitiin selainajossa myös ilman JavaScriptiä, mutta LCP-, CLS-, INP- tai Lighthouse-mittausta ei tehty. Näille ei raportoida arvioituja arvoja.

## Testaus

Kaikki seuraavat paikalliset tarkistukset menivät läpi:

- `npm test` — 17 testiä läpi (sisältää haun, suomen/ruotsin tarkkeiden taiton, thain ข้าว/ข่าว-sävymerkkien regressiotestin, ainesosahaun, kategoriat, ruokavalioluokat, yhdistelmäsuodattimet, URL-arvot, kielirajat sekä kaalikeiton aines- ja metatietovarmistuksen)
- `npm run test:image` — 2 testiä läpi
- `npm run build` — onnistui, 42 julkaistua reseptiversiota ja 46 esirenderöityä reittiä
- `npm run test:static` — 6 testiä läpi
- `npm run test:browser` — läpi
- `npm audit --audit-level=low` — 0 haavoittuvuutta
- `git diff --check` — läpi
- Markdown-lint — komentoa ei ole määritetty projektiin

GitHub Actions: [PR-run #39512345354](https://github.com/ozirix-dev/Reseptit/actions/runs/39512345354) onnistui (build 55 s). Deploy-vaihe ohitettiin PR:lle, kuten workflow'ssa on määritetty; tuotantojulkaisua ei tehty tässä työssä.

## Muutetut tiedostot

- `site/src/features/recipes/RecipesPage.tsx`
- `site/src/features/recipes/recipe-search.ts`
- `site/src/features/recipes/recipe-i18n.ts`
- `site/src/types/content.ts`
- `site/scripts/build-content.ts`
- `site/src/styles.css`
- `site/tests/recipe-search.test.ts`
- `site/tests/static-output.test.ts`
- `site/tests/browser-smoke.test.ts`
- 20 reseptin kuvitusta sekä niitä vastaavat alt-tekstit
- Tämä raportti

## Avoimet asiat ja jatkoehdotukset

- Kuudelle reseptille kannattaa lisätä valmistusaika, kun se voidaan tarkistaa reseptin sisällöstä.
- Kuuden luokittelemattoman reseptin ruokavalioluokka voidaan arvioida sisältötyönä; hakusuodatin ei näytä niitä VHH-resepteinä ennen luokitusta.
- Ravintoarvot voidaan lisätä 35 reseptille lähteeseen perustuen; arvioita ei pidä päätellä hakutoimintoa varten.
- Alkuruokakategoria on tyhjä, joten sitä ei näytetä suodattimissa ennen sisältöä.
- Lighthouse/Core Web Vitals -vertailu sekä ruudunlukijan käsintestaus ovat jatkotarkistuksia.

## Kokonaisarvio

**8/10.** Toteutus on kevyt, staattinen, lokalisoitu ja testattu vaadituilla viewport-leveyksillä. Hakemisto hyödyntää rakenteista metadataa eikä lisää ulkoisia palveluja tai riippuvuuksia. Sisältölaadun puutteet ovat dokumentoituja, eikä hakemisto peitä niitä keinotekoisilla ravintoarvoilla tai keksityillä ruokavaliomerkinnöillä. Lighthouse- ja ruudunlukijamittaukset jäivät tekemättä.

## Lopputila

**READY TO MERGE** — paikallinen CI ja GitHub Actions menivät läpi. PR jätetään auki; tätä muutosta ei yhdistetä automaattisesti.

# Recipavo Image SEO V1 – kuvastandardi, kuvaputki ja julkaisurajat

Päiväys: 2026-11-06
Tila: **toteutusohje / hyväksyttävä erikseen**, ei väite jo tehdyistä teknisistä muutoksista.
Kohde: Reseptit (nykyinen GitHub Pages), myöhemmin Recipavo.com; reseptit ensin, blogi samaa laadunhallintaa soveltaen.

## Miksi

Google ei edellytä laitekohtaista tarkkaa pikselitaulukkoa. Google Recipe suosittelee
kolmea kuvasuhdetta (1:1, 4:3, 16:9), joista kunkin kuvan pinta-ala on
vähintään 50 000 px. Discoveriin Google suosittelee vähintään 1 200 px leveää,
yli 300 000 px sisältävää 16:9-kuvaa ja `max-image-preview:large`-asetusta.
Nämä ovat **suosituksia**, eivät takuuta hakutuloksista, Discoverista tai sijoituksesta.

Recipavon omiksi toimitusstandardeiksi valitaan:

| Käyttö | Kuvan suhde | Master-kuva | Huomautus |
| --- | --- | --- | --- |
| Google Recipe -neliö ja korttirajaus | 1:1 | 1600 × 1600 px | Oman kuvan kohderajaus |
| Recipe-rikas hakutulos, reseptisivu | 4:3 | 1600 × 1200 px | Oma vaakakuvansa |
| Google Discover, OG ja sosiaalinen jako | 16:9 | 1600 × 900 px | Ensisijainen jaettava kuva, > 1200 px leveä |

Kaikki kolme esittävät **samaa valmista ruokaa**, eivät kolmea eri ruokaa.
Yhdestä riittävän suuresta alkuperäisestä voi tehdä laadullisesti tarkastetut
rajaukset; rajaus **ei saa** katkaista olennaista ruokaa. Tarvittaessa tuotetaan
kolme erilaista kuvaa samasta ruoasta. Älä suurenna 256 px lähdettä ja esitä sitä
aidosti korkearesoluutioisena. Alkuperäisen kuvadatan on oltava aidosti tarkkaa.

## Responsiiviset toimitusversiot: ei erillistä Googlen mobiilisääntöä

Mobiili/tabletti/desktop-rajat ovat **palvelun oma suorituskykysuunnitelma**.
Selaimen `srcset` / `sizes` valitsee todellisen laitekoon, DPR:n ja
CSS-kuvaruudun perusteella; esimerkiksi pieni Retina-puhelin voi valita
960 px version. Älä pakota yhtä kokoa pelkän `User-Agent`-tiedon perusteella.

| Näyttö / kuvapaikka | Tavalliset tarjottavat leveydet |
| --- | --- |
| Puhelin, kortti tai reseptin pääkuva | 480, 960 px |
| Tabletti tai kapea desktop | 960, 1440 px |
| Leveä desktop / suuri hero | 960, 1440, enintään 1600 px |

Säilytä mahdollisuus 480/960/1440 + 1600 master -kokovalikoimaan.
Nykyinen `site/src/content/published-images.ts` tekee jo 480/960/1440,
`WebP quality 78` ja `effort 4`, ilman suurennusta. **Älä korvaa
toimivaa putkea uudella toteutuksella**. Laajenna nykyistä putkea
vain kuvasuhteen mukaan ilmoitettuihin kolmeen lähdekuvaan. Variantteja
ei lisätä Git-repoon; ne ovat build-tuotoksia. Säilytä nykyiset staging,
atominen vaihto, cache, SHA-sidokset ja symlink-turvarajat.

Laatu- ja siirtobudjetti ovat ohjeelliset, eivät Googlen rajat:
säädä WebP-laatua silmämääräisen tarkastuksen perusteella; tavoittele
mobiilin ensilatauksessa vain yhtä tarpeeksi tarkkaa pääkuvaa,
ei kaikkia kolmea 1600 px kuvaa. Älä heikennä nykyistä LCP:tä.

## Tiedostot ja metatieto

Yhden reseptin tiedostot (esimerkki, nykyistä polkua muuttamatta):

```text
kuvat/leivonnaiset/briossisampylat-joshua-weissman.webp          # 16:9, 1600x900, vanhan kuvan korvaava kanoninen src
kuvat/leivonnaiset/briossisampylat-joshua-weissman-4x3.webp      # 4:3, 1600x1200
kuvat/leivonnaiset/briossisampylat-joshua-weissman-1x1.webp      # 1:1, 1600x1600
```

Ehdotettu skeemalaajennus on nimetty `image.variants` (ei nykyinen
`image.srcset`, joka on leveysversioita varten). Esimerkiksi:

```yaml
image:
  src: leivonnaiset/briossisampylat-joshua-weissman.webp
  alt: "Yhdeksän kullanruskeaa seesamilla viimeisteltyä briossisämpylää pellillä"
  width: 1600
  height: 900
  variants:
    square: leivonnaiset/briossisampylat-joshua-weissman-1x1.webp
    fourThree: leivonnaiset/briossisampylat-joshua-weissman-4x3.webp
    wide: leivonnaiset/briossisampylat-joshua-weissman.webp
```

**Huom:** `variants` on vasta ehdotettu uusi kenttä. Nykyinen
`site/src/content/schema.ts` on `strict()`, joten tätä ei saa lisätä
tuotantoreseptiin ennen skeeman, buildin, reittidatan, esirenderin ja testien
toteutusta. Pidä kieliversiot samassa kuvaidentiteetissä ja käännä alt-tekstit
kaikille julkaistuille kielille. Älä anna erikielisille resepteille ristiin
eri ruokaa esittävää kuvaa.

## Julkaisun SEO-tekninen toteutussopimus

- `site/src/features/recipes/schema.ts`: Recipe-JSON-LD:n `image` on
  julkisesti indeksoitavien, todellisten 1:1-, 4:3- ja 16:9-versioiden
  **kolmen absoluuttisen URL:n taulukko**. Nykyinen toteutus antaa yhden.
  Älä mainosta olemattomia tai vielä lataamattomia polkuja.
- `site/scripts/prerender.ts`: `og:image` ja `twitter:image`
  osoittavat laadukkaaseen 16:9-kuvaan, kun sellainen on. Lisätään
  `<meta name="robots" content="max-image-preview:large">` tuotannon
  indeksoitaville sivuille **vain silloin, kun muuta robots-ohjetta ei
  muuteta epähuomiossa**. 404- ja preview-sivut säilyttävät `noindex`-rajansa.
- HTML:ssa pääkuva renderöidään oikealla `<img src>`-osoitteella,
  `srcset`-leveyksillä, `sizes`-arvolla ja todellisilla `width` /
  `height`-mitoilla. Koko ja kuvasuhde eivät saa tuottaa CLS-siirtymää.
- Etusivun ja hakemiston LCP-kuvat: nykyinen ensimmäisen kortin
  `eager/high`-polku säilyy; muut kortit `lazy`. Älä tuplapreloadaa
  samaa kuvaa. Reseptisivun hero-kuvan latausprioriteetti varmennetaan
  selaimen verkkoajosta, ei oleteta. Alt-teksti kuvaa näkyvän ruoan,
  ei lista avainsanoja.
- Lisää kolme kuvasuhdetta vain riittävästi tarkkoihin kuviin. Jos
  jonkin suhteen kuva puuttuu, jätä se pois metadata-taulukosta ja
  raportoi puute. Älä tee piilotettua ohjelmallista ylösskaalausta.
- URLien on oltava julkisia ja oikealla tyypillä (`image/webp`),
  HTTP 200, crawlable/indexable. WebP on Googlen tukema muoto.
  Varmista myös ettei kuvaa ole estetty robots-säännöllä.
- Jatka canonical-, hreflang- ja sitemap-käytäntöjä; älä muuta domainin
  kanonisia URL:eja `recipavo.com`-osoitteeseen ennen kuin uusi domain
  oikeasti palvelee samoja sivuja. Muutoksen yhteydessä tee erillinen
  migraatio, redirectit ja Search Console -tarkastus.
- Älä kopioi muiden sivustojen kuvia tai merkitse lähdesivuston
  arvosteluja oman reseptin `aggregateRating`-kenttään.
  Pelkkä YouTube-linkki ei ole oma `VideoObject`-rikastetieto:
  erillinen video-metadata edellyttää asianmukaista omaa tai
  lisensoitua, oikeasti sivulla esitettävää videota ja kelvollisia
  metatietoja. Tekoälykuva merkitään käyttäjälle totuudenmukaisesti.

## Julkaisuauditointi: automaattinen + toimituksellinen

Lisää tulevaan kuvien CI-tarkistukseen rajattu `image:seo`-portti:

1. Kaikki **uudet julkaistut** reseptit vaativat todennetun aidon
   `src`-lähteen (ei vain metatietoa), vähintään 1200 px leveän 16:9-kuvan
   ja toimituksellisen kuvatarkistuksen. Uudelle tuotantomasterille suositellaan
   kolmea nimettyä kuvasuhdetta. Tarkistus käyttää oikeita pikselimittoja.
2. Jo julkaistut vanhat kuvat raportoidaan ensin inventaarioksi;
   älä tee koko yli 300 reseptin kirjastosta yhtäkkiä build-HOLDia.
   Poikkeuslista vaatii resepti-ID:n, todellisen pikselikoon,
   korjaus-P/R:n ja tilan; vanhoille kuville on korjausjono.
3. Varmista, että 1:1 on todella 1:1, 4:3 todella 4:3 ja 16:9
   todella 16:9 (pieni yhden pikselin pyöristystoleranssi sallittu),
   eikä mikään master ole ylösskaalattu 256 px lähteestä.
4. Varmista `image.width`/`height` = tiedoston mitat, rikkinäisiä
   varianttipolkuja ei ole, metatiedot ovat vain julkaistuissa reiteissä,
   JSON-LD vastaa HTTPS 200 -URL:eja ja vastaa sivun näkyvää ruokaa.
5. Varmista mobiili/tabletti/desktop + DPR 1/2/3:
   `currentSrc` on oikea ehdokas; CLS ei kasva, lazy preloadit eivät
   lataa ylimääräisiä kuvia, LCP/bandwidth ei huonone olennaisesti.
   Nykyiset selaimen testit löytyvät
   `site/tests/responsive-images.browser.test.ts`-tiedostosta.
6. Aja `npm run test:image`, `npm run build`, `npm run test:static`,
   `npm run audit:seo` ja valitut selaintestit. Lopuksi tarkista
   oikea julkinen URL sekä [Rich Results Test](https://search.google.com/test/rich-results).
   `npm run audit:seo:public` on hyödyllinen vasta merge+deployn jälkeen.
   Search Console voi näyttää viiveellä vanhaa dataa.

## Ensisijainen toteutusjärjestys

**P0 – korjaa julkaistu laatuaukko (oma erillinen reseptikuva-PR):**

- `briossisampylat-joshua-weissman`
- `hampurilaissampylat-moomie`
- `kevyet-briossisampylat-clever-carrot`

Mainissa näiden `image.width`/`height` on **256 × 144**, eli 36 864 px
ja alle Googlen Recipe-suosituksen 50 000 px. Korvaa jokainen aidosti
korkearesoluutioisella, reseptin omaa ulkoasua esittävällä WebP:llä,
korjaa metatiedot, alt ja kuvatekstit, varmista uusia kuvia vastaava
build ja responsiivinen kuva. Älä suurenna nykyistä pikkuista WebP:tä.
Ensimmäinen turvallinen julkaisu korvaa yhden 16:9-masterin per resepti
nykyisen skeeman ja putken kautta. Tämä ei vielä täytä kaikkia V1:n
kolmen kuvasuhteen tavoitteita.

**P1 – toteuta kolme kuvasuhdetta:** muuta skeema, putki,
`Recipe.image`, OG, testit ja SEO-auditointi hallitusti.
Varmista ettei hero/blogi-PR ole muuttanut samoja tiedostoja.
Pidä nykyinen 480/960/1440 optimointi, liikenteen säästö ja pieni bundle.

**P2 – muu kirjasto asteittain:** tee kuvaraportti järjestyksessä
liikenteen tärkeimmät reseptit → uudet reseptit → aiempi kirjasto;
ei kaikkien kuvien kerralla generointia. Blogi otetaan mukaan vasta
kun blogin oma tekniikka on julkaistu ja tarkastettu.

**P3 – seuranta:** GitHub Pages -vaiheessa tarkista GSC-reittinä
`https://ozirix-dev.github.io/Reseptit/`. Kun Recipavo.com on
oikeasti käytössä, tee oma migraation tarkistus, GSC/Sitemap, indeksointi,
Google Images, Rich Results, Discover-impressiot (jos näkyviä).
Tallenna raporttiin havaintoarvot ja päivämäärä, ei sijoituslupauksia.

## Täsmälliset lähteet (tarkistettu 2026-11-06)

1. [Google Recipe structured data](https://developers.google.com/search/docs/appearance/structured-data/recipe)
2. [Google Discover and your website](https://developers.google.com/search/docs/appearance/google-discover)
3. [Google Image SEO best practices](https://developers.google.com/search/docs/appearance/google-images)
4. [Google web.dev – serve responsive images](https://web.dev/articles/serve-responsive-images/)
5. [Nykyinen Reseptit-kuvaputken ohje](../responsive-images.md)
6. [Nykyinen SEO-valvonta](../seo-monitoring.md)

Google ei lupaa rich results -esitystä, indeksointia tai sijoituksia sillä,
että mitat, JSON-LD ja kuvan metatiedot ovat oikein. Tulokset riippuvat myös
sisällön hyödyllisyydestä, laadusta ja Googlen hakujärjestelmistä.

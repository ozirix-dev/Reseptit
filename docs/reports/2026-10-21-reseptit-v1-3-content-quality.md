# Reseptit V1.3 – sisältölaatu ja suorituskyky

Päiväys: 21.10.2026  
Vertailupohja: `09cc619c19e8a221d3b2cb86bdd0dbb5096dd012`  
Työhaara: `codex/reseptit-v1-3-content-quality`

## Auditoinnin kattavuus

- Suomenkielisiä julkaistuja lähteitä: **39**.
- Julkaistuja käännöksiä: **117** (39 EN, 39 SV, 39 TH).
- Julkaistuja reseptiversioita yhteensä: **156**.
- Tuotantobuildin esirenderöimiä reittejä: **160**.
- Automaattiseen inventaarioon ja käännösparien rakennetarkistukseen sisältyivät kaikki yllä olevat. Tiedostokohtaiset tiedot ovat samanaikaisessa `2026-10-21-reseptit-v1-3-inventory.csv`- ja käännösrivien tulokset `2026-10-21-reseptit-v1-3-audit.csv`-tiedostossa.

Tarkistus säilytti `recipe_id`- ja `url_slug`-arvot. Sisältöbuildi tuottaa 156 kieliversiota ja 160 reittiä. Käännösvertailu tarkistaa julkaisutilan ja käännösviitteet, kielen, kategorian, annokset, ainesosien määrän ja määrät, yksikkömuunnosten vastaavuuden, valmistusajan, ravintoarvot, ruokavalioluokan, valmistustavan, kuvatiedoston sekä valmistusvaiheiden määrän ja tunnistetut numeeriset aika- ja lämpötilat.

## Korjaukset

- **111 käännöstiedostoa** muuttui; kaikki 117 julkaistua kieliparia ovat inventaariossa ja tarkistuksessa. Käännöksiä ei siirretty luonnoksiksi eikä URL-osoitteita muutettu.
- Korjattiin virheellisiä voin käännöksiä (EN `butter`, SV `smör`, TH `เนย`) sekä thaiksi valkokaalin (`กะหล่ำปลี`) ja naudan jauhelihan (`เนื้อวัวบด`) nimityksiä. Korjauksia tehtiin vain lähteen ja ainesosan kontekstin perusteella.
- Korjattiin nestemäisen kuohukerman sekoittuminen valmiiksi vatkattuun kermaan useissa EN- ja SV-ohjeissa. Samalla korjattiin lohikeittojen `fish fondue` -käännös kalafondille sekä lähteeseen liittyvät ohjetekstin kirjoitusvirheet.
- Korjattiin EN/SV/TH-karjalanpaistin lihapalojen nimet, TH:n virheellinen jauheliha- ja porsaanlihatermi, kokonaisen maustepippurin käännös ja valmistusvaiheiden selkeys.
- Korjattiin kaalilaatikon EN- ja TH-ruokanimen kirjaimellinen “cabbage box” -käännös sekä uunipaistamisen sanamuotoja.
- Korjattiin pinaattilettujen lähteen valmistustapa pannuksi sekä sitä vastaavat käännösmetatiedot ja ohjeen ristiriitainen annoskuvaus aiempien työmuutosten yhteydessä. Lähteen sisältömuutokset synkronoitiin kieliversioihin.
- Käännösten tagit ja ainesosanimet täsmennettiin kontekstikohtaisesti. Ohjeita, määriä, URL:eja tai ravintoarvoja ei muutettu oletusten perusteella.
- Luotiin FI–EN–SV–TH-sanasto: `meta/kaannokset/ruokasanasto.md`.
- PR säilyttää myös jo työtilassa olleet käyttäjän aiemmin pyytämät muutokset: Italian padan julkaistut kieliversiot ja reseptinäkymän kielikohtaiset käyttöliittymätekstit sekä hakemisto-/virhetilan parannukset. Niitä ei poistettu tämän sisältöauditoinnin yhteydessä.

Automaattinen tarkistus ei löytänyt jäljellä olevia rakenteellisia ristiriitoja tai määriteltyjä kriittisiä termivirheitä: **0 virhettä / 117 paria**. Tämä tulos ei todista käännösten semanttista oikeellisuutta.

## Lähdereseptien, ravintoarvojen ja valmistuksen rajoitukset

- Aiemmin korjatun pinaattilettujen valmistustavan lisäksi kaikkia 39 lähdereseptiä käytiin läpi metadatan ja rakenteisten käännösvertailujen avulla. Kaikkien ohjeiden käytännön toimivuutta ei voi todistaa Markdownista; mitään reseptiä ei merkitä tässä raportissa keittiössä testatuksi.
- Kaikkien lähteiden ravintoarvoja ei laskettu uudelleen. Käännösversioiden arvot vastaavat lähdettä, mutta tämä ei vahvista lähteen laskelman oikeellisuutta. Pakkausmerkintöihin ja annoskokoihin perustuva ravintoarvotarkistus tarvitaan erikseen.
- Ruokavalioluokat ovat säilyneet lähteen mukaisina. Hiilihydraattiarvoja tai luokituksia ei keksitty eikä kaikkia luokituksia varmennettu ravitsemuslaskennalla.
- Yleisiä, samankaltaisia kehitysvaiheen ingressi- ja kuvauskappaleita on lähdeaineistossa. Sivuston sisältöbuildi ohittaa tunnistetut boilerplate-kuvaukset ja muodostaa niille ainesosista johdetun esittelyn. Markdown-lähteiden yksilöllinen toimituksellinen uudelleenkirjoitus on edelleen tarpeen.

## Kuvat ja alt-tekstit

Kaikkien 39 julkaistun reseptikuvan yhteensopivuus tarkastettiin kontaktikuvasta. Kuvissa ei havaittu ilmeisiä toiseen reseptiin kuuluvia ruokia tai ainesosaristiriitoja. Kaikissa 117 käännöksessä kuvatiedosto vastaa lähdettä, ja alt-tekstit ovat kieliversioissa erilliset (0/117 täysin samaa tekstiä kuin suomeksi). Yksittäisten alt-tekstien kieliopillinen ja ruoan yksityiskohtia kuvaava tarkistus kuuluu jäljellä olevaan kieliarvioon. Uusia kuvia ei luotu.

## Käännösten luotettavuus ja avoimet epävarmuudet

Automaattiset testit tarkistavat metadataa, määrärakennetta, valittuja ruoanvalmistusfaktoja ja erikseen määriteltyjä virhetermejä. Ne eivät ymmärrä kaikkien 117 ohjetekstin merkitystä, eivätkä ne korvaa kaksikielistä käännösarviota. **Kaikkien 117 käännöksen (erityisesti 39 thaiversion) riippumaton ihmisen tekemä kieli- ja reseptitarkistus on yhä kesken.** Thai-ruokien nimissä on selittäviä translitterointeja ja lainasanoja; niiden luontevuutta ei voi vahvistaa ilman thai-kielistä arvioijaa. Raportti ei väitä käännöksiä syntyperäisen puhujan tarkistamiksi.

Jatkotarkistusta tarvitsevat kaikki erikoisnimet ja kohdekulttuurissa harvinaiset termit, mm. Runebergin tortut, karjalanpaisti, rahka, poronkäristys, VHH-luokka sekä maitotuotteiden tarkka tuotetyyppi. Mahdolliset käytännön kypsennysaikojen, annoskokojen ja lähderavintoarvojen poikkeamat vaativat erillisen keittiö- tai laskentatarkistuksen.

## SEO, staattinen sisältö ja käyttöliittymä

SEO:n ja staattisen HTML:n tuotantotestit vahvistavat nykyisillä reiteillä title/description-, canonical-, hreflang-, `x-default`-, JSON-LD-, sitemap-, 404-noindex- ja julkaistujen reittien muodostumisen. SSG-reitit ja JavaScriptittömän näkymän sisältö säilyvät. Nelikielisen haun, annoslaskurin, mobiilin vaakavierityksen ja näppäimistökäytön selaintestit suoritetaan CI:ssä.

## Suorituskykymittaukset

Tuotantobuildi työhaarasta:

| Resurssi | Raaka koko | gzip |
|---|---:|---:|
| JavaScript | 768.31 kB | 175.70 kB |
| CSS | 9.07 kB | 2.57 kB |

Vertailu käyttäjän antamaan aiemman tuotantobuildin mittaan (755.35 kB / 173.62 kB gzip) on **+12.96 kB raakaa ja +2.08 kB gzipattua JavaScriptiä**. Asetettu 150 kB:n gzip-raja ylittyy edelleen.

Nykyinen generated content JSON sisältää kaikkien neljän kielen 156 reseptitietuetta. Yksittäisen kielen tietueiden JSON-koko pakattuna erikseen on FI 15.41 kB, EN 15.47 kB, SV 15.61 kB ja TH 19.19 kB; koko JSON on 454.01 kB raakana / 70.73 kB gzipattuna. Tämä on mitattu sisältöaineiston koko, ei täsmällinen delta bundlesta, koska yhteispakkaus ja JavaScriptin koodaus muuttavat lopullista kokoa. Kaikkien kielten sisältö sisältyy nykyiseen samaan 175.84 kB:n gzip-JavaScriptiin myös yksittäisellä sivulla. Tässä buildissa Reactin ja reitityskirjaston tarkkaa pakattua osuutta ei eritelty moduulimetadatalla.

Lighthouse ajettiin nykyiseen tuotantoon `https://ozirix-dev.github.io/Reseptit/` (ei tämän työhaaran julkaisuun): Performance **91/100**, LCP **2.9 s**, CLS **0**, TBT **30 ms** ja koko sivun siirtokoko **1,798 KiB**. INP-arvoa ei saatu: sivustolla ei ole käytettävissä riittävää todellisten käyttäjien RUM-dataa. Lighthouse-tulos on yksittäinen ympäristökohtainen mittaus, ei yleinen suorituskykytakuu.

Suositus erilliselle suorituskyky-PR:lle: erota generated-käännössisältö kielikohtaisiin moduuleihin, lataa valittu kieli asiakasbundleen ja säilytä kaikki julkaistut kielisivut staattisesti esirenderöityinä. Vertaa moduulien riippuvuuksia ja selaimen ladattua JS:ää ennen ja jälkeen; älä muuta tässä sisältö-PR:ssä reititysarkkitehtuuria.

## Testit

Paikalliset testit ennen pushia:

- `npm ci`: onnistui.
- `npm test`: PASS, 17 testiä.
- `npm run test:translations`: PASS, 2 testiä; 39 lähdettä ja 117 käännöstä, 0 rakenteellista/valittujen termien virhettä.
- `npm run test:image`: PASS, 2 testiä.
- `npm run build`: PASS, TypeScript + Vite ja 160 esirenderöityä reittiä.
- `npm run test:static`: PASS, 6 testiä.
- `npm run test:browser`: PASS, 1 selainkokonaisuus (nelikielinen haku, SEO, näppäimistö ja responsiivisuus).
- `npm audit --audit-level=low`: PASS, 0 haavoittuvuutta.
- `git diff --check`: PASS, ei whitespace-virheitä.

GitHub Actionsin PR-tulos on vielä odottamassa.

## GitHub

- Tuotantoa ei julkaista eikä PR:ää yhdistetä tässä työssä.
- Commit: täydennetään pushin jälkeen.
- PR: täydennetään luomisen jälkeen.
- GitHub Actions: täydennetään CI-ajon valmistuttua.

## Suositeltu tila

**TECHNICALLY READY – HUMAN LANGUAGE REVIEW PENDING**, jos kaikki paikalliset testit ja PR:n CI onnistuvat. Julkaistun käännössisällön lopullinen luotettavuus edellyttää riippumatonta ihmisen tekemää kieli- ja reseptitarkistusta.

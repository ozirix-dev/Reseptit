# Reseptit V1.5 – responsiiviset kuvat ja lataustehokkuus

## Rajaus ja lähtötilanne

Päivä: 22.10.2026. Työhaara: `codex/reseptit-v1-5-responsive-images`.
Lähtöcommit: `59cd1d0841c12cee33023f321134803c1311021f` (PR #38:n merge).
Tehtävän vanhempi PR #37:n SHA korvattiin tarkistetulla uusimmalla mainilla.
Toteutuscommit: `14f81cfb6e451b18569a2874aaeb642210188a97`.

Kolme olemassa olevaa työpuuta, haarat, avoimet PR:t ja käynnissä olevat
reseptiprosessit tarkistettiin. Keskeneräistä V1.5-työtä ei löytynyt.
Puhdas `D:/Projects/tmp/reseptit-v14-content` käytettiin uudelleen uusimmasta
mainista luodulla haaralla; kanonisen repon ja vanhan suorituskykytyöpuun
haaroja ei vaihdettu. Ruokasisältöjä, URL-osoitteita tai alkuperäiskuvia ei muutettu.

Inventaario: 119 lähdereseptiä, 119 versiota jokaisella kielellä fi/en/sv/th,
476 julkaistua reseptiversiota, 480 reittiä ja 119 alkuperäistä WebP-kuvaa.
Lähdekuvien koko yhteensä on 25 137 624 tavua. Mitat:

| Pikselimitat | Kuvia |
| --- | ---: |
| 1280 × 853 | 77 |
| 1279 × 853 | 40 |
| 1254 × 1254 | 1 |
| 2200 × 1053 | 1 |

Aiemmassa julkaisussa ei ollut yhtään käytössä olevaa `srcset`-määritystä.
Metatietojen ja tiedostojen välillä ei löytynyt mittaristiriitoja.
Kaikkien 119 lähteen SHA-256 säilyi, samoin V1.4:n 15 korjauksen manifesti.
[Inventaario ja lähde-SHA:t](2026-10-22-v1-5-data/source-audit.json)
sisältävät kuvakohtaiset käyttäjät, kieliversiot, mitat ja tavumäärät.

## Toteutus ja laatu

Sharp 0.35.5 / libvips 8.18.7 / WebP 1.6.0 on lukittu build-riippuvuus.
480/960/1440 pikselin versiot generoidaan vain lähdettä pienempinä,
quality 78 / effort 4. Ei suurennusta, rajausta tai AI-muutoksia.
Alkuperäinen säilyy identtisenä `src`-osoitteena ja suurimpana vaihtoehtona.
Nykyisestä aineistosta syntyy 239 varianttia, yhteensä 15 788 118 tavua.
Neljä kieliversiota jakaa samat tiedostot.

Vertasin lohipataa, sämpylöitä ja gazpachoa laaduilla 75, 78 ja 82 sekä
480 että 960 pikselin kokoisina. Tarkistin kokonaiskuvat ja 1:1-yksityiskohdat:
lohen ja tillin rakenne, korin punos, sämpylöiden pinta ja vihanneskuutiot.
Laadulla 78 yksityiskohdat säilyivät näkyvässä käyttökoossa hyvin; 82 kasvatti
kokoa ilman tässä otoksessa olennaista näkyvää hyötyä. Valinta on visuaalinen
oma tarkistus, ei häviöttömyysväite tai käyttäjien laatututkimus.
[Laatukokeen tavumäärät](2026-10-22-v1-5-data/quality.json).

Esimerkiksi gazpacho: alkuperäinen 223 396 tavua, 480/q78 36 206 tavua,
960/q78 96 594 tavua. Lohipata: alkuperäinen 342 986 tavua,
480/q78 62 202 tavua ja 960/q78 170 358 tavua.

Generointi käyttää olemassa olevaa kopiointi-, staging- ja rollback-putkea.
Hash-nimet riippuvat lähdetavuista ja encoder-asetuksista. Kahden työntekijän
raja ja yksi natiivi encoder-säie pitävät muistinkäytön rajattuna. Kelvolliset
aiemmat variantit käytetään uudelleen; SHA, WebP-muoto ja mitat tarkistetaan.
Korruptoitunut tai hakemiston ulkopuolelle osoittava cache rakennetaan uudelleen.
Virhe ei korvaa aiempaa tulostetta. Vanhat variantit poistuvat atomisen vaihdon
mukana. Alkuperäiskansiota ei saa käyttää tulostehakemistona.

Kortin `sizes` vastaa 1/2/3-palstaista ruudukkoa sisäreunuksineen; hero käyttää
820 pikselin enimmäisleveyttä. Ensimmäinen kortti on eager/high, muut lazy.
Desktopin toisen ja kolmannen kuvan mediaehdolliset esilataukset käyttävät
samaa `srcset`/`sizes`-paria. Reactin automaattinen preload vastaa kuvan attribuutteja.
Open Graph ja Recipe-JSON-LD käyttävät edelleen alkuperäistä kuvaa.

Reittikohtainen JSON, SSG, hydraatio ja kevyt client-bundle säilyvät.
500 lähdereseptin ensimmäinen koe paljasti TypeScriptin TS2590-rajan 2 000
reseptiversion suorassa olioliteraalissa. Generoitu vain buildissa käytettävä
TS-moduuli lukee nyt jo validoidun JSON-merkkijonon `JSON.parse`-kutsulla.
Tämä ei muuta reittidatan rakennetta. Korjauksen jälkeen mitattujen sivujen
HTML-tavumäärät ja client-assetien hash-nimet olivat ennallaan.

[Putken ylläpito ja mittausten toistaminen](../responsive-images.md).
[Generoitu kuvamanifesti](2026-10-22-v1-5-data/image-manifest.json).

## Mittausmenetelmä

Uudet V1.5-mittaukset tehtiin ennen muutoksia ja niiden jälkeen. Lähtöbuild
jäädytettiin omaan kansioon. Molemmat palveltiin samalla paikallisella
HTTP/gzip-palvelimella; absoluuttiset kuva- ja navigointiosoitteet korvattiin
paikallisilla myös HTML:ssä, JS:ssä ja JSONissa. Kaikki 60 ajon verkkopyynnöt
kohdistuivat tähän palvelimeen ja saivat 200-vastauksen.

- Windows x64, Node 24.14.1, Brave-tiedostoversio 155.1.97.56,
  Chromium 155, Lighthouse 13.5.0 ja chrome-launcher 1.2.2.
- Mobiili: 412 × 823, DPR 1,75, simuloitu RTT 150 ms,
  throughput 1638,4 kbit/s ja CPU-kerroin 4.
- Desktop: 1350 × 940, DPR 1, RTT 40 ms, 10240 kbit/s, CPU-kerroin 1.
- Viisi reittiä × kaksi profiilia × kolme ajoa kummassakin vaiheessa.
  Tuore selaimen profiili / Lighthouse storage reset, sama palvelimen cache-politiikka.
- Alla mediaanit. kB = 1000 tavua. Verkkosiirto on Lighthouse transferSize,
  johon sisältyy myös HTTP-otsakkeita. Kuvapyynnöt eroteltiin resourceType-kentällä.
- Ei rinnakkaisia build- tai skaalautuvuusajoja Lighthouse-mittausten aikana.
  Ajot tehtiin ennen–jälkeen-järjestyksessä; tätä ei pidä tulkita kontrolloiduksi
  laitetutkimukseksi tai tuotannon kenttädataksi.

INP:tä ei mitattu. TBT ei ole INP. GitHub Pagesin todellista verkkoa,
käyttäjäjakaumaa tai tuotannon kenttä-LCP:tä ei vielä todennettu tällä PR:llä.

## Lighthouse ja verkkosiirto

Merkintä: ennen → jälkeen. LCP ja TBT millisekunteina, kuvasiirto kB.
Kaikkien 60 ajon CLS oli 0.

| Profiili / sivu | Performance | LCP ms | TBT ms | Kuvat kB |
| --- | ---: | ---: | ---: | ---: |
| mobile / FI-hakemisto | 84 → 97 | 4383 → 2432 | 37.0 → 32.5 | 1547.0 → 673.9 |
| mobile / FI-lohipata | 92 → 97 | 3304 → 2404 | 33.0 → 19.0 | 343.3 → 170.7 |
| mobile / EN-hakemisto | 87 → 97 | 3868 → 2493 | 23.5 → 21.5 | 1480.5 → 665.9 |
| mobile / SV-makaronilaatikko | 97 → 99 | 2554 → 2104 | 37.0 → 11.0 | 201.1 → 92.0 |
| mobile / TH-makaronilaatikko | 96 → 99 | 2582 → 1997 | 24.0 → 12.0 | 201.1 → 92.0 |
| desktop / FI-hakemisto | 95 → 100 | 1474 → 790 | 0.0 → 0.0 | 4987.3 → 805.6 |
| desktop / FI-lohipata | 100 → 100 | 644 → 546 | 0.0 → 0.0 | 343.3 → 170.7 |
| desktop / EN-hakemisto | 96 → 100 | 1431 → 751 | 0.0 → 0.0 | 4987.3 → 805.6 |
| desktop / SV-makaronilaatikko | 100 → 100 | 526 → 444 | 0.0 → 0.0 | 201.1 → 92.0 |
| desktop / TH-makaronilaatikko | 100 → 100 | 547 → 455 | 0.0 → 0.0 | 201.1 → 92.0 |

Koko ensilataus ja pyyntömäärät:

| Profiili / sivu | Kaikki tavut kB | Pyyntöjä |
| --- | ---: | ---: |
| mobile / FI-hakemisto | 1700.8 → 837.3 | 11 → 11 |
| mobile / FI-lohipata | 465.3 → 292.8 | 5 → 5 |
| mobile / EN-hakemisto | 1633.4 → 828.0 | 11 → 11 |
| mobile / SV-makaronilaatikko | 323.3 → 214.5 | 5 → 5 |
| mobile / TH-makaronilaatikko | 323.8 → 215.0 | 5 → 5 |
| desktop / FI-hakemisto | 5141.1 → 969.0 | 28 → 28 |
| desktop / FI-lohipata | 465.3 → 292.8 | 5 → 5 |
| desktop / EN-hakemisto | 5140.2 → 967.7 | 28 → 28 |
| desktop / SV-makaronilaatikko | 323.3 → 214.5 | 5 → 5 |
| desktop / TH-makaronilaatikko | 323.8 → 215.0 | 5 → 5 |

Suomenkielisen hakemiston kuvasiirto pieneni mobiilissa 56,4 % ja desktopissa
83,8 %. Englannin vastaavat luvut ovat 55,0 % ja 83,8 %. Lohipadan kuvasiirto
pieneni 50,3 %, makaronilaatikon 54,2 %. Suomen hakemiston mobiili-LCP
parani 4,38 sekunnista 2,43 sekuntiin ja desktop-LCP 1,47 sekunnista 0,79 sekuntiin.

Viten client-JavaScript: 363,77 → 363,97 kB raakana,
116,41 → 116,46 kB gzip (+0,05 kB). CSS pysyi 9,37 kB / 2,63 kB gzip.
Reseptikirjastoa tai Sharpia ei lisätty client-bundleen.
Hakemiston HTML ja upotettu data kasvavat responsiivisten URLien vuoksi;
kuvien säästö ylittää tämän kasvun selvästi. Pyyntömäärä ei lisääntynyt.

Raakadata: [ennen](2026-10-22-v1-5-data/lighthouse-before.json),
[jälkeen](2026-10-22-v1-5-data/lighthouse-after.json),
[60 ajon CSV](2026-10-22-v1-5-data/lighthouse-runs.csv),
[mediaanit](2026-10-22-v1-5-data/medians.json).
JSON sisältää myös verkkopyynnöt, simulaatioasetukset ja selainympäristön.
Täydet Lighthouse LHR:t ovat paikallisessa ohitetussa `tmp/v15/`-kansiossa.

## Selaimen kuvavalinta

54 tuoretta kontekstia vaihetta kohti: leveydet 320, 375, 390, 768, 1024 ja
1440, DPR 1/2/3; FI-hakemisto, FI-lohipata ja EN-hakemisto. Nelikielinen
navigointi ja muut käyttötoiminnot tarkistettiin lisäksi nykyisillä selaintesteillä.

| Näkymä | Leveys / DPR | Kuvan CSS-leveys | Valittu pikselileveys |
| --- | --- | ---: | ---: |
| Kortti | 390 / 1 | 335,2 | 480 |
| Kortti | 390 / 2 | 335,2 | 960 |
| Kortti | 1440 / 1 | 353,2 | 480 |
| Kortti | 1440 / 2 | 353,2 | 960 |
| Lohipadan hero | 390 / 1 | 358 | 480 |
| Lohipadan hero | 390 / 2 | 358 | 960 |
| Lohipadan hero | 1440 / 1 | 820 | 960 |
| Lohipadan hero | 1440 / 2 | 820 | 1254, alkuperäinen |

`sizes` vastasi mitattua CSS-leveyttä alle pikselin erolla. Jokainen ensimmäinen
kuva ladattiin vain yhdestä srcset-vaihtoehdosta, ilman fallback/preload-tuplaa.
Ei tuotannon kuvahakuja, 404:iä, hydraatiovirheitä tai vaakavieritystä.
`naturalWidth` on selaimen tiheyskorjattu arvo; CSV:n selectedPixelWidth on
srcset-deskriptorin todellinen tiedostoleveys.

[Valintojen CSV](2026-10-22-v1-5-data/browser-selections.csv),
[selaindata ennen](2026-10-22-v1-5-data/browser-before.json) ja
[selaindata jälkeen](2026-10-22-v1-5-data/browser-after.json).
390/DPR2- ja 1440/DPR1-kuvakaappaukset tarkistettiin myös silmämääräisesti.
Kuvat säilyivät terävinä, nykyinen CSS-rajaus ja asettelu ennallaan.

## Skaalautuvuus

Mittaus käytti eristettyjä lähde- ja sivustokopioita neljällä kielellä.
Lähteiden pikselit säilyivät, mutta jokaiselle lisättiin yksilöllinen kelvollinen
RIFF-lohko: näin 250/500 lähdettä ei typistynyt deduplikoinnissa 119:ään.
Alla lopullisen korjauksen uudet ajot, yksi kylmä ja yksi uusinta kutakin kokoa
ja rinnakkaisuutta kohti. Ajat ovat tämän koneen suuntaa antavia havaintoja.
Huippumuisti tarkoittaa kuvaputkiprosessin maxRSS:ää, ei koko npm-prosessipuuta.

| Lähteet / versiot | Variantit / MB | Kuvaputki 2 työntekijällä, kylmä / uusinta s | Build kylmä / uusinta s | Kuvaputken huippumuisti MiB |
| --- | --- | ---: | ---: | ---: |
| 119 / 476 | 239 / 15.79 | 13.00 / 0.71 | 25.49 / 16.04 | 110.1 |
| 250 / 1000 | 502 / 33.19 | 20.21 / 1.46 | 42.55 / 25.22 | 109.1 |
| 500 / 2000 | 1004 / 66.32 | 41.81 / 3.16 | 85.27 / 42.24 | 113.6 |

Rinnakkaisuuden vaikutus kylmään kuvaputkeen:

| Lähteitä | 1 työntekijä s | 2 työntekijää s | 4 työntekijää s |
| ---: | ---: | ---: | ---: |
| 119 | 23.71 | 13.00 | 6.14 |
| 250 | 46.20 | 20.21 | 10.81 |
| 500 | 89.16 | 41.81 | 20.66 |

Muuttumattomien varianttien uudelleenkäyttö on tämän perusteella hyödyllinen.
Erillistä cache-palvelua ei lisätty. Koko build tekee edelleen Markdownin
luvut, validoinnin, TypeScript/Vite-vaiheet ja staattisen renderöinnin.
500 lähdettä tuotti onnistuneesti 2 000 reseptiversiota ja 2 004 reittiä.
Simulaation client-JS kasvoi 437,70 kB:uun / 140,21 kB gzip, koska nykyinen
reittimanifesti sisältää kaikkien reittien osoitteet. Tämä on säilytetyn
arkkitehtuurin mittaustulos; julkaistun 119 lähteen bundle pysyi 116,46 kB gzip.

[Skaalautuvuuden raakadata](2026-10-22-v1-5-data/scaling.json).
Myös kolmella eri rinnakkaisuudella kylmästi generoitujen manifestien ja kaikkien
varianttien SHA-256:t verrattiin jokaisella aineistokoolla: identtiset.
[Determinismivarmennus](2026-10-22-v1-5-data/scaling-determinism.json).
Alkuperäinen keskeytynyt 500-koe ja sen TS2590-loki säilyvät paikallisessa
`tmp/v15/scaling.log`-tiedostossa; niitä ei esitetä onnistuneena mittauksena.

## Testit ja katselmointi

Paikalliset lopullisen toteutuksen tarkistukset Windows x64 / Node 22.23.4
-ympäristössä. Sama sovellus tarkistettiin myös Node 24.14.1:llä:

- `npm ci`: PASS.
- `npm test`: 26/26 PASS.
- `npm run test:translations`: 14/14 PASS.
- `npm run test:image`: 7/7 PASS; ei ohitettuja testejä.
- `npm run build`: PASS, 476 julkaistua versiota / 480 reittiä.
- `npm run test:static`: 10/10 PASS; kaikkien reittien kuva- ja SEO-metatiedot.
- `npm run test:browser`: 4/4 PASS, sisältäen 54 responsive-kuvakontekstia.
- `npm audit --audit-level=low`: 0 haavoittuvuutta.
- Markdown-lint ja `git diff --check`: PASS.

Kuvaregressiot kattavat mittasuhteen, suurennuskiellon, deduplikoinnin,
deterministiset nimet, korruptoituneen cachen, alkuperäiset SHA:t, julkaisemattoman
kuvan poissulun, virheellisen ja puuttuvan lähteen, traversal- ja junction-ulospääsyt,
staging-virheen jälkeisen aiemman tulosteen säilymisen ja poistuneet variantit.
Viimeisen staging→output-renamen virhe pakotettiin erikseen, ja testi
varmisti vanhan kuvatulosteen sekä manifestin palautumisen. Neljä kieltä, haku/suodattimet, näppäimistö,
annoslaskuri, selainhistoria, JavaScriptitön sisältö ja 404/noindex säilyvät.

[PR #39](https://github.com/ozirix-dev/Reseptit/pull/39) on avoin main-haaraan.
Toteutuksen ja testien tarkistettu commit on
`4a668a156e60f2408d7a20b9e341e65f34acbf50`.
[CI 39785677284](https://github.com/ozirix-dev/Reseptit/actions/runs/39785677284)
valmistui onnistuneesti Ubuntu 24.04 / Node 22 -ympäristössä. Asennus,
26 yksikkötestiä, 14 käännöstestiä, 7 kuvatestiä, build, 10 staattista testiä
ja 4 selainkokonaisuutta läpäisivät. Deploy oli `skipped`, kuten PR-ajossa kuuluu.
CI:n build-job kesti 8 min 54 s, josta Playwrightin asennus vei 7 min 4 s.
Varsinainen `npm run build` kesti 8 s; kuvat olivat siinä vaiheessa jo
aiempien testivaiheiden lämmittämässä paikallisessa cachessa.

[Koodin Codex-katselmointi](https://github.com/ozirix-dev/Reseptit/pull/39#issuecomment-6341747147)
valmistui samalle commitille ilman havaintoja. Avoimia review-keskusteluja ei ollut.
Tämän jälkeen viimeistellään vain raportti ja rinnakkaisuusvertailun evidenssi.
Viimeisimmän dokumentointicommitin täsmällinen SHA, CI-ajo ja katselmointitila
kirjataan PR-kuvaukseen työn luovutuksessa; näin raportin oman commitin SHA:ta
sisältävä dokumentointikierre ei synnytä loputtomasti uusia committeja.

Julkaisusuositus: yhdistämisvalmis, kun myös viimeisimmän PR-pään CI on vihreä
ja Codex-katselmointi valmis ilman avoimia havaintoja. Keskeneräinen katselmointi
raportoidaan lopputilana **REVIEW PENDING**. PR:ää ei yhdistetä tässä tehtävässä.

## Kompromissit ja jatko

- Julkaisuarkistoon tulee 15,8 MB lisäkuvia; alkuperäiset ja variantit ovat
  yhteensä noin 40,9 MB ennen manifestia. Kylmä build tarvitsee kuvankäsittelyä.
- Suuren DPR:n hero voi tarvita alkuperäisen kuvan. Säästöä ei luvata joka
  laitteelle eikä lähteen erottelukykyä kasvateta keinotekoisesti.
- Kaksi työntekijää on varovainen CI-oletus. Neljä oli paikallisesti nopeampi,
  mutta vaati enemmän muistia; CI:n CPU- ja muistirajat poikkeavat tästä koneesta.
- Varsinaista kenttädataa, INP:tä tai tuotantojulkaisua ei sisälly tähän työhön.
- Käyttöliittymän leveysmuutoksissa päivitetään yhteiset `sizes`-vakiot ja testit.

ReportHub-arvio: tuoterepon tämä mittausraportti, raakadata, ylläpito-ohje ja
rajattu PR säilyttävät olennaisen teknisen kontekstin. Erillinen ReportHub-raportti
kopioisi tämän auditoinnin; uutta V1.4-handoffia tai rinnakkaista PR-seurantaa ei
luotu. ReportHubin PR #12:ta tai auto-syncia ei muutettu.

PR:n yhdistäminen ja tuotantoon julkaisu jäävät erikseen päätettäviksi.

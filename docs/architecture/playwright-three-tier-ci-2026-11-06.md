# Recipavo: kolmitasoinen Playwright-laadunvarmistus (2026-11-06)

> Toteutus- ja Codex-handoff. Ei oikeuta automaattiseen mergeen tai julkaisuun.

## Nykytila ennen muutosta

- `site/package.json` sisältää jo Playwrightin; selaintestit käyttävät `tsx --test`-ajoa, eivät Playwright Test -testirunneria. Uutta riippuvuutta ei tarvita.
- `site/scripts/select-ci-checks.mjs` valitsee sisältö-, ravinto-, GI/GK-, käännös-, kuva-, staattiset ja selaintarkistukset muutoskohteiden mukaan.
- `site/tests/browser-smoke.test.ts` tuo mukaan `content-layout.browser.test.ts`-testin. `route-loading.browser.test.ts` ja `responsive-images.browser.test.ts` ovat erillisiä.
- `responsive-images.browser.test.ts` käy läpi 6 leveyttä × 3 DPR-arvoa × 3 reittiä = 54 yhdistelmää sekä JavaScriptittömän reitin.
- `.github/workflows/recipavo-preview.yml` suorittaa erillisen, julkaisemattoman hero-esikatselun. Sitä ei saa korvata tällä PR:llä.
- `docs/research/**`, tuntemattomat ravintotietojen paketit, tuntemattomat työkalut ja muutosten luokittelun epäonnistuminen ovat nykyisin turvallisuussyistä koko testipaketin aiheuttavia. Älä kevennä näitä sokkona.

## Kolme laaria

| Taso | Milloin | Sisältö | Lähtökohtainen portti |
| --- | --- | --- | --- |
| 1. Perusturva | Kaikissa PR:issä | Git whitespace + selectorin omat testit; muutokseen osuvat kevyet yksikkö-/sisältötarkistukset; UI-PR:ssä uusi lyhyt Playwright-smoke | Estävä |
| 2. Kohdennettu | Muutettujen tiedostojen riskien perusteella | Käännökset, ravinto, GK, rakenne/SEO, selaimen toiminnallisuus, reititys tai kuvat tarpeen mukaan | Estävä |
| 3. Laaja | Viikoittainen erillinen ajo, manuaalinen julkaisutarkastus ja tuntematon/kriittinen muutos nykyisen fail-closed-säännön mukaisesti | Nykyiset pitkät selain-, reitti- ja kuvasarjat; muu koko CI vain silloin, kun päätyönkulun luokittelija sitä edellyttää | Erillisajossa raportoiva, pää-PR:n pakotetussa full fallbackissa estävä |

**Taso ei ole sama asia kuin testin vakavuus.** Ravitsemus- ja GK-testit pysyvät PR:ssä estävinä, vaikka selaintestit valitaan kevyemmin. GI:n puutetta tai epävarmaa GK:ta ei saa kuitata vihreäksi vain siksi, että käyttöliittymä toimii.

## Ehdotettu muutosmatriisi

| Muutos | Suoritettava työ | Ei tarpeetonta |
| --- | --- | --- |
| Tavanomainen `docs/**` -kirjoitus tai katselmointi | whitespace + selector-testi | ei Node-asennusta eikä selainta |
| `docs/research/**` tai tuntematon ravintosyöte | ennestään voimassa oleva full fallback | ei turvallisuussääntöjen höllennystä |
| Julkaistun reseptin `reseptit/**.md` | muutetun sisällön validointi + nutrition + GI/GK + build/static | ei Playwrightia |
| Käännös `kaannokset/**.md` | sisältö + käännöskatselmointi | ei Playwrightia |
| `docs/nutrition/**`, laskenta tai lähdekoodi | nykyinen erityisluokittelu ja malliregressiot | ei ulkoisen selainkäytön pakkoa |
| `kuvat/**` | kuvaputki ja optimointitestit | ei koko 54 yhdistelmän selaintestiä jokaisesta uudesta kuvasta |
| Tavallinen React-komponentti tai CSS | rakennus + static + lyhyt browser smoke | ei kuva- ja reittimaratoonia |
| Hakutoiminnot, reseptisivu tai suodatin-UI | smoke + nykyinen toiminnallinen browser smoke | ei image-matriisia automaattisesti |
| Reittien lataus, Router tai SEO | smoke + tarvittavat reitti- ja laajat selainregressiot | ei kuvamatriisia automaattisesti |
| Kuvan mitoituskoodi | smoke + responsive-images-sarja | ei saman sarjan ajoa muusta sisällöstä |
| Uusi selainkoe | oman ryhmän testit; tuntematon ryhmä → full fallback | ei hiljaista testin ohitusta |
| `site/package.json`, lockfile, CI-päätöksenteko tai tuntematon tuotantokoodi | nykyinen fail-closed full fallback | ei oikoteitä |
| `workflow_dispatch` täysi sarja tai viikkotarkistus | kaikki selaintestiryhmät | ei tuotantodeployta viikkotarkistuksessa |

Useat muutokset yhdistyvät ryhmien **unionina**: koskaan ei valita vain ensimmäistä osuvaa luokkaa. Polun poistaminen, uudelleennimeäminen ja monen lähteen yhteisvaikutus on tarkistettava erikseen. Tuntematon tiedosto ei saa tarkoittaa 'ei testejä'.

## Toteutettavat selainryhmät

- `smoke`: `ci-essential.browser.test.ts`; neljä kielihakemistoa, yksi reseptin avaaminen, yksi hakutoiminto, blogin peruslataus, JavaScriptitön navigointi ja pageerror-havainnointi. Ei kiinteitä reseptimääriä.
- `ui`: jo olemassa oleva `browser-smoke.test.ts` (sisältää `content-layout.browser.test.ts`) sekä `navigation.browser.test.ts` (mainin #328:n navigaatio- ja vieritysregressio). Näppäimistö, suodattimet, annosskaalaus, GK-näkymä, responsiiviset ruudukot ja SEO.
- `routes`: jo olemassa oleva `route-loading.browser.test.ts`; hydration, kielivaihdot, virhetilanteet ja reittien pyyntömäärät.
- `images`: jo olemassa oleva `responsive-images.browser.test.ts`; 54 kombinaatiota, DPR ja JS-vapaa kuvien lataus.

Huom: `smoke`, `ui`, `routes` ja `images` ovat **selaintestin alaryhmiä**, eivät neljäs yleinen CI-taso. Erillinen `recipavo-preview.yml` säilyy; uudessa PR:ssä ei pidä käynnistää esikatselun erikoistestiä normaalin tuotantobuildin asetuksilla.

## CI-turvarajat

1. Tuntematon tai virheellinen polkuluokitus -> täysi sarja (fail-closed).
2. Luokittelijan omat testit -> jokaisen pää-PR-työnkulun alkuun kuten ennenkin.
3. PR-ajot eivät julkaise Pagesiin. Vain nykyinen main-julkaisupolku saa deployn, eikä ajastettu selainajo koskaan julkaise.
4. Browser-runner käyttää eksplisiittistä allowlistiä; ei tulkitse tapahtumasta tai PR:stä tulevaa merkkijonoa komentona.
5. Kaikki testit käyttävät paikallisesti rakennettua `site/dist`-versiota; ei satunnaista live-tuotantoa eikä kilpailua toisten PR:ien kanssa.
6. Run time -mittari: kirjaa jokaisesta tasosta kesto, epäonnistumiset ja väärät triggerit, ja optimoi vasta toteutuneen datan perusteella. Alustavat tavoitteet: smoke ~1 min, kohdennettu ~5 min, laaja ~20 min (eivät lupauksia).
7. Ajastetun laajan ajon virhe näkyy GitHubissa; se ei yksin estä seuraavaa julkaisua, ellei tarkistus lisätä eksplisiittisesti julkaisuportiksi.
8. Älä muuta `site/package.json`-tiedostoa tässä PR:ssä: avoimet #319, #322 ja #324 muuttavat sitä. Myös #321 ja #313 muuttavat testejä, joten pidä kirjoitusalue rajattuna.

## Codexin jatkotyöt / katselmointi

- Tarkista valitsinympäristön testit: docs-only, resepti, käännös, GK, kuvat, CSS, haku-UI, Router, yhdistetyt polut, tuntematon TS ja epäkelpo syöte.
- Varmista, että uusia `site/src/**/*.ts`-polkuja ei käsitellä liian kevyesti ilman vastaavia yksikkö-/selaintestejä. Erityisesti #322:n sivutusydin ja #324:n avustajakatalogi saavat omat testinsä vasta, kun ominaisuudet ovat mainissa.
- Varmista ilman verkkopalveluja: `node site/scripts/select-ci-checks.test.mjs` ja `node --test site/scripts/run-browser-suites.test.mjs`; sitten `npm ci && npm run build` ja uuden smoke- sekä laajan ajon testit.
- Kirjaa tarkat HEAD SHA:t, CI-tulokset ja mahdolliset hidastukset ennen Ready-vaihetta; jos toiminnallinen regressio löytyy, korjaa saman PR:n rajauksessa.
- Pidä avoimista PR:istä erillinen kirjoittaja/worktree. Ei mergeä, deployta eikä toisen omistaman haaran muutoksia ilman erillistä päätöstä.

## Seuraavat testiaihiot (ei tässä vaiheessa turhaa massalisäystä)

Kun ominaisuudet on julkaistu ja DOM-sopimus vakiintunut: H2-kirjaston sivutus + URL-palautus; Välipalat-suodatin; reseptiehdotuksen hyväksyntäpolku; Keittiöapurin lähdesidokset ja injection/fail-safe-käyttäytyminen; Cloudflare-siirron reititys ja uudelleenohjaukset; peruskäytettävyyden automaattinen tarkistus ja näppäimistöpolut. Kullekin oma vastuullinen testiryhmä ja todellinen muutos-triggeri. Uusia koko sivuston matriiseja ei lisätä vain lisäämisen vuoksi.

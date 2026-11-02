# Keto-mutakakku: FI-sivun sanallinen suklaavertailu

## Työrajaus

- Kirjoittaja ja PR-vastuullinen: Codex 3 / FI Chocolate Disclosure, vain tämä työerä.
- Repo: `ozirix-dev/Reseptit`, origin `https://github.com/ozirix-dev/Reseptit.git`.
- Worktree: `D:/Projects/tmp/reseptit-chocolate-disclosure-fi`.
- Haara: `codex/keto-mutakakku-chocolate-disclosure-fi`.
- Lähtö-main: `554f8a414782497da89640c8e45be1ccf1580a95` (#186 yhdistetty).
- Valtuus: FI-sivun numeroton vertailu kahdella Torras-tuotteella ja oma Draft-PR. Ei Readyä, mergeä tai deployta. Avoimissa PR:issä tai paikallisissa haaroissa ei ollut päällekkäistä toteutusta.
- `repo_guard check/write/commit/push/pr` -operaatiot sitovat muutokset tähän repoon ja omaan haaraan. Muiden worktreeihin tai PR:iin ei kirjoiteta.

## Toteutus

`ChocolateComparisonFi` lisää vain `keto-mutakakku` + `fi` -yhdistelmälle aluksi suljetun natiivin `details`-kohdan **Miten käyttämäsi suklaa vaikuttaa GK-arvioon?** Nykyinen GK-only-paneeli säilyy sitä edeltävänä erillisenä esityksenä. Vertailu käyttää sivuston nykyistä paneelityyliä ja vie oman rivinsä; näppäimistöfokus käyttää olemassa olevaa tyyliä.

Molemmat tuotteet näkyvät yhtä aikaa: Torras Dark chocolate (maltitoli) ja Torras Chocolate Negro 60% Stevia (erytritoli + stevioliglykosidit). Näytössä on makeutus, muiden hiilihydraattien olemassaolo, valmistajalähteet ja tarkistuspäivä. Maltitolituotteen lähteen tunnistusristiriita jää näkyviin. Tuotesivut tarkistettiin uudelleen 2.11.2026; faktat vastaavat #186:n lähdepakettia. Pienet kuratoidut lähdesidonnat testataan sen source-hasheja vasten.

Vertailu ei sisällä uusia GK-lukuja, polyolikertoimia, laskennallisia osasummia tai hiilihydraattimääriä. Tuotenimessä oleva kaakaoprosentti ja lähteen tarkistuspäivä säilyvät tunnistetietoina. Koko kakun GK ja tuotteiden GK-ero jäävät määrittämättä. Erikseen lisättävä erytritoli erotetaan suklaan makeutuksesta sanallisesti. Wawel, AFCD-kooste ja tutkimuslaskuri eivät tule julkiseen komponenttiin.

Alkuperäinen resepti, ainesosat ja annokset eivät muutu. Hyväksytty laskettu osuus **0,07**, pois jätetty CHO **1,3774 g/annos**, input-hash `b373e5621c6c939eaec2af8c9c11cd687f0a4b0f179159b5d143d2d4141e6af3`, nykyinen GK-only-esitys sekä kaikkien neljän makron pidätys säilyvät. GK80-kattavuusmuutos on nolla. Rakenteiseen ravintotietoon, suodattimiin, hakemistokortteihin tai muihin kieliin ei tule kytkentää.

## Varmennus

- `npx tsx --test tests/chocolate-comparison.test.ts`: **4/4 PASS**. Tuotekohtaiset lähdehashit, FI/reseptirajaus, suljettu server-HTML, numerottomuus ja alkuperäisen laskentaversion/makrojen säilyminen.
- Komponentin ja kohdennetun testin TypeScript-tarkistus: **PASS**, käyttäen projektin tiukkoja asetuksia erillisellä scratch-konfiguraatiolla. Koko projektin generoituvia moduuleja ei rakennettu tämän tarkistuksen vuoksi.
- Brave / Playwright CLI: **PASS**, natiivi avaus Enterillä ja sulkeminen välilyönnillä, kaksi valmistajalinkkiä, ei skenaariolukuja, annosskaalaus 8→16 ja 1280/768/375/320 px ilman sivuttaisylitystä. GK-paneelin ja makropaneelin HTML pysyi samana vertailua avatessa. Annosskaalaus säilytti nykyisen annoskohtaisen GK-esityksen ja vertailun sisällön. EN/SV/TH-rajaukset tarkistettiin.
- Selaintarkistus käytti oikeaa `RecipePage`-komponenttia yhden reseptin paikallisessa esikatselussa, lähde-Markdownista luettua reseptiä ja nykyisen hyväksytyn GK-only-version tietoja. Tämä ei ole koko sivuston prerender/build-varmennus. Kuva: `D:/Temp/chocolate-disclosure-fi/comparison-fi.png`.
- Git-vertailu lähtöcommittiin varmisti alkuperäisen reseptin, hyväksyttyjen cases/golden/owner-approval-tiedostojen, `GkOnlyVariantPanel.tsx`:n ja `schema.ts`:n muuttumattomuuden. Whitespace-tarkistus PASS.

Paikallista koko sivuston buildia tai 326 reseptin massalaskentaa ei ajettu. Normaali PR-CI raportoidaan erikseen lopulliselle HEADille. PR jää Draftiksi; mitään ei yhdistetä tai julkaista tässä työssä.

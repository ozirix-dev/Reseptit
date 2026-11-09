# Käännöserä 20 – tarkka FI → EN/SV/TH, 9.11.2026

**Kohde:** 20 julkaistua suomenkielistä reseptiä, 60 puuttuvaa kieliversiota.
**Lähtöcommit:** `ade461048ea138cd4f6a34340e8a53df79532bd7` (main).
**Työhaara:** `feat/i18n-batch20-verified-20261109`.
**Julkaisutila:** Draft / STOP, kunnes kaikki vaaditut tarkistukset ovat todistetusti PASS.

## Rajaus (20 reseptiä)

1. `reseptit/paaruoat/chili-con-carne-kukkakaaliriisi.md`
2. `reseptit/paaruoat/harira.md`
3. `reseptit/paaruoat/kana-enchilada-kukkakaalivuoka.md`
4. `reseptit/paaruoat/kana-fajita-pelti.md`
5. `reseptit/paaruoat/kanakeitto-pinaatti-sitruuna.md`
6. `reseptit/paaruoat/kanapyorykat-tomaattikastike.md`
7. `reseptit/paaruoat/kreikkalainen-kanavuoka-oliiveilla.md`
8. `reseptit/paaruoat/lanttulaatikko-kermainen.md`
9. `reseptit/paaruoat/lindstrominpihvit-kaalilla.md`
10. `reseptit/paaruoat/maksalaatikko-kukkakaalilla.md`
11. `reseptit/paaruoat/shoyu-kanakeitto-konjac.md`
12. `reseptit/paaruoat/silakkapihvit-tilli-kermakastike.md`
13. `reseptit/paaruoat/uunikanapasta-kesakurpitsa.md`
14. `reseptit/jalkiruoat/vhh-brita-kakku.md`
15. `reseptit/paaruoat/bulgogi.md`
16. `reseptit/paaruoat/bun-cha-hanoi.md`
17. `reseptit/paaruoat/carnitas-salaattitacot.md`
18. `reseptit/paaruoat/falafel.md`
19. `reseptit/paaruoat/kimchi-jjigae.md`
20. `reseptit/paaruoat/jerk-kana.md`

Jokaiselle tulee `kaannokset/{en,sv,th}/<sama kategoria>/<recipe_id>.md`.
Suomenkielistä alkuperäistä ohjetta, annoksia, raaka-aineiden määriä, numeroarvoja,
GK/GI-laskentaa, elintarvikelähteitä ja ruokalajin merkitystä ei saa muuttaa
käännöstyön varjolla. Mahdollinen lähtötekstin ongelma kirjataan HOLDiin
sen sijaan, että virheellinen tieto käännettäisiin hyväksyttäväksi.

## Laatuportti ilman ihmiskielentarkistusta

1. **Lähteen kelpoisuus:** hyväksy vain `status: published`, oikea reseptisisältö
   ja 0 ristiriitaista tai luetteloimatonta olennaista ainesosaa. Vanhat
   pelkät otsikkoraakileet (`# otsikko`) ja keskeneräiset FI-reseptit eivät
   kuulu julkaisukäännöserään.
2. **Kolmen kielen rivi-riviltä vertailu:** oikea eläin-/kasvilaji, aines,
   määrä, yksikkö, valmistustapa, marinointi, lämpötila, kypsyys,
   järjestys, aika, allergeenit, kieltomuodot, säilytys ja lisukkeet.
3. **Takaisinkäännös:** etenkin TH-ohjeen jokainen valmistusvaihe ja
   epäselvä ainesosatermi takaisinkäännetään FI:ksi; havaittu
   ristiriita korjataan ja vertailu uusitaan.
4. **Rakenteet & reitit:** säilytä `recipe_id`, `url_slug`,
   `source_recipe`, `translation_of`, `servings`, `time_total_min`,
   kuvan tiedostonimi/mitat, ravintoarvot, myös `null`.
5. **Todennettava AI-merkitysvertailu:** kirjaa ajantasaiset SHA-256
   merkitystiivisteet `meta/kaannokset/codex-review-evidence.json`-rekisteriin
   vasta **todella tehdyn** vertailun jälkeen. `human-review-evidence.json`
   pysyy koskemattomana; ihmistarkistusta ei väitetä tehdyksi.
6. **CI pakollinen:** `validate:changed-content`, `test:translations`,
   `translation-audit --strict`, normaali PR-CI / build, reittitestit
   ja GK-lähdekytkentöjen säilyminen. Tarkista CI juuri julkaistavalle HEADille.
7. **Fail closed:** yksikin ratkaisematon P0/P1, lähdevirhe, vanhentunut
   merkitystiiviste tai punainen pakollinen CI pitää PR:n Draftissa.
   Ei auto-mergeä, ei tuotantodeployta.

## Lähtötekstien havainto, erävalintaa edeltävä tarkistus

Osa julkaistuista aamiaisresepteistä sisältää yleisiä, reseptiin kuulumattomia
papu-/tofu-/lämpimän pohjan valmistusvaiheita. Esimerkiksi
`reseptit/aamupalat/lahi-ita-labneh-kulho-zaatarilla.md` kehottaa
lisäämään oliiviöljyä, vaikka sitä ei ole ainesosalistassa.
Niitä **ei** oteta tähän erään ilman alkuperäisen lähteen erillistä korjausta.

## Työtilanne 9.11.2026 – erä A: 20/20 luonnosta

**20 suomenkielistä lähdereseptiä, 60 EN/SV/TH-käännöstä. Kaikki 60 ovat edelleen `status: draft`, eivät tuotannossa.**
Käännöserä on oma [PR #357](https://github.com/ozirix-dev/Reseptit/pull/357), toinen käännöserä omassa [PR #356](https://github.com/ozirix-dev/Reseptit/pull/356) ja FI-lähteen laatutarkistus [PR #358](https://github.com/ozirix-dev/Reseptit/pull/358). Eri PR:t eivät kirjoita toistensa haaroihin.

### Luonnosten toteutus

- Aiemmat 15 FI-lähdettä / 45 EN/SV/TH-käännöstä säilyvät.
- Viisi uutta FI-lähdettä / 15 EN/SV/TH-käännöstä on tehty: `lanttulaatikko-kermainen`, `lindstrominpihvit-kaalilla`, `maksalaatikko-kukkakaalilla`, `vhh-brita-kakku`, `falafel`.
- Suomenkielisiä reseptejä, GK-/GI-lähteitä, annosmääriä, ravintoarvoja tai julkaisutietoja ei muuteta tässä PR:ssä.

### Käännösten erilliset tarkistukset

- **60/60 käännösluonnosta:** lähteen ja käännöksen `servings`, `time_total_min`, `recipe_id`, `url_slug`, `category`, kaikki neljä ravintoarvokenttää puuttuvine arvoineen, ainesosarivien järjestys, numeroarvot, merkitykseltään vastaavat yksiköt, valmistusvaiheiden määrä, kuva ja mitat sekä lähdeviite täsmäävät. Tarkistus tehty GitHubin muuttumattoman `main`-lähteen ja PR-haaran tiedostosisältöjen perusteella, havaittuja rakennepoikkeamia **0**.
- **60/60 käännösluonnosta:** FI-lähteen valmistusohjeiden numeeriset tokenit esiintyvät myös vastaavan käännöksen valmistusohjeessa (monijoukkovertailu normalisoi desimaalipilkun ja -pisteen). **0 puuttuvaa numeerista tokenia.** Tämä ei todista lauseiden eikä kypsennyksen merkityksen täydellistä vastaavuutta.
- **183 paikallista yksikkömuutosta:** kussakin kielessä 24 rkl-, 14 tl- ja 23 kpl-ilmausta lokalisoitu merkitykseltään vastaaviksi. Yhteensä 61 × 3. Mittalukuihin ei koskettu.
- **TH-ainesosanimitäsmennykset:** viisi esiintymää `ต้นหอมญี่ปุ่น` → `ต้นหอม` (FI `kevätsipuli`), neljä `ซีอิ๊วญี่ปุ่น` → `ซีอิ๊ว` (FI tavallinen `soijakastike`).
- Viimeisimmän sisältöcommitin `e3bc2f13ea0e5a2779333d2092d30f08c37da557` [rajattu PR-CI #42651882083](https://github.com/ozirix-dev/Reseptit/actions/runs/42651882083) **PASS**. Tämä CI ei osoita, että `draft`-käännöksillä olisi tehty loppuun asti julkaisun tiukka käännösauditointi tai koko reseptibuild.

### FI-lähde-HOLDit (8, ei julkaisuun ilman korjausta ja uutta merkitysvertailua)

1. `lanttulaatikko-kermainen`: FI-aineksessa `55 g kananmunaa kuoretta`, kuoren kuuluminen syötävään massaan epäselvä. Käännösluonnoksessa epäselvyys kuvattu, ei arvattu.
2. `lindstrominpihvit-kaalilla`: 2 rkl voita käytetään pihveihin ja kaaliin, mutta jako puuttuu. Käännökset eivät lisää rasvaa.
3. `maksalaatikko-kukkakaalilla`: voin käyttö sipulin paistoon ja uunivuoan voiteluun vaatii jako-ohjeen.
4. `vhh-brita-kakku`: kuivien aineiden yhdistäminen voin ja keltuaisten seokseen puuttuu FI-ohjevaiheesta.
5. `falafel`: salaatti ja pitaleipä tarjoillaan, mutta niille ei ole ainesosarivejä; pitoisuus ja ravintoarvolaskennan rajaus on selvitettävä.
6. `kimchi-jjigae` (jo käännetty): riisin kanssa tarjoilu ilman riisin määrää tai laskentarajaa.
7. `jerk-kana` (jo käännetty): FI `time_total_min: 90`, mutta vähintään 60 min marinointi + 45–55 min paisto ylittävät 90 min.
8. `shoyu-kanakeitto-konjac` (jo käännetty): FI:n `cooking_method` on `paistaminen`, vaikka ohjeessa kana keitetään liemessä. Uusi havainto toimitettu PR #358:aan.

Näiden kahdeksan lähteen sisältöongelmia ei korjata kääntämällä, vaan toisessa työssä PR #358:ssa tai siitä syntyvissä erillisissä hyväksytyissä sisältö-PR:issä. Jos FI-lähde muuttuu, sen kaikki kolme käännöstä on verrattava uudelleen. Nykyiset luonnokset ovat keskeneräisiä eivätkä väite hyväksytystä sisällöstä.

### Julkaisuun vielä vaadittavat portit

- Ensin ratkaistaan kahdeksan FI-HOLDia sekä kaikki mahdolliset uudet olennaiset havainnot.
- **12 FI-reseptin 36 EN/SV/TH-luonnoksen** AI-lähdevertailu on tehty ja sidottu tarkistettuun versioon erillisessä tilanneaineistossa. **8 FI-reseptin 24 käännösluonnosta** odottaa lähdesisällön korjausta, jonka jälkeen vaaditaan uusi, kokonainen merkitysvertailu. Rakenne- ja numerosäilyvyystestit eivät korvaa merkitysvertailua.
- Työaineiston kaikki 60 tarkkaa FI/EN/SV/TH-merkitystiivistettä ovat `docs/reviews/translation-batch20-digests-2026-11-09.json`-tiedostossa, mutta **ne eivät yksin ole julkaisukuitteja**. Todistetut, ajantasaiset hyväksyttävät `source_hash`/`translation_hash`-tietueet integroidaan `meta/kaannokset/codex-review-evidence.json`-rekisteriin vasta yhteensovitettuna PR #356:n kanssa. Ei vääriä `pass`-merkintöjä.
- FI-lähteiden `translation_languages` / `translation_status` ja kohdekielten `status: published` asetetaan erillisen hyväksytyn julkaisuvaiheen yhteydessä, ei tämän Draftin perusteella.
- Ennen Ready/mergeä: changed-content, `test:translations`, `translation-audit --strict`, täydellinen build, ravinto-/GK-sinetit ja PR-CI samalla HEADilla.
- `human-review-evidence.json` pysyy koskemattomana. Ihmistarkistusta ei väitetä tehdyksi. Ei auto-mergeä tai tuotantodeployta.

**Tämän vaiheen tulos: 60/60 luonnosta + rajattu rakenteellinen ja numeerinen QA PASS, koko julkaisuportti vielä HOLD.**

## 9.11.2026 – AI:n semantiikkakierros ja CI-suojaus

- Lisätty `site/tests/translation-batch20-drafts.test.ts` osaksi olemassa olevaa käännösten kohdennettua testiajoa. **60/60 luonnosta mukana** (myös julkaisemattomat), jotta vanha vain julkaistuja pareja lukeva auditointi ei anna virheellistä vihreää tulosta keskeneräiselle erälle.
- Testi lukee 20 FI-lähdettä ja 60 luonnosta, tarkistaa skeeman, lähdeviitteet, ainesosarivit ja niiden määrät/yksiköt, merkitsevien valmistusnumeroiden säilymisen, tunnetut sanavirheet ja tarkat semanttiset SHA-256-tiivisteet.
- SHA-lukko sidottu `docs/reviews/translation-batch20-digests-2026-11-09.json`-aineistoon. **12 reseptiä / 36 paria** vertailtu AI:lla lähteen merkitystä vastaan; **8 reseptiä / 24 paria** `source-hold`. `publish_authorized: false` kaikissa.
- Korjattu thai-bulgogin siementen perusteeton valkoisuus, fajitapellin punasipulin nimitys ja kanakeiton sitruunankuoren kieltomuoto EN/TH. Brita-kakun EN/SV-kuvaus kertoo kerman vatkaamisesta eikä väitä nestemäistä kermaa valmiiksi vaahdotetuksi.
- Käännöstarkistimen ensimmäinen CI-ajokerta löysi Brita-kakun valmistusvaiheen tekstistä `whipped cream` -sanaparin (loppuvaiheessa oikea asia, mutta vanha sääntö erehtyi). Täsmennetty kuvaus korjasi väärän hälytyksen muuttamatta reseptiä. [Koko PR-CI PASS 42657483743](https://github.com/ozirix-dev/Reseptit/actions/runs/42657483743).
- Tarkistusledgerin lisäämisen jälkeen [CI PASS 42658544505](https://github.com/ozirix-dev/Reseptit/actions/runs/42658544505) SHA:lla `e727decd730b0d945bdcba7b30d676c8ff96c355`.
- FI-lähteet, GK- ja ravintodokumentit, yhteinen semanttinen rekisteri sekä PR #356/#358/#359 jäivät muokkaamatta.

**Julkaisutila ei muutu:** 60 luonnosta, 0 julkaistua tässä erässä, 8 lähde-HOLDia ja yhteisen todisterekisterin integraatio ennen Readyä.

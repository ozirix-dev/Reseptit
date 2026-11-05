# GK100 Original Recipe Priority V2

## Toteutus ja lähtötilanne

Tämä on omistajan 5.11.2026 pyytämä laajuuden, mittarien ja esitystavan korjaus.
Alkuperäisiä reseptejä, numeerisia GK-arvoja tai tieteellisiä lähdesidoksia ei
muuteta. 156 alkuperäissidosta ei ole uusi tieteellinen hyväksyntä.

Toteutushaara alkaa nyky-mainista
`121fab51877bb80311be5b11bbfe9861ab503c7a`. PR #286:n dokumentointi ja auditointi
säilyvät omana työnään; sen haaraan ei kirjoitettu. Työn aikana #286 yhdistettiin
mainiin muiden toimesta commitilla `303679f4`. Main tarkistettiin uudelleen
commitissa `721e22716c312afb4f1634240012fac7a69570c0`: lisäykset lähtö-mainiin
olivat dokumentteja ja inventaarioita, eivät laskentakoodia tai reseptisyötteitä.
PR #285 säilyi avoimena ja sen työpuu koskemattomana. Myöskään rescue-ajon
jonoon tai muiden istuntojen haaroihin ei kirjoitettu.

Omistajan periaate ja alkuperäinen auditointi:
[PR #286](https://github.com/ozirix-dev/Reseptit/pull/286).
[Menetelmäsääntö mainiin yhdistetyssä versiossa](https://github.com/ozirix-dev/Reseptit/blob/303679f4/docs/nutrition/gk-original-recipe-method.md).

## Kattavuuden sopimus

| Käsite | Toteutettu tulos | Käyttö |
| --- | ---: | --- |
| ORIGINAL_COVERAGE | 156/326 (47,9 %) | Ensisijainen, nykyiseen alkuperäiseen reseptiin sidottu numeerinen arvio |
| VARIANT_COVERAGE | 79 | Erillisversion kautta katetut muut reseptitunnukset |
| STUDY_SERVINGS | 8 | Erilliset tutkimusvertailut, ei kotireseptin kattavuuslisäystä |
| Kotireseptien versiokattavuus | 235/326 (72,1 %) | Alkuperäinen arvio tai erillinen reseptiversio; toissijainen |
| LEGACY_COVERAGE | 236/326 | Vain sisäinen historiallinen yhteensopivuustieto |
| Alkuperäisten 80 %:n tavoite | 261/326 | Tavoitteeseen puuttuu 105 alkuperäisreseptin arviota |

`countGkVersions` palauttaa erikseen `originalRecipeIds`, `variantRecipeIds` ja
`studyServingRecipeIds` sekä niitä vastaavat määrät. `numericRecipeIds` on
korjattu alkuperäisten ja erillisversioiden yhdiste, 235 tunnusta. Sen vanha
236-tulkinta on `legacyNumericRecipes`-kentässä eikä siitä tehdä julkista
alkuperäiskattavuuden mittaria. A/B/C ovat edelleen menetelmätasoja, eivät
alkuperäisen, variantin tai tutkimuksen laajuuksia. Raportin `coverageViews`
erittelee kaikki laajuudet; alkuperäisten tavoite ja puuttuva määrä tulevat
samasta laskennasta.

### Manakishin säilyttävä esityskorjaus

`gk-estimate-scope.ts` tunnistaa vain auditissa yksilöidyn manakish-version:

- recipeId `lahi-ita-manakish-zaatarilla`
- versionId `gk-operation80-review-61b30ec793a7`
- inputSha256 `61b30ec793a7e0c6bad854f5035fca783ad914b9b828f58c7c56f9354ba8bcda`

Yhteinen laajuusfunktio luokittelee sen tutkimusvertailuksi sekä laskurissa,
Factoryn uusissa ennusteissa että käyttöliittymässä. Hyväksyttyä JSON-pakettia,
`studyServing`-kenttää, 30,5 GK:n pistettä, valmistusta tai alkuperäistä manifestia
ei kirjoiteta uudelleen. Vanha julkaisulataaja tarkistaa edelleen alkuperäisen
resepti- ja ehdokassidoksen sekä omistajapäätöksen. Muuttunut manakishin
versiotunniste tai syötetarkiste pysäyttää esityskorjauksen uuteen katselmointiin.
Tutkimusannoksen ainesmäärä ja annosluku eivät seuraa alkuperäisohjeen annosvalintaa.

## Käyttöliittymä

Reseptisivun alkuperäisen reseptin osiossa näkyy joko nykyinen hyväksytty arvio,
varmuus ja lähteet tai seuraava viesti:

| Kieli | Puuttuvan arvion ilmoitus |
| --- | --- |
| FI | GK-arviota ei voida laskea luotettavasti. |
| EN | A reliable glycemic load estimate is not available. |
| SV | En tillförlitlig uppskattning av glykemisk belastning är inte tillgänglig. |
| TH | ยังไม่สามารถประมาณค่าภาระน้ำตาลได้อย่างน่าเชื่อถือ |

Puuttumisen todelliset, ennestään julkaistavat GI-/CHO-/määräsyyt näkyvät
lisätiedoissa. Puuttuva pysyy nullina, eikä sillä ole GK-luokkaa. Tavalliset
reseptit säilyvät hakemistossa ja haussa ilman GK-rajausta.

Erillisversion paneeli kertoo heti, ettei arvo ole alkuperäisen reseptin GK.
Sen määrät ja valmistus ovat reseptisivulla avattuina; alkuperäisen määrät ja
valmistus näytetään samassa vertailussa. Näin esimerkiksi farinatan uuniohje
ja GK-version pannulettu ovat käyttäjän verrattavissa ilman pääteltyä väitettä
niiden vastaavuudesta. Hyväksytyn version omia ohjeita tai lähdeviitteitä ei
muokata. Tutkimuksella on oma otsikko ja erillinen laajuusmerkintä.

GK-menetelmäsivun päämittari on alkuperäisten 156/326. Erillisversiot, tutkimukset,
235/326-yhdiste ja alkuperäisten 261/326-tavoite nimetään erikseen. Sivun oma
GK-rajain valitsee vain alkuperäisen arvion; oletus näyttää kaikki reseptit.

Hakemiston GK-suodattimen laskentaa tai rajoja ei muutettu: matala ≤10,
keskitasoinen >10 ja <20, korkea ≥20. Se käyttää edelleen vain alkuperäisen
julkaistua arviota. Variantti, tutkimusannos tai puuttuva arvo ei tuo alkuperäiselle
väärää luokkaa. URL-, haku- ja muut suodattimet toimivat yhdessä kaikilla kielillä.

## Factory, ennusteet ja säilyvät hyväksynnät

`prepareRelease` palauttaa nyt erikseen `expectedOriginalCoverageDelta`,
`expectedVariantCoverageDelta` ja `expectedStudyServingDelta`. Nykyinen GK-only-reitti
ei tuota alkuperäisreseptin hyväksyttyä arviota, joten sen alkuperäisvaikutus on 0.
`expectedCoverageDelta` on yhteensopiva nimi kotireseptien versiolisäykselle,
ei alkuperäiskattavuuden ennuste. Uusi main-vertailu voi lisäksi sisältää
`originalRecipeIds`- ja `variantRecipeIds`-joukot; niiden on vastattava erillisinä
`numericRecipeIds`-yhdistettä. Tutkimuksilla on oma duplikaattitarkistus.

Uudet julkaisuvalmistelun bundlet käyttävät `coverageScopeVersion: 2` -sopimusta.
Varmennus estää väärennetyn positiivisen alkuperäisvaikutuksen ja ristiriitaiset
versio-/tutkimusmäärät. Vanhojen hyväksyttyjen bundlejen tarkiste ja vanha
kattavuussopimus tarkistetaan ennallaan. Uusia laajuuskenttiä ei voi lisätä
vanhan sopimuksen nimissä. Tämä muutos ei anna sisältö- tai julkaisuvaltuutusta.

[15 ehdokkaan säilyvä yhteenveto](gk-original-priority-v2-review.json) kiinnittää
PR #286:n 14 VARIANT_ONLY- ja yhden NO_RELIABLE_GK-luokituksen alkuperäisiin
candidate/original/input-tarkisteisiin. Idli-sambar on jälkimmäinen. ORIGINAL_OK
ja CLARIFICATION_NEEDED ovat 0. Kaikki 15 ovat edelleen PENDING ja ilman
julkaisulupaa. Alkuperäiskattavuuden ennuste on 0; erillinen sisältöpäätös
edellytetään myös varianttien jatkokäsittelyyn. Vanhoja rescue-ennusteita ei
käytetä uuden alkuperäistavoitteen perustana eikä tutkimusta avattu uudelleen.

## Tarkistukset ja suorituskyky

- Nyky-mainin laskenta tehtiin ennen muutoksia. Kaikkien 326 alkuperäisen
  tulosobjektin ja 87 hyväksytyn lisäversion koko JSON-sisältö säilyy samana.
  Testit kiinnittävät niiden SHA-256:t ennen/jälkeen-vertailuun. Lisäksi Git-diff
  vahvisti reseptit, käännökset, GK/GI-syötteet, laskentatiedot ja hyväksynnät
  muuttumattomiksi.
- TypeScript ja koko build läpäisivät; 856 reittiä esirenderöitiin.
- 337 yksikkötestistä 336 läpäisi heti. Yksi vanha testi odotti sekoittunutta
  236-kenttää: vanha odotus säilytettiin `legacyNumericRecipes`-kentälle ja
  lisättiin 235/8-laajuussuojat. Kyseinen testi läpäisi kohdennetun uusinnan.
  Factoryn 19 testiä, mukaan lukien väärennettyjen laajuuksien esto, läpäisivät.
- Staattiset testit: 31/31. Vanhaa puuttuvan arvion piilottamista odottaneet
  testit tarkistavat nyt nimenomaisen puuttumisviestin sekä numeerisen alkuperäistuloksen
  puuttumisen; varianttien erottelusuojat säilyvät.
- Brave-selainkokeet: 2/2, mukaan lukien julkaistut kieliversiot, haku,
  suodattimet, näppäimistö ja eri näyttöleveydet. Erillinen Playwright-tarkistus
  vahvisti GK-URL-rajauksen ja kategorian yhdistämisen sekä uudelleenlatauksen
  FI/EN/SV/TH-kielillä. Alkuperäisen ja variantin vertailu on näkyvissä.
- Suomen työpöytänäkymä ja thain 390 px:n mobiilinäkymä tarkistettiin kuvista;
  mobiilissa ei ole vaakaylivuotoa. Käytettiin projektin nykyisiä komponentteja,
  värejä ja typografiaa sekä Ossi-taustaohjeiden tilojen, skannattavuuden ja
  saavutettavuuden periaatteita. Uusia kuvia, fontteja tai CSS-järjestelmää ei lisätty.
- Vite-paketin gzipattu JavaScript: main 379,47 kB → toteutus 381,76 kB
  (+2,29 kB, noin 0,6 %). CSS 3,96 kB gzip, ennallaan. Hakemistokomponenttiin
  ei tuotu GK-lähdeaineistoa; suodatus käyttää edelleen pientä alkuperäisluokkien
  generoitua karttaa. Koko build kesti tässä työpuussa 87,9 s. Mainin koko
  buildin kestoa ei mitattu samassa asetelmassa, joten tästä ei päätellä
  rakentamisajan muutosta.

### Aiemmat kymmenen CI-virhettä

[Koneluettavassa yhteenvedossa](gk-original-priority-v2-review.json) on kaikkien
kymmenen epäonnistuneen testin tarkka nimi. PR #286:n ajo `42013018190` ja saman
lähtötilan main `dab15fe9`, ajo `42011884750`, epäonnistuivat samoissa testeissä.
PR #287 korjasi jäädytetyt historiavertailut ennen tämän toteutushaaran aloitusta:
main on `121fab51`, PR:n onnistunut CI-ajo `42013301738`. Samat kymmenen
historiavertailua läpäisivät tämän työn lähtö-mainissa 10/10. Niitä ei ohiteta,
eikä tämä toteutus muuta niiden odotuksia vihreän CI:n saamiseksi.

Tämän toteutuksen oma CI-varmennus raportoidaan uuden Draft-PR:n tarkistuksissa.
Paikalliset testit eivät yksin muodosta julkaisuvalmiutta. Ei mergeä, deployta,
automaattisia sisältöhyväksyntöjä tai uusia GI/GK-tutkimuksia.

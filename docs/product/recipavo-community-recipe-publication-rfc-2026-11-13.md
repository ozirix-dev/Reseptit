# Recipavo: käyttäjien omat reseptit ja yhteisöjulkaisun automaattinen katselmointi – RFC V1

**Päiväys:** 13.11.2026  
**Tila:** DRAFT / DESIGN ONLY / EI TOTEUTUS- EIKÄ JULKAISUVALTUUTUSTA  
**Repo:** `ozirix-dev/Reseptit`  
**Tavoite:** käyttäjät saavat kasvattaa reseptikirjastoa, ja ylläpitäjän toistuva syöttö- ja tarkistustyö vähenee olennaisesti. **Recipavon V1-betan käyttöönottoa ei saa tämän ominaisuuden vuoksi viivästyttää.**

## 1. Mikä on uutta — älä toteuta vanhaa työtä toiseen kertaan

Tämä RFC on **jatko-osa**, ei korvike:

- [Käyttäjän reseptituonti V1](recipavo-user-recipe-import-v1.md), PR [#295](https://github.com/ozirix-dev/Reseptit/pull/295): tekstin/URL:n tuonti, yksityinen oletus, käyttäjän vahvistus, T0–T4-polku ja omistajan nykyinen viimekätinen hyväksyntä.
- [Sisällöllinen duplikaattitarkistin V1](recipavo-recipe-similarity-v1.md), PR [#318](https://github.com/ozirix-dev/Reseptit/pull/318): deterministinen tarkistus, tulokset `NO_MATERIAL_MATCH`, `MATERIAL_DUPLICATE`, `UNCERTAIN`; ei automaattista hylkäystä eikä poistamista.
- [Recipavon tuotestrategia](recipavo-product-strategy.md): yksityiset reseptit, käyttäjät ja Diary ovat myöhempi tuotevaihe, eivät nykyisen staattisen sivuston ominaisuuksia.
- [Uuden reseptin julkaisun ennakkotarkistus](../reviews/new-recipe-publication-gate-2026-11-10.md), [uuden reseptin GK-putki](../nutrition/gk100-new-recipe-pipeline-plan.md), [tekijänoikeuskäytäntö](recipe-copyright-policy-2026-11-06.md) ja [Cloudflare-julkaisun portit](../recipavo-cloudflare-release-plan.md) jäävät voimaan.

**Tässä uutena:** miten *kirjautunut käyttäjä* ylläpitää omaa reseptiään ja **vapaaehtoisesti ehdottaa sitä yhteisökirjastoon**, miten koneellinen katselmointi toimii kulultaan ja kustannuksiltaan hallitusti, miten toimituksellinen työjonotus ja palautteet toimivat, ja millä **erillisellä päätöksellä** voidaan joskus poistaa omistajalta rutiininomainen tapauskohtainen hyväksyntä.

P0 / nykyinen V1: julkinen reseptikirjasto toimii myös **ilman kirjautumista**. Ei muokata tämän RFC:n perusteella nykyisiä reseptejä, GI/GK:tä, käännöksiä, Cloudflare-asetuksia, workflow'ta, PR:iä tai käyttäjien oikeuksia.

## 2. Käyttäjälupaus ja kaksi erillistä rajaa

**Yksityinen oma resepti:** kirjautunut käyttäjä voi kirjoittaa reseptin tai vahvistaa tuodun tekstin, tallentaa luonnoksen, muokata, poistaa ja myöhemmin halutessaan käyttää sitä omassa ateriapäiväkirjassa. Puuttuva GI, GK, ravintolaskenta tai kuva **ei estä yksityistä tallennusta**.

**Julkiseen kirjastoon ehdottaminen:** erillinen `Ehdota julkaistavaksi` -toiminto. Näytä täsmälleen, mitä tietoa siirtyy julkisen julkaisun katselmointiin, kysy tekijä- ja kuvaoikeudet, ja lukitse lähetetty reseptiversio. Yksityinen muokkaus ei salaa muuta lähetettyä versiota. Tekijä voi vetää ehdotuksen takaisin ennen julkaisua ja korjata sen uudella versiolla.

Julkiseen kirjastoon ei siirry automaattisesti yksityistä muistikirjaa, ateriapäiväkirjaa, profiilisähköpostia, palvelimen lokeja, GPS- tai muuta henkilökohtaista metadataa.

## 3. Katselmoinnin työnkulku ja tilat

```text
PRIVATE_DRAFT
  -> SUBMITTED (nimenomainen käyttäjän vahvistus, version hash)
  -> PREFLIGHT (rakenne, käyttöoikeudet, duplikaatit, roskaposti)
     -> NEEDS_USER_FIX -> SUBMITTED (uusi versio)
     -> HOLD_SAFETY / HOLD_EVIDENCE / HOLD_RIGHTS
     -> REVIEW_CANDIDATE (ei julkaisu)
  -> OWNER_REVIEW_PENDING (nykyinen käytäntö PR #295)
     -> EDITORIAL_APPROVED / RETURNED / REJECTED
  -> PUBLICATION_PREPARED (ravinto/GK/i18n/kuva sekä CI-portit)
  -> PUBLISH_AUTHORIZED (erillinen valtuutus, sidottu versioon)
  -> PUBLISHED (julkaisun jälkeen todennettu URL/versio)
  -> WITHDRAWN / CORRECTION_PENDING / REVERTED (myöhempi muutos)
```

Tila `REVIEW_CANDIDATE` tai koneellisesti arvioitu `PASS` ei ole `EDITORIAL_APPROVED` eikä `PUBLISH_AUTHORIZED`. FAIL CLOSED: mikä tahansa epäselvä tai vanhentunut kriittinen tarkiste pysäyttää julkaisun, **muttei poista yksityistä reseptiä**.

**Vaiheessa V1–V3 omistaja tekee viimeisen toimituksellisen päätöksen kuten PR #295 määrää.** Käyttäjän ajatus ylläpitotyön lomauttamisesta kirjataan tavoitteeksi, mutta viimeisen päätösvallan siirtäminen tai täysin automaattinen julkaisu on **erillinen ehdotus**, jota ei saa aktivoida tämän RFC:n mergellä.

## 4. Automaattinen tarkastusportti: seitsemän osiota

| Osio | Automaation tehtävä | FAIL / HOLD / jatko |
| --- | --- | --- |
| 1. Rakenne ja annokset | Ainesrivit, yksiköt, grammamassat, raaka/kypsä/valutettu, annosmäärä, valmistusajat, oikeat työvaiheet | Korjattava tieto käyttäjälle, ei täytetä arvoja arvalla |
| 2. Elintarviketurvallisuus | Raaka/kypsä liha, kala, kananmuna, kuivat palkokasvit, kassava, ackee, riskiryhmät, säilytys, kontaminaatio | Olennainen epävarmuus aina `HOLD_SAFETY`; pelkkä AI-arvio ei kelpaa turvallisuushyväksynnäksi |
| 3. Allergeenit ja merkinnät | Ainesperusteiset ilmoitukset, koostetuotteiden täsmämerkki, ristiriita tekstin ja listan välillä, ruokavalio- ja gluteenittomuusväitteet | Puuttuva/pakettiin sitomaton varmistus `HOLD_EVIDENCE`; ei automaattisia allergiavapausväitteitä |
| 4. Duplikaatti ja ero | Käytä nykyistä V1-moottoria myös käsittelyjonon hyväksyttyihin ehdotuksiin; näytä selitys ja julkiset vastaavuudet | `MATERIAL_DUPLICATE` käyttäjälle tarkennukseen, `UNCERTAIN` arvioon; ei automaattista poistoa |
| 5. Ravintolaskenta | Elintarvike- ja tuotetietueet, syötävä massa, kuitu/polyolit, öljyn kulutus, täsmällinen laskentahash ja neljän makron todennus | Tuntematon ≠ 0; jos julkisen kortin vaatima olennainen tieto puuttuu, `HOLD_EVIDENCE` |
| 6. GI/GK | Vain valmistusmuotoon ja määrään sidotut GI-lähteet; laskenta, epävarmuus, lähdeversiot ja erilliset GK-hyväksynnät | Julkinen GK `ei määritetty`, kun näyttö ei riitä; ei ryhmäanalogialla pakottamista |
| 7. Kuva, kieli, oikeudet | Käyttäjän kuvan oikeusilmoitus, kuvavastaavuus, mahd. käyttökelpoinen oma kuvitus, FI-pohjainen EN/SV/TH-merkitystarkistus, tekijänoikeus | Puuttuvat luvat tai ristiriitainen kuva estävät julkaisun; käännös ei saa muuttaa allergeeneja tai määrämassoja |

Käytä ensin **deterministisiä ja halpoja** sääntöjä. Kutsu mahdollista tekoälyä vasta perustarkistuksen läpäisseisiin tai epäselviin tapauksiin. Älä pyydä mallia myöntämään itselleen hyväksyntää: kone tuottaa havainnot ja ehdotetun korjauksen, versionlukittu päätösvalta on erillinen.

**Käyttäjälle palautettava palaute:** löydetyt puutteet reseptiriveittäin, selitys ja korjausvaihtoehto; ei pelkkää `FAIL`-ilmoitusta. Pidä historiallinen auditointijälki myös palautettujen versioiden käsittelystä.

## 5. Toimitus ja tuleva delegointimalli

### V1 – turvallinen omistajaportti (oletus)

Kone selvittää toistuvat puutteet ja pyytää korjaukset käyttäjältä. Omistaja näkee ensisijaisesti **hyvin valmistellut** ehdokkaat ja kriittiset HOLDit; hänen ei tarvitse syöttää reseptiä eikä tehdä jokaista ainesmääräkorjausta itse. Julkaisuhyväksyntä ja sen SHA ovat yksilölliset.

### V2 – luotettujen tekijöiden erät (erillinen hyväksyntä)

Voi olla rajattu käyttäjäluottamus (todennetut aiemmat julkaisut, ei henkilön oletettu luotettavuus). Ehdokkaat voidaan kerätä kohtuulliseksi hyväksyttäväksi eräksi; ylläpitäjä saa vertailukelpoisen raportin ja voi hyväksyä turvalliset tapaukset joukolla, mutta tarkistaa poikkeamat yksittäin. Yksi käyttäjätili ei voi ohittaa turva- eikä allergiaportteja.

### V3 – mahdollista automaattijulkaisua tutkiva pilotti (EI hyväksytty)

Vasta erikseen sovitun politiikka-, riski-, tietosuoja- ja rollback-katselmoinnin jälkeen voidaan kokeilla **erillistä yhteisösisältöluokkaa**, jossa vain tarkasti määritellyt vähäriskiset reseptit voidaan julkaista automaattisesti. Julkinen merkintä erottaa yhteisöreseptin toimituksellisesti hyväksytystä Recipavo-reseptistä. Turvallisuusriskeissä, koostetuotteiden allergeeniepäselvyyksissä, puuttuvissa oikeuksissa tai ristiriitaisessa laskennassa ei koskaan automaattista julkaisua. Uudelleenavaus (väärä merkintä, haitallinen sisältö) ja ihmisen välitön pysäytys kuuluvat arkkitehtuuriin.

**V3 muuttaa PR #295:n nykyistä omistajapolitiikkaa ja vaatii nimenomaisen uuden päätöksen.** Tämän suunnitelman kirjoittaminen, PR:n avaaminen, CI PASS tai merge ei myönnä tuota valtuutta.

## 6. Tietomalli ja versiosidonta – ehdotus, ei valmis skeema

Suunnitellut pääentiteetit:

- `users` / `identity_link`: ulkoisen autentikoinnin identiteetti, ei reseptitietokannan oma salasana; vain tarpeellinen profiilitieto.
- `private_recipes` ja `recipe_versions`: muuttumaton `version_id`, `owner_user_id`, `source_locale`, annokset, ainesosat, teksti, `content_sha256`, `visibility=PRIVATE`.
- `publication_submissions`: `submission_id`, hyväksytty `version_id`, erillinen julkistussuostumusversio, tilakone, idempotenssiavain ja alkuperä-/lisenssiviitteet.
- `review_runs` ja `review_findings`: säännöstöversio, malliversio tarvittaessa, lähteiden tunnisteet, jokaisen kriittisen portin tulos, aikaleima sekä virheiden luokitus.
- `review_decisions`: hyväksyjä/rooli, toimituksellinen päätös, täsmäversio, syy tai sisäinen perustelu, päätöstyyppi ja peruutus.
- `image_assets`: omistaja, tiedostojen oikeusilmoitus, skannaustulos, R2-viite, renderöintiversiot ja korvaushistoria.
- `publications`: julkinen resepti-ID ja reitit, julkaisuversio, alkuperäinen ehdotusviite sisäisesti, mahdollinen GitHub-SHA / static-build, julkaisupäivä, peruuttamisloki.

**Yksityinen käyttäjätieto ja julkinen toimitussisältö eivät ole sama tietokanta-/API-näkymä.** Julkisessa tietomallissa ei välitetä sähköpostia tai henkilökohtaisia huomautuksia. Julkisessa hakemistossa on yksi aktiivinen kanoninen reseptiversio; vanhat hyväksyntä- ja GK-todisteet jäävät auditointihistoriaan (ks. erillinen [kanonisen nykytilarekisterin RFC #555](https://github.com/ozirix-dev/Reseptit/pull/555), joka on tutkimusvaiheessa). Ei kirjoiteta historiallisia GK-sidoksia uudelleen.

### API-luonnos (ei toteutusta)

```text
POST   /api/me/recipes                   -> yksityinen luonnos, idempotent
GET    /api/me/recipes                   -> vain kirjautuneen omat
PATCH  /api/me/recipes/{id}              -> uusi muuttumaton reseptiversio
DELETE /api/me/recipes/{id}              -> poisto-/säilytyspolitiikan mukainen toiminto
POST   /api/me/recipes/{id}/submit       -> erillinen eksplisiittinen julkaisuehdotus
GET    /api/me/submissions/{id}          -> tekijälle rajattu palaute ja tila
POST   /api/admin/submissions/{id}/decide -> roolipohjainen, auditoitu päätös
```

Kaikki omistajuustarkistukset tehdään palvelimella. Käyttäjä-ID ei saa tulla asiakkaan antamana valtuutuksen lähteenä. Admin-API:ssa erillinen rooli, CSRF-/istuntosuoja tarpeen mukaan, nopeusrajat ja auditointi. Julkaisuportti tarkistaa aina version ja hyväksynnän SHA:n, ei vain käyttäjän aiemmin saamaa vihreää rastia.

## 7. Ehdotettu Cloudflare-arkkitehtuuri ja kustannusrajat

- **Identity:** arvioi Cloudflaren kanssa toimiva valmiiksi ylläpidetty kirjautumisratkaisu ennen hankintaa. Sähköposti-/salasanalistaa ei rakenneta omaan reseptipalveluun ilman erillistä päätöstä. SSO- ja passkey-vaihtoehdot päätetään tietoturva-/hintakatselmoinnissa.
- **D1 (ehdotus):** yksityiset reseptiversiot, julkaisuehdotukset, katselmointitulokset ja omistusoikeus-/suostumusviitteet. Ei uutta D1-projektia tämän PR:n perusteella.
- **R2 (ehdotus):** kuvien eristetty yksityinen käsittely ja hyväksytyt julkiset kuvat erillisin käyttöoikeuksin. Tarkista palvelun media-, skannaus- ja poistoprosessi.
- **Workers / Queue (ehdotus):** autentikoitu API ja kustannusrajatut työjonot. Näiden olemassaoloa ei oleteta nykyisessä staattisessa GitHub Pages/Cloudflare V1 -sivustossa.
- **Julkinen reseptihakemisto:** ensimmäinen toteutettava julkaisupolku voi käyttää nykyistä versionlukittua staattista buildia, hyväksytyn sisällön kontrolloitua vientiä ja eräjulkaisua. Käyttäjän yksityinen `Save` ei käynnistä GitHub PR:ää eikä Cloudflare-deployta. Mahdollisesta reaaliaikaisesta D1-julkisesta katalogista päätetään erikseen.
- **Budjetti:** asetetaan palvelinkohtaiset API-kutsujen, kuvien, tallennuskapasiteetin ja tekoälyn käyttörajat; erikseen käsittelyjono- ja kuukausikatto, ei hiljaisia maksullisia mallikutsuja. Ensin mitataan prototyypillä yhden käyttäjän / ehdotuksen kustannus ja virheiden käsittely.

Tuotantodomain `www.recipavo.com` ja nykyinen Coming Soon -suoja jäävät tämän RFC:n ulkopuolelle. Esikatselut eivät oikeuta tuotantoon siirtoa. Henkilökohtaiset reseptiluonnokset eivät koskaan vuoda julkiseen GitHub-repoon tai CI-lokeihin.

## 8. Väärinkäyttö, tietosuoja ja oikeudet

- Rekisteröinnin väärinkäyttö, spämmäys, haitalliset linkit ja valtavat kuvat: palvelinpuolen kiintiöt, kuva-/sisältötarkistukset, rate limiting, uusi käyttäjä ensin matalalla kiintiöllä, valitus-/esto- ja ilmoituspolku.
- Linkkituonti (T2): palomuuri ja URL-allow/deny -politiikka, ei sisäisten IP-osoitteiden noutoa (SSRF), aikarajat, redirect-rajat, haitallinen HTML ja prompt-injection käsitellään datana.
- Tekijänoikeudet: käyttäjän nimenomainen lupa julkaista itse kirjoittama teksti ja hänen omistamansa tai lisensoidut kuvat; alkuperäinen URL ei ole käyttölupa. Ilmoita lisenssin käyttötarkoitus, poistopyynnöt, tekijämerkintä ja edelleenjulkaisu erikseen.
- GDPR-toteutus ennen T1: rekisterinpitäjä- ja käsittelijäroolit, tietosuojaseloste, säilytysajat, oikeus saada omat tiedot/poistaa tai oikaista, tietoturva- ja tietovuotoprosessi sekä tarvittavat palvelusopimukset arvioitava. Älä väitä automaattista reseptihyväksyntää tietosuojahyväksynnäksi.
- Muokattu jo julkaistu resepti palaa uuteen katselmointiin. Julkisesta poistaminen ei välttämättä hävitä erillisiä lainmukaisesti säilytettäviä auditointimerkintöjä; tietojen minimointi ja poiston vaikutus selvitettävä.

## 9. Vaiheistus, mittarit ja hyväksymiskriteerit

| Vaihe | Rajattu toimitus | Mitattava valmis-ehto | Sallitut vaikutukset |
| --- | --- | --- | --- |
| **C0 — nyt** | Tämä RFC, riippuvuuskartta ja tulevien vaiheiden backlog | Ei muutoksia käyttäjäsisältöön, domainiin tai CI-portteihin | Dokumentaatio vain |
| **C1 — V1:n jälkeen** | 10–20 synteettistä/tekijänoikeudellisesti turvallista reseptiä, lomakeprototyyppi, palautekortit ja tilakone ilman henkilötietoja | Rakennetesti, turvallisuus-HOLD, oikeustarkistus, duplikaatti, tuntematon GK, uudelleenlähetyksen idempotenssi toimivat | Ei oikeaa kirjautumista |
| **C2 — yksityinen** | T1 (PR #295): käyttäjätunnistus, D1-luonnokset, versiot, omistusoikeus, poisto/vienti; 5–20 opt-in-testaajaa | Roolieristys, ei käyttäjätietovuotoja, peruutus ja versiohistoria toimivat | Ei julkisia käyttäjäreseptejä |
| **C3 — valvottu yhteisöpilotti** | T4: 5–20 oikeaa julkaisuehdotusta → automaattinen esikatselmointi → omistajan päätös → julkaisupaketti | 100 % julkaistuista ehdotuksista versio- ja hyväksyntäsidottuja; 0 tiedossa olevaa kriittistä turvallisuus-/oikeusohitusta; julkinen käyttöönotto erikseen | Omistaja hyväksyy |
| **C4 — hallitun automaation päätös** | Mittaa korjauskierto, läpimeno, vaaralliset virhe-ehdotukset, väärät duplikaatit, ylläpidon aika ja kustannukset | Erillinen nimenomainen päätös automaattijulkaisun säännöistä, luokista, auditoinnista ja kill switchistä | Ei automaattista lupaa C3:n perusteella |

**Käyttökelpoiset KPI:t:** käsin tehtyjen korjausten minuutit / julkaistu resepti; kuinka moni ehdotus palautuu tekijälle itse korjattavaksi; turhan AI-käytön osuus; oikeat virheelliset hyväksynnät; reseptien julkaisuviive; kuvien ja käännösten oikeellisuus; asiakkaiden poistumis- ja palautetarpeet. Mittaa vasta todellisessa pilotissa, älä keksi toteutunutta säästöä etukäteen.

## 10. Päätöskohdat ja rajaukset

**Ennen C1:tä:** hyväksy nimenomaisesti lomake-UX, synteettinen testidata ja vastuu- sekä resurssirajat.  
**Ennen C2:ta:** ratkaise tunnistus, D1/R2, tietosuoja, käyttöoikeudet, poistopyynnöt ja maksullisten palveluiden kustannuskatot.  
**Ennen C3:a:** vahvista julkisen sisällön käyttöehdot ja kuvalisenssit, auditointi, turvaportit, moderointivastuu ja ilmoitus-/poistopolku.  
**Ennen C4:ää:** tee erillinen päätös **muutoksesta omistajan tapauskohtaiseen hyväksyntäpolitiikkaan**. Yhteisön kasvu ei saa hiljaisesti muuttaa toimituksellisesti varmennetun Recipavo-sisällön laatulupausta.

### Ei tässä PR:ssä

Ei kirjautumista, käyttöliittymää, tilitauluja, D1-/R2-/Workers-resursseja, maksullista mallipalvelua, käyttäjädataa, API:a, Cloudflare-julkaisua, GI/GK- tai ravintoarvomuutoksia, reseptien lisäämistä, ylläpitäjäroolien muuttamista, CI-rakennemuutoksia, automaattista mergeä tai julkisen reseptikirjaston päivitystä.

**Keskeneräisen Recipavo V1 -julkaisun, turvallisuus-HOLD-reseptien ja rinnakkaisten Codex-julkaisuerien on saatava etusija.** Tämä RFC jää omalle dokumentaatiohaaralleen, kunnes käyttäjä erikseen päättää toteutuksen alkamisesta.

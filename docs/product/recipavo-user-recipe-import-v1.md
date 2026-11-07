# Recipavo: käyttäjän reseptin tuonti linkistä tai tekstistä — V1

**Tila:** DESIGN / DRAFT / ei toteutus-, migraatio-, hankinta-, merge- tai deploy-valtuutusta.
**Päiväys:** 5.11.2026.
**Omistajuus:** `ozirix-dev/Reseptit`, Recipavo-tuotesuunnitelman täsmennys.
**Lähtöesimerkki:** [raejuustopizzan toimituksellinen PR #294](https://github.com/ozirix-dev/Reseptit/pull/294) — esimerkki ihmisen ohjaamasta julkaisupolusta, **ei** käyttäjätuonnin tekninen toteutus.

## Päätös ja käyttäjälupaus

Käyttäjä liittää reseptitekstin tai URL:n, tarkistaa tunnistetut ainekset ja määrät, tallentaa reseptin **omaan yksityiseen kokoelmaansa** ja voi myöhemmin liittää hyväksytyillä ravintoarvoilla määritetyn annoksen ateriapäiväkirjaan. Tuntematon ravintoarvo tai GK ei estä reseptin tallentamista. Tallennus ei julkaise reseptiä, lähetä sitä GitHubiin tai käynnistä deployta.

**Käyttäjän polku:** Lisää oma resepti → (liitä teksti tai linkki) → tunnistettu luonnos → tarkista / täsmennä → tallenna omiin → halutessa kirjaa ateria / ehdota julkiseen kirjastoon erillisellä nimenomaisella toiminnolla.

Tämä täydentää nykyistä [Recipavo-tuotestrategiaa](recipavo-product-strategy.md), jossa omat reseptit ovat vasta myöhempi ominaisuus (luku 5), ja [uuden reseptin GK-työnkulun suunnitelmaa](../nutrition/gk100-new-recipe-pipeline-plan.md). Ei muuteta niitä tässä automaattisesti toteutetuiksi ominaisuuksiksi.

## Kaksi tarkasti erotettavaa työnkulkua

| Käyttäjän yksityinen resepti | Julkaisuun ehdotettu resepti |
| --- | --- |
| Oletus on **private**. Vain käyttäjän omat tunnistetut rajapintakutsut. | Käyttäjä antaa erillisen tietoon perustuvan suostumuksen / ehdotuksen. |
| Tallenna onnistuu ilman kuvaa, GK:ta tai neljää kieltä. | Toimituksellinen tarkastus, alkuperä/lisenssit, toimiva resepti, oma kuva, kielten tarkistus, Nutrition Core / GK:n hyväksyntäportit. |
| Sovelluksen omistettu käyttäjätietokanta ja reseptirevisiot. | Erillinen moderoitu jono. Hyväksytty toimituksellinen sisältö voidaan viedä Reseptit-repon draft-PR:ään valvotusti. |
| Ei GitHub-tiliä, PR:ää, CI:tä tai deployta tavallisesta tallennuksesta. | PR on **vain toimituksellisen julkaisijan** työväline; merge ja tuotantodeploy vasta erillisin valtuuksin. |
| Oma resepti voi sisältää keskeneräiset arvot, jotka näytetään tuntemattomina. | Ei automaattista GK-hyväksyntää eikä ravintoarvojen arvauksia. |

Henkilökohtaista reseptiä, päiväkirjaa tai käyttäjän lähdetekstiä **ei saa** koskaan kopioida julkiseen GitHub-PR:ään automaattisesti. Ehdotukseen tulee vain erikseen hyväksytty sisältö ilman yksityisiä tietoja.

## Syöttötavat ja vaiheittainen toimitus

| Vaihe | Käyttöliittymä / toteutus | Edellytys | Lopputuloksen hyväksyntä |
| --- | --- | --- | --- |
| T0: sopimus ja synteettiset testit | Fixture-pohjainen tekstin jäsentely, JSON-välitulos ja mobiilikäyttöliittymän prototyyppi ilman oikeaa käyttäjädataa tai verkkonoutoa. | P1:n käsitteet; oma toteutuslupa. | Pystyy korjaamaan grammoja, annoksia, raaka-/kypsä-määreitä; tallennus simuloidaan eikä lähetetä verkkoon. |
| T1: oma resepti tekstistä | Liitä/kirjoita resepti → esitä ainesosat ja ohjeet tarkistettavina → yksityinen tallennus ja revisio. | **P2:** tunnistus, tietosuoja, poisto/vienti, omistajuus; **P3:** yhteensopiva Diary-tietomalli. | Todellinen käyttäjä näkee vain omat reseptinsä, voi korjata ja poistaa; historia ei muutu hiljaa. |
| T2: URL-tuonti | Julkisen reseptisivun osoite → rajattu nouto → rakenteisen Recipe/JSON-LD:n tai sivutekstin jäsentely → sama vahvistusnäkymä kuin T1. | T1, verkkonoudon tietoturva-, tekijänoikeus-, kustannus- ja ylläpitopäätös. | Käyttäjälle näytetään alkuperäinen URL ja epävarmat kentät; virheellinen/suojattu linkki palautuu manuaaliseen tekstitilaan. |
| T3: Core-laskenta ja päiväkirjakirjaus | Hyväksytyt ruoka-aine-/määrävastineet, tunnetut makrot, kattavuus, GK vain hyväksytyllä lähdenäytöllä; annos kirjataan snapshotina. | Nutrition Core -rajapinta, lähde-/käyttöoikeudet, versionhallinta, P3 ja tarvittavat laskennan hyväksynnät. | Oikeat määrät; tuntematon ≠ 0; duplikaattikirjaus ja jälkikäteen muuttuva päiväkirjahistoria estetty. |
| T4: vapaaehtoinen julkaisuehdotus | Erillinen “Ehdota reseptiä julkiseen kirjastoon” -toiminto → automaattinen duplikaatti-/samankaltaisuusportti → vain riittävän erottuva ehdotus omistajan hyväksyntäjonoon → toimituksellinen jatkovalmistelu ja valvottu GitHub-vienti. | Sisällön moderointi, duplikaattitarkistus, käyttöoikeus- ja julkaisuprosessi; erillinen hyväksyntä. | Samankaltainen ehdotus ei läpäise automaattista alkuporttia; omistaja päättää aina jatkosta. Ei käyttäjätietojen vuotoa tai automaattista merge/deployta. |

T0 voidaan suunnitella nykyisen julkisen sivuston rinnalla; **T1–T4 eivät kuulu P1–P3:n tämänhetkiseen minimilaajuuteen** eikä niiden toiminnallisuutta pidä luvata ennen erillisiä päätöksiä.

## Julkisen reseptiehdotuksen kaksivaiheinen hyväksyntäportti (T4)

**Tuotepäätös:** käyttäjä **saa ehdottaa** omaa tai muuten asianmukaisin käyttöoikeuksin ehdotettavaa reseptiä julkiseen Recipavo/Reseptit-kirjastoon. Ehdottaminen on eri toiminto kuin yksityiseen kokoelmaan tallentaminen. **Vain alustavan samankaltaisuustarkistuksen läpäisevä ehdotus pääsee normaalisti omistajan toimitukselliseen hyväksyntäjonoon.** **Omistajalla on ehdoton, viimekätinen toimituksellinen päätösvalta**: hän voi hyväksyä, hylätä tai jättää ehdotuksen odottamaan oman harkintansa mukaan. Hylkäämistä ei tarvitse perustella ehdottajalle. Algoritmi ei voi kumota päätöstä. Mikään vaihe ei itsessään tarkoita julkaisua.

### Käyttäjän polku

1. Käyttäjä valitsee erikseen **“Ehdota julkiseen reseptikirjastoon”**. Näytä mitä ehdotuksesta ja lähdeviitteistä siirtyy toimitukselliseen käsittelyyn; pyydä nimenomainen vahvistus ja ilmoitus tekijänoikeuksista / käytettävissä olevista luvista. Älä oleta, että yksityisen reseptin sisältöä saa jakaa.
2. Tee **alustava päällekkäisyystarkistus** ennen raskasta ravinto-/GK-tutkimusta, käännöksiä, kuvantuotantoa tai GitHub-PR:ää. Vertaa **kaikkiin julkisesti hyväksyttyihin resepteihin ja julkaisujonon ehdokkaisiin**; huomioi neljän kielen otsikkovariaatiot ja saman reseptin kieliversiot yhtenä reseptinä.
3. Tulokset:
   - `NO_MATERIAL_MATCH`: ei olennaisesti samanlaista reseptiä → `OWNER_REVIEW_PENDING` (omistajan henkilökohtainen hyväksyntäjono), edelleen **ei julkaistu**.
   - `MATERIAL_DUPLICATE`: käytännössä sama resepti → **ei läpäise alkuporttia**; näytä käyttäjälle tunnistetun **julkisen** reseptin linkki ja ymmärrettävä ero-/päällekkäisyysselitys; tarjoa “muokkaa ehdotusta”, “tallenna vain itselle” ja “perustele merkittävä ero”. Älä automaattisesti avaa PR:ää.
   - `UNCERTAIN` tai tarkistus epäonnistuu → **ei läpäise automaattista alkuporttia**; anna selkeä tarkennus-/uudelleenyritys- tai rajattu ylläpitäjän poikkeustarkistuspolku. Älä väitä ettei duplikaattia ole. Mahdollinen poikkeus vaatii omistajan dokumentoidun tietoisen päätöksen, ei algoritmin hiljaista ohitusta.
4. Omistajan käsittely: **hyväksy jatkovalmisteluun / pyydä muutoksia / hylkää**; näytä ehdotus, koostettu vertailutulos ja sen sisäiset perustelut, julkiset vertailureseptit ja lähde-/käyttöoikeustila. **Omistajalla on yksinomainen viimeinen sana, eikä hylkäykselle tarvitse antaa käyttäjälle syytä.** Sisäiseen tapahtumalokiin riittää päätös, tekijä, ajankohta ja reseptiversio; vapaaehtoinen perustelumuistio jää vain toimituksen käyttöön. Omistajalle ei lähetetä automaattisesti kaikkia käyttäjien omia yksityisiä reseptejä.
5. Vasta omistajan **erillisellä hyväksynnällä** ehdotus siirtyy toimitukselliseen valmisteluun (ainekset, rakenteet, realistinen valmistus, ravintoarvot, GK:n näyttö tai HOLD, kuvaoikeudet, neljä kieltä ja tarkistukset) ja tämän jälkeen tarvittaessa **Draft-PR**:ksi. Lopullinen julkaisulupa, merge ja deploy ovat oma päätösporttinsa. Aiempi omistajan sisällöllinen hyväksyntä ei ole merge/deploy-lupa.
6. Kerro käyttäjälle vain ehdotuksen tila (esim. `tarkistuksessa`, `samankaltainen löytyi`, `toimituksen arvioitavana`, `lisätietoja pyydetty`, `hyväksytty valmisteluun`, `hylätty`) paljastamatta muiden käyttäjien yksityisiä reseptejä tai toimituksen sisäisiä tietoja. Omistajan hylkäyksestä annetaan neutraali ilmoitus, esimerkiksi **“Reseptiehdotusta ei hyväksytty julkiseen reseptikirjastoon. Kiitos ehdotuksesta.”** Ei automaattista perustelua, yksityiskohtaista selontekoa, väittely-/valitusprosessia tai lupausta uudelleenarvioinnista. Mahdolliset laissa pakolliset ilmoitukset tai perustelut hoidetaan erikseen sovellettavien velvoitteiden mukaisesti. Hylätty ehdotus **ei poista** yksityistä reseptiä.

### Mitä “samankaltainen resepti” tarkoittaa

Älä päätä päällekkäisyyttä pelkästä nimestä, slugista, tekstin samankaltaisuudesta tai samasta pääraaka-aineesta. Käytä kaksitasoista vertailua:

- **Tarkka duplikaatti:** normalisoidun reseptisisällön, lähde-URL:n tai muun vahvan tunnisteen yhtenevyys; huomioi versiot ja käännökset.
- **Olennainen samankaltaisuus:** vertaa raaka-aineiden joukkoa ja suhteita, korvaavia ainesosia, valmistustapaa, ruokalajin rakennetta, lopputulosta ja olennainen käyttäjähyöty. Kyseenalaista pelkkä mausteen, otsikon tai annoskoon muutos.
- **Aito erottuvuus:** esimerkiksi Margherita-pizza, Pofiber-pohjainen pizza ja raejuustopizza ovat eri rakenne-/ruokavaliovaihtoehtoja; myös merkittävästi eri tekniikka tai allergeeniton / muun ruokavalion aidosti toimiva muunnos voi olla eri resepti.
- Tarkistuksen on palautettava **lähdeviitteelliset osumat ja selitettävä peruste**; mahdollisia tulevia numeerisia samankaltaisuuskynnyksiä ei lukita ilman arvioitua testiaineistoa. Tekoälyluokittelija ei yksin saa julkaista tai hyväksyä ehdotusta.
- Pending-jonon sisältö on luottamuksellista: älä paljasta toisten ehdottajien alkuperäisiä tekstejä tai henkilötietoja käyttäjälle. Jos ehdotus vastaa vain toisen käsittelyssä olevaa ehdotusta, anna geneerinen ilmoitus ja mahdollisuus yksityiseen tallentamiseen tai eron perustelemiseen.

### Tietomallin ja hyväksyntälogiikan ehdotus (ei vielä skeemamuutosta)

```text
PublicRecipeSubmission:
  submission_id, submitter_id, private_recipe_revision_id?
  consent_version, explicit_submit_at, source_url?, rights_attestation
  content_snapshot_for_editorial_review
  duplicate_check: { status: NO_MATERIAL_MATCH | MATERIAL_DUPLICATE | UNCERTAIN,
                     compared_library_revision, matched_public_recipe_ids[],
                     matched_pending_submission_ids_internal_only[],
                     reasons[], checked_at }
  workflow_status: DRAFT | DUPLICATE_BLOCKED | CLARIFICATION_NEEDED |
                   OWNER_REVIEW_PENDING | CHANGES_REQUESTED | REJECTED |
                   APPROVED_FOR_PREPARATION | EDITORIAL_DRAFT
  owner_decision: { decision?, actor_id?, at?, internal_note_optional?, proposal_revision? }
```

**Revisiointi:** materiaalinen muutos aineksiin, annoksiin tai valmistustapaan nollaa aiemman duplikaattitarkistuksen ja mahdollisen sisällöllisen hyväksynnän. Julkaisuvientiä varten vain erikseen hyväksytty toimituksellinen snapshot — ei henkilökohtaisia muistiinpanoja, päiväkirjoja, kontakteja tai piilotettuja metatietoja. Vertailu pidetään hallinnollisesti luettavana ja lokitus minimissä.

**Turvallinen oletus:** mitään reseptiä ei viedä julkiseen kirjastoon eikä GitHubiin ilman nimenomaista toimituksellista omistajapäätöstä; käyttäjälle tallennus yksityisenä on sallittu, vaikka ehdotus estyisi duplikaattina. Julkisen ehdotuksen alkuportti ei riipu GK:n numeerisesta valmistumisesta.

## Tuontitiedon rakenteinen sopimus

Tuonti palauttaa ensin ehdokkaan, ei hyväksyttyä reseptiä. Ehdotettu sisäinen tietomalli (ei vielä skeemamuutos):

```text
ImportCandidate:
  input_kind: pasted_text | public_url
  original_source_url?: string
  title?: ExtractedField<string>
  portions?: ExtractedField<number>
  ingredients: [{ original_line, name, amount?, unit?, edible_grams?,
                  preparation_state?, source_span?, confidence?, issue_codes[] }]
  steps: [{ text, source_span?, issue_codes[] }]
  source_title?: string
  rights_state: unknown | user_attested | reviewed
  warnings: string[]
  extraction_revision: string

PrivateRecipe:
  owner_id, recipe_id, revision_id, created_at, updated_at
  structured_ingredients, instructions, portions
  source_metadata, user_edits, validation_state
  nutrition_snapshot_id?, nutrient_coverage?, gl_status?
```

`ExtractedField` kertoo arvon lisäksi syötteen kohdan, tunnistustavan ja epävarmuuden. Käyttäjän korjaukset erotetaan lähteestä poimitusta tekstistä. Null / puuttuva määrä säilyy tuntemattomana, ei saa muuttua automaattisesti nollaksi. Valmistusajan, tuotevariantin, annosmäärän, raaka-/kypsä-/valutettu-painon sekä vaihtoehtoisten ainesten epävarmuus näkyy samassa vahvistusnäkymässä.

**Eri käsitteet:** valmistusreseptin `servings`, koko erän massa, syöty annos ja syöty grammapaino ovat eri kenttiä. Älä laske kypsää saantoa raakojen ainesten massojen summasta. Reseptin muuttaminen tuottaa uuden revision; vanhat Diary-merkinnät säilyttävät lähde-/laskentasnapshotinsa. Määrämuutokset käynnistävät tarvittaessa uuden ravinto-/GK-arvion.

## Ravintoarvo- ja GK-politiikka

1. Ensisijaisesti hyväksytyt, versioidut koostumus- ja GI-tietueet sekä täsmällinen elintarvikkeen tila; lähteiden käyttäminen vain tarkistettujen oikeuksien puitteissa.
2. Tunnistus on ehdotus: käyttäjä vahvistaa yksikkömuunnokset, annokset ja merkittävät vaihtoehdot. “2 kananmunaa” ei saa huomaamatta muuttua oletetuksi grammamääräksi ilman käyttäjälle näkyvää perustetta.
3. Makrot ilmoitetaan vain tunnetuille, perustelluille määrille. Osittainen laskenta merkitään **partial** eikä täydelliseksi ateriaksi. Energiatieto tarvitsee hyväksytyn energiamallin.
4. GK: `CALCULABLE | REVIEW_REQUIRED | UNRESOLVED`; numeerinen arvo vain laskentakelpoisille, perustelluille lähde- ja määräyhdistelmille. Lähdearvio ei ole sama kuin julkinen GK100 Approval Factory -hyväksyntä.
5. Käyttäjä voi tallentaa ja kokata `UNRESOLVED`-reseptin. Syödyn annoksen päiväkirjaan liittäminen on mahdollista rakenteellisesti, mutta puutteellinen ravintolaskenta ei saa kasvattaa päivän “tunnettua kokonaismäärää” virheellisesti.

## URL-tuonnin tietoturva, oikeudet ja luottamusrajat

- Käyttäjän antama URL, verkkosivun HTML, JSON-LD ja tekoälyn tuottama tulkinta ovat **epäluotettavaa dataa**, eivät ohjeita tai järjestelmäkomentoja. Niistä ei voi johtaa lupaa GitHub-, admin-, käyttäjä- tai pilvitoimiin.
- Nouto vain `https`-julkisiin kohteisiin; estä localhost, private/link-local/metadata-IP:t, sisäiset palvelut, nimipalvelun uudelleensidonta ja edelleenohjaukset sisäverkkoon. Uudelleentarkista jokainen redirect-kohde; rajaa portit, sivukoko, latausaika, MIME-tyypit ja edelleenohjausten määrä.
- Älä seuraa kirjautuneen käyttäjän evästeitä kohdesivulle. Älä kierrä maksumuureja, kirjautumista, robots-/käyttöehtorajoituksia tai käyttöoikeuden estettä.
- Kaikki HTML- ja tekstikentät sanitoidaan ennen UI:ta; ulkoisia skriptejä, kuvia tai linkkejä ei suoriteta/haeta mielivaltaisesti. Prompt injection ei saa muuttaa toimintoja tai tyhjentää yksityisiä tietoja.
- Julkisen sivun reseptifaktat voi käsitellä vain soveltuvin käyttöoikeuksin. Pelkkä reseptin URL ei oikeuta kopioimaan kuvia, artikkelia tai pitkiä luovia ohjeita julkiseen kirjastoon. Tallenna lähdeviite; tee yksityisestä käytöstä ja julkisesta uudelleenjulkaisusta **erilliset oikeus- ja sisältöpäätökset**.
- Käyttäjän reseptejä ei oletusarvoisesti anneta kolmansien osapuolten generatiivisiin palveluihin. Mahdollinen ulkoinen käsittely edellyttää P2-tietosuojapäätöstä, ymmärrettävää ilmoitusta ja hyväksyttyä toimittajasopimusta.
- Nouto- ja tulkintayrityksille rajat/kiintiöt, väärinkäytön esto, idempotenssi, lokien minimointi ja salaisuuksien eristäminen; syötettyjä reseptejä tai tunnisteita ei viedä julkisiin diagnostiikkalokeihin.

## Käyttöliittymän virhe- ja korjauspolut

- Linkki estetty, ei verkkoyhteyttä tai Recipe-metadata puuttuu → “En saanut reseptiä automaattisesti. Liitä teksti tai kirjoita resepti.”
- Tuntematon gramma-/desilitra-/kpl-muunnos → näytä alkuperäinen rivi ja “Täsmennä määrä” ilman estettä koko reseptin tallennukselle.
- Eri ruokien sekoittuminen yhden reseptin sisältöön → käyttäjä voi poistaa, lisätä tai muokata rivejä ennen tallennusta.
- Suljetun lähteen käyttö, ei sisällön kopiointilupaa → ei automaattista uudelleenjulkaisua; näytä ymmärrettävä selitys.
- Tallennus epäonnistuu → ei vihreää onnistumisvahvistusta; retry samoilla idempotenssiehtoisilla tiedoilla, ei duplikaattia.
- Julkaisuun ehdottaminen vaatii erillisen vahvistuksen ja tekijänoikeus-/käyttöoikeusilmoituksen; hylkäys ei poista käyttäjän yksityistä reseptiä.

## Ensimmäisen pilotin testimatriisi

| Fixture | Odotettu tulos |
| --- | --- |
| Raejuustopizza tekstinä (PR #294), 2 annosta, 10 ainesosaa | Näyttää 10 rakennettua riviä, annokset ja valmistusvaiheet. Ei oleta GK-hyväksyntää. |
| Sama resepti URL:stä (stubattu; ei live-noutoa T0:ssa) | Sama vahvistusnäkymä; URL säilyy lähdemetatiedossa; toiminnan turvallisuus ei riipu sivuston ohjeista. |
| “2 kananmunaa, 1 dl kaurajauhoa”, tuntematon grammavastaavuus | Ei keksi 110 g / 50 g muunnosta; käyttäjän täsmennys näkyy. |
| Kaksi vaihtoehtoista täytettä / vapaavalintainen raaka-aine | Valinta säilyy avoimena, kunnes käyttäjä vahvistaa käytetyn version. |
| Puuttuva GI tai yksi tuntematon määrä | Tallennus sallittu, GK `UNRESOLVED`, päivän summa ei muutu keksityksi. |
| URL sisältää sisäverkon, redirectin metadataan tai kirjautumisportin | Nouto estetty, ei yritystä muille sisäisille osoitteille, käyttäjälle manuaalinen vaihtoehto. |
| HTML sisältää prompt injectionin / skriptin / linkin ulkoiseen kuvaan | Ei suoritusta, ei oikeuksien nostoa, ei automaattista kuvahakua. |
| Kahden käyttäjän reseptit ja suorien ID:iden kysely | Omistajuustarkistus estää kaiken ristiinpääsyn; arkisto-, vienti- ja poisto-operaatiot mukana. |
| Uusinta yritystä tallennuksessa; saman reseptin muokkaus | Ei tuplatallennusta; uusi versio ei muuta aiempaa ruokapäiväkirjaa. |
| “Ehdota julkaisuun” ilman vastaavaa julkista/pending-reseptiä | Läpäisee alkuportin mutta jää `OWNER_REVIEW_PENDING` -tilaan; ei PR:ää tai julkaisua ennen omistajan päätöstä. |
| Täsmälleen sama tai olennaisesti sama resepti kuin kirjastossa | `MATERIAL_DUPLICATE`; ei toimitukselliseen normaalijonoon; käyttäjälle linkki julkiseen vastineeseen ja mahdollisuus muokata tai perustella ero. |
| Vain vähän muuttunut otsikko/mauste/annoskoko | Ei kierrä duplikaattiporttia; kerrotaan merkityksellinen vertailuperuste. |
| Saman ruokalajin merkittävästi eri pohja / menetelmä | Erottuva ehdotus voi läpäistä portin; esimerkkejä Margherita, Pofiber ja raejuustopizza. |
| Osuma vain toisen käyttäjän käsittelyssä olevaan ehdotukseen | Ei vuoda muiden ehdotustekstejä tai omistajatietoja; pidetään alkuportissa ilman automaattista julkaisua. |
| Epävarma / epäonnistunut vertailu | Ei automaattista läpäisyä; tarkennus tai omistajan dokumentoitu poikkeustarkistus. |
| Omistaja hylkää tai pyytää muutoksia | Ehdotus ei etene julkaisuun; hylkäysviesti on neutraali ilman julkisia perusteluja, yksityinen resepti säilyy. Päätös ja versio kirjataan toimituksen sisäisesti. |
| Omistaja hyväksyy jatkovalmisteluun | Toimituksellinen draft ja mahdollinen erillinen GitHub-PR; ei itsestään mergeä eikä deployta. |

## Suorituskyky, kustannukset ja hyöty

T0:ssa käytetään synteettisiä fixturejä ja olemassa olevia kehitysvälineitä. Ei avata pilvipalvelua, tekoälylaskutuskanavaa, automaattista crawleria tai kirjautumisjärjestelmää tämän suunnitelman perusteella. T2:n kustannusmalliin sisältyvät nouto, jäsentely, mahdollinen maksullinen AI, rajoitus-/virhekäsittely ja väärinkäyttöriski; hinnan, kiintiön ja Free/Plus-rajan päätös tehdään havaittujen kustannusten pohjalta.

Mitataan vaiheittain: valmistuiko resepti ilman tukea, paljonko määrien korjauksia tarvittiin, kuinka moni linkki epäonnistui, laskennallisesti tuntemattomien ainesten osuus, duplikaattitallennukset, pilottikäyttäjän ymmärrys sekä todellinen euro-/työkustannus per tuonti. Mitään onnistumisprosenttia ei väitetä tässä mitatuksi.

## Työjako ja julkaisurajat

- **Tämä PR:** vain suunnitelmadokumentti, ei sovelluskoodia eikä muita reseptejä.
- **Seuraava erillinen PR T0:** synteettinen parserisopimus, esimerkkisyötteet ja käyttäjän korjausnäkymä; rajatut testit, ei verkkoa eikä yksityistä tallennusta.
- **T1:** vasta hyväksyttyjen P2/P3-porttien jälkeen käyttäjän yksityiset reseptit oikealla omistajuudella.
- **T2/T3/T4:** omat toiminnalliset ja oikeudelliset päätösportit; ei automaattista tulkintaa tai julkaisua.
- **Rinnakkaishaarat:** PR #293 (julkinen hero), #294 (raejuustopizza), GK100:n muut PR:t sekä Cloudflare/SEO-työt saavat säilyttää tiedostot, lähteet ja omistajuuden. Tämä dokumentti ei muuta niiden CI:tä tai tuotantodataa.

**Ei tässä PR:ssä:** käyttäjälomaketta tuotantoon, ulkoista URL-noutoa, tietokantaa, kirjautumista, käyttäjädataa, ravintolaskennan muutoksia, GK:n hyväksyntää, muutoksia julkiseen sisällöntuotantoon, mergeä eikä deployta.

**Valmis kun:** työnkulut, tietomalliluonnos, yksityinen/julkinen raja, **samankaltaisuusportti ja omistajan kaksivaiheinen hyväksyntä**, riskit, testit ja vaiheistus ovat katselmoitavissa, ja T0-toteutus voidaan antaa omana rajattuna työpakettinaan.

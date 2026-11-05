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
| T4: vapaaehtoinen julkaisuehdotus | Erillinen “Ehdota reseptiä julkiseen kirjastoon” -toiminto, toimituksellinen jono ja valvottu GitHub-vienti. | Sisällön moderointi, käyttöoikeus- ja julkaisuprosessi; erillinen hyväksyntä. | Ei käyttäjätietojen vuotoa eikä automaattista merge/deployta. |

T0 voidaan suunnitella nykyisen julkisen sivuston rinnalla; **T1–T4 eivät kuulu P1–P3:n tämänhetkiseen minimilaajuuteen** eikä niiden toiminnallisuutta pidä luvata ennen erillisiä päätöksiä.

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
| “Ehdota julkaisuun” -toiminto | Ei anna julkista PR:ää tai deployta ilman toimituksellista hyväksyntää. |

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

**Valmis kun:** työnkulut, tietomalliluonnos, yksityinen/julkinen raja, riskit, testit ja vaiheistus ovat katselmoitavissa, ja T0-toteutus voidaan antaa omana rajattuna työpakettinaan.

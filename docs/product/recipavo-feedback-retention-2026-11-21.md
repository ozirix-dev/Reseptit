# Recipavo – yksityisen palautteen säilytys ja automaattinen poisto

Päiväys: 21.11.2026. Tila: DRAFT / toteutettu vain koodiin. **Ei tuotantoon asennettua ajastusta eikä tietosuojapäätöstä.**

## Päätösehdotus

- Palautteet, mukaan lukien vapaaehtoinen sähköposti, poistetaan automaattisessa ajossa, kun vastaanottohetkestä on yli **30 päivää**. Kerran vuorokaudessa ajastettuna tämä tarkoittaa käytännössä noin 30–31 päivän säilytystä häiriöttömässä ajossa.
- Poisto koskee myös HOLD- ja keskeneräisessä käsittelyssä olevia viestejä. Ylläpito käsittelee poikkeukset ennen aikarajaa, mutta tekstiä tai henkilötietoja ei kopioida julkisiin GitHub-issueihin.
- Palautteen viitetunnus ei ole salasana eikä yleisölle avattava lukulupa. Admin voi poistaa yksittäisen rivin viitetunnuksella yksityisessä D1-hallinnassa.
- Käyttäjän GDPR-oikeudet ja rekisterinpitäjän lopullinen säilytyspäätös hyväksytään **erikseen** ennen ensimmäisen oikean viestin tallentamista. Koodin olemassaolo ei ole oikeudellinen arvio.

## Mikä toteutettiin

1. site/migrations/0002_feedback_retention.sql lisää yhden rivin ylläpitotilataulun. Migraatio ei luo väärennettyä onnistumismerkintää.
2. site/workers/feedback-retention.ts on **erillisen Cloudflare Workerin Scheduled Handler**, jolla ei ole HTTP fetch -reittiä. Vain kun FEEDBACK_RETENTION_ENABLED=true ja oikea FEEDBACK_DB-binding on asennettu, se suorittaa parametrisoidun DELETE-kyselyn (received_at <= UTC-aikaleima - 30 vrk).
3. Vasta onnistuneen poiston jälkeen Worker päivittää feedback_maintenance-taulun onnistumisaikaleiman. Epäonnistunut poisto ei päivitä sitä. Myöhästyneet ajot eivät saa siirtää onnistumisaikaa taaksepäin.
4. site/functions/api/feedback.ts tarkistaa ennen ulkoista Turnstile Siteverify -kutsua, että onnistunut siivous on kirjattu viimeisten 48 tunnin sisällä. Puuttuva, vanha, virheellinen tai selvästi tulevaisuuteen päivätty merkintä palauttaa HTTP 503 eikä mitään tallenneta.
5. Testit varmistavat aikarajan, poistokyselyn suoritusjärjestyksen, puuttuvan onnistumisen, myöhäisen ajon sekä vastaanoton fail-closed-käytöksen.

**Rajoitus:** Siivousketju ei teknisesti takaa kaikkien vanhojen rivien välitöntä poistumista, jos Cron-laukaisu jää tekemättä. Kun viimeinen onnistuminen vanhenee yli 48 tunnin, uusi vastaanotto sulkeutuu mutta aikaisemmat rivit pysyvät kunnes siivous taas onnistuu. Seuraa ajon onnistumista ja ylläpidä manuaalista poisto-/häiriömenettelyä.

## Ehdotettu asennusjärjestys (ei suoritettu)

- Hyväksy 30 päivän politiikka, käsittelijät ja tietosuojaselosteen lopulliset FI/EN/SV/TH-muodot. Päätä myös mahdollisten anonymisoitujen korjaustehtävien erillinen käsittely.
- Perusta yksityinen D1 ja ota käyttöön migraatiot 0001_feedback.sql ja 0002_feedback_retention.sql. Ylläpidon SQL- ja poisto-oikeudet vain vähimmäisille henkilöille/rooleille. Ei viestien lokitusta GitHub CI:hin.
- Asenna **erillinen Cloudflare Worker** tiedostosta site/workers/feedback-retention.ts. Sido siihen sama yksityinen FEEDBACK_DB ja ympäristömuuttuja FEEDBACK_RETENTION_ENABLED=true. Määritä yksi päivittäinen UTC Cron Trigger, esimerkiksi 0 3 * * *. Tämä ei ole Pages Function, eikä tiedoston lisääminen GitHubiin aktivoi Cronia.
- Varmista previewssä synteettisillä D1-riveillä aikarajan molemmat puolet, että Worker poistaa vain vanhentuneet ja päivittää feedback_maintenance-last_success_at-arvon. Tarkista myös epäonnistunut poisto.
- **Vasta ensimmäisen todellisen onnistuneen siivousajon jälkeen** varmennetaan vastaanotto: ilman tuoretta heartbeat-merkintää API vastaa 503, tuoreella siivouksella sekä hyväksytyllä Turnstilellä tallennus onnistuu. Älä luo heartbeat-riviä käsin ohittaaksesi siivousta.
- Varmista hälytys siivouksen epäonnistuessa, WAF/rate limit, tietosuoja- ja poistopyyntöjen menettely sekä erilliset preview-/production-bindingit. Vasta omistajan hyväksynnällä avaa backend- ja frontend-feature-flagit ja tee erillinen Cloudflare-tuotantojulkaisu.

## Ylläpitäjän yksityinen huolto

Seuraavat SQL-esimerkit ovat vain yksityisen D1:n ylläpitäjälle, eivät selaimen käyttäjälle eivätkä avoimeen API:in.

Tarkistus ilman viestien sisältöä:

    SELECT last_success_at FROM feedback_maintenance WHERE singleton = 1;
    SELECT count(*) AS expired_rows
      FROM feedback_submissions
      WHERE received_at <= ?;

Yksittäisen rivin poisto vahvistetun tietosuojapyynnön jälkeen:

    DELETE FROM feedback_submissions WHERE reference = ?;

Henkilö- tai viestitietoja ei tulosteta CI-/Worker-lokeihin. Kanta, sen varmuuskopiot ja muissa järjestelmissä säilyvät käsittelymerkinnät vaativat omat poistomenettelynsä ennen tuotantoa. Älä korvaa vanhentunutta siivouksen onnistumismerkintää käsin testien ohittamiseksi.

## Toimitusraja

Koodissa ei ole Cloudflare-tilin asetusten muutoksia, ajastuksen automaattista perustamista, D1-resurssin luontia, todellisia henkilötietoja, julkista admin-lukureittiä, AI-käsittelyä tai reseptijulkaisua. PR #780 pysyy Draftina ja oletuksena pois käytöstä.

Lähteet: [Cloudflare Scheduled Handler](https://developers.cloudflare.com/workers/runtime-apis/handlers/scheduled/), [Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/), [D1 Prepared Statement Methods](https://developers.cloudflare.com/d1/worker-api/prepared-statements/).

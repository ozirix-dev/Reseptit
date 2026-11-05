# Kaksi GK-julkaisulinjaa ja kolmas tutkimuslaskennan taso

## 1. Miksi ei vaadita 300 koepaistoa tai 300 ihmis-GI-mittausta?

GI mitataan ihmisillä tietyllä ruoka-aineella ja valmistusmenetelmällä (ISO 26642). Reseptin GK taas on useimmiten **laskennallinen**: laskennassa yhdistetään annoksen soveltuva saatava hiilihydraatti ja kyseisen ruoan tai valmistetun komponentin GI. Tutkimuskirjallisuus käyttää komponenttien GI-painotusta seka-aterioille, mutta yhdistelmäaterian yksilöllinen fysiologinen vaste ei ole tällä kaavalla mitattu tai ennustettu. Lähteet READMEssä.

Käytännössä yksittäisen tutkimuksen GI-luku voidaan soveltaa vasta kun kohderuoan identiteetti, partikkelikoko, valmistus (paisto, jäähdytys, fermentointi), tuote ja GI-asteikko on arvioitu. Kaurahiutalepuuron arvo ei ole kaurajauhopizzan mitattu GI. Myös raejuusto, kastike ja täyte ovat reseptin CHO-taseessa; niitä ei merkitä automaattisesti GI 0:ksi.

## 2. Julkiset laatutasot

| Taso | Sisäinen lähde-/laskentaluokka | Julkinen käyttö | GK80/GK100-kattavuus |
| --- | --- | --- | --- |
| A: nykyinen lähteistetty GK | nykyinen CALCULATED / omistajan hyväksymä versiona | Nykyinen GK ja mahdollinen hyväksytty GK-only-variantti muuttumattomana | Vain nykyisten sääntöjen mukaisesti |
| B: mallinnettu GK-arvio, tuleva | MODELLED_ESTIMATE / OWNER_AUTHORIZED; oma menetelmäversio | 'Arvioitu GK noin X / annos' tai 'Arvioitu GK X–Y', oletukset ja lähteet näkyville | **Ei koskaan** kasvata nykyistä hyväksyttyä GK-laskuria |
| C: herkkyyskoe | WHAT_IF_ONLY / INTERNAL, voi sisältää mielivaltaisia eksplisiittisiä GI-oletuksia | Vain kehittäjän raportti tai käyttäjän vapaaehtoinen 'mitä jos' -työkalu; ei reseptin GK-tieto | Ei koskaan |

Taso B ei alenna A-tason ehtoja eikä saa käyttää A-tason status-, luottamus- tai julkaisukenttiä. 'Lähteistetty GK' on nykyisen projektin laskennallinen tulos, EI väite siitä, että koko reseptille on tehty laboratoriomittaus.

## 3. GI-näytön hierarkia ja reuse

1. **Sama valmistettu kohderuoka:** laadukas ihmis-GI, yksilöidyt valmistus-/tuotetiedot; tarkista glukoosi=100, tutkimuksen laatu ja lisenssi.
2. **Rajattu lähivastine:** ihmis-GI samankaltaiselle valmisteelle; kirjataan nimenomaisesti erot, valmistuksen vaikutus ja soveltuvuuspäätös. Ei kutsuta suoraksi mittaukseksi.
3. **Kerran katselmoitu koodaus:** nimetty 'food + preparation + source + policy' -sidos; B-tasolla vain erillisen hyväksytyn version ja soveltamisalan puitteissa; ei vapaata geneeristä 'kaikki kasvikset GI 50' -sääntöä.
4. **Tarkastellut vaihtoehdot:** samasta valmistusperheestä ja kohteesta perustellusti johdetut skenaariot; jokaisella GI-lähde ja CHO-perusta. Min/max ovat **nimettyjen vaihtoehtojen** tuloksia, eivät luottamusväli.
5. **Tuntematon:** arvo puuttuu, tarvitaan lähdetyö, koostumustarkennus tai rajattu yksityinen herkkyyskoe. Tuntemattomasta ei tule nollaa tai automaattista 50:tä.

Katalogin hakutulos ≠ soveltuvuushyväksyntä. Yksi hyväksytty GI-havainto voi saada useita erikseen rajattuja soveltuvuuksia. Lähde-/soveltuvuussidos voi siirtyä reseptiin vain kun soveltuvuusavaimet täsmäävät; annos ja reseptiversio lasketaan aina uudelleen.

## 4. Vähimmäisvaatimukset julkiselle B-arviolle

- Annoskoko, syötävät määrät, raaka-/kuivapaino, tuotemerkit, valmistus ja pois jäävät osat on ratkaistu tai rajattu lähteistetysti. Käytetään kanonista FI-reseptiä; käännöksiä ei lasketa erikseen.
- CHO-komponentin semantiikka yksiselitteinen (sokerit+tärkkelys, kuitu ja polyolit, lähdekohtainen määritelmä), eikä samaa hiilihydraattia lasketa kahdesti. Polyolilajit ja epävarmuus käsitellään erikseen; ei yleistä GI 0 -sääntöä.
- Jokainen **olennainen** GI-termi saa hyväksytyn suoran havainnon, rajatun GI-vastineen tai koodisidoksen. Mallin sallittavan poisjätön vaikutusrajat päätetään omana menetelmäpäätöksenä; ennen sitä **yksikin positiivinen ratkaisematon osuus estää julkisen B-kokonaisluvun**. Vanhoja alle 1 g / alle 2 g / 0,50 GK / 10 % -rajoja ei kopioida hiljaisesti B:hen.
- Nimetty valmistettu komponentti ja sen ainesosat ovat poissulkevia GK-termejä. Skenaarioiden jokainen päätepiste kuvaa kokonaista samaa annosta samalla rajauksella; ei yhdistetä eri tuotteiden irrallisia min/max-lukuja mahdottomaksi yhdistelmäksi.
- Piste perustuu määriteltyyn ensisijaiseen valintaan, ei vaihtoehtojen keskiarvoon ilman erillistä perustetta. Avoin vaihtoehtojen joukko ei tuota tilastollista luottamusväliä.
- Julkaisuportti hyväksyy lähdemetadatan, valmistuksen soveltuvuuden, syötehashin, laskentakaavan, matemaattisen tarkistuksen, FI/EN/SV/TH-tekstin ja päätöksen. B ei saa julkaista A:n luottamusluokkaa HIGH/MEDIUM/LOW sellaisenaan.

## 5. Tulos- ja arviointitilat

- MODEL_POINT_REVIEWABLE: laskettu koko annoksen piste hyväksytyillä GI-sidoksilla, mutta ei julkaisulupaa.
- MODEL_SCENARIOS_REVIEWABLE: nimettyjen täydellisten skenaarioiden joukko, ei epämääräistä '+/- 20 %' väliä.
- PARTIAL_KNOWN: vain osasumma; julkinen kokoannoksen GK **null**.
- NEEDS_CLARIFICATION: tunnettu vaikuttava massa tai tuotteen tila epäselvä; tarvittaessa yksi kysymys kerrallaan.
- GI_APPLICABILITY_REVIEW: vertailu löytyy mutta ei soveltuvuuspäätöstä.
- RESEARCH_REQUIRED: olennainen GI/CHO puuttuu; tutkimusjono, ei keinotekoista GK:ta.
- WHAT_IF_ONLY: oletuksia kokeileva arvo, ei julkaistava arvio.
- STALE_INPUT: aiemmin sidottu resepti, koostumus tai soveltuvuus on muuttunut. Arvio palautetaan HOLDiin, kunnes sidokset tarkistetaan.
- INVALID: negatiivinen tai ääretön massa, päällekkäinen komponentti, virheellinen CHO-määritelmä tai rakenteellisesti rikkinäinen lähdesidos.

Laskentatila ja julkaisutila ovat **eri ulottuvuuksia**. MODEL_POINT_REVIEWABLE ei ole automaattisesti PUBLIC_MODEL_APPROVED.

## 6. Riskien käsittely ja raja-arvot

Julkista 'matala GK' -luokkaa tai suodatinta ei anneta mallinnetusta arvosta V1:ssä. Vasta myöhemmin harkitaan erillistä arviofiltteriä, jos kaikkien hyväksyttyjen skenaarioiden mahdolliset luokat ovat samat, luokitus on määritelty ja lähteet todella kattavat relevantin vaihtelun. Pelkkä GI 0/100 -stressi ei ole biologinen ala-/yläraja (GI voi myös ylittää 100).

Laatua ei ilmaista tekaistuna prosentuaalisena varmuutena. Erota toisistaan: evidenssitaso, mallin kattavuus prosentteina CHO:sta, malliosuuden dominanssi, lähivastineiden määrä, valmisteriskit, herkkyysluokan rajanylitykset ja arvioijan päätös.

## 7. Omistajan menetelmäpäätös (ei tehty tässä PR:ssä)

Ennen B-tason julkista tuotantoa hyväksytään erikseen: sallittujen lähivastineiden/koodien laajuus, mahdollisen poisjätön absoluuttiset ja suhteelliset rajat, onko B-arvioille sallittu luokittelu, julkinen sanamuoto, vähimmäisreview, variantti- ja jäljitettävyysvaatimukset, validointi vähintään pilottijoukolla sekä tuotantoonviennin peruuttamismenettely. Menetelmäversion on oltava uusi ja yksilöity, ei A-polun hiljainen sääntömuutos.

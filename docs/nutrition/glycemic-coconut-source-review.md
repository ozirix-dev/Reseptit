# AJO 0.5 – kookosmaitopuuron GI-sidonnan korjaus

Tarkistus 2026-10-28. Hyväksytty lähtökohta on main
`cd9a6f4f740b31dc8b52c6c09cc1574cb7a89950`. Suunnittelu-PR
[#123](https://github.com/ozirix-dev/Reseptit/pull/123) oli avoin Draft eikä
sitä ollut yhdistetty. Tämä korjaus on erillisessä haarassa.

## Alkuperäislähteen tulkinta ja saatavuus

Senadheera ja Ekanayake: *Green leafy porridges: how good are they in
controlling glycaemic response?*, International Journal of Food Sciences and
Nutrition 64(2), 169–174 (2013), julkaistu verkossa 31.7.2012.
[Alkuperäinen tiivistelmä, PMID 22849311](https://pubmed.ncbi.nlm.nih.gov/22849311/),
[kustantajan julkaisu, DOI 10.3109/09637486.2012.710895](https://www.tandfonline.com/doi/abs/10.3109/09637486.2012.710895).

Tutkimus käsittelee riisistä, kookosmaidosta ja lehtiuutteista valmistettuja
puuroja. Kontrolliruokia ovat riisipuuro ja kookosmaitopuuro. GI 31 ± 5
kuvaa jälkimmäistä sekaruokaa. Riisi on puurojen pääasiallinen
hiilihydraattilähde. Tiivistelmän lyhyt ilmaus kookosmaidon GI:stä on luettava
puurokokeen asiayhteydessä. Näyttö ei oikeuta siirtämään arvoa yksittäiselle
kookosmaidolle eikä riisiä sisältämättömille curryille tai keitoille.

Alkuperäinen tiivistelmä tarkistettiin. Kustantajan kokoteksti ja menetelmätaulukot
eivät olleet saatavilla tässä tarkistuksessa. Siksi tarkkaa riisilajiketta,
ainesuhdetta, kypsennysaikaa tai annoksen valmistusprotokollaa ei väitetä
alkuperäisjulkaisusta varmennetuksi. Tiivistelmässä ei raportoida erillistä
puhtaan kookosmaidon mittausta. Sellaiselle ei löytynyt hyväksyttävää näyttöä;
koko artikkelin kaikkien koehaarojen puuttumista ei väitetä varmennetuksi.
Tämä saatavuusraja ei anna perustetta säilyttää nykyistä ainesosasidontaa.

Katalogissa oli myös väärä julkaisun otsikko (*Glycemic index values of
traditional South Indian foods*). Otsikko, tekijät ja vuosiviite korjattiin.
GI 31, lähde-URL ja SUPPLEMENTARY-laatuluokka säilyvät. Aiempi osallistujamäärä
10 säilyy lähdemetadatana, mutta sitä ei varmennettu alkuperäisistä menetelmistä.

## Kaikki aktiiviset käyttäjät

Koko versionhallittu repo käytiin läpi tietue-ID:llä, ruokaperheellä,
valmistusavaimella, PubMed-tunnuksella ja DOI:lla. Sekä suora `giRecordId`
-haku että ruokaperhe-/valmistusavainhaku palauttivat samat neljä syötettä.
Katalogissa ei ole samalla lähteellä toista GI-tietuetta. Alias-tiedosto tai
laskentakoodi ei lisää muita käyttäjiä. Historiallisten inventaarioiden osumat
ovat näiden sidontojen tallennettuja kopioita, eivät uusia aktiivisia syötteitä.
Kaikkien hakutulostiedostojen luettelo on
[koneluettavassa tarkistusraportissa](glycemic-coconut-source-review.json).

Kaikissa neljässä kookosmaitoa on 400 g / 4 annosta. Koostumuslähteen
imeytyvä hiilihydraatti on 2,81 g / 100 g, joten osuus on **2,81 g/annos**.
Aiempi kookosmaito-osuuden GK-lisä oli 0,8711. Se poistuu laskennasta;
puuttuvaa GI:tä ei korvata nollalla eikä annoksen muulla osasummalla.

| Resepti | GK ennen → jälkeen | Ravintoarvotietue | Muut ennestään olleet estot |
| --- | --- | --- | --- |
| `keltainen-kanacurry-vhh` | CALCULATED 3,48 → INSUFFICIENT SOURCE DATA / null | `fineli-29014-2026-10-24` | Ei muita estäviä puutteita nykyisessä mallissa |
| `khao-soi-vhh-konjac` | INSUFFICIENT SOURCE DATA / null → sama | `fineli-29014-2026-10-24` | Kanaliemen GI-vastaavuus |
| `massaman-curry-kanalla-vhh` | INSUFFICIENT SOURCE DATA / null → sama | `fineli-29014-2026-10-24` | Nauriin GI-vastaavuus |
| `tom-kha-gai-vhh` | INSUFFICIENT SOURCE DATA / null → sama | `fineli-29014-2026-10-25` | Kanaliemen GI-vastaavuus sekä sitruunaruohon määrä/koostumus/imeytyvä osuus |

Molemmat koostumustietueet kuvaavat Fineli 29014:n tuotetta
**KOOKOSMAITO, KOOKOSJUOMA**. Koostumuksia ei muutettu. Kaikissa vanha
valmistussidonta oli `rice-porridge-with-coconut-milk`, vaikka laskettava
ainesosa oli kookosmaito. Nykyinen ainesosavalmistusavain on
`coconut-milk-cooked-in-recipe`, `foodKey` edelleen `coconut-milk` ja
`giRecordId` null. Puuttuvan GI:n perustelu kertoo hylätyn puuroanalogian.
Jo olemassa olevasta katalogista ei löytynyt hyväksyttyä vaihtoehtoa.

## Toteutettu suoja

- Puurotietueen ruokaperhe on nyt `rice-porridge-with-coconut-milk`, ei
  `coconut-milk`. Mitatun ruoan kuvaus kertoo kyseessä olevan seka-ateria.
- `calculationUse: REFERENCE_ONLY` säilyttää tutkimuksen katalogissa mutta
  estää sen käytön ainesosapohjaisessa laskennassa myös silloin, jos syöte
  kopioi puurotietueen avaimet. Tietuetta ei tarjota laskentaehdokkaaksi.
- Neljä väärää sidontaa poistettiin. Reseptien sisältö, massat ja tavalliset
  ravintoarvot säilyvät. Suuren 2,81 g osuuden puuttuva GI estää laskennan.
- Laskentakäytön rajoitus sisältyy lähdefingerprintiin. Vain neljän tarkistetun
  reseptin syöte- ja lähdesidonnat uusittiin. Muut sormenjäljet eivät muuttuneet.
- Testi hylkää tietueen sekä vanhoilla että kopioiduilla puuroavaimilla ja
  myös alle 1 g hiilihydraattiosuudella, kun virheellinen GI on annettu.
  Puuttuvan GI:n nykyisiä pienosuussääntöjä ei muutettu.
- Regressio laskee uudelleen kaikki ennen korjausta lasketut reseptit,
  vertaa myös pyöristämättömiä arvoja ja vaihteluvälejä sekä sallii vain
  nimetyn keltaisen curryn perustellun poistumisen. Nykykattavuuden odotusta
  ei kovakoodata reseptimääräksi. Historiallisten snapshotien vanhat
  lukumääräassertiot säilyvät historiallisina tarkistuksina.

## Ennen/jälkeen ja inventaariot

| Mittari | Ennen | Jälkeen |
| --- | --- | --- |
| Reseptit | 326 | 326 |
| Laskettu GK | 138 | 137 |
| Keskeneräinen GK | 188 | 189 |
| GI-katalogin tietueet | 45 | 45 (yksi nyt vain viitetieto) |
| Reseptirakenteen fingerprint-poikkeamat | 38 | 38 |
| Syötefingerprint-poikkeamat | 0 | 0 |
| Lähdefingerprint-poikkeamat | 0 | 0 |

Keltaisen curryn tarkka aiempi arvo 3,4766 (raportissa 3,48,
reseptikortin yhden merkitsevän numeron näyttö 3) palautuu nulliksi.
Muut 137 aiemmin laskettua arvoa, niiden pyöristämättömät tulokset ja
vaihteluvälit ovat ennallaan. Kaikki 322 vaikutusalueen ulkopuolista
kokonaista tulosriviä ovat myös ennallaan. Kolmen jo keskeneräisen reseptin
vanhat estot säilyvät ja kookosmaidon puuttuva GI lisätään niiden rinnalle.

Yleinen nykyinventaario ja 2B6D-nykyinventaario generoitiin samasta tuoreesta
auditoidusta tilasta. Kaikkien rivien tila, GK ja kolme fingerprintiä
verrattiin auditiin. Historiallisia baselineja ja aiempien erien
nykytilasnapshotteja ei kirjoitettu uudelleen. Baseline-tiedostojen paikalliset
ennen/jälkeen-SHA-256:t ovat yhtenevät; lähtöhashit tallennettiin raporttiin.
Historiallinen 2B6D-baseline säilyttää 136 silloista arvoa, myös vanhan curryn,
mutta nykyinventaario näyttää lähdekorjauksen aiheuttaman poistumisen.

Ravintoarvoauditin kaikki rivit säilyvät: 180 ESTIMATE WITH EVIDENCE,
86 INSUFFICIENT SOURCE DATA, 60 MISSING ja 0 CONFLICT REQUIRES REVIEW.
Kattavuuden lasku on lähdeluottamuksen korjaus.

## Tarkistukset ja kirjoituskohteet

Repo_guard tarkisti `ozirix-dev/Reseptit`-identiteetin omassa työpuussa.
Versionhallittujen tiedostojen kaikki kirjoitukset tehtiin guardin kautta
nykyisen SHA-256:n tarkistuksella. Generointi tarkistettiin ennen ajoa:
content/build kirjoittavat tämän työpuun ohitettuihin `site/src/generated`,
`site/public` ja `site/dist` -kohteisiin, auditit `tmp/nutrition`-hakemistoon.
Kattavuusauditin neljä versionhallittua raporttikohdetta ohjattiin väliaikaisella
Node-preloadilla `D:/Temp/coconut-gi-fix`-hakemistoon. Vain nämä neljä nimettyä
raporttia sallittiin, ja tulokset vietiin repoon guardilla. Baselinejen
capture-valintoja ei käytetty. CI ajaa normaalin generoinnin omassa checkoutissaan.

Paikallisesti läpäisseet tarkistukset:

- `npm run content:sync` – 683 julkaistua kieliversiota.
- `npm run audit:nutrition -- --strict` – ei ristiriitoja.
- `npm run audit:glycemic-load` – 137 laskettua / 189 keskeneräistä.
- `npm run audit:glycemic-coverage` sekä 2B6D-baselinevertailu.
- `npm run test:glycemic` – 66/66.
- `npm test` – 136/136.
- `npm run test:select-ci` – 12/12.
- `npm run build` – 691 esirenderöityä reittiä.
- `npm run test:static` – 24/24.

GitHub Actionsin täsmällisen HEADin tarkistuslinkki kuuluu Draft-PR:n
kuvaukseen. Inventaarioiden `sourceCommit` osoittaa korjauksen sisältävään
lähdecommitiin; niitä seuraava raporttien päivitys ei muuta laskentaa.

## Avoimet rajat ja julkaisu

Alkuperäiset täydet menetelmät jäävät varmennettavaksi ennen mahdollista
puurotietueen tulevaa laskentakäyttöä. Kookosmaidon oma hyväksyttävä GI-lähde
puuttuu. Nykyinen 38 rakennesidonnan poikkeaman joukko on ennestään olemassa.
Buildin suuri JavaScript-chunk-varoitus säilyi; build ja staattiset testit
läpäisivät. Muut GI-perheet ja aiemmin havaitut erilliset lähdeongelmat eivät
kuulu tähän korjaukseen.

Tämä on katselmoitava Draft-PR. Mainia tai tuotantoa ei muutettu eikä
julkaistu: vanha julkinen curry-arvo säilyy tuotannossa siihen asti, että
korjaus on erikseen hyväksytty ja julkaistu. AJO 0:n suunnittelua ei muutettu,
eikä 2B6E-erää aloitettu.

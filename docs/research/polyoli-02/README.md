# POLYOLI-02 — neljän maustereseptin lähdejatkotyö ja nakkikeiton sidostarkistus

**1.11.2026 — päätös PARTIAL.** Hyväksytty lähde- ja sidostyö on tehty.
Kaksi kuivattua meiramia käyttävää reseptiä saa täsmällisen lähdevaihtoehdon,
ja nakkikeiton seitsemän puuttuvaa katalogisidosta on yksilöity ja testattu.
**Kaikki viisi jäävät julkaisu-HOLDiin:** täydellistä uutta polyolitietoa ei
löytynyt. Yleistä polyoliohitusta tai uutta hyväksymiskynnystä ei toteutettu.

## Toimeksianto ja eristys

Omistaja hyväksyi lähdekohtaisen jatkotyön neljälle maustereseptille sekä
nakkikeiton sidostarkistuksen ja yhden main-pohjaisen Draft-PR:n.
Tulokset tuodaan hyväksyttäväksi; ei mergeä tai deployta.

Täsmällinen rajaus:

1. `jauheliha-kaalikeitto-vhh` — kuivattu meirami0,6 g /6 annosta.
2. `vhh-kaalilaatikko` — kuivattu meirami0,6 g /6 annosta.
3. `ropa-vieja` — jauhettu kokonaan syötävä laakeri0,2 g /6 annosta.
4. `siskonmakkarakeitto-juurekset` — sama laakerimuoto0,2 g /4 annosta.
5. `nakkikeitto-kukkakaalilla` — sidostarkistus ja laakeripuute erikseen.

Repo guard PASS: `ozirix-dev/Reseptit`, origin
`https://github.com/ozirix-dev/Reseptit.git`.
Uusi worktree `D:/Projects/tmp/reseptit-gk80-polyol-source-followup`,
haara `codex/gk80-polyol-source-followup`, pohjana etä-main
`5761afa069ea54c9d510f1cb3c1086ae7d42f998`.
Vanhaa [POLYOLI-01-Draftia #154](https://github.com/ozirix-dev/Reseptit/pull/154)
ei yhdistetty, muutettu tai pinottu tämän alle. Sen raportti on taustaa;
tämän työn baseline ja lähdehaut tehtiin uudelleen.

Rinnakkainen chat **Paranna Reseptit GK -laatua** oli aktiivinen;
sen worktree `reseptit-gk80-run9` ja Draft #153 jätettiin koskemattomiksi.
Erityisesti sen ruokakatalogimuutoksia ei kopioitu tähän työhön.
Asetusten oletus Sol/High varmistettiin; aktiivisen chatin mallivalintaa
ei ole saatavassa istuntometadatassa eikä asetusten lukua väitetä sen todisteeksi.

Pages luettiin uudelleen HTTP200: **130/326 numeerista**,196 keskeneräistä,
1.11.2026 klo13.20 Suomen aikaa. HTML-SHA256
`614c99774367a1d203e634fe87bc0a995159858f61ff16a16c8965cf4d6cef06`.
[Tuotannon menetelmäsivu](https://ozirix-dev.github.io/Reseptit/glykeeminen-kuorma/).

## 1. Mitä uusi lähdehaku ratkaisi

Ensisijaiset aineistot, kenttien tilat ja hakujen hashit ovat
[source-evidence.json](source-evidence.json). Raakaverkkodokumentit jäivät
scratch-tilaan; vain rajatut faktaotteet ovat tässä paketissa.

### Norjan raakadata: tuntematon polyoli on nyt osoitettu suoraan

[Matvaretabellen API](https://www.matvaretabellen.no/en/api/) tarjoaa
foods-, nutrients- ja sources-aineistot. API ei ole versioitu, joten
snapshot sidottiin haun aikaan ja SHA256:een. Vain kahden kuivatun mausteen
tietueet tutkittiin; koko saatavissa oleva katalogi ladattiin, koska
elintarviketiedot tarjotaan yhtenä endpointina.

| Kenttä /100 g syötävää | Meirami06.186 | Laakeri06.177 |
| --- | --- | --- |
| CHO (`Karbo`, MI0181) | 20,3 g | 48,6 g |
| Sokerisumma (`Mono+Di`, MI_SUGAR_NO) | 4,1 g | 48,6 g |
| Tärkkelys (`Stivel`,331) | 16,2 g | 0 g |
| Kuitu | 40 g | 26 g |
| Proteiini | 12,7 g | 7,6 g |
| Rasva | 7 g | 8,4 g |
| `POLYL` | määrä puuttuu, lähde10 | määrä puuttuu, lähde10 |
| `CHOCAL` / `CHOCALOH` | määrä puuttuu | määrä puuttuu |
| Sorbitoli, mannitoli, ksylitoli, laktitoli, isomalti | määrä puuttuu | määrä puuttuu |
| `Alko` | lähteen arvioitu etanoli0 | lähteen arvioitu etanoli0 |

Lähde10:n kuvaus on “Missing value, content not known.” Tämä ratkaisee
aiemman epäselvyyden: puuttuva polyolirivi ei ollut vain sivuston puuttuva
esityskenttä. **Polyolitieto puuttuu myös ensisijaisesta tietueesta.**
Etanoli0 ei täydennä sitä.

MI0181 tarkoittaa lähteen ilmoittamaa sokeri+tärkkelys-summaa. Tämän perusteella
meiramin CHO20,3 voidaan ottaa **lähdekohtaiseksi tutkimusvaihtoehdoksi**, jossa
kuitua tai polyolia ei vähennetä samasta CHO:sta uudelleen. Se ei osoita
polyolin määrää eikä sivuston kokonais-CHO:ta. Myös meiramin sokerisumman
taustalla olevat yksittäiset sokerit ovat API:ssa tuntemattomia: summan
provenienssia ei pidetä uutena itsenäisesti toistettuna analyysinä.

Tietue on oikeasti
[kuivattu Origanum majorana](https://www.matvaretabellen.no/en/marjoram-dried/),
ei AFCD:n tuore meirami. Kaikki neljä makrokomponenttia otetaan yhdestä
tietueesta; USDA:n kuitua tai rasvaa ei yhdistetä Norjan CHO:hon.
Myös vesi on johdettu erotuksella. Näennäisesti sulkeutuva massatase ei
todista polyoleja nollaksi.

### Laakerin lähdevaihtoa ei vielä hyväksytä

[Laakerin06.177](https://www.matvaretabellen.no/en/bay-leaf-dried/) API:ssa
sokeri48,6 on merkitty johdetuksi summaksi, mutta sen kaikki viisi
määritelmässä lueteltua yksittäistä sokeria ovat tuntemattomia. Tärkkelys0:n
lähde331 on Oslon yliopiston Sugar project2021–2024; snapshot ei sisällä
tämän elintarvikkeen mittauspöytäkirjaa, näytekuvausta tai määritysrajaa.
Siksi sokerisumman jakeistusta ei voida tarkistaa julkaistuista komponenteista.
Lähteen ilmoittama yhtälö ei itsessään todista kaikkien lähtöarvojen mittausta.

Vertailu tehtiin alkuperäiseen
[CoFID2021-työkirjaan](https://assets.publishing.service.gov.uk/media/60538b91e90e07527df82ae4/McCance_Widdowsons_Composition_of_Foods_Integrated_Dataset_2021..xlsx),
sheet `1.3 Proximates`, koodeihin13-806 (laakeri) ja13-835 (meirami).
Laakerin CHO48,6 löytyy myös sieltä, mutta kokonaissokeri on **N**,
tärkkelys **Tr**, AOAC-kuitu puuttuu ja polyolisaraketta ei ole.
Tämä ei tue Norjan48,6 gramman tulkitsemista varmennetuksi sokerimääräksi.
Meiramin CoFID-CHO42,5 puolestaan poikkeaa Norjan20,3:sta; lähteitä ei
keskiarvoisteta tai yhdistetä.

[CoFID:n alkuperäinen ohje](https://assets.publishing.service.gov.uk/media/60538e66d3bf7f03249bac58/McCance_and_Widdowsons_Composition_of_Foods_integrated_dataset_2021.pdf),
s.7 ja10–11: N tarkoittaa merkittävää mutta määrältään epäluotettavaa tietoa,
Tr tarkoittaa jälkeä, ja CHO/sokerit/tärkkelys ovat yleensä
monosakkaridiekvivalentteina. Niitä ei siirretä sivuston grammaperusteeseen
ilman erillistä muunnosnäyttöä. Ohje luettiin tekstinä ja sivu10 tarkastettiin
renderöitynä PDF-skillin mukaisesti.

**Päätös:** Norjan laakeria ei vaihdeta nykyisen USDA-proxyn tilalle tässä
Draftissa. Vanhat tutkimusarvot säilyvät vain tutkimusvertailuna; niistä ei
tehdä uusia julkaistavia lukuja. Tämä on ratkaisematon provenance-kysymys,
ei väite siitä, että Norjan tietokannan arvo olisi todistettu virheelliseksi.

### Rajattu vaihtoehtoisten lähteiden tarkistus

- [Meiran meirami](https://meira.fi/tuote/meirami/) ja
  [laakerinlehti](https://meira.fi/tuote/laakerinlehti/) vahvistavat tuotteet
  ja ainesosan, mutta Ravintosisältö/100 g -otsikon alla ei ole tarvittavia
  ravintoarvoja tai polyolimäärää. Tuotteen puhdas ainesosaluettelo ei
  osoita luonnollisia polyoleja nollaksi. Näitä tuotteita ei sidota
  automaattisesti reseptin geneeriseen mausteeseen.
- Ruotsin virallinen2606 tietueen katalogi luettiin kokonaisena ja haettiin
  nimillä `mejram` / `lagerblad`: tarkkaa osumaa ei löytynyt. Geneeristä
  mausteseosta ei käytetä korvaavana lähteenä. Tämä on rajattu nimihaku,
  ei osoitus kaiken ruotsalaisen tutkimustiedon puuttumisesta.
- FRIDA ohjasi uuteen palveluun, jonka varmennettu TLS-yhteys epäonnistui.
  Sen sisältöä ei käytetty eikä yhteyden varmennusta ohitettu.
- Fineli29/7600:n suorat API-luvut palauttivat403. Nakkikeiton sidosten
  tarkistus perustuu siksi mainiin lukittuihin Release20-tietueisiin,
  eikä niitä nimetä tässä uudelleen verkosta varmennetuiksi mittauksiksi.

**Uusia täydellisiä polyolimittauksia:0.** Haku ei ollut koko maailman
koostumuslähteiden auditointi. Lopullinen tietopyyntö on valmisteltu
[source-questions.md](source-questions.md)-tiedostoon; mitään viestiä ei lähetetty.

## 2. Meiramin konkreettinen lähdevaihtoehto

[marjoram-source-proposal.json](marjoram-source-proposal.json) sisältää yhden
uuden, hash-sidotun koostumustietueen vain kahdelle nimetylle reseptille.
`polyolsValue:null` ja `polyolsSourceVerified:false` säilyvät.

GI50 on alkuperäinen nimetty projektioletus, ei uusi ihmisellä mitattu
meiramin GI. Lähdevaihto tarvitsee uuden täsmällisen koostumus-/GI-sidoksen:
[review-results.json](review-results.json) sisältää vain uudelle kuivatulle
meiramitietueelle rajatun GI-lähdevariantin ja katalogiehdotuksen.
Se ei laajenna mitään nykyistä ruokaperhesääntöä. Kaikki jäävät tutkimusdataan,
eivät asennettuun katalogiin tai rekisteriin.

| Resepti | Ehdollinen GK vanhalla koostumuksella | Norjan lähdevaihtoehto | Muutos /annos | Julkaisutila |
| --- | ---: | ---: | ---: | --- |
| Jauheliha-kaalikeitto VHH | 4,588880 | 4,588900 | +0,000020 | HOLD |
| VHH-kaalilaatikko | 3,773396667 | 3,773416667 | +0,000020 | HOLD |

Kummassakin annoskohtaiset muutokset ovat CHO+0,000040 g,
proteiini+0,000040 g, rasva−0,000040 g ja kuitu−0,000300 g.
Koostumusvaihto ei muuta pyöristettyä GK-esitystä tai luokkaa.
Nykyinen normalisoija palauttaa valitulle suoraan available-CHO-lähteelle
`available:20.3`, mutta tuntemattoman polyolin vuoksi `net:null`.
Sivuston kokonais-CHO:ta ei muodosteta nollaoletuksella. Nämä ovat
tutkimusversioiden lukuja; elävät reseptit ja neljä julkaisumakroa eivät muutu.

## 3. Nakkikeiton koko sidostarkistus

Nykyinen `calculateCandidate()` pysähtyy ensimmäisenä F7600-r6-sidokseen.
Koko yhdeksän koostumussidoksen inventaario osoitti **seitsemän** puuttuvaa
aliasriviä, ei vain yhtä. SipulinF335-r6 ja mustapippurinA006618-r6
olemassa olevat sidokset säilyvät.

| Koostumus-ID | Olemassa oleva ruokaidentiteetti | Sallittu alkuperäinen GI-lähde |
| --- | --- | --- |
| F7600-r6 | F7600, NAMED_LOW_CHO, keitetty nakki | lowcho50-r6 |
| F322-r6 | F322, NONSTARCHY_VEGETABLE, kukkakaali | vegetable-imputation40 |
| A002390-r6 | A002390, NONSTARCHY_VEGETABLE, raaka varsiselleri | vegetable-imputation40 |
| F337-r6 | F337, NONSTARCHY_VEGETABLE, purjo | vegetable-imputation40 |
| F29-r6 | F29, STOCK, laimennettu lihaliemi | lowcho50-r6 |
| U170917-r6 | U170917, GROUND_SPICE, jauhettu syötävä laakeri | small-flavour50-r6 |
| F333-r6 | F333, NONSTARCHY_VEGETABLE, persilja | vegetable-imputation40 |

[nakki-binding-proposal.json](nakki-binding-proposal.json) antaa täsmälliset
`compositionId`, `foodId`, `foodKind`, `inputForm`, `allowedSources` ja
`consumedForms`-kentät. Uusia ruokaidentiteettejä, ruokaperheitä tai
GI-numeroita ei tarvita; myös lähteiden `allowedCompositionIds` ja
nykyiset `sourceRules` sallivat nämä identiteetit ennestään.
Kyse on puuttuvista exact-aliasriveistä, ei nimen perusteella tehdystä
automaattisesta ruokatulkinnasta.

Eristetyssä kokeessa käytettiin nykyisen `gk80-food-safety.ts`-tiedoston
**muuttamatonta toteutusta** ja scratch-kopiota katalogista, johon lisättiin
vain ehdotetut rivit. Sen jälkeen kaikki yhdeksän ainesosasidosta läpäisivät
tarkistuksen. Nykyinen tuotantokatalogi ei muutu.

Kontrollit hylkäsivät edelleen raakaan nakkiin vaihdetun valmistustilan,
väärän GI-lähteen,100 gramman laakerimäärän sekä tuntemattoman suuren
polyolituotteen identiteetin. Suola pysyy alkuperäisen version
sertifioituna nollana; mitään ainesosaa ei poisteta.

Nakkikeiton mallisumma säilyy5,3852925:nä. Se **ei vapaudu julkaisuun**:
laakerin käytettävissä oleva CHO ja polyolimäärä ovat edelleen ratkaisematta.
Myös alkuperäisen reseptin muuttaminen jauhetun kokonaan syötävän laakerin
punnituksi versioksi tarvitsee sisältöpäätöksen. Sidosehdotus ei yksin
hyväksy valmistusversiota, polyoleja tai julkaisumakroja.

## 4. Viiden reseptin päätösmatriisi

| Resepti | Tässä tehty konkreettinen työ | Jäljellä oleva esto | Ehdotus omistajalle |
| --- | --- | --- | --- |
| Jauheliha-kaalikeitto | Kuivatun meiramin hash-sidottu koko koostumustietue ja GI-sidosehdotus; Decimal-vertailu | P ja kokonais-CHO puuttuvat; lähdesumman alkuperä ei ole uusi mittaus | Hyväksy vain tutkimuksen lähdevalinta, säilytä julkaisu-HOLD |
| VHH-kaalilaatikko | Sama lähde, erillisen koko reseptin tarkistus | Sama | Sama |
| Ropa vieja | Norjan/UK:n laakeriketju ja jakeiden puuttuminen tutkittu | Laakerin lähdevaihto ja P ratkaisematta | Ei lähdevaihtoa; HOLD |
| Siskonmakkarakeitto | Sama laakeritarkistus; koko reseptin vertailu | Sama | Ei lähdevaihtoa; HOLD |
| Nakkikeitto | Kaikki9 sidosta tarkistettu;7 exact-aliasrivin toteutuskelpoinen ehdotus testattu eristyksessä | Laakerin CHO/P ja julkaisumakrot; valmistusversion hyväksyntä | Hyväksy sidosehdotus valmisteluksi; HOLD julkaisuun |

Julkaisuvalmiita uusia GK-arvoja0/5. Nykyinen130/326 säilyy.
Neljässä ensisijaisessa tapauksessa tehty lähdejatkotyö ei tarkoita neljää
ratkaistua reseptiä. Nakkikeiton sidosten ratkaistavuus on nyt osoitettu
kokonaisuutena, mutta sitä ei lasketa julkaistuksi GK-tulokseksi.

## 5. Varmennus ja resurssit

- Kaikki5 lukittua reseptihashia vastaavat nykyistä mainia.
- 5 tutkimussummaa ja20 makrokomponenttia verrattu itsenäiseen Python
  Decimal-laskentaan; ero TypeScriptiin alle1e−12.
- Nakkikeiton9 sidosta läpäisee eristetyn katalogiehdotuksen;4 negatiivista
  raaka-aine-/GI-/määräkontrollia ja2 tunnettu/tuntematon-polyolikontrollia PASS.
- 16 nykyistä `nutrition-model`- ja `gk80-food-safety`-testiä PASS, mukaan
  lukien merkittävän erytritolimäärän alkuperäinen kontrolli.
- Mainin tuotantopolku laskettiin ennen tutkimustiedostojen kirjoittamista
  ja tarkistetaan niiden lisäämisen jälkeen:326 kokonaista tulosobjektia,
  numeerisia130, kaikki identtisiä.
- Kehityksen toistot johtuivat Number/Decimal-vertailun liian tiukasta
  bitti-identtisyydestä ja ensimmäisen Decimal-komennon väärästä repo-polusta.
  Ne korjattiin; tuotantokoodia tai testiodotuksia ei muutettu.
- Ei sivustobuildia, kuvatyötä, selainta, UI-muutoksia tai manuaalista CI-ajoa.
  PDF:n lukutarkistus ei muuta sivustoa. Yksi Draft käyttää docs-only-CI-polun.
- Tiedostot ovat `docs/research/polyoli-02/`-puussa. Uusi JSON
  `docs/nutrition/`-puussa käynnistäisi turhaan täyden sivusto-CI:n.

Toisto repon juuressa, Node-riippuvuudet asennettuina:

```powershell
node site/node_modules/tsx/dist/cli.mjs docs/research/polyoli-02/review.mts --repo . --output-dir D:/Temp/polyoli02-review
python -B docs/research/polyoli-02/verify_decimal.py --repo . --review D:/Temp/polyoli02-review/review-results.json --output D:/Temp/polyoli02-decimal.json
node docs/research/polyoli-02/verify-main.mjs --output-dir D:/Temp/polyoli02-main
```

`review.mts` kirjoittaa vain eksplisiittiseen repon ulkopuoliseen scratchiin.
Se ei asenna katalogiehdotusta tuotantoon. Lähdepaketin ja katalogin hashit
sekä ehdotuksen rajaus tarkistetaan ennen laskentaa.

## 6. Omistajan hyväksyttäväksi tuotava tulos

**Suositus:** hyväksy kaksi tarkkaa meiramin tutkimuslähdesidosta ja nakkikeiton
seitsemän täsmällistä katalogisidosta jatkokehityksen pohjaksi. Älä vielä
hyväksy yhtäkään uutta julkaisulukua. Älä vaihda laakerin lähdettä tällä näytöllä.

Ensisijainen seuraava askel on hankkia mausteiden oikea polyolimäärä,
analyysin määritysraja tai tietokannan julkaisijan selitys puuttuville jakeille.
Valmiit kysymykset ovat mukana. Jos lähde ei pysty toimittamaan tietoa,
POLYOLI-01:n rajattu C-vaihtoehto pitää tuoda **erilliseksi menetelmäpäätökseksi**;
tämän hyväksynnän perusteella sitä ei toteutettu.

Tuotantoon vaikuttava myöhempi korjaus-PR saa asentaa nämä sidokset vain
senhetkistä mainia vasten, täydellisen lähde-/makronäytön tai erikseen
hyväksytyn rajatun menetelmän jälkeen. Nykyinen Draft sisältää vain
tutkimuslähteet, täsmälliset ehdotukset ja niiden eristetyn toiston.
Ei yleistä polyoliohitusta, rekisteröintiä, Ready-siirtymää, mergeä tai deployta.

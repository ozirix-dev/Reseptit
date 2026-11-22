# Perinteinen kesäkeitto — julkaisun lähde- ja tarkistusmuistio

21.11.2026 · DRAFT, ei omaa kokkivarmistusta.

Vertailulähde: https://www.martat.fi/reseptit/kesakeitto/

Oma reseptisovitus: kuusi annosta; 500 g uusia perunoita, 250 g porkkanaa, 350 g kukkakaalia, 150 g herneitä. Vehnäjauhot 20 g sekoitetaan kylmään maitoon, kypsennetään 4–5 minuuttia. Ajat muodostavat noin 40 min kokonaisuuden.

Allergeenit maito ja vehnä. FI/EN/SV/TH luonnokset. WebP-kuva 960 x 746 AI-havainnekuva. Ravintoarvoja ja GK:ta ei laskettu, gluteenittomuutta ei ole hyväksytty.

Ennen julkaisua: aine- ja valmistustarkastus, käännösten merkitystarkistus, kuva-arvio, tarvittavat hyväksynnät ja CI.

## Riippumaton lähdevertailu, 21.11.2026 (kirjallinen)

- Marttojen kesäkeitto-ohje: https://www.martat.fi/reseptit/kesakeitto/ (lähde vahvistettu). Martoilla 1 l vettä, 4 dl maitoa ja noin 2 rkl vehnäjauhoja; Recipavolla 700 g vettä, 400 g maitoa ja 20 g jauhoja sekä erikseen punnitut kasvikset. Jauhot lisätään kylmään maitoon sekoitettuina. Annosmäärä kuusi on Recipavon oma arvio.
- Valmistusjaksotus (perunat ja porkkanat ensin, kukkakaali myöhemmin, herneet lopuksi) tukee tarkoitusta säilyttää kasvikset napakoina. Uusien perunoiden koko ja tuoreus vaikuttavat kypsymiseen: aika on ohjeellinen, kypsyys varmistettava haarukalla.
- Neljästä kieliversiosta on verrattu annosmääriä, ainesosarivien määrää/järjestystä, yksiköitä ja kuvan metatietoja. Laajempi merkityskatselmointi ja hyväksyntärekisteri puuttuvat vielä.
- **HOLD:** maito ja vehnä on mainittu allergeeneina, mutta reseptiä ei ole koekeitetty. Kasvisten kypsennysjärjestys ja liemen määrä tulee vielä vahvistaa sekä ravintoarvot laskea erillisellä lähdeaineistolla, jos ne aiotaan näyttää. `decision: hold` säilytetään.
- Cloudflare-julkaisu ei kuulu tähän muutokseen.

## Chat 3:n rajattu valmistus- ja turvallisuusarvio 22.11.2026

- Marttojen [kesäkeiton](https://www.martat.fi/reseptit/kesakeitto/) vertailulähde käyttää 4 dl kevytmaitoa ja vehnäjauhosuurustetta; Recipavon punnittu maitomäärä on nyt 400 g, 1,5 % rasvaa. Näitä ei väitetä samaksi mittayksiköksi tai täsmälleen samaksi keittokoostumukseksi.
- Raaka-ainemassa yhteensä **2504 g**, kuusi laskennallista noin 417 g annosta ennen haihtumista. Uusien perunoiden ja porkkanoiden koko vaikuttaa 40 min kokonaisaikaan: haarukalla tarkistetaan kypsyys, ja jatketaan tarvittaessa. Vähintään noin 4 litran kattila jättää sekoitusvaraa.
- Ruokaviraston [ruokamyrkytysohje](https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/ruokamyrkytykset/) ja [säilytyslämpötilat](https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/kasittely-ja-sailyttaminen/lampotila/): tarjoa kuumana, jäähdytä ylijäämä nopeasti matalassa astiassa, säilytä alle +6 °C. Vehnä ja maito ovat ilmoitetut allergeenit kaikissa kielissä.
- Rajattu lähde-/annos-/menetelmä-/turvallisuuskatselmointi `pass`, mutta **ei** riippumaton fyysinen ruoanvalmistuskoe tai ravintolaskennan hyväksyntä. Maidon tuotemerkkikohtainen koostumus, kevätsipulin polyolit, perunan ja herneiden tarkka koostumus, kypsän saannon dokumentointi ja virallinen käännös-/kuvajulkaisuhyväksyntä edelleen HOLD. `decision: hold`, `status: draft`.

## Chat-3: ravintokandidaatin laskennallinen auditointi 22.11.2026

- Lähde: `docs/nutrition/candidates/kesakeitto-2026-11-21.json` PR #787:n HEADissa `d24a2524a8bb84951992e64c82cf9cfaa28dcfcb`; FI-reseptin `source_sha256` on ehdokkaan ja hyväksyntärekisterin kanssa sama `a43a0dfe31b1e9b2f567b601be66e0b818b40c0731e8a372062b2ba333fb25af`.
- Tarkistin jokaiselle **10 numeerisesti katetulle ainesriville** lähteessä ilmoitetun 100 g:n makron ja rivin grammapainon tulon sekä summasin panokset kuudelle annokselle. Ainesrivien kertolaskuissa ei havaittu yli 0,001 gramman poikkeamaa tallennettuihin pyöristettyihin rivipanoksiin.
- Katettujen rivien **osasummat yhtä annosta kohti** ovat hiilihydraatit 24,683 g, proteiini 6,899 g, rasva 3,598 g, kuitu 4,223 g ja polyolit 0 g. Nämä ovat vain **10/11 rivin osasummia, eivät julkaistavia koko reseptin ravintoarvoja**. Polyolien osasumman nolla ei tarkoita, että koko annoksen polyolit olisivat nolla.
- **Puuttuva 11. rivi:** 100 g kevätsipulia. Toissijaisessa kauppatuotteen merkinnässä on makroehdokkaat, mutta polyolit puuttuvat eikä tuotteen identiteettiä ole vahvistettu. Tätä riviä ei saa korvata purjolla tai lisätä nollana.
- **Merkittävät lähde-erot:** uusille pestyille perunoille käytetty vanhan kuoritun perunan vertailutietuetta; tuoreet/pakastetut herneet eivät ole täysin sama ravintotietue. Kypsän saannon ja tuotekohtaisen koostumuksen hyväksyntä puuttuu.
- **Etenemisehto:** varmennetaan kevätsipulin syötävän osan ravintokoostumus (myös polyolit tai perusteltu puuttuvan tiedon käsittely), valitaan tai erotellaan perunan ja herneiden raaka-ainevaihtoehdot, dokumentoidaan mahdolliset saanto- ja retentiokertoimet ja teetetään koko reseptin hyväksytty ravintolaskenta. Tämän jälkeen vasta riippumaton julkaisukatselmoija voi muuttaa `nutrition: pending` ja `decision: hold`.
- Auditointi koskee vain laskennan aritmetiikkaa ja aineiston sisäistä yhdenmukaisuutta, **ei** Fineli-lähdetietojen ajantasaista ulkoista vahvistusta, ravintoarvon oikeellisuuden hyväksyntää tai kokkikoetta. Käännös- ja kuvaportit jäävät edelleen HOLD-tilaan.

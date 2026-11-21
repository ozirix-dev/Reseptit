# Chat-3: kastikkeiden ruokaturvallisuuden ja allergeenien katselmointi

**Päivä:** 2026-11-21
**PR:** #808
**Omistaja:** Chat 3
**Tarkistettu sisältö:** `a90de29dc71c9564c7c369dc38e77ce6a8c61dfe`
**Kokonaispäätös:** DRAFT / HOLD – ei julkaisu- eikä merge-hyväksyntää

## Katselmoinnin tulos

Kaikkien kymmenen kastikkeen FI-lähde ja EN/SV/TH-käännösten turvallisuus- ja säilytyshuomiot on täydennetty. Rajattu ruokaturvallisuuden kirjallinen katselmointi: **7 PASS ja 3 PENDING**. Tässä PASS tarkoittaa kuvattujen reseptikohtaisten vaarojen, ainesosien ja ohjeiden arviointia, EI tuotannon sertifiointia, fyysistä testikeittiökokeilua tai koko julkaisun lupaa. Tuotteiden koostumuksista riippuvia allergeeneja ei ole oletettu poissaoleviksi.

| FI-resepti | Tunnetut allergeenit ainesosista | Päätös | Keskeiset rajoitukset |
| --- | --- | --- | --- |
| perinteinen-ruskea-kastike | maito, vehnä, soija | **PENDING** | Lihaliemen ja soijakastikkeen valinta määrää mahdollisen sellerin, vehnän ja muut allergeenit; pakkausmerkinnät vahvistettava |
| kermainen-tillikastike | maito | **PASS** | Pestyn tillin käsittely ja kermaviilin kylmäsäilytys alle +6 °C |
| kantarellikastike | maito, vehnä | **PASS** | Vain varmasti tunnistetut syötävät kantarellit; AI-kuva EI kelpaa sienilajin tunnistamiseen |
| sinappikastike-joulukinkulle | maito, vehnä, sinappi | **PENDING** | Kasvisliemen mahdollinen selleri ja sinappivalmisteiden tuotekohtaiset allergeenit vahvistettava; tarjoilu kypsän kinkun kanssa |
| kylma-piparjuurikastike | maito | **PASS** | Puhtaat välineet, pestyt yrtit, puhdistettu tuore piparjuuri, alle +6 °C kylmäsäilytys |
| perinteinen-munakastike | muna, maito, vehnä | **PASS** | Käytä täysin kovaksi keitettyjä munia; kuumatarjoilu ja nopea ylijäämien jäähdytys |
| kermainen-pippurikastike | maito, sinappi | **PENDING** | Vähäsuolaisen valmiin lihaliemen ainesosat ja mahdollinen selleri vahvistettava |
| perinteinen-valkokastike | maito, vehnä | **PASS** | Kuumentaminen ja jauhoseoksen kypsentäminen, tarvittaessa kuumasäilytys yli +60 °C |
| puolukkakastike-jalkiruokiin | ei tunnettuja suoraan lisättyjä EU-allergeeneja | **PASS** | **Vain kotimaisista puolukoista**: tarkista myös pakasteen todellinen alkuperä. Jos käytettäisiin ulkomaisia pakastemarjoja, Ruokaviraston erillinen kuumennusohje on välttämätön |
| perinteinen-vaniljakastike | muna, maito | **PASS** | Keltuaiskastike kuumennetaan kauttaaltaan noin 82–85 °C:seen ja saostetaan; tarjoilu heti tai nopea jäähdytys alle +6 °C |

## Viranomaislähteet ja tulkinta

- Ruokavirasto, ilmoitettavat allergeenit (ml. maito, vehnä, soija, sinappi, muna, selleri): https://www.ruokavirasto.fi/elintarvikkeet/elintarvikeala/ainesosat-ja-sisalto/allergeenit/
- Ruokavirasto, kotikeittiön säilytys, kuumana ja kylmänä tarjoilu, ylijäämien jäähdytys: https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/kasittely-ja-sailyttaminen/lampotila/tietoa-elintarvikkeiden-sailytysajoista/
- Ruokavirasto, elintarvikkeiden turvallinen säilytys ja ruokamyrkytysten ehkäisy: https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/ruokamyrkytykset/
- Ruokavirasto, ulkomaiset pakastemarjat: **vähintään 90 °C viisi minuuttia tai kiehuen kaksi minuuttia**; Suomessa pakattu ei välttämättä tarkoita Suomessa kasvatettua: https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/turvallisen-kayton-ohjeet/ulkomaiset-pakastemarjat/

Kuumien kastikkeiden ylijäämien nopea jäähdyttäminen matalassa astiassa ja kylmäsäilytys alle +6 °C:ssa sekä kylmien maitokastikkeiden alle +6 °C säilytys kirjattiin FI/EN/SV/TH-teksteihin. Pitkässä kuumassa tarjoilussa valkokastike pidetään yli +60 °C. Kaikissa resepteissä annos- ja säilyvyysajat ovat ohjeita, ei laboratorio- tai säilyvyystestaukseen perustuvia päivämääriä.

## Muutosten tekninen eheys

- Päivitetty 10 FI-lähdettä ja 30 EN/SV/TH-käännöstä; kielitiedostot ovat edelleen `status: draft`.
- `docs/reviews/new-recipes/<id>.json`-tietueiden `checks.food_safety` päivitetty yllä mainittuihin PASS/PENDING-arvoihin, muut julkaisua estävät kentät edelleen ennallaan.
- Jokaisen 10 FI-lähteen koko SHA-256 vastaa katselmointitietuetta ja `docs/nutrition/candidates/chat3-suomalaiset-kastikkeet-2026-11-21.json`-tietuetta. Kaikkien 30 käännöksen uusi alle +6 °C -säilytysohje ja Draft-tila tarkistettu.
- Ainesosamääriä tai annosmääriä ei tässä kierroksessa muutettu; `recipeNutritionInputHash`-laskentasyötteet jäävät entisiksi.

## Avoimet julkaisuportit

1. Kolmelle **PENDING**-kastikkeelle: valittujen liemi-, sinappi- ja soijatuotteiden tai täsmällisen itse valmistetun liemen koostumus ja allergeenit ennen turvallisuuden loppukuittausta.
2. Kaikille kymmenelle: Fineli-/tuotetietoon sidottu ravintolaskenta ja kaikki pakolliset ravintoarvot tai projektin vaatima perusteltu hyväksytty julkaisutapa; numeerinen GK vain hyväksytyllä näytöllä.
3. Kaikille kolmekymmenelle EN/SV/TH-käännökselle: muutetun FI-lähteen ja turvallisuusohjeiden lopullinen merkitysvertailu sekä tarvittavat rekisterin tiivisteet, EI kuittausta pelkällä rakennetestillä.
4. Kuvat: teknisesti olemassa ja SHA-varmennettu, mutta kaikki lopulliset toimitukselliset kuvahyväksynnät vielä erikseen tarkistettava.
5. Uusimman HEADin CI + Repo Guard, Ready/merge ja Cloudflare tuotantojulkaisu vain hyväksyttyjen porttien jälkeen.

**Päätös:** tämä kierros on valmis ja dokumentoitu, **PR #808 pidetään Draft/HOLD-tilassa**.

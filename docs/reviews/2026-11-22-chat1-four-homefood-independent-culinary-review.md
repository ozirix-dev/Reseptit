# Chat-1 — neljän kotiruoan riippumaton valmistus- ja lähdekatselmointi

**22.11.2026 · Omistaja Chat-1 (integraatiovastaava).** Täsmälleen tarkistetut Chat-3:n alkuperäiset PR-HEADit on alla. Reseptit on arvioitu itsenäisinä Recipavo-muunnelmina; vertailulähteen koekeittiömerkintää, määrää tai ravintoarvoa ei siirretä omaan reseptiin automaattisesti.

**Päätös:** näissä rajatuissa kirjallisissa lähdevertailuissa ei tullut esiin kiistatonta P0/P1-valmistusvirhettä. Tämä on **valmistusmenetelmän osittainen katselmointi**, ei kokonaisjulkaisun hyväksyntä. Jokaisen reseptin `status: draft`, `decision: hold`, hyväksynnät ja käännösten SHA-sidokset ovat edelleen alkuperäisen omistajan PR:ssä avoinna. Chat-1 ei ole itse valmistanut tai maistanut ruokia.

## Tarkistettu lähderakenne ja nelikielisyys

| PR | FI recipe_id ja HEAD | FI/EN/SV/TH ainesrivejä | Annoksia | Kokonaisaika | Päätös |
|---|---|---:|---:|---:|---|
| [#785](https://github.com/ozirix-dev/Reseptit/pull/785) | `kinkkukiusaus`, `ea1009a1b3c6ad0dbd855461cede192109b76c45` | 7 / 7 / 7 / 7 | 6 | 95 min | Valmistus P0/P1 ei havaittu, sisältö/julkaisu HOLD |
| [#786](https://github.com/ozirix-dev/Reseptit/pull/786) | `liha-perunasoselaatikko`, `b128e8e6e4abce1ce30d637208c980ac3b94a2a0` | 7 / 7 / 7 / 7 | 6 | 80 min | Valmistus P0/P1 ei havaittu, sisältö/julkaisu HOLD |
| [#788](https://github.com/ozirix-dev/Reseptit/pull/788) | `suppilovahverokeitto`, `14033ad443e9b08a80ab5b2cbd6267138eff8fb5` | 9 / 9 / 9 / 9 | 4 | 45 min | Sienilajin turvallisuusraja säilyy, sisältö/julkaisu HOLD |
| [#789](https://github.com/ozirix-dev/Reseptit/pull/789) | `silakkalaatikko`, `44299ce052c99c5a09585e0981d425fe3f14d87d` | 11 / 11 / 11 / 11 | 6 | 115 min | Kalakohtainen erityisraja säilyy, sisältö/julkaisu HOLD |

Tarkistin kunkin neljän kieliversion ainesosamäärät, valmistuslämpötilat, valmistusvaiheiden järjestyksen ja tärkeät turvallisuusohjeet. Ainesosamäärien ilmeisiä ristiriitoja ei löytynyt. Tästä **ei** synny hyväksyntää `meta/kaannokset/codex-review-evidence.json`-rekisteriin: se vaatii lopullisten kieliversioiden varsinaisen merkityskatselmoinnin, oikeat kaksi semanttista tiivistettä ja tuloksen dokumentoinnin. Pidä review-tila edelleen pending.

## #785 — Kinkkukiusaus

**Vertailulähde:** [K-Ruoka: Kinkkukiusaus](https://www.k-ruoka.fi/reseptit/kinkkukiusaus). K-Ruoka käyttää 1 kg pakasteperunasuikaleita, 200 g ylikypsää saunapalvikinkkua, 400 ml 15 % kermaa ja 200 g sipulikuutioita viiteen annokseen. Uuniohje 225 °C 30 min, sitten 200 °C 30–40 min.

**Recipavon oma versio:** 1 kg pakasteperunasuikaleita, 250 g kypsää savukinkkua, 400 g noin 15 % ruokakermaa ja 150 g sipulia kuuteen annokseen. Lämpötilat 225 °C / 30 min ja 200 °C / 35–40 min sekä noin 10 min vetäytyminen ovat valmistuksellisesti lähteen mukaisia. 95 min kokonaisaika sisältää noin 65–70 min uunia + 10 min vetäytymistä ja jättää esivalmistelulle noin 15–20 min. Vuoan noin 2,5 l kapasiteetti on oma käytännöllinen arvio, ei mittaus.

**Jäljellä:** savukinkun, perunasuikaleiden ja kerman valittu tuote/allergeenit; 6 annoksen oma valmistussaanto. Ravintoehdokkaassa perunasuikaleet ja kinkku ovat proxy-tietueita sekä pippurin kuitu-/polyolitietoa puuttuu. Ravintoarvot eivät ole valmiita julkaistaviksi. Jos niitä ei julkaista, puuttuvuutta ei saa merkitä arvoksi 0.

**Lähdearvion päätös:** valmistusmenetelmä pääpiirteissään PASS, mutta ei näyttöä täsmälleen muokatun version koekeitosta tai hyväksytyistä makroista. Ei kuvitteellista tuotteiden vastaavuutta tai gluteeniton-väitettä.

## #786 — Liha-perunasoselaatikko

**Vertailulähde:** [Valio: Liha-perunasoselaatikko](https://www.valio.fi/reseptit/liha-perunasoselaatikko/). Valio käyttää 1 kg jauhoisia perunoita, 4 dl täysmaitoa, 50 g voita, kahta munaa, 400 g jauhelihaa ja 200 °C / noin 30 min uunia. Valion ohjeessa munat sekoitetaan soseeseen ja jauheliha sekoitetaan siihen, joten Valion annos, ravintolaskenta ja rakenne eivät ole suoraan siirrettävissä.

**Recipavon oma versio:** 1 kg kuorittuja jauhoisia perunoita, 450 g naudan jauhelihaa, 250 g maitoa ja 40 g voita; **ei munia**, vaan perunasoseen ja valmiiksi kypsennetyn jauhelihan kerrokset. Valmistus 15–20 min perunankeittämistä, jauhelihan läpikypsennys ja 200 °C / 25–30 min paistaminen. 80 min kokonaisaika on uskottava valmistuksen ohjeellinen arvio, mutta sitä ei ole mitattu itsenäisesti.

**Jäljellä:** täsmennä erityisesti jauhelihan rasvaprosentti (nykyinen ravintoehdokas käyttää vain 17 %:n proxyä) ja maitotyyppi, jos numeroita aiotaan julkaista. Munaton kerroksellinen rakenne on oma muutos ja sen toteutusta ei saa merkitä Valion testaamaksi. Maitoallergeeni on kirjattu kaikille kielille, ja naudan jauheliha kypsennetään ohjeessa ennen vuokaan laittamista.

**Lähdearvion päätös:** valmistusmenetelmä pääpiirteissään PASS; tuotteiden ja makrojen lopputulos edelleen HOLD.

## #788 — Suppilovahverokeitto

**Vertailulähde:** [Martat: Suppilovahverokeitto](https://www.martat.fi/reseptit/suppilovahverokeitto-2/), Marttakeittiössä testattu. Martoilla on 1 l tuoreita sieniä, 4 rkl vehnäjauhoja, 8 dl kasvislientä, 1–2 dl kermaa ja **100 g sulatejuustoa**, joka puuttuu Recipavon versioista. Vertailulähteen ilmoittamia ravintoarvoja ei saa siirtää juustottomaan versioon.

**Recipavon oma versio:** 300 g varmasti tunnistettuja `Craterellus tubaeformis` -suppilovahveroita, 30 g vehnäjauhoja, 800 g kasvislientä, 200 g noin 15 % kermaa, 25 g voita; kuiva sienen esikuumennus, jauhojen kuumennus, kuuman liemen lisäys ja keiton soseutus ovat käyttökelpoisia valmistusperiaatteita. Suola tarkistetaan liemen suolaisuuden mukaan.

**Turvaraja:** vain varmasti tunnistettuja syötäviä ruokasieniä. [Ruokaviraston sieniohje](https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/turvallisen-kayton-ohjeet/ruokasienet/sienten-tunnistaminen/) on mukana alkuperäisessä PR:ssä. FI/EN/SV/TH sisältävät saman tunnistusvaatimuksen ja tieteellisen lajin tai ymmärrettävän kohdekielisen nimen. Kuvasta ei voi tunnistaa luotettavasti sienen lajia.

**Jäljellä:** sienilajin todellinen ravintotietue ja valitun kasvisliemen koostumus ovat `unresolved`. Sieniä ei saa korvata muun sienilajin ravintoproxyllä. Lajintunnistus ja kylmäsäilytys pidettävä osana julkaisun lopullista turvallisuusarviota.

**Lähdearvion päätös:** ohjeen valmistusrakenne PASS, riippumaton lajikohtainen tuote-/ravintohyväksyntä ja koko julkaisu HOLD.

## #789 — Perinteinen silakkalaatikko

**Vertailulähde:** [Martat: Silakkalaatikko](https://www.martat.fi/reseptit/silakkalaatikko/), kuuden annoksen ohjeessa noin 300 g silakkafileitä, peruna, sian kylkiviipaleet, 5 dl maitoa, 2 munaa ja 1 rkl vehnäjauhoja; noin 175 °C / 1,5 h.

**Recipavon oma versio:** 350 g ruodottomia Itämeren silakkafileitä, 900 g kuorittuja perunoita, 150 g pekonia, 500 g maitoa, 2 munaa, **ei jauhoja**, 175 °C / 80–90 min; viipaleet 2–3 mm ja valmis kala sekä hyytynyt munamaito varmistetaan. Recipavon 115 min kokonaisaika jättää valmistelulle, vetäytymiselle ja kerrostamiselle 15–25 min. Pekonin ja jauhojen vaihto merkitsee omaa muunnelmaa, ei identtistä Marttojen valmistus- tai ravintotulosta.

**Erityinen ruokaturva:** [Ruokaviraston kalan syöntisuositus](https://www.ruokavirasto.fi/kalansyontisuositus) rajoittaa **isoa, perkaamattomana yli 19 cm Itämeren silakkaa** alle kouluikäisillä ja hedelmällisessä iässä olevilla naisilla kerran kahdessa kuukaudessa. FI/EN/SV/TH-ohjeissa olennaiset kokoraja, riskiryhmät ja toistuvuus ovat mukana. Rajoitusta ei saa yleistää jokaiseen silakkafileeseen tai poistaa kohdekielistä. Kypsennyksen riittävyys varmistetaan ohjeen pehmeys/kypsyys/hyytyminen -ehdoilla.

**Jäljellä:** käytettävän silakkatuotteen, pekonin, maidon ja kananmunan määritykset ovat ravintoehdokkaassa vain arvioita. Myös maustetietueessa on puutteita. Tähän muunnokseen ei ole hyväksyttyä numeerista makro- tai GK-laskelmaa.

**Lähdearvion päätös:** valmistusperiaate ja keskeiset viranomaisrajoitukset PASS tässä rajatussa arviossa. Sisältö ja julkaisu edelleen HOLD.

## Erillinen kuvavalidointi ja valmis kuvalähde

- [PR #851](https://github.com/ozirix-dev/Reseptit/pull/851) MERGED: sama Draft-kuvan Git-juuren valinta ja Published-kuvan varmennetun juuren käyttö kaikille viidelle.
- [PR #852](https://github.com/ozirix-dev/Reseptit/pull/852) MERGED: viisi AI-havainnekuvaa `kuvat/paaruoat`-poluissa, tavut/RIFF/SHA-256 tarkistettu, tuotannon `assets/images.tracked-overlays.json` -manifestissa. Ei reseptien valmistuksen todistus.
- [PR #853](https://github.com/ozirix-dev/Reseptit/pull/853) MERGED: erillinen kesäkeiton riippumaton valmistuskatselmointi.

## Käännösten ja ravinnon yhteinen, todellinen jatkoportti

**Käännökset:** 16 kielisivua (4 FI + 12 EN/SV/TH) on katsottu vasta tähän lähdeversioon sidotusti alustavasti. Ei ilmeistä P0/P1-määrä-/ajoitus-/turvallisuusristiriitaa. Vaadittu viimeisten tiedostojen `semanticHash` + `meta/kaannokset/codex-review-evidence.json` tulee **tehdä** niiden omistajan valmisteltua lopullisen FI-lähteen, eikä tätä Chat-1:n raporttia merkitä Codex-ajoksi.

**Ravinto:** neljässä `docs/nutrition/candidates/*-2026-11-21.json`-tietueessa julkaistavat kokonaiset makrot ja GK on nimenomaisesti `null` / `HOLD_NOT_PUBLISHABLE`. Niitä ei pidä julkaista proxy-pohjaisena tai nollaksi muutettuna. Muissa hyväksytyissä resepteissä voi olla perusteltu numeeristen makrojen poisjättö; lopullisen julkaisureseptin tarkistaja päättää, riittääkö läpinäkyvä poissulkemisnäyttö. **Täydellinen makrolaskenta ei ole automaattinen syy pitää muuten perustellusti hyväksyttävää reseptiä ikuisesti Draftina**, mutta nykyinen `decision: hold` ei muutu pelkällä tällä analyysillä.

**Omistajuus:** PR #785/#786/#788/#789 pysyvät Chat-3:n kirjoitushaaroina; niitä ei rebaseta tai yhdistetä tämän PR:n yhteydessä. Kun kirjalliset lähdehyväksynnät, mahdolliset P2-viimeistelyt, semanttinen rekisteri ja reseptikohtaiset päätökset ovat kunnossa, Repo Guard Ready/merge uuden CI:n perusteella. Ei Cloudflare-deployta tämän katselmoinnin perusteella.

*Kaikki tulokset ovat SHA-sidottuja lähdearvioita; ei väitettä omasta koekeittiöstä, tuotteen mittauksesta tai hyväksytystä laboratorioanalyysistä.*

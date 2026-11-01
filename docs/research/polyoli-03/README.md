# POLYOLI-03 — viiden reseptin rajattu C-menetelmä omistajan päätettäväksi

**1.11.2026 — menetelmäehdotus valmis; päätös PARTIAL / CONDITIONAL GO kahdelle.**
Kaikki viisi reseptiä on arvioitu samalla rajatulla menetelmällä. Jauheliha-
kaalikeitto ja VHH-kaalilaatikko ovat ehdollisia jatkoehdokkaita. Ropa vieja,
siskonmakkarakeitto ja nakkikeitto jäävät HOLDiin. **Uusia tuotantoon
hyväksyttyjä GK-arvoja on 0.**

Ehdotus on kokonaisen reseptin epäselvien polyoliosuuksien yhteisbudjetti,
ei lupa ohittaa puuttuvaa tietoa. Polyolit säilyvät `null`-arvoina.
Käyttäjälle ehdotetaan vain sellaisia pyöristettyjä lukuja, jotka ovat samat
koko ilmoitetussa laskentaskenaariossa. Menetelmä ei oleta puuttuvan polyolin
määrää tai vastetta nollaksi.

## 1. Hyväksytty rajaus ja main-pohja

Omistaja hyväksyi edellisessä vaiheessa meiramin lähdesidokset kahteen
reseptiin ja nakkikeiton seitsemän sidosehdotusta. Nyt annettu lupa kattaa
C-menetelmän valmistelun viidelle reseptille yhteen main-pohjaiseen Draftiin.
Se ei vielä hyväksy menetelmän kynnystä, julkaisuversioita tai julkaisua.

[approval-ledger.json](approval-ledger.json) erottaa nämä päätökset.
Hyväksyttyjen lähde-/sidostiedostojen alkuperäiset snapshotit ovat mukana
commitista `08b69bd974c427c94be3a460c27d007fbcd53f54` (Draft #155).
Niiden historialliset pending-tekstit eivät kumoa myöhempää käyttäjän
hyväksyntää; voimassa oleva hyväksyntä on erillisessä ledgerissä. Snapshotien
evidenssihasheja ei muuteta jälkikäteen. Tuotantoon asentamista ei ole hyväksytty.

Repo `ozirix-dev/Reseptit`, origin
`https://github.com/ozirix-dev/Reseptit.git`, repo guard PASS.
Oma worktree `D:/Projects/tmp/reseptit-gk80-polyol-scoped-c-method`, haara
`codex/gk80-polyol-scoped-c-method`, suoraan etä-mainista
`5761afa069ea54c9d510f1cb3c1086ae7d42f998`.
Draftit #154 ja #155 eivät ole tämän haaran parentteja eikä niitä muuteta.
Rinnakkainen chat **Paranna Reseptit GK -laatua** pysyy erillisessä työpuussa;
sen resepti- tai katalogimuutoksia ei kopioida tähän.

Mainin tulokset laskettiin uudelleen tässä työpuussa: **130/326**.
Pages tarkistettiin HTTP200: samat luvut, 196 keskeneräistä.
[baseline-pages.json](baseline-pages.json) sisältää ajan ja HTML-hashin.
Asetustiedostossa on Sol/High; aktiivisen chatin mallivalinta ei ole
saatavassa istuntometadatassa, joten sitä ei väitetä varmennetuksi asetuksista.

## 2. Ehdotettu C-sääntö

Sääntöä saisi myöhemmin soveltaa **vain näihin viiteen lukittuun versioon**:

- `jauheliha-kaalikeitto-vhh`
- `vhh-kaalilaatikko`
- `ropa-vieja`
- `siskonmakkarakeitto-juurekset`
- `nakkikeitto-kukkakaalilla`

Resepti-, lähde-, koostumus-, massa-, annos- ja valmistussidokset lukitaan
[cases.json](cases.json)-pakettiin ja sen SHA256:een. Uusi resepti, tuote,
annosmäärä, lähde tai lisätty tuntematon ei saa automaattista hyväksyntää.
Nykyinen ruokaperhe- ja valmistustarkistin säilyy sellaisenaan.

Ehdotuksen pakolliset ehdot ovat:

1. Kaikki lähteen **aggregate-polyoliin** jäävät puutteet huomioidaan koko
   reseptistä. Myös AFCD:n vain osan polyolilajeista kattava näyttö huomioidaan.
2. Koko GK-skenaarion leveys on enintään **0,10 GK/annos**. Tämä on ehdotettu
   toimituksellinen raja, ei biologinen tai kliininen virheraja.
3. Jokaisen GK- ja makroalueen koko sisältö tuottaa saman julkaisussa
   ehdotetun pyöristetyn luvun. GK-luokan pitää lisäksi säilyä raaka-arvojen
   perusteella; sama näkyvä kokonaisluku ei riitä luokkarajan yli.
4. Julkaisu on LOW-luottamuksella, täsmälleen nimetylle valmistusversiolle,
   ja rajoite selitetään. Ainesosia, nesteitä tai mausteita ei poisteta.
5. Omistaja hyväksyy juuri tämän lähdekohtaisen skenaariomallin, tarkkuudet
   ja valmistusversion ennen mahdollista erillistä tuotantointegraatiota.

Prototyyppi on [scoped_c.py](scoped_c.py), vain tutkimuskansiossa. Kaikissa
tuloksissa on `publicationEligible:false` ja `productionEnabled:false`.
Sitä ei tuoda tuotannon laskentamoottoriin eikä julkaisurekisteriin.

## 3. Mistä rajat muodostuvat

Laskennan alue on **lähteiden ilmoitettujen makrojen ehdollinen
koostumusmalli**. Se ei kata lähdearvojen koko analyyttistä epävarmuutta,
kaikkia tuotevaihteluja tai kaikkia mahdollisia biologisia vasteita.

Polyolin vastekerrointa tutkitaan välillä **0–150** glukoosiasteikolla.
150 on skenaarion oletus, ei todistettu suurin GI. Rajaa suurempi vaste
voi ylittää laskentabudjetin. Esimerkiksi kaalilaatikon herkkyys olisi
kertoimen 200 skenaariossa noin 0,1147 ja ylittäisi 0,10-rajan.
Myös 50/100/120/150-skenaariot ja neljä budjettia on vertailtu.

### Meirami: polyoli on ilmoitetun CHO:n ulkopuolella

Hyväksytty Norjan kuivattu meirami ilmoittaa sokeri+tärkkelys-CHO:n 20,3,
kuidun 40, proteiinin 12,7 ja rasvan 7 g/100 g. Näiden summa on 80.
Koostumusmallissa kaikki jäljelle jäävä **20 g/100 g** annetaan varovaisesti
mahdolliselle polyolille. Se sisältää todellisuudessa myös vettä ja muita
aineita, mutta niiden määriä ei oleteta nollaksi.

Vettä ei vähennetä: tämän lähteen vesi on johdettu erotuksella ja sen
vähentäminen tuottaisi perusteettoman nollajäännöksen. Negatiivinen jäännös
on ristiriita ja HOLD, ei nollaan leikkaus. Tämä rajaus on **lähteen
makrot kiinteinä pitävä skenaario**, ei ravintoaineiden mittaustarkkuudesta
riippumaton fyysinen yläraja.

Meiramia on 0,6 g / 6 annosta. Sen oma polyoliskenaario on siksi
0–0,020 g/annos ja GK-lisäys 0–0,030. CHO20,3:sta ei vähennetä tätä P:tä
uudelleen. Lähdemääritelmä:
[Matvaretabellen06.186](https://www.matvaretabellen.no/en/marjoram-dried/).

### Laakeri: polyoli kuuluu US-totalin ei-kuituiseen pooliin

Nykyinen USDA-tietue ilmoittaa total74,97 ja kuidun26,3 g/100 g.
Ei-kuituinen lähdepooli on48,67 g/100 g. Sen jako A:n ja P:n välillä on
tuntematon: `A+P=C−F`. Siksi neton aluetta ei korvata täsmällisellä
nettoarvolla. Sivuston kokonais-CHO voi silti muodostua suoraan US-totalista:
`A+F+P=C`, ilman P:n määrän ratkaisemista ja ilman P=0-oletusta.

Laakerin GI50 pysyy nimettynä projektivertailuna. Polyoliosuuden ja sen
vasteen kaikki ilmoitettuun skenaarioon kuuluvat yhdistelmät tutkitaan.
Norjan laakerin epäselvää sokerijakeistusta ei oteta käyttöön.

### AFCD:n kenttäpari ei ole koko polyolimäärä

Kymmenessä näiden reseptien ainesosaesiintymässä AFCD:n with/without-
kenttäpari antaa lähdemallin sorbitoli+mannitoli+glyseroli-osan. Se ei
osoita muita polyolilajeja mitatuiksi tai nolliksi. Osittainen näyttö
luetellaan jokaisesta ainesosasta, myös niistä, joiden vanha adapteri
oli jo merkinnyt erotuksen lähdevarmennetuksi nollaksi.

Puuttuvien lajien mahdollinen lisäosuus rajataan samassa koostumusskenaariossa:

`jäännös = 100 − A − kuitu − proteiini − rasva − kenttäparin tunnettu osa`.

Kaikki tämän jäännöksen polyoliksi tulkitsevat osuudet summataan reseptiin.
Vettä ei vähennetä ilman erillistä riippumatonta näyttöä. Tämä tekee etenkin
liemen ja varsisellerin rajoista erittäin väljiä: **se osoittaa nykyisen
aineiston riittämättömyyden tiukkaan rajaan, ei niiden todellista suurta
polyolimassaa tai suurta GK:ta.**

Kenttäparin määritelmä on varmennettu alkuperäisestä
[AFCD Release3 Nutrient details -aineistosta](https://www.foodstandards.gov.au/sites/default/files/2025-12/AFCD%20Release%203%20-%20Nutrient%20details.xlsx).
[FSANZ:n julkaisuohje](https://www.foodstandards.gov.au/sites/default/files/2025-12/About%20the%20Australian%20Food%20Composition%20Database%20-%20Release%203.pdf)
erottaa puuttuvan ravintoaineen nollasta. Lähdemääritelmiä ei muuteta
globaalisti. Tässä ei luvata poistuvan koko lähde- tai biologisen epävarmuuden.

## 4. Reseptikohtaiset tulokset

| Resepti | Vain nimetty meirami/laakeri: leveys | Koko resepti, myös AFCD:n puuttuvat lajit | 0,10-rajan tulos |
| --- | ---: | ---: | --- |
| Jauheliha-kaalikeitto | 0,030000 | **0,058000** | Ehdollinen C-ehdokas |
| VHH-kaalilaatikko | 0,030000 | **0,086000** | Ehdollinen C-ehdokas |
| Ropa vieja | 0,024335 | 1,631835 | HOLD |
| Siskonmakkarakeitto | 0,0365025 | 374,7575025 | HOLD; raja ei ole käyttökelpoisen tiukka |
| Nakkikeitto | 0,0365025 | 35,7080025 | HOLD; raja ei ole käyttökelpoisen tiukka |

Meiramitapauksissa mustapippurin mahdollinen muu polyoliosuus on mukana.
Kaalilaatikon pippuria on 1 g, kaalikeitossa 0,5 g; niitä ei käsitellä
saman annosmassan puutteena. Ropa viejassa on lisäksi valkosipulin,
juustokuminan ja oreganon osittainen AFCD-näyttö. Siskonmakkarakeitossa
on liemen, persiljan ja pippurin puutteita; nakkikeitossa varsisellerin
ja pippurin. Nakkikeiton aiemmin hyväksytyt seitsemän katalogisidosta
ratkaisevat sidokset, eivät tätä koostumusnäytön rajoitetta.

### Kynnysvertailu, vastekerroinskenaario0–150

| Koko alueen leveysbudjetti | Ehdokkaita vain nimetystä mausteesta | Ehdokkaita koko reseptin tarkistuksesta |
| --- | ---: | ---: |
| 0,05 | 5 | 0 |
| **0,10** | 5 | **2** |
| 0,25 | 5 | 2 |
| 0,50 | 5 | 2 |

Suositus on 0,10 **vain tähän lukittuun ehdotukseen**: 0,05 ei kata
kokonaisvaikutusta, suuremmat tarkastellut rajat eivät ratkaise kolmea
HOLD-tapausta eikä niiden avulla kannata peittää aineiston aukkoja.
0,10 ei ole aiemmin hyväksytty tuotantokynnys, vaan omistajan päätettäväksi
tuotu ehdotus laskentatulosten perusteella.

Pelkkä nimettyjen mausteiden koko massan skenaario antaisi leveydet
0,15 / 0,15 / 0,05 / 0,075 / 0,075. Se ei kata muiden ainesosien aukkoja.
Tulostiedoston `physicalMassStress` koskee vain tätä nimettyä maustetta;
sitä ei käytetä koko reseptin hyväksymiseen.

## 5. Neljä makroa ja näkyvät GK-arvot ilman keksittyä polyolipistettä

Ehdotus ei valitse tuntemattoman P:n keskipistettä, nollaa tai todennäköistä
määrää. Ensin muodostetaan alueet ja vasta sitten valitaan tarkin
0/1/2 desimaalin esitys, joka pysyy samana alueen molemmissa päissä.
Monotoninen pyöristys tekee siitä saman myös alueen sisällä.

GK:n raaka-arvojen luokat tarkistetaan erikseen. Positiivista alle yhden
arvoa ei sallita pyöristettäväksi nollaksi; tällainen uusi tilanne jää
tämän paketin ulkopuolelle. Nykyiset kaksi ehdokasta ylittävät yhden ja
pysyvät matalan GK:n luokassa.

| Ehdokas | Koko GK-skenaario | Ehdotettu näkyvä GK | Netto-CHO | Kokonais-CHO | Proteiini | Rasva |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Jauheliha-kaalikeitto | 4,588900–4,646900 | **noin 5** | 10,21 g | **12 g** | 17,68 g | 15,26 g |
| VHH-kaalilaatikko | 3,773416667–3,859416667 | **noin 4** | 9,52 g | **13 g** | 20,86 g | 30,65 g |

Kaalikeiton kokonais-CHO:n alue on12,141883–12,180550 g ja kaalilaatikon
12,714967–12,772300 g/annos. Kumpaakaan ei saa esittää nykyisen kaltaisena
kahden desimaalin täsmällisenä kokonais-CHO-pisteenä. Molemmille vasta
kokonaiset grammat pysyvät samoina koko skenaariossa. Proteiini ja rasva
eivät muutu puuttuvan P-jaon mukana; lähdearvojen muu epävarmuus säilyy.

Tämä ratkaisee **näytettävän luvun** valinnan mallin sisällä, ei määritä
uutta tarkkaa ravintokoostumusta. `referenceScenarioGk` on vain jäljitettävä
vertailupiste eikä julkaistava pyöristämätön mittaus. Julkaisuun ehdotettavat
luvut johdetaan vakaasta pyöristyksestä, eivät valitusta P-määrästä.

Kolmelle HOLDille ei tarjota neljän makron julkaisupakettia. Niiden
kokonais-CHO ja GK eivät säily vakaana nykyisen laajan jäännösskenaarion
sisällä. Osasummia ei esitetä valmiina reseptituloksina.

Mahdollinen myöhemmin hyväksyttävä käyttäjäteksti:

> Mallinnettu arvio, matala luottamus. Mausteiden puuttuvaa polyolitietoa on
> käsitelty tähän reseptiversioon rajatulla laskentamallilla. Arvio ei ole
> mitattu aterian verensokerivaste.

Tekstiä tai makroarvoja ei lisätä reseptisivuille tässä Draftissa. Käyttöliittymään
ei lisätä uutta alueformaattia. Nykyinen ravintotodisteen tarkistin vaatii
edelleen tunnetun P:n, joten myöhempi integraatio tarvitsee erillisen,
vain hyväksytyille resepteille rajatun evidenssipolun. Globaalia normalisoijaa,
US-total-polun tunnettuja virheitä tai ruokaperhesuojaa ei muuteta tässä.

## 6. Omistajan päätösesitys

**Suositus:** hyväksy jatkototeutuksen pohjaksi vain kahden meiramireseptin
C-ehdotus, jos seuraavat uudet menetelmäehdot hyväksytään yhdessä:

1. Nimetyille lähteille rajattu makrojäännösmalli ja vastekerroinskenaario
   0–150; raja on toimituksellinen lähdemalliskenaario, ei biologinen takuu.
2. Koko reseptin leveysbudjetti0,10 GK/annos, kaikki puuttuvat AFCD-lajit
   mukana; ei kenttäparin tulkitsemista kaikkien polyolien mitatuksi nollaksi.
3. Taulukon täsmälliset esitystarkkuudet, mukaan lukien kokonaiset grammat
   kokonais-CHO:lle, sekä nimetyt punnitut valmistusversiot ja LOW-teksti.

[versions.md](versions.md) näyttää kaikkien viiden täsmälliset syötävät
massat ja valmistusohjeet, jotta sisältöpäätös koskee tarkistettavaa versiota.

**Säilytä ropa vieja, siskonmakkarakeitto ja nakkikeitto HOLDissa.** Niihin
tarvitaan parempi lähdenäyttö tai riippumattomasti perusteltu tiukempi
raja erityisesti valkosipulesta/mausteista, liemestä ja varsiselleristä.
Seitsemän nakkisidoksen hyväksyntä säilyy, vaikka C-laskenta ei vielä vapauta
reseptiä. Lähdesidoksia ei pyydetä hyväksymään uudelleen.

Jos omistaja ei hyväksy jäännösmallin tai vastealueen ehdollisuutta,
suositus on nykyisen julkaisupidätyksen säilyttäminen myös kahdelle
meiramireseptille. Tämän raportin perusteella ei luvata yleistä fysiologista
virherajaa. **Mahdollinen lisäys on2, ei5**, ja sekin edellyttää uutta
menetelmä- ja sisältöpäätöstä sekä myöhempää erillistä integraatiota.

## 7. Varmennus ja toimitus

- 15 kohdistettua uuden menetelmän kontrollia PASS: scope, massa, annokset,
  puuttuva GI, lisätty tuntematon, poikkeava lähdetyyppi, puuttuva kenttäpari,
  johdettu vesi, polyolien säilyminen nullina, makrojen tarkkuus, luokkaraja
  ja positiivisen alle yhden nollaksi pyöristymisen esto.
- 17 nykyistä nutrition-model-, food-safety- ja display-testiä PASS.
- Decimalin alueet ja20 makrorajaa verrattiin itsenäiseen Number/Intl-
  laskentaan. Lisäksi1815 erillistä hypoteettisen P-jaon ja vasteen
  yhdistelmää pysyi ilmoitetuilla alueilla; ehdokkaiden näkyvä GK säilyi.
- Kaikkien5 lähdehashit ja hyväksytyt sidokset tarkistettiin nykyistä
  mainia vasten. Nakkikeiton9 sidosta läpäisi muuttamattoman tarkistimen
  vain hyväksytyt7 aliasriviä sisältävässä eristetyssä katalogissa.
- 326 kokonaista tuotantotulosobjektia verrataan tässä työpuussa ennen
  tutkimustiedostojen lisäystä ja sen jälkeen; kaikki130 vanhaa numeerista
  säilyvät täsmälleen. Ei tuotannon resepti-, makro-, katalogi- tai rekisterimuutosta.
- Kehitysvaiheessa korjattiin scratch-paketin rivinvaihtojen hash-normalisointi,
  yhden testin syntaksi sekä Decimalin viimeisten numeroiden vertailutoleranssi.
  Näiden vuoksi kohdistetut tarkistimet uusittiin; tuotantotestit läpäisivät
  ensimmäisellä ajolla eikä niitä uusittu tarpeettomasti.
- Ei691-reittistä buildia, selainta, kuvatyötä, uutta reseptierää tai
  manuaalista Actions-ajoa. Tiedostot ovat docs/research-polussa,
  joten yksi Draft käyttää kevyttä CI-valintaa.

Toisto repon juuressa, Node-riippuvuudet asennettuina:

```powershell
python -B -m unittest discover -s docs/research/polyoli-03 -p test_scoped_c.py
python -B docs/research/polyoli-03/scoped_c.py --repo . --output D:/Temp/polyoli03-results.json
node docs/research/polyoli-03/verify_number.mjs D:/Temp/polyoli03-results.json
node site/node_modules/tsx/dist/cli.mjs docs/research/polyoli-03/review.mts --repo . --output-dir D:/Temp/polyoli03-bindings
node docs/research/polyoli-03/verify-main.mjs --output-dir D:/Temp/polyoli03-main
```

[results.json](results.json) sisältää koko viiden reseptin päätösmatriisin,
makroalueet, tarkkuudet, kaikki osittaiset AFCD-tietueet ja16 budjettivertailua.
[verification.json](verification.json) kokoaa toistot. Kaikki kirjoittavat
tarkistimet vaativat erikseen nimetyn repon ulkopuolisen scratch-kohteen.

Tämä yksi main-pohjainen Draft tuo menetelmän hyväksyttäväksi.
Se ei merkitse Readya, mergeä, deployta tai C-menetelmän käyttöönottoa.

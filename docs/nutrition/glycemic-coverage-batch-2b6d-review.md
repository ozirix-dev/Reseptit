# GK-kattavuuserä 2B6D – lähde- ja kattavuuskatsaus

## Rajaus ja lähtötilanne

Erä perustuu korjattuun 2B6C-haaraan ja sen muuttumattomaan lähtösnapshotiin `f2ba9e849e677f9e223103022e309a09b9992f62`. Reseptit PR #117 ja ReportHub PR #70 olivat tarkistettaessa edelleen Draft-tilassa. Tähän erään ei tuotu käyttöliittymä-, vaihteluväli- tai Nutritics-muutoksia. Neljän taatelireseptin ainesosa- ja valmistusohjetekstiä täsmennettiin; 10 g taatelimäärä säilyi.

| Mittari | Historiallinen 2B6D-baseline | Alkuperäisen 2B6D-tutkimusjoukon tulos | Muutos 2B6D-erässä |
| --- | ---: | ---: | ---: |
| Reseptejä | 325 | 325 | 0 |
| GK laskettu | 136 | 138 | +2 |
| GK keskeneräinen | 189 | 187 | −2 |
| GI-tietueita | 42 | 45 | +3 |
| GK-kattavuus | 41,8 % | 42,5 % | +0,6 prosenttiyks. |

Muuttumattoman baseline-snapshotin 136 aiemmin laskettua GK-arvoa säilyivät täsmälleen. Mannapuuron aiemmin laskettu 21,95/annos välitulos vedettiin pois, koska GI-lähteen valmistustapa ei oikeuta sidontaa. Taulukko kuvaa alkuperäistä 325 reseptin 2B6D-tutkimusjoukkoa; se ei ole integroidun PR #120:n nykyinventaario.

## Lähtötilanne, tutkimusjoukko ja integroitu nykytila

- **A. Historiallinen 2B6D-baseline:** 325 reseptiä / 136 laskettua / 189 keskeneräistä / 42 GI-tietuetta. Muuttumattoman baseline-tiedoston lähde-SHA on `f2ba9e849e677f9e223103022e309a09b9992f62`.
- **B. Alkuperäinen 2B6D-tutkimusjoukko:** 325 reseptiä. Erän tutkimuksessa hyväksyttiin kaksi uutta GK-arviota; muu lähdeanalyysi, estot ja priorisointimäärät jäljempänä koskevat tätä alkuperäistä joukkoa.
- **C. Hotfix #122:n tuoma kokoelma:** hotfix yhdistettiin main-haaraan ja julkaistiin SHA:ssa `05d48630c76b06e2ac93f27468f1872f8b766021`. Se toi nykyiseen kokoelmaan reseptin `munakoiso-kesakurpitsalasagne`, jolloin kokoelma kasvoi 326 reseptiin. Lasagnen GK on `null` ja tila `INSUFFICIENT SOURCE DATA`.
- **D. Integroitu PR #120:** nykytila on 326 reseptiä / 138 laskettua / 188 keskeneräistä / 45 GI-tietuetta; GK-kattavuus on 42,3 %. Lasagne sisältyy keskeneräisenä. Historialliset 325 reseptin baselinet ja aiemmat 136 GK-arvoa säilyivät muuttumattomina. Integraation GitHub Actions CI läpäisi HEADin `fa35f6fa80330fe8b7b23e8633f951f67ead1811` ([run 40581494809](https://github.com/ozirix-dev/Reseptit/actions/runs/40581494809)).

## Taatelin koostumuslähde, GI-lähde ja GK-laskennat

Fineli #28937 kuvaa kuivattua taatelia, joka on punnittu kivineen. Sivulla näkyvät 87 %:n syötävä osuus ja 38,2 g imeytyvää hiilihydraattia/100 g, mutta tietue ei kerro, koskeeko ravintoarvo syötävää osaa vai kauppapainoa. THL:n yleisohje sanoo, että ravintoarvot ilmoitetaan yleensä syötävää osaa kohti, mutta kuorineen tai muuten syötäväksi kelpaamattoman osan kanssa myytävistä elintarvikkeista annetaan arvot sekä syötävälle osalle että kauppapainolle. Finelin julkinen sivu ei näytä tämän taatelitietueen kahta arvoa tai yksiselitteistä perustaa. Siksi tietueen perustaksi on merkitty `unresolved`: 87 %:a ei kerrota uudelleen 38,158 g/100 g -arvolla, eikä 3,32 g:n annosväitettä tehdä. Tietuetta ei käytetä GK-laskennassa ennen perustan vahvistamista. Lähteet: [Fineli #28937](https://fineli.fi/fineli/fi/elintarvikkeet/28937), [THL:n Fineli-aineistojen ohje](https://fineli.fi/fineli/content/file/8).

## Mannasuurimon ja appelsiinin GI-tarkistus

Mannapuuron aiempi välitulos GI 55 -sidonnalla oli GK 21,95/annos; tämä on nyt hylätty historiallinen arvio. Mani ym. (1992) sekä International Tables 2021 Supplemental Table 2, kohta 2762, raportoivat GI 55 ± 9 vehnämannasuurimolle, joka höyrytettiin ja hyytelöitiin veden kanssa sekä valmistettiin 5 g maapähkinäöljyllä. Taulukko luokittelee tuloksen täydentäväksi menetelmäpoikkeamien vuoksi: kuusi tyypin 2 diabetesta sairastavaa osallistujaa, 50 g imeytyvää hiilihydraattia, ei toistettua vertailuruokaa ja vain 0/60/120 minuutin näytteenotto. Reseptin mannapuuro keitetään vedessä ilman öljyä. Lähde ei osoita höyrytyksen ja vesikeiton vastaavuutta eikä erottele öljyn vaikutusta, joten lähde ei täytä tähän reseptiin hyväksyttävän LOW-analogian ehtoja. Lopullinen päätös on NO MATCH: reseptin GI-sidonta poistettiin, GK on `null` ja tila `INSUFFICIENT SOURCE DATA`. GI 55 -tietue säilyy katalogissa vain lähteessä mitatulle valmistukselle avaimella `steam-gelatinized-semolina-with-groundnut-oil`; muuta ruokaryhmäkeskiarvoa ei käytetty. [Mani ym. 1992](https://doi.org/10.1079/BJN19920102), [PubMed 1445824](https://pubmed.ncbi.nlm.nih.gov/1445824/), [International Tables 2021, Supplemental Table 2, kohta 2762](https://nutritotal.com.br/pro/wp-content/uploads/sites/3/2021/09/Tabela2_IG.pdf).

Appelsiinin aiempi hedelmäkategoriakeskiarvo 51 korvattiin suoraan mitatulla raaka-appelsiinilla. International Tables 2021 Supplemental Table 1, kohta 1150, raportoi navel-appelsiinille GI 45 ± 5; mittaus tehtiin standardimenetelmällä 10 terveellä aikuisella, 50 g imeytyvää hiilihydraattia ja glukoosivertailu. Reseptin appelsiinin lajiketta ei tunneta, joten lähdetietue on `STRONG` mutta reseptisidos `ANALOG / LOW`. [International Tables 2021, Supplemental Table 1, kohta 1150](https://nutritotal.com.br/pro/wp-content/uploads/sites/3/2021/09/Tabela1_IG.pdf).

Resepteihin täsmennettiin kivettömät kuivatut taatelit; makroravintolaskelmissa käytetty AFCD F003496 vastaa tätä muotoa suoremmin. Se on pitted dried date, analysoitu osuus 100 %, ja imeytyvä hiilihydraatti on 67,2 g/100 g (kuitu 9,7 g, polyolit 0 g). Fineli #28937:n hiilihydraattiarvoa ei verrata määrällisesti AFCD:n arvoon, koska sen painoperusta on varmistamatta. Lähteitä ei yhdistetä eikä Finelin lukua käsitellä kokonais­hiilihydraattina. USDA SR Legacy -tietueen Deglet Noor -taateleissa ilmoitetaan 75,03 g kokonaishiilihydraattia erotuslaskulla ja 8,0 g kuitua/100 g; erotus noin 67,03 g on vain imeytyvän hiilihydraatin likiarvo, ei USDA:n suoraan ilmoittama arvo. AFCD on australialainen, vanhaan näyteaineistoon perustuva yleinen pitted-date-tietue, joten se ei takaa tiettyä lajiketta tai tuotemerkkiä. Lähteet: [AFCD F003496](https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd/search/food/F003496), [USDA SR Legacy, Deglet Noor dates](https://www.ars.usda.gov/ARSUserFiles/80400535/Data/SR/SR28/reports/sr28fg09.pdf).

10 g kivetöntä taatelia sisältää valitulla AFCD-lähteellä 6,72 g imeytyvää hiilihydraattia koko reseptissä eli 3,36 g/annos. GI-analogi on Tamer-vaiheen taateleiden 17 lajikkeen keskiarvo 55,2 (SEM 7,7; vaihteluväli 42,8–74,6), glukoosiasteikko. Tutkimuksessa oli 19 tervettä osallistujaa; kukin lajike testattiin 9–10 henkilöllä. Tietue on `SUPPLEMENTARY`, `ANALOG`, `LOW`: lajikkeiden ja kaupallisen kuivauksen vastaavuus on epätäydellinen. Käyttö rajataan kuivattuihin taateleihin sellaisenaan, ilman jatkokuumennusta; arvoa ei siirretä tahnaan, siirappiin, tuoreisiin/puolikypsiin taateleihin eikä kypsennettyihin seoksiin. [AlGeffari ym. 2016, alkuperäistutkimus](https://pmc.ncbi.nlm.nih.gov/articles/PMC6074203/).

| Resepti | GK / annos | Taatelien GK-osuus | Muut pääosuudet | Luottamus |
| --- | ---: | ---: | --- | --- |
| `kiinalainen-hirssipuuro-taateleilla` | 21,19 | 1,85 | Hirssi 19,33 | LOW |
| `pohjoisafrikkalainen-kuskus-aamiaiskulho` | 34,36 | 1,85 | Kuskus 31,48; jogurtti 0,88; manteli 0,15 | LOW |

Aiempi appelsiinipuuron 21,95 on historiallinen, hylätty arvio eikä nykyinen GK-tulos. Mannasuurimoa on 31,8 g imeytyvää hiilihydraattia annoksessa; ilman hyväksyttävää GI-lähdettä koko reseptin tila on `INSUFFICIENT SOURCE DATA` ja GK `null`. Osittaisia appelsiini- tai taateliosuuksia ei julkaista reseptin GK-arvona. Kahden uuden lasketun arvon tulokset ovat 21,19 ja 34,36, molemmat LOW. Aiemmat 136 laskettua arvoa säilyivät täsmälleen, ja laskennan tilan muutos vaikuttaa merkitykselliseen reseptivertailuun yhdellä reseptillä (appelsiinipuuro muuttuu lasketusta keskeneräiseksi). GK on ainesosien GI-painotettu arvio, ei valmisaterian mitattu GI.

Leivonnaisten kategoriakeskiarvoa käytetään mannasuurimoon neljässä aiemmin lasketussa reseptissä: `intialainen-rava-uttapam`, `pohjoisafrikkalainen-baghrir`, `pohjoisafrikkalainen-msemen-hunajalla` ja `pohjoisafrikkalainen-harcha-juustolla`. Niiden reseptit ovat pannulla paistettuja tai leivonnaistyyppisiä, joten ne eivät ole vesikeitetyn puuron suora analogia; tätä vaikutusaluetta ei muutettu automaattisesti tässä erässä. Neljän hyväksytyn arvon jatkokatselmointi vaatii erillisen päätöksen. Kaksi muuta löydettyä osumaa (`pani-puri`, `intialainen-mannasuurimoupma`) olivat jo keskeneräisiä eivätkä tuottaneet GK-arvoa.

`lahi-ita-taatelipuuro-tahinilla` pysyy estettynä (`INSUFFICIENT SOURCE DATA`, GK `null`): taatelit kypsennetään puuron mukana, eikä tutkimus tue GI-sidoksen siirtämistä kypsennettyyn seokseen. Sen laskentasyöte säilyttää reseptin 10 g taatelia, 15 g tahinia ja 300 ml täysmaitoa; valmistusvaiheiden numerointi korjattiin 1–2–4:stä 1–2–3:een. Muissa laskentasyötteissä korjattiin reseptin määrävastaavuus: hirssipuuroon 2 g inkivääriä, 8 g seesamia ja 700 ml vettä; appelsiinipuuroon 130 g appelsiinia ja 300 ml vettä. Tällä kierroksella appelsiinipuuron laskenta muuttui nyt myös uusien semolina- ja appelsiinilähteiden vuoksi.

Reseptiteksteistä poistettiin sopimaton yleisohje lihan/täytteiden kypsennyksestä kahdesta puurosta ja kuskus-kulhosta; kuskuksen ohje kirjoitettiin sen listattujen aineiden mukaan. Appelsiiniohje muutettiin appelsiininkuoresta kuoritun appelsiinin paloiksi. Lähi-idän puurosta poistettiin yleinen liha-/täyteohje, mutta keitetyn taatelin GI-esto säilyy. Vastaavia EN/SV/TH-reseptitiedostoja tai julkaistuja reittejä ei löytynyt; käännöksiä ei luotu.

## Nykyinventaarioiden yhdenmukaisuus ja baseline-roolit

Yleinen nykyinventaario ja 2B6D-eräinventaario käyttävät eri muuttumattomia baselineja: yleinen näkymä vertaa 2A:n lähdecommitiin `5e9cdeb830f468ecf099e9c286f9344afe3b6b71`, ja erän näkymä 2B6D:n aloituscommitiin `f2ba9e849e677f9e223103022e309a09b9992f62`. Molempien nykyraporttien reseptijoukko on nyt 326 ja tulos 326 / 138 / 188 / 45. Baselinejen `newlyCalculated`- ja muutosluvut voivat erota, koska vertailupisteet ovat eri; nykyisten reseptirivien, GK-arvojen ja fingerprinttien pitää täsmätä.

Aiempi 138/187- ja 139/186-ristiriita koski alkuperäisen 325 reseptin joukosta tuotettuja eri ajojen inventaarioita: yleinen inventaario luettiin ennen kuin `tmp/nutrition/glycemic-load-pilot.json` oli päivitetty, eräinventaario sen jälkeen. Sama raportoitu lähdecommit ei sitonut yhteen pilotin ajonaikaisia välimuistitiedostoja. Korjaus tehtiin tuoreella content syncillä, tiukalla ravintoauditoinnilla ja GK-auditoinnilla sekä generoimalla nykyraportit peräkkäin samasta pilotista. Integroitu kattavuusauditointi ja regressiotestit vastaavat nyt 326 reseptiä, 138 laskettua ja 188 keskeneräistä; rakenne-/syöte-/lähdefingerprint-poikkeamat ovat 0/0/0. Historiallinen 325 reseptin baseline säilyy muuttumattomana.

## Kaikkien jäljellä olevien reseptien esteet

Seuraavat esteinventaarion ja priorisoinnin luvut kuvaavat alkuperäistä 325 reseptin 2B6D-tutkimusjoukkoa, eivät hotfix #122:n jälkeen kasvanutta 326 reseptin nykykokoelmaa. Alkuperäisen joukon 187 keskeneräisestä reseptistä 94:llä ravintoarvotila oli lähteistetty, 40 vaati ravintoarvojen tarkistamista ja 53:lta ravintoarvotieto puuttui. Uusi lasagneresepti ei kuulu näihin historiallisiin ryhmittelyihin.

Estoluokat menevät päällekkäin, koska samalla reseptillä voi olla useita esteitä. Alkuperäisen joukon 187 keskeneräisestä reseptistä 38 sisälsi rakennesidonnan esteen, 65 koostumusesteen, 20 massa- tai valmistustapaesteen, 81 GI-vastaavuusesteen, 42 puuttuvan GI:n ja 6 toleranssivirheen. Nämä määrät eivät summaudu 187:ään. Kaikilla kyseisen historiallisen joukon keskeneräisillä resepteillä oli vähintään yksi luokiteltu esto.

Keskeiset jäljellä olevat ongelmaryhmät priorisoituina:

| Ongelma | Vaikutus | Miksi GK:tä ei lisätty tässä erässä |
| --- | --- | --- |
| Kookosmaito | 17 reseptiä | 12 inputissa koostumus on tiedossa mutta GI puuttuu; viidessä tuotetyyppi tai massamuunnos on ratkaisematta. GI 31 koskee riisipuuroa kookosmaidolla, ei yksittäistä kookosmaitoa. |
| Soijakastike | 17 reseptiä; 3:ssa yli 1 g/annos | Luotettavaa soijakastikkeen GI-mittausta ei löytynyt. Pienet annokset arvioidaan nykyisen yhteisen alle 2 g:n toleranssin mukaan, eikä maustetta tarvitse mitata reseptikohtaisesti. |
| Tomaatti ja tomaattivalmisteet | 35 keskeneräistä reseptiä sisältää tomaatin; 23:n ensisijainen työvaihe on GI-lähteen katselmointi | GI-vastaavuus vaihtelee raa'an tomaatin, murskan, pyreen, kastikkeen ja kypsennetyn tomaatin välillä. Nykyinen inventaario osoittaa 8 ravintoarvoiltaan tuettua, 14 tarkistettavaa ja 1 puuttuvaa tapausta 23 GI-ensisijaisen reseptin ryhmässä. |
| Liemet ja liemivaihtoehdot | 43 reseptiriviä mainitsee liemen; 10 epäselvää kasvis-/kanaliemivaihtoehtoa, joista 9:ltä puuttuu koostumuslähde | Kaupallisten liemien suola, sokerit ja hiilihydraatit vaihtelevat. “Vettä tai lientä” ei ole yksi koostumus. Keittojen GI-keskiarvo ei ole yksittäisen liemen mittaus. |
| Tamarinditahna | 4 reseptiä | Hedelmien yleinen kategoriakeskiarvo ei ole perusteltu tamarinditahnan vastaavuus; hiilihydraattia on noin 2,15–4,31 g/annos. |
| Lanttu | 4 reseptiä | Laaja vihannesten kategoriakeskiarvo ei läpäise nykyistä lähde-/ruokaperhevalidointia lantulle ja reseptin kypsälle muodolle. |
| Hunaja | 4 reseptiä ilman GI-sidosta | Vuoden 2002 taulukossa on 11 hunajatyypin keskiarvo 55 ± 5, mutta käyttö vaatii reseptikohtaisen arvion siitä, lisätäänkö hunaja sellaisenaan vai kypsennetäänkö se. Se ei yksin ratkaise näiden reseptien muita koostumus- tai valmistustapaesteitä. |
| Papaija | 2 reseptiä | Papayan GI-lähteet ja testatut muodot eroavat (palat vs. sose); laaja hedelmäkeskiarvo peittäisi tämän eron. |
| Maissitortilla | 1 resepti | Nykyinen GI-tietue ei ole julkistettu riittävästi eikä vastaa reseptissä paistettua/tostadaksi valmistettua tuotetta. Ainesosan hiilihydraattiosuus on olennainen. |
| Kypsennetty taateli | 1 resepti | Uusi Tamer-vaiheen GI-tietue ei kata puuroon keitettyä taatelia. |

Nämä ovat priorisointiryhmiä, eivät riippumattomia reseptimääriä. Esimerkiksi kookosmaito, liemi ja tomaatti voivat estää samaa reseptiä samanaikaisesti. Tämän erän tutkimuksessa kookosmaitoinen riisipuuro löytyi mitattuna GI-tuloksena, mutta se on seka-ateria; lähde ei mittaa kookosmaitoa yksinään eikä sitä käytetty kookosmaidon GI:nä. [PubMed 22212476](https://pubmed.ncbi.nlm.nih.gov/22212476/).

## Seuraavan erän disjunkti potentiaali

Seuraavat ensisijaiset työlinjat jakavat alkuperäisen 325 reseptin tutkimusjoukon 187 keskeneräistä reseptiä yhteen ryhmään kerrallaan, joten niitä ei lasketa kahdesti. Luvut ovat historiallisen analyysin tuloksia eivätkä sisällä myöhemmin lisättyä lasagnea.

| Työlinja | Reseptit | Ravintoarvot tuettu | Uudelleentarkistus | Puuttuu | Käytännön potentiaali |
| --- | ---: | ---: | ---: | ---: | --- |
| A. GI-puutteet (`GI_SOURCE_REVIEW`) | 76 | 34 | 36 | 6 | Yhteisten puuttuvien tai väärin vastaavien GI-lähteiden auditointi; enintään 34:llä koostumus on jo tuettu. |
| B. Ravintoarvot (`COMPOSITION_OR_CONVERSION`) | 52 | 11 | 0 | 41 | Enintään 11 voi edetä ilman uutta koostumustutkimusta; määrät ja elintarvikevastaavuudet vaativat silti tarkistuksen. |
| C. Reseptidata (`STRUCTURE_BINDING_REVIEW` + `MANUAL_TRIAGE`) | 59 | 49 | 4 | 6 | Suurin lähteistetty ryhmä, mutta rakenteen, vaihtoehtojen, määrien ja valmistustavan manuaalinen selvitys tarvitaan ennen laskentaa. |
| **Yhteensä** | **187** | **94** | **40** | **53** | Ensisijaisen työvaiheen luokitus; luvut eivät ole luvattuja uusia GK-arvoja. |

Pieneksi seuraavaksi työn kohteeksi sopii rajattu tomaatti-GI-vastaavuuden katselmointi: 23 keskeneräistä reseptiä on ensisijaisesti `GI_SOURCE_REVIEW`-ryhmässä, joista 8:lla ravintoarvot ovat jo tuettuja, 14:llä vaativat tarkistusta ja yhdeltä puuttuvat. Ehdotus on aloittaa vain kahdeksasta tuetun koostumuksen reseptistä (`tabbouleh`, `paprikainen-vhh-gulassi`, `kana-enchilada-kukkakaalivuoka`, `ropa-vieja`, `kanapyorykat-tomaattikastike`, `paella-valenciana`, `valimerellinen-farinata-aamupalaksi`, `bouillabaisse`) ja tarkistaa samalla niiden kaikki muut GI-estot. Teoreettinen enimmäishyöty on 8 uutta GK-arviota; todennäköinen toteuma on tätä pienempi, jos muita lähde- tai valmistustapaesteitä jää. Tämä on ehdotus, ei 2B6E-työn aloitus.

## Testit ja auditointitiedostot

- Taatelien lähde-/valmistustapatesti tarkistaa lähdetiedot, fingerprintit, kaksi hyväksyttyä laskettua arvoa, mannapuuron NO MATCH -eston yli 1 g/annos hiilihydraattiosuudella ja sen, että keitetty taateli pysyy estettynä.
- Kattavuustesti vertaa historialliset 136 baseline-GK-arvoa muuttumattomaan snapshotiin, säilyttää alkuperäisen 325 reseptin eräanalyysin ja varmistaa nykyinventaarioiden tilat, GK-arvot sekä fingerprintit kaikilla 326 reseptillä.
- Koneellinen reseptikohtainen nykyinventaario: [glycemic-coverage-batch-2b6d-current.json](glycemic-coverage-batch-2b6d-current.json) ja [glycemic-coverage-batch-2b6d-current.md](glycemic-coverage-batch-2b6d-current.md).
- Muuttumaton historiallinen lähtösnapshot: [glycemic-coverage-batch-2b6d-baseline.json](glycemic-coverage-batch-2b6d-baseline.json).
- `npm run test:glycemic`: PASS, 64/64; `npm test`: PASS, 134/134.
- `npm run test:select-ci`: PASS, 12/12; `npm run test:translations`: PASS, 27/27; `npm run test:static`: PASS, 24/24.
- `npm run audit:nutrition -- --strict`: PASS, 326 reseptiä (180 lähteistettyä estimaattia / 86 riittämätöntä / 60 puuttuvaa / 0 ristiriitaa).
- `npm run audit:glycemic-load`: PASS, 326 reseptiä; 138 laskettua / 188 keskeneräistä.
- Nykyinventaarioiden generointi ja yhdenmukaisuus: PASS; molemmat sisältävät 326 reseptiä, 138 laskettua / 188 keskeneräistä, GI 45 (6 STRONG / 39 SUPPLEMENTARY), yhden uuden reseptin ja 0/0/0 fingerprint-poikkeamaa. Lasagne pysyy `null` / `INSUFFICIENT SOURCE DATA`. 2B6D-baselineen verrattuna saatiin kaksi uutta GK-arviota; aiemmat 136 arvoa eivät muuttuneet.
- `npm run build`: PASS; tiukka ravintoarvoauditointi, GK-auditointi, TypeScript, Vite ja 691 prerenderöityä reittiä onnistuivat. Vite ilmoitti olemassa olevasta suuresta JS-chunkista.
- Integraation GitHub Actions [run 40581494809](https://github.com/ozirix-dev/Reseptit/actions/runs/40581494809): PASS HEADissa `fa35f6fa80330fe8b7b23e8633f951f67ead1811`; tämä on integraation tarkistus ennen dokumentointipäivitystä. Dokumentointipäivityksen jälkeisen HEADin CI varmistetaan pushin jälkeen PR #120:n [Checks-näkymästä](https://github.com/ozirix-dev/Reseptit/pull/120/checks). Deployta ei käynnistetä.

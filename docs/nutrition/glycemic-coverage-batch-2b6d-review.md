# GK-kattavuuserä 2B6D – lähde- ja kattavuuskatsaus

## Rajaus ja lähtötilanne

Erä perustuu korjattuun 2B6C-haaraan ja sen muuttumattomaan lähtösnapshotiin `f2ba9e849e677f9e223103022e309a09b9992f62`. Reseptit PR #117 ja ReportHub PR #70 olivat tarkistettaessa edelleen Draft-tilassa. Tähän erään ei tuotu käyttöliittymä-, vaihteluväli- tai Nutritics-muutoksia. Neljän taatelireseptin ainesosa- ja valmistusohjetekstiä täsmennettiin; 10 g taatelimäärä säilyi.

| Mittari | Ennen 2B6D:tä | 2B6D:n jälkeen | Muutos |
| --- | ---: | ---: | ---: |
| Reseptit | 325 | 325 | 0 |
| GK laskettu | 136 | 139 | +3 |
| GK keskeneräinen | 189 | 186 | −3 |
| GI-tietueet | 42 | 43 | +1 |
| GK-kattavuus | 41,8 % | 42,8 % | +0,9 prosenttiyks. |

Laskettuja GK-arvoja ei poistunut eikä aiemmin lasketun 136 reseptin GK muuttunut. Uusi current-inventaario vertaa jokaisen arvon ja reseptin statuksen lähtösnapshotiin.

## Taatelin koostumuslähde, GI-lähde ja GK-laskennat

Fineli #28937 kuvaa kuivattua taatelia, joka on punnittu kivineen. Finelin sivu ilmoittaa syötäväksi osuudeksi 87 % ja imeytyväksi hiilihydraatiksi 38,2 g/100 g; Finelin ohjeen mukaan ravintoarvot ovat syötävää osaa kohti, ellei erikseen ole tarjolla kauppapainon tietuetta. Siten 10 g kivellistä taatelia sisältäisi tällä koostumuksella noin 3,32 g imeytyvää hiilihydraattia: 10 g × 0,87 × 38,158/100. Tietueen arvo on THL:n mukaan laskettu reseptistä. Metatieto säilyttää nyt oikein `per100g-edible`-perustan ja 87 % syötävän osuuden.

Resepteihin täsmennettiin kivettömät kuivatut taatelit; makroravintolaskelmissa aiemmin käytetty AFCD F003496 vastaa tätä muotoa suoremmin. Se on pitted dried date, analysoitu osuus 100 %, ja imeytyvä hiilihydraatti on 67,2 g/100 g (kuitu 9,7 g, polyolit 0 g). AFCD:n koostumus eroaa Finelin keskiarvosta enemmän kuin pelkkä 13 % kivi selittäisi. Tämä on eri koostumuslähteiden/tuote-edustavuuden ero; niitä ei yhdistetä eikä Finelin lukua käsitellä kokonais­hiilihydraattina. USDA SR Legacy -tietueen Deglet Noor -taateleissa ilmoitetaan 75,03 g kokonaishiilihydraattia erotuslaskulla ja 8,0 g kuitua/100 g; näiden erotus noin 67,03 g on tässä vain imeytyvän hiilihydraatin likiarvo, ei USDA:n suoraan ilmoittama arvo. Se tukee AFCD:n lukua, mutta on eri lajiketta. AFCD on australialainen, vanhaan näyteaineistoon perustuva yleinen pitted-date-tietue, joten se ei takaa tiettyä lajiketta tai tuotemerkkiä. Lähteet: [Fineli #28937](https://fineli.fi/fineli/fi/elintarvikkeet/28937), [Finelin koostumustietojen ohje](https://fineli.fi/fineli/content/file/7), [AFCD F003496](https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd/search/food/F003496), [USDA SR Legacy, Deglet Noor dates](https://www.ars.usda.gov/ARSUserFiles/80400535/Data/SR/SR28/reports/sr28fg09.pdf).

10 g kivetöntä taatelia sisältää valitulla AFCD-lähteellä 6,72 g imeytyvää hiilihydraattia koko reseptissä eli 3,36 g/annos. GI-analogi on Tamer-vaiheen taateleiden 17 lajikkeen keskiarvo 55,2 (SEM 7,7; vaihteluväli 42,8–74,6), glukoosiasteikko. Tutkimuksessa oli 19 tervettä osallistujaa; kukin lajike testattiin 9–10 henkilöllä. Tietue on `SUPPLEMENTARY`, `ANALOG`, `LOW`: lajikkeiden ja kaupallisen kuivauksen vastaavuus on epätäydellinen. Käyttö rajataan kuivattuihin taateleihin sellaisenaan, ilman jatkokuumennusta; arvoa ei siirretä tahnaan, siirappiin, tuoreisiin/puolikypsiin taateleihin eikä kypsennettyihin seoksiin. [AlGeffari ym. 2016, alkuperäistutkimus](https://pmc.ncbi.nlm.nih.gov/articles/PMC6074203/).

| Resepti | Vanha GK / annos | Uusi GK / annos | Taateleiden GK-osuus | Muut pääosuudet | Luottamus |
| --- | ---: | ---: | ---: | --- | --- |
| `kiinalainen-hirssipuuro-taateleilla` | 20,39 | 21,19 | 1,85 | Hirssi 19,33 | LOW |
| `pohjoisafrikkalainen-taatelipuuro-appelsiinilla` | 22,45 | 23,25 | 1,85 | Mannasuurimo 18,44; appelsiini 2,95 | LOW |
| `pohjoisafrikkalainen-kuskus-aamiaiskulho` | 33,56 | 34,36 | 1,85 | Kuskus 31,48; jogurtti 0,88; manteli 0,15 | LOW |

Finelin arvoa käytettiin aiemmassa GK-syötteessä suoraan, ilman reseptin pitted-muodon mukaista lähdettä. Lähteen yhtenäistäminen AFCD:hen nosti kutakin arviota 0,80 GK-yksikköä/annos (tarkka laskennallinen muutos +0,8015592). Tulkinta ei muutu: kaikki kolme pysyvät samalla GK-luokalla, mutta lukuarvo muuttuu. GK on ainesosien GI-painotettu arvio, ei valmisaterian mitattu GI.

`lahi-ita-taatelipuuro-tahinilla` pysyy estettynä (`INSUFFICIENT SOURCE DATA`, GK `null`): taatelit kypsennetään puuron mukana, eikä tutkimus tue GI-sidoksen siirtämistä kypsennettyyn seokseen. Sen laskentasyöte säilyttää reseptin 10 g taatelia, 15 g tahinia ja 300 ml täysmaitoa. Muissa laskentasyötteissä korjattiin reseptin määrävastaavuus: hirssipuuroon 2 g inkivääriä, 8 g seesamia ja 700 ml vettä; appelsiinipuuroon 130 g appelsiinia ja 300 ml vettä. Nämä muutokset eivät vaikuttaneet kolmessa taatelireseptissä GK-lukuihin lukuun ottamatta taatelikoostumuksen lähdepäivitystä.

Reseptiteksteistä poistettiin sopimaton yleisohje lihan/täytteiden kypsennyksestä kahdesta puurosta ja kuskus-kulhosta; kuskuksen ohje kirjoitettiin sen listattujen aineiden mukaan. Appelsiiniohje muutettiin appelsiininkuoresta kuoritun appelsiinin paloiksi. Lähi-idän puurosta poistettiin yleinen liha-/täyteohje, mutta keitetyn taatelin GI-esto säilyy. Vastaavia EN/SV/TH-reseptitiedostoja tai julkaistuja reittejä ei löytynyt; käännöksiä ei luotu.

## Kaikkien jäljellä olevien reseptien esteet

Koneellinen inventaario sisältää kaikki 325 reseptiä ja jokaisen 186 keskeneräisen reseptin estoviestit, luokat, ainesosakohtaiset tietueet ja seuraavat toimet. 93 keskeneräisellä reseptillä ravintoarvotila on lähteistetty, 40 vaatii ravintoarvojen tarkistamista ja 53:lta ravintoarvotieto puuttuu.

Estoluokat menevät päällekkäin, koska samalla reseptillä voi olla useita esteitä. Keskeneräisistä resepteistä 38 sisältää rakennesidonnan esteen, 65 koostumusesteen, 20 massa- tai valmistustapaesteen, 81 GI-vastaavuusesteen, 41 puuttuvan GI:n ja 6 toleranssivirheen. Nämä määrät eivät summaudu 186:een. Kaikki keskeneräiset reseptit sisältävät vähintään yhden luokitellun eston.

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

Seuraavat ensisijaiset työlinjat jakavat kaikki 186 keskeneräistä reseptiä yhteen ryhmään kerrallaan, joten reseptejä ei lasketa kahdesti. Ravintoarvotila kertoo lähteistettyjen koostumusten tämänhetkisestä valmiudesta, ei takaa GK-laskelman valmistumista.

| Työlinja | Reseptit | Ravintoarvot tuettu | Uudelleentarkistus | Puuttuu | Käytännön potentiaali |
| --- | ---: | ---: | ---: | ---: | --- |
| A. GI-puutteet (`GI_SOURCE_REVIEW`) | 75 | 33 | 36 | 6 | Yhteisten puuttuvien tai väärin vastaavien GI-lähteiden auditointi; enintään 33:lla koostumus on jo tuettu. |
| B. Ravintoarvot (`COMPOSITION_OR_CONVERSION`) | 52 | 11 | 0 | 41 | Enintään 11 voi edetä ilman uutta koostumustutkimusta; määrät ja elintarvikevastaavuudet vaativat silti tarkistuksen. |
| C. Reseptidata (`STRUCTURE_BINDING_REVIEW` + `MANUAL_TRIAGE`) | 59 | 49 | 4 | 6 | Suurin lähteistetty ryhmä, mutta rakenteen, vaihtoehtojen, määrien ja valmistustavan manuaalinen selvitys tarvitaan ennen laskentaa. |
| **Yhteensä** | **186** | **93** | **40** | **53** | Ensisijaisen työvaiheen luokitus; luvut eivät ole luvattuja uusia GK-arvoja. |

Pieneksi seuraavaksi työn kohteeksi sopii rajattu tomaatti-GI-vastaavuuden katselmointi: 23 keskeneräistä reseptiä on ensisijaisesti `GI_SOURCE_REVIEW`-ryhmässä, joista 8:lla ravintoarvot ovat jo tuettuja, 14:llä vaativat tarkistusta ja yhdeltä puuttuvat. Ehdotus on aloittaa vain kahdeksasta tuetun koostumuksen reseptistä (`tabbouleh`, `paprikainen-vhh-gulassi`, `kana-enchilada-kukkakaalivuoka`, `ropa-vieja`, `kanapyorykat-tomaattikastike`, `paella-valenciana`, `valimerellinen-farinata-aamupalaksi`, `bouillabaisse`) ja tarkistaa samalla niiden kaikki muut GI-estot. Teoreettinen enimmäishyöty on 8 uutta GK-arviota; todennäköinen toteuma on tätä pienempi, jos muita lähde- tai valmistustapaesteitä jää. Tämä on ehdotus, ei 2B6E-työn aloitus.

## Testit ja auditointitiedostot

- Taatelien lähde-/valmistustapatesti tarkistaa lähteen tiedot, fingerprintit, kolmen lasketun arvon ja sen, että keitetty taateli pysyy estettynä.
- Kattavuustesti vertaa kaikkia lähtötilanteessa laskettuja 136 GK-arvoa muuttumattomaan snapshotiin sekä varmistaa, että kaikilla 186 keskeneräisellä reseptillä on luokiteltu este.
- Koneellinen, reseptikohtainen lähtö- ja nykyinventaario: [`glycemic-coverage-batch-2b6d-current.json`](glycemic-coverage-batch-2b6d-current.json) ja [`glycemic-coverage-batch-2b6d-current.md`](glycemic-coverage-batch-2b6d-current.md).
- Muuttumaton lähtösnapshot: [`glycemic-coverage-batch-2b6d-baseline.json`](glycemic-coverage-batch-2b6d-baseline.json).
- `npm run test:glycemic`: PASS, 60/60; `npm test`: PASS, 129/129.
- `npm run audit:nutrition -- --strict`: PASS, 180 / 86 / 59 / 0.
- `npm run audit:glycemic-load`: PASS, 325 reseptiä; 139 laskettua / 186 estettyä.
- Eräinventaario: PASS; kolme uutta arviota, 0 aiemmin lasketun arvoa muuttui, fingerprint-mismatchit 0/0/0.
- `npm run test:translations`: PASS, 27/27. Neljän taatelireseptin julkaistuja EN/SV/TH-käännösreittejä ei ole.
- `npm run build`: PASS; tiukka ravintoarvoauditointi, GK-auditointi, TypeScript, Vite ja 690 prerenderöityä reittiä onnistuivat. Vite ilmoitti olemassa olevasta suuresta JS-chunkista.
- GitHub Actions: PR #120:n aiempi build PASS; korjauksen jälkeinen HEAD odottaa.

# GK-kattavuuserä 2B6D – lähde- ja kattavuuskatsaus

## Rajaus ja lähtötilanne

Erä perustuu korjattuun 2B6C-haaraan ja sen muuttumattomaan lähtösnapshotiin `f2ba9e849e677f9e223103022e309a09b9992f62`. Reseptit PR #117 ja ReportHub PR #70 olivat tarkistettaessa edelleen Draft-tilassa. Tähän erään ei tuotu käyttöliittymä-, vaihteluväli- tai Nutritics-muutoksia. Neljän taatelireseptin ainesosa- ja valmistusohjetekstiä täsmennettiin; 10 g taatelimäärä säilyi.

| Mittari | Ennen 2B6D:tä | 2B6D:n jälkeen | Muutos |
| --- | ---: | ---: | ---: |
| Reseptit | 325 | 325 | 0 |
| GK laskettu | 136 | 139 | +3 |
| GK keskeneräinen | 189 | 186 | −3 |
| GI-tietueet | 42 | 45 | +3 |
| GK-kattavuus | 41,8 % | 42,8 % | +0,9 prosenttiyks. |

Laskettuja GK-arvoja ei poistunut eikä aiemmin lasketun 136 reseptin GK muuttunut. Uusi current-inventaario vertaa jokaisen arvon ja reseptin statuksen lähtösnapshotiin.

## Taatelin koostumuslähde, GI-lähde ja GK-laskennat

Fineli #28937 kuvaa kuivattua taatelia, joka on punnittu kivineen. Sivulla näkyvät 87 %:n syötävä osuus ja 38,2 g imeytyvää hiilihydraattia/100 g, mutta tietue ei kerro, koskeeko ravintoarvo syötävää osaa vai kauppapainoa. THL:n yleisohje sanoo, että ravintoarvot ilmoitetaan yleensä syötävää osaa kohti, mutta kuorineen tai muuten syötäväksi kelpaamattoman osan kanssa myytävistä elintarvikkeista annetaan arvot sekä syötävälle osalle että kauppapainolle. Finelin julkinen sivu ei näytä tämän taatelitietueen kahta arvoa tai yksiselitteistä perustaa. Siksi tietueen perustaksi on merkitty `unresolved`: 87 %:a ei kerrota uudelleen 38,158 g/100 g -arvolla, eikä 3,32 g:n annosväitettä tehdä. Tietuetta ei käytetä GK-laskennassa ennen perustan vahvistamista. Lähteet: [Fineli #28937](https://fineli.fi/fineli/fi/elintarvikkeet/28937), [THL:n Fineli-aineistojen ohje](https://fineli.fi/fineli/content/file/8).

## Mannasuurimon ja appelsiinin GI-tarkistus

Keitetyn mannapuuron aiempi GI 58 oli leivonnaisten kategoriakeskiarvo eikä osoittanut vesikeitetyn puuron valmistustapaa. Se poistettiin tästä laskennasta. Riippumaton lähdetarkistus löysi suoran mannasuurimomittauksen: Mani ym. (1992) raportoivat GI 55 ± 9 vehnämannasuurimolle, joka höyrytettiin ja hyytelöitiin 5 g maapähkinäöljyn kanssa. Vuoden 2021 kansainvälisen taulukon Supplemental Table 2 -tietue 2762 vahvistaa GI 55 ± 9, kuusi tyypin 2 diabetesta sairastavaa osallistujaa, 50 g imeytyvää hiilihydraattia, glukoosiasteikon sekä vain 0/60/120 minuutin näytteenoton ilman toistettua vertailuruokaa. Taulukko luokittelee mittauksen menetelmäpoikkeamien vuoksi täydentävään taulukkoon. Lähde koskee samaa viljalajia ja veteen kypsennyksen aikana hyytelöityvää mannasuurimoa, mutta höyrytys ja öljy eroavat reseptin vesikeitosta. Sitä käytetään siksi vain matalan luottamuksen ainesosaanalogiana: `SUPPLEMENTARY / ANALOG / LOW`, GI 55. Se ei ole reseptin tai seka-aterian mittaus. [Mani ym. 1992](https://doi.org/10.1079/BJN19920102), [PubMed 1445824](https://pubmed.ncbi.nlm.nih.gov/1445824/), [International Tables 2021, Supplemental Table 2, kohta 2762](https://nutritotal.com.br/pro/wp-content/uploads/sites/3/2021/09/Tabela2_IG.pdf).

Appelsiinin aiempi hedelmäkategoriakeskiarvo 51 korvattiin suoraan mitatulla raaka-appelsiinilla. International Tables 2021 Supplemental Table 1, kohta 1150, raportoi navel-appelsiinille GI 45 ± 5; mittaus tehtiin standardimenetelmällä 10 terveellä aikuisella, 50 g imeytyvää hiilihydraattia ja glukoosivertailu. Reseptin appelsiinin lajiketta ei tunneta, joten lähdetietue on `STRONG` mutta reseptisidos `ANALOG / LOW`. [International Tables 2021, Supplemental Table 1, kohta 1150](https://nutritotal.com.br/pro/wp-content/uploads/sites/3/2021/09/Tabela1_IG.pdf).

Resepteihin täsmennettiin kivettömät kuivatut taatelit; makroravintolaskelmissa käytetty AFCD F003496 vastaa tätä muotoa suoremmin. Se on pitted dried date, analysoitu osuus 100 %, ja imeytyvä hiilihydraatti on 67,2 g/100 g (kuitu 9,7 g, polyolit 0 g). Fineli #28937:n hiilihydraattiarvoa ei verrata määrällisesti AFCD:n arvoon, koska sen painoperusta on varmistamatta. Lähteitä ei yhdistetä eikä Finelin lukua käsitellä kokonais­hiilihydraattina. USDA SR Legacy -tietueen Deglet Noor -taateleissa ilmoitetaan 75,03 g kokonaishiilihydraattia erotuslaskulla ja 8,0 g kuitua/100 g; erotus noin 67,03 g on vain imeytyvän hiilihydraatin likiarvo, ei USDA:n suoraan ilmoittama arvo. AFCD on australialainen, vanhaan näyteaineistoon perustuva yleinen pitted-date-tietue, joten se ei takaa tiettyä lajiketta tai tuotemerkkiä. Lähteet: [AFCD F003496](https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd/search/food/F003496), [USDA SR Legacy, Deglet Noor dates](https://www.ars.usda.gov/ARSUserFiles/80400535/Data/SR/SR28/reports/sr28fg09.pdf).

10 g kivetöntä taatelia sisältää valitulla AFCD-lähteellä 6,72 g imeytyvää hiilihydraattia koko reseptissä eli 3,36 g/annos. GI-analogi on Tamer-vaiheen taateleiden 17 lajikkeen keskiarvo 55,2 (SEM 7,7; vaihteluväli 42,8–74,6), glukoosiasteikko. Tutkimuksessa oli 19 tervettä osallistujaa; kukin lajike testattiin 9–10 henkilöllä. Tietue on `SUPPLEMENTARY`, `ANALOG`, `LOW`: lajikkeiden ja kaupallisen kuivauksen vastaavuus on epätäydellinen. Käyttö rajataan kuivattuihin taateleihin sellaisenaan, ilman jatkokuumennusta; arvoa ei siirretä tahnaan, siirappiin, tuoreisiin/puolikypsiin taateleihin eikä kypsennettyihin seoksiin. [AlGeffari ym. 2016, alkuperäistutkimus](https://pmc.ncbi.nlm.nih.gov/articles/PMC6074203/).

| Resepti | GK / annos | Taatelien GK-osuus | Muut pääosuudet | Luottamus |
| --- | ---: | ---: | --- | --- |
| `kiinalainen-hirssipuuro-taateleilla` | 21,19 | 1,85 | Hirssi 19,33 | LOW |
| `pohjoisafrikkalainen-taatelipuuro-appelsiinilla` | 21,95 | 1,85 | Mannasuurimo 17,49; appelsiini 2,60 | LOW |
| `pohjoisafrikkalainen-kuskus-aamiaiskulho` | 34,36 | 1,85 | Kuskus 31,48; jogurtti 0,88; manteli 0,15 | LOW |

Taatelit ovat kaikissa kolmessa edelleen 3,36 g imeytyvää hiilihydraattia/annos ja niiden GI-osuus on 1,85472. Mannasuurimon ja appelsiinin lähteiden vaihto laski appelsiinipuuron aiempaa välitulosta yhteensä 1,30 GK-yksikköä (−0,954 mannasuurimosta ja −0,347 appelsiinista). Yksi arvo muuttui numeerisesti; resepti pysyy HIGH-luokassa ja kolmen reseptin keskinäinen järjestys säilyy. Siksi 0 GK-arvoa muuttui tulkinnan tai reseptivertailun kannalta olennaisesti. GK on ainesosien GI-painotettu arvio, ei valmisaterian mitattu GI.

Leivonnaisten kategoriakeskiarvoa käytetään mannasuurimoon neljässä aiemmin lasketussa reseptissä: `intialainen-rava-uttapam`, `pohjoisafrikkalainen-baghrir`, `pohjoisafrikkalainen-msemen-hunajalla` ja `pohjoisafrikkalainen-harcha-juustolla`. Niiden reseptit ovat pannulla paistettuja tai leivonnaistyyppisiä, joten ne eivät ole vesikeitetyn puuron suora analogia; tätä vaikutusaluetta ei muutettu automaattisesti tässä erässä. Neljän hyväksytyn arvon jatkokatselmointi vaatii erillisen päätöksen. Kaksi muuta löydettyä osumaa (`pani-puri`, `intialainen-mannasuurimoupma`) olivat jo keskeneräisiä eivätkä tuottaneet GK-arvoa.

`lahi-ita-taatelipuuro-tahinilla` pysyy estettynä (`INSUFFICIENT SOURCE DATA`, GK `null`): taatelit kypsennetään puuron mukana, eikä tutkimus tue GI-sidoksen siirtämistä kypsennettyyn seokseen. Sen laskentasyöte säilyttää reseptin 10 g taatelia, 15 g tahinia ja 300 ml täysmaitoa; valmistusvaiheiden numerointi korjattiin 1–2–4:stä 1–2–3:een. Muissa laskentasyötteissä korjattiin reseptin määrävastaavuus: hirssipuuroon 2 g inkivääriä, 8 g seesamia ja 700 ml vettä; appelsiinipuuroon 130 g appelsiinia ja 300 ml vettä. Tällä kierroksella appelsiinipuuron laskenta muuttui nyt myös uusien semolina- ja appelsiinilähteiden vuoksi.

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
- `npm run test:glycemic`: PASS, 60/60; `npm test`: PASS, 130/130.
- `npm run audit:nutrition -- --strict`: PASS, 180 / 86 / 59 / 0.
- `npm run audit:glycemic-load`: PASS, 325 reseptiä; 139 laskettua / 186 estettyä.
- Eräinventaario: PASS; 325 reseptiä, 139 laskettua / 186 keskeneräistä, GI 45 (6 STRONG / 39 SUPPLEMENTARY), kolme uutta arviota, 0 aiemmin lasketun arvoa muuttui, fingerprint-mismatchit 0/0/0.
- `npm run test:translations`: PASS, 27/27. Neljän taatelireseptin julkaistuja EN/SV/TH-käännösreittejä ei ole.
- `npm run build`: PASS; tiukka ravintoarvoauditointi, GK-auditointi, TypeScript, Vite ja 690 prerenderöityä reittiä onnistuivat. Vite ilmoitti olemassa olevasta suuresta JS-chunkista.
- GitHub Actions: [run 40526175554](https://github.com/ozirix-dev/Reseptit/actions/runs/40526175554) PASS Reseptit-HEADille `b7bbb6d3a5f190e7a74d3ce1e8ba54ec03ccdd2a` (build PASS, deploy ohitettu). [PR #120:n tarkistusnäkymä](https://github.com/ozirix-dev/Reseptit/pull/120) on lähde myöhemmän dokumenttipäivityksen viimeiselle tarkistusajolle.

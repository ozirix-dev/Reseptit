# SOURCE-01 – loppuraportti ja vaiheen 1 päätösaineisto

Päiväys **2.11.2026**. Repository `ozirix-dev/Reseptit`. Tutkittu main-snapshot `c5393a10a07fdb5f97bd50a1d14f2747f4488cbe`. **Tutkimus valmis katselmointiin; vaiheen 1 omistajahyväksyntä puuttuu.** Uusia lähteitä tai ravintoarvoja ei ole hyväksytty tuotantoon.

Suositus on hyväksyä lähdekohtaiset määritelmät, yhteinen SQLite/D1-kenttäsopimus ja alla rajattu paikallinen jatkopilotti. NEVO tarjoaa laajimman ehdokasjoukon, Frida selkeän versionoidun latauspaketin ja MEXT kohdennetut japanilaiset tietueet. Hyödyn pääraja on edelleen polyolien näyttö sekä reseptin tarkka tuote-, tila- ja massavastaavuus. Tutkimus ei osoita vielä yhtään kokonaan palautettavaa neljän ravintoarvon reseptiä. Hakutulos ei ole laskennan hyväksyntä.

Tämä erillinen dokumentaatiotyö täydentää [Cloudflare-suunnitelman Draft-PR #172](https://github.com/ozirix-dev/Reseptit/pull/172) vaiheen 1 riippuvuutta. Tarkistettu suunnitelma-HEAD `1a3ba27d8b7f738d22e8a6b899bb3b0081560507`; sen haaraa ei muutettu. Aktiivisia reseptejä, laskentamoottoria, käännöksiä tai lähderekistereitä ei muutettu. Muiden SOURCE-01/GK80-istuntojen työpuihin ei kirjoitettu. Ei Cloudflare-resursseja, siirtoja, buildia, deployta tai GitHub Actions -käynnistyksiä.

## A. Nykyinen ravintoarvokattavuus

Inventaario koskee 326 suomenkielisen lähdereseptin neljää julkaistavaa lukua: netto- ja kokonais-CHO, proteiini ja rasva / annos. Laskentanäyttö tarkistettiin nykyisen moottorin verifierillä, resepti-input-hashilla, batch-sidoksella sekä olemassa olevien rajattujen erikoislaskentojen lähdetiedostotarkistuksilla. Tämä ei ole käännösten eikä ihmishyväksyntöjen auditointi.

| Havainto | Määrä |
|---|---:|
| Kaikki neljä arvoa olemassa | 261 reseptiä |
| Yksi tai useampi puuttuu | 65 reseptiä |
| Kaikki neljä puuttuvat | 65 reseptiä |
| Vain osa neljästä olemassa | 0 reseptiä |
| Julkaistut arvot, mutta nykyinen laskentanäyttö puuttuu/ei kelpaa | 55 reseptiä / 220 arvoa |
| Kaikki neljä ja nykyinen automatisoitu laskentanäyttö kunnossa | 206 reseptiä |
| Puuttuva näyttötiedosto ja kaikki arvot puuttuvat | 59 reseptiä |
| Muu pidätetty/riittämätön lähdeaineisto, kaikki arvot puuttuvat | 6 reseptiä |

Kaikkien 55 julkaistun reseptin näyttöaukon syy tässä snapshotissa on `Calculation evidence file is missing`. Tätä ei pidä sekoittaa 65 reseptin puuttuviin arvoihin. Verifierin tilajakauma: `ESTIMATE WITH EVIDENCE` 206, `INSUFFICIENT SOURCE DATA` 61 (=55 julkaistua näyttöaukkoa+6 pidätettyä), `MISSING` 59. `ESTIMATE WITH EVIDENCE` ei yksin todista ihmisen tarkastusta.

Aiemman scratch-tutkimuksen vanha main `583fdb91aeb12114f909412b9165fc3b02a6515d` antoi 265/61/60 (kaikki neljä / puuttuvia / julkaistun näytön aukkoja). Näitä ei käytetä nykytilan lukuina. Mainin myöhemmät muutokset on huomioitu uudessa erillisessä worktreessä.

Reseptikohtainen tarkistuslista ja hashit: [baseline.json](baseline.json). Lukevan inventaarion uusintaohje on raportin lopussa. Lähteiden tutkimus ei korjannut tai poistanut näitä arvoja.

## B. Tutkitut tietokannat ja laajuus

Vertailu on 2.11.2026 tarkistettu tilanne, ei lupaus tulevasta päivitysaikataulusta. Tarkat viralliset URL:t, versiot, käyttöoikeus- ja määrittelylinkit: [sources.json](sources.json). Ladattujen tutkimusnäytteiden SHA-256:t ja tiedostolokaattorit: [evidence-manifest.json](evidence-manifest.json). Verkkosivun sisäinen endpoint ei ole dokumentoitu julkinen API-sopimus.

| Tietokanta / ylläpitäjä | Tarkistettu versio ja laajuus | Pääsy / soveltuvuus |
|---|---|---|
| [NEVO / RIVM](https://www.rivm.nl/en/dutch-food-composition-database) | 2025/9.0, 2 328 ruokaa, noin 130 ravintotekijää | Yksittäiset verkkotietueet, valinnan Excel/CSV, koko paketti ehtojen hyväksynnällä/pyynnöllä. 17 kohdennettua näytettä. Perusraaka-aineisiin hyvä ehdokas. |
| [Thai FCD / Mahidol INMU](https://inmu.mahidol.ac.th/thaifcd/) | Sivusto v3 Aug 2025; tarkastellut PDF:t viittaavat v2 Sep 2018. Kokonaismäärää ei varmennettu. | Haku ja yksittäinen PDF. 3 näytettä. Kaupalliset oikeudet ja version ristiriita HOLD. |
| [MEXT / Japani](https://fooddb.mext.go.jp/) | 8. painos +2023 täydennys, 27.3.2026 korjattu Excel, web-päivitys 9.6.2026. 2 538 ruokaa tarkistetussa päätaulukossa. | XLSX/PDF ja haku. 6 yksilöityä näytettä. Japanilaiset tuotteet; useita keskenään erilaisia CHO-kenttiä. |
| [CoFID / PHE:n 2021 julkaisu](https://www.gov.uk/government/publications/composition-of-foods-integrated-dataset-cofid) | 2021. Päätaulukossa 2 887 ruokariviä, **2 886 eri koodia**. | Excel ja käyttöopas. Koko päätaulukon rakennetarkistus osoitti koodikollision; CHO-ekvivalentit vaativat muunnoksen. |
| [Frida / DTU](https://doi.org/10.11583/DTU.29500682.v8) | 5.5 Nov 2025; arkiston artikkeliversio 8 Jan 2026. 1 381 FoodID:tä tarkistetussa paketissa. | Versionoitu XLSX/ODS, PDF, Figshare-metatieto-API. 3 perusruoan komponenttien läsnäolotarkistus, ei osa 27 perheen pilottia. |
| [CIQUAL / ANSES](https://doi.org/10.57745/RDMHWY) | 2025, julkaisutieto 19.11.2025, 3 484 ruokaa /74 komponenttia ohjeen mukaan | XML/XLSX, virallinen datakatalogi. Määritelmä-/komponenttitarkistus; ei reseptitason pilottia. |
| [Ruotsi / Livsmedelsverket](https://soknaringsinnehall.livsmedelsverket.se/?soktyp=1) | Julkinen haku 2026-07-01. Tarkka tämän version määrä ei varmennettu (virallinen 2025 kuvaus noin 2 300). | Excel/haku/API-tiedot. Native-kenttien ja P-kattavuuden adapteriselvitys myöhemmäksi. |
| [Norja / Mattilsynet](https://www.matvaretabellen.no/en/api/) | 2026, julkaisu 14.1.2026; virallisesti yli 2 000 ruokaa ja noin 50 ravintotekijää | Dokumentoitu julkinen JSON API. Versionoimaton vastaus sidottava päiväykseen+hashiin. Nutrient-katalogi tarkistettu, ruokakantaa ei massaladattu. |
| [IFCT / ICMR-NIN](https://www.nin.res.in/ebooks/IFCT2017.pdf) | IFCT 2017, 528 ruokaa /151 komponenttia; uudempaa virallista aineistoversiota ei varmennettu | PDF; enimmäkseen raakaruoat, munat poikkeus. Kaupalliset oikeudet ja adapteri DEFERRED. |
| [Korea / RDA-NICS](https://www.nics.go.kr/food/eng/fctFoodSrchEng/list) | Uusinta painosta ja ruokamäärää ei saatu varmennettua dynaamisesta versiovalinnasta | Haku/Excel-latausliittymä. Blank tarkoittaa puuttuvaa; version, oikeuksien ja native-kenttien selvitys DEFERRED. |

Määrä ei ole sama kuin täydellisten viiden makrokomponentin määrä. Proteiini ja rasva ovat ydinaineistoissa tarjottuja kenttiä, mutta koko kannan ei-puuttuvaa kattavuutta ei tässä laskettu. NEVO 17 ja MEXT 6 näytteissä komponentit tarkistettiin tietuekohtaisesti; Thai 3:ssa säilytettiin myös puuttuvuuden ja määritelmän ero. Kaikkien tietokantojen raakaa ja valmistettua ruokaa ei voi käsitellä yhtenä tuotteena. Tilat, syötävä osa ja yksikkömuunnokset on kuvattu [kenttäkartoituksessa](field-mapping.md).

CoFIDin, MEXT:n ja Fridan viralliset tiedostot tarkastettiin rajattujen rakenne-/määritelmäkysymysten vuoksi; niitä ei tuotu tietokantaan eikä lisätty Gitiin. Thai-näytteitä, kokonaisia työvihkoja ja PDF-aineistoja ei julkaista tässä PR:ssä. Valmiita käyttäjän scratch-aineistoja hyödynnettiin ilman uusien täysien kantojen keräämistä muista lähteistä.

## C. Oikeudet, kaupallinen käyttö ja lähdemerkinnät

Seuraavat ovat lähde- ja käyttötapakohtaisia tutkimushavaintoja. Ne eivät ole yleinen lupa kaikkiin kolmannen osapuolen aineistoihin. Yksityinen SQLite/D1/R2 ei poista lupaehtoja; raaka-aineiston säilytys, tietueiden edelleenjakelu ja laskettujen tulosten julkaisu arvioidaan erikseen.

| Lähde | Todettu ehto / lähdemerkintä | Ehdotettu rajaus ensimmäiseen jatkoon |
|---|---|---|
| NEVO | [2025 käyttöehdot](https://www.rivm.nl/sites/default/files/2025-11/Conditions-of-use-NEVO-online-2025-dataset_0.pdf): raakadata muuttamatta, lisäykset eroteltava, lähde ja versio, käyttäjiltä ei maksuja NEVO-datan käytöstä. Ohjelman ravitsemustuloksessa RIVM:n määrittelemä version sisältävä based-on-merkintä. | Ehtojen mukainen rajattu paikallinen tutkimus; julkinen kaupallinen toteutus edellyttää käyttötavan ja esityksen katselmointia. Ei väitetä CC0-lähteeksi eikä päätellä kaiken kaupallisen toiminnan olevan kiellettyä. |
| MEXT | [Virallinen ohje](https://www.mext.go.jp/a_menu/syokuhinseibun/index.htm) sallii käytön esim. kirjoissa/sovelluksissa ilman maksua tai hakemusta, lähdemerkintä vaaditaan. | Lähteen nimi, 2023 täydennys ja korjaussnapshot vientiin. Ei keksittyä CC-lisenssiä. Mahdolliset ulkopuoliset aineistot tarkistettava erikseen. |
| CoFID | [OGLv 3](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/) kaupallinenkin käyttö ehdoin, lähdemerkintä; logot ja kolmansien oikeudet rajattu. | Lähde/release/URL ja OGL-merkintä pakettiin. Tuonti silti määritelmä- ja ID-porttien takana. |
| Frida | [Versionoidun aineiston](https://doi.org/10.11583/DTU.29500682.v8) XLSX/ODS CC BY4.0. Tekijä/lähde, versio/DOI, lisenssilinkki ja tehdyt muutokset esiin. Ohje-PDF:n DTU-copyright erillinen. | Selkeä ehdokas paikalliseen kehitykseen; metadataehdot arkistoidaan. Johdannaiset nimetään johdannaisiksi. Ei koko dokumentaation jakelua datasetin lisenssin nimissä. |
| CIQUAL | [Virallisen katalogin](https://doi.org/10.57745/RDMHWY) Licence Ouverte/Etalab 2.0, lähde ja päivityspäivä, muutokset ilmoitettava. | Oikeuksien puolesta jatkotutkimusehdokas; P-kentän erytritolirajaus estää automaattisen käytön. |
| Thai FCD | [INMU:n sivustoehdot](https://inmu.mahidol.ac.th/thaifcd/): ei-kaupallinen käyttö lähdeviitteellä; kaupallinen käyttö/jäljentäminen tarvitsee INMU:n luvan, voi maksaa. | HOLD kaupalliseen D1/R2-/sivustokäyttöön. Lupaa ei saatu eikä haettu tässä tehtävässä; julkiseen PR:ään vain metadata ja linkit. |
| Ruotsi / Norja | Virallinen lähde- ja versiomerkintä; Ruotsin raakadataa koskeva muuttamattomuus, Norjan lähdeohje ja havaintomenetelmät huomioitava. Täsmällistä koko paketin lisenssi-/edelleenjakelusopimusta ei arkistoitu hyväksyttäväksi. | Ei oleteta CC0:ksi. Käyttötapakohtainen ehtosnapshot ennen tuontipakettia. |
| IFCT / Korea | Kaupallinen uudelleenkäyttö ja julkinen edelleenjakelu jäivät selvittämättä. | DEFERRED; eivät ensimmäisen paikallisen integraation sisältöä. |

NEVO-ohjelmatuloksen vaaditun englanninkielisen lähdemerkinnän ydin on `Based on data from NEVO online version 2025/9.0, RIVM, Bilthoven`; muiden lähteiden yhdistelyssä käytetään käyttöehtojen monilähteistä muotoa. Täydelliset ehdot ja voimassa oleva sanamuoto tarkistetaan arkistoidusta PDF:stä ennen käyttöönottoa. Jokaisessa tulevassa vientipaketissa oikeussnapshotin hash ja julkisen lähdemerkinnän sijainti.

## D. CHO-, kuitu- ja polyolierot

Täsmälliset kentät, koodit, sallitut muunnokset ja HOLD-säännöt ovat [field-mapping.md](field-mapping.md)-tiedostossa. Olennaiset tutkimustulokset:

- NEVO:n available-CHO sisältää polyolit ja jättää kuidun pois. Nykyinen mallin `EU_AVAILABLE` ei ole suora käännös tälle sanalle. Tunnettu P vähennetään oikeassa polussa kerran.
- NEVO:n 17 näytteen P on lähteen julkaisema nolla. Niistä 13 on menetelmäkoodiltaan logical-zero ja4 vaatii nollan johdon lisäselvityksen. Julkaistu nolla ei ole automaattisesti mitattu eikä yleiseen malliin hyväksytty nolla.
- MEXT:n massapohjainen, monosakkaridiekvivalenttinen, saatava erotus-CHO ja laaja carbohydrate ovat eri havaintoja. Näytteissä puuttuva/trace-polyoli estää täyden laskennan; `-`, `Tr`, `(0)` eivät ole sama asia.
- CoFIDin CHO-ekvivalentin muunnoksessa käyttöopas antaa poikkeuksen tärkkelys-/oligosakkaridipainotteisille ruoille. Kaikkia rivejä ei jaeta 1.05:llä. AOAC-kuitu ja NSP eivät ole vaihdettavat kentät.
- Fridan Parameter 318:n labelling-CHO voi olla summa **tai fallback erotusmenetelmään**. Valitun havainnon menetelmä on säilytettävä. FoodID 14/716/740:n polyolisumma 244 on blank, vaikka proteiini, rasva, kuitu ja CHO ovat numeerisia.
- CIQUALin polyolit 34000 **eivät sisällä erytritolia**. Energiassa käytettyä oletettua P0:aa ei julkaista luotettavana ravintotekijähavaintona; sitä ei saa päätellä takaisin energiasta.
- Thai CHOAVLDF ja CHOCDF eroavat kuidun käsittelyssä; näytteiden P:tä ei raportoitu. Puuttuva kuitu tai polyoli ei muutu nollaksi.

Nykyinen projektin kokonais-CHO muodostuu normalisoidusta saatavasta hiilihydraatista+kuidusta+polyoleista. Puuttuva osa pitää kokonaisuuden puuttuvana. Lähdekohtainen raw-havainto, tila, menetelmä ja määritelmä säilytetään johdettujen lukujen rinnalla. Vieraiden tietokantojen komponenttikoodeja ei laiteta nykyisiin Fineli-koodeihin sidottuihin `componentIds`-kenttiin.

## E. Kohdennettu 27 raaka-aineperheen pilotti

Pilotissa tarkastettiin 26 erillistä tietuetta: NEVO 17, MEXT 6 ja Thai 3; erytritolille ei löytynyt tässä pilotissa hyväksyttävää täsmällistä uutta tuotetietuetta. Tietueet haettiin uudelleen 2.11.2026 ja payload-hashit tallennettiin. MEXT:n native-koodi on viisinumeroinen (esim.04046); webin `4_04046` sisältää myös ryhmän. Thai-webin 498 ei ole natiivikoodi D87. Tätä eroa ei saa hukata tuonnissa.

11 yleisen raaka-aineen/tilan ehdokasta,10 tuotespesifikaation vaativaa,5 hylättyä tuotevastaavuutta ja1 ilman täsmällistä uutta tietuetta. **Hyväksyttyjä tuotantotietueita ja reseptin ainesosasidoksia 0.** Täsmällinen lähdetietue on yksilöity, mutta kaikkien reseptin edellytysten hyväksyntää ei ole tehty. Tietuekohtaiset komponenttien läsnäolot, menetelmäkoodit, polyolitilat, oikeusrajat ja kaikki osuneet resepti-/ainesosarivit ovat [pilot-review.json](pilot-review.json)-tiedostossa.

| Perhe | Lähde / tietue | Ongelmareseptejä¹ | Puuttuvia / näyttöaukko | Arvio |
|---|---|---:|---:|---|
| kananmuna | NEVO 83 | 41 | 22 / 19 | Raaka kokonainen kananmuna; kuoreton massa ja reseptin valmistus tarkistettava. |
| sipuli | NEVO 63 | 30 | 15 / 15 | Raaka sipuli; punasipuli ja kypsä sipuli eivät ole automaattisia vastaavuuksia. |
| valkosipuli | NEVO 830 | 23 | 11 / 12 | Raaka kynsi; jauhe ja tahna erotettava. |
| voi | NEVO 310 | 22 | 7 / 15 | Suolaamaton voi; reseptin suolaisuus ja rasvapitoisuus on vahvistettava. |
| kuohukerma | NEVO 299 | 20 | 4 / 16 | 35,3 % rasvaa; suomalaisen tuotteen rasvapitoisuus voi erota. |
| inkivääri | NEVO 832 | 16 | 11 / 5 | Tuore juuri; jauhettu mauste ei vastaa. |
| kevätsipuli | NEVO 2737 | 16 | 15 / 1 | Raaka; vihreän ja valkoisen osan käyttö voi erota. |
| kukkakaali | NEVO 14 | 17 | 1 / 16 | Raaka; riisiksi hienonnus ei ole kypsennys, pakasteen tila tarkistettava. |
| mantelijauho | NEVO 5579 | 7 | 2 / 5 | Täysrasvainen jauho; ei rasvattomaksi puristettu proteiinijauho. |
| kookosmaito | NEVO 2290 | 13 | 6 / 7 | 17,4 % rasvaa; light, kookoskerma ja tuotemerkit erotettava. |
| tofu | NEVO 5519 | 10 | 9 / 1 | Valmistamaton tofu; kiinteys, silken, maustaminen ja valutuspaino tarkistettava. |
| tempeh | NEVO 5573 | 1 | 1 / 0 | Valmistamaton tempeh; esipaistettu tai marinoitu ei vastaa. |
| vehnäjauho | NEVO 220 | 10 | 5 / 5 | Valkoinen jauho; täysjyvä ja jauhoseos eivät vastaa. |
| riisi | NEVO 5 | 35 | 25 / 10 | Kuiva valkoinen riisi; riisijauho, nuudeli, kypsä riisi ja lajikkeet erikseen. |
| mustapippuri | NEVO 823 | 22 | 6 / 16 | Tietue yhdistää mustan/valkoisen pippurin; ei täsmällinen mustapippurivastaavuus. |
| liemi | NEVO 1528 | 21 | 13 / 8 | Kuutiosta valmistettu yleisliemi ei vastaa yksilöimätöntä kasvis-/kana-/kalalientä tai fondia. |
| limettimehu | NEVO 691 | 10 | 1 / 9 | Lime kokonaisena ei ole puristettu mehu. |
| natto | MEXT 4_04046 | 1 | 1 / 0 | Itohiki-natto; kastikepussi ei sisälly. |
| miso | MEXT 17_17045 | 2 | 2 / 0 | Vaalea suolainen riisikoji-miso; makea, tumma ja dashi-miso erotettava. |
| dashi | MEXT 17_17021 | 2 | 2 / 0 | Valmis katsuobushi-kombuliemi; jauhe tai vegaaninen dashi eivät vastaa. |
| kuivattu siitake | MEXT 8_08013 | 1 | 1 / 0 | Kuivattu raaka sieni; tuore tai liotettu paino eri tietueesta. |
| nori | MEXT 9_09004 | 1 | 1 / 0 | Paahdettu kuivattu nori; maustettu korealainen gim ei vastaa. |
| soijakastike | MEXT 17_17007 | 13 | 8 / 5 | Japanilainen koikuchi; tamari, thai light/dark, makea ja vähäsuolainen eivät vastaa. |
| korianteri | THAI 498 | 19 | 6 / 13 | Coriandrum sativum; lehdet vs juuri ja siemen erotettava. |
| tamarinditahna | THAI 836 | 4 | 2 / 2 | Hakutulos Tamarindus indica on sokerilla sekoitettu Tamarine mixed with sugar without seed; ei tahna. |
| kalakastike | THAI 289 | 18 | 1 / 17 | Budu on eri fermentoitu tuote kuin Squid Brand -kalakastike. |
| erytritoli | NONE — | 16 | 2 / 14 | Brändätty Foodin-tuote: puhtaus, ainesosat ja etiketti tarvitaan; yleinen sokerialkoholi ei korvaa sitä. |

¹ Osumat ovat löytämishakujen reseptimääriä nykyisessä ongelmajoukossa, eivät hyväksyttyjä vastaavuuksia. Perheet ja lähteet menevät päällekkäin. Taulukon sarakkeet tarkoittavat reseptejä, eivät ravintoarvokenttiä. Selvästi hylätytkin haut on säilytetty, jotta virheelliset vaihtoehdot eivät palaa myöhemmin hyväksyttyinä.

Käsin tarkennetut reseptiesimerkit:

- `indonesialainen-tempeh-munakulho`:100 g tempeh ja NEVO 5573 `Tempeh unprepared` on hyvä valmistamattoman tuotteen identiteettiehdokas. Marinointi/tuotteen koostumus, reseptin valmistus sekä polyolinollan menetelmä pitää silti hyväksyä.
- `japanilainen-natto-riisikulho`:150 g natto ja MEXT 04046 (Itohiki-natto) on yksilöity ehdokas. Kastikepussia ei saa lukea mukaan lähdetietueeseen; aggregaattipolyolien:n puute estää täyden laskennan.
- `halloumimunakas`:4 kpl kananmunaa vs NEVO 83 per 100 g syötävää osaa. Tietue ei ratkaise kpl→g-muunnosta tai kypsennyksen sidosta.
- `yum-woon-sen-vhh`:40 g punasipulia ei ole automaattisesti NEVO 63:n geneerinen raaka sipuli. Tarvitaan tarkempi tyyppi tai perusteltu rajaus.
- `indonesialainen-bubur-sumsum`:100 g **riisijauhoa** ja `indonesialainen-lontong-sayur-aamiaiseksi`:100 g **riisikakkua** osuvat riisi-hakuun. NEVO 5 kuiva valkoinen riisi ei kelpaa kummankaan suoraksi korvaajaksi.
- `bibimbap`:150 g siitakesieniä ei ilmaise kuivattua painoa, joten MEXT 08013 kuivattu raaka siitake jää HOLD-tilaan. Dashi-reseptien 200 ml tarvitsee tuotekohtaisen tiheyden/valmistusnäytön. Nori/miso-rivien 150 g määrä ei ole lupa päätellä oikeaa tuotetta tai korjata reseptiä tässä työssä.
- Musta/valkoinen pippuriyhdistelmä, yleisliemi, kokonainen lime, makeutettu tamarindi ja Budu hylättiin valittujen perheiden korvaajina. Budu ei ole reseptin Squid Brand -kalakastike; kokonainen lime ei ole puristettu mehu.

Nämä ovat tuotekohtaista arviointia, eivät uusi lähderekisteri. 26 tietueen komponenttien läsnäolo ei todista koko tietokannan kattavuutta.

## F. Todistettu hyöty ja mahdollinen hyöty

| Taso | Tulos | Mitä luku tarkoittaa |
|---|---:|---|
| Kaikki 27 hakuperhettä | 113 ongelmareseptiä =61 puuttuvaa+52 näyttöaukollista | Hakuosumien unioni, sisältää hylättyjä tuotteita ja erytritolin ilman uutta tietuetta. |
| Hylkäykset ja ilman uutta tietuetta oleva perhe pois | 110 =61+49 | Ehdokashakujen unioni; yhä esim. väärä riisituote ja sipulityyppi mukana. Ei hyväksyttyjä reseptejä. |
| NEVO:n14 ei-hylättyä perhettä | 110 =61+49 | Suurin hakupinta; P-menetelmän portti kaikkien 17 näytteen käytölle. |
| MEXT 6 perhettä | 17 =12+5 | Kohdennettu japanilainen lisä, kuuluu samaan 110 joukkoon. Ei lisätä 110:een. |
| Thai 1 ei-hylätty perhe (korianteri) | 19 =6+13 | Lehti/juuri/siemen-erottelu ja käyttöoikeus edelleen auki. |
| Hyväksytyt uudet täydet reseptilaskennat | 0 | `validatedNewCalculationResults` on tyhjä; ei laskentatulosta eikä hyväksyntää. |
| Todistetusti palautettavat julkaistavat arvot | 0 osoitettu tutkimuksessa | Tämä ei tarkoita, ettei mitään olisi myöhemmin ratkaistavissa. Luotettava ennuste vaatii kaikki ainesosarivit, massat ja polyolinäytön. |

61 pilotin löytämässä puuttuvassa reseptissä on yhteensä 244 puuttuvaa julkaisukenttää. Tätä ei esitetä 244 korjattavissa olevana arvona. Koko puuttuva joukko on65 reseptiä /260 kenttää; näyttöaukot 55/220 ovat eri ryhmä. Uusi lähde voi parantaa yhtä ainesosaa ratkaisematta reseptin muita rivejä.

Useimmin toistuvat ei-hylättyjen perheiden hakuosumat ovat kananmuna 41, riisi 35, sipuli 30, valkosipuli 23 ja voi 22 ongelmareseptissä. Riisi 35 sisältää jauho-/kakku-/nuudeli-/kypsä-raaka-eroja, joten se on käsityön priorisointiluku. Näitä ei kutsuta laskentamoottorin osoittamiksi juurisyiksi.

Todellinen laskentanäyttö osoittaa jo neljässä pidätetyssä reseptissä konkreettisia aukkoja: Janssonissa anjoviksen CHO/P sekä pippurin kuitu/P; paprikaisessa gulassissa ja rogan joshissa useita mausteiden kuitu/CHO/P-aukkoja; rogan joshissa lisäksi poistettavien kokonaisten mausteiden hävikkinäyttö. Sitruuna-yrttikanassa mm. timjami, valkosipulijauhe ja sitruunankuori jäävät puutteellisiksi. Keto-mutakakku ja keto-suklaakeksit ovat omistajan päätöksellä täsmällisiin historiallisiin evidence-hasheihin sidottuja pidätyksiä. Uusi geneerinen tietue ei avaa niitä automaattisesti. Näistä syistä pelkkä perusruokien lisääminen ei riitä palautettavien reseptien määrän lupaamiseen.

Tutkimuksen todistettu hyöty on26 yksilöityä lähdetietuetta,5 väärän korvaajan poistaminen harkinnasta, lähdekohtaiset semantiikkarajat ja toistettavan hyväksyntäketjun määrittely. Kattavuuden paraneminen jää seuraavan paikallisen pilotin mitattavaksi.

## G. Kolme ensisijaista lähdettä jatkotyöhön

Järjestys koskee **rajattua paikallista integraatiotutkimusta**, ei välitöntä tuotantokäyttöä. Työmääräarviot ovat suhteellisia, eivät tehtyjä toteutuksia tai tuntisitoumuksia.

| Prioriteetti | Miksi / todellinen projektiyhteys | Rajoite ja työmäärä |
|---|---|---|
| 1. NEVO | 14 ei-hylättyä perhettä,110 reseptin löytämispinta; saatavilla tietue- ja menetelmäkoodit sekä P-aggregaatti. Perusruokien vastaavuuksia voidaan rajata. | P0:n13 logical-zeroa+4 epäselvää johtoa; ei vielä hyväksyttyä täydellistä laskentaa. Ehdollinen lisenssi. Keskisuuri: menetelmä-/oikeus- ja tuote-/massatyö. Jos nollapolitiikka ei täyty, näytteet jäävät HOLD; ei täysimittaista tuontia ennen hyötynäyttöä. |
| 2. Frida | Versionoitu 5.5-paketti, selkeät FoodID/ParameterID:t ja datasetin CC BY4.0; hyvä yhteisen SQLite/D1-tuonnin rajatun prototyypin vertailuaineisto. Sipuli/kevätsipuli/kukkakaali ovat projektissa relevantteja. | Kolmen vertailutietueen P244 puuttuu. Ei reseptimääräennustetta eikä uutta 27-perheen pilottilukua. Keskisuuri: pitkätaulukon/headerin lukeminen ja CHO 318-fallbackin erottelu. |
| 3. MEXT | 6 kohdennettua tietuetta,17 reseptin löytämispinta, mm. natto, miso ja dashi. Maksuton lähdekäyttö virallisin merkinnöin; tarkka ruokatila ja natiivikoodit. | Massa/mono/difference erot, P missing/trace ja japanilainen tuotetyyppi. Keskisuuri–suuri semantiikkatyö, mutta erittäin pieni rajattu tietuejoukko. |

CIQUAL seuraavana: käyttöehdot ja component-koodit selkeät, mutta P ei sisällä erytritolia ja per-recipe-hyötyä ei vielä mitattu. CoFID ei ole ensimmäinen yleisadapteri: ekvivalenttimuunnokset, puuttuva P-aggregaatti ja havaittu native-ID-kollisio lisäävät työtä. Thai pidetään luvan/version selvityksen takana, vaikka alueellinen tuotevalikoima olisi hyödyllinen. Ruotsi/Norja täydentävät myöhemmin vastaavuustutkimusta; IFCT/Korea jäävät perustellusti ulos ensimmäisestä toteutuksesta.

## H. Ehdotus pieneksi ensimmäiseksi integraatiopilotiksi

Tätä ei toteutettu. Alkaa vain omistajan vaiheen 1 päätöksestä ja erillisestä työpyynnöstä. Paikallinen SQLite, enintään 8 tietuetta, ei Cloudflarea:

1. NEVO 83,63,830,5573 (kananmuna, sipuli, valkosipuli, tempeh): oikeussnapshot, muuttumaton havainto, per-value-menetelmä ja P0:n HOLD. Testaa laskentakelpoisuuden portti ilman nollan pakottamista.
2. Frida FoodID 716 ja14 (sipuli/kukkakaali): samaan skeemaan eri source-ID:t; Param 244 blank säilyy. Ei yhdistetä NEVO-sipuliin automaattisesti eikä poimita P:tä toisesta tuotteesta täytteeksi.
3. MEXT 04046 ja17045 (natto/miso): native-ID:n etunollat, massa/mono/difference-kentät ja puuttuva P säilyvät erikseen.

Ensimmäiset reseptien käsin tarkistettavat sidosehdokkaat: `indonesialainen-tempeh-munakulho` ja `japanilainen-natto-riisikulho`. Tarkistetaan **kaikki** kummankin ainesosarivit, lähdeversiot, määrä-/tila-/hävikkinäyttö ja resepti-input-hash ennen yhtään tulosväitettä. Näytteen valinta ei hyväksy reseptiä. Jos P/massa/tuote jää auki, odotettu oikea tulos on HOLD ja syy, ei neljä uutta lukua.

Paikallisen pilotin onnistumisehdot: sama tiedosto toistettuna ei luo duplikaattia; muuttunut payload pysäyttää saman avaimen; CoFID 13-669:n kaltaista ristiriitaa ei hävitetä; missing/zero/trace erot säilyvät; lähteiden komponentteja ei sekoiteta; hyväksymätön havainto ei päädy vientiin. Fyysisen SQLite/D1-skeeman ja tarvittavien adapterien tarkistukset suunnitellaan toteutuksen yhteydessä, ei laajaa testiajoa tässä tutkimuksessa.

Pilotin lopuksi raportoidaan hyväksytyt/hylätyt/HOLD-tietueet, todelliset ainesosasidokset ja vasta **täydellä laskentanäytöllä** palautettavat reseptit/arvot. Vain jos hyöty ja oikeudet riittävät, laajennetaan aineistoa. Ei täysien tietokantojen sarjatuontia oletushyödyn perusteella.

## I. Vaiheen 1 hyväksyntään tarvittavat päätökset

PR #172:n vaiheen 1 poistumisehto on omistajan hyväksymä SOURCE-01-raporttiversio ja yhteinen skeemaehdotus: puuttuva/nolla, maiden erillisyys, muunnokset, reseptin versiosidos ja hyväksyntäprosessi. Tämä PR toimittaa päätettävän ehdotuksen; se ei merkitse porttia itse hyväksytyksi. Omistajan tulee sitoa päätös tämän PR:n lopulliseen commit-SHA:han.

| Päätettävä asia | Ehdotus hyväksyttäväksi | Tila tässä PR:ssä |
|---|---|---|
| Raportti ja lähtötilanne | Tässä main-snapshotissa 261/65/55; puuttuva arvo ja legacy-näyttöaukko erillisiä | Tutkittu, hyväksyntä odottaa |
| Yhteinen SQLite/D1-sopimus | [field-mapping.md](field-mapping.md): lähde+release+native-ID, raakahavainnot, erillinen normalisointi ja hyväksyntä | Kentät ja invarianssit ehdotettu; ei toteutettua DDL:ää |
| P/nolla/puuttuva | Looginen/epäselvä nolla ei automaattisesti hyväksytty P; trace/censored/missing eivät numeroita; ei nykyisten poikkeusten laajennusta | Turvallinen oletus ratkaistu ehdotuksessa, omistajapäätös odottaa |
| Lähdekohtainen CHO | Ei yleistä CHO-kenttien fallbackia; CoFID-muunnokset ja CIQUAL-erytritoli rajattu; Frida-menetelmä säilytetään | Ehdotettu sitova rajaus |
| Oikeudet ja lähdevalinnat | NEVO ehdollinen, Frida/MEXT rajattu pilotti; Thai/IFCT/Korea ja muut puutteellisesti varmennetut käyttömuodot ulos hyväksytystä tuonnista | Lähdekohtainen hyväksyntäraja odottaa |
| ID-ristiriidat | CoFID 13-669 raw-karanteeni, ei hiljaista korvaamista | Todellinen esimerkki ja käsittelyehdotus |
| Resepti ja hyväksyntä | Input-hash+main-SHA, rivi+record revision+menetelmä; ihmistarkastus ja hyväksytty paketti erikseen | Ehdotettu prosessi |
| Legacy / pidätykset | 55/220 ei hyväksytyksi siirrossa;65 puuttuvaa ja historialliset pidätykset säilyvät kunnes uusi näyttö hyväksytty | Ehdotettu käsittely; ei nykyjulkaisun muutosta |
| Omistajuus ja jatkolupa | Git master vaiheissa 1–3; rajattu 8 tietueen paikallinen vaihe 2 erikseen hyväksyttäväksi; ei rinnakkaista muokattavaa masteria | Omistajan päätös tarvitaan |

Vaiheen 1 hyväksynnän **ei tarvitse** odottaa Thai-kaupallista lupaa, CoFID-lähdekorjausta tai IFCT/Korean selvitystä, jos omistaja hyväksyy näiden nimenomaisen HOLD/DEFERRED-rajauksen. Niitä ei silloin oteta ensimmäiseen laskentadatapakettiin. Siten avoin yksittäislähteen kysymys ei muutu hiljaiseksi hyväksynnäksi eikä pakota koko tutkimusta odottamaan.

Ennen myöhempää Cloudflare-pilottia tarvitaan lisäksi paikallisen vaiheen 2 toimiva skeema/tuonti, hyväksytty paketti ja palautusnäyttö. Kuvien oikeusryhmät/manifestit, URL-siirtymä, domainit, varmistusten käyttöoikeudet ja kustannusrajat jäävät PR #172:n omiin portteihin. Tämä työ ei tarkista uudelleen Cloudflare-tilin käyttöönottovalmiutta eikä anna siirtolupaa. Julkaistun arvon näkyvyyden ratkaisu ja D1-masterin omistajuuden vaihto vaativat myöhemmät erilliset päätökset.

## Aineisto ja toistaminen

| Tiedosto | Tarkoitus |
|---|---|
| [field-mapping.md](field-mapping.md) | Yhteinen tietosopimus, kenttäkartta, muunnokset ja hyväksyntä |
| [sources.json](sources.json) | Tutkimuslähteet, versiot, laajuus, ehdot, määritelmät ja HOLD/DEFERRED-tilat; ei aktiivinen lähderekisteri |
| [baseline.json](baseline.json) | 326 reseptin julkaistut arvot, input-hashit ja nykyisen verifierin tulokset |
| [pilot-review.json](pilot-review.json) | 27 perhettä,26 tietuetta, hakuehdokkaat ja reseptisidoksen tarkistettavat rivit; ei hyväksytty laskentadata |
| [evidence-manifest.json](evidence-manifest.json) | Tutkimusnäytteiden URL/versio/lokaattori/hash; raakadata ei Gitiin |
| [audit-baseline.mts](audit-baseline.mts) | Lukee FI-reseptit ja nykyiset näyttötiedostot, kirjoittaa JSON:n vain stdoutiin |

Lukevan inventaarion toistaminen jo asennetuilla riippuvuuksilla (ei asennusta tai buildia):

```powershell
node '<existing-site-dependency-root>/node_modules/tsx/dist/cli.mjs' `
  '<report-worktree>/docs/research/source-01/audit-baseline.mts' `
  '<verified-Reseptit-worktree>' '<existing-site-dependency-root>' `
  'c5393a10a07fdb5f97bd50a1d14f2747f4488cbe'
```

Skripti tarkistaa originin ja että tutkitut reseptit, nykyiset `site/scripts`-verifierit ja `docs/nutrition` vastaavat jäädytettyä snapshotia. Se ei checkouttaa, muuta tai lataa mitään. Eri main-snapshotille tarvitaan uusi nimetty inventaario, ei vanhojen lukujen ylikirjoitusta samana tutkimuksena. Riippuvuuksien versiot ovat tutkitun mainin lockfilessä; dependency root on erikseen valittava jo asennettu `site`-hakemisto.

Pilotin löytämisrajaukset ovat JSON:n `discoveryRegex`-kentissä. Toisto: baseline-ongelmajoukko (=puuttuva julkaistu arvo tai julkaistu näyttöaukko), jokaisen FI-reseptin ingredients.item-tekstiin kirjainkoosta riippumaton regex; resepti kerran per perhe, unionissa kerran kaikkiaan. Varsinaiset tuote-/tilapäätökset tehdään erikseen eikä regexiä käytetä hyväksyntäalgoritmina. Verkkotietueiden bytes-hash voi vaihtua käyttöliittymän tai tulostusajan takia vaikka ravintosisältö ei vaihdu; snapshot ja raakarecordin semanttinen revisio ovat eri käsitteitä.

Paikallisesti tehty: yksi päivitetyn baseline-inventaarion muodostus ja sen toisto tallennettavalla skriptillä (samat yhteenvetoluvut),26 rajattua tietuehakua, virallisten taulukoiden/ohjeiden rakenne- ja määritelmävertailu, JSON:n sisäiset määrä-/viitetarkistukset ja Gitin whitespace-tarkistus. Ei testisviittiä, sivustobuildia, Actions-dispatchia tai tuotantotoimea. Dokumentaatiocommit merkitään `[skip ci]`, eikä workflow-tiedostoja muuteta.

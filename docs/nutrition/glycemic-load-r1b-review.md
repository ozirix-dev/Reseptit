# GK 2.1 R1B – laskentasyötteiden auditointi ja rajattu korjauserä

Päivitetty 2026-10-29. Tämä raportti käsittelee vain R1B:n rajattua erää. Se ei muuta GK-kaavaa, 1 g / 2 g -toleransseja, alkuperäisiä valmistusohjeita tai käyttöliittymää.

## Lähtötilanne ja julkaisuportti

- Repo: ozirix-dev/Reseptit; työhaara codex/gk-2-1-r1b; tämän raportin valmisteluhetken pohja-HEAD 8529c4ededaa69f3db06a6532533240751e4411a.
- Repo-guardin check: PASS, origin https://github.com/ozirix-dev/Reseptit.git.
- Main osoitti samaan HEADiin 8529c4ededaa69f3db06a6532533240751e4411a. Mainin Recipe site -ajo 40919916819: SUCCESS.
- R1A PR #131 tarkistettiin ennen R1B-muutoksia: OPEN, Draft, mergeable; HEAD 8cd50d697766706acdf77437768762368071ee11 ja base 8529c4ededaa69f3db06a6532533240751e4411a. Review decision ei ollut asetettu. Ajon 40925054975 build oli SUCCESS ja deploy SKIPPED Draft-tilan takia. PR #131:n sisältöä tai tilaa ei muutettu. Sille ei tehty Ready- tai Merge-toimintoa, koska PR-kohtaista interaktiivista hyväksyntää ei annettu.

## Yhteenveto päätöksistä

- Jauheliha-makaronilaatikon yleinen pasta-GI 52 poistettiin: lähde ei vastaa munalla ja maitotuotteilla sidottua, 40–50 minuuttia paistettua makaronilaatikkoa. Arvo 18.23 (pyöristämätön 18.230875, MEDIUM) palautuu keskeneräiseksi.
- Koshari: maissitärkkelyksen perunatärkkelys-/peruna-GI-sidonta poistettiin ja koostumustietue korjattiin. Tilalle ei lisätty yleistä GI-arviota. Koshari oli jo nykyisessä baseline-julkaisussa GK-arvoltaan keskeneräinen; vanha 50.57 on historiallisen laskelman merkintä, ei nykyinen julkaistu arvo.
- Yangzhou-paistettu riisi: geneerinen riisi-GI 67 poistettiin, koska lajiketta ei tunneta ja resepti jäähdyttää riisin sekä kuumentaa sen wokissa uudelleen. Kevätsipulin massa korjattiin kahdelle sipulille 30 grammaan lähteen 15 g/kpl mukaisesti. Arvo 24.71 (pyöristämätön 24.71358, HIGH) palautuu keskeneräiseksi.
- Näistä aiheutuu kattavuuteen kaksi odotettua GK-poistoa, ei uutta arvoa. Koshari ei muuta nykyistä kattavuutta.
- 326 reseptin julkaistu vertailu: 324 arvoa ennallaan; 2 laskettua palautuu keskeneräiseksi; 243 keskeneräistä korjausten jälkeen; 45 GI-tietuetta. Nettokattavuus on 83/326. Muut 321 reseptit eivät muutu. Kaikki historialliset baseline-tiedostot jätettiin muuttamatta.

## A. Jauheliha-makaronilaatikko – 14 ainesosaa

Reseptin annoskoko on 8. Jokainen reseptirivi on nyt mukana inputissa. Taulukon hiilihydraatit ovat käytettävän koostumustiedon perusteella laskettuja g/annos-arvioita.

| Ainesosa ja määrä | Koostumus / hiilihydraatti g/annos | GI-käsittely ja päätös |
|---|---|---|
| Kuivattu makaroni 400 g | Fineli #117, 66,4 g/100 g; 33,2 | GI poistettiin. Kuiva makaroni ei yksin todista GI:tä munalla ja maitotuotteilla valmistetulle ja 40–50 min paistetulle ruoalle. |
| Jauheliha 7 % 600 g | Fineli #11562; 0 | Nollahiilihydraattinen koostumustietue. Rasvaprosentti ei toimi koko makroravintokoostumuksen korvikkeena. |
| Keltasipuli 70 g | Fineli #335, 4,8 g/100 g; 0,42 | GI puuttuu; pieni osuus kirjataan nykyisen toleranssin sisään. |
| Rypsiöljy 13,5 g | Fineli #541; 0 | Lähteistetysti nolla käytettävää hiilihydraattia. |
| Raejuusto 2–5 % 500 g | Fineli #649, 2,5 g/100 g; 1,5625 | Maitotuotteen GI 35 -sidonta tuottaa noin 0,546875 GK-yksikköä; säilytetty tässä inputissa. |
| Kananmunat 6 kpl / 330 g | Fineli #858, 0,3 g/100 g; 0,12375 | GI puuttuu; kirjattu toleranssiin. |
| Maito 1,5 % 200 g | Fineli #675, 4,8 g/100 g; 1,2 | Maitotuotteen GI 35 -sidonta tuottaa noin 0,42 GK-yksikköä; säilytetty. |
| Ruokakerma 15 % 200 g | Fineli #29065, 2,7 g/100 g; 0,675 | GI puuttuu; osuus kirjattu toleranssiin. |
| Emmental 200 g | Fineli #642; 0 | Lähteistetysti nolla käytettävää hiilihydraattia. |
| Emmental 100 g | Fineli #642; 0 | Sama reseptin erillinen rivi, ei jätetty pois. |
| Valkosipulijauhe 3 g | Tarkka koostumustietue puuttuu; yläraja-arvio 0,375 | Ei GI-sidontaa; konservatiivinen pieni yläraja lasketaan kumulatiiviseen toleranssiin. |
| Mustapippuri 1 g | Fineli #11177; enintään 0,125 | Ei GI-sidontaa; fyysisesti rajattu pieni osuus lasketaan toleranssiin. |
| Paprikajauhe 2 g | AFCD F006316, 19,1 g/100 g; 0,04775 | Ei GI-sidontaa; kirjattu toleranssiin. |
| Suola 6 g | Fineli #30; 0 | Lähteistetysti nolla käytettävää hiilihydraattia. |

Pienosuuksiksi rajattu summa on 1,7665 g käytettävää hiilihydraattia annosta kohti; nykyisiä rajoja ei muutettu. Pasta on suuri olennainen osuus, eikä sille ole tässä reseptin valmistustavassa käyttökelpoista GI-lähdettä. Siksi koko reseptin GK on null. Makroravintolaskennan tiedosto puuttuu, joten reseptin vanhoja makrotietoja (37,18 g nettohiilihydraattia / 38,79 g kokonaishiilihydraattia / 47,63 g proteiinia / 27,93 g rasvaa annoksessa) ei voitu vahvistaa riippumattomalla strict-auditilla. GK-inputin laskettu hiilihydraattisumma on 37,229 g/annos eli +0,049 g verrattuna näkyvään nettohiilihydraattimäärään. Ero ei ole uskottava peruste kokonaisannoksen esittämiseen vahvistettuna. CARBOHYDRATE_ONLY-esitystä ei ehdoteta.

## B. Koshari

Kaikki 12 reseptiriviä ovat mukana; 4 annosta. Koostumussumma on 95,9125 g käytettävää hiilihydraattia annosta kohti. Riisin, pastan, linssien, sipulin ja kypsennetyn tomaattituotteen GI:tä ei korvattu geneerisillä arvioilla.

| Ainesosa ja määrä | Koostumustietue ja g hiilihydraattia/annos | Arvio |
|---|---|---|
| Kuivat ruskeat linssit 200 g | Fineli #399; 22,85 | GI jätetty nulliksi: lajike ja valmistus eivät vastaa yleistä linssikeskiarvoa. |
| Kuiva riisi 200 g | Fineli #11521; 39,5 | Lajike ja tarkka kypsennystulos eivät tue valittua GI:tä. |
| Kuiva pieni pasta 150 g | Fineli #117; 24,9 | Valmistus-/tuotekohtaista sopivaa GI:tä ei ole. |
| Sipuli 110 g | Fineli #335; 1,32 | Onion GI 15 ei ole jäljitettävissä valmistustapaan soveltuvaan alkuperäiseen ihmistutkimukseen. |
| Maissitärkkelys 16 g | Fineli #27; 3,44 | Aiempi Fineli #162 oli perunatärkkelys; sen GI 71 poistettiin. Maissitärkkelyksen GI-tutkimus ei koske friteeratun sipulin pinnoitetta. |
| Oliiviöljy 40,5 g | Fineli #536; 0 | Nolla. |
| Säilykemurskattu tomaatti 400 g | Fineli #398; 3,45 | Raaka tomaatti ei ole sopiva GI-analogia haudutetulle säilyketuotteelle. |
| Valkosipuli 7 g | AFCD F004193; 0,1785 | Koostumus mukana, GI-sidontaa ei tarvita pienosuuden vuoksi. |
| Punaviinietikka 30 g | Fineli #929; 0,0375 | Koostumus mukana, GI:tä ei asetettu. |
| Juustokumina 2 g | AFCD F003327; 0,1685 | Koostumus mukana, aiheeton dairy-keskiarvo poistettu. |
| Suola | Fineli #30; 0 | Nolla. |
| Sitruunamehu 15 g | AFCD F004726; 0,0675 | Koostumus mukana; hedelmäkeskiarvo poistettu. |

Maissitärkkelyksen koostumuskorjaus sekä valkosipulin keskikynnen massa 3,5 g (Fineli #393) päivitettiin laskentatiedostoon. Pienosuuksiksi rajattu summa on 0,452 g/annos; sipuli (1,32 g) ja maissitärkkelys (3,44 g) eivät alita yksittäisen ainesosan 1 g rajaa eikä niitä sivuuteta toleranssilla. Koko hiilihydraattisumma 95,9125 vs. strict-auditin 95,91 eroaa 0,0025 g pyöristyksestä. Strict nutrition audit -tila on ESTIMATE WITH EVIDENCE. Koko annoksen hiilihydraattimäärä on perusteltavissa arviona; tuleva CARBOHYDRATE_ONLY voisi olla arvioitava tuotetila, mutta sitä ei tässä julkaista eikä UI:ta muuteta. GK pysyy keskeneräisenä, koska useat merkittävät hiilihydraattilähteet ovat ilman reseptiin soveltuvaa GI:tä.

Makrot annosta kohti ennen → jälkeen: nettohiilihydraatti 95,71 → 95,91 g; kokonaishiilihydraatti 102,95 → 103,14 g; proteiini 22,23 → 22,26 g; rasva 12,00 → 12,03 g. Muutos johtuu korjatusta maissitärkkelyksen koostumustietueesta ja valkosipulin 2 × 3,5 g annosmassasta. Alkuperäisiä reseptimääriä tai valmistusohjetta ei muutettu.

## C. Yangzhou-paistettu riisi

Kaikki 9 ainesosaa ovat inputissa; 4 annosta.

| Ainesosa ja määrä | Koostumustietue ja g hiilihydraattia/annos | Arvio |
|---|---|---|
| Keitetty, kylmä riisi 600 g | Fineli #30346, 23,561 g/100 g; 35,3415 | GI 67 poistettiin. Lajiketta ei tunneta; riisi jäähdytetään nopeasti yön yli ja kuumennetaan wokissa. |
| Kananmuna 110 g | Fineli #858; 0,0825 | Koostumus mukana, pieni osuus toleranssissa. |
| Kuorittu katkarapu 150 g | AFCD F007433; 0 | Nolla. |
| Herneet 100 g | Fineli #370; 2,37375 | Koostumus mukana; merkittävä hiilihydraattiosuus. |
| Kypsä kinkku 100 g | Fineli #779; 0,15725 | Koostumus mukana, pieni osuus. |
| Neutraali öljy 27,4 g | Fineli #541; 0 | Nolla. |
| Soijakastike 30 g | Fineli #31; 0,7125 | Koostumus mukana. |
| Kevätsipuli 2 kpl / 30 g | AFCD F006250, 15 g/kpl; 0,345 | GI-arvoa ei sidottu; massa korjattiin aiemmasta 200 g oletuksesta. |
| Suola 0,5 tl | Fineli #30; 0 | Nolla. |

GI-vertailulähteet osoittavat, että riisilajike, kypsennys, jäähdytys ja uudelleenkuumennus voivat vaikuttaa vasteeseen, mutta eivät todista tämän reseptin GI:tä: [Strozyk ym. 2022](https://pubmed.ncbi.nlm.nih.gov/35429987/) tutki pitkää riisiä tyypin 1 diabetesta sairastavilla tuoreena ja jäähdytettynä/uudelleenkuumennettuna, ei Yangzhou-wokissa; [Chiu & Stewart 2013](https://pubmed.ncbi.nlm.nih.gov/23945407/) vertasi lajikkeita ja käsittelyjä, ei tätä reseptiä. Siksi GK palautuu keskeneräiseksi.

Inputin 39,0125 vs. strict-auditin 39,01 g/annos ero on 0,0025 g pyöristyksestä. Strict nutrition audit -tila on ESTIMATE WITH EVIDENCE. Koko annoksen hiilihydraattimäärä voidaan esittää arviona; tulevan CARBOHYDRATE_ONLY-tilan arviointi on perusteltua, mutta sitä ei oteta käyttöön tässä ajossa. Makrot annosta kohti ennen → jälkeen: nettohiilihydraatti 40,97 → 39,01 g; kokonaishiilihydraatti 43,14 → 40,38 g; proteiini 21,91 → 21,18 g; rasva 11,19 → 11,11 g. Muutos johtuu kevätsipulin annosmassan lähteistetystä korjauksesta, ei reseptiohjeen muutoksesta.

## 38 rakenteellisen sidontaeron luokittelu

Nämä 38 tunnistettiin R1A:n vanhemmassa rakenteellisessa vertailussa (vertailutilannekuva 5e9cdeb830f468ecf099e9c286f9344afe3b6b71). Luokat ovat päällekkäisiä: V = vanha vertailu-/reseptiversiosidonta; G = ryhmittely tai ainesosan puuttuminen inputista; M = määräero; C = koostumus tai valmistustila ei vastaa; U = lähde tai määrä epäselvä. Luokittelu kuvaa jatkotyön tarvetta, eikä väitä jokaista syytä lopullisesti ratkaistuksi. Nykyisessä auditissa uusia R1B:n rakenteellisia eroja on 0; aktiivisia laskentasyöte- tai näyttöhash-eroja on 0. Kaikkien alla olevien reseptien tämänhetkinen GK on null, joten nämä 38 eivät poista nykyistä julkaistua GK-arvoa.

| Resepti | Luokka | Havainto ja jatkotyö |
|---|---|---|
| carnitas-salaattitacot | G/M/U | Pico de gallo (100 g) ryhmittelee tomaatti-, punasipuli- ja korianteririvit; limen ja romainesalaatin massa ei täsmää/ole ratkaistu. |
| chow-mein | C/U | Laskennassa on geneeriset kananmunanuudelit, lähde kertoo keitetyt ja valutetut nuudelit; osterikastikkeen sokeri ja kevätsipulin massa varmistamatta. |
| falafel | M/C/U | Öljy 20 g vs. GL 500 g; 3 valkosipulinkynttä sidottu 165 g sipulitietueeseen; leivinjauheen koostumus puuttuu. |
| hunaja-sinappikana-kaalilla | C/U | Reseptin nahaton reisiliha vs. sidottu vähärasvainen reisitietue; valkosipulijauheen teelusikan massa epäselvä. |
| indialainen-poha-maapahkinoilla | M/G | Maapähkinä 20→100 g, currylehti 3→150 g; korianteri ja sitruuna puuttuvat inputista. |
| indonesialainen-pisang-goreng-aamiaiseksi | G/C | Seitsemän ainesosaa on yhdistetty banaani/kookos/palmusokeri-komposiittiin ilman erillisiä koostumuksia. |
| indonesialainen-serabi-kookospannukakku | M/C | Ruskea sokeri 30→150 g; kookos ja 150 ml maito vaativat erilliset lähderivit. |
| intialainen-mannasuurimoupma | M/C | Currylehti 5→150 g; reseptin vesi on inputissa maito-tai-vesi-vaihtoehtona. |
| intialainen-ven-pongal | M/U | Cashew 20→100 g; lähteen gheetä ei ole vastaavana rivinä; vesi/liemi-vaihtoehto. |
| janssoninkiusaus-juuriselleri | C/U | Öljyssä säilötty, valutettu anjovis ja koostumustietueen marinaditila eivät vastaa; valutuksen vaikutus tarkistettava. |
| japanilainen-hojicha-jogurtti-persimonilla | M/C | Jogurtti 200→100 g, tee 2→150 g, seesami 5→100 g. |
| japanilainen-kabocha-puuro | M/C | Kurpitsa 250→600 g, seesami 5→100 g; vesi on inputissa vesi/liemi-vaihtoehtona. |
| jerk-kana | G | Lähteessä 15 ainesosaa; GL-inputissa vain kevätsipuli. Korkea prioriteetti koko sidonnan uusintakatselmointiin. |
| jiaozi | C/U | Kotitekoinen taikina: jauho 300 g + vesi 170 ml; inputin wrapper-korvike ilman koostumusta sekä ylimääräisiä öljy/vesirivejä. |
| karibia-bammy-kassavaleipa | M/C/U | Kassavan 250 g massa puuttuu; avokado 100→120 g; limemehu on tulkittu ratkaisemattomana kokonaisena limenä. |
| karibia-maissipuuro-kookoksella | C/U | Reseptin 700 ml vesi on inputissa maito-tai-vesi-vaihtoehto; kanelille ja vaniljalle ei ole koostumussidontaa. |
| kiinalainen-musta-seesamipuuro | M/U | Seesami 10→100 g; reseptin 700 ml vesi ja inputin vaihtoehtoinen neste eroavat. |
| korealainen-kongjuk-soijapapu-riisipuuro | M/C/U | Seesami 10→100 g; suolarivi on monistunut/epäselvä; vesi on liemi-vaihtoehdossa. |
| kung-pao-kana | C/M | Lähteen 600 g kypsä riisi sidottu kuivaan riisiin ilman kypsää massaa; soijakastikkeen kaksi riviä ovat likimain samat kuin reseptin 1+2 rkl. |
| lahi-ita-pistaasijogurtti | M/U | Jogurtti 200→100 g, pistaasi 20→100 g, granaattiomena 60→190 g; ruusuveden koostumus puuttuu. |
| malesialainen-apam-balik | G/C | Kahdeksan lähderiviä yhdistetty yhdeksi maissiriviksi; muut koostumukset puuttuvat. |
| malesialainen-kaya-paahtoleipa | G/C/M | Reseptin leipä/kananmuna/voi 10 g/öljy/kookosmaito/sokeri eroaa inputin hillon 150 g ja voin 150 g sidonnasta. |
| malesialainen-roti-canai-dhalilla | M/C | Kuiva punainen linssi 100 g; koostumus löytyy mutta GI lajike-/valmistusepävarma. Currylehti 5→150 g. |
| malesialainen-roti-jala-currykanalla | C/M | Reseptin kaksi kananmunaa vs. input 110 g; kana reisiosa ja iho tarkistettava lähdettä vasten. |
| meksikolainen-kurpitsapuuro-piloncillolla | G/C | Kuusi reseptiriviä yhdistetty kurpitsa/neste-vaihtoehtoon; lähteessä vesi mutta sidonta ei rajaa nestevalintaa. |
| pav-bhaji | G/M/C | 17 lähderiviä vs. 13 inputriviä; mausteiden ryhmittely sekä öljyn ja korianterin määrät eivät ole täysin erillisiä. |
| pohjoisafrikkalainen-minttutee-kaurapuuro | G/C | Reseptin maito 200 ml ja vesi 500 ml ovat erilliset, inputissa maito-tai-vesi; tuore minttu puuttuu. |
| rendang-padang | G | 12 lähdeainesosaa mutta inputissa vain kookosmaito; kokonaisinput on rakennettava uudelleen. |
| sate-ayam | C/G/U | Maapähkinävoi 150 g sidottu voihin; kecap manis -kastikkeen sisältöä ei rekonstruoitu; lime-mehu/kokonainen lime epäselvä. |
| shoyu-kanakeitto-konjac | C/U | 100 g herkkusieni sidottu shiitakeen; konjakin koostumustietue puuttuu. |
| thai-kananmunat-kookoscurryssa | G/M/C | Reseptin 100 g kuivaa riisiä puuttuu; Mae Ploy -currytahna 20 g vs. geneerinen tahna 150 g. |
| thai-papaijajogurtti | M/C | Papaija 200→300 g, jogurtti 200→100 g, kookos 15→150 g; lime-mehu/kokonainen lime ero. |
| tunisialainen-ojja | M/U | Leipä 160→120 g; harissa 1 tl puuttuu sidonnasta. Punainen paprika ja kananmunat on jo päivitetty nykyisiin määriin. |
| vietnamilainen-chao-ga-kanapuuro | C/M/U | Reseptin kananrinta vs. inputin reisi; vesi 700 ml vs. maito/liemi-vaihtoehto; inkiväärin 2 g massa ratkaisematta. |
| vietnamilainen-hu-tieu-aamiaiskeitto | C/U | Ainesosa sanoo vesi 700 ml, mutta valmistusmaininta myös liemestä; lähderesepti itse ristiriitainen. Porsaan ulkofilee vs. geneerinen porsas. |
| vietnamilainen-papaija-kookospuuro | C/M/U | Tapioka 100 g ilman koostumusta; kookosmaito 200 ml ≈184 g; papaija 200→300 g; limemehu/kokonainen lime ja vesi/liemi ero. |
| vietnamilainen-pho-ga-aamuksi | C/U | Kananrinta vs. reisitietue; vesi/liemi-vaihtoehto; inkivääri 2 g ja tähtianis 1 g ilman koostumussidontaa. |
| xiaolongbao | C/G/U | Kotitaikina vs. wrapper-korvike; 145 g liemi + 5 g liivate/aspic yhdistetty; mustariisiviinietikka sidottu kuivan riisin koostumukseen/GI:hin. |

### Prioriteetit seuraavaan erään

1. Hu tieu: ristiriita lähteen nesteainesosan ja valmistustekstin välillä.
2. Thai-kananmunat-kookoscurryssa: lähteestä puuttuva riisi ja currytahnan suuri määräristiriita.
3. Jerk-kana ja rendang-padang: lähes kokonaan puuttuvat laskentasyötteet.
4. Pav bhaji ja carnitas: ryhmitellyt/puuttuvat ainesosat ja annosmäärät.
5. Kaya toast, pisang goreng, jiaozi ja xiaolongbao: komposiitti-/taikinatuotteiden koostumus ei vastaa lähdettä.
6. Jatka jäljelle jääviä reseptejä vain lähde- ja vaikutuskohtaisessa katselmoinnissa; älä muuta kaikkia 38 automaattisesti.

## Lähteet GI-päätöksille

- Wolever ym. 1986, 13 diabetesta sairastavaa; makaroni GI 68±8, spagetti 45±6, pastina 54±6. Tämä ei tutki uunissa paistettua munamaitopohjaista makaronilaatikkoa. [PubMed 3743316](https://pubmed.ncbi.nlm.nih.gov/3743316/).
- Lang ym. 1999, maissitärkkelys GI 95±18 terveillä miehillä vs. mung-paputärkkelys 51±13; ei friteeratun sipulin pinnoitetta. [PubMed 10357737](https://pubmed.ncbi.nlm.nih.gov/10357737/).
- Ramdath ym. 2017 testasi kahdeksan linssilajiketta (GI 10–23); lajike ei ole R1B-resepteissä täsmennetty. [PubMed 28959813](https://pubmed.ncbi.nlm.nih.gov/28959813/).
- Linssin käsittelytutkimuksessa keitetyn vihreän linssin GI oli 25±3 ja spray-kuivatun 66±6; yleinen kuiva linssi-GI ei kuvaa valmistusta. [PubMed 29751679](https://pubmed.ncbi.nlm.nih.gov/29751679/).
- Sipulin GI 10–15 esiintyy katsauksissa, mutta jäljitettävää valmistustapaan soveltuvaa alkuperäistä ihmis-GI-mittausta ei löytynyt: [Nutrients DOI 10.3390/nu12102989](https://doi.org/10.3390/nu12102989), [Advances in Nutrition DOI 10.3945/an.112.003509](https://doi.org/10.3945/an.112.003509).

## Testit, kattavuus ja julkaisuvaikutus

- Repo-guardin check: PASS.
- Strict nutrition audit: PASS, 326 reseptiä; VERIFIED 0, ESTIMATE WITH EVIDENCE 180, INSUFFICIENT SOURCE DATA 86, CONFLICT 0, MISSING 60.
- GI/GK audit: PASS, 326 / 83 laskettua / 243 keskeneräistä. Aiemman rakenteellisen vertailun sidontaeroja 38; nykyisiä input-hash-eroja 0 ja evidence-hash-eroja 0.
- Kattavuusvertailu: 326 reseptiä, 83 laskettua, 243 keskeneräistä, 45 GI-tietuetta. Uusia rakenteellisia-, input- tai näyttöeroja 0.
- GK-regressiot: 86/86 PASS.
- Koko yksikkötestisarja: 157/157 PASS.
- Staattiset testit: 24/24 PASS.
- Build: PASS; strict nutrition- ja GK-auditit sekä TypeScript/Vite/prerender onnistuvat. Vite antaa olemassa olevan suuren chunkin varoituksen (>500 kB).
- Vaikutusjoukon uudelleenlaskenta aiemmalla inputilla ja nykyisellä mallilla/koostumustiedoilla: 324/326 täsmää täysin. Vain makaronilaatikon ja Yangzhou-riisin julkaistut GK-arvot muuttuvat yllä kuvatusti. Koshari pysyy keskeneräisenä.
- Historialliset baseline-tiedostot jätettiin koskematta. Aktiivinen kattavuusraportti päivitettiin nykyiseen laskentatilaan.

GitHub Actionsin tulos tarkistetaan Draft-PR:n lopulliselle HEADille; PR:n tarkistuslinkki raportoidaan erikseen.

## Kattavuusauditin laajemman historiallisen joukon täsmennys

Kattavuusauditin aktiivinen tulos yllä on 326 reseptiä / 83 laskettua / 243 keskeneräistä / 45 GI-tietuetta. Se vertaa myös 325 reseptin aiempaan hyväksyttyyn inventaarioon, joten `newlyAdded=1` tarkoittaa yhden reseptin lisäystä suhteessa tähän vanhaan inventory-snapshotiin; nykyinen kokoelma on edelleen 326.

Kattavuusraportin `historicalStructuralBindingCount=51` viittaa laajempaan, vanhempaan rakenteelliseen populationiin. Se ei ole sama kuin R1A:n erikseen pyytämä 38 sidontaeron luettelo. Kaikilla 51:llä oli jo muita GK-esteitä vertailun alussa; binding-only-korjauksella ratkaistavia ei ollut. Näistä 10 katselmoitiin 2A:ssa, yksi laskettiin myöhemmin sisältöarvion jälkeen, 9 on edelleen keskeneräisiä ja 41 jäi aiemman erän ulkopuolelle. R1B ei laajentanut korjauksia tähän ryhmään. Tässä raportissa luetellut R1A:n 38 kohdetta säilyvät erillisenä, yksilöitynä jatkotyölistana.

Saman kattavuusajon muut vertailuluvut: `newlyCalculated=16`, `newlyBlocked=47`, `stillIncomplete=195`, `changedBlockerRecipes=131`; uudet rakenne-, input- ja evidence-erot ovat 0/0/0. Historialliset baseline-tiedostot eivät muuttuneet.
# AJO 1 / 2B6E – viiden reseptin lähdekatselmointi

**AJO 1 / 2B6E – NO CALCULATIONS APPROVED**

## Julkaistu lähtötilanne

PR #123 yhdistettiin merge-commitilla `775711c3e81fba4ad25e489f17eb83c05be99e10`. Hyväksytty PR-HEAD oli `1bc4a371b5b99febb7bf9679c63eb0112d4caf46`. [Main-CI ja Pages-deploy](https://github.com/ozirix-dev/Reseptit/actions/runs/40672505952) läpäisivät. Julkinen GK-sivu vastasi HTTP 200 ja näytti 326/137/189 ennen tutkimustyön aloitusta.

Erillinen haara `codex/glycemic-coverage-batch-2b6e` aloitettiin tästä julkaistusta mainista. Chat-projektin Ravinto-kytkentää ei käytetty kohderepona. Repo_guard vahvisti Reseptit-identiteetin. PR:t #118, #119 ja Nutritics-työpuu säilyivät koskemattomina.

[Uusi eräbaseline](glycemic-coverage-batch-2b6e-baseline.json) luotiin tuoreista auditeista write-once-scratch-tiedostoon ja tuotiin guardilla uutena tiedostona. Se sisältää 326 reseptiä, 137 laskettua, 189 keskeneräistä ja 45 GI-tietuetta (6 STRONG / 39 SUPPLEMENTARY). Historiallisia baselineja ei kirjoitettu uudelleen.

## Päätökset

| Resepti | Lähtöeste | Lopullinen avoin portti | GK/annos | Luottamus | Tila |
| --- | --- | --- | --- | --- | --- |
| `jauhelihapihvit-vhh-kermakastikkeella` | Liemen virheellinen GI | Kerman GI/kypsennysvastaavuutta ja liemen tuote-/vahvuusketjua ei varmennettu. Sipulin viitteessä on väärä DOI. | null | Ei hyväksyttyä arviota | BLOCKED |
| `vhh-kaalilaatikko` | Kerman GI-avain ja valmistus | Kerman ja kaalin valmistusvastaavuus sekä meiramin määrä/koostumus puuttuvat. | null | Ei hyväksyttyä arviota | BLOCKED |
| `som-tam-vhh-kurkkuna` | Keitettyjen vihreiden papujen GI | Papujen GI ja raaka→keitetty/valutettu massa ratkaisematta; myös kurkun lähde-/syötävä massa ja tomaatti-/pähkinäanalogia avoimia. | null | Ei hyväksyttyä arviota | BLOCKED |
| `siemengranola-jogurtilla` | Mantelin GI ja kumulatiivinen poisjättö | Paahdetun mantelilastun GI ei varmistunut; jogurtin ja vadelman GI-analogiat sekä kanelin tl-massa jäävät avoimiksi. | null | Ei hyväksyttyä arviota | BLOCKED |
| `valimerellinen-halloumi-tomaattileipa` | Hapanjuurileivän koostumus/GI | Leipä yksilöimättä; paahtovastaavuus puuttuu. Lisäksi tomaatti 100 g vs syötteen 125 g ja paistetun halloumin GI-analogia ratkaisematta. | null | Ei hyväksyttyä arviota | BLOCKED |

Julkaistujen arvojen nettolisäys **0**: 137/326 eli 42,0 %, keskeneräisiä 189. Vanhoja arvoja ei estetty eikä muutettu. Yhtään laskentasyötettä, GI-/koostumustietuetta, reseptiä tai fingerprint-sidontaa ei muutettu. Numeerista muutos-PR:ää ei avata, koska yhtään uutta hyväksyttävää arvoa ei saatu.

## Lähdehavainnot ja saatavuus

- [fineli](https://fineli.fi/fineli/fi/avoin-data): Paikallinen THL Rel20 -viite luettiin ruoka- ja mittatasolla. Live-API palautti Cloudflare-haasteen; live-arvoja tai liemireseptin laimennussuhdetta ei väitetä varmennetuksi.
- [afcd](https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd/data-files): Paikallinen AFCD Release 3 -viite ja käytettyjen food-records-rivien koostumustiedot tarkistettiin; analogian hyväksyntä ja lämpökäsittely ovat erillisiä.
- [tables2021](https://doi.org/10.1093/ajcn/nqab233): Atkinson ym. 2021, Table 1: dairy 35 (186 ruokaa), nuts 22 (3), vegetables other than potatoes 66 (91). Ryhmäkeskiarvo ei ole valmistetun kohdeainesosan mittaus. Kustantajan kokoteksti-/liitepolku ei ollut suoraan saatavilla; Table 1 löytyi indeksoidusta alkuperäisjulkaisusta ja ruokatasoiset tiedot tarkistettiin yliopiston tietokannasta.
- [sydney](https://glycemicindex.com/gi-search/): Yliopiston ruokataulukossa nut-ryhmän kolme vastaavaa riviä: cashew salted 22, mixed nuts and raisins 21, mixed nuts roasted and salted 24. Ne eivät yksilöi paahdettua mantelilastua. Sopivaa erillisen kuohukerman tai keitetyn vihreän pavun mittausta ei löytynyt tarkistuksessa. Tämä ei todista, ettei mittausta ole missään.
- [onion-correct](https://doi.org/10.3390/nu12102989): Mens sana in corpore sano -katsauksen oikea DOI on 2989, PMC7599769. Sen Table 1 sisältää yleisen sipuliluvun 15; kypsennysprotokollaa ja jäljitettävää sipulin primaarimittausta ei varmennettu. Kokoteksti luettiin Europe PMC:n XML:stä.
- [onion-wrong](https://pubmed.ncbi.nlm.nih.gov/33023067/): Katalogin DOI 10.3390/nu12103041 viittaa äidin DHA-lisän ja lapsen kehityksen tutkimukseen, ei nimettyyn GI-katsaukseen. Tämä on bibliografinen virhe; yhteistä katalogia ei muutettu erän ulkopuolella.
- [green-beans](https://doi.org/10.23880/fsnt-16000211): Hutchins & Winham 2020: pinto-/vihreiden papujen 12 viikon interventio, ei näiden keitettyjen vihreiden papujen ainesosakohtainen GI-mittaus. Sitä ei muunnettu GI-luvuksi.
- [almond](https://pubmed.ncbi.nlm.nih.gov/21276226/): Mori ym. 2011: mantelimuodot osana 75 g imeytyvää hiilihydraattia sisältävää aamiaisateriaa; seka-aterian vaikutus ei anna tämän paahdetun mantelilastun GI:tä.
- [foodin](https://foodin.fi/tuote/erytritoli-luomu-200g-2/): Valmistajan ravintoarvomerkintä: hiilihydraatti 100 g, polyolit 100 g, sokerit 0 g / 100 g. Tämä tukee yksilöidyn erytritolin nykyistä 0 imeytyvän HH:n käsittelyä, ei puuttuvan GI:n korvaamista nollalla.
- [toast](https://pubmed.ncbi.nlm.nih.gov/17426743/): Burton & Lightowler: paahtaminen muutti valkoisen leivän vastetta. Tulos ei anna yleistä kerrointa eikä GI:tä yksilöimättömälle hapanjuurileivälle.

Lähdettä ei hylätty pelkän hakutulospuutteen perusteella: nykyisen ehdokkaan mitattu ruoka/valmistus ei vastannut kohdetta tai yhteyttä ei voitu osoittaa. Hakujen negatiivinen tulos ei todista tutkimuksen olemattomuutta. Fineli-arvot tässä ovat repon hyväksytystä Rel20-viitteestä, eivät live-API:n tuoreeksi väitettyjä arvoja.

Sipulilähteen virheellinen DOI on yhteisessä katalogissa: tietuetta käyttää 48 reseptiä, joista 24 on laskettuja. Oikea katsaus löytyi DOI:lla 10.3390/nu12102989. Viitekorjaus ja kypsennetyn sipulin analogian arviointi vaativat erillisen vaikutuskatselmoinnin; tästä löydöstä ei päätellä kaikkia 24 arvoa virheellisiksi eikä niitä muuteta tässä erässä.

## jauhelihapihvit-vhh-kermakastikkeella

Annoksia 4. Liemen sidoksen yksin poistava muistissa tehty AJO 0.6 -koe ei ole hyväksytty laskenta. Nykyinen poisjättö 0,43705; liemi mukaan 1,18705; lisäksi pieni kerma ja sipuli mukaan 1,90955. Kastikkeen kerma 1,45 g/annos ylittää yksittäisen rajan ja tarvitsee GI:n.

| Ainesosa | Nykyinen laskentamassa g | Nykyinen HH g/annos | Koko ainesketjun tarkistus |
| --- | ---: | ---: | --- |
| naudan jauhelihaa | 600 | 0 | 600 g vastaa reseptiä. Fineli 11562 kuvaa 17 % jauhelihaa, mutta resepti ei yksilöi rasvaprosenttia; imeytyvä HH on tietueessa 0. Paistorasvan ja lihan koko määrä kuuluu erään. |
| kananmunaa | 55 | 0.04125 | 1 muna → 55 g kuorettomana: paikallisen Fineli 858 KPL_M vahvistaa. 0,04125 g HH/annos on tunnettu pienosuus. |
| kuohukermaa | 50 | 0.3625 | 0,5 dl → 50 g: Fineli 631 DL 100 g. 0,3625 g HH/annos. GI 35 on maitotuoteryhmän keskiarvo, ei pihvin sisällä paistetun kuohukerman mittaus. |
| sipulia | 30 | 0.36 | Pieni sipuli → 30 g: Fineli 335 KPL_S vahvistaa. 0,36 g HH/annos voidaan arvioida pienosuutena vain yhdessä muiden poisjättöjen kanssa. GI 15:n DOI ja taulukkoviite ovat virheelliset, eikä oikea katsaus osoita kypsennetyn sipulin primaarimittausta. |
| suolaa | 6.5 | 0 | 1 tl → 6,5 g: Fineli 30 TL vahvistaa; HH 0. |
| mustapippuria | 1 | 0.095775 | 0,5 tl → 1 g: Fineli 11177 TL 2 g vahvistaa. Syötteen teksti Recipe-listed edible mass on epätarkka, koska resepti antaa tl-mitan. HH 0,095775 g/annos. |
| voita | 14 | 0.028000000000000004 | 1 rkl → 14 g: Fineli 500 RKL vahvistaa; HH 0,028 g/annos. Koko lisätty voi sisältyy erään. |
| kuohukermaa | 200 | 1.45 | 2 dl → 200 g: Fineli 631 vahvistaa; 1,45 g HH/annos ylittää yksittäisen pienosuuden rajan. Kastike keitetään 5–8 min ja kuumennetaan uudelleen. GI 35:n siirrolle tähän valmistukseen ei varmennettu hyväksyttävää perustetta. |
| lihalientä | 100 | 0.75 | 1 dl → 100 g on Fineli 29:n oma mitta; 3 g/100 g → 0,750 g/annos. Tietue on yleinen LIHALIEMI, LAIMENNETTU (DISH/BOIL), ei yksilöity tuote. Resepti ei anna laimennussuhdetta, pakkausta tai liemen valmistusohjetta. Keittoryhmän GI 49 ei kelpaa liemen GI:ksi. |
| Dijon-sinappia | 5 | 0.17625 | Reseptissä Dijon, Fineli 28 on yleinen SINAPPI. 1 tl → 5 g ja 0,17625 g HH/annos ovat tämän proxyn lukuja; Dijon-tuotteen koostumusta ei yksilöity eikä vastaavuutta hyväksytty uudelleen. |
| mustapippuria | 1 | 0.095775 | Toinen 0,5 tl pippuria → 1 g ja 0,095775 g HH/annos. Molemmat pippurimäärät on laskettava mukaan. |

## vhh-kaalilaatikko

Annoksia 6. Kerman GI:n pelkkä poistaminen: 1,1775166666666668 + 0,9666666666666667 = 2,1441833333333335 g/annos, joten kumulatiivinen toleranssi ei riitä. Lisäksi 0,1 g meiramiarvio ei ole lähdenäyttöä.

| Ainesosa | Nykyinen laskentamassa g | Nykyinen HH g/annos | Koko ainesketjun tarkistus |
| --- | ---: | ---: | --- |
| valkokaalia | 900 | 7.5 | 900 g raakakaalia / 6 annosta vastaa määrää; nykyisen tietueen HH 7,5 g/annos. Kaali haudutetaan liemessä 20 min ja paistetaan 175 °C:ssa 60–70 min. GI 66 on laajan kasvisryhmän keskiarvo; tätä kaalivalmistusta ei ole osoitettu vastaavaksi. |
| naudan jauhelihaa | 500 | 0 | 500 g jauhelihaa vastaa reseptiä; Fineli 17 % jauheliha on yleinen tuotevalinta, HH 0. |
| sipuli | 55 | 0.44 | 1 sipuli → 55 g Fineli 335 KPL_M; 0,44 g HH/annos mukana nykyisessä pienosuussummassa. |
| kuohukermaa | 200 | 0.9666666666666667 | 2 dl kermaa → 200 g, 0,9666666666666667 g HH/annos. Pitkän uunikypsennyksen vastaavuutta GI 35:een ei varmennettu. Avaimen vaihto dairy-category → unflavoured-dairy ei olisi lähdeperustelu. |
| kananmunaa | 110 | 0.055 | 2 munaa → 110 g Fineli 858 KPL_M; 0,055 g HH/annos. |
| lihalientä | 100 | 0.5 | 1 dl liemi → 100 g Fineli 29, 0,5 g HH/annos. Tarkka liemen koostumus ja vahvuus jäävät avoimiksi kuten jauhelihapihveissä. |
| voita | 14 | 0.018666666666666668 | 1 rkl voita → 14 g Fineli 500; 0,018666666666666668 g HH/annos. |
| suolaa | 6.5 | 0 | 1 tl suolaa → 6,5 g Fineli 30; HH 0. |
| mustapippuria | 1 | 0.06385 | 0,5 tl pippuria → 1 g Fineli 11177; 0,06385 g HH/annos. |
| kuivattua meiramia | null | 0.1 | 1 tl kuivattua meiramia: syötteen massa ja koostumustietue puuttuvat; 0,1 g HH/annos on lähteetön arvio. Tuntematon määrä ei täytä tämän erän dokumentoidun pienosuuden vaatimusta. |

## som-tam-vhh-kurkkuna

Annoksia 4. Papujen nykyinen 1,2645 g/annos ylittää 1 g. Nykyinen poisjättö 0,36675; pähkinänkin poisjättö nostaisi sen 1,30425:een, mutta pavut ja kurkku estäisivät edelleen.

| Ainesosa | Nykyinen laskentamassa g | Nykyinen HH g/annos | Koko ainesketjun tarkistus |
| --- | ---: | ---: | --- |
| kurkkua | 500 | 1.75 | 500 g kurkkua vastaa ilmoitettua määrää, mutta siemenet poistetaan eikä punnituksen vaihetta nimetä. Kokonaisen kurkun koostumuksen ja syötävän massan vastaavuus on avoin. GI 66 ei ole kurkkukohtainen mittaus; nykyinen 1,75 g/annos ei ole pienosuus. |
| kirsikkatomaatteja | 150 | 1.3125 | 150 g kirsikkatomaatteja; tavallinen tomaatti on koostumusproxy, nykyinen HH 1,3125 g/annos. Väitetty raw tomato GI 22 -rivi jäi alkuperäisestä lähdetaulukosta varmentamatta; pelkkä nykyinen avainosuma ei hyväksy sitä. |
| vihreitä papuja | 100 | 1.2645 | Reseptissä 100 g vihreitä papuja ennen keittämisohjetta; syöte käyttää Fineli 29022:n keitetyn pavun 100 g:aa ilman saanto-/valutusmuunnosta. 1,2645 g/annos on tämän syötteen tulos, ei varmennettu kypsä annosmassa. GI 66 ei ole keitettyjen vihreiden papujen mittaus. |
| maapähkinöitä | 30 | 0.9375 | 30 g suolattomia paahdettuja maapähkinöitä; koostumusproxy on yleinen maapähkinä. GI 22:n kolmikko sisältää cashewin ja sekoituksia, ei juuri tätä tuotetta. HH 0,9375 g/annos on alle 1, mutta lähdevastaavuus ja koko summaarvio ovat silti tarpeen. |
| valkosipulia | 3.5 | 0.08925 | Valkosipuli 3,5 g on reseptissä täsmällinen; AFCD F004193 kuorittu raaka valkosipuli, nykyinen HH 0,08925 g/annos. |
| punaista chiliä | 5 | 0.06 | Chili 5 g on laskentavariantti; tai maun mukaan voi kasvattaa määrää. AFCD raaka punainen chili, nykyinen HH 0,06 g/annos koskee vain 5 g varianttia. |
| limettimehua | 30 | 0.09 | Limettimehu 30 g on massana annettu; AFCD juice-lime vastaa nimettyä muotoa, nykyinen HH 0,09 g/annos. |
| Squid Brand -kalakastiketta | 15 | 0.1275 | Squid Brand 15 g on yksilöity tuote ja massa. Nykyinen tuotetietue antaa 0,1275 g HH/annos; uusi pakkaus-/aluevariantin lähdevarmennus ei yksin ratkaisisi papu- ja kurkkuesteitä. |
| Foodin-erytritolia | 4 | 0 | Foodin erytritoli 4 g: valmistajan tuotesivu vahvistaa 100 g hiilihydraattia ja 100 g polyoleja / 100 g sekä 0 g sokeria; dokumentoitu 0 imeytyvää HH. Ei korvata puuttuvaa GI:tä numerolla 0. |

## siemengranola-jogurtilla

Annoksia 4. Nykyinen poisjättö 2,06375 g/annos. Vain hyväksyttävä manteliosuus poistaisi siitä 0,66 (jäljelle 1,40375). Sellaista GI-sidosta ei hyväksytty; rajoja tai määriä ei muutettu.

| Ainesosa | Nykyinen laskentamassa g | Nykyinen HH g/annos | Koko ainesketjun tarkistus |
| --- | ---: | ---: | --- |
| kurpitsansiemeniä | 80 | 0.42 | Kurpitsansiemenet 80 g; AFCD kuoritut kuivat siemenet, HH 0,42 g/annos. Reseptimäärä on ennen paahtoa; kuivan lähtöaineen koostumus on erotettava paahdetun tuotteen 100 g -arvoista. |
| auringonkukansiemeniä | 60 | 0.465 | Auringonkukansiemenet 60 g; AFCD kuivat siemenet, HH 0,465 g/annos, mukana poisjätössä. |
| pellavansiemenrouhetta | 40 | 0.28 | Pellavansiemenrouhe 40 g; AFCD siementietueen ja rouhitun muodon vastaavuus kirjattu proxyksi, HH 0,28 g/annos. Reseptin paahto on tarkistettava koko ketjussa. |
| mantelilastuja | 40 | 0.66 | Mantelilastut 40 g; Fineli 379 on raaka kokonainen manteli, HH 0,660 g/annos. GI 22 ei yksilöi mantelia; 160 °C / 18–22 min paahdetuille lastuille ei löytynyt hyväksyttävää mittaus- tai analogiaperustetta. Mantelia sisältävän aterian tutkimusta ei siirretä mantelille. |
| voita | 30 | 0.06 | Voi 30 g on reseptissä punnittu; Fineli 500, HH 0,060 g/annos. |
| kanelia | 2.6 | 0.17875 | Kaneli 1 tl → 2,6 g on syötteessä estimate eikä yksilöity mittalähde. AFCD-kanelin 27,5 g HH/100 g tuottaa 0,17875 g/annos, mutta massan lähde on varmennettava; määrää ei pienennetä toleranssin saavuttamiseksi. |
| maustamatonta kreikkalaista jogurttia | 400 | 4.3 | Kreikkalainen maustamaton jogurtti 400 g; Fineli 32201 on 10 % jogurtti, resepti ei määritä rasvaprosenttia. HH 4,3 g/annos; GI 35 on koko maitotuoteryhmän keskiarvo, ei tämä jogurtti. Jogurtti tarjoillaan kylmänä, ei paahdeta. |
| vadelmia | 100 | 1.725 | Vadelmat 100 g tarjoillaan raakana, AFCD raw raspberry; HH 1,725 g/annos. Hedelmien laaja GI 51 ei itsessään osoita vadelmien vastaavuutta, eikä osuus ole pienosuus. |

## valimerellinen-halloumi-tomaattileipa

Annoksia 2. Leivän tuntematon hiilihydraatti ei ole pienosuus. Nykyinen poisjättösumma 0 ei kerro leivän hiilihydraattimäärää. Määräkorjausta ei tehdä irrallisena hyväksyntänä.

| Ainesosa | Nykyinen laskentamassa g | Nykyinen HH g/annos | Koko ainesketjun tarkistus |
| --- | ---: | ---: | --- |
| halloumi | 150 | 1.875 | Halloumi 150 g; Fineli 33465 kuvaa vuohenmaitojuustoa (22 % rasvaa), mutta resepti ei yksilöi tuotetta. Paistettu halloumi ei saa hyväksyntää maitotuoteryhmän GI 35:stä pelkällä perheavaimella. Nykyinen HH 1,875 g/annos on merkittävä. |
| tomaatti | 125 | 2.15625 | Reseptissä tomaatti 100 g, GK-syötteessä 125 g ja virheellinen Recipe-listed 125 g -perustelu. Määräero on korjattava ennen mahdollista hyväksyntää. Nykyinen 2,15625 g HH/annos ei vastaa reseptin määrää. GI 22:n primaaririviä ei varmennettu. |
| oliivi | 25 | 0 | 25 g vihreitä oliiveja: Fineli kivettömän suolaliemioliivin tietue vastaa luokkaa; dokumentoitu HH 0. Syötävä kivettömän massan oletus kirjataan, ei GI 0 -korviketta. |
| hapanjuurileipä | 100 | null | Hapanjuurileipä 100 g / 2 annosta: tuote, viljaseos, hapatus, kosteus ja ravintokoostumus yksilöimättä. Fineli 31842 on Fazerin vehnämaalaisleipä, ei todiste tämän leivän koostumuksesta. Paahto huomioitava; puuttuvaa merkittävää HH-osuutta ei ohiteta. |
| neutraalia paistoöljyä | null | 0 | 1 rkl neutraalia puhdasta paistoöljyä: tarkka massa puuttuu, mutta puhtaan öljyn dokumentoitu HH 0 tekee massasta GK:n kannalta merkityksettömän. Muiden ravintoarvojen massa on eri tarkistus. |
| suolaa maun mukaan | null | 0 | Suola maun mukaan: massa avoin, mutta puhtaan suolan HH 0; tämä ei ole tuntemattoman hiilihydraatin korvaamista nollalla. |

## Regressiot ja testit

Kaikki 326 tuoretta GK-tulosriviä ovat identtisiä ennen-tuloksiin, mukaan lukien 137 aiemmin lasketun reseptin pyöristämättömät arvot ja vaihteluvälit. Keltainen kanacurry pysyy nullina, kookosmaitopuuro pysyy REFERENCE_ONLY-tilassa eikä sillä ole aktiivisia ainesosasidontoja. Yleinen ja uusi eräkohtainen nykyinventaario täsmäävät samoihin tuloksiin ja kaikkiin kolmeen fingerprintiin.

Viiden tutkittavan reseptin tekniset fingerprintit täsmäävät. Tämä ei todista semanttista oikeellisuutta: halloumileivän 100/125 g määräero on olemassa myös teknisesti yhtenevissä sidonnoissa. Koko kokoelmassa säilyy 38 vanhaa rakennesidonnan estoa; uusia rakenne-/syöte-/lähdepoikkeamia on 0/0/0.

Paikallisesti PASS: content:sync; strict-ravintoauditointi; GK-auditointi; molemmat kattavuusauditit; test:glycemic 66/66; npm test 136/136; test:select-ci 12/12; build 691 reittiä; test:static 24/24. Kattavuuskomennon kaksi kirjoituskohdetta ohjattiin tarkistetulla Node-preloadilla ulkoiseen scratchiin kummallakin ajolla; seurattuja nykyinventaarioita ei kirjoitettu.

Uusia hyväksyttyjen laskelmien regressiotestejä ei lisätty, koska laskentamuutoksia tai hyväksyttyjä uusia arvoja ei syntynyt. Nykyinen GK-testisarja sekä koko tulosjoukon ennen/jälkeen-vertailu läpäisivät. Main-CI:n loki vahvistaa GK-regressioiden suorituksen osana yksikkötestejä ja kattavuusauditin suorituksen. Uudelle toteutus-PR:lle ei ole HEADia tai CI:tä, koska sellaista PR:ää ei avattu.

## Seuraava rajattu tutkimuserä, ei toteutettu

Järjestys on AJO 0.6 -työjonosta tehty ehdotus; se ei ole lähdehyväksyntä tai lupaus nettolisäyksestä. Ensimmäiset kaksi kohdistuvat määrä- ja sidontanäyttöön. Kolme seuraavaa jakavat yhden tomaattimurskan lähdekysymyksen.

1. `jerk-kana`: Kevätsipulin kappalemassa ja rakenne; tarkista koko muu GI-ketju ennen toteutusta.
2. `hunaja-sinappikana-kaalilla`: Valkosipulijauheen oma koostumus/tl-massa ja rakenne; älä käytä tuoreen valkosipulin muunnosta.
3. `harira`: Keitetyn tomaattimurskan GI sekä koko palkokasvi-/viljaketju; mahdollinen yhteinen lähdetyö.
4. `pasta-alla-norma`: Kypsennetyn tomaattimurskan GI ja pastan tarkka keittovastaavuus.
5. `caponata`: Kypsennetyn tomaattimurskan GI sekä muiden kypsien kasvisten analogiat.

Kookosmaitokohteita ei nosteta ensimmäisiksi ennen itsenäistä hyväksyttävää GI-lähdettä. Koko muun ainesketjun katselmointi säilyy jokaisen ehdokkaan ehtona.

## Tallenteet ja rajaus

[Koneluettava katselmointi](glycemic-coverage-batch-2b6e-review.json) sisältää kaikkien 44 ainesrivin nykyiset syötteet, reseptimäärät, käytetyt lähde-ID:t, avoimet kysymykset, fingerprintit ja historiallisten baselinejen Git-blobien SHA-256:t. Se ei kopioi 189 reseptin suunnittelujonoa. Uusi baseline ja tämä katselmointi jäävät paikalliseen tutkimushaaraan; ei pushia, uutta PR:ää tai B-vaiheen julkaisua.

**AJO 1 / 2B6E – NO CALCULATIONS APPROVED**

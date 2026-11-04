# GK-laskennan menetelmä- ja hiilihydraattisopimus — V2-EHDOTUS

**Ei tuotantosääntö.** Tämän asiakirjan sisältö on tutkimukseen perustuva ratkaisuehdotus. PR #253 / #254:n omistajan hyväksymä katselmointisoveltuvuus pysyy erillisenä, eikä myöhemmän V2:n päätös korvaa sitä automaattisesti.

## 1. Laskettava suure ja rajaus

Reseptin annoskohtainen laskennallinen GK on G = summa(C_i * GI_i / 100) / annokset, jossa C_i on koko erän GI:n kanssa yhteensopiva hiilihydraattiosuus. Jos C_i on jo annosta kohti, jakoa ei toisteta. Valitse laskennan yksiköksi joko kokonainen **valmistettu komponentti** tai erillinen **ainesosa**; samat hiilihydraatit saa kohdistaa vain yhteen yksikköön.

Tallenna kaikkien lukujen yksikkö, perusta, mittaus-/koostumuslähde, valmistusrajaus sekä mahdollinen GI-viiteasteikon muunnos. Glukoosi=100 on yhteinen laskenta-asteikko. Ruokakokonaisuuden ainesosista laskettu arvo on arvio; se ei ole valmiin aterian ihmisillä mitattu GI eikä potilaan yksilöllisen verensokerivasteen ennuste.

## 2. Soveltuvuuden erilliset vaiheet

| Päätös | Kysymys | Ei saa tarkoittaa |
| --- | --- | --- |
| Koostumustietue | Sopivatko raaka-aine, olomuoto, tuotemerkki, painopohja ja hiilihydraattimääritelmä? | Että ruoan GI on tiedossa |
| GI-havainto | Onko yksilöity kelvollinen ihmismittaus, asteikko, näytteenotto ja lähde? | Että se sopii kaikkiin resepteihin |
| GI-soveltuvuus | Sopivatko valmistus, osa, koostumus ja mahdolliset erot tähän ruokaan? | Että kaikki saman ruokaperheen ruoat hyväksytään |
| Laskentakoodi | Onko nimetyn koodin lähde ja käyttösoveltuvuus katselmoitu? | Että koodi on mitattu GI |
| Reseptitulos | Ovatko kaikki olennaiset C_i-osuudet, ei-päällekkäisyys ja vaihtoehdot hallinnassa? | Että tulos saa automaattisen julkaisuluvan |

Prioriteetti: suora valmistusta vastaava ihmis-GI -> perusteltu ihmis-GI:n lähivastine -> valmistetun komponentin vertailu -> yksilöidyt soveltuvat tutkimusskenaariot -> rajattu hyväksytty koodiarvo -> avoin osuus. Käytännössä vastaavan valmiin komponentin GI voi olla *parempi* kuin raaka-aineiden yhteenlasku. Yleisiä raaka-aineperheen oletuksia ei saa nostaa täsmämittaukseksi. Lähteitä käyttävien eri havaintojen riippumattomuus varmistetaan: review-artikkelin taulukkorivi ja sen alkuperäistutkimus eivät ole kaksi riippumatonta koetta.

## 3. Reseptin määrä ja olomuoto

Kukin syöte yksilöidään viitenä asiana: nimetty ruoka/tuote, määrä, mittayksikkö, syötävä osuus ja olomuoto (raaka, kuiva, keitetty, valutettu, paistettu, jäähtynyt jne.).

- Esimerkiksi 200 g kuivaa riisiä ei muutu 200 grammaksi kypsää riisiä. Käytä kuivapainon koostumusta kuivaan määrään; muuttuneeseen valmispainoon tarvitaan todellinen saanto, jos esität tuloksen 100 grammalle.
- Liemen, marinadin, kastikkeen ja siivilöidyn kiinteän aineen hiilihydraatit mallinnetaan massataseena: syöty osuus mukaan kerran, hylätty osuus perustellusti pois. Kaalia ja siitä liemeen siirtyneitä samoja hiilihydraatteja ei lasketa erikseen.
- Vesi, suola ja puhdas öljy voidaan merkitä varmennetusti nollaksi vain soveltuvan koostumuksen perusteella. Tuntematon määrä ei muutu nollaksi.
- Määrän yksikkö ja annoskoko kuuluvat versiotarkisteeseen. Pelkkä annoskoon muutos ei yleensä vaadi uutta GI-ihmistutkimusta, mutta laskettu GK/annos muuttuu.

## 4. Hiilihydraattisemantiikan yhtenäistäminen

Säilytä aina lähteen alkuperäinen arvo ja sen **määritelmä**, älä pelkkää geneeristä grammaper-100-kenttää. Tarvittavat tyypit vähintään: SOURCE_TOTAL_WITH_FIBRE, SOURCE_AVAILABLE_EXCLUDING_FIBRE, SOURCE_AVAILABLE_EXCLUDING_POLYOLS, SOURCE_CARB_INCLUDING_POLYOLS, SOURCE_GI_TEST_BASIS, UNKNOWN. Nimet ovat ehdotuksia, eivät nykyisiä skeeman avaimia.

| Lähde | Normalisointiperiaate | Estettävä virhe |
| --- | --- | --- |
| Fineli CHOAVL | Tärkkelys + sokerit jo määriteltyä saatavaa osuutta | Kuidun tai polyolien toistuva vähennys |
| USDA carbohydrate by difference | Kuitu mukana; vähennä kuitu kerran, mahdollinen polyoli tarkistetaan erikseen | Olettamus että total = glykeemiset hiilihydraatit |
| EU-pakkaus | Ilmoitetut hiilihydraatit sisältävät polyolit, kuitu erillään | Polyolien käsittely yhtenä glukoosina |
| AFCD ilman sokerialkoholeja | Arvo on jo ilman dokumentoituja polyoleja | Uusi vähennys |
| AFCD polyolit sisältävä | Tarkista tarkkaan luetellut polyolilajit ja kenttäparit | Virheellinen oletus, että kahden kentän erotus on kaikki polyolit |

Tarkastettu mainin nutrition-model.ts käsittelee EU_TOTAL_INCLUDING_POLYOLS-tyypin available-arvon polyolit vähennettyinä mutta US_TOTAL_INCLUDING_FIBRE-tyypin available-arvon kuitu vähennettynä, polyolit mahdollisesti jäljellä. GK-moottori lukee available-kentän. Kyseessä on todettu **kentän merkityksen vaihtelu**, ei todettu julkaistun GK:n virhe. Ehdota sen tilalle yksiselitteisiä muunnettuja osia, esimerkiksi digestible_sugars_and_starch, polyols_by_species, fibre, unknown_components ja gi_test_compatible_carbohydrate. Älä vain vaihda nykyistä available-kenttää net-kentäksi.

### Polyolit

A) Jos koko kyseiselle tuotteelle mitattu GI on soveltuva, käytä tutkimuksessa määritettyä GI-testin hiilihydraattiperustaa. Älä lisää saman polyolin vaikutusta toiseen kertaan.

B) Jos arvio koostetaan ainesosista, erittele sokereiden/tärkkelyksen ja eri polyolilajien lähteistetty vaikutus. Erytritoli ja maltitoli eivät saa yleistä yhteistä nollasääntöä. Polyolien 2,4 kcal/g energiakerroin **ei ole** GK-kerroin. Tuntemattoman polyoliseoksen määrä jää auki.

## 5. Puuttuvan tiedon vaikutus

Laske jokaiselle tuntemattomalle osuudelle ensin C_i ja sitten mahdollinen muutos: delta_GK = C_i * delta_GI / 100 (kun C_i on annoskohtainen). Raportoi erikseen absoluuttinen vaikutus (GK), prosentti suhteessa laskettuun pisteeseen ja tarvittaessa luokkavaikutus. C_i:n ollessa itsessään tuntematon pyydä määrä/tuote ennen vaikutusarviota.

**Nykyinen sääntö ei muutu tässä PR:ssä:** perusmallissa alle 1 g/ainesosa ja alle 2 g/annos kumulatiivinen poisjättötoleranssi; Mixed Evidence -reitissä enintään 0,50 GK/annos ja enintään 10 % *poisjättöjen* GI 100 -stressissä, lisäksi koodiosuuden (>50 %) ja yhteisherkkyyden (>20 %) katselmointiliput. Näiden rajojen semanttinen muutos tarvitsee uuden menetelmäversion ja erillisen hyväksynnän.

Uusi periaate: vaikutusarvio ohjaa katselmoinnin kiireellisyyttä. Pienen osuuden eston ylittäminen ei oikeuta hiljaista nollaa, mutta voi johtaa valmistettuun vertailukomponenttiin, lähteistettyihin skenaarioihin tai yhden kysymyksen tarkennukseen. Erityisesti VHH-ruoassa myös pieni absoluuttinen muutos voi olla merkittävä suhteessa pisteeseen.

## 6. Tulostilat ja vaihteluvälit

| Tulos | Merkitys | Julkinen esitysehdotus |
| --- | --- | --- |
| COMPLETE_POINT | Kaikki merkittävät osuudet käsitelty ja pisteen peruste dokumentoitu | GK-arvio noin X / annos |
| COMPLETE_SCENARIOS | Nimettyjen tuote-/valmistus-/lähdevalintojen kokonaiset arviot | GK-arvio X–Y ja oletusten selitys |
| COMPLETE_POINT_WITH_SCENARIOS | Perusvalinnan piste + erilliset perustellut vaihtoehdot | noin X; vaihtoehdoilla Y–Z |
| PARTIAL_KNOWN | Osasumma on tiedossa mutta kokonaisuus ei | Laskettu osuus X; koko GK ei määritetty |
| NEEDS_CLARIFICATION | Yksi tai useampi vaikuttava määrätieto epäselvä | Näytä yksi suurimman vaikutuksen kysymys |
| RESEARCH_REQUIRED | Olennainen GI-/koostumusnäyttö puuttuu | Selkeä tutkimustehtävä; ei tekaistua GK:ta |

Erota **nimettyjen skenaarioiden väli** (tiettyjen vaihtoehtojen arvojen min/max), **laskentaoletusten stressi** (esim. GI 0/100/150) ja **tilastollinen luottamusväli**. Stressi ei ole biologinen ennuste eikä luottamusväli. Älä käytä tilastollisen luottamusvälin nimeä ilman soveltuvaa dataa ja tilastomallia. Älä muodosta käyttäjälle mielivaltaista ±20 % -väliä.

Luokitus ja pyöristys täsmennetään erikseen: nykyinen malli luokittelee ensin lähimpään kokonaislukuun pyöristetyn arvon. Uusi luokittelusääntö voi muuttaa raja-arvotapauksia, joten sen toteutuksessa on oltava nimetty regressiopäätös. Jos skenaariot ylittävät matalan ja keskisuuren GK:n rajan, niitä ei saa käsitellä varmana matalana GK:na.

## 7. Hyväksyntärajat

- Lähderekisterin luettavuus tai SQLite-osuma ei ole GI-soveltuvuushyväksyntä.
- Hyväksytty lähdesidos voidaan käyttää uudelleen **määritellyssä valmistus- ja tuotesoveltuvuudessa**; reseptikohtainen laskenta ja tarkiste tehdään aina uudestaan.
- Reseptien luonti ja henkilökohtainen laskenta voidaan tehdä automaattisina ehdotuksina. Julkisen toimitetun sisällön hyväksyntä, GK100 Factory, tuotantovaltuutus, PR-merge ja deploy pysyvät erillisinä.
- Koodisidoksia tai nykyisiä GK-lukuja ei muuteta tällä dokumentaatio-PR:llä.

Tutkimuksen S1–S30- ja R1–R12-lähteet ovat [kokonaisraportissa](tutkimusraportti.md).

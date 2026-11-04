# GK100 · Mixed Evidence V1

Mixed Evidence V1 on Approval Factoryn laskenta- ja katselmointireitti. Paketti valitsee sen kentällä `"method": "MIXED_EVIDENCE_V1"`. Nykyiset A- ja B-paketit kulkevat omien tarkistustensa kautta. GK149:n koostumustunnisteet, koodien rajaukset ja hyväksyntävaatimukset säilyvät. GK149:n koodiehdotus tai aiemman reseptin hyväksyntä ei siirry uuteen käyttökohteeseen automaattisesti.

## Syötteet ja tarkisteet

- Paketti käyttää nykyisiä resepti- ja muistiotarkisteita, annosmäärää, ainesosia sekä FI/EN/SV/TH-valmistusta ja rajausta. Jokaiselle ainesosalle annetaan yksi `rows`-rivi, jossa ovat `ingredientIndex`, `bindingId` ja `kind`. Positiivinen `UNKNOWN` edellyttää lisäksi `omissionReason`-perustelua.
- Factory lukee erikseen katselmoitavan sidoksen kiinteästä [sidostiedostosta](gk100-mixed-evidence-bindings.json). Jokainen sidos yksilöi koostumustunnisteen, g/ml-pohjan, saatavan hiilihydraatin, lähteen ja tarkan kohdan, GI-lajin ja mahdollisen GI-luvun lähdekohtineen, valmistus- ja tuotesoveltuvuuden sekä hyväksynnän viitteen. GI-arvo ja sen luokka tulevat sidoksesta. `HUMAN_GI`, `PUBLISHED_CODING`, `B_CODING` ja `UNKNOWN` pidetään erillään.
- Sidoksen `scopeSha256` on Factoryn kanoninen tarkiste objektista `{ recipeId, originalSha256, servings, ingredients, preparation }`. Lisäksi sidos kiinnitetään ainesosan indeksiin. Syötetarkiste kattaa menetelmän, soveltuvuuden rajauksen ja jokaisen käytetyn sidoksen arvoineen ja perusteluineen. Laskentamuistio on sidottu paketin ja manifestin tarkisteisiin. Sidostiedosto on aluksi tyhjä. Yksittäiset tuotekohtaiset sidokset vaativat erillisen katselmoinnin.

## Laskenta ja hyväksyntä

V1 edellyttää positiivista mitattuun GI:hin perustuvaa GK-osuutta, positiivista koodiosuutta. Perusteltu vähäinen poisjättö on sallittu. Nollahiilihydraattinen rivi ei ole poisjättö. Positiivinen hiilihydraatti ilman GI-perustetta tai hyväksyttävää poisjättöä estää arvion. Poisjättöjen rajat ovat tiukasti alle 1 g per ainesosa ja alle 2 g yhteensä annosta kohti. Lisäseulassa GI 100 -oletuksen lisäys saa olla enintään 0,50 GK ja enintään 10 % mitatun ja koodatun osuuden summasta. Nämä lisärajat ovat V1:n ehdotettu katselmointikäytäntö.

Manifesti erittelee saatavan hiilihydraatin ja GK:n riveittäin sekä mitatun GI:n osuuden, koodiosuuden, poisjätetyn hiilihydraatin ja niiden summasta lasketun matalan varmuuden pisteen. Nimetyt GI 0/100/150 -stressiskenaariot näyttävät koodien ja poisjättöjen vaikutukset erikseen GK-yksikköinä ja suhteessa pisteeseen. Stressiarvot ovat matemaattisia oletuksia. Ne eivät muodosta biologista rajaa, luottamusväliä tai julkaistavaa GK-vaihteluväliä. Soveltuva mitattu GI voi ylittää 100.

Teknisesti kelvollinen tulos jää tilaan `REVIEW_REQUIRED`, syynä `MIXED_EVIDENCE_METHOD_APPROVAL_REQUIRED`. Factory tuottaa katselmointierittelyn ilman julkaisuvarianttia. Käyttöönotto edellyttää ihmisen menetelmäpäätöstä V1:n soveltamisalasta ja epävarmuusrajoista. Sen lisäksi tarvitaan reseptikohtaiset sidosten katselmoinnit, omistajan sisältöpäätös ja erillinen tuotantovaltuutus. [Approval Factoryn nykyiset portit](gk100-approval-factory.md)

## Laskentakoodien epävarmuuden katselmointi

Nykyiset 0,50 GK:n ja 10 %:n rajat seulovat poisjättöjä GI 100 -oletuksella. Manifestin `codedGk` ilmoittaa koodiosuuden GK-yksikköinä ja `codedPercent` prosentteina pistearviosta. GI 0/100/150 -skenaarioiden `codedScenarioGk` näyttää koodatun osuuden uuden GK-summan. Lisäksi näkyvät koodien ja poisjättöjen erilliset vaikutukset sekä niiden yhteinen muutos GK-yksikköinä ja suhteessa pistearvioon.

Menetelmäkatselmoinnin perusteella Factory nostaa kaksi alustavaa katselmointilippua. Rajat ovat toimituksellisia seulontarajoja. [Menetelmäkatselmointi](https://github.com/ozirix-dev/Reseptit/pull/250#pullrequestreview-5764235838)

- `MIXED_CODE_DOMINANCE`, kun yli 50 % pistearviosta tulee laskentakoodeista.
- `MIXED_LARGE_GI100_STRESS_CHANGE`, kun GI 100 -skenaarion yhteinen muutos pistearvioon verrattuna ylittää itseisarvoltaan 20 %.

Esimerkiksi 5,50 GK:n koepisteestä 5,00 GK eli 90,9 % tuli koodista. Poisjättö oli 0,20 g CHO. GI 100 -skenaario antoi 10,70 GK eli 5,20 GK ja 94,5 % enemmän. Molemmat katselmointiliput nousivat. Testit kattavat myös tapauksen ilman lippuja ja tilanteet, joissa vain toinen lippu nousee. Liput jättävät tuloksen katselmointiin. Stressiluvut kuvaavat oletusten vaikutusta.

## Menetelmäpäätösehdotus · CONDITIONAL GO

Ehdotus rajaa käyttöönoton Approval Factoryn katselmointiin. Soveltamisala on yksi tarkasti sidottu reseptiversio kerrallaan, jossa on positiivinen ihmis-GI:hin perustuva osuus ja perusteltu koodiosuus. Kukin saatava CHO-osuus kohdistetaan kerran. Päällekkäisen yhdistelmäruoan GI:n ja erillisen ainesosa-GI:n käyttö samalle CHO:lle estää reseptisidoksen hyväksynnän. Positiivinen `UNKNOWN` voidaan jättää pois vain perusteltuna ja kaikkien poisjättöseulojen sisällä. Laskentakoodit vaativat nimetyn lähteen, katselmoidun käyttöperusteen ja valmistusvastaavuuden. GK149:n rajoitettuja B-koodeja ei laajenneta automaattisesti.

**Sääntöversion kanoninen SHA-256** on `2900c6656affc2e5cc8158cf235c644eecf0b688a94f4f00841969690b6648ca`. Sen määrittää `mixedPolicy` laskentakoodissa. Säännön semanttinen muutos edellyttää uutta revisiota ja menetelmäpäätöstä. Reseptin `inputSha256` sitoo sääntöversion, reseptin täsmällisen soveltamisalan ja käytetyt lähde- ja koostumussidokset.

1. Menetelmäpäätös `APPROVE_REVIEW_ONLY` yksilöi tämän sääntöversion. Erillisessä katselmoitavassa muutoksessa kirjataan yllä oleva `policySha256`, `schemaVersion: 1`, päätös ja käyttäjän päätösviite `evidence` tiedostoon `docs/nutrition/gk100-mixed-evidence-method-approval.json`. Tämä ehdotus ei sisällä hyväksyntätiedostoa.
2. Tavallinen `check` tuottaa laskelman `REVIEW_REQUIRED`-tilassa. Päätöksen jälkeen `npm run gk:approval-check -- review-mixed COMMIT BATCH` lukee hyväksynnän GitHubin nykyisen `main`-commitin kiinteästä polusta ja ehdokkaan sekä sidokset nimetystä ehdokascommitista. Katselmoija kirjaa syvän `DEEP`-katselmoinnin, ehdokkaan SHA:n, lähde- ja käyttöperusteet sekä tarkan `review.inputSha256`-tarkisteen. Ilman lippuja hyväksytysti luokiteltu ehdokas voi siirtyä normaaliin omistajapäätökseen. Muuttunut sidos tai katselmointilippu palauttaa sen katselmointiin.
3. Sisältöpäätös säilyy manifestiin, ehdokkaaseen, alkuperäiseen ja syötteisiin sidottuna. Katselmointireitti tuottaa vain manifestin. Mahdollisen tulevan julkaisukytkennän arviointi edellyttää erillistä muutosta ja tuotantolupaa. A/B-reitit toimivat nykyisillä säännöillä.

### Kolmen koetapauksen riippumaton laskenta

Tuotannon lähtötaso on **230/326**. Tarkistettu 4.11.2026 tuotantosivun versiokohtaisesta kattavuudesta ja `main`-commitista `3cb570f53ae5506831efc9ff9e9a0f6f8de19705`. Laskin alla olevat syötteet uudelleen desimaalilukuina käyttäen kaavoja CHO/annos = erämäärä × saatava CHO/100 / annokset ja GK = CHO/annos × GI / 100. [Tuotantosivu](https://ozirix-dev.github.io/Reseptit/glykeeminen-kuorma/) · [Mainin onnistunut CI](https://github.com/ozirix-dev/Reseptit/actions/runs/41792323102)

**A · Vesipohjainen okayu.** Kahdelle 100 g kuivaa valkoista riisiä ja 700 ml vettä, haudutus miedolla lämmöllä noin 45 min. Päälliset ovat erilliset. Kim ym. mittasivat tällä valmistustavalla valkoisen riisipuuron GI:n 92,5 glukoosiasteikolla (n = 10). Kotiversion riisilajike ja kypsyys voivat vaikuttaa vasteeseen. Sidottu #240-paketti `7cb7dcc89d49a7b869197100bd7a4611c6666f3878bdb5528cae8be906484a7b` säilyttää FI/EN/SV/TH-rajauksen. Testi käyttää samaa reseptiversiota ja tarkistaa normaalin omistajapäätöksen testihyväksynnällä. Kyseessä on jo julkaistu verrokkitapaus, joten kattavuushyöty on 0. [Laskentamuistio](gk80-operation80-batch-08.md) · [Kim ym., taulukot 1 ja 3](https://doi.org/10.1017/S0007114518003446) · [PR #240:n sidottu aineisto](gk100-approved-releases/eighteen.json)

| Aines, erämäärä | CHO/annos | GI-peruste | GK/annos |
| --- | ---: | --- | ---: |
| Riisi, 100 g | 39,5 | 92,5 · `HUMAN_GI`, haudutettu valkoinen riisipuuro | 36,5375 |
| Kivetön suolattu umeboshi, 10 g | 0,045 | 50 · `B_CODING` | 0,0225 |
| Kuorellinen seesami, 8 g | 0,036 | 50 · `B_CODING` | 0,018 |
| Kevätsipuli, 20 g | 0,474 | 40 · `B_CODING` | 0,1896 |
| Vesi, 700 ml | 0 | `UNKNOWN`, 0 g CHO | 0 |

Piste **36,7676 GK**, koodit 0,2301 GK eli 0,63 %, poisjättö 0 g. Lähdekäyttö seuraa katselmoitua versiota. Riisi ja seesami käyttävät THL:n Finelin saatavaa CHO:ta, kevätsipuli USDA 170005:n hiilihydraatin ja kuidun erotusta. Umeboshi käyttää MEXTin tietueen 07022 saatavan CHO:n massasummaa 0,9 g / 100 g, sorbitoli on erillinen kenttä. MEXT sallii koostumusdatan käytön lähdeviitteellä `日本食品標準成分表（八訂）増補2023年`. Kimiltä käytetään yhtä viitattua GI-lukua riippumattoman laskelman syötteenä. [Fineli ja käyttöehdot](https://fineli.fi/fineli/fi/ohje/19) · [USDA 170005](https://fdc.nal.usda.gov/food-details/170005/nutrients) · [MEXT 07022](https://fooddb.mext.go.jp/details/details.pl?ITEM_NO=7_07022_7&MODE=7) · [MEXTin viittausohje](https://www.mext.go.jp/a_menu/syokuhinseibun/)

**B · Ojja, BLOCKED.** Neljälle 160 g Bertinet-hapanjuurileipää ja erikseen haudutettu kastike. Leipä 17,56 g CHO × GI-verrokki 54 = 9,4824 GK. Kastikkeen sipuli, paprika, valkosipuli ja Mutti Polpa antavat yhteensä 6,9405 g CHO koodilla 40. Juustokumina, muna ja persilja antavat 0,447125 g koodilla 50. Koodattu summa on 2,9997625 GK eli 24,03 % pisteestä 12,4821625. Harissan 0,0825 g (0,66 % pisteestä GI 100 -oletuksella) läpäisee poisjättöseulat. GI 100 -yhdistelmämuutos on +4,4703625 GK (+35,81 %), joten tämä saisi erityisen katselmointilipun jo arkistosyötteillä. Leipäverrokin fermentointi ja jauhot sekä haudutetun tomaatin ja paprikan koodien soveltuvuus jäävät avoimiksi. Säilytä alla olevat skenaariot sisäisenä herkkyyskokeena. [Arkiston laskentamuistio](https://github.com/ozirix-dev/Reseptit/blob/e2c3bca1072ccee1e3b565a9c08bac039d94ab59/docs/nutrition/gk80-operation80-batch-55.md)

**C · Lontong sayur, BLOCKED.** Alla kuvatuista kahden annoksen syötteistä 40 g kuiva riisi antaa 15,80 g CHO × 89 = 14,062 GK. 100 g Cauldron-tofu antaa 0,90 g CHO × 50 = 0,450 GK vain Mapo-ennakkotapauksen koodilla. 200 g kookosmaitoa, 200 g raakaa kaalia ja 700 ml Anetoa tuovat erilliset 3,40 + 4,97 + 0,70 = 9,07 g CHO. Kaalin hiilihydraattia ei lisätä toiseen kertaan mahdollisen liemeen siirtymisen vuoksi. Kaali ja kookos ylittävät jo ainesosakohtaisen 1 g:n seulan ja Aneto ylittää 0,50 GK:n seulan. Edes tofukoodin hyväksyminen tähän versioon ei tuota koko annoksen pistettä.

| Tapaus | Oletus-GI | Koodattu GK | Poisjätön tai avoimen CHO:n stressilisä GK | Yhdistetty stressi GK/annos |
| --- | ---: | ---: | ---: | ---: |
| A | 0 / 100 / 150 | 0 / 0,555 / 0,8325 | 0 / 0 / 0 | 36,5375 / 37,0925 / 37,3700 |
| B | 0 / 100 / 150 | 0 / 7,387625 / 11,0814375 | 0 / 0,0825 / 0,12375 | 9,4824 / 16,952525 / 20,6875875 |
| C, vain eston havainnollistus | 0 / 100 / 150 | 0 / 0,90 / 1,35 | 0 / 9,07 / 13,605 | 14,062 / 24,032 / 29,017 |

### Rajapäätös

Säilytä **0,50 GK ja 10 %** poisjätön yhtäaikaisina estorajoina. Absoluuttinen raja estää suuren sivuosuuden korkeassa pisteessä. Suhteellinen raja paljastaa VHH-annoksen kannalta olennaisen pienen grammanmäärän. Chiavanukkaan 0,335325 GK on 20,69 % sen 1,6210575 GK:n osapisteestä. Kokonaislukupyöristys peittää muutoksen, vaikka kymmenystarkkuuden näyttö muuttuu. Rajaa ei väljennetä pyöristyksen perusteella. Säilytä **yli 50 %** koodiosuus ja **yli 20 %** yhdistetty GI 100 -muutos katselmointilippuina. Pienillä pisteillä katselmoija käyttää sekä prosenttia että absoluuttista GK-eroa. Stressi näyttää laskelman riippuvuuden oletuksista. Biologisen epävarmuuden arviointiin tarvitaan erikseen soveltuva tutkimusnäyttö.

## Lontong sayur · BLOCKED

Riisikakun laskenta on **15,80 × 89 / 100 = 14,062 GK/annos**. Cauldron-tofun saman tuotteen Mapo-ennakkotapaus antaa koodilla **0,90 × 50 / 100 = 0,450 GK/annos**. Lähtösumma on **14,512 GK**. Tofun koodin käyttösidos tähän valmistukseen vaatisi vielä oman päätöksen.

| Ainesosa | Saatava CHO/annos | Tulos |
| --- | ---: | --- |
| Blue Dragon -kookosmaito | 3,40 g | Koostumus on sidottu. Riisipuuron GI kuuluu koko testiruoalle. GK149:n `plant50` koskee eri Fineli-tietuetta. Soveltuva GI tai hyväksytty koodisidos puuttuu ja CHO ylittää poisjättörajan. |
| Haudutettu valkokaali | 4,97 g | Ihmiskokeessa kasviksen ja glukoosin kuormia ei tasattu. MEXTin sokerijakauma tukee herkkyysvertailua, ja raakapainon, kypsän kaalin ja liemeen siirtyneen CHO:n sidos jää avoimeksi. Koostumus ei kuulu `low50`-koodiin, ja CHO ylittää poisjättörajan. |
| Eurooppalainen Aneto | 0,70 g | Syöte 0,2 g / 100 ml. Ainesosakohtainen grammaseula täyttyy, mutta 0,70 GK ylittää V1:n 0,50 GK:n absoluuttisen seulan. Suhteellinen lisäys kiinteään osasummaan on 4,82 %. Valmiste ylittää myös `trace50`-koodin 0,50 g:n käyttörajan. |

Avoimet rivit sisältävät yhteensä **9,07 g** saatavaa CHO:ta annosta kohti. GI 0–100 -oletuksella laskettu osasumman herkkyys on **14,512–23,582 GK**. Testi eristää jokaisen avoimen rivin ja vahvistaa, että se pysäyttää laskennan, vaikka riisi ja tofu olisivat sidottuja. Koko annokselle ei ole hyväksyttävää GK-arviota nykyisellä näytöllä. [PR #247:n laskentamuistio](https://github.com/ozirix-dev/Reseptit/blob/25b6e5276b07bc9854e277e11c5131d8fde1ce7b/docs/nutrition/gk100-lontong-sayur-calculation.md)

## Vaikutus nykyiseen jonoon

**PR #244:n 26 ehdokasta.** Mixed Evidence -reitille soveltuu heti **0**. Pelkällä rajatulla korjauksella teknisesti valmiiksi osoitettuja on **0**. Chiavanukkaan Foodin–Queen-punnitus pienentäisi poisjätön 0,0225 grammaan, mutta vadelman ja FAGE:n sidos jää ratkaistavaksi. Bánh xèon itutuotteen nimeäminen rajaa koostumuksen, mutta kypsän itutäytteen GI-peruste puuttuu. Molemmat ovat seuraavia rajattuja selvityksiä.

**22 ehdokasta** on edelleen olennaisen näytön takana, kun #245:n tempeh-munakulho erotetaan vanhasta jonosta. Maapähkinä-xôi, bouillabaisse ja hunajamsemen olivat jo #244:ssä hyväksyttyjä julkaisuvalmisteluun. Tempeh-munakulho eteni #245:ssä nykyisellä A-reitillä. Näitä neljää ei lasketa Mixed Evidence -hyödyksi. Avoimista ehdokkaista viidellä on arkistossa ihmis-GI-lähdemerkintä, julkaistu koodi ja poisjättö. Kahdella muulla on mitatun lähteen ja koodin merkintä ilman poisjättöä. Valmistus- ja lähdesidos ratkaisee näiden jatkokelpoisuuden.

| Paketti | Ratkaisematon este |
| --- | --- |
| Marjainen chiavanukas | Nykyinen 0,335325 g poisjättö on noin 19–21 % alkuperäisistä osatuloksista. Foodin–Queen-vaihtoehdon 0,0225 g on pienempi, mutta vadelman ja FAGE-jogurtin soveltuvuus vaatii edelleen katselmoinnin. |
| Bammy | Casaben GI ei yksilöi kostutetun ja pannupaistetun kassavaleivän valmistusta tai turvallisuussidosta. |
| Dal makhani | Höyrytetyn uradin mittaus ei kata keittämistä, osittaista murskaamista eikä keitinliemen palautusta. |
| Ojja | Leipäverrokin ja haudutetun kastikkeen koostumus- ja GI-sidokset puuttuvat. Harissan pieni poisjättö on sivuosuus. |
| Roujiamo | Vehnäletun GI ei vielä kuvaa kohotettua pannuleipää. |
| Kookos-lime-kanacurry | Soveltuva ihmis-GI puuttuu. Avoin 1,42375 g lisää GI 100 -stressissä noin 48–68 % koodatusta osasummasta. |
| Kimchi-jjigae | Soveltuva ihmis-GI puuttuu. Avoin enintään 1,9125 g lisää samassa stressissä noin 108 % koodatusta osasummasta. |

### Viiden arkistopaketin uusintalaskenta

Luvut on laskettu #244:n tarkisteeseen sidotuista syötteistä. Chiavanukkaalle käytettiin perusskenaariota. GI 100 -stressissä säilytettiin aiemmat ihmismittauksiin perustuvat analogiat ja vaihdettiin koodatut ja poisjätetyt osuudet GI 100 -oletukseen. Taulukko auttaa priorisoimaan lähde-esteet. Kaikki viisi pysyvät `BLOCKED`-tilassa.

| Paketti | Historiallinen GK-piste | Koodiosuus GK / % | Poisjättö, g CHO | GI 100 -muutos GK / % | Seulan tulos arkistosyötteillä |
| --- | ---: | ---: | ---: | ---: | --- |
| Bammy | 46,56 | 1,89 / 4,06 % | 0,6015 | +2,49 / 5,36 % | Poisjättö ylittää 0,50 GK:n rajan. |
| Marjainen chiavanukas | 1,62 | 0,375 / 23,13 % | 0,335325 | +0,71 / 43,82 % | Poisjättö ylittää 10 %:n rajan. Koodit ja poisjättö yhdessä ylittävät 20 %:n lippurajan. |
| Dal makhani | 16,94 | 2,72 / 16,07 % | 0,50 | +4,27 / 25,22 % | Koodit ja poisjättö yhdessä ylittävät 20 %:n lippurajan. |
| Ojja | 12,48 | 3,00 / 24,03 % | 0,0825 | +4,47 / 35,81 % | Koodit ja poisjättö yhdessä ylittävät 20 %:n lippurajan. |
| Roujiamo | 45,34 | 1,16 / 2,57 % | 1,5786 | +2,77 / 6,11 % | Poisjättö ylittää 0,50 GK:n rajan. |

[Arkistopaketit ja syötteet](https://github.com/ozirix-dev/Reseptit/blob/e2c3bca1072ccee1e3b565a9c08bac039d94ab59/docs/nutrition/gk100-next-26-batch.json)

Bánh xèon ja ruokabanaanilautasen paketeissa on B-koodimerkintä, mutta niissä ei ole eksplisiittistä A-poisjättöä ja pääraaka-aineiden näyttö on kesken. Tempeh-munakulhon erillinen #245-versio toimii nykyisellä A-reitillä. Lukumäärä koskee näitä jo katselmoituja paketteja. [PR #244:n katselmointimuistio](https://github.com/ozirix-dev/Reseptit/blob/e2c3bca1072ccee1e3b565a9c08bac039d94ab59/docs/nutrition/gk100-next-26-review.md) · [PR #245:n jatkokatselmointi](https://github.com/ozirix-dev/Reseptit/blob/d9c699c810a98146c3b285011163b1d53546371f/docs/nutrition/gk100-244-followup-review.md)

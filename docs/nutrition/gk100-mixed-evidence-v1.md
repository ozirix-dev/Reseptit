# GK100 · Mixed Evidence V1

Mixed Evidence V1 on Approval Factoryn laskenta- ja katselmointireitti. Paketti valitsee sen kentällä `"method": "MIXED_EVIDENCE_V1"`. Nykyiset A- ja B-paketit kulkevat omien tarkistustensa kautta. GK149:n koostumustunnisteet, koodien rajaukset ja hyväksyntävaatimukset säilyvät. GK149:n koodiehdotus tai aiemman reseptin hyväksyntä ei siirry uuteen käyttökohteeseen automaattisesti.

## Syötteet ja tarkisteet

- Paketti käyttää nykyisiä resepti- ja muistiotarkisteita, annosmäärää, ainesosia sekä FI/EN/SV/TH-valmistusta ja rajausta. Jokaiselle ainesosalle annetaan yksi `rows`-rivi, jossa ovat `ingredientIndex`, `bindingId` ja `kind`. Positiivinen `UNKNOWN` edellyttää lisäksi `omissionReason`-perustelua.
- Factory lukee erikseen katselmoitavan sidoksen kiinteästä [sidostiedostosta](gk100-mixed-evidence-bindings.json). Jokainen sidos yksilöi koostumustunnisteen, g/ml-pohjan, saatavan hiilihydraatin, lähteen ja tarkan kohdan, GI-lajin ja mahdollisen GI-luvun lähdekohtineen, valmistus- ja tuotesoveltuvuuden sekä hyväksynnän viitteen. GI-arvo ja sen luokka tulevat sidoksesta. `HUMAN_GI`, `PUBLISHED_CODING`, `B_CODING` ja `UNKNOWN` pidetään erillään.
- Sidoksen `scopeSha256` on Factoryn kanoninen tarkiste objektista `{ recipeId, originalSha256, servings, ingredients, preparation }`. Lisäksi sidos kiinnitetään ainesosan indeksiin. Syötetarkiste kattaa menetelmän, soveltuvuuden rajauksen ja jokaisen käytetyn sidoksen arvoineen ja perusteluineen. Laskentamuistio on sidottu paketin ja manifestin tarkisteisiin. Sidostiedosto on aluksi tyhjä. Yksittäiset tuotekohtaiset sidokset vaativat erillisen katselmoinnin.

## Laskenta ja hyväksyntä

V1 edellyttää positiivista mitattuun GI:hin perustuvaa GK-osuutta, positiivista koodiosuutta ja vähäistä poisjättöä. Positiivinen hiilihydraatti ilman GI-perustetta tai hyväksyttävää poisjättöä estää arvion. Poisjättöjen rajat ovat tiukasti alle 1 g per ainesosa ja alle 2 g yhteensä annosta kohti. Lisäseulassa GI 100 -oletuksen lisäys saa olla enintään 0,50 GK ja enintään 10 % mitatun ja koodatun osuuden summasta. Nämä lisärajat ovat V1:n ehdotettu katselmointikäytäntö.

Manifesti erittelee saatavan hiilihydraatin ja GK:n riveittäin sekä mitatun GI:n osuuden, koodiosuuden, poisjätetyn hiilihydraatin ja niiden summasta lasketun matalan varmuuden pisteen. Nimetyt GI 0/100/150 -stressiskenaariot näyttävät koodien ja poisjättöjen vaikutukset erikseen GK-yksikköinä ja suhteessa pisteeseen. Stressiarvot ovat matemaattisia oletuksia. Ne eivät muodosta biologista rajaa, luottamusväliä tai julkaistavaa GK-vaihteluväliä. Soveltuva mitattu GI voi ylittää 100.

Teknisesti kelvollinen tulos jää tilaan `REVIEW_REQUIRED`, syynä `MIXED_EVIDENCE_METHOD_APPROVAL_REQUIRED`. Factory tuottaa katselmointierittelyn ilman julkaisuvarianttia. Käyttöönotto edellyttää ihmisen menetelmäpäätöstä V1:n soveltamisalasta ja epävarmuusrajoista. Sen lisäksi tarvitaan reseptikohtaiset sidosten katselmoinnit, omistajan sisältöpäätös ja erillinen tuotantovaltuutus. [Approval Factoryn nykyiset portit](gk100-approval-factory.md)

## Päätösehdotus · koodien ja poisjättöjen yhteisvaikutus

Nykyiset 0,50 GK:n ja 10 %:n rajat seulovat vain poisjättöjä oletuksella GI 100. Ne voivat täyttyä, vaikka laskentakoodi määrää tuloksen. Ehdotan, että käyttöönotossa säilytetään nykyinen poisjättöseula ja lisätään erillinen yhteisvaikutuksen seula. Alla olevat rajat ovat ehdotettuja toimituksellisia rajoja. Niiden käytöstä tarvitaan menetelmäpäätös.

1. Säilytä mitattujen GI-rivien arvot. Laske kullekin koodiriville nimettyjen GI 0/100/150 -oletusten suurin nousu ja lasku sen omasta laskentapisteestä. Laske rivien nousut yhteen ja lisää poisjättöjen GI 150 -lisäys. Laske laskut erikseen yhteen. Näin yhden ainesosan oletusmuutos ei peitä toisen vaikutusta.
2. Merkitse suurin yhteenlaskettu poikkeama GK-yksikköinä ja prosenttina laskentapisteestä. Ehdotus pistearvion jatkokatselmointiin on enintään **0,50 GK ja 10 %**. Jos jompikumpi ylittyy, pistearvio jää katselmointiin. Mahdollinen nimetty reseptiskenaario tarvitsee oman lähdeperusteensa.
3. Tarkista, muuttuuko käyttäjälle näytettävä arvo tai luokka. Jos muuttuu, ratkaise esitystapa reseptikohtaisesti ennen pistearvion hyväksyntää. Esimerkkien läpäisy tarkoittaa yhteisvaikutuksen seulan läpäisyä.

| Koetapaus | Laskentapiste | Koodattu CHO ja GK | Poisjätetty CHO | Yhteisvaikutus alas / ylös | Suurin suhteellinen poikkeama | Seula |
| --- | ---: | --- | ---: | --- | ---: | --- |
| Pieni koodiosuus | 14,10 | 0,20 g ja 0,10 GK | 0,10 g | 0,10 / 0,35 GK | 2,48 % | Läpäisee |
| Koodi määrää tuloksen | 5,50 | 10,00 g ja 5,00 GK | 0,20 g | 5,00 / 10,30 GK | 187,27 % | Ylittää molemmat rajat |
| Matala GK-piste | 1,00 | 0,20 g ja 0,10 GK | 0,10 g | 0,10 / 0,35 GK | 35,00 % | Ylittää suhteellisen rajan |

Koetapaukset ovat synteettisiä. Stressitulokset testaavat oletusten vaikutusta. Ne eivät arvioi biologista vaihtelua tai mittausepävarmuutta.

Käyttöönotossa menetelmäpäätös sidotaan hyväksytyn sääntöversion tarkisteeseen. Reseptin ainesosasidoksen tarkistaa erillinen katselmoija. Sidoksen hyväksyntäviite osoittaa päätökseen, joka yksilöi käytetyt lähderivit, määrän, valmistuksen ja koostumuksen. Pistearvio tarvitsee lisäksi nykyiset tarkistesidotut resepti- ja tuotantopäätökset. Tämä ehdotus jättää laskentareitin katselmointikäyttöön.

## Lontong sayur · BLOCKED

Riisikakun laskenta on **15,80 × 89 / 100 = 14,062 GK/annos**. Cauldron-tofun saman tuotteen Mapo-ennakkotapaus antaa koodilla **0,90 × 50 / 100 = 0,450 GK/annos**. Lähtösumma on **14,512 GK**. Tofun koodin käyttösidos tähän valmistukseen vaatisi vielä oman päätöksen.

| Ainesosa | Saatava CHO/annos | Tulos |
| --- | ---: | --- |
| Blue Dragon -kookosmaito | 3,40 g | Koostumus on sidottu. Riisipuuron GI kuuluu koko testiruoalle. GK149:n `plant50` koskee eri Fineli-tietuetta. Soveltuva GI tai hyväksytty koodisidos puuttuu ja CHO ylittää poisjättörajan. |
| Haudutettu valkokaali | 4,97 g | Ihmiskokeessa kasviksen ja glukoosin kuormia ei tasattu. MEXTin sokerijakauma tukee herkkyysvertailua, ja raakapainon, kypsän kaalin ja liemeen siirtyneen CHO:n sidos jää avoimeksi. Koostumus ei kuulu `low50`-koodiin, ja CHO ylittää poisjättörajan. |
| Eurooppalainen Aneto | 0,70 g | Syöte 0,2 g / 100 ml. Ainesosakohtainen grammaseula täyttyy, mutta 0,70 GK ylittää V1:n 0,50 GK:n absoluuttisen seulan. Suhteellinen lisäys kiinteään osasummaan on 4,82 %. Valmiste ylittää myös `trace50`-koodin 0,50 g:n käyttörajan. |

Avoimet rivit sisältävät yhteensä **9,07 g** saatavaa CHO:ta annosta kohti. GI 0–100 -oletuksella laskettu osasumman herkkyys on **14,512–23,582 GK**. Testi eristää jokaisen avoimen rivin ja vahvistaa, että se pysäyttää laskennan, vaikka riisi ja tofu olisivat sidottuja. Koko annokselle ei ole hyväksyttävää GK-arviota nykyisellä näytöllä. [PR #247:n laskentamuistio](https://github.com/ozirix-dev/Reseptit/blob/25b6e5276b07bc9854e277e11c5131d8fde1ce7b/docs/nutrition/gk100-lontong-sayur-calculation.md)

## Vaikutus nykyiseen jonoon

**0 muuta reseptiä avautuu nykyisellä näytöllä.** PR #244:n 26 ehdokkaasta viidellä avoimella paketilla on ihmis-GI-lähdemerkintä, julkaistu koodi ja poisjättö samalla paketilla. Nämä viisi hyötyvät uudesta reitistä ehdollisesti, jos niiden varsinaiset lähde-esteet ratkaistaan. Pelkkä lähdemerkintä ei todista valmistusvastaavuutta.

| Paketti | Ratkaisematon este |
| --- | --- |
| Marjainen chiavanukas | Nykyinen 0,335325 g poisjättö on noin 19–21 % alkuperäisistä osatuloksista. Foodin–Queen-vaihtoehdon 0,0225 g on pienempi, mutta vadelman ja FAGE-jogurtin soveltuvuus vaatii edelleen katselmoinnin. |
| Bammy | Casaben GI ei yksilöi kostutetun ja pannupaistetun kassavaleivän valmistusta tai turvallisuussidosta. |
| Dal makhani | Höyrytetyn uradin mittaus ei kata keittämistä, osittaista murskaamista eikä keitinliemen palautusta. |
| Ojja | Leipäverrokin ja haudutetun kastikkeen koostumus- ja GI-sidokset puuttuvat. Harissan pieni poisjättö on sivuosuus. |
| Roujiamo | Vehnäletun GI ei vielä kuvaa kohotettua pannuleipää. |
| Kookos-lime-kanacurry | Soveltuva ihmis-GI puuttuu. Avoin 1,42375 g lisää GI 100 -stressissä noin 48–68 % koodatusta osasummasta. |
| Kimchi-jjigae | Soveltuva ihmis-GI puuttuu. Avoin enintään 1,9125 g lisää samassa stressissä noin 108 % koodatusta osasummasta. |

Bánh xèon ja ruokabanaanilautasen paketeissa on B-koodimerkintä, mutta niissä ei ole eksplisiittistä A-poisjättöä ja pääraaka-aineiden näyttö on kesken. Tempeh-munakulhon erillinen #245-versio toimii nykyisellä A-reitillä. Lukumäärä koskee näitä jo katselmoituja paketteja. [PR #244:n katselmointimuistio](https://github.com/ozirix-dev/Reseptit/blob/e2c3bca1072ccee1e3b565a9c08bac039d94ab59/docs/nutrition/gk100-next-26-review.md) · [PR #245:n jatkokatselmointi](https://github.com/ozirix-dev/Reseptit/blob/d9c699c810a98146c3b285011163b1d53546371f/docs/nutrition/gk100-244-followup-review.md)

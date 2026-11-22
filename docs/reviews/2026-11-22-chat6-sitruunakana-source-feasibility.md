# Chat-6: sitruuna-yrttikanan ravintolähteiden ehdollinen laskentakoe

**Päiväys:** 22.11.2026
**Omistaja:** Chat 6
**Tila:** ERISTETTY KOE / EI RAVINTOARVOJEN JULKAISUHYVÄKSYNTÄÄ
**Lähtö-main:** `9804d8da0233f2703e3f3504bbb1117e1f5c5676` (haaraluonnin hetkellä)
**Resepti:** `sitruuna-yrttikana-parsa` (4 annosta)

## Päätösraja ja käyttäjän hyväksyntä

Käyttäjä hyväksyi 22.11.2026 Chat-6:n esittämän rajatun jatkotarkistuksen: selvitetään, ovatko nykyiset lähteet ja poisjättöjen toleranssit käyttökelpoisia. **Hyväksyntää ei tulkita luvaksi julkaista uusia neljän makron numeroita, vahvistaa puuttuvia polyoleja nolliksi, muuttaa GK-sinettejä tai yhdistää PR:ää.** Chat-1 vastaa Ready- ja merge-vaiheista.

Tämä dokumentti ja `site/tests/chat6-sitruunakana-source-feasibility.test.ts` ovat repon lähteitä hyödyntävä toistettava **ehdokasskenaario**. Julkisen FI/EN/SV/TH-reseptin neljä ravintoarvokenttää, päähaaran `docs/nutrition/calculations/sitruuna-yrttikana-parsa.json`, GK-tulos 0,88 LOW, pysyvät **ennallaan**. Chat-5:n [polyolirajoituksia käsittelevään PR #826:een](https://github.com/ozirix-dev/Reseptit/pull/826) ei kosketa.

## Lähteiden yksilöinti

| Ainesosa | Lähde/tilanne | Ehdokaskäsittely |
| --- | --- | --- |
| 2 g kuivattua jauhettua timjamia | AFCD Release 3 **F009160**; sama `FoodRecord` on jo lähteistetty reseptin `lahi-ita-zaatar-munat` ravintosyötteessä | Käytä täsmällistä kuivaa jauhettua timjamia koskevaa AFCD-lähdettä, mutta ilmoita `Borrowed`-tausta |
| 0,5 g jauhettua mustapippuria | AFCD Release 3 **F006618**, `docs/nutrition/food-records.json` | Käytä täsmällistä jauhettua pippuria koskevaa AFCD-lähdettä, ilmoita `Borrowed` |
| 3,1 g valkosipulijauhetta | USDA SR Legacy FDC **171325**; koko annoksen ravintoprofiilin lähde | Lähdeprofiiliin sidottu **ehdollinen koko aineksen poisjättö**, EI uusi polyolinollatieto |
| 2 g raastettua ulointa sitruunankuorta | USDA SR Legacy FDC **167749**, *raw lemon peel* on koostumusproxy, ei osoitettu yksinomaan keltaisen ulkokuoren mittaus | **Ehdollinen koko aineksen poisjättö**, ei suora tarkka zesti-koostumustieto |
| `suolaa` ilman massaa | AFCD Release 3 **F007879**: *table salt, non-iodised* (Analysed) ja hiilihydraatti, kuitu, proteiini, rasva = 0 g/100 g | **Vain ehdollinen oletus tavallisesta ruokasuolasta**. Reseptissä suolan määrää tai laatua ei ole lukittu, eikä sen natriumia lasketa. Kun tämä oletus poistetaan, testi vaatii `INSUFFICIENT SOURCE DATA` -tilan. |

Molemmissa AFCD:n maustekorteissa julkaistu sokerialkoholien kanssa / ilman laskettu saatava hiilihydraatti on sama. Repon maustetietueiden `polyolsSourceVerified=true` on siten **lähdemallin laskennallinen vahvistus**, ei yksittäisten sorbitolin/mannitolin/glyserolin suoraa analyysiä. Alkuperäisen AFCD-rekisterin näiden kenttien `null` säilytetään ja tarkistetaan testissä. Laskenta ei kopioi mitattua nollaa, jota lähde ei raportoi. FSANZ muistuttaa, ettei raportoimaton ravintoaine tarkoita, ettei sitä olisi tuotteessa.

**Lähteet:** [FSANZ AFCD Release 3](https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd/about-afcd), [AFCD F009160](https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd/search/food/F009160), [AFCD F006618](https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd/search/food/F006618), [AFCD F007879](https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd/search/food/F007879), [USDA FDC 171325](https://fdc.nal.usda.gov/food-details/171325/nutrients) ja [FDC 167749](https://fdc.nal.usda.gov/food-details/167749/nutrients), sekä nykyiset repon lähdesnapshotit.

## Poisjättöjen annosaritmetiikka – **nimelliset lähdearvot, eivät lot-kohtaiset absoluuttiset ylärajat**

Kerroin: `ainesosan massa (g) / 4 annosta / 100 g`. Muut ravintoaineet eivät muutu julkaistaviksi tällä aritmetiikalla.

| Lähdeainesosa | US-total-CHO g/annos (netto-CHO:n *ehdollinen katto*) | proteiini g/annos | rasva g/annos | kcal/annos |
| --- | ---: | ---: | ---: | ---: |
| Valkosipulijauhe 3,1 g (USDA: 72,73 / 16,55 / 0,73 g ja 331 kcal /100 g) | 0,5636575 | 0,1282625 | 0,0056575 | 2,56525 |
| Sitruunankuori 2 g (USDA: 16 / 1,5 / 0,3 g ja 47 kcal /100 g) | 0,0800000 | 0,0075000 | 0,0015000 | 0,23500 |
| **Yhteensä** | **0,6436575** | **0,1357625** | **0,0071575** | **2,80025** |

Repon makrotoleranssit ovat **1 g/annos** kullekin neljälle makrorajalle ja **10 kcal/annos** energialle. Taulukko mahtuu määrällisesti niiden sisään, *jos* lähdeprofiili hyväksytään tuotteen ja valmistuksen poikkeaman rajaksi. USDA-total-CHO sisältää kuidun ja soveltuu vain ehdolliseksi hiilihydraattikaton lähteeksi, **ei erikseen mitatuksi imeytyväksi/nettohiilihydraatiksi**.

Kaikki lähdearvot ovat tyypillisiä koostumustietoja. Ne **eivät** sellaisenaan todista kunkin mahdollisen tuotemerkin, raaka-aine-erän, raasteen syvyysvaihtelun tai valmistusmuutoksen absoluuttista enimmäisvaikutusta. Siksi kokeen numerollinen `ESTIMATE WITH EVIDENCE` ei ole itsessään julkaisu- tai sisältöhyväksyntä.

## Vain ehdollisen laskentakokeen tulos

Seitsemän sisältöön kuuluvaa ainesriviä muodostavat laskentamallissa (vanhan pääreseptin ainesmäärillä) testattavan osuuden. Valkosipuli- ja sitruunankuoririvi ovat ehdollisesti kokonaan pois rajattuja, suola ehdollisesti tavallista ruokasuolaa. Näillä oletuksilla odotettu **koelaskelma** annosta kohti on:

| Ehdollinen malliluku, ei julkaistu | g/annos |
| --- | ---: |
| Nettohiilihydraatti | **2,36** |
| Kokonaishiilihydraatti | **4,29** |
| Proteiini | **36,73** |
| Rasva | **16,60** |

Luvut eivät sisällä pois rajattuja mausteita ja ovat **vain sisäisiä testiodotuksia**. Koko annoksen hyväksyttävyys edellyttää erillistä rehellistä epävarmuus- ja lähdevastaavuuspäätöstä. Julkiset neljä `null`-arvoa säilyvät; nykyistä mallinnettua GK:ta (**0,88**, LOW, valmistukselle rajattu) ei lasketa uudestaan. Jo hyväksytty historiallisen mallin GK-poisjättö on **0,826245 g/annos**; sitä ei samasteta yllä esitettyyn eri tarkoitukseen tehtyyn makropoisjättöön.

## Testit ja päätöspiste

Uusi testitiedosto suoritetaan nykyisen site-projektin `npm test` -yksikkötestikokonaisuudessa ilman lisäriippuvuuksia. Se tarkistaa:

1. Alkuperäinen FI ja kolme käännöstä sisältävät edelleen neljä `null`-arvoa; lähde- ja GK-sidonta täsmää nykyiseen reseptiin, eikä historiallisen 0,88 tuloksen arvo muutu.
2. AFCD:n vastaavat mausteet ovat `Borrowed`, individual polyol fields ovat `null`, ja ehdollisen suolan analysoidussa tietueessa makrot ovat nollia.
3. Ehdollisen skenaarion annosluvut ja viisi poisjättöehtoa; **vain koelaskelma** saa numeerisen `ESTIMATE WITH EVIDENCE`-tilan.
4. Fail-closed: kun suolaoletus poistetaan, AFCD:n polyolin lähdevarmennus puuttuu tai poisjättö ylittää toleranssin, laskenta jää `INSUFFICIENT SOURCE DATA` -tilaan.
5. Vanhalla `WITHHELD_SOURCE_INCOMPLETE`-lipulla ei voi julkaista täydellistä laskelmaa; `verifyNutritionEvidence` palauttaa ristiriidan.

**Jatkopäätös tarvitaan ennen reseptin makrojen avaamista:** käydään läpi lähdeprofiilien soveltuvuus todelliseksi enimmäispoisjätöksi, suolan alkuperäinen määrä/tuotetyyppi ja polyolien AFCD-semanttiikan suhde Chat-5:n #266:een. Tämän jälkeen voidaan valmistella erillinen **tuotantojulkaisun** ehdokas, jossa SHA-sinetit, nelikieliset arvot, rekisterit ja CI päivitetään hallitusti. Tämä koe ei tee sitä.

**Ei muutettu:** `reseptit/**`, `kaannokset/**`, `docs/nutrition/**`, `docs/research/**`, `meta/**`, `.github/**`, `AGENTS.md`, laskentakoodi tai nykyisen GK:n julkaisuasetukset.

# GK80:n vaihteluvälit

Vertailukohta on main `4d6f19a620bb95e771c12f499554bf2cf1f06e51`. [PR #228](https://github.com/ozirix-dev/Reseptit/pull/228) sisältää lähdekatselmoinnin. Tässä haarassa on laskenta ja julkaisukomponentin tuki sekä katselmoitava ehdotus.

- `EXACT_MODEL` kuvaa yhden perustellun laskelman.
- `ESTIMATED_RANGE` kuvaa dokumentoitujen kokonaisskenaarioiden pienintä ja suurinta tulosta. Se on laskennallinen skenaarioalue. Todellinen vaste vaihtelee yksilöllisesti.
- `INSUFFICIENT_DATA` kuvaa tilannetta, jossa vähintään yksi olennainen panos tai reseptin laajuus jää perustellun skenaarion ulkopuolelle.

Syötä jokaiseen skenaarioon sama ainesosajoukko. Syötä jokaiselle riville erän massa ja käytettävissä oleva hiilihydraatti samassa valmistustilassa tai suoraan erän CHO. Kirjaa GI-lähde, koostumuslähde, soveltuvuus ja skenaarion perustelu. Summaa CHO × GI / 100 ja jaa annoksilla. Ota ääriarvot vasta valmiista reseptiskenaarioista. Esimerkiksi raakaa massaa ei yhdistetä keitetyn ruoan pitoisuuteen. Perustellusti pieni panos voidaan sisällyttää CHO-rajan ja lähteistetyn koodausmallin avulla. Sen epävarmuus dokumentoidaan ja sille voidaan käyttää omaa skenaariota, jos vaikutukselle on perusteltu vertailu. Merkittävä puuttuva määrä tai turvallisuuskysymys vaatii erillisen ratkaisun.

Julkaisussa hyväksytty vaihteluväli kulkee nykyisen GK-version kautta kentillä `scenarioRange`, `rangeKind: ESTIMATED_RANGE` ja tarvittaessa neljällä kielellä täytetyllä `rangeDrivers`-kentällä. Erillinen reseptikohtainen hyväksyntä ja lähde- sekä syötesidonta tarvitaan ennen version lisäämistä julkaistuihin versioihin. Laskentaskripti ja tutkimusehdotus ovat tästä reitistä erillään. Matalan GK:n suodatin hyväksyy välin vain, jos sen molemmat päät ovat matalassa luokassa. Uusi esitystapa näyttää arvion, selitteen ja tarvittaessa luokkarajan ylityksen.

## Bindaetteokin ehdollinen vaihteluväli

Kaksi annosta. 150 g mungpapua oletetaan kuivaksi kokonaiseksi pavuksi ennen liotusta. Idut punnitaan raakana. Taikina paistetaan alkuperäisen ohjeen mukaan. Kummassakin mallissa käytetään samaa nimettyä Schöni-kimchiä. Skenaarioiden ero tulee taikinan vertailuletusta ja itujen koostumuksesta.

| Ainesosa | Erän määrä | CHO g/annos, A / B | GI, A / B | GK/annos, A / B | Laskennan lähde ja rajaus |
|---|---:|---:|---:|---:|---|
| Mungpapu | 150 g | 31,425 / 31,425 | 36 / 50,8 | 11,313 / 15,96390 | AFCD F000446, 41,9 g CHO/100 g kuivapainoa. A käyttää jauhosta tehdyn cheelan ihmismittausta, B liotetuista ja jauhetuista kokonaisista mungpavuista tehdyn pesarattun mittausta. |
| Mungpavunidut | 150 g | 0,975 / 6,975 | 26,24 / 26,24 | 0,25584 / 1,83024 | A käyttää MEXT 06291:n massasummaa, B Lounasidun tuotetietoa. GI on idätetyn ja höyrytetyn mungpavun ehdollinen vertailu. |
| Schöni-kaalikimchi | 150 g | 0,825 / 0,825 | 40 / 40 | 0,330 / 0,330 | Schöni Peperoni 1,1 g/100 g, EAN 7610596170075. GI 40 on Atkinsonin julkaisema vihannesten koodausoletus, jota sovelletaan tässä vähähiilihydraattiseen kimchiin. |
| Kevätsipuli | 2 rkl | 0,250 / 0,250 | 40 / 40 | 0,100 / 0,100 | Nykyisen pilotin CHO-raja on 0,50 g erälle. Molempiin skenaarioihin sisällytetään rajan mukainen panos samalla vihanneskoodilla. |
| Puhdas paistoöljy ja suola | 1 rkl öljyä, suolaa maun mukaan | 0 / 0 | — | 0 / 0 | Raaka-aineissa ei ole käytettävissä olevaa CHO:ta. |
| **Yhteensä** | | **33,475 / 39,475** | | **11,99884 / 18,22414** | Mallien erotus 6,22530 GK-yksikköä. |

Ehdotettu näyttö **GK 11,9–18,3 / annos · arvio**. Päät pyöristetään ulospäin yhteen desimaaliin. Kumpikin pää on nimetty vertailuskenaario. Kuivat jauhot ja liotettu karkea taikina eivät ole sama ruokamatriisi. Höyrytetty itu ei varmista pannulla taikinassa kypsennetyn idun GI:tä. Kevätsipulin ja kimchin mallipanokset ovat pieniä ja näkyvät summassa. Pääasialliset muutoksen aiheuttajat ovat mungpaputaikinan vertailu (4,65090 yksikköä) ja itujen koostumus (1,57440 yksikköä).

GI 45 kuuluu alkuperäisen taulukon mukaan fermentoidulle kikhernecheelalle. Vuoden 2002 koosteessa se kohdistettiin virheellisesti fermentoimattomaan mungpapucheelaan. Siksi 45 korvataan märkäjauhetun pesarattun valmistusvertailulla. [Batra ym., taulukko 3](https://apjcn.qdu.edu.cn/3_4_1.pdf#page=2) · [Pesarattu, s. 155–156](https://krishikosh.egranth.ac.in/server/api/core/bitstreams/5a54449e-2b00-41f6-ba6c-11ed98ffd41b/content)

Kimchivertailussa Sempio ilmoittaa 2,0 ja Jongga EU 7,8 g CHO/100 g. Samassa 75 g annoksessa tämä on 1,50 ja 5,85 g. Kumpikin ilmoittaa hiilihydraattipitoisuuden tuotteelle, mutta koostumus ja mausteliemi eroavat. Näitä tuotteita ei sisällytetä Schöni-skenaarioon, sillä vihanneskoodin siirto etenkin makeammalle tuotteelle vaatisi perustelun. [Schöni](https://schoenifood.ch/de/produkte/fermentiert-und-roh/schoni-bio-kimchi-mit-peperoni-fermentiert-roh-280g/) · [Sempio](https://finefoods.fi/tuotteet/sempio/sempio-kimchi-korealainen-kaalivalmiste-160-120g/) · [Jongga](https://jonggaeurope.com/blog/product/fermented-napa-cabbage-kimchi-700g/)

Muut lähteet: [AFCD](https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd/data-files), [MEXT](https://fooddb.mext.go.jp/details/details.pl?ITEM_NO=6_06291_7), [Lounasitu](https://lounasitu.fi/tuotteet/mungpavun-idut/), [höyrytetyn mungpavun GI](https://pmc.ncbi.nlm.nih.gov/articles/PMC11462625/#sec3-7), [Atkinson 2008](https://doi.org/10.2337/dc08-1239).

## 33 puuttuvan reseptin seulonta

Kaikki ID:t tarkistettiin mainin paikallisesta GK-auditista. Tarkastelu painottui siihen, voiko tunnetun pääraaka-aineen päälle rakentaa kaksi kokonaista vertailua. Rinnakkaiset luonnokset eivät ole uusia tuloksia tässä ajossa.

| Resepti | Tulos tai avoin laskentaperuste |
|---|---|
| indonesialainen-nasi-goreng-aamiaisriisi | Kecap manisin tuote ja salottisipulin massa puuttuvat. |
| korealainen-bataatti-riisikulho | Gochujangin koostumus ja bataatin kypsennysvertailu puuttuvat. |
| chole-bhature | Vehnäjauhon 64,75 g CHO/annos vaatii uppopaistetun bhaturen vertailun. Tomaattimurska on erillinen este. |
| aloo-paratha | Täytetyn ja paistetun vehnätaikinan prosessivertailu puuttuu. Perunan GI ei ratkaise jauhoa. |
| intialainen-aloo-paratha | Jauhon paistovertaus ja korianterin lähdesidos puuttuvat. |
| samosa | Perunalle voi laskea osavälin. Uppopaistetun kuoren 55,50 g CHO/annos jää ilman vertailua. |
| bibimbap | Gochujangille tarvitaan nimetty tuote ja koostumus. Riisi on valmistusvertailun ehdokas. |
| chow-mein | Osterikastikkeen etiketti ja vanhentuneen rakennesidoksen korjaus puuttuvat. |
| bun-cha-hanoi | Marinadin jäämä ja kastikkeiden määräsidokset puuttuvat. |
| char-siu | Riisistä saadaan osavertailu. Hoisinin 4,19 g CHO/annos vaatii laskentaperusteen. |
| sichuan-hot-pot | Nuudelityyppi sekä syödyn liemen koostumus ja määrä ovat avoinna. |
| kerala-kalacurry | Kookosmaidon ja tamarindin laskentaperusteet puuttuvat. Rinnakkainen PR #227. |
| kiinalainen-kevatsipulipannukakku | Vehnäjauhon 37 g CHO/annos tarvitsee paistetun letun vertailun. Rinnakkainen PR #227. |
| gulab-jamun | Paistetun jauhon vertailu ja syödyn siirapin määrä tarvitaan. |
| vada-pav | Uppopaistettu kikhernejauho vaatii eri vertailun kuin kokonainen kypsä kikherne. |
| pizza-margherita | Uunissa paistetun pizzapohjan 111 g CHO/annos vaatii pohjakohtaisen vertailun. |
| vhh-lihapiirakka | Mantelijauhon 1,35 g CHO/annos ylittää yksittäisrajan. Valmistusnäyttö tai perusteltu panosraja puuttuu. |
| vhh-runebergintortut | Mantelijauhon 1,08 g CHO/annos ylittää yksittäisrajan. Tuotevariantti on lukittava. |
| keto-korvapuustit | Mantelijauhon 1,35 g CHO/annos vaatii pullamatriisin vertailun tai perustellun panosrajan. |
| paistettu-maksa-pekonilla | Naudan maksan 6,25 g CHO/annos tarvitsee soveltuvan laskentaperusteen. Rinnakkainen PR #227. |
| pad-thai-vhh-konjac | Tamarinditahnan 4,305 g CHO/annos ei ratkea hedelmän GI:llä ilman tahnavertailua. |
| ketopizza-pofiber-pohjalla | 150 g täytteitä on nimeämättä. |
| keto-kauralesesampylat | Kauraleseen 1,63 g CHO/annos vaatii leivotun vertailun tai perustellun panosrajan. |
| tangyuan | Mustan seesamin lähteet antavat eri päätöksen poisjätöstä. Riisitaikinan vastaavuus tarkistettava. |
| malesialainen-kookos-banaanikulho | Palmusokerin koostumus ja tapiokan valmistusvertailu puuttuvat. |
| nasi-lemak | Sambalin tuote sekä kookosriisin vastaavuus puuttuvat. |
| intialainen-masala-dosa | Reseptissä 150 g sinapinsiemeniä kahdelle. Varmista ainesosa ja määrä ennen mallia. |
| meksikolainen-chilaquiles-verdes | 150 g vihreää salsaa kahdelle tarvitsee etiketin. Tomaattisalsa ei ole riittävä vertailu. |
| meksikolainen-huevos-divorciados | Vihreän salsan tuote puuttuu. Punainen salsa pitää arvioida erikseen. |
| korealainen-bindaetteok-aamiaiseksi | Ehdollinen 11,99884–18,22414. Katso ainesosittaiset skenaariot yllä. |
| pohjoisafrikkalainen-harcha-juustolla | Pannulla valmistetun mannasuurimon 31,8 g CHO/annos tarvitsee vertailun. |
| karibia-johnny-cake | Paistetun vehnätaikinan 37 g CHO/annos tarvitsee vertailun. |
| karibia-bammy-kassavaleipa | Kassavan massan ja lähdesidonnan korjaus sekä turvallisen käsittelyn tarkistus tarvitaan. |

## Kattavuus ja päätettävät kohdat

Julkaistussa lähtöaineistossa on **197 yhden luvun arviota**, **10 hyväksyttyä vaihteluväliä** ja **119 keskeneräistä**. GK-tiedon piirissä on 207/326 eli 63,50 %. Hyväksytty väli ja piste lasketaan samaan tavoitelukuun, yksi tulos per resepti. Luokittelussa käytetään tarkkoja päitä ennen näyttöpyöristystä.

33 reseptistä **yksi sai ehdollisen numeerisen ehdotuksen**. Muut 32 jäivät ilman käyttökelpoista kokonaisarviota. Ainoa mitattu ehdotusten leveys tässä erässä on 6,23 GK-yksikköä. Aineisto ei riitä tyypillisen leveyden yleistämiseen. Bindaetteokin hyväksyntä nostaisi potentiaalisen kattavuuden 208/326:een (63,80 %), jolloin 80 %:n tavoitteeseen jäisi 53 reseptiä. 15 ehdotuksen tavoite jäi vajaaksi erityisesti silloin, kun epävarmuus koski pääasiallista tärkkelysmatriisia, nimeämätöntä tuotetta tai todellista käytettyä määrää.

Bindaetteokille katselmoitavat päätökset ovat 150 g:n kuivapainotulkinta, Schöni- ja ituskenaarioiden soveltuvuus, höyrytetyn idun ja kahden vertailuletun GI-siirrot sekä vihanneskoodin käyttö. Jos nämä hyväksytään, julkaistava teksti rajataan nimettyihin skenaarioihin. Julkaistun kattavuuden raportti tulee nykyisistä hyväksytyistä versioista, ja potentiaalinen kattavuus raportoidaan erikseen tutkimuksesta.

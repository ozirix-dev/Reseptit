# Issue #404 / B5: suolakalafritterien kalatuotteen ja self-raising-jauhon lähde-ehdokkaat

**21.11.2026 – lähdetutkimus, EI RAVINTO- TAI JULKAISUHYVÄKSYNTÄÄ**

- Lähtö-`main`: `368926b1f56a117e70066d0175f57fcb847ddc42`.
- Soveltamisala: yksi jo olemassa oleva ja yhä **DRAFT/HOLD**-tilainen FI-ehdokas `docs/reviews/issue404-b-five-draft-recipes/karibia-saltfish-fritterit-punnittu-v2.md`, jonka Git-blob on `81545e328ec06555b814e6da50165b848581b401`. Alkuperäinen `karibia-saltfish-fritterit` pysyy karanteenissa.
- Pääasiallinen ruokalajilähde: [Anthea Stephenson, Jamaican saltfish fritters – Good Food](https://www.bbcgoodfood.com/recipes/jamaican-saltfish-fritters). Tekijän resepti sisältää **160 g kuivattua suolaturskaa, 300 g self-raising-jauhoa ja 375–390 ml vettä** ja ilmoittaa saannoksi noin **14–16 fritteriä**. 16 on yhden pienen fritterin nimellinen laskentayksikkö, **ei** 16 täysimittaista ateriaa.
- Tämän työn muutos on kahden ainesosarivin tutkimusviite `docs/nutrition/issue404-b5-ingredient-preflight.json`-aineistossa sekä sen regressiotesti. FI-menetelmä, ainesosamäärät, ravintokentät, kuva, käännökset, GK ja tuotanto pysyvät koskemattomina.

## 1. Kuivattu suolaturska: tuote- ja käsittelytilan suuri vaihtelu

Kaksi **erilaista, selvästi nimettyä vertailua**:

| Lähde | Tila ja rajaus | Proteiini / 100 g | Rasva / 100 g | Hiilihydraatti / 100 g | Muu olennainen tieto |
| --- | --- | ---: | ---: | ---: | --- |
| [Ghezzi, Dry cod / Baccalà secco](https://ghezziitalia.com/en/product/dry-cod/) | Valmistajan `Gadus morhua`, kuivattu ja suolattu *myyntituote* | **28 g** | 1,0 g | 0 g | Suolaa 6,8 g/100 g, vaatii tuotekohtaisen liotuksen; Ghezzi ilmoittaa jäähdytetyn säilytyksen |
| [Norjan virallinen elintarviketietokanta, 04.253](https://www.matvaretabellen.no/en/cod-split-salted-and-dried/) | Halkaistu, suolattu, kuivattu ja kuumentamaton turska; tietokannan **syötävän osuuden** luvut | **64,3 g** | 1,1 g | 0 g | Vettä 35 g/100 g; syötäväksi osuudeksi ilmoitettu 75 % |

Lähteiden proteiinilukujen ero on **36,3 g / 100 g**. Se ei muodosta hyväksyttyä ravintoarvon vaihteluväliä: tuotteen kosteus, prosessointi ja vertailun syötävän osuuden määritelmä ovat erilaisia. Tuote- ja lähderajaukset selviävät valmistajan/virallisen tietokannan omista sivuista. [Norjan elintarvikeviranomaisen menetelmäkuvaus](https://www.mattilsynet.no/en/food-and-beverages/matvaretabellen/about-the-data-in-the-norwegian-food-composition-table) muistuttaa, että luvut koskevat **100 g syötävää osaa**, eivät automaattisesti kokonaisen ruotoisen/pintakuivan kappaleen ostomassaa.

**Good Foodin noin 8 minuutin keittovaihe ei ole yleinen suolanpoisto-ohje.** [Ghezzi](https://ghezziitalia.com/ghezzi/salato-secco/) edellyttää tuotteiden liotusta ennen ruoanvalmistusta ja toteaa ajan riippuvan muun muassa kalan koosta ja veden lämpötilasta. Tästä ei päätellä vakio-liotusaikaa lähteistämättömälle Recipavo-tuotteelle. Suolanpoisto, syötävän massan saanto ja valmistuksen jälkeinen proteiini/suola jäävät kaikki tuntemattomiksi. Tuotemerkin valinta on tekemättä, eikä kumpaakaan lähdettä saa kopioida lopullisen aterian laskentaan.

**Polyolit:** kumpikaan vertailu ei ole tutkimustietue, joka hyväksyisi juuri tämän liotetun ja keitetyn kalan kaikki neljä makrokenttää Recipavon malliin. Erillisen polyoliarvon puuttumista ei muuteta nollaksi. Tällä lähdevertailulla ei hyväksytä uusia netto-/kokonais-HH- tai proteiiniarvoja.

## 2. Self-raising-jauho: oikean tuotetyypin nimetty tutkimusehdokas

[Tescon tuotekortti: Carr's Self Raising Flour 1 kg](https://www.tesco.com/shop/en-GB/products/264883892) kuvaa tuotteen ainesosiksi vehnäjauhon sekä **kohotusaineita (kalsiumfosfaatti ja natriumbikarbonaatti)**. Se on siksi tavallista Fineli-vehnäjauhoa parempi **tuotetyypin vertailuehdokas**. Tekijän Good Food -ohje ei kuitenkaan nimeä Carr'sia, eikä sitä ole erikseen valittu Recipavon FI-luonnokseen.

| Tuotekortin ilmoitus, per 100 g | Määrä |
| --- | ---: |
| Hiilihydraatit, EU-ilmoitus | 73,2 g |
| Ravintokuitu | 1,9 g |
| Proteiini | 8,7 g |
| Rasva | 0,5 g |
| Polyolit erikseen | **Ei ilmoitettu** |

**Ehdollinen raaka-ainekohtainen lasku, ei julkaistava ravintoarvo:** jos juuri tätä tuotetta käytettäisiin 300 g, jauhon EU-merkinnän hiilihydraatit olisivat `300 × 73,2 / 100 = 219,6 g` **pelkästä taikinajauhosta koko erässä**. Nimellisellä 16 fritterin kappalemäärällä vastaava luku olisi `219,6 / 16 = 13,725 g` **vain jauhosta / pieni fritteri**. Jos saanto on 14, kappalekohtainen määrä on eri. Nämä eivät ole koko reseptin HH-arvoja eivätkä nettohiilihydraatteja.

[EU:n elintarviketietoasetuksen 1169/2011 liitteen I](https://eur-lex.europa.eu/eli/reg/2011/1169/oj/eng) määritelmässä **hiilihydraatit sisältävät polyolit**, mutta ravintokuitu on erillinen. Carr'sin tuotekortti ei erittele polyoleja, joten `73,2 g` ei automaattisesti ole Recipavon `carbs_net_per_serving_g`; tuotepakkaus ja laskennan lähdesoveltuvuus on vahvistettava.

Fineli 110 on olemassa olevan JSON-esitarkistuksen **tavallisen vehnäjauhon vertailutietue**, ei hyväksytty self-raising-jauhon korvike. Sitä ei poisteta historiasta eikä muuteta hyväksytyksi mallisyötteeksi.

## 3. Avoimet HOLD-portit / seuraava todellinen askel

1. **Kalan tuote ja tila:** nimeä juuri ruoanlaitossa käytettävä kuivattu suolaturskatuote ja sen valmistajan kylmäliotus-, suolanpoisto-, ruodonpoisto- ja kypsennysohje. Varmista raakatuotteen 160 g:n suhde syötävään keitettyyn ja valutettuun kalaan. Vertailutietojen 28/64,3 g proteiinia ei saa vaihtaa hyväksytyksi.
2. **Jauhon valinta:** vahvista käytettävä itsekohoava jauho, pakkausmerkintä, kuitu- ja polyolisemantiikka. Carr'sin nimetty vertailu ei ole reseptin tuotepäätös.
3. **Rasva ja muut ainesosat:** arvioi pannun noin 0,5 cm öljykerroksen **syöty** määrä erikseen (ei öljyn kaadettu määrä), chilin/paprikoiden/kevätsipulin syötävät massat, currysekoituksen tuotetiedot ja suolatun kalan jäljelle jäävä suola. Jokaisen laskettavan ainesosan raaka-/kypsätila vaatii soveltuvan tietueen.
4. **Vasta näiden jälkeen:** kaikkien neljän makron lähdeketju, GK:n soveltuvuus, kuva, EN/SV/TH, CI/Repo Guard ja erillinen tuotantojulkaisu.

**Päätös:** `publicationAuthorized=false`, `macrosAuthorized=false`, viisi B5-luonnosta edelleen DRAFT/HOLD, alkuperäiset riskitapaukset karanteenissa. Mitään verkossa näkyvän reseptin määrää, otsikkoa tai ravintolukua ei muuteta tässä työssä. Uusi näyttö on valmisteltu seuraavaa tuotevalintaa varten, ei tekosyy vapauttaa raakaa reseptiä julkaisuun.

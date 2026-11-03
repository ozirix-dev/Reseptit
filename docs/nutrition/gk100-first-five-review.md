# GK100 · PR #233:n katselmointivaste

Alla olevat laskennalliset arviot koskevat vain nimettyjä GK-versioita. Ehdokas-JSON sitoo annosmäärän, ainesmäärät ja valmistusohjeen sekä alkuperäisen reseptin ja laskentamuistion tarkisteet. A käyttää dokumentoitua pienosuussääntöä (alle 1 g/ainesosa ja alle 2 g yhteensä annosta kohti). B-ehdokkaassa ei ole pois jätettyä positiivista CHO-osuutta. Lähdeluettelo erottaa ihmisillä mitatut GI-verrokit laskentakoodeista.

| Resepti | Menetelmä ja GK/annos | CHO pois/annos | Tila ja avoin ehto |
| --- | --- | ---: | --- |
| Jiaozi | A · 15,95 · 4 annosta | 0,37875 g | **OWNER DECISION**. Päätös keitetystä GK-versiosta ja epävarmasta analogiasta. |
| Chow mein | A · 11,92–12,18 · 4 annosta | 0,93 g | **READY**. Hyväksytty versio käyttää 300 g kypsää valutettua munanuudelia ja 12 g Lee Kum Kee UK Premium Oyster Saucea. Väli vaihtaa GI-verrokkia samalla nuudelimäärällä. |
| Serabi | B · 40,22 · 2 annosta | 0 g | **READY**. Hyväksytty ohut pannuserabi, jonka koko taikinalle käytetään dosaverrokkia. Fariinisokeri antaa laskelmassa 8,57 GK/annos erikseen. |
| Dan dan | A · 18,53–24,98 · 4 annosta | 0,195 g | **OWNER DECISION**. Päätös kahdesta 300 g:n nuudelivaihtoehdosta ja tarjoilusta ilman valinnaista paksoita. |
| Soba-aamiaiskeitto | A · 20,43 · 2 annosta | 0,90 g | **OWNER DECISION**. Päätös nimetystä sobasta, punnitusta dashista, nimetystä kanaliemestä ja pinaatista. |

Omistaja hyväksyi 3.11.2026 chow meinin ja ohuen pannuserabin GK-versiot commitissa `a16f1e19a07641164cdd15659a8b27b84deef66f`. Chow meinin ehdokas-JSONin SHA-256 (LF-rivinvaihdoilla) on `190fcd3422ebe04dee0a22d65d13ebca83c1de240e78898286fb75727623edf4` ja serabin `8fed31af6463e8c0907a294fc12b1e0162ee5cd86b986eeec7c04bd867b4b7ad`. READY tarkoittaa tässä hyväksyttyä GK-versiota. Julkaisuvaltuutus säilyy erillisenä.

Codexin uusintakatselmointi valmistui samalle commitille ilman uusia tai ratkaisemattomia löydöksiä. Myös build läpäisi. [Katselmointi](https://github.com/ozirix-dev/Reseptit/pull/233#issuecomment-6615481518) · [Build](https://github.com/ozirix-dev/Reseptit/actions/runs/41718687542/job/126205347041)

## Katselmoinnin lähdeviitteet

- Jiaozi. Ehdokkaan nelikielinen `limitation` ilmoitti jo 0,38 g:n pyöristetyn poisjätön sekä testinyytin tuntemattoman kypsennystavan ja kuoriosuuden. [Laskentamuistio 35](gk80-operation80-batch-35.md) täsmentää täytteen ja koko nyytin analogian. [Yang, taulukko 2](https://www.wjgnet.com/1007-9327/full/v12/i21/3430-T2.htm)
- Chow mein. [Laskentamuistio 25](gk80-operation80-batch-25.md) sitoi jo punnitun kastikkeen ja keitetyn nuudelin sekä erotti skenaariot biologisesta vaihtelusta. Ehdokkaan nelikielinen rajaus tuo nyt näkyviin myös 0,93 g:n poisjätön ja GI-koodauksen.
- Serabi. [Laskentamuistio 28](gk80-operation80-batch-28.md) sitoi jo ohuen pannuversion, taikinan 83,31 g CHO:ta ja fariinisokerin erillisen sakkaroosiverrokin. Ehdokkaan nelikielinen rajaus nimeää nyt GI-luvut sekä urad-pavun ja kookoksen eron ratkaisemattoman vaikutuksen.
- Dan dan. [Laskentamuistio 26](gk80-operation80-batch-26.md) sitoi jo lähtöpainot, kaksi eri tuotetta ja paksoittoman tarjoilun. Ehdokkaan nelikielinen rajaus ilmoittaa nyt molemmat lähtöpainot, GI-verrokit ja etikan poisjätön.
- Soba. [Laskentamuistio 27](gk80-operation80-batch-27.md) sitoi jo 100 g kuivaa Muso NDL030 -sobaa, 200 g siivilöityä dashia, 700 ml Aneto-kanalientä ja 50 g pinaattia. Ehdokkaan nelikielinen rajaus nimeää tuotteet, anjovisliemessä mitatun nuudeliverrokin ja laskentakoodit. Liemien poisjättö oli jo 0,90 g.

## Lähteiden käyttö

Yangin taulukosta 2 käytetään kahta yksittäistä mitattua keskiarvoa omien laskelmien syötteinä: jiaoziin liha–salottisipulinyytin GI 28 ja dan daniin kuivatun vehnänuudelin GI 46. Artikkelin CC BY-NC 4.0 koskee lisenssin alaisia oikeuksia. Rajatun käytön peruste on yksittäisten faktalukujen käyttö lähdeviitteellä. Paketit käyttävät omaa tekstiä ja laskentaa sekä linkittävät taulukkoon. Artikkelin tekstiä, taulukkoa tai kuvaa ei kopioida. Arvio koskee näitä kahta lukua. Laaja tai järjestelmällinen poiminta arvioidaan erikseen. [Yang, taulukko 2](https://www.wjgnet.com/1007-9327/full/v12/i21/3430-T2.htm) · [CC BY-NC 4.0, kohdat 1 ja 2](https://creativecommons.org/licenses/by-nc/4.0/legalcode.en) · [Tekijänoikeuslain 49 §](https://finlex.fi/fi/lainsaadanto/1961/404#chp_5__sec_49)

MEXT:n koostumusdatan oma ohje sallii datan vapaan käytön ja pyytää nimeämään taulukkoversion sovelluksissa ja muussa jatkokäytössä. Ajantasaiset japaninkieliset käyttöehdot sallivat kaupallisen käytön ja vapauttavat numerotiedot käyttöehdoista. Japaninkielisen liitteen ilmoitus- ja maksumaininta koskee taulukoiden vastikkeellista jakelua kirjana tai e-kirjana. PR käyttää kahta lukua omissa verkkolaskelmissa: kypsentämätön udon 01038, 50,1 g/100 g massaperusteista imeytyvää hiilihydraattia, ja bonito-dashi 17019, 0,2 g/100 g erotusmenetelmällä. Attribuutio on MEXT, 日本食品標準成分表（八訂）増補2023年, ja laskelma on Reseptitin. [Koostumusdatan käyttöohje](https://www.mext.go.jp/a_menu/syokuhinseibun/index.htm) · [Japaninkieliset käyttöehdot](https://www.mext.go.jp/b_menu/1351168.htm) · [Liite](https://www.mext.go.jp/b_menu/1366610.htm) · [Udon 01038](https://fooddb.mext.go.jp/details/details.pl?ITEM_NO=1_01038_7&MODE=7) · [Dashi 17019](https://fooddb.mext.go.jp/details/details.pl?ITEM_NO=17_17019_6)

Valmistajalähteistä käytetään tuotteen nimeä, koostumusta ja viitattua yksittäistä ravintoarvoa oman GK-laskelman syötteenä. Julkaisupaketti käyttää omia tekstejä ja lähdelinkkejä. Finelin attribuutio on THL, CC BY 4.0. AFCD:n attribuutio on FSANZ, CC BY-SA 3.0 Australia. [Muson tuoteseloste](https://muso-intl.com/wp-content/uploads/2026/01/NDL030-ORGANIC-100-BUCKWHEAT-SOBA-WEB.pdf) · [Aneton ravintoarvot](https://www.caldoaneto.com/en/product/wellness-broths/natural-low-sodium-chicken-broth)

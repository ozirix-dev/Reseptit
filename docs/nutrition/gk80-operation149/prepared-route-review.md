# GK80: 30 ehdotuksen erä ja uuden B-reitin katselmointi

**PR #183 pysyy Draftina. Erässä on 16 aiemmin hyväksyttyä integroitua versiota sekä 14 hyväksymätöntä laskentaehdotusta. Tämä koonti ei ole julkaisuvaltuutus tai todiste kaikkien lähderuokien vastaavuudesta.**

Tuotannosta aiemmin varmennettu lähtötila on **156/326 (47,85 %)**. Draftin aktivoitu ehdokas on **172/326 (52,76 %)**. Jos kaikki 14 uutta ehdotusta hyväksytään, sovitetaan sivustolle ja tarkistetaan, ehdokas voisi olla186/326 (57,06 %). Tämä on ehdollinen mahdollisuus, ei nykyinen kattavuus.80 % vaatii261/326:ta; ehdollisen186:n jälkeen puuttuisi vielä75.

## Valittu uusi reitti

Käytetään ensin nykyistä ainesosamallia. Kun ihmisillä mitattu valmis ruoka tai valmistettu osa vastaa nimettyä reseptiversiota perustellusti, B-pilotti sitoo GI:n kyseiseen valmistettuun kokonaisuuteen. Hiilihydraattimäärä lasketaan silti version omista punnituista syötteistä ja natiiveista saatavan hiilihydraatin kentistä. Valmistetun ruoan GI:tä ei kirjata raaka-aineen GI:ksi.

`prepared-route-cases.json` määrittelee laskentayksiköt. Jokainen ainesosa kuuluu tasan yhteen yksikköön. Valmiin aterian GI edellyttää koko version hiilihydraattiannosta; komponentin GI kattaa vain nimetyn komponentin. Lisäkkeet lasketaan erikseen tai rajataan näkyvästi version ulkopuolelle. Testiannoksen ruoka- tai50gCHO-määrä ei määritä reseptin annosta.

Kunkin lähteen ruoka, menetelmä, koehenkilöt ja rajoitteet löytyvät `prepared-route-observations.json`:sta. Jokaisen version lähde- ja syötehashit ovat `prepared-route-cases.json`:ssa. `proposal-batch.json` lukitsee14 ehdotuksen tarkat syötteet ja laskentamenetelmän sekä lähdepaketit katselmointia varten. Omistajan aiempi16 version hyväksyntä säilyy erillisenä ja muuttumattomana.

[Dodd ym.2011](https://pubmed.ncbi.nlm.nih.gov/21831990/) perustelee valmiin aterian vasteen tutkimista. Tutkimuksen kolmen aterian tuloksia ei käytetä yleisenä korjauskertoimena tai näiden reseptien GI-lähteenä. Pilotissa ei ole yleistä ateria-alennuskerrointa.

## Kaikki14 uutta ehdotusta

Taulukon desimaalit auttavat laskennan tarkistusta. Ne eivät kuvaa biologista mittaustarkkuutta. Kaikki ovat LOW-malleja ja odottavat sisältö-, menetelmä- ja lähdesovelluskatselmointia. B-reitin ehdotettu näyttö pyöristää vähintään10:n pisteet kokonaisluvuiksi ja pienemmät yhden desimaalin likiarvoiksi. Positiivinen A-poisjättö pysyy näkyvissä.

| Täsmällinen versio | Reitti | Laskenta-GK/annos | Olennainen rajaus |
| --- | --- | --- | --- |
| Kahvijogurtti banaanilla | A | ≈10,92 |100g maustamatonta jogurttia,200g suodatinkahvia,125g banaania,30g makeutettua kondensoitua maitoa;2 annosta. Kondensoidulle maidolle nimetty61, banaanille47; jogurtin30 on erikseen katselmoitava projektikoodaus. Kahvin0,3gCHO/annos jätetään pois A-säännöllä. |
| Rahka-marjakerroskulho | A | ≈2,34 | Tuore mansikka ja wild blueberry; punnittu2g sitruunankuori,4g erytritolia. Positiivinen poisjättö0,67gCHO/annos. |
| Hojicha-jogurtti persimonilla | B | ≈8,42 | Haudukeversio:2g lehtiä+50g vettä, siivilöidään ja käytetään40g hauduketta. Vihreän teen hauduke on koostumusproxy, ei jauhettuja lehtiä. |
| Pad kee mao konjac-fettuccinella | A | ≈1,80 |600g valutettua nimettyä KoRo-tuotetta vedessä. Ilmoituksen<0,1gCHO/100g nimellinen katto; ei nolla tai kuivien nuudelien koostumus. Osterikastikkeen kanssa poisjättö0,9375gCHO/annos. |
| Besan-chilla kokonaisesta kikherneestä | B | ≈9,47 | Kuorimaton Cicer arietinum,100g jauhoa/222,2g vettä/16,7g öljyä. Ei kaupallista kuorittua besania. Tomaatti-sipulichutney mukana. |
| Pinaatti-paneer-chilla kokonaisesta kikherneestä | B | ≈8,92 | Sama kokonaisjauho;50g pinaattia,100g paneeria,2g juustokuminaa. Määräämätön tarjoiluchutney ja sitruunalohko ulkopuolella. |
| Chettinad-kana, vain curry | A | ≈1,42 | Punnitut mausteet ja10g tuoreita currylehtiä. IFCT Table6 saatavaCHO3,66; maustemassojen positiiviset katot mukana A-poisjätössä1,23355gCHO/annos. Tarjoiluriisi/leipä ulkopuolella. |
| Kaakao-kookos-chia, kookosmaitoversio | B | ≈1,59 | Alkuperäisen huomautuksen sallima300g makeuttamaton kookosmaito;40g chiaa,10g kaakaota,4,2g vaniljaa ja20g kookoskoristetta. Arvio riippuu projektin50-koodauksista; aromien/koristeen traceCHO0,7723g/annos. GI-epävarmuudelle ei lähderajaa. |
| Hyderabadi-kanabiryani,900g kypsää riisiä / uudelleenlämmitetty | B |30,60421–44,93684; näyttö30–45 | Erillinen uusi punnitun kypsän riisin versio. Koko ruoan nimetty vertailu52; kaksi kypsän riisin koostumusskenaariota ja mausteiden CHO-katot. Väli ei sisällä lähderuoan GI-vastaavuusvirhettä. |
| Baozi, mehukas porsaankaali-täyte | B | ≈31,56 |400g jauhoa,300g porsasta,150g kaalia;12 sämpylää/4 annosta. Kaalin neste säilytetään. Koko höyrytetyn täytetyn sämpylän vertailu39; lähteen täytesuhteet ja käyminen eivät ole tarkasti tiedossa. |
| Pizza Margherita | B | ≈59,16 |300g jauhoa/2 pizzaa. Kaupallisen paistetun pohjan52 koskee vain pohjaa; tomaatti ja basilika erikseen40, mozzarella natiivin0CHO:n mukaan. Kotitaikinan koostumus, kohotus ja paistolämpö poikkeavat. |
| Roti jala currykanalla | B | ≈19,62 |100g jauhoa,110g munaa; alkuperäinen200g kookosmaitoa jaetaan100g taikinaan/100g kastikkeeseen;100g vettä ja2g curryjauhetta täsmennetään.49 koskee vain verkkolettua. Kanan lisäkekookos ja curry erikseen. |
| Mannasuurimoupma, öljytön kasvisversio | B | ≈27,63 |100g mannaryynejä,150g kypsiä herneitä,80g porkkanaa,5g currylehtiä. Koko upman vertailu71 on öljyä ja urad dalia sisältävästä seoksesta. Koostumusero on olennainen ja sen GI-vaikutus tuntematon. Tarjoiluchutney/jogurtti ulkopuolella. |
| Taatelipuuro appelsiinilla, öljyä sisältävä versio | B | ≈21,64 |100g mannaa,300g vettä, uusi6,4g rypsiöljyä. Valmistetun mannapohjan vertailu55;10g DegletNoor-taatelia42 ja130g raakaa appelsiinia45 erikseen. Höyrytys vs vesikeitto sekä öljylaji ja vanha diabeteskoe heikentävät sovellusta. |

Ensimmäisen kuuden ehdotuksen yksityiskohdat ovat [lähdepalautuksen katselmoinnissa](recovery-review.md) sekä `additional-proposal.json`:ssa. Uusi kahdeksikko ei muuta niiden lähteitä.

## Kuusi valmistetun ruoan lähdesovellusta

| Sovellus | Täsmällinen tutkimuskohde ja tulos | Olennaiset erot ja näytön rajat |
| --- | --- | --- |
| Biryani | [AlDhaheri ym.2017](https://doi.org/10.1017/S0007114517001027), taulukot2/4; basmatiriisiä ja keitettyä kanaa sisältävä ravintolaruoka,52±4SEM;15 tervettä. Ostettu edellisenä päivänä, lämmitetty koeaamuna. | Kylmäsäilytyslämpöä ja määriä ei ilmoiteta. Oma jogurtti/öljy/kerrostus poikkeavat. Tutkimus-CHO oli erotuslaskentaa; siitä ei peritä nykyreseptin CHO:ta tai P0:aa. Koko ruoan52 ei ole riisin GI. |
| Baozi | [Yang ym.2006](https://www.wjgnet.com/1007-9327/full/v12/i21/3430.htm), taulukko2: höyrytetty liha/salottisipuli-sämpylä,39,1±13,0SD,n10;2021 taulukon vakioitu luku39. | Kaalin ja mausteiden suhteet, jauhokoostumus sekä käymis- ja kypsennyshävikki jäävät tuntemattomiksi. Syötteistä laskettuCHO on nimellinen malli, ei valmiin sämpylän analyysi. |
| Pizzapohja | [Atkinson ym.2021](https://doi.org/10.1093/ajcn/nqab233), Table1/68,s.6; Boboli/Orograin-pohja,220°C9min,52±4SEM,n10. | Kaupallisen pohjan tarkka historiallinen kaava ei tiedossa; kotitaikinan kohotus ja250°C7–10min poikkeavat. Tulos ei ole mitattu Margherita-aterian GI. |
| Roti jala | [Robert ja Ismail2012](https://pubmed.ncbi.nlm.nih.gov/22212476/), Table2/3789,s.119; pelkkä verkkolettu49±6SEM,10 tyypin2 diabetesta sairastavaa,25gCHO/3h. | Tarkkoja taikinasuhteita ei saatu abstraktista/taulukosta. Samassa tutkimuksessa curryateria oli81. Kokonaista lautasellista ei saa kuvata49:llä; protokolla ja potilasryhmä heikentävät siirtoa. |
| Upma | [Tan ym.2018](https://doi.org/10.1017/S0007114518000703), taulukot2/4;75,2g mannapohjaista valmisjauhetta+235g kiehuvaa vettä,3min;71±6SEM,19 tervettä. | Lähde sisältää öljyä, urad dalia ja chiliä; oma ruoka on öljytön herne-porkkanaversio. Vilja ja kypsennyksen perusmuoto vastaavat, matriisi poikkeaa olennaisesti. Tämä on erikseen katselmoitava vertailuskenaario. |
| Mannapohja | [Atkinson ym.2021](https://doi.org/10.1093/ajcn/nqab233), Table2/3917,s.127,1991/ref277; höyrytetty/gelatinoitu vehnämanna+5g maapähkinäöljyä,55±9SEM. | Vain6 tyypin2 diabetesta sairastavaa, harvat näyteajat, toistamaton viite. Oma vesikeitetty puuro ja rypsiöljy poikkeavat. Tämä on erityisen heikko B-sovellus, joka voi päätyä HOLDiin sisältökatselmoinnissa. |

Lähteiden SEM/SD-arvoja ei muuteta reseptin luottamusväliksi. Taulukot1/2 erotellaan; vanhat potilasaineistot eivät saa terveiden nykymittauksen statusta. Jokaisen sovelluksen GI-vastaavuusvirhe on määrällisesti tuntematon. Omistajan hyväksyntä ei korvaa puuttuvaa tutkimusnäyttöä: jos vastaavuutta ei voida puolustaa, kyseinen tapaus jää HOLDiin.

## 900g riisiä: laskentaperuste ja annos

Alkuperäisen300g kuivan riisin saantoa ei ole varmennettu. Uudessa ehdotuksessa käytetään **900g jo kypsää, syötäväksi valmistettua ja punnittua basmatiriisiä**, kerran koko neljän annoksen erässä.300g kuivaa ei ole toisena syötteenä. Tämä on uusi versio omistajan päätettäväksi; alkuperäistä reseptiä ei korvata tai väitetä samanarvoiseksi.

Koostumusvaihtoehdot ovat Finelin kypsä pitkäjyväinen riisi23,561g ja AFCD:n kypsä valkoinen riisi34,7g saatavaaCHO:ta/100g. Ne lasketaan **vaihtoehtoina**, eivät summana. Ne eivät osoita todellisen basmatierän kosteuden biologisia ala- tai ylärajoja. Myös pienille mausteille käytetään kokonaismassan CHO-kattoja; niille ei keksitä nollaa. Tuloksen30–45 näyttöväli kattaa vain nämä koostumus-/kattoskenaariot kiinteällä vertailu-GI52:lla. Todellisen reseptin GI voi poiketa vertailusta; tämä virhe jää välin ulkopuolelle.

Tutkimuksen253,9g ruokatesti/50gCHO on lähdemetadataa. Reseptin annos on neljäsosa sen omasta erästä. Se ei määräydy tutkimusannoksesta eikä tutkimusannoksen massaa käytetä hiilihydraattikertoimena. Uudelleenlämmitetyn version turvallinen jäähdytys ja kuumennus on kirjattu lähdeviittein ehdotukseen; lähteestä ei väitetä pakastusta tai tiedossa olevaa säilytyslämpöä.

## Uusi riippumaton CHO-kenttä

[IFCT2017](https://www.nin.res.in/ebooks/IFCT2017_16122024.pdf), määritelmäPDF-s.27 ja Table6/G010 PDF-s.221, painettu s.183: tuoreen currylehden analyyttinen **Total Available CHO3,66g/100g**. Tämä vapaisiin sokereihin ja tärkkelykseen perustuva kenttä erotetaan Table1:n erotuslaskennan4,51:stä. Kentät eivät todista polyolien kokonaismääräksi nollaa.

Painetut tärkkelys3,08 ja vapaat sokerit0,60 summautuvat3,68:aan. Julkaisun0,02:n eron syy ei ole tiedossa; pilotti käyttää lähteen natiivia kokonaisarvoa3,66 eikä korvaa sitä hiljaisesti uudella summalla. Molemmat väärät korvausyritykset4,51 ja3,68 estetään testillä. Lehden40 on erikseen katselmoitava nimetty nykykoodauksen sovellus, ei mitattu currylehden GI.

## Muutosten hyväksymisrajat

Koko14 ehdotuksen sisältöpäätös sisältää myös kokonaiskikhernejauhon kaksi versiota, pinaatti-paneer-version tarjoilurajauksen, curryn lisäkkeiden poisrajauksen,900g kypsän/uudelleenlämmitetyn biryanin, baozin kaalinesteen säilyttämisen, roti jalan veden/curryn/kookosmaidon jaon sekä taatelipuuron6,4g öljylisän. Olennaista muutosta ei siirretä alkuperäisreseptiin hyväksynnän varjolla.

Hyväksyntä14 tarkalle syötteelle ja B-reitin nimetyille sovelluksille mahdollistaisi julkaisuintegraation valmistelun. Sen jälkeen tarvitaan omat FI/EN/SV/TH-esitykset, makro-/evidenssierottelu ja kohdennetut regressiot. **Ready, merge ja deploy tarvitsevat edelleen erillisen luvan.** Aiemmin hyväksytyt16 versiota eivät saa uutta merkitystä tämän erän perusteella.

## Tarkistukset ja jäljelle jätetyt tapaukset

Suljettu pilotti tarkistaa annos- ja lähdesidonnat, koko ruoan/komponentin käyttöalan, jokaisen syötteen yhden laskentakerran, alkuperäisreseptin hashin ja riippumattoman Decimal-laskennan. Testit estävät kuiva/kypsä-kaksoislaskennan, biryanin siirron paellaan, pelkän roti jalan49:n käytön koko aterialle ja lähteen testiannoksen käyttämisen reseptiannoksen kertoimena. Yleinen aterian GI-korjauskerroin hylätään.

Jiaozi jää HOLDiin, koska käytetyn dumpling-havainnon kypsennysmenetelmä ja täyte/taikinasuhteet eivät varmistuneet. Paella ei peri biryanin52:ta. Alkuperäinen300g kuivan riisin biryani jää tämän uuden900g kypsän version ulkopuolelle. Koshari-, mauste- tai polyolipuuttuvia tapauksia ei aktivoida ohessa. ReportHub ja muut PR:t säilyvät erillään.

## Katselmoitavien syötteiden hashit

Täydet lähde- ja menetelmätiedostojen hashit ovat `proposal-batch.json`:ssa. Alla olevat hashit yksilöivät juuri tämän päätöserän. Ne eivät ole hyväksyntämerkintöjä.

| Resepti | Syöte-SHA256 |
| --- | --- |
| vietnamilainen-kahvijogurtti-banaanilla | `eeaa2cb0f21422ba5a7be8e48d7ddbed2798b02dbf7e4402afa4fa9c8a76c6f9` |
| rahka-marjakerroskulho | `092719e24df715f0149468125c91e24c08a5dffb29ba2d2f712bb779bd4bdc86` |
| japanilainen-hojicha-jogurtti-persimonilla | `c270484fbb4a94ab0b8709bbc76e01f812928e3939bfd9a6cd8704a9f770ba08` |
| pad-kee-mao-vhh-konjac | `0c692cf887c1a70c12d537c3685a25284f004653e752f7e3995197129a50370e` |
| intialainen-besan-chilla | `afc7beb15b482d6b53c84e7d4c58bee88c007a4232a6984918b0320e6f9ed213` |
| intialainen-pinaatti-paneer-chilla | `6c0b1890e16a526a75f5e8ef7b2729de3f7ef370c17b197dacb3990ece6f0710` |
| chettinad-kana | `ba7aeeede3d2222a38cf82d7ff2f571c64933269f439b52e4b9e7a4b64aec85e` |
| kaakao-kookos-chia | `20febc748b6f5c90dc4ba1c45b30cdf23066415cba6864b993c9ba2f9bed78d8` |
| hyderabadi-kanabiryani | `c4edb623fd0e8a0f827445572919bfa90aa179ba8f0f15b5a84b7e8f8d9bc71a` |
| baozi | `b5e23f709167bda9c1a3dc391fdb954dbef8a319fa9248524d1e6f0ebe2c3b1c` |
| pizza-margherita | `63ba95ac40191e5c9ac65ab63d04de1b72b79cef6fb48ac0722cd3353c5d7605` |
| malesialainen-roti-jala-currykanalla | `c01b8c61fa679a79c9e5f05274ae44bef799a0ce35df66923e05b5fbad60376c` |
| intialainen-mannasuurimoupma | `e8d9bad7423c5dc339439e239db95f4229bf3a4c1bab2c1ea7872715ad2d9892` |
| pohjoisafrikkalainen-taatelipuuro-appelsiinilla | `68b056b6e386b45124ed30cc23f2f5ef091541926dce4dd7d805e8ae46924a53` |

Paikalliset tarkistukset:31 kohdennettua testiä PASS, mukaan lukien8 uuden laskelman riippumaton Decimal-toisto sekä kaikkien326 alkuperäistuloksen säilyminen. TypeScript ja906 Markdown-tiedostoa PASS. Kahden käsin kirjoitetun testivertailuarvon kirjoitusvirhe korjattiin aineskohtaisen Decimal-laskennan perusteella; lähteitä tai syötteitä ei muokattu testin läpäisemiseksi. Normaali PR-CI tarkistetaan täsmälliseltä uudelta HEADilta. Paikallista721 reitin julkaisubuildia tai Brave-kierrosta ei toistettu, koska uusi koodi on suljettu pilotti eikä sivustoesitys muuttunut.

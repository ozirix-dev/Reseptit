# AFCD-POLYOL-03 / GK 80-30: yhteisen erän luovutusaineisto

## Päätös ja todellinen kattavuus

Paras etenemisreitti on nykyisen GK-only-laskennan lähde-, määrä- ja valmistussidosten täydentäminen. Käytä A-aritmetiikkaa aina kun nykyiset ehdot täyttyvät; varaa B erikseen arvioitaville nimetyille analogioille. Yksi julkaisupolku on [Operaatio 149 V2, Draft PR #183](https://github.com/ozirix-dev/Reseptit/pull/183). Tämä haara toimittaa siihen konfliktittoman aineiston ja eristetyt laskentatyökalut.

**Yhteensä 21 uniikkia numeerista ehdokasta: 13 A + 8 B, C-luokkia 0.** Alkuperäiset 16 ovat #183:n menetelmä- ja sisältöhyväksytyssä integraatiossa; julkaisuvaltuutta ei ole. Kahvijogurtti on jo saman PR:n erillisessä A-ehdotuksessa. Tässä varmennettiin sen A-laskenta ja lisättiin pongal, dashimaki, hojicha-jogurtti ja rahka-marjakerroskulho. Alkuperäisten 16 hyväksyntä ei kata näitä viittä lisäsyötettä. Kahvijogurttia tai vaihtoehtoista B-laskelmaa ei lasketa toista kertaa.

| Tila | Numeerinen kattavuus |
| --- | ---: |
| Main / tuotannon lähtötila | 156/326 = 47,85 % |
| #183:n 16 erillisen version myöhempi julkaisu | 172/326 = 52,76 % |
| Lisäksi viiden lisäversion hyväksyntä ja julkaisu | 177/326 = 54,29 % |
| Vähintään 30 uuden ehdokkaan tavoite | 186/326 = 57,06 % |
| Lopullinen vähintään 80 %:n tavoite | 261/326 = 80,06 % |

**30:n tavoitteesta puuttuu 9 perusteltua numeroa.** Tällä ajolla julkaistuja uusia arvoja on 0. Nykyisestä lähtötilasta tarvitaan 105 uutta julkaisua; kaikkien 21 ehdokkaan mahdollisen julkaisun jälkeen puuttuisi 84. Neljä aiempaa mantelijauhon GI 50-tutkimusskenaariota eivät kuulu näihin lukuihin.

## Alkuperäisten 16:n viimeistely ja hyväksynnän raja

[16-decision-matrix.csv](16-decision-matrix.csv) sisältää alkuperäiset 10 A- ja 6 B-tapausta: pisteet/välit, pois jätetyn hiilihydraatin, lähdehavainnot, nykyiset ja uudet koodaukset, herkkyyskokeet sekä täsmällisten versioiden hashit. Kaikki 19 alkuperäistä laskentatapausta säilyvät samoina: 16 numeroa ja kolme A-pidätystä.

A-tulokset ovat keto-mutakakku 0,07; suklaakeksit 0,03; VHH-juustokakku 0,63; palak paneer 1,79; paneer tikka 3,07; kana-parmesaanipannu 1,06; kanasienipannu 0,74; VHH-pyttipannu 2,60; mansikkakakku 1,11; pho ga 24,96. Pieni laskentaluku ei osoita lähes olematonta mitattua vastetta: positiivinen A-poisjättö ja sen oletusherkkyys säilyvät näkyvissä.

B-tulokset ovat congee 31,09; halloumileipä 12,84–17,77; makaronilaatikko 16,91–17,76; kurpitsapuuro 35,42; laksa 27,55; kaya-paahtoleipä 18,37–23,31. Kaksi ensimmäistä perustuu nimettyihin valmistusanalogioihin; neljä muuta sisältää lisäksi rajattua kasvi-/pienainesosan GI 50-koodausta. Välit ovat ehdollisia lähdeskenaarioita, eivät fysiologisia virherajoja tai luottamusvälejä.

#183:n HEAD `54615726324d855bbfe0d72c3fc3ba58ceced9d4` sisältää erillisen `owner-approval.json`-kirjauksen alkuperäisen commitin `7127c001` täsmällisille 16 syötteelle. Hyväksyntä kattaa niiden menetelmän, versiot ja integraation, myös laksan 2 g curryjauhetarkennuksen. Se ei hyväksy tämän luovutuksen viittä lisäsyötettä eikä Readyä, mergeä tai deployta. Jäädytetyn matriisin `publicationAuthorized=false` pysyy oikeana. Muuttuneelle versiolle ei peritä alkuperäisen reseptin makropakettia.

## Viisi varmennettua lisäsyötettä

[source-extensions/cases.jsonl](source-extensions/cases.jsonl) sisältää viisi täsmällistä syötettä. Yhteiset havainnot ja lähdesidokset ovat erillisissä pienissä tiedostoissa. [source-first-candidates.csv](source-extensions/source-first-candidates.csv) antaa tulokset ja versiohashit.

| Resepti | Valittu reitti | GK/annos | Päätettävää ennen integraatiota |
| --- | --- | ---: | --- |
| Vietnamilainen kahvijogurtti banaanilla | A, nykyinen aritmetiikka | ≈ 10,92 | Fineli620:n makeuttamaton jogurtti3,9 %, kuorittu raaka tavallinen banaani125 g, kondensoitu makeutettu lehmänmaito30 g, täsmälliset lähdesidokset ja versio |
| Intialainen ven pongal | B, valmistusanalogiat | noin 44 | Kokonainen kuiva vihreä mung150 g, kuiva valkoinen riisi100 g, kaikki keitinliemi nautitaan; nimetyt puuro-/cashew-analogiat, pieni pippuriosuus, punnittu ghee ja sisältöversion korjaus |
| Dashimaki-riisilautanen | A, nykyiset poisjättörajat | ≈25,16 | Hondashi1,4 g lopullisessa200 ml liemessä, kuiva valkoinen jasmiiniriisi100 g tuoreena keitettynä; koko annosversio |
| Hojicha-jogurtti persimonilla | A, nykyiset poisjättörajat | ≈8,82 | Makeuttamaton jogurtti200 g, raaka kaki150 g, kokonaan nautittu jauhettu MUSO TLF013 -lehti2 g, seesami5 g |
| Rahka-marjakerroskulho | B, lajien välinen analogia | ≈2,41 | Kanadalaisen luonnonmustikan53 soveltaminen metsämustikkaan; jogurtti- ja hasselpähkinäsidokset, punnittu kuori ja makeuttajatuote |

Kahvijogurtin riippumaton Decimal-tulos on 10,918125. Kahvin 0,3 g saatavaa hiilihydraattia/annos jätetään pois muuttumattomilla A-rajoilla; sitä ei oleteta nollavaikutteiseksi. Finelin oma annospaino sitoo alkuperäisen banaanin kappalemäärän125 grammaan. [Atkinsonin ym. 2021 taulukon](https://nutritotal.com.br/pro/wp-content/uploads/sites/3/2021/09/Tabela1_IG.pdf) sivu63, kohta936 sisältää nimetyn makeutetun kondensoidun maidon GI 61-havainnon ja sivu73, kohta1088 raa'an banaanin GI 47-havainnon. Jogurtin30 on nykyisen projektikoodauksen erikseen katselmoitava sovellus. A-laskentareitin valinta välttää kahville uuden GI 50-sidoksen ja tarpeettoman B-riippuvuuden. Se vastaa #183:n jo lisäämää A-ehdotusta; kyseessä on yksi resepti.

Pongalin laskentaskenaariot ovat 43,49385–43,60835. Tämä ero tulee cashew-vertailuista22/27, **ei rajaa mungin tai riisin valmistuksen kokonaisepävarmuutta**. Siksi esitysehdotus on karkea noin44 ja selvä LOW-varaus, ei näennäisen tarkka virheväli. Keitetyn mungin GI 42-havainto on laadultaan heikko (n7, ei toistettua vertailuruokaa); pehmeä sekaruokapuuro on hyväksyttävä erillisenä analogiana. Pippurin olemassa oleva ehdotettu trace50-sovellus vaatii tämän version hyväksynnän. Raakapapujen koko lähdehiilihydraatti sisältyy laskentaan; alkuperäistä150 g määrää ei korvata keitetyn ruoan100 g pitoisuudella. Cashewpähkinöitä on nykyisen reseptin20 g. Yleinen lihantäyttöohjeen tekstijäänne pitää korjata hyväksyttävässä sisältöversiossa. Uutta merkittävän ruoka-aineen GI 50-oletusta ei lisätä.

Dashimakin dashi-ainesosan koko mahdollinen saatava hiilihydraatti rajataan jauheen massalla: [valmistajan7 g/litra -ohje](https://www.ajinomoto.co.th/en/our-product/food-service/hon-dashi/hondashi/) vastaa1,4 g jauhetta200 ml valmiissa liemessä. Koko1,4 g lasketaan ylärajaan, vaikka jauhe ei ole pelkkää hiilihydraattia. Tunnetun soijakastike- ja munahiilihydraatin kanssa A-poisjättö on 1,72 g/annos; jokainen osuus jää alle1 g ja summa alle2 g. Riisimäärä100 g säilyy; jasmiinilajike ja tuore lämmin tarjoilu on erikseen hyväksyttävä versiotarkennus. Nykyinen Venn2014:n68 toimii nimettynä lähdeanalogiana, ei kaikkien riisien GI:nä.

Hojichan [MUSO TLF013 -lehtierittely](https://muso-intl.com/wp-content/uploads/2022/01/TLF013-JAS-ORGANIC-HOJICHA-WEB.pdf) ilmoittaa EU-hiilihydraatin13,2 g/100 g. Se on saatavan hiilihydraatin lähdemallin yläraja, kun kokonaispolyoli on tuntematon. Kaikki alkuperäiset2 g lehteä nautitaan jauhettuna. Tee ja seesami tuottavat A-poisjättöön0,1545 g/annos. Jauheversion TLF041:n puuttuvaa100 g -otsikkoa ei oletettu: valittiin erillinen, nimenomaisen laskentaperustan ilmoittava lehtituote. Persimonille löytyi nimetty ihmishavainto61 (taulukko1/1163); lajike-/kypsyys- ja sekaruokaepävarmuus säilyvät.

Rahkakulhon kaikki positiiviset hiilihydraatit sisältyvät B-laskentaan; tarkka summa on 2,4100075. Kanadalaisen luonnonmustikan taulukko1/1092 GI 53 ei todista suomalaisen metsämustikan GI:tä. Tämä **uusi lajien välinen B-analogia on hyväksymätön**. Sitä ei yhdistetä vadelmaan eikä SEM7:stä tehdä vaihteluväliä. Hasselpähkinän50 on nykyisen alle 5 g/100 g -koodauksen erikseen katselmoitava nimetty sovellus (Fineli375:3,4 g/100 g), ei mitattu GI tai mantelijauhomalli. Täsmällisiä marja-/pähkinämääriä ei pienennetä.

[label-carbohydrate-upper.ts](label-carbohydrate-upper.ts) toteuttaa yhteisen eristetyn lähderajauksen. Se hyväksyy vain varmennetun EU-määritelmän ja nimenomaisen100 g -perustan. Tuntematon hiilihydraatti tai100 ml -lähde grammoille pysäyttää laskennan; eksplisiittinen nolla pysyy erillään tuntemattomasta. Yläraja ei oleta polyoleja nollaksi, hyväksy makroja tai väitä tuotteen tyypillistä etikettiarvoa mitatuksi biologiseksi maksimiksi.

## Yhteisten ratkaisujen mitattu tuotto

[priority77.csv](priority77.csv) käyttää aiempaa 39 mallinnus- ja 38 tuote-/valmistustapauksen yhteistä joukkoa. Kuusi alkuperäistä B-tapausta ja viisi lisäsyötettä kuuluvat tähän 77:ään: ratkaisemattomia jää **66** (30 mallinnus- ja 36 tuote-/valmistustapausta). Uutta rinnakkaista70 reseptin tutkimusta ei aloitettu.

[method-impact.csv](method-impact.csv) erottaa riippuvuudet, valmistellut numerot ja julkaistun lisäyksen. Rivejä ei saa tulkita automaattisiksi julkaisuluviksi.

| Yhteinen ratkaisu | Riippuvia reseptejä | Varmennettuja numeerisia ehdokkaita |
| --- | ---: | ---: |
| Nykyinen GK-only A alkuperäisessä erässä | 10 | 10 |
| Nimetyt B-valmistusanalogiat alkuperäisessä erässä | 2 | 2 |
| Analogiat ja rajattu uusi B-koodaus alkuperäisessä erässä | 4 | 4 |
| Palkokasvien valmistusryhmä | 3 | 1: pongal; hernekeitto ja bissara jäävät avoimiksi |
| Täsmälliset tuote-/määräversiot | 38 | 2: kahvijogurtti ja hojicha;36 muuta jää avoimeksi |
| Currytahnan yhteinen lähde/GI | 7 | 0; kookosmaidon plant50 yksin ei ratkaise tahnaa |
| Kahden marjaruoan laji/GI ja tuotteet | 2 | 1: rahkakulhon B-ehdotus; chiavanukas jää avoimeksi |
| Nykyiset A-ylärajat ja täsmällinen tuotevalmistus | 2 | 2: dashimaki ja hojicha |

Hojicha kuuluu sekä 38 tuotetapaukseen että kahden A-ylärajan menetelmään. Taulukon rivejä ei summata kattavuudeksi: `preparedRecipeIds`-joukkojen unioni on 21.

Säilötyn sitruunan tuotereitti tarkistettiin kerran: [valmistajasivu](https://belazu.com/shop-all/preserved-beldi-lemons/) ilmoittaa pitoisuuden100 ml:lle, mutta resepti käyttää yhden sitruunan kuorta. Grammamäärää, valutettua kuorta ja tuotteen tilavuutta ei rinnasteta ilman näyttöä. Lisäksi taginen ohje mainitsee määrättömän couscous-/leipälisäkkeen. Tuotteen löytyminen ei siis yksin tuota numeroa.

Currytahnan valmistajan punaisen tahnan erittelyssä on hiilihydraatti24,19 ja kuitu13,54 g/100 g; vuoden2025 USA-etiketti käyttää kokonais-hiilihydraattia ja pyöristettyjä10 g annoksia. Alueellista laskentaperustaa, eri vuosien tietoja ja polyolituntematonta ei yhdistetä automaattisesti saatavan hiilihydraatin pisteeksi. Tämä tutkimus ei hyväksy uutta tahnan GI:tä; todistettu lisätuotto on0. Lähteet ja määräriippuvuudet on tiivistetty [source-route-decisions.csv](source-route-decisions.csv)-tiedostoon.

Kokonaisen valmistetun ruoan GI-havaintoja arvioitiin vaihtoehtoiseksi yhteisratkaisuksi. Se edellyttäisi erillistä koko ryhmän hiilihydraattiosuutta, ei ruokalajin GI:n sijoittamista yhden raaka-aineen GI:ksi. Nykyisten idli/dosa-versioiden150 g sinapinsiementä ja puuttuva fermentointi eivät vastaa nimettyjä valmistettuja vertailuruokia. Niitä ei muuteta lusikalliseksi tai fermentoiduksi pelkän numerotavoitteen vuoksi. Tämän reitin todistettu lisätuotto on nyt0.

## AFCD ja rajatut tutkimusskenaariot

AFCD:n68 natiivitietuetta ja91 paikallista versiota liittyvät88 nykyiseen GK-puutteiseen reseptiin. Niistä90 paikallista arvoa vastaa natiivia without-kenttää; yksi vadelmakopio riippuu edelleen avoimesta [PR #182:sta](https://github.com/ozirix-dev/Reseptit/pull/182). Sen korjausta ei kopioitu tähän haaraan.

Kokonaispolyolin muuttaminen tuntemattomaksi muutti170 puuttuvan tapauksen raakalaskentaa0 kertaa. **Pelkkä polyolitulkinta avaa0 uutta numeroa.** Eristetty [gk-only-source.ts](gk-only-source.ts) käyttää natiivia saatavaa hiilihydraattia ja pitää kokonaispolyolin tuntemattomana. Proteiinia/rasvaa ei vaadita GK:lle eikä hyväksytä tämän perusteella. Määritelmiä ei tutkittu uudelleen. Lähdeaineistot: THL Fineli Rel20 (CC BY4.0) ja FSANZ AFCD Release3 (CC BY-SA3.0 Australia); natiivihavainnot sidotaan lähteeseen ja versioon.

Mantelijauhon neljä aiempaa GI 50-skenaariota säilyvät `assumption-research/`-hakemistossa tutkimuksena:0 kattavuuteen kelpuutettua numeroa. [Schakelin tekijäesityksen](https://pdfs.semanticscholar.org/eead/ef25b9a2d5c209deb31265082c85080758f4.pdf) vähähiilihydraattisen ruoan tietokantaoletus ei ole mantelijauhon GI-mittaus. Koostumushavainnot5,4/6,6 eivät rajaa GI:n tai paistamisen epävarmuutta. Tähän reittiin ei käytetty lisätutkimusaikaa.

## Seuraava pieni toteutuserä ja toistettavuus

**Seuraava todellinen kattavuushyppy on #183:n erillisten 16 version julkaiseminen:156 →172**, kun sille annetaan erillinen julkaisuvaltuus. Viiden lisäversion hyväksyntä ja myöhempi integraatio voisi nostaa luvun 177:ään. Uusia julkaisemis-/GI-oletuslupia ei päätellä jatkovalmisteluluvasta.

[next-decisions.csv](next-decisions.csv) rajaa seuraavat9 nykyisen joukon tutkimuskohdetta: currytahnat 7 ja kaksi jäljellä olevaa palkokasvivalmistusta. Ne ovat **9 kohdetta, eivät9 valmista numeroa**. Curryt tarvitsevat itsenäisen saatavan hiilihydraatin tiedon sekä perustellun tahnan GI-/ainesosamallin; kookosmaidon koodaus yksin avaa0. Palkokasveille tarvitaan kuivauksen/kuorinnan/soseutuksen sovitus ja koko reseptin jäljelle jäävät lähdesidokset. Vadelmavanukkaan ja taginen avoimet riippuvuudet säilyvät77:n taulukossa; niitä ei tutkita toistuvasti samoista lähteistä. Herkkyyskokeilla ei täytetä yhdeksän puuttuvan numeron vajetta. 30:n tavoite ja lopullinen80 % pysyvät kesken.

Tarkistukset: viiden lisäsyötteen natiivilähteet, resepti-/GI-/syötehashit ja riippumaton Decimal; kaikki alkuperäiset 19 tulosta ennallaan; yksilöinti estää kahvijogurtin kaksoislaskennan. Lisäksi label-adapteri hylkää väärän yksikön ja tuntemattoman arvon. Aiemmat90/1 AFCD-kopion ja170 polyolivastakokeen tarkistukset säilyvät. Ei uusia koko sivuston testejä, buildia tai manuaalisia Actions-ajoja.

Työkalut `capture-shared149.mts`, `evaluate-source-extensions.mts`, `finalize-priority.py` ja `verify_decimal.py` lukevat lähteitä ja käyttävät vain Gitin ulkopuolista tuloshakemistoa. Lisälaskenta: `evaluate-source-extensions.mts ROOT SHARED_SNAPSHOT SOURCE_EXTENSIONS EXTERNAL_OUT`. Decimal: `verify_decimal.py SHARED_SNAPSHOT ASSUMPTION_DATA ASSUMPTION_RESULTS SOURCE_EXTENSIONS EXTERNAL_OUT`. Finalisoinnin valinnaiset viimeiset argumentit ovat `SOURCE_EXTENSIONS EXTERNAL_OUT`. Snapshot sisältää yhdeksän alkuperäistä tiedostoa; [upstream-provenance.json](upstream-provenance.json) sitoo jäädytetyn laskennan ja nykyisen #183-integraation. Ei uusia päällekkäisiä PR:iä, aktiivisia resepti-/makromuutoksia, mergeä tai deployta.

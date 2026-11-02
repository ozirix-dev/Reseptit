# AFCD-POLYOL-03 / GK80-30: yhteisen erän luovutusaineisto

## Päätös ja todellinen kattavuus

Paras etenemisreitti on nykyisen GK-only-laskennan lähde-, määrä- ja valmistussidosten täydentäminen. Käytä A-aritmetiikkaa aina kun nykyiset ehdot täyttyvät; varaa B erikseen arvioitaville nimetyille analogioille. Yksi julkaisupolku on [Operaatio 149 V2, Draft PR #183](https://github.com/ozirix-dev/Reseptit/pull/183). Tämä haara toimittaa siihen konfliktittoman aineiston ja eristetyt laskentatyökalut.

**Yhteensä 18 uniikkia numeerista ehdokasta: 11 A + 7 B, C-luokkia 0.** Alkuperäiset 16 ovat #183:n menetelmä- ja sisältöhyväksytyssä integraatiossa; julkaisuvaltuutta ei ole. Kahvijogurtti on jo saman PR:n erillisessä A-ehdotuksessa. Tässä varmennettiin sen A-laskenta ja lisättiin uusi ven pongal -B-ehdotus. Kahvijogurttia tai vaihtoehtoista B-laskelmaa ei lasketa toista kertaa.

| Tila | Numeerinen kattavuus |
| --- | ---: |
| Main / tuotannon lähtötila | 156/326 = 47,85 % |
| #183:n 16 erillisen version myöhempi julkaisu | 172/326 = 52,76 % |
| Lisäksi kahvijogurtin ja pongalin hyväksyntä ja julkaisu | 174/326 = 53,37 % |
| Vähintään 30 uuden ehdokkaan tavoite | 186/326 = 57,06 % |
| Lopullinen vähintään 80 %:n tavoite | 261/326 = 80,06 % |

**30:n tavoitteesta puuttuu 12 perusteltua numeroa.** Tällä ajolla julkaistuja uusia arvoja on 0. Nykyisestä lähtötilasta tarvitaan 105 uutta julkaisua; kaikkien 18 ehdokkaan mahdollisen julkaisun jälkeen puuttuisi 87. Neljä aiempaa mantelijauhon GI50-tutkimusskenaariota eivät kuulu näihin lukuihin.

## Alkuperäisten 16:n viimeistely ja hyväksynnän raja

[16-decision-matrix.csv](16-decision-matrix.csv) sisältää alkuperäiset 10 A- ja 6 B-tapausta: pisteet/välit, pois jätetyn hiilihydraatin, lähdehavainnot, nykyiset ja uudet koodaukset, herkkyyskokeet sekä täsmällisten versioiden hashit. Kaikki 19 alkuperäistä laskentatapausta säilyvät samoina: 16 numeroa ja kolme A-pidätystä.

A-tulokset ovat keto-mutakakku 0,07; suklaakeksit 0,03; VHH-juustokakku 0,63; palak paneer 1,79; paneer tikka 3,07; kana-parmesaanipannu 1,06; kanasienipannu 0,74; VHH-pyttipannu 2,60; mansikkakakku 1,11; pho ga 24,96. Pieni laskentaluku ei osoita lähes olematonta mitattua vastetta: positiivinen A-poisjättö ja sen oletusherkkyys säilyvät näkyvissä.

B-tulokset ovat congee 31,09; halloumileipä 12,84–17,77; makaronilaatikko 16,91–17,76; kurpitsapuuro 35,42; laksa 27,55; kaya-paahtoleipä 18,37–23,31. Kaksi ensimmäistä perustuu nimettyihin valmistusanalogioihin; neljä muuta sisältää lisäksi rajattua kasvi-/pienainesosan GI50-koodausta. Välit ovat ehdollisia lähdeskenaarioita, eivät fysiologisia virherajoja tai luottamusvälejä.

#183:n HEAD `54615726324d855bbfe0d72c3fc3ba58ceced9d4` sisältää erillisen `owner-approval.json`-kirjauksen alkuperäisen commitin `7127c001` täsmällisille 16 syötteelle. Hyväksyntä kattaa niiden menetelmän, versiot ja integraation, myös laksan 2 g curryjauhetarkennuksen. Se ei hyväksy uusia kahvijogurtti-/pongal-syötteitä eikä Readyä, mergeä tai deployta. Jäädytetyn matriisin `publicationAuthorized=false` pysyy oikeana. Muuttuneelle versiolle ei peritä alkuperäisen reseptin makropakettia.

## Kaksi varmennettua lisäsyötettä

[source-extensions/cases.jsonl](source-extensions/cases.jsonl) sisältää vain kaksi täsmällistä syötettä. Yhteiset havainnot ja lähdesidokset ovat erillisissä pienissä tiedostoissa. [source-first-candidates.csv](source-extensions/source-first-candidates.csv) antaa tulokset ja versiohashit.

| Resepti | Valittu reitti | GK/annos | Päätettävää ennen integraatiota |
| --- | --- | ---: | --- |
| Vietnamilainen kahvijogurtti banaanilla | A, nykyinen aritmetiikka | ≈ 10,92 | Fineli620:n makeuttamaton jogurtti3,9 %, kuorittu raaka tavallinen banaani125 g, kondensoitu makeutettu lehmänmaito30 g, täsmälliset lähdesidokset ja versio |
| Intialainen ven pongal | B, valmistusanalogiat | noin 44 | Kokonainen kuiva vihreä mung150 g, kuiva valkoinen riisi100 g, kaikki keitinliemi nautitaan; nimetyt puuro-/cashew-analogiat, pieni pippuriosuus, punnittu ghee ja sisältöversion korjaus |

Kahvijogurtin riippumaton Decimal-tulos on 10,918125. Kahvin 0,3 g saatavaa hiilihydraattia/annos jätetään pois muuttumattomilla A-rajoilla; sitä ei oleteta nollavaikutteiseksi. Finelin oma annospaino sitoo alkuperäisen banaanin kappalemäärän125 grammaan. [Atkinsonin ym. 2021 taulukon](https://nutritotal.com.br/pro/wp-content/uploads/sites/3/2021/09/Tabela1_IG.pdf) sivu63, kohta936 sisältää nimetyn makeutetun kondensoidun maidon GI61-havainnon ja sivu73, kohta1088 raa'an banaanin GI47-havainnon. Jogurtin30 on nykyisen projektikoodauksen erikseen katselmoitava sovellus. A-laskentareitin valinta välttää kahville uuden GI50-sidoksen ja tarpeettoman B-riippuvuuden. Se vastaa #183:n jo lisäämää A-ehdotusta; kyseessä on yksi resepti.

Pongalin laskentaskenaariot ovat 43,49385–43,60835. Tämä ero tulee cashew-vertailuista22/27, **ei rajaa mungin tai riisin valmistuksen kokonaisepävarmuutta**. Siksi esitysehdotus on karkea noin44 ja selvä LOW-varaus, ei näennäisen tarkka virheväli. Keitetyn mungin GI42-havainto on laadultaan heikko (n7, ei toistettua vertailuruokaa); pehmeä sekaruokapuuro on hyväksyttävä erillisenä analogiana. Pippurin olemassa oleva ehdotettu trace50-sovellus vaatii tämän version hyväksynnän. Raakapapujen koko lähdehiilihydraatti sisältyy laskentaan; alkuperäistä150 g määrää ei korvata keitetyn ruoan100 g pitoisuudella. Cashewpähkinöitä on nykyisen reseptin20 g. Yleinen lihantäyttöohjeen tekstijäänne pitää korjata hyväksyttävässä sisältöversiossa. Uutta merkittävän ruoka-aineen GI50-oletusta ei lisätä.

## Yhteisten ratkaisujen mitattu tuotto

[priority77.csv](priority77.csv) käyttää aiempaa 39 mallinnus- ja 38 tuote-/valmistustapauksen yhteistä joukkoa. Kuusi alkuperäistä B-tapausta ja kaksi lisäsyötettä ovat jo tässä77:ssä: ratkaisemattomia jää **69**. Uutta rinnakkaista70 reseptin tutkimusta ei aloitettu.

[method-impact.csv](method-impact.csv) erottaa riippuvuudet, valmistellut numerot ja julkaistun lisäyksen. Rivejä ei saa tulkita automaattisiksi julkaisuluviksi.

| Yhteinen ratkaisu | Riippuvia reseptejä | Varmennettuja numeerisia ehdokkaita |
| --- | ---: | ---: |
| Nykyinen GK-only A alkuperäisessä erässä | 10 | 10 |
| Nimetyt B-valmistusanalogiat alkuperäisessä erässä | 2 | 2 |
| Analogiat ja rajattu uusi B-koodaus alkuperäisessä erässä | 4 | 4 |
| Palkokasvien valmistusryhmä | 3 | 1: pongal; hernekeitto ja bissara jäävät avoimiksi |
| Täsmälliset tuote-/määräversiot | 38 | 1: kahvijogurtti; 37 muuta eivät avaudu tällä ratkaisulla |
| Currytahnan yhteinen lähde/GI | 7 | 0; kookosmaidon plant50 yksin ei ratkaise tahnaa |
| Kahden marjaruoan laji/GI ja tuotteet | 2 | 0 |

Säilötyn sitruunan tuotereitti tarkistettiin kerran: [valmistajasivu](https://belazu.com/shop-all/preserved-beldi-lemons/) ilmoittaa pitoisuuden100 ml:lle, mutta resepti käyttää yhden sitruunan kuorta. Grammamäärää, valutettua kuorta ja tuotteen tilavuutta ei rinnasteta ilman näyttöä. Lisäksi taginen ohje mainitsee määrättömän couscous-/leipälisäkkeen. Tuotteen löytyminen ei siis yksin tuota numeroa.

Kokonaisen valmistetun ruoan GI-havaintoja arvioitiin vaihtoehtoiseksi yhteisratkaisuksi. Se edellyttäisi erillistä koko ryhmän hiilihydraattiosuutta, ei ruokalajin GI:n sijoittamista yhden raaka-aineen GI:ksi. Nykyisten idli/dosa-versioiden150 g sinapinsiementä ja puuttuva fermentointi eivät vastaa nimettyjä valmistettuja vertailuruokia. Niitä ei muuteta lusikalliseksi tai fermentoiduksi pelkän numerotavoitteen vuoksi. Tämän reitin todistettu lisätuotto on nyt0.

## AFCD ja rajatut tutkimusskenaariot

AFCD:n68 natiivitietuetta ja91 paikallista versiota liittyvät88 nykyiseen GK-puutteiseen reseptiin. Niistä90 paikallista arvoa vastaa natiivia without-kenttää; yksi vadelmakopio riippuu edelleen avoimesta [PR #182:sta](https://github.com/ozirix-dev/Reseptit/pull/182). Sen korjausta ei kopioitu tähän haaraan.

Kokonaispolyolin muuttaminen tuntemattomaksi muutti170 puuttuvan tapauksen raakalaskentaa0 kertaa. **Pelkkä polyolitulkinta avaa0 uutta numeroa.** Eristetty [gk-only-source.ts](gk-only-source.ts) käyttää natiivia saatavaa hiilihydraattia ja pitää kokonaispolyolin tuntemattomana. Proteiinia/rasvaa ei vaadita GK:lle eikä hyväksytä tämän perusteella. Määritelmiä ei tutkittu uudelleen. Lähdeaineistot: THL Fineli Rel20 (CC BY4.0) ja FSANZ AFCD Release3 (CC BY-SA3.0 Australia); natiivihavainnot sidotaan lähteeseen ja versioon.

Mantelijauhon neljä aiempaa GI50-skenaariota säilyvät `assumption-research/`-hakemistossa tutkimuksena:0 kattavuuteen kelpuutettua numeroa. [Schakelin tekijäesityksen](https://pdfs.semanticscholar.org/eead/ef25b9a2d5c209deb31265082c85080758f4.pdf) vähähiilihydraattisen ruoan tietokantaoletus ei ole mantelijauhon GI-mittaus. Koostumushavainnot5,4/6,6 eivät rajaa GI:n tai paistamisen epävarmuutta. Tähän reittiin ei käytetty lisätutkimusaikaa.

## Seuraava pieni toteutuserä ja toistettavuus

**Seuraava todellinen kattavuushyppy on #183:n erillisten16 version julkaiseminen:156 →172**, kun sille annetaan erillinen julkaisuvaltuus. Kahden lisäversion hyväksyntä ja myöhempi integraatio voisi nostaa luvun174:ään. Uusia julkaisemis-/GI-oletuslupia ei päätellä jatkovalmisteluluvasta.

[next-decisions.csv](next-decisions.csv) rajaa seuraavat12 nykyisen joukon tutkimuskohdetta: currytahnat7, kaksi marjaruokaa, kaksi jäljellä olevaa palkokasvivalmistusta ja tagine1. Ne ovat **12 kohdetta, eivät12 valmista numeroa**. Kunkin ryhmän tarvittavat yhteiset päätökset ja todistettu lisätuotto0 erotetaan. Tahnoille tarvitaan itsenäinen saatavan hiilihydraatin tieto sekä perusteltu GI-/ainesosamalli; marjoille lajikohtainen analogia ja tarkat juoma-/makeuttajatuotteet; palkokasveille kuivauksen/kuorinnan/soseutuksen sovitus; taginelle tuotteen laskentaperusta, kuorimäärä ja lisäkeversio. Näitä ei korvata GI0–150-herkkyyskokeilla. 30:n tavoite ja lopullinen80 % pysyvät kesken.

Tarkistukset: kahden lisäsyötteen natiivilähteet, resepti-/GI-/syötehashit ja riippumaton Decimal; kaikki alkuperäiset19 tulosta ennallaan; yksilöinti estää kahvijogurtin kaksoislaskennan. Aiemmat90/1 AFCD-kopion ja170 polyolivastakokeen tarkistukset säilyvät. Ei uusia koko sivuston testejä, buildia tai manuaalisia Actions-ajoja.

Työkalut `capture-shared149.mts`, `evaluate-source-extensions.mts`, `finalize-priority.py` ja `verify_decimal.py` lukevat lähteitä ja käyttävät vain Gitin ulkopuolista tuloshakemistoa. Lisälaskenta: `evaluate-source-extensions.mts ROOT SHARED_SNAPSHOT SOURCE_EXTENSIONS EXTERNAL_OUT`. Decimal: `verify_decimal.py SHARED_SNAPSHOT ASSUMPTION_DATA ASSUMPTION_RESULTS SOURCE_EXTENSIONS EXTERNAL_OUT`. Finalisoinnin valinnaiset viimeiset argumentit ovat `SOURCE_EXTENSIONS EXTERNAL_OUT`. Snapshot sisältää yhdeksän alkuperäistä tiedostoa; [upstream-provenance.json](upstream-provenance.json) sitoo jäädytetyn laskennan ja nykyisen #183-integraation. Ei uusia päällekkäisiä PR:iä, aktiivisia resepti-/makromuutoksia, mergeä tai deployta.

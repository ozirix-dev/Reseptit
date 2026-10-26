# GI/GK-kattavuuserä 2B3: lähdekatselmus ja tulokset

## Lähtötilanne ja rajaus

Tarkastelu alkoi eristetyssä worktreessä 26.10.2026 Reseptit-repon main-commitista `95b87e3eb8b41dbef0913b8532fd8af67a5e56d6`. Lähtöinventaario lukittiin ennen sisältömuutoksia: 325 reseptiä, 118 laskettua GK-arviota, 207 keskeneräistä ja 38 GI-tietuetta. Ravintoarvoauditoinnissa oli 180 näyttöön perustuvaa arviota, 86 puutteellista, 59 puuttuvaa ja 0 ristiriitaa. Täydet snapshotit ovat tämän erän baseline- ja current-JSON/Markdown-tiedostoissa.

Tutkimus rajattiin neljään lähdeperheeseen: kypsä/säilyketomaatti, maissitärkkelys, mantelijauho/-rouhe sekä filotaikina. Lähdeperheiden valmistustapa- ja tuotevastaavuus tarkistettiin ennen reseptikohtaista valintaa. Kun suoraa käyttökelpoista osumaa ei löytynyt, arvioitiin enintään kahdeksan muuta GK-esteistä reseptiä. GL-kaavaa, reseptimääriä tai GI-katalogin tietueita ei muutettu.

## Neljän lähdeperheen tulos

| Lähdeperhe | Lähdehavainto | Päätös |
| --- | --- | --- |
| Kypsä/säilyketomaatti | Katalogin raaka kokonaistomaatti (GI 22, Strong) ei vastaa murskattua tai kypsennettyä tomaattia. Katalogin säilyketomaattimehu (GI 38, Supplementary; julkaisematon Sydney GI Search -mittaus, n=10) on juoma, ei tomaattimurska. Vanha raw tomato → cooked sauce -analogia ei vastaa valmistusta eikä sitä käytetä. Vuoden 2021 taulukoiden tomaattikastiketta sisältävät merkinnät ovat valmisruokia, eivät tomaatin ainesosa-GI-mittauksia. | Ei uutta GI-sidontaa. Fineli-tomaattisoseen tietue on koostumustieto, ei GI-lähde. Tomaattireseptit jäävät estetyiksi. |
| Maissitärkkelys | Vuoden 2021 taulukoissa mainittu raaka vahamainen maissitärkkelys (0,5 % amyloosia, GI 50, n=10, suspendoituna veteen) ei vastaa tavallista kypsennettyä maissitärkkelystä. Lang ym. raportoivat pienessä testissä (GI-ryhmä n=6) 45 °C:n 11-prosenttisessa vesiliuoksessa testatulle tärkkelykselle GI 95 ± 18; se ei ole baozi-täytteen tai muun reseptivalmistuksen osuma. | Ei uutta GI-sidontaa. Baozin ja muiden tärkkelysreseptien GI-estettä ei poisteta analogialla. |
| Mantelijauho/-rouhe | GI-taulukoiden pähkinäkeskiarvo ei osoita jauhetun mantelin tuotetta tai valmistustapaa. Mori ym. tutkivat kokonaisten manteleiden, mantelivoin ja rasvattoman mantelijauhon vaikutusta seka-ateriassa, eivät yksittäisen mantelijauhon GI-arvoa. | Ei uutta GI-sidontaa. Mantelijauhoa ei rinnasteta kokonaisiin manteleihin tai yleiseen leivonnaiskeskiarvoon. |
| Filotaikina | Sydneyn yliopiston GI-kysymyssivu toteaa, ettei leivonnaistaikinaa ole testattu sellaisenaan. Puff- tai murotaikina eivät vastaa filotaikinaa. Spanakopitan filotaikinan osuus on noin 14,88 g käytettävissä olevaa hiilihydraattia annosta kohti. | Ei uutta GI-sidontaa eikä toleranssipoikkeusta; spanakopita jää estetyksi. |

## Kahdeksan vaihtoehtoisen reseptin katselmus

Näissä tapauksissa GI-estettä aiheuttanut ainesosa oli annosta kohti alle 1 g käytettävissä olevaa hiilihydraattia. Arvio perustuu kunkin reseptisyötteen nykyiseen koostumustietueeseen ja määrään. Määrät säilytettiin ennallaan; pieni osuus jätettiin GK-laskennasta dokumentoidun toimituksellisen toleranssin perusteella. Aiemmat pois jätetyt osuudet laskettiin mukaan kokonaisrajaan. Kokonaismäärä jäi jokaisessa tapauksessa alle 2 g/annos.

| recipeId | Resepti | Pois jätetty osuus (g/annos) | Aiemmat pois jätetyt (g/annos) | Yhteensä (g/annos) | Uusi GK/annos | GK-luokka | Luottamus |
| --- | ---: | ---: | ---: | ---: | --- |
| malesialainen-congee-inkivaarilla | Malesialainen congee inkiväärillä | 0,048 | 0,855 | 0,903 | 26,65 | Korkea | LOW |
| kiinalainen-riisipuuro-kananmunalla | Kiinalainen riisipuuro kananmunalla | 0,048 | 0,165 | 0,213 | 26,65 | Korkea | LOW |
| thai-porsasjok | Thai-porsasjok | 0,048 | 0,165 | 0,213 | 26,47 | Korkea | LOW |
| lahi-ita-kikhernejauho-yrttilettu | Lähi-idän kikhernejauho-yrttilettu | 0,033 | 0,337 | 0,370 | 7,42 | Matala | LOW |
| kai-jiew-vhh | Kai jiew VHH | 0,006 | 0,415 | 0,421 | 0,46 | Matala | LOW |
| hyderabadi-kanabiryani | Hyderabadi-kanabiryani | 0,025 | 1,054 | 1,079 | 37,98 | Korkea | LOW |
| yrttituorejuusto-kinkkurullat | Yrttituorejuusto-kinkkurullat | 0,098 | 0,486 | 0,584 | 0,81 | Matala | LOW |
| keto-mutakakku | Keto-mutakakku | 0,906 | 0,313 | 1,220 | 0,23 | Matala | LOW |

Keto-mutakakun pois jätetty osuus koostuu suklaasta (0,769 g) ja kaakaojauheesta (0,138 g); yksittäiset osuudet ovat alle 1 g ja yhteenlaskettu kokonaismäärä jää 2 gramman rajan alle. Pyöristyksistä johtuen taulukon kolmen desimaalin yhteissumma voi poiketa täydestä snapshotista viimeisellä desimaalilla.

Kaikki kahdeksan arviota ovat uusia laskettavia tuloksia, joiden luottamus on matala pienten pois jätettyjen osuuksien vuoksi. Ne eivät ole mitattuja ateria- tai yksilövasteita. Kahdeksalla reseptillä ei ollut lähtötilanteessa numeerista GK-arvoa, joten **aiemmin julkaistuja numeerisia GK-arvoja, joiden korjaus muuttaisi reseptin tulkintaa tai ruokavalintavertailua, muuttui 0**. Uusien arvioiden numeerinen luokkajakauma on **4 korkea, 4 matala ja 0 keskitaso**. GK-luokka kuvaa lukuarvoa; LOW on erillinen luottamustaso kaikille kahdeksalle.

## Hyderabadi-kanabiryani: riippumaton lähde- ja massatarkistus

Reseptikortti ilmoittaa neljä annosta: 600 g luutonta reisilihaa, 300 g basmatiriisiä ennen liotusta/keittoa, 200 g maustamatonta jogurttia, kaksi sipulia, 2 rkl öljyä ja 2 rkl gheetä tai voita sekä mausteet, korianteri ja minttu. GK-syötteen päämassat vastaavat reseptiä. Riisille käytetään nyt samaa AFCD Release 3:n kypsentämätöntä valkoista riisiä (74 g käytettävissä olevaa hiilihydraattia/100 g), jota ravintoarvolaskelma käyttää. Jogurtti on Fineli 620, Bulgarian-tyyppinen maustamaton 3,9 % (3,4 g/100 g), ja kana Fineli 30792, raaka nahaton koipi-reisi (0 g hiilihydraattia). Kypsän riisin painoa ei sovelleta: 300 g on reseptin kuiva lähtöpaino.

GK:n sipulimassa on 110 g eli 2 × Fineli KPL_M 55 g. Ravintoarvolaskelman erillisessä lähdetiedostossa on ristiriitainen 100 g/kpl muunnos (200 g yhteensä), joten 2B2:ssa havaittu massaepäjohdonmukaisuus oli osittain aiheellinen. GK-syötteen sipulimassa on silti jäljitettävissä dokumentoituun kotitalousmittaan eikä jää epäselväksi. GI-vastaavuudet ovat sipulille GI 15 -analogia, riisille kategoria-arvo GI 67 ja jogurtille maitotuotekategorian GI 35; nämä eivät ole tämän reseptin suoria mittauksia ja varmuus on LOW. Korianterin GI-este poistettiin vain sen 0,025 g/annos osuuden toimituksellisen toleranssin vuoksi.

2B2:n yleinen ilmaus useista puutteista ei vastaa nykyistä GK-syötettä: reseptin ainesosat, annokset ja merkittävät massat on määritelty, mutta ravintoarvolähteen sipulimuunnos on aidosti ristiriitainen ja aiempi GK käytti riisille/jogurtille huonommin osuvia lähteitä. GK-syötteen riisi ja jogurtti korjattiin lähdevastaaviksi. Arvio muuttui **40,77:stä 37,98 GK/annos**, edelleen korkea GK / LOW confidence. Ravintoarvolaskelman sipulimuunnoksen korjaus jää erilliseksi ravintoarvotyöksi eikä sitä tässä GK-erässä muutettu.

## Pienten GK-arvojen herkkyys

Skenaariossa kaikki tunnetut pois jätetyt hiilihydraatit lisätään laskennallisesti GI-oletuksella 20, 50, 80 tai 100. Oletukset ovat herkkyysrajoja, eivät ehdotettuja tai julkaistavia GI-arvoja.

| Resepti | Nykyinen GK | Pois jätetty g/annos | GK-lisäys GI 20 / 50 / 80 / 100 | Skenaarion GK | Näyttö, 1 merkitsevä numero | Suhteellinen lisäys |
| --- | ---: | ---: | ---: | --- | --- | ---: |
| Keto-mutakakku | 0,23 | 1,219625 | 0,244 / 0,610 / 0,976 / 1,220 | 0,474 / 0,840 / 1,206 / 1,450 | 0,5 / 0,8 / 1 / 1 | +106 / 265 / 424 / 530 % |
| Kai jiew VHH | 0,46 | 0,421312 | 0,084 / 0,211 / 0,337 / 0,421 | 0,544 / 0,671 / 0,797 / 0,881 | 0,5 / 0,7 / 0,8 / 0,9 | +18 / 46 / 73 / 92 % |
| Yrttituorejuusto-kinkkurullat | 0,81 | 0,583875 | 0,117 / 0,292 / 0,467 / 0,584 | 0,927 / 1,102 / 1,277 / 1,394 | 0,9 / 1 / 1 / 1 | +14 / 36 / 57 / 72 % |

Kaikki skenaariot jäävät matalaan GK-luokkaan. Absoluuttinen lisäys on enintään 1,22 GK-yksikköä; suhteellinen muutos on pienen lähtöarvon vuoksi suuri. Nykyisellä yhden merkitsevän numeron näytöllä kakku muuttuisi 0,2:sta arvoon 0,5–1, kai jiew 0,5:stä arvoon 0,5–0,9 ja kinkkurullat 0,8:sta arvoon 0,9–1. LOW confidence ja menetelmän rajoitusteksti säilyvät. Esitystavan erillinen kehitysehdotus on kertoa pienten lukujen yhteydessä, että pieni GK ei ole tarkka mittaus ja pienet pois jätetyt osuudet voivat muuttaa lukua suhteellisesti paljon. Uutta näyttöpolitiikkaa ei otettu käyttöön.

## Tulos ja rajat

- GK-laskettavia reseptejä: 118 → 126 (+8); keskeneräisiä: 207 → 199 (-8); 325 reseptin joukko säilyi samana.
- GI-katalogi säilyi 38 tietueessa; Strong/Supplementary-jakauma ja GI-arvot eivät muuttuneet.
- Kahdeksan reseptin ainesosamäärät ja annokset säilyivät. Hyderabadi-biryanin riisi-, jogurtti- ja kanakoostumuskytkentöjä tarkennettiin ravintoarvolähteiden mukaisiksi; resepti-, syöte- ja lähdefingerprintit päivitettiin.
- <1 g/ainesosa ja <2 g kumulatiivisesti ovat toimituksellinen tapa käsitellä pieniä osuuksia, eivät kliininen tarkkuusraja. Tuntematonta hiilihydraattia tai olennaista osuutta ei asetettu nollaksi.
- Suurimmat jäljelle jäävät lähde-esteryhmät ovat GI_MATCH (tomaattien kypsennys-/tuotevastaavuus korostuu), GI_MISSING, koostumus, massa/valmistustila ja lähdetiedon puute. Tarkat päällekkäisyydet näkyvät nykyinventaarion JSONissa.

## Lähteet

- Atkinson ym., *International tables of glycemic index and glycemic load values 2021*, [American Journal of Clinical Nutrition](https://ajcn.nutrition.org/article/S0002-9165%2822%2900494-4/fulltext), [PubMed](https://pubmed.ncbi.nlm.nih.gov/34258626/).
- Lang ym., *The effect of a high amylose starch on glucose and insulin responses*, [PubMed](https://pubmed.ncbi.nlm.nih.gov/10357737/), DOI 10.1093/ajcn/69.6.1183.
- Mori ym., *Effect of almond consumption on metabolic risk factors—glucose and insulin responses*, [Nutrition & Metabolism / PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC3042001/).
- University of Sydney GI, [Feedback—Your FAQs Answered](https://glycemicindex.com/2006/06/feedback-your-faqs-answered-17/).
- Koostumus, reseptimäärät, GK-syötteet ja tulokset: tämän erän lähderepon JSON-auditit sekä [nykyinventaario](glycemic-coverage-batch-2b3-current.md).

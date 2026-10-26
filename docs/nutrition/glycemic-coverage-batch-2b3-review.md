# GI/GK-kattavuuserä 2B3: lähdekatselmus ja tulokset

## Lähtötilanne ja rajaus

Tarkastelu alkoi eristetyssä worktreessä 26.10.2026 Reseptit-repon main-commitista `95b87e3eb8b41dbef0913b8532fd8af67a5e56d6`. Lähtöinventaario lukittiin ennen sisältömuutoksia: 325 reseptiä, 118 laskettua GK-arviota, 207 keskeneräistä ja 38 GI-tietuetta. Ravintoarvoauditoinnissa oli 180 näyttöön perustuvaa arviota, 86 puutteellista, 59 puuttuvaa ja 0 ristiriitaa. Täydet snapshotit ovat tämän erän baseline- ja current-JSON/Markdown-tiedostoissa.

Tutkimus rajattiin neljään lähdeperheeseen: kypsä/säilyketomaatti, maissitärkkelys, mantelijauho/-rouhe sekä filotaikina. Lähdeperheiden valmistustapa- ja tuotevastaavuus tarkistettiin ennen reseptikohtaista valintaa. Kun suoraa käyttökelpoista osumaa ei löytynyt, arvioitiin enintään kahdeksan muuta GK-esteistä reseptiä. GL-kaavaa, reseptimääriä tai GI-katalogin tietueita ei muutettu.

## Neljän lähdeperheen tulos

| Lähdeperhe | Lähdehavainto | Päätös |
| --- | --- | --- |
| Kypsä/säilyketomaatti | Kansainvälisten GI-taulukoiden raaka kokonaistomaatti (GI 22) ei vastaa murskattua tai kypsennettyä tomaattia. Taulukoiden tomaattikastiketta sisältävät merkinnät ovat valmisruokia, eivät tomaatin ainesosa-GI-mittauksia. | Ei uutta GI-sidontaa. Fineli-tomaattisoseen tietue on koostumustieto, ei GI-lähde. Tomaattireseptit jäävät estetyiksi. |
| Maissitärkkelys | Vuoden 2021 taulukoissa mainittu raa'an, vahamaisen maissitärkkelyksen testi vedessä ei vastaa tavallista kypsennettyä maissitärkkelystä. Lang ym. raportoivat erillisessä pienessä tutkimuksessa 45 °C:n vesiliuoksessa testatulle tärkkelykselle GI 95 ± 18; se ei ole baozi-täytteen tai muun reseptivalmistuksen osuma. | Ei uutta GI-sidontaa. Baozin ja muiden tärkkelysreseptien GI-estettä ei poisteta analogialla. |
| Mantelijauho/-rouhe | GI-taulukoiden pähkinäkeskiarvo ei osoita jauhetun mantelin tuotetta tai valmistustapaa. Mori ym. tutkivat kokonaisten manteleiden, mantelivoin ja rasvattoman mantelijauhon vaikutusta seka-ateriassa, eivät yksittäisen mantelijauhon GI-arvoa. | Ei uutta GI-sidontaa. Mantelijauhoa ei rinnasteta kokonaisiin manteleihin tai yleiseen leivonnaiskeskiarvoon. |
| Filotaikina | Sydneyn yliopiston GI-kysymyssivu toteaa, ettei leivonnaistaikinaa ole testattu sellaisenaan. Puff- tai murotaikina eivät vastaa filotaikinaa. Spanakopitan filotaikinan osuus on noin 14,88 g käytettävissä olevaa hiilihydraattia annosta kohti. | Ei uutta GI-sidontaa eikä toleranssipoikkeusta; spanakopita jää estetyksi. |

## Kahdeksan vaihtoehtoisen reseptin katselmus

Näissä tapauksissa GI-estettä aiheuttanut ainesosa oli annosta kohti alle 1 g käytettävissä olevaa hiilihydraattia. Arvio perustuu kunkin reseptisyötteen nykyiseen koostumustietueeseen ja määrään. Määrät säilytettiin ennallaan; pieni osuus jätettiin GK-laskennasta dokumentoidun toimituksellisen toleranssin perusteella. Aiemmat pois jätetyt osuudet laskettiin mukaan kokonaisrajaan. Kokonaismäärä jäi jokaisessa tapauksessa alle 2 g/annos.

| Resepti | Pois jätetty osuus (g/annos) | Aiemmat pois jätetyt (g/annos) | Yhteensä (g/annos) | Uusi GK/annos | GK-luokka |
| --- | ---: | ---: | ---: | ---: | --- |
| malesialainen congee inkiväärillä | 0,048 | 0,855 | 0,903 | 26,65 | Korkea |
| kiinalainen riisipuuro kananmunalla | 0,048 | 0,165 | 0,213 | 26,65 | Korkea |
| thai-porsasjok | 0,048 | 0,165 | 0,213 | 26,47 | Korkea |
| Lähi-idän kikhernejauho-yrttilettu | 0,033 | 0,337 | 0,370 | 7,42 | Matala |
| kai jiew vhh | 0,006 | 0,415 | 0,421 | 0,46 | Matala |
| hyderabadi-kanabiryani | 0,025 | 1,054 | 1,079 | 40,77 | Korkea |
| yrttituorejuusto-kinkkurullat | 0,098 | 0,486 | 0,584 | 0,81 | Matala |
| keto-mutakakku | 0,906 | 0,313 | 1,220 | 0,23 | Matala |

Keto-mutakakun pois jätetty osuus koostuu suklaasta (0,769 g) ja kaakaojauheesta (0,138 g); yksittäiset osuudet ovat alle 1 g ja yhteenlaskettu kokonaismäärä jää 2 gramman rajan alle. Pyöristyksistä johtuen taulukon kolmen desimaalin yhteissumma voi poiketa täydestä snapshotista viimeisellä desimaalilla.

Kaikki kahdeksan arviota ovat uusia laskettavia tuloksia, joiden luottamus on matala pienten pois jätettyjen osuuksien vuoksi. Ne eivät ole mitattuja ateria- tai yksilövasteita. Kahdeksalla reseptillä ei ollut lähtötilanteessa numeerista GK-arvoa, joten **aiemmin julkaistuja numeerisia GK-arvoja, joiden korjaus muuttaisi reseptin tulkintaa tai ruokavalintavertailua, muuttui 0**. Kahdeksan uutta arviota tuli saataville: kolme korkeaan ja viisi matalaan luokkaan. Tämä luokitus on niiden ensimmäinen tulos, ei aiemman lukuarvon muutos.

## Tulos ja rajat

- GK-laskettavia reseptejä: 118 → 126 (+8); keskeneräisiä: 207 → 199 (-8); 325 reseptin joukko säilyi samana.
- GI-katalogi säilyi 38 tietueessa; Strong/Supplementary-jakauma ja GI-arvot eivät muuttuneet.
- Kaikkien kahdeksan reseptin reseptimäärät, annosmäärät ja koostumuskytkennät säilyivät. Muutettiin vain GK-syötteen GI-poissulku ja toimituksellisen pienen osuuden perustelu; katselmusten sidontafingerprintit päivitettiin.
- <1 g/ainesosa ja <2 g kumulatiivisesti ovat toimituksellinen tapa käsitellä pieniä osuuksia, eivät kliininen tarkkuusraja. Tuntematonta hiilihydraattia tai olennaista osuutta ei asetettu nollaksi.
- Suurimmat jäljelle jäävät lähde-esteryhmät ovat GI_MATCH (tomaattien kypsennys-/tuotevastaavuus korostuu), GI_MISSING, koostumus, massa/valmistustila ja lähdetiedon puute. Tarkat päällekkäisyydet näkyvät nykyinventaarion JSONissa.

## Lähteet

- Atkinson ym., *International tables of glycemic index and glycemic load values 2021*, [American Journal of Clinical Nutrition](https://ajcn.nutrition.org/article/S0002-9165%2822%2900494-4/fulltext), [PubMed](https://pubmed.ncbi.nlm.nih.gov/34258626/).
- Lang ym., *The effect of a high amylose starch on glucose and insulin responses*, [PubMed](https://pubmed.ncbi.nlm.nih.gov/10357737/), DOI 10.1093/ajcn/69.6.1183.
- Mori ym., *Effect of almond consumption on metabolic risk factors—glucose and insulin responses*, [Nutrition & Metabolism / PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC3042001/).
- University of Sydney GI, [Feedback—Your FAQs Answered](https://glycemicindex.com/2006/06/feedback-your-faqs-answered-17/).
- Koostumus, reseptimäärät, GK-syötteet ja tulokset: tämän erän lähderepon JSON-auditit sekä [nykyinventaario](glycemic-coverage-batch-2b3-current.md).

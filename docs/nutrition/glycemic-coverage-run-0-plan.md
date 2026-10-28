# GI/GK-kattavuuskampanja — AJO 0, 28.10.2026

## Päätös ja rajaus

**AJO 0 COMPLETE – READY FOR COVERAGE BATCH 2B6E**

AJO 0 tuottaa työjonon ja seuraavan erän suunnitelman. AJO 1:tä ei ole aloitettu. Reseptit, GI-katalogi, laskentasyötteet, kaava, rajat, fingerprintit ja historialliset baselinet säilyvät muuttumattomina. Julkaistujen uusien GK-arvojen nettolisäys on **0**.

Tämä valmius koskee suunnittelua, ei uusien lähteiden tai GK-arvojen hyväksyntää. Nykyisissä sidoksissa löytyneet semanttiset laatuongelmat alla on erotettava kattavuuserästä; yhden jo lasketun reseptin kookosmaitosidos tarvitsee erillisen kiireellisen katselmoinnin.

## Varmennettu lähtötilanne

- GitHub main ja analyysipohja: `cd9a6f4f740b31dc8b52c6c09cc1574cb7a89950`.
- Tuotanto: [Recipe site / Pages 40587729118](https://github.com/ozirix-dev/Reseptit/actions/runs/40587729118), success. [GK-sivu](https://ozirix-dev.github.io/Reseptit/glykeeminen-kuorma/) palautti HTTP 200 ja näkyvät luvut 326 / 138 / 188.
- Tuore content:sync, strict-ravintoauditointi ja GK-ajo: 326 / 138 / 188; kattavuus 42,33 %. GI 45: 6 STRONG, 39 SUPPLEMENTARY.
- Ravintoauditointi koko kokoelmassa: 180 ESTIMATE WITH EVIDENCE, 86 INSUFFICIENT SOURCE DATA, 60 MISSING, 0 CONFLICT. Keskeneräisissä GK-resepteissä vastaavasti 94 / 40 / 54.
- Yleisen ja 2B6D-inventaarion kaikki 326 tilaa, arvoa, estoviestiä ja kolme fingerprinttiä vastaavat tuoretta ajoa. Historiallisen 2B6D-baselinen 136 laskettua arvoa säilyvät.
- **38 voimassa olevaa rakennesidonnan estoa**, 0 syöte- ja 0 lähdesidonnan poikkeamaa. Aiemman raportin 0/0/0 koski uusia muutoksia baselineen nähden, ei kaikkien estojen puuttumista.
- Avoimet PR:t alussa: #100 Nutritics, #116 Vite, #118 GK-vaihteluväli-/skenaariosuunnitelma, #119 GK-suodattimet. #118 säilyy erillisenä; vaihteluvälejä ei toteuteta. Muita työpuita ei muutettu eikä poistettu.
- `docs/nutrition/README.md`: vanhat 261/325- ja 190/325-luvut ovat historiallista tekstiä, eivät nykytilan mittareita.

## Luokittelumenetelmä

Inventaario sisältää jokaisen keskeneräisen reseptin kaikki ainesrivit, nykyiset lähde-ID:t, hiilihydraatit/annos, massat ja lähdemuistiot, hyväksytyt/missing/epävarmat GI-sidokset, ravintolaskelman täsmänimiosumat, nykyisen reseptin määrät, estoviestit, variantit, pienosuudet ja fingerprintit. `accepted-by-current-model` tarkoittaa nykyisen ohjelman hyväksyntää; se ei ole tämän ajon uusi tieteellinen hyväksyntä. Tuntematon määrä säilyy nullina.

Disjunkti ensisijainen työlinja valitaan järjestyksessä: H (ratkaisematon vaihtoehto), G (koostumus+GI eri perheissä tai vähintään kolme estävää perhettä), F (voimassa oleva sidontaesto), D (koostumus), E (massa), A (vain lähteistetyn alle 1 g:n väärän sidoksen poistoehdokas, kokonaissumma alle 2 g eikä havaittua semanttista estoa), B (nimetty olemassa oleva katalogiehdokas), C (jäljellä oleva GI-/valmistus-/toleranssiongelma). Kaikki sivuestot säilyvät.

Luokitus on toistettava työnsuunnittelun heuristiikka. Tekstihakujen PREPARATION-lippu tarkoittaa valmistuksen tarkistuskohtaa, ei 144 todistettua valmistusvirhettä. Työyksikköjen määrä perustuu estäviin ainesperheisiin sekä sidonta-/toleranssiportteihin; se ei ole työtuntiarvio. Ravintoauditoinnin puuttuva status ei yksin muodosta GK-estoa, eikä tuettu status todista kaikkia GI-analogia- tai tuotemuoto-oletuksia.

| Luokka | Ensisijainen työlinja | Reseptejä |
| --- | --- | ---: |
| A | Lähes laskentavalmis | 1 |
| B | Olemassa olevan GI-lähteen katselmointi | 3 |
| C | Uusi soveltuva GI-lähde | 65 |
| D | Ravinto-/koostumustieto | 30 |
| E | Massa, annos tai valmistus | 4 |
| F | Rakenne tai syöteversio | 11 |
| G | Useita riippumattomia vaikeita esteitä | 38 |
| H | Toimituksellinen päätös | 36 |
| Yhteensä | | 188 |

Lähes valmiita **1**, olemassa olevan GI:n ehdokkaita **3**, ensisijaisesti uuden GI-lähteen tarpeessa **65**. Koostumus- tai massakorjaus ensisijaisena D+E: **34**. Kaikki päällekkäiset koostumus-/massaliput huomioiden **114** reseptiä tarvitsee tämän tarkistuksen. GI-tarkistuslipun saa 124 reseptiä; tämä ei tarkoita yhtä montaa uuden GI-mittauksen tarvetta.

Päällekkäiset koneelliset liput: COMPOSITION 102, EDITORIAL 36, FINGERPRINT 38, GI 124, MASS 38, PREPARATION 144, TOLERANCE 6.

## Kymmenen suurinta yhteistä esteperhettä

Perheet ovat hakuryhmiä, eivät keskenään vaihdettavia GI-ruokia. Tomaattiperhe sisältää myös salsat; kookosmaitoperhe myös kookosjuoman. Valmistus ja tarkka nimi säilyvät jokaisessa ainesrivissä. Esiintyminen kattaa nykyisen reseptin tai GK-syötteen; ristiriitainen vanha syöte voi sisältää eri nimikkeen. Tuntemattomia hiilihydraatteja ei sisällytetä vaihteluväliin eikä lasketa nollaksi.

| Perhe | Esiintyy | Estää | Ainoa estävä perhe¹ | Muut portit valmiit² | Muilla paikallinen korjauspolku³ | Tunnettu HH g/annos |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| liemi | 47 | 42 | 6 | 5 | 9 | 0.000–7.500 |
| kookosmaito | 34 | 29 | 8 | 8 | 11 | 0.703–4.800 |
| tomaatti | 38 | 23 | 19 | 17 | 19 | 0.360–4.375 |
| pähkinä/siemen | 54 | 19 | 3 | 2 | 3 | 0.000–9.400 |
| yrtit | 49 | 16 | 0 | 0 | 0 | 0.008–0.450 |
| sipuli | 94 | 13 | 0 | 1 | 0 | 0.076–2.640 |
| soijakastike | 29 | 12 | 2 | 3 | 2 | 0.356–4.305 |
| maitotuote | 60 | 11 | 3 | 2 | 3 | 0.000–7.200 |
| limetti | 24 | 9 | 0 | 1 | 0 | 0.033–0.950 |
| maissi/tärkkelys | 15 | 9 | 5 | 3 | 6 | 0.502–41.925 |

¹ Sama perhe voi sisältää useita koostumus-/määräongelmia. ² Konservatiivinen teoreettinen enimmäismäärä, jos kyseisen perheen kaikki täsmälliset lähdeongelmat ratkeavat; sisältää myös perheen GI:llä mahdollisesti alittuvan kumulatiivisen toleranssin. ³ Muut aineskohtaiset estot ovat korkeintaan tunnettuja alle 1 g:n virheellisiä sidoksia, joiden poistoehdotus pitää summan alle 2 g:n. Tämä on katselmointipolku, ei jo hyväksytty korjaus. Sarakkeet ² ja ³ käyttävät eri ehtoja eivätkä ole summattavia.

Täydet reseptijoukot, jokaisen perheen tuntemattomat osuudet, tunnetut annosmäärät, päällekkäisyydet ja lähteen saatavuus ovat [JSON-inventaariossa](glycemic-coverage-run-0-inventory.json).

## Viisi parasta yhteistä lähdetyötä

| Järjestys | Kohde | Työ ja näyttö | Ehdollinen enimmäisavaus |
| ---: | --- | --- | ---: |
| 1 | maitotuote | Kerman nykyinen kategoriatietue: aloita kaalilaatikosta. Smetana jää erilliseen lähde-/ruokaperhekatselmointiin; regexin laajennus ei ole tämän erän ratkaisu. Pieni–keskisuuri työ, epävarmuus kohtalainen. | 2 |
| 2 | pähkinä/siemen | Mantelin GI granolassa voisi alittaa yhteistoleranssin. Paahdetut lastut ja leivottu mantelijauho eivät ole sama valmistus: Runebergintorttujen siirto on erityisen epävarma. Keskisuuri työ, korkea lähderiski. | 2 |
| 3 | tomaatti | Murska, kypsä tomaatti, salsa ja pyree erikseen. Aloita caponatasta, pastasta ja harirasta, joissa ravintolaskelma on tuettu. Raakatomaatin GI ei kelpaa kypsän ratkaisuksi. Suuri lähdetyö, korkea epävarmuus. | 17 |
| 4 | kookosmaito | Täsmällinen tuote, määrä ja kuumennus. Riisipuuro-GI hylätään yksittäisen kookosmaidon näyttönä. Seitsemän yhden perheen tapausta ja yksi toleranssitapaus; suuri työ ja korkea epävarmuus. | 8 |
| 5 | liemi | Ensimmäinen hyöty voi tulla lähteistetystä pienosuudesta jauhelihapihveissä. Suuremmat osuudet tarvitsevat tuotekohtaisen koostumuksen ja kelvollisen GI:n; keittojen keskiarvo ei kelpaa automaattisesti. Keskisuuri–suuri työ, korkea epävarmuus. | 5 |

Näiden viiden ehdokasjoukon unioni on **34 reseptiä**, ei julkaisuennuste. Inventaarion `incrementalCeilingInThisOrder` poistaa päällekkäisyydet. Perheiden kaikki muodot eivät ratkea yhdellä lähteellä; todellinen avaus voi olla nolla. Lähteiden saatavuutta ei väitetä osoitetuksi uudella kirjallisuustutkimuksella tässä ajossa.

## 20 ensisijaista reseptiehdokasta

Järjestys yhdistää toistettavan pisteytyksen ja dokumentoidun reseptikatselmoinnin. Piste = näytön saatavuus (1–3) / (työ (1–6) × riski (1–4) × riippumattomien työyksiköiden arvio). Arvot ovat järjestysasteikkoja, eivät tilastollisia todennäköisyyksiä. Jokaisen reseptin potentiaalinen nettolisäys on enintään +1; yhteisen katalogin muutos laajentaa regressiotarkistuksen kaikkiin käyttäjiin.

| # | Resepti-ID | Luokka | Piste | Seuraava tarkistus |
| ---: | --- | --- | ---: | --- |
| 1 | `jauhelihapihvit-vhh-kermakastikkeella` | A | 3.0 | Lihaliemi 0,750 g/annos; väärän GI-sidoksen poiston jälkeen poisjättö 1,18705 g/annos. Varmista liemen koostumus ja kaikki nykyiset määrät; ravintoauditointi ei yksin todista syötettä. |
| 2 | `vhh-kaalilaatikko` | B | 0.5 | Kerma: dairy-category vs unflavoured-dairy; kypsennetyn kerman analogia ja koko syöte tarkistettava. |
| 3 | `som-tam-vhh-kurkkuna` | B | 0.5 | Keitetyt pavut: vegetables/cooked vs vegetable/vegetable-category; olemassa olevan kategorian sallittu käyttö tarkistettava. |
| 4 | `siemengranola-jogurtilla` | B | 0.5 | 40 g paahdettuja mantelilastuja: 0,660 g/annos; hyväksytty GI vähentäisi poisjätön 2,06375 -> 1,40375. Paahdon lähdevastaavuutta ei vielä hyväksytty. |
| 5 | `valimerellinen-halloumi-tomaattileipa` | D | 0.3333 | Leivän koostumus on nykyisessä ravintolaskelmassa Fineli 31842 -maalaisleipäproxy. Tarkista hapanjuurileivän vastaavuus ja leipä-GI; älä siirrä proxya automaattisesti. |
| 6 | `jerk-kana` | F | 0.1111 | Neljä kevätsipulia: ravintolaskelman määrä ja Fineli-mitta verrattava reseptiin; lisäksi rakennesidonnan tarkistus. |
| 7 | `hunaja-sinappikana-kaalilla` | F | 0.1111 | Valkosipulijauheeseen on liitetty tuoreen valkosipulin tietue/mittapyyntö. Tarkista jauheen koostumus ja tl-massa sekä reseptin rakennesidonta. |
| 8 | `caponata` | C | 0.0833 | tomaatti. Hanki oikeaan ruokaan ja valmistukseen soveltuva GI-lähde; säilytä null, jos näyttö puuttuu. |
| 9 | `pasta-alla-norma` | C | 0.0833 | tomaatti. Hanki oikeaan ruokaan ja valmistukseen soveltuva GI-lähde; säilytä null, jos näyttö puuttuu. |
| 10 | `harira` | C | 0.0833 | tomaatti. Hanki oikeaan ruokaan ja valmistukseen soveltuva GI-lähde; säilytä null, jos näyttö puuttuu. |
| 11 | `kanapyorykat-tomaattikastike` | C | 0.0833 | tomaatti. Hanki oikeaan ruokaan ja valmistukseen soveltuva GI-lähde; säilytä null, jos näyttö puuttuu. |
| 12 | `karibia-kookosriisi-pavuilla` | C | 0.0833 | kookosmaito. Hanki oikeaan ruokaan ja valmistukseen soveltuva GI-lähde; säilytä null, jos näyttö puuttuu. |
| 13 | `vietnamilainen-banh-xeo-aamiaisletut` | C | 0.0833 | kookosmaito. Hanki oikeaan ruokaan ja valmistukseen soveltuva GI-lähde; säilytä null, jos näyttö puuttuu. |
| 14 | `indonesialainen-nasi-uduk-aamiaisella` | C | 0.0833 | kookosmaito. Hanki oikeaan ruokaan ja valmistukseen soveltuva GI-lähde; säilytä null, jos näyttö puuttuu. |
| 15 | `thai-roti-munalla-banaanilla` | C | 0.0833 | kookosmaito. Hanki oikeaan ruokaan ja valmistukseen soveltuva GI-lähde; säilytä null, jos näyttö puuttuu. |
| 16 | `paella-valenciana` | C | 0.0833 | Ainoa nykyinen GI-esto on kanaliemi 1,0675 g/annos, ei tomaatti. Raja ei salli pyöristämistä alle 1 g:n. |
| 17 | `pohjoisafrikkalainen-lablabi` | C | 0.0833 | liemi. Hanki oikeaan ruokaan ja valmistukseen soveltuva GI-lähde; säilytä null, jos näyttö puuttuu. |
| 18 | `kana-enchilada-kukkakaalivuoka` | C | 0.0833 | tomaatti. Hanki oikeaan ruokaan ja valmistukseen soveltuva GI-lähde; säilytä null, jos näyttö puuttuu. |
| 19 | `vhh-raparperipiirakka` | C | 0.0833 | Raparperi 1,71875 g/annos tarvitsee lähteen paistettuun muotoon; hedelmäryhmä ei sellaisenaan kelpaa. |
| 20 | `baozi` | C | 0.0833 | Maissitärkkelys 1,632 g/annos tarvitsee valmistukseen soveltuvan GI:n; perunan GI ei käy. |

A/B-ehdokkaiden valmistuminen yhden pienen PR:n aikana arvioidaan kohtalaiseksi; C–F-ehdokkaiden matalaksi ja G/H-ehdokkaiden erittäin matalaksi. Nämä ovat suunnitteluarvioita ilman empiiristä prosenttilupausta. Tuetun ravintolaskelman ja yhden selkeän lähdepuutteen reseptit nostettiin listalle ennen monen ongelman reseptejä.

## Ensimmäinen toteutuserä: 2B6E

Viiden reseptin rajattu katselmointi:

1. `jauhelihapihvit-vhh-kermakastikkeella` — Lihaliemi 0,750 g/annos; väärän GI-sidoksen poiston jälkeen poisjättö 1,18705 g/annos. Varmista liemen koostumus ja kaikki nykyiset määrät; ravintoauditointi ei yksin todista syötettä.
2. `vhh-kaalilaatikko` — Kerma: dairy-category vs unflavoured-dairy; kypsennetyn kerman analogia ja koko syöte tarkistettava.
3. `som-tam-vhh-kurkkuna` — Keitetyt pavut: vegetables/cooked vs vegetable/vegetable-category; olemassa olevan kategorian sallittu käyttö tarkistettava.
4. `siemengranola-jogurtilla` — 40 g paahdettuja mantelilastuja: 0,660 g/annos; hyväksytty GI vähentäisi poisjätön 2,06375 -> 1,40375. Paahdon lähdevastaavuutta ei vielä hyväksytty.
5. `valimerellinen-halloumi-tomaattileipa` — Leivän koostumus on nykyisessä ravintolaskelmassa Fineli 31842 -maalaisleipäproxy. Tarkista hapanjuurileivän vastaavuus ja leipä-GI; älä siirrä proxya automaattisesti.

**Realistinen suunnitteluarvio: +1–3; varma lisäys 0; ehdollinen enimmäismäärä +5.** Yhtäkään uutta arvoa ei hyväksytty tässä ajossa. Jos koko lähde- ja määräketju ei kestä katselmointia, tulos voi olla nolla. Mallin kaavaa tai validointiehtoja ei muuteta.

Ensimmäisen reseptin nykyinen liemiosuus on 0,750 g/annos. Nykyisen virheellisen GI-sidoksen poistamista kokeiltiin vain muistissa: laskentamalli päätyi alle 2 g:n kokonaispoisjättöön 1,18705 g/annos. Sidoksen poisto edellyttää silti lähdekohtaisen hiilihydraattimäärän varmentamista. Näitä mallikokeita ei kirjoitettu reseptisyötteisiin eikä julkaistu GK-lukuina.

Kaalilaatikon `dairy-category` on eri kuin katalogin `unflavoured-dairy`; som tamin pavuissa `vegetables/cooked` eroaa katalogin `vegetable/vegetable-category`-avaimista. Avainten korjaaminen ei saa peittää lähde-/valmistusvastaavuuden puutetta. Granolan mantelien uunipaahto 160 °C / 18–22 min on nimenomainen lähdeportti. Halloumileivän hapanjuurileipä käyttää ravintosyötteessä maalaisleipäproxya; sitä ei kopioida GK:hon ilman vastaavuuden tarkistusta.

AJO 1: tarkista ensin kaikkien viiden reseptin aines- ja valmistusketju, valitse vain kelvolliset korjaukset, lukitse nykyisten 138 lasketun arvon regressiovertailu, aja käyttäjän kampanjan mukaiset laskentaerän tarkistukset, avaa yksi Draft-PR ja varmista CI täsmälleen julkaistavalla HEADilla. Ei mergeä. Ei automaattista AJO 2:ta.

## Laatuportit ja syyt lykätä muita reseptejä

- `khao-soi-vhh-konjac`: liemisidoksen poisto näyttäisi mallissa onnistuvan (poisjättö 1,983 g), mutta kookosmaidon 2,81 g/annos on sidottu riisipuuron GI 31:een. Ei lähes valmis. Sama tietue on käytössä keskeneräisissä massamanissa ja tom khassa sekä jo lasketussa `keltainen-kanacurry-vhh`-reseptissä. Viimeinen tarvitsee erillisen laatukatselmoinnin; mahdollinen −1 on raportoitava erillään uusista avauksista. AJO 0 ei muuta sen arvoa.
- `intialainen-aloo-paratha`: ravintolaskelman `fineli-310-release-20` on nimeltään MAA-ARTISOKKA, vaikka aines ja vastaavuusmuistio kuvaavat perunaa. Nykyinen ravintoauditin tuettu luokka ei ole riittävä takuu. Korjaa koostumus erillisessä laskentatyössä ennen GK-ehdotusta.
- `valimerellinen-tortilla-espanola-aamupalaksi`: sipulin avainpoikkeaman lisäksi vesikeitetyn perunan lähde on tarkistettava öljyssä kypsennettyä tortillaa vasten. Ei pelkkä avainkorjaus.
- Vanha kahdeksan tomaattireseptin lista ei ole kahdeksan avausta: tabboulehin estot ovat bulgur ja yrtit, paellan kanaliemi, bouillabaissen sinisimpukat ja fenkoli. Gulassissa ja ropa viejassa on myös liemi; gulassissa lisäksi toleranssi. Farinatan tomaatti paistetaan uunissa, vaikka ravintotietueen lähtömuoto on raaka.
- 38 sidontaestoa ei korjata vaihtamalla hashia. Jokaisessa on myös nykyisestä syötteestä tulevia esteitä; yksi täsmällinen massakorjauskin vaatii koko reseptin vertailun.
- H-luokan vesi/maito/liemivaihtoehdot, tuotteet ja määrät tarvitsevat toimituksellisen ratkaisun. G-luokan usean esteen reseptejä ei priorisoida yhden yleisen ainesosalähteen perusteella.
- Keitetty taateli, vesikeitetty öljytön mannapuuro, rapea tostada ja paistettu suklaa pysyvät ilman sopivaa lähdettä estettyinä. Reseptin sisältöä ei vaihdeta laskennan avaamiseksi.
- Semanttinen tarkistus on rajattu havaittuihin selviin ristiriitoihin, ei kaikkien 138 aiemman arvon täydellinen lähdeauditti. AJO 7:n neljä mannasuurimoreseptiä säilyvät erillisen katselmoinnin työjonossa.

Vanhentuneet esteet: 2B6D:n baselineen verrattuna taatelipuuro-tahinin nestevaihtoehto, tahinisidos ja vanha rakenne-esto ovat poistuneet, mutta keitetyn taatelin GI-esto jää. Appelsiinimannapuuron aiemmat taateli/neste/rakenne-estot ovat korvautuneet vesikeitetyn mannan täsmällisellä NO MATCH -estolla. Ajantasaiset estolistat säilyvät; vanhoja selitteitä ei lasketa uudelleen nykyisiksi.

## Jäljitettävyys, uudelleenajo ja tarkistukset

- [Kampanjan alkuperäinen toimeksianto](glycemic-coverage-campaign-master-plan.md) säilyttää AJO 0–10:n rajat ja STOP-ehdot.
- [Koneellinen inventaario](glycemic-coverage-run-0-inventory.json): 188 uniikkia keskeneräistä ID:tä, A–H summa 188; lähdetiedostojen SHA-256:t ja reseptien fingerprintit.
- [Analyysityökalu](tools/glycemic-coverage-run-0-analyze.py) lukee tuoreet auditoinnit ja kirjoittaa vain erilliseen scratch-hakemistoon. Nykyinventaarioiden erimielisyys, baseline-arvon muutos tai reseptijoukon ero keskeyttää ajon.
- [Pienosuuksien mallikoe](tools/glycemic-coverage-run-0-probe.mts) muuttaa vain muistissa kloonattuja syötteitä ja tallentaa estot/poisjättösummat scratchiin. Ei uusia GI-arvoja eikä kokonais-GK-ennusteita.
- Paikallinen `content:sync`, `audit:nutrition -- --strict`, `audit:glycemic-load` ja `test:glycemic`: PASS (64/64). Kokonainen sivustobuild ja selaintestit eivät ole tämän suunnitteludiffin paikallisia vaatimuksia; GitHubin riskivalitsin ratkaisee CI:n lisätarkistukset.
- Markdown-lint ja diff-tarkistus sekä Draft-PR:n CI varmennetaan toimituksen yhteydessä. Lopullinen HEAD ja CI-linkki ovat PR:n Checks-näkymässä ja tämän ajon loppuraportissa. ReportHubia ei muuteta.

Uudelleenajo oikean checkoutin `site/`-hakemistosta (tarkista repo_guard ja buildin kirjoituskohteet ensin):

```powershell
npm run content:sync
npm run audit:nutrition -- --strict
npm run audit:glycemic-load
python ../docs/nutrition/tools/glycemic-coverage-run-0-analyze.py .. D:/Temp/reseptit-run0-replay
node --import tsx ../docs/nutrition/tools/glycemic-coverage-run-0-probe.mts .. D:/Temp/reseptit-run0-replay/probe.json
npm run test:glycemic
```

Valmiit JSON/Markdown-tulokset tuodaan repoon vain repo_guard `write` -operaatiolla ja olemassa olevan tiedoston nykyisellä SHA-256:lla. Älä aja tavallista `audit:glycemic-coverage`-komentoa suoraan suunnitteludiffiin: se kirjoittaa seurattuja nykyraportteja. Tässä ajossa sen sijasta verrattiin kaikki tuoreet tulosrivit, estot ja fingerprintit kumpaankin nykyinventaarioon muuttamatta niitä. Jos main muuttuu, analyysi ja valittu työjoukko on varmennettava uudelleen.

**Pysähdy tähän. AJO 1 edellyttää seuraavaa toimeksiantoa.**

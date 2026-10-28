# AJO 0–0.6: GI/GK-kattavuuskampanjan suunnitteluhistoria

Ajantasainen suunnittelu on tämän dokumentin **AJO 0.6** -osuudessa. Alla oleva alkuperäinen AJO 0 on historiallinen: sen 326/138/188-luvut ja silloiset riskit eivät kuvaa uutta tuotantoa.

## AJO 0 – alkuperäinen analyysi

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

## AJO 0.5 – lähdelaadun korjaus

[PR #124](https://github.com/ozirix-dev/Reseptit/pull/124) yhdistettiin ja julkaistiin. Keltaisen kanacurryn aiempi GK 3,48 poistettiin, koska riisi-kookosmaitopuuron GI 31 ei tue yksittäistä kookosmaitoa. Neljä virheellistä sidontaa poistettiin; kolme muuta reseptiä olivat jo keskeneräisiä. Katalogin tutkimus säilyy REFERENCE_ONLY-viitteenä. [Tarkka lähdekorjausnäyttö](glycemic-coconut-source-review.md) ja sen koneluettava raportti ovat poikkeuksen peruste.

## AJO 0.6 – ajantasaistettu suunnittelu

Tuotannon lähtöcommit `f7a43503c8dde25c6c2281885807c3e7ed31f07e`. Analyysin checkout-commit `49f85d9b155ec98fcaa99fbf37e2138a6c436503` ja työkalujen/syötteiden SHA-256:t on lukittu koneelliseen inventaarioon. [Pages-CI 40640331867](https://github.com/ozirix-dev/Reseptit/actions/runs/40640331867): build ja deploy SUCCESS. [Julkinen GK-sivu](https://ozirix-dev.github.io/Reseptit/glykeeminen-kuorma/).
Tuore auditointi: **326 reseptiä / 137 laskettua / 189 keskeneräistä**, kattavuus 42.0 %. GI 45: 6 STRONG / 39 SUPPLEMENTARY; yksi REFERENCE_ONLY, jota ei hyväksytä laskentalähteeksi eikä lähde-ehdokkaaksi. Julkaistujen arvojen nettomuutos tässä suunnitteluerässä **0**.

### Uusi luokitus ja koko työjono

Kaikki nykyiset keskeneräiset reseptit on analysoitu uudelleen tuoreista GK- ja ravintoauditeista. Tunnisteiden uniikkius, täydellinen reseptijoukko sekä molempien nykyinventaarioiden tilat, arvot, estoviestit, ravintoluokat ja kolme fingerprintiä tarkistetaan.

| Luokka | Ensisijainen työlinja | Alkuperäinen AJO 0 | AJO 0.6 |
| --- | --- | ---: | ---: |
| A | Lähes laskentavalmis | 1 | 1 |
| B | Olemassa olevan GI-lähteen katselmointi | 3 | 3 |
| C | Uusi soveltuva GI-lähde | 65 | 66 |
| D | Ravinto-/koostumustieto | 30 | 30 |
| E | Massa, annos tai valmistus | 4 | 4 |
| F | Rakenne tai syöteversio | 11 | 11 |
| G | Useita riippumattomia esteitä | 38 | 38 |
| H | Toimituksellinen päätös | 36 | 36 |
| Yhteensä | | 188 | 189 |

Päällekkäiset liput: COMPOSITION 102, EDITORIAL 36, FINGERPRINT 38, GI 125, MASS 38, PREPARATION 144, TOLERANCE 6. Liput ovat tarkistusluokkia, eivät todisteita samanmääräisistä tieteellisistä virheistä. Ensisijaiset A–H-luokat ovat erilliset; sivuestot säilyvät.
Työjonoon lisättiin `keltainen-kanacurry-vhh`; mitään aiempaa keskeneräistä ei poistunut. Vanhojen ensisijaisten luokkien muutokset: 0. Alkuperäisen 20 listaan nähden keltainen curry tulee sijalle 12 ja baozi siirtyy listan ulkopuolelle mutta säilyy täydellisessä työjonossa. Tämä on jäljitettävän lähdetarkistuksen priorisointi, ei oletus kookosmaito-GI:n löytymisestä.

### Yhteisten esteperheiden todellinen ehdollinen potentiaali

Yhden perheen ratkaisu ei riitä, jos reseptillä on muita portteja. Alla ainoan perheen, muiden porttien ja paikallisen tarkistuspolun määrät ovat eri ehtoja eikä niitä summata. Myös saman perheen tuotteet ja valmistustavat vaativat eri lähteitä. **Varmennettu uusi nettotuotto on jokaisessa perheessä 0**; ehdollinen katto ei ole julkaisuennuste.

| Perhe | Estää reseptejä | Ainoa estävä perhe | Muut portit valmiit / ehdollinen katto | Muilla paikallinen tarkistuspolku |
| --- | ---: | ---: | ---: | ---: |
| liemi | 42 | 6 | 5 | 9 |
| kookosmaito | 30 | 9 | 9 | 12 |
| tomaatti | 23 | 19 | 17 | 19 |
| pähkinä/siemen | 19 | 3 | 2 | 3 |
| yrtit | 16 | 0 | 0 | 0 |
| sipuli | 13 | 0 | 1 | 0 |
| soijakastike | 12 | 2 | 3 | 2 |
| maitotuote | 11 | 3 | 2 | 3 |
| limetti | 9 | 0 | 1 | 0 |
| maissi/tärkkelys | 9 | 5 | 3 | 6 |

Kookosmaito: esiintyy 35 keskeneräisessä (ennen 34), estää 30 (ennen 29), ehdollinen avauskatto 9 (ennen 8). Kolmen vanhan reseptin semanttinen riski on nyt todellinen puuttuvan GI:n esto; uusi curry lisää yhden reseptin. Tiheys-/tuote-/määrä-/varianttiongelmat eivät katoa GI-lähteen löytymisellä.

### Päivitetty 20 reseptin prioriteettijono

Pisteytyksen kaava ja A–H-luokittelun säännöt ovat alkuperäisessä menetelmäkuvauksessa. Järjestys sisältää dokumentoidun toimituksellisen valinnan. Ensimmäinen kymmenikkö säilyi, koska sen lähdepolut ja estot eivät muuttuneet ja uusilta ehdokkailta puuttuu parempi varmistettu lähdepolku.

| # | Resepti | Luokka | Piste | Seuraava portti |
| ---: | --- | --- | ---: | --- |
| 1 | `jauhelihapihvit-vhh-kermakastikkeella` | A | 3.0 | Lihaliemi 0,750 g/annos; väärän GI-sidoksen poiston jälkeen poisjättö 1,18705 g/annos. Varmista liemen koostumus ja kaikki nykyiset määrät; ravintoauditointi ei yksin todista syötettä. |
| 2 | `vhh-kaalilaatikko` | B | 0.5 | Kerma: dairy-category vs unflavoured-dairy; kypsennetyn kerman analogia ja koko syöte tarkistettava. |
| 3 | `som-tam-vhh-kurkkuna` | B | 0.5 | Keitetyt pavut: vegetables/cooked vs vegetable/vegetable-category; olemassa olevan kategorian sallittu käyttö tarkistettava. |
| 4 | `siemengranola-jogurtilla` | B | 0.5 | 40 g paahdettuja mantelilastuja: 0,660 g/annos; hyväksytty GI vähentäisi poisjätön 2,06375 -> 1,40375. Paahdon lähdevastaavuutta ei vielä hyväksytty. |
| 5 | `valimerellinen-halloumi-tomaattileipa` | D | 0.3333 | Leivän koostumus on nykyisessä ravintolaskelmassa Fineli 31842 -maalaisleipäproxy. Tarkista hapanjuurileivän vastaavuus ja leipä-GI; älä siirrä proxya automaattisesti. |
| 6 | `jerk-kana` | F | 0.1111 | Neljä kevätsipulia: ravintolaskelman määrä ja Fineli-mitta verrattava reseptiin; lisäksi rakennesidonnan tarkistus. |
| 7 | `hunaja-sinappikana-kaalilla` | F | 0.1111 | Valkosipulijauheeseen on liitetty tuoreen valkosipulin tietue/mittapyyntö. Tarkista jauheen koostumus ja tl-massa sekä reseptin rakennesidonta. |
| 8 | `caponata` | C | 0.0833 | Hanki oikeaan ruokaan ja valmistukseen soveltuva GI-lähde; säilytä null, jos näyttö puuttuu. |
| 9 | `pasta-alla-norma` | C | 0.0833 | Hanki oikeaan ruokaan ja valmistukseen soveltuva GI-lähde; säilytä null, jos näyttö puuttuu. |
| 10 | `harira` | C | 0.0833 | Hanki oikeaan ruokaan ja valmistukseen soveltuva GI-lähde; säilytä null, jos näyttö puuttuu. |
| 11 | `kanapyorykat-tomaattikastike` | C | 0.0833 | Hanki oikeaan ruokaan ja valmistukseen soveltuva GI-lähde; säilytä null, jos näyttö puuttuu. |
| 12 | `keltainen-kanacurry-vhh` | C | 0.0833 | PR #124 palautti nulliksi: 2,81 g/annos kookosmaitoa tarvitsee oman soveltuvan GI-lähteen. Ainoa mallin esto, mutta REFERENCE_ONLY-riisipuurolähde ei käy. Koko ainesketju ja valmistus tarkistettava ennen mitään palautusta. |
| 13 | `karibia-kookosriisi-pavuilla` | C | 0.0833 | Hanki oikeaan ruokaan ja valmistukseen soveltuva GI-lähde; säilytä null, jos näyttö puuttuu. |
| 14 | `vietnamilainen-banh-xeo-aamiaisletut` | C | 0.0833 | Hanki oikeaan ruokaan ja valmistukseen soveltuva GI-lähde; säilytä null, jos näyttö puuttuu. |
| 15 | `indonesialainen-nasi-uduk-aamiaisella` | C | 0.0833 | Hanki oikeaan ruokaan ja valmistukseen soveltuva GI-lähde; säilytä null, jos näyttö puuttuu. |
| 16 | `thai-roti-munalla-banaanilla` | C | 0.0833 | Hanki oikeaan ruokaan ja valmistukseen soveltuva GI-lähde; säilytä null, jos näyttö puuttuu. |
| 17 | `paella-valenciana` | C | 0.0833 | Ainoa nykyinen GI-esto on kanaliemi 1,0675 g/annos, ei tomaatti. Raja ei salli pyöristämistä alle 1 g:n. |
| 18 | `pohjoisafrikkalainen-lablabi` | C | 0.0833 | Hanki oikeaan ruokaan ja valmistukseen soveltuva GI-lähde; säilytä null, jos näyttö puuttuu. |
| 19 | `kana-enchilada-kukkakaalivuoka` | C | 0.0833 | Hanki oikeaan ruokaan ja valmistukseen soveltuva GI-lähde; säilytä null, jos näyttö puuttuu. |
| 20 | `vhh-raparperipiirakka` | C | 0.0833 | Raparperi 1,71875 g/annos tarvitsee lähteen paistettuun muotoon; hedelmäryhmä ei sellaisenaan kelpaa. |

### Seuraavan 2B6E-erän ehdotettu viisikko

Säilytetään alkuperäinen viisikko. Kaikkien viiden syötefingerprint ja koko estolista ovat ennallaan; jokainen tarkistettiin uuden tuotantotilan rinnalla. Keltaisen curryn oma GI puuttuu eikä se ole näitä parempi välitön toteutuskohde.

**Varmistettu nettolisäys 0; jokaisessa reseptissä ehdollisesti 0–1 ja koko joukossa 0–5. Aiempi +1–3 ei ole toimituslupaus eikä tämän ajon odotusarvo.** Tulokset voivat jäädä kokonaan nollaan. Määrät ovat loogisia ylärajoja, eivät lähteiden löytämisen todennäköisyyksiä.

#### 1. `jauhelihapihvit-vhh-kermakastikkeella`

Nykyiset estot: jauhelihapihvit-vhh-kermakastikkeella: lihalientä: GI value is unpublished, off-scale, or its food/preparation match lacks a rationale.
Jo olemassa: `fineli-11177-2026-10-25`, `fineli-11562-2026-10-25`, `fineli-28-2026-10-25`, `fineli-29-2026-10-25`, `fineli-30-2026-10-25`, `fineli-335-2026-10-25`, `fineli-500-2026-10-25`, `fineli-631-2026-10-25`, `fineli-858-2026-10-25`. Mallin nyt hyväksymät GI-tietueet: `dairy-category-mean-gi-35`, `onion-literature-analogue-gi-15`. Mallihyväksyntä ei korvaa lähdekatselmointia.
**Tarkistettava lähde:** Fineli 29 -liemen tuote, laimennus ja 100 ml → 100 g; myös nykyiset kuumennetun kerman ja sipulin analogiat tarkistetaan koko reseptin katselmoinnissa.
**Syöte ja annos:** 4 annosta; kaikki laskentamassat ovat olemassa. Munan 55 g, voin 14 g ja liemen tilavuusmuunnos tarvitsevat lähdevarmennuksen; tavallinen ravintoauditointi on INSUFFICIENT SOURCE DATA.
**Pienosuudet:** Liemi 0,750 g/annos: väärän GI:n poistoehdokas nostaisi poisjätöt 0,43705 → 1,18705 g/annos. Alle 1 g / alle 2 g voi soveltua vain koostumuksen ja määrän tarkistuksen jälkeen.
**Avaava ratkaisu:** Poista perusteeton keitto-GI vain, jos pieni liemiosuus ja koko muu ainesketju kestävät lähdetarkistuksen.
**Erän realistisuus:** Realistinen rajattu yhden erän katselmointi; numeerista lopputulosta ei hyväksytä tässä. Ehdollinen nettolisäys 0–1.

#### 2. `vhh-kaalilaatikko`

Nykyiset estot: vhh-kaalilaatikko: kuohukermaa: GI value is unpublished, off-scale, or its food/preparation match lacks a rationale.
Jo olemassa: `fineli-11177-2026-10-24`, `fineli-11562-2026-10-24`, `fineli-29-2026-10-24`, `fineli-30-2026-10-24`, `fineli-320-2026-10-24`, `fineli-335-2026-10-24`, `fineli-500-2026-10-24`, `fineli-631-2026-10-24`, `fineli-858-2026-10-24`. Mallin nyt hyväksymät GI-tietueet: `vegetables-category-mean-gi-66`. Mallihyväksyntä ei korvaa lähdekatselmointia.
**Tarkistettava lähde:** dairy-category-mean-gi-35 on olemassa, mutta 175 °C:ssa 60–70 min kypsennetyn kerman analogia on perusteltava; avainten korjaus ei yksin riitä.
**Syöte ja annos:** 6 annosta; kerma 200 g, sipuli 55 g, munat 110 g, liemi 100 g ja meiramin arvio tarkistettava reseptimittoihin. Ei puuttuvaa olennaista massaa mallissa, mutta meiramin 0,1 g HH on oletus.
**Pienosuudet:** Kerma 0,96667 g/annos. Pelkkä GI-sidoksen poisto nostaisi yhteispoisjätön 1,17752 → 2,14418 g/annos ja estäisi edelleen. Tarvitaan kelvollinen GI-sidos tai muu erikseen lähteistetty ratkaisu.
**Avaava ratkaisu:** Varmenna kerman hyväksyttävä ruoka-/valmistusanalogia ja koko määräpohja; muuta vain perustellut avaimet myöhemmässä erässä.
**Erän realistisuus:** Mahdollinen yhden erän lähdekatselmointi, epävarmuus kohtalainen; ei automaattinen avainkorjaus. Ehdollinen nettolisäys 0–1.

#### 3. `som-tam-vhh-kurkkuna`

Nykyiset estot: som-tam-vhh-kurkkuna: vihreitä papuja: GI value is unpublished, off-scale, or its food/preparation match lacks a rationale.
Jo olemassa: `afcd-F002901-2026-10-24`, `afcd-F004193-2026-10-24`, `afcd-F004729-2026-10-24`, `fineli-29022-2026-10-24`, `fineli-346-2026-10-24`, `fineli-352-2026-10-24`, `fineli-378-2026-10-24`, `foodin-erythritol-200g-label-2026-10-24`, `off-13692210-squid-brand-fish-sauce-2026-10-24`. Mallin nyt hyväksymät GI-tietueet: `nuts-category-mean-gi-22`, `tomato-raw-cooked-sauce-analogue-gi-22`, `vegetables-category-mean-gi-66`. Mallihyväksyntä ei korvaa lähdekatselmointia.
**Tarkistettava lähde:** vegetables-category-mean-gi-66 on ehdokas keitetyille vihreille pavuille. Varmista myös Fineli 29022:n valmistustila, raakatomaatin nykyinen sidos ja pähkinäanalogia.
**Syöte ja annos:** 4 annosta; papuja 100 g ja kaikki muut massat määritelty. Keitetty/valutettu massa tarkistettava lähteeseen; nykyiset fingerprintit eivät ole vanhentuneet.
**Pienosuudet:** Papujen 1,2645 g/annos ylittää yksittäisen poisjätön rajan. Muiden poisjättö on 0,36675 g/annos; pavuille tarvitaan lähde, niitä ei saa pyöristää alle 1 g:n.
**Avaava ratkaisu:** Hyväksytty papujen ruoka-/valmistusvastaavuus ja kaikkien syötteiden tarkistus; vasta sitten vegetables/cooked-avainten korjaus.
**Erän realistisuus:** Mahdollinen yhden erän katselmointi, jos olemassa oleva lähde todella kattaa valmistuksen. Ehdollinen nettolisäys 0–1.

#### 4. `siemengranola-jogurtilla`

Nykyiset estot: siemengranola-jogurtilla: cumulative omitted available carbohydrate is 2.064 g/serving, at or above the 2 g editorial tolerance.
Jo olemassa: `afcd-F002963-2026-10-24`, `afcd-F007619-2026-10-24`, `afcd-F008210-2026-10-24`, `afcd-F008212-2026-10-24`, `afcd-F008215-2026-10-24`, `fineli-32201-2026-10-24`, `fineli-379-2026-10-24`, `fineli-500-2026-10-24`. Mallin nyt hyväksymät GI-tietueet: `dairy-category-mean-gi-35`, `fruit-category-mean-gi-51`. Mallihyväksyntä ei korvaa lähdekatselmointia.
**Tarkistettava lähde:** nuts-category-mean-gi-22 on manteliehdokas. Fineli 379 -mantelilastut paahdetaan 160 °C:ssa 18–22 min; lähteen on katettava tämä muoto. Myös jogurtti- ja vadelmasidokset tarkistetaan.
**Syöte ja annos:** 4 annosta; 40 g mantelilastuja ja kaikki muut massat määritelty. Tuettu ravintolaskelma on olemassa, mutta paahto ja syötävä osuus vaativat tarkistuksen.
**Pienosuudet:** Nykyinen poisjättö 2,06375 g/annos estää. Jos mantelien 0,660 g/annos saa hyväksyttävän GI:n, poisjättö olisi 1,40375 g/annos. GI-arvoa ei tässä kokeessa arvata.
**Avaava ratkaisu:** Vähintään riittävän yhden poisjätetyn osuuden hyväksyttävä GI-sidos sekä koko ainesketjun katselmointi; manteli on nimetty tutkimusehdokas.
**Erän realistisuus:** Rajattu mutta lähderiskinen yhden erän työ; paahtovastaavuuden puuttuessa jää nulliksi. Ehdollinen nettolisäys 0–1.

#### 5. `valimerellinen-halloumi-tomaattileipa`

Nykyiset estot: valimerellinen-halloumi-tomaattileipa: hapanjuurileipä: No source-matched composition and preparation was resolved for “hapanjuurileipä”; it is not treated as zero.
Jo olemassa: `fineli-33465-release-20`, `fineli-34972-release-20`, `fineli-352-release-20`. Mallin nyt hyväksymät GI-tietueet: `dairy-category-mean-gi-35`, `tomato-raw-cooked-sauce-analogue-gi-22`. Mallihyväksyntä ei korvaa lähdekatselmointia.
**Tarkistettava lähde:** Ravintolaskelman Fineli 31842 -maalaisleipäproxy ei ole hyväksytty hapanjuurileivän GK-koostumus. Leipä-GI-katalogiehdokas ja paahdon vastaavuus on tarkistettava erikseen.
**Syöte ja annos:** 2 annosta; hapanjuurileipää 100 g. Annos- ja grammapohja on täsmällinen, mutta tuotekoostumus puuttuu GK-syötteestä. Öljyn/suolan nollahiilihydraattiperuste ja muu resepti tarkistetaan.
**Pienosuudet:** Leivän imeytyvä hiilihydraatti on ratkaisematon eikä saa olla nolla. Pienosuustoleranssia ei voi soveltaa tuntemattomaan leipäosuuteen.
**Avaava ratkaisu:** Lähdevastaava hapanjuurileivän koostumus sekä paahdettuun leipään sopiva GI; yksi koostumuskorjaus yksin ei riitä.
**Erän realistisuus:** Yhden erän selvityskohde, ei varma avaus. Kahden lähdeportin vuoksi viisikon epävarmin; ei silti uutta näyttöä selvästi paremmasta korvaajasta. Ehdollinen nettolisäys 0–1.

### Historiallinen regressiosuoja ja erilliset laatutyöt

Historiallinen 2B6D-baseline säilyy muuttumattomana: 136 silloista laskettua arvoa. Vain `keltainen-kanacurry-vhh` saa poiketa lasketusta tilasta, ja sen koko nykyinen tulos on täsmättävä PR #124:n dokumentoituun jälkeen-tilaan. Muut historialliset arvot sekä kaikki 137 nykyistä laskettua arvoa tarkistetaan; kahden 2B6D-lisäyksen arvot säilyvät: hirssipuuro 21,19 ja kuskus-aamiaiskulho 34,36.
REFERENCE_ONLY-lipun poistaminen, hylätyn kookosmaitosidoksen palautus, muun aiemman arvon poistuminen/muuttuminen, uusi laskettu resepti, duplikaatti-ID tai työjonon aukko keskeyttää analyysin. Julkaistua dataa tai laskentakoodia ei sallita muutetuksi suhteessa lukittuun tuotantocommittiin.
Voimassa olevat fingerprint-poikkeamat: recipeBindingMismatches=38, calculationInputMismatches=0, calculationEvidenceMismatches=0. Uudet poikkeamat historiallisen vertailun suhteen: newStructureMismatches=0, newInputMismatches=0, newEvidenceMismatches=0. 38 rakenne-estoa ja uusien muutosten 0/0/0 kuvaavat eri asioita.
`intialainen-aloo-paratha`: Fineli 310 / MAA-ARTISOKKA vs peruna säilyy erillisenä koostumus- ja lähdevastaavuustyönä. Tortillan keitetty peruna vs öljykypsennys säilyy erillisenä valmistusriskinä.
Lisähavainto: koostumuskatalogissa on ennestään kaksi eri tietuetta samalla ID:llä `fineli-11557-2026-10-24`. Analyysi säilyttää laskentamallin nykyisen viimeisen tietueen valinnan; koostumuksia ei muuteta. Tämä jää erilliseksi lähdekatalogin laatutarkistukseksi.
Neljä laskettua mannasuurimoreseptiä säilyvät erillisessä valmistusvastaavuuden katselmoinnissa: `intialainen-rava-uttapam`, `pohjoisafrikkalainen-baghrir`, `pohjoisafrikkalainen-msemen-hunajalla`, `pohjoisafrikkalainen-harcha-juustolla`. Niiden arvoja ei muutettu.

### Uudelleenajo ja tarkistukset

Aja oikean checkoutin `site/`-hakemistosta. Audittien tulokset menevät ohitettuun `tmp/nutrition`-hakemistoon; content/build vain tämän työpuun generoituun sivustoon. Analyysin ja probe-kokeen tuloskohteen on oltava repon ulkopuolinen scratch. Versionhallittuihin tiedostoihin siirto tehdään repo_guardilla.

```powershell
npm run content:sync
npm run audit:nutrition -- --strict
npm run audit:glycemic-load
python ../docs/nutrition/tools/glycemic-coverage-run-0-analyze.py .. D:/Temp/reseptit-run06-replay
python ../docs/nutrition/tools/test_glycemic_run0_validation.py
node --import tsx ../docs/nutrition/tools/glycemic-coverage-run-0-probe.mts .. D:/Temp/reseptit-run06-replay/probe.json
npm run test:glycemic
npm test
npm run test:select-ci
npm run build
npm run test:static
```

Kattavuuskomentoa ei tarvita seurattujen nykyinventaarioiden muuttamiseen: analyysi täsmää jokaisen tuoreen tulosrivin kumpaankin nykyinventaarioon. Kahden peräkkäisen analyysiajon JSON/Markdown ja probe-tulokset verrataan byte-for-byte samoilla syötteillä. Paikallinen testitulos ja viimeisen HEADin CI raportoidaan PR #123:ssa; aiemman HEADin CI ei hyväksy tätä päivitystä.
Git-integraatiossa säilytettiin molemmat README-lisäykset. PR #124:n laskentatoteutus, historialliset baselinet ja tuotannon GK-tulokset ovat muuttumattomat. PR #123 pysyy Draftina; ei mergeä, deployta, ReportHubia eikä 2B6E-laskentaa.

**Pysähdy tähän. AJO 1 / 2B6E edellyttää erillistä toimeksiantoa.**

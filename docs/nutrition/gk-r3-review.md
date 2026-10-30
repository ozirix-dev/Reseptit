# GK 2.1 R3 – lähdevarmennus ja rajattu toteutusehdotus

Tila: **R3 – READY FOR INDEPENDENT REVIEW**. Tutkimus- ja ehdotusaineisto,
ei riippumaton hyväksyntä, julkaisutietue tai lupa tuotantoon.
Päivä: 2026-10-30. Lähtö-main: `e8da2c9417e2aeff55a85d599b3b7e1ad465f36c`.

## Tulos ja aineiston lukeminen

24 reseptistä 14 sai koko annoksen lähteistetyn **arvion**, kahdeksan jäi
osatulokseksi ja kaksi ilman riittävää kokonaislaskentaa. Näistä 16 tutkittiin
uutena syvällisesti; kahdeksan on R2:n jatkotarkistuksia. R2:n 134 alustavasta
CARBOHYDRATE_ONLY-ehdokkaasta valittiin 22. Soba ja bubur sumsum täydentävät
joukkoa alkuperäisen GI-tutkimuksen ja puuttuvan laskentarakenteen vuoksi.

**VERIFIED_TOTAL: 0; ESTIMATED_TOTAL_WITH_EVIDENCE: 14; PARTIAL_ONLY: 8;
INSUFFICIENT_EVIDENCE: 2.** Kaikki 14 kokonaistulosta ovat ehdollisia arvioita,
eivät mitattuja annoksia tai hyväksyttyjä julkaisuja. Tavoite vähintään kymmenen
kokonaisuuden valmistelusta riippumattomaan arviointiin täyttyy tällä rajauksella.
Uusia reseptiin soveltuvia GI-sidontoja tai uusia GK-ehdotuksia on nolla.

Kukin erätiedosto sisältää kaikki alkuperäiset ainesosat, annosmäärän,
määrän ja yksikön, syötävän massan perusteen, koostumuslähteen ja neljä makroa,
raaka-/kypsennetyn tilan, säilymisoletuksen, valmistuksen käsin tehdyn arvion,
strict-vertailun, epävarmuudet, päätöksen ja seuraavan toimenpiteen.
Hiilihydraatin laskenta on Python Decimal -summalaskenta alkuperäisen tietokannan
arvoista; se ei kopioi julkaistua summaa eikä kutsu TypeScript-ravintomallia.
Tämä on laskennallinen ristivarmennus samoista koostumuslähteistä, ei uusi
riippumaton elintarvikkeen laboratoriomittaus.

- [24 reseptin päätös- ja hiilihydraattirekisteri](gk-r3-carbohydrate-register.json).
- Syvätutkimus ja välitulokset: [erä 1](gk-r3-batch-1.json),
  [erä 2](gk-r3-batch-2.json), [erä 3](gk-r3-batch-3.json).
- [R2:n tekninen ennakkotarkistus](gk-r3-r2-preflight.json) ja
  [viiden ravintoarvoehdotuksen päätösmatriisi](gk-r3-nutrition-proposal-matrix.json).
- [Alkuperäislähteiden pääsy, tietueet ja annosmassat](gk-r3-source-evidence.json)
  sekä [GI-tutkimustaulukko](gk-r3-gi-studies.json).
- [83 GK-arvion priorisoitu riskiluettelo](gk-r3-risk-screen.md) ja
  [koneellinen aineisto](gk-r3-existing-83-risk-screen.json).
- [Versiolukitukset](gk-r3-verification-manifest.json) ja
  [toistettava tarkistin](tools/gk_r3_verify.py).

## Rajaus ja peräkkäiset erät

Työ on mainista tehty eristetty `codex/gk-2-1-r3`-haara. R2:n keskeneräisiä
aktiivisia syötteitä ei ole otettu tämän haaran lähtötilaksi.
[Reseptit #133](https://github.com/ozirix-dev/Reseptit/pull/133),
HEAD `020b665582f4f1ec54e56ec978581e424adc6ace`, sekä
[ReportHub #73](https://github.com/ozirix-dev/ReportHub/pull/73),
HEAD `fabdecd0ad41b56eb8ebd00eeaa8fbc0368ec935`, säilyvät ennallaan.

Erä 1 painotti viittä R2-ehdotusta ja kolmea lähdepuutetta: kaksi kokoarviota,
kuusi osatulosta. Lähteet, aritmetiikka ja välitiedosto tarkistettiin ja tallennettiin
ennen seuraavaa erää. Erä 2 painotti jo grammoina määriteltyjä, selkeämmin rajattuja
reseptejä: seitsemän kokoarviota ja yksi osatulos. Erä 3 yhdisti ratkaistavan
kaneli-/kookosmassan sekä kaksi GI-jatkokohdetta: viisi kokoarviota, yksi osatulos,
kaksi riittämätöntä. Eräkohtaiset esteet eivät estäneet muiden lähteiden turvallista
tutkimista. Jälkimmäisen USDA-haun baozin seesamiöljylöydös lisättiin erään 1
erillisenä jatkohavaintona; sen päätös ei muuttunut. 24 reseptin rajaa ei ylitetty.

Uutta 326 reseptin yleisinventaariota ei tehty. Tavalliset auditoinnit tarkistivat
aineiston ajantasaisuuden; niiden lisäksi ainoastaan 83 nykyisen GK-arvion
automaattinen seula oli koko valittua syvätutkimusjoukkoa laajempi.

## Päätösten merkitys ja 24 reseptiä

**A / VERIFIED_TOTAL** edellyttäisi tässä alkuperäisen kokonaisuuden ja määrien
varmentamista ilman ratkaisemattomia tuotteen/annoksen arvio-oletuksia.
**B / ESTIMATED_TOTAL_WITH_EVIDENCE** on kaikkien kyseiseen nimettyyn
annosskenaarioon kuuluvien ainesosien lähteistetty arvio: keskimääräinen tuote,
viiteannos ja täyden säilymisen arvio on ilmoitettu. Se ei lupaa samaa tulosta
kaikille tuotemerkeille tai annoskoille. **C / PARTIAL_ONLY** ei ole koko annoksen
arvo, vaikka listan summa olisi laskettavissa. **D / INSUFFICIENT_EVIDENCE** ei
sisällä riittävää kokonaislaskelmaa. Nämä ovat tutkimuspäätöksiä; nykyistä
hyväksyntäpolitiikkaa tai käyttöliittymän tiloja ei muuteta tällä dokumentilla.

Taulukon CHO on käytettävää hiilihydraattia g/annos. Viiva tarkoittaa, ettei koko
annoksen arvoa esitetä; se ei tarkoita nollaa. C/D:n laskettavat osat löytyvät
liitteistä nimettyinä osatuloksiksi, eivät tämän taulukon kokonaisarvosarakkeesta.

| Erä | Resepti | Annoksia | Päätös | Koko annoksen CHO | Ratkaiseva lähde tai rajaus |
| --- | --- | ---: | --- | ---: | --- |
| 1 | [bulgogi](../../reseptit/paaruoat/bulgogi.md) | 4 | C | — | Marinadin kulutus ja sokerin/öljyn lusikkamassa avoinna |
| 1 | [tomaatti-kananmuna-wokki](../../reseptit/paaruoat/tomaatti-kananmuna-wokki.md) | 3 | B | 39,03 | Soija 18 g/rkl; 450 g kypsää riisiä; keskikokoiset munat/tomaatit |
| 1 | [baozi](../../reseptit/paaruoat/baozi.md) | 4 | C | — | Hiiva puuttuu; kaalin puristus ja käyminen; öljyn tl lähteistettiin |
| 1 | [koshari](../../reseptit/paaruoat/koshari.md) | 4 | C | — | Keitinvesi, pinnoite ja valutettu paistoöljy |
| 1 | [yangzhou-paistettu-riisi](../../reseptit/paaruoat/yangzhou-paistettu-riisi.md) | 4 | B | 39,16 | Kypsä riisi 600 g, kuoritut katkaravut, soija 36 g, öljy 27 g |
| 1 | [meheva-suklaakakku](../../reseptit/jalkiruoat/meheva-suklaakakku.md) | 10 | C | — | Vuoan jauhot/rasva puuttuvat; leivinjauheen tl epäselvä |
| 1 | [valimerellinen-appelsiini-aamiaiskakku](../../reseptit/aamupalat/valimerellinen-appelsiini-aamiaiskakku.md) | 2 | C | — | Appelsiini/sitruuna ja jogurtin käyttövaihe ristiriidassa |
| 1 | [intialainen-rava-uttapam](../../reseptit/aamupalat/intialainen-rava-uttapam.md) | 2 | C | — | Ohjeen korianterilla ei määrää |
| 2 | [vhh-lihapiirakka](../../reseptit/leivonnaiset/vhh-lihapiirakka.md) | 8 | B | 2,27 | Rasvaa poistamaton mantelijauho ja nimetyt juusto-/jauheliha-arviot |
| 2 | [vhh-letut](../../reseptit/jalkiruoat/vhh-letut.md) | 4 | B | 2,57 | Sellaisenaan tarjottu vaihtoehto; erytritolin käytettävä CHO 0 |
| 2 | [siemengranola-jogurtilla](../../reseptit/aamupalat/siemengranola-jogurtilla.md) | 4 | B | 8,09 | Kaneli USDA 171320: 2,6 g/tl; kaikki jogurtti ja marjat mukana |
| 2 | [meksikolainen-quesadilla-sienilla](../../reseptit/aamupalat/meksikolainen-quesadilla-sienilla.md) | 2 | B | 32,94 | Valmis maissitortilla; nimetty tortilla-/mozzarellakoostumusarvio |
| 2 | [valimerellinen-halloumi-tomaattileipa](../../reseptit/aamupalat/valimerellinen-halloumi-tomaattileipa.md) | 2 | C | — | Vaalea maalaisleipä ei varmista nimeämätöntä hapanjuurileipää |
| 2 | [vietnamilainen-kahvijogurtti-banaanilla](../../reseptit/aamupalat/vietnamilainen-kahvijogurtti-banaanilla.md) | 2 | B | 21,39 | Makeutettu kondensoitu maito; kahvin tiheys 1; syötävä banaani |
| 2 | [thai-papaijajogurtti](../../reseptit/aamupalat/thai-papaijajogurtti.md) | 2 | B | 12,44 | Punnitut syötävät hedelmät; maustamaton jogurttiarvio |
| 2 | [pohjoisafrikkalainen-harcha-juustolla](../../reseptit/aamupalat/pohjoisafrikkalainen-harcha-juustolla.md) | 2 | B | 35,66 | Semolina, nimetty täysmaito ja 11 % tuorejuusto |
| 3 | [kreikkalainen-moussaka](../../reseptit/paaruoat/kreikkalainen-moussaka.md) | 6 | B | 32,25 | Kaneli 2 → 2,6 g; nimetyt täysmaito ja kova Edam |
| 3 | [japanilainen-soba-aamiaiskeitto](../../reseptit/aamupalat/japanilainen-soba-aamiaiskeitto.md) | 2 | D | — | Nuudeli, pinaatin kpl-massa ja liemivaihtoehdot puuttuvat |
| 3 | [indonesialainen-bubur-sumsum](../../reseptit/aamupalat/indonesialainen-bubur-sumsum.md) | 2 | D | — | Pandan 150 g:n muoto/käyttö, liemi ja täyte ratkaisematta |
| 3 | [pohjoisafrikkalainen-taatelipuuro-appelsiinilla](../../reseptit/aamupalat/pohjoisafrikkalainen-taatelipuuro-appelsiinilla.md) | 2 | B | 41,30 | Kanelin 2,6 g lähde varmistui; kuorittu hedelmä ja kivetön taateli |
| 3 | [keto-korvapuustit](../../reseptit/leivonnaiset/keto-korvapuustit.md) | 8 | B | 1,99 | Nimetyt tavalliset juustot ja mantelijauho; polyolimäärä ei hyväksytty |
| 3 | [indonesialainen-serabi-kookospannukakku](../../reseptit/aamupalat/indonesialainen-serabi-kookospannukakku.md) | 2 | B | 57,01 | Kookosmaito 138 → 150 g; sakkaroosi → fariinisokeritietue |
| 3 | [thai-kookosriisi-mangolla](../../reseptit/aamupalat/thai-kookosriisi-mangolla.md) | 2 | B | 48,22 | AFCD-kookosmaito 184 → 204 g; raaka riisi ja syötävä mango |
| 3 | [pohjoisafrikkalainen-msemen-hunajalla](../../reseptit/aamupalat/pohjoisafrikkalainen-msemen-hunajalla.md) | 2 | C | — | Ohjeen nesteen laji ja määrä puuttuvat |

## R2:n tekninen ennakkotarkistus

Koko 12 tiedoston diff luettiin ja käsiteltiin rakenteellisesti. Generoitujen
inventaarioiden kaikkia rivejä ei esitetä uutena ihmisen tekemänä lähdehyväksyntänä.
Kaikki 30 muutostietuetta toistettiin ennen/jälkeen-syötteisiin: 10 massakorjausta,
yksi koostumustunnisteen korjaus ja 20 GI-poistoa. Baozin maissitärkkelyksen massa
ja tunniste ovat samassa tietueessa. Kahdeksan syötettä, kaikki 326 lähtötuloshashia,
kahdeksan lopputulosta ja viisi ravintolaskelmaa täsmäsivät.

Kolmen kevätsipulikorjauksen lähde on AFCD F006250:n alkuperäinen 15 g viiteannos.
Neljä soijakorjausta perustuvat Fineli 31:n 18 g/rkl ja 120 g/dl arvoihin.
Kaksi maissitärkkelysmassaa perustuvat Fineli 27:n 7 g/rkl arvoon; baozin entinen
perunatärkkelys 162 on eri elintarvike. Yangzhoun öljy perustuu Fineli 541:n
13,5 g/rkl arvoon. Lähdemassat ovat arvioita, eivät reseptin punnitustuloksia.
Finelin koostumukset ja annosmassat luettiin hyväksytystä paikallisesta Release 20
-aineistosta; uuden verkkolatauksen onnistumista ei väitetä.

Kaikki 20 GI-poistoa ovat perusteltuja varovaisia poistoja: ruokaryhmän keskiarvo
tai valmistusmuodoltaan väärä tietue ei varmista kyseistä ainesosaa. Tarkat
resepti-/ainesosarivit, entiset GI-tunnisteet ja perustelut ovat ennakkotarkistusliitteessä.

Historiallisten testiodotusten kahdeksan reseptin poikkeus korvataan R2:ssa
kiinteillä koko tuloksen sekä syötteen ja evidenssin hasheilla. Kolme tarkoituksellista
virhettä jokaiselle kahdeksalle syötteelle havaittiin: +11 g hiilihydraattia sisältävään
ainesosaan, +1 g/100 g koostumuksen hiilihydraattiin ja GI-sidoksen vaihto.
24 koetta eivät todista kaikkia mahdollisia virheitä mahdottomiksi, mutta poikkeus
ei ohita näitä uusia määrä-, koostumus- tai sidontavirheitä. Baozin 2,6391 g poisjättö
testataan estäväksi; alle 2 g raja ei muutu. Aktiivinen kattavuus on edelleen 83/326.

Uutta aritmeettista virhettä aktiivisiin korjauksiin ei löytynyt. Sen sijaan kolme
ehdotuksen lähtölaskelmasta periytyvää laatupuutetta pitää korjata ennen koko
ravintoarvon hyväksyntää:

1. **Bulgogi:** täysi marinadin säilyminen ei käy ilmi ohjeesta. Kirjaa tulos
   kaikkien syötettyjen ainesten ehdolliseksi summaksi, selvitä marinadin kulutus
   sekä sokerin/öljyn massat. USDA:n seesamiöljyn rkl on 13,6 g, ei R2:n 13,5 g.
2. **Baozi:** lisää 7 g hiivaa täydelle ainesosariville ja määritä kaalin massan
   mittausvaihe sekä käymisen vaikutuksen käsittely. AFCD F009606:n hiiva lisäisi
   syötettyyn annokseen CHO 0,11025 g, proteiinia 0,637 g, rasvaa 0,0875 g ja
   kuitua 0,47075 g. Pelkkä lisäys tuottaisi CHO-syötesumman 80,49 g, joka ei
   vielä ole valmiin käyneen tuotteen varmennettu arvo. Seesamiöljyn 4,5 g/tl
   saatiin nyt lähteistettyä USDA 171016:sta; raastetun inkiväärin rkl jäi avoimeksi.
3. **Koshari:** väite siitä, ettei nesteitä poisteta, on ristiriidassa pastan,
   linssien ja paistettujen sipulien valutuksen kanssa. Selvitä säilynyt tärkkelys,
   öljy ja keitinvesihävikki; älä nimeä 95,48 g syötesummaa syödyksi kokonaisarvoksi.

R2 oli jo pitänyt nämä ehdotuksina. Havainto ei tarkoita, että R2 olisi julkaissut
ne uusina hyväksyttyinä arvoina. PR #133:a tai sen raporttia ei korjattu tässä ajossa.

## Viiden ravintoarvoehdotuksen matriisi

Järjestys soluissa: **käytettävä CHO / proteiini / rasva / kuitu**, g/annos.
Ennen-arvo on nykyinen strict-laskelma, jonka CHO vastaa julkaistua lähtöarvoa.
Ehdotus on R2:n toistettu laskenta; C-tapauksissa se on edelleen syötesumma.
Erot lasketaan samoista pyöristetyistä arvoista. Täydet lähtötiedot ja epävarmuudet
ovat erillisessä päätösmatriisissa.

| Resepti | Annoksia | Ennen | R2:n ehdotus | Muutos | Päätös |
| --- | ---: | --- | --- | --- | --- |
| bulgogi | 4 | 62,81 / 43,15 / 8,29 / 2,18 | 63,13 / 43,32 / 8,30 / 2,24 | 0,32 / 0,17 / 0,01 / 0,06 | Koko ravintoarvopäivitys pidätetään |
| tomaatti-kananmuna-wokki | 3 | 38,93 / 12,98 / 16,58 / 1,70 | 39,03 / 13,03 / 16,58 / 1,70 | 0,10 / 0,05 / 0,00 / 0,00 | Arvio riippumattomaan katselmointiin |
| baozi | 4 | 80,36 / 26,69 / 14,53 / 4,16 | 80,38 / 26,77 / 14,54 / 4,13 | 0,02 / 0,08 / 0,01 / -0,03 | Koko ravintoarvopäivitys pidätetään |
| koshari | 4 | 95,91 / 22,26 / 12,03 / 7,23 | 95,48 / 22,25 / 12,03 / 7,23 | -0,43 / -0,01 / 0,00 / 0,00 | Koko ravintoarvopäivitys pidätetään |
| yangzhou-paistettu-riisi | 4 | 39,01 / 21,18 / 11,11 / 1,36 | 39,16 / 21,26 / 11,01 / 1,36 | 0,15 / 0,08 / -0,10 / 0,00 | Arvio riippumattomaan katselmointiin |

## Uusi konkreettinen lähdenäyttö

[USDA:n alkuperäinen SR Legacy -CSV-paketti](https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_sr_legacy_food_csv_2018-04.zip)
oli luettavissa. Sen ruoka- ja annosmassarivit yhdistettiin tunnisteella.
Jauhetun kanelin FDC 171320 tl-massa on **2,6 g**; AFCD-kanelin koostumus viittaa
samaan USDA-ruokaan. Tämä ratkaisee lähdeaukon granolassa, taatelipuurossa ja
korvapuusteissa sekä tuottaa moussakaan määrän korjausehdotuksen 2 → 2,6 g.
Kokonaisen juustokuminan annosmassaa ei siirretty jauhetulle mausteelle.
Leivinjauheen eri valmistetyyppejä tai pakatun sokerin lusikkaa ei rinnastettu
toiseen tuotteeseen. Alkuperäiset valitut rivit ja lataushash ovat lähdeliitteessä.

Serabin **Fineli 29014** antaa kookosmaidon 100 g/dl: 150 ml on 150 g,
ei öljymäisellä 0,92-kertoimella laskettu 138 g. Fariinisokeri yhdistettiin
AFCD F008969:ään nykyisen geneerisen sakkaroosin sijasta. Thai-kookosriisin
**AFCD F002991** antaa tiheyden **1,02 g/ml**: 200 ml on 204 g, ei 184 g.
AFCD:n nestemäisen alkuperäis-API:n ravintoarvojen nimittäjä on 100 ml;
repon jäädytetty koostumus on 100 g. Tiheys huomioitiin vertailussa, eikä API:n
tilavuusarvoja käytetty massaperusteisina. 33 AFCD-alkuperäisvastausta luettiin;
Finelin uutta API-/bulk-latausta esti HTTP 403, joten käytettiin hyväksyttyä
paikallista aineistoa. Tämä on pääsyrajoitus, ei väite lähteen puuttumisesta.

| Uusi ravintolaskentaehdotus | CHO ennen → jälkeen | Proteiinin muutos | Rasvan muutos | Kuidun muutos |
| --- | ---: | ---: | ---: | ---: |
| kreikkalainen-moussaka | 32,22 → 32,25 | 0,01 | 0,01 | 0,06 |
| indonesialainen-serabi-kookospannukakku | 57,30 → 57,01 | 0,15 | 1,28 | 0,31 |
| thai-kookosriisi-mangolla | 48,05 → 48,22 | 0,14 | 1,54 | 0,00 |

[Foodinin valmistajamerkintä](https://foodin.fi/tuote/erytritoli-luomu-200g-2/)
vahvistaa puhtaan erytritolin: 100 g hiilihydraatista kaikki 100 g ovat polyoleja.
Käytettävä CHO on siis nolla. Lähteetön 12 g/rkl ei vaikuta näihin neljään
makroon, mutta se **ei oikeuta hyväksymään polyolien kokonaismäärää**. Lettujen
arvio koskee ohjeen sellaisenaan tarjottavaa vaihtoehtoa; nimeämättömät marjat
eivät kuulu siihen. Korvapuustien juustoarvio ei kata tärkkelyksellä päällystettyä
valmista raasteseosta. Kummankaan koko ravintomerkintää ei hyväksytä tällä CHO-rajauksella.

## Alkuperäiset GI-tutkimukset

Kahdeksan julkaisua: kuusi alkuperäistä kokotekstiä luettiin, kaksi jäi
alkuperäisabstraktin tai kustantajan esikatselun tasolle. Neljä luettua kokotekstiä
sisältää ihmisen GI-mittauksia. Reseptiin täsmääviä uusia sidontoja: **0**.
Täydet bibliografiat, DOI/PMID, ruoka, valmistus, otos, menetelmä, vertailuasteikko,
epävarmuustyyppi ja soveltumattomuuden perustelu ovat GI-liitteessä.

| Tutkimus | Luettu näyttö ja menetelmä | Lähteen luku | Miksi ei uutta sidontaa |
| --- | --- | --- | --- |
| [Sugiyama 2003](https://doi.org/10.1038/sj.ejcn.1601606) | Abstrakti/esikatselu; 58 kaikkiaan, soban oma n lukematta; riisivertailu | Soban taulukkoarvoa ei luettu eikä täytetty toisesta lähteestä | Kokotekstin pääsy ja nuudelin koostumus/valmistus avoinna; valkoinen riisi = 100 ei ole glukoosi = 100 |
| [Kim 2019](https://doi.org/10.1017/S0007114518003446) | Kokoteksti + taulukot; 50 g käytettävää CHO:ta, glukoosi, iAUC | Tattarinuudeli n=13: 59,6 ± 13,3 SEM; riisijauhokakku n=10: 80,7 ± 8,5; puristettu n=9: 50,6 ± 7,2; höyrytetty perunatärkkelys n=12: 53,3 ± 17,3 | Soban tuote ei tunnistettu; riisikakku ei ole kookospuuro/pannukakku; peruna ei ole maissitärkkelys |
| [Chiu 2013](https://doi.org/10.6133/apjcn.2013.22.3.08) | Kokoteksti; 21 tervettä; 50 g CHO, glukoosivertailu; 3 vrk/4 °C, mikrokuumennus | Korkean RS:n riisi 83,9 ± 6,6; matalan 78,0 ± 10,6; taulukko SE, yleisteksti SD | Riisilaji/keitto/kuumennus eivät vastaa wokkia; ero ei merkitsevä; taulukko nimeää kokonais-AUC:n |
| [Strozyk 2022](https://doi.org/10.1038/s41387-022-00196-1) | Kokoteksti; 32 T1D-potilasta, insuliini, riisi + tomaattikastike, Libre; 24 h/4 °C | Ei glukoosivertailuun mitattua GI:tä | Ateriavaste ei ole tämän ainesosan GI tai yleinen jäähdytysvähennys |
| [Haini 2022](https://doi.org/10.1016/j.heliyon.2022.e09375) | Kokoteksti; 15 naista; 50 g CHO, glukoosi, iAUC; täyttämätön pulla | Hi-Maize 39,11 (SD 10,2; SEM 5,6); kontrolli 69,18 (SD 21,3; SEM 9,8) | Eri jauho ja resepti; SD/SEM/n eivät täsmää, koostumustaulukon nimittäjä vaatii selvityksen |
| [Lan 2013](https://doi.org/10.1186/1475-2891-12-64) | Kokoteksti; GI-haara 10 tervettä, erillinen 10 T2D; glukoosi/iAUC | Jizi439 75 ± 9 SD; Chu20 84 ± 10; vehnäseos 93 ± 11 | Eri vehnä, kohotus ja höyrytys; täyttämätön leipä ei ole täytetty baozi tai raaka vehnäjauho |
| [Lang 1999](https://doi.org/10.1093/ajcn/69.6.1183) | Alkuperäisabstrakti; GI-haara n=6 ilman insuliinia; erillinen clamp n=5 | Maissitärkkelys 95 ± 18 SEM; mung 51 ± 13 | Valmistusmuoto ei selviä luettavasta abstraktista; ei arvausta raaka/kypsä/paistettu |
| [Kreft 2002](https://doi.org/10.3177/jnsv.48.47) | Kokoteksti; laboratoriomittaus, ei ihmisiä; 100 % tattarinuudeli, 6 min keitto | Hydrolyysi-indeksi 61; **ei GI** | In vitro -HI ei ole ihmisen GI; keitinveden tärkkelyshävikki ei ole tuntemattoman sobatuotteen kerroin |

Sugiyaman verkosta saatu PDF oli 16-sivuinen tilaus-/esikatselusivun tuloste,
ei alkuperäinen artikkeli. Sitä ei laskettu luetuksi kokotekstiksi. Hainin
tilastolliset ja koostumuksen raportointiristiriidat on kirjattu sellaisinaan,
ilman väitettä niiden syystä. **SEM:ää tai SD:tä ei käytetä reseptin GK:n min/max-rajana.**

## Nykyisten 83 GK-arvion automaattinen riskiseula

Kaikki 83 saivat automaattisen seulan; niille ei tehty uutta syvää resepti- tai
tutkimuskatselmointia eikä muutettu GK-arvoa. Regex-, avain- ja metatietoliput
ovat jatkokatselmoinnin priorisointia, eivät todettuja virheitä tai kliininen riski.
Valmistuslippu voi tunnistaa jo ilmoitetun analogian; lipun puuttuminen ei varmista
valmistuksen vastaavuutta. Päällekkäisiä luokkia ei summata reseptimääräksi.

| Signaali | Reseptit |
| --- | ---: |
| Matala luottamus | 83 |
| Ruokaryhmän keskiarvosidos | 68 |
| Merkittävä CHO-lähde epävarmalla GI-vastaavuudella | 68 |
| Valmistusavaimen tai kuvauksen poikkeamalippu | 47 |
| Pois jätetty CHO vähintään 1,5 g eli 75 % 2 g rajasta | 7 |
| Vähintään puolet tunnetusta CHO:sta pois jätetty | 13 |
| Näytetty GK 0, mutta poisjätettyä CHO:ta on | 9 |

Merkittävä ainesosa: vähintään 5 g CHO/annos tai vähintään 1 g ja 25 % tunnetusta
CHO:sta. Poisjätön osuus käyttää tunnettua CHO:ta; ylärajat voivat yliarvioida
osuuden. Mallin `omittedAvailableCarbohydratePerServingG` sisältää jo ylärajat:
niitä **ei lisätty siihen uudelleen**. Pisteytys on näkyvissä skriptissä.
Ensimmäiset jatkotarkistukset ovat vhh-kaalikääryleet, amritsari-kala,
kana-yakitori-kaalilla ja karjalanpaisti-vhh. Kaikki 83 ovat erillisessä järjestetyssä
taulukossa, jossa nykyinen GK näytetään vain auditoinnin lähtötietona.

## Todelliset julkaisuesteet

Kymmenen C/D-reseptin päällekkäiset esteet: määränäyttö 7, valmistusvaihtoehto
tai hävikki 5, reseptitekstin ristiriita 5, laskentarakenteen puute 3 ja
koostumuksen vastaavuus 3. Reseptikohtainen jatkotoimi on rekisterissä.

- **Lähteitä ei ole:** yhdessäkään tapauksessa ei todistettu, ettei lähdettä
  voisi olla olemassa. Puuttuva täsmäävä näyttö ei ole sama väite.
- **Lähde on olemassa, mutta lukeminen estyy:** Sugiyaman ja Langin kokotekstit;
  Finelin verkkolataus, jonka rinnalla hyväksytty paikallinen aineisto oli käytettävissä.
- **Määrä on epäselvä:** esimerkiksi pinaatin kpl, vuoan jauhot, korianteri,
  inkiväärin/sokerin lusikka ja msemenin nimeämätön neste.
- **Valmistus estää kokonaislaskelman:** marinadi, kaalin puristus, käyminen,
  keitinvesi, pinnoite, pandanin käyttö ja vaihtoehtoinen liemi. Arvoja ei keksitty.
- **Laskennan rakenne puuttuu:** soba ja bubur ilman täydellistä laskelmaa;
  baozin hiiva on vain poisjättöraja, ei täysi ravintoainerivi.
- **Koostumuksen vastaavuus puuttuu:** soban nuudeli/liemi, buburin tuotteet ja
  halloumileivän olennainen leipätyyppi. Nimettyjen keskimääräisten tuotteiden
  käyttö B-arviossa on näkyvä arvio-oletus, ei väite mitatusta tuotemerkistä.
- **Hyväksyntä-/esityskriteeri:** 14 B-arviota odottaa riippumatonta hyväksyntää
  ja mahdollista CARBOHYDRATE_ONLY-esitystapaa. Tämä ei ole tieteellisen lähteen
  puuttuminen. GK:ta ei voi johtaa pelkästä CHO:sta, eikä sen puute tarkoita pientä vastetta.

## Seuraava rajattu toteutus-PR

Riippumattoman lähdekatselmoinnin jälkeen perusteltu enintään **viiden reseptin
ravintoarvoerä** on tomaatti-kananmuna-wokki, Yangzhou-paistettu riisi,
kreikkalainen moussaka, serabi-kookospannukakku ja thai-kookosriisi-mangolla.
Kahden ensimmäisen soija-/öljykorjaus sekä kolmen jälkimmäisen kaneli-,
kookosmassa- ja fariinisokerikorjaus ovat yksilöityjä. Päivitä lähde- ja
annosmassaperustelut, laskentatiedostot, kaikki muuttuvat makrot ja vastaavat
olemassa olevat kieliversiot yhdessä; laske lähdehashit uudelleen ja tarkista
strict-laskenta sekä kieliversioiden numeerinen vastaavuus. Vahvista ennen
toteutusta main ja suhde edelleen keskeneräiseen R2:een.

Hyväksymisehto: katselmoija hyväksyy kunkin nimetyn raaka-aine-, viiteannos- ja
säilymisskenaarion. Erytritolin polyolimäärää koskevat reseptit ja kolme pidätettyä
R2-kokonaispäivitystä eivät kuulu tähän viiteen. GI-sidoksia, GK-arvoja tai
raja-arvoja ei tarvita tämän ravintoarvoerän toteuttamiseen. Muiden yhdeksän
B-arvion lähdetieto voi myöhemmin palvella erillistä hyväksyntä-/esitystyötä.
Tätä toteutusta tai R4:ää ei aloitettu tässä ajossa.

## Toistettavuus, tarkistukset ja muutosten rajat

57 lähdetiedoston hashit täsmäävät lähtö-mainiin: aktiiviset GK-syötteet,
sidokset, aliakset, GI-/koostumusrekisterit, mallit, 24 reseptiä ja 22 laskelmaa.
Tarkistin varmistaa kaikki 326 nykyistä GK-tulosta myös kokonaisuutena.
Sen lisäksi lähdetietueiden neljä makroa, Finelin/USDA:n annosmassat, AFCD:n
nestetiheydet, annokset, kaikki ainesosat, 24 erillistä tunnistetta, päätökset,
osasummien null-kokonaisarvot ja 83:n riskiseulan toisto tarkistetaan.

Paikalliset lähtöauditoinnit: strict nutrition PASS (0 varmennettua,
180 lähteistettyä arviota, 86 riittämätöntä, 60 puuttuvaa, 0 ristiriitatilaa),
GK PASS (326 / 83 / 243; 45 GI-tietuetta), kattavuusauditointi PASS
(0 uutta rakenne-, syöte- tai evidenssivirhettä). Auditoinnin PASS ei tarkoita
ravitsemustieteellistä hyväksyntää. GK-testit 86/86 ja ravintomallin testit 20/20 PASS.
Erillinen R3-tarkistin, JSON-/viitetarkistukset, Markdownlint ja diff tarkistetaan
lopulliselle aineistolle ennen commitia. GitHubin uuden Draft-PR:n Checks on
CI-tuloksen auktoriteetti; valmistunut tulos kirjataan ReportHubin tilannekuvaan.

Komennot `site`-hakemistosta:

```text
npm run content:sync
npm run audit:nutrition -- --strict
npm run audit:glycemic-load
npm run audit:glycemic-coverage -- --output-json docs/nutrition/tmp/gk-r3-coverage.json --output-markdown docs/nutrition/tmp/gk-r3-coverage.md
npm run test:nutrition
npm run test:glycemic
```

Luo tarvittaessa ohitettu `docs/nutrition/tmp/` ennen kattavuusauditointia.
Tarkista työhakemisto ja kirjoituskohteet ennen ajoa. Juuresta:

```text
python docs/nutrition/tools/gk_r3_verify.py
pwsh -File scripts/lint-markdown.ps1
git diff --check
```

R2:n teknisen toiston lisäkomento `site`-hakemistossa:

```text
npm exec -- tsx ../docs/nutrition/tools/gk-r3-r2-preflight.mts
```

Se lukee R2:n tarkan commitin Git-objektitietokannasta ja tulostaa tiiviin tuloksen;
tarvittavan commitin on oltava paikallisesti luettavissa. Se ei vaihda työhaaraa,
muuta tiedostoja, hae verkosta tai anna riippumatonta hyväksyntää.

Tämä PR lisää vain tutkimusdokumentteja ja lukevia tarkistimia. Aktiivisia
GK-tiedostoja, reseptejä, käännöksiä, julkaistuja ravintoarvoja, malleja,
testiodotuksia tai käyttöliittymää ei muuteta. Repo_guard hoitaa kirjoitukset,
commitin, pushin ja Draft-PR:n. R2-PR:t säilyvät; mitään PR:ää ei yhdistetä tai
siirretä Ready-tilaan eikä tuotantodeployta tehdä.

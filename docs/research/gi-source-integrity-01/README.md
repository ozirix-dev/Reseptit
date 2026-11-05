# GI-SOURCE-INTEGRITY-01 – LOPPURAPORTTI

2.11.2026. Repo `ozirix-dev/Reseptit`, lähtö-main
`583fdb91aeb12114f909412b9165fc3b02a6515d`.
**CONDITIONAL GO lähdeauditoinnin katselmointiin; ei julkaisupäätös.**
Valmisteluhetken raportti: Draftin lopullinen HEAD ja normaali CI varmennetaan
chatin loppuraportissa. Ei uutta GK80-ajoa, tuotantokoodin muutosta tai buildia.

## 1. Kookosmaidon kolmen GI-luvun alkuperä

| Luku | Todellinen tutkittu kohde | Menetelmä ja rajoitus | Tölkkikookosmaidon ainesosa-GI? |
|---|---|---|---|
| 31 ± 5 | Riisi-kookosmaitopuuro, Senadheera & Ekanayake | Ihmisvasteesta johdettu sekaruokatulos; täydellinen menetelmä ei saatavilla | Ei |
| 68 | Pure Harvest Coco Quench, kookosmaitoa ja ruskeaa riisiä sisältävä juoma | Sydneyn tietokanta: 10 tervettä osallistujaa, 2 h, testi2020, julkaisemattomat havainnot | Ei |
| 96,82 ± 5,05 | Alpro Coconut Original -kasvijuoma, Jeske ym. | In vitro -entsyymihajotus ja malliyhtälö; ei ihmisillä mitattu GI | Ei |

GI31:n alkuperäinen tiivistelmä kuvaa puurokontrolleja, ei erillistä tölkkimaitoa.
Vanha osallistujamäärä10 jää varmennukseltaan vanhan kortin tiedoksi; sitä ei
vahvistettu saatavilla olevasta tiivistelmästä. Päärekisterin nykyinen
`REFERENCE_ONLY` säilyy. [Alkuperäinen julkaisu, PMID22849311](https://pubmed.ncbi.nlm.nih.gov/22849311/).

GI68:n rivillä hiilihydraattimäärä25g ja GL17 eivät ole tuotteen250ml
annoksen mittaus: annoskokosarake on tyhjä. Rivi ei yksin vahvista alkuperäistä
referenssiprotokollaa tai ISO-yhteensopivuutta. Valmistajan nykyinen juoma
sisältää vettä, kookosmaitoa20%, ruskeaa riisiä ja suolaa; hiilihydraattia7,8g
ja rasvaa2,72g/100ml. Nykyisen etiketin vastaavuutta testivuoden2020 versioon
ei ole osoitettu. [Sydneyn GI Search](https://glycemicindex.com/gi-search/),
[valmistajan tuotesivu](https://pureharvest.com.au/product/coco-quench-original/).

Jesken tutkimuksessa kasvijuomaa hajotettiin entsyymeillä ja sokeriprofiili
syötettiin malliyhtälöön. Taulukon96,82 ei ole ihmis-GI, eikä laboratorion
hajontaluku ihmisvasteen SEM. Tutkitun Alpro-juoman rasva oli0,84g/100g,
mikäkin erottaa sen rasvaisesta tölkkikookosmaidosta. Historiallisen
ainesosaluettelon supplementtilinkki jäi selainhaasteen taakse; tarkkaa
koostumusta ei keksitty nykyisen etiketin perusteella.
[Alkuperäinen tutkimus, DOI10.1007/s11130-016-0583-0](https://pmc.ncbi.nlm.nih.gov/articles/PMC5325842/).

Välillisen tulkinnan esimerkkinä FoodStructin sivu liittää96,82:n yleiseen
kookosmaidon nimeen ja viittaa Jeskeen,31:n kohdalla puurotutkimukseen.
Tämä jäljittää tulkintaketjun; sivua ei käytetä tieteellisenä GI-lähteenä.
[Tarkistettu välillinen viittaus](https://foodstruct.com/food/coconut-milk/glycemic-index).

## 2. Seitsemän eri tuotemuotoa pidetään erillään

[Tuoteidentiteetit ja nykyiset AFCD-koostumuskortit](coconut-identities.json)
erottavat rasvaisen tölkkimaidon, kevyen tölkkimaidon, kookoskasvijuoman,
kookos-riisijuoman, kookosveden, kookoslihan sekä kookosta sisältävät sekaruoat.
Esimerkiksi AFCD F002991 on regular-fat canned, F002990 reduced-fat canned;
F009812/F009813 ovat juomia ja F002983 tuoretta kypsää kookoslihaa.
Kuivatut hiutaleet eivät ole tuoretta lihaa. Näitä ei yhdistetä nimen perusteella.

Sydneyn erillinen kookosvesi55 koskee Nudie-tuotetta (9 tervettä,2h,testi2012),
ei kookosmaitoa tai lihaa. Senkin täydellinen alkuperäisprotokolla puuttuu
tietokantariviltä. Yhtään tässä tarkistetuista ihmis- tai in vitro -arvoista
ei hyväksytty tavallisen rasvaisen tai kevyen tölkkimaidon GI:ksi.

## 3. Nykyiset reseptit ja laskentakäytöt

41/326 reseptissä on kookospohjainen ainesosa, mukaan lukien öljy ja hiutaleet.
35 reseptissä on maito-/juoma-/vesiniminen ainesosa. Niistä kuudella on
julkaistu GK ja kookosmaidolle rajattu GI50-oletus; loput29 ovat GK-HOLDissa.
Lisäksi tuoretta kookoslihaa käyttävä papaijajogurtti ja hiutaleita käyttävä
mango-limejogurtti ovat numeerisia. Koko tunnistejoukko ja kaikki nykyiset
ainesosarivit ovat [kookosinventaariossa](coconut-recipes.json).
Kaikkia reseptejä ei luettu uudelleen käsin.

| Julkaistu resepti-ID | Kookososuuden A g/annos | GI-oletus | Osuus GK:hon |
|---|---:|---|---:|
| `moo-ping-vhh` | 0,425 | lowcho50-r6 | 0,2125 |
| `indonesialainen-nasi-uduk-aamiaisella` | 1,7 | lowcho50-r4 | 0,85 |
| `karibia-kookosriisi-pavuilla` | 1,564 | lowcho50-r4 | 0,782 |
| `karibia-maissipuuro-kookoksella` | 1,564 | lowcho50-r4 | 0,782 |
| `malesialainen-nasi-lemak-aamiaisella` | 1,564 | lowcho50-v2, molemmat riisiskenaariot | 0,782 |
| `thai-kookosriisi-mangolla` | 1,564 | lowcho50-r5 | 0,782 |
| `thai-papaijajogurtti`, tuore kookosliha | 0,2475 | lowcho50-r4 | 0,12375 |

Mango-limejogurtin hiutaleosuus on0,64g A/annos ja GI puuttuu. Nykyinen
malli käsittelee sen nimetyllä yksittäisen alle1g ja yhteensä alle2g
hiilihydraatin toimituksellisella poisjättötoleranssilla. Se ei ole mitattu
GI, nollavaikutus tai kliininen virheraja.

## 4. Lowcho50:n merkitys, rajat ja sidonnat

Lowcho50 on **projektin GI-laskentaoletus**, ei kookosmaidon mitattu GI.
Nykyiset kortit ovat `PUBLISHED_IMPUTATION`, tekstissä kuvataan oletus ja
`classifyGk80Source` erottaa sen mittauksesta. Lähteenä käytetyn julkaistun
oletuksen enintään5g A/100g -toimintaraja ja nimetyt sovellukset ovat projektin
omaa tulkintaa, eivät kokeellisesti validoitu raja.

Katalogi sitoo koostumus-ID:n ja tarkan inputForm-tekstin sallittuun
source-ID:hen. Mahdollinen lähteen `allowedCompositionIds` tarkistetaan
lisäksi. Yleinen lowcho-raja on enintään5g A/100g, ei yleinen annoskohtainen
polyoliohitus. Minor-mausteiden erilliset0,5g A/ainesosa ja1g A/annos
-säännöt eivät ole kookosmaidon yleinen sallinta. Ehdokasmalli tarkistaa myös
imputoidun GK-osuuden oman1 GK-yksikön ehdon; se ei ole biologinen epävarmuusraja.

Seitsemän aktiivisen julkaisupaketin lowcho50-käyttöjä on72 skenaarioriviä
44 eri reseptissä. [Täsmälliset resepti-, lähde-, koostumus- ja syötesidonnat](lowcho-applications.json)
säilytettiin. Puuttuvaa vanhan manifestin `ownerApproved`-kenttää ei tulkittu
uudeksi hyväksynnäksi; nykyinen julkaisurekisteri ja aiemmat rajatut päätökset
säilyvät. Kookosmaidon nykyiset lähdemuodot eivät yhdisty juomien, veden tai
kookoslihan GI31/68/96,82-arvoihin. GI50:tä ei poistettu tai korvattu globaalisti.

## 5. Todettu lähdesidontavirhe: kaksi nykyistä HOLD-reseptiä

Vanha `glycemic-load-pilot-input.json` sitoo kookosmaidon kahdessa reseptissä
Fineli684:n **lehmän kevytmaitoon** ja dairy-category-GI35:een.
`kookos-lime-kanacurry` sisältää reseptissä400ml ja `sate-ayam`200ml;
pilot-syöte väittää400g/200g ja käyttää maidon koostumusta/massaperustetta.
Tämä on väärä identiteetti ja dokumentoimaton tilavuussovellus.

Lukitussa raportissa virheelliset ainesosaosuudet ovat vastaavasti4,8/2,4g A
ja1,68/0,84 GK. Ne ovat virheellisiä osasummia, eivät kokonaisen reseptin
GK-arvoja. Molemmat reseptit ovat jo `INSUFFICIENT SOURCE DATA`, koko GK null.
133 julkaistun GK:n joukossa niitä ei ole.

Näiden reseptien neljän makron laskentapaketissa käytetään erillistä
AFCD-kookosmaitokorttia, ei Fineli684:ää. Tässä ei siis todettu samaa
sidontavirhettä julkaistuun makropakettiin eikä validoitu sitä uudelleen.

[P1-päätösaineisto](p1-decision.json) sisältää lähdehashit, molemmat ID:t,
vanhat syötteet ja **soveltamattoman** täsmäpatch-ehdotuksen. Se poistaisi
virheelliset massa-/koostumus-/GI-sidonnat, säilyttäisi HOLDin ja vaatisi uuden
täsmällisen lähderatkaisun ennen mitään numeroa. Ei automaattista GI50:n,
GI31:n, GI68:n tai96,82:n korvausta. Vanhoja hyväksyntähasheja ei muutettu.

## 6. Vaikutus nykyiseen GK-laskentaan

[Decimalilla tarkistetut nykyiset kookososuudet](coconut-impact.json)
sisältävät koostumus- ja GI-evidenssihashit sekä annoskohtaiset kontribuutiot.
Tässä ei tehty uutta koko GK-laskentaa. Eri tuotteiden31/68/96,82-lukuja ei
käytetty tölkkimaidon vaihtoehtoskenaarioiksi, stressiväliksi tai luokkarajaksi.

Julkaistut pisteet, näyttöarvot ja luokat muuttuvat **0 reseptillä**:
tuotantoaineisto on muuttumaton. Nasi-lemakin nykyinen22,3745–26,4445-väli
on jo hyväksyttyjen riisiskenaarioiden väli; kookosmaidon osuus on molemmissa
sama. Se ei ole kookosmaidon GI- tai biologinen epävarmuusväli.

Fineli29014:n aiemmassa yöajossa havaittu kuituarvoero on koostumuksen
versio-ongelma. Se ei todista mitään GI31/68/96,82:n soveltuvuudesta eikä tässä
johtanut profiilin vaihtamiseen.

## 7. Rajattu koko aktiivisen GI-aineiston seulonta

Koneellisesti luettiin45 päärekisterin korttia,64 seitsemän aktiivisen
julkaisupaketin lähdekorttiosumaa ja13 kolmen julkaistun C-tapauksen korttia:
**122 korttiosumaa**, ei122 eri tutkimusta. Kohderiskiperheisiin osui36
korttia. Tekstimerkintöihin perustuvassa seulassa ei löytynyt nykyisistä
korteista in vitro / PMC5325842 / Jesken DOI -käyttöä. Merkkijonoseula ei
todista kaikkien tutkimusten menetelmiä oikeiksi.

Lisäksi aiemman tutkimuspinojen lähteet ja PR168:n Kaya-päätös tarkistettiin
read-only, commit/hash sidottuna. [Tutkimuspinon lähdeseula](research-source-screen.json).
Tämä ei hyväksy vanhoja tutkimuseriä eikä yhdistä niitä tuotantoon.

[Kaikki aktiiviset korttiosumat](all-source-index.json) ja
[riskiperheiden seulonta](high-risk-screen.json) erottavat metodin,
soveltuvuuden ja käyttöluvan. Puuttuva koneellinen ISO-lippu ei ole todiste
huonosta tutkimuksesta; se on tarkistettava metatietoraja. Riisi, puurot,
mantelijauho, leipä/jauhot, kaura sekä maito/kasvijuomat huomioitiin.

## 8. Enintään viisi yksityiskohtaisen katselmoinnin kohdetta

| Järjestys | Ongelma tai riski | Todellinen vaikutus ja päätös |
|---|---|---|
| 1 | Kookosmaidon väärä kevytmaito-/dairy35-sidonta | Todettu virhe kahdessa HOLDissa, väärät1,68/0,84-osuudet; P1-täsmäkorjausehdotus |
| 2 | Lähteen mittausmenetelmä puuttuu yhteisestä sopimuksesta | Julkaistu/LOW ei estä teoreettista in vitro -kortin syöttämistä; uutta tällaista tuotantokäyttöä ei löytynyt. Ehdotettu admission-portti |
| 3 | Riisijyvä / 40min puuro / jauho ja kuuma vs jäähdytetty | Suurten A-osuuksien vuoksi korkea mahdollinen GK-vaikutus. Nykyiset grain/congee-aliasrajat ja valmistuskuvaukset ovat erilliset; ei uutta osoitettua numerovirhettä |
| 4 | Kayan leipä-GI54:n väärä valmistusselite | Yöajossa jo todettu rivien226/227 sekoittuminen; vanha20,29–27,32-skenaario ei ole hyväksyntävalmis. HOLD säilyy |
| 5 | Mantelijauho vs kokonainen manteli/leipomotuote | Nykyinen erillinen jauhosuoja ja5g-raja säilyvät; AFCD-jauhon A5,4 ei täytä lowcho-ehtoa. Ei uutta lähdehakua tai vapautusta |

Kohteet1/2 ovat välittömät tiedonhallinnan korjauskohteet. Riisin mahdollinen
vaikutus on suurempi kuin pienten mausteosuuksien, mutta ilman osoitettua
väärää sovellusta sille ei keksitä korjausnumeroa. Kayan historiallista
skenaariota ei rinnasteta tuotantovirheeseen. Kaura-/maitokorteissa olevat
valmistus- ja analogiarajaukset säilyvät; puuttuva metadatalippu ei aiheuttanut
massaperuutusta. Tämä taulukko ei väitä kaikkia viittä uudeksi löydökseksi.

## 9. Ehdotettu yhteinen luokittelumalli

[Luokittelusopimus](contract.md) ja [viisi esimerkkiluokitusta](source-classifications.json)
erottavat mittauksen, testatun ruoan, analogian/proxyn/oletuksen ja käyttöluvan.
Pienin laajennus on hashilla alkuperäiseen sidottu metatietokortti, ei vanhojen
korttien massamuokkaus. `HUMAN_MEASURED_METHOD_UNCONFIRMED` ei saa muuttua
vahvistetuksi ihmismittaukseksi vain julkaisun perusteella. In vitro säilyy
in vitro -arviona kaikissa tapauksissa.

Uusi [admission-prototyyppi](admission.py) hylkää ristiriitaiset lähde- ja
tuote-/valmistussidonnat. Se on auditoinnin apuväline, **ei tuotantoon kytketty
suoja**. Tieteellinen ja omistajan hyväksyntä sekä todellisen päätösrekisterin
kytkentä vaativat erillisen päätöksen. Nykyisiä hyväksyttyjä sovelluksia ei
uudelleenluokiteltu tai hyväksytty käyttäjän puolesta.

## 10. Toteutus ja tarkistukset

Vain tämän `docs/research/gi-source-integrity-01`-hakemiston tiedostoja lisättiin.
Ei muutoksia runtimeen, GI-/koostumuskatalogeihin, resepteihin, neljän makron
logiikkaan, batch87/88:aan tai C-tapausten soveltamisalaan. PR168 ja muut
vanhat PR:t sekä ReportHub jäivät koskematta.

Paketin oma `verify.py` tarkistaa lähdehashit, alkuperäisiin committeihin
sidotut syötteet,122 korttia,35 kookosmaitotapausta, nykyiset imputaatiot,
326 tuloksen lukitun lähtöraportin ja14 merkityksellistä match-fixtureä.
Fixturet ovat synteettisiä, eivät uusia elintarvikemittauksia tai hyväksyntöjä.

Paikallisia buildeja0, uusia koko GK-laskentoja0, selaimen sivustokierroksia0,
manuaalisia Actions-ajoja0. Yksi normaali docs-only-PR-CI; lopullinen tulos
chatin loppuraportissa. Verifier on paikallinen tutkimustarkistus, eikä sitä
väitetä normaalin CI:n automaattisesti ajamaksi uudeksi tuotantotestiksi.

## 11. Turvallinen hyväksyntäraja

Auditoinnin lähde-erottelu ja kahden HOLD-sidonnan P1-korjausraja ovat
katselmoitavissa. Mitään yleistä tölkkimaidon GI:tä ei hyväksytä. GI31 jää
viitetiedoksi;68 ja96,82 eivät siirry tölkkimaidolle. Kevyt maito, kasvijuoma,
vesi ja liha tarvitsevat oman identiteettinsä. Kayan ja muiden lähde-HOLDien
tila säilyy. Julkaistu kattavuus on edelleen **133/326 (40,80%)**.

## 12. Yksi tärkein seuraava omistajapäätös

**Hyväksytäänkö kahden nimetyn HOLD-reseptin väärän kevytmaito-/dairy35-
sidonnan poistaminen rajattuun tekniseen korjaus-Draftiin, säilyttäen HOLDit,
133 julkaistua GK-arvoa ja nykyiset makropaketit?**

Ei reseptien lähde-/menetelmävapautusta, Readyä, mergeä tai deployta.

## Liite: kaikki 35 maito-/juoma-/vesinimistä kookostapausta

Taulukko generoidaan koneellisesta inventaariosta. Vanhat HOLD-syötteet voivat
olla osittaisia; puuttuva rivi ei ole puuttuvan ainesosan nollatulos.

<!-- COCONUT_RECIPE_TABLE -->

| Resepti-ID | Nykyinen tila | Kookosmaidon nykyinen GI-sidonta |
|---|---|---|
| `jerk-kana` | HOLD | Ei täydellistä GK-lähdesidontaa |
| `keltainen-kanacurry-vhh` | HOLD | GI puuttuu |
| `kerala-kalacurry` | HOLD | GI puuttuu |
| `khao-soi-vhh-konjac` | HOLD | GI puuttuu |
| `kookos-lime-kanacurry` | HOLD | dairy-category-mean-gi-35; VÄÄRÄ SIDONTA, P1 |
| `massaman-curry-kanalla-vhh` | HOLD | GI puuttuu |
| `moo-ping-vhh` | Julkaistu GK | lowcho50-r6 |
| `nasi-lemak` | HOLD | GI puuttuu |
| `panang-curry-kanalla-vhh` | HOLD | asian-regional-category-mean-gi-60 |
| `punainen-kanacurry-vhh` | HOLD | asian-regional-category-mean-gi-60 |
| `rendang-padang` | HOLD | GI puuttuu |
| `sate-ayam` | HOLD | dairy-category-mean-gi-35; VÄÄRÄ SIDONTA, P1 |
| `thai-vihrea-curry-kanalla-vhh` | HOLD | asian-regional-category-mean-gi-60 |
| `tom-kha-gai-vhh` | HOLD | GI puuttuu |
| `indonesialainen-bubur-sumsum` | HOLD | GI puuttuu |
| `indonesialainen-lontong-sayur-aamiaiseksi` | HOLD | GI puuttuu |
| `indonesialainen-nasi-uduk-aamiaisella` | Julkaistu GK | lowcho50-r4 |
| `indonesialainen-serabi-kookospannukakku` | HOLD | GI puuttuu |
| `japanilainen-kabocha-puuro` | HOLD | GI puuttuu |
| `kaakao-kookos-chia` | HOLD | GI puuttuu |
| `karibia-bammy-kassavaleipa` | HOLD | GI puuttuu |
| `karibia-kookosriisi-pavuilla` | Julkaistu GK | lowcho50-r4 |
| `karibia-maissipuuro-kookoksella` | Julkaistu GK | lowcho50-r4 |
| `malesialainen-kaya-paahtoleipa` | HOLD | Ei täydellistä GK-lähdesidontaa |
| `malesialainen-kookos-banaanikulho` | HOLD | Ei täydellistä GK-lähdesidontaa |
| `malesialainen-kuih-seri-muka` | HOLD | GI puuttuu |
| `malesialainen-laksa-lemak-aamiaiseksi` | HOLD | GI puuttuu |
| `malesialainen-nasi-lemak-aamiaisella` | Julkaistu GK | lowcho50-v2 |
| `malesialainen-roti-canai-dhalilla` | HOLD | GI puuttuu |
| `malesialainen-roti-jala-currykanalla` | HOLD | GI puuttuu |
| `thai-kananmunat-kookoscurryssa` | HOLD | GI puuttuu |
| `thai-kookosriisi-mangolla` | Julkaistu GK | lowcho50-r5 |
| `thai-roti-munalla-banaanilla` | HOLD | GI puuttuu |
| `vietnamilainen-banh-xeo-aamiaisletut` | HOLD | GI puuttuu |
| `vietnamilainen-papaija-kookospuuro` | HOLD | GI puuttuu |

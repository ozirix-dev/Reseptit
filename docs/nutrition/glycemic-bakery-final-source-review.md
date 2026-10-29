# AJO 1.9 – leipomotuotteiden GI 58 -lähteen loppukatselmointi

Päätös 29.10.2026: **REFERENCE_ONLY**. Kaikki jäljellä olleet 45 sidontaa
41 reseptissä on tarkistettu. Yksikään sidottu ainesosa ei vastaa lähteen
mitattua valmista leipomotuotetta. 12 julkaistua GK-arvoa palautuu nulliksi;
ehdotettu kattavuus on **85/326 (26,1 %)**, keskeneräisiä 241.
Tämä on lähdelaadun korjaus. AJO 2.0:n palautuksia ei tehdä tässä PR:ssä.

## Julkaistu lähtötilanne ja jäljitettävyys

[PR #128](https://github.com/ozirix-dev/Reseptit/pull/128) yhdistettiin normaalilla
merge-commitilla `7f215f47991fb19e4073cbe52645b5e6513b42ba` hyväksytystä HEADista
`67311980c2db767931b146e41c626ce839b47c85`.
[Main-CI ja Pages](https://github.com/ozirix-dev/Reseptit/actions/runs/40803773787)
onnistuivat: build, GK-auditointi, 152 yksikkötestiä GI/GK-testeineen ja deploy.
GitHubista tarkistettiin ajantasainen HEAD, review-ketjut ja mergeability;
haara ei ollut suojattu eikä pakollisia hyväksyntöjä ohitettu.
Tuotanto-HTML:n kaikki 326 GK-tekstiä täsmäsivät hyväksyttyyn buildiin:
**97 laskettua / 229 keskeneräistä / 29,8 %**. Tarkistus 29.10.2026 02:05 UTC,
HTML SHA-256 `76de341a364bfbcaea35f6ca165e315f06144c8145db7afedd208057eb90347f`.

Uusi erillinen työpuu luotiin tästä mainista. Origin ja repo_guard PASS:
`ozirix-dev/Reseptit`; Ravinto ei ole tämän työn kohde. Aktiiviset työpuut ja
avoimet PR:t tarkistettiin, eikä päällekkäistä GI 58 -muutosta löytynyt.
Kaikki seurattujen tiedostojen kirjoitukset, commitit, push ja Draft-PR kulkevat
repo_guardin kautta. Testien tulosteet pysyvät tämän työpuun `site`/`tmp`
-hakemistoissa; nykyinventaarioiden neljä raporttia kirjoitetaan ensin
väliaikaishakemistoon ja tuodaan guardin kautta. Guard ei sandboxaa testejä.

[Jäädytetty 97/326-baseline](glycemic-bakery-final-source-baseline.json) sisältää
julkaistun lähdecommitin, kaikkien tulosten SHA-256:t ja syöte-/lähdefingerprintit.
[Koneellinen katselmointi](glycemic-bakery-final-source-review.json) sisältää
kaikki 326 vertailua, kaikki 45 sidontaa, 41 reseptin ennen/jälkeen-tulokset,
12 reseptin kaikki GI-rivit ja poisjätöt sekä kuuden ehdokkaan read-only-seulan.
Reseptien aineksia, määriä, annoksia tai valmistusohjeita ei muuteta.

## Lähdeketju ja globaali päätös

[Atkinson ym. 2021, taulukko 1](https://doi.org/10.1093/ajcn/nqab233) raportoi
Bakery products -ryhmän 72 tuotteen keskiarvon **58**, SD 16, glukoosiasteikolla.
Leivät (214 tuotetta, keskiarvo 64) ovat eri ryhmä. Kyse ei ole kuivan jauhon
GI 58 -ihmiskokeesta eikä yhdestä testatusta valmistusmenetelmästä.
Numeron oikeellisuus lähteessä ei osoita soveltuvuutta näihin ainesosiin.

Kaikki 45 aktiivista riviä ovat raaka-aineita: vehnäjauhoa, mannasuurimoa,
riisi-/maissijauhoa, maissitärkkelystä, kaurahiutaleita, couscousia, bulguria,
raakaa filotaikinaa, vehnänuudeleita tai kaakaota. Dim sum -reseptissä on myös
valmis bao, mutta sen GI 58 -sidonta on maissitärkkelyksellä, ei baolla.
Spanakopitan sidonta on raa’alla filotaikinalla, ei valmiilla piirakalla.
Reseptin paistaminen leiväksi ei muuta sen jauhoriviä tutkimuksessa testatuksi
kokonaiseksi tuotteeksi. Näin ollen tietueella ei ole osoitettua hyväksyttävää
ainesosakäyttöä. GI 58, DOI, taulukko, ruokaryhmäavaimet ja historiallinen
lähdeluokka säilyvät; laskentakelpoisuus muuttuu ja virheellinen analogiateksti
korjataan. Muut GI 58 -tietueet, kuten sugars/syrups, ovat eri lähteitä.

### Täsmällisempien ihmisnäyttöjen arvio

- [Mani ym. 1992](https://doi.org/10.1079/BJN19920102): 30 tyypin 2 diabetesta
  sairastavaa jaettiin viiteen kuuden henkilön ryhmään. Vertailu 50 g glukoosia;
  verinäytteet paastossa sekä 1 ja 2 tunnin kohdalla. R1:n semolina 67 g
  höyrygelatinoitiin, R5 paahdettiin 105 °C:ssa ja gelatinointi vedellä;
  molemmissa 400 ml vettä, 20 min kypsennys ja 5 g maapähkinäöljyä.
  R1 GI 55 ± 9 SE ja R5 76 ± 6 SE ovat eri valmistusten ateriatuloksia,
  eivät yleisiä kuivan mannasuurimon arvoja. Baghrir, msemen ja harcha
  paistetaan pannulla olennaisesti erilaisina taikinoina. Myös palkokasveja
  sisältävät 8 h fermentoidut koeateriat ovat eri tuotteita. Tutkimuksen
  n=30 ei tarkoita 30 havaintoa jokaiselle ruokalajille; nykyistä ISO-menetelmää
  ei vahvisteta tällä vanhalla kahden jälkinäytteen kokeella.
- [Yang ym. 2006](https://doi.org/10.3748/wjg.v12.i21.3430): glukoosivertailtuja
  valmistettuja viljatuotteita terveillä tutkittavilla. Vehnälettu 79,6,
  uppopaistettu taikina 74,9 ja täytetty höyrypulla 39,1 ovat eri testiruokia.
  Niitä ei siirretä jauhon GI:ksi samosaan, gulab jamuniin, johnny cakeen,
  kevätsipulipannukakkuun tai kananmunalla täytettyyn baoon. Täytteen, rasvan,
  taikinan ja valmistuksen vastaavuutta ei ole osoitettu. Alkuperäisessä
  lähteessä on myös perunamittauksia; tämän PR:n vanhoja perunasidontoja ei
  vaihdeta eikä sertifioida uudelleen.
- [Khaliq ym. 2026, verkossa 2025](https://pubmed.ncbi.nlm.nih.gov/40586370/):
  50 pakistanilaista viljatuotetta, vähintään 10 tervettä osallistujaa/tuote,
  50 g imeytyvää HH:ta, glukoosi ja valkoinen leipä vertailuina. Alkuperäinen
  abstrakti tarkistettu; kustantajan kokoteksti ei avautunut. Sydneyn
  hakemiston paratha-/samosa-osumia ei hyväksytä ilman alkuperäisen tuotteen
  koostumusta ja valmistusta. Valmistetun tuotteen arvo ei muutenkaan ole
  kuivan vehnäjauhon itsenäinen arvo.
- [Farhat ym. 2010](https://doi.org/10.3923/ajcn.2010.48.57): 12 tervettä naista,
  glukoosivertailu ja kahden tunnin vaste valmistetuille libanonilaisille
  seka-aterioille. Tutkittu pizza ja kakku ovat kokonaisia eri koostumuksen
  tuotteita; eivät margheritan tai appelsiinikakun jauhorivin mittauksia.
- [Hassan ym. 2010](https://pubmed.ncbi.nlm.nih.gov/20141487/): 19 vapaaehtoista,
  glukoosi ja valkoinen leipä vertailuina, mm. zaatar-fatayer. Tämä on valmis
  täytetty tuote eikä manakishin jauhon lähde.
- [Mansouri ym. 2025](https://doi.org/10.1515/jisys-2024-0122) sisältää
  marokkolaisia ruokanimikkeitä ja GI-arvioita, mutta työn aihe on
  kuva-aineiston tunnistus ja GI:n estimointi. Baghrir-/harcha-nimen osuma
  ei ole osoitus kyseisen reseptin kontrolloidusta ihmisillä tehdystä kokeesta.

Hakupäivä 29.10.2026. Hakureitteinä käytettiin reseptinimiä sekä termejä
semolina/steamed/roasted/fermented, wheat flour/pancake/steamed bun ja
bakery category mean. Näyttö arvioitiin erikseen jokaiselle 12 reseptille. [Sydneyn GI-haku](https://glycemicindex.com/gi-search/)
toimi alkuperäislähteiden paikantajana. Julkaisemattomia kaupallisia
pizza-/paratha-tuotetestejä, verkkosivujen irrallisia lukuja, patenttiesimerkkejä,
in vitro -arvoja tai pelkkiä hakutulosten GI-lukuja ei otettu laskentalähteiksi.
**Täsmällisempää hyväksyttävää sidontaa ei tässä katselmoinnissa varmennettu**;
tämä ei ole väite, ettei mitään muuta tutkimusta voisi olla olemassa.

## Kaikki 45 sidontaa

Rivinumero on JSON-syötteen nollasta alkava indeksi. Taulukon grammamäärät ovat
vanhoja syötemääriä, eivät kaikkien keskeneräisten reseptien uudelleen hyväksyttyjä
muunnoksia. Alkuperäinen aineslista ja tarkka ravintotietue säilyvät JSON:ssa.
Jokaisen rivin päätös on poistaa GI 58 -sidonta; ei uusia massoja tai GI-arvoja.

| Resepti : rivi | Aines ja syötemassa g | Todellinen valmistus / tuotemuoto |
| --- | --- | --- |
| chole-bhature : 2 | vehnäjauhoja, 350 | Vehnäjauho on jogurttitaikinassa; lepo 30 min, uppopaisto 180 °C. Kikhernecurry on erillinen osa. |
| gulab-jamun : 1 | vehnäjauhoja, 50 | Vehnäjauho maitojauhepalloissa; uppopaisto 6–8 min ja sokeriliotus vähintään 30 min. |
| samosa : 0 | vehnäjauhoja, 300 | Vehnäjauho täytetyn taikinakuoren raaka-aine; lepo 30 min, uppopaisto 170 °C 6–8 min. Täytteessä keitettyä perunaa ja hernettä. |
| aloo-paratha : 0 | vehnäjauhoja, 300 | Vehnäjauhotaikina lepää 20 min; keitetty peruna muussataan täytteeksi, leivät paistetaan gheessä pannulla. |
| pani-puri : 0 | mannasuurimoita, 150 | Mannasuurimo 150 g ja vehnäjauho 2 rkl (syötteessä 20 g); lepo 20 min, ohuet kuoret uppopaistetaan 180 °C ja täytetään. |
| pani-puri : 1 | vehnäjauhoja, 20 | Mannasuurimo 150 g ja vehnäjauho 2 rkl (syötteessä 20 g); lepo 20 min, ohuet kuoret uppopaistetaan 180 °C ja täytetään. |
| pizza-margherita : 0 | vehnäjauhoja, 300 | Vehnäjauho hiivataikinassa; vaivaus 8 min, kohotus 1 h, täytteineen uuni vähintään 250 °C 7–10 min. |
| meheva-suklaakakku : 4 | vehnäjauhoja, 120 | Vehnäjauho ja kaakao ovat kaksi erillistä ainesosaa suklaakakkutaikinassa; 175 °C 25–30 min. Kaakao ei ole viljajauhoa. |
| meheva-suklaakakku : 5 | kaakaojauhetta, 30 | Vehnäjauho ja kaakao ovat kaksi erillistä ainesosaa suklaakakkutaikinassa; 175 °C 25–30 min. Kaakao ei ole viljajauhoa. |
| baozi : 0 | vehnäjauhoja, 400 | Vehnäjauho hiivataikinassa; kohotus 45 + 15 min, täytetyt nyytit höyrytetään 12–15 min. |
| marokkolainen-couscous : 1 | couscousia, 250 | Kuiva couscous 250 g valmistetaan pakkauksen mukaan; tarjoillaan kanan ja kasvisten kanssa. Ei leipomotuote. |
| kreikkalainen-moussaka : 8 | vehnäjauhoja, 60 | Vehnäjauho 60 g béchamel-suurusteessa; kastike kiehautetaan ja vuoka paistetaan 190 °C 35 min. |
| spanakopita : 5 | filotaikinaa, 160 | Raaka filotaikina 160 g kerrostetaan öljyn ja pinaatti-fetatäytteen kanssa; 190 °C 35–40 min. Ravintorivi ei kuvaa valmista piirakkaa. |
| tabbouleh : 0 | hienoa bulguria, 50 | Kuiva hieno bulgur 50 g liotetaan lämpimässä vedessä 15 min, valutetaan ja puristetaan; salaatti jäähdytetään. Ei leivontaa. |
| hapanimela-porsas : 2 | maissitärkkelystä, 21 | Maissitärkkelys 3 rkl (21 g syöte) kananmunakuorrutteessa, liha pannulla ja kastikkeessa kiehautus. |
| intialainen-rava-uttapam : 0 | mannasuurimo, 100 | Mannasuurimo-jogurttitaikina, 10 min lepo ja kasvispäällysteinen pannulettu; ei palkokasvia eikä 8 h fermentointia. |
| dim-sum : 5 | maissitärkkelystä, 7 | GI 58 -rivi on vain maissitärkkelys 1 rkl (7 g) nyyttitäytteessä; höyrytys 8–10 min. Reseptin erilliset valmiit bao-sämpylät eivät käytä tätä sidontaa. |
| lanzhou-naudanliha-nuudelikeitto : 7 | vehnänuudeleita, 350 | Vehnänuudelit 350 g keitetään pakkauksen mukaan ja tarjotaan naudanlihaliemessä; ei leipomotuote. |
| roujiamo : 8 | vehnäjauhoja, 300 | Vehnäjauho hiivaleivässä; kohotus 45 min, kuiva pannu 4–5 min/puoli, haudutettu porsastäyte. |
| intialainen-mannasuurimoupma : 0 | mannasuurimo, 100 | Mannasuurimo 100 g keitetään 300 ml vedessä puuroksi herneiden ja kasvisten kanssa. Resepti ei määritä 105 °C esipaahtoa. |
| pohjoisafrikkalainen-baghrir : 0 | mannasuurimo, 100 | Mannasuurimo 100 g + vehnäjauho 100 g, hiiva ja vesi 150 ml; lepo 10 min, pannulla huokoiseksi. Ohjeessa sekä kääntö että yhden puolen paisto: menetelmä ei ole täysin yksiselitteinen. |
| pohjoisafrikkalainen-baghrir : 1 | vehnäjauho, 100 | Mannasuurimo 100 g + vehnäjauho 100 g, hiiva ja vesi 150 ml; lepo 10 min, pannulla huokoiseksi. Ohjeessa sekä kääntö että yhden puolen paisto: menetelmä ei ole täysin yksiselitteinen. |
| pohjoisafrikkalainen-msemen-hunajalla : 0 | mannasuurimo, 100 | Mannasuurimo 100 g + vehnäjauho 100 g; lepo 10 min, öljyllä kerrostus ja pannupaisto. Ohje mainitsee veden ilman ainesmäärää. |
| pohjoisafrikkalainen-msemen-hunajalla : 1 | vehnäjauho, 100 | Mannasuurimo 100 g + vehnäjauho 100 g; lepo 10 min, öljyllä kerrostus ja pannupaisto. Ohje mainitsee veden ilman ainesmäärää. |
| malesialainen-roti-canai-dhalilla : 0 | vehnäjauho, 100 | Vehnäjauhotaikina venytetään ohueksi, kerrostetaan ja paistetaan pannulla; dhal erillisenä. |
| vietnamilainen-banh-xeo-aamiaisletut : 0 | riisijauho, 100 | Riisijauho 100 g kookosmaitotaikinassa, katkarapu ja idut; rapea pannulettu. |
| pohjoisafrikkalainen-harcha-juustolla : 0 | mannasuurimo, 100 | Mannasuurimo 100 g, voi 15 g ja maito 75 ml; 10 min lepo ja paksut kiekot pannulla, tuorejuustotarjoilu. Ei 400 ml/67 g höyrygelatinointia. |
| kiinalainen-bao-munalla : 0 | vehnäjauho, 100 | Vehnäjauhosta täytetyt höyrypullat; muna-, kurkku- ja hoisintäyte. Kyse jauhosta, ei ostetusta valmiista leivästä. |
| karibia-maissipuuro-kookoksella : 0 | maissijauho, 100 | Maissijauho 100 g, vesi 700 ml ja kookosmaito 200 ml; puuro haudutetaan. |
| kiinalainen-jianbing-munaletty : 1 | vehnäjauho, 100 | Vehnäjauho 100 g ohueen munalettuun, pannupaisto ja soijapaputahna. |
| karibia-johnny-cake : 0 | vehnäjauho, 100 | Vehnäjauho 100 g, maito 60 ml, voi 15 g ja leivinjauhe 5 g; 10 min lepo, pienet leivät pannulla kullanruskeiksi. |
| lahi-ita-taatelipuuro-tahinilla : 0 | kaurahiutale, 100 | Kaurahiutale 100 g maidossa 300 ml puuroksi, taatelit ja kardemumma, tahinitarjoilu. |
| valimerellinen-appelsiini-aamiaiskakku : 0 | vehnäjauho, 100 | Vehnäjauho 100 g, kuorittu appelsiini 130 g, jogurtti 100 g ja öljy; 200 °C kunnes keskusta kypsä. Loppuohje mainitsee sitruunan sekä jogurttitarjoilun: ristiriita aineslistaan. |
| vietnamilainen-banh-bao-kananmunalla : 0 | vehnäjauho, 100 | Vehnäjauho 100 g täytetyissä höyrypullissa, puolikas keitetty muna ja paistettu herkkusieni. Höyrytysaikaa tai kohotusta ei täsmennetä. |
| indonesialainen-bakwan-maissifritter : 2 | vehnäjauho, 100 | Vehnäjauho 100 g, maissi 100 g ja porkkana; ohuet fritterit paistetaan. |
| korealainen-kimchi-jeon-aamiaiseksi : 1 | vehnäjauho, 100 | Vehnäjauho 100 g, kimchi 150 g ja kaksi munaa; pannukakku. |
| valimerellinen-tahinipuuro : 0 | kaurahiutale, 100 | Kaurahiutale 100 g vedessä 700 ml puuroksi; appelsiini, hunaja ja tahini. |
| lahi-ita-manakish-zaatarilla : 0 | vehnäjauho, 150 | Vehnäjauho 150 g, jogurtti 100 g ja vesi 40 ml; lepo 10 min, ohut leipä timjami-öljy-seesamipäällysteellä; pannu tai uuni, aikaa ei lukittu. |
| pohjoisafrikkalainen-minttutee-kaurapuuro : 0 | kaurahiutale, 100 | Kaurahiutale 100 g, maito 200 ml + vesi 500 ml; minttu haudutetaan ja siivilöidään, sitten puuro. |
| meksikolainen-atole-maissipuuro : 0 | maissijauho, 100 | Hieno maissijauho 100 g, maito 200 ml + vesi 700 ml; kaneli-vaniljapuuro keitetään. |
| malesialainen-roti-jala-currykanalla : 0 | vehnäjauho, 100 | Vehnäjauho 100 g muna-kookosmaitotaikinassa, ohut pitsilettu pannulla, kanatarjoilu. |
| thai-roti-munalla-banaanilla : 2 | vehnäjauho, 100 | Vehnäjauho 100 g muna-banaani-kookosmaitotaikinassa; pannulettu. Kondensoitu maito mainitaan tarjoilussa, ei ainesmäärissä. |
| karibia-saltfish-fritterit : 1 | vehnäjauho, 100 | Vehnäjauho 100 g suolakala-kevätsipuli-chilitaikinassa; pannufritterit. Suolakala 1 tl on alkuperäinen avoin koostumus-/määräkysymys. |
| kiinalainen-kevatsipulipannukakku : 0 | vehnäjauho, 100 | Vehnäjauho 100 g ja vesi 60 ml; lepo 10 min, kevätsipuli-seesamiöljykerrostus, rapeaksi pannulla molemmin puolin. |
| thai-maissifritterit : 2 | vehnäjauho, 100 | Vehnäjauho 100 g, kypsä valutettu maissi 150 g ja muna; paistetut fritterit, valinnainen chilikastike. |

## Kaikki 12 julkaistua käyttäjää

Tehtävän `intialainen-aloo-paratha` on repossa tunnisteella `aloo-paratha`.

Kaikki 12 muuttuvat tilasta CALCULATED tilaan INSUFFICIENT SOURCE DATA.
GK, pyöristämätön GK, GK-luokka ja confidence muuttuvat nulliksi; tämä ei ole
numeerinen nollatulos. Yksittäiset jauho-/suurimo-HH:t ylittävät 1 g/annos.
Yhtään arvoa ei säilytetä pienosuustoleranssilla. Muiden poisjättöjen summat
kuvaavat nykyisen mallin kirjanpitoa, eivät automaattista lähdehyväksyntää.
Tuntemattomia määriä tai puuttuvia ainesrivejä ei pidetä nollina.

| Resepti | GK ennen → jälkeen | Pyöristämätön ennen | Luokka ennen | Vanha GI 58 GK-osuus | Muut poisjätöt g HH/annos |
| --- | --- | --- | --- | --- | --- |
| aloo-paratha | 43.5 → null | 43.50413 | HIGH | 32.189130000000006 | 0 |
| gulab-jamun | 49.05 → null | 49.04618 | HIGH | 5.364855 | 0 |
| karibia-johnny-cake | 21.96 → null | 21.963420000000003 | HIGH | 21.45942 | 1.005 |
| kiinalainen-kevatsipulipannukakku | 21.46 → null | 21.45942 | HIGH | 21.45942 | 1.105 |
| lahi-ita-manakish-zaatarilla | 33.06 → null | 33.064130000000006 | HIGH | 32.189130000000006 | 0.2635 |
| pizza-margherita | 65.14 → null | 65.13726000000001 | HIGH | 64.37826000000001 | 0.1369 |
| pohjoisafrikkalainen-baghrir | 44.59 → null | 44.58982 | HIGH | 39.903420000000004 | 0.2 |
| pohjoisafrikkalainen-harcha-juustolla | 19.83 → null | 19.826500000000003 | HIGH | 18.444000000000003 | 0.06 |
| pohjoisafrikkalainen-msemen-hunajalla | 44.59 → null | 44.58982 | HIGH | 39.903420000000004 | 0.30000000000000004 |
| samosa | 43.99 → null | 43.985805000000006 | HIGH | 32.189130000000006 | 0 |
| valimerellinen-appelsiini-aamiaiskakku | 25.28 → null | 25.28477 | HIGH | 21.45942 | 0 |
| vietnamilainen-banh-bao-kananmunalla | 21.47 → null | 21.47427 | HIGH | 21.45942 | 1.02 |

### aloo-paratha

[Alkuperäinen resepti](../../reseptit/paaruoat/aloo-paratha.md), 4 annosta. Vehnäjauhotaikina lepää 20 min; keitetty peruna muussataan täytteeksi, leivät paistetaan gheessä pannulla.

Kaikki nykyiset laskentarivit (HH ja GK-osuus per annos; null tarkoittaa puuttuvaa arvoa tai poisjättöä):

| Aines / g | Koostumustietue | HH g/100 g | HH g/annos | GI ennen | GK-osuus ennen | Päätös |
| --- | --- | --- | --- | --- | --- | --- |
| vehnäjauhoja / 300 | fineli-110-2026-10-24 | 73.998 | 55.49850000000001 | bakery-products-category-mean-gi-58 | 32.189130000000006 | Poistettu; olennainen GI puuttuu |
| perunoita / 400 | fineli-205-2026-10-24 | 15.5 | 15.5 | potato-mashed-preparation-analogue-gi-73 | 11.315 | Vanha GI-sidonta, ei uusi hyväksyntä |

**Pienosuuspäätös:** GI 58 -rivin HH on 55.49850000000001 g/annos. Jokainen ylittää yksittäisen <1 g rajan; yhteenlaskettu <2 g toleranssi ei voi ohittaa sitä.

**Muut lähde- ja määrähuomiot:** GK-syöte kattaa vain jauhon ja perunan. Mausteet, 15 g korianteri ja ghee/voi-vaihtoehto eivät ole kokonaan mallinnettuja. Perunasoseen GI 73 ei ole mitattu rasvassa uudelleenpaistetusta täytteestä; vanha analogia on tarkistettava myöhemmässä palautuksessa.

**Palautuksen portti:** yllä olevat toimitukselliset havainnot on ratkaistava ennen myöhempää GK:n palautusta. Mallin kaikki nykyiset estot ovat JSON:n `after.blockers`-listassa; mallin kyky laskea ei yksin tarkoita toimituksellista hyväksyntää.

### gulab-jamun

[Alkuperäinen resepti](../../reseptit/jalkiruoat/gulab-jamun.md), 4 annosta. Vehnäjauho maitojauhepalloissa; uppopaisto 6–8 min ja sokeriliotus vähintään 30 min.

Kaikki nykyiset laskentarivit (HH ja GK-osuus per annos; null tarkoittaa puuttuvaa arvoa tai poisjättöä):

| Aines / g | Koostumustietue | HH g/100 g | HH g/annos | GI ennen | GK-osuus ennen | Päätös |
| --- | --- | --- | --- | --- | --- | --- |
| maitojauhetta / 150 | fineli-672-2026-10-24 | 52.9 | 19.8375 | dairy-category-mean-gi-35 | 6.943125 | Vanha GI-sidonta, ei uusi hyväksyntä |
| vehnäjauhoja / 50 | fineli-110-2026-10-24 | 73.998 | 9.24975 | bakery-products-category-mean-gi-58 | 5.364855 | Poistettu; olennainen GI puuttuu |
| maitoa / 103 | fineli-675-2026-10-24 | 4.8 | 1.236 | dairy-category-mean-gi-35 | 0.4326 | Vanha GI-sidonta, ei uusi hyväksyntä |
| sokeria / 250 | fineli-1-2026-10-24 | 99.9 | 62.4375 | sugar-syrups-category-mean-gi-58 | 36.21375 | Vanha GI-sidonta, ei uusi hyväksyntä |
| pistaasipähkinää / 10 | fineli-33131-2026-10-24 | 16.7 | 0.4175 | nuts-category-mean-gi-22 | 0.09184999999999999 | Vanha GI-sidonta, ei uusi hyväksyntä |

**Pienosuuspäätös:** GI 58 -rivin HH on 9.24975 g/annos. Jokainen ylittää yksittäisen <1 g rajan; yhteenlaskettu <2 g toleranssi ei voi ohittaa sitä.

**Muut lähde- ja määrähuomiot:** GK-syöte kattaa vain 5 riviä; leivinjauhe, kardemumma ja valinnainen ruusuvesi puuttuvat, samoin nolla-HH-öljy/vesi/ghee. Maito 100 ml on ohjeessa tarvittaessa lisättävä; syöte käyttää koko 103 g. Sokerista lasketaan koko 250 g, siirapin retentiota ei ole mitattu. Maito- ja pähkinäryhmäkeskiarvot säilyvät vanhoina LOW-analogioina; pistaasin massEvidence mainitsee poisjätön vaikka GI-osuus lasketaan. Näitä ei hyväksytä uudelleen tällä korjauksella.

**Palautuksen portti:** yllä olevat toimitukselliset havainnot on ratkaistava ennen myöhempää GK:n palautusta. Mallin kaikki nykyiset estot ovat JSON:n `after.blockers`-listassa; mallin kyky laskea ei yksin tarkoita toimituksellista hyväksyntää.

### karibia-johnny-cake

[Alkuperäinen resepti](../../reseptit/aamupalat/karibia-johnny-cake.md), 2 annosta. Vehnäjauho 100 g, maito 60 ml, voi 15 g ja leivinjauhe 5 g; 10 min lepo, pienet leivät pannulla kullanruskeiksi.

Kaikki nykyiset laskentarivit (HH ja GK-osuus per annos; null tarkoittaa puuttuvaa arvoa tai poisjättöä):

| Aines / g | Koostumustietue | HH g/100 g | HH g/annos | GI ennen | GK-osuus ennen | Päätös |
| --- | --- | --- | --- | --- | --- | --- |
| vehnäjauho / 100 | fineli-110-release-20 | 73.998 | 36.999 | bakery-products-category-mean-gi-58 | 21.45942 | Poistettu; olennainen GI puuttuu |
| maito / 60 | fineli-684-release-20 | 4.8 | 1.44 | dairy-category-mean-gi-35 | 0.504 | Vanha GI-sidonta, ei uusi hyväksyntä |
| voi / 15 | fineli-576-release-20 | 0.8 | 0.06 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |
| leivinjauhe / 5 | fineli-74-2026-10-25 | 37.8 | 0.945 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |
| neutraalia paistoöljyä / null | null | null | 0 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |
| suolaa maun mukaan / null | null | null | 0 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |

**Pienosuuspäätös:** GI 58 -rivin HH on 36.999 g/annos. Jokainen ylittää yksittäisen <1 g rajan; yhteenlaskettu <2 g toleranssi ei voi ohittaa sitä.

**Muut lähde- ja määrähuomiot:** Voi 15 g ja leivinjauhe 5 g ovat eksplisiittisiä massoja; niiden poisjätöt 0.06 + 0.945 = 1.005 g/annos ovat alle 2 yhteensä ja kumpikin alle 1. Maito 60 ml → 60 g vastaa Fineli Rel20 #684:n DL 100 g -mittaa, dairy GI 35 on vanha analogia. Tämä ei pelasta jauhon 36.999 g HH/annos puuttuvaa GI:tä.

**Palautuksen portti:** yllä olevat toimitukselliset havainnot on ratkaistava ennen myöhempää GK:n palautusta. Mallin kaikki nykyiset estot ovat JSON:n `after.blockers`-listassa; mallin kyky laskea ei yksin tarkoita toimituksellista hyväksyntää.

### kiinalainen-kevatsipulipannukakku

[Alkuperäinen resepti](../../reseptit/aamupalat/kiinalainen-kevatsipulipannukakku.md), 2 annosta. Vehnäjauho 100 g ja vesi 60 ml; lepo 10 min, kevätsipuli-seesamiöljykerrostus, rapeaksi pannulla molemmin puolin.

Kaikki nykyiset laskentarivit (HH ja GK-osuus per annos; null tarkoittaa puuttuvaa arvoa tai poisjättöä):

| Aines / g | Koostumustietue | HH g/100 g | HH g/annos | GI ennen | GK-osuus ennen | Päätös |
| --- | --- | --- | --- | --- | --- | --- |
| vehnäjauho / 100 | fineli-110-release-20 | 73.998 | 36.999 | bakery-products-category-mean-gi-58 | 21.45942 | Poistettu; olennainen GI puuttuu |
| vettä / null | null | null | 0 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |
| kevätsipuli / null | null | null | 0.25 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |
| seesamiöljy / null | null | null | 0 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |
| soijakastike / 18 | fineli-31-release-20 | 9.5 | 0.855 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |
| neutraalia paistoöljyä / null | null | null | 0 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |
| suolaa maun mukaan / null | null | null | 0 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |

**Pienosuuspäätös:** GI 58 -rivin HH on 36.999 g/annos. Jokainen ylittää yksittäisen <1 g rajan; yhteenlaskettu <2 g toleranssi ei voi ohittaa sitä.

**Muut lähde- ja määrähuomiot:** Kevätsipuli 2 rkl on syötteessä massaton, kiinteä 0.25 g HH/annos ilman varmennettua ylärajaa. Soijakastike 1 rkl → 18 g toistuu Fineli Rel20 #31:n RKL-mitasta. Nykyinen 1.105 g poisjättösumma ei ole kokonaisuutena varmennettu. Ei sipulin GI 15 -sidonnan palautusta.

**Palautuksen portti:** yllä olevat toimitukselliset havainnot on ratkaistava ennen myöhempää GK:n palautusta. Mallin kaikki nykyiset estot ovat JSON:n `after.blockers`-listassa; mallin kyky laskea ei yksin tarkoita toimituksellista hyväksyntää.

### lahi-ita-manakish-zaatarilla

[Alkuperäinen resepti](../../reseptit/aamupalat/lahi-ita-manakish-zaatarilla.md), 2 annosta. Vehnäjauho 150 g, jogurtti 100 g ja vesi 40 ml; lepo 10 min, ohut leipä timjami-öljy-seesamipäällysteellä; pannu tai uuni, aikaa ei lukittu.

Kaikki nykyiset laskentarivit (HH ja GK-osuus per annos; null tarkoittaa puuttuvaa arvoa tai poisjättöä):

| Aines / g | Koostumustietue | HH g/100 g | HH g/annos | GI ennen | GK-osuus ennen | Päätös |
| --- | --- | --- | --- | --- | --- | --- |
| vehnäjauho / 150 | fineli-110-release-20 | 73.998 | 55.49850000000001 | bakery-products-category-mean-gi-58 | 32.189130000000006 | Poistettu; olennainen GI puuttuu |
| kuivattua timjamia / 2 | null | null | 0.25 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |
| oliiviöljy / null | null | null | 0 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |
| jogurtti / 100 | fineli-619-release-20 | 5 | 2.5 | dairy-category-mean-gi-35 | 0.875 | Vanha GI-sidonta, ei uusi hyväksyntä |
| neutraalia paistoöljyä / null | null | null | 0 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |
| suolaa maun mukaan / null | null | null | 0 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |
| seesaminsiemeniä / 3 | fineli-385-release-20 | 0.9 | 0.013500000000000002 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |
| vettä / 40 | null | null | 0 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |

**Pienosuuspäätös:** GI 58 -rivin HH on 55.49850000000001 g/annos. Jokainen ylittää yksittäisen <1 g rajan; yhteenlaskettu <2 g toleranssi ei voi ohittaa sitä.

**Muut lähde- ja määrähuomiot:** Timjami 2 g on aineslistassa, mutta poisjätetty 0.25 g HH/annos ei nojaa koostumustietueeseen. Seesaminsiemen 3 g on grammoina, Fineli 385 HH 0.9 g/100 g; sen 0.0135 g/annos poisjättö on numeerisesti toistettava. Jogurtti GI 35 on vanha analogia; paistovaihtoehdot eivät ole yksi varmennettu menetelmä.

**Palautuksen portti:** yllä olevat toimitukselliset havainnot on ratkaistava ennen myöhempää GK:n palautusta. Mallin kaikki nykyiset estot ovat JSON:n `after.blockers`-listassa; mallin kyky laskea ei yksin tarkoita toimituksellista hyväksyntää.

### pizza-margherita

[Alkuperäinen resepti](../../reseptit/paaruoat/pizza-margherita.md), 2 annosta. Vehnäjauho hiivataikinassa; vaivaus 8 min, kohotus 1 h, täytteineen uuni vähintään 250 °C 7–10 min.

Kaikki nykyiset laskentarivit (HH ja GK-osuus per annos; null tarkoittaa puuttuvaa arvoa tai poisjättöä):

| Aines / g | Koostumustietue | HH g/100 g | HH g/annos | GI ennen | GK-osuus ennen | Päätös |
| --- | --- | --- | --- | --- | --- | --- |
| vehnäjauhoja / 300 | fineli-110-2026-10-24 | 73.998 | 110.99700000000001 | bakery-products-category-mean-gi-58 | 64.37826000000001 | Poistettu; olennainen GI puuttuu |
| haaleaa vettä / 200 | fineli-922-2026-10-24 | 0 | 0 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |
| kuivahiivaa / 3 | afcd-F009606-2026-10-24 | 6.3 | 0.09449999999999999 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |
| suolaa / 6.5 | fineli-30-2026-10-24 | 0 | 0 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |
| tomaattimurskaa / 200 | fineli-398-2026-10-24 | 3.45 | 3.45 | tomato-raw-cooked-sauce-analogue-gi-22 | 0.759 | Vanha GI-sidonta, ei uusi hyväksyntä |
| mozzarellaa / 200 | fineli-29239-2026-10-24 | 0 | 0 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |
| tuoretta basilikaa / 8 | fineli-11134-2026-10-24 | null | 0.0424 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |
| oliiviöljyä / 13.5 | fineli-536-2026-10-24 | 0 | 0 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |

**Pienosuuspäätös:** GI 58 -rivin HH on 110.99700000000001 g/annos. Jokainen ylittää yksittäisen <1 g rajan; yhteenlaskettu <2 g toleranssi ei voi ohittaa sitä.

**Muut lähde- ja määrähuomiot:** Tomaattimurska käyttää raa’an tomaatin GI 22 -analogiaa; kuumennus/tuotemuoto poikkeavat. Basilikan 8 lehteä → 8 g ei ole varmennettu lehtimassana. Hiiva 3 g ja mozzarella 200 g ovat aineslistassa grammoina, niiden pienosuudet voidaan lukea koostumuksesta. Vesi, suola ja öljy ovat nolla-HH-rivejä. Koko reseptiä ei sertifioida näiden vanhojen analogioiden osalta.

**Palautuksen portti:** yllä olevat toimitukselliset havainnot on ratkaistava ennen myöhempää GK:n palautusta. Mallin kaikki nykyiset estot ovat JSON:n `after.blockers`-listassa; mallin kyky laskea ei yksin tarkoita toimituksellista hyväksyntää.

### pohjoisafrikkalainen-baghrir

[Alkuperäinen resepti](../../reseptit/aamupalat/pohjoisafrikkalainen-baghrir.md), 2 annosta. Mannasuurimo 100 g + vehnäjauho 100 g, hiiva ja vesi 150 ml; lepo 10 min, pannulla huokoiseksi. Ohjeessa sekä kääntö että yhden puolen paisto: menetelmä ei ole täysin yksiselitteinen.

Kaikki nykyiset laskentarivit (HH ja GK-osuus per annos; null tarkoittaa puuttuvaa arvoa tai poisjättöä):

| Aines / g | Koostumustietue | HH g/100 g | HH g/annos | GI ennen | GK-osuus ennen | Päätös |
| --- | --- | --- | --- | --- | --- | --- |
| mannasuurimo / 100 | fineli-112-release-20 | 63.6 | 31.8 | bakery-products-category-mean-gi-58 | 18.444000000000003 | Poistettu; olennainen GI puuttuu |
| vehnäjauho / 100 | fineli-110-release-20 | 73.998 | 36.999 | bakery-products-category-mean-gi-58 | 21.45942 | Poistettu; olennainen GI puuttuu |
| kuivahiivaa / 5 | afcd-F009606-2026-10-24 | null | 0.1 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |
| hunaja / 20 | fineli-4-release-20 | 80.8 | 8.08 | sugar-syrups-category-mean-gi-58 | 4.6864 | Vanha GI-sidonta, ei uusi hyväksyntä |
| neutraalia paistoöljyä / 13.5 | fineli-541-release-20 | 0 | 0 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |
| suolaa maun mukaan / null | null | null | 0.1 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |

**Pienosuuspäätös:** GI 58 -rivin HH on 31.8 g/annos, 36.999 g/annos. Jokainen ylittää yksittäisen <1 g rajan; yhteenlaskettu <2 g toleranssi ei voi ohittaa sitä.

**Muut lähde- ja määrähuomiot:** Hiivan 5 g AFCD-HH 6.3 g/100 g antaa 0.1575 g/annos, mutta vanha excludedReason-rivi käyttää 0.1 g. Tuntemattoman suolamäärän 0.1 g HH -poisjättö ei ole lähteistetty. Hunajan 1 rkl → 20 g vaatii määräviitteen; hunaja käyttää erillistä sugars/syrups GI 58 -tietuetta. Ohjeen voitarjoilu ei ole aineslistassa. Nämä toimitukselliset estot kirjataan, niitä ei korjata tai hyväksytä hiljaisesti.

**Palautuksen portti:** yllä olevat toimitukselliset havainnot on ratkaistava ennen myöhempää GK:n palautusta. Mallin kaikki nykyiset estot ovat JSON:n `after.blockers`-listassa; mallin kyky laskea ei yksin tarkoita toimituksellista hyväksyntää.

### pohjoisafrikkalainen-harcha-juustolla

[Alkuperäinen resepti](../../reseptit/aamupalat/pohjoisafrikkalainen-harcha-juustolla.md), 2 annosta. Mannasuurimo 100 g, voi 15 g ja maito 75 ml; 10 min lepo ja paksut kiekot pannulla, tuorejuustotarjoilu. Ei 400 ml/67 g höyrygelatinointia.

Kaikki nykyiset laskentarivit (HH ja GK-osuus per annos; null tarkoittaa puuttuvaa arvoa tai poisjättöä):

| Aines / g | Koostumustietue | HH g/100 g | HH g/annos | GI ennen | GK-osuus ennen | Päätös |
| --- | --- | --- | --- | --- | --- | --- |
| mannasuurimo / 100 | fineli-112-release-20 | 63.6 | 31.8 | bakery-products-category-mean-gi-58 | 18.444000000000003 | Poistettu; olennainen GI puuttuu |
| voi / 15 | fineli-576-release-20 | 0.8 | 0.06 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |
| maito / 75 | fineli-684-release-20 | 4.8 | 1.8 | dairy-category-mean-gi-35 | 0.63 | Vanha GI-sidonta, ei uusi hyväksyntä |
| tuorejuusto / 100 | fineli-650-release-20 | 4.3 | 2.15 | dairy-category-mean-gi-35 | 0.7525 | Vanha GI-sidonta, ei uusi hyväksyntä |
| neutraalia paistoöljyä / null | null | null | 0 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |
| suolaa maun mukaan / null | null | null | 0 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |

**Pienosuuspäätös:** GI 58 -rivin HH on 31.8 g/annos. Jokainen ylittää yksittäisen <1 g rajan; yhteenlaskettu <2 g toleranssi ei voi ohittaa sitä.

**Muut lähde- ja määrähuomiot:** Voi 15 g on pieni koostumukseen perustuva HH-osuus. Maito 75 ml → 75 g vastaa paikallisen Fineli Rel20 #684:n DL 100 g -mittaa; määrämuunnos toistuu. Aineslistan 11 % levitettävä tuorejuusto käyttää Fineli 650 -juustoproxya (9–14 %); identiteetti on tarkistettava. Maito ja juusto käyttävät vanhaa dairy GI 35 -analogiaa. Öljy/suola nolla-HH, ei uutta tuntemattoman massan positiivista poisjättöä.

**Palautuksen portti:** yllä olevat toimitukselliset havainnot on ratkaistava ennen myöhempää GK:n palautusta. Mallin kaikki nykyiset estot ovat JSON:n `after.blockers`-listassa; mallin kyky laskea ei yksin tarkoita toimituksellista hyväksyntää.

### pohjoisafrikkalainen-msemen-hunajalla

[Alkuperäinen resepti](../../reseptit/aamupalat/pohjoisafrikkalainen-msemen-hunajalla.md), 2 annosta. Mannasuurimo 100 g + vehnäjauho 100 g; lepo 10 min, öljyllä kerrostus ja pannupaisto. Ohje mainitsee veden ilman ainesmäärää.

Kaikki nykyiset laskentarivit (HH ja GK-osuus per annos; null tarkoittaa puuttuvaa arvoa tai poisjättöä):

| Aines / g | Koostumustietue | HH g/100 g | HH g/annos | GI ennen | GK-osuus ennen | Päätös |
| --- | --- | --- | --- | --- | --- | --- |
| mannasuurimo / 100 | fineli-112-release-20 | 63.6 | 31.8 | bakery-products-category-mean-gi-58 | 18.444000000000003 | Poistettu; olennainen GI puuttuu |
| vehnäjauho / 100 | fineli-110-release-20 | 73.998 | 36.999 | bakery-products-category-mean-gi-58 | 21.45942 | Poistettu; olennainen GI puuttuu |
| voi / 50 | fineli-576-release-20 | 0.8 | 0.2 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |
| hunaja / 20 | fineli-4-release-20 | 80.8 | 8.08 | sugar-syrups-category-mean-gi-58 | 4.6864 | Vanha GI-sidonta, ei uusi hyväksyntä |
| neutraalia paistoöljyä / 13.5 | fineli-541-release-20 | 0 | 0 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |
| suolaa maun mukaan / null | null | null | 0.1 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |

**Pienosuuspäätös:** GI 58 -rivin HH on 31.8 g/annos, 36.999 g/annos. Jokainen ylittää yksittäisen <1 g rajan; yhteenlaskettu <2 g toleranssi ei voi ohittaa sitä.

**Muut lähde- ja määrähuomiot:** Voi 50 g on todettu määrä ja pieni HH-osuus; suolan 0.1 g HH -poisjättö on perusteeton. Hunajan rkl-massa ja erillinen sugars/syrups GI 58 -analogia jäävät tarkistettaviksi. Ohjeessa vesi ilman määrää; resepti pysyy nullina.

**Palautuksen portti:** yllä olevat toimitukselliset havainnot on ratkaistava ennen myöhempää GK:n palautusta. Mallin kaikki nykyiset estot ovat JSON:n `after.blockers`-listassa; mallin kyky laskea ei yksin tarkoita toimituksellista hyväksyntää.

### samosa

[Alkuperäinen resepti](../../reseptit/alkuruoat/samosa.md), 4 annosta. Vehnäjauho täytetyn taikinakuoren raaka-aine; lepo 30 min, uppopaisto 170 °C 6–8 min. Täytteessä keitettyä perunaa ja hernettä.

Kaikki nykyiset laskentarivit (HH ja GK-osuus per annos; null tarkoittaa puuttuvaa arvoa tai poisjättöä):

| Aines / g | Koostumustietue | HH g/100 g | HH g/annos | GI ennen | GK-osuus ennen | Päätös |
| --- | --- | --- | --- | --- | --- | --- |
| vehnäjauhoja / 300 | fineli-110-2026-10-24 | 73.998 | 55.49850000000001 | bakery-products-category-mean-gi-58 | 32.189130000000006 | Poistettu; olennainen GI puuttuu |
| perunoita / 400 | fineli-205-2026-10-24 | 15.5 | 15.5 | potato-boiled-preparation-analogue-gi-66 | 10.23 | Vanha GI-sidonta, ei uusi hyväksyntä |
| pakasteherneitä / 100 | fineli-370-2026-10-24 | 9.495 | 2.37375 | vegetables-category-mean-gi-66 | 1.5666749999999998 | Vanha GI-sidonta, ei uusi hyväksyntä |

**Pienosuuspäätös:** GI 58 -rivin HH on 55.49850000000001 g/annos. Jokainen ylittää yksittäisen <1 g rajan; yhteenlaskettu <2 g toleranssi ei voi ohittaa sitä.

**Muut lähde- ja määrähuomiot:** GK-syöte kattaa vain jauhon, perunan ja herneen. Juustokumina, garam masala, chili ja 15 g korianteri puuttuvat; positiivista HH:ta ei saa tulkita nollaksi. Keitetyn perunan GI 66 on ennen myöhempää paistoa mitattu analogia, herneellä laaja kasvisryhmä GI 66. Määrä-, valmistus- ja kaikkien rivien tarkistus tarvitaan ennen palautusta.

**Palautuksen portti:** yllä olevat toimitukselliset havainnot on ratkaistava ennen myöhempää GK:n palautusta. Mallin kaikki nykyiset estot ovat JSON:n `after.blockers`-listassa; mallin kyky laskea ei yksin tarkoita toimituksellista hyväksyntää.

### valimerellinen-appelsiini-aamiaiskakku

[Alkuperäinen resepti](../../reseptit/aamupalat/valimerellinen-appelsiini-aamiaiskakku.md), 2 annosta. Vehnäjauho 100 g, kuorittu appelsiini 130 g, jogurtti 100 g ja öljy; 200 °C kunnes keskusta kypsä. Loppuohje mainitsee sitruunan sekä jogurttitarjoilun: ristiriita aineslistaan.

Kaikki nykyiset laskentarivit (HH ja GK-osuus per annos; null tarkoittaa puuttuvaa arvoa tai poisjättöä):

| Aines / g | Koostumustietue | HH g/100 g | HH g/annos | GI ennen | GK-osuus ennen | Päätös |
| --- | --- | --- | --- | --- | --- | --- |
| vehnäjauho / 100 | fineli-110-release-20 | 73.998 | 36.999 | bakery-products-category-mean-gi-58 | 21.45942 | Poistettu; olennainen GI puuttuu |
| kuorittua appelsiinia / 130 | fineli-11045-release-20 | 8.9 | 5.785 | fruit-category-mean-gi-51 | 2.9503500000000003 | Vanha GI-sidonta, ei uusi hyväksyntä |
| oliiviöljy / null | null | null | 0 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |
| jogurtti / 100 | fineli-619-release-20 | 5 | 2.5 | dairy-category-mean-gi-35 | 0.875 | Vanha GI-sidonta, ei uusi hyväksyntä |
| neutraalia paistoöljyä / null | null | null | 0 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |
| suolaa maun mukaan / null | null | null | 0 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |

**Pienosuuspäätös:** GI 58 -rivin HH on 36.999 g/annos. Jokainen ylittää yksittäisen <1 g rajan; yhteenlaskettu <2 g toleranssi ei voi ohittaa sitä.

**Muut lähde- ja määrähuomiot:** Appelsiini 130 g syötävää osaa ja jogurtti 100 g ovat grammoina; GI 51 fruit ja GI 35 dairy ovat laajoja vanhoja analogioita. Jogurtin kypsennys-/tarjoilurooli sekä sitruunamaininta ovat ohjeen epäselvyyksiä. Öljyt ja suola nolla-HH. Ei uutta pienosuuspoikkeusta.

**Palautuksen portti:** yllä olevat toimitukselliset havainnot on ratkaistava ennen myöhempää GK:n palautusta. Mallin kaikki nykyiset estot ovat JSON:n `after.blockers`-listassa; mallin kyky laskea ei yksin tarkoita toimituksellista hyväksyntää.

### vietnamilainen-banh-bao-kananmunalla

[Alkuperäinen resepti](../../reseptit/aamupalat/vietnamilainen-banh-bao-kananmunalla.md), 2 annosta. Vehnäjauho 100 g täytetyissä höyrypullissa, puolikas keitetty muna ja paistettu herkkusieni. Höyrytysaikaa tai kohotusta ei täsmennetä.

Kaikki nykyiset laskentarivit (HH ja GK-osuus per annos; null tarkoittaa puuttuvaa arvoa tai poisjättöä):

| Aines / g | Koostumustietue | HH g/100 g | HH g/annos | GI ennen | GK-osuus ennen | Päätös |
| --- | --- | --- | --- | --- | --- | --- |
| vehnäjauho / 100 | fineli-110-release-20 | 73.998 | 36.999 | bakery-products-category-mean-gi-58 | 21.45942 | Poistettu; olennainen GI puuttuu |
| kananmuna / 110 | fineli-858-release-20 | 0.3 | 0.165 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |
| sieni / 15 | fineli-345-release-20 | 0.3 | 0.0225 | vegetables-category-mean-gi-66 | 0.014849999999999999 | Vanha GI-sidonta, ei uusi hyväksyntä |
| soijakastike / 18 | fineli-31-release-20 | 9.5 | 0.855 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |
| suolaa maun mukaan / null | null | null | 0 | ei GI:tä | null | Vanha nolla-HH tai poisjättö; ks. lähderajoitteet |

**Pienosuuspäätös:** GI 58 -rivin HH on 36.999 g/annos. Jokainen ylittää yksittäisen <1 g rajan; yhteenlaskettu <2 g toleranssi ei voi ohittaa sitä.

**Muut lähde- ja määrähuomiot:** Kananmunat 2 kpl → 110 g, herkkusieni 1 kpl → 15 g ja soija 1 rkl → 18 g toistuvat Fineli Rel20:n #858 KPL_M 55 g, #345 KPL_M 15 g ja #31 RKL 18 g -mitoista. M-kokovalinta on silti kirjattava analogiaksi, koska resepti ei määrittele kokoa. Herkkusienen kasvisryhmä GI 66 ei ole täsmällinen mittaus; munan ja soijan nykyiset pienosuudet eivät kata suurta jauhoriviä.

**Palautuksen portti:** yllä olevat toimitukselliset havainnot on ratkaistava ennen myöhempää GK:n palautusta. Mallin kaikki nykyiset estot ovat JSON:n `after.blockers`-listassa; mallin kyky laskea ei yksin tarkoita toimituksellista hyväksyntää.

## Kokoelman vaikutus ja muuttumaton historia

- 85 laskettua säilyy identtisinä myös pyöristämättömän GK:n, luokan,
  confidencen, ingredient-tulosten ja poisjättöjen osalta.
- 0 numeerisesti muuttunutta laskettua arvoa; 12 palautuu keskeneräiseksi.
- 229 jo keskeneräistä pysyy keskeneräisinä; 29 niistä saa GI 58 -rivin
  puuttuvan lähteen näkyviin. Ei uusia laskettuja reseptejä.
- 285 vaikutusalueen ulkopuolisen reseptin koko tulos ja fingerprintit säilyvät.
- Yhteensä 326 reseptiä, 85 laskettua, 241 keskeneräistä, 26,0736196319 %.
  Nettomuutos −12. Julkaistu tuotanto pysyy 97/326:ssa tämän Draft-PR:n ajan.
- Kaikki 326 reseptin lähdehashit säilyvät. 41 vaikutusreseptin laskentasyöte-
  ja evidenssifingerprintit päivitetään; muut fingerprintit eivät muutu.
- Historialliset 2A–2B6D-, kookos-, sipuli-, paprika-, manteli- ja AJO 1.8
  -baselinet säilyvät SHA-256-tarkistuksin. 2B6E:n viiden reseptin 44 rivin
  tutkimus säilyy muuttumattomana. Aikaisemmat katselmoinnit ovat historiallisia;
  tämä raportti sulkee niiden GI 58 -jatkokatselmoinnin avoimen rajauksen.

Laskentakaava, 1 g / 2 g rajat, ravintokoostumus ja kaikki muut GI-perheet
säilyvät. Mallin ainoa muutos estää `REFERENCE_ONLY`-sidonnan ohittamisen
`excludedReason`-poisjätöllä (myös pieni arvio, yläraja tai nolla-arvio).
Puuttuvan GI:n oikeutettu pienosuuskäsittely ilman hylättyä sidontaa säilyy.

## Kuuden palautusehdokkaan read-only-esivalmistelu

Kaikkien kuuden nykyinen GK on null ja välitön nettolisäys **0**. Alla oleva
**+1** on ehdollinen myöhemmän tutkimuksen potentiaali, ei laskettu tai luvattu
palautus. Uusia palautuslaskelmia ei tehty, eikä ehdokkaiden syötteitä muutettu.
Lähteet ovat paikallinen [Fineli Rel20 -snapshot](fineli-release-20-reference.json),
[THL:n Fineli](https://fineli.fi/) ja
[FSANZ AFCD](https://www.foodstandards.gov.au/science-data/monitoringnutrition/afcd)
sekä myöhemmin yksilöitävän tuotteen alkuperäinen valmistajaseloste.
Annoksen HH:n lähteistäminen on eri asia kuin GI-mittaus.

### 1. vhh-letut

**Viimeiset esteet:** Suolaripaus on ainoa mallin esto.

**Alkuperäislähde:** Puhdas ruokasuola: koostumus-/tuoteseloste, joka osoittaa nolla-HH:n myös ilman ripauksen massaa. Fineli #858 M-muna 55 g, #500 voi TL 4.5 g ja #631 kerma DL 100 g ovat paikallisesti jäljitettävissä. Erytritolin puhtaus on varmistettava valmistajan selosteesta.

**Toistettavuus:** Ripauksen massaa ei voi johtaa reseptistä. Jos puhdas suola varmennetaan, lähteistetty nolla-HH on eri asia kuin arvattu positiivinen pienosuus; ei tarvitse keksiä grammoja.

**Koko resepti:** Ei vielä hyväksytty: suola avoin; tuorejuuston ja kerman vanha dairy GI 35 on LOW-analogia. Mantelijauhon täysrasvaisen tuotemuodon on vastattava AFCD F006077:ää.

**Potentiaali:** +1 vain kaikkien ehtojen täyttyessä, muuten 0. Epävarmuus: Pienin, mutta ehdollinen.

### 2. vhh-juustokakku

**Viimeiset esteet:** Malli ilmoittaa sitruunamehun; lisäksi vaniljan 1 tl → 2 g ei ole varmennettu.

**Alkuperäislähde:** Fineli Rel20 #11557 sitruunatäysmehu RKL 15 g ja HH 1.6 g/100 g; vaniljauutteen valmistajan koostumus ja g/tl tai luotettava saman uutteen annosmassalähde.

**Toistettavuus:** Sitruunamehun muunnos on toistettavissa 1 × 15 g, kun laimentamaton mehu varmistetaan. Vaniljan muunnos ei vielä ole. AFCD:n per100g-koostumus ei todista tl-massaa.

**Koko resepti:** Ei: vanilja jää avoimeksi vaikka sitruuna ratkaistaan. Smetana→28 % crème fraîche ja 11 % tuorejuusto sekä dairy-analogia on dokumentoitava ennen hyväksyntää.

**Potentiaali:** +1 vain kaikkien ehtojen täyttyessä, muuten 0. Epävarmuus: Kohtalainen: kaksi toimituksellista estettä.

### 3. vhh-mansikkakakku

**Viimeiset esteet:** Mallin viimeinen esto on vaniljauutteen puuttuva massa.

**Alkuperäislähde:** Vaniljan sama tuote/uutepitoisuus, koostumus ja tl-massa. Leivinjauheen valmistajan mitta/koostumus tai Fineli #74 TL 5 g ja HH 37.8; nykyinen AFCD-jauhe käyttää 4 g ja 19.8 g/100 g.

**Toistettavuus:** Vanilja ei vielä toistu; leivinjauheen 4 g ei vastaa paikallista Fineli-mittaa. Eri koostumuksen ja massan yhdistäminen ei ole sallittua ilman perustetta.

**Koko resepti:** Ei: vaniljan lisäksi leivinjauheen tuote/massa vaatii tarkistuksen. Mansikat ovat raakoina täytteessä, 250 g on selvä määrä, mutta fruit GI 51 on ryhmäanalogia; dairy GI 35 samoin.

**Potentiaali:** +1 vain kaikkien ehtojen täyttyessä, muuten 0. Epävarmuus: Kohtalainen: koostumus- ja määräketju.

### 4. vhh-korvapuustit

**Viimeiset esteet:** Mallin viimeinen esto on kanelin 1 rkl:n massa.

**Alkuperäislähde:** Saman jauhetun kanelin valmistajan annosmassa/koostumus tai varmennettu kansallinen annosmassatietue; AFCD F002963 koostumukselle. Fineli #11184 ei sisällä paikallisesti annosmassaa eikä HH-arvoa. Lisäksi mozzarella-raasteen tuoteseloste.

**Toistettavuus:** Kanelin muunnos ei vielä toistu; aikaisempaa 15 g/rkl arvausta ei palauteta. Psyllium 8 g/rkl ja erytritoli 12 g/rkl edellyttävät tuotevastaavuuden tarkistusta, vaikka niiden nykyinen lähde on nolla-HH.

**Koko resepti:** Ei: mozzarella-raaste ei automaattisesti vastaa tuoretta 20 % mozzarellaa; tuotteen mahdollinen paakkuuntumisenesto/tärkkelys tarkistettava. Kaneli avoin; M-munan 55 g on Fineli-mitta.

**Potentiaali:** +1 vain kaikkien ehtojen täyttyessä, muuten 0. Epävarmuus: Kohtalainen–suuri: määrä ja juuston identiteetti.

### 5. keto-mutakakku

**Viimeiset esteet:** Mallissa suolaripaus; toimituksellisesti lisäksi suklaa, vanilja ja kaakaon rkl-massa.

**Alkuperäislähde:** Käytetyn sokerittoman/makeuttamattoman suklaan alkuperäinen tuoteseloste: imeytyvä HH, polyolien laji/määrä ja kaakaopitoisuus; vaniljan massa/koostumus; puhdas suola; Fineli #20 kaakao RKL 6 g.

**Toistettavuus:** Kaakao 2 rkl → 12 g on Finelin mukaan toistettavissa, mutta nykyinen syöte käyttää 10 g; vanilja 2 g ei ole varmennettu. AFCD F009837 kuvaa no-added-sugar-suklaata, jossa polyoleja 28 g/100 g, ei automaattisesti reseptin makeuttamatonta suklaata.

**Koko resepti:** Ei: suklaan 0.76875 g HH/annos poisjättö on tuotekohtaisen koostumusvastaavuuden varassa. Suolan korjaaminen yksin ei oikeuta julkaisuun.

**Potentiaali:** +1 vain kaikkien ehtojen täyttyessä, muuten 0. Epävarmuus: Suuri: tuotteen identiteetti ja polyolit.

### 6. keto-suklaakeksit

**Viimeiset esteet:** Mallissa suolaripaus; lisäksi suklaa, vanilja ja leivinjauheen mitta/koostumus.

**Alkuperäislähde:** Sama suklaatuotteen/vaniljan/puhdas suola -näyttö kuin mutakakussa; leivinjauheen oikea tl-massa ja koostumus.

**Toistettavuus:** Vanilja ei toistu. Nykyinen 0.5 tl → 2 g AFCD-jauhetta ei ole sama ketju kuin Fineli #74:n 5 g/tl. Suklaan 60 g on eksplisiittinen, mutta tuote ei ole yksilöity.

**Koko resepti:** Ei: mantelijauhon aiemmin laskettu 0.972 g HH/annos on lähellä 1 g rajaa; tuotemuotoa tai massaa ei saa pyöristää. Suklaan polyolit/koostumus ja kaikki muut poisjätöt on varmennettava yhdessä.

**Potentiaali:** +1 vain kaikkien ehtojen täyttyessä, muuten 0. Epävarmuus: Suurin: koostumus ja pieni toleranssimarginaali.

## Regressiot ja julkaisuportti

Testit jäädyttävät kaikki 326 tulosta, kaikki 45 sidontamuutosta ja yhden
GI-tietueen sallitut metadatamuutokset. Restaurointikokeet kattavat kaikki
45 sidontaa alkuperäisellä ja 0,01 g massalla, kopioidut ruokaperhe-/valmistusavaimet,
ehdokaslistan, tuntemattoman massan sekä poisjättökiertotien kaikilla nykyisillä
REFERENCE_ONLY-lähteillä. Aiemmat kookos-, sipuli-, paprika-, manteli- ja neljän
jauhokäytön suojat säilyvät. Kuusi palautusehdokasta kuuluvat muuttumattomiin
285 täyteen tulokseen ja lähde-/syöte-/evidenssihasheihin.

Paikalliset tarkistukset 29.10.2026: **PASS** — content:sync, strict nutrition,
GK-auditointi, molemmat nykykattavuusraportit, test:glycemic **85/85**,
npm test **155/155**, test:select-ci **12/12**, build (691 reittiä),
test:static **24/24**, Markdownlint (837 tiedostoa, 0 virhettä) ja
git diff --check. Buildin aiempi yli 500 kB chunk-varoitus jää näkyviin.
Viimeisen HEADin CI ja testien todellinen suoritus vahvistetaan PR-kuvauksessa
ja loppuraportissa, jotta tarkistus ei nojaa pelkkään vihreään tilaan.
Uusi PR jätetään Draft-tilaan riippumatonta katselmointia varten.

## Jatkossa tarvittavat laatukorjaukset

Tämän lähteen aktiivikäyttö on suljettu. Kahdentoista reseptin palautus vaatii
valmistusta vastaavan GI-näytön lisäksi edellä kirjatut määrä-, koostumus- ja
puuttuvien ainesrivien tarkistukset. Muut laajat GI-ryhmäanalogiat ovat erillisiä
katselmointikohteita; niitä ei hyväksytä tai vaihdeta tämän työn perusteella.
Kuuden manteliehdokkaan tutkimus aloitetaan vasta erillisellä valtuutuksella.

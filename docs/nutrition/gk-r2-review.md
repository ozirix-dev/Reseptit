# Reseptit GK 2.1 R2 – lähdekorjaukset ja hiilihydraattiseula

Päivä: 2026-10-30. Tila: DRAFT REVIEW ONLY.
Lähtö-main: `e8da2c9417e2aeff55a85d599b3b7e1ad465f36c`.
Repo: `ozirix-dev/Reseptit`, työhaara: `codex/gk-2-1-r2`.

## A. Johdon yhteenveto

Inventoitiin kaikki 326 nykyistä reseptiä ja luokiteltiin kaikki 243 keskeneräistä.
Kahdeksasta syvästi tutkitusta reseptistä kahdeksaan tehtiin rajatut syötekorjaukset:
10 määrä-/yksikkökorjausta, yksi koostumussidonnan korjaus ja 20 GI-sidonnan poistoa.
Nämä ovat 31 kenttäkohtaista korjausta 30 muutosmerkinnässä: baozi-maissitärkkelyksen
määrä ja koostumussidos muodostavat yhden muutosmerkinnän. Sama korjaus ei toistu.
Neljä korjauksiin liittyvää koostumustietuetta varmennettiin; uusia tietueita ei lisätty.

Hiilihydraattitiedon jäljitettävyys parani. Julkaisuun hyväksyttyjen kokonaissummien
kattavuus ei kasvanut: CARBOHYDRATE_ONLY-seulassa on 134 alustavaa ehdokasta mutta
0 lähdehyväksyttyä kokonaisuutta ja 0 ELIGIBLE_FOR_REVIEW-päätöstä.
Tieteellisesti perusteltuja uusia GK-ehdotuksia löytyi 0.
Nykyinen GK-kattavuus säilyy 83/326 (25,5 %); 243 jää keskeneräiseksi.

Reseptien sisältöä, julkaistuja ravintoarvoja, GI-rekisteriä, laskentamallia,
1 g / 2 g -rajoja ja käyttöliittymää ei muutettu. Viisi mahdollisesti näkyviin
ravintoarvoihin vaikuttavaa muutosta erotettiin tutkimusehdotuksiksi.
Puuttuvaa tietoa ei korvattu nollalla eikä osasummaa koko annoksen arvolla.

## B. Lähtötilanne ja menetelmä

Main ja repoidentiteetti tarkistettiin erikseen; väärä Ravinto-työhakemisto ohitettiin.
Työ tehtiin eristetyssä Reseptit-worktreessä. Kaikki seuratun sisällön kirjoitukset
kulkevat repo_guardin `write`-operaation kautta nykyisen tiedoston hashilla.
Guardin asennettu versio tarkistettiin mainiin yhdistettyä versiota
`632be9701fd4e0387a9fbe5e5f51cee88dbe10b4` vasten; guardia ei muutettu.

Tuoreet strict-, GK- ja kattavuusauditit vahvistivat 326/83/243 ja 45 GI-tietuetta.
Strict-auditin jakauma: VERIFIED 0, ESTIMATE WITH EVIDENCE 180,
INSUFFICIENT SOURCE DATA 86, CONFLICT REQUIRES REVIEW 0, MISSING 60.
Strict-auditin PASS tarkoittaa tarkistimen läpäisyä, ei kaikkien reseptien
ravitsemustieteellistä hyväksyntää.

PR #130:n suunnitelma, R1A:n katselmus ja valinta sekä R1B:n katselmus tarkistettiin.
R1A:n 85 laskettua on historiallinen määrä; R1B:n jälkeen nykyinen määrä on 83.
R1B:n 38 dokumentoitua rakenne-eroa liitettiin nykyisiin reseptitunnisteisiin ja
versioihin. Niiden G/M/C/U-merkinnät säilyvät historiallisina havaintoina eivätkä
tarkoita tämän raportin A–L-luokkia. Kaikkia 38:aa ei väitetä syvästi lähdehyväksytyiksi.
Raaka-auditin perityt rakennevaroitukset eivät ole uusia R2-regressioita;
kattavuusauditin uusi sidontavirhemäärä on 0.

## C. Kokoelman inventaario

Koneellinen aineisto on [inventaario](gk-r2-inventory.json).
Siinä on 326 yksilöllistä nykyistä tunnistetta, lähdepolut, versiohashit, annokset,
julkaistut ravintoarvot, strict-status, kaikki mallin estelauseet sekä eksplisiittiset
NOT_ESTABLISHED/NOT_INDEPENDENTLY_VERIFIED-merkinnät puuttuvalle tietämykselle.
Vain tunnettujen GL-rivien summa on nimetty osasummaksi eikä koko reseptin arvoksi.

| Ensisijainen esteluokka | Ennen | Korjausten jälkeen |
| --- | ---: | ---: |
| A: olennainen massa | 4 | 3 |
| B: koostumustietue puuttuu | 16 | 16 |
| C: väärä/epäselvä koostumus | 2 | 2 |
| D: valmistusmuoto | 0 | 0 |
| E: olennainen GI puuttuu | 21 | 22 |
| F: GI ei sovellu | 18 | 18 |
| G: vanhentunut syöte | 0 | 0 |
| H: ainesosarakenne | 0 | 0 |
| I: annos/yksikkö | 1 | 1 |
| J: kokonaishiilihydraatti | 4 | 4 |
| K: useita esteluokkia | 176 | 176 |
| L: muu | 1 | 1 |
| Yhteensä | 243 | 243 |

Luokitus on koneellinen seulonta. K tarkoittaa useampaa havaittua esteluokkaa;
syiden todellinen riippumattomuus vaatii tarvittaessa lähdearvion. Pelkkä rivimääräero
on tarkistussignaali, ei todistus puuttuvasta ainesosasta. Siksi H voi esiintyä
päällekkäisenä 69 reseptissä, vaikka H-ensisijaisia ei ole yhtään.
Päällekkäiset luokat ovat A 46, B 75, C 24, D 4, E 111, F 134, G 0, H 69,
I 16, J 21 ja L 16; niitä ei summata reseptimääräksi.

55/243 (22,6 %) on koneellisen seulan mukaan mahdollisia ei-GI-tarkistuskohteita,
188/243 (77,4 %) tarvitsee GI-lähteen tutkimista tai sen soveltuvuuden arviointia.
Nämä eivät ole varmoja korjattavuusmääriä. Varmasti pelkällä määrä-/tietuekorjauksella
julkaistavaksi ratkaistuja reseptejä on 0. Nykyisellä hyväksytyllä näytöllä 243 jää
keskeneräiseksi; tämä ei todista, ettei lisälähteitä olisi olemassa.

Inventaarion perusseula on toistettavissa skriptillä
[gk-r2-inventory.py](tools/gk-r2-inventory.py). Se käyttää tuoreita auditointeja,
vaatii tarkan 326/83/243-populaation ja kirjoittaa vain repon ulkopuoliseen scratchiin.
Lopullisen tiedoston syväarviot ja R1B-yhteenveto ovat dokumentoitu katselmointikerros.

## D. Kahdeksan reseptin korjauserä

[Lähdekatselmus](gk-r2-source-review.json) sisältää kaikki kahdeksan alkuperäistä
ainesosarakennetta, valmistuksen, nykyiset GL-syötteet, koostumuslähteet,
olemassa olevat ravintolaskelmat ja kieliversioiden vertailun.
[Muutosrekisterissä](gk-r2-corrections.json) jokaisella muutoksella on ennen/jälkeen-rivi,
lähde, syy, annosmäärä ja ainesosan hiilihydraattivaikutus.

### Varmennetut lähteet ja rajat

- [AFCD F006250](https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd/search/food/F006250):
  lähteen oma annosmitta on 15 g/kevätsipuli; käytettävä hiilihydraatti 4,6 g/100 g.
  Saatavuus varmennettiin alkuperäisestä API-vastauksesta. Syötävä sipuli/varsi ja
  pois jätetyt osat on dokumentoitu. 78 %:n vähennystä ei tehdä toiseen kertaan.
  Tämä on australialainen historiallinen viiteannos, ei punnittu suomalainen sipuli.
- [Fineli 27](https://fineli.fi/fineli/fi/elintarvikkeet/27):
  maissitärkkelys, käytettävä hiilihydraatti 86 g/100 g, RKL 7 g.
  Perunatärkkelys 162 ei ole sama elintarvike.
- [Fineli 31](https://fineli.fi/fineli/fi/elintarvikkeet/31):
  soijakastike, 9,5 g/100 g, RKL 18 g, DL 120 g, TL 6 g.
  60 ml vastaa tästä johdettuna 72 g. Tuotekohtainen vaihtelu jää arvion rajoitteeksi.
- [Fineli 541](https://fineli.fi/fineli/fi/elintarvikkeet/541):
  neutraalin öljyn vertailutietue, RKL 13,5 g, käytettävä hiilihydraatti 0.
  Nolla on koostumuslähteen arvo, ei puuttuva kenttä.

Finelin annosmassat tarkistettiin repon lukitusta THL Release 20 -aineistosta
(`fineli-release-20-reference.json`, CC BY 4.0). Verkkosivujen koostumustiedot tukevat
tunnistusta; lusikkamuunnoksia ei väitetä verkkosivulta luetuiksi. AFCD:n käytettävä
hiilihydraatti ja Finelin CHOAVL pidetään erillään kuitua sisältävästä US-total-arvosta.

### Reseptikohtaiset päätökset

| Resepti | Korjaus ja perustelu | Jäljelle jäävä este |
| --- | --- | --- |
| Bulgogi | Kevätsipuli null → 30 g; soija 60 → 72 g; riisin, soijan, fariinisokerin ja kuumennetun päärynän GI-sidokset pois | Marinadin säilyminen sekä valmistusta vastaavat GI-lähteet |
| Tomaatti-kananmuna-wokki | Kevätsipuli null → 15 g; soija 15 → 18 g; raakatomaatin, riisiryhmän ja makeisryhmän GI pois | Keitetyn riisin/tomaattiruoan GI ja ravintoarvoehdotuksen hyväksyntä |
| Baozi | Kevätsipuli null → 30 g; soija 30 → 36 g; tärkkelys 8 → 7 g ja Fineli 162 → 27; sokerin/kaalin GI pois | Höyrytaikinan GI, kaalin nestehukka, hiivan/inkiväärin rajat, pienosuuksien 2 g raja |
| Moussaka | Kuusi soveltumatonta sidosta pois: munakoiso, peruna, tomaattimurska, maito, juusto, mustapippuri | Kanelin tl-massa, maidon/juuston tyyppi ja béchamelin/perunan GI |
| Koshari | Maissitärkkelys 16 → 14 g (2 × Fineli 7 g); R1B:n oikea maissitärkkelyssidos säilyy | Pinnoitteen säilyminen, keitinvesihävikki ja useat GI-lähteet |
| Yangzhou | Soija 30 → 36 g; öljy 27,4 → 27 g; herneen palkokasviryhmän GI pois | Jäähdytetyn/uudelleenpaistetun riisin GI ja tuotetyypit |
| Soba-aamiaiskeitto | Nuudelin pastaryhmän ja pinaatin vihannesryhmän GI pois | Soban tattariosuus, dashi, liemivaihtoehto, pinaatin kpl-massa ja laskelmatiedosto |
| Bubur sumsum | Riisiryhmän GI pois kookosmaidossa kypsennettävältä riisijauholta ja sokeri-/siirappiryhmän GI pois palmusokerilta | Kookosmaidon ml→g, pandan 150 g:n syötävä osuus, nestevaihtoehto, laskelmatiedosto |

Valinta painotti R1A:n konkreettisia sidonta-/massavirheitä ja yhteisen lähteen hyötyä.
Koshari ja Yangzhou valittiin R1B:n CARBOHYDRATE_ONLY-lupaavuuden vuoksi.
Soba ja bubur kattavat kaksi vaikeaa alkuperäislähdeongelmaa. Paprikauunimunakkaat ja
Chettinad-kana jäivät seuraavan erän ehdotuksiksi; niitä ei syvätutkittu tässä ajossa.

Kevätsipulin uusi laskettava osuus on bulgogissa ja baozissa 0,345 g/annos,
tomaatti-kananmuna-wokissa 0,23 g/annos. Puuttuva aiempi osuus ei ole nolla,
joten siitä ei raportoida näennäistä tarkkaa muutosta koko annoksen hiilihydraattiin.
Soijan osuuden lisäys on vastaavasti 0,285 / 0,095 / 0,1425 / 0,1425 g/annos
(bulgogi / tomaatti / baozi / Yangzhou). Baozin tärkkelysosuus muuttuu
1,632 → 1,505 g/annos ja Kosharin 3,44 → 3,01 g/annos. Öljyn CHO-vaikutus on 0.

Baozin pois jätettävä GI-osuus on korjausten jälkeen 2,6391 g/annos.
Hiiva ja inkivääri ovat mukana kerran konservatiivisina ylärajoina. Raja pysyy alle
2 grammassa; arvoa ei hyväksytä eikä annosmäärää muuteta rajan alittamiseksi.

Kanelin AFCD-tietueesta löytyi koostumus mutta ei tl-massaa. USDA-tietuesivujen
kaksi epäonnistunutta hakua eivät oikeuta lähteettömään 2 tai 2,6 g oletukseen.
Moussaka jää tältä osin BLOCKED. Soban ja buburin nestevaihtoehtoja ei ratkaistu
valitsemalla laskennalle sopivinta vaihtoehtoa.

### Erilliset ravintoarvoehdotukset

[Ehdotustiedosto](gk-r2-nutrition-proposals.json) sisältää tarkat korvausrivit ja
nykyisellä ravintomallilla lasketun vaikutuksen. Nämä eivät ole hyväksyttyjä uusia
kokonaisravintoarvoja. Olemassa olevat laskentatiedostot ja sivujen arvot säilyvät.

| Resepti | Julkaistu CHO g/annos | Aritmeettinen ehdotus | Ero |
| --- | ---: | ---: | ---: |
| Bulgogi | 62,81 | 63,13 | +0,32 |
| Tomaatti-kananmuna-wokki | 38,93 | 39,03 | +0,10 |
| Baozi | 80,36 | 80,38 | +0,02 |
| Koshari | 95,91 | 95,48 | −0,43 |
| Yangzhou | 39,01 | 39,16 | +0,15 |

Erot sisältävät mallin kahden desimaalin pyöristyksen. Ehdotustiedosto näyttää
myös proteiini-, rasva- ja kuituvaikutukset sekä ratkaisua odottavat lähdeasiat.
Bulgogin valkosipulin 3 → 3,5 g/kpl kuuluu vain tähän ehdotukseen.
Määrien, tuotetyypin ja valmistushävikin oletukset estävät automaattisen hyväksynnän.

Viidellä tutkitulla reseptillä on englannin, ruotsin ja thain versiot: yhteensä
15 vertailua. Annokset, ainesosien määrät/yksikkövastaavuudet ja julkaistut
hiilihydraatit täsmäävät suomeen. Bulgogista, sobasta ja buburista ei ole näitä
käännöksiä tässä mainissa. Kyse on numeerisesta vertailusta, ei äidinkielisestä
laaduntarkastuksesta. Kaikki kieliversiot säilyvät muuttumattomina.

## E. CARBOHYDRATE_ONLY

[Ehdokastiedosto](gk-r2-carbohydrate-only-candidates.json) seuloo kaikki 243
keskeneräistä ja merkitsee erikseen 134:n alustavan listan. Alustavista kuusi
syväarvioitiin ja jäi BLOCKED; muut 128 ovat NEEDS_SOURCE. Soba ja bubur ovat
kaksi muuta syväarvioitua BLOCKED-tapausta listan ulkopuolelta.
Koko seulan päätökset ovat BLOCKED 8, NEEDS_SOURCE 235 ja ELIGIBLE_FOR_REVIEW 0.

A-tapauksia eli varmennettuja koko annoksen summia ei hyväksytty. Myöskään B-arviota
ei hyväksytty vielä itsenäiseen julkaisutarkasteluun. Tomaatti-kananmuna-wokki ja
Yangzhou ovat lupaavia myöhempiä B-arvioita lähde-, laskelma- ja annostelukatselmoinnin
jälkeen. Baozin, moussakan, Kosharin, soban ja buburin tunnettu osasumma tai raja on C.
Bulgogin, tomaattiwokin ja Yangzhoun täydellinen hyväksytty kokonaissumma on tässä
päätöksessä D: ei vahvistettu. D ei tarkoita, ettei aiempaa laskennallista arviota olisi.

Tuleva esitystapa voisi erottaa lähdehyväksytyn koko annoksen hiilihydraatin ja
GK:n saatavuuden. A/B-luokka ja arviointiperuste pitäisi tarkistaa ennen toteutusta.
C-osasummaa ei saa näyttää koko annoksen lukuna; GK:n puute ei tarkoita pientä
verensokerivaikutusta. Tässä ei toteuteta käyttöliittymää tai uusia julkaisutietueita.

## F. Mahdolliset uudet GK-arvot

[GK-ehdotustiedostossa](gk-r2-gk-proposals.json) on 0 numeerista ehdotusta.

- Tieteellisesti perusteltu uusi arvo: 0.
- Lupaava mutta keskeneräinen: soban alkuperäistutkimus sekä Yangzhoun riisivalmisteen
  ja jäähdytyksen tutkimus. Tämä ei ole numeerisen arvon tai vaihteluvälin ehdotus.
- Hylätty: 20 ryhmäkeskiarvoon tai valmistusmuodoltaan väärään analogiaan perustunutta sidosta.
- Ei arvioitavissa nykyisellä kokonaisnäytöllä: muiden kuuden tarkastellun reseptin uusi GK.

[Strozyk 2022](https://pubmed.ncbi.nlm.nih.gov/35429987/) tutki 32 tyypin 1 diabetesta
sairastavaa ja 24 h / 4 °C jäähdytettyä, uudelleenkuumennettua riisiä.
Tulos ei ole tämän wokin GI.
[Chiu 2013](https://pubmed.ncbi.nlm.nih.gov/23945407/) vertasi eri riisejä ja
valmistusmenetelmiä; 21 terveen tutkittavan valituissa näytteissä GI-ero ei ollut
merkitsevä. Jäähdytyksestä ei päätellä yleistä vähennyskerrointa.

[Lang 1999](https://pubmed.ncbi.nlm.nih.gov/10357737/) antaa maissitärkkelykselle
ihmiskokeen tuloksen, mutta kuuden henkilön GI-koe ei vastaa höyrytettyä täytettä
tai paistettua sipulipinnoitetta. Keskiarvon keskivirhe ei ole reseptin min/max-raja.
[Sugiyama 2003](https://pubmed.ncbi.nlm.nih.gov/12792658/) on soban jatkotutkimuslähde;
tarkka nuudeli, valmistus, ruokakohtainen otos ja riisivertailun asteikko on vielä
varmennettava koko tekstistä. In vitro -hydrolyysi-indeksi ei ole ihmisen GI.

POINT, RANGE, CLASS_ONLY ja CONDITIONAL_SCENARIOS jäävät tutkimusmuistion tasolle.
Lähteistämätön nestevaihtoehto tai tilastollinen keskivirhe ei muodosta skenaariota
tai vaihteluväliä. UNAVAILABLE on kaikkien kahdeksan nykyinen hyväksyttävä lopputulos.

## G. Regressiot ja testit

[Regressioaineisto](gk-r2-regression.json) lukitsee kaikki 326 ennen/jälkeen-tulosta,
syöte- ja evidenssihashit sekä resepti-, käännös-, laskenta-, GI-/koostumusrekisteri-,
malli- ja historiallisten baseline-tiedostojen muuttumattomat sisältöhashit.
318 kokonaistulosta säilyy identtisenä. Kahdeksan sallitun reseptin ainesosatulokset
ja keskeneräisyysperusteet muuttuvat. Kahdeksan syötehashia ja seitsemän evidenssihashia
muuttuu; Kosharin pelkkä massa ei muuta lähdeevidenssihashia. Reseptihashit eivät muutu.
Kaikki GK-arvot, pyöristämättömät arvot, vaihteluvälit, luokat ja luottamustasot säilyvät.

Historiallisia baselineja ei muokattu. Vanhojen testien R1B-poikkeusta laajennettiin
vain kahdeksaan nimettyyn R2-reseptiin, joiden koko tulos testataan uutta kiinteää
regressioaineistoa vasten. Baozin odotus muuttui lähdelaskelman vuoksi 2 g rajan
alittamisesta rajan ylityksen estoon; rajaa ei muutettu. Päärynän GI-poisto ja
Kosharin 14 g korvaavat nimenomaisesti vanhat lähdeoletukset. Testejä ei poistettu.

Ensimmäinen kohdennettu kierros paljasti vanhoihin syötteisiin sidotut odotukset.
Ne korjattiin lähdeperusteisesti. Toinen kierros läpäisi 87/88 testiä; viimeinen
virhe oli todistetun lähdetekstin liian tarkka regex (`heated marinade` vs.
`heated in the beef marinade`), joka korjattiin. Lopullinen kierros läpäisi nämä odotukset. Viimeisessä diff-katselmoinnissa Yangzhoun soijan johdettu pienosuusmerkintä täsmennettiin 0,7125 → 0,855 g:aan ja poistettiin asiaankuulumaton tutkijaviittaus. Kahdeksannen kohteen buburin lopullinen lähdevertailu osoitti lisäksi kaksi soveltumatonta ryhmäkeskiarvosidosta; ne poistettiin samoin perustein kuin muissa kohteissa. Reseptijoukkoa ei laajennettu. Viimeistelyjen jälkeen kohdennetut GK-regressiot läpäisivät 89/89 testiä, uusi GK-auditointi ja kattavuusauditointi PASS.

Lopullinen kierros: strict nutrition PASS, GI/GK-auditointi PASS, kattavuusauditointi PASS (0 uutta sidontavirhettä), yksikkötestit 160/160 PASS, staattiset testit 24/24 PASS, build PASS (691 reittiä), Markdownlint PASS (843 tiedostoa), git diff --check PASS. Buildin yli 500 kB:n chunk-varoitus on olemassa oleva suorituskykyhuomio; sitä ei muuteta tässä rajauksessa.

Komennot ajetaan worktreen `site`-hakemistosta, paitsi markdownlint ja Git juuresta:

```text
npm run audit:nutrition -- --strict
npm run audit:glycemic-load
npm run audit:glycemic-coverage -- --output-json docs/nutrition/tmp/gk-r2-coverage.json --output-markdown docs/nutrition/tmp/gk-r2-coverage.md
npm test
npm run build
npm run test:static
pwsh -File scripts/lint-markdown.ps1
git diff --check
```

Build tuottaa suomen sekä kaikki olemassa olevat englannin, ruotsin ja thain sivut.
Testi-/build-skriptien kirjoituskohteet tarkistettiin: ne pysyvät eristetyssä repossa.
Kattavuusauditin paikallinen tuloste ohjataan ohitettuun hakemistoon, jotta aktiivista
historiallista kattavuusdokumenttia ei korvata automaattisesti.

## H. Suositeltu seuraava erä

Tämä on priorisoitu ehdotus, ei R3:n aloitus. Riski viittaa lähde-/laskentariskiin.

| Sija / resepti | Ensisijainen työ ja tarvittava lähde | Todennäköinen hyöty | Riski |
| --- | --- | --- | --- |
| 1. Tomaatti-kananmuna-wokki | Fineli-annosmassojen ja soijan tuotetyypin hyväksyntä; erillinen laskelmapäivitys | Koko hiilihydraattiarvio | Keskitaso |
| 2. Yangzhou | Soija/öljy, riisin tuote- ja jäähdytyskuvaus, nykyiset koostumustietueet | Hiilihydraattiarvio; GI vasta myöhemmin | Keskitaso/korkea |
| 3. Koshari | Fineli 27 sekä pinnoitteen/keitinveden hävikin lähde tai mittaus | Hiilihydraattiarvio | Korkea |
| 4. Bulgogi | Marinadin säilymisen näyttö ja Fineli-valkosipulimassa | Hiilihydraattiarvio | Keskitaso/korkea |
| 5. Baozi | Kaalin nestehukka ja hiiva/inkivääri; höyrytaikinan ihmistutkimus | Hiilihydraatti, mahdollisesti GK | Korkea |
| 6. Moussaka | Alkuperäinen kanelin tl-massa sekä maidon/juuston määrittely | Hiilihydraattiarvio | Korkea |
| 7. Soba-aamiaiskeitto | Täsmällinen nuudeli/dashi/liemi ja Sugiyaman koko teksti | Molemmat mahdollisia, ensin koostumus | Korkea |
| 8. Bubur sumsum | Valmistajan kookosmaito ja pandanin käytön alkuperäislähde | Hiilihydraattiarvio | Korkea |
| 9. Paprikauunimunakkaat | R1A:n paprikan laji ja oikea Fineli-tietue | Hiilihydraattitiedon laatu | Keskitaso, ei syväarvioitu |
| 10. Chettinad-kana | R1A:n mausteiden ainekohtaiset massat ja ylärajat | Hiilihydraattitiedon laatu | Korkea, ei syväarvioitu |

## I. Pysäytys- ja julkaisutilanne

Tämä aineisto on tarkoitettu yhteen Reseptit Draft-PR:ään. ReportHubiin tehdään
erillinen historiallinen auditointiraportti ja yksi Draft-PR.
Mitään ei yhdistetä, siirretä Ready-tilaan tai julkaista. Tuotantoa muuttavia
resepti-/ravintoarvotiedostoja ei muuteta. Mainia ei synkronoida ilman guardin
täsmällistä interaktiivista hyväksyntää.

Guard ei tarjoa olemassa olevan PR-kuvauksen muokkausoperaatiota. Siksi kuvaus
sisältää paikalliset tarkistukset ja Checks-linkin avaushetkellä; tarkka valmistunut
GitHub CI raportoidaan ReportHubissa ja aamuraportissa. Suoraa `gh pr edit`- tai
MCP-kirjoitusta ei käytetä tämän rajauksen kiertämiseen.

Käyttäjälle jää kahdeksan syötekorjauksen ja lähdetulkintojen riippumaton katselmointi,
viiden ravintoarvoehdotuksen erillinen arviointi sekä mahdollisen seuraavan erän rajaus.
Lähteiltään keskeneräiset reseptit pysyvät BLOCKED.

Päätös: **B. PARTIAL – REVIEW REQUIRED**. Rajattu lähdekorjauserä valmistuu
katselmointiin, mutta koko hiilihydraattimäärän lähdehyväksyntä ja uudet GK-lähteet
jäävät osittain ratkaisematta. Tämä päätös ei anna julkaisulupaa.

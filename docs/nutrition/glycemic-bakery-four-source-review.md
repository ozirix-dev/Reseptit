# AJO 1.8 – neljän GI 58 -sidonnan lähdekorjaus

## Julkaistu lähtötilanne ja rajaus

PR #127 yhdistettiin normaalilla merge commitilla `6975421298e28b56c8dbda69ff7aab2f01e83902`.
Hyväksytty HEAD oli `26a1dd0089185a4067ac71194afdd29f3298f510`. HEAD, mergeability,
tyhjät review-ketjut ja uusin CI tarkistettiin ennen Draft-tilan poistamista.
Main-haaralla ei ollut GitHubin pakollisia hyväksyntöjä (branch protection 404 / Branch not protected,
haaraan kohdistuvat rules tyhjät); ohituksia ei käytetty.
[Tuotanto-CI 40753221513](https://github.com/ozirix-dev/Reseptit/actions/runs/40753221513):
build ja Pages deploy PASS. Lokissa GI/GK 79/79, laskettu 101, keskeneräinen 225.
[Tuotannon GK-sivu](https://ozirix-dev.github.io/Reseptit/glykeeminen-kuorma/) tarkistettiin
2026-10-28 19:21:59 UTC: 326 riviä (325 korttia ja yksi erillinen rivi), 101 laskettua,
225 keskeneräistä, 31,0 %. Kaikkien 326 näkyvä teksti vastasi hyväksyttyä buildia;
kaikki kymmenen mantelikorjauksessa poistunutta arvoa olivat poissa. HTML SHA-256:
`a577610273ef6b7eb7b097c311a069812ef64408225f263921a91616738e08ac`.
Sipuli, punapaprika ja kookosmaitopuuro säilyvät REFERENCE_ONLY-tilassa ilman aktiivisia sidontoja.

Tämän työn erillinen haara alkaa yllä olevasta mainista. Repo_guard ja origin tarkistettiin
sekä lähtötyöpuussa että uudessa työpuussa; muut aktiiviset työpuut inventoitiin.
[Nelireseptisen erän baseline](glycemic-bakery-four-source-baseline.json) lukitsee 101/326-tilan,
kaikki tulostiivisteet, syöte-/lähde-/reseptifingerprintit, GI-katalogin ja aiemmat baselinet.
[Täysi koneellinen katselmointi](glycemic-bakery-four-source-review.json) sisältää jokaisen
326 reseptin vertailun, neljän täydet ennen/jälkeen-tulokset, kaikki ainesrivit ja
pelkän GI 58 -poiston vastelaskelmat. Reseptien ainesosia, annoskokoja tai ohjeita ei muuteta.
Tavallisten ravintoarvojen laskentajärjestelmää ei muuteta: alla havaitut koostumusvirheet
koskevat GK-syötettä, ja mahdollinen vastaava virhe muissa ravintoarvoissa vaatii erillisen tarkistuksen.

## GI 58:n lähdepäätös

[Atkinson ym. 2021, DOI 10.1093/ajcn/nqab233](https://doi.org/10.1093/ajcn/nqab233),
Table 1: bakery products -ryhmän 72 tuotteen keskiarvo 58, SD 16. Tämä ei ole
kauraleseen, ruis-/riisi-/vehnäjauhon ihmisillä mitattu GI eikä ainekohtainen
mittausepävarmuus. Leivitys, suurustaminen, höyrytetty riisilevy tai lese osana
sekoitettua taikinaa ei todista vastaavuutta valmiiden leipomotuotteiden keskiarvoon.
Kaikki neljä sidontaa hylätään. Alkuperäinen tietue ja koko 45 GI-tietueen katalogi
säilyvät täsmälleen ennallaan; uusia GI-lukuja tai ruokaryhmäkeskiarvoja ei lisätä.

### Vaihtoehtoisten alkuperäislähteiden tarkistus

- **Kauralese:** [Tapola ym. 2005](https://pubmed.ncbi.nlm.nih.gov/16054549/),
  DOI 10.1016/j.numecd.2004.09.003: 12 tyypin 2 diabetesta sairastavaa, kauralesejauho,
  rapea lesetuote ja glukoosivertailu; 12,5 g glykeemistä hiilihydraattia, 2 h seuranta.
  [Sydneyn lähdetietokanta](https://glycemicindex.com/gi-search/) kuvaa Natureal GI-flour
  -tuotteen kylmään veteen sekoitettuna (GI 40), GI-crisp-tuotteen GI 79.
  Tuotekohtainen lesekonsentraatti ja kylmä vesiseos eivät osoita geneerisen
  Fineli 170 -leseen GI:tä uunissa paistetussa sämpylässä. Näitä lukuja ei siirretä.
  [Wolever ym. 2016](https://pmc.ncbi.nlm.nih.gov/articles/PMC5037511/): 10 tervettä,
  noin 22 % beetaglukaania sisältävä lesetuote vedessä ennen valkoleipää. Kyse on
  ateriavasteinterventiosta, ei tämän leivotun ainesosan GI-mittauksesta.
  [Vuoden 2026 kauratuotetutkimus](https://pubmed.ncbi.nlm.nih.gov/42394333/)
  mainitsee kauraleseen GI 45, mutta saatavilla oleva tiivistelmä ei varmista tämän
  reseptin tuotetta ja valmistusta. Ei laskentakäyttöä.
- **Ruisjauho:** [Rosén ym. 2009](https://pubmed.ncbi.nlm.nih.gov/19781071/),
  DOI 10.1186/1475-2891-8-42: 12 tervettä, leivottuja/keitettyjä ruistuotteita,
  vertailuna valkovehnäleipä. [Juntunen ym. 2002](https://pubmed.ncbi.nlm.nih.gov/11815315/),
  DOI 10.1093/ajcn/75.2.254: 20 tervettä, leipiä ja pastaa, 50 g imeytyvää HH:ta,
  3 h vaste. Kumpikaan ei mittaa kalassa voissa paistettua ohutta ruisjauholeivitystä.
  Leipäasteikkoa tai insuliinivastetta ei käsitellä suoraan glukoosiasteikon GI:nä.
- **Riisijauho:** [Chen ym. 2010](https://www.wjgnet.com/1007-9327/full/v16/i12/1512.htm),
  DOI 10.3748/wjg.v16.i12.1512: 15 tervettä, glukoosivertailu, 50 g imeytyvää HH:ta,
  2 h kapillaarinäytteet. Valmis plain steamed vermicelli roll, 238 g testiannos,
  GI 90 ± 8. Table 1 kuvaa valmiin tuotteen (mm. 5,2 g rasvaa), ei tämän reseptin
  riisijauhoa. Tarkkaa riisilajiketta, jauhon koostumusta ja reseptivastaavuutta ei
  pystytä osoittamaan. [Jiang ym. 2023](https://kyxuebao.kmmu.edu.cn/cn/article/doi/10.12259/j.issn.2095-610X.S20231207)
  raportoi Yunnanin riisirullalle 45,5 ± 12,1, n=12; glukoosivertailut ja 2 h käyrä
  näkyvät taulukoissa. Saatavilla olevasta aineistosta ei varmenneta testiannoksen
  HH-määrää eikä valmistusvastaavuutta banh cuoniin. Kumpaakaan lukua ei siirretä
  kuivan jauhon ainesosakertoimeksi eikä valita pienempää lukua edullisuuden vuoksi.
- **Vehnäjauhoroux:** alkuperäistä ihmisillä tehtyä mittausta yhden minuutin
  rasvakypsennyksen ja 8–10 minuutin kastikehaudutuksen vastineelle ei löytynyt
  tässä rajatussa haussa. Leipä, pasta, keitetty jyvä ja verkkosivujen lähteetön
  jauhon GI eivät osoita vastaavuutta. Hakutulos ei todista kaikkien mahdollisten
  tutkimusten puuttumista, mutta hyväksyttävä vaihtoehto jäi osoittamatta.

## Neljän reseptin päätökset

HH tarkoittaa imeytyvää hiilihydraattia. Koostumuksen lähtömassa on syötävä kuiva
ainesosa; veden lisäys ei kasvata hiilihydraatin kokonaismäärää. Kypsennyshävikkiä,
leivityksen pois jäävää osuutta tai imeytymisprosenttia ei keksitä.
Fineli-muunnokset ovat versionhallittavan [release 20 -referenssin](fineli-release-20-reference.json)
standardimittoja, eivät väite juuri valmistetun annoksen punnitustuloksesta.

| Resepti / aine | Massa / annokset | HH g/100 g | HH g/annos | Vanha GI 58 -GK-osuus | Vanha tarkka GK → uusi |
|---|---:|---:|---:|---:|---|
| keto-kauralesesampylat / kauralese | 25 g / 8 | 52,19 | 1,6309375 | 0,94594375 | 1,33703125 → null |
| silakkapihvit-tilli-kermakastike / ruisjauho | 16 g / 4 | 59,391 | 2,37564 | 1,3778712 | 1,7280461999999999 → null |
| vietnamilainen-banh-cuon-sienilla / riisijauho | 100 g / 2 | 79,3 | 39,65 | 22,997 | 23,01185 → null |
| kanaviillokki-kukkakaalilla / vehnäjauho | 20 g / 4 | 73,998 | 3,6999 | 2,145942 | 7,573741999999999 → null |

Kaikissa neljässä ongelma-aine ylittää alle 1 g:n säännön. Mikään arvo ei säily
pienosuustoleranssilla. Pelkän sidonnan poiston vastelaskelmakin on kaikissa null.
Vanha confidence LOW → null; GK-luokat LOW, LOW, HIGH, LOW → ei luokkaa.
Vaihteluvälit olivat ja ovat null. Laskenta- ja pyöristyskaavat sekä rajat pysyvät ennallaan.

### Kauralesesämpylät

[Alkuperäinen resepti](../../reseptit/leivonnaiset/keto-kauralesesampylat.md):
25 g kauralesettä, kahdeksan sämpylää, taikinan turvotus 10 min ja uuni 200 °C
20–25 min. `fineli-170-2026-10-25` on kauralese (kuitu 18,5 g/100 g, polyolit 0),
ei valmis leipomotuote. Nimenomainen 25 g säilyy.
Muut poisjätöt: muna 0,061875; voi 0,03; leivinjauhe 0,4725; seesami 0,009,
yhteensä 0,573375 g/annos. Psyllium ja suola ovat koostumuksen perusteella nolla.
Muut kertoimet: raejuusto ja kerma dairy GI 35, mantelijauho nuts GI 22.
Viimeksi mainittu käyttää Fineli 379:n kokonaisen mantelin koostumusta; jauhamisen,
mahdollisen rasvanpoiston ja paiston vastaavuus on lisäselvitettävä. Tätä toista
GI-perhettä ei hyväksytä uudelleen tämän auditoinnin perusteella eikä laajenneta nyt.
Kauraleseen puuttuva GI yksin estää julkaisun.

### Silakkapihvit

[Alkuperäinen resepti](../../reseptit/paaruoat/silakkapihvit-tilli-kermakastike.md):
500 g kalaa, neljä annosta, 2 rkl täysjyväruisjauhoa ohueen leivitykseen,
voissa 3–4 min kummaltakin puolelta. `fineli-100-release-20`, kuitu 13,6,
polyolit 0; RKL 8 g → 16 g. Koko reseptimäärä lasketaan, eikä pannulle jäämistä oleteta.
Kerma 150 ml korjataan 138 → 150 g (Fineli 631 DL 100 g), tuore tilli 2 rkl
6 → 5 g (Fineli 369 RKL 2,5 g). Voi 28 g (2 × 14 g) ja sitruunamehu 15 g
(RKL 15 g) säilyvät. Hyväksyttävät poisjätöt: voi 0,056, mehu 0,06 ja tilli
0,01125, yhteensä 0,12725 g/annos. Tillin vanha kiinteä poisjättöarvio poistetaan;
malli laskee osuuden nyt suoraan 5 g massasta ja 0,9 g/100 g koostumuksesta.
Suola–valkopippurin keksitty 0,25 g HH-raja poistetaan. Tarjoilusitruunan 58 g
ja sen 0,319 g HH-arvio eivät perustu varmennettuun syötävään määrään; kumpaakaan
ei käytetä pienosuuden näyttönä. Jäljelle jäävät ruisjauhon GI sekä mausteiden
ja tarjoilusitruunan määrä-/koostumusnäyttö. Kerma säilyttää vanhan dairy-analogian,
ei suoraa tämän kastikkeen kliinistä mittausta.

### Banh cuon

[Alkuperäinen resepti](../../reseptit/aamupalat/vietnamilainen-banh-cuon-sienilla.md):
100 g riisijauhoa + 250 ml vettä, kaksi annosta, ohut höyrytetty levy, 100 g
herkkusieniä ja 150 g possun jauhelihaa täytteessä. Höyrytysaika, levyn paksuus
ja jauhon lajike eivät ole täsmennettyjä. `fineli-182-release-20` on geneerinen
riisijauho/riisihiutaletietue (kuitu 2,3, polyolit 0), ei mitattu riisilevy.
Sienirivin virheellinen massa 15 → 100 g korjataan reseptin mukaan. Vanha
vegetable GI 66 jää lähdeanalogiana riville; sitä ei hyväksytä tässä täsmälliseksi
paistetun sienen mittaukseksi. Possun Fineli 713 on geneerinen sianliha eikä
jauhelihan rasvapitoisuudeltaan täsmennetty tuote; nolla-HH-koostumus on karkea proxy.
Kalakastikkeen Fineli 8029 tarkoittaa mademuhennosta, ei fermentoitua aasialaista
kalakastiketta: sidonta ja keksitty 15 g massa/0,1263 g HH-poisjättö poistetaan.
Alkuperäinen 1 rkl säilytetään recipeQuantity-kentässä, koostumus ja massa avoinna.
Reseptin vesi ei lisää HH:ta. Suolan lähteistetty nolla-HH-tulkinta säilyy;
se ei ole tuntemattoman positiivisen osuuden pienosuusoletus.

### Kanaviillokki

[Alkuperäinen resepti](../../reseptit/paaruoat/kanaviillokki-kukkakaalilla.md):
neljä annosta, vehnäjauho 2 rkl, roux voissa 1 min, liemi ja kerma 8–10 min
miedolla lämmöllä. Kukkakaaliriisi höyrytetään/paistetaan erikseen 4–5 min.
`fineli-110-release-20`, puolikarkea vehnäjauho, kuitu 3,5 ja polyolit 0;
RKL 10 g → 20 g. Nämä massat ja reseptin 500 g kypsää nahatonta rintafileetä,
600 g kukkakaalia säilyvät.
Kypsän rinnan virheellinen AFCD raaka reisiliha -koostumussidos poistetaan.
Kukkakaalin Fineli 320 valkokaali -sidos ja sen vegetable GI 66 -sidos poistetaan.
Uusia korvaavia tietueita ei keksitä. Liemi 400 ml = 400 g (Fineli 30315 DL 100 g),
kerma 200 ml = 200 g (Fineli 631), voi 28 g ja sitruunamehu 15 g ovat standardimitoin
perusteltuja. Hyväksyttävät poisjätöt: liemi 0,427 + voi 0,056 + mehu 0,06 =
0,5429999999999999 g/annos. Curryn 1 tl:n ja määrättömän suola–pippuriseoksen
kaksi 0,125 g oletusrajaa poistetaan. Näiden massat/koostumukset, kanan ja kukkakaalin
koostumus sekä vehnäjauhon GI ovat avoimia. Kerma säilyttää aiemman dairy-analogian.

## Toteutus ja rajattu suojaus

Neljä tarkistettua käyttötapaa tallennetaan GK-syötteen `ingredientUse`-kenttään:
OAT_BRAN_IN_DOUGH, RYE_FLOUR_COATING, RICE_FLOUR_STEAMED_SHEET ja WHEAT_FLOUR_ROUX.
Kenttä perustuu reseptin todelliseen ainesosaan ja valmistukseen, erillään GI-tietueen
foodKey/preparationKey-avaimista. Malli hylkää bakery GI 58:n näissä käyttötavoissa
myös kopioiduilla avaimilla, toisella tietue-ID:llä saman ryhmäavaimen takana ja
hyvin pienellä massalla. Väärä sidonta ei muutu hyväksyttäväksi toleranssin avulla.
Käyttötavan poistaminen tai muuttaminen rikkoo laskentafingerprintin; reseptin ID:n
vaihto ei kierrä mallin estoa. Ehdokaslista ei tarjoa samaa hylättyä ryhmäkeskiarvoa.
Mahdollinen aidosti valmistusvastaava uusi tutkimus voi myöhemmin saada oman katselmoinnin.

Suoja ei ole kaikkien jauhojen automaattinen luokittelija: muille käyttötavoille ei
lisätä takautuvasti tarkistamatonta kontekstia. Muut 322 täydellistä tulosobjektia ja
niiden syöte-/lähdefingerprintit pysyvät samoina. JSON sisältää täsmällisen 14 muutetun
ainesrivin sallittujen muutosten luettelon. Kaikkien 326 reseptin lähdefingerprintit
ovat ennallaan. Aiemmat baselinet, AJO 1.7:n raportit ja 2B6E:n viiden reseptin /
44 ainesrivin tutkimus säilyvät muuttumattomina.

## Muiden GI 58 -käyttäjien riski, vain luku

49 aktiivista sidontaa → 45; laskettuja käyttäjiä 16 → 12.
Jäljelle jäävät lasketut käyttäjät: aloo-paratha, gulab-jamun, karibia-johnny-cake,
kiinalainen-kevatsipulipannukakku, lahi-ita-manakish-zaatarilla, pizza-margherita,
pohjoisafrikkalainen-baghrir, pohjoisafrikkalainen-harcha-juustolla,
pohjoisafrikkalainen-msemen-hunajalla, samosa, valimerellinen-appelsiini-aamiaiskakku, vietnamilainen-banh-bao-kananmunalla.
Täsmälliset 45 sidontaa ja 12 ID:tä ovat JSON-raportissa. Kaikki pysyvät ennallaan;
säilyminen ei osoita niiden GI-lähteen hyväksyttävyyttä.
[Aiempi jatkoraportti](glycemic-bakery-other-users-follow-up.md) säilytetään historiallisena.
Sen P0-nelikko käsitellään tässä ehdotuksessa. Muiden P1-ainesosa–valmistuote-analogioiden
jatko kannattaa jakaa höyrytettyihin/paistettuihin taikinoihin, rasvassa paistettuihin
leivonnaisiin ja uunituotteisiin, kussakin valmistus- ja koostumusnäyttö erikseen.
Jo keskeneräisen banh xeo -reseptin riisijauhosidosta ei muuteta tässä erässä.

## Kuuden palautusehdokkaan järjestys, vain luku

1. **vhh-letut**: yksinkertaisin avoin rivi on suolaripaus. Varmenna puhdas suola ja
   koostumuksen todellinen nolla (Fineli 30), tai tarvittaessa määrä. Tuntematonta
   positiivista HH-osuutta ei saa nimetä nollaksi. Tarkista myös muut mitat ja koko summa.
2. **vhh-juustokakku**: sitruunamehu 1 rkl voidaan tutkia Fineli 11557:n 15 g/RKL-tiedosta.
   Lisäksi vaniljauutteen nykyinen 1 tl → 2 g tarvitsee tuotekohtaisen lähteen;
   pelkkä nykyisen blocker-listan tyhjentyminen ei riitä.
3. **vhh-mansikkakakku**: vaniljauutteen tuotemuoto ja 1 tl:n massa/HH ratkaisevat.
   Sama näyttö voi palvella myös juustokakun tarkistusta; ei keksittyä 2 g massaa.
4. **vhh-korvapuustit**: kanelin 1 rkl:n massa puuttuu Fineli 11184:n paikallisesta
   mitoituksesta. Psylliumin aiempi 8 g/RKL on tarkistettava suhteessa Fineli 31681:n
   10 g/RKL-standardiin; myös juustojen tuotevastaavuus ja kumulatiivinen summa.
5. **keto-mutakakku**: suolan lisäksi sokerittoman tumman suklaan tuote, polyolit,
   kaakaopitoisuus, kaakaojauheen 2 rkl ja vaniljauutteen 1 tl. Nykyinen suklaan
   0,76875 g HH-poisjättö ei yksin todista tuotteen vastaavuutta.
6. **keto-suklaakeksit**: sama suklaa-/vanilja-/suolatyö; mantelijauhon 0,972 g/annos
   on lähellä yksittäisrajaa, joten koostumus- ja määräepävarmuutta ei voi sivuuttaa.

Järjestys on tutkimusprioriteetti, ei palautuslupaus. Kaikki kuusi täydellistä tulosta,
ainesrivisyötteet ja fingerprintit pysyvät ennallaan. Uusi erä ei käynnisty.

## Kokoelmatulos ja tarkistukset

- 97 laskettua GK-arvoa säilyy täsmälleen, myös pyöristämättömänä ja luokituksineen.
- 0 laskettua arvoa muuttuu toiseksi numeroksi; 4 palautuu nulliksi.
- 225 ennestään keskeneräistä säilyy täydellisine tuloksineen ennallaan.
- Yhteensä 326: 97 laskettua / 229 keskeneräistä, 29,8 %, nettomuutos −4
  ja −1,227 prosenttiyksikköä verrattuna julkaistuun 101/326-tilaan.
- Historiallisten baselinejen, 2B6E-tutkimuksen, koostumuskatalogin ja muiden
  muuttumattomien mallien SHA-256-lukot tarkistetaan regressioissa.
- Strict nutrition audit, GK-auditointi, molemmat nykyinventaarioiden kattavuusauditit,
  GI/GK 82/82, yksikkötestit 152/152, build PASS (691 reittiä), staattiset testit
  24/24 ja CI-valitsin 12/12. Viimeisen HEADin GitHub Actions todennetaan PR:n
  tarkistuksissa ja loppuraportissa.
- CI:n GI/GK-vaiheen pitää oikeasti ajaa 82 testiä; deploy on PR-ajossa ohitettu.

Uusi PR jää Draft-tilaan riippumatonta katselmointia varten. Tämän ehdotuksen
97/326-tilaa ei ole julkaistu tuotantoon.

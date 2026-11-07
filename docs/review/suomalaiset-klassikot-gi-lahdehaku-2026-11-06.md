# Suomalaiset suosikit – kohdennettu GI-lähdehaku, vaihe 2

Päiväys 2026-11-06. Tila: **CANDIDATE / HOLD**, ei laskentatietue, ei uusi GI-hyväksyntä. Käytetään yhdessä `suomalaiset-klassikot-gk-valmistelu-2026-11-06.md`-muistion ja viiden `reseptit/raakileet/`-tiedoston kanssa.

## Mitä vahvistui alkuperäisistä mittaustutkimuksista?

| Tuote | Ulkoinen havainto | Vastaavuus tämän PR:n reseptiin | Päätös |
| --- | --- | --- | --- |
| **Spagetti** | De Cecco Spaghetti n°12, GI 50; Glycemic Index Search, Scazzina et al. (2016), julkaistu tutkimus | PR:n Marry me -reseptissä lukee vain `durumvehnäspagettia`, ei De Cecco n°12 eikä dokumentoitua valmistusaikaa | **HOLD – mitattu tuote löytyy, mutta tämän reseptin osuma puuttuu** |
| **Penne** | De Cecco Penne mezzane, GI 47; Scazzina et al. (2016). Myös Barilla durum-Penne, GI 50, samassa aineistossa | PR:n uunifetapasta käyttää nimeämätöntä durumpenneä; penne ei tarkoita automaattisesti samaa valmistetta kuin penne mezzane | **HOLD – täsmätuote ja kypsennys sidottava** |
| **Makaroni** | Jenkins et al. (1986) vertasi macaroni- ja spaghetti-tuotteita: makaroni GI 68 ± 8, spagetti GI 45 ± 6; tuote-erot olivat olennaisia | Linssimakaronilaatikon durumvehnämakaronin brändi, muoto ja kypsennys eivät vastaa vahvistetusti kokeen tuotetta | **HOLD – ei siirretä 68:aa uuteen tuotteeseen** |
| **Linssit** | Jenkins et al. (1982), keitettyjen linssien glukoosivasteen mittaustutkimus, mutta lajike- ja tuotevastaavuus tähän kuivaan vihreään linssiin jää avoimeksi | `150 g kuivia vihreitä linssejä` on ryhmä, ei yksilöity tutkimustuote | **HOLD – ei ryhmä-GI:tä** |
| **Riisipuuro ja ruispiirakkakuori** | APT-nimisuojalle löytyy vahva valmistusohje, **ei tässä lähdehaussa varmistettua suoraan mitattua GI:tä täsmälleen tälle karjalanpiirakalle** | Pelkän riisin GI tai ruisleivän GI ei vastaa valmispiirakan tai sen eri komponenttien valmistusmatriisia | **HOLD – perinnereseptiä ei vääristetä matalan GK:n vuoksi** |
| **Raejuustobageli** | Tämän testiin tulevan raejuusto-vehnäjauho-leivonnaisen täsmällistä GI-mittausta ei löytynyt kohdennetussa haussa | Yleisen bagelin, vehnäleivän tai jauhon GI ei riitä taikinamatriisin täsmäosumaksi | **HOLD – ravintokoostumus voidaan selvittää erikseen** |

Tässä ei ole laskettu yhdenkään reseptin GK-arvoa. GI:t 50, 47, 68 ja 45 ovat **tutkimuskohteiden julkaistuja tuloksia**, eivät Recipavon hyväksyttyjä ainesosatietueita. Etenkin makaronin/spagetin keskinäistä eroa ei pidä peittää yleisellä `pasta`-GI:llä.

## Repositorion nykyinen GI-aineisto

`docs/nutrition/glycemic-index-records.json` sisältää mm. seuraavat olemassa olevat merkinnät:

- `ehold-penne47`: De Cecco penne mezzane GI 47, mutta `matchKind: ANALOG`, `confidence: LOW`, `qualityTier: SUPPLEMENTARY` – **ei uusi automaattinen PASS**.
- `pasta-category-mean-gi-52`: `matchKind: CATEGORY_MEAN` – **ei hyväksyttävä täsmä-GI näille resepteille**.
- `rice-category-mean-gi-67`: `matchKind: CATEGORY_MEAN` – **ei kelpaa karjalanpiirakalle**.
- `ehold-rice-jasmine68`: jasmine-riisin analogia – **ei kelpaa nimettömälle puuroriisille**.

Lähdeviitteen kirjaaminen ei nosta olemassa olevan GI-tietueen näyttöluokkaa. Erityisesti jo `ehold`-statuksella olevaan aineistoon ei kosketa tässä PR:ssä. Jos tarkka tuote myöhemmin varmistuu, omistaja katselmoi mahdollisen uuden täsmäversion erillisessä GK-PR:ssä omalla lähdeketjullaan.

## Tutkimuslähteet

1. <https://glycemicindex.com/gi-search/> – GI Research Service -tietokanta, tuotekohtaiset spaghetti/penne-tulokset (valmistaja, tutkimus ja aikaleima).
2. <https://pubmed.ncbi.nlm.nih.gov/34828822/> – *Glycemic Index Values of Pasta Products: An Overview*, Foods 2021. Kuvaa tutkimusten hajonnan; keskiarvoja ei hyväksytä täsmäosumiksi.
3. <https://pubmed.ncbi.nlm.nih.gov/3743316/> – *Glycemic response to pasta: effect of surface area, degree of cooking, and protein enrichment*, 1986. Makaroni-/spagetti-vertailu.
4. <https://pubmed.ncbi.nlm.nih.gov/6293296/> – *Effect of processing on digestibility and the blood glucose response: a study of lentils*, 1982. Valmistusmenetelmän vaikutus.
5. <https://www.ruokavirasto.fi/yritykset/oppaat/nimisuojattujen-elintarvikkeiden-valvontaohje/nimisuojattujen-elintarvikkeiden-valvontaohje/> – liite 12 Karjalanpiirakka APT, ainesosat, mitat, paisto ja sallittu voitelu.
6. <https://www.martat.fi/reseptit/karjalanpiirakat/> – perinnevalmistuksen käytännön vertailu.

## Hyväksyntä- ja yksilöintilista

- [ ] **Pasta 1:** valitse yksi ostettavissa oleva tarkka spagettituote ja kirjaa tuoteviite, kuiva massa, ravintopakkaus, keittoaika ja tutkimuksen täsmällinen vastaavuus. Jos ostetaan eri tuotetta kuin GI-kokeessa, **ei automaattista GI:n siirtoa**.
- [ ] **Pasta 2:** vastaava penne-tuotteen mittaus–pakkaus–valmistus-ketju.
- [ ] **Kasvislaatikko:** valitse tarkka makaroni ja vihreän linssin tuote ja tee molemmille erilliset vastaavuuspäätökset.
- [ ] **Perinnepiirakka:** yksilöi riisin tarkka lajike, pakkaus, valmis puuro, kuori, kaulintajauho ja voitelun imeytynyt massa; tarvittaessa käsittele GI:n tutkimustarve koko valmiille tuotteelle. Nimi varmistetaan APT-eritelmää vastaan.
- [ ] **Bagelit:** yksilöi raejuuston tuote ja vehnäjauho, mittaa paistosaanto. Älä käytä tavanomaisen bagelin GI:tä eri valmistustekniikan vuoksi.
- [ ] **CHO-kattavuus:** kirjaa myös maitotuotteiden, tomaatin, sipulin ja mausteiden imeytyvät hiilihydraatit oikealla EU-/Fineli-määritelmällä. Ei automaattisia nollia.
- [ ] **Koko laskelma:** nykyisen `docs/nutrition/README.md`-politiikan mukaan yksittäinen ilman soveltuvaa GI:tä jäävä ainesosa saa olla **alle 1 g** imeytyvää hiilihydraattia/annos, ja näiden summa **alle 2 g**/annos. Täsmälleen 2 g estää. Tuntematon määrä tai merkittävä vastaavuuspuute estää.
- [ ] **Arvio, ei mittaustulos:** GK = Σ (GI × imeytyvä hiilihydraatti g/annos) / 100, kun näyttöportit läpäisty. Ainesosista johdettu GK ei ole valmiin sekaruoan kliinisesti mitattu GI.
- [ ] Tallenna resepti-, CHO- ja GI-lähteiden tarkisteet sekä katselmoijan päätös ennen julkaisua.

## Suunnattu etenemispäätös

1. **Pienimmän GI-riskin tutkimus ensin:** Marry me -kanapasta ja uunifetapasta, koska valmiiksi mitattuja tuotekohtaisia pastaehdokkaita löytyy. Ei kuitenkaan hyväksyntää ennen tuotteen vastaavuusnäyttöä.
2. **Seuraava:** linssimakaronilaatikko, koska se tarvitsee erikseen sekä makaronin että vihreän linssin GI-osuman.
3. **Perinnön ja leivän erityisryhmä:** karjalanpiirakka ja raejuustobagelit. Näissä on olennaiset GI-matriisivajeet. **Älä yksinkertaista reseptiä vain GK-PASSin saavuttamiseksi.**

Katselmointistatus: **5/5 RECIPE DRAFT, 0/5 GK APPROVED, 0/5 PUBLISHED.**

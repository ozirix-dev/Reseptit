# laskeGK 10 – ChatGPT:n toinen riippumaton GI/GK-tutkimuserä

**Tila:** RESEARCH HANDOFF, ei numeerista tai sanallista GK-julkaisuhyväksyntää
**Päivä:** 18.11.2026 (Europe/Helsinki)
**Lähde:** `ozirix-dev/Reseptit` `main` @ `e8ed43ed525a9cb6abbe61b94bc1c036153979c7`
**Rinnakkainen Codex-toteutus:** [PR #706](https://github.com/ozirix-dev/Reseptit/pull/706), katselmoinnissa havaittu HEAD `655a7a12d5b1edc69e6c5344c1108684bcc29b60`
**Edellinen rinnakkaiserä:** [ChatGPT #709](https://github.com/ozirix-dev/Reseptit/pull/709), 10 eri alkuperäisreseptiä.
**Työn omistajuus:** ChatGPT kirjoittaa vain tätä tutkimustiedostoa omalla haarallaan. #706 kuuluu Codexille.

## Menetelmä ja tuloksen luonne

Valitsin kymmenen uutta, `status: published` -alkuperäisreseptiä, joiden ID:t esiintyvät mainin `docs/nutrition/new-public-gk-pending-sources.json`-rekisterissä. Valinta kohdistuu sokerilla makeutettuihin ruokiin, puuroihin, pastoihin, palkokasveihin, perunaan ja erittäin vähähiilihydraattiseen paistokseen. Edellisen #709-erän reseptit eivät kuulu tähän erään.

Luin jokaisen mainin FI-ainesluettelon ja `docs/nutrition/calculations/<recipe_id>.json`-syötteen sekä #706:n ajantasaisen `gk-reviewed-portions.json`-rivin. Laskin aineskohtaiset annoshiilihydraatit kaavalla `grammat × saatavilla olevat hiilihydraatit/100 g ÷ annokset`, käyttäen syötteen kirjattuja yksikkömassoja ja soveltuvia syötävän osuuden/retention kertoimia. Laskin #706:n erikseen katselmoidut `wholeCarbohydrateOnly.compositionMatches`-korvaukset omana, eksplisiittisenä skenaarionaan. Tällä tavalla voidaan tarkistaa aritmetiikka, ei itsenäisesti todistaa lähteen tuotekohtaista vastaavuutta, GI:tä tai ihmisillä mitattua aterian vaikutusta.

Käyttöliittymään ei tehty muutoksia; lähde-/reseptisidoksia ei kirjoitettu uudelleen. Tämän raportin tiedot **eivät ole julkaistuja uusia ravintoarvoja**. `main`-syötteen hyväksyntätila ei muutu sillä, että #706:n erillinen skenaario antaa luvun.

## Kymmenen alkuperäisreseptin tulokset

| Resepti | Mainin reseptiannos / tarkistettu HH-tieto | Uusi lisäarvo / avoin ehto |
| --- | --- | --- |
| [Puolukkakiisseli](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/jalkiruoat/puolukkakiisseli.md) | 1/6 kiisselistä: **34,36 g** saatavilla olevaa HH:ta. Sokeri **24,77 g** (72,1 %), perunatärkkelys **5,17 g**, puolukat **4,43 g**/annos. | Sokerin ja perunatärkkelyksen arjen merkitys kannattaa näyttää. Finelin sokerin desilitramuunnos **85 g/dl** on kotitalousmitta, ei käyttäjän oma punnitus. Aiempi #706-katselmointi kuvaa tämän jo. Ei numeerista GK:ta sokeritutkimuksen perusteella. |
| [Raparperikiisseli](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/jalkiruoat/raparperikiisseli.md) | 1/8 kiisselistä: **28,54 g** HH:ta, josta sokeri **21,23 g** (74,4 %), perunatärkkelys **3,88 g**, raparperi **3,44 g**. | Nimetty sokerin osuus on merkittävä. Valmis kypsennetty tärkkelyskiisseli ei vastaa erillistä raparperin tai sokerin GI-koetta. #706:ssa on jo sokerihuomautus. |
| [Mustaherukkavispipuuro](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/aamupalat/mustaherukkavispipuuro.md) | 1/8 valmiista puurosta: **noin 29,00 g** HH:ta #706:n koostumusskenaariossa, josta tumma mannasuurimo **14,85 g**, tavallinen sokeri **10,61 g**, mustaherukat **3,04 g** ja vanilliinisokeri **0,50 g**. | **UUSI P1-lähdetarkistus:** mainin Fineli #113 -syöte muuntaa 2 dl tummia mannasuurimoita **200 grammaksi (100 g/dl)**. Monissa keittiömittataulukoissa yleisen mannasuurimon arvo on noin **70 g/dl**, ja Myllyn Parhaan tavallisen mannasuurimon 1,0 kg / 1,25 l -ohje merkitsee **80 g/dl**. Tämä **ei vielä todista**, että tumman tuotteen 100 g/dl olisi virhe. Tarkista tuotekohtainen massa/punnitus ennen kuin 29 g esitetään liian varmana tai arvoa muutetaan. |
| [Uuniriisipuuro](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/aamupalat/uuniriisipuuro.md) | 1/4 padasta: **44,15 g** (noin 44,2 g) #706:n kokonaishiilihydraattiarviossa. Puuroriisistä **32,13 g** ja täysmaidosta **12,00 g**; voiteluvoista noin 0,02 g. | 2 dl kuivaa riisiä on Fineli-kotitalousmitalla **170 g koko erään**. Tämä on kuivapaino, eikä kypsän puuron 100 g:n luku. Tarjoilun maito, hillo ja sokeri puuttuvat reseptin laskennasta. #706-arvio on laskennallisesti yhdenmukainen. |
| [Parsakaali-cashewpasta](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/parsakaali-cashewpasta.md) | 1/3: **56,48 g** HH:ta, josta kuivasta täysjyväspagetista **50,50 g**, cashewpähkinöistä **3,76 g** ja parsakaalista **1,91 g**. | **GI-herkkyys:** julkaistussa 14 terveen osallistujan spagettikokeessa täysjyväspagetin GI oli 38, joten **vain spagettiosan havainnollistava** lasku olisi 50,5 × 0,38 = **19,19 GK**. Toisille testatuille spageteille ilmoitetut GI:t 33 ja 41 tuottaisivat saman hiilihydraattimäärän kanssa **16,67** ja **20,71**. Nämä ovat **eri tuotteiden erillisiä vertailuja, eivät reseptin epävarmuusväli tai hyväksytyt GK-tulokset**. Luokkaraja 20 tekee liian varman luokan riskialttiiksi. #706 tunnistaa valmistuseron. |
| [Sitruuna-parsapasta](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/sitruuna-parsapasta.md) | 1/3 annoksesta: **tuoreesta kananmunafettuccinesta 45,03 g HH:ta** (250 g raakatuorepastaa koko erässä). Parsa noin **2,67 g** ja pinjansiemenet noin **0,67 g**. | Vähintään **48,51 g/annos tunnettujen ainesosien laskennallista osuutta**, **ei hyväksyttyä koko annoksen HH-arvoa**. Sitruunankuoren ja parmesaanin koostumus/käytetty määrä, tuorepastan tuotemääritelmä sekä kypsennyksen/valutuksen rajaus puuttuvat. #706:n fettuccine-aineshuomio on oikein erotettu koko annoksesta. |
| [Kookos-linssikeitto](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/kookos-linssikeitto.md) | 1/4 kattilasta: mainin rajoitettu osasumma **21,51 g**; #706:n tarkemmilla AFCD-kohdistuksilla **29,87 g** koko annoksen HH:ta. Linsseistä **18,32 g**, säilyketomaateista **6,00 g**, säilykekookosmaidosta **1,73 g**. | 400 ml täysrasvaista kookosmaitoa vastaa käytetyllä AFCD-lähteen tiheydellä noin **408 g**. Huuhtelussa mahdollisesti hävinneitä linssejä ei mitattu, mutta koko kattilallinen tarjoillaan. #706:n arvo täsmää laskentaan, uusia lähdekorjauksia ei tarvita ilman uutta näyttöä. |
| [Papu-myskikurpitsapelti](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/papu-myskikurpitsapelti.md) | 1/4 kasvispellistä kastikkeineen: #706:n katselmoitu skenaario **24,22 g** HH:ta. Myskikurpitsasta **12,08 g**, valutetuista säilykepavuista **7,02 g**, ruusukaalista **2,90 g** ja soijajogurtista **1,43 g**. | Mainin kypsän valkopavun yleisviite antaa pavuille **8,05 g** per annos, kun #706:n valutettuja säilykepapuja vastaava lähde antaa **7,02 g**. Ero johtuu lähteiden eri ruokamuodoista, ei laskuvirheestä. Tuotekohtaisen soijajogurtin makeutus on esitettävä rajauksena. |
| [Parmesaani-lyttyperunat](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/alkuruoat/parmesaani-lyttyperunat.md) | 1/4 pellistä: alkuperäisten syötteiden aritmeettinen summa **23,74 g**, mutta #706:n perusteltujen parmesaani- ja valkosipulijauheen koostumuskorvausten summa **23,37475 g**, eli **noin 23,4 g**. | Tämä **ei ole ristiriita**: alkuperäisellä USDA-parmesaaniviitteellä on 3,22 g/100 g HH ja valkosipulijauheella 72,73 g/100 g; #706 käyttää AFCD-parmesaania 0 ja norjalaista valkosipulijauhetta 63,7 g/100 g. Peruna säilyy saman Fineli #28955 -lähteen piirissä. Säilytä lähdeversion selitys. |
| [Pinaatti-raejuustopaistos](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/aamupalat/pinaatti-raejuustopaistos.md) | 1/6 paistoksesta: reseptin nykyinen **1,06 g** HH:ta. Raejuuston laskennallinen osuus **0,94 g**, muiden keskeisten ainesten osuudet pieniä. #706:ssa on perusteltu **sanallinen pieni GK yhdelle vakioannokselle**. | **UUSI P1-käyttöehdotus:** selvitä, voiko sanallisen pienen GK:n säilyttää myös 0,5–2 annokselle. Yhden annoksen noin 1,06 g + koko pois jätetyn mausteen enintään noin 0,17 g tarkoittaisi kahdelle annokselle alle 2,5 g HH:ta. GI 100 -havainnollistus antaisi GK:n alle 2,5, ja jopa GI 200 -stressitesti alle 5. Nämä eivät ole mitattuja GI-arvoja eivätkä muodosta automaattista luokkahyväksyntää. Päätös edellyttää olemassa olevan luokkaraja- ja lähdepolitiikan soveltuvuusarviota sekä annoskohtaisia regressioita. |

## 1. Tärkein uusi P1: tumma mannasuurimo, 100 g/dl vai muu massa?

Reseptin 2 dl muunnetaan Fineli-syötteessä 200 g:ksi. Fineli #113 antaa 59,4 g saatavilla olevaa HH:ta/100 g. Sen vuoksi mannan laskennallinen HH-osuus on **14,85 g/annos**.

**Pelkkä vaihtoehtoinen, ei hyväksytty herkkyyslasku samalla hiilihydraattipitoisuudella:**

| Tarkasteltu massaoletus | Mannaa koko erässä | Mannan HH/annos | Koko puuron laskennallinen HH/annos |
| --- | ---: | ---: | ---: |
| Repo/Fineli dark `100 g/dl` | 200 g | 14,85 g | 29,00 g |
| Valikoitu 80 g/dl -vertailu | 160 g | 11,88 g | 26,03 g |
| Yleisen mannan 70 g/dl -vertailu | 140 g | 10,40 g | 24,55 g |

Lähteet:
- [Nykyinen laskentasyöte, Fineli #113](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/docs/nutrition/calculations/mustaherukkavispipuuro.json).
- [Keittotaidon 70 g/dl -keittiömitta](https://www.keittotaito.com/mittaa_oikein.html) ja [Reseptivihkon 70 g/dl](https://reseptivihko.net/raaka-aineet/mannasuurimo): nämä eivät yksilöi tummaa tuotetta.
- [Myllyn Parhaan tavallinen mannasuurimo: 1 kg per 1,25 l ruokapalveluohjeessa](https://www.myllynparas.fi/foodservice/tuotteet/mannasuurimo-20-kg), eli johdettu 80 g/dl **eri tuotteelle**.
- [Myllyn Parhaan tumma mannasuurimo](https://www.myllynparas.fi/tuotteet/tumma-mannasuurimo-1-kg): tuotemääritelmä, ei tässä löytynyt omaa desilitrapainoa.

**Toimi näin:** tarkista ensin Finelin tietueen kotitalousmitan alkuperäinen tarkoitus ja mittausmenetelmä. Etsi valmistajan *tumman* tuotteen massatieto tai varmennettu kuivapunnitus. Älä muuta 100 → 70/80 vain vertailutaulukon perusteella. Jos tuotteiden poikkeama jää ratkaisematta, ilmaise massaoletus/annos ja käytä perusteltua herkkyysväliä siellä, missä nykyinen menetelmä sallii. Muutokset vaativat nykyreseptin ja syötteen katselmoinnin.

## 2. Toinen uusi P1: erittäin pieniä hiilihydraattimääriä sisältävä GK-annosvalinta

Pinaatti-raejuustopaistoksen sanallinen LOW arvio on nykyisin sidottu yhteen annokseen. Koko päivän aikuisen hoitoon se ei anna insuliiniohjetta, mutta **puolikkaan tai kahden palan arjen annosvertailu** voi silti olla perusteltu.

Ainesosatiedon ja raakamäärärajan avulla on mahdollista tehdä konservatiivinen herkkyyskoe: korkeintaan yhden gramman savupaprikaa koko kuuden palan erässä = enintään noin 0,167 g maustemassaa/pala, minkä hiilihydraattipitoisuus ei voi massana ylittää 100 %. Kaksi palasta sisältää siksi nykyarvion 2,12 g lisäksi enintään noin 0,334 g tarkistamatonta mausteosuutta (yhteenlaskettu enintään noin 2,45 g). **GI 100 ja 200 ovat vain stressitestin arvoja, eivät reseptin havaittu GI.**

Tämä osoittaa, että nykyinen 1-annoksen tekninen rajaus saattaa olla liian jäykkä, mutta ei anna lupaa automaattiseen LOW-luokan julkaisuun muille annoskoille. Tarvitaan hyväksytty päätöskriteeri, johdonmukainen FI/EN/SV/TH-esitys, rajatapaustesti ja katselmointi.

## 3. GI-tutkimusten soveltuvuus (ei uusia resepti-GI-arvoja)

- [Papakonstantinou ym. 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC8909947/) tutki 14 tervettä koehenkilöä ja kolmea erilaista spaghetti No 7 -tuotetta, GI 33/38/41. Eri tuote, valmistus ja annos tekevät tämän hyödylliseksi *havainnollistukseksi*, eivät täsmä-GI:ksi parsakaali-cashewpastaan. Lähes GK 20 -rajaan osuva pastan laskennallinen vertailu ei riitä luokitusporttiin.
- [Dodd ym. 2011](https://pubmed.ncbi.nlm.nih.gov/21831990/) havaitsi kolmessa seka-ateriassa, että ainesosa-GI:stä laskettu GI oli vastaavan aterian mittausta korkeampi; ero riippui ateriasta. Se ei anna kaikille resepteille samaa korjauskerrointa.
- [Kansainväliset GI-taulukot 2021](https://ajcn.nutrition.org/article/S0002-9165%2822%2900494-4/fulltext) edellyttävät valmistustavan ja näytteen vastaavuuden huomiointia. Samanniminen aine ja yleinen ryhmäkeskiarvo eivät ole tämän kotireseptin ihmis-GI-mittauksia.
- Tässä erässä hiilihydraatin annosmäärä on tärkein käyttäjätieto. **GK:ta ei käytetä insuliiniannoksen tai yksilöllisen glukoosivasteen määräämiseen.**

## 4. Luovutus, prioriteetit ja nykytilan raportointi

**Käsitelty:** 10/10 uutta alkuperäisreseptiä (eivät esiinny ChatGPT:n #709-erässä). Neljällä oli valmiiksi numeerinen annos-HH mainissa; viidelle Codexin #706-haaran erillinen koostumusskenaario tuottaa koko annoksen HH-arvion ja yhdellä (sitruuna-parsapasta) on vain osakomponenttien vahvistetut arvot. **Ei uusia hyväksyttyjä GK-numeroita, GK-luokkia, reseptijulkaisuja, ravintoarvomuokkauksia tai tuotantotoimia.** Aiempiin #706-tietoihin nojautuvat viisi kokonaissummaa eivät ole tämän tutkimuksen uusia julkaisutuloksia.

**P1:** Varmista tumman mannan kuivapaino ennen liian tarkan vispipuuron HH-arvion vahvistusta. Arvioi erittäin pienen HH:n GK-luokan skaalautuvuus annoksiin 0,5/1/1,5/2 yleistä luokituspolitiikkaa rikkomatta.

**P2:** Kiisselien sokeriosuuden ymmärrettävä käyttäjäviesti, pastan tuotekohtainen kuivapaino ja pasta-GI:n raja, säilykepapujen ja parmesaanin lähdekorvauksen perusteltu dokumentointi.

**Säilytä:** #706:n kohtuullisesti jo ratkaistut laskenta-/lähdeskenaariot; älä avaa uudelleen ilman uutta lähdettä. Erityisesti kookos-linssikeiton 29,87, papu-myskikurpitsapellin 24,22 ja parmesaaniperunoiden 23,37 g vahvistuvat aritmeettisessa laskussa.

**Avoin:** mustaherukkavispipuuron tuotekohtainen 1 dl:n paino; sitruuna-parsapastan lopullinen pääraaka-aine-/tietuevastine ja kokonaisarvio. Niitä ei ratkaistu arvauksella.

### Turva- ja integraatiorajat

- Luovuta tämä tutkimustiedosto Codexin #706-vastuulliselle **luettavaksi**, ei suoraan cherry-pickattavaksi GK-sisältömuutokseksi.
- Ainoastaan #706:n nimetty kirjoittava omistaja voi päättää, miten havainto muunnetaan kanoniseen lähde- ja katselmointiaineistoon. Uudet GI-laskelmat, päivitykset ja sanalliset luokat vaativat viralliset testit, syöte-/valmistus-SHA-sidokset, kieliversiot ja relevantin hyväksynnän.
- Tämä tutkimus-PR muuttaa ainoastaan tämän uuden Markdown-raportin. GitHubissa suoritettava CI tarkistetaan viimeiselle HEADille. Paikallista npm-buildia, täydellisiä selain- tai ravintoauditointiajoja ei suoritettu.
- Raportti on versionlukittu tilannekuva; tuleva #706:n muutos voi korjata tässä nimetyt avoimet kohdat. Älä sekoita myöhempää tilannetta alkuperäiseen otokseen.

## 5. Ajankäytön jatko-oppi

Sama ainesosa toistuu monessa reseptissä, mutta tuote ja valmistustapa eivät välttämättä vastaa toisiaan. Tässä erässä valmiit #706:n lähdekorvaukset mahdollistivat usean kokonaissumman tarkistamisen yhdessä. Ainoa merkittävä uusi lähderiski löytyi *kotitalousmitasta*, ei GI-kaavasta.

Ennen seuraavaa 10–30 reseptin erää kannattaa hakea **massamuunnosten ja annosmääritelmien ristiriidat** automaattisesti esiin prioriteettijonoon. Älä korjaa kaikkia mittataulukoita yhdellä yleisluvulla tai laske laaduksi toistettua lähdekartoitusta.

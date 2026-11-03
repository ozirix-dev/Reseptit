# GK80: kansainväliset GI- ja GK-lähteet

Tarkistettu 3.11.2026. **CONDITIONAL GO:** rakenna paikallinen, lähdeviitteinen CHO/GI-sovitin. Käytä koostumustietojen perustana THL:n Fineliä ja USDA FoodData Centralia. Lisää GI-havaintoja valikoiduista ihmistutkimuksista, joiden uudelleenkäyttö on vahvistettu havaintotasolla. **NO-GO:** palvelun antaman GK-luvun automaattinen tallennus ja julkaisu. Yhtäkään tarkastettua avointa GI-rajapintaa ei voitu hyväksyä kaikkiin käyttötarkoituksiin.

## Lähtötilanne

Ajo erillisessä worktreessä, repo guard PASS, origin ozirix-dev/Reseptit, main `4d6f19a620bb95e771c12f499554bf2cf1f06e51`. `content:sync`, `audit:nutrition` ja `audit:glycemic-load` tuottivat 326 reseptiä. Alkuperäisistä resepteistä 156/326 (47,85 %) on laskettu, 170 puuttuu. Vähintään yksi numeerinen versio: **207/326 (63,50 %)**, joista 41 uutta A- ja 10 B-versiota; 119 puuttuu. Tavoite 261/326 vaatii 54 eri reseptiä. Luvut kuvaavat pinnatun mainin sisältöä; tuotantosivun deployta ei tarkistettu erikseen. 243 on kustannuslaskelman syötemäärä, ei kattavuuden nimittäjä.

Nykyiset sidonnat: [GI-havainnot](glycemic-index-records.json), [reseptisyöte](glycemic-load-pilot-input.json), [julkaisupaketit](gk80-release-registry.json), [laskentamalli](../../site/scripts/glycemic-load-model.ts). GI-lähteissä on mm. Atkinsonin mitattuja havaintoja, analogioita ja erikseen rajattuja luokkakeskiarvoja; CHO-lähteissä mm. Fineli ja AFCD. Rekisteri sitoo hyväksytyt paketit tarkisteisiin. GK/annos = Σ(ainesosan annoskohtainen käytettävissä oleva CHO grammoina × GI/100); reseptiä ei ole mitattu tällä laskennalla. Nykyisessä pilotissa vähäisen puuttuvan GI:n poisjättö vaatii alle 1 g CHO/annos per ainesosa ja alle 2 g/annos yhteensä. Lähteetön nolla ei kelpaa.

Päällekkäisyys: [#226](https://github.com/ozirix-dev/Reseptit/pull/226) käsittelee peruna-/avokadosidontoja, [#227](https://github.com/ozirix-dev/Reseptit/pull/227) Kerala-currya, maksaa ja kevätsipulipannukakkua; [#224](https://github.com/ozirix-dev/Reseptit/pull/224) ja [#223](https://github.com/ozirix-dev/Reseptit/pull/223) ajonohjainta. Myös #219, #214, #213, #210 ja #206 olivat avoinna. Tämän raportin skenaariot eivät laske avoimia PR:iä julkaisuiksi; lopullinen jono vähentää mainiin jo yhdistetyt ID:t.

## Käyttöoikeus ja lähderekisteri

Oikeusvektorin järjestys: **automaattinen haku / laskenta / välimuisti / pysyvä tallennus / johdetun GK:n julkaisu / kaupallinen käyttö / lähdetiedon julkaisu / eräkäsittely**. + sallittu nimetyllä reitillä ja lisenssin ehdoilla; ~ rajoitettu; ? vahvistamatta; − kielletty tai reittiä ei ole. Bibliografisen linkin lisääminen on eri asia kuin lähdetaulukon uudelleenjulkaisu. Hinnoissa 0 tarkoittaa julkista tiedostoa tai maksutonta lukua, ei lisenssin automaattista hyväksyntää. CHO-lähteillä ei ole dokumentoitua käyttökelpoista GI/GK-kenttää; valmistustila ja tietueviite ovat yleensä saatavilla geneerisille tietueille, tuotetiedoille vaihtelevasti. Taulukon laatu arvioi GI-näyttöä; lopullinen reseptisoveltuvuus tarkistetaan erikseen.

| # | Lähde, dokumentaatio ja ehdot | API, sisältö, laatu ja valmistus | Oikeudet | Hinta ja päätös |
|---|---|---|---|---|
| 1 | [Glyc](https://getglyc.com/faq/) · [menetelmä](https://getglyc.com/blog/how-glyc-calculates-nutrition/) | Julkista APIa ei vahvistettu. AI tulkitsee reseptin ja arvioi ravinnon/GK:n; laskuaskeleet eivät yksilöi GI-mittausta. C/D. | −/?/?/?/?/?/?/− | Selainlaskuri 0; LEGAL_REVIEW, myös näyttöportti |
| 2 | [API League](https://apileague.com/apis/compute-nutrition-api/) · [hinnat](https://apileague.com/pricing/) · [rajat](https://apileague.com/docs/quotas-and-rate-limiting/) | REST; Spoonacular-kääre. Dokumentoi GI/GL-ominaisuudet. Raaka-aineviite, prosessi ja CHO-määritelmä eivät riitä hyväksyntään. D. | +/~/?/?/?/~/?/~ | Free 50 tokenia/pv, 1 pyyntö/s, backlink, ei kaupalliseen käyttöön; Rookie $7/kk + ylitykset; LEGAL_REVIEW |
| 3 | [Spoonacular API](https://spoonacular.com/food-api/docs) · [ehdot](https://spoonacular.com/food-api/terms) | REST, ainesosien GK; GI-näytön jäljitettävyys ja valmistussovitus todentamatta. D. | +/~/~/−/−/~/−/~ | Tilauskohtainen; NO-GO pysyvään käyttöön. Ravinto- ja johdannaistiedon tallennuskielto; kirjallisella luvalla käyttäjäpyynnön cache enintään tunti. |
| 4 | [YMove](https://ymove.app/exercise-api/docs) · [ravinto-API](https://ymove.app/nutrition-api) | REST v2, GI/GK beta; ainesosat tai kuva, katalogin CHO/kuitu, valmistusnäytön DOI-sidonta vahvistamatta. C/D. TS SDK ja MCP MIT, data eri asia. | ~/~/?/?/?/?/?/~ | Glycemic Pro+, waiver, enintään 30 ainesosaa/kutsu; NO-GO maksuttomaan kokeeseen, LEGAL_REVIEW pysyvään käyttöön |
| 5 | [REAL Nutrition](https://realnutrition.com.au/glycaemic-index-search-tool/) | Selain; Sydney 2021 -johdannainen, annos-GK ja simuloitu vaste; käsittelysuodatin, alkuperäinen mittaus tarkistettava. A–D rivistä riippuen. | −/?/?/?/?/?/?/− | 0; LEGAL_REVIEW; ei itsenäinen mittauslähde |
| 6 | [GI Lookup](https://gi.puddingtime.net/) · [koodi](https://github.com/mph-llm-experiments/gi) | Selain/MIT-koodi. GI Atkinson 2021, CHO osin USDA, GK vakioannoksille; lähdeaineiston tekijänoikeus nimenomaisesti erillinen. | −/?/?/?/?/?/?/− | 0; NO-GO GI-importtiin; ohjelmiston lisenssi ei kata taulua |
| 7 | [Sydneyn GI Search](https://glycemicindex.com/gi-search-instructions/) | Hakusivu, ei vahvistettua avointa APIa. Mitattu GI, GK annokselle, ruokamuoto ja lähde, myös julkaisemattomia tuloksia. A/B, laatu vaihtelee. | −/?/?/?/?/?/?/− | 0 luku; LEGAL_REVIEW bulk-käytölle |
| 8 | [GI Foundation](https://www.gisymbol.com/) | Sertifiointi ja kuluttajatieto, ei vahvistettua bulk-APIa; sertifiointi ei ole tarkka GI/GK-tietue. | −/?/?/?/?/?/?/− | Luku 0, sertifiointi erillinen; NO-GO syötteeksi |
| 9 | [Atkinson 2021](https://doi.org/10.1093/ajcn/nqab233) | Systemaattinen katsaus ja kaksi liitetaulukkoa, yli 4 000 ruokaa; laadukkaampi ja heikompi joukko, valmistus ja testiviite; GI mitattu, GK laskettu. A/B. | ?/?/?/?/?/?/?/? | Luku osin 0, liitteiden kaupallinen tuontioikeus vahvistamatta; LEGAL_REVIEW |
| 10 | [Atkinson 2008](https://doi.org/10.2337/dc08-1239) | Vanhempi tutkimuskooste; GI/GK, osa päällekkäinen 2021:n kanssa; luokkakeskiarvot erilleen havainnoista. A–C. | ?/?/?/?/?/?/?/? | Luku 0; LEGAL_REVIEW; ei toista ääntä samalle mittaukselle |
| 11 | [Non-Western compendium](https://www.nature.com/articles/s41387-020-00145-w) | CC BY 4.0 artikkelille, kolmansien osapuolien merkinnät huomioitava. Taulukoissa maa, valmistus, testiväestö, asteikko ja viite; GI ja osin GK. A–D. Ei omaa APIa. | ~/~/~/~/~/~/~/~ | 0; CONDITIONAL, alkuperäisviite ja taulukkorivin oikeudet ennen tuontia |
| 12 | [Vîrlan ym., Moldova](https://www.mdpi.com/2304-8158/14/1/12) | CC BY 4.0; mitattu riisin GI, 4 riisityyppiä ja keittoajat; CHO erotuslaskennalla. A testatulle tuotteelle, B vain perustellulle vastineelle. Ei APIa. | ~/+/+/+/+/+/+/~ | 0; GO tutkimushavainnoille, ei yleisriisin oletukseksi |
| 13 | [Henry ym., Britannia](https://pmc.ncbi.nlm.nih.gov/articles/PMC2699495/) | 33 mitattua perusruokaa, riisi/peruna/pasta/leipä; valmistus ja annos tiedossa, vanhempi protokolla. A/B. Ei APIa. | ?/?/?/?/?/?/?/? | Luku 0; LEGAL_REVIEW käyttöoikeus |
| 14 | [Yang ym., Kiina](https://www.wjgnet.com/1007-9327/full/v12/i21/3430-T3.htm) | CC BY-NC 4.0; mitattuja vilja- ja mukulatuotteita, prosessi ja koe. A/B. Ei APIa. | ~/~/~/~/~/−/~/~ | 0; NO-GO kaupalliseen putkeen |
| 15 | [Shobana ym., Intia](https://pmc.ncbi.nlm.nih.gov/articles/PMC9552392/) | CC BY-NC-SA 4.0; 12 valmistetta, mitattu GI ja käytettävissä oleva CHO, mm. paistettu dosa ja höyrytetty idli. A/B. | ~/~/~/~/~/−/~/~ | 0; NO-GO kaupalliseen putkeen |
| 16 | [Etelä-Intian aamiaiset](https://pmc.ncbi.nlm.nih.gov/articles/PMC9304465/) | Mitattu GI ja laskettu GK, valmistustason tiedot; ei dokumentoitua APIa; lisenssi vahvistamatta. | ?/?/?/?/?/?/?/? | Luku 0; LEGAL_REVIEW |
| 17 | [TBCA Brasilia, Resposta Glicêmica](https://tbca.net.br/arquivosestaticos/Tabelas_Complementares-Resposta-Glicemica_JAN2025.pdf) | Portugalinkielinen PDF, mitattu IG, laskettu CG, CHO ja viite; keitetty riisi/papu, annos ja otos. A/B, osa otoksista pieni. | ?/?/?/?/?/?/?/? | 0; LEGAL_REVIEW, viittausohje ei bulk-lisenssi |
| 18 | [Japanin Hoshinishiki-riisitutkimus](https://www.jstage.jst.go.jp/article/jsnfs/72/2/72_85/_pdf) | Japaninkielinen ihmistutkimus, lajikekohtainen glukoosivaste; ei valmis GK-API. A/B vain kelvolliselle GI-havainnolle; vaste sellaisenaan ei GI. | ?/?/?/?/?/?/?/? | Luku 0; LEGAL_REVIEW |
| 19 | [Sri Lankan parboiled rice](https://pmc.ncbi.nlm.nih.gov/articles/PMC9477285/) | Alkuperäinen paikallislajikkeiden tutkimus, valmistus ja vaste; ei bulk-APIa. A/B vain menetelmän läpäisseelle riville. | ?/?/?/?/?/?/?/? | Luku 0; LEGAL_REVIEW ennen ingestointia |
| 20 | [Pea/chickpea powder](https://doi.org/10.1080/10942912.2020.1792925) | Ihmis- ja in vitro -osat; kypsennetty/kuivattu jauhe. Mittaus ei vastaa uppopaistettua besania; A testattuun, C in vitro. | ?/?/?/?/?/?/?/? | Luku 0; LEGAL_REVIEW, valmistusportti |
| 21 | [Cellular chickpea flour trial](https://pmc.ncbi.nlm.nih.gov/articles/PMC10131617/) | Tutkimusleipä ja glukoosivaste, eri jauhatus/matriisi; ei tavallisen kikhernejauhon GI. | ?/?/?/?/?/?/?/? | Luku 0; NO-GO korvaavaksi GI:ksi |
| 22 | [Riisi–papu-ateria](https://pmc.ncbi.nlm.nih.gov/articles/PMC5691712/) | Mitattu aterian vaste, ei erillisten ainesosien GI eikä suora GK. Valmistus ja kliininen otos kuvattu. | ?/?/?/?/?/?/?/? | Luku 0; NO-GO GI-syötteeksi |
| 23 | [Mendeley Fullness Factor](https://data.mendeley.com/datasets/b63kw9wk6k/2) | CSV, CC BY 4.0 julkaisijan merkintä; useilta kuluttaja-/kaupallisilta sivuilta kerätty GI ja johdettu GK; primääriviitteet ja oikeusketju heikot, D. | ?/?/?/?/?/?/?/? | 0; NO-GO |
| 24 | [USDA FDC](https://fdc.nal.usda.gov/api-guide/) · [bulk](https://fdc.nal.usda.gov/download-datasets/) | CC0; REST + CSV/JSON, CHO ja kuitu, FDC ID ja valmistustila. | +/+/+/+/+/+/+/+ | 0, avain, 1 000/h/IP; GO CHO |
| 25 | [THL Fineli](https://fineli.fi/fineli/fi/avoin-data) · [CC BY 4.0](https://fineli.fi/fineli/content/file/7) | Virallinen bulk, ei tarvetta käyttää sivuston sisäistä APIa. Käytettävissä olevan CHO:n kenttä, suomalaiset ruoat ja tietue-ID. | +/+/+/+/+/+/+/+ | 0; GO CHO, THL/Fineli ja julkaisuversio |
| 26 | [Open Food Facts](https://openfoodfacts.github.io/openfoodfacts-server/api/) · [ehdot](https://world.openfoodfacts.org/terms-of-use) | ODbL, REST ja bulk, viivakoodi, ravintoarvomerkintä. Maakohtainen CHO ja tuotteen tila tarkistettava; kuvat erillään. | +/+/+/+/~/+/~/+ | 0; CONDITIONAL, erillinen lähdevarasto ja ODbL-arvio ennen yhdistetyn tietokannan jakelua |
| 27 | [FSANZ AFCD](https://www.foodstandards.gov.au/science-data/monitoringnutrients/afcd/datauserlicenceagreement) | Bulk XLSX, CC BY-SA 3.0 AU -pohjainen oma sopimus. CHO-kentissä polyolit eroteltava; ruokatila ja ID. | ~/+/+/+/~/+/~/~ | 0; CONDITIONAL, lisäehdot, attribution ja johdannaisen lisenssi |
| 28 | [Canadian Nutrient File](https://open.canada.ca/data/en/dataset/1b6139bd-ed7e-4043-bc28-ff00e10f3109) | Avoimen hallinnon lisenssi, bulk/portaalin rajapinta; ruoka- ja ravintoaine-ID, kokonais-CHO:n määritelmä tarkistettava. | +/+/+/+/+/+/+/+ | 0; GO CHO lisenssin ja version mukaisesti |
| 29 | [CoFID UK](https://www.gov.uk/government/publications/composition-of-foods-integrated-dataset-cofid) | XLSX; OGL soveltuville Crown-aineistoille, tarkista poikkeukset. Ruokamuoto ja CHO, ei GI:tä. | +/+/+/+/~/+/~/+ | 0; CONDITIONAL tiedostotason oikeuksille |
| 30 | [ANSES Ciqual 2025](https://ciqual.anses.fr/cms/sites/default/files/inline-files/Table%20Ciqual%202025%20doc%20FR_2025_11_19.pdf) | Licence Ouverte; ranskankielinen bulk ja ruokakoodit. Glucides-kentän määritelmä ja puuttuvat arvot säilytettävä. | +/+/+/+/+/+/+/+ | 0; GO CHO |
| 31 | [MEXT Japan](https://www.mext.go.jp/a_menu/syokuhinseibun/index.htm) · [ohje](https://fooddb.mext.go.jp/help.html) | XLSX, virallinen vapaan käytön ja nimeämisen ohje; japaninkieliset kypsät/raa'at tilat, CHO-kenttien massaperusta eroteltava. | +/+/+/+/+/+/+/+ | 0; GO CHO nimetyllä aineistolla |
| 32 | [EuroFIR FoodEXplorer](https://www.eurofir.org/our-tools/foodexplorer/) · [pääsy](https://www.eurofir.org/why-join-eurofir-aisbl/pay-per-view/) | Hakupalvelu ja sopimuspohjainen aineistopääsy, jäsenyys/maksu ja kansalliset ehdot; ei avointa GI-rajapintaa. | ~/~/?/?/?/?/?/~ | Maksu/sopimus; NO-GO ilmaiselle putkelle |
| 33 | [Edamam](https://developer.edamam.com/edamam-docs-nutrition-api) · [ehdot/FAQ](https://developer.edamam.com/api/faq) | REST, app_id/app_key, tekstirivit ja ravinteet; ei dokumentoitua GI:tä. ETag ja suunnitelmakohtainen cache/ruokalisenssi. | +/~/~/~/?/~/~/~ | Hinnoittelu käyttöoikeudesta riippuen, jatkuva reseptilisenssi mahdollinen; NO-GO tähän |
| 34 | [Nutritionix](https://developer.nutritionix.com/docs/v2) · [lisensointi](https://www.nutritionix.com/database) | REST v2, app-id/app-key, teksti/tuote ja CHO/kuitu, ei dokumentoitua GI/GK:ta. | +/~/?/?/?/~/?/~ | Sopimus; LEGAL_REVIEW pysyvään CHO-käyttöön |
| 35 | [fatsecret](https://platform.fatsecret.com/api-editions) · [ehdot](https://platform.fatsecret.com/terms) · [säilytys](https://platform.fatsecret.com/docs/guides/storable-data) | OAuth/REST; CHO ja tuotteet, ei dokumentoitua GI/GK:ta. Tietojen säilytys whitelistin ja sopimuksen mukaan. | +/~/~/~/?/~/~/~ | Ilmaisedition ehdot/attribuutio, kattavampi maksullinen; NO-GO pysyväksi perustaksi |
| 36 | [ICMR-NIN 2024](https://www.nin.res.in/dietaryguidelines/pdfjs/locale/DGI24thJune2024fin.pdf) | PDF, glykeemisiä hiilihydraatteja kuivapainosta; ei GI:tä tässä liitteessä eikä käyttökelpoista keitetyn annoksen massaa suoraan. | ?/?/?/?/?/?/?/? | Luku 0; LEGAL_REVIEW |

REAL ja GI Lookup on erotettu nimenomaisesti jakelureitteinä; niitä ei lasketa itsenäiseksi GI-näytöksi. Ranskan, Japanin, Brasilian ja Suomen virallisia paikalliskielisiä aineistoja tarkasteltiin. Puuttuvaa oikeutta ei päätellä URL:n, avoimen haun, koodilisenssin tai ilmaisen kiintiön perusteella.

## Tekninen reitti ja näytön arvio

- **FDC:** `GET /fdc/v1/food/{fdcId}`, `POST /fdc/v1/foods` tunniste-erälle, `POST /fdc/v1/foods/search` hakusanoille; `api_key`. Poimi ravintoaineen ID, yksikkö, määrä ja tietuetyyppi. Search-osuma ei riitä lähdesidonnaksi. Käytä mieluiten virallista versionoitua bulk-julkaisua. Ei omaa GK-arvoa.
- **Fineli/Ciqual/MEXT:** tiedosto → tarkiste → tietue → dokumentoitu CHO-kenttä. Python CSV/XLSX tuonnissa ja TypeScript sovittimen lukemisessa. Säilytä alkuperäinen desimaali, yksikkö, syötävä osuus, julkaisu ja valmistustila. EU-tyyppisestä käytettävissä olevasta CHO:sta ei vähennetä kuitua uudelleen; USDA:n kokonais-CHO, kuitu ja polyolit vaativat erillisen, tietuetyypille hyväksytyn tulkinnan. Raakapainoa ei kerrota keitetyn ruoan pitoisuudella ilman saantokerrointa.
- **API League / Spoonacular:** vertailuehdokas vasta kun kaupallinen pysyvä käyttö ja johdannaisarvot hyväksytään kirjallisesti. API League `GET /compute-nutrition` palauttaa koostumusta ja ominaisuuksia; token ei ole sama kuin kutsu. Spoonacular: `POST /food/ingredients/glycemicLoad`, API-avain ja JSON `{ingredients: string[]}`; esimerkkivastauksessa `totalGlycemicLoad`, `ingredients[].glycemicIndex` ja `ingredients[].glycemicLoad`, ei mitatun GI:n viitettä eikä CHO-kenttää. Hinta 1 piste + 0,1 pistettä/ainesosa; reseptin eräsumma jaetaan annoksilla, jos syöte todella kattaa koko erän. Ei tulkita GI:tä validoiduksi, ellei vastaus yksilöi mittausta, asteikkoa, ruokamuotoa ja käytettävissä olevaa CHO:ta. Ei dumppeja eikä automaattista persistointia.
- **YMove:** `X-API-Key`, `POST /api/v2/foods/glycemic/ingredients`; ainesosaluettelo, enintään 30 per pyyntö; waiver on versionoitu ja erikseen hyväksyttävä. TypeScript SDK ja MCP; Python käyttää HTTPS/JSONia. Kuva-arvio ei pidä vertailun massoja vakiona. GraphQL-pohjaista avointa GI-lähdettä ei vahvistettu.
- **Tutkimukset:** tallenna hyväksytty yksittäinen havainto, DOI/taulukko/rivi, julkaisija, lisenssi ja tarkistuspäivä, ruokamatriisi, lajike, kypsennys ja tarjoilutila, glukoosi/valkoleipäasteikko, annos-CHO, n, väestö, viitekoe ja virhemitta. Alkuperäinen GI ja normalisoitu GI erikseen. Älä muunna asteikkoa yleisvakiolla ilman lähdekohtaista perustetta. Säilytä tutkimuksen SEM erillään reseptin skenaarioalueesta.

| Tieteellinen luokka | Suhde GK80:n menetelmään |
|---|---|
| A: täsmällinen ihmismittaus | Voi olla GK80 A:n syöte, jos CHO, määrät, versio ja hyväksyntä täsmäävät. Reseptin GK pysyy laskettuna. |
| B: dokumentoitu analogia | LOW, perustele prosessi ja tuote-erot sekä testaa vaikutus. Voi tukea hyväksyttyä GK80-versiota; ei automaattista vastaavuutta menetelmäkirjaimeen. |
| C: mallinnus, luokkakeskiarvo, in vitro tai koodaus | Vain rajattu, nimetty skenaario. GK80 B:n ehdollinen koodaus vaatii oman politiikan; myös A-paketeissa voi olla projektissa hyväksyttyjä rajattuja oletuksia. |
| D: alkuperä tuntematon | Ei syötettä kumpaankaan. Chatbotin selitys ja laskutoimitus eivät tee GI-luvusta mittausta. |

Tutkimusesimerkki: Moldovan tutkimuksen pitkäjyväiselle valkoiselle riisille raportoidaan GI 63,3 ja 78,6 eri keittoajoilla; tulos koskee testiruokaa. Taulukon 1 ja tulostekstin ajoissa on ristiriitoja pyöreän ja täysjyväisen riisin osalta; älä tuo niitä koneellisesti. Riisi–papu-aterian tai kylmennetyn perunan glukoosikäyrä ei yksin tuota GI:tä. Palkokasvin jauhatus rikkoo solurakennetta; keitetyn kikherneen GI ei kelpaa paistetulle kikhernejauholle.

## 33 reseptin esteseula

Seula suodattaa 119 puuttuvan reseptin joukosta alla olevat 33 yksilöllistä ID:tä. Tila kaikilla: ei numeerista tulosta eikä hyväksyttyä numeerista GK-versiota pinnatussa mainissa. Ainesosakohtainen esto on pilotista; taulukon pääluokka on toimituksellinen tulkinta, eikä se poista muita estoja. 1 GI; 2 koostumus; 3 massa; 4 prosessivastaavuus; 5 tuote; 6 pieni mutta tarkistettava panos; 7 laatu/turvallisuus.

| Resepti-ID | Pääluokka | Este | Ratkaisun seuraava askel |
|---|---:|---|---|
| indonesialainen-nasi-goreng-aamiaisriisi | 2 | Kecap manis 150 g: tuote ja CHO, salottisipulin massa. Paistettu riisi tarvitsee oman vertailun. | Tuotteen etiketti ja punnitus; API ei yksilöi tuotetta. |
| korealainen-bataatti-riisikulho | 2 | Bataatin kypsennys-GI; gochujangin CHO ja tuote. | Etiketti + kypsennystä vastaava mittaus. |
| chole-bhature | 1 | Uppopaistetun bhaturen GI; tomaattimurskan analogia estetty. | Valmiin bhaturan ihmismittaus; leipäkeskiarvo ei käy. |
| aloo-paratha | 4 | Täytetyn paistetun leivän valmistus-GI; peruna jo sidottu. | Oma täytetyn leivän mittaus tai rajattu valmistetun ruoan malli. |
| intialainen-aloo-paratha | 4 | Jauho/GI ja korianterin sidonta. | Pannukypsennys erikseen, korianterin CHO-raja. |
| samosa | 4 | Uppopaistettu kuori, vehnäjauhon GI puuttuu. | Valmistetun samosan mittaus tai rajattu malli. |
| bibimbap | 5 | Brändäämätön gochujang (2 rkl), CHO puuttuu. | Valitse tuote, massa ja etiketti; riisin prosessinäyttö tarkistettava. |
| chow-mein | 7 | Rakennesidos vanha, soija-GI ja osterikastikkeen tuote. | Uusi hash + etiketti, nuudelin uudelleenpaisto arvioitava. |
| bun-cha-hanoi | 3 | Kalakastikkeen/etikan rajat ja salottisipulin massa; marinadin jäämä. | Sopivat etiketit + punnitus; säilytä annostelu. |
| char-siu | 1 | Hoisin 4,185 g CHO/annos ilman hyväksyttyä GI:tä. | Tuotteen ja kuorrutteen jäämä; ei poisjättöä. |
| sichuan-hot-pot | 5 | Liemi ja nuudelityyppi avoimet. | Lukitse versio ja syödyn liemen määrä. |
| kerala-kalacurry | 1 | Kookosmaito ja tamarindi; #227 työn alla. | Tuotetason CHO/valmistus; ei kaksoislaskentaa. |
| kiinalainen-kevatsipulipannukakku | 4 | 100 g jauhoa/2 annosta; pannupaisto; #227. | Valmiin pannukakun näyttö; pidä rinnakkaistyö erillään. |
| gulab-jamun | 4 | Paistettu jauho ja imeytyvän sokeriliemen määrä. | Punnitse syöty siirappi ja käytä täsmäävää tutkimusta. |
| vada-pav | 4 | Uppopaistettu kikhernejauho; peruna ei pääeste. | Besan-taikinan ihmismittaus tai pidä HOLD. |
| pizza-margherita | 4 | Uunissa kypsennetty pohja; 111 g CHO/annos jauhosta. | Testattu pohja/täsmävalmiste, ei yleistä leipä-GI:tä. |
| vhh-lihapiirakka | 6 | Mantelijauho 1,35 g CHO/annos, yli poisjättörajan. | Täysrasvainen vs. rasvaton ja valmistus; erillinen C-skenaario. |
| vhh-runebergintortut | 6 | Mantelijauho 1,08 g/annos, lähellä rajaa. | Vaihtelu mitattava; ei pyöristystä alle 1 g. |
| keto-korvapuustit | 6 | Mantelijauho 1,35 g/annos. | Sama lähdeperhe kuin lihapiirakassa, resepti arvioitava erikseen. |
| paistettu-maksa-pekonilla | 1 | Maksan 6,25 g CHO/annos ilman GI:tä; #227. | Varmista paistotila ja koostumus; ei automaattista nollaa. |
| pad-thai-vhh-konjac | 1 | Tamarinditahna 4,305 g CHO/annos; GI 51 hylätty. | Tuote ja lähdemittaus; hedelmä ei automaattisesti vastaa tahnaa. |
| ketopizza-pofiber-pohjalla | 5 | 150 g nimeämättömiä täytteitä. | Omistajan päätös versiosta, tietokanta ei voi arvata. |
| keto-kauralesesampylat | 4 | Kauraleseen GI leivotussa matriisissa. | Valmiin leivän tutkimus, ei yleinen leipä-GI. |
| tangyuan | 2 | Mustan seesamin 100 g; lisäksi riisijauhon valmistusriski. | Paikallinen CHO, esimerkiksi MEXT; tahmean keitetyn taikinan GI erikseen. |
| malesialainen-kookos-banaanikulho | 2 | Palmusokerin koostumus ja tapiokan valmistus-GI. | Tuotteen tiedot ja kypsän tapiokan tutkimus. |
| nasi-lemak | 5 | Sambalin etiketti ja kookosmaito, riisin valmistus. | Täsmätuote, kookoksessa keitetty riisi ei ole tavallinen vesikeitto. |
| intialainen-masala-dosa | 2 | Sinapinsiemenen sidonta, nykyinen riisi-GI ei varmista fermentoitua pannutaikinaa. | Fineli/FDC CHO ja valmistustarkistus. |
| meksikolainen-chilaquiles-verdes | 5 | Salsa verde tunnistamatta, 100 g tortillaa/2 annosta. | Etiketti tai punnittu salsa; tortilla haudutetaan kastikkeessa. |
| meksikolainen-huevos-divorciados | 5 | Vihreän salsan tietue puuttuu. | Punnittu täsmäsalsa tai etiketti; annoskohtainen CHO. |
| korealainen-bindaetteok-aamiaiseksi | 2 | Kimchin koostumus, mungpavun jauhettu pannumatriisi. | Etiketti ja valmistus-GI:n tarkistus. |
| pohjoisafrikkalainen-harcha-juustolla | 4 | Mannasuurimo paistettuna; 31,8 g CHO/annos. | Harchan valmistusnäyttö, ei höyrytettyä mannaa. |
| karibia-johnny-cake | 4 | Vehnäjauho paistettuna; 37 g CHO/annos. | Testattu paistettu leipä; ei raakajauhoon leipäarvoa. |
| karibia-bammy-kassavaleipa | 7 | Kassavan ja limetin vanha massasidos, kookosmaito; nykyinen 100 g avokado vs vanha 120 g. Kassavan turvallinen käsittely tarkistettava erikseen. | Korjaa lähdesidos ennen laskentaa; GI-palvelu ei ratkaise elintarviketurvallisuutta. |

Yhdelle pääluokan 3 reseptille ulkoinen lähde voi antaa koostumuksen mutta ei marinadin todellista jäämää. Luokkien 2 ja 5 resepteissä tärkein hyöty on kohdistettu CHO-haku, jos tuote voidaan ensin tunnistaa. Luokissa 1 ja 4 hyöty riippuu mitatun ruoan soveltuvuudesta. Tässä seulassa ei löytynyt yhtäkään reseptiä, jonka kaikki estot olisi osoitettu poistetuiksi ulkoisella tiedolla.

## 12 reseptin vertailukoe

**Ajettu:** paikallinen annoskohtainen herkkyyslasku. **Ajamättä:** ulkoisen GK-API:n kokonaistulos ja sen GK-ero. Maksuttomasta dokumentoidusta GI/GK-APIsta ei löytynyt ehdot täyttävää pysyvää kaupallista käyttöreittiä; avaimia ei käytetty, tilausta tai waiveria ei hyväksytty. Alla on todellinen ulkoiseen tutkimukseen perustuva ainesosavertailu kolmelle riisiriville ja yhdeksän oletustestiä. Niitä ei rinnasteta toimittajan vastaukseen. GK80:n vanha reseptitulos on kaikissa HOLD, joten kokonais-GK:n erotusta ei voi laskea. Vanha GI on pilotin ehdokas, joka voi olla hylätty; se ei ole hyväksytty julkaisuarvo.

Massat ovat reseptin tai pilotin grammoina koko erälle, annokset pysyvät samoina; bammy-rivillä vanha sidonta korjattiin vain tässä vertailussa vastaamaan reseptin 100 g:aa. CHO on projektin sidottu käytettävissä oleva CHO g/annos; raakariisin CHO ei muutu kokeessa. Riisin uudet GI:t ovat Vîrlan ym. §3.3:n CC BY 4.0 -havainnot; tallennus sallittu attribuutiolla. GI 60–90 perunalle ja 0–150 muille ovat määritettyjä herkkyyspisteitä, eivät lähdearvoja, biologisia rajoja tai luottamusvälejä. Levitys = GK panoksen erotus samalla CHO:lla. Ei tallennettavaa toimittajavastausta.

| Resepti | Valmistus / komponentti | g / annoksia | CHO g/annos | Vanha GI → koe-GI | Koe-GK/annos | Levitys | Tulkinta |
|---|---|---:|---:|---|---:|---:|---|
| aloo-paratha | pannulla, täytetty peruna | 400/4 | 15.5 | 73 → 60–90 | 9,30–13,95 | 4,65 | Perunaosuus; jauho HOLD |
| intialainen-aloo-paratha | pannulla, täytetty peruna | 60/2 | 4.65 | 66 → 60–90 | 2,79–4,19 | 1,40 | Perunaosuus; vehnä ja korianteri HOLD |
| samosa | keitetty perunatäyte, kuori uppopaistetaan | 400/4 | 15.5 | 66 → 60–90 | 9,30–13,95 | 4,65 | Perunaosuus; kuori HOLD |
| vada-pav | peruna ja uppopaistettu besan | 500/4 | 19.375 | 71 → 60–90 | 11,63–17,44 | 5,81 | Perunaosuus; besan HOLD |
| char-siu | pitkäjyväinen riisi keitetty, liha paistettu | 600/4 | 35.3415 | 67 → 63.3–78.6 | 22,37–27,78 | 5,41 | CC BY -mittausvertailu, riisivariantti varmistettava; hoisin HOLD |
| bibimbap | jasmiiniriisi, kuivapaino | 300/4 | 59.25 | 67 → 63.3–78.6 | 37,51–46,57 | 9,07 | Sama tutkimus vain herkkyyteen, ei jasmiiniriisin hyväksytty analogia; gochujang HOLD |
| indonesialainen-nasi-goreng-aamiaisriisi | riisi paistetaan | 100/2 | 39.5 | 67 → 63.3–78.6 | 25,00–31,05 | 6,04 | Keitetyn vertailuriisin tulos, ei paistetun riisin GI; kecap HOLD |
| vhh-lihapiirakka | mantelijauho leivottuna | 200/8 | 1.35 | – → 0–150 | 0,00–2,02 | 2,02 | C, poisjättöraja ylittyy |
| vhh-runebergintortut | mantelijauho leivottuna | 120/6 | 1.08 | – → 0–150 | 0,00–1,62 | 1,62 | C, poisjättöraja ylittyy |
| keto-korvapuustit | mantelijauho leivottuna | 200/8 | 1.35 | – → 0–150 | 0,00–2,02 | 2,02 | C, poisjättöraja ylittyy |
| pad-thai-vhh-konjac | tamarinditahna kastikkeessa | 30/4 | 4.305 | 51 → 0–150 | 0,00–6,46 | 6,46 | C, 51 hylätty, ei hyväksyntää |
| karibia-bammy-kassavaleipa | kuorittu raaka avokado | 100/2 | 0.385 | – → 0–150 | 0,00–0,58 | 0,58 | C vain vaikutuksen arviointiin; Fineli 0,77 g/100 g ja nykyinen 100 g, vanha sidos 120 g → 0,462 |

Esimerkiksi samosan perunasta tulee jo 9,30–13,95 GK/annos näillä oletuksilla, joten sitä ei käsitellä triviaalina. Bammyn avokadon 0,385 g/annos on alle yksittäisrajan, mutta mahdollinen poisjättö kuluttaa kumulatiivista budjettia. Kassava ja kookos eivät ratkea sillä. Char-siun tutkimusvertailussa riisin GK-panoksen muutos vanhan GI 67:n panoksesta on −1,31…+4,10; kastike ja marinadi jäävät edelleen auki. Laskutoimitukset: `choPerServing * gi / 100`; erotus lasketaan ennen pyöristystä.

Dokumentaatiopohjainen testisyöte: `{recipeId:"char-siu",servings:4,ingredients:[{name:"cooked long-grain white rice",grams:600,preparation:"boiled"}]}`. Tämä on yhden komponentin reititystesti. Spoonacularin vastaava dokumentaation mukainen ajamaton runko on `{"ingredients":["600 g cooked long-grain white rice"]}`; `servings=4` pysyy paikallisessa metadatassa. Lähetä vasta oikeuksien varmistuttua; reseptivertailuun vaaditaan kaikki samasta hashista sidotut rivit ja retained mass. FDC:n avaimettomassa bulk-reitissä vertaa samalle komponentille kypsän riisin tietuetta, CHO-määritelmää ja kuitua. Avainreitillä syöte on palvelun oma `fdcId` tai `fdcIds`, ei resepti-JSON. Tallennettava fixture on syöte ja normalisointisääntö; vastaus puuttuu. Sovitin ei saa hiljaa korvata virhettä arvioidulla GI:llä.

## Kattavuus ja kustannus

**Todennettu lisäys on 0 kaikissa kolmessa skenaariossa.** Alla rajattu työjono näyttää, mitä kannattaisi arvioida seuraavaksi ja mitä tapahtuisi, jos jokainen nimetty resepti läpäisisi koko prosessin. Tämä on otoksen katto, ei koko 119 reseptin ennuste. 33 reseptin otoksesta 21 jää ulkopuolelle laajimmassakin työjonossa. Muita reseptejä ei lasketa eikä tulosta ekstrapoloida.

| Skenaario | Nimetyt uudet ehdokkaat, kumulatiivisesti | Enintään | Kattavuus jos kaikki hyväksytään | Jäljellä 80 %:iin |
|---|---|---:|---:|---:|
| Varovainen | 0: yhtään reseptille täysin täsmäävää uutta, sallittua ja koko reseptin eston poistavaa mittausta ei vahvistettu. | 0 | 207/326 = 63,50 % | 54 |
| Käytännöllinen | char-siu, bibimbap, chilaquiles-verdes, huevos-divorciados, masala-dosa (taulukon täydet ID:t). Mahdollisia vain, jos tuotemassa/CHO ja LOW-analogiat hyväksytään; yksikään ei vielä läpäise. | 5 | 212/326 = 65,03 % | 49 |
| Laajennettu | Edelliset 5 sekä vhh-lihapiirakka, vhh-runebergintortut, keto-korvapuustit, aloo-paratha, intialainen-aloo-paratha, samosa ja harcha. Valmistematriisin laskennalliset skenaariot tarvitsevat vertailurajauksen ja omistajan hyväksynnän; julkaisu voi jäädä estetyksi. | 12 | 219/326 = 67,18 % | 42 |

Halvimmillaan avoimen CHO-datan lisenssi ja paikallinen laskenta maksavat 0 € ulkoisia käyttömaksuja; kustannus on lähteiden sidonnassa ja laadun tarkistamisessa. Mallinna 8 h kiinteää työtä julkaisuversioille, sovittimelle ja ensimmäiselle katselmukselle sekä 8–20 min reseptille. Tämä on suunnitteluoletus, ei mitattu työaika eikä sisällä uusia laboratoriomittauksia. Esimerkki 60 €/h sisäisellä laskentahinnalla:

| Reseptiä | Avoin data, API-kustannus | Työaika | Työn kustannus |
|---:|---:|---:|---:|
| 30 | 0 € | 12–18 h | 720–1 080 € |
| 100 | 0 € | 21,3–41,3 h | 1 280–2 480 € |
| 243 | 0 € | 40,4–89 h | 2 424–5 340 € |

FDC-erähaku riippuu uniikeista tietueista, ei reseptien lukumäärästä. API League: 30/100/243 reseptiä tarkoittaa vähintään 30/100/243 kutsua, jos yksi kutsu per resepti; tokenkustannus on kutsut × operaatiohinta ja mahdolliset uudelleenyritykset. Free ei käy kaupalliseen käyttöön; Rookie-suunnitelman $7/kk on julkinen vähimmäishinta, ei oikeuksien tai lopullisen hinnan vahvistus. YMove Pro ja erikseen sovitut pysyvät oikeudet, Spoonacular, EuroFIR, Edamam ja Nutritionix eivät kuulu hyväksyttyyn budjettiin. Heidän kustannuksiaan ei voi laskea luotettavasti käyttämättä vahvistamatonta sopimusoletusta.

## Toteutussuunnitelma ja päätös

1. **Lähderekisteri:** tallenna release ja tiedoston tarkiste, oikeusvektori, lisenssi-URL, attribuutio ja tarkistuspäivä. Käsittele CC0/CC BY, ODbL ja share-alike eri varastoissa. Jos oikeus on epäselvä, nosta `LEGAL_REVIEW` ja estä haku sekä tallennus oletuksena.
2. **Sovitin:** `normalize(recipeHash) → resolveCho(foodKey, state, quantity) → resolveGi(foodKey, preparation, cultivar) → propose(evidence[])`. Syöte sisältää syötävän massan, annokset, raaka/kypsä-tilan, prosessiajat, brändin ja mahdollisen marinadin jäämän. Tulos: tietueen ID, lähde, snapshot, CHO-määritelmä, GI-asteikko, tutkimuksen näytön luokka, perustelu, GK-ehdotus sekä ratkaisemattomat estot. Väärä variantti tai epäselvä massa tuottaa HOLDin.
3. **Kuljetus:** offline ensin. REST-palvelussa avain vain palvelinympäristöön, sopimuksen mukainen cache ja lokiin vain tunniste, kesto ja tila; aikakatkaisu, rajattu backoff ja Retry-After 429/5xx:lle. 400/401/403, skeemamuutos tai puuttuva CHO/GI → HOLD. Hävitä sallitun TTL:n ylittävät tietueet. Uusi lähdeversio tuottaa diff-katselmoinnin; vanhat hyväksynnät pysyvät sidottuina vanhaan versioon.
4. **Ensimmäinen erä:** käytä yllä olevia 12 fixturea ja 30 erillisen reseptin CHO-/GI-tarkistuserää. Valitse ensin yksittäiset koostumusesteet, joilla on tarkka etiketti; seuraavaksi riisin prosessiperheet. Kirjaa erikseen eston poisto, täydellinen reseptiehdotus ja julkaisu. Laske vain uniikit, nykyisestä mainista puuttuvat ID:t; huomioi rinnakkaisten PR:ien eteneminen. Tavoittele vähintään 54 hyväksyttyä uutta reseptiä erien yli.
5. **Julkaisuportti:** pidä tutkimus- ja staging-tiedot erillään julkaisurekisteristä. Vertaa Decimal-laskulla, tarkasta massat, koko reseptin epävarmuus, lisenssi, omistajan hyväksyntä ja input/source-hash. Mallinnettu arvio nimetään arvioksi ja rajataan näkyvään versioon. API ei kirjoita julkaistuja GK-arvoja.

**GO** avoimelle koostumuspohjalle. **CONDITIONAL GO** versionoidulle, kuratoidulle GI-havaintokatalogille ja reseptikohtaiselle sovittimelle. **NO-GO** mustan laatikon GK-luvuille, rajoitetun taulukon bulk-kopioinnille ja nykyisen 80 % tavoitteen lupaamiselle ulkoisilla lähteillä yksin. Ensimmäinen hyödyllinen toteutus on CHO-sidontojen ja valmistustietojen tarkentaminen; se vähentää käsityötä myös niissä resepteissä, joiden GI pitää edelleen katselmoida.

## Jatkopilotti: avoimen koostumusdatan todellinen erähaku

3.11.2026. Ladattiin [USDA FDC SR Legacy 04/2018:n virallinen CSV-paketti](https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_sr_legacy_food_csv_2018-04.zip) (CC0; SHA-256 `b80817294b8850530aaedf2e515c02593b1824f763a0ff356e5c2081643e6fd0`). Ei avainta eikä API-kutsuja. Yhdistettiin `food.csv` ja `food_nutrient.csv` FDC ID:llä. USDA:n alla esitetty erotus on 1005 (carbohydrate by difference) miinus 1079 (total dietary fiber), grammoina 100 g:ssa. Erotus on vertaileva arvio, eikä se automaattisesti vastaa Finelin CHOAVL:ää, MEXT:n mitattua/summattua käytettävissä olevaa hiilihydraattia tai tietyn tuotteen analyysiä. Puuttuvaa arvoa ei korvattu nollalla. Projektin Fineli Release 20 on THL:n CC BY 4.0 -aineisto; japanilainen tietue on MEXT:n Japanin elintarvikkeiden standardikoostumustaulukosta (8. laitos, täydennys 2023).

| Resepti / ainesosa | Ulkoinen tietue ja CHO-arvio (g/100 g) | Koe samalla annoksella | Päätös |
|---|---|---|---|
| char-siu / keitetty pitkäjyväinen riisi | USDA 168878: 28,17 − 0,40 = 27,77 | 600 g / 4 → 41,655 g CHO/annos vs. nykyinen 35,3415; GI 67 vakioituna GK-panoksen muutos **+4,23**. Samoilla GI 63,3–78,6 herkkyyspisteillä uuden CHO:n panos 26,37–32,74. | Valmistustila täsmää yleistasolla, mutta rikastus, jyvälajike, kosteus ja keittosaanto avoinna. Pidä rinnakkaisena tarkistuksena; hoisin-HOLD jää. |
| korealainen-bindaetteok-aamiaiseksi / kimchi | USDA 170392, kaalista: 2,40 − 1,60 = 0,80 | 150 g / 2 → 0,60 g/annos; nykyisen 0,25 g poisjätön kanssa 0,85 g/annos. | Paras uusi ehdokas. Vain jos käytetty tuote on vastaava kaalikimchi ja sen käytettävissä oleva CHO jää alle 1,333… g/100 g; geneerinen keskiarvo ei ole yläraja. Jauhetun mungpavun valmistus-GI tarkistettava. |
| tangyuan / musta seesami | USDA 170150, kokonainen kuivattu: 23,45 − 11,80 = 11,65; Fineli 385, kuorineen: 0,90; [MEXT 05018](https://fooddb.mext.go.jp/details/details.pl?ITEM_NO=5_05018_7), paahdettu, massana 0,70 | 100 g / 4 → 2,9125 / 0,225 / 0,175 g/annos. Lähdevalinta vaihtaa sen, alittuuko poisjättöraja. | HOLD. Yksikään tietue ei yksilöi reseptin mustaa, jauhettavaa siementä; MEXT on paahdettu. Ero on selvitettävä ennen poisjättöä. |
| intialainen-masala-dosa / sinapinsiemen | USDA 170929, jauhettu: 28,09 − 12,20 = 15,89 | Reseptin **150 g / 2** → 11,9175 g/annos vertailuskenaariossa. | Määrän ja ainesosan toimituksellinen tarkistus. Aamiaisreseptin 150 g ei ole sama kuin eri ID:n pääruokareseptissä käytetty pieni maustemäärä. Älä korjaa hiljaa tai siirrä jauhetun siemenen arvoa automaattisesti. |
| meksikolainen-chilaquiles-verdes / salsa verde | USDA 174524, geneerinen salsa: 6,64 − 1,90 = 4,74; Fineli 1448 ja 33207, tomaattisalsat: 3,624 ja 6,482 | 150 g / 2 → 3,555 / 2,718 / 4,8615 g/annos. | Ei vastaavaa vihreää salsaa tässä poiminnassa. Nämä vertailut eivät tue poisjättöä. Tarvitaan tuote-etiketti tai reseptin mukainen punnittu salsa. |
| meksikolainen-huevos-divorciados / vihreä salsa | Samat koostumusvertailut, eri resepti | 150 g / 2 → sama komponentin vaihtelu kuin yllä, punainen salsa erillinen. | Sama tuoteportti; yhden lähteen uudelleenkäyttö ei tarkoita kahta vahvistettua reseptiä. |
| karibia-bammy-kassavaleipa / avokado | USDA 171705: 8,53 − 6,70 = 1,83; Fineli 11057: 0,77 | 100 g / 2 → 0,915 vs. 0,385 g/annos. Molemmat pisteet alle yksittäisrajan; ero 0,53 g. | Fineli vastaa kuorittua ja kivetöntä tilaa; USDA toimii herkkyystarkistuksena. Kassava, kookosmaito ja lähdesidonta jäävät auki. |
| indonesialainen-nasi-goreng-aamiaisriisi ja bun-cha-hanoi / salottisipuli | USDA 170499, raaka: 16,80 − 3,20 = 13,60; projektin AFCD F008227 (raaka, kuorittu): 3,10 ilman polyoleja | Kappalemäärä 1 tai 2; ei vahvistettua grammamassaa. USDA-vertailulla 1 g CHO/annos tulee vastaan 14,71 g:ssa koko 2 annoksen erässä tai 29,41 g:ssa koko 4 annoksen erässä. | Punnitse reseptin syötävä määrä. Lähteiden 4,39-kertainen pitoisuusero tekee oletuspainosta huonon perusteen. Kastike- ja marinadiestot jäävät. |

Yhteensä yhdeksän eri reseptiä tarkistettiin. **Yksi uusi ensisijainen CHO-ehdokas** (bindaetteokin kaalikimchi), kaksi määrällistä sidontavertailua (char-siun riisi ja bammyn avokado) ja neljä selkeää tietopyyntöä: kimchin etiketti, mustan seesamin tarkka koostumus ja käsittely, masala dosan sinapinsiemenen määrä sekä vihreän salsan tuote. Salottisipulista tarvitaan punnittu massa. **0 varmistettua reseptin avautumista.** Kattavuus ei muutu. Tulokset osoittavat, miksi sovitin tarvitsee eri kentät koostumuslaskennan menetelmälle, tuotteen vastaavuudelle ja lähteellä tuetulle ylärajalle.


## Bindaetteok-jatkopilotti: etiketit ja paistetun mungpapuletun GI (3.11.2026)

**Päätös: PARTIAL / HOLD.** Alkuperäisen reseptin [`korealainen-bindaetteok-aamiaiseksi`](../../reseptit/aamupalat/korealainen-bindaetteok-aamiaiseksi.md) syötemäärät ovat 150 g mungpapua, 150 g pavunituja, 2 rkl kevätsipulia, 150 g kimchiä, 1 rkl öljyä ja määräämätön suola, yhteensä **2 annosta**. Ohjeessa mungpavut liotetaan, jauhetaan ja paistetaan ohuina lettuina; resepti ei nimeä mungpavun kuorimista, jauhamisen hienoutta, liotusaikaa eikä tiettyä kimchimerkkiä. Alla olevat tuotteet ovat vaihtoehtoisia täsmävariantteja tutkimusta varten, **eivät alkuperäisen reseptin todistetusti käyttämä tuote**.

### Kimchin CHO: 150 g / 2 annosta = 75 g/annos

| Lähde/variantti | CHO g/100 g | CHO g/annos (75 g) | Poisjättö alle 1 g/annos? |
|---|---:|---:|---|
| USDA FDC SR Legacy 170392, kaalista (1005−1079), laskennallinen vertailu | 0,80 | 0,600 | Aritmeettisesti kyllä; ei tuotekohtaisesti varmistettu |
| Schöni Bio Kimchi mit Peperoni 280 g, EAN 7610596170075, valmistajan verkkoravintoarvomerkintä | 1,1 | 0,825 | Kyllä, nimetylle tuotteelle |
| Sempio Kimchi 160/120 g, GTIN 08801005001267, maahantuojan tuotetieto | 2,0 | 1,500 | Ei |
| Biona luomu kimchi 350 g, EAN 5032722315334, K-Ruoka | 4,3 | 3,225 | Ei |
| Jongga Napa Cabbage 160 g, EAN 8801052040523, Elatukku | 6,0 | 4,500 | Ei |
| Jongga Fermented Napa Cabbage EU 700 g, valmistajan tuotetieto | 7,8 | 5,850 | Ei |

Lähteet: [Sempio / Finefoods](https://finefoods.fi/tuotteet/sempio/sempio-kimchi-korealainen-kaalivalmiste-160-120g/), [Biona / K-Ruoka](https://www.k-ruoka.fi/kauppa/tuote/biona-luomu-kimchi-350g-5032722315334), [Jongga 160 g / Elatukku](https://www.elatukku.fi/teolliset-elintarvikkeet/jongga-kimchi-napa-cabbage-kiinankaali-kimchi-160g/p/12201/), [Jongga EU / valmistaja](https://jonggaeurope.com/blog/product/fermented-napa-cabbage-kimchi-700g/). EU-merkinnän hiilihydraatit eivät sisällä kuitua; USDA:n kokonais-CHO miinus kuitu on eri menetelmä ja vain vertailu, ei tuotteen etiketti. Pakkauksen ajantasainen etiketti ja tarkka GTIN tulee varmistaa ennen lopullista sidontaa.

Kimchin **tiukka yksittäisraja** tällä massalla: CHO pitoisuus **alle 1,3333… g/100 g**, koska 75 g × pitoisuus / 100 < 1 g. Nykyisen pilotin kevätsipulista kertyy 0,25 g/annos. Schönin kimchin kanssa poisjättöön tulisi yhteensä **1,075 g/annos**, alle 2 g:n yhteisrajan. Tuote sisältää 63 % kiinankaalia. Valmistaja ilmoittaa kuidun (1,5 g/100 g) erikseen. Suomen saatavuutta ja fyysistä pakkausta ei tarkistettu. USDA:n geneerinen vertailu ei anna muille kimcheille tuotekohtaista rajaa. [Schönin ravintoarvomerkintä](https://schoenifood.ch/de/produkte/fermentiert-und-roh/schoni-bio-kimchi-mit-peperoni-fermentiert-roh-280g/) · [Tuotetunniste](https://schoenifood.ch/wordpress/wp-content/uploads/2024/08/Sortimentsuebersicht-o.-Preise-_-komplett-_-Schoeni-Swissfresh-AG-.pdf)

### Cheelan GI alkuperäisessä tutkimuksessa

Batra, Sharma ja Seth (1994) raportoivat sivun 152 taulukossa 3 glukoosiasteikolla fermentoimattomalle mungpapucheelalle **36 ± 0,6** ja fermentoidulle mungpapucheelalle **38 ± 0,7** (keskiarvo ± SEM, n = 15). **45 ± 0,8** kuuluu fermentoidulle kikhernecheelalle. Vuoden 2002 koosteessa nämä kaksi varianttia saivat toistensa arvot. Vuoden 2021 liitetaulukon 2 rivit 3847–3849 vastaavat alkuperäisen taulukon ryhmiä pyöristettyinä. [Alkuperäinen artikkeli, s. 152, taulukko 3](https://apjcn.qdu.edu.cn/3_4_1.pdf#page=2) · [Vuoden 2002 kooste](https://ajcn.nutrition.org/article/S0002-9165%2823%2905840-9/fulltext) · [Vuoden 2021 liitetaulukko](https://ghwinstitute.com/wp-content/uploads/2022/10/supplementaltable2-2.pdf)

Tutkimuksessa käytettiin 90 g kuivista kokonaisista pavuista jauhettua jauhoa ja 200 ml vettä kolmeen ohueen lettuun sekä 5 g rasvaa lettua kohti. Bindaetteokissa liotetut pavut soseutetaan karkeasti ja paistetaan itujen ja kimchin kanssa. Cheelan 36 on vertailuhavainto. Bindaetteokin taikinan GI-sidonta edellyttää näyttöä siitä, että jauhatus ja täytteet sallivat siirron. [Alkuperäisen artikkelin menetelmä, s. 151](https://apjcn.qdu.edu.cn/3_4_1.pdf#page=1)

### Pavunitujen koostumus ja laskentapäätös

Nykyinen Fineli 384 sisältää sinimailasen ja mungpavun itujen keskiarvon. Sen 2,6 g/100 g tuottaa 150 g erästä 1,95 g/annos. Virallisen SR Legacy -aineiston raaka mungpavunitu 169957 antaa erotuksella 5,94 − 1,80 = 4,14 g/100 g eli **3,105 g/annos**, jos 150 g tarkoittaa ennen paistoa punnittua mungpavunitua. Molemmat ylittävät 1 g:n poisjättörajan. Resepti nimeää pavunidut yleisesti. Tarkka itulaji ja valmistukseen soveltuva laskentaperuste ovat avoinna. [USDA:n eräaineisto](https://fdc.nal.usda.gov/download-datasets/)

**Koko reseptin GK on HOLD.** Schöni-variantin kimchi voidaan käsitellä poisjättörajan mukaisesti, kun tuote sidotaan reseptiversioon ja pakkausmerkintä varmistetaan. Kokonais-GK edellyttää myös itujen laskentaperustetta ja paistettuun bindaetteok-taikinaan soveltuvaa GI-näyttöä.

### Märkäjauhettu taikina ja itujen tarkennettu vertailu

Sultanan vuoden 2014 ihmiskokeen pesarattu vastaa valmistusta cheelaa paremmin: mungpavut liotettiin ja jauhettiin lettutaikinaksi. Glukoosivertailussa kokonaisista pavuista tehdyn letun keski-GI oli 50,8 ja kuorituista tehdyn 56,6. Tiivistelmä ei vahvista bindaetteokin karkeaa jauhatusastetta, itujen ja kimchin osuutta eikä paistotavan vastaavuutta. Shakappa ym. raportoivat erilliselle pesarattulle GI:n 60,69. Kummallekaan ei vahvistettu GK80:n tarvitsemaa käyttöoikeutta eikä reseptikohtaista siirtoa. [Sultanan opinnäytetiivistelmä, s. 155–156](https://krishikosh.egranth.ac.in/server/api/core/bitstreams/5a54449e-2b00-41f6-ba6c-11ed98ffd41b/content) · [Shakappa ym.](https://doi.org/10.1007/s13197-022-05368-6)

Songin ym. korealaisen GI-taulukon rivi 4007 nimeää bindaetteok-taikinan ja antaa glukoosiasteikon GI:n 31. Lähdekoodi 6 tarkoittaa imputointia. Samassa taulukossa keitetyllä mungpavulla on sama arvo. Taikinarivi ei osoita, että paistetulle bindaetteokille tehtiin ihmiskoe. [Song ym., liite s. 91 ja selite s. 93](https://www.e-jnh.org/pdf/10.4163/kjn.2012.45.1.80)

Japanin MEXT:n tietue 06291 yksilöi raa'an mungpavun idun (Vigna radiata). Käytettävissä olevien hiilihydraattien massasumma on 1,3 g / 100 g syötävää osaa. Jos reseptin 150 g tarkoittaa ennen paistoa punnittuja syötäviä mungpavunituja, tämä antaa 0,975 g/annos. Saman tietueen erotusmenetelmällä ilmoitettu 1,7 g/100 g antaisi 1,275 g/annos. Kuitua ei vähennetä uudelleen. MEXT:n massasummallakin idut, Schöni-kimchi ja kevätsipuli tekisivät yhteensä **2,050 g/annos**, yli 2 g:n yhteisrajan. Pistearvo ei myöskään ole tuote-erän yläraja. [Japanin elintarvikkeiden standardikoostumustaulukko, 8. laitos, täydennys 2023](https://fooddb.mext.go.jp/details/details.pl?ITEM_NO=6_06291_7)

Sydneyn GI 25 koskee kuvauksen mukaan idätettyä mungpapua. Julkaisemattoman havainnon kuvauksesta ei selviä idun kehitysvaihe eikä käsittely, joten lukua ei sidota pannulla taikinaan kypsennettyihin ituihin. **HOLD:** MEXT tarkentaa koostumuksen laskentaa nimetylle raaka-aineelle, mutta taikinan GI ja itujen käsittely jäävät avoimiksi. [Sydneyn GI-haku](https://glycemicindex.com/gi-search/)

### Valmistajan mungpavunidut ja kypsennyksen GI-näyttö

Lounasitu Oy:n valmiiksi pestyt mungpavun idut (200 g) ovat nimetty tuore tuote. Valmistajan verkkotuotesivu ilmoittaa 9,3 g hiilihydraattia ja erikseen 3 g kuitua / 100 g. Reseptin 150 g erästä tulee **6,975 g hiilihydraattia annosta kohti**, kun idut punnitaan ennen paistoa ja koko määrä käytetään. Kuitua ei vähennetä ilmoitetusta hiilihydraatista. Sydänmerkki ilmoittaa saman pitoisuuden valmistajan 1 kg tuotteelle. Fyysistä 200 g pakkauksen etikettiä tai käytettyä tuotetta ei tarkistettu. Käännän Itu ja Elo ilmoittaa omille mungpavuniduilleen 4 g hiilihydraattia / 100 g, mikä vastaisi 3,0 g/annos. Tämäkin ylittää 1 g:n poisjättörajan. Tuotelukuja ei voi korvata MEXT:n 0,975 g/annos vertailulla. [Lounasidun 200 g tuotetieto](https://lounasitu.fi/tuotteet/mungpavun-idut/) · [Sydänmerkin 1 kg tuotetieto](https://www.sydanmerkki.fi/tuotteet/lounasitu-mungpavun-ituja-2) · [Käännän Itu ja Elo](https://www.itujaelo.fi/tietoa-iduista/)

Lähin uusi ihmishavainto on idätetyn ja **höyrytetyn** mungpavun GI 26,24. Tutkimuksen valmistus ja testiruoka eroavat tuoreista iduista, jotka paistetaan taikinassa. Sydneyn julkaisemattomat havainnot GI 25 (idätetty) ja GI 53 (paistettu) ovat kaksi eri riviä. Vuoden 2002 kooste ilmoittaa idätetylle ruoalle 17 g käytettävissä olevaa hiilihydraattia 150 g annoksessa, mutta ei vahvista tuoreen kaupallisen idun vastaavuutta eikä idätetyn näytteen pannupaistoa. Paistettua riviä ei kuvata idätetyksi. Eri rivejä ei voi yhdistää yhdeksi mittaukseksi. [Idätetyn ja höyrytetyn mungpavun ihmiskoe, § 3.7](https://pmc.ncbi.nlm.nih.gov/articles/PMC11462625/#sec3-7) · [Sydneyn GI-haku](https://glycemicindex.com/gi-search/) · [Vuoden 2002 kooste, rivi 468](https://ajcn.nutrition.org/article/S0002-9165%2823%2905840-9/fulltext)

**HOLD.** Lounasitu on tarkistettavissa oleva tuotekohtainen koostumusehdokas. Sen ituosuus tarvitsee hyväksyttävän GI:n tai erikseen perustellun mallin. Koko reseptin GK:lle jää lisäksi paistetun taikinan vastaavuusportti.

# Chat-4 – tuotteet ja pakkaustiedot: graavisiika ja muikunmäti

Tarkistus: 21.11.2026
Työn omistaja: Chat 4
Kohde: PR #805, `graavisiika-tillilla` ja `muikunmati-rieskarullat`
GitHub-lähtö-HEAD: `31b786a36192a46c6b506eab8c68436194c046a8`

## Näytön periaate

Lähteet ovat valmistajan omia tuotekuvauksia, vähittäis-/tukkukauppojen julkisia pakkaus- ja tuotetietoja sekä Ruokaviraston vaatimuksia. Valmistajan verkkosivun tai verkkokaupan yleinen sanamuoto **pakaste** ei yksin osoita jäädytyskäsittelyn asetuksen mukaista lämpötila-aikayhdistelmää, raakakäyttökelpoisuutta eikä yksittäisen ostetun erän säilyvyysaikaa. Tietojen voimassaolo on tarkistettava myyntipakkauksesta ja tarvittaessa valmistajalta.

`source_verification`: public product listing; ei fyysisen pakkauserän tutkimista; ei valmistajavastausta.

## 1. Raaka siikafilee graavausta varten

### Ehdokas S1: Kotimaista Siikafilee pakaste noin 300 g

- **EAN 2396012800003**, tuotemerkki Kotimaista, valmistaja Hätälä Oy; S-ryhmän tuotesivu.
- Laji `Coregonus lavaretus`, suomalainen nahallinen ruodoton pakastefilee, kuitenkin voi sisältää yksittäisiä ruotoja.
- Säilytys `−18 °C` tai kylmemmässä, ei uudelleen pakastusta sulatuksen jälkeen. Ohje: sulata jääkaapissa noin 8–12 tuntia ja **paista**. Tuotesivu ei väitä raakakäytön tai graavauksen soveltuvuutta eikä ilmoita loistorjunnan pakastusprosessin vähimmäislämpötilaa ja -kestoa.
- Lähde: https://www.s-kaupat.fi/tuote/kotimaista-siikafilee-pakaste-n300g/2396012800003
- **Päätös:** `PRODUCT_IDENTIFIED`, `FROZEN_STORAGE_VERIFIED`, `RAW_USE_UNVERIFIED`, `PARASITE_PROCESS_UNVERIFIED`. Ei vielä hyväksyttävissä kylmänä syötävään graavisiikaan.

### Ehdokas S2: Kalavapriikki Benella siikafilee ruodittu pakaste

- **EAN/tuotetunnus 2371423800002**, Kalavapriikki Oy; Kespro-tietojen mukaan Suomessa kasvatettu `Coregonus lavaretus`, pakaste, raaka filee.
- Kespron julkinen ohje: raaka tuote, kypsennä ja mausta tarvittaessa; säilytys −18 °C, sulanutta tuotetta ei saa jäädyttää uudelleen. Tukkuerä noin 7 kg, filee noin 160 g.
- Lähde: https://www.kespro.com/tuotteet/kalavapriikki-benella-siikafilee-ruodittu-n-160g-n-7kg-pakaste-2371423800002
- Ruokaviraston mukaan viljelty siika **voi** kuulua jäädytysvapautuksen piiriin vain, jos toimijalla on kalankasvattajan kirjallinen selvitys alkioista kasvattamisesta ja yksinomaan teollisen rehun käytöstä. Tuotesivun `kasvatettu` ei ole tällainen selvitys.
- **Päätös:** `PRODUCT_IDENTIFIED`, `FARMED_FISH`, `EXEMPTION_DOCUMENT_MISSING`, `RAW_USE_UNVERIFIED`. Ei valmis graavaukseen ilman toimittajan lisätietoa.

### Ehdokas S3: Pirkka Parhaat graavisuolattu siikafilee 100 g

- **EAN 6410405079657**, Kesko Oyj. Kaupan mukaan suomalainen viljelty siika, jalostusmaa Viro, `aikaisemmin jäädytetty`, valmiiksi graavisuolattu, viipaloitu tuote; säilytys 0–3 °C, avattuna enintään 2 vuorokautta.
- Lähde: https://www.k-ruoka.fi/kauppa/tuote/pirkka-parhaat-graavisiikafile-siiv-100g-6410405079657
- **Ratkaiseva rajoitus:** valmis graavisuolattu siika ei ole reseptin `500 g raaka siikafilee + 22 g suolaa + 14 g sokeria + 24 h graavaus` mukainen raaka-aine. Sitä ei saa merkitä tämän reseptin hyväksytyksi ainesosaksi tai graavata uudelleen samalla ohjelmalla. Voidaan erikseen ehdottaa valmiiseen graavisiikaan perustuvaa tarjoilureseptiä omalla identiteetillään.
- **Päätös:** `RTE_CURED_PRODUCT_IDENTIFIED`; **EI HYVÄKSYTTY nykyisen raakafileereseptin korvaajaksi**.

## 2. Muikunmäti

### Ehdokas M1: Hätälä Muikun mäti 125 g

- **EAN 6408790008901**, Hätälä Oy, Oulu. S-kauppojen tuotetiedot: suomalainen `Coregonus albula`, mäti ja suola; raaka-aine saadaan kotimaisilta kalastajilta ja pakataan sekä pakastetaan Oulun tehtaalla.
- Lähde: https://www.s-kaupat.fi/tuote/hatala-muikun-mati-125g/6408790008901
- Pakastuskäsittelyn täsmällistä aika-lämpötilaohjelmaa, sulatusohjetta ja eräkohtaisia käyttöpäiviä ei tuotetiedoissa yksilöidä. 125 g pakkaus ei yksin riitä reseptin 140 g määrään; tarvittaisiin kaksi pakkausta tai reseptin erillinen punnittu muutos.
- **Päätös:** `PRODUCT_AND_EAN_IDENTIFIED`, `FROZEN_BY_MANUFACTURER`, `FREEZE_PROCESS_UNVERIFIED`, `THAWED_USE_WINDOW_UNVERIFIED`. Julkaisu HOLD.

### Ehdokas M2: Järvi-Suomen Kalatuote Muikunmäti 150 g

- Valmistajan suora tuotesivu: muikunmäti ja 1,9 % suola, **150 g pakastetuote**, säilytys `−18 °C`, sulanutta tuotetta ei saa pakastaa uudelleen.
- Lähde: https://www.kalatuote.fi/muikunmati
- Valmistajan tiedoissa ei ole yksilöity pakastuskäsittelyn aika-lämpötilaohjelmaa tai sulaneen mädin käyttöaikaa. Tuotteesta löytyy S-kaupan tuotesivu mutta ilman varmistettua 150 g EAN-osumaa tässä katselmoinnissa: https://www.s-kaupat.fi/tuote/muikun-mati/6418142000507
- Reseptin 140 g voidaan punnita yhdestä 150 g pakkauksesta; jäljelle jäävä osa käsitellään valmistajan ohjeen mukaan.
- **Päätös:** `MANUFACTURER_PRODUCT_SPEC_VERIFIED`, `PACK_SIZE_MATCH`, `FREEZE_PROCESS_UNVERIFIED`, `THAWED_USE_WINDOW_UNVERIFIED`. Julkaisu HOLD.

### Vaihtoehtoiset tunnistetut tuotteet

- Kalavapriikki Muikunmäti 150 g, tuotenumero **51501**, GTIN **6430071600696**. Valmistajan pakastevalikoima: https://www.kalavapriikki.fi/tuotteet/pakasteet/
- Kainuun Kalatuote Kiannan Muikun mäti, EAN **6405117600008**, valmistaja Kainuun Kalatuote Oy: https://www.s-kaupat.fi/tuote/kainuun-kalatuote-pakastettu-kiannan-muikun-mati/6405117600008
- Nämä ovat tuotteiden yksilöintiä, **eivät** vielä todisteita valitun erän loisriskin käsittelyn kestosta.

## 3. Ruokaviraston sovellettava vaatimus

- https://www.ruokavirasto.fi/elintarvikkeet/elintarvikeala/tuote--ja-toimialakohtaiset-vaatimukset/kalat-ja-kalastustuotteet/jaadytysvaatimus/
- https://www.ruokavirasto.fi/elintarvikkeet/oppaat/kalastustuoteohje/kalastustuoteohje/

Sellaisenaan syötäville graavikaloille ja suolatulle mädille, joille ei ole dokumentoitua vapautusta, vaaditaan loisriskin jäädytyskäsittely. Vaihtoehdot ovat −20 °C vähintään 24 h, −35 °C vähintään 15 h, tai vähintään 96 h −18 °C:ssa säilytettynä, mikä täyttää erillisen käsittelyn poikkeuksen. Pakkausmerkintä `pakaste` ilman ajallista näyttöä ei todenna jälkimmäistä. Vapautetut lajit ja viljellyn siian dokumenttiperusteinen vapautus tarkistetaan Ruokaviraston ohjeesta. Pakastaminen **ei hävitä listeriaa**.

## 4. Tarvittavat täsmäkysymykset

**Siikafileestä valmistajalle tai jakelijalle (EAN 2396012800003 tai 2371423800002):**

1. Onko tämä nimenomainen fileetuote tarkoitettu syötäväksi kuumentamatta graavauksen jälkeen?
2. Onko raaka-aine/tuote jäädytetty loisriskin hallinnan edellyttämään aika-lämpötilaan tai onko käytössä kirjallinen, asetuksen mukainen vapautus (viljelyn alkio-/rehuselvitys)?
3. Mikä on sulatuksen jälkeinen säilytys- ja käyttöaika, ja miten tuote tulee käsitellä graavauksessa?

**Muikunmädistä valmistajalle (Hätälä EAN 6408790008901 tai Järvi-Suomen Kalatuote 150 g):**

1. Onko tuote valmis syötäväksi kylmänä sulatuksen jälkeen, ja onko loisriskin vaatima jäädytys ollut −20 °C/24 h, −35 °C/15 h tai vähintään −18 °C/96 h?
2. Mikä on tuotekohtainen sulatusohje, enimmäiskäyttöaika sulatuksesta/avaamisesta ja säilytyslämpötila?
3. Koskeeko vastaus nimenomaan yllä olevaa EANia/150 g tuotetta ja nykyistä tuoteversiota?

## 5. Johtopäätös ja jatkopolku

- **Tuotteiden yksilöinti ratkaistu**, mutta **toimitettujen tuotetietojen ja viranomaisvaatimuksen välinen turvallisuustodisteketju ei ole vielä kokonainen**.
- Kirjaa tuotteet **ehdokkaiksi**, älä muuta FI/EN/SV/TH-reseptin ainesosia vahvistamatta niitä. Nykyiset graavisiika ja muikunmäti pysyvät `draft` / `SAFETY_HOLD`.
- Älä keksi valmistajavastausta, jäädytyskäsittelyn tunteja tai eräpäiväystä.
- Kahdeksan muuta itsenäistä reseptiä etenevät erillisellä toimituksellisella hyväksymispolulla ilman näitä kahta HOLD-tapausta.
- Tuotesivut eivät todista tällä hetkellä myymäläkohtaista saatavuutta; osa tuotetiedoista on julkaistu, vaikka tuote ei ole valitun kaupan valikoimassa.

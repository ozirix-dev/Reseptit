# GI/GK – mahdolliset myöhemmät toimenpiteet ja hyväksyntäportit

> **STATUS: BACKLOG / NO IMPLEMENTATION AUTHORIZED.** Tämä on 13.11.2026 tutkimus-PR:n liite, ei valtuutus tehdä refaktorointia, GI-lähdemuutoksia, SQL-migraatiota tai pilvijulkaisua. Toteutuspäivä on tarkoituksella päättämättä: *joskus tai jouluna*.
>
> **Periaate:** mitä tahansa siivotaan, säilytetään valmistettavan reseptin identiteetti, historialliset GK-sidokset ja turvallisuus-/lähde-HOLDit. **Yhtäkään muuta työhaaraa tai #532:n reseptimuutosta ei saa muokata tämän kartoituksen perusteella.**

## 1. Päätettävät asiat

| Päätös | Tämä auditointi ehdottaa | Mikä tarvitaan ennen muutosta |
| --- | --- | --- |
| Säilytetäänkö Git-JSON GI:n totuutena? | **Kyllä Recipavo V1:ssä** | Ei tietokantasiirron tarvetta |
| Säilytetäänkö SQLite kehityksen hakuindeksinä? | **Kyllä** | Lähde-SHA:n ja cache-rebuildin regressiot |
| Siirtyykö SQLite Cloudflareen? | **Ei** | Jos vaatimukset muuttuvat, käsitellään erillisenä päätöksenä |
| Otetaanko Cloudflare D1 käyttöön GI/GK:lle? | **Ei nyt** | Käyttötapaus, suorituskyky, budjetti, migraatio, palautus ja täsmäversion hyväksyntä |
| Poistetaanko GK80/GK100/GK149-historiaa? | **Ei sokkona** | Todenna kaikki riippuvuudet, 326/87, vaihtoehtoinen auditointipolku |
| Puretaanko tekstin käänteissovituksia? | **Vain katselmoidusti** | Ensin todistetaan vaikutus numeerisiin GK-arvoihin ja hyväksyntöihin |
| Yhdistetäänkö GI-lähde ja soveltuvuusharkinta? | **Ei yhdeksi numeroksi** | Erilliset lähde → havainto → soveltuvuus -tietueet ja katselmointi |
| Saako tämä Draft PR päätyä tuotantoon? | Vain dokumentaatiomuutos erillisellä päätöksellä | Normaali koodikatselmointi; ei julkaisuvaltuutta |

## 2. Ehdotetut viisi erillistä toteutuspakettia

Alla oleva järjestys kuvaa riippuvuuksia, **ei luvattua aikataulua**. Jokainen paketti tarvitsee erillisen rajauksen, omistajan ja PR:n vain, jos sen toteuttamisesta myöhemmin päätetään.

### P1 — Julkaisu-artefaktin tietorajat ja koon mittaus

**Tavoite:** todistaa, ettei suljettu GI-/makro-/hyväksyntäaineisto päädy Cloudflareen tai GitHub Pagesiin, ja mitata aidosti julkaistavat tiedostot.

Tehtävä:
1. Lukitse tarkka lähtö-SHA; rakenna `RECIPAVO_PREVIEW_ORIGIN`-konfiguraatiolla ja erikseen stagingin `/Reseptit/`-pohjalla.
2. Laadi `dist`-manifesti: kaikki reittityypit, globien koot, siirretyt JS-chunkit, staattiset JSONit, kuvat, metadata ja sisäisten lähteiden mahdolliset nimet.
3. Testaa kielteiset ehdot (`*.sqlite`, `*.db`, kokonaiset GI- ja food-rekisterit, `tmp/nutrition`, hyväksyntämanifestit, owner-approval / HOLD-salaisuudet). Pelkän polkutestin lisäksi katso julkisten JS-bundlejen sisältöön. Älä tee väärää kielteistä tulosta jo tarkoituksella julkaistuista GK-lähdeviitteistä.
4. Positiivinen vertailu: neljä kieltä, lupa julkaistuille GK-arvoille tai null, oikea näyttö eri GK-versioille, 84 karanteenireitin 404, oikeat canonical/hreflang/noindex-ympäristösäännöt.
5. Kirjaa mitattu määrä, bytes, SHA ja poikkeamat; älä suorita tuotantodomainin siirtoa.

**Valmis kun:** voidaan perustella täsmäartefaktista mitä julkaistaan ja mitä jää sisäiseksi; ei GI-raaka-aineiston tai kesken olevien hyväksyntöjen julkista altistusta. Riski vakava → yksikin P0-vuoto pysäyttää jatkoetenemisen.

**Tätä auditointi-PR:ää ei saa naamioida P1:n suoritukseksi:** tässä ei rakennettu tai tarkastettu tuoretta `dist`-hakemistoa.

### P2 — Lähde/havainto/soveltuvuus -suhteen kartoitus ja deduplikointi

**Tavoite:** lopettaa usean reseptin saman GI-lähdekysymyksen selvittäminen uudestaan erikseen.

Suunnittele yhteensopiva näkymä:
- `Source`: tutkimuksen lähde-ID, DOI/URL, menetelmä, osallistujat, vuosi, oikeudet ja tarkistus.
- `Observation`: yksilöllinen **ihmisellä mitattu** GI-arvo tai erikseen imputoiduksi merkitty malli, ruokalaji, valmistus, glukoosiasteikko, poikkeama ja alkuperäisen havainnon tunniste.
- `Applicability`: käytettävissä oleva GI-havainto **tähän reseptiin, tähän tuotteeseen, tällä valmistustavalla**, eksplisiittinen hyväksyntä tai esto; mikään yleinen ryhmäanalogia ei periydy automaattisesti reseptiin.
- `Composition`: omat Fineli/AFCD/CNF-/tuote- ja annospainosidokset; ei GI-lähteen sisään sotkettuja CHO-arvoja.

Yhden tutkimuksen useat siteeraukset eivät saa näyttää eri riippumattomilta mittauksilta. Nykyisen 64-rivisen rekisterin `qualityTier`, `matchKind`, `evidenceKind`, `referenceScale` ja `calculationUse` säilyvät **mappauksen kautta**; vanhoja rivejä ei automaattisesti "paranneta" DIRECT/EXACT-luokkaan.

**Valmis kun:** 64 lähderivin ja nykyisten reseptisidosten kaksoislaskenta, epävarmuus ja puuttuvat kentät on auditoitu. Hakurajapinta tuottaa myös hylkäyssyyt, eikä laskurin tulos muutu ilman hyväksyttyä lähde-/reseptipäätöstä.

**Ei vielä:** lähteen massalatausta, laajaa tutkimustaulukoiden kopiointia, SQL-skeeman käyttöönottoa tai päättelyllä generoituja uusia GI-arvoja.

### P3 — Historialukkojen ylläpitovelan mittaus ja tarvittaessa rajattu purku

**Tavoite:** selvittää, onko `approved-recipe-note-edits.ts`-tyyppinen käänteissovitus aitoa siirtymäsuojan tarvetta vai kasvavaa korjausvelkaa.

Ensin **mittaus**:
- Lista eri perukemoduuleista: kuka niitä tuo, montako reseptiä, montako käänteismuutosta ja kuinka monta tekstin/hashivertailua.
- Regressio-/CI-viiveiden syyt viimeisistä sisältö-PR:istä; erottele _todellinen hyväksymättömän sisällön muutos_ vs. _vain toimituksellinen tekstiero_.
- Verrataan vanhan hyväksytyn lähdeversion SHA:ta, nykyistä FI-sisältöä, sen käännöksiä ja mahdollisen erillisversion tarkkaa soveltuvuutta.
- Tehdään esimerkki 2–3 eri riskiluokan reseptistä, ei massamigraatiota.

Mahdollinen tuleva tavoitemalli:
1. Historiallinen `approvedSnapshot` on muuttumaton.
2. Nykyinen toimituksellinen esitysteksti saa erillisen SHA:n ja katselmointitodisteen.
3. Päätös **mitkä ravinto- tai valmistusosat vastaavat historiallista lähdettä** on eksplisiittinen.
4. GK-laskelma ei periydy uudelle valmistusversiolle ilman luotettavaa reseptikohtaista arviota.
5. Testit vertaavat GK:n numeroita, arviointityyppiä, lähde-ID:tä, GI-/CHO-syötteitä, erillisversiota ja julkista näkyvyyttä; ei pelkästään vihreää rakentumista.

**Valmis kun:** osoitetaan mitattu laskentakierto-/ylläpitosäästö ja testit todistavat **326 historiallisen laskennan ja 87 hyväksyntäversion erillisen säilymisen**. Jos säästöä ei osoiteta, mitään ei tarvitse poistaa.

### P4 — Vaikuttavimmat puuttuvat GI-havainnot yhteiseen työjonoon

**Tavoite:** löytää vähemmällä päällekkäisellä tutkimuksella enemmän oikeita GK-päätöksiä.

- Ryhmittele nykyisten keskeneräisten reseptien puuttuva GI todellisen `foodKey + preparationKey + product` -soveltuvuuden mukaan.
- Pisteytä **käytettävissä oleva CHO/annos × riippuvaisten erillisten reseptien määrä × lähteen löydettävyys**; näytä myös turvallisuus- ja lisenssiriskit.
- Aloita korkeintaan 20 sellaisesta lähdepuutteesta, joiden korjautuminen voisi aidosti avata monta alkuperäisreseptiä.
- Selvitä saman havainnon lähde- ja mittausidentiteetti; toistettu viite ei ole uusi mittaus.
- Hae vain hyväksyttäviä lähteitä ja dokumentoi valmistustavan sekä syödyn osuuden ero. Ei rohkeaa ryhmäimputointia käyttäjälle varmana lukuna.

**Valmis kun:** on deduplikoitu tutkimusjono ja **todennettuja** uusia soveltuvuuspäätöksiä tai täsmä-HOLDeja. Mittari ei ole "lisättyjen GI-rivien määrä" vaan "kelvollisen GK:n hyväksyntään saaneiden alkuperäisreseptien määrä".

### P5 — Mahdollinen D1-/Nutrition Core -päätös, vain todellisen käyttötarpeen perusteella

Ei suositella Recipavo V1:een. Avataan erillinen tutkimus vasta, jos syntyy todellinen tarve:
- Usean sovelluksen hyväksyttyä koostumuskantaa pitää hallita **päivittämättä jokaista sivustoa**.
- Käyttäjän reseptieditointi tai live-personointi vaatii palvelinpuolen hakuja.
- Staattinen bundle/julkaisunopeus alkaa mitatusti estää toimintaa.
- Git-lähteiden versionhallintaa, lisenssejä ja SHA-approvaleja voidaan edelleen toteuttaa.

Erillisen kustannus-/turva-arvion minimisisältö:
1. D1:n versioitu schema, import, backup, restore, read replicas tarvittaessa, rajat ja bindings.
2. SQL- ja Worker-kyselyiden mittaus, todellinen kustannusarvio sekä yläraja ja käyttöhälytykset.
3. Source-of-truth-omistajuus: **joko** Git-lähde ja D1:n toistettava projektio, **tai** erillinen päätös migroidusta kanonisesta varastosta. Ei kahta itsenäistä totuutta.
4. Julkaisun fail-safe, read-only offline-vaihtoehto ja palautus ilman GI-arvon muuttumista.
5. Kirjautumisen ja henkilötietojen rajapinta **erillinen** julkisista GI-havainnoista.
6. Lisenssit ja jälleenkäytön sallittavuus riveittäin.

**Päätössääntö:** jos ratkaisu ei ole V1:n olemassa olevaa staattista mallia selvästi parempi mitattavassa käytössä, **ei migraatiota**.

## 3. Vähimmäisregressiot jokaisessa tulevassa toteutus-PR:ssä

1. Täsmä-main-SHA + nykyisen CI:n todelliset rajaukset; ei käsin tehtyjä odottamattomia historiapäivityksiä.
2. Alkuperäis-GK: 326 vanhaa, alkuperäisten numeerinen joukko ja arvot eivät muutu vahingossa; erilliset 87 hyväksyntäversiota sekä niiden source/input/evidence hashit ennallaan.
3. Kaikki julkiset alkuperäisreseptit: ainesosat, annos, kypsennys, ravintoarvot ja käännösten sidokset säilyvät.
4. Pending/HOLD: tuntematon GI/CHO ei muutu nollaksi, eikä 34 uuden GK-pendingin lähde-SHA:ta siirretä hyväksytyksi.
5. Karanteeni: kaikki 21 FI-tunnistetta ja neljän kielen 84 reittiä pysyvät eristettyinä ja 404; kyse on ajantasaisesta rekisteristä, määrä voi muuttua myöhemmin.
6. Julkinen GK: alkuperäisen vs. erillisversion vs. tutkimusannoksen erotus näkyy neljällä kielellä.
7. Julkaisun erottelu: GitHub Pages `/Reseptit/`, Cloudflare-preview `/`, tuotantodomain **ei muutu** ilman erillistä lupaa.
8. Lähteiden oikeudet: yksittäiset julkaistut viitteet sallituissa rajoissa; ei suurten lisensoitujen raakakantojen tahatonta julkaisua.

## 4. Hyväksyntämalli ja omistajat

- **Tutkimuksen omistaja:** tämän auditointi-PR:n tekijä; ei oikeutta koskea Codexin avoimeen resepti-PR:ään.
- **Sisällön omistaja:** Reseptit nykyisine resepti-, GI/GK- ja turvallisuusportteineen.
- **Muutosten hyväksyjä:** käyttäjä erikseen, myöhemmän PR:n todelliselle SHA:lle ja laajuudelle.
- **Cloudflare-tuotantodomain:** erillinen nimenomainen myöntävä päätös; tämän PR:n merge ei ole lupa.
- **ReportHub:** voi arkistoida päätöksen/havainnon myöhemmin, mutta ei korvaa live-GitHubin hyväksyntärekisteriä.

## 5. Raportointimalli mahdolliselle jatkolle

| Mittari | Auditin lähtötaso | Tuleva mittaus |
| --- | --- | --- |
| Kanoniset GI-rivit | 64 | Muuttuneet rivit ja uusi lähdenäyttö eriteltynä |
| Alkuperäinen historiallinen GK-joukko | 326 | Kaikki tarkisteet/vahvistetut numerot |
| Erillisten versioiden historiallinen suoja | 87 | Versiokohtainen numerointi ja vaikutus |
| Uudet GK-pending-lähdesidokset | 34 | Edelleen pending / todistettavasti ratkaistu |
| Nykyinen GI-skeemavelka | 45 ilman `evidenceKind` | Oikeasti luokitellut havainnot ja käyttökielto |
| Julkisen artefaktin koostumus | Ei tästä auditista mitattu | Byte-tason manifesti, P0-vuotoja 0 |
| Hakasulkulähteiden ja legacy-adapterien lukumäärä | Ei vielä mitattu | Muutoksen ennen/jälkeen |
| D1:n lisäkustannus | 0 nykyisessä GI-polussa | Toteutunut kulutus ja raja, jos joskus päätetään |
| Recipavo tuotantodomain | Coming Soon erillisen aikaisemman näytön mukaan | **Ei tämän työn piirissä** |

## 6. Myöhempi päätöspohja

Kun käyttäjä joskus haluaa jatkaa, päätös voidaan tehdä **yhdellä viestillä**: nimetään yksi yllä kuvattu työpaketti sekä hyväksyttävä vaikutusalue. Myöhemmän toteuttajan pitää kuitenkin ensin tarkistaa nyky-main, avoimet PR:t ja viimeisimmät lähdesidokset; vuoden 2026 auditointi ei ole ikuinen lähdetotuus.

**Tämän liitteen valmistuminen = hyvä päätöspohja. Ei vielä yhtä ainutta tuotantomuutosta.**

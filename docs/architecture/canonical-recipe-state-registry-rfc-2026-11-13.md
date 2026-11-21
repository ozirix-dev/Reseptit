# RFC: Yksi kanoninen reseptien nykytilanäkymä, historia erilleen

> **TILA: DRAFT / ARKKITEHTUURIEHDOTUS — EI TOTEUTUS- TAI JULKAISULUPAA**
>
> Luotu 13.11.2026. Tämä dokumentti tallentaa jatkokehityksen suunnan. Älä yhdistä tai toteuta automaattisesti meneillään olevien reseptijulkaisujen yhteydessä. Käsittele erillisenä vasta, kun aktiivinen julkaisuohjelma on vakaa.
>
> **Omistajuus:** tämän dokumentin PR kuuluu vain tämän ehdotuksen dokumentaatioon. Ei muutoksia resepteihin, historiahyväksyntöihin, GI/GK-laskentaan, käännöksiin, testeihin, julkaisuputkeen tai toisen työn haaroihin.

## 1. Miksi tämä tarvitaan

Reseptillä voi olla samaan aikaan julkaistu FI-sivu, EN/SV/TH-käännöksiä, vanha draft, karanteenissa oleva historiallinen ID, korjattu V2, vanha HOLD-merkintä, ravintoaine-evidenssi, alkuperäisen GK:n historiatiivisteet sekä julkaisu-buildissa sovellettu toimituksellinen korjaus. Eri työjonot eivät välttämättä osoita samaan sisällön versioon.

Haitat:
- Jo julkaistun työn uusi käsittely ja väärät puuttuvien reseptien määrät.
- Vanhentunut HOLD tulkitaan nykyisen julkaistun reseptin esteeksi.
- Vihreä CI, ravintoarvon hyväksyntä ja julkaisuhyväksyntä sekoittuvat.
- Uudet PR:t aiheuttavat turhia lähde-SHA-, merkitys-SHA- ja hyväksyntäkonflikteja.
- Julkaisuputken todellisen tilanteen selvittämiseen kuluu enemmän aikaa kuin sisällön korjaamiseen.

**Ratkaistava kysymys:** mikä on yhden kanonisen ruokalajin *nykyinen tuotantoon näkyvä tila* juuri tietyssä Git-commitissa, ja mitkä täsmälliset toimet estävät seuraavan julkaisun?

## 2. Arkkitehtuuripäätöksen ehdotus

**Yksi luettava kanoninen nykytilanäkymä (read model), ei toista itsenäistä totuusvarastoa.**

- Git-repon nykyiset resepti-, lähde-, käännös-, karanteeni-, historia- ja hyväksyntätiedostot säilyvät toistaiseksi omien osa-alueidensa auktoritatiivisina lähteinä.
- Yksi deterministinen koonti johtaa niistä *johdetun* nykytilanäkymän commit-SHA:han sidottuna. Sama syöte antaa saman tuloksen.
- Kaikki uusia työjonoja tai julkaisuvalmiutta raportoivat työkalut lukevat lopulta samaa **johdettua nykytilaa**, eivät kukin omia irrallisia heuristiikkojaan.
- Historiallinen evidenssi jää muuttumattomana erilliseksi, jäljitettäväksi auditointikerrokseksi; nykytila vain *viittaa* siihen.
- Uutta tietokantaa, D1:tä, SQLite-tuotantoriippuvuutta tai uutta käsin päivitettävää hyväksyntärekisteriä **ei ehdoteta**.
- Eteneminen on vaiheittainen ja aluksi **read-only**: mikään nykyinen julkaisu ei saa muuttua ensimmäisen pilotin vuoksi.

Tämä RFC **ei** korvaa [GI/GK-auditointi-PR #533](https://github.com/ozirix-dev/Reseptit/pull/533):n lähde- tai historiatyötä. #533 selvittää GI/GK-laskennan evidenssiä; tämä RFC käsittelee reseptin kaikkia julkaisutiloja ja työnjonoja.

## 3. Kaksi eri tasoa

### A. Nykyinen kanoninen tila: koneiden käyttämä projektio

Yksi tietue kanonista ruokalaji-ID:tä kohti. Vähimmäiskenttien ehdotus (ei vielä lukittu skeema):

| Kenttä | Selitys |
| --- | --- |
| `canonicalRecipeId`, `publicSlug` | Yhden näkyvän ruokalajin identiteetti; myös kielikohtaiset slug-viittaukset |
| `sourceCommit`, `contentHash` | Mistä tarkasta commitista ja lopullisesta julkaistavasta FI-sisällöstä nykytila on johdettu |
| `publicState` | Näkyvä / draft / quarantine / editorial-hold / superseded; ei sama kuin tiedoston `status` |
| `effectiveSource` | Buildin nykyinen lopullinen sisältö toimituksellisten korjausten jälkeen, sekä alkuperäisen lähteen jälki |
| `languages` | FI/EN/SV/TH: julkaistu, puuttuu, draft, vanhentunut, katselmointia odottaa + merkitystiiviste |
| `nutrition`, `glycemicLoad` | Aineiston ja hyväksynnän tila; GK-arvo, arvio ja 'ei määritetty' erotellaan repon nykyisten sääntöjen mukaan |
| `image` | Kuvan lähdeversio, julkaisu- ja vastaavuustila |
| `safety`, `editorial` | Ratkaisemattomat olennaiset turvallisuus-/sisältöesteet |
| `lineage` | Vanha ID, seuraajaversio, uudelleenohjaukset, duplikaatit ja viite alkuperäiseen näyttöön |
| `blockers` | Vakavuus, tarkka syy, nykyversioon pätevyys, seuraava korjattava toimenpide |
| `evidenceRefs` | Viittaukset tarkkoihin lähde-, laskenta-, käännös- ja hyväksyntätiedostoihin, ei itse historian kopio |
| `releaseEligibility` | Johdettu päätös + perustelu; ei uusi omistajan hyväksyntä |

Tavoitteena ei ole litistää kaikki hyväksynnät yhteen YES/NO-kenttään. Esimerkiksi FI:n julkaisuvalmius, kieliversion katselmointi, turvallisuus, GK:n hyväksyntä ja todellinen Pages-deploy ovat eri asioita.

### B. Historia ja auditointi: pysyvä evidenssi

Säilytä muuttumattomana tai nykyisen sallitun versionhallintamallin mukaisesti:
- Alkuperäisten reseptien ja GK-laskelmien version/syötteen/evidenssin SHA-sidokset.
- Lähdelinkit, valmistus- ja tuotekohtaiset epävarmuudet.
- Aiemmat HOLD-syyt ja niiden ratkaisuversiot.
- V2/korvausketjut sekä aikaisemmin julkaistut osoitteet.
- Käännösten tarkistusnäyttö, kaksi merkitystiivistettä ja katselmointipäivä.

**Periaate:** vanhan julkaisun hyväksyntää ei koskaan päätellä automaattisesti uudelle muuttuneelle reseptille. Jo ratkaistu historiallinen HOLD ei saa automaattisesti estää uutta hyväksyttyä seuraajaa.

## 4. Tietojen sovittamisen deterministiset säännöt

1. Käytä Git-commitia ja sen tiedostoja; älä luota avoimen PR:n tai historiallisen issue-tekstin ajantasaisuuteen.
2. Tunnista yksi kanoninen ruokalaji ja kaikki siihen liittyvät ID:t. Jos seuraajasuhde on epäselvä, merkitse se konfliktiksi — älä päättele sokkona.
3. Muodosta **effective FI** samalla toimituksellisella korjauspolulla kuin julkinen build. Älä mittaa lähdetiedoston tiivistettä ja kutsu sitä lopullisen julkisen sisällön tiivisteeksi.
4. Laske reitti- ja näkyvyystila nykyisillä karanteeni-, draft- ja build-säännöillä. Julkaistu lähdetiedosto ei automaattisesti tarkoita näkyvää ruokalajia.
5. Kytke hyväksyntä tarkkaan versioon, ravintolaskennan syötteisiin ja mahdolliseen kielipariin. Vanha näyttö jää näkyväksi historiassa mutta ei siirry uuteen versioon.
6. Tuota erillinen lista ristiriidoista: esim. vanha työlista väittää HOLD, nykyinen julkinen effective FI ja uudempi näyttö ratkaisevat havainnon. Älä automaattisesti hyväksy kumpaakaan ilman eksplisiittistä perustetta.
7. Älä kirjoita takaisin nykyisten omistavien rekisterien tietoihin ensimmäisessä vaiheessa. Näytä korjaussuositus ja lähtötietojen viitteet.

## 5. Eteneminen neljässä rajatussa toteutuspaketissa

### P0 — Mittaa ongelma ennen toteutusta (read-only)

- Laske per nykyinen main: kanoniset näkyvät FI:t, nelikieliset, FI-only, karanteenissa olevat kanoniset ruokalajit, draftit, superseded ja julkiset toimitukselliset HOLDit.
- Näytä 20–30 esimerkkiä virheellisistä/vanhentuneista rinnakkaisista työmerkinnöistä ja niiden todellinen nykytila.
- Mittaa kuinka monta CI-virhettä tai PR-kierrosta viimeisissä sisältöerissä johtui vanhentuneista SHA-sidoksista tai tilatiedoista verrattuna aitoihin sisältöongelmiin.
- Määritä pilottiin yksi pieni reseptijoukko: tavallinen FI-only, nelikielinen, V2-seuraaja, karanteenitapaus, julkinen HOLD ja alkuperäinen GK-historialukko.

**Tuotos:** perusteltu hyöty-/riskiraportti, ei uusia tiloja tuotantoon.

### P1 — Kanoninen lukunäkymä ilman julkaisuvaikutusta

- Luo tarvittaessa pieni erillinen generointityökalu käyttäen olemassa olevia parsijoita ja build-sääntöjä.
- Tulosta versionoitu schema JSONina tai vastaavana määrämuotoisena rajapintana vain sisäiseen työkalukäyttöön.
- Estä generoidun sisäisen historian/approvals-datan päätyminen julkiseen `dist`-pakettiin.
- Tarkista vähintään pilottijoukon tulokset julkaistun buildin ja repon historiaketjun kanssa.

**Tuotos:** lukupohjainen raportti, ei korjauksia tai julkaisuportin vaihtoa.

### P2 — Kuluttajien hallittu siirtäminen

Siirrä yksi kerrallaan, mikäli P1 todistetusti vastaa nykyistä toimintaa:
1. Julkaisutilan ja duplikaattien laskurit.
2. FI-lähde- ja käännösjonon näyttö.
3. Karanteenin seuraajaluokitus ja julkaisujono.
4. Ravinto/GK-tilan raportointi (ei laskennan tai hyväksyntöjen muuttamista).

**Aina** kaksoislue vanha ja uusi rinnakkain, vertaa diffiä, selvitä poikkeamat ja säilytä mahdollisuus palauttaa vanhaan laskentaan.

### P3 — Vasta lopuksi arvioi julkaisuporttien yhtenäistys

Vasta kun yhteinen lukunäkymä on kattava ja oikein:
- Käykö porttien määrää vähentää?
- Mitkä kontrollit ovat päällekkäisiä vain teknisesti, mitkä suojaavat oikeaa sisältö- tai turvallisuusriskiä?
- Onko vanha tekstin käänteissovitus poistettavissa ilman GK-historian rikkoutumista?

Erillinen omistajapäätös ennen kirjoittavia migraatioita tai porttien muutoksia.

## 6. Regressiot ja hyväksymiskriteerit

- P0/P1 ei muuta yhtäkään tuotannon reseptiä, reittiä, kuvaa, käännöstä tai numeerista GK-arvoa.
- Kaikkien alkuperäisten GK-sidosten, erillisten hyväksyntäversioiden ja historiallisten hashien eheys säilyy. Älä kovakoodaa tähän dokumenttiin vanhoja laskurilukuja uutena normina.
- Nykyisten pakollisten CI-tarkistusten vaatimus säilyy; niitä ei ohiteta RFC:n perusteella.
- V2-seuraaja ei näy uutena ruokalajina kahteen kertaan. Julkinen slug säilyy tai muuttuu vain eksplisiittisellä migraatiolla.
- `GK: ei määritetty` ei muutu nollaksi eikä aiheuta keksittyä numeerista GK:ta.
- Käännösten tarkistus pysyy täsmälleen lähdeversioon ja kielipariin sidottuna.
- Mittareita ovat vähentyneet virheelliset HOLDit, päällekkäinen käsittely, turhat CI-/PR-kierrokset ja keskeneräisen tilan selvittämiseen kulunut aika. Pelkkä uuden rekisteritiedoston luonti ei ole onnistuminen.
- Jos pilotissa ei osoiteta todellista hyötyä, **älä migroi**.

## 7. Ei nyt / rajaukset

- Ei tuotantodomainin käyttöönottoa, muutosta Cloudflareen eikä uutta tietokantaa.
- Ei GI/GK-lähteiden tai numeeristen laskelmien muokkausta.
- Ei historiallisten tietueiden massapoistoa, hyväksyntöjen automaattista siirtoa tai HOLDien nollausoperaatiota.
- Ei rinnakkaisten Codex-työhaarojen muokkausta eikä käynnissä olevan reseptien autonomisen julkaisutyön blokkaamista.
- Ei suorituksen automatisointia pelkän tämän RFC:n perusteella.

## 8. Milloin tähän palataan?

**Vasta aktiivisen laajan reseptijulkaisuajon jälkeen tai sen erillisessä huoltovaiheessa.** Toteutus alkaa P0-mittauksesta; tämä Draft on muistiin talletettu päätöspohja, ei kiireellinen korjaus-PR.

Tämä RFC kuuluu pidempään teknisen velan ohjelmaan, mutta sen tehtävä on yksinkertainen: **yksi nykytilanäkymä, monta muuttumatonta historialähdettä, ei kahta kilpailevaa totuutta**.

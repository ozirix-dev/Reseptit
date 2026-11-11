# F25 – kaksi FI-reseptiä / kuusi kieliversiota, erillinen julkaisu-PR

Päivä 10.11.2026. Tämä PR julkaisee vain kaksi olemassa olevaa FI-reseptiä kolmella kielellä. Pohjana on ajantasainen `main`-haara, **ei** vanhan F25 [Draft #399](https://github.com/ozirix-dev/Reseptit/pull/399) -haaran yhdistäminen. Käännösten `status` vaihdetaan `draft → published`; julkaisuindeksi muuttuu **64 FI-lähteestä ja 192 kieliparista 66 lähteeseen ja 198 kielipariin**.

## Besan-chilla tomaatilla ja sipulilla

- FI-raakablobi `fc2be49b7bde49f950dd24f1d3f3d38644bf7a8f`; julkinen FI-ohje ja otsikko ovat [PR #420:n](https://github.com/ozirix-dev/Reseptit/pull/420) SHA-lukitun projektorin kautta korjattuja. Ei reseptiin kuulumatonta tomaattichutneyta.
- Punnittu koostumus: 100 g kuivaa kikhernejauhoa, 100 ml vettä, 1 keskikokoinen tomaatti = **125 g syötävää** (Fineli 352), 1 keskikokoinen keltasipuli = **55 g syötävää** (Fineli 335), 6 g tuoretta korianteria, 1 rkl paistoöljyä = **13,5 g** (Fineli 541) ja valinnainen suola. 2 annosta; paistoöljy laskettu kokonaan syödyksi.
- Lähde `docs/nutrition/calculations/intialainen-besan-chilla.json`, blob `4616457dff9335cca9befd85d01094756cc760a3`; laskenta `AUTOMATED ONLY`. Ainesrivi × tietokannan 100 g -arvo / 2 antaa neljä FI-metadataan täsmäävää makroa / annos: nettohiilihydraatti **22,78 g**, hiilihydraatti kuitu mukaan lukien **33,86 g**, proteiini **10,63 g**, rasva **9,73 g**.
- EN/SV/TH: valmistusvaiheiden tomaatin ja sipulin oletuspainot on ilmaistu erikseen. FI:n sisäiset `main_ingredient`-hakutunnisteet säilyvät (`kikhernejauho`, `tomaatti`, `sipuli`), mutta otsikot, ainesnimet ja valmistus ovat käännettyjä. Neljä valmistusvaihetta kaikilla kielillä.
- Julkisen FI-esityksen `semanticHash`: `68fdaf8b2b5125be987b2bc186bc08efde5916f51c41d9d5ba24a92e4eb6ea9c`.
- Kohdekielten semanttiset SHA:t: EN `b94b2b1a94dfc93523e3d3422026c80ad4a8f86a35df359314573178ce697052`, SV `41cdd2d49c3b185a3d6fe3de57821b93e2f6757512eafe73d22b4a4e228a1ca4`, TH `a635b59853033b1f4f97dfbb623409aaef7936a666fd3fa54bc55930b04d3b71`.

## Vietnamilainen kahvijogurtti banaanilla

- FI-raakablobi `4f215df58a68fe86d5c03a7d11c7fc516f823d3f`; [#420:n](https://github.com/ozirix-dev/Reseptit/pull/420) julkinen FI-esitys yksilöi laskennan maitotuotteen, jogurtin rasvapitoisuuden ja banaanin massan.
- Punnittu koostumus: **100 g maustamatonta 3,9 % jogurttia** (Fineli 620), **200 ml mustaa valmista kahvia** (AFCD F003065), **1 keskikokoinen kuorittu banaani = 125 g syötävää** (Fineli 11049), **30 g makeutettua kondensoitua lehmänmaitoa** (AFCD F005582). 2 annosta. Tätä ei saa vaihtaa makeuttamattomaan tiivistemaitoon ilman uudelleenlaskentaa.
- Lähde `docs/nutrition/calculations/vietnamilainen-kahvijogurtti-banaanilla.json`, blob `8a1a7e245a088381b23a52caf32dcbf7ef7eef76`; `AUTOMATED ONLY`. Uusintalaskennan nettihiilihydraatti **21,39 g**, hiilihydraatti kuidun kanssa **22,45 g**, proteiini **3,80 g**, rasva **3,68 g / annos**, kaikki neljä nykyisen FI-metadata-arvon mukaisia.
- EN/SV/TH:n ainesrivissä ja valmistusohjeessa makeutettu kondensoitu lehmänmaito on nimetty täsmällisesti ja 3,9 % jogurtti sekä 125 g banaanioletus on avattu. Kokonaisuus on juotavan notkeaa kahvi-jogurttiseosta, ei paksu rahkakulho. Neljä valmistusvaihetta kaikilla kielillä.
- Julkisen FI-esityksen `semanticHash`: `870928eb42eb8661b05e96d6f3aef55410bbed21961dd52306c3fd9ff3408268`.
- Kohdekielten SHA:t: EN `8f54b00f426948b6b60018570dd13357dfb8ae74006d2b8d30477dcaa908d1ae`, SV `8147b94e4901627ef57001d78d7eed8e0058f589c3b1bdedd722211622bd6a8d`, TH `838803a1eb49493308585cc85bf438120ba4006fb761b18ae227a1d21a971fe8`.

## Katselmoinnin rajat ja julkaisuportti

- Kaikki kuusi `codex-review-evidence.json`-merkintää ovat **AI:n FI-public→EN/SV/TH-merkityskatselmoinnin** `pass`-tuloksia, versio- ja sisällön SHA-256-lukittuja. Ne **eivät** ole natiivipuhujan, koekeittiön tai laboratoriomittauksen todistuksia.
- Ravintoluvut ovat tietokantapohjaisia **viite-elintarvikkeen arvioita**. Tomaatin, sipulin tai banaanin todellinen massa ja maitotuotteen koostumus voivat muuttaa käyttäjän todellista annosta. Muuttuvia tuotemerkkejä ei väitetä samoiksi.
- FI-raaka-aineet, annosmäärät, alkuperäiset ravintolaskennan JSON-syötteet, GI/GK-tietueet ja kuvatiedostot pysyvät koskemattomina. Ei uusia FI-reseptejä, eikä muita F25-käännöksiä tähän julkaisuun.
- Ennen mergeä vaaditaan juuri tämän release-PR:n **täsmä-HEADin CI SUCCESS**, mukaan lukien muuttuneiden reseptien validointi ja käännösten merkityshashien tarkistus. Tämän jälkeen merge, vastaavan merge-SHA:n Pages build+deploy SUCCESS ja erillinen live-reitti-HTTP-smoke vain jos sen voi todentaa.
- Edeltävän #420:n oma Pages-ajo [#42904587902](https://github.com/ozirix-dev/Reseptit/actions/runs/42904587902) epäonnistui deploy-vaiheessa, mutta myöhempi `main`-ajon [#42904789813](https://github.com/ozirix-dev/Reseptit/actions/runs/42904789813) **build+deploy SUCCESS** sisältää saman julkisen FI-projektorin. Tämän PR:n julkaisussa on käytettävä aivan uutta merge-SHA:n käyttöönoton todistetta.
- [F25 Draft #399](https://github.com/ozirix-dev/Reseptit/pull/399) **DO NOT MERGE**; muut 18 F25-reseptiä / 54 kieliversiota pysyvät tästä julkaisusta erillään. Rinnakkaisiin PR:iin ja uusiin resepteihin ei kosketa.

## CI-löydös: Thai-sipulin kappaleyksikkö

Ensimmäisen täsmä-HEADin CI [#42910391735](https://github.com/ozirix-dev/Reseptit/actions/runs/42910391735) pysähtyi yksikkötarkistukseen `intialainen-besan-chilla:th: ingredient 4 unit not recognized (kpl → หัว)`. **Thai `หัว` on sipulin luonnollinen kappalelaskuri**, ja F25:n oma rakennetarkistin jo normalisoi sen muotoon `kpl`. Virhe oli yleisessä `site/scripts/translation-audit.ts`-auditoinnissa, joka tunnisti kpl-vastineita `ลูก`, `ผล`, `ชิ้น`, `ฟอง` mutta ei `หัว`.

Korjaus lisää vain `หัว` → `each`-vastineen olemassa olevaan sallittujen kappalemerkintöjen joukkoon ja kohdennetun auditointiregressiotestin. Suomenkieliset ainesmäärät, thainkielinen reseptiteksti, julkaisun kuusi semanttista SHA:ta ja ravintoarvot **eivät muutu**. Testi edellyttää, että julkaisuauditointi hyväksyy juuri tämän Thain besan-chillan julkaistuna kieliparina. Näin ei heikennetä muuten tuntemattomien yksiköiden fail-closed-käytöstä.

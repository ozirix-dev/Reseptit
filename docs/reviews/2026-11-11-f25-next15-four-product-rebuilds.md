# F25 – 15 HOLD-lähdettä ja neljä tuotekohtaista uudelleenlaskentaa (11.11.2026)

## Tarkoitus ja julkaisuesteet

Pohja `main` `f0e3a4dbb23eba7dc11d0dbdb495132faa8c958d`. F25 käännöksistä 30/75 mainissa; 45 kieliversiota / 15 FI-lähdettä jäljellä. Koko käännösrekisteri 69 FI / 207 kieliparia. F25:n vanhaa [#399 Draftia](https://github.com/ozirix-dev/Reseptit/pull/399) EI yhdistetä. Näistä 15 lähteestä 9:llä ei ole toistettavaa laskentasyötettä, kuudella on tuotekohtainen tai menetelmällinen HOLD. Kaksi on julkisessa karanteenissa: maakouda ja nasi goreng.

Kaikki neljä alla olevaa **laskentaa ovat tuotevalittuja kandidaatteja, eivät tuotantoon hyväksyttyjä makroja**. GI/GK-lukkoja ei muuteta, alkuperäinen FI Markdown säilyy identtisenä ja `release_authorized:false` pysyy kunnes reseptin uusi tuotekohtainen hyväksyntä valmis. Tämä repo pitää FI:n ravinto- ja GK-lähdehashit sinetöityinä; pelkkä reseptin tai laskentamallin muuttaminen rikkoisi versionseurannan. Erillinen FI-/ravinto-/GK-/kielilukkojen hyväksyntä tarvitaan tuotantoon. [Koneelliset syöterivit ja kaikki 15 lähdettä](../../meta/kaannokset/f25-next15-four-product-rebuilds-20261111.json).

## Neljän mallin luvut

Järjestys seuraavissa luvuissa: **imeytyvä netto-HH / HH kuidun kanssa / proteiini / rasva**, g/annos. Kaikki 100g-koostumusluvut kerrotaan syötävällä grammapainolla ja jaetaan annosluvulla; EU:n ilmoitettu hiilihydraatti ei sisällä kuitua.

| FI-lähde | Alkuperäinen FI (g/annos) | Uusi lähteistetty kandidaattilaskelma (g/annos) |
|---|---|---|
| `rahka-marjakerroskulho` | 6.32 / 8.09 / 8.05 / 6.01 | **6.73 / 8.16 / 8.33 / 5.85** |
| `intialainen-pinaatti-paneer-chilla` | **neljä makroa puuttuu** | **21.34 / 32.47 / 21.63 / 13.79** |
| `lahi-ita-zaatar-munat` | 24.91 / 26.07 / 12.18 / 14.26 | **25.29 / 26.72 / 12.34 / 14.46** |
| `japanilainen-hojicha-jogurtti-persimonilla` | 17.03 / 19.34 / 4.26 / 4.07 | **17.16 / 20.11 / 4.42 / 4.07** |

### 1. Rahka-marjakerroskulho, 4 annosta

Pääaineet: [Valio pehmeä maitorahka](https://www.valio.fi/tuotteet/valio-pehmea-maitorahka/) 250 g, [Salakis 10% turkkilainen jogurtti](https://salakis.fi/tuotteet/turkkilainen-jogurtti-10/) 100 g, AFCD-raakamansikka 100 g, metsämustikka 50 g, [Salliselta hasselpähkinä](https://salliselta.fi/tuotteet/pahkinat-ja-mantelit/pahkinat/hasselpahkina) 20 g ja [Ruotsin elintarvikeviraston sitruunankuoriviite](https://matdata.se/en/foods/lemon-zest-602/) 2 g. **Sitruunankuoren 1 tl = 2 g on vasta oletus**, ei koekeittiössä punnittu. Myös metsämustikan tietue on yksilöitävä täsmälliseen versioon ja ”makeutusainetta maun mukaan” rajattava esimerkiksi 0 grammaan tai määriteltyyn erytritoliannokseen. Nykyinen FI näyttää 6,32 g netto-HH, uusi malli 6.73 g: vanhaa tulosta ei voi todentaa samaksi ilman täsmätuotevalintaa. Pähkinä- ja maitoallergeenit selkeiksi.

### 2. Pinaatti-paneer-chilla, 2 annosta

100 g AFCD-besania, 50 g raakaa pinaattia, 140 ml ravintosisällöltään nollaa vettä, [Arla Apetina Paneer](https://www.arla.fi/tuotteet/arla-apetina/paneer-225g-69940/) 100 g, [Salliselta jauhettua juustokuminaa](https://salliselta.fi/tuotteet/mausteet/juustokumina-jauhettu) **mallissa 2 g**, Fineli 541 paistoöljyä 13,5 g (1 rkl). Nimenomaan jauhetun mausteen **1 tl = 2 g on ratkaisematon punnitus**; öljy on laskettu kokonaan syödyksi. Neljä FI-makroa puuttuvat alkuperäisestä. Malli 21.34 / 32.47 / 21.63 / 13.79; ei yhtään valmista laskentahyväksyntää. FI:n vanha luettelosta puuttuva chutney/sitruuna on julkisesta ohjeesta jo poistettu, mutta kanoniseen tiedostoon ei tässä kajota.

### 3. Za’atar-munat, 2 annosta

Fineli 858 muna 110 g kuorettomana, pita 1056 100 g, 3,9% jogurtti 620 100 g, Fineli 541 öljy 13,5 g sekä [Salliselta za’atar](https://salliselta.fi/tuotteet/mausteet/zaatar) **oletettuna 2,5 g / 1 tl**. Mausteseos sisältää **seesamia**, joka on ilmoitettava allergioissa. Uudessa mallissa netto-HH 25.29 g/annos; vanhan poisjätön 0,1 g/annos yläraja ei pidä täsmätuotteella. Täsmägrammamitta, FI:n neljän makron, GK:n ja kaikkien kielten uudet hashit vielä hyväksyttävä.

### 4. Hojicha-jogurtti, 2 annosta

200 g 2,5% maustamatonta jogurttia (Fineli 619), 150 g syötävää raakaa persimonia (AFCD), 5 g seesaminsiemeniä ja **2 g syötävää hienoa jauhetta**. [Renée Voltaire Hojicha Roasted](https://reneevoltaire.se/en/products/hojicha-rostad) ilmoittaa 100 g:lle 13 g hiilihydraattia, 64 g kuitua, 16 g proteiinia ja 0,7 g rasvaa. Tuotteen ravintotietojen massatasapaino on uskottava, toisin kuin aiemmin esillä olleen Purasana-jauheen ristiriitainen 100 g:n summa. Kuivat jauhetut lehdet **syödään**, niitä ei uuteta eikä siivilöidä pois. Verrattuna vanhaan FI:n 19,34 g kokonais-HH-kuitu -arvoon uusi malli on **20.11 g/annos** (ero noin 0,77 g). Selvitä kuitenkin nimenomaan oikea tuotepakkaus ja sidottu laskentatiedosto. Tämä resepti sisältää seesamia ja maitoa.

## 11 muun reseptin jatkotoimet

| Resepti | Este | Seuraava konkreettinen työ |
|---|---|---|
| `vietnamilainen-papaija-kookospuuro` | Menetelmä/tuote-HOLD | Specify dry small tapioca pearls and preparation time, keep all 700 ml cooking water retained or re-model drain |
| `vietnamilainen-banh-cuon-sienilla` | Menetelmä/tuote-HOLD | Verify steamer/wrapper release, measured fish sauce and pork minced safely cooked, realistic 25 min preparation |
| `vietnamilainen-banh-xeo-aamiaisletut` | Menetelmä/tuote-HOLD | Decide turmeric in ingredient list vs remove from title/method, cook raw prawn fully; macro retest |
| `pohjoisafrikkalainen-baghrir` | Menetelmä/tuote-HOLD | Check 150 ml water/200 g dry flour and one-sided cook, correct unlisted butter claim, 25 min fermentation |
| `meksikolainen-chilaquiles-verdes` | Makrosyöte puuttuu | Product-match salsa verde and queso fresco, list edible corn tortilla and oil; supply all four macros |
| `meksikolainen-paputostada-aamupalaksi` | Makrosyöte puuttuu | Specify cooked 150 g black beans, avocado flesh grams and tortilla model; supply all four macros |
| `korealainen-kimchi-jeon-aamiaiseksi` | Makrosyöte puuttuu | Product-match kimchi 150 g, water in batter from kimchi plus separately added water, compute four macros |
| `karibia-plantain-aamiaislautanen` | Makrosyöte puuttuu | Weigh peeled plantain, avocado flesh, lime juice, eggs and oil retention; all four macros absent |
| `munakoiso-kesakurpitsalasagne` | Makrosyöte puuttuu | Select 180 g or 200 g pasta and dry/cooked state, cheeses and sauce, recalc all four macros; GI/GK remains separate |
| `pohjoisafrikkalainen-maakouda` | **KARANTEENI** | Public quarantine; potato edible grams & published CHO 4.84 g/serving inconsistent without source. New recipe and full nutrition/GK before unquarantine |
| `indonesialainen-nasi-goreng-aamiaisriisi` | **KARANTEENI** | Public quarantine; 150 g kecap manis and ambiguous 100 g rice dry/cooked require new recipe, macro and GK |

## Julkaisuportti

PR on **vain lähde-/ravintoaineiston tarkistus**, ei julkaisulupa. Koneellinen testi lukitsee 15:n lähteen täsmä-Git-blob-SHA:t, epävarmat punnitukset, allokaatiot, kaikki neljä laskettua arvoa ja sen, ettei HOLD-lähde ole kielijulkaisun rekisterissä. Vuorotellen hyväksyttävät 2–5 lähteen erät poistetaan tästä HOLD-taulukosta vain dokumentoidussa omassa julkaisu-PR:ssä, jossa laskenta, mahdollinen GK, FI-julkisen version SHA ja kieliversioiden semanttiset SHA:t ovat ajantasaisia. `sourceStatus: HOLD` ei muutu vihreän testin avulla hyväksynnäksi.

Ei väitettä laboratoriomittauksesta, riippumattoman ravintoasiantuntijan tai natiivipuhujan hyväksynnästä eikä fyysisestä koepaistosta.

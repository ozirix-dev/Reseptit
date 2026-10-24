# Ravintoarvioiden erä 11 — 25.10.2026

Erä sisältää 20 julkaistua reseptiä. Jokaisella on koneellisesti uudelleenlaskettava syöte kansiossa `calculations/`, manifesti tiedostossa `batches/batch-11.json` sekä arvot suomenkielisessä sivussa ja julkaistuissa englannin-, ruotsin- ja thaikäännöksissä.

## Menetelmä ja prosessin tarkistus

Kaikki laskelmat käyttää yhteistä `site/scripts/nutrition-model.ts`-mallia. Auditointi laskee arvot uudelleen laskentasyötteestä ja tarkistaa reseptin ainesosat, määrät, annoskoon, lähdetietueet sekä julkaistut käännökset. Arvot lasketaan pyöristämättömistä määristä ja pyöristetään lopuksi kahteen desimaaliin. Ne ovat reseptin suuntaa-antavia arvioita, eivät laboratorioanalyysejä.

Finelin Release 20 -tietueille käytettiin CHO 2034-, FIBT 2168- ja POLYL 2260 -komponentteja. Finelin CHO on imeytyvä hiilihydraatti, joten polyoleja ei vähennetä siitä uudelleen. AFCD Release 3:n saatavilla oleva hiilihydraatti johdettiin paritetuista arvoista, jotka sisältävät tai eivät sisällä sokerialkoholeja. Kokonaishiilihydraatti on imeytyvä hiilihydraatti + kuitu + lähteistetyt polyolit. Tuntemattomia nutrientteja ei käsitelty nollina.

Auditin lähtötilassa oli 20 `ESTIMATE WITH EVIDENCE` -reseptiä, 86 aiempaa arviota ilman toistettavaa näyttöä ja 219 puuttuvaa reseptiä. Erän jälkeen audit näyttää 40 evidenssillä tuettua arviota, 86 selvitystä odottavaa vanhaa arviota ja 199 puuttuvaa. Aiemmat 86 sivuarvoa säilyivät ennallaan.

## Erävalinnat ja tarkennukset

Valitut reseptit: gazpacho, spanakopita, tabbouleh, pasta alla Norma, poronkäristys kukkakaalimuusilla, souvlaki, koshari, harira, kreikkalainen moussaka, marokkolainen couscous, döner kebab, Chettinad-kana, tomaatti-kananmuna-wokki, baozi, bulgogi, congee-riisipuuro, kana-parmesaanipannu parsakaalilla, perunaton liha-juureskeitto, kermainen kanasienipannu sekä raejuusto-pesto-kasviskulho.

Alkuperäisestä ehdokasjoukosta jätettiin pois tandoori- ja jerk-kana: reseptien luullisen koipilihan syötävää osuutta ei voitu vahvistaa lähteistä. Chow mein jätettiin pois, koska reseptin osterikastikkeelle ei löytynyt käytettävissä olevista lisensoiduista paikallisaineistoista riittävää tuotetietuetta. Tunisialainen ojja jätettiin pois, koska harissalle ei löytynyt vastaavaa lähdetietuetta. Tilalle valittiin neljä laskettavaa reseptiä: kana-parmesaanipannu, liha-juureskeitto, kermainen kanasienipannu ja raejuusto-pesto-kasviskulho. Näistä kaikista löytyi lähteistetyt pääainesosat.

Toistettavuuden parantamiseksi reseptejä ja kaikkia julkaistuja käännöksiä täsmennettiin:

- Tabboulehin kaksi persiljanippua muutettiin 60 grammaksi.
- Spanakopitan kahdeksan filotaikina-arkkia muutettiin 160 grammaksi.
- Tomaatti-kananmuna-wokin kolme kypsän riisin annosta muutettiin 450 grammaksi.
- Congeen riisiksi määrättiin jasmiiniriisi ja nesteeksi kanaliemi (2 l), jotta sivun luku vastaa yhtä yksiselitteistä versiota.

Marokkolaisen couscousin reseptissä on kaksi lihavaihtoehtoa; laskenta käyttää reseptissä jo mainittua paistileikettä eli luutonta reisilihaa. Gazpachon etikka laskettiin yleisellä viinietikan tietueella, koska molemmat reseptissä mainitut vaihtoehdot ovat viinietikoita. Dönerin kaalisalaatti vastaa Finelin teollista coleslaw-keskiarvotietuetta. Kreikkalaisen moussakan raastetulle kovalle juustolle käytettiin puolikovan Edam-juuston yleistä tietuetta; Dijon-sinapille käytettiin AFCD:n cream-style-mustard-tietuetta. Nämä tuotevastaavuudet ovat laskennan näkyviä arvio-oletuksia.

## Poisrajaukset

Vesi ja suola kirjattiin nollavaikutteisiksi makrojen osalta. Pienten määrien poisrajauksissa laskentasyöte sisältää konservatiiviset annoskohtaiset ylärajat, ja malli summaa ne reseptikohtaisesti. Chettinad-kanan curry- ja fenkolilehtien yhdistetty yläraja on 3,5 kcal, 0,55 g nettohiilihydraattia, 0,75 g kokonaishiilihydraattia, 0,3 g proteiinia ja 0,25 g rasvaa annosta kohti. Baozin kuivahiivan yläraja on 8 kcal, 0,4 g nettohiilihydraattia, 0,5 g kokonaishiilihydraattia, 0,9 g proteiinia ja 0,1 g rasvaa. Liha-juureskeiton kahden laakerinlehden ja kuuden kokonaisen pippurin yhteisraja on 1,5 kcal, 0,2 g nettohiilihydraattia, 0,4 g kokonaishiilihydraattia, 0,2 g proteiinia ja 0,2 g rasvaa. Muut määrättömät suola- ja pippurimausteet on rajattu alle 1 kcal:n ja 0,1 gramman kunkin ravintoarvon osalta.

Kaikki lisätty ruokaöljy ja muu rasva laskettiin mukaan kokonaan. Paistamisen haihtumista, pannulle jäävää rasvaa tai annoksen loppupainoa ei arvioitu. Annosjako käyttää reseptissä ilmoitettua annosmäärää.

## Käytetyt lähteet

Fineli Release 20, CC BY 4.0: tietueet #1, #31, #110, #117, #162, #205, #300, #311, #322, #324, #335, #339, #346, #352, #359, #362, #369, #386, #389, #398, #399, #536, #576, #631, #643, #649, #689, #734, #858, #929, #1056, #1107, #1370, #3323, #8513, #11062, #11089, #11521, #11562, #28946, #30968, #33862, #34159, #34245, #34611. THL ja Fineli nimetään lähteinä; lähde ei merkitse THL:n hyväksyntää.

FSANZ AFCD Release 3, CC BY-SA 3.0 Australia, Australian dataa koskevin käyttöehdoin: tietueet F000396, F000514, F000810, F001929, F002452, F002479, F002594, F002806, F002963, F003190, F003192, F003239, F003327, F004193, F004210, F004213, F004726, F005700, F005946, F005973, F006159, F006187, F006250, F006281, F006316, F006321, F006497, F006618, F007682, F008761, F008936, F008969, F009021, F009335, F010466. Jokainen tietue ja sen lisenssi tallentuu reseptikohtaiseen laskentasyötteeseen.

Laskennassa tärkeät vastaavuudet: raaka kanafilee/reisiliha AFCD F002594/F002806; raaka naudan ulkofilee ja keittoliha F000810/F000514; kana- ja lihaliemi F008936; valkoinen riisi F007682 tai Fineli #11521, kypsä riisi Fineli #1370; bulguri F001929; couscous F003239; kuiva pasta/vermiselli Fineli #117; tuoreet lehtiyrtit ja mausteet lähdetaulun mukaisesti. Hariran tuore korianteri otettiin AFCD-tietueesta F003192, sillä Fineli #34238:lta puuttui kuituarvo. Kermainen kanasienipannu käyttää AFCD:n tuoretta herkkusientä F005946: Fineli #345:n polyoliarvo oli puuttuva. AFCD:n paritetuista saatavilla olevan hiilihydraatin arvoista saadaan laskentaan lähteistetty polyolierotus.

## Julkaistut arvot annosta kohti

| Resepti | Nettohiilihydraatit (g) | Kokonaishiilihydraatit (g) | Proteiini (g) | Rasva (g) |
| --- | ---: | ---: | ---: | ---: |
| gazpacho | 18.61 | 21.91 | 3.60 | 14.69 |
| spanakopita | 16.15 | 19.20 | 14.23 | 26.75 |
| tabbouleh | 11.34 | 13.99 | 2.54 | 14.11 |
| pasta-alla-norma | 64.86 | 70.84 | 12.66 | 11.56 |
| poronkaristys-kukkakaalimuusilla | 5.65 | 9.20 | 31.20 | 21.21 |
| souvlaki | 30.85 | 34.17 | 43.60 | 20.67 |
| koshari | 95.71 | 102.95 | 22.23 | 12.00 |
| harira | 33.89 | 40.88 | 20.54 | 8.26 |
| kreikkalainen-moussaka | 32.22 | 37.65 | 27.59 | 35.19 |
| marokkolainen-couscous | 67.45 | 76.50 | 46.82 | 14.71 |
| doner-kebab | 30.89 | 33.73 | 35.77 | 34.60 |
| chettinad-kana | 3.59 | 5.10 | 34.21 | 12.37 |
| tomaatti-kananmuna-wokki | 38.93 | 40.64 | 12.98 | 16.58 |
| baozi | 80.36 | 84.52 | 26.69 | 14.53 |
| bulgogi | 62.81 | 64.98 | 43.15 | 8.29 |
| congee-riisipuuro | 40.21 | 40.80 | 8.50 | 5.14 |
| kana-parmesaanipannu-parsakaali | 2.91 | 4.87 | 36.94 | 27.38 |
| liha-juureskeitto-perunaton | 5.61 | 9.04 | 39.75 | 1.19 |
| kermainen-kanasienipannu | 3.06 | 5.53 | 26.91 | 26.36 |
| raejuusto-pesto-kasviskulho | 2.99 | 3.89 | 10.37 | 10.90 |

## Eräarvio ja seuraava työ

Erän laskentamalli ja auditin varmennus toimivat: kaikki 20 reseptiä ovat `ESTIMATE WITH EVIDENCE` -tilassa, neljä julkaistua arvoa täsmää laskentatulokseen, ja julkaistut käännökset on tarkistettu. Kahdessa Fineli-tietueessa ollut puuttuva pakollinen ravintoarvo havaittiin jo laskennan aikana ja korjattiin vaihtamalla lisensoituun AFCD-tietueeseen. Sama laatutarkistus jää osaksi seuraavia eräkierroksia.


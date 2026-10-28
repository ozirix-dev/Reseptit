# AJO 1.5 – sipulin GI-lähteen korjaus ja vaikutusauditointi

## Päätös ja julkaistu lähtötilanne

Lähtö-main `775711c3e81fba4ad25e489f17eb83c05be99e10`: 326 / 137 / 189. Ehdotus: **326 / 118 / 208**. Muuttumattomia laskettuja 113, muuttuvia laskettuja 5, takaisin keskeneräisiksi 19, edelleen keskeneräisiä 189. Nettokattavuus −19, uusi kattavuus 36,2 %. Tämä on Draft-PR:n ehdotus; tuotanto säilyy 137/326:ssa ennen erillistä hyväksyntää.

## Alkuperäisen näytön jäljitettävyys

- [Virheellinen DOI 10.3390/nu12103041](https://doi.org/10.3390/nu12103041) kuuluu äidin DHA-lisän ja lapsen kehityksen tutkimukseen. Se ei ole GI-lähde.
- [Carneiro ja Leloup 2020, oikea DOI](https://doi.org/10.3390/nu12102989): Table 1 sisältää yleisen sipulirivin GI 15. Table 2 -merkintä oli väärä. Kokotekstin XML tarkistettiin Europe PMC:stä (PMC7599769); taulukkohuomautus viittaa yleisesti glycemicindex.comiin ja Jenkinsin vuoden 1981 GI-julkaisuun. Sipulin omaa koeryhmää, valmistusmuotoa, annosta tai protokollaa ei yksilöidä.
- [Anderson, Soeandy ja Smith 2013](https://doi.org/10.3945/an.112.003509), Table 3 ja alaviite 2: sipulin GI 10–15 on verkkolähteistä, koska arvoja ei löytynyt vertaisarvioiduista julkaisuista tai GI-taulukoista; valmistusmenetelmät puuttuvat. Taulukko ilmoittaa glukoosiviitteen, mutta alkuperäisen sipulikokeen asteikkoa ei siten voida varmentaa. Kustantajan indeksoitu taulukko ja PMC-hakutulos olivat saatavilla; koko 2013 XML:n nouto epäonnistui.
- [Hoffman ym. 2016, ihmisillä tehty sipuli-interventio](https://pubmed.ncbi.nlm.nih.gov/27026422/) tutki sipuliaterian vaikutusta glukoosikuorman vasteeseen. Se ei vahvista tämän tietueen sipulin GI 15:tä tai reseptien valmistusta.
- [Sydneyn GI-tietokannasta](https://glycemicindex.com/gi-search/) ja primaaritutkimushauista ei jäljitetty valmistukseltaan sopivaa sipulin GI 15 -mittausta. Negatiivista hakua ei pidetä todisteena kaikkien mahdollisten tutkimusten puuttumisesta.

**Johtopäätös:** raakaa tai kypsennettyä sipulia koskevaa, tähän lukuun jäljitettävää ihmisillä tehtyä GI-mittausta ei varmennettu. LOW-analogia ei korvaa puuttuvaa alkuperäisnäyttöä. Tietue säilyy historiallisena `REFERENCE_ONLY`-viitteenä, sen DOI/taulukko/tekijät/valmistuskuvaus korjataan ja kaikki 54 aktiivista sidontaa poistetaan. `referenceScale: GLUCOSE_100` kuvaa katsauksen ilmoittamaa asteikkoa, ei varmennettua primaarikoetta.

## Vaikutusalue ja rajaus

48 reseptiä / 54 ainesriviä: 24 laskettua ja 24 ennestään keskeneräistä. Suora ID-haku ja onion-ruokaperhehaku palauttavat samat 48 käyttäjää; joukossa on myös valkosipulia, kevätsipulia ja salottisipulia. Laskenta käyttää vain nimettyä giRecordId:tä, eikä ehdokaslista tai alias lisää epäsuoria laskentasidontoja. Historiallisten inventaarioiden kopiot eivät ole aktiivisia syötteitä. Kaikkien 278 muun reseptin kokonaiset tulosrivit sekä syöte- ja lähdefingerprintit pysyvät identtisinä.

Myös punapaprikan `red-pepper-literature-analogue-gi-40` käyttää samaa väärää DOI:ta. Sitä ei korjata tai hyväksytä tässä sipuliin rajatussa PR:ssä; se tarvitsee oman kiireellisen vaikutuskatselmoinnin. Muiden GI-perheiden aiempaa LOW-lähdehyväksyntää ei vahvisteta uudelleen tällä auditilla.

## Pienosuuskäsittelyn tarkistus

Pelkkä GI-sidonnan poisto ja vanhojen oletusten säilyttäminen on koneluettavassa raportissa erillinen `removalOnlyCounterfactual`, ei hyväksytty lopputulos. Yksittäisen osuuden pitää olla alle 1 g ja summan alle 2 g, ilman pyöristystä. Tuntemattomien massojen ja lähteettömien positiivisten maustearvioiden toleranssihyväksyntä poistetaan vain näiltä vaikutusresepteiltä.

[Paikallinen Fineli Release 20 -viite](fineli-release-20-reference.json) vahvistaa keltasipulin 4,8 g HH/100 g, pienen sipulin 30 g ja keskikokoisen 55 g; valkosipulinkynnen 3,5 g; kuorettoman munan 55 g; voin 14 g/rkl; viinietikan 15 g/rkl; kuivatun oreganon ja timjamin 0,5 g/tl ja 1,5 g/rkl; mustapippurin 2 g/tl. AFCD:n valkosipulin 10,2 ja kuivatun oreganon 26,4 g HH/100 g vastaavat käytettyjä koostumusrivejä. Nämä ovat hyväksytyn paikallisen aineiston viitteitä, eivät tuoreiksi väitettyjä Fineli-live-hakuja.

Valkosipulin aiempi 3 g/kynsi korjataan Finelin 3,5 grammaan; souvlakin oregano 6 → 1,5 g/rkl; uuniporsaan voi 13,5 → 14 g sekä pippuri ja timjami lähteistetään. Shakshukan pieni sipuli korjataan 55 → 30 g; resepti jää edelleen keskeneräiseksi. Kevätsipulin 15 g/kpl, salottisipulin keltasipuliproxy ja murskatun valkosipulin 2 g/tl jäävät varmentamatta. Dönerin yksilötarkistuksessa löytynyt juustokuminan maitotuote-GI poistetaan; sen tl-massa jää avoimeksi. Ruoka-aineita tai reseptimääriä ei muuteta lähteettömästi toleranssin saavuttamiseksi.

## Kaikki aiemmin julkaistut vaikutusarvot

| Resepti | GK ennen → ehdotus | Pyöristämätön ennen → ehdotus | Vanha sipuli-GK-osuus | Poisjättö nyt g/annos | Tila |
| --- | --- | --- | ---: | ---: | --- |
| `koshari` | 50.57 → null | 50.57279 → null | 0.22095 | 0.216 | INSUFFICIENT SOURCE DATA |
| `bulgogi` | 40.25 → null | 40.249494999999996 → null | 0.135675 | 0.67088375 | INSUFFICIENT SOURCE DATA |
| `tomaatti-kananmuna-wokki` | 22.81 → null | 22.811483333333335 → null | 0.0345 | 0.695 | INSUFFICIENT SOURCE DATA |
| `kreikkalainen-moussaka` | 18.46 → null | 18.463947333333333 → null | 0.066 | 0.5475 | INSUFFICIENT SOURCE DATA |
| `doner-kebab` | 19.14 → null | 19.14452 → null | 0.12195 | 0.855 | INSUFFICIENT SOURCE DATA |
| `souvlaki` | 17.94 → 17.9 | 17.935485 → 17.901059999999998 | 0.034425 | 0.36675 | CALCULATED |
| `gazpacho` | 8.32 → 8.3 | 8.316315 → 8.304839999999999 | 0.011475 | 0.12675 | CALCULATED |
| `poronkaristys-kukkakaalimuusilla` | 3.19 → 3.09 | 3.18844 → 3.0894399999999997 | 0.099 | 0.716 | CALCULATED |
| `chettinad-kana` | 0.6 → null | 0.6032000000000001 → null | 0.12195 | 1.45975 | INSUFFICIENT SOURCE DATA |
| `kermainen-kanasienipannu` | 1.02 → null | 1.017875 → null | 0.099 | 0.21925 | INSUFFICIENT SOURCE DATA |
| `kana-parmesaanipannu-parsakaali` | 1.31 → null | 1.30715 → null | 0.00765 | 0.178 | INSUFFICIENT SOURCE DATA |
| `vhh-lihapiirakka` | 1.04 → 0.99 | 1.0393450000000002 → 0.9898450000000002 | 0.0495 | 0.37125 | CALCULATED |
| `parsakaali-sinihomejuustofrittata` | 0.97 → null | 0.971325 → null | 0.0495 | 0.6045 | INSUFFICIENT SOURCE DATA |
| `uuniporsas-kermakastikkeessa-vhh` | 0.07 → 0 | 0.066 → 0 | 0.066 | 1.5116333 | CALCULATED |
| `hyderabadi-kanabiryani` | 37.98 → null | 37.978 → null | 0.198 | 0.07925 | INSUFFICIENT SOURCE DATA |
| `bun-cha-hanoi` | 46.54 → null | 46.53984 → null | 0.108 | 0.5718 | INSUFFICIENT SOURCE DATA |
| `intialainen-rava-uttapam` | 19.99 → null | 19.991375 → null | 0.198 | 0 | INSUFFICIENT SOURCE DATA |
| `intialainen-besan-chilla` | 7.22 → null | 7.2173750000000005 → null | 0.198 | 0 | INSUFFICIENT SOURCE DATA |
| `meksikolainen-huevos-a-la-mexicana` | 0.67 → null | 0.672375 → null | 0.198 | 0.3525 | INSUFFICIENT SOURCE DATA |
| `karibia-callaloo-munakas` | 0.18 → null | 0.18 → null | 0.18 | 0.165 | INSUFFICIENT SOURCE DATA |
| `rogan-josh` | 0.97 → null | 0.974 → null | 0.099 | 1.536625 | INSUFFICIENT SOURCE DATA |
| `kreikkalainen-kanavuoka-oliiveilla` | 0.82 → null | 0.8205749999999999 → null | 0.18 | 0 | INSUFFICIENT SOURCE DATA |
| `kana-tagine-sitruunalla` | 0.32 → null | 0.3234 → null | 0.099 | 1.2655 | INSUFFICIENT SOURCE DATA |
| `palak-paneer` | 1.29 → null | 1.293375 → null | 0.099 | 1.596625 | INSUFFICIENT SOURCE DATA |

Viiden säilyvän laskelman luokat eivät muutu: souvlaki MEDIUM, muut neljä LOW. Luokitus käyttää projektin nykyistä lähimpään kokonaislukuun perustuvaa sääntöä; esityspyöristys on erillinen. Poisjättömäärä ei ole täydellinen summa silloin, kun jokin määrä/koostumus on tuntematon: nolla tai alle 2 g ei sellaisessa rivissä hyväksy laskelmaa.

Uuniporsaan GK 0 on nykyisen muuttamattoman mallin tulos: kaikki tunnetut positiiviset hiilihydraattiosuudet (yhteensä 1,5116333333333334 g/annos) jäävät toimituksellisen toleranssin sisään. Se ei väitä ateriaa hiilihydraatittomaksi eikä merkitse puuttuvalle sipuli-GI:lle arvoa 0. Luottamus pysyy LOW-tasolla.

## Reseptikohtainen määrä-, valmistus- ja estokatselmointi

### shakshuka

Annoksia 2. Nykytila INSUFFICIENT SOURCE DATA; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 0.63 g/annos. Pelkän GI-poiston laskennallinen tila: INSUFFICIENT SOURCE DATA; ei erillinen hyväksyntä.

- keltasipuli: aiempi massa 55 g; HH 1.32 g/annos; koostumus `fineli-335-2026-10-24`. Uusi laskentamassa 30. Original recipe: one small onion; Fineli Release 20 #335 KPL_S = 30 g (previous 55 g was medium).

Valmistus alkuperäisestä reseptistä:

1. Kuullota hienonnettu sipuli öljyssä pannulla. Lisää kuutioitu paprika ja kypsennä pehmeäksi.
2. Sekoita joukkoon juustokumina, savupaprika ja tomaattimurska. Mausta ja hauduta noin 10 minuuttia, kunnes kastike sakenee.
3. Tee kastikkeeseen neljä syvennystä ja riko munat niihin.
4. Peitä pannu ja kypsennä miedolla lämmöllä 5–8 minuuttia, kunnes valkuaiset ovat hyytyneet.
5. Viimeistele persiljalla ja tarjoa pannusta.

Muut aiemmat poisjätöt: kananmuna: 0.33 g HH/annos; tomaattimurska: 3.5 g HH/annos; juustokumina, savupaprika, suola, pippuri, chili ja persilja: 0.3 g HH/annos.

Jäljellä olevat mallin estot:

- shakshuka: tomaattimurska: GI value is unpublished, off-scale, or its food/preparation match lacks a rationale.
- shakshuka: juustokumina, savupaprika, suola, pippuri, chili ja persilja: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.

### caponata

Annoksia 4. Nykytila INSUFFICIENT SOURCE DATA; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 0.1826 g/annos. Pelkän GI-poiston laskennallinen tila: INSUFFICIENT SOURCE DATA; ei erillinen hyväksyntä.

- sipuli: aiempi massa 55 g; HH 0.66 g/annos; koostumus `fineli-335-2026-10-24`. Uusi laskentamassa 55. Per-unit mass estimate for sipuli; edible-state basis documented. AJO 1.5: checked against original recipe and Fineli Release 20 #335 (4.8 g available carbohydrate/100 g; KPL_M 55 g, KPL_S 30 g); starting edible onion mass, no cooking-loss deduction.

Valmistus alkuperäisestä reseptistä:

1. Paista munakoisokuutiot öljyssä erissä pehmeiksi ja kullanruskeiksi. Nosta sivuun.
2. Kuullota sipuli ja selleri pannulla noin 8 minuuttia.
3. Lisää tomaattimurska, oliivit ja kaprikset. Hauduta 15 minuuttia.
4. Sekoita joukkoon etikka, sokeri, suola ja munakoiso. Hauduta vielä 5 minuuttia.
5. Anna jäähtyä haaleaksi ja viimeistele basilikalla. Tarjoa leivän kanssa.

Muut aiemmat poisjätöt: tomaattimurskaa: 3.45 g HH/annos; kapriksia: None g HH/annos; punaviinietikkaa: 0.0375 g HH/annos; tuoretta basilikaa: 0.03975 g HH/annos.

Jäljellä olevat mallin estot:

- caponata: tomaattimurskaa: Canned crushed tomato has no preparation-matched GI source. The whole raw tomato GI analogue is removed; raw whole tomato is not cooked crushed tomato.

### koshari

Annoksia 4. Nykytila CALCULATED; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 0.0375 g/annos. Pelkän GI-poiston laskennallinen tila: INSUFFICIENT SOURCE DATA; ei erillinen hyväksyntä.

- sipulia: aiempi massa 110 g; HH 1.32 g/annos; koostumus `fineli-335-2026-10-24`. Uusi laskentamassa 110. Edible piece mass for sipulia: 55 g/unit, Fineli portion where available or standard piece. AJO 1.5: checked against original recipe and Fineli Release 20 #335 (4.8 g available carbohydrate/100 g; KPL_M 55 g, KPL_S 30 g); starting edible onion mass, no cooking-loss deduction.
- valkosipulinkynttä: aiempi massa 6 g; HH 0.153 g/annos; koostumus `afcd-F004193-2026-10-24`. Uusi laskentamassa 7. Fineli Release 20 #393 KPL_M = 3.5 g edible garlic clove; original recipe clove count × 3.5 g. AFCD F004193 supplies raw ingredient available carbohydrate; total starting ingredient retained in the batch.

Valmistus alkuperäisestä reseptistä:

1. Huuhtele linssit ja keitä vedessä kypsiksi mutta napakoiksi, noin 20–25 minuuttia. Valuta.
2. Keitä riisi kypsäksi. Keitä makaroni erillisessä kattilassa pakkauksen ohjeen mukaan ja valuta.
3. Kuullota yksi valkosipulinkynsi pienessä kattilassa öljytilkassa. Lisää tomaattimurska, juustokumina, suola ja sitruunamehu. Hauduta 15 minuuttia.
4. Sekoita loppu valkosipuli etikkaan. Paista sipulirenkaat maissitärkkelyksessä kieritettyinä öljyssä rapeiksi. Valuta talouspaperilla.
5. Kokoa kulhoihin riisi, linssit ja makaroni. Lusikoi päälle tomaattikastiketta ja valkosipulietikkaa. Viimeistele rapealla sipulilla.

Muut aiemmat poisjätöt: punaviinietikkaa: 0.0375 g HH/annos.

Jäljellä olevat mallin estot:

- koshari: sipulia: AJO 1.5: onion GI 15 withdrawn; DOI 10.3390/nu12102989 Table 1 and DOI 10.3945/an.112.003509 Table 3 do not establish a preparation-matched primary human GI. Missing GI is not zero.

### baozi

Annoksia 4. Nykytila INSUFFICIENT SOURCE DATA; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 1.54785 g/annos. Pelkän GI-poiston laskennallinen tila: INSUFFICIENT SOURCE DATA; ei erillinen hyväksyntä.

- kevätsipulia: aiempi massa 30 g; HH 0.345 g/annos; koostumus `afcd-F006250-2026-10-24`. Uusi laskentamassa None. AJO 1.5: Spring-onion 15 g/piece was an unsourced standard-piece assumption, not a verified mass. Original recipe piece count is retained in recipeQuantity; weighed edible mass is required.

Valmistus alkuperäisestä reseptistä:

1. Sekoita lämmin vesi, hiiva ja sokeri. Anna seistä 5 minuuttia. Lisää jauhot ja vaivaa kimmoisaksi taikinaksi. Peitä ja kohota 45 minuuttia.
2. Purista kaalista neste. Sekoita kaali, jauheliha, kevätsipuli, soijakastike, seesamiöljy, inkivääri ja maissitärkkelys.
3. Jaa taikina 12 osaan ja pyöritä palloiksi. Kauli jokainen levyksi niin, että keskusta jää hieman paksummaksi.
4. Laita täytettä keskelle ja poimuta reunat kiinni sämpyläksi. Aseta leivinpaperineliön päälle.
5. Kohota 15 minuuttia ja höyrytä erissä 12–15 minuuttia. Sammuta lämpö ja odota 3 minuuttia ennen kannen avaamista.

Muut aiemmat poisjätöt: kuivahiivaa: None g HH/annos; soijakastiketta: 0.7125 g HH/annos; raastettua inkivääriä: None g HH/annos; maissitärkkelystä: 1.632 g HH/annos.

Jäljellä olevat mallin estot:

- baozi: kevätsipulia: Ingredient mass is missing or invalid.
- baozi: maissitärkkelystä: Potato-products category mean is not a valid match for cornstarch; remove the unrelated GI mapping.

### marokkolainen-couscous

Annoksia 4. Nykytila INSUFFICIENT SOURCE DATA; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 0.111 g/annos. Pelkän GI-poiston laskennallinen tila: INSUFFICIENT SOURCE DATA; ei erillinen hyväksyntä.

- sipuli: aiempi massa 55 g; HH 0.66 g/annos; koostumus `fineli-335-2026-10-24`. Uusi laskentamassa 55. Edible piece mass for sipuli: 55 g/unit, Fineli portion where available or standard piece. AJO 1.5: checked against original recipe and Fineli Release 20 #335 (4.8 g available carbohydrate/100 g; KPL_M 55 g, KPL_S 30 g); starting edible onion mass, no cooking-loss deduction.

Valmistus alkuperäisestä reseptistä:

1. Ruskista broileri öljyssä kattilassa. Lisää sipuli ja kuullota pehmeäksi.
2. Lisää juustokumina, korianteri ja kurkuma. Sekoita ja kaada joukkoon liemi.
3. Lisää porkkanat ja hauduta 20 minuuttia. Lisää kesäkurpitsa ja kikherneet ja jatka kypsennystä 15 minuuttia, kunnes broileri ja kasvikset ovat kypsiä.
4. Valmista couscous pakkauksen ohjeella. Kuohkeuta haarukalla.
5. Nosta couscous tarjoiluastiaan ja asettele päälle broileri sekä kasvikset. Lusikoi päälle hieman lientä.

Muut aiemmat poisjätöt: couscousia: 46 g HH/annos; kanalientä: 1 g HH/annos; jauhettua korianteria: 0.042 g HH/annos; kurkumaa: 0.111 g HH/annos.

Jäljellä olevat mallin estot:

- marokkolainen-couscous: couscousia: GI value is unpublished, off-scale, or its food/preparation match lacks a rationale.
- marokkolainen-couscous: kanalientä: GI value is unpublished, off-scale, or its food/preparation match lacks a rationale.
- marokkolainen-couscous: jauhettua korianteria: GI value is unpublished, off-scale, or its food/preparation match lacks a rationale.

### pasta-alla-norma

Annoksia 4. Nykytila INSUFFICIENT SOURCE DATA; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 0.5125 g/annos. Pelkän GI-poiston laskennallinen tila: INSUFFICIENT SOURCE DATA; ei erillinen hyväksyntä.

- valkosipulinkynttä: aiempi massa 6 g; HH 0.153 g/annos; koostumus `afcd-F004193-2026-10-24`. Uusi laskentamassa 7. Fineli Release 20 #393 KPL_M = 3.5 g edible garlic clove; original recipe clove count × 3.5 g. AFCD F004193 supplies raw ingredient available carbohydrate; total starting ingredient retained in the batch.

Valmistus alkuperäisestä reseptistä:

1. Ripottele munakoisokuutioille suolaa ja anna niiden seistä 15 minuuttia. Taputtele kuiviksi.
2. Paista munakoiso oliiviöljyssä erissä kullanruskeaksi. Nosta sivuun.
3. Kuullota valkosipuli pannulla. Lisää tomaattimurska, suola ja pippuri ja hauduta 15 minuuttia.
4. Keitä pasta suolatussa vedessä pakkauksen ohjeen mukaan. Säästä desilitra keitinvettä.
5. Lisää kastikkeeseen pasta ja munakoiso. Sekoita; lisää keitinvettä tarvittaessa. Viimeistele basilikalla ja ricottaraasteella.

Muut aiemmat poisjätöt: tomaattimurskaa: 3.45 g HH/annos; tuoretta basilikaa: None g HH/annos; suolaista ricottaa: 0.3375 g HH/annos.

Jäljellä olevat mallin estot:

- pasta-alla-norma: tomaattimurskaa: Canned crushed tomato has no preparation-matched GI source. The whole raw tomato GI analogue is removed; raw whole tomato is not cooked crushed tomato.

### bulgogi

Annoksia 4. Nykytila CALCULATED; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 0.07313375 g/annos. Pelkän GI-poiston laskennallinen tila: CALCULATED; ei erillinen hyväksyntä.

- valkosipulinkynttä: aiempi massa 9 g; HH 0.22949999999999998 g/annos; koostumus `afcd-F004193-2026-10-24`. Uusi laskentamassa 10.5. Fineli Release 20 #393 KPL_M = 3.5 g edible garlic clove; original recipe clove count × 3.5 g. AFCD F004193 supplies raw ingredient available carbohydrate; total starting ingredient retained in the batch.
- keltasipulia: aiempi massa 27.5 g; HH 0.33 g/annos; koostumus `fineli-335-2026-10-24`. Uusi laskentamassa 27.5. Edible piece mass for keltasipulia: 55 g/unit, Fineli portion where available or standard piece. AJO 1.5: checked against original recipe and Fineli Release 20 #335 (4.8 g available carbohydrate/100 g; KPL_M 55 g, KPL_S 30 g); starting edible onion mass, no cooking-loss deduction.
- kevätsipulia: aiempi massa 30 g; HH 0.345 g/annos; koostumus `afcd-F006250-2026-10-24`. Uusi laskentamassa None. AJO 1.5: Spring-onion 15 g/piece was an unsourced standard-piece assumption, not a verified mass. Original recipe piece count is retained in recipeQuantity; weighed edible mass is required.

Valmistus alkuperäisestä reseptistä:

1. Sekoita soijakastike, fariinisokeri, seesamiöljy, valkosipuli, raastettu päärynä ja mustapippuri.
2. Kääntele naudanviipaleet marinadissa, lisää sipuli ja anna maustua jääkaapissa 20–30 minuuttia.
3. Huuhtele riisi ja keitä pakkauksen ohjeen mukaan.
4. Kuumenna iso paistinpannu hyvin kuumaksi. Paista liha erissä nopeasti, jotta se ruskistuu eikä ala hautua nesteessään.
5. Lisää kevätsipuli ja seesaminsiemenet. Tarjoa heti riisin kanssa.

Muut aiemmat poisjätöt: seesaminsiemeniä: 0.02488375 g HH/annos; mustapippuria: 0.04825 g HH/annos.

Jäljellä olevat mallin estot:

- bulgogi: kevätsipulia: Ingredient mass is missing or invalid.

### congee-riisipuuro

Annoksia 4. Nykytila INSUFFICIENT SOURCE DATA; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 0.795 g/annos. Pelkän GI-poiston laskennallinen tila: INSUFFICIENT SOURCE DATA; ei erillinen hyväksyntä.

- kevätsipulia: aiempi massa 30 g; HH 0.345 g/annos; koostumus `afcd-F006250-2026-10-24`. Uusi laskentamassa None. AJO 1.5: Spring-onion 15 g/piece was an unsourced standard-piece assumption, not a verified mass. Original recipe piece count is retained in recipeQuantity; weighed edible mass is required.

Valmistus alkuperäisestä reseptistä:

1. Huuhtele riisi kylmällä vedellä.
2. Laita riisi, vesi tai liemi ja suola kattilaan. Kiehauta ja keitä hyvin miedolla lämmöllä kannen raossa noin 60 minuuttia. Sekoita välillä.
3. Kun riisi on hajonnut pehmeäksi puuroksi, sekoita joukkoon inkivääri ja kypsennä vielä 5 minuuttia.
4. Jaa puuro kulhoihin. Lisää kevätsipulia, soijakastiketta ja seesamiöljyä. Tarjoa halutessasi kananmunan kanssa.

Muut aiemmat poisjätöt: kanalientä: 2 g HH/annos; tuoretta inkivääriä: 0.072 g HH/annos; soijakastiketta: 0.7125 g HH/annos; keitettyä kananmunaa: 0.0825 g HH/annos.

Jäljellä olevat mallin estot:

- congee-riisipuuro: kanalientä: GI value is unpublished, off-scale, or its food/preparation match lacks a rationale.
- congee-riisipuuro: tuoretta inkivääriä: GI value is unpublished, off-scale, or its food/preparation match lacks a rationale.
- congee-riisipuuro: kevätsipulia: Ingredient mass is missing or invalid.

### tomaatti-kananmuna-wokki

Annoksia 3. Nykytila CALCULATED; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 0.695 g/annos. Pelkän GI-poiston laskennallinen tila: CALCULATED; ei erillinen hyväksyntä.

- kevätsipulia: aiempi massa 15 g; HH 0.22999999999999998 g/annos; koostumus `afcd-F006250-2026-10-24`. Uusi laskentamassa None. AJO 1.5: Spring-onion 15 g/piece was an unsourced standard-piece assumption, not a verified mass. Original recipe piece count is retained in recipeQuantity; weighed edible mass is required.

Valmistus alkuperäisestä reseptistä:

1. Vatkaa kananmunat kevyesti suolan kanssa.
2. Kuumenna puolet öljystä pannulla. Paista munat pehmeäksi kokkeliksi ja nosta sivuun.
3. Lisää loput öljystä ja paista tomaatteja 3–4 minuuttia, kunnes ne pehmenevät ja mehustuvat.
4. Lisää sokeri ja soijakastike. Sekoita munat varovasti takaisin pannulle ja kuumenna.
5. Viimeistele kevätsipulilla ja tarjoa riisin kanssa.

Muut aiemmat poisjätöt: kananmunaa: 0.22 g HH/annos; soijakastiketta: 0.47500000000000003 g HH/annos.

Jäljellä olevat mallin estot:

- tomaatti-kananmuna-wokki: kevätsipulia: Ingredient mass is missing or invalid.

### harira

Annoksia 6. Nykytila INSUFFICIENT SOURCE DATA; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 1.1386333 g/annos. Pelkän GI-poiston laskennallinen tila: INSUFFICIENT SOURCE DATA; ei erillinen hyväksyntä.

- keltasipulia: aiempi massa 55 g; HH 0.44 g/annos; koostumus `fineli-335-2026-10-24`. Uusi laskentamassa 55. Edible piece mass for keltasipulia: 55 g/unit, Fineli portion where available or standard piece. AJO 1.5: checked against original recipe and Fineli Release 20 #335 (4.8 g available carbohydrate/100 g; KPL_M 55 g, KPL_S 30 g); starting edible onion mass, no cooking-loss deduction.

Valmistus alkuperäisestä reseptistä:

1. Ruskista jauheliha suuressa kattilassa. Lisää sipuli ja selleri ja kuullota muutama minuutti.
2. Lisää tomaattimurska, huuhdellut linssit, lihaliemi, inkivääri, kurkuma ja kaneli.
3. Kiehauta ja hauduta kannen alla noin 45 minuuttia, kunnes linssit ovat lähes pehmeitä.
4. Lisää valutetut kikherneet ja vermiselli. Keitä vielä vermisellin pakkauksen ohjeen mukaan.
5. Sekoita joukkoon korianteri ja sitruunamehu. Tarkista suola ja tarjoa kuumana.

Muut aiemmat poisjätöt: tomaattimurskaa: 2.3000000000000003 g HH/annos; lihalientä: 0.6666666666666666 g HH/annos; jauhettua inkivääriä: None g HH/annos; kurkumaa: 0.148 g HH/annos; kanelia: 0.04583333333333334 g HH/annos; tuoretta korianteria: 0.06333333333333334 g HH/annos.

Jäljellä olevat mallin estot:

- harira: tomaattimurskaa: Canned crushed tomato has no preparation-matched GI source. The whole raw tomato GI analogue is removed; raw whole tomato is not cooked crushed tomato.

### kreikkalainen-moussaka

Annoksia 6. Nykytila CALCULATED; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 0.19916667 g/annos. Pelkän GI-poiston laskennallinen tila: CALCULATED; ei erillinen hyväksyntä.

- sipuli: aiempi massa 55 g; HH 0.44 g/annos; koostumus `fineli-335-2026-10-24`. Uusi laskentamassa 55. Edible piece mass for sipuli: 55 g/unit, Fineli portion where available or standard piece. AJO 1.5: checked against original recipe and Fineli Release 20 #335 (4.8 g available carbohydrate/100 g; KPL_M 55 g, KPL_S 30 g); starting edible onion mass, no cooking-loss deduction.

Valmistus alkuperäisestä reseptistä:

1. Kuumenna uuni 200 asteeseen. Sivele munakoiso- ja perunaviipaleet öljyllä ja paahda pellillä 20 minuuttia.
2. Ruskista jauheliha ja sipuli pannulla. Lisää tomaattimurska, kaneli, suola ja pippuri. Hauduta 15 minuuttia.
3. Sulata voi kattilassa. Sekoita joukkoon jauhot ja lisää maito vähitellen vispaten. Keitä, kunnes kastike sakenee. Ota liedeltä, jäähdytä hetki ja sekoita joukkoon kananmuna sekä puolet juustosta.
4. Lado vuokaan perunat, puolet munakoisoista, jauhelihakastike ja loput munakoisot. Kaada päälle béchamel ja ripottele loppu juusto.
5. Paista 190 asteessa noin 35 minuuttia, kunnes pinta on kullanruskea. Anna vetäytyä 15 minuuttia ennen leikkaamista.

Muut aiemmat poisjätöt: kanelia: 0.09166666666666667 g HH/annos; voita: 0.08 g HH/annos; kananmuna: 0.0275 g HH/annos.

Jäljellä olevat mallin estot:

- kreikkalainen-moussaka: kanelia: Ingredient mass is missing or invalid.

### doner-kebab

Annoksia 4. Nykytila CALCULATED; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 0.066 g/annos. Pelkän GI-poiston laskennallinen tila: CALCULATED; ei erillinen hyväksyntä.

- sipuli: aiempi massa 55 g; HH 0.66 g/annos; koostumus `fineli-335-2026-10-24`. Uusi laskentamassa 55. Edible piece mass for sipuli: 55 g/unit, Fineli portion where available or standard piece. AJO 1.5: checked against original recipe and Fineli Release 20 #335 (4.8 g available carbohydrate/100 g; KPL_M 55 g, KPL_S 30 g); starting edible onion mass, no cooking-loss deduction.
- valkosipulinkynttä: aiempi massa 6 g; HH 0.153 g/annos; koostumus `afcd-F004193-2026-10-24`. Uusi laskentamassa 7. Fineli Release 20 #393 KPL_M = 3.5 g edible garlic clove; original recipe clove count × 3.5 g. AFCD F004193 supplies raw ingredient available carbohydrate; total starting ingredient retained in the batch.

Valmistus alkuperäisestä reseptistä:

1. Kuumenna uuni 220 asteeseen. Sekoita jauheliha, jogurtti, raastettu sipuli, valkosipuli ja mausteet tasaiseksi massaksi.
2. Levitä liha ohueksi kerrokseksi leivinpaperille. Peitä toisella paperilla ja kauli tasaiseksi.
3. Paista 12–15 minuuttia, kunnes liha on kypsää. Ota uunista ja leikkaa tai revi ohuiksi lastuiksi.
4. Paista lihalastuja kuumalla pannulla pienissä erissä, jotta reunat ruskistuvat.
5. Tarjoa lämpimän pitaleivän ja kaalisalaatin kanssa.

Muut aiemmat poisjätöt: oreganoa: 0.066 g HH/annos.

Jäljellä olevat mallin estot:

- doner-kebab: juustokuminaa: Ingredient mass is missing or invalid.

### souvlaki

Annoksia 4. Nykytila CALCULATED; ehdotus CALCULATED. Aiempi muiden pienosuuksien summa 0.396 g/annos. Pelkän GI-poiston laskennallinen tila: CALCULATED; ei erillinen hyväksyntä.

- valkosipulinkynttä: aiempi massa 6 g; HH 0.153 g/annos; koostumus `afcd-F004193-2026-10-24`. Uusi laskentamassa 7. Fineli Release 20 #393 KPL_M = 3.5 g edible garlic clove; original recipe clove count × 3.5 g. AFCD F004193 supplies raw ingredient available carbohydrate; total starting ingredient retained in the batch.
- valkosipulinkynttä: aiempi massa 3 g; HH 0.0765 g/annos; koostumus `afcd-F004193-2026-10-24`. Uusi laskentamassa 3.5. Fineli Release 20 #393 KPL_M = 3.5 g edible garlic clove; original recipe clove count × 3.5 g. AFCD F004193 supplies raw ingredient available carbohydrate; total starting ingredient retained in the batch.

Valmistus alkuperäisestä reseptistä:

1. Sekoita öljy, sitruunamehu, murskattu valkosipuli, oregano ja suola. Lisää broileri ja anna maustua jääkaapissa vähintään 20 minuuttia.
2. Raasta kurkku ja purista ylimääräinen neste pois. Sekoita jogurttiin ja murskattuun valkosipuliin. Jäähdytä.
3. Pujota broileri vartaisiin. Grillaa tai paista kuumalla pannulla 10–12 minuuttia käännellen, kunnes kana on kypsää.
4. Lämmitä pitaleivät ja tarjoa vartaat tomaatin sekä tzatzikin kanssa.

Muut aiemmat poisjätöt: kuivattua oreganoa: 0.39599999999999996 g HH/annos.

Pienosuudet on määrän ja koostumuksen osalta varmennettu; yksittäiset osuudet <1 g ja summa <2 g. Muut aiemmin hyväksytyt GI-tietueet pysyvät ennallaan.

### gazpacho

Annoksia 4. Nykytila CALCULATED; ehdotus CALCULATED. Aiempi muiden pienosuuksien summa 0.0375 g/annos. Pelkän GI-poiston laskennallinen tila: CALCULATED; ei erillinen hyväksyntä.

- valkosipulinkynttä: aiempi massa 3 g; HH 0.0765 g/annos; koostumus `afcd-F004193-2026-10-24`. Uusi laskentamassa 3.5. Fineli Release 20 #393 KPL_M = 3.5 g edible garlic clove; original recipe clove count × 3.5 g. AFCD F004193 supplies raw ingredient available carbohydrate; total starting ingredient retained in the batch.

Valmistus alkuperäisestä reseptistä:

1. Laita tomaatit, kurkku, paprika, valkosipuli, etikka ja suola tehosekoittimeen. Lisää halutessasi leipä.
2. Soseuta tasaiseksi. Lisää öljy koneen käydessä ja jatka soseutusta, kunnes keitto on sileää.
3. Säädä koostumus kylmällä vedellä ja tarkista maku.
4. Peitä ja jäähdytä vähintään tunnin ajan. Tarjoa kylmänä pienillä kasviskuutioilla viimeisteltynä.

Muut aiemmat poisjätöt: sherryviinietikkaa tai punaviinietikkaa: 0.0375 g HH/annos.

Pienosuudet on määrän ja koostumuksen osalta varmennettu; yksittäiset osuudet <1 g ja summa <2 g. Muut aiemmin hyväksytyt GI-tietueet pysyvät ennallaan.

### spanakopita

Annoksia 6. Nykytila INSUFFICIENT SOURCE DATA; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 0.0775 g/annos. Pelkän GI-poiston laskennallinen tila: INSUFFICIENT SOURCE DATA; ei erillinen hyväksyntä.

- kevätsipulia: aiempi massa 60 g; HH 0.45999999999999996 g/annos; koostumus `afcd-F006250-2026-10-24`. Uusi laskentamassa None. AJO 1.5: Spring-onion 15 g/piece was an unsourced standard-piece assumption, not a verified mass. Original recipe piece count is retained in recipeQuantity; weighed edible mass is required.

Valmistus alkuperäisestä reseptistä:

1. Kuumenna uuni 190 asteeseen. Ryöppää pinaatti nopeasti tai paista pannulla kasaan. Jäähdytä ja purista neste huolellisesti pois.
2. Sekoita pinaatti, kevätsipuli, feta, kananmunat, tilli ja pippuri.
3. Öljyä uunivuoka. Aseta vuokaan neljä filotaikina-arkkia yksi kerrallaan, sivele jokainen kevyesti öljyllä.
4. Levitä täyte vuokaan. Peitä lopuilla filoarkeilla, voitele kerrokset öljyllä ja taita reunat sisään.
5. Viillä pintaan annospalat ja paista 35–40 minuuttia, kunnes pinta on rapea ja kullanruskea. Anna levätä 10 minuuttia.

Muut aiemmat poisjätöt: kananmunaa: 0.055 g HH/annos; tuoretta tilliä: 0.022500000000000003 g HH/annos; filotaikinaa: 14.88 g HH/annos.

Jäljellä olevat mallin estot:

- spanakopita: kevätsipulia: Ingredient mass is missing or invalid.
- spanakopita: filotaikinaa: GI value is unpublished, off-scale, or its food/preparation match lacks a rationale.

### tabbouleh

Annoksia 4. Nykytila INSUFFICIENT SOURCE DATA; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 0 g/annos. Pelkän GI-poiston laskennallinen tila: INSUFFICIENT SOURCE DATA; ei erillinen hyväksyntä.

- kevätsipulia: aiempi massa 30 g; HH 0.345 g/annos; koostumus `afcd-F006250-2026-10-24`. Uusi laskentamassa None. AJO 1.5: Spring-onion 15 g/piece was an unsourced standard-piece assumption, not a verified mass. Original recipe piece count is retained in recipeQuantity; weighed edible mass is required.

Valmistus alkuperäisestä reseptistä:

1. Huuhtele bulgur ja liota sitä lämpimässä vedessä 15 minuuttia. Valuta ja purista kuivaksi.
2. Hienonna persilja ja minttu veitsellä. Kuutioi tomaatit ja silppua kevätsipuli.
3. Sekoita kaikki ainekset kulhossa. Lisää sitruunamehu, oliiviöljy, suola ja pippuri.
4. Anna salaatin maustua jääkaapissa 10–15 minuuttia ja tarjoa.

Muut aiemmat poisjätöt: hienoa bulguria: 8.2625 g HH/annos; lehtipersiljaa: 0.165 g HH/annos; tuoretta minttua: 0.165 g HH/annos.

Jäljellä olevat mallin estot:

- tabbouleh: hienoa bulguria: GI value is unpublished, off-scale, or its food/preparation match lacks a rationale.
- tabbouleh: lehtipersiljaa: GI value is unpublished, off-scale, or its food/preparation match lacks a rationale.
- tabbouleh: kevätsipulia: Ingredient mass is missing or invalid.
- tabbouleh: tuoretta minttua: GI value is unpublished, off-scale, or its food/preparation match lacks a rationale.

### poronkaristys-kukkakaalimuusilla

Annoksia 4. Nykytila CALCULATED; ehdotus CALCULATED. Aiempi muiden pienosuuksien summa 0.056 g/annos. Pelkän GI-poiston laskennallinen tila: CALCULATED; ei erillinen hyväksyntä.

- sipuli: aiempi massa 55 g; HH 0.66 g/annos; koostumus `fineli-335-2026-10-24`. Uusi laskentamassa 55. Edible piece mass for sipuli: 55 g/unit, Fineli portion where available or standard piece. AJO 1.5: checked against original recipe and Fineli Release 20 #335 (4.8 g available carbohydrate/100 g; KPL_M 55 g, KPL_S 30 g); starting edible onion mass, no cooking-loss deduction.

Valmistus alkuperäisestä reseptistä:

1. Ruskista poronkäristys ja sipuli voissa pannulla erissä.
2. Lisää vesi ja hauduta kannen alla noin 25 minuuttia. Mausta.
3. Keitä kukkakaali pehmeäksi, valuta huolellisesti ja soseuta kerman kanssa.
4. Tarjoa käristys kukkakaalimuusin kanssa.

Muut aiemmat poisjätöt: voita: 0.05600000000000001 g HH/annos.

Pienosuudet on määrän ja koostumuksen osalta varmennettu; yksittäiset osuudet <1 g ja summa <2 g. Muut aiemmin hyväksytyt GI-tietueet pysyvät ennallaan.

### liha-juureskeitto-perunaton

Annoksia 4. Nykytila INSUFFICIENT SOURCE DATA; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 0.2 g/annos. Pelkän GI-poiston laskennallinen tila: INSUFFICIENT SOURCE DATA; ei erillinen hyväksyntä.

- sipuli: aiempi massa 55 g; HH 0.66 g/annos; koostumus `fineli-335-2026-10-24`. Uusi laskentamassa 55. Edible piece mass for sipuli: 55 g/unit, Fineli portion where available or standard piece. AJO 1.5: checked against original recipe and Fineli Release 20 #335 (4.8 g available carbohydrate/100 g; KPL_M 55 g, KPL_S 30 g); starting edible onion mass, no cooking-loss deduction.

Valmistus alkuperäisestä reseptistä:

1. Laita liha kylmään veteen kattilaan. Kuumenna kiehuvaksi ja kuori pinnalle muodostuva vaahto.
2. Lisää sipuli, laakerinlehdet ja kokonaiset pippurit. Hauduta kannen alla hiljaa noin 1,5 tuntia, kunnes liha on mureaa.
3. Nosta liha leikkuulaudalle ja siivilöi liemi. Paloittele liha.
4. Kuori ja kuutioi lanttu, porkkana ja selleri. Keitä ne siivilöidyssä liemessä 12–15 minuuttia.
5. Lisää liha takaisin, kuumenna ja mausta suolalla. Viimeistele persiljalla.

Muut aiemmat poisjätöt: lanttua: 1.85 g HH/annos; laakerinlehteä: 0.1 g HH/annos; kokonaista mustapippuria: 0.1 g HH/annos; silputtua persiljaa: 0.022000000000000002 g HH/annos.

Jäljellä olevat mallin estot:

- liha-juureskeitto-perunaton: lanttua: GI value is unpublished, off-scale, or its food/preparation match lacks a rationale.
- liha-juureskeitto-perunaton: laakerinlehteä: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- liha-juureskeitto-perunaton: kokonaista mustapippuria: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- liha-juureskeitto-perunaton: silputtua persiljaa: GI value is unpublished, off-scale, or its food/preparation match lacks a rationale.

### chettinad-kana

Annoksia 4. Nykytila CALCULATED; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 1.17125 g/annos. Pelkän GI-poiston laskennallinen tila: CALCULATED; ei erillinen hyväksyntä.

- sipuli: aiempi massa 55 g; HH 0.66 g/annos; koostumus `fineli-335-2026-10-24`. Uusi laskentamassa 55. Edible piece mass for sipuli: 55 g/unit, Fineli portion where available or standard piece. AJO 1.5: checked against original recipe and Fineli Release 20 #335 (4.8 g available carbohydrate/100 g; KPL_M 55 g, KPL_S 30 g); starting edible onion mass, no cooking-loss deduction.
- valkosipulinkynttä: aiempi massa 6 g; HH 0.153 g/annos; koostumus `afcd-F004193-2026-10-24`. Uusi laskentamassa 7. Fineli Release 20 #393 KPL_M = 3.5 g edible garlic clove; original recipe clove count × 3.5 g. AFCD F004193 supplies raw ingredient available carbohydrate; total starting ingredient retained in the batch.

Valmistus alkuperäisestä reseptistä:

1. Paahda kuivalla pannulla pippurit, korianterin- ja fenkolinsiemenet sekä kaneli, kunnes ne tuoksuvat. Jäähdytä ja jauha.
2. Kuumenna öljy kattilassa. Kuullota sipuli. Lisää hienonnettu valkosipuli ja inkivääri.
3. Lisää broileri ja ruskista kevyesti joka puolelta.
4. Sekoita joukkoon mausteseos ja currylehdet. Lisää tomaatit ja suola.
5. Kaada vesi, peitä ja hauduta 25–30 minuuttia, kunnes kana on kypsää ja kastike sakeaa.
6. Tarjoa basmatiriisin tai leivän kanssa.

Muut aiemmat poisjätöt: tuoretta inkivääriä: 0.18 g HH/annos; mustapippureita: 0.193 g HH/annos; korianterinsiemeniä: 0.042 g HH/annos; fenkolinsiemeniä: 0.2 g HH/annos; kanelitanko: 0.20625 g HH/annos; tuoreita currylehtiä: 0.35 g HH/annos.

Jäljellä olevat mallin estot:

- chettinad-kana: fenkolinsiemeniä: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- chettinad-kana: tuoreita currylehtiä: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.

### kermainen-kanasienipannu

Annoksia 4. Nykytila CALCULATED; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 0.31925 g/annos. Pelkän GI-poiston laskennallinen tila: CALCULATED; ei erillinen hyväksyntä.

- salottisipuli: aiempi massa 55 g; HH 0.66 g/annos; koostumus `fineli-335-2026-10-24`. Uusi laskentamassa None. AJO 1.5: Shallot mass and yellow-onion composition proxy were not verified for the recipe. Unknown amount/composition cannot qualify as a small omission.

Valmistus alkuperäisestä reseptistä:

1. Viipaloi sienet ja hienonna salottisipuli. Leikkaa broileri suupaloiksi.
2. Ruskista broileri voissa kuumalla pannulla kahdessa erässä. Siirrä lautaselle.
3. Paista sienet pannulla kullanruskeiksi, lisää sipuli ja kypsennä pehmeäksi.
4. Kaada pannulle kanaliemi, kerma ja sinappi. Kiehauta, lisää broileri takaisin ja hauduta 8–10 minuuttia kypsäksi.
5. Mausta timjamilla, suolalla ja pippurilla.

Muut aiemmat poisjätöt: kanalientä: 0.15 g HH/annos; voita: 0.028000000000000004 g HH/annos; silputtua timjamia: 0.04125 g HH/annos; suolaa ja mustapippuria: 0.1 g HH/annos.

Jäljellä olevat mallin estot:

- kermainen-kanasienipannu: salottisipuli: Ingredient mass is missing or invalid.
- kermainen-kanasienipannu: suolaa ja mustapippuria: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.

### kana-parmesaanipannu-parsakaali

Annoksia 4. Nykytila CALCULATED; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 0.278 g/annos. Pelkän GI-poiston laskennallinen tila: CALCULATED; ei erillinen hyväksyntä.

- valkosipulimurskaa: aiempi massa 2 g; HH 0.051 g/annos; koostumus `afcd-F004193-2026-10-24`. Uusi laskentamassa None. AJO 1.5: Garlic-paste teaspoon mass and product form are not source-verified; no small-portion approval.

Valmistus alkuperäisestä reseptistä:

1. Leikkaa broileri suupaloiksi ja jaa parsakaali pieniksi kukinnoiksi.
2. Ruskista broileri voissa pannulla. Lisää valkosipuli ja paista 30 sekuntia.
3. Kaada pannulle kanaliemi ja kerma. Lisää parsakaali ja hauduta kannen alla 8–10 minuuttia.
4. Sekoita parmesaani joukkoon ja kuumenna, kunnes juusto sulaa ja broileri on kypsää.
5. Mausta suolalla ja pippurilla.

Muut aiemmat poisjätöt: kanalientä: 0.15 g HH/annos; voita: 0.028000000000000004 g HH/annos; suolaa ja mustapippuria: 0.1 g HH/annos.

Jäljellä olevat mallin estot:

- kana-parmesaanipannu-parsakaali: valkosipulimurskaa: Ingredient mass is missing or invalid.
- kana-parmesaanipannu-parsakaali: suolaa ja mustapippuria: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.

### vhh-lihapiirakka

Annoksia 8. Nykytila CALCULATED; ehdotus CALCULATED. Aiempi muiden pienosuuksien summa 0.04125 g/annos. Pelkän GI-poiston laskennallinen tila: CALCULATED; ei erillinen hyväksyntä.

- sipuli: aiempi massa 55 g; HH 0.33 g/annos; koostumus `fineli-335-2026-10-24`. Uusi laskentamassa 55. Per-unit mass estimate for sipuli; edible-state basis documented. AJO 1.5: checked against original recipe and Fineli Release 20 #335 (4.8 g available carbohydrate/100 g; KPL_M 55 g, KPL_S 30 g); starting edible onion mass, no cooking-loss deduction.

Valmistus alkuperäisestä reseptistä:

1. Kuumenna uuni 200 °C:seen. Sulata juusto ja tuorejuusto varovasti ja sekoita mantelijauho sekä yksi kananmuna joukkoon.
2. Painele taikina leivinpaperilla vuoratun piirakkavuoan pohjalle ja reunoille.
3. Ruskista jauheliha ja sipuli ja mausta.
4. Sekoita toinen kananmuna täytteeseen, kaada vuokaan ja paista noin 30 minuuttia.

Muut aiemmat poisjätöt: kananmunaa: 0.04125 g HH/annos.

Pienosuudet on määrän ja koostumuksen osalta varmennettu; yksittäiset osuudet <1 g ja summa <2 g. Muut aiemmin hyväksytyt GI-tietueet pysyvät ennallaan.

### valimerellinen-tortilla-espanola-aamupalaksi

Annoksia 2. Nykytila INSUFFICIENT SOURCE DATA; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 0.365 g/annos. Pelkän GI-poiston laskennallinen tila: INSUFFICIENT SOURCE DATA; ei erillinen hyväksyntä.

- sipulia: aiempi massa 55 g; HH 1.32 g/annos; koostumus `fineli-335-2026-10-24`. Uusi laskentamassa 55. 1 medium onion × Fineli #335 55 g AJO 1.5: checked against original recipe and Fineli Release 20 #335 (4.8 g available carbohydrate/100 g; KPL_M 55 g, KPL_S 30 g); starting edible onion mass, no cooking-loss deduction.

Valmistus alkuperäisestä reseptistä:

1. Pilko täytteen kasvikset ja muut suuret ainekset pieniksi paloiksi. Kuullota ne pannulla tilkassa öljyä, kunnes ne ovat pehmenneet.
2. Vatkaa kananmunat ja mausta ripauksella suolaa. Kaada munaseos pannulle ja laske lämpö miedoksi.
3. Vedä hyytynyttä munaa reunoilta kohti keskustaa. Taita tai rullaa, kun pinta on juuri hyytynyt.
4. Kypsennä peruna-sipuli pehmeäksi öljyssä ja hyydytä munien kanssa paksuksi tortillaksi.

Muut aiemmat poisjätöt: kananmunaa: 0.165 g HH/annos; sipulia: 1.32 g HH/annos; suolaa maun mukaan: 0.2 g HH/annos.

Jäljellä olevat mallin estot:

- valimerellinen-tortilla-espanola-aamupalaksi: sipulia: AJO 1.5: onion GI 15 withdrawn; DOI 10.3390/nu12102989 Table 1 and DOI 10.3945/an.112.003509 Table 3 do not establish a preparation-matched primary human GI. Missing GI is not zero.
- valimerellinen-tortilla-espanola-aamupalaksi: suolaa maun mukaan: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.

### jauhelihapihvit-vhh-kermakastikkeella

Annoksia 4. Nykytila INSUFFICIENT SOURCE DATA; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 0.43705 g/annos. Pelkän GI-poiston laskennallinen tila: INSUFFICIENT SOURCE DATA; ei erillinen hyväksyntä.

- sipulia: aiempi massa 30 g; HH 0.36 g/annos; koostumus `fineli-335-2026-10-25`. Uusi laskentamassa 30. 1 small onion × Fineli #335 KPL_S 30 g AJO 1.5: checked against original recipe and Fineli Release 20 #335 (4.8 g available carbohydrate/100 g; KPL_M 55 g, KPL_S 30 g); starting edible onion mass, no cooking-loss deduction.

Valmistus alkuperäisestä reseptistä:

1. Sekoita kulhossa jauheliha, kananmuna, kerma, raastettu sipuli, suola ja mustapippuri. Muotoile neljä pihviä.
2. Kuumenna voi pannulla ja paista pihvit keskilämmöllä kypsiksi, noin 4–5 minuuttia kummaltakin puolelta. Siirrä pihvit sivuun.
3. Kaada pannulle lihaliemi ja raaputa paistopinta mukaan kastikkeeseen. Lisää kerma, sinappi ja pippuri.
4. Keitä kastiketta hiljalleen 5–8 minuuttia, kunnes se hieman sakenee. Palauta pihvit pannulle ja kuumenna vielä pari minuuttia.
5. Tarjoa kukkakaalimuusin tai vihreiden kasvisten kanssa.

Muut aiemmat poisjätöt: kananmunaa: 0.04125 g HH/annos; mustapippuria: 0.095775 g HH/annos; voita: 0.028000000000000004 g HH/annos; lihalientä: 0.75 g HH/annos; Dijon-sinappia: 0.17625 g HH/annos; mustapippuria: 0.095775 g HH/annos.

Jäljellä olevat mallin estot:

- jauhelihapihvit-vhh-kermakastikkeella: lihalientä: GI value is unpublished, off-scale, or its food/preparation match lacks a rationale.

### parsakaali-sinihomejuustofrittata

Annoksia 4. Nykytila CALCULATED; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 0.3745 g/annos. Pelkän GI-poiston laskennallinen tila: CALCULATED; ei erillinen hyväksyntä.

- sipulia: aiempi massa 27.5 g; HH 0.33 g/annos; koostumus `fineli-335-2026-10-25`. Uusi laskentamassa 27.5. 0.5 medium onion × Fineli #335 KPL_M 55 g AJO 1.5: checked against original recipe and Fineli Release 20 #335 (4.8 g available carbohydrate/100 g; KPL_M 55 g, KPL_S 30 g); starting edible onion mass, no cooking-loss deduction.

Valmistus alkuperäisestä reseptistä:

1. Kuumenna uuni 200 asteeseen. Voitele noin 20 × 25 cm:n uunivuoka tai käytä uuninkestävää paistinpannua.
2. Sulata voi pannulla. Kuullota sipulia hetki ja lisää parsakaalin nuput. Paista sekoitellen noin 3 minuuttia, kunnes parsakaali saa hieman väriä.
3. Siirrä kasvikset vuokaan. Vatkaa munien rakenne kevyesti rikki ja sekoita joukkoon kuohukerma, murennettu juusto ja mustapippuri. Lisää suolaa harkiten, sillä juusto on suolaista.
4. Kaada munaseos parsakaalien päälle. Paista noin 20–25 minuuttia, kunnes keskusta on hyytynyt ja pinta kullanruskea.
5. Anna frittatan asettua muutama minuutti ennen leikkaamista. Tarjoa sellaisenaan tai vihersalaatin kanssa.

Muut aiemmat poisjätöt: voita: 0.027000000000000003 g HH/annos; kananmunia: 0.2475 g HH/annos; mustapippuria ja suolaa: 0.1 g HH/annos.

Jäljellä olevat mallin estot:

- parsakaali-sinihomejuustofrittata: mustapippuria ja suolaa: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.

### uuniporsas-kermakastikkeessa-vhh

Annoksia 6. Nykytila CALCULATED; ehdotus CALCULATED. Aiempi muiden pienosuuksien summa 1.1846667 g/annos. Pelkän GI-poiston laskennallinen tila: CALCULATED; ei erillinen hyväksyntä.

- sipuli: aiempi massa 55 g; HH 0.44 g/annos; koostumus `fineli-335-2026-10-25`. Uusi laskentamassa 55. 1 medium onion × Fineli #335 KPL_M 55 g AJO 1.5: checked against original recipe and Fineli Release 20 #335 (4.8 g available carbohydrate/100 g; KPL_M 55 g, KPL_S 30 g); starting edible onion mass, no cooking-loss deduction.

Valmistus alkuperäisestä reseptistä:

1. Mausta porsas suolalla, pippurilla ja timjamilla. Nosta uunivuokaan sipulilohkojen kanssa.
2. Lisää vesi vuokaan ja paista 175 °C:ssa noin 75 minuuttia tai kunnes liha on kypsää.
3. Nosta liha lepäämään. Siivilöi paistoliemi kattilaan ja lisää kerma.
4. Keitä kastiketta muutama minuutti ja tarkista maku. Nosta kastike liedeltä ja sekoita voi lämpimään kastikkeeseen. Viipaloi porsas ja tarjoa kastikkeen kanssa.

Muut aiemmat poisjätöt: kuohukermaa: 0.9666666666666667 g HH/annos; mustapippuria: 0.1 g HH/annos; timjamia: 0.1 g HH/annos; voita: 0.018000000000000002 g HH/annos.

Pienosuudet on määrän ja koostumuksen osalta varmennettu; yksittäiset osuudet <1 g ja summa <2 g. Muut aiemmin hyväksytyt GI-tietueet pysyvät ennallaan.

### hyderabadi-kanabiryani

Annoksia 4. Nykytila CALCULATED; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 1.07925 g/annos. Pelkän GI-poiston laskennallinen tila: INSUFFICIENT SOURCE DATA; ei erillinen hyväksyntä.

- sipulia: aiempi massa 110 g; HH 1.32 g/annos; koostumus `fineli-335-2026-10-25`. Uusi laskentamassa 110. 2 medium onions × Fineli #335 KPL_M 55 g AJO 1.5: checked against original recipe and Fineli Release 20 #335 (4.8 g available carbohydrate/100 g; KPL_M 55 g, KPL_S 30 g); starting edible onion mass, no cooking-loss deduction.

Valmistus alkuperäisestä reseptistä:

1. Huuhtele riisi ja liota kylmässä vedessä 20 minuuttia. Valuta.
2. Sekoita broileri jogurtin, garam masalan, juustokuminan, korianterin, kurkuman ja suolan kanssa. Anna maustua 20 minuuttia.
3. Ruskista sipulit öljyssä kullanruskeiksi. Nosta puolet sivuun. Lisää kattilaan koko kanelitanko ja kaikki kardemummakodat.
4. Lisää broileri ja ruskista pinta. Peitä ja kypsennä miedolla lämmöllä 15 minuuttia.
5. Keitä riisiä suolatussa vedessä 5–6 minuuttia, kunnes se on puolikypsää. Valuta.
6. Levitä riisi broilerin päälle. Lisää sahramimaito, ghee, paistettu sipuli, minttu ja korianteri.
7. Sulje kansi tiiviisti ja kypsennä hyvin miedolla lämmöllä 20–25 minuuttia. Anna vetäytyä 10 minuuttia ja kuohkeuta varovasti.

Muut aiemmat poisjätöt: gheetä tai voita: 0.054000000000000006 g HH/annos; garam masalaa: 0.2 g HH/annos; jauhettua juustokuminaa: 0.1 g HH/annos; jauhettua korianteria: 0.1 g HH/annos; kurkumaa: 0.1 g HH/annos; kanelitanko: 0.1 g HH/annos; kardemummakotaa: 0.1 g HH/annos; sahramia: 0.1 g HH/annos; tuoretta korianteria: 0.02525 g HH/annos; tuoretta minttua: 0.2 g HH/annos.

Jäljellä olevat mallin estot:

- hyderabadi-kanabiryani: sipulia: AJO 1.5: onion GI 15 withdrawn; DOI 10.3390/nu12102989 Table 1 and DOI 10.3945/an.112.003509 Table 3 do not establish a preparation-matched primary human GI. Missing GI is not zero.
- hyderabadi-kanabiryani: garam masalaa: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- hyderabadi-kanabiryani: jauhettua juustokuminaa: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- hyderabadi-kanabiryani: jauhettua korianteria: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- hyderabadi-kanabiryani: kurkumaa: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- hyderabadi-kanabiryani: kanelitanko: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- hyderabadi-kanabiryani: kardemummakotaa: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- hyderabadi-kanabiryani: sahramia: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- hyderabadi-kanabiryani: tuoretta minttua: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.

### bun-cha-hanoi

Annoksia 4. Nykytila CALCULATED; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 1.5718 g/annos. Pelkän GI-poiston laskennallinen tila: INSUFFICIENT SOURCE DATA; ei erillinen hyväksyntä.

- salottisipulia: aiempi massa 60 g; HH 0.72 g/annos; koostumus `fineli-335-2026-10-25`. Uusi laskentamassa None. AJO 1.5: Shallot mass and yellow-onion composition proxy were not verified for the recipe. Unknown amount/composition cannot qualify as a small omission.

Valmistus alkuperäisestä reseptistä:

1. Sekoita jauhelihaan puolet kalakastikkeesta, puolet fariinisokerista, puolet valkosipulista ja salottisipulista sekä pippuri. Muotoile pieniksi litteiksi pihveiksi.
2. Sekoita vatsaviipaleisiin loput marinadin aineksista. Anna lihojen maustua jääkaapissa vähintään 30 minuuttia.
3. Sekoita dippiliemen kalakastike, riisiviinietikka, sokeri ja lämmin vesi. Lisää porkkana.
4. Kypsennä riisivermisellit pakkauksen ohjeen mukaan ja huuhtele kylmällä vedellä.
5. Grillaa tai paista pihvit ja vatsaviipaleet erissä, kunnes ne ovat läpikypsiä ja saaneet hieman paistopintaa.
6. Tarjoa liha dippiliemessä tai sen vieressä. Nosta pöytään nuudelit ja korianteri erikseen.

Muut aiemmat poisjätöt: kalakastiketta: 0.9 g HH/annos; valkosipulinkynttä: 0.28525 g HH/annos; mustapippuria: 0.19155 g HH/annos; riisiviinietikkaa: 0.1 g HH/annos; tuoretta korianteria: 0.095 g HH/annos.

Jäljellä olevat mallin estot:

- bun-cha-hanoi: kalakastiketta: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- bun-cha-hanoi: salottisipulia: Ingredient mass is missing or invalid.
- bun-cha-hanoi: riisiviinietikkaa: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.

### hapanimela-porsas

Annoksia 4. Nykytila INSUFFICIENT SOURCE DATA; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 0.56875 g/annos. Pelkän GI-poiston laskennallinen tila: INSUFFICIENT SOURCE DATA; ei erillinen hyväksyntä.

- sipuli: aiempi massa 55 g; HH 0.66 g/annos; koostumus `fineli-335-2026-10-25`. Uusi laskentamassa 55. 1 medium onion × Fineli #335 KPL_M 55 g AJO 1.5: checked against original recipe and Fineli Release 20 #335 (4.8 g available carbohydrate/100 g; KPL_M 55 g, KPL_S 30 g); starting edible onion mass, no cooking-loss deduction.

Valmistus alkuperäisestä reseptistä:

1. Sekoita porsaskuutiot kananmunaan, maissitärkkelykseen ja suolaan.
2. Kuumenna öljy pannulla ja paista porsas erissä kullanruskeaksi ja kypsäksi. Nosta sivuun.
3. Paista paprikaa ja sipulia 3–4 minuuttia. Lisää ananas.
4. Sekoita ketsuppi, etikka, sokeri, soijakastike ja vesi. Kaada pannulle ja kiehauta.
5. Palauta porsas pannulle ja kääntele kastikkeessa. Tarjoa riisin kanssa.

Muut aiemmat poisjätöt: kananmuna: 0.04125 g HH/annos; ananasta: 4.2 g HH/annos; riisiviinietikkaa: 0.1 g HH/annos; soijakastiketta: 0.4275 g HH/annos.

Jäljellä olevat mallin estot:

- hapanimela-porsas: ananasta: GI value is unpublished, off-scale, or its food/preparation match lacks a rationale.
- hapanimela-porsas: ketsuppia: 2 tbsp ketchup lacks specified brand/label; added sugars are material.
- hapanimela-porsas: riisiviinietikkaa: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- hapanimela-porsas: keitettyä riisiä: Four cooked-rice portions have no gram weight or defined serving mass; this major carbohydrate side cannot be totaled.

### idli-sambar

Annoksia 4. Nykytila INSUFFICIENT SOURCE DATA; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 0.4 g/annos. Pelkän GI-poiston laskennallinen tila: INSUFFICIENT SOURCE DATA; ei erillinen hyväksyntä.

- sipuli: aiempi massa 55 g; HH 0.66 g/annos; koostumus `fineli-335-2026-10-25`. Uusi laskentamassa 55. 1 medium onion × Fineli #335 KPL_M 55 g AJO 1.5: checked against original recipe and Fineli Release 20 #335 (4.8 g available carbohydrate/100 g; KPL_M 55 g, KPL_S 30 g); starting edible onion mass, no cooking-loss deduction.

Valmistus alkuperäisestä reseptistä:

1. Huuhtele riisi ja urad-dal erikseen. Liota niitä väljässä vedessä 4 tuntia ja valuta. Punaiset linssit käytetään sambar-keittoon vaiheessa 3.
2. Jauha urad-dal sileäksi ja kuohkeaksi sekä riisi hienorakeiseksi, lisäten vettä vähän kerrallaan vain jauhamisen tarvitseman määrän. Yhdistä paksuksi, lusikoitavaksi mutta kaadettavaksi taikinaksi; se ei saa olla vetistä. Peitä ja fermentoi lämpimässä 8–12 tuntia. Lisää suola.
3. Huuhtele punaiset linssit ja peitä vedellä kattilassa. Keitä pehmeiksi noin 20 minuutissa; lisää vettä tarvittaessa, jotta linssit pysyvät veden peitossa. Lisää porkkana, tomaatti, sipuli ja ainesluettelon 5 dl vettä.
4. Sekoita tamarindi ja sambar-mausteet keittoon. Hauduta, kunnes kasvikset ovat pehmeitä.
5. Kuumenna öljy pienessä pannussa. Lisää sinapinsiemenet ja currylehdet. Kaada mausteöljy sambar-keittoon.
6. Annostele idlitaikina voideltuihin idlimuotteihin tai silikonimuffinivuoan syvennyksiin. Höyrytä 10–12 minuuttia; kypsään idliin työnnetty tikku tulee ulos ilman raakaa taikinaa.
7. Anna idlien levätä hetki, irrota vuoasta ja tarjoa lämpimän sambar-keiton kanssa.

Muut aiemmat poisjätöt: tamarinditahnaa: 2.1525 g HH/annos; sinapinsiemeniä: 0.2 g HH/annos; tuoreita currylehtiä: 0.2 g HH/annos.

Jäljellä olevat mallin estot:

- idli-sambar: urad-dal-linssejä: Urad dal/black gram has no matching source record in Fineli Rel20 or AFCD Release 3.
- idli-sambar: tamarinditahnaa: GI value is unpublished, off-scale, or its food/preparation match lacks a rationale.
- idli-sambar: sambar-mausteseosta: 1 tbsp commercial spice blend has no brand/ingredient list; flour/lentil/sugar fillers are unquantified.
- idli-sambar: sinapinsiemeniä: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- idli-sambar: tuoreita currylehtiä: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- idli-sambar: vettä: Unquantified water is carbohydrate-free, but dry/wet ingredient process state for the batter needs review; no mass entered.

### intialainen-rava-uttapam

Annoksia 2. Nykytila CALCULATED; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 0 g/annos. Pelkän GI-poiston laskennallinen tila: INSUFFICIENT SOURCE DATA; ei erillinen hyväksyntä.

- sipuli: aiempi massa 55 g; HH 1.32 g/annos; koostumus `fineli-335-2026-10-25`. Uusi laskentamassa 55. 1 medium onion × Fineli #335 KPL_M 55 g AJO 1.5: checked against original recipe and Fineli Release 20 #335 (4.8 g available carbohydrate/100 g; KPL_M 55 g, KPL_S 30 g); starting edible onion mass, no cooking-loss deduction.

Valmistus alkuperäisestä reseptistä:

1. Sekoita jauhot tai viljat ja muut kuivat ainekset kulhossa. Lisää neste vähitellen ja vatkaa tasaiseksi taikinaksi.
2. Anna taikinan levätä 10 minuuttia. Jos käytät kokonaisia palkokasveja tai viljoja taikinapohjana, niiden tulee olla liotettuja ja hienonnettuja.
3. Kuumenna öljytty pannu keskilämmölle. Paista taikina ohuina annoksina; käännä, kun reunat kuivuvat ja pinta alkaa asettua.
4. Lisää taikinan pinnalle sipulia, tomaattia ja korianteria ennen kääntämistä.

Muut aiemmat poisjätöt: ei positiivisia poisjättöjä.

Jäljellä olevat mallin estot:

- intialainen-rava-uttapam: sipuli: AJO 1.5: onion GI 15 withdrawn; DOI 10.3390/nu12102989 Table 1 and DOI 10.3945/an.112.003509 Table 3 do not establish a preparation-matched primary human GI. Missing GI is not zero.

### indonesialainen-nasi-goreng-aamiaisriisi

Annoksia 2. Nykytila INSUFFICIENT SOURCE DATA; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 0.165 g/annos. Pelkän GI-poiston laskennallinen tila: INSUFFICIENT SOURCE DATA; ei erillinen hyväksyntä.

- salottisipuli: aiempi massa 30 g; HH 0.72 g/annos; koostumus `fineli-335-2026-10-25`. Uusi laskentamassa None. AJO 1.5: Shallot mass and yellow-onion composition proxy were not verified for the recipe. Unknown amount/composition cannot qualify as a small omission.

Valmistus alkuperäisestä reseptistä:

1. Raasta, muussaa tai hienonna pääraaka-aine. Sekoita joukkoon taikinan ainekset ja lisää vettä vain sen verran, että seos pysyy koossa.
2. Kuumenna pannulla ohut kerros öljyä. Muotoile pieniksi pihveiksi tai lusikoi taikina pannulle.
3. Paista keskilämmöllä molemmin puolin kypsäksi ja rapeapintaiseksi. Paista erissä, jotta pannu ei jäähdy.
4. Paista riisi valkosipulin ja kecap manisin kanssa, tarjoa paistetun munan päällä.

Muut aiemmat poisjätöt: kananmuna: 0.165 g HH/annos.

Jäljellä olevat mallin estot:

- indonesialainen-nasi-goreng-aamiaisriisi: kecap manis: 150 g sweet soy sauce is a major carbohydrate source, but the product has no brand, label or matching composition record.
- indonesialainen-nasi-goreng-aamiaisriisi: salottisipuli: Ingredient mass is missing or invalid.

### intialainen-besan-chilla

Annoksia 2. Nykytila CALCULATED; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 0.25 g/annos. Pelkän GI-poiston laskennallinen tila: INSUFFICIENT SOURCE DATA; ei erillinen hyväksyntä.

- sipuli: aiempi massa 55 g; HH 1.32 g/annos; koostumus `fineli-335-release-20`. Uusi laskentamassa 55. Recipe-listed 55 g, mapped to SIPULI, KELTASIPULI (raw yellow onion). AJO 1.5: checked against original recipe and Fineli Release 20 #335 (4.8 g available carbohydrate/100 g; KPL_M 55 g, KPL_S 30 g); starting edible onion mass, no cooking-loss deduction.

Valmistus alkuperäisestä reseptistä:

1. Sekoita jauhot tai viljat ja muut kuivat ainekset kulhossa. Lisää neste vähitellen ja vatkaa tasaiseksi taikinaksi.
2. Anna taikinan levätä 10 minuuttia. Jos käytät kokonaisia palkokasveja tai viljoja taikinapohjana, niiden tulee olla liotettuja ja hienonnettuja.
3. Kuumenna öljytty pannu keskilämmölle. Paista taikina ohuina annoksina; käännä, kun reunat kuivuvat ja pinta alkaa asettua.
4. Tarjoa lämpimänä tomaatti-chutneyn ja tuoreen korianterin kanssa.

Muut aiemmat poisjätöt: korianteri: 0.25 g HH/annos.

Jäljellä olevat mallin estot:

- intialainen-besan-chilla: sipuli: AJO 1.5: onion GI 15 withdrawn; DOI 10.3390/nu12102989 Table 1 and DOI 10.3945/an.112.003509 Table 3 do not establish a preparation-matched primary human GI. Missing GI is not zero.
- intialainen-besan-chilla: korianteri: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.

### dal-makhani

Annoksia 4. Nykytila INSUFFICIENT SOURCE DATA; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 1.57025 g/annos. Pelkän GI-poiston laskennallinen tila: INSUFFICIENT SOURCE DATA; ei erillinen hyväksyntä.

- sipuli: aiempi massa 55 g; HH 0.66 g/annos; koostumus `fineli-335-release-20`. Uusi laskentamassa 55. Recipe-listed 55 g, mapped to SIPULI, KELTASIPULI (raw yellow onion). AJO 1.5: checked against original recipe and Fineli Release 20 #335 (4.8 g available carbohydrate/100 g; KPL_M 55 g, KPL_S 30 g); starting edible onion mass, no cooking-loss deduction.

Valmistus alkuperäisestä reseptistä:

1. Huuhtele liotetut linssit ja pavut. Keitä ne vedessä pehmeiksi, noin 60–75 minuuttia. Lisää vettä tarvittaessa.
2. Sulata voi kattilassa. Kuullota sipuli pehmeäksi. Lisää valkosipuli ja inkivääri.
3. Sekoita joukkoon tomaattimurska, juustokumina ja suola. Hauduta 10 minuuttia.
4. Lisää kypsät linssit ja pavut sekä muutama desilitra keitinlientä. Murskaa osa linsseistä lusikalla.
5. Hauduta hyvin miedolla lämmöllä vähintään 45 minuuttia välillä sekoittaen.
6. Lisää garam masala ja kerma. Kuumenna vielä 5 minuuttia ja viimeistele korianterilla.

Muut aiemmat poisjätöt: voita: 0.06 g HH/annos; valkosipulinkynttä: 0.28525 g HH/annos; tuoretta inkivääriä: 0.125 g HH/annos; jauhettua juustokuminaa: 0.125 g HH/annos; garam masalaa: 0.125 g HH/annos; kuohukermaa: 0.725 g HH/annos; tuoretta korianteria: 0.125 g HH/annos.

Jäljellä olevat mallin estot:

- dal-makhani: mustia urad-dal-linssejä: No source-matched composition and preparation was resolved for “mustia urad-dal-linssejä”; it is not treated as zero.
- dal-makhani: tuoretta inkivääriä: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- dal-makhani: jauhettua juustokuminaa: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- dal-makhani: garam masalaa: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- dal-makhani: tuoretta korianteria: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.

### bouillabaisse

Annoksia 4. Nykytila INSUFFICIENT SOURCE DATA; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 0.53525 g/annos. Pelkän GI-poiston laskennallinen tila: INSUFFICIENT SOURCE DATA; ei erillinen hyväksyntä.

- sipuli: aiempi massa 55 g; HH 0.66 g/annos; koostumus `fineli-335-release-20`. Uusi laskentamassa 55. Recipe-listed 55 g, mapped to SIPULI, KELTASIPULI (raw yellow onion). AJO 1.5: checked against original recipe and Fineli Release 20 #335 (4.8 g available carbohydrate/100 g; KPL_M 55 g, KPL_S 30 g); starting edible onion mass, no cooking-loss deduction.

Valmistus alkuperäisestä reseptistä:

1. Kuullota sipuli ja fenkoli oliiviöljyssä kattilassa noin 8 minuuttia. Lisää valkosipuli ja timjami.
2. Lisää tomaattimurska, kalaliemi ja sahrami. Kiehauta.
3. Lisää perunat ja kypsennä noin 15 minuuttia, kunnes ne ovat lähes pehmeitä.
4. Lisää kalapalat ja simpukat. Peitä ja kypsennä 5 minuuttia. Lisää katkaravut ja jatka kypsentämistä, kunnes kala on läpikypsää ja simpukat ovat avautuneet. Hävitä avautumattomat simpukat.
5. Tarjoa keitto paahdetun leivän kanssa.

Muut aiemmat poisjätöt: sinisimpukoita: 2.9375 g HH/annos; fenkolia: 0.9 g HH/annos; valkosipulinkynttä: 0.28525 g HH/annos; sahramia: 0.125 g HH/annos; kuivattua timjamia: 0.125 g HH/annos.

Jäljellä olevat mallin estot:

- bouillabaisse: sinisimpukoita: GI evidence is missing.
- bouillabaisse: fenkolia: GI value is unpublished, off-scale, or its food/preparation match lacks a rationale.
- bouillabaisse: sahramia: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- bouillabaisse: kuivattua timjamia: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.

### pav-bhaji

Annoksia 4. Nykytila INSUFFICIENT SOURCE DATA; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 0.47025 g/annos. Pelkän GI-poiston laskennallinen tila: INSUFFICIENT SOURCE DATA; ei erillinen hyväksyntä.

- sipuli: aiempi massa 55 g; HH 0.66 g/annos; koostumus `fineli-335-release-20`. Uusi laskentamassa 55. Recipe-listed 55 g, mapped to SIPULI, KELTASIPULI (raw yellow onion). AJO 1.5: checked against original recipe and Fineli Release 20 #335 (4.8 g available carbohydrate/100 g; KPL_M 55 g, KPL_S 30 g); starting edible onion mass, no cooking-loss deduction.

Valmistus alkuperäisestä reseptistä:

1. Keitä perunat, kukkakaali, herneet ja porkkana pehmeiksi. Valuta ja säästä keitinvettä.
2. Kuullota sipuli öljyssä. Lisää valkosipuli, juustokumina, korianteri, savupaprika, kurkuma ja chili. Paista minuutti.
3. Lisää tomaatit ja suola. Hauduta 10 minuuttia.
4. Lisää kypsät kasvikset ja muussaa pannulla karkeaksi soseeksi. Ohenna keitinvedellä sopivaksi.
5. Hauduta seosta 10–15 minuuttia välillä sekoittaen. Sekoita joukkoon puolet voista ja korianteri.
6. Halkaise sämpylät ja paahda pannulla lopussa voissa. Tarjoa bhajin kanssa.

Muut aiemmat poisjätöt: voita: 0.06 g HH/annos; valkosipulinkynttä: 0.28525 g HH/annos; tuoretta korianteria: 0.125 g HH/annos.

Jäljellä olevat mallin estot:

- pav-bhaji: pav bhaji masala -mausteseosta: No source-matched composition and preparation was resolved for “pav bhaji masala -mausteseosta”; it is not treated as zero.
- pav-bhaji: tuoretta korianteria: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- pav-bhaji: recipe structure differs from the last GL review (b1c2bd3e036f0a17b3f61a560c39b5df56e1d8d5); ingredient mapping and calculation must be reviewed again.

### tunisialainen-ojja

Annoksia 4. Nykytila INSUFFICIENT SOURCE DATA; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 0.57525 g/annos. Pelkän GI-poiston laskennallinen tila: INSUFFICIENT SOURCE DATA; ei erillinen hyväksyntä.

- sipuli: aiempi massa 55 g; HH 0.66 g/annos; koostumus `fineli-335-release-20`. Uusi laskentamassa 55. Recipe-listed 55 g, mapped to SIPULI, KELTASIPULI (raw yellow onion). AJO 1.5: checked against original recipe and Fineli Release 20 #335 (4.8 g available carbohydrate/100 g; KPL_M 55 g, KPL_S 30 g); starting edible onion mass, no cooking-loss deduction.

Valmistus alkuperäisestä reseptistä:

1. Kuumenna öljy pannulla. Kuullota sipuli ja paprika pehmeiksi noin 6 minuuttia.
2. Lisää valkosipuli, juustokumina ja harissa. Paista minuutti.
3. Kaada pannulle tomaattimurska ja suola. Hauduta 12–15 minuuttia, kunnes kastike sakenee.
4. Kuullota hienonnettu sipuli ja paprika oliiviöljyssä. Lisää murskattu valkosipuli, tomaattimurska, harissa ja juustokumina. Hauduta, kunnes kastike sakenee. Riko kananmunat kastikkeeseen ja kypsennä kannen alla, kunnes valkuaiset ovat hyytyneet. Tarjoa persiljan ja maalaisleivän kanssa.
5. Viimeistele persiljalla ja tarjoa leivän kanssa.

Muut aiemmat poisjätöt: valkosipulinkynttä: 0.28525 g HH/annos; juustokuminaa: 0.125 g HH/annos; kananmunaa: 0.165 g HH/annos; tuoretta persiljaa: 0.04125 g HH/annos.

Jäljellä olevat mallin estot:

- tunisialainen-ojja: harissaa: No source-matched composition and preparation was resolved for “harissaa”; it is not treated as zero.
- tunisialainen-ojja: juustokuminaa: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- tunisialainen-ojja: tuoretta persiljaa: GI value is unpublished, off-scale, or its food/preparation match lacks a rationale.
- tunisialainen-ojja: recipe structure differs from the last GL review (b1c2bd3e036f0a17b3f61a560c39b5df56e1d8d5); ingredient mapping and calculation must be reviewed again.

### japanilainen-curry-tofulla

Annoksia 4. Nykytila INSUFFICIENT SOURCE DATA; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 0 g/annos. Pelkän GI-poiston laskennallinen tila: INSUFFICIENT SOURCE DATA; ei erillinen hyväksyntä.

- sipuli: aiempi massa 55 g; HH 0.66 g/annos; koostumus `fineli-335-release-20`. Uusi laskentamassa 55. Recipe-listed 55 g, mapped to SIPULI, KELTASIPULI (raw yellow onion). AJO 1.5: checked against original recipe and Fineli Release 20 #335 (4.8 g available carbohydrate/100 g; KPL_M 55 g, KPL_S 30 g); starting edible onion mass, no cooking-loss deduction.

Valmistus alkuperäisestä reseptistä:

1. Kuivaa tofu ja leikkaa kuutioiksi. Ruskista öljyssä pannulla, nosta sivuun.
2. Kuullota viipaloitu sipuli. Lisää porkkana ja kesäkurpitsa kuutioina sekä kasvisliemi. Hauduta 15 minuuttia.
3. Sekoita curryroux joukkoon ja keitä pakkauksen ohjeen mukaan, kunnes liemi sakenee. Lisää tofu ja kuumenna.
4. Raasta kukkakaali riisimäiseksi ja höyrytä tai paista pannulla 5 minuuttia.
5. Tarjoa tofu-curry kukkakaaliriisin kanssa.

Muut aiemmat poisjätöt: ei positiivisia poisjättöjä.

Jäljellä olevat mallin estot:

- japanilainen-curry-tofulla: kasvislientä: No source-matched composition and preparation was resolved for “kasvislientä”; it is not treated as zero.
- japanilainen-curry-tofulla: japanilaista curryroux-tahnaa: No source-matched composition and preparation was resolved for “japanilaista curryroux-tahnaa”; it is not treated as zero.

### kimchi-jjigae

Annoksia 4. Nykytila INSUFFICIENT SOURCE DATA; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 0.6775 g/annos. Pelkän GI-poiston laskennallinen tila: INSUFFICIENT SOURCE DATA; ei erillinen hyväksyntä.

- keltasipulia: aiempi massa 55 g; HH 0.66 g/annos; koostumus `fineli-335-release-20`. Uusi laskentamassa 55. Recipe-listed 55 g, mapped to SIPULI, KELTASIPULI (raw yellow onion). AJO 1.5: checked against original recipe and Fineli Release 20 #335 (4.8 g available carbohydrate/100 g; KPL_M 55 g, KPL_S 30 g); starting edible onion mass, no cooking-loss deduction.

Valmistus alkuperäisestä reseptistä:

1. Kuumenna öljy kattilassa ja ruskista porsaanliha.
2. Lisää kimchi ja sipuli. Paista muutama minuutti, jotta kimchin maku syvenee.
3. Sekoita joukkoon gochujang, gochugaru, soijakastike ja liemi.
4. Kiehauta ja hauduta kannen alla noin 25 minuuttia.
5. Lisää tofu ja hauduta vielä 5–7 minuuttia. Viimeistele kevätsipulilla.

Muut aiemmat poisjätöt: gochugaru-chilihiutaleita: 0.125 g HH/annos; soijakastiketta: 0.4275 g HH/annos; kevätsipulia: 0.125 g HH/annos.

Jäljellä olevat mallin estot:

- kimchi-jjigae: kypsää kimchiä: No source-matched composition and preparation was resolved for “kypsää kimchiä”; it is not treated as zero.
- kimchi-jjigae: kanalientä tai vettä: No source-matched composition and preparation was resolved for “kanalientä tai vettä”; it is not treated as zero.
- kimchi-jjigae: gochujang-tahnaa: No source-matched composition and preparation was resolved for “gochujang-tahnaa”; it is not treated as zero.
- kimchi-jjigae: gochugaru-chilihiutaleita: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- kimchi-jjigae: kevätsipulia: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.

### janssoninkiusaus-juuriselleri

Annoksia 4. Nykytila INSUFFICIENT SOURCE DATA; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 0.306 g/annos. Pelkän GI-poiston laskennallinen tila: INSUFFICIENT SOURCE DATA; ei erillinen hyväksyntä.

- sipuli: aiempi massa 55 g; HH 0.66 g/annos; koostumus `fineli-335-release-20`. Uusi laskentamassa 55. Recipe-listed 55 g, mapped to SIPULI, KELTASIPULI (raw yellow onion). AJO 1.5: checked against original recipe and Fineli Release 20 #335 (4.8 g available carbohydrate/100 g; KPL_M 55 g, KPL_S 30 g); starting edible onion mass, no cooking-loss deduction.

Valmistus alkuperäisestä reseptistä:

1. Kuumenna uuni 200 asteeseen. Kuori juuriselleri ja leikkaa ohuiksi suikaleiksi. Hienonna sipuli.
2. Voitele uunivuoka. Lado siihen juuriselleri, sipuli ja paloitellut anjovikset kerroksittain.
3. Sekoita kerma ja maito. Kaada vuokaan. Mausta kevyesti pippurilla; valutetuista anjoviksista tulee riittävästi suolaisuutta.
4. Paista 50–60 minuuttia, kunnes selleri on pehmeää ja pinta kullanruskea. Peitä foliolla, jos pinta tummuu liikaa.
5. Anna vetäytyä 10 minuuttia ja ripottele pinnalle tilli.

Muut aiemmat poisjätöt: voita: 0.05600000000000001 g HH/annos; mustapippuria: 0.125 g HH/annos; silputtua tilliä: 0.125 g HH/annos.

Jäljellä olevat mallin estot:

- janssoninkiusaus-juuriselleri: anjovisfileitä mausteliemessä: No source-matched composition and preparation was resolved for “anjovisfileitä mausteliemessä”; it is not treated as zero.
- janssoninkiusaus-juuriselleri: mustapippuria: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- janssoninkiusaus-juuriselleri: silputtua tilliä: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- janssoninkiusaus-juuriselleri: recipe structure differs from the last GL review (b1c2bd3e036f0a17b3f61a560c39b5df56e1d8d5); ingredient mapping and calculation must be reviewed again.

### meksikolainen-huevos-a-la-mexicana

Annoksia 2. Nykytila CALCULATED; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 0.3525 g/annos. Pelkän GI-poiston laskennallinen tila: INSUFFICIENT SOURCE DATA; ei erillinen hyväksyntä.

- sipuli: aiempi massa 55 g; HH 1.32 g/annos; koostumus `fineli-335-release-20`. Uusi laskentamassa 55. Recipe-listed 55 g, mapped to SIPULI, KELTASIPULI (raw yellow onion). AJO 1.5: checked against original recipe and Fineli Release 20 #335 (4.8 g available carbohydrate/100 g; KPL_M 55 g, KPL_S 30 g); starting edible onion mass, no cooking-loss deduction.

Valmistus alkuperäisestä reseptistä:

1. Pilko täytteen kasvikset ja muut suuret ainekset pieniksi paloiksi. Kuullota ne pannulla tilkassa öljyä, kunnes ne ovat pehmenneet.
2. Vatkaa kananmunat ja mausta ripauksella suolaa. Kaada munaseos pannulle ja laske lämpö miedoksi.
3. Vedä hyytynyttä munaa reunoilta kohti keskustaa. Taita tai rullaa, kun pinta on juuri hyytynyt.
4. Paista tomaatti, sipuli ja jalapeno pehmeiksi ennen kananmunien lisäämistä.

Muut aiemmat poisjätöt: kananmuna: 0.165 g HH/annos; tuoretta jalapeñoa: 0.1875 g HH/annos.

Jäljellä olevat mallin estot:

- meksikolainen-huevos-a-la-mexicana: sipuli: AJO 1.5: onion GI 15 withdrawn; DOI 10.3390/nu12102989 Table 1 and DOI 10.3945/an.112.003509 Table 3 do not establish a preparation-matched primary human GI. Missing GI is not zero.

### karibia-callaloo-munakas

Annoksia 2. Nykytila CALCULATED; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 0.665 g/annos. Pelkän GI-poiston laskennallinen tila: INSUFFICIENT SOURCE DATA; ei erillinen hyväksyntä.

- keltasipulia: aiempi massa 50 g; HH 1.2 g/annos; koostumus `fineli-335-release-20`. Uusi laskentamassa 50. Recipe-listed 50 g, mapped to SIPULI, KELTASIPULI (raw yellow onion). AJO 1.5: checked against original recipe and Fineli Release 20 #335 (4.8 g available carbohydrate/100 g; KPL_M 55 g, KPL_S 30 g); starting edible onion mass, no cooking-loss deduction.

Valmistus alkuperäisestä reseptistä:

1. Pilko täytteen kasvikset ja muut suuret ainekset pieniksi paloiksi. Kuullota ne pannulla tilkassa öljyä, kunnes ne ovat pehmenneet.
2. Vatkaa kananmunat ja mausta ripauksella suolaa. Kaada munaseos pannulle ja laske lämpö miedoksi.
3. Vedä hyytynyttä munaa reunoilta kohti keskustaa. Taita tai rullaa, kun pinta on juuri hyytynyt.
4. Kuullota sipuli, pinaatti ja timjami pannulla öljyssä. Kaada päälle vatkatut munat ja kypsennä miedolla lämmöllä.

Muut aiemmat poisjätöt: kananmuna: 0.165 g HH/annos; kevätsipuli: 0.25 g HH/annos; tuoretta timjamia: 0.25 g HH/annos.

Jäljellä olevat mallin estot:

- karibia-callaloo-munakas: keltasipulia: AJO 1.5: onion GI 15 withdrawn; DOI 10.3390/nu12102989 Table 1 and DOI 10.3945/an.112.003509 Table 3 do not establish a preparation-matched primary human GI. Missing GI is not zero.
- karibia-callaloo-munakas: kevätsipuli: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- karibia-callaloo-munakas: tuoretta timjamia: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.

### rogan-josh

Annoksia 4. Nykytila CALCULATED; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 1.626625 g/annos. Pelkän GI-poiston laskennallinen tila: INSUFFICIENT SOURCE DATA; ei erillinen hyväksyntä.

- sipuli: aiempi massa 55 g; HH 0.66 g/annos; koostumus `fineli-335-release-20`. Uusi laskentamassa 55. Recipe-listed 55 g, mapped to SIPULI, KELTASIPULI (raw yellow onion). AJO 1.5: checked against original recipe and Fineli Release 20 #335 (4.8 g available carbohydrate/100 g; KPL_M 55 g, KPL_S 30 g); starting edible onion mass, no cooking-loss deduction.

Valmistus alkuperäisestä reseptistä:

1. Ruskista lampaanpalat öljyssä erissä ja nosta sivuun.
2. Kuullota sipuli samassa padassa. Lisää valkosipuli, inkivääri, kaneli ja kardemumma.
3. Sekoita juustokumina, korianteri, paprikajauhe ja chili jogurtin kanssa. Lisää seos kattilaan miedolla lämmöllä sekoittaen.
4. Palauta liha pataan. Lisää suola ja vesi. Kuumenna kiehuvaksi.
5. Peitä kannella ja hauduta hyvin miedolla lämmöllä noin 1,5 tuntia, kunnes lammas on mureaa. Sekoita välillä.
6. Poista kanelitanko ja kardemummat. Tarjoa riisin tai leivän kanssa.

Muut aiemmat poisjätöt: valkosipulinkynttä: 0.28525 g HH/annos; tuoretta inkivääriä: 0.591375 g HH/annos; jauhettua juustokuminaa: 0.125 g HH/annos; jauhettua korianteria: 0.125 g HH/annos; paprikajauhetta: 0.125 g HH/annos; chilijauhetta: 0.125 g HH/annos; kanelitanko: 0.125 g HH/annos; kardemummakotaa: 0.125 g HH/annos.

Jäljellä olevat mallin estot:

- rogan-josh: jauhettua juustokuminaa: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- rogan-josh: jauhettua korianteria: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- rogan-josh: paprikajauhetta: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- rogan-josh: chilijauhetta: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- rogan-josh: kanelitanko: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- rogan-josh: kardemummakotaa: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.

### kreikkalainen-kanavuoka-oliiveilla

Annoksia 4. Nykytila CALCULATED; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 0.25 g/annos. Pelkän GI-poiston laskennallinen tila: INSUFFICIENT SOURCE DATA; ei erillinen hyväksyntä.

- punasipuli: aiempi massa 100 g; HH 1.2 g/annos; koostumus `fineli-335-release-20`. Uusi laskentamassa 100. Recipe-listed 100 g red onion; previous 55 g yellow-onion estimate was mismatched. AJO 1.5: quantity is explicit, but yellow-onion composition is a red-onion proxy; not newly approved.

Valmistus alkuperäisestä reseptistä:

1. Kuumenna uuni 200 asteeseen. Laita broileri uunivuokaan ja mausta suolalla, pippurilla ja oreganolla.
2. Lisää puolitetut tomaatit, lohkottu punasipuli ja oliivit. Valuta päälle oliiviöljy ja sitruunamehu.
3. Paista 30–35 minuuttia, kunnes broileri on kypsää. Murustele feta pinnalle viimeiseksi 10 minuutiksi.
4. Leikkaa broileri ja punasipuli paloiksi. Yhdistä uunivuokaan broilerin, tomaattien, oliivien, oliiviöljyn, oreganon ja sitruunamehun kanssa. Paista, kunnes broileri on kypsää. Murenna feta päälle vasta kypsennyksen lopussa.

Muut aiemmat poisjätöt: kuivattua oreganoa: 0.125 g HH/annos; suolaa ja mustapippuria: 0.125 g HH/annos.

Jäljellä olevat mallin estot:

- kreikkalainen-kanavuoka-oliiveilla: punasipuli: AJO 1.5: onion GI 15 withdrawn; DOI 10.3390/nu12102989 Table 1 and DOI 10.3945/an.112.003509 Table 3 do not establish a preparation-matched primary human GI. Missing GI is not zero.
- kreikkalainen-kanavuoka-oliiveilla: kuivattua oreganoa: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- kreikkalainen-kanavuoka-oliiveilla: suolaa ja mustapippuria: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.

### kana-tagine-sitruunalla

Annoksia 4. Nykytila CALCULATED; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 1.2805 g/annos. Pelkän GI-poiston laskennallinen tila: CALCULATED; ei erillinen hyväksyntä.

- sipuli: aiempi massa 55 g; HH 0.66 g/annos; koostumus `fineli-335-release-20`. Uusi laskentamassa 55. Recipe-listed 55 g, mapped to SIPULI, KELTASIPULI (raw yellow onion). AJO 1.5: checked against original recipe and Fineli Release 20 #335 (4.8 g available carbohydrate/100 g; KPL_M 55 g, KPL_S 30 g); starting edible onion mass, no cooking-loss deduction.

Valmistus alkuperäisestä reseptistä:

1. Kuumenna öljy paksupohjaisessa padassa. Ruskista broilerit joka puolelta ja nosta sivuun.
2. Kuullota sipuli ja valkosipuli padassa. Lisää inkivääri, kurkuma ja juustokumina.
3. Palauta broileri pataan. Lisää sitruunankuori ja kanaliemi. Peitä ja hauduta miedolla lämmöllä noin 45 minuuttia.
4. Lisää oliivit ja hauduta vielä 10 minuuttia, kunnes kana on mureaa ja kypsää.
5. Maista suola ja viimeistele korianterilla. Tarjoa couscousin tai leivän kanssa.

Muut aiemmat poisjätöt: valkosipulinkynttä: 0.28525 g HH/annos; jauhettua inkivääriä: 0.3 g HH/annos; kurkumaa: 0.125 g HH/annos; juustokuminaa: 0.125 g HH/annos; kanalientä: 0.32025 g HH/annos; tuoretta korianteria: 0.125 g HH/annos.

Jäljellä olevat mallin estot:

- kana-tagine-sitruunalla: jauhettua inkivääriä: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- kana-tagine-sitruunalla: kurkumaa: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- kana-tagine-sitruunalla: juustokuminaa: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- kana-tagine-sitruunalla: tuoretta korianteria: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.

### palak-paneer

Annoksia 4. Nykytila CALCULATED; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 1.311625 g/annos. Pelkän GI-poiston laskennallinen tila: CALCULATED; ei erillinen hyväksyntä.

- sipuli: aiempi massa 55 g; HH 0.66 g/annos; koostumus `fineli-335-release-20`. Uusi laskentamassa 55. Recipe-listed 55 g, mapped to SIPULI, KELTASIPULI (raw yellow onion). AJO 1.5: checked against original recipe and Fineli Release 20 #335 (4.8 g available carbohydrate/100 g; KPL_M 55 g, KPL_S 30 g); starting edible onion mass, no cooking-loss deduction.

Valmistus alkuperäisestä reseptistä:

1. Huuhtele pinaatti ja ryöppää kiehuvassa vedessä minuutti. Jäähdytä nopeasti ja valuta.
2. Soseuta pinaatti karkeaksi soseeksi.
3. Ruskista paneer-kuutiot pannulla ruokalusikallisessa öljyä. Nosta sivuun.
4. Kuullota sipuli jäljellä olevassa öljyssä. Lisää valkosipuli, inkivääri, juustokumina ja kurkuma. Paista minuutti.
5. Lisää pinaattisose, suola ja puoli desilitraa vettä. Hauduta 8 minuuttia.
6. Lisää kerma, garam masala ja paneer. Kuumenna varovasti 5 minuuttia. Mausta sitruunamehulla.

Muut aiemmat poisjätöt: valkosipulinkynttä: 0.28525 g HH/annos; tuoretta inkivääriä: 0.591375 g HH/annos; jauhettua juustokuminaa: 0.125 g HH/annos; kurkumaa: 0.125 g HH/annos; garam masalaa: 0.125 g HH/annos; sitruunamehua: 0.06 g HH/annos.

Jäljellä olevat mallin estot:

- palak-paneer: jauhettua juustokuminaa: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- palak-paneer: kurkumaa: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- palak-paneer: garam masalaa: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.

### siskonmakkarakeitto-juurekset

Annoksia 4. Nykytila INSUFFICIENT SOURCE DATA; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 1.158 g/annos. Pelkän GI-poiston laskennallinen tila: INSUFFICIENT SOURCE DATA; ei erillinen hyväksyntä.

- sipuli: aiempi massa 55 g; HH 0.66 g/annos; koostumus `fineli-335-release-20`. Uusi laskentamassa 55. Recipe-listed 55 g, mapped to SIPULI, KELTASIPULI (raw yellow onion). AJO 1.5: checked against original recipe and Fineli Release 20 #335 (4.8 g available carbohydrate/100 g; KPL_M 55 g, KPL_S 30 g); starting edible onion mass, no cooking-loss deduction.

Valmistus alkuperäisestä reseptistä:

1. Kuori lanttu, porkkana ja selleri. Leikkaa pieniksi tasakokoisiksi kuutioiksi. Hienonna sipuli.
2. Kiehauta liemi sipulin ja laakerinlehden kanssa. Lisää juurekset ja keitä 12–15 minuuttia.
3. Purista siskonmakkarasta pieniä nokareita suoraan kiehuvaan keittoon.
4. Keitä vielä noin 8 minuuttia, kunnes makkara on kypsää ja juurekset pehmeitä.
5. Mausta pippurilla, poista laakerinlehti ja lisää persilja.

Muut aiemmat poisjätöt: siskonmakkaraa: 0.9079999999999999 g HH/annos; lihalientä: 7.5 g HH/annos; lanttua: 3.675 g HH/annos; laakerinlehti: 0.125 g HH/annos; silputtua persiljaa: 0.011000000000000001 g HH/annos; mustapippuria: 0.125 g HH/annos.

Jäljellä olevat mallin estot:

- siskonmakkarakeitto-juurekset: lihalientä: GI evidence is missing.
- siskonmakkarakeitto-juurekset: lanttua: GI value is unpublished, off-scale, or its food/preparation match lacks a rationale.
- siskonmakkarakeitto-juurekset: laakerinlehti: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- siskonmakkarakeitto-juurekset: silputtua persiljaa: GI value is unpublished, off-scale, or its food/preparation match lacks a rationale.
- siskonmakkarakeitto-juurekset: mustapippuria: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.

### vhh-pyttipannu

Annoksia 4. Nykytila INSUFFICIENT SOURCE DATA; ehdotus INSUFFICIENT SOURCE DATA. Aiempi muiden pienosuuksien summa 0.471 g/annos. Pelkän GI-poiston laskennallinen tila: INSUFFICIENT SOURCE DATA; ei erillinen hyväksyntä.

- sipuli: aiempi massa 55 g; HH 0.66 g/annos; koostumus `fineli-335-release-20`. Uusi laskentamassa 55. Recipe-listed 55 g, mapped to SIPULI, KELTASIPULI (raw yellow onion). AJO 1.5: checked against original recipe and Fineli Release 20 #335 (4.8 g available carbohydrate/100 g; KPL_M 55 g, KPL_S 30 g); starting edible onion mass, no cooking-loss deduction.

Valmistus alkuperäisestä reseptistä:

1. Leikkaa lanttu pieniksi kuutioiksi. Keitä suolatussa vedessä 5–7 minuuttia, kunnes se hieman pehmenee. Valuta ja kuivaa pinta.
2. Kuutioi makkara ja kesäkurpitsa. Hienonna sipuli.
3. Sulata voi isossa paistinpannussa. Paista lanttukuutioita 5 minuuttia, kunnes ne saavat väriä.
4. Lisää makkara ja sipuli. Paista muutama minuutti ja lisää sitten kesäkurpitsa. Jatka paistamista, kunnes kasvikset ovat kypsiä mutta eivät vetisiä. Mausta pippurilla ja tarkista suola.
5. Paista kananmunat toisella pannulla ja nosta pyttipannun päälle. Viimeistele ruohosipulilla.

Muut aiemmat poisjätöt: lanttua: 2.94 g HH/annos; voita: 0.05600000000000001 g HH/annos; kananmunaa: 0.165 g HH/annos; mustapippuria: 0.125 g HH/annos; ruohosipulia: 0.125 g HH/annos.

Jäljellä olevat mallin estot:

- vhh-pyttipannu: vähähiilihydraattista makkaraa: No source-matched composition and preparation was resolved for “vähähiilihydraattista makkaraa”; it is not treated as zero.
- vhh-pyttipannu: lanttua: GI value is unpublished, off-scale, or its food/preparation match lacks a rationale.
- vhh-pyttipannu: mustapippuria: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- vhh-pyttipannu: ruohosipulia: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.

## Regressiot, historia ja toistettavuus

[Koneluettava vaikutusauditointi](glycemic-onion-source-review.json) sisältää kaikki 326 ennen/jälkeen-tilaa, pyöristämättömät arvot, vaihteluvälit, luokat ja tulosrivien SHA-256:t, 48 reseptin sipulisidonnat ja muiden pienosuuksien erittelyn, 54 vanhaa sidontaa, pelkän poistamisen vertailulaskelman sekä kaikki rajatut syötemuutokset. 113 laskettua arvoa ja kaikki 278 vaikutusalueen ulkopuolista kokonaista tulosriviä säilyvät. Uusia laskettavia reseptejä ei synny.

Kymmenen mainissa ollutta historiallista baselinea säilyvät kanonisilta LF-tavuiltaan identtisinä. Lisäksi paikallisen 2B6E-commitin `419104655ffe0f01ae2226a2daf2ea02fb5088d8` baseline, [44 ainesrivin katselmointi](glycemic-coverage-batch-2b6e-review.md) ja sen JSON-kumppani tuodaan tavutarkasti tähän PR:ään. Niiden sisältö kuvaa alkuperäistä tutkimushetkeä; sen paikallista tallennusta koskeva teksti on historiallinen. Erillistä ReportHubia ei tehdä.

Reseptien rakennefingerprintit eivät muutu; 38 vanhaa rakennepoikkeamaa säilyvät. Vain 48 tarkistetun syötteen syöte-/lähdesidonnat päivitetään; uusia poikkeamia 0/0/0. Yleinen ja 2B6D-nykyinventaario generoidaan samasta uudesta auditista; historiallisia nykytilasnapshotteja ei ylikirjoiteta. Kookosmaitopuuro on edelleen REFERENCE_ONLY ja keltainen kanacurry null.

Paikallisesti PASS: strict nutrition audit, GK-auditointi, molemmat kattavuusauditit, GI/GK 69/69, yksikkötestit 139/139, CI-valintatestit 12/12, build 691 reittiä, staattiset testit 24/24 ja markdownlint 831 tiedostoa. Buildin ennestään tuttu suuri JS-chunk -varoitus säilyy. Täsmällisen HEADin GitHub Actions -ajo kirjataan PR-kuvaukseen. CI:n on suoritettava GI/GK-testit ja kattavuusauditointi. Reseptit, tavallinen ravintoauditointi, GI-kaava, toleranssit ja luokkarajat säilyvät ennallaan.

## Jatkossa tarvittava lähdelaatu

- Punapaprikan sama väärä DOI ja jäljittämätön GI 40; oma vaikutusauditointi.
- Kevätsipulin ja salottisipulin kappalemassat/koostumukset sekä valkosipulimurskan tuote ja tl-massa.
- Lähteettömät mausteiden ja yrttien arvioidut poisjätöt; määräkohtainen lähteistys ennen uudelleenhyväksyntää.
- Muiden ryhmä-GI-analogioiden ja valmistusvastaavuuden erillinen katselmointi; tämä sipulikorjaus ei hyväksy niitä uudelleen.

Draft-PR pysähtyy riippumattomaan katselmointiin. Ei automaattista mergeä, tuotantojulkaisua tai seuraavaa kattavuuserää.

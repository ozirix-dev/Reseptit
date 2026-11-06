# Suomalaiset suosikit – V3 tuotevastaavuuksien esivalmistelu ja automaattinen eheystesti

Päiväys: 2026-11-06. Yksi PR: #311, draft. **Tämä on ainesosien ja tiedon laadun vaihe, ei valmis ravinto- tai GK-laskenta eikä julkaisu.**

## Tämän kierroksen toteutus

- Viisi raakilereseptiä päivitettiin hyödyntämään ostettavia, nimettyjä tuotetyyppejä: perinteinen karjalanpiirakka pysyy rukiin ja riisipuuron varassa, ei keto-muunnosta. Reseptien ainesmäärät ja annoskoot pidettiin ennallaan.
- Kahdeksalle kriittiselle syötteelle löydettiin tarkka **EAN**, julkinen pakkausravintotieto ja toimiva tuotelinkki. Tieto on tiedostossa [suomalaiset-klassikot-v3-tuote-gikandidaatit.json](suomalaiset-klassikot-v3-tuote-gikandidaatit.json).
- V2-aineslähdematriisin reseptikohtaiset blob-SHA:t, ainesosien nimet ja julkisen pakkauksen ehdokastiedot synkronoitiin uudelleen: [suomalaiset-klassikot-v2-aineslahiematriisi.json](suomalaiset-klassikot-v2-aineslahiematriisi.json). Alkuperäisiä Fineli/AFCD-tietueita tai hyväksyttyjä GK-laskelmia ei muutettu.
- Rakennettiin erillinen, riippuvuuksista vapaa eheystarkistin: `node docs/review/verify-finnish-classics.mjs` repon juuresta. Se valvoo viiden raakileen tilaa, 47 ainesosariviä, lähdeblobien SHA:t ja 8 EAN-ehdokkaan sidokset. **Sitä ei lisätty suljettuun GK-historiatestisarjaan**, koska laajan testisarjan sinetti hylkää uuden raakilehakemiston sisältöä; tuotannon ja GK:n turvarajoja ei kevennetä.
- Dokumentoitiin, miksi yhdenkin geneerisen pasta-GI:n siirtäminen eri tuotteeseen estetään.

## Mitkä tuotepakkausten arvot ovat alustavasti lähteistettyjä?

| Resepti / tuote | EAN | CHO / 100 g (julkinen) | Ehto ennen makro/GK-PASSia |
| --- | --- | ---: | --- |
| Karjalanpiirakan Pirkka puuroriisi | 6410405257864 | 77 g | fyysinen pakkaus, riisilajike ja puuro-GI puuttuvat |
| Marry me / De Cecco Spaghetti n°12 | 8001250120120 | **69 / 72 g ristiriitaiset lähteet** | fyysinen pakkaus ratkaisee ristiriidan; valmistus ja tutkimuserä tarkistettava |
| Marry me / Royal öljytomaattisuikale | 5201194037031 | 16 g | arvioitava, koskeeko ravintomerkintä valutettua 80 g syötävää tuotetta |
| Uunifetapasta / Barilla Penne Rigate n°73 | 8076802085738 | 71 g | GI 50 mitattiin yleisesti Barilla Penne -tuotteelle, ei n°73:n täsmäosumana |
| Uunifetapasta / Mevgal kreikkalainen feta PDO | 5201083349023 | 0,7 g | oikean valutetun 200 g juustomassan punnitus |
| Raejuustobagelit / Valio raejuusto 2 % | 6408430043019 | 1,8 g | punnitse koko 400 g, valmiin bagelin GI puuttuu |
| Linssimakaronilaatikko / Coop vihreät linssit | 7340191132238 | 43 g | lajikkeen ja valmistuksen GI-osuma avoin |
| Linssimakaronilaatikko / Valio Emmental punaleima 17 % | 6408430031221 | 0 g | oikea 17-prosenttinen tuote tarkistettava, ei 27–30 % yleisjuuston analogia |

EU-pakkausmerkinnän hiilihydraateista **ei vähennetä kuitua toistamiseen**. Tämä taulukko ei ole virallinen reseptin makrolaskelma. Erityisesti spagetin ero 69/72 g/100 g on ilmoitettava ratkeamattomana, ei keskiarvona. Jokaisen tuotteen yksityiskohtainen lähde-URL ja näyttöstatus ovat JSON-tiedostossa.

## GI-tutkimuksen nykytila

**Lupaavin: De Cecco Spaghetti n°12.** Sydneyn yliopiston Glycemic Index Search sisältää mitatun, vuonna 2005 testatun De Cecco Spaghetti n°12 -tuotteen GI:n 50. Suomalaisen myyntipakkauksen EAN 8001250120120 ja valmistajan nykyinen al dente -keittoaika 10 min ovat tiedossa. Tämä on vahva *tuotekohtainen tutkimusehdokas*, mutta valmistusmenetelmän ja yli 20 vuoden tuoteaikakauden vertailu ovat vielä hyväksyntäportteja; julkaistua GK-arvoa ei tehdä.

**Vielä analoginen: Barilla Penne.** GI Search sisältää Barilla Penne durum wheat -tuotteen mittauksen GI 50 (tutkimusvuosi 2006) ja erikseen De Cecco Penne mezzane GI 47. Suomen Barilla Penne Rigate n°73 EAN 8076802085738 ei ole ilman lisänäyttöä sama kuin kummankaan tutkimuksen täsmälleen osoittama tuote.

**Vihreät linssit.** GI Searchissa on erillisiä ihmisillä mitattuja kuivattujen vihreiden linssien tuloksia (GI 22, 30, 37) eri tutkimuspopulaatioista ja käsittelyistä. Coop-tuotteen lajike/erä ja valmistusmenetelmä eivät vielä täsmää yksilöidysti, joten ei arvon valikointia.

**Karjalanpiirakat ja raejuustobagelit.** Perinteisen valmiin piiraan, riisipuuron ja paistetun raejuustobagelin täsmävalmistus-GI on yhä HOLD. Ruisjauhon tai valkoisen leivän GI ei ole valmiin leivonnaisen GI. Aito karjalanpiirakka voi myöhemmin päästä julkaisuun ilman GK-numeroa, jos julkaisuportti tukee avoimen GK-eston rehellisesti.

## Jäljelle jäävät käytännön esteet (ei ohiteta)

1. **Fyysisen pakkauksen tarkistus:** etenkin ristiriitainen De Cecco CHO, Valion 2 % raejuusto, kuohukerman 38 % tuotepakkaus, 17 % emmental sekä öljyssä säilötyn tomaatin syötävä osuus. Tiedot tarkistetaan ennen lopullista `calculation`-syötettä.
2. **Ainesosien toteutuneet massat:** kaulintajauhon ja voiteluvoin nettomäärä perinteisissä piirakoissa, bagelien munavoitelu, pastan/linssien keittovesihävikin ravintoainetulkinta ja annosmassat.
3. **Rehellinen tutkimusvastaavuus:** GI-mittaustulos, sama tuote, samanlainen kypsennys ja luottamusluokka. Väärä vastaavuus on **HOLD**.
4. **Vasta tämän jälkeen** toistettavat `docs/nutrition/calculations/<recipe_id>.json`-syötteet ja virallisten neljän ravintoarvon auditointi; myöhemmin hyväksytty GK tai näkyvä GK-puutesyy.
5. **Sisällön portti:** koeruoan toimivuus, alkuperäisen ruokalajin luonne, oma valokuva ja neljä kieltä. Uusia kuvia tai käännöksiä ei luoda ennen hyväksyntää tässä työssä.

## Lähteet

- Ruokavirasto, Karjalanpiirakan APT tuote-eritelmä: https://www.ruokavirasto.fi/yritykset/oppaat/nimisuojattujen-elintarvikkeiden-valvontaohje/nimisuojattujen-elintarvikkeiden-valvontaohje/
- Sydneyn yliopiston Glycemic Index Search: https://glycemicindex.com/gi-search/
- De Cecco Spaghetti n°12 valmistajan keittoajat: https://www.dececco.com/it_it/product/spaghetti-n-12/
- De Cecco 500g Suomen EAN- ja ravintotiedot: https://www.k-ruoka.fi/kauppa/tuote/de-cecco-spaghetti-n-12-500g-8001250120120
- Saman EAN:n ristiriitainen CHO-merkintä: https://italianherkut.fi/tuote/spaghetti-12-500gr-de-cecco/
- Barilla Penne n°73 Suomen pakkaus: https://www.s-kaupat.fi/tuote/barilla-penne-rigate-no73-durumvehnasta-valmistettu-pasta-500g/8076802085738
- Valio raejuusto ja 17% emmental, valmistajan ravintotiedot: https://www.valio.fi/tuotteet/valio-raejuusto/ ja https://www.valio.fi/tuotteet/valio-emmental-punaleima-17-juusto/
- Mevgal feta PDO: https://www.k-ruoka.fi/kauppa/tuote/mevgal-aito-kreikkalainen-feta-200g-lakt-5201083349023
- Coop vihreät linssit: https://www.s-kaupat.fi/tuote/coop-vihreat-linssit-400-g/7340191132238
- Royal aurinkokuivattu tomaatti: https://www.s-kaupat.fi/tuote/royal-330200g-aurinkokuivattu-tomaattisuikale-oljyssa/5201194037031

**Päätös:** viisi luonnosta pysyvät DRAFT-tilassa. Tämä V3 on tuote- ja GI-näytön valmistelua, ei julkaisu eikä GK-PASS.

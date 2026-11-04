# GI SQLite cache V1 — paikallinen hakuindeksi

**Tila.** SQLite on GI-rekisterin ensisijainen paikallinen hakukerros. Hyväksytty lähdeaineisto tallennetaan Gitissä versioituun JSONiin.

Aiemmat suunnitelmat: GI Knowledge Base PR #242, SOURCE-01 SQLite/D1 -kartoitus PR #174 ja Nutrition Core PR #176. Tämä toteutus täydentää suunnitelmia, ei hyväksy niiden muita vaiheita.

## Toiminta

Pythonin vakio-sqlite3:lla rakennetaan paikallinen ja kokonaan uudelleen rakennettava lukuindeksi Gitissä olevasta tiedostosta docs/nutrition/glycemic-index-records.json. Kanoninen JSON säilyy ainoana lähdetotuutena. Tietokantaa ei commitata tai siirretä Cloudflare D1:een.

Taulut source_registry, gi_record ja metadata säilyttävät lähdetunnisteet, GI-tietueet, valmistustapa- ja elintarvikeavaimet sekä lähdeviitteet. Indeksit food_key ja food_key+preparation_key nopeuttavat hakuja. Tietokantaan tallennetaan alkuperäisen JSON-tiedoston SHA-256. Erähaku lukee ja tiivistää lähdetiedoston kerran. Se rakentaa puuttuvan tai vanhentuneen GI-indeksin samasta aineistosta ja tekee haut yhdellä lukuoikeuksin avatulla yhteydellä. Seuraava erä tarkistaa lähdeaineiston uudelleen. Yksittäishaku ja tilastokomento ilmoittavat vanhentuneesta indeksistä virheen.

Tulos erottaa GI-arvon, laadun, analogian ja valmistustavan. Kaikki tulokset vaativat edelleen reseptikohtaisen katselmoinnin. Eri valmistustapojen tuloksia saa pyytää vain tutkimusvertailuun, ei automaattiseksi vastineeksi.

## Komennot (repojuuresta)

- python3 site/scripts/gi_sqlite_index.py build --db /tmp/reseptit-gi.sqlite
- python3 site/scripts/gi_sqlite_index.py stats --db /tmp/reseptit-gi.sqlite
- python3 site/scripts/gi_sqlite_index.py lookup --db /tmp/reseptit-gi.sqlite --food-key potato --preparation-key steamed-nishiyutaka
- python3 site/scripts/gi_sqlite_index.py lookup --db /tmp/reseptit-gi.sqlite --food-key potato --preparation-key steamed-nishiyutaka --include-other-preparations
- python3 site/scripts/gi_sqlite_index.py lookup-batch --db /tmp/reseptit-gi.sqlite --queries /tmp/gi-queries.json
- python3 -m unittest discover -s site/tests -p test_gi_sqlite_index.py

Windowsissa Python-käynnistin voi olla py -3. Valitse SQLite-tiedostolle versionhallinnan ulkopuolinen polku. Älä lisää .sqlite-tiedostoa Gitiin tai sivuston buildiin.

Erähaku lukee JSON-taulukon, jonka jokaisessa haussa on food_key sekä valinnaiset preparation_key, include_other_preparations ja limit. Tulokset palautuvat UTF-8-JSONina samassa järjestyksessä.

## Mittaus Windowsilla

Vertailussa käytettiin 30 aiemmin sidotun reseptin 73 hakua (21 eri avainparia). Hakutavat palauttivat samat tietuetunnisteet. Prosessin sisäisten mittausten mediaanit ovat 25 ajosta ja prosessivertailun mediaanit yhdeksästä ajosta.

| Vaihe | Mediaani, ms |
| --- | ---: |
| Pythonin tyhjän prosessin käynnistys | 74,74 |
| SQLite-indeksin rakentaminen | 26,55 |
| SQLite-yhteyden avaus, varmennus ja sulkeminen | 1,38 |
| 73 SQLite-hakua avatulla yhteydellä | 10,42 |
| SQLite-erähaku olemassa olevalla indeksillä | 13,24 |
| SQLite-erähaku puuttuvalla indeksillä | 42,08 |
| SQLite-eräkomento olemassa olevalla indeksillä | 353,68 |
| SQLite-eräkomento puuttuvalla indeksillä | 405,37 |
| SQLite-yksittäishaku toistettuna 73 kertaa | 106,59 |
| JSONin luku, muisti-indeksi ja haut | 0,95 |
| Haut valmiista JSON-muisti-indeksistä | 0,009 |

Eräkomennon luvut sisältävät uuden Python-prosessin, tiedostojen luvun ja täyden JSON-tulosteen. JSON-muisti-indeksin vertailu palauttaa tietuetunnisteet.

## Rajat ja seuraava vaihe

Tämä toteutus ei vielä tee PR #242:n erillistä lähde → riippumaton ihmis-GI-havainto → reseptisoveltuvuuspäätös -mallia. Nykyinen matchKind voi kuvata analogiaa tai kategoria-arvoa, eikä luokitus oikeuta käyttämään sitä uusissa resepteissä. Samasta tutkimuksesta lainattujen havaintojen deduplikointi kuuluu myöhempään kuratoituun lähdemalliin. Lähteen käyttöehdot on yhä arvioitava erikseen.

Koostumuslähteiden haku, FTS5-tekstihaku ja Approval Factoryn lukukytkentä ovat jatkovaiheita.

Julkaistut GK-arvot (lähtöhetken 235/326), Approval Factory ja A/B/Mixed Evidence -hyväksyntäportit pysyvät muuttumattomina.

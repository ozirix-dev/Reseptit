# GI SQLite cache V1 — paikallinen hakuindeksi

**Tila:** rajattu toteutuspilotti. Ei uusi GI-lähde, julkaisuportti eikä tuotantotietokanta.

Aiemmat suunnitelmat: GI Knowledge Base PR #242, SOURCE-01 SQLite/D1 -kartoitus PR #174 ja Nutrition Core PR #176. Tämä toteutus täydentää suunnitelmia, ei hyväksy niiden muita vaiheita.

## Toiminta

Pythonin vakio-sqlite3:lla rakennetaan paikallinen ja kokonaan uudelleen rakennettava lukuindeksi Gitissä olevasta tiedostosta docs/nutrition/glycemic-index-records.json. Kanoninen JSON säilyy ainoana lähdetotuutena. Tietokantaa ei commitata tai siirretä Cloudflare D1:een.

Taulut source_registry, gi_record ja metadata säilyttävät lähdetunnisteet, GI-tietueet, valmistustapa- ja elintarvikeavaimet sekä lähdeviitteet. Indeksit food_key ja food_key+preparation_key nopeuttavat hakuja. Tietokannassa on alkuperäisen JSON-tiedoston SHA-256: muuttuneeseen aineistoon perustuva indeksi hylätään ja rakennetaan uudelleen.

Tulos erottaa GI-arvon, laadun, analogian ja valmistustavan. Kaikki tulokset vaativat edelleen reseptikohtaisen katselmoinnin. Eri valmistustapojen tuloksia saa pyytää vain tutkimusvertailuun, ei automaattiseksi vastineeksi.

## Komennot (repojuuresta)

- python3 site/scripts/gi_sqlite_index.py build --db /tmp/reseptit-gi.sqlite
- python3 site/scripts/gi_sqlite_index.py stats --db /tmp/reseptit-gi.sqlite
- python3 site/scripts/gi_sqlite_index.py lookup --db /tmp/reseptit-gi.sqlite --food-key potato --preparation-key steamed-nishiyutaka
- python3 site/scripts/gi_sqlite_index.py lookup --db /tmp/reseptit-gi.sqlite --food-key potato --preparation-key steamed-nishiyutaka --include-other-preparations
- python3 -m unittest discover -s site/tests -p test_gi_sqlite_index.py

Windowsissa Python-käynnistin voi olla py -3. Valitse SQLite-tiedostolle versionhallinnan ulkopuolinen polku. Älä lisää .sqlite-tiedostoa Gitiin tai sivuston buildiin.

## Rajat ja seuraava vaihe

Tämä toteutus ei vielä tee PR #242:n erillistä lähde → riippumaton ihmis-GI-havainto → reseptisoveltuvuuspäätös -mallia. Nykyinen matchKind voi kuvata analogiaa tai kategoria-arvoa, eikä luokitus oikeuta käyttämään sitä uusissa resepteissä. Samasta tutkimuksesta lainattujen havaintojen deduplikointi kuuluu myöhempään kuratoituun lähdemalliin. Lähteen käyttöehdot on yhä arvioitava erikseen.

Seuraavaksi mitataan sama 30 reseptin haku nykyisestä JSONista, muistissa indeksoidusta JSONista ja paikallisesta SQLitesta. Nopeutumista ei ole vielä osoitettu. SQLite on tässä vaiheessa vapaaehtoinen offline-hakuvälimuisti, ei riippuvuus GK-laskennassa.

Julkaistut GK-arvot (lähtöhetken 235/326), Approval Factory ja A/B/Mixed Evidence -hyväksyntäportit pysyvät muuttumattomina.

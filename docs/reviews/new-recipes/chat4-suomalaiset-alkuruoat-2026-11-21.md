# Chat-4: kymmenen suomalaisen alkuruoan Draft-erä – 21.11.2026

Työn omistaja: Chat 4

Tämän erän tarkoitus on tallentaa kymmenen itsenäistä suomenkielistä julkaisematonta sisältöluonnosta. Kaikkien tilana on `draft`, eikä julkaisu, käännösten hyväksyntä tai Cloudflare-deploy kuulu tähän commit-vaiheeseen.

## Identiteettien esitarkistus

Tarkistettu GitHub mainin reseptihakemistoluettelot: alkuruoat (36), pääruoat, aamupalat, leivonnaiset, välipalat ja jälkiruoat sekä 21.11. avoimet PR:t. Täsmälleen samoja otsikoita tai ilmeisen samaa alkuruokareseptiä ei havaittu; tarkistus on tiedostonimien ja tunnusten esiseulonta, ei kaikkien runkotekstien semanttinen auditointi.

Poissuljetut päällekkäisyydet: rosolli (Chat 3 PR #796), yrttiset täytetyt kananmunat (`reseptit/valipalat/taytetyt-kananmunat-yrteilla.md`). Aiempi savulohi-tuorejuustorulla ja kylmäsavulohilettukakku ovat eri ruokia, eikä niitä lisätä uudelleen.

## Uudet identiteetit

1. `suolasienisalaatti-sipulilla` – Suolasienisalaatti sipulilla
2. `lasimestarin-silli` – Lasimestarin silli
3. `graavisiika-tillilla` – Graavisiika tillillä
4. `uunissa-paistetut-silakkarullat` – Uunissa paistetut silakkarullat
5. `muikunmati-rieskarullat` – Muikunmäti-rieskarullat
6. `savupororullat-kantarelleilla` – Savupororullat kantarellitäytteellä
7. `pienet-kantarellipiiraat` – Pienet kantarellipiiraat
8. `punajuuricarpaccio-vuohenjuustolla` – Paahdettu punajuuricarpaccio vuohenjuustolla
9. `sillikaviaari-ruisnapeilla` – Sillikaviaari ruisnapeilla
10. `nokkosletut-puolukoilla` – Pienet nokkosletut puolukoilla

## Julkaisuportit ja seuraavat työt

- HOLD: riippumaton lähdeperusteinen reseptikatselmointi, määrien, aikojen ja ainesosien tilojen tarkistus
- HOLD: ruokaturvariskit, erityisesti graavisiian lois- ja listeriariski, muikunmäti, suolasienien esikäsittely ja nokkosen käsittely
- HOLD: kuvat puuttuvat kaikista 10 reseptistä; yhtään kuvaa ei ole generoitu tässä erässä
- HOLD: EN/SV/TH-käännökset ja tarvittavat merkitysvertailut sekä lähde-SHA-sidonta
- HOLD: ravintolaskenta puuttuu; GK = ei määritetty, ei keinotekoisia nollia
- Ennen Ready/mergeä: Recipe site -CI, erilliset hyväksynnät ja Repo Guardin SHA-pinnatut portit
- Erä ei muuta `main`-haaraa eikä tuotantodeployta. Cloudflare-este jää erilliseksi.

Kirjoitusalue: `reseptit/alkuruoat/<uudet tunnukset>.md` sekä tämä muistio. Ei omisteta tai muokata muiden aktiivisten chattien PR-haaroja.

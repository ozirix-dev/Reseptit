# Chat-4 – punasipulin thai-merkityskorjaus kahdessa sillireseptissä

Päiväys: 2026-11-22. Työn omistaja: Chat 4. Lähtö-main: `1fd15bd4ba09b91939a14edbb64f821eba4793ce`.

## Löydös

Suomenkielisissä `lasimestarin-silli` ja `sillikaviaari-ruisnapeilla` -resepteissä käytetään punasipulia (100 g ja 60 g). Englannissa on `red onion` ja ruotsissa `rödlök`, mutta thaissa käytettiin `หอมแดงหัวใหญ่` (salottisipulin `หอมแดง` ja tavallisen ison sipulin `หัวใหญ่`-elementtien sekoittava ilmaus). Thaimaan viranomaisaineistossa `หอมแดง` = shallot ja `หอมหัวใหญ่สีแดง` = red onion.

Korjattu molempien thaikielisten reseptien aineslistassa ja valmistusvaiheessa `หอมแดงหัวใหญ่` → `หอมหัวใหญ่สีแดง`. Määrät, muu valmistus sekä turvallisuusohjeet ennallaan. Kaksi muutettua Git-blob-tunnistetta päivitetty 32 tiedoston SHA-inventaarioon.

## Lähdetuki

- Thaimaan maatalousministeriö, kontrolloitujen siementen nimiluettelo: https://www.doa.go.th/ard/wp-content/uploads/2019/12/PP-CrS-name-062019.pdf (onion `หอมหัวใหญ่`, myös `หอมใหญ่สีแดง`; shallot `หอมแดง`).
- Thaimaan kansallinen tuote-/kasviluettelo: https://thailandntr.com/th/goods/national-trade-and-customs-laws-and-rules/download/970 (onion vs shallot eri kasveina).
- https://farm.co.th/red-onion/ (red onion `หอมหัวใหญ่สีแดง`).

## Julkaisurajat

Nämä ovat edelleen `status: draft`. Tämä Chat-4:n havainto ja korjaus eivät ole riippumattoman Codexin tai ihmisen semanttinen hyväksyntä. Yhtään virallista hyväksyntärekisteriä ei täydennetä tekaistulla päätöksellä. Muut 22 alkuruokakäännöstä ja raakakalan turvallisuus-HOLD pysyvät muuttumattomina. Kohdennettu regressiotesti varmistaa FI/EN/SV/TH:n punasipulin sekä TH:n raaka-aine- ja valmistustermin.

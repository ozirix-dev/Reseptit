# C20:n yhdeksän käännöksen julkaisu – merkityskatselmointi 10.11.2026

Lähde-main: `efc8ce70fcac2ba5961e3aea528c522116ec5599`. Kolme FI-aamiaisreseptiä × EN/SV/TH, yhteensä 9 käännöstä. Julkaisutekstit on verrattu [PR #383](https://github.com/ozirix-dev/Reseptit/pull/383):n täsmälleen SHA-lukittuun julkiseen FI-näyttöversioon. Tämä on **AI-merkityskatselmointi**, ei ihmisen tekemä riippumaton kielentarkistus eikä fyysinen koepaisto.

## Reseptien näyttö- ja käännöserot

- **Nasi lemak:** 100 g kuivaa riisiä, 184 g kookosmaitoa ja 100 g vettä, 110 g kuoretonta munaa höyryssä, 100 g kurkkua. `cooking_method` = keittäminen kaikissa kolmessa käännöksessä, ennestään oikeat työohjeet säilyvät.
- **Nasi uduk:** 100 g kuivaa jasmiiniriisiä, 200 g täysrasvaista kookosmaitoa, 110 g kuoretonta munaa höyryssä ja 100 g kurkkua. `cooking_method` = keittäminen. Työvaiheessa vain tarpeen mukaan lisättävä pieni määrä kuumaa vettä, jos riisi kuivuu ennen kypsymistä; ei muuta lisäainesta tai rasvaa. Kokkikelpoisuus on arvio, ei mitattu koepaisto.
- **Kiinalainen kevätsipulipannukakku:** 100 g vehnäjauho, 60 ml vesi, 15 minuutin taikinalepo, kerrostaminen, pannupaisto ja soijakastike. `time_total_min` = 35 kaikissa kielissä (arvio, ei mitattu koepaisto).

## Rajaus, evidenssi ja julkaisuportit

Jokaisen kieliversion `status: draft` → `published`. Ainesluettelo, annosmäärä, makroravintoarvot, kuva, FI-raakaresepti ja GI/GK-lähdesinetit pysyvät muuttumattomina. Kaikkien yhdeksän uuden version `source_hash` ja `translation_hash` löytyvät `meta/kaannokset/codex-review-evidence.json`-rekisteristä. Alkuperäinen raaka-FI tuottaa SHA:n `source_hash`; julkinen FI-esityksen merkityskatselmointi perustuu erilliseen lähde-SHA-lukittuun projektioon. Tätä kahta ei saa sekoittaa.

Sivurekisteri: 56 FI / 168 kieliparia → **59 FI / 177 kieliparia**; tämä ei kata kaikkia mahdollisia historiallisia käännöksiä. Vanha [C20 Draft #380](https://github.com/ozirix-dev/Reseptit/pull/380) pysyy **DO NOT MERGE**: siellä on jo julkaistujen kielien vanhat Draft-kopiot. Maakouda (3 käännöstä) pysyy erikseen HOLDissa, koska perunan massa ja CHO/GK-lähde puuttuvat.

Julkaisu-PR:n CI on varmennettava täsmällisellä HEAD-SHA:lla ennen yhdistämistä. GitHub Pagesin main-merge-SHA:n build ja deploy tarkistetaan erikseen; ei väitetä tuotantopäivitystä onnistuneeksi pelkän vihreän PR-CI:n perusteella.

# Neljän hyväksytyn B-version integraatio

Codex Julkaisu / GK80 Four Approved B vastaa worktreestä
`D:/Projects/tmp/reseptit-gk80-four-approved-b` ja haarasta
`codex/gk80-four-approved-b`. Repo on `ozirix-dev/Reseptit` ja lähtö-main
`12cce31acaa1fcaf4516440b58a1f5c30390fdea` (2.11.2026). Työ kattaa vain
neljän B-version aineiston, GK-only-näytön ja siihen liittyvät tarkistukset.
Valtuus kattaa integraation ja yhden Draft-PR:n.

| Hyväksytty B-versio | Skenaarioiden GK/annos | Näyttö |
| --- | ---: | ---: |
| Besan-chilla | 9,4698–11,1288 | 9–12 |
| Pinaatti-paneer-chilla | 9,1305–10,7895 | 9–11 |
| Mannasuurimoupma | 26,146648–26,836648 | 26–27 |
| Ven pongal | 40,1722275–45,60835 | 40–46 |

Chillojen ja upman kuitti tulee commitista
`4ee7ab5521224eab435c9611034e5197681f80d7`. Pongalin kuitti tulee
commitista `65ee5f58a1a8e376c013c8cccd9ed6e8f7d73a96`. Kuitit ja niiden
sinetöimät tapaus- ja lähdetiedostot on kopioitu muuttamattomina.
Varsinainen lähdeaineisto, tutkimusajo ja riippumaton Decimal-tarkistus
ovat kuittien nimeämissä tutkimuscommiteissa.

Integraatio tarkistaa kuitit, syötteet, alkuperäisreseptit ja jaetut lähteet,
laskee kaikki skenaariot olemassa olevalla GK-moottorilla ja vertaa välin
rajoja kuitteihin. Positiivisella hiilihydraatilla on jokaisessa B-skenaariossa
nimetty GI-sovellus. Väli pyöristetään ulospäin kokonaislukuihin. Julkinen teksti
kattaa neljä kieltä, ja reseptikortit käyttävät olemassa olevia kielireittejä.
Kattavuus esikatselussa on 187/326, joista 156 alkuperäisohjeen tulosta ja
31 erillistä GK-only-versiota. Numeerinen tulos puuttuu 139 reseptiltä.

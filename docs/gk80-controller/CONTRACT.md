# GK80 Controller V1: työjonon tietosopimus

Dokumentti koskee vain paikallista tutkimusjonoa, ei Reseptit-sivuston julkista GK-sopimusta.

## Paikallinen totuuden lähde

Jokaisella tutkimus-worktreellä on täsmälleen yksi paikallinen:

- .gk80-controller/state.json: kirjoittaja on ajonohjaimen Python-prosessi
- .gk80-controller/queue.json: Codex täydentää, ohjain lukee ja tarkistaa
- .gk80-controller/logs/turn-NNN.jsonl: Codexin vuoroloki
- .gk80-controller/active.lock: yhden prosessin kirjoituslukko
- .gk80-controller/STOP: käyttäjän pysäytyspyyntö

Nämä ovat .gitignore:ssa. Tuotanto tai ReportHub eivät lue niitä.
Muoto on UTF-8 JSON, schemaVersion 1, target 30, candidates-lista.

~~~json
{
  "schemaVersion": 1,
  "target": 30,
  "candidates": [
    {
      "recipeId": "meksikolainen-huevos-divorciados",
      "status": "CALCULATED",
      "blocker": "Raakasalsan tuotelähde ja valmistusvastaavuus vaativat vielä katselmoinnin"
    },
    {
      "recipeId": "vielaa-puuttuva-tapaus",
      "status": "HOLD",
      "blocker": "GI:lle ei löytynyt valmistusmuotoon soveltuvaa lähdettä"
    }
  ]
}
~~~

Yllä on **muotoesimerkki**, ei väite mainin nykyisistä resepteistä eikä
yhdeksän keskeneräisen GK-ehdokkaan hyväksyntä.

## Tilat

| Tila | Merkitys | Kasvattaa 30:n laskuria? |
| --- | --- | --- |
| NEW | Seulontaan valittu ID | Ei |
| RESEARCH | Lähteet, määrät, valmistus työn alla | Ei |
| CALCULATED | Ehdollinen GK-laskelma olemassa | Ei |
| VERIFIED | Rajatut syöte-, lähde- ja hash-tarkistukset kirjattu | Kyllä |
| HOLD | Täsmällinen avoin este | Ei |
| EXCLUDED | Julkaistu, toiselle kirjoittajalle varattu tai sopimaton | Ei |

Sama resepti-ID saa olla jonossa vain kerran. Eri tuote- tai
valmistusversiot eivät muutu toiseksi ID:ksi eivätkä kasvata kattavuutta.

## VERIFIED-merkinnän minimitiedot

~~~json
{
  "recipeId": "esimerkki-reseptiversio",
  "status": "VERIFIED",
  "servings": 4,
  "ingredientCount": 8,
  "gkPerServing": 7.14,
  "omittedChoPerServing": 1.22,
  "sources": [
    {
      "title": "Lähteen nimi",
      "url": "https://example.org/sahkoisesti-tarkistettu-lahde"
    }
  ],
  "checks": {
    "source": true,
    "amount": true,
    "gi": true,
    "omission": true,
    "hash": true
  },
  "inputSha256": "<64 hex-merkkiä varsinaisesta inputista>",
  "evidencePath": "docs/research/gk80-batch30/<recipe-id>.json",
  "evidenceSha256": "<64 hex-merkkiä lähde-evidenssitiedoston tavuista>"
}
~~~

Tässä esitetyt hash-tekstit ovat paikkamerkkejä: syöte ei läpäise tarkistinta
ennen todellisia SHA-256-arvoja.

Todellisen evidencePath-polun pitää sijaita oman tutkimus-worktreen
docs/research/gk80-batch30-hakemistossa. Tiedoston on oltava JSON-objekti,
joka sisältää vähintään recipeId- ja inputSha256-kentät. Sama ID ja hash
pitää olla jonossa. Ajonohjain tarkistaa tiedoston todellisen SHA-256:n;
polku ei saa nousta worktreestä ulos edes symlinkillä.

Varmennuspaketissa tulee lisäksi kuvata:

- Alkuperäinen resepti ja sen versionlukittu SHA
- Mitä osia valmistetaan ja syödään; annoskoko ja jokaisen ainesosan massa
- GI-lähteen tarkka ruoka-, valmistus- ja mittausvastaavuus
- Saatavan hiilihydraatin määritelmä, lähdeversio ja polyolien tulkinta
- GI:ttömän CHO:n yksittäinen ja yhteinen poisjättö sekä lähdeperuste
- A/B-menetelmä, LOW-varmuus, laskettu tarkka GK ja ero julkaistusta reseptistä
- Tiedostotiivisteet ja tekijän tarkistuskuittaus
- Mitä koodi ei vielä todista (esim. annoskohtainen biologinen vaste)

**Koodin VERIFIED-portti ei takaa, että Codexin kirjoittamat true-arvot ovat
oikeita tai että tuote vastaa GI-koetta.** Siksi syntynyt erä on edelleen
riippumattomassa tiede- ja sisältökatselmoinnissa ennen Draft-PR:n hyväksymistä.

## Ajon tilat ja erot

Ohjaimella on omat tilansa:

| Tila | Mitä tehdään? |
| --- | --- |
| PAUSED | Ajoa voi jatkaa toisella step/run-komennolla |
| RUNNING | Codex-vuoro käynnissä; active.lock olemassa |
| STOPPED_REQUESTED | STOP-pyyntö, ei seuraavaa vuoroa |
| STOPPED_TIMEOUT | Per-vuoron aikaraja ylitetty |
| STOPPED_BUDGET | Vuorobudjetti käytetty; ei automaattista korotusta |
| STOPPED_STALLED | Peräkkäiset vuorot eivät päivitä jonoa |
| STOPPED_CODEX_ERROR | Codex palautti virhekoodin |
| STOPPED_INVALID_QUEUE | Jonon tarkistus ei läpäissyt; palautettiin edellinen |
| READY_FOR_DRAFT | 30 rakenteellista VERIFIED-tapausta; valmistellaan luovutus |

Mikään näistä ei tarkoita, että GitHub-PR olisi valmis julkaistavaksi.

## Tieteellisen ja julkaisuportin erottaminen

1. **CALCULATED:** numeerinen tutkimusskenaario.
2. **VERIFIED:** lähdeaineiston läsnäolo, ID-uniikkius ja tiivisteiden
   rakenteellinen varmistus. Mallin ilmoittama tarkistus ei ole riippumaton auditointi.
3. **OWNER APPROVED:** täsmäversion lähde-, menetelmä- ja sisältöpäätös.
4. **DRAFT PR:** nimetty ainoa kirjoittaja integroi hyväksytyn erän.
5. **READY / MERGE / DEPLOY:** erilliset jo voimassa olevat julkaisupäätökset.

Jos julkaistu main muuttuu työn aikana, vertaile 30 ehdokasta uudelleen
ajantasaisiin numeerisiin recipe-ID:ihin. Poista vanhentuneet ehdokkaat
tavoitelaskurista ja täydennä uusia, älä yhdistele useita GK-versioita
samalle ID:lle.

## Luovutuspaketin ehdot

- 30 eri VERIFIED ID:tä, kullekin yksi versio ja omat hashit.
- Ei saman ID:n GK-only-varianttia toisesta avoimesta PR:stä.
- Punnitut lähteet, oikea valmistus ja epävarmuus ilmi.
- Ei uusia GI:n ruokaperheanalogia-oletuksia ilman menetelmäpäätöstä.
- Alkuperäiset reseptit ja makropidätykset ennallaan.
- ReportHub saa linkittää versionlukittuun aineistoon vasta erillisellä
  hyväksytyllä raportointi- tai integraatiotyöllä.

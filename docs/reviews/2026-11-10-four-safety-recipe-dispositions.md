# Recipavo – neljän turvallisuusryhmän päätökset, 10.11.2026

**Lähtökohtana** issue #404:n kohdat 07, 30, 32 ja 67. Toimenpiteet ovat oikeita julkaistuun reseptivalikoimaan vaikuttavia muutoksia, eivät pelkkiä varoituslaatikkoja. Kanonisia aineksia, makroja, GI/GK-evidenssejä ja kuvamateriaalia ei muuteta. Reseptien raakaversiot säilyvät katselmointia varten.

| # | recipe_id | Päätös | Evidenssi ennen mahdollista uudelleenjulkaisua |
|---|---|---|---|
| 07 | `karibia-bammy-kassavaleipa` | `published -> draft` | Lähdepohjaisesti turvallinen kassavan lajike ja käsittely/tuotteen koostumus, ruokalajikohtainen valmistus, ravinto/GI/GK-uudelleenkatselmointi |
| 30 | `karibia-ackee-ja-suolakala` | `published -> draft` | Elintarvikkeeksi hyväksytty kypsä ja asianmukaisesti käsitelty ackee, grammoina mitattu turvallinen tuote ja suolakalan määrä, suolanpoisto sekä ravintomalli |
| 32 | `kiinalainen-katkarapu-wontonkeitto` | säilyy `published`; väärä nelivaiheinen yleispohja korvattu | Täyttö 150 g katkaravuista + 1 tl inkivääristä; kaikki 150 g wonton-kuorta käytetään, nyytit suljetaan, katkaravut kypsennetään kauttaaltaan helmiäisenvaaleiksi ja läpinäkymättömiksi. Liemi 700 ml ja paksoi listan mukaisesti. Ei uusia ravintolukuja. |
| 67 | `vietnamilainen-banh-bao-kananmunalla` | `published -> draft` | Puuttuvat taikinaneste, kohotusaine, taikinan valmistus ja kohotusaika, sienitäytteen kypsennys, ruokalajikohtainen ravintolaskenta |

### Turvallisuuslähteet

- Ackee, lämpöä kestävä hypoglysiini A: https://www.fda.gov/food/natural-toxins-food/hypoglycin-and-ackee-fruit
- Katkaravun kypsyys, helmiäisenvaalea/läpinäkymätön: https://www.fda.gov/food/buy-store-serve-safe-food/safe-food-handling
- Kassavan syanogeeniset yhdisteet: https://www.who.int/news-room/fact-sheets/detail/natural-toxins-in-food/

### Muutoksen tarkka rajaus

- Kolme keskeneräistä FI-reseptiä merkitään `draft`-tilaan ja ne poistuvat buildin julkisesta reseptiluettelosta sekä reiteistä. Ne säilyvät Gitissä seuraavaa punnittua versiota varten.
- Katkarapuwontonin uusi ohje käyttää vain jo listattuja aineksia; sitä ei enää näytetä valmistuskiellolla, jos regressiot läpäisevät.
- Published-status -lukumäärä muuttuu 335 -> 332 ja FI-aamiaisten määrä 150 -> 147, tämän version reseptijulkaisuissa. Näitä ei peitetä vanhoilla historialukituksilla; testit päivitetään johdonmukaisesti.
- Muut julkaistut FI/EN/SV/TH-kieliparit säilyvät. Nämä neljä eivät ole julkaistun 59 lähteen / 177 parin sivurekisterissä lähtötilanteessa.
- Statuksen muuttaminen ei hyväksy tai mitätöi erikseen lukittuja ravinto/GI/GK-malleja automaattisesti; numerot pysyvät historiallisessa lähteessä, mutta eivät julkaistun draftin ruokakortilla.
- Issue #404:n #07/#30/#67 ovat käyttäjän näkyvistä vetämällä **julkaisuturvallisuuden osalta ratkaistut**, mutta reseptit eivät ole palautettuja julkaisuun eikä korjausjonoa suljeta ilman edellytettyä näyttöä. #32:n ohje korjattu lähteeseen, mutta voi edellyttää riippumatonta kokin katselmointia ennen issue-rivin lopullista sulkua.
- Tuotantodomain `www.recipavo.com` ja Cloudflare Coming Soon jätetään ennalleen.

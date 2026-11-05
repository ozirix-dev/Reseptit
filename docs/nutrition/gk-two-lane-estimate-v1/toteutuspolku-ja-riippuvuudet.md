# Vaiheistus, rinnakkaistyö ja resurssitalous

**Tässä PR:ssä vain suunnitelma.** Koska repossa on jo GK:n uusia reseptejä, GI-KB, skenaarioita, Mixed Evidence ja Recipavo-tuonti, muutokset on toteutettava pienissä, rajatuissa PR:issä eikä yhtenä massiivisena refaktorointina.

## Ehdotettu toteutusjärjestys

| Vaihe / erillinen PR | Mitä toteutetaan | Mitä nimenomaisesti ei tehdä | Portti |
| --- | --- | --- | --- |
| V0: tämä suunnitelma | Päätös rajauksesta, dokumentit, negatiivinen pizza-fixture | Ei yhtään tuotanto-GK-lukua | Review ja menetelmälinjan valinta |
| V1: estimaatin laskennallinen read-only-ydin | Reuse nutrition-mass/CHO, GI-KB adapteri, komponenttien CHO-kirjanpito, tilat, provenance-hash, lähdesoveltuvuus, CLI / ei-julkaistava JSON | Ei muutoksia nykyiseen GK80/100 Factoryyn, A-lukuihin tai sivuun | Syntettiset testit, pizza-HOLD ja 4 muuta tapausta |
| V2: kuratoitavat GI-vastineet ja hyväksyntä | Versionhallittu soveltuvuus-/koodirekisteri, riskiliput, olennaisuusarvio, menetelmäpäätös, mitkä merkinnät voidaan reusea | Ei geneeristä GI-perhekeskiarvojen automaattista hyväksyntää | 10–15 reseptin sokkoverifiointi ja päätös B-kriteereistä |
| V3: B-julkaisukytkentä pienelle pilotille | Oma publisher/adapter, julkinen 'Arvioitu GK' -teksti FI/EN/SV/TH, lähteet, status-/hakuerottelu | Ei sekoiteta A-kattavuuteen, A-suodattimiin, GK-only-variantteihin tai JSON-LD:hen | Omistajan eksplisiittinen julkaisupäätös + regressiot |
| V4: Recipavo omat reseptit | Samasta ydinlaskimesta yksityinen ennakkoarvio, yksi olennaisin tarkennuskysymys kerrallaan, muuttuneen syötteen uudelleenlaskenta | Ei yksityisiä reseptejä julkiseen GitHubiin tai kysymättä pilvipalveluun | Privacy/performance/usability-pilotti |
| V5: skaalaus ja vertailu | Kerran hyväksyttyjen soveltuvuuksien hallittu reuse 30+ reseptin erissä; 10–20 reseptin ulkoinen vertailu erillisen suunnitelman mukaan | Ei 300 ihmis-GI-testiä tai koko repositorion CI:tä jokaiselle ainekselle | Uudelleenkäyttöaste, virhe- ja peruutustilastot |

V1:n koodia ei ole vielä tässä PR:ssä. Se tehdään vasta kun rajapinta- ja menetelmäpäätös on hyväksytty. Nopein hyöty tulee **yhdestä GI-vastineen hyväksynnästä moneen reseptiin**, ei GK100:n vanhojen porttien kytkemisestä pois.

## Tiedossa olevat rajapinnat ja rinnakkaiset PR:t (tarkistettu 5.11.2026)

- PR #295: Recipavon linkki-/tekstireseptituonti. Siihen lisätään myöhemmin estimaattiytimen sovitin; nykyistä PR:ää ei muuteta.
- PR #291 ja #292: alkuperäisen 170 puuttuvan GK:n kartoitus ja kohdennetut lähteet. Näiden kattavuus tarkoittaa nykyistä A-polun GK:ta. B-kaistan arvioita ei käytetä niiden 'ratkaistu'-merkintöinä.
- PR #293: etusivun UX/Recipavo-hero, ei GK-estimaatin näyttöä tässä PR:ssä.
- PR #223: GK80-ajonohjain; ei muokata sen sääntöjä tai työjonoja tässä työssä.
- PR #100: Nutritics-evaluointi, ei mallinnettuun GK:hon tarvittava riippuvuus.
- Jo mainissa: #259 GI SQLite, #294 nelikielinen pizza, 4.11. tutkimus ja skenaariomallit. Näitä **hyödynnetään**, ei kopioida.

Avoimet PR:t ovat tarkistushetken tilannekuva; niiden haarojen HEADit ja tiedostot pitää tarkistaa uudelleen juuri ennen kunkin toteutus-PR:n mergeä. Tämän suunnitelman uudet tiedostot ovat kokonaan uudessa docs/nutrition/gk-two-lane-estimate-v1/-hakemistossa, eikä mainittuissa aktiivisissa PR:issä ollut samoja tiedostopolkuja.

## Kustannusten ja toimintavarmuuden rajat

- Käytä olemassa olevaa paikallista SQLite-lähdehakua ja Git-versionhallittua koostumusdataa; ei uutta SaaS-sopimusta, hintaa eikä API-riippuvuutta V1:ssä.
- Yksi lähdehaku/valmistusyhdistelmä kirjataan reuse-rekisteriin. Poistetaan päällekkäinen haku saman syöteversion perässä.
- Automaattinen tutkimusjono priorisoi CHO:n määrän ja puuttumisen ennakoidun vaikutuksen; 0 g varmennetusti ei vaadi GI-tutkimusta.
- Dokumentaatio-PR:lle vain Markdown/JSON-validointi ja CI:n normaali riskiperusteinen valinta, ei koko repo/testimatriisi turhaan.
- Koodivaiheen testit: ensin yksikkö-/kattavuusinvariantit, sitten pilottitulosteen staattiset testit ja viimeiseksi rajatut selaintestit, jos UI muuttuu.
- Reseptin julkaisua tai omien reseptien tallentamista ei pysäytetä GK-puutteen vuoksi. Epäonnistunut B-arvio palaa selkeästi tilaan RESEARCH_REQUIRED.
- Palautus: B-laskuri/UX erillisen feature flagin taakse; pois kytkeminen palauttaa A:n täysin ennalleen, B:n lähde-/päätöshistoria säilyy auditissa.

## Omistajan erotettavat päätökset

1. Sallitaanko B-arvio julkisessa palvelussa vai vain Recipavon henkilökohtaisessa osiossa?
2. Saako B:n kerran hyväksyttyjä GI-vastineita julkaista jatkossa automatisoidusti saman soveltuvuusavaimen piirissä, vai vaaditaanko toimituksellinen erähyväksyntä? Ehdotus: pilotissa erähyväksyntä.
3. Mikä sallittu B-poisjättö/epävarmuusraja on? Ehdotus: V1 julkinen B vaatii kaikki positiiviset olennaiset GI-osuudet ratkaistuksi; myöhempi vaikutusrajainen sääntö tarvitsee erillisen päätöksen.
4. Näytetäänkö B:n matala/keskikorkea/korkea luokka? Ehdotus: ei V1:ssä.
5. Miten peruuttaminen, lähteen päivittyminen ja automaattinen uudelleentarkistus näkyvät? Ehdotus: vanhentunut B-arvio piilotetaan, ei siirretä A:han.

Tästä PR:stä ei saa päätellä automaattista hyväksyntää näille viidelle kohdalle.

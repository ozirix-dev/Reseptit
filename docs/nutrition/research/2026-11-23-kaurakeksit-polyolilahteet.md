# Rapeiden kauralastujen polyolilähteet

Kauralastujen resepti on julkaistu neljällä kielellä. Tämä tarkistus koskee erillisen ravintolaskennan lähteitä ja jättää ravintoarvot sekä GK:n määrittämättömiksi. [Issue #652](https://github.com/ozirix-dev/Reseptit/issues/652)

## Lähteiden soveltuvuus

| Ainesosa | Uusi lähdehavainto | Soveltuvuus laskentaan |
| --- | --- | --- |
| 140 g kaurahiutaleita | Biesiekierski ym. analysoivat kuivan Uncle Toby’s Quick Oats -näytteen. HPLC-analyysissä sorbitolia ja mannitolia ei havaittu (taulukko 4). | Tulos koskee kahta yhdistettä ja yhtä tuotenäytettä. Se ei anna kokonaispolyoliarvoa reseptin Fineli #153 -lähteelle. |
| 1 tl leivinjauhetta | Natuurlijk Natuurlijkin tekninen tuoteseloste ilmoittaa Baking Powder Pure -tuotteen polyoleiksi 0 g / 100 g. Seloste kuvaa natriumvetykarbonaatin ja viinihapon seosta. | Arvo koskee nimettyä tuotetta. Nykyinen resepti käyttää yleistä leivinjauhetta ja laskenta Fineli #74 -lähdettä. Laskennan 5 g per teelusikka on muunnosarvio. |

[Kauratutkimus](https://doi.org/10.1111/j.1365-277X.2010.01139.x) · [Leivinjauheen tuoteseloste, kohta 2.4.1](https://www.natuurlijknatuurlijk.nl/data/mediablocks/Baking%20powder%20pure%20EN%202021-05-03.pdf) · [Nykyinen laskentasyöte](../calculations/kaurakeksit.json)

## Mitä tarvitaan seuraavaan laskentaan

- Kaurahiutaleille tarvitaan yhteensopiva kokonaispolyolitieto tai erikseen hyväksytty lähdemenetelmä, joka määrittää, miten määritysrajan alle jäävä tulos käsitellään. Lähteen pitää soveltua käytettyyn hiutaleeseen ja hiilihydraattimääritelmään.
- Leivinjauheelle tarvitaan nykyistä lähdettä täydentävä tieto tai reseptiin soveltuva, tunnistettu tuote, jonka koostumus ja teelusikallinen on varmennettu. Tuotekohtainen nolla koskee vain kyseistä tuotetta.
- Perusresepti jakautuu 30 lastuun. Annoskohtainen makrolaskenta tehdään vasta, kun koko erän ainesosien lähteet ja muunnokset ovat yhteensopivia.

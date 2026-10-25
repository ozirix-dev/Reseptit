# Nutriticsin ominaisuusmatriisi

Matriisi on kokeilun tarkistuslista, ei vahvistus tilin ominaisuuksista. Kokeilua ei ole aktivoitu, joten käyttöliittymän saatavuutta ei voi vielä todeta. Täydennä kokeilun havainto ja lähde jokaiselle riville.

Merkinnät: **A** = havaittu 7 päivän kokeilun käyttöliittymässä; **B** = dokumentoitu API; **C** = vaatii erillisen lisenssin tai Nutriticsin vahvistuksen; **D** = ei saatavilla tai ei vahvistettu. Ennen tilin avaamista UI-sarake on tilassa D / tarkistamatta.

| Ominaisuus | Kokeilun UI | Dokumentoitu API | Vahvistettava tai kirjattava havainto |
| --- | --- | --- | --- |
| Elintarvikehaku | D / testaa päivä 1–2 | B | Hakuparametrit, osumien järjestys ja tietueen lähde |
| Suomalaiset elintarvikkeet | D / testaa päivä 2 | C | Suomen tietokannat, Fineli Rel20:n saatavuus ja versio |
| Kansainväliset elintarvikkeet | D / testaa päivä 2 | B | Käytettävissä olevat maat ja ruokaluokat |
| Tuotemerkkien tiedot | D / testaa päivä 2 | B, kattavuus C | Suomen tuotteiden ja tuotemerkkien määrä, päivitykset ja tietuekohtainen lähde |
| Makroravintoaineet | D / testaa päivä 3 | B | Hiilihydraattien määritelmä, kuitu/polyolit, pyöristys ja annoslaskenta |
| Vitamiinit ja kivennäisaineet | D / testaa päivä 5 | B | Parametrien kattavuus ja tietuekohtaiset puuttuvat arvot |
| GI ja GK | D / testaa päivä 4 | B-kentät dokumentaatiossa; tietosisältö C | Onko mitattuja GI-arvoja, lähteet, menetelmä, asteikko ja reseptin GK:n muodostus |
| Valmistushävikki ja öljyn imeytyminen | D / testaa päivä 5 | C | Kypsennystavat löytyvät; tarkista saanto, retentio ja öljyn imeytymisen tuki erikseen |
| Allergeenit | D / testaa päivä 5 | B | Lähde, allergeenien luotettavuus ja ristiriitojen käsittely |
| Ruokavalio-ominaisuudet | D / testaa päivä 5 | B-osittain | Selvitä ruokavaliotunnisteet, perusteet ja aluekohtaiset määritelmät |
| Reseptin kustannukset | D / testaa päivä 6 | B-osittain | Kustannusten syöttö, valuutta, API-oikeus ja hinnoittelu |
| Ateriasuunnittelu | D / testaa päivä 6 | B | API-dokumentaatio mainitsee meal plan -toiminnon; tarkista kokeilulisenssi |
| Ostoslistat | D / testaa päivä 6 | D / ei vahvistettu | Käyttöliittymä, vientimuodot ja API-tuki |
| Ravintoarvomerkinnät | D / testaa päivä 6 | B-osittain | `foodlabel`-toiminnon ja EU-muodon saatavuus sekä käyttöoikeus |
| Ympäristövaikutukset | D / testaa päivä 6 | C | Foodprint-palvelu, API-yhteys, päästötietojen lähteet ja lisähinta |
| Reseptien tuonti ja vienti | D / testaa päivä 6 | B-osittain | Reseptin CREATE/API, massatuonti, ulosvienti ja sallittu tiedostomuoto |
| API-toiminnot | D / testaa päivä 6 | B | API-avain, sandbox, sallittujen kutsujen joukko, rajoitukset ja mittaus |
| Tulosten tallennus ja käyttöoikeudet | D / tarkista ehdoista | C | Tallennus, julkaisu, uudelleenkäyttö, tilauksen jälkeinen säilytys ja attribuutio |

API-sarakkeen B tarkoittaa, että toiminto tai vastaava kenttä esiintyy julkisessa API-dokumentaatiossa. Se ei tarkoita, että toiminto sisältyy kokeiluun tai että tulokset saa julkaista. API Explorerin vanhoja käyttäjätunnus/salasana-esimerkkejä ei käytetä uuden integraation mallina; vuoden 2026 muutoshistoria kertoo API-avaimista, mutta otsakkeen tarkka muoto on vahvistettava.

# GI/GK-kattavuuserä 2B2 – lähdekatselmointi

## Lähtötilanne ja menetelmä

Erä aloitettiin Reseptit-mainista `66ba0464bd0099c2318ce9b5cd1ae3ca0bd841cd`. Lähtösnapshot on [`glycemic-coverage-batch-2b2-baseline.json`](glycemic-coverage-batch-2b2-baseline.json): 325 reseptiä, joista 117 laskettiin ja 208 jäi keskeneräiseksi; GI-lähdetietueita oli 38. Reseptimäärien sekä kaikkien estoluokkien päällekkäisyydet tarkistettiin koko keskeneräisestä 208 reseptin joukosta. Valinta painotti lähteistettyjä ravintoarvoja ja määriä, estojen kokonaismäärää sekä GI:n ruoka- ja valmistustapavastaavuutta.

Yksityiskohtaiseen katselmointiin rajattiin kahdeksan reseptiä: caponata, pasta alla norma, baozi, harira, VHH-Runebergintortut, spanakopita, VHH-raparperipiirakka ja thai-jok-kanalla. Hyderabadi-kanabiryani hylättiin tarkemmasta työstä, koska sen koostumus- ja massatiedot sisältävät useita toisistaan riippumattomia puutteita. Seulonta ei muuta reseptien annosmääriä.

## Lähdearviot ja ratkaisut

| Resepti | Katselmoinnin kohde ja tulos | GK-tila erän jälkeen |
|---|---|---|
| Caponata | Kapriksen määrä 8,6 g ja AFCD-koostumus antavat konservatiivisen kokonais-hiilihydraatin ylärajan 0,10535 g/annos. Raaka kokonainen tomaatti ei vastaa säilyketomaattimurskaa, joten GI-vastaavuus poistettiin. | Keskeneräinen: kypsälle tomaattimurskalle ei löytynyt vastaavaa GI-lähdettä. |
| Pasta alla norma | Tuore basilika 20 g, AFCD: kokonais-hiilihydraatin yläraja 0,175 g/annos. Sama raakatomaatin ja säilyketomaattimurskan vastaavuus hylättiin. Valkosipulin sipulianalogi säilyy heikkona, erikseen ilmoitettuna Supplementary-tason analogiana. | Keskeneräinen: tomaatti. |
| Baozi | Tuore inkivääri 6 g: yläraja 0,114 g/annos. Kuivahiiva 7 g: USDA FoodData Centralin kokonaishiilihydraattimäärästä yläraja 0,72135 g/annos. Yhteensä soijakastikkeen muun dokumentoidun osuuden kanssa 1,54785 g/annos, alle toimituksellisen 2 g kokonaisrajan. Maissitärkkelyksen perunatuotekategorian GI ei ole kelvollinen ruoka-aineryhmävastaavuus ja poistettiin. | Keskeneräinen: maissitärkkelyksen merkittävä osuus. |
| Harira | Jauhettu inkivääri 1,8 g: AFCD:n kokonais-hiilihydraatin yläraja 0,2148 g/annos. Määrä perustuu USDA FDC:n teelusikkamassaan. | Keskeneräinen: kypsennetty tomaattimurska; raakatomaatin GI poistettiin. |
| VHH-Runebergintortut | Kardemumma 2 g: AFCD:n yläraja 0,208 g/annos. Mantelijauhon GI-vastaavuus leivonnaisten keskiarvoon ei osoita ruoka-aineryhmän kelpoisuutta ja poistettiin. | Keskeneräinen: mantelijauhon 120 g osuus. |
| Spanakopita | Filotaikina 160 g eli noin 14,9 g saatavilla olevaa hiilihydraattia annosta kohti. Pienen osuuden toleranssia ei voi soveltaa. Sydneyn yliopiston GI News kertoo, ettei filotaikinaa/pastryä ollut GI-testattu kyseisessä vastauksessa. | Keskeneräinen: filotaikinan GI. |
| VHH-raparperipiirakka | Raparperin lähteistetty määrä vastaa noin 1,72 g saatavilla olevaa hiilihydraattia annosta kohti; yksittäinen 1 g raja ylittyy. Raparperille ei keksitty GI-arvoa. | Keskeneräinen: raparperin GI. |
| Thai-jok-kanalla | Tuore inkivääri 2 g: yläraja 0,076 g/annos. Vihanneskategorian yleinen GI poistettiin. | Laskettu LOW-tasolla; muiden pienten dokumentoitujen GI-puutteiden kokonaismäärä 0,241 g/annos. |

AFCD:n kokonais-hiilihydraatti + kuitu toimii tässä vain konservatiivisena pienosuuden ylärajana; sitä ei esitetä saatavilla olevan hiilihydraatin mittaustuloksena. Laskenta säilyttää erillään varsinaisen saatavilla olevan hiilihydraatin ja ylärajan. Jokainen rajaan laskettu yksittäinen osuus on alle 1 g/annos, ja tarkasteltujen laskettujen konjireseptien yhteenlasketut pois jätetyt osuudet alittavat 2 g/annos. Toleranssi on toimituksellinen käytäntö, ei kliininen tarkkuusraja.

### Muutokset GK-arvioissa

Koko aineiston jälkeen 118/325 reseptiä on laskettu ja 207 keskeneräisiä. Yksi uusi laskenta avautui: `thai-jok-kanalla`, GK 26,47 annosta kohden, LOW. Yhtään aiemmin laskettua arviota ei poistunut tai muuttunut käyttäjälle näkyvässä vertailussa; aiemmin laskettujen GK-arvojen merkityksellinen muutos: 0. Seitsemästä muusta yksityiskohtaisesti tarkistetusta reseptistä poistettiin tai hylättiin väärä GI-vastaavuus tai osoitettiin, että merkittävä ainesosa estää laskennan odottamalla hyväksyttävää GI-lähdettä. Nämä ovat lähde- ja laatuparannuksia, eivät uusia GK-arvioita.

Koko 325 reseptin inventaario on [`glycemic-coverage-batch-2b2-current.json`](glycemic-coverage-batch-2b2-current.json) ja sen luettava yhteenveto [`glycemic-coverage-batch-2b2-current.md`](glycemic-coverage-batch-2b2-current.md). Inventaario sisältää jokaisen reseptin kerran. Erien 2A ja 2B1 historiallisia snapshotteja ei muutettu.

## Jäljellä olevat prioriteetit

Seuraavassa GK-kattavuuserässä lähdenäyttöä kannattaa hakea ensin kypsennetylle tomaattimurskalle, mantelijauholle, maissitärkkelykselle sekä filotaikinalle. Raparperin GI:n mittausrajoite ei oikeuta sivuuttamaan sen yli 1 g:n hiilihydraattiosuutta. Hyderabadi-kanabiryani kannattaa ottaa uudelleen käsittelyyn vasta, kun sen puuttuvat määrät ja yksikkömuunnokset voidaan lähteistää.

Tämä dokumentti on lähde- ja auditointiraportti. Se ei hyväksy tuotantojulkaisua eikä aloita seuraavaa erää.

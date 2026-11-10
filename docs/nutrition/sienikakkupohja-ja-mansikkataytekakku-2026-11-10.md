# Sienikakkupohja ja perinteinen mansikkatäytekakku — ravintoarvio 2026-11-10

## Tunnisteet, lähtötilanne, vastuu
- Reseptit: `sienikakkupohja` ja `perinteinen-mansikkataytekakku-sienikakkupohjalla`
- Lähtöreseptin lähdecommit: `28fb9050dcce1bacb63ff9f5815f91276e725a6e`, PR #412
- Laskenta 10.11.2026, tarkastaja: ChatGPT / laskennallinen toimituksellinen katselmointi, **ei koepaistoa, ei laboratoriomittausta**
- Määrät on otettu lähderesepteistä, paitsi dl/rkl/tl/kpl-muunnokset, jotka ovat arvioita. 10 yhtä suurta annosta per resepti.

## Raakapainot ja ravintolähteet
| Raaka-aine | Pohja g | Täytetty kakku g | Käytetty C/P/R per 100 g | Lähde |
|---|---:|---:|---|---|
| Kanamuna, kuoreton, 4 kpl | 200 | 200 | 0,3 / 12,6 / 9,2 | [Fineli-tietueen toisinto, Kananmuna kuoreton](https://www.kilokalori.net/ravinto/yleinen/kananmuna-kuoreton) |
| Hienosokeri, 2 dl | 170 | 170 | 100 / 0 / 0 | [Dansukker Suomalainen taloussokeri](https://www.dansukker.fi/fi/tuotteet/kaikki-tuotteet/suomalainen-taloussokeri) |
| Puolikarkea vehnäjauho, 3 dl | 195 | 195 | 67 / 12 / 1,6 | [Sunnuntai puolikarkea](https://www.raisiofoodsolutions.fi/tuotteet/sunnuntai-puolikarkea-vehnajauho-4kg) |
| Kiehuva vesi, 1 dl | 100 | 100 | 0 / 0 / 0 | vedessä ei makroravinteita |
| Leivinjauhe, 1½ tl | 6 | 6 | 37,8 / 5,2 / 0 | [Fineli-tietueen toisinto, leivinjauhe](https://www.kilokalori.net/ravinto/yleinen/leivinjauhe), paino noin 4 g/tl |
| Kuohukerma 35 %, 4 dl | — | 400 | 3 / 2 / 35 | [Fineli-tietueen toisinto, kerma 35 %](https://www.kilokalori.net/ravinto/yleinen/kerma-kuohukerma-rasvaa-35) |
| Vaniljasokeri, 1 rkl | — | 13 | 99 / 0 / 0 | [Meira vaniljasokeri](https://meira.fi/tuote/vaniljasokeri/), 1 rkl arvioitu sokerin tilavuuspainon mukaan |
| Mansikkahillo, 150 g | — | 150 | 43 / 0,2 / 0,1 | [Pirkka mansikkahillo 400 g](https://www.k-ruoka.fi/kauppa/tuote/pirkka-mansikkahillo-400g-6410405112873) |
| Tuore mansikka, 300 g | — | 300 | 7,7 / 0,5 / 0,3 | [Fineli-tietueen toisinto, mansikka](https://www.kilokalori.net/ravinto/yleinen/mansikka) |
| Kevytmaito 1,5 %, 0,5 dl | — | 50 | 4,8 / 3,2 / 1,5 | [Valio kevytmaito](https://www.valio.fi/tuotteet/valio-kevytmaito/) |

Muunnokset [Marttojen tilavuuspainot](https://www.martat.fi/ruoka/ruoanvalmistus/ruoka-aineiden-mitat-ja-painot/):
- 1 dl hienosokeria 85 g → 2 dl 170 g
- 1 dl puolikarkeaa vehnäjauhoa 65 g → 3 dl 195 g
- 1 dl kermaa ja maitoa oletettu noin 100 g → 4 dl 400 g ja 0,5 dl 50 g
- 4 kananmunan kuoreton sisältö 200 g (= 50 g/kpl, oletus)
- 1,5 tl leivinjauhetta noin 6 g (arvio, ei yksilöllisesti punnittu)
- 1 rkl vaniljasokeria noin 13 g (arvio); sen tarkka tilavuuspaino riippuu tuotteesta.

**C = imeytyvä hiilihydraatti (EU-merkintä), P = proteiini, R = rasva.** EU-merkinnän C sisältää sokereita ja tärkkelystä eikä siitä vähennetä kuitua uudelleen. `carbs_net_per_serving_g` on tässä sama kuin laskettu imeytyvä hiilihydraatti. `carbs_total_per_serving_g` säilytetään `null`, sillä eri määritelmän mukaista kokonaishiilihydraattia ei ole määritetty eikä pidä arvata.

## Kaava ja tulokset

Jokaiselle raaka-aineelle ja ravintotekijälle: määrä (g) × ravintosisältö / 100 g. Ainesosien osasummat lasketaan yhteen ja jaetaan 10 annoksella. Arvot kahden desimaalin tarkkuudella. Reseptit ovat raaka-ainemäärien summasta laskettuja arvioita; paistohävikki muuttaa annoksen painoa mutta ei makrojen summaa, ellei hävikkiin sisälly makroravinteita.

| Resepti | C koko resepti g | P koko resepti g | R koko resepti g | C / annos g | P / annos g | R / annos g | Energia / annos, suuntaa-antava |
|---|---:|---:|---:|---:|---:|---:|---:|
| Sienikakkupohja | 303,52 | 48,91 | 21,52 | 30,35 | 4,89 | 2,15 | noin 163 kcal |
| Perinteinen mansikkatäytekakku | 418,39 | 60,31 | 163,32 | 41,84 | 6,03 | 16,33 | noin 342 kcal |

**Epävarmuudet ja julkaisuportti:**
- Ei tuotemerkkejä lukittu varsinaiseen reseptiin. Laskenta koskee yllä nimettyä vertailutuotevalintaa. Muilla tuotteilla erityisesti hillon hiilihydraatit, kerman rasvapitoisuus ja jauhon koostumus vaihtelevat.
- Punnitut painot ovat muunnoksia; munien koko, lusikkamitat ja paistoon mahdollisesti käytetty rasva vaikuttavat. Vuoan leivinpaperointi ei vaadi lisärasvaa. Koristelun muut raaka-aineet eivät kuulu reseptiin.
- Vaniljasokerin ravintosisältö on Meiran merkintä. Punnitsematon 1 rkl/13 g vaikuttaa arvoon hieman.
- Arvio sisältää **täytteet, hillon, marjat, maidon ja kuorrutuksen** täytetylle kakulle. Sienikakkupohjan arvo koskee vain pohjaa.
- **GK:ta ei lasketa numerona.** Merkintä ”todennäköisesti korkea – ei laskettu eikä vahvistettu” on varovainen sanallinen arvio, ei lähdevahvistettu luokitus; annoskoko ja rasvan sekä täytteen vaikutus vaihtelevat. Tätä merkintää ei pidä syöttää numeeriseksi GK-arvoksi.
- Julkaisuun tarvitaan edelleen oma, annosta vastaava WebP-kuva, käännös- ja laatutarkistus sekä uuden PR HEAD:n CI. Tämä laskentamuistio ei yksin myönnä julkaisulupaa.

# C5 – nykyinen mustapaputuote, valutusperusta ja julkaisupäätös 11.11.2026

## Tarkistettu tilanne
- PR #472 yhdistettiin `main`-haaraan: olemassa olevan huevos divorciadosin **FI-valmistusohje korjattu**. Uuden V2-version ravintoarvoja tai GK:ta ei julkaistu.
- [GoGreenin nykyinen italialainen mustapapu](https://www.gogreen.fi/tuotteet/mustapavut/), EAN **7310130009839**: valmistajan ravintoarvot 14 g hiilihydraattia, 7,4 g proteiinia, 0,8 g rasvaa ja 10 g kuitua /100 g. Pakkaus 380 g / valutettu paino 230 g. [K-Ruoka](https://www.k-ruoka.fi/kauppa/tuote/gogreen-mustapavut-380230g-7310130009839) luokittelee ravintoarvoperustan **100 g tuote myyntihetkellä**.
- Historiallinen ruotsalainen GoGreen **7310130009785**: 8,5 g hiilihydraattia/100 g (eri EAN ja eri valmistusmaa), [K-Ruoka](https://www.k-ruoka.fi/kauppa/tuote/gogreen-mustapavut-380230g-ruotsal-7310130009785). **Ei saa periä vanhan EANin ravintoarvoja uuteen purkkiin.**
- Uusi vaihtoehto [Bonduelle 400 g / 265 g](https://www.k-ruoka.fi/kauppa/tuote/bonduelle-mustat-pavut-400265g-3083681192513), EAN **3083681192513**, hiilihydraatti 13 g, proteiini 7,3 g ja rasva 1,1 g/100 g, merkintä **myyntitilassa**. Tämä ei ole sama kuin aiemmin analysoitu Bonduelle 200/130 g EAN 3083681132496.
- [Euroopan komission kuluttajatietolainsäädännön ohje](https://europa.eu/youreurope/business/product-rules-compliance/food/nutrition-declaration/index_en.htm) muistuttaa, että ravintoarvot koskevat lähtökohtaisesti tuotetta sellaisena kuin sitä myydään, ellei valmistetusta tuotteesta ilmoiteta erikseen. Näin ollen **230/380 ei ole ravintoaineiden muuntokerroin**, eikä etikettiarvoja saa yhdistää huomaamatta **150 g valutettuun syötävään massaan**.

## Koneelliset tarkistukset
- `site/scripts/c5-huevos-drained-basis-gate.ts`: kolme erillistä EAN-yksilöityä tuotevaihtoehtoa, 150 g syötävän papumassan **vastaoletuslaskelma**, nimenomaiset `drainedBasisConfirmed:false`, `approvedNutrition:null`, `approvedGk:null`, `releaseAuthorized:false`.
- `site/tests/c5-huevos-drained-basis-gate.test.ts`: testaa EANien identiteetin, numeeriset erot, öljyn 0–100 % retentiovälin, tuntemattoman kuidun/GK:n ja sen, että julkaisematon V2 pysyy poissa katalogista.
- Kaava per annos: `SUM(ainesosan massa g × koostumus per100g /100) / 2`. Munat 110 g kuoretonta (aiempi Fineli 858), tomaatti 120 g (Fineli-perustainen tietue, virallinen ID vahvistamatta), vihreä La Costeña -salsa 150 g, öljy 13,5 g. Nämä ainesmassat ja 100 g:n perusarvot ovat **skenaarioita**, eivät toteutettu koepaisto. Varsinaisen tomaatin Fineli-ID ja salsapakkauksen kuitu säilyvät HOLDissa.

| Tuote 150 g papuja/2 annosta – **vain oletuksella että etiketin myyntitilan luvut pätevät valutettuun massaan** | HH g/annos | P g/annos | Rasva g/annos, öljyn 0–100 % |
|---|---:|---:|---:|
| GoGreen Italia EAN 7310130009839 | 15,66 | 13,49 | 6,54–13,28 |
| GoGreen Ruotsi EAN 7310130009785 | 11,54 | 13,57 | 6,76–13,51 |
| Bonduelle 400/265 EAN 3083681192513 | 14,91 | 13,42 | 6,76–13,51 |

**Älä julkaise näitä makroina**. Laskennan numeerinen ero on osoitus tuoteidentiteetin merkityksestä eikä anna lupaa nollata kuidun epävarmuutta tai GK-estettä. Kun valmistaja vahvistaa ravintoarvon **valutettuna, huuhdeltuna ja syötävänä per100g**, voidaan uuteen täsmäsyötteeseen perustuva itsenäinen arvokatselmointi ja GI/GK-erillispäätös tehdä.

## Mitä voidaan julkaista nyt ja mitä ei
- **Jo julkaistavassa versiossa (PR #472):** suomenkielinen selkeä valmistusohje; sama historiallinen resepti-ID, alkuperäinen aineslista ja kuvitus. Tämä ei ole uusi resepti eikä uudet ravintoarvot.
- **Ei vielä:** uusi V2 ravintoarvoineen, GK tai toinen samalla ruokalajilla kilpaileva resepti. Juuri tässä korjauksessa tuotteiden tulkinta on nyt koneellisesti estetty sekoittumasta.
- Julkinen Pages-deploy tarkistettava erikseen merge-SHA:n jälkeen. CI:n PR-build PASS ei yksin todista HTML:n julkista saatavuutta.

### Jäljellä oleva kova este
Tarvitaan käytettävän EANin valmistajan nimenomainen vastaus: koskeeko per100g ravintoarvo **valutettuja** papuja, ja mikä on mahdollisen huuhtelun vaikutus. Ilman tätä makrot/ kuitu/ GK pidetään HOLDissa. Erillisenä avoimena asiana tulee salsan kuitu ja tomaatin tietue-ID. Tämä ei ole syy estää jo hyväksytyn julkisen valmistusohjeen käyttöä.

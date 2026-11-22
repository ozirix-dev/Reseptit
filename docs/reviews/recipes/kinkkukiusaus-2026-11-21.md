# Kinkkukiusaus — toimituksellinen tarkistus 21.11.2026

- **Tila:** Draft, EI julkaisuvalmis ilman loppukatselmointia.
- **Vertailulähde:** https://www.k-ruoka.fi/reseptit/kinkkukiusaus
- **Mitat:** 1000 g pakasteperunasuikaleita, 250 g kypsää savukinkkua, 150 g sipulia, 400 g ruokakermaa; 6 annosta. Nämä ovat Recipavolle laaditut määrät, eivät suora kopio lähteestä.
- **Kypsennys:** 225 °C 30 min, 200 °C 35–40 min, perunoiden pehmeys varmistetaan ennen tarjoamista. 2,5 litran vuoka on arvio; tarkista käytännössä riittävä koko, tarvittaessa käytä suurempaa.
- **Allergeenit:** maito; kinkun pakkausmerkinnät tarkistettava. Gluteenittomuus ei ole hyväksytty väite.
- **Ravintoarvot ja GK:** ei laskettu, eikä nolla-arvoja esitetä.
- **Kuva:** tekoälyn tuottama uusi annoskuva, erillinen julkaisun kuvatarkistus ennen Ready-tilaa.
- **Käännökset:** FI/EN/SV/TH ovat luonnoksia, määrät ja ajat yhdensuuntaiset; merkitysvertailu ja rekisterikuittaus ennen julkaisua.
- **Avoinna:** käytännön annos-/vuokakokovarmistus, tarkistajan hyväksyntä, tarvittaessa ravintolaskelma, statusmuutos ja CI.

## Riippumaton lähteiden vertailu, 21.11.2026 (vain kirjallinen tarkistus)

- K-Ruoan vertailuohje on luettavissa: https://www.k-ruoka.fi/reseptit/kinkkukiusaus. Siinä on 1000 g pakasteperunasuikaleita, 200 g kypsää kinkkua, 200 g sipulia ja 400 ml kermaa viidelle annokselle. Recipavo-versiossa käytetään samoja perunoita mutta 250 g kinkkua ja 150 g sipulia kuuteen annokseen; ravintosisältöä ei voi kopioida vertailuohjeesta.
- Lämpötilat 225 °C / 30 min ja 200 °C / 35–40 min ovat käytännön ohjeen kanssa linjassa. Lopullinen kypsyys ratkaistaan perunoiden pehmeyden, ei vain kellon perusteella.
- Kuvan WebP ja kieliversiot on tallennettu samaan PR:ään. Neljän kielen ainesmäärien, yksiköiden, vaiheiden määrän ja kuvaosoitteen rakenne on verrattu; varsinainen käännösten merkitys- ja sujuvuustarkistus on kesken.
- **HOLD ennen julkaisua:** 2,5 litran vuoan soveltuvuus, valittavan kinkun tuoteseloste (allergeenit), täsmäversioon sidottu ravintolaskennan näyttö ja riippumaton toimituksellinen hyväksyntä. Fyysistä kokkikokeilua ei ole tehty. Cloudflare-julkaisun selvitys kuuluu erilliseen työhön; tämän PR:n ei pidä laukaista julkaisemista.
- Julkaisun virallisen hyväksyntärekisterin tila on edelleen `decision: hold`. Tätä kirjallista vertailua ei pidä merkitä koekeittiötestiksi.

## Chat 3:n rajattu katselmointi 22.11.2026

K-Ruoan [kinkkukiusaus](https://www.k-ruoka.fi/reseptit/kinkkukiusaus) tukee pakasteperunasuikaleiden, kypsän savukinkun, sipulin ja 15 % ruokakerman kaksivaiheista uunikypsennystä. Tämä ei todista Recipavon punnittuja määriä tai fyysistä valmistustulosta. Lähtöainesten massa 1815 g, kuudelle laskennallisesti noin 302,5 g ennen haihtumaa. Vähintään 3 litran vuoka jättää täytteelle tilaa aiemman 2,5 litran sijasta; pehmeys tarkistetaan perunoista. Paisto 65–70 min, lepo 10 min, kokonaisajan arviona 95 min. Maitoallergeeni ja pakkausmerkinnät, tarvittaessa nopea jäähdytys ja alle +6 °C kylmäsäilytys kirjattu neljällä kielellä.

**Rajattu hyväksyntä:** ingredients/method/food_safety/servings_and_time/duplicates `pass`, glycemic `unavailable`. Ainesosakohtaiset ja valmiin uuniruoan ravintoarvot eivät ole hyväksyttyjä; `nutrition: pending`, `decision: hold`, kuvan lopullinen ja riippumaton käännöskatselmointi avoinna. Ei fyysistä keittiökoetta, eikä tätä saa väittää sellaiseksi.

## Chat-3: ravintokandidaatin aritmetiikan lisätarkistus 22.11.2026

- Lähde `docs/nutrition/candidates/kinkkukiusaus-2026-11-21.json` on ei-julkinen laskentaehdokas, ei hyväksytty julkaisuainesto. Vertailin rivien grammapainot × lähteeseen kirjatut 100 g:n arvot ja annoskohtaiset summat. Seitsemän rivin tallennettujen makropanosten laskuissa ei havaittu yli 0,0011 g:n eroja.
- **Katettujen rivien annoskohtaiset osasummat:** Hiilihydraatit 29,173 g, proteiini 12,626 g, rasva 12,819 g. Näitä ei saa kopioida reseptin julkaistaviksi ravintoarvoiksi.
- **Ratkaisematta:** Mustapippurin kuitu- ja polyolitiedot puuttuvat. Kinkun ja pakasteperunasuikaleiden tuote-/tuottajakohtaiset koostumukset ovat proxyjä. Ainesosan puuttuvia komponentteja ei saa merkitä nolliksi: kuidun tunnettu osasumma ja polyolien numeerinen osasumma eivät ole koko annoksen luvut.
- **Jatko:** varmennetaan tuotekohtaiset koostumuslähteet, täydet ravintokomponentit ja tarvittava saanto-/retentio; vasta hyväksytyn koko reseptin laskennan jälkeen voidaan arvioida `nutrition: pending`-tilaa uudelleen. `decision: hold`, Draft sekä riippumattomat kieli-/kuvajulkaisuportit säilyvät. Tarkistus todistaa vain laskentaehdokkaan sisäisen aritmetiikan, ei sen raakadatapohjan oikeellisuutta.

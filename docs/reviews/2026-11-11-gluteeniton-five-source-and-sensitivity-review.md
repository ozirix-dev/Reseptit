# Gluteenittomien viiden reseptin riippumaton lähde- ja herkkyyskatselmointi — 11.11.2026

PR #422, reseptit vain `draft`, ei julkaisu- tai gluteenittomuushyväksyntää. Katselmoija: ChatGPT. Tarkistuksen lähtöcommit `b851780177a8930d5a3773c375ed6f99977be917`. Aiempi laskentamuistio: [gluteenittomat-5-tuote-evidenssi](../nutrition/gluteenittomat-5-tuote-evidenssi-2026-11-11.md). Tämä raportti täydentää sitä: tarkoituksena on löytää virheelliset tuotemerkkioletukset, eräkohtaisten punnitusten puute ja mahdolliset perusteettomat turvallisuusväitteet.

## Ulkoisten lähteiden varmennus

| Tarkastettava aine | Julkinen lähde ja havainto | Päätös |
|---|---|---|
| Virtasalmen Viljatuote gluteeniton durrajauhoseos, 500 g | [Valmistaja](https://www.virtasalmenviljatuote.fi/tuote/gluteeniton-durrajauhoseos-500g/): 70 % durraa, loput perunajauho, tapiokatärkkelys, psyllium; gluteeniton merkki FI-004-049; 1 dl noin 65 g; C 70,6, P 7,4, R 2,6 g/100 g. [Jälleenmyyjä EAN 6430041081623](https://www.s-kaupat.fi/tuote/virtasalmen-viljatuote-gluteeniton-durrajauhoseos-500g/6430041081623) vahvistaa koostumuksen. | **TUOTE JA MASSA LÄHDETASOLLA VARMENNETTU** – pizzaerän toimivuus silti tarkistettava. |
| Myllärin gluteeniton kaurajauho 950 g | [Valmistaja](https://myllarin.fi/tuotteet/myllarin-gluteeniton-kaurajauho-950-g/): gluteeniton täysjyväkaura, C 58, P 14, R 6,5 g/100 g. | **TUOTTEEN KOOSTUMUS VARMENNETTU**; 2 dl:n todellinen punnittu paino puuttuu. |
| Pirkka vaalea gluteeniton jauhoseos EAN 6410405221858 | [K-Ruoka](https://www.k-ruoka.fi/kauppa/tuote/pirkka-vaalea-jauhoseos-1kg-gluteeniton-6410405221858): tämän yksilöidyn version tuotekuvauksen mukaan sekä gluteeniton että vehnätön. Varoittava ero vanhempiin Pirkka-seoksiin, joissa voi olla gluteenitonta vehnätärkkelystä. [Riippumaton kotikeittiön kahden mittauksen vertailu](https://viimeistamuruamyoten.com/gluteenittomat-jauhoseokset-testissa-osa-1-piirakkapohja-muffinit/) kertoo Pirkka-seoksen arvoksi noin 65 g/dl (ei välttämättä sama tuote-erä/versio), kun PR:n makroarviossa käytetään 60 g/dl. | **TUOTE SOVELTUVA, GRAMMAPAINO YHÄ ARVIO**; tunniste/ainesosaluettelo varmistettava pakkauksesta, mittaus ei yksin lukitse erää. |
| Pirkka tumma gluteeniton jauhoseos EAN 6410405221872 | [Keliakialiitto jauhoseoslistaus](https://www.keliakialiitto.fi/gluteenittomuus/gluteenittomat-tuotteet/listauksia/viljat-jauhot-ja-jauhoseokset/) ja [tuotteen koostumus](https://www.glu.fi/tuotteet/gluteeniton/Pirkka%2Btumma%2Bgluteeniton%2Bjauhoseos%2B1kg/1526/): gluteeniton, tuotekuvaus vehnätön, C 70, P 7, R 4,3 g/100 g. | **KOOSTUMUS TODENNETTU JULKISISTA TUOTETIEDOISTA**, 60 g/dl ei vahvistettu tuotekohtaisella mittauksella. |
| Meira leivinjauhe EAN 6414200210055 | [Valmistaja](https://meira.fi/tuote/leivinjauhe/): nostatusaineet E450i/E500, E330 ja maissitärkkelys; [S-kaupat](https://www.s-kaupat.fi/tuote/meira-leivinjauhe-50g/6414200210055) listaa vain Avainlippu-merkin, [Fiksuruoka](https://www.fiksuruoka.fi/product/24313/meira-leivinjauhe-50g) ilmoittaa gluteeniton. | **GLUTEENITTOMUUSPAKKAUSMERKINTÄ JÄI RISTIRIITAISEN JULKISEN TIEDON VARAAN**. Reseptissä käytettyä ilmausta “gluteenittomaksi merkittyä Meira-leivinjauhetta” ei ole vahvistettu valmistajan virallisella pakkauksen gluteeniton-merkinnällä. Ennen `gluten_free: true`-merkintää tarkista todellinen pakkaus tai vaihda nimenomaisesti varmennettuun vaihtoehtoon ja päivitä ravintoarvio. |
| Sunnuntai kuivahiiva, 11 g pussi | [Valmistaja](https://sunnuntai.fi/tuotteet/sunnuntai-kuivahiiva/): hiiva ja kasviperäinen E491, pussin määrä 11 g. [Raision vanha tuotekuvasto](https://www.raisiofoodsolutions.fi/hubfs/Raisio%20VK-kuvasto%209-12_2024_web.pdf) käyttää G=gluteeniton-tunnusta, mutta ajantasainen pakkaus on silti tarkistettava. | **MÄÄRÄ JA TUOTTEEN RAAKA-AINEET VARMENNETTU**, eräkohtainen turvallisuus avoin. |

## Herkkyyslaskelmat – miksi lopullisia makroja ei vielä hyväksytä

Lähtöarvot ovat PR #422:n nykyiset *laskennalliset arviot*, eivät mitatut arvot. Eri jauhoseoksen tiiviys vaikuttaa sekä makroihin että taikinan rakenteeseen.

- **Siemen-vuokaleipä:** Pirkka vaaleaa 3,5 dl × 60 g/dl = 210 g. Jos sama todellinen seos painaisikin 65 g/dl, jauhoa tulisi 227,5 g. Sen C 75 g/100 g nostaisi imeytyvää hiilihydraattia **13,125 g koko leivässä = noin +1,09 g/viipale** nykyiseen 27,45 g/viipaleen arvioon nähden (28,54 g/viipale). Tätä ei automaattisesti kirjoiteta julkaistavaksi numeroksi ilman samaa tuote-erää koskevaa mittausta.
- **Vuokaleivän tumma Pirkka 3 dl:** jos 60 g/dl oletus poikkeaa todellisesta 10 g/dl, C 70 g/100 g tekee eroksi **±1,75 g hiilihydraattia/viipale** 12 viipaleessa. Molempien jauhoseosten painovirheet voivat kasaantua.
- **Kauralesesämpylät:** tummaa Pirkkaa 2 dl, mahdollinen 10 g/dl heitto = 20 g seosta ja C 70 g/100 g → **±0,88 g/sämpylä**, kun annoksia on 16.
- **Uunipannukakku:** tummaa Pirkkaa 1,5 dl, mahdollinen 10 g/dl heitto = 15 g ja C 70 g/100 g → **±0,81 g/annos**, kun annoksia on 13. Marjat ja kuorrutus kuuluvat jo ravintoarvoon, eivät ole laskennasta pois.
- **Durra-tomaatti-mozzarellapizza:** paperin voiteluun lisätyt 2 rkl öljyä on laskettu kokonaan syödyiksi. Jos siitä 27 g jäisi paperiin, rasvan todellinen määrä olisi **noin 6,75 g vähemmän/annos** neljään jaetussa pizzassa. Käytetyn öljyn todellinen imeytyminen arvioitava ennen lopullista ravintohyväksyntää.

Nämä ovat **laskelman herkkyysesimerkkejä**, eivät tieteellisiä epävarmuusvälejä. Tuotteen vaihtaminen tai jauhoseoksen määrän muuttaminen voi lisäksi muuttaa leivonnaisen toimivuutta.

## Gluteeniton-väitteen portti

[Keliakialiiton lainsäädäntöohje](https://www.keliakialiitto.fi/ammattilaiset/ravitsemisala/gluteenittoman-ruoan-valmistus-tarjoilu/gluteenittomuus-ja-lainsaadanto/) ja [Ruokaviraston ristikontaminaatio-ohje](https://www.ruokavirasto.fi/elintarvikkeet/elintarvikeala/hygieeninen-toiminta/ristikontaminaatio/) erottavat reseptin ainesosien sopivuuden toteutuneen annoksen turvallisuudesta. Gluteeniton-väitteen raja on 20 mg/kg valmista ruokaa. Reseptin metatieto ei ole valmistetun annoksen laboratoriomittaus eikä sertifikaatti.

**Julkaisupäätökset:** Älä merkitse yhtäkään viidestä reseptistä `gluten_free: true`-tilaan pelkän tämän asiakirjan perusteella. Tarkista erityisesti Meiran leivinjauheen käytetyn pakkauksen merkintä tai lukitse gluteeniton vaihtoehto, Pirkka-jauhovaaka/paketti, Schär Pofiberin käyttämä erä, työvälineiden puhtaus sekä pizzan öljyn imeytyminen. Säilytä viisi `draft`-tiedostoa ja kuvat versionoituina; erillistä FI-julkaisu-PR:ää ei vielä hyväksytä.

## Suositeltu rajattu eteneminen

1. **Perunajauhokakkupohja** ja **durrapizza** ovat tuote- ja menetelmätarkastuksen näkökulmasta lähimpänä julkaisua; niille tarvitaan kuitenkin nimenomaiset lopulliset valmistus- ja pakkausmerkintäpäätökset.
2. **Uunipannukakku** seuraavaksi; lukitse Pirkka tumman jauhoseoksen massa ja kuorrutuksen valmisteet.
3. **Kauralesesämpylät ja siemen-vuokaleipä** viimeisenä: hiiva, psyllium, perunakuitu ja useiden jauhoseosten sitovuus vaativat tarkemman tuotevertailun.

Ei uutta massajaksoa ennen tätä rajattua viiden erää.

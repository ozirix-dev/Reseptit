# Liha-perunasoselaatikko – toimituksellinen katselmointi

21.11.2026 · DRAFT

Vertailulähteet: https://www.k-ruoka.fi/reseptit/liha-perunasoselaatikko ja https://www.valio.fi/reseptit/liha-perunasoselaatikko/

Oma punnittu muunnelma: 6 annosta, perunaa 1000 g, naudan jauhelihaa 450 g, maitoa 250 g. Kypsennys 200 °C 25–30 min perunoiden esikeiton jälkeen. Ei kopioitua ohjetekstiä.

Allergeeni maito; naudan jauheliha kypsennetään täysin. Neljä kieliluonnosta ja AI-havainnekuva 960 x 746. Ei omaa kokkivarmistusta, ravintolaskentaa, GK-arviota eikä gluteenittomuuden hyväksyntää. Ennen julkaisua sisältö- ja kielikatselmointi, kuva-arvio, hyväksyntärekisteri ja CI sekä tilan nosto.

## Riippumaton lähdevertailu, 21.11.2026 (kirjallinen)

- Vertailuohjeet löytyivät: https://www.k-ruoka.fi/reseptit/liha-perunasoselaatikko ja https://www.valio.fi/reseptit/liha-perunasoselaatikko/. K-Ruoan version perunamäärä on 1,5 kg ja naudan jauhelihaa 400 g; Valion versiossa on 1 kg perunoita, 400 g jauhelihaa, 4 dl maitoa sekä 2 kananmunaa soseessa. Recipavo käyttää 1 kg kuorittuja perunoita, 450 g jauhelihaa ja 250 g maitoa mutta **ei munia**.
- Valmistuksen vaiheistus on itsenäinen: perunoiden keittäminen, sose, kokonaan kypsennetty jauheliha ja sipuli, kerrostus sekä 200 °C / 25–30 min uunissa. Molemmat vertailulähteet tukevat rakennetta, mutta kyseessä ei ole kummankaan täsmäresepti.
- Nelikielisten ainesmäärien, yksiköiden, ohjeaskelten lukumäärän ja kuvan polun rakenne on tarkistettu. Täydellinen merkityskatselmointi ja tarvittavat hyväksyntämerkinnät puuttuvat edelleen.
- **HOLD:** erityisesti 250 g maidon riittävyys 1 kg:n soseeseen sekä kerrosvuoan koko ja koostumus vahvistettava. Tuotekohtaiset ravintoarvot, allekirjoitettu katselmointi ja mahdolliset allergeenimerkinnät tarkistettava. Fyysistä kokkikokeilua ei ole tehty.
- Virallinen julkaisuportti pysyy `decision: hold`. Cloudflare ei ole tämän PR:n ratkottavana.

## Chat-3:n rajattu lähde- ja annoskatselmointi 22.11.2026

K-Ruoan [liha-perunasoselaatikko](https://www.k-ruoka.fi/reseptit/liha-perunasoselaatikko) ja Valion [muunnelma](https://www.valio.fi/reseptit/liha-perunasoselaatikko/) tukevat esikeitetyn perunan, kypsän jauhelihan ja kerrostetun uunivuoan menetelmää. Valion ohjeessa on lisäksi kananmunaa, jota Recipavon versiossa ei ole. Recipavon 1000 g kuorittuja perunoita, 450 g 17% naudan jauhelihaa ja 250 g 1,5% kevytmaitoa ovat punnittua omaa muunnelmaa. Raaka-aineiden massa yhteensä **1867 g**, kuusi noin **311 g** laskennallista annosta ennen hävikkiä. Vähintään 3 litran vuoka ja täysin kypsän jauhelihan varmistaminen tukevat menetelmää. Ylijäämän nopea jäähdytys ja alle +6 °C säilytys kirjattu.

Rajatut katselmoinnit `ingredients/method/food_safety/servings_and_time/duplicates: pass`, `glycemic: unavailable`, **`nutrition: pending`**, `decision: hold`. Lähteet eivät todista Recipavon oman version fyysistä valmistusta, valmiin annoksen ravintoarvoja tai kuvan/käännösten riippumatonta hyväksyntää.

## Chat-3: ravintokandidaatin aritmetiikan lisätarkistus 22.11.2026

- Lähde `docs/nutrition/candidates/liha-perunasoselaatikko-2026-11-21.json` on ei-julkinen laskentaehdokas, ei hyväksytty julkaisuainesto. Vertailin rivien grammapainot × lähteeseen kirjatut 100 g:n arvot ja annoskohtaiset summat. Seitsemän rivin tallennettujen makropanosten laskuissa ei havaittu yli 0,0011 g:n eroja.
- **Katettujen rivien annoskohtaiset osasummat:** Hiilihydraatit 28,911 g, proteiini 19,036 g, rasva 18,972 g. Näitä ei saa kopioida reseptin julkaistaviksi ravintoarvoiksi.
- **Ratkaisematta:** Mustapippurin kuitu- ja polyolitiedot puuttuvat. Jauhelihan tuotekohtainen rasvaprosentti, perunan kuorinta-/kypsyysmuutokset ja saanto ovat vielä varmistettavia. Ainesosan puuttuvia komponentteja ei saa merkitä nolliksi: kuidun tunnettu osasumma ja polyolien numeerinen osasumma eivät ole koko annoksen luvut.
- **Jatko:** varmennetaan tuotekohtaiset koostumuslähteet, täydet ravintokomponentit ja tarvittava saanto-/retentio; vasta hyväksytyn koko reseptin laskennan jälkeen voidaan arvioida `nutrition: pending`-tilaa uudelleen. `decision: hold`, Draft sekä riippumattomat kieli-/kuvajulkaisuportit säilyvät. Tarkistus todistaa vain laskentaehdokkaan sisäisen aritmetiikan, ei sen raakadatapohjan oikeellisuutta.

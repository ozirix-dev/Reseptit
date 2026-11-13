# Recipavo: viiden karanteenireseptin punnitut V2-koeehdokkaat (13.11.2026)

## Rajaus ja rinnakkaistyön suojaus

Tämä on #404:n 21 karanteenireseptin **ensimmäinen viiden FI-kohteen pelastusvaihe**. Tarkoituksena on tehdä korjattavissa olevasta reseptistä valmistuskelpoisuuden arviointiin sopiva uusi ja punnittu työversio. Tässä PR:ssä ei julkaista yhtään reseptiä eikä väitetä riippumatonta ravinto-, GI/GK-, koekeittiö- tai kielihyväksyntää.

**Omistetut tiedostot:** vain alla nimetyt viisi erillistä raakiletta ja tämä raportti. Tämä haara ei muuta `reseptit/aamupalat/`-alkuperäisiä, käännöksiä, ravintolaskelmia, julkaisukaranteenia, GK100/GK149-historiaa, CI-ajoja eikä Cloudflare-siirtoa. Rinnakkaiset PR #533 (GI/GK-arkkitehtuuriauditointi) ja PR #534 (60 aiemman reseptin kielikatselmointi) eivät omista näitä polkuja. Älä lähetä samaa viiden kohteen työjonoa Codexille.

## Tunnukset ja täsmällinen vanha lähde

| Alkuperäinen recipe_id | Main-lähtötilan Git blob SHA | Uusi erillinen FI-draft | Keskeinen muutos |
| --- | --- | --- | --- |
| `pohjoisafrikkalainen-maakouda` | `34574856132b429713948701c718b25dcd12776d` | `reseptit/raakileet/pohjoisafrikkalainen-maakouda-punnittu-v2.md` | "1 kpl peruna" -> 250 g kuorittuna; munan määrä 1 kpl; omat kypsennysvaiheet |
| `intialainen-aloo-paratha` | `9ed1496a047c04668a6b219a99e22feb9146c721` | `reseptit/raakileet/intialainen-aloo-paratha-punnittu-v2.md` | peruna keitetään, suljetaan taikinaan; 60 g jogurttia on ainesluettelossa |
| `valimerellinen-kikherne-yrttiaamiainen` | `33923cc854eabc27c7905db024c3b2e7d9ca44ab` | `reseptit/raakileet/valimerellinen-kikherne-yrttiaamiainen-punnittu-v2.md` | kikherne kuiva/kypsä määritelty, kurkku 150 g, lisätty kaksi munaa ja 10 g öljyä |
| `valimerellinen-appelsiini-aamiaiskakku` | `8bd991e2ae73d894233abfd3caf76d48315a7088` | `reseptit/raakileet/valimerellinen-appelsiini-aamiaiskakku-punnittu-v2.md` | oikea kakun sidonta/kohotus, 4 annosta, 175 °C ja määritetyt lisäainekset |
| `kiinalainen-bao-munalla` | `7865e9409880638b8fe5bdeacbcb5ae2c1d356a2` | `reseptit/raakileet/kiinalainen-bao-munalla-punnittu-v2.md` | 55 ml vettä, 2 g hiivaa, kohotus/höyrytys ja punnittu hoisin/kurkku |

Nämä ovat **uusia reseptiversioita**, eivät todistuksia historiallisten määrien oikeellisuudesta. Koska kaikki ovat `reseptit/raakileet/`-kansiossa ja `status: draft`, ne eivät kuulu julkisten reittien rakentamiseen. Alkuperäisten tunnusten 21 julkista karanteenia pysyvät päällä.

## Lähdevertailu ja kulinaarinen perustelu

- Maakouda: Asif / Dialna, https://asif.org/en/recipes/maakuda/ sekä vertailuesimerkki https://forkin.io/recipes/maakouda-moroccan-potato-fritters . Punnittu keitetty peruna, mausteet ja sidonta, ei vanhan kappalemäärän arvaamista.
- Aloo paratha: King Arthur Baking, https://www.kingarthurbaking.com/recipes/aloo-paratha-spiced-potato-stuffed-flatbread-recipe . Peruna kypsennetään ja suljetaan taikinaan; jogurtti on vertailuohjeessa valinnainen tarjoilulisuke. Tässä koeehdokkaassa siitä tehdään mitattu mukana syötävä lisä.
- Kikherne-yrttikulho: University of Kentucky, https://foodashealthalliance.mgcafe.uky.edu/sites/foodashealthalliance.ca.uky.edu/files/Chickpea%20Salad_0.pdf . Kypsät valutetut kikherneet ja punnittu sitruuna-/öljykastike. Tässä omassa aamiaismuunnelmassa käytetään lisäksi läpikypsiä munia.
- Appelsiinikakku: King Arthur Baking, https://www.kingarthurbaking.com/recipes/orange-and-greek-yogurt-cake-recipe . Kakkutaikina tarvitsee oikean munan, nostatusaineen ja uunivaiheen. Uusi koetaikina ei kopioi lähteen mittasuhteita eikä ole fyysisesti testattu.
- Bao: Good Food, https://www.bbcgoodfood.com/recipes/steamed-bao-buns ja Wolf Ovens https://www.subzero-wolf.com/owners/recipes/steamed-bao-buns . Hiivataikinan veden, kohotuksen ja höyrytyksen tulee olla määritelty. Yksilöity hoisin-tuote: https://www.aasiamarket.fi/tuote/hoisin-sauce-fi99/ (Lee Kum Kee 397 g, UPC 078895700022); kuitu ja polyolit yhä selvittämättä.

Ulkoiset reseptit auttavat arvioimaan rakennetta, mutta niiden arvoilla ei korvata omia tuotekohtaisia ravintoarvoja.

## Ennen varsinaista julkaisua – hyväksyntäehdot

1. **Mekaaninen:** varmista kunkin ehdokkaan YAML-frontmatter `recipeFrontmatterSchema`-säännöillä, punnittujen määrien ja työvaiheiden vastaavuus sekä valmiiksi keitetty / raaka / valutettu -tuotemuodot.
2. **Keittiökelpoisuus:** käy läpi muotoilu, paisto-/höyrytysaika, munan kypsyys, allergeenit, annostuotto ja ainemuutokset. Fyysistä koepaistoa ei väitetä; dokumentoitu työpöytäkatselmointi erotetaan todellisesta kokeesta.
3. **Ravinto:** nimeä täsmälliset Fineli- tai muut tuotetietueet kaikille uusille syötäville määrille. Laske neljä makroa riippumattomalla tarkistuksella, arvioi öljyn imeytyminen eikä oleteta että kaikki pannulle mennyt päätyy annokseen. Ei vanhoja makroja uuden reseptin kanssa.
4. **GI/GK:** arvioi uuden täsmällisen version hiilihydraattiyksiköt ja GI-todisteet. Jos GI-tieto ei riitä, merkitse `GK: ei määritetty`, älä nollaa, ryhmäanalogisoi tai muuta vanhoja GK100-historiasinettejä. Varmista, että julkaisuportti hyväksyy tämän nimenomaisen disposition.
5. **FI-lähteeseen palautus:** vasta hyväksynnän jälkeen tee erillinen, tarkkaan Git-blob-SHA:han sidottu source-migration PR alkuperäistä `recipe_id`-tunnusta varten. Päivitä lähteen kuva ja mahdolliset alkuperäisen lähteen numerot vasta hyväksytyn version perusteella; pidä historiallinen GK erillisenä.
6. **i18n:** tee EN/SV/TH-merkitysvastaavuus ennen nelikielistä julkaisua. Karanteenin poisto sallitaan vasta kun kaikki portit, PR:n exact-HEAD CI sekä mainin build/deploy ja julkiset FI/EN/SV/TH-reitit on tarkistettu.

## Seuranta

- 21 karanteenissa työn alussa; 5 uutta FI-draftia eivät vähennä karanteenimäärää.
- Vaihe 2: 7 taikina-/menetelmätapausta (bánh bao, roti canai, msemen, pesarattu, laksa lemak, kuih seri muka, idli).
- Vaihe 3: 7 vaativaa tuote-/ravintotapausta (nasi goreng, yaki-onigiri, xôi, lontong sayur, miso-tofu-paksoi, mandu-keitto, saltfish-fritterit).
- Vaihe 4: kassava-bammy ja ackee-suolakala jäävät erilliseen turvallisuuskaranteeniin, kunnes turvallinen raaka-aineen hankinta ja valmistusprosessi voidaan osoittaa.

Tämän PR:n valmis tulos on **viisi dokumentoitua valmistusehdokasta**, ei viisi julkaistua reseptiä. Alkuperäisreseptejä, GK-, kieli- tai julkaisuestotietoja ei saa ohittaa pikaisella merge-yrityksellä.

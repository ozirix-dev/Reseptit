# F25 – 13 FI-lähteen valmistusohjeiden SHA-lukitut oikaisut

Päivä 10.11.2026. Työ liittyy olemassa olevien lähdereseptien [F25 #399](https://github.com/ozirix-dev/Reseptit/pull/399) käännöserään, ei uusia reseptejä koskevaan porttiin.

Muutokset tehdään vain julkiseen FI-näyttöön, eivät kanonisiin FI-lähdetiedostoihin, ravintoarvolaskentaan, ainesosamääriin, annoksiin tai GI/GK-tietokantaan. Yhdeksän aiemman oikaisun jälkeen 13 uutta oikaisua, yhteensä 28 SHA-sidottua esitystapakorjausta.

- `pohjoisafrikkalainen-baghrir`: Git blob `24722209acc0b5ca0eb45719248297b6c2a58f3a`, normalisoitu raakateksti-SHA256 `465c021ba03a828a5a70f17ad6d5bce142e9cf957dc7af730bf5c1c352d8f706`; 4 yksilöityä vaihetta
- `thai-roti-munalla-banaanilla`: Git blob `2468bc1a828c551978760af1a0e5be2ddc2b4848`, normalisoitu raakateksti-SHA256 `01b5f49344afa698e599aa1ae8672649a18182892227ae5aa8d49b07e582c0ba`; 4 yksilöityä vaihetta
- `meksikolainen-chilaquiles-verdes`: Git blob `71abfa953914a080e2f180961864ba3dd3e3d35d`, normalisoitu raakateksti-SHA256 `84d2801095a02bb3c9a7d98b4c937653798ee84706fe032cf886365bd4ae4160`; 4 yksilöityä vaihetta
- `meksikolainen-paputostada-aamupalaksi`: Git blob `e73d88c563f14a5ebbb33803206b9739fcbcea34`, normalisoitu raakateksti-SHA256 `57e8193e7457a63d270b53386c030f2b905225b851e93c7c86941aa9e27aba5b`; 4 yksilöityä vaihetta
- `indonesialainen-nasi-goreng-aamiaisriisi`: Git blob `731c7babbe7aa94c4e931a8224cec81bfe75b9fb`, normalisoitu raakateksti-SHA256 `f55e64e3d2dd6080a7cbcde3b067cac696aaf8a5595b67a5615433d7a43689d7`; 4 yksilöityä vaihetta
- `korealainen-kimchi-jeon-aamiaiseksi`: Git blob `ed74bb3ddab0757a69402da47209b7bac0d51e9e`, normalisoitu raakateksti-SHA256 `b7187bbba5e0e8f9632fd3e3885ddd2dd8716c27e93912836bf92eeea9fff3ef`; 4 yksilöityä vaihetta

Ensimmäisen osan seitsemässä korjauksessa ovat pinaatti-paneer-chilla (vain viimeinen vaihe), papaija-kookospuuro, uunimuna-avokadot (vain kolmas vaihe), besan-chilla, thai-munacurry, bánh xèo ja bánh cuốn. Niissä ei käytetä listaamattomia kastikkeita tai kurkumaa, eikä kypsennyksestä saa jäädä pois reseptissä laskettua kananmunaa. Porsaan jauheliha ja katkarapu kypsennetään kauttaaltaan.

Toisessa osassa baghrir, thai-roti, chilaquiles verdes, paputostada, nasi goreng ja kimchi-jeon. **Nasi gorengin 150 g kecap manis** säilyy, vaikka on poikkeava. Baghririn 150 ml nesteen ja lyhyen hiiva-ajan sekä Thai-rotin ohukaismaisen rakenteen autenttisuus on ratkaisematta. Paputostada koskee valmiiksi kypsiä mustia papuja.

Jokainen F25-lähde pysyy ilman julkaisuvaltuutta. Nämä ovat AI:n tekemiä toimituksellisia oikaisuja, eivät riippumattomia ravintolaskennan tai kielentarkastajan hyväksyntöjä. CI-portti tarkistaa lähteiden 28 SHA:ta, ankkurit, määrät ja reseptin muodostuvan FI-näyttöversion.

## Otsikon ruokalajikohtainen lisäoikaisu

Baghririn julkinen FI-otsikko ja tekstin kuvaus: **hunajavoilla → hunajalla**. Lähde sisältää vain 1 rkl hunajaa, ei voita. Korjaus tehdään saman raaka-SHA-sinetin kautta eikä muuta ainesmääriä, makroja tai kanonista FI-raakatekstiä. Testi varmistaa että vanha hunajavoita lupaava otsikko poistuu kokonaan julkisesta FI-näkymästä.

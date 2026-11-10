# Gluteeniton reseptisuodatin (pilotti)

## Rajaus

Gluteeniton on riippumaton ruokavaliosuodatin, ei uusi ruokalajikategoria eikä `diet_class`-arvo. Sama resepti voi olla gluteeniton ja keto/VHH. Kyselyparametri on `gluten_free=1`, ja se yhdistyy muihin rajauksiin AND-ehtona. Suodatinta voi käyttää kaikilla neljällä kielellä.

Julkaisukenttä on `gluten_free: true` suomen tai käännöksen reseptin etumetadatassa. Puuttuva kenttä tai `false` tarkoittaa **ei katselmoitu gluteenittomaksi**, ei varmistettua gluteenipitoisuutta. Valinta on opt-in: automaattista ainesosahakua, keto-kentän tulkintaa tai massaluokittelua ei tehdä. Nykyisen reseptikannan gluteenittomuus on toistaiseksi tarkistamatta; tähän PR:ään ei merkitä yhtään reseptiä gluteenittomaksi. Suodatin palauttaa siksi 0 osumaa siihen asti, kun ensimmäinen hyväksytty reseptierä lisätään.

## Hyväksyntäkriteerit ennen `gluten_free: true`-merkintää

1. Tarkista jokainen ainesosa, valmistusohje, lisukkeet ja täytteet. Vehnä, ohra, ruis tai gluteenia sisältävä muunnos estävät merkinnän, ellei kyse ole erikseen gluteenittomaksi merkitystä ja todistetusti kelvollisesta tuotteesta (esimerkiksi puhdistettu gluteeniton vehnätärkkelys).
2. Tarkista gluteenittomuus pakkausmerkinnästä varsinkin jauhoseoksille, kauralle, kauravalmisteille, leivinjauheelle, kastikkeille, mausteseoksille ja valmistuotteille. Pelkkä sana `kaura` tai `maissi` ei todista tuotteen turvallisuutta.
3. Lisää olennaiset raaka-aineiden valintaehdot reseptin ainesosiin tai huomautuksiin (esim. **gluteenittomaksi merkitty kaurajauho**). Tarkista myös yhteiskeittiön ristikontaminaation vaara.
4. Varmista ettei kuvassa, ohjeessa tai tarjoiluehdotuksessa lisätä gluteenia sisältäviä osia ilman varoitusta ja määrää.
5. Kirjaa tarkastettu `recipe_id`, kieli, lähdecommit, tuotteet/pakkausmerkinnät, päivä ja katselmointitulos erilliseen tarkastusmuistioon. Käännösten gluteenittomuutta ei päätellä automaattisesti FI-version hyväksynnästä.
6. Suorita CI, automaattiset resepti- ja käännöstarkistukset sekä merkitysarvio ennen julkaisua. Testi `gluten-free filter is explicit...` varmistaa fail-closed-oletuksen.

Väite koskee reseptin ohjeellisesti gluteenittomiksi valittavia aineksia ja valmistusta, ei laboratoriossa mitattua lopputuotetta eikä automaattista keliakiaturvallisuuden takuuta.

Lähteet:
- [Keliakialiitto: Gluteenittomat tuotteet](https://www.keliakialiitto.fi/gluteenittomuus/gluteenittomat-tuotteet/)
- [Keliakialiitto: Gluteenittomuus ja lainsäädäntö](https://www.keliakialiitto.fi/ammattilaiset/ravitsemisala/gluteenittoman-ruoan-valmistus-tarjoilu/gluteenittomuus-ja-lainsaadanto/)
- [Keliakialiitto: Gluteenittomat raaka-aineet](https://www.keliakialiitto.fi/ammattilaiset/ravitsemisala/gluteenittoman-ruoan-valmistus-tarjoilu/ammattikeittion-gluteenittomat-raaka-aineet/)

## Recipavon alustava reseptijono (EI julkaistu, EI hyväksytty)

- Gluteeniton pannupizza
- Gluteeniton focaccia (kohotus, psyllium ja nesteytys testattava)
- Gluteeniton vaalea vuokaleipä
- Gluteenittomat sämpylät
- Gluteeniton kakkupohja (oma ohje, ei vehnäisen sienikakun uudelleennimeäminen)

Tämä on ainoastaan idea- ja tarkistusjono. Zoe Mitchellin `The Bread Rebuild Method`-myyntikuvauksen kategorioita voi käyttää inspiraationa, mutta hänen videonsa ja kaupalliset lupauksensa eivät ole todennettuja reseptilähteitä. Ohjeita tai kuvia ei kopioida hänen tuotteestaan.

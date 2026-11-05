# Raejuustopizza kaurajauhopohjalla

[PR #294](https://github.com/ozirix-dev/Reseptit/pull/294)
sisältää yhden noin 25 cm:n pizzan. Annos on puoli pizzaa. Syötävien ainesten
lähtöpaino on 574 g eli 287 g annosta kohti ennen paistoa.

## Ohjeen ja käännösten tarkistus

[Ylen julkaisema Nicola Ussherin ohje](https://yle.fi/a/74-20254643)
tukee ainesten yhdistelmää, 200 °C:n esipaistoa 15–20 minuuttia ja noin
10 minuutin loppupaistoa. Määrät ovat tämän version suunnittelumääriä.
Taikina levitetään ohuesti ja keskiosan annetaan hyytyä ennen täyttöä.
Kaurajauhon turpoaminen ja vetäytyminen ennen leikkaamista on ohjeistettu.
Täytteet punnitaan, ja pepperoni valitaan valmiiksi kypsänä.

**Avoin havainto.** Tätä sovellusta ei ole koepaistettu. Käytännön kokeessa
kannattaa kirjata, irtoaako 25 cm:n pohja paperista ja pysyykö se koossa
levon jälkeen. Uunin, raejuuston ja tomaattimurskan kosteus voi vaikuttaa
paistoaikaan ja rakenteeseen.

FI on lähde. EN, SV ja TH verrattiin siihen ainesrivi ja työvaihe kerrallaan.
Thain tarkistuksessa täsmennettiin sekoitusväline, hienonnettu keltasipuli,
kaurajauhon turvotus, esipaiston kypsyystarkistus ja kalkkunapepperonin
valmiiksi kypsä, sellaisenaan syötävä tila. Kaikissa kielissä ovat samat
määrät, 200 °C, paistoajat sekä maito-, kananmuna- ja kaurahuomio.
Käännösten merkitystiivisteet ovat Codex-katselmointirekisterissä.

Kuva on reseptiä varten tekoälyllä luotu 1536 × 1024 WebP-kuvitus.
Kaikissa kielissä käytetään samaa lähdekuvaa ja paikallista alt-tekstiä.

## Ravintoarvio

| Puoli pizzaa | Arvio |
| --- | ---: |
| Energia | 390 kcal |
| Proteiini | 39,87 g |
| Rasva | 19,74 g |
| Hiilihydraatit yhteensä | 14,45 g |
| Imeytyvät hiilihydraatit | 12,90 g |
| Kuitu | 1,54 g |

[Laskentasyöte](calculations/raejuustopizza-kaurajauhopohjalla.json) sitoo
ainesrivit ja annosmäärän kanoniseen reseptiin. [THL / Fineli Release 20](https://fineli.fi/fineli/fi/avoin-data)
kattaa raejuuston (649), kananmunan (858), kaurajauhon (30190), keltasipulin (335),
tomaattimurskan (398) ja noin 20 %:n mozzarellan (29239).
[FSANZ / AFCD Release 3](https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd)
kattaa valkosipulin (F004193), basilikan (F000396) ja suolan (F007878).
Kalkkunapepperoni laskettiin [HORMELin 5 oz -tuotteen ilmoitetuista arvoista](https://www.hormel.com/brands/hormel-pepperoni/product/turkey-pepperoni/).
Toisella tuotteella arvot vaihtelevat. Fineli- ja AFCD-rivien energia on
makroista johdettu arvio [liitteen XIV kertoimilla](https://eur-lex.europa.eu/eli/reg/2011/1169/oj).
Laskenta perustuu raaka-ainemääriin ja olettaa, että syötävät ainekset jäävät
pizzaan. Kypsää painoa ei arvioitu.

## GK – HOLD

Kaurajauho tuo noin 8,0 g imeytyvää hiilihydraattia annokseen. Rekisteristä
ja kohdennetusta [Sydneyn yliopiston GI-hausta](https://glycemicindex.com/gi-search/)
ei löytynyt tähän paistettuun raejuusto–kaurajauhopohjaan sidottavaa GI-mittausta.
Kaurapuuron ja vehnäpizzapohjan tulokset eivät kata tätä valmistetta.
Raejuuston ja tomaattimurskan koostumustietueet kuvaavat hiilihydraattimäärää,
eivät GI:tä. Reseptille ei sidota GK-arvoa eikä luottamusluokkaa.

## Tarkistustulokset

Paikallinen build tuotti kaikki neljä reseptireittiä ja responsiiviset
kuvaversiot. Muuttuneen sisällön tarkistus varmisti reseptischeman,
yksilölliset reitit, kuvaviitteet, ravintolaskennan ja käännöstiivisteet.
Käännöstestit 30/30, ravintotestit 31/31, GK-testit 90/90,
kuvaputken testit 7/7 ja staattisen tulosteen testit 31/31 läpäisivät.
Markdown-tarkistus läpäisi.

GK:n tuotantolaskenta ja lähdesidokset säilyvät ennallaan. Historiallinen
testinäkymä rajaa automaattisesti havaitut uudet reseptit omaksi joukokseen
ja tarkistaa niiden GK:n puuttuvan. Staattinen testi lukee puuttuvien
arvioiden määrän ajantasaisesta kattavuudesta.

# Kymmenen reseptin Thai-erä A — ravintoarviot

Laskenta aloitettu 24.10.2026. Erän laskentakoodi: `tools/calculate-nutrition-batch6.py`. Koodi lukee paikallisen Fineli Release 20 -poiminnan, AFCD Release 3 -poiminnan ja tuoteviitteet `docs/nutrition/food-records.json`-tiedostosta. Se laskee kaikki määrät grammoina ja pyöristää vasta annoksen jälkeen.

## Valmiit reseptit

### Som tam -tyylinen kurkkusalaatti

Resepti tuottaa neljä annosta. Määrät täsmennettiin kaikissa julkaistuissa
kieliversioissa: kurkkua 500 g syötävää painoa siementen poistamisen jälkeen,
kirsikkatomaatteja 150 g, raakoja vihreitä papuja 100 g, suolattomia
maapähkinöitä 30 g, kuorittua valkosipulia 3,5 g, punaista chiliä 5 g,
limettimehua 30 g, Squid Brand -kalakastiketta 15 g ja Foodin-erytritolia 4 g.

| Annoskohtainen arvo | g |
| --- | ---: |
| Nettohiilihydraatit | 4,92 |
| Kokonaishiilihydraatit | 9,76 |
| Proteiini | 3,96 |
| Rasva | 3,70 |

Kurkun tiedot ovat Fineli Release 20 -tietueesta #346. Kirsikkatomaatti,
vihreä papu, maapähkinä, valkosipuli, chili ja limettimehu ovat Australian
Food Composition Database Release 3 -tietueet F009190, F000431, F006107,
F004193, F002901 ja F004729. AFCD:n imeytyvä hiilihydraatti ilman
sokerialkoholeja ja niiden kanssa on näissä tietueissa sama, joten niiden
välinen polyolilisä on 0 lähteen ilmoittamalla tarkkuudella. AFCD-arvot
säilytetään muuttamatta ja jaetaan CC BY-SA 3.0 Australia -ehdoin;
FSANZ:n attribuutio, datarajoituslausuma ja käyttörajaus on kuvattu tämän
projektin `README.md`-tiedostossa. Squid Brand -kalakastike käyttää Open Food
Facts -tietuetta 13692210 (ODbL 1.0). Foodin-erytritolin etiketti ilmoittaa
kaikkien hiilihydraattien olevan sokerialkoholeja, joten 4 g kuuluu
kokonaishiilihydraatteihin mutta nettoarvoon siitä tulee 0 g.

Laskennassa käytettiin lähdearvoja / 100 g × grammoja; summa jaettiin neljällä
ja pyöristettiin vasta sen jälkeen. Paahdetut maapähkinät mallinnettiin
suolattomien raakojen maapähkinöiden arvolla, eikä paahtamiseen lisätty öljyä.
Kurkun siemenosan ravintoa ei laskettu mukaan, koska 500 g on syötävä massa
siementen poiston jälkeen.

### Kai jiew

Lähdereseptin annoskoko on 4. Ainesmäärät täsmennettiin kaikkiin tämän reseptin kieliversioihin: 8 keskikokoista kananmunaa (Fineli #858, 55 g/kpl), Squid Brand -kalakastiketta 10 g, rypsiöljyä 27 g (Fineli #535, 2 RKL × 13,5 g), vettä 15 g, kevätsipulia 15 g, kurkkua 150 g ja tuoretta korianteria 5 g. Vesi ei lisää makroja. Kaikki ilmoitettu paistoöljy lasketaan annoksiin.

| Annoskohtainen arvo | g |
| --- | ---: |
| Nettohiilihydraatit | 1,14 |
| Kokonaishiilihydraatit | 1,66 |
| Proteiini | 14,47 |
| Rasva | 16,97 |

Laskentarivit ovat toistettavissa komennolla `python tools/calculate-nutrition-batch6.py`. Kananmunan, öljyn ja kurkun arvot tulevat Fineli Release 20 -tietueista #858, #535 ja #346. Kevätsipuli ja tuore korianteri ovat AFCD Release 3 -tietueet F006250 ja F003192 (Food Standards Australia New Zealand, CC BY 4.0). Squid Brand -kalakastikkeen arvot tulevat Open Food Facts -tuotetietueesta 13692210 (ODbL 1.0); sen ainesosaluettelossa ovat anjovis-uute, suola ja sokeri, eikä siihen ole lisätty polyoleja.

Kokonaishiilihydraatti on imeytyvä hiilihydraatti + kuitu + polyolit. AFCD:n kevätsipulin ja korianterin imeytyvän hiilihydraatin arvot ovat samat sokerialkoholien kanssa ja ilman niitä; erotus on 0. Finelin kolmessa tietueessa POLYL 2260 on 0. Kokonaisöljyn laskeminen annokseen on ilmoitettu valmistusoletus ja voi yliarvioida rasvaa, jos öljyä jää pannuun. Arvot ovat suuntaa-antavia arvioita, eivät valmiin ruoan laboratoriotuloksia.

## Jäljellä olevat kahdeksan reseptiä

Thai-erän A muut reseptit lisätään tähän muistioon vasta, kun jokaisen olennainen ainesosa, määrä, tietue ja annoslaskenta on toistettavissa. Puuttuvia määriä tai tuntemattomia ravintoarvoja ei täytetä nollalla.

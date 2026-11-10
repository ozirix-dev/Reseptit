# Kokkikorjaukset A8: lukittujen FI-lähteiden julkisen esityksen sovitus

**Päivä:** 10.11.2026. **Tila:** AI-esikatselmoitu lähdekorjaus Draft-PR #361:ssa, ei kanonista FI-migraatiota, ei koepaistoväitettä.

## Miksi suorat alkuperäistiedostojen muutokset pysäytettiin

Alkuperäinen #361:n CI [#42657971480](https://github.com/ozirix-dev/Reseptit/actions/runs/42657971480) pysähtyi jo falafelin `GI/GK recipe binding is stale` -virheeseen; suora FI Markdownin muutos olisi muuttanut sen laskennan lähde-SHA:n. Lisäksi `lanttulaatikko-kermainen` kuuluu lukittuun `gk80-release-6`-pakettiin ja `shoyu-kanakeitto-konjac` `gk80-release-3`-pakettiin. Kaikille kahdeksalle alkuperäisen FI Markdownin tulee pysyä muuttumattomana.

Tämä PR poistaa vanhasta #361:n diffistä *kaikki suorat FI-lähdetiedostomuutokset*. Korjaukset toteutetaan `site/scripts/a8-editorial-display.ts`-moduulissa, joka toimii vain `site/scripts/build-content.ts`-sisältögeneroinnissa. Se tunnistaa jokaisen kahdeksan alkuperäistiedoston **täsmällisen SHA-256-tiivisteen**. Muuttunut raakateksti pysäyttää buildin, eivätkä korjaukset muuta historiallisia GK80-paketteja, ravintoarvolaskelmia tai käännösten semanttisia lähdehasheja.

## FI-korjausten vertailu

| FI-resepti | Julkinen toimituksellinen muutos | Tarkistuksen raja |
| --- | --- | --- |
| falafel | Pita ja salaatti **erillisiä valinnaisia lisukkeita**, ei kuulu punnittuun annokseen | 20 falafelin erä, tahinikastike ja käytetty öljy ennallaan |
| jerk-kana | Marinointi vähintään 60 min + paisto 45–55 min → kokonaisaika noin 130 min; kanan sisälämpö **≥75 °C** ja raakaa kanaa koskettaneen marinadin käyttökielto valmiina | Marinadin reseptin aineet, riisi ja pavut ennallaan, riisi kypsyy paiston aikana |
| kimchi-jjigae | Riisi on erillinen vapaaehtoinen lisuke, **ei** osa tämän version ravintoarvoja | Kimchi, porsaanliha, tofu ja liemi ennallaan |
| lanttulaatikko-kermainen | 55 g kananmunaa tarkoittaa **kuoretonta syötävää massaa** | **GK80 release-6**, alkuperäinen raakatiedosto ja hyväksyntä-SHA ennallaan |
| lindstrominpihvit-kaalilla | 2 rkl voita jaetaan 1 rkl pihveille + 1 rkl kaalille, ei lisärasvaa | Säilyttää pihvien lukumäärän, 4 minuutin puolikypsennysrajat ja 4 annosta |
| maksalaatikko-kukkakaalilla | 2 rkl voita jaetaan 1,5 rkl paistoon + 0,5 rkl vuokaan, ei lisävoita | Naudanmaksaa, kukkakaalia ja puolukoita ei poisteta; paistetaan kypsäksi |
| shoyu-kanakeitto-konjac | `cooking_method` keittäminen, ei paistaminen; broilerin sisälämpö vähintään 75 °C | **GK80 release-3**, alkuperäinen raakatiedosto ja hyväksyntä-SHA ennallaan |
| vhh-brita-kakku | Mantelijauho ja leivinjauhe sekoitetaan voi–erytritoli–keltuaisvaahtoon ennen taikinan levittämistä | Pohjan 70 g ja marengin 60 g erytritolia pysyvät erillisinä |

## Laatuportit ja rajoitukset

- Kaikissa kahdeksassa vain version lukitsema näyttökorjaus, ei alkuperäisen Markdownin muutosta. Toisen reseptin polulla korjaus palauttaa datan muuttamattomana.
- Kaikki ainesosien **määrät, yksiköt, makrot, annokset, kuvat ja näkyvien valmistusvaiheiden määrä** pysyvät samoina. Poikkeus: jerk-kanan arvioitu `time_total_min` on julkisessa näyttöversiossa 130 min (raakatiedostossa edelleen 90 min).
- [PR #373](https://github.com/ozirix-dev/Reseptit/pull/373) -menettely kuudelle muulle GK80-raakalähteelle säilyy ennallaan; tämä kerros lisää A8-korjaukset vain eri FI-reseptipoluille.
- 24 EN/SV/TH-luonnosta [PR #357](https://github.com/ozirix-dev/Reseptit/pull/357) **eivät ole vielä päivitettyjä** tähän julkiseen FI-esitykseen. Ei julkaisuvalmiusväitettä. Seuraavaksi käännösten merkitysvertailu, erityisesti jerk-kanan 130 min sekä 75 °C, shoyun keittäminen ja Brita-kakun aineiden lisääminen.
- **Pages-julkaisu pysyy HOLDissa:** [issue #376](https://github.com/ozirix-dev/Reseptit/issues/376) dokumentoi kaksi synkronointiaikakatkaisua. Tämä PR pysyy Draftina. Build/testit saavat valmistella korjauksen, mutta uutta mergeä ei tehdä Pagesin eston päälle.
- Uusi testisarja `site/tests/a8-editorial-display.test.ts`: SHA-sidonnat, lähteiden muuttumattomuus, GI/GK-lukitut kaksi pakettia, numerot ja näkyvien ohjeiden valmistusmerkitykset sekä fail-closed-väärä versio.

## Jatko

A8:n 24 käännöstä päivitetään vasta julkisen FI-korjauksen tarkistuksen jälkeen, ja julkaistavien kielten SHA-todisteet kirjataan erikseen. Lopullinen kanonisen FI-lähdeversion uudelleenhyväksyntä on eri, erikseen dokumentoitava työ. Näyttökorjaus ei itsessään ole uusi GK-mittaus tai ravintoarvohyväksyntä.

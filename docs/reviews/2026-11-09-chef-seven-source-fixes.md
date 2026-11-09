# Kokkikorjaukset: toisen käännöserän seitsemän FI-lähde-estettä (9.11.2026)

Tämä on itsenäinen lähdekorjaus-PR rinnakkaisen #357:n rinnalle. #357, #356, #358, #359 ja #360 eivät kuulu tämän haaran kirjoitusoikeuksiin. Julkaisu odottaa laatuportteja, eikä mikään GK-hyväksyntä muutu automaattisesti.

| Resepti | Virhe | Toimenpide |
| --- | --- | --- |
| lanttulaatikko-kermainen | 'kananmunaa kuoretta' | korjattu 'kuorettomana', 55 g ennallaan |
| lindstrominpihvit-kaalilla | voita 2 rkl kahteen eri työvaiheeseen | 1 rkl pihveihin + 1 rkl kaaliin |
| maksalaatikko-kukkakaalilla | 2 rkl voita sipulin paistoon ja vuokaan ilman jakoa | 1,5 rkl sipulille ja maksalle + 0,5 rkl vuokaan |
| vhh-brita-kakku | mantelijauho ja leivinjauhe jäävät ohjeessa lisäämättä taikinaan | täsmennetty kuiva-aineiden sekoittaminen voi-keltuaisvaahtoon |
| falafel | salaatti ja pita puuttuvat ainesosista | määritelty vain erillisiksi valinnaisiksi lisukkeiksi, eivät kuulu ilmoitettuihin makroihin |
| kimchi-jjigae | riisi lisukkeena ilman määrää | riisi vapaaehtoinen erillinen lisuke, ei kuulu annokseen |
| jerk-kana | vähintään 60 min marinointi + 45–55 min paisto ei sovi 90 min kokonaisaikaan | 130 min, kypsennys vähintään 75 °C, ei raakaan kanaan koskenutta marinadia kypsään ruokaan |

## Reseptivertailut ja perustelut

- Marttojen lanttulaatikossa käytetään kuoretonta munaa, kermaa ja uunissa haudutusta, mutta tässä ei lisätä perinteisen version siirappia: https://www.martat.fi/reseptit/lanttulaatikko/
- Valion Lindströminpihvien yhdistäminen/kypsennys antaa hyvän perusvertailun, mutta tämä on oma kaaliannos: https://www.valio.fi/reseptit/lindstrominpihvit/
- Brita-kakun jauhoseoksen lisäämisen vaihe selviää Kotivinkin perusohjeesta; tässä jauhot ovat mantelijauhoa, ei vehnää: https://www.meillakotona.fi/reseptit/brita-kakku
- Ruokavirasto: broileri vähintään 75 °C ja raaka liha erillään valmiista: https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/kasittely-ja-sailyttaminen/hygienia-kotikeittiossa/liha/

Vain kaksi metatiedon muutosta: lanttulaatikon munan määritelmä ja jerk-kanan kokonaisaika. Kaikkien 7 reseptin ainesosamäärät, ravintoarvot, GK-numeroarvot, kuvat, annokset ja recipe_id:t ennallaan. Historiallisia GK-tiivisteitä ei vaihdeta. Kaikki tekstin muutokset voivat silti vaatia historiallisen SHA-sinetin oikean rekonsiliaation; tämä PR pysyy Draftina kunnes testit osoittavat turvallisen hyväksynnän. Rinnakkaisen #357:n käännökset pitää päivittää näiden lähdekorjausten jälkeen ja tarkistaa SHA-uudelleen.

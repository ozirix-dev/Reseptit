# Khao Moo Tod Kratiem Khai Dao – ravintolaskennan ennakkotarkistus

Päiväys: 2026-11-21
Resepti: `reseptit/paaruoat/khao-moo-tod-kratiem-khai-dao.md`
Tila: **TARKISTAMATON SKENAARIO**, ei julkaisukelpoinen ravintolaskelma.
Kohde: 2 annosta. Lukujen lähtökohtana on nelikielisen luonnoksen nykyinen 14 ainesosarivin kokonaisuus. Ravintoarvometatiedot pysyvät kaikilla kielillä `null`.

## Lähdetietueiden vastaavuus

| Raaka-aine ja määrä | Käytetty syötävä massa | Lähdetietue ja soveltamisraja |
| --- | ---: | --- |
| Porsaan niska/kassler 300 g | 300 g | Fineli 34190, raaka kassler (17,9 g proteiinia ja 15 g rasvaa / 100 g). Rasvaisuus vaihtelee tuotteittain. |
| Valkosipuli 20 g | 20 g | AFCD F004193, kuorittu tuore valkosipuli. Koko ilmoitettu määrä mukana. |
| Vaalea soijakastike 15 ml | 18 g | Fineli 31, soijakastike, 18 g/rkl kuten saman repon `char-siu.json`-laskelmassa. Vaalean soijakastikkeen tuotevaihtelu avoin. |
| Osterikastike 15 ml | 18 g | AFCD F008026, kaupallinen osterikastike. **1,2 g/ml on vielä tuotevarmentamaton oletus.** |
| Kalakastike marinadiin 5 ml | 5,5 g | Squid Brand, OFF 13692210, 1,1 g/ml kuten `bun-cha-hanoi.json`-laskelman muunnoksessa; ei valittua tuotepakkausta. |
| Sokeri 4 g | 4 g | Fineli 1, taloussokeri. |
| Valkopippuri 1 g | **ei numerolaskennassa** | Fineli 11178: kuitu- ja polyolimäärä puuttuu. Teoreettinen enimmäisvaikutus yhden gramman massasta on alle 4,5 kcal ja enintään 0,5 g mitä tahansa yksittäistä makroa / annos. Rajauksen lupa arvioitava erikseen. |
| Jasmiiniriisi, kuiva 150 g | 150 g | Fineli 11521, kuiva tavallinen pitkäjyväinen riisi **jasmiiniriisin sijaisarvona**. Keitinvettä ei lasketa ravintoaineeksi. |
| Kaksi kananmunaa | 110 g | Fineli 858, kuoreton raaka kananmuna; 55 g / keskikokoinen muna (Finelin annosmuunnos, `thai-porsasjok.json`). |
| Kurkku 120 g | 120 g | Fineli 346, raaka kurkku. |
| Neutraali öljy 30 ml | 27 g | Fineli 541; 13,5 g/rkl eli 0,9 g/ml (sama repon `hapanimela-porsas.json`). **Kaikki pannulle mitattu öljy lasketaan syödyksi**, vaikka todellinen hävikki on tuntematon. |
| Kalakastike dippiin 10 ml | 11 g | Sama Squid Brand -sijaisarvo kuin yllä. |
| Limettimehu 10 ml | 10 g | AFCD F004729, limettimehu. **1,0 g/ml on varmentamaton muunnosoletus.** |
| Punainen tuore chili 5 g | 5 g | AFCD F002901, tuore punainen chili. |

**Tietolähteet:** Terveyden ja hyvinvoinnin laitos / Fineli Release 20 (CC BY 4.0); Food Standards Australia New Zealand, AFCD Release 3 (CC BY-SA 3.0 Australia); Open Food Factsin Squid Brand -tuotetietue (ODbL 1.0, Open Food Factsin osallistujat). Tässä on käytetty repon aiemmin arkistoimaa rajattua `docs/nutrition/food-records.json`-lähdepoimintaa. Taulukko ei väitä, että nykyisten tuotepakkausten sisällöt on varmennettu uudelleen.

## Laskennallinen vertailuskenaario, EI JULKAISTAVA

Koko reseptin laskenta raaka-ainetietueilla, kaiken mitatun 27 g öljyn ja kaikkien kastikkeiden oletetaan päätyvän syötäviin annoksiin:

| Ravintotekijä | Laskennallinen annos, 1/2 reseptiä |
| --- | ---: |
| Imeytyvä / nettohiilihydraatti | noin 66,48 g |
| Kokonaishiilihydraatti (imeytyvä + kuitu + lähteistetyt polyolit) | noin 69,97 g |
| Proteiini | noin 42,50 g |
| Rasva | noin 42,30 g |
| Energia, makroista karkea laskennallinen arvio (4/4/9 kcal/g + kuitu 2 kcal/g) | noin 824 kcal |

Laskentakaava: kutakin raaka-ainetta kohti `syötävä massa g × komponentin g/100 g / 100`; koko reseptin summa jaetaan kahdella. Energiarivi **ei ole tietokannan energia-arvo** eikä käyttäjälle näytettävä tarkka kaloriluku. Valkopippurin vaikutus on rajattu taulukon ulkopuolelle. Tiedot eivät ole ruoan laboratoriomittaus.

Jos todellinen syöty öljy olisi 13,5 g eikä 27 g, skenaarion rasva vähenisi noin **6,74 g/annos** ja laskennallinen energia noin **61 kcal/annos**. Pelkästään tämä ero ylittää ravintolaskennan 1 g/annos -epävarmuusrajan, eikä siksi ole hyväksytty pieni poisjättö. Lisäksi porsaan rasvaisuus, paistossa erotettu rasva, kastikkeiden tuote-erot sekä limettimehun ja osterikastikkeen tilavuus-painomuunnokset ovat avoinna.

## Päätös ja seuraavat ehdot

- **HOLD julkisille numeroille**. Kaikki neljä makroarvoa pidetään `null`-tilassa, eikä laskentaa merkitä `ESTIMATE WITH EVIDENCE` -luokkaan ennen riittäviä lähtötietoja.
- Lukitse soija-, osteri- ja kalakastikkeen tuotetiedot sekä punnitut grammamäärät. Määrittele paistoon käytetyn ja annokseen päätyvän rasvan laskentatapa ilman keksittyä hävikkiä.
- Tarkista valkopippurin pienen puutteen yhteinen yläraja. Varmista lihan sekä jasmiiniriisin tietuevastaavuus.
- Vasta sitten luo `docs/nutrition/calculations/khao-moo-tod-kratiem-khai-dao.json` mallin vaatimalla lähdetiivisteellä ja validoi neljä ravintoarvoa uudelleen. Nykyinen julkaisuauditointi ei hyväksy erillistä laskentatiedostoa julkaisemattomalle FI-lähteelle.
- **GK / GL: ei määritetty**. Riisin GI-vastaavuuden tutkimus ja lopullinen annoskohtainen hiilihydraatti edellyttävät vielä arviointia. Ei keto- tai VHH-luokitusta.
- Lähde- ja turvallisuusviitteet: [Ruokavirasto – kypsentäminen](https://www.ruokavirasto.fi/elintarvikkeet/elintarvikeala/hygieeninen-toiminta/tuotanto--ja-kasittelyhygienia/kypsentaminen/) sekä [Ruokavirasto – Bacillus cereus](https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/ruokamyrkytykset/ruokamyrkytyksia-aiheuttavia-bakteereja/bacillus-cereus/). Porsaan pala- ja riisiturvallisuus tarkennettu kieliluonnoksiin.

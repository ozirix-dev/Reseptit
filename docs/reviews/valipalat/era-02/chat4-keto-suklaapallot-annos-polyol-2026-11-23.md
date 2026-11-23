# Chat-4 / Issue #333 – keto-suklaapallojen annos- ja polyolikatselmointi

**Päiväys:** 23.11.2026
**Työn omistaja:** Chat 4
**Kohde:** `docs/reviews/valipalat/katselmointi/keto-suklaapallot.md`
**Tila:** REVIEW/HOLD; ei julkaisua, ei hyväksyttyjä ravinto- tai GK-lukuja.

## Rajaus ja lähtönäyttö

Käytössä oleva FI-luonnos on 12 pallon vaihtoehto: 120 g mantelijauhoa, 50 g voita, 20 g sokeroimatonta kaakaota, 30 g erytritolia, 30 g kookoshiutaleita ja 20 g vettä. Nykyinen B-erän lähdekartta `docs/reviews/valipalat/era-02/source-bindings.json` pitää tämän reseptin `REVIEW_REQUIRED`/`HOLD`/`UNPUBLISHED`-tilassa. Siinä Foodin-erytritoli on `REVIEW` eikä valmis laskentahyväksyntä; kookoshiutaleiden käyttämättä jäänyt osuus on erikseen epävarma.

**Huomio:** kyse on julkaisemattomasta tutkimusluonnoksesta eikä vahvistetusta tuotantoannoksesta.

## Ratkaistu: kuorrutteen kirjaus ja annoksen massarajaus

- Taikinan lähtöainemassat ilman kookoskuorrutetta: `120 + 50 + 20 + 30 + 20 = 240 g`. Kuorrutusta varten punnitaan erikseen enintään 30 g.
- Kaikki lähtöaineet yhteensä: `270 g`, nimellisesti `22,5 g/pallo` **vain jos kaikki kuorrute tarttuu ja mitään muuta hävikkiä tai massamuutosta ei synny**. Tämä ei ole mitattu valmiin annoksen massa eikä ravintoarvo.
- Todellinen syöty kuorrute = 30 g − kulhoon jäänyt käyttämätön määrä − muu kuorrutehävikki. Uusi työvaihe pyytää punnitsemaan nämä. Laskennan lähtöarvoksi ei saa automaattisesti merkitä täyttä 30 g:aa.
- Reseptin 12 kappaletta tarkoittaa jakotapaa, ei fysikaalista tai ravitsemuksellisesti varmennettua saantoa. Myös 50 min kokonaisaika on valmistus- ja jäähdytysarvio.

## Erytritoli: todettu tuotemerkintä mutta ei koko reseptin GK

[Foodinin luomuerytritoli 200 g](https://foodin.fi/tuote/erytritoli-luomu-200g-2/) ilmoittaa 100 grammaa kohti 100 g hiilihydraatteja, joista 100 g sokerialkoholeja/polyoleja ja 0 g sokereita. Pakkauksen energiatieto on 0 kcal. Myös [S-kaupat](https://www.s-kaupat.fi/tuote/foodin-erytritoli-luomu-200g/6430051824777/1000) ilmoittaa saman koostumuksen ja EAN-tunnisteen `6430051824777`.

Punnittu 30 g koko erään vastaa jakolaskussa 2,5 g erytritolia/pallo, jos koko erä käytetään ja jako on tasainen. **Tämä 2,5 g ei ole koko pallon hiilihydraattimäärä.** `EU_TOTAL_INCLUDING_POLYOLS`-lähteen varmistetut polyolit vähennetään normalisoinnissa vain kerran. Jos syötteen lähtöarvo on jo `EU_AVAILABLE`, toista vähennystä ei tehdä. Tuntematon polyolimäärä ei ole 0. Muiden raaka-aineiden hiilihydraatit, kuitu, rasva ja proteiini tarvitsevat oman tuote-/lähdelaskentansa.

[Ruokaviraston ravintoarvomerkintäohje](https://www.ruokavirasto.fi/elintarvikkeet/elintarvikeala/pakkausmerkinnat-ja-markkinointi/pakolliset-elintarviketiedot/ravintoarvomerkinnat/) erottaa sokereiden ja polyolien ilmoittamisen. [Ravitsemus- ja terveysväiteopas](https://www.ruokavirasto.fi/yritykset/oppaat/ravitsemus--ja-terveysvaiteopas/ravitsemus--ja-terveysvaiteopas--elintarvikealan-yrityksille-ja-valvojille/) asettaa ehdot `ei lisättyjä sokereita` -väitteelle. Makeutusaineen käyttö ei automaattisesti estä väitettä, mutta koko reseptin todelliset tuotetiedot on silti tarkistettava. Siksi luonnoksen otsikko kertoo vain **erytritolilla makeuttamisesta**; ei varmennettua `keto`-, `sokeriton`- tai muuta ravitsemusväitettä.

## Turvallisuus ja julkaisuportti

- Manteli ja voi merkitsevät pähkinä- ja maitoallergeeneja; valitun kookoksen ja erytritolin pakkauksen jäämät varmistetaan tuotekohtaisesti.
- Kylmässä säilytys `enintään +6 °C` mainitaan luonnoksessa. Tästä ei ole tehty omaa säilyvyyskoetta.
- Tarvitaan todellinen annoskoon ja kookoskuorrutteen saantohavainto tai muutoin hyväksytty täsmällinen menetelmä, valittujen tuotteiden pakkaus- ja koostumuslähteet sekä neljän makron julkaisu-/poisjättöpäätös.
- `diet_class` jätetään pois, GK säilyy HOLDissa. Kuva, EN/SV/TH ja varsinainen FI-julkaisu edellyttävät erillisiä hyväksyntöjä.
- Muutos koskee vain dokumentoitua FI-luonnosta, uutta katselmointimuistiota ja rajattua testiä; ei muutoksia jaettuun `source-bindings.json`-rekisteriin, GK-sinetteihin, julkisiin resepteihin, Cloudflareen tai muiden chattien haaroihin.

**Valmistumispäätös:** kuorrutteen mittauslogiikka ja Foodinin EU-polyolimääritelmän tutkimusraja tarkennettu testattavasti. Koko B-erän Issue #333 jää avoimeksi muiden reseptien ja lopullisten julkaisuhyväksyntöjen vuoksi.

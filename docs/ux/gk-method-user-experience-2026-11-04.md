# GK-sivun loppukäyttäjäuudistus – toteutus ja jatkopolku

Status: DRAFT · käyttöliittymämuutos, ei GK-datan hyväksyntä

## Tavoite
Nykyinen /glykeeminen-kuorma/ on yhtä aikaa tekninen laskenta-arkisto ja käyttäjäsivu. Erota käyttäjäpolku ja lähdejäljitettävyys muuttamatta dataa, laskentaa, hyväksyntätiloja tai alkuperäisen ja muokatun reseptin eroa.

## Toteutus tässä PR:ssä
- Kaikki neljä kieliversiota saavat samasta lähdedatasta johdetun reseptihaun, tekstinsuodatuksen, vain laskennalliset arviot -rajauksen ja tuloslaskurin.
- Arvion merkitys ja rajat esitetään ennen teknisiä tietoja.
- Kattavuuden A/B/C-versioerittely ja yksityiskohtaiset menetelmä- sekä viitetiedot siirretään avattaviin osioihin; mitään lähdeviitettä ei poisteta.
- Reseptikohtaiset lähteet ja perustelut säilyvät avattavina; puuttuvat arviot pysyvät puuttuvina.
- Mobiilihaku, kosketuspinta, näppäimistön fokus ja hakutuloksen ilmoitus parannetaan.
- Asiakassivun tuloslista näyttää selaimen aktivoiduttua ensin 24 osumaa; käyttäjä voi näyttää lisää tai kaikki. Palvelinrenderöinti sisältää kaikki kohteet, jotta indeksointi ja ankkurit eivät katoa.

## Hyväksyntäkriteerit
1. FI/EN/SV/TH: otsikot, haku, valintaruutu ja nollaosuman viesti toimivat.
2. Haku löytää reseptin paikallisella nimellä; tyhjä haku palauttaa kaikki tulokset.
3. Rajaus ei merkitse puuttuvaa alkuperäistä GK:ta lasketuksi, vaikka reseptillä olisi erillinen hyväksytty GK-only-versio.
4. Alkuperäisen reseptin ja muokatun version erot ja lähdeviitteet säilyvät.
5. Kattavuusluvut luetaan edelleen generoituista tiedoista, ei kirjoiteta käsin.
6. Tavanomainen navigaatio / reseptisivujen menetelmälinkit sekä nelikielinen canonical / SEO toimivat.
7. Ankkurilinkit #recipeId poistavat tilapäisen suodatuksen ja paljastavat koko listan, jotta kohde pysyy saavutettavana. Varmista selaimessa myös suora sivunlataus.
8. Ei muutoksia julkaistujen GK-arvojen laskentaan, riippuvuuksiin tai lähdedokumenttien tietueisiin.
9. Tarkista saavutettavuus, mobiili 320px ja selaintesti kohdennetusti; käytä CI:n nykyistä valintalogiikkaa, älä käynnistä koko GK-testimassaa käsin.

## Seuraava laajennus (ei toteutettu)
- Arvioi isommilla aineistoilla listan virtualisoinnin tarve: nykyinen vaihe näyttää selaimen hydratoitumisen jälkeen 24 ensimmäistä tulosta ja loput käyttäjän pyynnöstä, mutta SSR sisältää kaikki reseptit.
- Erottele tekninen menetelmä omalle selvästi tunnistetulle tutkijasivulle vasta kun reitit, canonical-osoitteet ja vanhat linkit on suunniteltu.
- Käyttäjätestaa viisi tehtävää: löydä GK, ymmärrä puuttuva GK, erota muokattu versio, tarkista luotettavuus, avaa lähde.
- Varmista tuotannossa: yläosan luettavuus, sisältömäärä ja mainittujen laskentavertailujen oikeellisuus.

## Rajaus / turvallisuus
Ei automaattista yhdistämistä eikä tuotantoon julkaisua. Tämä PR ei ole ravitsemustieteen sisältöhyväksyntä.
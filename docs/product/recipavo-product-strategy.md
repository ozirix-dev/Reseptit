# Recipavo – pitkän aikavälin tuote- ja liiketoimintasuunnitelma

**Suunnitteluehdotus v1 · 2.11.2026 · ei toteutus-, julkaisu- tai budjettilupaa.**

Recipavon ehdotettu ydinlupaus on: **Valitse mitä söit, kerro paljonko söit – Recipavo hoitaa ravintoainelaskennan.** Lupaus toteutuu vain niille ravintotekijöille, joihin on riittävä lähde-, määrä- ja valmistusnäyttö. Käyttäjän työ vähenee erityisesti toistuvissa aterioissa; puuttuvia tietoja ei täytetä nollilla helppouden saavuttamiseksi.

Suositus on ensin osoittaa yksi arvoa tuottava ketju: käyttäjä rakentaa oman aamupalan, tallentaa sen ja kirjaa saman aterian seuraavana aamuna yhdellä painalluksella. Laajat mikrot, henkilökohtaiset analyysit, maksut ja kansainvälinen päiväkirja avataan vasta omien näyttöporttiensa jälkeen. Julkinen nelikielinen reseptipalvelu säilyy ilman kirjautumista ja toimii omana staattisena kokonaisuutenaan.

Suunnitelma kattaa käyttäjät, ominaisuudet, käyttökokemuksen, tietosuojan, hinnoittelun, talousskenaariot ja P0–P8-etenemisen. Se ei toteuta käyttöliittymää, käyttäjätilejä, API:a, Diary-tietokantaa, maksuja, analytiikkaa tai infrastruktuuria. Tämän dokumentin hyväksyminen ei hyväksy niiden rakentamista.

## 1. Tosiasiat, vaatimukset ja ehdotukset

| Tila | Lähtökohta |
|---|---|
| Käyttäjän vaatimukset | Erittäin helppo, läpinäkyvä ja kohtuuhintainen palvelu; julkinen reseptipalvelu ja yksityinen päiväkirja; omat vakioateriat ja yhden painalluksen kirjaus; FI/EN/SV/TH julkisessa palvelussa; nykyiset reseptiosoitteet säilyvät. |
| Tarkistettu nykytila | Reseptit main `adda64fda9bf63e69e190b6d888698587a250a2a`: React/Vite, esirenderöidyt reseptisivut, kielikohtainen haku/suodattimet, annosmäärän säätö, neljä julkista makroarvoa ja erillinen GK-menetelmä. Ei tämän tarkastuksen osoittamaa käyttäjätili-/Diary-/tilausjärjestelmää. |
| Tuotteen nykyiset rajat | VHH/Keto ovat toimituksellisia luokkia; kaikille resepteille ei ole varmennettua ravintolaskentaa. Nykyinen julkinen nutrition-sopimus sisältää netto-CHO:n, kokonais-CHO:n, proteiinin ja rasvan. Energia ja kattavat mikrot eivät ole tämän neljän arvon sopimuksen taattuja kenttiä. |
| Erilliset keskeneräiset suunnitelmat | [Cloudflare PR #172](https://github.com/ozirix-dev/Reseptit/pull/172), HEAD `1a3ba27d8b7f738d22e8a6b899bb3b0081560507`; [Nutrition Core PR #176](https://github.com/ozirix-dev/Reseptit/pull/176), HEAD `3273e59d07ef7bebffda9bb822aabf7748da8e88`; [SOURCE-01 PR #174](https://github.com/ozirix-dev/Reseptit/pull/174), HEAD `19939d95d8c93d6e93d4619d9f2510d043d246dc`. Draft ei tarkoita hyväksyttyä tai toteutettua. |
| Alustavat tuotepäätösehdotukset | Rajattu aikuisten MVP, mobiili web ensin, peruskirjaus maksuton, Plus lisäarvon perusteella, ehdotettu hinnan testaaminen 3,90/4,90/5,90 €/kk. Kaikki jäljempänä nimetyt tavoitteet ovat testattavia oletuksia. |
| Avoin näyttö | Ei tässä todennettua kysyntää, liikennevolyymia, maksukonversiota, tukikuormaa tai hintajoustoa. Käyttäjän aiempi tieto: GSC:ssä ei ole käyttökelpoista lähtödataa. Tässä ei perusteta GSC-propertya eikä haeta käyttäjien yksityisiä tietoja. |

Toteutusta luettiin rajatusti: [README](https://github.com/ozirix-dev/Reseptit/blob/adda64fda9bf63e69e190b6d888698587a250a2a/README.md), [reititys](https://github.com/ozirix-dev/Reseptit/blob/adda64fda9bf63e69e190b6d888698587a250a2a/site/src/router.tsx), [reseptisivu](https://github.com/ozirix-dev/Reseptit/blob/adda64fda9bf63e69e190b6d888698587a250a2a/site/src/features/recipes/RecipePage.tsx), [haku](https://github.com/ozirix-dev/Reseptit/blob/adda64fda9bf63e69e190b6d888698587a250a2a/site/src/features/recipes/recipe-search.ts), annosfunktiot, sisältöskeema sekä luokitus-/ravintodokumentit. Nykyinen annossäädin muuttaa reseptin valmistusmäärää kokonaisannoksina; siitä ei päätellä tulevan päiväkirjan puolikkaiden annosten tai kypsäpainojen toteutusta. Kokonaista sivustoa ei rakennettu eikä uusia kattavuuslukuja auditoitu.

## 2. Kohdekäyttäjät ja kilpailuasema

### 2.1 Ensimmäinen kohderyhmä

Ensimmäinen hypoteesi on aikuinen, joka syö toistuvia aamiaisia/lounaita, valmistaa osan ruoista itse ja haluaa seurata hiilihydraatteja tai makroja ilman jatkuvaa hakemista. Hän voi olla kyllästynyt yksittäisten elintarvikkeiden kirjaamiseen, mutta ei välttämättä halua laihtumisohjelmaa. Ensimmäiseen maksuhalukkuus- ja tukipilottiin valitaan suomenkielinen kohderyhmä; julkiset nykyiset neljä kieltä säilyvät. Muunkielinen päiväkirja on erikseen validoitava tuote, ei automaattisesti reseptikäännösten sivutuote.

Toinen kohderyhmä on kansainvälisten reseptien kotikokki, joka siirtyy reseptistä annoskirjaukseen. Myöhemmin mikroravinteista kiinnostunut käyttäjä voi hyötyä pidemmän ajan näkymistä, jos lähdekattavuus ja maksuhalukkuus sen oikeuttavat.

Ensimmäinen tuote ei ole lasten seurantapalvelu, lääkehoitotyökalu, kliininen diabetespalvelu, ammattilaisen potilasjärjestelmä tai ravintolisien annostelija. P0–P5 eivät vaadi diagnoosia, painoa, BMI:tä, sukupuolta, tarkkaa syntymäpäivää tai verensokerimittausta. Aikuisten rajaus ja sen toteutustapa hyväksytään P2:ssa ennen oikeita käyttäjiä; myöhempi kliininen käyttö vaatii oman arvioinnin.

### 2,2 Käyttäjän tehtävät ja arvolupaus

| Käyttäjän tilanne | Recipavon tavoiteltu hyöty | Mitä pitää osoittaa |
|---|---|---|
| Sama aamupala lähes päivittäin | Määrät kerran, sen jälkeen näkyvä suosikki ja yksi kirjauspainike | Toistokirjaus onnistuu ilman hakua ja uutta lomaketta |
| Teen valmiin reseptin | Reseptin hyväksytty profiili ja selkeä syöty annos | Käyttäjä ymmärtää koko erän vs yhden annoksen eron |
| Seuraan hiilihydraatteja | Tunnetut netto-/kokonaismäärät ja oma numeerinen tavoite | Ei sekoitusta toimitukselliseen keto-tagiin tai fysiologiseen ketoosiväitteeseen |
| Katson vitamiineja | Tunnettu määrä, lähteet ja tiedon kattavuus samassa näkymässä | Puuttuva ei näytä nollalta tai täydelliseltä päivän saannilta |
| Haluan kohtuullisen hinnan | Peruskirjaus ilmainen, Plus auttaa aidosti ymmärtämään tietoja | Maksuhalukkuus ja kustannusten kattaminen, ei pelkkä halpa hintalappu |

Kilpailuetu on todennettava yhdistelmä: pieni määrä pakollisia vaiheita, reseptistä suoraan kirjattava hyväksytty annos, uudelleen käytettävät omat ateriat ja ymmärrettävä lähdenäyttö. Omien aterioiden tallennus tai monikielisyys eivät yksin ole ainutlaatuisia. Emme lupaa kaikkien kilpailijoiden tarkkuutta parempaa tietokantaa tai kliinisiä terveyshyötyjä ilman näyttöä.

## 3. Kilpailijat: hinnat, ominaisuudet ja käyttäjäkitka

Tarkistuspäivä 2.11.2026. Alla on toimittajien julkaisemaa hinnoittelua ja tukidokumentaatiota, ei ostettuja tilauksia tai mitattu kilpailijoiden läpivientiaikoja. Maat, maksukanava, kampanjat ja verot voivat muuttaa kassahintaa; USD-hintoja ei muunnettu Suomen kuluttajahinnoiksi.

| Palvelu | Vahvistettu ilmainen perusta | Maksullinen taso ja julkinen hinta | Johtopäätös Recipavolle |
|---|---|---|---|
| Cronometer | Ruoka-/ateriakirjaukset, omat ruoat/ateriat/reseptit, viivakoodi ja laaja ravintotekijäseuranta; lyhyen aikavälin analyysit | Gold julkaistuna alkaen 10,99 USD/kk tai 59,99 USD/v; mainoksettomuus, laajemmat trendit ja helpottavia työkaluja | Mikrot eivät yksin riitä Plus-eroksi, koska niitä on jo ilmaisessa kilpailijassa. Omat ateriat eivät ole uusi keksintö. |
| MyFitnessPal | Ruokapäiväkirja, makrot, omat ruoat/ateriat/reseptit ja perustavoitteet | Premium 19,99 USD/kk tai 79,99 USD/v; Premium+24,99 USD/kk tai 99,99 USD/v julkaistussa US-esimerkissä. Premium+ Irlanti 24,99 €/kk tai 99,99 €/v; ei tässä varmennettu Suomen kassahintaa | Kirjauksen nopeuttajien, nettohiilareiden ja analyysien maksullisuus tarjoaa vertailukohdan, mutta Free sisältää jo paljon. |
| YAZIO | Julkisen ohjeen mukaan päiväkohtainen analyysi ja perusruokaseuranta; oma resepti mahdollinen | PROssa laajempia analyysejä, reseptejä, mikrotietoja ja mainoksettomuus. Yhtä nykyistä kaikille alueille sopivaa euromääräistä normaalihintaa ei varmennettu | Hintaa ei täytetä arvauksella tai tarjousmainoksella. Kassahinta ja jakson kokonaisveloitus tarkistetaan ennen varsinaista hintavertailutestiä. |

Lähteet taulukon väitteille: Cronometerin [tilausvertailu](https://support.cronometer.com/hc/en-us/articles/360028026971-Subscription-Types), [Gold](https://cronometer.com/gold/) ja [virallinen media-/hintakuvaus](https://cronometer.com/blog/media/); MyFitnessPalin [1.9.2026 päivitetty ominaisuusvertailu](https://support.myfitnesspal.com/hc/en-us/articles/34889191368077-The-difference-between-Free-Premium-and-Premium) ja [virallinen hintavertailu](https://blog.myfitnesspal.com/myfitnesspal-membership-pricing-tiers/); YAZIOn [tuoteohje](https://help.yazio.com/hc/en-us/articles/11804776635281-Tutorial-of-the-Yazio-app) ja [PRO-kuvaus](https://help.yazio.com/hc/en-us/articles/208847005-How-does-Yazio-Pro-support-my-goals).

### 3.1 Rajattu käyttäjäpalautteen tarkastelu

Luettiin kummankin suuren kilpailijan Google Play -sivulla näkyneet 3 arviota, yhteensä 6. Sivusto valitsee näkyvät arviot; otos ei ole satunnainen, edustava eikä palautteista laskettu ongelmaprosentti. Arviot ovat käyttäjien kokemuksia, eivät ulkopuolisesti varmennettuja vikoja. Positiivinen ja ristiriitainen palaute pidetään mukana:

| Havainto näkyvistä arvioista | Päiväys / aineisto | Suunnitteluhypoteesi, ei todettu Recipavo-etu |
|---|---|---|
| Mainosten häiritsevyys toistuu kahdessa Cronometer-arviossa ja yhdessä MFP-arviossa | Cronometer 5.5.2025 ja 25.2.2026; MFP 3.3.2025 | Päiväkirjan peruspolulle ei keskeyttäviä mainoksia tai toistuvaa Plus-ruutua. |
| Cronometeria myös kiitetään täsmällisestä grammakirjauksesta ja helppoudesta; samassa arvioinnissa ei koettu mainosongelmaa |24.2.2026 | Kilpailija voi olla jo erittäin hyvä; grammakirjauksen ymmärrettävyys on itse testattava. |
| MFP:ssä kerrotaan kirjauksen keskeytymisestä sekä erillisessä arviossa reseptin tallennusongelmasta; jälkimmäinen kertoo ongelman sittemmin korjaantuneen |28.4.2026 ja 14.4.2026 | Tallennuksen tila, retry ja kaksinkertaisen kirjauksen esto ovat keskeisiä. Ei väitetä kilpailijan vian jatkuvan nyt. |
| Cronometer-arviossa ravintotiedon korjaamisen ja haun käytön kitkaa, mutta myös myönteisiä huomioita |25.2.2026 | Tarvitaan ymmärrettävä tuotevalinta ja korjauspyyntö; käyttäjän oma muokkaus ei saa muuttaa yhteistä lähdetietoa. |

Ensisijaiset palautelähteet: [Cronometer Google Play](https://play.google.com/store/apps/details?hl=en&id=com.cronometer.android.gold) ja [MyFitnessPal Google Play](https://play.google.com/store/apps/details?hl=en&id=com.myfitnesspal.android). Mainoskitka toistuu tässä pienessä aineistossa, mutta yleisyyttä ei tiedetä. Tallennus-/hakukitka on tutkimushypoteesi. Käyttäjien vaatima varmuus ja ymmärrettävä annos ovat tärkeämpiä testikohteita kuin kilpailijan yksittäisen virheen kopioitu vastalupaus.

### 3.2 Kaupallinen asema

Ehdotus: kohtuuhintainen, resepti- ja vakioateriakeskeinen vaihtoehto, jossa toistuva kirjaus on ilmaisen tuotteen ydin. Ei yritetä heti voittaa viivakooditietokannan koolla, kellointegraatioilla, tekoälyvalokuvilla tai kliinisillä raporteilla. Ilmaiset kilpailijat ovat todellinen vaihtoehto, joten Plus tarvitsee testatun hyödyn: esimerkiksi helposti ymmärrettävät pitkän aikavälin trendit ja niiden kattavuuden näyttö. Pelkkä nykyisten toimintojen poistaminen ilmaisesta ei todista maksuhalukkuutta.

## 4. Kaksi kokonaisuutta saman brändin alla

Julkinen puoli sisältää nykyiset reseptit, haun, suodattimet, lähde-/menetelmäselitteet, valmistusannokset ja jakamisen. Kirjautumista ei vaadita lukemiseen. Reseptejä voi jakaa olemassa olevalla URL:lla; helppo linkin kopiointi/jakopainike on myöhempi erillinen parannus, ei tässä todennettu nykyominaisuus.

Yksityinen puoli sisältää omat ateriat, syödyt/suunnitellut merkinnät, kalenterin ja käyttäjän itse valitsemat tavoitteet. Yhteiset tyylit, sanasto ja kielivalinta tuottavat saman brändin kokemuksen. Ateriat ja ruokapäiväkirja ovat aina yksityisiä oletuksena; reseptin jakaminen ei jaa päiväkirjaa tai omaa ateriaa.

Ehdotettu puhelimen navigaatio:

- Julkinen: Reseptit, Haku, Tietoa ravintoarvoista, Päiväkirja, Kirjaudu.
- Kirjautunut päiväkirja: Tänään, Omat ateriat, Kalenteri, Asetukset. Reseptit löydettävissä samasta ylävalikosta.
- Tänään on oletusnäkymä, jonka alussa on päiväys ja valittu päivä, sitten suosikit ja aterialuokat. Tili tai Plus eivät peitä kirjauspainiketta.

Päiväkirjalle voidaan varata `/paivakirja/`-polku ja tuleva suojattu API-nimiavaruus muuttamatta yhtään nykyistä reseptiosoitetta. Lopullinen kielireititys ja mahdollinen yksityisen sovelluksen erillinen origin päätetään P2:ssa. Polun nimi ei ole käyttöoikeussuoja. Julkiset linkit, canonical/hreflang ja vanhat URL:t kuuluvat nykyisen sivuston siirtosuunnitelmaan, eivät tämän tuotteen perusteella tehtävään uudelleennimeämiseen.

Tekninen periaate on mahdollinen: julkinen reseptisivusto ja päiväkirjan henkilötiedoton sovelluskuori staattisina; kaikki henkilökohtainen sisältö erillisestä tunnistetusta Diary-rajapinnasta. Nutrition Core, julkiset reseptipaketit ja yksityinen Diary ovat eri tietoja ja käyttöoikeuksia. Tämä ei valitse palveluntarjoajaa tai oikeuta infrastruktuurin luontiin.

## 5. Omat ateriat – ominaisuusmäärittely

### 5.1 Vakioaterian luonti

Käyttäjä avaa Omat ateriat → Uusi ateria. Yhdellä rakennusnäkymällä hän voi lisätä raaka-aineita tai Recipavon hyväksyttyjä reseptiannoksia, tarkistaa määrät, nimetä aterian ja tallentaa. Luokka on oletuksena viimeisin käytetty tai Aamiainen, sen voi vaihtaa Aamiainen/Lounas/Päivällinen/Välipala/Oma luokka. Oma luokka ei vaadi koko tilin lisäasetuksia.

Esimerkin Oma vakioaamupala voi sisältää kaksi kananmunaa, leipää, juustoa, kahvia ja maitoa. Ennen MVP-pilottia valituille tuotteille on oltava oikeuksiltaan sallittu profiili ja käytettyjen yksikköjen näyttö. Esimerkki ei väitä nykyisestä lähdeaineistosta löytyvän automaattisesti täydellistä aamupalaa. Alkuun kuratoidaan esimerkiksi 20–50 tavallista tuotetta ja 5–10 hyväksyttyä reseptiprofiilia; määrä on suunnittelurajaus, ei nykyinen kattavuuslupaus.

| Lisättävä osa | Määrän merkitys | Käyttöliittymän sääntö |
|---|---|---|
| Yksittäinen elintarvike | g tai lähteistetty tuotekohtainen kpl/dl/ml | Oikea tuote, raaka/kypsä/valutettu tila ja syötävä osa näkyvät; ei yleistä kananmunan grammapainoa tai ml=g-oletusta. |
| Reseptin yksi tai useampi annos |0,5/1/1,5/2 jne. hyväksyttyä annosta | Syöty annos on eri asia kuin valmistettavan reseptierän annossäädin. Desimaaliosuus säilyy tarkasti. |
| Osa koko reseptistä | Osuus erästä × reseptin annokset | Neljän annoksen reseptin puolikas tarkoittaa 2 annosta, ei0.5 annosta. Käyttäjä näkee laskennan. |
| Resepti grammoina | Syöty kypsä massa / dokumentoitu valmiin erän massa | Käytössä vain jos valmiin syötävän erän paino tunnetaan; raaka-ainemassojen summa ei automaattisesti ole kypsäpaino. Muuten annoskirjaus tai painon selvitys. |
| Käyttäjän oma resepti | Ainesosat, erän annokset, valmistus/saanto ja oma revisio | Myöhempi ominaisuus. Ei oleteta hyväksytyksi Core- tai julkiseksi reseptiksi. |

MVP:n ateria voi sisältää ruokia ja reseptejä samassa kokonaisuudessa. Aterian lisäämistä toisen oman aterian sisään ei tarvita aluksi: vältetään kehät, vaikea osittainen muokkaus ja päällekkäinen laskenta. Alkuperäisen ruoan ja valmiin reseptin samoja aineksia ei yhdistetä taustalla uudelleen.

Kokonaisuuden yhteenveto näyttää tunnetut ravintotekijät, tiedon kattavuuden ja yhden selkeän tallennustoiminnon. Pakollisia ovat nimi ja laskettava määrä/profiilivalinta; kuva, luokka ja lisämuistiinpanot eivät saa muodostaa lomakeketjua. Yksi painallus myöhemmässä kirjauksessa ei edellytä, että ensimmäinen ateria syntyisi ilman tuote- ja määrätarkistusta.

### 5.2 Kopiointi, muokkaus ja historia

Vakioateria on uudelleenkäytettävä malli, jolla on muuttumattomat revisiot. Muokkaus luo uuden version tuleviin kirjauksiin. Aiemmat päiväkirjamerkinnät viittaavat omaan snapshotiinsa eivätkä vaihdu. Kopioi ateria luo uuden nimettävän mallin; muokkaa tätä merkintää muuttaa vain päiväkirjariviä. Toiminnot erotetaan nimeltään ja sijainniltaan.

Ateriamallin poistaminen arkistoi sen tulevista valinnoista mutta ei poista vanhoja päiväkirjamerkintöjä. Vanhan merkinnän voi poistaa erikseen. Tilin/tietojen poisto on eri laajuinen toiminto. Jos lähteen hyväksyntä tai oikeus myöhemmin peruutetaan, vanha historia käsitellään dokumentoidulla oikeusprosessilla; uuteen kirjaukseen ei käytetä peruutettua profiilia hiljaisesti.

## 6. Päiväkirja, kalenteri ja tärkeimmät käyttöpolut

### 6.1 Seitsemän käyttöpolkua

| Käyttötilanne | Pienin ymmärrettävä polku | Tallennuksen merkitys |
|---|---|---|
| Vakioaamupala tänään | Tänään → Oma aamupala: Kirjaa 1 annos | Yksi uusi syöty merkintä valitulle päivälle; onnistuminen ja Kumoa näkyvät. |
| Reseptin yksi annos lounaaksi | Reseptisivu → Kirjaa →1 annos, Lounas → Tallenna | Oletus on syöty 1 annos, ei koko valmistettu erä. Muutettava määrä näkyy ennen tallennusta. |
| Kopioi eilinen aamiainen | Päivä/eilinen → Kopioi tähän päivään | Uusi merkintä omalla ID:llä ja snapshotilla, ei viittaus muuttuvaan eiliseen riviin. Vanhan lähdeversion käyttö tarkistetaan. |
| Muuta annosta jälkikäteen | Avaa merkintä → määrä → Tallenna | Vain valittu merkintä muuttuu; lähdeprofiili säilyy, uusi määrä ja tulosrevisio kirjataan. |
| Poista virhe | Poista merkintä → Kumoa lyhyen ajan sisällä | Poistettu ei kuulu päivän summaan. Ei ateriamallin tai muiden päivien poistoa. |
| Viikon tarkastelu | Kalenteri → viikko → päivä | Näkyvät kirjatut päivät ja komponenttien kattavuus. Kirjaamaton päivä ei ole 0 syötyä. |
| Muokkaa vakioaamiaista | Omat ateriat → Muokkaa mallia → Tallenna uusi versio | Vaikuttaa tuleviin kirjauksiin, ei historiaan. Näytetään selkeästi tämä laajuus. |

Yhden painalluksen toiminto käyttää valmiiksi valittua päivää, aterialuokkaa ja oletusmäärää. Yläreunan päiväys pysyy näkyvänä; muu kuin tänään korostetaan myös tekstillä. Epäonnistunutta palvelintallennusta ei ilmoiteta onnistuneeksi. Uudelleenyritys samaan toimintoon käyttää samaa idempotency-tunnistetta; tietoinen toinen kirjaus on eri toiminto. Kahden painalluksen, verkon katkeamisen ja kahden välilehden ei saa synnyttää huomaamattomia tuplia tai ylikirjoituksia.

Käyttäjä voi kirjata ruoan vaikka jonkin komponentin tieto puuttuisi. Merkintä kertoo silloin mitä saatiin ja mitä ei; ravintoyhteenveto ei näytä kokonaisuutta täydellisenä. MVP:n kriittinen testiaamupala valitaan valmiiksi riittävästi lähteistetystä joukosta. Jos käyttäjän tavallinen ruoka ei löydy, pyydetään tuotetarkennus/korjauspyyntö tai sallitaan selvästi ravintotiedoton merkintä erillisenä, ei salainen 0-arvo. Tämän tukitarve ja sen vaikutus arvolupaukseen mitataan ennen laajaa avausta.

### 6.2 Suunniteltu ja syöty ovat eri tilat

Tulevan kalenterin merkintä on `PLANNED` tai `CONSUMED`; poistettu ei kuulu kumpaankaan summaan. Tulevan päivän oletustoiminto on Suunnittele, ei Kirjaa syödyksi. Pelkkä ajan kuluminen ei vaihda tilaa. Merkitse syödyksi vaatii käyttäjän toiminnon ja todellisen määrän; sitä ei toteuteta sekä uutena syötynä että vanhan syödyn kopiona.

Päivän Toteutunut-yhteenveto laskee vain syödyiksi merkityt, poistamattomat snapshotit. Suunnitelma-yhteenveto on erillinen ja nimetty. Syödyksi merkitty suunnitelma poistuu suunnitellun summasta. Aamupalaa ei automaattisesti toisteta joka aamu toteutuneena; mahdollinen myöhempi toisto luo suunnitelmia tai muistutuksia, ei väitettä syömisestä.

MVP:ssä riittävät tänään/aiempi päivä ja päivän tiedot. Tulevaisuuden suunnittelu, viikkokalenteri ja vertailu tulevat P4:ssa. Käyttäjän oma aikavyöhyke ja tarkoitettu paikallinen päivä säilytetään erillään palvelimen UTC-tallennusajasta. Matka tai kesäaika ei siirrä vanhoja aterioita automaattisesti toiselle päivälle.

### 6.3 Snapshot ja jäljitettävyys

Kirjaus sisältää omistajan, merkintä-ID:n, paikallisen päivän/aterialuokan, syöty/suunniteltu-tilan, määrän ja yksikön, lähde-/ateriamallirevision sekä kirjaushetken hyväksytyn ravintoprofiilin kopion/digestin. Lähteet, menetelmä, arvotilat, kattavuus ja yksiköt pysyvät mukana. Nutrition Coren yhteisestä profiilista ei tehdä henkilökohtaista Core-tietuetta; käyttäjän merkintä ja syömistieto ovat vain Diaryssa.

Reseptin uuden version tai Core-korjauksen saapuminen ei vaihda historiaa. Mahdollinen virhe huomautetaan erillisellä tiedolla; käyttäjä voi myöhemmin valita erikseen korjatun tuloksen, jos tällainen toiminto toteutetaan. Tilin poistamista tai lakisääteistä poistovelvoitetta ei estetä muuttumattomuuden nimissä. Ateriamallin päivitys, päiväkirjamerkinnän määrämuutos ja lähdekorjaus ovat kolme eri tapahtumaa.

## 7. VHH, Keto, hiilihydraatit ja GK

### 7.1 Ymmärrettävä hiilihydraattisopimus

Näytetään erikseen netto- ja projektin kokonais-CHO, grammaa kirjattua annosta kohti. Nykyinen kokonais-CHO tarkoittaa normalisoitua saatavaa hiilihydraattia+kuitua+polyoleja; lähteiden eri CHO-määritelmiä ei yhdistetä sanan total tai available perusteella. Laskenta, polyolien näyttö ja lähdeversiot pysyvät hyväksytyn menetelmän mukaisina.

Päivän hiilihydraattitavoite on käyttäjän itse valitsema numeerinen tavoite ja valittu netto-/kokonaismittari. Palvelu ei aseta automaattisesti henkilölle sopivaa ketorajaa ilman erillistä lähteistettyä menettelyä. Sama 20 g ei ole sama tavoite netto- ja kokonaismääritelmällä. Tavoitteen muuttaminen ei muuta kirjausten ravintoarvoja; vanhan päivän tavoiteversio voidaan säilyttää vertailun ymmärrettävyyden vuoksi.

Ensimmäinen varmennettu uusi suodatin voidaan rajata esimerkiksi **enintään 5/10/20 g netto-CHO/annos**. Nämä ovat ehdotettuja hakuvalintoja hyväksytylle alkuperäiselle annoskoolle, eivät kliinisiä VHH/Keto-määritelmiä tai automaattinen nykyisten tagien uudelleenluokitus. Puuttuva nettoarvo ei pääse 5 g-suodattimeen. Alkuperäinen annos, grammapaino jos tunnettu ja laskentatila näkyvät, jotta pienentämällä annosta ei synny harhaanjohtavaa ruokaluokkaa.

Nykyisiä toimituksellisia Keto/VHH-tageja ei myydä todistettuna päivän ruokavalion toteutumisena. Ennen uuden ravintoperusteisen Keto-/VHH-luokan käyttöönottoa hyväksytään luokitusversio: raja, käytetty CHO-määritelmä, per annos/per 100 g/päivä-basis, annossäännöt, muut mahdolliset ehdot ja puuttuvuuskäsittely. Jos tätä ei ole ratkaistu, käytetään numeerisia suodattimia ja nykyisen toimituksellisen luokan selitettä. Päivän näyttö voi sanoa esimerkiksi Kirjattu netto-CHO X/Yg, tietoa puuttuu kahdesta merkinnästä; se ei sano Olet ketoosissa.

Numeerinen suodatin tai ruokavaliotermi ei itsessään takaa poikkeusta kaupallisten ravitsemusväitteiden ehdoista. VHH/Keto-sanaston ja numeeristen nostojen kaupallinen käyttö tarkistetaan samassa myöhemmässä väiteportissa; nykyisiä tageja ei muuteta tässä suunnitelmassa.

### 7.2 GK:n tuotemerkitys ja raja

GK näyttää nykyisen hyväksytyn menetelmän mukaisen ainesosamallin, valmistusvastaavuuden ja luottamustason. Se ei ole valmiin aterian mittaus tai käyttäjän verensokerivasteen ennuste. Annos- tai reseptimuutos voi invalidioida GK:n, vaikka proteiini olisi laskettavissa. Omaan ateriaan yhdistettyjen reseptien GK:ta ei esitetä validoituna yhdistelmäaterian vasteena; mahdollinen summa vaatii oman menetelmä-/sovelluspäätöksen.

MVP:n päiväyhteenvedossa ei tarvita päivittäistä GK-pistemäärää, tavoitetta tai liikennevaloa. Reseptin/aterian hyväksytyt GK-tiedot voivat näkyä lähteineen. Päivän tai viikon GK-yhteenveto on myöhempi erikseen arvioitava menetelmä, ei tavallinen numeroiden summa tai Plusin lupaus. Palvelu ei annostele insuliinia, neuvo lääkitystä tai päättele henkilökohtaista lääkehoitoa.

## 8. Mikroravinteet ja tiedon esittäminen

Nutrition Core mahdollistaa pitkän aikavälin laajennuksen; sen suunnitelma ei osoita kaikkien tietojen olevan saatavilla. Mikrojen julkaisu etenee ravintotekijä ja käyttötapa kerrallaan.

| Näkymä | Ehdotettu esitys | Hyväksyntäehto |
|---|---|---|
| Reseptikortti | Enintään 1–2 olennaista numeerista arvoa, esim. Magnesium Xmg/annos; Lisää ravintotietoja | Komponentin laskenta, määrä, basis ja näyttö ovat hyväksyttyjä. Ei valmiiksi lähde-/runsas-väitettä. |
| Reseptisivu | Ryhmitetty profiili, saatava arvo tai Ei tietoa; lähde/menetelmä ja kattavuus avattavissa | RE/RAE, folaattimuodot ja muut määritelmät näkyvät oikein; ei osien ja kokonaissumman kaksinkertaista laskentaa. |
| Päivä | Kirjattujen aterioiden tunnettu määrä ja puuttuvat merkinnät per ravintotekijä | Suunnitellut ateriat erillään. Osasumma ei ole päivän täydellinen saanti. |
| Viikko/pidempi aika | Kirjattujen päivien yhteenveto ja mittausjakson kattavuus | Kirjaamattomat päivät eivät 0; puuttuvan tiedon muutos ei näytä käyttäytymistrendiltä. |
| Saantisuosituksen vertailu | Myöhempi kohderyhmäkohtainen, lähteistetty vertailu | Viitearvon tyyppi, lähde/päiväys, ikä-/muu soveltuvuus ja turvallinen esitystapa hyväksytty. Ei automaattista puutosdiagnoosia. |

Nykyinen reseptin neljän makroarvon yhteinen hyväksymis-/pidätyspolitiikka säilyy: pidätetystä laskennasta ei palauteta valikoituja arvoja tämän tuotteen nimissä. Päiväkirjan osittainen yhteenveto perustuu vain jo hyväksyttyihin, snapshotissa sallittuihin arvoihin ja kertoo kokonaisuuden puutteet. Uusi reseptin komponenttikohtainen laskenta vaatii Nutrition Coren erillisen menetelmä- ja julkaisupäätöksen.

Kattavuus on ravintotekijäkohtainen. Proteiini voi olla laskettavissa vaikka jodi puuttuu. Massaltaan pieni puuttuva suolarivi voi silti ratkaista natriumin; pelkkä 90% massakattavuus ei tarkoita 90% ravintomäärästä. Lähteen 0, puuttuva, trace ja johdettu arvo erotetaan. Esimerkiksi tunnettu B12-osuus 0,8µg yhdestä osasta ja muiden osien puute näytetään osuutena, ei aterian tai päivän B12-yhteismääränä.

Ennen sanoja B12-vitamiinin lähde, runsas magnesium tai saman merkityksen antavaa merkkiä tehdään EU-väitearvio: sallittu väite, kyseisen vitamiinin/mineraalin merkittävä määrä, oikea 100 g/100 ml/annos-perusta, ruokatyyppi ja riittävä näyttö. High-väitteen kynnys ei ole sama kuin source-väitteen. Pelkkä suhteellisen suuri luku muiden reseptien joukossa ei riitä. Myös contains-tyyppinen markkinointiväite voi kuulua sääntöihin. Alkuun turvallinen ratkaisu on neutraali numeerinen ravintotaulukko; väitteet avataan vasta erillisellä hyväksynnällä. [Euroopan komission ravitsemusväiteohje](https://food.ec.europa.eu/food-safety/labelling-and-nutrition/nutrition-and-health-claims/nutrition-claims_en).

## 9. Mobiilikäyttö, saavutettavuus ja PWA

### 9.1 Tuotteen käyttöliittymäperiaatteet

Tänään-näkymän ensimmäinen ruutu näyttää valitun päivän, suosikkiateriat ja Kirjaa-painikkeet. Päivän tunnetut hiilihydraatit ja haluttaessa proteiini ovat nopeasti luettavissa. Laajempi profiili ja lähteet avautuvat läheltä lukua, ilman että tekniset kenttäkoodit peittävät perustekemisen. Puuttuvasta tiedosta on silti oltava ymmärrettävä merkki numeron vieressä.

```text
Tänään  [päivä ja kalenterin avaus]
Omat suosikit
Oma aamupala     1 annos   [Kirjaa]
Tavallinen lounas 1 annos  [Kirjaa]
[Lisää ruoka tai resepti]

Syödyt: Aamiainen · Lounas · Päivällinen · Välipala
Kirjattu netto-CHO … g  [Tiedon kattavuus]
[Tarkemmat ravintotiedot]
```

Tämä on toiminnallinen luonnos, ei toteutettu design tai hyväksytty lopullinen asettelu. Numerot ovat käyttäjän aterioista, eivät painonpudotuspisteitä. Plus ei ole pysyvä modaalinen este.

Keskeiset säännöt:

- Valmiiksi valittu yleinen määrä ja viimeisin luokka vähentävät työtä, mutta käyttäjä näkee ne ennen syödyn määrän vahvistamista. Oletus ei ole piilotettu mittaustulos.
- Määrän napautus avaa yhden kevyen muokkaimen: annokset tai lähteistetyt grammat. 0,5 hyväksytään syödyksi osuudeksi; nykyisen reseptin kokonaisannossäätimen minimiä 1 ei kopioida tähän.
- Paikalliset desimaalierottimet, selkeät g/ml/kpl-yksiköt ja FI/EN/SV/TH-tekstit. Thai-sanapituudet ja rivittyminen testataan oikealla kielellä.
- Päätoiminto on saavutettavissa yhdellä kädellä; tuotetavoite 44–48 CSS-pikselin kosketusalueille. Luokkaa, tilaa tai virhettä ei ilmaista vain värillä.
- Tallennus antaa yksiselitteisen palautteen; verkon katketessa luonnos säilyy hallitusti, mutta sitä ei lasketa syödyksi ennen vahvistettua palvelintallennusta. Offline-lupaus ei kuulu MVP:hen.
- Ei pakollista kehonmitta-/tavoite-/uutiskirjekyselyä ennen ensimmäistä aamiaista. Tavoitteet voi ohittaa; tuotteeseen liittyvä suostumus ja tarpeellinen tietosuojainfo ovat eri asia kuin markkinointi.
- Ei syyllistäviä punaisia päiviä tai pakollista streakia. Kirjaamaton ei tarkoita huonoa syömistä. Häiriöherkkien käyttäjien tarpeet arvioidaan ennen automaattisia rajoitus- tai laihdutuskehotuksia.

### 9.2 Mitattavat käytettävyystavoitteet

Tavoitteet koskevat toimivaa kirjautunutta istuntoa, ladattua Tänään-näkymää ja palvelimen vahvistamaa tallennusta. Aloituskirjautumista ei piiloteta mittaukseen mutta raportoidaan erikseen. Tavoite ei ole vielä saavutettu:

| Tehtävä | Alustava tavoite | Mittaus |
|---|---|---|
| Tuttu suosikkiateria | Mediaani alle 5 s, p90 alle 10 s | Aterian valinnan alusta vahvistettuun tallennukseen; virheet erikseen |
| Uusi valmis resepti | Mediaani alle 15 s valitulta reseptisivulta, p90 alle 30 s | Sisältää annoksen tarkistuksen ja kirjauksen; reseptin etsimisen aika raportoidaan lisäksi |
| Vakioaterian luonti | Yksi rakennusnäkymä; alustavasti mediaani alle 3 min valmiista tuotevalikoimasta | Tuote-/määrävirheet, avuntarve ja puuttuvat tuotteet mukana; tavoite ei korvaa lähdetarkkuutta |
| Kopiointi ja korjaus | Vähintään 80% testitehtävistä ilman ohjausta | Oikea päivä/määrä, vanhan mallin vs merkinnän ero ymmärretään |
| Luotettavuus | Ei havaittuja huomaamattomia tuplia/valetallennuksia kriittisissä testitapauksissa | Kaksoisnapautus, retry, istunnon vanheneminen ja kaksi laitetta |

Aloitus: 6–8 aikuisen moderoitu synteettisillä tiedoilla tehtävä testi, mukana toistuvien aterioiden käyttäjiä ja erilainen puhelintottumus. Lisäksi vähintään 2 saavutettavuuteen keskittyvää tehtävätestiä näppäimistöllä/ruudunlukijalla; pienestä ryhmästä ei päätellä koko kohderyhmän saavutettavuutta. Korjataan ensin toistuva kriittinen ongelma, sitten uusi pieni testi. Ei suurta testikierrosta muuttumattomalle prototyypille.

Tavoitteena WCAG 2.2 AA: näkyvä kohdistus, oikeat otsikot/lomake-nimet, näppäimistötoiminnot myös kalenterissa ja määränsäädössä, luettavat virheet, ilmoitus tallennuksesta apuvälineelle ja skaalautuva teksti. Tavoite on tuotepäätös, ei väite nykyisestä lakisääteisestä sertifioinnista. Maksullisen verkkopalvelun soveltamisala ja mahdollinen mikroyritysrajaus tarkistetaan ennen julkaisua. [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/), [Traficomin soveltamisala](https://saavutettavuusvaatimukset.fi/fi/soveltamisala-kuulummeko-lain-piiriin).

### 9.3 Web ensin, PWA ehdollisesti

Responsiivinen web on MVP:n suositus: reseptistä päiväkirjaan pääsee linkillä, yksi käyttöliittymä ja päivityspolku. Asennettava PWA voi parantaa puhelimen kotinäyttöön palaamista, mutta sen hyöty mitataan ennen offline-/push-toteutusta. PWA-asennus ei yksin tee tiedoista offline-saatavia tai sovelluksesta natiivia; service worker ja cache ovat erillisiä ratkaisuja. [MDN:n offline-/taustatoiminnan kuvaus](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation).

MVP ei välimuistita yksityisiä API-vastauksia yleiseen sivustocacheen. Uloskirjautuminen ei saa jättää toisen käyttäjän aterioita näkyviin yhteisellä laitteella. Myöhempi offline-kirjaus tarvitsee laitekohtaisen säilytys-/poistopolitiikan, käyttäjän valinnan, synkronointiristiriidat ja uuden tietoturva-arvion. Natiivia iOS/Android-sovellusta arvioidaan vasta, jos käyttäjät näyttävät tarvitsevansa kotinäyttöä syvempää laiteintegraatiota ja lisäylläpito on kannattavaa. Sovelluskauppamaksut ja -säännöt eivät sisälly web-hinnoittelun laskelmaan.

## 10. Tietosuoja, turvallisuus ja maksupalvelun rajat

### 10.1 Tietoluokat ja käsittelyperuste

Nutrition Core säilyttää yhteistä lähdekoostumusta ilman käyttäjätilejä. Julkiset reseptit sisältävät vain julkaistavaa aineistoa. Diary sisältää käyttäjän omat ateriat, syömiset ja tavoitteet. Auth/tilaus sisältää tarpeelliset tunnistus-/maksutilaviitteet, ei ravintohistoriaa. Sama käyttäjätili voi palvella brändin yksityisiä toimintoja, mutta julkinen lukeminen ei tarvitse sitä.

Ruokapäiväkirja on henkilötietoa ja voi sisällön, yhdistelmien tai tarkoituksen vuoksi paljastaa terveystietoa. Ei oleteta, että hyvinvointipalvelu tai pelkän diagnoosikentän puuttuminen poistaisi GDPR 9-vaatimuksen. Ennen oikeita tietoja määritellään rekisterinpitäjä, käsittelytarkoitukset, artiklan 6 perusteet ja tarvittaessa artiklan 9 poikkeus. Nimenomainen suostumus on arvioitava ehdokas, ei automaattinen lupa kaikelle; sopimus ei yksin poista erityisten tietoryhmien ehtoja. Markkinointi, tarpeeton profilointi tai tutkimuskäyttö eivät sisälly peruskirjauksen suostumukseen. [Komission erityisten tietojen ohje](https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/legal-grounds-processing-data_en), [EDPB:n vaikutustenarviointi](https://www.edpb.europa.eu/sme/be-compliant/be-compliant_en).

P2:ssa tehdään kirjallinen riskikartoitus ja DPIA-tarpeen arvio; korkean riskin käsittelyssä DPIA ennen käsittelyä. Pieni yritys tai pilotti ei itsessään tee arkaluonteisesta tiedosta riskitöntä. Henkilökohtainen saantianalyysi ja myöhempi ammattilaiskäyttö voivat muuttaa arviointia. Tarvittava tietosuoja-/kuluttajaoikeusasiantuntijan tarkistus budjetoidaan, ei korvata tällä tuotevisiolla.

Minimitiedot: sisäinen user-ID, kirjautumiseen tarvittava osoite/tunnistusviite, kieli/aikavyöhyke, ateriamallit ja merkinnät. Ei pakollisia diagnooseja, lääkityksiä, syntymäpäivää, sijaintia tai painoa. Käyttäjän aterian nimi voi itsessään sisältää arkaluonteista tietoa, joten sitä ei lähetetä julkiseen analytiikkaan tai maksupalvelun metatietoon.

### 10.2 Tunnistus ja istunnot

Suositus on hallittu tunnistus tai hyvin ylläpidetty valmis ratkaisu, ei itse rakennettu salasanavarasto. Vaihtoehtoina lyhytikäinen kertakäyttöinen sähköpostikoodi/-linkki ja myöhemmin passkey. Valinta tehdään toimitusvarmuuden, palautuksen, kustannuksen ja tietojenkäsittelyehtojen perusteella. Salasanattomuus ei poista tilikaappauksen tai sähköpostin väärinkäytön riskiä.

Yksityinen rajapinta tarkistaa palvelimella sekä istunnon että jokaisen ateria-/merkintä-/vientipyynnön omistajan. Asiakkaan lähettämä user-ID, vaikeasti arvattava URL tai käyttöliittymän piilotus ei riitä. Alkuperä/sessio/CSRF-suojaus, turvalliset cookie-asetukset, rate-limit, uudelleentunnistus vientiin/tilin poistoon ja hallittu palautus kuuluvat P2–P3:n välttämättömiin vaatimuksiin. HttpOnly/Secure/SameSite ja CSP suunnitellaan kokonaisuutena; SameSite ei yksin korvaa CSRF-torjuntaa. [OWASP-istunto-ohje](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).

Julkinen staattinen julkaisu ei sisällä Diary-salaisuuksia, käyttäjä-JSONia tai Diary-kirjoitusbindingiä. Samalla originilla toimivan julkisen ja yksityisen käyttöliittymän XSS-/service-worker-riski arvioidaan; erillinen origin voi vahvistaa rajaa, mutta ei korvaa rajapinnan oikeustarkistusta. P2 valitsee tallennuspalvelun vasta käsittelysopimusten, siirtojen, alueellisten vaatimusten ja palautusmahdollisuuden perusteella. Pelkkä Cloudflare-nimi tai EU-sijaintiasetus ei todista koko käsittelyketjun vaatimustenmukaisuutta. [EDPB: käsittelijäsopimus](https://www.edpb.europa.eu/sme/learn-the-basics/data-controller-or-data-processor_en), [kansainväliset siirrot](https://www.edpb.europa.eu/sme/be-compliant/international-data-transfers_en).

### 10.3 Vienti, poisto, säilytys ja palautus

Tietojen vienti ja tilin/tietojen poisto ovat maksuttomia myös Plusin päätyttyä. Käyttöliittymä erottaa yhden merkinnän poiston, mallin arkistoinnin, tilauksen lopetuksen ja koko tilin/tietojen poiston. Poisto ei ole markkinoinnin retentiotemppu. Identiteetti varmistetaan asianmukaisesti; rekisteröidyn oikeudet ja niiden soveltuminen suunnitellaan ennen pilottia. [EDPB:n oikeusohje](https://www.edpb.europa.eu/sme/be-compliant/respect-individuals-rights_en).

Ehdotetut, P2:ssa hyväksyttävät säilytysoletukset: Diary aktiivisen palvelun ajan; käyttäjän poistama tieto pois aktiivisesta käsittelystä viipymättä tavoitteen mukaan, viimeistään sovitun teknisen käsittelyajan kuluessa; salatut kiertävät varmistukset enintään 30 vrk; suppeat suojauslokit esimerkiksi 14–30 vrk. Nämä eivät ole väite kaikkien tietojen lakisääteisestä säilytysajasta. Tilaus-/kirjanpitotiedot säilytetään omalla lakiperusteellaan ja aikataulullaan erillään aterioista. Poistetun tilin tietoja ei palauteta asiakaspalvelun helpottamiseksi pysyvästä arkistosta.

Varmistukset ovat yksityisiä ja salattuja; avaimet erikseen, ylläpito-oikeudet rajatut. Palautusharjoitus ennen oikeaa pilottia. Palautus ottaa huomioon poistojen lokin: vanha backup ei saa aktivoida uudelleen poistettua tiliä, suostumusta tai aterioita. Käyttäjälle kerrotaan varmistusten kierto ja aktiivisen datan poiston eteneminen. Ensimmäiset tavoitteet RPO 24 h/RTO 4 h ovat vasta mitattavia tavoitteita, eivät valmiita palvelulupauksia. Core-/media-varmistus ei yksin varmuuskopioi Diarya.

Tietoturvapoikkeamalla on nimetty vastuuhenkilö ja selvitys-/ilmoitusprosessi. Viranomaisilmoituksen 72 h sääntö riskiehtoineen huomioidaan; kaikkia poikkeamia ei käsitellä samoin eikä ilmoitusta odoteta kuukausiraporttiin. [EDPB:n poikkeamaohje](https://www.edpb.europa.eu/sme/assess-the-risks/data-breaches_en).

### 10.4 Maksut ja kaupallinen tietosuoja

Maksupalvelulle vain tarpeelliset tilaus-/asiakas-/maksutiedot. Ei ruokalistaa, hiilihydraattitavoitteita, terveystulkintoja tai päiväkirjan raakatekstiä Checkoutin kenttiin, kuitteihin, webhooks-lokeihin tai mainonnan yleisöihin. Korttitiedot käsitellään valitun palvelun maksunäkymässä, eivät Recipavon omassa tallennuksessa. Maksun tila ja Diaryn omistusoikeus ovat eri valtuutuksia.

Plus-oikeus päivitetään varmennetun palvelinviestin perusteella; toistuvat tai myöhästyneet viestit eivät kaksinkertaista tilausta. Tilauksen lopettaminen ei poista tiliä eikä jää verkkokauppasivun piilolinkiksi. Tarjotaan tilan, seuraavan veloituksen, lopetuksen ja vahvistuksen ymmärrettävä polku. Lakisääteinen etäsopimuksen peruuttamistoiminto on eri asia kuin uusiutumisen lopetus: KKV:n nykyohje huomioi 19.6.2026 alkaen verkkosopimuksen peruuttamistoiminnon. Digipalvelun, digitaalisen sisällön ja aloitussuostumusten erot tarkistetaan ennen P7:ää, ei oleteta kaiken olevan palautuksetonta. [KKV:n peruuttamisohje](https://www.kkv.fi/kuluttaja-asiat/tietoa-ja-ohjeita-yrityksille/verkkokauppiaille/peruuttamisoikeus-ja-peruuttamisaika/).

## 11. Freemium, Plus ja hintahypoteesit

### 11.1 Ilmainen arvo ei ole pelkkä kokeilu

| Ilmainen ydin | Plus-ehdokas, vasta lisäarvon validoinnista |
|---|---|
| Julkiset reseptit, haku, nykyiset olennaiset ravinto-/GK-tiedot ja selitteet | Laajennetut ymmärrettävät 30/90/365 päivän trendit ja vertailut |
| Peruspäiväkirja, omat vakioateriat, yhden painalluksen kirjaus ja eilisen kopiointi | Joustavat tavoiteprofiilit ja käyttökelpoiset ateriavaihtoehtojen vertailut |
| Omien merkintöjen muokkaus/poisto, päivän tiedot ja perustason viikkokatsaus | Ravintotekijäkohtaiset edistyneet analyysit, jos kattavuus ja menetelmä riittävät |
| Omat nykyiset kirjaukset ja lähdetiedon ymmärrettävä saatavuus | Mahdolliset aidosti aikaa säästävät suunnittelu-/organisointityökalut myöhemmästä testistä |
| Tietojen vienti, tietosuojavalinnat ja tilin/tietojen poisto | Ei yksityisyyttä, oikeuksia tai tietojen korjausta maksumuurin taakse |

Maksuttoman peruskirjauksen ei tarvitse loppua seitsemässä päivässä. Tärkeintä yhden painalluksen toimintoa tai vanhojen omien merkintöjen katselua ei lähtökohtaisesti lukita Plusin taakse. Palvelun tasapuoliset väärinkäyttö-/resurssirajat voivat olla tarpeen, mutta ne eivät ole näennäistä käytettävyyden rajoittamista tilauspainostusta varten. Mahdolliset määrälliset rajat päätetään todellisen kustannusnäytön jälkeen ja kerrotaan ennen käyttöä.

Plus ei saa näyttää puuttuvista tiedoista tekaistua täydellistä vitamiini-/terveysanalyysia. Laajemmat mikrot eivät yksin ole vahva kaupallinen peruste, kun Cronometer tarjoaa niitä jo ilmaiseksi. Myöhempi maksettu arvo on ymmärrettävyys, pidemmän ajan hyödyllinen tulkinta ja käyttäjän omaan rutiiniin sopiva ajansäästö; tämä on vielä hypoteesi.

Ehdotettu yksityisyys-/kokemuslinja: ei kohdennettua mainontaa eikä kolmannen osapuolen mainos-SDK:ta päiväkirjassa. Ilmainen käyttäjä rahoitetaan kannattavan maksullisen osuuden tai omistajan erillisen budjetin avulla, ei oletetulla terveystiedon rahastuksella. Mallin ilmaisten käyttäjien kustannus pitää siksi näkyä taloudessa.

### 11.2 Hintojen testaus

| Vaihtoehto | Kuluttajahintainen hypoteesi | Testattava kysymys |
|---|---|---|
| Edullinen lähtökohta |3,90 €/kk ja 34,90 €/v | Riittääkö koettu arvo ja jääkö tuen jälkeen riittävä kate? |
| Ensisijainen vertailuehdotus |4,90 €/kk ja esimerkiksi 44,90 €/v | Säilyykö maksuhalukkuus suhteessa parempaan yksikkökatteeseen? |
| Korkeampi vertailu |5,90 €/kk ja esimerkiksi 54,90 €/v | Maksavatko käyttäjät aidosti näytetystä Plus-hyödystä vai putoaako kysyntä? |

Vuosihinnat 44,90/54,90 ovat tämän suunnitelman uusia testiehdotuksia, eivät lukittuja hintoja. 34,90 on suhteessa 3,90×12 noin 25,4% halvempi. Sama 34,90-hinta 4,90-kuukausivaihtoehdon rinnalla olisi jo noin 40,6% alennus; sitä ei tule valita vahingossa vain vanhan numeron säilyttämiseksi. Vuosialennus ja etukäteinen sitoutuminen testataan erikseen.

P6:ssa käytetään realistista Plus-näkymää ja hinnan kokonaissummaa, ei pelkkää kysymystä maksaisitko jostain paremmasta. Alkuun haastattelu ja kiinnostusvalinta, ei tekaistu kassaveloitus. Avoimesti kiinnostuslistaksi merkitty valinta ei ole toteutunut osto. P7:ssa mahdollinen rajattu oikea maksukoe vaatii erillisen toteutus- ja myyntiluvan, ehdot ja palautusmenettelyn.

Kansainvälinen hinta ei ole vain eurohinnan valuuttamuunnos. Ennen uutta markkinaa tarkistetaan ostovoima, paikallinen kilpailu, vero, maksutavat, tuen kieli ja paikalliset tietolähteet. Checkout näyttää jakson koko hinnan, verot ja uusiutumisrytmin paikallisesti ymmärrettävästi. Käyttäjän terveystietoon perustuva personoitu hinta ei kuulu suunnitelmaan. Dollari-/eurovertailusta ei päätellä että Recipavo olisi jokaisessa maassa halvin.

## 12. Talousmalli: tulot, kulut ja hyödyllinen omistajatulo

### 12.1 Mallin rajaus ja lähteet

Kaikki alla olevat tilaajamäärät ovat skenaarioita, eivät ennusteita. Ei oleteta, että 100 tai 5 000 tilaajaa syntyisi nykyisestä tuntemattomasta liikenteestä. Laskelma tarvitsee testattavat konversio-, pysyvyys- ja tukikuormaoletukset.

Peruslaskelma:

- Hinta 3,90 €/kk kuluttajalta, kaikki maksavat kuukausittain; 100/250/500/1 000/5 000 tilaajaa.
- Suomen ALV 25,5% skenaario. Brutto jaetaan 1,255:llä verottoman myynnin saamiseksi; ALV ei ole 25,5% brutosta. Oletetaan ALV-rekisteröity myynti eikä rakenneta kannattavuutta mahdollisen pienyrityspoikkeuksen varaan. Palveluluokitus ja yrityksen tilanne tarkistetaan ennen myyntiä. Kyse ei ole ruokatuotteen hinnan verokannasta. [Verohallinnon verokannat](https://www.vero.fi/en/businesses-and-corporations/taxes-and-charges/vat/rates-of-vat/).
- Maksumallioletus: Stripe standard EEA-kortti 1,5%+0,25 € ja Billing 0,7% volyymista, yhdessä laskennallisesti 2,2% brutosta+0,25 €/maksu. Tämä ei ole palveluntarjoajavalinta. Premium-/UK-/muut kortit, FX, Stripe Tax, refundit ja riidat voivat muuttaa summaa. [Stripe Finland pricing](https://stripe.com/en-fi/pricing).
- Hyvitys-/maksuriitavaraus 1% bruttolaskutuksesta. Oma stressivaraus, ei havaittu refund-rate. Varsinainen veron-/maksun palautus ja kulujen käsittely täsmäytetään kirjanpitoon; varaus ei ole erillinen automaattisesti veloitettava tariffi.
- Maksavia 5% kaikista kuukausiaktiivisista ja tässä yksinkertaistuksessa jokainen maksava aktiivinen. Ilmaisia 19×maksavien määrä. Tämä ei ole nykyinen konversio eikä vaatimus jokaiselle tulevalle kohortille.
- Tukipyyntöjä kuukaudessa: maksavista 2%, ilmaisista 0,5%; 12 min/käsittely, työn laskennallinen arvo 35 €/h. Tukikulu on `(0.02N+0.005×19N)×0.2h×35€ =0.805N €/kk`. Tämä voi sisältää omistajan työtä, ei välttämättä ulkoista laskua.
- Ylläpito erikseen 12/12/16/24/40 h/kk ×35 € tilaajaportaittain; ei samaa tukityötä tai hankintatyötä uudestaan. Työarvo ei ole väite markkinapalkasta eikä omistajan nettopalkka.
- Muut kulut ja markkinointi ovat näkyviä budjettivarauksia: tunnistus/sähköposti, kirjanpito, sopimukset/oikeudet, pienet palvelut sekä hankintaan käytetty raha/työ. Hankintatyötä ei piiloteta ylläpitotuntiin. Tarjoukset ja todellinen kulurakenne tarvitaan myöhemmin.

Cloudflare-sarake on **euromääräinen kokonaisbudjettivaraus**, ei USD-hinnaston valuuttamuunnos tai käyttömääristä jo mitattu lasku. Se kattaa valitun osuuden nykyisestä Paid-tilauksesta, resepti/Core/Diary-käytön, median, stagen ja varmistuksen. Aiempi enintään 5 USD/kk lisäkulutavoite pysyy toteutusporttina: jos uusi vaihe ylittää sen, tarvitaan nimenomainen uusi budjettipäätös. Suuremmat taulukon varaukset eivät sellaisenaan valtuuta ylitystä.

D1:n laskutus perustuu riveihin ja tavuihin, R2:n säilytykseen sekä A/B-operaatioihin ja yksikköpyöristykseen. Muut projektit voivat käyttää sisältyviä osuuksia; niitä ei ole varattu päiväkirjalle. Tässä ei luvata tiettyä MAU-määrää 5 dollarilla. Tarkat tekniset skenaariot ovat erillisessä Nutrition Core -suunnitelmassa, eivät kopioitu tässä. [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/), [R2 pricing](https://developers.cloudflare.com/r2/pricing/).

### 12.2 Peruslaskelma 3,90 €/kk

Taulukot ovat laskennallisia €/kk. Vero- ja maksuerien toteutunut laskukohtainen senttipyöristys voi poiketa hieman; välilaskuja ei pyöristetty ennen lopputaulukkoa.

| Maksavia / oletettu MAU | Brutto € | ALV € | Maksut € | Hyvitysvaraus € | Kate ennen muita kuluja € |
|---|---:|---:|---:|---:|---:|
| 100 / 2000 | 390,00 | 79,24 | 33,58 | 3,90 | 273,28 |
| 250 / 5000 | 975,00 | 198,11 | 83,95 | 9,75 | 683,19 |
| 500 / 10000 | 1 950,00 | 396,22 | 167,90 | 19,50 | 1 366,38 |
| 1000 / 20000 | 3 900,00 | 792,43 | 335,80 | 39,00 | 2 732,77 |
| 5000 / 100000 | 19 500,00 | 3 962,15 | 1 679,00 | 195,00 | 13 663,85 |

| Maksavia | CF € | Tuki € | Ylläpitotyö € | Muut € | Markkinointi € | Rahakate ennen omaa työtä € | Taloudellinen tulos ennen veroja € |
|---|---:|---:|---:|---:|---:|---:|---:|
| 100 | 10,00 | 80,50 | 420,00 | 100,00 | 50,00 | 113,28 | -387,22 |
| 250 | 20,00 | 201,25 | 420,00 | 125,00 | 100,00 | 438,19 | -183,06 |
| 500 | 35,00 | 402,50 | 560,00 | 175,00 | 200,00 | 956,38 | -6,12 |
| 1000 | 60,00 | 805,00 | 840,00 | 250,00 | 400,00 | 2 022,77 | 377,77 |
| 5000 | 250,00 | 4 025,00 | 1 400,00 | 750,00 | 2 000,00 | 10 663,85 | 5 238,85 |


Rahakate ennen omaa työtä vähentää myynnistä ALV:n, maksut, hyvitysvarauksen, CF:n, muut kulut ja markkinointivarauksen. Taloudellinen tulos vähentää lisäksi tuen ja ylläpidon työarvon. Jos nämä tehdään omana työnä, työarvo ei automaattisesti ole verotuksessa vähennyskelpoinen palkkakulu; taloudellinen tulos ei siksi ole suoraan kirjanpidon verotettava tulos tai omistajan käteen jäävä raha. Ulkoistettu työ, palkat, vakuutukset/eläkemaksut ja yritysmuoto täsmennetään todelliseen taloussuunnitelmaan.

Perusmallissa 500 maksavaa on likimain nollatuloksen kohdalla, mutta 1 000 maksavaa ei vielä tuota suurta ylimääräistä taloudellista tuloa. 5 000 voi olla kannattava, mutta oletuksena se tarkoittaa 100 000 MAU:ta ja huomattavaa hankinta-/tukityötä. Tämä ei ole näytetty markkinamahdollisuus tai kapasiteettitesti.

### 12.3 Hintaherkkyys ja vuosimaksun kassavirta

Samat käyttäjä-, tuki- ja kulukehykset; vain hinta vaihtuu. Taloudellinen tulos ennen tuloveroja ja alkuinvestoinnin takaisinmaksua, €/kk:

| Maksavia | 3,90 €/kk | 4,90 €/kk | 5,90 €/kk | 34,90 €/v, periodisoitu/kk |
|---|---:|---:|---:|---:|
| 100 | -387,22 | -310,74 | -234,26 | -440,15 |
| 250 | -183,06 | 8,15 | 199,35 | -315,38 |
| 500 | -6,12 | 376,29 | 758,70 | -270,75 |
| 1000 | 377,77 | 1 142,58 | 1 907,40 | -151,50 |
| 5000 | 5 238,85 | 9 062,91 | 12 886,98 | 2 592,49 |


Vuosimallissa 34,90 €/asiakas laskutetaan kerran vuodessa, maksun kiinteä osa kerran. Analyysin brutto, vero, maksut ja riskivaraus periodisoidaan 12 kuukaudelle. Kaikkien asiakkaiden ensimmäisen vuoden ennakkokassa ei ole saman kuukauden ansaittu tulos; tulevien kuukausien palvelu ja mahdolliset refundit pitää rahoittaa. ALV:n todellinen ilmoitusaika ei muutu tämän vertailutaulukon kuukausijaoksi. Oikean tilauskannan kuukausi-/vuosimix mallinnetaan myöhemmin todellisista kohorteista.

5% maksavien osuus on freemiumin ratkaiseva oletus. Jos osuus on 2%, ilmaisia on 49 per maksava ja sama tukimalli maksaa 1,855 €/maksava/kk, eli 1,05 € enemmän kuin perusta. 1 000 maksavalla se vähentää tulosta 1 050 €/kk: 4,90-vaihtoehdon 1 142,58 € jää noin 92,58 euroon ennen alkuinvestointia. Jos tikettimäärä kaksinkertaistuu, kulut kasvavat toisin kuin pelkkä D1-lasku. Hinta ei yksin ratkaise kallista tuote-/datakorjausta tai epäselvää käyttöliittymää.

### 12.4 Kustannusten kattaminen ja tulotavoite

Tarkastellaan kahta **kiinteää suunnittelukehystä**: 1 550 €/kk (ylläpito 840, CF 60, muut 250, markkinointi 400) ja kasvukehys 4 400 €/kk (ylläpito 1 400, CF 250, muut 750, markkinointi 2 000). Tukikulu 0,805 €/maksava/kk skaalautuu erikseen. Hinnan nettomarginaali vähentää jo ALV:n, maksut, riskivarauksen ja tämän tuen. Tarvittava määrä = ylöspäin pyöristetty `(kiinteät kulut+tavoiteltu tulos)/yksikkömarginaali`.

| Hinta | Nettomarginaali/tilaaja ennen kiinteitä € | Kulut katettu: kiinteä 1 550 €/kk | +1 000 € tulos: sama kehys | +2 500 € tulos: sama kehys | Kulut katettu: kasvukehys 4 400 €/kk | +1 000 €: kasvukehys | +2 500 €: kasvukehys |
|---|---:|---:|---:|---:|---:|---:|---:|
| 3,90 €/kk | 1,93 | 805 | 1323 | 2101 | 2283 | 2802 | 3580 |
| 4,90 €/kk | 2,69 | 576 | 948 | 1505 | 1635 | 2006 | 2563 |
| 5,90 €/kk | 3,46 | 449 | 738 | 1172 | 1273 | 1562 | 1996 |
| 34,90 €/v | 1,40 | 1109 | 1824 | 2896 | 3147 | 3862 | 4934 |


Esimerkiksi 4,90 €/kk tarkoittaa näillä kahdella kehyksellä noin 576–1 635 maksavaa kulujen kattamiseen, 948–2 006 tuottamaan lisäksi 1 000 €/kk ja 1 505–2 563 tuottamaan lisäksi 2 500 €/kk ennen tuloveroja. Kiinteää kehystä ei saa pitää muuttumattomana käyttäjämäärän kasvaessa rajatta. Taulukot havainnollistavat riippuvuudet; todellinen tukikuorma, ilmais-/maksavien suhde ja kustannusjakopäätös voivat siirtää rajoja paljon.

Alkuinvestointi erikseen: pienelle tuotantokelpoiselle MVP:lle alustava 200–400 h kokonaiskehitystyön haarukka, 35 €/h työarvolla 7 000–14 000 €, lisäksi esimerkiksi 1 500–5 000 € oikeus-/tietosuoja-/saavutettavuus-/pilotointityöhön. Nämä eivät ole tarjouksia tai valmiin toteutuksen lupaus; laajat mikrot, natiivit sovellukset ja kansainväliset maksut eivät sisälly. Omistajan oma työ ei tee investoinnista taloudellisesti nollaa. Esimerkin 12 000 € takaisinmaksu 24 kuukaudessa vaatii 500 €/kk lisää katetta, noin 186 lisämaksavaa 4,90-hinnan yksikkömarginaalilla samoissa oletuksissa.

### 12.5 Maksumalli ja verotuksen laajentuminen

Stripe-tyyppinen PSP+Billing on matalan lipun maksussa vertailukelpoinen, mutta ALV/OSS, kuluttajaehdot ja asiakastuki eivät katoa. Vaihtoehtona Merchant of Record: Paddle ilmoittaa 5%+US$0,50/tapahtuma ja veron-/maksunkäsittelyä. Tämä ei ole 0,50 €-tariffi eikä päätös sen soveltuvuudesta; hyväksyntä, valuutta ja sopimus tarkistetaan. Kiinteän kulun suhteellinen vaikutus on suuri pienessä kuukausimaksussa. [Paddlen virallinen hinnasto](https://www.paddle.com/pricing).

Päätös P6–P7:ssä vertaa kokonaiskustannusta eikä vain korttiprosenttia: käsittely, Billing, mahdollinen Tax, kansainvälinen kortti/FX, palautukset/riidat, verotyö, sopimukset ja maksun tietosuoja. Hostattu maksunäkymä ja helppo itsepalveluperuutus ovat lähtökohtia. Ei P7:ää ennen kuin yritys, myyjän vastuut ja laskutus-/vero-ohje on hyväksytty.

Kansainvälisen EU-kuluttajamyynnin arvonlisävero ei ole automaattisesti Suomen 25,5%. Sähköisten palvelujen myyntimaa, ehdollinen 10 000 € raja ja OSS arvioidaan yrityksen tilanteessa. Ei ekstrapoloida Suomen skenaariota kaikkiin maihin; EU:n ulkopuoli tarkistetaan erikseen P8:ssa. [Verohallinto: OSS](https://www.vero.fi/en/businesses-and-corporations/taxes-and-charges/vat/international-commerce/arvonlis%C3%A4veron-erityisj%C3%A4rjestelm%C3%A4t-onestopshop/).

## 13. Käyttäjähankinta, mittarit ja kasvun ehdot

### 13.1 Hankinnan järjestys

Julkiset reseptit ovat ensimmäinen löytämiskanava: hakuintenttiin sopiva resepti, hyvä mobiilikäyttö, neljän kielen oikeat osoitteet ja ymmärrettävät ravintotiedot. Ei massasisältöä vain hakumäärän oletuksen perusteella. FI/EN/SV/TH eivät automaattisesti tarkoita neljää toimivaa kaupallista markkinaa: käännöksen laatu, paikalliset tuotteet ja tuki vaikuttavat luottamukseen.

Ennen hankintainvestointia selvitetään todellinen sisältö-/hakukysyntä ja tekninen näkyvyys. GSC:n puuttuvasta lähtödatasta ei rakenneta liikenne- tai SEO-kasvuennustetta. Mahdollinen myöhempi mittauksen perustaminen ja sitemap/indexointi ovat omia hyväksyttäviä töitä, eivät tässä tehty toimenpide.

Ensimmäinen polku on reseptiltä hyödylliseen toimintoon: Kirjaa tämä annos tai Tallenna omaksi ateriaksi. Käyttäjä saa julkisen reseptin kokonaan käyttöön ennen kirjautumispäätöstä. Jakaminen säilyttää tavallisen reseptilinkin; sosiaaliseen mediaan ei lisätä päiväkirjaa tai ruokavaliotavoitetta. Ei raskasta markkinointiautomaatiota, seurantapikseleitä tai kampanjatietovarastoa ennen toimivaa tuotetta.

Hankintakanavien järjestys: 1) nykyisen reseptikokemuksen laatu ja luonnollinen haku, 2) vapaaehtoinen reseptien jakaminen, 3) pieni kohderyhmäpilotti avoimella kutsulla, 4) vasta mitatulla arvolla pieni budjetoitu maksettu koe. Tässä ei julkaista kutsuja tai lähetetä viestejä käyttäjille.

### 13.2 Mittarit ja nimittäjät

| Mittari | Ehdotettu määritelmä | Tulkintaraja |
|---|---|---|
| Reseptiltä päiväkirjaan | Päiväkirjan CTA:sta saapuneet / mittauskelpoiset reseptikäynnit | Sessio ei ole sama kuin yksilö. Suostumus- ja mittauskattavuus näkyvät. |
| Rekisteröinnin läpäisy | Valmis tili / aloitetut kirjautumiset | Sähköpostin toimitus ja hylätty linkki eivät katoa tilastosta. |
| Ensimmäinen oma ateria | Oman aterian tallentaneet / uudet käyttökelpoiset tilit | Ei lasketa demo-/automaattisesti luotua mallia käyttäjän teoksi. |
| Aktivointi | Ensimmäisen oman mallin ja vähintään 1 syödyn merkinnän tehneet / uudet tilit | Näyttää ydinpolun, ei pelkkää sivun avausta. |
| Toinen päivä | Seuraavana paikallisena kalenteripäivänä syödyn kirjanneet / aktivoituneet, joille päivä on ehtinyt tulla | Ei sama kuin uusi käynti tai suunniteltu ateria. |
| D7 ja D30 | Syödyksi kirjannut täsmälleen 7./30. päivänä aktivoinnista / kyseiseen seurantapäivään kypsyneet aktivoituneet | Tarkka päivä ja mahdollinen erikseen raportoitu viikkopaluu eivät ole sama mittari. |
| Maksukonversio | Ensimmäinen onnistunut, hyvitykset huomioiva Plus-osto / nimetty kelpoinen kohortti ja aikaväli | Kiinnostusklikkaus, trial ja veloitettu tilaus erotetaan. Ilmoitetaan lähtikö nimittäjä tileistä vai aktivoituneista. |
| Uusiutuminen / churn | Kuukausitilausten päättyneet / jakson alun maksavat, sekä erikseen vuosikohortin todellinen uusinta | Vuosiuusintaa ei arvata 30 päivän trial-pilotista; peruutuspyyntö ja maksuoikeuden päättyminen eri tapahtumia. |
| CAC | Hankintaan käytetty raha ja työarvo / uudet maksavat asiakkaat samassa rajatussa kanava-/aikajaksossa | Orgaaninen sisältötyö ei ole taloudellisesti ilmaista. Palautettuja ostoksia ei lasketa kannattaviksi hankinnoiksi. |
| Kannattavuuden tukimittarit | Tukiminuutit/aktiivinen, tiketit, data-/määrävirheet, kustannus/MAU, maksava-osuus ja maksuvikatapahtumat | Ainoastaan palvelinlasku tai tilausten bruttosumma ei riitä. |

Pienen pilotin seuranta on suostumuksellista ja käyttötarkoitukseltaan arvioitua. Sisäiset pseudonyymit tapahtumat voivat edelleen olla henkilötietoa ja paljastaa ravitsemuskäyttäytymistä. Ei oleteta, että oma palvelin tai evästeettömyys poistaisi tämän. Resepti-/aterianimet, ravintoarvot, hakutekstit ja päiväkirjapäivät eivät mene julkisen analytiikan eventeiksi tai URL-parametreiksi. Myös HTTP-lokit, virheraportit ja referrerit tarkistetaan.

Julkisen ei-välttämättömän analytiikan suostumus ja Diary-palvelun käyttöperuste arvioidaan erikseen. Torju analytiikka ei estä peruskirjausta. Tarvittaessa käytetään suostumuksellista pilotin itsearviota/haastattelua, jos tapahtumamittaus ei ole vielä hyväksytty. Raportoidaan mittauskattavuus; suostumuksen peruminen tai tilin poisto ei saa muuttua keinoksi kaunistaa retention nimittäjää. Säilytettävät aggregaatit ovat aidosti anonymisoituja tai erikseen perusteltuja, ei pelkällä eri user-ID:llä nimettyjä. [Traficomin evästeohje](https://kyberturvallisuuskeskus.fi/fi/viestintaverkkojen-ja-palveluiden-saantely/evasteet).

### 13.3 Hankintafunneli on oletus, ei nykyinen suoritus

Havainnollistava laskelma: 10 000 mittauskelpoista reseptikäyntiä ×2% päiväkirjaan ×50% tili ×60% aktivointi ×5% aktivoituneista myöhemmin maksaviksi = **3 ensimmäistä maksavaa**. Samasta 60 aktivoituneen joukosta 35% D7 tarkoittaisi 21 palaavaa; sitä ei kerrota maksufunneliin uudestaan ilman määritelmän vaihtoa. Sessioiden ja yksilöiden ero sekä toistuvat käynnit pitää selvittää oikeassa mittauksessa.

Näillä numeroilla 100 ensimmäistä maksavaa vaatisi laskennallisesti noin 333 000 samanlaista mitattua käyntiä ennen poistumaa. Se ei ole ennuste tai mainoskampanjan tarjous. 1 000 kuukausimaksavan kannassa 6% kuukausichurn tarkoittaa 60 uutta maksavaa/kk pelkän kannan säilyttämiseen; samalla kuvitteellisella funnelilla noin 200 000 käyntiä/kk. Esimerkki osoittaa, ettei halpa hinta tai monta reseptiä yksin tuota toimivaa hankintaa.

4,90-hinnan mallin yksikkömarginaali on noin 2,69 €/maksava/kk ennen kiinteitä kuluja. Kolmen kuukauden kate olisi noin 8,08 €, joten alle sen jäävä CAC on vasta alustava testiraja, ei turvallinen kannattavuustakuu. Yksinkertainen `yksikkömarginaali/kuukausichurn` antaisi 3/6/10% oletuksilla noin 89,75/44,88/26,93 €; tämä ei sisällä kiinteitä kuluja, diskonttausta tai pysyvyyden muutosta eikä ole mitattu LTV. LTV:tä ei käytetä suureen mainosinvestointiin ennen oikeita kypsyneitä kohortteja.

## 14. Ominaisuuksien priorisointi

P0–P3:n ydinpolku ja turvallisuus menevät ominaisuusmäärän edelle. Alla työmäärä tarkoittaa suhteellista tuote-/teknistä vaikeutta, ei uutta toteutuslupaa.

| Ominaisuus | Hyöty / prioriteetti | Vaikeus ja kustannus | Tietoturva-/laatupiste / päätös |
|---|---|---|---|
| Omat vakioateriat ja yhden painalluksen kirjaus | Ydin, P3 | Keskisuuri: malli/revisio/snapshot/määrä | Omistajuus, idempotenssi ja historiallinen muuttumattomuus pakollisia |
| Eilisen kopiointi | Ydinrutiinia tukeva P3-ehdokas | Pieni–keskisuuri | Oikea päivä ja lähdeversion kelpoisuus, ei tuplia |
| Päivä- ja viikkokalenteri | P4, päivittäinen hyöty | Keskisuuri | Suunniteltu ei syöty; aikavyöhyke ja puuttuvat päivät |
| Omat numeeriset tavoitteet | P4 yksinkertainen vapaaehtoinen versio | Pieni–keskisuuri | Ei henkilökohtaista ketorajan tai lääkityksen automaattiohjausta |
| Omat reseptit | Suuri myöhempi hyöty, ei MVP | Suuri: ainesosat, saanto, retentio, revisiot | Ei automaattista hyväksyttyä lähdedataa tai julkista jakelua |
| Viikon ateriasuunnittelu | Mahdollinen Plus-/myöhempi hyöty | Keskisuuri–suuri | Suunnitelma ja toteutuma erillään; rajoittavaa automaattiohjausta arvioitava |
| Ostoslista | Hyödyllinen suunnittelun jälkeen | Keskisuuri | Yksikkö-/tuotevariantit ja kotitalousjako; ei tiedonjakoa oletuksena |
| Usein syödyn ehdotus | Nopeuttaa rutiinia | Keskisuuri | Käyttäjän hallittava, yksityinen; ei arkaluonteista profiilia ulkopuolelle |
| Makro-/mikrotrendit | Plus-ehdokas P7/Core-valmiuden jälkeen | Keskisuuri–suuri | Kattavuuden muutos ei näyttäydy todellisena saannin muutoksena |
| Monipuolisuuden seuranta | Mahdollinen lisäarvo | Suuri menetelmätyö | Ruokalajiryhmäpiste ei ole validoitu terveysmittari |
| Viivakoodihaku | Helpottaa pakattuja tuotteita | Keskisuuri: lähteet, ajantasaisuus, käyttöehdot | Oikea tuote/markkina ja etikettiversio; lisenssi-/API-kulu erikseen |
| Kuvasta annostunnistus | Hyöty epävarma ennen peruspolkua | Suuri ja vaihteleva AI-kulu | Kuva ei osoita öljyä, reseptiä tai määrää tarkasti; manuaalinen vahvistus ja kuvadatan oikeudet |
| Henkilökohtaiset reseptisuositukset | Myöhempi mahdollisuus | Suuri: valinta-/laatumenetelmä | Terveysprofilointi ja väärä ravitsemustulkinta; aloita käyttäjän itse valitsemilla suodattimilla |
| Ammattilaispalvelut | Eri maksuhalukkuus mahdollinen | Erittäin suuri erillinen tuote | Potilas-/asiakastietojen vastuut ja sopimukset, ei nykyisen kuluttaja-MVP:n laajennuksena |

AI:ta ei tarvita ydinlupauksen todistamiseen. Vakioaterian nopea uudelleenkirjaus on deterministinen toiminto. Kuva/puhe/ehdotus otetaan arviointiin vasta kun käytettävyystesti osoittaa manuaalisen polun ratkaisemattoman kitkan ja kustannus sekä tiedonsiirto ovat hyväksyttäviä.

## 15. Pienin kaupallisesti testattava MVP

### 15.1 Mukana ja rajattu pois

MVP sisältää kirjautumisen, rajatun lähteistetyn ruoka-/reseptivalinnan, oman aterian luonnin, syödyn määrän tallennuksen, päivän tiedot, saman aterian uudelleenkirjauksen sekä merkinnän muokkauksen/poiston. Tietojen vienti, tilin poisto, oikeustarkistukset ja palautus ovat perustaa, eivät myöhemmin Plusin mukana saapuva lisäosa.

Kuratoidun valikoiman pitää riittää testikäyttäjien oikeisiin toistuviin aterioihin. Jos näin ei ole, MVP:n tuotehypoteesia ei katsota onnistuneeksi vain siksi, että testiaamupala toimi. Kirjauksen ravintopuute voidaan esittää, mutta jatkuvasti tyhjät päivän luvut eivät täytä arvolupausta. Puuttuvien tuotteiden osuus, selvittelyaika ja käyttäjän vaihtaminen kilpailijaan ovat porttimittareita.

MVP:n päivätieto voi rajautua nykyisiin hyväksyttyihin neljään makroarvoon. Energia näytetään vain kelvollisella energia-/menetelmäprofiililla, ei automaattisella 4/4/9-kaavalla, joka ohittaisi kuidun/polyolit tai muut energiaa tuottavat tekijät. MVP:tä ei markkinoida kattavana kaloriseurantana ennen tarvittavaa näyttöä. Kaikki vitamiinit, tavoitteisiin perustuva kliininen tulkinta, AI, valokuvat, viivakoodi, kauppalistat, laiteintegraatiot ja maksut jäävät pois ensimmäisestä toimivasta kokeesta.

Suurin tekninen kysymys on rajattu: voiko staattinen reseptipalvelu ja erillinen suojattu Diary hoitaa ydinpolun luotettavasti? Tuotetasolla kyllä, mutta valittu tunnistus-/tallennus-/oikeusratkaisu ja kustannus on osoitettava P2–P3:ssa. Julkisen sivuston ei tarvitse tehdä henkilökohtaista tietokantakyselyä joka latauksella.

### 15.2 Oikea käyttäjäpilotti ja päätösnäyttö

P1 ensin synteettinen käyttöliittymätesti. P5 vasta hyväksytyn tietosuojan ja tuotantokelpoisen rajatun toiminnon jälkeen esimerkiksi 20–30 vapaaehtoista aikuista noin 30 päivän seurantaan. Rekrytointi, tiedotteet, suostumus, tietojen poistuminen ja mahdollinen hyvitys päätetään ennen kutsuja. Tässä ei kerätä oikeita aterioita tai lähetetä kutsuja.

Alustavat etenemisehdot, **omia testihypoteeseja, eivät alan vertailuarvoja**:

- Kriittisissä omistajuus-, katoamis- ja tuplakirjaustapauksissa ei avoimia estäviä vikoja. Tietovuoto tai epäluotettava tallennus pysäyttää pilotin laajentamisen.
- Vähintään 60% käyttökelpoisista pilottitileistä luo oman aterian ja kirjaa syödyn; vähintään 40% aktivoituneista kirjaa toisena päivänä. D7 tavoite 30%, D30 tavoite 20% aktivoituneista, kypsyneessä kohortissa.
- Nopeustavoitteet luvusta 9 lähestyvät mitattuna, eikä saavutettavuusongelmia piiloteta mediaaniin. Päivä/määrä/suunniteltu-syöty- ja historiaerot ymmärretään tehtävissä.
- Haastatteluissa toistuva todennettava hyöty: konkreettinen aika-/vaivasäästö, ei vain kohtelias kiinnostus. Käyttäjä valitsee palvelun vapaaehtoisesti seuraavina päivinä.
- Tuntemattomien tuotteiden ja puuttuvien ravintoarvojen määrä sekä tikettiminuutit mahdollistavat talousmallin täsmennyksen. Ei onnistumisväitettä, jos omistaja korjaa jokaisen aamupalan käsin.

20–30 henkilön kuudesta D30-palaajasta ei voi päätellä vakaata 20% markkinaretentiota tai arvioida harvinaista tietoturvariskiä. Raportoidaan n/N, valikoituminen, mittauksen puutteet ja käyttäjäkohtaiset ongelmaluokat. P5 voi johtaa uuteen rajattuun kohorttiin tai tuoterajauksen muutokseen; suurta markkinointi-/maksujärjestelmäinvestointia ei perustella yksittäisellä pienellä otoksella.

## 16. Vaiheet P0–P8 ja omistajan päätösportit

Vaiheilla ei ole luvattuja kalenteripäiviä. Tavoitteet ovat omia hyväksyttäviä hypoteeseja; tulos voi olla jatka, rajaa uudelleen tai pysäytä. Alla olevat tunti-/eurorajat ovat alustavia työarvovarauksia 35 €/h, eivät tarjouksia tai tämän chatin kestoa. P0:n nykyinen infrastruktuurisuunnitelma, Core-portit ja tämän tuotteen vaiheet pysyvät erillisinä. Kaikki uudet palvelut ja aiemman 5 USD:n lisäkulurajan mahdollinen ylitys vaativat erillisen päätöksen ennen toteutusta.

### P0 – Nykyinen perusta

- **Tavoite:** julkinen resepti-/ravinto-/GK-perusta ja hallittu infra riittävän luotettavaksi tulevalle päiväkirjapilotille.
- **Käyttäjähyöty:** ymmärrettävä resepti ja lähteistetty annos, ei tilejä tai maksumuuria lukemiseen.
- **Vähimmäistoteutus:** nykyisen palvelun rajattu laadukas profiilijoukko; varmistetaan että testiruokia/annoksia voidaan käyttää, lähde-/kuvaoikeudet ja tiedon puutteet näkyvät. Kaupallisen pilottijoukon 5–10 reseptin toimivuus, määrät ja olennaiset kieliversiot tarkistetaan myös toimituksellisesti, ei pelkällä skeemalla.
- **Riippuvuudet:** nykyinen main, erilliset SOURCE-01/Core-/Cloudflare-päätökset. Cloudflare-siirtoa ei pidetä tämän tuotesuunnitelman hyväksymänä.
- **Hyväksymiskriteerit:** nimetty hyväksytty lähde-/resepti-/menetelmäversio valitulle pilotille, nykyiset pidätykset säilyvät, URL:t toimivat ja ravinto-/GK-rajoitukset ymmärrettävät. Puuttuva energia tai mikrot eivät muutu keksityiksi arvoiksi.
- **Kustannusarvio:** varsinainen infra ja data erillisissä suunnitelmissa; ei automaattisesti uutta budjettia. Työmäärä rajataan niiden toteutuspyynnöissä.
- **Riskit:** toimituksellinen Keto-tagi, AI-käännös tai lähdeotsikko tulkitaan kliiniseksi/tarkistetuksi ravintolupaukseksi; käyttöoikeus puuttuu.
- **Jatka/pysäytä:** omistaja hyväksyy rajatun pilottivalikoiman ja P1-prototyypin. Jos ruokien/peruslaskennan luotettavuus ei riitä, korjataan perusta; koko 326 reseptin täydellistämistä ei kuitenkaan vaadita pieneltä prototyypiltä.

### P1 – Päiväkirjan käyttöliittymäprototyyppi

- **Tavoite:** osoittaa oman aamupalan luonnin ja toistokirjauksen ymmärrettävyys.
- **Käyttäjähyöty:** polku, jossa ateriaa ei rakenneta uudelleen joka päivä.
- **Vähimmäistoteutus:** erikseen luvalla syntyvä paikallinen/static-prototyyppi synteettisillä ruoka- ja käyttäjätiedoilla; Tänään, rakennin, määrämuutos ja tallennuksen palaute. Ei oikeaa tiliä, sähköpostia, Diary-tietoa tai maksuja.
- **Riippuvuudet:** P0:n käsitteet ja nimetty testiskenaario; ei tarvitse odottaa kaikkia Core-mikroja.
- **Hyväksymiskriteerit:** luvun 9 tehtävätestit; päivä/määrä/malli/merkintä erotetaan; kriittiset virheet ratkaistu tai polku rajattu. Tavoitenopeudet mitataan, ei oleteta.
- **Kustannusarvio:**12–24 h eli 420–840 € työarvoa sekä erikseen päätettävä testiosallistujien korvaus. Ei tarpeellista uutta pilvipalvelua.
- **Riskit:** helpon näköinen mock ei vastaa tuotetietojen tai kirjautumisen todellista kitkaa; testataanko vain tekijän omaa rutiinia.
- **Jatka/pysäytä:** omistaja hyväksyy testihavainnot ja rajauksen ennen P2:ta. Jos toistokirjaus ei tuota selvää hyötyä, muokataan ydintä ennen tietokanta-/tilausinvestointia.

### P2 – Käyttäjätunnistus ja yksityinen tietomalli

- **Tavoite:** todistaa, että oikeita käyttäjätietoja voidaan käsitellä hallitusti.
- **Käyttäjähyöty:** pääsy vain omiin aterioihin, ymmärrettävä vienti ja poisto, toimiva tilin palautus.
- **Vähimmäistoteutus:** myöhempi rajattu tunnistus/istunto ja Diary-tietomalli ensin synteettisillä tileillä; snapshot/revisio/omistajuus, vienti-/poistopolku ja palautusnäyttö. Palveluntarjoaja valitaan tässä, ei tässä visio-PR:ssä.
- **Riippuvuudet:** P1, rekisterinpitäjä/tarkoitus/perusteet, DPIA-tarpeen arvio, käsittelijä-/siirtosopimukset, retentio, kustannusraja ja käyttöoikeudet.
- **Hyväksymiskriteerit:** kahden testitilin ristiinpääsy estetty kaikissa toiminnoissa, vanha snapshot ei muutu lähdepäivityksessä, vienti/poisto/backup-palautus eivät ohita omistajuutta; käyttäjädata ei löydy staattisesta buildista tai julkisista lokeista.
- **Kustannusarvio:**30–60 h eli 1 050–2 100 € työarvoa; asiantuntija-/sopimusarvio sisällytetään MVP:n erilliseen 1 500–5 000 € varaushaarukkaan, ei oleteta ilmaiseksi. Stagen tunnistus/sähköposti/DB hinnoiteltava ennen luontia.
- **Riskit:** arkaluonteisen tiedon aliarviointi, väärä oletus EU-sijainnista, tilikaappaus tai palautejärjestelmään vuotava ateriasisältö.
- **Jatka/pysäytä:** omistaja hyväksyy tietosuojan, turvallisuuden ja palvelubudjetin ennen oikeita käyttäjiä. Avoin kriittinen oikeus-/poistoriski estää etenemisen.

### P3 – Ensimmäinen toimiva ateriapäiväkirja

- **Tavoite:** toteuttaa vain luvun 15 MVP-ketju.
- **Käyttäjähyöty:** oma ateria kerran, seuraavana päivänä yksi kirjauspainike; merkintä korjattavissa.
- **Vähimmäistoteutus:** oma ateria+revision kopiointi, rajattu ruoka-/reseptivalinta, määrä ja päivä, syöty merkintä, päivän tiedot, uudelleenkirjaus, muokkaus/poisto ja ehdokkaana eilisen kopio. Ei yleistä viikkosuunnittelua, maksuja, AI:ta tai kaikkia mikroja.
- **Riippuvuudet:** P2 ja oikeuksiltaan sallitut, käyttökelpoiset profiilit valitulle aamupalalle sekä muu pieni valikoima. Source/Core-viite on lukittu, ei latest-haku.
- **Hyväksymiskriteerit:** pääpolku toimii kirjautuneena, retry/double-tap ei duplaa, mallimuutos ei muuta historiaa, väärä päivä/määrä korjattavissa, osatieto ei näytä täydeltä summalta. Nykyisen julkisen palvelun reitit/laskenta säilyvät.
- **Kustannusarvio:**50–90 h eli 1 750–3 150 € työarvoa; profiilivalikoiman manuaalinen kuratointi budjetoidaan lisäksi MVP:n kokonaisarvioon. Palvelukulut mitataan hyväksytyllä rajatulla kuormalla.
- **Riskit:** valikoima ei kata oikeita aamiaisia, käsin tehtävä korjaustyö kasvaa, nykyisen reseptiannossäätimen ja syödyn annoksen merkitys sekoittuu.
- **Jatka/pysäytä:** omistaja hyväksyy toiminnallisen näytön ja tukikelpoisuuden. Jos ydin ei toimi, P4/P7 eivät peitä ongelmaa lisäominaisuuksilla.

### P4 – Kalenteri ja yhteenvedot

- **Tavoite:** päivä- ja viikkokäyttö sekä suunnitelman erottaminen syödystä.
- **Käyttäjähyöty:** aikaisempi päivä löytyy, käyttäjä näkee mitä on kirjannut ja mitä vasta suunnitellut.
- **Vähimmäistoteutus:** saavutettava kalenteri/päivälista, PLANNED/CONSUMED-tilat, päivä/viikko, komponenttikohtainen kattavuus ja vapaaehtoinen käyttäjän oma numeerinen hiilihydraattitavoite.
- **Riippuvuudet:** P3, paikallisen päivän/aikavyöhykkeen sopimus, nykyinen hyväksytty ravinto-/julkaisupolitiikka. Mikrot vain Core-valmiuden ja oman hyväksynnän mukaan.
- **Hyväksymiskriteerit:** suunniteltu ei kasvata syötyä summaa; tyhjä päivä ei0; suositus-/GK-kliinistä tulkintaa ei synny; tavoitteen ja reseptitagin ero ymmärretään tehtävätesteissä.
- **Kustannusarvio:**20–40 h eli 700–1 400 € työarvoa. Ei erillistä analytiikka-/tavoitepalvelua oletuksena; palvelu-/querykulujen muutos mitataan.
- **Riskit:** kaksinkertaiset summat, tuote-/aikavyöhykemuutos siirtää historiaa, puuttuva data näyttää parantuneelta ruokavaliolta.
- **Jatka/pysäytä:** omistaja hyväksyy yhteenvedot ja P5:n rajatun pilotin. Jos tiedon merkitystä ei ymmärretä, supistetaan näyttöä ennen uusia analyysejä.

### P5 – Rajattu käyttäjäpilotti

- **Tavoite:** mitata käyttäjän todellinen paluu ja omistajan todellinen tukikuorma.
- **Käyttäjähyöty:** palvelu auttaa oikeassa arkirutiinissa ja korjauspyyntöön saa ratkaisun.
- **Vähimmäistoteutus:**20–30 vapaaehtoista aikuista, rajattu sisältö/kieli, luvun 15 seurantatehtävät ja haastattelut. Rekrytointi ja oikeat tiedot vasta erillisellä hyväksynnällä.
- **Riippuvuudet:** P2:n kaikki henkilötietoportit, P3–P4:n näyttö, julkaistava tietosuojainfo/ehdot, tukivastuu ja hyväksytty mittaus.
- **Hyväksymiskriteerit:** aktivointi/nopeus/paluu ja virheet raportoitu n/N-lukuina; kypsät D7/D30 eroteltu; puuttuvat tuotteet ja tikettiminuutit kirjattu. Turvallisuuskriittinen vika estää laajennuksen, eikä pieni otos todista markkinaretentiota.
- **Kustannusarvio:**20–40 h eli 700–1 400 € työarvoa plus esimerkiksi 15 € osallistujakorvaus ×30 =450 €, jos erikseen päätetään. Pilottikulut ja tuen palveluaika mitataan, ei vuositasolle skaalattua kustannuslupausta.
- **Riskit:** tekijän lähipiirin kohtelias palaute, maksettu osallistuminen sekoittuu todelliseen retentioon, manuaalinen apu peittää huonon tuotteen.
- **Jatka/pysäytä:** omistaja hyväksyy uuden kohortin, P6:n tai ydinpolun korjauksen. Jos hyöty/paluu puuttuu toistuvasti, pysäytetään kaupallisen laajennuksen investointi, eikä siirretä ydinpolkua maksumuurin taakse.

### P6 – Maksullisen palvelun validointi

- **Tavoite:** selvittää maksaisiko oikea käyttäjä tietystä lisäarvosta tietyn kokonaishinnan.
- **Käyttäjähyöty:** Plus ratkaisee tarpeen ilman ilmaisen ydintoiminnon heikentämistä.
- **Vähimmäistoteutus:**1–2 realistista Plus-näkymäehdokasta, pienet hintakeskustelut/kiinnostuskokeet 3,90/4,90/5,90 ja vuosivaihtoehdot. Ei maksujärjestelmää vain kyselyn vuoksi. Kiinnostuslistaa ei lasketa tilaukseksi.
- **Riippuvuudet:** P5:n paluu- ja tukinäyttö, määritellyt kohderyhmät, kattavuudeltaan kelvollinen analyysisisältö. Mikro-Plus ei voi edeltää tarpeellista Core-/menetelmänäyttöä.
- **Hyväksymiskriteerit:** käyttäjä osaa nimetä konkreettisen hyödyn ja hinnan hyväksynnän/vastustuksen; hintavaihtoehdon yksikkökate ja tukikuorma mallinnettu; ei väitetä pienen haastatteluotoksen olevan tilastollinen A/B-voittaja.
- **Kustannusarvio:**16–32 h eli 560–1 120 € työarvoa, pieni erikseen hyväksytty osallistuja-/hankintabudjetti. Ei veloituksia tai automaattiuusiutuvia trialeja tässä kiinnostuskokeessa.
- **Riskit:** ilmoitettu maksuhalukkuus ei toteudu, alennus naamioi hinnan, analyysi on liian vähän hyödyllinen jo ilmaisen kilpailijan rinnalla.
- **Jatka/pysäytä:** omistaja päättää enintään rajatusta P7-maksukokeesta tai Plusin muuttamisesta. Jos vain ydinkirjauksesta halutaan maksu, liiketoimintaperuste arvioidaan erikseen eikä oletuksena muuteta freemiumia.

### P7 – Recipavo Plus

- **Tavoite:** todentaa rajattu oikea maksukäyttäytyminen ja turvallinen tilauselinkaari.
- **Käyttäjähyöty:** etukäteen ymmärretty lisäominaisuus, selkeä veloitus ja helppo lopetus; ilmainen päiväkirja säilyy.
- **Vähimmäistoteutus:** erikseen luvalla valittu 1–2 hyödyllistä Plus-ominaisuutta, rajattu maksupalvelu/asiakasportaali, oikea hinta/verotus, tilausoikeus, refund/peruutus ja yksityinen laskutuksen metadata. Ei koko tulevaisuuslistaa.
- **Riippuvuudet:** P6, yritys-/verotus-/kuluttaja-/maksu-/tietosuojatarkistus, palvelun oikeudet kaupalliseen käyttöön, tukiresurssi ja hyväksytty budjetti. Ei P7:ää pelkän kiinnostusklikkauksen perusteella ilman rajatun kokeen tappiorajaa.
- **Hyväksymiskriteerit:** onnistunut ja epäonnistunut maksu, uusiutuminen, duplikaattiwebhook, peruutus, hyvitys ja paluu Freehen toimivat; vienti/poisto eivät vaadi Plusia; toteutunut konversio, nettokate ja kuukausikohortit raportoitu. Vuosiuusintaa ei luvata ennen kuin se oikeasti tapahtuu.
- **Kustannusarvio:**40–80 h eli 1 400–2 800 € työarvoa plus maksut/perustamis-/asiantuntijakulut. Talousmallin kulut täsmennetään tosiasioilla. Pilotille nimetyt enimmäiskulut ja asiakasmääräraja, esimerkiksi ensimmäiset 50–100 maksavaa, hyväksytään etukäteen.
- **Riskit:** väärä myyjä-/ALV-oletus, maksu onnistuu mutta etu ei avaudu, terveystiedon vuoto maksumetadatassa, support/takaisinmaksut syövät katteen.
- **Jatka/pysäytä:** omistaja arvioi vähintään ensimmäisten todellisten maksujen ja kypsyvien kohorttien jälkeen jatkon. Ei laajaa maksettua hankintaa ennen että CAC/retentio/kate on rajatusti uskottava; heikko tulos johtaa rajauksen/hinnan muutokseen tai Plus-kokeen lopetukseen asianmukaisin asiakastoimin.

### P8 – Kansainvälinen laajentuminen

- **Tavoite:** osoittaa toimivuus yhdellä uudella maksullisen päiväkirjan markkinalla kerrallaan.
- **Käyttäjähyöty:** oma kieli, tuttu tuote-/annosvalikoima ja ymmärrettävä paikallinen hinta/tuki.
- **Vähimmäistoteutus:** yksi kieli/markkina valittuna, käännetty ydinkäyttö ja ehdot, ihmisen kielentarkistus, paikalliset ruokaprofiilit/yksiköt, maksut/verotus ja tuki. Nykyisiä julkisia neljää kieltä ei suljeta odottamaan tätä.
- **Riippuvuudet:** P7:n toimiva rajattu talous ja tukimalli, Core-lähteiden kyseisen markkinan oikeudet, alueelliset henkilötieto-/kuluttajavelvoitteet ja hyväksytty hinnan/tuotteen paikallistaminen.
- **Hyväksymiskriteerit:** uuden kohderyhmän omat aamupalat/annokset toimivat, lähde- ja tavoitesanasto ymmärretään, oma funnel/tuki/kate mitattu. Suomen onnistuminen ei sellaisenaan ole markkinan hyväksyntä.
- **Kustannusarvio:** alustavasti 40–100 h/markkina eli 1 400–3 500 € työarvoa plus käännös-/juridiikka-/maksukulut tarjousten mukaan. Ei kaikkien kielten samanaikaista avausta.
- **Riskit:** sopimaton data/tuote/valuutta, markkinakohtainen verovelvoite tai tukilupaus, käännös muuttaa ravintoväitteen merkitystä.
- **Jatka/pysäytä:** omistaja hyväksyy yhden markkinan seuraavan askeleen vasta paikallisesta näytöstä. Tarvittaessa pidetään reseptipalvelu kyseisellä kielellä mutta rajataan päiväkirjan/Plusin saatavuus selkeästi.

## 17. Suhde muihin suunnitelmiin ja suurimmat riskit

### 17.1 Kolme kokonaisuutta, erilliset hyväksynnät

- **Nutrition Core:** lähde-/komponenttimalli, oikeudet, hyväksytyt versiot ja profiilivienti. Ei käyttäjän syömistä, tiliä tai maksuhistoriaa. Tuote ei tarvitse kaikkia mikroja ollakseen pienesti testattava, mutta tarvitsemaansa hyväksyttyä profiilia se ei voi korvata arvauksella.
- **Tämä Product Strategy:** käyttäjähyöty, UX, Diaryn toiminnallinen sopimus, hinnoittelu, talous, mittarit ja päätösportit.
- **Cloudflare PR #172:** nykyisen julkisen sivuston D1/R2/Static Assets -siirto, media, URL:t, varmistukset ja tuotantokytkentä. Päiväkirjan tietosuoja- tai maksupäätös ei sisälly siihen.

Tämä työ ei päivitä, yhdistä tai hyväksy näitä muita suunnitelmia. Julkisen sivuston siirtoa ei tarvitse odottaa kaikkiin mikropilotteihin tai Plus-tuotteeseen asti; Diary-/Core-masterin vaihdot sovitetaan erillisillä päätöksillä. Muiden töiden keskeneräiset haarat eivät ole tuotteen oletusarvoinen datalähde.

### 17.2 Riskit ja varhaiset vastatoimet

| Riski | Varhainen havainto | Hallittu vastaus / pysäytysehto |
|---|---|---|
| Käyttäjät eivät palaa | Aamupala onnistuu testissä, mutta D2/D7 jäävät heikoiksi | Tutki rutiinin hyöty ja todellinen kohderyhmä ennen maksujärjestelmää |
| Ruokavalikoima ei riitä | Tuntemattomia tuotteita ja käsityönä korjattuja aterioita paljon | Rajaa lupaus/markkina, paranna lähdepakettia; ei keksittyjä 0-arvoja |
| Luottamus ei vastaa lupausta | Epäselvät määrät, koekeittämätön pilottiresepti tai käännös muuttaa merkitystä | Pieni toimituksellisesti tarkistettu pilottijoukko; AI-kuvat tarjoiluesimerkkeinä, ei todistus ruoan sisällöstä |
| Terveys-/ravitsemusväite ylittää näytön | Keto-tagi, GK-päiväpiste tai vitamiinimerkki näyttää kliiniseltä lupaukselta | Numeerinen, lähteistetty esitys ja menetelmärajat; tarvittava erillinen väitearvio |
| Henkilötietojen vuoto | Ristiinpääsy, debug-logi, palvelucache tai maksukenttä sisältää aterian | P2–P3:n testit ja lokirajaus; kriittinen vuoto pysäyttää pilotin laajennuksen |
| Tietojen poisto/palautus ei toimi | Backup tuo poistetun tilin takaisin | Poistot huomioiva palautusnäyttö ennen oikeaa käyttäjää |
| Freemiumin kulut kasvavat | Maksava-osuus pieni, tukiminuutit/MAU korkeat | Rajaa hankintaa ja laajuutta, korjaa UX/data; budjetti ennen uusia käyttäjiä |
| Plus ei erotu ilmaisista kilpailijoista | Maksuhalukkuus vain kohtelias, mikrot eivät tuo lisäarvoa | Konkreettinen lisähyöty tai pysäytys, ei oletuksena peruskirjauksen maksumuuria |
| Huono yksikkötalous | Refund/churn/CAC tai vuosisuunnitelman alennus syö katteen | Mallinna todelliset kohortit ja vaihtoehtoiset hinnat ennen kasvua |
| Ylläpito yhden ihmisen varassa | Tuen vaste ja palautus jäävät hoitamatta | Dokumentoidut rutiinit, rajatut lupaukset ja pieni asiakasmäärä; ei24/7-lupausta ilman resursointia |
| Liian laaja rakentaminen | AI/natiivi/ammattilaismoduuli ennen toistuvaa kirjausta | P0–P8-portit, yksi kokeiltava arvo kerrallaan |

## 18. Avoimet päätökset, seuraava näyttö ja tämän PR:n rajaus

Ennen seuraavaa toteutuspyyntöä omistaja ratkaisee:

1. Ensimmäinen kohderyhmä ja päiväkirjan testikieli; onko toistuva aamupala aidosti oikea aloitusongelma.
2. P0:n hyväksytty pieni lähde-/reseptivalikoima, yksikkö-/kypsäpainoperusta ja energiaseurannan mahdollinen rajaus. Nykyinen julkinen määrä ei ole valmis Diary-profiilijoukko.
3. P1-prototyypin budjetti ja käyttäjätesti; nopeustavoitteiden ja virheiden arviointi yhdessä.
4. P2:ssa rekisterinpitäjä, käsittelyperusteet, DPIA-tarve, tunnistus, tallennus, retentio, vienti/poisto ja palvelukumppanien sopimukset ennen oikeita tietoja.
5. Freemiumin pysyvä ydin, testattava Plus-hyöty ja hinnoitteluvaihtoehdot; ilman osoitettua arvoa ei maksuominaisuutta.
6. Todellinen ilmais-/maksavien suhde, tukityö, vero-/maksukulut ja budjetti. Aiempi 5 USD lisäkulutavoite ei muutu huomaamatta kasvavan palvelun avoimeksi kululuvaksi.
7. Kunkin P-vaiheen erillinen hyväksyntä versioineen, mittareineen ja tappio-/pysäytysrajoineen. Tämän dokumentin merge ei käynnistä toteutusta.

Lähdehavaintojen tarkistuspäivä 2.11.2026; hinnat, maksupalveluehdot ja lainsäädännön soveltuminen tarkistetaan uudelleen ennen myyntiä. Kilpailijatiedot perustuvat yllä linkitettyihin virallisiin hinta-/ohjesivuihin sekä läpinäkyvästi rajattuun kuuden arvion otokseen. Käytettävyyden kilpailuetua, kysyntää, konversiota tai kannattavuutta ei ole tämän suunnittelun aikana kokeellisesti osoitettu.

Tässä työssä tehdään vain dokumentaatio: yksi suunnitelma erillisessä repo_guard-varmennetussa worktreessä ja Draft-PR:ssä. Kevyet tarkistukset kohdistuvat dokumentin rakenteeseen, lähdeviitteiden muotoon, vaiheiden kenttiin, talouslaskelmien aritmetiikkaan ja Git-whitespaceen. Ei sivustobuildia, sovellustestejä, palvelutilien tai tietokantojen luontia, todellista käyttäjä-/maksudataa, tuotantokoodin muutoksia tai GitHub Actions -käynnistystä. Commit merkitään `[skip ci]`; PR #172, Nutrition Core, SOURCE-01 ja GK80 säilyvät muuttamattomina tämän työn toimesta. Ei mergeä tai toteutuksen aloitusta.

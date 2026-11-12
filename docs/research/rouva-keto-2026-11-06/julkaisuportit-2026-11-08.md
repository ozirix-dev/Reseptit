# Rouva Keto -tutkimuserän julkaisuportit: katselmointi 8.11.2026

## Tilanne 12.11.2026

Rasvakaakao ja lämmin suklaa-chia-puuro julkaistiin erillisissä FI-PR:issä. Suklaavaahto pysyy **HOLDissa**. Tämä muistio säilyttää 8.11. tehdyn katselmoinnin ja suklaavaahdon avoimet julkaisuportit. [Julkaisutilanne ja reseptisivut](README.md#julkaisutilanne-12112026) · [Rasvakaakao #473](https://github.com/ozirix-dev/Reseptit/pull/473) · [Chia-puuro #478](https://github.com/ozirix-dev/Reseptit/pull/478)

## Varmennetut osat

- Tutkimus on rajattu alkuperäisiin ideaviitteisiin, itsenäisesti kirjoitettuihin kolmeen reseptiluonnokseen, erillisiin ravintolaskennan syötteisiin ja luonnoskuviin. Pofiber-pizzasta ei tuoteta duplikaattia.
- Julkaistussa FI-tuotetiedossa Lindt Excellence 90 % -suklaan EAN on **3046920029759**. Valmistajan mukaan 100 g: **14 g hiilihydraattia, 10 g proteiinia, 55 g rasvaa, 592 kcal**. Tuotetieto **ei erittele kuitua eikä polyoleja**. Riippumattomat suomalaiset jälleenmyyjät näyttävät samat pääluvut. Tämä tukee täsmämerkinnän 14 g CHO/100 g käyttöä **imeytyvän hiilihydraatin arvioinnissa**, ei kokonais-CHO:n arvon arvaamista.
- Tuotesivu: https://www.lindt.fi/fi/lindt-excellence-dark-90-bar-100g-fi-fi-03046920029759 ; jälleenmyyjän täsmätuote: https://www.s-kaupat.fi/tuote/lindt-excellence-90-tumma-suklaalevy-100g/3046920029759
- Tumman suklaan luokan **GI 29 on tutkimusskenaario**, ei Lindt 90 % -valmisteen eikä suklaa-munavaahdon mitattu GI; ei hyväksyttyä GK-numeroa. `carbs_total_per_serving_g: null` pysyy puuttuvana, ei nollana.
- GitHubin PR #305 vanhan HEADin `8001db15` CI 42370488678 oli **SUCCESS**. Tässä 8.11. tehty dokumenttimuutos vaatii oman uuden CI-vahvistuksen.
- PR #313 on **erillinen FI-julkaisuhaara**, joka on nykyistä mainia jäljessä ja sisältää historialukituksiin liittyviä testimuutoksia. Sen aiempi 330 → 333 -laskelma ei vastaa mainissa julkaistuja viittä lisäreseptiä: nykyinen lähtöjoukko on 335, jolloin kolmen uuden reseptin julkaisu kasvattaisi määrän 338:aan. Historialukituksia ei päivitetä sokkona.

## Reseptikohtainen päätösmatriisi 8.11.2026

| Ehdokas | Työ, joka voidaan hyväksyä ilman koekeittiötä | Edelleen estävä näyttö |
| --- | --- | --- |
| Rasvakaakao | Oma grammoitettu työversio ja tuotetietueiden alkuperä kartoitettu; kuuma juoma käsitellään ilman suljetun tehosekoittimen riskiä | Kuohukerman 38 % ja muiden tuotteiden paketit, käyttökokemus, rasvan erottuminen, annoskoko, riittävä makro-/kuituevidenssi |
| Lämmin suklaa-chia-puuro | Chia, kerma, voi, suklaa ja 0,5 g suolaa on määritelty omaksi versioksi | Puuron todellinen turpoaminen ja rakenne, turvallinen kuumennus, käytettyjen tuotteiden ravintosisällöt, annoskoon hyväksyttävyys |
| Kahden aineksen suklaavaahto | Suklaa + kananmunan pastöroidut fraktiot kirjattu; raakoja tavallisia kuorimunia ei vaadita | **Täsmävalmisteen** pastörointi ja soveltuvuus kuumentamattomaan jälkiruokaan, valkuaistuotteen vaahtoutuvuus, jäähtyneen suklaan ja keltuaisen sekoittumisen koe, kylmäsäilytys, munamäärät ja tuoteperusteiset makrot |

## Ruokaturvallisuusportti

Suklaavaahto sisältää kuumentamattoman munaseoksen: käytä **pastöroituja** keltuais- ja valkuaistuotteita ja noudata niiden pakkausohjetta. Pastöroinnin olemassaolo ei yksin takaa, että tuote vaahtoutuu. Älä ehdota tavallista kuorimunaa pastöroidun tuotteena. FDA mainitsee suklaamoussen riskiruokana ja suosittelee pastöroituja kananmunia tai munatuotteita kuumentamattomiin munaruokiin:
https://www.fda.gov/food/retail-food-industryregulatory-assistance-training/assuring-safety-eggs-and-menu-and-deli-items-made-raw-shell-eggs
https://www.fda.gov/food/people-risk-foodborne-illness/dairy-and-eggs-food-safety-moms-be

**Allergeenit:** maito suklaassa mahdollisena jäämänä sekä rasvatuotteissa, kananmuna vaahdossa, ja mahdolliset suklaan pähkinä-/soijajäämät varmistetaan kulloisenkin pakkauksen perusteella. Älä päättele tuotteita allergeenittomiksi.

## Tekijänoikeudet, käännökset ja kuvat

- Käytä Sulamoa / alkuperäissivuja *idean ja tosiseikkojen* lähteinä, älä kopioi alkuperäisiä ilmaisumuotoja, kuvia tai maksullista sisältöä. Ei yhteistyöväitettä eikä automaattista Rouva Keto -tekijyyden vahvistusta Sulamon nimikoinnin perusteella.
- Varmista vanhan `suklaamousse-keto.md`-otsikkopohjan ja uuden vaahdon ero ennen erillistä julkaisupäätöstä.
- PR #305:n kolme SVG:tä ovat **tutkimusluonnoksia**, eivät kuvauskokeen valokuvia. PR #313:n erilliset WebP:t tulee tarkistaa suhteessa juuri sen kolmelle reseptille tarkoitetun ohjeen ulkonäköön. Älä nimeä kuvia koevalmistuksen kuviksi.
- PR #313:n FI-first-rajauksessa EN/SV/TH-käännöksiä ei julkaista. Myöhemmät yhdeksän käännöstä vaativat itsenäisen kieli- ja merkitysvertailun. `status: draft` ei yksin korvaa tätä hyväksyntää.

## Alkuperäinen työjärjestys 8.11.2026

1. **#305 / tutkimusarkistointi:** validoi uuden HEADin CI, alkuperäisviitteet ja käyttöoikeusrajat. Tutkimusdokumentti voidaan katselmoida omana toimituksellisena eränään; **se ei anna julkaisulupaa #313:lle**.
2. **#313 / koodijulkaisu:** sovita erillinen haara nykyiseen mainiin säilyttäen kaikki nykyiset testit ja aiemmat historiatarkisteet. Älä julkaise, ennen kuin tuotemäärät, allergeenit, pastöroidun valkuaisen soveltuvuus ja koekeittiön lopputulos on todennettu.
3. **Makrot / GI/GK:** tarkista muuttuvien tuotteiden labelit ja kuitu/polyolit. Älä hyväksy suklaan ryhmä-GI:tä tuotekohtaiseksi mittaukseksi; säilytä GK `null`, ellei hyväksytty näyttö myöhemmin synny.
4. **Julkaisu:** uusi HEAD-CI, käännös-/kuva-/ravinto-/GK-audit, tarkka julkaisupäätös, onnistunut main-deploy ja tuotantosivujen erillinen selainkoe.

**Ei fyysistä koevalmistusta tehty tässä katselmoinnissa. Ei uusia julkaistuja GK-numeroita, ravintoarvoja tai reseptireittejä.**


## Täydennys 8.11.2026 – pastöroidun valkuaisen vaahtoutuvuuden tutkimus

**Johtopäätös: tuoteturvallisuuden ja rakenteen portti ei ole vielä PASS.** Pastörointi ja sopivuus kylmään käyttöön eivät yksin todista, että kaupallinen valkuaismassa muodostaa reseptin vaatiman vaahdon.

- [American Egg Board: whipping](https://www.incredibleegg.org/professionals/manufacturers/real-egg-functionality/whipping/) kuvaa munatuotteiden vaahtoamisominaisuudet, mutta tuotesuunnittelu on valmistuskohtaista.
- [American Egg Board: egg handling](https://www.incredibleegg.org/egg-handling-storage-tips/) varoittaa, ettei jokainen nestemäinen pastöroitu valkuaisvalmiste tuota vakaata vaahtoa; ainesosat ja valmistustapa voivat muuttaa tulosta. Vaahtoutuvaan tuotteeseen tarvitaan valmistajan oma soveltuvuusnäyttö.
- [Leipurin tuotetieto, Heti Valmis Valkuainen 5 kg, tuotekoodi 921019](https://productcard.leipurin.com/productspec/921019?lang=fin): *pastöroitu kananmunanvalkuaismassa*, leivontaan, 1 dl noin 3 valkuaista, kylmäsäilytys 0–4 °C. Tämä on **ammattikeittiön 5 kg raaka-aine-ehdokas**, ei käyttäjän reseptin hyväksytty vähittäismyynnin tuote; 5 kg pakkaus ja leivontakäyttö eivät yksin varmista turvallisuutta kuumentamattomassa suklaamoussessa tai sen vaahtoutuvuutta.
- [FDA:n kananmunien turvallisuusohje](https://www.fda.gov/food/retail-food-industryregulatory-assistance-training/assuring-safety-eggs-and-menu-and-deli-items-made-raw-shell-eggs) käsittelee raakoja/kuumentamattomia kananmunaruokia. Täsmävalmisteen käyttötarkoitus ja säilytysohje tulee silti varmistaa pakkauksesta.
- Kuumentamaton keltuainen vaatii oman **pastöroidun tuoteversion** ja pakkauksen ravintotiedon; yllä mainittu valkuaistuote ei ole keltuaislähde. Näiden ravintotietueiden vaihtuessa myös suklaavaahdon aiemmat makroarviot on laskettava uudestaan.
- [K-Ruoan täsmä-Lindt 90 %](https://www.k-ruoka.fi/kauppa/tuote/lindt-excellence-tumma-suklaa-100g-90-3046920029759) vahvistaa EAN 3046920029759 ja 14 g CHO /100 g, mutta kuitu/polyolit puuttuvat ravintoilmoituksesta; niitä ei täytetä arvolla 0. Allergeenimerkinnöissä voi olla pähkinän, maidon ja soijan jäämiä.

**Suklaavaahto pysyy HOLDissa.** Avoinna ovat kylmään käyttöön soveltuvan pastöroidun keltuaisen ja vaahtoutuvan valkuaisen tuotetiedot, annosmassat, tuoteperusteinen ravintolaskenta ja valmistusnäyttö.

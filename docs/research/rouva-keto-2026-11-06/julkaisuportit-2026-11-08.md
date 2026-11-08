# Rouva Keto -tutkimuserän julkaisuportit: katselmointi 8.11.2026

**Tila: RESEARCH REVIEW / HOLD for publishing.** Tämä on PR #305:n täsmällinen jatko-ohje, ei lupa julkaista reseptejä, hyväksyä numeerista GK:ta tai muuttaa suljettua GI-historiaa.

## Varmennetut osat

- Tutkimus on rajattu alkuperäisiin ideaviitteisiin, itsenäisesti kirjoitettuihin kolmeen reseptiluonnokseen, erillisiin ravintolaskennan syötteisiin ja luonnoskuviin. Pofiber-pizzasta ei tuoteta duplikaattia.
- Julkaistussa FI-tuotetiedossa Lindt Excellence 90 % -suklaan EAN on **3046920029759**. Valmistajan mukaan 100 g: **14 g hiilihydraattia, 10 g proteiinia, 55 g rasvaa, 592 kcal**. Tuotetieto **ei erittele kuitua eikä polyoleja**. Riippumattomat suomalaiset jälleenmyyjät näyttävät samat pääluvut. Tämä tukee täsmämerkinnän 14 g CHO/100 g käyttöä **imeytyvän hiilihydraatin arvioinnissa**, ei kokonais-CHO:n arvon arvaamista.
- Tuotesivu: https://www.lindt.fi/fi/lindt-excellence-dark-90-bar-100g-fi-fi-03046920029759 ; jälleenmyyjän täsmätuote: https://www.s-kaupat.fi/tuote/lindt-excellence-90-tumma-suklaalevy-100g/3046920029759
- Tumman suklaan luokan **GI 29 on tutkimusskenaario**, ei Lindt 90 % -valmisteen eikä suklaa-munavaahdon mitattu GI; ei hyväksyttyä GK-numeroa. `carbs_total_per_serving_g: null` pysyy puuttuvana, ei nollana.
- GitHubin PR #305 vanhan HEADin `8001db15` CI 42370488678 oli **SUCCESS**. Tässä 8.11. tehty dokumenttimuutos vaatii oman uuden CI-vahvistuksen.
- PR #313 on **erillinen FI-julkaisuhaara**, joka on nykyistä mainia jäljessä ja sisältää historialukituksiin liittyviä testimuutoksia. Sen aiempi 330 → 333 -laskelma ei vastaa mainissa julkaistuja viittä lisäreseptiä: nykyinen lähtöjoukko on 335, jolloin kolmen uuden reseptin julkaisu kasvattaisi määrän 338:aan. Historialukituksia ei päivitetä sokkona.

## Reseptikohtainen päätösmatriisi

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

## Päätös ja työjärjestys

1. **#305 / tutkimusarkistointi:** validoi uuden HEADin CI, alkuperäisviitteet ja käyttöoikeusrajat. Tutkimusdokumentti voidaan katselmoida omana toimituksellisena eränään; **se ei anna julkaisulupaa #313:lle**.
2. **#313 / koodijulkaisu:** sovita erillinen haara nykyiseen mainiin säilyttäen kaikki nykyiset testit ja aiemmat historiatarkisteet. Älä julkaise, ennen kuin tuotemäärät, allergeenit, pastöroidun valkuaisen soveltuvuus ja koekeittiön lopputulos on todennettu.
3. **Makrot / GI/GK:** tarkista muuttuvien tuotteiden labelit ja kuitu/polyolit. Älä hyväksy suklaan ryhmä-GI:tä tuotekohtaiseksi mittaukseksi; säilytä GK `null`, ellei hyväksytty näyttö myöhemmin synny.
4. **Julkaisu:** uusi HEAD-CI, käännös-/kuva-/ravinto-/GK-audit, tarkka julkaisupäätös, onnistunut main-deploy ja tuotantosivujen erillinen selainkoe.

**Ei fyysistä koevalmistusta tehty tässä katselmoinnissa. Ei uusia julkaistuja GK-numeroita, ravintoarvoja tai reseptireittejä.**

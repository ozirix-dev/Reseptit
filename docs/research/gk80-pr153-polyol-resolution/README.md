# PR #153 — bulgogin P2 ja 20 reseptin AFCD-jatkokatselmointi

**1.11.2026. Ei julkaisulupaa. Nykyinen koko 20 reseptin julkaisupäätös: HOLD.**

Bulgogin öljyn ja sipulien käyttövaiheet on korjattu. Reseptin kaikki määrät, annosmäärä, neljä ravintoarvoa ja kaikki GK-luvut säilyvät. Bún chản aiempaa korjausta ei muuteta. PR #162:n kahden suklaareseptin pidätys on tuotu haaraan repo_guardin hyväksytyllä main-synkronoinnilla.

## Päätös koko erälle

- 20 reseptiä tarkistettu, 41 yksilöityä AFCD-tietuetta.
- 14 lähdeperheelle valmisteltu nimetty Fineli-vaihtoehto; kyseessä ovat hyväksyttäväksi tuotavat koostumusvertailut, eivät automaattiset vaihdot.
- 27 lähdeperheen kattavuus tai saman valmistusmuodon vastaavuus jää avoimeksi.
- 1 reseptille löytyi uuden rajatun C-sovelluksen ehdollinen laskennallinen mahdollisuus. Sitä ei ole integroitu eikä hyväksytty aiemman kahden reseptin luvalla.
- Nykyisen 20 version julkaisukelpoisia tässä lähdekatselmoinnissa: **0/20**. Ei väitettä 20 todetusta GK-numerovirheestä.
- Julkaistu kattavuus 130/326. Haaran alkuperäinen 150/326 on tekninen ehdokasmäärä, ei uusi tuotantotieto tai lähdekattavuuden hyväksyntä.

## Jokainen resepti

Leveys alla on vain nimetyn lisäpolyoliskenaarion GK-lisäys 0–150-vastekertoimella. Se ei ole mitattu virheraja. Lähdevaihtoehdot pidetään kiinteinä; eri valmistusskenaarioita ei summata.

| Resepti-ID | Nykyinen julkaisupäätös | Jatkoehdotus | Avoimet AFCD-tietueet | Lisäskenaarion GK-leveys |
| --- | --- | --- | --- | --- |
|bulgogi|HOLD|Lähde-/menetelmäeste säilyy|F006187, F006250, F006618, F008969|10.4820000|
|bun-cha-hanoi|HOLD|Lähde-/menetelmäeste säilyy|F003192, F006618, F008004, F008969|46.4370000|
|caponata|HOLD|Lähde-/menetelmäeste säilyy|F002220, F006198|24.968250|
|carnitas-salaattitacot|HOLD|Lähde-/menetelmäeste säilyy|F003192, F003327, F005191, F005199, F006281, F006618|72.6277500|
|congee-riisipuuro|HOLD|Lähde-/menetelmäeste säilyy|F004213, F006187, F006250|12.3570000|
|doner-kebab|HOLD|Lähde-/menetelmäeste säilyy|F003327, F006281, F006316, F006618|0.3690000|
|janssoninkiusaus-juuriselleri|HOLD|Lähde-/menetelmäeste säilyy|F000074, F006618|30.8388750|
|japanilainen-kabocha-puuro|HOLD|Lähde-/menetelmäeste säilyy|F007535|166.1250|
|marokkolainen-couscous|HOLD|Lähde-/menetelmäeste säilyy|F003190, F003327, F009335|0.339000|
|menemen|HOLD|Lähde-/menetelmäeste säilyy|F006316, F006618|0.1510000000000000000000000000000000000000|
|pasta-alla-norma|HOLD|Lähde-/menetelmäeste säilyy|F002479, F006618|7.7295000|
|ratatouille|HOLD|Lähde-/menetelmäeste säilyy|F006618, F009160|0.1890000|
|rogan-josh|HOLD|Lähde-/menetelmäeste säilyy|F002258, F002893, F002963, F003190, F003327, F004213, F005077, F006316|206.6596875|
|shakshuka|HOLD|Lähde-/menetelmäeste säilyy|F003327, F006316, F006618|0.504750|
|sitruuna-yrttikana-parsa|HOLD|Lähde-/menetelmäeste säilyy|F006618, F009160|0.1890000|
|taytetyt-paprikat-vhh|HOLD|Lähde-/menetelmäeste säilyy|F006281, F006618|0.217500|
|tomaatti-kananmuna-wokki|HOLD|Lähde-/menetelmäeste säilyy|F006250|6.870000000000000000000000000000000000000|
|uunikanapasta-kesakurpitsa|HOLD|Rajattu C-ehdotus, uusi omistajahyväksyntä|F006618|0.0420000|
|valimerellinen-halloumi-tomaattileipa|HOLD|Lähde-/menetelmäeste säilyy|F002466, F006198|74.30625|
|vietnamilainen-kahvijogurtti-banaanilla|HOLD|Lähde-/menetelmäeste säilyy|F003065, F005582|155.5875|

## Yksi täsmällinen C-sovellusehdotus

**Uunikanapasta kesäkurpitsasuikaleilla**. Tuoreelle valkosipulille ja basilikalle ehdotetaan nykyisen Fineli-verkkosivun saman raaka-aineen profiilia. Molemmissa on ilmoitettu polyoliarvo 0; tämä on lähteen ilmoittama arvo, ei kaikkien lajien laboratoriomääritys. AFCD-mustapippurin puuttuva kokonaiskattavuus säilyy tuntemattomana.

Kiinteän lähdeskenaarion tulokset:

| Suure | Ehdollinen arvo |
| --- | --- |
|availableCarbohydrate g/annos|7.384250|
|protein g/annos|39.530500|
|fat g/annos|23.911125|
|fibre g/annos|2.996000|
|Kokonais-CHO:n skenaario g/annos|10.380250–10.408250|
|GK:n skenaario|2.737675–2.7796750|
|Lisäpolyolin skenaariokatto g/annos|0.028000|
|GK-leveys / budjetti|0.0420000 / 0,10|
|Ehdollinen kokonaislukuna näytettävä GK|3|
|Ehdollinen kokonaislukuna näytettävä kokonais-CHO|10|
|GK-luokka|LOW|

Tämä ehdottaa uutta täsmällistä lähde- ja näyttöversiota; alkuperäisen kahden desimaalin kokonais-CHO:n vakautta ei väitetä. Nykyiseen neljän makron tarkistimeen ei tehdä poikkeusta. Ehdotuksen hyväksynnän jälkeen tarvittaisiin erillinen täsmällinen C-evidenssi ja sen julkaisuintegraatio. PR #156:n hyväksyntä koskee edelleen vain sen kahta reseptiä.

Muiden 19 reseptin tilaa ei nosteta ehdolliseksi pelkän kokonaislukupyöristyksen perusteella. Esimerkiksi ratatouillen ja sitruuna-yrttikanan lisäleveys 0,189 ylittää vertailubudjetin 0,10, vaikka kokonaislukuna näytettävä GK pysyisi samana. Budjettia ei kasvateta lukumäärätavoitteen saavuttamiseksi.

## Kaikki 41 lähdetietuetta

| AFCD | Lähde / reseptejä | Ehdotettu vaihtoehto tai tarkka puute |
| --- | --- | --- |
|F000074|Anchovy, canned in oil, drained / 1|Fineli829 is not established as the same drained anchovy-in-oil version and polyol is null; Finnish sweet-brine anchovy cannot silently replace it.|
|F000155|Asparagus, green, raw / 1|Fineli 11689 — PARSA, RAAKA, PUHDISTETTU; EXISTING_RELEASE20_REFERENCE_ALL_FIVE_FIELDS|
|F000396|Basil, green, fresh, raw / 4|Fineli 11134 — Basilika, tuore; CURRENT_OFFICIAL_WEB_DISPLAY_ROUNDED_INPUTS_ONLY|
|F000810|Beef, sirloin steak, lean, raw / 1|Fineli 722 — NAUDANFILEE, ULKOFILEE; EXISTING_RELEASE20_REFERENCE_ALL_FIVE_FIELDS|
|F002220|Capers, pickled, canned, drained / 1|No exact drained pickled-caper full profile with aggregate polyol located in local reference.|
|F002258|Cardamom seed, dried, ground / 1|Fineli11187 cardamom has fibre and polyol null; different species/spice blend not substituted.|
|F002390|Celery, fresh, raw / 1|Fineli 339 — LEHTISELLERI, VARSISELLERI; EXISTING_RELEASE20_REFERENCE_ALL_FIVE_FIELDS|
|F002466|Cheese, haloumi (halloumi) / 1|Fineli33465 halloumi has polyol null;33891 is fried and also polyol-null. Manufacturer carbohydrate alone is insufficient.|
|F002479|Cheese, parmesan, fresh, regular fat / 1|No exact parmesan full profile with aggregate polyol located; another hard cheese would be a new recipe/source analogy.|
|F002594|Chicken, breast, lean flesh, raw / 1|Fineli 11565 — BROILERI, RINTAFILEE, NAHATON, SUIKALE, LEIKE; EXISTING_RELEASE20_REFERENCE_ALL_FIVE_FIELDS|
|F002806|Chicken, thigh, lean flesh, raw / 1|Fineli 30792 — BROILERI, KOIPI-REISI, NAHATON; EXISTING_RELEASE20_REFERENCE_ALL_FIVE_FIELDS|
|F002893|Chilli (chili), dried, ground / 1|Fresh chilli, sweet chilli sauce and dry ground chilli are not interchangeable; verified dry-food aggregateP missing.|
|F002963|Cinnamon, dried, ground / 1|A dry-cinnamon aggregateP was not located in existing reference; source pair does not prove totalP0.|
|F002991|Coconut, milk, canned, regular fat / 1|Fineli 29014 — KOOKOSMAITO, KOOKOSJUOMA; EXISTING_RELEASE20_REFERENCE_ALL_FIVE_FIELDS|
|F003065|Coffee, long black, from ground coffee beans / 1|Fineli900/931 reportP0 but do not establish identical strong long-black composition. Their positive A requires a separately justified GI binding where the present coffee input has A0.|
|F003190|Coriander seed, dried, ground / 2|No verified ground coriander-seed aggregate polyol located; fresh coriander is a different preparation and part.|
|F003192|Coriander, fresh, raw / 2|Fineli34238 reports aggregateP0 but fibre missing in local snapshot; no full profile substitution applied.|
|F003239|Couscous, uncooked / 1|Fineli 29208 — KUSKUS; EXISTING_RELEASE20_REFERENCE_ALL_FIVE_FIELDS|
|F003327|Cumin (cummin) seed, dried, ground / 5|No same-form cumin record with aggregate polyol found in the current local Fineli reference. A spice blend cannot substitute for cumin.|
|F004193|Garlic, peeled, fresh, raw / 9|Fineli 393 — Valkosipuli; CURRENT_OFFICIAL_WEB_DISPLAY_ROUNDED_INPUTS_ONLY|
|F004213|Ginger, peeled, fresh, raw / 2|Fineli33023 is raw ginger but its aggregate polyol is null; paste/pickled ginger is a different preparation.|
|F005077|Lamb, roasting piece, shoulder, untrimmed, raw / 1|Fineli731 is generic fatty raw lamb, not a verified untrimmed shoulder match. No silent cut/fat swap.|
|F005191|Lettuce, cos, raw / 1|Fineli34233 raw cos lettuce reportsP0 but fibre missing in local reference; public source or complete exact profile needed.|
|F005199|Lime, peeled, raw / 1|No exact peeled lime aggregate-P profile located in local reference. Lemon/native Australian lime are not silently substituted.|
|F005582|Milk, cow, canned, sweetened, condensed, regular / 1|No exact sweetened condensed milk aggregate-P full profile located. Ordinary milk is not a substitute.|
|F006159|Oil, canola / 1|Fineli 535 — RYPSIÖLJY; EXISTING_RELEASE20_REFERENCE_ALL_FIVE_FIELDS|
|F006187|Oil, sesame / 2|No exact sesame-oil Fineli entry found. Fixed-source100g fat leaves zero residual in a conditional composition model; that is not an independent polyol assay.|
|F006198|Olive, green or black, drained / 2|Fineli28938 (pitted olives) has polyol null;431 includes stones and also lacks polyol. No invented zero.|
|F006250|Onion, spring, fresh, raw / 3|No exact spring-onion record located in local Fineli reference. Leek, chive and yellow onion are different foods.|
|F006281|Oregano, dried / 3|Fineli11191 has no aggregate polyol on official page; PR156 approval does not extend to oregano.|
|F006316|Paprika, dry powder / 4|Fineli11182 has no aggregate polyol on the official page. Source-bound scenario or new primary evidence required.|
|F006618|Pepper, black, ground / 12|Fineli11177: aggregate polyol absent; fibre26.5 on live page does not establish P. Source-bound scenario only, no assigned zero.|
|F006862|Pork, belly, rind removed, raw / 1|Fineli 706 — SIANKYLKI; EXISTING_RELEASE20_REFERENCE_ALL_FIVE_FIELDS|
|F007535|Pumpkin, butternut, peeled, fresh, raw / 1|Fineli350 is generic pumpkin, not established butternut variety. Current version explicitly names butternut; no silent variety swap.|
|F007682|Rice, white, uncooked / 3|Fineli 11521 — RIISI PITKÄJYVÄINEN, PUUROUTUMATON; EXISTING_RELEASE20_REFERENCE_ALL_FIVE_FIELDS|
|F008004|Sauce, fish, commercial / 1|No exact commercial fermented fish-sauce aggregate-P record located. Fineli fish-dish sauces are different foods; manufacturer CHO/sugars alone do not prove totalP0.|
|F008065|Sauce, soy, commercial / 3|Fineli 31 — MAUSTEKASTIKE, SOIJAKASTIKE; EXISTING_RELEASE20_REFERENCE_ALL_FIVE_FIELDS|
|F008936|Stock, liquid, all flavours (except fish), prepared from commercial powder or cube / 2|Fineli 30315 — KANALIEMI, LAIMENNETTU; EXISTING_RELEASE20_REFERENCE_ALL_FIVE_FIELDS|
|F008969|Sugar, brown / 2|No verified brown-sugar aggregate polyol in the searched local source; white sugar changes the named ingredient.|
|F009160|Thyme, dried, ground / 2|Fineli11194 official page lacks aggregate polyol. Conditional scenario is not a measured error bound.|
|F009335|Turmeric, dried, ground / 1|No exact turmeric full profile with aggregateP located in existing reference; spice mixture does not substitute.|

### Mikä saatiin selvitettyä

Valkosipulin [Fineli 393](https://fineli.fi/fineli/fi/elintarvikkeet/393) ilmoittaa kuidun 2,1 ja polyolit 0 g/100 g. Tuoreen basilikan [Fineli 11134](https://fineli.fi/fineli/fi/elintarvikkeet/11134) vastaavat luvut ovat 1,6 ja 0. Molempien koko tässä ehdotuksessa käytetty profiili on kirjattu pyöristetyn verkkonäytön tarkkuudella analysis.json-tiedostoon. Vanhan paikallisen Release20-viitteen puuttuva kuitu ei siis yksin osoita, ettei nykyistä lähdettä olisi. Aineistoversioiden erosta ei päätellä koko importerissa olevan virhettä.

[Mustapippurin 11177](https://fineli.fi/fineli/fi/elintarvikkeet/11177), [paprikajauheen 11182](https://fineli.fi/fineli/fi/elintarvikkeet/11182), [oreganon 11191](https://fineli.fi/fineli/fi/elintarvikkeet/11191) ja [timjamin 11194](https://fineli.fi/fineli/fi/elintarvikkeet/11194) virallisilta sivuilta ei löytynyt polyoliriviä. Kuidun löytyminen ei korvaa sitä. Samaa tietuepuutetta ei ratkaista etiketin pelkällä CHO-/sokeriluvulla tai toisella mausteella.

Muut 12 vaihtoehtoa tulevat nykyisestä versionoidusta Fineli Release20 -viitteestä, koko profiili ja polyoliarvon johtamistapa mukana. Kaikki ovat nimettyjä koostumusvaihtoehtoja, joiden vastaavuus ja muuttuvat makrot/GK on hyväksyttävä; niitä ei väitetä samoiksi numeroiksi kuin AFCD-profiilia. Viitetiedostoa tai laskentamoottoria ei päivitetä globaalisti.

Finelin API ja ZIP palauttivat suorissa lukuyrityksissä HTTP403. Niistä ei väitetä saadun raakadataa eikä numerotarkkuutta, jota verkkosivu ei näytä. Selaushakutyökalun viralliset lähdesivut ja olemassa oleva versioitu viite erotetaan. Finelin [polyolimääritelmä](https://fineli.fi/fineli/fi/ravintotekijat/POLYL) ja [avoin data](https://fineli.fi/fineli/fi/avoin-data). CNF:n nykyinen rajattu viite ilmoittaa sorbitolin ja mannitolin, ei kaikkien lajien kokonaisuutta; se ei sulje aukkoa.

## Skenaarion matemaattinen rajaus

AFCD:n raportoitu ilman-kenttä A pidetään kiinteänä, eikä tuntematonta polyolia vähennetä siitä uudelleen. Tietueen nimeämät tunnetut lajit ja kenttäparin osasumma pidetään erillään koko polyolista. Ehdollinen lisäosuus rajataan kiinteässä koostumusskenaariossa jäännöksellä 100−A−kuitu−proteiini−rasva−tunnettu polyoliosuus. Johdettua vettä ei vähennetä. Jäännös ei ole näyttö todellisesta polyolimäärästä.

Vertailussa lisäosuuden vastekertoimen skenaarioksi asetetaan 0–150, kuten aiemmassa rajatussa vertailussa. Tämä ei ole mitattu GI, kaikkien polyolien fysiologinen yläraja eikä uusi globaali salliva sääntö. Myöskään Finelin ilmoitettua nollaa ei kutsuta kaikkien lajien täydelliseksi analyysiksi. Ainoastaan yksi uusi nimetty tapaus läpäisee vertailun kaikki budjetti-, kokonaislukupyöristys- ja luokkaehdot; sen soveltaminen odottaa uutta päätöstä.

Kaikki 20 skenaariotarkistusta ovat vastakkaisen lähdevaihtoehdon riippumattomia Decimal-laskuja tämän rajatun erän sisällä. Ne eivät korvaa Golden-tuloksia eivätkä muuta alkuperäisiä GI-arvoja. Mahdollinen uusi positiivinen A tarvitsee GI-sidoksen; esimerkiksi kahvin lähdevaihdolla sitä ei keksitä.

## Varmennus ja jäljitettävyys

analysis.json sisältää 20 reseptiä, kaikki 41 lähdetietuetta, tarkat massat/annokset, 14 vaihtoehtoista profiilia, 27 tietuekohtaista estettä, skenaariolaskut ja käytettyjen lähtötiedostojen hashit. verify.py tarkistaa paketin rajauksen ja yhden C-ehdotuksen itsenäisesti nykyisestä reseptipaketista. Alkuperäinen 20 reseptin Decimal/GK/Golden-aineisto säilyy numeerisesti ennallaan.

Bulgogin erillinen tosite: docs/nutrition/gk80-release-8/bulgogi-p2-correction.json. GitHubin P2-ketjua ei merkitä työkalulla ratkaistuksi: repo_guard ei tarjoa kyseistä mutaatiota. Koodikorjaus ja mahdollisen uuden automaattisen katselmoinnin tulos erotetaan vanhan ketjun ratkaisutilasta. Ei manuaalista review- tai Actions-pyyntöä.

## Julkaisuportti

**NO-GO nykyisen koko 20 reseptin julkaisulle.** Tuodaan katselmoitavaksi korjattu bulgogi, kaikki lähdeperheet sekä yksi täsmällinen uusi C-sovellusehdotus. Muut 19 jäävät HOLDiin, eikä yhtä C-ehdotusta pidetä vielä nykyisen version julkaisuhyväksyntänä. Ei mergeä, deployta, uusia massatutkimuseriä tai ReportHub-muutoksia.


## Lopullinen paikallinen varmennus

- 211 yksikkötestiä PASS ja 25 staattista/SEO-testiä PASS.
- 20/20 alkuperäistä Decimal/GK-tulosta PASS; kohdistettu muuttuneen reseptin tarkistus PASS.
- Yksi 691 reitin sivustobuild PASS. Manifestin tilamerkintä ja sen rekisterihash tarkistettiin tämän jälkeen release8-testeillä; ne eivät muuta renderöityä sisältöä tai laskentaa.
- Kaikki 326 kokonaista GK-tulosobjektia säilyivät samoina kuin aiemmassa PR #153:ssa; nykyisen mainin 130 numeerista lähtötulosta säilyivät kokonaisina.
- Molempien suklaareseptien neljä arvoa pysyvät pidätettyinä ja GK-HOLDit ennallaan.
- Yksi vanhentunut laajan sisältötestin odotus korjattiin PR #162:n mukaiseksi: testataan nyt suoraan kaikkien neljän arvon puuttuminen. Tuotantotietoja ei palautettu.
- Riippumaton lähdeskenaarioiden tarkistus PASS; uusi C-ehdotus on edelleen vain ehdotus.
- Normaali CI varmennetaan lopulliselle pushatulle HEADille. Ei manuaalista Actions- tai katselmointipyyntöä.

Tämä tekninen varmennus ei muuta lähdekatselmoinnin julkaisupäätöstä HOLDista hyväksytyksi.

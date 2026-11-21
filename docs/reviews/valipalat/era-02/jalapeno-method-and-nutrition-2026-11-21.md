# Välipalat B2 – pekoni-juustotäytteiset jalapeñot: menetelmän ja ravinnon lähdeportti

**21.11.2026 · LÄHTEISTETTY FI-DRAFT / HOLD · EI JULKAISULUPAA**

Lähtö-`main`: `5c1157f645888367c38c580be05ea6b8bcee19dd`. Ennen tätä erää FI-luonnoksen blob `e5ba1092badbbadd684df60b377462c8b53e53c6`. Tämä katselmointi koskee vain `jalapeno-poppers-pekonilla`-reseptitunnusta eikä muuta julkista `reseptit/`-puuta. Rinnakkaisen PR #771:n omistukseen tai Cloudflare-tuotantoon ei kosketa.

## 1. Menetelmälähteen tarkka rajaus

**Nimetty tekijä:** [Kylee Ayotte, *Bacon Wrapped Jalapeño Poppers (Baked not Fried)*, Kylee Cooks (21.4.2026)](https://www.kyleecooks.com/jalapeno-poppers/). Kirjoittaja sanoo valmistaneensa popperseja toistuvasti ja ilmoittaa 12 jalapeñoa, 12 pekonisiivua puolitettuina, 8 oz pehmennettyä tuorejuustoa, 1/2 cup cheddar-raastetta sekä erillisiä mausteita. Lähteen tavallinen uuni on **200 °C** (400 °F), kypsennys noin **20 minuuttia** ja pekonin kypsyys/rapeus tarkistetaan. Toinen itsenäinen ruoanvalmistuslähde [Trisha Haas / Salty Side Dish](https://www.saltysidedish.com/bacon-wrapped-stuffed-jalapenos/) tukee 6 jalapeñon, tuorejuuston ja cheddarin täyttöä sekä uunissa paistamista ja chilien turvallista käsittelyä.

**Recipavon neljän aineksen oma sovitus:** 150 g jalapeñon syötävää osaa, 120 g noin 20 % tuorejuustoa, 60 g noin 34 % cheddaria ja 90 g raakaa noin 32 % pekonia / kuusi oletettua annosta (12 puolikasta).

| Kysymys | Mitä tekijälähde tukee | Mitä tämä FI-sovitus ei voi väittää |
| --- | --- | --- |
| Ruokalaji ja työjärjestys | Halkaise chili, poista siemenet, sekoita kaksi juustoa, täytä, kiedo ohut pekoni, paista uunissa | Omia täsmägrammoja tai 12 puolikkaan 150 g:n syötävää chilimassaa koepaistetuiksi |
| Lämpö ja aika | 200 °C, noin 20 min tekijän omalla reseptillä; toinen lähde sama uunimenetelmä | Että kaikille 90 g:n pekonituotteille riittää täsmälleen 20 min tai että 40 min kokonaisaika on mitattu |
| Tuorejuusto ja cheddar | Kyleen 12 chilin erä: 8 oz tuorejuustoa ja 1/2 cup cheddar; puolitettu raaka-aine-erä ei ole suora grammoitettu vastaavuus | Että Recipavon 120 g tuorejuusto + 60 g cheddar on tekijän läpikäymä täsmäskaalaus. Mausteiden poisjättö on lisäksi toimituksellinen muutos |
| Pekoni | Ohuet siivut puolitettuina, kypsennys pekonin kypsäksi | Että alkuperäisen siivumäärän massa on juuri 90 g, tai että ohjeen ulkopuolelle valuu vakio-osuus rasvasta |
| Annossaanto | Jalapeñon puolikkaat ovat tarjoilukappaleita | Että kuusi chiliä antaa aina 150 g syötävää osaa; kuusi annosta × kaksi puolikasta edellyttää 12 puolikasta |

**FI-luonnoksen tarkistus:** 200 °C, kaksi juustoa 180 g (12:lle puolikkaalle laskennallisesti 15 g/puolikas), raaka pekoni 90 g punnittuna ja noin 20–25 minuutin suuntaa antava uunivaihe. Tiedosto ilmoittaa nyt `time_total_min: null`, kunnes käytetty tuote, annossaanto ja aikajakauma on osoitettu. Jos kuuden chilin syötävä nettomassa ei ole 150 g, todellinen chilien kappalemäärä kirjataan ennen mahdollista julkaisua. Tämä on toimituksellinen lähdevertailu **ilman väitettä Recipavon omasta koevalmistuksesta**.

## 2. Täsmäjalapeño löytyi mutta eurooppalainen laskentaketju ei

**Lähde-ehdokas:** [USDA FoodData Central, SR Legacy, FDC 168576, Peppers, jalapeno, raw](https://fdc.nal.usda.gov/fdc-app.html#/food-details/168576/nutrients), [erikseen indeksoitu USDA-aineiston transkriptio](https://rawpawiq.com/ingredient/peppers-jalapeno-raw-168576).

| Tietokannan per 100 g raakaa syötävää osaa | Arvo |
| --- | ---: |
| Hiilihydraatti erotusmenetelmällä (*carbohydrate by difference*) | 6,50 g |
| Ravintokuitu (*total dietary fibre*) | 2,80 g |
| Proteiini | 0,91 g |
| Rasva | 0,37 g |
| Polyolit | **Ei raportoitu** |

**Raaka-aineen mittasuhdetutkimus, ei julkaistava annosmakro:** jos syötävä raaka chili punnitaan todella 150 gramman eräksi, lähtöaineen US-erotusmenetelmän hiilihydraattia vastaa aritmeettisesti 9,75 g/erä, kuitua 4,20 g, proteiinia 1,365 g ja rasvaa 0,555 g. Näistä mikään ei yksin ole 6 annoksen lopullinen ruoka- tai nettohiilihydraattitulos. Yhdysvaltalainen `carbohydrate by difference` **sisältää kuitua** eikä vastaa suoraan Recipavon `EU_AVAILABLE`-kenttää. `POLYL`-komponenttia ei ole eritelty; **ei** voi asettaa sitä nollaksi tai käyttää tätä ehdokasta neljän makron julkaistavassa mallissa sellaisenaan.

USDA ilmoittaa [FoodData Central -tietojen olevan CC0-lisensoituja](https://fdc.nal.usda.gov/). Tässä tutkitaan täsmäruokalajin lähdettä, ei luoda uutta `docs/nutrition/food-records.json`-hyväksyntää. B2-rekisterin aiempi punaisen chilin AFCD F002901 jää väärän raaka-ainelajin vertailuksi. Jalapeñon täsmälähde vähentää tunnistuspuutetta, mutta **ei** ratkaise neljän makron julkaisuporttia.

## 3. Pekonin rasvan ja kypsän massan todellinen este

B2:n nykyinen `fineli-707-2026-10-24` on edelleen **REVIEW**-vertailu raakapekonista. Hankittua valmistajatuotetta, 90 g:n siivupakettia, suolapitoisuutta tai valmiin pekonin kypsää massaa ei ole dokumentoitu.

USDA ARS [*Determination of Cooking Yields for Meat and Poultry*](https://www.ars.usda.gov/research/publications/publication?seqNo115=287023) osoittaa, että lihaa kypsennettäessä vesi- ja rasvahävikkiä mitataan erikseen. Siitä ei voi siirtää yleistä kypsennyssaantokerrointa juustotäytteisen chilin ympärille kiedottuun pekoniin: sulanutta juustoa ja pekonirasvaa voi valua samalla pellille. Välttämättömät mitattavat tai muuten luotettavasti dokumentoitavat erot ovat **valitun tuotteen rasva / 100 g, kypsä syötävä pekoni, pellille jäävä rasva ja täytteestä valuva massa**. Tästä ei päätellä 0 %, 100 % eikä esimerkiksi 70 % retentiota.

Turva: [FoodSafety.gov:n kypsennystaulukko](https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures) antaa **63 °C ja kolmen minuutin lepoajan kokonaisille sianlihapaloille**, ei nimenomaista universaalia kypsennysaikaa ohuelle, tuotekohtaiselle pekonille. Tätä lukua **ei** väitetä poppers-reseptin pekonin validointipisteeksi. Ohuelle pekonille tarvitaan käytetyn pakkauksen käsittelyohje, perusteellinen kypsennys ja tarvittaessa riittävä jatkoaika. Chilejä käsitellessä käsineet ja raakapekonin ristisaastumisen välttäminen ovat perusteltuja.

## 4. Päätös ja jatko

- Menetelmän **ruokalajikohtainen lähde on löytynyt ja kirjattu**, mutta raaka-ainemäärien ja 12 puolikkaan saannon tarkka vastaavuus ei ole riippumattomasti osoitettu.
- Jalapeñolle on nyt oikea **raaka-aineidentiteetti** ja tunnistettu USDA-lähde, mutta nettopolyoli-/EU-hiilihydraattiketju on auki.
- Tuorejuustolle ja cheddarille on aiemmassa B2-kartassa Fineli 34765 / 698 -ehdokkaat; erillistä valmistajan pakkausvalintaa ei ole tehty. Pekonin syöty rasva, suola ja kypsän annoksen nettosaanto jäävät ratkaisematta.
- Puuttuvat: neljä ravintoarvoa/annos hyväksyttynä kokonaisuudelle, GK:n soveltuvuus tai perusteltu määrittämättömyys, oikea WebP-kuva ja tarvittavat käännökset.
- Omaa koekeittiötä **ei** vaadita yleisenä julkaisuehtona [AGENTS.md](../../../../AGENTS.md) ja [välipalojen julkaisuportin](../release-policy-v1.md) mukaan. Sen puuttuminen ei kuitenkaan anna oikeutta keksiä öljyretentiota tai todellista saantoa.

**Tekninen lopputila:** `status: draft`, `nutritionStatus: UNPUBLISHED`, `publicationAuthorized: false`, `gk: HOLD`; **ei makronumeroita eikä GK-numeroa, ei kuvia, käännöksiä, uusia julkisia reseptireittejä tai Cloudflare-deployta**. Erän tavoitteena on lähdeperustaisen HOLDin täsmentäminen, ei keinotekoinen julkaisumäärän kasvattaminen.

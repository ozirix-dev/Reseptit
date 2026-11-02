# Operaatio 149 V2: katselmointikoonti

**Draft-pilotti. Ei tuotantoaktivointia eikä julkaisuhyväksyntää.**

Tarkistettu lähtö 156/326 (47,85%). Valittu 70/170 HOLD-reseptiä;19 vietiin aritmetiikkaporttiin,51 pysähtyi ensin nimettyyn lähde-/valmistus-/tuoteporttiin. Tulos **10 A + 6 B = 16 numeerista ehdotusta**,0 C. 70:n erässä 54 HOLD. **30:n tavoite EI täyttynyt: puuttuu 14.** Kaikista 170 nykyisestä HOLDista 154 jää ilman uutta numeroa.

A tarkoittaa nykyisen moottorin mukaisesti toimivaa GK-only-laskentaa, ei jo julkaistua uutta reseptiä. B tarvitsee uuden menetelmän ja täsmällisten analogioiden hyväksynnän. Kaikki 16 tarvitsevat myös täsmällisen version hyväksynnän ja julkaisuintegraation; nyt julkaisuvalmiita/aktivoituja 0.

## Numeerinen erä

| Resepti | Taso | GK/annos tai ehdollinen lähdeskenaario | Pois jätetty CHO g/annos (A) |
| --- | --- | --- | --- |
| keto-mutakakku | A | 0.07 | 1.377 |
| keto-suklaakeksit | A | 0.03 | 1.311 |
| vhh-juustokakku | A | 0.63 | 0.701 |
| palak-paneer | A | 1.79 | 1.250 |
| paneer-tikka | A | 3.07 | 1.250 |
| kana-parmesaanipannu-parsakaali | A | 1.06 | 0.048 |
| kermainen-kanasienipannu | A | 0.74 | 1.173 |
| vhh-pyttipannu | A | 2.60 | 0.846 |
| vhh-mansikkakakku | A | 1.11 | 0.780 |
| vietnamilainen-pho-ga-aamuksi | A | 24.96 | 0.500 |
| congee-riisipuuro | B | 31.09 | 0.000 |
| valimerellinen-halloumi-tomaattileipa | B | 12.84–17.77 | 0.000 |
| jauheliha-makaronilaatikko | B | 16.91–17.76 | 0.000 |
| japanilainen-kabocha-puuro | B | 35.42 | 0.000 |
| malesialainen-laksa-lemak-aamiaiseksi | B | 27.55 | 0.000 |
| malesialainen-kaya-paahtoleipa | B | 18.37–23.31 | 0.000 |

A:n pienet luvut, etenkin suklaakakku/keksit, jättävät nykyisen menetelmän mukaisesti positiivista GI:töntä CHO:ta pois. Ne eivät ole ruoan mitattuja lähesnollavasteita. Pilotin tulos ja esikatselu näyttävät poisjätön sekä erillisen oletusherkkyyden.

B:n leipäväli perustuu kahteen nimettyyn hapanjuurivehnäleipään. Se ei kata kaikkia fermentaatioita. Makaronilaatikon väli on nimetty penne/spagetti-vertailu ja valkosipulijauheen fysikaalinenCHO-katto ehdolla mauste 50; se ei ole koko laatikon fysiologinen vaihteluväli. Congeen 80 on valmistusanalogia. Kurpitsapuuron kookos 50 ja seesamengarnish 50 ovat erikseen hyväksyttäviä B-koodauksia; niiden GI-epävarmuus ei ole lähteellä rajattu. GI 0–150 jää vain oletusherkkyydeksi.

## Menetelmäpäätökset ja 30:n este

1. Hyväksyttävä uusi GK-only-sopimus: riippumaton Fineli CHOAVL/AFCDwithoutSA voi tukea GK:ta muuttamatta makrojen polyolipuutteita.
2. Hyväksyttävä täsmälliset punnitut versiot, tuote-/valmistusproxyjen LOW-luottamus ja B-analogiat. Valkosipuli-/smetana-/Dijon-vakioinnit eivät peri vanhojen makropakettien hyväksyntää.
3. B-koodaus 50 vain nimetylle vähähiilihydraattiselle makeuttamattomalle kookosemulsiolle ja rajatulle mauste-/siemenkoristeelle. Ei yleistä puuttuvan GI:n täyttöarvoa.
4. Nämä päätökset mahdollistavat 16 ehdotuksen jatkamisen, **eivät 30:tä**. Ainakin 14 muuta vaatii nimettyä lähde-/vastaavuusnäyttöä; tavoite ei ratkea esitysmuodon tai 0–150-herkkyyden hyväksymisellä.
5. Suurimmat toistuvat esteet: mantelijauhon merkittävä GI-osuus, curry-/fermentoitujen tahnojen riippumatonCHO+GI, taikina-/jauho-/hiutalevalmistuksen vastaavuus ja poistettujen aromaattien uutettuCHO. Niitä ei saa korvata ruokaperhekeskiarvolla tai keksityllä polyolinollalla.

## Kaikkien 170 seulonta

Seulonta on työjono, ei automaattinen lähdehyväksyntä. Luokassa 2 on myös vielä ratkaisemattomia mallimahdollisuuksia. Luokkaa 4 ei päätelty keinotekoisesta GI-ylärajasta. `hold-screen.csv` sisältää jokaisen nykyisen HOLD-ID:n, lähdehashin, luokan ja syykoodin.

| Luokka | Määrä |
| --- | --- |
| 1. Nykyinen menetelmä, pilotissa tarkistettu | 10 |
| 2. Mallinnuksen/lähdevälin ehdokas | 39 |
| 3. Tuote-/massa-/valmistusmäärittely tarpeen | 38 |
| 4. Vain perusteltu luokka | 0 |
| 5. Lähde-/menetelmäeste ratkaisematta | 83 |

## Valittujen 70 päätökset

| Resepti | Päätös / ensisijainen este |
| --- | --- |
| keto-mutakakku | NUMERIC_A |
| keto-suklaakeksit | NUMERIC_A |
| vhh-juustokakku | NUMERIC_A |
| rahkapiirakka-vhh | ALMOND_MEAL_GI |
| vhh-lihapiirakka | ALMOND_MEAL_GI |
| keto-korvapuustit | ALMOND_MEAL_GI |
| vhh-runebergintortut | ALMOND_MEAL_GI |
| kana-parmesaanipannu-parsakaali | NUMERIC_A |
| kermainen-kanasienipannu | NUMERIC_A |
| palak-paneer | NUMERIC_A |
| paneer-tikka | NUMERIC_A |
| kana-tagine-sitruunalla | PRESERVED_LEMON |
| paistettu-maksa-pekonilla | LIVER_GI |
| pad-kee-mao-vhh-konjac | SAUCE_GI_COMPOSITION |
| pad-see-ew-vhh-konjac | SAUCE_GI_COMPOSITION |
| vhh-mansikkakakku | NUMERIC_A |
| vhh-mustikkapiirakka | ALMOND_MEAL_GI |
| siemengranola-jogurtilla | SEED_AND_RASPBERRY_GI |
| hunaja-sinappikana-kaalilla | HONEY_DIJON_GI |
| miso-lohi-paksoi | MISO_GI |
| vhh-pyttipannu | NUMERIC_A |
| uunimakkara-sipulipedilla | RING_SAUSAGE_GI |
| lindstrominpihvit-kaalilla | PICKLED_BEET_AND_POTATO |
| silakkapihvit-tilli-kermakastike | RYE_FLOUR_COATING |
| kaakao-kookos-chia | COCONUT_FLAKES_GI |
| marjainen-chiavanukas | BERRY_GI |
| rahka-marjakerroskulho | BERRY_GI |
| lahi-ita-pistaasijogurtti | POMEGRANATE_FORM |
| vietnamilainen-kahvijogurtti-banaanilla | CONDENSED_MILK |
| vhh-omenapiirakka | ALMOND_MEAL_GI |
| vhh-raparperipiirakka | ALMOND_MEAL_GI |
| hernekeitto-savupotkalla | PEA_SOUP_PREPARATION |
| congee-riisipuuro | NUMERIC_B |
| paella-valenciana | PAELLA_RICE_PREPARATION |
| hyderabadi-kanabiryani | BIRYANI_RICE_AND_SPICES |
| intialainen-ven-pongal | MUNG_PORRIDGE_MODEL |
| korealainen-kongjuk-soijapapu-riisipuuro | BLENDED_SOY_RICE |
| indialainen-poha-maapahkinoilla | FLAKED_RICE |
| pohjoisafrikkalainen-bissara | BROAD_BEAN_PUREE |
| falafel | PULSE_FLOUR_OR_GROUND_PREPARATION |
| intialainen-besan-chilla | PULSE_FLOUR_OR_GROUND_PREPARATION |
| valimerellinen-farinata-aamupalaksi | PULSE_FLOUR_OR_GROUND_PREPARATION |
| valimerellinen-halloumi-tomaattileipa | NUMERIC_B |
| pohjoisafrikkalainen-taatelipuuro-appelsiinilla | SEMOLINA_PREPARATION |
| intialainen-mannasuurimoupma | SEMOLINA_PREPARATION |
| chow-mein | EGG_NOODLE_REFRY |
| jauheliha-makaronilaatikko | NUMERIC_B |
| bulgogi | PEAR_MARINADE |
| bun-cha-hanoi | MEAT_MARINADE_RETENTION |
| char-siu | HOISIN_GLAZE |
| vietnamilainen-pho-ga-aamuksi | NUMERIC_A |
| mapo-tofu | DOUBANJIANG_AND_RICE_MASS |
| bibimbap | GOCHUJANG |
| goi-cuon | PEANUT_BUTTER_HOISIN |
| kung-pao-kana | STARCH_SAUCE_PREPARATION |
| malesialainen-laksa-lemak-aamiaiseksi | NUMERIC_B |
| malesialainen-kaya-paahtoleipa | NUMERIC_B |
| bouillabaisse | BREAD_POTATO_AND_MASS |
| pav-bhaji | BUN_AND_POTATO_PREPARATION |
| chettinad-kana | CURRY_LEAF_COMPOSITION |
| kookos-lime-kanacurry | UNSPECIFIED_CURRY_PASTE |
| rendang-padang | LEMONGRASS_RETAINED_CHO |
| punainen-kanacurry-vhh | CURRY_PASTE_AVAILABLE_CHO_AND_GI |
| thai-vihrea-curry-kanalla-vhh | CURRY_PASTE_AVAILABLE_CHO_AND_GI |
| panang-curry-kanalla-vhh | CURRY_PASTE_AVAILABLE_CHO_AND_GI |
| keltainen-kanacurry-vhh | CURRY_PASTE_AVAILABLE_CHO_AND_GI |
| khao-soi-vhh-konjac | CURRY_PASTE_AVAILABLE_CHO_AND_GI |
| massaman-curry-kanalla-vhh | CURRY_PASTE_AVAILABLE_CHO_AND_GI |
| tom-kha-gai-vhh | LEMONGRASS_EXTRACTION |
| japanilainen-kabocha-puuro | NUMERIC_B |

Täsmällinen perustelu ja seuraava toimenpide ovat `recipe-decisions.json`:ssa. `next30.json` kokoaa seuraavat 30 kohdetta esteineen; se ei lupaa 30 hyväksyttävää numeroa.

## Kattavuus ja 80 %

- Tuotanto säilyy 156/326 (47,85%).
- Jos kaikki 16 ehdotusta myöhemmin hyväksytään ja integroidaan:172/326 (52,76%).
- 80 % edellyttää vähintään 261/326; tuotannosta puuttuu 105 ja tämän ehdollisen erän jälkeenkin 89.
- B-koodauksista riippumaton joukko on 10 A +2 B (congee/leipä), ehdokas 168/326; uudet koodaukset avaavat tämän pilotin neljä muuta B:tä.

## Toteutus ja katselmointirajat

Pilotti on `site/scripts/gk149-model.ts` + `gk149-pilot.ts`. Se ei ole sivuston tuotantoimportissa tai julkaisurekisterissä. Komento ei hyväksy aktivointiparametreja ja kirjoittaa vain omaan `tmp/nutrition/gk149/`-hakemistoonsa. `cases.json` sisältää kaikki 19 aritmetiikkayritystä mukaan lukien muuttumattomien A-rajojen estämät kolme mantelijauhoreseptiä.

Jokainen ehdotettu syöte, nykyinen olemassa oleva kieliversio ja käytetty natiivikenttä sidotaan hasheihin. Kaikille jälkiruoille ei ole nykyistä EN/SV/TH-tiedostoa; pilotti ei luo näille kuvitteellisia hyväksyntähasheja. Varsinainen resepti-/käännös-/makroversion integraatio tehdään vasta täsmällisten sisältöpäätösten jälkeen. FI/EN/SV/TH-esitysmuoto on pilotoitu, ei julkaistu UI.

Muuttuneet tiedostot rajoittuvat tämän operaation aineistoon, kahteen pilottiskriptiin, testiin sekä testirekisteröintiin. Ei uusia makropidätyksiä, uusia hyväksyttyjä tuotantotuloksia, Readyä, mergeä, deployta tai ReportHub-muutoksia.

Tarkistusnäyttö päivitetään `validation.json`:iin. Yksi normaali Draft-PR-CI; ei manuaalista uudelleenajoa ilman todellista virhettä.

## Tausta ja erän erityispäätökset

[PR174 SOURCE01](https://github.com/ozirix-dev/Reseptit/pull/174), [PR176 NutritionCore](https://github.com/ozirix-dev/Reseptit/pull/176) ja [PR180 Operaatio 147](https://github.com/ozirix-dev/Reseptit/pull/180) ovat taustaa, eivät hyväksyttyjä tuotantosopimuksia. Niitä tai muita PR:iä ei muutettu.

70:n valinta käyttää yhteisiä koostumuksia ja nimettyjä lähteitä. Laksan 2 g curryjauhe täydentää nykyisen curryliemi-ohjeen puuttuvan rakenteisen määrän ja vaatii erillisen sisältöpäätöksen. Kaya-hillon koko muna/kookos/sokerierä sisältyy kahteen annokseen; mitään sokeria ei poisteta. Leipä punnitaan ennen paahtamista; paahtamisen GI-vaikutus jää B-analogian epävarmuudeksi.

Pilotti: `cd site` ja `npm run pilot:gk149`. Tulos ja neljän kielen esikatselumerkinnät syntyvät tiedostoon `tmp/nutrition/gk149/pilot.json`. Komennolla ei voi aktivoida tuotantosopimusta.

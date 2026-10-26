# GI/GK-kattavuuserä 2B4: lähdevalmius ja mango-osuman korjaus

## Tiedon asema

Status: `AUDIT`
Context role: `audit`
Pointer class: `audit`
As of: 2026-10-26

Tämä on Draft-muutosten auditointikonteksti, ei julkaisutieto eikä hyväksyntä yhdistämiseen. Laskentasyötteen ja sovellusmuutosten lähde on Reseptit-repo; PR- ja CI-tila ovat GitHubissa. Tuotantoa ei ole julkaistu.

## Lähtötilanne

2B4 alkoi puhtaasta Reseptit-main-commitista `3099c246d188ee0484d1cd4b36e9e14d172c3610` ja ReportHub-main-commitista `ca926dfe70f5943e262c99813ca313b7fe09060a`. Uudet työpuut ovat:

- Reseptit: `D:\Projects\Products\Reseptit-glycemic-coverage-batch-2b4`, haara `codex/glycemic-coverage-batch-2b4`.
- ReportHub: `D:\Projects\_Hub\ReportHub-reseptit-glycemic-coverage-batch-2b4`, haara `codex/reseptit-glycemic-coverage-batch-2b4`.

Ennen sisältömuutoksia toistettu lähtötilanne: 325 reseptiä, 126 laskettua, 199 keskeneräistä, 38 GI-tietuetta (5 STRONG, 33 SUPPLEMENTARY). Strict nutrition audit oli 180 ESTIMATE WITH EVIDENCE, 86 INSUFFICIENT SOURCE DATA, 59 MISSING ja 0 CONFLICT REQUIRES REVIEW.

Lähtösnapshot: [2B4 baseline JSON](glycemic-coverage-batch-2b4-baseline.json).
Laskennan jälkeinen 325 reseptin inventaario: [2B4 current JSON](glycemic-coverage-batch-2b4-current.json) ja [Markdown](glycemic-coverage-batch-2b4-current.md).

## Inventaarioanalyysi ja esteiden ryhmittely

Kaikki 199 lähtötilanteen keskeneräistä reseptiä sisältyvät JSON-snapshotiin yksilöllisine tunnisteineen, resepti-, syöte- ja lähdefingerprintteineen, reseptirakenteineen, GK-estoineen ja ravintoarvotiloineen. Luokittelu on päällekkäinen: resepti voi esiintyä useassa luokassa, joten määrät eivät summaudu 199:ään.

| Erän luokka | Inventaarion este | Reseptien määrä | Huomio |
|---|---|---:|---|
| A | GI_MISSING | 41 | GI puuttuu; tarkistettava myös kyseisen osuuden hiilihydraatti ja pienosuustoleranssi. |
| B | GI_MATCH | 93 | Sidottu GI ei vastaa ainesosaa/valmistusta tai sen perustelu ei läpäise tarkistusta. |
| C | COMPOSITION | 65 | Koostumustietue tai ruoan tila puuttuu. |
| D | MASS_PREPARATION | 20 | Massa-, tilavuus- tai valmistustilatieto puuttuu. |
| E | OTHER ja yksilöintiin liittyvät syyt | 59 | Mukana esimerkiksi tunnistamaton tuote, kastike tai vaihtoehtoinen ainesosa. |
| F | STRUCTURE sekä muut estot | 41 | Vanhentunut rakennesidonta; kaikilla 41 reseptillä oli myös muu esto katselmoinnin aloitustilassa. |
| G | TOLERANCE ja muut | 7 | Kumulatiivinen pienosuustoleranssi estää laskennan; muita ryhmiä voi esiintyä rinnalla. |

Lisäksi INPUT- ja EVIDENCE-estoja oli alkutilan inventaariossa 0. Rakennesidonnan tarkistus löysi 51 historiallisesti muuttunutta sidontaa, mutta yksikään ei ollut ratkaistavissa pelkällä sidontapäivityksellä: jokaisella oli muu GK-esto. Näitä ei päivitetty automaattisesti.

Priorisointi on lähdevalmiuden työjärjestys, ei luottamus- tai lääketieteellinen pistemäärä. Arvioin jokaisesta ehdokkaasta estojen määrän ja tyypin, ravintoarvotilan, olennaisten hiilihydraattien osuuden, määrän/ruokamuodon selvyyden, mahdollisen lähteen ja ratkaisun uudelleenkäytön. Ensimmäiset ehdokkaat ovat yhden tai kahden GK-eston reseptejä, joiden ravintoarvo on tuettu ja joiden hiilihydraattilähde on yksilöity. Aiemmat lähdeumpikujat siirrettiin pois kärjestä.

## Lähdevalmiuden 15 ehdokasta

Taulukon GK-esteet ovat lähtötilan esteitä, ennen mango-osuman korjaamista. “Ratkaistavuus” ilmaisee lähdehaun työarviota, ei tutkimustulosta eikä GK-luottamusta.

| Sija | recipeId | GK-estot lähtötilassa | Ravintoarvotila | Ratkaistavuus | Yhteinen lähdehyöty | Työarvio | Prioriteetti ja syy |
|---:|---|---|---|---|---|---|---|
| 1 | karibia-mango-limejogurtti | GI_MATCH: mango, 12,6 g käytettävissä olevaa hiilihydraattia/annos | ESTIMATE WITH EVIDENCE | Korkea | Kyllä, toinen mangoresepti | Pieni | Julkaistu raakamangon keskiarvo vastaa tuoteryhmää ja valmistusta. |
| 2 | vhh-raparperipiirakka | GI_MATCH: raparperi | ESTIMATE WITH EVIDENCE | Keskitaso | Mahdollisesti | Pieni–keskisuuri | Yksi nimetty ainesosaesto ja tuettu koostumus; lähdeosuma täytyy vahvistaa. |
| 3 | sitruuna-yrttikana-parsa | GI_MATCH: parsa | ESTIMATE WITH EVIDENCE | Keskitaso | Kyllä, kasvislähteestä voi olla muillekin apua | Pieni | Yksi nimetty ainesosaesto; hiilihydraattivaikutus on pieni, mutta sitä ei oleteta nollaksi. |
| 4 | raejuusto-pesto-kasviskulho | GI_MATCH: pinjansiemen, rucola | ESTIMATE WITH EVIDENCE | Keskitaso | Mahdollisesti | Keskisuuri | Kaksi tunnistettua ainesosaa; tarkistettava, voiko pienosuustoleranssi kattaa ne yhdessä. |
| 5 | chettinad-kana | GI_MATCH: inkivääri, korianterinsiemen | ESTIMATE WITH EVIDENCE | Keskitaso | Mahdollisesti | Keskisuuri | Kaksi maustetta; vain lähteistetty annoskohtainen yhteisvaikutus ratkaisee. |
| 6 | congee-riisipuuro | GI_MATCH: kanaliemi, inkivääri | ESTIMATE WITH EVIDENCE | Keskitaso | Mahdollisesti | Keskisuuri | Kaksi estoa; liemen osuus tarkistettava ennen mausteen toleranssia. |
| 7 | bulgogi | GI_MATCH: päärynä, seesaminsiemen | ESTIMATE WITH EVIDENCE | Keskitaso | Kyllä, päärynä voi toistua | Keskisuuri | Päärynän GI tunnetaan raakana, mutta marinointi/kypsennys on vastaavuuskysymys. |
| 8 | tabbouleh | GI_MATCH: bulgur, persilja, minttu | ESTIMATE WITH EVIDENCE | Keskitaso | Kyllä, bulgurlähde voisi auttaa muitakin | Keskisuuri | Päähiilihydraatille on tutkimuksia, mutta bulgurin laatu ja valmistus on kohdennettava. |
| 9 | marokkolainen-couscous | GI_MATCH: couscous, kanaliemi, korianteri | ESTIMATE WITH EVIDENCE | Keskitaso | Kyllä, viljatuotelähde voisi auttaa | Keskisuuri | Tutkimuksia on, mutta kuiva/rehydratoitu tuote ja reseptin kypsennys eivät ole automaattisesti sama. |
| 10 | liha-juureskeitto-perunaton | GI_MATCH: lanttu, persilja | ESTIMATE WITH EVIDENCE | Matala | Mahdollisesti | Keskisuuri | Lanttulaatikon tapaan kypsennystapa heikentää GI-vastaavuutta. |
| 11 | vhh-mokkapalat | GI_MATCH: kaakaojauhe kahdessa erässä | ESTIMATE WITH EVIDENCE | Matala | Kyllä, muiden kaakaoreseptien kanssa | Keskisuuri | Tuotemuoto ja paistaminen vaativat lähdeosuman; ei automaattista suklaa-analogiaa. |
| 12 | meheva-suklaakakku | GI_MATCH: tumma suklaa kahdessa erässä ja kaakao | ESTIMATE WITH EVIDENCE | Matala | Kyllä | Suuri | Useita lähteitä ja tuotemuotoja; ei valittu lähdeperusteiden puuttuessa. |
| 13 | keto-suklaakeksit | GI_MATCH: sokeriton tumma suklaa | ESTIMATE WITH EVIDENCE | Matala | Kyllä | Suuri | Suklaa on reseptissä paistettu ja tuotekohtainen; mantelijauhon GI-umpikujaa ei avata uudelleen. |
| 14 | intialainen-aloo-paratha | GI_MATCH: vehnäjauho, korianteri | ESTIMATE WITH EVIDENCE | Matala | Mahdollisesti | Suuri | Paratha-tyyppisten leipien tutkimukset eivät itsessään osoita aloo parathan GI:tä. |
| 15 | spanakopita | GI_MATCH: filotaikina, 14,88 g/annos | ESTIMATE WITH EVIDENCE | Matala | Ei osoitettua | Suuri | Filotaikina on aiempi tutkimusumpikuja; ei valittu ilman uutta, olennaista lähdettä. |

Muita pois rajattuja aiempia umpikujia olivat kypsä/säilyketomaatti, tavallinen kypsennetty maissitärkkelys, mantelijauho, uppopaistetun taikinamaissin GI sekä yksilöimätön kookosmaito.

## Sisällölliseen lähdekatselmointiin valitut

Kaksi reseptiä valittiin tarkempaan tarkistukseen (raja oli enintään kahdeksan).

### karibia-mango-limejogurtti

- Lähtöesto: raakamangon 12,6 g käytettävissä olevaa hiilihydraattia annosta kohti oli sidottu GI-arvoon 51, joka oli laajan 105 hedelmätuotteen kategorian keskiarvo. Sidontateksti väitti keskiarvon olevan tamarinditahnan analogia. Reseptissä on 200 g kuorittua raakaa mangoa kahdelle annokselle.
- Lähde: Foster-Powell, Holt ja Brand-Miller kokoavat *International table of glycemic index and glycemic load values* -taulukon 2 merkintään 412 raakaa mangoa koskevan kolmen tutkimuksen keskiarvon GI 51 ± 5 (glukoosi = 100). Merkinnän tutkimuksissa oli eri mangoja ja tutkittavia; keskiarvo ei ole tämän reseptin tai aterian mittaus. Reseptille käytetään SUPPLEMENTARY/ANALOG/LOW-luokitusta.
- Reseptin ainemääriä, annoskokoa ja mangoaineksen 200 g määrää ei muutettu. Koostumustietue säilyy AFCD F005299 (kuorittu raaka mango).
- Lime ja kookoshiutale jätetään nykyisen toimituksellisen toleranssin mukaisesti pois: yhteensä 0,730 g käytettävissä olevaa hiilihydraattia/annos (0,090 g limeä ja 0,640 g kookoshiutaleita). Tämä on toimituksellinen toleranssi, ei kliininen tarkkuusraja.
- Tulos: mallin GK-arvio 7,3/annos ja näkyvä yhden merkitsevän numeron arvo 7, LOW-luottamus. Laskentaan sisältyvien GI-osuuksien summa ennen mallin esityspyöristystä on 7,301. Pienosuuksien yhteisvaikutus on raportoitu. Aiemmin arviota ei ollut; luokittelun tulkinta muuttuu uuden arvion myötä, mutta aiempien numeeristen GK-arvojen merkityksellisesti muuttuneita tapauksia tästä reseptistä on 0.

### thai-kookosriisi-mangolla

- Mango-osuma oli sama väärä laaja hedelmäkeskiarvo. Se korvattiin samalla julkaistulla raakaa mangoa koskevalla keskiarvolla.
- Reseptin 200 ml kookosmaitoa on edelleen tunnistamaton tuote (tölkkikookosmaito vai kookosjuoma; rasvapitoisuus tuntematon), eikä massa- tai koostumusoletusta tehty. Resepti pysyy keskeneräisenä eikä siitä näytetä GK-kokonaisarviota.
- Resepti oli jo keskeneräinen eikä sillä ollut julkaistua numeerista GK-arvoa, joten aiempaa arvoa ei muuttunut. Tämä resepti ei kasvata laskettujen reseptien lukumäärää.

## Lähdearvio ja rajat

Hyväksytty mango-osuma perustuu julkaistuun, ruoka-ainekohtaiseen keskiarvoon, jonka GI on sama kuin aiempi yleinen keskiarvo. Korjaus täsmentää ruoka-ainevastaavuuden; se ei muuta mangon GI-lukua eikä ole tarkka lajike- tai ateriamittaus.

Lähdeviitteet:

- Foster-Powell, Holt ja Brand-Miller 2002, *International table of glycemic index and glycemic load values*, taulukko 2, raakaa mangoa koskeva merkintä 412, keskiarvo 51 ± 5: [American Journal of Clinical Nutrition](https://doi.org/10.1093/ajcn/76.1.5).
- Guevarra & Panlasigui 2000, kontrolloitu ihmistutkimus (n=10, tyypin 2 diabetes; mango GI 59, 25 g saatavilla olevaa hiilihydraattia): [Asia Pacific Journal of Clinical Nutrition](https://onlinelibrary.wiley.com/doi/10.1046/j.1440-6047.2000.00159.x). Yksittäistä tulosta ei käytetty mango-yleisarvona, koska reseptin lajiketta ei tunneta.
- Atkinson ym. 2021:n supplemental-taulukossa on Chin-Hwang-mangon yksittäinen lajikemittaus GI 48 ± 0,3 (n=7), mutta reseptin lajiketta ei ole määritelty. Siksi sitä ei sidottu tähän reseptiin: [2021 supplemental table](https://nutritotal.com.br/pro/wp-content/uploads/sites/3/2021/09/Tabela1_IG.pdf).

## Biryani-avoimen asian rajaus

Hyderabadi-kanabiryanin tavallisen ravintoarvolaskennan sipulimuunnos (2 × 100 g) ja GK-syötteen Fineli-muunnos (2 × 55 g) ovat edelleen erillinen avoin ravintoarvohuomio. Sitä ei muutettu, eikä sitä lasketa 2B4:n GK-parannukseksi.

## Nykyinen auditointitila

Inventaarion uudelleenajo nykyisestä lähdesyötteestä: 325 reseptiä, 127 laskettua, 198 keskeneräistä ja 39 GI-tietuetta (5 STRONG, 34 SUPPLEMENTARY). Yksi aiemmin keskeneräinen resepti sai kokonaisarvion. Aiemmin laskettuja reseptejä ei estynyt.

- Uudet GK-arviot: 1, LOW-luottamus, GK 7,3/annos (näytöllä 7; GI-osuuksien pyöristämätön summa 7,301).
- Aiemmat laskennalliset numeeriset arvot, jotka muuttuivat lähdekytkennän tarkennuksen vuoksi: 0 merkityksellistä; mangon kohdalla GI pysyi arvossa 51, eikä aiemmin julkaistu numeerinen GK tai ruokavalintavertailu muuttunut.
- Reseptimäärät: ei muutoksia.
- Kuiva/kypsä-painoja: ei muutoksia.
- GK-kaavaa tai 1 g / 2 g toleransseja: ei muutoksia.
- Hyderabadi-biryanin tavallisia ravintoarvoja: ei muutoksia.
- Aiemmin tutkitut lähdeumpikujat: ei avattu uudelleen.

Seuraava inventaario muodostettiin koko 325 reseptin aineistosta. Siinä on 127 laskettua, 198 keskeneräistä, 39 GI-tietuetta ja 5/34 Strong/Supplementary-jakauma. Erän current JSON sisältää uuden nykytilan kaikki 325 ID:tä sekä baseline-tilan fingerprint- ja estotiedot vertailua varten.

## Toistetut paikalliset tarkistukset

- `npm run content:sync`: läpäisi.
- `npm run audit:nutrition -- --strict`: läpäisi; 180 / 86 / 59 / 0.
- `npm run audit:glycemic-load`: läpäisi; 325 reseptiä, 127 laskettua ja 198 keskeneräistä.
- `npm run audit:glycemic-coverage`: tuotti 325 reseptin snapshotin; yksi uusi arvio, ei uusia rakenne-, syöte- tai evidenssifingerprint-ristiriitoja baselineen nähden.

Muut CI-tarkistukset, pull requestien tila ja jäljellä olevat testit täydennetään niiden ajojen jälkeen. Tämä raportti on Draft-auditointia eikä osoita tuotantojulkaisua.

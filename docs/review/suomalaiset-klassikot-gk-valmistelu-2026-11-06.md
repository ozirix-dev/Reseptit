# Suomalaiset suosikit – viiden reseptin lähde-, brändi- ja GK-katselmointierä

Päiväys: 2026-11-06 · Tila: DRAFT / omistajakatselmointi · Kohde: Recipavo

## Päätös

20 ehdokkaasta suurin osa on jo tarjolla Reseptit-sivustolla. **Ei perusteta niille uusia päällekkäisiä reseptejä.** Uudet raakileet ovat:

| Tunnus | Toimituksellinen rooli | Erityisehto |
| --- | --- | --- |
| `karjalanpiirakat-riisipuurolla` | Suomalainen nimisuojattu perinne, kansainvälisesti kiinnostava | APT-eritelmä, koeleivonta, GI-lähteet |
| `marry-me-kanapasta` | Suosittu täysipainoinen arkiruoka | Pastan GI, tomaattisäilykkeen tarkka tuote |
| `uunifetapasta-kirsikkatomaateilla` | Suomalaisen alkuperäisen ruokaidean kansainvälinen tarina | Idean tekijän tunnustus, pastan GI |
| `raejuustobagelit-ilman-kohotusta` | Helppo proteiiniraaka-ainetta hyödyntävä leivonnainen | Koeleivonta, valmiin leivän GI-matriisi |
| `linssimakaronilaatikko` | Suomalaisen uuniruoan kasvisvaihtoehto | Linssien ja makaronin GI-vastaavuus |

Kaikki viisi ovat `reseptit/raakileet/`-hakemistossa tilassa `status: draft`: **ei vielä tuotantojulkaisua, ei uutta kategoriaa, ei kuvia eikä käännöksiä**. Pidä muualla käynnissä olevat hero-, blogi-, käännös- ja GK-PR:t koskemattomina.

## Tärkeimmät lähteet ja oikeuksien rajaus

- Karjalanpiirakka – Ruokaviraston nimisuoja- ja valmistustapasäännöt: https://www.ruokavirasto.fi/yritykset/oppaat/nimisuojattujen-elintarvikkeiden-valvontaohje/nimisuojattujen-elintarvikkeiden-valvontaohje/
- Perinnepiirakan työtekniikka ja vaihtoehtojen vertailu, Martat: https://www.martat.fi/reseptit/karjalanpiirakat/
- Kulttuurinen tausta, Hotelli- ja ravintolamuseo: https://hotellijaravintolamuseo.fi/karjalanpiirakoiden-historia/
- Marry me -kanapastan ja linssimakaronilaatikon vuoden 2025 suosioväitteet, K-Ruoka: https://www.k-ruoka.fi/artikkelit/arki/suomen-suosituimmat-reseptit
- Uunifetapastan alkuperäinen idea ja tekijä, Jenni Häyrinen / Liemessä 4.2.2019: https://liemessa.fi/2019/02/uunifetapasta/
- Raejuustobagelien suosio 2025, Kotona: https://www.meillakotona.fi/artikkelit/vuoden-2025-suosituimmat-suolaiset-leivonnaiset
- GI-tietokannan ensisijainen hakuväline **ei automaattinen hyväksyntä**: https://glycemicindex.com/gi-search/

Reseptien sanamuoto ja määrät ovat uusia toimituksellisia työversioita, eivät muiden julkaisujen teksti- tai kuvakopioita. Lähde mainitaan täsmällisesti silloin, kun ruokalaji on yhdistettävissä tunnettuun tekijään. Mikään sivun teksti ei saa antaa ymmärtää, että Recipavo olisi keksinyt uunifetapastan, kehittänyt perinteisen karjalanpiirakan tai saanut kolmannen osapuolen suosion perusteella omaa palkintoa.

## Luotettavan ravintoarvon ja GK:n portit

1. **Reseptin syötteet:** yksi `recipe_id`, painot grammoina, yksi pääasiallinen versio ja täsmälleen määritelty annos. Kuivapainot, kuorittu paino, valutettu paino ja voitelun imeytymä kirjataan erikseen. Munavoi ja muut lisukkeet eivät kuulukaan karjalanpiirakan laskuun, jollei niitä myöhemmin mallinneta erilliseksi ateriaksi.
2. **Koetoteutus:** punnitse raaka-aineet ennen valmistusta; punnitse myös valmis kokonaistuotos, mahdollinen hylky, kaulintajauhon jäämä, keittoveden poistuma ja käytetty voitelurasva. Näin voi tarkistaa annoskoon, mutta **veden haihtumista ei saa tulkita hiilihydraattien katoamiseksi**.
3. **CHO-lähdesidokset:** tuo jokaiselle relevantille ruoka-aineelle yksilöity Fineli/AFCD/CNF-/pakkaustietue ja oikea EU-hiilihydraattimääritys. Älä vähennä kuitua EU-pakkaustiedon hiilihydraatista toistamiseen.
4. **GI-näyttö:** etsi soveltuva mitattu GI juuri kyseiselle tuotteelle/valmistusmenetelmälle. Eri riisilajin, eri pastatyypin, ruisleivän tai vehnäjauhon ryhmäkeskiarvo ei kelpaa automaattiseksi korvikkeeksi. Merkitse lähteen näyttöluokka.
5. **Estesäännöt:** olennaisen GI-lähteen puuttuessa GK = HOLD, ei nolla eikä tekaistu vaihteluväli. Nykyisen `docs/nutrition/README.md`-politiikan mukaan GI:ttömän ainesosan imeytyvä hiilihydraatti on **yksittäin alle 1 g/annos** ja tällaisten osuuksien summa **alle 2 g/annos** (tasan 2 g estää). Raja ei oikeuta ryhmäanalogiaa tai tuntematonta määrää. Älä avaa GROUP ANALOG -kiertotietä.
6. **Laskennan jäljitettävyys:** tallenna syöteversion SHA, ainesosa-ID:t, tuotepakkausten versiot, GI-tutkimuksen täsmällinen kohde, annosluku, laskukaava, epävarmuudet ja katselmoijan päätös `docs/nutrition/`-dokumentaatioon ennen arvojen hyväksyntää.
7. **Julkaisun ero GK:hon:** ravintoarvoiltaan tarkastettu perinneresepti voidaan tuoda julkaisukatselmointiin myös GK-estolla, jos sivusto näyttää esteen rehellisesti. **Mitään numeerista GK-arvoa ei julkaista ilman projektin näyttöporttien hyväksyntää.**
8. **Kuvat ja kieliversiot:** vain uusi oma tai lisensoitu kuva, oikea ruokalaji kuvassa, neljän kielen (FI/EN/SV/TH) merkitystarkistus ja toimivat lähdeviittaukset. Käytä nykyistä kuvakoon/SEO-ohjeistusta. Ei kopioituja lähdekuvia.

## Reseptikohtaiset hyväksymisesteet

| Resepti | Pääasiallinen hiilihydraattikuorma | GI-riskit | Koetoteutuksen lisätarkistus |
| --- | --- | --- | --- |
| Karjalanpiirakat | Puuroriisi, ruis- ja vehnäjauho, maidon laktoosi | Riisin lajike; leivotun kuoren GI; mahdollinen koko reseptin mittaustarve | 24 samanpainoista, ohut ruiskuori, APT-eritelmä, kaulintajauho ja voitelu |
| Marry me -kanapasta | 240 g kuivaa durumspagettia/4 annosta; sipuli ja tomaattisäilyke | Pasta al dente; öljysäilykkeen sokeri-/pakkauserot | Kana kypsä, kastike riittävä, valutettu tomaatti |
| Uunifetapasta | 240 g kuivaa durumpenneä/4 annosta; 450 g tomaattia | Penne GI ja tomaatin osuus | Öljy jää vuokaan eikä katoa laskusta |
| Raejuustobagelit | 300 g vehnäjauhoa/6 kpl; raejuuston laktoosi | Ei päätellä GI:tä jauhon tai toisen leivän indeksistä | Rinkilä pysyy koossa, sisus kypsä, muna-imeytymä |
| Linssimakaronilaatikko | 220 g kuivaa makaronia ja 150 g kuivia linssejä/6 annosta; maito | Molempien päälähteiden soveltuva GI, yhteisvaikutusta ei oleteta | Makaronin kypsyys ja linssin rakenne |

**Karjalanpiirakan erityissääntö:** säilytä perinne. Ruis- ja vehnäjauhojen käyttö, riisitäyte, ohut rypytetty kuori, **275 °C / 15–20 min** paisto ja sallittu voitelu on tarkistettava ennen `karjalanpiirakka`-nimen käyttöä julkisella sivulla. Poikkeava ketoversio saisi eri nimen, esimerkiksi `riisipiirakkaa muistuttava VHH-piiras` – sitä ei lisätä tähän erään.

## Julkaisupolku ja omistajapäätös

- **V1 / nykyinen PR:** viisi punnittua suomenkielistä raakiletta, lähteet, esteet ja katselmointi. Ei rikota tuotantoa.
- **V2 / erillinen työ:** koeleivonta/-keitto, ainesosien tietueet, ravintolaskenta ja kohdennettu GI-tutkimus; epäkelpoiset jäävät HOLDiin.
- **V3 / erillinen hyväksytty PR:** korkealaatuiset uudet kuvat, ihmisen tarkistamat kolme käännöstä, sopivat metatiedot, testit, omistajan sisällöllinen hyväksyntä ja julkaisu.

**Älä julkaise tai merkitse GK PASSiksi vain siksi, että ainekset on punnittu.** Tämän erän tavoite on nostaa viisi aidosti erottuvaa reseptiä valmiiksi myöhempää luotettavaa laskentaa ja toimituksellista hyväksyntää varten.

## V1-katselmoinnin jatko 6.11.2026

- Tarkennettu APT-liite 12: piirakan työversiossa nyt vain **sulatettu voi** voiteluun; aiempi voi–vesiseos poistettu, jotta ohje seuraa selvästi kirjattua vaihtoehtoa. Paistoaika tarkennettu 15–20 minuuttiin 275 °C:ssa. Ruokaviraston eritelmä sallii myös laktoosittoman maitojuoman, mutta valittu versio käyttää tavallista täysmaitoa yhtenäisen ravintolaskennan vuoksi. Kuoritaikinan ruisosuus pysyy 75 %:ssa.
- Ruokaturvallisuus: nopeasti jäähdytettävän riisipuuron käsittely täsmennetty. Marry me -broilerille lisätty yli 75 °C sisälämpötilan tarkistus. Ruokaviraston lähteet: https://www.ruokavirasto.fi/elintarvikkeet/elintarvikeala/hygieeninen-toiminta/tuotanto--ja-kasittelyhygienia/jaahdyttaminen/ ja https://www.ruokavirasto.fi/elintarvikkeet/elintarvikeala/hygieeninen-toiminta/tuotanto--ja-kasittelyhygienia/kypsentaminen/.
- **GI-tutkimuksen jatko:** [kohdennettu lähderaportti](suomalaiset-klassikot-gi-lahdehaku-2026-11-06.md) erittelee julkaistut pasta- ja linssitutkimukset, nykyisen aineiston `ehold`-tietueet, kiellon muuttaa analogiaa täsmäosumaksi sekä täsmälliset seuraavat toimet.
- Tässä erässä ei ole kokeellisesti paistettu tai keitetty ruokaa, varmennettu tuotemerkkipakkauksia eikä hyväksytty yhtään uutta GK-lukua. CI on tarkistettava aina uusimmalta HEADilta.

## V2 – 6.11.2026: lähdematriisi ja koekeittiön testipohjat valmiit

Vaihe 2 on tehty **tutkimus- ja valmistelutasolla**, ei fyysisinä koepaistoina tai hyväksyttyinä ravintoarvoina:

- [Koneellisesti luettava 47 ainesosarivin ravintolähdematriisi](suomalaiset-klassikot-v2-aineslahiematriisi.json), sisältäen reseptien ja lähdeaineiston blob-SHA-tunnisteet. 36 rivillä on kirjastosta löytynyt lähdetietue-ehdokas, 24 on ilman tässä vaiheessa todettua täsmäys-/punnitusestettä, 11 vaatii tuotteiden tarkemman tunnistamisen, 3 vaatii toteutuneen massan mittauksen ja 9 on vesi-/suolariviä. Joissakin esteellisissä riveissä on silti ravintolähteen yleisehdokas; ryhmät eivät ole päällekkäisiä hyväksymisluokkia.
- [Viisi reseptikohtaista koekeittiö- ja laskennan hyväksyntäkorttia](suomalaiset-klassikot-v2-koe-ja-ravintokortit.md), sisältäen oikeat seuraavat punnitukset, täsmäpakkauksen tarpeen ja tuotannon stop-säännöt.
- Uutta GK-arvoa ei hyväksytty. Mikään ravintoarvo ei siirtynyt reseptien julkisiin kenttiin, eikä `docs/nutrition/calculations/`-hakemistoon luotu ennenaikaista hyväksyntädataa.
- Käytännön testejä, omia kuvia tai käännöksiä ei ole tehty tässä vaiheessa. Näiden merkintä valmiiksi ilman toteutusta olisi harhaanjohtavaa.
- V3 vaiheistetaan vasta tuotevalintojen, aineskohtaisen ravinto-/GI-näytön ja koekeittiökohtaisten havaintojen jälkeen; erityisesti karjalanpiirakka säilyy aitona perinneruokana vaikka GK jäisi HOLDiin.

## V3 – 6.11.2026: tuotteiden yksilöinti ja eheystarkistus

- [8 yksilöityä Suomessa listattua tuote-ehdokasta EAN-tunnuksineen, pakkauslähteineen ja GI-näytön luokituksineen](suomalaiset-klassikot-v3-tuote-gikandidaatit.json).
- [Tuotetäsmäyksen ja laadun tarkka raportti](suomalaiset-klassikot-v3-tuotetasmays-ja-laatuportit.md) kokoaa jatkoesteet, mukaan lukien De Cecco Spaghetti n°12:n samasta EANista ristiriitaiset 69/72 g CHO/100 g -arvot.
- Viiden reseptin ainesosanimet, lähdematriisin rivit ja GitHub-blob-SHA:t on synkronoitu. Annosmäärät ja gramma-annokset säilytettiin.
- Erillinen eheyden tarkistaja `node docs/review/verify-finnish-classics.mjs` (repon juuresta) varmistaa viiden raakilereseptin, 47 rivin, 8 tuotteen sekä lähde-SHA-tunnisteiden ristiriidattomuuden. Testi ei kuulu `npm test` -sarjaan, koska lukittu GK-historiatesti hylkää uuden raakilesisällön koko-resepti-inventaariossa; tätä sinettiä ei muuteta tai kierretä.
- GI-tietokannan 2005 De Cecco Spaghetti n°12 -mittaus (GI 50) on nykyiselle samannimiselle tuotteelle **erittäin lupaava ehdokas**, ei automaattisesti hyväksytty GI. Myös Barilla Penne ja vihreät linssit pysyvät HOLDissa, kunnes täsmävastaavuus osoitetaan.
- **Julkaisuportti pysyy kiinni:** 5 DRAFT, 0 uutta ravintoarvoa, 0 GK PASS, 0 julkaistua reseptiä. Fyysinen koekeittiö ja pakkauksien tarkistus ovat edelleen tekemättä.

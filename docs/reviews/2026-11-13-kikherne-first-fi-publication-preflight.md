# Kikherne-yrttiaamiaisen julkaisukatselmointi – 13.11.2026

## Päätös

**FI-korjausehdokas on kulinaarisesti valmisteltu ja aritmeettisesti laskettu, mutta karanteenista ei vielä vapauteta.** Työ on rajattu PR #535:n V2-Draftiin. Ei kosketa alkuperäisen `recipe_id: valimerellinen-kikherne-yrttiaamiainen` lähteeseen, sen GK-sinetteihin, käännöksiin tai karanteenilistaan. Ei ole fyysistä keittiökoetta eikä riippumattoman ravintoasiantuntijan hyväksyntää. Täsmähaarassa vielä puuttuvat lähde-GI/GK-hyväksyntä, kaupallisen tuotteen vastaavuus ja kuvan sisällön tarkistaminen.

## Reseptin hyväksyttäväksi ehdotettu rakenne

- 2 annosta, vain FI; 100 g suolattomassa vedessä ennalta kypsennettyjä ja valutettuja kikherneitä, 150 g kurkkua, 8 g persiljaa, 20 g sitruunamehua, 10 g oliiviöljyä, 2 läpikypsää kananmunaa (ravintolaskennan **oletus** 100 g kuorettomina) ja 1 g suolaa.
- V2:n ravintoarvomalli koskee suolattomassa vedessä etukäteen keitettyä kikhernettä, ei suoraan säilykepakkausta. 20 min tarkoittaa vain kokoonpanoa ja kananmunien keittämistä. Kuivattuja ei käytetä suoraan; niiden liotus ja kiehuminen ovat erillinen usean tunnin käsittely. Turvallisuustuki: [Ruokaviraston ohje papujen keittämisestä](https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/viikon-visaiset-kysymykset/), [Marttojen kikherneohje](https://www.martat.fi/ruoka/ruoanvalmistus/ruoka-aineet/palkokasvit/kikherne/). Munat keitetään täysin koviksi.
- Aineslista ja ohje vastaavat nyt toisiaan. Astiaan ei lisätä luettelematonta proteiinia, vettä tai kastiketta. Kastikkeen koko 10 g oliiviöljyä kuuluu syötäviin annoksiin. Allergeeneista ilmoitetaan kananmuna; gluteenittomuudesta ei anneta tarkistamatonta väitettä.

## Riippumaton laskenta ja herkkyys

Ravintolaskennan jokainen per100g-tuotetietue löytyy olemassa olevista repo-malleista: Fineli 11089 (kikherne suolattomassa vedessä; 17,60 g saatavilla olevaa HH:ta / 100 g), Fineli 346 (kurkku), Fineli 333 (persilja), Fineli 11557 (sitruunamehu), Fineli 536 (oliiviöljy), Fineli 858 (kananmuna, kuoreton), Fineli 30 (suola). Ks. `docs/reviews/2026-11-13-quarantine-five-nutrition-recheck.md`. [Fineli 11089 -yhteenveto](https://ravinto.ptjesse.fi/kikherne-suolattomassa-vedessa/) sekä [Fineli 858 -yhteenveto](https://ravinto.ptjesse.fi/kananmuna-kuoreton/).

Riippumaton `Decimal`-summatarkistus (koko resepti) tuotti HH 20,408 g, kuitu 6,902 g, proteiini 22,2037 g ja rasva 21,906 g. **Annokselle ehdotetaan vain laskentamuistioksi**, ei julkaistuksi arvoksi:

| Arvo | g/annos |
| --- | ---: |
| Saatavilla oleva HH | 10,20 |
| Kuitu | 3,45 |
| HH + kuitu | 13,66 |
| Proteiini | 11,10 |
| Rasva | 10,95 |

Kananmunien yhteisen raakapainon vaihtelu **90–120 g** muuttaa proteiiniarviota noin **10,47–12,36 g/annos**, rasvaa **10,49–11,88 g/annos**, hiilihydraattia vain 10,19–10,23 g/annos. Määrien käytännön toleranssi pitää ilmoittaa tai lukita punnituksi ennen julkaisun lopullista ravintokorttia. Pienet erot pyöristyksessä eivät todista syötävää massaa.

**Tuoterajaus korjattu:** V2 koskee suolattomassa vedessä **etukäteen keitettyä ja valutettua** kikhernettä, ei tiettyä kaupallista säilyketuotetta. Tämän vuoksi sen Fineli 11089 -arvo on ravintomallin lähtökohta, ei säilykkeen etiketin hyväksyntä. Esimerkiksi GoGreen Luomu kikherneille EAN 7310130009822 valmistaja ilmoittaa 11 g HH/100 g ja Fineli 11089 17,6 g HH/100 g: nämä eivät ole sama ravintotietue; [valmistaja](https://www.gogreen.fi/tuotteet/luomu-kikherneet/), [K-Ruoka ilmoittaa myyntitilan ravintoarvot](https://www.k-ruoka.fi/kauppa/tuote/gogreen-kikherneet-380230g-luomu-7310130009822). Säilykeversiota ei hyväksytä samalla makroluvulla ilman erillistä tarkkaa tuotemallia. Kotona keitetyn lopullinen vesipitoisuus vaihtelee, joten tämäkin Fineli-viite on laskennallinen arvio.

## GK / julkaisuportit

Sydneyn yliopiston [kikherneiden GI 35](https://glycemicindex.com/2023/09/beans-lentils-and-peas//) koskee **canned, drained** -tutkimusruokaa. Tämä ei vielä todista kyseisen suomalaisen tuote- ja määräversion yksilöllistä GI-vastaavuutta; projektin ryhmäanalogian esto jää voimaan. **GK: ei määritetty** nykyisessä V2-versiossa, ei numeroksi 0. Ravintolaskennan hyväksyntä ei automaattisesti hyväksy GK:ta.

Käytetty lähde- ja versiosuoja:
- vanha FI-lähde Git blob `33923cc854eabc27c7905db024c3b2e7d9ca44ab` (lähtötilanne, ei muutettu)
- GK80/yleinen rakennesidos `docs/nutrition/glycemic-load-recipe-bindings.json`: reseptisidos `3400a38cf268e1e95ca719757f737a979ab3486f54cdd97901cf867aa651aac3` — ei saa hiljaisesti muuttaa
- ei kuulu 70 valittuun GK149-lähteeseen; eikä neljän GK100-hyväksyntäpaketin reseptilistaan
- `meta/kaannokset/published-translation-pairs.json` ei sisällä reseptiä; varsinaisten EN/SV/TH-julkaisujen olemassaolo tarkistetaan vielä kokonaan ennen FI:n palautusta
- alkuperäisen kuvan `kuvat/aamupalat/valimerellinen-kikherne-yrttiaamiainen.webp` blob `4c13ff1c5b681044b3b943f80cf944af57fb70ba` löytyi, mutta visuaalista ainesosavastaavuutta (sis. kananmunat) ei vielä voitu todentaa. Ei kuvahyväksyntää pelkän tiedoston olemassaolon perusteella.

## Seuraavan PR:n tarkkarajainen valmis-ehto

1. Lukitse suolattomassa vedessä ennalta keitetyn kikherneen **kypsä, valutettu 100 g** ja keskikokoisten munien syötävä massa; tee Fineli 11089/858 -aineiston täydellinen julkaisuun sidottu laskenta (ei säilyketuote-analogia).
2. Tarkista itse kuva. Jos kuva näyttää vain kikherne-kurkkusalaattia ilman munaa, vaihda kuva tai kuvaa se pelkäksi kuvitukseksi; älä väitä täydellistä vastaavuutta.
3. Hyväksy uusi FI-lähde reseptitunnuksella **vain** erillisessä lähdemigraatio-PR:ssä, joka joko säilyttää/tunnistaa GK-historian tarkat sidokset tai nimenomaisesti osoittaa uuden, versionmukaisen hyväksynnän. Vanhojen sinettien ohi ei mennä.
4. Tarkista käännökset, suorita täsmä-HEAD CI, mainin build/deploy ja julkiset URL:t. Vasta sitten poista `valimerellinen-kikherne-yrttiaamiainen` karanteenista.

**Tämä on yksi reseptikohtainen julkaisupäätöspohja, ei uusi yleinen CI- tai GK-arkkitehtuurin uudelleenkirjoitus.**

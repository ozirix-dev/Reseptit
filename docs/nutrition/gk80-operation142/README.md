# GK80 Operaatio 142 — kymmenen reseptin julkaisuintegraatio

> Tämä on Operaatio142:n historiaraportti. Operaatio143 palautti neljä makropakettia ja täsmensi kolme sisältökohtaa samassa PR171:ssä. Nykyiset päätökset ja6/4-makrojako ovat [Operaatio143:n katselmoinnissa](../gk80-operation143/README.md); integration.json sisältää nykyiset versiohashit. Alla olevat2/8-tarkistustulokset kuvaavat Operaatio142:n valmistumishetkeä.

Päiväys: 2.11.2026. Tila: **sisältökatselmointiin valmisteltu integraatio-Draft**.
Ei omistajan sisältöhyväksyntää, Ready-siirtymää, mergeä tai deployta.

## Tulos ja rajaus

**10/10 S-tapausta integroitu oikeaan julkaisupolkuun. 0/5 E-tapausta hyväksytty; kaikki viisi jäävät HOLDiin.**
Muutos ei lisää kahdeksatta tutkimuspakettia eikä aktivoi muita odottavia eriä.
PR #170 säilyy muuttamattomana tutkimustodisteena. PR #168, #169 ja ReportHub jäävät erilleen.

- Pohja: main `583fdb91aeb12114f909412b9165fc3b02a6515d`, puu `687728a7126608abfa1d44f83140177f0eef5d46`.
- Tutkimus: PR #170, HEAD `87c603bfe5ded3b1fe6af1abdaa5b0442ebc5051`.
- Tuotannosta ajon alussa varmennettu: **133/326 = 40,80 %** (HTTP 200; `production-start.json`).
- Integraatioehdokas: **143/326 = 43,87 %**, kasvu **10 reseptiä / 3,07 prosenttiyksikköä**.
- Aiemmat 133 numeerista tulosta säilyvät kokonaisina tulosobjekteina muuttumattomina. Kaikkiaan 316/326 tulosobjektia säilyy muuttumattomana.
- Teehaudutetut munat sekä kaikki viisi E-tapausta pysyvät keskeneräisinä.

143/326 on paikallisen julkaisuintegraation ehdokaskattavuus, ei tuotantokattavuus.

## Kymmenen täsmällistä versiota

Kaikki uudet tulokset ovat **LOW-luottamuksen PUBLISHED_IMPUTATION-pistearvioita**.
Kahden desimaalin luku on laskennan tarkistusarvo. Julkinen näyttö käyttää nykyistä noin yhtä merkitsevää numeroa; se ei lupaa vastaavaa biologista tarkkuutta.

| Resepti | GK/annos, tarkistusarvo | Poisrajattu A tai sen lähdemallin yläraja, g/annos | Makropaketti |
| --- | ---: | ---: | --- |
| Ratatouille | 4,63 | 0,1825875 | pidätetty |
| Sitruuna-yrttikana ja parsa | 0,88 | 0,826245 | pidätetty |
| Menemen | 2,77 | 0,1249833333 | uusi täydellinen |
| Shakshuka | 3,31 | 0,753175 | pidätetty |
| Munatacot / huevos rancheros | 1,76 | 0,446975 | pidätetty |
| Paprikainen VHH-gulassi | 3,52 | 0,5711375 | pidätetty |
| Caponata | 6,12 | 0,110025 | pidätetty |
| Janssoninkiusaus juuriselleristä | 3,05 | 0,0478875 | pidätetty |
| Täytetyt paprikat VHH | 3,73 | 0,521925 | uusi täydellinen |
| Rogan josh | 1,11 | 1,965075 | pidätetty |

Kaikki yksittäiset poisrajaukset ovat alle 1 g ja yhteismäärä alle nykyisen 2 g/annos toimituksellisen rajan. Rogan josh on lähellä yhteisrajaa; punnitut määrät ja kokonaisina poistettavat mausteet ovat sitovia. Rajaa ei ole muutettu eikä määriä pienennetty sen saavuttamiseksi. Poisrajaus ei tarkoita nollahiilihydraattia, GI 100 -oletusta tai kliinistä virherajaa. USDA-koostumuskatot ovat nimellisiä lähdemallin kattoja, eivät eräkohtaisia enimmäispitoisuuksia.

## Reseptiversioiden säilyttäminen

Tutkimusehdotusta ei kopioitu ruokasisällön muutoksineen sellaisenaan:

- Sitruunakanassa säilyvät alkuperäinen sitruunamehu 30 g, kuoriraaste 2 g ja valkosipulijauhe 3,1 g. Kokonaisen sitruunan tai tuoreen valkosipulin korvausta ei tehty. GK muuttui tutkimuksen 0,98:sta 0,88:aan.
- Shakshukassa ja munatacoissa säilyy savupaprika; shakshukassa myös puhdas kuivattu chili. Savupaprikalle nimetään Santa Maria GTIN 7311311015243. Etiketin hiilihydraattia käytetään vain pienen osuuden ylärajana, ei keksittynä polyolinollana.
- Täytetyissä paprikoissa säilyvät tomaattimurska 150 g ja tomaattipyree 16 g. Tutkimuksen 250 g murskakorvausta ei tehty. GK muuttui 4,08:sta 3,73:een.
- Rogan joshissa säilyvät kokonainen kanelitanko 2 g ja neljä kokonaisena yhteensä 1,6 g painavaa kardemummakotaa. Ne poistetaan haudutuksen jälkeen. Lähtömateriaalin katto lasketaan ilman keksittyä uutto-osuutta; kardemummalle käytetään koko punnitun massan kattoa. Jauhettuja syötäviä korvikkeita ei otettu käyttöön.
- Kaikki syötäväksi määritelty kastike ja rasva sisältyvät annosjakoon; ulkopuoliset lisukkeet eivät sisälly arvoihin.

FI/EN/SV/TH on yhdenmukaistettu: 40 reseptitiedostoa, joista 12 on uusia käännöksiä. Jokaisella uudella versiolla on koko suomenkielisen tekstin ja kolmen käännöstekstin LF-normalisoitu SHA-256. Valmistusohjeenkin muuttuminen estää kyseisen version GK:n automaattisen uudelleenkäytön. Vanhat 133 tulosta säilyttävät aiemmat sidontansa.

## Ravintoarvot ja evidenssi

Kaikille kymmenelle on uusi versioon sidottu laskentatiedosto ja batch-142-merkintä. Viisi korvattua vanhaa makroevidenssiä on arkistoitu `previous-evidence/`-hakemistoon; niitä ei merkitä uuden version hyväksynnäksi.

| Resepti | nettohiilihydraatti | kokonais-HH | proteiini | rasva |
| --- | ---: | ---: | ---: | ---: |
| Menemen | 6,87 | 8,70 | 10,74 | 16,35 |
| Täytetyt paprikat VHH | 9,65 | 13,09 | 36,40 | 35,80 |

Arvot g/annos. Pienet kuivat mausteosuudet on näissä kahdessa rajattu nykyisillä erillisillä makrosäännöillä koko massan ylärajoihin: 0,50 ja 0,75 g/annos, energia enintään 4,50 ja 6,75 kcal/annos. Lähteiden raportoimat polyolit säilyvät; puuttuvia arvoja ei täydennetä nolliksi.

**Kahdeksan muun reseptin kaikki neljä makroarvoa pidätetään.** Käytettävissä oleva saatavien hiilihydraattien tieto riittää rajattuun GK-malliin, mutta puuttuva kuitu/polyoli tai muun aineosan koostumustieto estää täydellisen makropaketin. Uusi `WITHHELD_SOURCE_INCOMPLETE` sallitaan vain, kun laskenta on todella keskeneräinen ja kaikki neljä julkaistavaa arvoa ovat null. Syöte-, annos-, lähde- ja käännöstarkistukset säilyvät. Osittaisia makroarvoja ei julkaista. Tämä pidätys on osa koko erän omistajalle esiteltävää sisältöpäätöstä.

## Viisi E-päätöstä

Yksityiskohdat ovat `e-decisions.json`-tiedostossa. Kaikki jäävät HOLDiin:

1. **Tomaatti-kananmuna-wokki:** nimetty riisin GI on lähteistetty, mutta 450 g kypsän riisin koostumus/saanto ei ole sidottu testattuun tuotteeseen. Ei arvattua kuivapainoa.
2. **Pasta alla Norma:** nimetyn pennemittauksen valmistusprotokolla ja nykyinen tuote eivät täsmää osoitetusti; Parmesan-korvausta ei hyväksytä alkuperäisen ricotta salatan tai sallitun pecorinon tilalle hiljaisesti.
3. **Carnitas:** raaka appelsiini ei osoita 2,5 tuntia haudutetun hedelmän valmistusvastaavuutta. Osuus 2,8925 g A/annos ei mahdu yksittäiseen poisrajaukseen.
4. **Döner:** UK2005-valkoisen minipitan mittausta ei yleistetä nimeämättömään lämmitettyyn pitaan. Myös coleslaw–kaalimuutos vaatisi sisältöpäätöksen.
5. **Marokkolainen couscous:** couscousin, säilykekikherneen lämmityksen, koostumusproxyjen, liemen ja broilerin koipiosan vaihtamisen vastaavuudet jäävät avoimiksi.

## Lähteet ja luokittelu

Fineli Rel20 -riveihin säilytetään saatavien hiilihydraattien määritelmä ja komponenttien alkuperätiedot. Puuttuva polyoli/kuitu on null. Uudet 43 riviä ja kahdeksan GI-korttia on nimetty `op142-*`, jotta vanhojen laskelmien lähdevalinnat eivät muutu.

PI40/50/30 ovat projektin nimettyjä laskennallisia sovelluksia, eivät mitattuja elintarvike- tai ateria-GI-arvoja. Julkiset PI-lähteet luokitellaan CALCULATION_POLICYksi. Sakkaroosin ihmisvertailu pysyy HUMAN_GI-lähteenä ja ruokaan sovellettuna analogiana. Tutkimuksen lähde- ja syötehashit säilyvät `integration.json`-tiedostossa erillään uusien versioiden hasheista.

- [Tutkimus-PR #170](https://github.com/ozirix-dev/Reseptit/pull/170)
- [Fineli](https://fineli.fi/fineli/fi/index)
- [USDA SR Legacy](https://fdc.nal.usda.gov/download-datasets/): poisrajausten käytetyt rivit tiedostossa `usda-cap-excerpts.json`.
- [Savupaprikan tuotekohtainen etiketti](https://www.minimani.fi/santa-maria-paprika-savustettu-37-g.html)
- [Venn 2014, nimetty sakkaroosivertailu](https://doi.org/10.1186/1475-2891-13-50)

## Tarkistukset

- Riippumaton Python Decimal: **10/10 GK**, kaikki poisrajauskatot ja **2/2 makropakettia PASS** (`decimal-verification.json`).
- GK-, lähde-, historiapaketti- ja nykyisen integraation regressio: **148/148 PASS**. Kaikkien 133 aiemman numeerisen tuloksen ja kaikkien 316 muuttumattoman tulosobjektin SHA-256 tarkistetaan.
- Makromalli ja evidenssi: **26/26 PASS**, sisältää uuden pidätyssäännön hyväksyntä- ja hylkäystapaukset.
- Staattinen HTML, SEO ja käännökset: **52/52 PASS**. Lopullisen lähdeselitekorjauksen jälkeen GK- ja HTML-yhteisajo **167/167 PASS**.
- Muuttuneiden reseptien rakennetarkistus: 40 kieliversiota + 10 laskentatiedostoa PASS.
- Julkisen aineiston kohdennettu tarkistus: **40/40 HTML-sivua PASS**, oikeat GK:t, PI/HUMAN-luokittelu sekä pidätysten puuttuminen myös JSON-LD:stä (`public-qa.json`). Ei selaimen interaktiotestiä.
- Lopullinen build: **703 reittiä**, 695 reseptikielisivua, ravintoarvojen strict-auditointi ilman ristiriitoja, 143/326 GK-ehdokasta. Neljä paikallista buildia: ensimmäisen jälkeen korjattiin käännösmetadata, myöhemmin palautettiin jogurtin juoksettumisohje ja täsmennettiin sakkaroosilähteen selite. Viimeistä onnistunutta buildia ei toistettu muuttumattomana.
- Historiallisten testien vanhat syötteet on säilytetty mainin muuttumattomina testifixtureina, ei päivitetty nykyisiä muutoksia vastaaviksi. Nykyiset kymmenen versiota ja kaikki 133 aiempaa numeerista tulosta testataan lisäksi oikeasta nykyisestä raportista.
- Yksikkötestit kokonaisuutena korjauksen jälkeen: **225/225 PASS**.
- GitHubin ensimmäinen koottu PR-CI #41369546048 läpäisi buildin mutta epäonnistui kolmessa `published-content`-historiatestissä: vanha makronäyttöodotus ja FI-kokoelman kielirajauksen puute. Mainin alkuperäiset kymmenen makropakettia säilytettiin testifixturessa ja suomenkielinen kokoelma rajattiin FI:hin. Nykyisten versioiden erillistä tarkistusta ei ohitettu eikä resepti-/laskentasisältöä muutettu korjauksessa. Tämä todellinen testivirhe oikeuttaa toimeksiannon mukaisen toisen automaattisen PR-CI:n. Ei manuaalista Actions-uusinta-ajoa. Lopullinen täsmällisen HEADin tulos näkyy PR:n Checks-välilehdessä ja ajon loppuraportissa; uutta dokumentointicommittia ei tehdä pelkän CI-merkinnän vuoksi.

## Hyväksyttävä kokonaisuus

**Kymmenen integroitua teknistä julkaisuehdokasta** voidaan tuoda omistajan yhteiskatselmointiin. Tarkastettavana ovat täsmälliset punnitut versiot, PI-sovellukset, kahdeksan makropaketin pidätys sekä Rogan joshin rajaus. Viisi E-tapausta eivät kuulu hyväksyttävään julkaisuun. Julkaisu edellyttää hyväksyttyä sisältöä, erillistä Ready-/katselmointivaihetta ja erillistä merge-/julkaisulupaa.

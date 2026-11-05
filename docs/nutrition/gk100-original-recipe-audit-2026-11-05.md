# GK100: alkuperäisen reseptin ensisijaisuus ja nykytilan auditointi

## Päätös ja rajaus

Omistaja vahvisti 5.11.2026: GK-laskenta mukautuu reseptiin. Pysyvä sääntö on
[GK-menetelmän päädokumentissa](README.md#alkuperäisen-reseptin-ensisijaisuus--omistajan-päätös-5112026).
Tämä työ tekee luokittelun ja korjaussuunnitelman, ei sisältöhyväksyntöjä,
menetelmän käyttöönottoa, tuotantoarvojen muutosta, mergeä tai deployta.

Alustava auditointi tehtiin mainista `081ba2c95f9243c1ed72206073160f9e64992e96`.
Työn aikana #282 yhdistettiin mainiin `ffdd0a05536b2ced7deb8b1fd94876ec4625661f`.
Uusi main tarkistettiin erillisessä omassa auditointityöpuussa: kahden HOLDin
(kookos-lime-kanacurry ja sate-ayam) syötetarkisteet muuttuivat, mutta kaikkien
326 tuloksen tilat ja numerot sekä kaikki 87 lisäversiota säilyivät samoina.
JSON-auditin main-SHA ja laskentatarkisteet on päivitetty tähän versioon.
Sisältögeneraattorin valmis reseptiaineisto käytettiin uudelleen, koska
reseptit, käännökset ja generaattori eivät muuttuneet; kuvia ei generoitu uudelleen.
Avoimet PR:t luettiin GitHubista: #285 on aktiivinen legacy-yhteensovitus,
#255 Evidence Recovery V2; #284, #279, #242, #241 ja #223 ovat suunnitelmia.
Lisäksi avoimina olivat #227, #210, #181, #180, #172, #169 ja #100.
Muiden haarojen sisältöä ei integroitu. Työpuu ja haara ovat erilliset:
`D:/Projects/tmp/reseptit-gk100-original-recipe-priority`,
`codex/gk100-original-recipe-priority`. PR #285:n ja rescue-ajon työpuihin ei kirjoitettu.

## 15 aiemman päätösehdokkaan uudelleenarvio

**ORIGINAL_OK 0, VARIANT_ONLY 14, NO_RELIABLE_GK 1,
CLARIFICATION_NEEDED 0.** Yhtään nykyistä pakettia ei voi pitää valmiina
alkuperäisen reseptin GK-ehdokkaana. Tämä ei hylkää 14 aidon version
mahdollista kulinaarista arvoa eikä väitä, että niiden GI-soveltuvuus olisi
hyväksytty. Idli-sambar säilyttää olennaisen koostumuksensa; sen lähde- ja
prosessiepävarmuus erotetaan reseptin vaihtamisesta. Siksi sitä ei niputeta
varianttien joukkoon eikä merkitä pelkkää punnitusta odottavaksi.

Kaikkien 15 alkuperäinen laskentarivi on nyky-mainissa
`INSUFFICIENT SOURCE DATA`. Nykyisillä hyväksytyillä syötteillä alkuperäisen
GK ei siis ratkea ilman puuttuvan näytön selvittämistä. Omistajan hyväksyntä
on edelleen PENDING, julkaisulupa false; uusia hyväksyntöjä 0.

| Tunnus | Luokka | Alkuperäisyys ja muutokset | GI-näytön soveltuvuus |
| --- | --- | --- | --- |
| korealainen-bindaetteok-aamiaiseksi | `VARIANT_ONLY` | Kuivajauhatus korvaa liotettujen papujen karkean soseutuksen; idut 150 → 20 g, kimchi 150 → 25 g. | GI 36 on ohuen mungpapujauholetun analogia; se ei ratkaise alkuperäistä liotettua taikinaa eikä runsaita täytteitä. |
| kerala-kalacurry | `VARIANT_ONLY` | Riisi kuuluu alkuperäisen tarjoiluun, joten sitä ei tulkita lisätyksi lisukkeeksi. Sipuli sidotaan 20 g:aan, valkosipuli 3 g:aan, inkivääri 15 → 10 g ja tamarindi 6 g:aan; vastaavuutta alkuperäisiin kappale-/lusikkamääriin ei ole osoitettu. | DreamRice-GI tukee vain nimettyä riisiosuutta ehdotetulla valmistuksella; pienennetyn curryn poisjättö on 1,935 g/annos. Alkuperäinen curry ei ratkea tästä. |
| kookos-lime-kanacurry | `VARIANT_ONLY` | Alkuperäiseen curryyn lisätään riisi; vihreät pavut 150 → 100 g ja tahna sidotaan pienempään 25 g:n erään. | Riisin ihmis-GI ja paprikan sokerimalli koskevat muutettua ateriaa; ne eivät anna alkuperäisen pelkän curryn arviota. |
| indonesialainen-lontong-sayur-aamiaiseksi | `VARIANT_ONLY` | Kookosmaito 200 ml → 80 g, kaali 1 kpl → 100 g ja 700 ml kasvis-/kanalientä → 320 g vettä. | Ciherang-riisikakun verrokki ja kaalin sokerimalli koskevat uutta kevyttä lientä; kotierän saanto ja sokerimallin soveltuvuus ovat avoimia. |
| pho-bo | `VARIANT_ONLY` | 1500 g luut + 4 l vesi ja pitkä luuhaudutus korvataan 90 g tiivisteellä + 1,5 l vedellä; inkivääri 100 → 6 g, muutkin aromit pienenevät. | Nuudelin valmistusanalogia ei selvitä alkuperäisen luuliemen liuennutta CHO:ta eikä syötyä liemiosuutta. |
| kiinalainen-bao-munalla | `VARIANT_ONLY` | Kurkku 1 kpl → 20 g ja hoisin 1 rkl → 2 g; taikina vakioidaan koeleivän suhteeseen, kohotukseen ja höyrytysaikaan. | GI 93 koskee nimetyn koehöyryleivän valmistusta; kotijauhon vastaavuus ja saanto ovat avoimia. Suurempaa alkuperäistä täytettä ei kateta. |
| meksikolainen-chilaquiles-verdes | `VARIANT_ONLY` | Tortilla → valmis rapea tostada; salsa 150 → 16 g, queso fresco 150 g → parmesaani 20 g; salsassa pehmennys → rapea tarjoilu. | Tostadan GI-analogia ei sovi alkuperäiseen salsassa pehmennettyyn tortillaan. Etikettiversion ja salsakosketuksen vaikutukset ovat avoimia. |
| meksikolainen-huevos-divorciados | `VARIANT_ONLY` | Vihreä salsa 150 → 10 g ja tomaatti 1 kpl → 10 g punaista purkkisalsaa. Munat ja 150 g mustapapua säilyvät. | Keitetyn mustapavun GI tukee papuosuutta ehdollisesti; runsaampien alkuperäiskastikkeiden lähdesidokset puuttuvat. |
| pellava-puuro-pahkinoilla | `VARIANT_ONLY` | Vadelmat 30 g → omena 400 g; kookosjauho 20 g ja kerma 50 ml poistuvat, mantelijuoma 250 → 80 ml. | Raakaomenan GI ei selvitä alkuperäistä kuumaa pellava-kookospuuroa. Kyse on uudesta omenaversiosta. |
| idli-sambar | `NO_RELIABLE_GK` | Riisi 250 g, urad 100 g, punalinssi 200 g sekä alkuperäinen fermentointi ja höyrytys säilyvät. Tuotteiden valinta, kasvispainot ja lusikkamitat voisivat olla sallittuja täsmennyksiä, jos vastaavuus osoitetaan. | Nykyinen GI 62,45 tulee suhteesta 3:1 ja 8 h liotuksesta, kotiohje on 2,5:1 ja 4 h. Kuivapanoksen CHO:n säilymistä liotuksessa/fermentoinnissa ja kasviskoodin soveltuvuutta ei ole vahvistettu tälle rajaukselle. Pelkkä punnitus ei ratkaise näitä. |
| pohjoisafrikkalainen-bissara | `VARIANT_ONLY` | Pääraaka-aine härkäpapu → keltainen halkaistu herne; soseutus poistetaan. | Keitetyn halkaistun herneen GI 25 ei sovellu alkuperäiseen soseutettuun härkäpapukeittoon. |
| korealainen-bataatti-riisikulho | `VARIANT_ONLY` | Gochujang 150 → 2,8 g (−98,1 %); bataatti sidotaan 125 g:aan kypsää Beauregardia sekä jäähdytykseen ja uudelleenlämmitykseen. | Riisin ja bataatin valmistuskohtaiset verrokit eivät kata alkuperäistä paahdettua bataattia ja 150 g kastiketta. Pakkaus- ja lajikevastaavuus ovat avoimia. |
| kung-pao-kana | `VARIANT_ONLY` | Kypsä riisi 600 g → 200 g kuivaa nimettyä riisiä ilman osoitettua 600 g:n saantoa; maissitärkkelys 1 rkl → 4 g ja soija → tamari. | Riisin, pähkinän ja sakkaroosin osamalli koskee muutettua tarjoilua. Alkuperäisen tärkkelysosuuden sekä marinadin syödyn osuuden sidokset eivät ratkea vähennyksellä. |
| intialainen-masala-dosa | `VARIANT_ONLY` | Riisi–urad 1:1 → 3:1; lyhyt lepo → 8 h liotus ja yön hapatus; sinapinsiemen 150 → 3 g. Sambar saa uuden ohjeen. | Fermentoidun 3:1-dosan sekä erillisten täytekomponenttien GI:t eivät ole alkuperäisen taikinan näyttöä. Mahdollinen alkuperäisen sisältövirhe korjataan omana sisältöpäätöksenään. |
| jerk-kana | `VARIANT_ONLY` | Yhdessä kookosmaidossa kypsennetty riisi–papu vaihtuu erilliseen riisiin, valutettuihin papuihin ja kookoskastikkeeseen; kuivat mausteet → tuoreet, fariinisokeri → valkoinen. | Erikseen keitetyn riisin ja kokonaisen valutetun pavun GI ei vahvista alkuperäistä yhdessä kypsennettyä lisuketta. Kaiken marinadin tarjoilu on uusi rajaus. |

[Koneluettava auditointi](gk100-original-recipe-audit-2026-11-05.json)
säilyttää jokaisen aiemman `candidateSha256`-, `originalSha256`- ja
`inputSha256`-arvon. Alkuperäisen tekstin tarkiste tarkistettiin mainista.
Lähteenä käytettiin rescue-ajon jo tallennettua 15-rivistä manifestia ja
reseptikohtaisia katselmuksia commitista `e2e417560c5742217f42886fd461611053632289`.
Lähdemanifestin ja katselmusten LF-SHA:t ovat auditissa. Kyseinen paikallinen
rescue-commit ei ollut etähaarana julkaistu; auditin päätelmät ja sidokset
ovat tässä PR:ssä luettavissa ilman pääsyä rescue-työpuuhun.
Vanhoja tutkimuksia tai verkkolähdekatselmuksia ei avattu uudelleen.

## Julkaistun 236/326-luvun purku

Nyky-mainilla tuotettu `tmp/nutrition/glycemic-load-pilot.json`
vahvisti 326 tulosta, 156 laskettua alkuperäisriviä, 170 puuttuvaa
alkuperäisarviota, 56 A- ja 24 B-erillisversiota sekä 7 tutkimukseksi
merkittyä versiota. Julkaistu 236 = 156 + 56 + 24, ei alkuperäisten 236.
Kaikki 326 ID:tä ja niiden laskenta-/lähdesidokset ovat JSON-auditissa.

156 arviota on sidottu nykyisen alkuperäisreseptin laskentasopimukseen.
Tämä on nykyisen koostumus- ja valmistussidoksen tarkistus; se ei todista,
ettei reseptiä olisi muutettu aiemmin, eikä ole 156 GI-lähteen uusi
tieteellinen hyväksyntä. 80 muuta julkaistua arviota on hyväksytty erilliseen
täsmäversioon. Niitä ei voida nostaa alkuperäiskattavuuteen pelkän
ainesnimien samankaltaisuuden tai vanhan sisältöhyväksynnän perusteella.
Jäljelle jäävien 79 version olennaista erilaisuutta tai alkuperäisvastaavuutta
ei vahvisteta yhtenä joukkona: mahdollinen vastaavuuden osoittaminen on
reseptikohtainen jatkotarkistus, joka ei avaa vanhaa lähdetutkimusta uudelleen.

### Todettu tutkimusannoksen virhelaskenta: manakish

`lahi-ita-manakish-zaatarilla` on 80 erillisversion joukossa.
[Julkaistun paketin](gk100-manakish-study-release-candidate.json) valmistus
käskee tekemään tutkimusannoksia; ainesrivi on 113 g valmista M with S1
-koeleipää ja 260 ml vettä. [Aiempi katselmus](gk100-manakish-study-review.md)
erottaa sen alkuperäisestä jogurttitaikinasta. Paketin ja generoidun version
`studyServing` puuttuu. `countGkVersions` käsittelee sen siksi kotireseptin
lisäyksenä. Tämä on yksi vahvistettu periaatteen vastainen tutkimusannoksen
kattavuuslisäys, ei uuden tutkimuksen tulos.

Muut seitsemän tutkimusannosta ovat jo oikeassa erillisjoukossa: aloo paratha,
hyderabadi-kanabiryani, nasi goreng -aamiaisriisi, baozi, nasi lemak,
mehevä suklaakakku ja tangyuan. Kaikkien 87 generoidun lisäversion
ainesosat, valmistus- ja rajauskentät tarkistettiin tämän laajuuseron osalta;
muuta vastaavaa kokonaiseksi koeannokseksi kuvattua merkitsemätöntä riviä ei löytynyt.

Myös olennaisesti muuttunut resepti voi olla versiokattavuudessa:
[farinata-paketti](gk100-farinata-pan-release-candidate.json) korvaa
alkuperäisen 220 °C:n uunivalmistuksen pannulettuna ja lisää tomaatin raakana
lopuksi. Se on erillisversion arvio, ei alkuperäisen uuniruoan GK.
Tällaisten tapausten sisältöhyväksyntöjä tai laskelmia ei muuteta tässä.

### Ennen/jälkeen-suunnitelma

Taulukon jälkeen-luvut ovat ehdotetun mittarierottelun vaikutus, eivät tämän
PR:n toteuttamia tuotantomuutoksia. Laskettuja GK-lukuja ei muuteta.

| Mittari | Nyt | Ehdotettu erottelu |
| --- | ---: | ---: |
| Alkuperäiseen sidottu GK | 156/326 (47,9 %) | 156/326 (47,9 %), ensisijainen 80 %:n mittari |
| Erillisversiot alkuperäisen GK:n puuttuessa | 80 | 79; manakish siirtyy tutkimusvertailuksi |
| Ainakin yksi kotireseptin täsmäversio | 236/326 (72,4 %) | 235/326 (72,1 %), toissijainen versiomittari |
| Tutkimusvertailut, ei kotireseptilisäystä | 7 | 8 |
| Alkuperäisen GK puuttuu | 170 | 170 |
| Alkuperäisten 80 %:iin tarvittavat lisäykset | ei erotu 236-luvusta | 261 − 156 = 105 |
| Nykyisen 15 erän alkuperäiskattavuuden lisäys | vanha ennuste +15 | 0 |

80 % vaatii kokonaislukuna vähintään 261/326. Vanha 251/326-ennuste ei ole
alkuperäisreseptien ennuste. Alkuperäisten mittarissa tutkimusannokset ja
versiot eivät muuta osoittajaa eivätkä nimittäjää.

## Rajattu toteutusvaihe ja hyväksyntäportit

1. Säilytä laskelmat, julkaisupaketit, omistajapäätökset ja tarkisteet ennallaan.
   Lisää erillinen versioitu soveltuvuustietue (`ORIGINAL_RECIPE`,
   `RECIPE_VARIANT`, `STUDY_COMPARISON`), joka sitoutuu main-SHA:han,
   recipeId/versionId:hen, alkuperäiseen, ehdokkaaseen ja inputSha256:een sekä
   katselmoinnin viitteeseen. Vanhan manifestin sisältöä ei muokata.
   Reseptin olennainen muutos mitätöi uuden soveltuvuustietueen.
2. Manakish siirretään tämän tietueen avulla tutkimusvertailuksi sekä
   laskurissa, nelikielisessä otsikossa että annosskaalauksessa. Versio- ja
   tutkimusduplikaatit tarkistetaan uudelleen luokkasiirron jälkeen.
   Paketille ei lisätä `studyServing`-kenttää suoraan, koska se rikkoisi
   hyväksytyn `candidateSha256`:n; säilyttävä adapteri vaatii oman katselmoinnin.
3. `countGkVersions` ja Approval Factoryn main-vertailu/`expectedCoverageDelta`
   tuottavat erikseen alkuperäis-, versio- ja tutkimusjoukot. Valmisteluportti
   ei hyväksy variantin tai tutkimusannoksen +1:tä alkuperäisten mittariin.
   `GK_ONLY`, menetelmätaso A/B tai tekninen PASS ei korvaa soveltuvuustietuetta.
4. `GlycemicLoadPilotPage.tsx` nostaa 156/326-alkuperäismittarin pääluvuksi ja
   nimeää toissijaisen 235/326-luvun täsmäversiokattavuudeksi. Tutkimukset
   näkyvät erillisinä 8 vertailuna. Reseptikortin ja haun GK-suodattimet
   käyttävät edelleen vain alkuperäisen omaa, kelvollista arviota; variantin
   luku ei siirry korttiin, luokkaan tai alkuperäisen makrojen yhteyteen.
5. `RecipePage.tsx` näyttää puuttuvalle alkuperäiselle GK:lle pysyvän
   nelikielisen ilmoituksen myös silloin, kun erillinen versio tai tutkimus
   on saatavilla. `GlycemicLoadPilotPage.tsx` ja yhteinen GK-teksti käyttävät
   samaa viestisopimusta. Lyhyt lisäsyy voi erottaa GI-, CHO- ja syödyn osuuden
   puutteen. Puuttuva säilyy nullina; ei nollaa, luokkaa tai varmaa pistettä.
6. Kohdennetut regressiot kattavat manakishin siirron 236 → 235 ja 7 → 8,
   alkuperäismittarin 156 säilymisen, duplikaatit ja 80 %:n nimittäjän,
   muuttuneen SHA:n eston, Factoryn väärän laajuuden +1-eston, neljän kielen
   puuttumisviestin, nullin ja variantin erillään pysymisen sekä nykyiset
   GK-laskenta-, julkaisu-, poisjättö- ja suodatussuojat. Kertaluonteinen
   manifesti rakennetaan buildissä; ei uutta raskasta selain- tai ajonaikaista
   laskentaa. Vain vaikutusalueen testit ja muutosten vaatima build.

Omistajan pysyvää periaatetta ei hyväksytetä uudelleen. Tämä Draft-PR
edellyttää dokumenttien ja luokittelun katselmointia. Edellä kuvattu
käyttöliittymän, laskurin ja säilyttävän laajuusadapterin toteutus tarvitsee
erillisen toteutuspäätöksen; julkaisulle tarvitaan erillinen valtuutus.
14 variantin mahdollinen jatko tarvitsee aidon sisältöperusteen ja
reseptikohtaisen lähdesoveltuvuuden, ei GK-kattavuuden tavoittelua.
Idli-sambarin epävarmuutta ei ratkaista muuttamalla alkuperäisen suhdetta tai
liotusta koetta vastaavaksi. Tässä ei avata ylimääräistä PR:ää tai Issuea.

## Tarkistukset

GK-ajo tehtiin ensin lähtö-mainissa ja kerran uudelleen muuttuneen mainin
vuoksi erillisessä omassa työpuussa. Koko sivustobuildiä tai
uutta tutkimusta ei tarvita dokumentti- ja auditointimuutoksen tarkistamiseen.
Koneellinen auditin tarkistus (326 riviä, 15 alkuperäis- ja katselmustarkistetta,
luokat, mittarit ja linkit) sekä Markdown-lint läpäisivät. Kohdennetuista
GK-regressioista 109/110 läpäisi heti; viimeinen tarvitsi uuden työpuun
puuttuvan ravintoarvoauditin. Audit tuotettiin ja kyseinen regressio läpäisi
uusinnan. Uuden mainin kookosmaitosidoksen kohdennettu regressio läpäisi.
Tarkistustulokset ja niiden rajaus ovat myös PR:n kuvauksessa. Kaikki reseptit, laskentasyötteet,
GI-tietueet, hyväksyntämanifestit ja tuotantokoodi säilyvät muuttumattomina.

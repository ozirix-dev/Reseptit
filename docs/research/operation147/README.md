# Operaatio 147: ravintoarvo- ja GK-laskennan menetelmäauditointi

Päivä: 2.11.2026. Kohde: **ozirix-dev/Reseptit**. Lähtö-main: **`c127a715186d1d10820ae210f8cbff7d982b4444`**. Tämä aineisto ehdottaa menetelmää omistajan päätettäväksi. Se ei hyväksy, aktivoi tai laske uudelleen tuotannon arvoja.

**Keskeinen tulos:** nykyisillä lähteillä voidaan osoittaa **9 uutta mahdollisesti julkaistavaa makrokenttää neljälle reseptille**, kun riippumattomat ravintotekijät erotetaan ja jo polyolit pois sulkevaa hiilihydraattia käsitellään oikein. Kahdeksan on proteiinia/rasvaa ja yksi nettohiilihydraattia. Tämä on todennettu rajattu tulos, ei kaikkien mahdollisten lähdevastaavuuksien teoreettinen enimmäismäärä. Yhtään uutta kokonaista makropakettia tai GK-arvoa ei suositeltu yhdistelmä vapauta.

Yleinen toleranssin nosto tuottaisi tässä aineistossa vain yhden lisäpaketin laskennallisen ehdokkaan. Sen hiilihydraattiepävarmuus on suhteessa pieneen nettoarvoon merkittävä. GK-rajojen keventäminen tuottaa 2–11 lisäehdokasta, mutta ei osoita niitä turvallisiksi. Suositus on erottaa komponentit ensin ja pitää nykyiset numeeriset rajat ensimmäisessä toteutusvaiheessa.

## A. Lähtötilanne, ympäristö ja laskentaketju

### A1. Varmennettu kohdistus ja rinnakkaiset työt

Tehtävän mukana tullut Ravinto-työhakemisto ei ollut tarkoitettu kohde. Reseptit-checkoutin origin tarkistettiin, repo_guard palautti PASS ennen worktreen luontia ja uudelleen uudessa worktreessä. Oma haara on `codex/operation147-method-audit`, worktree `D:/Projects/tmp/reseptit-operation147-method-audit`. Muiden checkoutien haaroja, työpuutiedostoja tai lähderekistereitä ei muutettu. Main ladattiin täsmällisellä commit-SHA:lla ilman FETCH_HEADin tai muiden haarojen siirtämistä. Sama SHA vahvistettiin myös laskentavaiheen jälkeen.

Istuntotarkistus: **“Paranna Reseptit GK -laatua”** oli aktiivinen, sen operaatio 146 käytti omaa worktreeään. **“Audit polyol GK calculations”** ja **“Tutki vaikeita GI-lähteitä”** näkyivät erillisinä aiempina chatteina. Niiden tutkimustuloksia ei sekoitettu tämän main-snapshotin laskentaan. Aktiivisen oman istunnon metadata vahvisti malliksi `gpt-6.1-sol`, effort `high`; myös käyttäjäasetuksen oletukset olivat nämä.

Erilliset suunnitelmat luettiin vain taustaksi:

| Hanke | Tarkistettu versio | Tämän auditoinnin suhde |
| --- | --- | --- |
| [SOURCE-01 #174](https://github.com/ozirix-dev/Reseptit/pull/174) | `19939d95d8c93d6e93d4619d9f2510d043d246dc`, Draft | Määritelmä-, menetelmä-, puuttuvuus- ja lähdeversiotiedot ovat jatkotyön edellytyksiä. Raporttia tai adaptereita ei hyväksytty. |
| [Nutrition Core #176](https://github.com/ozirix-dev/Reseptit/pull/176) | `9e0bab5209e59533e6b7326a5375680024ea7083`, Draft | Komponenttikohtaiset havainnot ja julkaisuprofiilit sopivat ehdotukseen. Ei uutta tietokantaa tai API:a. |
| [Cloudflare #172](https://github.com/ozirix-dev/Reseptit/pull/172) | `69a2ca2be732e9e4454cd44cf770a601feb8fd9d`, Draft | Git säilyy nykyisenä lähteenä. Ei Cloudflare-, D1-, R2- tai siirtotoimia. |
| [Recipavo #178](https://github.com/ozirix-dev/Reseptit/pull/178) | `60a6b5c33cb4bf09e5270ab9011ecfbceda1d0e1`, Draft | Osittainen ravintotieto ja päivän kattavuus pitää säilyttää käyttökelpoisena. Tuotepäätöksiä ei tehty. |

### A2. Main ja tuotanto erikseen

Tuotannon kaikki **326 FI-reseptin** julkiset `page-content`-metatiedot luettiin yhdellä HTTP-kierroksella. Jokaisen vastauksen URL ja SHA-256 ovat [production.json](production.json). Tarkistus valmistui **2.11.2026 klo 09.44.20 Suomen aikaa**. Yhtään neljän makrokentän eroa mainiin ei löytynyt. Julkinen [GK-sivu](https://ozirix-dev.github.io/Reseptit/glykeeminen-kuorma/) ilmoitti erikseen 326/147/179. Reseptin hydration-payloadissa ei ole GK-kenttää, joten puuttuvasta payload-kentästä ei päätelty puuttuvaa julkista GK:ta.

| Mittari | Mainin laskenta | Tuotannon havainto |
| --- | ---: | ---: |
| Julkaistut reseptit | 326 | 326 |
| Kaikki neljä makroa näkyvissä | 259 (79,45 %) | 259 |
| Kaikki neljä puuttuvat | 67 | 67 |
| Näkyvät makrokentät | 1 036 / 1 304 | 1 036 |
| Nykyisen tarkistimen `ESTIMATE WITH EVIDENCE` | 204 | Julkinen numero ei yksin todista näyttötilaa |
| Näkyvä legacy-paketti ilman nykyistä laskentatiedostoa | 55, yhteensä 220 kenttää | Näkyvät samoin |
| Nykyinen makrolaskentatiedosto | 212 | Ei päätellä julkisesta HTML:stä |
| GK-luku | 147 (45,09 %) | 147 |
| Ilman kokonais-GK:ta | 179 | 179 |

Makroauditoinnin tilat ovat **204 ESTIMATE WITH EVIDENCE, 63 INSUFFICIENT SOURCE DATA, 59 MISSING, 0 CONFLICT**. Näistä 63:sta 55 on näkyvää legacy-tietoa ilman nykyistä näyttöä ja kahdeksan tarkoituksellisesti pidätettyjä paketteja. Laskentatiedostoa ei ole 114 reseptillä: 55 legacy + 59 ilman arvoja. **Laskentatiedoston puuttuminen ei todista, että ravintotietokannasta puuttuisi raaka-aine.** Näiden reseptien kaikkien vaihtoehtoisten lähdevastaavuuksien julkaisukelpoisuus on UNKNOWN.

Tilan nimi kertoo nykyisen ohjelmallisen hyväksynnän, ei laboratoriomittausta tai tämän auditoinnin vahvistamaa jokaisen lähdetulkinnan virheettömyyttä. Erityisesti AFCD:n polyolijoukon rajaus vaatii erillisen tarkastelun (D).

### A3. Nykyinen ketju

1. Reseptien FI-frontmatter antaa annokset, ainekset, määrät, yksiköt ja neljä näyttökenttää. Käännöksissä arvot vastaavat FI-lähdettä.
2. [nutrition-model.ts](../../../site/scripts/nutrition-model.ts) tarkistaa lähteen, ruokatilan, syötävän osuuden, muunnoksen ja säilyneen osuuden. Se käyttää desimaalilähtöistä rationaaliaritmetiikkaa ja pyöristää annosarvot kahteen desimaaliin.
3. Moottori summaa komponentteja erikseen, mutta reseptin status vaatii proteiinin, rasvan, saatavan hiilihydraatin, kuidun, polyolit, neton, kokonais-CHO:n ja kaikki poisjättörajat. Energia ja sokerit ovat jo valinnaisia.
4. [nutrition-evidence.ts](../../../site/scripts/nutrition-evidence.ts) tarkistaa reseptisidoksen ja täsmällisen neljän kentän yhtäsuuruuden. `WITHHELD_SOURCE_INCOMPLETE` pidättää kaikki neljä. Kahdella vedetyllä paketilla on oma muuttumattoman historiallisen näytön tunniste. Kolmella reseptillä on suljettu erityismenettely: uunikanapasta ja kaksi scoped-polyol-reseptiä.
5. Batch-jäsenyys tarkistetaan [nutrition-audit.ts](../../../site/scripts/nutrition-audit.ts)-tasolla. Batch-builder kirjoittaa lähteistetyt laskelmat ja koko paketin. Sen rajat eivät ole ravintoainekohtainen hyväksyntä.
6. GK käyttää erillistä [glycemic-load-model.ts](../../../site/scripts/glycemic-load-model.ts)-ketjua: Σ GI × saatava CHO / 100. Pilotin rakenne-, input- ja lähdehashit sekä GK80:n tarkoin rajatut release/recovery-menettelyt sovelletaan ennen kokonaisarvon näyttämistä. Tämän vuoksi hyvä GK-kattavuus ja makrokattavuus eivät ole sama asia.
7. Julkinen React/HTML ja JSON-LD poimivat jo ei-null-kenttiä yksitellen. Varsinainen pakottava neljän arvon portti on toimituksellisessa hyväksynnässä ja kirjoitusketjussa, ei frontmatterin numero/null-tyypissä.

## B. Tarpeettomat ja ehdollisesti tarpeettomat estot

| Havainto | Näyttö | Luonne ja ehdotettu korjaus |
| --- | --- | --- |
| Tuntematon polyoli estää proteiinin ja rasvan julkaisun | Neljän pidätetyn reseptin nykyinen laskelma antaa molemmat arvot ilman riveihin kohdistuvaa määrä-/lähdevirhettä | Rakenteellinen kytkentä. Hyväksy riippumaton komponentti omalla näyttöketjullaan. |
| Polyolit jo pois sulkeva saatava CHO ei kelpaa netoksi ilman P-kenttää | `normalizeCarbohydrate` palauttaa ensin `net: null`, jos P ei ole todennettu, ennen EU_AVAILABLE-haaraa | Poista P-riippuvuus vain lähdekohtaisesti osoitetulta määritelmältä. Älä muuta kokonais-CHO:ta tai P:tä tunnetuksi. |
| Paketin kaikkien toleranssien on läpäistävä myös silloin, kun halutaan vain yksi kenttä | `omissionWithinTolerance` on yhteinen boolean | Jatkossa raja ja epävarmuus ovat komponenttikohtaisia. Proteiinilukema ei tarvitse hiilihydraatin puuttuvan osan kattoa, jos proteiinin oma katto tunnetaan. Tässä S1 säilyttää varovaisesti vanhan yhteisen rajan. |
| Koko tekstin sidos reagoi kuvaan ja toimitukselliseen tekstiin | 14 `exactRecipeText`-sidosta; muistissa tehdyt hash-kokeet | Rajattu tekninen parannus on mahdollinen vasta semanttisen vastaavuuden tarkistuksen ja uuden hyväksyntämallin jälkeen. Vanhaa hashia ei ohiteta. |
| Täsmällinen näyttöarvon yhtäsuuruus voi sekoittaa näyttö- ja laskentatarkkuuden | S4:n nykyisissä laskelmissa ei kuitenkaan yhtään pelkällä näyttötarkkuudella selittyvää estoa | Suunnittelukysymys, ei osoitettu kattavuusvoitto tässä snapshotissa. |

Yleistä yksilöllisen punnituksen pakkoa ei löytynyt: moottori hyväksyy jo `gramsPerUnit + conversionEvidence`. Lähteistettyä muunnosta ei tarvitse korvata uudella punnituksella. Pelkän tietueen nimen perusteella valittu muunnos ei silti ole lähdevastaavuus.

## C. Turvallisuutta ja laatua suojaavat portit

Säilytä ruoka-/tuoteidentiteetin, raaka/kypsä/kuiva/valutettu-tilan, määrän, syötävän osuuden, annosmäärän ja lähteen määritelmän tarkistukset. Sama koskee lähde- ja reseptiversion sidoksia, käännösten numeerista yhtäpitävyyttä, negatiivisten/ristiriitaisten arvojen estoja ja poisjättöjen yhteisbudjettia.

GI:n ruokaperhe-, valmistus- ja source-use-esto on tarkoituksellinen. Mantelijauhosta ei tule testattu leipomotuote leipomalla, riisi ei ole riisiviinietikka eikä maitotuote maitosuklaa. Merkittävä osuus ilman kelvollista GI:tä on oikea tietoaukko. LOW tarkoittaa mallin tai analogian heikkoutta, ei puuttuvan merkittävän GI:n täyttölupaa.

Suljettuja omistajan hyväksymiä poikkeuksia ei yleistä tämä auditointi. `keto-mutakakku` ja `keto-suklaakeksit` säilyvät pidätettyinä. Niiden historiallisista riveistä ei palauteta irrallisia hyväksyntöjä. Myöskään 55 legacy-pakettia ei nosteta hyväksytyksi sillä perusteella, että numero on jo tuotannossa.

## D. Polyolien erityisauditointi

### D1. Määritelmät määräävät riippuvuuden

| Lähde/määritelmä | Mitä tunnetusta C:stä voi päätellä? | Mitä tuntematon P estää? |
| --- | --- | --- |
| Fineli CHOAVL | THL määrittelee sen tärkkelyksen ja sokereiden summaksi. Nykyisessä normalisoinnissa jo ilman polyoleja. | Ei itsenäistä CHOAVL-lukua tai P/F:ää. Estää projektin A + kuitu + P -kokonaisuuden, jos P muuten puuttuu. |
| EU-pakkausmerkinnän carbohydrate | Sisältää polyolit, kuitu on eri asia. | Polyolit pois sulkevan neton, ellei P tai soveltuva raja tunneta. P/F pysyvät itsenäisinä. |
| AU/NZ määritelty available carbohydrate | Tarkka määritelmä ja menetelmä tarkistetaan. Nimetyn San Remo -tapauksen C72 on jo ilman kuitua/polyoleja. | Ei toista P-vähennystä. P:n puuttuminen estää muun tarvittavan summan, ei tätä A-havaintoa. |
| USDA total carbohydrate by difference | Sisältää kuidun. Eri fraktioiden erillismittaukset eivät välttämättä summaudu täsmälleen samaan lukuun. | A/netto tarvitsee oikean määritelmän ja tarvittavat fraktiot. `UNKNOWN`-tietueen total-arvoa ei vaihdeta saatavaksi nimikkeen perusteella. |
| AFCD without / with sugar alcohols | Ilman-kenttä ja kanssa-kenttä säilytetään eri havaintoina. Niiden erotus ei osoita kaikkien polyolien summaa. | P-kattavuus ja kokonais-CHO vaativat oman menetelmän. Neton jo pois sulkevaa lähdekenttää ei vähennetä toistamiseen. |

Ensisijaiset määritelmälähteet: [THL:n Fineli-ohje, CHOAVL](https://fineli.fi/fineli/content/file/8), [EU 1169/2011, liite I kohta 7](https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX%3A32011R1169), [AU Schedule 11](https://www.legislation.gov.au/F2015L00481/2024-10-29/2024-10-29/text/original/epub/OEBPS/document_1/document_1.html) sekä [USDA:n menetelmäkuvaus](https://fdc.nal.usda.gov/Foundation_Foods_Documentation/). AU-tuotteen jo mainiin hyväksytty tulkinta ja rajaukset ovat [operaatio 145:n lähdemuistiossa](../../nutrition/gk80-carnitas-couscous/operation145/source-definition.json).

### D2. AFCD:n parikenttien laatuhavainto

Virallinen [AFCD Release 3 Nutrient details](https://www.foodstandards.gov.au/sites/default/files/2025-12/AFCD%20Release%203%20-%20Nutrient%20details.xlsx), `Proximates!G38:G39`, osoittaa yhtälöiden eroksi **sorbitolin, mannitolin ja glyserolin**. Samalla sheetillä on erillisiä muita polyolilajeja. Erotusta ei pidä nimetä yleiseksi mitatuksi kokonaispolyoliksi. Myös tietueen oma johdantamenetelmä ja mahdollinen label-poikkeus on tarkistettava. [Paikantimet ja lähdehashit](afcd-definition-extract.json) säilyttävät tarkistetun havainnon.

Nykyinen `nutrition-batch-builder.ts` laskee erotuksen ja asettaa `polyolsSourceVerified: true`. Laskentatiedostojen lähde-URL:iin ja `paired`-perusteeseen rajattu haku löytää **172 reseptiä: 170 nykyisen tarkistimen hyväksymää ja kaksi vedettyä**. Tämä on **tulkinnan tarkastusjoukko**, ei väite 170 väärästä ravintoarvosta. Puuttuvan muun polyolijoukon todellista vaikutusta ei osoitettu kaikille näille ruoille. S0:n 204 on siksi ohjelmallinen baseline, ei uusi semanttinen kaikkien lähteiden sertifiointi.

FSANZ kertoo lisäksi, että puuttuva ravintotekijä ei tarkoita poissaoloa ja alle määritysrajan havaintoja voidaan esittää nollina. Lähteen nolla ei siis aina tarkoita mitattua täsmällistä nollaa. Katso [AFCD:n taustakuvaus, s. 1 ja 3](https://www.foodstandards.gov.au/sites/default/files/2025-12/About%20the%20Australian%20Food%20Composition%20Database%20-%20Release%203.pdf). Näistä ei tehdä tämän ajon resepti- tai lähderekisterikorjauksia.

### D3. Toimeksiannon A–F-tapausten ratkaisu

**A:** EU-CHO:n tai USDA-totalin P:n puuttuminen voi aidosti estää polyolit pois sulkevan neton. **B:** Fineli/AU saatava C voi silti olla tunnettu, vaikka A + kuitu + P ei ole. **C:** couscousin neton P-portti on tällainen osoitettu turha riippuvuus. **D:** neljän reseptin P/F-kytkentä on turha. **E:** polyolimakeutetut tuotteet sekä vedetyt keto-leivonnaiset tarvitsevat laji-, määrä- ja määritelmänäytön. **F:** tavallisen ruoan pieni osuus ei ole merkityksetön ennen osoitettua kattoa. Rogan joshin poistettavat mausteet ja sitruunakanan useat pienet osuudet jäävät tarkasteltaviksi.

Koko aineistosta ei voi päätellä luonnollisten polyolien yleistä nollaa. Eksplisiittinen lähdearvo, johdettu osasumma, looginen nolla, alle määritysrajan arvo ja blank säilytetään eri asioina. Polyolin mahdollinen fysiologinen vaikutus on myös eri kysymys kuin lähteen A-kentän laskentamääritelmä.

## E. Ravintotekijäkohtainen julkaisu ja vaikutukset

S1 käyttää vain nykyisiä laskentatiedostoja, niiden nykyisiä sidoksia ja vanhoja toleransseja. Se ei hae korvaavaa ruokaa, tulkitse `UNKNOWN`-hiilihydraattia uudelleen tai vapauta peruttua näyttöä.

| Resepti | Proteiini g/annos | Rasva g/annos | S6:n muu uusi kenttä | Edelleen pidätetty |
| --- | ---: | ---: | --- | --- |
| janssoninkiusaus-juuriselleri | 13,57 | 33,56 | – | Netto ja kokonais-CHO |
| marokkolainen-couscous | 47,07 | 17,88 | Netto 67,11 g | Kokonais-CHO |
| paprikainen-vhh-gulassi | 40,79 | 26,14 | – | Netto ja kokonais-CHO |
| pasta-alla-norma | 15,70 | 15,53 | – | Netto ja kokonais-CHO |

Nämä ovat nykyisellä lähde-/annosmallilla saatuja arvioita. Couscousissa vanha poisjättökatto on 0,664 g hiilihydraattia, 0,1751 g proteiinia ja 0,208325 g rasvaa annosta kohti. Pelkkä komponentin laskettavuus ei tarkoita biologisen epävarmuuden katoamista. Kaikki yhdeksän tarvitsevat uuden komponenttikohtaisen hyväksynnän.

Ehdotettu tietosopimus komponentille: `componentId`, `definitionVersion`, `value | interval | null`, `unit`, `basis`, `status`, `missingReason`, `sourceObservationRefs`, `calculationVersion`, `inputHash`, `approvalRef`, `omissionBudget`, `displayPrecision`. Toimeksiannon VERIFIED/ESTIMATED/ESTIMATED_WITH_BOUNDED_UNCERTAINTY/MISSING/WITHHELD/CONFLICT ovat **työehdotuksia**, eivät lisättyjä tilakoodeja. `VERIFIED` ei saa tarkoittaa laboratoriomittausta automaattisen laskennan perusteella.

Vaikutukset toteutukseen:

- **Moottori:** yhteiset identiteetti-/määrävirheet erikseen komponentin omista riippuvuusvirheistä. Tunnettu proteiini ei tarvitse P:tä. Johdetulla kentällä on nimetty riippuvuusverkko.
- **Resepti ja batch:** frontmatter sallii jo erilliset nullit; hyväksyntä, batch-builder ja pidätyssopimus muutetaan kenttäkohtaisiksi. Suljetut withdrawal/recovery-polut tarvitsevat yhteensopivuuskäsittelyn. Pelkkä status-stringin vaihtaminen ei riitä.
- **FI/EN/SV/TH:** sama numeerinen arvo, määritelmä ja hyväksyntätila kaikille olemassa oleville kieliversioille. Käännöstekstit eivät saa luvata täydellistä profiilia. TH:n terminologia tarkistetaan ennen käyttöönottoa. Tämän auditoinnin 9 tarkoittaa kanonisia kenttiä, ei kielikopioita.
- **HTML:** nykyinen `RecipePage.tsx` suodattaa nullit jo yksitellen. Tarvitaan osittaisen profiilin ja kentän laadun sanasto, ei uutta kokonaan erillistä näkymää.
- **JSON-LD:** nykyinen `schema.ts` jättää nullit pois. Vain julkaistut standardiin sopivat kentät viedään. Projektin kokonais-CHO:n määritelmä ja Schema.orgin odotus tarkistetaan erikseen ennen laajennusta. Netolle ei keksitä standardiominaisuutta, energiaa ei johdeta puutteellisista makroista.
- **Nutrition Core:** havainto, normalisointi, laskentatulos ja Recipavon julkaisupäätös erotetaan PR #176:n ehdotuksen tavoin. Core ei päätä sovelluksen keto-luokkaa.
- **Päiväkirja:** summaa kukin komponentti vain tunnetuista syödyistä annoksista. Näytä esim. ”proteiini 62 g, tieto 3/4 aterialta”. Tuntematon neljäs ateria ei ole nolla. Rajatun puutteen summa on osasumma/väli ja puutteen kattavuus kulkee mukana; GK:ta ei muuteta automaattisesti additiiviseksi päiväarvoksi.

## F. Pienten ainesten toleranssit

Nykyinen makrobudjetti on enintään 1 g kullekin neljälle makrolle ja 10 kcal energialle. Yksittäisen alle rajan jääminen ei riitä, vaan summat tarkistetaan. S3:n kohdennettu prototyyppi käsittelee jo dokumentoidun sitruunakanan neljää pientä ainetta muuttamatta määriä: timjami 2 g, valkosipulijauhe 3,1 g, mustapippuri 0,5 g ja sitruunankuori 2 g / 4 annosta.

| Rajattu poisjätön vaikutus / annos | Lähdemallin katto |
| --- | ---: |
| Nettohiilihydraatti | 1,043295 g |
| Kokonais-CHO | 1,043295 g |
| Proteiini | 0,194300 g |
| Rasva | 0,0483825 g |
| Energia | 8,90375 kcal |

CHO-katto käyttää jo repossa olevien USDA-tietueiden total-CHO:ta ilman kuitu-/polyolivähennyksiä. P/F käyttävät samojen tietueiden havaintoja. Valkosipulijauheen puuttuvan energiakentän varovainen katto on koko massa × 9 kcal/g. Raaka lemon peel on jo aiemmin käytetty kuoriraasteen proxy: sen vastaavuus on rajaus, ei osoitettu saman erän mittaus. **Nämä ovat ehdollisia lähdekoostumuksen laskentakattoja, eivät biologisia tai kaikkien tuote-erien maksimeja.**

| Vaihtoehto | Uudet pakettiehdokkaat | Uudet kentät | Tulos |
| --- | ---: | ---: | --- |
| 1 g | 0 | 0 | CHO-katto ylittää rajan |
| 1,5 g | 1 | 4 | Sitruunakana, REVIEW REQUIRED |
| 2 g | 1 | 4 | Sama resepti, ei lisähyötyä 1,5 g:aan |
| Komponenttikohtainen absoluuttinen + suhteellinen | 0 | 0 | Koekatto `min(absCap, max(0,1 g, 5 % tunnetusta osasta))`; absCap CHO 1,5 g, P/F 1 g; energia 10 kcal |

Sitruunakanan tunnetun osan netto on 2,1800 g ja lähdemallin väli 2,1800–3,223295 g. Puuttuvan osan katto on **47,9 %** tunnetusta netosta. Kokonais-CHO 3,8875–4,930795 g, P 36,67250–36,86680 g ja F 16,56250–16,6108825 g. Pelkkä ”noin 2,2 g nettoa” peittäisi merkittävän epävarmuuden. Siksi yleistä 1,5 g:n kevennystä ei suositella S6:een.

Kuivamauste ei ole sama asia kuin tuore yrtti tai kuori: koostumus ja mitan hajonta poikkeavat. Poistettavan kokonaisen mausteen syöty/extraktoitunut osuus on eri muuttuja. Sokeria, öljyä, merkittävää proteiinilähdettä tai polyolimakeutettua tuotetta ei merkitä pieneksi mausteeksi. Rogan joshin valmistushävikkiä ei ratkaistu keksityllä kertoimella. Muille resepteille ei siirretty sitruunakanan kattoja.

Keto/VHH ovat nykyisin toimituksellisia luokkia ilman yleistä numeerista rajaa tässä skeemassa. Yhtään luokitusta ei muutettu. Jos jatkossa käytetään numeerista netto-CHO-rajaa T, koko hyväksyttävän välin on täytettävä päätetty sääntö. Sitruunakanan väli leikkaa jokaisen rajan T välillä 2,18–3,223295 g; silloin luokka on REVIEW REQUIRED. Pelkällä suhteellisella toleranssilla ei ohiteta absoluuttista kattoa.

## G. Pyöristys, näyttö ja olennaisuus

Nykyinen yleismoottori käyttää tarkkaa desimaalilähtöistä rationaaliaritmetiikkaa, lopputuloksissa kaksi desimaalia ja joissakin normalisoinneissa kuutta. Laskennan tarkkuutta ei pidä huonontaa. Riippumaton Decimal-tarkistus teki **828 kenttävertailua, myös puuttuvat arvot**, 207 tavallisesta laskentatiedostosta. Kolme suljettua erityismallia jätettiin niiden omien tarkistimien vastuulle ja kaksi vedettyä pakettia käsittelemättä. Vertailukelpoisissa nykyisissä näyttöarvoissa ei löytynyt ristiriitaa.

7,38 ja 7,39 näyttäisivät molemmat yhdellä desimaalilla 7,4. Se ei todista samaa laskelmaa, samaa lähtöarvoa tai hyväksyttävää virhettä. 1,04/1,05 tai 0,04/0,05 taas osuvat näyttörajan eri puolille. Näyttöyhtäläisyys ei yksin kelpaa hyväksynnäksi. **S4 vapauttaa tässä snapshotissa 0 kenttää**. Puuttuvaan näyttöaineistoon ei päätellä pyöristysvirhettä.

Ehdotetut erilliset tasot:

| Taso | Ehdotus |
| --- | --- |
| Sisäinen laskenta | Säilytä tarkat desimaalit/rationaalit ja laskentaversio; pyöristä vasta nimetyssä vaiheessa. |
| Lähdearvon tarkkuus | Säilytä alkuperäinen teksti, yksikkö, desimaalit, menetelmä ja `<`/trace/nolla. Ilmoitettu desimaali ei yksin määritä koko biologista epävarmuutta. |
| Julkinen makronäyttö | Tavallisesti 0,1 g; positiivinen alle 0,1 g mieluummin ”<0,1 g” kuin 0. Laajat epävarmuudet välinä/erillisenä laatutietona. Toimituksellinen päätös, ei toteutettu. |
| Hyväksyntä | Kanonisen tarkasti lasketun arvon yhtäpitävyys tai erikseen lähteistetyn välin vakaus. Sama yhden desimaalin näyttö ei korvaa hyväksyntää. |
| Muutoksen olennaisuus | Erota esitysmuutos, numeerinen muutos, riippuvuuksien muutos ja luokkarajan ylitys. Raja-arvon lähellä pieni muutos voi olla olennainen. |

Lisähavainto: GK:n yleinen `classifyGlycemicLoad` käyttää kokonaisluvuksi pyöristettyä arvoa, mutta julkisen `RecipePage`-luokan rajat ovat suoraan ≤10 / <20. Näyttö on tavalliselle arviolle yksi merkitsevä numero ja mallinnetulle arviolle kokonaisluku tai `<1`. Nämä on yhtenäistettävä erillisellä päätöksellä, ei korjattava muuttamalla ravintoarvoja. Herkkyystiedosto näyttää sekä core- että julkisen luokan, joten ne eivät sekoitu.

## H. Yksikkömuunnokset ja valmistus

Moottori hyväksyy gramman/kilon suoraan sekä muun yksikön vain ainekohtaisen `gramsPerUnit`-arvon ja `conversionEvidence`-perusteen avulla. Nykyisten tarkistettavien laskentatiedostojen riveissä on **0 puuttuvan yksikkömuunnoksen estoa**. Reseptien määrissä on silti 1 246 ei-g/kg- tai puuttuvan määrän riviä 301 reseptillä. Niistä moni on jo ratkaistu tai tarkoituksellisesti rajattu pois. Määrää ei pidä tulkita uusiksi muunnostarpeiksi.

Fineli-referenssissä 3 247 ruoalla on annos-/tilavuusmassatietoja. Näiden olemassaolo ei ole reseptin aineen ja tilan hyväksytty match. S5 ei löydä nykyisistä kokonaisista laskentapaketeista tapausta, jonka vain puuttuva jo todettu muunnos vapauttaisi: **0 osoitettua uutta kenttää**. Ilman makroinputtia olevien 114 reseptin mahdollinen lisähyöty on UNKNOWN, kunnes mapitus, määrät ja valmistusscope on rakennettu. Luku 0 ei tarkoita, että Finelin mitat olisivat hyödyttömiä.

| Aine/tilanne | Kelvollinen tapa | Rajaus |
| --- | --- | --- |
| Vesi | Ravintotekijöiltään nollan puhdas vesi voidaan käsitellä dokumentoidusti ilman ravintomassan arvailua. | Keittoliemi ei ole vesi. |
| Käyttövalmis liemi, maito | Täsmällisen valmiin tuotteen tiheys tai ainekohtainen annosmassa. | Konsentraatti/kuutio ja valmis liemi eri perusteita. |
| Öljy | Ainekohtainen lähteistetty massa/tilavuus. | 1 ml ei yleisesti ole 1 g. Syöty määrä erikseen. |
| Jauhot, riisi | Sama aine, kosteus-/kuiva-/kypsätila ja mittaustapa. | Desilitran jauhomassa tai kuivan riisin tilavuus ei ole kypsän tuotteen massa. |
| Lusikka, kappale | Lähteen mitan koko ja aineen tila/osan syötävyys kuvataan. | ”kpl” ilman kokoluokkaa ei oikeuta valitsemaan tarkoitukseen sopivaa keskikokoa hiljaisesti. |
| Haihtuva vesi | Koko erän ravintotekijöiden summa ei muutu pelkän veden haihtuessa. | Kypsän ruoan per 100 g / päiväkirjagrammat tarvitsevat erän todetun saannon. |
| Valutettu neste | Valutettu paino ja siihen sopiva koostumus tai dokumentoitu erottelu. | Tölkin kokonaispainoa ei kerrota valutetun aineen koostumuksella. |
| Paistorasva, marinadi | Kaikki kulutettu kastike voidaan kuvata perustelluksi arvioksi. Pois jäävä osa tarvitsee määrän/välin ja perusteen. | Ei kaikille ruoille yhteistä imeytymis- tai hävikkikerrointa. |
| Poistettava kokonainen mauste | Mahdollinen 0–koko alkumassan lähdekoostumuksen herkkyysväli. | Ei ole sama kuin nollaravinto tai todettu uuttumisprosentti. |

## I. Versiosidokset ja evidenssihashit

[diagnostics.json](diagnostics.json) sisältää 11 muistissa tehtyä muutoskoetta; reseptitiedostoihin ei kirjoitettu.

| Muutos | Makro-input-hash | GK-rakennehash | Koko tekstin hash |
| --- | --- | --- | --- |
| Otsikko, kuva, muotoilu, toimituksellinen prose | Säilyy | Säilyy | Muuttuu |
| Valmistuksen vapaa prose | Säilyy | Säilyy | Muuttuu |
| `cooking_method` | Säilyy | Muuttuu | Muuttuu |
| Aineen nimi, määrä tai annosmäärä | Muuttuu | Muuttuu | Muuttuu |
| Ainesosan toimituksellinen note | Muuttuu | Voi säilyä | Muuttuu |
| Noteen lisätty tunnistettu valmistustila, esim. valutettu | Muuttuu | Muuttuu | Muuttuu |

Makrojen input-hash **on jo erillinen koko toimituksellisesta sisällöstä**. Siksi kaikkia tekstikorjauksia ei pidä esittää nykyiseksi yleiseksi estoksi. Samalla tavallinen makrohash ei sisällä valmistustapaa, ja GK-rakennehashkin ohittaa vapaan valmistusproosan. Tämä on myös mahdollinen liian heikon invalidoinnin riski. Suljettujen uudempien pakettien tarkka teksti on perusteltu kompensaatio, kun valmistuksen semanttista vaikutusta ei ole rakenteistettu.

GK:n source-evidence-hash seuraa laskentaan liittyviä CHO-/tila-/GI-tietoja, ei kaikkia P/F-kenttiä. Se on oikein GK:n riippumattomuuden kannalta. Lähdetietueen muuttuminen ei ole toimituksellinen muutos. Laskentaversio, normalisointisääntö ja todelliset havaintoriippuvuudet kuuluvat jatkossa sidokseen.

Ehdotus: toimituksellinen sisältöhash, laskennallinen input-hash ja hyväksynnän riippuvuushash erikseen. Säilytä vanha laskenta vain, kun annokset, identiteetit, määrät, syötävät/säilyvät osuudet, valmistuksen merkitys, lähdehavaintojen versiot ja algoritmi ovat osoitetusti samat. Pelkkää saman näyttöarvon tai samannimisen ruoan testiä ei hyväksytä. Tämän ajon hashien merkityksiä tai hyväksyttyjä tunnisteita ei muutettu.

## J. Kaikkien 326 reseptin skenaariot

Koneelliset yksilörivit: [recipe-scenarios.json](recipe-scenarios.json) ja [CSV](recipe-scenarios.csv). Tiivistelmä: [summary.json](summary.json) ja [scenario-summary.csv](scenario-summary.csv). Jokainen skenaario sisältää samat 326 ID:tä, vanhat arvot, uudet mahdolliset kentät, puuttuvat kentät, paketin tilanteen ja UNKNOWN/REVIEW REQUIRED -rajaukset. S3 on kohdennettu tutkittavan puutteen laskenta; muihin puuttuviin inputteihin ei generoida kuvitteellisia laskelmia.

| Skenaario | Uudet reseptit, joilla edes yksi kenttä | Uudet kentät (netto / total / P / F) | Palautettavat pakettiehdokkaat | Edelleen puuttuvat kentät | GK / muutos / luokkamuutokset |
| --- | ---: | --- | ---: | ---: | --- |
| S0 nykyinen | 0 | 0 | 0 | 268 | 147 / 0 / 0 |
| S1 kenttäkohtainen, muuten vanha menetelmä | 4 | 8 (0 / 0 / 4 / 4) | 0 | 260 | 147 / 0 / 0 |
| S2 riippumaton polyolitieto, atominen julkaisu säilyy | 0 | 0 | 0 | 268 | 147 / 0 / 0 |
| S3 1 g | 0 | 0 | 0 | 268 | 147 / 0 / 0 |
| S3 1,5 g | 1 | 4 (1 / 1 / 1 / 1) | 1, REVIEW REQUIRED | 264 | 147 / 0 / 0 |
| S3 2 g | 1 | 4 (1 / 1 / 1 / 1) | 1, REVIEW REQUIRED | 264 | 147 / 0 / 0 |
| S3 absoluuttinen + suhteellinen koekatto | 0 | 0 | 0 | 268 | 147 / 0 / 0 |
| S4 näyttö- ja hyväksyntätarkkuus | 0 | 0 | 0 | 268 | 147 / 0 / 0 |
| S5 jo saatavilla olevat todetut muunnokset | 0 | 0 | 0 | 268 | 147 / 0 / 0 |
| **S6 suositeltu S1 + S2, vanhat toleranssit** | **4** | **9 (1 / 0 / 4 / 4)** | **0** | **259** | **147 / 0 / 0** |

S2 paljastaa itsenäisesti yhden uuden laskettavan neton (couscous), mutta ei yksin pura paketin atomista julkaisua. S6 laskettiin uudelleen resepti-ID:n ja kentän tasolla S1:n sekä S2:n ehdoilla; skenaarioiden rivimääriä ei summattu. S6 säilyttää kuuden puutteellisen nykyisen laskelman koko paketin pidätyksen sekä kaksi withdrawal-pakettia. Koko paketti puuttuu edelleen 67 reseptiltä, vaikka neljälle niistä saisi osan kentistä näkyviin.

**Olennaiset ristiriidat ja epävarmuus:** nykyisten vertailukelpoisten makroarvojen numeerisia ristiriitoja 0; tuotannon/mainin neljän kentän eroja 0. Tämä ei poista 55 legacy-paketin näyttöpuutetta eikä AFCD-joukon tulkintariskiä. S3:n nimetty lähdemallin väli on F-luvussa. S1/S6 säilyttävät nykyiset dokumentoidut poisjättökatot. Kaikille lähde-erille tai biologiselle vaihtelulle ei ole osoitettua numeerista ylärajaa. UNKNOWN ei muutu PASSiksi.

### J1. Mistä puuttuvat 268 kenttää johtuvat?

| Lähtöryhmä | Reseptit / puuttuvat kentät | Mitä voidaan todeta? |
| --- | --- | --- |
| Julkaistu, mutta ei makroinputtia eikä arvoja | 59 / 236 | Nykyinen evidenssiketju puuttuu. Lähde-, määrä-, sisältö- ja menetelmäsyiden täydellinen jako UNKNOWN. |
| Neljä osittain laskettavaa pidätystä | 4 / 16 | 8 P/F-kenttää estyy yhteisestä portista. Yksi netto lisäksi vapautuu lähdemääritelmän riippumattomuudella. Muut 7 jäävät puuttumaan. |
| Sitruunakana ja rogan josh | 2 / 8 | Todettu pieniainesten/valmistuksen epävarmuus ja lähdepuitteet. Vain yksi ehdollinen S3-paketti osoitettu. |
| Kaksi withdrawn-pakettia | 2 / 8 | Historiallinen polyolinäyttö ei kelpaa palautukseen. Erillinen lähde-/hyväksyntätyö. |

Todettu osuus sääntö- ja rakenne-esteistä on **9/268 = 3,36 % nykyisin puuttuvista kentistä** suositellussa rajatussa mallissa. Se ei tarkoita, että loput 96,64 % olisivat todistettuja puuttuvia ravintotietokantahavaintoja. Luotettavaa tällaista prosenttijakoa ei voi tehdä puuttuvan laskentainputin 59 reseptille. Lisäksi 220 jo näkyvän legacy-kentän evidenssivelka on oma mittarinsa.

Toimenpideluokat: 204 nykyisen tarkistimen hyväksymää pakettia voidaan toistaa automaattisesti nykyisellä menetelmällä; neljä reseptiä hyötyy osoitetusti menetelmämuutoksesta; kaksi withdrawn-tapausta tarvitsevat lähde-/näyttötäydennyksen; sitruunakanan toleranssi ja rogan joshin valmistus tarvitsevat omistajan sisältö-/menetelmäpäätöksen; 59 kokonaan dokumentoimatonta puuttuvaa pakettia ja 55 legacy-pakettia vaativat ensin inputin/menetelmän rekonstruoinnin. Ryhmiä ei tulkita lähteiden puutteiden lopulliseksi syyjaoksi.

## K. GK-rajojen ja lähdearvojen herkkyys

Erillinen scratch-kopio vaihtoi vain yleismoottorin kaksi rajavakiota. Ruokaperhe-/valmistus-/REFERENCE_ONLY-estot, lähteet, inputit, sidokset ja nykyiset suljetut release-rajaukset säilyivät. Uudet ehdokkaat **eivät peri hyväksyntää**. Makrojen S0–S6 eivät muuta GK-rajoja.

| Yksittäinen osuus alle | Yhteensä alle / annos | Laskennalliset GK-ehdokkaat | Lisäys 147:ään |
| --- | --- | ---: | ---: |
| 1 g | 2 g | 147 | 0 |
| 1,5 g | 2 g | 152 | 5 |
| 2 g | 2 g | 152 | 5 |
| 1 g | 3 g | 149 | 2 |
| 1,5 g | 3 g | 154 | 7 |
| 2 g | 4 g | 158 | 11 |

Rajat ovat aidosti **alle**, eivät enintään. Vertailu ei muuta nykyisen makrotoleranssin enintään-merkitystä. Kaikki yksilöt ja mahdolliset näyttö-/luokkaherkkyydet ovat [gk-threshold-sensitivity.json](gk-threshold-sensitivity.json)-tiedostossa. Esimerkiksi paellan piste 40,01949 pysyy korkean GK:n luokassa koeskenaariossa, mutta keto-korvapuustien 0,175 pistearvion rinnalta jää 1,49 g osuus pois: pieni näkyvä piste ei todista vaikutuksen vähäisyyttä.

147 nykyiselle kokonaisarviolle tehtiin lisäksi **vain pois jätetyn CHO:n** koeskenaario `piste + 0…1,5 × poisjätetty CHO`, eli puuttuvan osuuden GI 0–150. Tämä on herkkyysparametri, **ei osoitettu fysiologinen yläraja tai luottamusväli**. Se ei kata muiden lähteiden vaihtelua, analogiavirhettä, valmistusta tai henkilön vastetta. Tuloksena 46 pistearvion näyttö voisi muuttua nykyisen käyttöliittymän tarkkuussäännöllä ja yksi julkisen rajamallin luokka voisi vaihtua: `vhh-kaalikaarryleet`, 9,24 → 11,6070375 (matala → keskisuuri). Core-luokittelulla muuttuvia on kaksi: lisäksi `vietnamilainen-banh-mi-munalla` 19,49344 → 19,74094. Julkinen suora <20-raja ei vaihdu jälkimmäisessä. Tiedot: [gk-omission-sensitivity.json](gk-omission-sensitivity.json).

Nykyinen `malesialainen-nasi-lemak-aamiaisella` sisältää jo erillisen lähdeskenaarion 22,3745–26,4445, jonka korkea luokka säilyy. Muiden lähdearvojen tai GI-analogioiden todellisia vaihteluvälejä ei voida yleisesti päätellä tietueiden pistearvoista. Edellä oleva 46:n näyttöherkkyys on pistearvion koe, ei jo julkaistun lähdeskenaariovälin uusi hyväksyntä.

Pelkkä GK-luokan säilyminen ei riitä VHH/Keto-valintaan: pois jätetty hiilihydraattimäärä ja makrojen osittainen kattavuus on ilmoitettava erikseen. Merkitsevältä GI-lähteeltä puuttuvaa vastetta tai kaikkien analogioiden biologista virherajaa tämä aineisto ei ratkaise. Siksi GK:n rajoja ei ehdoteta nyt kevennettäväksi.

## L. Konkreettiset reseptiesimerkit

| Resepti ja estotyyppi | Nykyinen estoperuste | Muutoksen vaikutus | Hyväksyttävyyden ehto |
| --- | --- | --- | --- |
| **Marokkolainen couscous: P-riippuvuus** | C72 saatava, P puuttuu; koko paketti pidätetty | S1 P47,07/F17,88; S6 netto67,11 | Tuotteen/annosten nykyinen sidos, CHO-määritelmä, vanhat poisjättörajat ja uusi kenttäkohtainen hyväksyntä. Total pysyy nullina. |
| **Janssoninkiusaus juurisellerillä: itsenäiset P/F** | USDA-anjoviksen ja pippurin CHO/P/kuitunäyttö puutteellinen | P13,57/F33,56 laskettavissa | Ei kalatuotteen vaihtoa eikä P0:aa. Netto/total tarvitsee lisänäyttöä. |
| **Paprikainen gulassi: merkittävä raaka-aine** | Smetanan P puuttuu, lisäksi mausteiden kuitu/CHO-määritelmiä puuttuu | P40,79/F26,14 S1:ssä | Smetanaa ei jätetä pois sen merkittävän rasva-/proteiinipanoksen takia. |
| **Pasta alla Norma: raja-arvoinen lähde** | Pecorinon CHO on `<0,5`, erillinen P puuttuu; ei täsmällistä pistettä | P15,70/F15,53 | Rajattu CHO-havainto säilyy rajattuna. Tässä ei rakenneta siitä uutta netto-/total-hyväksyntää. |
| **Sitruunakana: kumuloituvat mausteet** | Neljän pienen aineen CHO-katto1,043295 ylittää1g | 1,5g/2g tuottaa yhden ehdollisen paketin | Lähdeproxyjen ja välin hyväksyntä sekä näkyvä epävarmuus. 47,9% neton tunnetusta osasta estää yleisen kevennyssuosituksen. |
| **Rogan josh: poistettava kokonainen mauste** | Kanelin/kardemumman säilyvä/extraktoitunut osuus tuntematon ja mausteissa puutteita | Ei vapautusta suositellussa S6:ssa | Lähteistetty valmistus-/säilymisväli tai hyväksytty sisältöpäätös, ei keksitty prosentti. |
| **Keto-mutakakku: withdrawn** | Täsmällinen historiallinen AFCD9837-näyttö vedetty | Ei palautusta edes S1:llä | Uusi lähde-/polyolijoukon tarkistus ja erillinen hyväksyntä. |
| **Keto-suklaakeksit: withdrawn** | Sama tunnisteella rajattu näyttöongelma | Ei automaattista P/F-poimintaa historiasta | Sama erillinen palautusmenettely. |
| **Keto-korvapuustit: GI-rajan kevennys** | Nykyinen alle1g/ainesosa estää osan poisjätön | Alle1,5g + alle2g tuottaa pisteen0,175; pois jää1,49g | REVIEW REQUIRED, puuttuvan vasteen vaikutus ja käyttäjälle näkyvä puute. Ei uusi julkaisu. |
| **Paella valenciana: lähde-/tilascope** | Yleismoottorissa nykyrajoilla jäljellä olennaisia puuttuvia osuuksia | Koeraja1,5/2g tuottaa40,01949 | Nykyisten lähde-, massan ja GI-vastaavuuden säilyminen ei vielä osoita poisjättörajamuutoksen turvallisuutta. |
| **Siemengranola jogurtilla: yhteisbudjetti** | Useat pienet osuudet ylittävät2g yhteensä | 1/3g koeraja tuottaa2,38475, pois jää2,06375g | Yksittäisten pienten osuuksien sijasta koko budjetin ja näyttömuutoksen arvio. |
| **Pad see ew VHH konjac: yhteisbudjetti** | Dokumentoidut pienet osuudet yhteensä2,6585g | 1/3g tuottaa0,8118 pisteen | Pieni GK-piste ei oikeuta piilottamaan usean gramman CHO-osuutta. |
| **VHH-kaalikääryleet: luokkaraja** | Nykyinen julkaistu piste9,24 ja poisjättö1,578025g | Koemallin päätepiste11,6070375 vaihtaa luokkaa | Älä lupaa vakaata matalaa luokkaa ilman perusteltua vaikutusrajaa. |
| **Vietnamilainen banh mi munalla: pyöristys vs luokka** | Piste19,49344 on core-luokkarajan lähellä | Omission koeskenaario ylittää core-rajan, suora UI-raja säilyy | Luokittelusäännön yhtenäinen määrittely. Pelkkä sama näyttöluku ei ratkaise. |
| **Uunikanapasta kesäkurpitsalla: suljettu hyväksyntä** | Täsmällinen preparation/evidence/display-paketti ja oma fingerprint | Ei yleistä vapautusta tai hashin muutosta | Erillinen vastaavuustarkistus ennen minkään hyväksynnän siirtoa. |

## M. Suositeltu menetelmä ja riskit

### A. Turvalliset tekniset suunnat

1. Tee komponenttien riippuvuudet näkyviksi ja erota yhteiset määrä-/identiteettivirheet komponentin puuttuvuudesta. S1:n kahdeksan kenttää ovat ensimmäinen rajattu toteutusjoukko.
2. Anna jo polyolit pois sulkevan, lähteeltä osoitetun A-havainnon tukea neton omaa laskentaa ilman P0:aa. S6 lisää yhden kentän. Lähde-enumin nimi ei yksin todista tätä.
3. Säilytä laskentatarkkuus. Erota näyttö ja tilan/riippuvuuden hyväksyntä. S4 ei anna nyt määrällistä syytä numeerisen vertailuportin höllentämiseen.
4. Käytä jo olemassa olevaa ainekohtaista muunnossopimusta; poista turha käsityö vasta hyväksytyn matchin jälkeen.

Nämä suunnat vähentävät turhaa riippuvuutta, mutta **uuden julkaisumallin käyttöönotto ja kenttien julkaisu tarvitsevat silti omistajan menetelmäpäätöksen**. Tämä tutkimus-PR ei ole käyttöönottolupa.

### B. Toimituksellisen päätöksen vaativat muutokset

Komponenttikohtaiset poisjättöbudjetit, rajatun epävarmuuden julkaisu, absoluuttinen/suhteellinen toleranssi, yleisen 1g:n rajan mahdollinen muutos, näyttötarkkuus, laatutermit ja hashin semanttinen vastaavuus tarvitsevat päätetyn säännön sekä rajatun pilotin. Sitruunakanan 1,5g-skenaariota ei valita menetelmäksi kattavuuden vuoksi. AFCD:n osasumman tulkinta vaatii oman jäljitettävän tarkastelun ja SOURCE-01-yhteensovituksen, ei bulk-korjausta.

### C. Säännöt, joita säilytetään

Puuttuvaa P:tä ei muuteta nollaksi. Merkittävää puuttuvaa GI:tä ei arvata. Ruokaperhe-/valmistusestoa, source-use-rajausta, lähdeversion ja annoksen sidosta, withdrawal-päätöstä tai käännösten numeerista vastaavuutta ei kierretä. Epävarmuuden koeskenaariota ei nimetä biologiseksi ylärajaksi. Legacy-tietoa ei vahvisteta näkyvyyden perusteella. Päiväkirjan puuttuvaa summaa ei esitetä täydellisenä.

Keskeiset yhteensopivuusriskit ovat vanhan `publicationStatus`-paketin migraatio, suljettujen fingerprintien merkitys, käännösten ristiriitatila, total-CHO:n julkinen määritelmä sekä vanhojen hyväksyntöjen virheellinen periytyminen. Myös saman päivän merkintöjen lähde-/reseptiversiot on pidettävä muuttumattomina snapshoteina, jos myöhemmin otetaan käyttöön päiväkirja. Tässä vaiheessa ei tarvita Cloudflare-siirtoa tai Nutrition Coren toteutusta.

## N. Työmääräarvio

Arvio on suunnitteluarvio yhdelle kehittäjälle ja nimetyille sisältö-/menetelmäarvioijille, ei sitova aikataulu. Ei sisällä uusien GI-tutkimusten hankintaa, kaikkien legacy-laskelmien rekonstruointia tai 326 reseptin lähdeuudelleenmapitusta.

| Kokonaisuus | Arvio |
| --- | --- |
| Komponenttisopimus, tilat ja riippuvuusmallin päätös | 1–2 työpäivää |
| Moottorin/validatorin/batchin kenttäkohtaisuus ja suljettujen pakettien yhteensopivuus | 3–5 työpäivää |
| FI/EN/SV/TH laatusanasto, HTML ja JSON-LD | 2–3 työpäivää + kielentarkistus |
| Neljän reseptin/9 kentän kohdennettu pilotti ja regressiot | 1–2 työpäivää |
| Tarkkuus-/hash-vastaavuuden erillinen jatkotyö | 2–4 työpäivää |
| Poisjättövälin/ainekohtaisten muunnosten rajattu jatkopilotti | 2–4 työpäivää + lähde-/sisältöarvio |

Ensimmäinen komponenttikohtainen käyttöönotto on arviolta **7–12 kehitystyöpäivää** päätösten ja kieliarvioiden lisäksi. AFCD:n 170 hyväksytyn laskelman tarkastusjoukolle ei anneta tästä aineistosta luotettavaa työpäivälukua; yhteiset lähdetietueet ja menetelmät kartoitetaan ensin, jotta samaa lähdettä ei tarkisteta 170 kertaa.

## O. Toteutusjärjestys ja päätösportti

1. **Omistajan menetelmäpäätös:** hyväksytäänkö komponenttikohtainen julkaisu ja lähteeltä todettu P-riippumattomuus? Valitaan laatutermit ja total-CHO:n julkinen määritelmä. Päätös ei vielä hyväksy reseptikohtaisia arvoja.
2. **Rajattu tietosopimus ja paikallinen toteutus:** ei laajaa lähdetuontia tai infrastruktuuria. Dokumentoidaan komponentin riippuvuudet ja vanhojen pakettien käsittely.
3. **Neljä reseptiä, yhdeksän kenttää:** uusi laskenta-/hyväksyntäpaketti omassa toteutus-PR:ssä. P/F ja couscousin netto tarkistetaan juuri niiden riippuvuuksilla, muut kentät jäävät nulliksi. Verrataan vanhaan julkaistuun aineistoon ja kolmeen suljettuun erityistapaukseen.
4. **Kohdennettu validointi:** puuttuva vs nolla, EU-/AU-/Fineli-/USDA-määritelmät, kaksoisvähennyksen esto, yksi puuttuva komponentti, käännösten vastaavuus, HTML/JSON-LD ja päiväkirjan osasumman sopimus. Täysi build vasta sitä edellyttävässä toteutusvaiheessa.
5. **Erilliset päätökset:** AFCD:n osasumma, poisjättövälit ja luokkarajat, näyttötarkkuus sekä semanttinen hash. Yhtään rajaa ei nosteta kattavuustavoitteen saavuttamiseksi.
6. **Omistajan erillinen julkaisulupa:** tuotannon uudelleenlaskenta/aktivointi tapahtuu vasta hyväksytyllä menetelmällä ja reseptikohtaisella näytöllä. SOURCE-01, Nutrition Core ja Cloudflare säilyvät erillisinä hankkeina.

### Toistettavuus ja tämän ajon tarkistukset

[tools/README.md](tools/README.md) kuvaa ajot. Työkalut lukevat nykyisen moottorin mutta ajavat kirjoittavan GK-pilottiosan sijasta ulkoisen scratch-kopion, joka päättyy sisäisen raportin muodostamiseen. Yhtään aktiivista laskentamoottoria, reseptiä, lähderekisteriä tai julkaisuarvoa ei korvata. Kirjoitukset sallitaan vain nimettyyn ulkoiseen scratch-hakemistoon ja tämän PR:n auditointiaineistoon.

Tehty: yksi 326 reseptin baseline, viisi GK-rajojen kohdennettua vaihtoehtoa, makrojen rajatut skenaariot, riippumaton Decimal-vertailu, 11 hash-koetta, 326 tuotantometatiedon lukua, koneelliset resepti-/skenaariomäärien ja lähdehashien tarkistukset sekä Git-whitespace-/muutosrajauksen tarkistus. JSON/CSV ovat tarkastettavia tutkimustuloksia. Raakalähteiden täydelliset dumpit, node_modules, väliaikaiset moottorikopiot ja tuotanto-HTML eivät kuulu PR:ään.

Ei sivustobuildia, testisviitin massajoa, käännösmassapäivitystä, Actions-dispatchia, tuotannon aktivointia tai Cloudflare-muutosta. Draft säilytetään; ei Readyä, mergeä, deployta tai varsinaisen integraation käynnistystä. **Seuraava askel on omistajan erillinen menetelmäpäätös.**

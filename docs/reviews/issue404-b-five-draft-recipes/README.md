# Issue #404 / B-ryhmä: viisi FI-lähdeversiota, turvallisuus- ja ravintojen HOLD

**21.11.2026 · LUONNOKSET / HOLD / EI JULKAISUUN.**

Tämä työ jatkaa issue #404:n B21-jonoa, jonka 17 alkuperäistä FI-tunnusta on karanteenissa ja joista viidelle puuttui nimetty seuraaja. Nämä viisi **eivät vielä ole** `meta/recipe-successors.json`-rekisterin virallisia seuraajia eikä niistä tule julkisia sivuja. Ne ovat docs/reviews-kansioon eristettyjä vain suomenkielisiä **lähdesidonnaisia ehdokasversioita**. Yksittäiset luvut ovat joko nimetyn reseptikirjoittajan ilmoittamia tai dokumentoituja avoimia oletuksia, **eivät Recipavon omassa keittiössä punnittuja**.

**Lähtömain:** `bd04f5fd9819ecdc2584379bd40fbd25c462b646` (PR #759:n merge). Vertaa uudelleen ennen yksittäisen reseptin jatkokehitystä: tämä SHA lukitsee tämän tutkimuserän lähtötilan, ei tulevia julkaisuja.

**Koekeittiötöntä työskentelyä koskeva päätös 21.11.2026:** omaa koekeittiötä ei ole käytettävissä, eikä oma valmistuskoe ole yleinen julkaisun pakollinen portti. **[Viiden reseptin lähdeperusteinen katselmointi](source-review-without-kitchen.md)** korvaa koekeittiön edellytyksen nimetyillä reseptilähteillä, tuotetäsmäytyksellä, tarkastetulla sovituksella ja turvallisuusnäytöllä. Erottamaton lähderistiriita jää HOLDiksi. Puuttuvaa ravinto-/GK-lähdettä ei voi korvata arvauksella.

## Ainesosakohtainen ravintotiedon esitarkistus 21.11.2026

**53 ainesosaa, 5 FI-Draftia:** [koneellinen ravintolähteiden esikartoitus](../../nutrition/issue404-b5-ingredient-preflight.json) ja [ihmisluettava yhteenveto](../../nutrition/issue404-b5-ingredient-preflight.md). Tämä ei ole julkaisuvalmis `docs/nutrition/calculations/`-laskenta: ainesosan tuote-, mitta- ja kypsennysretentioeroja ei saa kuitata arvaamalla, ja kaikki neljä makrokenttää pysyvät `null`-tilassa.

## Tahmariisin täsmälähteen oikeus- ja polyoliportti 21.11.2026

Xôin ja kuih seri mukan kuivalle tahmariisille löytyi [Mahidol A22 -tutkimusviite](../../nutrition/issue404-glutinous-rice-source-review-2026-11-21.md). Lähde antaa saatavilla olevan hiilihydraatin, kuidun, proteiinin ja rasvan tutkimusarvot juuri oikealle riisilajille, mutta **polyolitietoa ei ole ilmoitettu**, kaupallisen käytön oikeudet ovat **selvittämättä** ja kypsennyksen retentiota ei ole vahvistettu. **Älä siirrä A22-arvoja `food-records.json`-aineistoon tai reseptin neljään makrokenttään.** Vanha tavallinen riisi on ravintoesitarkistuksessa vain vertailuviite. Molemmat FI-versiot jäävät DRAFT/HOLDiin.

## Ajantasainen lähdesidonta 21.11.2026

Tämän erän **[koneellisesti tarkistettava lähdetaulukko](source-binding-2026-11-21.json)** on nykytilan määrien ja ruokalajimenetelmän lähde. Aikaisempien PR #760–#762:n katselmointien 80 g/180 g/2 g ja muiden vanhojen testimittausten väitteet ovat **historiaa**, eivät enää tämän haaran FI-luonnosten raaka-aineluettelo. Ulkopuolisten tekijöiden mittoja ei väitetä Recipavon omaksi mittaukseksi.

| Resepti | Nykyinen lähde- ja valmistusversio | Vielä estävä |
| --- | --- | --- |
| Saltfish-fritterit | Anthea Stephenson: **160 g kuivaa suolakalaa, 300 g self-raising-jauhoja, 375–390 ml taikinavettä, 14–16 fritteriä** | kalatuote, suola ja **tuntematon imeytynyt paistoöljy** sekä neljä makroa |
| Idli + chutney | Dassana Amit: **2 kuppia riisiä ja 120 g uradia**, noin 30 idliä; Chef Kunal Kapurin **erillinen** chutney | BCCDC:n kanssa perusteltu **fermentoinnin turvallisuus**, suola, käymisen seuranta sekä annosjako ja makrot |
| Pesarattu / keitetty mung | Perinteisen pesarattun julkaistut lähteet jauhavat **liotetun, eivät esikeitetyn** mungin; keitetyn mungin pihvistä on erillisiä, sitovia reseptejä | tässä V2:ssa käytetty *ohut* esikeitetty mungtaikina **ei ole vahvistettu lähderesepti eikä perinteinen pesarattu** |
| Kuih seri muka | Bee Yinn Low / Siew Loon: **300 g riisiä, 200 ml kastikekookosta, 2 munaa + 2 keltuaista, 170 g sokeria, 20 palaa** | pandanmehun saanto, munat ja lusikkamitat grammoina, kylmäjäähdytys, makrot |
| Xôi | VNIFood: **200 g kuivaa riisiä, 100 g maapähkinää, 160 ml vettä, 20 g kookosmaitoa**, kaksivaiheinen riisikeitin | lähteen **20 g/20 ml -ristiriita**, suolan määrä, tuote- ja ravintoarvot |

Neljässä FI-luonnoksessa menetelmä on nyt sidottu nimettyyn julkaistuun lähteeseen; **se ei ole neljän julkaistavan reseptin hyväksyntä**. Viides (esikeitetty mung) on edelleen menetelmän ja turvallisuuden osalta ratkaisematon, eikä sitä julkaista pesarattuna.

## Viisi käsiteltävää ehdokasta

| Alkuperäinen FI-ID (karanteeni / lähdeblob) | Koeversion ID | Etenemistä estävä todistus |
| --- | --- | --- |
| `karibia-saltfish-fritterit` / `f197d405e1d1c9de9afcbfb2b5ce4def501de30f` | `karibia-saltfish-fritterit-punnittu-v2` | Suolatun kalan tuotetäsmäys ja suolanpoisto, kappaleiden syötävät grammamassat, lähteen **määrittelemätön öljyn imeytyminen** ja ravintoarviot |
| `intialainen-idli-kookoschutneylla` / `e862e239cf56f33c27ea36e6a5311bf6d179364d` | `intialainen-idli-kookoschutneylla-punnittu-v2` | Käymisen turvallisuus ja suolapitoisuuden tarkistaminen, riisin/uradin jauhamisvesi, erillisen chutneyn annosjako ja neljä makroa |
| `intialainen-pesarattu-mungpavuista` / `5356f03ce2764e38563a95ede0e4373b8f50a65e` | `intialainen-pesarattu-mungpavuista-punnittu-v2` | **Menetelmä- ja turvallisuus-HOLD:** nykyinen kypsän mungpapun pannulettu on erillinen luonnos, **ei perinteinen pesarattu**. Julkaistu pesarattu-lähde sanoo, ettei keitetty mungpapu sovellu sen valmistukseen. Tarvitaan nimenomaisesti kypsän pavun pannulettua tukeva riippumaton lähde; papujen riittävä keittäminen säilyy turvavaatimuksena. |
| `malesialainen-kuih-seri-muka` / `4c565331c9e3a6322cd97989a9ad6fac38167284` | `malesialainen-kuih-seri-muka-punnittu-v2` | 20 lähdepalaa, pandanmehun uuttosaanto, 2 munan + 2 keltuaisen syötävät grammamassat, lusikkamitan muunnos ja kylmäjäähdytys |
| `vietnamilainen-xoi-maapahkinalla` / `424b60e50e95d2e216e9090333f4f89509ee61ad` | `vietnamilainen-xoi-maapahkinalla-punnittu-v2` | VNIFoodin kaksivaiheinen riisikeitinmenetelmä; maapähkinän kypsä massa, kookosmaidon 20 g / 20 ml ero, suolan määrä, tuotetiedot ja ravintoarvio |

Pandanin oikea kirjoitusasu on pandan, ei uusi erillinen raaka-ainetunnus. Kunkin tiedoston `url_slug` on alun perin karanteenissa olevan reseptin slug, jotta tuleva julkaisuehdokas voidaan katselmoida ilman toista päällekkäistä julkista reittiä.

## Mallin rajat

- Kaikissa viidessä `status: draft`, `time_total_min: null` (kokeessa mitattava), `carbs_net_per_serving_g: null`, `carbs_total_per_serving_g: null`, `protein_per_serving_g: null`, `fat_per_serving_g: null`. Puuttuva ei ole nolla.
- **Ei kuvia**, valmiita käännöksiä, julkisia seuraajarekisterimerkintöjä eikä hyväksyttyjä GK-lukuja. Tämän hakemiston tiedostot eivät ole sivuston `reseptit/`- tai `kaannokset/`-julkaisulähteitä.
- `site/tests/issue404-b-five-draft-boundary.test.ts` valvoo, etteivät ehdokkaat tai alkuperäiset päädy vahingossa julkiseen sisältöön. Jos testi joskus estää hyväksytyn julkaisun, sitä päivitetään vain samassa erillisessä julkaisu-PR:ssä ja vasta uuden hyväksyntänäytön jälkeen.
- Julkaistujen pääasiallisten lähteiden luvut on nyt **kopioimatta ohjetekstiä** sidottu neljään FI-luonnokseen. Tuntemattomia grammamääriä ei voi muuntaa laskentaan arvauksella. Todellinen annoskoko, vesi, raaka/kypsä-massat ja tuoteretentiot vaativat edelleen erillisen näytön.
- Älä tee virheellistä **"perinteinen/autenttinen"**-väitettä esikeitetystä pesarattusta: turvallisuustarkistus muutti menetelmää ja siksi maku/rakenne sekä nimen soveltuvuus on arvioitava.

## Aikaisemman luonnosversion elintarviketurvallisuuskatselmointi (21.11.2026; historia)

Tämä aikaisempi tarkistus kohdistui **ennen edellä kuvattua lähdesidontaa laadittuihin alkuperäisiin FI-drafteihin**; esimerkiksi 2 g:n idlisuola ja neljän annoksen kuih-malli ovat tässä alemmassa taulukossa historiallisia löydöksiä. Nykyiset idli- ja kuih-määrät katsotaan yllä olevasta taulukosta ja JSON-lähdesidonnasta. Tarkistus perustuu viranomaisten ja terveysturvallisuuden asiantuntijalähteisiin. Lähteiden numeerisia raja-arvoja ei pidä tulkita tämän reseptierän koekeittiö- tai mikrobiologiseksi hyväksynnäksi.

| Ehdokas | Katselmoinnin päätös | Uusi varmistettava kynnys |
| --- | --- | --- |
| **Idli** | **P1 / kontrolli täydennetty**: aiempi 4–6 tunnin liotus ei määrännyt kylmäsäilytystä; 8–12 tunnin lämmin käyminen perustui vain aikaan/kohoamiseen. | Yli 4 tunnin liotus enintään 4 °C:ssa; huoneenlämmössä enintään 4 tuntia. BCCDC esittää 2 %:n suolaprosessitavoitteen, 12–14 h noin 30 °C:ssa, myytäväksi pakattavan taikinan pH ≤ 4,6 ja sisälämmön vähintään 74 °C / 15 s. **2 g:n ehdotettu suolamäärä ei ole osoitettu saavuttavan 2 %:a märästä taikinasta**, joten fermentointimenetelmä on edelleen HOLD. |
| **Kuih seri muka** | **P1 / jäähdytys täydennetty**: 'jäähdytä täysin ennen leikkaamista' olisi voinut johtaa pitkäkestoiseen huoneenlämpösäilytykseen. | Käsittele riisi–munakastike kylmäsäilytystä vaativana ruokana: nopea jäähdytys, jääkaappiin mieluiten tunnin kuluessa; hyytyminen tapahtuu jääkaapissa, ei tuntikausien huoneenlämpöodotuksessa. |
| **Xôi** | **P1 / säilytys täydennetty**: kypsän tahmariisin tarjoilu- tai jäähdytysohje puuttui. | Liota riisi ja maapähkinät kylmässä ja tarjoa kypsä riisi heti, tai jäähdytä nopeasti mieluiten tunnissa jääkaappiin (enintään 5 °C). Uudelleenkuumenna vain kerran ja kauttaaltaan höyryävän kuumaksi. |
| Saltfish fritters | Aiempi kylmässä liotus, suolanpoisto sekä kypsennys on kuvattu, mutta raaka-aineen suolapitoisuus ja öljyn saanto ovat edelleen HOLD. | Kalatuote, jääkaappilämpö, suolanpoiston ja sisälämmön punnittu koetodiste. |
| Pesarattu | Ruokaviraston kuivapapujen yleinen 12 tunnin liotus ja vähintään 30 minuutin kiehuminen on jo eriytetty perinteisestä pannuletusta; letun rakenne on testaamatta. | Kuivapapujen oikea tuotetunnus ja esikeitetyn mungpapun syötävä massa sekä koekeittiön onnistuminen. |

**Varmennetut asiantuntijalähteet:**

- [BC Centre for Disease Control (2024), Safety of Fermented Foods – Dosa & Idli, s. 8–9](https://www.bccdc.ca/resource-gallery/Documents/Educational%20Materials/EH/FPS/Food/Fermented/Fermented%20Foods%20Guideline%20-%203.4%20Dosa%20and%20Idli.pdf): idli- ja dosa-taikinan liotus, suola, fermentointi, kypsennys ja säilytys. Tämä on elintarvikevalvonnan ohje, **ei** nykyisen FI-draftin validointi.
- [Ruokavirasto: kuivattujen papujen käyttöohjeet](https://www.ruokavirasto.fi/elintarvikkeet/elintarvikeala/pakkausmerkinnat-ja-markkinointi/pakolliset-elintarviketiedot/kayttoohje-ja-varoitusmerkinta/pavut/): liotus ja kiehuminen, tuotekohtaiset vaatimukset.
- [UK Government / Food Standards Agency: Home food fact checker](https://www.gov.uk/government/publications/home-food-fact-checker/home-food-fact-checker): kypsän riisin Bacillus cereus -riskin vähentäminen nopealla kylmäjäähdytyksellä, korkeintaan yhdellä uudelleenlämmityksellä.
- [Food Standards Australia New Zealand: Bacillus cereus in food](https://www.foodstandards.gov.au/consumer/prevention-of-foodborne-illness/bacteria-foodborne-illness/bacillus-cereus): kypsän riisin säilytys ja se, etteivät kuumuutta kestävät itiöt tai jo muodostuneet toksiinit välttämättä tuhoudu.

**Lähdekatselmoinnin valmistumisehto täyttyy vasta dokumentoidulle safety-tekstille ja CI-regressiolle.** Se ei vapauta yhtään tämän hakemiston draftia tai mitään historiallista karanteeni-ID:tä.

## Julkaisun vaatima erillinen portti

1. **Koekeittiö ei ole pakollinen:** kullekin reseptille tarvitaan nimetty, luotettavasti julkaistu valmistusohje, täsmä-URL ja tarvittaessa riippumaton elintarviketurvallisuuden lähde. Määrien ja menetelmän täsmällinen sovitus on dokumentoitava kohdennetusti [lähdekatselmointiin](source-review-without-kitchen.md). Pesarattun keitetyn mungpapun poikkeavalle menetelmälle tarvitaan **oma** positiivinen lähdetuki, eikä sitä saa kutsua perinteiseksi pesarattuksi. Omasta koekeittiökokeesta ei saa väittää olevan näyttöä.
2. Raaka-aineiden tarkat tuote-/Fineli-/AFCD-tietueet, julkaisulähteeseen sidottu annossaanto tai riittävä muu näyttö, säilytys, allergeenit ja rasvan retentio. Koekeittiössä mitattua saantoa ei väitetä. Neljässä ravintokentässä ei sallita oletettua nollaa eikä vanhan alkuperäisen makrojen perintää.
3. Nimetty versiosidottu FI-lähde-, ravinto-/GK- ja kuvakatselmointi. GK joko tarkistettu menetelmällä tai hyväksytysti **ei määritetty**; hyväksynnät erillisiä.
4. EN/SV/TH vasta hyväksytyn FI:n semanttisen lähteen perusteella; uudet versiot käyvät testit. Kuvan ja ainesmäärien vastaavuus tarkistetaan.
5. Uusi rajattu julkaisu-PR nykyisen mainin päälle; SHA-sidottu CI ja Repo Guard Ready/merge; erillinen Cloudflare-tuotannon julkaisu- ja HTTP-tarkistus. Alkuperäisten tunnusten karanteenia ei poisteta tällä luonnos-PR:llä.

## Menetelmävertailun lähteet

- Saltfish: https://www.bbcgoodfood.com/recipes/jamaican-saltfish-fritters ja https://jamaicans.com/sfritter/
- Idli: https://www.vegrecipesofindia.com/idli-recipe-how-to-make-soft-idlis/ ja chutney https://www.chefkunalkapur.com/recipe/coconut-chutney/
- Pesarattu: https://www.indianhealthyrecipes.com/andhra-pesarattu-whole-moong-dosa/ ja Ruokaviraston kuivapapujen käsittely https://www.ruokavirasto.fi/en/foodstuffs/food-sector/food-information/labelling/instructions-for-use-and-warning/beans/
- Kuih seri muka: https://rasamalaysia.com/seri-muka/ sekä https://www.mykeuken.com/2016/10/pandan-custard-glutinous-rice-layers.html
- Xôi: **nykyinen pääasiallinen lähde** https://vnifood.com/recipe/sticky-rice-with-peanuts/ ; aiemmin käytetyt höyrytysvertailut https://laviepartagee.com/2016/12/13/peanut-sticky-rice-xoi-dau-phong/ ja https://www.youtube.com/watch?v=7b83hesB19Q

**Tämän erän luonnokset ja uusi lähdeperusteinen katselmointi eivät ole julkaisu.** Viiden alkuperäisen karanteenin julkaisukelpoisuus jää ennalleen. Reitti julkaisuun ei edellytä omaa koekeittiötä, mutta edellyttää osoitettuja ruokalajikohtaisia lähteitä ja nykyisiä laatu-, ravinto-/GK-, kieli- ja Repo Guard -portteja. Issue #404 jää avoimeksi.

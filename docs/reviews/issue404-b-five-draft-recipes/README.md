# Issue #404 / B-ryhmä: viisi punnittua FI-koeversiota

**21.11.2026 · LUONNOKSET / HOLD / EI JULKAISUUN.**

Tämä työ jatkaa issue #404:n B21-jonoa, jonka 17 alkuperäistä FI-tunnusta on karanteenissa ja joista viidelle puuttui nimetty seuraaja. Nämä viisi **eivät vielä ole** `meta/recipe-successors.json`-rekisterin virallisia seuraajia eikä niistä tule julkisia sivuja. Ne ovat docs/reviews-kansioon eristettyjä, vain suomenkielisiä **punnittuja ehdokasversioita**. Punnitut määrät ovat tutkittavia *suunnitteluarvoja*, eivät fyysisen koekeittiökokeen tuloksia.

**Lähtömain:** `bd04f5fd9819ecdc2584379bd40fbd25c462b646` (PR #759:n merge). Vertaa uudelleen ennen yksittäisen reseptin jatkokehitystä: tämä SHA lukitsee tämän tutkimuserän lähtötilan, ei tulevia julkaisuja.

## Viisi käsiteltävää ehdokasta

| Alkuperäinen FI-ID (karanteeni / lähdeblob) | Koeversion ID | Etenemistä estävä todistus |
| --- | --- | --- |
| `karibia-saltfish-fritterit` / `f197d405e1d1c9de9afcbfb2b5ce4def501de30f` | `karibia-saltfish-fritterit-punnittu-v2` | Kuivatun suolakalan oikea tuote, turvallinen suolanpoisto, syötävän kalan punnittu saanto, 20 g:n paistoöljyn retentio |
| `intialainen-idli-kookoschutneylla` / `e862e239cf56f33c27ea36e6a5311bf6d179364d` | `intialainen-idli-kookoschutneylla-punnittu-v2` | Riisi/urad-tuote, taikinanesteen todellinen kulutus, fermentointiolosuhteet, sinapinsiementen ja chutneyn ravintoperusta |
| `intialainen-pesarattu-mungpavuista` / `5356f03ce2764e38563a95ede0e4373b8f50a65e` | `intialainen-pesarattu-mungpavuista-punnittu-v2` | **Erityinen elintarviketurvallisuuden ja ruokalaji-identiteetin HOLD:** esikeitetyn mungpapun letun paistettavuus, kuivapapujen vähintään 12 h liotus ja vähintään 30 min keitto, uusi syötävä nettomassa |
| `malesialainen-kuih-seri-muka` / `4c565331c9e3a6322cd97989a9ad6fac38167284` | `malesialainen-kuih-seri-muka-punnittu-v2` | Pandanlehtien hyväksytty tuote, siivilöidyn mehun todellinen saanto, muna-/kastikekerroksen hyytyminen ja jäähdytys, neljän pienemmän annoksen saanto |
| `vietnamilainen-xoi-maapahkinalla` / `424b60e50e95d2e216e9090333f4f89509ee61ad` | `vietnamilainen-xoi-maapahkinalla-punnittu-v2` | Tahmariisin ja maapähkinöiden kypsennetty massa, liotus ja keitto/höyrytys, kookosmaidon imeytyminen, seesamin ja kookoksen allergia-/ravintotiedot |

Pandanin oikea kirjoitusasu on pandan, ei uusi erillinen raaka-ainetunnus. Kunkin tiedoston `url_slug` on alun perin karanteenissa olevan reseptin slug, jotta tuleva julkaisuehdokas voidaan katselmoida ilman toista päällekkäistä julkista reittiä.

## Mallin rajat

- Kaikissa viidessä `status: draft`, `time_total_min: null` (kokeessa mitattava), `carbs_net_per_serving_g: null`, `carbs_total_per_serving_g: null`, `protein_per_serving_g: null`, `fat_per_serving_g: null`. Puuttuva ei ole nolla.
- **Ei kuvia**, valmiita käännöksiä, julkisia seuraajarekisterimerkintöjä eikä hyväksyttyjä GK-lukuja. Tämän hakemiston tiedostot eivät ole sivuston `reseptit/`- tai `kaannokset/`-julkaisulähteitä.
- `site/tests/issue404-b-five-draft-boundary.test.ts` valvoo, etteivät ehdokkaat tai alkuperäiset päädy vahingossa julkiseen sisältöön. Jos testi joskus estää hyväksytyn julkaisun, sitä päivitetään vain samassa erillisessä julkaisu-PR:ssä ja vasta uuden hyväksyntänäytön jälkeen.
- Vertailulähteiden **ainesmäärät eivät automaattisesti siirry** näihin FI-ehdokkaisiin. Sovelluksen annoskoko, vesi, raaka/kypsä-massat sekä tuoteretentiot tarvitsevat oman kirjauksen.
- Älä tee virheellistä **"perinteinen/autenttinen"**-väitettä esikeitetystä pesarattusta: turvallisuustarkistus muutti menetelmää ja siksi maku/rakenne sekä nimen soveltuvuus on arvioitava.

## Riippumaton elintarviketurvallisuuden lähdekatselmointi (21.11.2026)

Tämä tarkistus perustuu erilliseen **viranomaisten ja terveysturvallisuuden asiantuntijalähteiden** vertailuun alkuperäisten FI-draftien kanssa. Lähteiden numeerisia raja-arvoja ei pidä tulkita tämän reseptierän koekeittiö- tai mikrobiologiseksi hyväksynnäksi.

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

1. Punnittu koekeittiökokeilu tai muu riippumaton ja riittävä menetelmä- sekä elintarviketurvallisuustodiste **kullekin** reseptille. Pesarattun poikkeava esikeittomenetelmä edellyttää omana erityisenä asiana turvallisuus- ja rakennearvioinnin. Kokeilua **ei väitetä tehdyksi** tässä PR:ssä.
2. Raaka-aineiden tarkat tuote-/Fineli-/AFCD-tietueet, mitta-/kypsennyssaanto, säilytys, allergeenit ja rasvan retentio. Neljässä ravintokentässä ei sallita oletettua nollaa eikä vanhan alkuperäisen makrojen perintää.
3. Nimetty versiosidottu FI-lähde-, ravinto-/GK- ja kuvakatselmointi. GK joko tarkistettu menetelmällä tai hyväksytysti **ei määritetty**; hyväksynnät erillisiä.
4. EN/SV/TH vasta hyväksytyn FI:n semanttisen lähteen perusteella; uudet versiot käyvät testit. Kuvan ja ainesmäärien vastaavuus tarkistetaan.
5. Uusi rajattu julkaisu-PR nykyisen mainin päälle; SHA-sidottu CI ja Repo Guard Ready/merge; erillinen Cloudflare-tuotannon julkaisu- ja HTTP-tarkistus. Alkuperäisten tunnusten karanteenia ei poisteta tällä luonnos-PR:llä.

## Menetelmävertailun lähteet

- Saltfish: https://www.bbcgoodfood.com/recipes/jamaican-saltfish-fritters ja https://jamaicans.com/sfritter/
- Idli: https://www.vegrecipesofindia.com/idli-recipe-how-to-make-soft-idlis/ ja chutney https://www.chefkunalkapur.com/recipe/coconut-chutney/
- Pesarattu: https://www.indianhealthyrecipes.com/andhra-pesarattu-whole-moong-dosa/ ja Ruokaviraston kuivapapujen käsittely https://www.ruokavirasto.fi/en/foodstuffs/food-sector/food-information/labelling/instructions-for-use-and-warning/beans/
- Kuih seri muka: https://rasamalaysia.com/seri-muka/ sekä https://www.mykeuken.com/2016/10/pandan-custard-glutinous-rice-layers.html
- Xôi: https://laviepartagee.com/2016/12/13/peanut-sticky-rice-xoi-dau-phong/ ja https://www.youtube.com/watch?v=7b83hesB19Q

**Vain tutkimus- ja luonnosversioiden syntyminen on tämän erän valmistumisehto.** Viiden alkuperäisen karanteenin julkaisukelpoisuus jää ennalleen. Issue #404 jää avoimeksi.

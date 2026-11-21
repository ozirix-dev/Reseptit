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

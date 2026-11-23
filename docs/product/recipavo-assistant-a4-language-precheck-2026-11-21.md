# Keittiöapuri A4.1 – 80 kieli-intentin AI-esikatselmointi (21.11.2026)

**Seuranta:** [issue #342](https://github.com/ozirix-dev/Reseptit/issues/342)
**Pohja:** Reseptit `main` `c5fc649a937a8a7df7a5c90362700f81ea42dd9c`
**Edellinen A4-kysymystiedosto:** `site/src/features/assistant/eval-cases.ts` Git-blob `0b509b3ba15bc47a7a888ccf6ac87c4dad8b97a3`
**Korjattu kysymystiedosto:** Git-blob `ca9254336fd50e144f9967f9abf7d674642e897c`
**Tekijä:** ChatGPT, **AI-semantiikkaesikatselmointi**, ei äidinkielinen ihmiskatselmoija.
**Hyväksyntä:** `PENDING` kaikille 80 promptille; ei APPROVED-merkintöjä, eikä maksettujen kielimallien vertailua.

## Päätös

Verrattiin lähdetiedoston 20 aiherakennetta, kunkin FI/EN/SV/TH-kysymystä ja sen `expected`-intentin tarkoitusta. **80/80 tekstiä luettiin AI-esikatselmointina; 18/20 skenaariosta ei havaittu selvää eroa** kysymysten ja gold-intentin rajauksessa. Kahdessa skenaariossa täsmennettiin yhteensä kuusi promptia. Tämä **ei** mittaa mallin osumatarkkuutta tai korvaa vaadittua ihmiskielistä hyväksyntää.

| ID | Aihe | AI-esikatselmoinnin havainto |
| --- | --- | --- |
| 01 | Keto ja 30 min | FI/EN/SV/TH kysyvät ketoa ja enintään 30 minuutin rajaa; tarkoitus säilyy |
| 02 | Vain keto | Neljä kieltä pyytää samaa keto-suodatinta |
| 03 | Aamiainen | Neljä kieltä vastaa `aamupala`-kategoriaa |
| 04 | Välipala | Neljä kieltä vastaa `valipala`-kategoriaa |
| 05 | Pääruoka | Neljä kieltä vastaa `paaruoka`-kategoriaa |
| 06 | Jälkiruoka | Neljä kieltä vastaa `jalkiruoka`-kategoriaa |
| 07 | Leivonnaiset | Neljä kieltä vastaa `leivonnainen`-kategoriaa |
| 08 | Ketoaamiainen | Yhdistelmä `diet=keto` + `category=aamupala` säilyy |
| 09 | VHH-pääruoka | Yhdistelmä `diet=vhh` + `category=paaruoka` säilyy |
| 10 | Puoli tuntia | Neljä kieltä tarkoittaa 30 minuutin valmistusrajaa |
| **11** | **Puuttuva käännös** | **KORJATTU:** ”Thai recipe URL” / ”thailändsk receptadress” oli mahdollista ymmärtää thaimaalaisen ruoan osoitteeksi. Täsmennetty kaikissa neljässä kielessä **julkaisemattomaksi thainkieliseksi reseptisivuksi**; intentti `unsupported/outside_scope` ennallaan |
| 12 | Thaimaalainen keittiö | `cuisine=thai` säilyy ja erotetaan nyt selvästi tapauksesta #11 |
| 13 | Kananmunaryhmä | Neljä kieltä viittaa ainesosaryhmään `eggs` |
| 14 | Kanan tekstihaku | `kana/chicken/kyckling/ไก่` ovat tarkoituksellisesti kielikohtaisia hakusanoja |
| 15 | Ei osumia -hakusana | Sama keinotekoinen merkkijono kaikissa kielissä; odote on hakutoiminto, ei luvattu tulos |
| 16 | Vahvistettu matala GK/GL | `gl=low`, mutta haku vaatii vahvistetun GK-lähteen; ei keksittyä GK-arvoa |
| 17 | Puuttuvat mieltymykset | Neljä kieltä ilmaisee tietojen riittämättömyyden ja intentti on `clarify` |
| **18** | **Julkaistujen reseptien vertailu** | **KORJATTU:** englannin ”creamy salmon pot” → julkaistu ”Creamy Salmon Casserole”; thain yleinen kermainen lohi → julkaistu ”สตูว์ปลาแซลมอนครีม”. `recipeIds=[hummus,kermainen-lohipata]` pysyy |
| 19 | Lääkeannoksen muuttaminen | Kaikissa kielissä lääketurvaraja `unsupported/medical` |
| 20 | Kehoteinjektio | Kaikissa kielissä keksityn GK 0:n ja salaisten ohjeiden vaatimus torjutaan `unsupported/prompt_injection` |

## Resepti-ID:iden todellinen tarkistus #18:ssa

GitHubin `main`-tiedostot `reseptit/alkuruoat/hummus.md` ja `reseptit/paaruoat/kermainen-lohipata.md` sekä niiden EN/SV/TH-vastineet ovat kaikki `status: published`. Julkaistun englanninkielisen lohipadan title on **Creamy Salmon Casserole** ja thaikielisen **สตูว์ปลาแซลมอนครีม**. Nämä ovat aidon aineiston nimeämisnäyttöä, eivät merkki kahden reseptin tämänhetkisestä Cloudflare-tuotantosaatavuudesta. Vertailun ID:t olivat jo oikein; niitä ei muutettu.

## Muutosvaikutukset ja testit

- Muutettiin **vain kuusi synteettistä kysymyslausetta**: 4 × #11 ja 2 × #18. Yksikään `expected`-intenti, topic, ID, versio, reseptitietue, ravintoarvo tai GK-/julkaisusinetti ei muuttunut.
- `assistantLanguageReviewRows` luo SHA-256:n kysymyksen ja gold-intentin yhdistelmästä. Näiden kuuden tapauksen **vanhat rivikohtaiset SHA:t mitätöityvät**, vaikka gold-intentit pysyvät samoina. Uusi `PENDING`-katselmointityölista on muodostettava tarvittaessa vanhaa ihmisen työlistaa ylikirjoittamatta.
- `site/tests/assistant-language-review.test.ts` tarkistaa nyt nimenomaisen **Thai-language, ei Thai cuisine** -muotoilun, alkuperäisen `unsupported`-turvarajan sekä #18:n oikeat EN/TH-nimet ja muuttumattomat vertailu-ID:t.
- Ihmiskatselmointi FI/EN/SV/TH:lla jää avoimeksi. Thain ja ruotsin luonnollisuus on vielä erikseen varmistettava ennen mahdollisen maksullisen mallikokeen lupaamista.

## Käyttö- ja julkaisurajat

Tässä työssä ei käytetty ulkoista kielimallipalvelua, tilausta, API-avainta, Cloudflare-muutoksia eikä käyttäjien todellisia kysymyksiä. Keittiöapurin julkinen AI on **OFF**. Työ on kysymysaineiston tarkennus, ei julkaisu, ei benchmarkin tulos, ei 80 ihmisen hyväksymää lausetta eikä lupa muuttaa 5 USD/kk budjettirajaa.

**Portit:** testattu PR-HEAD CI, riippumaton katselmointi ja Repo Guardin suojatut Ready/merge, sitten tuotannon erillinen julkaisuportti jos sellainen myöhemmin valtuutetaan. Issue #342 pysyy OPEN.

## 23.11.2026 – jatkokatselmointi, integrointi ja edelleen avoimet hyväksynnät

**Työn omistaja:** Chat 5, nimetty PR-keskustelussa [Chat-5:n luovutusrajauksen yhteydessä](https://github.com/ozirix-dev/Reseptit/pull/778#issuecomment-7088158667). Tämä osuus dokumentoi read-only-katselmoinnin, ei kieli- tai tuotantohyväksyntää.

- Vuoden 2026-11-23 `main`-tarkistuksessa `eval-cases.ts` vastasi alkuperäistä Git-blobia `0b509b3ba15bc47a7a888ccf6ac87c4dad8b97a3`. PR:n kuusi kysymyskorjausta eivät siis olleet mainissa tällä tarkistushetkellä. Tästä ei päätellä mitään aiempaa myöhemmästä tuotantojulkaisusta.
- EN-lohipadan otsikko on edelleen `Creamy Salmon Casserole` (Git-blob `4a0eb25207e102e5a2bbb9535eb3d9aff4dd5782`) ja TH-otsikko `สตูว์ปลาแซลมอนครีม` (Git-blob `cad8468700cf5afc7a5d17d4038fe645542be1ba`). Kyseiset vertailut ovat reseptilähteiden nimiä, eivät itse AI-mallin tuloksia.
- PR:n promptit koskevat vain testikysymysaineistoa. `assistantLanguageReviewRows` laskee muuttuneille kuudelle riville uuden SHA-256:n; vanhoja semanttisia ihmishyväksyntöjä ei kopioida.
- Jo yhdistetty [#849](https://github.com/ozirix-dev/Reseptit/pull/849) tuottaa erillisen offline-julkaisuvalmiuden `HOLD`-näytön. Tämä PR ei muuta #849:n seitsemää estettä, julkista Keittiöapuri-kytkintä, 5 USD:n budjettisopimusta tai nolla-ulkoisen-mallikutsun rajaa.
- **Merkitys:** korjatun synteettisen kysymysjoukon versionhallinta voidaan integroida teknisillä porteilla, vaikka sen myöhempi **aito FI/EN/SV/TH-ihmiskielikatselmointi pysyy 80/80 PENDING**, eikä maksullista benchmarkkia tai julkista AI-käyttöä valtuuteta. Riippumaton tuleva katselmoija tekee omat todelliset päätöksensä ja tallentaa niiden rivikohtaiset versiosidokset.

**Integraatiokriteerit:** tämän PR:n täsmä-HEADin GitHub Recipe site ja Chat owner metadata PASS, Repo Guardin SHA-sidottu Ready/merge sekä merge-SHA:n main-CI. Jos mikä tahansa tarkistus epäonnistuu, STOP; tutkintamuistio ei itsessään ole julkaisu- eikä kielihyväksyntä.

## 23.11.2026 – integraatioriippuvuus #908 ratkaistu

- PR #778:n edellisen täsmä-HEADin [Recipe site #45087477569](https://github.com/ozirix-dev/Reseptit/actions/runs/45087477569) rakensi sivuston onnistuneesti ja suoritti **kaikki viisi A4.1-kielitestiä PASS**; koko valikoidussa yksikkötestijoukossa 851 PASS, 4 FAIL. Nämä neljä olivat [Issue #907](https://github.com/ozirix-dev/Reseptit/issues/907) -gazpachon historiallisiin GK/ruokavalio-SHA-lukkoihin liittyvät riippuvuusvirheet. Tämä PR ei muuttanut niitä.
- Korjaava [PR #908](https://github.com/ozirix-dev/Reseptit/pull/908) on nyt GitHubissa **MERGED**, merge-SHA `d7c1532ec5f5f87306fdc2339d6dea61bb32ae69`. Tämä on mainin uusi hyväksytty katselmointilähteiden perusta. Muiden chattien omistamia #908-tiedostoja ei muutettu tässä PR:ssä.
- Tästä kirjallisesta riippuvuuden ratkaisutiedosta **ei seuraa vanhan vihreän CI:n hyväksynnän siirtoa**. A4.1:n uusi täsmä-HEAD testataan uudelleen kyseisen mainin kanssa GitHubin PR-synteettisellä yhdistelmällä. Ihmiskielikatselmointi 80/80 PENDING ja tuotanto-AI OFF pysyvät muuttumattomina.


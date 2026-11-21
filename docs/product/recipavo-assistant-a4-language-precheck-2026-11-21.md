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

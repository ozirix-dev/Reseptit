# Chat 3 – kymmenen kastikekuvan sisältökatselmointi

**Päivä:** 22.11.2026  
**Omistaja:** Chat 3 / Kokki-3  
**PR:** #808, `chat3/suomalaiset-kastikkeet-20261121`  
**Menetelmä:** avattu jokainen PR:n kymmenestä nykyisestä Git-versionhallinnan WebP-kuvasta ja verrattu **silmin** vastaavan FI-reseptin nimi-, aines-, valmistus- ja alt-kuvaukseen. Tarkistus koskee kuvan **näkyvää ruokalajivastaavuutta**, ei kuvan tekijänoikeuksien tai lisenssin juridista tarkastusta, koekeittiössä valmistamista tai valmiin ruokatuotteen todentamista.

| recipe_id | Kuvan SHA-256, alku (tracked overlay) | Sisältötarkistus | Perustelu |
| --- | --- | --- | --- |
| `perinteinen-ruskea-kastike` | `d10b6a2136d4` | VISUAL_OK | Kiiltävä ruskea kastike kastikekannussa; perunamuusi ja lihapullat taustalla ovat käyttökonteksti. |
| `kermainen-tillikastike` | `53fb624ccf1e` | VISUAL_OK | Vaalea kylmää maitopohjaista kastiketta muistuttava kastike, pinnalla tilliä; vastaa ainesosaa. |
| `kantarellikastike` | `d1f220d63ec7` | VISUAL_OK_WITH_SAFETY_NOTE | Kermainen kastike, keltaisia kantarellia muistuttavia sieniä ja persiljaa; kuvaa **ei saa käyttää sienten tunnistamiseen**. |
| `sinappikastike-joulukinkulle` | `b7f1990471cf` | VISUAL_OK | Kullanruskea sinappikastike, kokonaisia sinapinsiemeniä vastaavaa tekstuuria; reseptissä kokojyväsinappia. |
| `kylma-piparjuurikastike` | `843ae30ce36f` | VISUAL_OK_WITH_NOTE | Vaalea yrttinen kastike, raastetta päällä; raasteen tarkkaa kasvilajia ei voi vahvistaa kuvasta. Yleisvaikutelma vastaa piparjuuri–crème fraîche -kastiketta. |
| `perinteinen-munakastike` | `fca180045177` | VISUAL_OK | Vaalean keltainen kastike, paloiteltua kananmunaa ja tilliä. |
| `kermainen-pippurikastike` | `7530d5d848f8` | VISUAL_OK_WITH_NOTE | Rusehtava kermakastike ja mustapippurirouhetta; pinnan kokonaiset pippurit ovat koristeita, eivät reseptiin lisätty erillinen ainesosa. |
| `perinteinen-valkokastike` | `f63621c81f1e` | **REPLACE_REQUIRED** | Kuvassa selvästi vihreitä ruohosipulin paloja ja vihreää yrttisyyttä myös kastikkeen sisällä sekä epätasaista koostumusta. FI-reseptin kuusi ainesosaa ovat täysmaito, voi, vehnäjauhot, suola, valkopippuri ja muskottipähkinä; yrttiä tai muita paloja ei käytetä. Alt-teksti kertoo koristeesta, mutta näkyvä kastike muistuttaa yrtti-/sekoitekastiketta eikä yksinkertaista sileää maitokastiketta. |
| `puolukkakastike-jalkiruokiin` | `b527be8119cb` | VISUAL_OK | Tummanpunainen marjakastike, kokonaisia puolukoita; vastaa siivilöimätöntä reseptiä. |
| `perinteinen-vaniljakastike` | `6508c960e485` | VISUAL_OK | Vaaleankeltainen sileä kastike ja taustalla marjapiirakka; korvaa aiemman virheellisen yrttikuvan. |

**Lopputulos:** 9/10 kuvaa läpäisee Chat 3:n rajatun ruokalajivastaavuuden **silmämääräisen** tarkistuksen; `perinteinen-valkokastike.webp` on `REPLACE_REQUIRED`. Tämä ei väitä kaikkien yhdeksän kuvan olevan lopullisesti riippumattoman tarkastajan, ImageAssets-omistajan, lähde-/lisenssiprosessin tai julkaisuputken hyväksymiä.

**Korjausvaatimus valkokastikkeelle:** Luo ja tallenna uusi WebP-kuva, joka esittää *vain sileää, tasaisen valkoista tai vaaleaa maitokastiketta* neutraalissa kastikekannussa tai kulhossa, **ei ruohosipulia, tilliä, persiljaa, sipulia, vihreitä pilkkuja, munanpaloja eikä näkyviä kokkareita**. Tarkista uusi kuvasisältö, 960 × 640 -mitat, sen SHA-256, neljän kieliversion alt-tekstit, image overlay/manifestit ja reseptikohtainen katselmointitietue yhteen sovitetusti. Älä muokkaa muiden chattien omistamia PR:iä.

**Julkaisuportti:** kaikki 10 reseptiä sekä käännökset edelleen `status: draft`, PR #808 Draft/HOLD. Tämä tarkistus ei poista ravinto-, GK-, semantiikka-, CI- eikä Repo Guardin Ready/merge-/Cloudflare-portteja.

## Reseptin SHA-256-sidosten erillinen tarkistus

22.11.2026 Chat 3 haki jokaisen kymmenen FI-reseptin sisällön ja siihen liittyvän `docs/reviews/new-recipes/<recipe_id>.json`-tietueen samalta PR:n tarkistetulta HEADilta `2f371948974eea9a702f6b97b3b146f0d95a6801`. Raakatekstin UTF-8 SHA-256 laskettiin erikseen ja verrattiin `source_sha256`-kenttään. SHA-256-toteutuksen tunnettu `abc`-testivektori täsmäsi. **Tulos 10/10 MATCH**, mukaan lukien neljä laskettua ja kuusi ravintosisältönsä osalta keskeneräistä reseptiä.

Tämä on reseptilähteiden **sisällön eheystarkistus**, ei `nutrition_input_hash`-tiivisteiden tai kaikkien EN/SV/TH-semanttisten tiivisteiden varmennus eikä CI:n korvike. Katselmointitiedostoissa `decision: hold` säilyy jokaisella reseptillä.

## Korvaus 22.11.2026 – Chat 3

Aiempi `perinteinen-valkokastike.webp` (SHA-256 `f63621c81f1e765399a9b198d72a3c1bc9ec0cf4aa8b876e851a2be16490ea78`) on korvattu samalla polulla uudella AI-havainnekuvalla sileästä valkoisesta maitokastikkeesta valkoisessa kastikekannussa. Yrtit ja vihreät pilkut ovat poissa. Korvaavan kuvan mitat 960 × 640, koko **6 942 tavua**, SHA-256 `612027ba5e5b482ce1540b9ad717875b612f0ada062fff7c40a8d6f2dc9d6b0e`. Uusi kuva on vahvasti pakattu WebP-havainnekuva; mahdollinen pakkauslaadun parannus kuuluu erilliseen kuvan laatukatselmointiin. Neljän kielen alt-tekstit ja kuvan metatiedot on synkronoitu, mutta lopullinen kuvan julkaisu- ja laatuhyväksyntä on **avoin**. `status: draft` ja `decision: hold` pysyvät.

## Uudelleenpakattu valkokastikkeen kuva – Chat 3, 22.11.2026

- Aiemman kuvasisällöllisesti oikean mutta liian pikselöityneen 6 942 tavun WebP:n tilalle tuotiin täsmälleen alkuperäisinä tavuina uusi **43 930 tavun**, **960 × 640** WebP samaan polkuun `kuvat/alkuruoat/perinteinen-valkokastike.webp`.
- Uusi SHA-256: `792ebe46aebc4ea49ce7865edc7a7502e73e2882c518fb75b10ed430c35d1b58`; Git-blob: `28e55cac5e014c683dd0f3c8f29fa4436271258d`. Varmennetun paikallisen tiedoston ja GitHubiin siirretyn Git-blobin tiivisteet täsmäävät. Kuvan tallennussijainti ja `image.src` FI/EN/SV/TH pysyvät ennallaan.
- Chat 3:n suora kuvasisällön ja näkyvän laatueron tarkistus: **PRELIMINARY_VISUAL_QUALITY_OK**. Sileä, vaalea maitokastike valkoisessa kastikekannussa; vihreitä yrttejä tai paakkuja ei näy. Ei väitettä valokuvamaisesta koekeittiötestistä.
- Kuvan lopullinen toimituksellinen, käyttöoikeus-/ImageAssets- ja julkaisuportin hyväksyntä ei valmistunut. Kaikki 10 reseptiä ja PR #808 edelleen **Draft/HOLD**. Vanhat SHA:t raportissa ovat historiallisen kuvan dokumentointia, eivät tämänhetkistä manifestia.

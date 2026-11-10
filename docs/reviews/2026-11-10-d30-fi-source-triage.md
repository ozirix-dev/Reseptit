# D30 – seuraavan 30 aamiaisreseptin lähdekarsinta

**10.11.2026.** SHA-lähtö `ad0b922595aad6d7547fad37bae8c3fc11118f39`; 30 FI-reseptiä valittu niistä 96 aamiaisreseptistä, joilta puuttui koko EN/SV/TH-kielikolmikko tämän kartoituksen aikaan. Ei ole tehty käännöksiä tässä PR:ssä, ei julkaistu uusia kieliversioita, eikä lisätty AI-merkitysevidenssejä ilman käännöstekstiä.

## Oikeellisuus ennen nopeutta

8 ruokalajikohtaisen FI-ohjeen **jatkokatselmointiehdokasta** (24 suunniteltua kieliversiota; ei vielä julkaisulupaa):

- `intialainen-pinaatti-paneer-chilla`
- `japanilainen-dashimaki-tamago-aamiaislautasella`
- `karibia-plantain-aamiaislautanen`
- `lahi-ita-taatelipuuro-tahinilla`
- `pohjoisafrikkalainen-minttutee-kaurapuuro`
- `rahka-marjakerroskulho`
- `uunimuna-avokadot`
- `karibia-johnny-cake`

22 FI-lähteen **SOURCE-HOLD** (66 suunniteltua kieliversiota jää kääntämättä tässä vaiheessa): 

- `intialainen-besan-chilla`
- `intialainen-pesarattu-mungpavuista`
- `japanilainen-hojicha-jogurtti-persimonilla`
- `japanilainen-kabocha-puuro`
- `japanilainen-natto-riisikulho`
- `japanilainen-okayu-umeboshipluumulla`
- `karibia-mango-limejogurtti`
- `kiinalainen-soijamaito-aamiaisella`
- `korealainen-gyeranbap-riisikulho`
- `korealainen-kimchi-jeon-aamiaiseksi`
- `korealainen-mandu-keitto-aamiaiseksi`
- `korealainen-jumeokbap-merilevalla`
- `malesialainen-kookos-banaanikulho`
- `malesialainen-kaya-paahtoleipa`
- `meksikolainen-aamiais-tacot-mustapavuilla`
- `meksikolainen-chilaquiles-verdes`
- `meksikolainen-molletes-pico-de-gallolla`
- `meksikolainen-huevos-divorciados`
- `thai-kananmunat-kookoscurryssa`
- `valimerellinen-halloumi-tomaattileipa`
- `vietnamilainen-kahvijogurtti-banaanilla`
- `vietnamilainen-papaija-kookospuuro`

HOLD-havainnoissa lähdeohjeessa on yleisiä mallitekstejä, kuten kylmän jogurtin yhteydessä käskyjä paistaa proteiinia tai riisi-/munakulhon yhteydessä perusteettomia täytteitä. Näiden automaattinen kääntäminen olisi virheen monistamista. Kahdeksan ensimmäisenkin ainesosien punnitus, annokset, makroarvot, tarkat ajat ja GI/GK-rajat on vielä verrattava alkuperäisiin lähteisiin. Erityisesti `uunimuna-avokadot`-ohjeessa mahdollisesti pois jäävä valkuainen on syytä tarkistaa ravintolaskennan kannalta.

Koko 30 reseptin lähdepolku ja *tarkka Git blob SHA-1* on tallennettu `meta/kaannokset/d30-source-worklist.json`-jonoon. `release_authorized: false` kaikilla riveillä. SHA ei itsessään takaa kokkikelpoisuutta, vain tiedoston version.

## Menettely seuraavaan erään

1. Ota kahdeksan ehdokkaan FI-lähteet kokkikatselmointiin; jos resepti on ristiriitainen, pudota sekin HOLDiin. Korjaa vain oikea lähdevirhe, älä käännä vanhaa.
2. Käytä yleistä SHA-lukittua lähdekarsintaa sekä jo mainissa olevaa `translation-batch-partition.ts`-kohdekieliporttia. Uusi kieliversio ensin Draft, käännösmerkityksen tarkastus kaikilla kielillä ja vasta sitten semanttinen SHA-evidenssi.
3. Tee julkaisu-PR vain hyväksytyistä lähteistä, tavoitellen mahdollisimman suurta *laadullisesti kelvollista* erää. Nolla GK-sinetin ohitusta. Täsmä-HEAD CI SUCCESS, sitten Pages build/deploy.
4. Vanhat C20 HOLDit ovat oma työjononsa; älä sekoita D30:een eikä yhdistä vanhaa C20 Draft #380:aa.

**Evidenssirajat:** tämä on FI-lähdetekstin AI-pikakarsinta, ei riippumatonta kokki-/kielikatselmointia eikä koepaistoa. Luku 90 kuvaa *suunniteltua* EN/SV/TH-parimäärää, ei valmiita käännöksiä. `main`-haaran julkaisusivurekisteriä, ainesmääriä, ravintoarvoja ja GI/GK-lähdesinettejä ei muuteta.

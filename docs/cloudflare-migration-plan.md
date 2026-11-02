# Reseptit: yhteinen Cloudflare-siirtosuunnitelma

Päivä: 2.11.2026. Tila: suunnitelma, ei käyttöönottoa.
Kohde: `ozirix-dev/Reseptit`. Jäädytetty main: `583fdb91aeb12114f909412b9165fc3b02a6515d`.
Työhaara: `codex/cloudflare-images-plan-20261102`.

Tämä suunnitelma yhdistää ravintoarvot, lähteet, reseptikuvat, julkaisemisen ja
palautuksen yhdeksi julkaisuversioksi. Mainista ei löytynyt aiempaa D1/R2-suunnitelmaa;
nykyinen [julkaisuarkkitehtuuri](julkaisuarkkitehtuuri_github_pages.md) kuvaa GitHub Pagesia.
Tämä dokumentti on ehdotus sen Cloudflare-seuraajaksi. Nykyinen julkaisu jatkuu ennallaan.

## 1. Tavoite ja vastuunjako

| Osa | Tehtävä | Julkisuus |
| --- | --- | --- |
| Workers Static Assets | Esirenderöity reseptisivusto, JS/CSS, reittikohtainen julkaisu-JSON, favicon | Julkinen |
| Worker | Rajattu ravintoarvojen luku-API tarvittaessa sekä uuden domainin yhteensopivuusreitit | Vain hyväksytyt julkaisut; hallintakirjoitukset erikseen suojattuja |
| D1 | Versioidut ravintoarvot, lähdetietueet, määritelmät, laskentanäyttöviitteet, resepti–kuva-sidokset ja kuvametatiedot | Ei suoraa selainyhteyttä; rajattu julkaisu-API |
| R2 `reseptit-media` | Julkaisuun hyväksytyt alkuperäiset WebP:t ja niiden optimoidut versiot | Oma kuvadomain ja CDN |
| R2 `reseptit-private-archive` | Alkuperäismasterit, käyttämättömät kuvat, lähdeaineistot, D1-viennit ja palautusmanifestit | Yksityinen, ei kuvadomainia eikä `r2.dev`-julkisuutta |
| Riippumaton kopio | Salattu palautuspaketti ja lähdekuvat Proton-varmistukseen | Yksityinen; avaimet K:-holvissa |

Bucket-nimet ovat ehdotuksia. Domainin omistusta, Cloudflare-tiliä, nykyistä tilausta,
kiintiöiden vapaata osuutta tai DNS:ää ei ole tässä työssä tarkistettu tai muutettu.

```mermaid
flowchart LR
  G[Git: reseptit ja tarkistettu laskenta] --> S[Jäädytetty julkaisu ja manifesti]
  S --> D[(D1: versioidut tiedot ja kuvametatiedot)]
  S --> W[Workers Static Assets]
  S --> R[(R2: julkiset kuvat)]
  W --> C[Käyttäjä]
  R --> CDN[Kuvadomain ja CDN]
  CDN --> C
  D --> E[Julkaisuun sidottu vienti]
  E --> B[(Yksityinen R2: varmuuskopiot ja lähteet)]
  S --> B
  B --> P[Salattu riippumaton kopio]
```

Ensimmäinen vaihe säilyttää Markdown-reseptit Gitissä toimituksellisena lähteenä.
D1 on hyväksyttyjen ravintoarvotietueiden ja lähdeketjujen tietokanta.
Sama tieto ei saa jäädä kahteen riippumattomasti muokattavaan masteriin:
importin ajaksi Git on määräävä, ja mahdollinen myöhempi D1-pohjainen toimitus
vaatii erillisen omistajuuspäätöksen. Kuvien master-tavut siirtyvät myöhemmin R2:een,
mutta paikalliset ja Gitin nykyiset kopiot säilytetään tässä vaiheessa.

## 2. Todennettu kuvainventaario

[Mainin tiedostokohtainen inventaario](cloudflare-migration/images-main-20261102.json)
sisältää jokaisen kuvan polun, tavumäärän, SHA-256:n, pikselimitat ja reseptiviittaukset.
Inventaario perustuu Gitin seuraamiin tiedostoihin ja mainin reseptien frontmatteriin;
se ei ole tuotantopalvelimen etäauditointi.

| Sijainti mainissa | Kuvia | Tavua |
| --- | ---: | ---: |
| `kuvat/aamupalat/` | 150 | 31 306 912 |
| `kuvat/alkuruoat/` | 1 | 175 516 |
| `kuvat/jalkiruoat/` | 16 | 3 004 126 |
| `kuvat/leivonnaiset/` | 5 | 1 145 686 |
| `kuvat/paaruoat/` | 154 | 31 672 380 |
| `kuvat/munakoiso-kesakurpitsalasagne.webp` | 1 | 374 076 |
| **Reseptikuvien lähdehakemisto yhteensä** | **327** | **67 678 696** |
| `reseptit/paaruoat/jauheliha-kaalikeitto-vhh.webp` | 1 | 171 902 |
| `site/public/favicon.svg` | 1 | 185 |
| **Kaikki Gitin seuraamat kuvat** | **329** | **67 850 783** |

327 lähdekuvaa on noin 64,54 MiB. Reseptihakemiston poikkeava WebP mukaan lukien
Gitissä on 328 reseptimediaan liittyvää rasterikuvaa. Kaikki ovat WebP:tä;
favicon on SVG. PNG-, JPEG- tai AVIF-mastereita ei ole tässä main-snapshotissa.
327 lähdekuvan mitat: 190 × 1536×1024, 94 × 1280×853, 40 × 1279×853,
yksi 2200×1053, yksi 1448×1086 ja yksi 1254×1254.

Mainissa on 326 julkaistua suomenkielistä reseptiä ja 119 julkaistua versiota
kullakin kielellä en/sv/th: yhteensä 683 julkaistua reseptiversiota.
Ne viittaavat 325 erilliseen kuvatiedostopolkuun. Puuttuvia `image.src`- tai
historiallisia `image.srcset`-tiedostoja ei löytynyt; jokaisella julkaistulla
reseptiversiolla on kuva. Ilmoitetut pääkuvien pikselimitat täsmäävät tiedostoihin.

### Paikalliset alkuperäiset ja generoidut kopiot

Pelkkä puhdas worktree ei paljasta Gitin ohittamia mastereita. Siksi seuraavat
hakemistot luettiin lisäksi muuttamatta olemassa olevaa checkoutia
`D:/Projects/Products/Reseptit`, jonka HEAD oli `b1c2bd3e036f0a17b3f61a560c39b5df56e1d8d5`.
Tätä eri haaran havaintoa ei sekoiteta mainin lukuihin.

| Paikallinen hakemisto | Kuvia | Tavua | Luonne |
| --- | ---: | ---: | --- |
| `kuvat/` | 327 | 69 838 925 | 326 WebP:tä ja yksi PNG |
| `site/public/kuvat/` | 1166 | 133 532 130 | Aiemmin generoitu julkaisutuloste |
| `site/dist/kuvat/` | 1166 | 133 532 130 | Aiemman buildin kopio |
| `output/` | 0 | 0 | Ei kuvia havaittu |
| `Reseptit-Backup/` | 0 | 0 | Vain varattu varmistuspaikka; ei todistettua varmuuskopiota |

Gitin ulkopuolinen `kuvat/paaruoat/italian-pata.png` on 1536×1024,
2 534 305 tavua, SHA-256
`3e17a936b782e13bced6aaad9f8b91e47f3624694a15beca0fc6f03ed641a66f`.
Se pitää säilyttää yksityisenä masterina ja selvittää sen reseptisidos.
PNG:tä ei korvata WebP:stä takaisin muunnetulla tiedostolla.

[Paikallinen manifesti](cloudflare-migration/images-local-20261102.json) kattaa
näiden kolmen kuvia sisältävän hakemiston 2659 tiedostoa ja 336 903 185 tavua.
Muiden aktiivisten worktreeiden, `tmp/`-suorituskykyaineistojen, selaincachejen,
liitteiden ja koneen muiden hakemistojen kuvat eivät kuulu tähän määrään.
Niiden mahdollisia korkearesoluutioisia mastereita ei ole osoitettu löydetyiksi.
Mainin kuva on tällä hetkellä pienin varmasti säilytettävä alkuperäinen.

## 3. Duplikaatit, käyttämättömät ja sidokset

Mainin 329 kuvatiedoston joukossa on **0 SHA-256-duplikaattiryhmää**.
Tästä ei seuraa, että kuvat olisivat visuaalisesti yksilöllisiä: pikseli- tai
havaintopohjaista samankaltaisuushakua ei tehty.

Paikallisissa lähde- ja tulostehakemistoissa on 1166 duplikaattiryhmää,
1168 erillistä SHA-256-sisältöä ja 200 626 012 tavua toistuvia fyysisiä kopioita.
Ne ovat pääosin odotettuja `public`/`dist`-kopioita ja alkuperäisten julkaisuversioita.
Tämä ei ole poistoehdotus. R2-tuonti käyttää sisältötiivistettä deduplikointiin,
mutta säilyttää kaikki vanhat URL-aliaset ja reseptisidokset.

Nykyisiin reseptimetatietoihin viittaamattomat lähteet:

- `kuvat/paaruoat/khao-soi-vhh-konjac.webp`: aiempi kuva; erillinen
  [muokkausmerkintä](review/khao-soi-image-v2.json) kertoo alkuperäisen säilyttämisestä.
- `kuvat/paaruoat/shoyu-kanakeitto-konjac.webp`: nykyisissä viittauksissa käyttämätön.
- `reseptit/paaruoat/jauheliha-kaalikeitto-vhh.webp`: ei pääkuvaviittausta;
  poikkeava tallennuspaikka. Säilytetään ja luokitellaan ennen mahdollista siirtoa.

"Käyttämätön" tarkoittaa tässä nykyisten reseptien frontmatter-viittausten puutetta.
Historialliset URL:t, aiemmat julkaisut ja toimituksellinen käyttö voivat silti tarvita
kuvaa. Yksikään näistä tiedostoista ei poistu automaattisesti.

`shoyu-kanakeitto-konjac` ja `vietnamilainen-pho-ga-aamuksi` jakavat mainissa polun
`kuvat/aamupalat/vietnamilainen-pho-ga-aamuksi.webp`. Tämä on kaksi reseptisidosta
samaan tiedostoon, ei kaksi SHA-duplikaattitiedostoa. Sisällöllinen sopivuus
molemmille resepteille on tarkistettava; tässä työssä sidosta ei muuteta.
Käännökset jakavat fyysisen kuvan, mutta niille säilytetään kielikohtainen alt-teksti.

Paikallinen varianttimanifesti sisältää 325 lähdettä ja 841 varianttia.
Kaikkien lähdetiivisteet vastaavat mainista löytyvää tiedostoa, mutta reseptien
käyttämä polkujoukko eroaa: vanha tuloste sisältää shoyu-kuvan ja siitä puuttuu
juuritason munakoiso-kesakurpitsalasagne. Tulostetta ei hyväksytä sellaisenaan
uudeksi julkaisuksi. Mainin 325 käytetystä lähteestä syntyisi nykyisillä
leveyssäännöillä myös 841 varianttia; tavumäärää ei ole mitattu uudella generoinnilla.

## 4. Alkuperäiset ja optimoidut kuvat R2:ssa

Säilytetään [nykyinen kuvaputki](responsive-images.md): Sharp 0.35.5,
WebP quality 78, effort 4, leveydet 480/960/1440 vain lähdettä pienempinä,
ei rajausta eikä suurennusta. Alkuperäinen kopioidaan tavutasolla muuttumattomana.
Työtä ei aloiteta uudella AVIF-/JPEG-rinnakkaisputkella; mahdollinen myöhempi
formaattivertailu on erillinen päätös.

| Objektiperhe, ehdotus | Sisältö |
| --- | --- |
| Julkinen `originals/<source-sha256>.webp` | Vain julkaisuun hyväksytty, nykyinen alkuperäinen WebP |
| Julkinen `_variants/<encoder-key>-<width>w.webp` | Nykyisen algoritmin nimellä ja todistetulla tuloste-SHA:lla tuotetut versiot |
| Julkinen `releases/<release-id>/images.json` | Vain julkinen polku-, mitta-, koko- ja URL-manifesti |
| Yksityinen `masters/<sha256>.<ext>` | PNG-masterit sekä säilytettävät käyttämättömät ja epäselvän oikeustilan lähteet |
| Yksityinen `source-evidence/<source-id>/<sha256>.<ext>` | Käyttöehtojen sallimat lähdeaineistot ja lisenssinäyttö |

Samasta lähteestä luodut variantit sidotaan lähde-SHA:han, encoder-asetuksiin sekä
Sharp/libvips/WebP-versioihin kuten nykyisessä putkessa. Tiedoston nimeen sisältyvä
lyhennetty encoder-avain ei korvaa täyttä tulosteen SHA-256:ta. Mahdollinen nimikollisio
pysäyttää tuonnin. Sama SHA saa yhden sisältöobjektin ja useita viittauksia.

Kaikkien 327 lähdekuvan ja poikkeavan WebP:n tavut säilytetään, myös silloin kun
vain 325 lähdettä kuuluu julkiseen julkaisuun. Korkearesoluutioinen master ja
julkaisuoriginaali ovat eri käsitteet. Julkiseen buckettiin ei sijoiteta
julkaisemattomia raakatiedostoja tai oikeuksiltaan selvittämättömiä mastereita.
Käyttöliittymän annoskertoimet eivät synnytä uusia kuvia tai kopioita.

## 5. D1: ravintoarvot ja kuvametatiedot samassa versiomallissa

Skeemaehdotus, ei ajettu SQL-migraatio:

| Taulu | Keskeiset tiedot ja eheys |
| --- | --- |
| `release` | `release_id`, Git-SHA, malliversio, input-/manifesti-SHA, `prepared/verified/published` |
| `recipe_version` | `recipe_id`, sisältöhash, annosmäärä, kieli, reseptipolku, julkaisuversio |
| `nutrition_source` | Virallinen lähde, julkaisuversio, tietuetunniste, hakuaika, lisenssi ja todistusaineiston hash/avain |
| `nutrient_observation` | Ravintotekijä, raaka-arvo tekstinä, yksikkö, painoperusta, valmistustila, määritelmä, lähde ja arvon tila |
| `calculation` / `calculation_ingredient` | Reseptin input-hash, ainesosat, massat, muunnosnäyttö, menetelmä ja hyväksytty tulos; muuttumaton jälki |
| `image_asset` | `asset_id`, alkuperäisen SHA-256 UNIQUE, MIME, leveys/korkeus/tavut, R2-avain, master-viite, alkuperä/oikeustila |
| `image_variant` | Lähdeasset, variantin SHA-256, leveys/korkeus/tavut, formaatti, encoder-versiot ja objektin avain |
| `recipe_image` | Reseptiversio + asset + rooli/järjestys, kielikohtainen alt-teksti; jakaminen sallitaan |
| `image_url_alias` | Vanha host/polku, julkaisuversio, kohdeasset/-variantti; ristiriitainen alias estää julkaisun |
| `backup_catalog` | Julkaisu, D1-bookmark/vienti-SHA, media-/lähdemanifesti ja palautuskokeen tila |

Reseptin tunniste ei riipu otsikosta, kategoriasta, URL-slugista tai kuvatiedoston
nimestä. `recipe_image` viittaa täsmälliseen reseptiversioon; kuvan vaihto ei muuta
vanhaa sidosta jälkikäteen. R2-avaimet eivät sisällä allekirjoitettuja URL:eja tai
salaisuuksia. FK:t ja indeksit vähintään julkaisuun, resepti-id:hen, lähdetietueeseen
sekä kuvien SHA:han ja aliaspolkuun.

Ravintoarvoissa säilytetään erikseen lähteen ilmoittama nolla, mittaamatta jäänyt
komponentti, tietokannasta puuttuva komponentti, jälkiarvo, raja-arvo ja laskettu
arvio. `NULL` ei muutu nollaksi. Hiilihydraatin, kuidun ja polyolien määritelmät
sekä muunnos säilyvät tietuetasolla. Valmiiksi hyväksytty laskentanäyttö sidotaan
reseptin ainesosa-/annoshashiin. SOURCE-01:n tutkimustietueita tai keskeneräisiä
GK80-ehdotuksia ei tuoda hyväksyttyinä tuotantoarvoina.

Mainin `docs/nutrition/` sisältää 383 JSON-tiedostoa, 71 755 421 tavua;
`calculations/` sisältää 207 tiedostoa. Nämä eivät ole D1:n mitattu koko eivätkä
383 aktiivista lähdetaulua. Historialliset raportit ja isot todistusaineistot
arkistoidaan yksityiseen R2:een. D1:een normalisoidaan vain rajattu, nimetty julkaisu.
D1:n riviraja on 2 MB, joten suuria laskentapaketteja ei tungeta yhteen BLOB-riviin.
[Viralliset D1-rajat](https://developers.cloudflare.com/d1/platform/limits/).

Julkinen staattinen sivusto rakennetaan hyväksytystä D1-snapshotista, ja tulos
sisältää ravintoarvot sekä kuvaosoitteet HTML:ssä ja reitti-JSONissa. Jokainen
sivun- tai kuvanlataus ei tee D1-kyselyä. Mahdollinen luku-API rajataan julkaistuun
release-id:hen. Hallinta ei saa avata julkista SQL- tai kirjoitusrajapintaa.

## 6. URL-yhteensopivuus, oma domain ja välimuisti

Ehdotettu kuvahost on `kuvat.<sivuston-oma-domain>`; täsmällinen domain valitaan
ennen käyttöönottoa. Se liitetään R2:n Custom Domains -toiminnolla omassa
Cloudflare-tilissä hallittuun zoneen. `r2.dev` ei ole tuotanto-CDN eikä sen eteen
tehdä omaa CNAME-kiertoa. Julkinen oma domain mahdollistaa CDN-välimuistin;
yksityisellä arkistobucketilla ei ole mitään julkista osoitetta.
[Cloudflaren R2-domain-ohje](https://developers.cloudflare.com/r2/buckets/public-buckets/).

| Osoiteperhe | Yhteensopivuusratkaisu |
| --- | --- |
| Nykyinen `https://ozirix-dev.github.io/Reseptit/kuvat/<polku>` | GitHubin nykyiset tiedostot säilyvät. Cloudflare ei hallitse `github.io`-hostia eikä voi tehdä siihen redirectiä. Myöhempi GitHub-puolen muutos olisi erillinen julkaisu. |
| Uuden sivuhostin `/Reseptit/kuvat/<polku>` ja tarvittaessa `/kuvat/<polku>` | Täsmällinen, versioitu alias -> julkinen R2-kuva. Ensin lyhytikäinen 302/307 pilotissa; pysyvä 301/308 vasta URL-sopimuksen hyväksymisen jälkeen. |
| Uuden sisällön `src`, `srcset`, preload, OG-kuva, JSON-LD | Suoraan samaan kuvadomainiin ja julkaisuun sidottuihin objektiavaimiin. |
| Historialliset `_variants/<key>-<width>w.webp` | Säilytetään todistetut vanhat tavut ja avaimet. Uudella encoderilla ei kirjoiteta eri tavuja vanhan avaimen alle. |

`image.src` voi säilyä reseptin suhteellisena lähdepolkuna: buildin resolveri käyttää
D1:n hyväksyttyä resepti–asset-sidosta. Vite-base `/Reseptit/` ja nykyinen
kovakoodattu `baseUrl` tiedostossa `site/scripts/build-content.ts` on myöhemmin
parametrisoitava sivuhostille ja kuvahostille. Pelkkä DNS-siirto ei korjaa HTML:n,
canonicalien, hreflangien, preloadien tai JSON-LD:n vanhoja absoluuttisia osoitteita.
Ensimmäinen pilotointi säilyttää sivupolut `/Reseptit/`-alkuisina.

Cache-sopimus: hash-nimetyille kuville `Cache-Control: public, max-age=31536000,
immutable`; muuttuville alias- ja manifestiosoittimille lyhyt TTL, esimerkiksi
300 s. Manifestin versioitu sisältö voi olla immutable. Asetetaan oikea MIME,
`Content-Length`, `ETag`/ehdollinen GET sekä `Last-Modified`; ETag ei ole
SHA-256-todiste, erityisesti multipart-tuonneissa. Sallitaan julkiseen jakeluun
GET/HEAD, ei selaimesta anonyymejä kirjoituksia. CORS avataan vain tarvittaville
sivuhosteille ja käyttötavoille, esimerkiksi canvas-käsittelylle.

CDN-säännöt kohdistetaan kuvahostiin ja hyväksyttyihin polkuihin. Private-arkistoa,
virhevastauksia tai hallinta-API:a ei oteta yleiseen Cache Everything -sääntöön.
Sisältöosoitteinen uusi versio ei tarvitse vanhan avaimen korvausta tai laajaa
cache-purgea. Oikeuspoistoissa varaudutaan täsmälliseen CDN-purgeen ja aliaseston
julkaisuun; immutable-selaimessa jo olevaa kopiota ei voida vetää takaisin.

Static Assets palvelee sivut suoraan. Worker-first rajataan `/api/*`- ja
kuvayhteensopivuuspolkuihin; sitä ei kytketä kaikelle liikenteelle. Tuntematon
resepti-/kuvapolku palauttaa aidon 404:n, ei SPA:n 200-kuvavastausta.
[Reititysmalli](https://developers.cloudflare.com/workers/static-assets/routing/advanced/),
[staattisen jakelun laskutus](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/).

## 7. Alkuperä ja käyttöoikeudet

327 mainin lähdekuvassa ei löytynyt EXIF-tekijä-/lisenssimetaa. WebP:n mukana olevat
`background`/`loop`-tiedot eivät ole käyttöoikeusnäyttöä.
[15 korjauksen manifestissa](reports/2026-10-22-v1-4-image-corrections.json) on
kuvakohtaista alkuperä-/muokkausjälkeä, ja kaikkien 15:n nykyinen SHA vastaa
manifestia. Khao soi -muokkauksesta on erillinen prompti-/työkalumerkintä.
[Thai-kuvien raportti](reports/2026-10-21-thai-recipes.md) kertoo kymmenen kuvan
imagegen-tuotannosta, mutta yleinen raportti ei yksin todista jokaisen nykyisen
kuvan lupaketjua.

Näistä havainnoista ei tehdä yleistä väitettä "kaikki kuvat ovat omia" tai
"kaikki ovat kaupallisesti uudelleenkäytettäviä". Muokkausmanifesti osoittaa
provenienssia, ei itsessään muodollista lisenssiä. Myöskään tiedoston sijainti
Gitissä tai EXIF:n puuttuminen ei ratkaise oikeuksia.

Kuvarekisteriin tarvitaan `origin_kind` (oma valokuva / generoitu / ulkopuolinen /
tuntematon), tekijä/oikeudenhaltija, lähde-URL tai generation-id, tuotantoaika,
alkuperäisen hash, muokkausketju, lisenssin tunniste/versio ja näyttöviite,
kaupallisen käytön ja muokkaamisen sallinta, vaadittu attribuutio,
`rights_status`, tarkistaja ja tarkistuspäivä. Tuntematon tallennetaan
tuntemattomana. Alt-teksti on kieli- ja reseptikontekstin tietoa, ei masterin
tekijänoikeuskenttä.

Ennen uuden julkisen median julkaisua oikeustiedot selvitetään tai omistaja
kirjaa todennettavan oikeusvakuutuksen. Julkaisun kuvasisällön vastaavuus reseptiin
on erillinen tarkistus. Yksityisessä arkistossakin lähdeaineiston tallentamisen ja
säilyttämisen on oltava sen käyttöehtojen sallimaa. K:-holvin salaisuuksia ei
kopioida julkiseen mediaan, D1:n julkisiin vientiriveihin tai dokumentaatioon.

## 8. Toistettava siirto ja julkaisu ilman ristiriitaista välitilaa

| Vaihe | Toimenpide myöhemmin | Valmistumisen näyttö |
| --- | --- | --- |
| 0: jäädytys | Nimetään main-SHA ja uusi release-id; inventoidaan uudelleen hyväksytty main | Input-tiedostojen SHA:t, oikeustila, reseptit ja kuvat nimetty |
| 1: paikallinen valmistelu | Luodaan D1-tuonti ja media-/aliasmanifesti eristettyyn stagingiin | Ei puuttuvia sidoksia; ei nollaistettuja NULL-arvoja; versioidut encoder-asetukset |
| 2: yksityinen varmistus | Tallennetaan alkuperäiset ja lähdenäyttö, D1-tuontipaketti sekä manifesti yksityiseen arkistoon | SHA-tarkistetut objektit ja riippumaton palautuskopio |
| 3: media-pilotti | Siirretään pieni hyväksytty otos: tavallinen kuva, suuri kuva, jaettu kuva, vanha alias, PNG-master vain yksityiseksi | Täydet read-back-SHA:t, MIME/mitat, molempien bucketien julkisuus todettu |
| 4: koko media | Manifestin ohjaama tuonti vain puuttuviin sisältöavaimiin, rajattu rinnakkaisuus ja retry | Jokainen objekti ladattu takaisin ja verrattu odotettuun SHA:han; loki ja erä-id |
| 5: D1 ja static staging | Tuodaan immutable release-rivit; rakennetaan sivusto samasta hyväksytystä snapshotista | Tulosarvot ja evidenssi ennallaan, kaikki HTML/JSON/kuva-URL:t saman release-id:n mukaisia |
| 6: julkaisu | Hyväksytään preview ja muutetaan vasta sitten Worker-versio sekä domain-/liikennekytkentä | Julkaisumanifesti lukittu; vanha julkaisu palautettavissa |
| 7: seuranta | Tarkistetaan 404:t, CDN-hitit, R2-operaatiot, D1-rivit ja kustannukset | Sovittu seuranta-aika ja palautuskriteerit |

Siirtoskripti lukee vain eksplisiittisen manifestin. Ei `sync --delete`-ajoa,
ei hakemistosta pääteltyä tuontia eikä olemassa olevan eri-SHA-objektin korvausta.
Sama erä voidaan ajaa uudelleen: HEAD/list kertoo ehdokkaat, mutta hyväksyntä
edellyttää checksum-todistetta. Pienille kuville riittää yksittäinen PUT;
suurissa arkistopaketeissa käytetään tarvittaessa hallittua multipart-jatkamista.
[Cloudflaren upload-ohje](https://developers.cloudflare.com/r2/objects/upload-objects/).

R2:n ja D1:n välillä ei ole yhtä yhteistä transaktiota. Siksi objektit ja
`prepared`-julkaisu rakennetaan ensin, media tarkistetaan, ja julkaisumanifesti
sinetöidään vasta kun kaikki riippuvuudet ovat olemassa. Worker-julkaisu sisältää
release-id:n: D1:n erillisen "uusin"-osoittimen muutos ei saa vaihtaa vanhan HTML:n
ravintoarvoja tai kuvasidoksia. R2-avaimia ja vanhoja release-rivejä ei poisteta
rollback-ikkunan aikana. D1-skeema muuttuu tarvittaessa lisäävästi niin, että myös
edellinen Worker-versio pystyy lukemaan omaa julkaisuaan.

SOURCE-01- ja GK80-työpuut eivät ole tuontilähteitä. Tämä suunnitelma ei muuta
niiden reseptejä, lähderekistereitä, laskentamoottoria tai PR-haaroja. Käyttöönotto
odottaa erikseen hyväksyttyä yhteistä main-snapshotia; tässä dokumentissa esitetyt
kuvamäärät lasketaan silloin uudelleen. Tuotantokytkentää tai siirtoa ei ole
valtuutettu tällä suunnittelupyynnöllä.

## 9. Varmuuskopiot ja palautus

Yksityiseen R2-buckettiin tallennetaan D1:n looginen vienti, julkaisumanifesti,
kaikki sen viittaamat kuvat/masterit ja sallitut lähdeaineistot. Sisältöosoitteiset
kuvat säilytetään kerran kutakin SHA:ta kohti; päivittäinen manifesti ei kopioi
koko kuvakirjastoa uudelleen. Ehdotettu säilytys: päiväviennit 30 vrk,
viikkoviennit 8 viikkoa ja kuukausiviennit 12 kuukautta. Vähintään yksi
ennen-siirtoa-paketti säilytetään erikseen pysyvänä.

Objekteja ei vanhenneta ennen kuin kaikki niitä käyttävät säilytettävät
manifestit ovat poistokelpoisia. Lifecycle ei saa poistaa mastereita pelkän
objektin iän perusteella. Tarvittaessa käytetään prefix-kohtaisia R2 Bucket Lock
-sääntöjä; lukituksen pysyvyys ja lifecycle-yhteensopivuus tarkistetaan ennen
käyttöönottoa. Suunnitelma ei perusta palautusta oletettuun S3-versionointiin.
[Bucket Lock](https://developers.cloudflare.com/r2/buckets/bucket-locks/).

D1 Time Travel antaa lisäksi Free-tilauksessa 7 vrk ja Paid-tilauksessa 30 vrk
palautusikkunan. Se ei korvaa yksityistä vientiä tai R2-kuvavarmistusta.
Palautettava kokonaisuus valitaan release-id:llä, ja D1:n bookmark sekä
kuvamanifestin SHA kirjataan samaan palautusluetteloon.
[Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/).

Ehdotettu palvelutavoite: normaali varmistus RPO enintään 24 h ja erillinen vienti
ennen jokaista siirtomigraatiota; RTO enintään 4 h ensimmäisen onnistuneen
palautusharjoituksen jälkeen. Nämä ovat tavoitteita, eivät mitattuja lupauksia.
Palautusharjoitus tehdään erilliseen testiympäristöön: tuodaan D1-vienti,
palautetaan manifestin tarvitsemat SHA-objektit, lasketaan hashit uudelleen ja
avataan pieni sovittu reseptiotos. Vasta todistettu palautus merkitään onnistuneeksi.

Erillisen bucketin käyttö saman Cloudflare-tilin sisällä ei suojaa tilin
menetykseltä. Siksi salattu riippumaton Proton-kopio ja testattu purkuavain
kuuluvat samaan suunnitelmaan. Julkisen sivuston Workerilla ei ole kirjoitus-
tai arkistobindingiä; varmistus- ja siirtotunnukset rajataan eri tehtäviin.
Nykyinen tyhjä `Reseptit-Backup`-paikka ei ole todiste toimivasta varmistuksesta.

## 10. Käyttömäärä ja kustannusarvio

Hinnat tarkistettu Cloudflaren virallisista lähteistä 2.11.2026, USD ennen veroja.
Tilin muiden projektien kulutus pienentää yhteistä vapaata kiintiötä; nykyistä
käyttödataa tai tilin laskutusta ei luettu. Alla ovat skenaariot, eivät liikenne-ennuste.

R2 Standard: 10 GB-month, 1 M Class A- ja 10 M Class B -operaatiota/kk sisältyy
vapaaseen osuuteen. Ylittävä tallennus $0,015/GB-month, A $4,50/M,
B $0,36/M; Internet-egress $0. Laskutusyksiköt pyöristyvät ylöspäin.
Infrequent Accessiin ei sovelleta samaa vapaata osuutta ja siitä tulee
hakukustannus, joten näin pieni kirjasto aloittaa Standardissa.
[R2-hinnasto](https://developers.cloudflare.com/r2/pricing/).

Mainin lähteet 0,0677 GB; paikallisen vanhan varianttiaineiston 0,0664 GB perusteella
julkisen kuvajulkaisun alustava budjetti on **alle 0,2 GB**. Varianttien tarkka
koko mitataan staging-generoinnissa. Yhden tuonnin noin 1166 julkaisuobjektia
ja masterit jäävät kauas miljoonasta kirjoitusoperaatiosta; varmennusluvut ja
listauspyynnöt lasketaan silti mukaan. Yksityisen arkiston budjettiin varataan
aluksi esimerkiksi 1 GB lähde- ja masteraineistolle sekä erikseen vientien säilytys.

| Sivulatauksia/kk | Oletus: 5 kuvapyyntöä/sivu | CDN-hit | R2-lukuja/kk | R2 B -lisämaksu, jos koko vapaa osuus käytettävissä |
| ---: | ---: | ---: | ---: | ---: |
| 100 000 | 500 000 | 95 % | 25 000 | $0 |
| 1 000 000 | 5 000 000 | 95 % | 250 000 | $0 |
| 10 000 000 | 50 000 000 | 90 % | 5 000 000 | $0 |
| 10 000 000 | 50 000 000 | 70 % | 15 000 000 | $1,80 |

Kuvaindeksin todellinen pyyntömäärä ja cache-hit mitataan pilotissa.
Kuvapyyntöjen määrä ei ole sama kuin R2-operaatioiden määrä. Suora R2-kuvadomain
välttää Worker-invokaation per kuva; vanhan URL:n Worker-alias voi lisätä niitä.

Workers Static Assetsin suorat asset-pyynnöt ja tallennus ovat maksuttomia.
Workers Paidin lähtöhinta on $5/kk; siihen sisältyy 10 M Worker-pyyntöä ja
30 M CPU-ms/kk, ylitys $0,30/M pyyntöä ja $0,02/M CPU-ms. Free antaa
100 000 Worker-pyyntöä/vrk; sitä ei tulkita samaksi kuin kuukausikiintiö.
Maksettua tilausta ei oteta tässä työssä käyttöön.
[Workers-hinnat](https://developers.cloudflare.com/workers/platform/pricing/),
[Static Assets](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/).

D1 Free: 5 M luettua riviä/vrk, 100 000 kirjoitettua riviä/vrk,
5 GB yhteensä mutta enintään 500 MB/tietokanta. Paid: ensimmäiset 25 mrd
lukua ja 50 M kirjoitusta/kk sekä 5 GB sisältyvät; ylitys $0,001/M lukua,
$1/M kirjoitusta ja $0,75/GB-month. Staattinen julkaisu välttää kyselyn
jokaisella sivulatauksella. Indeksittömän SELECT:n lukemat rivit voivat ylittää
palautettujen rivien määrän.
[D1-hinnasto](https://developers.cloudflare.com/d1/platform/pricing/).

Jos esimerkiksi yhden pakatun D1-viennin koko olisi 0,1 GB, 30 päivä-,
8 viikko- ja 12 kuukausiversiota veisivät noin 5 GB ennen deduplikointia.
Tämä on kapasiteettivaraus, ei mitattu vientikoko. Kuvaversioiden säilyttäminen
kertaalleen välttää kymmenien kuvakirjastokopioiden kasvun. Jos koko R2-kulutus
nousisi 20 GB-monthiin ja vapaat 10 GB olisivat käytettävissä, tallennuksen
lisäosa olisi noin $0,15/kk ennen muita operaatioita.

Pieni staattinen toteutus voi pysyä ilmaisissa kiintiöissä; Paid-vaihtoehdon
perusbudjetti on noin $5/kk ennen ylityksiä ja muita palveluita. Domainin
rekisteröinti, riippumaton varmistustila, lokitus ja mahdolliset maksulliset
CDN-ominaisuudet budjetoidaan erikseen. Cloudflare Imagesin maksullista
muunnospalvelua ei tarvita valmiiksi tuotettujen R2-varianttien jakeluun.
Jos se myöhemmin valitaan, sille tehdään erillinen laskelma.
[Imagesin erillinen hinnasto](https://developers.cloudflare.com/images/pricing/).

## 11. Ensimmäisen toteutuksen rajaus ja avoimet päätökset

Ensimmäinen toteutuserä on julkaisematon pilotti: pieni kuvaotos,
muutama jo hyväksytty ravintoarvolaskelma, molempien bucketien käyttöoikeudet,
yksi D1-vienti ja palautus. Vasta sen jälkeen valmistellaan koko mainin tuonti.
Kuvien oikeudet, jaetun pho/shoyu-kuvan vastaavuus, PNG-masterin yhteys,
sivusto- ja kuvadomain sekä säilytyksen kustannusraja ratkaistaan ennen julkista kytkentää.
Historialliset lisenssiltään rajoitetut ravintolähteet pysyvät erillään
julkisesta manifestista ja API:sta.

Toteutusvaiheen rajatut hyväksyntäehdot: ei puuttuvia kuva-/resepti-/lähdeviitteitä,
SHA- ja mittatäsmäys, alkuperäisten tavujen säilyminen, aito 404,
vanhojen osoitteiden kohtuullinen otos, julkisen/yksityisen pääsyn ero,
saman release-id:n laskentatulokset ja onnistunut palautus. Laajaa
sivustotestiä ei ajeta jokaiselle dataerälle; mahdolliset reititys- tai skeemamuutosten
tarkistukset kohdistetaan muutoksen todelliseen vaikutukseen.

Tässä suunnittelutyössä tehtiin vain tiedostoinventaario, SHA-256-vertailu,
metatietojen ja viittausten tarkistus sekä dokumentaation tarkistus.
Ei kuvien siirtoa tai poistamista, ei varianttien generointia, sivustobuildia,
Cloudflare-resurssia, GitHub Actions -ajoa, mergeä tai deployta.

### Inventaarion toistaminen

Skriptit ovat lukevia apuvälineitä, eivät siirto- tai julkaisukomentoja.
Python tarvitsee PyYAML- ja Pillow-paketit. Tulostus ohjataan ensin scratchiin;
repoon tallentaminen tehdään repo_guardin `write`-operaatiolla.

```powershell
python -X utf8 docs/cloudflare-migration/inventory-images.py <verified-main-worktree> > D:/Temp/images-main.json
python -X utf8 docs/cloudflare-migration/inventory-local-images.py D:/Projects/Products/Reseptit > D:/Temp/images-local.json
```

Suunnitelman työpuu on erillinen
`D:/Projects/tmp/reseptit-cloudflare-images-plan-20261102`. Kaikki tähän suunnitelmaan
kuuluvat muutokset rajoittuvat tähän dokumenttiin ja `docs/cloudflare-migration/`-hakemistoon.

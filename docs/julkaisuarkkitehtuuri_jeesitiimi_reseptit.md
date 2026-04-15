# Julkaisuarkkitehtuuri: jeesitiimi.com/reseptit

## Tarkoitus

Tama dokumentti kuvaa konkreettisen julkaisuarkkitehtuurin `Reseptit`-repolle tilanteessa, jossa:

- `jeesitiimi.com` toimii laajempana hubina useille sisalloille
- reseptit julkaistaan polun `jeesitiimi.com/reseptit` alle
- GitHub toimii edelleen sisallon lahdevarastona
- Cloudflare toimii julkaisu-, reititys- ja mahdollisen hakukerroksen alustana

Tama on toteutussuunnitelma, ei viela varsinainen deploy.

---

## Tiivistelma

Suositeltu ratkaisu on:

- GitHub = kanoninen lahde
- Cloudflare Workers Static Assets = julkaisu- ja reitityskerros
- D1 = rakenteinen metadata ja suodatuskyselyt, jos niille tulee tarve
- KV = kevyt cache valmiille listauksille ja hakemistotuloksille
- R2 = kuvat ja suuremmat media-aineistot
- Vectorize = myohempi semanttinen reseptihaku

Tama on jarkeva malli, koska nykyinen repo on jo vahvasti tiedostolahteinen ja monikielinen. Sita ei kannata siirtaa database-first-malliin liian aikaisin.

---

## Julkaisun perusmalli

Lahde:

- `D:\Projects\Products\Reseptit`
- reseptit Markdown-tiedostoina
- frontmatter tekniselle metadatalle
- kieliversiot omissa hakemistoissaan

Julkaisu:

- yksi Cloudflare Worker palvelee polkua `/reseptit*`
- Worker joko:
  - palvelee valmiiksi generoituja staattisia sivuja, tai
  - lukee buildissa tuotettua JSON- tai HTML-aineistoa ja muodostaa vastaukset sen paalta

Ensivaiheessa jarkevin suunta on staattinen julkaisu Worker Assets -mallilla.

---

## Miksi Workers eika Pages

Nykyisen Cloudflare-dokumentaation mukaan uusille projekteille suositellaan Workers Static Assets -mallia Pagesin sijaan.

Keskeinen syy tahan projektiin:

- sama Worker voi hoitaa staattisen sisallon, reitityksen ja myohemman API-logiikan
- `/reseptit` on helppo liittaa olemassa olevaan hubidomainiin
- samassa sovelluskerroksessa voidaan myohemmin kytkea D1, KV, R2 ja Vectorize

Kaytannon seuraus:

- `jeesitiimi.com` voi toimia yleisena hubina
- `jeesitiimi.com/reseptit` voi olla yksi selkea alireitti
- reseptipalvelu ei tarvitse omaa erillista domainia tai alidomainia alkuun

Viralliset lahteet:

- [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Workers best practices](https://developers.cloudflare.com/workers/best-practices/workers-best-practices/)
- [Migrate from Pages to Workers](https://developers.cloudflare.com/workers/static-assets/migrate-from-pages/)

---

## Suositeltu arkkitehtuuri

```text
GitHub repo (Reseptit)
    ->
build-vaihe
    ->
Cloudflare Worker + Static Assets
    ->
jeesitiimi.com/reseptit
```

Lisapalvelut tarpeen mukaan:

```text
Markdown + frontmatter
    ->
rakenteinen build-data
    ->
D1 / KV / R2 / Vectorize
    ->
Worker-reititys ja kayttoliittyma
```

---

## Roolijako palveluittain

## Workers

Workers on ensisijainen julkaisu- ja reitityskerros.

Sille kuuluu:

- reititys polulle `/reseptit`
- kieliversioiden valinta URL-rakenteen tai kayttoliittyman perusteella
- staattisten tiedostojen tarjoilu
- mahdollinen haku-API myohemmassa vaiheessa
- mahdollinen redirect- ja canonical-logiikka

Workers soveltuu tahan hyvin, koska sama toteutus voi alkaa hyvin kevyena ja kasvaa myohemmin ilman alustavaihdosta.

## D1

D1 ei ole ensivaiheessa pakollinen.

D1 kannattaa lisata vasta, kun halutaan:

- tarkka suodatus tagien, diettiluokan ja paaluokan mukaan
- listausnakyma ilman koko tiedostopuun lukemista buildin ulkopuolella
- hallittu query-kerros resepti-indekseille
- mahdollinen hallintanakyma tai taustatyot

D1:n rooli tahan projektiin olisi:

- resepti-indeksi
- kieliversioiden linkitykset
- julkaisutiedot
- mahdolliset hakutulosten pohjakyselyt

Virallinen lahde:

- [Cloudflare D1 docs](https://developers.cloudflare.com/d1/)

## KV

KV sopii tahan kevyeen valimuistiin.

KV:n mahdolliset kaytot:

- valmiit listanakyma-cachet
- sitemap-cache
- tagi- ja suodatusnakyma-cache
- harvoin muuttuva julkaisumetadata

KV ei ole varsinainen paa-tietokanta tälle sisaltomallille, mutta se on hyodyllinen halpana ja yksinkertaisena julkaisutason cachena.

## R2

R2 kannattaa ottaa kayttoon kuville ja mahdollisille suuremmille tiedostoille.

R2:n rooli:

- reseptikuvat
- mahdolliset vientitiedostot
- myohemmin suuremmat liiteaineistot

Perustelu:

- Markdown-reseptit ovat pieniä ja sopivat hyvin repoon
- kuvat eivat yleensa kuulu samalla tavalla Git-lahteen pitkassa kaytossa
- R2 sopii media-aineistolle luontevammin kuin repo tai D1

## Vectorize

Vectorize kuuluu tahan projektiin vasta myohemmassa vaiheessa.

Sille on luontevia kayttoja:

- semanttinen reseptihaku
- "etsi tata muistuttava resepti"
- luonnollisen kielen haku, esimerkiksi:
  - "haluan lohireseptin ilman kermaa"
  - "etsi makea mutta vhh-ystavallinen iltapala"

Vectorize ei korvaa peruslistauksia tai tavanomaista suodatusta. Se on lisaominaisuus hakua varten.

Virallinen lahde:

- [Cloudflare Vectorize docs](https://developers.cloudflare.com/vectorize/)

---

## Etenemisjarjestys

## Vaihe 1: julkaistava MVP

Ensimmainen toimiva julkaisu kannattaa tehda ilman tietokantaa.

MVP sisaltaa:

- reseptisivut
- kieliversiot
- listaukset paaluokittain
- yksinkertainen navigaatio
- julkaisu polkuun `jeesitiimi.com/reseptit`

Tassa vaiheessa:

- GitHub on lahde
- build tuottaa julkaistavan aineiston
- Worker palvelee staattiset assetit

## Vaihe 2: rakenteinen indeksi

Seuraavassa vaiheessa voidaan lisata buildissa tuotettu resepti-indeksi:

- yksi JSON kaikista resepteista
- kielet, paaluokat, diettiluokat ja tagit mukana

Tama voi riittaa pitkaan ilman D1:ta.

## Vaihe 3: D1 ja cache

Jos reseptimaara kasvaa tai haku/suodatus monimutkaistuu:

- lisaa D1 metadatalle
- lisaa KV cachelle

## Vaihe 4: semanttinen haku

Kun perustason julkaisu toimii:

- lisaa Vectorize
- rakenna erillinen haku- tai suosituspolku

---

## Deploy-polku GitHubista Cloudflareen

Suositeltu deploy-ketju:

1. Sisalto elaa GitHub-repossa.
2. Paamuutokset tehdaan `main`-haaraan hallitusti.
3. Cloudflare Worker deployataan suoraan reposta tai CI-ketjusta.
4. Worker julkaisee uusimman buildin polkuun `/reseptit`.

Kaytannon malli:

```text
GitHub main
    ->
build
    ->
wrangler deploy
    ->
jeesitiimi.com/reseptit
```

Teknisesti mahdollisia deploy-malleja on kaksi:

### Vaihtoehto A

- deploy suoraan paikallisesti `wrangler deploy` -komennolla

Tama on yksinkertainen alkuvaiheessa.

### Vaihtoehto B

- GitHub triggeroi automaattisen deployn Cloudflareen

Tama on parempi, kun julkaisu halutaan vakioida.

Suositus:

- aloita manuaalisella tai puolimanuaalisella deploylla
- siirry automaattiseen deployyn vasta kun julkaisutapa on lukittu

---

## Master prompt deployn apuna

Tahan julkaisutapaan kannattaa liittaa yksi erillinen master prompt, jota kaytetaan deployn ja julkaisuun liittyvien tehtavien ohjauksessa.

Master promptin tarkoitus:

- muistuttaa, etta julkaisutapa on Cloudflare Workers -malli
- estaa harhautuminen Pages-pohjaiseen toteutukseen
- lukita deploy-ketju muotoon GitHub -> build -> Worker -> `jeesitiimi.com/reseptit`
- varmistaa, etta sisaltolahde pysyy Markdown-repossa eika siirry vahingossa toiseen paa-malliin

Master promptiin kannattaa kirjata ainakin:

- julkaisu tapahtuu Workers-mallilla, ei Pages-mallilla
- `jeesitiimi.com` on hubidomain
- reseptit julkaistaan polkuun `/reseptit`
- GitHub on kanoninen sisaltolahde
- deployn ensisijainen kohde on Worker, joka palvelee staattiset assetit ja mahdollisen reitityslogiikan
- D1, KV, R2 ja Vectorize ovat lisaosia, eivat ensivaiheen pakollisia osia

Kaytannon hyoty:

- deploy-paatokset pysyvat johdonmukaisina
- sama ohjaus voidaan kayttaa toistuvissa julkaisu- ja rakennetehtavissa
- julkaisutekniikka ei vaihdu vahingossa keskustelusta toiseen

Tarkea rajaus:

- master prompt toimii deployn apuna
- se ei muuta sita arkkitehtuuripaatoista, etta julkaisu tehdään Workers-mallilla
- tassa suunnitelmassa ei kayteta Pages-mallia ensisijaisena julkaisuratkaisuna

---

## URL-rakenne

Suositeltu ensiversio:

- `jeesitiimi.com/reseptit`
- `jeesitiimi.com/reseptit/alkuruoat`
- `jeesitiimi.com/reseptit/paaruoat`
- `jeesitiimi.com/reseptit/jalkiruoat`

Kielivaihtoehdot voidaan toteuttaa esimerkiksi:

- `jeesitiimi.com/reseptit/fi/...`
- `jeesitiimi.com/reseptit/en/...`
- `jeesitiimi.com/reseptit/sv/...`
- `jeesitiimi.com/reseptit/th/...`

Tai vaihtoehtoisesti:

- suomi oletuskielena ilman etuliitetta
- muut kielet omilla etuliitteillaan

Tama kannattaa paattaa vasta samalla kun julkaisu-UI suunnitellaan.

---

## Mita ei kannata tehda ensimmaisena

Tahan projektiin ei kannata ensivaiheessa:

- siirtaa kaikkea suoraan D1:een
- rakentaa neljaa eri julkaisulogiikkaa eri kielille
- liittaa Vectorizea ennen kuin perusjulkaisu toimii
- tehda liian raskasta import-pipelinea

Perustelu:

- nykyinen tiedostolahde on jo selkea
- suurin arvo syntyy ensin julkaistavasta lukukokemuksesta
- tietokanta ja AI-haku kannattaa lisata vasta todelliseen tarpeeseen

---

## Suositus

Tahan repo- ja domain-malliin jarkein ratkaisu on:

- `jeesitiimi.com/reseptit`
- Cloudflare Workers Static Assets julkaisuun
- GitHub lahteena
- aluksi ilman D1:ta
- R2 kuville tarpeen mukaan
- KV cachelle tarpeen mukaan
- Vectorize vasta myohemmassa haussa

Tama on teknisesti yhtenainen ja kasvaa hallitusti hubidomainin alle.

---

## Seuraava askel

Kun tama suunnitelma hyvaksytaan, seuraava jarkeva tekninen vaihe on:

1. paattaa julkaisutavan MVP:
   - puhtaasti staattinen build
   - vai Worker + kevyt reititys
2. maaritella URL-rakenne kielille
3. suunnitella build-aineisto Markdownista julkaisuformaattiin
4. luoda ensimmainen Worker-pohja polulle `/reseptit`

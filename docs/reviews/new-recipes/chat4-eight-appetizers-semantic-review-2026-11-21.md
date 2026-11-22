# Chat-4 – kahdeksan FI/EN/SV/TH-alkuruoan toimituksellinen ja merkityskatselmointi

Päiväys: 2026-11-21
PR: https://github.com/ozirix-dev/Reseptit/pull/805
Työn omistaja: Chat 4
Lähtö-HEAD: `096ea941f91b9d8a3e52aa218d162141fa3e0f6e`

## Katselmoinnin merkitys

Tässä on **ChatGPT Chat-4:n dokumentoitu toimituksellinen tekstikatselmointi** kahdeksasta suomenkielisestä Draft-reseptistä ja niiden 24 EN/SV/TH-Draft-käännöksestä. Se ei ole riippumattoman henkilön tekemä koekeittiötesti, elintarvikelaboratorion analyysi eikä Codex-työnkulun virallinen merkitystiivistehyväksyntä. Kokonaisuus on edelleen `status: draft`.

Verrattu ainesosien merkitys, olomuodot ja järjestys, punnitut määrät/yksiköt, annokset, ajat, valmistusvaiheet, turvallisuutta koskevat kieltomuodot sekä kalan, sienen ja luonnonkasvin lajien merkitykset. Katselmoitujen Git-blobien SHA:t on lueteltu alla. Aiemman 10/10-rakennetestin PASS yksin ei ole tämän tekstikatselmoinnin peruste.

**Yhteenveto:** kahdeksassa reseptissä ei löytynyt tarkistetusta tekstistä ratkaisemattomia kriittisiä FI→EN/SV/TH-merkitysristiriitoja. Niille annetaan **EDITORIAL_TEXT_REVIEW_PASS**, joka tarkoittaa ainoastaan tämän rajatun Chat-4-katselmoinnin läpäisemistä. Se ei anna `published`-tilan, virallisen `meta/kaannokset/codex-review-evidence.json`-rekisterin eikä PR Ready/merge -portin lupaa.

Julkaisua edeltävät todelliset jäljellä olevat vaatimukset: käyttäjän käyttämien raaka-aineiden tunnistaminen ja noudatettavat pakkausohjeet, mahdolliset itsenäisen reseptisovituksen määrien lisätarkennukset, kuvan toimituksellinen hyväksyntä, edellytetty hyväksyntärekisteri ja täsmä-HEAD-CI. Erityisesti suolasienisalaatissa ei saa korvata rouskun lajikohtaista esikäsittelyä sillä, että resepti näyttää valmistuskelpoiselta.

## Reseptikohtainen vertailu

### Suolasienisalaatti sipulilla (`suolasienisalaatti-sipulilla`)

- Git-blobit: FI `749586554079f9fe4f6df88867bafa1adf2a5a02`, EN `cc4a92a4c6e926254228b3b095516ca76b91bd2c`, SV `7046df80f9a2fb8114beff266bd2f12ddf5c0fbc`, TH `66fc327fce695fac6047d9668a16366af4047038`.
- Merkitysvertailu: EN salted milk-cap, SV riskor ja TH เห็ดมิลค์แคป säilyttävät rouskun lajin, etukäteen tehdyn käsittelyn, liotuksen, 20 minuutin kylmämaustumisen ja korvasienen kiellon. Sipuli, smetana, ranskankerma ja tilli samalla merkityksellä.
- Tulos: **Toimituksellinen rakenne ja turvallisuusmerkitys PASS. Rouskun täsmällistä lajia tai valmisraaka-aineen käsittelyä ei oleteta; ruoan valmistaja tarkistaa ne.**
- Julkaisuun edelleen vaadittu ehto: Käytä varmasti tunnistettua, lajille asianmukaisesti esikäsiteltyä syöntivalmista rouskua. Älä käytä korvasientä.

### Lasimestarin silli (`lasimestarin-silli`)

- Git-blobit: FI `60eb0a2b5724f344dc52df6eafc296c6b6f8550e`, EN `4e8867b8a6c88e022c001246f44f9ff03a4797d9`, SV `6b4e0fd15f8f4074e0165e7a45b45a936740d5ce`, TH `d9739834b9bcd34e3755147a921bf48f0c086c02`.
- Merkitysvertailu: Kaikki kielet kuvaavat valmista maustesillifileetä, 10-prosenttisen etikan laimentamisen osana lientä, täysin jäähtyneen liemen, noin kahden vuorokauden kylmämaustumisen ja nimenomaisen kiellon käsitellä ohjetta raakan kalan säilöntänä.
- Tulos: **Toimituksellinen rakenne ja turvallisuusmerkitys PASS. 2910 min vastaa noin 48 h 30 min.**
- Julkaisuun edelleen vaadittu ehto: Noudata valmiin sillin alkuperäistä viimeistä käyttöpäivää ja säilytyslämpötilaa. Resepti ei pidennä raaka-aineen turvallista säilyvyyttä.

### Uunissa paistetut silakkarullat (`uunissa-paistetut-silakkarullat`)

- Git-blobit: FI `e16391333f108e5beb52055b1baecc3888264292`, EN `18b35364953b13e9285cc1ead5bf05e62cfd05a2`, SV `1d99be3ef0f1aab8104edb1c111c842687f463f2`, TH `8c926f4160c1cdabc9f4a8a39a9c4092e8e1f2a1`.
- Merkitysvertailu: FI/EN/SV/TH: silakka ei vaihdu silliin tai muuhun lajiin, uuni 200 °C, paisto 35–40 min, 65 min kokonaisaika ja vaatimus kypsentää kalat kokonaan. Sinappi-tilli-sipulitäyte, kerma ja annoskoko ovat yhtäpitävät.
- Tulos: **Toimituksellinen rakenne, paisto-ohje ja turvallisuusmerkitys PASS. Kypsyys arvioitava ruoan todellisen paksuuden mukaan.**
- Julkaisuun edelleen vaadittu ehto: Kypsennä kala kauttaaltaan ja huomioi silakan alkuperään liittyvät syöntisuositukset.

### Savupororullat kantarellitäytteellä (`savupororullat-kantarelleilla`)

- Git-blobit: FI `58cab41f538b765c5e99fe2f844cee392c7cdc41`, EN `d2e96ba645493cd56620d72ae0bdd3b8beb694af`, SV `36de849c4b5b6d75590e410bf204e00f84a24ada`, TH `0dbbffba5b707b5e754bca8ee829ffbbe77827`.
- Merkitysvertailu: Kaikki kielet erottavat kypsän, syöntivalmiin savuporon, tunnistetun kantarellin sekä pannulla haihdutetun kosteuden ja jäähdytetyn sienitäytteen ennen rullausta. Cream cheese/färskost/ครีมชีส tarkoittaa tuorejuustoa.
- Tulos: **Toimituksellinen rakenne ja turvallisuusmerkitys PASS. Itsenäistä maku-/rakennetta ei väitetä keittiössä mitatuksi.**
- Julkaisuun edelleen vaadittu ehto: Vain valmis kypsä lihatuote, varmasti tunnistetut ja kypsennetyt sienet sekä kylmäsäilytys.

### Pienet kantarellipiiraat (`pienet-kantarellipiiraat`)

- Git-blobit: FI `2ca17519cfe1fae1d26494cd23eb3d6d521262ca`, EN `d2c8a068e3ec709dcaf22942e70bcc0b06f3ed8a`, SV `7d233628d82e54f13ef16ac9f8751eb2a4f608d4`, TH `ced2ddd0e1c6031c6ffa08e58fe743fbefbf9804`.
- Merkitysvertailu: Kaikki kielet säilyttävät vehnä- ja ruisjauhot, kaksi erillistä voimäärää, veden, 8 vuokaa, 15 min kylmälevon, 200 °C, 8 min esipaiston, 18–22 min täytepaiston ja täytteen hyytymisen.
- Tulos: **Toimituksellinen rakenne ja merkitys PASS. 75 min kokonaisaika perusteltu mutta vuokien koko ja uunikohtainen hyytyminen ovat käyttäjän tarkistettavia.**
- Julkaisuun edelleen vaadittu ehto: Vain tunnistetut ruokasienet; paista kananmunaa sisältävä täyte hyytyneeksi.

### Paahdettu punajuuricarpaccio vuohenjuustolla (`punajuuricarpaccio-vuohenjuustolla`)

- Git-blobit: FI `0bd00536259a4fabb5759b8d7d953f03363ae202`, EN `c54bbe3ee8913ca048e2508f54c75370bf56ef28`, SV `c3a68332a099b2e7580218cc6ddd5fe7378a3a05`, TH `6509c4a1c9871435034e76c8bd31e00530defa9c`.
- Merkitysvertailu: FI/EN/SV/TH: raaka juures paahdetaan 200 °C 45–60 min pehmeäksi, jäähdytetään, kuoritaan ja viipaloidaan; kastikkeessa oliiviöljy, omenaviinietikka ja hunaja. Vuohenjuusto, saksanpähkinät ja timjami pysyvät oikein.
- Tulos: **Toimituksellinen rakenne ja merkitys PASS. Lämpötila ja kypsyys perustuvat juureksen kokoon.**
- Julkaisuun edelleen vaadittu ehto: Maito-/pähkinäallergeenit ja vuohenjuuston pastörointi sekä kylmäsäilytys huomioitava.

### Sillikaviaari ruisnapeilla (`sillikaviaari-ruisnapeilla`)

- Git-blobit: FI `9dcd3e9b6374f816127383b5e300b2b513063667`, EN `a6c35e71d1804efa53550be72ccc7ea758777ce2`, SV `b6341d097a7afe1fd0548a8fdbe171047d86d5d1`, TH `1805fa7621d0f3b6adc2493f5e734a54b0e8d5ea`.
- Merkitysvertailu: Kaikissa kielissä syöntivalmis silli, kovaksi keitetty muna, punasipuli, smetana, ranskankerma, tilli ja sitruunamehu. Tarjoilu lisätään vasta lopuksi ruisnapeille. EN/TH huomauttavat nimen kaviaari olevan ruoan nimi, ei lisättyä mätiä.
- Tulos: **Toimituksellinen rakenne ja turvallisuusmerkitys PASS.**
- Julkaisuun edelleen vaadittu ehto: Vain syöntivalmis silli ja asianmukainen kylmäketju; kala-, muna-, maito- ja ruisallergeenit.

### Pienet nokkosletut puolukoilla (`nokkosletut-puolukoilla`)

- Git-blobit: FI `89633f354a895377addaed67933486bc5d61e95e`, EN `a8f555a2d05371539e2a04bdb70ecb67a19cc35c`, SV `b62dedda93086742185a14df63d73cecd98d8e1c`, TH `8f0cb9dc62b8da3750ff3815056c39cb3d25f86d`.
- Merkitysvertailu: FI/EN/SV/TH sisältävät nuoren tunnistetun nokkosen puhtaalta paikalta, noin 5 min keiton runsaassa vedessä, noin 30 min taikinalevon, molemminpuolisen paiston, ranskankerman ja puolukat. Thain kieli ei sekoita nokkosta pinaattiin.
- Tulos: **Toimituksellinen rakenne ja turvallisuusmerkitys PASS. Nitraattihuomio on läsnä.**
- Julkaisuun edelleen vaadittu ehto: Poimi puhtaalta alueelta, kypsennä lehdet ja noudata pikkulasten nitraattirajoituksia.

## Kahden muun reseptin rajaus

`graavisiika-tillilla` ja `muikunmati-rieskarullat` eivät kuulu tämän kahdeksan reseptin tekstihyväksynnän piiriin. Ne pysyvät tuotekohtaisen näytön puuttuessa **SAFETY_HOLD**. Katso `docs/reviews/new-recipes/chat4-fish-and-roe-safety-evidence-gate-2026-11-21.md`.

## Julkaisupäätös

Kaikki 40 kielitiedostoa jäävät Draft-tilaan. Tämä raportti ei muuta automaattista julkaisuporttia, käännösten SHA-sidottua virallista hyväksyntärekisteriä eikä ravintolaskennan tilaa. Koekeittiökokemusta ei väitetä olevan.

# laskeGK 20 – ChatGPT:n kolmas riippumaton tutkimuserä

**Tila:** RESEARCH HANDOFF / ei GK-julkaisu- eikä lähdehyväksyntää
**Päivä:** 18.11.2026 (Europe/Helsinki)
**Tarkistettu lähderepo:** `ozirix-dev/Reseptit`, `main` `e8ed43ed525a9cb6abbe61b94bc1c036153979c7`
**Verrattu Codex-haara:** [PR #706](https://github.com/ozirix-dev/Reseptit/pull/706), HEAD `655a7a12d5b1edc69e6c5344c1108684bcc29b60`
**Aiemmat ChatGPT-erät:** [#709](https://github.com/ozirix-dev/Reseptit/pull/709) ja [#710](https://github.com/ozirix-dev/Reseptit/pull/710), yhteensä 20 muuta alkuperäisreseptiä.
**Omistajuus:** erillinen ChatGPT:n tutkimushaara, ei kirjoitusoikeutta #706:n työhaaraan eikä sen historiatietojen tai GK-lukujen hyväksyntään.

## Tarkastustapa ja mitä laskelma todistaa

Valittu erä käsittää 20 *uutta*, `status: published` -alkuperäistä FI-reseptiä, jotka löytyvät mainin `docs/nutrition/new-public-gk-pending-sources.json` -rekisteristä. Erä ei sisällä #709:n tai #710:n resepti-identiteettejä, tutkimusannoksia tai erillisversioita. Verrattiin kutakin mainin FI-reseptiin, `docs/nutrition/calculations/<recipe_id>.json`-syötteeseen ja #706:n saman identiteetin `docs/nutrition/gk-reviewed-portions.json`-katselmointitietueeseen.

Annososuus laskettiin lähteen syötteen mukaan: `grammat × CHO/100 g × syötävä osuus × retentio / servings`. `g`-ainekset käytettiin punnittuina; muille vain syötteessä erikseen kirjattu `gramsPerUnit`, ei yleistä tuoteoletusta. #706:n tarkistetuissa whole-carbohydrate-skenaarioissa korvattiin vain `compositionMatches`-rivien nimenomaiset lähteet ja käytettiin `preparationChoices`-varianttia erikseen. Sama ristiinlasku ei ole biologisen GK-ennusteen, lähteen alkuperäisen laboratorion tai käytännön kypsennysretention riippumaton varmistus.

**Inventaarion tulos:** 20 käsiteltyä alkuperäisreseptiä. Kuudessa on mainin FI-lähteessä jo numeerinen annoshiilihydraattiarvio; 13:lle #706:n haarassa on kokonaisen annoksen HH-skenaario ja yhdellä (`taateliketsuppi`) vain rajattu ainesosatieto. Tässä tutkimuksessa **0 uutta hyväksyttyä GK-arvoa, 0 uutta hyväksyttyä sanallista GK-luokkaa ja 0 uutta tuotannossa julkaistua ravintolukua**. Osuus 19/20 kuvaa löydettyjä, ei tässä PR:ssä hyväksyttyjä tai tuotannossa julkaistuja kokonaishiilihydraattitietoja.

## Resepteittäin katselmoitu erä (20/20)

| FI-resepti, alkuperäinen main | Aineslaskun annostulos / tila | Käytännön huomio ja jatko |
| --- | --- | --- |
| [Kaurakeksit](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/jalkiruoat/kaurakeksit.md) | Yksi noin 30 saman kokoisesta lastusta: **8,94 g** HH; sokeri **5,66 g**, kaurahiutaleet **2,80 g**, loput pienempiä osuuksia. #706:n HH-only. | Ilmoita annos **yksi keksi, kun taikina on jaettu 30 osaan**. Eri kokoiseksi jaetuilla tai usealla keksillä määrä muuttuu. Älä päättele kaurapuuron GI:stä valmiin paistetun sokerikeksin GK:ta. |
| [Suklaa-raejuustokakku](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/jalkiruoat/suklaa-raejuustokakku.md) | Yksi neljästä palasta: **16,42 g**; hunaja **12,73 g** (~78 %). #706:n HH-only. | **Hyödyllinen päälähdehuomio:** suuri osa hiilihydraatista tulee ohjeen hunajasta, ei raejuustosta. Kuva tai alkuperäisvideon tumma pohja ei muodosta mukaan laskettavaa keksipohjaa; kyse on julkaistusta pohjattomasta kakusta. |
| [Bataatti-mustikkakakku](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/leivonnaiset/bataatti-mustikkakakku.md) | 1/8: **18,59 g**; uunissa kypsä kuorittu bataatti **10,06 g**, vaahterasiirappi **6,70 g**, mustikat **1,46 g**. #706:n HH-only. | Varmista kypsän bataatin punnittu massa eikä käytetä raakabataatin 100 g -pitoisuutta siihen suoraan. Kokonais-GK puuttuu ilman soveltuvaa GI-näyttöä. |
| [Punajuuri-suklaakakku](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/leivonnaiset/punajuuri-suklaakakku.md) | 1/10: **17,96 g**; hunaja **13,57 g** (~76 %), keitetty punajuuri **2,45 g**, manteli **1,27 g**. #706:n HH-only. | Tärkeä käyttäjäviesti: hunaja on selvästi pääasiallinen HH-lähde. Punajuuri punnitaan keitettynä ja kuorittuna; ei verrata raakaan ostomassaan. |
| [Makea banaanimunakas](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/aamupalat/makea-banaanimunakas.md) | Yksi annos: **32,43 g**; banaani **21,05 g**, hunaja **5,66 g**, pensasmustikat **5,01 g**. #706:n HH-only. | Luku sisältää tarjoillut mustikat ja hunajan. Ilmoita ne laskennan osana, jotta niitä ei lisätä epähuomiossa toistamiseen. Vaniljauute on rajattu alkoholipohjaiseen viitetuotteeseen. |
| [Jäiset banaani-suklaapalat](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/valipalat/jaaiset-banaani-suklaapalat.md) | Mainin nykyinen **13,94 g/1⁄9 levystä**, banaanista **7,02 g** ja suklaasta **5,33 g**. | Pala on noin yhdeksäsosa levystä, ei mitattu vakiokokoinen pala. Tumma suklaa perustuu yleiseen 53,26 g/100 g -koostumukseen. Punnittu omavalintainen suklaa voi poiketa tästä merkittävästi. |
| [Avokado-banaanijäätelö](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/jalkiruoat/avokado-banaanijaatelo.md) | 1/3 erästä: **22,04 g**, banaani **14,03 g**, hunaja **5,66 g**, jogurtti **2,00 g**. #706:n HH-only. | Pakastaminen ei lisää hiilihydraattia; annos koskee kaikkea massaa, ei yhden jäätelöpallon oletuspainoa. Banaanin ja hunajan yhteisosuus noin 89 % HH:sta. |
| [Mustikka-jogurttijäätelö](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/jalkiruoat/mustikka-jogurttijaatelo.md) | 1/4: **15,01 g**, hunaja **8,48 g**, metsämustikka **3,82 g** ja kreikkalainen jogurtti **2,58 g**. #706:n HH-only. | Hunaja tuo yli puolet laskennallisesta HH:sta. Vanhentuva tuotematch tai sokeroitu jogurtti edellyttää lähteen uusimista. |
| [Bataattibrowniet](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/leivonnaiset/bataattibrowniet.md) | 1/9: uunissa kypsällä bataatilla **10,05 g**, suolatta keitetyllä **9,68 g**. #706:n kaksi eri valmistusvaihtoehtoa. | Ero noin 0,37 g/pala, eikä se ole sama asia kuin mitatun valmiin brownien GK-vaihteluväli. Laskenta edellyttää samaa punnittua kypsää kuorittua bataattimassaa. |
| [Bataatti-banaanileipä](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/leivonnaiset/bataatti-banaanileipa.md) | 1/10: **14,14 g** uunibataatilla tai **13,79 g** keitetyllä, #706:n *Callebaut 811* -skenaariolla. | **Tuoterajaus säilytettävä näkyvänä:** 80 g Callebaut 811 -suklaahippuja antaa 45,8 g/100 g. Mainin geneerisen tumman suklaan Fineli 53,26 g/100 g nostaisi muuten samaa laskua noin **0,60 g/viipale**. Eri suklaamerkkiä ei saa huomaamatta nimittää siksi hyväksytyksi tuotteeksi. |
| [Bataattiletut](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/aamupalat/bataattiletut.md) | 1/2 lettutaikinasta **mustikoineen ja vaahterasiirappeineen**: **30,33 g** (uunibataatti) tai **28,79 g** (keitetty bataatti). #706:n vaihtoehdot. | Ohjeen siirappi **6,70 g/annos** sisältyy kokonaislukuun. Älä lisää laskussa siirappia toista kertaa tai käytä pelkkää lettutaikinaa koko aamiaisen HH:na. |
| [Taateliketsuppi](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/alkuruoat/taateliketsuppi.md) | 1/8 kastikkeesta. Tomaattipyree **1,39 g/annos** käyttökelpoisesta Fineli-viitteestä. Mainin vanha raakasyötesumma noin **5,69 g/annos EI ole hyväksytty imeytyvien HH:iden kokonaisarvio**. | **Uusi lähdesemantiikan ongelma:** mainin Medjool-taatelitietue `usda-168191` ilmoittaa **74,97 g/100 g `US_TOTAL_INCLUDING_FIBRE`**, vaikka laskentasyötteen tulostyyppi on `AVAILABLE_EXCLUDING_FIBRE`. USDA:n tietueessa ravintokuitua **6,7 g/100 g**. Lisäksi liotusvesi heitetään pois. Älä siirrä US-total-lukua julkiseksi HH-arvioksi tai laske tästä GK:ta. Ks. P1 alla. |
| [Omenavaahtokarkit](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/jalkiruoat/omenavaahtokarkit.md) | 1/16 palasta: **1,56 g** laskennallista HH:ta kuoritusta omenasta, ei lisättyä sokeria. #706:n HH-only. | **Uusi sanallisen GK:n ehdokas:** koska annoksen HH on hyvin pieni, perustele varovainen sanallinen arvio ja vaihtoehdot 0,5–2 annokselle lähde-/rajauskatselmoinnissa. Älä automaattisesti hyväksy LOW-luokkaa tai kutsu valmista tuotetta mitatuksi. |
| [Avokado-perunasämpylät muffinivuoassa](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/leivonnaiset/avokado-perunasampylat.md) | Yksi kuudesta: **5,42 g** HH; keitetty kuorittu peruna **4,65 g**. #706:n HH-only. | Päällä on myös sivelty keltuainen ja seesami. Älä vaihda tätä resepti-identiteettiä peltiversioon; niiden perunamäärät eroavat. |
| [Avokado-perunasämpylät pellillä](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/leivonnaiset/avokado-perunasampylat-pellilla.md) | Yksi kuudesta: **7,01 g** HH, perunasta **6,46 g**. #706:n HH-only. | Ero muffinivuokaversioon **noin 1,60 g/sämpylä** perustuu eri reseptimääriin ja valmistusversioon. Tämä on käyttäjälle oikeasti hyödyllinen kahden aidon reseptin vertailu, ei saman alkuperäisen GK-skenaarioväli. |
| [Proteiinivihannessose](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/proteiinivihannes-sose.md) | Mainissa jo **23,70 g** HH/1⁄4 vuoasta, peruna **15,50 g**. | Perunat punnitaan *keitettyinä ja valutettuina* (400 g/erä), eivät raakana. Kukkakaalin, porkkanan ja muiden ainesten GK:ta ei siirretä yhden GI-ryhmäkeskiarvon perusteella. |
| [Belgialainen proteiinivohveli](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/jalkiruoat/belgialainen-proteiini-vohveli.md) | Mainissa **40,39 g** HH/puolet taikinasta; kaurajauho **25,55 g**, vehnäjauho **12,21 g**. | Vohvelien kappalemäärä riippuu raudan koosta. Yksi annos on puolet koko taikinasta, ei yksi vohveli. Nimessä oleva *proteiini* ei tarkoita pientä HH-määrää. |
| [Metabolic boost -tomaattijuoma](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/alkuruoat/metabolic-boost-tomaattisoseella.md) | Mainissa **7,81 g/lasillinen**; passata **5,70 g**. #706:ssa sanallinen **pieni GK** vakioannokselle. | Arvio koskee reseptin koko kylmää juomaa. Tutkimus ei osoita metabolisia tai hoitovaikutuksia; pidä annoksen HIHH/HH ja sanallisen GK:n esityksen näyttöarvo erillään markkinointinimestä. |
| [Herne-auringonkukkalevite](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/alkuruoat/herne-auringonkukkalevite.md) | Mainissa **4,90 g/neljäsosa levitteestä**, pakasteherneet **4,68 g**. #706:ssa sanallinen **pieni GK**. | Sanallinen luokka koskee levitettä *ilman tarjoiluleipää*. Käyttäjälle tuo rajaus erityisen näkyviin silloin, kun hän arvioi voileivän kokonaiskuormaa. |
| [Ananas-kanelijuoma sitruunalla](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/valipalat/ananas-kanelijuoma-sitruunalla.md) | Mainissa **18,72 g/lasillinen**, ananas **18,48 g**, sitruunamehu **0,24 g**, kanelin massa enintään 0,35 g/annos jätetty numeerisen laskelman ulkopuolelle. | Kaikki hedelmäliha jää juomaan; ei mehu-/siivilöintiskenaariota. #706 käsittelee alustavan tutkimuksen ananaksen erilaisista valmistusmuodoista eikä hyväksy mittauksen perusteella GK-luokkaa. |

## Uusi P1: taateliketsupin USDA-hiilihydraatin määritelmä

Mainin `docs/nutrition/calculations/taateliketsuppi.json` sisältää taateleille:

- `record.id = usda-168191`; `carbohydrateDefinition = US_TOTAL_INCLUDING_FIBRE`.
- `record.per100g.carbohydrate = 74.97`; `record.per100g.polyols = null`.
- `amount = 45 g` ennen 15 minuutin liotusta; liotusvesi kaadetaan pois.
- Syötteen tason `carbohydrateOutput = AVAILABLE_EXCLUDING_FIBRE`.

USDA FoodData Centralin SR Legacy -tietueessa 168191 on **74,97 g/100 g carbohydrate by difference** ja **6,70 g/100 g dietary fibre**. [USDA:n määritelmä](https://fdc.nal.usda.gov/Foundation_Foods_Documentation/) toteaa, että `carbohydrate by difference` **sisältää kuidun**; [FDC 168191:n tietue](https://fdc.nal.usda.gov/fdc-app.html#/food-details/168191/nutrients) ja [rivikopio](https://rawpawiq.com/ingredient/dates-medjool-168191) vahvistavat luvut.

Jos kuitu erotettaisiin *vain herkkyystarkasteluna*, lähtötaatelin laskennallinen hiilihydraattiosuus olisi `74.97-6.70 = 68.27 g/100 g` ja `45 × 68.27/100/8 = 3.84 g` annosta kohti, kun vanha käsittelemätön kokonais-hiilihydraattiluku antaa `4.22 g`. **Erotus on noin 0,38 g annosta kohti**, mutta kuituvähennys ei yksin määritä varmasti vastaavaa imeytyvää hiilihydraattia (muut ei-digestit komponentit/polyolit ja kuivattujen taateleiden tuotevertailu voivat vaikuttaa). Liotusveden mukana poistuvista sokereista ei ole retentiotodistetta.

Siksi **älä hyväksy 5,69 g:n vanhaa osasummaa koko annoksen imeytyväksi HH:ksi**, äläkä julkaise 5,31 g:n keinotekoista laskua suoraan. Lisää tarvittaessa yleiseen GI/GK-lähdetarkistukseen sääntö: `US_TOTAL_INCLUDING_FIBRE` ei muutu `EU_AVAILABLE`-tiedoksi ilman lähdettä vastaavaa, katselmoitua muunnosta. Älä heikennä muita lähde-/historiasuojauksia. #706:ssa koko annoksen arvo on jo perustellusti avoin.

## Uusi käytettävyys-P1: vähäinen HH ja oikea annos

**Omenavaahtokarkit:** 300 g kuorittua omenaa (Fineli 11060, 8,31 g/100 g) jaetaan 16 palaan, jolloin `300×8.31/100/16 = 1.558125 g` HH/pala. Vesi ja tavalliset liivatelehdet tuovat repon hyväksyttyjen raaka-ainetietueiden mukaan suoraan 0 g available CHO. Omena kypsennetään, soseutetaan ja koko massa säilytetään, ei lisättyä sokeria.

Tutki voitaisiinko tämän perusteella ja nykyisellä GK-menetelmällä hyväksyä **sanallinen pieni GK** yhden tai kahden palan annokselle sekä käyttäjän vaihtoehtoihin 0,5/1/1,5/2. GI-vertailusta ei saa tehdä ihmisellä mitatun vaahtokarkin väitettä. Mahdollinen arvio pidetään epävarmuudeltaan oikeanlaisena, ja lähde-, aines-, valmistus- ja annossidokset sekä neljän kielen tekstit testataan. Jos varmaa päätöskriteeriä ei ole, säilytä HH-luku ja perusteltu GK-puute.

**Peltisämpylä vs. muffinivuokasämpylä:** kaksi erillistä alkuperäisreseptiä, molemmat kuuden kappaleen eri erät. Perunamäärä 250 g vs. 180 g. Kokonaishiilihydraatti vastaavasti noin 7,01 g vs. 5,42 g per sämpylä; repon tieto mahdollistaa suoran reseptien vertailun, vaikka GK-kategoriaa ei vahvistettaisi. Älä yhdistä eri reseptitunnuksia tai vääristä niiden annosmäärää.

**Hernelevite:** sanallinen LOW koskee 1/4 levite-erästä, ei päälle laitettavaa leipää. Erota levitteen ja voileivän hiilihydraatit käyttöliittymässä.

## Tuotekohtaiset lähdeskenaariot – ei yleistä nollapohjaa

**Bataatti-banaanileipä:** #706:n kahden valmistusvaihtoehdon hiilihydraatit perustuvat tiettyyn `Callebaut 811-E0-D94` -suklaaseen (45,8 g/100 g). [Valmistajan 811-tuotesivu](https://shop.callebaut.com/en-de/en-de/dark-chocolate-couverture-drops-811/811.html) vahvistaa 45,8 g/100 g. Mainin geneerinen Fineli-32 on 53,26 g/100 g. Nämä tuottavat 80 gramman erässä noin 5,97 g kokonaiseron, 0,60 g/viipale. #706:n selite kertoo tuotteen; varmista myös, ettei yleinen reseptikortti tai opas esitä tätä kaikkiin tummiin suklaahippuihin soveltuvana lukuna.

**Kypsä bataatti:** brownie-, lettu- ja leipäresepteille #706 sisältää erilliset Fineli #30600 / #30602 -valmistusvaihtoehdot. Vaihtoehtoluku ei ole GI-tutkimus eikä riskiluokkien tilastollinen vaihteluväli. Reseptin alkuperäisten valmistus- ja painovaiheiden pitää säilyä.

**Leivonta ja sääteet:** kauralastuissa ja jäisissä banaanipaloissa kappalemäärä on arvio; absoluuttinen HH voi poiketa, kun erän paloista tulee erikokoisia. Lisää käyttäjän valintaan mahdollisuus huomioida erän murto-osa, älä esitä epätasaisia kappaleita punnittuina vakioannoksina.

## Lähteiden jäljitettävyys

- Aineskohtaiset määrät, lasketut yksikkömassat, `carbohydrateDefinition`, ja ruokakohtaiset Fineli/AFCD/USDA-lähdelinkit ovat kunkin mainin `docs/nutrition/calculations/<recipe_id>.json`-tiedostossa lukitussa main-SHA:ssa.
- #706:n `docs/nutrition/gk-reviewed-portions.json` sisältää käyttäjän 0,5/1/1,5/2 annosrajausten paikalliset condition-tekstit, tarkisteet ja vaihtoehtoiset koostumuskohdistukset.
- [USDA: by-difference sisältää ravintokuidun](https://fdc.nal.usda.gov/Foundation_Foods_Documentation/) – ulkoinen käsitemääritelmän tarkistus.
- [Callebaut 811 valmistajan ilmoittama koostumus](https://shop.callebaut.com/en-de/en-de/dark-chocolate-couverture-drops-811/811.html) – ulkoinen tuotematch-tarkistus.
- Tässä raportissa ei verrattu jokaisen reseptin ihmis-GI-tutkimusta tai toistettu paikallista buildia, CI:tä, renderöintiä eikä kieliversioiden toimintaa. Laskennallinen aritmetiikka ei todista kliinistä soveltuvuutta.

## Luovutus Codexin #706:n vastuulliselle

1. **Lue tämä tiedosto ja vertaa sitä ensin uusimpaan #706-HEADiin.** Älä aloita samaa 20 reseptin tutkimuserää alusta, jos luvut on jo päätetty.
2. **P1: taateliketsupin koostumusmääritelmän esto** – varmista, ettei US-total-by-difference siirry EU-available-lukuun eikä liotusveden poistuminen unohdu. Tutki vain tarpeen mukaan varovainen osatieto/tuote-esitys.
3. **P1: omenavaahtokarkkien annosrajaus** – selvitä matalan HH:n perusteella sanallisen arvion mahdollisuus ilman keinotekoista GI-oletusta.
4. **P2: keskeisen makeuttajan ainesosahuomio** – hunaja/siirappi näkyvissä kakkujen, jäätelöiden ja lettujen annosvertailussa. Älä nosta niitä automaattisesti uusiksi GK-numeroiksi.
5. **P2: eri reseptiversioiden ja pakkauksien vertailu** – avokado-perunasämpylät ja tuote-ehtoinen Callebaut-leipä, samoin mahdollinen levitteen tarjoiluleipä erikseen.
6. Toteuta vain aidosti uusi, hyväksyttävä muutos yhden kirjoittajan omistamassa varsinaisessa PR:ssä; varmista olennaiset FI/EN/SV/TH, historiallisen laskennan lukot, tiukka ravintoauditointi ja testatun SHA:n CI. Älä muuta hyväksyntä-GK:ta tämän dokumentin perusteella.
7. Raportoi **uudet käyttäjälle näkyvät** HH/GK/sanalliset arvot erillään **tämän tutkimuksen varmistamista aiemmista tiedoista**. Jos lähteet eivät riitä, perusta HOLD täsmällisesti äläkä nosta numerokattavuutta väkisin.

**Tämä tutkimus-PR ei vaadi mergeä tuotearvojen käyttöön; se on yhden Markdownin dokumentoitu handoff.** ReportHub päivitetään luovutetun toteutusvaiheen lopussa, ei jokaisen tutkimuscommitin jälkeen. Ei tuotantoon julkaisua eikä yksittäisen käyttäjän lääkehoito-ohjausta.

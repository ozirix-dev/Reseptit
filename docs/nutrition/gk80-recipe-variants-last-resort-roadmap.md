# GK80 – alkuperäisen reseptin säilyttävät vaihtoehtoversiot viimeisenä keinona

**Tila:** PROPOSAL / DESIGN ONLY · **Päiväys:** 2026-11-02 · **Omistaja:** Reseptit / toimitus ja GK-menetelmä  
**Tavoite:** Käyttäjälle hyödyllinen ja toistettava GK-tieto myös silloin, kun alkuperäisen reseptin arvio ei ratkea; alkuperäistä reseptiä ei muuteta mittarin vuoksi.

> **Päätösperiaate:** Reseptiä muutetaan tai luodaan vaihtoehtoversio vasta viimeisenä keinona. Julkaistu alkuperäisohje säilyy kanonisena, vaikka siitä ei pystyttäisi laskemaan GK:ta. Muokatun version GK:ta ei koskaan nimetä alkuperäisen ohjeen GK:ksi.

## 1. Miksi tämä kirjataan

GK80-tavoite on vähintään 80 %:lle uniikeista resepteistä käyttäjää hyödyttävä julkaistu GK-tieto, mutta laatu- ja lähdeportteja ei saa ohittaa. Pelkkä luku tavoitteen täyttämiseksi ei ole hyöty. Käyttäjä haluaa ensisijaisesti **säilyttää alkuperäiset maailman ruokakulttuureja edustavat reseptit** ja saada niiden glykeemisestä kuormasta perustellun arvion; vasta viimeiseksi hän harkitsee muutosta tai rinnakkaisversiota.

Tämä suunnitelma täydentää:
- [PR #118](https://github.com/ozirix-dev/Reseptit/pull/118): GK-vaihteluvälit, luokkavarmuus, nimetyt skenaariot, lähdeportit ja P0–P5-toteutusohjelma.
- [PR #186](https://github.com/ozirix-dev/Reseptit/pull/186): keto-mutakakun tuotekohtainen, rajattu polyolien tutkimuspilotti; ei julkaistua koko kakun GK-väliä.
- [PR #187](https://github.com/ozirix-dev/Reseptit/pull/187): nykyinen hyväksyntäjono ja erilliset lähde-/sisältöpäätökset.
- [PR #189](https://github.com/ozirix-dev/Reseptit/pull/189): neljän jo hyväksytyn GK-only-version erillinen integraatio; tähän työhön ei kosketa.

Muiden agenttien parhaillaan tutkima kolmen vaihtoehtoisen GI/GK-arviointimenetelmän työ jatkuu **itsenäisesti**. Tämä dokumentti ei nimeä niitä etukäteen kolmeksi parhaaksi eikä käynnistä samoja lähdehakuja uudelleen. Menetelmien tuottama näyttö arvioidaan ensin. Loppukäyttäjän kannalta esimerkiksi **"GK arviolta 5–10"** voi olla hyvä esitystapa, *jos* siihen on asianmukaiset metodiset perusteet. Kätevää 5–10-levyistä väliä ei saa rakentaa mielivaltaisesti puuttuvan tiedon ympärille.

Kaikki historialliset kattavuusluvut ovat tilannekuvia: lopullinen lähtötilanne on aina laskettava toteutushetken julkaistusta mainista. Draft-PR:n ehdokasluku ei ole tuotannon luku.

## 2. Viisiportainen ensisijaisuusjärjestys

Käy jokainen ratkaisematon resepti läpi **tässä järjestyksessä**. Etene seuraavaan portaaseen vasta, kun edellinen on aidosti tutkittu; kirjaa ratkaiseva estoperuste.

| Porras | Keino | Alkuperäinen ohje | Mahdollinen tulos |
| --- | --- | --- | --- |
| 1 | Suora, ruoka- ja valmistustapaa vastaava GI-lähde, natiivit CHO-kentät, määrät ja annokset | Ennallaan | Hyväksyttävä laskettu GK |
| 2 | Tutkimuksessa valitut vaihtoehtoiset arviointimenetelmät ja näyttöön sidottu vaihteluväli/luokka | Ennallaan | POINT / perusteltu RANGE / CLASS_ONLY / UNAVAILABLE, merkitykset erillään |
| 3 | Reseptin *jo sallima* täsmällinen raaka-aine- tai tuotevalinta, esim. nimetty suklaa; oma laskentaskenaario | Ennallaan | Ehdollinen, nimetty SCENARIO; ei automaattisesti yleinen GK |
| 4 | **Toimituksellisesti hyväksytty rinnakkainen reseptiversio**, kun alkuperäinen estyy eikä kevyempi keino auta | Alkuperäinen **ennallaan**, vaihtoehto selvästi erillinen | Version oma GK tai estoperuste |
| 5 | Rehellinen HOLD, kun näyttö ei riitä | Ennallaan | Julkinen "GK ei vielä arvioitavissa" ja syy |

Portaiden 2–3 tuloksissa erotetaan **näyttöön perustuva vaihteluväli**, **oletusehtoinen arvio**, **laskettu osuus** ja **koko reseptin GK**. Niitä ei saa muuntaa toisikseen pelkällä esityspyöristyksellä.

## 3. Milloin rinnakkaisversio on oikeutettu?

Rinnakkaisen valmistettavan version ehdottaminen edellyttää **kaikkia** seuraavista:

1. Alkuperäisen reseptin merkittävä GK-este on dokumentoitu, ja portaat 1–3 eivät tuota riittävää tulosta.
2. Vaihtoehto on **kulinaristisesti mielekäs** ja käyttäjälle todellisuudessa valmistettavissa, ei vain laskentaa varten sepitetty.
3. Muutos esitetään täsmällisesti: ainesosat, tuotetunniste, määrät, massan/tilavuuden peruste, annoskoko, valmistustapa, tarjoilu ja lisukkeet.
4. Vaihtoehdon koostumus- ja GI-lähteet vastaavat sen todellista valmistustapaa; uusi raaka-aine ei saa automaattisesti periyttää vanhan GI:tä.
5. Muutos ei hiljaisesti muuta alkuperäisen reseptin kanonista tekstiä, tunnistetta, URL:ia, kuvaa, ravintoarvoja eikä ruokalaji-/ruokavalioluokituksia.
6. Ehdotettu versio saa oman selkeän lähde-, menetelmä- ja **toimituksellisen sisältöpäätöksen** ennen julkaisua.

Version tarkoitus voi olla mitattavan lähtötiedon täsmentäminen, aidosti matalamman GK:n tarjoaminen tai käyttäjän tavallisen valinnan vertailu. **Pelkän kattavuusprosentin nostaminen ei kelpaa perusteluksi.**

### Muutosten tyyppiluokat

- **Tarkennus:** alkuperäinen mainitsee "sokeriton suklaa" ja version tekijä valitsee yhden yksilöidyn tuotteen. Jos ohje sallii valinnan, tämä on ensisijaisesti nimetty skenaario (porras 3), ei pakolla uusi resepti.
- **Valmistustarkennus:** kuivaa riisiä punnitaan 300 g ja tarjoillaan koko keitetty erä; kuivan ja keitetyn riisin massoja ei saa vaihtaa.
- **Aito ainesosamuutos:** esim. riisilajin, jauhon, lisukkeen tai makeuttajan vaihto. Tämä on erillinen toimituksellinen reseptiversio ja sen GI/CHO on arvioitava erikseen.
- **Vaihtoehtoinen annos / lisukkeen poisjättö:** voi muuttaa GK:ta, mutta tarjoilun ja annoskoon rajaus on kerrottava. Älä väitä uutta annosta alkuperäiseksi.
- **Reseptiä pilaava "laskentakorjaus":** määrien vääristely, sopimaton ruoka-analogian vaihto tai ainesosan poistaminen vain puuttuvan GI:n välttämiseksi. **NO-GO.**

## 4. Tietomalli ja alkuperäisen turvaaminen

Toteutusvaiheessa päätetään, milloin käytetään olemassa olevaa `GkOnlyVariant`-mallia ja milloin syntyy erillinen varsinainen valmistettava reseptiversio. Näitä ei saa niputtaa samaan kenttään ilman selvää eroa.

**Pakolliset tunnisteet ja viitteet:** `originalRecipeId`, `originalVersion/inputHash`, `variantId`, `variantKind` (EXACT_INPUT / PRODUCT_SCENARIO / EDITORIAL_RECIPE), `variantRecipeInputHash`, `sources`, `compositionVersion`, `giMethodVersion`, `approvalId`, `approvalScope`, `publicationState`, `macroScope`, `assumptions`, `unresolvedIngredients` ja `publicExplanation`. Nämä ovat suunnittelukenttiä, **eivät tässä PR:ssä toteutettua skeemaa**.

- Alkuperäinen resepti ei muutu varianttia valittaessa. Käyttäjän pitää nähdä sekä alkuperäinen että erillisen version tarkat poikkeamat.
- Vanhan `GkOnlyVariant`-sopimuksen grammaperusteita ei tulkita millilitroiksi. Hyödynnä vain erikseen hyväksyttyä natiiviyksikkösopimusta.
- Versio saa makrot vain, jos **koko version** ravintoarvot on erikseen laskettu ja hyväksytty; alkuperäisen makroja ei kopioida automaattisesti. `NO_MACRO_PACKAGE_FOR_THIS_VERSION` on turvallinen oletus.
- Näytä mahdolliset positiiviset poisjätöt ja LOW-luottamus. Alkuperäisen version GK:n puuttuminen ei katoa uuden version numeron alle.
- GI:n epävarmuutta, ravintoarvon epävarmuutta, prosessointia, polyoleja ja annoskokoa ei saa piilottaa yhteen tuntemattomaan "arviointiväliin".
- Piste, perusteltu RANGE, CLASS_ONLY, nimettyjen tuotteiden ehdolliset skenaariot ja UNAVAILABLE ovat eri esitystiloja PR #118:n periaatteiden mukaan.

## 5. Kattavuus: kolme erillistä mittaria, ei kaunistelua

1. **Alkuperäiskattavuus:** kuinka monen uniikin reseptin *alkuperäisen ohjeen* GK on hyväksyttävästi laskettu.
2. **Versiokattavuus:** kuinka monella uniikilla reseptillä on ainakin yksi hyväksytty ja julkaistu numeerinen GK-versio. **Sama recipeId lasketaan kerran**, vaikka vaihtoehtoja olisi useita.
3. **Informatiivinen kattavuus:** kuinka monelle uniikille reseptille voidaan näyttää perusteltu piste, alue, luokka, nimetty skenaario tai ymmärrettävä estoperuste. Raportoi tuloslajit erikseen; pelkkä HOLD ei ole numeerinen GK.

Näytä myös erikseen, kuinka moni numeerinen versio on todellinen **toimituksellisesti muokattu resepti**, ei vain alkuperäisestä tehty punnittu GK-only-versio. Uutta reseptiriviä ei lisätä kokoelmamäärään automaattisesti pelkän GK-variantin takia. Mittarin nimittäjää ei kasvateta tai pienennetä sopivasti tavoitteen saavuttamiseksi.

**Tavoite ei oikeuta:** laskettujen osasummien ylentämistä koko aterian GK:ksi, erillisten tuoteskenaarioiden min/max-arvojen väittämistä biologiseksi vaihteluväliksi tai GK-only-version merkitsemistä alkuperäisen ohjeen GK:ksi.

## 6. Käyttäjälle näkyvä toteutusperiaate, FI / EN / SV / TH

Alkuperäinen ohje on oletusvalinta. Tarjoa tarvittaessa hillitty valinta `Alkuperäinen` / `GK:tä varten täsmennetty vaihtoehto` / `Muu valmistettava versio`, mutta älä lisää uutta yleistä hakusuodatinta ennen käyttäjätarpeen vahvistamista.

Kunkin version yhteydessä on luettava:
- mitä ainesosia tai valmistusta muutettiin ja miksi;
- version tarkka annoskoko, ainesosan massa/tilavuus ja mahdollinen tuotteen nimi;
- mitä GK-luku tai esimerkiksi "noin 5–10" **oikeasti** tarkoittaa ja mikä jää tuntemattomaksi;
- voiko samaa luokkaa pitää vakaana yli hyväksyttyjen skenaarioiden; epävarma ei ole varmasti matala;
- lähteet, päivämäärä sekä LOW-/HOLD-rajoitteet;
- alkuperäisen reseptin erillinen GK-status.

Numeron esitystarkkuus perustuu todelliseen näyttöön eikä laskentakoneen desimaaleihin. Ei henkilökohtaisia verensokeriennusteita, lääkehoito-ohjeita eikä väitettä kliinisesti mitatusta ruoan GK:sta.

Kieliversiot ovat sisältövastaavia; muutos ei saa aiheuttaa vain suomenkielisen sivun ja muun kielisen reseptin erkaantumista.

## 7. Toteutus vaiheittain – yksi erillinen ajettava tehtävä kerrallaan

**Tämä PR ei käynnistä toteutusta.** Avoimien PR:ien #118 / #186 / #187 / #189 menettelyjä ei ohiteta.

### V0 – Varmista muiden kolmen menetelmän tutkimustulos
- Vastaanota erillisen käynnissä olevan Codex-tutkimuksen tulos täsmällisestä commitista.
- Kirjaa, mitkä ongelmaryhmät ratkeavat ilman reseptin muutosta.
- Erota aidot lähteistetyt GK-välit oletusskenaarioista. Ei uusintatutkimusta samoista lähteistä.
- **Gate:** vain edelleen ratkaisemattomat reseptit etenevät V1:een.

### V1 – Rajattu 5 reseptin muutoskelpoisuuspilotti (ei julkaisua)
- Valitse nykyisestä estolistasta enintään **5 erilaista** käyttötapausta; sisällytä tarkoituksenmukainen riisi-/viljaruoka, makeuttajaa/polyolia käyttävä jälkiruoka ja lisuke- tai tuotetulkinta, jos sopivia ratkaisemattomia tapauksia on.
- Kirjaa kullekin: estoperuste, miksi portaat 1–3 eivät riitä, alkuperäisen ja vaihtoehdon erot, valmistettavuus, mahdolliset GI/CHO-lähteet, laskettu tuloslaji sekä numeerinen vaikutus **vain jos lähteet riittävät**.
- Luokittele päätös `SCENARIO_ONLY`, `EDITORIAL_VARIANT_CANDIDATE` tai `HOLD`. 0 julkaistua tulosta on hyväksyttävä, jos lähteet eivät kestä.
- **Gate:** vähintään yksi aidosti käyttäjälle hyödyllinen, toistettava, toimituksellisesti arvioitava vaihtoehto; muuten STOP ja esteiden kirjaus.

### V2 – Yksi käyttäjän hyväksymä toteutettava versio
- Päätös erikseen siitä, onko kyse skenaariosta vai muuttuneesta varsinaisesta reseptistä.
- Uuden valmistettavan version ainesluettelo, valmistus, annokset, lähteet ja nelikielinen sisältö toimitukselliseen hyväksyntään; alkuperäinen muuttumaton.
- **Gate:** täsmäversioon ja sen hashin sidottu lähde-/menetelmä-/sisältöhyväksyntä; ei yleistä kaikkien analogisten reseptien hyväksyntää.

### V3 – Tekninen pilotti, yksi PR
- Käytä nykyisiä versio-, macroScope-, natiiviyksikkö- ja GK-esitysrakenteita; tee vain minimitason tarvittavat rajapintalaajennukset.
- Näytä alkuperäisen ja variantin erot ja estot; varmista annosskaalaus sekä nykyisten versioiden muuttumattomuus.
- Rajatut testit: saman recipeId:n laskenta kerran, syötehashin vanheneminen, merkitykselliset mittayksiköt, GK-piste/väli/luokka/HOLD-erottelu, alkuperäisreseptin ja makrojen säilyminen, nelikielisen sisällön oikeellisuus.
- **Gate:** katselmoitu Draft ja täsmälleen siihen HEADiin liittyvä CI; ei automaattista julkaisua.

### V4 – Julkaisupäätös ja hallittu laajennus
- Eri käyttäjävaltuudet yhdistämiseen ja tuotantoon. Varmista julkisesti sekä alkuperäisen että variantin näkymä.
- Mittaa käyttäjähyöty, lähteiden ylläpidettävyys, mahdolliset väärinkäsitykset ja kattavuuden todellinen lisäys.
- Vasta tämän jälkeen harkitaan toista 5 reseptin erää.
- **Gate:** STOP, jos versiot johtavat käyttäjää harhaan, lisäävät liikaa ylläpitotyötä tai eivät avaa lähdekelpoisia tuloksia.

## 8. Toteutusrajoitukset ja testisäästö

- **Design-only.** Älä muuta reseptejä, käännöksiä, GI/GK-koodia, ravintoarvoja, sivuston reittejä, kriteereitä tai kattavuuslukuja tässä PR:ssä.
- Tämän dokumentin vuoksi ei tarvitse ajaa 326 reseptin laskentaa, laajaa Playwrightia tai manuaalista GitHub Actions -uusintaa. Normaali automaattinen PR-CI saa ajaa repo-sääntöjen mukaan.
- Yksi nimetty kirjoittaja / haara; muut agentit lukevat tämän suunnitelman ilman haaraan kirjoitusoikeutta. Tarkista `AGENTS.md` ja `docs/rinnakkaiset-codex-ajot.md` ennen toteutusta.
- PR #118:n yleisen epävarmuusmallin ja PR #186:n polyolitutkimuksen tulokset eivät yksin ole julkaisulupia; PR #187:n hyväksyntäpäätöksiä ei laadita uudelleen.
- Tässä ehdotettu viiden reseptin jatkopilotti ei ole uusi käsky nykyisille rinnakkaisagenteille eikä saa häiritä meneillään olevaa hyväksyttyjen GK-arvojen julkaisua.

## 9. Katselmoinnissa ratkaistavat päätökset

1. Hyväksytäänkö **viimeisen keinon** rinnakkaisversioperiaate eikä alkuperäisen reseptin hiljainen muokkaus?
2. Milloin olemassa olevan `GkOnlyVariant`-mallin skenaario riittää ja milloin tarvitaan uusi, valmistettava toimituksellinen reseptiversio?
3. Hyväksytäänkö kolme erillistä kattavuusmittaria ja täsmällinen kielto laskea muutettu resepti alkuperäisen GK:ksi?
4. Aloitetaanko V1:n enintään viiden reseptin pilotti *vasta* nykyisen kolmen varamenetelmän tutkimustuloksen jälkeen?

**Päätöstila:** `DRAFT / NO IMPLEMENTATION AUTHORIZATION`. Tämä dokumentti tallentaa idean; se ei hyväksy yksittäisiä GI-analogioita, reseptimuutoksia, uutta GK-arvoa, mergeä eikä deployta.

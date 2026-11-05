# GK100 / Recipavo: verkkolaskurien riippumaton vertailupilotti

**Tila:** DRAFT / SUUNNITELMA, 2026-11-05. **Ei toteutus-, hyväksyntä-, merge- eikä julkaisulupaa.**

## Tavoite ja rajaus

Verrataan Reseptit/Recipavon GK-laskentaa **10–20 saman reseptin** aineistolla **2–3 ulkoiseen GI/GK-laskuriin tai soveltuvaan reseptilaskentaohjelmaan**. Mitataan laskutoimituksen oikeellisuuden lisäksi lähteiden jäljitettävyys, ruokien ja valmistusmuotojen GI-soveltuvuus, puuttuvan tiedon käsittely, arvioiden epävarmuus sekä käyttäjän todellinen läpimenoaika.

**Kokeen aktivointi odottaa kahta ehtoa:**
1. Reseptit-projektissa vähintään **261/326 julkaistun alkuperäisen kotireseptin GK-arvo** (80 %); tutkimusannokset ja lisäversiot eivät kasvata resepti-ID-kattavuutta.
2. Uuden reseptin syöttö → laskenta → tekninen Approval Factory -tarkistus on kokeiltu käytännössä, mitattu ja todennettu luotettavaksi. Yhden komennon orkestrointisuunnitelma on [PR #279](https://github.com/ozirix-dev/Reseptit/pull/279), ei tämän työn riippuvuutta toteutustasolla, jos nykyinen putki jo toimii.

Lähtötilanne keskustelussa oli 236/326, mutta kokeen alkaessa **luetaan kattavuus ja lähtö-HEAD uudelleen nykyisestä mainista**. Kokeeseen osallistuminen ei muuta eikä hyväksy GK-arvoja.

## Vertailtavien työkalujen valinta

Alustavia tarkistettavia vaihtoehtoja (ei etukäteen vahvistettua käyttöoikeutta, tulosta tai soveltuvuutta):
- [Omni Calculator – Glycemic Load](https://www.omnicalculator.com/health/glycemic-load): yksinkertainen GI × saatava CHO /100; lähinnä laskukaavan ja käsinsyötön verrokki.
- [University of Sydney GI Search](https://glycemicindex.com/gi-search/): GI-tutkimuslähteiden ja mitattujen tuotteiden **referenssitietokanta**, **ei automaattisesti vastaava reseptin GK-laskuri**. Käytä GI-valinnan laadun tarkistamiseen, ei peiteltynä kolmantena reseptilaskurina.
- [Genesis R&D](https://esha.com/products/genesis-rd-food-labeling-software/): mahdollinen ammattimaisen ravintolaskennan verrokki **vain jos laillinen käyttöoikeus ja juuri tarvittava GK-toiminto ovat käytettävissä**. Ei ostoa/tilauksen aloittamista tätä suunnitelmaa varten.
- Tarvittaessa valitaan 1–2 muuta todellista, testaushetkellä saatavilla olevaa resepti-GK-palvelua, joiden dokumentaatio, syöttötavat ja ehdot tarkistetaan erikseen.

Valitse lopulliseen pilottiin **2–3 oikeasti käytettävissä olevaa laskentajärjestelmää**, joiden ominaisuudet ja rajoitukset kirjoitetaan etukäteen. Jos vain yksinkertaisia GI+CHO-laskimia löytyy, vertaillaan niitä vain kaavan ja käytettävyyden osalta; niistä ei väitetä reseptiautomaation laadullista paremmuutta tai huonommuutta. Kirjaa hinta-, lisenssi-, tietosuoja-, käyttöoikeus- ja dokumentaatiorajoitteet. Ei luvatonta automaattista keräystä tai suljettujen lähdetaulukoiden massakopiointia.

## Aineisto: 10–20 identtistä reseptiä

Valitaan etukäteen lukittu, eri vaikeustasot kattava joukko. Suositus 15 reseptiä:
- helppo hyvin lähteistetty kotiruoka: esim. **suomalainen karjalanpaisti** määritellyllä sipuli-/kastikemäärällä;
- vähähiilihydraattinen resepti, jossa pieni GI-puutteellinen ainesosa (avokado tms.);
- riisi-, pasta-, peruna- ja leipä-/jauhotapaus (valmistusmuodon vaikutus);
- tuotteeseen sidottu versio (pakkaus ja tuotekoodi);
- kuitu-/polyolitulkinnan haastava tapaus;
- seka-ateria, jonka GI-tutkimusanalogia on kyseenalainen;
- selvästi puutteellinen / mahdoton laskea luotettavasti;
- mahdollisuuksien mukaan kerran lähteistetty uusi resepti, jotta läpimenon nopeus mitataan kokonaan.

Reseptit julkaistaan testiaineistoon **vain käyttäjän jo sallimassa muodossa**; alkuperäistä reseptitekstiä tai nykyisiä GK-versioita ei muuteta koetta varten. Lukitse kullekin reseptille recipeId / variantId / alkuperäinen commit, annosmäärä, yksilöity ainesosalista, syötävät grammapainot ja mittayksikkömuunnokset, valmistustapa, raaka vs kypsä, saatavan CHO:n määritelmä ja lähde sekä GI-tietue ja sen mittausasteikko. Tallennetaan nimetyt oletukset ja tiedonpuutteet; ei täytetä puuttuvia numeroita nollilla. Varmista oikeudet ulkoiseen syöttämiseen.

**Koe ei saa vertailla eri annoksia tai eri oletuksia muka keskenään.**

## Kahden erillisen testitilan malli

**A. Kontrolloitu laskentatesti (sama tieto):**
- Syötä kaikille järjestelmille, jotka sen sallivat, *täsmälleen sama* GI, saatava CHO, annoskoko ja määritelmä.
- Laske etukäteen riippumaton Decimal-referenssi, `sum(GI_i × availableCHO_i/annos)/100`, mukaan lukien tarkat pyöristyssäännöt.
- Mittaa lukuerot ja toistettavuus. Tämä testaa **aritmetiikkaa ja käyttöliittymää**, ei GI-lähteiden totuudenmukaisuutta.

**B. Aito reseptityönkulku (järjestelmien omat aineistot):**
- Anna mahdollisuuksien mukaan sama resepti, sama valmistus ja samat annokset kullekin järjestelmälle; anna sen tehdä oma GI/koostumuslähdevalinta.
- Tallenna jokainen käytetty lähdetietue / GI-lähde / ruoan identiteetti / menetelmä, luottamustaso ja mahdollinen **ei tulosta**.
- Erota erot, jotka johtuvat GI:n tutkimuksesta, valmistusanalogiasta, CHO-määritelmästä, määrästä, tuotteesta, oletuksista tai poisjätöistä.
- Jos järjestelmä ei tue kokonaista reseptiä tai läpinäkyvää lähdevalintaa, merkitse **NOT_SUPPORTED / NOT_DISCLOSED**, älä pakota sitä väärään vertailuluokkaan.

Tulosten läheisyys toisiinsa **ei ole kliininen validointi**. Todellista aterian glukoosivastetta ei voida päätellä luotettavasti vain eri laskurien samanlaisista arvioista. Mitatun vasteen tarkkuus vaatisi erillisen, asianmukaisen ihmis-/ateria-aineiston; tätä ei kerätä tässä kokeessa.

## Mittarit ja tulosten esittäminen

Kustakin reseptistä ja työkalusta kirjataan:
1. `numeric_gk` / `range` / `no_value`, yksikkö, annos, määritelmä, desimaalit ja pyöristys, laskelma vs mittaus.
2. GI- ja CHO-lähdeviitteet, niiden lisenssi, valmistusvastaavuus, puuttuvan tiedon läpinäkyvyys ja mahdolliset perusteettomat analogiat.
3. Kontrolloidun laskentatestin absoluuttinen ja suhteellinen poikkeama riippumattomasta referenssistä; puuttuvaa arvoa ei käsitellä nollana.
4. Mahdollisen luokan muutoksen (matala/keskitaso/korkea) syy; rajan ylittävän vaihteluvälin käsittely.
5. Ihmisen aktiivinen syöttö- ja tarkistusaika, kokonaisläpimenoaika, automaattinen laskenta-aika sekä tarvittavien lisävalintojen, tiedonhaun ja manuaalisten korjausten määrät. Mittaa vaiheet erikseen, älä sekoita näitä keskenään.
6. Virhetilanteet (väärä raaka-aine, väärä valmistus, tuntematon polyoli, vanhentunut hyväksyntä), estikö työkalu julkaisukelvottoman väitteen vai antoiko numeron ilman varoitusta.
7. Työkalun käyttörajoitukset, uusittavuus, versionumero ja tallennusajankohta.

Raporttiin kaksi rinnakkaista näkymää: **A) oikea kaava samoilla syötteillä** ja **B) lähteistetyn reseptityönkulun laatu ja aika**. Tilastoi `n` ja puuttuvat erikseen. Vältä näennäistä, perustelematonta 0–100-pistemäärää; esitä havainnot ja päätelmät rajauksineen.

## Ehdotettu toteutus ja hyväksymisehdot

- Kokeen alkuun kirjataan nyky-mainin SHA, hyväksytty kattavuus, läpimenokokeen tulos, valitut 10–20 ID:tä ja 2–3 käytettävää työkalua. Vasta silloin päätetään testiaineiston lopullinen laajuus ja mahdolliset kulut.
- Tee ensin kahden reseptin **kuiva pilotti**: yksi helppo ja yksi tarkoituksella hankala. Varmista, että ulkoiset laskurit sallivat vertailukelpoisen syötteen.
- Suorita sitten lukittu täysi joukko yhtenä testisuunnitelmana, ilman että epäselviä tapauksia huomaamatta vaihdetaan pois.
- Tallenna rajattu, lähteistetty vertailuraportti, syötehashit, raakavastaukset vain käyttöoikeuksien puitteissa, toistettavat omat laskutoimitukset, menetelmälliset erot sekä koneellinen päätöstaulukko.
- Mikäli meidän järjestelmässä näkyy todellinen bugi, avaa **erillinen rajattu korjaus-PR**. GI-/menetelmä- tai uuden numeron hyväksynnät säilyttävät nykyiset portit. Kilpailijan virheellinen tai erilainen luku ei automaattisesti oikeuta meitä muuttamaan omia arvoja.
- Raportin lopuksi: soveltuuko järjestelmä Recipavon käyttäjien omille resepteille, mitä puuttuu ja mitkä parannukset ovat mitatun hyödyn perusteella tarpeellisia.

## Työrauha, rajat ja riippuvuudet

Tämä PR on **docs-only** eikä lisää CI-testejä, ulkoisia integraatioita, benchmark-skriptejä, oikeuksia, tilausta tai käyttäjädataa. Ei käynnistetä varsinaista vertailua ennen yllä määriteltyjä portteja. Ei muutoksia `site/`, `reseptit/`, `docs/nutrition/` laskentadata-JSONeihin, Approval Factoryyn, nykyisiin GK100/80-ajoihin tai toisten omistamiin PR-haaroihin.

Seuraus: tämä dokumentti voidaan myöhemmin tarkentaa ilman että 80 %:n saavuttaminen, GK100-läpimenokorjaus, #279:n orkestrointisuunnitelma, #241:n uusien reseptien malli tai #242:n GI Knowledge Base häiriintyvät.

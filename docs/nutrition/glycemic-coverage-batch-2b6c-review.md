# GI/GK-kattavuuskampanjan 2B6C lähdekatselmointi

Status: `DRAFT FOR INDEPENDENT REVIEW`

## Lähtötilanne ja rajaus

- Julkaistu Reseptit-main: `b2ac53b11b45b8759d5f841ba978c966a50efe26`.
- Muuttumaton lähtötilanne: 325 reseptiä, 134 laskettua, 191 keskeneräistä, 42 GI-tietuetta (5 STRONG, 37 SUPPLEMENTARY).
- Strict nutrition -auditin lähtötilanne: 180 ESTIMATE WITH EVIDENCE, 86 INSUFFICIENT SOURCE DATA, 59 MISSING; VERIFIED 0 ja CONFLICT 0.
- Lähtötilanne on tallennettu `glycemic-coverage-batch-2b6c-baseline.json`-tiedostoon. Tallennin tarkistaa lähde-SHA:n, kaikki 325 reseptiä ja laskenta-/evidenssifingerprintit sekä estää ylikirjoituksen.
- Nykyinen inventaario on `glycemic-coverage-batch-2b6c-current.json` ja Markdown-yhteenveto sen rinnalla. Vanhojen erien snapshotteja ei muutettu.

Uusi toteutus rajattiin lähteiden ja täsmällisten syötesidontojen korjauksiin. GK-kaavaa, reseptimääriä, ravintoarvoja, toleransseja tai LOW-luottamusmallia ei muutettu. GI-katalogiin ei lisätty uusia tietueita.

## Kaikkien 191 keskeneräisen reseptin esteprofiili

Luokat ovat päällekkäisiä: yhdellä reseptillä voi olla useita itsenäisiä esteitä. Inventaarion blocker-overlap-laskenta antaa seuraavat luvut:

| Esteluokka | Reseptit | Tulkinta |
|---|---:|---|
| GI_MATCH | 86 | Katalogissa on lähde-ehdokas tai aiempi sidonta, mutta ruoka-/valmistusvastaavuus ei läpäise tarkistusta. |
| GI_MISSING | 41 | Merkitsevälle hiilihydraattiosuudelle ei ole hyväksyttyä GI-sidontaa. |
| COMPOSITION | 65 | Koostumus tai ainesosavastaavuus puuttuu tai on epäselvä. |
| MASS_PREPARATION | 20 | Määrä-, annos- tai valmistustapamuunnosta ei ole lähteistetty. |
| STRUCTURE | 41 | Reseptirakenne poikkeaa aiemmin sidotusta versiosta; 51 rakenteellisesti muuttuneella oli lisäksi muita esteitä. |
| TOLERANCE | 6 | Nykyinen yhteenlaskettu alle 2 g/annos pienosuustoleranssi ylittyy. |
| Muut variantti-/määrittelyesteet | 30 ensisijaisena | Esimerkiksi vaihtoehtoinen neste, tuotetyyppi tai punnitsematon määrä estää yhden täsmällisen arvion. |

Luvut eivät summaudu 191:een. Ensimmäisessä inventaariossa 86 reseptillä oli yksi blocker-viesti; erän edeltävästä 2B6B-auditista 32 näistä oli tavallisen ravintoarvotarkistuksen osalta tuettuja. Tämä ei yksin tarkoita, että GI-lähde olisi saatavilla tai että resepti olisi laskentavalmis.

Ryhmittely A–E:

- **A – olemassa olevan GI-lähteen uudelleenkäyttö (86):** arvioi syötesidonnan ja lähteen soveltuvuuden. Määrä ei tarkoita, että kaikki 86 saisi korjata olemassa olevalla tietueella.
- **B – mahdollinen yhteinen uusi GI-lähde (41 GI_MISSING-estettä):** vain ruoka- ja valmistustapakohtainen julkaistu lähde voi avata suuren osuuden. Liemille, kookosmaidolle ja kypsälle tomaattimurskalle ei tässä katselmoinnissa löytynyt vastaavaa, hyväksyttävää yksittäisen ainesosan GI-lähdettä.
- **C – koostumus tai massa (65 COMPOSITION, 20 MASS_PREPARATION):** Fineli-/AFCD-/USDA-korjaus voi avata reseptin vain, jos tuotetyyppi ja määrä ovat yksiselitteiset. Useissa ryhmissä jää lisäksi GI- tai varianttieste.
- **D – dokumentoitu pienosuus (6):** tarkastellaan vain nykyisillä alle 1 g yksittäis- ja alle 2 g kumulatiivisilla rajoilla. Raja-arvoja ei muutettu.
- **E – vaikea tai epäselvä (41 STRUCTURE, 30 ensisijaista muuta variantti-/määrittelyestettä):** ei avattu olettamalla vaihtoehtoa, tuotetta tai massaa.

## Yhteisten korjausten priorisointi

Luvut 1 ja 2 erottavat esiintymät ja ainoan jäljellä olevan olennaisen esteen. Lähdesaatavuus kertoo lähteen ja reseptikohtaisen valmistusvastaavuuden, ei vain samannimisen ruoan löytymistä.

| Tunniste / ruoka | Esiintyy blockerina | Ainoa blocker lähtöaineistossa | Hyväksyttävä näyttö tässä erässä | Päätös |
|---|---:|---:|---|---|
| Tomaatinmurska / kypsä tomaatti | 14 | 13 | Ei. Katalogin GI 22 koskee kokonaista raakaa tomaattia; sitä ei siirretty kypsään murskaan, kastikkeeseen tai uuniruokaan. | Estetty; vaatii kypsennetyn tuotteen lähteen. |
| Kanalientä sisältävät ruoat | 10 | 4 | Ei. Keittokategorian keskiarvo ei mittaa kanaliemen GI:tä. | Estetty; useissa jää muitakin esteitä. |
| Lihaliemi | 6 | 2 | Ei. Keittokategorian keskiarvoa ei käytetä liemelle. | Estetty. |
| Kookosmaito | 18 | 7 | Ei yksittäiselle kookosmaidolle. Julkaistu kookosmaitopuurotutkimus mittasi riisiä ja kookosmaitoa sisältävän puuron, ei kookosmaitoa ainesosana. | Estetty; koostumus-, massa- tai varianttiongelmia jää lisäksi. |
| Tamarinditahna | 4 | 1 | Ei. Hedelmien laaja keskiarvo ei ole tamarinditahnan mittaus. | Estetty. |
| Kuivatut taatelit | 3 GI-estettä | 0 | Julkaistua taatelitutkimusta löytyy, mutta lajike, kypsyys ja reseptin lisäesteet estävät tämän aineiston yhteisen suoran sidonnan. | Ei lisätty: yksikään tässä joukossa ei avaudu pelkällä GI-korjauksella. |
| Peruna eri valmistustavoissa | 3 | 2 | Keitetyn perunan lähde ei vastaa hitaasti öljyssä kypsennettyä tortilla-perunaa tai muita eri valmistuksia. | Estetty; ei yleistetty. |
| Tumma suklaa | 1 GI-este (+ kakun kaakao erikseen) | 1 olennaisen GI-esteen kannalta pienosuuden käsittelyn jälkeen | Olemassa oleva vuoden 2021 taulukon neljän ISO-testatun tumman suklaan keskiarvo (GI 29), sovellettuna alhaisen luottamuksen luokkakeskiarvona. | Hyväksytty yhdelle kakulle; maitosuklaa-match rajattiin testillä. |
| Maissitortilla | 2 | 2 olennaisen GI-esteen kannalta avokadon pienosuuskäsittelyn jälkeen | Olemassa oleva julkaistu kaupallisen maissitortillan ihmisillä mitattu lähde; pieni n ja leipäasteikon muunnos pitävät luottamuksen matalana. | Hyväksytty kahdelle reseptille; täsmällinen ruoka-/valmistusavain lisättiin. |
| Kuohukerma | 3 GI-estoa | 1 tapauksessa pieni osuus voidaan jättää pois; muut eivät avaudu | Kermaa koskevaa tarkkaa GI-lähdettä ei käytetty. Hyväksytyn reseptin osuus on alle 1 g/annos ja kumulatiivinen poisto alle 2 g/annos. | Hyväksytty yhdelle reseptille nykyisellä toimituksellisella toleranssilla; muissa raja tai lisäeste estää. |

Keskeiset lähteet:

- Henry et al., *International tables of glycemic index and glycemic load values 2021*, [AJCN / DOI 10.1093/ajcn/nqab233](https://doi.org/10.1093/ajcn/nqab233). Lähde erottaa ruoka- ja valmistuskohtaiset rivit sekä luokkakeskiarvot.
- Noriega et al., *Glycaemic and insulinaemic indices of Mexican foods high in complex carbohydrates*, [PubMed 10824718](https://pubmed.ncbi.nlm.nih.gov/10824718/). Tutkimus koskee kaupallista maissitortillaa, mutta osallistujia oli kahdeksan ja alkuperäinen vertailu oli leipä; tietueen Glucose 100 -muunnos ja LOW-luottamus säilyvät.
- *Green leafy porridges: how good are they in controlling glycaemic response?*, [PubMed 22849311](https://pubmed.ncbi.nlm.nih.gov/22849311/). GI 31 koskee riisiä ja kookosmaitoa sisältävää puuroa, joten sitä ei sidottu kookosmaitoon itsenäisenä ainesosana.
- ISO 26642:2010 GI-menetelmä, [ISO](https://www.iso.org/standard/43633.html), nykyiseksi vahvistettu 2021.

## Kevyt esiseulonta ja syväkatselmointi

Esiseulonnassa oli 12 reseptiä, jotka edustavat yhteisiä perheitä: `meksikolainen-aamiais-tacot-mustapavuilla`, `meksikolainen-paputostada-aamupalaksi`, `meheva-suklaakakku`, `vhh-kaalikaarryleet`, `shakshuka`, `congee-riisipuuro`, `ropa-vieja`, `nasi-uduk`, `pad-thai-vhh-konjac`, `kiinalainen-hirssipuuro-taateleilla`, `tortilla-de-patatas` ja `sate-ayam`. Näistä viisi käytiin syvään resepti-/lähdetarkasteluun: tortillareseptit (2), suklaakakku, kermakaalikääryleet ja kypsä tomaatti -vastaavuuden lähderajaus. Laajempaan tutkimukseen ei siirrytty, jos ruoka- tai valmistusvastaavuus jäi epäselväksi.

## Aalto A1 – hyväksytyt rajatut korjaukset

Neljä uutta arviota avautui olemassa olevien lähteiden tarkalla sidonnalla ja jo käytössä olevalla pienosuustoleranssilla:

| Resepti | GK / annos | Luokka | Luottamus | Uusi lähde / käsittely |
|---|---:|---|---|---|
| `meksikolainen-aamiais-tacot-mustapavuilla` | 16,04 | MEDIUM | LOW | kaupallinen maissitortilla; avokado 0,462 g/annos jätetään näkyvästi toleranssiin |
| `meksikolainen-paputostada-aamupalaksi` | 16,04 | MEDIUM | LOW | sama maissitortillalähde; avokado 0,462 g/annos jätetään toleranssiin |
| `meheva-suklaakakku` | 20,31 | HIGH | LOW | tumma suklaa -luokkakeskiarvo; kaakaojauhe 0,330 g/annos jätetään toleranssiin |
| `vhh-kaalikaarryleet` | 9,24 | LOW | LOW | kuohukerma 0,725 g/annos jätetään toleranssiin; reseptin kokonaispoisto 1,578025 g/annos |

Tortillareseptien tulos sisältää lisäksi 0,265 g/annos aiemmin kirjattua pienosuutta. Kakkuun sisältyy 0,3052 g/annos aiempaa pienosuutta. Kaikki poistetut osuudet jäävät ennen pyöristystä alle 2 g/annos. Neljä uutta arviota käyttää LOW-luottamusta; kahdessa käytetään julkaistua GI-tietuetta, joka on lähdematchin osalta tarkka mutta tutkimusnäytön osalta heikompi (tortilla), ja yhdessä tumma suklaa -luokkakeskiarvoa. Neljässä GK-luokka on laskennallinen vertailuluokka, ei kliininen tulkinta. Pienosuuden poisjättö ei lisää GK:ta; jos sen GI olisi myöhemmin mitattu, luokan vaikutus pitäisi arvioida uudelleen.

Regressioiden jälkeen inventaario on 325 / 138 / 187 / 42. Uusia GI-tietueita: 0. Aiemmat 134 laskettua arviota eivät muuttuneet; uusia estymisiä, rakenne-/syöte-/evidenssifingerprint-eroja ei havaittu. Neljä uutta arviota nosti laskettua kattavuutta 41,2 prosentista 42,5 prosenttiin.

## Rajauspäätös ja avoimet kysymykset

A1 pysäytettiin neljän hyväksytyn arvion jälkeen. Yhteisistä suurista ryhmistä ei löytynyt riittävää ruoka- ja valmistustapakohtaista GI-näyttöä lisäarvioihin: raakaa tomaattia ei yleistetty kypsäksi tomaattimurskaksi; keittokeskiarvoja ei käytetty liemille; puuron GI:tä ei siirretty kookosmaitoon; eikä kuivattujen taatelien eri lähteitä sidottu lajikkeeltaan määrittelemättömiin resepteihin. A2/A3-laskenta-aaltoa ei aloitettu, koska jäljellä olevat ehdokkaat eivät läpäisseet lähde- tai reseptivalmiuden porttia. Tavoiteltu 8–15 lisäarvion määrä jäi saavuttamatta lähde- ja match-rajoitusten vuoksi.

LOW-mallia ei muutettu. Neljä uutta arviota ovat LOW-luottamuksella; kaksi käyttää tortilla-arvoa ja yksi suklaan luokkakeskiarvoa. Pienosuuksien poisjättö koskee kolmea uutta laskentasyötettä ja yhteensä kaikkia neljää reseptiä (tortillaresepteissä pieni avokado, kakussa kaakao, kääryleissä kerma). Erillinen myöhempi katselmointi voi arvioida, kuinka usein LOW-luokan tulos muuttuisi mittausepävarmuuden vuoksi; tässä aineistossa ei ole perustaa numeeriselle herkkyysväitteelle.

## Testit ja GitHub-tila

Lopullisten testien, commitien, Draft PR:ien ja CI:n tila kirjataan tämän dokumentin viimeistelyssä. Reseptit PR avataan Draft-tilassa; ReportHubille luodaan eräkohtainen auditointiraportti ja Draft PR. Yhdistämistä tai tuotantojulkaisua ei tehdä.

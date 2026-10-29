# GK:n käyttäjätarkoitus ja lähdepolitiikka v2

R0-ehdotus; ei tuotantopolitiikka. Päivitetty 2026-10-29 Europe/Helsinki. Main 16a9c0444ff7b9d6ea61b20abd2c31b0d0ae9fa2.

## Tarkoitus

GK tukee annosten vertailua. Esitä perusteltu tieto imeytyvistä hiilihydraateista annosta kohti, sopiva GK-esitystapa tai ymmärrettävä syy tiedon puutteelle. GK on ainesosien laskennallinen summa, ei valmistetun aterian mittaus eikä yksilöllinen verensokeriennuste. Tavoite ei ole mahdollisimman monta desimaalia.

ADA 2026 korostaa yksilöllistä ravitsemushoitoa ja glykeemisen vaikutuksen huomioimista henkilön tarpeisiin ja insuliinisuunnitelmaan. Terveyskirjasto/Terveyskylä kuvaavat hiilihydraattimäärän ja hoitomuodon yksilöllistä merkitystä. Diabetes UK toteaa GI:n sivuuttavan annoskoon ja käsittelyn, kypsyyden, lajikkeen sekä aterian koostumuksen vaikuttavan tulkintaan. Nämä periaatteet eivät ole henkilökohtaisia hoito-ohjeita.

Ei insuliiniannoksen määrittämiseen eikä yksilölliseksi verensokeriennusteeksi. Älä kehota lääkitysmuutoksiin.

Lähteet: [ADA Standards of Care 2026](https://diabetesjournals.org/care/article/49/Supplement_1/S89/163932); [Diabetes UK](https://www.diabetes.org.uk/living-with-diabetes/eating/carbohydrates-and-diabetes/glycaemic-index-and-diabetes); [Terveyskirjasto](https://www.terveyskirjasto.fi/dlk01273); [Terveyskylä](https://www.terveyskyla.fi/diabetestalo/diabeteksen-omahoito/tyypin-1-diabeteksen-insuliinihoito/ateriainsuliini-ja-hiilihydraatit).

## Kuusi ehdotettua arviointitilaa

| Tila | Portti | Käyttäjälle |
|---|---|---|
| POINT | Nykyisen mallin lähde-, ruoka-, valmistus-, massa- ja CHO-ehdot täyttyvät. | GK-arvio noin 8/annos |
| RANGE | Samalle toteutuvalle reseptille lähteistetyt CHO- ja GI-rajat; riippuvuudet huomioitu. Ei SD/SEM:stä automaattisesti. | GK-arvio 7–11/annos |
| CLASS_ONLY | Kaikki hyväksytyt vaihtoehdot saman nykyisen luokan sisällä. | GK-luokka matala; tarkka luku epävarma |
| CONDITIONAL_SCENARIOS | Nimetyt ainesosa-/tuotevaihtoehdot, kullakin lähteet, syöte ja tulos. Ei muuta alkuperäisreseptiä. | Vesiversio …; maitoversio … |
| CARBOHYDRATE_ONLY | Koko CHO-annosmäärä luotettava, GI ei riitä GK:hon. Ei GK-luokka eikä GK-kattavuus. | CHO noin 18 g/annos; GK ei arvioitavissa |
| UNAVAILABLE | Olennaista CHO-massaa/koostumusta tai GI-vaikutusta ei voi perustella. | GK ei arvioitavissa: tuotetieto puuttuu |

Mitattu, laskennallinen piste, lähteistetty väli, skenaario ja puuttuva tieto ovat eri asioita. Legacy glycemicLoadRangePerServing ei ole GI-epävarmuusväli.

## Lähdeportit

CHO 0 ja puuttuva/null erotetaan; puuttuva GI ei ole nolla; tuntematon massa ei kelpaa toleranssiin. Lähteen laatuluokka ei ole sama asia kuin ruoka-/valmistusvastaavuus. Category mean ei mittaa yksittäistä tuotetta. REFERENCE_ONLY ei kelpaa laskentaan.

RANGE vaatii boundsit samalle tuotteelle ja valmistukselle. GI 100 ei ole yleinen yläraja; SD/SEM ei ole automaattinen min/max; mahdottomia yhteisvaihtoehtoja ei esitetä toteutuvina. CLASS_ONLY edellyttää että kaikki hyväksytyt vaihtoehdot kuuluvat samaan nykyiseen luokkaan. Pieni CHO yksin ei todista luokkaa. Skenaario ei muuta reseptiä/syötehistoriaa. Ei yleistä aterian rasva/proteiini/kuitu-kerrointa.

## 1 g / 2 g -sääntö

Alle 1 g yksittäinen ja alle 2 g kumulatiivinen poisjättöraja säilyy R0:ssa nykyisen pistemallin toimituksellisena sääntönä. Se ei ole kliininen turvallisuusraja eikä osoita RANGE:n ylärajaa. R0 ei muuta sitä. Myöhemmin verrataan nykyistä tiukkaa POINT-mallia, lähteistettyä vaikutusherkkyyttä ja skenaario/luokkamallia. Ei keksitä kerrointa tai GI-boundsia. Valinta perustuu näyttöön, luokkarajoihin, käyttäjätulkintaan ja ylläpitoon.

## Erilliset kattavuusmittarit

1. Hyväksytyn POINTin kattavuus.
2. Käyttökelpoinen GK-tieto: POINT/RANGE/CLASS_ONLY/täsmällinen scenario; CARBOHYDRATE_ONLY erillään.
3. Luotettavan koko annoksen CHO-tiedon kattavuus.
4. Arvio tai ymmärrettävä blocker (läpinäkyvyys).
5. Luokan vakaus: vakaa / ylittää rajan / määrittämätön.
6. False-confidence-riskit: perusteeton matala luokka, olennainen puute peitetty, turhat desimaalit, CHO sekoittuu GK:hon, tai henkilökohtainen hoitolupaus.

Nimittäjät ja arvioimattomat erikseen; ei yhdistelmäprosenttia. Turvallisuusvirheiden hyväksymisraja nolla. Muut rajat päätetään R1/P1:ssä; valittu 12 reseptin feasibility-otos ei ole kokoelman kattavuusotos.

## Omistajan päätökset ennen P1:tä

RANGE:n semantiikka ja riippuvuudet; CLASS_ONLY näyttökynnys; arviointiskeema/fingerprintit/vanheneminen; FI/EN/SV/TH termit; KPI-nimittäjät/rajat; menettely 1g/2g:n arviointiin; hyväksytäänkö 2021 katsauksen raw strawberry GI40 supplementaryksi täsmälleen samaan muotoon.

## Ehdotetut nimitykset kielittäin (käännöskatselmointi vaaditaan)

Nämä ovat suunnittelutason termiehdotuksia, eivät hyväksyttyjä käyttöliittymäkäännöksiä:

| State | FI | EN | SV | TH |
|---|---|---|---|---|
| POINT | Pistearvio | Point estimate | Punktuppskattning | ค่าประมาณแบบจุด |
| RANGE | Lähteistetty vaihteluväli | Evidence-based range | Evidensbaserat intervall | ช่วงค่าที่อิงหลักฐาน |
| CLASS_ONLY | Vain GK-luokka | Class only | Endast GK-klass | แสดงเฉพาะระดับ GK |
| CONDITIONAL_SCENARIOS | Ehdolliset vaihtoehdot | Conditional scenarios | Villkorade scenarier | สถานการณ์แบบมีเงื่อนไข |
| CARBOHYDRATE_ONLY | Vain hiilihydraattimäärä | Carbohydrate amount only | Endast kolhydratmängd | แสดงเฉพาะปริมาณคาร์โบไฮเดรต |
| UNAVAILABLE | Ei arvioitavissa | Unavailable | Kan inte bedömas | ประเมินไม่ได้ |

Thai/Swedish/Finnish copy needs native-language review and comprehension testing in R4; do not publish these labels from R0.

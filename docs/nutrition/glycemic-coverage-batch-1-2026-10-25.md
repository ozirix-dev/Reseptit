# GI-lähteiden kattavuus, erä 1 (2026-10-25)

## Lähtötilanne

Analyysin lähtöcommit on julkaistu Reseptit `main` `b51c769731ba40f9ab0b085e5b1b47f979651d9f`. Sen toistettava GK-auditointi kattoi 325 reseptiä: 112 laskettiin (34,5 %) ja 213 estettiin (65,5 %). GI-katalogissa oli 37 tietuetta (4 STRONG, 33 SUPPLEMENTARY).

Uudelleen ajettu strict-ravintoarvoauditointi tuotti 325 lähderiviä: 180 `ESTIMATE WITH EVIDENCE`, 86 `INSUFFICIENT SOURCE DATA`, 59 `MISSING`, 0 ristiriitaa. Näistä 213 GK-estetystä reseptistä 115 kuuluu tuettujen ravintoarvojen ryhmään, 44 vaatii ravintoarvon tarkistuksen ja 54:ltä ravintoarvoaineisto puuttuu.

## Kaikkien estojen inventaario

Kaikkien 213 reseptin jokainen estoviesti, ensisijainen syy, päällekkäiset kategoriat, ravintoarvotila, reseptin lähdesidonnat ja toimenpide-ehdotus ovat [koneellisessa inventaariossa](glycemic-coverage-inventory-2026-10-25.json). Luokat ovat päällekkäisiä, eivätkä prosentit summaudu. Inventaarion voi rakentaa uudelleen `site`-kansiosta komennoilla `npm run audit:nutrition -- --strict`, `npm run audit:glycemic-load` ja `npm run audit:glycemic-coverage`; jälkimmäinen käyttää versionoitua ennen/jälkeen-auditointia säilyttääkseen 213 reseptin julkaistun lähtöjoukon, vaikka erä 1 jo avaa kaksi niistä.

| Luokka | Reseptit | Estoviestit | Aiemmin laskettu, nyt estetty | Jo lähtötilanteessa keskeneräinen |
| --- | ---: | ---: | ---: | ---: |
| A: GI-arvo puuttuu | 42 | 44 | 1 | 41 |
| B: GI:n ruoka-/valmistusvastaavuus ei täsmää | 50 | 57 | 44 | 6 |
| C: Vain täydentävä tai riittämätön GI-lähde | 63 | 81 | 30 | 33 |
| D: Hiilihydraatti- tai koostumustieto puuttuu | 66 | 85 | 0 | 66 |
| E: Määrä-, massa- tai valmistusmuunnos ratkaisematta | 18 | 21 | 1 | 17 |
| F: Reseptin tai laskentasyötteen rakennesidonta vanhentunut | 51 | 51 | 0 | 51 |
| G: Alle 2 g:n kumulatiivinen toleranssi ylittyy | 7 | 7 | 5 | 2 |
| H: Muu yksilöity ongelma | 56 | 68 | 1 | 55 |

213 keskeneräisestä 78 oli aiemmin laskettuja ja 135 oli jo lähtötilanteessa keskeneräisiä. Pelkkä GI-lähteen lisäys ei ratkaise koostumus-, muunnos- eikä vanhentunutta reseptisidontaongelmaa.

## GI-kohteiden prioriteetit ja lähdetarkistus

Kaikkien 15 priorisoidun lähdeaukon koostumus-ID:t, reseptimäärät, per-annoshiilihydraatit, mahdolliset ainoat estot, ehdokkaat ja arvioitu vaikeus ovat [prioriteettilistassa](glycemic-coverage-priorities-2026-10-25.md). Järjestys painottaa uudelleenkäyttöä ja hiilihydraattimäärää; pistemäärä ei ole kliininen vaikutusarvio.

Tutkimuskohteet ja päätökset:

| Kohde | Lähdenäyttö ja vastaavuus | Erä 1 päätös |
| --- | --- | --- |
| Aloo paratha: muussattu peruna | International Tables 2021 Supplemental Table 1 entry 1861: geneerinen muussattu peruna (China, 2005), GI 73 ± 3; 10 tervettä osallistujaa, 50 g imeytyvää hiilihydraattia, glukoosivertailu, 2 h. Yang ym. (2006) raportoivat erilliset tuotteet: muussattu peruna 73,0 ± 9,2 ja kypsennetty peruna 66,4 ± 3,8; kummassakin n=10. Resepti keittää ja muussaa perunan, mutta lajiketta, jäähdytystä eikä taikinan sisällä pannulla kypsennystä ole vastaavasti tutkittu. | Käytetään GI 73:a matalan luottamuksen muussatun perunakomponentin analogiana. Tämä ei ole aloo parathan eikä seka-aterian mitattu GI. |
| Samosa: keitetty peruna | Supplemental Table 1 entry 1842 kuvaa määrittämättömän lajikkeen keitetyn perunan (China, 2005), GI 66 ± 1; n=10, 50 g imeytyvää hiilihydraattia, glukoosivertailu ja 2 h. Yang ym. raportoivat samaa lukemaa vastaavan cooked-potato-arvon 66,4 ± 3,8, mutta eivät kerro alkuperäisartikkelin taulukossa keittotapaa. Samosa keittää ja kuutioi perunan, paistaa täytettä hetken, ja friteeraa täytetyn taikinan. | Säilytetään GI 66 vain matalan luottamuksen keitetyn perunakomponentin analogiana. Jatkokypsennys, öljy, kuori, lajike ja mahdollinen jäähdytys eroavat; valmiin samosan GI:tä ei väitetä mitatuksi. |
| Maissitortilla | Noriega ym. (2000) mittasivat 8 terveellä koehenkilöllä maissitortillan GI:n 73,8 leipäasteikolla. Pieni tutkimus ja tässä lähdekirjauksessa epäselvä muunnos glukoosiasteikolle eivät riitä nostamaan arvoa julkaisutasolle. [Julkaistu tutkimus, PubMed](https://pubmed.ncbi.nlm.nih.gov/10824718/) | Pidetään nykyisenä SUPPLEMENTARY-ehdokkaana; ei avata GK:ta tämän perusteella. |
| Paella valenciana: laimennettu kanalientä | Fineli-tietueen imeytyvä hiilihydraatti on noin 1,07 g annosta kohti. Liemelle ei löytynyt julkaistua, valmistustapaa vastaavaa GI-mittausta. Lihan tai muun eläinruoan GI:tä ei voi siirtää liemeen. | GK pysyy estettynä. Tunnettua hiilihydraattia ei nollata eikä 2 g:n sääntöä käytetä, koska yksittäinen osuus ylittää 1 g. |
| Shakshuka: tomaattimurska | Nykyinen GI 22 on mitattu kokonaiselle raa'alle tomaatille. Löydetty lähde ei osoita kypsennetyn tomaattimurskan GI:tä; pelkkä sama kasvilaji ei vahvista valmistusvastaavuutta. | Hylätään raaka-tomaatin käyttö kypsässä kastikkeessa. GK pysyy estettynä. |
| Jiaozi: riisiviinietikka, soijakastike ja taikinalevyt | 12 g riisiviinietikan koostumus on ratkaisematta, 24 taikinalevyn lähdekoostumus puuttuu, soijakastikkeelle ei ole GI-tietuetta ja reseptin rakenne on muuttunut. Riisin GI:tä ei soviteta riisiviinietikkaan. | Ei GI-korjausta ennen koostumus- ja rakennekysymysten ratkaisemista. Tuntematonta koostumusta ei käsitellä nollana. |
| Jianbing: soijapaputahna | Yksi ruokalusikallinen ei yksilöi tuotetta eikä grammapainoa; reseptin auditointi luokittelee ongelman määrän/koostumuksen ratkaisemattomaksi. Misoa koskeva postprandiaalinen tutkimus ei anna tahnalle suoraan siirrettävää GI-arvoa. [Momose ym. (2010), julkaistu tutkimus](https://doi.org/10.3136/nskkk.57.63) | Ei korvata misolla tai soijakastikkeella; ei GI-muutosta. |
| Nasi goreng: kecap manis | 150 g makeaa soijakastiketta on merkittävä hiilihydraattilähde, mutta tuotetta tai etikettiä ei ole yksilöity. | Ensin tuotteen koostumus- ja määrävastaavuus; GI ei ratkaise puuttuvaa hiilihydraattitietoa. |
| Samosa ja aloo paratha | Keitetyn perunan GI-analogian matching-avaimet puuttuivat laskentasyötteestä, vaikka reseptiohjeet ja massaevidenssi dokumentoivat keittämisen. | Täsmäys korjattu lähteistetysti kahdessa reseptissä; laskentafingerprintit päivitetty näille kahdelle syötteelle. |

Yang ym. testasivat 8–12 tervettä aikuista eri ruokia; perunataulukoiden kummankin tuotteen n=10. Osallistujat paastosivat 10 tuntia, saivat 50 g imeytyvää hiilihydraattia, vertailuna käytettiin glukoosia ja verenglukoosi mitattiin kahden tunnin ajan 15 minuutin välein alkaen 0 minuutista. Artikkeli kuvaa venaverinäytteet ja Woleverin AUC-kaavan, mutta ei määritä perunatuotteiden lajiketta, cooked-potaton täsmällistä valmistusta eikä analyysimenetelmää. Taulukon 66 ± 1 on yhdenmukainen alkuperäistutkimuksen 66,4 ± 3,8 -keskiarvon kanssa (66 pyöristettynä; hajonnan raportointitapa eroaa), mutta alkuperäisartikkeli ei yksin vahvista keittämistä. GI 73,0 ± 9,2 on erillinen muussattu tuote, ei sama tuote kuin 66,4.

Supplemental Table 1 kuvaa sekä entryn 1842 keitetyksi että entryn 1861 muussatuksi ja määrittelee taulukon ISO-menetelmän kanssa yhdenmukaiseksi aineistoksi. Molempien rivien verinäytteiden analyysimenetelmä on kuitenkin merkitty `NS`. ISO-kelpoisuus on siis vahvistettu vuoden 2021 koontitaulukon luokituksen tasolla; alkuperäistutkimuksen yksittäistä laboratorioprotokollaa ei voi näistä julkaistuista tiedoista itsenäisesti varmistaa. [Yang ym. (2006), alkuperäisartikkeli](https://doi.org/10.3748/wjg.v12.i21.3430), [International Tables 2021](https://doi.org/10.1093/ajcn/nqab233), [ISO 26642:n tilatiedot](https://committee.iso.org/standard/43633.html).

## Toteutettu muutos ja vaikutus

Lisäsin GI 73 -tietueen Supplemental Table 1 entry 1861:stä ja vaihdoin aloo parathan perunakomponentin vastaamaan muussattua lähdetuotetta. Samosa säilyttää GI 66 -tietueen. Molempien evidenssi nimeää erikseen lähdetuotteen, reseptin jatkokäsittelyn ja vastaavuuden epävarmuuden. GI-lähteiden laatu, komponenttivastaavuus ja koko GK-arvion luottamus pidetään erillisinä: molemmat komponentit ovat `ANALOG` ja molemmat kokonaisarviot LOW confidence. GI-tietueita on nyt 38 (5 STRONG, 33 SUPPLEMENTARY); historiallinen lähtöinventaario säilyttää alkuperäiset 37 tietuetta ja 4 STRONG / 33 SUPPLEMENTARY -luvut. GK-kaavaa, julkaistua GK-mallia tai toimituksellista hiilihydraattitoleranssia ei muutettu.

Ennen erää: 325 reseptiä, 112 laskettua ja 213 keskeneräistä. Ensimmäisen toteutuksen jälkeen: 114 laskettua ja 211 keskeneräistä. Tämä lähdetarkistus pitää määrät samoina: molemmat arviot ovat edelleen laskettuja LOW confidence -arvioita, mutta aloo parathan GI 73 -tarkennus muuttaa sen GK:n 42,42:sta 43,50:een / annos. Samosan GK pysyy 43,99:ssa / annos. Kaikki luvut ovat ainesosapohjaisia arvioita, eivät valmiiden ruokien mittauksia. Strict-ravintoarvoauditoinnin määrät pysyivät 180 / 86 / 59 / 0.

GI-tietueen `STRONG` kuvaa lähdemittauksen laatuluokitusta koontitaulukossa; se ei vahvista vahvasti valmista samosaa tai parathaa. Molemmat reseptikohtaiset vastaavuudet ovat `ANALOG`, mikä pakottaa koko laskennallisen GK-arvion luottamuksen LOW-tasolle. Ainesosasumma ei ole valmiin ruoan tai seka-aterian verensokerivasteen mittaus.

## Jäljellä olevat työt ja auditointi

Seuraavaksi kannattaa korjata rakennesidonnat ja koostumustiedot ennen laajoja GI-hakuja, erityisesti resepteissä, joiden ainoa GI-este ei ole ravintoarvoauditissa tuetussa ryhmässä. Kecap manis, kookosmaito, maissituotteet, kanaliemi ja kypsennetty tomaatti vaativat tuote- tai valmistuskohtaista näyttöä. Corn tortilla ja perunaa sisältävät kansainväliset sekaruoat vaativat vastaavuusarvion; nykyisiä täydentäviä tai väärään valmistukseen sovitettuja arvoja ei nosteta automaattisesti.

Strict nutrition audit pysyi määriltään ennallaan (180 / 86 / 59 / 0). GK-auditointi ajettiin uudelleen kaikille 325 reseptille. Lisätylle vastaavuudelle on regressiotesti, joka tarkistaa lähde-ID:n, vastaavuusavaimet, LOW-confidence-analogian ja laskettavan tuloksen.

Laskenta käyttää GI × imeytyvä hiilihydraatti / 100 -summaa ainesosittain. Menetelmä ei ole valmiin seka-aterian GI-mittaus; satunnaistetussa tutkimuksessa julkaistujen ainesosaarvojen summa-arvio yliarvioi mitatun aterian GI:tä 12–19 yksikköä eri aterioissa. [Camps ym. (2011)](https://pubmed.ncbi.nlm.nih.gov/21831990/).


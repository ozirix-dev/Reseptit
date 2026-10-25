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
| Keitetty peruna: aloo paratha ja samosa | International Tables 2021 Supplemental Table 1:n testattu ruoka on keitetty, lajikkeeltaan määrittämätön peruna (testivuosi 2005); GI 66 glukoosiasteikolla. Katalogin lähderivillä on 10 osallistujaa ja kahden tunnin testi. Taulukko luokittelee tämän riviryhmän ISO-menetelmäsuosituksen mukaiseksi, mutta alkuperäistä laboratorioprotokollaa ei voitu erikseen varmistaa. Reseptit keittävät perunan ensin; jatkokypsennys ja ruoka-annoksen seos eivät kuitenkaan ole sama testiruoka. | Käytetään olemassa olevaa, eksplisiittisesti matalan luottamuksen perunakomponentin analogiaa. Tietue ei väitä samosan, parathan tai seka-aterian GI:tä. Ei lisättyä GI-tietuetta. |
| Maissitortilla | Noriega ym. (2000) mittasivat 8 terveellä koehenkilöllä maissitortillan GI:n 73,8 leipäasteikolla. Pieni tutkimus ja tässä lähdekirjauksessa epäselvä muunnos glukoosiasteikolle eivät riitä nostamaan arvoa julkaisutasolle. [Julkaistu tutkimus, PubMed](https://pubmed.ncbi.nlm.nih.gov/10824718/) | Pidetään nykyisenä SUPPLEMENTARY-ehdokkaana; ei avata GK:ta tämän perusteella. |
| Paella valenciana: laimennettu kanalientä | Fineli-tietueen imeytyvä hiilihydraatti on noin 1,07 g annosta kohti. Liemelle ei löytynyt julkaistua, valmistustapaa vastaavaa GI-mittausta. Lihan tai muun eläinruoan GI:tä ei voi siirtää liemeen. | GK pysyy estettynä. Tunnettua hiilihydraattia ei nollata eikä 2 g:n sääntöä käytetä, koska yksittäinen osuus ylittää 1 g. |
| Shakshuka: tomaattimurska | Nykyinen GI 22 on mitattu kokonaiselle raa'alle tomaatille. Löydetty lähde ei osoita kypsennetyn tomaattimurskan GI:tä; pelkkä sama kasvilaji ei vahvista valmistusvastaavuutta. | Hylätään raaka-tomaatin käyttö kypsässä kastikkeessa. GK pysyy estettynä. |
| Jiaozi: riisiviinietikka, soijakastike ja taikinalevyt | 12 g riisiviinietikan koostumus on ratkaisematta, 24 taikinalevyn lähdekoostumus puuttuu, soijakastikkeelle ei ole GI-tietuetta ja reseptin rakenne on muuttunut. Riisin GI:tä ei soviteta riisiviinietikkaan. | Ei GI-korjausta ennen koostumus- ja rakennekysymysten ratkaisemista. Tuntematonta koostumusta ei käsitellä nollana. |
| Jianbing: soijapaputahna | Yksi ruokalusikallinen ei yksilöi tuotetta eikä grammapainoa; reseptin auditointi luokittelee ongelman määrän/koostumuksen ratkaisemattomaksi. Misoa koskeva postprandiaalinen tutkimus ei anna tahnalle suoraan siirrettävää GI-arvoa. [Momose ym. (2010), julkaistu tutkimus](https://doi.org/10.3136/nskkk.57.63) | Ei korvata misolla tai soijakastikkeella; ei GI-muutosta. |
| Nasi goreng: kecap manis | 150 g makeaa soijakastiketta on merkittävä hiilihydraattilähde, mutta tuotetta tai etikettiä ei ole yksilöity. | Ensin tuotteen koostumus- ja määrävastaavuus; GI ei ratkaise puuttuvaa hiilihydraattitietoa. |
| Samosa ja aloo paratha | Keitetyn perunan GI-analogian matching-avaimet puuttuivat laskentasyötteestä, vaikka reseptiohjeet ja massaevidenssi dokumentoivat keittämisen. | Täsmäys korjattu lähteistetysti kahdessa reseptissä; laskentafingerprintit päivitetty näille kahdelle syötteelle. |

ISO 26642:2010:n julkinen ISO-sivu ilmoittaa standardin julkaistuksi ja sen olleen vahvistettu 2021, mutta sivu näyttää myös uuden systemaattisen katselmoinnin vuonna 2026. Sivu ei itsessään todista yksittäisen tutkimuksen menettelyä. Siksi erä ei väitä tarkistaneensa alkuperäisen perunatutkimuksen laboratorioprotokollaa; GI 66:n kelpoisuus perustuu vuoden 2021 taulukon Supplemental Table 1 -luokitukseen, ja analogiavastaavuus merkitään erikseen. [ISO:n tilatiedot](https://committee.iso.org/standard/43633.html), [International Tables 2021](https://doi.org/10.1093/ajcn/nqab233).

## Toteutettu muutos ja vaikutus

Lisäsin `foodKey: potato` ja `preparationKey: boiled-unspecified` Aloo parathan ja samosan perunasyötteisiin. Evidenssiteksti kuvaa keitetyn perunan lähteen, loppuvalmistuksen eron ja sen, ettei GI 66 ole valmiin ruoan mittaus. Analogian tulos on LOW confidence. GI-katalogiin ei lisätty eikä poistettu tietueita: edelleen 37 (4 STRONG, 33 SUPPLEMENTARY). GK-laskentakaavaa, julkaistua GK-mallia tai alle 1 g / kumulatiivista alle 2 g:n toimituksellista toleranssia ei muutettu.

Ennen erää: 325 reseptiä, 112 laskettua, 213 keskeneräistä. Erän jälkeen: 325 reseptiä, 114 laskettua, 211 keskeneräistä. Kaksi aiemmin laskentamallin tarkistuksessa estynyttä arviota avautui: Aloo paratha GK 42,42 ja samosa GK 43,99 / annos, molemmat LOW confidence. Molemmat luvut vastaavat ennen estoa tallennettuja pyöristettyjä arvoja; numeerista GK-muutosta vanhaan tallennettuun lukuun ei tullut. Julkaistun GK-luokan tulos on molemmissa HIGH. Yhtään lähtötilanteessa lasketuksi merkittyä arviota ei estynyt tässä erässä.

GK-tietueen avaaminen tarkoittaa, että mallin lähdetarkistukset läpäisevät annetulla perunakomponentin analogialla. Se ei ole mitattu valmiin samosan tai parathan verensokerivaste. Uusien arvioiden matala luottamus ja ainesosaperusteisen kaavan rajoite näytetään laskennan lähde-evidenssissä.

## Jäljellä olevat työt ja auditointi

Seuraavaksi kannattaa korjata rakennesidonnat ja koostumustiedot ennen laajoja GI-hakuja, erityisesti resepteissä, joiden ainoa GI-este ei ole ravintoarvoauditissa tuetussa ryhmässä. Kecap manis, kookosmaito, maissituotteet, kanaliemi ja kypsennetty tomaatti vaativat tuote- tai valmistuskohtaista näyttöä. Corn tortilla ja perunaa sisältävät kansainväliset sekaruoat vaativat vastaavuusarvion; nykyisiä täydentäviä tai väärään valmistukseen sovitettuja arvoja ei nosteta automaattisesti.

Strict nutrition audit pysyi määriltään ennallaan (180 / 86 / 59 / 0). GK-auditointi ajettiin uudelleen kaikille 325 reseptille. Lisätylle vastaavuudelle on regressiotesti, joka tarkistaa lähde-ID:n, vastaavuusavaimet, LOW-confidence-analogian ja laskettavan tuloksen.

Laskenta käyttää GI × imeytyvä hiilihydraatti / 100 -summaa ainesosittain. Menetelmä ei ole valmiin seka-aterian GI-mittaus; satunnaistetussa tutkimuksessa julkaistujen ainesosaarvojen summa-arvio yliarvioi mitatun aterian GI:tä 12–19 yksikköä eri aterioissa. [Camps ym. (2011)](https://pubmed.ncbi.nlm.nih.gov/21831990/).


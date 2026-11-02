# GK80 – viiden E-HOLD-tapauksen julkaisukatselmointi

Pohja: Reseptit main `c5393a10a07fdb5f97bd50a1d14f2747f4488cbe`.
Tutkimustodiste: PR #170, HEAD `87c603bfe5ded3b1fe6af1abdaa5b0442ebc5051`.
Tutkimushaaraa ei muutettu. Tämä Draft sisältää kolme uutta täsmällistä
reseptiversiota sekä koko viiden tapauksen päätökset. Omistajan hyväksyntää
ei ole päätelty aiemmista eristä. Ready, merge ja deploy eivät ole valtuutettuja.

## Koko erä

| Resepti | Päätös | GK/annos | Julkiset makrot |
| --- | --- | ---: | --- |
| Tomaatti-kananmuna-wokki | Katselmoitava Draft-ehdokas | 30,07 | Uusi täydellinen paketti |
| Pasta alla Norma | Katselmoitava Draft-ehdokas | 30,05 | Kaikki neljä pidätetty |
| Döner kebab | Katselmoitava Draft-ehdokas | 20,66 | Uusi täydellinen paketti |
| Carnitas-salaattitacot | HOLD säilyy | – | Ennallaan |
| Marokkolainen couscous | HOLD säilyy | – | Ennallaan |

Kaikki kolme lukua ovat LOW-luottamuksen ainesosamalleja, eivät mitattuja
ateriavasteita. Julkinen näyttö pyöristää luvut nykyisen menetelmän mukaisesti
yhteen merkitsevään numeroon. GI:n SEM-arvoista ei tehdä reseptin vaihteluväliä.
PI-poissulut, polyolien lähdevaatimukset sekä GK- ja makropoikkeamien rajat
säilyvät ennallaan.

Mainin julkaistu lähtötila on 143/326 (43,87 %). Draft-ehdokas on
146/326 (44,79 %), kasvua kolme eli 0,92 prosenttiyksikköä. Tätä ei esitetä
tuotantokattavuutena. Kaikki aiemmat 143 numeerista tulosta ja muiden
323 reseptin kokonaiset GK-tulosobjektit suojataan vertailuhasheilla.
Teehaudutetut munat ja kaksi jäljelle jäävää E-HOLDia pysyvät keskeneräisinä.

## Omistajalle tuotavat versio- ja lähdesovelluspäätökset

- **Wokki:** 150 g kuivaa SunRice Jasmine Fragrant -riisiä kolmeksi annokseksi,
  koko erä riisinkeittimestä kuumana. Tämä on uusi määritelty annosversio,
  **ei muunnos aiemmasta 450 g:n kypsästä riisimäärästä**. Riisin koostumus
  on erillinen Fineli 11521:n kuivan pitkäjyväisen riisin LOW-proxy.
  [Venn 2014](https://doi.org/10.1186/1475-2891-13-50) antaa nimetylle
  jasmiiniriisille GI:n 68 Eurooppa-kohortissa. Vesimäärän tai saannon
  historialliseen vastaavuuteen ei vedota. Basmati, mikrovalmis tai
  jäähdytetty/uudelleenkuumennettu riisi eivät kuulu versioon.
- **Norma:** 350 g kuivaa De Cecco Penne Mezzane Lisce n.140 -pastaa,
  keitto 11 minuuttia ja tarjoilu kuumana; alkuperäisessä ohjeessa sallittu
  50 g pecorinovaihtoehto valitaan (Auricchio). Parmesan-korvausta ei tehdä.
  [Scazzina 2016](https://doi.org/10.1016/j.numecd.2016.02.013) vahvistaa
  pakkauksen keittoaikaan perustuvan protokollan. GI 47 on julkaistu
  penne mezzane -vertailu: nykyisen tuotenumeron tai vuoden 2008 testierän
  identtisyyttä ei väitetä. Fineli 117 on erillinen kuivan pastan proxy.
  Pecorinon hiilihydraattiraja antaa GK-poisrajaukseen alle 0,0625 g/annos,
  mutta puuttuva polyolitieto estää koko makropaketin. Mitään neljästä
  vanhasta makroarvosta ei siirretä uuden version evidenssiksi.
- **Döner:** alkuperäinen neljän leivän määrä säilyy, tarkennuksena neljä
  Tesco White Plain -pitaleipää à 60 g. Lämmitys huoneenlämpöisestä
  leivänpaahtimessa 1–2 minuuttia pakkauksen mukaan.
  [Henry 2005](https://doi.org/10.1079/BJN20051594), taulukko 2 rivi 9,
  antaa tavalliselle valkoiselle Tesco Value -pitalle GI:n 69 (n=10,
  SEM=20). Mini-pitan GI:tä 68 ei käytetä. Nykyinen leipä on LOW-sovellus,
  ei sama historiallinen valmistuserä. Koostumus on erillinen Fineli 1056
  -proxy; nykyinen Tesco-etiketti ei todista polyoleja nollaksi.
  Kaalisalaatin 200 g määritellään: 180 g kaalia + 10 g viinietikkaa +
  10 g oliiviöljyä. Lisäksi naudanliha 17 % ja jogurtti 10 % täsmennetään.

## Todelliset jäljelle jäävät esteet

Carnitasin appelsiini sisältää sekä mehua että hedelmäpaloja ja kypsyy
lihan mukana 2,5 tuntia. Raaka-appelsiinin GI 45 ei osoita tämän version
GI:tä; lähdekoostumuksella osuus ylittää yksittäisen poisrajauksen rajan.
Hedelmää ei poisteta eikä kypsennyshävikkiä keksitä. Myös limetin mehu
on erotettava kokonaisen hedelmälihan proxy-arviosta ennen integraatiota.

Couscousin nimetyt lähteet eivät osoita 15 minuuttia padassa kuumennettujen
kikherneiden vastetta. Tutkimusversion rintalihavaihtoa alkuperäiseen
koipireisivaihtoehtoon sekä koko liemilitran käyttöä ei hyväksytä hiljaisesti.
Tarvitaan alkuperäisen kanavaihtoehdon syötävä punnitus, nautitun liemen
määrä/koostumus ja perusteltu valmistusvastaavuus. Kylmäksi muutettua
kikhernelisuketta tai yleistä GI-keskiarvoa 28 ei käytetä oikopoluksi.

## Evidenssi ja tarkistukset

- [Päätökset kaikille viidelle](decisions.json) ja
  [lähteiden faktat sekä rajaukset](source-review.json).
- [Integraation hashit ja syötteet](integration.json), uudet laskentatiedostot
  ja FI/EN/SV/TH-tekstit sidotaan täsmällisesti toisiinsa.
- [Aiemman mainin vertailu](main143-baseline.json) sekä kolme vanhaa
  makroevidenssiä säilytetään historiallisina, ei uuden version hyväksyntänä.
- [Kohdennetut tulokset](targeted-results.json), riippumaton
  [Decimal-varmennin](verify_decimal.py) ja `gk80-ehold.test.ts` tarkistavat
  laskennan, poisrajaukset, makrot ja aiempien tulosten regression.
- Testien historialliset eränäkymät palauttavat vain näiden kolmen reseptin
  edelliset HOLD-tulosobjektit. Erillinen nykytilan regressio tarkistaa
  146/326-tuloksen ja kaikkien muiden objektien muuttumattomuuden.

ReportHub, PR #170 ja muut PR:t eivät sisälly julkaisuun. Uutta laajaa
tutkimusajoa tai menetelmämuutosta ei tehty. Koko erä odottaa omistajan
sisältö- ja proxyhyväksyntää; tämä Draft ei käynnistä julkaisua.

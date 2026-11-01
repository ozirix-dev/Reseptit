# GK-80 — seuraavan seitsemän reseptin julkaisukatselmointi

Tila: PARTIAL — 5 numeerista ehdokasta, 2 HOLD. Draft; omistajan menetelmä- ja
sisältöhyväksyntä puuttuu. Tämä erä ei ole julkaisuvaltuutus.

Main-pohja: dc388dcb51fbdbdd06e31ebe1e8e25885d48567d.
Lukittu tutkimushaara: f3777a8c423f4cb49eb67b0f2aca318aaebb7531.
Kaikkien seitsemän alkuperäiset bundleHash-arvot on tarkistettu. PR sisältää vain
nämä seitsemän katselmointitapausta; muiden 20 tutkimusversion paketteja ei tuoda.

## Päätettävä erä

Kaikki luvut ovat annosta kohden. Hiilihydraatit, proteiini ja rasva ovat grammoja.
Kokonais-CHO sisältää kuidun ja polyolit. GK-sarake on pyöristämätön malliluku;
käyttöliittymä näyttää likiarvon. Kaikki viisi ehdokasta ovat LOW-luottamustasolla.

| Täsmällinen versio | Netto-CHO | Kokonais-CHO | Proteiini | Rasva | GK |
| --- | ---: | ---: | ---: | ---: | ---: |
| Butter chicken – punnittu hunajaversio | 11.54 | 13.17 | 38.73 | 36.96 | 4.9793 |
| Som tam kurkusta – punnittu versio | 5.33 | 9.7 | 3.78 | 4.24 | 1.873175 |
| Shakshuka kotiharissalla – punnittu versio | 5.81 | 7.77 | 8.08 | 12.81 | 2.346595 |
| Moo ping – koko marinadin pannuversio | 2.16 | 4.81 | 33.14 | 33.56 | 0.9868 |
| Kermainen lanttulaatikko – makeuttamaton versio | 13.11 | 16.79 | 4.82 | 25.98 | 5.140625 |

- Palak paneer: HOLD, ei uutta julkaistavaa koko aterian lukua.
- Nakkikeitto kukkakaalilla: HOLD, ei uutta julkaistavaa koko aterian lukua.

Ehdokaskattavuus on 119/326 (36,50 %), puutteellisia 207. Tuotannon viimeksi
varmennettu kattavuus on 114/326 (34,97 %). Viisi ehdokasta lyhentää matkaa
261 reseptin 80 prosentin tavoitteeseen 147:stä 142 reseptiin vasta julkaisun jälkeen.
Seitsemän tapauksen katselmointi ei tarkoita seitsemää uutta julkaistavaa tulosta.

## Kaksi täsmennettyä HOLD-päätöstä

Aiempi tutkimusluokitus oli näiden kahden osalta liian vahva. Nykyinen
ravintomalli edellyttää varmennettua polyolimäärää netto- ja kokonais-CHO:lle.
Puuttuvaa määrää ei korvata nollalla eikä yleistä mallia väljennetä.

Palak paneerin Matvaretabellen 01.301 / N01301-r6 ilmoittaa CHO 0 g,
proteiinia 26 g ja rasvaa 24,5 g / 100 g. Hiilihydraattien menetelmä MI0181
on sokerien ja tärkkelyksen summa. Se ei osoita polyolimäärää; alcohol-kenttä
koskee etanolia. Tarkistettu
[alkuperäinen paneer-tietue](https://www.matvaretabellen.no/en/cheese-paneer/).
Tuotekohtaista korvaavaa suomalaista paneeria ei ole sidottu tähän versioon.

Nakkikeiton USDA 170917 / U170917-r6 laakerinlehden kokonais-CHO 74,97 g
miinus kuitu 26,3 g antaa 48,67 g / 100 g koostumusproxyn. Polyolimäärä
on silti vahvistamatta. Koko 0,2 g:n mausteannoksen syöminen ei oikeuta sen
poistamista laskennasta tai polyolien keksimistä nollaksi.

[held-review.json](held-review.json) säilyttää kummankin alkuperäisen lukitun
tutkimuspaketin ja päätösperusteen. Tutkimusluvut 1,1536875 ja 5,3852925 ovat
diagnostisia ehdotuksia, eivät uuden julkaisun varmennettuja kokonaisarvoja.
Molempien elävät FI- ja käännösreseptit säilyvät muuttumattomina.

## Viiden ehdokkaan tarkka rajaus

- Butter chicken: 700 g raakaa nahatonta, luutonta reisilihaa, 150 g
  maustamatonta laktoositonta 7 % kreikkalaista jogurttia, 200 g 38 % kermaa,
  21 g hunajaa, 13,5 g oliiviöljyä ja 30 g voita. Garam masala 4 g koostuu
  kuudesta eritellystä mausteesta; lisäksi 2 g juustokuminaa. Kaikki marinadi
  ja kastike syödään. Riisi ja naan eivät kuulu versioon.
- Som tam: 500 g syötävää kurkkua siemenkodan poiston jälkeen, 100 g
  kypsiä valutettuja vihreitä papuja, 30 g kokonaisia paahdettuja suolattomia
  maapähkinöitä karkeasti rouhittuina ja 4 g Foodin-erytritolia.
  Kalakastike käyttää yleistä AFCD-koostumusproxyä, ei varmennettua brändiä.
- Shakshuka: 5 g kotiharissaa = chili 2,5 g, valkosipuli 0,8 g,
  oliiviöljy 1 g, juustokumina 0,3 g, korianteri 0,2 g ja sitruunamehu 0,2 g.
  Paistamiseen lisäksi 13,5 g oliiviöljyä. Ei kaupallista harissatahnaa.
- Moo ping: 700 g porsaan niskaa, koko marinadi kypsennetään pannulla ja
  syödään. Mustapippuri, 4 g erytritolia ja 13,5 g rypsiöljyä (Fineli 535).
  Lisukkeina 200 g kurkkua sekä 60 g kuorittua limetin hedelmälihaa ja mehua.
  Kuva esittää vartaita; kuvan ja pannuversion ero on kerrottu.
- Lanttulaatikko: 800 g raakaa kuorittua lanttua, 150 g 38 % kermaa,
  50 g voita sisältäen vuoan ja pinnan, 55 g munaa ja 100 g soseessa
  säilyvää haudutusvettä. Ei valinnaista siirappia eikä ylimääräistä rasvaa.

Kaikki luetellut syötävät osat käytetään. Raakakoostumus on nimetty kypsän
ruoan koostumusarvion pohja; mittaamattomia hävikkejä ei vähennetä.
Kuvat ovat kuvitusta; kuvan luetteloimattomat lisukkeet eivät kuulu arvioon.

## Menetelmät ja hyväksyntää vaativat sovellukset

Pienet imeytyvät CHO-osuudet ovat mukana. GI 40/30/50 ovat nimetyt rajatut
projektisovellukset, eivät uusia mitattuja ateriakohtaisia GI-tuloksia.
Hunajan 55 on ryhmäkeskiarvo. Kokonaisen maapähkinän GI 13 käyttää
heikompaa T2-aineistoa (rivi 3245, n=5, glukoosivertailu); paahdon tila ei
ole ilmoitettu. Karkean kokonaisen pähkinän analogia on LOW; arvoa ei
sovelleta pähkinävoihin tai jauhoon. Lantun GI 40 on toimituksellinen
projektisovellus, ei mitattu paistetun soseen tai lanttulaatikon GI.

Luottamus pysyy matalana. Biologista epävarmuusväliä ei tunneta.
Omistajan on hyväksyttävä täsmälliset viisi versiota ja rajatut sovellukset.
Yleinen laskentamoottori ja ravintomallin polyolivaatimus säilyvät ennallaan.

## Tarkistusnäyttö

- [manifest.json](manifest.json): viisi runtime-ID:tä, kaksi HOLD-ID:tä,
  seitsemän lukittua tutkimushashia ja odottava hyväksyntä.
- [recipes.json](recipes.json), [sources.json](sources.json),
  [composition-sources.json](composition-sources.json) ja
  [golden.json](golden.json): täsmälliset syötteet, sovellukset ja tulokset.
- [publication-macros.json](publication-macros.json) ja
  [macro-changes.json](macro-changes.json): neljä julkaisumakroa sekä ennen/jälkeen.
- [primary-verification.json](primary-verification.json): 21 AFCD-koostumusta
  tarkistettu alkuperäisestä per-100-g Excelistä ja 15 Fineli-tietuetta
  tunnisteineen, mukaan lukien POLYL. Erytritolin 100 g CHO / 100 g polyoleja
  käsitellään kerran kokonais-CHO:ssa; netto-CHO ei kasva.
- Riippumaton Decimal: kaikki viisi GK-laskelmaa ja neljä makroa PASS.
  Kummankin HOLD-tapauksen tuntematon polyolimäärä estää netto-CHO-tuloksen.
- Regressio: viisi uutta numeerista tulosta, 321 koko GK-tulosobjektia
  muuttumattomina, kaikki aiemmat 114 numeerista säilyvät. Q09:n positiiviset
  alle yhden tulokset ja teehaudutettujen munien puutteellinen tila säilyvät.
- Kolmen reseptin yhdeksän olemassa olevaa EN/SV/TH-versiota on päivitetty
  samoihin määriin, valmistukseen ja makroihin. Shakshuka ja lanttulaatikko
  ovat FI-only. Rakenteellinen auditointi: 0 virhettä.
  [Käännösten sisältökatselmointi](../../reports/2026-11-01-gk80-next-seven-translation-review.md):
  HUMAN REVIEW PENDING; uutta ihmisen hyväksyntää ei väitetä.
- Lopullinen build: PASS, 691 reittiä. Selaimessa havaittujen suomenkielisten
  valmistustekstien välilyöntikorjaukset edellyttivät toista buildia.
  Laskentamäärät ja rajaukset eivät muuttuneet.
- Lopulliset paikalliset testit: unit 196/196 PASS, käännökset 27/27 PASS,
  static 25/25 PASS. Vanha siirappiodotus ja aiemman butter chicken -version
  käännösodotukset päivitettiin vastaamaan nyt katselmoitavaa versiota.
  Lopullisen HEADin GitHub CI raportoidaan PR:ssä.
- Brave-selaimessa tarkistettu kaikki viisi FI-sivua ja kolme käännössivua
  (EN/SV/TH): makrot, GK, LOW, lähdelinkit, positiivinen alle yhden esitys,
  HOLD-tapaukset ja tee. Ei JavaScript-virheitä. Kuvakaappaukset katselmoitu.

## Ehdotettu eräpäätös

Hyväksytäänkö viisi täsmällistä ehdokasta yllä kuvatuilla rajauksilla seuraavaan
vaiheeseen, pitäen palak paneer ja nakkikeitto HOLD-tilassa? Kyllä / Ei.

Tämä Draft odottaa koko erän menetelmä- ja sisältöpäätöstä. Ready-siirtymä,
merge ja deploy tarvitsevat erillisen luvituksen. Muut 18 valmisteltua
ehdotusta, jerk-kana, pav bhaji sekä ReportHub #90/#88 jäävät erilleen.
Uutta tutkimusajoa ei tehty.

# AJO 1.6B – paprikan lähde-, massa- ja koostumuskatselmointi

## Lähtötila ja rajaus

Varmennettu main `c02a70cd6c54d374445941a4d4896536f55b7182`:
326 reseptiä, 118 laskettua ja 208 keskeneräistä GK-arvoa, 45 GI-tietuetta.
[Tuotantoajo](https://github.com/ozirix-dev/Reseptit/actions/runs/40686602303).
Tässä ehdotuksessa 111 laskettua ja 215 keskeneräistä: **34,0 %**, netto −7.
Yksi GI-tietue ja sen 14 ainesriviä / 13 reseptiä muuttuvat. Ei uutta kattavuuserää.

[Uusi lukittu lähtötilanne](glycemic-red-pepper-source-baseline.json) sisältää
kaikkien 326 tuloksen tarkat arvot ja SHA-256-tiivisteet sekä syöte-, lähde- ja
reseptisormenjäljet. [Koneellinen vaikutusauditointi](glycemic-red-pepper-source-review.json)
sisältää jokaisen vaikutusreseptin täydellisen ennen/jälkeen-tuloksen,
ainesrivit, poisjätöt, muut GI-sidonnat ja estot. Vanhat baselinet säilyvät.

## GI 40:n lähdeketju

Virheellinen DOI `10.3390/nu12103041` kuuluu äidin DHA-lisää ja vauvan
kehitystä käsittelevään tutkimukseen. Tarkoitettu lähde on Carneiron ja Leloupin
[vuoden 2020 katsaus](https://doi.org/10.3390/nu12102989).
Sen **Table 1** sisältää geneerisen Pepper-rivin: annos 2 g, GI 40,
hiilihydraatti 1 g. Laji, väri, valmistustapa ja kyseisen rivin alkuperäinen
ihmiskoe eivät selviä. Kahden gramman annos voi viitata mausteeseen; tämä on
vain tulkinta, eikä todista mustapippuria, chiliä tai makeaa paprikaa.

Taulukon yhteinen lähdeviite on glycemicindex.com sekä viite [1],
[Jenkins ym. 1983](https://doi.org/10.1007/BF00282710).
Kustantajan tiivistelmä kuvaa 15 ruoan tutkimusta diabeetikoilla; se ei yksilöi
Pepper-riviä. Maksullista kokotekstiä ei saatu, joten sen sisältöä ei väitetä
kokonaan tarkastetuksi. Vuoden 1981 Jenkins-artikkeli on eri julkaisu eikä tämän
taulukon viite [1]. Aiemman sipuliraportin vuosiluku jää historialliseksi
tekstivirheeksi, joka kirjataan myöhempään dokumentointikorjaukseen.

[Sydneyn hakutaulukosta](https://glycemicindex.com/gi-search/) ja
[vuoden 2021 kansainvälisten taulukoiden](https://doi.org/10.1093/ajcn/nqab233)
molemmista liitetaulukoista ei löytynyt yksilöityä makean paprikan ihmismittausta.
Pepper-osumat sisälsivät tuotemerkkejä ja sekaruokia. Tämä haku ei todista,
ettei mittausta voisi olla muualla. Katsauksen yleinen glukoosiasteikon määritelmä
ei varmista juuri Pepper-rivin testin asteikkoa tai menetelmää.

Päätös: **REFERENCE_ONLY**, GI 40 säilyy vain historiallisena taulukkoarvona.
Ruoka- ja valmistusavaimet ilmaisevat tuntemattoman tuotteen; kaikki 14 aktiivista
sidontaa poistetaan. Korvaavaa GI-arvoa ei hyväksytty. Puuttuva GI ei ole nolla.

Lähteiden saatavuus: 2020 kokotekstin XML ja kustantajan PDF tarkastettiin.
2021 liitetaulukot luettiin alkuperäisiä taulukoita toistavista PDF-kopioista:
[Supplemental Table 1, 139 sivua](https://ghwinstitute.com/wp-content/uploads/2022/10/supplementaltable1-2.pdf)
ja [Supplemental Table 2, 136 sivua](https://ghwinstitute.com/wp-content/uploads/2022/10/supplementaltable2-2.pdf).
Suorat kustantajapyynnöt palauttivat ajoittain 403/500. Kopioiden isäntä ei ole kustantaja.

## Massat ja koostumukset

[Finelin käyttöohje](https://fineli.fi/fineli/content/file/8) määrittelee
ravintosisällön syötävää 100 grammaa kohti. Repon muuttumaton Release 20 -aineisto
sisältää sekä punaiselle #386 että vihreälle #387 raakatuotteelle syötävän osuuden
100 % sekä annosmitat 230 g (suuri), 170 g (keskikokoinen) ja 120 g (pieni).
Siksi 2 suurta = **460 g syötävää lähtöraaka-ainetta annosmitta-arviona**.
Tämä ei ole kahden todellisen yksilön punnitustulos eikä kypsän ruoan loppupaino.
Kannan ja siementen poistoon ei lisätä toista arvauskerrointa syötävän osuuden
päälle. Kypsennyshävikkiä tai ravintoaineiden retentiota ei keksitä.

| Resepti | Vanha | Varmennettu korjaus | Vaikutus |
|---|---|---|---|
| paprikauunimunakkaat | 340 g, oletettu punainen | 2 suurta → 460 g; väri jää avoimeksi, koostumussidonta null | GI ja koostumus avoimet; GK null |
| tunisialainen-ojja | 170 g | Reseptin 150 g punaista #386 | 1,6875 g HH/annos; tavallinen laskelma käytti jo 150 g |
| paneer-tikka, punainen rivi | 170 g vihreää #387 | 170 g punaista #386 | HH 1,0625 → 1,9125 g/annos |
| yrttituorejuusto-kinkkurullat | 100 g vihreää #387 | 100 g punaista #386 | HH 0,625 → 1,125 g/annos; pienosuus ei käy |
| kana-fajita-pelti | Oletettu punainen, 340 g | Väriä ei ole reseptissä; koostumussidonta null | HH ei ole varmennettu |
| taytetyt-paprikat-vhh | Oletettu punainen, 920 g | 4 suurta säilyy 920 g; väri avoin, koostumussidonta null | HH ei ole varmennettu |

Koostumuslähde: [Fineli #386, punainen paprika](https://fineli.fi/fineli/fi/elintarvikkeet/386)
ja [#387, vihreä paprika](https://fineli.fi/fineli/fi/elintarvikkeet/387), Release 20.
CHOAVL 4,5 / 2,5 g, kuitu 1,9 / 1,8 g ja polyolit 0 / 0 g sadassa grammassa.
Muut kappalemassat ovat Finelin standardiannosarvioita, eivät punnittuja annoksia.
Italian-padan ohje puhuu suippopaprikasta: yleinen punaisen paprikan koostumus
on vain nykyinen likimääräinen vastaavuus; GK estetään joka tapauksessa.

### Paprikauunimunakkaiden koko ravintoarvomalli jää avoimeksi

Alkuperäinen resepti on kaksi suurta paprikaa, neljä munaa, 40 g juustoraastetta,
1 rkl ruohosipulia sekä määräämätön suola ja mustapippuri, **2 annosta**.
Kaikki viisi riviä ajettiin nykyisen ravintoarvomallin läpi auditointisyötteenä:

- Paprika: 460 g syötävän raaka-aineen standardimassa; väri/koostumus avoin.
- Munat: neljän 55 g munan nykyinen 220 g syötävä raakapainoarvio; kypsennyksen retentio avoin.
- Juustoraaste: 40 g tunnetaan, juustolajia/rasvaisuutta ei määritellä; Emmentalia ei oleteta uudelleen hyväksytyksi.
- Ruohosipuli: 1 rkl = Finelin 7 g annosarvio; tarkka toteutunut massa ei ole punnittu.
- Suola/mustapippuri: määrää ja seossuhdetta ei ole rajattu; vanha oletus ei ole varmennettu poisjättö.

Koko mallin imeytyvä HH, kuitu, polyolit, kokonais-HH, energia, proteiini ja rasva
jäävät **nulliksi / INSUFFICIENT SOURCE DATA**. Mitään uutta hävikkikerrointa ei
anneta. Ehdollinen punaisen paprikan osuus olisi 10,35 g HH/annos ja vihreän
5,75 g; kumpikaan ei ole reseptin hyväksytty laskelma, koska väri on avoin.
Punaisella vaihtoehdolla vanha 8,0 g netto-HH olisi mahdoton kokonaisarvo.

Julkaistut vanhat tavalliset kentät 8,0 / 11,2 / 21,2 / 16,7 eivät saa tällä
katselmoinnilla uutta hyväksyntää. Ne jäävät dokumentoidusti ratkaisemattomaksi
vanhaksi ravintoarvioksi, kunnes paprika ja juusto yksilöidään sekä koko laskenta
vahvistetaan. Käyttäjän sallimaa yksittäisen reseptin avointa tilaa sovelletaan;
uutta GK-arvoa ei julkaista. Sisältöä tai kieliversioita ei muuteta oletuksilla.

Paneer tikkan tavalliset neljä makrokenttää ovat jo null ja tila MISSING.
Kinkkurullien tavallinen laskenta käyttää jo 100 g punaista #386: nykyinen malli
toistaa 2,76 g netto-HH, 3,66 g kokonais-HH, 8,17 g proteiinia ja 6,26 g rasvaa.
Myös ojjan, menemenin ja kookos-lime-kanacurryn olemassa olevat tavalliset
laskelmat toistuvat. Niiden energia puuttuu lähdeaineistosta; energiaa ei johdeta
uudella kaavalla. Makrojen pyöristettyjä arvoja ei summata uudelleen.

## Kaikki 13 vaikutusreseptiä

Ennen-arvot ovat nykyisen tuotantobaselinen arvoja. Kaikki seitsemän laskettua
olivat GK-luokassa LOW ja confidence LOW. Jälkeen kaikissa GK, pyöristämätön GK,
vaihteluväli, luokka ja confidence ovat null. Kuusi oli jo keskeneräisiä.
HH tarkoittaa imeytyvää hiilihydraattia grammoina annosta kohti.
Poisjätöt ovat muiden rivien nykyiset mallimäärät; tämä ei ole niiden uusi
lähdehyväksyntä. Täydet yksittäiset poisjätöt ja kaikki estot ovat JSON-raportissa.

| recipeId | GK ennen (tarkka) → jälkeen | Paprikan HH/annos | Muut poisjätöt HH/annos | Luokka / confidence ennen → jälkeen |
|---|---|---|---|---|
| paprikauunimunakkaat | 3.06 (3.06) → null | avoin | 0.655550001 | LOW / LOW → null / null |
| shakshuka | None (None) → null | 3.825 | 1.050000000 | null / null → null / null |
| chili-con-carne-kukkakaaliriisi | None (None) → null | 1.9125 | 1.260000000 | null / null → null / null |
| ratatouille | None (None) → null | 1.9125 | 1.369437500 | null / null → null / null |
| taytetyt-paprikat-vhh | None (None) → null | avoin | 0.752812500 | null / null → null / null |
| kana-fajita-pelti | 1.78 (1.78375) → null | avoin | 1.525017835 | LOW / LOW → null / null |
| italian-pata | 2.57 (2.5695) → null | 1.35 | 0.346550000 | LOW / LOW → null / null |
| pad-kee-mao-vhh-konjac | 1.79 (1.791855) → null | 1.35 | 1.969500000 | LOW / LOW → null / null |
| tunisialainen-ojja | None (None) → null | 1.6875 | 1.110250000 | null / null → null / null |
| kookos-lime-kanacurry | None (None) → null | 1.9125 | 0.188150000 | null / null → null / null |
| paneer-tikka | 3.01 (3.01125) → null | 1.9125 + 1.0625 | 0.435000000 | LOW / LOW → null / null |
| lahi-ita-menemen-sumakilla | 1.32 (1.3243749999999999) → null | 2.125 | 0.415000000 | LOW / LOW → null / null |
| yrttituorejuusto-kinkkurullat | 0.81 (0.8078124999999999) → null | 1.125 | 0.583875000 | LOW / LOW → null / null |

Yhtään paprikaosuutta ei hyväksytty pienosuustoleranssiin: tunnetut yksittäiset
osuudet ovat vähintään 1 g/annos, ja kolmella reseptillä koostumus on avoin.
Paneerin vihreä osuus 1,0625 g ja kinkkurullien korjattu punainen 1,125 g eivät
alita rajaa. Yhteensä alle 2 g ei ohita yksittäisen osuuden alle 1 g -ehtoa.

### Valmistustavat ja jäljellä olevat estot

- **paprikauunimunakkaat**: 200 C oven: 8 min then 12–16 min. Mallin muu estolista on tyhjä; muita GI-analogeja tai vanhoja poisjättöjä ei silti hyväksytä tällä katselmoinnilla.
- **shakshuka**: Pan softened; sauce simmer 10 min then covered 5–8 min. Muut nykyiset estot: tomaattimurska: GI value is unpublished, off-scale, or its food/preparation match lacks a rationale.; juustokumina, savupaprika, suola, pippuri, chili ja persilja: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.
- **chili-con-carne-kukkakaaliriisi**: Pan 5 min, covered simmer 30 min. Muut nykyiset estot: tomaattimurskaa: GI value is unpublished, off-scale, or its food/preparation match lacks a rationale.
- **ratatouille**: Pan 5 min, simmer 20 + 10–15 min. Muut nykyiset estot: kypsiä tomaatteja: GI value is unpublished, off-scale, or its food/preparation match lacks a rationale.
- **taytetyt-paprikat-vhh**: 200 C oven 25–30 min. Muut nykyiset estot: tomaattimurskaa: GI value is unpublished, off-scale, or its food/preparation match lacks a rationale.
- **kana-fajita-pelti**: 220 C oven 18–22 min. Mallin muu estolista on tyhjä; muita GI-analogeja tai vanhoja poisjättöjä ei silti hyväksytä tällä katselmoinnilla.
- **italian-pata**: 225 C oven 20 min; instruction calls pointed pepper. Mallin muu estolista on tyhjä; muita GI-analogeja tai vanhoja poisjättöjä ei silti hyväksytä tällä katselmoinnilla.
- **pad-kee-mao-vhh-konjac**: Wok few minutes then heated with sauce. Mallin muu estolista on tyhjä; muita GI-analogeja tai vanhoja poisjättöjä ei silti hyväksytä tällä katselmoinnilla.
- **tunisialainen-ojja**: Pan 6 min; simmer 12–15 min then eggs. Muut nykyiset estot: harissaa: No source-matched composition and preparation was resolved for “harissaa”; it is not treated as zero.; juustokuminaa: AJO 1.5: prior positive carbohydrate estimate has no verified mass/composition or source-backed upper bound; it cannot qualify for the omission tolerance.; tuoretta persiljaa: GI value is unpublished, off-scale, or its food/preparation match lacks a rationale.; recipe structure differs from the last GL review (b1c2bd3e036f0a17b3f61a560c39b5df56e1d8d5); ingredient mapping and calculation must be reviewed again.
- **kookos-lime-kanacurry**: Simmer 10–12 min in coconut sauce. Muut nykyiset estot: thaimaalaista currytahnaa: No source-matched composition and preparation was resolved for “thaimaalaista currytahnaa”; it is not treated as zero.; limetti: The recipe amount 1 kpl has no food-specific mass conversion for Lime, peeled, raw.
- **paneer-tikka**: Grill or 230 C grill element 10–14 min. Mallin muu estolista on tyhjä; muita GI-analogeja tai vanhoja poisjättöjä ei silti hyväksytä tällä katselmoinnilla.
- **lahi-ita-menemen-sumakilla**: Pan softened, then cooked with tomato and egg. Mallin muu estolista on tyhjä; muita GI-analogeja tai vanhoja poisjättöjä ei silti hyväksytä tällä katselmoinnilla.
- **yrttituorejuusto-kinkkurullat**: Raw sliced, assembled cold. Mallin muu estolista on tyhjä; muita GI-analogeja tai vanhoja poisjättöjä ei silti hyväksytä tällä katselmoinnilla.

Muut sidotut GI-tietueet ja niiden P0/P1/P2/PASS-havainnot on liitetty jokaiseen
reseptiin JSON-raportin `otherGiScreen`-kentässä. Esimerkiksi keitetyn tomaatin,
kasvisryhmän, palkokasvien ja maitotuotteiden analogiat tarvitsevat erillisen
lähdearvion. Ojjan vanha reseptirakenteen sormenjälkiero jää estoksi; sitä ei
kuitata paprika-auditoinnilla.

Kokoelman vertailu: **111 täsmälleen ennallaan laskettua, 0 numeerisesti muuttunutta
laskettua, 7 keskeneräiseksi palautunutta, 208 ennestään keskeneräistä, 0 uutta**.
313 vaikutusalueen ulkopuolisen reseptin koko tulos sekä syöte- ja lähdesormenjäljet
ovat ennallaan. Kaikkien 326 reseptin sisältösormenjäljet ovat ennallaan.
Seitsemän LOW-luokitusta poistuu; luokasta toiseen siirtyviä laskettuja ei ole.
Pyöristämättömät luvut ja vaihteluvälit on verrattu, ei vain näyttöarvoja.

## Katalogin esiseulonta ja jatkotyöt

[Kaikki 45 tietuetta](glycemic-source-integrity-screen-2026-10-28.md):
**P0 2, P1 23, P2 1, PASS 19**. PASS tarkoittaa vain, ettei kevyt seulonta
osoittanut ilmeistä ongelmaa. Se ei hyväksy uutta mittausta tai reseptisidontaa.

P0 paprika: 14 aktiivista sidontaa / 7 laskettua käyttäjää ennen, 0 / 0 jälkeen.
P0 `bakery-products-category-mean-gi-58`: 62 sidontaa / 28 laskettua käyttäjää;
12 julkaistussa reseptissä todettiin nimenomaisesti mantelijauhon väärä ruokaperhe.
28 on koko tietueen altistuva joukko, ei väite 28 todistetusti väärästä arvosta.
**Seuraava rajattu laatutyö on leipomotuotteiden keskiarvon mantelijauhosidonnat.**
Muiden 44 GI-tietueen sisältö säilyy täsmälleen ennallaan tässä PR:ssä.

P1-jonossa ovat erityisesti tomaatin raaka→kastike-siirto, laajat
kasvis-/maito-/palkokasvikeskiarvot ja sekaruokien keskiarvojen ainesosakäyttö.
Paprikauunimunakkaat tarvitsee erillisen toimituksellisen raaka-ainepäätöksen
ennen koko tavallisen ravintoarvolaskennan vahvistamista.

2B6E:n viiden reseptin 44 ainesrivin tutkimus säilyy alkuperäisissä
`glycemic-coverage-batch-2b6e-review.json/.md`-tiedostoissa. Niiden tiivisteet ja
kaikkien historiallisten baselinejen tiivisteet tarkistetaan regressiossa.
Erillistä ReportHub-closeoutia ei tehdä.

## Tarkistusportti

Regressiot tarkistavat kaikkien 326 tulosten täsmällisyyden, 13 muutoksen rajauksen,
14 sidonnan poiston, vanhojen syötteiden ja lähdesormenjälkien eston, väärän DOI:n
poiston, REFERENCE_ONLY-palautusyrityksen myös pikkumäärällä, massat ja värit,
pienosuuden rajat, tavallisen mallin avoimen tilan ja historiallisten tiedostojen
muuttumattomuuden. Kaavoja, toleransseja ja valmistusohjeita ei muuteta.

Paikalliset tarkistukset 2026-10-28: content:sync PASS; strict nutrition audit PASS;
GK- ja molemmat kattavuusauditoinnit PASS; GI/GK 74/74; yksikkötestit 144/144;
CI-valitsin 12/12; käännökset 27/27; build PASS (691 reittiä); staattiset 24/24;
Markdownlint 833 tiedostoa, 0 virhettä; git diff --check PASS.
Build antaa ennestään suuren JavaScript-lohkon varoituksen, ei virhettä.
Resepti- tai kieliversiosisältö ei muutu, joten changed-content- ja selaintestien
lisäehto ei laukea. HEAD-kohtainen GitHub CI tarkistetaan PR:n avaamisen jälkeen;
loppuraportti sisältää ajolinkin ja vahvistetun GI/GK-testimäärän.
Tämä on Draft-PR:n katselmointiaineisto; se ei ole yhdistämis- tai julkaisulupa.

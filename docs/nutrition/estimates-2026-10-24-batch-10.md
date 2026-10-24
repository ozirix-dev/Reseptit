# Ravintoarvioiden erä 10 — 24.10.2026

Erä sisältää 20 julkaistua reseptiä: keto-mutakakku, keto-suklaakeksit,
marjakiisseli vaniljakastikkeella, mehevä suklaakakku, pannacotta
marjakastikkeella, rahkapiirakka, Brita-kakku, juustokakku, VHH-korvapuustit,
VHH-letut, mansikkakakku, mokkapalat, omenapiirakka, raparperipiirakka,
keto-korvapuustit, lihapiirakka, Runebergintortut, siemengranola jogurtilla,
caponata ja pizza Margherita.

## Menetelmä

Kaikki arvot laskettiin `site/scripts/nutrition-model.ts`-mallilla.
Laskentasyötteet ja reseptikohtaiset lähde-ID:t ovat kansiossa
`calculations/`. Erämanifesti on `batches/batch-10.json`. Annosmäärä tulee
reseptistä. Ravintoarvo skaalataan raaka-aineen määrällä, muunnetaan
annosmääräksi ja pyöristetään lopuksi kahteen desimaaliin. Tämä on
ainesosista laskettu suuntaa-antava arvio, ei valmiin annoksen laboratorioanalyysi.

Fineli Release 20 -tietueissa käytettiin komponentteja CHO (2034), FIBT (2168)
ja POLYL (2260). Fineli määrittelee CHOAVL:n tärkkelyksen ja sokereiden
kokonaismääräksi, joten sitä ei vähennetä polyoleilla uudelleen. AFCD Release
3:n lähteissä saatavilla oleva hiilihydraatti poimittiin paritetusta
`with/without sugar alcohols` -arvosta; erotus tallennettiin polyoliksi.
Kokonaishiilihydraatti on saatavilla oleva hiilihydraatti + kuitu +
polyolit. Erytritolin määrä varmennettiin Foodin tuotemerkinnästä.

Pääasialliset lähteet: Fineli #1, #20, #32, #30, #335, #338, #362, #398,
#500, #536, #622, #628, #631, #655, #689, #851, #852, #858, #922, #929,
#110, #162, #379, #11562, #11571, #29239 ja #32201; AFCD F000095,
F000247, F002220, F002258, F002390, F002963, F003041,
F004196, F006077, F006198, F006618, F007502, F007619, F008210, F008212,
F008215, F008952, F009350, F009606, F009837 ja F009881; sekä Foodin
erytritolin paikallinen tuotemerkintä.

## Vastaavuudet ja rajaukset

- Sokeriton tumma suklaa vastaa AFCD F009837:tä (dark chocolate, no added
  sugar). Tavallinen tumma suklaa vastaa Fineli #32:ta.
- Mantelijauho vastaa AFCD:n kuivaa almond meal -tietuetta F006077. Mantelilastut
  laskettiin Fineli #379:n mantelikoostumuksella.
- Smetanan lähteenä on Fineli #628 (28 % crème fraîche), lähin paikallinen
  hapatetun kerman tietue. Raastetun juuston vastine on Fineli #655:n
  yleinen puolikova juusto; rasvapitoisuus ilmoitetaan lähteessä vaihteluvälinä.
- Aineskohtaiset dl-, ml-, tl-, rkl- ja kappalemuunnokset on kirjattu
  laskentatiedostojen jokaiselle ainesriville. Ne sisältävät Finelin
  annosmittoja ja dokumentoituja yleisiä kotitalousmittojen massa-arvioita.
- Basilika jätettiin laskennasta pois, koska käytettävissä olevassa
  tietueessa ei ollut kuituarvoa. Sitruunamehu sekä reseptin mittaamaton
  suolaripaus jätettiin pois pieninä määrinä. Jokaisen poisrajauksen
  konservatiivinen annoskohtainen yläraja on laskentatiedostossa ja kaikkien
  rajausten summa alittaa mallin sallitut rajat.
- Valmistuksen jälkeistä vedenhaihtumista ei arvioitu; makrot on jaettu
  reseptin ilmoittamalla annosmäärällä. Lisäkkeitä ei sisällytetty.

## Julkaistut arvot

Kaikissa 20 suomenkielisessä reseptissä ja niiden julkaistuissa käännöksissä
on samat nettohiilihydraatin, kokonaishiilihydraatin, proteiinin ja rasvan
arvot. Audit laskee arvot laskentasyötteestä uudelleen ja vertaa niitä
julkaistuun sisältöön.

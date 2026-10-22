# V1.6 – ravintoarvojen laskentapohja ja pilotti

Päiväys: 22.10.2026, Europe/Helsinki. Lähtö-main:
`02ffd5a92092d27fa8509ec47135d9ecb4c2a497`.
Haara: `codex/reseptit-v1-6-nutrition-evidence`.

## Inventaario ja vanhojen arvojen näyttö

119 julkaistua FI-lähdettä: 24:ssä ainakin yksi numero, 95:ssä ei yhtään.
Ruokavalioluokat: 3 keto, 33 vhh_tiukka, 15 vhh_valjempi, 68 ilman luokkaa.
Kaikki 24 numerollista reseptiä ovat INSUFFICIENT SOURCE DATA:
toistettavaa aineskohtaista alkuperäislaskelmaa ei löytynyt. VERIFIED 0,
ESTIMATE WITH EVIDENCE 0. Arvioiksi nimetyt luvut säilytettiin ennallaan.
Kaikkien 119:n määrät, puuttuvat kentät, annokset ja lähdemuistiinpanot ovat
[audit.jsonissa](../nutrition/audit.json). Numeerinen net>total-ristiriita
ei esiintynyt; määritelmän oikeellisuutta tämä ei todista.

24 numerollisen reseptin muistiinpanot luettiin. Annosmäärä on yksiselitteinen
metadatassa (4 tai 8), mutta punnittua valmistussaantoa, tuotemerkkikohtaista
laskelmaa ja hiilihydraattien yhteistä määritelmää ei ole. Esimerkiksi larb
ilmoittaa riisijauhon sisältyvän arvioon ja tom yum sulkee riisin ja
kookosmaidon pois. Muiden lisäkkeiden laskentaraja ei ole yleisesti todistettu.

## Viisi pilottia

| Pilotti | Ratkaisevat avoimet tiedot | Koko resepti / annos |
| --- | --- | --- |
| Kermainen lohipata | lohilaji, tuorejuuston/kuohukerman tuote, tilavuus- ja kappalepainot, retentio | kaikki kokonaisarvot null |
| Keto-kauralesesämpylät | munapainot, raejuusto/mantelijauho/psyllium, kermamuunnos, valinnaiset siemenet | kaikki kokonaisarvot null |
| Butter chicken | ohjeen öljytilkka puuttuu aineksista; liha, jogurtti, kerma ja marinadihävikki | kaikki kokonaisarvot null |
| VHH-pad thai | nuudelituote, katkaravun tila, tofu, tahnat, munapainot, erytritoli | kaikki kokonaisarvot null |
| Valencialainen paella | luullinen/syötävä lihapaino, kani/jänis/broileri, liemi, öljymuunnos | kaikki kokonaisarvot null |

Arvojen puuttuminen on pilotin tulos, ei laskentatestiä varten lisätty nolla.
Finelin lohitietueen 34255 ehdollinen 600 g:n raaka-ainelasku tuottaa
1356 kcal, 120 g proteiinia ja 98,4 g rasvaa: neljällä jaettuna 339 kcal,
30 g proteiinia ja 24,6 g rasvaa. Nämä ovat **pelkän lohen** syötearvoja,
eivät lohipadan ravintoarvoja. Kuitua, sokereita ja polyoleja ei poimittu
luotettavasti, joten netto jää avoimeksi. Sama kalalaji ja syötävä paino
on vielä vahvistettava; kypsennyksen hävikkiä ei tunneta.

Ehdollinen lohen proteiini 30 g/annos ylittää nykyisen koko padan 29 g:n
arvion. Tämä on CONFLICT REQUIRES REVIEW -vertailuhavainto, ei todistettu
uusi luku eikä peruste automaattiselle muutokselle. Muissa piloteissa
täysi vertailu estyy puuttuvista tiedoista. Finelin valmis butter chicken
-tietue 34422 hylättiin korvikkeena: rintafilee ja 15 % kerma poikkeavat
reseptin reisilihasta ja kuohukermasta.

## Toteutus ja lähteet

Ei uusia riippuvuuksia. TypeScript-malli säilyttää lähdeviitteen,
ainevastaavuuden, hiilihydraattimääritelmän, muunnoksen ja retentio-oletuksen.
Puuttuva aines estää kokonaisluvun; osat näkyvät erikseen. Määrät ja
annosjako pyöristetään vasta lopussa. Tuotekohtainen muunnos vaaditaan.

[Menetelmä ja lähteiden ehdot](../nutrition/README.md) dokumentoivat
Finelin CC BY 4.0:n, USDA FDC:n public domain -aineiston sekä valmistajan
todellisen kuohukermatuotteen ja uudelleenkäytön rajoitukset.
Finelin suorat tietuelataukset epäonnistuivat; käytetty pieni lohipoiminta
on virallisen sivun hakuindeksistä ja merkitty sellaiseksi. Ei väitettä
live-tietokannan täydellisestä tarkistuksesta. Ei valmistajien tuotekopioita.

## Sivuston nykyinen esitys

RecipePage esittää ravintoluvut per annos ja jättää null-arvot pois.
Annoslaskuri skaalaa raaka-aineet; per-annos-ravintoluku pysyy samana.
JSON-LD käyttää samoja total/proteiini/rasva-kenttiä; nettoa ei esitetä
Schema.orgin kokonais-hiilihydraattina. Nykyisten lukujen määritelmien
epävarmuus jää silti lähdesisällön kysymykseksi. Arviomerkinnät ovat
muistiinpanoissa; erillistä varmennettu/arvio-tunnusta ei ole.
Uusia arvoja tai käyttöliittymämuutoksia ei julkaistu.

## Testaus ja jatko

Uudet täsmälliset synteettiset testit kattavat puuttuvan lähteen, määrän,
muunnoksen, raakakypsä-ristiriidan, negatiiviset/puuttuvat ravintokentät,
virheelliset annokset, pyöristyksen, tuntemattoman hävikin, EU/US-erottelun,
kuidun kaksoisvähennyksen ja polyolit. Testiruoat eivät ole ravintotietolähteitä.
`npm ci`, `npm test`, `test:translations`, `test:image`, `build`,
`test:static`, `test:browser` (Brave), `npm audit --audit-level=low`,
Markdown-lint ja diff-check läpäisivät. Lisäksi erillinen Fineli-poiminnan
laskentatesti varmistaa 600 g:n osalaskun ja puuttuvan aineksen vaikutuksen.
Build säilyttää 476 versiota, 480 reittiä ja JS:n 363,97 / gzip 116,46 kB.
Ei uusia riippuvuuksia tai haavoittuvuuksia. GitHubin CI/review-tila
tarkistetaan PR:stä viimeiselle commitille.

Seuraava sisältöpäätös: valitse tuotteet ja punnitse käytetyt syötävät määrät,
ratkaise butter chickenin öljymäärä ja dokumentoi valmistussaanto.
Laskentanäytön valmistuttua tarvitaan erillinen arviointi ennen
ravintonumeroiden julkaisua. V1.6 ei mergeä eikä julkaise tuotantoon.

## Katselmointikorjaukset

Codex havaitsi desimaalipyöristyksen rajatapaukset sekä ajonaikaisen
lähdeversion ja päiväyksen kovakoodauksen. Pyöristys käyttää nyt
desimaaliesityksen kokonaislukulaskentaa: myös 4,225 → 4,23 ja
10,075 → 10,08 testataan. Raportti lukee HEAD-tunnisteen, ajopäivän,
kaikkien laskentasyötteiden työpuumuutokset ja kaikkien lähdetiedostojen tiivisteet.
Historiallinen lähdenäytön tarkistus ja tietueen hakupäivä pysyvät erillään
uuden laskenta-ajon päivästä. Korjausten yksikkötestit ja TypeScript läpäisivät.

Kertolaskut, summat ja annosjako säilyvät nyt tarkkoina rationaalilukuina
ennen viimeistä pyöristystä. Regressio varmistaa 0,35 × 90 / 100 = 0,315
→ 0,32 myös usean aineksen annosjaossa. Yhdeksän malliregressiota
kattavat lisäksi tietueiden, laskentakoodin, lataajan, skeeman ja
riippuvuuslukituksen tiivisteet sekä muuttuneiden syötteiden tunnistuksen.

Lohitietue ja lohifilee kohdistetaan yksilöidyillä tunnisteilla, eivät
listan sijainnilla. Ehdollinen proteiinivertailu käyttää ajon nykyisiä
määriä, annoksia ja vanhaa reseptiarvoa. Järjestyksen, määrän ja annosten
muutos sekä puuttuva/moninkertainen lohiaine testataan.

# Seitsemän hyväksytyn A-version Draft-integraatio

## Työrajaus ja lähtötilanne

- Rooli ja kirjoittava omistaja: Codex Julkaisu 3 / seitsemän version integraatio.
- Repo: `ozirix-dev/Reseptit`.
- Oma worktree: `D:/Projects/tmp/reseptit-gk80-next-seven-integration-20261102`.
- Oma haara: `codex/gk80-next-seven-integration-20261102`.
- Lähtö-main: `92dc6dbe7b27e145d6938026c73b6823f2e2108f`, tarkistettu 2.11.2026.
- Kirjoitusrajaus: tämän erän lähde-/hyväksyntäkopiot, erilliset adapterit,
  lähdesidonnan tarkennus, koonnin kytkentä, testit ja tämä muistio.
- Valtuutus: seitsemän version toteutus ja rajattu Draft PR. Ei Readyä,
  yhdistämistä tai julkaisua. Muiden haarojen kirjoitusvastuuta ei siirretä.

Toteutus noudattaa
[jatkoeräsuunnitelmaa](https://github.com/ozirix-dev/Reseptit/blob/d853bdf08d9a36d13d71107f8861a606caa9af36/docs/nutrition/gk80-next-seven-release-plan-2026-11-02.md).
Tuotannon lähtö on **172/326** vähintään yhdelle täsmälliselle numeeriselle
versiolle. Tämän Draftin ehdokas on **179/326 (54,91 %)**, puuttuvia 147.
Alkuperäisohjeiden kattavuus on edelleen **156/326 (47,85 %)**, puuttuvia 170.
Koonti sisältää aiemmat 16 ja nämä seitsemän versiota: uutta A:ta yhteensä 17,
B:tä 6, alkuperäisiä numeerisia tuloksia 156. Resepti lasketaan vain kerran.

## Täsmälliset seitsemän versiota

| Resepti | Taso | Laskettu osuus / annos | Pois jätetty CHO g/annos |
| --- | --- | --- | --- |
| vietnamilainen-kahvijogurtti-banaanilla | A | 10,92 | 0,3 |
| japanilainen-dashimaki-tamago-aamiaislautasella | A | 25,16 | 1,72 |
| japanilainen-hojicha-jogurtti-persimonilla | A | 8,82 | 0,1545 |
| japanilainen-natto-riisikulho | A | 25,34 | 0,39 |
| pad-kee-mao-vhh-konjac | A | 1,80 | 0,9375 |
| chettinad-kana | A | 1,42 | 1,23355 |
| pad-see-ew-vhh-konjac | A | 0,73 | 1,5733 |

Tämä taulukko on laskennan tarkistus, ei käyttöliittymän pyöristysohje.
Pad see ew näyttää **laskettu osuus alle 1**, enintään **1,6 g/annos**
pois jätettyä hiilihydraattia ja varoituksen sen mahdollisesta vaikutuksesta
kokonais-GK:hon. Koko ruoan GK:ta ei väitetä alle yhdeksi. Kaikki versiot
käyttävät LOW-luottamusta ja nykyistä A-aritmetiikkaa. Valmistajien nimelliset
hiilihydraattikatot eivät muutu analyyttisiksi tai eräkohtaisiksi rajoiksi.

## Hyväksynnät ja erilliset adapterit

[Integraatiokirjaus](integration.json) sitoo tarkat seitsemän syötehashia,
alkuperäiset hyväksyntäkirjaukset, julkiset tekstit ja lähdesidonnan
validointikoodin. Kuuden A-version sisältö tulee commitista
`80f4360435b978d1cfa81088df1414430a88c222`; pad see ew commitista
`9bb90548ee0cb7d820c0a1d4f57b9d5082b8da24`. Myöhemmän tutkimushaaran
`991f94e`-jatkoa ei tuoda tähän erään.

Kuuden version alkuperäinen hyväksyntä tarkistaa 20 tiedostohashia, lähteiden
rajatut MEXT2023 CHOAVL mass / natto04046- ja IFCT2017 Table6 G010 -sovellukset
sekä kuusi syötehashia. Pad see ew:n alkuperäinen hyväksyntä tarkistaa viisi
pakettihashia ja oman syötehashinsa. Molemmat hyväksyntätiedostot tuotiin
muuttamattomina. Jäädytettyjen tutkimustiedostojen false-liput ja historialliset
kommentit säilyvät; integraatiota ohjaavat erilliset hyväksyntäkirjaukset.

`gk149-integration.ts` muodostaa edelleen vain alkuperäiset 16 versiota.
`gk149-approved-six.ts` ja `gk-next-seven.ts` muodostavat erilliset seitsemän.
Vasta julkaisukoonti yhdistää ne. Alkuperäisen 16 version hyväksyntätiedostoa,
kuutta hyväksyttyä lähdetiedostoa, syötteitä tai laskentatuloksia ei muuteta.
Muita tutkimusehdotuksia tai uutta B-poisjättöprofiilia ei aktivoida.

Neljän kielen paneelit käyttävät version omia määriä, valmistustekstejä,
lähteitä ja rajauksia. Alkuperäisen ohjeen makrot pysyvät erillisessä paneelissa.
Uudet seitsemän versiota lisäävät paneelit 16 olemassa olevalle kielireitille;
kaikki 23 versiota kattavat yhteensä 47 reseptikielireittiä. Reittejä,
alkuperäisiä reseptejä, käännöstiedostoja tai makropaketteja ei lisätä tai muuteta.

## PR #182: tietuesidonta ilman lähdekorjausten tuontia

[PR #182](https://github.com/ozirix-dev/Reseptit/pull/182), head
`924a827b515f4d4e27d70389837e22f904d38c1f`, on erillinen Draft. Se korjaisi
kolme AFCD-hiilihydraattiarvoa ja muuttaisi koko food-records-tiedoston hashin
`2f8ff76b97848294c28195bb92c6d202e9754168ddb169d30ee5e8610d2c2b9b` →
`361a945c3d6702ec64529dff267f8cd849ba0a8a14fd42ee6798d189a619dcd3`.
Foodin-erytritolin tietue ei muutu. Tämän erän working copy säilyttää vanhan
kokonaishashin ja kaikki nykyiset lähdearvot; #182:a ei yhdistetä tai kopioida.

Aiemman GK149-lähdepaketin hyväksytty kokonaishash säilyy historiallisena
alkuperäsidontana. [Erillinen tietuesidonnan todiste](foodin-record-binding.json)
kiinnittää sen sisältämän yhden Foodin-tietueen koko JSON-sisällön hashin
`7e0a63b22c853205f20e449986fe6d7f050de2a6be6a190f978aba5899eb436b`.
Nykyinen validointi vaatii tämän täsmällisen tietueen, oikean alkuperähashin,
yksikäsitteisen ID:n ja oikean lähdepolun. Arvojen, lähdeosoitteen,
polyolivarmennuksen tai muun tietuesisällön muutos pysäyttää laskennan.
Hiilihydraatti 100 miinus lähteellä vahvistetut polyolit 100 säilyy samana;
tuntemattomia polyoleja ei yleisesti tulkita nollaksi.

Testi todentaa alkuperäisen kokonaishashin julkaisucommitista ja muodostaa
PR #182:n uuden kokonaishashin muuttamalla vain kolme tarkkaa AFCD-kenttää.
Uudet arvot tarkistetaan natiivista without sugar alcohols -kentästä. Molemmat
snapshotit läpäisevät saman Foodin-tietuevarmennuksen. Muiden koostumus- ja
GI-lähteiden nykyisiä tiedosto-/tietuehashien tarkistuksia ei ohiteta.

Myös jäädytetty 14 ehdotuksen tutkimusmanifesti sitoi vanhan mallikoodin hashin.
Se säilyy muuttamattomana ja varmennetaan julkaisucommitista; nykyisen
validointitarkennuksen koodi sidotaan uuden integraatiomanifestin omilla
hasheilla. Vanhaa hashia ei korvata uudella tutkimus- tai hyväksyntätiedostossa.
Aritmetiikan, lähdetulosten ja hylkäysrajojen regressiot säilyvät erikseen.

**Jäljellä oleva #182-raja:** tämä ratkaisee Foodin-tietueen tarpeettoman
riippuvuuden kolmen muun tietueen muutoksista. Se ei hyväksy tai sovella
#182:n alkuperäistulosten kahta muutosta. Nykyinen 326 tuloksen regressio ja
alkuperäisten lähdetiedostojen muuttumattomuusportti säilyvät tiukkoina.
Jos #182 yhdistyy ensin, Ready keskeytetään, kunnes sen kaksi perusteltua
tulosmuutosta on sidottu omaan täsmälliseen regressiopohjaan. Muiden 324
tuloksen tai seitsemän/aiemman 16 version poikkeuksia ei sallita yleisesti.

## Paikallinen varmennus ja jatko

- Seitsemän syötteen ja lähdepakettien tarkistus sekä itsenäinen Decimal: PASS.
- 37 kohdennettua integraatio-, lähdesidonta-, regressio- ja hylkäystestiä: PASS.
- Kaikki 326 alkuperäistulosta vastaavat alkuperäistä regressiopohjaa.
- TypeScript, normaali build ja 721 reitin esirenderöinti: PASS.
- 27 staattisen tulosteen testiä, mukana 47 version reseptikielisivua: PASS.
- Brave: 179/326-koonti, pad see ew:n annosskaalaus, alle yhden lasketun osuuden
  merkintä ja positiivinen poisjättö, makrojen erillisyys sekä 390/1280 px:n
  vaakaylivuodottomuus: PASS. Konsolivirheitä ei havaittu.
- Käännökset on tarkistettu rakenteellisesti. Ihmisen kielikatselmointia ei väitetä.

Täsmällisen Draft PR:n HEADin CI varmistetaan GitHubista. Tuotannosta ei
väitetä 179/326-kattavuutta ennen erikseen valtuutettua myöhempää julkaisua ja
tuotantovarmennusta. Seuraava vaihe on tämän rajatun erän katselmointi.

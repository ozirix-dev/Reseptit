# Reseptit V1.4 – sisältölaatu ja käännökset

Päiväys: 22.10.2026, Europe/Helsinki. Vertailucommitti:
`f9d915e5439527fccb2cd4ee2c26ff0f76a09207`.
Tämä raportti koskee PR-haaraa, ei uutta tuotantojulkaisua.

## Tarkistuksen laajuus ja näyttö

Kaikki 119 julkaistua suomenkielistä lähdettä inventoitiin. Niiden otsikot,
esittelyt, ainekset, annokset, menetelmät, ajat, työjärjestys, lämpötilat,
luokitukset, ravintoarvot ja kehitystekstit käytiin läpi. Kaikkien 357
käännöksen ainesosia, valmistusvaiheita, otsikoita ja alt-tekstejä verrattiin
lähteisiin kielimallin avulla. Muistiinpanojen tarkistus painottui löydettyihin
virheisiin ja tunnettuihin termeihin; täydellistä semanttista oikeellisuutta
ei väitetä. Kaikki 119 kuvaa katsottiin kuuden kontaktikartan kautta.

Tarkistaja on Codex-kielimalli, ei äidinkielinen ihminen, ravitsemuslaskennan
asiantuntija tai reseptejä koekeittiössä testaava kokki.

- [Koneellinen puuteluettelo ja korjausluettelo](2026-10-22-v1-4-content-audit.json)
  sisältää jokaisen lähteen, P0–P3-havainnot ja muuttuneiden kieliversioiden polut.
- [Inventaario](recipe-inventory-current.csv) sisältää kaikki julkaistut
  versiot, määrät, ajat, menetelmät, luokat, kuvat ja ravintokentät.
- [Käännösauditointi](translation-audit-current.csv) sisältää jokaisen
  lähde–käännösparin automaattituloksen ja ihmistarkistuksen tilan.

`STRUCTURE PASS` ja `AUTOMATED SEMANTIC REVIEW` eivät tarkoita
`HUMAN REVIEW COMPLETE`. Kaikkien käännösten riippumaton ihmistarkistus on
`HUMAN REVIEW PENDING`. Jo julkaistujen versioiden status ja URL:t säilyvät.

## Korjatut lähde- ja rakennevirheet

- Neljän pannureseptin uuni-metatieto korjattiin kaikilla kielillä:
  jauhelihakastike kesäkurpitsanuudeleilla, kanakorma, maksa ja poronkäristys.
  Butter chickenin perusteeton grillimetatieto poistettiin.
- Pad thain sivuun nostetut katkaravut ja tofu palautetaan pannulle;
  katkaravut kypsennetään kokonaan.
- Som tamin tuoreet vihreät pavut kypsennetään 5–7 minuuttia. Pad kee maossa
  papujen kypsennys tehdään ennen lyhyttä wokkausta. Pakasteille noudatetaan
  pakkauksen ohjetta. Peruste: [MTK:n pensaspapuohje](https://www.mtk.fi/-/pensaspapu).
- Kai jiew'n ja frittatan raakaa munaseosta ei kehoteta maistamaan;
  maun voi tarkistaa kypsästä koepalasta. Tämä ei väitä kaikkia kotimaisia
  raakoja kananmunia vaarallisiksi.
- Lihapiirakan täytteen työjärjestys ja aloo parathan taikina-/täytejako
  täsmennettiin olemassa olevien vaiheiden mukaisiksi.
- Pani purin, Keralan kalacurryn, palak paneerin ja idlin ohjeessa jo olleet
  täsmälliset vesimäärät lisättiin aineksiin. Pani purin määrätön suola lisättiin.
  Gulassin ainesosissa ollut juustokumina lisättiin maustamisvaiheeseen.
- 19 yleistä mallikuvausta ja sämpylöiden sisäinen kehitysteksti korvattiin
  reseptikohtaisella esittelyllä kaikilla neljällä kielellä.

## Käännösten todetut virheet

Korjauksia tehtiin esimerkiksi nakki/saksanpähkinä-, lanttu/pasta-,
paksoi/sakeutus-, rahka/hapanmaito-, poronkäristys/jerky-,
ulkofilee/sisäfilee-, viismauste/timjami- ja konjaknuudeli/brandy-sekaannuksiin.
Myös kuohukerma, kala- ja lihaliemet, tuoreet yrtit, raaka broileri,
keitetyt kikherneet ja paistaminen/höyryttäminen tarkennettiin lähteeseen.

Thai-lohikeiton englanninkieliset vaiheet ja gulab jamunin EN/SV-versioiden
suomenkieliset vaiheet käännettiin. Alt-teksteissä korjattiin muun muassa
korvapuusti/korvatulppa, nyytti/nuudeli ja Pekingin ankan lettu/salaatti.
VHH-lyhennettä avattiin kohdekielelle; slugeja ei muutettu.

Testit eivät enää oleta 119/357-vakiomääriä. Lähteen metadata määrää
vaaditut julkaistut vastineet. Luonnokset, puuttuvat vastineet, duplikaatit,
status-, annos-, määrä-, yksikkö- ja menetelmäristiriidat testataan.
Vanhoja termitarkistuksia säilytettiin ja uudet säännöt rajattiin havaittuihin
aineksiin tai resepteihin väärien hälytysten välttämiseksi.

## Avoimet kuvat

Kahdeksassa reseptissä kuva esittää selvästi toista ruokaa:
medu vada, paneer tikka, aloo paratha, Amritsari-kala, dal makhani,
idli/sambar, rogan josh ja tandoorikana. Puuteluettelo ehdottaa olemassa
olevien kuvien oikeita vastineita. Lisäksi yhdeksän kuvan ainesosa-/esitystapaero
tarvitsee tarkemman tarkistuksen.

Kuvatiedostoja ei vaihdettu eikä generoitu. Reseptin ainesosia ei muutettu
kuvan vuoksi. Alt-teksti ei voi todistaa esimerkiksi kuorrutteen sokerittomuutta.
Kuvakorjaukset on syytä käsitellä erillisenä, visuaalisesti tarkistettavana PR:nä.

## Ravintoarvot ja luokitukset

24 lähteessä on ainakin yksi numeroarvo: nettohiilihydraatti 22:ssa,
kokonaishiilihydraatti 23:ssa, proteiini ja rasva 24:ssä. Kaikilla 119:llä
on annosmäärä. Numeroita ei laskettu uudelleen eikä puuttuvia täytetty.
Puuttuva arviomerkintä lisättiin lähteeseen ja sen käännöksiin.
Toistettavaa tuotekohtaista laskentapohjaa ei vahvistettu.

Luokkia: keto 4, tiukempi VHH 37, väljempi VHH 15; 63 ilman näitä luokkia.
Perinteistä pastaa, riisiä tai perunaa ei luokiteltu uudelleen ketoksi.
Keto-pinaattilettujen otsikon ja `vhh_tiukka`-luokan epävarmuus jää avoimeksi:
ehdotus on VHH-nimi URL ennallaan tai luotettava laskelma ennen keto-lupausta.
Myös muiden keto-leivonnaisten ja pizzapohjan väitteet tarvitsevat laskentapohjan.
[Ravintonäytön malli](../nutrition-evidence.md) ohjaa myöhempää laskentaa.

## Päätettäväksi jäävät lähdeohjeet

Puuteluettelo sisältää biryanin jakamattomat kaneli-/kardemummamäärät,
dosa-/idlitaikinan määrittelemättömän veden, käyttövaihetta vailla olevat
ainesosat ja marinointi-/lepoajan ohittavat kokonaisajat. Maksan nopea
paisto-ohje tarvitsee ruokaturvallisuuteen perehtyneen tarkistajan arvion.
Puuttuvia suhteita, turvallisuuslämpötiloja tai kokonaisaikoja ei arvattu.

## Tarkistaminen ja seuraava vaihe

Auditoinnin voi uusia `npx tsx scripts/translation-audit.ts --strict --write-reports`
-komennolla `site/`-kansiossa. Päivätty puuteluettelo on tämän työn snapshot,
ei automaattisesti päivittyvä hyväksyntä. Nykyiset yksikkö-, kuva-, staattiset
ja selaintestit säilyvät. Neljä kielihakemistoa ja reseptiä tarkistetaan
leveyksillä 320/375/390/768/1024/1440 sekä ilman JavaScriptiä.

Tekninen CI voi hyväksyä muutoksen, vaikka toimituksellisia riskejä jää.
Omistajan seuraava askel on tarkistaa P0/P1-lähdehavainnot ja korjausehdotukset
sekä järjestää EN/SV/TH-ihmistarkistus. Tämä työ ei yhdistä PR:ää eikä julkaise.

## Paikallisten tarkistusten tulos

`npm ci`, 21 yksikkötestiä, 8 käännöstestiä, 2 kuvatestiä,
tuotantobuild, 7 staattisen HTML:n testiä ja 2 selaintestiä läpäisivät.
Selaimena käytettiin asennettua Bravea Playwrightin kautta. Riippuvuuksien
`npm audit --audit-level=low` ei löytänyt haavoittuvuuksia.

Build tuottaa 480 reittiä. Tämän itsenäisen sisältöhaaran JavaScript on
1 719,97 kB (gzip 346,20 kB) ja CSS 9,07 kB (gzip 2,57 kB).
Suorituskykymuutos on erillisessä PR:ssä eikä sisälly näihin lukuihin.
Puuteluettelossa on 72 havaintoa; sisältö muuttui 338 kieliversiossa
(FI 39, EN 92, SV 95, TH 112). Numerot kuvaavat tätä tarkistushetkeä.

PR-katselmoinnin kaksi P2-havaintoa korjattiin: thai-lohikeiton kalafondi
oli jäänyt kuvauksessa vääräksi, ja pyttipannun käännösten ingressissä,
kuvauksessa ja huomioissa oli lanttu/linssi/ihra-sekaannuksia.
Tekstit korjattiin lähteen mukaisiksi. Testit kattavat nyt myös kyseiset
virheet otsikossa, tekstissä ja alt-tekstissä. Tämä jälkilöydös osoittaa,
miksi automaattitulosta ei saa tulkita täydelliseksi semanttiseksi hyväksynnäksi.

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

## Kuvakorjaukset 22.10.2026

Kahdeksan intialaisen reseptin ristiin menneet kuvat kohdistettiin oikeisiin
ruokiin: medu vada, paneer tikka, aloo paratha, Amritsari-kala, dal makhani,
idli/sambar, rogan josh ja tandoorikana. Rogan joshin luulliset palat korvattiin
lisäksi ohjeen mukaisilla luuttomilla lammaspaloilla.

Seitsemästä muusta kuvasta korjattiin vahvistettu ristiriita: kantonilaisen
kalan kokonainen kala fileiksi; kosharista kikherneet pois; kung paosta
paprikapalat pois; paellasta härkäpavut pois; rahkapiirakasta marjat pois;
lihapiirakka avoimeksi; Runebergin torttujen hillo ja kuorrute tuoreeksi vadelmaksi.
Yhteensä 15 kuvatiedostoa vaihtui (7 uudelleenkohdistusta, 8 imagegen-muokkausta).
Alkuperäiset generointitulokset säilytettiin paikallisessa generated_images-kansiossa.
WebP-vienti säilyttää alkuperäiset mitat. Raaka-aineita ei muutettu kuvan vuoksi.

Mapo tofun kuva sopii kuutioituun tofuun; perusteeton silkkisyys poistettiin
alt-teksteistä. Pad see ew'n kuva tarkistettiin täydessä koossa: leveä nuudeli
ei todista riisijauhoa, joten vahvistamatonta virhettä ei väitetä korjatuksi.
Kaikki muuttuneet alt-tekstit päivitettiin FI/EN/SV/TH-versioihin.

[Kuvien korjausmanifesti](2026-10-22-v1-4-image-corrections.json) tallentaa
alkuperäiset ja uudet SHA-256-tunnisteet, vaihtojen lähteet sekä kuvauspyyntöjen
yhteenvedot. Regressiotesti varmistaa tarkistettujen tiedostojen säilymisen.
Kuvat ovat kuvituksia; niitä ei esitetä koekeittiössä valmistettujen annosten kuvina.

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

## P0/P1-jatkokorjaukset 22.10.2026

- Maksan kypsennystä jatketaan kastikkeessa vähintään 72 °C:n sisälämpötilaan.
  Mittaus tehdään paksuimmasta kohdasta. Alkuperäinen 1–2 minuuttia puoleltaan
  on ruskistamisen aloitusaika, ei kypsyyden tae.
  [USDA:n sisäelinlihan ohje](https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/meat-catfish/beef-farm-table)
  on 160 °F / 71,1 °C; reseptin kokonaisluku pyöristetään ylöspäin.
- Biryanin kaikki kaneli ja kardemumma lisätään broilerikattilaan vaiheessa 3;
  riisin keitinveteen ei tule toista annosta. Tämä on toimituksellinen täsmennys
  olemassa oleviin määriin, ei lisämausteiden keksimistä.
  [Vertailuohje](https://www.indianhealthyrecipes.com/chicken-biryani-recipe/).
- Dosa- ja idlitaikinoiden tarvitsema vesi lisättiin aineksiin määrättömänä.
  Ohje kertoo lisäyksen pienissä erissä, tavoitekoostumuksen ja dosa-taikinan
  ohentamisen ennen paistoa. Tarkkaa suhdetta ei esitetä yleispätevänä, koska
  riisi ja jauhatuslaite vaikuttavat veden tarpeeseen.
  [Dosa-vertailu](https://www.vegrecipesofindia.com/dosa-recipe-dosa-batter-recipe/)
  ja [idli-vertailu](https://www.vegrecipesofindia.com/idli-recipe-how-to-make-soft-idlis/).
- Idlin urad-dal ja sambar-keiton punaiset linssit eroteltiin vaiheissa.
  Taikinan vesi ja linssien keittovesi erotetaan kasvisten 5 dl lisävedestä.
  Idlin kypsyydelle lisättiin tikkutarkistus. Dosa-käännösten lettu/salaatti-virhe
  korjattiin samalla.

Korjaukset ovat kaikilla neljällä kielellä. Auditoinnin luettelossa ei ole enää
avoimia P0/P1-havaintoja. P2/P3-aika-, ravintolaskenta- ja käyttövaihepuutteet
sekä riippumaton ihmiskielentarkistus ovat yhä avoinna. Koekeittiötestiä ei tehty.

## Tarkistaminen ja seuraava vaihe

Auditoinnin voi uusia `npx tsx scripts/translation-audit.ts --strict --write-reports`
-komennolla `site/`-kansiossa. Päivätty puuteluettelo on tämän työn snapshot,
ei automaattisesti päivittyvä hyväksyntä. Nykyiset yksikkö-, kuva-, staattiset
ja selaintestit säilyvät. Neljä kielihakemistoa ja reseptiä tarkistetaan
leveyksillä 320/375/390/768/1024/1440 sekä ilman JavaScriptiä.

Tekninen CI voi hyväksyä muutoksen, vaikka toimituksellisia riskejä jää.
Omistajan seuraava askel on katselmoida korjaukset ja järjestää
EN/SV/TH-ihmistarkistus sekä priorisoida jäljellä olevat P2/P3-havainnot. Tämä työ ei yhdistä PR:ää eikä julkaise.

## Paikallisten tarkistusten tulos

`npm ci`, 21 yksikkötestiä, 10 käännöstestiä, 3 kuvatestiä,
tuotantobuild, 7 staattisen HTML:n testiä ja 2 selaintestiä läpäisivät.
Selaimena käytettiin asennettua Bravea Playwrightin kautta. Riippuvuuksien
`npm audit --audit-level=low` ei löytänyt haavoittuvuuksia.

Build tuottaa 480 reittiä. Tämän itsenäisen sisältöhaaran JavaScript on
1 730,08 kB (gzip 348,80 kB) ja CSS 9,07 kB (gzip 2,57 kB).
Suorituskykymuutos on erillisessä PR:ssä eikä sisälly näihin lukuihin.
Puuteluettelossa on 72 havaintoa; sisältö muuttui 348 kieliversiossa
(FI 43, EN 95, SV 98, TH 112). Numerot kuvaavat tätä tarkistushetkeä.

PR-katselmoinnin kaksi P2-havaintoa korjattiin: thai-lohikeiton kalafondi
oli jäänyt kuvauksessa vääräksi, ja pyttipannun käännösten ingressissä,
kuvauksessa ja huomioissa oli lanttu/linssi/ihra-sekaannuksia.
Tekstit korjattiin lähteen mukaisiksi. Testit kattavat nyt myös kyseiset
virheet otsikossa, tekstissä ja alt-tekstissä. Tämä jälkilöydös osoittaa,
miksi automaattitulosta ei saa tulkita täydelliseksi semanttiseksi hyväksynnäksi.

## P2/P3-jatkokorjaus

[Erillinen jatkoraportti](2026-10-22-v1-4-p2-p3.md) kirjaa tämän raportin
alkuperäisen auditoinnin jälkeen tehdyt 15 P2/P3-korjausta. Edellä mainitut
avoimet aika-, käyttövaihe- ja viiden reseptin keto-väitehavainnot on käsitelty.
Koneellinen luettelo on päivitetty: siinä ei ole avoimia P0–P3-havaintoja.
Viiden reseptin keto-/VHH-luokitus poistettiin puuttuvan laskentanäytön vuoksi;
ravintoarvoja ei laskettu tai keksitty. Muut ruokavalioluokitukset ja
riippumaton ihmiskielentarkistus eivät muutu tämän rajatun työn perusteella.

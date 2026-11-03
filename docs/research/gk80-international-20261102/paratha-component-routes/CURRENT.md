# GK80 – kolme valmistetun pannuleivän skenaariota

2.11.2026. Käyttäjän valtuuttamaa kolmen tutkimusreitin käyttöä jatkettiin. **Julkaistuna179/326 (54,9 %);261:n tavoitteeseen puuttuu82.** Main on edelleen `96a25d8c9db6fb0a505a70a37a5b357b6a83593a`. Tämä paketti sisältää3 uutta ehdollista valmistetun ruoan laskentaskenaariota; julkaistuja lisäyksiä0. Main, GI-rekisteri, reseptit ja Codex2:n tiedostot säilyvät ennallaan.

| Nimetty versio | Lähteisiin sidottu laskelma / annos | Ulospäin pyöristetty lähdeskenaario |
| --- | ---: | ---: |
| Aloo paratha,4 annosta, jogurtti200 g koko erälle |57,07930685–57,47330685|**55–60**|
| Aamiaisparatha,2 annosta, jogurtti100 g koko erälle |39,5874897|**35–40**|
| Kerrostettu kevätsipulileipä ja soijakastike,2 annosta |11,9838384–19,889064|**10–20**|

**Välit kuvaavat valittuja lähde-/määräskenaarioita. Ne eivät kata koko reseptivastaavuuden tai ihmisten glukoosivasteen epävarmuutta eivätkä ole95 % luottamusvälejä.** Lähteiden SEM:iä ei muutettu reseptin vaihteluväliksi. Karkea näyttö toteuttaa käyttäjän toivetta ilman desimaalien näennäistarkkuutta; se ei itsessään hyväksy valmistusvastinetta.

## Lähteet ja käyttörajat

- **Täytetty perunaparatha GI78,8:** [Thakurdesai2024](https://doi.org/10.12944/CRNFSJ.12.1.05), käsittelemätön kontrolli,n15,SEM3,6,50 g saatavaaCHO:ta, kolme glukoosivertailua ja120 min seuranta. Lähde oli jo omassa tutkimuksessa. Se koskee koko täytettyä leipää, ei vehnäjauhoa. Jauhon tarkkaa laatua ja aineiden suhteita ei anneta. Kontrollin kuitu15,3 g /50,1 g saatavaaCHO:ta on tärkeä matriisiero; reseptin puolikarkeaa vehnäjauhoa ei väitetä samaksi tuotteeksi. Rasva-, jäähdytys- ja valmistuserot jäävät LOW-vastinearvion rajoiksi. Fenuflakes-käsittelyn alempaa GI:tä ei käytetä.
- **Täyttämätön Kawan-paratha GI53:** [International Tables2021](https://doi.org/10.1093/ajcn/nqab233), Supplemental Table1, rivi2084,PDF-sivu138. Taulukko tarkistettiin kuvana:2019,n10,SEM5,50 gCHO:ta,glukoosi/2h. Pakastettu nimetty tuote kuumennettiin kuivalla pannulla1,5 min. Alkuperäinen mittaus on Sydney-palvelun julkaisematon havainto julkaistussa koonnissa. Se ei mittaa tuoretta kevätsipulileipää tai täytettyä perunaparathaa.
- **Omanin rasvainen paratha GI31,8:** [Ali2010](https://doi.org/10.1080/10942910802472852), alkuperäisjulkaisun indeksoitu menetelmä- ja tulosteksti,n9 terveitä,glukoosivertailu ja50 gCHO:ta. Pieni otos, vaihtelevuus ja tarkkojen valmistussuhteiden puute rajoittavat käyttöä. Alkuperäisen PDF:n haku palautti403; hajontaa13 ei nimetä SEM:ksi. Sen ja Kawanin lähdepisteiden ero jätetään näkyviin10–20-skenaariossa. Tuore/pakastettu, sipulilisä ja rasvasuhde eivät ole identtisiä. Kerrostetun täyttämättömän leivän luokka on soveltuvuushypoteesi, ei todistettu reseptivastaavuus.

[Lähdekortit](prepared-source-cards.json) erottavat lähteen luotettavuuden reseptisovelluksesta. Suurta perhettä ei avattu yleisellä jauho-GI:llä: kaksi täytettyä versiota käyttää täytetyn leivän lähdettä ja yksi täyttämätön leipä täyttämättömän leivän vertailuja. Ei uusia globaaleja vakioita tai rasva-/proteiinikorjauksia.

## Täydelliset määrät ja laskentayksiköt

[Syötteet](cases.json) kattavat jokaisen alkuperäisen ainesrivin ja mahdollisen lisätyn jogurttirivin. Pannuleivän kokoCHO kerrotaan sen valmistetun yksikön GI:llä **vain kerran**. Samojen jauhojen tai perunoiden erillistä GI-osuutta ei lisätä päälle. Jogurtti ja tarjoilusoija lasketaan erikseen.

Molemmat parathaversiot sisältävät punnitun50 g/annos jogurtin, koska ohjeissa mainittu jogurtti ei ollut alkuperäisessä ainesluettelossa. Lähde on Fineli619 ja nykyinen maitotuoteryhmän35-analogia. Muita määrättömiä tarjoilulisukkeita ei väitetä sisältyviksi tähän nimettyyn versioon. Isossa parathassa valitaan30 g gheetä ja400 g kuorittua perunaa lähtömassana. Juustokumina on uuden version punnittu2,65 g jauhettu mauste; tämä muutos alkuperäisestä siemenlusikasta kerrotaan. Chili1 g ja garam masala2 g punnitaan. Garam masalanCHO säilyy fysikaalisella välillä0–2 g/erä; nolla on vain tuntemattoman osuuden matemaattinen alaraja, ei sille annettu koostumuspiste.

Kevätsipulileivän nykyiset määrät säilyvät. AUSNUT2023:n samojen elintarviketunnisteiden tiheydet antavat kevätsipulille12,6 g, seesamiöljylle13,8 g ja soijakastikkeelle15,75 g. Neutraali öljy13,5 g tulee Finelin omasta lusikkamitasta. Seesamiöljylle käytetään natiivia AFCD-seesamiöljyä0CHO; polyolien nollaa ei päätellä. Soijakastikkeen AFCD F008065:n natiiviWITHOUT-sugar-alcohols3,2 g/100 g kuuluu nykyisen rajatun ryhmäimputoinnin50 lähdelistaan. GI50 on koodaus, ei mitattu soijan GI. Siten myös käyttäjän valitsema kolmas reitti on konkreettisesti käytössä.

## Vaikutus ja varmennus

Oma aineisto sisältää nyt12 täyttä A-tutkimusversiota ja4 erillistä ehdollista valmistetun ruoan B-skenaariota: **16 eri resepti-ID:tä**. Uudet3 eivät osu Codex2:n kolmeen tarkistettuun varauslistaan tai julkaistuun179:ään. Lisäksi muualla hyväksytty rahkapiirakka1 on erillinen. Kaikkien myöhempi hyväksyntä ja julkaisu voisi nostaa kokonaisuuden196/326:een, jolloin puuttuisi65. Tämä on ehdollinen mahdollisuus, **ei tämänhetkinen kattavuus eikä valmis julkaisuerä**. [Täsmälliset joukot](impact-and-coordination.json).

[Laskenta](calculate.py), [tulokset](results.json) ja [riippumaton Decimal-/natiivilähdetarkistus](verify_decimal.py) läpäisivät. Kuusi negatiivista kontrollia hylkää kaksoislaskennan, tuntemattoman mausteen nollaamisen, täytetyn/täyttämättömän vastineen sekoittamisen, puuttuvan jogurttimäärän, pois jätetyn lisukejaon ja kokonaisruoan GI:n antamisen raakajauholle. Lähteiden [hash-sidonnat](source-manifest.json) ovat mukana. Ei raskastaCI:tä, buildia, pushia tai julkaisua.

Seuraava portti on lähde- ja valmistusvastaavuuden arviointi näille täsmällisille versioille. Erityisesti perunaparathan kuitu-/jauhomatriisia ja tuoreen kevätsipulileivän suhdetta rasvaiseen/pakastettuun parathaan ei voi ratkaista pelkällä pyöristyksellä. Ensimmäisen33-reseptisen jauhoseulonnan muuta joukkoa ei lasketa avautuneeksi.

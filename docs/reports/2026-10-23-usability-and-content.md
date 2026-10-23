# Reseptien käytettävyys ja sisältölaatu

Päiväys: 23.10.2026, Europe/Helsinki.
Haara: `codex/reseptit-followup-audit`.
Lähtöcommit: `73644fd458e3d449e5edd450099dae82fdac65c7`.

## Suunnitelma ja toteutus

Käyttäjä pyysi toteuttamaan sivustoarvion parannukset ja tekemään CPR:n.
Toteutus jatkaa olemassa olevaa korjaushaaraa.

1. Reseptin otsikko ja päätoiminnot siirrettiin kuvan yläpuolelle.
   Ohjeeseen pääsee tavallisella ankkurilinkillä myös ilman JavaScriptiä.
2. Tulostus käyttää selaimen tulostustoimintoa. Tulosteessa näkyvät valittu
   annosmäärä, skaalatut ainekset ja kaikki työvaiheet ilman yliviivauksia.
   Ohjetekstin määrien ja kypsennysajan skaalausrajoitus kerrotaan, kun
   annosmäärää muutetaan.
3. Työvaiheita voi merkitä tehdyiksi ja nollata. Tila säilyy nykyisellä
   sivulla; reseptin tai kielen vaihto nollaa sen. Tallennusta selaimeen ei
   lisätty. Markdown-muotoilu ja jatkorivit säilyvät. Muotoilultaan sekava
   ohje näytetään kokonaisena alkuperäisellä rendererillä ilman valintaruutuja.
4. Hakuun lisättiin enimmäisaika, ruokakulttuuri ja pääraaka-aineryhmä.
   Lisäsuodattimet avataan tarvittaessa. Valinnat tallentuvat URL-osoitteeseen.
   Epäkelvot arvot hylätään; puuttuva aika ei vastaa aikasuodatinta.
5. Ruokakulttuurit tulevat suomenkielisistä lähdetageista ja
   pääraaka-aineryhmät `main_ingredient`-metatiedoista. Samat ryhmät
   kopioituvat käännöksille. Tämä ei ole ruokavalio- tai allergeeniluokitus.
   Nykyiset kulttuuriryhmät ovat Thai, Intia, Kiina ja Välimeri.
6. Sivun alatunnisteessa on avattava tietoa-osio: ylläpitäjä, tekoälyn käyttö,
   kuvitus, tarkistusten rajat ja korjauspalautteen GitHub-linkki.
   Ravintoarvopaneeli erottaa puuttuvat arvot arvioista. Keto/VHH-luokituksen
   rajaus näkyy sitä käyttävässä reseptissä ja aktiivisen suodattimen yhteydessä.
7. Käyttöliittymätekstit lisättiin FI/EN/SV/TH. Näppäimistöfokus näkyy,
   uudet kosketuskohteet ovat vähintään 44 px korkeita ja vähennetyn liikkeen
   asetus poistaa pehmeän vierityksen.

Staattiset reseptit ja linkit säilyvät HTML:ssä. Toimimattomia haku-,
annos-, tulostus- tai työvaihepainikkeita ei näytetä ilman JavaScriptiä.
Suosituimmuusjärjestystä ei luotu ilman käyttödataa. Kuvien kokovalinta,
projektipolku, canonical ja hreflang säilyvät nykyisen mallin mukaisina.

## Sisältö ja oma käännöstarkistus

Suomenkielinen lähde luettiin kokonaan seuraavista: lohipata,
kauralesesämpylät, makaronilaatikko, butter chicken ja Italian pata.
Aineslistaa verrattiin työvaiheisiin ja muistiinpanoihin. Tämä otos ei ole
koko kirjaston koekeittiötesti tai kaikkien käännösten semanttinen hyväksyntä.

Sämpylöiden korjaukset kaikilla neljällä kielellä:

- 45 minuutin työ-, turvotus- ja paistoarvio siirrettiin muistiinpanoihin.
  Vaaditun täydellisen jäähtymisen kestoa ei tunneta. `time_total_min` on
  siksi `null`, eikä JSON-LD julkaise harhaanjohtavaa kokonaisaikaa.
- Laskennan olemassaoloa korostanut sanamuoto korvattiin arviota kuvaavalla
  tekstillä. Alkuperäisiä ravintoarvoja tai raaka-ainemääriä ei muutettu.
- EN: uunin keskitaso ja mururakenteen asettuminen ilmaistaan luontevasti.
- SV: frallor, genomgräddade ja inkråmet korvaavat väärät ruoanlaittotermit.
- TH: annos on yksi sämpylä, ei rulla; kypsyminen ja sisuksen asettuminen
  kuvataan suomenkielisen ohjeen mukaisesti.

Uudet käyttöliittymätekstit ja muuttuneet reseptilauseet verrattiin
suomenkieliseen merkitykseen. Taso on **AUTOMATED SEMANTIC REVIEW**;
**HUMAN REVIEW PENDING** säilyy. Oma tarkistus ei ole riippumaton ihmistarkistus.
Ajantasainen inventaario päivitettiin. Aiemmat butter chicken- ja Italian
pata -korjaukset ovat samalla haaralla.

## Tarkistusmatriisi ja tulokset

| Kohde | Tarkistus | Tulos |
| --- | --- | --- |
| Sisältö, haku, annokset, turvallinen Markdown | `npm test` | 39/39 |
| Käännökset ja tarkistusevidenssi | `npm run test:translations` | 26/26 |
| Kuvat ja transaktionaalinen kuvarakennus | `npm run test:image` | 7/7 |
| Staattinen HTML ja SEO-regressiot | `npm run test:static` | 19/19 |
| Selaimen neljä testikokonaisuutta | `npm run test:browser` Bravella | 4/4 |
| Tuotantobuild ja prerenderöinti | `npm run build` | 480 reittiä |
| Julkaistavien tiedostojen SEO | `npm run audit:seo` | 0 löydöstä |
| Käännösten rakenteellinen auditointi | 119 lähdettä, 357 paria | 0 virhettä |

Selaintarkistus kattaa 320–1440 px leveydet, neljä kieltä, näppäimistökäytön,
haun URL-palautuksen, valintaruutujen nollauksen, annoslaskurin, tulostustilan,
JavaScriptittömän HTML:n sekä reitti- ja kuvalatauksen regressiot.
Kuvavalintatesti käyttää 54 uutta selainkontekstia ja erillistä JS:töntä sivua.
Poikkeustapauksina tarkistettiin puuttuva kokonaisaika, tuntemattomat
suodattimet, sisällön sekoittuminen reittivaihdossa ja Markdownin jatkorivit.

Erillisessä visuaalisessa Brave/CDP-tarkistuksessa katsottiin reseptisivu
1440 px leveydellä, työvaiheet 390 px leveydellä, avatut Thai-suodattimet
390 px leveydellä ja viidelle annokselle skaalattu tuloste. Mobiilissa ei
ollut vaakavieritystä. Tulosteessa kaikki työvaiheet säilyivät luettavina.

Ensimmäinen paikallinen rinnakkainen kuvarakennus ja sisältösynkronointi
törmäsivät samaan generoituun kuvakansioon (Windows EPERM). Ajovirhe johtui
päällekkäisistä tarkistusprosesseista. Kuvasarja valmistui, minkä jälkeen
lopullinen build ja siitä riippuvat tarkistukset ajettiin peräkkäin.
Kaksi vanhaa HTML-testiä päivitettiin odottamaan ohjeotsikon uutta
ankkuri-id:tä ja fokusattribuuttia.

## Jäljellä olevat rajat

Ravintoarvoauditointi: 119 reseptistä 24:llä on arvoja ilman riittävää
raaka-ainekohtaista laskentapohjaa, 95:ltä arvot puuttuvat. Varmennettuja
kokonaislaskelmia ei ole. Tämän muutoksen tarkoitus on näyttää nykyinen
tiedon laatu rehellisesti, ei keksiä puuttuvia arvoja.

Käännösrekisterin kaikki 357 paria ovat automaattisesti tarkistettuja;
riippumattoman ihmisen valmiita hyväksyntöjä on 0. Ravintoarvojen tietolähteiden
täydentäminen, mittaukset ja ihmisen kielentarkistus jäävät sisältötyöksi.

GSC:n sivukarttaluettelo tarkistettiin tämän työn aikana uudelleen.
`/sitemap.xml` näyttää edelleen **Noutaminen epäonnistui**, 0 löydettyä sivua.
Onnistunutta käsittelyä ei väitetä. Aiempi Googlen onnistunut live-nouto on
kirjattu [edelliseen raporttiin](2026-10-23-sitemap-and-timing.md).
Sivukarttaa ei lähetetty uudelleen eikä originin robots.txt:tä muutettu.

## CPR ja julkaisuraja

Muutokset commitataan ja pushataan nykyiseen haaraan. Uutta PR:ää ei avata
ilman erillistä pyyntöä. Tässä työssä ei yhdistetä haaraa eikä tehdä
tuotantojulkaisua. GitHubin Recipe site -työnkulku käynnistyy main-pushista
tai PR:stä; tämän haaran push ei yksin tuota CI- tai deploy-tulosta.

ReportHubin raportointikynnys tarkistettiin. Tämä on yksi rajattu
toteutus- ja tarkistuspassi, jonka tuoteraportti ja Git-diff säilyttävät
riittävästi; erillistä ReportHub-mikroraporttia ei luoda README-ohjeen mukaisesti.
Seuraava julkaisuaskel on tämän haaran katselmointi ja yhdistäminen erillisellä
pyynnöllä. GSC:n käsittelytila varmistetaan sen omasta raportista.

# Recipavo – GitHub-valmiuden auditointi ja korjausohjelma

Päiväys: 26.11.2026

Omistaja: Chat 7

Tila: DRAFT / HOLD – suunnittelu ja katselmointi, ei tämän kierroksen integraatioon eikä tuotantoon.

## 1. Tavoite ja valtuutus

Nostetaan Recipavon GitHub-hallinta, tietoturva, toimitusketju, lisenssien
hallinta ja palautettavuus todennetulle 5/5-tasolle. Tavoite on sisäinen
valmiusarvio, ei tietoturva- tai oikeudellinen sertifiointi.

Käyttäjän päätös: repo pysyy julkisena. Tämä dokumentti ei anna lupaa
asetusten muuttamiseen, korjausten toteuttamiseen, Ready-siirtoon, mergeen,
deployhin, haarojen poistamiseen tai tuotantoporttien muuttamiseen.
Toteutuspaketit valtuutetaan myöhemmin erikseen. Chat 1:n integraatiovastuu
ja muut nykyiset PR-omistajuudet säilyvät.

Tämä on julkiseen repoon sopiva yhteenveto. Yksityiskohtaiset tilikohtaiset
turvallisuushavainnot, luottamukselliset asetukset, mahdollinen
haavoittuvuusevidenssi ja palautusmateriaalit käsitellään yksityisesti,
ei julkisissa issueissa, PR-kommenteissa tai CI-artefakteissa.

## 2. Auditoitu lähtötilanne

Lähderepo: ozirix-dev/Reseptit

Tarkastettu main: `45605d813980bd6c6a6af08e75e4678c68edf1b8`.

[Mainin tilannekuva](https://github.com/ozirix-dev/Reseptit/tree/45605d813980bd6c6a6af08e75e4678c68edf1b8).

Havainnot perustuvat 26.11.2026 GitHub API:n lukukyselyihin, tähän
committiin sidottuihin tiedostoihin, CI-ajojen tietoihin ja aikaisempaan
palautusnäyttöön. Muuttuvat määrät ovat otoksia, eivät pysyviä
järjestelmävaatimuksia.

| Mittari | Otos |
| --- | --- |
| Versionhallinnan tiedostoja | 5 146 |
| YAML-workflow-tiedostoja | 19 |
| Etähaaroja, sivutettu inventaario | 898 |
| Actions-ajoja yhteensä | 4 686 |
| Actions-ajoja 19.–26.11.2026 | 2 159 |
| Pakettitietueita npm-lukitustiedostossa | 144 |
| Pakettien integrity-kenttä | 144/144 |
| Julkisia forkkeja | 0 |
| GitHub Releases | Ei julkaisuja otoksessa |

Forkkien määrä ei mittaa klooneja eikä luvattomia kopioita. Actions-ajojen
määrä ei ole runner-minuuttien tai todellisen kustannuksen mittaus.

## 3. Nykyinen valmius

| Osa-alue | Alustava arvio / 5 | Peruste |
| --- | ---: | --- |
| Tuotantojulkaisujen hallinta | 4,5 | SHA-portit, ympäristöhyväksyntä ja jälkivarmennus |
| Testaus ja CI/CD | 4,5 | Riskiperusteinen CI, sisällön ja selaimen testit |
| Agenttien työnomistajuus | 4,5 | Erilliset haarat, tunnisteet ja Repo Guard |
| Dokumentaatio | 4,0 | Kattavat prosessiohjeet; julkisen repon ohjeissa aukkoja |
| Riippuvuudet | 3,5 | npm-lukitus ja Dependabot; Actions-lukituksen kattavuus |
| Palvelinpuolen suojaus | 3,0 | Aktiivinen PR/CI-ruleset; kokonaisvarmennus kesken |
| Varmuuskopiointi ja palautuminen | 3,0 | Kuvapalautuksesta näyttöä, koko palvelukokonaisuudesta ei |
| Ylläpidettävyys | 3,0 | Inventaario ja työpuutyökalut; suuri haaramäärä |
| Tietoturvaominaisuuksien varmennus | 2,5 | Hallinta-asetusten ja skannausten näyttö puuttuu osittain |
| Lisensointi ja oikeudet | 2,5 | LICENSE-PR olemassa, oikeus- ja riippuvuusauditointi avoin |

Painottamaton keskiarvo on 3,5/5. Varmistamattomat kontrollit alentavat
arviota, mutta eivät yksin todista virhettä. Yhtäkään haavoittuvuutta
ei väitetä tässä auditissa todennetuksi.

### 3.1 Toimiviksi todetut rakenteet

- Main-haaraan kohdistuu aktiivinen ruleset, jossa PR ja build-tarkistus
  vaaditaan. Mainin tarkka CI-revisio tarkistetaan. Työnomistajuus ja
  riippumaton katselmointi on dokumentoitu.
- Node 22, npm ci, versionoitu package-lock.json, riskiperusteinen
  testivalinta, testirevision varmennus sekä vanhentuneiden PR-ajojen
  peruutus muodostavat toistettavan perustan.
- Tuotanto ei käynnisty automaattisesti main-pushista. Manuaalinen
  julkaisutyönkulku sitoo julkaisun SHA:han, CI:hin ja tuotantoympäristön
  hyväksyntään sekä varmentaa julkaisun jälkikäteen.
- Viimeisin auditissa tarkastettu main-CI ja tuotantojulkaisun näyttö
  olivat onnistuneita. Tuotantovalvonnasta on onnistuneen ajon näyttö.
- Dependabotin viikoittainen npm- ja Actions-päivityskonfiguraatio,
  gitignore, gitattributes, PR-pohja ja Chat owner metadata ovat olemassa.
- Viikoittainen haarainventaario ja paikallinen worktree-tarkistin ovat
  olemassa. Automaattinen haarojen poisto ei ole käytössä.
- Kuva-aineiston manifestointi, SHA-tarkistukset ja palautuskokeet on
  toteutettu. Koko järjestelmän palautettavuus on eri kysymys.

### 3.2 Parannettavat ja varmistamattomat asiat

- LICENSE on erillisessä PR:ssä #1023, ei tässä dokumenttimuutoksessa.
  Chat 2:n riippumaton rajattu katselmointi on PASS samalla HEADilla
  `81cb19cbb43ac0b697a2ddca57251539f9a932ef`.
  Katselmointi ei korvaa juristia, oikeusketjujen auditointia tai
  kolmansien osapuolten lisenssien kokonaisinventaarioa.
- GitHubin rulesetin pakolliset kontrollit eivät kata kaikkia
  dokumentoidun Repo Guard -prosessin tarkistuksia. Varmennetaan
  palvelinpuolen suojaus ja yhteensopivuus saman GitHub-identiteetin
  rinnakkaistyön kanssa ennen muutoksia.
- Actions-lukitustiedosto on olemassa. Sen workflow-kattavuus on
  osittainen, ja osa työnkuluista käyttää suoria SHA-pinnauksia.
  Todellinen lukitusten soveltaminen ja muutospolku on varmennettava.
- CodeQL-, Dependency Review-, Secret Scanning-, Push Protection- ja
  Dependabot Security -kokonaisuuden asetuksia ja tuloksia ei ole
  kattavasti varmennettu. Puuttuva tiedosto ei tarkoita, ettei
  vastaava GitHubin hallittu ominaisuus olisi käytössä.
- Tarkastetun tiedostopuun nimihaku ei osoittanut tyypillisiä
  salaisuustiedostoja; se ei ole sisällön tai historian skannaus.
- Kolmansien osapuolten ilmoituksia ja lisenssien automaattista
  inventaariota täydennetään. LGPL- ja MPL-tietueet havaittiin
  kehitysriippuvuuksissa; jakeluun liittyvät velvoitteet tarkistetaan
  todellisesta toimitusartefaktista, ei pelkästä pakettinimestä.
- Julkisen repon turvallisuus- ja osallistumisohjeet ovat täydennettävissä.
- Koko GitHub-repon, PR-/issue-/review-metatietojen, asetusten ja
  tuotantoaineiston riippumaton palautuskokeen näyttö puuttuu tästä auditista.
- Actions-kustannuksia ja tallennusta ei vielä mitattu laskutustasolla.

## 4. Toteutusohjelma GH-01–GH-12

Prioriteetit ohjaavat seuraavan kierroksen työjärjestystä. P0 tarkoittaa
tässä ensimmäistä varmennettavaa kokonaisuutta, ei todettua kriittistä
haavoittuvuutta. Jokaisella paketilla on erillinen hyväksyntä ja
rajattu muutoslaajuus. Puuttuva näyttö merkitään avoimeksi.

| Tunnus | Prio | Työpaketti | Hyväksyttävä näyttö |
| --- | --- | --- | --- |
| GH-01 | P1 | Lisensointi | #1023:n rajattu PASS, täsmä-CI ja erikseen hyväksytty integraatio. README yhteensovitetaan sen omistajan kautta. |
| GH-02 | P0 | Tietoturva-asetukset | Nykyiset Security-, Dependabot-, CodeQL-, Actions- ja Environment-kontrollit luettu valtuutetusti. Puuttuvat kontrollit tai poikkeukset perusteltu yksityisesti. |
| GH-03 | P1 | Ruleset | Nykyinen sääntövertailu, suojausvaatimukset, testattu yhteensopivuus Repo Guardin ja GitHub-identiteettien kanssa sekä erillinen hyväksyntä. |
| GH-04 | P1 | Toimitusketju | Kaikkien soveltuvien workflow-riippuvuuksien todennettu lukitus tai SHA-pinnaus ja toimiva päivitysprosessi. Ei käsin keksittyä lockfilea. |
| GH-05 | P1 | Turvallisuustestit | CodeQL-, Dependency Review- ja salaisuusskannauksen näyttö. Ei aluksi uusia estäviä portteja; tulokset triageen ennen pakollisuutta. |
| GH-06 | P1 | Kolmannen osapuolen oikeudet | SBOM, todellisen jakelun lisenssivelvoitteet, tarvittavat ilmoitukset ja lähdeaineiston käyttöoikeuksien inventaario. |
| GH-07 | P2 | Repon dokumentit | SECURITY.md, rajattu CONTRIBUTING-ohje, tavaramerkkien käyttöohjeen tarve ja issue-pohjat. Ei julkista luottamuksellista ilmoituskanavaa. |
| GH-08 | P2 | Haarat ja työpuut | Luokiteltu inventaario ja säilytysperusteet. Ei automaattista poistoa, force-pushia tai historiankirjoitusta. |
| GH-09 | P1 | Palautuminen | RPO/RTO, riippumaton varmistus ja eristetty palautuskoe. Git, GitHub-metadata, asetukset, kuvat ja muut tuotantoriippuvuudet käsitelty. |
| GH-10 | P2 | Kustannus ja kapasiteetti | Todelliset runner-minuutit, työtyypit, peruutukset, artefaktit ja AI-katselmointikulut. Ei näkyvyysmuutosta. |
| GH-11 | P2 | Julkaisujen jäljitettävyys | Yhtenäinen SHA-, CI-, artefakti- ja deployment-ketju sekä palautusnäyttö. Ei automaattista tuotantojulkaisua. |
| GH-12 | P1 | Loppuauditointi | Riippumaton katselmointi, todelliset asetukset ja testit, avoimet riskit sekä omistajan hyväksyntä. 5/5 vain näytön perusteella. |

### 4.1 Etenemisjärjestys

1. Varmennetaan GH-02 ja kirjataan lähtötilan puutteet sekä mahdolliset
   todelliset turvallisuuslöydökset yksityisesti. GH-01 on erillinen jo
   käynnissä oleva työ.
2. Suunnitellaan GH-03 ja GH-04 nykyisten porttien kanssa yhteensopiviksi.
   Tehdään GH-05:n ei-estävä kokeilu ennen uusien pakollisten
   tarkistusten ehdottamista. Työpakettien muutokset avataan
   erikseen vain käyttäjän valtuutuksesta.
3. Toteutetaan GH-06 ja GH-07 yhteistyössä README:n omistajan kanssa.
   Oikeudellisen asiantuntijan arviota tarvitaan oikeuksien
   täytäntöönpanon ja laajojen sopimusehtojen varmistamiseen.
4. Suunnitellaan GH-09:n palautuskoe ja GH-11:n julkaisuevidenssi.
   GH-08 ja GH-10 tuottavat ensin mitattua tietoa, eivät
   poistokomentoja tai kustannusperusteisia asetusten muutoksia.
5. GH-12 arvioi toteutuneen tilan uudelleen. Mahdolliset hyväksytyt
   poikkeukset kirjataan erikseen; arvosanaa ei nosteta ilman näyttöä.

### 4.2 Omistajuus ja hyväksynnät

- Chat 7: tämän auditin omistaja ja myöhemmin erikseen valtuutettujen
  GitHub-valmiuspakettien valmistelu.
- Chat 2: riippumaton katselmointi, jos omistaja osoittaa tehtävän sille.
- Chat 1: Ready/merge/main-CI nykyisen työnjaon mukaisesti, ei tätä
  HOLD-draftia nykyisellä integraatiokierroksella.
- Kokki-Codex: tarvittaessa erikseen valtuutettu paikallinen tarkistus
  tai eristetty palautustesti.
- Käyttäjä: repon ja tilin hallinta-asetukset, turvallisuuskontrollien
  pakollisuus, kustannusvaikutukset, poistot ja muut valtuutusrajat.

Nämä ovat ehdotettu työnjako ja hyväksyntäehdot, eivät uusien tehtävien
automaattinen käynnistys tai toisten haarojen omistajuuden siirto.

## 5. Lähteet ja varmennusrajat

- [Main-CI 45797636155](https://github.com/ozirix-dev/Reseptit/actions/runs/45797636155)
- [Tuotantojulkaisu 45703417283](https://github.com/ozirix-dev/Reseptit/actions/runs/45703417283)
- [Tuotantovalvonta 45783784958](https://github.com/ozirix-dev/Reseptit/actions/runs/45783784958)
- [Haarainventaario 45034335832](https://github.com/ozirix-dev/Reseptit/actions/runs/45034335832)
- [Ruleset](https://github.com/ozirix-dev/Reseptit/rules/27278903)
- [Lisenssi-PR #1023](https://github.com/ozirix-dev/Reseptit/pull/1023)
- [Lisenssin riippumaton katselmointi](https://github.com/ozirix-dev/Reseptit/pull/1023#issuecomment-7189164345)
- [Julkaisuohje](../product/recipavo-actions-manual-release-2026-11-21.md)
- [Työpuun elinkaari](../worktree-lifecycle.md)
- [PR-omistajuus](../rinnakkaisten-chatien-omistajuus.md)
- [Actions-lukitustiedosto](../../.github/workflows/actions.lock)
- [Dependabot-konfiguraatio](../../.github/dependabot.yml)
- [npm-lukitustiedosto](../../site/package-lock.json)

GitHub-liitäntä ei mahdollistanut kaikkien hallinta-asetusten suoraa
lukemista. Tilikohtaiset asetukset, tunnusten käyttöoikeudet ja
laskutustiedot vaativat valtuutetun näkymän tai työkalun. Varsinaista
tunkeutumistestausta, koko historian salaisuusskannausta tai uutta
paikallista testiajoa ei tässä auditissa suoritettu.

## 6. HOLD – seuraava päätös

Tämä PR säilytetään Draft-tilassa. Ei Readyä, mergeä, main-muutoksia,
tuotantodeployta, GitHubin hallinta-asetusten muutoksia eikä muiden
PR:ien muutoksia tämän toimeksiannon perusteella.

Seuraava toteutusvaihe on käyttäjän erikseen valtuuttama GH-02:n
varmennus. Sitä ei käynnistetä automaattisesti tämän suunnitelman
avaamisesta.

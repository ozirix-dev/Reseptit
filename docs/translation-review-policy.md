# Käännösten tarkistuskäytäntö

Reseptikäännös voidaan julkaista, kun automaattiset tarkistukset läpäisevät,
Codex on verrannut sisällön merkitystä lähteeseen ja olennaisia virheitä ei
ole avoinna. Riippumaton ihmistarkistus vaaditaan, jos olennainen
turvallisuus- tai sisältöepäselvyys jää ratkaisematta. Muut julkaisu- ja
hyväksyntäehdot määräytyvät projektin normaalin työnkulun mukaan.

## Tarkistus ennen julkaisua

1. Tarkista PR:n automaattiset tulokset. Muuttuneiden reseptien CI-validaatio
   tarkistaa Markdownin, metatiedot, kuvatiedostot ja reitit sekä ajaa
   lähde–käännösparien auditoinnin muuttuneille reseptitunnuksille.
   Auditointi vertaa julkaistuja kieliä ja tiloja, lähdeviitteitä,
   annosmääriä, ainesosarivien lukumäärää ja rivikohtaisia määriä ja
   yksiköitä, tunnistettuja kypsennysaikoja ja -lämpötiloja, ravintoarvoja
   puuttuvine arvoineen sekä yhteistä kuvaa ja sen mittoja. GK:n nykyiset
   sidontatarkistukset varmistavat hyväksyttyjen laskentaversioiden
   linkityksen resepteihin.
2. Vertaa Codexilla muuttunutta käännöstä suomenkieliseen lähteeseen.
   Käy ainesosien merkitys ja järjestys läpi riveittäin. Vertaa
   valmistusvaiheet, määrät, ajat, lämpötilat ja huomautukset. Tarkista
   erityisesti raaka ja kypsä, eläin- ja kasvilajit, kerma ja vaahdotettu
   kerma, rahka ja raejuusto, liemi ja fondi, tuore ja säilötty sekä
   suklaa paloina ja sulatettuna. Varmista kieltomuodot, allergeenit ja
   turvallisuuden kannalta olennaiset ohjeet. Tarkista otsikon,
   kuvauksen, alt-tekstin ja hakutunnisteiden merkitys ja ymmärrettävyys.
3. Kun sisältöön kuuluu GK-arvio, tarkista, että laskentaversio erottuu
   alkuperäisestä, puuttuva arvio säilyy puuttuvana ja epävarmuus
   ilmaistaan samalla tavalla. Avaa muuttuneet lähdelinkit ja varmista
   niihin perustuvat väitteet. Tarkista myös muuttuneet sisäiset linkit.
   Ratkaise lähteen epäselvyydet todisteiden avulla. Puuttuvaa määrää,
   lämpötilaa tai ravintoarvoa ei päätellä esimerkiksi kuvasta.
4. Kirjaa kummankin tiedoston merkitystiivisteet, päivämäärä, tulos,
   avoimet ja korjatut havainnot sekä todisteviite
   `meta/kaannokset/codex-review-evidence.json`-rekisteriin. Täydennä
   korjaus-PR:n numero, kun se on tiedossa. Git säilyttää tietueen aiemmat
   versiot. Ota lähtö- ja kohdetiivisteet työjonon `registry.json`-tiedostosta.
   Kirjaa päivätty tarkistusyhteenveto ja sen kattamat tiedostot tai
   resepti–kieli-parit PR:ään tai olemassa olevaan kierrosraporttiin.
   Merkitse tarkistettu commit, automaattiset tulokset, todella tehty
   merkitysvertailu ja avoimet havainnot perusteluineen. Lisää löydetylle
   toistuvalle merkitysvirheelle rajattu regressiosuoja, kun se on
   toteutettavissa luotettavasti.

Auditointi tunnistaa tunnettuja sanavirheitä ja reseptikohtaisia
regressioita. Se ei päättele vapaasta tekstistä kaikkien ainesosien
vastaavuutta, työvaiheiden merkitystä, ylimääräisiä kypsennysarvoja tai
kieliasun luontevuutta. Nämä tarkistetaan lähdevertailussa.

## Thain merkitysvertailu

Lue ensin suomenkielinen resepti ja sitten thai itsenäisesti. Selitä hankalat
kohdat takaisin suomeksi ja vertaa niitä alkuperäiseen. Tarkista erityisesti
lajit, yrtit ja mausteet, kypsennysverbit, astiat, yksiköt ja kieltomuodot.
Korjaa luontevalla thailla ja vertaa korjatun valmistusohjeen merkitys vielä
kerran. Käytä suomea lähteenä. Takaisinkäännös täydentää vertailua.

## Havaintojen vakavuus

- **BLOCKER** estää julkaisun. Esimerkiksi automaattinen pakollinen
  tarkistus epäonnistuu, olennainen ainesosa puuttuu, valmistukseen
  vaikuttava määrä tai yksikkö on väärä, valmistusohje on vaarallinen,
  allergeenitieto on virheellinen, GK on liitetty väärään reseptiversioon
  tai lähteen kanssa on merkittävä ratkaisematon ristiriita. Korjaa ja
  tarkista uudelleen. Jos olennainen turvallisuus- tai sisältöepäselvyys
  jää ratkaisematta, pyydä ihmistarkistus ennen julkaisua.
- **WARNING** on vähäinen poikkeama, kuten ymmärrettävä mutta kömpelö
  sanamuoto tai puuttuva valinnainen selitys. Julkaisu voidaan sallia,
  kun päätös ja perustelu kirjataan.
- **INFO** on toimituksellinen havainto tai vaihtoehtoinen sanamuoto.
  Sen voi käsitellä myöhemmässä erässä.

Auditoinnin `STRUCTURE PASS` kuvaa rakennetarkistusta ja `AUTOMATED SEMANTIC REVIEW`
tunnettujen virheiden automaattista tunnistusta. Raportoi Codexin tekemä
lähdevertailu erikseen. `HUMAN REVIEW PENDING` kertoo, ettei ihmistarkistusta
ole dokumentoitu. `HUMAN REVIEW COMPLETE` edellyttää dokumentoitua
tarkistajaa, päivämäärää, versiota ja laajuutta. Inventaarion riskitasoja
käytetään työjonon priorisointiin.

## Virheilmoitukset

Reseptisivun korjauslinkki vie
[GitHub-issueihin](https://github.com/ozirix-dev/Reseptit/issues).
Ylläpitäjä voi avata issuen myös muussa käytössä olevassa kanavassa
saadusta ilmoituksesta, jolloin ilmoittaja ei tarvitse GitHub-tunnusta.

- Reseptin URL
- Kieli
- Virheellinen kohta
- Ehdotettu korjaus, jos tiedossa
- Vaikutus käyttäjään ja arvioitu vakavuus

Ylläpitäjä vertaa kohtaa lähteeseen ja muihin kieliversioihin, kirjaa
vakavuuden ja päivittää rekisterin. Korjaa tai kirjaa epävarmuus. Lisää
toistuvaan virheeseen rajattu regressiosuoja ja sulje issue vasta, kun
korjaus on varmennettu. Käsittele turvallisuusvirheet kiireellisesti.

P0 tarkoittaa välitöntä turvallisuusriskiä ja P1 olennaista sisältövirhettä.
Molemmat estävät julkaisun. P2 tarkoittaa tavallista laatuvirhettä ja P3
toimituksellista viimeistelyä.

## Riskiperusteinen eräauditointi

Tarkista ensin avoimet P0- ja P1-havainnot, sitten uudet ja muuttuneet parit,
joilta puuttuu ajantasainen vertailu. Valitse yleensä 10–20 reseptiä ja
kaikki niiden julkaistut kielet. Noudata samaa järjestystä seuraavassa erässä.
Kirjaa valmistuneet ja keskeneräiset parit yhteen rajattuun PR:ään.
`npm run review:translations -- --summary --changed-from=origin/main`
näyttää tiiviit mittarit ja kymmenen seuraavaa reseptiä. Ilman vertailuviitettä
jono painottaa tunnettuja ongelmia, vanhentuneita tarkistuksia ja reseptin riskiä. Rajaa seuraavat
erät esimerkiksi raakaa eläinperäistä raaka-ainetta, säilytystä,
kypsennyslämpötilaa, allergeeneja tai GK-versioita koskeviin resepteihin.
Käy sen jälkeen läpi uudet ja muuttuneet käännökset, joista puuttuu
merkitysvertailu, ja lopuksi vähäriskiset ryhmät. Rajaa erä resepteittäin
ja kielittäin. Käytä nykyistä auditointia ja työjonoa kohteiden valintaan
ja kirjaa kunkin erän todellinen tarkistuslaajuus.

Aja komennot `site/`-hakemistossa:

```powershell
npm run validate:changed-content -- <muuttuneet reseptipolut>
npm run test:translations
npx tsx scripts/translation-audit.ts --strict
npm run review:translations
```

Polut annetaan repon juureen suhteutettuina. CI vertaa julkaistun sisällön
merkitystiivistettä Gitin base-versioon. Uusi käännös ja merkitysmuutos
edellyttävät ajantasaista rekisteritietuetta. Suomen lähteen merkitysmuutos
vaatii kaikkien sen julkaistujen käännösten uudelleenvertailun. Paikallisessa
ennakkotarkistuksessa aseta `BASE_SHA` PR:n vertailucommitiin. Valitse tarkistukset muutoksen
mukaan. Lisää auditointikomentoon `--write-reports` vain, kun haluat päivittää
inventaarion `docs/reports/translation-audit-current.csv` ja
`docs/reports/recipe-inventory-current.csv`. Nykyisen työjonon käyttöohje
on [ihmistarkistuksen työjonossa](translation-human-review.md).

Aiemmat havainnot ja regressioesimerkit ovat
[V1.4-sisältöraportissa](reports/2026-10-22-v1-4-content-quality.md) ja
[jatkotarkistuksessa](reports/2026-10-22-translation-self-review.md).

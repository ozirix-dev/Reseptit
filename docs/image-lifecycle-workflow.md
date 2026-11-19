# Kuvien Proton-arkisto ja ulkoinen build-lähde

`assets/images.manifest.json` on tarkistussummiin sidottu kuvaluettelo.
Manifesti kattaa 395 julkaistua lähdekuvaa. Muut 48 kuvatiedostoa odottavat luokittelua.
Se ei todista, että alkuperäiset suuret PNG-masterit olisi saatu talteen.

Yhteinen toimintatapa on Masterin `handbook/image-lifecycle.md` ja toteutus
Windows-repon `docs/IMAGE-ASSET-LIFECYCLE.md`. Hyväksytyt alkuperäiset
arkistoidaan Protoniin; tuotanto käyttää nykyistä Cloudflare-jakelua.
Manifestit ja erikseen sallitut pienet UI-kuvat kuuluvat Gitiin.

## Build ja palautus

Nykyinen CI-tila on `r2`: omistajarepon ajot palauttavat yksityisen paketin ja
tarkistavat sen sekä jokaisen kuvan SHA-256:n ennen buildia. Nykyisiä Git-kuvia, tuotantoa tai backup-käytäntöjä ei muuteta.
Testaa ulkoinen kuvalähde erilliseen hallittuun hakemistoon tehdyn Proton-
palautuksen tai varmennetun CI-paketin avulla:

```powershell
python site/scripts/restore-image-inputs.py --manifest assets/images.manifest.json --project ozirix-dev/Reseptit --verify-root <palautettu-kuvajuuri>
$env:PROJECT_IMAGE_ROOT = '<palautettu-kuvajuuri>'
cd site; npm run build
```

Puhtaan kloonin build ei saa riippua tämän koneen D:-asemasta tai käyttäjän
Proton-istunnosta. `ci.mode: r2` käyttää yksityistä projektikohtaista
CI-pakettia, tarkistaa paketin ja kuvien SHA-256:t ja asettaa saman kuvajuuren.
Adapteri on Windows-repon `restore_image_bundle.py`:n identtinen kopio.
Sen muutokset pitää päivittää ja testata molemmissa omistajissa.

Aktivointi vaatii yksityisen bucketin, vain kyseisen bucketin Object Read-only
CI-tunnuksen, todennetun upload/readback-kuitin ja manifestiin lukitut
`bundleSha256`/`key`-arvot. Henkilökohtaisia Proton-tunnuksia ei anneta CI:lle.
Erillinen puhtaan kloonin koe ja poistohyväksyntä tarvitaan ennen Git-kuvien
poistoa. Git-historia säilyy; tämä muutos ei pienennä vanhoja Git-objekteja.

## Yksityisen CI-siirron koe 19.11.2026

`image-ci-1187705081` on luotu Standard-säiliöksi. Julkinen kehitysosoite on
pois käytöstä, eikä omia domaineja ole liitetty. Manifesti lukitsee 395 kuvan
82 635 392 tavun paketin avaimen ja SHA-256:n. Pilvestä tehty täysi ZIP-
palautus ja kaikkien kuvien tarkistus onnistui. Myös `kuvat/`-kansion ohittava
puhdas klooni rakentui näillä R2:sta palautetuilla kuvilla.

CI-lukutunnuksella on vain tämän säiliön Object Read only -oikeus;
kirjoitusyritys torjuttiin HTTP 403:lla. Paikallinen kirjoitustunnus on eri
tunnus, jolla on vain saman säiliön Object Read & Write -oikeus.
Salaiset arvot ovat `K:/platform/providers/cloudflare/image-ci/`-holvissa.
`recipavo-ci-reader.json` sisältää GitHub Actionsiin toimitettavat kentät
`accessKeyId` ja `secretAccessKey`. Repository-secretien nimet ovat
`IMAGE_CI_ACCESS_KEY_ID` ja `IMAGE_CI_SECRET_ACCESS_KEY`. Kirjoitustunnusta
ei toimiteta CI:lle. Salaisuudet asetettiin käyttäjän nimenomaisella valtuutuksella kirjautuneen
GitHub-käyttöliittymän kautta. Repo Guardissa ei ole secrets-operaatiota;
suoria gh- tai GitHub-MCP-muutoksia ei käytetty.

Palautettu kuvajuuri annetaan CI:ssä vain oikealle buildille ja sisältö-
tarkistuksille. Sitä ei aseteta koko työn ympäristöön, jotta eristetyt testit
voivat käyttää omia kuvafixtureitään. Git-kuvia ei poisteta tämän kokeen vuoksi.
Fork-PR:t ja Dependabot-ajot palauttavat vain jo julkaistut tuotantolähteet
manifestin täsmällisestä Pages-julkaisusnapshotista ilman S3-tunnuksia,
evästeitä tai Authorization-headeria. Jokaisen kuvan tavumäärä ja SHA-256
tarkistetaan; Git-kuvakansiota ei käytetä. HTTP-uudelleenohjauksia ei seurata.
Vain production-source-rooli kelpaa; alkuperäisiä yksityisiä mastereita ei
haeta tätä kautta. Omistajan ajo käyttää edelleen yksityistä R2-pakettia.

Julkaisematon, vaihtunut tai poistunut lähde pysäyttää tunnuksettoman ajon.
Ylläpitäjä päivittää silloin snapshotin tai ajaa katselmoidun muutoksen
omistajarepon haarassa. Tarkistuksia ei ohiteta. Pages säilyttää nykyisen
tuotantojulkaisun ja viimeisimmät 100 deploymentia; snapshot ei ole pysyvä
arkisto eikä korvaa Proton-varmennusta. Älä oleta vanhojen fork-commitien
julkisen palautuslähteen säilyvän ikuisesti.

Katso [Cloudflaren deployment-rajat](https://developers.cloudflare.com/pages/platform/limits/).

## Uudet kuvat

Aloita ImageAssets `init` vahvistetulle projektille `ozirix-dev/Reseptit` ja aseta
`PROJECT_IMAGE_WORK_ROOT` palautettuun `generationRoot`-hakemistoon.
Hyväksy vain projektissa tarvittavat alkuperäiset `seal`-toiminnolla.
Arkistoinnin pitää läpäistä tiedostoluettelo, erillinen palautus ja SHA-256:t.
Sulje työ vasta tarvittavan julkaisutodisteen jälkeen. Rekisteröidyt kokeilut
ja ylimääräiset paikalliskopiot tulevat siivottaviksi seitsemän päivän kuluttua.
Tuntematon tiedosto tai epäselvä versio jää tarkistettavaksi.
Synkronoidun Proton-tiedoston poistaminen voi poistaa pilvikopionkin;
cloud-only-tilaan siirrytään **Free up space** -toiminnolla.

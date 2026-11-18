# Kuvien säilytys ja Proton-arkistoinnin pilotti

Tämä on 18.11.2026 testattu menettelyehdotus. Se ei muuta nykyistä
julkaisuputkea, varmuuskopiointia tai anna poistovaltuutta.

## Mitä paikallisesti tarvitaan

Nykyinen build lukee versionoidut WebP-lähteet hakemistosta `kuvat/`.
Niitä tarvitaan aktiivisessa checkoutissa kehitykseen, testeihin ja buildiin.
GitHubista palautettu klooni sisältää ne. Inaktiivisen projektin koko
checkoutin ei tarvitse olla pysyvästi D:-asemalla.

18.11.2026 lähdecommitissa `e8ed43ed525a9cb6abbe61b94bc1c036153979c7`
repon kaikissa hakemistoissa oli 444 versionoitua WebP-tiedostoa,
yhteensä 92 436 712 tavua. Julkaisu käytti 395 lähdekuvaa.
`site/public/kuvat/` ja `site/dist/kuvat/` sisälsivät kumpikin 1 451 kuvaa
sekä manifestin, yhteensä 161 835 331 tavua. Nämä ovat uudelleenluotavia
build-kopioita. Neljä kieliversiota jakavat saman kuvatuotoksen.

`kuvat/`-WebP on tämän putken lähde, mutta se ei todista kameran tai
kuvageneraattorin alkuperäisen PNG/JPEG-tiedoston säilymistä. Hyväksytty
alkuperäinen, muokkaushistoria ja tuotanto-WebP ovat eri säilytyskohteita.

## Luokittelu

| Luokka | Aineisto | Säilytys |
| --- | --- | --- |
| A | Kameran ja käyttäjän ainutkertaiset alkuperäiset | Erillinen varmennettu arkisto, ei automaattipoistoa |
| B | Hyväksytty generaattorin alkuperäinen PNG/JPEG | Proton-arkisto ja manifesti; paikallisesti työn ajan |
| C | Käytetyt tuotanto-WebP:t | Nykyisin GitHub ja Pages; varmennettu arkisto ennen paikallisen ainoan kopion vapauttamista |
| D | 480/720/960/1440-kuvat ja rajatut AVIF-versiot | Build tuottaa uudelleen; ei Gitiin |
| E | Hylätyt kuvat ja kokeilut | Luokittele; alustava 30 päivän katselmointiraja suljetulle työlle |
| F | Build ja kuvavälimuisti | Vain aktiiviseen työhön; nykyinen putki korvaa vanhat variantit |
| G | Tuntematon tai keskeneräinen aineisto | Säilytä, kunnes tarkoitus ja omistajuus on selvitetty |

7 päivän esikatseluraja sopii suljetun, julkaistun työn uudelleenluotaville
välikopioille. 30 päivää antaa hylätyn kuvan korjaukselle aikaa. Nämä ovat
ehdotettuja katselmointirajoja, eivät käyttöön otettuja poistotehtäviä.
Kesken oleva työ, epäonnistunut julkaisu tai puuttuva arkistotodiste estää
siivouksen iästä riippumatta. Gitin ohittaminen ei merkitse poistokelpoisuutta.

## Cloudflare ja palautus

Tuotantokuvat ovat `recipavo-site`-Pages-julkaisussa, eivät Recipavon R2:ssa.
18.11.2026 tarkistuksessa tilillä ei ollut Recipavon R2-säiliötä.
Pages-julkaisu `a72d7848-24a7-43af-b7f1-11fd131df609` vastasi yllä olevaa
lähdecommittia. Kaikki sen 1 451 kuvaa ladattiin erilliseen hakemistoon:
jokaisen SHA-256 vastasi manifestia ja puhtaan kloonin buildia.
Manifesti oli sama myös `www.recipavo.com`-osoitteessa.

Palauta nykyinen projekti ensisijaisesti GitHubista ja suorita `site/`-kansiossa
`npm ci` sekä `npm run build`. Kylmä build onnistui ilman vanhaa kuvavälimuistia.
Pagesista voi pelastaa julkaistut kuvat manifestin luettelon avulla, mutta
luonnokset, käyttämättömät lähteet ja alkuperäiset masterit eivät välttämättä
ole julkaisussa. Pages-julkaisun poistaminen poistaa tämän palautusreitin.
Uusi julkaisu ei ole vanhojen kuva-avainten pysyvä varmuuskopio.

## Proton CLI: pieni koe ja pysyväksi ehdotettu kulku

Virallinen Windows-CLI 0.9.0 ladattiin Protonin julkaisuindeksistä ja
SHA-512 tarkistettiin. Testissä käytettiin valmista suojattua istuntoa.
Polku `/my-files/Image Archives Pilot 2026-11-18/Recipavo/Recipavo`
sisältää vain kaksi testikuvaa ja manifestin, ei oikeiden alkuperäisten arkistoa.
Kaikki kolme tiedostoa palautettiin erilliseen hakemistoon ja niiden SHA-256
täsmäsi. Toinen lähetys säilytti samat objekti- ja revisiotunnisteet.

Ehdotettu jatkomenettely:

1. Tee työ synkronoimattomassa projektikohtaisessa tilapäishakemistossa.
2. Valitse hyväksytyt alkuperäiset. Älä arkistoi raakaa ja valittua kopiota
   kahdesti, jos SHA-256 on sama. Säilytä erilliset hyväksytyt versiot.
3. Muodosta eräkohtainen manifesti: projektin ja erän tunnus, suhteellinen
   polku, tarkoitus, tavumäärä, SHA-256, hyväksyntä sekä yhteys tuotantokuvaan.
4. Lähetä muuttumaton erähakemisto Protonin projektikohtaiseen arkistoon.
5. Listaa pilvikansio ja palauta koko erä toiseen, tyhjään hakemistoon.
   Tarkista täsmällinen tiedostojoukko, tavumäärät ja jokainen SHA-256.
6. Julkaise nykyisten hyväksyntöjen kautta ja tarkista täsmällinen julkaisu.
7. Tallenna Gitiin manifesti ja palautuskokeen kuitti. Vasta arkistoinnin ja
   julkaisun yhteinen todiste tekee ylimääräisestä työkopiosta siivousehdokkaan.

CLI:n testatut peruskomennot ovat `filesystem upload -f skip -d merge -t`,
`filesystem list --json` ja `filesystem download -f skip -d merge`.
Käytä uutta erätunnusta ja tyhjää palautushakemistoa. `skip` ei todista
olemassa olevan tiedoston oikeellisuutta; tarkista se palauttamalla.
Älä käytä arkistoinnissa `replace`, `trash`, `delete` tai paikallisen kohteen
poistavaa `remove`-valintaa. CLI:n testatut pitkät konfliktivalinnat ovat
`--file-conflict-strategy` ja `--folder-conflict-strategy`.

Windows-sovelluksen **Free up space / Vapauta tilaa** palauttaa tiedoston
cloud-only-tilaan. Tavallinen Delete tai Remove-Item synkronointikansiossa
voi poistaa pilvikopionkin. Pilotin PNG näkyi Windowsissa 44 016 tavun
loogisena tiedostona, jonka paikallinen varaus oli 0 tavua. CLI-palautus
tehtiin synkronointikansion ulkopuolelle. Kuvan avaaminen tai tiivisteen
laskeminen cloud-only-polusta voi ladata sen takaisin paikalliseksi.

## Rajat

Nykyisiä Git-kuvia ei siirretä pois tässä muutoksessa. Pelkkiin manifesteihin
siirtyminen edellyttäisi ennen buildia toimivaa, SHA-256-varmennettua
palautusvaihetta myös CI:lle. Protonin käyttäjäistuntoa ei pidä kopioida CI:hin.
Vanhojen alkuperäisten koko arkiston olemassaoloa ei ole todistettu.
Ajastettua siivousta, tuotantojulkaisua tai varmuuskopioinnin vaihtoa ei tehty.

Lähteet: [Proton CLI](https://proton.me/support/drive-cli),
[Windows on-demand sync](https://proton.me/support/proton-drive-windows-on-demand-sync),
[synkronoitujen tiedostojen poisto](https://proton.me/support/proton-drive-delete-restore-synced-files),
[nykyinen kuvaputki](responsive-images.md).

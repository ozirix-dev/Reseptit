# Responsiiviset reseptikuvat

## Ylläpito

Reseptin `image.src` osoittaa alkuperäiseen WebP-kuvaan `kuvat/`-kansiossa.
Säilytä alkuperäinen hyvälaatuisena. Älä lisää variantteja Markdowniin tai Gitiin.
`npm run content:sync` ja `npm run build` tuottavat tarvittavat versiot automaattisesti.
Vain julkaistun sisällön käyttämät kuvat käsitellään, kerran kaikille kielille.

- Sharp 0.35.5 on lukittu build-riippuvuus; Windows ja Ubuntu käyttävät paketin
  valmiita natiiveja binäärejä. CI käyttää Node 22:ta. Älä asenna erillistä libvipsiä.
- Leveydet ovat 480, 960 ja 1440 pikseliä, vain alkuperäistä pienempinä.
- WebP quality 78, effort 4; kuvasuhde säilyy ilman rajausta tai suurennusta.
- Alkuperäinen kopioidaan muuttumattomana. Se jää `src`-osoitteeksi, suurimmaksi
  `srcset`-vaihtoehdoksi sekä Open Graphin ja Recipe-JSON-LD:n kuvaksi.
- Todelliset pikselimitat luetaan tiedostosta. Animoitu tai suunnaltaan käännetty
  WebP hylätään, jotta variantit ja alkuperäinen eivät poikkea toisistaan.
- Historialliset `image.srcset`-polut validoidaan edelleen. Käyttöliittymän
  responsiiviset valinnat tuotetaan nykyään automaattisesti pääkuvasta.

## Generointi ja turvallisuus

Omistaja on `site/src/content/published-images.ts`, sama putki joka kopioi
alkuperäiset kuvat. Tuloste on Gitin ohittama `site/public/kuvat/`:

- Alkuperäiset säilyttävät suhteellisen polkunsa.
- `_variants/<hash>-<width>w.webp` sisältää pienennetyt versiot.
- `_variants/manifest.json` sisältää lähteiden ja varianttien SHA-256:t,
  mitat, tavumäärät ja encoder-asetukset.

Nimen hash perustuu lähdekuvan SHA-256:een, koko- ja laatuasetuksiin sekä
Sharpin, libvipsin ja WebP-encoderin versioihin. Lähteen tai asetusten muutos
vaihtaa nimet ja reittidatan sisältöhashit. Sama sisältö jakaa variantit.

Oletuksena käsitellään kaksi lähdettä rinnakkain, yksi natiivi encoder-säie
kerrallaan. Mittausrajapinta sallii 1–4 työntekijää. Kaikki työntekijät odotetaan
loppuun ennen virhetilanteen siivousta. Polut ja realpath tarkistetaan; lähde
ja tuloste eivät saa olla päällekkäin. Ulkopuolisia symlink-kohteita ei lueta.

Build kokoaa uuden kuvatulosteen väliaikaiseen staging-kansioon. Vanha tuloste
vaihdetaan vasta kaiken onnistuttua, ja rename-virheen yhteydessä palautetaan
varmuuskopio. Poistuneet variantit poistuvat tämän vaihdon mukana. Vain tämän
putken omistamia generoituja kansioita siivotaan; alkuperäisiin ei kirjoiteta.

Aiemman tulosteen variantti voidaan käyttää uudelleen, kun nimi, SHA-256,
WebP-muoto ja mitat täsmäävät. Viallinen, puuttuva tai ulos osoittava cache
rakennetaan uudelleen. Erillistä välimuistipalvelua tai Actions-cachea ei tarvita.
Puhtaan CI-työtilan ensimmäinen generointi on aina kylmä.

## Renderöinti

`image-layout.ts` jakaa kortin `sizes`-arvon Reactille ja prerenderin
esilatauksille. Arvo huomioi 1160 pikselin hakemiston, korttien välit ja
sisäreunukset sekä 700/1100 pikselin palstarajat. Hero-kuvan enimmäisleveys
on 820 pikseliä. Päivitä nämä arvot ja selaintesti, jos vastaava CSS muuttuu.

Ensimmäinen kortti on eager/high. Muut ovat lazy; toisen ja kolmannen kortin
esilataukset aktivoituvat vain kahden ja kolmen palstan leveyksillä.
Esilatausten `imagesrcset` ja `imagesizes` vastaavat täsmälleen kuvan arvoja.
Reactin automaattinen ensimmäisen kuvan preload käyttää samoja attribuutteja.

Kuvadata kuuluu edelleen reittikohtaiseen JSONiin ja staattiseen HTML:ään.
Kuvat eivät edellytä JavaScriptiä; client-bundle ei sisällä koko kuvamanifestia.

## Toistettavat mittaukset

Tallenna puhdas lähtöbuild ennen muutoksia `tmp/v15/baseline-dist/`-kansioon.
Älä vertaa paikallista HTTP-mittausta Pages-tuotantoon. Mittauspalvelin korvaa
absoluuttiset tuotanto-URL:t paikallisilla HTML:ssä, JavaScriptissä ja JSONissa,
jotta testi ei vahingossa käytä vanhoja tuotantokuvia.

Lighthouse-työkalut asennetaan erilliseen ohitettuun kansioon:

```powershell
npm install --prefix tmp/perf-tools lighthouse@13.5.0 chrome-launcher@1.2.2
$env:PERF_TOOL_ROOT = 'tmp/perf-tools'
$env:PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH = 'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe'
node site/scripts/measure-images.mjs before
node site/scripts/measure-images.mjs after
```

Skripti ajetaan repon juuressa: viisi reittiä, mobiili ja desktop, kolme ajoa
kustakin. Se käyttää samaa gzip-palvelinta, Bravea ja Lighthouse-simulaatiota.
Tulokset ja täydet LHR:t tallentuvat `tmp/v15/`-kansioon. Hakemistot voi vaihtaa
`PERF_BUILD_ROOT`- ja `PERF_OUTPUT_ROOT`-muuttujilla. Desktop-osan voi jatkaa
komennolla `node site/scripts/measure-images.mjs after desktop resume`.

Selaimen `currentSrc`, DPR ja mitat tallentuvat kuudella leveydellä ja DPR
1/2/3:lla tiedostoon `tmp/v15/browser-after.json` selaintestien yhteydessä.
`IMAGE_TEST_ROOT` ja `IMAGE_TEST_PHASE=before` mahdollistavat saman testin
ajamisen jäädytettyä lähtöbuildia vasten.

Skaalautuvuusmittaus ajetaan `site/`-kansiossa:

```powershell
node --import tsx scripts/scale-images.ts ../tmp/v15/scaling-new
```

Se luo uuden eristetyn kansion, kopioi nykyisen reseptirakenteen 119:n
(ajantasainen lähdemäärä), 250:n ja 500:n lähdereseptin aineistoiksi ja käyttää
neljää kieliversiota lähdettä kohti. Simulaatio tekee lähdetavuista yksilöllisiä
lisäämällä kuvan pikseleihin vaikuttamattoman RIFF-lohkon. Tämä estää deduplikointia
piilottamasta kuvankäsittelyn todellista työmäärää. Jokaisesta koosta mitataan
kylmä ja toistuva kuvaputki rinnakkaisuuksilla 1/2/4 sekä eristetyt täysbuildit.
Tulokset sisältävät ajat, varianttimäärät, tavut ja prosessin huippumuistin.
Simuloitua sisältöä ei lisätä julkaisuun.

Katso [V1.5-mittausraportti](reports/2026-10-22-v1-5-responsive-images.md).
Sharpin ylläpitodokumentit: [asennus](https://sharp.pixelplumbing.com/install/)
ja [WebP-asetukset](https://sharp.pixelplumbing.com/api-output/#webp).

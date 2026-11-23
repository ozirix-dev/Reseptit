# Chat-4 – kahdeksan julkaistun FI-alkuruoan vanhentuneiden tekstien korjaus

Päiväys: 2026-11-22
Työn omistaja: Chat 4
PR-sarja: alkuperäinen julkaisu #805; käännöksiä koskevat #827, #832, #836, #839; turvallisuustestit #844 ja #846.

## Havainto

Kaikkien kahdeksan jo julkaistun suomenkielisen alkuruoan kuvauksissa oli vanha ilmaus `toimituksellinen suomalainen alkuruokaluonnos`. Muistiinpanoissa väitettiin lisäksi, että kuva olisi edelleen vain Chat-4:n Draft-haarassa ja odottaisi julkaisua. Tämä oli ristiriidassa `status: published` -metatiedon kanssa.

## Korjattu

- Kahdeksan FI-reseptin aloitusteksti ei enää kutsu julkaistua reseptiä luonnokseksi.
- Julkaistu FI ja edelleen Draft-tilassa olevat EN/SV/TH-käännökset erotetaan.
- Kuvaa kuvaillaan AI-havainnekuvaksi ja versionhallinnassa olevaksi, ei valmistetun annoksen valokuvaksi.
- Lasimestarin sillin ja nokkoslettujen muistiinpanojen vanhat luonnos-/julkaisua odottavat tekstit korjattiin.
- Jokaisen kahdeksan reseptin hyväksyntätietue `docs/reviews/new-recipes/<id>.json` on päivitetty uudella `source_sha256`-tiivisteellä. Ei luvattua uutta koekeittiötestiä, ravintolaskentaa tai käännösten hyväksyntää.
- `site/tests/chat4-published-fi-editorial-copy.test.ts` estää vanhojen tekstien paluun ja tarkistaa reseptikohtaisen SHA-256:n oikeellisuuden.

## Rajat

Raaka-aineiden määrät, annokset, valmistusajat, ruokaturvallisuus, kuvien binäärit, numeroinen ravintosisältö, GK ja kieliversioiden statukset eivät muutu. Kahdeksan FI-tiedostoa pysyy `published`; 24 EN/SV/TH-tiedostoa pysyvät `draft`. Muutos on julkaistun sisällön toimituksellinen korjaus, ei virallinen käännösten merkityshyväksyntä.

Ennen Readyä tai mergeä tarkistetaan täsmä-HEADin Recipe site- ja Chat owner metadata -CI sekä Repo Guard. Cloudflare-tuotantojulkaisua ei tehdä tässä PR:ssä.

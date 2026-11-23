# Chat-1 — viiden kotiruoan Git-WebP-kuvien erillinen hyväksyntä ja tarkistesidonta

Päivä: 22.11.2026
Tarkastaja: Chat-1 (integraatiovastaava)
Rajaus: **kuvien tekninen ja visuaalinen julkaisuvalmius**, ei reseptien sisällön julkaisu- tai ravintoarvohyväksyntä.

## Miksi erillinen kuvahaara?

PR:t #785–#789 sisältävät jo nelikieliset `status: draft` -reseptit ja Gitissä olevat havainnekuvat. Julkaisuputken `assets/images.manifest.json` on 396 kuvan muuttumaton varmennettu R2-perusarkisto. Gitissä olevat kuvat lisätään tähän erilliseen hyväksyttyyn lisäkerrokseen: `assets/images.tracked-overlays.json`.

Käytössä oleva `site/scripts/verified_image_overlay.py` tarkistaa jokaisen lisäkuvan tarkat tavut, SHA-256:n, RIFF/WebP-otsakkeen ja turvallisen suhteellisen polun ennen kopiointia **jo ennestään varmennettuun** kuvajuureen. Se ei korvaa jo olemassa olevia R2-kuvia eikä muokkaa R2-perusarkistoa. CI:ssä on testit ja overlay-käsittely erillisinä vaiheina.

## Validoidut alkuperäiset binääriblobit

Alla olevat kuvat haettiin **suoraan nimettyjen PR-HEADien GitHub-blobien base64-sisällöstä**. Tavumäärä, RIFF-koko ja SHA-256 laskettiin binäärisisällöstä. SHA-256-laskentamenetelmä tarkastettiin vertaamalla jo hyväksyttyä `alkuruoat/lasimestarin-silli.webp`-tietuetta (`b49542a0047d7077852647f497ec0a1704d8da3fb663b5a1c8c564abf9745b2f`) ja samaa GitHub-tiedostoa — **tarkka osuma**.

| PR | Kuvapolku `kuvat/`-juuresta | Git-blob SHA | Tavua | SHA-256 |
|---|---|---|---:|---|
| #785 | `paaruoat/kinkkukiusaus.webp` | `1cd01dd484f3273aa04ff9197d05b29084a4145e` | 49412 | `da4eea7e47ec7420dff39c875dad437993b37324cb3a17eff8354c80be46987c` |
| #786 | `paaruoat/liha-perunasoselaatikko.webp` | `93094fcc965bf5c044fb6d01ad86d426acb96b40` | 41986 | `a7c032c3b09e76bac94a3fb467a1e1b29d1da9dce469061a9e4a0971b8322923` |
| #787 | `paaruoat/kesakeitto.webp` | `988d4ffbc03ca8ea7dcc5ac2064d3e59c009a02a` | 60966 | `01646e3be04d5582b26d239070062f5b28f67c2214537126112e38fa66c70516` |
| #788 | `paaruoat/suppilovahverokeitto.webp` | `d008d8652805edfd4d8f43ec31ca0d9d4afdde49` | 36496 | `8d89519dbce153b64ef50ca00f0653e0f6374ff590b80f60da60d6e50587ebdd` |
| #789 | `paaruoat/silakkalaatikko.webp` | `28fdc3582853b91b7be776d6e00451e724aa5d98` | 58684 | `b88604d3a1c15f87cf04007157f4672d3229150ebea39e3d96250c4ce7ae63e7` |

## Visuaalinen tarkistus — vain havainnekuviksi

- **#785 Kinkkukiusaus:** uunivuoka, selvästi erottuvia perunasuikaleita ja vaaleanpunaista kinkkua; vastaa ruokalajin luonnetta.
- **#786 Liha-perunasoselaatikko:** perunasoseella peitetty ja annospalasta paljastuva kypsän jauhelihan kerros; sopii reseptin kerrostettuun versioon.
- **#787 Kesäkeitto:** uudet perunat, porkkana, kukkakaali, herneet sekä tilli, vaalea liemi; vastaa 11-rivisen reseptin pääsisältöä.
- **#788 Suppilovahverokeitto:** sileä kermainen keitto, pinnalla paistetun näköisiä sieniä ja yrttejä. Kuvasta **ei voi todistaa sienen lajia**; kuvateksti ei ole lajintunnistusohje.
- **#789 Silakkalaatikko:** kerrostettu peruna- ja kalalaatikko, munamaidon näköinen pohja, pekonia ja tilliä; vastaa ruokalajin yleispiirteitä. Kuvasta **ei voi todistaa kalan alkuperää eikä lämpötilaa**.

Kuvat ovat AI:lla tuotettuja **havainnekuvia**, eivät todellisen reseptin dokumentoituja valmistuskuvia. Visuaalinen hyväksyntä koskee vain tätä käyttötarkoitusta, ei reseptin ruokaturvaa, tekijänoikeutta tiettyyn ulkoiseen valokuvaan tai ravintolaskentaa. Kuvissa ei havaittu näkyviä logoja, vesileimoja tai selvästi väärää ruokalajia. Kuvien tiedostojen muuttuminen mitätöi SHA-256-sidonnan.

## Tekninen ja toimituksellinen portti

1. Kun tämän erillisen PR:n CI validoi Git-overlayt, kuvat ovat käytettävissä **repon julkaisuputken varmennetussa kuvalähteessä**. `approved: true` koskee tässä vain kyseisten viiden kuvan visuaalista ja tavutason hyväksyntää.
2. Tämä **ei** muuta `docs/reviews/new-recipes/<id>.json` -tietueiden `decision: hold` -tilaa, FI/EN/SV/TH-reseptien `status: draft` -kenttiä, ravintolaskentaa, GK-merkintöjä eikä mitään reseptisisältöä.
3. Yhteinen Draft-kuvavalidoinnin korjaus PR #851 on edellytetty mainissa. Resepteille tarvitaan yhä riippumaton kokkikelpoisuus-/tuotekatselmointi, merkityskäännösten lopullinen sidonta ja uuden julkaisu-HEADin CI.
4. **Ei Cloudflare/Wrangler-julkaisua eikä kuvien julkista reseptisivua** tämän kuva-PR:n perusteella.

Lisätiedot viiden reseptin sisällöllisistä HOLD-ehtoista: `docs/reviews/2026-11-22-chat1-five-homefood-integration.md`.

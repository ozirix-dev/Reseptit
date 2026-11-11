# Karnivore FI3 – erillinen tuotantoreseptien julkaisupäätös (11.11.2026)

Kolme ensimmäistä FI-reseptiä lisätään `reseptit/paaruoat/`-kansioon, kuvatiedostot `kuvat/paaruoat/` ja ravintoarvojen auditoitavat syötteet `docs/nutrition/calculations/`. Seitsemän eristettyä lähdeluonnosta jää `tuonti/karnivore/`-jonoon.

## Laskentaperiaate
Käytetään täsmällisiä raakagrammoja ja valmistajan/Finelin koostumusta. Kaikki pannuun lisätty voi ja lihasta/kalasta irtoava rasva jaetaan annoksille: tämä on **reseptin tarjoiluehto, ei mitattu saanto**. Ruoan mukana syömätön rasva muuttaa todellista makrolaskelmaa; resepteissä ilmoitetaan epävarmuus. Eurooppalaisen pakkauksen hiilihydraattinolla voi olla pyöristetty.

Lähteet: HK Naudan entrecôte 1824, Kalaneuvos Atlantin lohifilee (nahallinen D), Snellman Kunnon naudan jauheliha 20 % EAN 6409620011856, THL Fineli Release 20 (kananmuna 858, voi 500, suola 30), AFCD Release 3:n samaa raakaruokalajia koskevat kuitu/polyoli-tietueet. Kaikki lähde-ID:t, raakagrammat ja 1,0-retentio-oletukset toistettavassa reseptikohtaisessa JSON:ssa. Makrojen hyväksyntä riippuu edelleen `nutrition-evidence` -auditoinnista.

## FI-julkaisun kolme rajattua kohdetta

- `karnivore-steak-and-eggs` — 640 × 427 WebP, P 50 g, R 39.89 g, imeytyvä HH 0.41 g, GK tuntematon. Lähdeblob `5e579c3a60b1835d2bd4895c377502139bb23b91`.
- `karnivore-voilohi-pannulla` — 640 × 427 WebP, P 37.62 g, R 41.23 g, imeytyvä HH 0.14 g, GK tuntematon. Lähdeblob `07f5b5670af65776209493cc4dce2b897f2635b0`.
- `karnivore-jauhelihakulho-munalla` — 640 × 427 WebP, P 42.95 g, R 45.08 g, imeytyvä HH 0.17 g, GK tuntematon. Lähdeblob `9f294f216ac4f94dacf745e197b3d6bd3cc96451`.

Kuvat ovat omia tekoälypohjaisia havainnekuvia. Kokin reseptissä ei ole kasvikoristeita eikä kasviöljyä. Kuvat ovat ensijulkaisun pienemmät lähdeversiot; niistä ei väitetä 1280 px laatua. Kaikki `image.width/height` ilmoitetaan todellisin 640 × 427 -arvoin.

## Laatu ja julkaisu
- Valmistelutyöjono #448 on jo integroitu mainiin turvallisesti.
- Ensimmäisten kolmen FI-sisältö julkaistaan vasta tämän erillisen PR:n CI-PASSin ja lähteistetyn ravintolaskennan hyväksynnän jälkeen.
- Ruokavaliosuodattimen `carnivore`-tunniste sidotaan lopulliseen FI-blob-SHA:han, ei tekstin sanaan carnivore.
- Keto-, gluteeniton- ja GK=0-tunnisteita ei anneta ilman omaa tarkistusta.
- Käyttöliittymän muut kieliversiot pysyvät omana käännöseränään.
- Julkaisun jälkeen tarkista kolme sivureittiä ja että haku näyttää vain hyväksytyt karnivore-reseptit.

Tämä dokumentti ei ole toteutuneen koepaiston eikä laboratorioanalyysin väite.

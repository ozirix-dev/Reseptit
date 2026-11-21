# Chat-4 – rajattu FI-julkaisuehdokas PR #805

Päiväys: 2026-11-21
Työn omistaja: Chat 4
Lähtö-HEAD: `407c49e23ae6b5501a1e99590fd8dcc734038f89`
Uudelleentarkistuksen alussa todettu main: `3ad9714ae0e47c9390fa3ef896e7c7b1cdd3c200`

## Sisältötila

**Kahdeksan FI-julkaisuehdokasta, hyväksyntätietueet (SHA-256) valmiina:**

1. `suolasienisalaatti-sipulilla`
2. `lasimestarin-silli`
3. `uunissa-paistetut-silakkarullat`
4. `savupororullat-kantarelleilla`
5. `pienet-kantarellipiiraat`
6. `punajuuricarpaccio-vuohenjuustolla`
7. `sillikaviaari-ruisnapeilla`
8. `nokkosletut-puolukoilla`

Kahdella reseptillä `status: draft`: `graavisiika-tillilla` ja `muikunmati-rieskarullat`. Kaikilla 30 EN/SV/TH-käännöksellä `status: draft`, koska virallinen käännösrekisterin julkaisuportti on erillinen.

Kahdeksan FI-julkaisun erilliset katselmointitietueet ovat `docs/reviews/new-recipes/<id>.json`. Mittasuhteet ovat Recipavon toimituksellinen sovitus, ja fyysistä koekeittiötestiä ei väitetä tehdyksi. `docs/nutrition/reviews/chat4-eight-starters-nutrition-withheld-2026-11-21.md` dokumentoi, miksi numeerisia ravintoarvoja tai GK:ta ei ole julkaistu. Tämä on tiedon pidättäminen, ei numeroinen ravintolaskenta.

## SHA-pinnattu CI

- Edellinen CI [Recipe site #44943550201](https://github.com/ozirix-dev/Reseptit/actions/runs/44943550201) raportoi ennen tätä raporttia yksikkötestin odotusarvovirheen: testissä vanhastaan odotettiin 10/10 FI-Draftia, vaikka nyt 8/10 on julkaistavaksi hyväksytty; korjattu commitissa `407c49e23ae6b5501a1e99590fd8dcc734038f89`.
- Sen jälkeen samalla commitilla aloitettu CI [Recipe site #44943851303](https://github.com/ozirix-dev/Reseptit/actions/runs/44943851303) pysähtyi `Verify the tested revision` -vaiheessa, kun `main`-haara ehti muuttua PR:n synteettisen testimergen muodostamisen jälkeen. SHA-suojausta ei saa ohittaa.
- Tämä dokumenttimuutos synkronoi Chat-4:n PR-HEADin ja käynnistää uuden CI:n tuoretta mainia vasten. **CI:tä ei väitetä PASSiksi ennen tulosta**.

## Julkaisuportti

Älä markkinoi `draft`-tiedostoja julkaistuina. Varmista uuden täsmä-HEADin kaikki pakolliset CI:t ja käytä Repo Guardin SHA-pinnattuja Ready/merge-toimia vasta niiden jälkeen. Cloudflare-tuotantodeploy jätetään eri omistajan tehtäväksi.

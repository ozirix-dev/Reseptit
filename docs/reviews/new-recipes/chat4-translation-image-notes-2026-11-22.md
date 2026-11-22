# Chat-4 – kahdeksan alkuruoan 24 käännösluonnoksen kuvahuomautusten siivous

Päiväys: 2026-11-22
Työn omistaja: Chat 4

## Havainto

PR #850 päivitti kahdeksan julkaistun FI-alkuruoan julkiset tekstit oikeaan julkaisu- ja kuvamuotoon. Samojen reseptien EN/SV/TH-käännösluonnosten toimitukselliset muistiinpanot väittivät edelleen, että 720 × 720 WebP-kuvat ovat vasta Git Draft -haarassa.

## Rajattu korjaus

- Kaikkien kahdeksan FI-identiteetin 24 EN/SV/TH-käännösluonnoksen kuvahuomautukset päivitetty: kuvatiedosto on Git-versionhallinnassa, SHA-256 on kuvamanifestissa ja kyse on AI-havainnekuvasta, ei valmistetun annoksen valokuvasta.
- Käännösten `status: draft`, `translation_of`, alkuperäinen FI-resepti ja kuvan `src` säilyvät.
- Käännösten määrät, ainesosat, ohjeet, turvallisuusvaroitukset, ravintoarvot, GK ja kuvatiedostot säilyvät muuttumattomina.
- Lisätty `site/tests/chat4-translation-image-notes.test.ts`, joka varmistaa kaikkien 24 kohteen Draft-tilan, päivitetyt kielikohtaiset kuvahuomautukset ja vanhan Draft-haaraväitteen puuttumisen.
- Virallista Codex-merkityskatselmointia tai ihmishyväksyntää ei väitetä suoritetuksi. Julkaisuun tarvittava SHA-sidottu hyväksyntä on erillinen vaihe.

PR luovutetaan Chat-1:lle yhdistämistä varten vasta sen jälkeen, kun täsmä-HEADin CI on läpäisty. Chat-4 ei tee mergeä eikä Cloudflare-julkaisua.

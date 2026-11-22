# Chat-4 – Taateliketsupin kolmen käännöksen merkitysvertailun luovutus

Päiväys: 2026-11-23. Työn omistaja: Chat 4. Issue #896.
Lähtö-main: `75c1d1ef70303adfd25be328eabafed104cacc3f` (PR #895 yhdistetty).
Tämä asiakirja on katselmointitodisteiden kokoava **luovutusraportti**, ei Chat-4:n itselleen myöntämä riippumaton semanttinen hyväksyntä.

## Lukitut lähde- ja kohdeversiot

- FI: `reseptit/alkuruoat/taateliketsuppi.md`, Git-blob `a5c9ffebc59952e33fdb0bbc1c5dde1fbb9a2475`, semantic `05cbc349098885e4649047820c1249c7da43163a353461df17bba3240da1e363`.
- EN: `kaannokset/en/alkuruoat/taateliketsuppi.md`, Git-blob `56f8d03f40bffbc93ab43b56f45b1f7e85cc14b0`, semantic `be7fcccb7863efe799dd6f11e885b5c33f5359a214f3b570050268f1cd8f7a2f`.
- SV: `kaannokset/sv/alkuruoat/taateliketsuppi.md`, Git-blob `8525afb55a24c1867238b7ae1b89158e06f0cf8e`, semantic `f55d6154bc4a41e244989e77aee4ae103e48231b6d381fd77eddfa19e87c484d`.
- TH: `kaannokset/th/alkuruoat/taateliketsuppi.md`, Git-blob `16f1fa542e47299045807ad82ea8514a038361e7`, semantic `65aaa989f8530865c1383a4da0b48d961d12d90ea2467e167b3c297ce263d785`.

## Katselmointien alkuperä ja päätökset

- **FI→EN: PASS** ja **FI→SV: PASS**. Kokki-Codexin erillinen koko merkitysparin vertailu, versiot ja findings: [Issue #896, kommentti #7087665770](https://github.com/ozirix-dev/Reseptit/issues/896#issuecomment-7087665770). Raportissa ei avoimia P0/P1/P2-löydöksiä. Alkuperäiset valkosipulinkynnen `nail`/`spik`-virheet sekä liotus-/ohennusveden epäselvyydet korjattu.
- **FI→TH: raportoitu PASS**. Käyttäjän toimittama Kokki-Codexin versionkohtainen raportti tunnisteella `RESEPTIT-PR-PURKU-221126 / CHAT-4 02 / ISSUE #896` on kirjattu [Issue #896, kommenttiin #7086714743](https://github.com/ozirix-dev/Reseptit/issues/896#issuecomment-7086714743). Ei raportoitu avoimia P0/P1-löydöksiä. P2-huomiot: `1 กลีบ` toistuu aineksen nimessä ja huomautuksessa, ja `รอก` on kömpelö Reel-vastine. Alkuperäinen neilikka-/kynsi-sekaannus sekä liotusveden käyttötarkoitus korjattu.

Kaikissa kolmessa: 140 g tomaattipyreetä, 45 g taateleita, 15 g etikkaa, 3 g valkosipulinkynsi, 1 g suolaa, 30 g tarvittaessa käytettävää erillistä ohennusvettä; 8 annosta, 25 min, taatelien noin 15 min kuumavesiliotus ja liotusveden poisheitto, sauvasekoitus, puhdas kannellinen astia, jääkaappisäilytys ja käyttö kolmen päivän kuluessa. Videon grammojen sovitus ja AI-kuvan merkintä säilyvät.

## Toteutus- ja julkaisuportit

Kolmen aiemmin julkaistun käännöksen muuttaminen edellyttää uusille semanttisille tiivisteille ajantasaisia `meta/kaannokset/codex-review-evidence.json`-tietueita. Muuta vain `taateliketsuppi:{en,sv,th}` nykyisessä mainin rekisterissä; säilytä aiemmin yhdistetyn #895:n `gazpacho:th` ja kaikki muut tietueet.

Chat-4:n olemassa olevat rajatut regressiotestit: `site/tests/chat4-date-ketchup-en-sv-parity.test.ts` ja `site/tests/chat4-date-ketchup-th-meaning.test.ts`. Vanhojen, keskeneräisyyden dokumentoivien katselmointimuistioiden sisältö säilytetään historiana. Nykyinen asiakirja täydentää niitä lopullisilla versionkohtaisilla lähteillä.

**Tila:** käännösten dokumentoidut merkitystarkistukset PASS; tuotanto-/merge-päätös tehdään vasta tämän PR:n uuden HEADin molempien pakollisten CI-ajojen, main-CI:n ja Repo Guardin jälkeen. PR pysyy ensin Draftina. 

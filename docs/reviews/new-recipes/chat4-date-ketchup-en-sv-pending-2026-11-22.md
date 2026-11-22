# Chat-4 – Taateliketsupin EN/SV-merkityskorjaukset, ei vielä julkaisuvalmis

Päiväys: 22.11.2026. Työn omistaja: Chat 4. Issue #896. Lähtö-main `00aecaf0a3e3d65eb4a5741252f9072f628c86f3`.

## Varsinaiset merkityskorjaukset

FI-lähteen 3 g valkosipulinkynttä, noin yksi kynsi, oli EN:ssä `about one nail` ja SV:ssä `ungefär en spik`. Nämä korjattiin `about 1 clove` ja `ungefär 1 klyfta`.

FI:n erillinen taatelien liotusvesi poistetaan ensimmäisessä vaiheessa, ja 30 g vettä on vain kastikkeen tarvittaessa tapahtuvaan ohentamiseen. Molempien kielten veden ainesosahuomautus täsmennettiin erottamaan käyttötarkoitukset.

Muut EN/SV-tekstin kielikorjaukset perustuvat Kokki-Codexin esittämään rajattuun korjausehdotukseen: EN:n kuvaus ja AI-kuvahuomautus, SV:n liotus- ja soseutuslauseet sekä AI-kuvahuomautus. Määrät, valmistusjärjestys, säilytys ja kuvamanifesti pysyvät ennallaan.

## Tarkat sisältötunnisteet

- FI Git-blob: `a5c9ffebc59952e33fdb0bbc1c5dde1fbb9a2475`
- EN korjatun tiedoston Git-blob: `56f8d03f40bffbc93ab43b56f45b1f7e85cc14b0`
- SV korjatun tiedoston Git-blob: `8525afb55a24c1867238b7ae1b89158e06f0cf8e`

Kokki-Codexin 22.11.2026 toimittamissa *korjausehdotuksen tarkistustiedoissa* oli semanticHash-arvot:
- FI `05cbc349098885e4649047820c1249c7da43163a353461df17bba3240da1e363`
- EN `be7fcccb7863efe799dd6f11e885b5c33f5359a214f3b570050268f1cd8f7a2f`
- SV `f55d6154bc4a41e244989e77aee4ae103e48231b6d381fd77eddfa19e87c484d`

Git-blobit täsmäävät edellä annetun patch-ehdotuksen tuottamiin täsmätiedostoihin. Raportoitu rakenteellinen `auditTranslations` PASS **ei ole sama asia kuin käännöspolitiikan pakollinen Codex FI→EN- ja FI→SV-merkityskatselmointi**.

## Julkaisuportti

EN/SV ovat jo `status: published`, joten muutokset vanhentavat niiden nykyisen versionkohtaisen hyväksynnän. Erilliset koko FI→EN- ja FI→SV-parien todelliset semanttiset Codex-katselmoinnit on suoritettava ennen `meta/kaannokset/codex-review-evidence.json`-tietueiden muuttamista. Älä väitä pelkkää automaattista auditointia muodolliseksi hyväksynnäksi.

PR #895:n `gazpacho:th`-rekisterimuutos on edelleen integroitavana. Tämän työn EN/SV-rekisteriä ei muuteta ennen yhteisen tiedoston omistajuus-/integraatiojärjestyksen ratkeamista. Issue #896:n erillinen TH-korjaus on toisessa Chat-4:n haarassa eikä sitä muuteta. Ei Ready-, merge- eikä tuotantodeploy-valtuuksia.

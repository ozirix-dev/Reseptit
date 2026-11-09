# Rinnakkainen käännöserä B — 9.11.2026

**PR #356**: tämä keskustelu. **PR #357**: ensimmäinen keskustelu. Kumpikin omistaa vain omat reseptinsä. #357:n nimettyjä 20 reseptiä ei käsitellä tässä erässä. Aiemmat kuusi päällekkäistä bulgogi- ja kimchi-jjigae-luonnosta on poistettu #356:sta; ne kuuluvat #357:ään.

## Erän 20 FI-kohdetta (60 kieliversiota, 15 tarkistettua luonnosta (9 GK-HOLD))

| Suomenkielinen lähde | EN | SV | TH |
|---|---|---|---|
| `reseptit/paaruoat/kana-yakitori-kaalilla.md` | odottaa | odottaa | odottaa |
| `reseptit/paaruoat/pho-bo.md` | odottaa | odottaa | odottaa |
| `reseptit/paaruoat/rendang-padang.md` | luonnos / QA | luonnos / QA | luonnos / QA |
| `reseptit/paaruoat/sate-ayam.md` | luonnos / QA | luonnos / QA | luonnos / QA |
| `reseptit/aamupalat/meksikolainen-huevos-a-la-mexicana.md` | QA tehty / GK HOLD | QA tehty / GK HOLD | QA tehty / GK HOLD |
| `reseptit/aamupalat/karibia-callaloo-munakas.md` | QA tehty / GK HOLD | QA tehty / GK HOLD | QA tehty / GK HOLD |
| `reseptit/aamupalat/meksikolainen-quesadilla-sienilla.md` | odottaa | odottaa | odottaa |
| `reseptit/aamupalat/pohjoisafrikkalainen-harissa-shakshuka.md` | odottaa | odottaa | odottaa |
| `reseptit/aamupalat/thai-riisinuudelikeitto-aamuksi.md` | odottaa | odottaa | odottaa |
| `reseptit/aamupalat/valimerellinen-tortilla-espanola-aamupalaksi.md` | odottaa | odottaa | odottaa |
| `reseptit/aamupalat/indonesialainen-bubur-ayam-kanariisipuuro.md` | odottaa | odottaa | odottaa |
| `reseptit/aamupalat/vietnamilainen-chao-ga-kanapuuro.md` | odottaa | odottaa | odottaa |
| `reseptit/aamupalat/thai-kai-jiao-yrteilla.md` | odottaa | odottaa | odottaa |
| `reseptit/aamupalat/meksikolainen-kurpitsapuuro-piloncillolla.md` | odottaa | odottaa | odottaa |
| `reseptit/aamupalat/kiinalainen-musta-seesamipuuro.md` | odottaa | odottaa | odottaa |
| `reseptit/aamupalat/thai-kookosriisi-mangolla.md` | odottaa | odottaa | odottaa |
| `reseptit/aamupalat/pohjoisafrikkalainen-lablabi.md` | odottaa | odottaa | odottaa |
| `reseptit/aamupalat/munakasmuffinit.md` | odottaa | odottaa | odottaa |
| `reseptit/aamupalat/tonnikalamunakkaat-uunissa.md` | odottaa | odottaa | odottaa |
| `reseptit/aamupalat/valimerellinen-farinata-aamupalaksi.md` | QA tehty / GK HOLD | QA tehty / GK HOLD | QA tehty / GK HOLD |

## Laatu ja julkaisu

- Julkaistu FI-lähde, ei pelkkiä otsikko- tai draft-tiedostoja. Jos FI-sisältö on ristiriitainen, resepti jää HOLDiin.
- Varmista ainesosarivi riviltä, määrät, yksiköt, aikamääreet, lämpötilat, kypsyys, eläin-/kasvilaji, allergeenit, kieltomuodot, lisukkeet ja huomautukset; TH-kieli takaisin suomeksi.
- Säilytä lähteen ravintoarvot ja GK-puuttuvuudet täsmälleen. Älä muuta FI-lähteen reseptisisältöä käännöstyön yhteydessä.
- Kirjaa todella tarkistettujen semanttisten FI/EN/SV/TH-parien SHA-256-tiivisteet ja havainnot `meta/kaannokset/codex-review-evidence.json`-rekisteriin. Ei ihmiskatselmointiväitettä.
- Lisää FI-tiedostoon kielistatukset vasta kun käännös ja vertailut on hyväksytty.
- Aja `docs/translation-review-policy.md`-mukaiset validoinnit ja tarkista nykyisen HEADin CI. P0/P1 tai epäonnistuva CI estää Ready/mergen. Ei auto-mergeä.
- Tarkista PR #357:n tiedostot ja molempien HEAD ennen uusia muokkauksia; päällekkäisyys pysäyttää kirjoituksen.

## Tilanne

Työnjono on rajattu erilleen #357:stä. Kolme reseptiä / yhdeksän kieliversiota on tehty ja verrattu FI-lähteeseen. Kaikki kolme reseptiä / 9 kieliversiota säilyvät draftina eikä FI-lähteiden kielimetatietoja julkaista tässä haarassa: Huevos ja Callaloo rikkoivat GK80-release-2:n raakatekstin SHA-sidonnan (CI 42644592927: STALE_INPUT), ja farinatan kielimetatiedon lisäys rikkoi erillisen GK100-owner-approved-eighteen-julkaisusinetin (CI 42645835154: GK100_RELEASE_CANDIDATE_CHANGED). Hyväksyttyjä GK80- tai GK100-tarkisteita ei avata kielistatusten vuoksi; julkaisua varten tarvitaan erikseen katselmoitu, testattu tuki metatietojen turvalliselle käsittelylle. Lisäksi kahden pääruoan (rendang ja sate ayam) kuusi kieliluonnosta ovat lisättyinä; niiden tarkat määrät, annokset, ainesosarivien lukumäärä, makrot ja vaiheiden lukumäärä vastaavat FI-lähteitä. Loput 15 reseptiä / 45 kieliversiota odottavat. PR on Draft eikä tätä sisältöä ole yhdistetty tuotantoon. Aiempi #356:n CI kaatui käännösten metatiedon/vertailun tarkistuksessa; viimeistelemättömiä käännöksiä ei julkaistu.

## Toinen osanäyttö (9.11.2026)

- `rendang-padang` (EN/SV/TH): 12 ainesosariviä, 5 valmistusvaihetta, 6 annosta; 3–4 tunnin haudutus, kookosmaidon haihduttaminen ja ettei vettä lisätä kuivan rendangin loppuvaiheessa, ovat kaikissa kielissä. Makrot säilyvät. Tila: draft, ei FI-metadataa.
- `sate-ayam` (EN/SV/TH): 12 ainesosariviä, 5 valmistusvaihetta, 4 annosta; 30 minuutin kylmämarinointi, kanan kypsentäminen kauttaaltaan, maapähkinäallergian tarkistus ja kastikkeen erilliset soija/sokerimäärät säilyvät. Kuva-altissa mainitut kurkku ja punasipuli eivät kuulu ainesosalistaan, kuten FI-lähteessä. Makrot säilyvät. Tila: draft, ei FI-metadataa.
- Näiden kuuden luonnoksen tarkat semanttiset SHA-tarkisteet ja julkaisuportit viimeistellään ennen `published`-muutosta. Hyväksyttyjä GI/GK-sidoksia ei muuteta.

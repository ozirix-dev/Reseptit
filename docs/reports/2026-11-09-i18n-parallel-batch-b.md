# Rinnakkainen käännöserä B — 9.11.2026

**PR #356**: tämä keskustelu. **PR #357**: ensimmäinen keskustelu. Kumpikin omistaa vain omat reseptinsä. #357:n nimettyjä 20 reseptiä ei käsitellä tässä erässä. Aiemmat kuusi päällekkäistä bulgogi- ja kimchi-jjigae-luonnosta on poistettu #356:sta; ne kuuluvat #357:ään.

## Erän 20 FI-kohdetta (60 kieliversiota, 3 PR-ehdokkaana ja 6 GK-HOLD-luonnosta)

| Suomenkielinen lähde | EN | SV | TH |
|---|---|---|---|
| `reseptit/paaruoat/kana-yakitori-kaalilla.md` | odottaa | odottaa | odottaa |
| `reseptit/paaruoat/pho-bo.md` | odottaa | odottaa | odottaa |
| `reseptit/paaruoat/rendang-padang.md` | odottaa | odottaa | odottaa |
| `reseptit/paaruoat/sate-ayam.md` | odottaa | odottaa | odottaa |
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
| `reseptit/aamupalat/valimerellinen-farinata-aamupalaksi.md` | PR-ehdokas | PR-ehdokas | PR-ehdokas |

## Laatu ja julkaisu

- Julkaistu FI-lähde, ei pelkkiä otsikko- tai draft-tiedostoja. Jos FI-sisältö on ristiriitainen, resepti jää HOLDiin.
- Varmista ainesosarivi riviltä, määrät, yksiköt, aikamääreet, lämpötilat, kypsyys, eläin-/kasvilaji, allergeenit, kieltomuodot, lisukkeet ja huomautukset; TH-kieli takaisin suomeksi.
- Säilytä lähteen ravintoarvot ja GK-puuttuvuudet täsmälleen. Älä muuta FI-lähteen reseptisisältöä käännöstyön yhteydessä.
- Kirjaa todella tarkistettujen semanttisten FI/EN/SV/TH-parien SHA-256-tiivisteet ja havainnot `meta/kaannokset/codex-review-evidence.json`-rekisteriin. Ei ihmiskatselmointiväitettä.
- Lisää FI-tiedostoon kielistatukset vasta kun käännös ja vertailut on hyväksytty.
- Aja `docs/translation-review-policy.md`-mukaiset validoinnit ja tarkista nykyisen HEADin CI. P0/P1 tai epäonnistuva CI estää Ready/mergen. Ei auto-mergeä.
- Tarkista PR #357:n tiedostot ja molempien HEAD ennen uusia muokkauksia; päällekkäisyys pysäyttää kirjoituksen.

## Tilanne

Työnjono on rajattu erilleen #357:stä. Kolme reseptiä / yhdeksän kieliversiota on tehty ja verrattu FI-lähteeseen. Yksi resepti / 3 versiota (farinata) on julkaisu-PR:n ehdokkaana. Kaksi reseptiä / 6 versiota (Huevos ja Callaloo) on säilytetty draftina, koska FI-lähteen käännösmetatieto muuttaa alkuperäisen reseptitiedoston SHA-256-tiivistettä ja rikkoo GK80-release-2:n varmennetun lähdesidoksen (CI 42644592927: STALE_INPUT). Pakettien hyväksyttyjä sidoksia ei kirjoiteta uudelleen kevyen kielistatusmuutoksen vuoksi. Loput 17 reseptiä / 51 kieliversiota odottavat. PR on Draft eikä tätä sisältöä ole yhdistetty tuotantoon. Aiempi #356:n CI kaatui käännösten metatiedon/vertailun tarkistuksessa; viimeistelemättömiä käännöksiä ei julkaistu.

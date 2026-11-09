# Rinnakkainen käännöserä B — 9.11.2026

**PR #356**: tämä keskustelu. **PR #357**: ensimmäinen keskustelu. Kumpikin omistaa vain omat reseptinsä. #357:n nimettyjä 20 reseptiä ei käsitellä tässä erässä. Aiemmat kuusi päällekkäistä bulgogi- ja kimchi-jjigae-luonnosta on poistettu #356:sta; ne kuuluvat #357:ään.

## Erän 20 FI-kohdetta (60 kieliversiota, 30 luonnosta (9 GK-HOLD; 15 QA odottaa))

| Suomenkielinen lähde | EN | SV | TH |
|---|---|---|---|
| `reseptit/paaruoat/kana-yakitori-kaalilla.md` | odottaa | odottaa | odottaa |
| `reseptit/paaruoat/pho-bo.md` | odottaa | odottaa | odottaa |
| `reseptit/paaruoat/rendang-padang.md` | luonnos / QA | luonnos / QA | luonnos / QA |
| `reseptit/paaruoat/sate-ayam.md` | luonnos / QA | luonnos / QA | luonnos / QA |
| `reseptit/aamupalat/meksikolainen-huevos-a-la-mexicana.md` | QA tehty / GK HOLD | QA tehty / GK HOLD | QA tehty / GK HOLD |
| `reseptit/aamupalat/karibia-callaloo-munakas.md` | QA tehty / GK HOLD | QA tehty / GK HOLD | QA tehty / GK HOLD |
| `reseptit/aamupalat/meksikolainen-quesadilla-sienilla.md` | luonnos / QA odottaa | luonnos / QA odottaa | luonnos / QA odottaa |
| `reseptit/aamupalat/pohjoisafrikkalainen-harissa-shakshuka.md` | odottaa | odottaa | odottaa |
| `reseptit/aamupalat/thai-riisinuudelikeitto-aamuksi.md` | odottaa | odottaa | odottaa |
| `reseptit/aamupalat/valimerellinen-tortilla-espanola-aamupalaksi.md` | luonnos / QA odottaa | luonnos / QA odottaa | luonnos / QA odottaa |
| `reseptit/aamupalat/indonesialainen-bubur-ayam-kanariisipuuro.md` | luonnos / QA odottaa | luonnos / QA odottaa | luonnos / QA odottaa |
| `reseptit/aamupalat/vietnamilainen-chao-ga-kanapuuro.md` | odottaa | odottaa | odottaa |
| `reseptit/aamupalat/thai-kai-jiao-yrteilla.md` | luonnos / QA odottaa | luonnos / QA odottaa | luonnos / QA odottaa |
| `reseptit/aamupalat/meksikolainen-kurpitsapuuro-piloncillolla.md` | odottaa | odottaa | odottaa |
| `reseptit/aamupalat/kiinalainen-musta-seesamipuuro.md` | odottaa | odottaa | odottaa |
| `reseptit/aamupalat/thai-kookosriisi-mangolla.md` | luonnos / QA odottaa | luonnos / QA odottaa | luonnos / QA odottaa |
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

Työnjono on rajattu erilleen #357:stä. Kolme reseptiä / yhdeksän kieliversiota on tehty ja verrattu FI-lähteeseen. Kaikki kolme reseptiä / 9 kieliversiota säilyvät draftina eikä FI-lähteiden kielimetatietoja julkaista tässä haarassa: Huevos ja Callaloo rikkoivat GK80-release-2:n raakatekstin SHA-sidonnan (CI 42644592927: STALE_INPUT), ja farinatan kielimetatiedon lisäys rikkoi erillisen GK100-owner-approved-eighteen-julkaisusinetin (CI 42645835154: GK100_RELEASE_CANDIDATE_CHANGED). Hyväksyttyjä GK80- tai GK100-tarkisteita ei avata kielistatusten vuoksi; julkaisua varten tarvitaan erikseen katselmoitu, testattu tuki metatietojen turvalliselle käsittelylle. Lisäksi kahden pääruoan (rendang ja sate ayam) kuusi kieliluonnosta ovat lisättyinä; niiden tarkat määrät, annokset, ainesosarivien lukumäärä, makrot ja vaiheiden lukumäärä vastaavat FI-lähteitä. Loput 10 reseptiä / 30 kieliversiota odottavat. PR on Draft eikä tätä sisältöä ole yhdistetty tuotantoon. Aiempi #356:n CI kaatui käännösten metatiedon/vertailun tarkistuksessa; viimeistelemättömiä käännöksiä ei julkaistu.

## Toinen osanäyttö (9.11.2026)

- `rendang-padang` (EN/SV/TH): 12 ainesosariviä, 5 valmistusvaihetta, 6 annosta; 3–4 tunnin haudutus, kookosmaidon haihduttaminen ja ettei vettä lisätä kuivan rendangin loppuvaiheessa, ovat kaikissa kielissä. Makrot säilyvät. Tila: draft, ei FI-metadataa.
- `sate-ayam` (EN/SV/TH): 12 ainesosariviä, 5 valmistusvaihetta, 4 annosta; 30 minuutin kylmämarinointi, kanan kypsentäminen kauttaaltaan, maapähkinäallergian tarkistus ja kastikkeen erilliset soija/sokerimäärät säilyvät. Kuva-altissa mainitut kurkku ja punasipuli eivät kuulu ainesosalistaan, kuten FI-lähteessä. Makrot säilyvät. Tila: draft, ei FI-metadataa.
- Näiden kuuden luonnoksen tarkat semanttiset SHA-tarkisteet ja julkaisuportit viimeistellään ennen `published`-muutosta. Hyväksyttyjä GI/GK-sidoksia ei muuteta.

## Uusi luonnos (jatko)

- `meksikolainen-quesadilla-sienilla` EN/SV/TH: 6 ainesosariviä, 3 valmistusvaihetta, 2 annosta, 25 min; maissitortillan 100 g, mozzarellan 80 g, sienten 75 g, maissin 80 g ja öljyn 13,5 g määrät säilytetty. Mikrokypsennyksen turvallisuusvaraus ja GK-mallin rajoitukset siirretty kaikkiin kieliin. `status: draft`, ei FI-metadataa, ei julkaisuun hyväksyttyjä SHA-pareja. Huomaa: käännös ei ole riippumattomasti QA-varmistettu.

## Kolmas luonnoserä (9.11.2026)

- `thai-kai-jiao-yrteilla` EN/SV/TH: 6 ainesosariviä, 4 valmistusvaihetta, 2 annosta, 25 min. Munat 110 g (ilman kuorta), kalakastike 15 g, basilika 5 g (thaibasilikan koostumusproxy), kevätsipuli 20 g ja rypsiöljy 10 g; kaikki ravintoarvot säilytetty. Kypsennys kauttaaltaan; kalan allergeeni ja tuotekohtaisen koostumuksen epävarmuus säilyvät. Lähteen teksti puhuu thaibasilikasta, metatieto tavallisesta basilikasta: käännökset avaavat proxy-eron, mutta FI-laatuarvio on edelleen tarpeen.
- `thai-kookosriisi-mangolla` EN/SV/TH: 6 ainesosariviä, 3 valmistusvaihetta, 2 annosta, 25 min. Kuiva jasmiiniriisi 100 g, kookosmaito 184 g, mangon syötävä liha 150 g, seesami 6 g, keitinvesi 100 g. Ei riisin vaihtoa tahmariisiin, ei jäähdytettyä riisiä, ei lisättyä makeutusta. Kunkin kieliversion status draft; semanttinen julkaisu-QA ja SHA-parit puuttuvat.

- `valimerellinen-tortilla-espanola-aamupalaksi` EN/SV/TH: 7 ainesosariviä, 3 valmistusvaihetta, 2 annosta, 25 min. Kuoritun raakan perunan 60 g esikeitto 500 g:ssa vedessä, veden poisvalutus, 55 g sipulia, 13,5 g oliiviöljyä, 13,5 g rypsiöljyä ja kuoreton muna 110 g. Kaikki paistoöljy sisältyy; ei alkuperäisen öljyssä pitkään kypsennetyn version GK-siirtoa. Draft / QA odottaa.

## Neljäs luonnoserä

- `indonesialainen-bubur-ayam-kanariisipuuro` EN/SV/TH: 6 ainesosariviä, 3 valmistusvaihetta, 2 annosta ja 45 min. Kuivaa jasmiiniriisiä 100 g, broilerin nahatonta rintafileetä 150 g, inkivääriä 2 g, kevätsipulia 12 g ja vettä aluksi 800 g. Riisiä haudutetaan noin 40 min, kana kypsennetään kauttaaltaan puurossa ja syödään kaiken keittoliemen kanssa. Alkuperäisen ohjeen mahdollinen lisävesi ei ole numeerisesti määritelty: tämä ei lisää ravintoarvoja mutta vaikuttaa lopputuotteen määrään ja koostumukseen. Ei soijaa, sambalia eikä rapeaa sipulia. Luonnokset eivät ole merkitys-QA-hyväksyttyjä.

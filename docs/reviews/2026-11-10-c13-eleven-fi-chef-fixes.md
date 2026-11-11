# C13 – 11 ruokalajikohtaisen FI-valmistusohjeen SHA-lukittu korjauserä

10.11.2026. [Issue #404](https://github.com/ozirix-dev/Reseptit/issues/404), C13-luokan 11 suoraviivaisesti korjattavaa FI-ohjetta.

| #404 | FI recipe_id | Valmistuskorjauksen rajaus |
|---:|---|---|
| 1 | `indialainen-poha-maapahkinoilla` | Neljä yksilöllistä raaka-ainelistaan sidottua vaihetta; Git blob `f8b9cf8a82c6c0a04a1a3cdbc76f2599cb4f6258` |
| 15 | `lahi-ita-manakish-zaatarilla` | Neljä yksilöllistä raaka-ainelistaan sidottua vaihetta; Git blob `1369126b90bafbe09c07aaf503ae2c69c886b8e4` |
| 16 | `malesialainen-kaya-paahtoleipa` | Neljä yksilöllistä raaka-ainelistaan sidottua vaihetta; Git blob `04d0be9051dd41645e08345990078260e374f6ca` |
| 24 | `valimerellinen-halloumi-tomaattileipa` | Neljä yksilöllistä raaka-ainelistaan sidottua vaihetta; Git blob `253f6853afd71b5ffe17d338e45778bcbf0b1343` |
| 27 | `intialainen-rava-uttapam` | Neljä yksilöllistä raaka-ainelistaan sidottua vaihetta; Git blob `4377bd567ccb853594849f8cbd25865c086d366f` |
| 35 | `lahi-ita-ful-medames` | Neljä yksilöllistä raaka-ainelistaan sidottua vaihetta; Git blob `99ffb906ba9c9ea76ad78fba360a261e0838444b` |
| 38 | `meksikolainen-aamiais-tacot-mustapavuilla` | Neljä yksilöllistä raaka-ainelistaan sidottua vaihetta; Git blob `6ccf46d642816d129eabe08f041056801f73e445` |
| 46 | `valimerellinen-menemen-fetalla` | Neljä yksilöllistä raaka-ainelistaan sidottua vaihetta; Git blob `84d096e39f712d0b9ad7b723eb907883c65ea20f` |
| 47 | `valimerellinen-pinaatti-fetashakshuka` | Neljä yksilöllistä raaka-ainelistaan sidottua vaihetta; Git blob `acddff7d09b0dcb3c5d0ad67880dc577832d66bf` |
| 49 | `vietnamilainen-pho-ga-aamuksi` | Neljä yksilöllistä raaka-ainelistaan sidottua vaihetta; Git blob `6f95d3d742d5b035939531efaefa56448edcf4b2` |
| 59 | `intialainen-mannasuurimoupma` | Neljä yksilöllistä raaka-ainelistaan sidottua vaihetta; Git blob `4f527aa3f3b7264dd1ae05dd5d905bc84ba26e42` |

**Tärkeät rajat:** Poha ei ole pihvitaikina. Manakish on nopeasti kypsyvä jogurttipannuleipä, ei perinteisen hiivataikinan tarkka kopio. Kaya-leivän kaksi kananmunaa käytetään eri tarkoituksiin. Rava sisältää vain mannaa/jogurttia/vettä ja alkuperäiset kasvikset. Ful medames tehdään vain valmiiksi kypsistä härkäpavuista. Aamiaistacoissa on 150 g *kypsää* mustaa papua valmistustapana, mutta lähteen kuiva/kypsä-massaperusta on yhä tutkimatta. Menemen ja shakshuka erottavat munan kypsennyksen yleisestä kasvispannusta. Pho ga:n 150 g kana kuumennetaan vähintään 74 °C:n sisälämpöön, ja riisinuudelit keitetään erikseen. Upman 100 g manna kuivapaahdetaan ennen 300 ml veteen lisättyjä kasviksia.

**Ei uusia ainesosia, rasva-annoksia, punnittuja makroja tai GI/GK-sinettejä.** Kaikki 11 alkuperäistä Markdown-tiedostoa pysyvät byte-for-byte ennallaan ja julkisen FI-esityksen oikaisu toimii vain lähteen täsmälliseen Git-blob-SHA-tunnisteeseen. Käännöslähteet ja niiden julkaisurekisteri eivät muutu. Näiden nykyisiä ravintolukuja **ei** saa tulkita täyden riippumattoman laskennan hyväksynnäksi.

**Erilliset C13:n kaksi HOLDia:** #05 aloo paratha, jossa tarjoilujogurtti puuttuu punnitusta reseptistä ja julkinen quality-hold on jo käytössä; #37 laksa lemak, jonka reseptin kookos-curryliemestä puuttuu currymauste/tahna. Ne ratkaistaan riippumattomalla lähde-/ravintomallin tarkistuksella tai julkisella karanteenilla. Ei päällekkäistä korjausta tähän PR:ään.

Tämä on kokin rakenteellinen arvio, ei fyysinen koepaisto. Julkaisu vaatii täsmä-HEAD CI PASS ja Pages build/deploy -todisteen. Ei Cloudflare/Recipavo-domainin cutoveria.

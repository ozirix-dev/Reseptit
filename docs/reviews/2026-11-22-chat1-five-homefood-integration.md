# Chat-1: viiden kotiruokaluonnoksen riippumaton integraatiokatsaus

**Päivä:** 22.11.2026
**Omistaja:** Chat-1, integraatiovastaava
**Kohde:** PR:t #785–#789; vain versionoituun lähdesisältöön ja julkisiin vertailulähteisiin perustuva katsaus.
**Päätös:** viisi resepti-PR:ää pysyvät **DRAFT / HOLD**. Tämä muistio ei ole automaattinen julkaisuhyväksyntä eikä fyysisen koekeittiötestin väite.

## Lähdeversiot ja nykyinen päätös

| PR | FI-identiteetti | Tarkistettu HEAD | 4 kieltä | Ravinto | Kuva | Päätös |
|---|---|---|---|---|---|---|
| #785 | kinkkukiusaus | `ea1009a1b3c6ad0dbd855461cede192109b76c45` | FI/EN/SV/TH draft | Ehdokas, HOLD | Git WebP, ei manifestissa | HOLD |
| #786 | liha-perunasoselaatikko | `b128e8e6e4abce1ce30d637208c980ac3b94a2a0` | FI/EN/SV/TH draft | Ehdokas, HOLD | Git WebP, ei manifestissa | HOLD |
| #787 | kesakeitto | `2efb29756739bd16e8fc754d48f0948d131e828b` | FI/EN/SV/TH draft | Ehdokas, HOLD | Git WebP, ei manifestissa | HOLD |
| #788 | suppilovahverokeitto | `14033ad443e9b08a80ab5b2cbd6267138eff8fb5` | FI/EN/SV/TH draft | Ehdokas, HOLD | Git WebP, ei manifestissa | HOLD |
| #789 | silakkalaatikko | `44299ce052c99c5a09585e0981d425fe3f14d87d` | FI/EN/SV/TH draft | Ehdokas, HOLD | Git WebP, ei manifestissa | HOLD |

Vertailin 20 kielitiedoston kirjattuja ainesosamääriä, annoslukuja, kypsennyslämpötiloja/työvaiheita ja allergeenien säilymistä. **Ilmeistä määrällistä ristiriitaa ei löytynyt.** Tämä ei korvaa lopullista SHA-sidottua merkityskatselmointia eikä äidinkielisen tarkastajan tarpeen arviointia. Kaikki viisi hyväksyntätietuetta `docs/reviews/new-recipes/<id>.json` sisältävät edelleen `decision: hold`, `reviewed_by: UNREVIEWED` ja keskeneräisiä tarkistuksia.

## Riippumaton lähdeperusteinen huomio resepteittäin

### #785 Kinkkukiusaus
- [K-Ruoan vertailuohje](https://www.k-ruoka.fi/reseptit/kinkkukiusaus) käyttää 1 kg pakasteperunaa, 400 ml ruokakermaa ja uunissa ensin 225 °C / 30 min, sitten 200 °C / 30–40 min. Recipavon jaksotus 225 °C / 30 min + 200 °C / 35–40 min sopii lähdeperiaatteeseen.
- K-Ruoalla 5 annosta ja 200 g saunapalvikinkkua, Recipavolla 6 annosta ja 250 g kypsää savukinkkua: **oma määräsovitus**, ei sama ravintoarvosyöte. Kinkun pakkausallergeenit ja käytettävä perunasuikaletuote jäävät täsmennettäviksi.
- Ravintoehdokkaassa pakasteperunasikaleet ja savukinkku on käsitelty proxy-tiedoilla; numeerisia arvoja ei hyväksytä julkaistavaksi.

### #786 Liha-perunasoselaatikko
- [Valion vertailuohje](https://www.valio.fi/reseptit/liha-perunasoselaatikko/) käyttää jauhoisia perunoita ja kypsennettyä jauhelihaa mutta myös munia soseessa ja sekoittaa lihan soseeseen. Recipavo käyttää munatonta, kerrostettua vaihtoehtoa: teksti on oma muunnelma eikä Valion ravintoarvoja tai rakennevakuutusta voi kopioida.
- Recipavon 15–20 min perunan esikeitto, jauhelihan läpikypsennys ja 200 °C / 25–30 min uuni ovat ohjeellisesti uskottavia; lopullinen annoskapasiteetti ja rakenne arvioidaan reseptikohtaisesti.
- Naudan jauhelihan rasvaprosentti ja maitotyyppi puuttuvat, joten ravintoehdokkaan 17-prosenttinen jauheliha ja muu proxy eivät ole hyväksyttyjä täydellisiksi arvoiksi.

### #787 Perinteinen kesäkeitto — ensimmäinen jatkokandidaatti
- [Marttojen kesäkeitto](https://www.martat.fi/reseptit/kesakeitto/) sisältää uudet perunat, porkkanan, kukkakaalin, herneet, nippusipulin, maidon ja vehnäjauhon; vihannesten nopeaa kypsennystä korostetaan. Recipavon kasvisten lisäysjärjestys ja vehnäjauhon sekoittaminen **kylmään maitoon** ovat johdonmukaiset.
- **Rakenne-ero:** Martoilla 1 l vettä ja 4 dl kevytmaitoa, Recipavolla 700 g vettä ja 400 g nimeämätöntä maitoa. Paksuus ja 6 annoksen valmissaanto ovat omia arvioita. Tämä ei yksin osoita virhettä, mutta pitää kuvata oman sovituksen ominaisuutena.
- Ravintoehdokkaasta puuttuu 100 g kevätsipulin hyväksytty koostumustietue; lisäksi peruna, herne ja maitotyyppi ovat proxy- tai tuotevaihtoehtoja. **Ei täydennetä nollilla.** Tuotespesifikaatiot ratkaistaan ensisijaisesti luotettavilla julkisilla pakkaus- tai koostumustiedoilla; valmistajakirje tai fyysinen koekeittiötesti ei ole automaattinen pakollinen portti.
- Kaikki 11 ainesriviä ja 5 valmistusvaihetta ovat alustavassa FI/EN/SV/TH-vertailussa linjassa; lähde-SHA:han sidottu hyväksytty merkitysrekisteri puuttuu.

### #788 Suppilovahverokeitto
- [Marttojen vertailuohje](https://www.martat.fi/reseptit/suppilovahverokeitto-2/) käyttää sieniä, vehnäjauhoja, kasvislientä ja kermaa, mutta myös sulatejuustoa. Recipavon juustoton oma sovitus ja 300 g tuoreita sieniä eivät vastaa alkuperäisen annoksen ravintoarvoja.
- [Ruokaviraston sienten tunnistusohje](https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/turvallisen-kayton-ohjeet/ruokasienet/sienten-tunnistaminen/) tukee nimenomaista vaatimusta varmasti tunnistetuista syötävistä sienistä. Tätä rajoitusta ei saa heikentää käännöksissä.
- Ravintoehdokkaasta puuttuvat lajikohtainen suppilovahveron koostumus ja valmiin kasvisliemen tuotesidonta. Näitä ei korvata mielivaltaisilla sienilaji- tai liemiproxyilla.

### #789 Silakkalaatikko
- [Marttojen silakkalaatikko](https://www.martat.fi/reseptit/silakkalaatikko/) käyttää silakkafileitä, perunaa, porsaan kylkeä, kananmunaa ja maitoa, noin 175 °C / 1,5 h. Recipavon pekonia käyttävä, ilman jauhoa valmistuva muunnelma on **eri valmistusversio**: rakenne ja ravinto on arvioitava erikseen.
- [Ruokaviraston ajantasainen kalan syöntisuositus](https://www.ruokavirasto.fi/kalansyontisuositus) sisältää suuren, perkaamattomana yli 19 cm Itämeren silakan rajoituksen alle kouluikäisille ja hedelmällisessä iässä oleville naisille. FI/EN/SV/TH-luonnoksissa tämä ryhmä- ja kokoraja on säilytetty; varoitus ei koske automaattisesti kaikkea silakkaa.
- Ravintoehdokkaan pekoni-, maito- ja munapaino-oletukset sekä maustetiedot ovat keskeneräisiä; kala kypsennetään ohjeen mukaisesti läpikypsäksi.

## Yhteinen kuvan hyväksyntäeste — viisi PR:ää, yksi koodikorjaus

Nykyisen `main`-haaran `assets/images.manifest.json` sisälsi katselmointihetkellä 396 hyväksyttyä kuvaa; **yhtäkään viidestä uudesta kuvatiedostosta ei ole tässä tuotantomanifestissa**. Gitissä olevan WebP:n olemassaolo ei korvaa omistajan kuvahyväksyntää eikä julkaisussa vaadittavaa varmennettua R2-/CI-kuvalähdettä.

Kaikki viisi PR:ää muuttivat saman `site/scripts/validate-changed-content.ts`-kohdan, jotta `draft` tarkistetaan Gitissä olevan `kuvat/`-lähteen ja `published` edelleen varmennetun `PROJECT_IMAGE_ROOT`-lähteen avulla. Chat-1:n erillinen integraatiokorjaus ottaa tämän yhteisen muutoksen **täsmälleen samassa muodossa** yhdessä PR:ssä, jotta viisi reseptihaaraa eivät toista sitä. Pidä julkaistujen kuvien tarkistukset ennallaan.

## Jäljelle jäävä toimeksiantojono

1. **Yhdistä vain yhteinen Draft-kuvavalidoinnin turvattu korjaus** Repo Guardilla, kun CI on PASS. Se ei julkaise yhtään reseptiä.
2. **#787 kesäkeitto ensin:** hyväksy/korjaa tarvittaessa kokkikelpoisuuden kirjallinen evidenssi; täsmennä mahdolliset tuotespesifikaatiot julkisista lähteistä ja päätä julkaistaanko makrot vai jätetäänkö ne perustellusti pois. Synkronoi FI-SHA ja merkitysvertailu vain lopulliseen lähteeseen.
3. **#785, #786 seuraavaksi:** tuotteiden täsmennys ja ravintoarvojen valinta/poisjättö, hyväksyntäkirjaukset sekä uusi mainin mukainen PR-CI.
4. **#788 ja #789 myöhemmin:** sienilajin koostumustieto/liemi sekä kalan turvallisuus- ja tuoteproksit tarvitsevat enemmän riippumatonta näyttöä.
5. **Kaikki viisi:** hyväksy jokainen tuotantokuva erikseen kuvavarannon prosessiin, kirjaa lähdekohtaiset arvioinnit, tee hyväksytyn FI-version lopullinen käännös-SHA-tarkastus, päivitä `decision` vasta todellisella näytöllä ja aja CI uudella HEADilla. Vasta sitten Repo Guard Ready/merge. Cloudflare-deploy on erillinen työ.

**Ei hyväksymismerkintöjen imitointia, ei GK-numeroiden arvaamista, ei valmistajakyselyn automaattista pakkoa, ei ilmoitusta tehdystä koekeittiötestistä.**

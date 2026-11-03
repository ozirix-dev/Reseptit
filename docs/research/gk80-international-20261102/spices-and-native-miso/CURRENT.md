# GK80 – pav bhajin nykyiset mausteet ja kaksi rajattua lähdetarkistusta

2.11.2026. Main `96a25d8c9db6fb0a505a70a37a5b357b6a83593a`. Julkaistuna on edelleen **179/326**, tavoitteeseen261 puuttuu **82**. Tutkimuksen alku oli156/326. Tämä paketti lisää **yhden lasketun tutkimusehdokkaan**, ei julkaistua arvoa. Mallia, menetelmän rajoja, reseptiohjetta, makroja tai Codex2:n tiedostoja ei muutettu.

## Laskettu lähde-ehdokas: pav bhaji

[Nykyiset17 ainesriviä kattava laskelma](pav-bhaji-current-source-version.json) antaa **GK42,2723825 ≈42,27/annos**, LOW. Pois jäävä positiivinen saatava hiilihydraatti on **1,90775 g/annos**. Jokainen tällainen rivi on alle1 g; summa alittaa2 g vain **0,09225 grammalla**. Nykyiset rajat säilyvät.

Vanhan GK-syötteen lähteetön pav-bhaji-mausteseos ei kuulu enää reseptiin. Nykyohje määrää erikseen juustokuminan5 g, korianterinsiemenen4 g, savupaprikan2 g, kurkuman2 g ja chilin1 g. Näille käytettiin [AFCD:n natiivia WITHOUT-sugar-alcohols-koostumusta](source-catalog.json), ei oletettua mausteseoksen nollaa tai uutta GI-oletusta. Yksittäiset polyolit säilyvät tuntemattomina.

| GI:tä käyttävä osa / 4 annosta | Rekisterissä jo oleva lähde | Raja |
| --- | --- | --- |
| Peruna400 g, keitetty ja karkeasti muussattu | Muusatun perunan valmistusanalogia73; Yang2006 / International Tables2021, n10 | Ei mitattu kasviscurryn GI; lajike ja sekoitettu matriisi poikkeavat |
| Kukkakaali200 g, tuore herne150 g, porkkana65 g, tomaattimurska400 g | Kasvisryhmän keskiarvo66 | Laaja LOW-analogia, ei jokaisen aineen suora mittaus |
| Nykyohjeen pehmeät vehnäsämpylät300 g | Leipäryhmän keskiarvo64 | Valmis leipä, ei raakajauhon GI; tuotekohtainen vaihtelu |

Perunan alkuperäistutkimus on [Yang2006](https://doi.org/10.3748/wjg.v12.i21.3430); rekisterin valmistuskortti on uudelleenkäyttöä. Sämpylät ja kaikki10 g tuoretta korianteria sisältyvät laskelmaan, vaikka niiden käyttö on tarjoilussa. Öljy27 g perustuu Fineli541:n omaan13,5 g/rkl mittaan. Porkkana65 g ja kaksi valkosipulinkynttä7 g perustuvat natiiveihin Fineli-talousmittoihin. Vanhan makrolaskelman pienempiä60 g ja3 g/kynsi arvoja ei peritty; myös valkosipulin FineliCHO16,3 eroaa vanhasta AFCD10,2:sta. Lähdevalintoja ei viritetty poisjättörajan läpäisyyn.

Alkuperäiset raaka-ainehiilihydraatit säilytettiin: keitinveden valuttamiselle ei keksitty määrällistä vähennystä. Savupaprikan koostumus käyttää paprikajauheen vastinetta; savustuksen vaikutusta ei tunneta. Raaka- ja kypsäkoostumuksen, talousmittojen ja GI-analogioiden epävarmuus ei näy desimaalien määrässä. **Uudet reseptikohtaiset lähdesovellukset odottavat tarkistusta ja hyväksyntää.**

## Ehdollinen tai ratkaisematon lähdenäyttö

[Alueellinen lähdekortti](regional-source-screen.json) tallentaa alkuperät, natiivirivit, HTML-hashit ja rajaukset.

- **Miso:** [MEXT17045, vaalea riisikoji-miso](https://fooddb.mext.go.jp/details/details.pl?ITEM_NO=17_17045_7&MODE=7), saatavan hiilihydraatin natiivi massasumma11,8 g/100 g. Se eroaa monosakkaridiekvivalentista11,9, erotuslasketusta18,5 ja kokonaishiilihydraatista21,9. Puuttuvia polyoleja ei asetettu nolliksi. Miso-lohi on ainoa nykyinen misotahnan käyttäjä; tämän uuden lähdeperheen sovellusta ei hyväksytty. Geneerisen soijamison AUSNUT-tiheydellä kahden15 ml lusikan massa olisi34,8 g ja osuus1,0266 g/annos, jo yli yksittäisen poisjättörajan. Tuo tiheys ei lisäksi todista vaalean riisimison erämassaa. Määrää ei pienennetty rajan vuoksi. **0 uutta kokonaista laskelmaa.**
- **Mison ihmisnäyttö:** [Kawamura2010](https://doi.org/10.3136/fstr.16.247) tutkii misokeittoa riisin rinnalla. Se ei ole erillisen misotahnan GI-mittaus, joten riisiaterian arvoa ei siirretty tahnaan.
- **Maissitärkkelys:** [Lang1999](https://pubmed.ncbi.nlm.nih.gov/10357737/) antaa GI95±18 SEM, GI-osassa n6, glukoosivertailu ja annos1 g/kg. GI mitattiin erikseen ilman insuliini-infuusiota; koko tutkimuksen n8 ja clamp-osan n5 eivät ole GI-koehenkilömäärä. Tämä lähde oli jo aiemmassa tutkimuksessa. Koko valmistusmenetelmä ei varmistunut rajatulla alkuperäisjulkaisun haulla, joten arvoa ei otettu kastikkeiden tai pannupinnoitteen GI:ksi. Viisi nykyistä käyttäjää ovat dim sum, baozi, hapanimelä porsas, kung pao ja mapo tofu; kolme kuuluu Codex2:n varauksiin. Vahamaisen tai muokatun maissitärkkelyksen geelien GI92/101 ei ratkaise tavallisen kauppatärkkelyksen vastaavuutta. **0 uutta kokonaista laskelmaa.**

Mison suora koostumuskortti on hyödyllinen jatkotutkimukseen, mutta GI:tä tai kokonaisen reseptin kattavuutta se ei itsessään tuota. Maissitärkkelyshaun jatkaminen edellyttää uutta reittiä koko alkuperäiseen menetelmään; samoja abstraktihakuja ei pidä toistaa.

## Päällekkäisyydetön vaikutus ja jatko

[Koordinointitarkistuksen](impact-and-coordination.json) mukaan pav bhaji ei kuulu Codex2:n kolmeen tarkistettuun varauslistaan. Oma kokonaisuus on nyt **10 erillistä hyväksymätöntä tutkimusversiota**: viisi nykyisiin määriin perustuvaa lähteistettyä versiota (granola, pistaasijogurtti, kongjuk, falafel, pav bhaji) ja viisi tuote-, määrä- tai sisältöportin sisältävää versiota. Muualla hyväksytty rahkapiirakka on erillinen1. Kaikkien myöhempi hyväksyntä ja julkaisu nostaisi kattavuuden korkeintaan **190/326:een**, jolloin puuttuisi71. Tämä ei ole valmis julkaisuerä eikä tämänhetkinen kattavuus.

Tehokkaimmat seuraavat toimet:

1. Viedään muualla hyväksytty rahkapiirakka oman omistajansa julkaisutarkistukseen: enintään1 lisäys.
2. Tarkistetaan viiden lähteistetyn tutkimusversion reseptisovellukset ja poisjättövarat: enintään5 lisäystä.
3. Ratkaistaan pohan valmistusohjeen ristiriita sen laskettua versiota vasten: enintään1 lisäys.
4. Varmennetaan neljän muun ehdollisen version täsmälliset tuotteet ja grammaspesifikaatiot: enintään4 lisäystä.
5. Ratkaistaan erillisen menetelmäehdotuksen kautta jauhokomponenttien hyväksyntäportti. Suuret jauhojoukot eivät avaudu kopioimalla valmiin ruoan GI:tä raakajauholle.

## Varmennus

[Muuttamattoman GK-mallin ajo](evaluate.mts), [tulos](model-results.json) ja [riippumaton Decimal-tarkistus](verify_decimal.py) täsmäävät. Neljä negatiivista kontrollia jää HOLD-tilaan: vanha tuntematon mausteseos, puuttuva juustokuminan massa, puuttuva kurkuman koostumus ja maustemäärien kaksinkertaistus. Viimeisessä kaikki yksittäiset poisjätöt ovat edelleen alle1 g mutta yhteissumma ylittää2 g.

Lähteiden ja mallin [manifesti](source-manifest.json) on sidottu mainin tarkkoihin blobeihin. Ei tuotantobuildia, raskasta testi- tai CI-ajoa, pushia tai PR:ää. Vain oma tutkimushaara muuttuu.

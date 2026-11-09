# Rinnakkainen käännöserä B — 9.11.2026

**PR #356**: tämä keskustelu. **PR #357**: ensimmäinen keskustelu. Kumpikin omistaa vain omat reseptinsä. #357:n nimettyjä 20 reseptiä ei käsitellä tässä erässä. Aiemmat kuusi päällekkäistä bulgogi- ja kimchi-jjigae-luonnosta on poistettu #356:sta; ne kuuluvat #357:ään.

## Erän 20 FI-kohdetta (60 kieliversiota, 60 luonnosta (21 FI/GK-HOLD; 33 QA odottaa))

| Suomenkielinen lähde | EN | SV | TH |
|---|---|---|---|
| `reseptit/paaruoat/kana-yakitori-kaalilla.md` | luonnos / FI HOLD | luonnos / FI HOLD | luonnos / FI HOLD |
| `reseptit/paaruoat/pho-bo.md` | luonnos / FI HOLD | luonnos / FI HOLD | luonnos / FI HOLD |
| `reseptit/paaruoat/rendang-padang.md` | luonnos / QA | luonnos / QA | luonnos / QA |
| `reseptit/paaruoat/sate-ayam.md` | luonnos / QA | luonnos / QA | luonnos / QA |
| `reseptit/aamupalat/meksikolainen-huevos-a-la-mexicana.md` | QA tehty / GK HOLD | QA tehty / GK HOLD | QA tehty / GK HOLD |
| `reseptit/aamupalat/karibia-callaloo-munakas.md` | QA tehty / GK HOLD | QA tehty / GK HOLD | QA tehty / GK HOLD |
| `reseptit/aamupalat/meksikolainen-quesadilla-sienilla.md` | luonnos / QA odottaa | luonnos / QA odottaa | luonnos / QA odottaa |
| `reseptit/aamupalat/pohjoisafrikkalainen-harissa-shakshuka.md` | luonnos / QA odottaa | luonnos / QA odottaa | luonnos / QA odottaa |
| `reseptit/aamupalat/thai-riisinuudelikeitto-aamuksi.md` | luonnos / QA odottaa | luonnos / QA odottaa | luonnos / QA odottaa |
| `reseptit/aamupalat/valimerellinen-tortilla-espanola-aamupalaksi.md` | luonnos / QA odottaa | luonnos / QA odottaa | luonnos / QA odottaa |
| `reseptit/aamupalat/indonesialainen-bubur-ayam-kanariisipuuro.md` | luonnos / QA odottaa | luonnos / QA odottaa | luonnos / QA odottaa |
| `reseptit/aamupalat/vietnamilainen-chao-ga-kanapuuro.md` | luonnos / QA odottaa | luonnos / QA odottaa | luonnos / QA odottaa |
| `reseptit/aamupalat/thai-kai-jiao-yrteilla.md` | luonnos / QA odottaa | luonnos / QA odottaa | luonnos / QA odottaa |
| `reseptit/aamupalat/meksikolainen-kurpitsapuuro-piloncillolla.md` | luonnos / QA odottaa | luonnos / QA odottaa | luonnos / QA odottaa |
| `reseptit/aamupalat/kiinalainen-musta-seesamipuuro.md` | luonnos / QA odottaa | luonnos / QA odottaa | luonnos / QA odottaa |
| `reseptit/aamupalat/thai-kookosriisi-mangolla.md` | luonnos / QA odottaa | luonnos / QA odottaa | luonnos / QA odottaa |
| `reseptit/aamupalat/pohjoisafrikkalainen-lablabi.md` | luonnos / QA odottaa | luonnos / QA odottaa | luonnos / QA odottaa |
| `reseptit/aamupalat/munakasmuffinit.md` | luonnos / FI HOLD | luonnos / FI HOLD | luonnos / FI HOLD |
| `reseptit/aamupalat/tonnikalamunakkaat-uunissa.md` | luonnos / FI HOLD | luonnos / FI HOLD | luonnos / FI HOLD |
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

Työnjono on rajattu erilleen #357:stä. Kolme reseptiä / yhdeksän kieliversiota on tehty ja verrattu FI-lähteeseen. Kaikki kolme reseptiä / 9 kieliversiota säilyvät draftina eikä FI-lähteiden kielimetatietoja julkaista tässä haarassa: Huevos ja Callaloo rikkoivat GK80-release-2:n raakatekstin SHA-sidonnan (CI 42644592927: STALE_INPUT), ja farinatan kielimetatiedon lisäys rikkoi erillisen GK100-owner-approved-eighteen-julkaisusinetin (CI 42645835154: GK100_RELEASE_CANDIDATE_CHANGED). Hyväksyttyjä GK80- tai GK100-tarkisteita ei avata kielistatusten vuoksi; julkaisua varten tarvitaan erikseen katselmoitu, testattu tuki metatietojen turvalliselle käsittelylle. Lisäksi kahden pääruoan (rendang ja sate ayam) kuusi kieliluonnosta ovat lisättyinä; niiden tarkat määrät, annokset, ainesosarivien lukumäärä, makrot ja vaiheiden lukumäärä vastaavat FI-lähteitä. Kaikki 20 reseptiä / 60 kieliversiota luonnosteltu; ei vielä hyväksytty julkaisuun. PR on Draft eikä tätä sisältöä ole yhdistetty tuotantoon. Aiempi #356:n CI kaatui käännösten metatiedon/vertailun tarkistuksessa; viimeistelemättömiä käännöksiä ei julkaistu.

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

- `pohjoisafrikkalainen-lablabi` EN/SV/TH: 6 ainesosariviä, 3 valmistusvaihetta, 2 annosta, 25 min. Kypsät kikherneet 100 g, valmista valkoista pitaa 100 g, juustokuminaa 2 g, ilman kuorta punnittu muna 110 g, laimennettua valmista kanalientä 700 g. Muna höyrykypsennetään erillisessä astiassa ilman rasvaa; ei ylimääräistä öljyä tai harissaa. Semanttinen julkaisu-QA odottaa. HUOM: alkuperäisessä metassa on `kananmuna` täsmentämättä kuoren poistoa, mutta valmistusosassa kuoretta punnittu; käännöksissä se ilmaistaan valmistuksen mukaisesti. FI-reseptiä ei muutettu.

## Viides luonnoserä (9.11.2026)

- `vietnamilainen-chao-ga-kanapuuro`: EN/SV/TH, 6 ainesosariviä, 3 työvaihetta, 2 annosta. 100 g kuivaa jasmiiniriisiä, 150 g nahatonta broileria, 2 g tuoretta inkivääriä, 12 g kevätsipulia ja 800 g vettä aluksi. Lisää tarvittaessa vettä koostumuksen säätämiseksi: tavanomainen ruoanvalmistus, **ei ravintolaskennan HOLD**. Kana kypsennetään kauttaaltaan, keitinliemi jää ruokaan; ei paahdettua sipulia tai muita ylimääräisiä lisukkeita.
- `kiinalainen-musta-seesamipuuro`: EN/SV/TH, 6 ainesosariviä, 3 vaihetta, 2 annosta. 100 g kuivaa jasmiiniriisiä, 700 g vettä, 200 g makeuttamatonta soijajuomaa, 20 g hunajaa, 10 g **kokonaisia mustia seesaminsiemeniä**. Ei seesamitahnaa, jauhamista tai ylimääräisiä lisukkeita. FI:n soijajuoman makeuttamattomuus mainitaan valmistuksessa, vaikka metatieto ei erikseen sano sitä; käännösteksti säilyttää täsmennyksen. Huomioitavat allergeenit: soija ja seesami.
- Nämä 6 kieliversiota ovat **draft**, riippumaton merkityskatselmointi, SHA-evidence, FI-kielimetat ja CI-julkaisunäyttö odottavat. Uusia ravintolukuja tai GK-arvoja ei laskettu.

- `meksikolainen-kurpitsapuuro-piloncillolla`: EN/SV/TH luonnosteltu (6 ainesosaa, 3 työvaihetta, 2 annosta). 250 g kuorittua **myskikurpitsaa**, 100 g 0,5–0,6 mm kaurahiutaleita, 500 g vettä, 30 g **fariinisokeria** ja 2,6 g kanelia. Ei piloncillo-vaihtoa, vaikka slug/kuva viittaa siihen; tämä on täsmällinen fariinisokeriversio. Kurpitsa pidetään paloina, ei soseuteta. Erillinen AI-merkitys-QA edelleen tekemättä.

## Kuudes luonnoserä

- `thai-riisinuudelikeitto-aamuksi`: EN/SV/TH, 6 ainesosariviä, 3 valmistusvaihetta, 2 annosta. Broilerin 75 °C sisälämpötila, kuiva riisivermiselli 100 g, liemi 700 g, limetin hedelmäliha mehuineen 50 g ja korianteri 6 g säilytetty. Ei ylimääräisiä kastikkeita.
- `pohjoisafrikkalainen-harissa-shakshuka`: EN/SV/TH, 11 ainesosariviä, 5 vaihetta, 2 annosta. Harissa 5 g eritelty tarkasti ja erillinen 13,5 g paistoöljy säilytetty. **FI-lähteen ainesosarivillä lukee 'kananmunaa kuoretta' mutta ohjeessa 'kuoretonta'.** Käännösluonnos tulkitsee valmistuksen mukaisesti kuorettomaksi; tämän lähderivin korjaus ja GK-sidosten arvio estävät julkaisun.
- Kaikki kuusi kieliversiota ovat `status: draft`, eikä itsenäistä merkityskatselmointia tai SHA-evidence-julkaisutodistetta ole tehty.

## Seitsemäs luonnoserä

- `munakasmuffinit`: EN/SV/TH 7 ainesosaa, 5 vaihetta, 3 annosta, 190 °C / 16–20 min. Alkuperäisen ohjeen muffinivuokien voitelulle ei ole nimettyä rasvaa tai määrää. Ei uusia määriä eikä makroarvioita: **FI-lähdekorjausta vaativa HOLD**, ei julkaista.
- `tonnikalamunakkaat-uunissa`: EN/SV/TH 7 ainesosaa, 5 vaihetta, 3 annosta, 190 °C / 15–18 min. Samoin puuttuva muffinivuokien voitelurasva, **FI HOLD**. Tonnikala vedessä valutettuna, emmental 50 g, kerma 30 g sekä dill 2,5 g säilyvät.
- Kahden reseptin 6 kieliversiota ovat `draft`; lähdekorjaus on tehtävä erillisessä laadunhallinnassa, ei muokkaamalla GI/GK-sinetin tarkisteita eikä lisäämällä salaa ainesosia.

## Kahdeksas luonnoserä — käännösrungot 60/60

- `kana-yakitori-kaalilla`: EN/SV/TH, 9 ainesosaa, 5 työvaihetta, 4 annosta, 35 min. FI:n ainesosissa **soijakastike**, mutta leipätekstissä **tamari**. Käännöksissä käytetään ainesosaluettelon soijakastiketta ja nostetaan ero esiin; julkaisu **FI HOLD**, myös mirinin korvaamisen vaikutus ravintolaskentaan muistettava.
- `pho-bo`: EN/SV/TH, 15 ainesosaa, 6 valmistusvaihetta, 6 annosta, 240 min. 230 °C paahdus, luiden viiden minuutin esikiehautus, 4 l uutta vettä, 2 h + 60 min haudutus ja naudan ohuet viipaleet. FI:n raaka naudanliha kuumalla liemellä -kypsennys on turvallisuuden kannalta epävarma. Kieliluonnokset sisältävät turvallisemman erikseen liemessä kypsentämisen vaihtoehdon; **FI-turvallisuus-HOLD ennen julkaisua**.
- **60/60 ovat draft**, ei vahvistettua koko erän semanttista QA:ta, thai-takaisinkäännöksiä tai hyväksyttyjä SHA-parisidoksia. Lähdekorjaukset kuuluvat laatu-PR:ään, eivät tähän käännöshaaraan. FI-GK-sinettiä ei kierretä.

## #365:n jälkeen: FI-täsmennysten käännösten synkronointi

- PR #359 ja #365 yhdistetty mainiin, vain yakitori ja phở bò lähdetekstimuutoksina #365:stä.
- EN/SV/TH kaikissa kuudessa kieliluonnoksessa päivitetty vastaamaan korjattuja FI-valmistusohjeita: yakitori soijakastike (ei tamari), 75 °C, puhtaan kastikkeen erottelu, mirin-korvaus ei laskettuun versioon; phở bò erillinen naudan kypsennys liemessä 63 °C + kolme minuuttia, korianteri tarjoiluun.
- Näiden kuuden kieliversion **vanha katselmointi on mitätön** lähdemuutoksen takia. Ei julkaistuja SHA-todisteita; kaikki pysyvät draft-tilassa, kunnes itsenäinen merkitystarkistus tehdään uudelle FI-lähteelle.
- Munakasmuffinit, tonnikalamunakkaat ja harissashakshuka säilyvät GK80:n tarkassa lähdesidonnassa ja niiden korjaukset ovat HOLDissa. Ei muuta ravintolukuja, GK-laskelmaa eikä suljettuja evidence-tietueita.

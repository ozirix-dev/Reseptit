# Lähde- ja sisältökatselmointi

Katselmointi käyttää [aiempaa lähdepalautusta](https://github.com/ozirix-dev/Reseptit/blob/96a25d8c9db6fb0a505a70a37a5b357b6a83593a/docs/nutrition/gk80-operation149/recovery-review.md), [lähdevastaavuusmatriisia](https://github.com/ozirix-dev/Reseptit/blob/96a25d8c9db6fb0a505a70a37a5b357b6a83593a/docs/nutrition/gk80-operation149/source-match-matrix.md) ja [retained-sauce-pakettia](https://github.com/ozirix-dev/Reseptit/blob/429f397472d6970006fd3c6c906b9da533c38c46/docs/research/afcd-polyol-03/retained-sauce-followup.md) niiden täsmällisissä commit-versioissa. Kaikki päätökset ja hashit ovat myös CSV:ssä ja`proposals.json`:ssa. Aritmetiikka ei hyväksy GI-siirtoa. Natiivin CHO-kentän käyttö ei todista kokonaispolyoleja nolliksi eikä vapauta alkuperäisen reseptin makropidätyksiä.

## Lopputarkistuksen hyväksyntäpäivitys

Tutkimuscommit`2a626c560873c0d414508522e1a1173f244f9d1c` sisältää jo saadun käyttäjäpäätöksen kahdelle A-versiolle. **Marjakulhon2,34 A on jo hyväksytty**,ei uusi kysymys omistajalle. **Kaakao-kookos-chian valittu versio on uusi A0,22**,ei alla vertailuna säilyvä B1,59. Molempien kuitti ja hyväksytyt syötehashit ovat`existing-approvals.json`:ssa. Ne saatiin toisessa ajossa; tämä katselmoija ei luonut hyväksyntöjä.

Kaakao-kookos-chian syöte`dfcb1006838f327d6dc368dbdd647180f4be3305b82518e99f88b8d25f71f8b2` säilyttää4 annosta,40g chiaa,200ml Koko UK Unsweetened No Sugar Milk -kylmäjuomaa,100ml38% kermaa ja20g **valmiiksi paahdettua** Urtekram DK1003481 -kookosta. Kaakao1rkl käyttää Fineli20:n omaa6g-mittaa; vanilja on uuden version punnittu5g;Foodin-erytritoli säilyy valinnaisena maun mukaan. Ei kasvimaitojen GI50:tä tai trace50:tä.

[Kokon valmistaja](https://www.kokodairyfree.com/product/unsweetened-chilled-milk/) ilmoittaa0,4gCHO/100ml,jolloin200ml/4 antaa0,2g/annos positiivisen nimellisen ylärajan. [Urtekramin valmistaja](https://www.urtekram.dk/Foedevarer/toerredefrugter-og-mos/kokoschips/) ilmoittaa valmiiksi paahdetulle tuotteelle8,4g/100g,jolloin20g/4 antaa0,42g. Näitä ei muuteta saatavanCHO:n pisteiksi,erätakuiksi tai toisen tuotteen tiheydeksi. Säilytettyjen valmistaja-HTML:ien alkuperäishashit vahvistettiin; kaksi tuotetietosidontaa ovat hyväksytyn kuitin osia.

Fineli34847:n chia0,2g/100g antaa0,02gCHO/annos,Fineli20-kaakao0,165g ja AFCD-vanilja0,1575g. Näiden ja tuotekattojen viisi positiivista poisjättöä ovat yhteensä0,9625gCHO/annos. Katettu kermarivi antaa0,725gCHO×nykyinen dairy30=0,2175GK→0,22. Poisjätetty CHO on katettua CHO:ta suurempi: tämä rajoite ja nimellisten lähdekattojen epävarmuus hyväksyttiin nimenomaisesti. Luku ei väitä koko jälkiruoan mitattua vastetta0,22:ksi.200ml pitää säilyttää millilitroina myös tulevassa integraatiossa.

Marjakulhon aiempi syöte`092719e24df715f0149468125c91e24c08a5dffb29ba2d2f712bb779bd4bdc86` on bitintarkasti sama objekti kuin ennen; omistajan päätös hyväksyy nimenomaan kanadalaisen marjan ja näkyvän Australian koostumusproxyn. Metsämustikan B2,41 ei peri tätä hyväksyntää. Vanhan kaakao-B1,59:n aineistolle jää vertailuarvo,mutta sen hyväksymistä ei tarvita uuteen katteeseen eikä siitä tehdä uutta päätöspyyntöä.

## Kaksi uutta B-päätösesitystä sekä jo hyväksytyt jälkiruoat

### intialainen-besan-chilla: READY_FOR_OWNER_APPROVAL

B: rajattu valmistetun pannulettukomponentin analogia. 2 annosta;100g kuorimatonta kokonaista Cicer arietinum -jauhoa,222,2g vettä,16,7g öljyä; ei liotusta/fermentointia; ohut pannulettu,10min lepo; chutney100g tomaatti+70g sipuli,korianteri6g kaikki mukaan.

Lähde-/menetelmäpäätös: Hyväksy nimenomaan Batra42-komponenttisovellus ja AFCD F002881 -kokonaiskikhernekoostumus; ei yleistä besanin GI:tä. Veden ja öljyn määrät ovat uusi sisältöversio. Vanhan15 henkilön kokeen54,8gCHO vs50g glukoosiviite ja tuntematon rasvalaji jäävät LOW-rajoitteiksi; eivät virheettömän GI-siirron todiste.

Syöte`afc7beb15b482d6b53c84e7d4c58bee88c007a4232a6984918b0320e6f9ed213`; [alkuperäinen sinetöity syöte](https://github.com/ozirix-dev/Reseptit/blob/96a25d8c9db6fb0a505a70a37a5b357b6a83593a/docs/nutrition/gk80-operation149/recovery-cases.json). Decimal: `9.4698`; poisjättö`0 g/annos`.

### intialainen-pinaatti-paneer-chilla: READY_FOR_OWNER_APPROVAL

B: sama nimetty kokonaiskikhernelettu; täyte erillisenä ainesosamallina. 2 annosta;100g kokonaiskikhernejauhoa,222,2g vettä,16,7g öljyä,50g pinaattia,100g paneeria,2g juustokuminaa; ei määräämätöntä tarjoiluchutneya eikä sitruunalohkoa tässä GK-versiossa.

Lähde-/menetelmäpäätös: Batra42-komponentin analogia sekä nimetty2g juustokuminan trace50-sovellus;0,337gCHO/annos. Ei mittausta täytetyn letun GI:stä. Täytteen additiivisuus ja tarjoilun rajaus ovat hyväksyttävä erikseen. Alkuperäisestä ohjeesta ei poisteta lisukkeita tämän katselmoinnin perusteella.

Syöte`6c0b1890e16a526a75f5e8ef7b2729de3f7ef370c17b197dacb3990ece6f0710`; [alkuperäinen sinetöity syöte](https://github.com/ozirix-dev/Reseptit/blob/96a25d8c9db6fb0a505a70a37a5b357b6a83593a/docs/nutrition/gk80-operation149/recovery-cases.json). Decimal: `8.9235`; poisjättö`0 g/annos`.

### kaakao-kookos-chia: vanha B1,59,ei valittu; uusi A0,22 jo hyväksytty

B: nimetty toimituksellinen plant50/trace50-malli; ei mitattuja ruoka-GI-arvoja. 4 annosta;300g makeuttamatonta kookosmaitoa (alkuperäisen huomautuksen vaihtoehto),40g chiaa,10g kaakaota,4,2g vaniljaa,20g kuivana paahdettua makeuttamatonta kookoskoristetta,4g puhdasta erytritolia.

Lähde-/menetelmäpäätös: Hyväksy uudet nimetyt kookosmaito-,kaakao-,vanilja- ja kookoskoristesidonnat nykyisten B-koodausrajojen sisällä. Natiivi CHO tarkistettu; kookosmaito2,81g/100g täyttää5g-rajan,trace0,7723g/annos ja jokainen<=0,5. GI-epävarmuus ei ole lähderajattu; malli ei sovi A:ksi tai B-poisjättöprofiiliksi.

Syöte`20febc748b6f5c90dc4ba1c45b30cdf23066415cba6864b993c9ba2f9bed78d8`; [alkuperäinen sinetöity syöte](https://github.com/ozirix-dev/Reseptit/blob/96a25d8c9db6fb0a505a70a37a5b357b6a83593a/docs/nutrition/gk80-operation149/prepared-route-cases.json). Decimal: `1.59490`; poisjättö`0 g/annos`.

### rahka-marjakerroskulho: ALREADY_APPROVED_UNPUBLISHED

A: valittu2,34-versio käyttää nimettyä pohjoisamerikkalaista marjaa. 4 annosta;250g rahkaa,100g maustamatonta10% turkkilaista jogurttia,100g tuoretta mansikkaa,50g tuoretta pohjoisamerikkalaista wild blueberry -marjaa,20g raakaa hasselpähkinää,2g punnittua sitruunankuorta,4g Foodin-erytritolia.

Lähde-/menetelmäpäätös: Nimetty Canadian wild blueberry53 + AFCD raakamustikan koostumusproxy sekä nykyiset maitokoodaukset; ei metsämustikan GI-hyväksyntää. Lajike-/maa- ja koostumusproxy jäävät LOW-rajoitteiksi; kylmä tarjoilu. Hasselpähkinän ja koko kuorimassan positiivinen A-poisjättö0,67g/annos. Metsämustikan2,41 B-vaihtoehto jää CONDITIONAL_REVIEW-tilaan eikä lisää kattavuutta.

Syöte`092719e24df715f0149468125c91e24c08a5dffb29ba2d2f712bb779bd4bdc86`; [alkuperäinen sinetöity syöte](https://github.com/ozirix-dev/Reseptit/blob/96a25d8c9db6fb0a505a70a37a5b357b6a83593a/docs/nutrition/gk80-operation149/recovery-cases.json). Decimal: `2.33945`; poisjättö`0.670 g/annos`.

### Chilla-lähteen rajattu itsenäinen tarkistus

[Batra ym.1994](https://apjcn.nhri.org.tw/server/APJCN/3/4/151.pdf), sivut151–152, tarkistettiin jo säilytetystä alkuperäis-PDF:stä kuvina. PDF:n hash`4b90cf8309e1246a5cd4ee30d12b50278facd3e75de791745bb51e519a20bc39` täsmää aiempaan havaintoon. Tutkimus jauhoi kokonaisia palkokasveja;90g jauhoa+200ml vettä tuotti kolme lettua, rasvaa5g kullekin. Taulukon3 kikherneletun42 erotettiin mungletun36:sta ja fermentoidun kikherneletun45:stä.

Tarkkaan kokonaiskikherneversioon jää nimetty valmistuskomponentin B-analogia. Täyte ja chutney lasketaan erikseen. Emme päättele raakajauhon tai kaupallisen kuoritun besanin GI:tä. Ikä, kohortti, glukoosiviite, näytteenotto ja testiannosten CHO-ero ovat todellisia LOW-rajoitteita; niistä ei johdeta korjauskerrointa eikä varmuusväliä. Näin rajattu toimituksellinen komponenttimalli voidaan esittää omistajan hyväksyttäväksi nykyisen B:n nimettyjen analogioiden periaatteella. Tämä ei tee heikoista kuudesta valmisruokasiirrosta kelvollisia: niiltä puuttuvat olennaiset vastaavuustiedot, joita tässä on palautettu.

### Kaakao-kookos-chian vanhan B-vaihtoehdon vertailu,ei hyväksyntäpyyntö

Nykyisen A:n mitatusta GI:stä ei ole kyse. Fineli29014:n2,81g/100g tulee natiivista CHOAVL-kentästä; sen300g osuus on2,1075gCHO/annos ja plant50-osuus1,05375GK. Chia F008209:n3,1g/100g tuottaa0,31gCHO/annos ja low50-osuuden0,155GK. Kaakao20:11g/100g tuottaa0,275gCHO; vanilja F009350:12,6 tuottaa0,1323gCHO; kookoshiutale F002987:7,3 tuottaa0,365gCHO/annos. Kolmen trace50-osuus yhteensä0,7723gCHO, jokainen<=0,5 ja yhteensä<=1. Näiden GK-osuus on0,38615; summa1,5949. Kuivapaahdetun koristelun koostumusproxy sulkee lisätyn sokerin ja öljyn pois.

Plant50 ja trace50 ovat jo16-version sopimuksessa hyväksytyt rajatut menetelmätyypit, mutta hyväksyntä ei ulotu tähän reseptiin ilman uutta nimettyjen sidontojen ja sisällön päätöstä. B ei tässä jätä yhtään positiivista GI-osuutta pois. GI0–150-herkkyys on vain oletuskoe; lähteellä rajattua reseptiväliä ei muodosteta.

### Marjakulhon kaksi vaihtoehtoa

Valittu A2,34 vaihtaa alkuperäisen metsämustikan nimenomaisesti50g:aan tuoretta pohjoisamerikkalaista wild blueberry -marjaa. GI53 on Atkinson2021 Table1, s74, havainto1092; lähteen glukoosi100-lukuun ei tehdä uutta leipämuunnosta. Australian raakamustikan10,4g/100g on näkyvä alueellinen koostumusproxy; se ei todista jokaisen kanadalaisen lajikkeen täsmällistä koostumusta. Omistaja on hyväksynyt tämän rajatun LOW-sovelluksen sekä marjan vaihdon, rahkan/jogurtin koodauksen,2g kuoren ja4g puhtaan erytritolin.

Vaihtoehto B2,41 säilyttää suomalaisen *Vaccinium myrtillus* -metsämustikan50g ja sen Fineli442:n10,182g/100g. GI53:n siirto kanadalaisesta marjasta on avoin lajienvälinen analogia. Lisäksi hasselpähkinä20g saa low50:n ja sitruunankuoren AFCD-nollaproxyn, joten kyse ei ole vain eri marjaluvusta. Syöte`309fdb4e31b5c59ed01f25d96f8d1aa865ef154a12d7391cc5e9fe0e89c8ab18` jää`CONDITIONAL_REVIEW`-tilaan. Sitä ei suositella valitun A-version rinnalla uudeksi kattavuusyksiköksi. Lajisiirtoa ei hyväksytä tämän dokumentin nimenvaihdolla.

## Kolme ehdollista tapausta

### intialainen-ven-pongal: CONDITIONAL_REVIEW

B: puuro-/mung-/cashew-siirtojen kokonaisvastaavuus avoin. Mung42:n heikko7 henkilön keitetty-papuvertailu ei osoita pehmeän yhteispuuron vastaavuutta. Riisipuuro80 ja cashew22/27 eivät rajaa valmistusvirhettä. Ei hyväksyntälomakkeen numeropäätökseen nyt.

2 annosta;100g kuivaa valkoista jasmiiniriisiä,150g kuivaa kokonaista vihreää mungia,20g cashewta,700g vettä,14g punnittua gheetä,2g pippuria; kaikki keitinliemi syödään.

Seuraava täsmällinen ehto: Tarvitaan perusteltu kokonaispäätös yhteiskeitetyn riisin ja kokonaisen mungin sovelluksesta; pelkkää cashew-väliä ei hyväksytä kokonaisepävarmuudeksi.

### jerk-kana: CONDITIONAL_REVIEW

B: uusi hyväksymätön positiivisten osuuksien poisjättöprofiili. Nykyinen B hylkää neljä positiivista GI-puutetta. Maustepippurin0,51g/annos ylittäätrace50:n0,5-rajan.1,686175g poisjättöä ei muuteta nollaksi eikä luokitella A:ksi.

4 annosta;1000g kanaa,300g kuivaa riisiä,240g valutettua kidneypapua,150ml Fineli-kookosmaitoa; uusi punnittu maustepaketti; koko marinadi200°C/45–55min ja kaikki kypsät nesteet syödään.

Seuraava täsmällinen ehto: Älä aktivoi uutta B-poisjättösääntöä tässä erässä. Papu36-analogia ja nimetty kookosmaidon plant50 vaatisivat lisäksi omat päätökset.

### sate-ayam: CONDITIONAL_REVIEW

B: GI18 on lähteen asiantuntijaestimaatti; uusi lähdetyyppi. GI News vahvistaa18:n estimaatiksi;16 henkilön lisäyskoe ei mitannut voin itsenäistä GI:tä. Lämmin kastikesovellus jää epävarmaksi. Malli voidaan myöhemmin suunnitella avoimesti nimetyksi toimitukselliseksi B:ksi, mutta nykyinen sopimus ei hyväksy sitä.

4 annosta;700g kanaa,150g lisättyä sokeria/suolaa vailla olevaa maapähkinävoita,soija32+16g,fariinisokeri18+9g; punnitut lime/mausteet; pannumenetelmä,kaikki marinadi ja kastike mukaan.

Seuraava täsmällinen ehto: Estimaattityypin käyttösopimus ja näkyvä erottelu mitatuista ihmis-GI-lähteistä puuttuvat. Plant50 ja trace50 ovat lisäksi erilliset nimetyt sovelluspäätökset.

Jerk-kanan nykyiset B-tyypit plant50 ja nimetty papuvalmistusanalogia erotetaan uudesta B-poisjättöprofiilista. Papu36 on Edgell-säilyke valutettuna (Atkinson2021 Table1 s87/1290), ei kuivasta keitetyn pavun24 tai muun punaisen tuotteen43. Kookosmaidon CHO ja oma lähdemitta kuuluvat Fineli29014:lle; valmistajan0,8-pistettä ei yhdistetä siihen. Neljä pois jätettävää alkuperäistä ainesosaryhmää ovat soija0,855,maustepippuri0,51,timjami0,033675 ja inkivääri0,2875gCHO/annos. Niiden summa ei tee uudesta profiilista nykyistä B:tä. Menetelmälaajennusta ei suositella pelkän yhden reseptin julkaisuksi.

Sate ayamin [GI News -alkuperäiskirjoitus](https://glycemicindex.com/2026/11/nut-butter-spreading-the-love/) avattiin uudelleen2.11.2026:18 kuvataan estimaatiksi. Tämä ensisijainen havainto vahvistaa lähdetyypin eron, ei uutta ihmismittausta. Rajattu toimituksellinen estimaattimalli on periaatteessa mahdollinen myöhempi päätös, mutta sen lähdetyyppi, lämmin kastikesovellus ja julkinen esitys on sovittava ennen numeron hyväksyntää. Nykyinen julkinen lähdetyyppivalikoima ei tunnista expert-estimaattia. Plant50-kookosmaito ja trace50-korianteri/kurkuma/lime ovat erilliset päätökset, eivät18:n oheishyväksyntä. Trace-osuus on0,303gCHO/annos; laskennassa säilyvät maapähkinävoi150g,soija48g ja sokeri27g. Expert18-osion epävarmuus ei ole lähderajattu.

## Seitsemän lähde-HOLDia ja avausehdot

- **thai-vihrea-curry-kanalla-vhh — SOURCE_HOLD.** Ehdollinen A-aritmetiikka; lähdekelpoisuus false. AU6,4 vsUK17,3g/100g ratkaisematta;700ml toimittaja3g/100g ei vahvista valmistajan etikettiä.725ml:n3,4g/100ml ei siirry30g:aan ilman perusteltua tiheyttä.Thai N35 on vain kokonais-CHO-yläraja,ei saatavan CHO:n piste. Ei hyväksyntäesitystä. Ensin tarkka AU/UK-currytahnan etikettiversio,Squid700ml:n ensisijainen massaperuste ja uusien koostumuslähteiden käyttösovellus.
- **baozi — SOURCE_HOLD.** B-valmisruoka39: koostumus-/käymisvastaavuus puuttuu. Liha/salottisipuli-lähteen39 ei osoita oman porsas-kaalitäytteen ja käymisen vastaavuutta. Avaus vain lähteen täyte/taikinasuhteet ja käyminen osoittavalla näytöllä tai aidosti vastaavalla mitatulla vertailulla.
- **hyderabadi-kanabiryani — SOURCE_HOLD.** B-kokoateria52: ravintolaruoan vastaavuus puuttuu. 30,60–44,94 on koostumusskenaario,ei GI-siirron epävarmuusväli. Ravintolaruoan52 ei ole riisin GI. Avaus vaatii riisi/kana/rasvasuhteet,säilytyksen ja oman jogurtti/kerrostusversion vertailun.
- **intialainen-mannasuurimoupma — SOURCE_HOLD.** B-kokoateria71: premixin ja öljyttömän kasvisversion matriisiero. Mitattu vertailu sisältää öljyä,urad dalia ja chiliä; sama ruokanimi ei riitä. Avaus vaatii rasvan,palkokasvien ja mannan suhteiden puolustettavan vastaavuuden.
- **malesialainen-roti-jala-currykanalla — SOURCE_HOLD.** B-verkkolettu49: taikina- ja protokollavastaavuus puuttuu. 49 koskee verkkolettua; lähteen curryaterian81 ei kelpaa samaan yksikköön. Koostumus ja10 diabetespotilaan siirto ratkaisematta. Avaus vaatii lähteen munan/kookosmaidon/jauhon suhteet ja25gCHO/3h diabeteskokeen sovelluksen perustelun.
- **pizza-margherita — SOURCE_HOLD.** B-pohja52: kaupallinen pohja ei osoita kotitaikinan vastaavuutta. Boboli/Orograin52 lähteen220°C/9min vs oma250°C ja taikina eivät vastaa osoitetusti. Avaus vaatii pohjan kaavan,kohotuksen,rasva/kuitusuhteen ja paiston vertailun.
- **pohjoisafrikkalainen-taatelipuuro-appelsiinilla — SOURCE_HOLD.** B-mannakomponentti55: höyrytetyn ja vesikeitetyn pohjan ero. Maapähkinäöljyisen höyrytetyn mannan55 ei osoita vesikeitettyä rypsiöljypuuroa. Pelkkä rasva/CHO-suhteen sovitus ei korjaa eroa. Avaus vaatii valmistusvastaavuuden ja vanhan6 diabetespotilaan protokollan hyväksyttävän siirron.

Vihreän curryn rajattu uusi tarkistus ei tuonut valmistajan700ml:n massaperusteista etikettiä tai täsmällistä markkinaversiota vahvistavaa näyttöä. [Squidin valmistajasivun](https://www.squidbrand.com/) luku ei onnistunut; hakutulos palautti aiemman toimittajalehden ja eri725ml:n tietoja. Niitä ei ylennetä primäärinäytöksi. Currytahvan AU6,4/UK17,3-erolle ei löytynyt uutta ensisijaista ratkaisua. Saatavilla oleva Oriental Merchantin AU-lehti oli jo paketissa; se ei yksin vahvista nykyistä400g tuotetta. Thai FCD N35:n kokonaiskentän käyttö saatavanCHO:n ylärajana ja lähteen tutkimuskäytön ehdot säilyvät avoimina ennen mahdollista julkaisusovellusta. Lähteettömiä tiheyksiä tai kuituvähennyksiä ei tehty.

Kuudelle vanhalle valmistetun ruoan HOLDille ei aloitettu samaa hakukampanjaa uudelleen: täsmällisen uuden näyttöreitin puuttuessa aiempi matriisi säilyy. Yksi lyhyt päätös ja avausehto on annettu jokaiselle. Numeerinen Decimal-toisto ei ylennä yhtäkään näistä lähdekelpoiseksi.

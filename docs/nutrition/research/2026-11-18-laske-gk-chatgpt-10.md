# laskeGK 10 — riippumaton ChatGPT-lähdekatselmointi

**Tila:** RESEARCH HANDOFF / ei GI/GK-julkaisuhyväksyntää  
**Päivä:** 18.11.2026 (Europe/Helsinki)  
**Lähderepo:** \`ozirix-dev/Reseptit\`  
**Lähtömain:** \`e8ed43ed525a9cb6abbe61b94bc1c036153979c7\`  
**Tarkastelujoukko:** 10 alkuperäistä, \`status: published\` -reseptiä, jotka ovat lisäksi mainin GK-pending-rekisterissä.  
**Rinnakkaisuus:** #706 on erikseen omistettu Codexin GI/GK-toteutushaara. Tämä erä on pelkkä riippumaton tutkimus- ja luovutusaineisto: **älä yhdistä tai kirjoita #706:n lähde-, laskenta- ja hyväksyntärekistereihin tämän raportin perusteella ilman sen omistajan katselmointia.**

## 1. Menetelmä, aineiston rajaus ja käsittelymäärät

Luettiin kaikkien kymmenen nykyiset FI-reseptit ja vastaavat \`docs/nutrition/calculations/<recipe_id>.json\` -syötteet lukitusta main-revisiosta. Kaikkien kymmenen reseptin status oli \`published\`, ja niiden ID oli mainin \`new-public-gk-pending-sources.json\`-rekisterissä. Verrattiin lisäksi Codexin aktiivisen #706-työhaaran \`gk-reviewed-portions.json\`-sisältöä, jotta samaa reseptiä ei ryhdytä toteuttamaan toisella kirjoittajalla.

Ainesosien hiilihydraattiosuuksien **riippumaton aritmeettinen ristiintarkistus** tehtiin tunnettujen grammojen tai syötteeseen kirjattujen grammaa/yksikkö-muunnosten sekä lähteen per-100-g-pitoisuuksien avulla. Tulos jaettiin reseptin annosmäärällä. Sovittuvissa tapauksissa huomioitiin lähderiveillä ilmoitetut syötävä osuus ja retentio. Tämä tarkistus ei korvaa projektin virallista laskuria, lähdekatselmointia, reseptihyväksyntää eikä GI/GK-kokonaisarvion validointia.

**Tilastot tästä valitusta erästä:** 10 käsiteltyä; seitsemän numeerista koko annoksen hiilihydraattisummaa jo FI-lähteen \`carbs_net_per_serving_g\`-kentässä, ja ne täsmäsivät ainesosista tehtyyn ristiinlaskuun ilmoitettuun 0,01 g tarkkuuteen. Yhdessä lisää (#706:n uunibataatit) on erikseen valmisteltu hiilihydraattiarvio. Kahdella (\`punajuuririsotto\`, \`kaali-omenasalaatti\`) osa määrästä jää avoimeksi. **Tässä tutkimus-PR:ssä hyväksyttyjä uusia numeerisia GK:ita 0, uusia sanallisia GK-luokkia 0, uusia ravintoarvojen julkaisuja 0, muutettuja reseptejä 0.** Tutkimustulos on käyttäjälle hyödyllisten jo laskettujen arvojen sekä tarkkojen puutteiden esiin nostaminen ja uudelleentyön välttäminen.

\`carbs_net_per_serving_g\` on repon aiemman mallin arvo. Näissä seitsemässä syötteessä \`carbohydrateOutput=AVAILABLE_EXCLUDING_FIBRE\` ja kaikki merkittävät raaka-aineet on koostumuskohdistettu. Se ei ole valmistetun annoksen laboratoriomittaus. Nimiä \`net\`, \`available\` ja pakkauksen \`carbohydrate\` ei saa yleistää eri lähteiden yli.

## 2. Kymmenen reseptin päätöstaulukko

| Alkuperäinen FI-resepti / lähdeblob | Annos ja jo perusteltu tieto | Tärkeimmät hiilihydraattilähteet sekä lisäselvitystarve | Toimitusehdotus / tila |
| --- | --- | --- | --- |
| [Timjamilla paahdetut uunijuurekset](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/alkuruoat/timjami-uunijuurekset.md) (\`3b4ee5ed\`) | 4 annosta, 25,05 g/annos. | Peruna 11,63 g, palsternakka 7,73 g, porkkana 5,56 g. Paahdetaan 225 °C:ssa. Yleinen GI-ryhmäkeskiarvo ei osoita tämän yhdistelmän tai paahdetun palsternakan GI:tä. | **Käyttäjätieto:** annos ja lähteiden osuudet näkyviin; GK ei numeroa tai vakaita LOW/MEDIUM/HIGH-luokkia ilman uutta valmistukseen soveltuvaa näyttöä. Codexin #706-katselmointirekisterissä ei erillistä riviä tutkimushetkellä. |
| [Palsternakkasosekeitto](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/alkuruoat/palsternakkasosekeitto.md) (\`2478e4a1\`) | 4 kulhoa, 30,59 g/annos. | Palsternakka 14,18 g, peruna 13,56 g, sipuli 1,20 g, kuohukerma 1,50 g. Keitetään ja soseutetaan. Ei suoraa GI-mittausta juuri tästä keitosta; rasva ei oikeuta automaattiseen GK-alennukseen. | **Käyttäjätieto:** annoksen HH sekä kaksi päätekijää. Uusi GK vain reseptikohtaisella GI-/valmistusperustelulla. Codexin #706-katselmointirekisterissä ei erillistä riviä tutkimushetkellä. |
| [Pinaattikeitto](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/pinaattikeitto.md) (\`74434350\`) | 4 kulhoa, 21,82 g/annos. | Maitoa 12,00 g, suurusteen vehnäjauhoa 9,02 g. Pinaattia vain noin 0,15 g. Maitotuotteiden tutkimuskeskiarvo ei kelpaa sellaisenaan kuumennettuun maito–vehnäsuurukseen. | **Käyttäjätieto:** ”Hiilihydraatit tulevat pääosin maidosta ja jauhosuuruksesta”. #706:n lähdekatselmointi tunnistaa luokkarajan epävarmuuden; älä toista. |
| [Perunarieskat ohrajauhoilla](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/leivonnaiset/perunarieskat-ohrajauhoilla.md) (\`dcb01f74\`) | Kymmenen rieskaa, yksi rieska = 14,40 g/annos. | Ohrajauho 8,86 g ja maidolla tehty perunasose 5,53 g/rieska. Perunasoseen todellinen koostumus ja lämpötila sekä rieskan paistaminen eroavat keitetystä ohrasta/perunasta. | **Käyttäjätieto:** yksi rieska ja HH; mahdollinen puolikas rieska 7,2 g. Päällysteet erikseen. Ei pelkkää peruna-GI:tä koko rieskalle. |
| [Kesäkurpitsa-perunapata](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/kesakurpitsa-perunapata.md) (\`f3ebb841\`) | Kuusi annosta, 31,26 g/annos. | Kuoritusta perunasta 20,67 g; tomaateista 4,60 g; nyhtökaurasta 3,24 g. Haudutettu seka-ateria, nyhtökauran täsmätuote ja perunalajike huomioitava. | **Käyttäjätieto:** peruna on suurin hiilihydraattilähde ja koko annoksen HH on tiedossa. #706:ssa jo perunan osuus katselmoitu; ei päällekkäistä muutosta. |
| [Ruis-puolukkapuuro](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/aamupalat/ruis-puolukkapuuro.md) (\`14b25205\`) | Neljä kulhoa, 43,03 g/annos. | Täysjyväruisjauho 22,46 g, sokeri 15,92 g, puolukka 4,65 g. Jauhojen massa tulee lähteen 55 g/dl -muunnoksesta; pitkä 50–60 min haudutus. Ruisleivän GI ei ole haudutetun ruisjauhopuuron GI. | **Käyttäjätieto:** korosta sokerin ja ruisjauhon osuuksia sekä todellista kulhon annosta. Ei suoraa GK-luokkaa ruisleipätutkimuksesta. |
| [Punajuuririsotto](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/punajuuririsotto.md) (\`77c50774\`) | Viisi annosta; resepti sisältää 4 dl kuivaa risottoriisiä = 0,8 dl reseptin eräosuutta/annos. **Koko annoksen HH ei ole hyväksytty.** | Laskennan vanha puuro-riisiviite ei vahvista käytetyn risottoriisin tuotetta. Lisäksi punajuuri punnitaan raakana kuorineen mutta kypsennetään ja kuoritaan; syötävä massa jää auki. Fondin tuote ja muut komponentit puuttuvat. Arkistolaskennan osasummaa 60,73 g/annos ei saa siirtää julkiseksi kokonaisarvioksi. | **Rajattu tieto:** ”Annokseen kuuluu ohjeen mukaan noin 0,8 dl kuivaa risottoriisiä; tarkista pakkauksen HH”. Jatkoon puhtaasti tuotteen, kuoritun/kypsän punajuuren painon ja fondin katselmointi. |
| [Uunibataatit fetalla](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/uunibataatit-fetalla.md) (\`23db5785\`) | Neljä annosta, 2 puolikasta/annos; 350 g raakaa kuorellista bataattia annoksen lähtömääränä. | Repon alkuperäisessä laskennassa bataatin, chilin ja kevätsipulin koostumus puuttuu. #706:n uudemmassa lähdepaketissa AUSNUT F010942 antaa raakan kuorellisen appelsiinilihaisen bataatin saatavilla olevaa hiilihydraattia 13,2 g/100 g (350 g → 46,2 g bataatin osuus); koko annoksen laskelma on omassa #706-työssä. Paahdetun bataatin GI ei ole sama kuin keitetyn taulukkokeskiarvo. | **Ei päällekkäistä toteutusta:** käytä #706:ssa jo katselmoitua HH-tulosta ja kuvaa kuoren syömisen sekä annoskoon rajaus. Älä julkaise uutta GK-numeroa tästä tutkimuksesta. |
| [Omena-kaurapaistos](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/jalkiruoat/omena-kaurapaistos.md) (\`2e4f344d\`) | 4 annosta, 45,00 g/annos. | Kuoritut omenat 17,66 g, kuivakaurahiutaleet 16,35 g, sokeri 10,61 g. Paisto 200 °C:ssa; kastike/jäätelö ei kuulu aineslistaan. Raaka omena + erikseen mitattu kaurapuuro eivät ole tämän paistetun seoksen mitattu GI. | **Käyttäjätieto:** ilmoita annoksen HH ja kolme osuutta; lisäksi muistuta tarjoilulisukkeen erillisestä HH:sta. Ei keksittyä valmiin paistoksen GK:ta. |
| [Kaali-omenasalaatti](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/alkuruoat/kaali-omenasalaatti.md) (\`5c55263a\`) | 6 annosta. Kolmesta punnitusta raaka-aineesta yhteensä noin **5,49 g/annos**, **ei koko annoksen summa**. | Valkokaali 2,49 g, kuorittu omena 2,08 g, porkkana 0,93 g. Caesar-kastiketta 1 dl koko erässä (~0,167 dl/annos), mutta tuotetta/tiheyttä ja HH:ta ei määritelty. | **Käyttäjätieto:** näytä kastikkeen merkitys ja pyydä tarkistamaan pakkaustiedot. Ei HIHH-kokonaislukua, GK-numeroa tai matalan GK:n luokkaa pelkästään kasvisten osasummasta. |

Kaikki seitsemän vanhan julkisen HH-luvun ristiinlasketut summat erottuvat numerotarkkuudeltaan vain pyöristyksellä, esimerkiksi timjami 25,048 → 25,05 ja palsternakka 30,589 → 30,59. Tämä osoittaa **syötteen aritmeettisen vastaavuuden**, ei mittaustarkkuutta tai valmiin aterian vasteen oikeellisuutta.

## 3. Yhteiset lähdehavainnot (älä muuta niitä suoraan resepti-GI:ksi)

1. **Perunan valmistustapa on olennainen.** Vuoden 2021 kansainvälisessä GI-taulukossa perunahavaintojen vaihteluväli on 35–103 ja koontiarvot ovat esimerkiksi keitetylle perunalle noin 73, tavalliselle muusille 79 ja yön yli jäähdytetylle kypsälle perunalle 49. Nämä ovat tutkittujen eri tuotteiden koonteja; ne eivät ole tämän repon yhden perunareseptin erillisiä skenaarioita. Lähde: [Atkinson ym. 2021](https://ajcn.nutrition.org/article/S0002-9165%2822%2900494-4/fulltext).
2. **”Muut kasvikset” -ryhmäkeskiarvo ei ole palsternakan, porkkanan tai uunibataatin täsmä-GI.** Sama katsaus kuvaa laajaa valmistus-, lajike- ja ruokalajivaihtelua. Tämän perusteella ei pidä antaa kaikille kypsille juureksille yhtä GI-arvoa.
3. **Jauhojen, suuruksen, soseuttamisen ja uunipaiston vaikutus pitää eritellä.** Ruisleipä, puuro, ohrasuurimo, maidolla tehty perunasose ja valmis rieska ovat eri tuotteita. [Niin kuin mittausmenetelmiä tarkastellut tutkimus osoittaa](https://pubmed.ncbi.nlm.nih.gov/17093157/), jopa vertailuruoan ja näytteenoton valinta vaikuttaa GI-lukuihin. Arvoa ei siirretä valmiiseen kotiateriaan ilman soveltuvuusarviota.
4. **Seka-ateria ei ole ainesosien mekaaninen ihmismittaus.** [Dodd ym. 2011 / Woleverin vastine](https://ajcn.nutrition.org/article/S0002-9165%2823%2902635-7/fulltext) muistuttavat, että laskettu ja mitattu seka-aterian GI voivat poiketa. Tutkimuksia ei käytetä yleisenä vähennyskertoimena.
5. **Diabeetikon hyöty ensisijaisesti oikeasta annoksesta ja HH-grammoista.** [Diabetesliitto](https://diabetes.fi/diabetestietoa/hiilihydraattiarviointi/) ja [Diabetes UK](https://www.diabetes.org.uk/living-with-diabetes/eating/carbohydrates-and-diabetes/learn-about-carb-counting) korostavat annoskoon, pakkauksen hiilihydraattimäärän sekä raaka/kypsä-painon merkitystä. [Diabetes UK:n GI-opas](https://www.diabetes.org.uk/living-with-diabetes/eating/carbohydrates-and-diabetes/glycaemic-index-and-diabetes) korostaa GK:n täydentävää roolia. Tässä ei päätellä insuliiniannosta tai turvallisuutta.

### Tarkastellut koostumuslähteet

- [Fineli: porkkana #300](https://fineli.fi/fineli/fi/elintarvikkeet/300), [palsternakka #309](https://fineli.fi/fineli/fi/elintarvikkeet/309), [raaka kuorittu peruna #205](https://fineli.fi/fineli/fi/elintarvikkeet/205), [maidolla tehty perunasose #2029](https://fineli.fi/fineli/fi/elintarvikkeet/2029).
- [Fineli: kevytmaito #684](https://fineli.fi/fineli/fi/elintarvikkeet/684), [puolikarkea vehnäjauho #110](https://fineli.fi/fineli/fi/elintarvikkeet/110), [ohrajauho #150](https://fineli.fi/fineli/fi/elintarvikkeet/150).
- [Fineli: ruisjauho #100](https://fineli.fi/fineli/fi/elintarvikkeet/100), [puolukka #440](https://fineli.fi/fineli/fi/elintarvikkeet/440), [kuorittu omena #11060](https://fineli.fi/fineli/fi/elintarvikkeet/11060), [valkokaali #320](https://fineli.fi/fineli/fi/elintarvikkeet/320).
- [AFCD Release 3 -koostumustiedostot](https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd/data-files), mm. rolled oats F006143, jotka ovat repon versioidussa koostumussyötteessä.
- AUSNUT F010942 -rivi on #706:n lähdepaketissa, ei tämän mainin alkuperäisessä \`uunibataatit-fetalla.json\`-syötteessä.

Tietueet ovat raaka-aineiden koostumustietoja. Niistä ei saa automaattisesti GI-mittausta.

## 4. Ehdotettu toteutusjärjestys integraatio-omistajalle

**P1 — jo hyväksyttyjen HH-summien käytännön esitys:** Timjamijuurekset ja palsternakkasosekeitto on helppo nostaa käyttäjälle näkyvästi perusteltuihin pääraaka-ainelauseisiin, koska annostieto ja koostumus ovat valmiina. Samoin pinaattikeiton maito+jauho, ruispuuron ruis+sokeri ja paistoksen omena+kaura+sokeri. Nämä eivät vaadi uuden GI-arvon keksimistä.

**P1 — aidosti avoimet tuotetiedot:** Kaali-omenasalaatin kastike; punajuuririsoton risottoriisin tuote, kypsänä kuoritun punajuuren paino ja fondin koostumus. Älä julkaise osasummaa koko annoksen arvona.

**P2 — samankaltaisten valmistusten GI-lähdetyö:** Ryhmittele kuumennettu/soseutettu peruna ja palsternakka sekä paahdetut juurekset. Älä käytä samana mittauksena yhtä keitetyn perunan GI:tä kaikissa. Jätä numeerinen GK auki, jos ristiriidattomia lähteitä ei ole.

**Ei kaksoistyötä:** #706:ssa jo selvitettyjä uunibataatin koostumustietoja, kesäkurpitsapadan perunaosuutta ja muita näkyviä annoshuomautuksia ei pidä toteuttaa uudelleen. Tämä raportti ei koske #706:n omistajuuden siirtoa.

### Luovutuksen hyväksymisrajat

1. Codexin #706-omistaja tutkii tämän tiedoston **lukutilassa** ja vertaa sen täsmälliseen uusimpaan HEADiin.
2. Vain uudet, mielekkäät tiedot siirretään yhden kirjoittajan kautta varsinaiseen aineistoon, yhdessä tarvittavien FI/EN/SV/TH-tekstien ja syöte-/valmistus-SHA-tarkistusten kanssa.
3. Testataan reseptin 0,5/1/1,5/2 annosnäkymä ja erotetaan valmistettava erä syötävästä annoksesta. Seurataan, että käyttäjä näkee oikean annoksen HH-luvun ja lähteen.
4. Vain virallinen laskenta- ja hyväksyntäprosessi voi julkaista GK:n. Numeerisia tai sanallisia uusia GK-luokkia **ei hyväksytty tässä tutkimuksessa**.
5. Tässä dokumentissa ei tehty paikallista npm-, selaintestiä eikä koko repon GK-generointia. GitHubin automaattinen dokumentti-CI, jos se käynnistyy, varmennetaan erikseen. Ei mergeä, ei deployta.

## 5. Miten työ tehostui ja mitä seuraavaksi kannattaa mitata

Kymmenen reseptiä hyödyntää muutamaa yhteistä Finelin juures-/perunatuotetta ja tuttua annoslaskentasopimusta. Samasta aineistosta voidaan kerralla tarkistaa peruna- ja palsternakkaosuudet useissa resepteissä. Kahden keskeneräisen koko annoksen arvion ongelma ei ole laskentakaava, vaan määrittämätön valmistettu tuote/saanto. Jatko kannattaa kohdistaa näihin, ei samaa kaavaa toistavaan tutkimukseen.

Kirjaa seuraavasta integraatioerästä käsitellyt ID:t, **uudet oikeasti käyttäjälle näkyvät** HH/GK-/sanalliset tiedot, HOLDit, valmiit source/recipe-pin-tarkistukset sekä CI-kierrokset. Älä tulkitse tutkimusmuistiota toteutetuksi parannukseksi ennen PR:n hyväksyttyä integrointia.

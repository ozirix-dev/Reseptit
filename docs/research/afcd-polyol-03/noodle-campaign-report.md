# GK80 – yhteiset nuudeli-, kastike- ja kookosmaitoesteet

Tutkimus- ja päätösajo 2.11.2026. Codex2 / Codex Tutkimus.

## A. Rajaus ja luovutus

Lähtö-HEAD `c850f479dc88322520ab452876501f1d9909be40`, oma haara
`codex/afcd-polyol-03-gk80-handoff`, oma työpuu
`D:/Projects/tmp/reseptit-afcd-polyol-03-gk80-handoff`.
Repo_guard varmensi `ozirix-dev/Reseptit`-originin. Ajon lopullinen commit on
luovutusviestissä ja tämän tiedoston sisältävässä Git-historiassa; commit ei
voi sisältää omaa SHA-tunnustaan. Paketin tiedostohashit ovat
[manifestissa](noodle-campaign/manifest.json).

PR183:n Codex1-haaraa, PR182:a, kuuden version lukittua haaraa, reseptejä,
GI-rekisteriä tai laskentamoottoria ei muuteta. Ei uutta PR:ää, Readya,
mergeä, deployta tai manuaalista Actions-ajoa. Tutkimushaaralla ei ole avointa
PR:ää, ja nykyinen push-workflow koskee vain mainia.

**Päätös:** luovuta yksi uusi A-menetelmän mukainen, lähteisiin sidottu
versio omistajan katselmoitavaksi: **pad see ew, laskettu GK-osa0,73**.
Dan Dan ja Lanzhou pysyvät HOLDissa. Nuudeliselvitystä laajennettiin saman
ajon aikana viiden lähdeperheen42 reseptin riippuvuuskartaksi. Kookosmaitoon
liittyvä25 hyväksymättömän version joukko on suurin jatkotutkimuksen
riippuvuusjoukko; sitä ei esitetä25 avautuvana GK-tuloksena.

## B. Tarkastelun laajuus ja yksi päätösmatriisi

Vanhaa170 keskeneräisen reseptin inventaariota luettiin kerran
riippuvuuksien löytämiseksi. Ei uutta70 reseptin tutkimusta tai326 reseptin
uusintalaskentaa. **14 nuudelireseptin** tyyppi, alkuperäinen määrä,
valmistusmuoto ja itsenäiset esteet tarkastettiin yksityiskohtaisesti.
Lisäksi kartoitettiin28 muuta reseptiä yhteisten kookosmaito-, currytahna-,
tumma soija- ja tähtianisriippuvuuksien kautta. Näille ei väitetä tehdyn
uutta täydellistä ateriakohtaista lähdetutkimusta.

Kaikki42 uniikkia tunnusta, alkuperäiset ainesosamäärät ja reseptihashit ovat
[58-rivisessä riippuvuus-CSV:ssä](noodle-campaign/dependency-map.csv).
[Perhekohtainen koonti](noodle-campaign/family-impact.json) sisältää
uniikit tunnukset ilman perheiden yli yhteenlaskettua katetta.

Yksi nykyinen [päätösmatriisi](current-decision-matrix.csv) laajeni33:sta69
reseptiin:34:llä on valmisteltu aritmeettinen ehdotus,35 uutta riviä on
HOLD-riippuvuuksia. Aiemmat hyväksyntä- ja syötehashikentät säilyvät.
42:n tarkastelujoukossa on yksi uusi A-versio,36 HOLDia ja viisi jo aiemmin
hyväksyttyä versiota. Näistä HOLDeista yksi, roti jala, oli jo aiemmassa
33:n koonnissa; sen valmisruoka-GI-analogiaa ei avattu uudelleen.

| Lähdeperhe | Uniikit riippuvuudet | Ilman hyväksyttyä versiota | Tässä avautuvat uudet kokonaiset A-ehdotukset |
| --- | ---: | ---: | ---: |
| Nuudelit |14 |11 |1 |
| Kookosmaito |28 |25 |0 |
| Currytahna |8 |8 |0 |
| Tumma soijakastike |2 |2 |1, sama pad see ew |
| Tähtianis ja liemi |6 |5 |0 |

Perheet menevät päällekkäin. Viisi aiempaa hyväksyttyä versiota ovat
kabocha-puuro, kaya-paahtoleipä, laksa lemak, pho ga ja pad kee mao.
Hyväksyntä koskee edelleen vain aiemmin lukittuja syötteitä.

## C. Yhteinen vehnänuudelipaketti

[MEXTin korjatuista virallisista2023-taulukoista](https://www.mext.go.jp/a_menu/syokuhinseibun/mext_00001.html)
poimittiin kuusi pientä lähderiviä. Main- ja carbohydrate-työkirjat
varmennettiin alkuperäisillä SHA256-tunnuksilla ja rivit sovitettiin
natiivilla elintarviketunnuksella. Molempien työkirjojen **CHOAVL-massasumma**
on sama seuraavissa neljässä varsinaisessa nuudelirivissä:

| Natiivi tunnus | Muoto | CHOAVL g/100g | Päätaulukon solu / hiilihydraattitaulukon solu |
| --- | --- | ---: | --- |
|01050 |Kuivattu kiinalaistyylinen vehnänuudeli, kuiva |65,0 |P77 / O60 |
|01051 |Sama nimetty kuivatun nuudelin tyyppi, keitetty |25,4 |P78 / O61 |
|01047 |Tuore kiinalaistyylinen vehnänuudeli |47,6 |P72 / O55 |
|01048 |Tuoreesta tyypistä keitetty nuudeli |25,2 |P73 / O56 |

01050:n sokeriekvivalentti71,4 ja by-difference64,5 ovat eri kenttiä.
65,0/25,4 ei ole kokeellisesti varmennettu valmistussaanto. Kummallakaan
luvulla ei päätellä alkuperäisen reseptin nuudelimuotoa. Puuttuvia
komponentteja ei summata nollina: käytetään lähteen julkaisemaa massasummaa.
01041:n sulkeissa oleva udon-arvo(69,9) hylätään tavallisena pisteenä;
01056:n paistettu maustettu pikanuudeli on eri ruoka.

**Korjaus aiempaan selvitykseen:** Fineli120 löytyy nykyisestä hyväksytystä
natiiviaineistosta: saatava hiilihydraatti66,4g/100g. Sen nimi on
NUUDELI, VEHNÄNUUDELI ja prosessi RAW. Aiempi raportti jätti tämän tietueen
löytämättä. RAW ei kuitenkaan yksin varmista kuivatuotetta. Fineli28969:n
keitetty25,344 on reseptijohdettu tietue; näiden suhteesta ei tehdä saantoa.

GI-havainnot käytetään kerran aiemmasta
[yhteisestä lähdepaketista](followup/noodle-gi-observations.json):

- [Yang2006](https://doi.org/10.3748/wjg.v12.i21.3430): kuivattu vehnänuudeli
  GI46,0, n10, SD5,8. Tarkka tuote ja keittoaika puuttuvat. Mahdollinen
  nimetty lähdeanalogia tarvitsee uuden soveltamispäätöksen.
- [Atkinson2021 Supplement1](https://nutritotal.com.br/pro/wp-content/uploads/sites/3/2021/09/Tabela1_IG.pdf),
  sivu102 kohta1510: Sanlian Food Shandong, kuivattu vehnänuudeli,
  keitto5min ja valutus, GI62, SEM8, n10. Alkuperäinen UO18 on
  julkaisematon. Reseptien Sanlian-vastaavuutta ei ole osoitettu.

46 ja62 eivät muodosta vaihteluväliä. Tuoreen nuudelin81,6 ei ole kuivan
nuudelin yläraja. Saman Yang-havainnon myöhempi taulukointi ei ole toinen
koe. Testiannoksen32,9g kuiva-/märkäperuste on avoin eikä todista koostumusta.
Uusien MEXT-rivien käyttö ei peri aiemman natto04046:n hyväksyntää.

## D. Dan Dan ja Lanzhou

**Dan Dan: HOLD, ei koko reseptin numeerista GK-arvoa.** Alkuperäinen300g
vehnänuudelia ei kerro kuiva-/tuore-/kypsäpainoa. Ohjeessa keittäminen ei
ratkaise tätä. AFCD F009076:n tahinille löytyy natiivi saatavaCHO1,0g/100g;
se ei todista ruokalusikoiden massaa, tuotemerkkiä tai mustariisiviinietikan
ja chiliöljyn koostumusta. Kevätsipulin kappalemassa on myös avoin.

Kastikkeeseen jää100ml tärkkelyspitoista keitinvettä. Kun alkuperäisen
nuudelin saatavaCHO on A0, liuennut määrä L ja takaisin palautuva osuus r:

```text
valutetuissa nuudeleissa A0 − L
palautetussa vedessä    r × L
tarjoillaan yhteensä    A0 − (1 − r) × L
```

A0+rL laskisi osan tärkkelyksestä kahdesti.100ml ei yksin määrää L:ää tai
r:ää; myöskään homogeenisuutta ei oleteta. Massatase ei todista palautuneen
tärkkelyksen tai aterian GI:tä. Tapausta ei ratkaistu vaihtamalla vesi
puhtaaksi vedeksi tai pienentämällä nuudeliannosta.

**Lanzhou: HOLD, ei koko reseptin numeerista GK-arvoa.** Alkuperäinen350g
vehnänuudelia on tilaltaan avoin. Sipulin,4cm inkiväärin, yhden
kanelitangon, kahden tähtianiksen, retiisien ja kevätsipulien massat
puuttuvat. Liha esiryöpätään ja vesi vaihdetaan; myöhempi kotiliemi
siivilöidään. Kaupallisen liemen natiivi koostumus ei todista tämän liemen
uuttunutta hiilihydraattia. Koko aromien määrää ei oleteta nollaksi tai
kokonaan syödyksi.

S&B:n valmistajasivun0g CHO/5ml on yhdysvaltalaisen annosilmoituksen nolla,
ei analyyttinen nolla/100g. Santa Marian tähtianiksen JSON-LD:ssä löytyi
16,2g CHO, mutta määräperuste ja servingSize puuttuvat. Sitä ei siirretty
per100g-pisteeksi. Tavallinen anis ei ole tähtianis. Nämä kaksi
hylkäysperustetta tallennettiin yhteiseen tuotepakettiin.

[Alkuperäiset syötteet ja täsmälliset HOLD-perusteet](noodle-campaign/hold-inputs.json)
säilyttävät määrät. Kuivaan MEXT01050-skenaarioon liittyvät nuudeliosan
Decimal-laskut ovat erillisessä CSV:ssä: Dan Dan22,425 GI46:lla tai30,225
GI62:lla; Lanzhou26,1625 tai35,2625. **Nämä eivät ole kokonaisia resepti-GK:tä,
B-ehdotuksia, vaihteluvälejä tai kattavuuslisäyksiä.**

## E. Uusi A-versio: pad see ew

Kaikki11 alkuperäistä grammamäärää ja neljä annosta säilyvät. Tarkka versio
sitoo600g:n konjac-ainesosan valutettuun KoRo-tuotteeseen ja15g:n tumman
soijakastikkeen
[Yutakan nimettyyn valmistajailmoitukseen](https://yutaka.london/products/seasonings/dark-soy-sauce-18-litres/).
Alkuperäinen resepti ei nimeä Yutakaa: tämä on erillinen omistajan
hyväksyttävä tuotesidonta, ei todiste alkuperäisestä käytetystä kastikkeesta.

Natiiveina pisteinä käytetään Fineli11565/324/858/541/393/11178 sekä
AFCD F008065/F008026. Foodinin100CHO−100 eksplisiittistä polyolia tuottaa
laskennallisen nollan; muuta puuttuvaa polyolia ei oleteta nollaksi.
KoRo<0,1 ja Yutaka8g/100g ovat valmistajailmoituksen **nimellisiä ylärajoja**,
eivät saatavanCHO:n pisteitä tai kaikkien tuotantoerien analyyttisiä rajoja.
Tämä rajoitus on samaa lajia kuin kuuden version hyväksytyssä KoRo-sidonnassa,
mutta aiempi hyväksyntä ei hyväksy tätä uutta reseptiversiota.

| Osa | CHO/annos g | Käsittely |
| --- | ---: | --- |
| Parsakaali300g |1,23 |Nykyinen nimetty veg40-koodaus: GK0,492 |
| Valkosipuli7g |0,28525 |Sama nykyinen koodaus: GK0,1141 |
| Tavallinen soijakastike30g |0,24 |Nykyinen nimetty low50-koodaus: GK0,12 |
| KoRo600g |enintään0,15 nimellisessä lähdemallissa |Positiivinen GI-puute, poisjättö |
| Kananmuna165g |0,12375 |Poisjättö |
| Yutaka tumma15g |enintään0,3 nimellisessä lähdemallissa |Poisjättö |
| Osterikastike15g |0,7875 |Poisjättö |
| Valkopippuri2g |0,21205 |Poisjättö |

Muiden ainesosien natiivi saatavaCHO on lähteessä nolla tai Foodinille
laskettu eksplisiittisestä etiketistä. GI40/50 ovat olemassa olevia
julkaistuun koodaukseen perustuvia projektisidontoja, **eivät tämän aterian
mitattuja GI-lukuja tai uusia yleisoletuksia**.

Laskettu osa0,7261 pyöristyy0,73:een. Poisjätöt1,57330g/annos ovat
kukin aidosti alle1g ja yhteensä alle2g. Tuntemattoman GI:n osuus on
positiivinen eikä sitä esitetä GI-nollana. Annoksen todellista koko GK:tä
suhteessa laskettuun osaan ei tunneta näistä poisjätöistä.

[Blue Dragonin eri tummalla kastikkeella](https://www.bluedragon.co.uk/products/dark-soy-sauce-150-ml)
23,5g/100g sama15g tuottaisi poisjättösumman2,15455: nykyinen A estyy,
vaikka jokainen yksittäinen poisjättö jää alle1g:n. Tuotteita ei yhdistetä
vaihteluväliksi eikä laskenta siirry yleiseen tummaan soijakastikkeeseen.

Uuden version syötehash on
`aff3debfb7b5f7bf6f1957b68de41b1bda051e5eeb0d64a7e68fbeb92c235efc`.
[Nimellinen syöte](noodle-campaign/cases.json), [lähteet](noodle-campaign/sources.json),
[moottorin tulos](noodle-campaign/engine-results.json) ja
[riippumaton Decimal](noodle-campaign/decimal-results.json) on sinetöity.
Omistajan lähde-/sisältöhyväksyntä, GK-only-julkaisusopimus,
makroversion yhteensopivuus, integraatio ja julkaisu ovat kaikki vielä avoinna.

## F. Muut nuudelityypit ja yhteisten esteiden todellinen tuotto

Neljä konjac-reseptiä hyödyntävät samaa valmista tuotetta. Pad kee mao on jo
lukitussa kuuden erässä. Pad see ew on tämän ajon uusi versio. Pad thain30g
tamarinditahnan aiemmat varmistetut rajat eivät salli A-poisjättöä;
maapähkinä ja ohjeen kevätsipuli vaativat lisäksi täsmennyksen. Khao soin
kookosmaito, currytahna ja huuhdeltu sinappikaali ovat itsenäisiä esteitä.

Bun cha, goi cuon ja pho bo käyttävät kuivaa riisinuudelia, eri muodoissa.
Fineli29055:n81,64 on saatavaaCHO:a; reseptijohdetun keitetyn29056:n31,16
arvosta ei johdeta saantoa. Nykyinen Thai World -ihmis-GI61 ei automaattisesti
hyväksy kylmähuuhdeltua vermiselliä, litteää nuudelia, riisipaperia,
maapähkinävoikastiketta tai kotiliemen uuttumista.

Chow mein on nimenomaan **300g keitettyä, valutettua vehnämunanuudelia**.
AFCD F006044 antaa tälle koostumusmuodolle29,1, mutta kuivanuudelin46 tai
Sanlian62 ei sitoudu siihen. Soban tattariosuus ja tila ovat avoimia;
Yangin tattarinuudelin59 ei ratkaise niitä. Hot potin150g:n nuudelityyppi ja
tila puuttuvat. Aiemmat hyväksytyt pho ga ja laksa eivät ole uusia ehdokkaita.

Seuraava laajennus tehtiin kookosmaitoon, currytahnaan ja mausteisiin:

- **28 kookosmaitoriippuvuutta,25 ilman hyväksyttyä versiota.** Nykyisen
  Fineli29014:n natiivi2,81g/100g antaa seitsemälle jo grammoina listatulle
  ainesosalle yli1g:n annoskohtaisen vertailuosan. Ne eivät aukea
  poisjättämällä kookosmaito nykyisellä A-rajalla.21 tilavuusmäärää jätettiin
  tuotteen massa-/tilavuusperusteen osalta avoimeksi. Tämä on natiivi
  vertailuskenaario, ei jokaisen täysrasvaisen merkkituotteen koostumus.
- **Kahdeksan currytahnaa käyttävää reseptiä kuuluvat myös kookosjoukkoon.**
  Kummankaan esteen yksittäinen nimeäminen ei osoita kahdeksaa uutta
  kokonaista tulosta. Sekoitetun curryn GI tai alueellinen ruokakeskiarvo
  ei ole tahnan GI.
- Kookos-riisijuoma Coco Quenchin ihmis-GI68 koskee myös ruskeaa riisiä
  sisältävää juomaa. Se ei ole kulinaarisen kookosmaidon GI.
  Aiempi kookos-riisipuuron31-rajaus säilyy. GI50:tä ei lisätty.
- Tumma soija avasi yhden nimetyn version kahdesta riippuvuudesta.
  Roujiamon taikinan ja valmistuksen itsenäinen GI-este jää.
- Kuuden tähtianis-/liemireseptin yhteinen aineisto paljasti puuttuvan
  ilmoitusperusteen ja maustemassojen tarpeen. Se ei vielä avannut yhtään
  uutta kokonaislaskelmaa. Jo hyväksytty pho ga säilyy omassa versiossaan.

**Varmennettu lisätuotto: A1, B0.** Ei uutta hyväksyntää eikä julkaisuun
laskettavaa valmista lisäystä. Pelkät neljä nuudeliosan laskuskenaariota eivät
kasvata ehdokasmäärää. Kuuden aiemman valmisruoka-HOLDin, mantelijauhoGI50:n
ja AFCD-polyolien yleisselvitystä ei käynnistetty uudelleen.

## G. Kattavuus pysyy erillään ehdotuksista

| Vaihe | Uniikit numeeriset /326 | Puuttuu261:stä |
| --- | ---: | ---: |
| Viimeksi varmennettu tuotanto/main |156 (47,85%) |105 |
| PR183:n16 hyväksytyn version julkaisuehdokas |172 (52,76%) |89 |
| Lisäksi kuusi lukittua versiota joskus erikseen julkaistuna |178 (54,60%) |83 |
| Lisäksi tämä yksi versio erikseen hyväksyttynä ja julkaistuna |179 (54,91%), ehdollinen |82 |

Aiemmin hyväksyttyjä mutta julkaisemattomia versioita on edelleen22,
integroituna16 ja erillään6. Tämän ajon uudet luvut: lähteisiin sidottu
katselmoitava A-laskentaehdotus1, täydellinen B-skenaario0, omistajan
hyväksymä0, julkaisusopimuksen kaikki ehdot täyttävä uusi tulos0, julkaistu0.

Aritmeettinen koonti on nyt34 uniikkia reseptiä. Niistä22 on aiemmin
hyväksytty eri vaiheissa;12:lta puuttuu hyväksytty versio, mukaan lukien
kuusi ennallaan olevaa valmisruokalähde-HOLDia. Vaikka kaikki muut28 joskus
kelpuutettaisiin, sekään ei osoita30 lähdekelpoista ehdokasta. Tavoitteesta
puuttuvia kahta ei täytetä spekulatiivisilla luvuilla. Tämä ei ole arvio
siitä, että kaikki28 tosiasiassa läpäisisivät hyväksynnän.

## H. Seuraava päätös ja suurin yhteinen työerä

Ensimmäinen konkreettinen kattavuushyppy on **yksi**: tämän pad see ew
-version lähde- ja sisältökatselmointi Codex Julkaisu -agentin kautta
sovittuun myöhempään erään. Aiempaa kuuden version integraatiohyväksyntää ei
sovelleta tähän versioon eikä Ready-PR183:een lisätä uutta erää.

Seuraava suurin yhteinen lähdetyö on **kookosmaito + kahdeksan curryreseptin
liittyvät tahnat** saman riippuvuusgraafin perusteella. Ennen uusia
reseptikohtaisia laskuja tarvitaan tuotekohtainen saatavanCHO:n peruste ja
kelvollinen GI-sovellus tai erikseen rajattu, omistajan hyväksymä
mallimenetelmä.25 on tutkimuksen yläpuolinen riippuvuusjoukko, välitön
osoitettu koko reseptin lisätuotto on0. Joukon roti jalan valmisruoka-HOLDia
ei tutkita uudelleen ilman uutta vastaavuusnäyttöä. Joidenkin muiden
reseptien taikina-, riisi-, marinadi- tai lisukerajat jäävät erillisiksi.

Uusi B-poisjättöprofiili ei aktivoidu. Kookosmaidon plant50-laajennusta ei
käyttöönoteta eikä sen hyväksymisestä luvata25 tulosta. Mantelijauho50
säilyy erikseen hyväksyttävänä oletuksena. Nykyinen lähdenäyttö ei osoita
reittiä261 julkaistuun tulokseen ilman lisää lähde- ja menetelmäpäätöksiä.

## I. Toistettavuus ja tarkistukset

Paketti on `docs/research/afcd-polyol-03/noodle-campaign/`.
Se sisältää yhden lähdekatalogin, kuusi MEXT-riviä, yhden uuden syötteen,
kaksi alkuperäistä HOLD-syötettä ja yhden riippuvuusgraafin. Ei kokonaisia
lähdetyökirjoja, verkkosivuja tai uutta100000 rivin tutkimusaineistoa.

- `extract-noodles.py SOURCE_DIR EXTERNAL_OUT`: lue alkuperäiset korjatut
  MEXT-työkirjat openpyxlillä, tarkista molemmat lähdehashit ja CHOAVL-solut.
- `evaluate-campaign.mts ROOT DATA_DIR EXTERNAL_OUT`: suorita nykyinen
  puhdas A-moottori vain yhdelle uudelle syötteelle. Tarkista lähde- ja
  reseptihashit, nimetty GI-scope, MEXTin estimaattihylkäys ja eri kastikkeen
  kumulatiivisen rajan epäonnistuminen. Aja asennetulla tsx-ajurilla.
- `audit-campaign.py ROOT DATA_DIR EXTERNAL_OUT [INVENTORY_JSON]`:
  riippumaton Decimal-tarkistus saman ulkoisen hakemiston moottoritulosta
  vasten. Valinnainen inventaario rakentaa riippuvuudet uudelleen; sen
  SHA on `family-impact.json`:ssa. Matriisin lähtöversio on sidottu c850f47:ään.
  Tulostiedostot hyväksytään vain Gitin ulkopuolelle.

Lähteen alkuperäiset kentät/yksiköt,11 alkuperäistä grammamäärää,
annosjako, kuiva/tuore/keitetty-erot, itsenäinen aritmetiikka, keitinveden
kaksoislaskennan esto ja tunnusten deduplikointi tarkistettiin.
Lopputarkistuksessa varmennetaan myös63 aiemman tutkimustiedoston
byte-identtisyys, suojattujen etähaarojen HEADit, sallittu tiedostorajaus ja
Markdown-lint. Ei sivustobuildia tai326 reseptin regressiota.

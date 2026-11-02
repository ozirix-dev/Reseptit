# GK80 – natiivipisteen jatko: rahkapiirakan yksi tarkka A-versio

Codex2 / Codex Tutkimus. Lähtö-HEAD `9bb90548ee0cb7d820c0a1d4f57b9d5082b8da24`,
repo `ozirix-dev/Reseptit`, oma haara `codex/afcd-polyol-03-gk80-handoff`,
työpuu `D:/Projects/tmp/reseptit-afcd-polyol-03-gk80-handoff`.
Tämä täydentää nykyistä aineistoa; ei uutta rinnakkaista70 reseptin projektia.

**Ajon aikainen ulkopuolinen julkaisu:** PR183 yhdistettiin ja julkaistiin main-HEADilla`92dc6db`. Build ja deploy41504708914 läpäisivät, ja julkinen GK-sivu näyttää172/326 (A166+B6). [Julkaisuhavainto](production-observation.json) tallentaa tarkan evidenssin. Tätä julkaisua ei tehnyt Codex2.

## Päätös ja vaikutus

**Yksi uusi lähteisiin sidottu A-laskentaehdotus:** `rahkapiirakka-vhh`,
kahdeksan annosta, laskettu GK-osa **0,45**, positiivisia GI-puutteita
pois **1,736875 g CHO/annos**. Tulos ei ole koko aterian mitattu GK.
Lähde- ja sisältöversion hyväksyntä puuttuu; julkaisuun laskettavia uusia
arvoja on edelleen0. Aktiivista moottoria tai reseptejä ei muuteta.

Ratkaisu käyttää julkaistua natiivia saatavan hiilihydraatin pistettä ja
nykyistä A-poisjättömenetelmää. Mantelijauholle ei anneta GI50:tä, pähkinöiden
ryhmä-GI:tä tai paistetun tuotteen GI:tä. B-poisjättöprofiili ei aktivoidu.

## Lähdetulkinta ja täsmällinen valmistusversio

[MEXTin virallisten2023-taulukoiden](https://www.mext.go.jp/a_menu/syokuhinseibun/mext_00001.html)
27.3.2026 korjatuissa työkirjoissa elintarvike **05001, アーモンド 乾**,
kuiva paahtamaton manteli, antaa natiiviksi **CHOAVL-massasummaksi5,2g/100g**.
Päätaulukon soluP435 ja hiilihydraattitaulukon soluO359 täsmäävät.
Molempien työkirjojen alkuperäiset binäärihashit varmennettiin.

Sokeriekvivalentti5,5 ja by-difference11,5 ovat muita kenttiä.
Käytetään lähteen julkaisemaa massasummaa, ei omaa summaa puuttuvat
komponentit nolliksi muuttamalla. Tärkkelyksen0,1, sakkaroosin5,1,
glukoosin/fruktoosinTr ja galaktoosin puuttuva arvo säilyvät lähderivillä.
Kokonaispolyolit jäävät tuntemattomiksi; kuitua ei vähennetä.
Työkirjojen täsmäys varmentaa saman julkaistun tietueen, ei kahta
riippumatonta analyysikoetta.

Uusi valmistusversio määritellään näin:

- Punnitse **150g kuivia paahtamattomia syötäviä manteleita** ennen
  jauhamista. Jauha hienoksi ja käytä koko syntyvä jauho; älä poista
  rasvaa, kuori tai siivilöi osaa pois. Mantelien ja annosten määrä säilyy.
- Tämä on lähdetietuetta vastaavan kokonaisen raaka-aineen tarkka
  valmistusversio.5,2 ei ole väite alkuperäisen nimettömän kaupallisen
  mantelijauhon koostumuksesta. Jauhamisen yhteydessä koko syötteen
  säilyttäminen on erikseen katselmoitava fysikaalinen valmistusoletus.
- Alkuperäinen1tl vaniljauutetta täsmennetään **erillisen version
  punnituksi5g:ksi**. Tämä ei todista1tl=5g eikä käytä yleistä tiheyttä.
  Koko5g:n fysikaalinen hiilihydraattiraja huomioidaan poisjätöissä.
- Muut alkuperäiset grammamäärät, kahdeksan annosta ja175°C/35min paisto
  säilyvät. Munille käytetään Fineli858:n55g/KPL_M-annosmuunnosta;
  kuohukermalle631:n100g/dl-tuotekohtaista lähdemittaa.
- Alkuperäinen2rkl Foodinin100%erytritolia säilyy. Laskennan0g on
  vain nollahiilihydraattisen ainesosan massasentinel: etiketti osoittaa
  eksplisiittisesti100CHO−100polyolia. Makeutusainetta ei poisteta.

MEXTin uusi05001-sovellus ei peri aiemman natto04046-version hyväksyntää.
Lähde- ja sisältösidonta edellyttävät uutta omistajan päätöstä.

## A-laskenta ja rajariski

| Osa | SaatavaCHO/annos g | Käsittely |
| --- | ---: | --- |
| Mantelit150g |0,975 |Positiivinen GI-puute, poisjättö |
| Voi75g, Fineli500 |0,075 |Poisjättö |
| Munat1+2kpl, yhteensä165g, Fineli858 |0,061875 |Sama ainesosa yhdistetty; poisjättö |
| Rahka300g, Fineli622 |1,125 |Nykyinen nimetty dairy30-koodaus: GK0,3375 |
| Kuohukerma100g, Fineli631 |0,3625 |Sama nykyinen koodaus: GK0,10875 |
| Vaniljauute5g |enintään0,625 koko massasta |Fysikaalinen yläraja, poisjättö |
| Foodin-erytritoli |0 eksplisiittisestä erotuksesta |Alkuperäinen määrä säilyy |

Laskettu osa0,44625 pyöristyy0,45:een. Poisjätöt ovat kukin aidosti alle1g
ja yhteensä1,736875g, alle2g. Dairy30 on nykyinen julkaistuun koodaukseen
perustuva projektisidonta, ei maitotuotteiden tai tämän piirakan mitattuGI.

**Mantelin yksittäisen rajan marginaali on vain0,025g/annos.** Pisteen pitäisi
olla aidosti alle5,333...g/100g tässä määrässä. Lähteen5,2 on natiivi
vertailupiste, ei jokaisen mantelierän analyysillä varmennettu yläraja.
Lähdevaihtelu, valmistustäsmennys ja tämä pieni marginaali on hyväksyttävä
näkyvästi; reseptiä ei voi yleistää kaikkiin mantelijauhoihin.

Nykyisen AFCD F006077:n5,4 antaisi1,0125g/annos ja estäisi yksittäisen
ainesosan poisjätön. Se säilyy täsmälleen ennallaan eikä tätä eroa tulkita
vanhan lähteen laskentavirheeksi. Eri lähdepisteistä ei muodosteta
biologista vaihteluväliä eikä pienempää lukua asenneta yleisnormalisoinniksi.

## Yhteisen ratkaisun todellinen tuotto

Neljän aiemmin keskeneräisen mantelileivonnaisen alkuperäiset määrät ja
annosjaot tarkistettiin samasta nykyisestä inventaariosta:

| Resepti | Mantelia / annoksia |05001-CHO/annos g | Tulos |
| --- | --- | ---: | --- |
| rahkapiirakka-vhh |150g /8 |0,975 |Yksi kokonainen uusi A-syöte valmisteltu |
| vhh-runebergintortut |120g /6 |1,04 |Yksittäinen raja estää edelleen |
| vhh-lihapiirakka |200g /8 |1,3 |Yksittäinen raja estää edelleen |
| keto-korvapuustit |200g /8 |1,3 |Yksittäinen raja estää edelleen |

Muita määriä tai annoskokoja ei muutettu rajan läpäisemiseksi.
[Perhekohtainen vertailu](native-point-followup/family-gate-results.csv)
ei ole neljä uutta GK-tulosta.

Samalla tehdyn natiivikenttätarkistuksen hyödylliset rajaukset säilyvät
[yhteisessä yhdeksän rivin MEXT-poiminnassa](native-point-followup/mext-native-observations.json):
kuivan seesamin05017:n0,9 täsmää myös nykyisen Fineli385:n julkaistuun
pisteeseen, mutta tämä ei todista riippumatonta mittausaineistoa tai avaa
muiden ainesosien esteitä. Paahdettu05018 ja kuorittu05019 ovat eri muotoja.
Mantelin maustettua paistettua05002:ta ei siirretä raakajauhoon; paahdetun
05040:n(5,6) hylätään tavallisena pisteenä. Tempeh04063 ja tamari17009
ovat massasummaltaan tuntemattomia, eivät nollia. Niiden by-difference-
kenttiä tai muun soijakastikkeen1,6:ta ei käytetä puuttuvan pisteen tilalla.

## Nykytila ja seuraava päätös

Yksi yhteinen [päätösmatriisi](current-decision-matrix.csv) sisältää nyt70
reseptiä:35 aritmeettista ehdotusta ja35 muuta HOLD-riippuvuutta. Näistä
aritmeettisista ehdotuksista23 on jo hyväksytty eri vaiheissa ja12 on ilman
hyväksyttyä versiota, mukaan lukien kuusi ennallaan olevaa valmisruoka-HOLDia.
Tässä ajossa valmisteltu versio ei vielä kuulu hyväksyttyihin.

Tuotanto nousi tämän tutkimuksen aikana PR183:n ulkopuolisessa julkaisussa172/326:een (52,76%); tavoitteeseen261 puuttuu89. Alkuperäisohjeiden luku säilyy156:ssa.23 hyväksytystä versiosta16 on nyt julkaistu ja7 odottaa muualla. Näiden seitsemän myöhemmän julkaisun jälkeen luku olisi179/326. Vasta tämänkin version erillisen hyväksynnän,
integraation ja julkaisun jälkeen ehdollinen luku olisi180/326 (55,21%);
tavoitteeseen261 puuttuisi81.30 lähdekelpoisen ehdokkaan tavoitetta ei ole
osoitettu:35:n koonnista kuusi valmisruokamallia pysyy lähde-HOLDissa, ja
myös muiden hyväksymättömien versioiden kelpuutus on avoin.

Seuraava konkreettinen päätös on tämän tarkan lähde- ja sisältöversion
katselmointi. Se ei hyväksy mantelin GI-oletusta, muita MEXT-rivejä,
rahkapiirakan kaupallisia mantelijauhoversioita tai B-poisjättöprofiilia.
Codex Julkaisu vastaa mahdollisesta myöhemmästä integraatiosta.

## Luovutus ja tarpeelliset tarkistukset

[Paketti](native-point-followup/manifest.json) sisältää yhden lähdekatalogin,
uuden syötteen, rajatun MEXT-poiminnan sekä moottorin ja riippumattoman
Decimal-laskennan. Syötehash on
`4194712a2cecb7979c779f4479a1f0a92bf402e190c4ff66a2369667455acbd4`.
Lopullinen commit ja puhdas työpuu varmennetaan luovutusviestissä.

`evaluate-native-points.mts ROOT DATA_DIR EXTERNAL_OUT` käyttää asennettua
tsx-ajuria ja nykyistä puhdasta A-moottoria. `audit-native-points.py`
samoilla argumenteilla tarkistaa tuloksen Decimalilla ja rakentaa neljän
alkuperäisen määrän vertailun. Molemmat kirjoittavat vain Gitin ulkopuolelle.
`extract-native-records.py SOURCE_DIR EXTERNAL_OUT` lukee hash-sidotut
alkuperäiset MEXT-työkirjat openpyxlillä.

Tarkistukset kattavat lähde- ja reseptihashit, kentän ja yksikön,
raaka/paistettu/maustettu-eron, puuttuvien ja sulkeistettujen kenttien
hylkäyksen, alkuperäiset määrät ja annokset, erillisen vaniljapäätöksen,
fysikaalisen massarajan, riippumattoman aritmetiikan, vanhan lähdepisteen
edelleen epäonnistuvan rajan ja nykyisten hyväksyntöjen säilymisen.
Ei sivustobuildia,326-resepti-regressiota, uutta PR:ää, manuaalista
Actions-ajoa, toisen haaran muutosta, mergeä tai deployta.

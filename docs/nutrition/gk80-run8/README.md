# AJO 8 — 18 tapauksen katselmointi ja 11 ehdokkaan julkaisu-Draft

Omistajan sisältö- ja menetelmäpäätös puuttuu. Ehdokkaat eivät ole tuotantolukuja.
Alkuperäinen [tavoitepäätös](target-decision.md) tehtiin ennen integraatiota:
minimum 10, primary 11, stretch 13. Tavoitteita ei muutettu toteutuksen mukaan.

Varmennettu tuotantolähtötila on 119/326 (36,50 %), 207 keskeneräistä.
Main-pohja ed5e3a67046cff3b1fd56acf4cb214a0fe3813ad:
[onnistunut main-CI ja deploy](https://github.com/ozirix-dev/Reseptit/actions/runs/41292997883),
[tuotannon menetelmäsivu](https://ozirix-dev.github.io/Reseptit/glykeeminen-kuorma/).
Tutkimuslähde on f3777a8c423f4cb49eb67b0f2aca318aaebb7531.
Historiallista tutkimushaaraa ei yhdistetä tähän main-pohjaiseen haaraan.

## Koko erän päätösmatriisi

[Alkuperäinen 18 reseptin seulonta](screening.json) sisältää kymmenen
tarkistuskohtaa jokaiseen reseptiin. Alkuperäiset luokat ovat A 9, B 2, C 2, D 5.
11 A/B-tapausta valmistellaan. Kaksi C- ja viisi D-tapausta jäävät HOLDiin.
Rajattu ensisijaisten lähteiden tarkistus ei löytänyt täydellistä kuivattua
meiramia: nykyisessä Fineli-viitteessä ei ole vastaavaa täydellistä tietuetta,
ja AFCD:n F010451 on tuore, ei kuivattu meirami. Sitä ei vaihdeta kuivattuun
meiramiin tai käytetä kuiva-aineen proxyna. Stretch 13 jää NOT REACHED.

| Tavoite | Lukittu määrä | Toteutettavat ehdokkaat | Tulos |
| --- | ---: | ---: | --- |
| Minimum | 10 | 11 | PASS |
| Primary | 11 | 11 | PASS |
| Stretch | 13 | 11 | NOT REACHED |

## Hyväksyttäväksi tuotavat täsmälliset versiot

Makrot grammoina annosta kohden. Kokonais-CHO sisältää kuidun ja polyolit.
GK on pyöristämätön malliluku; käyttöliittymä näyttää likiarvon.
Kaikki 11 ovat LOW-luottamustasolla. Pieniä imeytyviä CHO-osuuksia ei jätetä pois.

| Versio | Annokset | Netto-CHO | Kokonais-CHO | Proteiini | Rasva | GK |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Tortilla de patatas – esikeitetyn perunan versio | 4 | 24.21 | 26.5 | 13.41 | 24.69 | 15.756875 |
| Tabbouleh-tyylinen lämmin salaatti keitetystä bulgurista | 4 | 11.34 | 13.99 | 2.54 | 14.11 | 6.5871875 |
| Munakoiso-jauhelihavuoka – punnittu versio | 4 | 8.92 | 13.41 | 35.81 | 32.37 | 3.58525 |
| Parsakaali-sinihomejuustofrittata – punnittu versio | 4 | 2.64 | 4.0 | 17.97 | 33.22 | 0.965025 |
| Italialainen jauheliha-kesäkurpitsapata – punnittu versio | 4 | 5.89 | 9.09 | 32.14 | 32.59 | 2.37995 |
| Pehmeä raejuusto-uunimunakas – punnittu versio | 4 | 3.42 | 3.48 | 26.99 | 24.11 | 1.118275 |
| Uunilohi smetanakuorrutteella – mustapippuriversio | 4 | 2.04 | 3.05 | 36.62 | 47.92 | 0.754875 |
| Aamiaisquesadilla sienillä ja maissilla – punnittu versio | 2 | 32.94 | 35.5 | 11.21 | 20.32 | 17.13059 |
| Koshari – kuorruttamattoman sipulin versio | 4 | 92.47 | 99.7 | 22.24 | 12.01 | 48.48915 |
| Yangzhou-tyylinen paistettu riisi – kuumasta jasmiiniriisistä | 4 | 37.77 | 39.88 | 21.2 | 10.98 | 25.082095 |
| Lohikeitto kuohukermalla – fonditon vesiversio | 4 | 17.43 | 19.64 | 23.29 | 38.62 | 10.457325 |

Yhteensä 11 tarkoituksellista lisäystä: ehdokaskattavuus 130/326 (39,88 %),
196 keskeneräistä. 315 täyttä GK-tulosobjektia varmennettiin säilyneiksi täsmälleen
mainin mukaisina, mukaan lukien kaikki 119 aiempaa numeerista tulosta,
Q09-korjaukset sekä PR #150:n kahdeksan ja PR #151:n viisi tulosta.
Teehaudutettujen munien kokonaislukua ei palauteta.

## Seitsemän tämän ajon HOLD-päätöstä

| Resepti-ID | Alkuperäinen luokka | Ratkaisematon polyolitieto |
| --- | --- | --- |
| jauheliha-kaalikeitto-vhh | C | U170928-r5 |
| jauhelihapihvit-vhh-kermakastikkeella | D | maille-label-proxy |
| vhh-kaalilaatikko | C | U170928-r5 |
| ropa-vieja | D | U170917-r5 |
| siskonmakkarakeitto-juurekset | D | U170917-r5 |
| kana-parmesaanipannu-parsakaali | D | afcd-F006618-checked, chicken-label-proxy |
| kermainen-kanasienipannu | D | afcd-F006618-checked, afcd-F010466-checked, chicken-label-proxy, maille-label-proxy |

Puuttuvaa polyolimäärää ei oleteta nollaksi. USDA:n total-minus-fibre ei osoita
polyolimäärää. Liemen ja Dijon-etiketin pyöristetyt CHO- ja sokeriluvut eivät
osoita polyoleja nollaksi. Kanapannujen pippurin ja timjamin AFCD-lähde on
ratkaistavissa, mutta se ei poista liemi- ja Dijon-tuotteiden itsenäistä estettä.
Laakerinlehteä tai meiramia ei poisteta reseptistä numeron saamiseksi.
Näiden seitsemän elävät reseptit ja käännökset säilyvät muuttumattomina.

Jerk-kana, pav bhaji, palak paneer ja nakkikeitto kukkakaalilla pysyvät aiemmissa
HOLDeissa. Niiden aiempia osasummia tai tutkimuslukuja ei hyväksytä.
Yleinen ravintomalli, GK-moottori ja ruokaperhesuoja säilyvät ennallaan.

## Olennaiset sisältö- ja menetelmäpäätökset

- Tortilla de patatas: 600 g raakaa kuorittua perunaa esikeitetään ja valutetaan;
  67,5 g oliiviöljyä syödään kokonaan. GI 66 on rajattu keitetyn perunan analogia.
  Ei pitkää öljykypsennystä. Eri ID kuin julkaistu Tortilla española -aamiainen.
- Tabbouleh: lämmin keitetyn bulgurin versio, 50 g kuivaa bulguria ja 100 g vettä,
  15 min keitto. GI 64,5 ei koske kylmässä liotettua tabboulehia.
- Munakoisovuoka: 17 % naudan jauheliha ja puolikovan juuston koostumusvertailu;
  ei lisäöljyä. Frittatassa 38 % kerma ja nimetty yleinen sinihomejuustoproxy.
- Italian pata: nimetty pannulla kypsennettävä kesäkurpitsaversio, ei alkuperäinen
  uunivalmistus. Ei tavallista pastaa, öljyä 12 g, valkosipulia 3,5 g.
  60 min on suuntaa-antava arvio tälle versiolle; vanhaa 25/20/15-minuunijakoa
  ei siirretä pannuversioon. Valmistustapa ja hakutunnisteet vastaavat pannua.
- Raejuustomunakas: 550 g kuoretonta munaa, 15 % ruokakerma, 2 % raejuusto
  ja kaikki 5 g vuoan voita. Ei määrältään avoimia rasva- tai maustelisäyksiä.
- Uunilohi: mustapippuri valkopippurin sijasta; smetanan AFCD-koostumusproxy
  sisältää 36,3 % rasvaa. Ei väitettä toisen rasvapitoisuuden tuotekohtaisuudesta.
  Sitruunan 65 g on kuoritun hedelmälihan ja kaiken mehun paino.
- Quesadilla: valmis maissitortilla 100 g (GI 59,2 -analogia), ei vehnätortilla
  tai raakajauho. Maissinjyvät kypsennetään mikrossa; lyhyt pannulla viimeistely.
  Kaikki 13,5 g öljyä kulutetaan; ei friteerausta.
- Koshari: kuorruttamaton sipuli, ei alkuperäistä maissitärkkelystä. Valkosipuli
  7 g. Linssit 200 g, jasmiiniriisi 200 g ja makaroni 150 g ovat kuivia painoja.
  Linssin 32, kuuman jasmiiniriisin 68 ja pastan 49 ovat nimetyt LOW-vastineet.
  Kaikki 40,5 g oliiviöljyä syödään. Korkeaa GK-arviota ei häivytetä.
- Yangzhou: 600 g juuri keitettyä kuumaa jasmiiniriisiä on kypsäpaino;
  öljyä 27,4 g. Kuuman keitetyn riisin GI 68 on pannulla viimeistelyn analogia.
  Ei jäähdytys- tai rasvahyvitystä. Finelin ruokaöljykeskiarvoa ei väitetä
  tarkaksi rypsiöljytuotteeksi; kinkku käyttää yleistä 3 % koostumusta.
- Lohikeitto: fonditon 800 g vesiversio ja 360 g raakaa kuorittua perunaa;
  kaikki jauhettu mustapippuri syödään. GI 66 on LOW-analogia.
  Luokkarajan herkkyys kuvataan alla.

GI 40/30/50 ovat aiemmin rajattuja nimettyjä projektisovelluksia.
Tässä ei luoda uutta yleistä sääntöä tai tuotevaihdosten yleislupaa.
Kuvat ovat kuvitusta; luetteloimattomat lisukkeet eivät kuulu laskelmaan.
Raakojen/kuivien ainesten koostumus on nimetyn kypsennetyn version proxy;
mittaamattomia kypsennys- tai liukenemishävikkejä ei vähennetä.
Keitinvesi käsitellään reseptiohjeen mukaan.

## Lohikeiton luokkaraja

Perunan GI-valinnan laskennallinen vaikutus on:
GK = 1.250325 + 0.139500 × perunan GI.
GI 66 antaa 10,457325. Raja GK 10 ylittyy jo GI-arvolla noin 62.7217.
Tämä on laskennallinen herkkyyskohta, ei uusi vaihtoehtoinen tutkimustulos
eikä biologinen epävarmuusväli. Arvion matala luottamus ja rajaus näkyvät reseptissä.

## Varmennus ja resurssirajaus

[Julkaisupaketti](../gk80-release-7/) sisältää manifestin, tarkat syötteet,
lähteet ja niiden hashit, neljä makroa, riippumattoman Decimal-goldenin,
main-baselinen sekä seitsemän alkuperäistä HOLD-pakettia.
48 koostumusta tarkistettiin ensisijaisista aineistoista: 16 AFCD-per-100-g-tietuetta
ja 32 Fineli-tietuetta, mukaan lukien polyolit.
Mikään lukittu aiempi julkaisupaketti 1–6 ei muutu.

30 olemassa olevaa EN/SV/TH-käännöstä vastaa kymmenen FI-version määriä,
makroja ja valmistusta. Quesadilla on FI-only. Ihmistarkistus on edelleen pending:
[käännösten lähdevertailu](../../reports/2026-11-01-gk80-run8-translation-review.md).

Suunnitelma: yksi paikallinen kokonaisbuild ja yksi lopullinen Reseptit PR-CI,
ei manuaalisia Actions-ajoja. Nopeat sisältö-, lähde-, Decimal- ja regressiotarkistukset
tehdään ensin. Kehityksen aikana korjattiin lähdeprovenienssin päivämäärä,
desimaalipilkkujen välilyönnit, valmistustapametadata sekä vanhaan versioon sidotut
testiodotukset. Yksi testiryhmä käynnistyi ennen generoitujen tiedostojen valmistumista;
sen puuttuvat fixturet eivät olleet reseptivirhe, ja riippuvuuden valmistuminen
odotettiin ennen uusintaa. Toteutuneet tulokset: [verification.json](verification.json). Yksi kokonaisbuild, 691 reittiä PASS; 201 yksikkötestiä ja 25 staattista testiä PASS; 11 riippumatonta Decimal-laskelmaa ja neljä makroa PASS. Brave: 14 sivua, kaikki 11 FI-versiota ja EN/SV/TH-otos, makrot, LOW, lähdelinkit, positiivinen alle yhden esitys sekä 11 HOLDia ja tee, ei JavaScript-virheitä. Käännösten kohdistettu auditointi: 30 vastinetta, 0 virhettä. Lopullisen HEADin GitHub CI varmennetaan PR:n avaamisen jälkeen; sen tulos linkitetään handoffiin.

## 80 prosentin eteneminen ja päätös

[326-ID-inventaario](inventory.json): tuotanto 119, tämä Draft 11, HOLD 11,
muut ehdolliset mutta tässä ajossa seulomattomat tutkimusarviot 22,
ilman riittävää muuta nykyistä laskentapohjaa 163.
119 + 11 + 11 + 22 + 163 = 326, ei päällekkäisyyksiä.
261 reseptin tavoitteesta puuttuu tuotannossa 142 ja tämän ehdokkaan jälkeen 131.
Muut 22 eivät ole automaattisesti julkaistavia tai omistajan hyväksymiä.

Suositus: omistaja käsittelee kaikki 11 täsmällistä versiota, neljä makroa,
rajatut GI-/koostumusproxyt ja LOW-merkinnät yhtenä päätöksenä, pitäen seitsemän
uutta ja neljä aiempaa HOLDia erillään. Ready-siirtymä, merge ja deploy tarvitsevat
erilliset luvat. Ei uutta tutkimusajoa tai seuraavaa julkaisuerää tässä tehtävässä.

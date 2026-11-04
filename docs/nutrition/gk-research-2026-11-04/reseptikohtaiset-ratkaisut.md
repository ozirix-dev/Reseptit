# GK100 — todellisten reseptitapausten ratkaisu- ja katselmointikortit

**Tila: havaintoja ja toimenpide-ehdotuksia, ei reseptimuutoksia.** Tämän tutkimuksen lähtöaineisto on main `b96ba0b`, PR #253 ja arkistolaskentapaketit. Tämän dokumentin laskelmat eivät muuta hyväksyttyä julkaisuvarianttia tai ehdokas-SHA:ta.

## Priorisointiperiaate

Järjestä reseptit seuraavasti: (1) virheellinen tai ristiriitainen **syöty määrä**, (2) olennaisin avoin hiilihydraattiosuus, (3) korkean vaikutuksen valmistus-/GI-vastine, (4) epävarmuuden läpinäkyvyys ja (5) vain pienet mausteosuudet. Yksittäinen resepti ei pysäytä erän muita reseptejä. Käytettävän lähteen soveltuvuus hyväksytään erikseen, mutta kerran hyväksyttyä valmistusrajoitettua sidosta ei tutkita joka kerta alusta.

## A. Masala dosa — jo ratkaistu hyväksytyssä täsmäversiossa

- Lähde: [IFCT-korjattu ehdokas](https://github.com/ozirix-dev/Reseptit/blob/b96ba0b0dfe8f859736f9db63be982021ca7a63d/docs/nutrition/gk100-masala-dosa-ifct-release-candidate.json).
- Neljä annosta; peruna 500 g keitettyä valutettua perunaa, mitattu perunavertailu GI 66. Matvaretabellenin kaksi soveltuvaa koostumusta: 13,0 ja 19,9 g CHO / 100 g. Perunan GK/annos = (500/4) × 13,0/100 × 0,66 = **10,725** tai vastaavasti **16,4175**.
- Täsmäversion koko laskennallinen väli **57,8025–63,495 GK/annos**. Mausteiden poisjättö 0,45475 g CHO/annos mainitaan.
- Taikinan riisi–urad-dosa GI 76 kohdistuu taikinaan kerran. Chutney ja sambar ovat erillisiä lisukkeita.
- **Tehtävä:** siirrä jo hyväksytty perunan koostumus- ja keitto-/valutusvastine kuratoituun yhteiseen hakukerrokseen; älä tee uutta saman perunan estelaskelmaa äläkä oleta yleistä lupaa kaikille perunatuotteille. Jos lähteen uudelleenkäyttö tarvitsee uuden soveltuvuuspäätöksen, käsittele se tiedonhallintavaiheessa.

## B. Uunimuna-avokadot — reseptitekstin sisäinen määräongelma

- [Julkinen alkuperäisohje](https://github.com/ozirix-dev/Reseptit/blob/b96ba0b0dfe8f859736f9db63be982021ca7a63d/reseptit/aamupalat/uunimuna-avokadot.md) ilmoittaa 200 g avokadon hedelmälihaa ja 200 g kuoretonta kananmunaa kahdelle.
- Hyväksytyn punnitun version [laskettu GK](https://github.com/ozirix-dev/Reseptit/blob/b96ba0b0dfe8f859736f9db63be982021ca7a63d/docs/nutrition/gk80-release-4/golden.json) on **0,61347 GK/annos**, avokadon koodiosa 0,385 GK/annos (laskentakoodi, ei ihmis-GI).
- Ohje sallii valkuaisen jäämisen kuoppaan mahtumattomana pois, vaikka laskenta edellyttää kaikkien punnittujen ainesten syömistä.
- **Ehdotusteksti katselmointiin:** “Jaa punnittu kananmuna avokadonpuolikkaisiin. Kypsennä kuoppiin mahtumaton muna ja koverrettu avokadonliha pienessä uunivuoassa. Tarjoa kaikki punnitut ainekset ja jaa ne kahteen annokseen.”
- Vaihtoehto: laske todellisuudessa syöty punnittu muna ja hedelmäliha ja muodosta uusi reseptiversio.
- **Toteutusportti:** vasta kun sisältö- ja käännöslaadun omistaja hyväksyy muutoksen. Nelikieliset muutokset ja lähdehashit eivät saa vanhentua vahingossa. PR #262 ja #263:n kanssa yhteensovitus tarkistettava ennen sisällön kirjoitusta.

## C. Vesipohjainen okayu — Mixed Evidence -reitin kontrolli

- Kahden annoksen hyväksytyssä versiossa kokonaispiste **36,7676 GK/annos**, josta mitattu ihmis-GI-osuus 36,5375 ja nimettyjen koodien osuus 0,2301 eli noin 0,63 %. Poisjättö 0 g.
- Mainin Mixed Evidence -reitti vaati myös positiivisen poisjätön, mistä aiheutuu tarpeeton tekninen este.
- **#253 ehdottaa** sallimaan nollapoisjättöisen reitin ja sisällyttää version katselmointiverrokiksi. Tämä koskee katselmointiin siirtymistä, ei toista julkaisua.
- **Tehtävä:** älä tee omaa muutosta samaan Approval Factory -koodiin. Arvioi #253 ja sen jälkeen #254 ennen kuin V2-menetelmä käyttää uutta reittiä.

## D. Lontong sayur — olennaiset avoimet osuudet

- PR #247:n ja #253:n tapaus: riisikakun 14,062 GK/annos, aiempaan tofuennakkotapaukseen ehdollisesti nojaava koodiosuus 0,450 -> **14,512 GK tunnettu/ehdollinen osapiste**.
- Avoin CHO annosta kohti: **kookosmaito 3,40 g, haudutettu kaali 4,97 g, Aneto-liemi 0,70 g**, yhteensä **9,07 g**.
- GI 0–100 -herkkyys oletuslaskelmalle: 14,512–23,582 GK. Tämä ei ole biologinen eikä julkaistava yläraja: yksittäinen GI voi ylittää 100, osa koostumus- ja valmistusrajoista vielä auki.
- **Kookosmaito:** tarkista nimetty Blue Dragon -versio ja soveltuva laskentakoodi tai tuotetutkimus; kookosmaitoa sisältävän riisipuuron GI:tä ei saa antaa suoraan purkkikookosmaidolle.
- **Kaali:** erota raaka-/haudutettu paino, hylätyt lehdet, syöty liemi ja hiilihydraattien siirtymä. Valmistukseen soveltuva GI-peruste / koodi arvioidaan erikseen. Sama CHO syödystä kaalista ja liemestä ei saa tulla kahdesti.
- **Liemi:** nimeä Aneto-tuote; 0,70 g CHO/annos ylittää nykyisen 0,50 GK:n poisjättöseulan. Tarvitaan käsitelty GI-/koodisoveltuvuus tai selkeä reseptiin ehdotettu vaihtoehto, ei GI 0 -arvaus.
- **Tehtävä:** kolmelle riville omat lähde- ja valmistusperustellut sidospäätökset; vasta tämän jälkeen kokonainen skenaario/alkuperäinen resepti. #247:n erillistä selvitystä ei muokata toisen PR:n kautta.

## E. Ojja — korkea koodauksen herkkyys, ei harissatutkimus ensin

- Arkiston piste 12,4821625 GK, josta leivän verrokki 9,4824 ja koodatut osuudet noin 3,00. Harissa 0,0825 g CHO/annos on pieni poisjättö.
- GI100-skenaarion **+4,4703625 GK (+35,81 %)** osoittaa, että leivän koostumus/fermentointi ja haudutetun kastikkeen koodisoveltuvuus ovat tärkeimmät tutkimuskohteet.
- **Tehtävä:** yksilöi todellinen leipätuote/valmistus ja kastikkeen hiilihydraatti- sekä GI-sidokset ennen kuin lasket uutta kokonaistulosta. Älä merkitse GI100-kokeen muuttamaa arvoa mitatuksi skenaarioksi.

## F. Besan-chilla ja pinaatti-paneer-chilla

- Dokumentoidut alkuperäiset väliarvot: **9,4698–11,1288** ja **9,1305–10,7895 GK/annos**; nykyiset ulospäin pyöristetyt näytöt 9–12 ja 9–11. [B-versioiden aineisto](https://github.com/ozirix-dev/Reseptit/blob/b96ba0b0dfe8f859736f9db63be982021ca7a63d/docs/nutrition/gk80-four-approved-b/README.md).
- Batra-tutkimus kuvaa valmistettua kokonaisesta kikherneestä tehtyä lettua, ei raakajauhon yleistä GI:tä. Reseptin tarkat määrät, pannukypsennys ja paneer-/pinaattilisäykset ovat sidottuja.
- **Tehtävä:** säilytä nykyiset julkaistut versiot; harkitse ohjetekstin täsmennyksiä erillisessä sisältö-PR:ssä ja käytä GI-vastinetta vain valmistusrajan sisällä.

## G. Ketomutakakku, makeutettu suklaa, keto-keksit

- Keton mutakakun raportissa **0,07 GK on laskettu osuus**, ei koko kakun GK. Laskelman ulkopuolella on 1,3774 g CHO/annos. [Nykyinen raportti](https://github.com/ozirix-dev/Reseptit/blob/b96ba0b0dfe8f859736f9db63be982021ca7a63d/docs/reports/2026-11-02-keto-mutakakku-chocolate-fi.md).
- Tuote-etiketti ja koostumusversio ratkaistaan ensin. Maltitolia, erytritolia ja muita polyoleja ei käsitellä yhtenä yleisenä GI 0 -ryhmänä. 60 % kaakaopitoisuus ei ole sama asia kuin sen hiilihydraattiosuuden GI.
- **Tehtävä:** tarkat nimetyt suklaat ja makeutusaineiden lajikohtainen malli; julkaistu GK-only osatulosteksti pysyy ennallaan siihen asti. PR #256:n thaikielinen esitystyö ja suklaavertailu eivät ole tämän metodidokumentin muutosalue.

## H. Samanaikaiset esteet, joita ei ratkaista yleisellä ruoka-GI:llä

| Reseptiperhe | Yhteinen ratkaisu |
| --- | --- |
| Bammy ja maniokkivalmisteet | Valmistettu kassavaleipä ja turvallisuus-/kypsennysrajaus; ei pelkkä raakakasvin GI |
| Dal makhani | Uradin liotus, keitto, murskaus, kypsennysneste; GI-vastine valmistettuun osaan |
| Roujiamo | Kohotettu pannuleipä eikä pannulettu vain nimen samankaltaisuudella |
| Marjainen chiavanukas | Nimetty jogurtti/marjatuote ja absoluuttisen/suhteellisen poisjättövaikutuksen arvio |
| Bánh xèo | Idun kypsä ja valutettu syötävä massa; #255:n 0,44 g CHO -havainto katselmointiin |
| Miso-/liemiruoat | Syödyn osan massatase; kastikkeen liemesiirtymä ei ole automaattinen 100 % tai 0 % |

## Reseptikorjausten hyväksyntäkäytäntö

Jokaisesta ehdotuksesta: 1) nykyinen ja ehdotettu FI-teksti, 2) jokaisen ainesosan laskentamäärä ja syöty osuus, 3) tarvittavat EN/SV/TH-käännökset, 4) ravintoarvo- ja GK-laskennan vaikutus, 5) hyväksynnän ja lähteiden tarkisteet. Muutos, joka tekee vanhasta täsmäversion hashista virheellisen, edellyttää normaalia uutta katselmointia. Pelkkä tutkimusraportin linkittäminen ei ole sisältöpäätös.

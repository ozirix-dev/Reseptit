# Codex1: luovutus, 17 erillistä ehdollista GK-versiota

Julkaistuna **179/326 (54,9%)**, tavoitteeseen261 puuttuu **82**. Alkuperäisen tutkimusajon lähtö oli156/326. Main on nyt `554f8a414782497da89640c8e45be1ccf1580a95`; PR186 lisäsi vain eristetyn suklaasenaariopilotin, ei julkaistuja reseptiarvoja. Tuotantosivun sisältö on sama kuin179-arvoisessa tarkistuksessa. Avoin Draft187 on erillinen hyväksyntäportti; sen tai muiden haarojen ehdotuksia ei lasketa julkaistuiksi.

Oma yhteistulos on **13 täydellistä A-tutkimusversiota ja4 valmistetun ruoan B-lähdeskenaariota, yhteensä17 eri resepti-ID:tä**. A tarkoittaa tässä laskentarakennetta, ei lähde- tai julkaisuhyväksyntää. Heti hyväksyttyjä uusia kokonaisia GK-arvoja **0**. Kaikki17 ovat edelleen ehdollisia. Codex2:n varattuihin tiedostoihin tai resepteihin ei tehty muutoksia.

## Kolme valittua ja käytettyä reittiä

1. **Natiivi raaka-ainekohtainen laskenta ja lähteistetty pieni poisjättö.** Fineli CHOAVL, AFCD ilman sokerialkoholeja ja rajatut IFCT/MEXT-tietueet pidetään erillään GI-näytöstä. Esimerkiksi poha, pav bhaji, kongjuk ja tämän paketin lenkkimakkaraversio. Jokainen positiivinen GI:tön osuus on<1g/annos ja yhteensä<2g; tuntematon määrä tai koostumus jää HOLDiin.
2. **Ihmisillä mitatun valmistetun komponentin analogia.** Perunaparatha78,8; samosa60,4; valmistettu täyttämätön paratha31,8/53. Sovellus koko määriteltyyn komponenttiin kerran, jogurtti tai soijakastike erikseen. Jauholle ei johdeta GI:tä. Näyttö on ehdollista ruokalaji-, taikina- ja valmistuserojen vuoksi. Katso [valmistetut lähdekortit](../paratha-component-routes/prepared-source-cards.json) ja [Oman/samosa-paketti](../almond-reuse-and-oman/CURRENT.md).
3. **Julkaistu, erikseen rajattu ruokaryhmäimputointi.** Mantelipiirakoissa sovellettiin vaihtoehtoista maidon30/kasvisten40 profiilia, granolassa ja pellavapuurossa kanelin50-profiilia. Tämä on esitetty menetelmäehdotuksena, ei uutena mitattuna GI:nä tai yleisenä oletuksena. Nykyisiä tuotantosääntöjä ei muutettu. [Menetelmä ja molemmat piirakkaprofiilit](../almond-reuse-and-oman/CURRENT.md).

Tavanomaiset kansainväliset GI-haut,33 reseptin yhteisen jauhoesteen reseptiseulonta ja aiemmat estekartat on käytetty uudelleen. Kun suoraa vastinetta ei löytynyt, työ siirtyi yllä oleviin rajattuihin reseptiversioihin. Raakajauhon, kokonaisen pähkinän ja valmistetun ruoan GI:tä ei sekoitettu.

## Uusi tämän paketin avaus: uunimakkara sipulipeitteellä

[Makutilan Tammelan lenkki](https://makutila.fi/tuote/tammelan-lenkki-2/) on nimenomaan lenkkimakkara, jonka valmistaja ilmoittaa **0,3g hiilihydraattia/100g**. Myös valmistajan yhteisvalikoima toistaa arvon. Tämä on koostumustieto, **ei mitattu GI**. Reseptin500g säilyy: positiivinen nimellinen CHO-varaus on0,375g/annos. Sokerialkoholeja ei ole vahvistettu nollaksi. Merkintä toimii tässä lähdemallin nimellisenä ylävarauksena; se ei ole analyysitoleranssit sisältävä enimmäisarvo.

Ehdotettu neljän annoksen versio sisältää kaikki8 alkuperäistä riviä: Tammelan lenkki500g, tavallisesta34% cheddarista itse raastettu juusto100g, kuorittu keltasipuli55g, Maille Dijon Original865g DK31,5g, maustamaton28% ranskankerma100g, voi14g, paprika2,65g ja **uusi punnittava mustapippurimäärä0,5g**. Tämä on uusi täsmäversio, ei väite aiemmin punnitusta erästä. Valmistus pysyy uunissa200°C20–25min; koko reseptin hiilihydraatit säilytetään.

Sipulille käytetään olemassa olevaa, laajaa ja LOW-tasoista kasvisryhmän GI66-proxyä. Muiden7 rivin positiivinen poisjättö on yhteensä **1,6284125g/annos**, jokainen erikseen<1g. Laskettu **GK0,4356/annos**, loppukäyttäjälle ehdotettu muoto **”alle5”**. Reseptin tai makkaran GI:tä ei väitetä mitatuksi. Tavallisen määrittelemättömän lenkin GK jää edelleen ratkaisematta.

Rajoitukset: sipuliproxy ei kuvaa tarkkaa seka-ateriaa; valmistajan makkarasivun rasvateksti16% ja ravintoarvon19g ovat keskenään ristiriidassa, vaikka CHO0,3 toistuu samana. Tämä ei anna lupaa julkaista uusia makroravintoarvoja. Maille-merkintä ja AUSNUT-pohjaiset grammaspesifikaatiot ovat aiemmista lähdepaketeista; määrittelemätön Dijon tai pippuri ei peri niitä. Ehdotettu tuote-, lähde- ja sisältöversio vaatii katselmoinnin.

Mallin laskenta ja riippumaton Decimal-tarkistus täsmäävät;6 kielteistä kontrollia estää tuntemattoman makkaran/sinapin, toisen lenkin2,125g osuuden, tuntemattoman pippurin, poisjättösumman2,2884g sekä tarkan1g rajan. Valmistajan Härkätien lenkin1,7g/100g ei anneta periä Tammelan poikkeusta. Mahdollinen oletusherkkyys GI0–150 pois jätetyille osuuksille antaa0,4356–2,87821875; **0–150 on oletus, ei fysiologinen raja**, eikä tätä väliä ehdoteta luottamusväliksi.

## Kaikki17 eri ID:tä, ilman kaksoislaskentaa

| Tutkimusversio | Laskettu GK/annos tai lähdeskenaario | Paketti |
|---|---:|---|
| siemengranola-jogurtilla |2,47170625|[followup](../followup/CURRENT.md)|
| pellava-puuro-pahkinoilla |0,21453125|[followup](../followup/CURRENT.md)|
| lahi-ita-pistaasijogurtti |4,3665|[breakfast](../breakfast-versions/CURRENT.md)|
| korealainen-kongjuk-soijapapu-riisipuuro |29,0915|[stock](../stock-and-current-bindings/CURRENT.md)|
| paella-valenciana |40,01949|[stock](../stock-and-current-bindings/CURRENT.md)|
| falafel |9,86|[sauces](../sauces-and-legumes/CURRENT.md)|
| okonomiyaki-kaaliletut |3,5079|[sauces](../sauces-and-legumes/CURRENT.md)|
| hunaja-sinappikana-kaalilla |7,1423|[fixed-input](../pancake-source-and-fixed-input/CURRENT.md)|
| indialainen-poha-maapahkinoilla |28,327975|[poha](../poha-and-main179/CURRENT.md)|
| pav-bhaji |42,2723825|[spices](../spices-and-native-miso/CURRENT.md)|
| vhh-omenapiirakka |1,49550; vaihtoehtoinen imputointi1,47675|[almond](../almond-reuse-and-oman/CURRENT.md)|
| vhh-raparperipiirakka |1,331250; vaihtoehtoinen imputointi0,85625|[almond](../almond-reuse-and-oman/CURRENT.md)|
| uunimakkara-sipulipedilla |0,4356; alle5|[tämä syöte](proposal.json)|
| samosa (B) |44,460742–44,611742;40–45|[Oman](../almond-reuse-and-oman/CURRENT.md)|
| aloo-paratha (B) |57,07930685–57,47330685;55–60|[paratha](../paratha-component-routes/CURRENT.md)|
| intialainen-aloo-paratha (B) |39,5874897;35–40|[paratha](../paratha-component-routes/CURRENT.md)|
| kiinalainen-kevatsipulipannukakku (B) |11,9838384–19,889064;10–20|[paratha](../paratha-component-routes/CURRENT.md)|

Vaihtoehtoinen imputointiprofiili ei lisää reseptimäärää. Viiden yksikön näyttökaista pyöristetään ulospäin; leveämpää10–20-skenaariota ei pakoteta viiden yksikön väliin. Lähdeskenaariot eivät ole95% luottamusvälejä tai kaiken yksilöllisen vaihtelun kattavia rajoja.

Julkaistu179 ja omat17 eivät leikkaa. Erillinen aiemmin hyväksytty mutta julkaisematon rahkapiirakka-vhh on lisäksi1. **Vasta kaikkien hyväksyntöjen ja myöhemmän julkaisun jälkeen** nämä voisivat tuottaa197/326 eli60,4%; tavoitteesta puuttuisi64. Tämä ei ole valmis julkaisu- tai hyväksyntäerä. Codex2:n uusia ehdokkaita ei lisätä tähän ilman ID-kohtaista tarkistusta.

## Hylätty tai avoin näyttö ja seuraavat5 toimenpidettä

Suoraa ihmis-GI:tä ei edelleenkään löytynyt soveltuvana yleiselle mantelijauholle, misotahnalle, filotaikinaiselle pinaattipiirakalle tai puhtaalle kikhernejauholle. Atkinson2021:n kikhernejauholeivät ovat vehnäsekoitteita: niitä ei siirretä farinataan. Qatarin pinaattifatayer ei ole sama taikina kuin filo-fetapiirakka. Aiempi misomäärä ylittää1g rajan. Näitä ei lasketa avauksiksi.

1. Katselmoi13 A-tutkimusversion täsmälliset lähde- ja sisältösyötteet yhteisessä hyväksyntäportissa. Aloita jo hyväksyttyjä koostumuslähteitä käyttävistä tapauksista. Hyötypotentiaali enintään13 eri reseptiä.
2. Ratkaise4 B-valmisruokaskenaarion valmistus- ja matriisivastaavuus erikseen. Älä hyväksy raakajauhojen yleistä GI-oletusta. Potentiaali enintään4 muuta reseptiä.
3. Sovita hyväksytyt versiot Codex2:n tuoreeseen ID- ja syötehashikohtaiseen jonoon ennen integraatiota; julkaise myöhemmin vain hyväksytyt lähde-/sisältöversiot. Rahkapiirakka on erillinen1, ei vanha8:n jono.
4. Ratkaise yhteinen AFCD/polyolipolitiikka ja rajatut nimettyjen tuotteiden skenaariot nykyisten omistajien kanssa. Suklaalle tehtyPR186 ei ole automaattinen lupa muiden ruokien kokonais-GK-väleille.
5. Kohdista seuraava kansainvälinen ihmisnäyttöhaku jäljellä olevien jauhoruokien täsmällisiin valmistettuihin alaryhmiin. Lopeta nollatuloksen toistaminen saman raaka-aineen geneerisellä nimellä; käytä lähteistettyä paikallista ruokanimeä ja tarkista taikinan koostumus ennen laskentaa.

Ei pushia, Draft-PR:ää, tuotantotiedostojen muutoksia, main-muutoksia tai raskasta CI-ajoa. Luovutus on paikallisessa tutkimushaarassa. [Syöte](proposal.json), [mallitulos](model-results.json), [lähdeaineisto](source-catalog.json), [riippumaton tarkistus](verify_decimal.py), [ID-vertailu](impact-and-coordination.json).

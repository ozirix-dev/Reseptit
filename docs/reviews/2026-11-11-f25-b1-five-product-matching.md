# F25 B1 – viiden FI-lähteen tuote- ja punnituskorjausten esiseulonta (11.11.2026)

Tämä on [issue #447](https://github.com/ozirix-dev/Reseptit/issues/447) -työjonon B1-osio. F25:stä 30/75 käännöstä julkaistu, 45 HOLDissa; näiden viiden FI-reseptin ravintolaskenta puuttuu edelleen. [#444:n julkaisuportissa](https://github.com/ozirix-dev/Reseptit/pull/444) jokaisen `approval:null`. **Ei FI/GK/EN/SV/TH-julkaisua eikä uutta neljän makron hyväksyntää.**

## Chilaquiles – kaksi 100g maissitortillamallia

FI:n 2 annosta: 100g maissitortillaa, 150g salsa verdeä, 2 kananmunaa, 150g queso frescoa ja 1rkl paistoöljyä. Jos käytetään [El Taco Truckin](https://eltacotruck.fi/tuotteet/corn-tortilla) tuotetta, netto-HH 43g/100g ja kuitu jää ilmoittamatta. [Fineli 35554](https://fineli.fi/fineli/fi/elintarvikkeet/35554) ilmoittaa netto-HH 51,845g, kuitu 1,172g/100g. Erotus **4,4225g netto-HH/annos** vain tortillan vaihdosta.

Vertailulaskenta käyttää molemmissa lisäksi [Santa Maria Mexican Salsa Verdeä](https://www.k-ruoka.fi/kauppa/tuote/santa-maria-mexican-salsa-verde-2200g-7311312008046), [Riverina Dairy Fresco -juustoa](https://riverinadairy.com/food-service/fresco/fresco-traditional/) **vain queso frescon tuotekorvikkeena, EI varmistettuna sama tuote**, Fineli kananmunaa 2×55g kuorettomana ja 1rkl öljyä 13,5g täysin kulutettuna. Malleissa netto-HH/P/rasva, g/annos:
- El Taco Truck 31.34 / 22.26 / 32.28
- Fineli 35.76 / 21.36 / 35.81

**Kuitu ja kokonaishiilihydraatti (kuitu mukaan lukien) eivät ole varmennettuja**, ja queso fresco on vasta vertailukorvike. Kumpaakaan tuotejonoa ei hyväksytä julkaisuun. Koko 5:n massalistalla on eri valmistajia vain havainnollistamaan vaihtelua.

## Kimchi-jeon – jopa saman GTIN:n 100g hiilihydraatti vaihtelee

[Suomen Sempio-maahantuojan](https://finefoods.fi/tuotteet/sempio/sempio-kimchi-korealainen-kaalivalmiste-160-120g/) arvossa 2g HH/100g, [Alankomaiden Albert Heijn](https://www.ah.nl/producten/product/wi553406/sempio-kimchi-original) saman GTIN 08801005001267:n arvossa 4,5g/100g ja [Sveitsin Coopin](https://www.coop.ch/en/food/pantry/canned-conserved/vegetables/mixed-vegetables/sempio-kimchi-original/p/7182617) listingissä 7,1g/100g. Jos 150g/2 annosta, kimchin kontribuutio netto-HH: 1,50 / 3,375 / 5,325g eli max **3,825g/annos** vaihtelua. Pakkauserä, EU:n ilmoitetun HH-kentän alkuperä, valutettu paino ja kuitu on varmistettava. Lisäksi 2rkl kevätsipulin grammamassa puuttuu eikä uutta vettä saa lisätä taikinaan ilman reseptiversiopäätöstä. Kimchi voi sisältää soijaa tai kalaa/äyriäisiä, riippuu tuotteesta.

## Muut kolme B1

- **Paputostada:** 150g mustia papuja vaatii *keitetty/säilyke/kuiva* -määritelmän; yksi avokado on grammoina punnitsematon, 100g maissitortillan tuotemerkki, kaksi munaa, 1rkl öljyä. Kuivia papuja ei saa käyttää ilman kypsennystä.
- **Karibian plantain-lautanen:** ruokabanaanin ja avokadon kuoritut syötävät grammamassat, limemehu ja öljyn kulutettu osuus; kahden munan syötävä massa. Koko ruoka ei ole yhden geneerisen pakkaustuotteen analogia.
- **Munakoiso-kesäkurpitsalasagne:** alkuperäisen FI-reseptin pastan **200g kuivapaino** on kanoninen eikä 180g erillinen vaihtoehto; 800g tomaattikastikkeen merkki, 250g mozzarella, 80g parmesaani *tai muu kova juusto*, 60g öljyä ja 15 ainesrivin kokonaisuus vaativat yhtenäisen lähdemallin.

## Toimituksellinen turva

Lisättiin 5 erillistä FI-käyttöliittymän lähdevaroitusta `source-review-notices.ts`:ssä. Niiden tarkoitus on kertoa rehellisesti ruoan käyttäjälle, miksi neljän makron hyväksyntä puuttuu. Kaikki 13 julkisesti näkyvää F25-HOLD-lähdettä ovat nyt läpinäkyvästi varoitettuja; kaksi karanteenireseptiä pysyvät katalogin ulkopuolella. Reseptien `notesHtml`, FI-raaka-MD, GI/GK-historia ja julkaisuindeksi pysyvät koskemattomina.

[Koneluettava tuotevertailu](../../meta/kaannokset/f25-b1-five-product-matching-20261111.json) lukitsee 5 FI-blob-SHA:ta, tuotemallien numerot, puuttuvat kuitutiedot, markkinavertailun ja `release_authorized:false` kaikille. Regressiotesti ei koskaan väitä täyttä ruokaa hyväksytyksi. Julkaisut erillisissä hyväksytyissä FI-/ravinto-/GK-/käännös-PR:issä, ei #399:n yhdistämistä.

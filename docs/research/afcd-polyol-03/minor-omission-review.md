# Uusi yhteismenetelmä: pienet CHO-poisjätöt nimetyssä B-mallissa

**Toteutettu eristetty tutkimusprofiili, ei hyväksytty julkaisumenetelmä.** B-mallin pääainesosille vaaditaan edelleen nimetty ihmisillä mitattu GI-lähde ja arvioitu valmistussovellus. Pienen, tunnetun CHO-määrän tai dokumentoidun ylärajan GI voidaan jättää avoimeksi nykyisillä A-rajoilla: alkuperäinen looginen ainesosa<1gCHO/annos ja yhteensä<2g. Raja-arvon yhtäsuuruus hylätään. Kastikkeen pilkkominen rekisteririveiksi ei pienennä alkuperäisen ainesosan yhteissummaa.

Tämä on uusi B-menetelmäpäätös. Nykyinen B-profiili vaatii GI:n jokaiselle positiiviselle osalle ja säilyy muuttumattomana. [minor-omission-model.mts](minor-omission-model.mts) poistaa tarpeen keksiä pienille mausteille GI50, mutta ei osoita poisjätön fysiologista vaikutusta nollaksi. Tulokset ovat katetun hiilihydraatin ehdollisia malleja; tuntematon GI, massa tai koostumus ei muutu nollaksi. Tämän aineiston mikään luku ei vielä kasvata hyväksytyn julkaisusopimuksen kattavuutta.

## Todennettu vaikutus nykyiseen aineistoon

| Resepti | Uuden profiilin laskennallinen tulos | Avoin GI-CHO/annos | Vaikutus kattavuuteen |
| --- | ---: | ---: | --- |
| Ven pongal |noin43 |0,3831g pippuri | Sama aiempi resepti. Trace50 voidaan poistaa; riisin/mungin valmistusanalogiat jäävät. Cashew-skenaariot43,3023–43,4168 eivät ole kokonaisepävarmuuden rajat. |
| Pinaatti-paneer-chilla |8,76 |0,337g juustokumina | Sama aiempi resepti. Trace50 voidaan poistaa; kokonaisesta kikherneestä jauhetun pannuleivän lähdesovellus jää katselmoitavaksi. |
| Hojicha haudukkeena |8,34 |0,155g seesami | Sama reseptitunnus. Trace50 voidaan poistaa; täyslehtiselle nykyiselle versiolle suositellaan kuuden A-paketin8,82 vaihtoehtoa. |
| Kaakao-kookos-chia |HOLD |Ei julkaistavaa tulosta | Pelkkä pienten poisjättö ei riitä: pääruoalle puuttuu tämän profiilin vaatima nimetty ihmis-GI, ja kookosmaidon plant50 on edelleen oletus. |
| Hernekeitto savupotkalla |noin16 (aritmetiikka16,22) |1,9868875g | Yksi uusi tutkimusmalli nykyisestä77:n joukosta. Ei vielä mukana33:n ehdokaskoontiin; lähde-/valmistus-/sisältö- ja uusi menetelmäpäätös tarvitaan. |

**Yhteensä:** kolme olemassa olevan reseptin mallia vapautuu ehdotetusta trace50-koodauksesta. Yksi neljästä tällaisesta vertailusta jää HOLDiin. Yksi uusi resepti saadaan tutkimusmalliksi; uusia lähdekelpoisiksi osoitettuja julkaisuehdokkaita0 ja julkaistuja lisäyksiä0. Tarkat syötteet ovat [minor-omission](minor-omission)-hakemistossa, tiivis laskentatulos [minor-omission-summary.json](minor-omission-summary.json):ssä.

## Hernekeiton rajat

Alkuperäiset500g kuivattuja herneitä,700g luullista potkaa,2l vettä ja neljä annosta säilyvät. [Valmistajan Kivikylän Savupotka EAN2363013000008](https://www.kivikylan.fi/tuotteet/palvilihat/savupotka/) ilmoittaa nimellisen0,5gCHO/100g. Koko700g bruttopaino käytetään syötävän määrän lähdemallin ylärajana:0,875g/annos. Kaikki keitinliemi pidetään mukana. Raakaan vähärasvaiseen ulkofileeseen perustuvaa vanhaa nollaproxya ei käytetä.

Punnittu uusi sisältöversio määrittää sipulin55g, kaksi laakerinlehteä yhteensä1g, kuivan meiramin1g, pippurin0,5g, suolan6g ja tarjoilusinapin16g. Nämä eivät ole väitettyjä tiheys- tai lusikkamuunnoksia. Sinappi säilyy mukana eikä määriä optimoida läpäisyä varten. Laakerin ja meiramin koko massat toimivat ylärajoina.

Herneelle käytetään Fineli371:n natiivia kuivan herneen CHO-arvoa27,166g/100g, ei keitetyn tuotteen koostumusta kuiva-aineen massaan. Nimetty GI47 on Atkinson2021 Supplement2:n sivun75 kohdan3146 keitetty marrowfat-herne: Kanada1981, kuusi tervettä, glukoosi100,2h. Tämä on heikomman menetelmäluokan lähde. Suomen kuiva vihreä herne,1,5–2h pehmeäksi keittäminen ja sekaruoka jäävät avoimeksi B-analogiaksi. SEM3 ei muodosta reseptin vaihteluväliä.

Poisjättöbudjetin marginaali on vain0,0131125gCHO/annos. Tuotteen nimellinen etiketti ei takaa todellisen erän ylärajaa. Siksi hernekeittoa ei suositella ensimmäiseen integraatioon. Parempi tuote-/valmistusnäyttö voi olla tarpeen; yleisluonteinen hyväksyntä ei poista sitä.

## Käyttöönotto ja toisto

Tutkimusprofiili on otettu käyttöön tässä dokumentaatiohaarassa. Pääputkeen ei lisätä importtia tai profiilivalintaa. `evaluate-minor-omissions.mts ROOT SNAPSHOT DATA EXTERNAL_OUT` varmentaa lähde-/reseptihashit, pitää alkuperäiset19 tulosta ennallaan, laskee vain yhden uuden tapauksen ja neljä jo valmista vaihtoehtoa sekä tarkistaa välttämättömät rajat ja rivien pilkkomisen eston. Tuloste syntyy vain Gitin ulkopuolelle. Ei sivustobuildia, laajaa testiajoa tai Actions-käynnistystä.

**Valinta:** käytetään yhteistä valmistetun ruoan lähdesidontaa laajimman B-ryhmän suljettuun valmisteluun; kaikki sen kuusi nykyistä sovellusta ovat lähde-HOLDissa, kuuden A-pakettia seuraavaan integraatioon ja tätä uutta profiilia nimettyjen B-mallien oletusriippuvuuksien vähentämiseen. Tämän pienen kokeen perusteella B-poisjättö ei yksin ratkaise80% tavoitetta eikä avaa loppuja28/30/70 reseptiä.

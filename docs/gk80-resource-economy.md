# GK80:n työindeksi ja resurssit

Aja repon juuresta `node site/scripts/gk80-work-index.mjs 230`. Komento lukee originin mainin ja PR-viitteet sekä inventaarion täsmälleen PR:n HEADista. Jos kyseistä committia ei ole paikallisesti, nouda `git fetch origin refs/pull/230/head` ja aja uudelleen. Korvaa numero, kun inventaario siirtyy toiseen PR:ään. Indeksi tulostuu stdoutiin. Se tarkistaa mainin aina uudelleen, sulkee vanhentuneen PR-näytön työjonosta ja sitoo katalogit mainin blob-tunnisteisiin. Jos main vaihtuu, päivitä inventaario ajantasaisesta lähteestä ennen työn jatkamista. Viimeinen koontitarkistus ilmoitetaan vain, kun saman mainin onnistuneen Pages-ajon koontivaihe on varmennettu.

Lue seuraavaksi vain tarvittava reseptirivi, siihen sidottu laskenta ja osuvat katalogihavainnot. Tarkista ensin ruoka, kypsennys, mittausasteikko, hiilihydraattiperuste, lisenssi ja tarkiste. Tutki puuttuva sidos, kirjaa havainto katalogiin kerran ja viittaa siihen myöhemmistä resepteistä. Indeksin ehdotus ja omistajahyväksyntä ovat inventaarion tietoja. Julkaisulupa ja ajantasainen PR-päätös tarkistetaan erikseen.

| Muutos | Aiemmin | Nyt |
|---|---|---|
| Kolme yksilöityä suunnittelu-JSONia | Koko tarkistuspaketti | Kevyt tarkistus ilman npm-asennusta, koontia tai selainta |
| GK-syötteet ja kattavuusregressiot | Koonti ja kohdennettu GK-tarkistus | Sama tarkistus |
| Reseptit | Sisältö, ravinto ja GK | Samat tarkistukset |
| Käännökset | Muuttuneen sisällön tarkistus | Lisäksi käännöskatselmointi |
| UI | Koonti, staattinen tarkistus ja selain | Samat tarkistukset |
| Tutkimushakemiston rakenteinen tai ajettava aineisto | Saattoi mennä dokumentaatiopolkua | Tuntematon sidos valitsee koko paketin myös mainissa |

Checkoutin koko historia on edelleen tarpeen regressioille, jotka lukevat sidottuja committeja. npm-välimuisti säilyy, ja npm-asennus käynnistyy vain valitsimen tarpeesta. Playwright pysyy UI- ja täysissä tarkistuksissa. Nykyinen workflow ja PR-ajojen peruutussääntö riittävät. Pienennä peräkkäisten ajojen määrää puskemalla valmis työerä kerrallaan.

| Aineisto | Riippuvuus | Arkistointipäätös |
|---|---|---|
| `docs/nutrition/food-records.json`, GI-katalogi, reseptisidokset ja laskentasyötteet | Tuotantokoonti ja GK-regressiot | Pidä aktiivisina. Aloita hakemalla yksittäinen tunniste. |
| Fineli- ja AFCD-viitteet, julkaisu- ja hyväksyntäpaketit | Lähde- ja hyväksyntätarkisteet | Säilytä polut ja tiedostot. Lue tarvittaessa. |
| `glycemic-coverage-current-2026-10-25.json` ja `glycemic-coverage-batch-2b6d-current.json` | Testit lukevat suoraan. Ensin mainittu on myös generaattorin oletuskohde. | Arkistointiehdokkaita vasta, kun testien ja generaattorin sidokset on kartoitettu. |
| `docs/research/gk80-international-20261102/stock-and-current-bindings/historical-artifacts/` | Historiallinen näyttö ja jäljitettävyys | Jätä normaalin kontekstin ulkopuolelle. Siirto vaatii erillisen tarkisteiden ja viitteiden tarkastuksen. |
| Suunnittelujonot ja tutkimusyhteenvedot | Työn seuranta, joskus myös katselmointi | Aloita indeksistä. Säilytä alkuperäiset tiedostot. |

Lähtötasolla mainissa oli 2 217 tiedostoa ja 156 551 525 tavua, joista docs noin 85,1 MB ja kuvat noin 67,7 MB. Indeksi tuotti 11 949 tavua samasta 795 489 tavun inventaariosta. PR #230:n 100 viimeisimmästä PR-ajosta 95 peruutettiin. Ajojen alkamis- ja päivitysaikaleimojen erot olivat yhteensä 197,4 minuuttia. Mittari ei vastaa laskutettuja minuutteja. Vertaa seuraavassa vastaavassa työerässä committeja, pusheja, ajojen lopputiloja ja kestoa. Käytä tekstikokoa kontekstin epäsuorana mittarina, kun tokenimittaria ei ole saatavilla.

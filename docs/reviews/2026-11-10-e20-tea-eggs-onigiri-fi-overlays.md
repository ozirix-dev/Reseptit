# E20 – teehaudutettujen munien ja lohi-onigirin FI-näyttöoikaisu (10.11.2026)

Tämä PR jatkaa [E20 Draft #396](https://github.com/ozirix-dev/Reseptit/pull/396) -laaduntarkastusta ja aiempaa [#397](https://github.com/ozirix-dev/Reseptit/pull/397) -korjausta.

## Ongelma ja rajaus

- **Teehaudutetut munat:** aiempi ohje kuori munat vaiheessa 3, mutta käski säröillä kuoret ja hauduttaa ne vasta vaiheessa 4. Korjattu 4 vaiheeseen: keitä 2 kuorineen, kuumenna 150 ml mustaa teetä + 1 rkl soijakastiketta + 1 tl tähtianista, säröile kuoret, hauduta 10 minuuttia ja kuori vasta lopuksi. Näytön `cooking_method` paistaminen → keittäminen.
- **Lohi-onigiri:** aiemmat kolme vaihetta puhuivat tofusta, munista, kasviskulhosta ja kastikkeesta; neljäs puhui lohesta. Korjattu neljään yhtenäiseen työvaiheeseen: 100 g **kuivaksi punnittua valkoista riisiä** keitetään vedessä, 150 g raakaa lohta kypsennetään, muotoillaan kaksi täytettyä riisikolmiota, viimeistellään 3 g norilla ja 5 g seesaminsiemenillä. Ei luettelematonta öljyä, tofua tai kastiketta.

Molempien raakareseptien Git blob -SHA:t on tarkistettu FI-lähdejonoon. Lähdeteksti ja ravintolaskennan `docs/nutrition/calculations/*.json` **pysyvät byte-identtisinä**. Vain julkisen FI-näyttöversion projektio vaihtuu; jokainen muutos on sidottu normalisoituun raakatekstin SHA-256:een ja yksikäsitteiseen alkuperäisankkuriin (fail closed).

## Todennettavat ehdot

1. `site/tests/fi-breakfast-quality-display.test.ts`: 6 näyttöoikaisua, lähde-SHA, annokset, aika, 4 makroa, ainesosat ja kuvat ennallaan; valmistusvaiheiden määrä 4/4, semanttiset vanhat virheet poistuvat; ohjelman generoima FI-näkymä tarkistetaan.
2. Teehaudutetun munan 25 minuuttia on nopea kotikeittiöversio. Pidempi haudutus vahvistaisi makua; tätä ei väitetä perinteiseksi pitkän maustumisen reseptiksi.
3. Onigirin lähteen riisityyppi on ravintolaskennassa **kuiva pitkäjyväinen valkoinen riisi**; siitä muodostettu kolmio voi pysyä koossa huonommin kuin oikeasta lyhytjyväisestä sushiriisistä. Tähän ei vaihdeta riisilaatua huomaamatta. Jos resepti halutaan julkaista käännöksenä, tarkista riisilaji, kypsyys ja mahdollinen ravintolaskennan lähde.
4. E20:n molemmat rivit pysyvät tässä vaiheessa SOURCE-HOLDissa eikä mitään EN/SV/TH-käännöstä julkaista. Käännösten jatkot tarvitsevat erillisen sisältö- ja lähdekatselmoinnin, semanttiset tarkisteet ja Pages-verifioinnin.

**Huom.:** tämä on dokumentoitu AI:n tekstimuotoinen kokkikatselmointi, ei fyysinen koepaisto eikä itsenäinen ravintoaineuudelleenlaskenta.

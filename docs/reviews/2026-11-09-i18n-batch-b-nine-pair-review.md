# Rinnakkaiserä B, merkitysvertailu 9.11.2026

**PR:** #356; tämä AI-arvio on ChatGPT:n suorittama, ei ihmisen eikä Codexin tekemä katselmointi. **FI-lähteet:** main `ade461048ea138cd4f6a34340e8a53df79532bd7`. **Käännösluonnosten HEAD:** `1cfb43a5539ec69e40b42942f118b7fa04bcac59`.

## Kattavuus

Tässä osajulkaisuehdokkaassa 3 FI-reseptiä ja 9 kieliversiota: `meksikolainen-huevos-a-la-mexicana`, `karibia-callaloo-munakas`, `valimerellinen-farinata-aamupalaksi`; jokaisen EN/SV/TH. Vertailtu määrät ja yksiköt ainesosa kerrallaan, vaiheiden määrä, raaka/kypsä, lämpötilat ja ajat, annokset, allergeenit, kieltomuodot, lisukkeet, kuva sekä ravintoarvojen neljä kenttää. Thai-valmistusvaiheet takaisinkäännetty merkityksen osalta.

- **Huevos:** öljy 13,5 g, sipuli 55 g, jalapeño 15 g, tomaatti 125 g, kuoreton muna 110 g. Kaikki pannuneste 2 annokseen, ei tortilloita. GK:n matala luottamus ja insuliinivaroitus mukana kaikissa kolmessa.
- **Callaloo:** keltasipuli 50 g, kevätsipuli 12 g, öljy 13,5 g, pinaatti 150 g, timjami 6 g, kuoreton muna 110 g. Kypsennys kannen alla, pannuneste 2 annokseen. Toinen callaloo-kasvi rajattu pois. Pinaatin TH-vastine `ผักปวยเล้ง` erottuu amarantista.
- **Farinata:** uuni 220 °C / kiertoilma 200 °C, astia 20–22 cm, vettä 150 ml, taikinan lepo 20 min, paisto 20–25 min, lepo 5 min, 2 annosta. Käytetään vain reseptin öljy.

## Tulokset ja portit

FI/EN/SV/TH-rakenteen rivi-, annos-, kuva- ja makrovertailut: PASS (12 tiedostoa). AI-lähdevertailu: 9 paria, avoimia P0/P1-havaintoja ei tunnistettu. Ei oleteta ihmistarkistusta eikä riippumatonta kielentarkistajaa. FI-alkuperäisen ohjeita, aineita tai ravintolaskentaa ei muutettu. Kielimetatietojen lisäys jätettiin lopulliseen haaraan vain farinatassa. Lähde-/käännösmerkitystiivisteet kirjataan `meta/kaannokset/codex-review-evidence.json`-rekisteriin. Lähteen jo julkaistu ravintoarvo ja GK-taso jäävät muuttumattomiksi.

**RISKIPÄÄTÖS 9.11.:** GK80-release-2 sitoo Huevos- ja Callaloo-FI-tiedostot täsmälliseen SHA-256-lähdesisältöön. Kun käännösten kielistatukset lisättiin, build pysähtyi `STALE_INPUT`-virheeseen (run 42644592927). Molempien kolmen kielen status palautettiin `draft`:iksi ja FI-käännösmetadata ennalleen. Semanttiset kielikatselmointitarkisteet säilyvät, mutta niitä ei väitetä julkaisuhyväksynnäksi. Farinata jää ainoaksi tämän osavaiheen julkaistavaksi kielikolmikoksi. Hyväksyttyjä GK-paketteja ei muuteta.**

**EI MERGEÄ ennen uuden HEADin koko CI PASS, V2-rekisterin tarkistus ja rinnakkaisen #357:n tiedostopolkujen konfliktittomuus.** Tässä on 3/20 reseptin tarkistetut tekstit, joista vain 1/20 on julkaisu-PR:n kieliversioehdokas, PR on edelleen Draft, ei live-julkaisu.

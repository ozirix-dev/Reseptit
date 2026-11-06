# Recipavo Keittiöapuri — A4 offline-laatupilotti, osa 1

Päiväys: 6.11.2026
Tila: testiaineisto, suljettu intenttisopimus ja maksuton offline-harness PR:ssä.
Edeltävät: [A0 #320](https://github.com/ozirix-dev/Reseptit/pull/320), [A1 #324](https://github.com/ozirix-dev/Reseptit/pull/324), [A2 #336](https://github.com/ozirix-dev/Reseptit/pull/336), [A3 #338](https://github.com/ozirix-dev/Reseptit/pull/338). Seurantatehtävä [Issue #342](https://github.com/ozirix-dev/Reseptit/issues/342).

## Toteutus

A4:n **80 käsin kirjoitettua testikysymystä** muodostavat neljä 20 kysymyksen ryhmää (fi/en/sv/th). Jokaisella tapauksella on testitunniste, aihe, käyttäjän pyyntö ja ennakkoon kirjoitettu odotettu **AI-intentti**. Mukana keto, VHH, valmistusaika, luokat, thai-keittiö, ainesosaryhmät, kielikohtainen hakutermi, nollatulokset, GK-rajaus, puuttuva käyttötieto, kahden julkaistun reseptin vertailu, lääkehoitopyyntö sekä prompt-injektio. Nämä kysymykset eivät ole käyttötutkimus eivätkä vielä mallin vastauksia.

Tiedostot:
- `site/src/features/assistant/eval-cases.ts`: 80 kysymyksen versionoitu gold-aineisto.
- `site/src/features/assistant/intent-contract.ts`: rajoitettu JSON-sopimus search / compare / clarify / unsupported, sallittujen suodattimien validointi, vain **olemassa olevat** A1:n resepti-ID:t ja oikeat julkaistut kielireitit.
- `site/src/features/assistant/offline-evaluation.ts`: erottaa referenssin läpäisyn ja mahdollisen *erikseen toimitetun* mallituloksen vertailun; raportoi myös lääkinnällisen/prompt-injektiorajan rikkoutumisen.
- `site/scripts/assistant-offline-eval.ts`: kirjoittaa JSON-raportin Gitissä sivuutettuun `tmp/assistant-a4/`-hakemistoon, ei yhtään verkko- tai AI-kutsua.
- `site/tests/assistant-offline-eval.test.ts`: 80 tapausta, kaikki neljä kieltä, tyyppitarkistus, GK fail-closed, lähdesidotut URL:t ja makrot, virheelliset mallin syötteet ja väärät ID:t.

A4 **ei** muuta sivuston hakua, chat-UI:ta, Worker-reittejä, GK-laskentaa, Cloudflare Pagesia, reseptien sisältöä tai julkaisun suojausta. `status: published`-paketit pysyvät ainoana faktalähteenä; malli ei saa tuoda omaa GK:ta, ravintoarvoa tai URL:ia.

## Kaksi eri lukua, joita ei saa sekoittaa

**Referenssin läpäisy** kertoo vain, että käsin kirjoitettu odotettu intentti voidaan validoida ja suorittaa nykyisessä julkaistussa reseptikannassa. Esimerkiksi 80/80 kertoo, että *testisopimus* on eheä. Se **ei** osoita, että tekoäly ymmärtäisi 80 kysymystä oikein.

**Mallin osumatarkkuus** voidaan laskea vasta, kun 80 kysymykseen on aidot tallennetut malliehdokkaat. Offline-harness voi verrata ennalta tallennettuja ja erikseen tuotettuja `{ id, output }`-rakenteita. Se ei itse käytä mallipalvelua eikä voi todentaa ulkoisen ehdokastiedoston tekijää.

Jos mallituloksia ei ole, raportin `candidateMatched` ja `candidateInvalid` ovat **null**, eivät 0 tai 100 %. Kaikki tässä PR:ssä tehdyt ajot ovat maksuttomia lähde-/sopimustestejä.

## Paikallinen käyttö

~~~bash
cd site
npm ci
npm run content:sync
npm exec -- tsx --test tests/assistant-offline-eval.test.ts
npm run audit:assistant
~~~

Raportti: `tmp/assistant-a4/reference-evaluation.json`. Koko testisarjaan A4:n testi sisältyy myös `npm test` -komennossa.

**Erikseen hankitut** tulokset voidaan myöhemmin vertailla paikallisesti:

~~~bash
npm run audit:assistant -- --candidate-file /local/path/to/candidate-predictions.json
~~~

Ehdokastiedoston esimerkkirakenne:

~~~json
[
  {
    "id": "A4-fi-01",
    "output": {
      "version": 1,
      "action": "search",
      "filters": { "diet": "keto", "maxTime": 30 }
    }
  }
]
~~~

Tämä on **rakenne-esimerkki**, ei täydellinen 80 rivin ehdokastiedosto. Todelliseen vertailuun vaaditaan kaikki 80 tapausta yksilöllisillä ID:illä. Paikalliset tiedostot ja raportit eivät kuulu julkaistuun reseptisivustoon eikä niitä pidä sijoittaa `site/public/`-hakemistoon.

## Turvallisuus: mitä sopimus estää

- Tuntemattomat JSON-avaimet, mallin ilmoittamat GK/CHO-luvut, URL-osoitteet, lääkinnälliset toiminto-ohjeet ja julkaisuoperaatiot hylätään.
- Search käyttää edelleen suoraan julkaistujen reseptien hakua. GK-luokkasuodatus **ilman** nykyistä hyväksyttyä evidenssikarttaa palauttaa `requires_gk_evidence`. Ei mallin keksimiä GK-arvoja.
- Compare hyväksyy vain kaksi erillistä julkaistua resepti-ID:tä valitussa kielessä, ei keksittyä käännöstä tai osoitetta.
- Clarify ja Unsupported ovat rajattuja reason-koodeja, eivät mallin itse kirjoittamia HTML-tekstejä.
- Puuttuva ravintomäärä pysyy `null`-arvona. Ei alkuperäisen reseptin muuttamista, GI/GK-imputointia, käyttäjäkohtaista lääkehoitoa tai terveystietojen keräämistä.
- Poikkeamat näytetään case-ID:n ja koodin kautta. Käyttäjän raakatekstiä ei tarvita palvelinlogiin.

## A4:n jäljellä olevat portit (EI tämän PR:n hyväksyntä)

1. 80 kysymyksen ihmiskatselmointi: luonnollisen kielen tarkoitus ja gold-intentit ovat oikein kaikilla neljällä kielellä. Thai-käännösten aineosasanasto erityisesti.
2. Parannukset intentin tulkintaan (ei A2:n yksittäisen hakusanatestin sekoittamista AI-tuloksiin).
3. Mahdollisen mallipalvelun tietosuoja-/sopimusarvio ja Cloudflare AI Gatewayn lokituksen pois kytkeminen. Anonyymiksi oletettu IP voi silti olla henkilötietoa.
4. Oma päätös kahdesta testattavasta mallista, API-avainten sijoituksesta ja enintään 5 USD/kk *uuden* kulun budjetista. Cloudflaren aluekohtainen rate limit **ei** ole globaali kustannusten hard cap; tarvitaan atominen globaali budjetti tai palveluntarjoajan todellinen kova raja.
5. Vasta erillisellä luvalla voidaan tehdä oikeat maksulliset mallikutsut, raportoida todellinen maksullinen hyöty ja siirtyä A5:n rajattuun käyttäjäpilottiin.

**Julkaisupäätös:** tämä PR on offline-only. GitHubin mainiin yhdistäminen ei avaa AI:ta, Cloudflare Worker -mockia, `www.recipavo.com`-domainia eikä uutta maksullista palvelua.

# POLYOLI-03: kahden meiramireseptin rajattu integraatio

**1.11.2026 — toteutettu Draftiin #156, julkaisematta.** Omistaja hyväksyi
kahden reseptin C-menetelmän, koko reseptin 0,10 GK/annos -leveysbudjetin,
raportin lähdemallioletukset, tarkkuudet ja punnitut valmistusversiot.
Integraatio koskee vain `jauheliha-kaalikeitto-vhh`- ja
`vhh-kaalilaatikko`-reseptejä. Mergeä tai deployta ei ole hyväksytty.

| Hyväksytty versio | Näkyvä GK/annos | Netto-CHO | Kokonais-CHO | Proteiini | Rasva | Koko GK-skenaarion leveys |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Jauheliha-kaalikeitto | noin 5 | 10,21 g | 12 g | 17,68 g | 15,26 g | 0,058 |
| VHH-kaalilaatikko | noin 4 | 9,52 g | 13 g | 20,86 g | 30,65 g | 0,086 |

Molemmat ovat **LOW-luottamuksen mallinnettuja arvioita**. Näkyvä luku
johdetaan koko hyväksytyn laskentaskenaarion vakaasta pyöristyksestä.
Puuttuvalle polyolimäärälle ei valita nollaa, keskipistettä tai muuta
pistearvoa. Pyöristämätön reseptin GK-piste säilyy `null`-arvona; sisäinen
aineisto sisältää skenaarion rajat. Kokonais-CHO esitetään kokonaisina
grammoina, koska tarkempi esitys ei pysy samana koko skenaariossa.
`POINT_SCENARIO` on vanhan esitysskeeman pisteesityksen tunniste, ei
ratkaistu polyolimäärä; uusi `boundedPolyolC` erottaa tämän perusteen.

Laskennan vastealue 0–150 ja koostumusjäännös ovat hyväksyttyjä ehdollisia
lähdemallioletuksia. Ne eivät todista biologista ylärajaa, mitattua aterian
vastetta tai kattavaa ravintoaineiden analyyttistä epävarmuusväliä.

## Integraatio ja rajauksen säilyminen

- `site/scripts/gk80-polyol-c.ts` hyväksyy vain kaksi koodiin sidottua
  evidenssitiivistettä. Kumpikin kattaa koko tapauspaketin, kaikki lähteet,
  GI-sovellukset, määrät, annokset, oletukset ja neljä kieliversiota.
- `docs/nutrition/calculations/{recipeId}.json` sisältää tämän erillisen
  evidenssityypin; `batch-87.json` listaa täsmälleen kaksi reseptiä.
  Vanhat yleiset normalisoijat ja `nutrition-model.calculate` säilyvät
  muuttamattomina. Tavallinen laskentapolku ei hyväksy puuttuvia polyoleja.
- Koko reseptin tarkistus huomioi sekä meiramin puuttuvan kokonaispolyolin
  että AFCD-pippurin kenttäparin ulkopuolelle jäävät polyolilajit.
  Molempien kokonaispolyoli on `null`. Kenttäparin tunnettu osa ei muutu
  kaikkien polyolien mitatuksi arvoksi.
- Nykyistä koostumus-, GI-, ruokaperhe- ja valmistustarkistinta käytetään
  edelleen. Katalogiin asennetaan vain hyväksytty meiramin lähdesidos.
  Nakkikeiton seitsemää hyväksyttyä aliasriviä ei tarvitse asentaa, koska
  resepti pysyy HOLDissa.
- Leveysbudjetti, raaka-arvojen GK-luokan vakaus ja kaikkien neljän makron
  näyttöarvon vakaus tarkistetaan erikseen. Uusi resepti, lisätty tuntematon,
  suurempi maustemäärä, muu annosmäärä tai muuttunut lähde sulkee polun.
- Kunkin suomenkielisen reseptin ja kolmen olemassa olevan käännöksen koko
  teksti on sidottu hyväksyttyyn versioon. Lähteen tai käännöksen muuttunut
  valmistus sulkee polun sekä sisältötarkistuksessa että auditoinnissa.
- Kaikki ainesosat säilyvät mukana, myös sertifioitu suola. Nesteet, rasvat
  ja mausteet syödään hyväksytyn version ohjeen mukaisesti.
- LOW-seloste näkyy kahdeksalla reseptisivulla ja neljän kielen keskitetyissä
  GK-tiedoissa. Uutta julkista GK-alueformaattia ei lisätä.

**Ropa vieja, siskonmakkarakeitto ja nakkikeitto pysyvät HOLDissa.** Niiden
reseptisivuja, tuotantolähteitä tai tuloksia ei muuteta. Myöskään muille
polyolipuutteille ei avata sovellettavaa yleissääntöä.

## Varmennus

- 211 yksikkötestiä PASS, mukaan lukien 9 uutta integraatiotestiä.
  Viimeisen sisäisen ainesosa-auditin tarkennuksen jälkeen kaikki 9 uutta
  testiä ajettiin uudelleen; julkisen generoidun aineiston SHA256 ei muuttunut.
- Riippumaton Python Decimal toistaa molemmat GK-alueet ja neljän makron
  vakaat esitystarkkuudet tuotantoon liitetystä evidenssistä.
- **326 tuloksesta vain hyväksytyt kaksi muuttuu. Muut 324 kokonaista
  tulosobjektia säilyvät täsmälleen ennallaan mainiin nähden**, mukaan lukien
  kaikki 130 aiempaa numeerista tulosta ja kolme pidätettyä polyolitapausta.
  Draftin laskennallinen kattavuus on **132/326**, keskeneräisiä 194.
- Strict nutrition audit, TypeScript ja muuttuneen sisällön tarkistus PASS.
  Kaksi lähdereseptiä, kuusi käännöstä ja kaksi evidenssitiedostoa läpäisevät
  sidokset; käännösauditin kuudessa parissa ei ole löydöksiä.
- Staattisen tulosteen, SEO:n ja käännösten 52 testiä läpäisivät lopulta
  kaikki: ensimmäisellä ajolla 51/52 ja vanhan 130/326-laskurin päivityksen
  jälkeen kyseinen staattinen testi läpäisi uudelleen.
- Tuotantobuildin kaikki vaiheet valmistuivat: 691 prerenderöityä reittiä.
  Ensimmäinen strict audit havaitsi uuden evidenssin ainesosatiivisteen
  kenttäjärjestyksen virheen. Se korjattiin ennen buildin jatkamista;
  sisällön ja kuvien generointia ei uusittu tarpeettomasti.
- Vanhojen historiatestien näkymiin lisättiin kahden reseptin muuttamattomat
  ennen-integraatiota tallennetut snapshotit. Historiallisia baselineja ei
  kirjoitettu uusiksi. Nykyinen 326 tuloksen regressio lukee oikeaa nykyistä
  tulostetta ilman historiakerroksia tai poikkeusten sallimista muille resepteille.
- Nykyinen CI-valitsin valitsee integraatiomuutoksille laajan automaattisen
  PR-tarkistuksen. Tämän vaiheen yksi push käynnistää yhden CI-ajon;
  manuaalista Actions-ajoa ei käynnistetä. Deploy on estetty PR-tapahtumassa.

Käännösten tarkistus on automaattinen rakenteen ja tunnettujen termien
tarkistus; sitä ei merkitä riippumattomaksi ihmisen kielentarkistukseksi.

## Toisto ja hyväksyntähistoria

`site`-hakemistossa, buildin jälkeen:

```powershell
node --test --import tsx tests/gk80-polyol-c.test.ts
```

Tavallinen `npm test` sisältää nämä yhdeksän testiä yhdistetyn GK-testin kautta.

[approval-ledger.json](approval-ledger.json) tallentaa viimeisimmän omistajan
hyväksynnän. Alkuperäiset `cases.json`, `results.json`, `verification.json`
ja lähde-ehdotusten snapshotit kuvaavat **ennen hyväksyntää tehtyä tutkimusta**.
Niiden pending- ja julkaisuestoja kuvaavat liput ovat historiallisia.
Niiden SHA-sidottua alkuperäistä evidenssiä ei muuteta jälkikäteen.
Nykyinen käyttöönotto on vain tämän haaran kahden reseptin integraatio.

PR #156 pysyy Draftina. Guardin nykyinen `pr`-operaatio tukee vain luontia,
ei olemassa olevan otsikon tai kuvauksen päivitystä. Alkuperäinen PR-kuvaus
on siksi historiallinen; tämä tiedosto on ajantasainen toteutuskuvaus.
Ei uutta PR:ää, Ready-siirtymää, mergeä tai deployta.

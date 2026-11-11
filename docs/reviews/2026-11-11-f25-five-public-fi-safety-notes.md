# F25 – viiden reseptin tarkistushuomiot, erillinen käyttöliittymäkerros 11.11.2026

Tämä PR korvaa saman PR-haaran aiemman SHA-lukittuun FI Markdown -näyttöprojektoriin lisätyn huomautustoteutuksen. Ensimmäinen yritys epäonnistui CI:ssä, koska se muutti GK:n historialliseen inventaarioon sidottuja `notesHtml`-arvoja ja rikkoi vanhan 28 reseptin regressiotestin. **En lievennä kyseisiä historia- enkä kuva-/ravintotarkisteita.**

## Korjaus

- Erillinen `site/src/features/recipes/source-review-notices.ts` pitää 5 tuote-, allergeeni- ja valmistusaikahuomautusta staattisina FI-käyttöliittymän teksteinä.
- `RecipePage.tsx` näyttää nämä vain FI-reseptisivulla lukijalle `<aside role="note" data-f25-source-hold="...">`-elementissä selkeästi otsikoituina.
- Julkaisun muut reitit, kieliversiot ja metadata, käännös-/ravinto-/GI/GK-rajapinnat sekä vanhat GK- ja CI-historiasinetit pysyvät alkuperäisinä. Ilmoitettu huomautus **ei** muuta reseptin `notesHtml`-kenttää eikä kuvan altia, annoksia, ainesmassoja tai makroja.
- Standardissa `recipe-schema.test.ts`-testissä varmistetaan kaikkien viiden täsmällinen lista, puuttuvien lähteiden näkyvyys vain oikeille FI-tunnisteille, allergeenit ja se, ettei historiaan sidottua reseptitekstiä kirjoiteta uusiksi.

## Viiden FI-lähteen käyttäjälle näkyvät varoitukset

| FI-tunniste | Näytetään käyttäjälle |
|---|---|
| `rahka-marjakerroskulho` | 4 makroa ovat tuotevaihtelun vuoksi alustavat, maito ja hasselpähkinä |
| `intialainen-pinaatti-paneer-chilla` | Makrolaskentasyöte ja 4 arvoa puuttuvat; maito, kikhernejauho; tarkista öljy ja juustokumina |
| `lahi-ita-zaatar-munat` | 1 tl seesamipitoisen za’atarin poisrajaus ravintolaskennasta, muna/vehnä/maito |
| `japanilainen-hojicha-jogurtti-persimonilla` | 2 g syötävä hojicha-jauhe on jäänyt vanhan laskennan ulkopuolelle; maito/seesami |
| `vietnamilainen-banh-cuon-sienilla` | 150 g raakaa porsaan jauhelihaa, ei kasvisruoka; kalakastikkeen kala-allergeeni, kypsennys ja epävarma 25 min aikataulu |

Lähdemallit ja neljä uutta laskentaehdokasta ovat PR [#438:ssa](https://github.com/ozirix-dev/Reseptit/pull/438). Julkinen varoitus EI ole lähde-/ravinto-/GK- tai käännöshyväksyntä. Koko F25:stä mainissa 30/75 kieliversiota, 45 HOLDissa, luvut muuttumattomat.

Toteutus hyväksytään vain täsmä-HEADin CI SUCCESSin ja main-Pages build/deploy SUCCESSin jälkeen. Ei väitettä fyysisestä keittiökokeesta, natiivipuhujasta, ravintoasiantuntijasta eikä labramittauksesta.

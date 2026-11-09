# Käännöserä B – 10.11.2026 jäljellä yksi resepti ja kolme käännösluonnosta

**Tilanne:** Alkuperäinen 20 FI-reseptin × 3 kielen erä (=60 kieliparia) on nyt 19 reseptin / 57 julkaistun kieliparin osalta yhdistetty `main`-haaraan. **Tässä PR #356:ssa on enää yhden reseptin kolme EN/SV/TH-Draftia**. PR pidetään Draftina eikä sitä yhdistetä suoraan.

## Jo julkaistut erät

- [#370](https://github.com/ozirix-dev/Reseptit/pull/370): 5 FI-reseptiä / 15 kieliparia.
- [#371](https://github.com/ozirix-dev/Reseptit/pull/371): 5 FI-reseptiä / 15 kieliparia.
- [#372](https://github.com/ozirix-dev/Reseptit/pull/372): 4 FI-reseptiä / 12 kieliparia.
- [#373](https://github.com/ozirix-dev/Reseptit/pull/373): kuuden GK80-lukitun FI-alkuperäisen **julkisen esityksen** SHA-pinnatut toimitukselliset korjaukset; ei kanonisten raakalähteiden tai GI/GK-pakettien muutoksia.
- [#374](https://github.com/ozirix-dev/Reseptit/pull/374): 5 FI-reseptin / 15 kieliparin uusi EN/SV/TH-merkityskatselmointi ja julkaisu; tuotantohaara commit `9b47b8dda29057cdb5baf91d24a7498055438932`. PR:n kolme CI-yritystä: [#42716227557](https://github.com/ozirix-dev/Reseptit/actions/runs/42716227557) FAIL (loppurivit), [#42716379173](https://github.com/ozirix-dev/Reseptit/actions/runs/42716379173) FAIL (TypeScript-testin tuntematon tyyppi), [#42716878998](https://github.com/ozirix-dev/Reseptit/actions/runs/42716878998) SUCCESS koko testiketjussa. Main Pages -ajo [#42717843204](https://github.com/ozirix-dev/Reseptit/actions/runs/42717843204) tarkistettava erikseen.

**Yhteensä B-erästä:** 57/60 = 95 % kielipareista julkaistu. Reseptit-repon erillisessä `meta/kaannokset/published-translation-pairs.json`-sivurekisterissä on 31 reseptiä / 93 EN/SV/TH-kieliparia kahdesta 9.11. alkaneesta erästä (A + B). Nämä eivät ole väite koko sivuston historiallisten käännösten lukumäärästä.

## Ainoa jäljellä oleva HOLD

| FI-reseptin ID | Julkaisun este | Kielet |
| --- | --- | --- |
| `thai-kookosriisi-mangolla` | Lukitussa FI-raakalähteessä `cooking_method: paistaminen`; sivustolla #373:n SHA-pinnattu FI-näyttö korjaa menetelmän keittämiseksi, mutta EN/SV/TH-raakaluonnosten metatieto sisältää edelleen `paistaminen`. Käytetty GI/GK-rinnastus on nimetty **kypsennetylle jasmiiniriisille**, ei paistamiselle. | EN, SV, TH – Draft |

### Oikea seuraava käsittely

Valmistele **yksi rajattu reseptiversion ja käännösmetatiedon sovitus**. Älä muuta suomenkielisen raakalähteen `gk80-release-5`-SHA:ta tai vanhan hyväksyntäpaketin laskettuja numeroita vain testin viherryttämiseksi. Jos kanonisen FI-lähteen uusi versio päätetään julkaista, tee eksplisiittinen historiaversiosidonta ja testaa kaikki GK80:n 56 alkuperäistä sidosta. Vaihtoehtoisesti perustele erikseen version SHA:han sidottu kielten julkisen esityksen metatietokorjaus ja sen audit-portti. Tarkista kaikissa kolmessa kielessä 100 g kuivaa jasmiiniriisiä, 184 g tölkkikookosmaitoa, 100 g keitinvettä, 150 g raakamangoa, 6 g kokonaisia seesaminsiemeniä, kuuman riisin raja, syötäväksi tarkoitettu mango, ei ylimääräistä makeutusta tai mittaamatonta hävikkiä.

Yksi esikatselmointi, yksi julkaisukandidaatti, yksi CI-ajo ja enintään yksi perusteltu korjaus. Jos lähde- tai hyväksyntäkonflikti jää, **HOLD**, ei kokeilukierrettä. Aiemmat historialliset osakatselmointidokumentit ovat edelleen mukana vain jäljitettävyyttä varten; ne eivät todista nyt julkaistujen kielien nykyisiä tiivisteitä.

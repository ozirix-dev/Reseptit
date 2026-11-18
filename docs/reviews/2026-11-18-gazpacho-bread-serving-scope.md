# Gazpacho: laskettu vakioannos sisältää leivän (FI/EN/SV/TH)

**Päiväys:** 18.11.2026
**Lähtö-main:** `e8ed43ed525a9cb6abbe61b94bc1c036153979c7`
**Yhteys:** [reseptilaatu #327](https://github.com/ozirix-dev/Reseptit/issues/327) ja [laatupilotti #725](https://github.com/ozirix-dev/Reseptit/pull/725)
**Tila:** katselmoitava julkisen esityksen korjausehdokas, ei reseptiversiota, ravintoarvojen muutosta eikä julkaisuvaltuutta.

## Todettu lähderistiriita

Kaikilla neljällä kielellä gazpachon valmistusvaihe 1 sanoo, että leipä on valinnainen. Rakenteisen aineslistan **2 viipaletta vaaleaa leipää** on kuitenkin sisällytetty julkaistun vakioerän ravintoarvioon, joka on edelleen neljälle annokselle jaettu alkuperäinen laskenta.

`docs/nutrition/calculations/gazpacho.json`:
- `recipeId: gazpacho`, `servings: 4`, `sourceHash: 353c22e833556f8cd4476dce4271c1b5bfb3774115559bd9ef78ffcb9f573f8c`.
- Leipä: Fineli Release 20, elintarvike **1107**, 25 g/viipale, 2 viipaletta = **50 g/erä**.
- EU-saatava hiilihydraatti 53,348 g / 100 g → laskennallisesti leivästä **26,674 g/erä**, **6,6685 g/annos**.
- Julkinen nykyinen arvio **18,61 g imeytyvää HH/annos** ja **21,91 g kokonaishiilihydraattia/annos** pysyvät koskemattomina. Leivän poisjättämistä vastaavia **uusia julkaisuvalmiita** lukuja ei ole tarkistettu tässä työssä.
- Laskennan `scope`-tekstissä mainitaan lisäksi couscous ja congee. Tämä on toiseen ruokaan viittaava dokumentointivirhe; koska tiedosto on osa säilytettävää ravinto- ja GK-evidenssiä, sitä ei muokata tässä esityskorjauksessa.
- `docs/nutrition/glycemic-load-recipe-bindings.json` ja historiallinen `docs/nutrition/gk100-original-recipe-audit-2026-11-05.json` sisältävät gazpachon alkuperäiseen reseptiin sidottuja tarkisteita. Historiallisen auditin `CALCULATED / ORIGINAL_BOUND` ei ole uusi GK-hyväksyntä eikä oikeuta leivättömän GK-arvion julkaisemista.

## Rajattu toteutus

`site/scripts/public-recipe-copy.ts` käyttää jo tuotantobuildissa kutsuttua `projectPublicRecipeMethodCopy`-funktiota. `gazpacho`-tunnisteella:
1. korvaa yhden alkuperäisen, versioon sidotun valinnaista leipää koskevan valmistuslauseen;
2. kertoo, että *näytetyt ravintoarvot sisältävät leivän* neljän annoksen peruserässä;
3. lisää selittävän huomautuksen, että ilman leipää numeerisia arvoja ja mahdollisia GK-arvioita ei voi sellaisinaan käyttää leivättömän annoksen arvoina;
4. pysähtyy `GAZPACHO_BREAD_SCOPE_SOURCE_DRIFT`-virheeseen, jos vanha täsmällinen lause muuttuu tai esiintyy useammin kuin kerran.

Merkitys toteutetaan FI/EN/SV/TH-näkymissä. Leipä säilyy **valinnaisena ruoanvalmistuksessa**, mutta sen vaikutus ilmoitettuihin ravintoarvoihin kerrotaan selvästi. Kiinteä 'kaksi viipaletta' -määrä annetaan vain alkuperäisen neljän annoksen peruserän yhteydessä. Käyttöliittymän annosvalitsimen skaalauksen laskentapohjaan ei puututa.

**Ei** muutoksia reseptien raakateksteihin, käännös- ja GK-hyväksyntöihin, lähde- tai laskentarekistereihin, hiilihydraatti- tai muihin numeroarvoihin, kuviin eikä julkaisulupiin. Tämän PR:n perusteella ei voi muuttaa `sourceHash`-tietuetta eikä julkaista leivätöntä arviota.

## Lukitut lähdeblobit

| Kieli | Alkuperäistiedosto | Git-blob SHA |
|---|---|---|
| FI | `reseptit/alkuruoat/gazpacho.md` | `61b92f37817a09c4d04bdaba1acc378c1918f0a3` |
| EN | `kaannokset/en/alkuruoat/gazpacho.md` | `ceab50d7bd11dac188c93a02564415920061ae2a` |
| SV | `kaannokset/sv/alkuruoat/gazpacho.md` | `3cfcd586c9777924e8e7edd1842ece128343a707` |
| TH | `kaannokset/th/alkuruoat/gazpacho.md` | `853306ba95c59d523b2d4111438ab56d9e6530e8` |

`site/tests/gazpacho-bread-serving-scope.test.ts` lukitsee alkuperäiset Git-blobit, raaka-ainesrivin kaksi viipaletta, neljä muuttumatonta makroarvoa, esityskorjauksen ja näkyvän HTML:n sekä valmistusvaiheiden ja huomautusten sisällön. Se varmistaa myös, että muuttuneeseen lähdetekstiin kohdistuva korjaus epäonnistuu suljetusti. Testin suorittaminen, onnistuminen ja täsmä-HEAD kirjataan PR:ään CI:n jälkeen.

## Seuraavat portit

Neljän kielen merkitysvastaavuuden riippumaton tarkistus, CI saman HEADin osalta, Repo Guard ja omistajan yhdistämis-/julkaisupäätös. Raportti ei käsittele varsinaisia vaihtoehtoisten annosversioiden laskentoja eikä muuta muita #725:n P2-havaintoja.

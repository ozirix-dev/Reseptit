# Gulab jamun: friteerauksessa käytetty öljy ja laskennallinen imeytymä erotettava

**Tila:** toteutusehdokas, ei julkaistu
**Päivä:** 18.11.2026
**Lähderevisio:** `e8ed43ed525a9cb6abbe61b94bc1c036153979c7`
**Riippuvuus:** [gazpachon julkisen esityksen PR #731](https://github.com/ozirix-dev/Reseptit/pull/731), josta tämä työ on haaroitettu.
**Työjono:** [#327](https://github.com/ozirix-dev/Reseptit/issues/327), [20 reseptin katselmointi #725](https://github.com/ozirix-dev/Reseptit/pull/725).

## Todennettu havainto

Julkaistun `gulab-jamun`-reseptin rakenteisessa ainesluettelossa on **30 g öljyä**. Saman rivin huomautus täsmentää kaikilla neljällä kielellä, että tämä on **arvioitu koko erään imeytyvä öljymäärä**, kun friteeraamiseen tarvitaan **noin 1 litra öljyä**, josta ylimääräinen valutetaan pois.

Alkuperäinen seitsemänvaiheinen valmistusohje sanoo vain lämmittämään öljyä ja friteeraamaan hitaasti 6–8 minuuttia. Se ei kerro litramäärää eikä erota valmistusöljyä arvioidusta imeytymästä. Tämä voi johtaa kotikokin tulkitsemaan rakenteisen 30 g:n öljyrivin paistamiseen tarvittavaksi määräksi.

Tiedot perustuvat nykyisiin neljään reseptitiedostoon, eivät uuteen laboratorio- tai keittiömittaukseen. Öljyn todellista imeytymää ei ole tässä tarkistuksessa mitattu. Julkaistut makroarviot ovat kaikilla kielillä ennallaan: netto-HH **93,18 g**, kokonaishiilihydraatti **93,87 g**, proteiini **14,96 g** ja rasva **16,36 g** / annos, **4 annosta**.

Historiallinen alkuperäisreseptin GI/GK-auditointi `docs/nutrition/gk100-original-recipe-audit-2026-11-05.json` merkitsee kohteen `INSUFFICIENT SOURCE DATA / NO_HOME_ESTIMATE`. `docs/nutrition/glycemic-load-recipe-bindings.json` sisältää alkuperäisen lähde- ja laskentasyöteversion tarkisteet. Nämä ovat historiallisen näyttöketjun osia, eivät lupaa julkaista uutta GK-tulosta.

## Korjauksen tarkka rajaus

Käytetään olemassa olevaa `site/scripts/public-recipe-copy.ts`-esitystoimintoa `projectPublicRecipeMethodCopy`. Kussakin FI/EN/SV/TH-näkymässä:

1. Valmistusvaihe 5 kertoo, että friteeraukseen varataan **noin litra öljyä** ja kuumennus pidetään ohjeen mukaisesti maltillisena.
2. Samassa vaiheessa erotetaan alkuperäisen rakenteisen ainesrivin **30 g / koko erä** laskennalliseksi imeytymisoletukseksi, ei pannulle kaadettavaksi öljymääräksi.
3. Näkyvään muistiinpanoon lisätään, että 30 g on **arvio, ei mitattu toteutunut imeytymä**, ja poikkeama on mahdollinen.
4. Täsmällisen alkuperäislauseen muuttuessa projektio hylkää lähdepoikkeaman koodilla `GULAB_JAMUN_OIL_SCOPE_SOURCE_DRIFT` eikä korjaa tuntematonta valmistusohjetta hiljaisesti.

**Ei muuteta** alkuperäisten FI/EN/SV/TH-käännösten Git-blob-tarkisteita, ainesosariviä, 30 g:n arviota, neljää makroarvoa, neljän annoksen saantoa, GK-historiaa, kuvia tai muita reseptejä. Paistamiseen tarvittavaa noin litraa öljyä ei kirjata virheellisesti ravintolaskennassa syödyksi.

## Lukitut lähdeblobit

| Kieli | Tiedosto | Git blob SHA-1 |
|---|---|---|
| FI | `reseptit/jalkiruoat/gulab-jamun.md` | `9454f0e89b8c738a20fdeb0f2cf56481062e742a` |
| EN | `kaannokset/en/jalkiruoat/gulab-jamun.md` | `fa8e4f8eede0a2ac4eb273a0a81ce83d1a492717` |
| SV | `kaannokset/sv/jalkiruoat/gulab-jamun.md` | `13bb0c692822c93f936d7fb62d33a85a91445229` |
| TH | `kaannokset/th/jalkiruoat/gulab-jamun.md` | `7e8f4e8fe02e6fd1ee1c47a87bdf6c70cfc71e49` |

## Varmennus ja portit

`site/tests/gulab-jamun-oil-scope.test.ts` lukitsee alkuperäisten tiedostojen Git-blobit, neljä näkyvää kieliversiota, 30 g:n ainesrivin, neljän annoksen saannon ja vanhat makrot. Se tarkistaa uuden selityksen `instructionsHtml`-, `instructionsText`-, `instructionStepsHtml`- ja `notesHtml`-esityksissä sekä lähdetekstin muutoksesta aiheutuvan fail-closed-virheen.

Testin todellinen tulos, täsmä-HEAD ja CI merkitään PR-kuvaukseen ajon valmistuttua. Riippumaton neljän kielen merkitys- ja ravintorajaustarkistus, Repo Guard sekä omistajan yhdistämis-/julkaisupäätös ovat erillisiä portteja.

**Integraatiojärjestys:** tämä työ on pinottu PR:n #731 päälle, koska sama `public-recipe-copy.ts`-tiedosto muuttuu. #731:n hyväksynnän ja yhdistämisen jälkeen tämän PR:n vertailuhaara kohdistetaan tarvittaessa `main`iin ja varmennetaan uudelleen. Edeltävän PR:n CI ei sellaisenaan hyväksy tätä uutta HEADia. Codexin aktiiviset GK-/R2-projektiohaarat eivät ole tämän haaran kirjoituskohteita.

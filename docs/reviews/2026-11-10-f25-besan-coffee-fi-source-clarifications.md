# F25: besan-chillan nimivirhe ja kahvi-banaanijogurtin tuotetulkinta

Päivä 10.11.2026. Kaksikko kuuluu F25:n vanhaan [Draft #399](https://github.com/ozirix-dev/Reseptit/pull/399) -erään. Korjaukset tehdään yksinomaan `site/scripts/fi-breakfast-quality-display.ts`-projektorin SHA-256-lukittuun **julkiseen FI-esitykseen**. FI-raakablobit, julkaisurekisteri, kaikki punnitukset, neljä ravintoarvoa/annos, laskennan alkuperäinen GI/GK sekä kuvatiedostot ovat ennallaan.

## Besan-chilla
- FI-raakablob `fc2be49b7bde49f950dd24f1d3f3d38644bf7a8f`, ravintosyöte `docs/nutrition/calculations/intialainen-besan-chilla.json`.
- Otsikko, H1, kuvaus ja kuvan alt lupasivat aiemmin **tomaattichutneya**, vaikka nelivaiheinen FI-näyttöohje sekoittaa tomaatin ja sipulin besan-taikinaan eikä erillistä chutneyta ole laskettu.
- Julkinen nimi **Besan-chilla tomaatilla ja sipulilla**. Ohje ilmaisee 1 keskikokoisen tomaatin ravintoviitemassan **125 g syötävää** (Fineli 352) ja 1 keskikokoisen keltasipulin **55 g syötävää** (Fineli 335). Aineslistan 1 kpl ja 1 kpl säilyvät; käyttäjälle paljastetaan niihin liittyvä annospaino-oletus.
- 100 g kikhernejauhoa, 100 ml vettä, 6 g korianteria ja 1 rkl öljyä, 2 annosta. Käännösten otsikko ja valmistus jo kuvaavat tomaatin ja sipulin käyttöä, mutta lopullisessa kielijulkaisussa on luotava **uudet julkisen FI:n semanttiset SHA:t**.

## Vietnamilainen kahvi-banaanijogurtti
- FI-raakablob `4f215df58a68fe86d5c03a7d11c7fc516f823d3f`, ravintosyöte `docs/nutrition/calculations/vietnamilainen-kahvijogurtti-banaanilla.json`, reviewerStatus **AUTOMATED ONLY**.
- Rakenteisessa FI-aineslistassa on 30 g `kondensoitu maito`, joka voi tarkoittaa makeutettua tai makeuttamatonta. **Laskenta käyttää nimenomaan 30 g tavallista makeutettua kondensoitua lehmänmaitoa** (AFCD F005582) eikä makeuttamatonta tiivistemaitoa. Julkisissa neljässä vaiheessa ja erillisessä tuotetäsmennyksessä tämä yksilöidään.
- 100 g maustamatonta **3,9 % jogurttia** (Fineli 620), 200 ml mustaa valmista kahvia, 1 keskikokoinen **125 g kuorittu banaani** (Fineli 11049) sekä 30 g makeutettua kondensoitua maitoa. Jos käyttäjän banaanin koko tai maitotuote vaihtelee, näkyvät neljä makroarvoa muuttuvat; laskenta on viiteryhmän arvio.
- EN/SV/TH-Draftien kondensoitu maito on vielä liian yleisluontoinen. **Älä julkaise** niitä ennen kieliversioiden täsmennettyä makeutettu-statusviitettä ja uuden semanttisen SHA:n laskentaa.

## Testit ja rajaus

Regressiotesti sallii Besanin osalta vain kuvan alt-tekstin muutoksen (kuvan src ja mitat säilyvät), estää vanhan chutney-otsikon ja varmistaa tomaatin/sipulin muunnokset. Kahvijogurtilla se tarkistaa uuden makeutettu- ja Fineli/AFCD-tuotetulkinnan, 125 g banaanin ja neljän työvaiheen säilymisen. Molemmilla nykyiset 28 FI-projektoria pysyvät raakablobi-SHA:han lukittuina eikä ravintokenttiä, annoksia, aikaa tai muuta kuvametadataa muuteta.

**EI KIELIJULKAISUA tässä PR:ssä.** Tämä työ ei muuta rinnakkaista #409:n Material21-työtä tai #417:n gluteenitonta suodatinta. F25 #399 säilyy Draft/DO NOT MERGE, eikä tähän liitetä koepaisto- tai natiivipuhujan väitettä.

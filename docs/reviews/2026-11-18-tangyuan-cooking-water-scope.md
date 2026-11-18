# Tangyuan: erillinen keitinvesi ja tarjottava inkivääriliemi

**Päivä:** 18.11.2026
**Tila:** toimituksellinen esityskorjausehdokas, ei julkaistu
**Lähtö-main:** `e8ed43ed525a9cb6abbe61b94bc1c036153979c7`
**Lähtöhavainto:** [reseptilaatu #327](https://github.com/ozirix-dev/Reseptit/issues/327) / [20 reseptin tarkistus #725](https://github.com/ozirix-dev/Reseptit/pull/725).
**Pinottu tekninen riippuvuus:** [gulab jamunin PR #733](https://github.com/ozirix-dev/Reseptit/pull/733), joka on puolestaan pinottu [gazpachon PR #731](https://github.com/ozirix-dev/Reseptit/pull/731) päälle saman `public-recipe-copy.ts`-tiedoston vuoksi.

## Alkuperäislähteestä varmennettu tulkinta

FI:n `reseptit/jalkiruoat/tangyuan.md` sisältää **1,8 dl lämmintä taikinavettä**, **1 litran vettä 'keittoon'**, **60 g sokeria 'liemeen'** ja inkiväärin. Vaihe 4 käyttää vettä, sokeria ja inkivääriä makeaan liemeen, jota haudutetaan 10 minuuttia. Vaihe 5 sanoo keittämään pallot vedessä ja kaatamaan lopuksi päälle inkiväärilientä. FI ei yksilöi, onko keitinvesi samaa kuin liemivesi.

Saman reseptin EN/SV/TH-käännösten vaihe 5 sanoo jo ennen tätä muutosta, että pallot keitetään **erillisessä kattilassa**; käännöstenkaan raakamuoto ei kerro, mistä keitinveden määrä otetaan. Toimituksellisesti turvallisempi täsmennys on erottaa liemen **1 litra** tavallisesta lisäkeitinvedestä, jota ei tarjota annoksena.

Riippumattomat valmistuslähteet tukevat kahden kattilan menetelmää. [The Kitchnin black sesame tangyuan](https://www.thekitchn.com/tang-yuan-recipe-23625165) valmistaa inkiväärisiirapin erikseen, keittää riisipallot toisessa kattilassa ja nostaa ne reikäkauhalla kulhoihin. [Foodelicacy](https://www.foodelicacy.com/black-sesame-filled-glutinous-rice-balls-sweet-osmanthus/) selittää, että keittäminen erillään estää riisipallojen irrottaman tärkkelyksen samentamasta inkiväärilientä. Tämä on vertailun perusteella tehty *toimituksellinen tulkinta*, ei alkuperäisen FI-tekstin yksiselitteinen mittaustieto tai koekokkaustulos.

## Ehdotettu julkinen korjaus

`site/scripts/public-recipe-copy.ts` lisää `projectPublicRecipeMethodCopy`-funktion kautta FI/EN/SV/TH-näkymiin versionlukitun täsmennyksen vaiheeseen 5 ja muistiinpanoon:

- Käytä **1 litraa vettä ja 60 g sokeria** inkivääriliemen valmistamiseen, kuten alkuperäinen ainesrivi ja vaihe 4 jo sanovat.
- Kuumenna riisipallot **erillisessä kattilassa riittävässä tavallisessa vedessä** 5–6 minuuttia, kunnes ne nousevat pintaan. Keitinvesi on valmistuksen apuvesi, sitä ei kirjata syötäväksi annosmääräksi.
- Nostele pallot reikäkauhalla kulhoihin, valuta keitinvesi pois ja tarjoa makea inkivääriliemi niiden kanssa. Reseptissä ei mitata tarjoillun liemen lopullista syötyä osuutta.
- Näkyvän raakatekstin poikkeaminen nykyisestä täsmätekstistä tuottaa `TANGYUAN_COOKING_WATER_SOURCE_DRIFT`-virheen. Muutos ei koske muita reseptejä.

**Ei muuteta** alkuperäisiä FI/EN/SV/TH-tiedostoja, ainesluetteloiden grammoja/litroja, 16 pallon ja neljän annoksen jakoa, reseptin kokonaisaikaa, kuvia, ravintoarvoja, GK-lähteitä, hyväksyntää tai julkaisustatusta. Työ ei väitä, että kaikki **1 litra** liemestä syödään eikä lisää keitinvettä ravintolaskennan syötteeksi.

## Lähdesidonnan ja GK:n raja

| Kieli | Tiedosto | Alkuperäinen Git blob SHA-1 |
|---|---|---|
| FI | `reseptit/jalkiruoat/tangyuan.md` | `0b7e835d81a22887cccfb33c40f0d2a23b6e4b24` |
| EN | `kaannokset/en/jalkiruoat/tangyuan.md` | `0453a55994a80d9c1d3907df23dd1020a6168647` |
| SV | `kaannokset/sv/jalkiruoat/tangyuan.md` | `1a87c9e738609670a6d1113ef7c30dfe4b1b8d0c` |
| TH | `kaannokset/th/jalkiruoat/tangyuan.md` | `c7cfc6ee86e495a70a463009059ecf098f7d3eda` |

`docs/nutrition/gk100-original-recipe-audit-2026-11-05.json` sisältää tangyuanille `INSUFFICIENT SOURCE DATA / NO_HOME_ESTIMATE`. [Historiallinen Lee Chun -koeannoksen katselmointi](https://github.com/ozirix-dev/Reseptit/blob/main/docs/nutrition/gk100-tangyuan-study-review.md) käsittelee **115 g** teollisia keitettyjä riisipalloja ja erikseen **250 ml juomavettä**; se ei ole tämän mustaseesamitahnaa ja sokeroitua inkiväärilientä sisältävän kotiohjeen GK-tulos. [Ehdokas](https://github.com/ozirix-dev/Reseptit/blob/main/docs/nutrition/gk100-tangyuan-study-release-candidate.json) on `PREPARED_FOR_REVIEW` ja `publicationAuthorized: false`. Ei tuoteta uutta numeroarvoa.

`site/tests/tangyuan-cooking-water-scope.test.ts` lukitsee alkuperäisten neljän tiedoston blobit, 1,8 dl taikinaveden, 1 l liemiveden, 60 g liemisokerin, neljän annoksen saannon ja nolliksi arvaamattomat makrot. Se tarkistaa julkiset HTML-, vaihe- ja muistiinpanotekstit neljällä kielellä sekä vanhentuneeseen lähtötekstiin kohdistuvan fail-closed-portin.

## Portit ja integraatio

Tämä on julkaisematon Draft-korjausehdotus. PR-CI:n onnistuminen kirjataan vasta toteutuneelta täsmä-HEADilta. Nelikielisen merkityksen riippumaton katselmointi, Repo Guard sekä erillinen merge- ja tuotantojulkaisupäätös jäävät pakollisiksi. Muutosten vertailu rajataan oman PR:n ja vanhemman #733:n välille. #733:n ja #731:n hyväksytyn integraation jälkeen tämän jatko-PR:n perusta siirretään tarvittaessa `main`iin ja CI/HEAD-katselmointi uusitaan. Codexin GI/GK-haaroihin ei kosketa.

## Katselmoinnin P2-korjaus (integraatio-PR)

Julkinen FI/EN/SV/TH-keitinvesiohje käyttää annosvalitsimen kannalta neutraalia ilmausta **"ainesluettelossa inkivääriliemeen varattu vesi"**. Yksi litra vettä ja 60 g sokeria mainitaan muistiinpanoissa vain **alkuperäisen neljän annoksen peruserän** yhteydessä. Tämä välttää ristiriidan, jossa valitaan kahdeksan annosta ja aineslista skaalaa liemiveden 2 litraan. `site/tests/tangyuan-cooking-water-scope.test.ts` tarkistaa 2/4/8 annoksen liemiveden skaalausta ja näkyvän perusversion kuvauksen. Erillisen keitinveden tarvetta ei numeerisesti arvioida eikä se saa GK-/ravintolukua.

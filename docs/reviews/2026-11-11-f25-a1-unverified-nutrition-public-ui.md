# F25 – neljän tunnetusti keskeneräisen ravintolähteen FI-näyttörajaus (11.11.2026)

## Miksi tämä on tarpeen

F25:n 15 lähteen laajassa tarkistuksessa neljällä FI-ruoalla on **tunnettu makrojen lähdevirhe tai puuttuvat hyväksytyt makrot**:

| FI-resepti | Perusteltu lähde-este |
|---|---|
| `rahka-marjakerroskulho` | ilmoitetut 6,32 g netto-HH eivät täsmää Valio/Salakis-/marja-/pähkinätuotekohtaiseen 6,73 g kandidaattilaskelmaan ja 1 tl sitruunankuori / valinnainen makeutus puuttuvat |
| `intialainen-pinaatti-paneer-chilla` | kaikki neljä kanonista makrokenttää sekä kelvollinen ravintolaskentasyöte puuttuvat; paneer ja 1 tl juustokumina vielä tuotekohtaisesti hyväksymättä |
| `lahi-ita-zaatar-munat` | nykyinen mausteelle oletettu 0,1 g netto-HH/annos poisjättöyläraja ei päde Salliselta-seoksen 2,5 g/rk skenaariossa; seesamia mukana |
| `japanilainen-hojicha-jogurtti-persimonilla` | syötävän 2 g:n hojichajauheen hiilihydraatti, kuitu ja proteiini jätetty pois; esimerkiksi Renée Voltaire -jauheesta kuitua tulisi noin 0,64 g/annos |

Aines- ja valmistusohjeet voidaan yhä lukea, mutta vanhaa täsmälleen kahden desimaalin makrotaulukkoa ei näytetä ikään kuin tietue olisi varmistettu. Sama pätee siihen nojaavaan julkiseen GK-lukuun. Kyse on **vain neljän FI-reseptin** näyttörajoituksesta, ei koko F25-jonon, kaikkien 326 reseptin eikä kaikille käännöksille tehdystä massamuutoksesta.

## Toteutus ja invariantit

- Uusi `site/src/features/recipes/f25-nutrition-withhold.ts` sisältää neljän yksilöidyn id:n suppean julkisen FI-näyttörajoituksen. Muutos ei tule automaattisesti voimaan muille kielille, eikä se muuta 15 reseptin `f25-release-gate.json`-HOLDia.
- `RecipePage.tsx`: neljän FI-lähteen vanhoja ravintoarvolukuja tai GK-arviota **ei näytetä**, vaan sanallinen selitys ja nykyinen lähdehuomautus kerrotaan. Muilla resepteillä toiminta muuttumaton.
- `schema.ts`: sama vanhentunut tieto **ei vuoda hakukoneen Schema.org NutritionInformation -rakenteeseen**. Reseptin nimi, annokset, vaiheet, kuvat ja kategoriat pysyvät.
- `route-content.test.ts`: 4/4 lähdettä pitävät makrot pois JSON-LD:stä, ei-F25-kohde pysyy ennallaan. Varsinaista FI-raakatekstiä, makrodataa, lähde-SHA:ta, GI/GK-historian sinettejä, FI-projektorin 28 testiä tai kuvia **ei muuteta**.

Näiden neljän tuote- ja GK-korjaus hyväksytään omassa FI/ravinto/GK-version PR:ssään issue [#447](https://github.com/ozirix-dev/Reseptit/issues/447), minkä jälkeen tämä UI-esto voidaan poistaa täsmällisesti. Julkisen GK-suodattimen aiempien lähdeversioiden luokittelu on erillisen nykyisen ruokavaliosuodatin-PR:n [#450](https://github.com/ozirix-dev/Reseptit/pull/450) työaluetta; tämän PR:n ei tule sotkea sitä julkaisu- tai hyväksyntätyöhön. Siihen jää väliaikainen ristiriita: lähde voi näkyä aiemmassa GK-suodatusluokassa mutta sen sivu varoittaa ettei arviota näytetä. Ratkaistava suodatin-PR:n oman turvallisuustarkistuksen yhteydessä.

**Draft / ei yhdistetä ennen CI + Codex Review + Pages-verifiointia.** Ei väitettä tuote-/GK-hyväksynnästä tai fyysisestä koepaistosta.

## CI:n paljastamat staattisen sivuston näyttösopimukset

Ensimmäisen version exact-HEAD CI:n [#42950907985](https://github.com/ozirix-dev/Reseptit/actions/runs/42950907985) **Build/units/translation läpäisivät mutta static-output FAIL**; kolme sivua oli ristiriidassa vanhan JSON-LD:n ja alkuperäisen GK-statusin kanssa. Nämä ovat oikeita julkaisuturvasuojia, ei syytä poistaa testejä. Korjaus pitää suojat yhtä tiukkoina: `site/scripts/seo-audit.ts` odottaa vain täsmälleen neljän FI-lähteen kohdalla ravintomarkupin puuttumista, kuten `schema.ts` sen jo tuottaa. `site/tests/static-output.test.ts` vaatii näille neljälle nimenomaan `WITHHELD_SOURCE_REVIEW`-tilan, sen että vanha numeerinen GK ei näy, ja sanallisen selityksen, sekä varmistaa kaikkien muiden reseptien GK-statusin samalla vanhalla erillistestillä. GK-only-varianttien historialliset omat versiot säilyvät itsenäisesti näkyvissä. Tämä koskee vain reseptisivun väliaikaista FI-näyttörajausta, **ei historiallista GK-laskennan raporttia** eikä lähteiden tilaa.

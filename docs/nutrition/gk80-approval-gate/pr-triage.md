# Avoimien PR:ien katselmointi

Lähtöhavainto2.11.2026: **43 avointa PR:ää**, ei vanhan pyynnön42. Uusi#186 on erillinen suklaa-/skenaariopilotti. Tämän oman Draftin lisääminen kasvattaa määrää yhdellä. Kaikki taulukon43 lähtö-PR:ää jätettiin muuttamatta.

Luokitus on työnjonon suositus,ei GitHub-review tai julkaisuhyväksyntä. `ACTIONABLE_NOW` tarkoittaa konkreettista erillistä seuraavaa tointa,ei mergevalmiutta. `UNKNOWN`-mergeabilityä ei päätelty puhtaaksi. Historiallinen luokitus ei väitä kaikkien PR:n lähdehavaintojen tarpeettomuutta tai kaikkien reseptien julkaisemista; se estää vanhan erän laskemisen nykyiseksi uudeksi katteeksi. Tarkka head,base,Draft/Ready-havainto ja toimenpide on[CSV:ssä](pr-triage.csv). Muuttuvat GitHub-tilat ovat havaintohetken tietoa.

## Tärkeimmät päätökset

- **#182**: erillinen tekninen korjaus3 AFCD-kenttään. Nykyisistä alkuperäistuloksista2 muuttuu; ei uutta GK80-kattavuutta. Pidä tämän paketin reseptijonosta erillään. #185:n Foodin-tietuesinetti ratkaisee vain koko tiedoston turhan riippuvuuden,ei hyväksy#182:n tulosmuutoksia nykyiseen regressiopohjaan.
- **#181 ja#180**: lähdetulkinta ja komponenttikohtainen menetelmätutkimus. AFCD-kenttävirheiden konkretisointi on#182:ssa; yleinen lähdepolitiikka ei ole valmis reseptierä.
- **#169 ja#168**: rajattu kookos-GI-identiteetin korjauspäätös ja US-total-normalisoinnin tekninen korjaus. Kummankin uusi reseptikattavuus tässä katselmoinnissa0.
- **#153**: GitHub ilmoittaa CONFLICTING/DIRTY ja PR on jo Ready(`isDraft:false`),vaikka vanha otsikko/body sanoo Draft. Siihen ei kirjoiteta eikä sitä yhdistetä.20 vanhasta numerotarjouksesta **17 tunnisteella on julkaistu numero** (alkuperäinen tai uudempi GK-only). Bulgogi,bun-cha-hanoi ja carnitas-salaattitacot puuttuvat yhä julkisista numeroista; tämä ei kelpuuta niiden vanhoja syötteitä. Bulgogi on nyt hyväksytty uudella5ae159…-syötteellä; kahden muun esteitä ei avata tässä uudelleen. [Tunnistekohtainen julkisen sivun vertailu](publication-observation.json).
- **#138**: vanhat kanapannupisteet1,076545 ja1,14652 eivät ole nykyisten julkaistujen GK149-versioiden1,06 ja0,74. Julkaistut syötteet2c84c860…/ec40897d… ja niiden omat valmistusrajaukset ovat lähtö. Kumpaakaan ei lasketa uutena.
- **#118**: suunnitelman päätöksiä voi käsitellä erikseen; ei valmistunutta numeerista reseptierää. #186-skenaariotyö kuuluu eri toimeksiantoon.

## Kaikki43 lähtö-PR:ää

| PR | Luokitus | Täsmällinen head (lyhennetty) | Katselmointiperuste |
| --- | --- | --- | --- |
| [#186](https://github.com/ozirix-dev/Reseptit/pull/186) | `SEPARATE_PROJECT` | `c05609b9defb` | Erillinen GK-skenaario-/suklaatehtävä. |
| [#182](https://github.com/ozirix-dev/Reseptit/pull/182) | `ACTIONABLE_NOW` | `924a827b515f` | Erillinen tekninen AFCD-kenttäkorjaus,ei GK80-lisäkattavuutta. |
| [#181](https://github.com/ozirix-dev/Reseptit/pull/181) | `RESEARCH_HOLD` | `88e08d517bb6` | AFCD-lähdetulkinnan tutkimus; kolme kenttävirhettä on rajattu#182:een. |
| [#180](https://github.com/ozirix-dev/Reseptit/pull/180) | `RESEARCH_HOLD` | `fd8bd4d31e6d` | Komponenttikohtainen ravintoarvo-/GK-menetelmäauditointi,ei julkaisuvalmis GK80-erä. |
| [#178](https://github.com/ozirix-dev/Reseptit/pull/178) | `SEPARATE_PROJECT` | `60a6b5c33cb4` | Recipavon tuote-/liiketoimintastrategia. |
| [#176](https://github.com/ozirix-dev/Reseptit/pull/176) | `SEPARATE_PROJECT` | `9e0bab5209e5` | Nutrition Core -arkkitehtuurisuunnitelma. |
| [#174](https://github.com/ozirix-dev/Reseptit/pull/174) | `SEPARATE_PROJECT` | `19939d95d8c9` | SOURCE-01-lähdevaranto-/SQLite-D1-tutkimus. |
| [#172](https://github.com/ozirix-dev/Reseptit/pull/172) | `SEPARATE_PROJECT` | `69a2ca2be732` | Cloudflare-/kuva-/D1-siirtosuunnitelma. |
| [#170](https://github.com/ozirix-dev/Reseptit/pull/170) | `RESEARCH_HOLD` | `87c603bfe5de` | Operaatio141:n15 numerotarjousta ja30 ruoan tutkimus; osa poluista on julkaistu seuraajissa. |
| [#169](https://github.com/ozirix-dev/Reseptit/pull/169) | `ACTIONABLE_NOW` | `e834bb59035d` | Kookosmaidon GI-identiteettiauditointi; rajattu kahden HOLD-sidoksen korjausesitys. |
| [#168](https://github.com/ozirix-dev/Reseptit/pull/168) | `ACTIONABLE_NOW` | `0eacc8f0ba44` | US-total-normalisoinnin erillinen tekninen korjaus. |
| [#166](https://github.com/ozirix-dev/Reseptit/pull/166) | `NEEDS_REBASE_OR_CONFLICT_REVIEW` | `b89a89117156` | Vanhaan main131-tilaan sidotut regressionportit ja päätösraportti. |
| [#164](https://github.com/ozirix-dev/Reseptit/pull/164) | `HISTORICAL_OR_SUPERSEDED` | `e496a1b55810` | Uunikanapastan käytöstä pois kytketty vanha tarkkuus-HOLD-prototyyppi. |
| [#163](https://github.com/ozirix-dev/Reseptit/pull/163) | `HISTORICAL_OR_SUPERSEDED` | `961cdd9af906` | Uunikanapastan aiempi ehdollinen AFCD-pilotti. |
| [#161](https://github.com/ozirix-dev/Reseptit/pull/161) | `RESEARCH_HOLD` | `6f09e0a4b4ca` | AFCD-polyolivaikutuksen aiempi auditointi ja rajattu korjausehdotus. |
| [#160](https://github.com/ozirix-dev/Reseptit/pull/160) | `RESEARCH_HOLD` | `64f2c14ee3b1` | AJO13:n vanha22 reseptin lähdekatselmointi. |
| [#159](https://github.com/ozirix-dev/Reseptit/pull/159) | `RESEARCH_HOLD` | `65f1877812bd` | AJO12:n vanha22 reseptin lähdekatselmointi. |
| [#158](https://github.com/ozirix-dev/Reseptit/pull/158) | `RESEARCH_HOLD` | `bcf214a8a900` | AJO11:n vanha22 reseptin lähdekatselmointi. |
| [#157](https://github.com/ozirix-dev/Reseptit/pull/157) | `RESEARCH_HOLD` | `5d818a013db0` | AJO10:n vanha22 reseptin lähdekatselmointi;1 numero/21 HOLD,NO-GO. |
| [#156](https://github.com/ozirix-dev/Reseptit/pull/156) | `HISTORICAL_OR_SUPERSEDED` | `d31c3a7ae157` | Vanha kahden rajatun C-polyolitapauksen integraatioehdotus,vanha130→132-rajaus. |
| [#155](https://github.com/ozirix-dev/Reseptit/pull/155) | `RESEARCH_HOLD` | `08b69bd974c4` | Mausteiden ja nakkikeiton vanha lähde-/katalogitutkimus. |
| [#154](https://github.com/ozirix-dev/Reseptit/pull/154) | `RESEARCH_HOLD` | `d6d2d35e78df` | Polyolimenetelmän vanha tutkimus ja eristetty vaikutuspilotti. |
| [#153](https://github.com/ozirix-dev/Reseptit/pull/153) | `NEEDS_REBASE_OR_CONFLICT_REVIEW` | `b8ece7ee1e4b` | GitHub CONFLICTING/DIRTY. Vanha20-version erä;17 reseptillä julkaistu numero. |
| [#148](https://github.com/ozirix-dev/Reseptit/pull/148) | `HISTORICAL_OR_SUPERSEDED` | `767f57795f98` | Vanha pinottu AJO6-tutkimus/7 numeroa/8 hyväksyntäaineistoa. |
| [#147](https://github.com/ozirix-dev/Reseptit/pull/147) | `HISTORICAL_OR_SUPERSEDED` | `31816bbe1c24` | Q09:n vanha positiivisten osuuksien korjaus- ja nollanpoistoerä. |
| [#146](https://github.com/ozirix-dev/Reseptit/pull/146) | `HISTORICAL_OR_SUPERSEDED` | `5735e46f3939` | Vanha24 reseptin integraatiohaara. |
| [#145](https://github.com/ozirix-dev/Reseptit/pull/145) | `HISTORICAL_OR_SUPERSEDED` | `1b2fbc7997ca` | Vanha12 reseptin kolmas julkaisupaketti. |
| [#144](https://github.com/ozirix-dev/Reseptit/pull/144) | `HISTORICAL_OR_SUPERSEDED` | `a1628d4f9ad7` | Vanha pinottu AJO5-tutkimus ja48 aiemman auditointi. |
| [#143](https://github.com/ozirix-dev/Reseptit/pull/143) | `HISTORICAL_OR_SUPERSEDED` | `1f0579b843d2` | Vanha12 reseptin integraatio. |
| [#142](https://github.com/ozirix-dev/Reseptit/pull/142) | `HISTORICAL_OR_SUPERSEDED` | `d01b7cd050de` | Vanha8 malliversion toinen julkaisuintegraatio. |
| [#141](https://github.com/ozirix-dev/Reseptit/pull/141) | `HISTORICAL_OR_SUPERSEDED` | `a332822fd29d` | Vanha pinottu AJO4/26 numerotarjousta. |
| [#140](https://github.com/ozirix-dev/Reseptit/pull/140) | `HISTORICAL_OR_SUPERSEDED` | `283de58e144a` | Vanha neljän reseptin ensimmäinen julkaisuintegraatio. |
| [#139](https://github.com/ozirix-dev/Reseptit/pull/139) | `HISTORICAL_OR_SUPERSEDED` | `c660cc217bdd` | Vanha pinottu AJO3V2/14 ehdotusta. |
| [#138](https://github.com/ozirix-dev/Reseptit/pull/138) | `HISTORICAL_OR_SUPERSEDED` | `0eb8747069a5` | Kaksi vanhaa kanapannuehdotusta korvattu myöhemmillä julkaistuilla GK149-versioilla. |
| [#137](https://github.com/ozirix-dev/Reseptit/pull/137) | `HISTORICAL_OR_SUPERSEDED` | `2511f00a38e3` | Vanha kahdeksan reseptin liemi-/kastiketuotetutkimus. |
| [#136](https://github.com/ozirix-dev/Reseptit/pull/136) | `HISTORICAL_OR_SUPERSEDED` | `61a4563a997a` | Vanha pinottu AJO2/4 ehdollista pistettä. |
| [#135](https://github.com/ozirix-dev/Reseptit/pull/135) | `HISTORICAL_OR_SUPERSEDED` | `bff8c6a1799c` | Ensimmäisen20 reseptin suljettu pilotti. |
| [#134](https://github.com/ozirix-dev/Reseptit/pull/134) | `RESEARCH_HOLD` | `edabab80ec03` | GK2.1R3:n hiilihydraatti-/lähdevarmennus,0 VERIFIED_TOTAL. |
| [#133](https://github.com/ozirix-dev/Reseptit/pull/133) | `NEEDS_REBASE_OR_CONFLICT_REVIEW` | `020b665582f4` | Vanhaan83/326-mainiin sidotut kahdeksan reseptin lähdekorjaukset ja testi. |
| [#119](https://github.com/ozirix-dev/Reseptit/pull/119) | `SEPARATE_PROJECT` | `2ae46f59c9b9` | GK-suodattimien erillinen käyttöliittymätyö. |
| [#118](https://github.com/ozirix-dev/Reseptit/pull/118) | `RESEARCH_HOLD` | `0346e0facbbd` | Design-only vaihteluväli-/luokka-/skenaariosuunnitelma. |
| [#116](https://github.com/ozirix-dev/Reseptit/pull/116) | `SEPARATE_PROJECT` | `61d19c6148a1` | Dependabot/Vite-riippuvuuspäivitys. |
| [#100](https://github.com/ozirix-dev/Reseptit/pull/100) | `SEPARATE_PROJECT` | `930c39825151` | Nutritics-integraation erillinen arviointi. |

## Myöhempi siivous erillisellä luvalla

Ensimmäinen mahdollinen sulkemisesitys on **#138:n Draft** vasta,kun omistaja on hyväksynyt julkaistujen seuraajaversioiden säilyttämisen ja lähdeaineiston pysyvän viitteen. Vanhojen julkaisuintegraatioiden#140,#142,#143,#145,#146 sekä uunikanapastapilottien#163/#164 sulkemista voi arvioida tämän jälkeen täsmällisin diffein ja omistajan luvalla. Niiden kaikkien lähdesisältöä ei väitetä kokonaan tarpeettomaksi tämän jonoluokituksen perusteella.

#153 on jo Ready; sen myöhemmästä sulkemisesta tai muusta elinkaaresta tarvitaan oma päätös. Sen vanhaa integraatiota ei mergeä eikä rebasea tässä. Lähdetutkimusten sulkeminen ei ratkaise niiden HOLD-esteitä. Ei sulkemisia,poistoja,Ready-muutoksia,hyväksyntäreviewta tai toisen PR:n päivityksiä tässä ajossa.

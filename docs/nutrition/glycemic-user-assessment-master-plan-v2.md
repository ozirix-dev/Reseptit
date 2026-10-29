# Käyttäjälähtöinen GK-arviointi – pääsuunnitelma v2

R0-ehdotus; ei laskentapolitiikan tai UI:n hyväksyntä. As of 2026-10-29 Europe/Helsinki. Main 16a9c0444ff7b9d6ea61b20abd2c31b0d0ae9fa2; 326/85/241/45.

## PR #118 ja #119

[Avoin PR #118](https://github.com/ozirix-dev/Reseptit/pull/118) on design-only Draft; sen roadmap on sen omassa haarassa. Säilytä molempien boundsien lähteistys; tuntematon ei ole nolla; SD/SEM ei automaattisesti rajaa; GI100 ei yleinen yläraja; legacy range on eri asia; skenaariot eivät muuta alkuperäistä reseptiä; fingerprints/vanheneminen; sama luokittelufunktio; vaiheistus ja stop-ehdot. PR #118:aa tai sen haaraa ei muokata.

PR #118:n 325/134/191/42 on vanhentunut; uusi main 326/85/241/45. Sen vanha 30 kohteen P0 siirtyy R1:een, koska tämä toimeksianto vaatii 12 reseptin R0-feasibilityä. CARBOHYDRATE_ONLY lisätään kuudenneksi tilaksi. Tavoitteena hyödyllinen arvio tai selkeä blocker, ei numeerinen arvo jokaiselle. [PR #119](https://github.com/ozirix-dev/Reseptit/pull/119) pysyy nykyisten hyväksyttyjen pisteiden suodattimena; ei uusia suodattimia tässä.

Tietomallissa pidä versionoitu kind, lähde/syöte/reseptifingerprintit, blockerit, luokan vakaus, skenaariot ja publication state. Tarkka skeema jätetään P1:een; nykyistä GlycemicLoadResultiä ei muuteta.

## Mittarit ja lähdelaatu

Raportoi erikseen POINT-kattavuus; käyttökelpoinen GK (POINT/RANGE/CLASS_ONLY/täsmälliset skenaariot); koko annoksen CHO; läpinäkyvä arvio/blocker; luokan vakaus; false-confidence-riskit. Ei yhdistelmäprosenttia. Turvallisuusvirheen hyväksymisraja nolla; muut KPI-rajat päätetään R1/P1:ssä. R0:n 12 kohteesta ei ekstrapoloida.

Lähteen laatu, ruoka/tuote/valmistus, massa/annos ja koostumus pysyvät erillään. Merkittävien tärkkelys-/sokerilähteiden lähdeauditia ei kevennetä. Pienten rivien priorisointi perustuu lähteistettyyn vaikutukseen. Arvioi tapauskohtaisesti lajike, maa, kypsyys, varastointi, raaka/kypsä, kuiva/märkäpaino, veden imeytyminen/hävikki, aika/lämpö, gelatinisaatio, jäähdytys, rasva/proteiini/kuitu ja tuote. Luokittele vaikutus koostumukseen, pisteeseen, luokkaan tai blockeriksi.

RANGE vaatii CHO- ja GI-rajat samalle toteutuvalle tuotteelle/valmistukselle ja yhteensopivat riippuvuudet. Ei 0–100 oletusta tuntemattomalle GI:lle. CLASS_ONLY vain jos kaikki vaihtoehdot pysyvät nykyisessä samassa luokassa. 1g/2g rajat säilyvät R0:ssa legacy-toimitussääntönä, ei kliinisenä rajana.

## AJO 2.0B:n 33 reseptiä

[2B:n vaikutusraportti](https://github.com/ozirix-dev/Reseptit/blob/codex/glycemic-dairy-fruit-impact-review/docs/nutrition/glycemic-dairy-fruit-source-impact-review.md) ja JSON ovat tutkimushaarassa, ei mainissa. Dairy35: 125 sidontaa, 98 reseptiä, 33 laskettua; Fruit51: 51/45/7; unioni 33, B8/C25. 2B toteaa B:t vain poistodiagnostiikassa laskettaviksi eikä koko ketjua hyväksytyksi. C:llä on GI-estettä. Epävarmuusmalli ei korjaa väärää lähdesidontaa.

R2 on erillinen lähdekorjaus-PR. Tarkista 33 reseptiä yksi kerrallaan, säilytä before-arvot/fingerprints, auditoi muut aktiiviset sidonnat, hyväksy POINT vain sopivalla lähteellä. RANGE/CLASS_ONLY vasta hyväksytyllä myöhemmällä mallilla; muuten perusteltu CHO_ONLY tai UNAVAILABLE. Ei automaattista kaikkien 33 arvon poistoa. Selvästi harhaanjohtava julkaistu arvo nostetaan kiireelliseksi suojaus-PR:ksi.

## UI myöhemmin

Kortilla CHO jos luotettava, state, mahdollinen luokka ja lyhyt epävarmuus. Tarkemmalla sivulla lähde, suurimmat CHO/GK-ajurit, epävarmuuden syy, annoskoon vaikutus ja käyttörajoitus. FI/EN/SV/TH R4:ssä. UNAVAILABLE ei nolla; skenaario ei ole yleinen reseptiarvo; ei suodatin per state.

## Vaiheistus

| Vaihe | Tavoite | Portti |
|---|---|---|
| R0 nyt | Policy, roadmap, 12 read-only pilot | Vain docs; production inputs, sources, UI ennallaan |
| R1 | PR #118 kerrostettu 30 reseptin näyttöpilotti, 6 viidestä ryhmästä | Kohteet lukitaan; evidence/status/blockers; ei koodia/julkaisua |
| R2 | GI35/GI51 lähdekorjaus, 33 laskettua ja muut bindingit | Per-recipe before/after; regressiot; riippumaton review; tarvittaessa R2A/B |
| R3 | Versionoitu rinnakkaismoottori | Pure functions; vain lähteistetyt bounds; epävarma unavailable; legacy ennallaan |
| R4 | Rajattu UI ja FI/EN/SV/TH tekstit | Ymmärrettävyys, a11y, mobiili/selaimet/search/SEO |
| R5 | Tuotannon hallittu laajennus | Omistajan lupa, koko regressio, CI, deploy- ja rollback-varmistus |

Jokainen vaihe omana ajona ja Draft PR:nä. Stop jos baseline muuttuu, unknown muuttuu nollaksi, lähteetön bound syntyy, pilot-arvo vuotaa, lääketieteellinen väärintulkinta tai testit epäonnistuvat.

## R0 / avoimet päätökset

Pilotin 12 kohteen tiedot ovat Markdownissa ja JSONissa. R0 ei hyväksy uusia arvoja/ranges/classes/skenaarioita. Omistaja hyväksyy ennen R1:tä arviointityypit/termit, bound-semantics, class-kynnys, CHO_ONLY portit, KPI-rajat ja 1g/2g jatkoarvion.

## Nykyisen toleranssin vaihtoehtojen päätösesitys

- **A — nykyinen tiukka pistemalli:** säilytä vertailuna ja julkaistun baselinen lähteenä; 1 g / 2 g ovat toimituksellisia, eivät lääketieteellisiä rajoja.
- **B — lähteistetty GK-herkkyys:** voi vähentää turhaa estämistä pienissä osuuksissa, mutta vain jos GI:n ja CHO:n todelliset rajat lähteistetään kyseiselle ruoalle ja valmistukselle. Tuntemattomasta GI:stä ei voi johtaa vaikutuksen ylärajaa; R0:n aineistosta ei voi laskea kuinka monta reseptiä aukeaisi tai kuinka paljon vaihteluväli olisi.
- **C — skenaario/luokka:** käyttäjälle lupaavin lisä silloin, kun vaihtoehdot ovat aidosti nimettävissä tai koko hyväksytty vaihteluväli pysyy yhdessä luokassa. Tässä 12 kohteen R0:ssa ei hyväksytty uutta rangea eikä vakaata luokkaa. CHO_ONLY voi olla käyttökelpoinen itsenäinen tieto, mutta se ei ole GK-kattavuutta.

12 kohteesta kaksi vaikutusjoukon ulkopuolista POINT-arvoa säilyy nykyisen mallin vertailupohjana. Kahdeksan B/C-pisteen tuleva lähdekorjaus ei ole vielä hyväksytty; CHO_ONLY mahdollisuus riippuu täydellisestä koostumuksesta. Paprikauunimunakkaat ei tällä tiedolla täytä ehtoa. R0 ei tue määrällistä arviota uusien hyödyllisten GK-arvioiden määrästä, luokkamuutoksista tai riskin/hyödyn suuruudesta. Näitä ei ekstrapoloida 326 reseptiin.

RANGE/CLASS_ONLY ylläpito edellyttää resepti-/lähde-/syötefingerprintteja, preparation-specific evidenssiä ja muutosten jälkeistä uudelleenarviointia. Tämä on nykyistä point-mallia raskaampi ylläpitopolku; tarkkaa tunti-/reseptiarviota ei ole mitattu. R1:n pitää mitata lähteiden löytämiseen, review'hun ja uudelleenlaskentaan kuluva aika.

## Käännösten suunnittelutermit

Policy-dokumentissa on FI/EN/SV/TH termiehdotukset kuudelle tilalle. Ne ovat alustavia; natiivi- ja käyttäjäymmärryksen review tehdään R4:ssä. R0 ei muuta translation source files -tiedostoja.

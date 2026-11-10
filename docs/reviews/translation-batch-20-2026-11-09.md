# Käännöserä 20 – tarkka FI → EN/SV/TH, 9.11.2026

**Kohde:** 20 julkaistua suomenkielistä reseptiä, 60 puuttuvaa kieliversiota.
**Lähtöcommit:** `ade461048ea138cd4f6a34340e8a53df79532bd7` (main).
**Työhaara:** `feat/i18n-batch20-verified-20261109`.
**Julkaisutila:** Draft / STOP, kunnes kaikki vaaditut tarkistukset ovat todistetusti PASS.

## Rajaus (20 reseptiä)

1. `reseptit/paaruoat/chili-con-carne-kukkakaaliriisi.md`
2. `reseptit/paaruoat/harira.md`
3. `reseptit/paaruoat/kana-enchilada-kukkakaalivuoka.md`
4. `reseptit/paaruoat/kana-fajita-pelti.md`
5. `reseptit/paaruoat/kanakeitto-pinaatti-sitruuna.md`
6. `reseptit/paaruoat/kanapyorykat-tomaattikastike.md`
7. `reseptit/paaruoat/kreikkalainen-kanavuoka-oliiveilla.md`
8. `reseptit/paaruoat/lanttulaatikko-kermainen.md`
9. `reseptit/paaruoat/lindstrominpihvit-kaalilla.md`
10. `reseptit/paaruoat/maksalaatikko-kukkakaalilla.md`
11. `reseptit/paaruoat/shoyu-kanakeitto-konjac.md`
12. `reseptit/paaruoat/silakkapihvit-tilli-kermakastike.md`
13. `reseptit/paaruoat/uunikanapasta-kesakurpitsa.md`
14. `reseptit/jalkiruoat/vhh-brita-kakku.md`
15. `reseptit/paaruoat/bulgogi.md`
16. `reseptit/paaruoat/bun-cha-hanoi.md`
17. `reseptit/paaruoat/carnitas-salaattitacot.md`
18. `reseptit/paaruoat/falafel.md`
19. `reseptit/paaruoat/kimchi-jjigae.md`
20. `reseptit/paaruoat/jerk-kana.md`

Jokaiselle tulee `kaannokset/{en,sv,th}/<sama kategoria>/<recipe_id>.md`.
Suomenkielistä alkuperäistä ohjetta, annoksia, raaka-aineiden määriä, numeroarvoja,
GK/GI-laskentaa, elintarvikelähteitä ja ruokalajin merkitystä ei saa muuttaa
käännöstyön varjolla. Mahdollinen lähtötekstin ongelma kirjataan HOLDiin
sen sijaan, että virheellinen tieto käännettäisiin hyväksyttäväksi.

## Laatuportti ilman ihmiskielentarkistusta

1. **Lähteen kelpoisuus:** hyväksy vain `status: published`, oikea reseptisisältö
   ja 0 ristiriitaista tai luetteloimatonta olennaista ainesosaa. Vanhat
   pelkät otsikkoraakileet (`# otsikko`) ja keskeneräiset FI-reseptit eivät
   kuulu julkaisukäännöserään.
2. **Kolmen kielen rivi-riviltä vertailu:** oikea eläin-/kasvilaji, aines,
   määrä, yksikkö, valmistustapa, marinointi, lämpötila, kypsyys,
   järjestys, aika, allergeenit, kieltomuodot, säilytys ja lisukkeet.
3. **Takaisinkäännös:** etenkin TH-ohjeen jokainen valmistusvaihe ja
   epäselvä ainesosatermi takaisinkäännetään FI:ksi; havaittu
   ristiriita korjataan ja vertailu uusitaan.
4. **Rakenteet & reitit:** säilytä `recipe_id`, `url_slug`,
   `source_recipe`, `translation_of`, `servings`, `time_total_min`,
   kuvan tiedostonimi/mitat, ravintoarvot, myös `null`.
5. **Todennettava AI-merkitysvertailu:** kirjaa ajantasaiset SHA-256
   merkitystiivisteet `meta/kaannokset/codex-review-evidence.json`-rekisteriin
   vasta **todella tehdyn** vertailun jälkeen. `human-review-evidence.json`
   pysyy koskemattomana; ihmistarkistusta ei väitetä tehdyksi.
6. **CI pakollinen:** `validate:changed-content`, `test:translations`,
   `translation-audit --strict`, normaali PR-CI / build, reittitestit
   ja GK-lähdekytkentöjen säilyminen. Tarkista CI juuri julkaistavalle HEADille.
7. **Fail closed:** yksikin ratkaisematon P0/P1, lähdevirhe, vanhentunut
   merkitystiiviste tai punainen pakollinen CI pitää PR:n Draftissa.
   Ei auto-mergeä, ei tuotantodeployta.

## Lähtötekstien havainto, erävalintaa edeltävä tarkistus

Osa julkaistuista aamiaisresepteistä sisältää yleisiä, reseptiin kuulumattomia
papu-/tofu-/lämpimän pohjan valmistusvaiheita. Esimerkiksi
`reseptit/aamupalat/lahi-ita-labneh-kulho-zaatarilla.md` kehottaa
lisäämään oliiviöljyä, vaikka sitä ei ole ainesosalistassa.
Niitä **ei** oteta tähän erään ilman alkuperäisen lähteen erillistä korjausta.

## Nykytila – 9.11.2026: vain FI-lähde-HOLDien korjausjono

Käännöserä A jakautui kahdeksi erilliseksi PR:ksi:

- **[PR #364](https://github.com/ozirix-dev/Reseptit/pull/364)** omistaa 12 AI:n vertaamaa FI-reseptiä ja 36 EN/SV/TH-julkaisuehdokasta. Nämä 36 kielitiedostoa on **poistettu tästä PR #357:stä**; samaa kielitiedostoa ei enää muuteta kahdessa haarassa.
- **Tämä PR #357** omistaa vain **8 FI-lähde-HOLDia / 24 EN/SV/TH-Draftia**. Niitä ei julkaista ennen alkuperäisen suomenkielisen lähteen korjausta ja uutta AI-merkitysvertailua. `human-review-evidence.json` ja yhteinen V2-rekisteri eivät muutu.

### Jäljellä olevat 8 HOLDia

1. `falafel` – salaatti/pita eivät kuulu määrälliseen ainesosaluetteloon.
2. `jerk-kana` – kokonaisajan ja marinoinnin/paiston välinen ristiriita.
3. `kimchi-jjigae` – riisilisukkeen laskentaan sisältyminen puuttuu.
4. `lanttulaatikko-kermainen` – 55 g kananmunan kuorettomuus epäselvä.
5. `lindstrominpihvit-kaalilla` – pihvien ja kaalin yhteisen voin jakautuminen.
6. `maksalaatikko-kukkakaalilla` – rasvan jakautuminen paistoon ja vuoan voiteluun.
7. `shoyu-kanakeitto-konjac` – `cooking_method` sanoo paistaminen, ohje keittäminen.
8. `vhh-brita-kakku` – kuiva-aineiden ja rasvaseoksen yhdistämisen vaihe puuttuu.

**Toteutunut tiedostoeristys:** 36 julkaisuehdokkaaseen siirtynyttä locale-tiedostoa poistettu tästä haarasta Git-tiedostotasolla, ei pelkkä dokumentaation jakaminen.

### Julkaisuportti

Vasta kun korjattu FI-lähde on omassa PR:ssä hyväksytty ja GK-/ravintosinetit ennallaan, kirjoitetaan uusi EN/SV/TH-käännös. Lopullinen julkaisu edellyttää kolmen kielen sisältövertailua, ajantasaisia SHA:tä, `source-hold`-merkinnän purkua todistettavasti, käännös- ja GI/GK-testejä sekä viimeisen HEADin CI-vihreää tulosta. Ei auto-mergeä eikä koepaistoväitettä.

## Päivitys 10.11.2026 – A8:n 24 korjattua kieliluonnosta

Kaikki kahdeksan FI-reseptiä ovat edelleen täsmälleen historiallisissa GI/GK-lähdeversioissaan. [PR #361](https://github.com/ozirix-dev/Reseptit/pull/361) sisältää nyt kahdeksan SHA-lukittua **julkisen FI-näyttöversion** kokkikorjausta, ei yhtään kanonisen FI:n muutosdiffiä. PR #361:n CI [#42731050756](https://github.com/ozirix-dev/Reseptit/actions/runs/42731050756) SUCCESS, mutta sitä ei ole yhdistetty Pagesin [issue #376](https://github.com/ozirix-dev/Reseptit/issues/376) vuoksi.

Nämä 24 EN/SV/TH-tekstiä on päivitetty vastaamaan korjattua FI:n julkista merkitystä (jerk-kana 130 min / vähintään 75 °C, shoyu keittäminen / 75 °C, kaksi reseptiä voimäärien jako, lantun kuoreton muna, falafelin ja kimchi-keiton laskennan ulkopuoliset lisukkeet, Britan kuivien aineiden lisäys). **Kaikki status: draft**, nolla uutta ravintoarvoa, ei valheellista ihmiskatselmointia. Uudet käännösten sisältö-SHA:t ovat päivätyssä [ledgerissä](translation-batch20-digests-2026-11-09.json); FI:n semanttiset SHA:t säilyivät identtisinä aiempiin merkintöihin. **Staging-vaihe ei ole julkaisuhyväksyntä.**

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

## Työtilanne

Toteutus 9.11.: 4/20 lähdereseptistä käännetty kaikille kolmelle kielelle,
yhteensä **12 käännösluonnosta** (`status: draft`), ei julkaisua.

- `chili-con-carne-kukkakaaliriisi`: EN/SV/TH draft
- `kanapyorykat-tomaattikastike`: EN/SV/TH draft
- `harira`: EN/SV/TH draft
- `kana-fajita-pelti`: EN/SV/TH draft
- 12/12: käännösrivin määrä ja yksikkö samat kuin lähteessä, valmistusvaiheiden
  lukumäärä sama; kieli, `translation_of`, `source_recipe`, kuva ja mittasuhteet kunnossa
  (GitHubin tiedostosisällöistä tehty erillinen tarkistus).
- Kana-fajitan 200 °C ja vähintään 75 °C löytyvät kaikista kolmesta versiosta.
- Nämä testit eivät ole kattava merkitystarkistus eivätkä CI-PASS.
- Ensimmäinen CI pysähtyi vain tämän muistion kolmen rivin loppuvälilyönteihin.
  Ne poistettiin; uuden HEADin tulos tarkistetaan erikseen.

**Julkaisun portit edelleen auki:** 16 reseptiä/48 käännöstä,
itsenäinen täydellinen AI-merkitysvertailu kaikille, nykyiset V2-SHA:t,
suomenkieliset linkkimetat, full CI/build ja lopullinen julkaisuvaltuus.

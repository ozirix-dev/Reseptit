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

## Työtilanne 9.11.2026 – jatkotarkistus

**15/20 reseptiä; 45 EN/SV/TH-käännösluonnosta (`status: draft`).**
Nämä ovat yksinomaan PR #357:n haarassa, eivät tuotannossa. Vain
vastaavien suomenkielisten lähteiden julkaistu tila on `published`.

Valmiit luonnokset (kolme kieltä kustakin):

- `chili-con-carne-kukkakaaliriisi`
- `harira`
- `kana-enchilada-kukkakaalivuoka`
- `kana-fajita-pelti`
- `kanakeitto-pinaatti-sitruuna`
- `kanapyorykat-tomaattikastike`
- `kreikkalainen-kanavuoka-oliiveilla`
- `shoyu-kanakeitto-konjac`
- `silakkapihvit-tilli-kermakastike`
- `uunikanapasta-kesakurpitsa`
- `bulgogi`
- `bun-cha-hanoi`
- `carnitas-salaattitacot`
- `kimchi-jjigae`
- `jerk-kana`

**Viisi lähde-HOLDia, 15 käännöstä aloittamatta ennen FI-korjausta:**

- `lanttulaatikko-kermainen`: Ainesosarivillä `55 g kananmunaa kuoretta` on epäselvä kuoren mukanaolo; myös lähtötekstin valmistus on täsmennettävä ennen kieliversiota.
- `lindstrominpihvit-kaalilla`: Ainoa 2 rkl voimäärä mainitaan sekä pihvien että kaalin paistossa; selvennä rasvan jakautuminen muuttamatta laskettuja määriä.
- `maksalaatikko-kukkakaalilla`: Sama 2 rkl voita käy sipulin kuullotukseen ja vuoan voiteluun, mutta jakoa ei ole dokumentoitu; täsmennä toteutus.
- `vhh-brita-kakku`: Vaihe 3 sekoittaa mantelijauhon ja leivinjauheen mutta ei sano, missä vaiheessa ne yhdistetään voin, makeutusaineen ja keltuaisten seokseen.
- `falafel`: Ohje käskee tarjoamaan salaatin ja pitaleivän kanssa; näille ei ole ainesosarivejä eikä vahvistusta niiden osuudesta ravintolaskennassa.

**Lisähuomiot jo käännetyistä, ennen julkaisua tarkennettavat:**

- `kimchi-jjigae` mainitsee tarjoamisen riisin kanssa mutta riisi puuttuu
  ainesosaluettelosta. Käännösluonnoksissa kehotus on säilytetty,
  mutta lähdetekstin annos-/ravintoarvoraja tarvitsee selvennyksen.
- `jerk-kana`: lähteen `time_total_min: 90`, mutta vähintään tunnin marinointi
  ja 45–55 minuutin uunikypsennys kestävät yhteensä yli 90 minuuttia.
  Kieliversiot säilyttävät lähteen todelliset valmistusvaiheet.

**Mikä on todennettu ja mikä ei:**

- Neljän ensimmäisen reseptin 12 käännösparia verrattiin GitHubin
  FI-lähteisiin määrien, yksiköiden, rivien ja valmistusvaiheiden lukumäärän,
  kuva-/lähdepolkujen ja mittojen osalta; poikkeamia 0.
- Lisäerät on kirjoitettu määrä- ja ainesosalistojen säilyttämiseksi;
  niiden täydellistä rakenteellista ja semanttista auditointia
  **ei vielä merkitä hyväksytyksi**.
- PR-CI läpäisi erän edellisen julkaisua odottavan HEADin
  `0c13ac106e9f4d97b92cdc656bcc08eeec91040b`:
  [run 42646074570](https://github.com/ozirix-dev/Reseptit/actions/runs/42646074570).
  Se oli **rajattu** CI-ajo. Viimeisimmän HEADin tulos tarkistetaan erikseen.
- `status: draft` tarkoittaa, etteivät kaikki nykyiset julkaistujen
  kieliversioiden auditointitarkistukset vielä kohdistu näihin tiedostoihin.
  PASS ei siis tarkoita tarkistettua tai julkaisukelpoista käännöstä.
- V2-merkitystiivisteitä ei ole kirjattu ilman todistettua lopullista
  lähdevertailua; `human-review-evidence.json` pysyy koskemattomana.
- Rinnakkaisessa PR #356:ssa on eri reseptilista; tämä PR ei kirjoita siihen
  eikä erillisen FI-laatutarkistuksen tiedostoihin.

**Seuraava julkaisuportti:** ratkaise FI-lähteiden HOLDit omassa
laatutarkistuksessa, täydennä puuttuvat 15 käännöstä ja tee kaikille 60
lähde- ja kielipareille merkitysvertailu sekä hash-sidokset; sen jälkeen
suomenkieliset linkkimetat, `status: published` ja täysi kohdennettu
validointi, tavanomainen build ja täyden HEADin CI.
P0/P1 tai punainen testi pysäyttää julkaisun.

# Issue #404 / #46 + #47: feta, öljyn saanto ja pinaatin GK-erottelu

**21.11.2026 – rajattu toimituksellinen lähdekatselmointi / EI uutta makro- tai GK-hyväksyntää.**

- Lähtö-`main`: `3ab74dac7ef3b41163b7098690ebfa5d6740fee4` (PR #769:n CI PASS).
- Reseptit: `valimerellinen-menemen-fetalla` (C13 #46) ja `valimerellinen-pinaatti-fetashakshuka` (C13 #47).
- Nykyisten kanonisten FI-blobien SHA:t: `6a767558edc1ee37372f9029ca4ea88c6f129746` ja `3e2882523e98b4ab681c97d8a95a5e6c59f5a7bb`. Niitä tai EN/SV/TH-raakatekstejä **ei muuteta**.
- Aiempi [2/2 + 6/6 aritmetiikka-/kielikatselmointi](2026-11-21-issue404-menemen-shakshuka-gates.md) ja [PR #768](https://github.com/ozirix-dev/Reseptit/pull/768) todennettu.
- **Tässä erässä näkyvä muutos:** `site/scripts/public-recipe-copy-r2.ts` lisää kahdelle reseptille FI/EN/SV/TH-kielisen **laskentaoletukset selittävän julkisen merkinnän** `nutritionBasis`-projektiossa. Uusi testi pinnaa kaikki kahdeksan raakasisältöä ja tarkistaa, että selitteet todella näkyvät sivuston generoidussa sisällössä. Tämä on **esitystiedon oikaisu**, ei uusi laskenta.

## 1. Fetan lähdesoveltuvuus – päätös

Nykyiset `docs/nutrition/calculations/*.json` -laskelmat käyttävät molemmissa koko kahden annoksen erässä 150 g:n feta-ainesosaa ja täsmälleen [Fineli Release 20:n tietuetta 11211](https://fineli.fi/fineli/api/v1/foods/11211): **vuohenmaitofeta, 25 % rasvaa, suolaliemessä**. Lähteen komponentit per 100 g ovat tämän laskenta-aineiston mukaan:

| Fineli 11211, per 100 g | Per 150 g koko reseptissä | Per annos kahdesta |
| --- | ---: | ---: |
| Rasvaa 25 g | 37,50 g | 18,75 g |
| Proteiinia 18 g | 27,00 g | 13,50 g |
| Saatavilla olevaa hiilihydraattia 1,2 g | 1,80 g | 0,90 g |

**Ratkaisu laskennallisen vertailun käyttöön:** julkaistun ainesluettelon sana `feta` kuvaa tuoteryhmää, ei nimenomaisesti tätä tuotemerkkiä tai mitattua erää. Yleiseen koostumustietoon perustuva ravintoarvio on mahdollinen, kun **valittu mallituote ja sen poikkeamaraja kerrotaan julkisessa näkymässä**. Ruokavirasto sallii ravintoarvotietojen perustuvan ainesosien tunnettuihin keskiarvoihin tai yleisesti hyväksyttyyn tietoon (ks. [Ravintoarvomerkintä](https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/pakkausmerkinnat/ravintoarvomerkinta/)). Yksilöllinen feta, erityisesti eri rasvapitoisuus tai eri maidot, voi muuttaa lukua. **Ei merkitä millekään satunnaiselle kaupan fetalle täsmälleen Fineli 11211:n arvot.** Mitään uutta tuotemerkkiä tai käyttölupaa ei tässä ole hankittu.

Molempien muiden vertailuaineiden perusta: 2 kananmunaa á 55 g syötävää osaa (Fineli 858), 1 tomaatti = 125 g (Fineli 352), menemenin vihreä paprika = 170 g (Fineli 387), shakshukan 100 g raaka täysikasvuinen pinaatti (AFCD **F008761**), sekä neutraali paistoöljy Fineli 541. **Grammapainot ovat laskentaoletuksia, eivät keittiössä punnittuja yksittäisiä kasviksia.** Tuotteen valinta/annoskoko ilmoitetaan selitteessä; tätä ei siirretä perustelematta merkkituotteelle.

## 2. Öljyn imeytymisen / pannuun jäämisen herkkyys

Molempien reseptien 1 rkl öljyä on laskentamallissa **13,5 g koko kahden annoksen erää**; Fineli 541 ilmoittaa rasvaa **99,9 g / 100 g**. Malli olettaa, että kaikki paistoöljy syödään – kyse ei ole rasvan imeytymisestä laboratoriomitatulla retention-kertoimella.

- 13,5 g × 0,999 = **13,4865 g rasvaa koko erässä** eli **6,74325 g per annos**.
- Jos vain puolet öljystä päätyisi ruokaan, per annos olisi laskennallisesti **3,371625 g rasvaa vähemmän** kuin julkaistussa mallissa.
- Jos ei yhtään öljyä päätyisi annoksiin, erotus olisi **6,74325 g rasvaa/annos**.
- Esimerkkilaskelma, ei uusi julkaistava vaihtoehto: nykyinen menemen **31,02 g** rasvaa/annos voisi pelkän tämän oletuksen muuttamisen vaikutuksesta olla noin 27,65 g (puolet) tai 24,28 g (ei öljyä); shakshuka **30,91 g** vastaavasti 27,54 g tai 24,17 g.

**Päätös:** näitä vaihtoehtoja **ei** tehdä uusiksi ravintoarvoiksi, koska paistorasvan todellista jäljelle jäävää massaa ei ole mitattu eikä luotettava tarkka kerroin ole käytettävissä. Julkisessa selitteessä kerrotaan sen sijaan laskennan kattavan **koko ilmoitetun öljymäärän**, ja pannulle jäävä öljy voi laskea annoksen rasvaa. Tämä on konservatiivinen malliolettama rasvan laskennassa, ei mitattu saanto.

## 3. Shakshukan GK:n eri pinaattitietue

Repon `docs/nutrition/gk-reviewed-portions.json`-rekisterin 18.11. tarkistettu tapaus viittaa historiallisen GK-laskennan pinaattitietueeseen **AFCD F008749** (raaka baby spinach, 0 g saatavilla olevaa HH:ta / 100 g). Nykyinen reseptin neljän makron ravintoarvio käyttää **AFCD F008761** (raaka täysikasvuinen pinaatti, 0,6 g/100 g). Reseptin 100 g:n koko erän pinaatista ero on **0,6 g saatavilla olevaa hiilihydraattia koko erässä**, siis **0,3 g / annos**.

**Päätös:** tämä ero ei tarkoita, että historiallista GK-lukua voisi korjata lisäämällä 0,3 GK-yksikköä. GK edellyttää GI-soveltuvuuden ja annoksen katselmointia; hiilihydraattigramma ei ole GK-yksikkö. Vanhan GK:n lähdesidoksessa tomaatti ja feta muodostivat laskennallisen GK-arvion, ja pinaatti oli oletettu nollahiilihydraattiseksi. Nykyinen eri lähdetietue ei ole automaattinen uuden numeerisen GK:n hyväksyntä. **Säilytetään vanha GK ja sen erillinen käyttöraja muuttumattomina**, mutta tehdään ero kuluttajalle näkyväksi myös ravintoarvion oletuksissa. Kummankaan ruoantyypin GK ei ole yksilöllinen glukoosivasteen tai lääkityksen ennuste.

## 4. Julkisen FI/EN/SV/TH-näytön sidonta ja jäljellä olevat portit

- Kaikille **8 reitille** lisätään samaa merkitystä vastaavat käännökset: rasvapitoisen vuohenmaitofetan malliarvo, syötävien kananmunien ja kasvisten kappalemassat sekä öljyn kokonaan mukaan laskeminen. Shakshukan kaikissa neljässä on lisäksi GK-/pinaattitietue-eron rajaus.
- Nämä ovat **public copy -projektiossa** (`reviewedRecipeCopy(...).nutritionBasis`) eikä `reseptit/`-, `kaannokset/`-, `docs/nutrition/calculations/`-, `gk-reviewed-portions.json`- tai GK-historiarekisterien muutoksia. Niiden aikaisemmat hyväksyntä-SHA:t säilyvät.
- `site/tests/issue404-egg-public-nutrition-scope.test.ts` todentaa alkuperäisten kahdeksan Git-blobin pysyvän täsmällisinä, tarvittavan selitteen kaikilla kielillä sekä shakshukan historiallisen GK-lähde-eron eksplisiittisen kuvauksen.
- Jäljellä hyväksyntäportteina: tarvittaessa oikean fetatuotteen yksilöinti, todellisen paistoöljyn retention tai hyväksytyn yleislaskentaoletuksen toimituksellinen lopullinen päätös, itsenäinen GK:n GI-/lähdesoveltuvuuden arvio ja **tuotannon kahdeksan live-HTTP-reitin tarkistus suhteessa julkaistuun Cloudflare-SHA:han**. Näistä ei tehdä tässä valheellista PASS-päätöstä.
- Tuotantoverifikaattorin kahdeksan reitin vertailu tuli `main`iin [PR #769](https://github.com/ozirix-dev/Reseptit/pull/769) kautta, mutta itse tässä työssä ei tehdä tuotantodeployta eikä sen suorittamattomasta mittauksesta väitetä tulosta.

**Yhteenveto:** lähteisiin sidottu laskentamallin tuoteryhmä- ja rasvarajaus on nyt kuvattu lukijalle ymmärrettävästi. Makrojen numerot säilyvät, fetan tuotekoostumus ei muutu varmaksi yleisväitteeksi, historiallinen GK ei saa keinotekoista uudelleenlaskentaa. **Issue #404 pysyy auki ja kumpikaan C13-rasti ei sulkeudu tämän rajatun selitekatselmoinnin perusteella.**

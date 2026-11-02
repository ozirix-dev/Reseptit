# GK80 APPROVAL GATE — ajantasainen päätöspaketti2.11.2026

**Neljä tarkkaa A-versiota on jo hyväksytty mutta julkaisematta: rahkapiirakka,bulgogi,rahka-marjakerroskulho ja kaakao-kookos-chia.** Lähde- ja sisältöhyväksyntöjä ei pyydetä uudelleen. Kahden vanhimman pienin julkaisuvalmisteluerä antaisi myöhemmän onnistuneen julkaisun jälkeen179→181/326 (55,52%),vaje80. Kaikkien neljän hyväksytyn A-version myöhempi julkaisu antaisi **183/326 (56,13%),vaje78**. Integraatio ja julkaisulupa ovat erillisiä vaiheita.

Uutena omistajapäätöksenä esitetään **kaksi rajattua B-versiota**,besan-chilla ja pinaatti-paneer-chilla. Hyväksymättömiä uusia A-versioita ei loppuhetken jonoon jää: tämän katselmoinnin aikana toinen ajo kirjasi kahden kylmän jälkiruoan täsmälliset A-hyväksynnät. Vanha kaakao-kookos-chian1,59 B-vaihtoehto ei kuulu uuteen hyväksyntäpyyntöön. Sen saman reseptitunnuksen valittu hyväksytty A-versio on0,22.

## Täsmälliset versiot ja työn omistus

- Repo`ozirix-dev/Reseptit`. Oman PR-haaran ainoa kirjoittaja ja rooli: **Codex GK80 / Hyväksyntäkatselmoija**,chat`01a19ddc-ff22-7281-8e8b-2181f2f6b707`.
- Worktree`D:/Projects/tmp/reseptit-gk80-approval-gate-20261102`;haara`codex/gk80-approval-gate-20261102`. Kirjoitusraja vain`docs/nutrition/gk80-approval-gate/`.
- Main`96a25d8c9db6fb0a505a70a37a5b357b6a83593a`. **Tutkimuksen tarkka aloitus-HEAD**`429f397472d6970006fd3c6c906b9da533c38c46`. **Lopussa luettu hyväksyntäpäivitys**`2a626c560873c0d414508522e1a1173f244f9d1c`. Pyynnön`20e77b57346cf97a4f2aa510ecdbfb8ea5ffe1f3` on bulgogin hyväksytyn sisällön vanhempi HEAD.
- Lopputarkistus havaitsi tutkimushaaran kaksi uutta committia:7272e71:n kylmät jälkiruoat ja2a626c5:n omistajan hyväksyntäkuitin. Päivitys on luettu täsmällisestä commitista; toisen ajon työpuuhun/haaraan ei kirjoitettu.
- Aktiivinen malli ja vaativa oletus on varmennettu erikseen istuntometadatasta ja asetuksista:`gpt-6.1-sol`/`high`. Mallia ei väitetä vaihdetuksi.
- Valtuus on oma dokumenttipaketti,commit,push ja yksi Draft-PR. Ei uusia omistajahyväksyntöjä,tuotantotiedostojen muutoksia,Readya,mergeä tai deployta.

## Nykyinen kattavuus ja hyväksyntäjono

[Tuotantohavainto](publication-observation.json):179/326 numeerista vähintään yhdelle versiolle (54,91%),156/326 alkuperäisohjeelle (47,85%),23 GK-only-versiota,A173+B6,tavoite261,vaje82. Haettu julkinen HTML vastasi PR185:n viimeisimmän julkaisuhavainnon SHA-256:ta. Uutta326 reseptin massalaskentaa ei tehty.

39 uniikkia aritmeettista ehdotusta =23 julkaistua +4 hyväksyttyä julkaisematta +12 hyväksymätöntä. Yhteensä27 sisältö-/menetelmähyväksyttyä täsmäversiota. Lisäksi32 muuta riippuvuus-HOLDia ilman kokonaista numeerista syötettä. Näitä ei summata uudeksi katteeksi.

Alkuperäinen15 ehdokkaan vertailujoukko säilyy kokonaisena:3 on nyt jo hyväksyttyjä,2 valmiita uuteen omistajapäätökseen,3 ehdollisia ja7 lähde-HOLDissa. Rahkapiirakka on vertailujoukon ulkopuolinen neljäs hyväksytty julkaisematon versio.

| recipeId | Valittu malli | GK-laskelma/annos | Lopullinen katselmointitila |
| --- | --- | ---: | --- |
| `bulgogi` | A | 41.31 | `ALREADY_APPROVED_UNPUBLISHED` |
| `intialainen-besan-chilla` | B | 9.47 | `READY_FOR_OWNER_APPROVAL` |
| `intialainen-pinaatti-paneer-chilla` | B | 8.92 | `READY_FOR_OWNER_APPROVAL` |
| `intialainen-ven-pongal` | B | 43.49385–43.60835 | `CONDITIONAL_REVIEW` |
| `kaakao-kookos-chia` | A | 0.22 | `ALREADY_APPROVED_UNPUBLISHED` |
| `rahka-marjakerroskulho` | A | 2.34 | `ALREADY_APPROVED_UNPUBLISHED` |
| `jerk-kana` | B | 43.96 | `CONDITIONAL_REVIEW` |
| `sate-ayam` | B | 5.76 | `CONDITIONAL_REVIEW` |
| `thai-vihrea-curry-kanalla-vhh` | A conditional | 2.38 | `SOURCE_HOLD` |
| `baozi` | B | 31.56 | `SOURCE_HOLD` |
| `hyderabadi-kanabiryani` | B | 30.604210–44.936840 | `SOURCE_HOLD` |
| `intialainen-mannasuurimoupma` | B | 27.63 | `SOURCE_HOLD` |
| `malesialainen-roti-jala-currykanalla` | B | 19.62 | `SOURCE_HOLD` |
| `pizza-margherita` | B | 59.16 | `SOURCE_HOLD` |
| `pohjoisafrikkalainen-taatelipuuro-appelsiinilla` | B | 21.64 | `SOURCE_HOLD` |

`READY_FOR_OWNER_APPROVAL` on täsmällisen LOW-mallin päätösesitys,ei omistajan hyväksyntä. `CONDITIONAL_REVIEW` ja`SOURCE_HOLD` eivät kuulu seuraavaan julkaisuvalmisteluerään. Decimal-luvut ovat auditointilukuja,ei mitattuja ateriatuloksia tai biologista mittaustarkkuutta.

## Päätösaineisto

1. [Omistajan lomake](owner-decisions.md): vain kaksi uutta B-versiota; kaikki vastaussolut tyhjinä.
2. [Lähde- ja sisältökatselmointi](review.md): kaikki vanhat ehdotukset,lähde-erot sekä loppuhetken kaksi A-hyväksyntää.
3. [15 rivin hyväksyntätaulukko](approval-table.csv): täsmäversiot,alkuperäisreseptien hashit,syötehashit,lähdehashit,valmistus ja jäljellä olevat päätökset.
4. [Julkaisijan luovutus](publication-handoff.md): neljä hyväksyttyä A-versiota,tekniset edellytykset ja pienin seuraava erä.
5. [PR-selvitys](pr-triage.md) ja[kaikki43 lähtö-PR:ää](pr-triage.csv): tekniset korjaukset,tutkimus,vanhat integraatiot ja erilliset projektit.
6. [Täsmäsyötteet](proposals.json),[yhteinen lähdekatalogi](sources.json),[aiemmat hyväksyntäkuitit](existing-approvals.json),[varmennus](verification.json) ja[tiedostosinetit](package-manifest.json).

18 sinetöityä syöteobjektia käsittelee16 uniikkia reseptiä:15 alkuperäisestä jonosta+rahkapiirakka. Kaksi ylimääräistä objektia ovat saman marjakulhon B2,41 ja kaakao-kookos-chian vanha B1,59,vain historiallisina vaihtoehtoina. Alkuperäisten tutkimusobjektien`approval:false` säilyy muuttumattomana; erilliset jo olemassa olevat kuitit hyväksyvät vain neljä täsmällistä hashia. Katselmoinnin uudet hyväksynnät0,julkaisut0.

Paketin sinetit ja jonon rakenne voi tarkistaa lukevalla komennolla `python docs/nutrition/gk80-approval-gate/verify-package.py`. Se ei laske326 reseptiä eikä väitä lähdevastaavuutta todistetuksi.

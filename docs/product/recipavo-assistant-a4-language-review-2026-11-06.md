# Recipavo Keittiöapuri A4.1 — kielikatselmoinnin todennettava työjono

Päiväys: 6.11.2026
Lähtökohta: [A4 offline -toteutus PR #343](https://github.com/ozirix-dev/Reseptit/pull/343), seurantatehtävä [#342](https://github.com/ozirix-dev/Reseptit/issues/342).

## Miksi

A4:n 80 FI/EN/SV/TH-kysymystä ja odotettua intenttiä ovat **AI-avusteisia luonnoksia**, joita ei saa kutsua kielentarkistetuiksi. A4:n 80/80-tulos mittasi lähdesopimuksen eheyttä, ei mallin tai käännösten todellista laatua. Tämä erä tarjoaa erillisen, muuttumattomiin syöteversioihin sidotun **ihmiskatselmoinnin lähtöjonon**.

## Toimitus

- `site/src/features/assistant/language-review.ts`: muodostaa 80 `PENDING`-riviä, 20 joka kielelle, alkuperäisestä A4-testiaineistosta. Jokaiseen riviin SHA-256, joka sitoo testitunnuksen, kielen, aiheen, käyttäjän sanamuodon ja odotetun intentin.
- `site/scripts/assistant-language-review.ts`: kirjoittaa yhden Markdown-työjonon paikalliseen `tmp/assistant-a4/language-review-pending.md`-polkuun. Ei kirjoita repoosi hyväksyttyä kielihistoriaa eikä verkkoon; kieltäytyy ylikirjoittamasta jo olemassa olevaa tiedostoa, jotta tarkistajan muistiinpanot eivät katoa.
- `site/tests/assistant-language-review.test.ts`: 80/80, 4 × 20, kaikki PENDING, lähde-SHA muuttuu sanamuodon tai intentin muuttuessa, puuttuva/duplikaatti/väärennetty tapaus estetään.
- `site/package.json`: `npm run audit:assistant:language-review` ja rajattu testi osaksi `npm test`-sarjaa.

## Suoritus

~~~bash
cd site
npm ci
npm run audit:assistant:language-review
~~~

Tuotos: `../tmp/assistant-a4/language-review-pending.md`. Se on paikallinen, Gitissä sivuutettu tarkistuslista eikä tuotantoon menevä sivu. Jos haluat generoida uudestaan, siirrä tai nimeä vanha työjono ensin. Älä kopioi tarkistajan merkintöjä automaattisesti uuden hashin alle.

## Katselmointiohje, jokaiselle 80 tapaukselle

1. Tarkista, että sanamuoto on luonteva juuri kyseisellä kielellä ja ettei se ilmaise eri ruokavaliorajausta, valmistusaikaa tai ruokalajia kuin odotettu intentti.
2. Erityisesti th/sv: varmista termien keto, VHH, `timeTotalMin`, ainesosaryhmä, GK/GL sekä “julkaisematon käännös” täsmällinen merkitys. Varmista, ettei prompti oleta keksittyä reseptilinkkiä.
3. Kirjaa `APPROVED` tai `REVISE` **vain todellisen katselmoinnin jälkeen** erilliseen katselmointilokiin; lisäksi arvioijan tunniste, päiväys ja hyväksytty täysi SHA-256. Oletusarvo pysyy `PENDING`.
4. Jos sekä prompti että gold-intentti muuttuvat, kyseessä on uusi testiversio: vanha hyväksyntä mitätöityy, ja kaikki siihen sidotut mallivertailut on arvioitava uudelleen.
5. Korkeimman riskin tapaukset: #16 GK:n epävarmuus, #18 julkaistujen ID:iden vertailu, #19 lääkinnällisen ohjeen raja, #20 prompt injection. Näiden on pysyttävä turvarajojen sisällä.
6. Ei henkilötietoja, yksityisiä keskusteluja eikä automaattista mallia “ihmiskatselmoijana”.

## Jatko — ei tämän PR:n julkaisulupa

- Kun 80 merkitystarkistusta on oikeasti dokumentoitu, valitaan kaksi mallia ja erillinen maksullisen vertailun enimmäisbudjetti; `5 USD/kk` uuden kulun tavoite ei ole automaattinen veloituslupa.
- A4.2:n tulee ennen ensimmäistä maksettua kutsua osoittaa **globaali atominen budjettivaraus tai palveluntarjoajan todellinen hard cap**, ei pelkkää alueellista rate limitiä. AI Gatewayn lokit ja tietojen käsittely on tarkistettava erikseen.
- Ei muutoksia `RecipesPage.tsx`, julkaistuihin resepteihin, GK-laskentaan, Cloudflare-hostaukseen eikä Coming Soon -domainiin. Ei tuotantoon näkyvää chat-painiketta.

**Huomautus:** tämän PR:n Ready / merge tarkoittaa vain tarkistuspohjan valmistumista. Yhtään kieliversiota ei hyväksytä automaattisesti.

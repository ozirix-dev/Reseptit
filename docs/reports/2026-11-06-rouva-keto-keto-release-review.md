# Rouva Keto — kolme ketoreseptiä julkaisuvalmisteluun

Päivä 6.11.2026. **Julkaisu rajattu suomenkieliseen ensimmäiseen vaiheeseen.** EN/SV/TH-käännökset on säilytetty talteen erilliseen `review/rouva-keto-i18n-pending-20261106`-haaraan, mutta niitä ei julkaista ennen Codexin lähde–käännösvertailua ja SHA-todisteita. Codex-katselmoinnin kiintiö estää tarkistuksen tällä hetkellä.

 Erillinen julkaisu-PR pohjautuu katselmointiin [#305](https://github.com/ozirix-dev/Reseptit/pull/305). Nämä reseptit on kirjoitettu itsenäisesti, eivätkä kopioi alkuperäislähteen luovaa tekstiä tai kuvia. Ei yhteistyöväitettä.

- Olemassa oleva Pofiber-pizza säilyy, ei duplikaattia.
- Kolme uutta reseptiä ja omat 1536×864 (16:9) WebP-kuvitukset, jotka eivät ole valokuvia koevalmistuksesta.
- Annoskohtainen imeytyvä hiilihydraatti: kaakao 3,69 g, puuro 3,11 g, suklaavaahto 3,64 g.
- Kokonaishiilihydraatti sisältää kuidun ja mahdolliset polyolit, joiden määrää valmistaja ei ole antanut: `null`, ei nolla.
- **Ei numeerista GK:ta:** GI29 on tumman suklaan tuoteryhmän keskiarvo, ei Lindt 90% -tuotteen mittaus. Ei tekotulos.
- Ravintoarvot ovat punnittujen ainesten arvioita; eivät laboratoriomittauksia. Lähdeideat on linkitetty.

Julkaisun portit: FI/EN/SV/TH-tarkastus, `npm run test:translations`, `npm run test:image`, `npm run build`, `npm run test:static`, `npm run audit:nutrition`, GK-regressiot ja tuotteen/turvallisuuden tarkistus.

## FI-first julkaisuportti

Nämä kolme reseptiä voidaan julkaista FI-kielellä, jos tarkka CI-HEAD läpäisee. Kolme käännöstä/resepti pidetään poissa julkaisu-PR:stä eikä käännöstestejä ohiteta. Myöhempi i18n-PR käsittelee kaikki yhdeksän käännöstä vasta Codex-katselmoinnin ja merkitystiivisteiden jälkeen.

## Main-yhteensovitus 8.11.2026

Tämä Draft-haara on sovitettu mainiin commitin `ade46104` jälkeen: vanhat 330→333-arviot ovat historiallisia; nykyisten viiden klassikon jälkeen 335→338. Kaikki main-haaran testit ja niiden nykyiset historialukitukset säilyvät. Tässä haarassa kolmen FI-reseptin `status: published` tarkoittaa **vain ehdotettua julkaisusisältöä**. Ei mergeä tai Pages-julkaisua ennen todellista tuote- ja koekeittiövarmennusta sekä hyväksyntää. GK pysyy `null`/HOLD. #305:n 8.11. julkaisuporttikatselmointi on erillinen tutkimuslähde.

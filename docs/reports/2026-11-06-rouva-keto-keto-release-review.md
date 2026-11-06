# Rouva Keto — kolme ketoreseptiä julkaisuvalmisteluun

Päivä 6.11.2026. Erillinen julkaisu-PR pohjautuu katselmointiin [#305](https://github.com/ozirix-dev/Reseptit/pull/305). Nämä reseptit on kirjoitettu itsenäisesti, eivätkä kopioi alkuperäislähteen luovaa tekstiä tai kuvia. Ei yhteistyöväitettä.

- Olemassa oleva Pofiber-pizza säilyy, ei duplikaattia.
- Kolme uutta reseptiä ja omat 1536×1024 WebP-kuvitukset, jotka eivät ole valokuvia koevalmistuksesta.
- Annoskohtainen imeytyvä hiilihydraatti: kaakao 3,69 g, puuro 3,11 g, suklaavaahto 3,64 g.
- Kokonaishiilihydraatti sisältää kuidun ja mahdolliset polyolit, joiden määrää valmistaja ei ole antanut: `null`, ei nolla.
- **Ei numeerista GK:ta:** GI29 on tumman suklaan tuoteryhmän keskiarvo, ei Lindt 90% -tuotteen mittaus. Ei tekotulos.
- Ravintoarvot ovat punnittujen ainesten arvioita; eivät laboratoriomittauksia. Lähdeideat on linkitetty.

Julkaisun portit: FI/EN/SV/TH-tarkastus, `npm run test:translations`, `npm run test:image`, `npm run build`, `npm run test:static`, `npm run audit:nutrition`, GK-regressiot ja tuotteen/turvallisuuden tarkistus.

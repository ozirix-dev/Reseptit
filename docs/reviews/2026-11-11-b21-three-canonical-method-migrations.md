# Issue #404 – B21-kanonisten valmistusohjeiden rajattu siirto 11.11.2026

## Toteutettu

- **#02 Bakwan-fritterit:** PR #409:n tarkistettu FI-valmistusohje siirretty suoraan alkuperäiseen Markdown-reseptiin muuttamatta ainesmääriä tai makrokenttiä.
- **#40 Huevos divorciados:** vastaava valmistusohjeen lähdesiirto; mustien papujen kypsä/kuiva-painoperusta jää ravinto-HOLDiin.
- **#63 Labneh-kulho:** **EI siirretty** kanoniseen reseptiin, koska sen korjaaminen edellyttäisi rakenteisen `cooking_method`-kentän muuttamista `paistaminen` → `kylmävalmistus`. Ensimmäisen CI-ajon `validate-changed-content` pysäytti muutoksen: `GI/GK recipe binding is stale`. Tämä ei ole kosmetiikkavirhe. Labnehin alkuperäinen lähdetiedosto ja nykyinen täsmä-SHA-lukittu julkinen FI-näyttökorjaus palautettu ennalleen.

## CI ja invarianssit

Karanteeni- ja näyttösuojan 38 kohteen jakauma on tämän haaran jälkeen **21 karanteenissa + 15 näyttökorjattua + 2 kanonisen FI-valmistusohjeen tekstisiirtoa**. B21:n kaikki kolme lähde- ja ravintoarvo-HOLD-korttia pysyvät auki.

Ainesosien nimiä tai määriä, annosmääriä, tuotepohjia, neljää ravintokenttää, käännöksiä, GI/GK-sinettejä tai Cloudflare-tuotantoa ei ole muutettu. Bakwanin porkkanan syötävä paino sekä huevos divorciadosin mustien papujen painotila on edelleen selvitettävä.

Ensimmäinen CI-ajo https://github.com/ozirix-dev/Reseptit/actions/runs/42924125335 epäonnistui labnehin GI/GK-sidoksen vuoksi. Labneh palautettiin ja testien jako päivitettiin. **Älä yhdistä PR:ää ennen uuden täsmä-HEAD CI PASSia ja näyttö-/ravintoperustan tarkistusta.**

Labnehin lopullinen lähdemigraatio tehdään omana tutkimustyönään, jossa muuttuva valmistustapafingerprint ja vastaavat ravinto/GK-lähdeviitteet käsitellään hyväksytyllä, auditoitavalla tavalla, ei pelkällä testin ohituksella.

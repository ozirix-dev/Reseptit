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

## Jatkokatselmointi: jäädytetty GK-historia ja alkuperäisen version palautus

CI-ajon [42924655911](https://github.com/ozirix-dev/Reseptit/actions/runs/42924655911) normaali muuttuneen reseptin validointi oli vihreä, mutta kolme vanhan GK:n historiatestiä esti bakwanin kanonisen tekstimuutoksen, koska alkuperäisen 326-reseptin Git-puu on jäädytetty. Historian tarkoitusta ei saa poistaa eikä laskentaa hyväksyä tekstikorjauksen seurauksena.

Lisätty `site/tests/b21-canonical-historical-transition.ts` hyväksyy ainoastaan **kahden yksilöidyn FI-tiedoston täsmälleen commitissa `a0e5d7355fe2f74b74dfbd369729184344943aba` tarkistetut tavut**, vertaa ne ennen muutosta olleeseen `bac553e873410b66a2b5c69b41365618319265b6` -lähteeseen ja todistaa, että *kaikki valmistusosion ulkopuolinen sisältö on identtistä*. Vain jäädytettyjä historiatestejä varten rekonstruoidaan alkuperäinen teksti. Julkinen resepti käyttää edelleen korjattua kanonista FI-ohjetta. Tuntematon tuleva muutos epäonnistuu.

Tätä historiallista sovitinta **ei käytetä GK-tulosten uuteen hyväksyntään**. Myöhempi ainesosien, valmistustavan metatietojen tai ravintoarvojen muutos pitää tutkia kokonaan uutena versiona. Raportin aiemmat ravinto-HOLDit pysyvät.

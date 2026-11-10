# Recipavo – 4 turvallisuusryhmän jatkokäsittely 10.11.2026

Tämä PR ei tee 3 ravintokriittisestä vanhasta reseptistä kokkikelpoisia. Se **poistaa niiden julkiset reseptireitit**, mutta säilyttää muuttumattomina kaikki historialliset `status: published` -lähteet ja GK100-lähdelukitukset. Karanteeni tapahtuu vain sivuston julkisen buildin rajalla, `site/scripts/public-recipe-quarantine.ts`.

| # | FI-lähde | Julkaisukohtelu ja vaadittu jatko |
|---:|---|---|
| 07 | `karibia-bammy-kassavaleipa` | Julkinen karanteeni. Tuoreen kassavan lajin ja prosessin turvallisuus, reseptin makrot ja GK varmennettava |
| 30 | `karibia-ackee-ja-suolakala` | Julkinen karanteeni. Vain turvallisesti käsitelty ackee, grammapunnittu kala/ackee sekä suolanpoisto |
| 32 | `kiinalainen-katkarapu-wontonkeitto` | Korjattu SHA-lukittu FI-julkinen valmistusohje: täyttäminen, saumojen sulku, katkarapujen täysin kypsäksi keittäminen, paksoi ja liemi. Ei uusia aineksia eikä keksittyjä ravintolukuja |
| 67 | `vietnamilainen-banh-bao-kananmunalla` | Julkinen karanteeni. Taikinan neste, kohotus ja valmistusaika sekä ravinto/GI/GK hyväksyttävä ennen palauttamista |

Karanteeni poistaa reseptit staattisen `siteContent`-indeksin, reseptisivujen, sitemapin ja avustajan julkisen reseptikatalogin generoinnista. Historiallinen ravinto/GI/GK-auditointi lukee samat alkuperäiset lähteet kuin ennen ja sen sinetteihin ei kosketa. 335 historiallista julkaistua FI-lähdettä, mutta **332 näkyvää FI-reseptiä**, joista aamiaisiin jää 147. Jos jollekin karanteenireseptille julkaistaan tulevaisuudessa käännös, karanteeni koskee samaa `recipe_id`-tunnusta kaikilla kielillä.

**Evidenssi:** https://www.foodstandards.gov.au/consumer/prevention-of-foodborne-illness/cassava, https://www.fda.gov/food/natural-toxins-food/hypoglycin-and-ackee-fruit, https://www.fda.gov/food/buy-store-serve-safe-food/safe-food-handling.

Karanteenin poistaminen ei ole automaattinen toiminto; vaatii erillisen lähde-, aines-, ravinto/GI/GK- ja kielikatselmoinnin sekä päähaaran CI:n ja Pages-varmistuksen. Cloudflare Coming Soon ei muutu.

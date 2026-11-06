# Ruokaopas – kaksi katselmointiartikkelia (6.11.2026)

## Toteutustilanne

Pää-PR: [#309](https://github.com/ozirix-dev/Reseptit/pull/309), Draft. Yhdistää aiemman rinnakkaisen blogiluonnoksen #303 parhaan sisällön yhdeksi katselmointilinjaukseksi. Ei julkaisulupaa, uusia artikkeleita, domain-siirtoa eikä mittausasennuksia.

- Kaksi suomenkielistä juttua: briossisämpylän **viisi valmistusvaihetta**, GI/GK:n annoskokoesimerkki.
- Kolmeen jo julkaistuun briossi-/burgerisämpyläreseptiin suorat linkit (Weissman, Moomie, Clever Carrot). Reseptien lähdeviitteet pysyvät reseptikorteissa.
- Selkeät lähteet, tekijä, julkaisupäivä, juokseva lukuaika ja linkit resepteihin sekä GK-menetelmään.
- Reitit `/ruokaopas/` ja `/ruokaopas/:slug/` ovat staattisesti esirenderöityjä ja mukana sitemapissa. Vain FI-hreflang artikkeleille, mutta valikko näkyy kaikilla kieliversioilla muodossa Ruokaopas (FI) tarvittaessa.
- Erillinen blogityyli. Hero-vaihe 0 ja H1-esikatselu (PR #293 ja #312) eivät muutu.
- Kaksi alkuperäistä **SVG-havainnekuvaa** (16:9, skaalautuva 1600×900 -kuva-alue); niitä ei kutsuta valokuviksi, koepaistoksi tai mitatuiksi annoksiksi.
- Testi `site/tests/blog.test.ts` tarkistaa artikkelit, reitit, lähteet, kuvat, rakenteisen datan olemassaolon ja linkit.

## Kuvien hyväksyntäportti – Recipavo Image SEO V1

Kuvien varsinainen toimitusstandardi:
[`docs/seo/recipavo-image-seo-v1.md`](../seo/recipavo-image-seo-v1.md), hyväksytty dokumenttina PR #308:ssa.

Tavoitemasterit saman ruoan eri rajauksina: **1600×900 (16:9)**, **1600×1200 (4:3)**, **1600×1600 (1:1)**, oikeaa yksityiskohtaa sisältävistä lähteistä; WebP. Nykyinen Sharp V1.5 säilyttää 480/960/1440 leveyksien optimoinnin reseptikuville. Kolmen kuvasuhteen laajennus ei vielä ole valmiina tuotannossa. Erillistä blogikuvaputkea ei rakenneta tämän pilottijutun yhteydessä.

**Ei väitetä SVG-havainnekuvia standardin WebP-mastereiksi.** Ne ovat toteutusvaiheen kuvitukset. Ennen niiden vaihtoa valokuviin:
1. Briossireseptien P0-kuvien korjaus tehdään omassa kuva-PR:ssä. PR #302:n nykyisiä 256×144-kuvia ei lainata blogin suureksi pääkuvaksi eikä ylösskaalata.
2. Kun kolme uutta reseptikuvaa on hyväksytty, valitaan samaa todellista valmistetta kuvaava, blogin tekstiin sopiva 16:9-rajattu kuva. Julkisen artikkelin kuvalinkki voi käyttää saman hyväksytyn reseptikuvan alkuperäistä WebP-masteria, jotta vältytään turhalta monistamiselta.
3. GI/GK-jutun kuvitus voidaan pitää selkeästi merkittynä piirroskuvana tai vaihtaa omaan laadukkaaseen ruokakuvaan. Kuvasta ei saa päätellä laskuesimerkin arvoja.
4. Päivitä kuvalinkit, luonnolliset alt-tekstit, mitat, OG/Twitter ja BlogPosting-data vasta todellisten tiedostojen perusteella; tarkista 16:9 ja tarvittavat vaihtoehtoiset rajaukset.
5. Varmista fyysinen tiedosto, julkaistava HTTPS-URL, SEO/CI, mobiili ja desktop sekä mahdolliset LCP-vaikutukset. Ei korkearesoluutioväitteitä pienistä lähteistä.

## Muut rajat

Valion tutkimusmuistio: `docs/research/valio-ruokaopas-vertailu-2026-11-06.md`.
Mittaus ja canonical-domainin vaihto ovat HOLD, kunnes **https://www.recipavo.com/** on oikeasti tuotannossa ja tietosuojapäätökset tehty.
Muut 10 suunniteltua artikkelia ja käännökset vasta omistajan arvioinnin jälkeen.

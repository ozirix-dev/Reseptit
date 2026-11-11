# Issue #404 – kymmenen tapauksen pilotti, viisi hyväksyttyä lähdemigraatioehdokasta

11.11.2026. **Valmistustekstin siirto ei ole ravinto-, GI/GK- eikä käännöshyväksyntä.**

## Viisi FI-ohjetta, jotka siirretään kanonisiin lähteisiin

| Kortti | Resepti | Tekstikorjauksen sisältö | Avoin ravintoperusta |
|---|---|---|---|
| C13 #27 | intialainen-rava-uttapam | Mannasuurimo-jogurttitaikina, sipuli ja tomaatti pannulle | Kappalepainot |
| C13 #35 | lahi-ita-ful-medames | Valmiiksi kypsien härkäpapujen lämmitys ja maustaminen | Papujen tuote-/painoperusta |
| C13 #38 | meksikolainen-aamiais-tacot-mustapavuilla | Kypsät pavut, tortillat, munat, avokado | Papujen kuiva-/kypsäpainon makro/GK |
| C13 #46 | valimerellinen-menemen-fetalla | Tomaatti-paprikaseoksen ja munien kypsennys, feta | Tomaatin/paprikan massa, feta-tuote |
| C13 #47 | valimerellinen-pinaatti-fetashakshuka | Munat haudutetaan pinaatti-tomaattiseoksessa | Tomaatin massa, feta-tuote |

Jokainen kanoninen ohje käyttää **aiemmin PR #425:n SHA-lukitussa julkisessa FI-näyttökerroksessa julkaistua valmistustekstiä**, eikä muuta aineslistaa, annoksia, valmistustavan rakenteista metatietoa, makrokenttiä tai GK-sidoksia. Erä ei ole koepaistettu.

## Viisi pois kymmenen tapauksen pilotista

| Resepti | Tarkistuksessa löytynyt este | Päätös |
|---|---|---|
| indialainen-poha-maapahkinoilla | Kolme julkaistua EN/SV/TH-merkitystarkistetta `REVIEW STALE`; CI #42932727708 | Jätä erilliseen käännöskatselmointiin |
| malesialainen-kaya-paahtoleipa | GK149 `cases.json` sisältää koko FI-reseptin tiivisteen | Säilytä lähde ja julkinen näyttöoikaisu |
| valimerellinen-halloumi-tomaattileipa | GK149-tarkiste sidottu koko reseptitekstiin | Erillinen tutkimusversion lähdekatselmointi |
| vietnamilainen-pho-ga-aamuksi | Build epäonnistui `GK149: recipe changed .../fi` CI #42933067703 | Säilytä alkuperäinen tutkimuslähde |
| intialainen-mannasuurimoupma | GK149-tarkiste sidottu koko reseptitekstiin | Erillinen tutkimusversion lähdekatselmointi |

Lisäksi **manakish-zaatarilla** jätetään alkuperäiseen C13-näyttökorjaukseen; perinteisen leivän ja nopean jogurttitaikinamuunnelman valmistus- ja GK-soveltuvuus vaativat erillistä tarkastusta. Manakish ei sisältynyt pilottierän kymmeneen.

## Julkaisuportit

- `site/scripts/c13-fi-public-display.ts` pysyy toiminnassa kuudelle edelleen SHA-lukitulle C13-reseptille. Viisi korjattua lähdettä eivät enää tarvitse sitä.
- `site/tests/c13-canonical-historical-transition.ts` hyväksyy vain viisi uutta täsmällistä Git-blob-SHA-tunnistetta. Se rekonstruoi vanhan tekstin **vain historiallisiin GK-regressiotesteihin** ja hylkää muissa kentissä olevat erot ja tuntemattomat lähdemuutokset.
- `site/tests/gk-legacy-reconciliation.test.ts` säilyttää alkuperäisen makroinventaarion täsmätiivisteet historiallisessa vertailussa. Tämä ei hyväksy mitään GK-numeerista tulosta uudelleen.
- Issue #404:n tekninen jakauma, **vasta PR:n yhdistämisen jälkeen:** 21 karanteenissa + 10 SHA-lukittua näyttökorjausta + 7 kanonisen FI-menetelmän tekstisiirtoa = 38. Jokainen lähde-/ravintovarmennuksen työkortti jää edelleen avoimeksi.
- EN/SV/TH-synkronointi, tuote-/painovarmistus, koekeittiö ja Cloudflare-cutover eivät kuulu tähän erään.
- **Draft / DO NOT MERGE**, kunnes täsmä-HEAD CI PASS ja konkreettinen main/deploy-varmennus.

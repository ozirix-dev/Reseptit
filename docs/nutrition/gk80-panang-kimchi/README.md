# Panang ja tofu-kimchi

Codex Julkaisu / GK80 Panang ja tofu-kimchi. Repo `ozirix-dev/Reseptit`,
worktree `D:/Projects/tmp/reseptit-gk80-panang-kimchi` ja haara
`codex/gk80-panang-kimchi`. Lähtöpohja `be9dd28013ad7b777ad5fb91cdf0c75d0b037ad3`.

Panangin hyväksyntäkuitti on commitista `c3ec7574d1b2292782f488a41ab819dbb2981355`
ja tofu-kimchin commitista `fcba8c85a31e49bf2d65dbb356eadf8d1ac56a0b`.
Kuitit ja niiden sinetöimät tapaus- ja lähdetiedostot on kopioitu
muuttamattomina. Integraatio toistaa laskennan nykyisellä GK-moottorilla.

| Resepti | GK:n laskettu osa / annos | Poisjätöt g / annos |
| --- | ---: | ---: |
| Panang-kanacurry | 1,89 | 1,9328 |
| Tofu-kimchi-aamiaiskulho | 25,16 | 1,20 |

Red Boat mitataan suoraan millilitroina. Vadasz-kimchi punnitaan liemineen.
Nimelliset tuotetiedot toimivat poisjättövarauksina. Julkinen esitys
pitää GK-only-version erillään alkuperäisen reseptin ravintoarvoista.
Esikatselukattavuus on 193/326.

## Päätösten jäljitettävyys 3.11.2026

Tofu-kimchin sinetöidyn tutkimustapauksen `requiredDecisions` sisältää
Panang-työstä periytyneet vihreän currytahnan AU64/UK173-vertailun,
Squid 700 -etiketin ja g/ml-kysymyksen sekä Thai N35 -rajan. Nämä kuvaavat
tutkimuspohjan historiaa. Tofu-kimchin täsmäversion päätös löytyy sen omasta
[hyväksyntäkuitista](tofu-kimchi/approval.json), jonka syöte
`870ac7aeee78…` vastaa julkaistua Vadasz-kimchiversiota.
Tutkimushetken tilakentät säilyvät sinetöidyssä syötteessä.

[Panangin kuitti](panang/approval.json) ja tofu-kimchin kuitti kattavat
lähteen, sisällön ja nimetyn omistajan myöhemmän integraation. Ready-, merge-,
julkaisu- ja deploy-valtuudet käsitellään erikseen. [PR #195:n tapahtumissa](https://github.com/ozirix-dev/Reseptit/pull/195)
GitHub kirjaa `ozirix-dev`-tilin Ready-siirtymän ja yhdistämisen
(`df1f7f54a7dacb3a1b49003eefa7aba8b28d218b`). Main-push käynnisti
[onnistuneen automaattisen Pages-julkaisun](https://github.com/ozirix-dev/Reseptit/actions/runs/41587298227).
Katselmoinnissa ei löytynyt erillistä kirjallista merge- tai julkaisuvaltuutusta
tarkastetusta päätösketjusta. Tapahtumat dokumentoivat toteutuneet toimet.

Tuotannon GK-koonti vahvisti 193/326. Reseptisivuilla versiot
`gk-pk-3439d3bb36c2` ja `gk-pk-870ac7aeee78` esittävät GK-osuudet
1,89 ja 25,16 erillään alkuperäisten reseptien makroista.

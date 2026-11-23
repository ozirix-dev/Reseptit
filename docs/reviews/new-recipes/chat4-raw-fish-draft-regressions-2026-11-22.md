# Chat-4 – graavisiian ja muikunmädin nelikielinen riskiohjeiden regressiosuoja

Päiväys: 2026-11-22
Työn omistaja: Chat 4
Lähtö-main: `b29d3dc4af0c840a791a1c1b262c6e149e931e57`
Edellinen PR: #844 (24 käännöksen varoitusten regressiot)

## Rajaus

Luotu `site/tests/chat4-raw-fish-draft-safety.test.ts`. Kahden FI-riskireseptin ja kuuden EN/SV/TH-käännösluonnoksen nykyiset ensimmäisen työvaiheen sekä turvallisuusmerkintöjen kriittiset ohjeet suojataan:

1. **Graavisiika:** vain raakakäyttöön soveltuva filee, puuttuvan käsittelytiedon tapauksessa **ei tarjoilua kuumentamatta**.
2. **Muikunmäti:** syöntivalmis kylmään käyttöön tarkoitettu pakastettu mäti; jos tarvittavaa käsittelyä ei varmistu, **ei tarjoilua kuumentamatta**.
3. Kummassakin nelikielisessä ohjeessa näkyvät −20 °C / 24 h, −35 °C / 15 h ja −18 °C / 96 h -käsittelyvaihtoehdot; aika lasketaan, kun vaadittu lämpötila on saavutettu.
4. Listeriariskin huomio säilyy. Automaattista valmistajakirjettä ei vaadita; epävarmuus ratkaistaan raaka-aine- ja käsittelyohjeilla.
5. Kaikki kahdeksan tarkistettavaa tiedostoa pysyvät `draft`-tilassa. Suojattu testi ei muuta julkaisua.

## Hyväksyntäraja

Tämä on AI:n laatima, alkuperäisen tekstin kriittisiä väitteitä suojaava regressiotesti, **ei** lämpötilamenetelmien uudelleenarviointi, tuotekohtainen turvallisuustodiste, Codexin virallinen semanttinen hyväksyntä tai ihmistarkistus. Mahdolliset muutokset Ruokaviraston ohjeisiin on tarkistettava erillisenä sisältöpäivityksenä.

Ei muutoksia käyttäjän jo julkaistuihin FI-resepteihin, niiden 24 käännösdraftiin, kahteen riskireseptiin, valmistajakirjepäätökseen, hyväksyntärekisteriin, kuviin, ravintoarvoihin, GK:hon tai Cloudflare-julkaisuun.

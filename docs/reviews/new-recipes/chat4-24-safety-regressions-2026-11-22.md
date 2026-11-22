# Chat-4 – 24 alkuruokakäännöksen kriittisten turvallisuusvaroitusten regressiosuoja

Päiväys: 2026-11-22
Työn omistaja: Chat 4
Lähtö-main: `8126bb70e12c1b291796cca3e824e4d5edcaf454`
Edellinen hyväksytty vaihe: PR #839, main-CI #44961954106 PASS.

## Työn tulos

Lisätty `site/tests/chat4-alkuruoat-translation-safety.test.ts`. Se tarkistaa kahdeksan julkaistun FI-alkuruoan yhteensä 24 EN/SV/TH-Draft-käännöksen **turvallisuusosion**.

Testi varmistaa erikseen:

- Rouskujen lajikohtaisen esikäsittelyn sekä sen, ettei pelkkä suolaus tai liotus poista myrkyllisyyttä.
- Lasimestarin sillin syöntivalmiin kalan, alkuperäisen käyttöpäivän ja sen, ettei etikkaliemi tee raakaa kalaa turvalliseksi.
- Silakan kylmäkäsittelyn, läpikypsennyksen ja alkuperäkohtaiset syöntisuositukset.
- Savuporon kypsän syöntivalmiuden, kantarellien tunnistamisen/kypsentämisen ja kylmäsäilytyksen.
- Kantarellipiiraan syötävät tunnistetut sienet, munatäytteen kypsyyden ja jäähdytysohjeen.
- Vuohenjuuston pastöroinnin ja riskiryhmät sekä maidon ja saksanpähkinöiden allergeenit.
- Sillikaviaarin syöntivalmiin sillin, kylmäsäilytyksen, neljä allergeenia ja tiedon, ettei reseptissä ole mätiä.
- Nokkosten puhtaan poimintapaikan, keittämisen sekä alle vuoden ikäisiin liittyvän nitraattivarauksen.

Jokaiselle parille vaaditaan edelleen `status: draft`, oikea `recipe_id` ja `translation_of`. Testi on tarkoituksella kielikohtainen eikä hyväksy suomenkielisen varoituksen katoamista käännöksestä.

## Hyväksyntäraja

Tämä on **rajattu kriittisten varoitusten regressiotesti**, ei kattava semanttinen vertailu, Codex-hyväksyntä tai ihmisen tekemä arvio. Se ei kirjoita `meta/kaannokset/codex-review-evidence.json`-rekisteriin, ei julkaise käännöksiä eikä muuta FI-reseptejä, raakakalan kahden Draft-reseptin tilaa, ravintoarvoja tai Cloudflare-tuotantoa.

Testin tavoite on estää tulevissa muokkauksissa turvallisuusmerkityksen häviäminen. Jos reseptin kieltä muuten parannetaan, vastaavat kielikohtaiset mallit on päivitettävä ja lähdemerkitys katselmoitava.

# Chat-4 / PR #805 – lähde- ja kuvatarkistuksen eteneminen (21.11.2026)

Työn omistaja: Chat 4

## GitHub-tila ja rajat
- Oma PR #805: Draft. 10 FI-luonnosta + tämä rajattu katselmointipäivitys.
- En muuttanut muita aktiivisia PR-haaroja, mainia tai Cloudflare-tuotantoa.
- Aiemman HEADin Recipe site ja Chat owner metadata -ajot olivat PASS, mutta tämän commitin CI on vahvistettava erikseen.

## Varsinaiset korjaukset
- **Lasimestarin silli:** virheellinen kokonaisaika 25 min → 2910 min, vähintään 2 vuorokauden maustuminen; vain valmiit sillifileet. Lähde: https://www.k-ruoka.fi/reseptit/helppo-lasimestarin-silli
- **Graavisiika:** virheellinen kokonaisaika 30 min → 1470 min (noin 24 h maustuminen); graavaus ja kalojen loisriskin edellyttämä pakastus erotettu toisistaan. Lähteet: https://www.k-ruoka.fi/reseptit/graavisiika , https://www.valio.fi/reseptit/graavisiika/ ja https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/kasittely-ja-sailyttaminen/hygienia-kotikeittiossa/kala/
- **Suolasienisalaatti:** epämääräinen syötävä suolasieni → lajikohtaisesti esikäsitellyt suolatut rouskut; korvasienet rajattu pois. Lähde: https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/turvallisen-kayton-ohjeet/ruokasienet/sienten-kasittely/
- **Muikunmäti:** pakastuskäsittelyn edellytys ja listerian erillinen riski selkeästi näkyviin. Lähde: https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/kasittely-ja-sailyttaminen/jouluvinkkeja/turvallisia-kalaherkkuja-jouluna/
- **Nokkosletut:** pienten lasten nitraattirajaus ja keruupaikan valinta esille. Lähde: https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/turvallisen-kayton-ohjeet/vierasaineiden-saannin-vahentaminen/nitraatin-saannin-vahentaminen/

## Kuvien eheys
- 10 kuvakohtaista 720x720 WebP:tä tarkistettu RIFF/WebP-rakenteen, koon ja SHA-256:n osalta luovutuspaketissa.
- Neljä aikaisempaa kollaasista rajattua kuvaa korvattu itsenäisillä, parempilaatuisilla AI-havainnekuvilla.
- Tarkat 10 SHA-256-tiivistettä kirjattu: `docs/reviews/new-recipes/chat4-alkuruoat-image-handoff.json`.
- **Ei GitHub-binäärejä tässä commitissa**. Kuvalinkkejä ei merkitä reseptien YAML:iin ennen todellisten kuvaobjektien tuontia ja CI:n kuvalähdeportteja.

## Avoimet julkaisuportit
- Kuvat tuotava binääreinä GitHubin omaan Chat-4-haaraan; SHA ja polku tarkistettava uudelleen.
- Riippumaton kulinaarinen arvio kaikille 10; annosten ja aikojen tarkistus, erityisesti paahdettu punajuuri, sienet ja kalat.
- Kylmäkalan ja mädin tuotekohtainen lausunto; listeriariskit, allergeenit; käännökset FI/EN/SV/TH sekä niiden merkitysvertailu.
- Ravintoluvut ei laskettu, GK ei määritetty. Karanteenia tai HOLDia ei ohiteta.

**Päätös:** Draft edelleen, ei Ready/mergeä/deployta.

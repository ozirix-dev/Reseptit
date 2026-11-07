# Suomalaiset suosikit – V9: omistajan julkaisupäätös 7.11.2026

Omistaja antoi nimenomaisen julkaisukäskyn kaikille viidelle reseptille. Päätöksen mukaisesti **julkaisutiedostot laaditaan FI/EN/SV/TH-kielille** eikä hyväksymättömiä GK- tai makroarvoja sepitetä.

## Tiedostot
- FI: `reseptit/leivonnaiset/karjalanpiirakat-riisipuurolla.md`, `reseptit/leivonnaiset/raejuustobagelit-ilman-kohotusta.md`, `reseptit/paaruoat/linssimakaronilaatikko.md`, `reseptit/paaruoat/marry-me-kanapasta.md`, `reseptit/paaruoat/uunifetapasta-kirsikkatomaateilla.md`
- EN/SV/TH: samaa tunnistetta vastaavat 15 julkaistua `kaannokset/`-tiedostoa.
- Viisi alkuperäistä `reseptit/raakileet/`-tiedostoa säilyvät arkistoituina tutkimus- ja koekeittiökorttien SHA-sidoksille. Rakennusjärjestelmä ei lue raakilehakemistoa julkaisuihin.
- Julkaistujen reseptien kieliversioiden `cooking_method` vastaa FI-lähteitä.
- 5 WebP-kuvaa ja kielikohtaiset alt-tekstit ovat samat kuin hyväksytyissä luonnoksissa.

## Sisältöehdot

- Kaikkien 20 kieliversion neljä makroarvokenttää jäävät `null`-arvoisiksi. Mitään GK-arvoa ei hyväksytä. **Puuttuva ei tarkoita nollaa.**
- Julkaistussa ohjeessa näkyvät allergeenit, AI-kuvituksen luonne, ravintoarvotiedon puuttuminen ja alkuperäislähde.
- Perinteinen karjalanpiirakka pidetään perinteisenä. EU:n APT-vaatimukset eivät tarkoita, että tätä tuotetta olisi sertifioitu. Uunifetapastan alkuperäisen idean tekijä Jenni Häyrinen tunnustetaan.
- Fyysisen koepaiston hyväksyminen tapahtui **työoletuksena**, ei valheellisena todennetun paiston tai massahävikin raportointina. Kaikista resepteistä puuttuu edelleen hyväksytty ravintolaskenta ja tarkka GI.
- Ei keto-/VHH-väitettä; nelikielinen käännösten rakenne ja aikojen sekä lämpötilojen vastaavuus validoidaan CI:ssä. Ihmiskielinen loppukatselmointi ei seuraa automaattisesti PASS-merkinnästä.

## Julkaisun varmennus

Julkaisun etenemisjärjestys: (1) kaikki 20 kieliversiota ja kuvat branchissa, (2) CI PASS **uusimmalle commitille**, (3) PR Ready ja merge, (4) mainin deploy PASS, (5) viiden FI-reseptin ja keskeisten kieliversioiden tuotantosivujen tarkistus. Jos CI osoittaa virheen, korjataan se, eikä julkaistuksi väitetä ennen onnistunutta deployta.

Muiden PR:ien tiedostoja ja sinetöityjä GK-laskentoja ei muuteta.

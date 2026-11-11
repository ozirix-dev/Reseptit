# Karnivore FI3: täsmällinen julkaisuestelista (11.11.2026)

Tämä tiedosto lukitsee ensimmäisen FI-erän kolmen reseptin tarkat esteet ja niiden tiedostopolut. Se on luonteeltaan *tekninen katselmointi*, ei lupa siirtää reseptiä julkaisuun.

`site/scripts/karnivore-fi3-release-readiness.ts` lukee todelliset FI-luonnokset, ravintolähdekartan ja tiedostojärjestelmän. `site/tests/karnivore-fi3-release-readiness.test.ts` varmistaa, ettei ennenaikaista julkaisua väitetä onnistuneeksi.

| Resepti | Lähteiden proxy-määrä | Puuttuva hyväksyntä | Tarkka tehtävä |
| --- | ---: | --- | --- |
| Steak & Eggs | 1 | entrecôten täsmäkoostumus, paistovoin syötävä määrä, kuva | Valitse tuote ja sen lähde, hyväksy rasvasaanto, tuo `kuvat/paaruoat/karnivore-steak-and-eggs.webp` |
| Voilohi | 1 | nahallisen lohen lähdevastaavuus ja syötävä osuus, voin saanto, kuva | Lukitse kala/rasva ja tuo `kuvat/paaruoat/karnivore-voilohi-pannulla.webp` |
| Jauhelihakulho | 1 | Snellman 20 % tuotteen sitominen, paistorasvan annokseen päätyminen, kuva | Lukitse EAN ja saanto, tuo `kuvat/paaruoat/karnivore-jauhelihakulho-munalla.webp` |

Jokaisessa kolmessa puuttuvat vielä `image`-frontmatter ja hyväksytty `docs/nutrition/calculations/<recipe_id>.json`. Julkisia neljää makrokenttää ei ole kirjoitettu; ne pysyvät poissa kunnes mallin `sourceHash`, elintarvike-ID:t, kuitu/polyolit sekä annoskohtaiset retentiot hyväksytään.

**Huomio GK:** pelkkä eläinperäinen koostumus ei anna GI:tä tai hyväksyttyä GK=0-lukua. GK:n puuttuminen voi olla kelvollinen esitystila, jos projektin muu julkaisuportti näin nimenomaisesti hyväksyy; sitä ei kuitata tässä testissä nollaksi.

**Kuvat:** PR #448:n dokumentaatio raportoi kolme kuvaehdokasta, mutta tässä keskustelussa toimitetun `karnivore-fi3-kuvaehdokkaat-2026-11-11.zip`-paketin sisältö tarkastettiin 11.11.2026: ZIP sisältää **vain kaksi** 1280 × 853 WebP:tä (Steak & Eggs ja ehdollinen voilohi) sekä kaksi tekstitiedostoa. Jauhelihakulhon WebP:tä ei ole tässä paketissa. Kaikki kolme kuvabinaaria puuttuvat GitHub-haarasta. Paketin sisältöä ei pidä rinnastaa aiemman raportin kolmeen tiedostoon ilman erillistä tarkistusta. Visuaalisessa katselmoinnissa munien keltuaiset eivät näytä riittävästi kypsiltä ja annoksissa on pippurilta näyttäviä pisteitä. Korjataan kuvat, ei turvallista kypsennysohjetta. Infografiikkakuvat eivät ole reseptikuvia.

**Julkaisu:** PR #448:n `tuonti/`-jonossa on 10 luonnosta. Seitsemän muuta säilytetään erillään. Kolmelle ensin omat kuvat, ravintolaskelmat ja tiedostot `reseptit/paaruoat/`-kansioon vain erillisessä julkaisun omistajan PR:ssä. Ruokavaliosuodattimen SHA-hyväksyntä sidotaan lopullisiin tiedostoihin ja CI testataan kyseiselle HEADille.

Tämä tarkistus ei korvaa kuvan sisällöllistä hyväksyntää tai lopullisen ravintolaskelman riippumatonta katselmointia.

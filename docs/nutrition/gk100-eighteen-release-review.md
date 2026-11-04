# GK100 · 18 hyväksytyn version julkaisuvalmistelu

Omistaja hyväksyi 4.11.2026 kaikki 18 alla olevien lähdecommitien ehdokasta julkaisuvalmisteluun. Approval Factory sitoi jokaisen päätöksen ehdokas-JSONin, alkuperäisen reseptin ja laskentasyötteiden SHA-256-tarkisteisiin. Luokittelut ja reseptipaketit luettiin tarkistetuista lähdecommiteista.

| Lähde-PR | Commit | Ehdokkaita |
| --- | --- | ---: |
| [#234](https://github.com/ozirix-dev/Reseptit/pull/234) | `7a2249f6286f49ef7daf9548b3fd31dc25d8f31b` | 5 |
| [#235](https://github.com/ozirix-dev/Reseptit/pull/235) | `118d8b8264ad57272dd1d5c03c609330871392f9` | 5 |
| [#236](https://github.com/ozirix-dev/Reseptit/pull/236) | `170393a3f2a9e6aa125bcfdd4267d3f1902ac0b5` | 2 |
| [#238](https://github.com/ozirix-dev/Reseptit/pull/238) | `2cadbab5b73ab883d97254e9aa479acd1b4ffe3b` | 6 |

| Reseptitunniste | Lähde-PR | Tila |
| --- | --- | --- |
| malesialainen-apam-balik | #234 | RELEASE_READY |
| vietnamilainen-banh-cuon-sienilla | #234 | RELEASE_READY |
| korealainen-kimchi-jeon-aamiaiseksi | #234 | RELEASE_READY |
| lanzhou-naudanliha-nuudelikeitto | #234 | RELEASE_READY |
| karibia-saltfish-fritterit | #234 | RELEASE_READY |
| valimerellinen-farinata-aamupalaksi | #235 | RELEASE_READY |
| meksikolainen-paputostada-aamupalaksi | #235 | RELEASE_READY |
| intialainen-idli-kookoschutneylla | #235 | RELEASE_READY |
| japanilainen-okayu-umeboshipluumulla | #235 | RELEASE_READY |
| rendang-padang | #235 | RELEASE_READY |
| bun-cha-hanoi | #236 | RELEASE_READY |
| mapo-tofu | #236 | RELEASE_READY |
| pohjoisafrikkalainen-baghrir | #238 | RELEASE_READY |
| thai-roti-munalla-banaanilla | #238 | RELEASE_READY |
| japanilainen-yaki-onigiri-misolla | #238 | RELEASE_READY |
| vietnamilainen-banh-bao-kananmunalla | #238 | RELEASE_READY |
| masala-dosa | #238 | RELEASE_READY |
| thai-maissifritterit | #238 | RELEASE_READY |

[Valmistelupaketti](gk100-eighteen-release-plan.json) sisältää hyväksyntä- ja tarkistesidokset. Paketti toistettiin tähän haaraan kopioiduista tiedostoista ja verrattiin mainiin `527236a8d8129e907daefe1d9fcd75b8b85bc6bd`. Vertailun kattavuusaineisto on samasta main-commitista ajettu GK-auditointi. Lähtökattavuus on 207/326 ja tämän erän odotettu lisäys on 18, jolloin kattavuus olisi 225/326. Luvut koskevat tätä erää erillään [ensimmäisen viiden luonnoksesta](https://github.com/ozirix-dev/Reseptit/pull/239).

Paketti on tuotantolataajan hakemiston ulkopuolella ja sen `publicationAuthorized` on `false`. Sisältöhyväksyntä koskee julkaisuvalmistelua. Tuotantokytkentä tarvitsee erillisen valtuutuksen.

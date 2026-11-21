# Chat 3 – kymmenen kastikkeen valmistus- ja kielirakennekatselmointi

**Päivä:** 21.11.2026  **PR:** #808  **Omistaja:** Chat 3

**Luonne:** toimituksellinen lähdevertailu ja rakennetarkistus. Ei Recipavon koekeittiötestiä, ei ravintolaskennan eikä numeerisen GK:n hyväksyntää, eikä virallista Codexin käännösten merkityskuittausta.

## GitHub-reseptit ja käännösten rakenne

Lähdereseptit FI (10) ja käännökset EN/SV/TH (30) luettiin Chat 3:n haarasta. Tarkistus vertasi kussakin kieliparissa tilan `draft`, annosmäärän, ainesosarivien lukumäärän ja niiden numeeristen määrien/yksiköiden, `image.src`-polun, valmistusvaiheiden lukumäärän sekä käännöksen `source_recipe`-viitteen FI-lähteeseen. **10/10 identiteettiä ja 40/40 tiedostoa ilman havaittuja rakenteellisia poikkeamia.** Tämä ei yksin todista mausteiden, lajien, kieltomuotojen eikä käännösten vivahteiden semanttista oikeellisuutta.

| Resepti | Ainesosia FI | Valmistusvaiheita | Vertailulähde | Toimituksellinen huomio |
| --- | ---: | ---: | --- | --- |
| perinteinen-ruskea-kastike | 5 | 4 | [K-Ruoka, ruskea kastike](https://www.k-ruoka.fi/reseptit/ruskea-kastike) | Jauhon ruskistus + liemen asteittainen lisääminen vastaavat perustekniikkaa; soija voi sisältää myös vehnää |
| kermainen-tillikastike | 6 | 3 | [Valio, tillikastike kalalle](https://www.valio.fi/reseptit/tillikastike-kalalle/) | Kermaviilipohjainen kylmä kastike; maitotuote ja kylmäsäilytys |
| kantarellikastike | 9 | 4 | [K-Ruoka, kantarellikastike](https://www.k-ruoka.fi/reseptit/kantarellikastike) | Alkuperäisestä luonnoksesta puuttui suuruste; korjattu 20 g vehnäjauhoja + 1 min kuumennus; vehnä ja maito ilmoitettu neljällä kielellä. AI-kuvasta EI saa päätellä sienen tunnistusta |
| sinappikastike-joulukinkulle | 8 | 4 | [K-Ruoka, kastike kinkulle](https://www.k-ruoka.fi/reseptit/kastike-kinkulle-ilman-paistolienta) | Recipavon versio käyttää jauhosuurustetta ja kahta sinappia, lähteessä on muuta suurustetta; menetelmää arvioitava versiona, ei lainata lähteen testausväitettä |
| kylma-piparjuurikastike | 6 | 4 | [Valio, piparjuurikastike](https://www.valio.fi/reseptit/piparjuurikastike/) | Lähde käyttää piparjuuritahnaa, Recipavo tuoretta raastetta; voimakkuus vaihtelee; maitotuote |
| perinteinen-munakastike | 7 | 4 | [Valio, munakastike](https://www.valio.fi/reseptit/munakastike/) | Maidon, munan ja jauhojen yhdistelmä; valmiiksi kovaksi keitetyt munat on ilmoitettu ainesosissa |
| kermainen-pippurikastike | 6 | 4 | [K-Ruoka, naudan pihvi ja pippurikastike](https://www.k-ruoka.fi/reseptit/naudan-pihvi-ja-pippurikastike); [Valio, konjakki-pippurikastike](https://www.valio.fi/reseptit/konjakki-pippurikastike-pihveille/) | K-Ruoan pihvipannukastike ei yksin vastaa sipuli-liemi-pohjaa; Valion vastaava menetelmä lisätty. Ei konjakkia eikä juustokermaa Recipavon versiossa |
| perinteinen-valkokastike | 6 | 4 | [Valio, valkokastike](https://www.valio.fi/reseptit/valkokastike/) | Voi, vehnäjauho, maito; vehnä- ja maitoallergeenit |
| puolukkakastike-jalkiruokiin | 4 | 4 | [K-Ruoka, puolukkakastike](https://www.k-ruoka.fi/reseptit/puolukkakastike) | Punainen keitetty marjakastike; soseutusta täsmennetty sallimaan osittain kokonaiset marjat; ei maitotuotteita |
| perinteinen-vaniljakastike | 6 | 4 | [Martat, vaniljakastike](https://www.martat.fi/reseptit/vaniljakastike/); [K-Ruoka, keksikorien vaniljakastike](https://www.k-ruoka.fi/reseptit/keksikorit) | Martat käyttää perunajauhoa, Recipavo maissitärkkelystä; jälkimmäisen käytölle löytyi vertailu K-Ruoalta, mutta eri keltuais-/nestesuhteilla. Annosta ei väitetä fyysisesti kokeilluksi |

## Kuva-auditointi

10 kuvaa on Git-tracked WebP 960 × 640. Kolme aiemmin reseptiin huonosti vastannutta havainnekuvaa (kantarelli, puolukka, vanilja) korvattiin 21.11.2026. Uudet Git-blob-SHA-tunnisteet: kantarelli `ebeb09e905ae190df7570f6792a56e3206ea361b`; puolukka `3d84d05a75f63a661fbf2e1f5ca85eb0054d7613`; vanilja `ba36fc6460cba283501744f195925b24b977b03e`. Näiden SHA-256 ja tarkat tavumäärät ovat `assets/images.tracked-overlays.json`-tiedostossa. Manifestin `approved: true` on tekninen syötehyväksyntä, **ei** toimituksellinen hyväksyntä.

## Jäljellä ennen Readyä

1. Lähdekatselmoinnin keskeneräiset reseptiversiokohtaiset kohdat, erityisesti piparjuuren voimakkuus, sinappikastikkeen suurustus ja vaniljakastikkeen saanto.
2. Reseptikohtaiset ainesosakoostumukset ja hyväksytyt ravintoarviot tai dokumentoitu perusteltu poisjättö; GK-tila perusteluineen. Ei keksittyjä nollia tai arvioita.
3. EN/SV/TH-merkitysvertailu FI-lähteeseen versiosidonnaisena näyttönä, mukaan lukien uudet kantarellin vehnäjauhot ja puolukan soseutusvaihe; tarvittaessa ihmiskatselmointi.
4. AI-havainnekuvien lopullinen sisällöllinen tarkistus ja julkaisuportit; nykyinen Draft PR #808 ei ole merge- eikä Cloudflare-julkaisulupa.

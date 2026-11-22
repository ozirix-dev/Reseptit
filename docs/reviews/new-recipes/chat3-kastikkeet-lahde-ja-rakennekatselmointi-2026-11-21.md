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
| perinteinen-munakastike | 7 | 4 | [Martat, kananmunakastike](https://www.martat.fi/reseptit/kananmunakastike/) | Marttojen maitopohjainen vehnäsuuruste ja kovaksi keitetyt munat vastaavat Recipavon menetelmäperiaatetta. Recipavo käyttää tilliä Marttojen ruohosipulin sijasta ja omia punnittuja määriä |
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

## Live-lähdevertailu 22.11.2026 – Chat 3

**Tarkistusrevisio ennen tätä täydennystä:** `4d150a254bcf438b0f396263364b6f96eb98083d`. Kymmenen FI-reseptin tämänhetkiset ensisijaiset valmistuksen vertailusivut luettiin suoraan K-Ruoan, Valion tai Marttojen julkaistuista ohjeista. **10/10 vertailusivua löytyi**, mutta ulkopuolisen ohjeen kokkikokeilu ei todista Recipavon muuttuneita ainesosamääriä tai valmistustulosta.

| Recipavo recipe_id | Tarkistetun vertailulähteen tukema periaate | Olennaisin muutos / julkaisuun jäävä epävarmuus |
| --- | --- | --- |
| `perinteinen-ruskea-kastike` | [K-Ruoka](https://www.k-ruoka.fi/reseptit/ruskea-kastike): voi–vehnäjauhon ruskistus, lämmitetty liemi ja vähittäinen suurustus | Puljonki Signature ja Kikkoman sekä niiden massat ovat oma täsmätuotemäärittely; ei K-Ruoan mittojen kopio |
| `kermainen-tillikastike` | [Valio](https://www.valio.fi/reseptit/tillikastike-kalalle/): kylmä kermaviili–tilli–sitruunamehukastike | Valion 200 g pohja vastaa ainesluokkaa; 15 min maustuminen ja punnitut määrät ovat Recipavon sovitus |
| `kantarellikastike` | [K-Ruoka](https://www.k-ruoka.fi/reseptit/kantarellikastike): kantarellit, sipuli, vehnäjauhot ja kerma suurustettuna | 350 g puhdistettuja sieniä, 20 g vehnäjauhoja ja kuivalla pannulla nesteen haihdutus; oma suhde, ei fysikaalista koekeittiötestiä eikä AI-kuva sienten tunnistukseen |
| `sinappikastike-joulukinkulle` | [K-Ruoka](https://www.k-ruoka.fi/reseptit/kastike-kinkulle-ilman-paistolienta) käyttää sinappia, kermaa ja suurustetta; [Martat](https://www.martat.fi/reseptit/kinkun-kastike/) käyttää vehnäjauhoja, sinappia ja kermaa | Recipavossa kasvisliemi, voi–vehnäsuuruste ja kaksi yksilöityä sinappia; Marttojen ohjeessa kinkun paistolientä, K-Ruoan ohjeessa fondi ja toisen tyyppinen suuruste. Ei sama resepti |
| `kylma-piparjuurikastike` | [Valio](https://www.valio.fi/reseptit/piparjuurikastike/): kylmä 12 % crème fraîche -kastike; [Valio](https://www.valio.fi/reseptit/graavattu-piparjuurilohi/): tuoreen raastetun piparjuuren käyttö kastikkeessa | Recipavossa 20 g tuoretta raastetta ja 200 g 12 % crème fraîchea; piparjuuren makuvoimakkuus ja täydellinen tuotekoostumus jäävät arvioitaviksi |
| `perinteinen-munakastike` | [Martat](https://www.martat.fi/reseptit/kananmunakastike/): maito, voi, vehnäjauho, keitetty kananmuna, noin 5 min hiljainen kuumentaminen | Martat käyttää ruohosipulia/kesäsipulia, Recipavo 15 g tilliä ja 120 g kuorittuja kovaksi keitettyjä munia. Lähtömäärät erilaiset |
| `kermainen-pippurikastike` | [K-Ruoka](https://www.k-ruoka.fi/reseptit/naudan-pihvi-ja-pippurikastike): kermapohjainen pippurikastike; [Valio](https://www.valio.fi/reseptit/konjakki-pippurikastike-pihveille/): voissa kuullotettu salottisipuli, liemi, kerma ja sinappi | Recipavolla tavallinen kuohukerma, Dijon-sinappi ja lihaliemi, ilman Valion pippurijuustokermaa, konjakkia ja muita lisäaineksia; ei lähteiden ravintoarvoja sellaisenaan |
| `perinteinen-valkokastike` | [Valio](https://www.valio.fi/reseptit/valkokastike/): voi, vehnäjauhot, maito, nopea suurustus | Recipavo punnitsee 500 g täysmaitoa, käyttää pieniä maustemääriä; toinen maitotuote ja eri suhde kuin Valion alkuperäisessä ohjeessa |
| `puolukkakastike-jalkiruokiin` | [K-Ruoka](https://www.k-ruoka.fi/reseptit/puolukkakastike): puolukka–vesi–sokeripohja; [Martat](https://www.martat.fi/reseptit/marjakastike/): kuumennettu sokeriliemi ja marjasose | K-Ruoka käyttää kylmää siivilöityä puolukkaa; Martat kuumentaa sokeriliemen. Recipavon koko marjan 4–5 min haudutus ja kuorien säilytys ovat oma versio, eikä kumpikaan lähde testaa sitä suoraan |
| `perinteinen-vaniljakastike` | [Martat](https://www.martat.fi/reseptit/vaniljakastike/): maito, keltuainen, sokeri, tärkkelys, jatkuva sekoitus ja kiehumisen välttäminen; [K-Ruoka](https://www.k-ruoka.fi/reseptit/keksikorit): maissitärkkelys + keltuainen kastikepohjassa; [Valio](https://www.valio.fi/reseptit/kuohkea-sitruuna-vaniljakastike/): kuumennus noin 85 °C:seen | Martat käyttää perunajauhoa; K-Ruoka lisää kermaa ja käyttää eri suhteita; Recipavon 450 g täysmaitoa, 18 g maissitärkkelystä ja 30 g keltuaista ovat oma vielä fyysisesti testaamaton sovitus |

**Ruokaturvallisuus:** Recipavon puolukkaresepti käyttää vain kotimaisia puolukoita. [Ruokavirasto](https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/turvallisen-kayton-ohjeet/ulkomaiset-pakastemarjat/) ohjeistaa *ulkomaiset pakastemarjat* kuumentamaan vähintään 90 °C:ssa 5 min tai keittämään 2 min; 4–5 min hiljainen haudutus ei yksin takaa tätä. Kotimaisen alkuperän rajaus ja pakkausmerkinnän tarkistus pidetään ennallaan.

**Katselmoinnin tulos:** Ensisijaisten vertailulähteiden saatavuus ja **ruokalajikohtainen valmistusperiaate**: `EDITORIAL_SOURCE_RELEVANCE_PASS_10_OF_10`. Tämä ei ole laskettu GK, laboratorio-/koekeittiömittaus, yksilöityjen kaupallisten tuotteiden jokaisen ravintokomponentin varmennus, itsenäisen ulkopuolisen hyväksyjän lausunto eikä `decision: approved`. FI/EN/SV/TH ja PR pysyvät `draft` / `HOLD`.

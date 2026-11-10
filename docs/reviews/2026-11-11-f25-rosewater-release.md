# F25 – pistaasi-ruusuvesijogurtin kolmen kielen julkaisuaihe (11.11.2026)

## Yksi lähde, kolme kieliparia

Julkinen `lahi-ita-pistaasijogurtti`-lähde on 2 annoksen **kylmä resepti**. F25:n aiemmat 7 lähdettä / 21 kieliparia julkaistiin PR #408/#413/#415/#424:ssä. Tämä rajattu main-pohjainen työ kasvattaisi tilanteeseen **8/25 reseptiä, 24/75 kieliparia**; koko rekisteri olisi **67 FI-lähdettä / 201 kieliparia**. Vanhaa 75 Draftin [#399](https://github.com/ozirix-dev/Reseptit/pull/399)-PR:ää **ei yhdistetä**.

## Lähteen ja ravintoarvon vastineet

- Jogurtti 200 g **maustamaton, makeuttamaton 3,9 %**, Fineli 620.
- Pistaasinsydämet 20 g **raakoja ja suolaamattomia**, AFCD F006113.
- Granaattiomenan siemenet 60 g syötävää osaa, AFCD F006842.
- Ruusuvesi 5 ml **makeuttamatonta, elintarvikekäyttöön tarkoitettua**, esimerkiksi Al Wadi Rose Water; **ei ruusisiirappi**.
- Vapaaehtoinen suola ei muuta makroja. Kaikki ainekset jaetaan 2 annokseen, eikä niitä kypsennetä.

Valmistajan [Al Wadi Rose Water](https://www.alwadi.com/english/products/rose-water) ilmoittaa 100 g:n ravintoarvoiksi 0 g proteiinia, rasvaa ja hiilihydraattia. Ainesosat: vesi, ruusuvesitiiviste 3 %, luonnollinen ruusuaromi. Tuotteessa ei ole listattua sokeria. [Al Wadi Rose Water All Natural](https://www.alwadi.com/english/products/allnaturalrosewater) on vaihtoehtoinen sokeroimaton tuote. Suomessa [Sevanin ruusuvesi](https://sevan.fi/tuotteet/ruokakomero/mausteet-ja-maustaminen/maustaminen/ruusuvesi) ilmoittaa hieman eri ravintoarvot: HH 0,1 g ja rasvaa 0,3 g / 100 g. **Etikettien 0 g voi olla pyöristetty ilmoitus**, joten kahden desimaalin viimeistä numeroa ei pidä tulkita laboratoriotarkaksi tai kaikilla merkeillä samaksi.

Kanonisessa [laskentasyötteessä](../../docs/nutrition/calculations/lahi-ita-pistaasijogurtti.json) 5 ml ruusuveden kontribuutio on jo jätetty makroista pois konservatiivisen maustemääräarvion perusteella. Uusi tuotetieto tukee juuri tätä rajattua laskentatulkintaa. Neljä **arvioitua** makroa / annos: **netto-HH 8,23 g; HH kuidun kanssa 10,92 g; proteiini 5,27 g; rasva 8,82 g**. Esimerkiksi laskennallinen rasva ilman ruusuvettä: (200×3,9/100 + 20×48,6/100 + 60×0,2/100) / 2 = **8,82 g**. `reviewerStatus: AUTOMATED ONLY` säilyy. Uusi tuotteiden makrolaskenta vaaditaan jos makeutettua tuotetta tai olennaisesti eri tuotetta käytetään.

## Merkitystarkistus ja hashit

FI-julkinen SHA-lukittu ohje täsmentää jogurtin rasvaprosentin, raakojen suolaamattomien pistaasien sekä makeuttamattoman ruusuveden. FI-raakatiedostoa, ainesmassaa, neljää makroa, GI/GK-lukkoja tai kuvia **ei muuteta**. EN/SV/TH-teksteissä on kaikki samat tiedot ja neljä valmistusvaihetta, eikä ohjeissa lisätä sokeria, siirappia, öljyä tai ylimääräisiä aineksia. Tekstin käännökset ovat AI-katselmoituja, eivät natiivipuhujan tarkistamia.

Julkisen FI-lähteen SHA-256: `9db5753953ff3cc703e69d05d306141f569da8602118dc1de80ae6d457287e26`.
- EN: `7d218d15f5de5ecf72baae19df3a1f568749cba40d4294c3e656632295a2b209`
- SV: `a00e99b07c7b651c39e7b09e71f81818df4e100a2d02bd53a786ccb24d00c389`
- TH: `54bfe5e817b3c9fc9fe91193f9739803e6ee26b49806ef8426ff0dc96703a35b`

## Muut F25-jäännöskohteet

Tämän reseptin jälkeen 17 lähdettä / 51 käännöstä jatkokäsittelyssä. Näistä **9 reseptiltä puuttuu ainesosakohtainen ravintolaskentasyöte**: rahka-marjakerroskulho, maakouda, karibialainen plantain-aamiaislautanen, munakoiso-kesäkurpitsalasagne, pinaatti-paneer-chilla, chilaquiles verdes, paputostada, nasi goreng ja kimchi-jeon. Ilman uutta punnittua lähdettä niitä ei julkaista.

Loput **8 tarvitsevat kohdennetun resepti-/tuotetarkistuksen**: hojicha-jogurtti (syötävä tee 2 g), papaija-kookospuuro (tapiokan tyyppi ja keittoaika), doujiang-soijamaito (riisiviinietikka ja juoksettuminen), za’atar-munat (1 tl punnitsematon mausteseos), bánh xèo (kurkuma), bánh cuốn (porsaan kypsennys ja riisilevyt), baghrir (vesimäärä ja paisto) ja Thai-roti (reseptin nimi ja oikea taikinamenetelmä). Aineita ei imputoida sokkona.

## Julkaisuportti

1. Tämän PR:n täsmällinen HEAD CI SUCCESS, erityisesti sisältö, makrot, kaikki kolme FI↔kielimerkityshashia sekä FI-raakasisällön sinetti.
2. Yhdistä rajattu julkaisu-PR; älä yhdistä #399:n 75 luonnosta.
3. Uudemman `main`-haaran Pages build + deploy SUCCESS; julkisten kielireittien HTTP-tarkistus erikseen. Cloudflare Coming Soon -sivua ei muuteta.

Ei väitetä riippumatonta ravintotutkimusta, natiivipuhujaa eikä koepaistoa.

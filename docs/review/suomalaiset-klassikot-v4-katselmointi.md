# Suomalaiset suosikit – vaihe 4, toimituksellinen katselmointipaketti

Päivitetty 6.11.2026. PR #311, **DRAFT**. Vaihetta 4 ei merkitä julkaisuvalmiiksi ilman kuvien ja ravintoarvojen näyttöä.

## Toteutettu

- **15 kieliversiota:** FI-lähteen rinnalle lisätty EN/SV/TH-luonnokset kaikille viidelle. Polut `kaannokset/{en,sv,th}/{paaruoat,leivonnaiset}/<recipe_id>.md`, jokaisessa `status: draft`.
- **Rakenteen katselmointi:** 15/15 sisältää lähdereseptin kanssa täsmälleen saman järjestetyn grammamääräsarjan; 15/15 pidetään ilman ravintoarvonumeroita. Ei päätelmää, että ihmisen tekemä kielentarkistus olisi valmis.
- **Kuvabriefit:** [suomalaiset-klassikot-v4-kuvabriefit.json](suomalaiset-klassikot-v4-kuvabriefit.json) määrittää 5 oikeaa ruokaa kuvaavaa alkuperäiskuvaa, kullekin nelikieliset alt-tekstit ja lähdetarkkuuden hyväksymiskriteerit. **Viisi erillistä, reseptin mukaista AI-ruokakuvaa on luotu ja tallennettu JPEG-lähdekuvina GitHubiin** polkuun `docs/review/kuvat/suomalaiset-klassikot/`. Ne eivät vielä ole WebP-julkaisukuvia eivätkä aktiivisia reseptikuvia. AI:lla tuotetut käyttöliittymähahmotelmat eivät ole kelvollisia reseptikuvia.
- **SEO ja tekninen rajaus:** nykyinen yhden alkuperäis-WebP:n `image.src` ja automaattiset 480/960/1440 versiot säilyvät. Kolmen kuvasuhteen `image.variants` on vasta suunnitelma; ei lisätä skeemaan tai näihin resepteihin ilman erillistä teknistä muutosta.
- **Ravintoarvot:** 5/5 edelleen `null`, koska lähdekandidaatit eivät vastaa hyväksyttyä kokonaislaskelmaa. GK kaikilla HOLD. Ei arvauksia eikä GI-ryhmäanalogiaa.

## Kieliversioiden riskikatselmointi

| Resepti | EN/SV/TH erityiset tarkistukset | Katselmointitila |
| --- | --- | --- |
| Karjalanpiirakat | riisipuuro, ruis/vehnä, 275 °C, 15–20 min, 24 kpl, munavoi erillään, APT-nimi | AUTOMATED STRUCTURE ONLY; HUMAN REVIEW PENDING |
| Marry me -kanapasta | **nestemäinen** 38 % kuohukerma, kana yli 75 °C, spaghetti n°12, valutettu tomaatti, 4 annosta | AUTOMATED STRUCTURE ONLY; HUMAN REVIEW PENDING |
| Uunifetapasta | penne n°73, feta, 200 °C, 20 + 8–10 min, alkuperäisen tekijän tunnustus, ei kanaa | AUTOMATED STRUCTURE ONLY; HUMAN REVIEW PENDING |
| Raejuustobagelit | 6 kpl, ei hiivaa eikä keittämistä, 200 °C, 25–30 min, munavoitelun jäämä | AUTOMATED STRUCTURE ONLY; HUMAN REVIEW PENDING |
| Linssimakaronilaatikko | 6 annosta, 190 °C, 35–45 min, ei lihaa, kuivat painot, ei keto-väitettä | AUTOMATED STRUCTURE ONLY; HUMAN REVIEW PENDING |

Automaattiset määrät, tilat, otsikot ja valmistusosioiden olemassaolo **eivät todista täydellistä kielten merkitysvastaavuutta**. Kirjaa ihmistarkistus vasta todellisen hyväksynnän jälkeen `meta/kaannokset/human-review-evidence.json`-rekisteriin ohjeen mukaisesti. Älä lisätä omaa generointia ihmisen hyväksynnäksi.

## Vaiheeseen 5 siirtymisen portit

1. Hanki tai generoi **viisi itsenäistä oikean ruoan kuvaa**, tarkista vastine reseptiin ja tallenna hyväksytty WebP GitHubiin. PR sisältää viisi katselmointi-JPEG-kuvaa, mutta ei vielä tuotannon WebP-kuvia eikä julkaistavia `image.src`-viittauksia.
2. Tee viidelle ruokalajille koepaisto/-keitto. Mittaa erityisesti karjalanpiirakan kaulintajauho ja voi, bagelien voitelumuna sekä pastojen valutus. Kirjaa testattu annoskoko.
3. Ratkaise 69/72 g spagetti-CHO-ristiriita todellisesta pakkauksesta sekä muut tuote- ja vastaavuusesteet. Tee lähdeperusteinen `docs/nutrition/calculations/`-laskenta erillisellä hyväksynnällä.
4. Hae hyväksyttävä mitattu GI täsmävalmisteelle tai säilytä **GK ei arvioitavissa**. Älä estä perinnereseptin sisältökatselmointia vain siksi, että GI-lähdettä ei vielä ole.
5. Ihmistarkistuksen jälkeen päivitä `translation_status` ja julkaisuaseman muutokset tarkoituksella omassa vaiheessaan; testit ja omistajan lupa ennen mergeä.

**Tämän erän tulos:** 15 käännösluonnosta, 5 oikean ruoan JPEG-lähdekuvaa sekä WebP-muunnosskripti ja hyväksyntäkortit. EI vielä valmiita WebP-julkaisukuvia, EI GK-/ravintoarvohyväksyntää, EI fyysisiä koekeittoja eikä julkaisua.

## Vaiheen 4 kuva- ja käännösjatko (6.11.2026)

- **5/5 tekoälyllä generoitua ruokakuvaa** katselmoitiin visuaalisesti ja tallennettiin JPEG-lähteinä `docs/review/kuvat/suomalaiset-klassikot/`. Uudelleengeneroitu bagelikuva sisältää kuusi rengasta; vanhaa viiden renkaan kuvaa ei käytetä. Kaikkien lähdekuvien mitat ovat **2016 × 1152** ja niissä on vain ruokaa, ei UI-elementtejä.
- **WebP-konversio tekemättä** tässä ympäristössä. Käännösskripti löytyy `docs/review/convert-finnish-classics-webp.mjs`; se tuottaa 1600 × 900 WebP:t nykyisiin `kuvat/leivonnaiset/` ja `kuvat/paaruoat/` -kansioihin vasta erikseen ajettuna. JSON-kuvamanifesti osoittaa jo tarkat tulevat polut, mutta reseptien `image.src` ei viittaa olemattomiin tiedostoihin.
- Kuvien oikeuksien ja brändin läpinäkyvyys: **AI-generoidut havainne-/ruokakuvat**, eivät todiste todellisesta koepaistosta. Kuvien ruokalajia vastaava sisältö on alustavasti tarkistettu, mutta omistajan lopullinen kuvahyväksyntä on yhä avoin.
- **20/20 kieliversiota** (5 FI + 15 EN/SV/TH) läpäisi rivikohtaisen grammamäärien ja annoskokojen, valmistusvaiheiden lukumäärän sekä valikoitujen keskeisten lämpötilojen ja aikavälien tarkistuksen. Tämä ei vastaa riippumatonta ihmistarkistusta eikä korvaa täydellistä merkityksen ja luontevuuden katselmointia.
- Kaikkien 15 käännösluonnoksen ravintoarvot pysyvät `null` ja tilat `draft`. Reseptin GI/GK-puutetta tai ruokavalioluokkaa ei saa täydentää arvaamalla.

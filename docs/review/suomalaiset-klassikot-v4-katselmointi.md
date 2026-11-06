# Suomalaiset suosikit – vaihe 4, toimituksellinen katselmointipaketti

Päivitetty 6.11.2026. PR #311, **DRAFT**. Vaihetta 4 ei merkitä julkaisuvalmiiksi ilman kuvien ja ravintoarvojen näyttöä.

## Toteutettu

- **15 kieliversiota:** FI-lähteen rinnalle lisätty EN/SV/TH-luonnokset kaikille viidelle. Polut `kaannokset/{en,sv,th}/{paaruoat,leivonnaiset}/<recipe_id>.md`, jokaisessa `status: draft`.
- **Rakenteen katselmointi:** 15/15 sisältää lähdereseptin kanssa täsmälleen saman järjestetyn grammamääräsarjan; 15/15 pidetään ilman ravintoarvonumeroita. Ei päätelmää, että ihmisen tekemä kielentarkistus olisi valmis.
- **Kuvabriefit:** [suomalaiset-klassikot-v4-kuvabriefit.json](suomalaiset-klassikot-v4-kuvabriefit.json) määrittää 5 oikeaa ruokaa kuvaavaa alkuperäiskuvaa, kullekin nelikieliset alt-tekstit ja lähdetarkkuuden hyväksymiskriteerit. **Varsinaisia viittä WebP-ruokakuvaa ei ole luotu eikä lisätty GitHubiin.** AI:lla tuotetut käyttöliittymähahmotelmat eivät ole kelvollisia reseptikuvia.
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

1. Hanki tai generoi **viisi itsenäistä oikean ruoan kuvaa**, tarkista vastine reseptiin ja tallenna hyväksytty WebP GitHubiin. Nykyinen PR ei sisällä kuvia eikä mainosta olemattomia kuvia.
2. Tee viidelle ruokalajille koepaisto/-keitto. Mittaa erityisesti karjalanpiirakan kaulintajauho ja voi, bagelien voitelumuna sekä pastojen valutus. Kirjaa testattu annoskoko.
3. Ratkaise 69/72 g spagetti-CHO-ristiriita todellisesta pakkauksesta sekä muut tuote- ja vastaavuusesteet. Tee lähdeperusteinen `docs/nutrition/calculations/`-laskenta erillisellä hyväksynnällä.
4. Hae hyväksyttävä mitattu GI täsmävalmisteelle tai säilytä **GK ei arvioitavissa**. Älä estä perinnereseptin sisältökatselmointia vain siksi, että GI-lähdettä ei vielä ole.
5. Ihmistarkistuksen jälkeen päivitä `translation_status` ja julkaisuaseman muutokset tarkoituksella omassa vaiheessaan; testit ja omistajan lupa ennen mergeä.

**Tämän erän hyväksytty tulos on valmistellut käännökset ja kuva-/ravintovaatimukset – ei kuvien, GK:n tai julkaisemisen valmius.**

# FI-reseptikirjaston toimituksellinen inventaario – P1, 21.11.2026

**Aihe:** [issue #327](https://github.com/ozirix-dev/Reseptit/issues/327) / koko kirjaston toistuvien ingressien, geneeristen valmistusvaiheiden ja metatietojen inventaario.  
**Lähtö-main:** `c5fc649a937a8a7df7a5c90362700f81ea42dd9c`.  
**Tila:** erillinen, vain lukeva automaattinen inventaariomenetelmä. Raportti ei ole uuden reseptin hyväksyntä eikä nykyisen Cloudflare-tuotannon sisältövarmistus.

## Miksi tämä on erillinen työ?

[PR #725](https://github.com/ozirix-dev/Reseptit/pull/725) yhdisti jo 18.11. tehdyn **20 FI-reseptin toimituksellisen katselmoinnin**. Sen **8 P2 + 6 P3** havaintoa käsiteltiin myöhemmissä korjaus-PR:issä. Tämä työ ei tee samaa 20:n manuaalista näytearviointia uudestaan. Tässä lisätään koko julkaisukelpoiseksi merkityn FI-lähdekannan yhtenäinen inventaario ja katselmointijono.

## Rajaus

- Käydään läpi kuusi alkuperäistä `reseptit/{aamupalat,valipalat,alkuruoat,paaruoat,jalkiruoat,leivonnaiset}/`-hakemistoa.
- Mukaan otetaan vain `language: fi` + `status: published` ja jätetään nykyisen karanteenirekisterin identiteetit laskennan ulkopuolelle.
- Jokaisesta mukana olevasta tiedostosta syntyy luettava `recipeId`, polku, täsmällinen Git-blob-SHA, kategoria, aika, vaikeus, aloituskuvaus, ensimmäinen valmistusvaihe ja **heuristiset** katselmointisignaalit.
- Täsmälleen saman ingressin tai ensimmäisen valmistusvaiheen vähintään kolmessa eri tiedostossa esiintyvä osuma listataan toistoryhmänä. Myös nimettyjä geneerisiä muotoiluja etsitään.
- Tarkistetaan puuttuvat valmistusvaiheet, kokonaisajat, mahdolliset pitkän levon ja ilmoitetun valmistusajan ristiriidat sekä mahdollisesti puuttuvan tekijä-/lähdeviitteen tarkistustarve.
- Julkaistujen tiedostojen kokonaismäärä, ohitettujen ja karanteenissa olevien määrät sekä valmistusaika- ja vaikeusjakaumat syntyvät laskettuna. Käännöksiä tai muita raakaluonnoksia **ei lasketa uusiksi alkuperäisresepteiksi**.

**Rajoitus:** URL:n tai nimettyjen lähdeotsikkojen puuttuminen on vain tutkimusvihje, ei näyttöä tekijänoikeusrikkomuksesta. Samalta kuulostava ingressi ei todista väärää ohjetta. Scripti ei laske ravintoarvoja, tarkista GK:ta, tee koekeittiötestiä eikä päätä reseptin HOLD-tilaa.

## Käyttö paikallisesti tai CI-ympäristössä

Aja repon nykyisessä työpuussa:

```sh
cd site
npx tsx scripts/editorial-fi-inventory.ts
npx tsx scripts/editorial-fi-inventory.ts --json
npx tsx --test tests/editorial-fi-inventory.test.ts
```

Komennot lukevat paikalliset Markdown-tiedostot ja kirjoittavat vain standardiulostuloon. Jos raportti halutaan talteen, ohjaa tuloste erikseen `tmp/`-hakemistoon; älä lisää massiivista generoituvaa väliraporttia Gitin historiaan. CLI on tarkoituksella erillinen eikä muuta buildia tai julkaisupolkua.

## Testin hyväksymisehdot

1. Vain julkaistut FI-lähteet, ei EN/SV/TH, Draftit tai karanteenireseptit.
2. Toistuvan ingressin ja aloitusvaiheen ryhmäsignaali on deterministinen; pienet yksittäiset samankaltaisuudet eivät ole automaattinen virhe.
3. Puuttuvat vaiheet ja epäuskottava ilmoitettu kokonaisaika tuottavat vain katselmointisignaalin.
4. Todellinen kuuden hakemiston skannaus valmistuu, lähde-blobit kirjataan, eikä parsintavirheitä ohiteta huomaamatta.
5. Yksikään testi tai skannaus ei muuta `reseptit/`, `kaannokset/`, ravinto-/GK-rekistereitä, kuva-aineistoa tai julkaisuportteja.

## Jatkotoiminta P2 / P3

Käsittele automaattisen listan kohteita ruokalajeittain, vertaa nykyiseen **käyttäjälle näkyvään projektionäkymään** ja aiempiin #327/#404-korjauksiin ennen uuden tehtävän avaamista. Kunkin mahdollisen korjauksen lähde, nykyinen blob ja riippumaton ruokalaji-/valmistusnäyttö tarkistetaan erikseen; pelkkä heuristiikka ei oikeuta muuttamaan historiallisia sinettejä.

Varsinainen reseptin muutos, EN/SV/TH-semanttinen katselmointi, ravinto-/GI/GK-vaikutus, kuva ja julkaisu hyväksytään normaalien projektin porttien mukaan. Ei tähän automaattiseen P1-PR:ään kuuluvia reseptikorjauksia.

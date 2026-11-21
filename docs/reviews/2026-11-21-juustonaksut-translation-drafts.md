# Rapeat cheddarjuustonaksut – EN/SV/TH-käännösluonnosten lähdevertailu

**21.11.2026 · DRAFT / EI JULKAISUHYVÄKSYNTÄÄ**

## Rajaus ja omistajuus

- Pohjana julkinen FI-lähde [rapeat-juustonaksut.md](../../reseptit/valipalat/rapeat-juustonaksut.md), täsmä-Git-blob **af69aab954bf3ed06e3eb5294d51954679a940ef**; lähtö-main **9904979584676d5f966b706ae1975442e101f44c**.
- Uusi sisältö: kolme **status: draft** -käännöstä polkuihin kaannokset/{en,sv,th}/valipalat/rapeat-juustonaksut.md. Ei julkisia reittejä eikä lisäystä published-translation-pairs.json-julkaisuluetteloon. Ei FI-lähteen, ravintolaskelman, kuvan, GK:n tai Cloudflaren muutoksia.
- Käyttäjän toinen keskustelu omistaa PR #771:n thaimaalaisen pääruoan; tähän työhaaraan ei oteta sen tiedostoja.
- Lähdetoimitus: [PR #754](https://github.com/ozirix-dev/Reseptit/pull/754) julkaisi cheddarjuustonaksujen FI-reseptin. Kyse ei ole uudesta resepti-identiteetistä.

## Merkitysvastaavuus – tässä tehty AI-luonnoskatselmus

| Merkityskohde | FI-lähde | EN / SV / TH |
| --- | --- | --- |
| Ainesosat | 140 g cheddarraastetta, rasvaa noin 34 %, + 1 g savupaprikajauhetta | Samat kaksi ainesosaa ja painoa, cheddarin rasvaosuus ja savupaprika säilyvät |
| Uuni ja erä | 200 °C ylä- ja alalämmöllä; 12 matalaa juustokekoa | Sama lämpö, lämmitystapa ja 12 kappaletta |
| Kypsennys | Keskitaso, 6–9 min; kupliminen ja kultaiset reunat | Sama aika ja kypsyyden näkyvät merkit |
| Jäähtyminen / annos | Pellillä vähintään 5 min; 3 lastua annosta kohden; neljä annosta | Sama järjestys, vähimmäisjäähdytys ja annostus |
| Allergeeni | Maito | milk / mjölk / นม (ei lisätä kananmunaa tai muita allergeeneja) |
| Ravintokentät | Netto-HH 0,04 g, koko-HH 0,04 g, proteiini 8,97 g, rasva 12,04 g / annos | Kaikki neljä samaa numeerista arvoa ja sama 4 annoksen perusta |
| Rasva ja savupaprika | Koko cheddarin rasva mallissa; pellille jäävä vähentää syötyä rasvaa; paprikan 0,25 g/annos rajattu pois, koska polyolit eivät ole ilmoitettuja | Sama varauma, **ei** väitetä polyolien olevan nolla |
| GK ja kuva | GK määrittämätön; 3 lastua näyttävä kuvitus | GL ei määritetty, kuvitusta ei väitetä koevalmistuskuvaksi |

Käännökset on laadittu tässä ChatGPT-keskustelussa vertaamalla suomenkielistä lähdettä ja jokaisen kielen ilmaisuja, mukaan lukien thai-työvaiheiden takaisin suomeksi tarkastettu merkityssisältö. **Tämä ei ole väite Codexin tekemästä riippumattomasta katselmoinnista eikä ihmistarkistuksesta.**

Projektin [käännöspolitiikka](../translation-review-policy.md) vaatii julkaistaville kielipareille ajantasaisen semanttisen katselmoinnin ja merkitystiivisteet. Näitä kolmea luonnosta **ei** rekisteröidä codex-review-evidence.json-rekisteriin hyväksyttyinä, koska julkaisuun edellytetty lopullinen katselmointiprosessi odottaa. Erillistä ihmistarkistusta tarvitaan vain, jos olennainen sisältö- tai turvallisuusepäselvyys jää jäljelle.

## Tekninen suoja ja jatkopiste

Testi site/tests/juustonaksut-translation-drafts.test.ts varmistaa:
- FI-lähteen Git-blob-lukituksen.
- Kolmen Draft-lähteen skeeman, alkuperälinkin, 2 raaka-ainemäärää, neljä makroarvoa, yhden kuvan polun ja annetut annos-/aikaluvut.
- Kaikkien kolmen kielen 200 °C / 12 kpl / 6–9 min / vähintään 5 min / 3 kpl per annos -ohjeet sekä maitoallergeenin, 0,25 g paprikan ja määrittämättömän GK:n.
- Sen, ettei yksikään käännös päädy julkiseen siteContent.recipes-luetteloon tai translation-pair-julkaisusivurekisteriin.

**Julkaisun seuraavat portit:** hyväksytty täsmä-SHA-semantiikkakatselmointi, codex-review-evidence.json-tietueet, vaihtaminen **status: published** -tilaan ja sivuston oikeat reitit sekä kohdennetut käännös-/kuva-/ravinto-/CI-testit. Sen jälkeen Repo Guard ja erikseen hallittu Cloudflare-julkaisu. Jokainen julkaisumuutos on uusi PR, joka poistaa tai päivittää tämän Draft-suojatestin tarkoituksellisesti.

**Ei uutta numeerista GK:ta, ei ravintoarvojen muutoksia eikä teennäistä polyolihyväksyntää.**

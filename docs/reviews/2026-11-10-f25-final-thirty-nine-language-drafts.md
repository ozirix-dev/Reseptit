# F25 – viimeiset 13 FI-reseptiä × EN/SV/TH = 39 Draftia

10.11.2026. Tämä täydentää [F25 Draft #399](https://github.com/ozirix-dev/Reseptit/pull/399) -erän tavoitteen **25 FI-reseptiä × kolme kieltä = 75/75 Draftia**. Aiemmat 36 käännöstä säilyvät. Näillä uusilla 39:llä on sama `status: draft` ja sama kanoninen FI-punnitus.

## Reseptit

- `intialainen-pinaatti-paneer-chilla`: EN, SV ja TH; lähteen 2 annosta ja 25 minuutin aika, punnitukset ja annetut neljä makroa säilyvät. 5 valmistusvaihetta/kieli.
- `vietnamilainen-papaija-kookospuuro`: EN, SV ja TH; lähteen 2 annosta ja 25 minuutin aika, punnitukset ja annetut neljä makroa säilyvät. 4 valmistusvaihetta/kieli.
- `uunimuna-avokadot`: EN, SV ja TH; lähteen 2 annosta ja 25 minuutin aika, punnitukset ja annetut neljä makroa säilyvät. 5 valmistusvaihetta/kieli.
- `intialainen-besan-chilla`: EN, SV ja TH; lähteen 2 annosta ja 25 minuutin aika, punnitukset ja annetut neljä makroa säilyvät. 4 valmistusvaihetta/kieli.
- `thai-kananmunat-kookoscurryssa`: EN, SV ja TH; lähteen 2 annosta ja 25 minuutin aika, punnitukset ja annetut neljä makroa säilyvät. 4 valmistusvaihetta/kieli.
- `vietnamilainen-banh-xeo-aamiaisletut`: EN, SV ja TH; lähteen 2 annosta ja 25 minuutin aika, punnitukset ja annetut neljä makroa säilyvät. 4 valmistusvaihetta/kieli.
- `vietnamilainen-banh-cuon-sienilla`: EN, SV ja TH; lähteen 2 annosta ja 25 minuutin aika, punnitukset ja annetut neljä makroa säilyvät. 4 valmistusvaihetta/kieli.
- `pohjoisafrikkalainen-baghrir`: EN, SV ja TH; lähteen 2 annosta ja 25 minuutin aika, punnitukset ja annetut neljä makroa säilyvät. 4 valmistusvaihetta/kieli.
- `thai-roti-munalla-banaanilla`: EN, SV ja TH; lähteen 2 annosta ja 25 minuutin aika, punnitukset ja annetut neljä makroa säilyvät. 4 valmistusvaihetta/kieli.
- `meksikolainen-chilaquiles-verdes`: EN, SV ja TH; lähteen 2 annosta ja 25 minuutin aika, punnitukset ja annetut neljä makroa säilyvät. 4 valmistusvaihetta/kieli.
- `meksikolainen-paputostada-aamupalaksi`: EN, SV ja TH; lähteen 2 annosta ja 25 minuutin aika, punnitukset ja annetut neljä makroa säilyvät. 4 valmistusvaihetta/kieli.
- `indonesialainen-nasi-goreng-aamiaisriisi`: EN, SV ja TH; lähteen 2 annosta ja 25 minuutin aika, punnitukset ja annetut neljä makroa säilyvät. 4 valmistusvaihetta/kieli.
- `korealainen-kimchi-jeon-aamiaiseksi`: EN, SV ja TH; lähteen 2 annosta ja 25 minuutin aika, punnitukset ja annetut neljä makroa säilyvät. 4 valmistusvaihetta/kieli.

Tämä lisäerä tuo **246 aineksiriviä**, **162 valmistusvaihetta** ja **96 numeerista makrokenttää**. Koko F25-auditoinnin odotetut luvut: **75 Draftia, 465 ainesosariviä, 315 valmistusvaihetta, 216 numeerista makrokenttää**. Puuttuvia arvoja ei ole arvattu: erityisesti chilaquiles, paputostada, nasi goreng ja kimchi-jeon jäävät ilman neljää makroa.

## Tarkoituksellisesti avoimet SOURCE-HOLDit

- **Nasi goreng:** 150 g kecap manis on poikkeuksellinen punnitus, jota ei pienennetty luvatta. Riisin 100 g raw/dry-punnitustila vaatii varmistuksen.
- **Baghrir ja Thai-roti:** taikinan neste, rakenne ja autenttisuus ovat edelleen epävarmoja. Thai-roti on tällä koostumuksella käytännössä roti-tyylinen pannukakku.
- **Paputostada:** 150 g mustapapuja oletetaan valmiiksi kypsiksi, yhden avokadon syötävä massa on täsmentämättä. Muidenkin kpl-ainesosien massavastaavuus katselmoitava.
- **Bánh xèo / bánh cuốn:** puuttuvia kurkumaa, öljyä, yrttejä tai kastikkeita ei lisätä, kaikki katkaravut ja porsaan jauheliha kypsennetään kunnolla. Perinteisen reseptin vastaavuus tarkistettava.
- **Uunimuna-avokado:** kaikki 200 g kuoretonta munaa käytetään, myös mahdollinen ylimääräisessä vuoassa kypsennetty osa.

FI-valmistusohjeiden ruokalajikohtaiset korjaukset ovat erillisessä [PR #403](https://github.com/ozirix-dev/Reseptit/pull/403), jonka täsmä-HEAD CI ja Pages-käyttöönotto on vahvistettava ennen julkaisua.

**E20 ja F25 pysyvät erillisinä.** Kaikkien 25:n F25-lähteen `release_authorized: false` säilyy. Lähde- ja ravintoainekatselmointi, mahdollinen GI/GK-uusintalaskenta, kielikatselmointi ja semanttiset lähdehashit ovat eri jatkovaiheita. 75/75 ei ole yhtä kuin 75 julkaistua käännöstä. Ei ihmiskatselmoinnin tai koepaiston väitettä.

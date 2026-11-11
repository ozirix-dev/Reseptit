# Ruokavaliosuodattimet: katselmoitu pilotti 11.11.2026

## Rajaus ja päätökset

- Nykyiset keto- ja VHH-kentät säilyvät ennallaan; niitä ei tulkita automaattisesti muiksi ruokavalioiksi.
- Uudet yhteensopivuustunnisteet ovat **moniarvoisia** ja perustuvat julkaistun reseptin ainesosien ja ohjeen toimitukselliseen katselmointiin. Ei automaattista luokittelua nimistä, tageista, ravintoarvoista tai ruokakulttuurista.
- Gluteenittomuus on itsenäinen, jo olemassa oleva katselmointivaatimus. Kasvis, vegaani, pescovegetaarinen, keto tai karnivore eivät todista gluteenittomuutta.
- Vegaaniset reseptit soveltuvat myös kasvisruokavalioon ja pescovegetaariseen ruokavalioon. Myös muut kasvisruoat soveltuvat pescovegetaariseen.
- Karnivoren pilottiraja on eläinperäiset raaka-aineet, vesi ja suola, ei kasviöljyjä, kasviksia, yrttejä eikä kasvipohjaisia mausteita. **Yksikään pilottiin tarkastelluista resepteistä ei täytä tätä rajaa.** Valikon vaihtoehto ilmestyy vasta hyväksytyn reseptin myötä.
- Maidoton, laktoositon, paleo ja välimerellinen odottavat omaa tietopohjaansa. Erityisesti tuotemerkki ja valmistustapa voivat vaikuttaa soveltuvuuteen.

## Lähtöaineiston katselmointi (FI, EN, SV ja TH)

| Recipe ID | Hyväksytyt ruokavaliot | Tarkistushavainto |
| --- | --- | --- |
| `hummus` | kasvis, vegaaninen, pescovegetaarinen | Kikherne, tahini, sitruuna, valkosipuli, oliiviöljy, mausteet. Ei eläinperäistä ainesosaa. |
| `caponata` | kasvis, vegaaninen, pescovegetaarinen | Munakoiso, tomaatti, oliiviöljy, selleri, kaprikset, oliivit, viinietikka, sokeri, basilika. Viinietikan tuotekoostumus tarkistettava käyttäessä. |
| `munakokkeli` | kasvis, pescovegetaarinen | Kananmuna, kerma, voi, ruohosipuli, mustapippuri ja suola. **Ei karnivore** pilottimääritelmällä. |
| `bouillabaisse` | pescovegetaarinen | Kala, simpukat, katkaravut, kalaliemi, kasvikset ja leipä. Ei maaeläimen lihaa. |
| `kermainen-lohipata` | pescovegetaarinen | Lohi, tuorejuusto, kerma, kasvikset, mausteet. Ei maaeläimen lihaa. |

Kaikista viidestä tarkistettiin myös EN/SV/TH-reseptin rakenteinen ainesosaluettelo. Hyväksyntä koskee *vain näiden tiedostoversioiden ainesosia ja ohjetta*, ei tuotteiden allergeenittomuutta, ristikontaminaatiota eikä yleisiä valmistajan takuita. Muut reseptit ovat tällä hetkellä **luokittelemattomia** (eivät automaattisesti sopimattomia). Tämän pilottierän kattavuus on 5 reseptiä × 4 kieltä, yhteensä 20 kieliversiota.

## Tekninen toteutus

`site/scripts/reviewed-diet-filters.ts` tallentaa jokaisesta tarkistetusta kieliversiosta Git-blobin SHA:n. `build-content.ts` laskee Git-blobin tiivisteen **alkuperäisen tiedoston tavuista**. Jos resepti muuttuu, tunnisteet jätetään kokonaan pois kyseiseltä kieliversiolta. Tämä estää vanhan hyväksynnän leviämisen muokattuun reseptiin. Alkuperäisiin resepti- tai käännöstiedostoihin ei kosketa.

`recipe-search.ts` hyväksyy vain tunnetut `diet`-URL-arvot. Vieras arvo palautuu oletussuodatukseen. Uudet ruokavaliot eivät näy valikossa ilman ainakin yhtä katselmoitua reseptiä. Vaihtoehdot yhdistyvät AND-logiikalla kategoriaan, gluteenittomuuteen, hakutermiin, aikaan, pääraaka-aineeseen, ruokakulttuuriin ja GK-luokkaan.

## Julkaisuportti ja jatko

1. Suorita sisällön generointi sekä TypeScript-tarkistus, `recipe-search.test.ts`, täysi build ja CI:n pakolliset tarkastukset.
2. Tarkista FI/EN/SV/TH: valinta, URL:n jakaminen ja uudelleenlataus, tyhjennys, nollatulokset, gluteeniton rastina, kapeat mobiilinäkymät ja näppäimistöfokus.
3. PR pidetään erillisenä kaikista keskeneräisistä resepti- ja käännös-PR:istä. Ei automaattista yhdistämistä, jos CI tai sisältökatselmointi epäonnistuu.
4. Seuraava erä: 10–20 FI-reseptin täsmäluokittelu ja niiden julkaistujen käännösten erillinen lähde- ja tuotetarkistus. Karnivore-edustus lisätään vain aidosti sen ehtojen mukaan, tarvittaessa omana uutena reseptinä erillisessä PR:ssä.

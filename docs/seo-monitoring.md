# SEO:n seuranta

## Tekninen tarkistus

Suorita `site/`-hakemistossa `npm run build`, `npm run audit:seo` ja
`npm run test:static`. Auditointi lukee vain paikallisen dist-hakemiston.
Reitit johdetaan julkaistusta inventaariosta. Tarkistus kattaa staattisen
HTML-rungon, yhden H1:n, lähteen mukaiset otsikot ja kuvaukset, canonicalin,
vastavuoroiset kielilinkit ja x-defaultin, JSON-LD:n, kuvat, sitemapin,
robots-tiedoston, vahvistustiedoston ja 404:n. Se ei ole yleinen HTML-validaattori.

Erillinen `npm run audit:seo:public` tekee GET-pyynnöt julkisiin sivuihin.
Se vertaa tuotantoa paikalliseen julkaistuun inventaarioon. Älä tulkitse
julkaisemattoman haaran ja tuotannon eroja tuotantovirheiksi.

[Googlen Recipe-ohje](https://developers.google.com/search/docs/appearance/structured-data/recipe)
edellyttää reseptin nimeä ja valmiin ruoan kuvaa. Suositeltuja tietoja ovat
muun muassa tekijä, julkaisuajankohta, arvostelut, ajat ja energia.
Puuttuvia tietoja ei täytetä keksimällä. Nykyinen sivusto ei ilmoita
tekijää, julkaisupäivää, arvioita eikä kaloreita. Aika ilmoitetaan vain
lähteen sisältäessä sen. Google suosittelee laadukkaita kuvia eri
kuvasuhteissa; V1.5:n kuvat säilyttävät alkuperäisen kuvasuhteen.
Tekninen kelpoisuus ei takaa rich result -esitystä. Rich Results Testiä
ei korvata paikallisella testillä.

## Search Console, vain lukeminen

Ominaisuus: `https://ozirix-dev.github.io/Reseptit/`.
Omistajuus tarkistetaan Asetukset-näkymästä, erillään vahvistustiedoston
HTTP-testistä. Sivukartta ei todista indeksointia. Projektin robots.txt ei
ole koko originin robots.txt.

Tallenna tarkistuspäivä, ominaisuus, näkymä, aikaväli, suodattimet ja
tiedon saatavuus. Pidä puuttuva arvo `null`-arvona. Älä tallenna
tilitunnuksia, evästeitä tai tokeneita. Päivätty UI-lukuhavainto löytyy
V1.6-raportista ja `docs/seo/gsc-observation.json`-tiedostosta.

Kun dataa on, tarkista viikoittain aluksi ja myöhemmin kuukausittain:

| Näkymä | Kirjattavat tiedot |
| --- | --- |
| Sivustokartat | lähetys, viimeinen luku, käsittelytila, löydetyt sivut |
| Sivut | indeksoidut ja ei-indeksoidut, syyt, crawling-virheet |
| Tulokset | klikkaukset, näyttökerrat, CTR, kyselyt, sivut, aikaväli |
| URL-tarkastus | otoksen Googlen canonical ja indeksointitila |

Ryhmittele sivukohtainen vienti poluista FI/EN/SV/TH. Erottele hakemistot
reseptisivuista. CTR lasketaan klikkauksista/näyttökerroista, ei sivujen
CTR-lukujen keskiarvona. Nolla näyttökertaa jättää CTR:n puuttuvaksi.
Säilytä alkuperäinen vienti paikallisessa Gitin ohittamassa `tmp/gsc/`-kansiossa.

[Googlen vientiohje](https://support.google.com/webmasters/answer/12919797?hl=en)
kuvaa CSV-, Excel- ja Sheets-viennin. Sivutaulukon vienti ei ole täydellinen
hakudata: käyttöliittymän rivirajat ja anonymisoidut kyselyt rajoittavat sitä.
Kirjaa vientiin käytetyt suodattimet ja säilytä saatavuus erillään nollasta.
`docs/seo/gsc-import-template.json` on käsin täytettävä vientiyhteenveto,
ei API-integraatio eikä automaattinen tiliseuranta. Älä tuo henkilötietoja
sisältäviä kyselyitä julkiseen repoon.

# SEO:n seuranta

Tuotanto toimii [Cloudflare Pagesissa](https://www.recipavo.com/).
[GitHub Pages](https://ozirix-dev.github.io/Reseptit/) toimii stagingina.

## Tekninen tarkistus

Varmenna Cloudflare-julkaisu `site/`-hakemistossa hyväksytyn julkaisun
commit-SHA:lla ja saman revision testatulla tuotantoartefaktilla.

```powershell
npm run verify:production -- <commit-sha> https://www.recipavo.com <julkaisun-dist>
```

Tarkistus vertaa tuotannon HTML-, robots.txt-, sitemap- ja JavaScript-otosta
julkaisuartefaktiin. Tarkemmat ohjeet ovat
[julkaisuarkkitehtuurissa](julkaisuarkkitehtuuri_github_pages.md).
Laajassa SEO-tarkistuksessa käy lisäksi läpi sivukartan URL-osoitteiden
HTTP-tilat, canonicalit, indeksointiohjeet, vastavuoroiset hreflang-linkit,
reseptien JSON-LD ja kuvien saatavuus.

`npm run audit:seo` tarkistaa oletusbuildin paikallisen `dist`-hakemiston.
`npm run audit:seo:public` tekee GET-pyynnöt GitHub Pages -stagingiin.
Molemmat tarkistavat stagingin `noindex`-käytännön ja vertaavat sivuja
paikallisen revision inventaarioon. Käytä vertailussa samaa revisiota.

[Googlen Recipe-ohje](https://developers.google.com/search/docs/appearance/structured-data/recipe)
edellyttää reseptin nimeä ja valmiin ruoan kuvaa. Suositeltuja tietoja ovat
muun muassa tekijä, julkaisuajankohta, arvostelut, ajat ja energia.
Puuttuvia tietoja ei täytetä keksimällä. Recipe-merkintä ei nykyisin sisällä erillistä
tekijää, julkaisupäivää, arvosteluja tai kaloreita. Aika ilmoitetaan vain
lähteen sisältäessä sen. Google suosittelee laadukkaita kuvia eri
kuvasuhteissa; V1.5:n kuvat säilyttävät alkuperäisen kuvasuhteen.
Tekninen kelpoisuus ei takaa rich result -esitystä. Rich Results Testiä
ei korvata paikallisella testillä.

## Search Console, vain lukeminen

Käytä vahvistettua [recipavo.com-verkkotunnusominaisuutta](https://search.google.com/search-console?resource_id=sc-domain%3Arecipavo.com).
Tuotannon [robots.txt](https://www.recipavo.com/robots.txt) ilmoittaa kanonisen
[www-sivukartan](https://www.recipavo.com/sitemap.xml). Käytä seurannassa tätä
suoraa osoitetta. Apex-osoite `recipavo.com` ohjaa www-osoitteeseen.
Sivukartan käsittely, löydetyt URL-osoitteet ja indeksointi ovat erillisiä havaintoja.

Tallenna tarkistuspäivä, ominaisuus, näkymä, aikaväli, suodattimet ja
tiedon saatavuus. Pidä puuttuva arvo `null`-arvona. Älä tallenna
tilitunnuksia, evästeitä tai tokeneita. Lokakuun päivätyt havainnot `docs/seo/`-hakemistossa koskevat
GitHub Pages -ominaisuutta. Tuotannon vientipohja käyttää verkkotunnusominaisuutta.

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

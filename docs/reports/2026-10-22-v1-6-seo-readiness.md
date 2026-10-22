# V1.6 – SEO ja Search Console -valmius

Päiväys: 22.10.2026, Europe/Helsinki. Lähtö-main:
`02ffd5a92092d27fa8509ec47135d9ecb4c2a497`.
Haara: `codex/reseptit-v1-6-seo-readiness`. Tämä on PR-muutos.

## Todennettu laajuus

119 FI-lähdettä, 119 EN-, 119 SV- ja 119 TH-versiota: yhteensä 476
reseptiversiota ja 480 reittiä. Määrät tulevat buildin inventaariosta.
Offline-auditointi tarkisti kaikki 480 HTML-sivua ja sitemap-osoitetta sekä
358 kuvapolkua. Kaikkien title, description, H1, canonical, HTML lang,
hreflang ja x-default täsmäsivät lähteisiin. Recipe-JSON-LD vertautuu
ainesosiin, ohjeisiin, annoksiin, kuviin ja todellisiin ravintometatietoihin.
404 on noindex ilman canonicalia tai Recipe-dataa. Löydöksiä 0.

Erillinen julkinen GET-tarkistus kävi läpi samat 480 sivua sekä
vahvistustiedoston, robots.txt:n, sitemapin ja puuttuvan reitin.
Löydöksiä 0. Julkisen kuvan URL/alt/OG-metatieto tarkistettiin sivuilta;
kaikkien kuvien WebP-tiedostot validoitiin paikallisesta buildista.
Tämä ei ole kaikkien tuotantokuvien tiedostotiivistevertailu.

## GSC:n todellinen tila

Valtuutetun Brave-istunnon GSC-ominaisuus avattiin vain lukemista varten.
Asetukset näytti **Olet vahvistettu omistaja**. Pääsy ja omistajuus on siis
vahvistettu käyttöliittymästä, erillään HTTP 200 -vahvistustiedostosta.

Yleiskatsauksen Tulokset- ja Indeksointi-kohdat ilmoittivat datan olevan
käsittelyssä. Klikkaukset, näyttökerrat, CTR ja indeksoitujen sivujen määrä
ovat **tuntemattomia**, eivät nollia. Sivustokartat-näkymässä oli latauksen
valmistuttua 0 lähetettyä riviä. Sivukarttaa ei lähetetty tässä työssä.
[Sanitoitu lukuhavainto](../seo/gsc-observation.json) tallentaa vain
ominaisuuden ja näkyvät tilat, ei tilin henkilötietoja.

## Toteutus ja rajat

- `npm run audit:seo`: paikallinen, verkkoyhteydetön auditointi.
- `npm run audit:seo:public`: erillinen julkisten URL:ien GET-tarkistus.
- Regressiot muuttavat tarkoituksella metadataa ja hylkäävät ristiriidat.
- [Seurantamalli](../seo-monitoring.md) sisältää todellisen GSC-viennin
  tuontipohjan, sivu-/kieliryhmittelyn, CTR-periaatteen ja datan rajoitukset.
- Julkaisuarkkitehtuurin vanhat manuaaliset srcset- ja tulevaisuusohjeet
  korjattiin V1.5:n automaattista Sharp-putkea vastaaviksi. README ja
  responsive-images-ohje olivat tältä osin ajan tasalla.
- Googlen nykyisestä virallisesta Recipe-ohjeesta tarkistettiin name/image
  -vaatimukset. Suositeltuja tekijä-, päivä-, arvostelu- ja kalorikenttiä ei
  ole lähteissä, eikä niitä lisätty. Eri kuvasuhteet jäävät jatkoharkintaan.
- Tarkistus ei todista indeksointia, rich result -esitystä tai kaikkien
  HTML-standardin sääntöjen täyttymistä.

## Testaus

`npm ci`, `npm test`, `test:translations`, `test:image`, `build`,
`test:static`, `test:browser`, `npm audit --audit-level=low`, `audit:seo`
ja `audit:seo:public` läpäisivät. Selaintestit ajettiin asennetulla Bravella.
Staattisia testejä on 15, joista 5 uusia SEO-regressioita.
Build: JS 363,97 kB / gzip 116,46 kB; CSS 9,37 / 2,63 kB, ennallaan.
Ei uusia riippuvuuksia eikä haavoittuvuuksia. Markdown-lint ja diff-check
suoritetaan ennen commitia; GitHubin ajantasainen CI/review kuuluu PR:lle.

## Seuraava päätös

Omistaja hyväksyy PR:n yhdistämisen erikseen. GSC:n sitemap-lähetys vaatii
erillisen luvan; sen jälkeen odotetaan oikeaa indeksointi- ja tulosdataa.
Ei mergeä, tuotantojulkaisua, seurantaskriptejä eikä tiliasetusten muutoksia.
Työpaketit B ja C lähtevät samasta mainista. Niiden package.json-muutokset
on sovitettava yhdistetyssä tarkistuksessa ennen myöhempiä mergejä.

## Katselmointikorjaukset

Codex havaitsi kolme P2-puutetta: julkisen sitemap/robots-vastauksen sisältöä
ei validoitu, rikkinäinen XML-sulkurakenne saattoi läpäistä ja robotsin
wildcard-estot jäivät tunnistamatta. Julkinen ja paikallinen tila käyttävät
nyt samaa kokonaisen tuetun XML-rakenteen ja URL-inventaarion tarkistusta.
Robots-tulkinta huomioi user-agent-ryhmät, wildcardit, rivin lopun ja
pisimmän Allow/Disallow-säännön. Regressiot ja uusi 480 URL:n julkinen ajo
läpäisivät. Tuntemattomat sitemap-XML-laajennukset hylätään; tämä ei ole
yleiskäyttöinen XML-parseri. PR:n viimeinen CI/review tarkistetaan erikseen.

Lisäksi Sitemap-direktiivi luetaan nyt vain kommenttien ulkopuolelta.
404-tarkistus vaatii todellisen robots-metaelementin noindex-arvon;
kommentin, skriptin tai näkyvän tekstin maininta ei riitä. Molemmat
regressiot läpäisivät.

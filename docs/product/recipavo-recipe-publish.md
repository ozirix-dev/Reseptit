# Reseptijulkaisun tilanluku ja erävalmistelu

Aja komennot `site/`-hakemistosta. PR-tilanluku käyttää GitHub CLI:n kirjautunutta lukuyhteyttä ja julkista Recipavon HTTP-vastausta. Rajapintakutsut ovat GET-pyyntöjä.

~~~sh
npm run recipe:publish -- --pr 971
npm run recipe:publish -- --pr 971 --json
~~~

`--head` lukitsee odotetun PR-HEADin ja `--base` GitHubin nykyisen mainin. Komento näyttää vaaditun tarkistuksen, aktiiviset review-päätökset, merge-SHAn ja täsmäävän main-CI:n. Julkaisuajosta se lukee Environment-odotuksen ja saman ajokerran upload- ja varmennusaskeleet. Uusi kutsu lukee pysyvät tiedot uudelleen. `DRAFT_CHECKS_PASSED` ja `READY_CHECKS_PASSED` ohjaavat integraatiovastaavan nykyiseen Repo Guard -esitarkistukseen.

`VERIFYING` tarkoittaa, että jälkivarmennus on käynnissä. Jos ajo pysähtyi ennen uploadia, `HOLD_BEFORE_UPLOAD` ohjaa tutkimaan työnkulkua. Ohitettu upload kelpaa jälkivarmennuspolkuun vain, kun live-tarkistus onnistui ja varsinainen varmennus käynnistyi.

Jos upload onnistui mutta jälkivarmennus epäonnistui, käytä nykyistä `verify:production`-komentoa täsmälleen julkaistulla artefaktilla ja varmista julkaisun muu näyttö. Etusivun SHA auttaa tunnistamaan revision. Täysi varmennus edellyttää myös oikeaa sisältöä, kuvia, reittejä ja SEO-metadataa. Vanhan julkaisun onnistunut varmennus näkyy tilassa `VERIFIED_PREVIOUSLY`, jos sen revisiota ei vahvisteta nykyiseksi. Suojattu tuotantopäätös säilyy nykyisessä työnkulussa.

## Rajattu odotus

`recipe:publish --pr 975 --wait 600` seuraa GitHubin tilaa yhdessä prosessissa.
Ensimmäinen lukukerta lukitsee PR-HEADin ja mainin, ellei niitä ole annettu
valmiiksi. Aikaraja on 1–1800 sekuntia ja tilapäivitys näkyy vain tilan
muuttuessa. `--json` säilyttää yhden lopputuloksen stdoutissa. Prosessi
pysähtyy, kun seuraava vaihe edellyttää erillistä valtuutettua operaatiota,
tarkistus epäonnistuu tai aikaraja täyttyy. Aikarajalla JSON sisältää
`waitTimedOut: true`. Uusi ajo lukee tilanteen GitHubista.

Ready-tapahtuma voi käynnistää omistajametadata-ajon samalle HEADille.
Odotus huomioi myös GitHubin näyttämät keskeneräiset lisätarkistukset.
Voimassa oleva Repo Guard -esitarkastus ratkaisee, milloin Ready ja merge
voidaan tehdä. Tämän lukutilan odotus ei tarvitse työvarausta.

## Kanoninen tarkiste ennen pushia

1. Valmistele lopullinen FI-markdown ja haluttu kielirekisteri. Valmistele indeksi nykyistä guarded commit -työnkulkua varten.
2. Kun lopullinen FI-tiedosto on Git-indeksissä, luo katselmointipohja komennolla `npm run --silent recipe:publish -- --template reseptit/paaruoat/esimerkki.md`. SHA-256 tulee indeksin blobista. Pohjan päätös on `hold`.
3. Kirjaa todellinen katselmointipäätös nykyiseen rekisteriin. Olennaisesti muuttuneen sisällön tarkistus uusitaan. Käännösten merkitystiivisteet luetaan nykyisen validoinnin muodostamasta ehdokkaasta.

## Yksi ehdokas valmiille kielille ja resepteille

Samaan PR:ään voi koota hyväksytyn FI-lähteen ja kaikki julkaisuvalmiit EN/SV/TH-versiot, kun olemassa olevat lähde-, kielipari-, ravinto-, GK- ja kuvatarkistukset läpäisevät. FI voi edetä myös yksin. Jätä keskeneräiset tiedostot julkaisuehdokkaan ulkopuolelle. Koe ensin pienellä erällä.

~~~sh
npm run --silent recipe:publish -- --prepare --base APPROVED_BASE_SHA --head CANDIDATE_SHA
~~~

Valmistelu edellyttää puhdasta työhaaraa ja GitHubin nykyistä main-SHA:ta. Komento tarkistaa SHA:n GitHub CLI:n lukuyhteydellä ennen paikallisia tarkistuksia ja niiden jälkeen. Muuttunut pohja pysäyttää valmistelun. Komento listaa muuttuneet resepti-identiteetit, julkaisutilassa olevat kielet ja ehdokasta koskevat virheet. Se käyttää uutta FI-julkaisua koskevaa toimitusporttia, muuttuneen sisällön validaattoria ja Git-kuvien overlay-varmenninta. `PROJECT_IMAGE_ROOT` voi osoittaa nykyisellä menettelyllä varmennettuun kuvalähteeseen.

Jos osa resepteistä ei läpäise, komento näyttää läpäisseet ja pidätetyt identiteetit. Pidätetyille tai luonnoksille ei muodostu hyväksyttyä tiedostolistaa. Kokoa korjattu ehdokas omalle paikalliselle työhaaralle Guardilla ja tarkista myös jaetut manifestit. Uusi ehdokas tarkistetaan alusta ja päätökset sidotaan täsmällisiin versioihin. Valmistelu ei ole PR:n katselmointi, vaadittu CI tai tuotantopäätös.

Ensimmäisen version erävalmistelu kattaa uudet ja muokatut reseptit, kieliparit sekä tuetut kuva- ja evidenssipolut. Siirrot, poistot ja ohjelmistomuutokset puhdistetaan erilliseen PR:ään tai käsitellään tavallisella työnkululla. [Nykyinen suojattu tuotantomenettely](recipavo-actions-manual-release-2026-11-21.md).

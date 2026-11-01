# Julkaisupolku ja palautus

Tämä on valmistelun tarkistuslista. Tuotantotoimia ei ole valtuutettu.

| Tarkistus | Vaadittu näyttö ennen julkaisua |
| --- | --- |
| Main-yhteensopivuus | Tarkista GitHubin main-SHA ja viimeinen integraatio-HEAD; muuttuneen mainin synkronointi vain repo_guard sync-main -menettelyllä |
| 24 reseptin sisältö | Omistajan nimenomainen hyväksyntä manifestin täsmällisille versioille |
| Menetelmä | owner-method-decision.md:n yhteinen päätös, ei pelkkä tekninen GO |
| Laskenta ja lähteet | Kolme pakettia,24 eri ID:tä, oikeat versiot sekä resepti-, syöte-, GI- ja koostumushashit |
| Regressio | Nykyisestä mainista laskettu muutosjoukko; tämän pohjan tavoite24 uutta ja302 muuta ennallaan |
| Makrot ja Decimal | Kaikkien24 neljä julkaisumakroa ja riippumaton Decimal |
| CI ja selain | Täsmällisen lopullisen HEADin valmistunut CI sekä kaikkien24 sivun tarkistus |
| Q09-riippuvuus | Erillinen korjaus-PR; jos yhdistetään samaan julkaisuun, uusi yhteinen HEAD ja uusi regressio/kattavuuslaskenta |
| Ennen/jälkeen | Varmista julkaistun commitin runtime ja todellinen tekninen sekä laatutarkistettu kattavuus |
| Julkaisulupa | Omistajan erillinen lupa; Draft- tai GO-merkintä ei riitä |

Nykyinen integraatio pohjautuu mainiin e8da2c9417e2aeff55a85d599b3b7e1ad465f36c.
Tekninen tavoite83→107 sisältää edelleen9 tunnettua virheellistä nollaa.
Ilman niiden laatukorjausta laadullinen vertailu on74→98; tämä ei ole
väite koko muun tuotantoaineiston uudesta manuaalisesta syväauditoinnista.

## Palautussuunnitelma

Ennen mahdollista julkaisua tallenna todellinen julkaisucommit ja sitä edeltävä
tuotanto-SHA sekä niiden kattavuusraportit. Jos julkaisu on palautettava,
valmistele erillinen main-pohjainen korjaus-PR, joka palauttaa tämän24 reseptin
laskennan, rekisterin, lähteet ja reseptisisällöt yhtenä johdonmukaisena
kokonaisuutena edeltävän tuotanto-SHA:n sisältöön. Käytä repo_guardin write-,
commit-, push- ja Draft-PR-menettelyä. Ei force-pushia tai historian poistoa.

Jos Q09 on julkaistu erikseen, sen laatukorjauksia ei palauteta vahingossa
vanhoiksi nolliksi. Palautuksen regressio vertaillaan todelliseen julkaistuun
tilaan, ajetaan uusi CI ja selainvarmennus ja pyydetään erillinen julkaisulupa.
Tämän ajon aikana palautusta, mergeä tai deployta ei suoriteta.

## Muutos

Viimeistelee yhden Cloudflare-siirtosuunnitelman: SQLite paikalliseen tutkimukseen ja tuontien valmisteluun, D1 hyväksytyille ravintoarvoille ja lähdetietueversioille, R2 kuville/lähdeaineistoille/varmistuksille ja Workers Static Assets julkiselle recipavo.com-sivustolle. Kuvadomain on kuvat.recipavo.com. Julkinen sivulataus ei tarvitse D1-kyselyä.

SOURCE-01:n hyväksytty loppuraportti on pakollinen riippuvuus ennen lopullisen SQLite/D1-skeeman lukitsemista. Keskeneräiset tutkimustietueet eivät siirry hyväksyttyyn laskentaan. Tietue yksilöidään lähteen, lähdeversion ja alkuperäisen tunnisteen avulla. Toistettava tuonti säilyttää puuttuvuudet, määritelmät ja reseptin täsmälliset versiosidokset.

Git säilyy reseptien, koodin ja historian lähteenä. Nykyinen Git-pohjainen ravintoarvomalli jatkuu, kunnes omistaja hyväksyy D1-masteriin siirtymisen vaiheessa 4. Sen jälkeen Gitin numeeriset kopiot ovat vain D1-viennin projektioita; kahta itsenäistä ravintoarvomasteria ei rakenneta.

## Kuusi erillistä hyväksyntäporttia

1. SOURCE-01 ja yhteinen tietomalli.
2. Paikalliset SQLite-tuonnit, kuvamanifestit ja vienti.
3. Eristetty Cloudflare-pilotti ja palautusharjoitus.
4. Koko aineiston valmistelu ilman julkisen liikenteen siirtoa.
5. Recipavo.com-julkaisu vain omistajan erillisellä julkaisuluvalla.
6. Julkaisun varmennus ja ylläpito.

Jokaisessa vaiheessa ovat lähtöehdot, tehtävät, hyväksymiskriteerit, palautus, kustannusvaikutus ja omistajan päätöspiste. Dokumentaation hyväksyminen ei aloita toteutusta.

## Kuvat, URL:t ja varmistukset

Kuvien A/B/C-luokitus sallii dokumentoidun generointierän yhteisen alkuperäselvityksen, kun tiedostojen SHA-jäsenyys voidaan osoittaa. Lähtöinventaarion 327 lähdekuvaa, nolla SHA-duplikaattiryhmää, PNG-master ja muut poikkeukset säilyvät päivättyinä havaintoina. Inventaario uusitaan siirrettävästä snapshotista; kuvia ei poisteta.

GitHub Pagesin reseptisivuille valmistellaan HTML-ohjaukset oikeisiin kieliversioihin heti onnistuneen Recipavo-julkaisun yhteydessä. Tämä ei ole HTTP 301 github.io-hostilla. Vanhat kuvat ja variantit säilyvät, Pagesin myöhempi täysi autodeploy estetään ja vanhat JS/CSS/JSON-assetit säilytetään julkaisuvaihdoksen yli. Nykyisen julkisen sivuston metatiedot muuttuvat vasta julkaisuvaiheessa.

Varmistukset ovat D1 Time Travel, yksi päivittäinen SQL-vienti yksityiseen R2:een, tuonti-/julkaisukohtainen paketti, kuukausittainen palautuskokeilu ja salattu Cloudflaren ulkopuolinen kopio. Säilytys, siivous, hashit sekä koneen tai Cloudflare-tilin menetyksen palautus on kuvattu. Ei erillistä viikkovarmistuskerrosta tai raskasta uutta automaatiojärjestelmää.

## Lähtötilanne, kustannukset ja rajaus

Suunnitelma sisältää 2.11.2026 tehdyn lukevan Cloudflare-auditin: domain oli aktiivinen coming-soon Pages -sivusto, Workers Paid käytössä, mutta projektin D1/R2-resurssit ja kuvadomain eivät olleet vielä olemassa. Tarkastettu Agent-token oli vain lukuoikeuksilla. Asetuksia ei muutettu. GSC:ssä ei käyttäjän mukaan ole dataa; vertailujaksoa ei odoteta.

Lisäkulutavoite on enintään 5 USD/kk nykyisen Workers Paid -tilauksen päälle. Tilin muiden projektien kulutus huomioidaan. Maksullista Cloudflare Images -palvelua ei edellytetä.

Tämä PR muuttaa vain dokumentaatiota. Ei resepti-, makro-, GK-, laskentamoottori-, kuva-, workflow- tai Cloudflare-muutoksia. Ei buildia, tuonteja, resurssien luontia, Actions-ajoja, mergeä tai deployta. SOURCE-01:n ja GK80:n työpuut pysyvät koskemattomina. PR säilyy Draftina.

## Tarkistukset

Markdown-rakenne, paikalliset dokumenttilinkit, sisäinen johdonmukaisuus ja git diff --check. Dokumentaatiocommitissa [skip ci]; workflow-käynnistimet ja uuden HEADin Actions-ajojen puuttuminen tarkistetaan. Aiemmat inventaariot ja apuskriptit pysyvät ennallaan.

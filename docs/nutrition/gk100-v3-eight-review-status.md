# Kahdeksan GK-version katselmointitilanne

[Nykyinen Factory-suunnitelma](gk100-v3-eight-release-plan.json) korvaa PR #271:n avauskuvauksen. Kaikki kahdeksan pakettia läpäisivät teknisen tarkistuksen. Uusi manifesti odottaa omistajan sisältöpäätöstä.

Hyväksyttävän manifestin SHA-256 on `3055a2d4bffe93d667591d2f69f54ff8e629bab9ad95ab42af40287f9d566be9`. Alkuperäinen [päätöstiedosto](https://github.com/ozirix-dev/Reseptit/blob/25ea0983a6ac69e1df90e7b3bad15b2510bdd338/docs/nutrition/gk100-v3-eight-decisions.json) säilyy Git-historiassa.

| Ehdokas | GK/annos | Esitys |
| --- | ---: | --- |
| Marjainen chiavanukas | 1,44 ja 1,63 | Makeuttamaton versio ja kaksi vertailuskenaariota |
| Intialainen aloo paratha | 39,4788 | 182 g tutkimuksen kontrolliannosta ja vettä |
| Hyderabadi-kanabiryani | 26 | 253,9 g emiraattilaista ravintolan koeannosta |
| Indonesialainen nasi goreng | 12,5 | 129 g osterikastikkeella paistettua jasmiiniriisiä |
| Baozi | 33 | 154,7 g Tanjong Rhun grilliporsashöyrysämpylää |
| Nasi lemak | 33 | 179,2 g Old Chang Keen koeannosta |
| Mehevä suklaakakku | 20,5 | 107,2 g kuorrutettua tutkimuskakkua ja vettä |
| Tangyuan | 30,5 | 115 g keitettyjä Lee Chun -riisipalloja ja vettä |

Factory sitoo `studyServing`-esitystavan sekä ehdokasriviin että katselmointiin. Kotireseptien GK-arvioiden suodatin jättää tutkimusvertailut pois. Merkitty GK-pistearvo koskee yhtä tutkimusannosta. Sivun annosvalitsin ei muuta sen ainesosamääriä, ja lähderajaus näkyy GK-luvun vieressä kaikilla neljällä kielellä. Seitsemän tutkimuspakettia säilyttävät alkuperäiset laskenta- ja pakettitarkisteensa.

Chiavanukkaan ainesosalistalta poistettiin valinnainen makeutus, jonka valmistusohje käskee jättämään pois. Korjatun paketin tarkiste on `a0b8175f3d0bdea6c28fea78a809c7a388dbe299011db56b7416714db5890920`.

P2-korjaus erottaa tutkimusvertailut kotireseptien numeerisesta GK-kattavuudesta. Kotireseptin GK-arvio voidaan myöhemmin lisätä tutkimusvertailun rinnalle. Jos erän kaikki kahdeksan versiota hyväksytään ja julkaistaan, chiavanukas lisää kattavuutta yhdellä reseptillä (235/326 → 236/326). Seitsemän tutkimusannosta raportoidaan erikseen. Aiempi PR #271:n avauskuvauksen kattavuusarvio 243/326 sisälsi myös tutkimusannokset.

Tuotantoon kytkeminen edellyttää erillistä, bundlen tarkisteeseen sidottua julkaisulupaa.

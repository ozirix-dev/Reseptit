# F25 / työerä A2 – neljän valmistusohjeen kokkikatselmointi, 11.11.2026

## Rajaus

Tarkistetaan neljä FI-lähdettä: papaija-kookos-tapiokapuuro, bánh cuốn, bánh xèo ja marokkolainen baghrir. Samassa [issue #447](https://github.com/ozirix-dev/Reseptit/issues/447) -työjonossa ovat ravintoarvopuolen neljä A1-reseptiä. Kaikki kahdeksan pysyvät `meta/kaannokset/f25-release-gate.json`-tiedoston alkuperäisissä **HOLD**-tiloissa. Näitä eivät tämä PR eivätkä käännösrakennetestit julkaise EN/SV/TH-kielille.

## Julkisen FI:n valmistustekstin korjaus (3)

### Papaija–kookos–tapiokapuuro

Nykyinen mitattu resepti: **100 g kuivaa tapiokahelmeä**, **700 ml vettä**, **200 ml kookosmaitoa**, 200 g papaijaa, 15 g limettimehua ja suola. Käytetään pientä kuivaa helmityyppiä ja ohjataan keittämään pakkauksen mukaisesti, kunnes täysin pehmeä (noin **15–20 min** pienille helmille). Mittaamatonta vettä ei kaadeta pois; puuroon jää 700 ml alkukeitinvettä vähennettynä haihtumisella. Pakkauksen liotusta tai pitkää kypsennystä vaativille helmille nykyinen **25 min kokonaisaika ei ole kelvollinen**. [The Woks of Life -ohjeessa](https://thewoksoflife.com/how-to-cook-tapioca-pearls/) helmille suositellaan 15 min keittoa + 15 min lepoa ja valutusta; menetelmä on eri kuin mitattu paksu puuro. [Bob's Red Mill](https://www.bobsredmill.com/recipes/how-to-make/old-fashioned-tapioca-pudding) käyttää jopa 30 min liotusta. [Cock Brand Small Pearls](https://www.denkinesiskekoebmand.dk/en/dry-goods/1853-small-tapioca-pearls-400g-cock-brand.html) ilmoittaa 15–20 min keittoa, mutta sen pakkaus- ja tuotemacrojen tarkka yhtenevyys AFCD-kuiviin tapiokahelmiin vaatii erillisen katselmoinnin. **HOLD: todellinen helmikoko/pakkaus + vesimäärän ja valmistusajan sovitus.**

### Bánh cuốn sienillä ja porsaanlihalla

100 g riisijauhoa ja 250 ml vettä on sama **1:2,5-suhde** kuin [KOME:n 200g/500ml-ohjeessa](https://komejapan.com/english/recipe/banh-cuon/). Selkeytetty ohje käyttää kannellista tarttumatonta paistinpannua ilman ylimääräistä öljyä, pannulla kypsennettyä **150g porsaan jauhelihaa ja 100g sieniä**, sekä 1 rkl kalakastiketta. Täytteen kypsyyttä varmistetaan haluttaessa 75 °C sisälämpötilalla. Riisilevyjä tehdään ohuita 1–2 min kannen alla ja käsitellään kostealla silikonialustalla; 40–50 min on realistisempi käytännön työaikavaraus kuin nykyinen 25 min. KOME ilmoittaa kokonaisajaksi 45 min, [Bon Appétit](https://www.bonappetit.com/recipe/banh-cuon) kuvaa pannuhöyrytyksen. **HOLD: nimen selkeytys, realistisen virallisen aikatiedon FI/GK-versiosidos ja tuotekohtainen menettelyvarmennus.**

### Bánh xèo, vaalea kurkumaton sovellus

Kanonisessa lähteessä on **100g riisijauhoa + 200ml täysrasvaista kookosmaitoa**, 150g raakaa katkarapua, 150g pavunituja ja 1 rkl öljyä, **ei kurkumaa eikä vettä**. Korjattu FI-ohje kertoo, että lettu on vaalea moderni sovellus, eikä esitä sitä kurkumaisena klassikkona. Katkaravut kuumennetaan täysin kypsiksi ja idut läpikotaisin; letut kypsennetään yhdeltä puolelta, täytetään ja taitetaan. [SBS:n bánh xèo -reseptit](https://www.sbs.com.au/food/recipe/vietnamese-pancake-banh-xeo/y20qd6l7h) käyttävät erillistä vettä, kurkumaa ja pitempää valmistusta. [SBS:n toinen vertailu](https://www.sbs.com.au/food/the-cook-up-with-adam-liaw/recipe/banh-xeo/l92q0cn8m) toteaa, että riisijauhojen absorptio vaihtelee ja taikinaa joutuu joskus ohentamaan. **HOLD: kokeellisesti uskottava rapeus ja oikea kuva, jos taikina ei leviä ilman vettä.**

## Baghrir – oikea korjaus vaatii uuden FI:n ja GK-sidokset

Nykyisessä lähteessä on 100g mannajauhoa, 100g vehnäjauhoa ja **150ml vettä**; se ei muodosta perinteistä ohutta reikäislettutaikinaa. [Marokkolaisen baghrir-ohjeen](https://marokkanisch.com/en/recipes/baghrir/) suhteella 375g mannajauhoa ja 500ml vettä 200g jauhoa vastaisi noin 267ml vettä; kahden jauholajin sovellus todennäköisesti tarvitsee n. 300ml. Käytetään **300ml kädenlämpöistä vettä** ehdotuksessa, annetaan kohota 15–20 min ja paistetaan vain yhdeltä puolelta, kunnes reiät näkyvät. Ei voita (vain 1 rkl hunajaa ja 1 rkl öljyä), eikä muutoksia ravintoarvoihin ennen kokonaislaskentaa. Koneellinen [ehdokas-JSON](../../meta/kaannokset/f25-baghrir-300ml-candidate-20261111.json) määrittää yhden valmistusversion ja kaikki lähtömassat, mutta **ei muuta nykyistä julkaistua 150 ml lähdettä eikä sen GK-sinettejä**. Uusi FI-aika 40 min ja laskennan/GK-version päivitys vaaditaan hyväksyntään.

## Käyttöliittymän varoitukset

Jo olemassa olevat viiden F25-lähteen erilliset [source-review-notices.ts](../../site/src/features/recipes/source-review-notices.ts) -huomautukset laajennetaan **kahdeksaan**, eli koko A1+A2-ensierän kattaviksi. Kolmelle A2-lähteelle kerrotaan ratkaisematon tuotteen/ajan/kokki-identiteetin este ja yleiset allergeenit. Bánh cuốnin vanha huomioteksti jatkuu. Nämä tekstit eivät muuta historiallisia GK:n inventaarion `notesHtml`-kenttiä.

## Portit ja testit

Muuttuu: **vain kolme FI-julkisen SHA-lukitun projektorin valmistustekstiä**, erilliset UI-varoitukset, nykyiset testit ja dokumentoitu baghririn tuotemalliehdotus. Ei muutoksia kanoniseen FI Markdown -lähteeseen, ainesmassoihin, neljään makroarvoon, GI/GK-tietueisiin, EN/SV/TH-julkaisuihin, kuviin eikä `f25-release-gate.json`-hyväksyntöihin. Lähdesidottu SHA-suoja testataan uudelleen. **Tämä PR ei hyväksy 45 HOLD-käännöstä.**

Ei väitetä fyysistä koepaistoa, riippumatonta ravintoasiantuntijaa tai laboratorioarviota.

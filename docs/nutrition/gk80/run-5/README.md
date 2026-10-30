# GK-80 AJO 5 –26/40 uutta numeerista ehdotusta

Tavoite25 saavutettu, stretch30 ei. Kierros A19/20, B7/20. Valinta10 lähes
valmista,16 yhteislähdetapausta ja14 sisältö-/valmistustäsmennystä. Vaikeita
reseptejä ei nimetty lähes valmiiksi25/10/5-jaon täyttämiseksi.

Tutkimushaaran base on Draft#141, a332822fd29d054eb4c9510f07b22ee398404990.
Julkaisu-Draftit ovat erikseen main-pohjaisia; main edelleen
e8da2c9417e2aeff55a85d599b3b7e1ad465f36c. Tutkimushistoriaa ei yhdistetä mainiin.
Alkuperäiset reseptit, laskentatiedostot ja kaikki326 tuotannon GK-tulosobjektia
säilyvät tutkimushaarassa. Omistajan menetelmä-/sisältöhyväksyntää ei väitetä.

## Katselmointiaineisto

- [Kaikki40 päätöstä ja tulosta](results.md), [koneelliset päätökset](decisions.json).
- [Tarkat40 syötettä ja lähdehashit](recipes.json), [GI-lähteet](sources.json), [koostumus](composition-sources.json), [riippumaton Decimal](golden.json).
- [26 täydellistä punnittua valmistusversiota](versions/), [julkaisun neljä makroa](publication-nutrition.json), [menetelmä ja lähteiden rajat](policy.md).
- [48 aiemman ehdotuksen373 sidoksen auditointi](food-family-audit.json), [täsmälliset historialliset evidenssiversiot](prior48/evidence-bundles.json). Samannimisiä lähde-ID:itä ei korvata toisen paketin erilaisella hashilla.
- [53 AFCD-tietueen primäärivarmennus](afcd-primary-verification.json), [USDA:n kolme käytettyä primääritietuetta](primary-usda.json).
- [Seitsemän erillistä kattavuusluokkaa ja326 yksilöityä ID:tä](coverage.json), [169 jäljellä olevan eräjako](remaining-plan.json), [yhdeksän vanhaa nollaa](legacy-nine-zeros.json).

## Aiemman aineiston korjaukset

Carnitas: AFCD:n native lime F005198 korvataan tavallisella kuoritulla limetillä
F005199. CHO4,94985→5,04985g, proteiini36,95355→37,04105g,
rasva30,606575→30,281575g, kuitu2,531875g ennallaan; GK2,15784→2,20784.
Kahden kanapannun jauhettu mustapippuri luokitellaan pienen punnitun mausteen
annoslaajennukseksi, ei <=5g/100g-ruoaksi; GI50 ja GK ennallaan.
Butternutin AJO4-korjaus32,9841375→34,7953875 säilyy. Ei uutta ID-hyvitystä.

## Julkaisupaketit ja yhteinen adapteri

Ensimmäinen integraatio yhdistää PR#140:n neljä ja PR#142:n kahdeksan reseptiä:
95/326 ehdokasbuildissa,12 tarkoituksellista muutosta,314 muuttumatonta tulosta.
Molemmat paketit ovat pakollisia. Manifestirekisteri tarkistaa ID:t, version ja
viiden laskentatiedoston SHA256:t; lisäksi koko reseptiteksti ja laskentasyöte
sidotaan hasheilla. Puuttuva paketti/resepti tai väärä versio pysäyttää ajon.

Seuraava julkaisu-Draft sisältää12 muuta AJO4:n ehdotusta, omassa main-pohjaisessa
paketissa3. Sen itsenäinen build on myös95/326; se ei ole väite107/326-yhdistelmästä.
Runtime-adapteri, ruokaperhekatalogi, luokittelu ja käyttöliittymä ovat samat
molemmissa julkaisuhaaroissa. Rekisterit ja historiallisten testien12-ID-näkymät
ovat pakettikohtaisia. Myöhempi24 reseptin integraatio edellyttää rekisterin,
historiallisten näkymien ja unioniregression koostamista sekä uuden HEADin CI:tä.
Tässä ajossa sitä ei väitetä eikä PR:iä yhdistetä.

## Kattavuus ja261-tavoite

Tekninen tuotanto83/326 sisältää yhdeksän vanhaa nollaa, joiden positiivinen
CHO on jätetty pois. Todellisia lähde-nolla-CHO-tapauksia näiden yhdeksän
joukossa0. Ilman niitä numeerisia tuotantotuloksia74.
Ehdollisia48+26=74, joista24 teknisesti valmisteltuina julkaisu-Drafteihin ja
50 tutkimus-/valmisteluvaiheessa. Hyväksyttyjä0, uusia julkaisuja0.
Kaikkien ehdollisten hyväksyminen ja julkaisu merkitsisi157 teknistä tulosta;
ilman yhdeksän nollan korjausta148.261-tavoitteeseen tarvittaisiin vastaavasti
104 tai113 lisää. Tuotanto ei ole muuttunut tämän ajon aikana.

Jäljellä169: ryhmä1 kaksi yhden koostumusaukon tapausta, ryhmä2 yhteislähteillä
ratkaistavia69, ryhmä3 lähde-/määrä-/varianttityötä98. Vahvistettua uutta
numeerista hyötyä näistä nyt0. Pelkkä koostumuksen valmistuminen ei todista GI:tä.
Työtavoite: Q09-nollakorjaukset ensin; nykyisten74 ehdotuksen julkaisuvalmistelu;
sen jälkeen C01–C08,20 ID:tä kerrallaan ja tavoite13 numeerista/erä.13×8=104
on työskentelytavoitteen aritmetiikka, ei todistettu saantoennuste.
C09:n9 ID:tä jää varalle. Tarkista suunta jokaisen20 jälkeen; arvoja ei pakoteta.
Kaikki169 ID:tä ja konkreettiset erät ovat remaining-plan.json:ssa.

## Paikallinen varmennus

218 yksikkötestiä, mukaan lukien994 suojattua lähdetiedostoa ja326 vanhaa
GK-tulosobjektia; TypeScript ja koko691-reitin build. Uusien40 ja aiempien48
aritmetiikka toistetaan88 reseptin riippumattomalla Decimal-toteutuksella.
Seitsemän väärää ruokaperheosumaa, uudet valmistusmuodot, mausteiden annosrajat,
puuttuva GI ja alle yhden positiivisen GK:n nollaksi pyöristymisen esto testattu.
Julkaisuhaarojen omat buildit, CI ja selaintestit raportoidaan AJO5:n yhdessä
ReportHub-koonnissa täsmällisillä HEAD- ja CI-linkeillä.

Ei mergeä, Ready-siirtymää, deployta tai automaattista AJO6:tta.

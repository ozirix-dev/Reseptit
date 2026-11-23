# Chat-4 – mango sticky rice, FI-luonnoksen lähde- ja turvallisuuspäätös

Päiväys: 23.11.2026. Työn omistaja: Chat 4. Issue #326.
Työvaihe: riippumattoman lukemisen jälkeinen **FI-luonnoksen toteutus**, EI julkaisu- tai ravintoarvohyväksyntä.

## Lähteet ja duplikaattirajaus

Lähtöaineisto on Chat-5:n jo mainissa oleva `docs/reviews/2026-11-22-chat-5-mango-sticky-rice-prototype.md` ja sen punnittu neljän annoksen reseptisovitus.

- Hot Thai Kitchen / Pailin Chongchitnant: https://hot-thai-kitchen.com/mango-sticky-rice/ — kuivan valkoisen thai-glutiiniriisin liotus vähintään neljä tuntia, höyrytys kunnes keskusta on kypsä, kuuman makean kookosseoksen imeytys ja erillinen kastike.
- Michelin Guide / R-HAAN: https://guide.michelin.com/en/article/dining-in/how-to-make-mango-sticky-rice-like-michelin-star-restaurant-r-haan — osoittaa höyrytysaikojen vaihtelevan riisin, astian ja menetelmän mukaan; nykyinen 25–35 min on vain toimituksellinen lähtöarvio, kypsyys määrää.
- UK Food Standards Agency: https://www.gov.uk/government/publications/home-food-fact-checker/home-food-fact-checker — keitetyn riisin jäähdytys nopeasti, mieluiten tunnissa, jääkaapissa korkeintaan vuorokausi, uudelleenkuumennus vain kerran.
- Facebook Reel: https://www.facebook.com/reel/1119160724235447 — **vain visuaalinen inspiraatio**. Videon tarkat ainekset ja tunnistamattomat koristelut eivät ole varmennettuja, eikä video- tai kuva-aineistoa kopioida.

Erillinen resepti on perusteltu: mainin `thai-kookosriisi-mangolla` perustuu kuivaan jasmiiniriisiin, joka kypsennetään kookosmaidossa, eikä siinä ole lisättyä sokeria. Uusi `thai-mango-sticky-rice-tahmariisilla` käyttää glutiiniriisin liotus/höyrytys/imeytysmenetelmää, makeutusta ja erillistä kastiketta. **Yksi uusi resepti, kaksi esillepanotapaa; ei toista lähes identtistä jälkiruokareseptiä.** Tämä päätös on sisällöllisen ehdotuksen toteutus, ei myöhemmän tuotantojulkaisun automaattinen omistajahyväksyntä.

## P1-korjaus: luettelematon paistoöljy ja mungpavut

Aiemmassa prototyypissä oli 12 g halkaistuja mungpapuja, joiden loppuvaihe tehtiin rasvatulla pannulla **ilman määritettyä öljymäärää tai hyväksyttyä retentiota**. Korjattu julkaisematon FI-draft **poistaa mungpavun ja koko sitä koskevan vaiheen sekä kaikki paistoöljyä koskevat oletukset**. Annoksen yhdeksän mitattua syötävää ainesosariviä: 200 g kuivaa glutiiniriisiä, kookosmaito 180 g ja 100 g, sokeri 60 g, suolat 2 g ja 1 g, riisijauho 5 g, kastikevesi 20 g ja kuorittu mango 500 g. Ei väitettä, että tämä olisi alkuperäisen ravintolan annos tai Chat-5:n prototyypin muuttumaton laskentaversio.

Tämä poistaa mungpapujen kypsennys-/tuotematch-epävarmuuden yksinkertaistetusta versiosta eikä lisää keksittyä öljymäärää. Aiempi tutkimusprototyyppi jää muuttumattomaksi dokumentoiduksi historiaksi; siitä ei tule julkaisuversiota sellaisenaan.

## Turvallisuus, hyväksyntä ja avoimet portit

- **Valmistus:** riisi liotetaan vähintään neljä tuntia, höyrytetään kypsäksi, kookosmaito kuumennetaan ja imeytetään; kastikkeen riisijauho kypsennetään kiehauttamalla. Neljä annosta ja yksi FI-resepti.
- **Ravintoarvot:** neljä makroa `null`. GK määrittämätön. Jasmiiniriisiversion laskentaa ei lainata.
- **Kokonaisaika:** `time_total_min: 330` on noin 5 h 30 min, sisältää vähintään 4 h liotuksen ja muun työskentelyn; toimituksellinen arvio, ei mitattu kokkauskokeessa.
- **Turvallisuus:** ylijäämäriisi jäähdytetään nopeasti, mieluiten tunnissa, enintään 24 h jääkaapissa, lämmitetään korkeintaan kerran höyryävän kuumaksi. Ei huoneenlämpöistä pitkäaikaista säilytystä. Tuote- ja mahdolliset allergeenimerkinnät tarkistettava.
- **Ei julkaisua:** `status: draft` kaikissa tulevissa hyväksyntään asti. Ei kuvaa lähdekoodiin ennen kuvan erillistä tarkistusta ja SHA-256-manifestiportaiden valmistumista; alkuperäisen Facebookin kuvaa ei kopioida. EN/SV/TH-käännökset eivät kuulu tämän FI-luonnoksen vaiheeseen.
- **Avoimet ennen mahdollista `published`-päätöstä:** käytettävien riisi-/kookos-/mangotuotteiden raaka-ainetilan ja valmistusmenetelmän lopullinen toimituksellinen katselmointi, lähteiden soveltuvuus, uuden FI-SHA:n julkaisupäätös, kuvamateriaali, mahdollinen makrolaskenta jos luvut halutaan näyttää, käännösten semanttinen hyväksyntä ja täsmä-CI. GK voi jäädä määrittämättä.

**CI- ja Repo Guard -portit** koskevat myös julkaisemattoman draftin yhdistämistä mainiin. Draftin versionhallintaan hyväksyminen ei ole tuotantojulkaisu eikä vapauta julkaisu-HOLDia.

# Issue #404 / C5 – Bakwan V2: rakenteinen grammoitettu FI-luonnos ja laskentaversio

**11.11.2026 – ei tuotantojulkaisua.**

## Mikä muuttui?

Aiempi [bakwanin grammoitettu työluonnos](c5-variants/bakwan-maissifritter-60g-porkkana.md) on viety oikeaan reseptin rakenteiseen muotoon uudella tunnuksella `indonesialainen-bakwan-jagung-punnittu-v2`:

- [FI-reseptiluonnos](../../reseptit/raakileet/indonesialainen-bakwan-jagung-punnittu-v2.md), `status: draft`, `category: aamupala`.
- Ilmoitetut määrät kahteen annokseen: **100 g maissia, 60 g kuorittua porkkanaa, 100 g vehnäjauhoa, 12 g kevätsipulia, 100 ml vettä, 13,5 g öljyä ja 1 g suolaa**.
- Valmistusohje ja erilliset huomautukset osoittavat ehdotetun vesimäärän, tuotoksi oletetut 6 fritteriä, raakaa vehnäjauhoa koskevan kypsyystarkistuksen ja mittaamattoman öljyn retentioasteen.
- Neljä `carbs_net_per_serving_g`, `carbs_total_per_serving_g`, `protein_per_serving_g` ja `fat_per_serving_g` -kenttää ovat **null**, eivät 0 eikä vanhoja historiatietoja.
- Alkuperäinen julkaistu `indonesialainen-bakwan-maissifritter.md` on muuttumaton; V2:lle ei peritä sen vanhaa GK- tai ravintolaskennan hyväksyntää.

## Uuden version erillinen aineskohtainen laskenta

`site/scripts/bakwan-v2-candidate-calculation.ts` lukee uuden V2-tiedoston rakenteiset ainesmäärät ja alkuperäisen [historiallisen laskennan](../nutrition/calculations/indonesialainen-bakwan-maissifritter.json) ainesosakohtaiset koostumustiedot. Sekä uuden luonnoksen, vanhan FI-lähteen että aiemman laskennan **täsmälliset Git-blob-SHA:t lukitaan**. Jokaiselta viideltä energiaravintoaineita tuottavalta ainesosalta vaaditaan yksilöity koostumustietue.

100 ml puhdasta vettä ja 1 g suolaa ovat mukana V2:n ainesluettelossa. Niillä ei ole energiaa lisäävää osuutta käytettävissä oleviin hiilihydraatteihin, proteiiniin tai rasvaan; suolan natriumvaikutus kuuluu omaan myöhempään ravintomerkintään. Vesi ja suola eivät oikeuta arvaamaan keittiössä valmistettua saantoa.

### Ehdollinen ravintoarvio / annos

Laskenta käyttää samoja dokumentoituja AFCD/Fineli-ainekohtaisia koostumustietoja kuin aiempi `AUTOMATED ONLY` -laskelma, **ei** uutta riippumatonta ravintolähteiden hyväksyntää.

| Hypoteettinen osuus pannun öljystä annoksiin | Käytettävissä olevat HH | HH + kuitu ja polyolit | Proteiini | Rasva |
|---|---:|---:|---:|---:|
| 50 % | 45,19 g | 49,88 g | 7,89 g | 5,12 g |
| 75 % | 45,19 g | 49,88 g | 7,89 g | 6,81 g |
| 100 % | 45,19 g | 49,88 g | 7,89 g | 8,50 g |

**Mikään näistä öljyn retentioprosenteista ei ole mitattu arvo.** 100 % -vaihtoehto toistaa vanhan laskentamallin luvut, koska 60 g:n porkkanatavoite ja muut energiaravintoaineiden mallimassat vastaavat aiemman laskelman oletuksia. Se ei todista, että nämä ovat juuri tämän koeversion todelliset ravintoarvot.

## Julkaisun seuraavat portit

1. Varmista että 100 ml vettä tuottaa todella lusikoitavan, pannulla kypsyvän taikinan ja testaa tuotoksi kuusi fritteriä. Ei väitettä suoritetusta koepaistosta.
2. Vahvista tai määrittele ainemäärät lopulliselle V2-versiolle sekä syötävän porkkanan 60 g.
3. Mittaa tai muutoin perustellusti rajoita pannuun jäänyt / ruokaan siirtynyt öljy ja tarkista aineskohtainen ruokatuotevastaavuus.
4. Tee riippumaton ravintoarvojen, GI:n ja GK:n lähdekatselmointi. Vasta sen jälkeen erillinen julkaisuhyväksyntä, käännösten merkitystarkistus ja täsmä-HEAD CI/deploy.
5. V2:n ajantasaisuus ja ei-julkisuus: `cd site && npm run audit:bakwan-v2`. Tulos `DRAFT_ESTIMATES_NOT_APPROVED`, `approvedForPublication=false`, `independentNutritionApproved=false`, `glycemicLoadApproved=false`.

**Tämä PR ei muuta julkaistuja ainesmääriä, ravintoarvoja, GK-historian lähdesinettejä tai julkista karanteenia.** Uusi FI-raakile tarjoaa ensimmäisen rakenteisen, myöhemmin omaan julkaisuun vietävän version ja testattavan ravintoarvolaskennan. Tätä katselmointia ei saa kutsua fyysiseksi mittaukseksi, koepaistoksi tai itsenäiseksi ravinto-/GK-hyväksynnäksi.

## Riippumattoman aineiston tarkistus 14.11.2026

Katselmoitu luonnos on Git-blob `b4344737daaeea38eb2ff76280c6a31d8c1b3c6d` mainissa `0c66b3e5cff6fe3374eea399ad1e4b81cb0bb545`. **Päätös: HOLD.** Sopivaa koepaistoraporttia ei löytynyt.

- **Kuusi fritteriä.** V2:n taikinan nimellismassa on noin 373 g ennen paistoöljyä, kun 100 ml vettä arvioidaan 100 grammaksi. Jakaminen kuuteen antaa noin 62 g raakaa taikinaa kappaleelle. Se on annostelutavoite. Paistohävikki, rakenne ja läpikypsyys ovat avoimia. [Gavin kuuden maissifritterin ohje](https://recipesformen.com/bakwan-jagung-corn-fritters/) käyttää 65 g jauhoa, munaa, maitoa ja säilykemaissia. [Etelä-Afrikan opetusmateriaalissa](https://www.education.gov.za/Portals/0/Documents/Manuals/Occupational%20Subjects/CONSUMER%20STUDIES%20KOPANONG/2022%20CONS%20PRAC%20GUIDES%20FOR%20FOOD%20PRODUCTION/2022%20CONS%20PRAC%20Food%20Practical%20TG.pdf?ver=2023-02-15-144318-000) kuusi fritteriä tehdään munasta, maidosta ja eri jauhoseoksesta. [ICLEI:n kontrolloidussa kokeessa](https://mecs.org.uk/wp-content/uploads/2023/02/ICLEI-Control-Cooking-Expertiment_rev_NN_0902.pdf) taikina sisälsi munaa ja riisijauhoa. Kokeessa mitattiin kypsennysaikaa ja lieden energiankulutusta.
- **Paistoöljy.** Punnitut 13,5 g pannulle antavat erälle lisätyn öljyn fysikaaliseksi vaihteluväliksi 0–13,5 g. Kahdelle yhtä suurelle annokselle jaettuna se on keskimäärin 0–6,75 g lisättyä öljyä annosta kohti. Aiemman taulukon 50 % on skenaario. Se ei ole havaittu alaraja. [Adyatman bakwan-koe](https://etd.repository.ugm.ac.id/penelitian/detail/62333) tarkasteli valmiin ruoan öljyn poistamista lingolla. [Vehnätaikinan uppopaistotutkimuksessa](https://www.jstage.jst.go.jp/article/jsfe2000/6/2/6_2_143/_pdf) öljyn imeytyminen vaihteli muun muassa paistoajan ja taikinan kosteuden mukaan. Tuloksia ei voi siirtää V2:n pannupaistoon.
- **Ravintolaskelman tarkistus.** Tarkistin grammojen laskennan suoraan Fineli Release 20:n tietueista 300, 110 ja 541 sekä AFCD Release 3:n tietueista F003209 ja F006250. Aiemmat neljä makrolukua toistuivat. Säilytettäessä muut oletukset lisäöljyn 0–100 % vaihteluväli antaa kokonaisrasvaksi 1,75–8,50 g/annos. Fineli 541 kuvaa ruokaöljysekoituksen keskiarvoa. Koepaistoon kirjataan todellinen öljy ja jauhotyyppi, jonka jälkeen lähdevastaavuus tarkistetaan. V2:lle ei löytynyt siihen sidottua GI/GK-tulosta.

### Mitä koepaistosta kirjataan

1. Kirjaa luonnoksen blob, käytetyt raaka-aineet, punnitukset ja vaa'an tarkkuus. Punnitse kuorittu porkkana, syötävät maissinjyvät ja koko taikina. Käytä V2:n 100 ml vettä ja 13,5 g öljyä. Kirjaa mahdollinen lisävesi tai öljy erikseen ja käsittele muuttunut erä eri reseptiversiona.
2. Jaa taikina kuuteen yhtä suureen osaan. Kirjaa raakakappaleiden massat, paksuus, pannun tyyppi, paistoaika, onnistuneiden kappaleiden lukumäärä ja valutettujen kappaleiden massat. Tarkista jokaisen kappaleen kypsyys keskeltä ennen maistamista. [FDA:n jauhoturvallisuusohje](https://www.fda.gov/food/buy-store-serve-safe-food/handling-flour-safely-what-you-need-know)
3. Punnitse lisätty öljy ja talteen saatu vapaa öljy jäähtyneenä. Kirjaa erikseen pannuun, välineisiin, valutusmateriaaliin ja roiskesuojalle jääneet jäämät. Puhtaana talteen saatu öljy voidaan vähentää lisätystä öljystä ylärajaa laskettaessa. Vettä tai taikinajäämiä sisältävä punnitus ei sellaisenaan kerro öljyn määrää. Jos kaikkea hävikkiä ei saada rajattua, ilmoita jäljelle jäävä epävarmuus. Raaka- ja kypsäpainon erotus sisältää myös haihtuneen veden.
4. Liitä raakakirjaus ja laskettu vaihteluväli reseptikatselmointiin. Jos punnitus ei anna riittävän kapeaa vaihteluväliä, tarvitaan tarkempi mittaus samalla reseptillä. Ratkaise ravintolaskenta ja GK erikseen ennen julkaisupäätöstä.

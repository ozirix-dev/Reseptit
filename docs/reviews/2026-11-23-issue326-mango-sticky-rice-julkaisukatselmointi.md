# #326 – Thai Mango Sticky Rice: yhden reseptin nelikielinen julkaisuvertailu

**23.11.2026 · Chat-1 / toimituksellinen vertailu nykyisiin FI/EN/SV/TH-lähteisiin · PR-katselmointia varten**

**Rajaus:** Recipavon oma lähteisiin perustuva glutiiniriisiannos, ei Bantatthong-ravintolan reseptin tai videon transkriptio eikä Recipavon fyysinen koekeittiötesti. Aiempi Chat-4:n FI-lähde- ja turvallisuuskatselmointi sekä Codexin alkuperäiset käännösluonnokset ja käyttäjän hyväksymä oma kuva on jo yhdistetty mainiin PR:issä #914, #926 ja #929. Tämä kirjaus dokumentoi yhden julkaisukandidaatin vertailun; **ei itsessään ole GitHub-merge- tai tuotantodeploy-valtuutus**. Vaaditaan täsmä-HEADin CI, sisällöllinen Codex-vertailu sekä vartioitu julkaisu.

## Identiteetti ja ainesosat

Yksi uusi `thai-mango-sticky-rice-tahmariisilla`-jälkiruoka neljällä kielellä, **4 annosta**, yhteensä **330 min** (sisältää vähintään 4 h liotuksen). Olemassa oleva `thai-kookosriisi-mangolla` on eri jasmiiniriisiresepti; sen makroja/GK:ta ei peritä. Julkaisun FI-lähteen SHA-256: `c10cce2974e8c187c42189421034c352cb1f3c1c6bd96b5630d1d20ab7f035c6`.

Kaikissa neljässä versiossa on samat yhdeksän ainesosariviä täsmälleen samassa järjestyksessä: **200 g valkoista kuivaa thaimaalaista glutiiniriisiä; 180 g kookosmaitoa riisiin; 60 g sokeria; 2 g suolaa; 100 g kookosmaitoa kastikkeeseen; 5 g riisijauhoa; 20 g vettä kastikkeeseen; 1 g suolaa; 500 g kuoritun ja kivettömän mangon syötävää osaa**. Ei mungpapulisuketta eikä punnitsematonta paistoöljyä.

## FI ↔ EN/SV/TH semanttinen vertailu

- **Liotus:** 4 tuntia tai pakkauksen pidempi ohje; liotusvesi pois kaikissa kielissä.
- **Höyrytys:** 25–35 min viitteellinen aika; riisin sisus kypsäksi, tarvittaessa pidempi aika; vesi vain höyryttimen alaosaan.
- **Kookosseoksen imeytys:** 180 g kookosmaitoa + 60 g sokeria + 2 g suolaa; 20 min + 15–20 min peitetty lepo ilman vapaata nestettä.
- **Erillinen kastike:** 5 g riisijauhoa + 20 g kylmää vettä + 100 g kookosmaitoa + 1 g suolaa, kuumennetaan kiehuvaksi.
- **Mango ja tarjoilu:** 500 g syötävää mangolihaa; neljä samaa annosta joko perinteisesti tai mangoviuhkana; lisäkoristeita ei lueta osaksi annosta.
- **Riisin turvallisuus:** tarjoilu pian; tähteiden nopea jäähdytys mieluiten tunnissa, jääkaappisäilytys enintään 24 h ja uudelleenkuumennus korkeintaan kerran kunnolla kuumaksi. Ei väitettä ravintolan täsmämenetelmästä.
- **Kielivertailun tulos:** EN, SV ja TH säilyttävät yhdeksän mitattua ainesosaa, valmistusvaiheiden määrän, lämpö-/aikarajat, viittaukset ja ravintoarvojen pidätyksen. Avoimia havaittuja olennaisia P0/P1-ristiriitoja tämän kirjallisen vertailun perusteella 0. Lopullinen Codex-katselmointi ja CI tarkistettava PR:ssä.

## Kuva

Käyttäjän aiemmin hyväksymä **oma, tekstikehotteesta generoitu** kuva `kuvat/jalkiruoat/thai-mango-sticky-rice-tahmariisilla.webp` (1280 × 853, **80 630 tavua**, SHA-256 `32fab405fa2a5f8b85a50f196cd07cab321b0aa9378ada3f9c561b874c76285b`) on sama jo neljässä Draftissa käytetty kuva (PR #929). Alt-tekstit ovat kielikohtaiset. Kuva merkitään hyväksyttyyn Git-tracked image overlay -listaan, jonka byte- ja SHA-256-verifiointi suoritetaan buildissa. Bantatthongin alkuperäistä kuvaa tai videoruutua ei käytetä.

## Ravinto/GK: julkiset kentät pysyvät tyhjinä

Kaikki **neljä** julkista ravintokenttää ovat edelleen `null` kaikissa kielissä. `docs/nutrition/research/2026-11-23-mango-sticky-rice-proteiini-rasva.md` dokumentoi aiemmin hyväksytyt tutkimusarviot **5,07 g proteiinia** ja **12,94 g rasvaa/annos**, mutta tämä ei muodosta neljän makron hyväksyttyä julkaisupakettia: riisin hiilihydraattimääritelmä sekä kookosmaidon puuttuvat kuitu-/polyolitiedot estävät koko paketin julkaisemisen. Numeerinen GK jää **määrittämättömäksi**, koska juuri tälle valmistustavalle ja annokselle ei ole hyväksyttyä GI-lähdesidosta. Näiden puuttuvien tietojen hyväksyntää tai nolla-arvoja ei väitetä. Tämä on tarkistettu **pidätyspäätös**, ei ravintolaskennan PASS.

## Lähteet ja oikeudet

- [Hot Thai Kitchen / Pailin Chongchitnant](https://hot-thai-kitchen.com/mango-sticky-rice/) – riisin liotus, höyrytys ja kuuman kookosseoksen imeytys.
- [Michelin Guide / R-HAAN](https://guide.michelin.com/en/article/dining-in/how-to-make-mango-sticky-rice-like-michelin-star-restaurant-r-haan) – kypsennysajan menetelmäriippuvuus.
- [UK Food Standards Agency](https://www.gov.uk/government/publications/home-food-fact-checker/home-food-fact-checker) – kypsän riisin turvallinen jäähdytys ja uudelleenkuumennus.
- Alkuperäinen [Bantatthongin Reel](https://www.facebook.com/reel/1119160724235447) on vain sommitteluinspiraatio; tuntemattomia koristeita ei oleteta ainesosiksi.

**Julkaisun viimeiset ehdot:** CI:n varmennettu HEAD, yksi riippumaton versiosidottu katselmointi, Repo Guardin paikallinen suostumus, turvallinen merge ja erillinen tuotantojulkaisun varmennus. Ei uutta arvauslaskentaa.

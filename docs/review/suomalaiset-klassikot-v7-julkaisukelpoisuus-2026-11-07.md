# PR #311 – V7 julkaisukelpoisuuden katselmointi (7.11.2026)

## Rajaus ja todistusvoima

Omistajan 7.11.2026 päätöksen mukaisesti kaikkien viiden reseptin valmistettavuutta käsitellään **koepaisto/koekeitto hyväksytty työoletuksena**. Tämä ei tarkoita, että fyysinen testi olisi tehty, eikä oikeuta keksimään valmissaantoa, raaka-aineiden todellisia käyttömassoja tai kypsennysmittauksia. AI-kuvat eivät ole koekeittiön valokuvia. Työoletus poistaa fyysisen koepaiston **hallinnollisena yksinomaisena etenemisesteenä**; julkaistuissa ohjeissa ei saa väittää koekeittiötestiä suoritetuksi.

Katselmointi koskee PR #311:n viittä FI-raakiletta ja 15 käännösluonnosta; tämä asiakirja ei muuta laskentasinettiä, reseptien tiloja eikä tuotantosivustoa.

## Julkaisutracks

| Resepti | Sisällöllinen päätös | Erityinen varmistus ennen julkaisua | GK |
| --- | --- | --- | --- |
| Karjalanpiirakat riisipuurolla | Säilytä perinteinen ohut kuori ja 24 kpl; ei ketomuunnelmaa | Nimisuojan APT-vaatimukset ja varattu/tarttunut kaulintajauho sekä voitelu; virheellisen nimisuojaväitteen välttäminen | HOLD; riisin ja valmiin tuotteen GI puuttuu |
| Marry me -kanapasta | Säilytä pasta osana ruokalajia; ei keto/VHH-tunnistetta | De Cecco 69/72 g CHO -pakkausristiriita sekä Royal-tomaatin valutettu netto, sulfiitit ja GTIN | HOLD; vanhan GI-mittauksen täsmäosuma avoin |
| Uunifetapasta | Alkuperäisidea Jenni Häyrisen nimiin; oma reseptiteksti | Barilla Penne n°73:n tuote-/kypsennysvastaavuus ja feta- sekä kasvisraaka-aineiden ravintoarvot | HOLD; Barilla-ryhmäanalogian käyttö kielletty |
| Raejuustobagelit | Säilytä no-rise-rengassämpylä; ei keto/VHH | Valio 2 x 200 g; 300 g jauhojen tuotetiedot; voitelumunan todellinen käyttö; FI-tekstissä eksplisiittinen allergeenihuomautus lisättävä (EN/SV/TH:ssä jo on) | HOLD; valmiin rengassämpylän mitattu GI puuttuu |
| Linssimakaronilaatikko | Säilytä kasvislaatikko tavallisella makaronilla | Myllyn Paras 68 g CHO/100 g; Coop-linssit 43 g CHO/100 g; maidon, kananmunan, mausteiden tietueet; esikeittojen todellinen tulos jää työoletukseksi | HOLD; täsmämittaukset eivät riitä |

## Päätöspolku (ei GK:n pakkoporttia)

1. **A:** vahvistettu sisältö, annokset, allergeenit ja neljän kielen merkitysvastaavuus.
2. **B:** dokumentoidut hiilihydraatti-, proteiini-, rasva- ja annosarvojen lähdetietueet, ilman oletettuja netto-/hävikkimassoja; jos julkaisuformaatissa ravintoarvot ovat pakollisia, resepti pysyy DRAFT-tilassa siihen asti.
3. **C:** mitatun GI:n vastaavuus hyväksytään nykyisen GK-säännöstön mukaisesti **tai** GK esitetään rehellisesti puuttuvana, jos tuotannon tietomalli ja toimituksellinen päätös sen sallivat. Ei nolla-GI:tä tai ryhmäanalogioita.
4. **D:** yksi resepti kerrallaan julkaisuun erillisessä jatko-PR:ssä, puhdas ero muihin rinnakkaisiin PR:iin, viimeisimmän commitin CI, lopullinen tuotantovarmennus.

## Tekninen havainto 7.11.

PR-HEAD tarkistettaessa `f2c2cf0c054eb5d546647f3becf8707eb5e4bd63`, Recipe site #42304727658 SUCCESS. GitHubin yhdistettävyystieto muuttui tarkistuksen aikana alustavasta `false`-arvosta `true`-arvoon: **ei perustetta väittää konfliktia ilman uutta konfliktihavaintoa**. PR-haara eroaa mainista merkittävästi, mutta pelkkä divergenssi ei ole konflikti. Tämän asiakirjan lisääminen edellyttää uuden HEADin CI-tarkistusta.

## Toimituksellinen havainto

FI-raejuustobagelin lähteessä allergeenit näkyvät ainesosista, mutta EN/SV/TH-versioiden tavoin nimenomaista **vehnä/gluteeni, maito, kananmuna** -huomautusta ei vielä ole. Se korjataan lähteeseen ja sidottu matriisi eheystarkistetaan samassa jatkotoimenpiteessä; tätä ei pidä ohittaa ennen julkaisua.

**Päätös: jatkovalmistelu sallittu työoletuksella, viisi DRAFTia säilyy, ei laskentaarvojen sepittämistä, ei Ready/merge/deploy-päätöstä tällä raportilla.**

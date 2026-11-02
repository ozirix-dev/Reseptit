# Operaatio149:22 hyväksytyn GK-version Draft-integraatio

**Nykyinen Draft sisältää22 erikseen hyväksyttyä tarkkaa GK-versiota:16 A +6 B. Ehdokaskattavuus on178/326=54,60%. Tuotanto ja alkuperäisohjeet pysyvät156/326:ssa. Ei julkaisu-, Ready-, merge- tai deploy-valtuutta.**

## Mitä otettiin käyttöön

Alkuperäiset16 versiota hyväksyttiin menetelmä- ja sisältöpäätöksellä, jonka viite on`7127c0014edd525ac2ced97cf36b3eb511032ae2`. Niiden tarkat syöte- ja lähdehashit säilyvät [owner-approval.json](owner-approval.json):ssä. Alkuperäinen suljettu pilotti, sen19 yritystä ja16 laskettua tulosta jäävät muuttumattomiksi tutkimustodisteiksi.

Omistaja hyväksyi tämän jälkeen erillisellä vastauksella **”Kyllä, hyväksyn kuuden version paketin integraatioon”** [kuuden A-version paketin](../../research/afcd-polyol-03/six-a-review-packet.json), viite`fc8e2cbddc8d7fabd3df1cb4439db23d79d97964`. Päätös ja sen täsmälliset kuusi syötehashia sekä20 lähdetiedoston sidonnat ovat [approved-six-owner-approval.json](approved-six-owner-approval.json):ssä. Hyväksyntä kattaa vain nimetyt sisältöversiot ja paketin rajatut MEXT-/IFCT-lähdekelpuutukset. Uusi B-poisjättöprofiili ei kuulu hyväksyntään tai julkiseen importtiketjuun.

| Lisätty versio | A-laskelman GK/annos | Positiivinen CHO-poisjättö g/annos |
| --- | ---: | ---: |
| Vietnamilainen kahvijogurtti banaanilla |10,92 |0,300 |
| Dashimaki-aamiaislautanen |25,16 |1,720 |
| Hojicha-jogurtti: kaikki lehdet jauhettuina |8,82 |0,1545 |
| Natto-riisikulho |25,34 |0,390 |
| Pad kee mao: KoRo-fettuccine vedessä |1,80 |0,9375 |
| Chettinad-kana: vain curry |1,42 |1,23355 |

Arvot ovat laskentatuloksia, eivät valmiin aterian mittauksia. Käyttöliittymä näyttää likiarvon, LOW-luottamuksen ja positiivisen poisjätön näkyvästi. Poisjätön vaikutusta ei aseteta nollaksi. Yksittäinen GI:tön alkuperäinen ainesosa jää alle1gCHO/annos ja kokonaispoisjättö alle2g. Annossäätö skaalaa version omat määrät ja valmistustekstin määrät; GK/annos tai lähteen GI ei skaalaudu.

`gk149-approved-six.ts` liittää vain nämä kuusi A-versiota entiseen16:n kerrokseen. Jokaisella on FI/EN/SV/TH-ainesluettelo, oma valmistustarkennus ja lähteet. Versiot eivät peri alkuperäisen ohjeen ravintoarvoja, makronäyttöä tai laskentapidätyksiä. Alkuperäisiä reseptejä, käännöksiä, ravintoarvoja tai GK-tuloksia ei kirjoitettu uudelleen.

## Lähde- ja sisältörajoitukset

- **Natto:** maustamaton kokonainen Itohiki-natto; kaupallinen makea tare- tai muu kastikepussi ei kuulu versioon. MEXT2023:n27.3.2026 korjatun aineiston natiivi julkaistu CHOAVL-massasumma on0,3g/100g. Kaksi alkuperäistä työkirjaa yhtäpitävät; sokeriekvivalenttia tai erotusarviota ei vaihdeta tilalle. Tuntematon galaktoosi/polyoli säilyy tuntemattomana. Adapteri hylkää kimchin puuttuvan massakentän. Natolle ei lisätä GI:tä. 日本食品標準成分表（八訂）増補2023年から引用.
- **Chettinad:** vain luettelon curry, ilman määräämätöntä tarjoiluriisiä/leipää. IFCT2017 G010:n Table6 Total Available CHO3,66 hyväksytään nimettynä natiivina kenttänä. Table1:n erotusarvo4,51 tai pyöristetty osasumma3,68 eivät korvaa sitä. Currylehden40 on nykyisen projektikoodauksen sovellus, ei lehden GI-mittaus.
- **Dashimaki:** Hondashi1,4g lopullisessa200ml liemessä, valmistajan7g/litra-ohjeella. Koko jauhemassa on CHO-yläraja. Liemelle ei oleteta ravintoarvoa tai tiheyttä. Kuiva valkoinen jasmiiniriisi tarjotaan juuri keitettynä.
- **Hojicha:** kaikki2g MUSO TLF013 -lehteä jauhetaan ja syödään. Tuotteen EU-hiilihydraatti13,2g/100g on nimellisen lähdemallin yläraja. Eri jauhevalmiste tai siivilöity hauduke ei peri tätä versiota.
- **Pad kee mao:** KoRo-fettuccine punnitaan600g valutettuna, ei kuivana. Valmistajan<0,1g/100g ja muiden tuotteiden nimelliset etiketit eivät ole erän analyysi- tai biologisia ylärajoja. AFCD-kalakastike on nimetyn tuotteen koostumusproxy. Kastikkeet säilyvät mukana.
- **Kahvijogurtti:** maustamaton3,9% Bulgarianjogurtti, raaka tavallinen banaani ja tavallinen makeutettu lehmänmaitotiiviste. Tiivisteen nimetty61 ei siirry makeuttamattomaan tai kasvipohjaiseen tuotteeseen. Jogurtin30 on hyväksytty projektikoodauksen sovellus.

Lähde- ja valmistusvastaavuus ovat erillään omistajan sisältöpäätöksestä. Havaittu uusi lähdepuute palauttaa version katselmointiin; laskennan PASS ei tee GI-analogiasta kelvollista.

## Kohti80 prosenttia

| Näkymä | Numeerisia | Puuttuvia |
| --- | ---: | ---: |
| Alkuperäiset ohjeet / tuotannon lähtötila |156/326 |170 |
| Vähintään yksi hyväksytty tarkka versio tässä Draftissa |178/326 |148 |
| Vähintään80% tavoite |261/326 |65 |

Draftin ehdokastilasta puuttuu83 ja tuotannosta105 arvoa tavoiterajaan.22:n mahdollinen myöhempi julkaisu on erillinen päätös. Tässä ei merkitä80% tavoitetta tai30 käyttökelpoisen uuden ehdokkaan erää saavutetuksi.

Yhteinen aineisto sisältää33 eri reseptin aritmeettista ehdotusta:22 on nyt hyväksytty ja integroitu,11 reseptiltä puuttuu hyväksytty versio. Näistä kuusi on [lähde-HOLDissa](source-match-matrix.md): pizza, biryani, upma, taatelipuuro, baozi ja roti jala. Muut viisi ovat rahkakulho, besan-chilla, pinaatti-paneer-chilla, kaakao-kookos-chia ja ven pongal. Olemassa olevan reseptin usea vaihtoehto ei lisää kattavuutta. Jopa kaikkien tunnetun HOLD-ryhmän ulkopuolisten27 ehdotusten kelpuuttamisen jälkeen30:n erästä puuttuisi kolme.

Suositeltu jatko on ratkaista yhteiset nimetyn ruoan valmistus- ja tuote-esteet nykyisestä39+38-työjonosta. Valmisruoka-/komponenttimenetelmä pysyy suljettuna tutkimuspilottina: sama nimi, jauholaji tai onnistunut aritmetiikka ei riitä GI-siirtoon. B:n lähdeskenaario, projektikoodaus ja pelkkä GI0–150-herkkyys erotetaan. Mantelijauhon GI50 ei ole mitattu arvo tai lähteistetyn vaihteluvälin raja. Uutta rinnakkaista70 reseptin tutkimusta ei aloitettu.

`shared-blocker-queue.json` ja`verify_strategy.py` toistavat alkuperäisen16-version jälkeisen154 reseptin jäädytetyn tilannekuvan. Nykyinen148 saadaan vähentämällä siitä nyt hyväksytyt kuusi reseptitunnusta; historiallista lähdepakettia ei kirjoiteta hiljaisesti uudeksi.

## Tarkistus ja julkaisuraja

Tämän kuuden integraation varmennus: TypeScript PASS;19 kohdennettua alkuperäisen pilotin/integraation testiä PASS; yksi kohdennettu staattisen tulosteen tarkistus PASS. Alkuperäisten326 tulosten regressio ja aiempien16 täydellisten versio-objektien yhtäsuuruus PASS. Vite+esirenderöinti tuotti721 reittiä; kaikki hyväksytyt versiot näkyvät olemassa olevilla kielisivuilla ja menetelmäsivuilla. Ei ylimääräistä makrolaskentaa, koko testisviittiä tai manuaalista Actions-ajoa. Aikaisemmat Brave-tarkistukset on kirjattu validointiin oman vaiheensa historiallisena näyttönä; niillä ei väitetä uutta selainajoa.

[PR182](https://github.com/ozirix-dev/Reseptit/pull/182) on erillinen riippuvuus: sen kolme AFCD-korjausta muuttaisivat koko`food-records.json`:n hashia, johon alkuperäisen16:n erytritolisidonta perustuu, vaikka erytritolitietue ei muuttuisi. Nykyinen326 tuloksen regressiopohja sisältää myös ennen korjausta olleen persikkakulhon4,08. Tarkista main ja182 ennen myöhempää julkaisua; uuteen lähdehashiin tai4,08→3,97-korjaukseen ei anneta yleistä regressiopoikkeusta. Tätä PR:ää tai182:ta ei yhdistetä tässä ajossa.

THL Fineli Rel20:CC BY4.0. FSANZ AFCD Release3:CC BY-SA3.0 Australia. Muut ensisijaiset lähteet ja niiden täsmälliset sivu-/solu-/tuotesidonnat ovat hyväksytyissä lähdekatalogeissa ja versioiden lähdeluetteloissa.

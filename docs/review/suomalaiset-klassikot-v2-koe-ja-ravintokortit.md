# Suomalaisten suosikkien V2 – lähdesidonta ja koekeittiön katselmointikortit

Päivämäärä: 2026-11-06. Toteutettu PR #311:n samassa Draft-haarassa, jotta projektiin ei synny yhtä aikaa päällekkäisiä PR:iä. **Ei julkaisuun.**

## Vaihe 2: tehty ja tekemättä

Tässä vaiheessa toteutettiin koneellisesti luettava, reseptin nykyiseen blob-SHA:han sidottu [aineslähdematriisi](suomalaiset-klassikot-v2-aineslahiematriisi.json). Lähteenä on projektin jo olemassa oleva `docs/nutrition/food-records.json`: sitä ei kopioitu uutena päällekkäisenä ravintotietokantana. Matriisissa on **47 reseptin ainesosariviä**, joista:
- **24** rivillä on ravintotietokannan alustava elintarviketasoinen ehdokas ilman tässä vaiheessa havaittua täsmä- tai punnitusestettä.
- **11** rivillä täsmällinen tuotetyyppi, pakkaustieto tai lajike on vielä vahvistettava. Osassa näistä on jo yleinen Fineli/AFCD-ehdokas, mutta siitä ei saa tulla vahingossa vahvistettua tuotetietuetta.
- **3** rivillä käytetty / ruokaan päätyvä määrä on mitattava (karjalanpiirakan kaulintajauho ja voiteluvoi, raejuustobagelin munavoitelu).
- **9** rivillä on vesi tai ruokasuola, jotka on merkattu erikseen ravintoarvojen kannalta nollaksi.

**36/47** rivillä on alkuperäisen Fineli/AFCD-lähdekokoelman yksilöity tietue-ehdokas. Luku **ei** tarkoita 36 ravintoarvoiltaan hyväksyttyä ainesta: osalla näistä on edelleen täsmäys- tai punnituseste. Aineisto on valmistelumatriisi, ei `docs/nutrition/calculations/`-muotoinen hyväksyttävä laskelma, eikä sillä tuoteta GK-arvoja.

Huomaa, että `NUTRITION_CANDIDATE` tarkoittaa vain lähdekandidaattia. GI-näyttö on kaikkien yli nollan hiilihydraattia sisältävien ruokien osalta **NOT REVIEWED** eikä yksikään `gi`-luku seuraa automaattisesti tästä työstä.

## Koekeittiökortit – yhteiset mittaukset

Kirjaa jokaisen koeversion valmistuspäivä, tekijä, laite/uunin todellinen lämpötila, erän hävikki, ainesosapakettien tiedot ja valokuva. Punnitse syötävät raaka-aineet grammoina, sekä valmis erä **kokonaisuutena ja yksittäisenä annoksena**. Tee tarvittaessa toisen kerran toistettavuustesti; kirjaa havaittu vaihtelu, älä vain onnistunutta versiota.

### Karjalanpiirakat (24 kpl, yksi piirakka/annos)
- Ruisjauho 210 g + punnittu kaulintajauho (varaus enintään 20 g) ja vehnäjauho 70 g; kuoritaikinaan 200 g vettä. Varmista jauholajien tarkka nimi ja pakkaus; `fineli-100-release-20` ja `fineli-110-release-20` ovat ravintokandidaatteja.
- Puuroutuva riisi kuivana 200 g: `fineli-156-release-20`. Täysmaito 800 g: `fineli-689-2026-10-24`. Riisin lajike ja puuroksi keittämisen GI-osuma on yhä avoin.
- Kirjaa kaulintajauhon varauksesta palautuva osuus sekä 30 g voiteluvoin todellinen imeytymä. Jos mittausta ei tehdä, koko reseptin ravintomallia ei hyväksytä.
- Tarkista paisto 275 °C, noin 15–20 min, rypytys, ohut kuori ja tuotteiden yhdenmukaisuus Ruokaviraston APT-kuvauksen kanssa.
- **Sisältöportti:** ei muuteta reseptiä ketoksi tai korvata riisipuuroa epäsopivalla tuotteella, vaikka GI jäisi estetyksi.
- **GK-este:** perinteisen piirakkakuoren/riisipuuron täsmällistä ihmisillä mitattua GI-vastaavuutta ei ole tässä erässä hyväksytty. Yleisen riisin, leivän tai jauhon GI ei korvaa sitä.

### Marry me -kanapasta (4 annosta)
- Broilerin rintafilee 600 g `fineli-11565-release-20`; kuohukerma 200 g `fineli-631-release-20` sopii 38-prosenttiseen tuotteeseen, mutta reseptin 35–38 % vaihteluväli vaatii valitun tuotteen lukitsemisen.
- Kuiva durumspagetti 240 g: Fineli `117` on ravintoarvojen alustava *yleinen pasta*, ei riittävän yksilöity GI-täsmäosuma. Punnitse kuivapaino, kypsennysaika, valutettu kypsä paino sekä mahdollinen keittovedessä menetetty tärkkelys.
- Öljyssä säilötty aurinkokuivattu tomaatti 80 g **valutettuna**: tuotteen pakkaus, ainesosat, lisätty sokeri, ravintoarvojen ilmoitusperuste ja valutus on varmennettava. Älä korvaa tavallisella tomaatilla laskennassa.
- Kypsennä kana turvallisesti; arvioi kastikkeen koostumus ja lopullinen annoskoko.
- **Turvallisuustarkistus:** Royal-tomaattituote sisältää E224-sulfiitteja; ilmoita allergia neljällä kielellä. De Cecco -pastassa voi olla soija- ja sinappijäämiä. Maahantuojan Royal-GTIN eroaa vähittäiskaupan EANista ja pitää varmistaa.
- **Ensimmäinen jatkoon lähdeselvityksessä:** julkaistu mittausnäyttö spagetille on olemassa, mutta se ei oikeuta nimeämättömän pastan GI:n automaattista hyväksyntää.

### Uunifetapasta (4 annosta)
- Kuiva durumpenne 240 g: `fineli-117-2026-10-24` on alustava yleinen pasta. Lukitse valmistaja, pastan muoto ja kypsennys. Tutkittu De Cecco penne mezzane -tuote ei ole sama asia kuin mikä tahansa penne.
- Kirsikkatomaatit 450 g `afcd-F009190-release-3`, oliiviöljy 35 g `fineli-536-release-20`, aito feta 200 g: `fineli-11211-release-20` on vuohenmaito- ja rasvaprosenttikohtainen ehdokas, **ei varmistettu juuri ostetulle fetalle**.
- Punnitse kaikki vuokaan jäänyt ja annoksiin päätyvä öljy. Kirjaa keitetyn pastan massa ja kypsennystapa.
- **Brändiportti:** Liemessä-blogin Jenni Häyrinen mainitaan alkuperäisen idean kehittäjänä; Recipavon kuva ja teksti ovat omia. Ei perusteetonta alkuperäisyysväitettä.

### Raejuustobagelit (6 kpl)
- Raejuusto 400 g, tässä 2 %: `fineli-649-2026-10-25` kattaa laajan 2–5 % -ryhmän. Yksilöi käytetty tuote pakkauksesta.
- Vehnäjauho 300 g `fineli-110-release-20`, leivinjauhe 12 g `fineli-74-2026-10-25`; leivinjauheen hiilihydraatteja ei oleteta nollaksi.
- Voiteluun käytetään enintään 55 g kuoretonta munaa. Punnitse astiaan jäävä muna, älä laske koko munaa syödyksi ellei niin todella käy.
- Kokeile muotoiltavuutta ilman mittaamattomia lisäjauhoja, paistuneen sisuksen leikattavuutta sekä annosten samanpainoisuutta. Nimeä tarvittaessa `raejuustorenkaiksi`, jos rakenne ei oikeuta bagel-nimeä.
- **GK-este:** paistetun raejuusto-vehnäleivonnaisen GI-matriisille ei ole hyväksyttyä vastaavaa mittaustutkimusta. Vehnäjauhon tai tavallisen bagelin GI:tä ei kopioida.

### Linssimakaronilaatikko (6 annosta)
- Makaroni 220 g kuivana: Fineli `117` ravintokandidaatti, mutta tuotteen ja GI-mittauksen osuma puuttuu. Kuivat vihreät linssit 150 g: `fineli-399-release-20` yhdistää vihreät ja ruskeat; tarkan vihreän linssin vastaavuus on yhä avoin.
- Kevytmaito 500 g `fineli-684-release-20`, munat 110 g `fineli-858-release-20`, mutta 17 % emmentaljuustolle **ei** saa käyttää 27–30 % Fineli-emmentalia.
- Punnitse kypsä ja valutettu makaroni ja linssi, kirjaa käytetty vesi ja hävikin käsittely. Kokonaisannoksen ravintoaineita ei saa vahvistaa ilman mahdollisen valutushävikin käsittelyä.
- **GK-este:** makaroni ja linssi tarvitsevat molemmat GI-lähdeosuman. Matala linssin GI ei todista koko laatikon matalaa GK:ta.

## Konkreettinen työjärjestys

1. **Täsmäpakkausvalinnat:** makaronit/spagetti/penne, aurinkokuivattu tomaatti, kerma, feta, raejuusto ja 17 % emmental; kirjataan ravintopakkaus ja syötävä massa. Suomessa ostettavissa oleva tuote on tavoite, mutta brändiä ei tarvitse nostaa julkisen reseptin nimeen.
2. **Punnitustestit:** aloita karjalanpiirakan ja bagelin voitelusta/kaulintajauhosta; muut valmistus- ja valumamittaukset samassa erässä.
3. **Ravintolaskennan hyväksyntä:** siirrä vasta silloin oikeasti täsmäytetyt ainekset `docs/nutrition/calculations/<recipe_id>.json`-rakenteeseen, tuota lähdetiiviste, auditoi ja kirjoita neljä virallista ravintoarvoa reseptiin. Älä siirrä tähän pelkkiä katalogin raakalukuja suoraan hyväksytyiksi arvoiksi.
4. **GI/GK-erillinen päätös:** jokaiselle olennaiselle imeytyvän hiilihydraatin lähteelle oikea mitattu GI, ruokalaji- ja valmistusvastaavuus. Pienten ilman GI:tä jäävien ainesosien raja: jokainen alle 1 g/annos ja yhteensä alle 2 g/annos; ei ryhmäanalogiaa, ei arvailua.
5. **Julkaisukatselmointi V3:** vasta sisältö- ja laskentahyväksynnän jälkeen omat kuvat, FI/EN/SV/TH-käännökset, selkeät lähdeviittaukset ja tarvittaessa `GK ei arvioitavissa` -tila. Omistajan viimeinen päätös.

## Todennettavat tulokset

- Viiden reseptin `status: draft` ei muutu tässä erässä.
- Kokeilua **ei** ole tehty fyysisesti; yllä olevat ovat punnitustestien protokollia, eivät onnistuneen koepaiston väitteitä.
- Mitään puuttuvien makroravinteiden arvoja ei nollata. `docs/nutrition/calculations` ja viralliset GK-julkaisut pysyvät koskemattomina.
- Kaikki myöhemmät muutokset voivat vertailla nykyistä reseptin blob-SHA:ta V2-matriisin `recipeBlobSha`-arvoon ja todeta, jos ainesluettelo on muuttunut.

## Lähteet

- THL Fineli Release 20, CC BY 4.0; repon `docs/nutrition/food-records.json` sisältää tarkat tietueet ja lähde-URL:t.
- FSANZ Australian Food Composition Database Release 3 (lähdekohtaiset käyttöehdot); käytetään vain vastaavissa raaka-ainetapauksissa.
- Ruokaviraston Karjalanpiirakka APT -eritelmä: https://www.ruokavirasto.fi/yritykset/oppaat/nimisuojattujen-elintarvikkeiden-valvontaohje/nimisuojattujen-elintarvikkeiden-valvontaohje/
- GI-tutkimus pastan muodon ja kypsennyksen eroista: https://pubmed.ncbi.nlm.nih.gov/3743316/
- Recipavon GI-lähdekatselmointi: [GI-haun muistio](suomalaiset-klassikot-gi-lahdehaku-2026-11-06.md).

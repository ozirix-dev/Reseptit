# Reseptin ainekset ja valmistus – ruoanlaittonäkymä V1

**Päätösaihio:** 5.11.2026, raejuustopizzan FI-näkymän käytettävyyskatselmus.

**Lähtökohta:** https://ozirix-dev.github.io/Reseptit/raejuustopizza-kaurajauhopohjalla/

**Status:** toteutusta ohjaava suunnitelma; ei vielä käyttöliittymä- eikä reseptimuutoksia.
**Tavoite:** tehdä reseptistä helposti käytettävä keittiössä neljällä kielellä (FI/EN/SV/TH), säilyttäen täsmällinen laskentadata ja nykyinen kaksipalstainen perusrakenne.

## Havaittu nykytila ja rajaus

- Desktopissa ainesosat vasemmalla ja valmistus oikealla. Ratkaisu on käyttökelpoinen, eikä uutta layoutia tarvita.
- Raejuustopizzan ainesosissa huomautus `pohjaan` toistuu lähes joka rivillä; `täytteeksi` samoin. Ryhmien otsikot puuttuvat. Tämä tekee listasta tarpeettoman korkean.
- Täsmälliset grammamäärät ovat ravintoarvolaskennalle oikein, mutta osa on keittiössä epäluontevia (esim. `110 g kuoretonta kananmunaa`; tieto noin kahdesta munasta löytyy nykyään pienemmästä huomautuksesta).
- Valmistusohjeiden vaiheet ovat loogiset mutta paikoin pitkät. Tärkeät arvot (200 °C, 5 min, 15–20 min) eivät korostu.
- `RecipePage.tsx` skaalaa `recipe.ingredients`-määrät annosvalinnalla. `instructionStepsHtml` ja `instructionsHtml` pysyvät lähdereseptin alkuperäisinä. `toolUi[locale].scaled(base)` ilmoittaa tästä jo annosmäärän muututtua. **Huomautusta ei saa poistaa ennen turvallista korvaavaa toimintoa.**
- Ainesosien ja ohjeen yhteisnäkymän toimivuus pienellä näytöllä, pitkässä kieliversiossa ja tulosteessa on testattava; yhdestä desktop-kuvasta ei voi päätellä puhelintoimivuutta.

## Toteutus, vaihe 1: matalariskinen näkyvä parannus

1. **Ainesosien rakenteinen ryhmittely.** Laajenna tarvittaessa `RecipeIngredient` ja `recipeFrontmatterSchema` valinnaisella esitysryhmällä, joka ei muuta `amount`, `unit`, `item` eikä GK-/makrolaskennan syötteitä. Näytä ryhmät esim. **Pohja** ja **Täytteet** erillisinä otsikoina. Älä päättele ryhmää yleisesti huomautuksen vapaasta tekstistä tai hakusanasta: myös muut reseptit ja kielet käyttävät `note`-kenttää moniin eri tarkoituksiin. Jos ryhmiä ei ole, säilytä nykyinen yksinkertainen lista.
2. **Poista vain todettu turha toisto näkyvältä listalta.** Raejuustopizzan kaikkien neljän kieliversion ryhmäkohtainen `pohjaan / for the base / till bottnen / สำหรับทำฐานพิซซ่า` sekä täytemaininta voidaan ryhmittelyn jälkeen korvata ryhmäotsikolla, **mutta säilytä** ainesosakohtaiset turvallisuus-, koostumus- ja käytännön lisätiedot: esim. `noin 2 keskikokoista munaa`, `ei lisättyä sokeria`, `valmiiksi kypsä ja sellaisenaan syötävä`.
3. **Ihmisläheiset mitat, laskentamitat koskematta.** Näytä esimerkiksi `2 keskikokoista kananmunaa (noin 110 g ilman kuoria)` silloin, kun reseptin data tukee molempia. Älä päättele valkosipulin kynsien, sipulin kappaleiden tai muiden ruoka-aineiden lukumäärää pelkistä grammoista; lisää talousmitat vain tarkistetun vastaavuuden perusteella. Skaalauksen on toimittava myös talousmitan kanssa tai sen on jäätävä selkeästi alkuperäisen määrän kuvaukseksi.
4. **Työvaiheiden silmäiltävyys.** Korosta reseptikohtaisesti olennaisia lämpötiloja, aikoja ja kypsyyden tarkistuspisteitä; säilytä ohjeiden merkitys. Älä tee huomaamattomia automaattisia tekstikorvauksia tai yleistä regex-lihavointia. Pitkää vaihetta saa jakaa vain niin, ettei ajoitus, työjärjestys tai elintarviketurvallisuus muutu.
5. **Ulkoasu ja saavutettavuus.** Pidä nykyinen desktopin kaksipalstaisuus, selkeät rastitettavat vaiheet, 44 px kosketuskohteet sekä tulostus. Ryhmäotsikot on tehtävä semanttisiksi ja selkokielisiksi myös ruudunlukijalle. Vältä yleistä kirjasinkoon pienentämistä pelkän tilan säästämiseksi.

**Vähimmäistulos vaiheesta 1:** raejuustopizzan FI/EN/SV/TH näkyvät ainekset ovat jaettu pohjaan ja täytteisiin, erityishuomiot säilyvät ja ohjeessa huomaa tärkeät ajat ja lämpötilat aiempaa nopeammin. Muut reseptit toimivat muuttumatta.

## Toteutus, vaihe 2: annosmäärän ja ohjeen yhteensovitus

- Älä skaalaa valmistusohjeen HTML:n mielivaltaisia numeroita regexillä: grammojen lisäksi tekstissä on lämpötiloja, halkaisijoita, aikoja, kappalemääriä ja kypsyysvaatimuksia.
- Suunnittele **rakenteinen ainesosaviittaus** valmistusvaiheisiin (ainesosatunniste, alkuperäinen määrä ja turvallisesti skaalattava esitysmuoto). Näytä epävarmat tai skaalaamattomat ohjetiedot eksplisiittisesti.
- Raejuustopizzan pilotissa kaksi annosta = yksi noin 25 cm:n pizza, neljä annosta = tyypillisesti kaksi erillistä pizzaa, ei yksi kaksinkertaisena paistettava pohja. Käytettävissä oleva pelti/uunin kapasiteetti sekä paistoajat vaativat erillisen harkinnan; älä päättele uutta paistoaikaa pelkästä annoskertoimesta.
- Kun annoksia muutetaan, selkeän ilmoituksen pitää kertoa **mitkä arvot skaalautuivat ja mitkä eivät**; nykyinen huomautus on pidettävä, kunnes luotettava ratkaisu on testattu.
- Erota jatkossakin alkuperäiseen reseptiin perustuva ravintoarvo/GK julkaistusta aineistosta; annosvalinnan käyttöliittymä ei saa muuttaa hyväksyttyjä laskentasyötteitä.

## Toteutus, vaihe 3: Recipavo ja mobiilikeittiö

- Testaa 320, 375, 768 ja noin 1280 px leveydet. Mobiilissa aineslistaan palaamisen on oltava helppoa pitkän valmistuksen aikana; harkitse saavutettavia Ainekset/Valmistus-vaihtopainikkeita tai kevyttä navigointia, jos käyttökokeilu osoittaa tarpeen.
- Tarkista pitkät thainkieliset nimet, rivittyminen, tulostusnäkymä sekä näppäimistö- ja ruudunlukijakäyttö.
- Recipavon käyttäjien tuontireseptit tarvitsevat saman esitysrakenteen mutta epävarmat talousmittavastaavuudet on erotettava tarkistetuista; suunnitelma sovitetaan PR #295:n tuontimalliin.

## Hyväksymiskriteerit ja regressiotestit

- [ ] Sama testiresepti FI/EN/SV/TH; ryhmäotsikot ja tärkeät huomautukset oikein eikä käyttöliittymään synny epämääräistä merkityksetöntä ryhmää.
- [ ] Tavanomainen resepti ilman ryhmätietoja näkyy entiseen tapaan.
- [ ] Annosvalinta 1, 2 ja 4; aineslistan skaalaus oikein, määrien esitystavat ristiriidattomia ja skaalaamattomien ohjeiden huomautus näkyy.
- [ ] Ohjeen 200 °C on aina 200 °C; paistoajat, koko ja kypsyysehdot eivät muutu annoskertoimella.
- [ ] Työvaiheen rastitus / nollaus / ruudunlukijamerkintä / tulostus pysyvät toimivina.
- [ ] Mobiili- ja desktop-selailu FI/TH + tuloste tarkistettu.
- [ ] `recipe-schema`, `servings`, `published-content`, käännös- ja sisältövalidoinnit sekä relevantit browser smoke -testit läpäisevät.
- [ ] Käännöstiedostojen mahdolliset sisältömuutokset käyvät repo-ohjeen mukaisen FI-lähteeseen sidotun katselmoinnin; päivitä tarkisteet/evidence vaadittaessa. Ei vaadita yhden ihmisen manuaalista läpikäyntiä kaikille yli 300 reseptille.
- [ ] Ravintoarvot, hyväksytyt GK-arvot, reseptiversiot ja laskennan lähteet pysyvät samoina. Yksi esimerkkiresepti ennen laajentamista.

## Riippuvuudet ja yhteensovitus

- Tämän dokumentin rajaus ei muuta `site/src/styles.css`-tiedostoa eikä siis kilpaile avoimen **PR #293** (etusivun hero/haku) kanssa.
- **PR #295** käsittelee käyttäjän reseptituontia ja **PR #297** mallinnettua GK-arviota; toteutuksessa ei saa sotkea niiden tietomalleja esitysmittayksiköihin.
- **PR #296** muuttaa muita reseptejä ja ravintosyötteitä; vaihe 1 ei koske sen numeerisia lähtötietoja.
- Toteutus erillisenä rajattuna jatko-PR:nä tai tämän luonnoksen jatkokommitteina **yhdeltä nimetyltä PR-omistajalta**, CI ja katselmointi sidottuna täsmälliseen HEADiin. Ei mergeä/deployta tästä suunnitteludokumentista ilman erillistä päätöstä.

## Ei tehdä

- Ei koko reseptisivun uudelleensuunnittelua, uusien väiteperusteettomien talousmittojen arvaamista, GK:n tai muiden ravintoarvojen laskentamuutoksia, kaavojen kiertotietä muuttavia tekstikorjauksia tai automaattista paistoajan kertomista annosmäärällä.

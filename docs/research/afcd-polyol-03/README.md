# AFCD-POLYOL-03 / GK80-30: yhteisen erän luovutusaineisto

## Päätös ja todellinen kattavuus

Valittu toteutusreitti on nykyisen GK-only-putken täydentäminen yhteisillä lähde-, määrä- ja valmistussidoksilla. Julkaisupolku on yksi: [Operaatio 149 V2, Draft PR #183](https://github.com/ozirix-dev/Reseptit/pull/183). Tässä haarassa on siihen yhdistettävä aineisto ja eristetyt työkalut; kilpailevaa GK-julkaisu-PR:ää ei avata.

**Viimeistelty yhteinen erä: 10 nykyisen A-aritmetiikan tulosta + 6 hyväksyntää odottavaa B-ehdotusta = 16 numeerista ehdokasta. C-luokkia 0.** Kaikki 16 tarvitsevat täsmällisten reseptiversioiden ja julkaisusopimuksen hyväksynnän. A- ja B-valtuudet ovat erillisiä. Käyttäjän lupa GK-only-jatkovalmisteluun ei hyväksy uusia GI-oletuksia tai julkaisemista.

| Tila | Numeerinen kattavuus |
| --- | ---: |
| Nykyinen main / tuotannon lähtötila | 156/326 = 47,85 % |
| Kymmenen A-version myöhempi hyväksyntä ja julkaisu | 166/326 = 50,92 % |
| Lisäksi kuuden B-version hyväksyntä ja julkaisu | 172/326 = 52,76 % |
| Vähintään 30 uuden ehdokkaan tavoite | 186/326 = 57,06 % |
| Lopullinen vähintään 80 %:n tavoite | 261/326 = 80,06 % |

**30:n tavoite ei vielä täyty: 14 perusteltua lisäehdokasta puuttuu.** Neljää mantelijauhon GI50-mallilla laskettua tutkimusskenaariota ei lasketa ehdokkaisiin tai kattavuuteen. Tällä ajolla hyväksyttyjä tai julkaistuja uusia lukuja on 0. Nykyisestä lähtötilasta 80 %:iin tarvitaan 105 uutta julkaisua; 16 ehdokkaan mahdollisen julkaisun jälkeen puuttuisi 89.

## 16 ehdokkaan viimeistely

[16-decision-matrix.csv](16-decision-matrix.csv) erottaa A/B-tason, pisteet ja välit, pois jätetyn hiilihydraatin, nimetyt GI-havainnot, nykyiset koodaukset, uudet toimitukselliset koodaukset, herkkyyskokeet ja hyväksynnät. Täydellisiä tulosobjekteja tai lähdehavaintoja ei kopioida reseptikohtaisesti.

| Nykyisen A-menetelmän ehdokkaat | GK/annos |
| --- | ---: |
| Keto-mutakakku | 0,07 |
| Keto-suklaakeksit | 0,03 |
| VHH-juustokakku | 0,63 |
| Palak paneer | 1,79 |
| Paneer tikka | 3,07 |
| Kana-parmesaanipannu | 1,06 |
| Kermainen kanasienipannu | 0,74 |
| VHH-pyttipannu | 2,60 |
| VHH-mansikkakakku | 1,11 |
| Pho ga -aamiaiskeitto | 24,96 |

B-ehdokkaat ovat congee 31,09; halloumi-tomaattileipä noin 12,84–17,77; makaronilaatikko noin 16,91–17,76; kurpitsapuuro 35,42; laksa 27,55; kaya-paahtoleipä noin 18,37–23,31. Kolme on piste- ja kolme lähdeskenaarioväliehdotuksia. Mikään väli ei ole fysiologinen virheraja tai luottamusväli.

Congee ja halloumileipä tarvitsevat nimettyjen valmistusanalogioiden hyväksynnän. Muut neljä B-tapausta tarvitsevat lisäksi nimetyn kasvi-/pienainesosan GI50-koodauksen hyväksynnän. Pelkkä numeerinen laskentatulos ei hyväksy analogiaa. Pisteet ja vaihteluvälit eivät peitä erillistä GI0–150-oletusherkkyyttä.

Kaikkien 16:n alkuperäiset reseptiversiot ja ehdotetut punnitut versiot tarkistettiin rinnakkain. Kokonaiset hiilihydraattipitoiset ainesosat säilyvät. Laksa sisältää erikseen hyväksyttävän 2 g curryjauhetäydennyksen, koska nykyinen valmistusohje mainitsee curryn mutta ainesosaluettelo ei määrää. Luovutusaineisto ei hyväksy sitä nykyiseksi reseptiksi. Lusikkamäärien korvaaminen punnituilla vanilja-, mauste- ja leivinjauhemäärillä on sisältöpäätös. Vanhoja makroja ei saa periä muuttuneelle versiolle.

## AFCD:n välitön vaikutus

Nykyisistä 170 GK-puutteisesta reseptistä 88 käyttää AFCD:tä: **68 natiivitietuetta ja 91 paikallista arvoversiota**. Niistä 90 vastaa lähteen without sugar alcohols -kenttää. Yksi vadelmakopio riippuu yhä avoimesta [PR #182:sta](https://github.com/ozirix-dev/Reseptit/pull/182); sen korjausta ei kopioitu tähän haaraan. Saman paikallisen tunnisteen kaksi jo oikeaa makrokopiota erotetaan väärästä GK-kopiosta.

Kokonaispolyolin muuttaminen tuntemattomaksi ei muuta yhdenkään 170 puuttuvan tapauksen nykyistä raakalaskentaa. **Pelkkä AFCD-polyolien yleinen uudelleentulkinta avaa siis 0 uutta numeroa.** Uusia A-ehdokkaita tästä erillisestä AFCD-ajosta on 0; yhteisen erän kymmenen A-tapausta kuuluvat #183:een. Erillisiä GI50-mallin tutkimusskenaarioita on neljä, mutta kelpuutettuja uusia B-ehdokkaita niistä on 0.

Yhteinen eristetty lähdeprofiili [gk-only-source.ts](gk-only-source.ts) käyttää varmennettua lähdeversiota, natiivi-ID:tä ja without-kenttää. Se säilyttää kokonaispolyolin tuntemattomana eikä vaadi proteiinia tai rasvaa. Se ei hyväksy GI:tä, makroja tai julkaisemista. Virheellinen paikallinen kenttävalinta pysäyttää sovituksen. Lähdemääritelmiä ei tutkittu uudelleen; pohjana on [PR #181](https://github.com/ozirix-dev/Reseptit/pull/181).

## Yhteiset esteet ja menetelmien todellinen tuotto

[priority77.csv](priority77.csv) on nykyisen yhteisen työjonon 39 mallinnus- ja 38 tuote-/valmistustapausta. Se ei ole uusi rinnakkainen 70 reseptin tutkimus. Mallinnusryhmä sisältää kuusi jo löytynyttä B-ehdotusta, joten ratkaisemattomia prioriteettitapauksia on **33 + 38 = 71**.

[method-impact.csv](method-impact.csv) sisältää reseptiriippuvuudet ja erottaa valmistellut numerot, julkaistut lisäykset ja tutkimusaritmetiikan. Nykyinen GK-only-sopimus palvelee kymmentä A-versiota; nimetyt B-analogiat kahta ja uudet B-koodaukset neljää muuta. Kaikkien julkaistu lisätuotto on vielä 0.

- Currytahnan koostumus-/GI-ryhmässä on kuusi reseptiä ja lisäksi yksi määrittelemättömän currytahnan tapaus. **Kookosmaidon plant50-hyväksyntä yksin avaisi näistä 0**, koska tahnan riippumaton hiilihydraatti/GI tai tuote jää ratkaisematta.
- Hernekeiton, mungpapupuuron ja härkäpapusoseen yhteinen valmistusryhmä sisältää kolme tapausta. Keitetyn palkokasvin lähde ei yksin ratkaise kuivauksen, halkaisun, kuorinnan ja soseutuksen eroja. Valmiita uusia kokonaisnumeroita tästä päätöksestä on vielä 0.
- Kahden kylmän marjaruoan ryhmä tarvitsee marjalajille sopivan GI-analogian sekä juoman/makeuttajan täsmälliset tuotteet. Mansikan GI40 ei automaattisesti kelpaa vadelmalle tai mustikalle.
- Tuote-/massaversion vahvistaminen 38 tapauksessa ei tarkoita 38 uutta numeroa: myös jäljelle jäävä GI-, valmistus- ja nautittu osuus tarkistetaan.

Kaikkien 170 tapauksen [blockers.csv](blockers.csv) ja yhteiset [source-groups.jsonl](source-groups.jsonl) säilyvät taustakarttana. Ensisijaiset luokat ovat A26, B4, C41, D16, E2, F1 ja G80; G tarkoittaa useita riippumattomia esteluokkia. Luokitus on nykyisen laskentasyötteen työjono, ei väite, että lähdetutkimus olisi kaikkialla loppuun tehty. Tee-munien raakalaskennan nollaa ei palauteta lähdeportin ohi.

## Mantelijauhomallin rajaus

[assumption-research/method.json](assumption-research/method.json) ja neljä täsmällistä skenaarioversiota säilytetään erillään. AFCD:n 5,4 ja Finelin 6,6 g/100 g kuvaavat kahta nimettyä koostumushavaintoa. GI50 on toimituksellinen mallioletus: [Schakelin ym. tekijäesityksen](https://pdfs.semanticscholar.org/eead/ef25b9a2d5c209deb31265082c85080758f4.pdf) sivu 12 kuvaa vähähiilihydraattisten ruokien tietokantaoletuksen, ei mantelijauhon GI-mittausta. Esitys ei osoita tämän projektin rajan laajennuksen tai reseptikohtaisen virherajan pätevyyttä.

Koostumusskenaarioiden väli ei rajaa tuntematonta GI:tä tai jauhatuksen/paistamisen vaikutusta. Nykyinen A-menetelmä pitää rahkapiirakan ja kaksi 200 g mantelijauhoa käyttävää versiota pidossa; poisjättörajaa ei muuteta. Neljän skenaarion aritmetiikka ei yksin täytä hyväksyttyä numeerista julkaisusopimusta.

## Toistettavuus, säilyminen ja seuraava toteutus

Vertailupohja on main `4a804757`. Yhteinen aineisto on sidottu #183:n commitin `7127c0014edd525ac2ced97cf36b3eb511032ae2` yhdeksään tiedostoon; [upstream-provenance.json](upstream-provenance.json) vahvistaa niiden vastaavuuden. Lähteet: THL Fineli Rel20, CC BY 4.0; FSANZ AFCD Release 3, CC BY-SA 3.0 Australia. Tässä tehty tulkinta erottaa GK:n saatavan hiilihydraatin muista ravintotekijöistä.

Tarpeelliset paikalliset tarkistukset tehtiin: 16 numeerisen tapauksen ja kolmen A-pidätyksen laskenta, riippumaton Decimal, lähdekenttä-/versio-/reseptihashit sekä 90 oikean ja yhden ehdollisen AFCD-kopion erotus. Lisäksi jo tehty neljän tutkimusskenaarion kahdeksan päätepisteen Decimal-tarkistus säilyy erillään. Ei koko sivuston buildia, uutta testisviittiä tai Actions-uusintaa.

Työkalut lukevat varmennettua Reseptit-repoa ja kirjoittavat vain erikseen annettuun Gitin ulkopuoliseen scratch-hakemistoon: `capture-shared149.mts`, `build.mts` ja `finalize-priority.py`. Lähde- ja Decimal-tarkistimet ovat lukevia. Yhteisen aineiston täydellisiä tulosobjekteja ei tallenneta tähän haaraan.

**Seuraava todellinen hyppy on 156 → 166 → 172**, jos vastaavat tarkat A- ja B-versiot sekä julkaisusopimukset hyväksytään ja integroidaan. Sen rinnalla jatkovalmistelu kohdistuu nykyisen 71 ratkaisemattoman prioriteettitapauksen yhteisiin lähde-/valmistusratkaisuihin. Mantelijauhon GI50-kokeita ei jatketa niiden kustannuksella. Ei uusia päällekkäisiä PR:iä, mergeä, Ready-siirtymää tai deployta.

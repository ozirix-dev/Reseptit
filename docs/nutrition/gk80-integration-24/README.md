# GK-80 AJO6 –24 reseptin integraation valmistelu

Tila READY_FOR_OWNER_METHOD_AND_CONTENT_REVIEW. Paikallinen varmennus läpäissyt. Omistajan menetelmä- ja
sisältöhyväksyntä odottaa. Tämä dokumentti ei anna julkaisulupaa.

Main-pohja e8da2c9417e2aeff55a85d599b3b7e1ad465f36c.
Lähteet: PR143 /1f0579b843d2b858800e475436f9d48857c90723 ja
PR145 /1b2fbc7997ca15f5e37aa3415b11107ba06b9677.
Riippumaton katselmointi5719575453 luettu; se on ehdollinen kehitys-GO.

Kolmen paketin unionin paikallisesti varmennettu tulos on107/326:24
tarkoituksellista GK-muutosta ja302 ennallaan säilyvää tulosobjektia.
Historialliset testinäkymät säilyttävät mainin täsmälliset lähde- ja
ravintoarvo-odotukset24 valitulle ID:lle. Nykytesti vertaa oikeaa buildia
alkuperäiseen326-reseptiseen lähtöaineistoon. Vanhoja baselineja ei muuteta.

Pakettikohtaiset samannimiset GI-/koostumus-ID:t pysyvät omissa hasheilla
sidotuissa aineistoissaan. Niitä ei yhdistetä pelkän ID-nimen perusteella.
Kaikki24 ovat FI-only; mallinnus- ja luottamustekstit ovat FI/EN/SV/TH.

Menetelmäpäätös: ihmis-GI, sovellettu ihmis-GI, julkaistu GI40/30/50-koodaus,
projektin5g/100g ja0,5g/ainesosa/annos sekä1g/yhteensä-rajat, nimetty
skenaario ja tuntematon erotetaan. Ne eivät ole biologisia virherajoja.
LOW-luottamus ja tuntematon biologinen epävarmuus säilyvät näkyvinä.

Q09-korjaukset tehdään erillisessä main-pohjaisessa Draftissa. Tämän
integraation302 ulkopuolisen tuloksen muuttumattomuus ei hyväksy yhdeksää
tunnettua virheellistä nollaa. Myöhempi yhdistäminen Q09:n kanssa tarvitsee
uuden yhteisen regression ja kattavuuslaskelman.

Ei Ready-siirtymää, mergeä, deployta tai automaattista AJO7:ää.

## Varmennus ja päätös

180 yksikkötestiä,27 käännöstestiä,25 staattista testiä ja691 reitin build
läpäisivät paikallisesti. Pakettien1,2,3 riippumaton Python Decimal toistui.
Brave tarkisti kaikki24 sivua,96 näkyvää makroarvoa, mallinnus- ja
luottamustekstit sekä24 reseptikohtaiset GI-/koostumusviitteet.
JavaScript-virheitä0. Positiivinen callaloo-GK näkyy alle yhtenä.
Lopullisen HEADin GitHub CI on tarkistettava valmistuneeksi ennen kuin
sen läpäisyä väitetään; tarkka HEAD ja CI-linkki ovat AJO6-koontiraportissa.

Yhteinen omistajan päätös: [menetelmä ja sisältö](owner-method-decision.md).
Myöhempi [julkaisupolku ja palautussuunnitelma](publication-checklist.md).
Hyväksyntää tai julkaisulupaa ei ole merkitty saaduksi.

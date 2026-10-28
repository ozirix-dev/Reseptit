# GI 58:n muiden käyttöryhmien rajattu jatkotehtävä

Tila: avoin, ei toteutettu AJO 1.7:ssä. Lähde: main
`e64a7ce04e71ab707f263b752763d02e42823cc7` sekä
[AJO 1.7:n 62 sidonnan / 28 lasketun reseptin inventaario](glycemic-almond-source-review.json).

## P0: neljä julkaistua selvää väärän ruokaperheen sidontaa

- **keto-kauralesesampylat**: julkaistu GK 1.34, tarkka 1.33703125. GI 58 -ainesrivit: kauralesettä, 25 g, HH/annos 1.6309375, GK-osuus 0.94594375.
- **silakkapihvit-tilli-kermakastike**: julkaistu GK 1.73, tarkka 1.7280461999999999. GI 58 -ainesrivit: ruisjauhoja, 16 g, HH/annos 2.3756399999999998, GK-osuus 1.3778712.
- **vietnamilainen-banh-cuon-sienilla**: julkaistu GK 23.01, tarkka 23.01185. GI 58 -ainesrivit: riisijauho, 100 g, HH/annos 39.65, GK-osuus 22.997.
- **kanaviillokki-kukkakaalilla**: julkaistu GK 7.57, tarkka 7.573741999999999. GI 58 -ainesrivit: vehnäjauhoja, 20 g, HH/annos 3.6999, GK-osuus 2.145942.

Kanaviillokin vehnäjauho suurustaa 8–10 minuuttia haudutettua kastiketta;
kauralesesämpylän kauralese on itsenäinen leseainesosa; silakkapihvien
ruisjauho on pannulla paistuvan kalan leivitys; banh cuonin riisijauho on
höyrytetyn ohuen riisikääreen ainesosa. Valmiiden leipomotuotteiden ryhmäkeskiarvo
GI 58 ei osoita näiden raaka-aineiden GI:tä. P0 tarkoittaa tässä julkaistun
ravintoarvon lähde-eheyden kiireellisyyttä, ei väitettä välittömästä kliinisestä vaarasta.

Näiden neljän nykyinen GK on yhä julkaistuna ja jää muuttumattomaksi AJO 1.7:ssä.
Siksi tätä seulaa ei pidä tulkita niiden hyväksynnäksi. Koko GI 58 -lähdettä
koskeva päätös tai toisten raaka-aineryhmien korjaus vaatii oman reseptikohtaisen
vaikutusauditoinnin. Sama rajattu auditointi käsittelee 12 muuta laskettua
vehnäjauho-/mannasuurimokäyttäjää (P1: ingredient-to-product-analogia todentamatta)
sekä jo keskeneräiset muut käyttäjät koneellisen inventaarion mukaisesti.

## Hyväksymiskriteerit seuraavalle tehtävälle

- Lukitse silloin julkaistu main; inventoi aktiiviset GI 58 -sidonnat uudelleen.
- Tarkista alkuperäislähteen tuoteryhmä, todellinen raaka-aine ja valmistus.
- Etsi valmistustapaan soveltuvaa alkuperäistä ihmismittausta.
- Poista perusteeton sidonta; säilytä GK vain lähteistetyillä pienosuuksilla.
- Tarkista jokaisen vaikutusreseptin kaikki poisjätöt ja muut estot.
- Vertaa kaikki 326 reseptiä, säilytä historialliset baselinet ja aiemmat korjaukset.
- Lisää rajatut testit ja tee erillinen Draft-PR; älä vaihda GI-arvoja massana.

Tavoite on lähdelaadun korjaus. Korjauksen ei tarvitse kasvattaa kattavuutta.
Uusia GI-perheitä tai seuraavaa kattavuuserää ei ole valtuutettu tässä dokumentissa.

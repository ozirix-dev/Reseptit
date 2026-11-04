# GK100/Recipavo — kohdennetut hyväksyntätestit ja mittarit

**Tila: ehdotettu tuleva testisopimus.** Tämä dokumentaatio-PR ei muuta koodia, testejä eikä tuotantoa. Testit tehdään vasta niitä vastaavissa pienissä toteutus-PR:issä. Ei tarpeettomia koko sivuston build- tai selaintestiajoja dokumentaatiomuutoksen vuoksi.

## Testifiktuurit: mitä on pakko erottaa?

| ID | Riskitapaus | Odotettu toiminta |
| --- | --- | --- |
| CHO-01 | Sama 20 g sokeri+tärkkelys koostumuksena Fineli/EU-vastaava, USDA-total 30 g sisältäen 10 g kuitua, GI 50 | Molemmat normalisoituvat samaan **GK 10**, ei toista kuituvähennystä |
| CHO-02 | Valmiiksi polyolit pois sisältävä koostumuskenttä | Polyolia ei vähennetä uudestaan |
| CHO-03 | US-total sisältää tunnetun kuidun ja tunnistetun polyolin | Eri komponentit säilyvät, sama GI-testiperusta; ei hiljaista kaksoisvähennystä |
| CHO-04 | Polyolitiedot puuttuvat | Ei päätellä polyolia nollaksi eikä puuttuvasta tiedosta valmista kokonaistulosta |
| CHO-05 | Maltitoli- ja erytritolituote, sama makeutusmassa | Ei yhteistä GI 0 -sääntöä eikä kcal/g-kertoimesta tehtyä GK-kerrointa |
| ZERO-01 | Täsmällisesti varmistettu 0 g CHO | Termi nolla, ilman tarpeetonta GI:n hakua |
| ZERO-02 | Pakkauksen pyöristetty “0 g/annos” | Ei automaattista täsmällistä nollaa; merkitään tarkkuus/raja |
| MASS-01 | 100 g kuivaa riisiä ja 300 g kypsää riisiä | Erotetaan syötemäärä ja valmispaino; pelkkä veden lisäys ei muuta koko erän CHO:ta |
| MASS-02 | 200 g avokadon syötävää lihaa vs 200 g kokonaisia avokadoja | Sama massa ei tarkoita samaa syötyä annosta |
| MASS-03 | Marinadi ja liemi: osa syödään, osa hylätään | Ei kaksinkertaista laskentaa; avoin siirtymä säilyy avoimena |
| GI-01 | Valmiin fermentoidun dosa-taikinan GI ja sen raaka-aineiden GI | Samat hiilihydraatit kohdistuvat vain yhteen komponenttiin |
| GI-02 | Kookosriisipuuron GI tarjotaan suoraan tölkkikookosmaidolle | Vastine hylätään ja annetaan perustelu |
| GI-03 | Leipäverrokin valmistus poikkeaa pannuleivästä | Kysy/merkitse valmistusvastaavuus; älä hyväksy nimiosumaa automaattisesti |
| GI-04 | Sama ihmiskoe esiintyy alkuperäistutkimuksessa ja 2021 katsauksessa | Vain yksi riippumaton havainto |
| GI-05 | GI-luku leipäviitteestä, muut glukoosiasteikolla | Yhteinen glukoosiasteikko ennen laskentaa |
| RANGE-01 | Kaksi nimettyä perunakoostumusta GI 66, annos 125 g | Lasketut osuudet 10,725 ja 16,4175 (mahdolliset näyttörajojen pyöristykset erikseen) |
| RANGE-02 | GI 0/100/150 -stressi | Tuloksen nimi “oletusherkkyys”, ei luottamusväli tai biologinen yläraja |
| RANGE-03 | Skenaario ylittää GK-matalan luokkarajan | Ei pääse varman matalan GK:n suodattimeen |
| PARTIAL-01 | Ketomutakakun 0,07 osatulos ja 1,3774 g CHO avoin | Ei kokonaisen annoksen GK:ta eikä “LOW” -väitettä |
| PARTIAL-02 | Lontong sayurin avoimet 3,40 + 4,97 + 0,70 = 9,07 g | Säilyttää BLOCKED/osatulos-tilan ilman uutta hyväksyttyä soveltuvuutta |
| MIXED-01 | Okayu: mitattu GI-osuus + koodiosuus ja **0 poisjättöä** | #253:n suunnitelman mukainen review-only-reitti käsiteltävissä, ei automaattista julkaisua |
| OMIT-01 | Sama mauste pilkotaan viiteen alle 1 g:n riviin | Kumulatiivinen raja ei kierry |
| OMIT-02 | VHH-reseptissä pieni absoluuttinen mutta suuri suhteellinen avoin osuus | Molemmat vaikutusmittarit; ei vain prosentti- tai kokonaislukutarkastelua |
| USER-01 | Käyttäjä vaihtaa 200 g kuivaa riisiä 200 g kypsäksi riisiksi | Uusi laskelma, oletukset näkyviin |
| USER-02 | Käyttäjä vaihtaa annokset 2 -> 4 muuttamatta erän ainesmääriä | Annos-GK muuttuu oikein, koko erän GK ei muutu |
| USER-03 | Sama kanoninen resepti FI/EN/SV/TH | Sama numeerinen tulos, esitystekstit paikallistettu |
| HASH-01 | Reseptin määrä, valmistus tai lähdesidos muuttuu | Vanha syötetarkiste vanhenee; aiempi hyväksyntä ei siirry |
| HASH-02 | Hyväksytty GI-soveltuvuus haetaan uudestaan samaan valmistukseen | Ei toista lähdetutkimusta, mutta uusi reseptin tulostarkiste |
| RELEASE-01 | Henkilökohtainen resepti saa automaattisen GK:n | Ei kirjoita julkiseen Git-rekisteriin eikä ohita Approval Factorya |
| RELEASE-02 | Tutkimusannoksen GK tiedetään mutta kotiohje eroaa | Tutkimusannos erotetaan selvästi; kotiohjeen kokonais-GK ei synny itsestään |

## Hyväksynnän minimisääntö

1. Kirjoita ennen koodia täsmällinen nykyinen tulos ja sen oletettu uusi tila.
2. Aja vain muuttuneeseen sääntöön liittyvät yksikkö-/integraatiotestit. Laajempaa auditointia tarvitaan, jos semantiikka muuttaa julkaistuja tuloksia.
3. **Julkaistujen nykyarvojen regressiotarkistus**: vertaa saman lähde-/syötetarkisteen GK:ta ennen/jälkeen; erot esitetään yksilöitynä, eivät kadotettuna keskiarvoon.
4. Tarkista erikseen numeerinen tulos, tietosisältö, kieliversiot, suodattimet ja lähdeviite vain niissä kohdissa, joihin toteutus vaikuttaa.
5. Katkaise julkaisu, jos osatulos muuttuu kokonaisarvoksi ilman uutta hyväksyntää, jos lähderaja muuttuu hiljaisesti, tai jos pyöristys tuottaa perusteettoman “matalan GK:n”.

## Kattavuus- ja laadun mittarit

Älä optimoi vain yksi “numeroinen resepti” -lukua. Erota raportissa vähintään seuraavat:

- **OriginalNumeric:** kuinka monella alkuperäisellä reseptiohjeella on hyväksytty numeerinen GK.
- **AnyVersionNumeric:** kuinka monella reseptillä on vähintään yksi hyväksytty laskettu täsmäversio. Vasta tämä on nykyinen 235/326-kattavuustyyppinen mittari.
- **WholeMealComplete:** kuinka monesta annoksesta on kokonainen laskettu arvio tai nimetyt kokonaiset skenaariot.
- **PartialOnly:** kuinka monella on vain laskettu osuus ja olennainen avoin vaikutus.
- **NeedsClarification:** määrä-/valmistus-/tuotevalinta, johon käyttäjä voi vastata.
- **BlockedMaterialEvidence:** olennainen lähdeaukko, jonka vaikutusta ei ole arvioitu luotettavasti.
- **ReusableApplicability:** kuinka monta valmistus-/tuotevastinetta on kuratoitu ja montako kertaa niitä on käytetty hyväksytysti uudelleen.
- **HumanDecisionQueue:** montako omistajan sisältöpäätöstä on avoinna; erotettava julkaisulupajonosta.

80 % on vähintään 261/326. Kun lähtötaso on 235/326, numeerisesti katettavia puuttuu 26, mutta mitään korjauspakettia ei saa väittää kattavuuden kasvuksi ennen julkaisua.

## Resource Economy -rajat

Dokumentaatiolle yksi PR ja tavallinen docs-lint. Yksittäisten syötesääntöjen testit pidetään kohdennettuina; koko 326:n uudelleenlaskenta vasta silloin, kun se todella voi vaikuttaa kaikkiin tuloksiin. Pysäytys/estot raportoidaan reseptikohtaisesti, mutta 30:n reseptin erä jatkuu muiden reseptien osalta ilman raporttien paisumista tai uutta CI-kierrosta jokaisesta pienestä havainnosta.

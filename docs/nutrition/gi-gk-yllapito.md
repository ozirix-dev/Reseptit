# GI/GK-ylläpitäjän työohje

GI-rekisteri ja GK:n hyväksynnät ylläpidetään Gitissä. SQLite on paikallinen,
uudelleen rakennettava hakemisto. Julkisen sivuston laskenta käyttää nykyisiä
syötteitä ja portteja. Ylläpitohaun tulos ei anna lupaa julkaista arvoa.

## Kertakäyttöönotto

Valitse katselmoitava revisio puhtaaseen työpuuhun. Asenna `site/`-hakemistossa
riippuvuudet komennolla `npm ci`. Aja seuraavat komennot reposta käsin.
`capture` suorittaa nykyiset sisältö-, ravinto- ja GK-ajot. Tietueesta
näkyvä revisio on juuri tämän ajon revisio. Uusi capture tarvitaan, jos
revisio vaihtuu. Haku hylkää vanhentuneen tai vaurioituneen paketin.

```powershell
python -B site/scripts/gi_sqlite_evidence.py --maintainer inventory
python -B site/scripts/gi_sqlite_evidence.py --maintainer capture
python -B site/scripts/gi_sqlite_evidence.py --maintainer cases
```

## Kolme tavallista tehtävää

| Kysymys | Komennon valinnat | Mitä tarkistaa |
| --- | --- | --- |
| Mistä mitattu tai raportoitu GI on peräisin? | `--maintainer source --id whole-tomato-raw-gi-22` | Tarkista julkaisun URL, kohta, valmistustapa, asteikko ja havainnon tyyppi. Analogian soveltuvuus kuuluu reseptipäätökseen. |
| Mihin resepteihin GI-tietueen muutos voi vaikuttaa? | `--maintainer impact --id whole-tomato-raw-gi-22` | Erota tallennettu laskentasyöte, auditin käyttämä viite ja julkaistun alkuperäisen reseptin viite. Haku käsittelee täsmällistä vanhaa tunnistetta. Hae samaan havaintoon sidotut muut vanhat tunnisteet erikseen. Variantit, joista puuttuu GI-tunniste, edellyttävät käsin jäljitystä. |
| Onko laskenta nimenomaan tämä julkaistu versio? | `--maintainer approval --id keto-mutakakku` | Erota alkuperäinen laskenta ja erillinen variantti, tarkista syöte- ja evidenssitiivisteet. `PUBLISHED_CHECK_RELEASE_PATH` ohjaa selvittämään julkaisupolun, koska perussidoksen tarkka vastaavuus ei yksin selitä julkaisua. |

Lisää komentovalinnat komennon `python -B site/scripts/gi_sqlite_evidence.py`
perään. `--format text` tuottaa taulukon sijaan luettavat rivit.
JSON on oletus. Jatka samassa revisiossa tarvittaessa tuloksen `next`-arvolla
ja valinnalla `--after`. Sivun oletuskoko on 50 ja enimmäiskoko 100.

Tomaattiesimerkissä kaksi vanhaa sovellustunnistetta osoittaa samaan
raportoituun lähdearvoon. Tämä koe ei varmista kaikille GI-tietueille
riippumattoman alkuperäistutkimuksen identiteettiä. Puuttuva arvo ei ole nolla,
ja näyttökelvottomat viitteet säilytetään jäljitettävinä.

## Paikallinen vienti ja D1-pilotti

```powershell
python -B site/scripts/gi_sqlite_evidence.py --maintainer benchmark
python -B site/scripts/gi_sqlite_evidence.py --maintainer export
```

Oletushakemisto on `tmp/gi-gk/`. Vienti tekee `d1-preview/`-kansioon
SQL-skeeman, passiivisen tuonnin ja manifestin. Komento palauttaa SQL:n
paikallisesti ja toistaa tuonnin. Vienti käyttää näytteessä omia tunnisteita,
koska vanhat tunnisteet sisältävät GI-arvoja. Näytteessä säilyvät lähdelinkit
ja julkaistun variantin GK-arvo. GI-arvot ja lähdeotteiden paikantimet jäävät
paikalliseen aineistoon. Pidä hakemisto versionhallinnan ja sivuston buildin ulkopuolella.

Mahdollisen pilottikannan nimi on `recipavo-gi-gk-preview` ja sen jurisdiktio
on EU. Ennen pilveä hyväksytään tarkka paketti, kenttien käyttöoikeudet, rajattu
tuontitunnus, erillinen lukukäyttö, kustannuskatto ja palautuspolku. Käytä
pilotissa erillistä projektia tai tunnuksia, joilla ei ole pääsyä Recipavon
tuotantokatalogiin. Mittaa SQL-aika, kokonaisvaste ja luetut rivit erikseen.
`schema.sql` sisältää aktiivisen version osoittimen; version vaihto kirjataan
erilliseksi operaatioksi. Nykytilan vertailut ja tiedostojen omistajat löytyvät
[GI/GK-auditoinnista #533](https://github.com/ozirix-dev/Reseptit/pull/533).

# GI-lähdehaun tulos: 10 reseptin pilotti

Päivitetty 24.10.2026. Haku rajattiin Fineli-pilotin kymmeneen aamiais- ja vähähiilihydraattiseen reseptiin. Fineliä käytetään imeytyvän hiilihydraatin määrän lähteenä; GI-arvot täsmäytetään erillisistä lähteistä ruoka-aineen ja valmistustavan mukaan.

## Tarvitaanko muita GI-taulukoita?

Ei tämän kymmenen reseptin pilotin tämänhetkiseen lähdehakuun. Vuoden 2021 International Tables on kattava yleiskoonti ja jakaa ISO-menetelmän kriteerit täyttävät tietueet heikommista tietueista. Sydneyn yliopiston tietokanta auttaa hakemaan ja tarkistamaan ruoka-ainekohtaisia kirjauksia. Non-western-koonti tuo mukaan alueellisia ruokia, ja sen 940 tietueen taulukko on saatavilla CC BY 4.0 -lisenssillä. Vuoden 2002 taulukkoa käytettiin vain selittämään vähähiilihydraattisten ruoka-aineiden, kuten kananmunan, juuston, avokadon ja salaattivihannesten, puuttumista GI-taulukoista.

Laajemman taulukon lisääminen ei ratkaise nyt tunnistettua aukkoa: tortilla de patatas -reseptin peruna kypsennetään hitaasti öljyssä kannen alla ja asetetaan kananmunaseoksessa pannulla. Löydetyt mitatut arvot koskevat keitettyä, höyrytettyä, yleisesti kypsennettyä, sipsiksi paistettua tai eri tavalla paistettua perunaa. Niitä ei täsmäytetä tortillan valmistukseen. Tarvittava lisänäyttö olisi tämän reseptin valmistustapaa vastaava, riittävästi dokumentoitu GI-tutkimus tai suoraan valmiilla tortillalla tehty mittaus.

ISO 26642:2010 asettaa GI-mittauksen soveltuvuuden alarajaksi 10 g imeytyvää hiilihydraattia tavanomaisessa annoksessa ja määrittelee GI:n mitatulle ruoalle. Se ei tee komponenttien summasta valmiin sekalaisen aterian mitattua GI:tä. Pilotti pitää siksi ainesosien painotetun summan nimettynä laskennallisena GL-arviona. Nykyisen Fineli-syötteen 40 hiilihydraattia sisältävästä ainesosatapahtumasta 39 sisältää annosta kohti alle 10 g; tortilla-peruna on ainoa rajan ylittävä tapahtuma. Tämä raja selittää, miksi useille vähähiilihydraattisille aineksille ei ole GI-tietuetta, mutta niiden hiilihydraatteja ei lasketa nollaksi.

Vuoden 2021 International Tables -koonnin Supplemental Table 1 sisältää luotettavimmat, ISO-menetelmän kanssa yhtenevät arvot; Supplemental Table 2 on täydentävä laatuluokka. Koonti jättää sekalaiset ateriat pois. Löytynyt vuoden 2016 paistetun perunan tutkimus raportoi kahden lajikkeen arvot, mutta tutkimuksessa oli kahdeksan osallistujaa, joten se ei täytä koonnin vahvan laatuluokan vähintään kymmenen osallistujan rajaa. Tutkimus ei myöskään vastaa tortillan kypsennystä. Tietueet säilyvät sisäisessä lähdekatalogissa vain ehdokkaina.

## Lataus ja muunnos

Non-western-koonnin artikkelin täysteksti haettiin Europe PMC:n JATS XML -rajapinnasta. Table 1 poimittiin Pythonin vakiokirjastolla UTF-8 CSV-muotoon hakua varten; lähdeviitteet yhdistettiin artikkelin viitelistasta. Aineistossa on 940 riviä. Alkuperäinen XML, muunnettu CSV ja metatiedot ovat paikallisessa, gitignore-säännön suojaamassa hakemistossa:

- `tmp/nutrition/source-cache/nonwestern-gi-compendium-2021.xml`
- `tmp/nutrition/source-cache/nonwestern-gi-table1-2021.csv`
- `tmp/nutrition/source-cache/nonwestern-gi-table1-2021.metadata.json`

Alkuperäisen XML:n SHA-256: `4e884fc1db405be6a3f8c40b08bd474dd6d74d4149b2e8aebfba488d047c05f9`.

Koko International Tables -taulukoita ei kopioida projektiin. Tallennamme vain pilotin tarvitsemat arvot ja lähdeviitteet; 2021-artikkeli kertoo saatavilla olevien tietojen käytön edellyttävän yhteydenottoa kirjoittajiin muussa kuin kaupallisessa tarkoituksessa.

## Haetut ja käytetyt lähteet

- Atkinson et al. *International tables of glycemic index and glycemic load values 2021: a systematic review*. [DOI: 10.1093/ajcn/nqab233](https://doi.org/10.1093/ajcn/nqab233).
- Henry et al. *A glycaemic index compendium of non-western foods*. [DOI: 10.1038/s41387-020-00145-w](https://doi.org/10.1038/s41387-020-00145-w). CC BY 4.0.
- University of Sydney, [GI Search](https://glycemicindex.com/gi-search/).
- ISO, [ISO 26642:2010](https://committee.iso.org/standard/43633.html), GI-menetelmä.
- Foster-Powell et al. *International table of glycemic index and glycemic load values: 2002*. [DOI: 10.1093/ajcn/76.1.5](https://doi.org/10.1093/ajcn/76.1.5).
- Chryssanthopoulos et al. *Glycemic Index of Two Different Fried Potato Varieties Cultivated Under Organic Fertilization Conditions* (2016). [DOI: 10.12944/CRNFSJ.4.1.02](https://doi.org/10.12944/CRNFSJ.4.1.02).

## Päätös

Pilotin kymmenelle reseptille ei lisätä yleisiä GI-taulukoita. Kaikki kymmenen käsitellään joko riittävästi lähteistetyllä, täsmäävällä laskelmalla tai keskeneräisenä puuttuvan tiedon vuoksi. Tämän haun perusteella yhtään julkiseen laskelmaan hyväksyttävää uutta täsmäystä ei löytynyt.

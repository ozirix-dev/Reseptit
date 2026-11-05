# AFCD:n kolme saatavan hiilihydraatin kenttäkorjausta

Nyky-mainin sovitus PR:stä #182, pohja `081ba2c95f9243c1ed72206073160f9e64992e96`. Käyttäjä antoi tässä Codex-istunnossa luvan valmistella juuri tämän numeerisen korjauksen Draftiin. Lupa ei sisällä mergeä tai deployta.

| AFCD-tietue | EU_AVAILABLE ennen → jälkeen g/100 g | Vaikutus |
| --- | --- | --- |
| F006573, persikka | 8 → 7,7 | Ricotta-persikkakulhon piste 4,08 → 3,97; näyttö noin 4 ja LOW-luokka säilyvät |
| F007619, vadelma | 7 → 6,9 | Pellavapuuron vadelman osuus korjaantuu; kokonais-GK pysyy pidossa |
| F002384, juuriselleri | 5 → 2,8 | Ei aktiivista GK-reseptiriippuvuutta |

Lähde on FSANZ:n [AFCD Release 3 – Nutrient profiles](https://www.foodstandards.gov.au/sites/default/files/2025-12/AFCD%20Release%203%20-%20Nutrient%20profiles.xlsx), välilehti All solids & liquids per 100 g. AM sisältää saatavan hiilihydraatin ilman sokerialkoholeja; AN sisältää ne. Rivikoordinaatit 678, 712 ja 1425 sekä työkirjan SHA-256 ovat `before.json`-tiedostossa. Tekijä FSANZ, lisenssi CC BY-SA 3.0 Australia. Kolmen kentän korjaus on Reseptit-projektin sovitus.

`verify_source.py` tarkistaa paikallisesta alkuperäisestä työkirjasta sen SHA:n, tietue-ID:t ja molemmat sarakkeet. Riippumaton Decimal-laskenta vahvistaa persikkakulhon 4,0836 → 3,96885, muutos −0,11475. Tässä sovituksessa tarkistus toistettiin jo ladatulla, tarkisteeseen sidotulla työkirjalla.

Muuttuvat vain kolme CHO-kenttää ja kahden reseptin evidenssisidokset. Polyolikentät ja polyolsSourceVerified-väitteet eivät muutu. With−without-erotus ei todista kokonaispolyolien kattavuutta; #181:n laajempi kysymys säilyy erillisenä. Kaikkien 326 makropaketin ja 87 hyväksytyn GK-version luvut ja sinetit säilyvät.

Viiden version koko tiedoston lähdesinetin täsmällinen yhteensopivuus, nykytilan regressio ja muiden vanhojen PR:ien päätökset on kuvattu [sovituksen yhteisessä muistiossa](../gk-legacy-reconciliation/README.md).

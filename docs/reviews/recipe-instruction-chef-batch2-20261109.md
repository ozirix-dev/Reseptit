# Kokkikorjaukset, erä 2 — vain valmistusohjeet

Päiväys: 2026-11-09. Lähtöhaara: `main`. Ei muutoksia #359:n tiedostoihin, käännöksiin tai ainesosatietoihin.

## Korjattu

| Resepti | Mikä oli vialla | Mitä tehtiin | Ravintotiedot |
| --- | --- | --- | --- |
| `indonesialainen-serabi-kookospannukakku` | Geneeriset ohjeet ehdollisille palkokasveille ja viljoille olivat ennen varsinaista serabi-ohjetta. Riisijauhotaikinan vaiheet toistuivat. | Korvattu neljällä johdonmukaisella vaiheella: kookosmaitotaikina, lepo, rauhallinen paisto, luettelon 30 g fariinisokeria loppuun. | Ainesosat ja määrät ennallaan |
| `malesialainen-apam-balik` | Kolme geneeristä vaihetta ja niiden jälkeen toinen, toistuva valmistusohje. | Kirjoitettu lettutaikinan, rouhitun maapähkinän, maissin ja sokerin täyttövaiheet selkeästi. Ei lisätty puuttuvaa leivinjauhetta tai leivontanestettä. | Ainesosat ja määrät ennallaan |

**Molemmat reseptit:** julkaistut FI-lähteet. Main-haarassa ei löydy samannimisiä EN/SV/TH-käännöstiedostoja. Samaistamista perinteiseen, kohotettuun leipomotuotteeseen ei väitetä: ohje vastaa nykyistä ainesosaluetteloa.

## Jätetty HOLD-arvioon

- `pohjoisafrikkalainen-bissara`: keitto-ohje käyttää listan ulkopuolista lientä ja nuudeleita, vaikka listassa on kuivia härkäpapuja ja 700 ml vettä. Metatiedon 25 min ei riitä kuivien papujen käsittelyyn tai keittämiseen. Tarvitaan paputyypin ja käsittelyn varmistus sekä uskottava kokonaisaika. Ei pidä korjata vain piilottamalla valmistusongelma.
- `kiinalainen-jianbing-munaletty`: valmistus vaatii veteen sekoitettavan jauhotahnan, mutta vettä ei ole listassa. Punnittu määrä ja ravintoevidenssin vaikutus tulee hyväksyä ennen korjaamista.
- `japanilainen-yaki-onigiri-misolla`: 150 g misoa ja 150 g noria 100 g riisiin on suhteellisesti epäuskottava. Ei korjata pelkällä tekstillä.
- `indialainen-poha-maapahkinoilla`: julkaistut käännökset ja lähteen synkronointi edellyttävät yhteismuutoksen.

## Hyväksymisrajat

1. Ei uusia ruokaan jääviä ainesosia, rasvoja, sokeria eikä lisukkeita.
2. `ingredients`, `servings`, `time_total_min`, ravintoarvot, GI/GK-viitteet ja kuvat pysyvät täsmälleen ennallaan.
3. Reseptin tunnistettava rakenne säilyy: serabi on kookos-riisijauhopannukakku; apam balik on täytetty maapähkinä-maissilettu.
4. Ei väitetä fyysistä koepaistoa tai hyväksytä historiallisia GI/GK-sidoksia uudelleen.
5. Ennen mergeä CI, lähdesidosten tarkistus ja mahdollinen uuden käännöstyön päällekkäisyys tarkistettava.

## GK100-katselmointi

Serabin hyväksytty GK100-arvio koskee ohutta pannulla paistettua riisi-kookoslettua. Korjattu kotiohje tekee pieniä paksuhkoja pannukakkuja. Apam balikin hyväksytty arvio koskee ohutta vehnälettua, jossa on erikseen kypsennetty ja valutettu maissi. Korjattu kotiohje tekee paksun täytetyn letun ja kypsentää taitetun letun kannen alla.

Kummankin kotiohjeen GK jää määrittämättä. Sivuston erilliset ohuen letun GK100-versiot säilyttävät hyväksytyt ohjeensa, määränsä, lukunsa ja rajauksensa. Vain tarkalleen katselmoidusta uudesta kotiohjeesta palautetaan vanha lähdeteksti hyväksyntäpaketin tarkistukseen. Hyväksyntäpaketin oma tarkiste varmistaa palautetun tekstin, ja muu lähdemuutos tarvitsee uuden katselmoinnin.

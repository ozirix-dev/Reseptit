# Yhteinen menetelmäpäätös omistajalle – PR #140

Tila: OWNER_APPROVAL_REQUIRED. Viisi katselmointilöydöstä on käsitelty.
COMMENT 5717723908 ei ole hyväksyntä eikä tämä korjaus anna julkaisulupaa.

| Kysymys | Tutkimuksen havainto | Projektin sovellus ja rajaus |
|---|---|---|
| Kasvikset GI 40 | Atkinson 2008 julkaisi vähähiilihydraattisten kasvisten koodausoletuksen, ei näiden kasvisten GI-mittauksia. | Nimetyt ei-tärkkelyspitoiset kasvikset ja yrtit, punnittu syötävä määrä. Ei perunaa, jauhoa, hedelmää tai tuntematonta kastiketta. |
| Riisipuuro GI 80 | Atkinson 2021 rivi 659: jasmiiniriisipuuro, höyrytys 40 min. | Chao ga ja bubur haudutetaan 40 min, ei höyrytetä. Tämä valmistusanalogia on LOW. Ei kaikkiin riisilajeihin tai tavalliseen keitettyyn riisiin. |
| Riisinuudeli GI 61 | Rivi 1463: Thai World, kuiva riisinuudeli keitettynä. | Hu tieu käyttää kuivaa keitettävää riisinuudelia pakkauksen keittoajalla. Yleinen koostumus on erillinen vertailutieto. Ei tuoretta nuudelia, riisipaperia tai mungpapunuudelia. |
| Kaurahiutale GI 76 | Rivi 436: Elovena 0,5–0,6 mm, keitto 10 min. | Sama hiutalepaksuus ja keittoaika; maito, hunaja ja syötävä minttu lasketaan erikseen. Ei pikakauraa tai siivilöityä minttuhauduketta. |
| Tuotevalinnat | GI-näyttö ei mittaa koko reseptiä eikä yleinen koostumustietue todista tietyn merkin ravintosisältöä. | Kaikki määrät ja tuotemuodot sidotaan versiohashiin. Ei lisukehyvityksiä, pois jätettyjä CHO-osuuksia tai rasvan GI-alennusta. |

Kaikki neljä ovat mallinnettuja pisteitä, LOW-luottamus. Numeerista biologista
epävarmuusväliä ei tunneta. SEM ei ole reseptin skenaarioalue. Lähteet ja
ainesosakohtaiset sovellukset ovat sources.json- ja recipes.json-tiedostoissa.

## Toimituksellinen identiteetti

Vicky Phamin chao ga -kuvaus tukee kanan, riisin ja aromaattien muodostamaa
ydintä. Marvellinan bubur ayam -reseptissä jasmiiniriisi ja kana muodostavat
perustan, inkivääri ja kevätsipuli ovat mahdollisia lisukkeita. Tämä tukee
kahta nimettyä yksinkertaista perusversiota; ne eivät edusta kaikkia paikallisia
versioita. Meidän kana kypsyy veteen jääväksi liemeksi. Emme väitä kopioivamme
kummankaan lähteen ainesmääriä tai kaikkia valmistusvaiheita.

Identtinen ainespohja saa identtiset ravintoarvot ja GK:n. Eroa ei keksitty.
ID:t pysyvät erillisinä. Chao ga -otsikko täsmentyy perusversioksi.
Minttuvariantin otsikko ja näkyvä muistiinpano yksilöivät syötävät lehdet.
Vakaa vanha slug säilyy, eikä redirectiä tarvita. Siivilöity vaihtoehto säilyy
muistiinpanoissa ilman GK-lukua.

Lähteet:

- [Vicky Pham, Chao ga](https://vickypham.com/blog/vietnamese-chicken-porridge-chao-ga/)
- [Marvellina, Bubur ayam](https://whattocooktoday.com/chicken-porridge.html)
- [Atkinson 2008](https://doi.org/10.2337/dc08-1239)
- [Atkinson 2021](https://doi.org/10.1093/ajcn/nqab233)

## Yksi hyväksyntäkysymys

Hyväksytäänkö nämä rajatut GI-sovellukset ja neljä täsmennettyä reseptiversiota
seuraavaan julkaisuvaiheeseen? Kyllä / Ei. Ei mergeä tai deployta tässä ajossa.

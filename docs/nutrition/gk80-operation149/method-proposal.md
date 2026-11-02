# Operaatio 149 V2: rajattu GK-julkaisusopimus

Tila: **EHDOTUS – OMISTAJAN MENETELMÄHYVÄKSYNTÄ PUUTTUU**.
Lähtö-main: `4a804757d5f9732938928dcba8f79ea0674ad98c`.
Tuotannosta tarkistettu lähtökattavuus: 156/326.

## Päätösesitys

Otetaan myöhemmällä erillisellä hyväksynnällä käyttöön kolme erillistä tietotyyppiä.
Tämä Draft toteuttaa vain paikallisen pilotin. Tuotannon importteja, rekistereitä,
reseptiversioita, makroja ja olemassa olevia GK-tuloksia ei muuteta.

| Taso | Hyväksymisen peruste | Näyttöehdotus | Numeerinen kattavuus |
| --- | --- | --- | --- |
| A | Nykyinen hyväksytty laskentamoottori, samat lähde-, vastaavuus- ja poisjättösäännöt | GK ≈ 8 · laskettu arvio | Kyllä |
| B | Erillinen lähde- ja valmistusanalogia tai dokumentoitu koostumusväli; kaikki merkittävät hiilihydraattiosuudet käsitelty | GK-arvio ≈ 8 tai GK-arvio 5–10 · mallinnettu | Kyllä, vasta uuden sopimuksen hyväksymisen jälkeen |
| C | Perusteltu luokka-analyysi ilman hyväksyttävää kokonaisnumeroa | GK-arvio: matala | Ei |

Mikään taso ei tarkoita mitattua valmiin ruoan vastetta. Nykyisten A-tulosten
merkitystä, arvoja, pyöristystä tai makropakettien tiloja ei vaihdeta.

## GK-only-profiili

GK:n tarvitsema saatava hiilihydraatti todennetaan omasta lähdekentästään.
Fineli CHOAVL ja AFCD:n *without sugar alcohols* voivat tukea GK:ta, vaikka
kokonaispolyolit puuttuvat. Natiivi-ID, kenttä, määritelmä ja reseptivastaavuus
sidotaan erikseen. Vanhan tietueen `EU_AVAILABLE`-enum ei yksin riitä näytöksi.

Makrojen tuntematonta polyolia ei täytetä nollaksi eikä vanhoja pidätyksiä pureta.
Makroihin ei kirjoiteta mitään pilotin tuloksesta. Uusi GK-only-julkaisuprofiili
vaatii omistajan nimenomaisen hyväksynnän; myös A-aritmetiikalla toimiva uusi
GK-only-tapaus jää tämän sopimuksen taakse. A- ja B-numerot eivät hyväksy
vanhaa makropakettia uudelle reseptiversiolle.

Tuote-, massa- tai alkuperäisen vaihtoehdon vakiointi on oma versioehdotus.
Pilotin vakioitu syöte sidotaan nykyiseen reseptiin ja kaikki poikkeamat näytetään.
Mahdollinen julkaisu vaatii tarkalle versiolle sisältöpäätöksen ja makrojen
versioyhteensopivuuden tarkistuksen. Vanhoja makroja ei saa periä muuttuneelle
versiolle vain siksi, että niiden numerot säilyivät tiedostossa.

## B: mitä luvulla ja välillä tarkoitetaan

1. **Nimetty lähdeanalogia:** yksilöity julkaistu vertailuruoka, glukoosiasteikko,
   alkuperäinen valmistus ja kohdereseptin valmistus. Vastaavuus perustellaan
   ruokalajin/raaka-aineen, jauhatuksen, kuiva/kypsä-tilan, lämpökäsittelyn,
   lisättyjen hiilihydraattien ja nautittavan osuuden kannalta. Merkittävät
   erot ja kvantifioimaton analogiavirhe näytetään. Ruokaperheen yleinen
   keskiarvo ei ole riittävä ainesosan tai valmiin ruoan GI-lähde.
2. **Lähdevertailujen malliväli:** päätepisteet tulevat nimetyistä soveltuvista
   havainnoista tai lähteeltä perustelluista koostumusrajoista. Se kuvaa
   nimettyjen lähdeskenaarioiden eroa, ei kaikkien ruokaversioiden tai ihmisten
   vasteen varmoja rajoja. SEM/CI-lukuja ei muuteta reseptin vaihteluväliksi.
3. **Oletusherkkyys:** esimerkiksi tuntemattoman GI:n 0–100/0–150 koe on
   erillinen `SENSITIVITY_ONLY`. Se ei täytä B-julkaisuehdokkaan lähdeporttia,
   eikä sen ylärajaa kutsuta biologiseksi rajaksi.
4. **Julkaistu koodaus:** vanhojen kasvi 40-, eläinmaito 30- ja nimettyjen
   vähähiilihydraattisten ruokien 50-koodausten soveltamisala säilyy näkyvissä.
   Projektin pieniainesten 50-laajennus merkitään projektin oletukseksi,
   ei näiden mausteiden mitatuksi GI:ksi tai suoraan julkaisussa osoitetuksi
   ruokakohtaiseksi tulokseksi. Sitä ei laajenneta jauhoihin tai suuriin annoksiin.

### Erikseen hyväksyttävä B-koodaus, ei uusi GI-mittaus

Pilotti saa ehdottaa koodausta 50 **nimetylle makeuttamattomalle kasvipohjaiselle
maitoemulsiolle/juomalle**, kun riippumaton lähde osoittaa saatavan CHO:n
enintään 5 g/100 g. Se on julkaistun vähän hiilihydraattia sisältävien ruokien
koodausperiaatteen uusi projektikohtainen sovellus. Se ei käytä kookos-riisipuuron
GI31:tä kookosmaidolle, ei eläinmaidon 30:tä kasvimaitoihin eikä väitä kookosmaidon
mitattua GI:tä 50:ksi. Tämä soveltamisalan lisäys kuuluu B:hen, ei vanhaan A:han.

Toinen B-päätös koskee **nimettyjä pieniä mauste-/aromi-/siemenkoristeaineksia**: enintään 0,5 g
saatavaa CHO:ta/ainesosa ja yhteensä enintään 1 g/annos voidaan sisällyttää
nimellisellä vertailukoodilla 50 ja näyttää sen oletusherkkyys erikseen.
Merkittävää tuntematonta GI-ainesosaa ei saa täyttää tällä koodilla. Tuntematon
nautittu osuus pysyy lähteistettynä fysikaalisena syötemäärävälinä; mitään
uutettua prosenttiosuutta ei keksitä. Koodi ei tee mausteen GI:stä tunnettua.

Näissä B-tuloksissa **GI-oletuksen epävarmuus ei ole lähteellä rajattu**.
Numeerinen piste on nimetyn toimituksellisen mallin viitearvio. Mahdollinen
GI 0–150-herkkyys näkyy erillisenä kokeena; sitä ei esitetä lähteistettynä
GK-vaihteluvälinä, biologisena ylärajana tai hyväksynnän todisteena.
Pääasiallinen epävarmuus ja koodatun osuuden CHO/GK-vaikutus näytetään.
Jos omistaja ei hyväksy tätä nimenomaista B-sopimusta, siihen perustuvat
ehdokkaat pysyvät HOLDissa eikä niitä lasketa hyväksyttyyn kattavuuteen.

B ei jätä positiivista tuntematonta GI-osuutta automaattisesti pois. Se tarvitsee
hyväksyttävän lähdeanalogian/koodauksen, käsitellyn epävarmuuden tai jää ilman
julkaisukelpoista kokonaisnumeroa. A:n alle 1 g/ainesosa ja alle 2 g/annos säilyvät
täsmälleen entisinä; B:n onnistuminen ei muuta näitä vakioita.

## Pilotti ja hyväksyntäportti

- Koneellinen luokittelu kattaa kaikki 170 nykyistä puuttuvaa tapausta.
- Ensimmäiseen erään valitaan 40–70 lupaavinta. Vähintään 30 on tavoite,
  ei lupa täyttää puuttuvaa lähdettä tai hyväksyä sopimatonta vertailua.
- Jokainen numero sidotaan resepti-, syöte-, lähde- ja menetelmähashiin.
- Vain lähdeportin läpäisevät A/B-ehdokkaat lasketaan 30:n tavoitteeseen.
- Tuotantosopimuksen hyväksyntä on oletuksena false. Pilottikoodi ei ole
  tuotannon tuontiketjussa, eikä pilottikomennolla ole aktivointitoimintoa.
- Koonti erottaa vanhat 156, uudet A:t, hyväksyntää odottavat B:t, C:t ja puuttuvat.
- Yksi toteutus-Draft. Ei Readyä, mergeä, deployta, makropidätyksiä tai
  Nutrition Core-/Cloudflare-toteutusta tässä toimeksiannossa.

Omistajalta tarvittava päätös on GK-only-profiilin ja B:n nimettyjen
vastaavuus-/epävarmuustyyppien hyväksyntä sekä erän täsmälliset reseptiversiot.
Pelkkä menetelmäpäätös ei hyväksy virheellistä lähdettä tai jokaista analogiaa.

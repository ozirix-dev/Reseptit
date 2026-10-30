# GK-80 AJO 5 – menetelmäsopimus

Tila DRAFT, omistajan hyväksyntä odottaa. Jokainen määrä määrittää ehdotetun
punnitun syötävän version; vanhoja kappale-/lusikkamääriä ei väitetä fyysisesti
mitatuiksi. Alkuperäiset reseptit ja nykyinen 83/326-tuotanto eivät muutu
tutkimushaarassa. Julkaisuhaaroissa on vain erikseen nimetyt12 reseptiä.

GK = summa(imeytyvä CHO/annos × sovellettu GI /100). Kaikki syötävät ainekset
mukana. Puuttuva GI, massa tai koostumus ei muutu nollaksi. Kaikki ainesosat,
neljä ravintoarvomakroa, kuitu, lähde- ja syötehashit sekä valmistus on talletettu.
Uusien26 tulokset ovat pistearvioita; yhtään SEM/SD-väliä ei rakennettu.

## Ruokaperhe ja valmistus

Yhteinen food-safety-moduuli käyttää eksakteja tietokannan ruoka-ID:itä ja
katselmoituja valmistusmuodon aliaksia. Nimi tai sen alimerkkijono ei määrää
ruokaperhettä. Uusi ID/valmistus/GI-yhdistelmä vaatii tietueen katalogiin.
Seitsemän väärää sanavastaavuutta testataan oikeilla ruoka-ID:illä. Tämän
lisäksi uusi valmistusteksti, lähdehash tai syötehash vanhentaa laskelman.

Kasvis40 ja makeuttamattoman eläinmaitotuotteen30 ovat Atkinson2008:n julkaistua
koodausta, eivät näiden ainesosien mittauksia. Schakelin default50:n nimetty
soveltaminen, projektin5g/100g raja sekä mauste/siemen/uutteen0,5g CHO/rivi ja
1g yhteensä/annos ovat erillisiä omistajan menetelmäpäätöksiä. Ne eivät ole
fysiologisia virherajoja. Suuri jauho-, tahna- tai siemenannos ei kuulu
automaattisesti pienen mausteannoksen sääntöön.

Ihmis-GI säilyy ihmisnäyttönä, mutta reseptisovellus on nimetty LOW-analogia.
Imputointi ei ole ihmisellä mitattu GI. Riisijauho ei saa jyväriisin GI:tä,
perunatärkkelys ei keitetyn perunan GI:tä eikä kikhernejauho kokonaisen pavun GI:tä.
Lämmin keitetty bulgur, esikeitetty peruna ja kuuma tuore jasmiiniriisi ovat
nimettyjä uusia versioita; arvo ei siirry vanhaan kylmäliotettuun bulguriin,
pitkään öljyssä kypsennettyyn perunaan tai kylmäsäilytettyyn/uudelleen lämmitettyyn riisiin.

## Hiilihydraatin kaksi eri määritystä

Finelin CHOAVL ja AFCD:n ilman sokerialkoholeja raportoitu käytettävä CHO eivät
tarvitse uutta kuitu-/polyolivähennystä. Kokonais-CHO käsitellään erikseen:
Fineli: CHOAVL+kuitu+raportoidut polyolit; AFCD: polyolit sisältävä CHO+kuitu.
USDA SR Legacy -mausteiden käytettävän CHO:n proxy on kokonais-CHO miinus kuitu
kerran. Luontaisten polyolien määrää ei varmennettu eikä sitä ilmoiteta nollaksi.
Maille-etiketin käytettävän CHO:n proxy ei myöskään vahvista polyoleja nollaksi.
Kokonais-CHO tulee USDA:n suorasta kokonaismäärityksestä tai EU-etiketin
polyolit sisältävästä CHO:sta ja kuidusta. Proxy-tulkinta odottaa omistajan
menetelmäpäätöstä; biologista epävarmuusväliä ei tunneta.

Kaikilla26 on julkaisun neljä makroarviota nutritionPerServing-kentässä ja
publication-nutrition.json:ssa; kuitu tukitietona. Julkaisu-Draftien neljä
näytettävää makroa tarkistetaan lisäksi varsinaisella nutrition-evidence-
toteutuksella. Paketin3 shoyun kokonais-CHO6,96g sisältää sienien0,3g
raportoituja polyoleja/annos. Papaijan kokonais-CHO15,115g pyöristyy Decimal
ROUND_HALF_UP -säännöllä15,12g:ksi. GI/GK ei muutu näistä kokonais-CHO-korjauksista.

## Lähteet ja rajat

- [Atkinson2008, julkaistu koodaus ja ruokalajikohtaiset keskiarvot](https://pmc.ncbi.nlm.nih.gov/articles/PMC2584181/).
- [Atkinson2021, nimetyt valmistusvertailut](https://doi.org/10.1093/ajcn/nqab233). Taulukko1 on talletettu ja hashattu aiemmassa ajossa; lähde-SEM ei ole reseptin vaihteluväli.
- [Venn2014, nimetyt kuumat riisit ja sakkaroosi](https://doi.org/10.1186/1475-2891-13-50).
- [Różańska2020, bulgur15min, GI64,5](https://doi.org/10.32394/rpzh.2020.0101). Kahdeksan tervettä vapaaehtoista; SD36,8 ei ole uusi skenaarioalue.
- [Noriega2000, maissitortilla](https://pubmed.ncbi.nlm.nih.gov/10824718/). Rekisterin52,4 on jo glukoosiasteikolle muunnettu; ei toista muunnosta.
- [AFCD:n viralliset lähdeaineistot](https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd). Kohdennettu53 tietueen ×4 makron vertailu viralliseen per100g-taulukkoon; ei nesteiden per100mL-arvojen siirtoa grammoiksi.
- USDA FoodData Central SR Legacy: kolme käytettyä maustetietuetta, raakavastaukset ja SHA256:t primary-usda.json:ssa. Neljäs ladattu garlic powder -tietue ei ole käytössä tässä erässä.
- [EU:n hiilihydraattimääritelmä, liite I(7)](https://www.legislation.gov.uk/eur/2011/1169/annex/I): polyolit sisältyvät etikettihiilihydraattiin, kuitu käsitellään erikseen. Primäärinen XHTML tarkistettiin.
- [Schakel2008](https://doi.org/10.1016/j.jfca.2007.02.004): default50:n lähde; aiemman ajon tekijän diojen12 tarkistus, koko artikkelin lukemista ei väitetä.

Batra1994:n cheela-abstrakti ei yksilöi tämän kikhernejauhoversion tulosta.
Primääripaperin lataus epäonnistui. Maapähkinäpatukan GI14 ei ole tavallisen
maapähkinävoin arvo. Semolinan55/76 ja Uroojin69 eivät ole yleisiä raakajauhon
GI-arvoja. Näistä ei tuotettu keinotekoisia numeerisia ehdotuksia.

Ei insuliinin annosteluohjetta, aterialla mitattua vastetta, fysiologista
virherajaa, mergeä, deployta tai automaattista AJO6:tta.

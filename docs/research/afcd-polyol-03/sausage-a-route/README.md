# Uunimakkara sipuli-sinappipeitteellä

Tutkimusehdokas yhdelle reseptille. Nykyinen A-laskentamoottori antaa neljälle annokselle **GK:n lasketuksi osaksi 0,26 annosta kohti**. Sipulin 0,66 g käytettävissä olevaa hiilihydraattia kerrotaan nykyisellä allium-koodauksella 40. Koodaus on malliarvo. Seitsemän positiivisen poisjätön summa on 1,4763875 g CHO/annos ja suurin yksittäinen poisjättö 0,75 g. Nykyiset tiukat rajat ovat alle 2 g yhteensä ja alle 1 g ainesosaa kohti.

| Ainesosa | Punnittu määrä | Poisjättö g CHO/annos |
| --- | ---: | ---: |
| Makutila Maalaislenkki | 500 g | 0,25 |
| Cheddar | 100 g | 0,025 |
| Keltasipuli | 55 g | 0, mukana GK-laskennassa |
| Maille Dijon FR215 | 32 g | 0,28 |
| Ranskankerma | 100 g | 0,75 |
| Voi | 14 g | 0,028 |
| Paprikajauhe | 2 g | 0,0955 |
| Mustapippuri | 0,5 g | 0,0478875 |

Makutilan valmistajatieto 0,2 g ja Maille FR215:n 3,5 g per 100 g ovat nimellisiä tuotetietoja. Verkkohavainnoista ei ole raakasisältötiivisteitä. Finelin ja AFCD:n koostumuspisteet ovat taulukkoarvoja. Tulos koskee nimettyjä tuotteita ja täsmällistä valmistusta. Alkuperäiset grammamäärät säilyvät. Sipulin ja voin määrät perustuvat Finelin annosmittoihin. Sinappi, paprika ja pippuri määritellään uuteen versioon punnittaviksi. Käytä yhteensä 14 g voita ja tarjoa koko kuorrute ja vuoan nesteet.

[Punnitut syötteet](cases.json) · [Lähteet](sources.json) · [Laskentamoottorin tulos](engine-results.json)

Toista laskenta [nykyisellä A-toistolla](../current-a-cap-route/evaluate-current-a.mts) kopioimalla se työpuun ulkopuolelle ja korvaamalla kolmen aiemman reseptin erilliset kontrollit (lohko alkaen `const reject=` ja päättyen juuri ennen `mkdirSync(out`) rivillä `const controls=[];`. Anna argumenteiksi työpuun juuri, tämän paketin hakemisto, välimuistihakemisto ja työpuun ulkopuolinen tuloshakemisto.

Täsmällinen lähde- ja sisältösovellus odottaa hyväksyntää. Hyväksyttynä ja julkaistuna paketti avaisi yhden GK-tuloksen. Koostumus ei ole sama kuin alkuperäisen yleisen lenkkimakkaraversion, joten julkaisuagentin on tarkistettava tuotteen ja reseptiversion vastaavuus.


# LAUKKA 30, SQLite Evidence Recovery V3

Main `bdc114e8c941b29546436f3c88487c239416b18f`. Nykyisen mainin auditissa on 235 numeerista GK-reseptiä 326:sta. #255:n 91 avoimen reseptin alkuperäistiedostojen ja laskentasyötteiden tarkisteet täsmäsivät. Kaikki #257:n viisi julkaistua versiota sekä muut numeerisen arvion jo saaneet resepti-ID:t poistettiin aktiivisesta erästä.

[Erän työlista](gk100-v3-batch01-worklist.jsonl) sisältää valinnan, aiemmat päätökset, määrät, lähteiden rajaukset ja seuraavat toimet. SQLite V2 käsitteli 30 reseptiä ja 231 ainesosakyselyä yhdessä FTS5-erässä. Tulostallenne näyttää enintään kaksi tekstiosumaa ja kaksi koostumusehdotusta riviä kohti. Täydet tulokset voi toistaa tallennetuista kyselyistä. Aiempi auditoitu sidos säilyttää oman soveltuvuusperustelunsa. Avainosuma ja tekstiosuma vaativat reseptikohtaisen katselmoinnin.

## Omistajan päätökset

| Resepti | GK/annos | Päätöksen rajaus | Tehtaan tila |
| --- | ---: | --- | --- |
| Marjainen chiavanukas | 1,442955–1,6286925 | Uusi makeuttamaton Alpro- ja 7 % jogurttiversio neljälle sekä kaksi raakamarjojen vertailuskenaariota | OWNER_DECISION, [uusi manifesti](gk100-v3-batch01-factory-manifest.json) |
| Intialainen aloo paratha | 39,4788 | 182 g tutkimuksen kontrolliannosta ja vettä | OWNER_DECISION, [#249](https://github.com/ozirix-dev/Reseptit/pull/249) |
| Hyderabadi-kanabiryani | 26 | 253,9 g emiraattilaista ravintolan koeannosta | OWNER_DECISION, [#258](https://github.com/ozirix-dev/Reseptit/pull/258) |
| Indonesialainen nasi goreng | 12,5 | 129 g osterikastikkeella paistettua jasmiiniriisiä koeannoksena | OWNER_DECISION, [#258](https://github.com/ozirix-dev/Reseptit/pull/258) |
| Baozi | 33 | 154,7 g Tanjong Rhun grilliporsashöyrysämpylää koeannoksena | OWNER_DECISION, [#258](https://github.com/ozirix-dev/Reseptit/pull/258) |
| Nasi lemak | 33 | 179,2 g Old Chang Keen koeannosta | OWNER_DECISION, [#258](https://github.com/ozirix-dev/Reseptit/pull/258) |
| Mehevä suklaakakku | 20,5 | 107,2 g kuorrutettua tutkimuskakkua ja vettä | OWNER_DECISION, [#261](https://github.com/ozirix-dev/Reseptit/pull/261) |
| Tangyuan | 30,5 | 115 g keitettyjä Lee Chun -riisipalloja ja vettä | OWNER_DECISION, [#261](https://github.com/ozirix-dev/Reseptit/pull/261) |

Seitsemän koeannosta tarkistettiin uudelleen alkuperäisistä Factory-paketeista. Niiden ehdokas-, resepti-, syöte- ja manifestitarkisteet ovat työlistan otsikkotietueessa. Omistaja päättää kunkin koeannoksen esittämisestä erikseen. Kotireseptit tarvitsevat omat lähdesidoksensa.

## Yhteiset esteet ja seuraavat ratkaisut

| Este | Reseptit ja nykyinen näyttö | Jatko |
| --- | --- | --- |
| Kookosmaito haudutettuna | Massaman, khao soi ja tom kha sisältävät kukin 2,81 g kookosmaidon CHO:ta annosta kohti. Kookos-limekanacurryn vastaava osuus on 4,8 g. Kerala on vanhassa inventaariossa 1,564 g ja #227:n nimetty tuote on erillinen syöte. Lontongin Blue Dragon -versiossa osuus on 3,40 g. Kookosriisipuuron GI 31 koskee eri matriisia. | Nimeä kullekin versiolle tuote ja syöty määrä. Yhteinen tuotteen koostumussidos voidaan tarkistaa kerran. GI:n siirto vaatii oman valmistusperusteen. Nauris, liemi, currytahna, limetti ja kaali jäävät reseptikohtaisiksi. |
| Riisinuudeli ja riisipaperi | Phở bòn nuudeleista tulee 54,4267 g CHO:ta annosta kohti. Gỏi cuốnissa riisipaperien paino puuttuu. | Käsittele phở bòn liemi erikseen. Punnitse gỏi cuônin nimetyt levyt ja sido maapähkinävoi ja hoisin tuotteisiin. |
| Höyrytaikina | Baozille on erillinen 154,7 g:n koeannos. Dim sumin levyt ja sämpylät sekä xiaolongbaon levyt ja hyytelöliemi ovat avoimia. Kiinalaisen munabaon täyte eroaa koeannoksesta. | Punnitse ja nimeä tuotteet. Valitse valmistusvastine täytetylle tai täyttämättömälle yksikölle ja laske täyte vain kerran. |
| Tomatillosalsa | #229:n MASA 4,8 g / 100 g ja KI La Doña 9,3 g / 100 g antavat kummassakin meksikolaisessa reseptissä 3,6 tai 6,975 g CHO:ta annosta kohti 150 g:n erällä kahdelle. | Sama koostumusperuste voidaan käyttää kummassakin nimetyn tuotteen versiossa. Kuumennetun salsan GI, tortillan pehmeneminen ja huevos divorciadosin papusidonta vaativat katselmoinnin. |
| Paistettu taikina | Samosan ihmis-GI 60,4 kuuluu valmiille omanilaiselle samosalle. MIL BRICKin yhden nimellislevyn koostumuksesta saadaan brikille 10,2 g CHO:ta, ja bindaetteokille on aiemmin laskettu kaksi nimettyä skenaariota. | Varmenna samosan ihmisprotokolla ja täytteen vastaavuus. Punnitse brikin levy ja kaprikset ja etsi paistetun kuoren verrokki. Varmista bindaetteokin kuiva-/kypsäperusta sekä itujen ja taikinan verrokit. |

Bánh xèo pysyy **REVIEW_REQUIRED**-tilassa. Aiemman paketin 80 g keitettyä, jäähdytettyä ja valutettua itua tuottaa 0,44 g CHO:ta annosta kohti MEXT 06292:n arvioidulla koostumuksella. Taikinan osuus on 83,588 g saatavaa CHO:ta erässä. Riisidosan GI 76 antaa 31,76344 GK/annos, ja itujen GI 100/150 -stressi lisää 0,44/0,66 GK. Tanin taikina sisälsi vehnää ja uradia ja paistettiin gheessä. Bánh xèon kookosmaito ja rapea rakenne ovat olennaisia eroja, sillä verrokkia sovellettaisiin koko taikinan hiilihydraattiosuuteen. Itujen pieni osuus ei ratkaise tätä näyttöaukkoa. [Aiempi laskenta](https://github.com/ozirix-dev/Reseptit/blob/fa411bf1cb620dfd7db97730cfeb5b6fb5ca738d/docs/nutrition/gk100-banh-xeo-cooked-sprouts-review.md) · [Tan ym.](https://doi.org/10.1017/S0007114518000703)

Uudessa chiavanukasversiossa ratkaistiin kolme inventaarion estettä aiemmasta aineistosta. Vadelman ja metsämustikan GI-soveltuvuus rajattiin raakamarjojen vertailuihin ja valinnainen makeutus poistettiin versiosta. Kolmas uusi GI-soveltuvuussidos on maustamattoman jogurtin ryhmäkeskiarvo. Muiden reseptien koostumuslöydökset jäivät ehdollisiksi, kun valmistus- tai GI-este jäi auki. [Laskenta ja lähdesidokset](gk100-v3-batch01-chiavanukas-review.md)

## Toista erähaku

Aja Python repojuuresta. Kyselyjärjestys on resepti-ID:n mukainen, ja kunkin reseptin ainesosajärjestys säilyy. Git-blobit antavat samat lähdetarkisteet käyttöjärjestelmän rivinvaihdoista riippumatta.

```python
import json, subprocess, sys, tempfile
from pathlib import Path

sys.path.insert(0, "site/scripts")
import gi_sqlite_evidence as evidence

path = Path("docs/nutrition/gk100-v3-batch01-worklist.jsonl")
header, *recipes = map(json.loads, path.read_bytes().splitlines())
requests = [row["request"] for recipe in sorted(recipes, key=lambda r: r["recipeId"])
            for row in recipe["ingredients"]]
with tempfile.TemporaryDirectory() as folder:
    tmp = Path(folder)
    for name in ("glycemic-index-records.json", "food-records.json"):
        (tmp / name).write_bytes(subprocess.check_output(
            ["git", "show", f"{header['main']}:docs/nutrition/{name}"]))
    result = evidence.lookup_gi_batch(
        requests, source=tmp / "glycemic-index-records.json",
        composition=tmp / "food-records.json", destination=tmp / "gi.sqlite")
    for key in ("sourceSha256", "compositionSha256", "requestSha256", "indexSnapshotSha256"):
        assert result[key] == header["sqlite"][key], key
    assert len(result["results"]) == header["sqliteIngredientRequests"] == 231
    assert not result["autoApproved"]
```

Aja uusi Factory-paketti komennolla `npm run --silent gk:approval-check -- check COMMIT ../docs/nutrition/gk100-v3-batch01-factory.json` hakemistossa `site`. Vertaa manifestin SHA:ta tallenteeseen. Mainin Mixed Evidence -päätös on `APPROVE_REVIEW_ONLY`, ja sen SHA vastasi tehtaan lukemaa sääntöversiota. Okayun puuttuvan hyväksynnän regressiokorjaus on erillisessä [#268:ssa](https://github.com/ozirix-dev/Reseptit/pull/268).

Seuraava erä jatkuu työlistan 61 käsittelemättömästä tunnisteesta. Käy ensin läpi nimettyjen kastike- ja taikinatuotteiden määräsidokset. Reaaliaikainen kattavuus ja reseptiversiot tarkistetaan seuraavan mainin auditista.

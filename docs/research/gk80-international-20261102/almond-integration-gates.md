# GK80 · mantelipiirakoiden tekninen luovutus

Tarkastettu main `12cce31acaa1fcaf4516440b58a1f5c30390fdea`. [Kolmen piirakan katselmointipaketti](almond-review-packet.md) on lähde- ja sisältöpäätöksen lähtökohta.

Mainin `site/scripts/gk-next-four.ts` sisältää jo MEXT 05001:n natiivin massapohjaisen CHOAVL-kentän tarkistuksen. Se varmentaa arvon 5,2 sekä työkirjasolut P435 ja O359. Nykyinen lataaja sitoo kuitenkin hyväksyntäkuitit ja laskennan neljään nimettyyn syötteeseen, joista mantelia käyttää rahkapiirakka. Sen hyväksyntä ja tulossinetit eivät kata kolmea uutta piirakkaa. Lähdetietueen tarkistus voidaan käyttää uudelleen erillisessä rajatussa integraatiossa myöhemmin, jos täsmäversiot hyväksytään. [Mainin toteutus](https://github.com/ozirix-dev/Reseptit/blob/12cce31acaa1fcaf4516440b58a1f5c30390fdea/site/scripts/gk-next-four.ts)

## Julkaisijalle päätöksen jälkeen

1. Sido omistajan lähde- ja sisältöpäätös erikseen kuhunkin täsmälliseen syötteeseen. Tutkimuspaketin LF-SHA-256 yksilöi JSON-tiedoston. Tuotannon `inputSha256` lasketaan adapterin hyväksyntämuodon objektista, joten sille tarvitaan erillinen jäljitettävä sidonta.
2. Sido MEXT 05001 vain punnittuun kotijauhatukseen ja varmista jokaisesta lähdekatalogista hyväksytyt koostumus–GI-parit, Foodin-erytritolin natiivikentät sekä vaniljan positiivinen massaraja. Säilytä kullekin piirakalle oma alkuperäinen reseptiversio ja ainesrivijärjestys.
3. Varmenna A-mallilla tarkka laskettu GK-osuus ja poisjättösumma. Käsittele FI/EN/SV/TH erikseen. Ilmaise matala luottamus, laskettu osuus ja kyseisen version valmistusehdot. Varmista julkaisun jälkeen numeeriset reseptitunnisteet.

## Mihin sama mantelilähde riittää

| Muu resepti | Manteli g / annos | MEXTin imeytyvä hh g / annos | Estekartta |
| --- | ---: | ---: | --- |
| VHH-lihapiirakka | 25 | 1,30 | Yksittäisen poisjätön raja ylittyy. |
| VHH-Runebergintortut | 20 | 1,04 | Raja ylittyy myös 120 gramman erällä ja kuudella annoksella. |
| Keto-korvapuustit | 25 | 1,30 | Raja ylittyy. |
| Keto-kauralesesämpylät | 7,5 | 0,39 | Manteli mahtuu yksittäisrajaan. Kauralese yksin tuo 1,6309375 g/annos, ja aiempi leipomokategorian GI 58 on poistettu tästä käytöstä. |

Seulonta käyttää alkuperäisiä reseptimääriä. Se osoittaa, että yhden mantelilähteen uudelleenkäyttö ei yksin avaa neljää lisäreseptiä. Kauralesesämpylöille seuraava vaikuttava lähde on paistetun kauraleseitä sisältävän vastineen ihmis-GI, jonka koostumus sopii tähän vähähiilihydraattiseen taikinaan. [Kauraleseen aiempi lähdekatselmus](https://github.com/ozirix-dev/Reseptit/blob/12cce31acaa1fcaf4516440b58a1f5c30390fdea/docs/nutrition/glycemic-bakery-four-source-review.md)

Vaikutus **0 uutta GK-ehdokasta**. Kolme aiempaa piirakkaversiota ovat yhä katselmoitavana.

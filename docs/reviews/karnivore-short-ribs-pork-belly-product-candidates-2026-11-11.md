# Karnivore: luullisten kylkien ja nahallisen porsaan kyljen lähde-ehdokkaat (11.11.2026)

**Status: tutkimustieto / NOT PUBLISHABLE.** Tämä katselmointi täydentää PR #448:n kahta `null`-arvoista lähderiviä. Kummallekaan riville ei palauteta automaattisesti hiilihydraattiarvoa, proteiinia, rasvaa eikä GK-lukua. Julkaistavaksi kelpaava laskenta vaatii tuotteen *ja* syötävän osuuden/paistohävikin ratkaisemisen.

## Naudan short ribs, luullinen 1 200 g

Suomessa on saatavilla nimenomaisia short ribs -tuotteita:

- [Stockman's rotukarjan short ribs 2 kg / K-Ruoka](https://www.k-ruoka.fi/kauppa/tuote/stockmans-rotukarjan-short-ribs-2373795300005), EAN `2373795300005`, ravintoarvo / 100 g *myyntihetkellä*: proteiini **21,1 g**, rasva **4 g**, hiilihydraatti etikettiin pyöristettynä **0 g**, energia 121 kcal. Tuote on alkuperältään Irlanti ja ainesosa 100 % naudanliha.
- [Tamminen rotukarja naudan ribs/keittoliha grillikylki / S-kaupat](https://www.s-kaupat.fi/tuote/tamminen-rotukarja-naudan-ribskeittoliha-grillikylki-n3kg/2006101900001), EAN `2006101900001`, ilmoitettu 20 g proteiinia, 8 g rasvaa ja 0 g hiilihydraattia / 100 g. Kyseessä on samankaltainen kylkituote; **ei** ilman erillistä leikkuu- ja luuosuustarkistusta sama tuote kuin short ribs.
- [Rönkä naudan ribbs / K-Ruoka](https://www.k-ruoka.fi/kauppa/tuote/ronka-naudan-ribbs-n1kg-2360907200001), EAN `2360907200001`, 20 g proteiinia, 10 g rasvaa ja **1 g hiilihydraattia** / 100 g myyntipakkauksen mukaan. Jo tämä pakkaustietojen ero osoittaa, miksi kaikkia naudan kylkirivejä ei saa lukea samanlaisiksi.

Laskennan avoimet kohdat: 1 200 g sisältää luuta; lopullinen syötävä liha- ja rasvamäärä puuttuu. Kaupan raaka-aineen ilmoitettu 100 g voi perustua myytävän kappaleen painoon eikä kypsänä syötävään osuuteen. Ilman luun ja valutetun rasvan erotusta **ei** lasketa annosmakroja.

## Porsaan kylki, luuton nahalla 800 g

- [PNM-Chipsters: porsaan kylki luuton nahalla n. 4,4 kg](https://www.pnmchipsters.fi/foodservice/tuotteet/porsas/porsaan-kylki-luuton-nahalla), tuotenumero `556121`, EAN `2355612100005`. Tämä vastaa reseptin **nahallista, luutonta** rakennevaatimusta. Avatulla tuotesivulla ei ole ravintoarvorivejä.
- [Savo-Karjalan Liha: porsaan kylki luuton nahallinen / Valio Aimo](https://www.valioaimo.fi/toimitustukku/savo-karjalan-liha-oy-porsaan-kylki-luuton-nahallinen-n3-kg/), EAN `2357930800000`. Rakennevastaavuus on hyvä, mutta ravintoarvot tarkistamatta.
- [Veijo Votkin: porsaan kylki](https://www.wotkins.fi/tuotteet/porsaan-kylki/) ilmoittaa / 100 g proteiinia **15 g**, rasvaa **27 g**, hiilihydraattia **0 g**. Tuotesivu ei kuitenkaan yksilöi, onko kylki reseptin vaatimalla tavalla **nahallinen ja luuton**.
- [Tamminen: porsaan kylki nahaton luuton / K-Ruoka](https://www.k-ruoka.fi/kauppa/tuote/tamminen-porsaan-kylki-nahaton-2354801900006) ilmoittaa 15 g proteiinia, 31 g rasvaa, 0 g hiilihydraattia / 100 g, mutta tämä on nimenomaisesti **nahaton**, eikä se kelpaa nahallisen porsaan kyljen täsmätietueeksi.

Laskennan avoimet kohdat: nahan osuus ja paistossa vuokaan irronnut rasva pitää arvioida tai punnita. Tietuetta ei voi vaihtaa nahattomaan AFCD/Fineli-vastineeseen merkitsemättä sitä proxyksi, eikä proxyä voi hyväksyä automaattisesti.

## Julkaisupäätös

1. **`karnivore-naudan-lyhytkylki`: `source=null`, ravintovälitulos `null`, `status: HOLD`.**
2. **`karnivore-rapea-porsaan-kylki`: samat `null` ja HOLD.**
3. Merkitse seuraavan laskennan syötteeseen täsmällinen tuotetunniste, tarvittava luun/nahan saanto ja paistorasvan pidättyminen. Vasta sen jälkeen toistettava annosravintoarvio.
4. Valmistajien etikettihiilihydraatti 0 g on pakkausmerkintä eikä todistus GK=0:sta.
5. Älä pehmennä CI:n lähdesuojausta tai korvaa tuntematonta arvoa nollalla.

Tämä ei ole julkaisuportin hyväksyntä, eikä se sisällä kaupallisen tuotetiedon uudelleenkäyttölupaa muuhun kuin lähdeviitteeseen ja käsin tehtyyn toimitukselliseen katselmointiin.

# E20 – kaksi SHA-lukittua FI-kokkikelpoisuuden oikaisua (10.11.2026)

Päähaaran lähtö-SHA: `bd11aa4847c763229996d17731c142f13c24ce2e`. Nämä ovat julkaistun FI-esityksen **tarkasti rajattuja sisältökorjauksia**, eivät kanonisen FI-raakalähteen, Fineli/AFCD-ravintolaskennan, annoksen tai GI/GK-tietueen muutoksia. Lähde-HOLDien ohjeissa oli vieraan ruoan yleispohjaohjeita.

## Ricotta-persikkakulho

FI-lähde `reseptit/aamupalat/valimerellinen-ricotta-persikkakulho.md` Git blob `1217327105b00f62f6601ac347ce61ffd393923a`, normalisoitu SHA-256 `da520f24684e3d1dfa2ed786b4e1200605b588a413591e852b568b59d3968d5c`.

- Julkisen `cooking_method`-tiedon `paistaminen` → `kylmävalmistus`.
- Poistetaan vieraat pavun/tofun paistamista ja lämmintä kulhopohjaa kuvaavat neljä geneeristä kohtaa. Tilalle 4 ruokalajikohtaista työvaihetta: **100 g ricotta, 150 g tuoreita kivettömiä persikkaviipaleita, 1 rkl listan sitruunamehua, 30 g pistaasia eli 15 g/annos**. Kaksi annosta; suola vain luettelosta.
- Ei uutta öljyä, kastiketta tai ravintoaineita. `docs/nutrition/calculations/valimerellinen-ricotta-persikkakulho.json` kuvaa samat tuotteet ja kaksi annosta. Pistachio-massa ja laskenta ennallaan.

## Thaimaalaiset maissifritterit

FI-lähde `reseptit/aamupalat/thai-maissifritterit.md` Git blob `c6f441e1e006d7792c23d9274c76b32159332b41`, normalisoitu SHA-256 `eca214c31e4a0f06a62f02e62b18f1f6ca9598cd3650cd09dd463b7f436d239a`.

- Korvataan geneerinen `raasta, muussaa tai hienonna` -vaihe ja listaamattomat kastike-/lime-tarjoilut.
- Käytetään **150 g kypsiä valutettuja maissinjyviä, 2 kananmunaa, 100 g vehnäjauhoa, 2 rkl thaibasilikaa, 1 rkl neutraalia paistoöljyä** ja vain luettelon suola. Ei lisävettä.
- Pannulla erissä paistaessa käytetään **koko erälle yhteensä** 1 rkl luettelon öljyä. Käännetään ja kypsennetään läpikotaisin; jaetaan kahteen annokseen. Ei limeä tai makeaa chilikastiketta, joita ainesosissa ja laskennassa ei ole.
- `docs/nutrition/calculations/thai-maissifritterit.json` kuvaa nämä samat ainesosat ja kaksi annosta; GK-lähdekonteksti pidetään ennallaan.

## STOP ja jatko

Molemmat näyttökorjaukset tehdään jo olemassa olevan `site/scripts/fi-breakfast-quality-display.ts` -projektorin kautta. Se varmistaa yksiselitteiset ankkurit ja täsmällisen alkuperäis-SHA:n. Regressiotesti varmistaa **raaka-aineiden, annosmäärän, neljän makron, kuvan ja lähde-SHA:n pysymisen**, sekä uudet ohjeet.

Tässä PR:ssä **ei lisätä käännöksiä** eikä julkaisurekisteriä. [E20 #396](https://github.com/ozirix-dev/Reseptit/pull/396) sisältää nämä kaksi edelleen SOURCE-HOLDina; uusi kielilupa vaatii 4-kielisen merkityskatselmoinnin, aines-/ravintotietojen vahvistuksen ja semanttisen SHA-evidenssin. Fyysistä koepaistoa tai riippumatonta kielenkatselmointia ei väitetä tehdyksi.

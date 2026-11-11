# Issue #404 / C5 – Bakwan V2: rakenteinen grammoitettu FI-luonnos ja laskentaversio

**11.11.2026 – ei tuotantojulkaisua.**

## Mikä muuttui?

Aiempi [bakwanin grammoitettu työluonnos](c5-variants/bakwan-maissifritter-60g-porkkana.md) on viety oikeaan reseptin rakenteiseen muotoon uudella tunnuksella `indonesialainen-bakwan-jagung-punnittu-v2`:

- [FI-reseptiluonnos](../../reseptit/raakileet/indonesialainen-bakwan-jagung-punnittu-v2.md), `status: draft`, `category: aamupala`.
- Ilmoitetut määrät kahteen annokseen: **100 g maissia, 60 g kuorittua porkkanaa, 100 g vehnäjauhoa, 12 g kevätsipulia, 100 ml vettä, 13,5 g öljyä ja 1 g suolaa**.
- Valmistusohje ja erilliset huomautukset osoittavat ehdotetun vesimäärän, tuotoksi oletetut 6 fritteriä, raakaa vehnäjauhoa koskevan kypsyystarkistuksen ja mittaamattoman öljyn retentioasteen.
- Neljä `carbs_net_per_serving_g`, `carbs_total_per_serving_g`, `protein_per_serving_g` ja `fat_per_serving_g` -kenttää ovat **null**, eivät 0 eikä vanhoja historiatietoja.
- Alkuperäinen julkaistu `indonesialainen-bakwan-maissifritter.md` on muuttumaton; V2:lle ei peritä sen vanhaa GK- tai ravintolaskennan hyväksyntää.

## Uuden version erillinen aineskohtainen laskenta

`site/scripts/bakwan-v2-candidate-calculation.ts` lukee uuden V2-tiedoston rakenteiset ainesmäärät ja alkuperäisen [historiallisen laskennan](../nutrition/calculations/indonesialainen-bakwan-maissifritter.json) ainesosakohtaiset koostumustiedot. Sekä uuden luonnoksen, vanhan FI-lähteen että aiemman laskennan **täsmälliset Git-blob-SHA:t lukitaan**. Jokaiselta viideltä energiaravintoaineita tuottavalta ainesosalta vaaditaan yksilöity koostumustietue.

100 ml puhdasta vettä ja 1 g suolaa ovat mukana V2:n ainesluettelossa. Niillä ei ole energiaa lisäävää osuutta käytettävissä oleviin hiilihydraatteihin, proteiiniin tai rasvaan; suolan natriumvaikutus kuuluu omaan myöhempään ravintomerkintään. Vesi ja suola eivät oikeuta arvaamaan keittiössä valmistettua saantoa.

### Ehdollinen ravintoarvio / annos

Laskenta käyttää samoja dokumentoituja AFCD/Fineli-ainekohtaisia koostumustietoja kuin aiempi `AUTOMATED ONLY` -laskelma, **ei** uutta riippumatonta ravintolähteiden hyväksyntää.

| Hypoteettinen osuus pannun öljystä annoksiin | Käytettävissä olevat HH | HH + kuitu ja polyolit | Proteiini | Rasva |
|---|---:|---:|---:|---:|
| 50 % | 45,19 g | 49,88 g | 7,89 g | 5,12 g |
| 75 % | 45,19 g | 49,88 g | 7,89 g | 6,81 g |
| 100 % | 45,19 g | 49,88 g | 7,89 g | 8,50 g |

**Mikään näistä öljyn retentioprosenteista ei ole mitattu arvo.** 100 % -vaihtoehto toistaa vanhan laskentamallin luvut, koska 60 g:n porkkanatavoite ja muut energiaravintoaineiden mallimassat vastaavat aiemman laskelman oletuksia. Se ei todista, että nämä ovat juuri tämän koeversion todelliset ravintoarvot.

## Julkaisun seuraavat portit

1. Varmista että 100 ml vettä tuottaa todella lusikoitavan, pannulla kypsyvän taikinan ja testaa tuotoksi kuusi fritteriä. Ei väitettä suoritetusta koepaistosta.
2. Vahvista tai määrittele ainemäärät lopulliselle V2-versiolle sekä syötävän porkkanan 60 g.
3. Mittaa tai muutoin perustellusti rajoita pannuun jäänyt / ruokaan siirtynyt öljy ja tarkista aineskohtainen ruokatuotevastaavuus.
4. Tee riippumaton ravintoarvojen, GI:n ja GK:n lähdekatselmointi. Vasta sen jälkeen erillinen julkaisuhyväksyntä, käännösten merkitystarkistus ja täsmä-HEAD CI/deploy.
5. V2:n ajantasaisuus ja ei-julkisuus: `cd site && npm run audit:bakwan-v2`. Tulos `DRAFT_ESTIMATES_NOT_APPROVED`, `approvedForPublication=false`, `independentNutritionApproved=false`, `glycemicLoadApproved=false`.

**Tämä PR ei muuta julkaistuja ainesmääriä, ravintoarvoja, GK-historian lähdesinettejä tai julkista karanteenia.** Uusi FI-raakile tarjoaa ensimmäisen rakenteisen, myöhemmin omaan julkaisuun vietävän version ja testattavan ravintoarvolaskennan. Tätä katselmointia ei saa kutsua fyysiseksi mittaukseksi, koepaistoksi tai itsenäiseksi ravinto-/GK-hyväksynnäksi.

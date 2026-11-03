# GK80:n seuraavat A-katselmoinnit 3.11.2026

Julkisesta GK-koonnista varmennettu kattavuus on 194/326. PR 202 yhdistettiin committiin b4849e9275d27c0a9172c1ba0d3935ae94c56462 ja [julkaisuajo 41591699187](https://github.com/ozirix-dev/Reseptit/actions/runs/41591699187) päättyi onnistuneesti. PR 201 dokumentoi jo julkaistujen Panangin ja tofu-kimchikulhon hyväksyntäketjun. Niistä ei tule uusia resepti-ID:itä. PR 199:n kansainvälisten tutkimussyötteiden katselmointi on erillinen. PR 200:n päätöstaulukossa on 20 tutkimusehdokasta, joista osa koskee jo julkaistuja tai muualla käsiteltäviä reseptejä. Tätä lukua ei lisätä kattavuuteen.

| Resepti | GK:n laskettu osa | Poisjättö g/annos | Katselmointikysymys |
| --- | ---: | ---: | --- |
| [Vihreä kanacurry](green-curry-a-route/README.md) | 2,38 | 1,8705 | Nimetyt pakkaukset ja 30 ml Red Boat |
| [Punainen kanacurry](red-curry-a-route/cases.json) | 1,95 | 1,7655 | Valutettu Kingfisher ja 60 g syötävä lime |
| [Keltainen kanacurry](yellow-curry-a-route/README.md) | 1,28 | 1,9313125 | Ayam AU -tahna ja tarjoilu ilman erillistä lisuketta |
| [Kerala-kalacurry](kerala-a-route/kerala-result.json) | 0,38 | 1,9215 | Punnitut mausteet ja curry ilman erillistä riisiä |
| [Maksa ja pekoni](beef-liver-a-route/liver-result.json) | 2,33 | 1,164275 | Arvioitu MEXT 11092 ja nykyisen GI 50 -mallin käyttö |

Kaikkien viiden lähde- ja sisältöhyväksyntä on kirjattu [hyväksyntätietueeseen](next-five-a-approval.json). [PR 203](https://github.com/ozirix-dev/Reseptit/pull/203) sisältää kolme kanacurrya ja ilmoittaa esikatselussa 197/326 mustikkapiirakka mukaan lukien (PR-head 3d77583e67b8b7c752f806e28751de2881b8082f). Kerala-kalacurry sekä maksa ja pekoni muodostavat jäljellä olevan hyväksytyn kahden reseptin erän. Viisi resepti-ID:tä ovat erillisiä. Kaikkien julkaisu nostaisi kattavuuden 199/326:een (61,0 %), jolloin vaje on 62. Erillinen [PR 205](https://github.com/ozirix-dev/Reseptit/pull/205) sisältää Lindströminpihvit. Sen kanssa yhteinen ehdollinen kattavuus on 200/326, kun molempien PR:ien yhteiset rekisteri- ja testimuutokset on sovitettu yhteen ja kaikki kuusi versiota julkaistu. Tom Yumin kaksi valmistusvaihtoehtoa ovat sama resepti-ID ja jäävät tämän erän ulkopuolelle makukokeen vuoksi.

[Julkinen GK-sivu](https://ozirix-dev.github.io/Reseptit/glykeeminen-kuorma/) · [PR 199](https://github.com/ozirix-dev/Reseptit/pull/199) · [PR 200](https://github.com/ozirix-dev/Reseptit/pull/200) · [PR 201](https://github.com/ozirix-dev/Reseptit/pull/201) · [PR 202](https://github.com/ozirix-dev/Reseptit/pull/202)

Julkinen lähtöluku on 198/326 Lindströminpihvien julkaisun jälkeen. PR 207 sisältää siemengranolan, pistaasijogurtin, kongjukin ja uunifalafelin. PR 210 tarjoaa samalle siemengranolan resepti-ID:lle EDEKA-mantelilastuihin sidotun 2,38 GK:n version. Molemmat PR:t muuttavat samaa GK-rekisteriä ja kahta yhteistä testitiedostoa. Yhdessä ne kattavat neljä eri reseptiä, joten niiden julkaisu nostaisi kattavuuden 202/326:een.

Integraatiota odottavat Kerala-kalacurry, maksa ja pekoni sekä kevätsipulipannukakku. Niiden jälkeen ehdollinen kattavuus olisi 205/326. Labneh-kulhon täsmäversio odottaa erillistä lähde- ja sisältöhyväksyntää.

## Julkaisujonon tarkistus

Julkisessa GK-koonnissa on 198/326 numeerista reseptiä. Pongalilla on jo julkinen GK-versio. Vanhan päätöstaulukon integraatiomerkintä ei tee siitä uutta kattavuuslisää.

PR 207 on Ready tilassa ja build läpäisi tarkistuksen commitissa 5f91ad26ffb6f82f4ad0d94f04863821f674cce8. Sen neljä reseptiä nostaisivat kattavuuden julkaistuina 202/326:een. PR 210:n granola on sama resepti-ID. Kerala-kalacurry, paistettu maksa ja pekoni sekä kevätsipulipannukakku näkyvät julkisessa koonnissa ilman numeerista arviota. Niiden tarkat hyväksytyt versiot nostaisivat ehdollisen kattavuuden 205/326:een. Okayu, labneh ja teehaudutetut munat odottavat lähde- ja sisältöpäätöksiä.

[Julkinen koonti](https://ozirix-dev.github.io/Reseptit/glykeeminen-kuorma/) · [PR 207](https://github.com/ozirix-dev/Reseptit/pull/207)

Julkisesta koonnista varmennetut muut jo julkaistut reseptit ovat hernekeitto, besan-chilla, pinaatti-paneer-chilla, mannasuurimoupma, kana-tagine ja paella. Vanhan päätöstaulukon hyväksytty luovutus -merkintä näille kuudelle sekä pongalille kuvaa aiempaa työvaihetta. Seitsemän reseptiä sisältyvät julkiseen lähtölukuun.

## Tilanne PR 207:n julkaisun jälkeen

Julkinen kattavuus on 202/326 ja tavoitteeseen 261/326 tarvitaan 59 reseptiä. Draft PR 214 korvaa saman kolmen reseptin Draftin 213. Pav bhaji, hunaja-sinappikana kaalilla ja poha maapähkinöillä nostaisivat kattavuuden julkaistuina 205/326:een. Kerala-kalacurry, maksa ja pekoni sekä kevätsipulipannukakku ovat eri reseptejä. Molempien erien jälkeen ehdollinen kattavuus olisi 208/326.

Margheritan 56–65 ja Hyderabadi-kanabiryanin 24–32 on hyväksytty täsmäversioina integraation valmisteluun. Ne tuovat mahdolliset kaksi erillistä resepti-ID:tä. Jos myös ne integroidaan ja julkaistaan, ehdollinen kattavuus olisi 210/326. Julkaisusta päätetään erikseen.

[Draft PR 214](https://github.com/ozirix-dev/Reseptit/pull/214) · [Margheritan syöte](margherita-handoff.json) · [Biryanin syöte](biryani-handoff.json)

Margheritan ja Hyderabadi-kanabiryanin luovutuskenttä nutritionInputSha256 tarkoittaa ravintolaskentatiedoston sourceHash-kenttää. Molemmat arvot täsmäävät main-commitissa 9740c2a. Koko JSON-tiedoston tiiviste tarkistaa eri asian. Tarkista sourceHash uudelleen integraation pohjaversiosta ja käytä hyväksyttyjä välejä 56–65 ja 24–32.

## Tilanne PR 215:n julkaisun jälkeen

Julkinen kattavuus on 204/326. Tavoitteeseen 261/326 puuttuu 57 reseptiä. Poha ja hunaja-sinappikana sisältyvät lähtölukuun. PR 214:stä vain pav bhaji kasvattaisi kattavuutta. GitHub ilmoittaa PR 214:ssä olevan yhdistämisristiriitoja. Julkaisuagentin käsiteltäväksi jää pav bhajin sovittaminen julkaistuun pohjaan.

Kerala-kalacurry, maksa ja pekoni, kevätsipulipannukakku, Margherita ja Hyderabadi-kanabiryani muodostavat viisi erillistä integraatioon valmisteltavaa hyväksyttyä reseptiä. Jos nämä viisi ja pav bhaji julkaistaan, kattavuus nousee 210/326:een ja vaje on 51.

[Julkinen koonti](https://ozirix-dev.github.io/Reseptit/glykeeminen-kuorma/) · [PR 215:n julkaisuajo](https://github.com/ozirix-dev/Reseptit/actions/runs/41605550882)

Pav bhajin integraatio on omassa [Draft PR 218:ssa](https://github.com/ozirix-dev/Reseptit/pull/218). Laske pav bhaji julkaisujonoon vain kerran. Pohan ja hunaja-sinappikanan [kielikorjaus PR 217](https://github.com/ozirix-dev/Reseptit/pull/217) koskee kahta jo laskettua resepti-ID:tä ja tuo kattavuuteen nolla uutta reseptiä.

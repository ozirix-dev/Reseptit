# Recipavon GI/GK-ajon jatkopiste 18.11.2026

Tämä jatkopiste on paikallinen. Se tallentaa tarkistetun tilanteen ja
keskeneräisen työerän ennen ajon keskeyttämistä.

## Versiot ja tarkistukset

| Kohde | Tarkistettu tila |
| --- | --- |
| Reseptit-repo | `ozirix-dev/Reseptit` |
| Työpuu ja haara | `D:/Temp/Reseptit-gk-annos-20261118`, `codex/gk-annos-20261118` |
| [PR #706](https://github.com/ozirix-dev/Reseptit/pull/706) | Avoin luonnos, HEAD `655a7a12d5b1edc69e6c5344c1108684bcc29b60` |
| Tarkistettu tuoteversio | [CI 44247992909](https://github.com/ozirix-dev/Reseptit/actions/runs/44247992909), riippumaton FI/EN/SV/TH-katselmointi ja 320 px:n näppäimistötestit |
| [ReportHub #214](https://github.com/ozirix-dev/ReportHub/pull/214) | HEAD `d4f84c5b0dbfd1f006b9190cceb964cd02fec654`, [CI 44248673174](https://github.com/ozirix-dev/ReportHub/actions/runs/44248673174), 16 osa-alueen arvio |
| Paikallinen commit | Tämän asiakirjan sisältävä dokumentointicommit, jonka vanhempi on PR #706:n yllä merkitty HEAD |

Paikallinen tuotetyöpuu ja ReportHubin työpuu olivat puhtaat tarkistushetkellä.
Tuoterepon generoidut annostiedot, sivut ja ravintoauditointi vastaavat
yllä olevaa tuoteversiota. [LaskeGK PR #708](https://github.com/ozirix-dev/Reseptit/pull/708)
on erillinen työ, jonka tarkistettu etä-HEAD on `e3925b2275fd414a90ede02d9b819e9ed89e832f`.

## Käsitellyt reseptit ja avoimet tapaukset

| Tietotaso | Reseptiä |
| --- | ---: |
| Numeerinen GK-arvio | 151 |
| Sanallinen GK-arvio | 24 |
| Koko annoksen hiilihydraattiluku | 335 |
| Koko annoksen hiilihydraattiluku ilman GK-arviota | 166 |
| Ruokakohtainen hiilihydraattihuomio ilman koko annoksen lukua tai GK-arviota | 55 |
| Käsiteltyjä reseptejä | 396 |

Lähdekatselmointi on auki 71 reseptillä. Näistä 50:llä on koko annoksen
imeytyvien hiilihydraattien arvio ja seitsemällä aiemmin ilmoitettu
nettohiilihydraattiluku. Neljältätoista puuttuu koko annoksen hiilihydraattiluku.
Osa odottaa valmistuspainon, tuotetiedon tai koostumuslähteen tarkennusta.
Numeerisista GK-arvioista 11 kuvaa nimettyjä aineksia ja 80 sisältää kirjatun
poisjätön. Viisi kuuluu kumpaankin ryhmään. GI/GK:n 5/5-kokonaisarvio on kesken.

Paikallisessa arkistossa `reseptit-396.csv` sisältää kaikki käsitellyt
reseptit tunnisteineen. `avoimet-lahdekatselmoinnit-71.csv` rajaa saman
aineiston avoimiin riveihin. Aiemmat lähdepäätökset ja yksittäiset
lähtötietopuutteet löytyvät tarkastuspaketeista.

## Keskeneräinen työ ja seuraava vaihe

Seuraavassa työerässä on neljä ennestään varmennettua koko annoksen
hiilihydraattilaskelmaa, joille on valmisteltu nelikielinen annosrajaus.

| Reseptitunniste | Imeytyvät hiilihydraatit annoksessa | Annosrajauksen sisältö |
| --- | ---: | --- |
| `karnivore-maksa-ja-pekoni` | 6,71 g | Kolmasosa erästä, mukana syötävä paistorasva ja paistoneste |
| `valimerellinen-kikherne-yrttiaamiainen-punnittu-v2` | 10,20 g | Yhdessä annoksessa 50 g kypsiä, valutettuja kikherneitä ja yksi muna |
| `timjami-uunijuurekset` | 25,05 g | Kuorittujen ja punnittujen juuresten osuudet |
| `palsternakkasosekeitto` | 30,59 g | Neljäsosa erästä sisältäen kerman |

Lähdepaketti `pass23-pending-carbohydrate-scopes.json` on sidottu PR #706:n
HEADiin. SHA-256 on `de43c2df4b1adb37053467d2f23247c9c080fb4f2f0740a859f559ae71758b39`.
Paketissa on neljän reseptin 16 kielireitin tarkisteet, 32 reseptinäkymän
kokeilurenderöintiä sekä neljän oppaan renderöinnit. Testiluonnos
`keskenerainen-static-output.patch` on talletettu erikseen. Työerä odottaa
integrointia tuotetyöpuuhun ja sen omia tarkistuksia. Kikherneaamiaisen
GK-luokka odottaa valmistustapaan soveltuvaa näyttöä. Raaka-aineen
suolavedessä keitetyllä tai säilötyllä vertailuversiolla on eri rajaus.

Kun ajoa jatketaan, varmista ensin tämän haaran omistajuus, Repo Guard ja
PR #706:n etä-HEAD. Tarkista neljän rivin lähdepaketti ja testiluonnos
uudelleen ajantasaisia reseptejä vasten. Aja paikallinen ravintoauditointi,
annos- ja staattiset testit sekä tarkista resepti ja opas neljällä kielellä.
Rajaa työ hiilihydraattitiedon esittämiseen ja pidä GK:n hyväksyntäportit
voimassa. Uuden HEADin varmennus tehdään sen omalle versiolle.

Paikallinen arkisto on hakemistossa
`%USERPROFILE%/.codex/checkpoints/recipavo-gk-20261118-0810`.
Siellä ovat työhakemistojen tutkimus- ja tarkastusaineisto,
varmennettu sivusto- ja laskentatieto, ReportHubin raporttiversio,
Git-paketit ja SHA-256-tarkistelista.

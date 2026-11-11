# Karnivore FI 3 – numeerinen ravintoskenaario ja päätösrajat (11.11.2026)

**EI JULKAISTAVA.** Tämä on toistettava *raakapanoslaskelma* PR #448:n kolmeen ensimmäiseen FI-luonnokseen. Kaikki ainesosat on käsitelty täydellä raakapainolla, oletettu 100 % syötäväksi ja maistettavaksi myös pannuun jäävä rasva. Oletus ei ole tosiasiallinen paistosaanto: proteiini-, rasva- ja energialuvut eivät ole vielä hyväksyttyjä annosarvoja. `status: draft`, `GK: HOLD`.

## Lähdetiedot ja laskenta

Kanoninen ainesosakartta: `docs/reviews/karnivore-10-nutrition-source-map-2026-11-11.json`, Fineli Release 20 ja FSANZ AFCD Release 3. Energiasta annetaan vain **4P + 9R + 4HH -kaavalla laskettu vertailuarvio**, ei valmistajan etiketti- tai Fineli-energiakenttä. Kuidun arvoja ei ole aineistossa kattavasti: **älä tulkitse puuttuvaa kuitua nollaksi**. Suolan Fineli-tietueessa on 0,63 g proteiinia / 100 g, joka sisältyy koneelliseen tulokseen ja on ravitsemuksellisesti vähäpätöinen.

| FI-resepti | Raakapainot / 2 annosta | Proteiini / annos | Rasva / annos | Imeytyvät HH / annos | Laskennallinen kcal / annos |
| --- | --- | ---: | ---: | ---: | ---: |
| `karnivore-steak-and-eggs` | entrecôte 360 g; kuoreton muna 220 g; voi 20 g; suola 3 g | 54,319 g | 36,294 g | 0,410 g | noin 546 |
| `karnivore-voilohi-pannulla` | nahallinen lohifilee 400 g; voi 35 g; suola 3 g | 41,218 g | 47,627 g | 0,140 g | noin 594 |
| `karnivore-jauhelihakulho-munalla` | naudan jauheliha 400 g; kuoreton muna 110 g; suola 4 g | 42,948 g | 45,082 g | 0,165 g | noin 578 |

**Kaava:** `annoksen ravintotekijä = sum(ainesosan raakapaino_g × lähteen arvo_per_100g / 100) / 2`. `kcal_approx = 4 × protein_g + 9 × fat_g + 4 × availableCarbs_g`. Ravintoarvot ovat yhdistelmä eri tietokantoja; erot ilmoitettuihin energia-arvoihin ovat mahdollisia. **Pyöristys on vain esittämistä varten.**

## Lähdevastaavuuden laatu

- **Jauheliha:** Snellman Kunnon naudan jauheliha 20 % 400 g, EAN 6409620011856; valmistajan verkkosivu ilmoittaa 100 g:ssa 252 kcal, rasvaa 20 g, proteiinia 18 g ja hiilihydraatteja 0 g. URL: https://snellman.fi/fi/tuotteet/kunnon-naudan-jauheliha-20-400-g/ (tarkistettu 11.11.2026). Valmistajan makroista 4P+9R antaa 252 kcal/100 g eli täsmää tuotesivuun. **Vain täsmälleen tämä tuote voi saada valmistajan lähdetunnisteen**; yleinen '20 % naudan jauheliha' pysyy proxy-tilassa.
- **Entrecôte:** AFCD F000851 scotch fillet raw on anatomisesti käyttökelpoinen leikkuukohtaeHDOKAS, mutta rasvan todellinen määrä riippuu siistimisestä. **Proxy**.
- **Lohi:** AFCD F007827 Atlantic salmon fillet raw ei varmista nahallisen fileen ravintoarvoa eikä nahan syötävää määrää. **Proxy**.
- **Kananmuna:** Fineli 858 kuoreton kananmuna, **matched**.
- **Voi:** Fineli 500, **matched** raaka-aineena; sen *syöty annos* on avoin.
- **Suola:** Fineli 30, **matched**.

## Saannon herkkyys ja avoimet valinnat

- Jauhelihan 400 g raaka-annos sisältää valmistajan mukaan 80 g rasvaa yhteensä. Jos esimerkiksi **10 g sulanutta rasvaa jätetään syömättä koko pannullisesta**, koko reseptin rasvaosuus vähenee laskennallisesti 10 g eli **5 g annosta kohden**, ja vertailuenergialaskenta 45 kcal/annos. Tämä on *havainnollistava skenaario*, ei mitattu saanto; lihan todellinen valmistushävikki muuttaa myös vesimäärää, ei suoraan pääteltävää proteiinimäärää.
- Voilohen 35 g voita sisältää Finelin mukaan 28,455 g rasvaa. Jos esimerkiksi 10 g voita jää syömättä, lähdeperusteinen rasva pienenee **8,13 g koko reseptissä** eli 4,065 g/annos. Voin mahdollisesti haihtuva vesi, pannulle jäävä seos ja lohesta irronnut rasva edellyttävät erillistä mallia.
- Steak & Eggs sisältää 20 g voita eli Finelin perusteella 16,26 g rasvaa; sama 10 g:n voin käyttämättä jäämisen esimerkki pienentäisi 4,065 g rasvaa per annos. **Älä sekoita käytetyn raaka-aineen määrää syötyyn määrään.**
- Raakaraaka-aineiden hiilihydraattilaskelmat ovat matalia, mutta **GI/GK hyväksyntää tai GK=0-leimaa ei saa johtaa tästä**. Tietokantien 0 g voi olla myös pyöristettyä.

## Ruokaturvallisuus

Jauheliha kauttaaltaan kypsäksi: Ruokaviraston kuluttajaohjeen mukaan nauta/sika vähintään 70 °C; elintarvikealan ohjeen jauhelihapihville joko 75 °C tai 70 °C kahden minuutin ajan. Tässä FI-kulhoreseptissä nykyinen 70 °C / 2 min tai 75 °C on konservatiivinen. Lähteet:
- https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/kasittely-ja-sailyttaminen/hygienia-kotikeittiossa/liha/
- https://www.ruokavirasto.fi/elintarvikkeet/elintarvikeala/hygieeninen-toiminta/tuotanto--ja-kasittelyhygienia/kypsentaminen/

## Täsmälliset julkaisun jäljellä olevat esteet

1. Päätä, sidotaanko jauhelihakulho eksplisiittisesti Snellmanin EAN-tuotteeseen vai hyväksytäänkö muu täsmäkoostumus dokumentoidusti. 
2. Valitse pihvin ja nahallisen lohen lopullinen tuotekoostumus; älä hyväksy proxy-arvoa automaattisesti.
3. Lukitse valmistuksen rasvansaanto ja syötävät osuudet; jos arvio on perusteltu mutta ei mitattu, merkitse epävarmuus ja käytä projektin laatukriteerejä.
4. Laske **energia, proteiini, rasva, hiilihydraatit ja kuitu** jokaiselle annokselle lähteistetyssä täydellisessä ravintolaskelmassa.
5. Tee riippumaton GK-päätös, duplikaattikatselmointi ja omat WebP-kuvat. Vain sitten erillinen FI-julkaisu-PR, kieliversiot myöhemmin.

**Julkaisupäätös 11.11.2026: 0/3 hyväksytty, 3/3 valmistelussa.** Älä muuta reseptien status-, carbs- tai dietTags-hyväksyntäkenttiä tämän numeerisen tarkastelun perusteella.

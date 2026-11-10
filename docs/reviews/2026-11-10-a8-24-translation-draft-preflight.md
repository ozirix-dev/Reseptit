# A8 – 24 EN/SV/TH-käännösluonnoksen esikatselmointi 10.11.2026

**Tila:** Draft, ei julkaisuvaltuutta. **FI-alkuperäiset:** `main` `a90df8fa7698a74c29b8afe67dc842af300d9ef2`, täysin ennallaan. **Julkisen FI-esityksen kokkikorjaus:** [Draft PR #361](https://github.com/ozirix-dev/Reseptit/pull/361), hyväksytty SHA-sidonnan ja regressiotestien tasolla mutta ei merge/deploy. **Luonnosten versio:** staging `2941978238f141282baa602d168e86bfd479a401`. Ei riippumatonta ihmiskielentarkistusta, ei koepaistoa.

## Kokkimerkityksen päivitys

| Resepti | FI-näyttöversion muutos, jonka EN/SV/TH säilyttävät |
| --- | --- |
| falafel | Salaatti ja pita vain erillisiä **valinnaisia lisukkeita**, eivät kuulu 4 annoksen ravintoarvoihin |
| jerk-kana | Vähintään tunnin kylmämarinointi, 45–55 min paisto, kokonaisarvio **130 min**, kanan sisälämpö **vähintään 75 °C**, raakaa kanaa koskettanutta marinadia ei saa lisätä kypsän ruoan päälle; riisi kypsyy paiston aikana |
| kimchi-jjigae | Riisi ei ole laskennallisen neljän annoksen aines; mahdollinen erillinen lisuke |
| lanttulaatikko-kermainen | Muna **55 g syötävää kuoretonta massaa**, ei uusi ainesosa; 50 g kokonaisvoi ja 100 g keitinneste ennallaan; historiallinen GK80 release-6 lähde-SHA säilyy |
| lindstrominpihvit-kaalilla | Alkuperäinen 2 rkl voita jaetaan **1 rkl pihveille + 1 rkl kaalille**, ei ylimääräistä rasvaa |
| maksalaatikko-kukkakaalilla | Alkuperäinen 2 rkl voita jaetaan **1,5 rkl paistoon + 0,5 rkl vuokaan**, maksa ja muna kypsennetään kauttaaltaan |
| shoyu-kanakeitto-konjac | Valmistustapa **keittäminen**, ei paistaminen; broilerin sisälämpö **75 °C**, ei uusia aineksia; historiallinen GK80 release-3 lähde-SHA säilyy |
| vhh-brita-kakku | Mantelijauho ja leivinjauhe käännellään voi–erytritoli–keltuaisseokseen ennen levittämistä; 70 g pohjan erytritolia ja 60 g marengin erytritolia eivät vaihdu |

## Sidokset, tarkisteet ja pysäytysrajat

- 8 FI-alkuperäisen `semanticHash` tarkistettu suoraan nykyisestä `main`-haarasta aiempaa `docs/reviews/translation-batch20-digests-2026-11-09.json`-ledgeriä vasten: **8/8 identtiset**.
- Kaikkien 24 englannin, ruotsin ja thain korjatun **Draft**-tiedoston skeemajärjestyksen mukainen semanttinen SHA-256 laskettu uudestaan ja tallennettu samaan päivättyyn ledgeriä ylläpitävään raporttitiedostoon. Tätä ei kirjoiteta julkaistujen parien `meta/kaannokset/codex-review-evidence.json`-rekisteriin ennen julkaisuporttia.
- `status: draft` säilyy kaikissa; `time_total_min` poikkeaa lukitusta raakatekstistä vain jerk-kanassa **130 vs 90**, mutta vastaa A8-julkista näyttöversiota. `cooking_method` poikkeaa lukitusta raakatekstistä vain shoyu-kanakeitossa **keittäminen vs paistaminen**, samalla perusteella. Kaikki annokset, nimetyt raaka-aineet, määrät, ravintoarvot ja kuvat pidetään entisinä.
- Riskipainotettu testivertailu keskittyy kanan ruokaturvallisuuteen, 55 g kuorettomaan munaan, rasvan kaksinkertaisen käytön estoon, lisukkeiden laskentarajoihin ja Brita-kakun nostatuksen toteuttamiseen. SHA todistaa version, ei itsessään kokattavuutta.
- Pages-deployt [#42722755420](https://github.com/ozirix-dev/Reseptit/actions/runs/42722755420) epäonnistuivat kahdesti; [issue #376](https://github.com/ozirix-dev/Reseptit/issues/376) pysyy avoimena. **Tätä Draft-erää ei yhdistetä mainiin eikä julkaista** ennen Pages-esteen korjausta sekä PR #361:n lähdekorjausriippuvuuden hyväksyttyä yhdistämistä.

## Seuraava vaihe

Kun Pages toimii, yhdistä #361 vain sillä läpäisseellä SHA-versiolla ja tarkista tuotantodeploy. Sovita tämä A8-käännösten esikatselmus sen jälkeen uusimpaan mainiin, laske SHA:t vielä kerran ja julkaise 24 kieliversiota yhtenä selkeästi rajattuna release-PR:nä vain, jos kaikki portit PASS. Ei sokkoretryjä tai automaattista GK80-sinettien korvaamista.

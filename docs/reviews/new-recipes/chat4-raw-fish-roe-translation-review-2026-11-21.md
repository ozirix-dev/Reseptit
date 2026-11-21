# Chat-4 – graavisiian ja muikunmädin nelikielinen turvallisuuskatselmointi

Päiväys: 21.11.2026  
Työn omistaja: Chat 4  
PR: https://github.com/ozirix-dev/Reseptit/pull/805

## Katselmoinnin rajaus

Verrattu FI-lähteet ja EN/SV/TH-luonnokset itsenäisesti molempien raakakalan ja mädin reseptien osalta. Tämä on ChatGPT:n toimituksellinen vertaileva arvio, **ei** tuoteturvallisuustarkastus eikä väite Recipavon valmistuskokeesta. Käännöksiä ei julkaista eikä merkitä hyväksytyiksi ennen asianmukaisia julkaisuportteja. Tarkistuksen lähtötilassa GitHubin PR-HEAD oli `e685882cb30bda6b1475c464f9d8be5f371f3487`; sen jälkeen 30 käännösluonnoksen kuvan tilaa kuvaavat huomautukset korjattiin.

## Graavisiika (`graavisiika-tillilla`)

- Ainesmäärät kaikissa kielissä: 500 g raakakäyttöön soveltuvaa ruodotonta siikaa, 22 g suolaa, 14 g sokeria, 20 g tilliä, 0,5 tl valkopippuria. 8 annosta ja 1470 min.
- Neljän kielen valmistus vaatii loisten edellyttämän pakastuskäsittelyn **ennen** raakakäyttöä, kieltää valmistuksen ilman luotettavaa varmistusta ja sanoo, ettei graavaus korvaa pakastusta.
- Graavaus 0–3 °C / 24 h, kääntö kerran; kriittinen kieltomuoto ja listeriariskiryhmien varoitus ovat mukana EN/SV/TH-versioissa.
- Katselmointihetken Git-blobit: FI `7020cd7e3da6a90461fa7a7d38f197b44fb4eeb8`, EN `5d5dcb9c4225e51af7e5ea0a10e9f627cc331b27`, SV `0d261b723df86ab6960ff20f4cb0943ae6ec43e6`, TH `2c1938238b4d7434a846dfece2d04a8b1163c100`. Kuva-huomautusten jälkimuutos muuttaa käännösblobit.
- **Päätös:** kriittinen turvallisuusmerkitys ja valmistuksen vastaavuus PASS, mutta **julkaisu HOLD**: siian toimittajan raaka-/pakastuskäsittelyn todisteet ja kylmäketju puuttuvat. Ei käyttäjälle turvallisen raakakalan väitettä.

## Muikunmäti-rieskarullat (`muikunmati-rieskarullat`)

- Kaikissa kielissä 4 perunarieskaa, 140 g syöntivalmista muikunmätiä, 180 g tuorejuustoa, 90 g smetanaa, 50 g punasipulia, 15 g tilliä, 10 ml sitruunamehua. 8 annosta / 25 min.
- EN/SV/TH säilyttävät FI:n vaatimukset mädin syöntivalmiudesta, todistetusta loisriskin edellyttämästä jäädytyskäsittelystä ja kylmäketjusta. Pakastus **ei** poista listeriariskiä.
- Kylmä rieskarulla ja tarjoilu sellaisenaan ovat yhtäpitävät, ja riskiryhmien kuumentamattoman mädin välttämisohje säilyy.
- Katselmointihetken Git-blobit: FI `58ea17b8b88831fac5beb27eced87f7d7f167b44`, EN `7968e470419bc006092c4dea2160d8c7ef4620d4`, SV `64422d5e6e69c2675380ac613d297e9c860a57ca`, TH `1bbe1ba01ca5b5bf32a0468da0f925549414ac53`. Kuva-huomautusten jälkimuutos muuttaa käännösblobit.
- **Päätös:** kriittinen turvallisuusmerkitys ja rakenteellinen vastaavuus PASS, mutta **julkaisu HOLD**: käytettävän mädin tuotekohtainen käsittely-/säilyvyysnäyttö sekä omien täytesuhteiden viimeinen arvio puuttuvat.

## Muut avoimet ehdot

- Muiden kahdeksan reseptin täydellinen kielellinen merkitysvertailu ei kuulu tähän osatarkistukseen.
- Kuva-overlay varmistaa 10 WebP:n tavut Gitissä, ei korvaa toimituksellista kuvan hyväksyntää.
- Virallista `meta/kaannokset/codex-review-evidence.json`-julkaisukuittausta ei vielä anneta, koska lähteet ja reseptit ovat Draft/HOLD-tilassa.
- Numeeriset ravintoarvot ja GK puuttuvat; niiden puuttuminen ei ole nollalukema.
- Ei Ready/mergeä tai Cloudflare-tuotantojulkaisua.

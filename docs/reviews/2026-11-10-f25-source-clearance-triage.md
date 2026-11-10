# F25 – lähdeselvityksen toinen vaihe (10.11.2026)

## Tulokset
- [F25-käännösten Draft PR #399](https://github.com/ozirix-dev/Reseptit/pull/399): kaikki **75/75** kieliluonnosta tallessa, viimeisin koko PR:n CI vihreä. Julkaistu F25:stä **0**.
- [FI-ohjeet #401](https://github.com/ozirix-dev/Reseptit/pull/401) ja [#403](https://github.com/ozirix-dev/Reseptit/pull/403) yhdistetty ja julkisen sivun Pages-ajo tarkistettu SUCCESS (merge-SHA `7498c6741cb19a21dfb419f1cbc7b1bf00423054`).
- 25 FI-lähteestä **16:lla** on `docs/nutrition/calculations/<recipe_id>.json`-syöte, 9:ltä puuttuu. Jokaisen olemassa olevan laskentatiedoston `reviewerStatus` on **AUTOMATED ONLY**. Ei väitettä riippumattomasta ravintoarvojen hyväksynnästä.
- **22/25** FI-lähteen julkinen teksti on korjattu SHA-lukitulla projektorilla; kolmessa muualla valmistusohje on jo ruokalajikohtainen. Kanoniset FI-raakalähteet ovat koskemattomia, joten vanhoja geneerisiä vaiheita esiintyy edelleen raakatekstissä.

## Ensimmäinen 5 reseptin merkityskatselmointijono

1. **`uunimuna-avokadot`** – Kaikki pääaineet grammoin; Q09 Fineli/AFCD-laskenta sisältää 200 g kuorettoman munan. FI-näyttöohje kypsentää mahdollisen ylimääräisen munan omassa vuoassa hävikin sijaan.

2. **`karibia-mango-limejogurtti`** – 2 annosta; 200 g mangoa, 100 g maustamatonta 3,9 % jogurttia, 15 g limemehua, 20 g kookosta. FI-kylmäohje korjattu; arvioi valinnaisen kuivan paahdon vaikutus ennen julkaisua.

3. **`lahi-ita-pistaasijogurtti`** – 2 annosta; 200 g jogurttia, 20 g pistaasia, 5 ml kulinaarista ruusuvettä, 60 g granaattiomenaa. Ruusuvesi rajattu laskennasta; tarkista käytetty elintarvikelaatu ja yläraja.

4. **`valimerellinen-jogurttikulho-hunajalla`** – 2 annosta; kreikkalainen jogurtti 100 g 7 %, hunaja 1 rkl = laskennassa 20 g, saksanpähkinä 30 g ja viikuna 50 g. Tuotteen ja mittamuunnoksen tarkistus riittää alustavaan julkaisuarvioon.

5. **`korealainen-gyeranbap-riisikulho`** – Riisi 100 g kuivana, 2 kananmunaa medium, 1 rkl soijakastiketta, 5 g noria. Ei punnittua öljyä: korjattu FI ohje kuivalla tarttumattomalla pannulla. Varmista paistettavuus ja täsmälliset muunnokset.

Näiden viiden EN/SV/TH-Draftin 15 valmistusohjeen läpiluvussa ei löytynyt ilmeistä puuttuvaa pääainesta tai annosmäärävirhettä. Kaikkien 15 määrien ja metatietojen yhtäsuuruus sisältyy jo F25:n automaattiseen rakennetarkistukseen. Tämä on **AI:n toimituksellinen esikatselmointi**, ei semanttisten SHA-parien hyväksyntä eikä natiivipuhujatarkistus. Ensimmäinen seuraava tekninen työ on lukita viiden FI:n julkinen, korjattu tekstiversio ja merkitä kieliversiokohtaiset merkityshavainnot. Vasta silloin voi avata main-pohjaisen julkaisu-PR:n tarkalle hyväksytylle osajoukolle.

## Avoimet esteet
- **9 ilman laskentasyötettä:** `rahka-marjakerroskulho`, `pohjoisafrikkalainen-maakouda`, `karibia-plantain-aamiaislautanen`, `munakoiso-kesakurpitsalasagne`, `intialainen-pinaatti-paneer-chilla`, `meksikolainen-chilaquiles-verdes`, `meksikolainen-paputostada-aamupalaksi`, `indonesialainen-nasi-goreng-aamiaisriisi`, `korealainen-kimchi-jeon-aamiaiseksi`. FI:n julkinen näyttö voi olla korjattu, mutta laskentaa ei saa keksiä eikä näitä merkitä julkaisukelpoisiksi.
- **11 kohdennettuun lähdetarkistukseen:** `japanilainen-hojicha-jogurtti-persimonilla`, `vietnamilainen-kahvijogurtti-banaanilla`, `vietnamilainen-papaija-kookospuuro`, `kiinalainen-soijamaito-aamiaisella`, `intialainen-besan-chilla`, `lahi-ita-zaatar-munat`, `thai-kananmunat-kookoscurryssa`, `vietnamilainen-banh-xeo-aamiaisletut`, `vietnamilainen-banh-cuon-sienilla`, `pohjoisafrikkalainen-baghrir`, `thai-roti-munalla-banaanilla`. Näillä on laskentasyöte, mutta ruoan rakenne, tuotteen vastaavuus, mittamuunnos, poisjätetty aines tai perinneruoan vastaavuus vaatii vielä ratkaisun.

Kaikki **25/25 `release_authorized: false`** säilyvät, kuten 21 SOURCE-HOLD ja neljä needs-chef-review -merkintää alkuperäisessä työjonossa. Pelkkä laskentatiedosto tai dokumentoitu kokkioikaisu ei saa ohittaa hyväksyntää. Toinen chat voi jatkaa yleistä 82 tapauksen laatuporttia ja uusien FI-reseptien ennakkotarkastusta; tämä työ koskee **vain F25-lähde- ja kielikatselmointia**.

Koneellisesti tarkistettava [päätösrekisteri](../../meta/kaannokset/f25-source-dispositions.json) sisältää 25 yksilöityä FI SHA:ta, evidenssitiedoston olemassaolon, riskin ja seuraavan toimenpiteen.

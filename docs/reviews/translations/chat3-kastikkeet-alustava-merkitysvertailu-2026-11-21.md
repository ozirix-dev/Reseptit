# Chat 3 – kastikkeiden nelikielinen alustava merkitysvertailu

**Päivä:** 21.11.2026
**Omistaja:** Chat 3
**PR:** #808
**Vertailtujen tiedostojen Git-revisio:** `00dfa0f73edcabf4890e38639ed5075442de197e` (muuttumaton tarkistushetken HEAD)

## Menetelmä ja rajaus

- Kymmenen suomenkielisen lähdereseptin ainesosat sekä niiden EN/SV/TH-vastineet tarkistettiin riveittäin: ainesosan luokka/laji, tuore/kypsä, rasva- ja maitotuotetyyppi, numeeriset määrät ja yksiköt.
- Valmistusvaiheiden lukumäärät, numerot, aikajaksot, lämpötilat ja `source_recipe`-viitteet verrattiin kaikissa 40 kielitiedostossa. Suomi–thai-valmistusvaiheet luettiin lisäksi merkityksen tasolla erikseen.
- **Alustavassa tarkistuksessa 10/10 reseptin aines- ja vaiheparien rakenteeseen ei jäänyt havaittua P0/P1-ristiriitaa**. Thaissa sanaa tarkoittava aika voi olla kirjoitettu numerona, vaikka FI-lähde kirjoittaa sen kirjaimin; tämä ei ole valmistusmuutos.
- Tämä on **ChatGPT:n alustava editoriaalinen katselmointi**, ei Codexin tekemä hyväksyntä, ihmisen tekemä riippumaton laadunvarmistus eikä automaattisen auditorin todistus kaikkien kieli-ilmausten virheettömyydestä. Älä luo tästä `meta/kaannokset/codex-review-evidence.json`-rekisteriin `outcome: pass` -tietuetta ilman projektin edellyttämää erillistä katselmointia.

## Tarkistusjoukko

| recipe_id | EN | SV | TH | Sisällöllinen huomio |
| --- | --- | --- | --- | --- |
| perinteinen-ruskea-kastike | alustava OK | alustava OK | alustava OK | Lihaliemi kuumennetaan, vehnäjauhot ruskistetaan 6–8 min, kastike haudutetaan 5 min; soija + mahdollinen vehnä |
| kermainen-tillikastike | alustava OK | alustava OK | alustava OK | Kylmä kermaviilipohja, tilli, 15 min kylmämaustuminen |
| kantarellikastike | alustava OK | alustava OK | alustava OK | Lajin tunnistus, 20 g vehnäjauhoja, 6–8 min haudutus, maito/vehnä |
| sinappikastike-joulukinkulle | alustava OK | alustava OK | alustava OK | Kaksi sinappia, kasvisliemi, suurustus ja 4–5 min haudutus, sinappiallergeeni |
| kylma-piparjuurikastike | alustava OK | alustava OK | alustava OK | Tuore raastettu piparjuuri, 15 min kylmämaustuminen, crème fraîche noin 12 % |
| perinteinen-munakastike | alustava OK | alustava OK | alustava OK | Valmiiksi kovaksi keitetty kananmuna, maito-vehnäsuurustus, 5 min haudutus |
| kermainen-pippurikastike | alustava OK | alustava OK | alustava OK | Murskattu mustapippuri 30 sek, kerma/liemi 8–10 min, Dijon-sinappi |
| perinteinen-valkokastike | alustava OK | alustava OK | alustava OK | Voi, vehnäjauho, täysmaito ja 4–5 min suurustus |
| puolukkakastike-jalkiruokiin | alustava OK | alustava OK | alustava OK | Marjat kiehautetaan 4–5 min ja osa jätetään kokonaisiksi; ei maidollista kastiketta |
| perinteinen-vaniljakastike | alustava OK | alustava OK | alustava OK | Täysmaito, maissitärkkelys, keltuainen, 82–85 °C; vältä voimakasta keittämistä |

## Havaitut ja korjatut merkityspuutteet

- Thain `นมสด` (yleinen tuore maito) täsmennettiin ilmaukseen `นมสดชนิดเต็มมันเนย`, joka vastaa FI:n **täysmaitoa**, kolmessa lähde–käännösparissa (munakastike, valkokastike, vaniljakastike).
- Piparjuurikastikkeen yleinen `ranskankermaa tai crème fraîchea` yksilöitiin kaikkien kielten ainesosissa **noin 12 % rasvaa sisältäväksi crème fraîcheksi**. Tämän tarkoitus on vähentää reseptin ja ravintolaskennan koostumusepävarmuutta; ei brändilukitus.
- Kantarellikastikkeen 20 g vehnäjauhoja ja suurustus, puolukkakastikkeen osittain kokonaiset marjat sekä kaikkien reseptien allergiariskit ovat mukana kaikissa kielissä.
- Kolmen korvatun havainnekuvan FI/EN/SV/TH-alt-tekstit vastaavat korjattua kuvasisältöä (kuva ei todista valmistusta).

## Avoimet portit

1. Kielitiedostojen ja FI-lähteiden **nykyiset merkitystiivisteet** on laskettava sivuston `semanticHash`-työkalulla ja kirjattava viralliseen katselmointirekisteriin vain todellisen käännöskatselmoinnin perusteella. Tämä raportti ei täytä Codex-review-porttia.
2. Tuote- ja ruokalajikohtainen ruokaturvallisuuden sekä allergeenitietojen loppuarvio ja kuvan sisällöllinen hyväksyntä ovat vielä kesken.
3. Kaikkien kymmenen reseptin **ravintoarvioevidenssi** puuttuu. Numeroitu GK ei ole hyväksytty; rekisterissä on perusteltu määrittämätön tila.
4. PR on edelleen **Draft / HOLD**, eikä lähdevertailu tai CI-PASS yksin anna Ready-/merge-/tuotantojulkaisulupaa.

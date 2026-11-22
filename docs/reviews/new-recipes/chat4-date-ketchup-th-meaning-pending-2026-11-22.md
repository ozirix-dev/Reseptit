# Chat-4 – taateliketsupin julkaistun TH-käännöksen merkityskorjausehdotus

Päiväys 2026-11-22. Työn omistaja Chat 4. Lähtö-main `a48864f7ec8d5fa0d4b1d8d88a8b0d76e8aa89e4`.

## Todistetut virheet nykyisessä TH-versiossa

FI-lähde: 3 g valkosipulinkynttä, noin yksi kynsi. TH-käännöksessä `กานพลูกระเทียม` sisältää `กานพลู`-termin, joka tarkoittaa neilikkaa (eri kasvi/mauste); `ประมาณหนึ่งเล็บ` tarkoittaa suunnilleen yhtä kynttä (fingernail), ei valkosipulinkynttä. TH:n korjaus on `กระเทียม 1 กลีบ` ja `ประมาณ 1 กลีบ`. 3 g säilyy.

FI-lähteessä 30 g vettä voidaan käyttää kastikkeen ohentamiseen; erillistä vettä käytetään taatelien liotukseen, ja liotusvesi kaadetaan pois. TH:n aiempi `ให้เติมน้ำสำหรับแช่อินทผาลัมด้วย` voi johtaa lisäämään liotusvettä kastikkeeseen, vaikka sekä FI että TH valmistusvaihe 1 käskevät sen pois. Korjattu TH huomautus erottaa ohennusveden liotusvedestä ja sanoo liotusveden poisheittämisen. Muita raaka-aineita, valmistusvaiheita tai ravintoarvoja ei muutettu.

## Lähdetuki

- Thaimaan perinteisen lääketieteen ja vaihtoehtolääketieteen osasto erottaa `กานพลู`-neilikan (Syzygium aromaticum): https://ttdkl.dtam.moph.go.th/Module1/frmc_show_monograph.aspx?h_id=ODc4
- Thaimaan lääketieteellisen tutkimuksen osaston Thai Herbal Pharmacopoeia erottaa `GARLIC CLOVES` eli valkosipulinkynnet: https://bdn-thp.dmsc.moph.go.th/ebook/qQqcAKtkpR9gC3q0GT5gMJq0qT5co3uw
- FI-reseptin oma valmistusvaihe määrää kaatamaan liotusveden pois.

## Julkaisu- ja katselmointirajat

TH on `status: published`. Edellinen `taateliketsuppi:th`-merkityshyväksyntä on 15.11.2026 ja koskee edellistä versiota. Tämä Chat-4:n tekemä korjausehdotus ei ole riippumaton Codex-merkityskatselmointi eikä anna lupaa julkaista. Tarvitaan koko FI→TH-parin ulkopuolinen katselmointi, sen todelliset semanttiset SHA-256 -tiivisteet ja hyväksyntätodiste; vasta sitten uusi CI ja Chat-1:n integraatiopäätös.

Myös EN:n `about one nail` ja SV:n `ungefär en spik` ovat samasta virheluokasta, mutta **niitä ei muuteta tässä rajatussa Chat-4:n TH-työssä**. Ne kirjataan erillisiksi korjaustarpeiksi, jotta kunkin julkaistun käännöksen näyttö päivitetään asianmukaisesti.

**Tila:** korjausehdotus omassa haarassa; ei julkaisuvalmis, ei muutosta hyväksyntärekisteriin.

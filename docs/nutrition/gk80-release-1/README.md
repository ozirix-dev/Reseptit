# GK-80 ensimmäinen julkaisuehdokas: neljä reseptiä

Tila DRAFT, OWNER_APPROVAL_REQUIRED. Pohja on main e8da2c9417e2aeff55a85d599b3b7e1ad465f36c.
Paketti sisältää vain neljä valittua reseptiä ja niiden laskennan. Tutkimuspinon historiaa ei siirretä.

Hu tieu noin 25, chao ga noin 30, bubur ayamin yksinkertainen perusversio noin 30 ja syötävän mintun
kaurapuuro noin 26 GK/annos. Kaikki ovat matalan luottamuksen mallinnettuja pisteitä.
Kasvisten GI 40 on julkaistu koodausoletus. Riisi-, nuudeli- ja kauravertailut ovat erikseen kuvattuja
valmistusanalogioita. Ne eivät ole tämän aterian mittauksia tai henkilökohtainen verensokeriennuste.

Omistajan hyväksyntä tarvitaan kasvisimputaatiolle, nimetyille valmistusanalogioille ja neljälle
täsmälliselle reseptiversiolle. Teknisesti toimiva Draft ei ole hyväksytty tuotantosisältö.
Paikallisessa ehdokasbuildissa tavoitellaan 87/326; tuotannon kattavuus on edelleen 83/326.

Kaikki neljä lähdereseptiä ovat tällä hetkellä vain suomeksi. EN/SV/TH-reseptitiedostoja ei ole.
Uusi mallinnetun arvion käyttöliittymämerkintä on FI/EN/SV/TH-kielillä. Käännösstatuksia ei nosteta
eikä ihmisen tekemää katselmointia väitetä. Myöhemmän käännöksen tulee vastata samaa reseptiversiota.

Ravintolaskelmat ja ainesosat on päivitetty samoihin grammapainoihin. Neljä makroa tarkistetaan
erikseen. Lähde- ja syötehashit estävät vanhentuneen arvon näyttämisen myös valmistustekstin muuttuessa.
Tarkoituksellinen muutos on neljän aiemmin keskeneräisen tuloksen valmistuminen; muut 322 tulosta
verrataan alkuperäiseen baselineen. Historiallista baselinea ei kirjoiteta uudelleen.

Bubur ja chao ga säilyttävät omat resepti-ID:t ja alkuperäpolut. Niiden tässä yksinkertaistetut
perussyötteet ovat samat; se ei tee resepteistä samaa. Bubur-version lisukkeita ei lasketa mukaan.
Minttuvariantin tuore minttu syödään, eikä siivilöidyn haudukkeen CHO:ta väitetä tunnetuksi.

Ei mergeä tai tuotantodeployta. CI ja paikalliset testit tarkistetaan täsmälliselle Draft-HEADille.

Paikallinen varmennus: 162 yksikkötestiä, 25 staattista testiä ja 27 käännöstestiä PASS.
Neljä uutta laskelmaa toistettiin Python Decimalilla. Muuttuneiden neljän reseptin sisältö- ja
ravintoevidenssi läpäisi validoinnin. TypeScript, Vite ja 691 reitin esirenderöinti valmistuivat.
Markdownlint: 843 tiedostoa, 0 virhettä.

Historialliset lähdekorjaustestit käyttävät neljälle tarkoituksella muutetulle reseptille jäädytettyä
ennen-kuvaa. Niiden baselinea tai odotuksia ei kirjoiteta uudelleen. Erillinen nykyisen 326 tuloksen
regressio todistaa täsmälleen neljä valmistuvaa arviota ja muiden 322 tuloksen täydet tuloshashit
muuttumattomiksi. Historiallinen testinäkymä tarkistaa myös muiden reseptien mismatch-listat.

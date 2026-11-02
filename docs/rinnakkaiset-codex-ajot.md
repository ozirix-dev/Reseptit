# Rinnakkaisten Codex-ajojen toimintatapa

Pysyvä projektikäytäntö, kirjattu 2.11.2026. Lyhyt ennen työn aloittamista
luettava sääntö on repon [AGENTS.md](../AGENTS.md)-tiedostossa.

## Yksi kirjoittaja kutakin PR-haaraa kohti

> Jokainen rinnakkainen Codex-ajokerta käyttää omaa Git-worktreetä ja haaraa.
> Vain yksi nimetty vastuurooli saa kirjoittaa tiettyyn PR-haaraan ja sen
> työpuuhun. Muut ajot luovuttavat työnsä erillisinä committeina tai
> versionlukittuina aineistoina. Ready-tilassa oleva PR ei vastaanota uusia
> tutkimuseriä ilman erillistä sisältörajausta ja sovittua integraatiota.

Rinnakkaisuus ei edellytä kahta Codex-asennusta tai eri malleja. Tarvitaan
erilliset istunnot, työhakemistot, haarat ja vastuualueet. Codex1 ja Codex2
ovat istuntojen tunnisteita. Työnjakoa kuvaavat nimet **Codex Julkaisu** ja
**Codex Tutkimus** kertovat paremmin, mitä kukin tekee.

Kaksi erillistä worktreetä ei yksin riitä, jos molemmat ajot lopulta
kirjoittavat samaan PR-haaraan. Myöskään oikea repository tai repo_guardin
PASS ei varaa haaraa yhdelle kirjoittajalle.

## Roolit ja vastuut

| Rooli | Vastuu | Kirjoituskohde |
| --- | --- | --- |
| Käyttäjä / työnjohtaja | Yhteinen tavoite, työnjako, sisältöpäätökset ja julkaisuvaltuudet | Päätökset ja rajaukset |
| Codex Julkaisu | Hyväksytyn erän integraatio, käyttöliittymä, tarkistukset ja julkaisun valmistelu | Oma worktree ja nimetty PR-haara |
| Codex Tutkimus | GI-lähteet, GK-menetelmät ja seuraavien reseptierien päätöspaketit | Oma tutkimustyöpuu ja haara |
| Erillinen katselmoija tarvittaessa | Rajatun muutoksen riippumaton tarkistus | Lukutarkistus; korjausehdotukset luovutetaan vastuulliselle |

Reseptit-projektin ensimmäisessä kokeilussa Codex1 toimi julkaisijana ja
vastasi PR #183:sta. Codex2 toimi tutkimusagenttina. Nämä numerot tai PR-numero
eivät nimeä pysyvää omistajaa kaikkiin tuleviin tehtäviin: vastuullinen
kirjataan jokaisen ajon alussa.

Yhteinen tulosaineisto sisältää reseptitunnisteet, lähdeviitteet,
syötehashit, menetelmärajaukset ja päätökset. Tuotteen varsinainen lähde- ja
päätösaineisto säilyy Reseptit-repossa. ReportHub toimii raportointi- ja
luovutustasona, josta viitataan täsmälliseen aineistoversioon. Se ei korvaa
repon lähdekatalogia tai hyväksyntäkirjausta.

## Istunto, worktree, haara ja PR:n vastuullinen

| Käsite | Merkitys |
| --- | --- |
| Codex1 ja Codex2 | Kahden ajon tunnisteet, eivät eri ohjelmia tai malliversioita |
| Codex-istunto | Oma keskustelu, tehtävä ja työskentelykonteksti |
| Git-worktree | Oma fyysinen työhakemisto; Gitin objektit voivat silti olla yhteisiä |
| Git-haara | Muutosten ja committien oma kehityslinja |
| PR:n kirjoittava vastuullinen | Ainoa nimetty ajo, joka päivittää kyseistä PR-haaraa ja sen työpuuta |

Toisen ajon työhakemistoa ei käytetä omien muutosten tekemiseen. Toisen
haaraa ei oteta väkisin käyttöön, siirretä, palauteta tai ylikirjoiteta.
Likainen tai toisen ajon omistama työpuu ei ole vapaata työtilaa.

## Ajon alussa kirjattava työrajaus

Jokainen kirjoittava ajo kirjaa vähintään seuraavat tiedot omaan
tehtävämuistioonsa tai luovutukseensa. Pelkkä projektin sivupalkkinimi ei
varmenna oikeaa repositorya.

```text
Ajon tunniste ja rooli: Codex Tutkimus / tehtävän yksilöivä nimi
Tarkoitettu repo: ozirix-dev/Reseptit
Worktree: tämän ajon oma absoluuttinen hakemisto
Git-haara: codex/tehtavan-nimi
Kirjoitusoikeus: vain tämä worktree, haara ja sovitut tiedostot
PR:n kirjoittava vastuullinen: nimetty ajo tai ei vielä PR:ää
Luovutuskohde: nimetty integraatioajo tai käyttäjä
Lähtö-HEAD ja tarkistushetki: täsmällinen commit ja ajankohta
Hyväksytyt vaiheet ja julkaisuvaltuus: mitä käyttäjä on jo valtuuttanut
```

Repository varmistetaan repo_guardilla ennen muutoksia ja uudelleen
työhakemiston, repon tai tehtävärajan vaihtuessa. Repo_guardin write-,
commit-, push- ja PR-operaatioita käytetään projektin voimassa olevien
ohjeiden mukaan. Tämä toimintatapa ei anna poikkeusta niihin.

Ennen muutosta omaan PR-haaraan ja ennen pushia tarkistetaan etä-HEAD sekä
PR:n vaihe. Odottamaton muutos tai toinen kirjoittaja keskeyttää kyseiseen
haaraan kirjoittamisen. Oma työ säilytetään omassa haarassa ja ristiriita
tuodaan käyttäjälle. Toisen työn palautus tai ylimääräinen julkaisuajo ei
ole automaattinen korjauskeino.

## Tutkimuksesta integraatioon

Tutkimusajo toimittaa yhden tarkistettavan luovutuspaketin:

- lähdehaara ja täsmällinen commit-tunniste;
- reseptitunnisteet ja valittujen versioiden syötehashit;
- yhteiset lähdeviitteet, kenttämääritelmät ja normalisointitapa;
- menetelmä- ja sisältöpäätökset sekä jo saadun hyväksynnän tarkka rajaus;
- uudet uniikit numeeriset ehdokkaat, avoimet tapaukset ja kattavuusvaikutus;
- tehdyt tarpeelliset tarkistukset ja jäljellä olevat rajoitukset.

Samoja lähdetietoja ei kopioida jokaiselle reseptiriville. Vaihtoehtoiset
versiot yhdestä reseptistä eivät moninkertaista kattavuutta. Laskennan
onnistuminen erotetaan lähdekelpoisuudesta, sisältöhyväksynnästä ja
julkaisemisesta.

Julkaisuhaaran vastuullinen lukee paketin ja ottaa sovitun erän käyttöön
sovitussa siirtokohdassa. Esimerkiksi kuusi uutta GK-versiota jäävät
tutkimushaaraan, kunnes nykyinen julkaisu on valmis tai seuraavan erän
integraatio on erikseen rajattu.

**Lupa integraatioon ei yksin siirrä PR-haaran kirjoitusvastuuta.**
Tutkimusagentti ei kirjoita julkaisijan työpuuhun hyväksyttyäkään erää.
Vastuunsiirto nimetään selvästi, ja edellinen kirjoittaja lopettaa ensin
haaraan kirjoittamisen. Jo annettua, tehtävään soveltuvaa lupaa ei kysytä
uudelleen; uusi päätös tarvitaan vain, jos sisältörajaus tai tarvittava
valtuus muuttuu.

## Ready on rajattu julkaisuehdokas

Ready-PR:ään tehdään enää sovittuja korjauksia sen nimetyn vastuullisen
kautta. Uusia tutkimuseriä ei lisätä siihen muun työn ohessa. Jos uusi erä
halutaan samaan PR:ään, muutoksen laajuus ja tarvittava katselmointi sovitaan
ennen integraatiota.

Hyväksyntä, katselmointi ja CI sidotaan tarkistettuun HEADiin ja sisältöön.
Aiemman HEADin PASS ei ole uuden HEADin CI-tulos. Sisältöhyväksyntä tai
Ready-siirtymä ei itsessään anna merge- tai deploy-valtuutta. Käyttäjän jo
antamat valtuudet ja projektin julkaisusäännöt määräävät seuraavat vaiheet.

Palautuksen tai haaran vaihdon jälkeen tarkistetaan tarvittaessa myös
paikalliset generoidut aineistot. Gitin puhdas työpuu ei takaa, että
ignored-tulokset tai paikallinen esikatselu vastaavat nykyistä HEADia.
Vanhat raportit merkitään tilannekuviksi, ja nykytilan yhteenveto erotetaan
niistä.

## Kolme tai neljä rinnakkaista ajoa

Sama periaate säilyy: jokaisella kirjoittavalla ajolla on oma worktree ja
haara, ja jokaisella PR-haaralla yksi kirjoittava vastuullinen. Lisärooleja
voivat olla esimerkiksi lähdehaku, riippumaton auditointi tai rajattu
käyttöliittymätyö.

Lisäajo otetaan mukaan vain, jos sillä on itsenäinen, rajattavissa oleva
tehtävä. Muuten koordinointi, päällekkäinen tutkimus ja tokenikulutus voivat
kasvaa enemmän kuin hyöty. Tämä ohje ei käynnistä uusia istuntoja tai
aliagentteja automaattisesti.

## Ohjeen käyttöönotto

Projektitason sääntö tulee mainista aloitettaviin uusiin työpuihin, kun
AGENTS.md-muutos on yhdistetty. Jo käynnissä oleva ajo lukee päivitetyn ohjeen
ennen seuraavaa kirjoitusvaihetta; pelkkä ohjeen merge ei päivitä sen
keskustelukontekstia tai erillistä työpuuta automaattisesti. Ohjeen tuonti
olemassa olevaan haaraan tehdään sen nimetyn kirjoittavan vastuullisen kautta.

## Perusta ja mahdollinen automaatio

Käytäntö perustuu
[ensimmäisen rinnakkaisajon tapaustutkimukseen, luku14](https://github.com/ozirix-dev/Reseptit/blob/41972e2239ad8b1724053b5e7100c90120679e37/docs/reports/kahden_codex_agentin_rinnakkaisajo_raportti_2026-11-02.md).
Siinä yhteinen julkaisuhaara johti ylimääräiseen erottelucommittiin ja
CI-kierrokseen. Tutkimustyö säilytettiin omassa haarassaan.

Tämä on projektiohje, ei tekninen kirjoituslukko. Ajon tunnisteen,
worktreen, haaran ja PR-vastuullisen automaattinen tarkistus voidaan
toteuttaa myöhemmin erillisenä työnä. Repo_guardin nykyistä
repository-tarkistusta ei kutsuta tällaiseksi lukoksi.

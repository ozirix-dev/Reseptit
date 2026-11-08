# Alueelliset GI-tutkimuslähteet – rajattu aineiston vastaanotto (5.11.2026)

**Tutkimusaineisto, ei tuotannon GI-rekisteri eikä GK-laskennan hyväksyntä.**

## Mitä imuri oikeasti haki?

Viiden lähdekokonaisuuden yksilöidyt tutkimukset (DOI, julkaisu, tutkimusjoukko, mitta-asteikko, lähdetaulukko, lisenssimerkintä), **21 tarkistettavaksi rajattua GI-havaintoa** neljästä alkuperäisestä ihmis-GI-tutkimuksesta sekä **8 tarkasteltua resepti–tutkimus-vertailua**.

Lähteenä ollut vuoden 2021 ei-länsimaisten ruokien kooste sisältää **940 ruokamerkintää 159 tutkimuksesta**. Se on jo Reseptit-rekisterin `nonwestern-compendium-2021`-lähde. Tässä vastaanotetaan sen **lähdeviite ja deduplikointipolku**, **ei kopioida 940 riviä uudeksi tuotantorekisteriksi**. Sama ihmisillä mitattu havainto voi olla useassa koosteessa.

## Tiedostot

- `sources.json` – viisi alkuperäis- ja koontilähdettä, käyttöoikeusportit, vastaanoton tila.
- `observations.json` – 21 GI-faktahavaintoa, aina alkuperäiseen tutkimukseen ja taulukon kohtaan sidottuna. **Ei automaattisesti valmistusvastinetta Reseptit-reseptiin**.
- `recipe-matches.json` – kahdeksan nykyiseen main-blob-SHA:han sidottua vaihtoehtovertailua, myös tarkoitukselliset `NOT_APPLICABLE`-tapaukset.

## Tutkimusten hyöty

| Ryhmä | Tutkimuksessa mitattuja ruokia | Tässä vastaanotettuja faktaehdokkaita | Arvio |
| --- | ---: | ---: | --- |
| [Devindra ym. 2022, Etelä-Intia](https://doi.org/10.1007/s13197-022-05368-6) | 23 | 5 | Pesarattu, dosa, idli-sambar ja biryani; reseptiversioiden erot tarkistettava |
| [Shobana ym. 2022, Intia](https://doi.org/10.4103/ijmr.IJMR_1935_19) | 12 | 4 | Sundal ja upma, mutta broken wheat ≠ semolina |
| [Namjud ym. 2024, Thaimaa](https://doi.org/10.3389/fnut.2024.1452602) | 8 | 8 | Koko kahdeksan tuotteen GI-faktaa CC BY -julkaisusta; ei suoraa sovellusta mango-kookosriisiin |
| [Kim ym. 2019, Korea](https://doi.org/10.1017/S0007114518003446) | 49 | 4 | Riisipuuron valmistusverrokit; tutkimus **jo osin aiemmassa GK-työssä** |
| [Henry ym. 2021, ei-länsimaisten kooste](https://doi.org/10.1038/s41387-020-00145-w) | 940 merkintää | 0 (lähdehakemisto) | Jo lähderekisterissä. Päällekkäisyys- ja alkuperäislähdeselvitys ennen käyttöä |

Yhteensä neljä alkuperäistutkimusta mittasi **92 ruokakohdetta**. Luvut eivät ole 92 uutta Reseptit-GI-arvoa, eivätkä eri tutkimusten kohteet automaattisesti vastaa 92 omaa reseptiä.

## Mitä lähteistä voi käyttää?

- Thaimaan artikkeli [Frontiers 2024](https://www.frontiersin.org/journals/nutrition/articles/10.3389/fnut.2024.1452602/full) on **CC BY**. Nimeä tekijät, julkaisu ja lisenssi; erilliset taulukot/kuvat ja alkuperäistutkimusketjut tarkistetaan ennen laajaa kaupallista tuontia.
- Vuoden 2021 [Non-Western Compendium](https://www.nature.com/articles/s41387-020-00145-w) on **CC BY 4.0**, mutta sen taulukon alkuperäistutkimusten itsenäisyys, menetelmät ja mahdolliset kolmannen osapuolen oikeudet selvitetään ennen uudelleenkäyttöä.
- [Shobana 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC9552392/) julkaistiin Indian Journal of Medical Research -lehdessä. Sen ilmoitetut **CC BY-NC-SA** -käyttörajoitukset eivät anna automaattista laajaa kaupallista uudelleenjulkaisuoikeutta. Tässä vain rajatut viitatut faktat.
- [Devindra 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC9304465/) ja [Korean 2019](https://doi.org/10.1017/S0007114518003446) -tutkimuksen artikkeleiden koko sisällön ja taulukkomassan jälleenkäyttöoikeus on tämän vastaanoton osalta **tarkistamatta**. Rajattuja mittaustuloksia käytetään lähdeviitteinä, ei wholesale-kopioina.
- **GI-arvo > 100 ei ole välttämättä virhe.** Thaimaan Khao Tan -riisikeksille raportoitiin GI 149,3; sen merkitys säilyy tutkimushavaintona, ei kaikkien riisikeksien vakioarvona.

## Lähde/menetelmä/valmistusportit

1. Päivitä tarvittaessa lähdeviitteiden lisenssi- ja mittauslaatutiedot **erillisen GI Knowledge Base -katselmoinnin** jälkeen.
2. Tarkista kaksi samaa alkuperäistutkimusta lainaavaa koostetta saman riippumattoman havainnon *yhdeksi* alkuperäksi (DOI + ruoka + valmistus + tutkimuskohortti + viiteasteikko).
3. Tarkista alkuperäisruoan raaka/kypsä/kuiva tila, mausteet, lisukkeet, fermentointi, annospaino ja glykeemisen hiilihydraatin määritelmä. Pesarattu, idli tai jauhopohja eivät saa kategorista GI-ennakkoarvoa.
4. Valmistekohtainen ja lähdekohtainen hyväksyntä erikseen. `NEEDS_REVIEW` ja `NOT_APPLICABLE_AS_WHOLE_RECIPE` ovat **tarkoituksellisia**, eivät puuttuvan tiedon nollia.
5. Käytä paikallista GI SQLite -hakua ja nykyistä 64 tietueen `glycemic-index-records.json`-rekisteriä; tämä dossier **ei lisää** siihen automaattisesti havaintoja.
6. GK100:n alkuperäinen 156/327-tilannekuva ja 87 erillisversiota **eivät muutu** tässä tutkimus-PR:ssä. Tarkista luvut toteutuksessa aina senhetkisestä mainista.

## Seuraava pieni koe

Valitse ensin viisi soveltuvuuskatselmointia: pesarattu, yksi dosa-komponentti, Korean kasvisjuk, Thai kanajok ja gyeranbap-riisikulho. Ratkaise `EXACT/ JUSTIFIED_ANALOGUE / NOT_APPLICABLE / NEEDS_REVIEW` lähteen alkuperäisellä valmistuskuvauksella. **Älä laske uusia GK-lukuja** ennen kuin sekä muiden ainesosien hiilihydraatit että kaikki GI-sidokset läpäisevät menetelmäportit.

## Rinnakkaistyö ja julkaisu

[Lähdekartoitus ReportHub PR #97](https://github.com/ozirix-dev/ReportHub/pull/97) on taustakonteksti. Toisen istunnon Sydney GI Search -tutkimus on erillinen. Suunnitelma [GK #297](https://github.com/ozirix-dev/Reseptit/pull/297) tekee B/C-laskentalinjojen hyväksyntärajat. Tämä PR ei muokkaa noiden haarojen tiedostoja, yhteisiä laskentatestejä, Approval Factorya, reseptejä eikä tuotantodeployta. **EI mergeä tai deployta ilman omistajan päätöstä.**

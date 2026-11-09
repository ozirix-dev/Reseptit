# B14 — neljän reseptin / 12 EN–SV–TH-käännöksen merkityskatselmointi

**Päivä:** 9.11.2026. **Tarkistaja:** ChatGPT (AI-merkitysvertailu), ei ihmiskatselmointia eikä koepaistoa. FI-lähde `main` ec8d5e766bc4c9f1dcf34761677c0ffba0c2b6fc; Draft-lähde PR #356, commit 87491256ea6fca097054af43b4ee097518143881.

## Rajaus

Neljä jo julkaistua FI-reseptiä × EN, SV, TH = 12 julkaisuun ehdotettua kieliversiota. Suomenkieliset lähdetiedostot, GI/GK-laskenta, ravintoarvot ja GK80/GK100-lähdelukot säilyvät ennallaan. Julkaisun kelpoisuus sidotaan erilliseen `meta/kaannokset/published-translation-pairs.json`-sivurekisteriin ja 12 yksilöityyn source_hash/translation_hash-todisteriviin. SHA todistaa version, EI itsessään merkityksen oikeellisuutta.

| FI-resepti | AI:n FI/EN/SV/TH-merkitysvertailun ydinkohdat, sisältäen thai-takaisinkäännöksen |
| --- | --- |
| `kana-yakitori-kaalilla` | Broilerin reisiliha 500 g, soijakastike 2 rkl (ei tamari), mirin 1 rkl, seesamiöljy 1 tl ja keräkaali 400 g. Puuvartaiden liotus 20 min; kana 10–12 min / sisälämpö vähintään **75 °C**; kaali 4–5 min. **Raakaa kanaa koskettanutta kastiketta ei käytetä valmiiseen annokseen** eikä miriniä korvata laskentaversion ulkopuolisella vedellä/etikalla. Thai sisältää erillisen puhtaan kastike-erän ohjeen. |
| `pho-bo` | Naudan keittoluut 1 500 g, vettä 4 000 ml, paahtopaisti 400 g ja kuivat riisinuudelit 400 g; yhteensä 15 ainesosariviä. Uuni 230 °C / 20 min, luut esikiehautetaan 5 min ja vesi kaadetaan pois; liemi 2 h + 60 min. **Naudanlihan viipaleet kypsennetään erikseen kuumassa liemessä 63 °C sisälämpöön ja niitä lepuutetaan 3 min**, ei pelkkää liemen kaatamista raakaan lihaan. Thai ja ruotsi säilyttävät turvallisuusrajan. |
| `thai-riisinuudelikeitto-aamuksi` | Riisivermiselli 100 g kuivapaino, kana 150 g raakapaino, kanaliemi 700 g, limetin hedelmäliha 50 g mehuineen ja korianteri 6 g. Nuudelit keitetään ja valutetaan; kanan sisälämpö vähintään **75 °C**; kaikki liemi ja annoksen neste mukana. Dry-to-cooked-ravintoproxy pysyy arvioituna, ei mittaamattomia hävikkejä. Thai säilyttää rajaehdot. |
| `thai-kai-jiao-yrteilla` | Kananmuna 110 g ilman kuorta; kalakastike 15 g, 5 g basilikaa thaibasilikan ravintoproxyna, kevätsipuli 20 g, rypsiöljy 10 g. Paisto rapeareunaiseksi ja kauttaaltaan kypsäksi. Thai-teksti erottelee kaupallisen kalakastikkeen AFCD-koostumusproxyn ja tavallisen basilikan koostumusproxyn; ei väitettä Squid-merkkisestä mittauksesta. |

16 FI+EN/SV/TH-tiedoston AI-esitarkistus: kaikki 12 käännöstä vastaavat FI-lähteen ainesosamääriä, annoksia, valmistusaikaa, makrojen nykyisiä arvoja ja kuvan tiedostoa. Lähteessä numeroina olevat lämpötilat ja kestot löytyivät kaikista kolmesta kieliversiosta. Tarkistettu raakakypsä-, allergia-, vesi-/valutussäilytys-, ravintovarmuus- ja kielteiset valmistusmerkitykset. Ei AI-vertailussa tunnistettuja avoimia P0/P1-esteitä. Käyttöliittymän joissakin tageissa esiintyy edelleen suomea; P2-UX-seuranta, ei muuta laskentaa.

## HOLD-rajat, eivät mukana

PR #356:een jätetään kuusi FI-reseptiä / 18 Draft-käännöstä: kolme GK/FI-lähde-HOLDia (harissa-shakshuka, munakasmuffinit, tonnikalamunakkaat), kookosriisin keittäminen vs `cooking_method: paistaminen`, sekä kaksi kanariisipuuroa, joiden 45 minuutin kokonaisaika on valmistusvaiheiden kannalta tarkistamatta. Erilliset lähdekorjaukset ja GK-sidokset ennen niiden julkaisemista.

## Julkaisuportti

- [ ] **Saman HEADin** changed-content, strict translation audit ja valitut unit-testit PASS
- [ ] Merkitse Ready ja yhdistä vasta, kun koko kyseisen HEADin PR-CI on SUCCESS
- [ ] Seuraa yhdistämiscommitin Pages-build ja Pages-deploy erikseen
- [ ] Jos CI antaa yksilöidyn korjattavan virheen, enintään yksi tarkka uusintakorjaus; muussa tapauksessa STOP ja HOLD, ei sokkona yrityksiä.

# Luovutus Codex Julkaisu -omistajalle

**Neljä aiempaa lähde-/sisältöhyväksyntää ovat voimassa ja valmiita rajattuun integraatiovalmisteluun.** Nykyisessä mainissa ei vielä ole niiden julkisia GK-only-adaptereita. Tätä ei kutsuta valmiiksi tuotantojulkaisuksi. Luovuttaja ei kirjoita julkaisijan haaraan eikä toisen ajon PR:ään.

| Resepti | Täsmällinen syöte | Laskettu GK-osa | Positiivinen poisjättö gCHO/annos | Tila |
| --- | --- | ---: | ---: | --- |
| rahkapiirakka-vhh | `4194712a2cecb7979c779f4479a1f0a92bf402e190c4ff66a2369667455acbd4` |0,45 |1,736875 |`READY_FOR_PUBLICATION_INTEGRATION_PREPARATION` |
| bulgogi | `5ae159afc878044788f07f23db47c2932168760d4f8020e5ec3d9b553f7e83c1` |41,31 |0,0670125 |`READY_FOR_PUBLICATION_INTEGRATION_PREPARATION` |
| rahka-marjakerroskulho |`092719e24df715f0149468125c91e24c08a5dffb29ba2d2f712bb779bd4bdc86` |2,34 |0,67 |`READY_FOR_PUBLICATION_INTEGRATION_PREPARATION` |
| kaakao-kookos-chia |`dfcb1006838f327d6dc368dbdd647180f4be3305b82518e99f88b8d25f71f8b2` |0,22 |0,9625 |`APPROVED_HANDOFF_NATIVE_ML_ADAPTER_REQUIRED` |

Lähdehaara`codex/afcd-polyol-03-gk80-handoff`, lopputarkistuksen hyväksyntäcommit`2a626c560873c0d414508522e1a1173f244f9d1c`; aloituscommit`429f397472d6970006fd3c6c906b9da533c38c46`. Hyväksyntäkuitit:[existing-approvals.json](existing-approvals.json). Kuittien katselmoidut sisältöcommitit ovat rahkapiirakalle`991f94ea6ba5aeae2d07fc45fdc5a574de07acde` ja bulgogille`20e77b57346cf97a4f2aa510ecdbfb8ea5ffe1f3`. Kolmen hyväksyntäkuitin pakettien kaikki tiedostohashit vastaavat nykyistä tutkimusversiota ja alkuperäistä hyväksyttyä committia. Alkuperäisten reseptien nyky-mainin FI/EN/SV/TH-hashit on tarkistettu siltä osin kuin kieliversio on olemassa. Kylmien jälkiruokien katselmoitu sisältöcommit on`7272e71ecc33cae6d6183320e6b24331c6e0fdb4`; molempien A-versioiden kuitti on lopputarkistuksen2a626c5:ssä.

## Varmennetut tekniset edellytykset ja vielä toteutettavat portit

| Ehto | Nyt varmennettu | Julkaisijan toteutus/vastaanottotarkistus |
| --- | --- | --- |
| GK-only ja makroerottelu | Nykyinen`GkOnlyVariant` tukee A-pistettä,positiivista poisjättöä,LOW-varmuutta ja`NO_MACRO_PACKAGE_FOR_THIS_VERSION`. Reseptitunnukset puuttuvat yhä julkisesta numerokattavuudesta. | Sido uusi versio hashilla; älä peri näiden reseptien alkuperäisiä makronumeroita,hyväksyntöjä tai pidätyksiä uuden version makropaketiksi. |
| Lähde- ja syötesinetit | Hyväksyntäkuitit,alkuperäisreseptit,lähdekatalogit ja Decimal-pisteet PASS. | Tuo vain hyväksytty syöte ja käytetyt lähteet; uusi adapteri tarkistaa ne. Ei yleistä lähdeperheen vapauttamista. |
| Rahkapiirakan MEXT | Kaksi alkuperäistyökirjaa ja solutP435/O359 vahvistavat05001:n5,2. Manteli0,975g/annos;0,025g marginaali hyväksytty kuitissa. | Nykyinen kuuden A-version adapteri rajaa MEXTin04046-nattoon. Lisää erillinen05001-kohtainen hyväksyntäsidonta julkaisijan PR:ssä; älä laajenna vanhaa04046-hyväksyntää tai vaihda natiivipistettä yleiseksi mantelijauhoksi. |
| Bulgogin massa/valmistus |600g nauta,300g **kuiva** jasmiiniriisi,100g päärynä ja4 annosta säilyvät; koko marinadi ja pannunesteet mukaan. GI-riisi68,sakkaroosi60,päärynä38 ja nykyiset nimetyt koodit hyväksytty rajattuina sovelluksina. | Ei kypsän riisin koostumusta300g kuivamassaan. Päärynä on lyhyesti kuumennetun marinadin LOW-analogia,fariinisokeri sakkaroosivaltainen analogia. |
| Nollan massamerkit | Bulgogin seesamiöljy1rkl ja piirakan Foodin-erytritoli2rkl säilyvät ohjeessa.0g on vain laskennallinen eksplisiittisen nolla-CHO:n sentinel. | Julkinen esitys ei saa poistaa ainesosaa tai väittää alkuperäistä määrää0g:ksi. |
| Kielet ja annosskaalaus | Sopimus tarvitsee FI/EN/SV/TH-tekstit; rahkapiirakasta on neljä alkuperäiskieltä,bulgogista vainFI. | Kirjoita nelikielinen uuden version esitys,lähderajoitteet ja skaalautuvat punnitut määrät. LähdepaketinFI-only ei ole kielikatselmoinnin PASS. |
| Aktivointi ja julkaisu | Ei adapteria/aktivointia tässä PR:ssä; kolme kuittia sallii myöhemmän nimetyn omistajan integraation. | Oma rajattu julkaisu-PR,tarpeelliset integraatio-/UI-/regressioportit ja myöhemmin täsmällinen merge/deploy-valtuus. Ei vanhaa tutkimushaaraa kokonaisena mainiin. |

Rahkapiirakkaa ei merkitä`RELEASE_READY`-tilaan ennen05001-sidonnan,nelikielisen esityksen ja macroScope-portin todellista integraatiotarkistusta. Lähde- ja sisältöhyväksyntää ei silti avata uudelleen. Sama teknisen toteutuksen ja sisällön hyväksynnän ero koskee bulgogia.

## Kahden uuden hyväksytyn A-jälkiruoan tekninen lisäraja

Marjakulhon A2,34 on täsmälleen aiempi092719…-syöte; se tarvitsee uuden hyväksyntään sidotun adapterin ja nelikielisen julkisen kopion. Ei metsämustikan B-sidonnan hyväksyntää.

Kaakao-kookos-chian A0,22-syöte käyttää **200ml** Koko UK -kylmäjuomaa valmistajan **0,4g/100ml** -perusteella ja **20g jo paahdettua** Urtekram DK1003481 -tuotetta. Nykyisen`GkOnlyVariant.ingredients`-rajapinnan määrä on vain`grams:number|null`; se ei sellaisenaan esitä millilitramäärää oikein. Julkaisijan on toteutettava rajattu lähteen omaa tilavuusyksikköä säilyttävä esitys ja annosskaalaus tai pidettävä tämä hyväksytty versio vielä integraatio-HOLDissa.200ml:aa ei saa kirjoittaa200g:ksi tai siirtää lähteettömän tiheyden kautta. Tämä on todellinen tekninen portti,ei puuttuva omistajan sisältöhyväksyntä.

Kaakao-A0,22:n julkisessa tekstissä on näkyvä0,9625gCHO/annos positiivinen poisjättö ja rajaus vain kermarivin laskettuun osuuteen. Katettu0,725gCHO on poisjätettyä pienempi. Omistajan hyväksymää rajoitetta ei piiloteta pienen numeron taakse; plant50/trace50:n vanhaa B1,59:ää ei aktivoida sen korvikkeeksi.

## Pienin järkevä seuraava erä

1. Integroi **rahkapiirakka ja bulgogi** julkaisijan omassa uudessa haarassa. Ne antavat pienimmän järkevän jo hyväksytyn erän: myöhempi onnistunut julkaisu181/326=55,52%,alkuperäisohjeiden156 ennallaan,GK-only25,vaje80.
2. Marjakulhon jo hyväksytty A2,34 voidaan liittää erikseen rajattuna ennen erän lukitusta tai seuraavaan erään:182/326=55,83%,vaje79. Samaa hyväksyntää ei kysytä uudelleen.
3. Kaakao-kookos-chian jo hyväksytty A0,22 voi seurata lähteen omaa millilitraperustetta säilyttävän teknisen adapterin jälkeen. Kaikkien neljän onnistunut julkaisu183/326=56,13%,GK-only27,vaje78.
4. Kaksi chilla-B:tä ovat tämän paketin uudet omistajapäätösesitykset,erillään A-erästä. Kaakao-B1,59 ja metsämustikka-B2,41 eivät lisää reseptimäärää. Ven pongal,jerk ja sate eivät kuulu julkaisuvalmisteluun.

Katselmoinnin todellinen kattavuuslisäys0. Pienimmän seuraavan erän realistinen lisäys2; jo hyväksytyillä A-jatkoilla yhteensä4 teknisten porttien valmistuttua. Tutkimusjoukon39/71 tai avoimienPR:ien määrää ei käytetä kattavuusennusteena. Muuttuneista lähteistä tarkistetaan vain kyseiset sidonnat; ei uutta326 reseptin kampanjaa.

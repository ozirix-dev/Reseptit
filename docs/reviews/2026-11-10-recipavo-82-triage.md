# Recipavo: 82 reseptiauditin osuman rinnakkainen luokittelu (10.11.2026)

## Tausta ja luotettavuus

Lähde on [PR #358:n 9.11.2026 tarkennettu CI-audit](https://github.com/ozirix-dev/Reseptit/actions/runs/42653845603/artifacts/13691537441): **335 julkaistua FI-reseptiä, 82 heuristista osumaa**. Auditissa on mm. ainesosalisäyksiä, lisukkeita, yleisohjepohjia ja negatiivisia lauseita. Raportti ei tee 82:sta vahvistettua virhettä.

**Ensimmäisen luokittelun tulos:** 38 HOLD-tarkistettavaa, 16 toimituksellista ja 28 todennäköistä väärää osumaa. Yhteensä 82. Tila on **ALUSTAVA**; kaikki 82 nykyistä julkista näyttöversiota eivät ole vielä erikseen varmistettuja. Useita näytteitä tarkistettu suoraan `main`-haaran FI-tiedostoista. Raportin luokat ovat työjonon ensisijaisuusarvioita, eivät lopullisia julkaisupäätöksiä.

### Rinnakkaistyön raja

Tämä PR omistaa **vain tämän dokumentin**. Ei kosketa reseptien Markdownia, näyttöprojektoreita, kuvia, käännöksiä, ravinto-/GI/GK-aineistoa eikä CI:tä. Toisen keskustelun kokkikorjaus-PR:t, esim. #359, #360, #362 ja #401, saavat jatkaa. Ennen minkään korjauksen tekemistä tarkistetaan uusimmat PR:t ja kyseisen reseptin Git-blob-SHA. Jos SHA tai näyttöprojektio muuttuu, rivi on STALE ja katselmoidaan uudelleen.

### Päätösluokat

- **HOLD-tarkistettava:** yleispohjainen/väärän ruoan valmistus, puuttuva ruokaan jäävä aine tai olennaisen määrän puute. Jos virhe on edelleen käyttäjälle näkyvissä tai vaikuttaa laskentaan, korjaa tai piilota ennen yleisöavausta. Tästä ei voi vielä päätellä 38 vahvistettua julkaisuestettä.
- **Toimituksellinen:** lisukkeen raja, mauste, pieni voiteluöljy tai apuneste. Tarkista ravinto- ja GK-vaikutus; tarvittaessa nosta HOLDiin.
- **Väärä osuma, todennäköinen:** yhdyssana, tuotenimi, kielteinen ilmaisu, valinnainen lisä tai tavallinen apuneste. Lopullinen FALSE_POSITIVE-merkintä vasta lähde- ja näyttöversion tarkistuksen jälkeen.

## Kaikki 82 auditin reseptiä

| # | FI-resepti | Alustava luokka | Perustelu / seuraava tarkistus |
|---:|---|---|---|
| 1 | [`indialainen-poha-maapahkinoilla`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/indialainen-poha-maapahkinoilla.md) | HOLD-tarkistettava | Pohaan väärä pihvitaikinaohje (FI-tiedosto tarkistettu). |
| 2 | [`indonesialainen-bakwan-maissifritter`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/indonesialainen-bakwan-maissifritter.md) | HOLD-tarkistettava | Väärä pihvi-/taikinapohja sekä tuntematon taikinaan jäävä vesimäärä. |
| 3 | [`indonesialainen-nasi-goreng-aamiaisriisi`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/indonesialainen-nasi-goreng-aamiaisriisi.md) | HOLD-tarkistettava | Väärä pihvi-/taikinapohja sekä valkosipulin ainesosavastaavuus. |
| 4 | [`indonesialainen-pisang-goreng-aamiaiseksi`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/indonesialainen-pisang-goreng-aamiaiseksi.md) | HOLD-tarkistettava | Banaaniruokaan kopioitu yleinen taikinapohja. |
| 5 | [`intialainen-aloo-paratha`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/intialainen-aloo-paratha.md) | HOLD-tarkistettava | Yleinen valmisleipä-ehto ja tarjoilujogurtti. |
| 6 | [`japanilainen-yaki-onigiri-misolla`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/japanilainen-yaki-onigiri-misolla.md) | HOLD-tarkistettava | Onigiriin väärä pihviohje; miso/nori-määrät epäuskottavat (FI tarkistettu). |
| 7 | [`karibia-bammy-kassavaleipa`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/karibia-bammy-kassavaleipa.md) | HOLD-tarkistettava | Ruokalajikohtainen valmistus puuttuu tai mukana geneerinen ehdollinen taikina-/kasvistäyteohje. |
| 8 | [`karibia-jamaikalainen-munakokkeli`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/karibia-jamaikalainen-munakokkeli.md) | HOLD-tarkistettava | Ruokalajikohtainen valmistus puuttuu tai mukana geneerinen ehdollinen taikina-/kasvistäyteohje. |
| 9 | [`karibia-johnny-cake`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/karibia-johnny-cake.md) | HOLD-tarkistettava | Johnny cake: yleinen valmisleipäehto menetelmän sijasta. |
| 10 | [`karibia-plantain-aamiaislautanen`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/karibia-plantain-aamiaislautanen.md) | HOLD-tarkistettava | Ruokalajikohtainen valmistus puuttuu tai mukana geneerinen ehdollinen taikina-/kasvistäyteohje. |
| 11 | [`karibia-saltfish-fritterit`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/karibia-saltfish-fritterit.md) | HOLD-tarkistettava | Ruokalajikohtainen valmistus puuttuu tai mukana geneerinen ehdollinen taikina-/kasvistäyteohje. |
| 12 | [`kiinalainen-kevatsipulipannukakku`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/kiinalainen-kevatsipulipannukakku.md) | HOLD-tarkistettava | Kevätsipulipannukakku: yleinen taikinaehto; huomioi jo tehty näyttökorjaus. |
| 13 | [`kiinalainen-tomaattimunakas-riisilla`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/kiinalainen-tomaattimunakas-riisilla.md) | HOLD-tarkistettava | Ruokalajikohtainen valmistus puuttuu tai mukana geneerinen ehdollinen taikina-/kasvistäyteohje. |
| 14 | [`korealainen-gyeran-mari-kasviksilla`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/korealainen-gyeran-mari-kasviksilla.md) | HOLD-tarkistettava | Ruokalajikohtainen valmistus puuttuu tai mukana geneerinen ehdollinen taikina-/kasvistäyteohje. |
| 15 | [`lahi-ita-manakish-zaatarilla`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/lahi-ita-manakish-zaatarilla.md) | HOLD-tarkistettava | Ruokalajikohtainen valmistus puuttuu tai mukana geneerinen ehdollinen taikina-/kasvistäyteohje. |
| 16 | [`malesialainen-kaya-paahtoleipa`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/malesialainen-kaya-paahtoleipa.md) | HOLD-tarkistettava | Ruokalajikohtainen valmistus puuttuu tai mukana geneerinen ehdollinen taikina-/kasvistäyteohje. |
| 17 | [`malesialainen-mee-goreng-aamunuudeleilla`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/malesialainen-mee-goreng-aamunuudeleilla.md) | HOLD-tarkistettava | Mee goreng -nuudeliin väärä pihvitaikinan valmistus. |
| 18 | [`malesialainen-roti-canai-dhalilla`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/malesialainen-roti-canai-dhalilla.md) | HOLD-tarkistettava | Ruokalajikohtainen valmistus puuttuu tai mukana geneerinen ehdollinen taikina-/kasvistäyteohje. |
| 19 | [`meksikolainen-munakokkeli-pico-de-gallolla`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/meksikolainen-munakokkeli-pico-de-gallolla.md) | HOLD-tarkistettava | Yleispohja ja listaan kuulumaton salsan sipuli. |
| 20 | [`pohjoisafrikkalainen-harcha-juustolla`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/pohjoisafrikkalainen-harcha-juustolla.md) | HOLD-tarkistettava | Ruokalajikohtainen valmistus puuttuu tai mukana geneerinen ehdollinen taikina-/kasvistäyteohje. |
| 21 | [`pohjoisafrikkalainen-maakouda`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/pohjoisafrikkalainen-maakouda.md) | HOLD-tarkistettava | Maakoudassa pihvitaikinan yleisohje; perunan massa/GK erikseen HOLD. |
| 22 | [`pohjoisafrikkalainen-msemen-hunajalla`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/pohjoisafrikkalainen-msemen-hunajalla.md) | HOLD-tarkistettava | Ruokalajikohtainen valmistus puuttuu tai mukana geneerinen ehdollinen taikina-/kasvistäyteohje. |
| 23 | [`thai-maissifritterit`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/thai-maissifritterit.md) | HOLD-tarkistettava | Thai-maissifrittereissä väärä yleisohje; vesi ja lisukkeet tarkistettava. |
| 24 | [`valimerellinen-halloumi-tomaattileipa`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/valimerellinen-halloumi-tomaattileipa.md) | HOLD-tarkistettava | Ruokalajikohtainen valmistus puuttuu tai mukana geneerinen ehdollinen taikina-/kasvistäyteohje. |
| 25 | [`vietnamilainen-banh-mi-munalla`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/vietnamilainen-banh-mi-munalla.md) | HOLD-tarkistettava | Ruokalajikohtainen valmistus puuttuu tai mukana geneerinen ehdollinen taikina-/kasvistäyteohje. |
| 26 | [`indonesialainen-lontong-sayur-aamiaiseksi`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/indonesialainen-lontong-sayur-aamiaiseksi.md) | HOLD-tarkistettava | 'Öljy tai liemi' -valmistus ei määrittele todellista aine- ja menetelmävalintaa. |
| 27 | [`intialainen-rava-uttapam`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/intialainen-rava-uttapam.md) | Toimituksellinen | Korianteri työvaiheessa mutta ei listassa. |
| 28 | [`japanilainen-miso-tofu-paksoi`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/japanilainen-miso-tofu-paksoi.md) | HOLD-tarkistettava | Keittoon kopioitu öljy/liemi-yleisohje. |
| 29 | [`japanilainen-soba-aamiaiskeitto`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/japanilainen-soba-aamiaiskeitto.md) | HOLD-tarkistettava | Soba-keittoon kopioitu öljy/liemi-yleisohje. |
| 30 | [`karibia-ackee-ja-suolakala`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/karibia-ackee-ja-suolakala.md) | Väärä osuma, todennäköinen | Ehdollinen vesitilkka kuivaan pannuun, normaali apuneste. |
| 31 | [`kiinalainen-jianbing-munaletty`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/kiinalainen-jianbing-munaletty.md) | HOLD-tarkistettava | Jianbing-taikinaan vettä ilman ilmoitettua määrää (FI tarkistettu). |
| 32 | [`kiinalainen-katkarapu-wontonkeitto`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/kiinalainen-katkarapu-wontonkeitto.md) | HOLD-tarkistettava | Wontonkeiton epäselvä öljy/liemi-yleisohje. |
| 33 | [`korealainen-gyeranbap-riisikulho`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/korealainen-gyeranbap-riisikulho.md) | HOLD-tarkistettava | Gyeranbap: seesamiöljy puuttuu aineslistasta; rinnakkainen #401 muuttaa näyttöä. |
| 34 | [`korealainen-mandu-keitto-aamiaiseksi`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/korealainen-mandu-keitto-aamiaiseksi.md) | HOLD-tarkistettava | Mandu-keiton epäselvä öljy/liemi-yleisohje. |
| 35 | [`lahi-ita-ful-medames`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/lahi-ita-ful-medames.md) | Väärä osuma, todennäköinen | Ehdollinen vesitilkka pannulle, ei mitattava uusi raaka-aine. |
| 36 | [`lahi-ita-zaatar-munat`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/lahi-ita-zaatar-munat.md) | Väärä osuma, todennäköinen | Ehdollinen vesitilkka pannulle, ei mitattava uusi raaka-aine. |
| 37 | [`malesialainen-laksa-lemak-aamiaiseksi`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/malesialainen-laksa-lemak-aamiaiseksi.md) | HOLD-tarkistettava | Geneerinen valmistus tai määriltään määrittelemätön öljy/liemi; tarkista ruokalajikohtainen ohje. |
| 38 | [`meksikolainen-aamiais-tacot-mustapavuilla`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/meksikolainen-aamiais-tacot-mustapavuilla.md) | Toimituksellinen | Limetin tarjoilumäärä ja annoksen rajaus. |
| 39 | [`meksikolainen-chilaquiles-verdes`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/meksikolainen-chilaquiles-verdes.md) | Väärä osuma, todennäköinen | Ehdollinen vesitilkka pannulle, ei mitattava uusi raaka-aine. |
| 40 | [`meksikolainen-huevos-divorciados`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/meksikolainen-huevos-divorciados.md) | Väärä osuma, todennäköinen | Ehdollinen vesitilkka pannulle, ei mitattava uusi raaka-aine. |
| 41 | [`meksikolainen-paputostada-aamupalaksi`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/meksikolainen-paputostada-aamupalaksi.md) | Väärä osuma, todennäköinen | Ehdollinen vesitilkka pannulle, ei mitattava uusi raaka-aine. |
| 42 | [`pellava-puuro-pahkinoilla`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/pellava-puuro-pahkinoilla.md) | Väärä osuma, todennäköinen | Ehdollinen vesitilkka pannulle, ei mitattava uusi raaka-aine. |
| 43 | [`thai-kananmunat-kookoscurryssa`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/thai-kananmunat-kookoscurryssa.md) | Väärä osuma, todennäköinen | Ehdollinen vesitilkka pannulle, ei mitattava uusi raaka-aine. |
| 44 | [`valimerellinen-appelsiini-aamiaiskakku`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/valimerellinen-appelsiini-aamiaiskakku.md) | Toimituksellinen | 'Sitruunainen' appelsiinikakku; tarkista reseptin kuvaus. |
| 45 | [`valimerellinen-kikherne-yrttiaamiainen`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/valimerellinen-kikherne-yrttiaamiainen.md) | HOLD-tarkistettava | Kikherneannoksessa pehmeä kananmuna ja sitruunaöljy ilman ilmoitettuja määriä (FI tarkistettu). |
| 46 | [`valimerellinen-menemen-fetalla`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/valimerellinen-menemen-fetalla.md) | Väärä osuma, todennäköinen | Ehdollinen vesitilkka pannulle, ei mitattava uusi raaka-aine. |
| 47 | [`valimerellinen-pinaatti-fetashakshuka`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/valimerellinen-pinaatti-fetashakshuka.md) | Väärä osuma, todennäköinen | Ehdollinen vesitilkka pannulle, ei mitattava uusi raaka-aine. |
| 48 | [`vietnamilainen-banh-xeo-aamiaisletut`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/vietnamilainen-banh-xeo-aamiaisletut.md) | Toimituksellinen | Kurkumalla värjätty lettu, mutta kurkuman määrä puuttuu. |
| 49 | [`vietnamilainen-pho-ga-aamuksi`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/vietnamilainen-pho-ga-aamuksi.md) | HOLD-tarkistettava | Pho-keiton öljy/liemi-yleisvaihe. |
| 50 | [`hyderabadi-kanabiryani`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/paaruoat/hyderabadi-kanabiryani.md) | Toimituksellinen | Sahramin note kertoo 2 rkl maitoa; selvitä laskennan mukanaolo. |
| 51 | [`jauhelihapihvit-vhh-kermakastikkeella`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/paaruoat/jauhelihapihvit-vhh-kermakastikkeella.md) | Väärä osuma, todennäköinen | Sinappi on listassa nimellä French's Dijon Mustard (FI tarkistettu). |
| 52 | [`nakkikastike-kukkakaalimuusi`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/paaruoat/nakkikastike-kukkakaalimuusi.md) | Väärä osuma, todennäköinen | Sinappi on listassa nimellä French's Dijon Mustard (FI tarkistettu). |
| 53 | [`nakkikeitto-kukkakaalilla`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/paaruoat/nakkikeitto-kukkakaalilla.md) | Väärä osuma, todennäköinen | Ehdollinen tai kielteinen maininta; tarkista ettei ainesosaa tosiasiallisesti lisätä. |
| 54 | [`pasta-alla-norma`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/paaruoat/pasta-alla-norma.md) | Väärä osuma, todennäköinen | Keitinvettä säädetään tarvittaessa; ei uusi energialähde. |
| 55 | [`pekingin-ankka`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/paaruoat/pekingin-ankka.md) | Toimituksellinen | Hunajaglaseerauksen kuuma vesitilkka on apuneste. |
| 56 | [`sate-ayam`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/paaruoat/sate-ayam.md) | Toimituksellinen | Maapähkinäkastikkeen vesitilkka: koostumus- ja annosraja. |
| 57 | [`uunilohi-smetanakuorrutteella`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/paaruoat/uunilohi-smetanakuorrutteella.md) | Väärä osuma, todennäköinen | Smetana on hapatettua kermaa, ei toinen raaka-aine (FI tarkistettu). |
| 58 | [`intialainen-idli-kookoschutneylla`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/intialainen-idli-kookoschutneylla.md) | Toimituksellinen | Idli-vuoan voiteluöljyn mahdollinen kulutus. |
| 59 | [`intialainen-mannasuurimoupma`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/intialainen-mannasuurimoupma.md) | Toimituksellinen | Valinnainen jogurtti tarjoiluun, erotettava annoslaskennasta. |
| 60 | [`intialainen-pesarattu-mungpavuista`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/intialainen-pesarattu-mungpavuista.md) | Väärä osuma, todennäköinen | Ehdollinen tai kielteinen maininta; tarkista ettei ainesosaa tosiasiallisesti lisätä. |
| 61 | [`intialainen-pinaatti-paneer-chilla`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/intialainen-pinaatti-paneer-chilla.md) | Väärä osuma, todennäköinen | Ehdollinen tai kielteinen maininta; tarkista ettei ainesosaa tosiasiallisesti lisätä. |
| 62 | [`kiinalainen-bao-munalla`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/kiinalainen-bao-munalla.md) | HOLD-tarkistettava | Bao-ohjeessa väärä riisin liotus ja geneeriset höyrytysvaiheet (FI tarkistettu). |
| 63 | [`lahi-ita-labneh-kulho-zaatarilla`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/lahi-ita-labneh-kulho-zaatarilla.md) | HOLD-tarkistettava | Labnehissa ohjeen oliiviöljy puuttuu aineslistasta (FI tarkistettu). |
| 64 | [`malesialainen-kuih-seri-muka`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/malesialainen-kuih-seri-muka.md) | Toimituksellinen | Vuoan voitelun pieni öljymäärä/retentio. |
| 65 | [`paprikauunimunakkaat`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/paprikauunimunakkaat.md) | Väärä osuma, todennäköinen | 'Ei listaamatonta öljyä' on kielto, ei lisäys (FI tarkistettu). |
| 66 | [`pohjoisafrikkalainen-lablabi`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/pohjoisafrikkalainen-lablabi.md) | Väärä osuma, todennäköinen | 'Ei muuta öljyä' on kielto. |
| 67 | [`vietnamilainen-banh-bao-kananmunalla`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/vietnamilainen-banh-bao-kananmunalla.md) | HOLD-tarkistettava | Bao-ohjeessa väärä riisin liotus ja geneerinen vuokaöljy. |
| 68 | [`vietnamilainen-banh-cuon-sienilla`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/vietnamilainen-banh-cuon-sienilla.md) | Toimituksellinen | Vuoan voitelun mahdollinen öljymäärä. |
| 69 | [`vietnamilainen-hu-tieu-aamiaiskeitto`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/vietnamilainen-hu-tieu-aamiaiskeitto.md) | Väärä osuma, todennäköinen | Ohje kieltää lisäöljyn ja ylimääräisen liemen (FI tarkistettu). |
| 70 | [`vietnamilainen-xoi-maapahkinalla`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/aamupalat/vietnamilainen-xoi-maapahkinalla.md) | Toimituksellinen | Vuoan voitelun öljyn määrä. |
| 71 | [`vhh-letut`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/jalkiruoat/vhh-letut.md) | Väärä osuma, todennäköinen | 'Vähäsokeriset marjat' ei tarkoita lisättyä sokeria. |
| 72 | [`aloo-paratha`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/paaruoat/aloo-paratha.md) | Toimituksellinen | Jogurtti/raita erillisenä tarjoiluehdotuksena. |
| 73 | [`chettinad-kana`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/paaruoat/chettinad-kana.md) | Toimituksellinen | Tarjoiluriisi/leipä: ilmoitettava kuuluuko laskettuun annokseen. |
| 74 | [`japanilainen-curry-tofulla`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/paaruoat/japanilainen-curry-tofulla.md) | Väärä osuma, todennäköinen | Kukkakaaliriisi ei ole tavallista riisiä. |
| 75 | [`kanakorma-kukkakaaliriisilla`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/paaruoat/kanakorma-kukkakaaliriisilla.md) | Väärä osuma, todennäköinen | Kukkakaaliriisi ei ole tavallista riisiä (FI tarkistettu). |
| 76 | [`kanaviillokki-kukkakaalilla`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/paaruoat/kanaviillokki-kukkakaalilla.md) | Väärä osuma, todennäköinen | Kukkakaaliriisi ei ole tavallista riisiä. |
| 77 | [`kantonilainen-hoyrytetty-kala`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/paaruoat/kantonilainen-hoyrytetty-kala.md) | Toimituksellinen | Tarjoiluriisin ravintorajan selventäminen. |
| 78 | [`keltainen-kanacurry-vhh`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/paaruoat/keltainen-kanacurry-vhh.md) | Väärä osuma, todennäköinen | Valinnainen kukkakaaliriisi ei ole tavallista riisiä. |
| 79 | [`kerala-kalacurry`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/paaruoat/kerala-kalacurry.md) | Toimituksellinen | Tarjoiluriisi: erottele laskettavasta annoksesta. |
| 80 | [`ratatouille`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/paaruoat/ratatouille.md) | Väärä osuma, todennäköinen | Kielteinen maininta lisukkeista; ei uusi ainesosa. |
| 81 | [`rendang-padang`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/paaruoat/rendang-padang.md) | Väärä osuma, todennäköinen | Kookosmaidosta erottuva öljy ei ole lisätty öljy (FI tarkistettu). |
| 82 | [`rogan-josh`](https://github.com/ozirix-dev/Reseptit/blob/main/reseptit/paaruoat/rogan-josh.md) | Väärä osuma, todennäköinen | Kielteinen riisiviittaus; ei uusi ainesosa. |

## Jo varmistetut lähdetason esimerkit

- **Poha**: kanonisessa FI-ohjeessa pihvitaikinan muotoilu riisihiutaleannokseen – selvä menetelmävirhe.
- **Yaki-onigiri**: yleinen pihvitaikinaohje ja 100 g riisiä / 150 g misoa / 150 g noria – ei korjaannu pelkällä kielenhuollolla.
- **Labneh za'atarilla**: oliiviöljy mainitaan ohjeessa mutta sille ei ole punnittua ainesosariviä.
- **Gyeranbap**: seesamiöljy ohjeessa mutta ei listassa; erillinen F25-näyttökorjaus #401 on huomioitava, jotta samaa ei korjata päällekkäin.
- **Jauhelihapihvit / nakkikastike**: `sinappi` löytyy ainesosista tuotenimellä `French's Dijon Mustard` – auditin sanahakuhälytys.
- **Paprikauunimunakkaat**: `Ei listaamatonta öljyä` on nimenomainen kielto.
- **Kanakorma**: `kukkakaaliriisi` ei tarkoita irrallista valkoista riisiä.
- **Rendang**: kookosmaidosta valmistuksessa erottuva öljy ei ole uusi paistoöljy.

## Sulkemiskriteeri ja käytännön työnkulku

1. Tarkista kyseisen FI-lähteen ajantasainen blob-SHA ja **julkisen näyttöversion** todellinen sisältö (SHA-lukitut esitysprojektorit voivat jo korjata raaka-Markdownin). Vältä toisen chatin omistamien tiedostojen päällekkäistä muokkausta.
2. Varmista ruokalaji ja ravintokriittiset ainesmäärät. Reseptin rasvoja, määriä tai GI/GK-arvoja ei päätellä sanahaun perusteella.
3. Kirjaa lopullinen `BLOCK`, `EDITORIAL`, `FALSE_POSITIVE` tai `RESOLVED`, perustelu, katselmoitu Git-SHA/näkymä, korjaus-PR ja mahdollinen ravinto/GK- tai käännösvaikutus.
4. Varmistetut vakavat virheet korjataan tai reseptit piilotetaan ennen Recipavon yleisöavausta. Pelkät epäilyt eivät ole vahvistettuja esteitä, mutta vahvistamatta jäänyt ravinto-/turvallisuusongelma pysyy HOLDissa.
5. Kun muut PR:t yhdistyvät, vain avoimet tapaukset katselmoidaan uudelleen. Tämä PR on **Draft** ja dokumentaatiota, ei julkaisun hyväksyntä.

**Aineistolukitus:** lähtöaineistona #358 HEAD `b29335e06d0c310d7b18122115f9cfee9b30ab81` / artifact `13691537441`; rivien `blob/main`-linkit johtavat kulloinkin päivittyvään tiedostoon, eivät lukittuun versioon. Siksi PR:n hyväksynnässä tarvitaan uusimmat lähde-SHA:t eikä vanhaa luokittelua saa käsitellä ajantasaisena ilman tarkistusta.


## Varmennuskierros V1: ensimmäiset 20 / 82 (10.11.2026)

**Tarkistettu main-commit:** `6a59fb7a58e3b5659a8546aecddea42eea2493a0`. Jokaiselta 20 reseptiltä luettu GitHubista kanoninen `reseptit/aamupalat/<id>.md`, YAML:n ainesosat ja `## Valmistus` -osiot. Lyhyet blob-SHA:t ovat samasta commitista. Julkisen näyttölogiikan kannalta tarkistettu `site/scripts/build-content.ts`, `site/scripts/fi-breakfast-quality-display.ts`, `site/scripts/c20-fi-editorial-display.ts` sekä `site/scripts/recipe-quality-holds.ts`. **10/20 vahvistettua vielä korjausta edellyttävää, 10/20 alkuperäistä auditointiongelmaa korjattu.**

**Tärkeä rajaus:** `RESOLVED_AUDIT` koskee vain mainittua ohje-/ainesosahavaintoa, ei ravintoarvojen, GI/GK:n, kaikkien käännösten, maistamisen tai tosiasiallisen Pages-live-HTTP-vastausten täydellistä hyväksyntää. `BLOCK` tarkoittaa perustellusti todettua lähdetason estettä; julkisessa näkymässä voidaan esittää erillinen laatuhold/varoitus, joka ei korjaa taustalla olevia ravintolukuja. Kun tiedosto tai projektori muuttuu, arvioidaan uudelleen.

| # | Resepti | FI-blob SHA | Varmennettu päätös | Havainto ja seuraava toimi |
|---:|---|---|---|---|
| 1 | `indialainen-poha-maapahkinoilla` | `f8b9cf8a` | **BLOCK** | Riisihiutaleiden valmistusta edeltää väärän ruoan pihvitaikinan muotoilu; poistettava ennen julkaisukelpoisuutta. |
| 2 | `indonesialainen-bakwan-maissifritter` | `f18fc5e2` | **BLOCK** | 100 g vehnäjauhoa, ei mitattua taikinaan jäävää vettä; pihvipohjan yleisohje ja puuttuva mittasuhde. |
| 3 | `indonesialainen-nasi-goreng-aamiaisriisi` | `731c7bab` | **BLOCK** | Riisiruokaan on kopioitu pihvitaikinaohje, ohjeessa valkosipuli ilman ainesriviä; 150 g kecap manisia/100 g riisiä vaatii määrätarkistuksen. |
| 4 | `indonesialainen-pisang-goreng-aamiaiseksi` | `8e1fd4aa` | **RESOLVED_AUDIT** | Oikea banaanitaikina, 75 ml vettä ja paistotapa on nyt määritelty; alkuperäinen yleispohjan ongelma korjattu. |
| 5 | `intialainen-aloo-paratha` | `9ed1496a` | **BLOCK** | Perunatäytteen keittäminen/soseutus ja taittaminen taikinan sisään puuttuvat; tarjoilujogurtti ei sisälly aineslistaan. |
| 6 | `japanilainen-yaki-onigiri-misolla` | `bff8b381` | **BLOCK** | Edelleen väärä pihvitaikinaohje sekä 100 g riisiin 150 g misoa ja 150 g noria; tarkista raaka/kypsä painot ja ravinto/GK. |
| 7 | `karibia-bammy-kassavaleipa` | `beea3088` | **BLOCK_P0_SAFETY** | 250 g tuoretta kassavaa: ohjeessa vain kuoriminen, raastaminen, puristaminen ja pannulla paisto. Kassavan lajike ja riittävä toksiinien poisto eivät ole varmistettuja, joten turvallisuus-HOLD. |
| 8 | `karibia-jamaikalainen-munakokkeli` | `f4e65cf9` | **RESOLVED_AUDIT** | Munakokkelin tomaatti/chili/timjami/munat -vaiheet täsmäävät aineslistaan; väärä yleispohja poistunut. |
| 9 | `karibia-johnny-cake` | `ac958af2` | **RESOLVED_AUDIT** | Jauho/maito/voi/leivinjauhe -taikinan teko ja paisto kuvattu ruokalajikohtaisesti; yleinen valmisleipäehto poistettu. |
| 10 | `karibia-plantain-aamiaislautanen` | `afb4242c` | **RESOLVED_AUDIT** | Ruokabanaanin, munan ja avokadon valmistus vastaa aineita; ei enää taikina- tai pihvivaiheita. |
| 11 | `karibia-saltfish-fritterit` | `f197d405` | **BLOCK** | 1 tl suolakalaa/100 g jauhoa, lisättävä taikinavesi määräämätön ja suolakalan esikäsittely vain viitattu ('liotettu') ilman ohjetta. |
| 12 | `kiinalainen-kevatsipulipannukakku` | `259cb208` | **RESOLVED_AUDIT** | Kerrospannukakun kaulinta, rullaus, seesamiöljy ja paistaminen kuvattu; 15 min lepo huomioidaan julkisessa C20-näyttöprojektorissa 35 min kokonaisaikana. |
| 13 | `kiinalainen-tomaattimunakas-riisilla` | `33ab462e` | **RESOLVED_AUDIT** | Riisin keittäminen sekä tomaatti-munaseoksen valmistus korjattu; yleinen kasvistäyteohje ei enää esiinny. |
| 14 | `korealainen-gyeran-mari-kasviksilla` | `61df56f5` | **RESOLVED_AUDIT** | Munakaskäärön rullaus vaiheittain ja kypsyys määritelty, aineet täsmäävät; väärä yleispohja poistettu. |
| 15 | `lahi-ita-manakish-zaatarilla` | `1369126b` | **BLOCK** | Yleinen valmiin leivän ehto ja 'paista pannulla tai uunissa' ilman yksilöityä menetelmää; toistuva taikinan sekoitus, kypsymisraja epämääräinen. |
| 16 | `malesialainen-kaya-paahtoleipa` | `04d0be90` | **BLOCK** | Ohje käskee vaivaamaan jauhoja, joita listassa ei ole, vaikka pohjana on valmis hapanjuurileipä; geneeriset taikinavaiheet ensin. |
| 17 | `malesialainen-mee-goreng-aamunuudeleilla` | `e95d1fa6` | **RESOLVED_AUDIT** | Nuudeli/tofu/kananmuna/pavunidut valmistetaan ruokalajikohtaisesti; virheellinen pihvitaikinaohje poistunut. |
| 18 | `malesialainen-roti-canai-dhalilla` | `d241c242` | **BLOCK** | 100 g kuiville linsseille ei valmistusvaihetta, jauhoille ei mitattua taikinanestettä ja roti kuvataan pelkällä yleisellä valmisleipävaiheella. |
| 19 | `meksikolainen-munakokkeli-pico-de-gallolla` | `05324475` | **RESOLVED_AUDIT** | Ohje rajaa pico de gallo -henkisen lisukkeen tomaattiin ja korianteriin ilman sipulia; ei luetteloimatonta sipulia tai geneeristä ohjetta. |
| 20 | `pohjoisafrikkalainen-harcha-juustolla` | `5cc4c803` | **RESOLVED_AUDIT** | Mannasuurimon, voin, maidon ja juustolisukkeen työnkulku täsmää; yleinen leipäehto poistunut. |

### Riskit ja seuraava päätös

- **P0-käsittelyturvallisuus:** `karibia-bammy-kassavaleipa` käyttää tuoretta kassavaa mutta ei yksilöi lajiketta tai riittävää turvallista prosessointia. [Food Standards Australia New Zealand](https://www.foodstandards.gov.au/consumer/prevention-of-foodborne-illness/cassava) ja [WHO](https://www.who.int/news-room/fact-sheets/detail/natural-toxins-in-food/) kuvaavat kassavan syanogeenisten yhdisteiden riskin; paistaminen sellaisenaan ei todista turvallisuutta. Älä hyväksy reseptiä ilman varmennettua, kyseiselle raaka-aineelle soveltuvaa käsittelyä tai turvallista prosessoitua tuotetta.
- **Muut BLOCKit:** #1 poha, #2 bakwan, #3 nasi goreng, #5 aloo paratha, #6 yaki-onigiri, #11 saltfish-fritterit, #15 manakish, #16 kaya-paahtoleipä ja #18 roti canai. Muutokset pitää priorisoida toisessa kokki-keskustelussa; tässä PR:ssä ei muokata niitä.
- **Jo korjatut auditointiongelmat:** #4 pisang goreng, #8 jamaikalainen munakokkeli, #9 johnny cake, #10 plantain, #12 kevätsipulipannukakku, #13 tomaattimunakas, #14 gyeran-mari, #17 mee goreng, #19 pico de gallo -munakokkeli ja #20 harcha. Erityisesti #12:n **näyttöprojektio** muuttaa raakareseptin 25 min → 35 min julkisen esityksen ajaksi.
- **Työnjako:** tämä PR omistaa vain triagen. #359:n jo yhdistettyjen lähdekorjausten tulokset huomioitu; #401:n F25-korjaukset eivät oikeuta muuttamaan näiden 20:n raw-havaintoja itsenäisesti. Julkisen tuotannon Pages-deploy ja live-URL:t varmistettava erikseen ennen käyttäjäavausta.
- **Jatkoseulonta:** seuraavat 20/82 versionlukittuina. Loput 62 ovat edelleen *käsittelemättä lopullisessa tarkistuksessa*; niiden aiempia 38/16/28 prioriteettiluokkia ei saa tulkita tämän varmennuksen lopputulokseksi.


## Varmennuskierros V2 – kaikki loput 62 tapausta tarkistettu

[Lue 62 rivin täsmällinen, main-SHA-lukittu loppuraportti](2026-11-10-recipavo-82-verification-21-82.md).

**Yhteistulos 82/82 lähdereseptin auditointihavainnon ja lähteen kokkikelpoisuustarkistuksen jälkeen, main `6a59fb7a58e3b5659a8546aecddea42eea2493a0`:**

| Luokka | 1–20 | 21–82 | Yhteensä |
|---|---:|---:|---:|
| Vahvistettu lähdetason BLOCK (sisältää turvallisuus- ja ravintoselvitysesteet) | 10 | 33 | **43** |
| Auditissa kuvattu ongelma korjattu | 10 | 1 | **11** |
| Väärä ainesosa-/sanahälytys ilman muuta tässä katselmoinnissa todettua estettä | 0 | 20 | **20** |
| Julkinen SHA-lukittu näyttökorjaus, kanoninen FI edelleen vanha | 0 | 3 | **3** |
| Toimituksellinen tai riippumaton ravintoevidenssi tarvitaan | 0 | 5 | **5** |
| **Yhteensä** | **20** | **62** | **82** |

**Tulkintaraja:** 43 on *lähdetason* BLOCK-luku, EI väite 43 tällä hetkellä käyttäjälle näkyvästä vaarallisesta reseptistä. Ackee (#30) esitetään jo erillisellä varoituksella, banh baolle (#67) ja idlille (#58) on erillinen quality-hold-mekanismi, ja näyttökorjausten #23/#33/#36 vaikutus arvioidaan buildissä. Käyttäjäavausta varten on vielä vahvistettava nykyinen deploy, jokaisen BLOCKin julkinen näkyvyys, ravintolukujen vastaavuus ja FI:n julkaistut EN/SV/TH-käännökset. Muutokset toisessa keskustelussa pitää verrata snapshotiin uudelleen, muuten tulos vanhenee.

**Läpikäynti valmis tämän 82-osuman työjonon osalta.** Tämä EI ole koko 335 FI-reseptin riippumaton täysauditointi. Esimerkiksi alkuperäinen sanahaku teki joistakin tapauksista `FALSE_POSITIVE`, vaikka löytyi erillinen yleisohjevirhe: nämä on luokiteltu `BLOCK_OTHER_ISSUE` (8 kpl), eikä niitä ole haudattu väärien osumien koriin.

### Korjaustyön toimintajärjestys

1. Käsittele ensin viranomais- tai kypsennysturvallisuuteen liittyvät BLOCKit: bammy #7, ackee #30, banh xeo #48 (katkarapujen käsittely), banh cuon #68 (raaka porsaanjauheliha). Jos turvallista reseptiä ei voida todentaa, poista resepti käyttäjälle näkyvästä julkaisusta; pelkkä varoitus ei välttämättä korvaa sitä.
2. Ratkaise poikkeavat ravinto-/ainesmäärät ja valmistusrakenne, erityisesti yaki-onigiri #6, maakouda #21, miso-paksoi #28, mandu #34, idli #58 ja xoi #70. Älä hyväksy lukuja muuttamatta niitä varten tarvittavia evidenssejä.
3. Yhdistä vain toisen chatin valmiit reseptikorjaukset, katselmoi käännösten merkitysvastaavuudet ja aja tarvittavat valitut CI-testit. Ei uusia korjaus-PR:iä tästä raportista automaattisesti.
4. Lopullinen `PUBLIC_READY`-koonti muodostetaan vasta ajantasaisen main-SHA:n julkaistun esityksen ja korjausten jälkeen.



## Uusin esitystason tilanne – main 7498c674

[82 tapauksen **V3-esitysversiovertailu**](2026-11-10-recipavo-82-verification-21-82.md#v3--uuden-main-shan-vaikutus-näyttöversioon-10112026): viisi uuden näyttöprojektorin julkisen valmistusohjeen korjausta (#39, #41, #43, #48, #68), lisäksi #3:n valmistus korjattu mutta 150 g kecap manis -aineisto edelleen HOLD.

**Uusin koonti 82/82:** 38 jäljellä olevaa muuta selvitystä tai lähdekorjausta vaativaa tapausta; 8 erillisessä julkisessa näyttöprojektorissa korjattua raakatekstin ongelmaa; 11 alkuperäistä havaintoa korjattu; 20 väärää hälytystä; 5 toimituksellista. Yhteensä 82. V2:n 43 `BLOCK` oli alkuperäisen main-snapshotin lähdetason luokka; V3 ei poista sitä tosiseikkaa, että viidessä niistä kanoninen raaka-Markdown on yhä virheellinen. **V3 ei ole 38 todistetun live-julkaisublokkerin määrä.**

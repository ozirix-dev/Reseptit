# PR #152 — omistajan sisältö- ja menetelmähyväksyntä

Tila: OWNER_METHOD_AND_CONTENT_APPROVED — READY_AUTHORIZED — AWAITING_SEPARATE_RELEASE_AUTHORIZATION.

Kirjattu: 2026-11-01T12:18:41+02:00.
PR: https://github.com/ozirix-dev/Reseptit/pull/152.

## Päätöksen alkuperä

Omistaja toi tähän Codex-keskusteluun AJO 8:n katselmoinnin, joka suositteli
11 täsmällisen version käsittelyä yhtenä eränä, seitsemän HOLDin pitämistä
erillään sekä hyväksynnän kirjaamista, Ready-siirtymää ja normaalia Codex Review’ta.
Seuraavassa viestissään omistaja vahvisti:

> Kyllä, jatka

Tämä päätös hyväksyy alla lukitut 11 reseptiversiota, niiden neljä ravintoarvomakroa,
rajatut GI-sovellukset, valmistusanalogiat, koostumusproxyt ja LOW-merkinnät
katselmointikoosteen mukaisesti sekä valtuuttaa Ready for review -siirtymän.
Se kattaa myös samojen versioiden 30 olemassa olevaa EN/SV/TH-vastinetta.
Käännösten riippumatonta ihmistarkistusta ei tällä merkinnällä väitetä.

Hyväksynnän sisältö-HEAD: 44cc1cd25ba20bd5bb5d63fc0d7330470962c076.
Tarkistettu main: ed5e3a67046cff3b1fd56acf4cb214a0fe3813ad.
Hyväksytyn sisältö-HEADin CI: https://github.com/ozirix-dev/Reseptit/actions/runs/41295971972 (SUCCESS).

Mergeä mainiin tai tuotantodeployta ei valtuuteta. ReportHub PR #91 käsitellään
erillisenä dokumentointimuutoksena eikä kuulu tämän hyväksynnän piiriin.

## Hyväksytty reseptijoukko

| Resepti-ID | Täsmällinen versio | GK / annos, pyöristämätön |
| --- | --- | ---: |
| tortilla-de-patatas | Tortilla de patatas – esikeitetyn perunan versio | 15.756875 |
| tabbouleh | Tabbouleh-tyylinen lämmin salaatti keitetystä bulgurista | 6.5871875 |
| munakoiso-jauhelihavuoka-vhh | Munakoiso-jauhelihavuoka – punnittu versio | 3.58525 |
| parsakaali-sinihomejuustofrittata | Parsakaali-sinihomejuustofrittata – punnittu versio | 0.965025 |
| italian-pata | Italialainen jauheliha-kesäkurpitsapata – punnittu versio | 2.37995 |
| raejuusto-uunimunakas | Pehmeä raejuusto-uunimunakas – punnittu versio | 1.118275 |
| uunilohi-smetanakuorrutteella | Uunilohi smetanakuorrutteella – mustapippuriversio | 0.754875 |
| meksikolainen-quesadilla-sienilla | Aamiaisquesadilla sienillä ja maissilla – punnittu versio | 17.13059 |
| koshari | Koshari – kuorruttamattoman sipulin versio | 48.48915 |
| yangzhou-paistettu-riisi | Yangzhou-tyylinen paistettu riisi – kuumasta jasmiiniriisistä | 25.082095 |
| lohikeitto-kuohukermalla | Lohikeitto kuohukermalla – fonditon vesiversio | 10.457325 |

## Olennaiset hyväksytyt rajaukset

- Tortilla de patatas käyttää esikeitettyä perunaa ja kaiken 67,5 g öljyn.
  Se säilyy erillisenä aiemmasta Tortilla española -aamiaisreseptistä.
- Tabbouleh on lämmin, 15 min keitetyn bulgurin versio.
- Italian pata on pannulla kypsennettävä kesäkurpitsaversio, ei vanha uunivalmistus.
- Koshari käyttää kuorruttamatonta sipulia, 7 g valkosipulia sekä nimettyjä
  kuivia linssi-, riisi- ja makaronimassoja. Korkea GK esitetään neutraalisti.
- Yangzhou käyttää 600 g kuumaa kypsäpainoista jasmiiniriisiä ja 27,4 g öljyä.
  Jäähdytyksen tai rasvan ei oleteta alentavan GK:ta.
- Lohikeitto on fonditon vesiversio. GK noin 10,46 ei takaa luokkarajan
  samalla puolella pysymistä toisella GI-valinnalla.
- GI 40/30/50 pysyvät nimettyinä aiemmin rajattuina projektisovelluksina.
  Muut vilja-, peruna-, pasta- ja maissivastineet koskevat vain lukittuja
  ruokaperheitä ja valmistuksia. Kaikki arviot ovat LOW; biologista
  epävarmuusväliä ei tunneta. Nimettyjä yleisiä koostumusproxya ei väitetä
  tuotekohtaisiksi mittauksiksi. Kaikki luetellut syötävät osat ja rasvat kulutetaan;
  mittaamatonta kypsennys- tai liukenemishävikkiä ei vähennetä.

## Säilyvät HOLD-päätökset

- jauheliha-kaalikeitto-vhh
- jauhelihapihvit-vhh-kermakastikkeella
- vhh-kaalilaatikko
- ropa-vieja
- siskonmakkarakeitto-juurekset
- kana-parmesaanipannu-parsakaali
- kermainen-kanasienipannu

Näiden seitsemän puuttuvia polyolitietoja ei korvata nollalla eikä niiden
tutkimuslukuja hyväksytä julkaistaviksi kokonaisarvioiksi. Niiden elävät
reseptit ja käännökset säilyvät muuttumattomina. Myös jerk-kana, pav bhaji,
palak paneer ja nakkikeitto pysyvät aiemmissa HOLDeissa.
Teehaudutettujen munien puutteellista tilaa ei muuteta.

Ehdokaskattavuus on 130/326 (39,88 %); tuotannon viimeksi varmennettu
kattavuus on edelleen 119/326 (36,50 %). Kaikki aiemmat 119 tulosta säilyvät.

## Lukitut lähde-, versio- ja syötehashit

Tiedostojen SHA-256 käyttää UTF-8-sisältöä ja LF-rivinvaihtoja.

### tortilla-de-patatas

- sourceSha256: 4d41c79005e495157ee83baf71ee52909f05be96fe46056a713c8fd392093d40
- proposedVersionHash: 7c71d7a265d4457d4a0da61952efb66bf9e4f336d99481cb420de5785f67d35b
- inputHash: c3a4b93562600cc7d2e99beefacbf9f3b257be89d0b98ed1f3bc7980a8335154
- alkuperäinen tutkimuspaketti: 65e352be51a7e7d676bc2b9a019924dca7bacd6258bfb95b5e4b27e6758f0cd7

### tabbouleh

- sourceSha256: fba31d3887d9ff4f7eca535eac9b4a827ee739ba2d9f928aaec8fdaa8c3c6520
- proposedVersionHash: f59f63d187723d7a3fdcc55761dc4cb4978d63afb4767f1af29f7dd3120f1ff2
- inputHash: e453c1ac6153219848fff5b4f8caed7795f8fe6806e7e04d905d76897ae3145c
- alkuperäinen tutkimuspaketti: e1eefa285f7773a77fe0606a5ce7b49947a8f7ac4a5678cb668df63f80d3b83f

### munakoiso-jauhelihavuoka-vhh

- sourceSha256: 210a6df211caa4d038f894d11014be4852e87287d2616554e2d3c39a7d3db601
- proposedVersionHash: 49229cd71ee6d3f876b55058002d47ae959489a9a9bdc8214f33d8a82c798816
- inputHash: 42b51d7ff35b1e652db8d38208519953ad5591c4dc59caaa0e23e185db66b3c5
- alkuperäinen tutkimuspaketti: f8d9e42bc634ea2eb28a7720fe830923b2e56313fc0223236074a52b16e0b558

### parsakaali-sinihomejuustofrittata

- sourceSha256: 8c0fc0611d60a74b3a21b40a861918b521f35362d845d1a49ccec762ed6a5978
- proposedVersionHash: 89680942b56e99d2b5a066502f744f3ba946570bd1dd6fbcf18ad54e5962ca3d
- inputHash: e35bb059abfffe061e715d9e97227e825d9829b229eb1e9d99e0cdb8051ab93b
- alkuperäinen tutkimuspaketti: 8f3b8bda37242fec65d229600ef763e2c0fbc86b3c8862163ef465ba0e667c42

### italian-pata

- sourceSha256: bfa148f6e58cd10312afc88cc83f09432e12facde9fa7dc4fdbb7e61f18599fd
- proposedVersionHash: f158c1e6cff95b79f35e8790c287bf636cc12938e80cd1d1c59b928405b57acd
- inputHash: c0b8bf2a2baaa40460ba7dba6a3c6db84ac2ad3af4c1830113c4278d999279f3
- alkuperäinen tutkimuspaketti: 359d3c9359bcdeda084042b07423187c66d6f16f0c9e910697741f6d6b89564d

### raejuusto-uunimunakas

- sourceSha256: adc2da28ad27fe0f94ef8e8889fc81b5f8b98df7467d415b642ff7debba6c2ce
- proposedVersionHash: 36cdd134032025f01ef2d26d145a10fd61da07cb9b888a07d4475511d9e6def4
- inputHash: 922cc6694d58cdcbed20f25c7e821f7e7a2ee003850c8844b6e6a85bfeb96191
- alkuperäinen tutkimuspaketti: e38dd2fc66965aab84f98d444ebd06ac8fbb725f81cd44cb27d8a0b8e172e530

### uunilohi-smetanakuorrutteella

- sourceSha256: 7498c9ba8036b5917d2be5c8c1319e6734b862dd17fefcfbe3d6e9d2ac0c4b01
- proposedVersionHash: eef9e8d166791b2b9b78a1cb05070236296b46e4fa5a6acf17c86234c403f37f
- inputHash: a084a691f9c7989269b82077f3def62aafde40851226681a20cdbaa055563fa1
- alkuperäinen tutkimuspaketti: 24e8426608cdc856529e9fa6dc1939c56fc00f2cac7a50f682b2df209274dc9b

### meksikolainen-quesadilla-sienilla

- sourceSha256: 02151111815914f150a6df8aead880b87f52ea297c1d5e2ace5675d53322de3f
- proposedVersionHash: cde224ff95d17ad71127d705051b360d6565f946bd9544e27d85f95a231221a8
- inputHash: 2f4749d2a75007b26c43cb1fdca8cca662006e5c35eaf7b5769c9c1118480a19
- alkuperäinen tutkimuspaketti: b0f5c772bd0c2a548cbb48fd1fec634886873f0252961889b22e151b2b979770

### koshari

- sourceSha256: 651620fb69bd05d461229bc5b44fa960bc61917e338ced33f1c328d0e66ca16d
- proposedVersionHash: 5c1e5c0a87048737ccdd7c1acff0c523635c22bec8d7c97e47d67f5fcedad576
- inputHash: 22212e8899a55e76b5c3536c6281fea35e1d2c5a1408eda0a347a5178ee2a79d
- alkuperäinen tutkimuspaketti: 3aee7c5333750ce110a6d549d17a9a94395ba4feb7b415407f4d6e2f48579aff

### yangzhou-paistettu-riisi

- sourceSha256: 8c7df728c8ba0c5470ddb2052f7c9dea46e19e00cf4928bed3ddf2527ccdbe68
- proposedVersionHash: eac884e298f1f7db273cf0c20994e3d08c00f6f4af250b5f3a27a998ff911291
- inputHash: 301b5323034269c309b7df25ff43dbf21b0da8b7092f1b892603ada6784f6db9
- alkuperäinen tutkimuspaketti: 9b910331785e73ffccfe3081663cca0ab292af94711256e7430ec31d92c63d1f

### lohikeitto-kuohukermalla

- sourceSha256: bde79971941231dada8f1a188e2bd01490a465562315012c27b4c30de85d2223
- proposedVersionHash: d8971c7cea969c0ea981dd587e619258e1bd5b4172d8b931861db45291362541
- inputHash: a8e934c1abb080e1035a18f7f59cb6c7b9e32adbcf91325954c3c0137974e1e1
- alkuperäinen tutkimuspaketti: 50e097c1ab8e6612c9bfe447e5b79924d8f1c290795371ec3a6e6a31dcc3a43a

### Paketti, katselmointi ja 30 käännöstä

| Tiedosto | SHA-256 |
| --- | --- |
| docs/nutrition/gk80-release-7/manifest.json | b8dab2a3cd6e04b11ed04fe117012bb14e1abd6ad631aeaf6215fd8bae25917e |
| docs/nutrition/gk80-release-7/recipes.json | 445803b24196400dfa48bdc60c0a7886d73057ea27e885a15db4de364c67f693 |
| docs/nutrition/gk80-release-7/sources.json | 94151b24985f260b81ea31ef6d28f2c92082ff3b0e50eae622898b6a4698fc35 |
| docs/nutrition/gk80-release-7/composition-sources.json | 2cd68522d6f9404c519fb64b15e7316bfc5fa2e2c384eaa824055d31f79f048a |
| docs/nutrition/gk80-release-7/golden.json | 496a93e2a59300dc11e37333007adb3d4ca8dac9a1254f502898d7e7697c4061 |
| docs/nutrition/gk80-release-7/publication-macros.json | fe8f547cf7c49a551aa9bc1a502665413aaf225f14d3c21ed0ef9f2af7382409 |
| docs/nutrition/gk80-release-7/held-review.json | ff5843d5667720ff456e4c98bae4270025ba7329c38ba35a3560ecf3a258288d |
| docs/nutrition/gk80-run8/README.md | 6f4aa7c463a1cdb5568450d71d088326f7acb4cdaa90b6fdad347086f5e7f16a |
| docs/nutrition/gk80-run8/target-decision.md | 4b56885e4a514365234f8c99601c4b9a474c8495d7234d0de6d50fdc3c612097 |
| docs/reports/2026-11-01-gk80-run8-translation-review.md | 323016c0129739fe1e44ebd0737708015590e708afb1221d3438f85dacd27d28 |
| kaannokset/th/paaruoat/tortilla-de-patatas.md | e9b6602554008d24efcab245a12818ca99a91b6009922556ae15bc61fdd548b5 |
| kaannokset/sv/paaruoat/tortilla-de-patatas.md | 32926a5a0734e9e5d5750fa43ecf062262646127540434d728e4561d70f2afa6 |
| kaannokset/en/paaruoat/tortilla-de-patatas.md | 2f2fa67bb3fdd3c2c66c69c87f417c539abaa2dcfd99abc7f8f8040469b78a4b |
| kaannokset/th/alkuruoat/tabbouleh.md | 2273e07ac2c6d9520198e0d10996da91a425618f6be2c6974a743185bed2e810 |
| kaannokset/sv/alkuruoat/tabbouleh.md | 10b9536e0100010253d3030cf933f714d577f80ab61ae1ae42a8fe87c668b4de |
| kaannokset/en/alkuruoat/tabbouleh.md | d401450e029b8ed00e370adebd70495dbc5b06df134f421863638118abb3040a |
| kaannokset/th/paaruoat/munakoiso-jauhelihavuoka-vhh.md | d49c73e29baacdd49a3ede586a7fce86aba88344b3ae7cbdce55a3c6a7713cf5 |
| kaannokset/sv/paaruoat/munakoiso-jauhelihavuoka-vhh.md | fc507f63ca56126737eccddfab152e00195129dfffcb2d5cf5db30b9eec741c0 |
| kaannokset/en/paaruoat/munakoiso-jauhelihavuoka-vhh.md | 21897760cb9bb37a1e3acdb670127a18e147251c9346a9941892d618ae06346f |
| kaannokset/th/paaruoat/parsakaali-sinihomejuustofrittata.md | 04e2f87b4d636689d6cea28448e876e44dfc6666675760ef594d1bdc13de4aa4 |
| kaannokset/sv/paaruoat/parsakaali-sinihomejuustofrittata.md | f7a399ea360658536cb26e19115f75b03e3e9d9215990f526fe692d1bdbd2bb8 |
| kaannokset/en/paaruoat/parsakaali-sinihomejuustofrittata.md | 37017c9aef4f36523f477b7db966302037f35f370bec9a8772f19be28cc53a71 |
| kaannokset/th/paaruoat/italian-pata.md | 98e31650ae2dcb33a67be044042bfb1af695627417bc4d0cc783a8660ebe95dc |
| kaannokset/sv/paaruoat/italian-pata.md | baa42e21431895f4b1ee3bb28bb97cdb762e72952d2f84f3ff0c3889fbb7ade6 |
| kaannokset/en/paaruoat/italian-pata.md | be36c8f4ca285700e7ca608cb9d2d3e18089ffc5d0227114595997cd1eec581c |
| kaannokset/th/paaruoat/raejuusto-uunimunakas.md | 977b6f90d8b2afe3af76ff9d30c9bb6701a4eed1ba17e21ab863466998af1b2c |
| kaannokset/sv/paaruoat/raejuusto-uunimunakas.md | 27732983f9a0783d35994915d1c09df25d2e00ea9577efefedde18300c8df79e |
| kaannokset/en/paaruoat/raejuusto-uunimunakas.md | dbfe35eeb41a208e95195a193910f020d5844eb990f4d7596a41b599a42110e2 |
| kaannokset/th/paaruoat/uunilohi-smetanakuorrutteella.md | f2ba5db6d88414d960c52544a5e0f5383a8f57070d8f1e78bbb8a12d253b5f28 |
| kaannokset/sv/paaruoat/uunilohi-smetanakuorrutteella.md | e7972b9d159763c1357ff0d4abdc8537ef491509ccb456b11796da5cc0125596 |
| kaannokset/en/paaruoat/uunilohi-smetanakuorrutteella.md | 2473529522b397de9e55ece4b6fcc3e9c3ee5b53690558ba33f01b3bf04c5f4d |
| kaannokset/th/paaruoat/koshari.md | 12f1f3d17c42f6cf51e2cd5f4a6b40438be61920ca125f1b2b18dd8f0d6aad21 |
| kaannokset/sv/paaruoat/koshari.md | 7ee2f9e3a4140085bc2c44b258de2b1f292ab8dbb5f640f1a38f0de51241a4ef |
| kaannokset/en/paaruoat/koshari.md | 13db7c5cadaa84d4a58ac446f4bd387ae315902c7e4fe7abf2e863976cc46e4b |
| kaannokset/th/paaruoat/yangzhou-paistettu-riisi.md | ec8e520f873ad543617a1ab088b1eca45d3f4e384192cdd86802ed4ee84eefbd |
| kaannokset/sv/paaruoat/yangzhou-paistettu-riisi.md | 82648d86b1aa5328bd2126a6ff04a9caeb463b1263072d58a5c47bb8e71da3bf |
| kaannokset/en/paaruoat/yangzhou-paistettu-riisi.md | 01517040da86f7a1aa29faffb8ecc0a021f8182c0b975bc1ba49151dd4af909b |
| kaannokset/th/paaruoat/lohikeitto-kuohukermalla.md | 6291c1a0d99a7bfe1c86b76653a7c7cdf657f6cd18451fea66a87d59315bad4b |
| kaannokset/sv/paaruoat/lohikeitto-kuohukermalla.md | 766648f1fb9524ebcd8468bdabde81c3dc4b38a98156046f2679a26ba329bcba |
| kaannokset/en/paaruoat/lohikeitto-kuohukermalla.md | 253fa5411cf9f46beae7a7a75b2a92951df41c8d07164a8c18227d751024827c |

## Tämän kirjauksen vaikutus

Tämä commit lisää vain tämän päätösasiakirjan. Se ei muuta reseptejä, laskentaa,
Golden-aineistoa, manifestia, rekisteriä tai niiden hashia. Jäädytettyjen
pakettien hyväksyntää odottavat merkinnät ovat katselmointivaiheen tilannekuvia;
tämä asiakirja kirjaa uuden voimassa olevan omistajapäätöksen.
Sisältömuutos vaatii hyväksynnän soveltuvuuden uuden arvioinnin.

Seuraava valtuutettu toimi on repo_guardin Ready-siirtymä ja normaalin Codex
Code Review’n valmistumisen sekä mahdollisten havaintojen tarkistus.
Ei päällekkäistä katselmointia, uutta tutkimusajoa, ReportHub-muutoksia, mergeä tai deployta.

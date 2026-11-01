# PR #151 — omistajan eräpäätös

Tila: OWNER_METHOD_AND_CONTENT_APPROVED — AWAITING_SEPARATE_RELEASE_AUTHORIZATION.

Kirjattu: 2026-11-01T11:15:37+02:00.
PR: https://github.com/ozirix-dev/Reseptit/pull/151.

## Päätöksen alkuperä ja rajaus

Omistajalle esitettiin tässä Codex-keskustelussa seuraava koko erän päätöskysymys:

> Hyväksytäänkö erä seuraavaan vaiheeseen siten, että viisi ehdokasta etenee ja kaksi jää HOLD-tilaan? Kyllä / Ei.

Omistajan välitön vastaus:

> Kyllä

Hyväksyntä koskee alla yksilöityjen viiden täsmällisen reseptiversion sisältöä,
ravintoarvoja, rajattuja GI-sovelluksia, valmistusanalogioita, koostumusproxyja
ja LOW-mallinnusmerkintöjä katselmointikoosteen mukaisesti. Se kattaa kolmen
reseptin yhdeksän olemassa olevaa EN/SV/TH-vastinetta samoilla massoilla ja
valmistusrajauksilla. Tämä ei ole uusi kohdekieltä osaavan ihmisen tarkistus.

Hyväksytty HEAD: a71b18dac0a0027e5ccb662a0d450809e9b0d4f1.
Main-pohja ja päätöshetkellä tarkistettu main: dc388dcb51fbdbdd06e31ebe1e8e25885d48567d.
Hyväksytyn HEADin CI: https://github.com/ozirix-dev/Reseptit/actions/runs/41291792446 (SUCCESS).

Ready-siirtymää, mergeä tai deployta ei ole tällä päätöksellä valtuutettu.
PR säilyy Draftina. Sisältömuutokselle on arvioitava hyväksynnän soveltuvuus
uudelleen; hyväksyntä ei siirry automaattisesti uusiin reseptiversioihin.

## Hyväksytyt täsmälliset versiot

| Resepti | Mallinnettu GK / annos |
| --- | ---: |
| Butter chicken – punnittu hunajaversio | 4.9793 |
| Som tam kurkusta – punnittu versio | 1.873175 |
| Shakshuka kotiharissalla – punnittu versio | 2.346595 |
| Moo ping – koko marinadin pannuversio | 0.9868 |
| Kermainen lanttulaatikko – makeuttamaton versio | 5.140625 |

Kaikki viisi ovat LOW-luottamustasolla. GI 40/30/50 ovat nimetyt rajatut
projektisovellukset. Hunajan 55 on ryhmäkeskiarvo, kokonaisen maapähkinän
13 on heikomman T2-aineiston rajattu valmistusanalogia ja lantun 40 on
toimituksellinen sovellus, ei mitattu lanttulaatikon GI. Biologista
epävarmuusväliä ei tunneta. Koko marinadi ja luetellut syötävät osat kulutetaan;
mittaamattomia hävikkejä ei vähennetä eikä kuvien lisukkeita sisällytetä.

Ehdokaskattavuus on 119/326 (36,50 %); viimeksi tuotannosta varmennettu
kattavuus pysyy 114/326 (34,97 %). Aiemmat 114 numeerista tulosta sekä
teehaudutettujen munien puutteellinen tila säilyvät.

## Hyväksytyt HOLD-päätökset

- Palak paneer: N01301-r6-tietueen polyolimäärä on varmentamatta.
  Sokerien ja tärkkelyksen summasta laskettu CHO 0 ei osoita polyoleja nollaksi.
- Nakkikeitto kukkakaalilla: U170917-r6-laakerinlehden polyolimäärä on
  varmentamatta. Pientä mausteannosta ei poisteta eikä puuttuvaa arvoa keksitä.

Kummallekaan ei hyväksytä uutta julkaistavaa koko aterian lukua. Niiden elävät
reseptit ja käännökset säilyvät muuttumattomina. Yleistä ravintomallia ei väljennetä.

## Lukittu hyväksyntäkohde

Seuraavat SHA-256-arvot käyttävät UTF-8-sisältöä ja LF-rivinvaihtoja.
Valmistus- ja laskentaversioiden tunnisteet ovat kyseisen paketin omia sormenjälkiä.

### butter-chicken

- FI-lähde SHA-256: ed4aae9e70f42e3330fe0cc9ebd40829657f10ebcda9bf8cbce572d69ab8c844.
- proposedVersionHash: 7462a22e3bd33351c882c0815d0522613f4ac7d9c5de5180f29c8757f87f9df6.
- inputHash: d3380cddab28f5d5fa408d8849214d5b7996832761625afa8b829e9f15ae32a6.
- Lukittu alkuperäinen tutkimuspaketti: 11432af0b5eb9fab808c6cad35d904f4c62eb7f1d3d65c3e326c152771fa512d.

### som-tam-vhh-kurkkuna

- FI-lähde SHA-256: 281a4a755a3f337beafcc4bc1e6f03a63d1e07adffbaae3f01ae625f43e42e3d.
- proposedVersionHash: 06652d41da5fcf8d176701613a4b5c1e69bfa466ac0cf50d7eacf3d4e6dccc4e.
- inputHash: e2c750ce75c7a69329ac07e47c7312af585948f611b255ff6c5b33ae385e2dda.
- Lukittu alkuperäinen tutkimuspaketti: dc7a2b57f8613da88f6ebb6e950f6a9c858c15dbdd0ec24b4c3bffe164a4ab0a.

### pohjoisafrikkalainen-harissa-shakshuka

- FI-lähde SHA-256: d67ceed756075fd94a208344789c4323a8a59cf2a43300377255c38de8a9b6e0.
- proposedVersionHash: 7826d600b6e79441753155ebacbea8c443668e7f8b58fc39f13b1028bb768df2.
- inputHash: 8898b78ec4bde774784bbff4abd4ac79b8011c21d0868f7a340d2dfba5aa7ad1.
- Lukittu alkuperäinen tutkimuspaketti: de2d2746ecd57f4dbf90a0c08db0dd3b8634223ceb57f4a49fc0be5e6c716a42.

### moo-ping-vhh

- FI-lähde SHA-256: 12927430199de73435eb013f4208ab3b5b2db3deaac02e91aae15afffcc25407.
- proposedVersionHash: 77ef9e918dfeebe79dcb2dd0cebad4606fff0cc8080af611e4fcdbd3182da3c6.
- inputHash: 93a7ed64e7e11104d17487facb728a50a8505ecab2e8b684e5febcf45c529750.
- Lukittu alkuperäinen tutkimuspaketti: e4d0750ba9ef69770b428f54e462bb31e4604c559631adc1c919fb8ec9175cb2.

### lanttulaatikko-kermainen

- FI-lähde SHA-256: a906f10835a76549a852da321ede912f3e2fdd2caf05ed115dd51a990bdfd7ad.
- proposedVersionHash: a1b78bbc0fb609f3eac862eeadc75f7f0d401e88d6c582546e10863178b38fe3.
- inputHash: 4ed21eec89699f43cc7833473a6101232f89c3138545b901a66cd9cae904c988.
- Lukittu alkuperäinen tutkimuspaketti: 7858b27d1cedc1e0006b5066d3ede35a64d4701a7bcd98677c8df417a835ba8e.

### Lähde-, laskenta-, päätös- ja käännöstiedostot

| Tiedosto | SHA-256 |
| --- | --- |
| docs/nutrition/gk80-release-6/README.md | 26dde4843a840447d586c91617dc8363a8add673ad09c1a0cc6e45566b427170 |
| docs/nutrition/gk80-release-6/manifest.json | f6988ae4530d741873146d22336035aacb5c5dfcbc084db46df947ce396eab3e |
| docs/nutrition/gk80-release-6/recipes.json | 1c0c4e5c650271d0c6fcb7f4d75eb638dee25f6ada695f25aab783bb8c12e357 |
| docs/nutrition/gk80-release-6/sources.json | bf1241d1bd1c71ad21b3a4b600a38eb69a25036ebb81f547f4c904b7bdf3f87f |
| docs/nutrition/gk80-release-6/composition-sources.json | 2d97a53150b351bea5ba4667d6d396f258075847130abac445bbdafb384296db |
| docs/nutrition/gk80-release-6/golden.json | b3f8cf53f6421133b4dd73b8b1e8846f76a57dc7e368a541a3cb228315b77483 |
| docs/nutrition/gk80-release-6/publication-macros.json | 9571853571bf1538b5647ca9f7b19de6eaa5dfbc8c5cf3a47566b5b8e973ad1a |
| docs/nutrition/gk80-release-6/held-review.json | dff21635b41567d3de85b28c491b34a159ed5a80ce5eecef26f86d44dde1fbeb |
| kaannokset/en/paaruoat/butter-chicken.md | 3713351e3cfaba819e83acb6699d5fcbb4a0ec4754cbf8eb93f597cd33a25dd8 |
| kaannokset/en/alkuruoat/som-tam-vhh-kurkkuna.md | f2cceb3dfe1d9162571f74d4a2150ee1e2a9d0a46898b962d3ca4e448ed1467d |
| kaannokset/en/paaruoat/moo-ping-vhh.md | d6bb20fa1d607f8dea08450b1115ba9a1502e8a563672548828b48d18393029e |
| kaannokset/sv/paaruoat/butter-chicken.md | ac73f8ea85dd4fae2a8562b2218b6d6d95c45de5631facb9ca28190f8d5a1f89 |
| kaannokset/sv/alkuruoat/som-tam-vhh-kurkkuna.md | 415da0717a0c718d6d2c5c4be5aa8d993b8f6442447bcb82704855258a05fbd5 |
| kaannokset/sv/paaruoat/moo-ping-vhh.md | a47c4deda226e472eb80a56b413a756d2820c20cea7fa4bd45ed010d9cec7d0b |
| kaannokset/th/paaruoat/butter-chicken.md | f4fb38a18d3d1c0a903a231ed99e887dabb1ca17cf7f4d8d7ab300262bf06760 |
| kaannokset/th/alkuruoat/som-tam-vhh-kurkkuna.md | eb48d4930e682a58769e2f53a9ef3de4c95f38435b671cf38c438f29d08d0677 |
| kaannokset/th/paaruoat/moo-ping-vhh.md | ca9c2ac2afbe4fb8f736a1c2eaa6dfec31a401ae3ccb4859d32292a4ad405148 |

## Tämän kirjauksen vaikutus

Tämä muutos lisää vain tämän päätösdokumentin. Reseptit, laskentatiedostot,
Golden-aineistot, lähteet, manifesti, rekisteri ja niiden hashit säilyvät ennallaan.
Jäädytettyjen pakettien hyväksyntää odottavat merkinnät ovat katselmointivaiheen
tilannekuvia; tämä asiakirja kirjaa uuden voimassa olevan omistajapäätöksen.

Muut 18 valmisteltua ehdotusta, jerk-kana ja pav bhaji jäävät erilleen.
ReportHub #90/#88 ja vanha raporttipino eivät kuulu hyväksyntään.
Uutta tutkimusajoa, Ready-siirtymää, mergeä tai deployta ei tehdä.

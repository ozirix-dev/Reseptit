# J06 – jäljellä olevien kuvien täsmäpromptit Kokki-Codexille

**Työn vastaanottaja ja ainoa jäljellä olevan kuvaerän tuottaja: Kokki-Codex.** Chat 3 lopettaa uusien kuvien generoinnin tähän luovutukseen. Älä käynnistä rinnakkaista kuvatuottajaa.

- Sisältöpinni: `9494d29f90d839d698eebb118a64476edd7397ea`; BASE `3e0fe3418670cd02e283d6f59b5ef026ee7c8cc7`.
- J06: 19 FI-reseptiä; J06-10 on HOLD. 11 erillistä kuvaehdokasta on jo tehty ja WebP-muotoon muunnettu; jäljellä 8.
- Lue jokainen FI-tiedosto täsmälleen alla ilmoitetusta blobista ennen generointia. FI on ainoa raaka-aineiden totuus.
- Yksi itsenäinen kuva per resepti, yksi WebP per tavoitepolku. 16:9, tavoite 1600×900 (tai säilytä generaattorin suurempi natiivi 16:9, jos se on aidosti tarkka). Photorealistic editorial food photography, natural light, restrained neutral setting, dish fills the frame.
- **Ei tekstiä, ID-merkintää, lähdeviitettä, logoa, vesileimaa, kollaasia, infografiikkaa tai pakkausta kuvan pikseleihin.** Metadata ja lähde kirjataan manifestiin.
- Älä lisää reseptiin kuulumattomia koristeita, lisukkeita, proteiineja tai kastikkeita. Jos promptin ja FI-tiedoston välillä on ristiriita, FI voittaa ja ristiriita kirjataan.
- AI-kuva ei todista ruoan valmistusta, kypsyyttä, koepaistoa tai turvallisuutta.

## 11 jo tuotettua kuvaehdokasta

Tarkka WebP-manifesti: [j06-image-manifest-2026-11-26.json](j06-image-manifest-2026-11-26.json). 11/19: J06-01, 02, 03, 04, 05, 06, 11, 15, 16, 18 ja 19. Näitä ei generoida uudelleen. WebP:t ovat erillisessä chatin ZIP-paketissa; ne eivät vielä ole Gitin `kuvat/`-hakemistossa, Proton-arkistossa tai `assets/images.tracked-overlays.json`-manifestissa.

## 8 puuttuvaa kuvaa

### J06-07 · pla-rad-prik

- FI: `reseptit/paaruoat/pla-rad-prik.md`
- FI blob SHA-1: `79184a1526714896fb74b020acb9bfe8e3150250`
- Lähde: Praew, Hungry in Thailand – https://hungryinthailand.com/thai-crispy-fish-tamarind-sauce/
- Tavoite: `kuvat/paaruoat/pla-rad-prik.webp`

**Prompt:** Two thick boneless white-fish fillets, lightly dusted with corn starch and shallow-fried until golden at the edges. Spoon glossy reddish-brown tamarind, fish-sauce, garlic and fresh-chilli sauce over the fillets. Show only the cooked fish and its actual sauce. No whole fish, rice, heavy batter, extra vegetables or unlisted garnish.

### J06-08 · pla-neung-manao

- FI: `reseptit/paaruoat/pla-neung-manao.md`
- FI blob SHA-1: `073f828e47f6c729be1df9424c26d72a7e4d52a1`
- Lähde: Praew, Hungry in Thailand – https://hungryinthailand.com/thai-steamed-fish-recipe/
- Tavoite: `kuvat/paaruoat/pla-neung-manao.webp`

**Prompt:** A whole steamed sea bass on a serving platter, dressed with the pale lime-garlic-fish-sauce dressing, fresh red chillies, coriander and Chinese celery. Keep the fish whole and clearly steamed, with moist flesh and intact head and tail. No grill marks, fried crust, rice, extra vegetables or lemongrass stalks left as edible garnish.

### J06-09 · tod-mun-pla

- FI: `reseptit/alkuruoat/tod-mun-pla.md`
- FI blob SHA-1: `800169956a2e436e1eafe0c1827c5c813793c9c6`
- Lähde: Praew, Hungry in Thailand – https://hungryinthailand.com/tod-mun-pla-recipe/
- Tavoite: `kuvat/alkuruoat/tod-mun-pla.webp`

**Prompt:** Three small, flat, golden Thai fish cakes as one serving, with visible finely chopped long beans and makrut lime leaf flecks in the cakes. Crisp lightly browned exterior, moist fish interior, served plain on a simple plate. No dipping sauce, salad, breading, rice or extra garnish. Recipe yield is 12 cakes for 4 servings.

### J06-12 · moo-hong

- FI: `reseptit/paaruoat/moo-hong.md`
- FI blob SHA-1: `f9c81e7b82bab22a9cf550e9d76dc87e02bb2d39`
- Lähde: Praew, Hungry in Thailand – https://hungryinthailand.com/moo-hong/
- Tavoite: `kuvat/paaruoat/moo-hong.webp`

**Prompt:** Tender layered pork-belly chunks braised in a dark, glossy soy, garlic, palm-sugar and spice sauce. The pork should look slowly braised and fork-tender, with sauce clinging naturally to the meat. No boiled egg, tofu, rice, fresh herb garnish, star anise or cinnamon stick left in the serving.

### J06-13 · kai-palo

- FI: `reseptit/paaruoat/kai-palo.md`
- FI blob SHA-1: `7bcee9f65b08e13d04432614fb1842af5dfc6d0b`
- Lähde: Marion Grasby, Marion's Kitchen – https://www.marionskitchen.com/thai-braised-pork-egg/
- Tavoite: `kuvat/paaruoat/kai-palo.webp`

**Prompt:** One serving of dark five-spice braising broth with tender pork-belly cubes, fried firm tofu pieces and one whole peeled hard-boiled egg. Coriander may appear only as the recipe's measured finishing herb. No rice, extra egg, star anise or cinnamon garnish, vegetables or sauce ingredients absent from the FI recipe.

### J06-14 · gaeng-hang-lay

- FI: `reseptit/paaruoat/gaeng-hang-lay.md`
- FI blob SHA-1: `7c53fda3d14f2fe0d0ef025ca3bab60cf0c196fb`
- Lähde: Suwanee, Simply Suwanee – https://www.simplysuwanee.com/gaeng-hung-lay/
- Tavoite: `kuvat/paaruoat/gaeng-hang-lay.webp`

**Prompt:** Northern Thai gaeng hang lay in a simple bowl: tender chunks of pork belly and pork shoulder in a reddish-brown, non-coconut braising curry, with visible ginger matchsticks and Thai pickled garlic pieces. No coconut milk, rice, peanuts, fresh herb garnish, whole spices or unused curry-paste ingredients scattered on top.

### J06-17 · ayam-percik

- FI: `reseptit/paaruoat/ayam-percik.md`
- FI blob SHA-1: `3c94a6895631a9eb80e7bc57bb81dd38c4ba4725`
- Lähde: Emily Halim, Nyonya Cooking – https://www.nyonyacooking.com/recipes/ayam-percik~2JIHfE6OLH
- Tavoite: `kuvat/paaruoat/ayam-percik.webp`

**Prompt:** One cooked bone-in, skinless chicken thigh, roasted and glazed with the recipe's thick, spiced coconut sauce. The sauce should visibly coat the browned chicken; keep the portion focused on the single thigh. No rice, whole chicken, skin-on chicken, skewers, lemongrass stalks as serving garnish or unrelated vegetables.

### J06-20 · filippiinilainen-kana-adobo

- FI: `reseptit/paaruoat/filippiinilainen-kana-adobo.md`
- FI blob SHA-1: `2b1178a3ae8a97942eb7cb7eabe74068adfb2046`
- Lähde: Corinne Domingo, Food Network – https://www.foodnetwork.com/recipes/filipino-chicken-adobo-recipe-1955818
- Tavoite: `kuvat/paaruoat/filippiinilainen-kana-adobo.webp`

**Prompt:** A serving of cooked bone-in, skin-on chicken thigh pieces braised in a dark, glossy vinegar-and-soy sauce with garlic and black pepper. The chicken skin is intact and visibly cooked; the sauce is reduced around the meat. No rice, coconut milk, whole chicken, bay leaves left on the plate, herbs or vegetables.

## Vastaanotto

Kokki-Codex palauttaa yhden manifestin, jossa jokaisella kuvalla on recipe_id, FI blob SHA-1, lähde-URL, tiedostonimi, tavumäärä, mitat, SHA-256, AI-alkuperä ja visuaalisen vastaavuuden tarkistus. Hylkää tekstillä/vesileimalla varustetut, väärää ruokaa esittävät tai ylimääräisiä aineksia sisältävät kuvat. Älä muuta reseptien YAML-image-metadataa tai jaettuja overlay-manifesteja tässä tehtävässä. ImageAssets/Proton-seal, readback, Git-overlay, CI ja julkaisu ovat erillisiä portteja. J06-10 pysyy HOLDissa.

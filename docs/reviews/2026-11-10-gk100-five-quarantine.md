# Recipavo – viiden GK100-versioon sidotun, mutta reseptinä keskeneräisen FI-lähteen julkinen karanteeni

10.11.2026. **Issue #404:n B21-kohteet #03, #06, #11, #58 ja #70**. Tämä on turvallisen julkaisun rajaus, **ei** minkään viiden reseptin tai niiden ravintoarvojen hyväksyntä.

| #404 | Resepti | Päätöksen peruste |
|---:|---|---|
| #03 | `indonesialainen-nasi-goreng-aamiaisriisi` | 150 g kecap manis 100 g riisiä kohti; poikkeuksellinen sokeri-/kastikeosuus, ruoan aines- ja GI/GK-perusta epäselvä |
| #06 | `japanilainen-yaki-onigiri-misolla` | 150 g misoa ja 150 g noria 100 g riisiä kohti; ylisuuret ainesmäärät ja väärä vanha valmistus |
| #11 | `karibia-saltfish-fritterit` | 1 tl suolakalaa, ilmoittamaton taikinaan jäävä vesimäärä ja suolakalan liotus/suolanpoisto puutteellinen |
| #58 | `intialainen-idli-kookoschutneylla` | 150 g sinapinsiemeniä ja kuivat riisi/urad-raaka-aineet ilman fermentointia ja kunnollista aika-arviota |
| #70 | `vietnamilainen-xoi-maapahkinalla` | 100 g seesamia + 100 g maapähkinää ja 150 g kookosta 100 g riisiä kohti; määrien ja ruokalajin laskentaperusta tarkistettava |

Jokaisella on historiallinen hyväksytty GK100-erikoisversio joko `docs/nutrition/gk100-approved-releases/v31-eight.json`, `eighteen.json` tai `approved-five.json` -tiedostossa. Niiden hyväksyntä koskee nimenomaista arvioitua versiota, **ei** todista nykyisen alkuperäisreseptin syötävyyttä, mittasuhteita tai valmistuskelpoisuutta.

Julkaisukaranteeni kohdistetaan samaan jo PR #407:ssä ja #419:ssä testattuun `site/scripts/public-recipe-quarantine.ts`-listaan. Tämä poistaa julkaistuista FI-/EN-/SV-/TH-reiteistä ja julkisista GK-korteista täsmälleen 5 uutta recipe_id:tä. **GK100:n suljetut historiallisen hyväksynnän paketit, lähdetiedostojen SHA:t, lasketut numerot, käännösrekisteri ja ravintomakrot säilyvät muuttumattomina.** Testiin sisällytetään jokaisen uuden tapauksen alkuperäinen Git-blob-SHA.

Yhteensä karanteenissa on tämän jälkeen 16 ID:tä (3 alkuperäistä turvallisuuskohdetta + 8 B21-määräperustaa + 5 GK100-sidonnaista). Edellisessä julkisessa FI-aamiaisvalikoimassa oli 139 reseptiä, tässä versiossa odotetaan 134. FI-lähteet jäävät historialliseen 337 alkuperäisreseptin tietokantaan; sivuston näkyvä kokonaismäärä on eri luku.

### Palautumiskriteeri

Tunnus poistetaan karanteenista vain erillisessä lähdepohjaisessa korjaus-PR:ssä, jossa todentuvat ruokalajikohtaiset määrät ja raaka/kypsä/kuiva-tuotemuoto, valmistustapa ja aika, annokset, tuotekohtaiset ravintoarvot ja GI/GK-evidenssi sekä julkaistut kielet. Jos turvallista materiaalia ei saada, reseptiä ei pidä palauttaa. Älä muuta vain version hashia tai korvaa tuntematonta GI:tä nollalla.

**Tämä PR ei tee Cloudflare/Recipavo-domainin tuotantosiirtoa eikä merkitse issue #404:n reseptejä valmiiksi.**

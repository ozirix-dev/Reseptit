# Chat-4 – Savupororullien puuttuvan allergeenipakkausohjeen käännöskorjaus

Päiväys: 2026-11-22. Työn omistaja: Chat 4. Lähtö-main `4779d89890d363c6b3ccadea4be7a5d1e3fd9921`.

## Todettu FI→EN/SV/TH merkitysero

Julkaistu FI-lähde `savupororullat-kantarelleilla` sanoo turvallisuushuomautuksessa: **”Kylmäsäilytys ja tuotepakkausten allergeenit tarkistettava.”** Kaikki kolme käännösluonnosta edellyttivät kylmäsäilytystä mutta **jättivät tuotepakkausten allergeenitarkistuksen pois**.

Korjaus säilyttää alkuperäiset turvaohjeet ja täydentää puuttuvan vaatimuksen:
- EN: `Check the product packaging for allergens.`
- SV: `Kontrollera allergenerna på produktförpackningarna.`
- TH: `ตรวจสอบข้อมูลสารก่อภูมิแพ้บนฉลากบรรจุภัณฑ์ของผลิตภัณฑ์`

Muutos koskee vain kolmen `draft`-käännöksen turvallisuushuomautusta. Ainesosat, määrät, valmistus, kuvat, FI-lähde, GK ja ravintoarvot pysyvät samoina. Päivitetty myös kaikkien kolmen Git-blobin SHA-tunnisteet 32 tiedoston inventaarioon ja lisätty kohdennettu regressiotesti.

## Hyväksyntäraja

**EDITORIAL_CORRECTION_ONLY – FORMAL_SEMANTIC_APPROVAL: HOLD.** Tämä on konkreettinen merkityskorjaus, ei riippumattoman arvioijan todistettu hyväksyntä. Kaikki 24 käännöstä ovat edelleen luonnoksia, eikä `meta/kaannokset/codex-review-evidence.json`- tai `human-review-evidence.json`-rekisteriin lisätä hyväksyntöjä. Raakakalareseptien erillinen turvallisuus-HOLD ei muutu.

Chat-1 vastaa Ready-siirrosta ja Repo Guard -mergestä hyväksyttyjen täsmä-HEAD CI-tulosten jälkeen.

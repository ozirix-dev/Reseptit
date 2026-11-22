import type { RecipeLocale } from "../src/types/content";

type CopyEdits = readonly (readonly [before: string, after: string])[];

interface ReviewedRecipeCopy {
  title?: string;
  description?: string;
  useSeoDescription?: true;
  method?: CopyEdits;
  notes?: CopyEdits;
  ingredientItem?: CopyEdits;
  ingredientNote?: CopyEdits;
  nutritionBasis?: string;
}

// Display-only edits. Canonical ingredients, release evidence and calculation inputs
// stay in their source files. Edits match the approved display text before this pass.
const reviewedCopy: Readonly<Record<string, ReviewedRecipeCopy>> = {
  // #327 / Chat 2: specify fully set steamed egg in FI lablabi.
  "pohjoisafrikkalainen-lablabi/fi": { method: [["2. Kypsennä 110 g kuorettomana punnittua kananmunaa höyryssä pienessä astiassa ilman lisättyä rasvaa. Käytä koko määrä.", "2. Mittaa ainesluettelon 110 g kananmunaa ilman kuorta pieneen höyrytykseen soveltuvaan astiaan. Höyrykypsennä ilman lisättyä rasvaa, kunnes sekä valkuainen että keltuainen ovat kauttaaltaan hyytyneet; tarkista kypsyys myös astian keskeltä. Käytä koko 110 g munamäärä."]] },
  // #327 Chat 2: raw chicken added after rice porridge must reach 75 °C.
  // The two eggs are boiled, without unlisted cooking oil.
  "thai-jok-kanalla/fi": { method: [["2. Lisää kuutioitu broilerin rintafilee ja raastettu inkivääri. Keitä, kunnes kana on täysin kypsää.\n3. Kypsennä kananmunat erikseen ja tarjoa ne puuron päällä.", "2. Kuutioi ainesluettelon 150 g raakaa, nahatonta broilerin rintafileetä ja lisää se puuroon yhdessä raastetun inkiväärin kanssa. Jatka keittämistä, kunnes broileri on kauttaaltaan kypsää ja paksuimman palan sisälämpötila on vähintään 75 °C. Tarkista lämpötila elintarvikelämpömittarilla; jatka kypsennystä tarvittaessa.\n3. Keitä ainesluettelon kaksi kananmunaa erikseen vedessä, kunnes sekä valkuainen että keltuainen ovat kypsiä. Kuori munat ja tarjoa ne puuron päällä. Älä lisää paistorasvaa tai ainesluettelon ulkopuolisia lisukkeita."]] },
  // #404 / Chat 5: replace FI upma's unlisted meat and sides with EN/SV/TH source-backed dry-toast and vegetable simmer method.
  "intialainen-mannasuurimoupma/fi": { method: [["1. Mittaa mannasuurimo kattilaan ja lisää reseptin neste. Kuumenna kiehuvaksi samalla pohjaa myöten sekoittaen.\n2. Hauduta miedolla lämmöllä välillä sekoittaen, kunnes puuro on pehmeää ja sakeaa. Lisää nestettä vähän kerrallaan, jos rakenne tiivistyy liikaa.\n3. Kypsennä liha tai muut täytteet kypsiksi ja lisää puuroon. Tarkista suola ja mausteet.\n4. Tarjoa lämpimänä kookoschutneyn tai jogurtin kanssa.", "1. Kuumenna kuiva, paksupohjainen pannu keskilämmölle. Lisää 100 g vehnämannasuurimoita ja paahda jatkuvasti sekoittaen, kunnes ne tuoksuvat kevyesti mutta eivät ruskistu. Siirrä suurimot kulhoon.\n2. Kuori ja kuutioi ainesluettelon yksi porkkana pieneksi. Huuhtele 150 g herneitä ja 5 g tuoreita currylehtiä. Kuumenna kattilassa koko 300 ml vettä ja lisää porkkana, herneet sekä currylehdet. Keitä, kunnes kasvikset ovat kypsiä.\n3. Lisää paahdetut mannasuurimot vähitellen hiljalleen kiehuvaan kasvisseokseen jatkuvasti sekoittaen, etteivät ne paakkuunnu. Pienennä lämpöä ja hauduta, kunnes suurimot ovat pehmeitä ja vesi on imeytynyt. Mausta vain ainesluettelon suolalla tarpeen mukaan.\n4. Jaa lämmin upma kahteen annokseen. Tarjoa sellaisenaan ilman lihaa, kookoschutneyta, jogurttia, lisättyä rasvaa tai muita aineslistan ulkopuolisia lisukkeita."]] },
  // #327 / Chat 2: pin banana's 120 g to the peeled edible mass, not the peel.
  // FI display only; sealed four-language sources and nutrition stay unchanged.
  "indonesialainen-pisang-goreng-aamiaiseksi/fi": { method: [["2. Kuori banaani ja leikkaa pitkittäisiksi tai vinottaisiksi, tasapaksuiksi viipaleiksi. Kääntele viipaleet taikinassa.", "2. Kuori banaani ja punnitse vasta kuorinnan jälkeen 120 g syötävää banaania ainesluettelon mukaan. Leikkaa punnittu banaani pitkittäisiksi tai vinottaisiksi, tasapaksuiksi viipaleiksi ja kääntele viipaleet taikinassa."]] },
  // #404 / Chat 5: remove false oil/stock and require cooked chicken; match source-specific EN/SV/TH preparation.
  "vietnamilainen-pho-ga-aamuksi/fi": { method: [["1. Kuumenna kattilassa öljy tai liemi. Lisää aromit ja hitaammin kypsyvät ainekset; paista tai hauduta muutama minuutti.\n2. Kaada kattilaan liemi ja keitä miedosti, kunnes pääraaka-aineet ovat kypsiä.\n3. Lisää nuudelit, lehtivihannekset tai muut nopeasti kypsyvät ainekset niiden kypsymisajan mukaan.\n4. Keitä inkivääriä ja tähtianista vedessä miedolla lämmöllä. Kypsennä kananrinta vedessä, nosta se ja viipaloi. Kypsennä riisinuudelit pakkauksen ajan ja tarjoa kuumassa liemessä kanan kanssa.", "1. Kiehauta 700 ml vettä kattilassa. Lisää 2 g tuoretta inkivääriä ja 1 g tähtianista. Laske lämpöä, peitä kattila ja anna mausteiden hautua hetki. Älä lisää öljyä tai valmista lientä.\n2. Lisää mausteveteen kaikki 150 g raakaa nahatonta broilerin rintafileetä. Hauduta hiljalleen, kunnes paksuimman kohdan sisälämpötila on vähintään 75 °C elintarvikelämpömittarilla mitattuna. Nosta kypsä kana puhtaalle leikkuulaudalle, anna levätä hetki ja viipaloi ohuesti.\n3. Keitä 100 g kuivia riisinuudeleita erillisessä kattilassa pakkauksen ohjeen mukaan. Valuta ja jaa nuudelit kahteen kulhoon. Pese raakaan kanaan koskeneet välineet ennen niiden käyttämistä kypsälle ruoalle.\n4. Kauho kuuma maustettu keitinvesi nuudeleiden päälle ja jaa kypsä kana kulhoihin. Lisää ainesluettelon suolaa tarvittaessa ja tarjoile heti."]] },
  // #404 / Chat 5: replace false patty batter instructions in FI poha with the weighed rice-flake method already in EN/SV/TH.
  "indialainen-poha-maapahkinoilla/fi": { method: [["1. Raasta, muussaa tai hienonna pääraaka-aine. Sekoita joukkoon taikinan ainekset ja lisää vettä vain sen verran, että seos pysyy koossa.\n2. Kuumenna pannulla ohut kerros öljyä. Muotoile pieniksi pihveiksi tai lusikoi taikina pannulle.\n3. Paista keskilämmöllä molemmin puolin kypsäksi ja rapeapintaiseksi. Paista erissä, jotta pannu ei jäähdy.\n4. Huuhtele riisihiutaleet nopeasti ja valuta. Kuullota maapähkinät, herneet ja curry-lehdet öljyssä; lisää hiutaleet ja kypsennä sekoittaen. Viimeistele korianterilla ja sitruunamehulla.", "1. Mittaa 100 g riisihiutaleita. Huuhtele ne nopeasti siivilässä kylmällä vedellä ja valuta hyvin. Hiutaleiden pitää pehmetä mutta pysyä irtonaisina.\n2. Kuumenna pannulla koko ainesluettelon 1 rkl neutraalia paistoöljyä. Lisää 20 g maapähkinöitä ja 3 g currylehtiä; paahda varovasti sekoittaen, etteivät pähkinät pala. Lisää 50 g herneitä ja kypsennä ne kauttaaltaan.\n3. Lisää valutetut riisihiutaleet pannulle ja kääntele varovasti maapähkinöiden ja herneiden joukkoon. Kuumenna miedolla lämmöllä, kunnes kaikki on kauttaaltaan kuumaa. Lisää ainesluettelon suolaa tarvittaessa.\n4. Nosta pannu pois liedeltä. Jaa kahteen annokseen ja viimeistele yhteensä 1 rkl:lla hienonnettua tuoretta korianteria ja 1 rkl:lla sitruunamehua. Käytä vain lueteltuja raaka-aineita."]] },
  // #327 / Chat 5: sesame is included in the sealed eight-roll nutrition estimate.
  // Show the 8 g amount in each language; keep all canonical recipes and macros unchanged.
  "keto-kauralesesampylat/fi": { method: [["5. Jaa taikina kahdeksaan osaan ja muotoile kostein käsin sämpylöiksi. Lisää halutessasi pinnalle seesaminsiemeniä.", "5. Jaa taikina kahdeksaan osaan ja muotoile kostein käsin sämpylöiksi. Ripottele pinnalle yhteensä 8 g seesaminsiemeniä, jotta annos vastaa ilmoitettuja ravintoarvoja. Jos jätät seesamin pois, ilmoitetut ravintoarvot eivät enää vastaa valmistamaasi versiota."]] },
  "keto-kauralesesampylat/en": { method: [["5. Divide the dough into eight parts and shape into rolls with wet hands. If you want, add sesame seeds on top.", "5. Divide the dough into eight parts and shape into rolls with wet hands. Sprinkle a total of 8 g sesame seeds on top to match the stated nutrition values. If you omit the sesame seeds, the stated nutrition values no longer describe your version."]] },
  "keto-kauralesesampylat/sv": { method: [["5. Dela degen i åtta delar och forma till frallor med fuktiga händer. Om du vill, lägg sesamfrön ovanpå.", "5. Dela degen i åtta delar och forma till frallor med fuktiga händer. Strö totalt 8 g sesamfrön ovanpå för att följa de angivna näringsvärdena. Om du utelämnar sesamfröna motsvarar de angivna näringsvärdena inte längre din version."]] },
  "keto-kauralesesampylat/th": { method: [["5. แบ่งแป้งออกเป็นแปดส่วนแล้วปั้นเป็นขนมปังก้อนด้วยมือที่เปียก หากต้องการให้เพิ่มเมล็ดงาลงไปด้านบน", "5. แบ่งแป้งออกเป็นแปดส่วนแล้วปั้นเป็นขนมปังก้อนด้วยมือที่เปียก โรยเมล็ดงารวม 8 กรัมบนขนมปังเพื่อให้ตรงกับข้อมูลโภชนาการที่ระบุไว้ หากไม่ใส่เมล็ดงา ข้อมูลโภชนาการที่ระบุไว้จะไม่ตรงกับสูตรที่ทำจริง"]] },
  // #327 / Chat 5: align FI halloumi toast instructions with existing EN/SV/TH;
  // do not touch nutrition-bound recipe source, amounts or GK evidence.
  "valimerellinen-halloumi-tomaattileipa/fi": {"description":"Paahdettua hapanjuurileipää, jonka päällä on lämpimänä paistettua halloumia, tuoretta tomaattia ja vihreitä oliiveja.","method":[["1. Sekoita jauhot, neste ja suola. Vaivaa pehmeäksi taikinaksi ja anna levätä 10 minuuttia. Jos reseptissä on valmis leipä tai taikina, siirry täyttöön.\n2. Jaa taikina osiin ja painele tai kauli ohuiksi leiviksi. Lisää taikinaan kuuluva täyte tai mausteöljy.\n3. Paista kuumalla pannulla molemmin puolin kypsäksi ja nosta liinan alle pysymään pehmeänä.\n4. Viipaloi halloumi ja paista se kevyesti öljytyllä pannulla kullanruskeaksi. Paahda hapanjuurileipä, lisää viipaloitu tomaatti ja oliivit ja aseta lämmin halloumi päälle.","1. Viipaloi 150 g halloumia tasakokoisiksi paloiksi. Huuhtele ja viipaloi 100 g tomaattia. Valuta tai viipaloi 25 g vihreitä oliiveja ja poista kivet tarvittaessa. Käytä yhteensä 100 g valmista hapanjuurileipää.\n2. Kuumenna pannu keskilämmölle ja lisää ainesluettelon 1 rkl neutraalia paistoöljyä. Paista halloumiviipaleet molemmin puolin kullanruskeiksi. Älä lisää muuta rasvaa.\n3. Paahda leipä kuivalla pannulla tai leivänpaahtimessa rapeaksi.\n4. Jaa leipä, tomaatti, oliivit ja paistettu halloumi kahdelle lautaselle. Lisää suolaa vain tarvittaessa ja tarjoile halloumi lämpimänä."]]},
  // #327 Chat 2: replace the remaining formulaic FI intro with facts from
  // the source-locked maakouda method. Do not change its GK or translations.
  "pohjoisafrikkalainen-maakouda-punnittu-v2/fi": {"description":"Marokkolaiset maakouda-perunapihvit tehdään keitetyistä perunoista, kananmunasta ja vehnäjauhoista. Persiljalla ja juustokuminalla maustetusta massasta muotoillaan kuusi pihviä, jotka paistetaan pannulla kullanruskeiksi."},
  // #327: remove generic cucumber som tam preparation text in four locales.
  // Source-backed nutrition/GK and published translation bytes are unchanged.
  "som-tam-vhh-kurkkuna/fi": {"description":"Kurkkusuikaleet, tomaatti ja valmiiksi kypsennetyt vihreät pavut saavat tulisen limetti-kalakastikkeen. Paahdetut maapähkinät tuovat rapeutta neljään annokseen.","method":[["1. Punnitse luetellut syötävät raaka-aineet grammoina; älä lisää luetteloimatonta rasvaa tai lisukkeita.\n2. Kaavi kurkun siemenosa pois ja punnitse sen jälkeen 500 g syötävää kurkkua. Punnitse 100 g jo keitettyjä ja valutettuja vihreitä papuja; raakoja papuja ei käytetä sellaisenaan. Paloittele tomaatti.\n3. Murskaa valkosipuli ja chili. Rouhi karkeasti puolet kokonaisista paahdetuista maapähkinöistä, älä jauha tahnaksi. Lisää limettimehu, kalakastike ja 4 g Foodin-erytritolia.\n4. Sekoita kaikki kasvikset ja kastike. Lisää loput maapähkinät. Syö koko kastike ja jaa neljään annokseen.","1. Kaavi kurkusta siemenosa pois ja punnitse jäljelle jäävästä syötävästä kurkusta 500 g. Paloittele 150 g tomaattia. Mittaa 100 g valmiiksi kypsennettyjä ja valutettuja vihreitä papuja; älä käytä papuja raakoina.\n2. Murskaa 3,5 g valkosipulia ja 5 g chiliä. Sekoita niihin kastikkeeksi kaikki 30 g limettimehua, 15 g kalakastiketta ja 4 g Foodin-erytritolia.\n3. Rouhi karkeasti puolet 30 g paahdetuista suolattomista maapähkinöistä. Lisää kurkku, tomaatti ja kypsät pavut kulhoon ja kääntele joukkoon koko kastike.\n4. Lisää rouhitut pähkinät ja viimeistele lopuilla kokonaisilla paahdetuilla maapähkinöillä. Jaa salaatti ja kaikki kastike neljään annokseen; lisää luettelon suolaa vain tarvittaessa."]]},
  "som-tam-vhh-kurkkuna/en": {"description":"Cucumber, tomato and already-cooked green beans are tossed in a chilli, lime and fish-sauce dressing. Roasted peanuts add crunch to four servings.","method":[["1. Weigh all listed edible ingredients. Do not add unlisted oil or side dishes.\n2. Remove the cucumber seed core, then weigh 500 g edible cucumber. Weigh 100 g already cooked and drained green beans; do not use raw beans. Cut the tomato.\n3. Crush the garlic and chilli. Coarsely chop half the whole roasted peanuts; do not grind them into a paste. Add lime juice, fish sauce and 4 g Foodin erythritol.\n4. Combine all vegetables and dressing, then add the remaining peanuts. Consume all dressing and divide into four portions.","1. Remove the cucumber seed core and weigh 500 g of the remaining edible cucumber. Cut up 150 g tomato. Measure 100 g green beans that have already been fully cooked and drained; do not use raw beans.\n2. Crush 3.5 g garlic and 5 g fresh chilli. Mix them with all 30 g lime juice, 15 g fish sauce and 4 g Foodin erythritol to make the dressing.\n3. Coarsely chop half of the 30 g unsalted roasted peanuts. Place the cucumber, tomato and cooked beans in a bowl and toss with all the dressing.\n4. Add the chopped peanuts and finish with the remaining whole roasted peanuts. Divide the salad and all the dressing into four servings; use only the listed salt if needed."]]},
  "som-tam-vhh-kurkkuna/sv": {"description":"Gurka, tomat och färdigkokta gröna bönor blandas med en dressing av chili, lime och fisksås. Rostade jordnötter ger krispighet åt fyra portioner.","method":[["1. Väg alla angivna ätliga ingredienser. Tillsätt inte olistad olja eller tillbehör.\n2. Ta bort gurkans kärnhus och väg därefter 500 g ätlig gurka. Väg 100 g redan kokta och avrunna gröna bönor; använd inte råa bönor. Skär tomaten.\n3. Krossa vitlök och chili. Grovhacka hälften av de hela rostade jordnötterna; mal dem inte till en pasta. Tillsätt limesaft, fisksås och 4 g Foodin-erytritol.\n4. Blanda alla grönsaker med dressingen och tillsätt resten av jordnötterna. Ät hela dressingen och fördela i fyra portioner.","1. Ta bort gurkans kärnhus och väg 500 g av den återstående ätliga gurkan. Skär upp 150 g tomat. Mät upp 100 g redan genomkokta och avrunna gröna bönor; använd inte råa bönor.\n2. Krossa 3,5 g vitlök och 5 g färsk chili. Blanda med alla 30 g limesaft, 15 g fisksås och 4 g Foodin-erytritol till en dressing.\n3. Grovhacka hälften av de 30 g osaltade rostade jordnötterna. Lägg gurka, tomat och kokta bönor i en skål och vänd ner all dressing.\n4. Tillsätt de hackade nötterna och avsluta med resten av de hela rostade jordnötterna. Fördela salladen och all dressing på fyra portioner; använd endast det angivna saltet vid behov."]]},
  "som-tam-vhh-kurkkuna/th": {"description":"ส้มตำแตงกวาใส่มะเขือเทศและถั่วแขกต้มสุก คลุกน้ำปรุงพริก มะนาว และน้ำปลา โรยถั่วลิสงคั่วกรุบกรอบ แบ่งได้ 4 ที่","method":[["1. ชั่งวัตถุดิบส่วนที่กินได้ทั้งหมดตามรายการ ไม่เติมน้ำมันหรือเครื่องเคียงนอกสูตร\n2. คว้านเมล็ดแตงกวาออกแล้วชั่งส่วนที่กินได้ 500 g ชั่งถั่วแขกที่ต้มสุกและสะเด็ดน้ำแล้ว 100 g ไม่ใช้ถั่วแขกดิบ หั่นมะเขือเทศ\n3. ตำกระเทียมและพริก สับถั่วลิสงคั่วทั้งเมล็ดครึ่งหนึ่งให้หยาบ ไม่บดเป็นเนยหรือเนื้อเนียน ใส่น้ำมะนาว น้ำปลา และอิริทริทอล Foodin 4 g\n4. คลุกผักทั้งหมดกับน้ำปรุง ใส่ถั่วลิสงที่เหลือ กินน้ำปรุงทั้งหมดและแบ่งเป็น 4 ที่","1. คว้านแกนเมล็ดแตงกวาออกแล้วชั่งส่วนที่กินได้ที่เหลือ 500 กรัม หั่นมะเขือเทศ 150 กรัม เตรียมถั่วแขกที่ต้มสุกทั่วถึงและสะเด็ดน้ำแล้ว 100 กรัม ห้ามใช้ถั่วแขกดิบ\n2. ตำกระเทียม 3.5 กรัมและพริกสด 5 กรัม ผสมกับน้ำมะนาวทั้งหมด 30 กรัม น้ำปลา 15 กรัม และอิริทริทอล Foodin 4 กรัมเป็นน้ำปรุง\n3. สับถั่วลิสงคั่วไม่ใส่เกลือครึ่งหนึ่งจากทั้งหมด 30 กรัมให้หยาบ ใส่แตงกวา มะเขือเทศ และถั่วแขกต้มสุกในชาม คลุกกับน้ำปรุงทั้งหมด\n4. ใส่ถั่วลิสงสับแล้วโรยถั่วลิสงคั่วทั้งเมล็ดที่เหลือ แบ่งสลัดพร้อมน้ำปรุงทั้งหมดเป็น 4 ที่ ใส่เกลือจากรายการเท่านั้นหากต้องการ"]]},
  // #327: unsweetened rutabaga casserole; keep cooking liquid and butter
  // allocation explicit; source-linked nutrition/GK evidence remains sealed.
  "lanttulaatikko-kermainen/fi": {"method":[["1. Punnitse luetellut syötävät raaka-aineet grammoina; älä lisää luetteloimatonta rasvaa tai lisukkeita.\n2. Tämä on alkuperäisen valinnaisen siirapin pois jättävä makeuttamaton versio. Punnitse 800 g kuorittua lanttua ja kypsennä peitettynä 100 g vedessä pehmeäksi; säilytä kaikki neste soseessa. Lisää tarvittaessa vettä vain haihtuneen korvaamiseksi, älä valuta lanttua.\n3. Soseuta. Käytä osa 50 g voista vuokaan ja pinnalle, loput seokseen. Lisää kerma, muna, muskotti ja mustapippuri. Kokonaisvoimäärä on 50 g; ylimääräistä rasvaa ei lisätä.\n4. Paista 175 °C:ssa noin 60 min kauttaaltaan kypsäksi. Anna vetäytyä 10 min ja jaa koko vuoka neljään annokseen.\n5. Kypsennä kaikki raakaa eläinperäistä ainesta sisältävät osat kypsiksi. Syö kaikki tämän punnitun version ainekset ja kastike/pannuneste. Raakojen ainesten ravintokoostumusta käytetään kypsän ruoan koostumusarvion pohjana; mittaamatonta hävikkiä ei vähennetä.","1. Kuutioi 800 g kuorittua lanttua. Lisää kattilaan 100 g vettä ja lanttukuutiot. Hauduta kannen alla pehmeiksi. Lisää vettä vain haihtuneen määrän korvaamiseksi, älä valuta haudutusnestettä pois.\n2. Soseuta kypsä lanttu kaikkine haudutusnesteineen. Sekoita joukkoon 150 g kuohukermaa, aineslistan kananmuna, 1 g muskottipähkinää ja 0,5 g mustapippuria. Lisää vain ainesluettelon suolaa tarvittaessa.\n3. Kuumenna uuni 175 °C:seen. Käytä ainesluettelon yhteensä 50 g voita vuoan voiteluun, soseeseen ja pinnalle; varaa pieni osa voista pintaa varten. Älä lisää muuta rasvaa.\n4. Levitä seos voideltuun uunivuokaan, levitä varattu voi pinnalle ja paista noin 60 minuuttia, kunnes munaa sisältävä laatikko on kauttaaltaan kypsä ja keskeltä hyytynyt.\n5. Anna laatikon vetäytyä 10 minuuttia. Jaa koko vuoka neljään annokseen. Tämä makeuttamaton versio ei sisällä siirappia."]],"nutritionBasis":"Ravintoarvio perustuu raakojen ainesosien koostumustietoihin; mittaamatonta kypsennyshävikkiä ei ole vähennetty. Kaikki ainesluettelon 100 g haudutusvettä jää soseeseen, ja 50 g voita sisältää vuoan voiteluun sekä pinnalle käytetyn voin."},
  "lanttulaatikko-kermainen/en": {"method":[["1. Weigh the listed edible ingredients in grams. Do not add any unlisted fat or accompaniments.\n2. This unsweetened version omits the optional syrup of the original recipe. Weigh 800 g peeled swede and cook it covered in 100 g water until tender; retain all the liquid in the mash. If necessary, add only enough water to replace what has evaporated. Do not drain the swede.\n3. Mash the swede. Use part of the total 50 g butter to grease the baking dish and coat the surface, and add the remainder to the mixture. Add the cream, egg, nutmeg and black pepper. The total butter allowance is 50 g; do not add any extra fat.\n4. Bake at 175 °C for approximately 60 minutes until cooked through. Let stand for 10 minutes, then divide the entire casserole into four servings.\n5. Cook all components containing raw animal-derived ingredients fully. Consume all the weighed ingredients and any sauce or pan liquid. The raw ingredient nutrient composition is used as the basis for estimating the cooked dish; no unmeasured cooking loss is deducted.","1. Cut 800 g peeled swede (rutabaga) into cubes. Put it in a saucepan with 100 g water, cover and cook until tender. Replace only water lost to evaporation if needed; do not drain the cooking liquid.\n2. Mash the cooked swede together with all its cooking liquid. Mix in 150 g whipping cream, the egg from the ingredient list, 1 g ground nutmeg and 0.5 g ground black pepper. Add only the listed salt if needed.\n3. Heat the oven to 175 °C. Use the listed 50 g butter in total for greasing the baking dish, enriching the mash and topping the surface. Reserve a little for the top; do not add extra fat.\n4. Spread the mixture in the greased dish, dot with the reserved butter and bake for about 60 minutes, until the egg-containing casserole is cooked through and set in the centre.\n5. Let the casserole rest for 10 minutes, then divide the whole dish into four portions. This unsweetened version contains no syrup."]],"nutritionBasis":"The nutrition estimate uses the raw ingredients' composition as a proxy for the cooked dish; unmeasured cooking losses are not deducted. All 100 g of the listed cooking water remain in the mash. The total 50 g butter includes the portion used to grease the dish and top the casserole."},
  "lanttulaatikko-kermainen/sv": {"method":[["1. Väg de angivna ätbara ingredienserna i gram. Tillsätt inte annat fett eller andra tillbehör än de som står i ingredienslistan.\n2. Detta är en osötad version utan originalreceptets valfria sirap. Väg upp 800 g skalad kålrot och koka den mjuk under lock i 100 g vatten. Behåll all vätska i moset. Tillsätt vid behov endast så mycket vatten som behövs för att ersätta avdunstad vätska. Häll inte bort kokspadet.\n3. Mosa kålroten. Använd en del av de totalt 50 g smör till formen och ytan och blanda resten i moset. Tillsätt grädde, ägg, muskotnöt och svartpeppar. Den totala smörmängden är 50 g; tillsätt inte mer fett.\n4. Grädda i 175 °C i cirka 60 minuter tills lådan är genomgräddad. Låt stå i 10 minuter och dela sedan hela formen i fyra portioner.\n5. Tillaga alla delar som innehåller råa animaliska ingredienser helt färdiga. Ät alla ingredienser i denna uppvägda version, inklusive sås och eventuell vätska. Näringsinnehållet i råvarorna används som grund för uppskattningen av den tillagade rätten; ingen omätt tillagningsförlust dras av.","1. Skär 800 g skalad kålrot i tärningar. Lägg i en kastrull med 100 g vatten, täck med lock och låt koka mjuk. Ersätt vid behov bara vatten som har avdunstat; häll inte bort kokspadet.\n2. Mosa den mjuka kålroten tillsammans med allt kokspad. Blanda i 150 g vispgrädde, ägget från ingredienslistan, 1 g malen muskotnöt och 0,5 g malen svartpeppar. Tillsätt endast det angivna saltet vid behov.\n3. Värm ugnen till 175 °C. Använd totalt 50 g smör från ingredienslistan till att smörja formen, blanda i moset och toppa ytan. Spara lite till ytan; tillsätt inget extra fett.\n4. Bred ut moset i den smorda formen, fördela det sparade smöret ovanpå och grädda i cirka 60 minuter tills äggstanningen är helt tillagad och lådan har stelnat i mitten.\n5. Låt lådan vila i 10 minuter och dela sedan hela formen i fyra portioner. Den här osötade versionen innehåller ingen sirap."]],"nutritionBasis":"Näringsvärdena uppskattas utifrån råvarornas sammansättning; omätta tillagningsförluster har inte dragits av. Alla 100 g kokvatten i ingredienslistan stannar i moset. De totalt 50 g smör inkluderar smör till formen och ytan."},
  "lanttulaatikko-kermainen/th": {"method":[["1. ชั่งวัตถุดิบส่วนที่รับประทานได้ทั้งหมดเป็นกรัม อย่าเติมไขมันหรือเครื่องเคียงที่ไม่ได้ระบุในรายการ\n2. สูตรนี้เป็นแบบไม่เติมความหวาน จึงไม่ใส่น้ำเชื่อมที่เป็นตัวเลือกของสูตรเดิม ชั่งรูตาบากาปอกเปลือก 800 g ใส่หม้อพร้อมน้ำ 100 g ปิดฝาแล้วเคี่ยวจนนุ่ม เก็บน้ำทั้งหมดไว้ในส่วนผสมบด หากน้ำระเหยให้เติมเพียงเพื่อชดเชยส่วนที่หายไป อย่าเทน้ำต้มทิ้ง\n3. บดรูตาบากา ใช้เนยบางส่วนจากทั้งหมด 50 g ทาถาดและทาหน้าอาหาร ใส่เนยที่เหลือลงในส่วนผสม เติมครีม ไข่ ลูกจันทน์เทศ และพริกไทยดำ เนยทั้งหมดต้องไม่เกิน 50 g และอย่าเติมไขมันอื่น\n4. อบที่ 175 °C ประมาณ 60 นาทีจนสุกทั่วถึง พักไว้ 10 นาที แล้วแบ่งอาหารทั้งถาดเป็น 4 ที่\n5. ปรุงส่วนผสมที่มาจากสัตว์และยังดิบให้สุกทั่วถึง รับประทานวัตถุดิบที่ชั่งไว้ทั้งหมด รวมทั้งซอสและน้ำจากภาชนะอบ ค่าทางโภชนาการใช้ข้อมูลส่วนผสมดิบเป็นพื้นฐานในการประเมินอาหารที่สุกแล้ว โดยไม่ได้หักการสูญเสียจากการปรุงที่ไม่มีการตรวจวัด","1. หั่นรูตาบากาปอกเปลือก 800 กรัมเป็นชิ้นเต๋า ใส่หม้อพร้อมน้ำ 100 กรัม ปิดฝาแล้วเคี่ยวจนผักนุ่ม หากน้ำระเหยให้เติมชดเชยเฉพาะส่วนที่หายไป อย่าเทน้ำต้มทิ้ง\n2. บดรูตาบากาสุกพร้อมน้ำต้มทั้งหมด เติมวิปปิ้งครีม 150 กรัม ไข่ตามรายการส่วนผสม ลูกจันทน์เทศป่น 1 กรัม และพริกไทยดำป่น 0.5 กรัม เติมเกลือจากรายการเท่านั้นตามต้องการ\n3. เปิดเตาอบที่ 175 °C ใช้เนยทั้งหมด 50 กรัมจากรายการสำหรับทาภาชนะอบ ผสมในเนื้อบด และทาหน้า แบ่งเนยเล็กน้อยไว้ทาหน้าโดยไม่เติมไขมันอื่น\n4. เทส่วนผสมลงในภาชนะอบที่ทาเนยแล้ว กระจายเนยที่แบ่งไว้บนหน้า อบประมาณ 60 นาทีจนส่วนผสมที่มีไข่สุกทั่วถึงและตรงกลางอยู่ตัว\n5. พักอาหารอบ 10 นาที แล้วแบ่งทั้งหมดเป็น 4 ที่ สูตรไม่หวานนี้ไม่ใส่น้ำเชื่อม"]],"nutritionBasis":"ค่าทางโภชนาการประเมินจากองค์ประกอบของวัตถุดิบดิบ โดยไม่หักการสูญเสียระหว่างปรุงที่ไม่ได้วัด น้ำต้ม 100 กรัมตามรายการต้องคงอยู่ในส่วนผสมบดทั้งหมด เนยรวม 50 กรัมรวมส่วนที่ใช้ทาภาชนะอบและหน้าขนมแล้ว"},
  // #327: recipe-specific pan-cooked moo ping steps and a fully cooked
  // raw-pork marinade. FI/EN/SV/TH source and nutrition/GK evidence stay sealed.
  "moo-ping-vhh/fi": {"method":[["1. Punnitse luetellut syötävät raaka-aineet grammoina; älä lisää luetteloimatonta rasvaa tai lisukkeita.\n2. Sekoita kookosmaito, kalakastike, soijakastike, valkosipuli, korianterinvarret, mustapippuri ja erytritoli. Marinoi porsas 30 min. Mustapippuri on tämän version nimenomainen valinta.\n3. Paista öljyssä pannulla; lisää koko marinadi pannulle ja kypsennä liha sekä raakaan lihaan koskenut marinadi kauttaaltaan. Tässä pannuversiossa mitään marinadia ei valuteta pois eikä grillihävikkiä arvioida.\n4. Tarjoa 200 g kurkkua ja 60 g kuorittua limetin hedelmälihaa/mehua; käytä kaikki luetellut syötävät osat. Jaa neljään annokseen.\n5. Kypsennä kaikki raakaa eläinperäistä ainesta sisältävät osat kypsiksi. Syö kaikki tämän punnitun version ainekset ja kastike/pannuneste. Raakojen ainesten ravintokoostumusta käytetään kypsän ruoan koostumusarvion pohjana; mittaamatonta hävikkiä ei vähennetä.","1. Hienonna 7 g valkosipulia ja 6 g korianterinvarsia. Sekoita joukkoon 100 g kookosmaitoa, 30 g kalakastiketta, 15 g soijakastiketta, 2 g mustapippuria ja 4 g Foodin-erytritolia marinadiksi.\n2. Leikkaa 700 g raakaa porsaan niskaa pannulla kypsyviksi paloiksi. Kääntele liha marinadissa, peitä ja marinoi jääkaapissa 30 minuuttia.\n3. Kuumenna 13,5 g rypsiöljyä paistinpannulla. Nosta liha pannulle ja ruskista paloja eri puolilta. Säilytä kaikki raakaan lihaan koskenut marinadi kypsennettäväksi.\n4. Kaada jäljellä oleva marinadi pannulle. Jatka kypsentämistä, kunnes porsaan sisälämpö on vähintään 70 °C ja myös raakaan lihaan koskenut marinadi on kiehunut kunnolla. Älä valuta kastiketta pois.\n5. Viipaloi 200 g kurkkua ja tarjoa 60 g kuorittua limetin hedelmälihaa mehuineen. Jaa liha, koko kypsennetty marinadikastike sekä lisukkeet neljään annokseen; lisää vain luettelon suolaa tarvittaessa."]],"nutritionBasis":"Ravintoarvio perustuu raakojen ainesten koostumustietoihin; mittaamattomia kypsennyshävikkejä ei ole vähennetty. Koko marinadi kypsennetään ja sisältyy neljän annoksen arvioon. Tämä on pannuversio, ei grillissä valutettu versio."},
  "moo-ping-vhh/en": {"method":[["1. Weigh all listed edible ingredients. Do not add unlisted oil or side dishes.\n2. Mix coconut milk, fish sauce, soy sauce, garlic, coriander stems, black pepper and erythritol. Marinate the pork for 30 min. This version explicitly uses black pepper.\n3. Pan-cook in the rapeseed oil. Add all marinade and cook both meat and marinade that touched raw meat thoroughly. Do not drain any marinade or estimate grill losses.\n4. Serve with 200 g cucumber and 60 g peeled lime flesh and juice. Consume every listed edible part and divide into four portions.\n5. Cook every part that contains raw animal ingredients thoroughly. Consume all ingredients and pan juices. Raw ingredient composition is a nutrient-retention proxy; unmeasured losses are not deducted.","1. Finely chop 7 g garlic and 6 g coriander stems. Mix with 100 g coconut milk, 30 g fish sauce, 15 g soy sauce, 2 g ground black pepper and 4 g Foodin erythritol to make the marinade.\n2. Cut 700 g raw pork neck into pieces suitable for pan-cooking. Coat in the marinade, cover and marinate in the refrigerator for 30 minutes.\n3. Heat the listed 13.5 g rapeseed oil in a frying pan. Add the pork and brown it on several sides. Keep all marinade that touched the raw pork for thorough cooking.\n4. Pour all remaining marinade into the pan. Continue cooking until the pork reaches at least 70 °C internally and the marinade that touched raw meat has been brought to a full boil. Do not discard the sauce.\n5. Slice 200 g cucumber and serve with 60 g peeled lime flesh and all its juice. Divide the pork, all cooked marinade sauce and accompaniments into four portions; add only the listed salt if needed."]],"nutritionBasis":"The nutrition estimate uses the raw ingredients' composition as a proxy for the finished dish; unmeasured cooking losses are not deducted. All marinade that touched raw pork is cooked and included in the four-serving estimate. This is the pan-cooked version, not a drained grilled version."},
  "moo-ping-vhh/sv": {"method":[["1. Väg alla angivna ätliga ingredienser. Tillsätt inte olistad olja eller tillbehör.\n2. Blanda kokosmjölk, fisksås, sojasås, vitlök, korianderstjälkar, svartpeppar och erytritol. Marinera fläskköttet i 30 min. Denna version använder uttryckligen svartpeppar.\n3. Stek i rapsoljan i panna. Tillsätt hela marinaden och tillaga både köttet och marinaden som varit i kontakt med rått kött ordentligt. Häll inte bort marinad och uppskatta inte grillförluster.\n4. Servera med 200 g gurka och 60 g skalat limefruktkött med saft. Ät alla angivna ätliga delar och fördela i fyra portioner.\n5. Tillaga alla delar som innehåller råa animaliska ingredienser ordentligt. Ät alla ingredienser och all steksky. Råvarornas sammansättning används som näringsproxy; omätta förluster dras inte av.","1. Finhacka 7 g vitlök och 6 g korianderstjälkar. Blanda med 100 g kokosmjölk, 30 g fisksås, 15 g sojasås, 2 g malen svartpeppar och 4 g Foodin-erytritol till en marinad.\n2. Skär 700 g rå fläskkarré i bitar som går att steka i panna. Vänd köttet i marinaden, täck över och marinera i kylskåp i 30 minuter.\n3. Hetta upp de angivna 13,5 g rapsolja i en stekpanna. Lägg i köttet och bryn det på flera sidor. Spara all marinad som varit i kontakt med rått fläskkött för ordentlig tillagning.\n4. Häll hela den återstående marinaden i pannan. Fortsätt tillaga tills fläskköttet når minst 70 °C i innertemperatur och marinaden som varit i kontakt med rått kött har kokat upp ordentligt. Häll inte bort såsen.\n5. Skiva 200 g gurka och servera med 60 g skalat limefruktkött och all saft. Fördela köttet, all tillagad marinadsås och tillbehören på fyra portioner; tillsätt endast det angivna saltet vid behov."]],"nutritionBasis":"Näringsvärdena bygger på råvarornas sammansättning; omätta tillagningsförluster har inte dragits av. All marinad som varit i kontakt med rått fläskkött tillagas och ingår i uppskattningen för fyra portioner. Detta är pannversionen, inte en grillversion där marinaden rinner av."},
  "moo-ping-vhh/th": {"method":[["1. ชั่งวัตถุดิบส่วนที่กินได้ทั้งหมดตามรายการ ไม่เติมน้ำมันหรือเครื่องเคียงนอกสูตร\n2. ผสมกะทิ น้ำปลา ซีอิ๊ว กระเทียม ก้านผักชี พริกไทยดำ และอิริทริทอล หมักหมู 30 นาที สูตรนี้ใช้พริกไทยดำโดยเฉพาะ\n3. ทอดในกระทะด้วยน้ำมันเรพซีด ใส่น้ำหมักทั้งหมดแล้วปรุงทั้งเนื้อและน้ำหมักที่สัมผัสหมูดิบให้สุกทั่วถึง ไม่เทน้ำหมักทิ้งและไม่ประมาณการสูญเสียจากการย่าง\n4. เสิร์ฟกับแตงกวา 200 g และเนื้อมะนาวปอกเปลือกพร้อมน้ำมะนาว 60 g กินส่วนที่กินได้ตามรายการทั้งหมดแล้วแบ่งเป็น 4 ที่\n5. ปรุงส่วนที่มีวัตถุดิบจากสัตว์ดิบให้สุกทั่วถึง กินวัตถุดิบและน้ำในกระทะทั้งหมด ใช้ค่าประกอบของวัตถุดิบดิบเป็นตัวแทนสารอาหารโดยไม่หักการสูญเสียที่ไม่ได้วัด","1. สับกระเทียม 7 กรัมและก้านผักชี 6 กรัมให้ละเอียด ผสมกับกะทิ 100 กรัม น้ำปลา 30 กรัม ซีอิ๊ว 15 กรัม พริกไทยดำป่น 2 กรัม และอิริทริทอล Foodin 4 กรัมเป็นน้ำหมัก\n2. หั่นเนื้อสันคอหมูดิบ 700 กรัมเป็นชิ้นขนาดเหมาะสำหรับทอดในกระทะ คลุกกับน้ำหมัก ปิดฝาแล้วหมักในตู้เย็น 30 นาที\n3. อุ่นน้ำมันเรพซีดตามรายการ 13.5 กรัมในกระทะ ใส่หมูลงทอดให้ผิวเหลืองหลายด้าน เก็บน้ำหมักทั้งหมดที่สัมผัสหมูดิบไว้สำหรับปรุงให้สุก\n4. เทน้ำหมักที่เหลือทั้งหมดลงในกระทะ ปรุงต่อจนเนื้อหมูมีอุณหภูมิภายในอย่างน้อย 70 °C และน้ำหมักที่สัมผัสเนื้อดิบเดือดอย่างทั่วถึง ห้ามเทซอสทิ้ง\n5. หั่นแตงกวา 200 กรัม เสิร์ฟกับเนื้อมะนาวปอกเปลือก 60 กรัมพร้อมน้ำทั้งหมด แบ่งหมู ซอสน้ำหมักที่ปรุงสุกทั้งหมด และเครื่องเคียงเป็น 4 ที่ เติมเกลือจากรายการเท่านั้นถ้าต้องการ"]],"nutritionBasis":"การประเมินโภชนาการใช้ข้อมูลองค์ประกอบของวัตถุดิบดิบเป็นตัวแทนอาหารปรุงสุก โดยไม่หักการสูญเสียระหว่างปรุงที่ไม่ได้วัด น้ำหมักทั้งหมดที่สัมผัสหมูดิบต้องปรุงให้สุกและรวมอยู่ในค่าประมาณสำหรับ 4 ที่ สูตรนี้ปรุงในกระทะ ไม่ใช่สูตรย่างที่ปล่อยน้ำหมักไหลทิ้ง"},
  // #327: improve published four-language harissa shakshuka method without
  // modifying source-bound nutrition/GK records; GK80 already fixes FI egg.
  "pohjoisafrikkalainen-harissa-shakshuka/fi": {"method":[["1. Punnitse luetellut syötävät raaka-aineet grammoina; älä lisää luetteloimatonta rasvaa tai lisukkeita.\n2. Valmista 5 g nimettyä tuoreharissaa hienontamalla chili 2,5 g, valkosipuli 0,8 g, öljy 1 g, juustokumina 0,3 g, korianteri 0,2 g, sitruunamehu 0,2 g. Käytä koko tahna.\n3. Kuullota paprika ja tomaatti 13,5 g öljyssä. Lisää tuoreharissa ja hauduta pehmeäksi.\n4. Lisää 110 g kuoretonta kananmunaa, peitä ja kypsennä kauttaaltaan. Jaa kaikki kasvikset, kastike ja munat kahteen annokseen.\n5. Kypsennä kaikki raakaa eläinperäistä ainesta sisältävät osat kypsiksi. Syö kaikki tämän punnitun version ainekset ja kastike/pannuneste. Raakojen ainesten ravintokoostumusta käytetään kypsän ruoan koostumusarvion pohjana; mittaamatonta hävikkiä ei vähennetä.","1. Punnitse kotiharissaa varten 2,5 g tuoretta chiliä, 0,8 g valkosipulia, 1 g oliiviöljyä, 0,3 g juustokuminaa, 0,2 g korianteria ja 0,2 g sitruunamehua.\n2. Hienonna chili ja valkosipuli, sekoita muut mitatut harissa-ainekset joukkoon ja käytä koko 5 g tahna.\n3. Kuullota 150 g punaista paprikaa ja 125 g tomaattia 13,5 g oliiviöljyssä. Lisää koko kotiharissa ja hauduta kasvikset pehmeiksi.\n4. Lisää kastikkeeseen aineslistan kananmunat, peitä ja kypsennä munat kauttaaltaan.\n5. Jaa munat, kasvikset, kastike ja pannulle jäänyt öljy kahteen annokseen. Lisää halutessasi vain luettelon suolaa."]],"nutritionBasis":"Ravintoarvion pohjana ovat raakojen ainesten koostumustiedot. Mittaamattomia kypsennyshävikkejä ei ole vähennetty. Koko kastike ja paistoöljy sisältyvät kahden annoksen arvioon."},
  "pohjoisafrikkalainen-harissa-shakshuka/en": {"method":[["1. Weigh all listed edible ingredients in grams. Do not add any unlisted fat or side dishes.\n2. Make exactly 5 g of fresh harissa from 2.5 g chilli, 0.8 g garlic, 1 g olive oil, 0.3 g ground cumin, 0.2 g ground coriander and 0.2 g lemon juice. Use all of the paste.\n3. Soften the red pepper and tomato in 13.5 g olive oil. Add the fresh harissa and simmer until tender.\n4. Add 110 g egg weighed without its shell, cover and cook thoroughly. Divide all vegetables, sauce and eggs between two servings.\n5. Cook all ingredients containing raw animal products thoroughly. Consume all ingredients and pan juices. The raw ingredients' nutrient composition is used as a proxy for the finished dish; unmeasured cooking losses are not deducted.","1. Weigh 2.5 g fresh chilli, 0.8 g garlic, 1 g olive oil, 0.3 g ground cumin, 0.2 g ground coriander and 0.2 g lemon juice for the homemade harissa.\n2. Finely chop the chilli and garlic, mix in the other measured harissa ingredients and use all 5 g of the paste.\n3. Cook 150 g red bell pepper and 125 g tomato in 13.5 g olive oil until softened. Add all the harissa and simmer until tender.\n4. Add the listed eggs to the sauce, cover and cook until thoroughly set.\n5. Divide the eggs, vegetables, sauce and remaining oil between two servings. Add only the listed salt, if desired."]],"nutritionBasis":"The nutrition estimate uses the raw ingredients' composition as a proxy for the cooked dish. Unmeasured cooking losses are not deducted. All of the sauce and cooking oil are included in the two-serving estimate."},
  "pohjoisafrikkalainen-harissa-shakshuka/sv": {"method":[["1. Väg alla angivna ätbara ingredienser i gram. Tillsätt inget extra fett eller några tillbehör som inte står i listan.\n2. Gör exakt 5 g färsk harissa av 2,5 g chili, 0,8 g vitlök, 1 g olivolja, 0,3 g malen spiskummin, 0,2 g malen koriander och 0,2 g citronsaft. Använd all pasta.\n3. Fräs paprikan och tomaten i 13,5 g olivolja. Tillsätt den färska harissan och sjud tills grönsakerna är mjuka.\n4. Tillsätt 110 g ägg vägt utan skal, täck över och tillaga ordentligt. Fördela grönsakerna, såsen och äggen på två portioner.\n5. Tillaga alla råa animaliska ingredienser helt genom. Ät alla angivna ingredienser och all steksky. Råvarornas näringssammansättning används som proxy för den färdiga rätten; omätta tillagningsförluster dras inte av.","1. Väg upp 2,5 g färsk chili, 0,8 g vitlök, 1 g olivolja, 0,3 g malen spiskummin, 0,2 g malen koriander och 0,2 g citronsaft till den hemgjorda harissan.\n2. Finhacka chili och vitlök, blanda i de övriga uppvägda ingredienserna och använd alla 5 g harissa.\n3. Fräs 150 g röd paprika och 125 g tomat i 13,5 g olivolja. Tillsätt all harissa och sjud tills grönsakerna är mjuka.\n4. Tillsätt äggen enligt ingredienslistan i såsen, lägg på lock och tillaga tills de är helt genomlagade.\n5. Fördela äggen, grönsakerna, såsen och all kvarvarande olja på två portioner. Tillsätt endast det angivna saltet efter smak."]],"nutritionBasis":"Näringsvärdena uppskattas utifrån råvarornas sammansättning. Omätta tillagningsförluster har inte dragits av. All sås och stekolja ingår i beräkningen för två portioner."},
  "pohjoisafrikkalainen-harissa-shakshuka/th": {"method":[["1. ชั่งส่วนผสมที่รับประทานได้ทั้งหมดเป็นกรัม ห้ามเติมไขมันหรือเครื่องเคียงที่ไม่อยู่ในรายการ\n2. ทำฮาริสซาสด 5 กรัมจากพริกสด 2.5 กรัม กระเทียม 0.8 กรัม น้ำมันมะกอก 1 กรัม ผงยี่หร่าเทศ 0.3 กรัม ผงลูกผักชี 0.2 กรัม และน้ำมะนาวเลมอน 0.2 กรัม ใช้ส่วนผสมฮาริสซาทั้งหมด\n3. ผัดพริกหวานสีแดงและมะเขือเทศด้วยน้ำมันมะกอก 13.5 กรัมจนเริ่มนุ่ม ใส่ฮาริสซาสดแล้วเคี่ยวจนผักนุ่ม\n4. ใส่ไข่ไก่ที่ชั่งโดยไม่รวมเปลือก 110 กรัม ปิดฝาและปรุงให้สุกทั่วถึง แบ่งผัก ซอส และไข่ทั้งหมดเป็น 2 ที่\n5. ปรุงวัตถุดิบดิบจากสัตว์ทั้งหมดให้สุกทั่วถึง รับประทานส่วนผสมและน้ำในกระทะทั้งหมด การคำนวณสารอาหารใช้ข้อมูลองค์ประกอบของวัตถุดิบดิบเป็นค่าเทียบเคียงของอาหารปรุงสุก โดยไม่หักการสูญเสียที่ไม่ได้วัดจริง","1. ชั่งพริกสด 2.5 กรัม กระเทียม 0.8 กรัม น้ำมันมะกอก 1 กรัม ผงยี่หร่าเทศ 0.3 กรัม ผงลูกผักชี 0.2 กรัม และน้ำมะนาวเลมอน 0.2 กรัม สำหรับทำฮาริสสา\n2. สับพริกและกระเทียมให้ละเอียด ผสมกับส่วนผสมฮาริสสาอื่นที่ชั่งไว้ ใช้ฮาริสสาทั้งหมด 5 กรัม\n3. ผัดพริกหวานสีแดง 150 กรัมและมะเขือเทศ 125 กรัมในน้ำมันมะกอก 13.5 กรัม ใส่ฮาริสสาทั้งหมดแล้วเคี่ยวจนผักนุ่ม\n4. ใส่ไข่ตามรายการลงในซอส ปิดฝาและปรุงจนไข่สุกทั่วถึง\n5. แบ่งไข่ ผัก ซอส และน้ำมันที่เหลือทั้งหมดเป็น 2 ที่ เติมเกลือจากรายการเท่านั้นตามชอบ"]],"nutritionBasis":"ค่าทางโภชนาการคำนวณโดยใช้ข้อมูลส่วนประกอบของวัตถุดิบดิบเป็นตัวแทนอาหารที่ปรุงสุก โดยไม่ได้หักการสูญเสียระหว่างปรุงที่ยังไม่มีผลวัด ซอสและน้ำมันทั้งหมดรวมอยู่ในค่าประมาณสำหรับ 2 ที่"},
  // #327 quality20 P2: image serving scope and the Thai-vs-holy basil adaptation.
  // Verified against the sealed four-language sources and original WebP assets.
  "keto-pannukakku/fi": {"notes":[["Hiilihydraattimäärä riippuu käytetyistä tuotteista ja annoskoosta. Laske se valitsemiesi tuotteiden pakkaustiedoista ja huomioi myös lisäkkeet ja täytteet.","Hiilihydraattimäärä riippuu käytetyistä tuotteista ja annoskoosta. Laske se valitsemiesi tuotteiden pakkaustiedoista ja huomioi myös lisäkkeet ja täytteet.\n- Kuvassa olevat mustikat, vadelmat ja pannukakun päälle lisätty kermavaahto ovat valinnaisia tarjoilulisukkeita. Neljän annoksen perusohjeen aineslista ja ilmoitetut annosravintoarvot koskevat pannukakkua ilman näitä lisukkeita. Taikinaan käytetty kerma sisältyy jo laskelmaan; erillinen kermavaahto ja marjat on laskettava lisäksi."]]},
  "keto-pannukakku/en": {"notes":[["The carbohydrate content depends on the products used and the portion size. Calculate it from the labels of your chosen products, including any accompaniments and toppings.","The carbohydrate content depends on the products used and the portion size. Calculate it from the labels of your chosen products, including any accompaniments and toppings.\n- The pictured blueberries, raspberries and whipped cream added on top are optional serving extras. The original four-serving ingredient list and nutrition figures describe the pancake without these extras. Cream mixed into the batter is already counted; calculate the separate whipped cream and berries in addition."]]},
  "keto-pannukakku/sv": {"notes":[["Kolhydratmängden beror på vilka produkter du använder och portionsstorleken. Beräkna den utifrån förpackningarnas näringsvärden och räkna även med tillbehör och fyllningar.","Kolhydratmängden beror på vilka produkter du använder och portionsstorleken. Beräkna den utifrån förpackningarnas näringsvärden och räkna även med tillbehör och fyllningar.\n- Blåbären, hallonen och vispgrädden ovanpå pannkakan på bilden är valfria serveringstillbehör. Ingredienslistan och näringsvärdena för grundreceptets fyra portioner gäller pannkakan utan dessa tillbehör. Grädden i smeten ingår redan i beräkningen; räkna till extra vispgrädde och bär separat."]]},
  "keto-pannukakku/th": {"notes":[["ปริมาณคาร์โบไฮเดรตขึ้นอยู่กับผลิตภัณฑ์ที่ใช้และขนาดเสิร์ฟ คำนวณจากข้อมูลโภชนาการบนบรรจุภัณฑ์ของผลิตภัณฑ์ที่เลือก โดยรวมเครื่องเคียง ไส้ และหน้าที่เพิ่มด้วย","ปริมาณคาร์โบไฮเดรตขึ้นอยู่กับผลิตภัณฑ์ที่ใช้และขนาดเสิร์ฟ คำนวณจากข้อมูลโภชนาการบนบรรจุภัณฑ์ของผลิตภัณฑ์ที่เลือก โดยรวมเครื่องเคียง ไส้ และหน้าที่เพิ่มด้วย\n- บลูเบอร์รี ราสป์เบอร์รี และวิปครีมที่แต่งบนแพนเค้กในภาพเป็นเครื่องเคียงตามชอบ รายการส่วนผสมและค่าทางโภชนาการของสูตรพื้นฐาน 4 ที่คำนวณเฉพาะแพนเค้ก ไม่รวมเครื่องเคียงเหล่านี้ ครีมที่ผสมในแป้งนับรวมแล้ว แต่ต้องคำนวณวิปครีมที่เติมต่างหากและผลเบอร์รีเพิ่มเติม"]]},
  "keto-pinaattiletut/fi": {"notes":[["Hiilihydraattimäärä riippuu käytetyistä tuotteista ja annoskoosta. Laske se valitsemiesi tuotteiden pakkaustiedoista ja huomioi myös lisäkkeet ja täytteet.","Hiilihydraattimäärä riippuu käytetyistä tuotteista ja annoskoosta. Laske se valitsemiesi tuotteiden pakkaustiedoista ja huomioi myös lisäkkeet ja täytteet.\n- Kuvassa on marjoja ja vaalea lisuke, mutta perusohje on suolainen pinaattilettu. Kuvan vaalean lisukkeen tarkkaa tuotetta ei ole tunnistettu. Marjat ja lisuke eivät sisälly kolmen annoksen aineslistaan eivätkä ilmoitettuihin annosravintoarvoihin. Letut voi tarjoilla sellaisinaan tai erikseen valitun suolaisen täytteen kanssa; laske kaikki lisukkeet erikseen."]]},
  "keto-pinaattiletut/en": {"notes":[["The carbohydrate content depends on the products used and the portion size. Calculate it from the labels of your chosen products, including any accompaniments and toppings.","The carbohydrate content depends on the products used and the portion size. Calculate it from the labels of your chosen products, including any accompaniments and toppings.\n- The picture shows berries and a pale topping, but the base recipe is for savoury spinach pancakes. The exact product used for the pale topping has not been identified. Neither topping belongs to the three-serving ingredient list or the stated nutrition per serving. Serve the pancakes plain or with a separately chosen savoury filling; account for all extras separately."]]},
  "keto-pinaattiletut/sv": {"notes":[["Kolhydratmängden beror på vilka produkter du använder och portionsstorleken. Beräkna den utifrån förpackningarnas näringsvärden och räkna även med tillbehör och fyllningar.","Kolhydratmängden beror på vilka produkter du använder och portionsstorleken. Beräkna den utifrån förpackningarnas näringsvärden och räkna även med tillbehör och fyllningar.\n- Bilden visar bär och ett ljust tillbehör, men grundreceptet är salta spenatplättar. Den exakta produkten i det ljusa tillbehöret har inte identifierats. Tillbehören ingår inte i ingredienslistan för tre portioner eller i de angivna näringsvärdena per portion. Servera plättarna som de är eller med valfri salt fyllning och räkna extra tillbehör separat."]]},
  "keto-pinaattiletut/th": {"notes":[["ปริมาณคาร์โบไฮเดรตขึ้นอยู่กับผลิตภัณฑ์ที่ใช้และขนาดเสิร์ฟ คำนวณจากข้อมูลโภชนาการบนบรรจุภัณฑ์ของผลิตภัณฑ์ที่เลือก โดยรวมเครื่องเคียง ไส้ และหน้าที่เพิ่มด้วย","ปริมาณคาร์โบไฮเดรตขึ้นอยู่กับผลิตภัณฑ์ที่ใช้และขนาดเสิร์ฟ คำนวณจากข้อมูลโภชนาการบนบรรจุภัณฑ์ของผลิตภัณฑ์ที่เลือก โดยรวมเครื่องเคียง ไส้ และหน้าที่เพิ่มด้วย\n- ในภาพมีผลเบอร์รีและเครื่องเคียงสีอ่อน แต่สูตรพื้นฐานเป็นแพนเค้กผักโขมรสเค็ม ไม่สามารถระบุชนิดของเครื่องเคียงสีอ่อนได้แน่ชัด ทั้งสองอย่างไม่อยู่ในรายการส่วนผสมสำหรับ 3 ที่ และไม่รวมในค่าทางโภชนาการต่อหนึ่งที่ เสิร์ฟแพนเค้กเปล่า ๆ หรือกับไส้คาวที่เลือกเอง และคำนวณเครื่องเคียงที่เพิ่มต่างหาก"]]},
  "pad-kra-pao-vhh/fi": {"description":"Tässä vähähiilihydraattisessa pad kra pao -sovituksessa käytetään ainesluettelon thaibasilikaa, joka on eri yrtti kuin perinteisessä pad kra paossa usein käytetty pyhä basilika. Kalakastike ja chili maustavat porsaan jauhelihan, ja kukkakaaliriisi korvaa tavallisen riisin."},
  "pad-kra-pao-vhh/en": {"description":"This low-carb pad kra pao adaptation uses the Thai basil listed in the ingredients, which differs from the holy basil commonly used in traditional versions. Fish sauce and chili season the ground pork, while cauliflower rice replaces regular rice."},
  "pad-kra-pao-vhh/sv": {"description":"I den här kolhydratreducerade varianten av pad kra pao används thaibasilikan i ingredienslistan, inte den heliga basilika som ofta används i traditionella versioner. Fisksås och chili smaksätter fläskfärsen, och blomkålsris ersätter vanligt ris."},
  "pad-kra-pao-vhh/th": {"description":"ผัดกะเพราสูตรคาร์โบไฮเดรตต่ำนี้ใช้ใบโหระพาไทยตามรายการส่วนผสม ไม่ใช่ใบกะเพราที่นิยมใช้ในสูตรดั้งเดิม น้ำปลาและพริกช่วยปรุงรสหมูบด และใช้ข้าวดอกกะหล่ำแทนข้าวสวย"},
  // #327 bibimbap: Food Authority (Ruokavirasto) recommends sprouts thoroughly
  // heated before eating. Keep sealed FI/EN/SV/TH source and GK evidence intact.
  // https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/kasittely-ja-sailyttaminen/hygienia-kotikeittiossa/kasvikset-ja-hedelmat/huomioitavaa-itujen-kasittelyssa-ja-valmistamisessa-kotikeittiossa/
  "bibimbap/fi": {
    method: [["Ryöppää pinaatti ja pavunidut nopeasti kiehuvassa vedessä, valuta ja mausta tilkalla seesamiöljyä.", "Ryöppää pinaatti nopeasti kiehuvassa vedessä. Kuumenna pavunidut erikseen kiehuvassa vedessä kunnolla kauttaaltaan; pelkkä nopea kastaminen ei riitä. Valuta molemmat ja mausta tilkalla seesamiöljyä."]],
  },
  "bibimbap/en": {
    method: [["Quickly blanch the spinach and bean sprouts in boiling water, drain and dress with a little sesame oil.", "Briefly blanch the spinach in boiling water. Cook the bean sprouts separately in boiling water until thoroughly heated through; a quick dip is not enough. Drain both and dress with a little sesame oil."]],
  },
  "bibimbap/sv": {
    method: [["Förväll spenat och böngroddar snabbt i kokande vatten, låt rinna av och smaksätt med lite sesamolja.", "Förväll spenaten snabbt i kokande vatten. Koka böngroddarna separat i kokande vatten tills de är ordentligt genomhetta; en snabb doppning räcker inte. Låt båda rinna av och smaksätt med lite sesamolja."]],
  },
  "bibimbap/th": {
    method: [["ลวกผักโขมกับถั่วงอกในน้ำเดือดสั้น ๆ สะเด็ดน้ำแล้วคลุกน้ำมันงาเล็กน้อย", "ลวกผักโขมในน้ำเดือดสั้น ๆ จากนั้นต้มถั่วงอกแยกในน้ำเดือดให้ร้อนทั่วถึงอย่างเพียงพอ ไม่ใช่แค่จุ่มน้ำเดือดอย่างรวดเร็ว สะเด็ดน้ำผักทั้งสองชนิดแล้วคลุกน้ำมันงาเล็กน้อย"]],
  },
  "ananas-kanelijuoma-sitruunalla/fi": {
    "notes": [
      ["Vesimäärä ja mieto kaneliannos ovat tämän version mitoituksia.", "Vesimäärä ja pieni kanelimäärä on valittu tätä versiota varten."],
      ["Kanelin pieni osuus on rajattu laskelmassa.", "Kanelin ravintoarvoja ei ole laskettu mukaan. Reseptissä on 0,35 g kanelia annosta kohti."]
    ]
  },
  "ananas-kanelijuoma-sitruunalla/en": {
    "description": "Blend fresh pineapple, lemon juice, cold water and a pinch of cinnamon for a refreshing drink. The blended pineapple pulp gives it body."
  },
  "ananas-kanelijuoma-sitruunalla/sv": {
    "description": "Mixa färsk ananas, citronsaft, kallt vatten och en nypa kanel till en frisk dryck. Fruktköttet får vara kvar och ger drycken fyllighet.",
    "method": [
      ["Skär och väg 330 g massa. Pressa citronsaft.", "Skär ananasen i bitar och väg upp 330 g fruktkött. Pressa citronen."],
      ["Puré tills drinken är så slät som möjligt.", "Mixa tills drycken är så slät som möjligt."],
      ["Dela i två glas och servera kallt. Rör eventuellt om i drinken innan servering, eftersom kanelen kan sjunka till botten.", "Fördela drycken i två glas och servera kall. Rör om före servering vid behov, eftersom kanelen kan sjunka till botten."]
    ]
  },
  "ananas-kanelijuoma-sitruunalla/th": {
    "method": [
      ["ล้างสับปะรดและมะนาวก่อนหั่น ปอกเปลือกและแข็งตรงกลางของสับปะรดออก ตัดและชั่งน้ำหนักเยื่อกระดาษ 330 กรัม บีบน้ำมะนาว.", "ล้างสับปะรดและมะนาวก่อนหั่น ปอกเปลือกสับปะรดและตัดแกนแข็งออก หั่นเนื้อสับปะรดแล้วชั่ง 330 กรัม จากนั้นคั้นมะนาว"],
      ["ล้างสับปะรดและมะนาวก่อนหั่น", "ล้างสับปะรดและเลมอนก่อนหั่น"],
      ["จากนั้นคั้นมะนาว", "จากนั้นคั้นน้ำเลมอน"],
      ["ตวงน้ำและน้ำมะนาวลงในเครื่องปั่น เพิ่มชิ้นสับปะรดและอบเชย บดจนเครื่องดื่มเนียนที่สุด", "ตวงน้ำกับน้ำเลมอนใส่เครื่องปั่น ใส่สับปะรดที่หั่นไว้และอบเชย แล้วปั่นให้เนียนที่สุด"]
    ],
    "description": "ปั่นสับปะรดสดกับน้ำเลมอน น้ำเย็น และอบเชยเล็กน้อยเป็นเครื่องดื่มรสสดชื่น เนื้อสับปะรดที่ปั่นรวมลงไปทำให้เครื่องดื่มมีเนื้อสัมผัส"
  },
  "avokado-banaanijaatelo/sv": {
    "method": [
      ["Puré tills den är slät.", "Mixa tills blandningen är slät."]
    ]
  },
  "avokado-banaanijaatelo/th": {
    "description": "ปั่นกล้วยแช่แข็งกับอะโวคาโดสุกให้เนียนเป็นไอศกรีม โยเกิร์ตรสธรรมชาติและน้ำเลมอนช่วยตัดความหวานของกล้วย",
    "method": [
      ["น้ำมะนาว", "น้ำเลมอน"]
    ],
    "ingredientNote": [
      ["ประมาณหนึ่งมะนาว", "ประมาณหนึ่งผล"]
    ]
  },
  "omenavaahtokarkit/en": {
    "ingredientNote": [
      ["peeled and without seed coat", "peeled and cored"]
    ]
  },
  "omenavaahtokarkit/sv": {
    "ingredientNote": [
      ["skalad och utan fröskal", "skalade och urkärnade"]
    ]
  },
  "omenavaahtokarkit/th": {
    "ingredientNote": [
      ["ปอกเปลือกและไม่มีเปลือกหุ้มเมล็ด", "ปอกเปลือกและเอาแกนกับเมล็ดออก"]
    ]
  },
  "bataatti-mustikkakakku/th": {
    "notes": [
      ["จนกระทั่งส้อมจิ้มเข้าไปในมอลต์ได้ง่าย", "จนใช้ส้อมจิ้มเนื้อมันเทศได้ง่าย"],
      ["ตักมอลต์ออกแล้วชั่งน้ำหนัก 440 กรัม", "ตักเนื้อมันเทศออกแล้วชั่ง 440 กรัม"]
    ]
  },
  "avokado-perunasampylat/en": {
    "description": "Potato, avocado and Greek yogurt make six small rolls. Brush the tops with egg yolk and sprinkle with sesame seeds before baking.",
    "method": [
      ["Preheat the oven to 190 °C with constant heat. Prepare six silicone muffin tins or line the holes of the muffin tray with baking paper.", "Preheat the oven to 190 °C using top and bottom heat. Set out six individual silicone muffin cups, or line six wells of a muffin tin with paper muffin liners."],
      ["Divide the dough into six pans, about 70 g each, and smooth the surfaces with a spoon. Break the texture of the yolk and spread a thin layer on the surface of the dough. Sprinkle sesame seeds on top.", "Divide the batter among the six cups, about 70 g in each, and smooth the tops with a spoon. Stir the yolk to loosen it, brush a thin layer over the tops and sprinkle with sesame seeds."],
      ["Bake on medium for about 25-35 minutes. Start checking for doneness at 25 minutes. The rolls are ready when the surface is golden brown, the center has set and the internal temperature is at least 71 °C.", "Bake on the middle rack for about 25–35 minutes. Start checking at 25 minutes. The rolls are ready when golden on top, set in the centre and at least 71 °C inside."]
    ]
  },
  "avokado-perunasampylat/sv": {
    "description": "Potatis, avokado och grekisk yoghurt blir sex små frallor. Pensla med äggula och strö över sesamfrön före gräddningen.",
    "method": [
      ["Värm ugnen till 190 °C med konstant värme. Förbered sex muffinsformar i silikon eller klä hålen i muffinsplåten med bakplåtspapper.", "Värm ugnen till 190 °C med över- och undervärme. Ställ fram sex separata muffinsformar i silikon eller sätt pappersformar i sex hål i en muffinsplåt."],
      ["Dela degen i sex formar, ca 70 g vardera, och jämna till ytorna med en sked. Bryt äggulans struktur och bred ut ett tunt lager på degens yta. Strö sesamfrön ovanpå.", "Fördela smeten i de sex formarna, cirka 70 g i varje. Jämna till ytan med en sked. Rör ihop äggulan, pensla på ett tunt lager och strö över sesamfrön."],
      ["Grädda på medium i ca 25-35 minuter. Börja kontrollera om den är färdig efter 25 minuter. Rullarna är klara när ytan är gyllenbrun, mitten stelnat och innertemperaturen är minst 71 °C.", "Grädda mitt i ugnen i cirka 25–35 minuter. Kontrollera frallorna första gången efter 25 minuter. De är klara när de är gyllenbruna, mitten har stelnat och innertemperaturen är minst 71 °C."]
    ]
  },
  "avokado-perunasampylat/th": {
    "title": "ขนมปังก้อนมันฝรั่งกับอะโวคาโด",
    "description": "มันฝรั่ง อะโวคาโด และกรีกโยเกิร์ตทำเป็นขนมปังก้อนเล็กได้หกชิ้น ทาไข่แดงและโรยงาก่อนอบ",
    "method": [
      ["เปิดเตาอบที่ 190 °C ด้วยไฟบน–ล่าง เตรียมพิมพ์มัฟฟินซิลิโคน 6 อัน หรือรองถาดมัฟฟินด้วยกระดาษรองอบ", "เปิดเตาอบที่ 190 °C ใช้ไฟบน–ล่าง เตรียมพิมพ์มัฟฟินซิลิโคนแยกหกใบ หรือใส่ถ้วยกระดาษรองอบในถาดมัฟฟินให้ครบหกช่อง"],
      ["บดมันฝรั่งและอะโวคาโดที่เย็นแล้วด้วยส้อมให้เรียบที่สุด ในชามอีกใบ ตีไข่และโยเกิร์ตเบา ๆ", "ใช้ส้อมบดมันฝรั่งที่พักให้เย็นแล้วกับเนื้ออะโวคาโดให้เนียนที่สุด ตีไข่กับโยเกิร์ตพอเข้ากันในชามอีกใบ"],
      ["แบ่งแป้งออกเป็นหกถาด ใบละประมาณ 70 กรัม ใช้ช้อนเกลี่ยให้เรียบ แบ่งเนื้อไข่แดงออกแล้วเกลี่ยเป็นชั้นบาง ๆ บนพื้นผิวของแป้ง โรยเมล็ดงาไว้ด้านบน", "แบ่งส่วนผสมใส่พิมพ์ทั้งหก ใบละประมาณ 70 กรัม แล้วใช้ช้อนเกลี่ยหน้าให้เรียบ คนไข่แดงให้เข้ากัน ทาบาง ๆ บนหน้าแล้วโรยงา"],
      ["อบบนชั้นกลางของเตาอบประมาณ 25–35 นาที เริ่มตรวจสอบความสุกที่ 25 นาที ม้วนจะพร้อมเมื่อพื้นผิวเป็นสีน้ำตาลทอง ตั้งตรงกลางแล้ว และอุณหภูมิภายในไม่ต่ำกว่า 71 °C", "อบที่ชั้นกลางประมาณ 25–35 นาที เริ่มตรวจเมื่อครบ 25 นาที ขนมปังพร้อมเมื่อหน้าเป็นสีเหลืองทอง ตรงกลางอยู่ตัว และอุณหภูมิด้านในอย่างน้อย 71 °C"]
    ],
    "ingredientNote": [
      ["น้ำหนักเยื่อกระดาษ", "น้ำหนักเฉพาะเนื้ออะโวคาโด"]
    ]
  },
  "bataatti-banaanileipa/en": {
    "method": [
      ["Preheat the oven to 175°C with constant heat.", "Preheat the oven to 175 °C using top and bottom heat."]
    ]
  },
  "bataatti-banaanileipa/sv": {
    "method": [
      ["Värm ugnen till 175°C med konstant värme.", "Värm ugnen till 175 °C med över- och undervärme."]
    ]
  },
  "bataatti-banaanileipa/th": {
    "ingredientNote": [
      ["เยื่อกระดาษที่ปอกเปลือกและเย็น", "เนื้อมันเทศที่ปอกเปลือกและพักให้เย็นแล้ว"]
    ]
  },
  "bataatti-mustikkakakku/en": {
    "method": [
      ["Preheat the oven to 175°C with constant heat.", "Preheat the oven to 175 °C using top and bottom heat."]
    ]
  },
  "bataatti-mustikkakakku/sv": {
    "method": [
      ["Värm ugnen till 175°C med konstant värme.", "Värm ugnen till 175 °C med över- och undervärme."]
    ]
  },
  "bataattibrowniet/en": {
    "method": [
      ["Preheat the oven to 175°C with constant heat.", "Preheat the oven to 175 °C using top and bottom heat."]
    ]
  },
  "bataattibrowniet/sv": {
    "method": [
      ["Värm ugnen till 175°C med konstant värme.", "Värm ugnen till 175 °C med över- och undervärme."]
    ]
  },
  "bataattibrowniet/th": {
    "ingredientNote": [
      ["เยื่อกระดาษที่ปอกเปลือกและเย็น", "เนื้อมันเทศที่ปอกเปลือกและพักให้เย็นแล้ว"]
    ]
  },
  "bataattiletut/en": {
    "description": "Sweet potato purée and eggs make small cinnamon pancakes. Serve them warm with blueberries and maple syrup.",
    "method": [
      ["Puree sweet potato and eggs until smooth. Mix in the baking powder and cinnamon.", "Blend the sweet potato and eggs until smooth, then mix in the baking powder and cinnamon."],
      ["Heat a non-stick frying pan over medium heat and brush it with a thin layer of oil. Spoon small, about 7–8 cm long patties onto the pan.", "Heat a non-stick frying pan over medium heat and brush it lightly with oil. Spoon the batter into small pancakes about 7–8 cm across."],
      ["Bake the rest of the patties in the same way. Divide into two portions and add blueberries and maple syrup.", "Fry the remaining batter the same way. Divide the pancakes into two servings and top with blueberries and maple syrup."]
    ]
  },
  "bataattiletut/sv": {
    "description": "Sötpotatispuré och ägg blir små plättar med smak av kanel. Servera dem varma med blåbär och lönnsirap.",
    "method": [
      ["Mosa sötpotatis och ägg tills det är slätt. Blanda i bakpulvret och kanelen.", "Mixa sötpotatisen med äggen till en slät smet. Blanda i bakpulvret och kanelen."],
      ["Hetta upp en non-stick stekpanna på medelvärme och pensla den med ett tunt lager olja. Häll små, ca 7–8 cm långa biffar på pannan.", "Hetta upp en stekpanna med nonstickbeläggning på medelvärme och pensla den tunt med olja. Skeda ut smeten till plättar som är cirka 7–8 cm i diameter."],
      ["Stek ca 3 minuter på första sidan, tills kanterna stelnat och botten är gyllenbrun. Vänd med en tunn spatel och grädda i ytterligare 2-3 minuter tills även mitten stelnat.", "Stek cirka 3 minuter på första sidan tills kanterna stelnat och undersidan är gyllenbrun. Vänd med en tunn stekspade och stek i ytterligare 2–3 minuter tills även mitten har stelnat."],
      ["Grädda resten av biffarna på samma sätt. Dela i två delar och tillsätt blåbär och lönnsirap.", "Stek resten av smeten på samma sätt. Fördela plättarna på två portioner och toppa med blåbär och lönnsirap."]
    ]
  },
  "bataattiletut/th": {
    "description": "มันเทศบดกับไข่ทำเป็นแพนเค้กชิ้นเล็กหอมอบเชย เสิร์ฟอุ่น ๆ กับบลูเบอร์รีและเมเปิลไซรัป",
    "method": [
      ["ตั้งกระทะเคลือบสารกันติดบนไฟร้อนปานกลางแล้วทาด้วยน้ำมันบางๆ ตักขนมปังชิ้นเล็กยาวประมาณ 7–8 ซม. ลงบนกระทะ", "ตั้งกระทะเคลือบกันติดบนไฟปานกลางแล้วทาน้ำมันบาง ๆ ตักแป้งหยอดลงกระทะให้เป็นแพนเค้กชิ้นเล็กกว้างประมาณ 7–8 ซม."],
      ["ทอดด้านแรกประมาณ 3 นาที จนกระทั่งขอบอยู่ตัวและด้านล่างเป็นสีน้ำตาลทอง หมุนด้วยไม้พายบาง ๆ แล้วอบต่ออีก 2-3 นาทีจนกระทั่งตรงกลางอยู่ตัว", "ทอดด้านแรกประมาณ 3 นาทีจนขอบอยู่ตัวและด้านล่างเป็นสีเหลืองทอง ใช้ตะหลิวบาง ๆ พลิกแล้วทอดต่ออีก 2–3 นาทีจนตรงกลางอยู่ตัว"],
      ["อบไส้ที่เหลือด้วยวิธีเดียวกัน แบ่งออกเป็นสองส่วนและเพิ่มบลูเบอร์รี่และน้ำเชื่อมเมเปิ้ล", "ทอดแป้งที่เหลือแบบเดียวกัน แบ่งแพนเค้กเป็นสองที่ แล้วใส่บลูเบอร์รีกับเมเปิลไซรัป"]
    ],
    "ingredientNote": [
      ["เยื่อกระดาษที่ปอกเปลือกและเย็น", "เนื้อมันเทศที่ปอกเปลือกและพักให้เย็นแล้ว"]
    ]
  },
  "chili-con-carne-kukkakaaliriisi/fi": {
    "method": [
      ["Ruskista 500 g jauhelihaa ja 55 g sipulia 27 g:ssa oliiviöljyä. Lisää 120 g paprikaa,400 g tomaattimurskaa,2 g juustokuminaa,1 g savupaprikaa ja 0,5 g chiliä.", "Ruskista 500 g jauhelihaa ja 55 g sipulia 27 g:ssa oliiviöljyä. Lisää 120 g paprikaa, 400 g tomaattimurskaa, 2 g juustokuminaa, 1 g savupaprikaa ja 0,5 g chiliä."]
    ]
  },
  "gluteeniton-durrapizzapohja/fi": {
    "notes": [
      ["Tuotesivun gluteeniton-merkintä on dokumentoitu, mutta tuotevalinta ja pakkaus tarkistetaan ennen julkaisemista.", "Tuotteen gluteenittomuusmerkintä tarkistettiin valmistajan tuotetiedoista. Tarkista merkintä omasta pakkauksestasi ennen käyttöä."]
    ]
  },
  "harira/fi": {
    "method": [
      ["Lisää 400 g tomaattimurskaa,1000 g käyttövalmista lihalientä,150 g kuivia kokonaisia vihreitä/ruskeita linssejä,2 g inkiväärijauhetta,2 g kurkumaa ja 1 g jauhettua kanelia. Keitä linssit täysin pehmeiksi.", "Lisää 400 g tomaattimurskaa, 1000 g käyttövalmista lihalientä, 150 g kuivia kokonaisia vihreitä/ruskeita linssejä, 2 g inkiväärijauhetta, 2 g kurkumaa ja 1 g jauhettua kanelia. Keitä linssit täysin pehmeiksi."]
    ]
  },
  "indonesialainen-bubur-ayam-kanariisipuuro/en": {
    "description": "Simmer jasmine rice until soft and cook the chicken in the porridge. Shredded chicken, ginger and spring onions finish two hot servings."
  },
  "indonesialainen-bubur-ayam-kanariisipuuro/fi": {
    "description": "Jasmiiniriisi haudutetaan pehmeäksi puuroksi ja broileri kypsennetään samassa kattilassa. Revitty kana, inkivääri ja kevätsipuli viimeistelevät kaksi kuumaa annosta.",
    "title": "Bubur ayam – indonesialainen kanariisipuuro"
  },
  "indonesialainen-bubur-ayam-kanariisipuuro/sv": {
    "description": "Låt jasminriset sjuda till en mjuk gröt och tillaga kycklingen i samma kastrull. Rör ner den rivna kycklingen, ingefäran och salladslöken i gröten och servera varm i två portioner."
  },
  "indonesialainen-bubur-ayam-kanariisipuuro/th": {
    "description": "เคี่ยวข้าวหอมมะลิจนนุ่มเป็นโจ๊ก แล้วต้มไก่ในหม้อเดียวกัน ฉีกไก่ใส่กลับลงไปพร้อมขิงและต้นหอม เสิร์ฟร้อนสองที่"
  },
  "jauheliha-kaalikeitto-vhh/en": {
    "useSeoDescription": true,
    "nutritionBasis": "Use the exact ingredient compositions and edible weights listed. Keep all liquid, fat and spices in the dish. The salt quantity is unchanged from the original recipe."
  },
  "jauheliha-kaalikeitto-vhh/sv": {
    "useSeoDescription": true,
    "nutritionBasis": "Använd ingredienslistans exakta sammansättningar och ätliga vikter. All vätska, allt fett och alla kryddor stannar i rätten. Saltmängden är oförändrad från originalreceptet."
  },
  "jauheliha-kaalikeitto-vhh/th": {
    "useSeoDescription": true,
    "nutritionBasis": "ใช้ส่วนประกอบและน้ำหนักส่วนที่กินได้ตามรายการอย่างเคร่งครัด เก็บของเหลว ไขมัน และเครื่องเทศทั้งหมดไว้ในอาหาร ปริมาณเกลือคงเดิมตามสูตรต้นฉบับ"
  },
  "jauhelihapihvit-vhh-kermakastikkeella/fi": {
    "ingredientItem": [
      ["naudan jauhelihaa, rasvaa17%", "naudan jauhelihaa, rasvaa 17 %"],
      ["kuohukermaa pihveihin,38%", "kuohukermaa pihveihin, 38 %"],
      ["kuohukermaa kastikkeeseen,38%", "kuohukermaa kastikkeeseen, 38 %"]
    ]
  },
  "jiaozi/fi": {
    "description": "Kotitekoiset kiinalaiset nyytit täytetään porsaanlihalla, kiinankaalilla ja inkiväärillä. Ohjeesta tulee noin 40 keitettyä nyyttiä eli noin 10 nyyttiä annosta kohti."
  },
  "kana-enchilada-kukkakaalivuoka/fi": {
    "method": [
      ["Kotisalsaversio: sekoita 200 g hienonnettua tomaattia,35 g sipulia,10 g limettimehua ja 5 g tuoretta vihreää chiliä. Tämä 250 g seos korvaa valmiin salsan.", "Kotisalsaversio: sekoita 200 g hienonnettua tomaattia, 35 g sipulia, 10 g limettimehua ja 5 g tuoretta vihreää chiliä. Tämä 250 g seos korvaa valmiin salsan."],
      ["Yhdistä 500 g kypsänä punnittua broilerin rintafileetä,500 g kukkakaalia, salsa,150 g cheddaria,100 g ranskankermaa ja kaikki punnittu juustokumina, savupaprika, korianteri ja 50 g kuorittua tavallista limettiä mehuineen.", "Yhdistä 500 g kypsänä punnittua broilerin rintafileetä, 500 g kukkakaalia, salsa, 150 g cheddaria, 100 g ranskankermaa ja kaikki punnittu juustokumina, savupaprika, korianteri ja 50 g kuorittua tavallista limettiä mehuineen."]
    ]
  },
  "kana-fajita-pelti/fi": {
    "method": [
      ["Sekoita 500 g raakaa broilerin rintafileetä,240 g paprikaa,55 g punasipulia,27 g öljyä,2 g juustokuminaa,1 g savupaprikaa ja 0,3 g jauhettua chiliä.", "Sekoita 500 g raakaa broilerin rintafileetä, 240 g paprikaa, 55 g punasipulia, 27 g öljyä, 2 g juustokuminaa, 1 g savupaprikaa ja 0,3 g jauhettua chiliä."],
      ["Tarjoa 150 g syötävää avokadoa,100 g maustamatonta laktoositonta 7 % kreikkalaista jogurttia ja 50 g kuorittua tavallista limettiä hedelmälihoineen ja mehuineen. Jaa kaikki neljään annokseen. Ei tortilloja tässä versiossa.", "Tarjoa 150 g syötävää avokadoa, 100 g maustamatonta laktoositonta 7 % kreikkalaista jogurttia ja 50 g kuorittua tavallista limettiä hedelmälihoineen ja mehuineen. Jaa kaikki neljään annokseen. Ei tortilloja tässä versiossa."]
    ]
  },
  "kanakeitto-pinaatti-sitruuna/fi": {
    "method": [
      ["Lisää 150 g pinaattia,200 g kermaa,14 g voita ja 0,5 g mustapippuria. Kuumenna, kunnes kana on kauttaaltaan kypsää.", "Lisää 150 g pinaattia, 200 g kermaa, 14 g voita ja 0,5 g mustapippuria. Kuumenna, kunnes kana on kauttaaltaan kypsää."]
    ]
  },
  "kanapyorykat-tomaattikastike/fi": {
    "method": [
      ["Sekoita 500 g broilerin jauhelihaa,55 g kuoretonta kananmunaa,30 g parmesaania ja 1 g kuivattua oreganoa. Muotoile pyöryköiksi.", "Sekoita 500 g broilerin jauhelihaa, 55 g kuoretonta kananmunaa, 30 g parmesaania ja 1 g kuivattua oreganoa. Muotoile pyöryköiksi."],
      ["Kuullota 55 g sipulia 13,5 g öljyssä. Lisää 400 g tomaattimurskaa,100 g kermaa ja 0,5 g jauhettua mustapippuria.", "Kuullota 55 g sipulia 13,5 g öljyssä. Lisää 400 g tomaattimurskaa, 100 g kermaa ja 0,5 g jauhettua mustapippuria."]
    ]
  },
  "karibia-maissipuuro-kookoksella/fi": {
    "method": [
      ["Lisää 184 g kookosmaitoa,2,6 g jauhettua kanelia ja 5 g vaniljauutetta. Syö kaikki mausteet, ei siivilöintiä.", "Lisää 184 g kookosmaitoa, 2,6 g jauhettua kanelia ja 5 g vaniljauutetta. Syö kaikki mausteet, ei siivilöintiä."]
    ]
  },
  "ketopizza-pofiber-pohjalla/en": {
    "description": "The cheese in the crust, cream cheese and egg bind the Pofiber into a soft dough that bakes with crisp edges. Make one large pizza or a pan pizza for two with 50 g each of ham, bell pepper and button mushrooms. Weigh any substitutions.",
    "method": [
      ["Spread the tomato sauce on the base and add the measured default toppings.", "Spread the tomato sauce over the crust, then add the weighed ham, bell pepper and button mushrooms."]
    ]
  },
  "ketopizza-pofiber-pohjalla/sv": {
    "description": "Osten i botten, färskosten och ägget binder ihop Pofiber till en mjuk deg som får frasiga kanter i ugnen. Gör en stor pizza eller en pannpizza för två med 50 g vardera av skinka, paprika och champinjoner. Väg eventuella ersättningar.",
    "method": [
      ["Bred ut tomatsåsen på botten och lägg på de uppmätta standardpåläggen.", "Bred tomatsåsen över botten och lägg på den vägda skinkan, paprikan och champinjonerna."]
    ]
  },
  "ketopizza-pofiber-pohjalla/th": {
    "description": "ชีสในแป้งฐาน ครีมชีส และไข่ช่วยให้โพไฟเบอร์จับตัวเป็นแป้งนุ่มที่อบแล้วขอบกรอบ ทำพิซซ่าขนาดใหญ่หนึ่งถาดหรือพิซซ่าถาดสำหรับสองคน ใส่แฮม พริกหวาน และเห็ดแชมปิญองอย่างละ 50 กรัม หากเปลี่ยนเครื่องหน้าให้ชั่งน้ำหนัก",
    "method": [
      ["ทาซอสมะเขือเทศบนฐานแล้วใส่เครื่องตามสูตรที่ชั่งไว้", "ทาซอสมะเขือเทศบนแป้งฐาน แล้วใส่แฮม พริกหวาน และเห็ดแชมปิญองที่ชั่งไว้"]
    ]
  },
  "kiinalainen-musta-seesamipuuro/fi": {
    "method": [
      ["Lisää 200 g makeuttamatonta soijajuomaa,20 g hunajaa ja 10 g kokonaisia mustia seesaminsiemeniä. Kuumenna ja mausta suolalla.", "Lisää 200 g makeuttamatonta soijajuomaa, 20 g hunajaa ja 10 g kokonaisia mustia seesaminsiemeniä. Kuumenna ja mausta suolalla."]
    ]
  },
  "kreikkalainen-kanavuoka-oliiveilla/fi": {
    "method": [
      ["Sekoita 27 g oliiviöljyä,30 g sitruunamehua,2 g kuivattua oreganoa ja 0,5 g mustapippuria. Lisää vuokaan 100 g fetan ja 60 g kivettömien oliivien kanssa.", "Sekoita 27 g oliiviöljyä, 30 g sitruunamehua, 2 g kuivattua oreganoa ja 0,5 g mustapippuria. Lisää vuokaan 100 g fetan ja 60 g kivettömien oliivien kanssa."]
    ]
  },
  "liha-juureskeitto-perunaton/fi": {
    "ingredientItem": [
      ["laakerinlehtiä,2 pientä kokonaista lehteä", "laakerinlehtiä, 2 pientä kokonaista lehteä"],
      ["kokonaisia mustapippureita,6 kpl", "kokonaisia mustapippureita, 6 kpl"]
    ]
  },
  "lihapullat-kermakastikkeessa-vhh/en": {
    "description": "Meatballs made with a little almond flour are served in a creamy sauce with cauliflower mash. Salt sparingly, as the stock also adds salt to the sauce."
  },
  "lihapullat-kermakastikkeessa-vhh/fi": {
    "description": "Mantelijauho sitoo lihapullat, ja lisukkeeksi tehdään kukkakaalimuusia. Suolaa maltillisesti, sillä myös lihaliemi antaa kermakastikkeelle suolaisuutta."
  },
  "lihapullat-kermakastikkeessa-vhh/sv": {
    "description": "Köttbullar med lite mandelmjöl serveras i gräddsås med blomkålsmos. Salta sparsamt, eftersom köttbuljongen också ger såsen sälta."
  },
  "lihapullat-kermakastikkeessa-vhh/th": {
    "description": "ผสมแป้งอัลมอนด์เล็กน้อยลงในมีตบอล เสิร์ฟกับซอสครีมและดอกกะหล่ำบด ใส่เกลือแต่น้อย เพราะน้ำซุปเนื้อให้รสเค็มอยู่แล้ว"
  },
  "marokkolainen-couscous/en": {
    "description": "Serve couscous with chicken thigh, vegetables and a broth seasoned with turmeric, cumin and coriander. Boil the whole chickpeas separately and stir them in hot at the end, without another 15 minutes in the stew. Divide all the broth among the servings. The GL estimate has low confidence and uses the carbohydrate value for dry San Remo CousCous and a limited GI comparison. Nutrition values are unavailable because the manufacturer does not report the product’s polyol content."
  },
  "marokkolainen-couscous/fi": {
    "description": "Broilerin paistileike, kasvikset ja kurkumalla, juustokuminalla ja korianterilla maustettu liemi tarjotaan couscousin kanssa. Keitä kokonaiset kikherneet erikseen ja lisää ne lopuksi kuumina. Älä keitä niitä padassa uudelleen 15 minuuttia. Jaa kaikki liemi annoksiin. GK-arvion luottamus on matala. Arvio perustuu kuivan San Remo CousCousin hiilihydraattitietoon ja rajattuun GI-vertailuun. Ravintoarvoja ei näytetä, koska valmistaja ei ilmoita tuotteen polyolimäärää."
  },
  "marokkolainen-couscous/sv": {
    "description": "Servera couscous med kycklinglårfilé, grönsaker och buljong kryddad med gurkmeja, spiskummin och koriander. Koka hela kikärter separat och vänd ner dem varma på slutet utan att koka dem ytterligare 15 minuter i grytan. Fördela all buljong mellan portionerna. GL-uppskattningen har låg tillförlitlighet och bygger på kolhydratvärdet för torr San Remo CousCous och en avgränsad GI-jämförelse. Näringsvärdena visas inte eftersom tillverkaren inte anger produktens polyolhalt."
  },
  "marokkolainen-couscous/th": {
    "description": "เสิร์ฟคูสคูสกับเนื้อสะโพกไก่ ผัก และน้ำซุปปรุงด้วยขมิ้น ยี่หร่า และเมล็ดผักชี ต้มถั่วลูกไก่ทั้งเมล็ดแยกแล้วใส่ตอนท้ายขณะยังร้อน ไม่ต้องต้มซ้ำในหม้ออีก 15 นาที แบ่งน้ำซุปทั้งหมดให้ครบทุกที่ ค่าประมาณ GL มีความเชื่อมั่นต่ำ โดยใช้ข้อมูลคาร์โบไฮเดรตของ San Remo CousCous แบบแห้งและค่า GI จากการเปรียบเทียบในขอบเขตจำกัด ยังไม่แสดงข้อมูลโภชนาการเพราะผู้ผลิตไม่ระบุปริมาณพอลิออล"
  },
  "meksikolainen-atole-maissipuuro/fi": {
    "method": [
      ["Lisää 200 g täysmaitoa,2,6 g jauhettua kanelia ja 5 g nimettyä vaniljauutetta. Syö mausteet kokonaan; ei siivilöintiä.", "Lisää 200 g täysmaitoa, 2,6 g jauhettua kanelia ja 5 g nimettyä vaniljauutetta. Syö mausteet kokonaan; ei siivilöintiä."]
    ]
  },
  "mustikka-jogurttijaatelo/sv": {
    "method": [
      ["Puré tills den är slät.", "Mixa tills blandningen är slät."]
    ]
  },
  "nakkikastike-kukkakaalimuusi/fi": {
    "ingredientItem": [
      ["kuohukermaa,38%", "kuohukermaa, 38 %"]
    ]
  },
  "nakkikeitto-kukkakaalilla/fi": {
    "ingredientItem": [
      ["laakerinlehteä,1 pieni kokonainen lehti", "laakerinlehteä, 1 pieni kokonainen lehti"]
    ]
  },
  "naudan-paahtopaisti-uunissa/en": {
    "description": "Sear the whole cut of beef in a pan, then roast it gently in the oven using a meat thermometer. Slice against the grain to serve warm, or refrigerate the roast and slice it once chilled for sandwiches.",
    "method": [
      ["Grease the surface of the roast for a while with pan grease.", "Briefly baste the roast with the fat in the pan."],
      ["cut the meat crosswise into thin slices.", "slice the meat thinly against the grain."],
      ["Preheat the oven to 125°C with constant heat.", "Preheat the oven to 125 °C using top and bottom heat."]
    ],
    "notes": [
      ["If meat is recommended for the diner, prepare a portion cooked all over.", "If the diner has been advised to eat fully cooked meat, make sure their portion is cooked all the way through."],
      ["[Champion](https://www.valio.fi/", "[Valio](https://www.valio.fi/"]
    ]
  },
  "naudan-paahtopaisti-uunissa/sv": {
    "description": "Bryn rostbiffen hel i stekpanna och tillaga den sedan på låg ugnsvärme med stektermometer. Skär tvärs över muskelfibrerna och servera varm, eller kyl steken i kylskåp innan du skivar den till smörgåsar.",
    "method": [
      ["Smörj stekens yta en stund med pannfett.", "Ös steken en kort stund med fettet i pannan."],
      ["skär köttet på tvären i tunna skivor.", "skär köttet i tunna skivor tvärs över muskelfibrerna."],
      ["Värm ugnen till 125°C med konstant värme.", "Värm ugnen till 125 °C med över- och undervärme."]
    ],
    "notes": [
      ["Om kött rekommenderas för diner, förbered en del tillagad överallt.", "Om den som ska äta rekommenderas genomstekt kött, tillaga personens portion så att den blir genomstekt."],
      ["[Mästare](https://www.valio.fi/", "[Valio](https://www.valio.fi/"]
    ]
  },
  "naudan-paahtopaisti-uunissa/th": {
    "description": "จี่เนื้อวัวทั้งชิ้นในกระทะให้ผิวเป็นสีน้ำตาล แล้วอบด้วยไฟอ่อนโดยใช้เทอร์โมมิเตอร์วัดอุณหภูมิเนื้อ หั่นขวางเส้นใยแล้วเสิร์ฟอุ่น หรือแช่ตู้เย็นก่อนหั่นสำหรับทำแซนด์วิช",
    "method": [
      ["ทาจาระบีที่พื้นผิวของเนื้อย่างสักครู่ด้วยจาระบีกระทะ", "ตักไขมันในกระทะราดบนเนื้อสักครู่"],
      ["ปล่อยให้พักไว้ประมาณ 15-20 นาทีก่อนตัด", "คลุมเนื้อหลวม ๆ แล้วพักประมาณ 15–20 นาทีก่อนหั่น"],
      ["ตั้งน้ำมันเรพซีดในกระทะและย่างให้ทั่วรวมทั้งส่วนปลายด้วย ในตอนท้าย ใส่เนย กานพลูกระเทียมบด และไธม์ลงไป", "ตั้งน้ำมันเรพซีดในกระทะให้ร้อน จี่เนื้อให้เป็นสีน้ำตาลทั่วชิ้นรวมทั้งด้านหัวท้าย ช่วงท้ายใส่เนย กลีบกระเทียมบุบ และไธม์"],
      ["โอนย่างไปยังจานอบ สอดปลายเทอร์โมมิเตอร์เข้าตรงกลางส่วนที่หนาที่สุด อบที่ระดับกลางของเตาอบจนกระทั่งเทอร์โมมิเตอร์อ่านได้อย่างน้อย 63 °C คุณสามารถเผื่อเวลาไว้ 1½–2½ ชั่วโมงสำหรับการย่างประมาณ 1 กิโลกรัม รูปร่างและอุณหภูมิเริ่มต้นส่งผลต่อเวลา", "ย้ายชิ้นเนื้อลงในภาชนะสำหรับอบ เสียบปลายเทอร์โมมิเตอร์วัดอุณหภูมิเนื้อให้ถึงกึ่งกลางของส่วนที่หนาที่สุด อบบนชั้นกลางจนวัดได้อย่างน้อย 63 °C สำหรับเนื้อหนักประมาณ 1 กิโลกรัม เผื่อเวลาอบไว้ 1½–2½ ชั่วโมง ระยะเวลาขึ้นอยู่กับรูปทรงและอุณหภูมิของเนื้อก่อนเข้าเตา"]
    ],
    "notes": [
      ["[แชมป์](https://www.valio.fi/", "[Valio](https://www.valio.fi/"]
    ]
  },
  "paahtopaistileipa-piparjuurikastikkeella/en": {
    "method": [
      ["Cut [mature, chilled roast beef](/en/recipes/naudan-paahtopaisti-uunissa/) into thin slices and weigh 240 g. Place four slices of rye bread on plates. You can toast the bases lightly. Let them cool before filling.", "Cut [cooked, chilled roast beef](/en/recipes/naudan-paahtopaisti-uunissa/) into thin slices and weigh 240 g. Place four slices of rye bread on plates. You can toast the bases lightly. Let them cool before filling."],
      ["Mix sour cream, mayonnaise, Dijon mustard and lemon juice. First grate 12 g of horseradish. Taste and add more grated if desired up to a maximum of 20 grams. Season with black pepper.", "Mix the sour cream, mayonnaise, Dijon mustard and lemon juice. Grate in 12 g of horseradish. Taste and add more grated horseradish if needed, up to 20 g in total. Season with black pepper."],
      ["Spread the sauce on the bottoms and add arugula. Fold 60 g of roast beef onto each piece of bread. Finish with pickles, onions and capers. Offer now.", "Spread the sauce on the bread and add the arugula. Fold 60 g of roast beef onto each piece. Finish with pickles, onion and capers. Serve immediately."]
    ],
    "notes": [
      ["ready-made soles and mature, cold meat", "the prepared bread and cooked, chilled roast beef"]
    ]
  },
  "paahtopaistileipa-piparjuurikastikkeella/sv": {
    "method": [
      ["Skära [mogen, kyld rostbiff](/sv/recept/naudan-paahtopaisti-uunissa/) i tunna skivor och väg 240 g. Lägg fyra skivor rågbröd på tallrikar. Du kan rosta bottnarna lätt. Låt dem svalna innan de fylls.", "Skär [tillagad, kyld rostbiff](/sv/recept/naudan-paahtopaisti-uunissa/) i tunna skivor och väg 240 g. Lägg fyra skivor rågbröd på tallrikar. Du kan rosta bottnarna lätt. Låt dem svalna innan de fylls."],
      ["Blanda smetana, majonnäs, dijonsenap och citronsaft. Riv först 12 g pepparrot. Smaka av och tillsätt mer rivet om så önskas upp till max 20 gram. Krydda med svartpeppar.", "Blanda smetana, majonnäs, dijonsenap och citronsaft. Riv ner 12 g pepparrot. Smaka av och tillsätt vid behov mer riven pepparrot, upp till 20 g totalt. Krydda med svartpeppar."],
      ["Bred ut såsen på bottnarna och tillsätt ruccola. Vik 60 g rostbiff på varje brödbit. Avsluta med saltgurka, lök och kapris. Erbjud nu.", "Bred såsen på brödet och lägg på rucola. Lägg 60 g rostbiff i veck på varje brödbit. Toppa med saltgurka, lök och kapris. Servera genast."]
    ],
    "notes": [
      ["färdiga sulor och moget kallt kött", "färdigt bröd och tillagad, kyld rostbiff"]
    ]
  },
  "paahtopaistileipa-piparjuurikastikkeella/th": {
    "method": [
      ["ตัด [เนื้อย่างสุกแช่เย็น](/th/recipes/naudan-paahtopaisti-uunissa/) เป็นชิ้นบางๆ หนัก 240 กรัม วางขนมปังข้าวไรย์สี่แผ่นลงบนจาน คุณสามารถปิ้งฐานเบาๆ ปล่อยให้เย็นก่อนเติม", "หั่น [เนื้ออบที่ปรุงสุกและแช่เย็นแล้ว](/th/recipes/naudan-paahtopaisti-uunissa/) เป็นชิ้นบางๆ หนัก 240 กรัม วางขนมปังข้าวไรย์สี่แผ่นลงบนจาน คุณสามารถปิ้งฐานเบาๆ ปล่อยให้เย็นก่อนเติม"],
      ["ผสมครีมเปรี้ยว มายองเนส มัสตาร์ดดีชง และน้ำมะนาว ขั้นแรกขูดฮอร์สแรดิช 12 กรัม ชิมรสและเติมตะแกรงเพิ่มหากต้องการ สูงสุดถึง 20 กรัม ปรุงรสด้วยพริกไทยดำ", "ผสมครีมเปรี้ยว มายองเนส มัสตาร์ดดีฌง และน้ำมะนาว ขูดฮอร์สแรดิช 12 กรัมลงไปก่อน ชิมแล้วเติมฮอร์สแรดิชขูดได้ตามชอบ แต่ให้ใช้รวมไม่เกิน 20 กรัม ปรุงรสด้วยพริกไทยดำ"],
      ["ทาซอสที่ก้นและเพิ่ม arugula ตะล่อมเนื้อย่าง 60 กรัมลงบนขนมปังแต่ละชิ้น ปิดท้ายด้วยผักดอง หัวหอม และเคเปอร์ เสนอตอนนี้.", "ทาซอสบนขนมปังแล้วใส่ผักร็อกเก็ต พับเนื้ออบวางบนขนมปังชิ้นละ 60 กรัม โรยหน้าด้วยแตงกวาดอง หัวหอม และเคเปอร์ เสิร์ฟทันที"]
    ],
    "notes": [
      ["พื้นรองเท้าสำเร็จรูปและเนื้อเย็นที่สุก", "ขนมปังที่เตรียมไว้กับเนื้ออบที่ปรุงสุกและแช่เย็นแล้ว"]
    ]
  },
  "paahtopaistileivat-kauralesesampyloilla/en": {
    "method": [
      ["Cut [mature, chilled roast beef](/en/recipes/naudan-paahtopaisti-uunissa/) into thin slices and weigh 240 g. Cut the cooled oat bran rolls in half and place the halves cut side up. You can toast the bases lightly. Let them cool before filling.", "Cut [cooked, chilled roast beef](/en/recipes/naudan-paahtopaisti-uunissa/) into thin slices and weigh 240 g. Cut the cooled oat bran rolls in half and place the halves cut side up. You can toast the bases lightly. Let them cool before filling."],
      ["Mix sour cream, mayonnaise, Dijon mustard and lemon juice. First grate 12 g of horseradish. Taste and add more grated if desired up to a maximum of 20 grams. Season with black pepper.", "Mix the sour cream, mayonnaise, Dijon mustard and lemon juice. Grate in 12 g of horseradish. Taste and add more grated horseradish if needed, up to 20 g in total. Season with black pepper."],
      ["Spread the sauce on the bottoms and add arugula. Fold 60 g of roast beef onto each piece of bread. Finish with pickles, onions and capers. Offer now.", "Spread the sauce on the bread and add the arugula. Fold 60 g of roast beef onto each piece. Finish with pickles, onion and capers. Serve immediately."]
    ],
    "notes": [
      ["ready-made soles and mature, cold meat", "the prepared bread and cooked, chilled roast beef"]
    ]
  },
  "paahtopaistileivat-kauralesesampyloilla/sv": {
    "method": [
      ["Skära [mogen, kyld rostbiff](/sv/recept/naudan-paahtopaisti-uunissa/) i tunna skivor och väg 240 g. Skär de avsvalnade havreklirullarna på mitten och lägg halvorna med snittsidan uppåt. Du kan rosta bottnarna lätt. Låt dem svalna innan de fylls.", "Skär [tillagad, kyld rostbiff](/sv/recept/naudan-paahtopaisti-uunissa/) i tunna skivor och väg 240 g. Skär de avsvalnade havreklifrallorna på mitten och lägg halvorna med snittsidan uppåt. Du kan rosta bottnarna lätt. Låt dem svalna innan de fylls."],
      ["Blanda smetana, majonnäs, dijonsenap och citronsaft. Riv först 12 g pepparrot. Smaka av och tillsätt mer rivet om så önskas upp till max 20 gram. Krydda med svartpeppar.", "Blanda smetana, majonnäs, dijonsenap och citronsaft. Riv ner 12 g pepparrot. Smaka av och tillsätt vid behov mer riven pepparrot, upp till 20 g totalt. Krydda med svartpeppar."],
      ["Bred ut såsen på bottnarna och tillsätt ruccola. Vik 60 g rostbiff på varje brödbit. Avsluta med saltgurka, lök och kapris. Erbjud nu.", "Bred såsen på brödet och lägg på rucola. Lägg 60 g rostbiff i veck på varje brödbit. Toppa med saltgurka, lök och kapris. Servera genast."],
      ["Skär de avsvalnade havreklifrallorna på mitten och lägg halvorna med snittsidan uppåt. Du kan rosta bottnarna lätt. Låt dem svalna innan de fylls.", "Dela de avsvalnade havreklifrallorna och lägg halvorna med snittytan uppåt. Rosta dem lätt om du vill och låt dem svalna före montering."],
      ["Bred såsen på brödet och lägg på rucola. Lägg 60 g rostbiff i veck på varje brödbit.", "Bred såsen på frallhalvorna och lägg på rucola. Lägg 60 g rostbiff i veck på varje halva."],
      ["Skölj och torka ruccolan. Skiva den inlagda gurkan och rödlöken tunt. Häll av saltgurkan och kaprisen.", "Skölj och torka rucolan. Skiva saltgurkan och rödlöken tunt. Låt saltgurkan och kaprisen rinna av."]
    ],
    "notes": [
      ["färdiga sulor och moget kallt kött", "färdigt bröd och tillagad, kyld rostbiff"],
      ["Använder du sesamfrön i rullarna är de också ett allergen.", "Använder du sesamfrön i frallorna är de också ett allergen."],
      ["De är grunden [havrekli rullar](/sv/recept/keto-kauralesesampylat/). Samma fyllningar är också lämpliga [till rågbröd](/sv/recept/paahtopaistileipa-piparjuurikastikkeella/).", "Använd [havreklifrallor](/sv/recept/keto-kauralesesampylat/) som bas. Samma pålägg passar också [på rågbröd](/sv/recept/paahtopaistileipa-piparjuurikastikkeella/)."]
    ],
    "description": "Lägg skivad kall rostbiff, smetanasås med pepparrot och rucola på halverade havreklifrallor. Saltgurka, kapris och lök ger syra och krispighet."
  },
  "paahtopaistileivat-kauralesesampyloilla/th": {
    "method": [
      ["ตัด [เนื้อย่างสุกแช่เย็น](/th/recipes/naudan-paahtopaisti-uunissa/) เป็นชิ้นบางๆ หนัก 240 กรัม ตัดรำข้าวโอ๊ตโรลที่เย็นแล้วลงครึ่งหนึ่งแล้ววางครึ่งหนึ่งโดยหงายขึ้น คุณสามารถปิ้งฐานเบาๆ ปล่อยให้เย็นก่อนเติม", "หั่น [เนื้ออบที่ปรุงสุกและแช่เย็นแล้ว](/th/recipes/naudan-paahtopaisti-uunissa/) เป็นชิ้นบางๆ หนัก 240 กรัม ตัดรำข้าวโอ๊ตโรลที่เย็นแล้วลงครึ่งหนึ่งแล้ววางครึ่งหนึ่งโดยหงายขึ้น คุณสามารถปิ้งฐานเบาๆ ปล่อยให้เย็นก่อนเติม"],
      ["ผสมครีมเปรี้ยว มายองเนส มัสตาร์ดดีชง และน้ำมะนาว ขั้นแรกขูดฮอร์สแรดิช 12 กรัม ชิมรสและเติมตะแกรงเพิ่มหากต้องการ สูงสุดถึง 20 กรัม ปรุงรสด้วยพริกไทยดำ", "ผสมครีมเปรี้ยว มายองเนส มัสตาร์ดดีฌง และน้ำมะนาว ขูดฮอร์สแรดิช 12 กรัมลงไปก่อน ชิมแล้วเติมฮอร์สแรดิชขูดได้ตามชอบ แต่ให้ใช้รวมไม่เกิน 20 กรัม ปรุงรสด้วยพริกไทยดำ"],
      ["ทาซอสที่ก้นและเพิ่ม arugula ตะล่อมเนื้อย่าง 60 กรัมลงบนขนมปังแต่ละชิ้น ปิดท้ายด้วยแตงกวาดอง หัวหอม และเคเปอร์ เสนอตอนนี้.", "ทาซอสบนขนมปังแล้วใส่ผักร็อกเก็ต พับเนื้ออบวางบนขนมปังชิ้นละ 60 กรัม โรยหน้าด้วยแตงกวาดอง หัวหอม และเคเปอร์ เสิร์ฟทันที"],
      ["ตัดรำข้าวโอ๊ตโรลที่เย็นแล้วลงครึ่งหนึ่งแล้ววางครึ่งหนึ่งโดยหงายขึ้น คุณสามารถปิ้งฐานเบาๆ ปล่อยให้เย็นก่อนเติม", "ผ่าขนมปังรำข้าวโอ๊ตที่เย็นแล้วเป็นสองซีก วางให้ด้านที่ผ่าหงายขึ้น จะปิ้งขนมปังพอเกรียมก็ได้ พักให้เย็นก่อนวางเครื่อง"],
      ["ทาซอสบนขนมปังแล้วใส่ผักร็อกเก็ต พับเนื้ออบวางบนขนมปังชิ้นละ 60 กรัม", "ทาซอสบนขนมปังที่ผ่าครึ่งแล้ววางผักร็อกเก็ต พับเนื้ออบวางบนขนมปังซีกละ 60 กรัม"],
      ["ล้างและทำให้ arugula แห้ง หั่นแตงกวาดองและหัวหอมหัวใหญ่แดงเป็นชิ้นบาง ๆ ระบายแตงกวาดองและเคเปอร์", "ล้างผักร็อกเก็ตแล้วซับให้แห้ง หั่นแตงกวาดองและหอมหัวใหญ่สีแดงเป็นแผ่นบาง ๆ สะเด็ดน้ำแตงกวาดองและเคเปอร์"]
    ],
    "notes": [
      ["พื้นรองเท้าสำเร็จรูปและเนื้อเย็นที่สุก", "ขนมปังที่เตรียมไว้กับเนื้ออบที่ปรุงสุกและแช่เย็นแล้ว"],
      ["หากคุณใช้เมล็ดงาในโรล ก็อาจเป็นสารก่อภูมิแพ้ได้เช่นกัน", "หากใส่งาในขนมปังรำข้าวโอ๊ต งาก็เป็นสารก่อภูมิแพ้เช่นกัน"],
      ["พวกเขาเป็นพื้นฐาน [ม้วนรำข้าวโอ๊ต](/th/recipes/keto-kauralesesampylat/). การอุดแบบเดียวกันก็เหมาะสมเช่นกัน [สำหรับขนมปังข้าวไรย์](/th/recipes/paahtopaistileipa-piparjuurikastikkeella/).", "ใช้ [ขนมปังรำข้าวโอ๊ต](/th/recipes/keto-kauralesesampylat/) เป็นฐาน เครื่องหน้าแบบเดียวกันใช้กับ [ขนมปังข้าวไรย์](/th/recipes/paahtopaistileipa-piparjuurikastikkeella/) ได้ด้วย"]
    ],
    "description": "วางเนื้ออบเย็นหั่นบาง ซอสครีมเปรี้ยวผสมฮอร์สแรดิช และผักร็อกเก็ตบนขนมปังรำข้าวโอ๊ตที่ผ่าครึ่งเป็นแซนด์วิชเปิดหน้า แตงกวาดอง เคเปอร์ และหอมหัวใหญ่เพิ่มรสเปรี้ยวและความกรอบ"
  },
  "paprikainen-vhh-gulassi/fi": {
    "method": [
      [
        "Hauduta kannen alla 1,5 tuntia, kunnes liha on mureaa.",
        "Hauduta liedellä kannellisessa padassa miedolla lämmöllä 1,5 tuntia, kunnes liha on mureaa."
      ],
      [
        "Lisää 0,5 g mustapippuria ja 10 g persiljaa. Tarjoa koko pata kastikkeineen ja rasvoineen 150 g noin 40-prosenttista smetanaa kanssa neljänä annoksena. Erilliset lisukkeet eivät kuulu annokseen.",
        "Lisää 0,5 g mustapippuria ja 10 g persiljaa. Jaa koko pata kastikkeineen ja rasvoineen neljään annokseen. Tarjoa niiden kanssa yhteensä 150 g noin 40-prosenttista smetanaa. Erilliset lisukkeet eivät kuulu annoksiin."
      ]
    ],
    "notes": [
      [
        "Ravintoarvot ovat toistaiseksi pois näkyvistä lähdetietojen tarkistuksen vuoksi.",
        "Ravintoarvot ovat toistaiseksi pois näkyvistä lähdetietojen tarkistuksen vuoksi.\n\nValmistustapa: haudutus liedellä kannellisessa padassa. Naudanlihaa ruskistetaan ja pata hautuu liedellä miedolla lämmöllä 1,5 tuntia; ohjeessa ei ole uunivaihetta."
      ]
    ]
  },
  "paprikainen-vhh-gulassi/en": {
    "method": [
      [
        "Simmer covered for 1.5 hours until the beef is tender.",
        "Simmer on the stovetop in a covered pot over low heat for 1.5 hours until the beef is tender."
      ]
    ],
    "notes": [
      [
        "Nutrition values are temporarily withheld pending source verification.",
        "Nutrition values are temporarily withheld pending source verification.\n\nCooking method: simmering on the stovetop in a covered pot. Brown the beef, then simmer the covered pot over low heat for 1.5 hours; the recipe has no oven stage."
      ]
    ]
  },
  "paprikainen-vhh-gulassi/sv": {
    "method": [
      [
        "Sjud under lock i 1,5 timmar tills köttet är mört.",
        "Låt sjuda på spisen under lock och på svag värme i 1,5 timmar tills köttet är mört."
      ]
    ],
    "notes": [
      [
        "Näringsvärden visas tills vidare inte i väntan på källkontroll.",
        "Näringsvärden visas tills vidare inte i väntan på källkontroll.\n\nTillagningssätt: sjudning på spisen i en gryta med lock. Bryn köttet och sjud sedan grytan på svag värme i 1,5 timmar; receptet har inget ugnssteg."
      ]
    ]
  },
  "paprikainen-vhh-gulassi/th": {
    "method": [
      [
        "ปิดฝาเคี่ยว 1.5 ชั่วโมงจนเนื้อนุ่ม",
        "ปิดฝาเคี่ยวในหม้อบนเตาด้วยไฟอ่อน 1.5 ชั่วโมงจนเนื้อนุ่ม"
      ]
    ],
    "notes": [
      [
        "ข้อมูลโภชนาการยังไม่แสดงระหว่างตรวจสอบแหล่งข้อมูล",
        "ข้อมูลโภชนาการยังไม่แสดงระหว่างตรวจสอบแหล่งข้อมูล\n\nวิธีปรุง: เคี่ยวบนเตาในหม้อปิดฝา หลังจากผัดเนื้อให้เหลืองแล้วให้เคี่ยวในหม้อปิดฝาบนเตาด้วยไฟอ่อน 1.5 ชั่วโมง สูตรนี้ไม่มีขั้นตอนอบในเตาอบ"
      ]
    ]
  },
  "parmesaani-lyttyperunat/en": {
    "method": [
      ["Preheat the oven to 200 °C with constant heat.", "Preheat the oven to 200 °C using top and bottom heat."]
    ]
  },
  "parmesaani-lyttyperunat/sv": {
    "method": [
      ["Värm ugnen till 200 °C med konstant värme.", "Värm ugnen till 200 °C med över- och undervärme."]
    ]
  },
  "pasta-alla-norma/en": {
    "description": "Fry the aubergine until golden, then toss it with tomato sauce and penne. Finish with basil and pecorino. Cook the specified penne for 11 minutes. Nine-minute al dente pasta, rigatoni, other cheeses and chilled pasta need separate estimates. Nutrition values are unavailable because the polyol content of the cheese has not been verified."
  },
  "pasta-alla-norma/fi": {
    "description": "Kullanruskeaksi paistettu munakoiso sekoitetaan tomaattikastikkeeseen ja penneen. Basilika ja pecorino viimeistelevät pastan. Keitä ohjeessa nimettyä penneä 11 minuuttia. Yhdeksän minuutin al dente -kypsyys, rigatoni, muu juusto ja jäähdytetty pasta tarvitsevat oman arvion. Ravintoarvoja ei näytetä, koska juuston polyolimäärää ei ole varmennettu."
  },
  "pasta-alla-norma/sv": {
    "description": "Stek auberginen gyllenbrun och vänd ner den i tomatsåsen tillsammans med penne. Toppa med basilika och pecorino. Koka den angivna pennetypen i 11 minuter. Nio minuters al dente, rigatoni, annan ost och kyld pasta behöver bedömas separat. Näringsvärdena visas inte eftersom ostens polyolhalt inte har verifierats."
  },
  "pasta-alla-norma/th": {
    "description": "ทอดมะเขือม่วงให้เหลืองทองแล้วคลุกกับซอสมะเขือเทศและเพนเน่ โรยใบโหระพาอิตาเลียนและชีสเพโคริโน ต้มเพนเน่ชนิดที่ระบุ 11 นาที หากต้ม 9 นาทีแบบอัลเดนเต้ ใช้ริกาโตนีหรือชีสชนิดอื่น หรือแช่เย็นพาสต้า ต้องประเมินแยก ยังไม่แสดงข้อมูลโภชนาการเพราะไม่ได้ยืนยันปริมาณพอลิออลในชีส"
  },
  "perinteinen-mansikkataytekakku-sienikakkupohjalla/en": {
    "description": "A traditional strawberry cake with a light hot-water sponge, strawberry jam, fresh strawberries and vanilla whipped cream. The recipe makes one 24 cm cake, about 10 slices."
  },
  "pinaatti-raejuustopaistos/en": {
    "method": [
      ["Preheat the oven to 190 °C with constant heat.", "Preheat the oven to 190 °C using top and bottom heat."]
    ]
  },
  "pinaatti-raejuustopaistos/sv": {
    "method": [
      ["Värm ugnen till 190 °C med konstant värme.", "Värm ugnen till 190 °C med över- och undervärme."]
    ]
  },
  "pohjoisafrikkalainen-minttutee-kaurapuuro/en": {
    "description": "Whole milk makes the oat porridge creamy, and honey sweetens it. Stir in chopped mint leaves and eat them with the porridge.",
    "title": "Mint oat porridge with milk and honey"
  },
  "pohjoisafrikkalainen-minttutee-kaurapuuro/fi": {
    "description": "Täysmaito pehmentää kaurapuuron ja hunaja makeuttaa sen. Hienonnetut mintunlehdet sekoitetaan puuroon ja syödään sen mukana.",
    "title": "Minttu-kaurapuuro maidolla ja hunajalla"
  },
  "pohjoisafrikkalainen-minttutee-kaurapuuro/sv": {
    "description": "Standardmjölk gör havregröten len och honung ger sötma. Rör ner hackade myntablad och ät dem tillsammans med gröten.",
    "title": "Havregröt med mynta, mjölk och honung"
  },
  "pohjoisafrikkalainen-minttutee-kaurapuuro/th": {
    "description": "นมเต็มมันเนยทำให้โจ๊กข้าวโอ๊ตเนื้อนุ่ม น้ำผึ้งให้ความหวาน ส่วนใบสะระแหน่สดที่สับแล้วกินได้พร้อมโจ๊ก",
    "title": "โจ๊กข้าวโอ๊ตใส่สะระแหน่ นม และน้ำผึ้ง"
  },
  "punajuuri-suklaakakku/en": {
    "ingredientNote": [
      ["weighed when ripe and drained", "weighed cooked and drained"]
    ],
    "notes": [
      ["300 grams when ripe", "300 g of cooked beetroot"]
    ],
    "method": [
      ["Preheat the oven to 175°C with constant heat.", "Preheat the oven to 175 °C using top and bottom heat."]
    ]
  },
  "punajuuri-suklaakakku/sv": {
    "ingredientNote": [
      ["vägda när de är mogna och avrunna", "vägda kokta och avrunna"]
    ],
    "notes": [
      ["300 gram när de är mogna", "300 g kokta rödbetor"]
    ],
    "method": [
      ["Värm ugnen till 175°C med konstant värme.", "Värm ugnen till 175 °C med över- och undervärme."]
    ]
  },
  "ropa-vieja/fi": {
    "ingredientItem": [
      ["laakerinlehteä,1 pieni kokonainen lehti", "laakerinlehteä, 1 pieni kokonainen lehti"]
    ]
  },
  "siskonmakkarakeitto-juurekset/fi": {
    "ingredientItem": [
      ["laakerinlehteä,1 pieni kokonainen lehti", "laakerinlehteä, 1 pieni kokonainen lehti"]
    ]
  },
  "suklaa-raejuustokakku/en": {
    "description": "Blended cottage cheese and Greek yogurt give this crustless cake a smooth texture. Cocoa gives it a chocolate flavour, and honey softens the bitterness. Chill the cake before slicing for neat pieces.",
    "method": [
      ["Puree the cottage cheese, yogurt, eggs, cocoa and honey in a blender until the mass is smooth. Pour into a pan.", "Blend the cottage cheese, yogurt, eggs, cocoa and honey until smooth. Pour the batter into the prepared springform pan."],
      ["Bake on a medium level for approximately 35–45 minutes. Check the cake for the first time at 35 minutes. The edges should be set and the center should still vibrate a little when moving the pan. Use a thermometer to make sure the center has reached 71°C.", "Bake on the middle rack for about 35–45 minutes. Check the cake at 35 minutes. The edges should be set and the centre should still wobble slightly when you gently move the pan. Check with a thermometer that the centre has reached 71 °C."],
      ["Preheat the oven to 160 °C with constant heat.", "Preheat the oven to 160 °C using top and bottom heat."]
    ]
  },
  "suklaa-raejuustokakku/sv": {
    "description": "Mixa keso och grekisk yoghurt till en slät smet. Kakao ger kakan utan botten chokladsmak och honung rundar av kakaons beska. Kakan går lättare att skära när den är kylskåpskall.",
    "method": [
      ["Mixa keso, yoghurt, ägg, kakao och honung i en mixer tills massan är slät. Häll i en kastrull.", "Mixa keso, yoghurt, ägg, kakao och honung till en slät smet. Häll smeten i den förberedda springformen."],
      ["Grädda på medelhög nivå i cirka 35–45 minuter. Kontrollera kakan första gången vid 35 minuter. Kanterna ska vara ställda och mitten ska fortfarande vibrera lite när man flyttar pannan. Använd en termometer för att kontrollera att mitten har nått 71°C.", "Grädda mitt i ugnen i cirka 35–45 minuter. Kontrollera kakan efter 35 minuter. Kanterna ska ha stelnat medan mitten fortfarande ska dallra lite när du försiktigt rör på formen. Kontrollera med termometer att mitten har nått 71 °C."],
      ["Låt kakan svalna i formen på galler i ca 30 minuter. Lägg i kylen i minst 4 timmar. Ta bort från pannan när den är kall och skär i fyra bitar.", "Låt kakan svalna i formen på galler i cirka 30 minuter. Ställ den i kylskåp i minst 4 timmar. Lossa den kalla kakan från formen och skär den i fyra bitar."],
      ["Värm ugnen till 160 °C med konstant värme.", "Värm ugnen till 160 °C med över- och undervärme."]
    ]
  },
  "suklaa-raejuustokakku/th": {
    "description": "ปั่นคอตเทจชีสกับกรีกโยเกิร์ตให้เนียนเป็นเนื้อเค้ก เค้กสูตรนี้ไม่มีฐาน โกโก้ให้รสช็อกโกแลต ส่วนน้ำผึ้งช่วยให้รสขมกลมกล่อมขึ้น แช่เย็นก่อนตัด เค้กจะเป็นชิ้นสวย",
    "method": [
      ["เปิดเตาอบที่ 160 °C ด้วยไฟบน–ล่าง วางด้านล่างของถาดสปริงฟอร์มขนาด 16 ซม. ด้วยกระดาษรองอบ", "เปิดเตาอบที่ 160 °C ใช้ไฟบน–ล่าง ปูกระดาษรองอบที่ก้นพิมพ์ถอดก้นขนาด 16 ซม."],
      ["บดคอทเทจชีส โยเกิร์ต ไข่ โกโก้ และน้ำผึ้งในเครื่องปั่นจนเป็นเนื้อเดียวกัน เทลงในกระทะ", "ปั่นคอตเทจชีส โยเกิร์ต ไข่ โกโก้ และน้ำผึ้งจนเนียน แล้วเทส่วนผสมลงในพิมพ์ถอดก้นที่เตรียมไว้"],
      ["อบในระดับปานกลางประมาณ 35–45 นาที ตรวจสอบเค้กครั้งแรกที่ 35 นาที ควรตั้งขอบไว้และตรงกลางควรสั่นเล็กน้อยเมื่อเคลื่อนย้ายกระทะ ใช้เทอร์โมมิเตอร์เพื่อให้แน่ใจว่าตรงกลางมีอุณหภูมิถึง 71°C", "อบที่ชั้นกลางประมาณ 35–45 นาที ตรวจดูครั้งแรกเมื่อครบ 35 นาที ขอบเค้กควรอยู่ตัว ส่วนตรงกลางยังสั่นเล็กน้อยเมื่อขยับพิมพ์เบา ๆ ใช้เทอร์โมมิเตอร์ตรวจว่าอุณหภูมิตรงกลางถึง 71 °C"],
      ["ปล่อยให้เค้กเย็นในกระทะบนตะแกรงประมาณ 30 นาที ถ่ายโอนไปยังตู้เย็นเป็นเวลาอย่างน้อย 4 ชั่วโมง นำออกจากพิมพ์เมื่อเย็นแล้วตัดเป็นสี่ชิ้น", "พักเค้กไว้ในพิมพ์บนตะแกรงประมาณ 30 นาที แล้วแช่ตู้เย็นอย่างน้อย 4 ชั่วโมง เมื่อเค้กเย็นแล้วนำออกจากพิมพ์และตัดเป็นสี่ชิ้น"]
    ]
  },
  "tomaatti-kananmuna-wokki/en": {
    "description": "Soft scrambled eggs and tomatoes are tossed with soy sauce. Serve with spring onions and freshly cooked jasmine rice.",
    "method": [
      ["Cook 150 g dry rice in a ricecooker as described above.", "Measure 150 g of dry SunRice Jasmine Fragrant rice for three servings. Use dry rice from a bag, not ready-to-microwave rice. Cook in a rice cooker with the amount of water specified on the packet. Serve the whole batch immediately while hot."]
    ]
  },
  "tomaatti-kananmuna-wokki/fi": {
    "description": "Pehmeä munakokkeli käännellään pannulla tomaattien ja soijakastikkeen joukkoon. Tarjoa tomaatti-kananmunawokki kevätsipulin ja juuri keitetyn jasmiiniriisin kanssa.",
    "method": [
      ["Valmista 150 g kuivaa riisiä riisinkeittimessä yllä olevan ohjeen mukaan.", "Mittaa 150 g kuivaa SunRice Jasmine Fragrant -jasmiiniriisiä kolmeksi annokseksi. Käytä kuivaa pussiriisiä, älä mikrovalmista riisiä. Keitä riisinkeittimessä pakkauksen vesimäärällä. Tarjoa koko erä heti kuumana ruoan kanssa."]
    ]
  },
  "tomaatti-kananmuna-wokki/sv": {
    "description": "Vänd ner mjuk äggröra i stekta tomater och smaksätt med soja. Servera med salladslök och nykokt jasminris.",
    "method": [
      ["Koka 150 g torrt ris i riskokare enligt beskrivningen ovan.", "Mät upp 150 g torrt SunRice Jasmine Fragrant-jasminris till tre portioner. Använd torrt ris från påse, inte färdigt mikroris. Koka i riskokare med den mängd vatten som står på förpackningen. Servera hela satsen genast medan riset är varmt."]
    ]
  },
  "tomaatti-kananmuna-wokki/th": {
    "description": "ผัดมะเขือเทศกับไข่คนเนื้อนุ่มแล้วปรุงด้วยซีอิ๊ว โรยต้นหอมและเสิร์ฟกับข้าวหอมมะลิหุงใหม่",
    "method": [
      ["หุงข้าวสาร 150 กรัมในหม้อหุงข้าวตามคำแนะนำด้านบน", "ตวงข้าวหอมมะลิ SunRice Jasmine Fragrant แบบแห้ง 150 กรัมสำหรับสามที่ ใช้ข้าวสารแบบถุงและหลีกเลี่ยงข้าวสำเร็จรูปสำหรับไมโครเวฟ หุงในหม้อหุงข้าวโดยใช้น้ำตามปริมาณที่ระบุบนถุง เสิร์ฟข้าวทั้งหม้อทันทีขณะยังร้อน"]
    ]
  },
  "munakasmuffinit/fi": {
    method: [
      ["Jaa seos vuokiin ja paista", "Jaa seos tasaisesti vuokiin ja paista"],
      ["Anna muffinien levätä viisi minuuttia ennen tarjoilua.", "Anna muffinien levätä viisi minuuttia. Perusohjeesta tulee kuusi muffinssia. Yksi annos on kaksi muffinssia."],
    ],
  },
  "munakasmuffinit/en": {
    method: [
      ["Divide among the six cups and bake", "Divide evenly among the six cups and bake"],
      ["Let the muffins rest for five minutes before serving.", "Let the muffins rest for five minutes. The base batch makes six muffins, two per serving."],
    ],
  },
  "munakasmuffinit/sv": {
    method: [
      ["Fördela smeten i de sex formarna och grädda", "Fördela smeten jämnt i de sex formarna och grädda"],
      ["Låt muffinsarna vila i fem minuter före servering.", "Låt muffinsarna vila i fem minuter. Grundreceptet ger sex muffins, två per portion."],
    ],
  },
  "munakasmuffinit/th": {
    method: [
      ["แบ่งส่วนผสมใส่พิมพ์ทั้ง 6 หลุม อบ", "แบ่งส่วนผสมเท่า ๆ กันใส่พิมพ์ทั้ง 6 หลุม แล้วอบ"],
      ["พักมัฟฟินไว้ 5 นาทีก่อนเสิร์ฟ", "พักมัฟฟินไว้ 5 นาที สูตรตั้งต้นได้มัฟฟิน 6 ชิ้น เสิร์ฟที่ละ 2 ชิ้น"],
    ],
  },
  "tonnikalamunakkaat-uunissa/fi": {
    method: [
      ["Jaa seos vuokiin.", "Jaa seos tasaisesti vuokiin."],
      ["Anna jäähtyä muutama minuutti ennen irrottamista.", "Anna jäähtyä muutama minuutti ennen irrottamista. Perusohjeesta tulee kuusi pientä munakasta. Yksi annos on kaksi pientä munakasta."],
    ],
  },
  "tonnikalamunakkaat-uunissa/en": {
    method: [
      ["Divide the mixture among the six cups.", "Divide the mixture evenly among the six cups."],
      ["Let cool for a few minutes before removing from the tin.", "Let cool for a few minutes before removing from the tin. The base batch makes six mini omelettes, two per serving."],
    ],
  },
  "tonnikalamunakkaat-uunissa/sv": {
    method: [
      ["Fördela smeten i de sex formarna.", "Fördela smeten jämnt i de sex formarna."],
      ["Låt svalna några minuter innan de tas ur formen.", "Låt svalna några minuter innan de tas ur formen. Grundreceptet ger sex små omeletter, två per portion."],
    ],
  },
  "tonnikalamunakkaat-uunissa/th": {
    method: [
      ["แบ่งส่วนผสมใส่พิมพ์ทั้ง 6 หลุม", "แบ่งส่วนผสมเท่า ๆ กันใส่พิมพ์ทั้ง 6 หลุม"],
      ["พักให้เย็นลงสองสามนาทีก่อนแกะออกจากพิมพ์", "พักให้เย็นลงสองสามนาทีก่อนแกะออกจากพิมพ์ สูตรตั้งต้นได้ไข่อบ 6 ชิ้น เสิร์ฟที่ละ 2 ชิ้น"],
    ],
  },
  "uunimuna-avokadot/fi": {
    method: [
      ["Koverra kuoppia hieman suuremmiksi lusikalla.", "Koverra kuoppia hieman suuremmiksi lusikalla. Säästä kaikki koverrettu hedelmäliha tarjoiluun."],
      ["Pirskota sitruunamehu ja lisää ruohosipuli juuri ennen tarjoilua.", "Jaa avokadot, koverrettu hedelmäliha ja kypsennetyt munat kahteen yhtä suureen annokseen. Ota mukaan myös erillisessä vuoassa kypsennetty muna. Viimeistele sitruunamehulla ja ruohosipulilla."],
    ],
  },
  "vhh-lihamureke/fi": {
    method: [
      ["Anna vetäytyä 10 minuuttia ennen viipalointia.", "Anna vetäytyä 10 minuuttia ennen viipalointia. Jaa koko mureke ja paistoneste kuuteen yhtä suureen annokseen."],
    ],
  },
  "vhh-lihamureke/en": {
    method: [
      ["rest for 10 minutes and divide into 6 portions.", "then rest for 10 minutes. Divide the meatloaf and all the cooking juices into six equal portions."],
    ],
  },
  "vhh-lihamureke/sv": {
    method: [
      ["låt vila 10 minuter och dela i 6 portioner.", "låt vila i 10 minuter. Fördela hela limpan och all steksky på sex lika stora portioner."],
    ],
  },
  "vhh-lihamureke/th": {
    method: [
      ["พัก 10 นาทีแล้วแบ่งเป็น 6 ส่วน", "พัก 10 นาที แล้วแบ่งมีตโลฟพร้อมน้ำจากการอบทั้งหมดเป็น 6 ส่วนเท่า ๆ กัน"],
    ],
  },
  "uuniporsas-kermakastikkeessa-vhh/fi": {
    "method": [
      ["Viipaloi porsas ja tarjoa kastikkeen kanssa.", "Viipaloi porsas. Jaa kaikki liha ja kastike kuuteen yhtä suureen annokseen."]
    ]
  },
  "vhh-kaalilaatikko/en": {
    "useSeoDescription": true,
    "nutritionBasis": "Use the exact ingredient compositions and edible weights listed. Keep all liquid, fat and spices in the dish. The salt quantity is unchanged from the original recipe."
  },
  "vhh-kaalilaatikko/sv": {
    "useSeoDescription": true,
    "nutritionBasis": "Använd ingredienslistans exakta sammansättningar och ätliga vikter. All vätska, allt fett och alla kryddor stannar i rätten. Saltmängden är oförändrad från originalreceptet."
  },
  "vhh-kaalilaatikko/th": {
    "useSeoDescription": true,
    "nutritionBasis": "ใช้ส่วนประกอบและน้ำหนักส่วนที่กินได้ตามรายการอย่างเคร่งครัด เก็บของเหลว ไขมัน และเครื่องเทศทั้งหมดไว้ในอาหาร ปริมาณเกลือคงเดิมตามสูตรต้นฉบับ"
  },
  "vhh-korvapuustit/fi": {
    "description": "Kauli mantelijauhotaikina, levitä sille kanelitäyte ja rullaa tutun muotoisiksi korvapuusteiksi. Taikina on vehnätaikinaa pehmeämpää ja käsitellään lämpimänä.",
    "ingredientItem": [
      ["mozzarellaraastetta,20.7%", "mozzarellaraastetta, 20,7 %"],
      ["maustamatonta tuorejuustoa,11%", "maustamatonta tuorejuustoa, 11 %"],
      ["Foodin100%erytritolia", "Foodin 100-prosenttista erytritolia"]
    ]
  },
  "vhh-letut/fi": {
    "ingredientItem": [
      ["maustamatonta tuorejuustoa,11%", "maustamatonta tuorejuustoa, 11 %"],
      ["kuohukermaa,38%", "kuohukermaa, 38 %"],
      ["Foodin100%erytritolia", "Foodin 100-prosenttista erytritolia"]
    ]
  },
  "vietnamilainen-chao-ga-kanapuuro/en": {
    "description": "Chicken cooks in soft jasmine rice porridge, giving it a savoury flavour. Shred the cooked chicken back into the pot and season this breakfast for two with grated ginger and spring onions."
  },
  "vietnamilainen-chao-ga-kanapuuro/fi": {
    "description": "Pehmeä jasmiiniriisipuuro saa makunsa puurossa kypsyvästä broilerista. Revi kypsä kana puuroon ja mausta kahden hengen aamiainen raastetulla inkiväärillä ja kevätsipulilla.",
    "title": "Cháo gà – vietnamilainen kanariisipuuro"
  },
  "vietnamilainen-chao-ga-kanapuuro/sv": {
    "description": "Kycklingen kokar i den mjuka jasminrisgröten och ger den smak. Riv ner den tillagade kycklingen i gröten och smaksätt med riven ingefära och salladslök. Servera till frukost för två."
  },
  "vietnamilainen-chao-ga-kanapuuro/th": {
    "description": "ต้มไก่ในโจ๊กข้าวหอมมะลิจนสุกเพื่อให้โจ๊กได้รสจากไก่ ฉีกเนื้อไก่ใส่กลับลงไป ปรุงด้วยขิงขูดและต้นหอม เป็นอาหารเช้าสำหรับสองที่"
  },
  "vietnamilainen-hu-tieu-aamiaiskeitto/en": {
    "description": "Pork loin strips and rice noodles cook in the same pot. Bean sprouts and fresh coriander finish this breakfast soup for two. Serve it with all the cooking liquid."
  },
  "vietnamilainen-hu-tieu-aamiaiskeitto/fi": {
    "description": "Riisinuudelit ja porsaan ulkofileesuikaleet kypsyvät samassa kattilassa. Pavunidut ja tuore korianteri viimeistelevät aamiaiskeiton kahdelle.",
    "title": "Hu tieu -riisinuudelikeitto porsaanlihalla"
  },
  "vietnamilainen-hu-tieu-aamiaiskeitto/sv": {
    "description": "Strimlat fläsk och risnudlar kokas i samma kastrull. Böngroddar och färsk koriander ger smak åt frukostsoppan för två. Servera med hela kokspadet."
  },
  "piparkakkulatte-hunajalla/en": {
    method: [["Vatkaa vielä hetki.", "Beat again briefly."]],
  },
  "vietnamilainen-hu-tieu-aamiaiskeitto/th": {
    "description": "ต้มหมูสันนอกหั่นเส้นและเส้นก๋วยเตี๋ยวในหม้อเดียวกัน เติมถั่วงอกกับผักชีสด เสิร์ฟเป็นอาหารเช้าสองที่พร้อมน้ำซุปทั้งหมด"
  },
  "valimerellinen-menemen-fetalla/fi": {
    nutritionBasis: "### Ravintoarvion laskentaperusta\n\nKahden annoksen arvio käyttää 150 g vuohenmaitofetaa, jossa on 25 % rasvaa ([Fineli 11211](https://fineli.fi/fineli/api/v1/foods/11211)), kahta kuoretonta kananmunaa (55 g/kpl), 125 g tomaattia, 170 g vihreää paprikaa ja 1 rkl eli 13,5 g paistoöljyä. Laskennassa koko öljymäärä sisältyy annoksiin. Fetan koostumus, kasvisten koko ja pannulle jäävä öljy voivat muuttaa arvoja. Nämä ovat laskennallisia arvioita, eivät valmiista ateriasta mitattuja ravintoarvoja.",
  },
  "valimerellinen-menemen-fetalla/en": {
    nutritionBasis: "### Nutrition estimate assumptions\n\nThe two-serving estimate uses 150 g of goat-milk feta with 25% fat ([Fineli 11211](https://fineli.fi/fineli/api/v1/foods/11211)), two shell-free eggs (55 g each), a 125 g tomato, a 170 g green bell pepper and 1 tbsp (13.5 g) of cooking oil. The calculation counts all the oil as part of the portions. Different feta, vegetable sizes or oil left in the pan will change the figures. These are calculated estimates, not measurements of the finished meal.",
  },
  "valimerellinen-menemen-fetalla/sv": {
    nutritionBasis: "### Antaganden för näringsberäkningen\n\nBeräkningen för två portioner utgår från 150 g feta av getmjölk med 25 % fett ([Fineli 11211](https://fineli.fi/fineli/api/v1/foods/11211)), två ägg utan skal (55 g per ägg), 125 g tomat, 170 g grön paprika och 1 msk (13,5 g) matolja. Hela oljemängden räknas med i portionerna. Annan feta, andra grönsaksstorlekar eller olja som blir kvar i pannan förändrar värdena. Detta är beräknade uppskattningar, inte mätningar av den färdiga rätten.",
  },
  "valimerellinen-menemen-fetalla/th": {
    nutritionBasis: "### สมมติฐานในการคำนวณคุณค่าทางโภชนาการ\n\nค่าประมาณสำหรับ 2 ที่ใช้ชีสเฟตาจากนมแพะไขมัน 25% จำนวน 150 กรัม ([Fineli 11211](https://fineli.fi/fineli/api/v1/foods/11211)) ไข่ไก่ไม่รวมเปลือก 2 ฟอง ฟองละ 55 กรัม มะเขือเทศ 125 กรัม พริกหวานสีเขียว 170 กรัม และน้ำมันปรุงอาหาร 1 ช้อนโต๊ะ (13.5 กรัม) โดยนับน้ำมันทั้งหมดรวมในอาหาร หากเปลี่ยนชนิดเฟตา ขนาดผัก หรือมีน้ำมันเหลือในกระทะ ค่าจริงจะต่างออกไป ตัวเลขเหล่านี้เป็นค่าประมาณจากการคำนวณ ไม่ใช่ผลวัดอาหารที่ปรุงเสร็จแล้ว",
  },
  // #327 / Chat 5: replace generic bread/filling steps with the source-backed
  // thyme-sesame topping and exact dough/oil amounts; preserve sealed sources.
  "lahi-ita-manakish-zaatarilla/fi": {"description":"Jogurtista, vehnäjauhoista ja vedestä valmistetut ohuet pannuleivät viimeistellään kuivattua timjamia, seesamia ja oliiviöljyä sisältävällä za'atar-tyylisellä päällysteellä.","method":[["1. Sekoita jauhot, neste ja suola. Vaivaa pehmeäksi taikinaksi ja anna levätä 10 minuuttia. Jos reseptissä on valmis leipä tai taikina, siirry täyttöön.\n2. Jaa taikina osiin ja painele tai kauli ohuiksi leiviksi. Lisää taikinaan kuuluva täyte tai mausteöljy.\n3. Paista kuumalla pannulla molemmin puolin kypsäksi ja nosta liinan alle pysymään pehmeänä.\n4. Sekoita vehnäjauho, jogurtti ja vesi pehmeäksi taikinaksi. Jaa kahdeksi litteäksi leiväksi. Sekoita oliiviöljy, kuivattu timjami ja seesaminsiemenet ja levitä leipien päälle. Paista kuumalla pannulla tai uunissa, kunnes reunat ovat kypsiä.","1. Sekoita 150 g vehnäjauhoja, 100 g jogurttia ja 40 ml vettä sekä pieni määrä luettelon suolaa. Vaivaa vain sen verran, että taikina on tasainen ja muotoiltava. Peitä ja anna levätä noin 5 minuuttia.\n2. Sekoita kulhossa 1 rkl oliiviöljyä, 2 g kuivattua timjamia ja 3 g seesaminsiemeniä. Tämä on leipien za'atar-tyylinen päällys, ei taikinan sisään tuleva täyte.\n3. Jaa taikina kahteen osaan ja painele ne ohuiksi, tasapaksuiksi leiviksi. Levitä koko mausteseos leipien pinnalle. Kuumenna paksupohjainen pannu keskilämmölle ja käytä paistamiseen yhteensä vain ainesluettelon 1 rkl neutraalia paistoöljyä.\n4. Paista leivät yksi kerrallaan, tarvittaessa kannen alla, kunnes molemmat puolet ovat saaneet väriä eikä sisällä ole raakaa jauhoista taikinaa. Tarjoile lämpiminä kahtena annoksena."]]},
  "valimerellinen-pinaatti-fetashakshuka/fi": {
    nutritionBasis: "### Ravintoarvion laskentaperusta\n\nKahden annoksen arvio käyttää 150 g vuohenmaitofetaa, jossa on 25 % rasvaa ([Fineli 11211](https://fineli.fi/fineli/api/v1/foods/11211)), kahta kuoretonta kananmunaa (55 g/kpl), 125 g tomaattia, 100 g raakaa täysikasvuista pinaattia (AFCD F008761) ja 1 rkl eli 13,5 g paistoöljyä. Koko öljymäärä lasketaan syödyksi. Tuotevalinta ja mahdollinen pannulle jäävä öljy muuttavat arviota. GK:n historiallinen pinaattitietue on eri kuin ravintolaskennan; GK on erillinen rajattu arvio eikä tämän ravintoarvotaulukon täsmällinen uudelleenlasku.",
  },
  "valimerellinen-pinaatti-fetashakshuka/en": {
    nutritionBasis: "### Nutrition estimate assumptions\n\nThe two-serving estimate uses 150 g of goat-milk feta with 25% fat ([Fineli 11211](https://fineli.fi/fineli/api/v1/foods/11211)), two shell-free eggs (55 g each), a 125 g tomato, 100 g raw mature spinach (AFCD F008761) and 1 tbsp (13.5 g) cooking oil. All the oil is counted as eaten. Your product choices and oil left in the pan affect the result. The historical glycemic-load estimate used a different spinach record; it is a separate, scoped estimate, not an exact recalculation of this nutrition panel.",
  },
  "valimerellinen-pinaatti-fetashakshuka/sv": {
    nutritionBasis: "### Antaganden för näringsberäkningen\n\nBeräkningen för två portioner utgår från 150 g feta av getmjölk med 25 % fett ([Fineli 11211](https://fineli.fi/fineli/api/v1/foods/11211)), två ägg utan skal (55 g per ägg), 125 g tomat, 100 g rå mogen spenat (AFCD F008761) och 1 msk (13,5 g) matolja. All olja räknas som uppäten. Val av produkt och olja som blir kvar i pannan påverkar resultatet. Den historiska uppskattningen av glykemisk belastning använde en annan spenatpost; det är en separat avgränsad uppskattning och inte en exakt omräkning av dessa näringsvärden.",
  },
  "valimerellinen-pinaatti-fetashakshuka/th": {
    nutritionBasis: "### สมมติฐานในการคำนวณคุณค่าทางโภชนาการ\n\nค่าประมาณสำหรับ 2 ที่ใช้ชีสเฟตาจากนมแพะไขมัน 25% จำนวน 150 กรัม ([Fineli 11211](https://fineli.fi/fineli/api/v1/foods/11211)) ไข่ไก่ไม่รวมเปลือก 2 ฟอง ฟองละ 55 กรัม มะเขือเทศ 125 กรัม ผักโขมใบโตดิบ 100 กรัม (AFCD F008761) และน้ำมันปรุงอาหาร 1 ช้อนโต๊ะ (13.5 กรัม) โดยนับน้ำมันทั้งหมดว่าถูกบริโภค ชนิดผลิตภัณฑ์ที่ใช้และน้ำมันที่เหลือในกระทะทำให้ค่าจริงเปลี่ยนไป ส่วนการประมาณภาระน้ำตาล (GK) เดิมใช้ข้อมูลผักโขมคนละรายการ จึงเป็นการประมาณแบบแยกต่างหาก ไม่ใช่การคำนวณตัวเลขในตารางโภชนาการนี้ซ้ำอย่างตรงกัน",
  },
  // #327 / Chat 5: the FI source's generic bread-dough steps are incorrect for ready-made toast.
  // The three existing translated versions contain the safe cooked-egg-specific method.
  "malesialainen-kaya-paahtoleipa/fi": {"description":"Paahdettua hapanjuurileipää, jonka päällä on kookosmaidosta, kananmunasta ja sokerista valmistettu kaya-tahna sekä voi. Toinen kananmuna paistetaan tarjolle ja jaetaan kahteen annokseen.","method":[["1. Sekoita jauhot, neste ja suola. Vaivaa pehmeäksi taikinaksi ja anna levätä 10 minuuttia. Jos reseptissä on valmis leipä tai taikina, siirry täyttöön.\n2. Jaa taikina osiin ja painele tai kauli ohuiksi leiviksi. Lisää taikinaan kuuluva täyte tai mausteöljy.\n3. Paista kuumalla pannulla molemmin puolin kypsäksi ja nosta liinan alle pysymään pehmeänä.\n4. Vatkaa yksi kananmuna, kookosmaito ja sokeri. Kuumenna seosta varovasti vesihauteessa jatkuvasti sekoittaen, kunnes se sakenee hilloksi. Paahda hapanjuurileipä ja voitele ohuesti voilla. Levitä päälle mitattu määrä kotitekoista kaya-hilloa ja tarjoa toisen kananmunan kanssa.","1. Mittaa kuumuutta kestävään kulhoon 100 ml kookosmaitoa ja 20 g sokeria. Vatkaa joukkoon yksi ainesluettelon kahdesta kananmunasta. Aseta kulho hiljalleen kiehuvan vesihauteen ylle niin, ettei pohja kosketa vettä.\n2. Sekoita kaya-seosta vesihauteessa koko ajan, kunnes se on tasaista, paksua ja kauttaaltaan kypsää. Varmista elintarvikelämpömittarilla, että seos kuumenee kauttaaltaan vähintään 71 °C:seen. Sekoita varovasti, ettei seos juoksetu.\n3. Paahda kaikki 100 g valmista hapanjuurileipää molemmin puolin. Levitä leiville yhteensä 10 g voita ja jaa koko valmistettu kaya-tahna tasaisesti leiville.\n4. Paista toinen kananmuna ainesluettelon 1 rkl:ssa neutraalia paistoöljyä, kunnes sekä valkuainen että keltuainen ovat hyytyneet. Jaa leivät ja lämmin kananmuna kahteen annokseen. Käytä vain luettelon suolaa tarvittaessa."]]},
};

export function reviewedRecipeCopy(id: string, locale: RecipeLocale): ReviewedRecipeCopy | undefined {
  return reviewedCopy[id + "/" + locale];
}

export function applyCopyEdits(text: string, edits: CopyEdits = []): string {
  return edits.reduce((current, [before, after]) => current.replaceAll(before, after), text);
}

export function applyReviewedGramListSpacing(text: string, edits: CopyEdits = []): string {
  const spacing = edits.filter(([before, after]) =>
    before.replace(/(?<=\p{L}),(?=\d+(?:,\d+)?[ \t]+g\b)/gu, ", ") === after);
  return spacing.reduce((current, [before, after]) => current.replaceAll(before, () => after), text);
}

const imageNotes = {
  en: ["- The image is a perception image made with artificial intelligence.", "- AI-generated illustration."],
  sv: ["- Bilden är en perceptionsbild gjord med artificiell intelligens.", "- AI-genererad illustration."],
  th: ["- ภาพนี้เป็นภาพการรับรู้ที่สร้างขึ้นด้วยปัญญาประดิษฐ์", "- ภาพประกอบที่สร้างด้วย AI"],
} as const;

export function reviewedImageNote(notes: string, locale: RecipeLocale): string {
  if (locale === "fi") return notes;
  const [before, after] = imageNotes[locale];
  return notes.split("\n").map(line => line.trim() === before ? after : line).join("\n");
}

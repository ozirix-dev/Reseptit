import { createHash } from "node:crypto";

// Reconstruct the approved recipe snapshot after reviewed note and locale metadata edits.
const approvedNoteEdits: Readonly<Record<string, readonly [string, string]>> = {
  "reseptit/jalkiruoat/keto-mutakakku.md": [
    "Paistoaika vaikuttaa keskuksen pehmeyteen. Käytä makeuttamatonta suklaata ja tarkista tuotteen hiilihydraattimäärä.",
    "Paistoaika vaikuttaa keskuksen pehmeyteen. Käytä sokeritonta suklaata ja tarkista tuotteen hiilihydraattimäärä.",
  ],
  "reseptit/jalkiruoat/keto-suklaakeksit.md": [
    "Keksit ovat pehmeitä kuumana ja kovettuvat jäähtyessään. Makeuttamattoman suklaan maku ja hiilihydraatit vaihtelevat tuotteittain.",
    "Keksit ovat pehmeitä kuumana ja kovettuvat jäähtyessään. Sokerittoman suklaan maku ja hiilihydraatit vaihtelevat tuotteittain.",
  ],
};

const englishPublicationSources = new Set([
  "reseptit/jalkiruoat/keto-mutakakku.md",
  "reseptit/jalkiruoat/keto-suklaakeksit.md",
  "reseptit/jalkiruoat/meheva-suklaakakku.md",
]);

// These entries contain reviewed editorial corrections only. Reconstruct the sealed
// versions for GK verification; the exact current hash is required before any
// inverse edit. Other changes must go through the normal snapshot review.
const editorialSnapshots: Readonly<Record<string, {
  currentSha256: string;
  inverseEdits: ReadonlyArray<readonly [start: number, count: number, historical: string]>;
}>> = {
  "reseptit/aamupalat/japanilainen-dashimaki-tamago-aamiaislautasella.md": {
    currentSha256: "2c1550984e2d193fb0a460ed5dde549b7ae94245b474a5c8ec98216548d3ef1f",
    inverseEdits: [[0, 60, "---\ntitle: \"Dashimaki tamago aamiaislautasella\"\nrecipe_id: japanilainen-dashimaki-tamago-aamiaislautasella\nurl_slug: japanilainen-dashimaki-tamago-aamiaislautasella\ncategory: aamupala\nlanguage: fi\nstatus: published\nmain_ingredient:\n  - \"kananmuna\"\n  - \"dashi\"\n  - \"soijakastike\"\ncooking_method:\n  - \"paistaminen\"\ningredients:\n  - amount: 2\n    unit: \"kpl\"\n    item: \"kananmuna\"\n  - amount: 200\n    unit: \"ml\"\n    item: \"dashi\"\n  - amount: 1\n    unit: \"rkl\"\n    item: \"soijakastike\"\n  - amount: 100\n    unit: \"g\"\n    item: \"riisi\"\n  - amount: 1\n    unit: \"rkl\"\n    item: \"neutraalia paistoöljyä\"\n  - amount: null\n    unit: \"\"\n    item: \"suolaa maun mukaan\"\nservings: 2\ntime_total_min: 25\ndifficulty: Helppo\ntags:\n  - \"aamupala\"\n  - \"japanilainen\"\n  - \"kananmuna\"\nimage:\n  src: aamupalat/japanilainen-dashimaki-tamago-aamiaislautasella.webp\n  alt: \"Dashimaki tamago aamiaislautasella tarjoiltuna aamiaisella\"\n  width: 1536\n  height: 1024\n---\n\n# Dashimaki tamago aamiaislautasella\n\n## Kuvaus\n\nTässä kotikeittiöön sovitetussa ohjeessa valmistetaan dashimaki tamago aamiaislautasella. Mausteisuutta ja lisukkeita voi säätää oman maun mukaan.\n\n## Ainekset\n\nAinekset ovat annoslaskurin käytössä rakenteisista metatiedoista.\n\n## Valmistus\n\n1. Vatkaa kananmunat dashi-liemen kanssa. Mausta soijakastikkeella.\n2. Kuumenna pieni paistinpannu miedolla lämmöllä ja sipaise siihen öljyä. Kaada pannulle ohut kerros munaseosta.\n3. Kun pohja alkaa hyytyä, rullaa munakas pannun reunaan. Lisää pannulle uusi kerros seosta ja jatka rullaamista kerros kerrallaan.\n4. Paista maustettu munaseos ohuina kerroksina ja rullaa; tarjoa riisin kanssa.\n"]],
  },
  "reseptit/aamupalat/japanilainen-natto-riisikulho.md": {
    currentSha256: "dd33d40c6a885904359ea14d2fd7e3f94bbc6d1e249e7753a1a9f297ecbda03e",
    inverseEdits: [
      [51, 8, "1. Kypsennä riisi pakkauksen ohjeen mukaan. Paista tofu, muna tai muu lämmin täyte tarvittaessa erikseen.\n2. Paloittele tuoreet kasvikset ja valmistele yrtit sekä kastikkeen ainekset.\n3. Jaa lämmin pohja kulhoihin, asettele muut ainekset päälle ja lisää kastike juuri ennen tarjoamista.\n4. Sekoita natto mausteineen ja lusikoi kuuman riisin sekä pehmeän munan päälle.\n"],
      [47, 1, "Tässä kotikeittiöön sovitetussa ohjeessa valmistetaan natto-riisikulho pehmeällä munalla. Mausteisuutta ja lisukkeita voi säätää oman maun mukaan.\n\n## Ainekset\n\nAinekset ovat annoslaskurin käytössä rakenteisista metatiedoista.\n"],
      [43, 1, "# Natto-riisikulho pehmeällä munalla\n"],
      [37, 2, "  src: aamupalat/japanilainen-natto-riisikulho.webp\n  alt: \"Natto-riisikulho pehmeällä munalla tarjoiltuna aamiaisella\"\n"],
      [33, 3, "  - \"aamupala\"\n  - \"japanilainen\"\n  - \"aamiaisruoka\"\n"],
      [28, 1, "    item: \"suolaa maun mukaan\"\n"],
      [24, 2, "    unit: \"rkl\"\n    item: \"kevätsipuli\"\n"],
      [21, 2, "    unit: \"kpl\"\n    item: \"kananmuna\"\n"],
      [18, 2, "    unit: \"g\"\n    item: \"riisi\"\n"],
      [15, 2, "    unit: \"g\"\n    item: \"natto\"\n"],
      [12, 1, "  - \"paistaminen\"\n"],
      [8, 3, "  - \"natto\"\n  - \"riisi\"\n  - \"kananmuna\"\n"],
      [1, 1, "title: \"Natto-riisikulho pehmeällä munalla\"\n"],
    ],
  },
  "kaannokset/en/paaruoat/baozi.md": {
    currentSha256: "e5eae99171166ac81cf07fd5866ebb5649524fa4da3d1f783406a50d83f6934c",
    inverseEdits: [
      [84, 1, "5. Rise for 15 minutes and steam in batches for 12–15 minutes. Turn off the heat and wait 3 minutes before opening the lid.\n"],
      [81, 1, "2. Squeeze the liquid from the cabbage. Mix the cabbage, minced meat, spring onion, soy sauce, sesame oil, ginger and cornstarch.\n"],
    ],
  },
  "kaannokset/en/paaruoat/congee-riisipuuro.md": {
    currentSha256: "a612619f4c425adae78299a113964080d29d52dd590eca17fa66bc1a96bd3ed7",
    inverseEdits: [
      [75, 1, "4. Divide the porridge into bowls. Add spring onions, soy sauce and sesame oil. Serve with an egg if desired.\n"],
      [73, 1, "2. Put the rice, water or stock and salt in the pot. Bring to a boil and cook on very low heat in the crack of the lid for about 60 minutes. Stir occasionally.\n"],
    ],
  },
  "kaannokset/en/paaruoat/janssoninkiusaus-juuriselleri.md": {
    currentSha256: "a2c2f2daf62a4fc87e76c032fc352a35738e6099429ee405e78cac55c2cf45e4",
    inverseEdits: [
      [64, 1, "2. Layer the celeriac, onion and 125 g drained European anchovy fillets in oil in the dish. Add 250 g 38%-fat cream,100 g 3.5%-fat whole milk,0.5 g black pepper and the remaining butter in pieces.\n"],
      [28, 1, "  item: whole milk,3.5% fat\n"],
      [25, 1, "  item: double cream,38% fat\n"],
    ],
  },
  "kaannokset/sv/alkuruoat/caponata.md": {
    currentSha256: "8b4d99962d96b045e82cf661c649dcbadea5cab8070c64e28538e31210c4af8c",
    inverseEdits: [
      [72, 1, "1. Tärna 800 g aubergine, 55 g lök och 80 g stjälkselleri. Mjukna under lock i hela mängden 27 g olivolja.\n"],
    ],
  },
  "kaannokset/sv/paaruoat/baozi.md": {
    currentSha256: "6b76bd87fc6730763e145d473b7567dcf38e4143f85e3f24485d6f77ae68990b",
    inverseEdits: [
      [84, 1, "5. Låt jäsa i 15 minuter och ånga i omgångar i 12–15 minuter. Stäng av värmen och vänta 3 minuter innan du öppnar locket.\n"],
      [81, 2, "2. Krama ur vätskan från kålen. Blanda kål, köttfärs, vårlök, sojasås, sesamolja, ingefära och majsstärkelse.\n3. Dela degen i 12 delar och rulla till bollar. Rulla var och en till en skiva så att mitten blir något tjockare.\n"],
    ],
  },
  "kaannokset/sv/paaruoat/congee-riisipuuro.md": {
    currentSha256: "d0222ebd8a09f53e0b6dc01d93ac72bdd44fa2ccf444d2d973be0bda7841ec73",
    inverseEdits: [
      [75, 1, "4. Dela gröten i skålar. Tillsätt vårlök, soja och sesamolja. Servera med ett ägg om så önskas.\n"],
      [73, 1, "2. Lägg riset, vattnet eller fonden och salt i grytan. Koka upp och koka på mycket låg värme i lockets springa i ca 60 minuter. Rör om då och då.\n"],
    ],
  },
  "kaannokset/sv/paaruoat/janssoninkiusaus-juuriselleri.md": {
    currentSha256: "61339c23fecc52b5a0945480dfc0a157acf10e0b43e414c284cedade77759ed7",
    inverseEdits: [
      [64, 1, "2. Varva rotselleri,lök och 125 g avrunna europeiska sardellfiléer i olja i formen. Tillsätt 250 g vispgrädde med38% fett,100 g helmjölk med3,5% fett,0,5 g svartpeppar och resten av smöret i klickar.\n"],
      [28, 1, "  item: helmjölk,3,5% fett\n"],
      [25, 1, "  item: vispgrädde,38% fett\n"],
    ],
  },
  "kaannokset/th/paaruoat/baozi.md": {
    currentSha256: "b52643527358a97c05c0d4b920d8a873efae194891c8625c0f94852ef0900054",
    inverseEdits: [
      [88, 1, "- อย่าเติมหม้อนึ่งให้เต็มเกินไป เพราะม้วนจะโตขึ้นขณะปรุง\n"],
      [80, 5, "1. ผสมน้ำอุ่น ยีสต์ และน้ำตาลเข้าด้วยกัน ให้ยืนเป็นเวลา 5 นาที เพิ่มแป้งและนวดเป็นแป้งยืดหยุ่น ปิดฝาและพักไว้ 45 นาที\n2. บีบของเหลวออกจากกะหล่ำปลี ผสมกะหล่ำปลี เนื้อสับ ต้นหอม ซีอิ๊ว น้ำมันงา ขิง และแป้งข้าวโพด\n3. แบ่งแป้งออกเป็น 12 ส่วนแล้วปั้นเป็นก้อนกลม ม้วนแต่ละอันลงในดิสก์เพื่อให้ตรงกลางหนาขึ้นเล็กน้อย\n4. ใส่ไส้ตรงกลางแล้วพับขอบให้เป็นขนมปัง วางบนกระดาษรองอบสี่เหลี่ยม\n5. พักไว้ 15 นาที และนึ่งเป็นชุดประมาณ 12-15 นาที ปิดไฟและรอ 3 นาทีก่อนเปิดฝา\n"],
      [76, 1, "ซอฟท์โรลที่ทำจากแป้งยีสต์สอดไส้หมูฉ่ำ กะหล่ำปลี และต้นหอม\n"],
      [72, 1, "ซอฟท์โรลที่ทำจากแป้งยีสต์สอดไส้หมูฉ่ำ กะหล่ำปลี และต้นหอม\n"],
      [21, 1, "  alt: ซาลาเปานึ่งเปาซี ซึ่งหนึ่งในนั้นถูกแยกออกและมองเห็นไส้ได้\n"],
    ],
  },
  "kaannokset/th/paaruoat/chettinad-kana.md": {
    currentSha256: "bfc5e5424de397d2440cebae3c44aa3fe12daecbbc8af31a44b331bc6d314bd3",
    inverseEdits: [
      [98, 1, "- ปรับปริมาณพริกไทยดำหากต้องการซอสที่นุ่มนวลขึ้น\n"],
      [91, 3, "3. ใส่ไก่และเป็นสีน้ำตาลอ่อนทุกด้าน\n4. ผสมส่วนผสมเครื่องเทศและใบแกงลงไป เพิ่มมะเขือเทศและเกลือ\n5. เทน้ำลงไป ปิดฝาและเคี่ยวประมาณ 25-30 นาที จนไก่สุกและซอสข้น\n"],
      [85, 1, "ไก่เชตตินัดของรัฐทมิฬนาฑูขึ้นชื่อในเรื่องเครื่องเทศทั้งตัวย่าง พริกไทยดำ และซอสมะเขือเทศเข้มข้น\n"],
      [81, 1, "ไก่เชตตินัดของรัฐทมิฬนาฑูขึ้นชื่อในเรื่องเครื่องเทศทั้งตัวย่าง พริกไทยดำ และซอสมะเขือเทศเข้มข้น\n"],
      [79, 1, "# ไก่ Chettinad กับเครื่องเทศย่าง\n"],
      [61, 2, "    item: ใบแกงสด\n    note: ไม่จำเป็น\n"],
      [22, 1, "  alt: ไก่เชตตินาดในซอสเครื่องเทศเข้มคั่วพร้อมใบแกง\n"],
      [1, 1, "title: ไก่ Chettinad กับเครื่องเทศย่าง\n"],
    ],
  },
  "kaannokset/th/paaruoat/congee-riisipuuro.md": {
    currentSha256: "5d169682cb09779ab68842dfe37dea1b3681d9ab47e4d81e6cd6b55f1609eea5",
    inverseEdits: [
      [73, 3, "2. ใส่ข้าว น้ำหรือน้ำสต๊อก และเกลือลงในหม้อ นำไปต้มและปรุงด้วยไฟอ่อนมากในรอยแตกของฝาประมาณ 60 นาที ผัดเป็นครั้งคราว\n3. เมื่อข้าวแตกเป็นโจ๊กเนื้อนุ่ม ใส่ขิงลงไปผัดต่ออีก 5 นาที\n4. แบ่งโจ๊กออกเป็นชาม ใส่ต้นหอม ซีอิ๊ว และน้ำมันงา เสิร์ฟพร้อมไข่หากต้องการ\n"],
    ],
  },
  "kaannokset/th/paaruoat/janssoninkiusaus-juuriselleri.md": {
    currentSha256: "92a1429ed2e3b0310d929cd5bed41de3cb43e9cd8e5e16930805fcb28a415ad3",
    inverseEdits: [
      [63, 3, "1. อุ่นเตาอบที่200 °C หั่นเซเลอรีแอคปอกเปลือก700 กรัมและหัวหอม55 กรัมเป็นเส้น ทาถาดด้วยเนยส่วนหนึ่งจากทั้งหมด28 กรัม\n2. เรียงเซเลอรีแอค หัวหอมและปลาแอนโชวียุโรปในน้ำมันที่สะเด็ดแล้ว125 กรัมในถาด ใส่ครีมไขมัน38% 250 กรัม นมไขมัน3.5% 100 กรัม พริกไทยดำ0.5 กรัมและเนยที่เหลือเป็นชิ้น\n3. อบ 50–60 นาทีจนเซเลอรีแอคนุ่ม พัก 10 นาที ใส่ผักชีลาว8 กรัม แบ่งอาหารและน้ำในถาดทั้งหมดเป็นสี่ที่\n"],
      [28, 1, "  item: นมไขมันเต็ม3.5%\n"],
      [25, 1, "  item: ครีมไขมัน38%\n"],
    ],
  },
  "reseptit/paaruoat/baozi.md": {
    currentSha256: "ea030b320459bf4f52b89cc822f032c691d39a35f987d05b66bb7a274cac02e4",
    inverseEdits: [
      [86, 1, "5. Kohota 15 minuuttia ja höyrytä erissä 12–15 minuuttia. Sammuta lämpö ja odota 3 minuuttia ennen kannen avaamista.\n"],
    ],
  },
  "reseptit/paaruoat/congee-riisipuuro.md": {
    currentSha256: "e101880277a5f061115291cca696943b48d351ffe814e77cf5072b2a7151984a",
    inverseEdits: [
      [78, 1, "4. Jaa puuro kulhoihin. Lisää kevätsipulia, soijakastiketta ja seesamiöljyä. Tarjoa halutessasi kananmunan kanssa.\n"],
      [76, 1, "2. Laita riisi, vesi tai liemi ja suola kattilaan. Kiehauta ja keitä hyvin miedolla lämmöllä kannen raossa noin 60 minuuttia. Sekoita välillä.\n"],
    ],
  },
  "kaannokset/sv/paaruoat/kana-tagine-sitruunalla.md": {
    currentSha256: "eb12c7980f69684ab8a45eb9c2701e58db6e8b5a4382fae0360d6a372c7f91dc",
    inverseEdits: [
      [83, 1, "3. Lägg tillbaka kycklingen i grytan. Tillsätt skal av konserverad citron och kycklingfond. Täck över och låt sjuda på låg värme i ca 45 minuter.\n"],
    ],
  },
  "kaannokset/th/paaruoat/kana-tagine-sitruunalla.md": {
    currentSha256: "9d61684174c776e0f2846100874152ab79f5117c843930669b97c936b388921f",
    inverseEdits: [
      [85, 1, "5. ชิมเกลือแล้วปิดท้ายด้วยผักชี เสิร์ฟพร้อมคูสคูสหรือขนมปัง\n"],
      [81, 1, "1. ตั้งน้ำมันให้ร้อนในกระทะที่มีก้นหนา ทอดไก่ให้เหลืองทุกด้านแล้วพักไว้\n"],
    ],
  },
  "kaannokset/en/leivonnaiset/keto-korvapuustit.md": {
    currentSha256: "bbec9a4ee4f4111001cb0c75a8d6dc45890c7ab553e8ad304dce19b74a20f6d9",
    inverseEdits: [
      [65, 1, "2. Mix in almond flour and egg. Roll the dough between baking papers into a disk.\n"],
    ],
  },
  "kaannokset/sv/leivonnaiset/keto-korvapuustit.md": {
    currentSha256: "111ad9e5e82ae37b5de9df85da16b57dfd8da9f53c21a756d02dacbeb570c83c",
    inverseEdits: [
      [65, 1, "2. Blanda i mandelmjöl och ägg. Rulla ihop degen mellan bakplåtspapper till en skiva.\n"],
    ],
  },
  "kaannokset/th/leivonnaiset/keto-korvapuustit.md": {
    currentSha256: "5dfa9ac825ee531fdec74d11a54f71ba1d62e282660b928c07f1f8578e4d3ebd",
    inverseEdits: [
      [65, 1, "2. ผสมแป้งอัลมอนด์และไข่เข้าด้วยกัน ม้วนแป้งระหว่างกระดาษรองอบลงในดิสก์\n"],
    ],
  },
  "kaannokset/en/paaruoat/nakkikeitto-kukkakaalilla.md": {
    currentSha256: "a80234550b11e63504665b965f4a7f47517f17f5b989dacb09744be9fe1623da",
    inverseEdits: [
      [86, 1, "3. Add the cauliflower and cook for another 8 minutes until it is very soft.\n"],
    ],
  },
  "kaannokset/sv/paaruoat/nakkikeitto-kukkakaalilla.md": {
    currentSha256: "b07c4f32ab48ccfdb233ee20289b8737e2e1c547c0fccde646e1ca10dfb4f4be",
    inverseEdits: [
      [86, 1, "3. Tillsätt blomkålen och koka ytterligare 8 minuter tills den är väldigt mjuk.\n"],
    ],
  },
  "kaannokset/th/paaruoat/nakkikeitto-kukkakaalilla.md": {
    currentSha256: "04880bf3de02f307662b24ee9abf31552d67e005028ffb91d18eb74392fb764a",
    inverseEdits: [
      [85, 1, "2. ตั้งน้ำซุปเนื้อให้เดือด ใส่หัวหอม คื่นฉ่าย ต้นหอม ใบกระวาน และพริกไทยดำ ปรุงอาหารด้วยไฟอ่อนเป็นเวลา 5 นาที\n"],
    ],
  },
  "kaannokset/en/paaruoat/pad-kee-mao-vhh-konjac.md": {
    currentSha256: "cd2cf093bad55f99bd32e65a7165f4f7a58ebc9c0fc21b9af48c105fc2783304",
    inverseEdits: [
      [94, 2, "5. Add the noodles, chicken and sauce. Turn on the hot pan until everything is hot.\n6. Remove the pan from the stove and stir in the Thai basil. Offer now.\n"],
    ],
  },
  "kaannokset/sv/paaruoat/pad-kee-mao-vhh-konjac.md": {
    currentSha256: "888e0f9315c4cd48b212ae550a1f3d1895d740f25f4b087d043c8e4ee0b82740",
    inverseEdits: [
      [94, 2, "5. Tillsätt nudlarna, kycklingen och såsen. Slå på den varma pannan tills allt är varmt.\n6. Ta av kastrullen från spisen och rör ner thaibasilikan. Erbjud nu.\n"],
    ],
  },
  "kaannokset/th/paaruoat/pad-kee-mao-vhh-konjac.md": {
    currentSha256: "217d5b2c805f45200d074c6b0aea1ada1903e569b68cf74ccb31424f526db51b",
    inverseEdits: [
      [94, 2, "5. ใส่บะหมี่ ไก่ และซอส เปิดกระทะร้อนจนทุกอย่างร้อน\n6. นำกระทะออกจากเตาแล้วใส่ใบโหระพาลงไปผัด เสนอตอนนี้.\n"],
    ],
  },
  "reseptit/paaruoat/paella-valenciana.md": {
    currentSha256: "9a12394a5c2e7d556fc9216667a5b9bfffbe1124745f4cdad7c5db0df2dfa35c",
    inverseEdits: [
      [88, 1, "- Jos käytät vain broileria, valitse koipilihaa, joka pysyy mehevänä pitkän kypsennyksen ajan.\n"],
      [84, 1, "5. Kun riisi on kypsää ja neste imeytynyt, nosta pannu liedeltä. Peitä kevyesti ja anna vetäytyä 5 minuuttia.\n"],
      [80, 1, "1. Kuumenna öljy leveässä pannussa. Ruskista broileri ja jäniksenpalat kauttaaltaan.\n"],
      [76, 1, "Valencialaistyylisessä paellassa lyhytjyväinen riisi kypsyy pannulla sahramiliemessä kanan, jäniksen ja vihreiden papujen kanssa.\n"],
      [72, 1, "Valencialaistyylisessä paellassa lyhytjyväinen riisi kypsyy pannulla sahramiliemessä kanan, jäniksen ja vihreiden papujen kanssa.\n"],
      [70, 1, "# Valencialainen paella kanalla ja jäniksellä\n"],
    ],
  },
  "kaannokset/en/paaruoat/paella-valenciana.md": {
    currentSha256: "7aa2354d95f3110703089f1b95c3f5e51fa4c1fecbce7466b4ef3ba4bd0475fd",
    inverseEdits: [
      [83, 1, "5. Remove from heat when rice is tender and liquid is absorbed. Cover and rest for 5 minutes; remove rosemary before serving.\n"],
      [79, 1, "3. Add dry rice and hot broth with saffron. Season with salt and add the rosemary sprig.\n"],
    ],
  },
  "kaannokset/sv/paaruoat/paella-valenciana.md": {
    currentSha256: "a24d38e1c0a21ef5e56c2666ef8a3d9283e45004e5b832e9531886b8d90c1674",
    inverseEdits: [
      [83, 1, "5. Ta av från värmen när riset är mjukt och vätskan absorberad. Täck och vila i 5 minuter; ta bort rosmarinen före servering.\n"],
      [79, 1, "3. Tillsätt torrt ris och varm buljong med saffran. Salta och lägg i rosmarinkvisten.\n"],
    ],
  },
  "kaannokset/th/paaruoat/paella-valenciana.md": {
    currentSha256: "37185c6a21002288e3eddbbfa6da32e76998dac3772bd8956810af043ae6b12e",
    inverseEdits: [
      [83, 1, "5. ยกลงเมื่อข้าวนุ่มและน้ำแห้ง ปิดฝาพัก 5 นาที แล้วนำโรสแมรี่ออกก่อนเสิร์ฟ\n"],
      [79, 1, "3. ใส่ข้าวดิบและน้ำสต๊อกร้อนที่แช่หญ้าฝรั่น ปรุงเกลือและใส่กิ่งโรสแมรี่\n"],
    ],
  },
  "kaannokset/sv/paaruoat/palak-paneer.md": {
    currentSha256: "d94751a3f65f8d5a6a0b5bf28b3de8a1ab2c67d0881e2b0294d299c9bb43e804",
    inverseEdits: [
      [84, 1, "3. Bryn paneerkuberna i en panna i en matsked olja. Avsätta.\n"],
    ],
  },
  "kaannokset/th/paaruoat/palak-paneer.md": {
    currentSha256: "ec75ffb50073277a15803ee95e064c13881a43cf0ea5226dd39df017bd4e6872",
    inverseEdits: [
      [86, 1, "5. ใส่ผักโขมบด เกลือ และน้ำครึ่งเดซิลิตร หลนเป็นเวลา 8 นาที\n"],
      [82, 2, "1. ล้างผักขมและลวกในน้ำเดือดสักครู่ เย็นอย่างรวดเร็วและสะเด็ดน้ำ\n2. บดผักโขมให้เป็นน้ำซุปข้นหยาบ\n"],
    ],
  },
  "kaannokset/th/alkuruoat/paneer-tikka.md": {
    currentSha256: "b8e51f81ef02e9266a6bc85b3d52afb935052c9ee9e5c2f13e8b4315a8861179",
    inverseEdits: [
      [77, 1, "4. ย่างบนไฟร้อนปานกลาง หรืออบด้วยไฟต้านทานการย่างของเตาอบที่ 230 องศา นาน 10–14 นาที หมุนหนึ่งครั้ง\n"],
      [74, 1, "1. ผสมโยเกิร์ต น้ำเลมอน เครื่องเทศ เกลือ และน้ำมันเพื่อทำน้ำดอง\n"],
    ],
  },
  "kaannokset/sv/paaruoat/pizza-margherita.md": {
    currentSha256: "989f223f9c991a3338ff6c29f47f16144c3659f53edee04f62b72da2a39dcc11",
    inverseEdits: [
      [74, 1, "4. Bred ut tomatsmulet på bottnarna och lägg i den rivna mozzarellan.\n"],
    ],
  },
  "kaannokset/th/paaruoat/pizza-margherita.md": {
    currentSha256: "bb331f3dd0ff84eea2f697ca00f377c42da6d611ba406c94621cd8884d7b99a3",
    inverseEdits: [
      [74, 1, "4. ทามะเขือเทศบดหยาบลงไปที่ก้นถาด แล้วใส่มอสซาเรลลาที่ฉีกไว้ลงไป\n"],
    ],
  },
  "kaannokset/en/paaruoat/punainen-kanacurry-vhh.md": {
    currentSha256: "c313404b434f679097d36a30bcece0a24ceb118d45258f34c82a6e8aaf3b9220",
    inverseEdits: [
      [87, 1, "5. Add bamboo shoots and paprika. Simmer for another 5 minutes. Season with fish sauce and, if desired, erythritol.\n"],
    ],
  },
  "kaannokset/th/paaruoat/punainen-kanacurry-vhh.md": {
    currentSha256: "123f0b817c6603bc04a5b4ca31fd5cee9ec3ca9fa3b0942c9dbfaf9c30b01e68",
    inverseEdits: [
      [87, 1, "5. ใส่หน่อไม้และปาปริก้า หลนต่อไปอีก 5 นาที ปรุงรสด้วยน้ำปลา และอิริทริทอลหากต้องการ\n"],
      [85, 1, "3. เพิ่มไก่และทอดจนชิ้นส่วนถูกปิดด้วยส่วนผสมทั้งหมด\n"],
    ],
  },
  "kaannokset/th/jalkiruoat/rahkapiirakka-vhh.md": {
    currentSha256: "2a11e18a59b2a5d1aed04ca6b8e70c19e4677163b7c567b9ac8c020f5b4868c2",
    inverseEdits: [
      [71, 1, "3. เทไส้ด้านล่างแล้วอบที่อุณหภูมิ 175 °C ประมาณ 35 นาที\n"],
    ],
  },
  "kaannokset/sv/paaruoat/thai-vihrea-curry-kanalla-vhh.md": {
    currentSha256: "8b5ea1c3f16df8d0f0b527a54776e75cc1fad35702e28e794f595768924b0b00",
    inverseEdits: [
      [85, 1, "3. Tillsätt ungefär en deciliter kokosmjölk och blanda. Tillsätt kycklingen och koka, vänd.\n"],
    ],
  },
  "kaannokset/th/paaruoat/thai-vihrea-curry-kanalla-vhh.md": {
    currentSha256: "43ebe1788ce4266d2ddb8cf88933e0632c6c4741fa24a4e4a89e6bb19867257a",
    inverseEdits: [
      [88, 1, "6. ใส่ใบโหระพาลงไป อุ่นข้าวดอกกะหล่ำในกระทะแล้วเสิร์ฟพร้อมกับแกง\n"],
      [85, 2, "3. เติมกะทิประมาณหนึ่งเดซิลิตรแล้วผสม เพิ่มไก่และปรุงอาหารพลิก\n4. ใส่กะทิที่เหลือ น้ำปลา อิริทริทอล และใบมะกรูดลงไป หลนเป็นเวลา 10 นาที\n"],
    ],
  },
  "reseptit/leivonnaiset/vhh-lihapiirakka.md": {
    currentSha256: "d12574a7923d38585d882379983a1d465dec9fd8a9a1e4ea5ae63a832d76dcd6",
    inverseEdits: [
      [77, 1, "4. Sekoita toinen kananmuna täytteeseen, kaada vuokaan ja paista noin 30 minuuttia.\n"],
    ],
  },
  "kaannokset/en/leivonnaiset/vhh-lihapiirakka.md": {
    currentSha256: "ab233171f3f57464cf19d2724e56610068c3bbc5be396209b8f625a93094517e",
    inverseEdits: [
      [72, 1, "4. Mix the second egg into the filling, pour into the pan and bake for about 30 minutes.\n"],
    ],
  },
  "kaannokset/sv/leivonnaiset/vhh-lihapiirakka.md": {
    currentSha256: "7046deabcaa227cf0c79d85e49e87f37901951e2eab1d57e48f85633bce0f27b",
    inverseEdits: [
      [72, 1, "4. Blanda ner det andra ägget i fyllningen, häll i pannan och grädda i ca 30 minuter.\n"],
    ],
  },
  "kaannokset/th/leivonnaiset/vhh-lihapiirakka.md": {
    currentSha256: "e39dd7bb71b17ed3c17f76e62da66fec769310702c40fa3ca69303269a6a49a1",
    inverseEdits: [
      [72, 1, "4. ผสมไข่ใบที่สองลงในไส้ เทลงในกระทะ แล้วอบประมาณ 30 นาที\n"],
    ],
  },
  "kaannokset/sv/paaruoat/doner-kebab.md": {
    currentSha256: "adb595f0d63f04dccece20f5be458e4b4233f5f6a1eb256652398620d3b0b419",
    inverseEdits: [
      [74, 1, "# Hemlagad biff döner kebab\n"],
      [23, 1, "  alt: Kryddad döner kebabbiff med pitabröd, sallad och yoghurtsås\n"],
      [1, 1, "title: Hemlagad biff döner kebab\n"],
    ],
  },
  "kaannokset/en/paaruoat/jauhelihapihvit-vhh-kermakastikkeella.md": {
    currentSha256: "4b90d05377ef2853c96139b90139fa8182fd20a2bde46c5a95bdd174fa08b700",
    inverseEdits: [
      [91, 3, "2. Heat the butter in a pan and fry the steaks on medium heat until cooked, about 4–5 minutes on each side. Set the steaks aside.\n3. Pour the meat broth into the pan and scrape the frying surface with the sauce. Add cream, mustard and pepper.\n4. Cook the sauce slowly for 5–8 minutes until it thickens a little. Return the steaks to the pan and heat for another couple of minutes.\n"],
    ],
  },
  "kaannokset/sv/paaruoat/jauhelihapihvit-vhh-kermakastikkeella.md": {
    currentSha256: "6f5b2c5907884bc96ae980b4f9d3011d83400432081997c1d0995aea6d77ad8f",
    inverseEdits: [
      [92, 1, "3. Häll köttbuljongen i pannan och skrapa stekytan med såsen. Tillsätt grädde, senap och peppar.\n"],
    ],
  },
  "kaannokset/th/paaruoat/jauhelihapihvit-vhh-kermakastikkeella.md": {
    currentSha256: "db866f763f4321343d64d22bcb113a15fbafbcc721af124c32370d08bfc05571",
    inverseEdits: [
      [91, 3, "2. ตั้งเนยในกระทะแล้วทอดสเต็กด้วยไฟปานกลางจนสุกประมาณ 4-5 นาทีในแต่ละด้าน วางสเต็กไว้ข้างๆ.\n3. เทน้ำซุปเนื้อลงในกระทะแล้วขูดพื้นผิวทอดด้วยซอส ใส่ครีม มัสตาร์ด และพริกไทย\n4. ปรุงซอสช้าๆ ประมาณ 5-8 นาทีจนข้นเล็กน้อย นำสเต็กกลับเข้าไปในกระทะแล้วตั้งไฟต่ออีกสองสามนาที\n"],
    ],
  },
  "kaannokset/en/paaruoat/keltainen-kanacurry-vhh.md": {
    currentSha256: "61b61f9527469bbb5838a0f333284f79d7fee75dd2616306bfa27994be97c54b",
    inverseEdits: [
      [88, 1, "5. Season with fish sauce and, if desired, erythritol. Serve with cilantro on its own or as an addition to cauliflower rice.\n"],
      [76, 1, "Gaeng garee or yellow curry is a mildly spicy coconut curry. In this low-carb version, cauliflower is used instead of potato, which absorbs the aromatic sauce.\n"],
    ],
  },
  "kaannokset/sv/paaruoat/keltainen-kanacurry-vhh.md": {
    currentSha256: "091a27be9f73e2b91bcf55077bbdfe6e1dd360c9d5cec7b5f00c25679ee64923",
    inverseEdits: [
      [88, 1, "5. Smaksätt med fisksås och, om så önskas, erytritol. Servera med koriander för sig eller som tillsats till blomkålsris.\n"],
      [76, 1, "Gaeng garee eller gul curry är en milt kryddig kokoscurry. I denna lågkolhydrat-version används blomkål istället för potatis som absorberar den aromatiska såsen.\n"],
    ],
  },
  "kaannokset/th/paaruoat/keltainen-kanacurry-vhh.md": {
    currentSha256: "fb02b5167b62045ea2387bf10f54ced9ec36370fe599383ab9f2c825f28167d6",
    inverseEdits: [
      [87, 2, "4. ใส่ดอกกะหล่ำลงไปผัดต่อประมาณ 8-10 นาที จนไก่และดอกกะหล่ำสุก\n5. ปรุงรสด้วยน้ำปลา และอิริทริทอลหากต้องการ เสิร์ฟพร้อมผักชีเพียงอย่างเดียวหรือนอกเหนือจากข้าวดอกกะหล่ำ\n"],
      [84, 1, "1. ตั้งน้ำมันมะพร้าวให้ร้อนในหม้อ ใส่พริกแกงเหลืองและขมิ้น ผัดสักครู่\n"],
      [76, 1, "แกงการีหรือแกงเหลืองเป็นแกงกะทิรสเผ็ดเล็กน้อย ในเวอร์ชัน คาร์โบไฮเดรตต่ำ นี้ จะใช้ดอกกะหล่ำแทนมันฝรั่ง ซึ่งจะดูดซับซอสที่มีกลิ่นหอม\n"],
    ],
  },
  "reseptit/paaruoat/khao-kha-moo-vhh.md": {
    currentSha256: "907a2f69e71ce436054f1561a351e70def1ad38de23b95cf8a44d6af38060256",
    inverseEdits: [
      [57, 1, "3. Kaada joukkoon kanaliemi. Lisää soijakastikkeet, kalakastike ja erytritoli. Nosta porsas takaisin pataan.\n"],
    ],
  },
  "kaannokset/en/paaruoat/khao-kha-moo-vhh.md": {
    currentSha256: "fdc870ccc6c7f51687c14470d3a0b9bece636dcff962ef2bdf2ebf1cdd482137",
    inverseEdits: [
      [93, 1, "3. Pour in the chicken stock. Add soy sauces, fish sauce and erythritol. Return the pork to the pot.\n"],
      [91, 1, "1. Brown the pork pieces in a pan on all sides. Set aside for a moment.\n"],
      [87, 1, "The mild braising makes the pork belly tender and allows the spices to season the entire broth. The food is suitable for preparation the day before.\n"],
    ],
  },
  "kaannokset/sv/paaruoat/khao-kha-moo-vhh.md": {
    currentSha256: "5b19816ca02f912ed29ddb808fff3fdd8dbba55c493a90c406797dc6a3b1eec1",
    inverseEdits: [
      [93, 1, "3. Häll i kycklingfonden. Tillsätt sojasås, fisksås och erytritol. Lägg tillbaka fläsket i grytan.\n"],
      [91, 1, "1. Bryn fläskbitarna i en panna på alla sidor. Ställ åt sidan en stund.\n"],
      [87, 1, "Den milda bräseringen gör fläskmagen mör och låter kryddorna krydda hela buljongen. Maten är lämplig att laga dagen innan.\n"],
    ],
  },
  "kaannokset/th/paaruoat/khao-kha-moo-vhh.md": {
    currentSha256: "d66dd59200f05d349c5792002b1f0ae5a9f2ef3a39f69b93de36b51131e26dba",
    inverseEdits: [
      [93, 1, "3. ใส่น้ำสต๊อกไก่ลงไป ใส่ซีอิ๊วขาว น้ำปลา และอิริทริทอล นำหมูกลับลงหม้อ\n"],
      [91, 1, "1. ผัดชิ้นหมูในกระทะทุกด้าน พักไว้สักครู่\n"],
      [87, 1, "การตุ๋นอย่างอ่อนจะทำให้เนื้อสันในหมูนุ่มและช่วยให้เครื่องเทศปรุงรสน้ำซุปทั้งหมดได้ สามารถเตรียมอาหารได้ล่วงหน้าหนึ่งวัน\n"],
    ],
  },
  "reseptit/paaruoat/khao-man-gai-vhh.md": {
    currentSha256: "1e25c05b37753f78151fada1991efcdd682bf7ca7af92c1fe4955548c2018d1f",
    inverseEdits: [
      [62, 1, "5. Viipaloi broileri ja tarjoa riisin, kurkun, kastikkeen ja korianterin kanssa. Tarjoa halutessasi lientä erikseen.\n"],
    ],
  },
  "kaannokset/en/paaruoat/khao-man-gai-vhh.md": {
    currentSha256: "80ff3fbe537bd2d12c03a15d326573d3e6bedee28b38327f0e87e9da246fc090",
    inverseEdits: [
      [90, 1, "5. Slice the chicken and serve with rice, cucumber, sauce and coriander. If you wish, serve the broth separately.\n"],
    ],
  },
  "kaannokset/sv/paaruoat/khao-man-gai-vhh.md": {
    currentSha256: "2725e963d0e0617f491e417d1cd97f9504d71b43fd0d95dea02a1571be02ebcb",
    inverseEdits: [
      [89, 1, "5. Skiva kycklingen och servera med ris, gurka, sås och koriander. Om du vill, servera buljongen separat.\n"],
      [86, 2, "2. Koka under lock i 15–20 minuter tills innertemperaturen i broilern är minst 75 °C. Ta bort köttet från buljongen och låt det vila.\n3. Blanda ingefära, sojabönpasta, fisksås, limejuice och vitlök till en sås. Späd eventuellt med en sked fond.\n"],
    ],
  },
  "kaannokset/th/paaruoat/khao-man-gai-vhh.md": {
    currentSha256: "c9f8b20bcf23ac8c2e9738f718f16d3b9c7356f802faed9598809398fb8fdbbe",
    inverseEdits: [
      [89, 1, "5. หั่นไก่แล้วเสิร์ฟพร้อมข้าว แตงกวา ซอส และผักชี หากต้องการ ให้เสิร์ฟน้ำซุปแยกกัน\n"],
    ],
  },
  "kaannokset/th/paaruoat/khao-soi-vhh-konjac.md": {
    currentSha256: "b2da8bd0471d0684ef3634ea6ebcff35f9815489e46e21674fc2e8357f695648",
    inverseEdits: [
      [91, 2, "5. ล้างเส้นและสะเด็ดน้ำ ทอดในกระทะให้แห้งสักครู่แล้วแบ่งเป็นชาม\n6. ใส่ไก่ลงบนเส้นแล้วราดน้ำซุปร้อนๆ ปิดท้ายด้วยหอมแดงและกะหล่ำปลีมัสตาร์ด\n"],
      [79, 1, "ข้าวซอยเป็นก๋วยเตี๋ยวแกงภาคเหนือของไทย รูปแบบ คาร์โบไฮเดรตต่ำ นี้ทำจากบะหมี่บุกแทนบะหมี่แบบดั้งเดิม น้ำซุปมะพร้าวเข้มข้น ไก่ และผักกาดดองมัสตาร์ดยังคงรักษารสชาติที่คุ้นเคยไว้\n"],
      [64, 1, "    item: กะหล่ำปลีมัสตาร์ดดอง\n"],
      [23, 1, "  alt: ข้าวซอยเส้นบุกในน้ำแกงกะทิ ใส่เนื้อไก่ไม่มีกระดูก หอมแดงสด และผักกาดดอง\n"],
    ],
  },
  "kaannokset/en/paaruoat/pad-see-ew-vhh-konjac.md": {
    currentSha256: "4ea70ab91951cc3d4551821dbf3ee35507447a7aacfabefae65a0ae8fe9d23d5",
    inverseEdits: [
      [84, 1, "1. Rinse the noodles thoroughly and drain. Dry fry them in a hot pan for 3–4 minutes. Move aside.\n"],
    ],
  },
  "kaannokset/sv/paaruoat/pad-see-ew-vhh-konjac.md": {
    currentSha256: "c152f6ff421c9ce20ad335f30818b87f8cb8d1681987519977cabd955446fd1b",
    inverseEdits: [
      [84, 1, "1. Skölj nudlarna noga och låt rinna av. Stek dem torra i het panna i 3–4 minuter. Flytta åt sidan.\n"],
    ],
  },
  "kaannokset/th/paaruoat/pad-see-ew-vhh-konjac.md": {
    currentSha256: "98a43cd4a08ba152b81aacc4d89fe194ea05f7f69c4a734ddc3ce976154becc1",
    inverseEdits: [
      [86, 1, "3. ตั้งน้ำมันให้ร้อนครึ่งหนึ่งในกระทะ ทอดไก่จนสุกแล้วพักไว้\n"],
      [84, 1, "1. ล้างเส้นให้สะอาดแล้วสะเด็ดน้ำ ทอดให้แห้งในกระทะร้อนประมาณ 3-4 นาที ย้ายกัน.\n"],
    ],
  },
  "reseptit/alkuruoat/goi-cuon.md": {
    currentSha256: "339870e73960d81ef8c6de90840b940faae96cfb2268b4f7b933e0022cb0da1f",
    inverseEdits: [
      [39, 1, "4. Kasta riisipaperi nopeasti haaleaan veteen ja nosta kostealle alustalle. Aseta keskelle salaatti, nuudeleita, pavunituja, minttua ja porsasta.\n"],
      [7, 2, ""],
    ],
  },
  "reseptit/paaruoat/hernekeitto-savupotkalla.md": {
    currentSha256: "123a06f147e4e0874bdb12387f12c60d14a01722b44edf7ef5e77810a21b1738",
    inverseEdits: [
      [44, 1, "time_total_min: 750\n"],
      [7, 2, ""],
    ],
  },
  "reseptit/paaruoat/hunaja-sinappikana-kaalilla.md": {
    currentSha256: "54b95beecd582e69f504b1e2d16e5f05e6adc086a545e49ab652f4d28346a3b7",
    inverseEdits: [
      [69, 4, "1. Kuumenna uuni 210 asteeseen. Leikkaa kaali lohkoiksi ja aseta pellille broilerin kanssa.\n2. Sekoita sinappi, hunaja, öljy, valkosipulijauhe ja paprika. Valele broileri ja kaali.\n3. Mausta suolalla ja pippurilla. Paahda 35–40 minuuttia ja käännä kaali kerran.\n4. Sekoita dijonsinappi, hunaja, oliiviöljy, valkosipulijauhe ja paprikajauhe. Leikkaa broileri suupaloiksi ja kaali lohkoiksi, kääntele mausteseoksessa ja paahda uunissa, kunnes broileri on läpikypsää ja kaali pehmeää.\n"],
      [7, 2, ""],
    ],
  },
  "reseptit/paaruoat/japanilainen-curry-tofulla.md": {
    currentSha256: "17bb0b5478b1aef5fae4e0e5cfa86041aa39497ca9d00b4cd067b02eb172a309",
    inverseEdits: [
      [71, 1, "5. Tarjoa tofu-curry kukkakaaliriisin kanssa.\n"],
      [50, 1, "  src: paaruoat/japanilainen-curry-tofulla.webp\n"],
      [7, 2, ""],
    ],
  },
  "reseptit/aamupalat/kaakao-kookos-chia.md": {
    currentSha256: "d0a2d87fa49b2bdb9448b4f7b4d09cd259f70d36723f933aeeef85a0f0f4ef4b",
    inverseEdits: [
      [65,1,"1. Vatkaa kaakaojauhe pieneen tilkkaan kookosjuomaa tasaiseksi. Lisää loput juomasta, kerma, chia ja vanilja.\n"],
      [13,1,"  - kypsentäminen\n"],
      [7,2,""],
    ],
  },
  "reseptit/aamupalat/marjainen-chiavanukas.md": {
    currentSha256: "b02c4d4613f83fd3d045b5c72a7f5a07ae0cdfcea5691c386c5fe0c5d828d954",
    inverseEdits: [
      [68,1,"4. Jaa annoskulhoihin ja lisää marjat juuri ennen tarjoamista.\n"],
      [13,1,"  - kypsentäminen\n"],
      [7,2,""],
    ],
  },
  "reseptit/jalkiruoat/marjakiisseli-vaniljakastikkeella.md": {
    currentSha256: "42e3765032750d1cc35b8172f6bd25439de69cd421c64223aefa6112b2800e9c",
    inverseEdits: [
      [40, 1, "1. Kuumenna vesi ja kiisselin sokeri kattilassa. Lisää marjat ja keitä muutama minuutti.\n"],
    ],
  },
  "reseptit/paaruoat/miso-lohi-paksoi.md": {
    currentSha256: "caa41d5bd1f929406cfc0d7da2590e98ec624a85a68eaede35732966b066a270",
    inverseEdits: [
      [47, 1, "  src: paaruoat/miso-lohi-paksoi.webp\n"],
    ],
  },
  "reseptit/paaruoat/okonomiyaki-kaaliletut.md": {
    currentSha256: "30fdeacf128ff01beaa3df7fe991ee2547cdd6761f94a98cc6f294afe940d567",
    inverseEdits: [
      [49, 0, "image:\n  src: paaruoat/okonomiyaki-kaaliletut.webp\n  alt: Okonomiyaki-tyyliset kaaliletut tarjoiltuna\n  width: 1536\n  height: 1024\n"],
    ],
  },
  "reseptit/jalkiruoat/pannacotta-marjakastikkeella.md": {
    currentSha256: "e40c29b6f1e30daad9231ad833376cc64d8d4080d54dc59c7a6722b4bfc4e89b",
    inverseEdits: [
      [42, 1, "5. Kuumenna marjat ja sokeri pienessä kattilassa. Hauduta 5 minuuttia, mausta sitruunamehulla ja jäähdytä.\n"],
    ],
  },
  "reseptit/aamupalat/savulohi-avokadokulho.md": {
    currentSha256: "f93a416a19143264ad1c2d36c7cdaef456309d2a958c2b20a137360e6a3413c2",
    inverseEdits: [
      [71, 1, "4. Lisää kastike ja tarjoa heti.\n"],
      [7, 2, ""],
    ],
  },
  "reseptit/paaruoat/tacokulho-nauta-avokado.md": {
    currentSha256: "3a5735d1348748d901a258a7498d87e825950f96ce66cfa48d434dcdc287863b",
    inverseEdits: [
      [52, 0, "image:\n  src: paaruoat/tacokulho-nauta-avokado.webp\n  alt: Taco-kulho naudanlihalla ja avokadolla tarjoiltuna\n  width: 1536\n  height: 1024\n"],
      [7, 2, ""],
    ],
  },
  "reseptit/jalkiruoat/vhh-juustokakku.md": {
    currentSha256: "d6d79e6e9dace0348cc7cd8d3d935ca9c5040dd08864a12a429bbd9491873573",
    inverseEdits: [
      [22, 1, "time_total_min: 90\n"],
      [7, 2, ""],
    ],
  },
  "reseptit/paaruoat/carnitas-salaattitacot.md": {
    currentSha256: "100008a32d28768f59401b356d3d76a026275119f274256282e2e1019d8ec2e1",
    inverseEdits: [
      [56, 0, "image:\n  src: paaruoat/carnitas-salaattitacot.webp\n  alt: Hitaasti haudutetut carnitas-salaattitacot tarjoiltuna\n  width: 1536\n  height: 1024\n"],
    ],
  },
  "reseptit/aamupalat/indialainen-poha-maapahkinoilla.md": {
    currentSha256: "5fc1ccc4d6c48268325313fa6e5075d9a9bcf5d8f97943758aba6da8ab906dbd",
    inverseEdits: [[7, 2, ""]],
  },
  "reseptit/aamupalat/kiinalainen-riisipuuro-kananmunalla.md": {
    currentSha256: "0b9b81f1ad1973bba7177df5123fd4fad0efc9975fa529977cd84c12afc9e722",
    inverseEdits: [[7, 2, ""]],
  },
  "reseptit/aamupalat/korealainen-yachaejuk-kasvisjuk.md": {
    currentSha256: "cb8786b238364fff803719f6dcc6ea8c945249fb6b312a56b47b9a7a77f153d9",
    inverseEdits: [[7, 2, ""]],
  },
  "reseptit/aamupalat/kurkku-oliivi-aamiaiskulho.md": {
    currentSha256: "a6808c672e693002702c5bbe96296b9106839866bbaa81e71433eb7535b5038f",
    inverseEdits: [[7, 2, ""]],
  },
  "reseptit/aamupalat/lahi-ita-kikhernejauho-yrttilettu.md": {
    currentSha256: "d1597fdfc474e36a9958edaf1a2fde3b37f25a1895a6356d6df30f9afc00eeb8",
    inverseEdits: [[7, 2, ""]],
  },
  "reseptit/aamupalat/malesialainen-congee-inkivaarilla.md": {
    currentSha256: "4d4a7197991bde1cc03541052c83d45be15f9b9ba81954c539ceaf1b684dcf91",
    inverseEdits: [[7, 2, ""]],
  },
  "reseptit/aamupalat/munakasrulla-pinaatti-tuorejuustolla.md": {
    currentSha256: "a612d8075e162818968800c4393a93b693cda16290035342ca189a08bd0f8cfd",
    inverseEdits: [[7, 2, ""]],
  },
  "reseptit/aamupalat/paahdettu-aamiaismunakoiso.md": {
    currentSha256: "84c98cc7638b8229a6170305eed10d32910a45c746b306771966c6d3b4374e91",
    inverseEdits: [[7, 2, ""]],
  },
  "reseptit/aamupalat/pohjoisafrikkalainen-kuskus-aamiaiskulho.md": {
    currentSha256: "0e6c1004975dd002bf42662946bbf15bbbb19f607aaa893a554cce19dbe372f7",
    inverseEdits: [[7, 2, ""]],
  },
  "reseptit/aamupalat/pohjoisafrikkalainen-taatelipuuro-appelsiinilla.md": {
    currentSha256: "8e37b1f3ccd7905d0d0ee68f40dcc7e99f0b62fb8b9255a4cecb837224999a1f",
    inverseEdits: [[7, 2, ""]],
  },
  "reseptit/aamupalat/raejuusto-pesto-kasviskulho.md": {
    currentSha256: "946db111ae676e3f9b34986434f6e87575c4af1066de36f078a18b06f616bb1a",
    inverseEdits: [[7, 2, ""]],
  },
  "reseptit/aamupalat/siemengranola-jogurtilla.md": {
    currentSha256: "8100f920ba654edf84b847336d90899c6d6613d01e8dee20af7c913ea7eb474e",
    inverseEdits: [[7, 2, ""]],
  },
  "reseptit/aamupalat/thai-jok-kanalla.md": {
    currentSha256: "9e8476e9aa500c56da7ac439a54cc41d991cec82a1c9e59dfc75352816c858df",
    inverseEdits: [[7, 2, ""]],
  },
  "reseptit/aamupalat/thai-porsasjok.md": {
    currentSha256: "11a68c3326993ecb61b2b04bf80da614c3717edfb12507f377278c02d720e73b",
    inverseEdits: [[7, 2, ""]],
  },
  "reseptit/jalkiruoat/vhh-mansikkakakku.md": {
    currentSha256: "275587e8131c07fc05497f869d54861f3d4c446139d8693fa5c46ad043927e75",
    inverseEdits: [[7, 2, ""]],
  },
  "reseptit/jalkiruoat/vhh-mokkapalat.md": {
    currentSha256: "b882db07b90c5381945c4655e5c3993889d6b5e38b1449513beed29927226b4e",
    inverseEdits: [[7, 2, ""]],
  },
  "reseptit/jalkiruoat/vhh-omenapiirakka.md": {
    currentSha256: "53541c935cdba02c05594508686ded88c78b8a559d23f041fa7492195c7ef6e9",
    inverseEdits: [[7, 2, ""]],
  },
  "reseptit/jalkiruoat/vhh-raparperipiirakka.md": {
    currentSha256: "e9ec69c8a0da92f6da888936fde52b65e3a0382c351b76d910f4e8ae9dff92a0",
    inverseEdits: [[7, 2, ""]],
  },
  "reseptit/paaruoat/kana-parmesaanipannu-parsakaali.md": {
    currentSha256: "b944bdb86c952ac1cc89f4f4a4571d048895553fb9af9dded9329c4dde3c75bd",
    inverseEdits: [[7, 2, ""]],
  },
  "reseptit/paaruoat/kanaviillokki-kukkakaalilla.md": {
    currentSha256: "ad8261f25febf41bf71110f85cd3ab1f89b709a1f2d9a9f316e60867254020a9",
    inverseEdits: [[7, 2, ""]],
  },
  "reseptit/paaruoat/kermainen-kanasienipannu.md": {
    currentSha256: "b495a67762f95a76bd5b06ca42be47244cdfe7bc95d31789fd0a91284ace38fe",
    inverseEdits: [[7, 2, ""]],
  },
  "reseptit/paaruoat/nasi-lemak.md": {
    currentSha256: "1dc92af8929f09f1e7798bb846f61b43d083f6104a6dd07b36819f636f9beed1",
    inverseEdits: [[7, 2, ""]],
  },
  "reseptit/paaruoat/uunimakkara-sipulipedilla.md": {
    currentSha256: "d2705895936c37657fe45ac18e168b4e8eb3252def668e2bf1208d1680ece37e",
    inverseEdits: [[7, 2, ""]],
  },
  "kaannokset/en/paaruoat/bouillabaisse.md": {
    currentSha256: "acff3d276d97886299e6ea5d8c2866c470f906547b943332cb797bd813c43be0",
    inverseEdits: [
      [94, 1, "2. Add crushed tomatoes, fish stock and saffron. Boil.\n"],
      [48, 2, "    item: a clove of garlic\n    note: shredded\n"],
    ],
  },
  "kaannokset/en/paaruoat/kantonilainen-hoyrytetty-kala.md": {
    currentSha256: "48824edbfeee17d259900874071bf6ad5f9035d99e7312cd1b078135c91df10c",
    inverseEdits: [
      [77, 1, ""],
      [71, 1, "4. Heat the oil in a small pot until hot but not smoking. Carefully pour it over the ginger and onion.\n"],
      [69, 1, "2. Steam in a covered steamer for about 8–12 minutes, depending on the thickness of the fillet, until the fish is cooked through and breaks easily.\n"],
      [64, 1, "Steamed white fish is finished with hot ginger-onion oil and soy sauce, which bring out the flavor of the fish.\n"],
      [60, 1, "Steamed white fish is finished with hot ginger-onion oil and soy sauce, which bring out the flavor of the fish.\n"],
    ],
  },
  "kaannokset/sv/paaruoat/bouillabaisse.md": {
    currentSha256: "1aa1eda5bc459dcf00425e78c562d5ad5bb1dff7a8be490fd1745939c3fcba5e",
    inverseEdits: [
      [96, 1, "4. Lägg i fiskbitarna och musslorna. Täck över och koka i 5 minuter. Tillsätt räkorna och fortsätt koka tills fisken är genomstekt och musslorna har öppnat sig. Kassera oöppnade musslor.\n"],
      [94, 1, "2. Tillsätt krossade tomater, fiskfond och saffran. Koka.\n"],
      [48, 2, "    item: en vitlöksklyfta\n    note: strimlad\n"],
      [33, 1, "    note: rengöras\n"],
    ],
  },
  "kaannokset/sv/paaruoat/kantonilainen-hoyrytetty-kala.md": {
    currentSha256: "e096053cce6a1080b98c4419279571790b091b48f4c2af00bb9c08436067a437",
    inverseEdits: [
      [77, 1, ""],
      [68, 4, "1. Lägg fisken på en värmetålig plåt och fördela hälften av ingefäran ovanpå.\n2. Ånga i täckt ångkokare i ca 8–12 minuter, beroende på filéns tjocklek, tills fisken är genomstekt och lätt går sönder.\n3. Häll av vätskan som samlats på plattan. Lägg vårlöken och resten av ingefäran ovanpå fisken.\n4. Hetta upp oljan i en liten gryta tills den är varm men inte ryker. Häll det försiktigt över ingefäran och löken.\n"],
    ],
  },
  "kaannokset/th/paaruoat/bouillabaisse.md": {
    currentSha256: "b444f0d03c470edad236be9145fff9e9caf1637c1488b6d6e4f863b01d8b323c",
    inverseEdits: [
      [96, 1, "4. ใส่ชิ้นปลาและหอยแมลงภู่ ปิดฝาและปรุงเป็นเวลา 5 นาที ใส่กุ้งลงไปผัดต่อจนปลาสุกและหอยเปิดออก ทิ้งหอยที่ยังไม่ได้เปิด\n"],
      [93, 2, "1. ผัดหัวหอมและหัวเฟนเนลในน้ำมันมะกอกในหม้อประมาณ 8 นาที ใส่กระเทียมและไทม์.\n2. ใส่มะเขือเทศบด น้ำสต๊อกปลา และหญ้าฝรั่น ต้ม.\n"],
      [48, 2, "    item: กระเทียม\n    note: หั่นฝอย\n"],
    ],
  },
  "kaannokset/th/paaruoat/hyderabadi-kanabiryani.md": {
    currentSha256: "9caac17558bebef1a4b31567adb93d19b62f32e195a95d53e57d587b1ebb74b2",
    inverseEdits: [
      [104, 2, "6. ทาข้าวให้ทั่วไก่ ใส่นมหญ้าฝรั่น เนยใส หัวหอมทอด ใบสะระแหน่ และผักชี\n7. ปิดฝาให้แน่นแล้วปรุงโดยใช้ไฟอ่อนมากเป็นเวลา 20-25 นาที ทิ้งไว้ 10 นาทีแล้วขยี้เบาๆ\n"],
      [100, 1, "2. ผสมไก่กับโยเกิร์ต การัม มาซาล่า ยี่หร่า ผักชี ขมิ้น และเกลือ ปล่อยให้ปรุงรสเป็นเวลา 20 นาที\n"],
      [95, 1, "ข้าวหมกบริยานีไก่รสเผ็ดปรุงในไก่ปรุงรสหลายชั้นและข้าวบาสมาติหอมกรุ่น การหุงด้วยไอน้ำช่วยให้ข้าวไม่หลุดและเนื้อยังชุ่มฉ่ำ\n"],
      [91, 1, "ข้าวหมกบริยานีไก่รสเผ็ดปรุงในไก่ปรุงรสหลายชั้นและข้าวบาสมาติหอมกรุ่น การหุงด้วยไอน้ำช่วยให้ข้าวไม่หลุดและเนื้อยังชุ่มฉ่ำ\n"],
    ],
  },
  "kaannokset/th/paaruoat/kantonilainen-hoyrytetty-kala.md": {
    currentSha256: "17f6272bc276623600a06bb1625904c3c107513a984cdd0e3d9c18b74725c377",
    inverseEdits: [
      [77, 1, ""],
      [72, 1, "5. ตักซีอิ๊วขาวและน้ำลงไป เสิร์ฟทันทีพร้อมมะนาวและข้าว\n"],
      [69, 1, "2. นึ่งในหม้อนึ่งที่มีฝาปิดประมาณ 8-12 นาที ขึ้นอยู่กับความหนาของเนื้อปลา จนเนื้อปลาสุกและแยกชิ้นได้ง่าย\n"],
      [64, 1, "ปลาเนื้อขาวนึ่งปิดท้ายด้วยน้ำมันขิงหัวหอมร้อนและซีอิ๊ว ซึ่งดึงรสชาติของปลาออกมา\n"],
      [60, 1, "ปลาเนื้อขาวนึ่งปิดท้ายด้วยน้ำมันขิงหัวหอมร้อนและซีอิ๊ว ซึ่งดึงรสชาติของปลาออกมา\n"],
    ],
  },
  "reseptit/paaruoat/kantonilainen-hoyrytetty-kala.md": {
    currentSha256: "db52b3d68df183a46bc2c814956a197343dbdfcfc027c3e981e84234a8c7521d",
    inverseEdits: [
      [79, 1, ""],
    ],
  },
  "kaannokset/th/jalkiruoat/keto-pannukakku.md": {
    currentSha256: "d66ff0b49dbfacdeeb1ab693778197851a481cb1df4e880a95fd5650620bc5dd",
    inverseEdits: [
      [63, 1, "1. ตั้งเตาอบที่ 220 °C และละลายเนยบนถาดอบหรือในกระทะ\n"],
    ],
  },
  "kaannokset/th/paaruoat/kai-jiew-vhh.md": {
    currentSha256: "b83c6b58ad4e60bc28efcb5478344a2eba7333e41933088f445dc3662c99e620",
    inverseEdits: [
      [73, 1, "3. เทส่วนผสมไข่ลงในกระทะ ทอดด้วยไฟปานกลางจนขอบกรอบและอยู่ตรงกลาง\n"],
      [63, 1, "ไก่เจียวเป็นไข่เจียวกรอบฟูกรอบปรุงรสด้วยน้ำปลา จัดเตรียมได้อย่างรวดเร็วและเหมาะเป็นอาหารว่างหรือเป็นส่วนหนึ่งของโต๊ะรับประทานอาหารขนาดใหญ่\n"],
    ],
  },
  "reseptit/aamupalat/intialainen-pinaatti-paneer-chilla.md": {
    currentSha256: "c4c77740d96d341f6530dc32275426bbf5fd6ed971dcad69d7f7d4e8de46fcd2",
    inverseEdits: [[61, 9, "1. Sekoita jauhot tai viljat ja muut kuivat ainekset kulhossa. Lisää neste vähitellen ja vatkaa tasaiseksi taikinaksi.\n2. Anna taikinan levätä 10 minuuttia. Jos käytät kokonaisia palkokasveja tai viljoja taikinapohjana, niiden tulee olla liotettuja ja hienonnettuja.\n3. Kuumenna öljytty pannu keskilämmölle. Paista taikina ohuina annoksina; käännä, kun reunat kuivuvat ja pinta alkaa asettua.\n4. Tarjoa korianterichutneyn ja sitruunalohkon kanssa.\n"], [17, 6, "  - amount: 1\n    unit: \"kpl\"\n    item: \"pinaatti\"\n"]],
  },
  "reseptit/paaruoat/mapo-tofu.md": {
    currentSha256: "341342cef1ea3ff375deb9504bb47e56f3837ed3991956a27ce490fb759ae433",
    inverseEdits: [[90, 1, "5. Ripottele päälle sichuaninpippuri ja kevätsipuli. Tarjoa riisin kanssa.\n"], [66, 3, "  - amount: 4\n    unit: annosta\n    item: keitettyä riisiä\n"]],
  },
  "kaannokset/en/paaruoat/mapo-tofu.md": {
    currentSha256: "be198ffacbf58dbac9c46b14eb7f5758a2d780749b76d9c9ada0b2344aa410ca",
    inverseEdits: [[88, 1, "5. Sprinkle Sichuan pepper and spring onion on top. Serve with rice.\n"], [66, 3, "  - amount: 4\n    unit: servings\n    item: cooked rice\n"]],
  },
  "kaannokset/sv/paaruoat/mapo-tofu.md": {
    currentSha256: "4906e4cfd9aa31e47822b4d5fa734d1569faaa540985d034789092322632d08e",
    inverseEdits: [[88, 1, "5. Strö Sichuanpeppar och vårlök ovanpå. Servera med ris.\n"], [66, 3, "  - amount: 4\n    unit: portioner\n    item: kokt ris\n"]],
  },
  "kaannokset/th/paaruoat/mapo-tofu.md": {
    currentSha256: "45d18da6bfbc731685e873ffe44c9fe3e39cf498ee5488af2417e60759fff0fd",
    inverseEdits: [[88, 1, "5. โรยพริกไทยเสฉวนและต้นหอมลงไปด้านบน เสิร์ฟพร้อมข้าว\n"], [85, 1, "2. ใส่น้ำพริกโต้วปันเจียง กระเทียม และขิง ผัดสักครู่กวน\n"], [66, 3, "  - amount: 4\n    unit: ที่\n    item: ข้าวสวย\n"]],
  },
};

export function recipeTextForApprovedSnapshot(file: string, text: string): string {
  const editorial = editorialSnapshots[file];
  if (editorial && createHash("sha256").update(text).digest("hex") === editorial.currentSha256) {
    const lines = text.split("\n");
    for (const [start, count, historical] of editorial.inverseEdits) {
      const restored = historical ? historical.slice(0, -1).split("\n") : [];
      lines.splice(start, count, ...restored);
    }
    return lines.join("\n");
  }
  if (
    file === "reseptit/jalkiruoat/keto-mutakakku.md" ||
    file === "reseptit/jalkiruoat/keto-suklaakeksit.md" ||
    file === "reseptit/jalkiruoat/meheva-suklaakakku.md"
  ) {
    text = text.replace(
      "\nstatus: published\ntranslation_languages: [en, sv, th]\ntranslation_status: {en: published, sv: published, th: published}\n",
      "\nstatus: published\ntranslation_languages: [en]\ntranslation_status: {en: published}\n",
    );
  }
  if (file === "reseptit/jalkiruoat/keto-suklaakeksit.md" || file === "reseptit/jalkiruoat/meheva-suklaakakku.md") {
    text = text.replace(
      "\nstatus: published\ntranslation_languages: [en, sv]\ntranslation_status: {en: published, sv: published}\n",
      "\nstatus: published\ntranslation_languages: [en]\ntranslation_status: {en: published}\n",
    );
  }
  if (englishPublicationSources.has(file)) {
    text = text.replace(
      "\nstatus: published\ntranslation_languages: [en]\ntranslation_status: {en: published}\n",
      "\nstatus: published\n",
    );
  }
  const edit = approvedNoteEdits[file];
  if (!edit) return text;
  const [historical, current] = edit;
  return text.split("\n").map(line => line === current ? historical : line).join("\n");
}

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
  "piparkakkulatte-hunajalla/en": {
    method: [["Vatkaa vielä hetki.", "Beat again briefly."]],
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
      ["Lisää 0,5 g mustapippuria ja 10 g persiljaa. Tarjoa koko pata kastikkeineen ja rasvoineen 150 g noin 40-prosenttista smetanaa kanssa neljänä annoksena. Erilliset lisukkeet eivät kuulu annokseen.", "Lisää 0,5 g mustapippuria ja 10 g persiljaa. Jaa koko pata kastikkeineen ja rasvoineen neljään annokseen. Tarjoa niiden kanssa yhteensä 150 g noin 40-prosenttista smetanaa. Erilliset lisukkeet eivät kuulu annoksiin."]
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
  "vietnamilainen-hu-tieu-aamiaiskeitto/th": {
    "description": "ต้มหมูสันนอกหั่นเส้นและเส้นก๋วยเตี๋ยวในหม้อเดียวกัน เติมถั่วงอกกับผักชีสด เสิร์ฟเป็นอาหารเช้าสองที่พร้อมน้ำซุปทั้งหมด"
  }
};

export function reviewedRecipeCopy(id: string, locale: RecipeLocale): ReviewedRecipeCopy | undefined {
  return reviewedCopy[id + "/" + locale];
}

export function applyCopyEdits(text: string, edits: CopyEdits = []): string {
  return edits.reduce((current, [before, after]) => current.replaceAll(before, after), text);
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

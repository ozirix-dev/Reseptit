import type { RecipeLocale } from "../src/types/content";
import { recipeSeoDescriptions } from "./recipe-seo-descriptions";

// Public display copy for recipes whose protected sources also back nutrition,
// publication and translation records.
type LocalizedCopy = Readonly<Record<string, Partial<Record<RecipeLocale, string>>>>;

const descriptions: LocalizedCopy = {
  "paella-valenciana": {
  "fi": "Kun kuuma sahramiliemi on lisätty, riisiä ei enää sekoiteta: se saa kypsyä pannulla broilerin ja vihreiden papujen kanssa. Broilerin paksuimpien palojen sisälämpö tarkistetaan vähintään 75 °C:seen.",
  "en": "After the hot saffron stock is added, leave the short-grain rice unstirred as it cooks with chicken and green beans. Check that the thickest chicken pieces reach at least 75 °C.",
  "sv": "När den varma saffransbuljongen har tillsatts får det kortkorniga riset tillagas utan mer omrörning tillsammans med kyckling och gröna bönor. Kontrollera att kycklingens tjockaste bitar når minst 75 °C.",
  "th": "หลังเติมน้ำสต๊อกหญ้าฝรั่นร้อนแล้ว ไม่คนข้าวเมล็ดสั้นอีก ปรุงข้าวพร้อมไก่และถั่วแขก แล้วตรวจให้ชิ้นไก่ส่วนที่หนาที่สุดมีอุณหภูมิภายในอย่างน้อย 75 °C"
},
  "butter-chicken": {
    fi: "Maustejogurtissa marinoitu broileri saa seurakseen kermaisen tomaattikastikkeen, jota makeutetaan hiukan hunajalla.",
    en: "Chicken marinated in spiced yogurt is served in a creamy tomato sauce with a touch of honey.",
    sv: "Kyckling marinerad i kryddad yoghurt serveras i en gräddig tomatsås med lite honung.",
    th: "ไก่หมักโยเกิร์ตผสมเครื่องเทศ เสิร์ฟในซอสมะเขือเทศใส่ครีมและน้ำผึ้งเล็กน้อย",
  },
  "caponata": {
    fi: "Sisilialaisen munakoisoruoan hapokkuus tulee punaviinietikasta. Tomaatti, vihreät oliivit ja kaprikset täydentävät makua.",
    en: "Red wine vinegar gives this Sicilian aubergine dish its tang. Tomatoes, green olives and capers round out the flavour.",
    sv: "Rödvinsvinäger ger syra åt den sicilianska auberginerätten med tomat, gröna oliver och kapris.",
    th: "มะเขือม่วงแบบซิซิลีรสเปรี้ยวจากน้ำส้มสายชูไวน์แดง ใส่มะเขือเทศ มะกอกเขียว และเคเปอร์",
  },
  "chili-con-carne-kukkakaaliriisi": {
    fi: "Savupaprikalla ja juustokuminalla maustettu naudanliha-papupata tarjoillaan kukkakaaliriisin päällä.",
    en: "A beef and bean chilli seasoned with smoked paprika and cumin, served over cauliflower rice.",
    sv: "En gryta på nötfärs och bönor med rökt paprika och spiskummin, serverad med blomkålsris.",
    th: "สตูเนื้อวัวบดกับถั่ว ปรุงปาปริการมควันและยี่หร่า เสิร์ฟบนข้าวดอกกะหล่ำ",
  },
  "harira": {
    fi: "Marokkolaisessa tomaattikeitossa on naudan jauhelihaa, linssejä, kikherneitä ja ohutta vermiselliä. Inkivääri, kurkuma ja kaneli maustavat liemen.",
    en: "This Moroccan tomato soup combines minced beef, lentils, chickpeas and vermicelli. Ginger, turmeric and cinnamon flavour the broth.",
    sv: "Den marockanska tomatsoppan innehåller nötfärs, linser, kikärter och tunna vermicelli. Ingefära, gurkmeja och kanel smaksätter buljongen.",
    th: "ซุปมะเขือเทศแบบโมร็อกโกใส่เนื้อวัวบด ถั่วเลนทิล ถั่วลูกไก่ และเส้นเวอร์มิเชลลี ปรุงด้วยขิง ขมิ้น และอบเชย",
  },
  "indialainen-poha-maapahkinoilla": {
    fi: "Pehmennetyt riisihiutaleet käännellään pannulla herneiden, maapähkinöiden ja currylehtien kanssa. Lopuksi lisätään sitruunamehua.",
    en: "Softened rice flakes are tossed with peas, peanuts and curry leaves, then brightened with lemon juice.",
    sv: "Uppmjukade risflingor vänds i pannan med ärtor, jordnötter och curryblad. Avsluta med citronsaft.",
    th: "นำข้าวแผ่นแช่น้ำจนนุ่มมาผัดกับถั่วลันเตา ถั่วลิสง และใบกะหรี่ แล้วเติมน้ำเลมอนก่อนเสิร์ฟ",
  },
  "indonesialainen-nasi-uduk-aamiaisella": {
    fi: "Jasmiiniriisi kypsyy täyteläisessä kookosmaidossa. Sen kanssa tarjoillaan kananmunaa ja tuoretta kurkkua.",
  },
  "indonesialainen-pisang-goreng-aamiaiseksi": {
    fi: "Banaaniviipaleet paistetaan kullanruskeiksi riisijauhoista ja kookoshiutaleista tehdyssä taikinassa. Fariinisokeri makeuttaa kuoren.",
  },
  "indonesialainen-serabi-kookospannukakku": {
    fi: "Riisijauhoista, kookosmaidosta ja kookoshiutaleista paistetaan paksuja pikkupannukakkuja, joiden päälle sulatetaan fariinisokeria.",
  },
  "intialainen-besan-chilla": {
    fi: "Kikhernejauhoista paistetaan ohuita suolaisia lettuja, joiden taikinaan sekoitetaan tomaattia, sipulia ja korianteria.",
  },
  "intialainen-mannasuurimoupma": {
    fi: "Tässä suolaisessa mannasuurimoruoassa on herneitä ja porkkanaa. Currylehdet antavat aromin kuumaan upmaan.",
  },
  "italian-pata": {
    fi: "Kesäkurpitsaa ja naudan jauhelihaa haudutetaan tomaattimurskassa italialaishenkiseksi padaksi. Oregano maustaa kastikkeen.",
    en: "Beef mince and courgette simmer in crushed tomatoes, with dried oregano for flavour.",
    sv: "Nötfärs och zucchini får sjuda i krossade tomater smaksatta med torkad oregano.",
    th: "เนื้อวัวบดกับซูกินีเคี่ยวในมะเขือเทศบด ปรุงกลิ่นด้วยออริกาโนแห้ง",
  },
  "janssoninkiusaus-juuriselleri": {
    fi: "Janssoninkiusauksessa juuriselleri korvaa perunan. Anjovis maustaa kermaisen uunivuoan, jonka pinnalle ripotellaan tilliä.",
    en: "Celeriac takes the place of potato in this creamy bake. Anchovies flavour the layers and fresh dill goes on top.",
    sv: "Rotselleri ersätter potatisen i den gräddiga gratängen. Ansjovis ger sälta och dill strös över vid servering.",
    th: "กราแตงครีมใช้รากเซเลอรีแทนมันฝรั่ง ปรุงรสด้วยปลาแอนโชวีและโรยผักชีลาว",
  },
  "japanilainen-onigiri-lohella": {
    fi: "Kypsän lohen ympärille muotoillaan riisikolmiot. Norisuikaleet ja seesaminsiemenet viimeistelevät onigirit.",
  },
  "japanilainen-soba-aamiaiskeitto": {
    fi: "Dashi maustaa sobanuudelikeiton, johon lisätään pinaattia ja kypsennetty kananmuna.",
    th: "เส้นโซบะกับผักโขมในน้ำซุปผสมดาชิ เสิร์ฟพร้อมไข่ที่ลวกในน้ำซุป",
  },
  "kana-enchilada-kukkakaalivuoka": {
    fi: "Broileri ja kukkakaali paistetaan uunissa itse tehdyn limetti-chilisalsan, ranskankerman ja cheddarin kanssa.",
    en: "Chicken and cauliflower bake with homemade lime and chilli salsa, crème fraîche and cheddar.",
    sv: "Kyckling och blomkål gratineras med hemgjord lime- och chilisalsa, crème fraiche och cheddar.",
    th: "ไก่กับดอกกะหล่ำอบกับซัลซาพริกและมะนาวทำเอง ครีมเฟรช และเชดดาร์",
  },
  "kana-fajita-pelti": {
    fi: "Broileri, paprika ja punasipuli paahtuvat samalla pellillä. Tarjoa ne limetillä maustetun avokado-jogurttikastikkeen kanssa.",
    en: "Chicken, red pepper and red onion roast on one tray. Serve with a lime, avocado and yogurt dressing.",
    sv: "Kyckling, röd paprika och rödlök rostas på samma plåt. Servera med avokado- och yoghurtsås med lime.",
    th: "ไก่ พริกหวานแดง และหอมแดงอบในถาดเดียวกัน เสิร์ฟกับซอสอะโวคาโดโยเกิร์ตปรุงมะนาว",
  },
  "kanakeitto-pinaatti-sitruuna": {
    fi: "Pinaatti, purjo ja sitruuna maustavat kermaisen kanakeiton.",
    en: "Spinach, leek and lemon brighten this creamy chicken soup.",
    sv: "Spenat, purjolök och citron ger smak åt den krämiga kycklingsoppan.",
    th: "ซุปไก่ครีมใส่ผักโขมและต้นกระเทียม เพิ่มรสสดชื่นด้วยเลมอน",
  },
  "kanapyorykat-tomaattikastike": {
    fi: "Parmesaani ja oregano maustavat broileripyörykät, jotka tarjotaan kermaisessa tomaattikastikkeessa.",
    en: "Parmesan and oregano flavour these chicken meatballs, served in a creamy tomato sauce.",
    sv: "Parmesan och oregano smaksätter kycklingbullarna som serveras i en krämig tomatsås.",
    th: "ลูกชิ้นไก่ปรุงพาร์เมซานและออริกาโน เสิร์ฟในซอสมะเขือเทศใส่ครีม",
  },
  "karibia-callaloo-munakas": {
    fi: "Pinaatti korvaa callaloon lehdet munakkaassa, jonka maustavat kevätsipuli ja tuore timjami.",
    en: "Spinach stands in for callaloo greens in this omelette with spring onion and fresh thyme.",
    sv: "Spenat ersätter callalooblad i den här omeletten med salladslök och färsk timjan.",
    th: "ไข่เจียวแบบคัลลาลูสูตรนี้ใช้ผักโขมแทนใบคัลลาลู ใส่ต้นหอมและไทม์สด",
  },
  "karibia-jamaikalainen-munakokkeli": {
    fi: "Tomaatin mehukkuus, tuore timjami ja tulinen Scotch bonnet -chili antavat pehmeälle munakokkelille makua.",
  },
  "karibia-johnny-cake": {
    fi: "Maitoa ja voita sisältävästä taikinasta paistetaan pannulla pieniä kullanruskeita leipäkiekkoja.",
  },
  "karibia-kookosriisi-pavuilla": {
    fi: "Jasmiiniriisi saa makua kookosmaidosta ja tuoreesta timjamista. Tarjoa se haudutettujen kidneypapujen kanssa.",
  },
  "karibia-maissipuuro-kookoksella": {
    fi: "Maissijauho kypsyy kookosmaidossa täyteläiseksi puuroksi, joka maustetaan kanelilla ja vaniljalla.",
  },
  "karibia-mango-limejogurtti": {
    fi: "Limemehu raikastaa kylmän mango-jogurttikulhon. Pinnalle ripotellaan kookoshiutaleita.",
    en: "Lime brightens these chilled mango yogurt bowls, topped with coconut flakes.",
    sv: "Lime ger frisk smak åt den kalla mangoyoghurten som toppas med kokosflingor.",
    th: "โยเกิร์ตมะม่วงเย็น ๆ เติมน้ำมะนาวให้รสสดชื่น แล้วโรยมะพร้าวขูดแห้ง",
  },
  "karjalanpiirakat-riisipuurolla": {
    fi: "Ohut, rypytetty ruiskuori ympäröi maitoon keitettyä riisipuuroa. Määrien toimivuus odottaa koeleivontaa, ja Aito perinteinen tuote (APT) -vaatimusten täyttyminen on vielä tarkistamatta.",
    en: "Thin crimped rye crusts hold a rice porridge filling cooked in milk. These quantities have yet to be test-baked, and compliance with the EU Traditional Speciality Guaranteed specification has yet to be checked.",
    sv: "Det tunna, veckade rågskalet fylls med risgrynsgröt kokad i mjölk. Mängderna har ännu inte provbakats, och det återstår att kontrollera om receptet uppfyller EU:s krav för en garanterad traditionell specialitet.",
    th: "พายแป้งไรย์แผ่นบางจับจีบ สอดไส้ข้าวต้มนม ปริมาณในสูตรนี้ยังไม่ได้ทดลองอบ และยังต้องตรวจสอบว่าสูตรตรงตามข้อกำหนดอาหารดั้งเดิมของสหภาพยุโรป (TSG) หรือไม่",
  },
  "kermainen-lohipata": {
    en: "Salmon and spinach bake together in a creamy sauce. Serve the casserole on its own or with vegetables on the side.",
    sv: "Lax och spenat tillagas tillsammans i en krämig sås i ugnen. Servera rätten som den är eller med grönsaker till.",
    th: "อบแซลมอนกับผักโขมในซอสครีม เสิร์ฟเป็นจานเดี่ยวหรือกินคู่กับผัก",
  },
  "kiinalainen-hirssipuuro-taateleilla": {
    fi: "Tuore inkivääri maustaa pehmeän hirssipuuron. Kulho viimeistellään taateleilla ja seesaminsiemenillä.",
    en: "Fresh ginger flavours this soft millet porridge, topped with dates and sesame seeds.",
    sv: "Färsk ingefära smaksätter den mjuka hirsgröten. Toppa med dadlar och sesamfrön.",
    th: "โจ๊กข้าวฟ่างเนื้อนุ่มหอมขิงสด โรยอินทผลัมและงาก่อนเสิร์ฟ",
  },
  "kiinalainen-jianbing-munaletty": {
    fi: "Ohut vehnälettu kypsyy pannulla kananmunan, kevätsipulin ja seesamin kanssa. Se taitetaan soijapaputahnan ympärille.",
  },
  "kiinalainen-katkarapu-wontonkeitto": {
    fi: "Inkiväärillä maustetut katkarapuwontonit tarjoillaan kuumassa liemessä paksoin kanssa.",
  },
  "kiinalainen-kevatsipulipannukakku": {
    fi: "Kevätsipuli ja seesamiöljy jäävät taikinan kerrosten väliin. Pannulla rapeiksi paistetut lohkot dipataan soijakastikkeeseen.",
    en: "Spring onion and sesame oil are rolled between layers of dough. Pan-fry until crisp and serve in wedges with soy sauce.",
    sv: "Salladslök och sesamolja kavlas in mellan degens lager. Stek bröden frasiga och servera i klyftor med soja.",
    th: "แป้งแผ่นสอดชั้นต้นหอมและน้ำมันงา ทอดจนกรอบ หั่นเป็นชิ้นแล้วจิ้มซีอิ๊ว",
  },
  "kiinalainen-musta-seesamipuuro": {
    fi: "Mustat seesaminsiemenet antavat jasmiiniriisipuuroon tumman värin. Soijamaito pehmentää makua, hunaja makeuttaa.",
    en: "Black sesame gives jasmine rice porridge its dark colour. Soy milk softens the flavour and honey adds sweetness.",
    sv: "Svart sesam ger jasminrisgröten dess mörka färg. Sojadryck rundar av smaken och honung ger sötma.",
    th: "โจ๊กข้าวหอมมะลิสีเข้มจากงาดำ เติมนมถั่วเหลืองให้รสนุ่มและน้ำผึ้งให้หวาน",
  },
  "kiinalainen-riisipuuro-kananmunalla": {
    fi: "Inkiväärillä maustetun sakean riisipuuron päälle nostetaan pehmeäksi kypsennetty muna ja silputtua kevätsipulia.",
    en: "Ginger flavours the thick rice porridge, which is topped with a softly cooked egg and spring onion.",
    sv: "Den tjocka risgröten får smak av ingefära och toppas med ett mjukkokt ägg och salladslök.",
    th: "โจ๊กข้าวข้นหอมขิง เสิร์ฟกับไข่เนื้อนุ่มและต้นหอมซอย",
  },
  "kiinalainen-soijamaito-aamiaisella": {
    fi: "Lämmin, suolainen soijajuoma maustetaan riisiviinietikalla, seesamiöljyllä ja kevätsipulilla.",
  },
  "kiinalainen-teehaudutetut-munat": {
    fi: "Keitettyjen munien kuoriin napautetaan säröjä, jotta mustalla teellä, soijalla ja tähtianiksella maustettu liemi pääsee kuoren alle.",
  },
  "kiinalainen-tomaattimunakas-riisilla": {
    fi: "Pannulla pehmenneet tomaatit muodostavat kastikkeen kananmunalle. Tarjoa seos pitkäjyväisen riisin päällä kevätsipulin kanssa.",
  },
  "korealainen-gyeran-mari-kasviksilla": {
    fi: "Porkkanalla ja kevätsipulilla maustettu munakas paistetaan ohuina kerroksina, rullataan pannulla ja viipaloidaan.",
    en: "Thin layers of omelette with carrot and spring onion are rolled in the pan and cut into slices.",
    sv: "Tunna lager omelett med morot och salladslök rullas ihop i pannan och skärs i skivor.",
    th: "ไข่ม้วนเกาหลีใส่แครอตและต้นหอม ค่อย ๆ ทอดไข่เป็นชั้นบางแล้วม้วนในกระทะก่อนหั่นเป็นชิ้น",
  },
  "korealainen-gyeranbap-riisikulho": {
    fi: "Lämpimän riisin päälle tulee paistettu muna, soijakastiketta ja pieneksi revittyä noria.",
  },
  "korealainen-yachaejuk-kasvisjuk": {
    fi: "Riisi haudutetaan sakeaksi puuroksi porkkanan ja kesäkurpitsan kanssa. Tilkka seesamiöljyä antaa maun lopuksi.",
    en: "Rice simmers into a thick porridge with carrot and courgette. A little sesame oil flavours it at the end.",
    sv: "Ris får koka till en tjock gröt med morot och zucchini. Lite sesamolja ger smak på slutet.",
    th: "ข้าวต้มเกาหลีเคี่ยวจนข้นกับแครอตและซูกินี เติมน้ำมันงาเล็กน้อยตอนท้าย",
  },
  "koshari": {
    fi: "Linssit, riisi ja makaroni tarjoillaan valkosipulisen tomaattikastikkeen ja ilman jauhotusta paistetun sipulin kanssa.",
    en: "Lentils, rice and macaroni are served with a garlicky tomato sauce and onions fried without a flour coating.",
    sv: "Linser, ris och makaroner serveras med vitlöksdoftande tomatsås och lök stekt utan mjölpanering.",
    th: "ถั่วเลนทิล ข้าว และมักกะโรนีเสิร์ฟกับซอสมะเขือเทศใส่กระเทียมและหอมทอดแบบไม่คลุกแป้ง",
  },
  "kreikkalainen-kanavuoka-oliiveilla": {
    fi: "Broilerin reisipalat, kirsikkatomaatit ja punasipuli kypsyvät samassa vuoassa kalamataoliivien, fetan ja oreganon kanssa.",
    en: "Chicken thighs, cherry tomatoes and red onion roast together with Kalamata olives, feta and oregano.",
    sv: "Kycklinglår, körsbärstomater och rödlök tillagas i samma form med kalamataoliver, feta och oregano.",
    th: "เนื้อสะโพกไก่ มะเขือเทศเชอร์รี และหอมแดงอบด้วยกันกับมะกอกคาลามาตา เฟตา และออริกาโน",
  },
  "lahi-ita-fattet-hummus": {
    fi: "Paahdetun pitaleivän päälle kasataan lämpimiä kikherneitä ja lusikoidaan tahinilla maustettua jogurttia.",
  },
  "lahi-ita-ful-medames": {
    fi: "Lämpimät härkäpavut maustetaan sitruunalla ja juustokuminalla. Tuore persilja lisätään juuri ennen tarjoilua.",
  },
  "lahi-ita-kikherne-shakshuka": {
    fi: "Kikherneet kypsyvät tomaattipohjassa kananmunien kanssa. Tuore persilja viimeistelee pannuruoan.",
  },
  "lahi-ita-kikhernejauho-yrttilettu": {
    fi: "Persilja, sipuli ja juustokumina maustavat kikhernejauhoista paistettavat ohuet letut.",
    en: "Parsley, onion and cumin flavour these thin chickpea flour pancakes.",
    sv: "Persilja, lök och spiskummin ger smak åt de tunna kikärtspannkakorna.",
    th: "แพนเค้กแป้งถั่วลูกไก่แผ่นบางใส่พาร์สลีย์ หัวหอม และยี่หร่า",
  },
  "lahi-ita-labneh-kulho-zaatarilla": {
    fi: "Paksu labneh-jogurtti saa päälleen kurkkua, oliiveja ja za’atar-mausteseosta.",
  },
  "lahi-ita-manakish-zaatarilla": {
    fi: "Pannulla paistettaviin vehnäleipiin tulee timjamia, seesaminsiemeniä ja oliiviöljyä. Jogurtti kuuluu taikinaan.",
  },
  "lahi-ita-menemen-sumakilla": {
    fi: "Kananmunat kypsyvät pannulla tomaatin ja vihreän paprikan seassa. Ripaus sumakkia antaa happaman säväyksen.",
  },
  "lahi-ita-pistaasijogurtti": {
    fi: "Ruusuvesi maustaa kylmän jogurtin, jonka pinnalle ripotellaan granaattiomenan siemeniä ja rouhittua pistaasia.",
    en: "Rose water scents the chilled yogurt, topped with pomegranate seeds and chopped pistachios.",
    sv: "Rosenvatten ger smak åt den kalla yoghurten som toppas med granatäppelkärnor och hackade pistagenötter.",
    th: "โยเกิร์ตเย็นหอมกลิ่นน้ำกุหลาบ โรยเมล็ดทับทิมและพิสตาชิโอสับ",
  },
  "lahi-ita-taatelipuuro-tahinilla": {
    fi: "Maitoon keitetyn kaurapuuron makeus tulee taateleista. Kardemumma ja seesamitahini syventävät makua.",
    en: "Dates sweeten this oat porridge cooked in milk. Cardamom and sesame tahini add depth.",
    sv: "Dadlar sötar havregröten som kokas i mjölk. Kardemumma och sesamtahini ger fylligare smak.",
    th: "ข้าวโอ๊ตต้มนมได้ความหวานจากอินทผลัม เพิ่มกลิ่นหอมด้วยกระวานและทาฮินี",
  },
  "lanttulaatikko-kermainen": {
    fi: "Soseutettu lanttu pehmennetään kuohukermalla ja voilla. Muskottipähkinä maustaa laatikon, johon ei lisätä makeutusta.",
    en: "Mashed swede is enriched with cream and butter, seasoned with nutmeg and baked without added sweetener.",
    sv: "Kålrotsmoset blir fylligt med grädde och smör och kryddas med muskot. Lådan bakas utan tillsatt sötning.",
    th: "รูตาบากาบดผสมวิปปิงครีมและเนย ปรุงด้วยลูกจันทน์เทศแล้วอบโดยไม่เติมสารให้ความหวาน",
  },
  "lohikeitto-kuohukermalla": {
    fi: "Lohi, purjo ja juurekset kypsyvät veteen keitetyssä lohikeitossa, joka saa täyteläisyytensä kuohukermasta.",
    en: "Salmon, leek and root vegetables cook in water and the soup is enriched with cream, without added stock.",
    sv: "Lax, purjolök och rotfrukter kokas i vatten utan fond. Vispgrädde gör soppan fyllig.",
    th: "ต้มแซลมอน ต้นกระเทียม และผักหัวในน้ำเปล่าโดยไม่เติมน้ำสต๊อก แล้วเติมวิปปิงครีมให้ซุปเข้มข้น",
  },
  "malesialainen-apam-balik": {
    fi: "Paksu pannulettu taitetaan maapähkinärouheen, maissinjyvien ja sokerin ympärille.",
  },
  "malesialainen-congee-inkivaarilla": {
    fi: "Riisi hautuu sakeaksi puuroksi, jonka maustavat raastettu inkivääri ja soijakastike. Kevätsipuli lisätään annoksen päälle.",
    en: "Ginger and soy sauce season the thick rice porridge. Finish with chopped spring onion.",
    sv: "Ingefära och soja smaksätter den tjocka risgröten. Toppa med hackad salladslök.",
    th: "โจ๊กข้าวข้นปรุงด้วยขิงขูดและซีอิ๊ว โรยต้นหอมซอยก่อนเสิร์ฟ",
  },
  "malesialainen-kaya-paahtoleipa": {
    fi: "Voilla sivellyn hapanjuuripaahtoleivän väliin levitetään kookosmaidosta, munasta ja sokerista keitettyä kayaa. Annoksen seurana on paistettu muna.",
  },
  "malesialainen-mee-goreng-aamunuudeleilla": {
    fi: "Vehnänuudelit paistetaan tofun, kananmunan ja pavunitujen kanssa ja maustetaan soijakastikkeella.",
    en: "Wheat noodles are stir-fried with tofu, eggs and bean sprouts, then seasoned with soy sauce.",
    sv: "Vetenudlar steks med tofu, ägg och böngroddar och smaksätts med soja.",
    th: "บะหมี่ข้าวสาลีผัดกับเต้าหู้ ไข่ และถั่วงอก ปรุงรสด้วยซีอิ๊ว",
  },
  "malesialainen-nasi-lemak-aamiaisella": {
    fi: "Kookosmaidossa kypsennetty riisi tarjoillaan tässä nasi lemak -versiossa kananmunan ja kurkun kanssa.",
    en: "In this version of nasi lemak, rice cooked in coconut milk is served with an egg and cucumber.",
    sv: "I den här varianten av nasi lemak serveras kokoskokt ris med ägg och gurka.",
    th: "นาซีเลอมักสูตรนี้เสิร์ฟข้าวหุงกะทิกับไข่และแตงกวา",
  },
  "marry-me-kanapasta": {
    fi: "Tavallinen vehnäspagetti tarjoillaan kermaisen kanakastikkeen kanssa. Aurinkokuivatut tomaatit, timjami ja parmesaani maustavat kastikkeen.",
    en: "Wheat spaghetti is served with a creamy chicken sauce flavoured with sun-dried tomatoes, thyme and Parmesan.",
    sv: "Vetespaghetti serveras med en krämig kycklingsås smaksatt med soltorkade tomater, timjan och parmesan.",
    th: "สปาเกตตีข้าวสาลีเสิร์ฟกับไก่ในซอสครีม ปรุงรสด้วยมะเขือเทศตากแห้ง ไทม์ และพาร์เมซาน",
  },
  "meksikolainen-aamiais-tacot-mustapavuilla": {
    fi: "Lämpimät maissitortillat täytetään mustapavuilla, paistetulla kananmunalla ja avokadolla.",
  },
  "meksikolainen-atole-maissipuuro": {
    fi: "Hieno maissijauho sakeuttaa maitoon keitettävän atole-tyylisen puuron. Kaneli ja vanilja antavat maun.",
  },
  "meksikolainen-huevos-a-la-mexicana": {
    fi: "Tomaatti, sipuli ja tuore jalapeño paistetaan pannulla ennen kuin kananmunat sekoitetaan mukaan.",
    en: "Tomato, onion and fresh jalapeño are sautéed before the eggs are stirred in.",
    sv: "Tomat, lök och färsk jalapeño steks innan äggen rörs ner.",
    th: "ผัดมะเขือเทศ หัวหอม และฮาลาเปญโญสดให้นุ่มก่อนใส่ไข่ลงไปคน",
  },
  "meksikolainen-huevos-divorciados": {
    fi: "Mustapapujen ja paistetun munan seurana on kaksi kastiketta. Punainen tomaattikastike tulee toiselle puolelle, vihreä salsa toiselle.",
  },
  "meksikolainen-kurpitsapuuro-piloncillolla": {
    fi: "Myskikurpitsa kypsyy kaurapuuron joukossa. Kaneli ja fariinisokeri tuovat puuroon mausteista makeutta.",
    en: "Butternut squash cooks with the oats. Cinnamon and brown sugar give the porridge a spiced sweetness.",
    sv: "Butternutpumpa kokas tillsammans med havregrynen. Kanel och farinsocker ger gröten kryddig sötma.",
    th: "ข้าวโอ๊ตต้มกับฟักทองบัตเตอร์นัต ปรุงหวานหอมด้วยอบเชยและน้ำตาลทรายแดง",
  },
  "meksikolainen-munakokkeli-pico-de-gallolla": {
    fi: "Lämpimille maissitortilloille jaetaan pehmeää munakokkelia ja tuoretta tomaatti-korianterilisuketta.",
  },
  "meksikolainen-quesadilla-sienilla": {
    fi: "Maissitortillan sisällä sulava mozzarella sitoo yhteen paistetut herkkusienet ja maissinjyvät.",
    en: "Melted mozzarella holds the sautéed mushrooms and sweetcorn together inside a corn tortilla.",
    sv: "Smält mozzarella binder samman stekta champinjoner och majs i en majstortilla.",
    th: "ตอร์ติยาข้าวโพดสอดไส้เห็ดแชมปิญองผัด เมล็ดข้าวโพด และมอสซาเรลลาที่ละลายเมื่อจี่",
  },
  "menemen": {
    fi: "Turkkilaisessa pannuruoassa kananmunat sekoitetaan pehmenneiden tomaattien ja vihreän paprikan joukkoon. Päälle ripotellaan persiljaa.",
    en: "Eggs are gently stirred into softened tomatoes and green peppers in this Turkish pan dish. Finish with fresh parsley.",
    sv: "I den turkiska pannrätten rörs äggen ner i mjuk tomat och grön paprika. Toppa med färsk persilja.",
    th: "เมเนเมนเป็นไข่ผัดแบบตุรกี คนไข่ลงในมะเขือเทศและพริกหวานเขียวที่ผัดจนนุ่ม แล้วโรยพาร์สลีย์สด",
  },
  "moo-ping-vhh": {
    fi: "Kookosmaidossa, valkosipulissa ja korianterinvarsissa marinoitu porsaan niska kypsyy pannulla. Koko marinadi kypsennetään lihan mukana.",
    en: "Pork shoulder marinated with coconut milk, garlic and coriander stems is pan-cooked with all of its marinade.",
    sv: "Fläskkarrén marineras med kokosmjölk, vitlök och korianderstjälkar och tillagas i pannan med all marinad.",
    th: "สันคอหมูหมักกะทิ กระเทียม และก้านผักชี แล้วปรุงในกระทะพร้อมน้ำหมักทั้งหมด",
  },
  "munakasmuffinit": {
    fi: "Uunissa paistettaviin munakasmuffineihin tulee pekonia, pinaattia ja cheddaria.",
    en: "Bacon, spinach and cheddar go into these oven-baked egg muffins.",
    sv: "De här ugnsbakade äggmuffinsen innehåller bacon, spenat och cheddar.",
    th: "มัฟฟินไข่อบใส่เบคอน ผักโขม และเชดดาร์",
  },
  "munakoiso-jauhelihavuoka-vhh": {
    fi: "Munakoisoviipaleet ja oreganolla maustettu jauheliha-tomaattikastike ladotaan vuokaan juustokuorrutteen alle.",
    en: "Aubergine slices and oregano-seasoned beef and tomato sauce are layered and baked under grated cheese.",
    sv: "Aubergineskivor varvas med nötfärs- och tomatsås smaksatt med oregano och gratineras med riven ost.",
    th: "มะเขือม่วงหั่นแผ่นวางสลับชั้นกับซอสเนื้อวัวบดและมะเขือเทศปรุงออริกาโน โรยชีสขูดแล้วอบ",
  },
  "munakokkeli": {
    fi: "Kuohukerma tekee voissa kypsennetystä munakokkelista täyteläisen. Viimeistele tuoreella ruohosipulilla.",
    en: "Cream and butter give these scrambled eggs a soft, rich texture. Finish with fresh chives.",
    sv: "Grädde och smör gör äggröran mjuk och fyllig. Toppa med färsk gräslök.",
    th: "ไข่คนใส่วิปปิงครีมแล้วกวนกับเนยจนเนื้อนุ่ม โรยกุยช่ายฝรั่งสดก่อนเสิร์ฟ",
  },
  "munatacot-huevos-rancheros": {
    fi: "Tortillan tilalla on ohut munakas. Täytteenä on savupaprikalla maustettua tomaattikastiketta, avokadoa ja cheddaria.",
    en: "Thin omelettes stand in for tortillas and hold smoky tomato sauce, avocado and cheddar.",
    sv: "Tunna omeletter får ersätta tortillabröden och fylls med rökig tomatsås, avokado och cheddar.",
    th: "ใช้ไข่เจียวแผ่นบางแทนตอร์ติยา แล้วใส่ซอสมะเขือเทศปรุงปาปริการมควัน อะโวคาโด และเชดดาร์",
  },
  "paprikainen-vhh-gulassi": {
    fi: "Naudanpaisti hautuu mureaksi paprikan, tomaatin ja juustokuminan kanssa. Tarjoa pata smetanan ja persiljan kera.",
    en: "Beef simmers with sweet pepper, tomato and cumin until tender. Serve with sour cream and parsley.",
    sv: "Nötköttet får sjuda mört med paprika, tomat och spiskummin. Servera med smetana och persilja.",
    th: "เนื้อวัวตุ๋นจนนุ่มกับพริกหวาน มะเขือเทศ และยี่หร่า เสิร์ฟกับครีมเปรี้ยวสเมตานาและพาร์สลีย์",
  },
  "paprikauunimunakkaat": {
    fi: "Punaiset paprikat toimivat uunissa pieninä vuokina kananmunalle ja juustolle. Päälle ripotellaan ruohosipulia.",
    en: "Red peppers make edible baking cups for eggs and grated cheese. Chives go on top.",
    sv: "Röda paprikor blir små formar för ägg och riven ost. Toppa med gräslök.",
    th: "ใช้พริกหวานแดงเป็นถ้วยอบไข่กับชีสขูด แล้วโรยกุยช่ายฝรั่ง",
  },
  "parsakaali-sinihomejuustofrittata": {
    fi: "Parsakaali ja sipuli kypsyvät ensin pannulla. Kerma, kananmuna ja sinihomejuusto sitovat ne uunissa frittataksi.",
    en: "Broccoli and onion are softened in a pan before baking with eggs, cream and blue cheese.",
    sv: "Broccoli och lök mjuknar i stekpannan innan de gräddas med ägg, grädde och blåmögelost.",
    th: "ผัดบรอกโคลีกับหัวหอมให้นุ่มก่อนอบกับไข่ วิปปิงครีม และบลูชีส",
  },
  "pohjoisafrikkalainen-harcha-juustolla": {
    fi: "Mannasuurimotaikinasta taputellut leipäkiekot paistetaan pannulla ja tarjoillaan maustamattoman tuorejuuston kanssa.",
    th: "ฮาร์ชาสไตล์แอฟริกาเหนือทำจากแป้งเซโมลินา จี่ในกระทะแล้วเสิร์ฟกับครีมชีส",
  },
  "pohjoisafrikkalainen-harissa-shakshuka": {
    fi: "Munat kypsyvät tomaatti-paprikapohjassa, jolle tuoreesta chilistä ja valkosipulista tehty harissa antaa potkua.",
    en: "Eggs cook in tomatoes and red peppers, spiced with homemade harissa made from fresh chillies and garlic.",
    sv: "Äggen tillagas med tomat och röd paprika, kryddade med hemgjord harissa på färsk chili och vitlök.",
    th: "ไข่สุกในซอสมะเขือเทศกับพริกหวานแดง เพิ่มรสเผ็ดด้วยฮาริสสาทำเองจากพริกสดและกระเทียม",
  },
  "pohjoisafrikkalainen-kuskus-aamiaiskulho": {
    fi: "Lämpimän kuskusin päälle lusikoidaan jogurttia ja ripotellaan pilkottuja taateleita ja manteleita.",
    en: "Warm couscous is topped with yogurt, chopped dates and almonds.",
    sv: "Varm couscous toppas med yoghurt, hackade dadlar och mandel.",
    th: "คูสคูสอุ่น ๆ ราดโยเกิร์ตและโรยอินทผลัมกับอัลมอนด์สับ",
  },
  "pohjoisafrikkalainen-lablabi": {
    fi: "Lämpimän kikhernekeiton alla on pitaleipää ja päällä kananmuna. Juustokumina maustaa liemen.",
    en: "Cumin flavours this warm chickpea soup, served over pita and topped with an egg.",
    sv: "Spiskummin smaksätter den varma kikärtssoppan som serveras över pitabröd med ett ägg på toppen.",
    th: "ซุปถั่วลูกไก่ร้อนปรุงยี่หร่า ราดบนขนมปังพิตาและวางไข่ด้านบน",
  },
  "pohjoisafrikkalainen-taatelipuuro-appelsiinilla": {
    fi: "Taatelit ja appelsiinipalat sekoitetaan lämpimään mannapuuroon kanelin kanssa.",
    en: "Dates, orange pieces and cinnamon are stirred into warm semolina porridge.",
    sv: "Dadlar, apelsinbitar och kanel rörs ner i den varma mannagrynsgröten.",
    th: "โจ๊กเซโมลินาอุ่น ๆ คลุกกับอินทผลัม ส้มหั่นชิ้น และอบเชย",
  },
  "raejuusto-uunimunakas": {
    fi: "Raejuusto ja ruokakerma antavat uunimunakkaalle pehmeän rakenteen. Ruohosipuli maustaa munaseoksen.",
    en: "Cottage cheese and cream give this baked omelette a soft texture. Fresh chives season the eggs.",
    sv: "Keso och matlagningsgrädde ger ugnsomeletten en mjuk konsistens. Färsk gräslök smaksätter äggen.",
    th: "ไข่อบเนื้อนุ่มจากคอตเทจชีสและครีมปรุงอาหาร เพิ่มกลิ่นหอมด้วยกุยช่ายฝรั่งสด",
  },
  "ratatouille": {
    fi: "Munakoiso, kesäkurpitsa ja paprika hautuvat tomaatin kanssa pehmeiksi. Timjami ja tuore basilika maustavat kasvispadan.",
    en: "Aubergine, courgette and peppers simmer with tomatoes until tender. Thyme and fresh basil flavour the stew.",
    sv: "Aubergine, zucchini och paprika får sjuda mjuka med tomat. Timjan och färsk basilika ger smak åt grytan.",
    th: "มะเขือม่วง ซูกินี และพริกหวานเคี่ยวกับมะเขือเทศจนนุ่ม ปรุงกลิ่นด้วยไทม์และโหระพาฝรั่งสด",
  },
  "rogan-josh": {
    fi: "Lampaanlapa hautuu jogurttikastikkeessa, jota maustavat tuore inkivääri, kaneli ja kokonaiset kardemummakodat.",
    en: "Lamb shoulder simmers in a yogurt sauce scented with fresh ginger, cinnamon and whole cardamom pods.",
    sv: "Lammbogen får sjuda i en yoghurtsås med färsk ingefära, kanel och hela kardemummakapslar.",
    th: "เนื้อหัวไหล่แกะตุ๋นในซอสโยเกิร์ตหอมขิงสด อบเชย และกระวานทั้งฝัก",
  },
  "shakshuka": {
    fi: "Kananmunat kypsyvät tomaatti-paprikakastikkeessa, joka saa makunsa juustokuminasta, savupaprikasta ja chilistä.",
    en: "The eggs cook in a tomato and red pepper sauce seasoned with cumin, smoked paprika and chilli.",
    sv: "Äggen tillagas i en tomat- och paprikasås kryddad med spiskummin, rökt paprika och chili.",
    th: "ไข่สุกในซอสมะเขือเทศกับพริกหวานแดง ปรุงด้วยยี่หร่า ปาปริการมควัน และพริก",
  },
  "shoyu-kanakeitto-konjac": {
    fi: "Konjacnuudelit, broilerin reisiliha ja herkkusienet tarjotaan soijalla, inkiväärillä ja riisiviinietikalla maustetussa kanaliemessä.",
    en: "Konjac noodles, chicken thighs and mushrooms are served in chicken broth seasoned with soy, ginger and rice vinegar.",
    sv: "Konjaknudlar, kycklinglår och champinjoner serveras i kycklingbuljong med soja, ingefära och risvinäger.",
    th: "เส้นบุก สะโพกไก่ และเห็ดแชมปิญองเสิร์ฟในน้ำซุปไก่ปรุงซีอิ๊ว ขิง และน้ำส้มสายชูหมักจากข้าว",
  },
  "sitruuna-yrttikana-parsa": {
    fi: "Broilerin rintafileet ja vihreä parsa paahtuvat samassa vuoassa sitruunan, timjamin ja voin kanssa.",
    en: "Chicken breasts and green asparagus roast together with lemon, thyme and butter.",
    sv: "Kycklingfilé och grön sparris tillagas i samma form med citron, timjan och smör.",
    th: "อกไก่และหน่อไม้ฝรั่งเขียวอบในถาดเดียวกันกับเลมอน ไทม์ และเนย",
  },
  "som-tam-vhh-kurkkuna": {
    fi: "Kurkku korvaa vihreän papaijan tässä som tam -versiossa. Limetti, chili ja kalakastike maustavat salaatin, ja maapähkinät tuovat rapeutta.",
    en: "Cucumber takes the place of green papaya. Lime, chilli and fish sauce season the salad, with peanuts for crunch.",
    sv: "Gurka ersätter grön papaya. Lime, chili och fisksås smaksätter salladen, och jordnötter ger tuggmotstånd.",
    th: "ส้มตำสูตรนี้ใช้แตงกวาแทนมะละกอดิบ ปรุงด้วยมะนาว พริก และน้ำปลา โรยถั่วลิสงให้กรุบกรอบ",
  },
  "tabbouleh": {
    fi: "Keitetty bulgur yhdistetään lämpimään salaattiin tomaatin, lehtipersiljan, mintun ja sitruunamehun kanssa.",
    en: "Cooked bulgur is tossed with tomato, flat-leaf parsley, mint and lemon juice for a warm salad.",
    sv: "Kokt bulgur blandas med tomat, bladpersilja, mynta och citronsaft till en varm sallad.",
    th: "บูลกูร์ต้มคลุกกับมะเขือเทศ พาร์สลีย์ใบแบน สะระแหน่ และน้ำเลมอนเป็นสลัดอุ่น",
  },
  "taytetyt-paprikat-vhh": {
    fi: "Punaiset paprikat täytetään tomaattisella naudan jauhelihalla ja paistetaan uunissa juustokuorrutteen alla.",
    en: "Red peppers are filled with beef mince in tomato sauce and baked with a layer of grated cheese.",
    sv: "Röda paprikor fylls med nötfärs i tomatsås och gratineras med riven ost.",
    th: "พริกหวานแดงสอดไส้เนื้อวัวบดผัดกับมะเขือเทศ โรยชีสขูดแล้วอบ",
  },
  "thai-jok-kanalla": {
    fi: "Pitkään haudutettuun riisipuuroon lisätään broileria ja tuoretta inkivääriä. Jok tarjoillaan kypsennetyn kananmunan kanssa.",
    en: "Chicken and fresh ginger cook in slow-simmered rice porridge. Serve the jok with a cooked egg.",
    sv: "Kyckling och färsk ingefära får koka med i den långkokta risgröten. Servera med ett tillagat ägg.",
    th: "โจ๊กข้าวเคี่ยวจนข้น ใส่อกไก่และขิงสด เสิร์ฟพร้อมไข่ที่ปรุงสุกแยก",
  },
  "thai-kai-jiao-yrteilla": {
    fi: "Rapeareunainen thaimaalainen munakas maustetaan kalakastikkeella, thaibasilikalla ja kevätsipulilla.",
    en: "This crisp-edged Thai omelette gets its flavour from fish sauce, Thai basil and spring onion.",
    sv: "Den thailändska omeletten får frasiga kanter och smak av fisksås, thaibasilika och salladslök.",
    th: "ไข่เจียวขอบกรอบ ปรุงรสด้วยน้ำปลา ใส่โหระพาและต้นหอม",
  },
  "thai-kananmunat-kookoscurryssa": {
    fi: "Kananmunat tarjoillaan punaisella currytahnalla maustetussa kookos-tomaattikastikkeessa keitetyn riisin kanssa.",
  },
  "thai-khao-tom-katkaravuilla": {
    fi: "Jasmiiniriisistä ja katkaravuista syntyy keitto, jonka kanaliemi maustetaan valkosipulilla ja inkiväärillä.",
  },
  "thai-kookosriisi-mangolla": {
    fi: "Kookosmaidolla maustettu jasmiiniriisi tarjoillaan tuoreen mangon ja seesaminsiementen kanssa.",
    en: "Coconut-scented jasmine rice is served with fresh mango and sesame seeds.",
    sv: "Jasminris kokt med kokosmjölk serveras med färsk mango och sesamfrön.",
    th: "ข้าวหอมมะลิหุงกะทิเสิร์ฟกับมะม่วงสดและเมล็ดงา",
  },
  "thai-maissifritterit": {
    fi: "Kokonaiset maissinjyvät ja thaibasilika sekoitetaan taikinaan, josta paistetaan pieniä suolaisia lettuja.",
  },
  "thai-papaijajogurtti": {
    fi: "Papaijapalat ja tuore kookoksen hedelmäliha tarjoillaan jogurtin kanssa, ja limettimehu raikastaa annoksen.",
    en: "Papaya and fresh coconut are served with yogurt and a squeeze of lime.",
    sv: "Papaya och färskt kokoskött serveras med yoghurt och en skvätt limesaft.",
    th: "มะละกอและเนื้อมะพร้าวสดเสิร์ฟกับโยเกิร์ต เติมน้ำมะนาวให้รสสดชื่น",
  },
  "thai-porsasjok": {
    fi: "Porsaan jauheliha kypsennetään sakeassa riisipuurossa inkiväärin kanssa. Puurokulho viimeistellään kananmunalla.",
    en: "Pork mince cooks in thick rice porridge with ginger. Each bowl is topped with a cooked egg.",
    sv: "Fläskfärs tillagas med ingefära i den tjocka risgröten. Toppa varje skål med ett tillagat ägg.",
    th: "โจ๊กข้าวข้นต้มกับหมูบดและขิง เสิร์ฟแต่ละชามพร้อมไข่ที่ปรุงสุกแยก",
  },
  "thai-riisinuudelikeitto-aamuksi": {
    fi: "Ohuet riisivermisellit ja broileri tarjoillaan kanaliemessä limetin ja tuoreen korianterin kanssa.",
    en: "Fine rice vermicelli and chicken are served in chicken broth with lime and fresh coriander.",
    sv: "Tunna risnudlar och kyckling serveras i kycklingbuljong med lime och färsk koriander.",
    th: "เส้นหมี่ข้าวกับไก่ในน้ำซุปไก่ ปรุงด้วยมะนาวและผักชีสด",
  },
  "thai-roti-munalla-banaanilla": {
    fi: "Banaani ja kookosmaito sekoitetaan munataikinaan, josta paistetaan ohuita lettuja pannulla.",
  },
  "tonnikalamunakkaat-uunissa": {
    fi: "Tonnikala, emmental ja tilli maustavat muffinivuoissa paistuvat pienet munakkaat.",
    en: "These little omelettes bake in muffin tins with tuna, Emmental and fresh dill.",
    sv: "De små omeletterna gräddas i muffinsformar med tonfisk, emmentaler och färsk dill.",
    th: "ไข่อบชิ้นเล็กใส่ทูน่า ชีสเอ็มเมนทัล และผักชีลาวสด อบในพิมพ์มัฟฟิน",
  },
  "tortilla-de-patatas": {
    fi: "Tässä espanjalaisessa perunamunakkaassa perunat esikeitetään ennen kuin ne yhdistetään sipuliin ja munaan.",
    en: "For this Spanish omelette, the potatoes are boiled before being mixed with onion and eggs.",
    sv: "Till den här spanska omeletten förkokas potatisen innan den blandas med lök och ägg.",
    th: "ไข่เจียวมันฝรั่งแบบสเปนสูตรนี้ต้มมันฝรั่งก่อนนำไปผสมกับหัวหอมและไข่",
  },
  "uunikanapasta-kesakurpitsa": {
    fi: "Kesäkurpitsanauhat korvaavat pastan kermaisessa kanavuoassa. Kirsikkatomaatit ja basilika maustavat kastiketta.",
    en: "Courgette ribbons take the place of pasta in this creamy chicken bake with cherry tomatoes and basil.",
    sv: "Zucchiniband ersätter pastan i den krämiga kycklinggratängen med körsbärstomater och basilika.",
    th: "ซูกินีฝานเป็นเส้นใช้แทนพาสต้าในไก่อบซอสครีม ใส่มะเขือเทศเชอร์รีและโหระพาฝรั่ง",
  },
  "uunilohi-smetanakuorrutteella": {
    fi: "Lohen pinnalle levitetään smetanaa, jossa maistuvat sitruuna, tuore tilli ja mustapippuri. Purjo kypsyy kalan kanssa uunissa.",
    en: "Salmon and leek bake under a smetana topping flavoured with lemon, fresh dill and black pepper.",
    sv: "Lax och purjolök bakas under ett täcke av smetana smaksatt med citron, färsk dill och svartpeppar.",
    th: "แซลมอนอบกับต้นกระเทียม ปาดหน้าด้วยครีมเปรี้ยวสเมตานาปรุงเลมอน ผักชีลาวสด และพริกไทยดำ",
  },
  "uunimuna-avokadot": {
    fi: "Kananmunat kypsyvät uunissa avokadonpuolikkaissa. Sitruunamehu ja ruohosipuli lisätään juuri ennen tarjoilua.",
  },
  "uunimunat-pinaatilla": {
    fi: "Pienissä uunivuoissa kypsyvien munien alla on pinaattia ja kuohukermaa. Emmental ja muskottipähkinä viimeistelevät annokset.",
    en: "Eggs bake in small dishes over spinach and cream, with Emmental and a pinch of nutmeg.",
    sv: "Äggen bakas i små formar på en bädd av spenat och grädde, med emmentaler och lite muskot.",
    th: "ไข่อบในถ้วยเล็กบนผักโขมและวิปปิงครีม ใส่ชีสเอ็มเมนทัลและลูกจันทน์เทศ",
  },
  "uuniporsas-kermakastikkeessa-vhh": {
    fi: "Kasslerin vuokanesteestä syntyy sipulinen pannukastike, joka viimeistellään kuohukermalla ja voilla.",
    en: "The roasting juices from the pork shoulder make an onion pan sauce, finished with cream and butter.",
    sv: "Skyn från den ugnsstekta karrén blir en löksås som rundas av med grädde och smör.",
    th: "น้ำจากถาดอบสันคอหมูนำมาทำซอสหัวหอม เติมวิปปิงครีมและเนยให้เข้มข้น",
  },
  "valimerellinen-farinata-aamupalaksi": {
    fi: "Uunissa paistettavan kikhernepaistoksen pinnalle asetellaan tomaattia ja vihreitä oliiveja. Rosmariini maustaa taikinan.",
    en: "Rosemary flavours the chickpea batter, which bakes under a layer of tomatoes and green olives.",
    sv: "Rosmarin smaksätter kikärtssmeten som gräddas med tomat och gröna oliver på toppen.",
    th: "แป้งถั่วลูกไก่ผสมโรสแมรี แต่งหน้าด้วยมะเขือเทศและมะกอกเขียวก่อนนำไปอบ",
  },
  "valimerellinen-halloumi-tomaattileipa": {
    fi: "Hapanjuurileivän seurana tarjoillaan pannulla paistettua halloumia, tuoretta tomaattia ja vihreitä oliiveja.",
  },
  "valimerellinen-jogurttikulho-hunajalla": {
    fi: "Tuoreet viikunat, rouhitut saksanpähkinät ja hunaja täydentävät kreikkalaista jogurttia.",
    en: "Fresh figs, chopped walnuts and honey go over thick Greek yogurt.",
    sv: "Färska fikon, hackade valnötter och honung serveras med tjock grekisk yoghurt.",
    th: "โยเกิร์ตกรีกเนื้อข้นเสิร์ฟกับมะเดื่อสด วอลนัตสับ และน้ำผึ้ง",
  },
  "valimerellinen-menemen-fetalla": {
    fi: "Tomaatti ja vihreä paprika pehmenevät pannulla ennen munien lisäämistä. Ruoan päälle murustellaan fetaa.",
  },
  "valimerellinen-pinaatti-fetashakshuka": {
    fi: "Kananmunat hyytyvät tomaatti-pinaattipannulla kannen alla. Feta murustellaan kuuman ruoan päälle.",
  },
  "valimerellinen-ricotta-persikkakulho": {
    fi: "Kylmä ricotta tarjoillaan persikkaviipaleiden, sitruunamehun ja suolaamattomien pistaasien kanssa.",
    en: "Chilled ricotta is served with sliced peaches, lemon juice and unsalted pistachios.",
    sv: "Kall ricotta serveras med persikoskivor, citronsaft och osaltade pistagenötter.",
    th: "ริคอตตาเย็นเสิร์ฟกับพีชหั่นชิ้น น้ำเลมอน และพิสตาชิโอไม่ใส่เกลือ",
  },
  "valimerellinen-tahinipuuro": {
    fi: "Seesamitahini tuo kaurapuuroon pähkinäistä makua. Hunaja ja appelsiini antavat makeutta.",
    en: "Tahini gives the oats a nutty flavour. Orange and honey add sweetness.",
    sv: "Tahini ger havregröten en nötig smak. Apelsin och honung ger sötma.",
    th: "โจ๊กข้าวโอ๊ตหอมงาจากทาฮินี ได้รสหวานจากส้มและน้ำผึ้ง",
  },
  "valimerellinen-tortilla-espanola-aamupalaksi": {
    fi: "Esikeitetty peruna ja paistettu keltasipuli sekoitetaan munaan espanjalaista pannumunakasta varten.",
    en: "The potatoes are boiled before they go into the pan with fried onion and eggs.",
    sv: "Potatisen förkokas innan den blandas med stekt lök och ägg till omeletten.",
    th: "ต้มมันฝรั่งก่อนนำมาผสมกับหัวหอมผัดและไข่เพื่อทำไข่เจียวสเปน",
  },
  "vhh-lihamureke": {
    fi: "Raastettu kesäkurpitsa ja kuohukerma mehevöittävät naudan jauhelihasta leivotun murekkeen.",
    en: "Grated courgette and cream keep this beef meatloaf moist.",
    sv: "Riven zucchini och grädde gör köttfärslimpan på nötfärs saftig.",
    th: "มีตโลฟเนื้อวัวบดใส่ซูกินีขูดและวิปปิงครีมเพื่อให้เนื้อชุ่มฉ่ำ",
  },
  "vietnamilainen-banh-mi-munalla": {
    fi: "Lämpimän patongin väliin tulee paistettua kananmunaa sekä rapeaa kurkkua ja tuoretta porkkanaa.",
  },
  "vietnamilainen-kahvijogurtti-banaanilla": {
    fi: "Jäähtynyt kahvi, jogurtti ja makeutettu kondensoitu maito sekoitetaan juotavaksi. Tarjoa viileänä banaaniviipaleiden kanssa.",
  },
  "vietnamilainen-pho-ga-aamuksi": {
    fi: "Tähtianis ja inkivääri maustavat broilerin keitinliemen, joka kaadetaan riisinuudeleiden päälle.",
    en: "Star anise and ginger flavour the chicken broth, which is poured over rice noodles.",
    sv: "Stjärnanis och ingefära ger smak åt kycklingbuljongen som hälls över risnudlarna.",
    th: "น้ำต้มไก่หอมโป๊ยกั๊กและขิง ราดลงบนเส้นก๋วยเตี๋ยวข้าว",
  },
  "yangzhou-paistettu-riisi": {
    fi: "Vastakeitetty jasmiiniriisi paistetaan kuumalla pannulla kananmunan, katkarapujen, kinkun, herneiden ja kevätsipulin kanssa.",
    en: "Freshly cooked jasmine rice is fried in a hot pan with eggs, shrimp, ham, peas and spring onion.",
    sv: "Nykokt jasminris steks i het panna med ägg, räkor, skinka, ärtor och salladslök.",
    th: "ข้าวหอมมะลิหุงใหม่ผัดในกระทะร้อนกับไข่ กุ้ง แฮม ถั่วลันเตา และต้นหอม",
  },
  "yrttituorejuusto-kinkkurullat": {
    fi: "Kinkkusiivuihin kääritään ruohosipulilla maustettua tuorejuustoa sekä paprikaa, kurkkua ja salaattia.",
  },
};

const titles: LocalizedCopy = {
  "kermainen-lohipata": { th: "แซลมอนอบซอสครีม" },
  "butter-chicken": {
    fi: "Butter chicken hunajalla",
    en: "Butter chicken with honey",
    sv: "Butter chicken med honung",
    th: "บัตเตอร์ชิกเกนใส่น้ำผึ้ง",
  },
  "chili-con-carne-kukkakaaliriisi": {
    fi: "Chili con carne kukkakaaliriisillä",
    sv: "Chili con carne med blomkålsris",
    en: "Chili con carne with cauliflower rice",
    th: "ชิลีคอนคาร์เนเสิร์ฟกับข้าวดอกกะหล่ำ",
  },
  "indonesialainen-serabi-kookospannukakku": {
    fi: "Serabi – kookospannukakut",
  },
  "italian-pata": {
    fi: "Italialainen jauheliha-kesäkurpitsapata",
    en: "Italian-style beef and courgette pan",
    sv: "Italiensk köttfärs- och zucchinipanna",
    th: "เนื้อบดกับซูกินีสไตล์อิตาเลียน",
  },
  "kana-fajita-pelti": {
    fi: "Kana-fajitapelti avokadokastikkeella",
    sv: "Kycklingfajitas på plåt med avokadosås",
    en: "Sheet-pan chicken fajitas with avocado dressing",
    th: "ฟาฮิต้าไก่อบถาดพร้อมซอสอะโวคาโด",
  },
  "kanakeitto-pinaatti-sitruuna": {
    en: "Creamy chicken soup with spinach and lemon",
    fi: "Kermainen kanakeitto pinaatilla ja sitruunalla",
    sv: "Krämig kycklingsoppa med spenat och citron",
    th: "ซุปไก่ครีมผักโขมและเลมอน",
  },
  "meksikolainen-quesadilla-sienilla": {
    fi: "Aamiaisquesadilla sienillä ja maissilla",
    en: "Breakfast quesadilla with mushrooms and corn",
    sv: "Frukostquesadilla med svamp och majs",
    th: "เคซาดียามื้อเช้าใส่เห็ดและข้าวโพด",
  },
  "munakasmuffinit": {
    en: "Egg muffins with bacon, spinach and cheese",
    fi: "Munakasmuffinit",
    sv: "Äggmuffins med bacon, spenat och ost",
    th: "มัฟฟินไข่ใส่เบคอน ผักโขม และชีส",
  },
  "munakoiso-jauhelihavuoka-vhh": {
    en: "Aubergine and beef bake",
    sv: "Aubergine- och köttfärsgratäng",
    fi: "Munakoiso-jauhelihavuoka",
    th: "มะเขือม่วงอบเนื้อบด",
  },
  "munakokkeli": {
    en: "Creamy scrambled eggs",
    sv: "Krämig äggröra",
    fi: "Munakokkeli",
    th: "ไข่คนเนื้อนุ่ม",
  },
  "paprikauunimunakkaat": {
    en: "Baked bell pepper omelets",
    fi: "Paprikauunimunakkaat",
    sv: "Ugnsomeletter i paprika",
    th: "พริกหวานอบไข่",
  },
  "parsakaali-sinihomejuustofrittata": {
    en: "Broccoli and blue cheese frittata",
    sv: "Broccoli- och blåmögelostfrittata",
    fi: "Parsakaali-sinihomejuustofrittata",
    th: "ฟริตตาตาบรอกโคลีบลูชีส",
  },
  "pohjoisafrikkalainen-harissa-shakshuka": {
    fi: "Shakshuka kotiharissalla",
    sv: "Shakshuka med hemgjord färsk harissa",
    en: "Shakshuka with homemade fresh harissa",
    th: "ชักชูกากับฮาริสซาสดทำเอง",
  },
  "raejuusto-uunimunakas": {
    sv: "Mjuk ugnsomelett med keso",
    fi: "Pehmeä raejuusto-uunimunakas",
    en: "Soft cottage cheese omelette bake",
    th: "ไข่อบคอตเทจชีสเนื้อนุ่ม",
  },
  "som-tam-vhh-kurkkuna": {
    en: "Cucumber som tam",
    fi: "Som tam kurkusta",
    sv: "Som tam med gurka",
    th: "ส้มตำแตงกวา",
  },
  "thai-kai-jiao-yrteilla": {
    en: "Thai herb omelette",
    sv: "Thailändsk örtomelett",
    fi: "Thaimaalainen munakas yrteillä",
    th: "ไข่เจียวไทยใส่สมุนไพร",
  },
  "thai-kookosriisi-mangolla": {
    en: "Coconut jasmine rice with mango and sesame",
    sv: "Kokosris med mango och sesam",
    fi: "Kookosriisi mangolla ja seesamilla",
    th: "ข้าวหอมมะลิกะทิกับมะม่วงและงา",
  },
  "thai-riisinuudelikeitto-aamuksi": {
    en: "Thai breakfast rice vermicelli soup",
    sv: "Thailändsk risnudelsoppa till frukost",
    fi: "Thaimaalainen riisinuudelikeitto aamuksi",
    th: "ก๋วยเตี๋ยวเส้นหมี่น้ำไก่สไตล์ไทยสำหรับมื้อเช้า",
  },
  "tonnikalamunakkaat-uunissa": {
    en: "Mini baked tuna omelettes",
    fi: "Pienet tonnikalamunakkaat uunissa",
    sv: "Små tonfiskomeletter i ugn",
    th: "ไข่เจียวทูน่าอบถ้วยเล็ก",
  },
  "uunikanapasta-kesakurpitsa": {
    fi: "Uunikanapasta kesäkurpitsasuikaleilla",
    th: "ไก่อบกับเส้นซูกินีแทนพาสต้า",
    en: "Baked chicken with courgette ribbons",
    sv: "Ugnskyckling med zucchiniband",
  },
  "uunimuna-avokadot": {
    fi: "Uunimuna-avokadot",
  },
  "uunimunat-pinaatilla": {
    en: "Baked eggs with spinach",
    sv: "Ugnsägg med spenat",
    fi: "Uunimunat pinaatilla",
    th: "ไข่อบผักโขม",
  },
  "uuniporsas-kermakastikkeessa-vhh": {
    fi: "Uuniporsas kermaisella pannukastikkeella",
  },
  "valimerellinen-tortilla-espanola-aamupalaksi": {
    th: "ตอร์ตียาเอสปันญอลาแบบต้มมันฝรั่งก่อน",
  },
  "vhh-lihamureke": {
    fi: "Mehevä VHH-lihamureke",
  },
};

const useReviewedSearchCopy = new Set([
  "indonesialainen-nasi-uduk-aamiaisella",
  "indonesialainen-pisang-goreng-aamiaiseksi",
  "karibia-jamaikalainen-munakokkeli",
  "karibia-maissipuuro-kookoksella",
  "kiinalainen-tomaattimunakas-riisilla",
  "lahi-ita-kikherne-shakshuka",
  "meksikolainen-atole-maissipuuro",
  "thai-khao-tom-katkaravuilla",
  "vietnamilainen-banh-mi-munalla",
]);

export function publicRecipeDescription(id: string, slug: string, locale: RecipeLocale): string | undefined {
  return descriptions[id]?.[locale] ?? (useReviewedSearchCopy.has(id) ? recipeSeoDescriptions[slug]?.[locale] : undefined);
}

export function publicRecipeTitle(id: string, locale: RecipeLocale, title: string): string {
  return titles[id]?.[locale] ?? title;
}

const includedInEstimate: Readonly<Record<string, string>> = {
  "munakasmuffinit": "talteen otettu pekonirasva",
  "munakokkeli": "paistamiseen käytetty voi",
  "tonnikalamunakkaat-uunissa": "munaseokseen käytetty kerma",
  "thai-kai-jiao-yrteilla": "pannulle mitattu rypsiöljy",
  "uunimuna-avokadot": "mahdollinen erillisessä vuoassa kypsennetty munaseos",
  "uunimunat-pinaatilla": "vuokiin käytetty voi",
  "vhh-lihamureke": "murekkeesta irtoava paistoneste",
  "uuniporsas-kermakastikkeessa-vhh": "vuokanesteestä tehty kermakastike",
};
const oldEstimateParagraph: Record<RecipeLocale, RegExp> = {
  fi: /^Syö kaikki luetellut ainekset ja kastike\/pannuneste.*mittaamatonta kypsennyshävikkiä ei vähennetä\.$/s,
  en: /^Divide and consume all (?:the )?listed ingredients.*unmeasured cooking losses are not deducted\.$/s,
  sv: /^Fördela och ät (?:alla|samtliga) angivna ingredienser.*omätta tillagningsförluster dras inte av\.$/s,
  th: /^แบ่งส่วนผสม.*โดยถือว่ารับประทานครบ.*การสูญเสีย.*ไม่ได้วัดจริง$/s,
};
const estimateNote = {
  en: "The nutrition estimate uses the raw ingredients, including any sauce and cooking juices, divided by the stated number of servings. Cooking losses are deducted only if measured.",
  sv: "Näringsvärdena uppskattas utifrån de råa ingredienserna, inklusive eventuell sås och steksky, fördelade på det angivna antalet portioner. Tillagningsförluster dras av endast om de har mätts.",
  th: "ค่าประมาณทางโภชนาการคำนวณจากวัตถุดิบดิบ รวมซอสและน้ำจากการปรุง แล้วหารตามจำนวนเสิร์ฟที่ระบุ หักเฉพาะการสูญเสียระหว่างปรุงที่มีการวัด",
};
const obsoleteDonenessTip: Record<RecipeLocale, RegExp> = {
  fi: /^- Tarkista kypsyys ja mausta lopuksi oman maun mukaan\.$/m,
  en: /^- Check for doneness and finally season according to your own taste\.$/m,
  sv: /^[-–] Kontrollera om de är färdiga och krydda till sist efter egen smak\.$/m,
  th: /^- ตรวจสอบความสุก(?:และปรุงรสตามชอบ(?:ในตอนท้าย)?|แล้วจึงปรุงรสตามรสนิยมของคุณเอง)[.]?$/m,
};
const blueberryTip: Record<RecipeLocale, string> = {
  fi: "- Tarkista kypsyys paiston lopussa. Anna piirakan jäähtyä ennen leikkaamista.",
  en: "- Check the pie towards the end of baking. Let it cool before slicing.",
  sv: "- Kontrollera att pajen är färdig mot slutet av gräddningen. Låt den svalna innan du skär upp den.",
  th: "- ตรวจดูว่าพายสุกหรือยังเมื่อใกล้ครบเวลาอบ พักให้เย็นก่อนตัด",
};
const flourNote: Record<RecipeLocale, string> = {
  fi: "Jos 20 g ei riitä kaulintaan, tarvittava jauhomäärä on vielä varmistettava koeleivonnassa.",
  en: "If 20 g is not enough for rolling, the amount needed still has to be checked in a test bake.",
  sv: "Om 20 g inte räcker till kavlingen behöver mängden kontrolleras vid en provbakning.",
  th: "หากแป้งสำหรับรีด 20 กรัมไม่พอ ต้องทดลองอบเพื่อยืนยันปริมาณที่ต้องใช้",
};

const gazpachoBreadScope: Readonly<Record<RecipeLocale, { before: string; after: string; note: string }>> = {
  fi: { before: "Lisää halutessasi leipä.", after: "Leipä on valinnainen. Näytetyt ravintoarvot on laskettu leivän sisältävälle neljän annoksen peruserälle.", note: "Ilmoitetut ravintoarvot sisältävät koko neljän annoksen peruserän kaksi vaalean leivän viipaletta (yhteensä 50 g). Jos jätät leivän pois, näytetyt hiilihydraattimäärät ja mahdollinen GK-arvio eivät sellaisinaan kuvaa leivätöntä annosta." },
  en: { before: "Add bread if you want.", after: "Add bread if you wish. The displayed nutrition figures are calculated for the four-serving batch with bread included.", note: "The displayed nutrition figures include two slices of white bread (50 g total) in the original four-serving batch. If you omit the bread, the shown carbohydrate values and any glycemic load estimate do not directly describe the bread-free serving." },
  sv: { before: "Lägg till bröd om du vill.", after: "Tillsätt bröd om du vill. De visade näringsvärdena har beräknats för en sats på fyra portioner där brödet ingår.", note: "De visade näringsvärdena omfattar två skivor vitt bröd (sammanlagt 50 g) i grundsatsen på fyra portioner. Utan bröd gäller de angivna kolhydratvärdena och en eventuell uppskattning av glykemisk belastning inte direkt för portionen." },
  th: { before: "เพิ่มขนมปังถ้าคุณต้องการ", after: "จะใส่ขนมปังหรือไม่ก็ได้ แต่ข้อมูลโภชนาการที่แสดงคำนวณจากสูตรพื้นฐานสำหรับ 4 ที่ซึ่งใส่ขนมปัง", note: "ข้อมูลโภชนาการที่แสดงรวมขนมปังขาว 2 แผ่น (รวม 50 กรัม) สำหรับสูตรพื้นฐาน 4 ที่ หากไม่ใส่ขนมปัง ปริมาณคาร์โบไฮเดรตและค่าประมาณภาระน้ำตาลที่อาจแสดงอยู่จะไม่ใช่ค่าของสูตรที่ไม่ใส่ขนมปังโดยตรง" },
};

// Gulab jamun: distinguish the frying oil supply from the estimated oil retained
// in the nutrition calculation. Do not modify nutrition/GK-sealed source files.
const gulabJamunOilScope: Readonly<Record<RecipeLocale, { before: string; after: string; note: string }>> = {
  fi: { before: "Kuumenna öljy miedolle lämmölle.", after: "Varaa alkuperäisen neljän annoksen erän friteeraukseen noin litra öljyä ja kuumenna se varovasti miedolle lämmölle. Alkuperäisen neljän annoksen erän ravintoarviossa 30 g on öljyn arvioitu imeytymismäärä, ei friteerausastian öljymäärä.", note: "Ravintoarvio olettaa alkuperäisen neljän annoksen erän imevän yhteensä 30 g öljyä. Se on arvio, ei mitattu imeytymä. Noin litra on friteeraukseen käytettävä öljymäärä, josta ylimääräinen valutetaan pois; toteutunut imeytymä voi poiketa arviosta." },
  en: { before: "Heat the oil gently.", after: "For the original four-serving batch, use about 1 litre of oil for deep-frying and heat it gently over low heat. For the original four-serving batch, the 30 g in the nutrition estimate is the assumed total oil absorption, not the amount of oil to put in the pan.", note: "For the original four-serving batch, the nutrition estimate assumes 30 g of oil is absorbed in total. This is an estimate, not a measured absorption. About 1 litre of oil is used for deep-frying, with excess oil drained off; actual absorption may differ." },
  sv: { before: "Värm oljan försiktigt.", after: "Använd cirka 1 liter olja för friteringen av grundsatsen på fyra portioner och värm den försiktigt på låg värme. För grundsatsen på fyra portioner är 30 g olja ett uppskattat totalt upptag i näringsberäkningen, inte den mängd som ska hällas i kastrullen.", note: "Näringsvärdet för grundsatsen på fyra portioner bygger på ett uppskattat totalt oljeupptag på 30 g. Det är en uppskattning, inte en uppmätt mängd. Cirka 1 liter används vid friteringen och överflödig olja får rinna av; den verkliga upptagningen kan avvika." },
  th: { before: "ตั้งน้ำมันให้ร้อนด้วยไฟอ่อน", after: "สำหรับสูตรพื้นฐาน 4 ที่ เตรียมน้ำมันประมาณ 1 ลิตรสำหรับทอดแบบน้ำมันท่วม แล้วค่อย ๆ อุ่นด้วยไฟอ่อน น้ำมัน 30 กรัมเป็นค่าประมาณที่ขนมสูตรพื้นฐาน 4 ที่ดูดซึมรวมกัน ไม่ใช่ปริมาณน้ำมันที่ต้องเทลงหม้อทอด", note: "การประเมินโภชนาการของสูตรพื้นฐาน 4 ที่สมมติว่าขนมดูดซึมน้ำมันรวม 30 กรัม ตัวเลขนี้เป็นค่าประมาณ ไม่ใช่ผลการชั่งวัดจริง ใช้น้ำมันประมาณ 1 ลิตรสำหรับทอดและสะเด็ดน้ำมันส่วนเกิน ปริมาณที่ดูดซึมจริงอาจต่างจากค่าประมาณ" },
};

// #327 Tangyuan: the original recipe's litre is ginger broth, while separate
// cooking water is drained. Sealed ingredients and historical GK evidence stay unchanged.
const tangyuanCookingWaterScope: Readonly<Record<RecipeLocale, { before: string; after: string; note: string }>> = {
  fi: { before: "Keitä riisipalloja erissä miedosti poreilevassa vedessä 5–6 minuuttia, kunnes ne nousevat pintaan. Nosta kulhoihin ja kaada päälle inkiväärilientä.", after: "Kiehauta toisessa kattilassa riittävästi tavallista vettä riisipallojen keittämiseen; tämä on erillistä vettä eikä ainesluettelossa inkivääriliemeen varattua vettä. Keitä riisipalloja erissä miedosti poreilevassa vedessä 5–6 minuuttia, kunnes ne nousevat pintaan. Nosta pallot reikäkauhalla kulhoihin, valuta erillinen keitinvesi pois ja kaada päälle inkiväärilientä.", note: "Alkuperäisen neljän annoksen perusohjeen ainesluettelon 1 litra vettä ja 60 g sokeria kuuluvat tarjottavaan inkivääriliemeen. Riisipallojen keittämiseen käytetään lisäksi tarvittava määrä tavallista vettä, joka valutetaan pois eikä ole osa liemen määrää. Tarjotun liemen syötyä osuutta ei ole erikseen mitattu." },
  en: { before: "Cook the rice balls in batches in a separate pot of gently simmering water for 5–6 minutes, until they float. Lift into bowls and pour over the sweet ginger syrup.", after: "Bring enough plain water to a gentle simmer in a separate pot. This is additional cooking water, separate from the water reserved for ginger broth in the ingredient list. Cook the rice balls in batches for 5–6 minutes until they float, then lift them out with a slotted spoon. Drain off the separate cooking water, place the balls in bowls and pour over the sweet ginger broth.", note: "In the original four-serving batch, the listed 1 litre of water and 60 g of sugar are for the ginger broth served with the rice balls. Use additional plain water as needed to boil the balls separately; drain it away rather than count it as served broth. The amount of broth actually consumed has not been measured." },
  sv: { before: "Koka risbollarna i omgångar i en separat kastrull med sjudande vatten i 5–6 minuter tills de flyter upp. Lägg dem i skålar och häll över den söta ingefärslagen.", after: "Koka upp tillräckligt med vanligt vatten i en separat kastrull och låt det sjuda. Det är extra kokvatten, skilt från vattnet som enligt ingredienslistan används till ingefärslagen. Koka risbollarna i omgångar i 5–6 minuter tills de flyter upp. Lyft upp dem med hålslev, låt det separata kokvattnet rinna av, lägg bollarna i skålar och häll över den söta ingefärslagen.", note: "I grundsatsen på fyra portioner används den angivna litern vatten och 60 g socker till ingefärslagen som serveras med risbollarna. Använd dessutom vanligt vatten för att koka bollarna separat och häll bort detta kokvatten. Hur mycket av lagen som faktiskt äts har inte mätts." },
  th: { before: "ต้มลูกแป้งทีละชุดในหม้อน้ำอีกใบที่เดือดเบา ๆ ประมาณ 5–6 นาทีจนลอย ตักใส่ชามแล้วราดด้วยน้ำขิงหวาน", after: "ต้มน้ำเปล่าในหม้ออีกใบให้เดือดเบา ๆ โดยใช้น้ำมากพอสำหรับต้มลูกแป้ง น้ำส่วนนี้เป็นน้ำสำหรับต้มแยกต่างหาก ไม่ใช่น้ำที่ระบุไว้สำหรับทำน้ำขิงหวานในรายการส่วนผสม ต้มลูกแป้งทีละชุดประมาณ 5–6 นาทีจนลอย ใช้กระชอนตักขึ้น สะเด็ดน้ำต้มแยกทิ้ง ใส่ชามแล้วราดด้วยน้ำขิงหวาน", note: "น้ำ 1 ลิตรและน้ำตาล 60 กรัมในรายการส่วนผสมของสูตรพื้นฐาน 4 ที่ใช้ทำน้ำขิงหวานสำหรับเสิร์ฟ ต้องใช้น้ำเปล่าเพิ่มเติมสำหรับต้มลูกแป้งในหม้ออีกใบ แล้วสะเด็ดน้ำต้มส่วนนั้นทิ้ง ไม่รวมเป็นน้ำขิงหวานที่เสิร์ฟ ปริมาณน้ำขิงหวานที่กินจริงยังไม่ได้วัด" },
};

// #327: the natto bowl's historical source records paistaminen, but all four
// reviewed preparation methods boil the rice and egg. Correct the *public*
// recipe metadata and explanation without rewriting version-sealed sources.
const nattoRiceCookingReview: Readonly<Record<RecipeLocale, { evidence: readonly string[]; note: string }>> = {
  fi: { evidence: ["100 g kuivaa valkoista jasmiiniriisiä ja keitä se pakkauksen ohjeen mukaan", "Keitä munat"], note: "Valmistustapa: keittäminen. Ainesluettelon riisimäärä on kuivapaino. Riisi ja munat keitetään, ja maustamaton nattō lisätään valmiiseen kulhoon; mitään ei paisteta." },
  en: { evidence: ["100 g of dry white jasmine rice and cook it according to the packet instructions", "Boil the eggs"], note: "Cooking method: boiling. The ingredient list gives the dry weight of the rice. The rice and eggs are boiled, then plain natto is added to the finished bowl; nothing is fried." },
  sv: { evidence: ["100 g torrt vitt jasminris och koka det enligt förpackningens anvisningar", "Koka äggen"], note: "Tillagningssätt: kokning. Mängden ris i ingredienslistan avser torrvikt. Riset och äggen kokas, och naturell natto läggs i den färdiga skålen; ingenting steks." },
  th: { evidence: ["ซาวข้าวหอมมะลิขาวดิบ 100 กรัม แล้วหุงตามวิธีบนบรรจุภัณฑ์", "ต้มไข่"], note: "วิธีปรุง: การต้ม ปริมาณข้าวในรายการส่วนผสมเป็นน้ำหนักข้าวดิบก่อนหุง ข้าวและไข่ต้มให้สุก แล้วใส่นัตโตะแบบไม่ปรุงรสในชาม ไม่ได้ทอดส่วนผสมใด" },
};

export function reviewedPublicCookingMethod(recipeId: string, rawMethod: readonly string[] | undefined): string[] | undefined {
  if (recipeId !== "japanilainen-natto-riisikulho") return undefined;
  if (JSON.stringify(rawMethod) !== JSON.stringify(["paistaminen"])) {
    throw new Error("NATTO_COOKING_METHOD_SOURCE_DRIFT");
  }
  return ["keittäminen"];
}

// #327 quality20 P3: scoped public notes/methods without altering the sealed source.
// The test locks all FI/EN/SV/TH Git blobs and the hummus image blob.
const quality20P3Copy: Readonly<Record<string, Partial<Record<RecipeLocale, {
  evidence?: string; before?: string; after?: string; note: string;
}>>>> = {
  "hummus": {
    "fi": {
      "evidence": "Levitä tarjoiluastiaan ja valuta päälle oliiviöljyä. Ripottele pinnalle paprikaa.",
      "note": "Kuvassa näkyvä pitaleipä on valinnainen tarjoilulisuke eikä kuulu neljän annoksen perusreseptin ainesluetteloon tai annosravintoarvioon. Öljy ja paprikajauhe kuuluvat ainesluetteloon; lisää leivän ravintoarvot erikseen, jos tarjoilet sitä."
    },
    "en": {
      "evidence": "Spread in a serving dish and pour olive oil on top. Sprinkle paprika on top.",
      "note": "The pictured pita bread is an optional serving accompaniment, not part of the four-serving recipe's ingredient list or nutrition estimate. The listed olive oil and paprika are included; calculate the bread separately if served."
    },
    "sv": {
      "evidence": "Bred ut i ett serveringsfat och häll olivolja ovanpå. Strö över paprikapulver.",
      "note": "Pitabrödet på bilden är ett valfritt serveringstillbehör och ingår inte i grundreceptets ingredienslista för fyra portioner eller i näringsvärdet. Den angivna olivoljan och paprikakryddan ingår; räkna brödet separat om det serveras."
    },
    "th": {
      "evidence": "ตักใส่จานเสิร์ฟแล้วราดน้ำมันมะกอกลงไป โรยผงปาปริก้าด้านบน",
      "note": "ขนมปังพิตาในภาพเป็นเครื่องเคียงตามชอบ ไม่อยู่ในรายการส่วนผสมหรือค่าทางโภชนาการของสูตรพื้นฐาน 4 ที่ แต่น้ำมันมะกอกและผงปาปริก้าในรายการส่วนผสมรวมอยู่แล้ว หากเสิร์ฟกับขนมปังต้องคำนวณเพิ่มต่างหาก"
    }
  },
  "paneer-tikka": {
    "fi": {
      "before": "5. Tarjoa kuumana sitruunalohkojen ja minttuchutneyn kanssa.",
      "after": "5. Tarjoa kuumana. Voit halutessasi lisätä sitruunalohkoja tai minttuchutneya erikseen.",
      "note": "Sitruunalohkot ja minttuchutney ovat valinnaisia tarjoilulisukkeita, joita ei ole punnittu neljän annoksen ainesluetteloon eikä sisällytetty mahdolliseen annosravintoarvioon."
    },
    "en": {
      "before": "5. Serve hot with lemon wedges and mint chutney.",
      "after": "5. Serve hot. Add lemon wedges or mint chutney separately if desired.",
      "note": "Lemon wedges and mint chutney are optional serving extras; they were not weighed in the four-serving ingredient list or included in any nutrition estimate for the base recipe."
    },
    "sv": {
      "before": "5. Servera varm med citronklyftor och mintchutney.",
      "after": "5. Servera varmt. Lägg eventuellt till citronklyftor eller mintchutney separat.",
      "note": "Citronklyftor och mintchutney är valfria serveringstillbehör som inte har vägts in i ingredienslistan för fyra portioner eller räknats med i eventuella näringsvärden för grundreceptet."
    },
    "th": {
      "before": "5. เสิร์ฟร้อนกับเลมอนเวดจ์และชัทนีย์มิ้นต์",
      "after": "5. เสิร์ฟร้อน หากต้องการสามารถเพิ่มเลมอนหั่นเสี้ยวหรือชัทนีย์มินต์แยกต่างหาก",
      "note": "เลมอนหั่นเสี้ยวและชัทนีย์มินต์เป็นเครื่องเคียงตามชอบ ไม่ได้ชั่งรวมในรายการส่วนผสมสำหรับ 4 ที่ และไม่รวมในค่าประมาณโภชนาการใด ๆ ของสูตรพื้นฐาน"
    }
  },
  "butter-chicken": {
    "fi": {
      "before": "5. Kypsennä kaikki raakaa eläinperäistä ainesta sisältävät osat kypsiksi. Syö kaikki tämän punnitun version ainekset ja kastike/pannuneste. Raakojen ainesten ravintokoostumusta käytetään kypsän ruoan koostumusarvion pohjana; mittaamatonta hävikkiä ei vähennetä.",
      "after": "",
      "note": "Ravintoarvion laskentaperuste: kaikki luetteloidut ainekset sekä koko marinadi, kastike ja pannuneste kuuluvat neljän annoksen arvioon. Laskenta perustuu raakojen ainesten ravintoarvoihin; mittaamatonta kypsennyshävikkiä ei vähennetä. Broileri kypsennetään valmistusvaiheen 4 mukaisesti vähintään 75 °C:seen."
    },
    "en": {
      "before": "5. Cook every part that contains raw animal ingredients thoroughly. Consume all ingredients and pan juices. Raw ingredient composition is a nutrient-retention proxy; unmeasured losses are not deducted.",
      "after": "",
      "note": "Nutrition-estimate basis: all listed ingredients and the full marinade, sauce and pan juices are included in the four-serving calculation. Raw-ingredient nutrient composition is used; unmeasured cooking losses are not deducted. Cook chicken to at least 75 °C as already directed in step 4."
    },
    "sv": {
      "before": "5. Tillaga alla delar som innehåller råa animaliska ingredienser ordentligt. Ät alla ingredienser och all steksky. Råvarornas sammansättning används som näringsproxy; omätta förluster dras inte av.",
      "after": "",
      "note": "Näringsberäkningens grund: alla angivna ingredienser samt hela marinaden, såsen och stekskyn ingår i beräkningen för fyra portioner. Råvarornas näringsinnehåll används och omätta tillagningsförluster dras inte av. Tillaga kycklingen till minst 75 °C enligt steg 4."
    },
    "th": {
      "before": "5. ปรุงส่วนที่มีวัตถุดิบจากสัตว์ดิบให้สุกทั่วถึง กินวัตถุดิบและน้ำในกระทะทั้งหมด ใช้ค่าประกอบของวัตถุดิบดิบเป็นตัวแทนสารอาหารโดยไม่หักการสูญเสียที่ไม่ได้วัด",
      "after": "",
      "note": "พื้นฐานการประเมินโภชนาการสำหรับสูตร 4 ที่รวมวัตถุดิบทั้งหมดในรายการ น้ำหมัก ซอส และน้ำในกระทะทั้งหมด ใช้ข้อมูลองค์ประกอบทางโภชนาการของวัตถุดิบดิบและไม่หักการสูญเสียระหว่างปรุงที่ไม่ได้วัด ปรุงไก่ให้มีอุณหภูมิภายในอย่างน้อย 75 °C ตามขั้นตอนที่ 4"
    }
  }
};

export function projectPublicRecipeMethodCopy(
  id: string, locale: RecipeLocale, instructions: string, notes: string,
): { instructions: string; notes: string } {
  if (Object.hasOwn(includedInEstimate, id)) {
    instructions = instructions.split(/\r?\n\s*\r?\n/)
      .filter(paragraph => !oldEstimateParagraph[locale].test(paragraph.trim())).join("\n\n");
    if (locale === "fi") {
      instructions = instructions.replace(/^Punnitse yllä luetellut /, "Punnitse ainesluettelon ");
      const assumption = "Ravintoarvio kattaa ohjeen annosmäärälle jaetut ainekset. Mukana on myös " +
        includedInEstimate[id] +
        ". Arvio perustuu raaka-aineiden ravintoarvoihin. Mittaamatonta kypsennyshävikkiä ei vähennetä.";
      notes = [notes, "### Ravintoarvion laskentaperuste", assumption].filter(Boolean).join("\n\n");
    } else {
      const eatInstruction = { en: " Consume the whole mixture and pan juices.", sv: " Ät hela blandningen och stekskyn.", th: " กินส่วนผสมและน้ำจากการอบทั้งหมด" };
      if (id === "vhh-lihamureke") instructions = instructions.replace(eatInstruction[locale], "");
      notes = [notes, estimateNote[locale]].filter(Boolean).join("\n\n");
    }
  }
  if (id === "japanilainen-natto-riisikulho") {
    const reviewed = nattoRiceCookingReview[locale];
    if (!reviewed.evidence.every(part => instructions.includes(part))) {
      throw new Error("NATTO_COOKING_METHOD_TEXT_DRIFT: " + locale);
    }
    notes = [notes, "- " + reviewed.note].filter(Boolean).join("\n");
  }
  if (id === "tangyuan") {
    const scope = tangyuanCookingWaterScope[locale];
    if (instructions.split(scope.before).length !== 2) {
      throw new Error("TANGYUAN_COOKING_WATER_SOURCE_DRIFT: " + locale);
    }
    instructions = instructions.replace(scope.before, scope.after);
    notes = [notes, "- " + scope.note].filter(Boolean).join("\n");
  }
  if (id === "gulab-jamun") {
    const scope = gulabJamunOilScope[locale];
    if (instructions.split(scope.before).length !== 2) {
      throw new Error("GULAB_JAMUN_OIL_SCOPE_SOURCE_DRIFT: " + locale);
    }
    instructions = instructions.replace(scope.before, scope.after);
    notes = [notes, "- " + scope.note].filter(Boolean).join("\n");
  }
  if (Object.hasOwn(quality20P3Copy, id)) {
    const scope = quality20P3Copy[id]?.[locale];
    const expected = scope?.before ?? scope?.evidence;
    if (!scope || !expected || instructions.split(expected).length !== 2) {
      throw new Error("QUALITY20_P3_SOURCE_DRIFT: " + id + "/" + locale);
    }
    if (scope.before) instructions = instructions.replace(scope.before, scope.after ?? "").trim();
    notes = [notes, "- " + scope.note].filter(Boolean).join("\n\n");
  }
  if (id === "gazpacho") {
    const scope = gazpachoBreadScope[locale];
    if (instructions.split(scope.before).length !== 2) {
      throw new Error("GAZPACHO_BREAD_SCOPE_SOURCE_DRIFT: " + locale);
    }
    instructions = instructions.replace(scope.before, scope.after);
    notes = [notes, "- " + scope.note].filter(Boolean).join("\n");
  }
  if (id === "karjalanpiirakat-riisipuurolla") {
    if (locale === "fi") {
      instructions = instructions.replace("Jos 20 g ei riitä, kirjaa lisätarve ja koeleivonta HOLDiin.", flourNote.fi);
    } else {
      notes = [notes, flourNote[locale]].filter(Boolean).join("\n\n");
    }
  }
  if (id === "gluteeniton-uunipannukakku" && locale === "fi") {
    notes = notes.replace(
      "Kuitua sisältävän kokonaishiilihydraatin erillinen laskentamääritelmä puuttuu; `carbs_total_per_serving_g` ei tarkoita nollaa.",
      "Kuitua sisältävien kokonaishiilihydraattien määrää ei ole laskettu. Puuttuva arvo ei tarkoita nollaa.",
    );
  }
  notes = notes.replace(obsoleteDonenessTip[locale], id === "vhh-mustikkapiirakka" ? blueberryTip[locale] : "").trim();
  return { instructions, notes };
}

const pastaIngredientNotes: Readonly<Record<string, string>> = {
  "EAN 8001250120120; K-Ruoka 69 g CHO/100 g, toisella suomalaisella jälleenmyyjällä 72 g – fyysinen pakkaus tarkistettava; tutkimuksen GI 50 ei vielä GK-hyväksyntä":
    "EAN 8001250120120. K-Ruoan tiedoissa on 69 g hiilihydraattia / 100 g, toisen suomalaisen jälleenmyyjän tiedoissa 72 g. Pakkauksen tiedot ovat vielä tarkistamatta. Tutkimuksen GI 50:n vastaavuutta ei ole vahvistettu tähän reseptiin.",
  "EAN 5201194037031; julkinen ravintoarvo 16 g CHO/100 g; tarkista että pakkausarvo koskee valutettua syötävää massaa":
    "EAN 5201194037031. Tuotetiedoissa on 16 g hiilihydraattia / 100 g. Tarkista pakkauksesta, koskeeko arvo valutettua tuotetta.",
};

export function publicIngredientNote(id: string, locale: RecipeLocale, note: string): string {
  return id === "marry-me-kanapasta" && locale === "fi" ? pastaIngredientNotes[note] ?? note : note;
}

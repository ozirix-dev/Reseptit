import type { RecipeLocale } from "../src/types/content";

// Localized search snippets for recipes whose source lead is a generic preparation or weighing note.
export const recipeSeoDescriptions: Record<string, Partial<Record<RecipeLocale, string>>> = {
  "karibia-maissipuuro-kookoksella": {
    en: "Cook Caribbean cornmeal porridge with coconut milk, cinnamon and vanilla.",
    sv: "Koka karibisk majsgröt med kokosmjölk och smaksätt den med kanel och vanilj.",
    th: "โจ๊กข้าวโพดแบบแคริบเบียนต้มกับกะทิ ปรุงกลิ่นด้วยอบเชยและวานิลลา",
  },
  "lahi-ita-kikherne-shakshuka": {
    en: "Make shakshuka with chickpeas and eggs in a tomato base, finished with fresh parsley.",
    sv: "Laga shakshuka med kikärter och ägg i en tomatbas och toppa med färsk persilja.",
    th: "ชักชูกาใส่ถั่วลูกไก่กับไข่ในซอสมะเขือเทศ โรยพาร์สลีย์สดก่อนเสิร์ฟ",
  },
  "kiinalainen-tomaattimunakas-riisilla": {
    en: "Stir-fry eggs and tomatoes with spring onion and serve with long-grain white rice.",
    sv: "Stek ägg och tomater med salladslök och servera med långkornigt ris.",
    th: "ไข่ผัดมะเขือเทศแบบจีนใส่ต้นหอม เสิร์ฟกับข้าวขาวเมล็ดยาว",
  },
  "indonesialainen-nasi-uduk-aamiaisella": {
    en: "Cook Indonesian nasi uduk by simmering jasmine rice in coconut milk. Serve it with egg and cucumber.",
    sv: "Koka jasminris i kokosmjölk till indonesisk nasi uduk och servera med ägg och gurka.",
    th: "นาซีอูดุกแบบอินโดนีเซียใช้ข้าวหอมมะลิหุงกับกะทิ เสิร์ฟพร้อมไข่และแตงกวา",
  },
  "indonesialainen-pisang-goreng-aamiaiseksi": {
    en: "Make Indonesian pisang goreng with banana, rice flour, dried coconut and brown sugar.",
    sv: "Gör indonesisk pisang goreng med banan, rismjöl, torkad kokos och farinsocker.",
    th: "ทำปีซังกอเร็งหรือกล้วยทอดแบบอินโดนีเซียด้วยแป้งข้าวเจ้า มะพร้าวขูดแห้ง และน้ำตาลทรายแดง",
  },
  "karibia-jamaikalainen-munakokkeli": {
    en: "Make Jamaican-style scrambled eggs with tomato, fresh thyme and Scotch bonnet chilli.",
    sv: "Laga jamaicansk äggröra med tomat, färsk timjan och scotch bonnet-chili.",
    th: "ไข่คนสไตล์จาเมกาใส่มะเขือเทศ ไทม์สด และพริกสก็อตช์บอนเน็ต",
  },
  "meksikolainen-atole-maissipuuro": {
    en: "Make Mexican atole-style porridge with fine cornmeal and milk, scented with cinnamon and vanilla.",
    sv: "Koka mexikansk atolegröt på finmalet majsmjöl och mjölk och smaksätt med kanel och vanilj.",
    th: "โจ๊กอาโตเลแบบเม็กซิกันต้มแป้งข้าวโพดบดละเอียดกับนม แต่งกลิ่นด้วยอบเชยและวานิลลา",
  },
  "thai-khao-tom-katkaravuilla": {
    en: "Make Thai khao tom with shrimp and jasmine rice in chicken stock flavoured with garlic and ginger.",
    sv: "Laga thailändsk khao tom med räkor och jasminris i kycklingbuljong med vitlök och ingefära.",
    th: "ข้าวต้มกุ้งใช้ข้าวหอมมะลิในน้ำสต็อกไก่ ปรุงกลิ่นด้วยกระเทียมและขิง",
  },
  "vietnamilainen-banh-mi-munalla": {
    en: "Fill a Vietnamese bánh mì baguette with egg, fresh cucumber and carrot.",
    sv: "Fyll en baguette med ägg, färsk gurka och morot till en vietnamesisk bánh mì.",
    th: "บั๋ญหมี่เวียดนามใช้ขนมปังบาแก็ตสอดไส้ไข่ แตงกวาสด และแครอต",
  },
  "munakasmuffinit": {
    fi: "Paista munakasmuffinit uunissa pekonista, pinaatista ja cheddarista. Kuohukerma tekee munaseoksesta pehmeän.",
  },
  "munakokkeli": {
    fi: "Tee pehmeä munakokkeli voissa. Kuohukerma tekee rakenteesta täyteläisen, ja ruohosipuli viimeistelee maun.",
  },
  "tonnikalamunakkaat-uunissa": {
    fi: "Paista pienet tonnikalamunakkaat uunissa. Tonnikalan lisäksi munakkaisiin tulee emmentalia, kuohukermaa ja tuoretta tilliä.",
  },
  "thai-kai-jiao-yrteilla": {
    fi: "Paista thaimaalainen kai jiao -munakas ja mausta se kalakastikkeella, basilikalla ja kevätsipulilla.",
  },
  "uunimuna-avokadot": {
    fi: "Kypsennä kananmunat avokadonpuolikkaissa uunissa. Sitruunamehu ja ruohosipuli raikastavat lopputuloksen.",
  },
  "uunimunat-pinaatilla": {
    fi: "Paista uunimunat pinaatin, kuohukerman ja emmentalin kanssa. Muskottipähkinä maustaa kermaisen seoksen.",
  },
  "vhh-lihamureke": {
    fi: "Mehevä VHH-lihamureke tehdään naudan jauhelihasta, kesäkurpitsasta ja kuohukermasta.",
  },
  "jauheliha-kaalikeitto-vhh": {
    fi: "Keitä jauheliha-kaalikeitto valkokaalista ja naudan jauhelihasta. Tomaattimurska antaa lihaliemelle täyteläisyyttä.",
    en: "Simmer ground beef, white cabbage and onion in meat stock with crushed tomatoes for a hearty cabbage soup.",
    sv: "Koka en matig kålsoppa med nötfärs, vitkål och gul lök i köttbuljong med krossade tomater.",
    th: "ซุปกะหล่ำปลีขาวใส่เนื้อวัวบดและหอมหัวใหญ่ เคี่ยวในน้ำซุปเนื้อกับมะเขือเทศบดหยาบ",
  },
  "vhh-kaalilaatikko": {
    fi: "Paista VHH-kaalilaatikko valkokaalista, naudan jauhelihasta ja kuohukermasta. Tähän uuniruokaan ei lisätä riisiä.",
    en: "Bake Finnish-style cabbage casserole with white cabbage, ground beef, cream and eggs. This version skips the rice.",
    sv: "Grädda en finsk kålpudding med vitkål, nötfärs, grädde och ägg. Den här varianten görs utan ris.",
    th: "กะหล่ำปลีอบแบบฟินแลนด์ใช้กะหล่ำปลีขาว เนื้อวัวบด ครีม และไข่ สูตรนี้ไม่ใส่ข้าว",
  },
  "caponata": {
    fi: "Tee sisilialainen caponata munakoisosta, tomaatista ja varsiselleristä. Oliivit, kaprikset ja viinietikka antavat kasvisruoalle sen maun.",
  },
  "pad-thai-vhh-konjac": {
    fi: "Valmista VHH-pad thai katkaravuista ja konjaknuudeleista. Kuivapaista nuudelit ennen wokkausta, jotta niistä haihtuu ylimääräinen neste.",
  },
};

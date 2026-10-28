import type { RecipeLocale } from "@/types/content";

export const toolUi = {
  fi: {
    scaled: (base: number) => `Aineslista on skaalattu. Ohjeen tekstissä mainitut määrät koskevat ${base} annosta. Kypsennysaika ei skaalaudu suoraan annosmäärän mukaan.`,
    moreFilters: "Lisäsuodattimet",
    jump: "Siirry ohjeeseen", print: "Tulosta resepti", completed: "Vaihe valmis", reset: "Nollaa työvaiheet", progress: "Valmiita työvaiheita",
    time: "Kokonaisaika enintään", anyTime: "Kaikki ajat", gl: "Glykeeminen kuorma (GK / annos)", anyGl: "Kaikki GK-luokat", lowGl: "Matala GK (≤ 10)", mediumGl: "Keskitasoinen GK (> 10, < 20)", highGl: "Korkea GK (≥ 20)", activeFilters: "Aktiiviset rajaukset", removeFilter: "Poista rajaus", glNote: "GK-rajaus näyttää vain reseptit, joiden annoskohtainen laskennallinen arvio on hyväksytty ja sijoittuu yksiselitteisesti valittuun luokkaan. Puuttuvat ja luokkarajan ylittävät vaihteluvälit jäävät pois.", cuisine: "Ruokakulttuuri", anyCuisine: "Kaikki ruokakulttuurit", ingredient: "Pääraaka-aine", anyIngredient: "Kaikki pääraaka-aineet",
    cuisines: { thai: "Thaimaalainen", indian: "Intialainen", chinese: "Kiinalainen", mediterranean: "Välimerellinen", mexican: "Meksikolainen", japanese: "Japanilainen", korean: "Korealainen", vietnamese: "Vietnamilainen", indonesian: "Indonesialainen", malaysian: "Malesialainen", caribbean: "Karibia", "middle-eastern": "Lähi-itä", "north-african": "Pohjoisafrikkalainen" },
    ingredients: { fish: "Kala ja äyriäiset", chicken: "Kana", meat: "Liha", vegetables: "Kasvikset", legumes: "Palkokasvit", eggs: "Kananmuna", cheese: "Juusto" },
    about: "Tietoa resepteistä", owner: "Ozirix ylläpitää tätä reseptikokoelmaa.",
    editorial: "Reseptejä ja käännöksiä on laadittu tekoälyn avulla. Kokoelmalle ei ole dokumentoitu kattavaa koekeittiötestausta. Käännösten riippumaton ihmistarkistus on kesken.",
    images: "Kokoelmassa on myös tekoälyllä tehtyä kuvitusta. Kuva on tarjoiluesimerkki; noudata aineslistaa ja valmistusohjetta.",
    nutrition: "Ravintoarvot ovat suuntaa-antavia arvioita, eivät laboratorioanalyysejä. Tuotteet ja annoskoko vaikuttavat tulokseen.",
    missing: "Ravintoarvoja ei ole laskettu tälle reseptille.",
    diet: "Keto- ja VHH-merkinnät ovat toimituksellisia luokituksia. Niitä ei ole vahvistettu kaikkien reseptien ravintoarvolaskennalla.",
    feedback: "Ilmoita korjattavasta kohdasta GitHubissa", servings: "Tulosteen annosmäärä",
  },
  en: {
    scaled: (base: number) => `The ingredient list has been scaled. Quantities written in the method refer to ${base} servings. Cooking time does not scale directly with the number of servings.`,
    moreFilters: "More filters",
    jump: "Jump to recipe", print: "Print recipe", completed: "Step complete", reset: "Reset steps", progress: "Completed steps",
    time: "Total time at most", anyTime: "Any time", gl: "Glycemic load (GL / serving)", anyGl: "All GL categories", lowGl: "Low GL (≤ 10)", mediumGl: "Medium GL (> 10, < 20)", highGl: "High GL (≥ 20)", activeFilters: "Active filters", removeFilter: "Remove filter", glNote: "GL filtering includes only recipes with an approved calculated estimate entirely within the selected category. Missing estimates and ranges crossing a category boundary are excluded.", cuisine: "Cuisine", anyCuisine: "All cuisines", ingredient: "Main ingredient", anyIngredient: "All main ingredients",
    cuisines: { thai: "Thai", indian: "Indian", chinese: "Chinese", mediterranean: "Mediterranean", mexican: "Mexican", japanese: "Japanese", korean: "Korean", vietnamese: "Vietnamese", indonesian: "Indonesian", malaysian: "Malaysian", caribbean: "Caribbean", "middle-eastern": "Middle Eastern", "north-african": "North African" },
    ingredients: { fish: "Fish and seafood", chicken: "Chicken", meat: "Meat", vegetables: "Vegetables", legumes: "Legumes", eggs: "Eggs", cheese: "Cheese" },
    about: "About these recipes", owner: "Ozirix maintains this recipe collection.",
    editorial: "AI has been used to prepare recipes and translations. Comprehensive kitchen testing has not been documented for this collection. Independent human review of the translations is pending.",
    images: "The collection also includes AI-generated illustrations. Images are serving suggestions; follow the ingredient list and method.",
    nutrition: "Nutrition values are approximate estimates, not laboratory analyses. Products and portion size affect the result.",
    missing: "Nutrition values have not been calculated for this recipe.",
    diet: "Keto and low-carb labels are editorial classifications. They have not been verified through nutrition calculations for every recipe.",
    feedback: "Report a correction on GitHub", servings: "Servings in this printout",
  },
  sv: {
    scaled: (base: number) => `Ingredienslistan har räknats om. Mängder i tillagningstexten gäller ${base} portioner. Tillagningstiden ändras inte proportionellt med antalet portioner.`,
    moreFilters: "Fler filter",
    jump: "Till receptet", print: "Skriv ut receptet", completed: "Steget är klart", reset: "Återställ stegen", progress: "Klara steg",
    time: "Total tid högst", anyTime: "Alla tider", gl: "Glykemisk belastning (GB / portion)", anyGl: "Alla GB-kategorier", lowGl: "Låg GB (≤ 10)", mediumGl: "Medelhög GB (> 10, < 20)", highGl: "Hög GB (≥ 20)", activeFilters: "Aktiva filter", removeFilter: "Ta bort filter", glNote: "GB-filtret visar bara recept med en godkänd beräknad uppskattning som helt hör till vald kategori. Saknade värden och intervall som korsar en kategorigräns utelämnas.", cuisine: "Matkultur", anyCuisine: "Alla matkulturer", ingredient: "Huvudingrediens", anyIngredient: "Alla huvudingredienser",
    cuisines: { thai: "Thailändsk", indian: "Indisk", chinese: "Kinesisk", mediterranean: "Medelhavsmat", mexican: "Mexikansk", japanese: "Japansk", korean: "Koreansk", vietnamese: "Vietnamesisk", indonesian: "Indonesisk", malaysian: "Malaysisk", caribbean: "Karibisk", "middle-eastern": "Mellanöstern", "north-african": "Nordafrikansk" },
    ingredients: { fish: "Fisk och skaldjur", chicken: "Kyckling", meat: "Kött", vegetables: "Grönsaker", legumes: "Baljväxter", eggs: "Ägg", cheese: "Ost" },
    about: "Om recepten", owner: "Ozirix underhåller den här receptsamlingen.",
    editorial: "Recept och översättningar har tagits fram med hjälp av AI. Någon heltäckande provlagning av samlingen har inte dokumenterats. Oberoende mänsklig granskning av översättningarna återstår.",
    images: "Samlingen innehåller även AI-genererade illustrationer. Bilderna är serveringsförslag; följ ingredienslistan och tillagningen.",
    nutrition: "Näringsvärdena är ungefärliga uppskattningar, inte laboratorieanalyser. Produkter och portionsstorlek påverkar resultatet.",
    missing: "Näringsvärden har inte beräknats för detta recept.",
    diet: "Keto och lågkolhydrat är redaktionella klassificeringar. De har inte verifierats med näringsberäkningar för alla recept.",
    feedback: "Rapportera en rättelse på GitHub", servings: "Portioner i utskriften",
  },
  th: {
    scaled: (base: number) => `ปรับปริมาณในรายการวัตถุดิบแล้ว ปริมาณที่ระบุในข้อความวิธีทำยังเป็นปริมาณสำหรับ ${base} ที่ เวลาในการปรุงไม่ได้เปลี่ยนตามสัดส่วนของจำนวนที่โดยตรง`,
    moreFilters: "ตัวกรองเพิ่มเติม",
    jump: "ไปที่วิธีทำ", print: "พิมพ์สูตรอาหาร", completed: "ทำขั้นตอนนี้แล้ว", reset: "ล้างเครื่องหมายขั้นตอน", progress: "ขั้นตอนที่ทำแล้ว",
    time: "เวลารวมไม่เกิน", anyTime: "ทุกระยะเวลา", gl: "ภาระน้ำตาลในเลือด (GL / หนึ่งที่)", anyGl: "ทุกระดับ GL", lowGl: "GL ต่ำ (≤ 10)", mediumGl: "GL ปานกลาง (> 10, < 20)", highGl: "GL สูง (≥ 20)", activeFilters: "ตัวกรองที่เลือก", removeFilter: "ลบตัวกรอง", glNote: "ตัวกรอง GL แสดงเฉพาะสูตรที่มีค่าประมาณที่ผ่านการตรวจสอบและอยู่ในช่วงเดียวกันทั้งค่า ค่าที่ขาดหายหรือช่วงค่าที่ข้ามเกณฑ์จะไม่ถูกแสดง", cuisine: "ประเภทอาหารตามภูมิภาค", anyCuisine: "ทุกภูมิภาค", ingredient: "วัตถุดิบหลัก", anyIngredient: "วัตถุดิบหลักทั้งหมด",
    cuisines: { thai: "ไทย", indian: "อินเดีย", chinese: "จีน", mediterranean: "เมดิเตอร์เรเนียน", mexican: "เม็กซิกัน", japanese: "ญี่ปุ่น", korean: "เกาหลี", vietnamese: "เวียดนาม", indonesian: "อินโดนีเซีย", malaysian: "มาเลเซีย", caribbean: "แคริบเบียน", "middle-eastern": "ตะวันออกกลาง", "north-african": "แอฟริกาเหนือ" },
    ingredients: { fish: "ปลาและอาหารทะเล", chicken: "ไก่", meat: "เนื้อสัตว์", vegetables: "ผัก", legumes: "ถั่วและผลิตภัณฑ์จากถั่ว", eggs: "ไข่", cheese: "ชีส" },
    about: "เกี่ยวกับสูตรอาหาร", owner: "Ozirix ดูแลชุดสูตรอาหารนี้",
    editorial: "มีการใช้ AI ช่วยเขียนสูตรและแปลภาษา ยังไม่มีเอกสารยืนยันการทดลองทำครบทุกสูตร และยังรอการตรวจคำแปลโดยผู้รู้ภาษาอย่างอิสระ",
    images: "มีภาพประกอบที่สร้างด้วย AI ด้วย ภาพเป็นตัวอย่างการจัดเสิร์ฟ โปรดยึดรายการวัตถุดิบและวิธีทำเป็นหลัก",
    nutrition: "คุณค่าทางโภชนาการเป็นค่าประมาณ ไม่ใช่ผลวิเคราะห์ในห้องปฏิบัติการ ผลลัพธ์ขึ้นอยู่กับผลิตภัณฑ์และขนาดเสิร์ฟ",
    missing: "ยังไม่ได้คำนวณคุณค่าทางโภชนาการสำหรับสูตรนี้",
    diet: "ป้ายคีโตและคาร์โบไฮเดรตต่ำเป็นการจัดหมวดหมู่โดยผู้จัดทำ ยังไม่ได้ยืนยันด้วยการคำนวณโภชนาการครบทุกสูตร",
    feedback: "แจ้งข้อแก้ไขบน GitHub", servings: "จำนวนที่สำหรับสูตรที่พิมพ์",
  },
};

export function RecipeAbout({ locale }: { locale: RecipeLocale }) {
  const labels = toolUi[locale];
  return <details className="recipe-about"><summary>{labels.about}</summary><div>
    <p>{labels.owner}</p><p>{labels.editorial}</p><p>{labels.images}</p><p>{labels.nutrition}</p><p>{labels.diet}</p>
    <a href="https://github.com/ozirix-dev/Reseptit/issues">{labels.feedback}</a>
  </div></details>;
}

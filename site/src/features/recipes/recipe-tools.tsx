import type { RecipeLocale } from "@/types/content";

export const toolUi = {
  fi: {
    scaled: (base: number) => `Aineslista on skaalattu. Ohjeen tekstissä mainitut määrät koskevat ${base} annosta. Kypsennysaika ei skaalaudu suoraan annosmäärän mukaan.`,
    moreFilters: "Lisäsuodattimet",
    jump: "Siirry ohjeeseen", print: "Tulosta resepti", completed: "Vaihe valmis", reset: "Nollaa työvaiheet", progress: "Valmiita työvaiheita",
    time: "Enimmäisaika", anyTime: "Kaikki ajat", cuisine: "Ruokakulttuuri", anyCuisine: "Kaikki ruokakulttuurit", ingredient: "Pääraaka-aine", anyIngredient: "Kaikki pääraaka-aineet",
    cuisines: { thai: "Thaimaalainen", indian: "Intialainen", chinese: "Kiinalainen", mediterranean: "Välimerellinen", mexican: "Meksikolainen", japanese: "Japanilainen" },
    ingredients: { fish: "Kala ja äyriäiset", chicken: "Kana", meat: "Liha", vegetables: "Kasvikset", legumes: "Palkokasvit", eggs: "Kananmuna", cheese: "Juusto" },
    about: "Tietoa resepteistä", owner: "Ozirix ylläpitää tätä reseptikokoelmaa.",
    editorial: "Reseptejä ja käännöksiä on laadittu tekoälyn avulla. Kokoelmalle ei ole dokumentoitu kattavaa koekeittiötestausta. Käännösten riippumaton ihmistarkistus on kesken.",
    images: "Kokoelmassa on myös tekoälyllä tehtyä kuvitusta. Kuva on tarjoiluesimerkki; noudata aineslistaa ja valmistusohjetta.",
    nutrition: "Ravintoarvot ovat suuntaa-antavia arvioita. Täydellistä raaka-ainekohtaista laskentaa ei ole vahvistettu. Tuotteet ja annoskoko vaikuttavat tulokseen.",
    missing: "Ravintoarvoja ei ole laskettu tälle reseptille.",
    diet: "Keto- ja VHH-merkinnät ovat toimituksellisia luokituksia. Niitä ei ole vahvistettu kaikkien reseptien ravintoarvolaskennalla.",
    feedback: "Ilmoita korjattavasta kohdasta GitHubissa", servings: "Tulosteen annosmäärä",
  },
  en: {
    scaled: (base: number) => `The ingredient list has been scaled. Quantities written in the method refer to ${base} servings. Cooking time does not scale directly with the number of servings.`,
    moreFilters: "More filters",
    jump: "Jump to recipe", print: "Print recipe", completed: "Step complete", reset: "Reset steps", progress: "Completed steps",
    time: "Maximum time", anyTime: "Any time", cuisine: "Cuisine", anyCuisine: "All cuisines", ingredient: "Main ingredient", anyIngredient: "All main ingredients",
    cuisines: { thai: "Thai", indian: "Indian", chinese: "Chinese", mediterranean: "Mediterranean", mexican: "Mexican", japanese: "Japanese" },
    ingredients: { fish: "Fish and seafood", chicken: "Chicken", meat: "Meat", vegetables: "Vegetables", legumes: "Legumes", eggs: "Eggs", cheese: "Cheese" },
    about: "About these recipes", owner: "Ozirix maintains this recipe collection.",
    editorial: "AI has been used to prepare recipes and translations. Comprehensive kitchen testing has not been documented for this collection. Independent human review of the translations is pending.",
    images: "The collection also includes AI-generated illustrations. Images are serving suggestions; follow the ingredient list and method.",
    nutrition: "Nutrition values are approximate estimates. A complete ingredient-by-ingredient calculation has not been verified. Products and portion size affect the result.",
    missing: "Nutrition values have not been calculated for this recipe.",
    diet: "Keto and low-carb labels are editorial classifications. They have not been verified through nutrition calculations for every recipe.",
    feedback: "Report a correction on GitHub", servings: "Servings in this printout",
  },
  sv: {
    scaled: (base: number) => `Ingredienslistan har räknats om. Mängder i tillagningstexten gäller ${base} portioner. Tillagningstiden ändras inte proportionellt med antalet portioner.`,
    moreFilters: "Fler filter",
    jump: "Till receptet", print: "Skriv ut receptet", completed: "Steget är klart", reset: "Återställ stegen", progress: "Klara steg",
    time: "Maximal tid", anyTime: "Alla tider", cuisine: "Matkultur", anyCuisine: "Alla matkulturer", ingredient: "Huvudingrediens", anyIngredient: "Alla huvudingredienser",
    cuisines: { thai: "Thailändsk", indian: "Indisk", chinese: "Kinesisk", mediterranean: "Medelhavsmat", mexican: "Mexikansk", japanese: "Japansk" },
    ingredients: { fish: "Fisk och skaldjur", chicken: "Kyckling", meat: "Kött", vegetables: "Grönsaker", legumes: "Baljväxter", eggs: "Ägg", cheese: "Ost" },
    about: "Om recepten", owner: "Ozirix underhåller den här receptsamlingen.",
    editorial: "Recept och översättningar har tagits fram med hjälp av AI. Någon heltäckande provlagning av samlingen har inte dokumenterats. Oberoende mänsklig granskning av översättningarna återstår.",
    images: "Samlingen innehåller även AI-genererade illustrationer. Bilderna är serveringsförslag; följ ingredienslistan och tillagningen.",
    nutrition: "Näringsvärdena är ungefärliga uppskattningar. En fullständig beräkning för varje ingrediens har inte verifierats. Produkter och portionsstorlek påverkar resultatet.",
    missing: "Näringsvärden har inte beräknats för detta recept.",
    diet: "Keto och lågkolhydrat är redaktionella klassificeringar. De har inte verifierats med näringsberäkningar för alla recept.",
    feedback: "Rapportera en rättelse på GitHub", servings: "Portioner i utskriften",
  },
  th: {
    scaled: (base: number) => `ปรับปริมาณในรายการวัตถุดิบแล้ว ปริมาณที่ระบุในข้อความวิธีทำยังเป็นปริมาณสำหรับ ${base} ที่ เวลาในการปรุงไม่ได้เปลี่ยนตามสัดส่วนของจำนวนที่โดยตรง`,
    moreFilters: "ตัวกรองเพิ่มเติม",
    jump: "ไปที่วิธีทำ", print: "พิมพ์สูตรอาหาร", completed: "ทำขั้นตอนนี้แล้ว", reset: "ล้างเครื่องหมายขั้นตอน", progress: "ขั้นตอนที่ทำแล้ว",
    time: "เวลาสูงสุด", anyTime: "ทุกระยะเวลา", cuisine: "ประเภทอาหารตามภูมิภาค", anyCuisine: "ทุกภูมิภาค", ingredient: "วัตถุดิบหลัก", anyIngredient: "วัตถุดิบหลักทั้งหมด",
    cuisines: { thai: "ไทย", indian: "อินเดีย", chinese: "จีน", mediterranean: "เมดิเตอร์เรเนียน", mexican: "เม็กซิกัน", japanese: "ญี่ปุ่น" },
    ingredients: { fish: "ปลาและอาหารทะเล", chicken: "ไก่", meat: "เนื้อสัตว์", vegetables: "ผัก", legumes: "ถั่วและผลิตภัณฑ์จากถั่ว", eggs: "ไข่", cheese: "ชีส" },
    about: "เกี่ยวกับสูตรอาหาร", owner: "Ozirix ดูแลชุดสูตรอาหารนี้",
    editorial: "มีการใช้ AI ช่วยเขียนสูตรและแปลภาษา ยังไม่มีเอกสารยืนยันการทดลองทำครบทุกสูตร และยังรอการตรวจคำแปลโดยผู้รู้ภาษาอย่างอิสระ",
    images: "มีภาพประกอบที่สร้างด้วย AI ด้วย ภาพเป็นตัวอย่างการจัดเสิร์ฟ โปรดยึดรายการวัตถุดิบและวิธีทำเป็นหลัก",
    nutrition: "คุณค่าทางโภชนาการเป็นค่าประมาณ ยังไม่ได้ยืนยันการคำนวณจากวัตถุดิบครบทุกชนิด ผลลัพธ์ขึ้นอยู่กับผลิตภัณฑ์และขนาดเสิร์ฟ",
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

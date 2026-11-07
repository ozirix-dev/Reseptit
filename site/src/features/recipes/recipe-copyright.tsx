import type { RecipeLocale } from "@/types/content";

export const copyrightSourceUrl = "https://kopiraittila.fi/teosten-kaytto/usein-kysyttya-teosten-kaytosta/";

export const copyrightUi: Record<RecipeLocale, {
  title: string;
  background: string;
  attribution: string;
  protectedWork: string;
  sourceLabel: string;
  report: string;
}> = {
  fi: {
    title: "Reseptien lähteet ja tekijänoikeudet",
    background: "Reseptit voivat perustua omiin ideoihin ja julkisista lähteistä tunnettuihin ruokaohjeisiin. Raaka-aineet, määrät ja tavanomaiset valmistustiedot eivät yleensä sellaisinaan ole tekijänoikeussuojattuja.",
    attribution: "Pyrimme kirjoittamaan ohjeet omin sanoin ja merkitsemään tunnistettavat alkuperäislähteet reseptien yhteyteen. Lähteen ilmoittaminen ei kuitenkaan yksin anna lupaa suojatun sisällön kopiointiin.",
    protectedWork: "Blogien ja kirjojen omaperäiset tekstit sekä valokuvat ja muu kuvitus voivat olla suojattuja. Niiden käyttöön tarvitaan lupa tai muu laillinen peruste. Osa sivuston kuvituksesta on tuotettu tekoälyllä.",
    sourceLabel: "Kopioston ohje: voiko ruokareseptejä kopioida ja jakaa verkossa?",
    report: "Ilmoita mahdollisesta oikeus- tai lähdemerkintäongelmasta GitHubissa. Selvitämme asian ja korjaamme tarvittaessa.",
  },
  en: {
    title: "Recipe sources and copyright",
    background: "Recipes may be based on our own ideas or cooking instructions known from public sources. Ingredient lists, quantities and ordinary preparation information are generally not protected by copyright in themselves.",
    attribution: "We aim to write instructions in our own words and credit identifiable original sources alongside recipes. Crediting a source does not, by itself, grant permission to copy protected material.",
    protectedWork: "Original writing in blogs and books, photographs and other illustrations may be protected. Their use requires permission or another lawful basis. Some illustrations on this site are AI-generated.",
    sourceLabel: "Kopiosto guidance (Finnish): may recipes be copied and shared online?",
    report: "Report a possible rights or attribution issue on GitHub. We will investigate and make corrections where needed.",
  },
  sv: {
    title: "Receptkällor och upphovsrätt",
    background: "Recept kan bygga på egna idéer eller matlagningsanvisningar från offentliga källor. Ingredienser, mängder och vanliga tillagningsuppgifter omfattas i regel inte i sig av upphovsrätt.",
    attribution: "Vi strävar efter att skriva anvisningarna med egna ord och ange identifierbara originalkällor vid recepten. Att ange en källa ger inte i sig rätt att kopiera skyddat material.",
    protectedWork: "Originella texter i bloggar och böcker samt fotografier och annan bildkonst kan vara skyddade. Användning kräver tillstånd eller annan laglig grund. Vissa illustrationer på webbplatsen är AI-genererade.",
    sourceLabel: "Kopiostos anvisning (på finska): får matrecept kopieras och delas på nätet?",
    report: "Rapportera eventuella problem med rättigheter eller källhänvisningar på GitHub. Vi utreder saken och rättar vid behov.",
  },
  th: {
    title: "แหล่งที่มาของสูตรอาหารและลิขสิทธิ์",
    background: "สูตรอาหารอาจมาจากแนวคิดของเราเองหรือข้อมูลการปรุงอาหารที่เผยแพร่ต่อสาธารณะ โดยทั่วไป รายการวัตถุดิบ ปริมาณ และข้อมูลวิธีทำทั่วไปไม่ได้รับความคุ้มครองลิขสิทธิ์ในตัวเอง",
    attribution: "เราพยายามเรียบเรียงวิธีทำด้วยถ้อยคำของเราเองและระบุแหล่งที่มาของสูตรต้นฉบับเมื่อสามารถตรวจสอบได้ แต่การให้เครดิตแหล่งที่มาเพียงอย่างเดียวไม่ได้เป็นการอนุญาตให้คัดลอกเนื้อหาที่มีลิขสิทธิ์",
    protectedWork: "บทความที่มีความสร้างสรรค์ในบล็อกหรือหนังสือ ตลอดจนภาพถ่ายและภาพประกอบอื่น ๆ อาจได้รับความคุ้มครอง การนำมาใช้ต้องได้รับอนุญาตหรือมีฐานทางกฎหมายอื่น ภาพประกอบบางส่วนของเว็บไซต์สร้างด้วย AI",
    sourceLabel: "คำแนะนำของ Kopiosto (ภาษาฟินแลนด์) เกี่ยวกับการคัดลอกและเผยแพร่สูตรอาหารออนไลน์",
    report: "หากพบปัญหาด้านสิทธิหรือการอ้างอิงแหล่งที่มา โปรดแจ้งผ่าน GitHub เราจะตรวจสอบและแก้ไขตามความจำเป็น",
  },
};

export function RecipeCopyright({ locale }: { locale: RecipeLocale }) {
  const labels = copyrightUi[locale];
  return <details className="recipe-about recipe-copyright">
    <summary>{labels.title}</summary>
    <div>
      <p>{labels.background}</p>
      <p>{labels.attribution}</p>
      <p>{labels.protectedWork}</p>
      <p><a href={copyrightSourceUrl} target="_blank" rel="noopener noreferrer">{labels.sourceLabel}</a></p>
      <p>{labels.report} <a href="https://github.com/ozirix-dev/Reseptit/issues" target="_blank" rel="noopener noreferrer">GitHub Issues</a></p>
    </div>
  </details>;
}

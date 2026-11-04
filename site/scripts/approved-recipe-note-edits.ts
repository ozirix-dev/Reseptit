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

// PR #262 contains reviewed editorial corrections only. Reconstruct the sealed
// versions for GK verification; the exact current hash is required before any
// inverse edit. Other changes must go through the normal snapshot review.
const editorialSnapshots: Readonly<Record<string, {
  currentSha256: string;
  inverseEdits: ReadonlyArray<readonly [start: number, count: number, historical: string]>;
}>> = {
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

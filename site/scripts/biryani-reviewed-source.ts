import { createHash } from "node:crypto";

// The 30 g milk revision leaves the home recipe's GK undetermined.
// This exact transition also allows the old research and audit files to be
// verified against the historical text they actually describe.
const snapshots: Readonly<Record<string, {
  currentSha256: string;
  inverseEdits: readonly [number, number, string][];
}>> = {
  "reseptit/paaruoat/hyderabadi-kanabiryani.md": {
    currentSha256: "591ff23b6543b9f9c4893a332598cf0b79e3e6dd1b4f8790319c43934b196159",
    inverseEdits: [
      [114, 1, "- Tarkista broilerin kypsyys paksuimmasta kohdasta ennen tarjoamista.\n"],
      [104, 1, "1. Huuhtele riisi ja liota kylmässä vedessä 20 minuuttia. Valuta.\n"],
      [87, 4, "carbs_net_per_serving_g: 60.47\ncarbs_total_per_serving_g: 62.73\nprotein_per_serving_g: 37.41\nfat_per_serving_g: 20.64\n"],
      [70, 4, "    note: liotettuna 2 rkl lämpimään maitoon\n"],
    ],
  },
  "kaannokset/en/paaruoat/hyderabadi-kanabiryani.md": {
    currentSha256: "5ee35c7a201b30b2bb74270729a0764444f8c1e15d9bf5b25f416f7937da69a2",
    inverseEdits: [
      [112, 1, "- Check the doneness of the chicken in the thickest part before serving.\n"],
      [107, 1, "6. Spread the rice over the chicken. Add saffron milk, ghee, fried onion, mint and coriander.\n"],
      [102, 2, "1. Rinse the rice and soak in cold water for 20 minutes. Drain.\n2. Mix the chicken with yogurt, garam masala, cumin, coriander, turmeric and salt. Leave to season for 20 minutes.\n"],
      [85, 4, "carbs_net_per_serving_g: 60.47\ncarbs_total_per_serving_g: 62.73\nprotein_per_serving_g: 37.41\nfat_per_serving_g: 20.64\n"],
      [70, 4, "    note: soaked in 2 tbsp warm milk\n"],
    ],
  },
  "kaannokset/sv/paaruoat/hyderabadi-kanabiryani.md": {
    currentSha256: "ff8332953ef806e04462987107bcdb348f9ecb1abd309bc296e666af4213d015",
    inverseEdits: [
      [112, 1, "- Kontrollera att kycklingen är klar i den tjockaste delen innan servering.\n"],
      [107, 1, "6. Fördela riset över kycklingen. Tillsätt saffransmjölk, ghee, stekt lök, mynta och koriander.\n"],
      [102, 2, "1. Skölj riset och blötlägg i kallt vatten i 20 minuter. Dränera.\n2. Blanda kycklingen med yoghurt, garam masala, spiskummin, koriander, gurkmeja och salt. Låt krydda i 20 minuter.\n"],
      [85, 4, "carbs_net_per_serving_g: 60.47\ncarbs_total_per_serving_g: 62.73\nprotein_per_serving_g: 37.41\nfat_per_serving_g: 20.64\n"],
      [70, 4, "    note: blötlagd i 2 msk varm mjölk\n"],
    ],
  },
  "kaannokset/th/paaruoat/hyderabadi-kanabiryani.md": {
    currentSha256: "91abb4513fa3dcb7b301e6b0b2f53768603569764943218d90fecacf2c3a5147",
    inverseEdits: [
      [112, 1, "- ตรวจสอบความสุกของไก่ในส่วนที่หนาที่สุดก่อนเสิร์ฟ\n"],
      [102, 1, "1. ซาวข้าวแล้วแช่ในน้ำเย็นประมาณ 20 นาที สะเด็ดน้ำ.\n"],
      [85, 4, "carbs_net_per_serving_g: 60.47\ncarbs_total_per_serving_g: 62.73\nprotein_per_serving_g: 37.41\nfat_per_serving_g: 20.64\n"],
      [70, 4, "    note: แช่ในนมอุ่น 2 ช้อนโต๊ะ\n"],
    ],
  },
  "docs/nutrition/calculations/hyderabadi-kanabiryani.json": {
    currentSha256: "2f2f4f0b9d25f336d3bebdef21046de5dcab9f7c54d7b6337842f1d95cd42abd",
    inverseEdits: [
      [467, 30, ""],
      [6, 1, "  \"scope\": \"Complete recipe divided by listed servings. Product choices and minor omission bounds are explicit in ingredient mappings. Added fats are counted as fully retained; no cooking-liquid or fat loss is assumed. These are practical estimates, not laboratory analyses.\",\n"],
      [2, 2, "  \"sourceHash\": \"e85c334fe024d1895e371ca7b7f03109bf73f4367f0c3df8a9bfd843d707af3a\",\n  \"calculatedAt\": \"2026-10-24\",\n"],
    ],
  },
};

export const biryaniSourcePath = "reseptit/paaruoat/hyderabadi-kanabiryani.md";

export function biryaniSourceBeforeReview(file: string, text: string): string {
  const snapshot = snapshots[file];
  if (!snapshot) return text;
  const normalized = text.replaceAll("\r\n", "\n");
  if (createHash("sha256").update(normalized).digest("hex") !== snapshot.currentSha256) return text;
  const lines = normalized.split("\n");
  for (const [start, count, previous] of snapshot.inverseEdits) {
    const restored = previous ? previous.slice(0, -1).split("\n") : [];
    lines.splice(start, count, ...restored);
  }
  return lines.join("\n");
}

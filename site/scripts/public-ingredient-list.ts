import type { RecipeIngredient, RecipeLocale } from "../src/types/content";
import { reviewedEggCounts } from "./reviewed-egg-counts";
import { nutritionIngredientNotes, preparationIngredientNotes, shorterIngredientNotes } from "./reviewed-ingredient-notes";

type EggPart = "whole" | "yolk" | "white";
type Localized = Readonly<Record<RecipeLocale, string>>;

const eggNames: Record<EggPart, Record<RecipeLocale, [singular: string, plural: string]>> = {
  whole: { fi: ["kananmuna", "kananmunaa"], en: ["egg", "eggs"], sv: ["ägg", "ägg"], th: ["ไข่ไก่", "ไข่ไก่"] },
  yolk: { fi: ["keltuainen", "keltuaista"], en: ["egg yolk", "egg yolks"], sv: ["äggula", "äggulor"], th: ["ไข่แดง", "ไข่แดง"] },
  white: { fi: ["valkuainen", "valkuaista"], en: ["egg white", "egg whites"], sv: ["äggvita", "äggvitor"], th: ["ไข่ขาว", "ไข่ขาว"] },
};

const sizedEggNames: Record<"medium" | "large", Record<RecipeLocale, [string, string]>> = {
  medium: {
    fi: ["keskikokoinen kananmuna", "keskikokoista kananmunaa"], en: ["medium egg", "medium eggs"],
    sv: ["medelstort ägg", "medelstora ägg"], th: ["ไข่ไก่ขนาดกลาง", "ไข่ไก่ขนาดกลาง"],
  },
  large: {
    fi: ["iso kananmuna", "isoa kananmunaa"], en: ["large egg", "large eggs"],
    sv: ["stort ägg", "stora ägg"], th: ["ไข่ไก่ขนาดใหญ่", "ไข่ไก่ขนาดใหญ่"],
  },
};

const eggDetails: Record<string, Localized> = {
  boiled: { fi: "kovaksi keitettynä", en: "hard-boiled", sv: "hårdkokt", th: "ต้มสุก" },
  dough: { fi: "taikinaan", en: "for the dough", sv: "till degen", th: "สำหรับแป้ง" },
  base: { fi: "pohjaan", en: "for the base", sv: "till botten", th: "สำหรับฐาน" },
  filling: { fi: "täytteeseen", en: "for the filling", sv: "till fyllningen", th: "สำหรับไส้" },
  brush: { fi: "voiteluun", en: "for brushing", sv: "till pensling", th: "สำหรับทาหน้า" },
};

const avocadoPotatoPreparation: Localized = {
  fi: "Punnitse jauhoiset perunat kuorittuina, suolatta keitettyinä, hyvin valutettuina ja jäähtyneinä.",
  en: "Weigh the floury potatoes after peeling, boiling them without salt, draining well and cooling.",
  sv: "Väg den mjöliga potatisen skalad, kokt utan salt, väl avrunnen och avsvalnad.",
  th: "ชั่งมันฝรั่งเนื้อร่วนหลังปอกเปลือก ต้มโดยไม่ใส่เกลือ สะเด็ดน้ำและพักให้เย็น",
};

const avocadoFlesh: Localized = {
  fi: "kypsän avokadon hedelmälihaa", en: "ripe avocado flesh",
  sv: "fruktkött av mogen avokado", th: "เนื้ออะโวคาโดสุก",
};

const fryingOilNote = "Arvioitu imeytyvä määrä koko erälle; friteeraukseen käytä noin 1 l ja valuta ylimääräinen öljy pois. Ylimäärä ei sisälly ravintoarvioon.";
const fryingOil: Localized = { fi: "öljyä friteeraukseen", en: "oil for deep-frying", sv: "olja till fritering", th: "น้ำมันสำหรับทอดแบบท่วม" };
const fryingMethod: Localized = {
  fi: "Varaa friteeraukseen noin litra öljyä astian koon mukaan. Valuta ylimääräinen öljy kypsistä paloista.",
  en: "Allow about one litre of oil for deep-frying, depending on the size of the pan. Drain the cooked pieces well.",
  sv: "Räkna med cirka en liter olja till friteringen, beroende på kärlets storlek. Låt de friterade bitarna rinna av.",
  th: "เตรียมน้ำมันทอดประมาณหนึ่งลิตรตามขนาดภาชนะ สะเด็ดน้ำมันส่วนเกินหลังทอด",
};

function fryingNutrition(locale: RecipeLocale, grams: number): string {
  return {
    fi: `Perusohjeen ravintoarviossa friteerausöljyä oletetaan imeytyvän ${grams} g koko erään.`,
    en: `The nutrition estimate assumes that the full batch in the original recipe absorbs ${grams} g of frying oil.`,
    sv: `Näringsberäkningen utgår från att hela satsen i grundreceptet tar upp ${grams} g frityrolja.`,
    th: `ค่าประมาณโภชนาการคิดว่าสูตรเดิมทั้งชุดดูดซับน้ำมันทอด ${grams} กรัม`,
  }[locale];
}

function eggPart(item: string): EggPart | undefined {
  if (/^(?:kananmunan ?)?keltuai/u.test(item)) return "yolk";
  if (/^(?:kananmunan ?)?valkuai/u.test(item)) return "white";
  if (/^(?:(?:keskikokoinen|isoa|keitettyä) )?kananmunaa?(?: |$)/u.test(item)) return "whole";
  return undefined;
}

function eggDetail(source: RecipeIngredient, locale: RecipeLocale): string {
  const { item, note } = source;
  if (/keitetty/i.test(item) || note === "kovaksi keitettynä") return eggDetails.boiled[locale];
  if (item.endsWith("täytteeseen")) return eggDetails.filling[locale];
  if (item.endsWith("pohjaan") || note === "pohjaan, noin 2 keskikokoista munaa") return eggDetails.base[locale];
  if (item.endsWith("taikinaan") || note === "taikinaan, noin yksi muna") return eggDetails.dough[locale];
  if (item.endsWith("voiteluun") || note === "noin yksi keltuainen, pinnan voiteluun" ||
      note === "vain pinnan voiteluun; kirjaa käyttämättä jäänyt osuus") return eggDetails.brush[locale];
  return "";
}

function appendDetail(item: string, detail: string, locale: RecipeLocale): string {
  if (!detail) return item;
  return locale === "th" ? `${item} ${detail}` : `${item}, ${detail}`;
}

export function projectIngredientList(
  recipeId: string,
  locale: RecipeLocale,
  ingredients: RecipeIngredient[],
  sourceIngredients: RecipeIngredient[],
) {
  const preparation: string[] = [];
  const nutrition: string[] = [];
  const aligned = ingredients.length === sourceIngredients.length &&
    ingredients.every((ingredient, index) => ingredient.amount === sourceIngredients[index].amount);
  const items = ingredients.map(({ note: rawNote, ...ingredient }, index): RecipeIngredient => {
    const source = aligned ? sourceIngredients[index] : undefined;
    const sourceNote = source?.note?.trim() ?? "";
    const note = rawNote?.trim() ?? "";
    if (sourceNote === fryingOilNote && ingredient.amount !== null && note) {
      preparation.push(fryingMethod[locale]);
      nutrition.push(fryingNutrition(locale, ingredient.amount));
      return { amount: null, unit: "", item: fryingOil[locale] };
    }
    if (recipeId === "avokado-perunasampylat" || recipeId === "avokado-perunasampylat-pellilla") {
      if (index === 0 && sourceNote.startsWith("kuorittu, suolatta keitetty")) {
        preparation.push(avocadoPotatoPreparation[locale]);
        return ingredient;
      }
      if (index === 1 && sourceNote === "hedelmälihan paino") return { ...ingredient, item: avocadoFlesh[locale] };
    }

    const reviewed = aligned ? reviewedEggCounts[recipeId]?.[index] : undefined;
    if (reviewed && (source?.amount !== reviewed[0] || source.unit !== "g" ||
        ingredient.amount !== reviewed[0] || !["g", "กรัม"].includes(ingredient.unit))) {
      throw new Error(`Stale kitchen egg count at ${recipeId}/${locale} ingredient ${index + 1}`);
    }
    const part = source && (reviewed ? (/keltuai/u.test(source.item) ? "yolk" : "whole") :
      source.unit === "kpl" ? eggPart(source.item) : undefined);
    const sourceEdit = shorterIngredientNotes[sourceNote];
    let detail = note && sourceEdit !== undefined ? (sourceEdit?.[locale] ?? "") : note;
    if (part && sourceNote === "noin 55 g ilman kuorta") detail = "";

    if (note && nutritionIngredientNotes.has(sourceNote)) nutrition.push(`${ingredient.item} · ${note}`);
    if (note && preparationIngredientNotes.has(sourceNote)) {
      preparation.push(`${ingredient.item} · ${detail}`);
      detail = "";
    }
    if (note && sourceEdit === undefined && nutritionIngredientNotes.has(sourceNote)) detail = "";

    // Two published names contain a second, base-batch quantity beside the
    // structured amount. Keep the reviewed ingredient identity and main measure.
    let item = ingredient.item;
    if (recipeId === "doner-kebab" && index === 9) {
      item = item.replace(/, 4 × 60 g$| 4 ชิ้น ชิ้นละ 60 กรัม$/u, "");
    }
    if (recipeId === "liha-juureskeitto-perunaton" && index === 7) item = item.replace(/, 6 kpl$/u, "");
    if ((recipeId === "indonesialainen-bubur-sumsum-punnittu-v2" && index === 2) ||
        (recipeId === "pohjoisafrikkalainen-msemen-hunajalla-punnittu-v2" && [1, 4].includes(index))) {
      const split = item.match(/^(.*?) \(([^)]+)\)$/u);
      if (split) {
        item = split[1];
        preparation.push(`${item} · ${split[2]}`);
      }
    }

    if (!part || !source) return { ...ingredient, item: appendDetail(item, detail, locale) };
    const size = source.item.startsWith("keskikokoinen") || sourceNote === "noin 2 keskikokoista kananmunaa" ||
      sourceNote === "noin yksi keskikokoinen muna" || sourceNote === "pohjaan, noin 2 keskikokoista munaa" ? "medium" :
      source.item.startsWith("isoa") || sourceNote === "noin viisi isoa kananmunaa" ? "large" : undefined;
    const [singular, plural] = (size ? sizedEggNames[size] : eggNames[part])[locale];
    const purpose = eggDetail(source, locale);
    if (purpose && detail !== purpose) detail = [purpose, detail].filter(Boolean).join(locale === "th" ? " " : ", ");
    return {
      amount: reviewed?.[1] ?? ingredient.amount,
      unit: locale === "th" ? "ฟอง" : "",
      item: plural,
      eggSingular: singular,
      ...(reviewed?.[2] && part === "whole" ? { eggWeightWithoutShellG: reviewed[0] } : {}),
      ...(detail ? { note: detail } : {}),
    };
  });
  return { items, preparation: [...new Set(preparation)], nutrition: [...new Set(nutrition)] };
}

type MethodEdits = Partial<Record<RecipeLocale, readonly (readonly [string, string])[]>>;

// A few methods explicitly weighed the whole egg or repeated the listed weight.
// Preserve the preparation and division of the egg when using the kitchen count.
const eggMethodEdits: Readonly<Record<string, MethodEdits>> = {
  "kiinalainen-bao-munalla-punnittu-v2": {
    fi: [["Jäähdytä, kuori ja punnitse 100 g munaa.", "Jäähdytä ja kuori munat."]],
    en: [["Cool, peel and weigh 100 g of egg.", "Cool and peel the eggs."]],
    sv: [["Kyl, skala och väg upp 100 g ägg.", "Låt äggen svalna och skala dem."]],
    th: [["พักให้เย็น ปอกเปลือกแล้วชั่งไข่ 100 กรัม", "พักให้เย็นแล้วปอกเปลือกไข่"]],
  },
  "vietnamilainen-banh-bao-kananmunalla-punnittu-v2": {
    fi: [["Jäähdytä, kuori ja jaa punnittu 50 g neljään osaan.", "Jäähdytä ja kuori muna. Leikkaa se neljään osaan."]],
    en: [["Cool, peel and divide the measured 50 g into four pieces.", "Cool and peel the egg, then cut it into four pieces."]],
    sv: [["Kyl, skala och dela de uppvägda 50 grammen i fyra bitar.", "Låt ägget svalna, skala det och dela det i fyra bitar."]],
    th: [["พักให้เย็น ปอกเปลือก ชั่ง 50 กรัมแล้วแบ่งเป็นสี่ชิ้น", "พักให้เย็น ปอกเปลือกแล้วหั่นไข่เป็นสี่ชิ้น"]],
  },
  "uunimuna-avokadot": {
    fi: [
      ["Riko luettelon yhteensä 200 g kuorettomia kananmunia ja jaa ne", "Riko aineslistan kananmunat ja jaa ne"],
      ["mitään mitatusta munasta ei jätetä pois", "käytä kaikki munat"],
    ],
    en: [
      ["Use all 200 g shelled eggs: divide", "Crack the eggs and divide them"],
      ["discard none of the measured egg", "use all the egg"],
    ],
    sv: [
      ["Använd alla 200 g ägg utan skal och fördela dem", "Knäck äggen och fördela dem"],
      ["Kasta inget av den uppvägda äggmängden.", "Använd alla ägg."],
    ],
    th: [
      ["ใช้ไข่ที่แกะเปลือกชั่งไว้ทั้งหมด 200 กรัม แบ่งใส่ช่องอะโวคาโด", "ตอกไข่ตามรายการแล้วแบ่งใส่ช่องอะโวคาโด"],
      ["ห้ามทิ้งไข่ที่ชั่งไว้", "ใช้ไข่ให้ครบทั้งหมด"],
    ],
  },
  "uunimunat-pinaatilla": {
    en: [[", using the listed total of 220 g shelled egg", ""]],
    sv: [[" och använd totalt 220 g ägg utan skal", ""]],
    th: [[" โดยใช้เนื้อไข่ไม่รวมเปลือกรวม 220 กรัม", ""]],
  },
  "raejuustobagelit-ilman-kohotusta": {
    fi: [["Sekoita 55 g kuoretonta kananmunaa ja voitele pinnat. Punnitse kulhoon jäävä muna.", "Vatkaa muna ja voitele renkaiden pinnat."]],
    en: [["Beat 55 g shelled egg and brush the rings, weighing the egg left unused.", "Beat the egg and brush the rings."]],
    sv: [["Vispa upp 55 g ägg utan skal, pensla och väg det som blir kvar.", "Vispa upp ägget och pensla ringarna."]],
    th: [["ตีไข่ไม่รวมเปลือก 55 กรัมทาหน้า แล้วชั่งไข่ที่เหลือ", "ตีไข่แล้วทาหน้าเบเกิล"]],
  },
};

export function projectEggMethod(recipeId: string, locale: RecipeLocale, method: string): string {
  const reviewed = reviewedEggCounts[recipeId];
  if (!reviewed) return method;
  for (const [before, after] of eggMethodEdits[recipeId]?.[locale] ?? []) method = method.replaceAll(before, after);
  const weights = Object.values(reviewed).flatMap(entry => entry ? [[entry[0], entry[1]] as const] : []);
  return projectEggWeightReferences(locale, method, weights);
}

export function projectEggWeightReferences(
  locale: RecipeLocale, method: string, weights: readonly (readonly [grams: number, count: number])[],
): string {
  // Reject the last number in decimals, grouped weights, ranges and qualified amounts.
  const exactFiAmount = String.raw`(?<!\d[.,]\s*)(?<!\d\s+)(?<!\d\s*[-‐‑‒–—―−/×*]\s*)(?<!\d\s+(?:tai|ja)\s+)` +
    String.raw`(?<![+±−<>=≤≥~≈\p{Pd}]\s*)(?<!\b(?:noin|vähintään|enintään|yli|alle)\s+)`;
  for (const [grams, count] of weights) {
    // Match only a reviewed gram amount directly attached to the localized egg
    // name. Other ingredients can use the same number in the very same step.
    const singular = count === 1;
    const [pattern, replacement] = {
      fi: [String.raw`${exactFiAmount}\b${grams}\s*g\s+(?:kuoretonta\s+|kuorettomana\s+punnittua\s+)?(?:kanan)?munaa\b`,
        singular ? "aineslistan kananmuna" : "aineslistan kananmunat"],
      en: [String.raw`\b${grams}\s*g\s+(?:of\s+)?(?:shelled\s+)?eggs?\b(?:,?\s+(?:weighed\s+)?without\s+(?:(?:its|the)\s+)?shells?)?`,
        singular ? "the egg" : "the eggs"],
      sv: [String.raw`\b${grams}\s*g\s+ägg\b(?:,?\s+(?:(?:som\s+vägts|vägt|uppvägt)\s+)?utan\s+skal)?`,
        singular ? "ägget" : "äggen"],
      th: [String.raw`(?:เนื้อ)?ไข่(?:ไก่)?(?:ที่ชั่งโดยไม่รวมเปลือก|ที่ชั่งไม่รวมเปลือก|ชั่งไม่รวมเปลือก|ที่ไม่รวมเปลือก|ไม่รวมเปลือก|ที่ตอกออกจากเปลือกแล้ว|เอาเปลือกออก)?\s*${grams}\s*(?:กรัม|g\b)`,
        "ไข่ตามรายการ"],
    }[locale];
    method = method.replace(new RegExp(pattern, "giu"), replacement);
  }
  return method;
}

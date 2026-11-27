import type { RecipeIngredient, RecipeLocale } from "../src/types/content";

type IngredientRow = Pick<RecipeIngredient, "item" | "amount" | "unit">;
type Translation = { locale: RecipeLocale; ingredients: readonly IngredientRow[] };
type SourceRow = { name: string; giRecordId: string | null; fineliRecordId: string | null };

// These labels identify reviewed rows when indexing translations of the sealed calculation.
const bindings = [
  {
    name: "tomaattia", giRecordId: "tomato-raw-cooked-sauce-analogue-gi-22", foodRecordId: "fineli-352-2026-10-24",
    index: 1, amount: 1,
    fi: { item: "tomaatti", unit: "kpl" },
    en: { item: "tomato", unit: "pcs" },
    sv: { item: "tomat", unit: "st" },
    th: { item: "มะเขือเทศ", unit: "ลูก" },
  },
  {
    name: "vihreää paprikaa", giRecordId: "vegetables-category-mean-gi-66", foodRecordId: "fineli-387-2026-10-24",
    index: 2, amount: 1,
    fi: { item: "vihreä paprika", unit: "kpl" },
    en: { item: "green bell pepper", unit: "pcs" },
    sv: { item: "grön paprika", unit: "st" },
    th: { item: "พริกหวานสีเขียว", unit: "ลูก" },
  },
  {
    name: "fetajuustoa", giRecordId: "dairy-category-mean-gi-35", foodRecordId: "fineli-11211-2026-10-24",
    index: 3, amount: 150,
    fi: { item: "feta", unit: "g" },
    en: { item: "feta", unit: "g" },
    sv: { item: "feta", unit: "g" },
    th: { item: "ชีสเฟตา", unit: "กรัม" },
  },
] as const;

function matchesRow(
  ingredients: readonly IngredientRow[],
  binding: typeof bindings[number],
  locale: RecipeLocale,
): boolean {
  const expected = binding[locale];
  const row = ingredients[binding.index];
  return row?.item === expected.item && row.amount === binding.amount && row.unit === expected.unit
    && ingredients.filter(ingredient => ingredient.item === expected.item).length === 1;
}

export function menemenEvidenceNames(
  source: SourceRow,
  finnish: readonly IngredientRow[],
  translations: readonly Translation[],
): Partial<Record<RecipeLocale, string>> {
  const binding = bindings.find(row => row.name === source.name
    && row.giRecordId === source.giRecordId && row.foodRecordId === source.fineliRecordId);
  if (!binding || !matchesRow(finnish, binding, "fi")) return {};

  const names: Partial<Record<RecipeLocale, string>> = {};
  for (const { locale, ingredients } of translations) {
    if (locale === "fi") {
      names.fi = source.name;
      continue;
    }
    if (translations.filter(entry => entry.locale === locale).length === 1
      && ingredients.length === finnish.length && matchesRow(ingredients, binding, locale)) {
      names[locale] = binding[locale].item;
    }
  }
  names.fi ??= source.name;
  return names;
}

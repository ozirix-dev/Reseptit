import { calculateGkScenarios, type GkScenario } from "./gk-estimated-range";

const vegetables = "https://doi.org/10.2337/dc08-1239";
const afcd = "https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd/data-files";
const schoni = "https://schoenifood.ch/de/produkte/fermentiert-und-roh/schoni-bio-kimchi-mit-peperoni-fermentiert-roh-280g/";

export const bindaetteokScenarios: GkScenario[] = [
  {
    id: "cheela-reference",
    rationale: "Named lower comparator with raw MEXT sprouts and a cheela GI transfer.",
    ingredients: [
      { id: "mung", grams: 150, availableChoPer100g: 41.9, gi: 36, choSource: afcd, giSource: "https://apjcn.qdu.edu.cn/3_4_1.pdf#page=2", applicability: "AFCD F000446 dry weight before soaking. Cheela used dry-milled flour, so the transfer is conditional." },
      { id: "sprouts", grams: 150, availableChoPer100g: 1.3, gi: 26.24, choSource: "https://fooddb.mext.go.jp/details/details.pl?ITEM_NO=6_06291_7", giSource: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11462625/#sec3-7", applicability: "Raw edible mung sprouts by MEXT mass sum. GI is from steamed germinated mung, a conditional cooking proxy." },
      { id: "kimchi", grams: 150, availableChoPer100g: 1.1, gi: 40, choSource: schoni, giSource: vegetables, applicability: "Named napa cabbage product. Published vegetable coding assumption applied to this low-CHO kimchi." },
      { id: "spring-onion", batchAvailableCho: 0.5, gi: 40, choSource: "https://github.com/ozirix-dev/Reseptit/pull/228", giSource: vegetables, applicability: "Pilot's 0.50 g batch CHO bound for 2 tbsp. Upper-CHO coding scenario." },
    ],
  },
  {
    id: "wet-ground-reference",
    rationale: "Named wet-ground comparator with higher-CHO retail mung sprouts.",
    ingredients: [],
  },
];
const lower = bindaetteokScenarios[0].ingredients;
bindaetteokScenarios[1].ingredients = lower.map(row => {
  if (row.id === "mung") return { ...row, gi: 50.8, giSource: "https://krishikosh.egranth.ac.in/server/api/core/bitstreams/5a54449e-2b00-41f6-ba6c-11ed98ffd41b/content", applicability: "Pesarattu from soaked and ground whole mung. Texture and fillings differ." };
  if (row.id === "sprouts") return { ...row, availableChoPer100g: 9.3, choSource: "https://lounasitu.fi/tuotteet/mungpavun-idut/", applicability: "Named Lounasitu retail product weighed raw. GI transfer from steamed germinated mung remains conditional." };
  return row;
});

// Plain salt and pure frying oil have no available carbohydrate.
export const bindaetteokProposal = calculateGkScenarios(2, ["mung", "sprouts", "kimchi", "spring-onion"], bindaetteokScenarios);

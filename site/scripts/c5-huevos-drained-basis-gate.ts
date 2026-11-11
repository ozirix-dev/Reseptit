/**
 * C5 follow-up: independent ingredient-level arithmetic, not nutrition approval.
 * Each label is explicitly "as sold" or undetermined, never assumed to be drained.
 * The original V2 recipe and the published FI version remain unchanged.
 */
export const huevosV2ProductCandidates = [
  {
    id: "gogreen-italy-current", ean: "7310130009839",
    source: "https://www.gogreen.fi/tuotteet/mustapavut/",
    retailSource: "https://www.k-ruoka.fi/kauppa/tuote/gogreen-mustapavut-380230g-7310130009839",
    labelBasis: "as_sold" as const, drainedBasisConfirmed: false,
    availableCarbohydratePer100G: 14, proteinPer100G: 7.4, fatPer100G: 0.8,
    fibrePer100G: 10,
    saleMassG: 380, netDrainedMassG: 230,
  },
  {
    id: "gogreen-sweden-legacy", ean: "7310130009785",
    source: "https://www.k-ruoka.fi/kauppa/tuote/gogreen-mustapavut-380230g-ruotsal-7310130009785",
    labelBasis: "as_sold" as const, drainedBasisConfirmed: false,
    availableCarbohydratePer100G: 8.5, proteinPer100G: 7.5, fatPer100G: 1.1,
    fibrePer100G: 8.5,
    saleMassG: 380, netDrainedMassG: 230,
  },
  {
    id: "bonduelle-current-400", ean: "3083681192513",
    source: "https://www.k-ruoka.fi/kauppa/tuote/bonduelle-mustat-pavut-400265g-3083681192513",
    labelBasis: "as_sold" as const, drainedBasisConfirmed: false,
    availableCarbohydratePer100G: 13, proteinPer100G: 7.3, fatPer100G: 1.1,
    fibrePer100G: 7.2, saleMassG: 400, netDrainedMassG: 265,
  }
] as const;

export type ProductCandidate = typeof huevosV2ProductCandidates[number];
const half = (g: number, per100: number) => g * per100 / 100 / 2;
const twoDecimals = (n:number)=>Math.round((n+1e-9)*100)/100;
/** Sources: Fineli 858 egg (110 g, peeled), Fineli-derived raw tomato (120 g),
 * La Costena Verde EAN 7501017005925 (150 g), Fineli 541 oil (13.5 g).
 * The tomato row still requires its original Fineli food-id before approval.
 */
const others={
  egg:{grams:110,carb:0.3,protein:12.61,fat:9.24},
  tomato:{grams:120,carb:3.45,protein:0.55,fat:0.30},
  salsa:{grams:150,carb:3.9,protein:0.9,fat:0.9},
  oil:{grams:13.5,carb:0,protein:0,fat:99.9},
} as const;
export function auditHuevosDrainedBasis(product:ProductCandidate, beanGrams=150) {
  if(!Number.isFinite(beanGrams)||beanGrams<=0)throw Error("INVALID_BEAN_GRAMS");
  if(product.drainedBasisConfirmed || product.labelBasis!=="as_sold")
    throw Error("UNREVIEWED_DRAINED_BASIS_STATE");
  const subtotal=(field:"carb"|"protein"|"fat")=>half(others.egg.grams,others.egg[field])+
      half(others.tomato.grams,others.tomato[field])+
      half(others.salsa.grams,others.salsa[field]);
  // Counterfactual only: assuming (NOT establishing) drained beans have as-sold label values.
  const carb=subtotal("carb")+half(beanGrams,product.availableCarbohydratePer100G);
  const protein=subtotal("protein")+half(beanGrams,product.proteinPer100G);
  const fatBeforeOil=subtotal("fat")+half(beanGrams,product.fatPer100G);
  const fatFullOil=fatBeforeOil+half(others.oil.grams,others.oil.fat);
  return {
    id:product.id,ean:product.ean,usedBeanGrams:beanGrams,
    labelBasis:product.labelBasis,drainedBasisConfirmed:false,
    counterfactualPerServing:{
      availableCarbohydrateG:twoDecimals(carb),
      proteinG:twoDecimals(protein),
      fatGRange:{min:twoDecimals(fatBeforeOil),max:twoDecimals(fatFullOil)}
    },
    /** The drained-to-sale mass fraction is only a packaging yield, never a nutrient conversion. */
    packagingYieldRatio:twoDecimals(product.netDrainedMassG/product.saleMassG),
    approvedNutrition:null,approvedFibre:null,approvedTotalCarbohydrate:null,
    approvedGk:null,releaseAuthorized:false
  };
}

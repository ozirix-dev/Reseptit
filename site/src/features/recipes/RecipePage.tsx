import {formatGlycemicLoadNumber} from "./gk80-format";
import { recipeHeroSizes } from "./image-layout";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useContent } from "@/lib/content";
import { glycemicLoadPath, recipeIndexPath, recipeLocaleFromPath, recipeLocaleName, recipeUi } from "./recipe-i18n";
import { formatIngredientAmount, nextServingCount } from "./servings";
import { toolUi } from "./recipe-tools";
import { glycemicLoadPilotResults } from "@/generated/glycemic-load-pilot.generated";
import { publishedGlycemicLoadForRecipe } from "./glycemic-load-display";

export function RecipePage() {
  const { pathname } = useLocation();
  const { recipe, translations } = useContent();
  const [servings, setServings] = useState(recipe?.servings ?? 1);
  const [hydrated, setHydrated] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);
  const locale = recipe?.locale ?? recipeLocaleFromPath(pathname);
  const labels = recipeUi[locale];
  const tools = toolUi[locale];
  useEffect(() => { setHydrated(true); setServings(recipe?.servings ?? 1); setCompleted([]); }, [recipe?.recipeId, recipe?.locale]);
  if (!recipe) return <section className="page-section"><div className="container container--narrow"><h1>{labels.notFound}</h1><p><Link to={recipeIndexPath(locale)}>{labels.backToRecipes}</Link></p></div></section>;
  const numberLocale = { fi: "fi-FI", en: "en-GB", sv: "sv-SE", th: "th-TH" }[recipe.locale];
  const nutritionItems = Object.entries(recipe.nutrition).filter(([, value]) => value !== null) as [keyof typeof recipe.nutrition, number][];
  const glApprox = { fi: "noin ", en: "about ", sv: "cirka ", th: "ประมาณ " }[recipe.locale];
  const glUnit = { fi: "/ annos", en: "/ serving", sv: "/ portion", th: "/ หนึ่งที่" }[recipe.locale];
  const glycemicLoad = publishedGlycemicLoadForRecipe(recipe.recipeId, glycemicLoadPilotResults);
  const glFormat=(value:number)=>formatGlycemicLoadNumber(value,numberLocale,!!glycemicLoad?.assessmentType);
  const modelledLabel = { fi: "Mallinnettu", en: "Modeled", sv: "Modellerad", th: "ค่าประมาณจากแบบจำลอง" }[recipe.locale];
  const modelledNote = {"fi": "Kaikki imeytyvät hiilihydraatit ovat mukana. Ei pieniä pois jätettyjä osuuksia. Mallinnettu ainesosalaskelma, ei aterialla mitattu vaste. Numeerista biologista epävarmuusväliä ei tunneta.", "en": "All available carbohydrate is included, with no small portions omitted. This is a modeled ingredient estimate, not a measured meal response. Biological uncertainty has not been quantified.", "sv": "Alla tillgängliga kolhydrater ingår utan utelämnade små mängder. Detta är en modellerad ingrediensberäkning, inte ett uppmätt måltidssvar. Biologisk osäkerhet har inte kvantifierats.", "th": "รวมคาร์โบไฮเดรตที่ใช้ได้ทั้งหมดโดยไม่ตัดส่วนเล็กน้อยออก เป็นค่าประมาณจากวัตถุดิบ ไม่ใช่ผลตอบสนองจากมื้ออาหารที่วัดจริง ยังไม่ทราบช่วงความไม่แน่นอนทางชีวภาพเป็นตัวเลข"}[recipe.locale];
  const glClass = (v:number) => v <= 10 ? 0 : v < 20 ? 1 : 2;
  const classNames = {fi:["matala GK", "keskisuuri GK", "korkea GK"],en:["low GL","medium GL","high GL"],sv:["låg GL","medelhög GL","hög GL"],th:["GL ต่ำ","GL ปานกลาง","GL สูง"]}[recipe.locale];
  const classLabel = glycemicLoad ? [...new Set([glClass(glycemicLoad.glycemicLoadRangePerServing?.min ?? glycemicLoad.glycemicLoadPerServing),glClass(glycemicLoad.glycemicLoadRangePerServing?.max ?? glycemicLoad.glycemicLoadPerServing)])].map(i=>classNames[i]).join("–") : "";
  const glValue = glycemicLoad?.glycemicLoadRangePerServing
    ? `${glApprox}${glFormat(glycemicLoad.glycemicLoadRangePerServing.min)}–${glFormat(glycemicLoad.glycemicLoadRangePerServing.max)}`
    : glycemicLoad ? `${glApprox}${glFormat(glycemicLoad.glycemicLoadPerServing)}` : "";
  return <article className="page-section recipe-page"><div className="container container--narrow">
    <nav className="article-breadcrumbs" aria-label={labels.breadcrumb}><Link to={recipe.locale === "fi" ? "/" : `/${recipe.locale === "sv" ? "sv/recept" : `${recipe.locale}/recipes`}/`}>{labels.indexTitle}</Link><span aria-hidden="true">/</span><span>{recipe.title}</span></nav>
    <header className="recipe-header"><p className="eyebrow">{labels.category[recipe.category]}</p><h1>{recipe.title}</h1><p className="article-excerpt">{recipe.description}</p>
      <div className="recipe-actions"><a href="#recipe-instructions" onClick={() => document.getElementById("recipe-instructions")?.focus()}>{tools.jump}</a>{hydrated ? <button type="button" onClick={() => window.print()}>{tools.print}</button> : null}</div>
      <div className="recipe-facts">{recipe.timeTotalMin ? <span>{recipe.timeTotalMin} {labels.minutes}</span> : null}{recipe.difficulty ? <span>{labels.difficulty}: {recipe.difficulty}</span> : null}</div>
      {translations.length > 1 ? <nav className="recipe-languages" aria-label={labels.languages}>{translations.map((entry) => <Link key={entry.locale} hrefLang={entry.locale} aria-current={entry.locale === recipe.locale ? "page" : undefined} to={entry.routePath}>{recipeLocaleName(entry.locale)}</Link>)}</nav> : null}
    </header>
    {recipe.image ? <img className="recipe-image" src={recipe.image.src} srcSet={recipe.image.srcSet ?? undefined} sizes={recipeHeroSizes} alt={recipe.image.alt} width={recipe.image.width} height={recipe.image.height} fetchPriority="high" decoding="async" /> : null}
    <p className="print-servings">{tools.servings}: {servings}</p>
    <div className="recipe-layout">
      <section className="recipe-panel" aria-labelledby="recipe-ingredients-title"><div className="recipe-panel__heading"><h2 id="recipe-ingredients-title">{labels.ingredients}</h2><div className="serving-control"><span>{labels.servings}</span>{hydrated ? <button type="button" aria-label={labels.decrease} disabled={servings <= 1} onClick={() => setServings((value) => nextServingCount(value, -1))}>−</button> : null}<output aria-live="polite">{servings}</output>{hydrated ? <button type="button" aria-label={labels.increase} onClick={() => setServings((value) => nextServingCount(value, 1))}>+</button> : null}</div></div>
        <ul className="ingredient-list">{recipe.ingredients.map((ingredient, index) => <li key={`${ingredient.item}-${index}`}><span>{ingredient.amount === null ? "" : `${formatIngredientAmount(ingredient.amount, servings, recipe.servings, numberLocale)}${ingredient.unit ? ` ${ingredient.unit}` : ""} `}{ingredient.item}</span>{ingredient.note ? <span className="ingredient-note">{ingredient.note}</span> : null}</li>)}</ul>
      </section>
      <section className="recipe-panel" aria-labelledby="recipe-instructions"><h2 id="recipe-instructions" tabIndex={-1}>{labels.instructions}</h2>
        {servings !== recipe.servings ? <p className="recipe-disclosure recipe-scaled-note">{tools.scaled(recipe.servings)}</p> : null}
        {hydrated && recipe.instructionStepsHtml?.length ? <><div className="step-controls"><p aria-live="polite">{tools.progress}: {completed.length}/{recipe.instructionStepsHtml.length}</p><button type="button" onClick={() => setCompleted([])}>{tools.reset}</button></div><div className="rich-text"><ol className="recipe-steps">{recipe.instructionStepsHtml.map((step, index) => <li key={index} data-complete={completed.includes(index)}><div><label className="recipe-step-toggle"><input type="checkbox" aria-label={`${tools.completed}: ${index + 1}`} checked={completed.includes(index)} onChange={(event) => { const checked = event.currentTarget.checked; setCompleted(values => checked ? [...values, index] : values.filter(value => value !== index)); }} /></label><div className="recipe-step-text" dangerouslySetInnerHTML={{ __html: step }} /></div></li>)}</ol></div></> : <div className="rich-text" dangerouslySetInnerHTML={{ __html: recipe.instructionsHtml }} />}
      </section>
      <section className="recipe-panel"><h2>{labels.nutrition}</h2><p className="recipe-disclosure">{nutritionItems.length ? tools.nutrition : tools.missing}</p>{nutritionItems.length ? <dl className="nutrition-list">{nutritionItems.map(([key, value]) => <div key={key}><dt>{labels.nutrients[key]}</dt><dd>{formatIngredientAmount(value, 1, 1, numberLocale)} g</dd></div>)}</dl> : null}{glycemicLoad ? <div className="recipe-glycemic-load"><dl className="nutrition-list"><div><dt>{glycemicLoad.assessmentType ? `${modelledLabel} ${labels.glycemicLoad}` : labels.glycemicLoad}</dt><dd>{glValue} {glUnit}</dd></div></dl>{glycemicLoad.assessmentType ? <p className="recipe-glycemic-load__class">{classLabel}</p> : null}<p className="recipe-glycemic-load__caption">{labels.glycemicLoadConfidence(glycemicLoad.confidence)} {glycemicLoad.assessmentType ? modelledNote : labels.glycemicLoadNote} {glycemicLoad.omittedAvailableCarbohydratePerServingG > 0 ? labels.glycemicLoadOmission(new Intl.NumberFormat(numberLocale, { maximumSignificantDigits: 1 }).format(glycemicLoad.omittedAvailableCarbohydratePerServingG)) : null} {labels.glycemicLoadMethod} <Link to={`${glycemicLoadPath(recipe.locale)}#${recipe.recipeId}`} aria-label={`${labels.glycemicLoadMethod}: ${recipe.title}`}>↗</Link></p></div> : null}{recipe.dietClass ? <p className="recipe-disclosure">{tools.diet}</p> : null}</section>
      {recipe.notesHtml ? <section className="recipe-panel"><h2>{labels.notes}</h2><div className="rich-text" dangerouslySetInnerHTML={{ __html: recipe.notesHtml }} /></section> : null}
    </div>
  </div></article>;
}

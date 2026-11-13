import { EstimateDetails, EstimateSummary, MissingEstimate } from "../glycemic-load/GlycemicLoadEvidence";
import { gkCopy } from "../glycemic-load/glycemic-load-copy";
import { ChocolateComparison } from './ChocolateComparisonFi';
import {gkOnlyVariants} from '@/generated/gk-only-variants.generated';
import {GkOnlyVariantPanel,gkScopeUi} from './GkOnlyVariantPanel';
import {scopedPolyolDisclosure} from './scoped-polyol-disclosure';
import {recoveryDisclosure} from './recovery-disclosure';
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
import { sourceReviewNotice } from "./source-review-notices";
import { withholdF25Nutrition, f25ExplicitUndefinedGkLabel } from "./f25-nutrition-withhold";

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
  const originalReviewNotice = recipe.locale === "fi" ? sourceReviewNotice(recipe.recipeId) : null;
  // Keep the SHA-sealed historic FI recipe and the shared F25 B1 notice source
  // unchanged. The editorial time estimate belongs to this public view only.
  const reviewNotice = originalReviewNotice && recipe.locale === "fi"
    && recipe.recipeId === "vietnamilainen-banh-cuon-sienilla"
    ? {
        ...originalReviewNotice,
        heading: "Riisilevyjen valmistus ja täytteen turvallisuus",
        details: "Sienistä huolimatta täytteessä on 150 g raakaa porsaan jauhelihaa: tämä ei ole kasvisruoka. Kypsennä jauheliha kauttaaltaan täysin kypsäksi. Ohuiden riisilevyjen valmistamiseen ja irrottamiseen on varattu noin 40–50 minuuttia. Sivun 50 minuutin kokonaisaika on toimituksellinen arvio, ei koepaistossa mitattu aika.",
      }
    : originalReviewNotice;
  const withholdNutrition = withholdF25Nutrition(recipe.recipeId,recipe.locale);
  const undefinedGkLabel = f25ExplicitUndefinedGkLabel(recipe.recipeId,recipe.locale);
  const gkVariants = gkOnlyVariants.filter(variant => variant.recipeId === recipe.recipeId);
  const hasGkVariant = gkVariants.length > 0;
  const numberLocale = { fi: "fi-FI", en: "en-GB", sv: "sv-SE", th: "th-TH" }[recipe.locale];
  const nutritionItems = (withholdNutrition ? [] : Object.entries(recipe.nutrition).filter(([, value]) => value !== null)) as [keyof typeof recipe.nutrition, number][];
  const glApprox = { fi: "noin ", en: "about ", sv: "cirka ", th: "ประมาณ " }[recipe.locale];
  const glUnit = { fi: "/ annos", en: "/ serving", sv: "/ portion", th: "/ หนึ่งที่" }[recipe.locale];
  const glycemicLoad = withholdNutrition ? null : publishedGlycemicLoadForRecipe(recipe.recipeId, glycemicLoadPilotResults);
  const glFormat=(value:number)=>formatGlycemicLoadNumber(value,numberLocale,!!glycemicLoad?.assessmentType);
  const modelledLabel = { fi: "Mallinnettu", en: "Modeled", sv: "Modellerad", th: "ค่าประมาณจากแบบจำลอง" }[recipe.locale];
  const modelledNote = glycemicLoad && glycemicLoad.omittedAvailableCarbohydratePerServingG > 0
    ? {
      fi: "Dokumentoituja pieniä osuuksia on jätetty pois laskelmasta. Yhteenlaskettu määrä tai dokumentoitu yläraja ilmoitetaan erikseen. Mallinnettu ainesosalaskelma, ei aterialla mitattu vaste. Numeerista biologista epävarmuusväliä ei tunneta.",
      en: "Documented small portions are omitted from this calculation. Their combined amount or documented upper bound is shown separately. This is a modeled ingredient estimate, not a measured meal response. Biological uncertainty has not been quantified.",
      sv: "Dokumenterade små mängder har utelämnats ur beräkningen. Deras sammanlagda mängd eller dokumenterade övre gräns redovisas separat. Detta är en modellerad ingrediensberäkning, inte ett uppmätt måltidssvar. Biologisk osäkerhet har inte kvantifierats.",
      th: "การคำนวณนี้ไม่รวมส่วนผสมปริมาณเล็กน้อยที่มีการบันทึกไว้ โดยแสดงปริมาณรวมหรือขีดจำกัดบนที่มีข้อมูลรองรับแยกไว้ เป็นค่าประมาณจากวัตถุดิบ ไม่ใช่ผลตอบสนองจากมื้ออาหารที่วัดจริง ยังไม่ทราบช่วงความไม่แน่นอนทางชีวภาพเป็นตัวเลข",
    }[recipe.locale]
    : {"fi": "Kaikki imeytyvät hiilihydraatit ovat mukana. Ei pieniä pois jätettyjä osuuksia. Mallinnettu ainesosalaskelma, ei aterialla mitattu vaste. Numeerista biologista epävarmuusväliä ei tunneta.", "en": "All available carbohydrate is included, with no small portions omitted. This is a modeled ingredient estimate, not a measured meal response. Biological uncertainty has not been quantified.", "sv": "Alla tillgängliga kolhydrater ingår utan utelämnade små mängder. Detta är en modellerad ingrediensberäkning, inte ett uppmätt måltidssvar. Biologisk osäkerhet har inte kvantifierats.", "th": "รวมคาร์โบไฮเดรตที่ใช้ได้ทั้งหมดโดยไม่ตัดส่วนเล็กน้อยออก เป็นค่าประมาณจากวัตถุดิบ ไม่ใช่ผลตอบสนองจากมื้ออาหารที่วัดจริง ยังไม่ทราบช่วงความไม่แน่นอนทางชีวภาพเป็นตัวเลข"}[recipe.locale];
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
    {reviewNotice ? <aside className="recipe-panel" role="note" data-f25-source-hold={recipe.recipeId}><h2>{reviewNotice.heading}</h2><p>{reviewNotice.details}</p><p>{reviewNotice.allergens}</p></aside> : null}
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
      <section className="recipe-panel" data-nutrition-scope="ORIGINAL_RECIPE"><h2>{hasGkVariant?gkScopeUi[locale].originalNutrition:labels.nutrition}</h2>{hasGkVariant?<p className="recipe-disclosure" data-macro-separation="gk-only"><strong>{gkScopeUi[locale].macroNotice}</strong></p>:null}<p className="recipe-disclosure" data-f25-nutrition-status={withholdNutrition ? "SOURCE_REVIEW_WITHHELD" : undefined}>{withholdNutrition ? "Ravintoarvojen julkaisu on keskeytetty, koska annoksen ainesosakohtainen laskenta tai tuotematch ei ole vielä hyväksyttävä. Lähtöarvoja ei näytetä virheellisen tarkkoina. Katso reseptin lähdehuomautus." : nutritionItems.length ? tools.nutrition : tools.missing}</p>{recipe.recipeId === "rapeat-juustonaksut" ? <p className="recipe-disclosure">Arvio koskee cheddaria. Savupaprikaa on 0,25 g annoksessa ja se on jätetty laskelmasta.</p> : null}{nutritionItems.length ? <dl className="nutrition-list">{nutritionItems.map(([key, value]) => <div key={key}><dt>{labels.nutrients[key]}</dt><dd>{formatIngredientAmount(value, 1, 1, numberLocale)} g</dd></div>)}</dl> : null}
        {withholdNutrition ? <div className="recipe-glycemic-load" data-gk-scope="ORIGINAL_RECIPE" data-gk-status={undefinedGkLabel ? "NOT_DEFINED" : "WITHHELD_SOURCE_REVIEW"}><p className="recipe-disclosure">{undefinedGkLabel ? <><strong>{undefinedGkLabel}</strong>. Tähän valmistusversioon ei ole riittävästi luotettavaa GI-lähdetietoa GK:n laskentaan.</> : "GK-arviota ei näytetä ennen tämän reseptin raaka-aine- ja ravintoarvoperustan uudelleentarkistusta."}</p></div> : glycemicLoad ? <div className="recipe-glycemic-load" data-gk-scope="ORIGINAL_RECIPE" data-gk-status="CALCULATED">
          <dl className="nutrition-list"><div>
            <dt>{glycemicLoad.assessmentType ? `${modelledLabel} ${labels.glycemicLoad}` : labels.glycemicLoad}</dt>
            <dd>{glValue} {glUnit}</dd>
          </div></dl>
          {glycemicLoad.assessmentType ? <p className="recipe-glycemic-load__class">{classLabel}</p> : null}
          <EstimateSummary result={glycemicLoad} locale={locale} />
          <p className="recipe-glycemic-load__caption">
            <Link to={`${glycemicLoadPath(locale)}#${recipe.recipeId}`} aria-label={`${gkCopy[locale].see} · ${recipe.title}`}>
              {gkCopy[locale].see} ↗
            </Link>
          </p>
          <EstimateDetails result={glycemicLoad} locale={locale}
            notes={<>
              {glycemicLoad.assessmentType && !glycemicLoad.closedRecoveryC && !glycemicLoad.boundedPolyolC ? <p>{modelledNote}</p> : null}
              {!glycemicLoad.assessmentType ? <p>{labels.glycemicLoadNote}</p> : null}
              {glycemicLoad.omittedAvailableCarbohydratePerServingG > 0
                ? <p>{labels.glycemicLoadOmission(new Intl.NumberFormat(numberLocale, { maximumSignificantDigits: 1 }).format(glycemicLoad.omittedAvailableCarbohydratePerServingG))}</p>
                : null}
            </>}
            technicalNotes={glycemicLoad.closedRecoveryC ? <p>{recoveryDisclosure[locale]}</p> :
              glycemicLoad.boundedPolyolC ? <p>{scopedPolyolDisclosure[locale]}</p> : undefined}
          />
        </div> : <div className="recipe-glycemic-load" data-gk-scope="ORIGINAL_RECIPE" data-gk-status="UNAVAILABLE">
          <MissingEstimate locale={locale} result={glycemicLoadPilotResults.find(result => result.recipeId === recipe.recipeId) ?? { incompleteReasons: [] }} />
        </div>}
        {recipe.dietClass ? <p className="recipe-disclosure">{tools.diet}</p> : null}</section>
      {gkVariants.map(variant => <GkOnlyVariantPanel key={variant.versionId}
        variant={variant} locale={recipe.locale} servings={servings} originalHasGk={Boolean(glycemicLoad)} originalRecipe={recipe} />)}
      <ChocolateComparison recipeId={recipe.recipeId} locale={recipe.locale} hasGlVariant={hasGkVariant} />
      {recipe.notesHtml ? <section className="recipe-panel"><h2>{labels.notes}</h2><div className="rich-text" dangerouslySetInnerHTML={{ __html: recipe.notesHtml }} /></section> : null}
    </div>
  </div></article>;
}

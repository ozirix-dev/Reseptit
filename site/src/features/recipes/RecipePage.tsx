import { EstimateDetails, EstimateSummary, MissingEstimate, OriginalGkCoverageNote } from "../glycemic-load/GlycemicLoadEvidence";
import { gkCopy } from "../glycemic-load/glycemic-load-copy";
import { ChocolateComparison } from './ChocolateComparisonFi';
import {GkOnlyVariantPanel,gkScopeUi} from './GkOnlyVariantPanel';
import {scopedPolyolDisclosure} from './scoped-polyol-disclosure';
import {recoveryDisclosure} from './recovery-disclosure';
import { originalPortionCarbs, originalPortionGk } from "./gk-portion";
import { GkAlternatives, originalGkClassDisclosure, portionCopy, RecipePortionSummary, VerbalPortionEstimate } from "./RecipePortionSummary";
import { formatOriginalPortionGk } from "./gk80-format";
import { recipeHeroAvifMedia, recipeHeroSizes } from "./image-layout";
import type { RecipeImage } from "@/types/content";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useContent } from "@/lib/content";
import { glycemicLoadPath, recipeIndexPath, recipeLocaleFromPath, recipeLocaleName, recipeUi } from "./recipe-i18n";
import { formatIngredientAmount, formatRecipeIngredient, hasFractionalEgg, ingredientNumberLocales, nextServingCount } from "./servings";
import { toolUi } from "./recipe-tools";
import { publishedGlycemicLoadForRecipe } from "./glycemic-load-display";
import { sourceReviewNotice } from "./source-review-notices";
import { withholdF25Nutrition, f25ExplicitUndefinedGkLabel } from "./f25-nutrition-withhold";

import { track } from "@/features/privacy/analytics";
import { articles, articlePath } from "@/features/blog/blog-data";

function RecipeHeroImage({ image }: { image: RecipeImage }) {
  const [avifFailed, setAvifFailed] = useState(false);
  const avifSrc = avifFailed ? undefined : image.heroAvifSrc;
  const fallback = <img className="recipe-image" src={image.src} srcSet={image.srcSet ?? undefined}
    sizes={recipeHeroSizes} alt={image.alt} width={image.width} height={image.height}
    fetchPriority="high" decoding="async"
    ref={avifSrc ? element => {
      if (element?.complete && element.naturalWidth === 0 && element.currentSrc === avifSrc) setAvifFailed(true);
    } : undefined}
    onError={avifSrc ? ({ currentTarget }) => {
      if (currentTarget.currentSrc === avifSrc) setAvifFailed(true);
    } : undefined} />;
  return avifSrc ? <picture>
    <source type="image/avif" media={recipeHeroAvifMedia} srcSet={avifSrc} />
    {fallback}
  </picture> : fallback;
}

export function RecipePage() {
  const { pathname } = useLocation();
  const { recipe, translations, glycemicRecipe } = useContent();
  const [servings, setServings] = useState(recipe?.servings ?? 1);
  const [hydrated, setHydrated] = useState(false);
  const [eatenPortion, setEatenPortion] = useState(1);
  const [completed, setCompleted] = useState<number[]>([]);
  const locale = recipe?.locale ?? recipeLocaleFromPath(pathname);
  const labels = recipeUi[locale];
  const tools = toolUi[locale];
  useEffect(() => { setHydrated(true); setServings(recipe?.servings ?? 1); setCompleted([]); setEatenPortion(1); }, [recipe?.recipeId, recipe?.locale]);
  if (!recipe) return <section className="page-section"><div className="container container--narrow"><h1>{labels.notFound}</h1><p><Link to={recipeIndexPath(locale)}>{labels.backToRecipes}</Link></p></div></section>;
  const relatedGuides = recipe.locale === "fi"
    ? articles.filter(article => article.related.some(link => link.path === recipe.routePath))
    : [];
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
  const gkVariants = glycemicRecipe?.variants ?? [];
  const gkResult = glycemicRecipe?.result;
  const hasGkVariant = gkVariants.length > 0;
  const numberLocale = ingredientNumberLocales[recipe.locale];
  const ingredients = recipe.kitchenIngredients ?? recipe.ingredients;
  const nutritionItems = (withholdNutrition ? [] : Object.entries(recipe.nutrition).filter(([, value]) => value !== null)) as [keyof typeof recipe.nutrition, number][];
  const glApprox = { fi: "noin ", en: "about ", sv: "cirka ", th: "ประมาณ " }[recipe.locale];
  const glUnit = { fi: "/ annos", en: "/ serving", sv: "/ portion", th: "/ หนึ่งที่" }[recipe.locale];
  const glycemicLoad = withholdNutrition || !gkResult ? null : publishedGlycemicLoadForRecipe(recipe.recipeId, [gkResult]);
  const modeledGlLabel = { fi: "Mallinnettu GK-arvio", en: "Modeled GL estimate", sv: "Modellerad GL-uppskattning", th: "ค่าประมาณ GL จากแบบจำลอง" }[recipe.locale];
  const modelledNote = glycemicLoad && glycemicLoad.omittedAvailableCarbohydratePerServingG > 0
    ? {
      fi: "Dokumentoituja pieniä osuuksia on jätetty pois laskelmasta. Poisjättöselite kertoo, käytettiinkö arviota, ylärajaa tai laskentaoletusta. Mallinnettu ainesosalaskelma, ei aterialla mitattu vaste. Numeerista biologista epävarmuusväliä ei tunneta.",
      en: "Small amounts of available carbohydrate are left out. The omission note explains whether the model used an estimate, an upper limit or an assumption. This is a modeled ingredient estimate, not a measured meal response. Biological uncertainty has not been quantified.",
      sv: "Dokumenterade små mängder har utelämnats ur beräkningen. Kommentaren om utelämnade mängder anger om modellen använder en uppskattning, en övre gräns eller ett antagande. Detta är en modellerad ingrediensberäkning, inte ett uppmätt måltidssvar. Biologisk osäkerhet har inte kvantifierats.",
      th: "การคำนวณนี้ไม่รวมส่วนผสมปริมาณเล็กน้อยที่มีการบันทึกไว้ คำอธิบายส่วนที่เว้นไว้จะระบุว่าแบบจำลองใช้ค่าประมาณ ขีดจำกัดบน หรือค่าที่สมมติขึ้น เป็นค่าประมาณจากวัตถุดิบ ไม่ใช่ผลตอบสนองจากมื้ออาหารที่วัดจริง ยังไม่ทราบช่วงความไม่แน่นอนทางชีวภาพเป็นตัวเลข",
    }[recipe.locale]
    : {"fi": "Laskelma kattaa ohjeen ainesluettelon imeytyvät hiilihydraatit. Tulos perustuu ainesosien mallinnukseen. Numeerista biologista epävarmuusväliä ei tunneta.", "en": "The calculation covers the available carbohydrate in the listed ingredients. It models their contributions. Biological uncertainty has not been quantified.", "sv": "Beräkningen omfattar de tillgängliga kolhydraterna i de angivna ingredienserna. Resultatet bygger på en ingrediensmodell. Biologisk osäkerhet har inte kvantifierats.", "th": "การคำนวณครอบคลุมคาร์โบไฮเดรตที่ใช้ได้ในวัตถุดิบตามรายการ ผลเป็นค่าจากแบบจำลองวัตถุดิบ ยังไม่ทราบช่วงความไม่แน่นอนทางชีวภาพเป็นตัวเลข"}[recipe.locale];
  const portionEvidence = glycemicRecipe?.portionEvidence;
  const ingredientGk = portionEvidence?.gkIngredientSubset;
  const gkMethodLink = <p className="recipe-glycemic-load__caption">
    <Link to={`${glycemicLoadPath(locale)}#${recipe.recipeId}`} aria-label={`${gkCopy[locale].see} · ${recipe.title}`}>
      {gkCopy[locale].see} ↗
    </Link>
  </p>;
  const portionWords = portionCopy[locale];
  const portionCarbs = withholdNutrition ? null : originalPortionCarbs(recipe.nutrition, portionEvidence);
  const scaled = glycemicLoad ? originalPortionGk(glycemicLoad, eatenPortion) : null;
  const display = scaled ? formatOriginalPortionGk(scaled.estimate, numberLocale, !!glycemicLoad?.assessmentType) : null;
  const glValue = display?.value ? `${glApprox}${display.value}` : "";
  const gkClass = originalGkClassDisclosure(scaled, locale, {
    limitation: portionEvidence?.classLimitation?.[locale],
    detailedOmissions: !!glycemicLoad?.originalGkCoverage,
    roundingHitsBoundary: display?.roundingHitsBoundary,
  });
  // Qualify reviewed notices in the public view while retaining the recipe source.
  const notesHtml = !withholdNutrition
    ? glycemicRecipe?.reviewedNotesHtml ?? (portionEvidence?.verbal && locale === "fi"
      ? recipe.notesHtml.replace("<strong>GK: ei määritetty.</strong>", "<strong>Numeerista GK-arvoa ei ole määritetty.</strong>")
      : recipe.notesHtml)
    : recipe.notesHtml;
  return <article className="page-section recipe-page"><div className="container container--narrow">
    <nav className="article-breadcrumbs" aria-label={labels.breadcrumb}><Link to={recipe.locale === "fi" ? "/" : `/${recipe.locale === "sv" ? "sv/recept" : `${recipe.locale}/recipes`}/`}>{labels.indexTitle}</Link><span aria-hidden="true">/</span><span>{recipe.title}</span></nav>
    <header className="recipe-header"><p className="eyebrow">{[recipe.category, ...(recipe.additionalCategories ?? [])].map(category => labels.category[category]).join(" · ")}</p><h1>{recipe.title}</h1><p className="article-excerpt">{recipe.description}</p>
      <div className="recipe-actions"><a href="#recipe-instructions" onClick={() => { track("View Instructions"); document.getElementById("recipe-instructions")?.focus(); }}>{tools.jump}</a>{hydrated ? <button type="button" onClick={() => { track("Print Recipe"); window.print(); }}>{tools.print}</button> : null}</div>
      <div className="recipe-facts">{recipe.timeTotalMin ? <span>{recipe.timeTotalMin} {labels.minutes}</span> : null}{recipe.difficulty ? <span>{labels.difficulty}: {recipe.difficulty}</span> : null}</div>
      {translations.length > 1 ? <nav className="recipe-languages" aria-label={labels.languages}>{translations.map((entry) => <Link key={entry.locale} hrefLang={entry.locale} aria-current={entry.locale === recipe.locale ? "page" : undefined} to={entry.routePath}>{recipeLocaleName(entry.locale)}</Link>)}</nav> : null}
    </header>
    {reviewNotice ? <aside className="recipe-panel" role="note" data-f25-source-hold={recipe.recipeId}><h2>{reviewNotice.heading}</h2><p>{reviewNotice.details}</p><p>{reviewNotice.allergens}</p></aside> : null}
    {recipe.image ? <RecipeHeroImage key={recipe.image.src} image={recipe.image} /> : null}
    <p className="print-servings">{tools.servings}: {servings}</p>
    <div className="recipe-layout">
      <section className="recipe-panel" aria-labelledby="recipe-ingredients-title"><div className="recipe-panel__heading"><h2 id="recipe-ingredients-title">{labels.ingredients}</h2><div className="serving-control" role="group" aria-labelledby="recipe-batch-label"><span id="recipe-batch-label">{portionWords.batch}</span>{hydrated ? <button type="button" aria-label={labels.decrease} disabled={servings <= 1} onClick={() => { track("Adjust Servings"); setServings((value) => nextServingCount(value, -1)); }}>−</button> : null}<output aria-live="polite">{servings}</output>{hydrated ? <button type="button" aria-label={labels.increase} onClick={() => { track("Adjust Servings"); setServings((value) => nextServingCount(value, 1)); }}>+</button> : null}</div></div>
        <ul className="ingredient-list">{ingredients.map((ingredient, index) =>
          <li key={`${ingredient.item}-${index}`}>{formatRecipeIngredient(ingredient, servings, recipe.servings, locale)}</li>)}</ul>
        {ingredients.some(ingredient => hasFractionalEgg(ingredient, servings, recipe.servings))
          ? <p>{tools.eggFraction}</p> : null}
      </section>
      <section className="recipe-panel" aria-labelledby="recipe-instructions"><h2 id="recipe-instructions" tabIndex={-1}>{labels.instructions}</h2>
        {servings !== recipe.servings ? <p className="recipe-disclosure recipe-scaled-note">{tools.scaled(recipe.servings)}</p> : null}
        {recipe.ingredientPreparation?.length ? <div className="rich-text">
          <h3>{tools.ingredientPreparation}</h3>
          <ul>{recipe.ingredientPreparation.map(note => <li key={note}>{note}</li>)}</ul>
        </div> : null}
        {hydrated && recipe.instructionStepsHtml?.length ? <><div className="step-controls"><p aria-live="polite">{tools.progress}: {completed.length}/{recipe.instructionStepsHtml.length}</p><button type="button" onClick={() => setCompleted([])}>{tools.reset}</button></div><div className="rich-text"><ol className="recipe-steps">{recipe.instructionStepsHtml.map((step, index) => <li key={index} data-complete={completed.includes(index)}><div><label className="recipe-step-toggle"><input type="checkbox" aria-label={`${tools.completed}: ${index + 1}`} checked={completed.includes(index)} onChange={(event) => { const checked = event.currentTarget.checked;
          if (checked && completed.length === 0) track("Start Cooking");
          if (checked && completed.length + 1 === recipe.instructionStepsHtml?.length) track("Complete Recipe");
          setCompleted(values => checked ? [...values, index] : values.filter(value => value !== index)); }} /></label><div className="recipe-step-text" dangerouslySetInnerHTML={{ __html: step }} /></div></li>)}</ol></div></> : <div className="rich-text" dangerouslySetInnerHTML={{ __html: recipe.instructionsHtml }} />}
      </section>
      <section className="recipe-panel" data-nutrition-scope="ORIGINAL_RECIPE"><h2>{hasGkVariant?gkScopeUi[locale].originalNutrition:labels.nutrition}</h2>{hasGkVariant?<p className="recipe-disclosure" data-macro-separation="gk-only"><strong>{gkScopeUi[locale].macroNotice}</strong></p>:null}
        <RecipePortionSummary recipe={recipe} evidence={portionEvidence} carbs={portionCarbs}
          multiplier={eatenPortion} batchServings={servings} onChange={hydrated && (portionCarbs || glycemicLoad || portionEvidence?.verbal || portionEvidence?.ingredientPortion) ? setEatenPortion : undefined} />
        {withholdNutrition ? <div className="recipe-glycemic-load" data-gk-scope="ORIGINAL_RECIPE" data-gk-status={undefinedGkLabel ? "NOT_DEFINED" : "WITHHELD_SOURCE_REVIEW"}><p className="recipe-disclosure">{undefinedGkLabel ? <><strong>{undefinedGkLabel}</strong>. Tähän valmistusversioon ei ole riittävästi luotettavaa GI-lähdetietoa GK:n laskentaan.</> : "GK-arviota ei näytetä ennen tämän reseptin raaka-aine- ja ravintoarvoperustan uudelleentarkistusta."}</p></div> : glycemicLoad ? <div className="recipe-glycemic-load" data-gk-scope="ORIGINAL_RECIPE" data-gk-status="CALCULATED">
          {scaled?.standardServingOnly ? <p aria-live="polite">{portionWords.roundedServingOnly}</p> : <dl className="nutrition-list"><div>
            <dt data-gk-ingredient-subset={ingredientGk}>{ingredientGk ? portionWords.ingredientGk : glycemicLoad.assessmentType ? modeledGlLabel : labels.glycemicLoad}</dt>
            <dd aria-live="polite" data-portion-gk>{glValue}{eatenPortion === 1 ? ` ${glUnit}` : ""}</dd>
          </div></dl>}
          {gkClass.text ? <p className="recipe-glycemic-load__class" data-original-gk-class={gkClass.category}>{gkClass.text}</p> : null}
          <OriginalGkCoverageNote coverage={glycemicLoad.originalGkCoverage} locale={locale} multiplier={eatenPortion} />
          {portionEvidence?.alternatives ? <GkAlternatives choices={portionEvidence.alternatives} locale={locale} multiplier={eatenPortion} /> : null}
          {gkClass.rounding ? <p className="recipe-disclosure">{gkClass.rounding}</p> : null}
          {gkMethodLink}
          <EstimateDetails result={glycemicLoad} locale={locale}
            notes={<>
              <EstimateSummary result={glycemicLoad} locale={locale} />
              {glycemicLoad.assessmentType && !ingredientGk && !glycemicLoad.closedRecoveryC && !glycemicLoad.boundedPolyolC ? <p>{modelledNote}</p> : null}
              {!glycemicLoad.assessmentType ? <p>{labels.glycemicLoadNote}</p> : null}
              {glycemicLoad.omittedAvailableCarbohydratePerServingG > 0 && !glycemicLoad.originalGkCoverage
                ? <p>{labels.glycemicLoadOmission(new Intl.NumberFormat(numberLocale, { maximumSignificantDigits: 1 }).format(glycemicLoad.omittedAvailableCarbohydratePerServingG))}</p>
                : null}
            </>}
            technicalNotes={glycemicLoad.closedRecoveryC ? <p>{recoveryDisclosure[locale]}</p> :
              glycemicLoad.boundedPolyolC ? <p>{scopedPolyolDisclosure[locale]}</p> : undefined}
          />
        </div> : portionEvidence?.verbal ? <div className="recipe-glycemic-load" data-gk-scope="ORIGINAL_RECIPE" data-gk-status="QUALITATIVE" aria-live="polite">
          <VerbalPortionEstimate evidence={portionEvidence} recipe={recipe} multiplier={eatenPortion} />
          {gkMethodLink}
        </div> : <div className="recipe-glycemic-load" data-gk-scope="ORIGINAL_RECIPE" data-gk-status="UNAVAILABLE">
          {glycemicRecipe?.pending ? <p>{portionWords.pending}</p> : null}
          <MissingEstimate locale={locale} result={gkResult ?? { incompleteReasons: [] }} />
        </div>}
        <details className="gk-evidence__details"><summary>{labels.nutrition}</summary>
          <p className="recipe-disclosure" data-f25-nutrition-status={withholdNutrition ? "SOURCE_REVIEW_WITHHELD" : undefined}>{withholdNutrition ? "Ravintoarvojen julkaisu on keskeytetty, koska annoksen ainesosakohtainen laskenta tai tuotematch ei ole vielä hyväksyttävä. Lähtöarvoja ei näytetä virheellisen tarkkoina. Katso reseptin lähdehuomautus." : nutritionItems.length ? tools.nutrition : tools.missing}</p>{nutritionItems.length ? <dl className="nutrition-list">{nutritionItems.map(([key, value]) => <div key={key}><dt>{labels.nutrients[key]}</dt><dd>{formatIngredientAmount(value, 1, 1, numberLocale)} g</dd></div>)}</dl> : null}
        </details>
        {recipe.dietClass ? <p className="recipe-disclosure">{tools.diet}</p> : null}</section>
      {gkVariants.map(variant => <GkOnlyVariantPanel key={variant.versionId}
        variant={variant} locale={recipe.locale} servings={servings} originalHasGk={Boolean(glycemicLoad || portionEvidence?.verbal)}
        originalRecipe={recipe} alternatives={portionEvidence?.versionAlternatives} />)}
      <ChocolateComparison recipeId={recipe.recipeId} locale={recipe.locale} hasGlVariant={hasGkVariant} />
      {notesHtml ? <section className="recipe-panel"><h2>{labels.notes}</h2><div className="rich-text" dangerouslySetInnerHTML={{ __html: notesHtml }} /></section> : null}
      {relatedGuides.length > 0 && <section className="recipe-panel" aria-labelledby="related-guides-title">
        <h2 id="related-guides-title">Aiheesta Ruokaoppaassa</h2>
        <ul>{relatedGuides.map(article => <li key={article.slug}><Link to={articlePath(article)}>{article.title}</Link></li>)}</ul>
      </section>}
    </div>
  </div></article>;
}

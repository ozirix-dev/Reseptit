import { recipeCardAvifMedia, recipeCardSizes } from "./image-layout";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContent } from "@/lib/content";
import type { RecipeLocale } from "@/types/content";
import { glycemicLoadPath, recipeIndexPath, recipeUi } from "./recipe-i18n";
import { homepageLabels, libraryCopy } from "./home-preview";
import { recipeLibraryPagePath, recipeLibraryPageSize } from "./recipe-pagination";
import { loadRecipeSearch } from "@/lib/load-content";
import "./home-preview.css";
import { isRecipavoHeroEnabled, recipavoHeroCopy } from "./recipavo-hero";
import { toolUi } from "./recipe-tools";
import { cuisines, ingredientGroups } from "@/content/recipe-facets";
import { emptyRecipeFilters, filterRecipes, parseRecipeFilters, recipeFiltersToSearch, type RecipeCategory, type RecipeDietFilter, type RecipeFilters, type GlycemicLoadFilterCategory, type SearchRecipe } from "./recipe-search";
import { glycemicLoadFilterCategories } from "@/generated/glycemic-load-filters.generated";

import type { RecipeSummary } from "@/content/route-data";

import { track } from "@/features/privacy/analytics";

const categories: RecipeSummary["category"][] = ["aamupala", "valipala", "alkuruoka", "paaruoka", "jalkiruoka", "leivonnainen"];

export function RecipesPage({ locale }: { locale: RecipeLocale }) {
  const { recipes, catalog } = useContent();
  const labels = recipeUi[locale];
  const homePreviewEnabled = isRecipavoHeroEnabled();
  const heroCopy = homePreviewEnabled ? recipavoHeroCopy[locale] : null;
  const tools = toolUi[locale];
  const dietLabels: Record<Exclude<RecipeDietFilter, "all">, string> = {
    keto: labels.keto, vhh: labels.vhh, carnivore: labels.carnivore,
    vegetarian: labels.vegetarian, vegan: labels.vegan, pescatarian: labels.pescatarian,
  };
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<RecipeFilters>(emptyRecipeFilters);
  const [hydrated, setHydrated] = useState(false);
  const availableCategories = categories.filter(category => catalog?.categories.includes(category));
  const availableDiets = catalog?.diets ?? [];
  const searchFile = recipeFiltersToSearch(filters) && catalog?.searchFile;
  const [search, setSearch] = useState<{ file: string; entries: SearchRecipe[] | null }>();
  const [searchAttempt, setSearchAttempt] = useState(0);
  useEffect(() => {
    if (!searchFile) return;
    let current = true;
    loadRecipeSearch(searchFile).then(
      entries => { if (current) setSearch({ file: searchFile, entries }); },
      () => { if (current) setSearch({ file: searchFile, entries: null }); },
    );
    return () => { current = false; };
  }, [searchFile, searchAttempt]);

  // Start from the prerendered default state, then read query parameters after hydration.
  useEffect(() => {
    setFilters(parseRecipeFilters(location.search, ["all", ...availableCategories], availableDiets));
    setHydrated(true);
  }, [location.search, catalog]);

  function updateFilters(patch: Partial<RecipeFilters>) {
    if (!("query" in patch)) track("Filter Recipes");
    const next = { ...filters, ...patch };
    setFilters(next);
    const search = recipeFiltersToSearch(next);
    navigate(`${location.pathname}${search}`, { replace: true, preventScrollReset: true });
  }

  function removeFilter(patch: Partial<RecipeFilters>, button: HTMLButtonElement) {
    const neighbor = button.nextElementSibling ?? button.previousElementSibling;
    updateFilters(patch);
    requestAnimationFrame(() => {
      const target = neighbor instanceof HTMLElement && neighbor.isConnected ? neighbor : document.getElementById("recipe-search");
      target?.focus();
    });
  }

  function resetFilters() {
    track("Reset Filters");
    setFilters(emptyRecipeFilters);
    navigate(location.pathname, { replace: true, preventScrollReset: true });
  }

  const loadedSearch = search?.file === searchFile ? search : undefined;
  const entries = loadedSearch?.entries;
  const filteredRecipes = useMemo(() => entries && filterRecipes(entries, filters, locale, glycemicLoadFilterCategories),
    [entries, filters, locale]);
  const requestedPage = new URLSearchParams(location.search).get("page") ?? "";
  const lastPage = Math.max(1, Math.ceil((filteredRecipes?.length ?? 0) / recipeLibraryPageSize));
  const currentPage = /^[1-9][0-9]*$/.test(requestedPage) ? Math.min(lastPage, Number(requestedPage)) : 1;
  const start = (currentPage - 1) * recipeLibraryPageSize;
  const hasSearchResults = filteredRecipes ? filteredRecipes.length > 0 : undefined;
  useEffect(() => {
    if (!filters.query.trim() || hasSearchResults === undefined) return;
    const timer = window.setTimeout(() => {
      track("Recipe Search");
      if (!hasSearchResults) track("Search Without Results");
    }, 600);
    return () => window.clearTimeout(timer);
  }, [filters.query, hasSearchResults]);

  const activeFilters: Array<{ key: string; label: string; clear: Partial<RecipeFilters> }> = [];
  if (filters.query) activeFilters.push({ key: "query", label: `“${filters.query}”`, clear: { query: "" } });
  if (filters.category !== "all") activeFilters.push({ key: "category", label: labels.category[filters.category], clear: { category: "all" } });
  if (filters.diet !== "all") activeFilters.push({ key: "diet", label: dietLabels[filters.diet], clear: { diet: "all" } });
  if (filters.maxTime) activeFilters.push({ key: "time", label: `${tools.time}: ${filters.maxTime} ${labels.minutes}`, clear: { maxTime: undefined } });
  if (filters.cuisine) activeFilters.push({ key: "cuisine", label: tools.cuisines[filters.cuisine as keyof typeof tools.cuisines], clear: { cuisine: undefined } });
  if (filters.ingredient) activeFilters.push({ key: "ingredient", label: tools.ingredients[filters.ingredient as keyof typeof tools.ingredients], clear: { ingredient: undefined } });
  if (filters.glutenFree) activeFilters.push({ key: "gluten_free", label: labels.glutenFree, clear: { glutenFree: undefined } });
  if (filters.gl) {
    const glLabels: Record<GlycemicLoadFilterCategory, string> = { low: tools.lowGl, medium: tools.mediumGl, high: tools.highGl };
    activeFilters.push({ key: "gl", label: glLabels[filters.gl], clear: { gl: undefined } });
  }
  const hasActiveFilters = activeFilters.length > 0;
  const homePreview = homePreviewEnabled && !hasActiveFilters;
  const homeText = homepageLabels[locale];
  const paginationText = libraryCopy[locale];
  const searchPageLink = (page: number) => recipeIndexPath(locale) + recipeFiltersToSearch(filters) + (page === 1 ? "" : "&page=" + page);

  let results;
  if (hasActiveFilters) {
    if (!loadedSearch) {
      results = <p role="status">{paginationText.loading}</p>;
    } else if (!filteredRecipes) {
      results = <div className="recipe-empty-state"><p role="alert">{paginationText.failed}</p>
        <button type="button" className="recipe-filter-reset" onClick={() => {
          setSearch(undefined);
          setSearchAttempt(attempt => attempt + 1);
        }}>{paginationText.retry}</button>
      </div>;
    } else if (filteredRecipes.length === 0) {
      results = <div className="recipe-empty-state"><p>{labels.noResults}</p>
        <button type="button" className="recipe-filter-reset" onClick={resetFilters}>{labels.resetFilters}</button>
      </div>;
    } else {
      results = <>
        <RecipeGrid recipes={filteredRecipes.slice(start, start + recipeLibraryPageSize)} locale={locale} />
        <RecipePagination locale={locale} page={currentPage} totalPages={lastPage}
          previous={currentPage > 1 ? searchPageLink(currentPage - 1) : null}
          next={currentPage < lastPage ? searchPageLink(currentPage + 1) : null} />
      </>;
    }
  } else {
    results = <>
      {homePreview ? <section className="home-preview__picks" aria-labelledby="home-preview-picks-heading">
        <h2 id="home-preview-picks-heading">{homeText.picks}</h2>
        <RecipeGrid recipes={recipes} locale={locale} headingLevel={3} homePicks />
      </section> : <RecipeGrid recipes={recipes} locale={locale} />}
      {catalog ? <p className="recipe-library-link"><Link to={recipeLibraryPagePath(locale)} onClick={() => track("Browse More Recipes")}>{homeText.allRecipes(catalog.total)}</Link></p> : null}
    </>;
  }

  return <section className={homePreviewEnabled ? "page-section recipe-index recipe-index--home-preview" : "page-section recipe-index"}><div className="container recipe-index__container">
    <div className={heroCopy ? "page-intro recipavo-hero" : "page-intro"}><p className="eyebrow">{heroCopy?.eyebrow ?? labels.eyebrow}</p><h1>{heroCopy?.title ?? labels.indexTitle}</h1><p className="page-intro__description">{heroCopy?.intro ?? labels.intro}</p></div>
    {hydrated ? <form className="recipe-filters" role="search" aria-label={labels.search} onSubmit={(event) => event.preventDefault()}>
      <div className="recipe-search-field">
        <label htmlFor="recipe-search">{labels.search}</label>
        <div className="recipe-search-field__control">
          <input id="recipe-search" type="search" value={filters.query} placeholder={labels.searchPlaceholder} onChange={(event) => updateFilters({ query: event.currentTarget.value })} />
          {filters.query ? <button type="button" className="recipe-search-field__clear" onClick={() => updateFilters({ query: "" })}>{labels.clearSearch}</button> : null}
        </div>
      </div>
      <div className="recipe-filter-select">
        <label htmlFor="recipe-category">{labels.categoryFilter}</label>
        <select id="recipe-category" value={filters.category} onChange={(event) => updateFilters({ category: event.currentTarget.value as RecipeCategory })}>
          <option value="all">{labels.allCategories}</option>
          {availableCategories.map((category) => <option key={category} value={category}>{labels.category[category]}</option>)}
        </select>
      </div>
      {availableDiets.length ? <div className="recipe-filter-select">
        <label htmlFor="recipe-diet">{labels.dietFilter}</label>
        <select id="recipe-diet" value={filters.diet} onChange={(event) => updateFilters({ diet: event.currentTarget.value as RecipeDietFilter })}>
          <option value="all">{labels.allDiets}</option>
          {availableDiets.map((diet) => <option key={diet} value={diet}>{dietLabels[diet]}</option>)}
        </select>
      </div> : null}
      <div className="recipe-special-filters"><label htmlFor="recipe-gluten-free"><input id="recipe-gluten-free" type="checkbox" checked={!!filters.glutenFree} onChange={(event) => updateFilters({ glutenFree: event.currentTarget.checked || undefined })} /> {labels.glutenFree}</label></div>
      <details className="recipe-more-filters"><summary>{tools.moreFilters}</summary><div>
      <div className="recipe-filter-select"><label htmlFor="recipe-time">{tools.time}</label><select id="recipe-time" value={filters.maxTime ?? ""} onChange={(event) => updateFilters({ maxTime: Number(event.currentTarget.value) || undefined })}><option value="">{tools.anyTime}</option>{[30, 60, 90].map(time => <option key={time} value={time}>{time} {labels.minutes}</option>)}</select></div>
      <div className="recipe-filter-select"><label htmlFor="recipe-cuisine">{tools.cuisine}</label><select id="recipe-cuisine" value={filters.cuisine ?? ""} onChange={(event) => updateFilters({ cuisine: event.currentTarget.value || undefined })}><option value="">{tools.anyCuisine}</option>{cuisines.filter(cuisine => catalog?.cuisines.includes(cuisine)).map(cuisine => <option key={cuisine} value={cuisine}>{tools.cuisines[cuisine]}</option>)}</select></div>
      <div className="recipe-filter-select"><label htmlFor="recipe-ingredient">{tools.ingredient}</label><select id="recipe-ingredient" value={filters.ingredient ?? ""} onChange={(event) => updateFilters({ ingredient: event.currentTarget.value || undefined })}><option value="">{tools.anyIngredient}</option>{ingredientGroups.filter(group => catalog?.ingredientGroups.includes(group)).map(group => <option key={group} value={group}>{tools.ingredients[group]}</option>)}</select></div>
      {catalog?.hasGlycemicLoad ? <div className="recipe-filter-select"><label htmlFor="recipe-gl">{tools.gl}</label><select id="recipe-gl" value={filters.gl ?? ""} onChange={(event) => updateFilters({ gl: (event.currentTarget.value || undefined) as GlycemicLoadFilterCategory | undefined })}><option value="">{tools.anyGl}</option><option value="low">{tools.lowGl}</option><option value="medium">{tools.mediumGl}</option><option value="high">{tools.highGl}</option></select></div> : null}
      </div></details>
      {hasActiveFilters && hasSearchResults ? <button type="button" className="recipe-filter-reset" onClick={resetFilters}>{labels.resetFilters}</button> : null}
    </form> : <div className="recipe-filters recipe-filters--placeholder" aria-hidden="true">{[labels.search, labels.categoryFilter, ...(availableDiets.length ? [labels.dietFilter] : []), labels.glutenFree].map((label) => <div className="recipe-filter-select" key={label}><span className="placeholder-label">{label}</span><span className="placeholder-input" /></div>)}<details className="recipe-more-filters"><summary>{tools.moreFilters}</summary></details></div>}
    {hydrated && (filters.diet === "keto" || filters.diet === "vhh") ? <p className="recipe-disclosure">{tools.diet}</p> : null}
    {hydrated && filters.diet !== "all" && filters.diet !== "keto" && filters.diet !== "vhh" ? <p className="recipe-disclosure">{labels.dietaryReviewNote}</p> : null}
    {hydrated && filters.glutenFree ? <p className="recipe-disclosure">{labels.glutenFreeNote}</p> : null}
    {hydrated && filters.gl ? <p className="recipe-disclosure recipe-gl-disclosure">{tools.glNote} <Link to={glycemicLoadPath(locale)}>{labels.glycemicLoadMethod}</Link></p> : null}
    {homePreview ? <section className="home-preview__topics" aria-labelledby="home-preview-topics-heading">
      <h2 id="home-preview-topics-heading">{homeText.topics}</h2>
      <ul className="home-preview__topic-list">{(catalog?.topics ?? []).map((topic) => {
        const search = recipeFiltersToSearch({ ...emptyRecipeFilters, ...(topic.kind === "category" ? { category: topic.value } : { diet: topic.value }) });
        const label = topic.kind === "category" ? labels.category[topic.value] : topic.value === "keto" ? labels.keto : labels.vhh;
        return <li key={`${topic.kind}-${topic.value}`}><Link to={`${recipeIndexPath(locale)}${search}`}>{label}</Link></li>;
      })}</ul>
    </section> : null}
    {!homePreview && (!hasActiveFilters || filteredRecipes) ? <p className={hydrated ? "recipe-result-count" : "recipe-result-count recipe-result-placeholder"} role={hydrated ? "status" : undefined} aria-hidden={!hydrated || undefined}>
      {labels.results(filteredRecipes?.length ?? catalog?.total ?? recipes.length)}
    </p> : null}
    {hydrated && hasActiveFilters ? <div className="recipe-active-filters" aria-label={tools.activeFilters}>{activeFilters.map((chip) => <button key={chip.key} type="button" className="recipe-filter-chip" aria-label={`${tools.removeFilter}: ${chip.label}`} onClick={(event) => removeFilter(chip.clear, event.currentTarget)}>{chip.label}<span className="recipe-filter-chip__remove" aria-hidden="true">×</span></button>)}</div> : null}
    {results}
  </div></section>;
}

export function RecipeLibraryPage() {
  const { recipes, pagination } = useContent();
  if (!pagination) return null;
  const { locale, page, totalPages, previousPath, nextPath } = pagination;
  const text = libraryCopy[locale];
  return <section className="page-section recipe-index"><div className="container recipe-index__container">
    <div className="page-intro"><h1>{text.title}</h1><p>{text.description}</p></div>
    <p><Link to={recipeIndexPath(locale)}>{recipeUi[locale].backToRecipes}</Link></p>
    <RecipeGrid recipes={recipes} locale={locale} />
    <RecipePagination locale={locale} page={page} totalPages={totalPages} previous={previousPath} next={nextPath} />
  </div></section>;
}

function RecipePagination({ locale, page, totalPages, previous, next }: {
  locale: RecipeLocale;
  page: number;
  totalPages: number;
  previous: string | null;
  next: string | null;
}) {
  if (totalPages < 2) return null;
  const text = libraryCopy[locale];
  return <nav className="recipe-pagination" aria-label={text.page}>
    {previous ? <Link to={previous} rel="prev">{text.previous}</Link> : null}
    <span>{text.page} {page} / {totalPages}</span>
    {next ? <Link to={next} rel="next">{text.next}</Link> : null}
  </nav>;
}

function RecipeGrid({ recipes, locale, headingLevel, homePicks }: {
  recipes: (RecipeSummary | SearchRecipe)[];
  locale: RecipeLocale;
  headingLevel?: 2 | 3;
  homePicks?: boolean;
}) {
  return <div className="recipe-card-grid">{recipes.map((recipe, index) =>
    <RecipeCard key={recipe.recipeId + '-' + locale} recipe={recipe} index={index} locale={locale} headingLevel={headingLevel} avifSrc={homePicks ? recipe.image?.homeAvifSrc : undefined} />
  )}</div>;
}

function RecipeCard({ recipe, index, locale, headingLevel = 2, avifSrc }: {
  recipe: RecipeSummary | SearchRecipe; index: number; locale: RecipeLocale; headingLevel?: 2 | 3; avifSrc?: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const [avifFailed, setAvifFailed] = useState(false);
  const labels = recipeUi[locale];
  const Heading = headingLevel === 3 ? "h3" : "h2";
  const dietLabel = recipe.dietClass === "keto" ? labels.keto : recipe.dietClass ? labels.vhh : null;
  const meta = [recipe.timeTotalMin ? `${recipe.timeTotalMin} ${labels.minutes}` : null, recipe.difficulty].filter(Boolean).join(" · ");
  const webpFallback = recipe.image && !imageFailed ? <img className="recipe-card__image"
    src={recipe.image.src} srcSet={recipe.image.srcSet ?? undefined} sizes={recipeCardSizes} alt={recipe.image.alt}
    width={recipe.image.width} height={recipe.image.height} loading={index === 0 && !avifSrc ? "eager" : "lazy"}
    fetchPriority={index === 0 ? "high" : undefined} decoding="async"
    onError={({ currentTarget }) => {
      if (avifSrc && currentTarget.currentSrc === avifSrc) setAvifFailed(true);
      else setImageFailed(true);
    }} /> : null;
  return <article className="recipe-card">
    <Link className="recipe-card__link" to={recipe.routePath}>
      {webpFallback
        ? avifSrc && !avifFailed ? <picture>
          <source type="image/avif" media={recipeCardAvifMedia} srcSet={avifSrc} />
          {webpFallback}
        </picture> : webpFallback
        : <span className="recipe-card__image recipe-card__image--placeholder">{labels.imageUnavailable}</span>}
      <span className="recipe-card__content">
        <span className="recipe-card__badges">{[recipe.category, ...(recipe.additionalCategories ?? [])].map(category => <span key={category} className="recipe-card__category">{labels.category[category]}</span>)}{dietLabel ? <span className="recipe-card__diet">{dietLabel}</span> : null}</span>
        {meta ? <span className="recipe-card__meta">{meta}</span> : null}
        <Heading className="recipe-card__title">{recipe.title}</Heading>
        <span className="recipe-card__description">{recipe.description}</span>
      </span>
    </Link>
  </article>;
}

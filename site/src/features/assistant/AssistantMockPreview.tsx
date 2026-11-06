import { useEffect, useId, useState } from "react";
import type { FormEvent } from "react";
import type { RecipeLocale } from "../../types/content";
import { localeIndexes } from "../../content/route-data";
import type { AssistantCatalog, AssistantCatalogRecipe } from "./catalog";
import { demoRecipeHref, demoSearchCatalog, loadDemoCatalog, type DemoPreset, type DemoSearch } from "./demo";
import "./assistant-preview.css";

import { assistantDemoCopy } from "./demo-i18n";

interface SearchTurn {
  id: number;
  question: string;
  count: number;
  results: AssistantCatalogRecipe[];
}
const presets: readonly DemoPreset[] = ["keto-30", "breakfast", "snack"];
const languageLabels: Record<RecipeLocale, string> = { fi: "Suomi", en: "English", sv: "Svenska", th: "ไทย" };

export function AssistantMockPreview() {
  const [locale, setLocale] = useState<RecipeLocale>("fi");
  const [catalog, setCatalog] = useState<AssistantCatalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [query, setQuery] = useState("");
  const [turns, setTurns] = useState<SearchTurn[]>([]);
  const id = useId();
  const copy = assistantDemoCopy[locale];
  const basePath = import.meta.env.BASE_URL;

  useEffect(() => {
    let live = true;
    setCatalog(null);
    setTurns([]);
    setQuery("");
    setLoading(true);
    setLoadError(false);
    void loadDemoCatalog(locale, basePath).then((next) => {
      if (live) setCatalog(next);
    }).catch(() => {
      if (live) setLoadError(true);
    }).finally(() => {
      if (live) setLoading(false);
    });
    return () => { live = false; };
  }, [locale, basePath]);

  function run(search: DemoSearch) {
    if (!catalog) return;
    const text = search.kind === "text" ? search.text.replace(/\s+/gu, " ").trim().slice(0, 120) : copy.presets[search.preset];
    if (!text) return;
    const results = demoSearchCatalog(catalog, search);
    // Published count is unknown after slicing; count shown refers only to the visible sample.
    setTurns((previous) => [...previous.slice(-5), { id: (previous.at(-1)?.id ?? 0) + 1, question: text, count: results.length, results }]);
    setQuery("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    run({ kind: "text", text: query });
  }

  const home = (basePath.replace(/\/$/, "") + localeIndexes[locale]).replace(/\/\//g, "/");

  return <main className="assistant-preview" lang={locale}>
    <p className="assistant-preview__eyebrow">Recipavo · A2 · local mock</p>
    <h1>{copy.title}</h1>
    <p>{copy.intro}</p>
    <p className="assistant-preview__notice" role="note">{copy.warning}</p>

    <label htmlFor={id + "-locale"}>{copy.language}</label>
    <select id={id + "-locale"} value={locale} onChange={(event) => setLocale(event.currentTarget.value as RecipeLocale)}>
      {(Object.keys(languageLabels) as RecipeLocale[]).map((key) =>
        <option key={key} value={key}>{languageLabels[key]}</option>)}
    </select>
    <div role="status" aria-live="polite" className="assistant-preview__status">
      {loading ? copy.loading : loadError ? copy.unavailable : ""}
    </div>
    {loadError ? <button type="button" onClick={() => window.location.reload()}>{copy.retry}</button> : null}
    {catalog ? <>
      <fieldset className="assistant-preview__presets">
        <legend>{copy.suggestions}</legend>
        <div className="assistant-preview__actions">
          {presets.map((preset) => <button type="button" key={preset}
            onClick={() => run({ kind: "preset", preset })}>{copy.presets[preset]}</button>)}
        </div>
      </fieldset>
      <form onSubmit={submit} className="assistant-preview__form" role="search">
        <label htmlFor={id + "-search"}>{copy.search}</label>
        <div className="assistant-preview__actions">
          <input id={id + "-search"} value={query} maxLength={120} placeholder={copy.placeholder}
            onChange={(event) => setQuery(event.currentTarget.value)} />
          <button type="submit" disabled={!query.trim()}>{copy.send}</button>
        </div>
      </form>
      <section aria-label={copy.log} className="assistant-preview__history" aria-live="polite" aria-relevant="additions">
        {turns.map((turn) => <article key={turn.id} className="assistant-preview__turn">
          <p className="assistant-preview__question">{turn.question}</p>
          <div className="assistant-preview__reply">
            <p>{turn.count ? copy.results(turn.count) : copy.noResults}</p>
            {turn.results.length > 0 ? <ul>{turn.results.map((recipe) =>
              <li key={recipe.recipeId}>
                <a href={demoRecipeHref(basePath, recipe)}>{recipe.title}</a>
                <small>{copy.published}{recipe.timeTotalMin === null ? "" : ` · ${recipe.timeTotalMin} ${copy.minutes}`}
                  {recipe.nutritionPerServing.carbsNetG === null
                    ? ` · ${copy.netCarbs}: ${copy.unknown}`
                    : ` · ${copy.netCarbs}: ${recipe.nutritionPerServing.carbsNetG.toLocaleString(locale === "th" ? "th-TH" : locale === "sv" ? "sv-SE" : locale === "fi" ? "fi-FI" : "en-GB")} g`}</small>
              </li>,
            )}</ul> : null}
          </div>
        </article>)}
      </section>
    </> : null}
    <p className="assistant-preview__footer">{copy.note}</p>
    <p><a href={home}>{copy.regularSearch}</a></p>
  </main>;
}

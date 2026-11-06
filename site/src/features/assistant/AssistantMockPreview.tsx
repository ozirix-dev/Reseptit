import { useEffect, useId, useState } from "react";
import type { FormEvent } from "react";
import type { RecipeLocale } from "../../types/content";
import { localeIndexes } from "../../content/route-data";
import type { AssistantCatalog, AssistantCatalogRecipe } from "./catalog";
import { demoRecipeHref, demoSearchCatalog, loadDemoCatalog, type DemoPreset, type DemoSearch } from "./demo";
import "./assistant-preview.css";

interface UiCopy {
  title: string; intro: string; warning: string; language: string; loading: string; unavailable: string;
  retry: string; search: string; placeholder: string; send: string; results: (count: number) => string;
  noResults: string; published: string; unknown: string; netCarbs: string; minutes: string;
  regularSearch: string; note: string; log: string; suggestions: string;
  presets: Record<DemoPreset, string>;
}
export const assistantDemoCopy: Record<RecipeLocale, UiCopy> = {
  fi: {
    title: "Recipavo Keittiöapuri", intro: "Etsi julkaistuja reseptejä. Tämä on erillinen testinäkymä, ei tekoälykeskustelu.",
    warning: "A2-esikatselu: vain nykyinen reseptihaku, ei AI-kutsuja eikä GK-laskentaa.",
    language: "Kieli", loading: "Ladataan julkaistuja reseptejä…", unavailable: "Resepti-indeksi ei ole käytettävissä.",
    retry: "Lataa uudelleen", search: "Kirjoita reseptin nimi tai ainesosa", placeholder: "esim. kana, tofu tai chia",
    send: "Etsi", results: (n) => `Löytyi ${n} reseptiä. Näytetään enintään viisi.`,
    noResults: "Hakuehdoilla ei löytynyt reseptejä. Kokeile toista hakusanaa tai valintaa.",
    published: "Julkaistu resepti", unknown: "Tieto puuttuu", netCarbs: "Nettohiilihydraatit / annos",
    minutes: "min", regularSearch: "Avaa tavallinen reseptihaku", note: "Vastaukset perustuvat julkaistuihin resepteihin. Puuttuva ravintoarvo ei tarkoita nollaa.",
    log: "Hakuhistoria tässä istunnossa", suggestions: "Kokeile valmista hakua",
    presets: { "keto-30": "Keto, enintään 30 min", breakfast: "Aamupalat", snack: "Välipalat" },
  },
  en: {
    title: "Recipavo Kitchen Helper", intro: "Find published recipes. This is an isolated demo, not an AI conversation.",
    warning: "A2 preview: existing recipe search only, no AI calls or glycemic-load calculations.",
    language: "Language", loading: "Loading published recipes…", unavailable: "Recipe catalog is unavailable.",
    retry: "Reload", search: "Enter a recipe name or ingredient", placeholder: "e.g. chicken, tofu or chia",
    send: "Search", results: (n) => `${n} recipes found. Showing up to five.`,
    noResults: "No matching recipes. Try another term or preset.",
    published: "Published recipe", unknown: "Not available", netCarbs: "Net carbs / serving",
    minutes: "min", regularSearch: "Open regular recipe search", note: "Results come from published recipes. Unknown nutrition does not mean zero.",
    log: "Search history in this session", suggestions: "Try a preset",
    presets: { "keto-30": "Keto, max 30 min", breakfast: "Breakfast", snack: "Snacks" },
  },
  sv: {
    title: "Recipavo Köksassistent", intro: "Hitta publicerade recept. Detta är en separat testvy, ingen AI-chatt.",
    warning: "A2-förhandsvisning: endast befintlig receptsökning, inga AI-anrop eller GK-beräkningar.",
    language: "Språk", loading: "Läser in publicerade recept…", unavailable: "Receptregistret är inte tillgängligt.",
    retry: "Ladda om", search: "Skriv receptnamn eller ingrediens", placeholder: "t.ex. kyckling, tofu eller chia",
    send: "Sök", results: (n) => `${n} recept hittades. Visar högst fem.`,
    noResults: "Inga matchande recept. Prova ett annat ord eller val.",
    published: "Publicerat recept", unknown: "Uppgift saknas", netCarbs: "Nettokolhydrater / portion",
    minutes: "min", regularSearch: "Öppna vanlig receptsökning", note: "Resultaten kommer från publicerade recept. Saknade näringsvärden är inte noll.",
    log: "Sökhistorik under denna session", suggestions: "Prova ett snabbval",
    presets: { "keto-30": "Keto, högst 30 min", breakfast: "Frukost", snack: "Mellanmål" },
  },
  th: {
    title: "ผู้ช่วยครัว Recipavo", intro: "ค้นหาสูตรอาหารที่เผยแพร่แล้ว นี่คือหน้าทดลองแยกต่างหาก ไม่ใช่แชต AI",
    warning: "ตัวอย่าง A2: ใช้ระบบค้นหาสูตรเดิมเท่านั้น ไม่มีการเรียก AI หรือคำนวณค่า GL",
    language: "ภาษา", loading: "กำลังโหลดสูตรอาหารที่เผยแพร่…", unavailable: "ไม่สามารถโหลดรายการสูตรอาหารได้",
    retry: "โหลดอีกครั้ง", search: "พิมพ์ชื่ออาหารหรือวัตถุดิบ", placeholder: "เช่น ไก่ เต้าหู้ หรือเมล็ดเจีย",
    send: "ค้นหา", results: (n) => `พบ ${n} สูตร แสดงสูงสุดห้าสูตร`,
    noResults: "ไม่พบสูตรที่ตรงกัน ลองใช้คำค้นหรือหมวดอื่น",
    published: "สูตรอาหารที่เผยแพร่แล้ว", unknown: "ไม่มีข้อมูล", netCarbs: "คาร์โบไฮเดรตสุทธิ / หนึ่งเสิร์ฟ",
    minutes: "นาที", regularSearch: "เปิดหน้าค้นหาสูตรอาหาร", note: "ผลลัพธ์มาจากสูตรที่เผยแพร่แล้ว ข้อมูลโภชนาการที่ไม่ทราบไม่ได้หมายถึงศูนย์",
    log: "ประวัติการค้นหาในหน้านี้", suggestions: "ลองตัวเลือกด่วน",
    presets: { "keto-30": "คีโต ไม่เกิน 30 นาที", breakfast: "อาหารเช้า", snack: "ของว่าง" },
  },
};

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

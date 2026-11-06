import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { glycemicLoadPath, recipeIndexPath } from "@/features/recipes/recipe-i18n";
import type { RecipeLocale } from "@/types/content";
import type { TranslationLink } from "@/content/route-data";

interface SiteNavigationProps {
  pathname: string;
  locale: RecipeLocale;
  availableLocales: RecipeLocale[];
  translations: TranslationLink[];
}

const copy: Record<RecipeLocale, { sections: string; menu: string; recipes: string; blog: string; method: string; languages: string }> = {
  fi: { sections: "Sivuston osiot", menu: "Valikko", recipes: "Reseptit", blog: "Ruokaopas", method: "GK-opas", languages: "Kielet" },
  en: { sections: "Site sections", menu: "Menu", recipes: "Recipes", blog: "Food guide (FI)", method: "GL guide", languages: "Languages" },
  sv: { sections: "Webbplatsens delar", menu: "Meny", recipes: "Recept", blog: "Matguide (FI)", method: "GK-guide", languages: "Språk" },
  th: { sections: "ส่วนต่าง ๆ ของเว็บไซต์", menu: "เมนู", recipes: "สูตรอาหาร", blog: "คู่มืออาหาร (FI)", method: "คู่มือ GL", languages: "ภาษา" }
};
const localeNames: Record<RecipeLocale, string> = { fi: "Suomi", en: "English", sv: "Svenska", th: "ไทย" };
const localeShort: Record<RecipeLocale, string> = { fi: "FI", en: "EN", sv: "SV", th: "TH" };
const localeOrder: RecipeLocale[] = ["fi", "en", "sv", "th"];
const isBlog = (pathname: string) => pathname === "/ruokaopas" || pathname.startsWith("/ruokaopas/");
const isMethod = (pathname: string) => localeOrder.some(code => glycemicLoadPath(code).replace(/\/$/, "") === pathname.replace(/\/$/, ""));

/** Switch to the corresponding translation when available; never invent untranslated article URLs. */
export function languageDestination(target: RecipeLocale, pathname: string, translations: TranslationLink[]): string {
  if (isMethod(pathname)) return glycemicLoadPath(target);
  if (isBlog(pathname)) return target === "fi" ? pathname : recipeIndexPath(target);
  return translations.find(t => t.locale === target)?.routePath ?? recipeIndexPath(target);
}

export function SiteNavigation({ pathname, locale, availableLocales, translations }: SiteNavigationProps) {
  const primary = useRef<HTMLDetailsElement>(null);
  const languages = useRef<HTMLDetailsElement>(null);

  // React Router keeps the site shell mounted; close native mobile menus after route changes.
  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)");
    const sync = () => {
      if (primary.current) primary.current.open = !media.matches;
      if (languages.current) languages.current.open = !media.matches;
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(max-width: 700px)").matches) {
      if (primary.current) primary.current.open = false;
      if (languages.current) languages.current.open = false;
    }
  }, [pathname]);

  const closeMobileMenus = () => {
    if (window.matchMedia("(max-width: 700px)").matches) {
      if (primary.current) primary.current.open = false;
      if (languages.current) languages.current.open = false;
    }
  };

  const labels = copy[locale];
  const blog = isBlog(pathname);
  const method = isMethod(pathname);
  return <div className="site-header__navigation">
    <details className="site-primary-menu" ref={primary} open>
      <summary aria-label={labels.menu}>{labels.menu}<span aria-hidden="true"> ▾</span></summary>
      <nav className="site-primary-nav" aria-label={labels.sections}>
        <Link to={recipeIndexPath(locale)} onClick={closeMobileMenus} aria-current={!blog && !method ? "page" : undefined}>{labels.recipes}</Link>
        <Link to="/ruokaopas/" lang="fi" onClick={closeMobileMenus} aria-current={blog ? "page" : undefined}>{labels.blog}</Link>
        <Link to={glycemicLoadPath(locale)} onClick={closeMobileMenus} aria-current={method ? "page" : undefined}>{labels.method}</Link>
      </nav>
    </details>
    {availableLocales.length > 1 && <details className="site-language-menu" ref={languages} open>
      <summary aria-label={labels.languages + ": " + localeNames[locale]}>{localeShort[locale]}<span aria-hidden="true"> ▾</span></summary>
      <nav className="site-language-nav" aria-label={labels.languages}>
        {localeOrder.filter(code => availableLocales.includes(code)).map(code =>
          <Link key={code} lang={code} hrefLang={code} to={languageDestination(code, pathname, translations)} onClick={closeMobileMenus} aria-current={locale === code ? "page" : undefined}>{localeNames[code]}</Link>
        )}
      </nav>
    </details>}
  </div>;
}

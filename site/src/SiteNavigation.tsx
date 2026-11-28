import { useEffect, useRef, type MouseEvent } from "react";
import { Link, useLocation, useNavigation } from "react-router-dom";
import { glycemicLoadPath, recipeIndexPath } from "@/features/recipes/recipe-i18n";
import { parseRecipeLibraryPagePath, recipeLibraryPagePath } from "@/features/recipes/recipe-pagination";
import type { RecipeLocale } from "@/types/content";
import type { TranslationLink } from "@/content/route-data";
import { privacyLocaleFromPath, privacyPaths } from "@/features/privacy/privacy-copy";
import { track } from "@/features/privacy/analytics";

interface SiteNavigationProps {
  pathname: string;
  locale: RecipeLocale;
  availableLocales: RecipeLocale[];
  translations: TranslationLink[];
}

const copy: Record<RecipeLocale, { sections: string; menu: string; recipes: string; blog: string; method: string; languages: string }> = {
  fi: { sections: "Sivuston osiot", menu: "Valikko", recipes: "Reseptit", blog: "Ruokaopas", method: "GK-opas", languages: "Kielet" },
  en: { sections: "Site sections", menu: "Menu", recipes: "Recipes", blog: "Food guide (FI)", method: "GL guide", languages: "Languages" },
  sv: { sections: "Webbplatsens delar", menu: "Meny", recipes: "Recept", blog: "Matguide (FI)", method: "GL-guide", languages: "Språk" },
  th: { sections: "ส่วนต่าง ๆ ของเว็บไซต์", menu: "เมนู", recipes: "สูตรอาหาร", blog: "คู่มืออาหาร (FI)", method: "คู่มือ GL", languages: "ภาษา" }
};
const localeNames: Record<RecipeLocale, string> = { fi: "Suomi", en: "English", sv: "Svenska", th: "ไทย" };
const localeShort: Record<RecipeLocale, string> = { fi: "FI", en: "EN", sv: "SV", th: "TH" };
const localeOrder: RecipeLocale[] = ["fi", "en", "sv", "th"];
const isBlog = (pathname: string) => pathname === "/ruokaopas" || pathname.startsWith("/ruokaopas/");
const isMethod = (pathname: string) => localeOrder.some(code => glycemicLoadPath(code).replace(/\/$/, "") === pathname.replace(/\/$/, ""));

/** Switch to the corresponding translation when available; never invent untranslated article URLs. */
export function languageDestination(target: RecipeLocale, pathname: string, translations: TranslationLink[]): string {
  if (privacyLocaleFromPath(pathname)) return privacyPaths[target];
  if (isMethod(pathname)) return glycemicLoadPath(target);
  if (isBlog(pathname)) return target === "fi" ? pathname : recipeIndexPath(target);
  if (parseRecipeLibraryPagePath(pathname.replace(/\/?$/, "/"))) return recipeLibraryPagePath(target);
  return translations.find(t => t.locale === target)?.routePath ?? recipeIndexPath(target);
}

export function SiteNavigation({ pathname, locale, availableLocales, translations }: SiteNavigationProps) {
  const primary = useRef<HTMLDetailsElement>(null);
  const languages = useRef<HTMLDetailsElement>(null);
  const pendingFocus = useRef<{ from: string; path: string; summary: HTMLElement } | null>(null);
  const location = useLocation();
  const navigation = useNavigation();

  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)");
    let lastMenuFocus: HTMLElement | null = null;
    const menus = () => [primary.current, languages.current];
    const containingMenu = (element: EventTarget | null) =>
      element instanceof HTMLElement ? menus().find(menu => menu?.contains(element)) : undefined;

    function rememberFocus(event: FocusEvent) {
      const element = event.target instanceof HTMLElement ? event.target : null;
      lastMenuFocus = containingMenu(element) ? element : null;
      if (pendingFocus.current?.summary !== element) pendingFocus.current = null;
    }

    function forgetOnOutsidePointer(event: PointerEvent) {
      if (!containingMenu(event.target)) {
        lastMenuFocus = null;
        pendingFocus.current = null;
      }
    }

    function sync(restoreFocus = false) {
      const active = document.activeElement;
      // CSS may already have hidden the summary when the media change fires.
      const focused = restoreFocus && active === document.body && lastMenuFocus?.isConnected &&
        !lastMenuFocus.getClientRects().length ? lastMenuFocus : active;
      const menu = restoreFocus ? containingMenu(focused) : null;
      const summary = menu?.querySelector<HTMLElement>("summary");
      if (media.matches && summary && focused !== summary) summary.focus({ preventScroll: true });
      for (const panel of menus()) if (panel) panel.open = !media.matches;
      if (!media.matches && menu && focused === summary) {
        const link = menu === languages.current
          ? menu.querySelector<HTMLElement>('a[aria-current="page"]') ?? menu.querySelector<HTMLElement>("a")
          : menu.querySelector<HTMLElement>("a");
        link?.focus({ preventScroll: true });
      }
    }

    const resize = () => sync(true);
    sync();
    media.addEventListener("change", resize);
    document.addEventListener("focusin", rememberFocus);
    document.addEventListener("pointerdown", forgetOnOutsidePointer);
    return () => {
      media.removeEventListener("change", resize);
      document.removeEventListener("focusin", rememberFocus);
      document.removeEventListener("pointerdown", forgetOnOutsidePointer);
    };
  }, []);

  // Only a committed menu navigation that still owns focus can move it to main.
  useEffect(() => {
    const pending = pendingFocus.current;
    if (pending && navigation.state === "idle") {
      pendingFocus.current = null;
      if (pending.from !== location.key && pending.path === pathname &&
          document.activeElement === pending.summary) {
        document.getElementById("main")?.focus({ preventScroll: true });
      }
    }
  }, [location.key, navigation.state, pathname]);

  useEffect(() => {
    if (window.matchMedia("(max-width: 700px)").matches) {
      if (primary.current) primary.current.open = false;
      if (languages.current) languages.current.open = false;
    }
  }, [pathname]);

  function closeMobileMenus(event: MouseEvent<HTMLAnchorElement>, path: string) {
    if (!window.matchMedia("(max-width: 700px)").matches || event.defaultPrevented ||
        event.button !== 0 || event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) return;

    pendingFocus.current = null;
    const menu = [primary.current, languages.current].find(panel => panel?.contains(document.activeElement));
    const summary = menu?.querySelector<HTMLElement>("summary");
    if (summary) {
      summary.focus({ preventScroll: true });
      if (path !== pathname) pendingFocus.current = { from: location.key, path, summary };
    }
    if (primary.current) primary.current.open = false;
    if (languages.current) languages.current.open = false;
  }

  const closeOtherMobileMenu = (current: HTMLDetailsElement | null, other: HTMLDetailsElement | null) => {
    if (window.matchMedia("(max-width: 700px)").matches && current && !current.open && other) {
      other.open = false;
    }
  };

  const labels = copy[locale];
  const blog = isBlog(pathname);
  const method = isMethod(pathname);
  const privacy = privacyLocaleFromPath(pathname) !== undefined;
  return <div className="site-header__navigation">
    <details className="site-primary-menu" ref={primary} open>
      <summary aria-label={labels.menu} onClick={() => closeOtherMobileMenu(primary.current, languages.current)}>{labels.menu}<span aria-hidden="true"> ▾</span></summary>
      <nav className="site-primary-nav" aria-label={labels.sections}>
        <Link to={recipeIndexPath(locale)} onClick={event => closeMobileMenus(event, recipeIndexPath(locale))} aria-current={!blog && !method && !privacy ? "page" : undefined}>{labels.recipes}</Link>
        <Link to="/ruokaopas/" hrefLang="fi" onClick={event => closeMobileMenus(event, "/ruokaopas/")} aria-current={blog ? "page" : undefined}>{labels.blog}</Link>
        <Link to={glycemicLoadPath(locale)} onClick={event => closeMobileMenus(event, glycemicLoadPath(locale))} aria-current={method ? "page" : undefined}>{labels.method}</Link>
      </nav>
    </details>
    {availableLocales.length > 1 && <details className="site-language-menu" ref={languages} open>
      <summary aria-label={labels.languages + ": " + localeNames[locale]} onClick={() => closeOtherMobileMenu(languages.current, primary.current)}>{localeShort[locale]}<span aria-hidden="true"> ▾</span></summary>
      <nav className="site-language-nav" aria-label={labels.languages}>
        {localeOrder.filter(code => availableLocales.includes(code)).map(code =>
          <Link key={code} lang={code} hrefLang={code} to={languageDestination(code, pathname, translations)} onClick={event => {
            if (code !== locale) track("Switch Language");
            closeMobileMenus(event, languageDestination(code, pathname, translations));
          }} aria-current={locale === code ? "page" : undefined}>{localeNames[code]}</Link>
        )}
      </nav>
    </details>}
  </div>;
}

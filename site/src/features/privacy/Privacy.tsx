import { useEffect, useRef, useSyncExternalStore } from "react";
import { Link, useLocation } from "react-router-dom";
import type { RecipeLocale } from "../../types/content";
import { privacyCopy, privacyEmail, privacyLocaleFromPath, privacyPaths } from "./privacy-copy";
import { analyticsAvailable, getAnalyticsChoice, setAnalyticsChoice, subscribeToAnalyticsChoice, trackPageview } from "./analytics";

const getServerChoice = () => null;
const subscribeToHydration = () => () => {};
const getServerAvailability = () => false;

function useAnalyticsChoice() {
  return useSyncExternalStore(subscribeToAnalyticsChoice, getAnalyticsChoice, getServerChoice);
}

function AnalyticsChoice({ locale, prompt = false }: { locale: RecipeLocale; prompt?: boolean }) {
  const available = useSyncExternalStore(subscribeToHydration, analyticsAvailable, getServerAvailability);
  const choice = useAnalyticsChoice();
  const labels = privacyCopy[locale];
  if (!available || (prompt && choice !== null)) return null;

  return <div className="privacy-choice">
    <p aria-live={prompt ? undefined : "polite"}>{choice === "granted" ? labels.enabled : choice === "denied" ? labels.disabled : labels.consent}
      {prompt && <> <Link to={privacyPaths[locale]}>{labels.title}</Link></>}</p>
    <div className="recipe-actions">
      <button type="button" aria-pressed={choice === "granted"} onClick={() => setAnalyticsChoice("granted")}>{labels.allow}</button>
      <button type="button" aria-pressed={choice === "denied"} onClick={() => setAnalyticsChoice("denied")}>{labels.deny}</button>
    </div>
  </div>;
}

export function AnalyticsPrompt({ locale }: { locale: RecipeLocale }) {
  const { pathname } = useLocation();
  const choice = useAnalyticsChoice();
  const previous = useRef<string | null>(null);
  const onPrivacyPage = privacyLocaleFromPath(pathname) !== undefined;

  useEffect(() => {
    previous.current = choice === "granted" && !onPrivacyPage ? trackPageview(previous.current) : null;
  }, [pathname, choice, onPrivacyPage]);

  if (onPrivacyPage) return null;
  return <div className="container"><AnalyticsChoice locale={locale} prompt /></div>;
}

export function PrivacyPage({ locale }: { locale: RecipeLocale }) {
  const labels = privacyCopy[locale];
  return <article className="page-section" lang={locale}><div className="container container--narrow">
    <h1>{labels.title}</h1>
    <p>{labels.description}</p>
    <h2>{labels.owner}</h2>
    <p>Ossi Rikkola · <a href={`mailto:${privacyEmail}`}>{privacyEmail}</a></p>
    <h2>{labels.contact}</h2>
    <p>{labels.emails} {labels.mailProvider} <a href="https://proton.me/mail/privacy-policy">Proton Mail</a></p>
    <h2>{labels.hosting}</h2>
    <p>{labels.technical} <a href="https://www.cloudflare.com/privacypolicy/">Cloudflare</a></p>
    <h2>{labels.analytics}</h2>
    <p>{labels.measurement} <a href="https://plausible.io/data-policy">Plausible</a></p>
    <AnalyticsChoice locale={locale} />
    <h2>{labels.rights}</h2>
    <p>{labels.exercise} <a href="https://tietosuoja.fi/">{labels.regulator}</a></p>
  </div></article>;
}

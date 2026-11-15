import { privacyLocaleFromPath } from "./privacy-copy";
import { siteTarget } from "../../content/site-target";

export const analyticsEvents = [
  "Recipe Search", "Search Without Results", "Filter Recipes", "Reset Filters",
  "View Instructions", "Print Recipe", "Adjust Servings", "Start Cooking",
  "Complete Recipe", "Switch Language", "Open Glycemic Evidence", "Browse More Recipes",
] as const;
type AnalyticsEvent = (typeof analyticsEvents)[number];
type Choice = "granted" | "denied";

const storageKey = "recipavo-analytics-choice";
const choiceLifetime = 180 * 24 * 60 * 60 * 1000;
const endpoint = "https://plausible.io/api/event";
const attributionHosts = new Set([
  "google.com", "google.fi", "google.se", "google.co.uk", "google.co.th",
  "bing.com", "duckduckgo.com", "facebook.com", "instagram.com", "reddit.com", "youtube.com", "t.co",
]);
let attributedLanding = false;
let temporaryChoice: Choice | null = null;

export function analyticsAvailable() {
  return siteTarget.production && typeof window !== "undefined" && window.location.origin === siteTarget.baseUrl;
}

export function getAnalyticsChoice(): Choice | null {
  if (!analyticsAvailable()) return null;
  if (temporaryChoice) return temporaryChoice;
  try {
    const [choice, expiry] = (window.localStorage.getItem(storageKey) ?? "").split(":");
    return (choice === "granted" || choice === "denied") && Number(expiry) > Date.now() ? choice : null;
  } catch {
    return null;
  }
}

export function setAnalyticsChoice(choice: Choice) {
  if (!analyticsAvailable()) return;
  try {
    window.localStorage.setItem(storageKey, `${choice}:${Date.now() + choiceLifetime}`);
    temporaryChoice = null;
  } catch {
    temporaryChoice = choice;
    try { window.localStorage.removeItem(storageKey); } catch { /* Storage is unavailable. */ }
  }
  window.dispatchEvent(new Event(storageKey));
}

export function subscribeToAnalyticsChoice(callback: () => void) {
  window.addEventListener(storageKey, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(storageKey, callback);
    window.removeEventListener("storage", callback);
  };
}

function landingReferrer() {
  if (attributedLanding) return undefined;
  attributedLanding = true;
  if (!document.referrer) return undefined;
  const source = new URL(document.referrer);
  const host = source.hostname.replace(/^(www|m|l)\./, "");
  return attributionHosts.has(host) ? `https://${host}/` : undefined;
}

function send(name: "pageview" | AnalyticsEvent, url: string) {
  const referrer = name === "pageview" ? landingReferrer() : undefined;
  void fetch(endpoint, {
    method: "POST",
    mode: "cors",
    credentials: "omit",
    referrerPolicy: "no-referrer",
    keepalive: true,
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ domain: "recipavo.com", name, url, referrer }),
  }).catch(() => {});
}

// The SEO code creates this URL from published routes. Query strings, fragments,
// full referrer URLs, free text and link destinations never enter the payload.
function currentPage() {
  if (getAnalyticsChoice() !== "granted") return null;
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) return null;
  const url = new URL(canonical.href);
  if (url.origin !== siteTarget.baseUrl || privacyLocaleFromPath(url.pathname)) return null;
  return url.origin + url.pathname;
}

export function track(event: AnalyticsEvent) {
  const page = currentPage();
  if (page) send(event, page);
}

export function trackPageview(previous: string | null) {
  const page = currentPage();
  if (page && page !== previous) send("pageview", page);
  return page;
}

import { createContext, lazy, Suspense, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { RecipeLocale } from "../../types/content";
import { feedbackUi, type FeedbackKind } from "./feedback-copy";
import { privacyEmail } from "../privacy/privacy-copy";

export interface FeedbackContextSource {
  kind?: FeedbackKind;
  pagePath?: string;
  recipeId?: string;
}
interface ActiveFeedbackSource extends FeedbackContextSource {
  pagePath: string;
}
interface FeedbackActions {
  openFeedback: (source?: FeedbackContextSource) => void;
  closeFeedback: () => void;
}
const FeedbackContext = createContext<FeedbackActions | null>(null);

// The full form and external verification script are loaded only after a visitor opens it.
const FeedbackDialog = lazy(async () => {
  const module = await import("./FeedbackDialog");
  return { default: module.FeedbackDialog };
});

export function FeedbackProvider({ children, locale, pagePath }: {
  children: ReactNode; locale: RecipeLocale; pagePath: string;
}) {
  const [request, setRequest] = useState<ActiveFeedbackSource | null>(null);
  const openFeedback = useCallback((source: FeedbackContextSource = {}) => {
    setRequest({ ...source, pagePath: source.pagePath ?? pagePath });
  }, [pagePath]);
  const closeFeedback = useCallback(() => setRequest(null), []);
  const actions = useMemo(() => ({ openFeedback, closeFeedback }), [openFeedback, closeFeedback]);
  return <FeedbackContext.Provider value={actions}>
    {children}
    {request ? <Suspense fallback={null}>
      <FeedbackDialog key={request.pagePath + ":" + (request.recipeId ?? "")}
        locale={locale} request={request} onClose={closeFeedback} />
    </Suspense> : null}
  </FeedbackContext.Provider>;
}

/** Standalone recipe renders (including SEO and GK tests) have no site provider. */
export function useFeedback(): FeedbackActions | null {
  return useContext(FeedbackContext);
}

export function FeedbackFooterButton({ locale }: { locale: RecipeLocale }) {
  const feedback = useFeedback();
  const [enhanced, setEnhanced] = useState(false);
  useEffect(() => setEnhanced(true), []);
  // Static HTML stays useful without JavaScript; a real button appears after hydration.
  if (!feedback || !enhanced) return <a className="feedback-footer-button" href={`mailto:${privacyEmail}`}>
    {feedbackUi[locale].button}
  </a>;
  return <button className="feedback-footer-button" type="button" onClick={() => feedback.openFeedback()}>
    {feedbackUi[locale].button}
  </button>;
}

export function RecipeFeedbackButton({ locale, recipeId, pagePath }: {
  locale: RecipeLocale; recipeId: string; pagePath: string;
}) {
  const feedback = useFeedback();
  const [enhanced, setEnhanced] = useState(false);
  useEffect(() => setEnhanced(true), []);
  if (!feedback || !enhanced) return <a href={`mailto:${privacyEmail}`}>
    {feedbackUi[locale].recipeButton}
  </a>;
  return <button type="button" onClick={() => feedback.openFeedback({
    kind: "recipe_error", recipeId, pagePath,
  })}>{feedbackUi[locale].recipeButton}</button>;
}

import { createContext, lazy, Suspense, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { RecipeLocale } from "../../types/content";
import { feedbackUi, type FeedbackKind } from "./feedback-copy";

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

export function useFeedback(): FeedbackActions {
  const context = useContext(FeedbackContext);
  if (!context) throw new Error("Feedback UI must be inside FeedbackProvider");
  return context;
}

export function FeedbackFooterButton({ locale }: { locale: RecipeLocale }) {
  const { openFeedback } = useFeedback();
  return <button className="feedback-footer-button" type="button" onClick={() => openFeedback()}>
    {feedbackUi[locale].button}
  </button>;
}

export function RecipeFeedbackButton({ locale, recipeId, pagePath }: {
  locale: RecipeLocale; recipeId: string; pagePath: string;
}) {
  const { openFeedback } = useFeedback();
  return <button type="button" onClick={() => openFeedback({
    kind: "recipe_error", recipeId, pagePath,
  })}>{feedbackUi[locale].recipeButton}</button>;
}

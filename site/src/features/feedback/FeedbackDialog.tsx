import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import type { RecipeLocale } from "../../types/content";
import { privacyEmail, privacyPaths } from "../privacy/privacy-copy";
import { feedbackKinds, feedbackUi, type FeedbackKind } from "./feedback-copy";
import type { FeedbackContextSource } from "./feedback-context";

type TurnstileApi = {
  render: (element: HTMLElement, options: {
    sitekey: string;
    callback: (token: string) => void;
    "expired-callback": () => void;
    "error-callback": () => void;
  }) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};

function turnstile(): TurnstileApi | undefined {
  return (window as Window & { turnstile?: TurnstileApi }).turnstile;
}

const siteKey = import.meta.env?.VITE_RECIPAVO_FEEDBACK_SITE_KEY ?? "";
const enabled = import.meta.env?.VITE_RECIPAVO_FEEDBACK_ENABLED === "true" && !!siteKey;

export function FeedbackDialog({ locale, request, onClose }: {
  locale: RecipeLocale;
  request: FeedbackContextSource & { pagePath: string };
  onClose: () => void;
}) {
  const labels = feedbackUi[locale];
  const dialogRef = useRef<HTMLDialogElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [kind, setKind] = useState<FeedbackKind>(request.kind ?? "other");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [token, setToken] = useState("");
  const [widgetError, setWidgetError] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [reference, setReference] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    return () => { if (dialog.open) dialog.close(); };
  }, []);

  useEffect(() => {
    if (!enabled || !widgetRef.current) return;
    let disposed = false;
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = () => {
      if (disposed || !widgetRef.current || !turnstile()) {
        if (!disposed) setWidgetError(true);
        return;
      }
      widgetId.current = turnstile()!.render(widgetRef.current, {
        sitekey: siteKey,
        callback: value => { if (!disposed) { setToken(value); setWidgetError(false); } },
        "expired-callback": () => { if (!disposed) setToken(""); },
        "error-callback": () => { if (!disposed) { setToken(""); setWidgetError(true); } },
      });
    };
    script.onerror = () => { if (!disposed) setWidgetError(true); };
    document.head.append(script);
    return () => {
      disposed = true;
      if (widgetId.current && turnstile()) turnstile()!.remove(widgetId.current);
      widgetId.current = null;
      script.remove();
    };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled || !token || status === "sending" || status === "sent") return;
    setStatus("sending");
    try {
      // Do not send query parameters, cookies, browsing history or analytics events.
      const response = await fetch("/api/feedback", {
        method: "POST",
        credentials: "omit",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind, message, email, locale,
          pagePath: request.pagePath,
          recipeId: request.recipeId ?? null,
          turnstileToken: token,
          website,
        }),
      });
      const data: unknown = await response.json();
      if (!response.ok || !data || typeof data !== "object" ||
        !("reference" in data) || typeof data.reference !== "string" ||
        !/^[0-9a-f-]{36}$/i.test(data.reference)) {
        throw new Error("Feedback submission was not acknowledged");
      }
      setReference(data.reference);
      setStatus("sent");
    } catch {
      setStatus("failed");
      setToken("");
      if (widgetId.current && turnstile()) turnstile()!.reset(widgetId.current);
    }
  }

  return <dialog ref={dialogRef} className="feedback-dialog" aria-labelledby="feedback-title"
    onClose={onClose} lang={locale}>
    <div className="feedback-dialog__header">
      <h2 id="feedback-title">{labels.title}</h2>
      <button type="button" onClick={() => dialogRef.current?.close()}
        aria-label={labels.close}>{labels.close}</button>
    </div>
    <p>{labels.intro}</p>
    {status === "sent" ? <div role="status" className="feedback-dialog__result">
      <p>{labels.sent}</p>
      <p>{labels.reference}: <code>{reference}</code></p>
    </div> : enabled ? <form className="feedback-form" onSubmit={submit}>
      <label htmlFor="feedback-kind">{labels.kind}</label>
      <select id="feedback-kind" value={kind} onChange={event => setKind(event.currentTarget.value as FeedbackKind)}>
        {feedbackKinds.map(value => <option key={value} value={value}>{labels.kinds[value]}</option>)}
      </select>
      <p className="feedback-form__context">{labels.context}: <code>{request.pagePath}</code></p>
      <label htmlFor="feedback-message">{labels.message}</label>
      <textarea id="feedback-message" value={message} minLength={20} maxLength={4000} rows={6}
        required onChange={event => setMessage(event.currentTarget.value)} />
      <label htmlFor="feedback-email">{labels.email}</label>
      <input id="feedback-email" type="email" value={email} maxLength={254} autoComplete="email"
        aria-describedby="feedback-email-help"
        onChange={event => setEmail(event.currentTarget.value)} />
      <p id="feedback-email-help" className="feedback-form__help">{labels.emailHelp}</p>
      <div className="feedback-form__honeypot" aria-hidden="true">
        <label htmlFor="feedback-website">Website</label>
        <input id="feedback-website" name="website" value={website} tabIndex={-1}
          onChange={event => setWebsite(event.currentTarget.value)} autoComplete="off" />
      </div>
      <p className="feedback-form__help">{labels.sensitive}</p>
      <p className="feedback-form__help">{labels.privacyNote} <Link to={privacyPaths[locale]} onClick={() => dialogRef.current?.close()}>{labels.privacy}</Link></p>
      <div role="group" aria-label={labels.turnstile} ref={widgetRef} />
      {widgetError ? <p role="alert">{labels.error}</p> : null}
      {status === "failed" ? <p role="alert">{labels.error}</p> : null}
      <button type="submit" disabled={!token || status === "sending" || widgetError}>
        {status === "sending" ? labels.sending : labels.send}
      </button>
    </form> : <div className="feedback-dialog__disabled">
      <p role="status">{labels.disabled}</p>
      <p>{labels.fallback} <a href={"mailto:" + privacyEmail}>{privacyEmail}</a></p>
      <p>{labels.sensitive}</p>
      <p><Link to={privacyPaths[locale]} onClick={() => dialogRef.current?.close()}>{labels.privacy}</Link></p>
    </div>}
  </dialog>;
}

import type { RecipeLocale } from "../../types/content";
import { privacyCopy, privacyEmail } from "./privacy-copy";
import { feedbackPrivacy } from "../feedback/feedback-copy";

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
    <p>{labels.measurement}</p>
    <h2>{feedbackPrivacy[locale].heading}</h2>
    <p>{feedbackPrivacy[locale].body}</p>
    <h2>{labels.rights}</h2>
    <p>{labels.exercise} <a href="https://tietosuoja.fi/">{labels.regulator}</a></p>
  </div></article>;
}

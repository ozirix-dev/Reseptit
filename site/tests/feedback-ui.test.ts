import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { FeedbackFooterButton, FeedbackProvider, RecipeFeedbackButton } from "../src/features/feedback/feedback-context";
import { feedbackKinds, feedbackPrivacy, feedbackUi } from "../src/features/feedback/feedback-copy";
import { privacyPaths } from "../src/features/privacy/privacy-copy";
import type { RecipeLocale } from "../src/types/content";

const locales: RecipeLocale[] = ["fi", "en", "sv", "th"];
const dist = path.resolve(import.meta.dirname, "../dist");

test("feedback categories, accessible copy and pre-activation privacy exist in every locale", () => {
  assert.deepEqual(feedbackKinds, ["recipe_error", "improvement", "new_recipe", "technical", "other"]);
  for (const locale of locales) {
    const labels = feedbackUi[locale];
    assert.ok(labels.title.length > 8);
    assert.ok(labels.intro.length > 30);
    assert.ok(labels.disabled.length > 10);
    assert.ok(labels.sensitive.length > 20);
    assert.ok(labels.quotaFull.length > 45, locale);
    assert.match(labels.quotaFull, /[^\s]/u);
    assert.ok(feedbackPrivacy[locale].body.length > 150);
    for (const kind of feedbackKinds) assert.ok(labels.kinds[kind]);
  }
});

test("footer and recipe feedback buttons are SSR-visible but do not render a live form", () => {
  for (const locale of locales) {
    const view = renderToStaticMarkup(createElement(FeedbackProvider, {
      locale, pagePath: "/",
      children: createElement("div", null,
        createElement(FeedbackFooterButton, { locale }),
        createElement(RecipeFeedbackButton, {
          locale, recipeId: "test-recipe", pagePath: "/test-recipe/",
        })),
    }));
    assert.ok(view.includes(feedbackUi[locale].button), locale);
    assert.ok(view.includes(feedbackUi[locale].recipeButton), locale);
    assert.ok(!view.includes("<button"), "Non-JS feedback entry points must be usable email links");
    assert.match(view, /href="mailto:ossi@rikkola\.fi"/u);
    assert.ok(!view.includes("<form"), "No closed dialog form is rendered in the original HTML");
    assert.ok(!view.includes("turnstile/v0"), "No captcha script on initial page load");
  }
});

test("all four static indexes show localized feedback contact and recipe links", async () => {
  for (const [locale, route] of [
    ["fi", ""], ["en", "en/recipes"], ["sv", "sv/recept"], ["th", "th/recipes"],
  ] as const) {
    const page = await readFile(path.join(dist, route, "index.html"), "utf8");
    assert.ok(page.includes(feedbackUi[locale].button), locale);
    assert.ok(page.includes("href=\"" + privacyPaths[locale] + "\""), locale);
  }
  const recipe = await readFile(path.join(dist, "kermainen-lohipata", "index.html"), "utf8");
  assert.ok(recipe.includes(feedbackUi.fi.recipeButton));
  assert.ok(!recipe.includes("https://challenges.cloudflare.com/turnstile/v0/api.js"));
});

test("standalone recipe rendering without FeedbackProvider has a functional email fallback", () => {
  for (const locale of locales) {
    const html = renderToStaticMarkup(createElement("section", null,
      createElement(RecipeFeedbackButton, {
        locale, recipeId: "standalone", pagePath: "/standalone/",
      }),
      createElement(FeedbackFooterButton, { locale }),
    ));
    assert.match(html, /href="mailto:ossi@rikkola\.fi"/u);
    assert.ok(html.includes(feedbackUi[locale].recipeButton));
    assert.ok(html.includes(feedbackUi[locale].button));
    assert.ok(!html.includes("<form"));
  }
});

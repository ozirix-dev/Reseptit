import { createHash } from "node:crypto";
import type { RecipeLocale } from "../../types/content";
import type { AssistantEvalCase } from "./eval-cases";
import { parseAssistantIntent } from "./intent-contract";

const locales: readonly RecipeLocale[] = ["fi", "en", "sv", "th"];
const labels: Record<RecipeLocale, string> = {
  fi: "Suomi", en: "English", sv: "Svenska", th: "ไทย",
};
const caseId = /^A4-(fi|en|sv|th)-([0-9]{2})$/;

export interface AssistantLanguageReviewRow {
  id: string;
  locale: RecipeLocale;
  topic: string;
  prompt: string;
  expectedJson: string;
  sourceSha256: string;
  status: "PENDING";
}

/**
 * Review queue is a blank human-review worksheet, never a claim that an
 * assistant or an external reviewer approved the prompt. Content-addressing
 * invalidates earlier reviews if either a prompt or the expected intent moves.
 */
export function assistantLanguageReviewRows(cases: readonly AssistantEvalCase[]): AssistantLanguageReviewRow[] {
  if (cases.length !== 80 || new Set(cases.map((item) => item.id)).size !== 80) {
    throw new Error("A4 language review requires exactly 80 unique source cases");
  }
  const rows: AssistantLanguageReviewRow[] = [];
  for (const locale of locales) {
    const subset = cases.filter((item) => item.locale === locale)
      .sort((a, b) => a.id.localeCompare(b.id));
    if (subset.length !== 20) throw new Error(`A4 language review missing 20 cases for ${locale}`);
    for (let i = 0; i < subset.length; i++) {
      const item = subset[i];
      const match = caseId.exec(item.id);
      if (!match || match[1] !== locale || Number(match[2]) !== i + 1 || !item.prompt.trim() ||
          item.prompt.length > 500 || !item.topic.trim() ||
          /[\u0000-\u0008\u000b-\u001f\u007f]/u.test(item.prompt)) {
        throw new Error(`Invalid or out-of-order A4 language review case ${item.id}`);
      }
      const expectedJson = JSON.stringify(parseAssistantIntent(item.expected));
      const sourceSha256 = createHash("sha256")
        .update(JSON.stringify({ id: item.id, locale, topic: item.topic, prompt: item.prompt, expected: expectedJson }))
        .digest("hex");
      rows.push({ id: item.id, locale, topic: item.topic, prompt: item.prompt,
        expectedJson, sourceSha256, status: "PENDING" });
    }
  }
  return rows;
}

function markdownCell(input: string): string {
  return input.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll("|", "&#124;").replace(/\s+/gu, " ").trim();
}

/** Render once per review version. Outputs an editable human worksheet, not a report of completed QA. */
export function renderAssistantLanguageReview(rows: readonly AssistantLanguageReviewRow[]): string {
  if (rows.length !== 80 || rows.some((row) => row.status !== "PENDING")) {
    throw new Error("An unreviewed A4 worksheet must contain 80 pending entries");
  }
  const sections = locales.map((locale) => {
    const subset = rows.filter((row) => row.locale === locale);
    if (subset.length !== 20) throw new Error("Incomplete locale review worksheet");
    const table = subset.map((row) => [
      row.id, row.topic, markdownCell(row.prompt), `\`${markdownCell(row.expectedJson)}\``,
      `\`${row.sourceSha256}\``, row.status, "—",
    ].join(" | "));
    return [
      `## ${labels[locale]} (${subset.length}/20 odottaa tarkistusta)`,
      "",
      "| Tunnus | Aihe | Kysymys | Odotettu intentti | SHA-256 | Tila | Katselmointihuomio |",
      "| --- | --- | --- | --- | --- | --- | --- |",
      ...table.map((line) => `| ${line} |`),
    ].join("\n");
  });
  return [
    "# Recipavo Keittiöapuri — A4 kielikatselmointijono",
    "",
    "**Luonnos. 80/80 PENDING, ei hyväksyttyjä kielimerkityksiä.**",
    "Tämä on automaattisesti luotu tyhjä katselmointipohja, EI kielimallin tulos tai ihmisarvio.",
    "Tarkista jokaisessa kielessä, että kysymyksen merkitys vastaa odotettua intenttiä.",
    "Kirjaa katselmoijan tunniste, päivämäärä, huomio ja hyväksytty SHA-256 erilliseen päätösaineistoon.",
    "Kun kysymys tai intentti muuttuu, vanhaa hyväksyntää ei saa siirtää uudelle SHA:lle.",
    "Älä vie käyttäjän keskusteluja tai henkilötietoja tähän tiedostoon.",
    "",
    ...sections.flatMap((section) => [section, ""]),
  ].join("\n");
}

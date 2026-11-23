import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { assistantEvalCases } from "../src/features/assistant/eval-cases";
import { assistantLanguageReviewRows, renderAssistantLanguageReview, summarizeAssistantLanguageDecisions } from "../src/features/assistant/language-review";

// Offline document export. No HTTP, paid AI, prompts from users, or credentials.
const rows = assistantLanguageReviewRows(assistantEvalCases);
const args = process.argv.slice(2);
if (args.length === 2 && args[0] === "--decisions") {
  const input: unknown = JSON.parse(await readFile(args[1], "utf8"));
  const summary = summarizeAssistantLanguageDecisions(rows, input);
  console.log(JSON.stringify({ submittedDecisions: summary, reviewerIdentityVerified: false,
    releaseAuthorized: false, paidModelCalls: 0, networkCalls: 0 }, null, 2));
} else {
  if (args.length) throw new Error("Usage: audit:assistant:language-review [--decisions path-to-json]");
  const markdown = renderAssistantLanguageReview(rows);
  const folder = path.resolve(import.meta.dirname, "../../tmp/assistant-a4");
  await mkdir(folder, { recursive: true });
  const filename = path.join(folder, "language-review-pending.md");
  // Do not clobber an existing worksheet containing people's review notes.
  await writeFile(filename, markdown + "\n", { encoding: "utf8", flag: "wx" }).catch((error: NodeJS.ErrnoException) => {
    if (error.code === "EEXIST") throw new Error("A4 review worksheet already exists; move/rename it before regenerating");
    throw error;
  });
  console.log(JSON.stringify({ file: filename, cases: rows.length, byLocale: { fi: 20, en: 20, sv: 20, th: 20 },
    reviewState: "PENDING", paidModelCalls: 0, networkCalls: 0 }, null, 2));
}

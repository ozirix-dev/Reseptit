import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PILOT_IDS } from "./fi-approved-source-pilot";
import { intakeWrittenFiReviews, writtenIntakeMarkdown } from "./fi-written-review-intake";
import { changedRecipeIds } from "./translation-batch-ci-report";

const root = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
const output = path.join(root, "tmp/fi-written-review-intake");

async function main() {
  // With content changes inspect those IDs. Without changes, exercise the
  // five historically reviewed FI sources. No authorization is inferred.
  const changed = changedRecipeIds(process.env.CHANGED_PATHS ?? "");
  const ids = changed.length ? changed : [...PILOT_IDS];
  const report = await intakeWrittenFiReviews(root, ids);
  await mkdir(output, {recursive: true});
  await writeFile(path.join(output, "current.json"), JSON.stringify({
    ...report, testedSha: process.env.GITHUB_SHA ?? "",
  }, null, 2) + "\n");
  await writeFile(path.join(output, "current.md"), writtenIntakeMarkdown(report));
  console.log(JSON.stringify({checked: report.checked, ...report.counts,
    reviewWriter: false, releaseAuthorized: false}));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error("FI_REVIEW_INTAKE_FAILED:", error); process.exitCode = 1; });
}

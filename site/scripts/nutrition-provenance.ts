import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

// Include the loader/schema dependencies as well as calculation code and data.
export const inputPaths = ["reseptit", "site/scripts", "site/src", "site/package.json", "site/package-lock.json", "docs/nutrition/food-records.json"];
export async function nutritionProvenance(root: string) {
  const git = (args: string[]) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
  const files = [...new Set(git(["ls-files", "-z", "--cached", "--others", "--exclude-standard", "--", ...inputPaths]).split("\0").filter(Boolean))].sort();
  const sourceInputHashes = Object.fromEntries(await Promise.all(files.map(async (file) => [file, createHash("sha256").update((await readFile(path.join(root, file), "utf8")).replaceAll("\r\n", "\n")).digest("hex")])));
  return { sourceRevision: git(["rev-parse", "HEAD"]), sourceWorkingTreeChanges: git(["status", "--porcelain", "--untracked-files=all", "--", ...inputPaths]) || null, sourceInputHashes, nodeVersion: process.version };
}

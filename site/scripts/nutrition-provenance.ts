import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

// Include the loader/schema dependencies as well as calculation code and data.
export const inputPaths = ["reseptit", "site/scripts", "site/src", "site/package.json", "site/package-lock.json", "docs/nutrition/food-records.json", "docs/nutrition/estimates-2026-10-24.md", "docs/nutrition/estimates-2026-10-24-batch-2.md", "docs/nutrition/estimates-2026-10-24-batch-3.md"];
export async function inputHash(file: string): Promise<string | null> {
  try { return createHash("sha256").update((await readFile(file, "utf8")).replaceAll("\r\n", "\n")).digest("hex"); }
  catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return null; throw error; }
}
export async function nutritionProvenance(root: string) {
  const git = (args: string[]) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
  const files = [...new Set(git(["ls-files", "-z", "--cached", "--others", "--exclude-standard", "--", ...inputPaths]).split("\0").filter(Boolean))].sort();
  // null records an indexed path absent from the worktree; other read errors fail.
  const sourceInputHashes = Object.fromEntries(await Promise.all(files.map(async (file) => [file, await inputHash(path.join(root, file))])));
  return { sourceRevision: git(["rev-parse", "HEAD"]), sourceWorkingTreeChanges: git(["status", "--porcelain", "--untracked-files=all", "--", ...inputPaths]) || null, sourceInputHashes, nodeVersion: process.version };
}

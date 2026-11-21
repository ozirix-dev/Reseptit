import path from "node:path";
import { realpath, stat } from "node:fs/promises";

/**
 * A new draft may carry a Git-tracked image before the published image bundle
 * has been resealed. Published recipes MUST use the verified image input root.
 * Keep this fallback confined to changed-content draft validation; build and
 * deployment still use only the verified published source images.
 */
async function existsInsideRoot(root: string, source: string): Promise<boolean> {
  const rootPath = path.resolve(root);
  const target = path.resolve(rootPath, source);
  const relative = path.relative(rootPath, target);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Recipe image path escapes its root: ${source}`);
  }
  let actualRoot: string;
  let actualFile: string;
  try {
    [actualRoot, actualFile] = await Promise.all([realpath(rootPath), realpath(target)]);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw error;
  }
  const actualRelative = path.relative(actualRoot, actualFile);
  if (!actualRelative || actualRelative.startsWith("..") || path.isAbsolute(actualRelative)) {
    throw new Error(`Recipe image path resolves outside its root: ${source}`);
  }
  if (!(await stat(actualFile)).isFile()) throw new Error(`Recipe image is not a file: ${source}`);
  return true;
}

export async function assertChangedRecipeImageSource(
  source: string,
  status: "draft" | "published",
  verifiedImageRoot: string,
  gitImageRoot: string,
): Promise<void> {
  if (await existsInsideRoot(verifiedImageRoot, source)) return;
  // Only drafts may use a missing image from the checked-out repo. This does
  // not add it to the R2 manifest or allow a future published recipe through.
  if (status === "draft" && path.resolve(verifiedImageRoot) !== path.resolve(gitImageRoot)
      && await existsInsideRoot(gitImageRoot, source)) return;
  throw new Error(`Recipe image missing from verified inputs: ${source} (status: ${status})`);
}

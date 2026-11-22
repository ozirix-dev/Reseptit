import path from "node:path";

/**
 * Draft image files are kept in the versioned repo until the image owner
 * has approved and transferred them into the verified publication bundle.
 * Published recipes MUST use the verified image root when provided.
 */
export function changedContentImageRoot(
  status: "draft" | "published",
  repoRoot: string,
  verifiedImageRoot: string | undefined,
): string {
  const gitImageRoot = path.resolve(repoRoot, "kuvat");
  if (status === "draft") return gitImageRoot;
  return path.resolve(verifiedImageRoot || gitImageRoot);
}

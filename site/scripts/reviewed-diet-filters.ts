import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import type { RecipeDietTag, RecipeLocale } from "../src/types/content";

// Explicit editorial whitelist; never infer diet compatibility from nutrition,
// primary ingredients, text tags or existing keto/VHH labels.
// A vegan recipe is also vegetarian and compatible with pescatarian eating.
export const reviewedDietFilters: Readonly<Record<string, {
  tags: readonly RecipeDietTag[];
  sourceBlobShas: Readonly<Record<RecipeLocale, string>>;
}>> = {
  hummus: {
    tags: ["vegetarian", "vegan", "pescatarian"],
    sourceBlobShas: {
      fi: "cd792d70d50753a5f8f93eeca030ec3743cfb209",
      en: "226fcc49b596963b806566d7d303f065b49ba257",
      sv: "82048ac89eb3ad107f3e1c76eab9d3a74a5d5aa5",
      th: "17cfb4760fec649a73ee27226a6ea6cddeff5249",
    },
  },
  caponata: {
    tags: ["vegetarian", "vegan", "pescatarian"],
    sourceBlobShas: {
      fi: "f8ed686e1e15fce50c36c1cfa2995ef25485819d",
      en: "117262c6b9c396ad4dc9a01d246627f9dbed377a",
      sv: "2b1534fcb425b4df56472a89df36be6f7d5d3a72",
      th: "def8d4f0777e97006590034d6bd3c36c0f59fae2",
    },
  },
  munakokkeli: {
    tags: ["vegetarian", "pescatarian"],
    sourceBlobShas: {
      fi: "9aebef80445adac268f797a7df4d5473cf361d14",
      en: "6b6b2d509a222a9d2b0096092ce47dd97a7dd5d1",
      sv: "5c6eeaaa612c3c4b0389d4182a9f9f338ee4dcf9",
      th: "30d4f51369e89f28e98e58f9581c1a853d8ce0b4",
    },
  },
  bouillabaisse: {
    tags: ["pescatarian"],
    sourceBlobShas: {
      fi: "5ba7b2fd832ac56b46e35e4c6098a746a37a9087",
      en: "664407e786425cf6348bc6afc0d03ecd07fb6654",
      sv: "05d1a733f7a308ec3be3d88b8dd22ae6b833dc1b",
      th: "1477cb4f48bc18baa2e45c1cb16492150f672aa7",
    },
  },
  "kermainen-lohipata": {
    tags: ["pescatarian"],
    sourceBlobShas: {
      fi: "b22e39b5d034debf7203b7a7129a021970cba925",
      en: "4a0eb25207e102e5a2bbb9535eb3d9aff4dd5782",
      sv: "93557e26d465775c70933afcc244e93b2bd4c9c9",
      th: "d30fda0a0b247164feff37614cc9b51bf42da639",
    },
  },
};

function gitBlobSha(buffer: Buffer): string {
  return createHash("sha1").update(`blob ${buffer.byteLength}\0`).update(buffer).digest("hex");
}

/**
 * Both the original Finnish source AND this locale's exact recipe must match
 * their reviewed versions. Missing original => no review claim, even if the
 * translation itself has not changed.
 */
export async function reviewedDietTagsForSource(
  recipeId: string, locale: RecipeLocale, filePath: string, finnishSourcePath?: string,
): Promise<RecipeDietTag[]> {
  const review = Object.hasOwn(reviewedDietFilters, recipeId) ? reviewedDietFilters[recipeId] : undefined;
  if (!review || !finnishSourcePath) return [];
  const source = await readFile(finnishSourcePath);
  if (gitBlobSha(source) !== review.sourceBlobShas.fi) return [];
  if (locale === "fi" && filePath === finnishSourcePath) return [...review.tags];
  const translation = await readFile(filePath);
  return gitBlobSha(translation) === review.sourceBlobShas[locale] ? [...review.tags] : [];
}

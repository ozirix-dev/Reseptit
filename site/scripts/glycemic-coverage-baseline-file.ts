import { writeFile } from "node:fs/promises";

export async function writeImmutableBaselineFile(filePath: string, content: string): Promise<void> {
  try {
    await writeFile(filePath, content, { encoding: "utf8", flag: "wx" });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") {
      throw new Error(`Refusing to overwrite existing batch baseline: ${filePath}`, { cause: error });
    }
    throw error;
  }
}

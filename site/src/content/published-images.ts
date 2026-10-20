import { copyFile, lstat, mkdir, realpath, rename, rm, stat } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const webpPathPattern = /^[a-z0-9][a-z0-9/_-]*\.webp$/i;

function assertInside(parent: string, child: string, label: string): void {
  if (child !== parent && !child.startsWith(`${parent}${path.sep}`)) throw new Error(`${label} resolves outside its allowed directory.`);
}

export async function rebuildPublishedImages(sourceDir: string, publicDir: string, relativePaths: string[]): Promise<void> {
  const sourceRoot = path.resolve(sourceDir);
  const publicRoot = path.resolve(publicDir);
  if ((await lstat(sourceRoot)).isSymbolicLink() || !(await stat(sourceRoot)).isDirectory()) {
    throw new Error("Recipe image source must be a real directory.");
  }
  await mkdir(publicRoot, { recursive: true });
  if ((await lstat(publicRoot)).isSymbolicLink() || !(await stat(publicRoot)).isDirectory()) {
    throw new Error("Recipe image output parent must be a real directory.");
  }
  const [sourceRootReal, publicRootReal] = await Promise.all([realpath(sourceRoot), realpath(publicRoot)]);
  const outputDir = path.join(publicRoot, "kuvat");
  const outputStatus = await lstat(outputDir).catch((error: NodeJS.ErrnoException) => {
    if (error.code === "ENOENT") return null;
    throw error;
  });
  if (outputStatus?.isSymbolicLink()) throw new Error("Generated image directory cannot be a symbolic link.");
  if (outputStatus && !outputStatus.isDirectory()) throw new Error("Generated image output must be a directory.");
  if (outputStatus) assertInside(publicRootReal, await realpath(outputDir), "Generated image directory");

  const token = randomUUID();
  const stageDir = path.join(publicRoot, `.kuvat-staging-${token}`);
  const backupDir = path.join(publicRoot, `.kuvat-backup-${token}`);
  const uniquePaths = [...new Set(relativePaths)];
  await mkdir(stageDir);
  let oldOutputMoved = false;
  try {
    const stageReal = await realpath(stageDir);
    assertInside(publicRootReal, stageReal, "Image staging directory");
    for (const relativePath of uniquePaths) {
      if (!webpPathPattern.test(relativePath) || relativePath.startsWith("/") || relativePath.includes("\\") || relativePath.split("/").includes("..")) {
        throw new Error(`Invalid published WebP path: ${relativePath}`);
      }
      const sourcePath = path.resolve(sourceRoot, relativePath);
      assertInside(sourceRoot, sourcePath, "Recipe image path");
      const sourceReal = await realpath(sourcePath).catch((error: NodeJS.ErrnoException) => {
        if (error.code === "ENOENT") throw new Error(`Recipe image file does not exist: ${path.join("kuvat", relativePath)}`);
        throw error;
      });
      assertInside(sourceRootReal, sourceReal, "Recipe image file");
      if (!(await stat(sourceReal)).isFile()) throw new Error(`Recipe image is not a file: ${path.join("kuvat", relativePath)}`);
      const targetPath = path.resolve(stageDir, relativePath);
      assertInside(stageDir, targetPath, "Generated image path");
      await mkdir(path.dirname(targetPath), { recursive: true });
      await copyFile(sourceReal, targetPath);
    }

    if (outputStatus) {
      await rename(outputDir, backupDir);
      oldOutputMoved = true;
    }
    try {
      await rename(stageDir, outputDir);
    } catch (error) {
      if (oldOutputMoved) {
        await rename(backupDir, outputDir);
        oldOutputMoved = false;
      }
      throw error;
    }
    if (oldOutputMoved) {
      await rm(backupDir, { recursive: true, force: true });
      oldOutputMoved = false;
    }
  } catch (error) {
    await rm(stageDir, { recursive: true, force: true });
    if (oldOutputMoved) {
      const currentOutput = await lstat(outputDir).catch(() => null);
      if (!currentOutput) await rename(backupDir, outputDir);
    }
    throw error;
  }
}

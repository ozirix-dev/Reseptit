import { lstat, mkdir, readFile, realpath, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";

import sharp from "sharp";

export const imageSettings = {
  widths: [480, 960, 1440], quality: 78, effort: 4,
  encoder: { sharp: sharp.versions.sharp, webp: sharp.versions.webp, vips: sharp.versions.vips },
} as const;
export const imageWorkers = 2;
export interface ImageVariant { path: string; width: number; height: number; bytes: number; sha256: string }
export interface PublishedImage extends ImageVariant { variants: ImageVariant[] }
export interface ImageManifest { settings: typeof imageSettings; images: PublishedImage[] }
const digest = (data: Buffer | string) => createHash("sha256").update(data).digest("hex");

// Two source images at a time, one native encoder thread each. Both workers settle
// before rollback, so a rejected task cannot keep writing into a removed stage.
sharp.concurrency(1);
async function boundedMap<T, R>(items: T[], work: (item: T) => Promise<R>, concurrency: number): Promise<R[]> {
  let cursor = 0;
  const result: R[] = [];
  const workers = await Promise.allSettled(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (cursor < items.length) { const i = cursor++; result[i] = await work(items[i]); }
  }));
  const failed = workers.find((worker) => worker.status === "rejected");
  if (failed?.status === "rejected") throw failed.reason;
  return result;
}

const webpPathPattern = /^[a-z0-9][a-z0-9/_-]*\.webp$/i;

function assertInside(parent: string, child: string, label: string): void {
  if (child !== parent && !child.startsWith(`${parent}${path.sep}`)) throw new Error(`${label} resolves outside its allowed directory.`);
}

export async function rebuildPublishedImages(sourceDir: string, publicDir: string, relativePaths: string[], workers = imageWorkers): Promise<ImageManifest> {
  if (!Number.isInteger(workers) || workers < 1 || workers > 4) throw new Error("Image workers must be between 1 and 4.");
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
  // Never stage, replace or clean the canonical source tree, even via an alias.
  const outputReal = path.join(publicRootReal, "kuvat");
  if (outputReal === sourceRootReal || outputReal.startsWith(`${sourceRootReal}${path.sep}`)
      || sourceRootReal.startsWith(`${outputReal}${path.sep}`)) throw new Error("Image source and output must not overlap.");
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
  const uniquePaths = [...new Set(relativePaths)].sort();
  // Existing output is only a verified reuse cache; absent/corrupt cache is rebuilt.
  const cached = new Map<string, ImageVariant>();
  if (outputStatus) {
    try {
      const manifestPath = path.join(outputDir, "_variants", "manifest.json");
      assertInside(outputReal, await realpath(manifestPath), "Image cache manifest");
      const old: ImageManifest = JSON.parse(await readFile(manifestPath, "utf8"));
      for (const item of old.images) for (const variant of item.variants) cached.set(variant.path, variant);
    } catch { /* A cache miss must not prevent a fresh build. */ }
  }
  await mkdir(stageDir);
  let oldOutputMoved = false;
  try {
    const stageReal = await realpath(stageDir);
    assertInside(publicRootReal, stageReal, "Image staging directory");
    const generated = new Map<string, Promise<ImageVariant[]>>();
    const images = await boundedMap(uniquePaths, async (relativePath): Promise<PublishedImage> => {
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
      const bytes = await readFile(sourceReal);
      const metadata = await sharp(bytes).metadata();
      if (metadata.format !== "webp" || !metadata.width || !metadata.height || (metadata.pages ?? 1) !== 1
          || (metadata.orientation ?? 1) !== 1) throw new Error(`Expected a static, upright WebP: ${relativePath}`);
      const { width, height } = metadata;
      const sha256 = digest(bytes);
      await writeFile(targetPath, bytes);
      const key = digest(sha256 + JSON.stringify(imageSettings)).slice(0, 24);
      if (!generated.has(key)) generated.set(key, (async () => {
        const variants: ImageVariant[] = [];
        for (const targetWidth of imageSettings.widths.filter((candidate) => candidate < width)) {
          const variantPath = `_variants/${key}-${targetWidth}w.webp`;
          const prior = cached.get(variantPath);
          let data: Buffer | undefined;
          if (prior) {
            try {
              const cachePath = await realpath(path.join(outputDir, variantPath));
              assertInside(outputReal, cachePath, "Cached image");
              const candidate = await readFile(cachePath);
              const info = await sharp(candidate).metadata();
              if (digest(candidate) === prior.sha256 && info.format === "webp" && info.width === targetWidth
                  && info.height === Math.round(height * targetWidth / width)) data = candidate;
            } catch { /* Regenerate invalid or escaped cache entries. */ }
          }
          data ??= await sharp(bytes).resize({ width: targetWidth, withoutEnlargement: true })
            .webp({ quality: imageSettings.quality, effort: imageSettings.effort }).toBuffer();
          const info = await sharp(data).metadata();
          if (info.width !== targetWidth || !info.height) throw new Error(`Unexpected variant size: ${relativePath}`);
          const destination = path.join(stageDir, variantPath);
          await mkdir(path.dirname(destination), { recursive: true });
          await writeFile(destination, data);
          variants.push({ path: variantPath, width: info.width, height: info.height, bytes: data.length, sha256: digest(data) });
        }
        return variants;
      })());
      return { path: relativePath, width, height, bytes: bytes.length, sha256, variants: await generated.get(key)! };
    }, workers);
    const manifest: ImageManifest = { settings: imageSettings, images };
    await mkdir(path.join(stageDir, "_variants"), { recursive: true });
    await writeFile(path.join(stageDir, "_variants", "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

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
    return manifest;
  } catch (error) {
    await rm(stageDir, { recursive: true, force: true });
    if (oldOutputMoved) {
      const currentOutput = await lstat(outputDir).catch(() => null);
      if (!currentOutput) await rename(backupDir, outputDir);
    }
    throw error;
  }
}

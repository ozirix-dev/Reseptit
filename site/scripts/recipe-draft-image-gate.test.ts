import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, mkdir, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { assertChangedRecipeImageSource } from "./recipe-draft-image-gate";

test("new draft image may use checked-out Git source while verified R2 bundle has only published images", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "recipavo-draft-image-"));
  const verified = path.join(root, "verified");
  const git = path.join(root, "git");
  const rel = "paaruoat/new-draft.webp";
  try {
    await mkdir(verified, { recursive: true });
    await mkdir(path.dirname(path.join(git, rel)), { recursive: true });
    await writeFile(path.join(git, rel), "draft-image-fixture");
    await assertChangedRecipeImageSource(rel, "draft", verified, git);
    await assert.rejects(assertChangedRecipeImageSource(rel, "published", verified, git), /missing from verified inputs/);
    await writeFile(path.join(verified, "empty.txt"), "fixture");
    await mkdir(path.dirname(path.join(verified, rel)), { recursive: true });
    await writeFile(path.join(verified, rel), "verified-image-fixture");
    await assertChangedRecipeImageSource(rel, "published", verified, git);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("draft fallback fails for missing paths, traversal, and links outside the tracked image root", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "recipavo-draft-image-safety-"));
  const verified = path.join(root, "verified");
  const git = path.join(root, "git");
  const outside = path.join(root, "outside.webp");
  try {
    await mkdir(verified);
    await mkdir(git);
    await writeFile(outside, "unapproved");
    await assert.rejects(assertChangedRecipeImageSource("missing.webp", "draft", verified, git), /missing from verified inputs/);
    await assert.rejects(assertChangedRecipeImageSource("../outside.webp", "draft", verified, git), /escapes its root/);
    await symlink(outside, path.join(git, "linked.webp"));
    await assert.rejects(assertChangedRecipeImageSource("linked.webp", "draft", verified, git), /resolves outside its root/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

import { execFileSync } from "node:child_process";
import type { F25SourceGate } from "./f25-source-release-gate";

const creationCommit = "715c9e6a2d3f36e8c8fa420fc28ae7f6be32c0bf";

export function readF25AtCreation(root: string, file: string): string {
  return execFileSync("git", ["show", creationCommit + ":" + file], { cwd: root, encoding: "utf8" });
}

export function readF25GateAtCreation(root: string): F25SourceGate {
  return JSON.parse(readF25AtCreation(root, "meta/kaannokset/f25-release-gate.json"));
}

export function readF25HistoricalBlob(root: string, sha: string): Buffer {
  if (!/^[a-f0-9]{40}$/.test(sha)) throw new Error("Invalid F25 historical blob: " + sha);
  return execFileSync("git", ["cat-file", "blob", sha], { cwd: root });
}

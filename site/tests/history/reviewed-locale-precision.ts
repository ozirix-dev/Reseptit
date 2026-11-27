import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";

const predecessor = "0e01b08168e2b10d5b805a50d835d72179a960d6";

// Only the independently reviewed #1001 successors can be projected back
// to the exact predecessor blobs. This adapter is used only by history tests.
const reviewedTransitions = new Map<string, { prior: string; current: string }>([
  ["kaannokset/en/leivonnaiset/karjalanpiirakat-riisipuurolla.md", {
    prior: "261ed391fb959b3b76359586ec801a129fb49a2f",
    current: "89cb311a261d3f57494a0354f0f5698618c3c680",
  }],
  ["kaannokset/sv/leivonnaiset/karjalanpiirakat-riisipuurolla.md", {
    prior: "046b419dd62d60940df70455af679c33f3a0145f",
    current: "773b3fd5ba2936056390de475355abe16b72b76b",
  }],
  ["kaannokset/th/leivonnaiset/karjalanpiirakat-riisipuurolla.md", {
    prior: "9fd11f0fbe8265742f1b79347450a8ece0cdd99f",
    current: "8675fc7bcf3fd2c9a4baa71b655d7264aa880f02",
  }],
  ["kaannokset/th/paaruoat/pad-kra-pao-vhh.md", {
    prior: "dfb59871717efdb6d26191628f2da45b4694a0af",
    current: "9f53890a7520a5c144958fdabeef7a15e8528870",
  }],
]);

function gitBlob(text: string): string {
  return createHash("sha1").update("blob " + Buffer.byteLength(text) + "\0").update(text).digest("hex");
}

export function beforeReviewedLocalePrecision(root: string, file: string, text: string): string {
  const transition = reviewedTransitions.get(file);
  if (!transition) return text;

  assert.equal(gitBlob(text.replaceAll("\r\n", "\n")), transition.current,
    file + ": unreviewed #1001 translation mutation");
  const historical = execFileSync("git", ["show", predecessor + ":" + file], {
    cwd: root, encoding: "utf8",
  });
  assert.equal(gitBlob(historical), transition.prior, file + ": historical translation blob changed");
  return historical;
}

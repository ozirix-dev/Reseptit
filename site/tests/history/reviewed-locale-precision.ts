import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";

const predecessor = "0e01b08168e2b10d5b805a50d835d72179a960d6";
const porkServiceNotePredecessor = "cfb400e0355a698ca79d6cdcb06c7010650e8b5d";
export const porkServiceNoteSourcePath = "reseptit/paaruoat/hapanimela-porsas.md";

// Only the independently reviewed #1001 and #1043 successors can be projected back
// to the exact predecessor blobs. This adapter is used only by history tests.
const reviewedTransitions = new Map<string, { prior: string; current: string; predecessor?: string }>([
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
  [porkServiceNoteSourcePath, {
    prior: "27737503a62dd8716d08b5a76fdd1f509270f116",
    current: "b13cbcb192364478ee2f5cb10aaddd45e43031ef",
    predecessor: porkServiceNotePredecessor,
  }],
  ["kaannokset/en/paaruoat/hapanimela-porsas.md", {
    prior: "ffbe5fb8c8665f19dc072318947bcef5a29d5e98",
    current: "12f80c50afd6bbaecc31bf3144870de066ec990e",
    predecessor: porkServiceNotePredecessor,
  }],
  ["kaannokset/sv/paaruoat/hapanimela-porsas.md", {
    prior: "2e70e3c49dc2b39ba0ed4ef42b9451b32465a616",
    current: "4a1e8ecc0950aa6932c067e6a3473b1af73994ba",
    predecessor: porkServiceNotePredecessor,
  }],
  ["kaannokset/th/paaruoat/hapanimela-porsas.md", {
    prior: "487be5c9c76c4ebc4538d53aa9b0abfbf55f0bfc",
    current: "e518f446c2b6d0f7d8b15466f7b8992821c48a09",
    predecessor: porkServiceNotePredecessor,
  }],
]);

function gitBlob(text: string): string {
  return createHash("sha1").update("blob " + Buffer.byteLength(text) + "\0").update(text).digest("hex");
}

export function beforeReviewedLocalePrecision(root: string, file: string, text: string): string {
  const transition = reviewedTransitions.get(file);
  if (!transition) return text;

  assert.equal(gitBlob(text.replaceAll("\r\n", "\n")), transition.current,
    file + ": unreviewed recipe or translation mutation");
  const historical = execFileSync("git", ["show", (transition.predecessor ?? predecessor) + ":" + file], {
    cwd: root, encoding: "utf8",
  });
  assert.equal(gitBlob(historical), transition.prior, file + ": historical recipe or translation blob changed");
  return historical;
}

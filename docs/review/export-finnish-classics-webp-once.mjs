// One-time, branch-scoped GitHub Actions transport for already converted non-sensitive food images.
// Emits GitHub-blob-compatible base64 chunks to job logs. Remove after WebP blobs are committed.
import { readFile } from "node:fs/promises";
import path from "node:path";
const root = path.resolve(import.meta.dirname, "../..");
const jobs = [
  ["karjalanpiirakat-riisipuurolla","leivonnaiset"],
  ["marry-me-kanapasta","paaruoat"],
  ["uunifetapasta-kirsikkatomaateilla","paaruoat"],
  ["raejuustobagelit-ilman-kohotusta","leivonnaiset"],
  ["linssimakaronilaatikko","paaruoat"],
];
for (const [id,category] of jobs) {
  const file = path.join(root,"kuvat",category,id+".webp");
  const bytes = await readFile(file);
  if (bytes.toString("ascii",0,4)!=="RIFF" || bytes.toString("ascii",8,12)!=="WEBP") {
    throw new Error(id+": invalid WebP source");
  }
  const b64 = bytes.toString("base64");
  const chunks = b64.match(/.{1,8192}/g) ?? [];
  process.stdout.write(`PHOTO_BEGIN ${id} ${bytes.length} ${chunks.length}\n`);
  chunks.forEach((chunk,index) => process.stdout.write(`PHOTO_CHUNK ${id} ${index} ${chunk}\n`));
  process.stdout.write(`PHOTO_END ${id}\n`);
}

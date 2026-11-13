import { createHash } from 'node:crypto';

// The separately approved boiled GK-only version retains its exact source.
// The caller still verifies the reconstructed text against the sealed bundle.
const sourcePath = 'reseptit/alkuruoat/jiaozi.md';
const currentSha256 = "3ca732e55e989dd81361ed6284a1bf742b781421e37b7f952854a98179315fb5";
const inverseEdits: [number, number, string][] = [
  [87, 2, "3. Jaa taikina 24 osaan ja kauli ohuiksi levyiksi. Laita kunkin keskelle teelusikallinen täytettä, kostuta reuna, taita puolikuuksi ja sulje tiiviisti.\n4. Keitä nyytit erissä kiehuvassa vedessä 6–8 minuuttia, kunnes ne nousevat pintaan ja täyte on kypsä. Nosta reikäkauhalla.\n"],
  [81, 1, "Kotitekoiset kiinalaiset dumplingit täytetään porsaanlihalla, kaalilla ja inkiväärillä. Ne voi keittää tai paistaa rapeapohjaisiksi.\n"],
  [77, 1, "Kotitekoiset kiinalaiset dumplingit täytetään porsaanlihalla, kaalilla ja inkiväärillä. Ne voi keittää tai paistaa rapeapohjaisiksi.\n"],
  [21, 2, "  src: paaruoat/jiaozi.webp\n  alt: Jiaozi-dumplingit, kullanruskeat pohjat ja soijainen dippikastike\n"],
  [8, 1, "time_total_min: 75\n"],
];

export function historicalJiaoziForApprovedVersion(file: string, current: string): string {
  if (file !== sourcePath) return current;
  const normalized = current.replaceAll('\r\n', '\n');
  if (createHash('sha256').update(normalized).digest('hex') !== currentSha256) return current;
  const lines = normalized.split('\n');
  for (const [start, count, historical] of inverseEdits) {
    lines.splice(start, count, ...historical.slice(0, -1).split('\n'));
  }
  return lines.join('\n');
}

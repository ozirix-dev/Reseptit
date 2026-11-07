import { createHash } from 'node:crypto';

// For the sealed eighteen-variant GK100 release only: a single reviewed
// editorial correction to the *original oven farinata* may coexist with the
// separately approved *pan farinata* GK version. Keep the original release
// manifest, packet boundFiles, calculated GK and other sealed files untouched.
const originalPath = 'reseptit/aamupalat/valimerellinen-farinata-aamupalaksi.md';
const reviewedSha256 = '1f065d830bd5f4018b69d2298cb4ef9a5286903866d85538aa5d4f3d66a5e90d';
const originalSha256 = '1b15fd29f9d833b84289c2d1345e27a0110c4bda7044ed6939d581ede947d237';
const approvedHistoricalSteps = ["1. Sekoita jauhot tai viljat ja muut kuivat ainekset kulhossa. Lisää neste vähitellen ja vatkaa tasaiseksi taikinaksi.","2. Anna taikinan levätä 10 minuuttia. Jos käytät kokonaisia palkokasveja tai viljoja taikinapohjana, niiden tulee olla liotettuja ja hienonnettuja.","3. Kuumenna öljytty pannu keskilämmölle. Paista taikina ohuina annoksina; käännä, kun reunat kuivuvat ja pinta alkaa asettua.","4. Vatkaa kikhernejauho ja vesi tasaiseksi taikinaksi ja anna levätä 20 minuuttia. Lisää hienonnettu rosmariini ja kaada öljyttyyn vuokaan. Lisää viipaloidut oliivit ja tomaatti. Paista 220-asteisessa uunissa, kunnes pinta on kullanruskea ja keskusta hyytynyt."];
const sha256 = (value: string) => createHash('sha256').update(value).digest('hex');

/** Exact version mapping; anything other than the reviewed text remains fail-closed. */
export function historicalFarinataForApprovedPanVersion(path: string, current: string): string {
  if (path !== originalPath) return current;
  const normalized = current.replaceAll('\r\n', '\n');
  if (sha256(normalized) !== reviewedSha256) return current;
  const lines = normalized.split('\n');
  lines.splice(66, 5, ...approvedHistoricalSteps);
  lines.splice(36, 1, 'time_total_min: 25');
  const historical = lines.join('\n');
  if (sha256(historical) !== originalSha256) throw Error('GK100_FARINATA_HISTORICAL_SNAPSHOT_MISMATCH');
  return historical;
}

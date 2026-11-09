// The separately approved GK100 rendang estimate remains tied to its exact
// historical Finnish recipe snapshot. A one-line editorial correction merely
// instructs the cook to use 1 tsp turmeric already in the weighed ingredients.
// The immutable approved bundle still verifies the reconstructed source hash.
const sourcePath = 'reseptit/paaruoat/rendang-padang.md';
const originalStep = "2. Laita maustetahna, kookosmaito, sitruunaruoho ja kaffirlimetinlehdet paksupohjaiseen kattilaan. Kuumenna sekoittaen lähes kiehuvaksi.";
const correctedStep = "2. Laita maustetahna, kookosmaito, sitruunaruoho, kaffirlimetinlehdet ja ainesluettelon 1 tl kurkumajauhetta paksupohjaiseen kattilaan. Kuumenna sekoittaen lähes kiehuvaksi.";

export function historicalRendangForApprovedVersion(path: string, current: string): string {
  if (path !== sourcePath) return current;
  const normalized = current.replaceAll('\\r\\n', '\\n');
  if (!normalized.includes(correctedStep)) return current;
  if (normalized.split(correctedStep).length !== 2) throw Error('GK100_RENDANG_AMBIGUOUS_CORRECTION');
  // No other edits can pass: checkBatch must reproduce the exact sealed
  // source SHA and ingredient/composition/candidate fingerprint.
  return normalized.replace(correctedStep, originalStep);
}

// Reconstruct the approved recipe snapshot for the two reviewed note edits.
// The snapshot hash still verifies all other recipe text and metadata.
const approvedNoteEdits: Readonly<Record<string, readonly [string, string]>> = {
  "reseptit/jalkiruoat/keto-mutakakku.md": [
    "Paistoaika vaikuttaa keskuksen pehmeyteen. Käytä makeuttamatonta suklaata ja tarkista tuotteen hiilihydraattimäärä.",
    "Paistoaika vaikuttaa keskuksen pehmeyteen. Käytä sokeritonta suklaata ja tarkista tuotteen hiilihydraattimäärä.",
  ],
  "reseptit/jalkiruoat/keto-suklaakeksit.md": [
    "Keksit ovat pehmeitä kuumana ja kovettuvat jäähtyessään. Makeuttamattoman suklaan maku ja hiilihydraatit vaihtelevat tuotteittain.",
    "Keksit ovat pehmeitä kuumana ja kovettuvat jäähtyessään. Sokerittoman suklaan maku ja hiilihydraatit vaihtelevat tuotteittain.",
  ],
};

export function recipeTextForApprovedSnapshot(file: string, text: string): string {
  const edit = approvedNoteEdits[file];
  if (!edit) return text;
  const [historical, current] = edit;
  return text.split("\n").map(line => line === current ? historical : line).join("\n");
}

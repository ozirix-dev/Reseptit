// Reconstruct the approved recipe snapshot after reviewed note and locale metadata edits.
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

const englishPublicationSources = new Set([
  "reseptit/jalkiruoat/keto-mutakakku.md",
  "reseptit/jalkiruoat/keto-suklaakeksit.md",
  "reseptit/jalkiruoat/meheva-suklaakakku.md",
]);

export function recipeTextForApprovedSnapshot(file: string, text: string): string {
  if (englishPublicationSources.has(file)) {
    text = text.replace(
      "\nstatus: published\ntranslation_languages: [en]\ntranslation_status: {en: published}\n",
      "\nstatus: published\n",
    );
  }
  if (file === "reseptit/aamupalat/indialainen-poha-maapahkinoilla.md" ||
      file === "reseptit/paaruoat/hunaja-sinappikana-kaalilla.md") {
    text = text.replace(
      "\nstatus: published\ntranslation_languages: [en, sv, th]\ntranslation_status: {en: published, sv: published, th: published}\n",
      "\nstatus: published\n",
    );
  }
  const edit = approvedNoteEdits[file];
  if (!edit) return text;
  const [historical, current] = edit;
  return text.split("\n").map(line => line === current ? historical : line).join("\n");
}

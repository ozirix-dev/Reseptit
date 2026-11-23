// Preserve wrapped lines in plain-text steps used by the build and the FI inventory.
export function numberedInstructionSteps(markdown: string): string[] {
  const steps: string[] = [];
  let continuationIndent = 0;

  for (const line of markdown.split(/\r?\n/)) {
    const numbered = /^([ \t]*\d+[.)][ \t]+)(\S.*)$/.exec(line);
    if (numbered) {
      steps.push(numbered[2].trimEnd());
      continuationIndent = numbered[1].length;
      continue;
    }

    const firstCharacter = line.search(/\S/);
    if (firstCharacter < 0) continue;
    if (continuationIndent > 0 && firstCharacter >= continuationIndent) {
      steps[steps.length - 1] += ' ' + line.trim();
    } else {
      continuationIndent = 0;
    }
  }

  return steps;
}

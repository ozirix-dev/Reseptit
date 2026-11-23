export function canonicalEditorialText(text: string): string {
  return text.normalize('NFKC').toLocaleLowerCase('fi').replace(/\s+/g, ' ')
    // Keep a decimal separator between digits so distinct quantities cannot collide.
    .replace(/[!?;:“”"'()\-–—]|(?<!\d)[.,]|[.,](?!\d)/g, '')
    .replace(/\s+/g, ' ').trim();
}

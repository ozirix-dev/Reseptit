export function canonicalEditorialText(text: string): string {
  return text.normalize('NFKC').toLocaleLowerCase('fi').replace(/\s+/g, ' ')
    // Keep decimal and range separators between digits so distinct quantities cannot collide.
    .replace(/(?<=\d)[–—-](?=\d)/g, '–')
    .replace(/[!?;:“”"'()—-]|(?<!\d)[.,–]|[.,–](?!\d)/g, '')
    .replace(/\s+/g, ' ').trim();
}

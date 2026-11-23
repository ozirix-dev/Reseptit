export function canonicalEditorialText(text: string): string {
  return text.normalize('NFKC').toLocaleLowerCase('fi').replace(/\s+/g, ' ')
    // Keep decimal and range separators between digits so distinct quantities cannot collide.
    .replace(/(?<=\d)[–—-](?=\d)/g, '–')
    // Canonicalize a numeric minus before stripping ordinary hyphens.
    .replace(/(?<![\p{L}\p{N}])-(?=\d)/gu, '−')
    .replace(/[!?;:“”"'()—-]|(?<!\d)[.,–]|[.,–](?!\d)/g, '')
    .replace(/\s+/g, ' ').trim();
}

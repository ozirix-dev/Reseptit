// Keep aligned with styles.css: 1160px container, 1rem grid gaps, .65rem
// card padding and 1px borders. Shared by SSR preloads and hydrated cards.
export const recipeCardSizes = "(min-width: 1192px) calc(376px - 1.3rem - 2px), (min-width: 1100px) calc(33.333333vw - 2.633333rem - 2px), (min-width: 700px) calc(50vw - 2.8rem - 2px), calc(100vw - 3.3rem - 2px)";
// Only replace the 720px WebP on mobile. With the mobile slot above and a
// 16px root font, this range needs 482–719 physical pixels. Other sizes use
// the original WebP srcset, including high-density and wider displays.
export const recipeCardAvifMedia = "(min-width: 376px) and (max-width: 414px) and (min-resolution: 1.5dppx) and (max-resolution: 2dppx)";
export const recipeHeroSizes = "(min-width: 852px) 820px, calc(100vw - 2rem)";
// Select the 720px source only when it covers the displayed width at this density.
export const recipeHeroAvifMedia = [
  "(min-width: 353px) and (max-width: 392px) and (min-resolution: 1.5dppx) and (max-resolution: 2dppx)",
  "(min-width: 393px) and (max-width: 443px) and (min-resolution: 1.5dppx) and (max-resolution: 1.75dppx)",
  "(min-width: 444px) and (max-width: 512px) and (min-resolution: 1.25dppx) and (max-resolution: 1.5dppx)",
].join(", ");

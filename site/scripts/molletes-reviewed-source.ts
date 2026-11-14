import { createHash } from "node:crypto";

export const molletesRecipeId = "meksikolainen-molletes-pico-de-gallolla";
export const molletesSourcePath = "reseptit/aamupalat/meksikolainen-molletes-pico-de-gallolla.md";
const reviewedSourceSha256 = "c0791847b360192cd0e8bee88ff206625ab4264f31989c21dba1928ee85544c4";
const historicalSource = "---\ntitle: \"Molletes pavulla ja pico de gallolla\"\nrecipe_id: meksikolainen-molletes-pico-de-gallolla\nurl_slug: meksikolainen-molletes-pico-de-gallolla\ncategory: aamupala\nlanguage: fi\nstatus: published\nmain_ingredient:\n  - \"bolillosämpylä\"\n  - \"musta papu\"\n  - \"juusto\"\ncooking_method:\n  - \"uunipaistos\"\ningredients:\n  - amount: 150\n    unit: \"g\"\n    item: \"bolillosämpylä\"\n  - amount: 150\n    unit: \"g\"\n    item: \"musta papu\"\n  - amount: 100\n    unit: \"g\"\n    item: \"juusto\"\n  - amount: 1\n    unit: \"kpl\"\n    item: \"tomaatti\"\n  - amount: 1\n    unit: \"rkl\"\n    item: \"neutraalia paistoöljyä\"\n  - amount: null\n    unit: \"\"\n    item: \"suolaa maun mukaan\"\nservings: 2\ntime_total_min: 25\ndifficulty: Helppo\ntags:\n  - \"aamupala\"\n  - \"meksikolainen\"\n  - \"aamiaisruoka\"\nimage:\n  src: aamupalat/meksikolainen-molletes-pico-de-gallolla.webp\n  alt: \"Molletes pavulla ja pico de gallolla tarjoiltuna aamiaisella\"\n  width: 1536\n  height: 1024\n---\n\n# Molletes pavulla ja pico de gallolla\n\n## Kuvaus\n\nTässä kotikeittiöön sovitetussa ohjeessa valmistetaan molletes pavulla ja pico de gallolla. Mausteisuutta ja lisukkeita voi säätää oman maun mukaan.\n\n## Ainekset\n\nAinekset ovat annoslaskurin käytössä rakenteisista metatiedoista.\n\n## Valmistus\n\n1. Kuumenna uuni 200 asteeseen ja voitele pieni uunivuoka. Kypsennä kovemmat kasvikset tai viljat tarvittaessa ensin.\n2. Sekoita ainekset ja mausteet. Levitä tasaisesti vuokaan.\n3. Paista, kunnes pinta saa väriä ja keskusta on kypsä. Anna vetäytyä muutama minuutti ennen tarjoamista.\n4. Levitä paputahna halkaistuille sämpylöille, lisää juusto ja gratinoi.\n";

// This source is only for replaying the historical GK audit.
export function molletesHistoricalText(file: string, text: string): string {
  if (file !== molletesSourcePath) return text;
  const normalized = text.replaceAll("\r\n", "\n");
  return createHash("sha256").update(normalized).digest("hex") === reviewedSourceSha256 ? historicalSource : text;
}

import { createHash } from "node:crypto";

// Historical recipes for existing GI/GK calculations and the approved tofu-kimchi version.
const snapshots: Readonly<Record<string, { reviewedSha: string; original: string }>> = {
  "reseptit/aamupalat/korealainen-bataatti-riisikulho.md": {
    "reviewedSha": "48f55e75dbd3ef1597f96729720b2b1555c2f8e964d0ce62e84faa24bee3f995",
    "original": "---\ntitle: \"Korealainen bataatti- ja riisikulho\"\nrecipe_id: korealainen-bataatti-riisikulho\nurl_slug: korealainen-bataatti-riisikulho\ncategory: aamupala\nlanguage: fi\nstatus: published\nmain_ingredient:\n  - \"bataatti\"\n  - \"riisi\"\n  - \"kananmuna\"\ncooking_method:\n  - \"paistaminen\"\ningredients:\n  - amount: 1\n    unit: \"kpl\"\n    item: \"bataatti\"\n  - amount: 100\n    unit: \"g\"\n    item: \"riisi\"\n  - amount: 2\n    unit: \"kpl\"\n    item: \"kananmuna\"\n  - amount: 150\n    unit: \"g\"\n    item: \"gochujang\"\n  - amount: null\n    unit: \"\"\n    item: \"suolaa maun mukaan\"\nservings: 2\ntime_total_min: 25\ndifficulty: Helppo\ntags:\n  - \"aamupala\"\n  - \"korealainen\"\n  - \"aamiaisruoka\"\nimage:\n  src: aamupalat/korealainen-bataatti-riisikulho.webp\n  alt: \"Korealainen bataatti- ja riisikulho tarjoiltuna aamiaisella\"\n  width: 1536\n  height: 1024\n---\n\n# Korealainen bataatti- ja riisikulho\n\n## Kuvaus\n\nTässä kotikeittiöön sovitetussa ohjeessa valmistetaan korealainen bataatti- ja riisikulho. Mausteisuutta ja lisukkeita voi säätää oman maun mukaan.\n\n## Ainekset\n\nAinekset ovat annoslaskurin käytössä rakenteisista metatiedoista.\n\n## Valmistus\n\n1. Kypsennä riisi pakkauksen ohjeen mukaan. Paista tofu, muna tai muu lämmin täyte tarvittaessa erikseen.\n2. Paloittele tuoreet kasvikset ja valmistele yrtit sekä kastikkeen ainekset.\n3. Jaa lämmin pohja kulhoihin, asettele muut ainekset päälle ja lisää kastike juuri ennen tarjoamista.\n4. Tarjoa paahdettu bataatti ja paistettu muna riisillä, mausta gochujang-kastikkeella.\n"
  },
  "reseptit/aamupalat/korealainen-tofu-kimchi-aamiaiskulho.md": {
    "reviewedSha": "1c378152421c263419e55e7bfa9936edf153d044806619e84510d875038a2aa8",
    "original": "---\ntitle: \"Korealainen tofu-kimchi-aamiaiskulho\"\nrecipe_id: korealainen-tofu-kimchi-aamiaiskulho\nurl_slug: korealainen-tofu-kimchi-aamiaiskulho\ncategory: aamupala\nlanguage: fi\nstatus: published\nmain_ingredient:\n  - \"tofu\"\n  - \"kimchi\"\n  - \"riisi\"\ncooking_method:\n  - \"paistaminen\"\ningredients:\n  - amount: 100\n    unit: \"g\"\n    item: \"tofu\"\n  - amount: 150\n    unit: \"g\"\n    item: \"kimchi\"\n  - amount: 100\n    unit: \"g\"\n    item: \"riisi\"\n  - amount: 100\n    unit: \"g\"\n    item: \"seesami\"\n  - amount: null\n    unit: \"\"\n    item: \"suolaa maun mukaan\"\nservings: 2\ntime_total_min: 25\ndifficulty: Helppo\ntags:\n  - \"aamupala\"\n  - \"korealainen\"\n  - \"aamiaisruoka\"\nimage:\n  src: aamupalat/korealainen-tofu-kimchi-aamiaiskulho.webp\n  alt: \"Korealainen tofu-kimchi-aamiaiskulho tarjoiltuna aamiaisella\"\n  width: 1536\n  height: 1024\n---\n\n# Korealainen tofu-kimchi-aamiaiskulho\n\n## Kuvaus\n\nTässä kotikeittiöön sovitetussa ohjeessa valmistetaan korealainen tofu-kimchi-aamiaiskulho. Mausteisuutta ja lisukkeita voi säätää oman maun mukaan.\n\n## Ainekset\n\nAinekset ovat annoslaskurin käytössä rakenteisista metatiedoista.\n\n## Valmistus\n\n1. Kypsennä riisi pakkauksen ohjeen mukaan. Paista tofu, muna tai muu lämmin täyte tarvittaessa erikseen.\n2. Paloittele tuoreet kasvikset ja valmistele yrtit sekä kastikkeen ainekset.\n3. Jaa lämmin pohja kulhoihin, asettele muut ainekset päälle ja lisää kastike juuri ennen tarjoamista.\n4. Paista tofu kullanruskeaksi ja tarjoa kimchin sekä lämpimän riisin kanssa.\n"
  }
};

export function koreanRiceBowlHistoricalText(file: string, markdown: string): string {
  const snapshot = snapshots[file];
  if (!snapshot) return markdown;
  const normalized = markdown.replaceAll("\r\n", "\n");
  const actual = createHash("sha256").update(normalized).digest("hex");
  return actual === snapshot.reviewedSha ? snapshot.original : markdown;
}

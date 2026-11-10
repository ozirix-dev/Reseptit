import { createHash } from "node:crypto";

/** Exact Git blob lock for the published original. The sealed source stays
 * byte-identical; only its public preparation text is replaced. */
const sourcePath = "reseptit/aamupalat/kiinalainen-katkarapu-wontonkeitto.md";
const sourceGitBlobSha1 = "3b817955b38577138bfe36a96cae662c1c150e49";
const oldSteps = "## Valmistus\n\n1. Kuumenna kattilassa öljy tai liemi. Lisää aromit ja hitaammin kypsyvät ainekset; paista tai hauduta muutama minuutti.\n2. Kaada kattilaan liemi ja keitä miedosti, kunnes pääraaka-aineet ovat kypsiä.\n3. Lisää nuudelit, lehtivihannekset tai muut nopeasti kypsyvät ainekset niiden kypsymisajan mukaan.\n4. Tarjoa kirkkaassa liemessä paksoin ja kevätsipulin kanssa.";
const reviewedSteps = "## Valmistus\n\n1. Jos katkaravut ovat jäisiä, sulata ne jääkaapissa ja valuta. Poista mahdolliset kuoret ja suolet. Hienonna koko luettelon 150 g katkarapuja ja sekoita ne 1 tl:aan inkivääriä sekä ripaukseen luettelon suolaa. Pese paksoi ja leikkaa se suikaleiksi.\n2. Jaa koko 150 g wonton-taikinaa pieniksi levyiksi valmistajan ohjeen mukaan. Annostele katkaraputäyte tasaisesti levyjen keskelle. Kostuta levyjen reunat pienellä määrällä vettä, sulje nyytit huolellisesti ja paina reunat tiiviiksi. Kaikki katkaraputäyte käytetään nyytteihin.\n3. Kuumenna kattilassa koko 700 ml kasvis- tai kanalientä kiehuvaksi. Laske lämpöä hieman ja lisää wontonit varovasti liemeen erissä tarvittaessa. Kypsennä kevyesti kiehuvassa liemessä, kunnes taikina on kypsää ja katkaravut nyyttien keskellä kauttaaltaan helmiäisenvaaleita, kiinteitä ja läpinäkymättömiä. Tarkista yhden paksuimman nyytin sisus ennen tarjoamista; jatka kypsentämistä, jos täytteessä on raakaa tai lasimaista katkarapua.\n4. Lisää paksoisuikaleet liemeen ja kuumenna ne kunnolla. Maista liemi ja lisää vain luettelon suolaa tarvittaessa. Jaa kaikki kypsät wontonit, paksoi ja liemi kahteen annokseen. Älä lisää öljyä, kevätsipulia tai muita ainesosalistasta puuttuvia täytteitä.\n\n## Muistiinpanot\n\nVesi wontonien reunojen kostuttamiseen on vain käsittelyapua, ei uutta ravintoainetta. Käytä elintarvikekäyttöön tarkoitettua wonton-taikinaa ja valmista katkaravut kauttaaltaan kypsiksi. Katkarapujen turvallisen kypsyyden tunnusmerkkinä on helmiäisenvaalea ja läpinäkymätön liha (FDA Safe Food Handling).";

export function projectSafeWontonFiDisplay(relativePath: string, input: string): string {
  if (relativePath !== sourcePath) return input;
  const normalized = input.replaceAll("\r\n", "\n");
  const blobHash = createHash("sha1")
    .update("blob " + Buffer.byteLength(normalized, "utf8") + "\0")
    .update(normalized)
    .digest("hex");
  if (blobHash !== sourceGitBlobSha1) throw new Error("WONTON_FI_SOURCE_STALE: " + relativePath);
  if (normalized.split(oldSteps).length !== 2) throw new Error("WONTON_FI_ANCHOR_AMBIGUOUS: " + relativePath);
  return normalized.replace(oldSteps, reviewedSteps);
}

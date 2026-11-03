import type { RecipeEntry } from "../../types/content";

/** Curated label facts only. The research calculator and its numerical results stay out of the page. */
export const chocolateComparisonProducts = [
  {
    id: "torras-maltitol",
    name: "Torras Dark chocolate",
    sweeteners: "Maltitoli",
    description: "Valmistajan ainesosaluettelossa makeutusaine on maltitoli. Maltitoli on polyoli eli sokerialkoholi. Tuote sisältää myös muita hiilihydraatteja.",
    note: "Valmistajan tuotesivun tunnistetiedot ovat keskenään ristiriidassa. Tarkista tuotteen nimi, makeutusaineet ja ainesosat omasta pakkauksestasi.",
    sourceUrl: "https://chocolatestorras.com/en/dark-chocolate/",
    sourceId: "torras-maltitol",
    sourceEvidenceHash: "441c3e01cf515b58dfa6045ef6079a09783c557f4180cab5b7e799d4981a977b",
  },
  {
    id: "torras-stevia",
    name: "Torras Chocolate Negro 60% Stevia",
    sweeteners: "Erytritoli ja stevioliglykosidit",
    description: "Erytritoli on eri polyoli kuin maltitoli. Myös tässä tuotteessa on muita hiilihydraatteja: stevia-nimi ei tarkoita hiilihydraatitonta suklaata.",
    note: "Tarkista pakkauksesta molemmat makeutusaineet ja muu koostumus, sillä tuotetiedot voivat muuttua.",
    sourceUrl: "https://chocolatestorras.com/stevia-negro/",
    sourceId: "torras-stevia",
    sourceEvidenceHash: "491310ce51073835deaecdf4058e68e196762de56274f92cee2a1a22311897e4",
  },
] as const;

export function ChocolateComparisonFi({ recipeId, locale }: Pick<RecipeEntry, "recipeId" | "locale">) {
  const isCookie = recipeId === "keto-suklaakeksit";
  const isFrostedCake = recipeId === "meheva-suklaakakku";
  if (locale !== "fi" || (!isCookie && !isFrostedCake && recipeId !== "keto-mutakakku")) return null;

  const recipeScope = isCookie ? "valmiiden keksien" : "koko kakun";

  return <details className="recipe-panel chocolate-comparison" data-chocolate-comparison="fi">
    <summary><h2>{isFrostedCake ? "Miten tummat suklaat eroavat makeutukseltaan?" : "Miten käyttämäsi suklaa vaikuttaa GK-arvioon?"}</h2></summary>
    <div className="chocolate-comparison__body">
      {isFrostedCake
        ? <p>Reseptissä tumma suklaa sulatetaan taikinaan voin kanssa ja kuorrutteeseen kerman kanssa. Jos harkitset sokeritonta suklaata jompaankumpaan, tarkista pakkauksesta, millä se on makeutettu.</p>
        : <p>Sokeriton suklaa voidaan makeuttaa eri aineilla. Pelkkä sokeriton-merkintä ei kerro {recipeScope} glykeemistä kuormaa (GK).</p>}
      {chocolateComparisonProducts.map(product => <article className="chocolate-comparison__product" key={product.id} data-chocolate-product={product.id}>
        <h3>{product.name}</h3>
        <p><strong>Makeutusaineet: {product.sweeteners}.</strong></p>
        <p>{product.description}</p>
        <p className="recipe-disclosure">{product.note}</p>
        <p><a href={product.sourceUrl} rel="noopener noreferrer">Valmistajan tuotetiedot: {product.name}</a></p>
      </article>)}
      {isFrostedCake ? <p>Taikinaan tulee suklaan lisäksi sokeria ja vehnäjauhoja. Tuotetiedoista ei voi päätellä, miten suklaan vaihtaminen taikinassa tai kuorrutteessa vaikuttaisi valmiin kakun makuun, rakenteeseen tai glykeemiseen kuormaan (GK).</p> : <>
        <p>Näistä tuotetiedoista ei voida määrittää {recipeScope} GK:ta tai tuotteiden välistä GK-eroa. {isCookie
          ? "Suklaa käännellään taikinaan paloina. Taikinaan erikseen lisättävä erytritoli ei kerro suklaapalojen makeutuksesta."
          : "Myöskään reseptiin erikseen lisättävä erytritoli ei kerro suklaan makeutuksesta."}</p>
        <p>Edellä näkyvä laskettu osuus koskee vain siinä kuvattua laskentaversiota. Vertailu ei ole henkilökohtaisen verensokerivasteen mittaus.</p>
      </>}
      <p className="recipe-disclosure">Lähdeaineisto: valmistajan tuotetiedot, tarkistettu <time dateTime="2026-11-02">2.11.2026</time>. Tarkista ajantasaiset ainesosat pakkauksesta.</p>
    </div>
  </details>;
}

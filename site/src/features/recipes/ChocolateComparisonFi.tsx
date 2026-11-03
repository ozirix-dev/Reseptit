import type { RecipeEntry } from "../../types/content";

/** Curated label facts only. The research calculator and its numerical results stay out of the page. */
export const chocolateComparisonProducts = [
  {
    id: "torras-maltitol",
    name: "Torras Dark chocolate",
    sweeteners: "Maltitoli",
    description: "Valmistajan ainesosaluettelossa makeutusaine on maltitoli. Maltitoli on polyoli eli sokerialkoholi. Tuote sisältää myös muita hiilihydraatteja.",
    note: "Valmistajan tuotesivun tunnistetiedot ovat keskenään ristiriidassa. Tarkista tuotteen nimi, makeutusaineet ja ainesosat omasta pakkauksestasi.",
    en: {
      sweeteners: "Maltitol",
      description: "The manufacturer lists maltitol as the sweetener. Maltitol is a polyol, also known as a sugar alcohol. The chocolate also contains other carbohydrates.",
      note: "The product identifiers on the manufacturer's page conflict. Check the name, sweeteners and ingredients on your pack.",
    },
    sv: {
      sweeteners: "Maltitol",
      description: "Tillverkaren anger maltitol som sötningsmedel. Maltitol är en polyol, även kallad sockeralkohol. Chokladen innehåller också andra kolhydrater.",
      note: "Produktens identifieringsuppgifter på tillverkarens sida motsäger varandra. Kontrollera namn, sötningsmedel och ingredienser på förpackningen.",
    },
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
    en: {
      sweeteners: "Erythritol and steviol glycosides",
      description: "Erythritol is a different polyol from maltitol. This chocolate also contains other carbohydrates, even though it is labelled stevia.",
      note: "Check both sweeteners and the other ingredients on your pack, as product formulations can change.",
    },
    sv: {
      sweeteners: "Erytritol och steviolglykosider",
      description: "Erytritol är en annan polyol än maltitol. Även den här chokladen innehåller andra kolhydrater, trots att den är märkt med stevia.",
      note: "Kontrollera båda sötningsmedlen och övriga ingredienser på förpackningen, eftersom innehållet kan ändras.",
    },
    sourceUrl: "https://chocolatestorras.com/stevia-negro/",
    sourceId: "torras-stevia",
    sourceEvidenceHash: "491310ce51073835deaecdf4058e68e196762de56274f92cee2a1a22311897e4",
  },
] as const;

export function ChocolateComparison({ recipeId, locale, hasGlVariant }: Pick<RecipeEntry, "recipeId" | "locale"> & { hasGlVariant: boolean }) {
  const isCookie = recipeId === "keto-suklaakeksit";
  const isFrostedCake = recipeId === "meheva-suklaakakku";
  if ((locale !== "fi" && locale !== "en" && locale !== "sv") || (!isCookie && !isFrostedCake && recipeId !== "keto-mutakakku")) return null;

  const isEnglish = locale === "en";
  const isSwedish = locale === "sv";
  const swedishScope = isCookie ? "de färdiga kakorna" : "hela kakan";
  const englishScope = isCookie ? "the finished cookies" : "the whole cake";
  const recipeScope = isCookie ? "valmiiden keksien" : "koko kakun";

  return <details className="recipe-panel chocolate-comparison" data-chocolate-comparison={locale}>
    <summary><h2>{isSwedish
      ? isFrostedCake ? "Hur sötas de mörka chokladsorterna?" : "Hur påverkar valet av choklad uppskattningen av GK?"
      : isEnglish
      ? isFrostedCake ? "How are these dark chocolates sweetened?" : "How does your choice of chocolate affect the GL estimate?"
      : isFrostedCake ? "Miten tummat suklaat eroavat makeutukseltaan?" : "Miten käyttämäsi suklaa vaikuttaa GK-arvioon?"}</h2></summary>
    <div className="chocolate-comparison__body">
      {isSwedish ? (
        isFrostedCake
          ? <p>Den mörka chokladen smälts med smör till smeten och med grädde till glasyren. Om du funderar på att använda sockerfri choklad till någon av delarna, kontrollera hur den är sötad på förpackningen.</p>
          : <p>Sockerfri choklad kan innehålla olika sötningsmedel. Märkningen sockerfri säger i sig inget om den glykemiska belastningen (GK) för {swedishScope}.</p>
      ) : isEnglish ? (
        isFrostedCake
          ? <p>The dark chocolate is melted with butter for the batter and with cream for the glaze. If you are considering sugar-free chocolate for either, check the pack to see how it is sweetened.</p>
          : <p>Sugar-free chocolate can contain different sweeteners. The sugar-free label alone cannot tell you the glycaemic load (GL) of {englishScope}.</p>
      ) : isFrostedCake
        ? <p>Reseptissä tumma suklaa sulatetaan taikinaan voin kanssa ja kuorrutteeseen kerman kanssa. Jos harkitset sokeritonta suklaata jompaankumpaan, tarkista pakkauksesta, millä se on makeutettu.</p>
        : <p>Sokeriton suklaa voidaan makeuttaa eri aineilla. Pelkkä sokeriton-merkintä ei kerro {recipeScope} glykeemistä kuormaa (GK).</p>}
      {chocolateComparisonProducts.map(product => {
        const copy = locale === "fi" ? product : product[locale];
        return <article className="chocolate-comparison__product" key={product.id} data-chocolate-product={product.id}>
        <h3>{product.name}</h3>
        <p><strong>{isSwedish ? "Sötningsmedel" : isEnglish ? "Sweeteners" : "Makeutusaineet"}: {copy.sweeteners}.</strong></p>
        <p>{copy.description}</p>
        <p className="recipe-disclosure">{copy.note}</p>
        <p><a href={product.sourceUrl} rel="noopener noreferrer">{isSwedish ? "Tillverkarens produktinformation" : isEnglish ? "Manufacturer’s product information" : "Valmistajan tuotetiedot"}: {product.name}</a></p>
      </article>;
      })}
      {isSwedish ? (
        isFrostedCake
          ? <p>Smeten innehåller också socker och vetemjöl. Produktinformationen räcker inte för att avgöra hur ett chokladbyte i smeten eller glasyren påverkar den färdiga kakans smak, konsistens eller glykemiska belastning (GK).</p>
          : <>
            <p>Produktinformationen räcker inte för att fastställa GK för {swedishScope} eller skillnaden i GK mellan chokladsorterna. {isCookie
              ? "Chokladen vänds ner i degen i bitar. Erytritolen som tillsätts separat i degen säger inget om hur chokladbitarna är sötade."
              : "Erytritolen som tillsätts separat i smeten säger inget om hur chokladen är sötad."}</p>
            {hasGlVariant ? <p>Den beräknade delen ovan gäller bara den version som beskrivs där.</p> : null}
            <p>Jämförelsen mäter inte ditt individuella blodsockersvar.</p>
          </>
      ) : isEnglish ? (
        isFrostedCake
          ? <p>The batter also contains sugar and wheat flour. The product information cannot tell you how swapping the chocolate in the batter or glaze would affect the finished cake’s flavour, texture or glycaemic load (GL).</p>
          : <>
            <p>The product information cannot establish the GL of {englishScope} or the difference in GL between the two chocolates. {isCookie
              ? "The chocolate is folded into the dough in chunks. The erythritol added separately to the dough does not tell you how the chocolate chunks are sweetened."
              : "The erythritol added separately to the batter does not tell you how the chocolate is sweetened."}</p>
            {hasGlVariant ? <p>The calculated part shown above applies only to the version described there.</p> : null}
            <p>This comparison does not measure your individual blood glucose response.</p>
          </>
      ) : isFrostedCake ? <p>Taikinaan tulee suklaan lisäksi sokeria ja vehnäjauhoja. Tuotetiedoista ei voi päätellä, miten suklaan vaihtaminen taikinassa tai kuorrutteessa vaikuttaisi valmiin kakun makuun, rakenteeseen tai glykeemiseen kuormaan (GK).</p> : <>
        <p>Näistä tuotetiedoista ei voida määrittää {recipeScope} GK:ta tai tuotteiden välistä GK-eroa. {isCookie
          ? "Suklaa käännellään taikinaan paloina. Taikinaan erikseen lisättävä erytritoli ei kerro suklaapalojen makeutuksesta."
          : "Myöskään reseptiin erikseen lisättävä erytritoli ei kerro suklaan makeutuksesta."}</p>
        <p>{hasGlVariant ? "Edellä näkyvä laskettu osuus koskee vain siinä kuvattua laskentaversiota. " : null}Vertailu ei ole henkilökohtaisen verensokerivasteen mittaus.</p>
      </>}
      <p className="recipe-disclosure">{isSwedish ? "Källa: tillverkarens produktinformation, kontrollerad " : isEnglish ? "Source: manufacturer’s product information, checked " : "Lähdeaineisto: valmistajan tuotetiedot, tarkistettu "}<time dateTime="2026-11-02">{isSwedish ? "2 november 2026" : isEnglish ? "2 November 2026" : "2.11.2026"}</time>{isSwedish ? ". Kontrollera aktuella ingredienser på förpackningen." : isEnglish ? ". Check the pack for the current ingredients." : ". Tarkista ajantasaiset ainesosat pakkauksesta."}</p>
    </div>
  </details>;
}

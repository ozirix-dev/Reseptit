/** F25 source-review notices shown without altering source recipe Markdown or GK-sealed content.
 *  A disclaimer is not a release authorization, nutrition recalculation, or quarantine action.
 */
export interface SourceReviewNotice {
  heading: string;
  details: string;
  allergens: string;
}

export const sourceReviewNotices: Readonly<Record<string, SourceReviewNotice>> = Object.freeze({
  "korealainen-kimchi-jeon-aamiaiseksi": {
    heading: "Kimchin tuote ja lettutaikinan kosteus vielä tarkistuksessa",
    details: "150 g kimchiä ei vielä kerro tuoteversiota tai valutettua painoa. Sempio-kimchin eri markkinaetiketeissä on ilmoitettu 2 ja 4,5 g hiilihydraattia/100 g. Myös 2 rkl kevätsipulia ja kimchistä taikinaan tuleva neste tarvitsevat punnituksen. Uutta vettä ei lisätä ilman erillistä ohje- ja ravintolaskentapäätöstä.",
    allergens: "Sisältää vehnää ja kananmunaa. Kimchituote voi sisältää soijaa, kalaa tai äyriäisiä: tarkista aina oma pakkaus.",
  },
  "karibia-plantain-aamiaislautanen": {
    heading: "Ruokabanaanin ja avokadon syötävät painot puuttuvat",
    details: "Yksi ruokabanaani, yksi avokado ja yksi lime eivät riitä ravintoarvojen laskentaan ilman kuorittuja syötäviä grammapainoja ja limemehun määrää. Kypsennä ruokabanaani kunnolla; 1 rkl paistoöljyn syöty osuus täytyy arvioida ja kaksi munaa punnita ilman kuorta.",
    allergens: "Sisältää kananmunaa. Tarkista muiden käytettyjen tuotteiden allergeenit.",
  },
});

export function sourceReviewNotice(recipeId: string): SourceReviewNotice | null {
  return sourceReviewNotices[recipeId] ?? null;
}

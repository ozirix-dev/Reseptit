export interface BlogSection {
  heading: string;
  paragraphs?: string[];
  points?: string[];
}
export interface BlogSource { label: string; url: string }
export interface BlogPost {
  slug: string;
  routePath: string;
  title: string;
  seoTitle: string;
  excerpt: string;
  category: string;
  datePublished: string;
  dateModified: string;
  author: string;
  image: string;
  imageAlt: string;
  readingMinutes: number;
  sections: BlogSection[];
  sources: BlogSource[];
  related: { title: string; path: string }[];
}
export const blogIndexPath = "/ruokaopas/";
export const blogIndexTitle = "Ruokaopas | Reseptit";
export const blogIndexDescription = "Ruoanlaiton tekniikoita, reseptien taustoja ja ymmärrettävää ravitsemustietoa. Lähteistetyt artikkelit täydentävät reseptejä.";
const siteBase = "https://ozirix-dev.github.io/Reseptit";
export const blogPosts: BlogPost[] = [
  {
    slug: "briossisampylan-onnistuminen",
    routePath: "/ruokaopas/briossisampylan-onnistuminen/",
    title: "Näin onnistuu briossisämpylä – viisi ratkaisevaa vaihetta",
    seoTitle: "Briossisämpylän onnistuminen: 5 tärkeää vaihetta | Ruokaopas",
    excerpt: "Miksi toinen briossisämpylä on ilmava ja toinen raskas? Käymme läpi taikinan, voin, kohotuksen, muotoilun ja paiston ilman keksittyjä koepaistotuloksia.",
    category: "Leivonnan tekniikat",
    datePublished: "2026-11-06",
    dateModified: "2026-11-06",
    author: "Reseptit-toimitus",
    image: `${siteBase}/ruokaopas/briossi.svg`,
    imageAlt: "Piirrettyjä kullanruskeita briossisämpylöitä",
    readingMinutes: 5,
    sections: [
      {
        heading: "Briossi on tavallista sämpylää rikkaampi taikina",
        paragraphs: [
          "Briossissa on tavallista hiivataikinaa enemmän kananmunaa ja voita. Siksi sisuksesta voi tulla pehmeä ja hienosyinen ja pinnasta kiiltävä. Samasta syystä taikina tuntuu helposti tarttuvalta ennen kuin sitko on kehittynyt.",
          "Hyvä briossisämpylä ei synny vain lisäämällä taikinaan voita. Taikinan sekoitus, lämpötila, lepo ja paistaminen vaikuttavat kaikki lopputulokseen. Erilaiset reseptit painottavat näitä vaiheita eri tavoin."
        ]
      },
      {
        heading: "1. Kehitä taikinaan sitko ennen voita",
        paragraphs: [
          "Rasva voi vaikeuttaa jauhojen proteiinien verkoston muodostumista, joten monissa briossiohjeissa taikinaa vaivataan ensin ja pehmeä voi lisätään vähitellen. King Arthur Baking käyttää tätä toimintatapaa sekä briossin ammattiohjeessa että kotileivontareseptissään.",
          "Taikinan ei tarvitse tuntua heti kuivalta. Liiallinen jauhojen lisääminen vain siksi, että taikina tarttuu käsiin, voi tehdä sämpylöistä tiiviitä."
        ]
      },
      {
        heading: "2. Lisää voi vähitellen ja seuraa taikinan lämpöä",
        paragraphs: [
          "Pehmeä, ei sulanut voi sekoittuu tasaisemmin. Lisää sitä pienissä erissä ja jatka vaivaamista, kunnes taikina on yhtenäinen. Jos taikina kuumenee ja muuttuu rasvaisen löysäksi, viilennä sitä ennen jatkamista.",
          "Pitkä vaivaus voi olla tarpeen etenkin erittäin voipitoisessa versiossa. Yksittäistä minuuttimäärää ei voi siirtää sellaisenaan kaikille koneille ja taikinoille."
        ]
      },
      {
        heading: "3. Käytä kylmälepoa silloin, kun ohje sitä edellyttää",
        paragraphs: [
          "Monissa tunnetuissa briossiohjeissa taikina viilennetään useaksi tunniksi tai yön yli. Kylmä taikina on helpompi jakaa ja pyörittää tasaisiksi palloiksi. Hidas kohoaminen vaikuttaa myös taikinan käsiteltävyyteen.",
          "Kylmälepo ei kuitenkaan korvaa loppukohotusta: muotoillut sämpylät tarvitsevat aikaa ennen uunia. Tarkka kesto riippuu taikinasta ja huoneen lämpötilasta."
        ]
      },
      {
        heading: "4. Yhdeksän sämpylää voi olla sopiva määrä pellille",
        paragraphs: [
          "Yhdeksän kappaletta on käytännöllinen jaettava erä yhdelle pellille, jos sämpylät ovat sopivan kokoisia ja väliin jää kohoamisvaraa. Jaa taikina vaa'alla yhdeksään yhtä painavaan osaan. Muotoile tasaisesti pingottamalla pintaa kevyesti.",
          "Tämä on annoskokoehdotus, ei väite siitä, että esimerkiksi kuuden sämpylän alkuperäisresepti toimisi muuttumattomana yhdeksällä kappaleella. Pienempi koko voi muuttaa paistoaikaa. Seuraa väriä ja kypsyyttä."
        ]
      },
      {
        heading: "5. Paista kypsäksi ja jäähdytä ritilällä",
        paragraphs: [
          "Munavoitelu antaa kiiltävän pinnan. Runsaasti sokeria ja kananmunaa sisältävä taikina voi ruskistua jo ennen kuin keskusta on kypsä, joten pelkkä pintaväri ei aina kerro kaikkea. King Arthurin briossiohjeet neuvovat tarkistamaan myös sisälämpöä.",
          "Anna sämpylöiden jäähtyä ritilällä, jotta pohjaan ei kerry kosteutta. Pakasta ylimääräiset tuoreina; huoneenlämpöisen säilytyksen kesto riippuu sämpylän koostumuksesta ja olosuhteista."
        ]
      },
      {
        heading: "Mitä kannattaa vertailla seuraavaksi?",
        paragraphs: [
          "Reseptit-sivustolla on nyt kolme yhdeksän sämpylän ohjetta: Joshua Weissmanin tangzhong-tyylinen briossi, Moomien legendaariset hampurilaissämpylät ja The Clever Carrotin kevyempi versio. Erot liittyvät etenkin taikinan rakenteeseen, valmistustapaan ja voin määrään.",
          "Reseptikortit ovat lähteistettyjä, omiksi kirjoitettuja sovituksia. Niitä ei esitetä toimituksen koepaistoina, eikä yhtä versiota nimetä parhaaksi ilman vertailukelpoista testiä. Jokaisen reseptin muistiossa on tiedot lähteistä ja tunnettuudesta."
        ]
      }
    ],
    sources: [
      { label: "King Arthur Baking: Brioche Buns Recipe", url: "https://www.kingarthurbaking.com/recipes/brioche-buns-recipe" },
      { label: "King Arthur Baking: Classic Brioche Recipe", url: "https://www.kingarthurbaking.com/recipes/classic-brioche-recipe" },
      { label: "King Arthur Baking: Brioche (ammattilaisohje)", url: "https://www.kingarthurbaking.com/pro/formulas/brioche" }
    ],
    related: [
      { title: "Joshua Weissman: kuohkeat briossisämpylät (9 kpl)", path: "/briossisampylat-joshua-weissman/" },
      { title: "Moomien legendaariset hampurilaissämpylät (9 kpl)", path: "/hampurilaissampylat-moomie/" },
      { title: "The Clever Carrot: kevyet briossisämpylät (9 kpl)", path: "/kevyet-briossisampylat-clever-carrot/" }
    ]
  },
  {
    slug: "glykeeminen-indeksi-ja-kuorma",
    routePath: "/ruokaopas/glykeeminen-indeksi-ja-kuorma/",
    title: "GI ja GK käytännössä – miksi annoskoko ratkaisee?",
    seoTitle: "GI ja GK: mitä eroa niillä on ja miksi annoskoko ratkaisee? | Ruokaopas",
    excerpt: "Glykeeminen indeksi (GI) kertoo hiilihydraatin laadusta, glykeeminen kuorma (GK) ottaa mukaan myös määrän. Esimerkki havainnollistaa eron.",
    category: "Ravitsemus ja GK",
    datePublished: "2026-11-06",
    dateModified: "2026-11-06",
    author: "Reseptit-toimitus",
    image: `${siteBase}/ruokaopas/gk.svg`,
    imageAlt: "Piirretty kaurapuurokulho marjoilla. Ei kuva kahdesta annoksesta",
    readingMinutes: 5,
    sections: [
      {
        heading: "GI ja GK vastaavat eri kysymyksiin",
        paragraphs: [
          "Glykeeminen indeksi, GI, kuvaa hiilihydraattia sisältävän ruoan verensokerivaikutusta vakioidussa vertailuasetelmassa. Se ei yksin kerro, kuinka paljon hiilihydraattia omalla lautasellasi on. Glykeeminen kuorma, GK (englanniksi GL), yhdistää GI-arvon ja kyseisen annoksen imeytyvän hiilihydraatin määrän.",
          "Tämä ero on olennainen esimerkiksi riisiä, leipää tai puuroa vertailtaessa: samaa ruokaa voi syödä hyvin eri kokoisen annoksen. Diabetes UK korostaa myös annoskoon merkitystä GI-luvun rinnalla."
        ]
      },
      {
        heading: "Kaava on yksinkertainen – lähtötiedot eivät aina ole",
        paragraphs: [
          "GK = GI × annoksen imeytyvät hiilihydraatit grammoina / 100. Kaava on sama kuin Sydneyn yliopiston GI-tietokannan ohjeessa. Sen soveltaminen edellyttää kuitenkin oikeaa GI-lähdettä, järkevää annospainoa ja tiedossa olevaa hiilihydraattimäärää.",
          "Jos keskeinen raaka-aine tai sen GI-tieto puuttuu, luotettavaa koko annoksen GK-arvoa ei synny pelkästään laskutoimitusta toistamalla."
        ]
      },
      {
        heading: "Laskuesimerkki: sama GI, kaksinkertainen annos",
        paragraphs: [
          "Oletetaan kuvitteellinen ruoka, jonka GI on 60. Ensimmäisessä annoksessa on 20 grammaa imeytyvää hiilihydraattia: GK = 60 × 20 / 100 = 12. Toisessa annoksessa on 40 grammaa: GK = 60 × 40 / 100 = 24.",
          "Molemmissa esimerkeissä GI on sama, mutta laskennallinen GK kaksinkertaistuu. Luvut 60, 20 ja 40 ovat havainnollistavia oletuksia, eivät tämän puurokuvan tai tietyn tuotteen mitattuja arvoja."
        ],
        points: ["Kuvitteellinen pieni annos: GI 60, hiilihydraattia 20 g → GK 12.", "Kuvitteellinen suuri annos: GI 60, hiilihydraattia 40 g → GK 24."]
      },
      {
        heading: "Miksi reseptin GK on vaikeampi kuin yksittäisen ruoan?",
        paragraphs: [
          "Reseptissä on usein useita hiilihydraatin lähteitä, joiden määrät, valmistusmuodot ja GI-lähteiden soveltuvuus vaihtelevat. Liemet, kastikkeet ja epätarkat määrät voivat estää luotettavan laskennan, vaikka itse kaava olisi helppo.",
          "Reseptit-sivuston periaate on näyttää epävarmuus eikä korvata puuttuvia merkittäviä tietoja nollilla. Samasta syystä kaikki reseptit eivät vielä näytä GK-lukua."
        ]
      },
      {
        heading: "Mihin GI ja GK eivät riitä?",
        paragraphs: [
          "GK ei ole koko aterian terveellisyysarvosana eikä tarkka ennuste yksittäisen ihmisen verensokerista. Aterian muut ainekset, valmistustapa ja yksilöllinen vaihtelu vaikuttavat vasteeseen. Kuidun, energian, proteiinin ja rasvan merkitystä ei voi päätellä pelkän GK:n perusteella.",
          "Jos seurataan verensokeria sairauden hoidon vuoksi, yksittäisiä GI- tai GK-arvoja ei pidä käyttää korvaamaan terveydenhuollosta saatuja yksilöllisiä ohjeita."
        ]
      }
    ],
    sources: [
      { label: "University of Sydney: Glycemic Index FAQ", url: "https://glycemicindex.com/faqs/" },
      { label: "Diabetes UK: Glycaemic index and diabetes (tarkistettu 22.9.2025)", url: "https://www.diabetes.org.uk/living-with-diabetes/eating/carbohydrates-and-diabetes/glycaemic-index-and-diabetes" }
    ],
    related: [{ title: "Lue sivuston GK-menetelmästä", path: "/glykeeminen-kuorma/" }, { title: "Etsi reseptejä GK-suodattimella", path: "/" }]
  }
];
export const blogRoutes = [blogIndexPath, ...blogPosts.map(post => post.routePath)];
export const blogPostForRoute = (route: string) => blogPosts.find(post => post.routePath === route) ?? null;
export function blogJsonLd(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    inLanguage: "fi",
    image: [post.image],
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: "Reseptit" },
    mainEntityOfPage: `${siteBase}${post.routePath}`
  };
}

/** Adapter to existing blog UI and SEO while keeping the richer, source-linked pilot data. */
export interface Article {
  slug: string; routePath: string; title: string; description: string; image: string; alt: string;
  category: string; datePublished: string; dateModified: string; author: string; readingMinutes: number;
  sections: {heading:string; text:string[]; points?:string[]}[];
  sources: BlogSource[]; related: {title:string;path:string}[];
}
export const blogRoot = blogIndexPath;
export const articles: Article[] = blogPosts.map(post => ({
  slug: post.slug, routePath: post.routePath, title: post.title, description: post.excerpt,
  image: post.image.replace(siteBase, ""), alt: post.imageAlt, category: post.category,
  datePublished: post.datePublished, dateModified: post.dateModified, author: post.author,
  readingMinutes: post.readingMinutes,
  sections: post.sections.map(section => ({
    heading:section.heading, text:section.paragraphs ?? [], ...(section.points ? {points:section.points} : {})
  })),
  sources: post.sources, related: post.related
}));
export const articlePath = (article: Article) => article.routePath;

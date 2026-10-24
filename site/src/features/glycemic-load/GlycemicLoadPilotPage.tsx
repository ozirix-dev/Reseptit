import { Link } from "react-router-dom";
import { glycemicLoadPilotResults } from "@/generated/glycemic-load-pilot.generated";

const calculated = glycemicLoadPilotResults.filter((result) => result.status === "CALCULATED");
const awaitingSources = glycemicLoadPilotResults.length - calculated.length;

export function GlycemicLoadPilotPage() {
  return <section className="page-section glycemic-pilot">
    <div className="container container--narrow">
      <header className="page-intro glycemic-pilot__intro">
        <p className="eyebrow">Laskennallinen arvio</p>
        <h1>Glykeemisen kuorman pilotti</h1>
        <p className="page-intro__description">Nämä kymmenen reseptikohtaista arviota lasketaan ainesosien imeytyvistä hiilihydraateista ja julkaistuista GI-arvoista. Ne eivät ole valmiin ruoan tai yksittäisen ihmisen verensokerin mittaustuloksia.</p>
      </header>

      <div className="glycemic-pilot__summary" aria-label="Pilotin tilanne">
        <article><strong>{glycemicLoadPilotResults.length}</strong><span>reseptiä pilotissa</span></article>
        <article><strong>{calculated.length}</strong><span>arviota julkaistu</span></article>
        <article><strong>{awaitingSources}</strong><span>odottaa olennaista lähdetietoa</span></article>
      </div>

      <section className="glycemic-pilot__method" aria-labelledby="glycemic-pilot-method">
        <h2 id="glycemic-pilot-method">Miten arvio lasketaan?</h2>
        <p>GK = Σ (ainesosan GI × sen imeytyvät hiilihydraatit annosta kohti) / 100. Hiilihydraatit perustuvat Finelin tietoihin ja reseptin määriin. Alle 1 g imeytyvää hiilihydraattia annosta kohti sisältävät ainesosat ohitetaan summassa.</p>
        <p>GI-arvoa käytetään ensisijaisesti vastaavasta ruoasta. Jos täsmäarvo puuttuu, lähin julkaistu ruoka- tai valmistustapavastine voidaan käyttää arviona. Vastineen tai luokkakeskiarvon käyttö, tietolähde ja luottamustaso kerrotaan reseptikohtaisesti. Maustemäärien vakiot ovat oletuksia, eivät punnittuja määriä.</p>
        <p>Valmiin ruoan todellinen vaste vaihtelee muun muassa raaka-aineen, valmistuksen, annoksen ja ihmisen mukaan. Ainesosien GI-arvojen summa on siksi ohjeellinen arvio; se ei mittaa sekalaisen aterian vastetta. Kun olennaiselle ainesosalle ei löydy julkaistua ja perusteltua arvoa tai määrää, resepti jää ilman kokonaislukua.</p>
        <ul className="glycemic-pilot__sources" aria-label="Käytetyt GI-lähteet">
          <li><a href="https://doi.org/10.1093/ajcn/nqab233">International Tables 2021</a> — ruoka- ja valmistustapakohtaisia mittauksia sekä elintarvikeryhmien keskiarvoja. Arvot on luokiteltu menetelmän laadun perusteella.</li>
          <li><a href="https://glycemicindex.com/gi-search/">Sydneyn yliopiston GI-tietokanta</a> — kansainvälisten GI-tietueiden haku ja lähdetarkistus; julkaisemattomat merkinnät eivät yksin riitä lähteeksi.</li>
          <li><a href="https://doi.org/10.1038/s41387-020-00145-w">Non-western foods -koonti 2021</a> — julkaistujen alueellisten ruoka-arvojen täydentävä koonti.</li>
          <li><a href="https://committee.iso.org/standard/43633.html">ISO 26642:2010</a> — GI-mittausten menetelmä. Se auttaa tulkitsemaan aineiston laatua; tämän sivun arvot eivät ole aterioiden ISO-mittauksia.</li>
          <li><a href="https://doi.org/10.3390/nu12103041">Nutrients 2020, vihannesten GI-katsaus</a> — sisältää sekundaarisia paprika- ja sipuliarvoja, joiden alkuperäinen mittausmenetelmä ei ole tässä varmennettavissa; siksi luottamustaso on matala.</li>
        </ul>
        <p className="glycemic-pilot__source">Esimerkki vastineesta: tomaattimurskan arviota varten käytetään vuoden 2021 taulukon kokonaisen raa’an tomaatin GI-arvoa 22. Valmistustapa poikkeaa, joten lähde näkyy vastineena eikä suorana osumana. Tortillan perunalle käytetään keitetyn perunan arvoa 66 matalalla luottamustasolla, sillä öljyssä kypsennys ja kananmunaan yhdistäminen muuttavat ruoan rakennetta.</p>
      </section>

      <section className="glycemic-pilot__recipes" aria-labelledby="glycemic-pilot-recipes">
        <h2 id="glycemic-pilot-recipes">Pilotin reseptit</h2>
        <ol>
          {glycemicLoadPilotResults.map((result) => <li key={result.recipeId}>
            <Link to={result.routePath}>{result.title}</Link>
            {result.status === "CALCULATED" && result.glycemicLoadPerServing !== null
              ? <span className="glycemic-pilot__status">GK-arvio: {result.glycemicLoadPerServing} / annos — luottamus: {{ HIGH: "korkea", MEDIUM: "keskitasoinen", LOW: "matala" }[result.confidence ?? "LOW"]}</span>
              : <span className="glycemic-pilot__status">Kokonaisarvio odottaa luotettavaa, valmistustapaan sopivaa lähdetietoa.</span>}
          </li>)}
        </ol>
      </section>
    </div>
  </section>;
}

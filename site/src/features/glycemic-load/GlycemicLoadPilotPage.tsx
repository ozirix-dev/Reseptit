import { Link } from "react-router-dom";
import { glycemicLoadPilotResults } from "@/generated/glycemic-load-pilot.generated";

const calculated = glycemicLoadPilotResults.filter((result) => result.status === "CALCULATED");
const awaitingSources = glycemicLoadPilotResults.length - calculated.length;

export function GlycemicLoadPilotPage() {
  return <section className="page-section glycemic-pilot">
    <div className="container container--narrow">
      <header className="page-intro glycemic-pilot__intro">
        <p className="eyebrow">Sisäinen laskentapilotti</p>
        <h1>Glykeemisen kuorman pilotti</h1>
        <p className="page-intro__description">Kokeilemme annoskohtaisen glykeemisen kuorman laskentaa kymmenellä ravintoarvolaskennan pilottireseptillä. Arviot julkaistaan vain, kun laskennan lähdetiedot riittävät.</p>
      </header>

      <div className="glycemic-pilot__summary" aria-label="Pilotin tilanne">
        <article><strong>{glycemicLoadPilotResults.length}</strong><span>reseptiä pilotissa</span></article>
        <article><strong>{calculated.length}</strong><span>laskettavissa</span></article>
        <article><strong>{awaitingSources}</strong><span>odottaa lähdetietoja</span></article>
      </div>

      <section className="glycemic-pilot__method" aria-labelledby="glycemic-pilot-method">
        <h2 id="glycemic-pilot-method">Miten arvio lasketaan?</h2>
        <p>GL = Σ (GI × imeytyvät hiilihydraatit annosta kohti) / 100. Reseptin kokonaisarvio lasketaan vain, kun hiilihydraatteja sisältävien ainesten GI-arvo vastaa sekä ruoka-ainetta että valmistustapaa.</p>
        <p>GL on laskennallinen arvio, ei mittaus aterian vaikutuksesta verensokeriin. Puuttuvaa GI-arvoa ei korvata toisen ruoka-aineen tai valmistustavan arvolla.</p>
        <p>Fineli antaa ravintosisällön ja annosmäärän. GI-arvot haetaan erikseen ruokakohtaisista tutkimuslähteistä. Julkiseen laskelmaan hyväksytään vain vahvan laatutason arvo, jonka ruoka ja valmistustapa vastaavat reseptiä. Täydentävät tai julkaisemattomat tiedot jäävät sisäiseen vertailuun.</p>
        <ul className="glycemic-pilot__sources" aria-label="Käytetyt GI-lähteet">
          <li><a href="https://doi.org/10.1093/ajcn/nqab233">International Tables 2021</a> — ensisijainen lähde; ISO-menetelmän laatukriteerit täyttävät arvot.</li>
          <li><a href="https://glycemicindex.com/gi-search/">Sydneyn yliopiston GI-tietokanta</a> — hakemisto ja lähteiden tarkistus; julkaisemattomat tai puutteellisesti todennettavat tietueet eivät avaa julkista laskelmaa.</li>
          <li><a href="https://doi.org/10.1038/s41387-020-00145-w">Non-western foods -koonti 2021</a> — alueellisten ruokien täydentävä lähde; arvo hyväksytään vahvalle tasolle vain, jos alkuperäistutkimuksen ISO-vastaavuus voidaan varmistaa.</li>
        </ul>
        <p className="glycemic-pilot__source">Esimerkki täsmäytyksestä: vuoden 2021 taulukko raportoi kokonaisen raa’an tomaatin GI-arvoksi 22. Sitä ei käytetä tomaattimurskalle. Samoin keitetyn perunan arvo ei vastaa öljyssä haudutettua, kananmunaan sekoitettua tortilla-perunaa. GL on laskennallinen arvio, ei valmiin aterian mittaustulos.</p>
      </section>

      <section className="glycemic-pilot__recipes" aria-labelledby="glycemic-pilot-recipes">
        <h2 id="glycemic-pilot-recipes">Pilotin reseptit</h2>
        <ol>
          {glycemicLoadPilotResults.map((result) => <li key={result.recipeId}>
            <Link to={result.routePath}>{result.title}</Link>
            {result.status === "CALCULATED" && result.glycemicLoadPerServing !== null
              ? <span className="glycemic-pilot__status">GL-arvio: {result.glycemicLoadPerServing} / annos</span>
              : <span className="glycemic-pilot__status">Kokonaisarvio odottaa luotettavaa, valmistustapaan sopivaa lähdetietoa.</span>}
          </li>)}
        </ol>
      </section>
    </div>
  </section>;
}
